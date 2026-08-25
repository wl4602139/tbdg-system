'use client'

import { useState } from 'react'
import { Gauge, PieChart, Package, TrendingUp, Wand2, Sparkles } from 'lucide-react'
import { Panel, PanelTitle, DataTable, Badge, KpiCard } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { BarGroup } from '@/components/shared/charts'
import { factories } from '@/lib/mock-data'
import { seedFactor } from '@/lib/variant'

const analysisDims: Record<string, string[]> = {
  按工厂: factories,
  按产品: ['SG10 变压器', 'YJV 电缆', 'ZW32 开关', 'LZZBJ 互感器'],
  按能源介质: ['电', '天然气', '蒸汽', '水', '外购热力'],
}
const metricMeta: Record<string, { unit: string; base: number; better: 'low' | 'high' }> = {
  综合能耗: { unit: 'tce', base: 1200, better: 'low' },
  单位产品能耗: { unit: 'tce/万元', base: 0.42, better: 'low' },
  碳排放强度: { unit: 'tCO2/万元', base: 0.62, better: 'low' },
  绿电占比: { unit: '%', base: 38, better: 'high' },
}
const periodStat: Record<string, string[]> = {
  月度: ['1月', '2月', '3月', '4月', '5月', '6月'],
  季度: ['Q1', 'Q2', 'Q3', 'Q4'],
  年度: ['2022', '2023', '2024', '2025', '2026'],
}

export default function SelfPage() {
  const [aDim, setADim] = useState('按工厂')
  const [aMetric, setAMetric] = useState('单位产品能耗')
  const [aPeriod, setAPeriod] = useState('月度')

  const objs = analysisDims[aDim] ?? factories
  const meta = metricMeta[aMetric]
  const genData = objs.map((o, i) => {
    const wobble = 1 + (((seedFactor(aDim, aMetric, aPeriod) * 100 + i * 29) % 30) - 15) / 100
    return { name: String(o).replace(/厂$/, ''), 数值: +(meta.base * wobble).toFixed(meta.base < 10 ? 2 : 0) }
  })
  const vals = genData.map((d) => d.数值)
  const avg = +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(meta.base < 10 ? 2 : 0)
  const bestObj = meta.better === 'low' ? genData[vals.indexOf(Math.min(...vals))] : genData[vals.indexOf(Math.max(...vals))]
  const worstObj = meta.better === 'low' ? genData[vals.indexOf(Math.max(...vals))] : genData[vals.indexOf(Math.min(...vals))]

  return (
    <div className="grid gap-4">
      <Panel>
        <PanelTitle
          title="自助分析"
          subtitle="根据可获取的数据，自由选择分析维度、指标与统计周期，生成对比图表、数据明细与自动评价"
          icon={Wand2}
        />
        <div className="flex flex-wrap items-end gap-3">
          <Select
            label="分析维度"
            value={aDim}
            onChange={setADim}
            options={Object.keys(analysisDims).map((d) => ({ label: d, value: d }))}
          />
          <Select
            label="分析指标"
            value={aMetric}
            onChange={setAMetric}
            options={Object.keys(metricMeta).map((m) => ({ label: m, value: m }))}
          />
          <Select
            label="统计周期"
            value={aPeriod}
            onChange={setAPeriod}
            options={['月度', '季度', '年度'].map((p) => ({ label: p, value: p }))}
          />
          <button className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20">
            <Sparkles className="size-4" /> 生成分析报告
          </button>
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={`平均${aMetric}`} value={String(avg)} unit={meta.unit} icon={Gauge} />
        <KpiCard label="标杆对象" value={bestObj.name} icon={TrendingUp} />
        <KpiCard label="待改进对象" value={worstObj.name} icon={Package} />
        <KpiCard label="对象数量" value={String(objs.length)} unit="个" icon={PieChart} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title={`${aDim} · ${aMetric}对比`} subtitle={`统计周期：${aPeriod}（${meta.unit}）`} icon={Wand2} />
          <BarGroup
            data={genData}
            keys={[{ key: '数值', name: `${aMetric}(${meta.unit})`, color: 'var(--chart-1)' }]}
            nameKey="name"
            height={300}
          />
        </Panel>
        <Panel>
          <PanelTitle title="分析评价" subtitle="系统自动生成" icon={Sparkles} />
          <div className="grid gap-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              本次以 <span className="text-foreground">{aDim.replace('按', '')}</span> 为维度，对
              <span className="text-primary"> {aMetric}</span> 进行 {aPeriod} 分析，共覆盖 {objs.length} 个对象。
            </p>
            <p>
              平均值为 <span className="font-mono text-foreground">{avg} {meta.unit}</span>；标杆对象为
              <span className="text-[var(--success)]"> {bestObj.name}</span>（{bestObj.数值} {meta.unit}），待改进对象为
              <span className="text-[var(--warning)]">{worstObj.name}</span>（{worstObj.数值} {meta.unit}）。
            </p>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelTitle title="分析数据明细" subtitle="可导出用于统计报表与效益评估" icon={Package} />
        <DataTable
          columns={[
            { key: 'name', label: aDim.replace('按', '') },
            { key: '数值', label: `${aMetric}(${meta.unit})`, align: 'right', className: 'font-mono' },
            {
              key: 'gap',
              label: '较均值',
              align: 'right',
              render: (r) => {
                const gap = +(r.数值 - avg).toFixed(meta.base < 10 ? 2 : 0)
                const good = meta.better === 'low' ? gap <= 0 : gap >= 0
                return <span className={good ? 'text-[var(--success)]' : 'text-[var(--warning)]'}>{gap > 0 ? `+${gap}` : gap}</span>
              },
            },
            {
              key: 'eval',
              label: '评价',
              render: (r) => {
                const good = meta.better === 'low' ? r.数值 <= avg : r.数值 >= avg
                return <Badge tone={good ? 'success' : 'warning'}>{good ? '优于均值' : '低于均值'}</Badge>
              },
            },
          ]}
          rows={genData}
        />
      </Panel>
    </div>
  )
}

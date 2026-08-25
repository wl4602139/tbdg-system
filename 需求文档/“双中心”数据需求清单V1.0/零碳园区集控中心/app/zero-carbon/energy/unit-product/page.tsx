'use client'

import { useState } from 'react'
import { Package, TrendingUp, Zap, Cloud, Flame, Droplets, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Tabs } from '@/components/shared/tabs'
import { Select } from '@/components/shared/select'
import { BarGroup, LineTrend } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { EnterpriseCompare } from '@/components/shared/enterprise-compare'
import { factories } from '@/lib/mock-data'
import { seedFactor } from '@/lib/variant'
import { cn } from '@/lib/utils'

const unitByDim: Record<string, { name: string; 单位能耗: number }[]> = {
  型号: [
    { name: 'SG10-2500kVA', 单位能耗: 86.4 },
    { name: 'S13-M-800kVA', 单位能耗: 72.1 },
    { name: 'YJV-8.7/15kV', 单位能耗: 64.8 },
    { name: 'ZW32-12', 单位能耗: 41.2 },
    { name: 'LZZBJ9-10', 单位能耗: 38.6 },
  ],
  种类: [
    { name: '变压器', 单位能耗: 0.42 },
    { name: '电缆', 单位能耗: 0.38 },
    { name: '开关', 单位能耗: 0.31 },
    { name: '互感器', 单位能耗: 0.35 },
    { name: 'GIS/GIL', 单位能耗: 0.47 },
  ],
  产线: [
    { name: '变压器一线', 单位能耗: 0.44 },
    { name: '变压器二线', 单位能耗: 0.4 },
    { name: '电缆拉丝线', 单位能耗: 0.36 },
    { name: '电缆交联线', 单位能耗: 0.39 },
    { name: '开关装配线', 单位能耗: 0.3 },
  ],
}
const dimUnitLabel: Record<string, string> = { 型号: 'kWh/台', 种类: 'tce/万元', 产线: 'tce/万元' }
const productList = ['SG10-2500kVA 变压器', 'YJV-8.7/15kV 电缆', 'ZW32-12 开关', 'LZZBJ9-10 互感器']
const periodStat: Record<string, string[]> = {
  月度: ['1月', '2月', '3月', '4月', '5月', '6月'],
  季度: ['Q1', 'Q2', 'Q3', 'Q4'],
  年度: ['2022', '2023', '2024', '2025', '2026'],
}

const views = [
  { label: '型号 / 种类 / 产线对比', value: 'dimension' },
  { label: '同产品多单位对比', value: 'multi-unit' },
  { label: '同产品多时段对比', value: 'multi-period' },
]

/* 按能源介质拆分的单耗 */
const mediumRows = [
  { name: '单位产品电耗', icon: Zap, value: 42.6, unit: 'kWh/台', target: 40, yoy: 2.1 },
  { name: '单位产品蒸汽消耗', icon: Cloud, value: 0.42, unit: 'GJ/台', target: 0.38, yoy: 3.5 },
  { name: '单位产品天然气消耗', icon: Flame, value: 3.86, unit: 'm³/台', target: 3.6, yoy: 1.8 },
  { name: '单位产品水耗', icon: Droplets, value: 156, unit: 't/台', target: 150, yoy: -2.4 },
]

export default function UnitProductPage() {
  const [factory, setFactory] = useState('全部工厂')
  const [view, setView] = useState('dimension')
  const [dim, setDim] = useState('型号')
  const [product, setProduct] = useState(productList[0])
  const [period, setPeriod] = useState('月度')

  const f = seedFactor(factory)

  const dimData = unitByDim[dim].map((d) => ({ ...d, 单位能耗: +(d.单位能耗 * f).toFixed(2) }))
  const multiUnitData = factories.map((fac, i) => ({
    name: fac.replace(/厂$/, ''),
    单位产品能耗: +(70 + ((seedFactor(product) * 100 + i * 37) % 40)).toFixed(1),
    行业标杆: 82,
  }))
  const multiPeriodData = (periodStat[period] ?? periodStat.月度).map((p, i) => ({
    month: p,
    本期: +(78 + ((seedFactor(product, period) * 100 + i * 19) % 26)).toFixed(1),
    同比: +(84 + ((i * 13) % 18)).toFixed(1),
  }))

  /* 综合能耗 + 产量双轴 */
  const comboData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'].map((m, i) => ({
    month: m,
    综合能耗: Math.round((120 + i * 4) * f),
    产量: Math.round((820 + i * 24) * f),
  }))

  const compareCols = [
    { key: '单位产品能耗', label: '单位产品能耗(kgce/台)', better: 'low' as const },
    { key: '单位产品电耗', label: '单位产品电耗(kWh/台)', better: 'low' as const },
    { key: '单位产品蒸汽', label: '单位产品蒸汽(GJ/台)', better: 'low' as const },
    { key: '单位产品天然气', label: '单位产品天然气(m³/台)', better: 'low' as const },
  ]
  const compareRows = factories.map((fac) => {
    const cf = seedFactor(fac)
    return {
      name: fac.replace(/厂$/, ''),
      单位产品能耗: +(80 + cf * 60).toFixed(1),
      单位产品电耗: +(30 + cf * 30).toFixed(1),
      单位产品蒸汽: +(0.3 + cf * 0.3).toFixed(2),
      单位产品天然气: +(3 + cf * 3).toFixed(2),
    }
  })

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Select label="工厂" value={factory} onChange={setFactory} options={['全部工厂', ...factories].map((x) => ({ label: x, value: x }))} />
            <TimeRange />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="单位产品综合能耗" value={(128.5 * f).toFixed(1)} unit="kgce/台" delta="+4.4%" up icon={Package} />
        <KpiCard label="产品产量" value={(9820 * f).toFixed(0)} unit="台" delta="+6.2%" up icon={TrendingUp} />
        <KpiCard label="单位产品电耗" value={(42.6 * f).toFixed(1)} unit="kWh/台" delta="+2.1%" up icon={Zap} />
        <KpiCard label="异常产品" value="2" unit="个" delta="需关注" up icon={AlertTriangle} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="综合能耗与产量变化" subtitle="双轴 · 综合能耗 / 产量" icon={TrendingUp} />
          <BarGroup
            data={comboData}
            keys={[
              { key: '综合能耗', name: '综合能耗(kgce)', color: 'var(--chart-1)' },
              { key: '产量', name: '产量(台)', color: 'var(--chart-2)' },
            ]}
            nameKey="month"
            height={240}
          />
        </Panel>
        <Panel>
          <PanelTitle title="按能源介质拆分单耗" subtitle="电 / 蒸汽 / 天然气 / 水" icon={Package} />
          <div className="grid gap-2">
            {mediumRows.map((r) => (
              <div key={r.name} className="rounded-lg border border-border bg-panel px-3 py-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><r.icon className="size-3.5 text-primary" />{r.name}</span>
                  <span className={cn('font-mono', r.yoy > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{r.yoy > 0 ? '▲' : '▼'} {Math.abs(r.yoy)}%</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-mono text-lg text-foreground">{r.value}<span className="ml-1 text-xs text-muted-foreground">{r.unit}</span></span>
                  <span className="text-xs text-muted-foreground">目标 {r.target}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4">
        <Tabs tabs={views} value={view} onChange={setView} className="mb-4" />
        <Panel>
          <PanelTitle title="单位产品能耗分析" subtitle="产品型号、种类、产线对比；同产品多家单位对比；同产品不同时间段对比" icon={Package} />

          {view === 'dimension' && (
            <div>
              <div className="mb-4">
                <Select label="分析维度" value={dim} onChange={setDim} options={['型号', '种类', '产线'].map((d) => ({ label: `按${d}`, value: d }))} />
              </div>
              <BarGroup
                data={dimData}
                keys={[{ key: '单位能耗', name: `单位产品能耗(${dimUnitLabel[dim]})`, color: 'var(--chart-1)' }]}
                nameKey="name"
                height={320}
              />
              <p className="mt-3 text-xs text-muted-foreground">按产品{['型号', '种类', '产线'].find((d) => dim === d)}维度对比各对象单位产品能耗，识别高耗对象。</p>
            </div>
          )}

          {view === 'multi-unit' && (
            <div>
              <div className="mb-4">
                <Select label="对比产品" value={product} onChange={setProduct} options={productList.map((p) => ({ label: p, value: p }))} />
              </div>
              <BarGroup
                data={multiUnitData}
                keys={[
                  { key: '单位产品能耗', name: '单位产品能耗(kWh/台)', color: 'var(--chart-1)' },
                  { key: '行业标杆', name: '行业标杆', color: 'var(--chart-4)' },
                ]}
                nameKey="name"
                height={320}
              />
              <p className="mt-3 text-xs text-muted-foreground">同一产品「{product}」在各经营单位间的单位产品能耗对比，快速定位高耗单位与标杆单位。</p>
            </div>
          )}

          {view === 'multi-period' && (
            <div>
              <div className="mb-4 flex flex-wrap gap-3">
                <Select label="对比产品" value={product} onChange={setProduct} options={productList.map((p) => ({ label: p, value: p }))} />
                <Select label="时间粒度" value={period} onChange={setPeriod} options={['月度', '季度', '年度'].map((p) => ({ label: p, value: p }))} />
              </div>
              <LineTrend data={multiPeriodData} keys={['本期', '同比']} height={320} />
              <p className="mt-3 text-xs text-muted-foreground">同一产品「{product}」在不同{period}间的单位产品能耗走势与同比对比。</p>
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-4">
        <Panel>
          <PanelTitle title="单位产品单耗明细" subtitle="按能源介质拆分的单耗，识别异常" icon={Package} action={<Badge tone="primary">颗粒度：型号 / 批次</Badge>} />
          <DataTable
            columns={[
              { key: 'name', label: '单耗指标' },
              { key: 'value', label: '当前值', align: 'right', className: 'font-mono' },
              { key: 'unit', label: '单位', className: 'text-muted-foreground' },
              { key: 'target', label: '目标值', align: 'right', className: 'font-mono' },
              { key: 'yoy', label: '同比', align: 'right', render: (r) => <span className={cn('font-mono', r.yoy > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{r.yoy > 0 ? '▲' : '▼'} {Math.abs(r.yoy)}%</span> },
              { key: 'status', label: '状态', render: (r) => (r.value > r.target ? <Badge tone="warning">超标</Badge> : <Badge tone="success">达标</Badge>) },
            ]}
            rows={mediumRows}
          />
        </Panel>
      </div>

      <div className="mt-4">
        <EnterpriseCompare
          title="各企业单位产品能耗对比"
          cols={compareCols}
          rows={compareRows}
          selected={factory === '全部工厂' ? null : factory.replace(/厂$/, '')}
        />
      </div>
    </div>
  )
}

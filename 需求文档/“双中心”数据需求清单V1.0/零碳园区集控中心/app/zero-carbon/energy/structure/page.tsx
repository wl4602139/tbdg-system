'use client'

import { useState } from 'react'
import { PieChart, TrendingUp, Zap, Flame, Droplets, Cloud, Boxes } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { AreaTrend, Donut, BarGroup } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { EnterpriseCompare } from '@/components/shared/enterprise-compare'
import { factories } from '@/lib/mock-data'
import { seedFactor, vary } from '@/lib/variant'
import { cn } from '@/lib/utils'

const dimLabels: Record<string, string[]> = {
  day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
  year: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
}

/* 用能结构明细（模拟：占比 + 同环比 + 折标煤） */
const structureItems = [
  { name: '电', icon: Zap, ratio: 52, yoy: 7.2, mom: 2.1, amount: 3.2, unit: '亿kWh', tce: 3932 },
  { name: '天然气', icon: Flame, ratio: 21, yoy: 3.5, mom: 1.2, amount: 1.1, unit: '亿m³', tce: 1463 },
  { name: '蒸汽', icon: Cloud, ratio: 16, yoy: 5.1, mom: 0.8, amount: 42, unit: '万t', tce: 540 },
  { name: '水', icon: Droplets, ratio: 7, yoy: -2.4, mom: -0.6, amount: 860, unit: '万m³', tce: 210 },
  { name: '其他', icon: Boxes, ratio: 4, yoy: 1.0, mom: 0.3, amount: 0.6, unit: '万tce', tce: 380 },
]

export default function StructurePage() {
  const [factory, setFactory] = useState('全部工厂')
  const [dim, setDim] = useState('month')

  const f = seedFactor(factory, dim)
  const labels = dimLabels[dim] ?? dimLabels.month

  const trend = labels.map((l, i) => {
    const base = 600 + ((i * 37) % 300)
    return {
      month: l,
      电: Math.round(base * f),
      天然气: Math.round((base * 0.45) * f),
      蒸汽: Math.round((base * 0.3) * f),
      水: Math.round((base * 0.15) * f),
    }
  })
  const donut = structureItems.map((s, i) => ({ name: s.name, value: s.ratio, color: `var(--chart-${(i % 5) + 1})` }))
  const yoyMom = structureItems.map((s) => ({
    name: s.name,
    同比: +s.yoy.toFixed(1),
    环比: +s.mom.toFixed(1),
  }))

  const compareCols = [
    { key: '综合能耗', label: '综合能耗(tce)', better: 'low' as const },
    { key: '用电量', label: '用电量(万kWh)', better: 'low' as const },
    { key: '用气量', label: '用气量(万m³)', better: 'low' as const },
    { key: '用水量', label: '用水量(万m³)', better: 'low' as const },
  ]
  const compareRows = factories.map((fac) => {
    const cf = seedFactor(fac)
    return {
      name: fac.replace(/厂$/, ''),
      综合能耗: +(2.5 + cf * 3).toFixed(1),
      用电量: Math.round(2000 + cf * 3000),
      用气量: Math.round(800 + cf * 1200),
      用水量: Math.round(60 + cf * 120),
    }
  })

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Select label="工厂" value={factory} onChange={setFactory} options={['全部工厂', ...factories].map((x) => ({ label: x, value: x }))} />
            <Select label="维度" value={dim} onChange={setDim} options={[{ label: '按日', value: 'day' }, { label: '按月', value: 'month' }, { label: '按年', value: 'year' }]} />
            <TimeRange />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="综合能耗（折标煤）" value={(15.1 * f).toFixed(1)} unit="万tce" delta="+4.1%" up icon={TrendingUp} />
        <KpiCard label="用电量" value={(3.2 * f).toFixed(1)} unit="亿kWh" delta="+7.2%" up icon={Zap} />
        <KpiCard label="用气量" value={(1.1 * f).toFixed(1)} unit="亿m³" delta="+3.5%" up icon={Flame} />
        <KpiCard label="用水量" value={(860 * f).toFixed(0)} unit="万m³" delta="-2.4%" up={false} icon={Droplets} />
        <KpiCard label="蒸汽用量" value={(42 * f).toFixed(0)} unit="万t" delta="+5.1%" up icon={Cloud} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel>
          <PanelTitle title="用能结构占比" subtitle="各能源介质消耗量占比" icon={PieChart} />
          <Donut data={donut} height={260} />
          <div className="mt-3 grid gap-1.5 text-xs text-muted-foreground">
            {structureItems.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2"><s.icon className="size-3.5 text-primary" />{s.name}</span>
                <span className="font-mono">{s.ratio}%</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="lg:col-span-2">
          <PanelTitle title="各能源介质消耗变化趋势" subtitle={`按${dim === 'day' ? '日' : dim === 'month' ? '月' : '年'}维度 · 占比变化同环比分析`} icon={TrendingUp} />
          <AreaTrend data={trend} keys={['电', '天然气', '蒸汽', '水']} stacked height={320} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="用能结构明细" subtitle="各能源介质本期消耗、占比、同环比与折标煤量" icon={PieChart} action={<Badge tone="primary">只分析不给结论</Badge>} />
          <DataTable
            columns={[
              { key: 'name', label: '能源介质' },
              { key: 'amount', label: '本期消耗', align: 'right', className: 'font-mono' },
              { key: 'unit', label: '单位', className: 'text-muted-foreground' },
              { key: 'ratio', label: '占比', align: 'right', className: 'font-mono' },
              { key: 'yoy', label: '同比', align: 'right', render: (r) => <span className={cn('font-mono', r.yoy > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{r.yoy > 0 ? '▲' : '▼'} {Math.abs(r.yoy)}%</span> },
              { key: 'mom', label: '环比', align: 'right', render: (r) => <span className={cn('font-mono', r.mom > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{r.mom > 0 ? '▲' : '▼'} {Math.abs(r.mom)}%</span> },
              { key: 'tce', label: '折标煤(tce)', align: 'right', className: 'font-mono' },
            ]}
            rows={structureItems}
          />
        </Panel>
        <Panel>
          <PanelTitle title="同环比对比" subtitle="各能源介质占比同比 / 环比" icon={TrendingUp} />
          <BarGroup
            data={yoyMom}
            keys={[
              { key: '同比', name: '同比(%)', color: 'var(--chart-1)' },
              { key: '环比', name: '环比(%)', color: 'var(--chart-3)' },
            ]}
            nameKey="name"
            height={300}
          />
        </Panel>
      </div>

      <div className="mt-4">
        <EnterpriseCompare
          title="各企业用能结构对比"
          cols={compareCols}
          rows={compareRows}
          selected={factory === '全部工厂' ? null : factory.replace(/厂$/, '')}
        />
      </div>
    </div>
  )
}

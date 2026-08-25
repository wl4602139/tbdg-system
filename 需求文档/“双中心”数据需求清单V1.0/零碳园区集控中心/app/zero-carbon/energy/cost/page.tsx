'use client'

import { useState } from 'react'
import { DollarSign, Zap, Flame, Droplets, BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { Donut, BarGroup } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { EnterpriseCompare } from '@/components/shared/enterprise-compare'
import { factories } from '@/lib/mock-data'
import { seedFactor } from '@/lib/variant'
import { cn } from '@/lib/utils'

const dimLabels: Record<string, string[]> = {
  month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
  quarter: ['Q1', 'Q2', 'Q3', 'Q4'],
  year: ['2022', '2023', '2024', '2025', '2026'],
}

export default function CostPage() {
  const [dim, setDim] = useState('month')
  const [factory, setFactory] = useState('全部工厂')

  const f = seedFactor(dim)
  const labels = dimLabels[dim] ?? dimLabels.month

  const trend = labels.map((l, i) => ({
    month: l,
    电费: Math.round((620 + i * 20) * f),
    气费: Math.round((210 + i * 8) * f),
    水费: Math.round((90 + i * 3) * f),
  }))

  const unitCost = factories.map((fac, i) => ({
    name: fac.replace(/厂$/, ''),
    电费: Math.round((2800 + ((seedFactor(fac) * 100 + i * 37) % 40) * 40)),
    气费: Math.round((1000 + ((i * 53) % 30) * 20)),
    水费: Math.round((260 + ((i * 17) % 15) * 8)),
  }))

  const costRows = unitCost.map((u) => ({
    ...u,
    总成本: u.电费 + u.气费 + u.水费,
    同比: +(((seedFactor(u.name) * 100 + 5) % 15) - 5).toFixed(1),
  }))

  const compareCols = [
    { key: '总成本', label: '能源成本(万元)', better: 'low' as const },
    { key: '电费', label: '电费(万元)', better: 'low' as const },
    { key: '气费', label: '气费(万元)', better: 'low' as const },
    { key: '水费', label: '水费(万元)', better: 'low' as const },
  ]

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Select label="工厂" value={factory} onChange={setFactory} options={['全部工厂', ...factories].map((x) => ({ label: x, value: x }))} />
            <Select label="维度" value={dim} onChange={setDim} options={[{ label: '按月', value: 'month' }, { label: '按季', value: 'quarter' }, { label: '按年', value: 'year' }]} />
            <TimeRange />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="能源总成本" value={(3.86 * f).toFixed(2)} unit="亿元" delta="+5.2%" up icon={DollarSign} />
        <KpiCard label="电费" value={(2.41 * f).toFixed(2)} unit="亿元" delta="+6.8%" up icon={Zap} />
        <KpiCard label="天然气费" value={(0.92 * f).toFixed(2)} unit="亿元" delta="+3.5%" up icon={Flame} />
        <KpiCard label="水费" value={(0.53 * f).toFixed(2)} unit="亿元" delta="-1.2%" up={false} icon={Droplets} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel>
          <PanelTitle title="能源成本占比" subtitle="各类能源成本占比" icon={DollarSign} />
          <Donut
            data={[
              { name: '电费', value: 66, color: 'var(--chart-1)' },
              { name: '气费', value: 24, color: 'var(--chart-3)' },
              { name: '水费', value: 10, color: 'var(--chart-2)' },
            ]}
            unit="%"
            height={260}
          />
        </Panel>
        <Panel className="lg:col-span-2">
          <PanelTitle title="能源成本趋势" subtitle="电费 / 气费 / 水费（万元）" icon={BarChart3} />
          <BarGroup data={trend} keys={['电费', '气费', '水费']} stacked height={300} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="各经营单位能源成本明细" subtitle="同时段成本分布，支持同比分析" icon={DollarSign} action={<Badge tone="primary">单位：万元</Badge>} />
          <DataTable
            columns={[
              { key: 'name', label: '经营单位' },
              { key: '电费', label: '电费', align: 'right', className: 'font-mono' },
              { key: '气费', label: '气费', align: 'right', className: 'font-mono' },
              { key: '水费', label: '水费', align: 'right', className: 'font-mono' },
              { key: '总成本', label: '总成本', align: 'right', className: 'font-mono text-primary' },
              { key: '同比', label: '同比', align: 'right', render: (r) => <span className={cn('font-mono', r.同比 > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{r.同比 > 0 ? '▲' : '▼'} {Math.abs(r.同比)}%</span> },
            ]}
            rows={costRows}
          />
        </Panel>
        <Panel>
          <PanelTitle title="同时段成本分布对比" subtitle="不同经营单位成本分布" icon={BarChart3} />
          <BarGroup data={unitCost} keys={['电费', '气费', '水费']} nameKey="name" stacked height={300} />
        </Panel>
      </div>

      <div className="mt-4">
        <EnterpriseCompare
          title="各企业能源成本对比"
          cols={compareCols}
          rows={costRows}
          selected={factory === '全部工厂' ? null : factory.replace(/厂$/, '')}
        />
      </div>
    </div>
  )
}

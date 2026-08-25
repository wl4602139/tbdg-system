'use client'

import { useState } from 'react'
import { Layers, AlertTriangle, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { AreaTrend, Donut, BarGroup } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { carbonTrend } from '@/lib/mock-data'
import { seedFactor, vary } from '@/lib/variant'
import { cn } from '@/lib/utils'

const breakdownByDim: Record<string, { name: string; value: number; color: string }[]> = {
  emission: [
    { name: '外购电力', value: 62, color: 'var(--chart-1)' },
    { name: '燃料燃烧', value: 21, color: 'var(--chart-3)' },
    { name: '外购热力', value: 11, color: 'var(--chart-4)' },
    { name: '其他', value: 6, color: 'var(--chart-5)' },
  ],
  energy: [
    { name: '电力', value: 54, color: 'var(--chart-1)' },
    { name: '天然气', value: 26, color: 'var(--chart-3)' },
    { name: '蒸汽', value: 14, color: 'var(--chart-4)' },
    { name: '其他', value: 6, color: 'var(--chart-5)' },
  ],
  workshop: [
    { name: '铸造车间', value: 38, color: 'var(--chart-1)' },
    { name: '绕线车间', value: 29, color: 'var(--chart-3)' },
    { name: '装配车间', value: 20, color: 'var(--chart-4)' },
    { name: '辅助车间', value: 13, color: 'var(--chart-5)' },
  ],
}

const anomalyRows = [
  { time: '2026-07', amount: '98,200', mom: '+18.6%', type: '排放突增', reason: '变压器厂新增产线投产' },
  { time: '2026-05', amount: '74,500', mom: '-12.3%', type: '排放骤降', reason: '绿电替代率提升' },
  { time: '2026-03', amount: '81,300', mom: '+9.8%', type: '强度偏高', reason: '空压机效率下降' },
]

export default function AnalysisPage() {
  const [dim, setDim] = useState('emission')

  const f = seedFactor(dim)
  const carbonTrendV = vary(carbonTrend, f)
  const breakdown = breakdownByDim[dim] ?? breakdownByDim.emission
  const factoryBar = vary(
    [
      { month: '天津变压器厂', 范围一: 860, 范围二: 2400, 范围三: 600 },
      { month: '衡阳电缆厂', 范围一: 920, 范围二: 2600, 范围三: 640 },
      { month: '沈阳开关厂', 范围一: 520, 范围二: 1400, 范围三: 420 },
      { month: '昌吉线缆厂', 范围一: 780, 范围二: 2100, 范围三: 560 },
    ],
    f,
  )

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Select label="拆解维度" value={dim} onChange={setDim} options={[{ label: '按排放源', value: 'emission' }, { label: '按能源类型', value: 'energy' }, { label: '按车间', value: 'workshop' }]} />
            <TimeRange />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="碳排放总量" value={(86.4 * f).toFixed(1)} unit="万tCO₂" delta="+5.6%" up icon={Layers} />
        <KpiCard label="同比变化" value="+5.6" unit="%" delta="较上年同期" up icon={TrendingUp} />
        <KpiCard label="环比变化" value="+1.8" unit="%" delta="较上月" up icon={TrendingUp} />
        <KpiCard label="异常点" value={anomalyRows.length} unit="个" delta="需关注" up icon={AlertTriangle} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="碳排放累积量趋势" subtitle="按维度拆解碳排构成，累积量趋势分析" icon={Layers} />
          <AreaTrend data={carbonTrendV} keys={['范围一', '范围二', '范围三']} stacked height={300} />
        </Panel>
        <Panel>
          <PanelTitle title="排放构成" subtitle="按当前拆解维度分解" icon={Layers} />
          <Donut data={breakdown} height={300} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="各工厂排放对比" subtitle="识别排放变化异常点及原因" icon={Layers} />
          <BarGroup data={factoryBar} keys={['范围一', '范围二', '范围三']} stacked height={280} />
        </Panel>
        <Panel>
          <PanelTitle title="同环比分析" subtitle="各维度排放量同环比" icon={TrendingUp} />
          <div className="grid gap-2">
            {breakdown.map((b, i) => (
              <div key={b.name} className="flex items-center justify-between rounded-lg border border-border bg-panel px-3 py-2">
                <span className="text-sm text-foreground">{b.name}</span>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className={cn(i % 2 === 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>▲ {(i + 1) * 2.3}%</span>
                  <span className="text-muted-foreground">同比</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel>
          <PanelTitle title="排放异常点识别" subtitle="自动标注异常并归因" icon={AlertTriangle} />
          <DataTable
            columns={[
              { key: 'time', label: '时间' },
              { key: 'amount', label: '排放量(tCO₂)', align: 'right', className: 'font-mono' },
              { key: 'mom', label: '环比变化', align: 'right', render: (r) => <span className="font-mono text-[var(--warning)]">{r.mom}</span> },
              { key: 'type', label: '异常类型', render: (r) => <Badge tone="warning">{r.type}</Badge> },
              { key: 'reason', label: '可能原因', className: 'text-muted-foreground' },
            ]}
            rows={anomalyRows}
          />
        </Panel>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Leaf, Sigma, ShieldCheck, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, KpiCard, DataTable, Badge, StatusBadge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { AreaTrend } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { seedFactor, vary } from '@/lib/variant'
import { carbonTrend } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const accountingRows = [
  { unit: '天津变压器厂', period: '2026 Q2', scope1: 860, scope2: 2400, total: 3260, intensity: 0.62, status: '已核算' },
  { unit: '衡阳电缆厂', period: '2026 Q2', scope1: 920, scope2: 2600, total: 3520, intensity: 0.71, status: '已核算' },
  { unit: '沈阳开关厂', period: '2026 Q2', scope1: 520, scope2: 1400, total: 1920, intensity: 0.48, status: '核算中' },
  { unit: '昌吉线缆厂', period: '2026 Q2', scope1: 780, scope2: 2100, total: 2880, intensity: 0.55, status: '已核算' },
  { unit: '西安互感器厂', period: '2026 Q2', scope1: 460, scope2: 1180, total: 1640, intensity: 0.41, status: '已核算' },
]

const formulaRows = [
  { name: '范围一排放量', formula: 'E₁ = Σ(燃料消耗量ᵢ × 燃料排放因子ᵢ)', status: '校验通过' },
  { name: '范围二排放量', formula: 'E₂ = Σ(外购电量ᵢ × 电力排放因子ᵢ)', status: '校验通过' },
  { name: '组织碳排放总量', formula: 'E = E₁ + E₂ + E₃', status: '校验通过' },
  { name: '单位产值碳强度', formula: 'I产值 = E / 工业增加值', status: '校验通过' },
  { name: '单位产量碳强度', formula: 'I产量 = E / 产品产量', status: '待补录数据' },
]

export default function AccountingPage() {
  const [period, setPeriod] = useState('月度')
  const [factor, setFactor] = useState('2026年国家电网因子')

  const f = seedFactor(period, factor)
  const trendV = vary(carbonTrend, f)

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Select label="核算周期" value={period} onChange={setPeriod} options={['月度', '季度', '年度'].map((p) => ({ label: p, value: p }))} />
            <Select label="排放因子版本" value={factor} onChange={setFactor} options={['2026年国家电网因子', '2025年版本', '2024年版本'].map((x) => ({ label: x, value: x }))} />
            <TimeRange />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="组织碳排放总量" value={(86.4 * f).toFixed(1)} unit="万tCO₂" delta="+5.6%" up icon={Leaf} />
        <KpiCard label="范围一排放" value={(32.1 * f).toFixed(1)} unit="万tCO₂" delta="-2.1%" up={false} icon={Leaf} />
        <KpiCard label="范围二排放" value={(54.3 * f).toFixed(1)} unit="万tCO₂" delta="-5.3%" up={false} icon={Leaf} />
        <KpiCard label="单位产值碳强度" value={(0.62 * f).toFixed(3)} unit="tCO₂/万元" delta="-6.5%" up={false} icon={TrendingUp} />
        <KpiCard label="单位产量碳强度" value={(0.52 * f).toFixed(3)} unit="tCO₂/台" delta="-3.1%" up={false} icon={TrendingUp} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="碳排放量趋势" subtitle="范围一 / 范围二 / 范围三 月度排放（tCO₂）" icon={Leaf} />
          <AreaTrend data={trendV} keys={['范围一', '范围二', '范围三']} stacked height={300} />
        </Panel>
        <Panel>
          <PanelTitle title="核算公式配置" subtitle="可配置 · 可追溯 · 自动校验" icon={Sigma} action={<Badge tone="primary">因子库 {factor}</Badge>} />
          <div className="grid gap-2">
            {formulaRows.map((r) => (
              <div key={r.name} className="rounded-lg border border-border bg-panel px-3 py-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{r.name}</span>
                  <StatusBadge tone={r.status === '校验通过' ? 'ok' : 'warn'}>{r.status}</StatusBadge>
                </div>
                <p className="mt-1.5 font-mono text-xs text-primary">{r.formula}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel>
          <PanelTitle
            title="碳排放在线核算"
            subtitle="获取各工厂能源消耗数据，引用排放因子库计算组织碳排放量及强度，自动校验数据完整性与一致性"
            icon={Leaf}
            action={
              <button className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <ShieldCheck className="size-4" /> 发起核算
              </button>
            }
          />
          <DataTable
            columns={[
              { key: 'unit', label: '经营单位' },
              { key: 'period', label: '核算周期' },
              { key: 'scope1', label: '范围一(tCO₂)', align: 'right', className: 'font-mono' },
              { key: 'scope2', label: '范围二(tCO₂)', align: 'right', className: 'font-mono' },
              { key: 'total', label: '排放总量(tCO₂)', align: 'right', className: 'font-mono text-primary' },
              { key: 'intensity', label: '碳强度', align: 'right', className: 'font-mono' },
              { key: 'status', label: '状态', render: (r) => <span className={cn(r.status === '已核算' ? 'text-[var(--success)]' : 'text-[var(--warning)]')}>{r.status}</span> },
              { key: 'op', label: '操作', render: () => <button className="text-xs text-primary hover:underline">查看核算明细</button> },
            ]}
            rows={accountingRows}
          />
        </Panel>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { TrendingUp, Gauge, Factory, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { BarGroup, LineTrend } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { EnterpriseCompare } from '@/components/shared/enterprise-compare'
import { factories } from '@/lib/mock-data'
import { seedFactor } from '@/lib/variant'
import { cn } from '@/lib/utils'

const periodStat: Record<string, string[]> = {
  月度: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  季度: ['Q1', 'Q2', 'Q3', 'Q4'],
  年度: ['2022', '2023', '2024', '2025', '2026'],
}

export default function UnitOutputPage() {
  const [factory, setFactory] = useState('全部工厂')
  const [period, setPeriod] = useState('月度')

  const f = seedFactor(factory, period)
  const labels = periodStat[period] ?? periodStat.月度

  const outputData = labels.map((p, i) => ({
    month: p,
    产值: Math.round((3200 + ((seedFactor(factory, period) * 100 + i * 53) % 900)) * f),
    能耗: Math.round((1200 + ((i * 37) % 400)) * f),
    单位产值能耗: +(0.36 + (((i * 7) % 12) / 100)).toFixed(2),
  }))

  const unitCompare = factories.map((fac, i) => {
    const val = +(0.3 + ((seedFactor(fac) * 100 + i * 29) % 40) / 100).toFixed(2)
    return { name: fac.replace(/厂$/, ''), 单位产值能耗: val, 目标: 0.35 }
  })

  const rows = unitCompare.map((u) => ({
    ...u,
    偏差: +(((u.单位产值能耗 - u.目标) / u.目标) * 100).toFixed(1),
  }))

  const compareCols = [
    { key: '单位产值能耗', label: '单位产值能耗(tce/万元)', better: 'low' as const },
    { key: '产值', label: '产值(万元)', better: 'high' as const },
  ]
  const compareRows = unitCompare.map((u) => {
    const cf = seedFactor(u.name)
    return { ...u, 产值: Math.round(5000 + cf * 8000) }
  })

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Select label="工厂" value={factory} onChange={setFactory} options={['全部工厂', ...factories].map((x) => ({ label: x, value: x }))} />
            <Select label="统计周期" value={period} onChange={setPeriod} options={['月度', '季度', '年度'].map((p) => ({ label: p, value: p }))} />
            <TimeRange />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="单位产值能耗" value={(0.42 * f).toFixed(3)} unit="tce/万元" delta="-4.2%" up={false} icon={Gauge} />
        <KpiCard label="工业总产值" value={(156.8 * f).toFixed(1)} unit="亿元" delta="+8.6%" up icon={TrendingUp} />
        <KpiCard label="综合能耗" value={(15.1 * f).toFixed(1)} unit="万tce" delta="+4.1%" up icon={Factory} />
        <KpiCard label="异常单位" value="2" unit="家" delta="需关注" up icon={AlertTriangle} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="产值与能耗变化趋势" subtitle={`产值按${period}统计（双轴）`} icon={TrendingUp} />
          <BarGroup
            data={outputData}
            keys={[
              { key: '产值', name: '产值(万元)', color: 'var(--chart-2)' },
              { key: '能耗', name: '综合能耗(tce)', color: 'var(--chart-1)' },
            ]}
            nameKey="month"
            height={300}
          />
        </Panel>
        <Panel>
          <PanelTitle title="单位产值能耗趋势" subtitle={`按${period} · tce/万元`} icon={Gauge} />
          <LineTrend data={outputData} keys={['单位产值能耗']} xKey="month" height={300} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="各经营单位单位产值能耗明细" subtitle="对比目标值，识别异常单位产值能耗" icon={Gauge} action={<Badge tone="primary">颗粒度：按时间</Badge>} />
          <DataTable
            columns={[
              { key: 'name', label: '经营单位' },
              { key: '单位产值能耗', label: '单位产值能耗', align: 'right', className: 'font-mono' },
              { key: '目标', label: '目标值', align: 'right', className: 'font-mono text-muted-foreground' },
              { key: '偏差', label: '偏差', align: 'right', render: (r) => <span className={cn('font-mono', r.偏差 > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{r.偏差 > 0 ? '▲' : '▼'} {Math.abs(r.偏差)}%</span> },
              { key: 'status', label: '状态', render: (r) => (r.单位产值能耗 > r.目标 ? <Badge tone="warning">异常</Badge> : <Badge tone="success">正常</Badge>) },
            ]}
            rows={rows}
          />
        </Panel>
        <Panel>
          <PanelTitle title="单位产值能耗对比" subtitle="各经营单位 vs 目标值" icon={Gauge} />
          <BarGroup
            data={unitCompare}
            keys={[
              { key: '单位产值能耗', name: '单位产值能耗(tce/万元)', color: 'var(--chart-1)' },
              { key: '目标', name: '目标值', color: 'var(--chart-4)' },
            ]}
            nameKey="name"
            height={300}
          />
        </Panel>
      </div>

      <div className="mt-4">
        <EnterpriseCompare
          title="各企业单位产值能耗对比"
          cols={compareCols}
          rows={compareRows}
          selected={factory === '全部工厂' ? null : factory.replace(/厂$/, '')}
        />
      </div>
    </div>
  )
}

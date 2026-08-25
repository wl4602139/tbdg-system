'use client'

import { useState } from 'react'
import { Gauge, Trophy, Target, TrendingUp, Medal, Pencil } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { BarGroup, RadarCompare, LineTrend } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { seedFactor } from '@/lib/variant'
import { cn } from '@/lib/utils'

const radarData = [
  { metric: '综合单耗', value: 82, benchmark: 90 },
  { metric: '绿电占比', value: 88, benchmark: 70 },
  { metric: '碳排强度', value: 76, benchmark: 85 },
  { metric: '水耗', value: 80, benchmark: 82 },
  { metric: '蒸汽单耗', value: 74, benchmark: 80 },
]

const rankRows = [
  { idx: 1, name: '新疆新能源一厂', 单耗: 78, 绿电: 62, 碳强度: 0.29, 梯队: '领跑' },
  { idx: 2, name: '江苏开关厂', 单耗: 85, 绿电: 60, 碳强度: 0.37, 梯队: '领跑' },
  { idx: 3, name: '天津能碳一厂', 单耗: 92, 绿电: 55, 碳强度: 0.4, 梯队: '潜力' },
  { idx: 4, name: '河南互感器厂', 单耗: 95, 绿电: 58, 碳强度: 0.4, 梯队: '潜力' },
  { idx: 5, name: '天津电缆一厂', 单耗: 118, 绿电: 48, 碳强度: 0.51, 梯队: '追赶' },
  { idx: 6, name: '成都线缆厂', 单耗: 128, 绿电: 40, 碳强度: 0.49, 梯队: '追赶' },
  { idx: 7, name: '天津变压器厂', 单耗: 142, 绿电: 35, 碳强度: 0.63, 梯队: '落后' },
  { idx: 8, name: '西安电气厂', 单耗: 158, 绿电: 22, 碳强度: 0.66, 梯队: '落后' },
]

const trendData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'].map((m, i) => ({
  month: m,
  领跑单位均值: +(82 - i * 0.9).toFixed(1),
  潜力单位均值: +(98 - i * 1.1).toFixed(1),
  落后单位均值: +(155 - i * 1.8).toFixed(1),
}))

const benchmarkRows = [
  { name: '综合单耗', self: 0.79, ind: 0.85, rank: '前 15%', trend: '↓ 4.2%' },
  { name: '绿电占比', self: 41.2, ind: 32, rank: '前 8%', trend: '↑ 3.1%' },
  { name: '碳排放强度', self: 0.62, ind: 0.7, rank: '前 20%', trend: '↓ 6.5%' },
]

const toneMap: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
  领跑: 'success',
  潜力: 'info',
  追赶: 'warn',
  落后: 'danger',
}

export default function BenchmarkPage() {
  const [metric, setMetric] = useState('单位产品单耗')
  const [rule, setRule] = useState('升序(低优)')
  const [scope, setScope] = useState('行业对标')

  const f = seedFactor(metric, rule, scope)

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Select label="对标指标" value={metric} onChange={setMetric} options={['单位产品单耗', '绿电占比', '碳排放强度'].map((m) => ({ label: m, value: m }))} />
            <Select label="排名规则" value={rule} onChange={setRule} options={[{ label: '升序(低优)', value: '升序(低优)' }, { label: '降序(高优)', value: '降序(高优)' }]} />
            <Select label="对标范围" value={scope} onChange={setScope} options={[{ label: '行业对标', value: '行业对标' }, { label: '集团内对标', value: '集团内对标' }]} />
            <TimeRange />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="参与对标单位" value="21" unit="家" delta="集团全部工厂" icon={Target} />
        <KpiCard label="领跑单位" value="4" unit="家" delta="Top 20%" up icon={Trophy} />
        <KpiCard label="潜力单位" value="6" unit="家" delta="可提升" icon={Medal} />
        <KpiCard label="落后单位" value="3" unit="家" delta="需重点关注" up icon={Gauge} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle title="关键指标对标" subtitle="本单位 vs 行业标杆（综合评分）" icon={Gauge} />
          <RadarCompare data={radarData} height={300} />
        </Panel>
        <Panel>
          <PanelTitle title="对标排名与趋势" subtitle="自定义对标指标、范围与时间周期" icon={TrendingUp} />
          <DataTable
            columns={[
              { key: 'name', label: '指标' },
              { key: 'self', label: '本单位', className: 'font-mono' },
              { key: 'ind', label: '行业标杆', className: 'font-mono text-muted-foreground' },
              { key: 'rank', label: '排名', render: (r) => <Badge tone="primary">{r.rank}</Badge> },
              { key: 'trend', label: '趋势', render: (r) => <span className="text-[var(--success)]">{r.trend}</span> },
            ]}
            rows={benchmarkRows}
          />
          <button className="mt-4 w-full rounded-md border border-primary/40 bg-primary/10 py-2 text-sm text-primary hover:bg-primary/20">
            <Pencil className="mr-1 inline size-3.5" /> 录入标杆值 / 自定义对标
          </button>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="领跑 / 潜力排名" subtitle={`按${metric} · ${rule} · ${scope}`} icon={Trophy} />
          <DataTable
            columns={[
              { key: 'idx', label: '排名', render: (r) => <span className="font-mono text-primary">{r.idx}</span> },
              { key: 'name', label: '经营单位' },
              { key: '单耗', label: '单耗(kgce/t)', align: 'right', className: 'font-mono' },
              { key: '绿电', label: '绿电占比(%)', align: 'right', className: 'font-mono' },
              { key: '碳强度', label: '碳强度(tCO₂/万元)', align: 'right', className: 'font-mono' },
              { key: '梯队', label: '梯队', render: (r) => <Badge tone={toneMap[r.梯队]}>{r.梯队}</Badge> },
            ]}
            rows={rankRows}
          />
        </Panel>
        <Panel>
          <PanelTitle title="单位排名" subtitle="单耗升序（kgce/t）" icon={Medal} />
          <BarGroup
            data={rankRows.map((r) => ({ name: r.name, 单耗: r.单耗 }))}
            keys={[{ key: '单耗', name: '单耗(kgce/t)', color: 'var(--chart-1)' }]}
            nameKey="name"
            height={340}
          />
        </Panel>
      </div>

      <div className="mt-4">
        <Panel>
          <PanelTitle title="指标趋势对比" subtitle="领跑 / 潜力 / 落后单位均值走势" icon={TrendingUp} />
          <LineTrend data={trendData} keys={['领跑单位均值', '潜力单位均值', '落后单位均值']} height={260} />
        </Panel>
      </div>
    </div>
  )
}

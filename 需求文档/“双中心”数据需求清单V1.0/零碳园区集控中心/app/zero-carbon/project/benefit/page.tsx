'use client'

import { Panel, PanelTitle, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { BarGroup, LineTrend } from '@/components/shared/charts'
import { projectBenefitTrend } from '@/lib/mock-data'
import { TrendingUp, Leaf, DollarSign, Timer } from 'lucide-react'
import { useState } from 'react'

const benefitRows = [
  { name: '屋顶光伏', type: '光伏', invest: 1860, save: 320, reduce: 12000, payback: 5.8, irr: 13.2, cost: 72 },
  { name: '储能电站', type: '储能', invest: 4200, save: 580, reduce: 8000, payback: 7.2, irr: 11.8, cost: 95 },
  { name: '热泵改造', type: '热泵', invest: 680, save: 120, reduce: 5000, payback: 5.6, irr: 12.6, cost: 80 },
  { name: '节能技改', type: '技改', invest: 920, save: 150, reduce: 6000, payback: 6.1, irr: 12.1, cost: 88 },
]

export default function BenefitPage() {
  const [period, setPeriod] = useState('年度')

  const moneyData = [
    { month: '1月', 预期收益: 380, 实际收益: 400 },
    { month: '2月', 预期收益: 360, 实际收益: 390 },
    { month: '3月', 预期收益: 400, 实际收益: 430 },
    { month: '4月', 预期收益: 410, 实际收益: 450 },
    { month: '5月', 预期收益: 420, 实际收益: 470 },
    { month: '6月', 预期收益: 430, 实际收益: 490 },
    { month: '7月', 预期收益: 440, 实际收益: 510 },
    { month: '8月', 预期收益: 450, 实际收益: 520 },
  ]
  const co2Data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'].map((m, i) => ({ month: m, 碳减排: 5200 + i * 200 }))

  return (
    <div className="grid gap-4">
      <Panel className="self-start" bodyClassName="flex items-end gap-3">
        <Select label="统计周期" value={period} onChange={setPeriod} options={['月度', '季度', '年度'].map((p) => ({ label: p, value: p }))} />
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">生成效益评估报告</button>
      </Panel>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="项目综合 IRR" value="12.4" unit="%" delta="高于行业 8%" up icon={TrendingUp} />
        <KpiCard label="平均投资回收期" value="6.2" unit="年" delta="缩短 0.8 年" up={false} icon={Timer} />
        <KpiCard label="年度节费收益" value="4,860" unit="万元" delta="+18%" up icon={DollarSign} />
        <KpiCard label="年度碳减排" value="6.8" unit="万tCO₂" delta="达成 112%" up icon={Leaf} />
        <KpiCard label="减排成本" value="86" unit="元/tCO₂" delta="低于碳价" up={false} icon={Leaf} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle title="经济效益：预期 vs 实际" subtitle="节费 / 收益（万元）" icon={DollarSign} />
          <BarGroup data={moneyData} keys={[{ key: '预期收益', name: '预期收益', color: 'var(--chart-3)' }, { key: '实际收益', name: '实际收益', color: 'var(--chart-1)' }]} nameKey="month" height={300} />
        </Panel>
        <Panel>
          <PanelTitle title="环保效益：碳减排量" subtitle="月度碳减排（tCO₂）" icon={Leaf} />
          <LineTrend data={co2Data} keys={['碳减排']} height={300} />
        </Panel>
      </div>

      <Panel>
        <PanelTitle title="项目效益评估明细" subtitle="内置行业标准计算模型" icon={TrendingUp} />
        <DataTable
          columns={[
            { key: 'name', label: '项目' },
            { key: 'type', label: '类型', render: (r) => <Badge tone="primary">{r.type}</Badge> },
            { key: 'invest', label: '投资(万)', align: 'right', className: 'font-mono' },
            { key: 'save', label: '年节费(万)', align: 'right', className: 'font-mono' },
            { key: 'reduce', label: '年减排(tCO₂)', align: 'right', className: 'font-mono' },
            { key: 'payback', label: '回收期(年)', align: 'right', className: 'font-mono' },
            { key: 'irr', label: 'IRR(%)', align: 'right', className: 'font-mono text-primary' },
            { key: 'cost', label: '减排成本(元/t)', align: 'right', className: 'font-mono' },
            { key: 'status', label: '状态', render: () => <Badge tone="success">达标</Badge> },
          ]}
          rows={benefitRows}
        />
      </Panel>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, TrendingUp, Zap, Flame, Droplets } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, DataTable, Toolbar, KpiCard } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { BarGroup } from '@/components/shared/charts'
import { reportList, energyTrend } from '@/lib/mock-data'
import { seedFactor, vary } from '@/lib/variant'

const periodLabels: Record<string, string[]> = {
  month: ['1月', '2月', '3月', '4月', '5月', '6月'],
  quarter: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
  year: ['2021', '2022', '2023', '2024', '2025', '2026'],
}

export default function UsagePage() {
  const [period, setPeriod] = useState('month')
  const [scope, setScope] = useState('group')
  const [calc, setCalc] = useState('eq')

  const f = seedFactor(period, scope, calc)
  const labels = periodLabels[period] ?? periodLabels.month
  const chartData = vary(energyTrend, f).map((r, i) => ({ ...r, month: labels[i] ?? r.month }))

  return (
    <div className="space-y-5">
      <PageHeader
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Download className="size-4" /> 导出报表
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="综合能耗（折标煤）" value="15.1" unit="万tce" delta="+4.1%" up icon={TrendingUp} />
        <KpiCard label="用电量" value="3.2" unit="亿kWh" delta="+7.2%" up icon={Zap} />
        <KpiCard label="用气量" value="1.1" unit="亿m³" delta="+3.5%" up icon={Flame} />
        <KpiCard label="用水量" value="860" unit="万m³" delta="-2.4%" up={false} icon={Droplets} />
      </div>

      <Panel title="能源用量报表" desc="选择统计周期与范围后生成能源用量报表">
        <Toolbar>
          <Select label="统计周期" value={period} onChange={setPeriod} options={[{ label: '月度', value: 'month' }, { label: '季度', value: 'quarter' }, { label: '年度', value: 'year' }]} />
          <Select label="统计范围" value={scope} onChange={setScope} options={[{ label: '集团汇总', value: 'group' }, { label: '按园区', value: 'park' }, { label: '按工厂', value: 'factory' }]} />
          <Select label="能源折算" value={calc} onChange={setCalc} options={[{ label: '当量值', value: 'eq' }, { label: '等价值', value: 'equiv' }]} />
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">生成报表</button>
        </Toolbar>
        <BarGroup
          data={chartData}
          keys={[
            { key: '电', name: '电(万kWh)', color: 'var(--chart-1)' },
            { key: '气', name: '天然气(万m³)', color: 'var(--chart-3)' },
            { key: '蒸汽', name: '蒸汽(t)', color: 'var(--chart-4)' },
          ]}
        />
      </Panel>

      <Panel title="报表归档" desc="历史报表在线归档，支持下载与对比分析">
        <DataTable
          columns={[
            {
              key: 'name',
              label: '报表名称',
              render: (r) => (
                <span className="inline-flex items-center gap-2">
                  <FileSpreadsheet className="size-4 text-primary" />
                  {r.name}
                </span>
              ),
            },
            { key: 'type', label: '类型' },
            { key: 'period', label: '周期' },
            { key: 'size', label: '大小', align: 'right' },
            { key: 'updated', label: '生成时间' },
            {
              key: 'op',
              label: '操作',
              render: () => (
                <div className="flex gap-3">
                  <button className="text-xs text-primary hover:underline">下载</button>
                  <button className="text-xs text-primary hover:underline">预览</button>
                </div>
              ),
            },
          ]}
          rows={reportList.filter((r) => r.type === '能源用量报表')}
        />
      </Panel>
    </div>
  )
}

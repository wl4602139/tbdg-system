'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, DollarSign, Zap, Flame, Droplets } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, DataTable, Toolbar, KpiCard } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { reportList } from '@/lib/mock-data'

const costRows = [
  { unit: '天津变压器厂', 电费: 2860, 气费: 1240, 水费: 210, 总成本: 4310, 同比: '+5.2%' },
  { unit: '衡阳电缆厂', 电费: 3120, 气费: 1080, 水费: 180, 总成本: 4380, 同比: '+3.8%' },
  { unit: '沈阳开关厂', 电费: 1960, 气费: 760, 水费: 140, 总成本: 2860, 同比: '-1.2%' },
  { unit: '昌吉线缆厂', 电费: 2540, 气费: 920, 水费: 160, 总成本: 3620, 同比: '+2.5%' },
  { unit: '西安互感器厂', 电费: 1580, 气费: 540, 水费: 120, 总成本: 2240, 同比: '-0.8%' },
]

export default function CostPage() {
  const [period, setPeriod] = useState('month')

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
        <KpiCard label="能源总成本" value="3.86" unit="亿元" delta="+5.2%" up icon={DollarSign} />
        <KpiCard label="电费" value="2.41" unit="亿元" delta="+6.8%" up icon={Zap} />
        <KpiCard label="气费" value="0.92" unit="亿元" delta="+3.5%" up icon={Flame} />
        <KpiCard label="水费" value="0.53" unit="亿元" delta="-1.2%" up={false} icon={Droplets} />
      </div>

      <Panel title="能源成本报表" desc="统计各经营单位能源总成本，支持同比环比分析">
        <Toolbar>
          <Select label="统计周期" value={period} onChange={setPeriod} options={[{ label: '月度', value: 'month' }, { label: '季度', value: 'quarter' }, { label: '年度', value: 'year' }]} />
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">生成报表</button>
        </Toolbar>
        <DataTable
          columns={[
            { key: 'unit', label: '经营单位' },
            { key: '电费', label: '电费(万元)', align: 'right', className: 'font-mono' },
            { key: '气费', label: '气费(万元)', align: 'right', className: 'font-mono' },
            { key: '水费', label: '水费(万元)', align: 'right', className: 'font-mono' },
            { key: '总成本', label: '总成本(万元)', align: 'right', className: 'font-mono text-primary' },
            { key: '同比', label: '同比', align: 'right' },
          ]}
          rows={costRows}
        />
      </Panel>

      <Panel title="报表归档" desc="历史报表在线归档，支持下载与对比分析">
        <DataTable
          columns={[
            { key: 'name', label: '报表名称', render: (r) => (
              <span className="inline-flex items-center gap-2"><FileSpreadsheet className="size-4 text-primary" />{r.name}</span>
            ) },
            { key: 'period', label: '周期' },
            { key: 'size', label: '大小', align: 'right' },
            { key: 'updated', label: '生成时间' },
            { key: 'op', label: '操作', render: () => <button className="text-xs text-primary hover:underline">下载</button> },
          ]}
          rows={reportList.filter((r) => r.type === '能源成本报表')}
        />
      </Panel>
    </div>
  )
}

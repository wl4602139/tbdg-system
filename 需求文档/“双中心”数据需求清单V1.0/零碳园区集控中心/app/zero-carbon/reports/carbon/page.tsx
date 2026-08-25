'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, Leaf } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, DataTable, Toolbar, KpiCard } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { reportList } from '@/lib/mock-data'

const carbonRows = [
  { unit: '天津变压器厂', scope1: 860, scope2: 2400, total: 3260, intensity: 0.62 },
  { unit: '衡阳电缆厂', scope1: 920, scope2: 2600, total: 3520, intensity: 0.71 },
  { unit: '沈阳开关厂', scope1: 520, scope2: 1400, total: 1920, intensity: 0.48 },
  { unit: '昌吉线缆厂', scope1: 780, scope2: 2100, total: 2880, intensity: 0.55 },
  { unit: '西安互感器厂', scope1: 460, scope2: 1180, total: 1640, intensity: 0.41 },
]

export default function CarbonPage() {
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
        <KpiCard label="碳排放总量" value="86.4" unit="万tCO₂" delta="+5.6%" up icon={Leaf} />
        <KpiCard label="范围一排放" value="32.1" unit="万tCO₂" delta="-2.1%" up={false} icon={Leaf} />
        <KpiCard label="范围二排放" value="54.3" unit="万tCO₂" delta="-5.3%" up={false} icon={Leaf} />
        <KpiCard label="碳强度" value="0.52" unit="tCO₂/万元" delta="-3.1%" up={false} icon={Leaf} />
      </div>

      <Panel title="碳排放报表" desc="按范围一、范围二生成碳排放总量及强度报表，满足核查与导出要求">
        <Toolbar>
          <Select label="统计周期" value={period} onChange={setPeriod} options={[{ label: '月度', value: 'month' }, { label: '季度', value: 'quarter' }, { label: '年度', value: 'year' }]} />
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">生成报表</button>
        </Toolbar>
        <DataTable
          columns={[
            { key: 'unit', label: '经营单位' },
            { key: 'scope1', label: '范围一(tCO2)', align: 'right', className: 'font-mono' },
            { key: 'scope2', label: '范围二(tCO2)', align: 'right', className: 'font-mono' },
            { key: 'total', label: '排放总量(tCO2)', align: 'right', className: 'font-mono text-primary' },
            { key: 'intensity', label: '碳强度(tCO2/万元)', align: 'right', className: 'font-mono' },
          ]}
          rows={carbonRows}
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
          rows={reportList.filter((r) => r.type === '碳排放报表')}
        />
      </Panel>
    </div>
  )
}

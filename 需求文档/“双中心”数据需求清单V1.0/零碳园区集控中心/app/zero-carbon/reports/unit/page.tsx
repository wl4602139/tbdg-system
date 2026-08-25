'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, Package, Gauge, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, DataTable, Toolbar, KpiCard } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { reportList } from '@/lib/mock-data'

const unitRows = [
  { product: 'SG10-2500kVA 变压器', factory: '天津变压器厂', actual: 86.4, target: 80, yoy: 82, status: '达标' },
  { product: 'S13-M-800kVA 变压器', factory: '天津变压器厂', actual: 72.1, target: 70, yoy: 75, status: '达标' },
  { product: 'YJV-8.7/15kV 电缆', factory: '衡阳电缆厂', actual: 64.8, target: 62, yoy: 68, status: '达标' },
  { product: 'ZW32-12 开关', factory: '沈阳开关厂', actual: 41.2, target: 40, yoy: 39, status: '超标' },
  { product: 'LZZBJ9-10 互感器', factory: '西安互感器厂', actual: 38.6, target: 38, yoy: 40, status: '达标' },
]

export default function UnitPage() {
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
        <KpiCard label="单位产品综合能耗" value="128.5" unit="kgce/台" delta="+4.4%" up icon={Package} />
        <KpiCard label="平均单耗" value="342" unit="kWh/台" delta="-1.2%" up={false} icon={Gauge} />
        <KpiCard label="超标产品" value="2" unit="个" delta="需关注" up icon={AlertTriangle} />
        <KpiCard label="达标率" value="88" unit="%" delta="+2.1%" up icon={CheckCircle2} />
      </div>

      <Panel title="能源单耗报表" desc="按产品大类、工厂、产线生成月度单耗报表，展示实际值、目标值、同比值">
        <Toolbar>
          <Select label="统计周期" value={period} onChange={setPeriod} options={[{ label: '月度', value: 'month' }, { label: '季度', value: 'quarter' }, { label: '年度', value: 'year' }]} />
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">生成报表</button>
        </Toolbar>
        <DataTable
          columns={[
            { key: 'product', label: '产品' },
            { key: 'factory', label: '工厂' },
            { key: 'actual', label: '实际值(kWh/台)', align: 'right', className: 'font-mono' },
            { key: 'target', label: '目标值', align: 'right', className: 'font-mono' },
            { key: 'yoy', label: '同比值', align: 'right', className: 'font-mono text-muted-foreground' },
            { key: 'status', label: '状态', render: (r) => (
              <span className={r.status === '达标' ? 'text-[var(--success)]' : 'text-[var(--warning)]'}>{r.status}</span>
            ) },
          ]}
          rows={unitRows}
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
          rows={reportList.filter((r) => r.type === '能源单耗报表')}
        />
      </Panel>
    </div>
  )
}

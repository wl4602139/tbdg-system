'use client'

import { Panel, DataTable, StatusBadge, Toolbar, KpiCard } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { factorRows } from '@/lib/mock-data'
import { Boxes, Tag, GitBranch, AlertTriangle } from 'lucide-react'

export default function FactorPage() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="因子总数" value="32" unit="项" delta="电力/热力/燃料" icon={Boxes} />
        <KpiCard label="当前版本" value="v2026" unit="" delta="国家电网因子" icon={Tag} />
        <KpiCard label="历史版本" value="4" unit="个" delta="全部可回溯" icon={GitBranch} />
        <KpiCard label="待审批变更" value="2" unit="项" delta="需审核" up icon={AlertTriangle} />
      </div>
      <Panel
      title="碳排因子"
      desc="按年度或版本实现多版本并存与管理，因子变更需填写变更依据并经审批后生效"
      actions={
        <div className="flex gap-2">
          <button className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:border-primary/50">批量导入</button>
          <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ 新增因子</button>
        </div>
      }
    >
      <Toolbar>
        <Select
          label="因子类型"
          options={[
            { label: '全部', value: 'all' },
            { label: '电力', value: 'power' },
            { label: '热力', value: 'heat' },
            { label: '燃料', value: 'fuel' },
            { label: '原材料', value: 'material' },
          ]}
        />
        <Select
          label="版本"
          options={[
            { label: 'v2025.1（当前）', value: 'v2025.1' },
            { label: 'v2024.3', value: 'v2024.3' },
          ]}
        />
      </Toolbar>
      <DataTable
        columns={[
          { key: 'name', label: '因子名称' },
          { key: 'type', label: '类型' },
          { key: 'value', label: '因子值', align: 'right', className: 'font-mono' },
          { key: 'unit', label: '单位' },
          { key: 'version', label: '版本', render: (r) => <StatusBadge tone="info">{r.version}</StatusBadge> },
          { key: 'source', label: '来源' },
          {
            key: 'op',
            label: '操作',
            render: () => (
              <div className="flex gap-3">
                <button className="text-xs text-primary hover:underline">编辑</button>
                <button className="text-xs text-primary hover:underline">版本对比</button>
              </div>
            ),
          },
        ]}
        rows={factorRows}
      />
    </Panel>
    </div>
  )
}

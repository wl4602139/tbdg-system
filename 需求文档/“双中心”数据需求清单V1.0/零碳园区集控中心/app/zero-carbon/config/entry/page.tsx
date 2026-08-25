'use client'

import { Panel, DataTable, Toolbar } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'

export default function EntryPage() {
  return (
    <Panel title="数据录入" desc="开发线下数据管理页面，支持各工厂人工录入无法通过系统接入的数据">
      <Toolbar>
        <Select
          label="数据类型"
          options={[
            { label: '能源用量', value: 'energy' },
            { label: '产量/产值', value: 'output' },
            { label: '碳排活动数据', value: 'carbon' },
          ]}
        />
        <Select
          label="所属工厂"
          options={[
            { label: '天津变压器厂', value: 'tj' },
            { label: '衡阳电缆厂', value: 'hy' },
          ]}
        />
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground">统计期</label>
          <input className="rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" type="month" />
        </div>
      </Toolbar>
      <DataTable
        columns={[
          { key: 'item', label: '录入项' },
          { key: 'unit', label: '单位' },
          { key: 'value', label: '数值', render: () => <input className="w-28 rounded-md border border-input bg-panel px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary" placeholder="请录入" /> },
          { key: 'remark', label: '备注', render: () => <input className="w-48 rounded-md border border-input bg-panel px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary" placeholder="选填" /> },
        ]}
        rows={[
          { item: '外购电量', unit: '万kWh' },
          { item: '天然气用量', unit: '万m³' },
          { item: '外购蒸汽', unit: 't' },
          { item: '工业产值', unit: '万元' },
        ]}
      />
      <div className="mt-4 flex justify-end gap-3">
        <button className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:border-primary/50">暂存</button>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">提交审核</button>
      </div>
    </Panel>
  )
}

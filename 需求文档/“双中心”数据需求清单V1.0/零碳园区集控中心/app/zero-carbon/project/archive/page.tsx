'use client'

import { useState } from 'react'
import { Panel, DataTable, StatusBadge, Toolbar, KpiCard } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { zeroProjects } from '@/lib/mock-data'
import { FolderOpen, TrendingUp, Leaf, Paperclip } from 'lucide-react'

const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '光伏', value: '光伏' },
  { label: '储能', value: '储能' },
  { label: '绿电替代', value: '绿电替代' },
  { label: '热泵', value: '热泵' },
]
const parkOptions = [
  { label: '全部园区', value: 'all' },
  { label: '天津园区', value: '天津园区' },
  { label: '衡阳园区', value: '衡阳园区' },
]
const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '规划中', value: '规划中' },
  { label: '建设中', value: '建设中' },
  { label: '已投运', value: '已投运' },
]

export default function ArchivePage() {
  const [add, setAdd] = useState(false)
  const [pType, setPType] = useState('all')
  const [pPark, setPPark] = useState('all')
  const [pStatus, setPStatus] = useState('all')
  const [newType, setNewType] = useState('光伏')
  const [newPark, setNewPark] = useState('天津园区')

  const projectRows = zeroProjects.filter(
    (r) =>
      (pType === 'all' || r.type?.includes(pType)) &&
      (pPark === 'all' || r.park?.includes(pPark.replace('园区', ''))) &&
      (pStatus === 'all' || r.status === pStatus),
  )

  const invested = zeroProjects.filter((r) => r.status === '已投运').length
  const building = zeroProjects.filter((r) => r.status === '建设中').length

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="零碳项目总数" value={String(zeroProjects.length)} unit="个" delta="本年度 +12" up icon={FolderOpen} />
        <KpiCard label="已投运项目" value={String(invested)} unit="个" delta={`占比 ${Math.round((invested / zeroProjects.length) * 100)}%`} icon={Leaf} />
        <KpiCard label="在建项目" value={String(building)} unit="个" delta="持续推进" icon={TrendingUp} />
        <KpiCard label="累计预期减排" value="18.6" unit="万tCO₂/年" delta="预计 IRR 12.4%" up icon={Leaf} />
      </div>

      <Panel
        title="项目档案库"
        desc="各项目公司在线填报项目基本信息、节能技改、绿电替代、储能配置、投资与收益，自动汇总形成统一项目库"
        actions={
          <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={() => setAdd(true)}>
            + 新增项目
          </button>
        }
      >
        <Toolbar>
          <Select label="项目类型" value={pType} onChange={setPType} options={typeOptions} />
          <Select label="所属园区" value={pPark} onChange={setPPark} options={parkOptions} />
          <Select label="项目状态" value={pStatus} onChange={setPStatus} options={statusOptions} />
        </Toolbar>
        <DataTable
          columns={[
            { key: 'name', label: '项目名称' },
            { key: 'type', label: '类型', render: (r) => <StatusBadge tone="info">{r.type}</StatusBadge> },
            { key: 'park', label: '所属园区' },
            { key: 'invest', label: '投资(万元)', align: 'right', className: 'font-mono' },
            { key: 'reduce', label: '预期减排(t/年)', align: 'right', className: 'font-mono' },
            { key: 'payback', label: '回收期(年)', align: 'right', className: 'font-mono' },
            { key: 'status', label: '状态', render: (r) => <StatusBadge tone={r.status === '已投运' ? 'ok' : r.status === '建设中' ? 'info' : 'muted'}>{r.status}</StatusBadge> },
            { key: 'op', label: '操作', render: () => <button className="text-xs text-primary hover:underline">详情</button> },
          ]}
          rows={projectRows}
        />
      </Panel>

      <Modal open={add} onClose={() => setAdd(false)} title="新增零碳项目" size="xl">
        <div className="grid grid-cols-2 gap-4">
          <Field label="项目名称">
            <input className="w-full rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" placeholder="请输入项目名称" />
          </Field>
          <Select label="项目类型" value={newType} onChange={setNewType} options={[{ label: '光伏', value: '光伏' }, { label: '储能', value: '储能' }, { label: '绿电替代', value: '绿电替代' }, { label: '热泵', value: '热泵' }]} />
          <Select label="所属园区" value={newPark} onChange={setNewPark} options={[{ label: '天津园区', value: '天津园区' }, { label: '衡阳园区', value: '衡阳园区' }]} />
          <Field label="投资额(万元)">
            <input className="w-full rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" type="number" placeholder="0" />
          </Field>
          <Field label="装机容量 / 配置">
            <input className="w-full rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" placeholder="如 8.6 MW / 20 MWh" />
          </Field>
          <Field label="预期减排(t/年)">
            <input className="w-full rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" type="number" placeholder="0" />
          </Field>
          <Field label="预期收益(万/年)">
            <input className="w-full rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" type="number" placeholder="0" />
          </Field>
          <Field label="关键节点日期">
            <input className="w-full rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" type="date" />
          </Field>
          <Field label="节能技改 / 绿电替代说明">
            <textarea className="w-full resize-none rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" placeholder="选填" />
          </Field>
          <Field label="附件（可研报告 / 投资批复）">
            <button className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-3 text-xs text-muted-foreground hover:border-primary/50">
              <Paperclip className="size-3.5" /> 上传附件
            </button>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:border-primary/50" onClick={() => setAdd(false)}>取消</button>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={() => setAdd(false)}>保存项目</button>
        </div>
      </Modal>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

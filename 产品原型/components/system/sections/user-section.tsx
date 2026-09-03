'use client'

import { useMemo, useState } from 'react'
import { UserPlus, Search, RotateCcw } from 'lucide-react'
import { Panel, DataTable, StatusBadge, Badge } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { Select } from '@/components/shared/select'
import { accounts, sysRoles } from '@/lib/mock-data'
import { Field, inputCls, ActionBtn } from '@/components/system/ui'

export function UserSection() {
  const [kw, setKw] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [applied, setApplied] = useState({ kw: '', role: 'all', status: 'all' })

  const [addOpen, setAddOpen] = useState(false)
  const [role, setRole] = useState(sysRoles[1].name)

  const rows = useMemo(
    () =>
      accounts.filter((a) => {
        if (applied.kw && !`${a.name}${a.account}${a.org}`.toLowerCase().includes(applied.kw.toLowerCase())) return false
        if (applied.role !== 'all' && a.role !== applied.role) return false
        if (applied.status !== 'all' && a.status !== applied.status) return false
        return true
      }),
    [applied],
  )

  return (
    <Panel
      title="用户管理"
      icon={UserPlus}
      actions={
        <ActionBtn variant="primary" onClick={() => setAddOpen(true)}>
          <UserPlus className="size-4" /> 新增用户
        </ActionBtn>
      }
    >
      {/* 查询条 */}
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">关键字</span>
          <input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="姓名 / 账号 / 机构" className={`${inputCls} w-52`} />
        </label>
        <div className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">角色</span>
          <Select value={roleFilter} onChange={setRoleFilter} options={[{ label: '全部角色', value: 'all' }, ...sysRoles.map((r) => ({ label: r.name, value: r.name }))]} />
        </div>
        <div className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">状态</span>
          <Select value={statusFilter} onChange={setStatusFilter} options={[{ label: '全部状态', value: 'all' }, { label: '启用', value: '启用' }, { label: '停用', value: '停用' }]} />
        </div>
        <ActionBtn variant="primary" onClick={() => setApplied({ kw, role: roleFilter, status: statusFilter })}>
          <Search className="size-4" /> 查询
        </ActionBtn>
        <ActionBtn
          onClick={() => {
            setKw('')
            setRoleFilter('all')
            setStatusFilter('all')
            setApplied({ kw: '', role: 'all', status: 'all' })
          }}
        >
          <RotateCcw className="size-4" /> 重置
        </ActionBtn>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: '姓名' },
          { key: 'account', label: '账号', className: 'font-mono text-xs' },
          { key: 'role', label: '角色', render: (r) => <Badge tone="primary">{r.role}</Badge> },
          { key: 'org', label: '所属机构' },
          { key: 'scope', label: '数据范围' },
          { key: 'phone', label: '手机号', className: 'font-mono text-xs' },
          {
            key: 'status',
            label: '状态',
            render: (r) => <StatusBadge tone={r.status === '启用' ? 'ok' : 'muted'}>{r.status}</StatusBadge>,
          },
          {
            key: 'op',
            label: '操作',
            render: (r) => (
              <div className="flex gap-3 text-xs">
                <button className="text-primary hover:underline">编辑</button>
                <button className="text-muted-foreground hover:text-foreground">重置密码</button>
                <button className="text-[var(--destructive)] hover:underline">{r.status === '启用' ? '停用' : '启用'}</button>
              </div>
            ),
          },
        ]}
        rows={rows}
      />

      {/* 新增用户 */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="新增用户"
        description="填写用户信息并分配角色与数据范围"
        footer={
          <>
            <ActionBtn onClick={() => setAddOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="primary" onClick={() => setAddOpen(false)}>确认创建</ActionBtn>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="姓名" required><input className={inputCls} placeholder="请输入姓名" /></Field>
            <Field label="登录账号" required><input className={inputCls} placeholder="请输入账号" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="手机号"><input className={inputCls} placeholder="请输入手机号" /></Field>
            <Field label="所属机构" required><input className={inputCls} placeholder="如：衡变本部" /></Field>
          </div>
          <Field label="角色" required>
            <Select className="w-full [&>div]:w-full" value={role} onChange={setRole} options={sysRoles.map((r) => ({ label: r.name, value: r.name }))} />
          </Field>
          <Field label="数据范围" hint="控制该用户可见的组织/园区数据范围">
            <input className={inputCls} placeholder="如：天津园区 / 衡阳电缆厂" />
          </Field>
        </div>
      </Modal>
    </Panel>
  )
}

'use client'

import { useState } from 'react'
import { ShieldCheck, Plus, Users, Check } from 'lucide-react'
import { Panel, Badge } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { sysRoles } from '@/lib/mock-data'
import { Field, inputCls, ActionBtn } from '@/components/system/ui'

/* 一级功能 → 其下的按钮级功能点，用于权限矩阵 */
const PERM_TREE: { module: string; actions: string[] }[] = [
  { module: '权限管控', actions: ['组织管理', '用户管理', '角色与权限', '菜单与功能'] },
  { module: '数据录入', actions: ['录入', '提交', '审核', '退回'] },
  { module: '能碳基础因子管理', actions: ['查看', '新增', '编辑', '停用'] },
  { module: '日志管理', actions: ['查看', '导出'] },
]

export function RoleSection() {
  const [selected, setSelected] = useState(sysRoles[0].id)
  const [addOpen, setAddOpen] = useState(false)
  const role = sysRoles.find((r) => r.id === selected)!

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      {/* 角色列表 */}
      <Panel
        title="角色"
        icon={ShieldCheck}
        actions={
          <ActionBtn variant="primary" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> 新增角色
          </ActionBtn>
        }
      >
        <ul className="flex flex-col gap-2">
          {sysRoles.map((r) => {
            const isSel = r.id === selected
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setSelected(r.id)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    isSel ? 'border-primary/50 bg-primary/10' : 'border-border bg-panel hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium ${isSel ? 'text-primary' : 'text-foreground'}`}>{r.name}</span>
                    {r.builtin && <Badge>内置</Badge>}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Users className="size-3" /> {r.users} 名用户 · {r.scope}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
      </Panel>

      {/* 权限矩阵 */}
      <Panel
        title={`权限配置 · ${role.name}`}
        icon={ShieldCheck}
        actions={<ActionBtn variant="primary"><Check className="size-4" /> 保存授权</ActionBtn>}
      >
        <p className="mb-4 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">{role.desc}</p>
        <div className="flex flex-col gap-3">
          {PERM_TREE.map((m) => {
            const moduleOn = role.perms.includes(m.module)
            return (
              <div key={m.module} className="rounded-lg border border-border bg-panel p-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={moduleOn} className="size-4 accent-[var(--primary)]" />
                  <span className="text-sm font-medium text-foreground">{m.module}</span>
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2 pl-6">
                  {m.actions.map((a) => (
                    <label
                      key={a}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2.5 py-1 text-xs text-foreground"
                    >
                      <input type="checkbox" defaultChecked={moduleOn} className="size-3.5 accent-[var(--primary)]" />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      {/* 新增角色 */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="新增角色"
        description="创建自定义角色并设置数据范围"
        footer={
          <>
            <ActionBtn onClick={() => setAddOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="primary" onClick={() => setAddOpen(false)}>创建并配置权限</ActionBtn>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="角色名称" required><input className={inputCls} placeholder="请输入角色名称" /></Field>
          <Field label="数据范围" required hint="该角色默认可见的数据范围"><input className={inputCls} placeholder="如：所辖园区 / 本经营单位" /></Field>
          <Field label="角色说明"><textarea className={`${inputCls} h-20 py-2`} placeholder="描述该角色的职责" /></Field>
        </div>
      </Modal>
    </div>
  )
}

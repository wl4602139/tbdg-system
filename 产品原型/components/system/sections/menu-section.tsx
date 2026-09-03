'use client'

import { useState } from 'react'
import { LayoutGrid, Plus } from 'lucide-react'
import { Panel, DataTable, Badge } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { Select } from '@/components/shared/select'
import { sysMenus } from '@/lib/mock-data'
import { Field, inputCls, ActionBtn } from '@/components/system/ui'

export function MenuSection() {
  const [addOpen, setAddOpen] = useState(false)
  const [module, setModule] = useState('产品碳足迹集采中心')

  return (
    <Panel
      title="菜单与功能"
      icon={LayoutGrid}
      actions={
        <ActionBtn variant="primary" onClick={() => setAddOpen(true)}>
          <Plus className="size-4" /> 新增菜单
        </ActionBtn>
      }
    >
      <p className="mb-4 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
        统一维护两大业务系统的菜单结构与按钮级功能点，功能点用于角色授权时的细粒度控制。
      </p>
      <DataTable
        columns={[
          { key: 'module', label: '所属系统', render: (r) => <Badge tone="primary">{r.module}</Badge> },
          { key: 'menu', label: '菜单' },
          {
            key: 'actions',
            label: '功能点（按钮级）',
            render: (r) => (
              <div className="flex flex-wrap gap-1.5">
                {r.actions.map((a: string) => (
                  <span key={a} className="rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                    {a}
                  </span>
                ))}
              </div>
            ),
          },
          {
            key: 'op',
            label: '操作',
            render: () => (
              <div className="flex gap-3 text-xs">
                <button className="text-primary hover:underline">编辑</button>
                <button className="text-primary hover:underline">配置功能点</button>
                <button className="text-[var(--destructive)] hover:underline">删除</button>
              </div>
            ),
          },
        ]}
        rows={sysMenus}
      />

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="新增菜单"
        description="为业务系统添加菜单及其按钮级功能点"
        footer={
          <>
            <ActionBtn onClick={() => setAddOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="primary" onClick={() => setAddOpen(false)}>确认新增</ActionBtn>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="所属系统" required>
            <Select
              className="w-full [&>div]:w-full"
              value={module}
              onChange={setModule}
              options={[
                { label: '零碳园区集控中心', value: '零碳园区集控中心' },
                { label: '产品碳足迹集采中心', value: '产品碳足迹集采中心' },
              ]}
            />
          </Field>
          <Field label="菜单名称" required><input className={inputCls} placeholder="请输入菜单名称" /></Field>
          <Field label="路由地址"><input className={`${inputCls} font-mono`} placeholder="/carbon-footprint/..." /></Field>
          <Field label="功能点" hint="多个功能点用逗号分隔，如：查看,新增,编辑,删除">
            <input className={inputCls} placeholder="查看,新增,编辑,删除" />
          </Field>
        </div>
      </Modal>
    </Panel>
  )
}

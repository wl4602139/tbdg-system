'use client'

import { useMemo, useState } from 'react'
import { Building2, ChevronRight, Plus, Pencil, Trash2, Users, Factory } from 'lucide-react'
import { Panel, Badge } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { Select } from '@/components/shared/select'
import { orgTree, type OrgNode } from '@/lib/procurement'
import { Field, inputCls, ActionBtn } from '@/components/system/ui'

type FlatNode = { node: OrgNode; level: number; path: string }

/* 组织树扁平化（用于左侧可展开列表） */
function flatten(nodes: OrgNode[], level = 0, parent = ''): FlatNode[] {
  return nodes.flatMap((n) => {
    const path = parent ? `${parent}/${n.name}` : n.name
    const self: FlatNode = { node: n, level, path }
    return n.children ? [self, ...flatten(n.children, level + 1, path)] : [self]
  })
}

export function OrgSection() {
  const flat = useMemo(() => flatten(orgTree), [])
  const [expanded, setExpanded] = useState<string[]>([orgTree[0].name])
  const [selected, setSelected] = useState<string>(orgTree[0].name)
  const [addOpen, setAddOpen] = useState(false)
  const [parentSel, setParentSel] = useState(orgTree[0].name)

  const current = flat.find((f) => f.path === selected || f.node.name === selected)?.node ?? orgTree[0]

  /* 判断某节点是否可见（其所有祖先都展开） */
  function visible(f: FlatNode) {
    if (f.level === 0) return true
    const segs = f.path.split('/')
    for (let i = 1; i < segs.length; i++) {
      const ancestor = segs.slice(0, i).join('/')
      if (!expanded.includes(ancestor)) return false
    }
    return true
  }

  function toggle(path: string) {
    setExpanded((p) => (p.includes(path) ? p.filter((x) => x !== path) : [...p, path]))
  }

  const childCount = current.children?.length ?? 0

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      {/* 组织树 */}
      <Panel
        title="组织机构树"
        icon={Building2}
        actions={
          <ActionBtn variant="primary" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> 新增机构
          </ActionBtn>
        }
        bodyClassName="max-h-[560px] overflow-y-auto"
      >
        <ul className="flex flex-col gap-0.5">
          {flat.filter(visible).map((f) => {
            const isSel = (f.path === selected) || (f.node.name === selected && f.level === 0)
            const hasChildren = !!f.node.children?.length
            const isOpen = expanded.includes(f.path)
            return (
              <li key={f.path}>
                <div
                  className={`flex items-center gap-1 rounded-md py-1.5 pr-2 text-sm transition-colors ${
                    isSel ? 'bg-primary/12 text-primary' : 'text-foreground hover:bg-accent/40'
                  }`}
                  style={{ paddingLeft: `${f.level * 16 + 8}px` }}
                >
                  {hasChildren ? (
                    <button type="button" onClick={() => toggle(f.path)} className="rounded p-0.5 text-muted-foreground hover:text-foreground">
                      <ChevronRight className={`size-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                  ) : (
                    <span className="ml-[18px]" />
                  )}
                  <button type="button" onClick={() => setSelected(f.path)} className="flex flex-1 items-center gap-2 text-left">
                    {f.level === 0 ? <Factory className="size-3.5 text-primary/80" /> : <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />}
                    <span className="truncate">{f.node.name}</span>
                    {f.node.industry && f.level <= 1 && <Badge>{f.node.industry}</Badge>}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </Panel>

      {/* 机构详情 */}
      <Panel title="机构详情" icon={Users}>
        <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-panel px-4 py-3">
          <div>
            <p className="text-base font-semibold text-foreground">{current.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {current.industry ? `${current.industry}产业 · ` : ''}
              {current.park ?? '电装集团直属'}
            </p>
          </div>
          <div className="flex gap-2">
            <ActionBtn><Pencil className="size-4" /> 编辑</ActionBtn>
            <ActionBtn variant="danger"><Trash2 className="size-4" /> 删除</ActionBtn>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: '机构层级', value: current.industry !== undefined || current.children ? '二级单位' : '经营单位' },
            { label: '下级机构', value: `${childCount} 个` },
            { label: '状态', value: '正常' },
            { label: '所属产业', value: current.industry ?? '综合' },
            { label: '所在园区', value: current.park ?? '—' },
            { label: '机构编码', value: 'ORG-' + current.name.slice(0, 2) },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
              <p className="text-[11px] text-muted-foreground">{k.label}</p>
              <p className="mt-1 truncate text-sm font-medium text-foreground">{k.value}</p>
            </div>
          ))}
        </div>

        {current.children && current.children.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs text-muted-foreground">下级机构（{current.children.length}）</p>
            <div className="flex flex-wrap gap-1.5">
              {current.children.map((c) => (
                <span key={c.name} className="rounded-md border border-border bg-panel px-2 py-1 text-xs text-foreground">
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </Panel>

      {/* 新增机构弹窗 */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="新增组织机构"
        description="选择上级机构并填写机构信息"
        footer={
          <>
            <ActionBtn onClick={() => setAddOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="primary" onClick={() => setAddOpen(false)}>确认创建</ActionBtn>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="上级机构" required>
            <Select
              className="w-full [&>div]:w-full"
              value={parentSel}
              onChange={setParentSel}
              options={flat.filter((f) => f.level <= 1).map((f) => ({ label: '　'.repeat(f.level) + f.node.name, value: f.path }))}
            />
          </Field>
          <Field label="机构名称" required>
            <input className={inputCls} placeholder="请输入机构名称" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="所属产业">
              <Select className="w-full [&>div]:w-full" value="变压器" onChange={() => {}} options={[{ label: '变压器', value: '变压器' }, { label: '线缆', value: '线缆' }, { label: '开关', value: '开关' }, { label: '综合', value: '综合' }]} />
            </Field>
            <Field label="机构编码">
              <input className={inputCls} placeholder="自动生成或手填" />
            </Field>
          </div>
          <Field label="所在园区">
            <input className={inputCls} placeholder="如：特变电工南方输变电产业园" />
          </Field>
        </div>
      </Modal>
    </div>
  )
}

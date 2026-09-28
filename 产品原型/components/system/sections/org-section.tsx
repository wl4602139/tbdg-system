'use client'

import { useMemo, useState } from 'react'
import {
  Building2,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Users,
  Factory,
  CheckCircle2,
  Clock,
  Ban,
  MapPin,
} from 'lucide-react'
import { Panel, Badge } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { Select } from '@/components/shared/select'
import { orgTree, STANDARD_PARKS, type OrgNode } from '@/lib/procurement'
import { Field, inputCls, ActionBtn } from '@/components/system/ui'

type FlatNode = {
  node: OrgNode
  level: number
  path: string
  parentPath?: string
  inheritedIndustry?: string
  inheritedPark?: string
}

/* 组织树扁平化（用于左侧可展开列表与层级解析） */
function flatten(
  nodes: OrgNode[],
  level = 0,
  parent = '',
  inheritedInd = '变压器',
  inheritedPark = '',
): FlatNode[] {
  return nodes.flatMap((n) => {
    const path = parent ? `${parent}/${n.name}` : n.name
    const ind = n.industry ?? inheritedInd
    // 1级节点 (level === 0) 绝不具备所属园区；2、3 级制造工厂节点才具备所属园区
    const park = level === 0 ? undefined : (n.park ?? (inheritedPark || undefined))
    const self: FlatNode = {
      node: n,
      level,
      path,
      parentPath: parent || undefined,
      inheritedIndustry: ind,
      inheritedPark: park,
    }
    return n.children ? [self, ...flatten(n.children, level + 1, path, ind, park ?? '')] : [self]
  })
}

/** 递归更新节点数据 */
function updateNodeInTree(
  nodes: OrgNode[],
  targetPath: string,
  updatedData: Partial<OrgNode>,
  currentPath = '',
): OrgNode[] {
  return nodes.map((node) => {
    const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name
    if (nodePath === targetPath) {
      return { ...node, ...updatedData }
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeInTree(node.children, targetPath, updatedData, nodePath),
      }
    }
    return node
  })
}

/** 递归新增子节点 */
function addChildToTree(
  nodes: OrgNode[],
  parentPath: string,
  newNode: OrgNode,
  currentPath = '',
): OrgNode[] {
  if (parentPath === '__ROOT__') {
    return [...nodes, newNode]
  }
  return nodes.map((node) => {
    const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name
    if (nodePath === parentPath) {
      return {
        ...node,
        children: [...(node.children ?? []), newNode],
      }
    }
    if (node.children) {
      return {
        ...node,
        children: addChildToTree(node.children, parentPath, newNode, nodePath),
      }
    }
    return node
  })
}

/** 递归删除节点 */
function deleteNodeFromTree(
  nodes: OrgNode[],
  targetPath: string,
  currentPath = '',
): OrgNode[] {
  return nodes
    .filter((node) => {
      const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name
      return nodePath !== targetPath
    })
    .map((node) => {
      const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name
      if (node.children) {
        return {
          ...node,
          children: deleteNodeFromTree(node.children, targetPath, nodePath),
        }
      }
      return node
    })
}

export function OrgSection() {
  const [treeData, setTreeData] = useState<OrgNode[]>(orgTree)
  const flat = useMemo(() => flatten(treeData), [treeData])

  const [expanded, setExpanded] = useState<string[]>([treeData[0]?.name ?? ''])
  const [selected, setSelected] = useState<string>(treeData[0]?.name ?? '')

  // 当前选中的节点
  const currentFlat =
    flat.find((f) => f.path === selected || f.node.name === selected) ?? flat[0]
  const current = currentFlat?.node ?? treeData[0]

  // 新增弹窗状态
  const [addOpen, setAddOpen] = useState(false)
  const [addParent, setAddParent] = useState(treeData[0]?.name ?? '__ROOT__')
  const [addName, setAddName] = useState('')
  const [addCode, setAddCode] = useState('')
  const [addIndustry, setAddIndustry] = useState('变压器')
  const [addPark, setAddPark] = useState(STANDARD_PARKS[0])
  const [addIsCustomPark, setAddIsCustomPark] = useState(false)
  const [addStatus, setAddStatus] = useState('正常')

  // 编辑弹窗状态
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editCode, setEditCode] = useState('')
  const [editIndustry, setEditIndustry] = useState('变压器')
  const [editPark, setEditPark] = useState('')
  const [editIsCustomPark, setEditIsCustomPark] = useState(false)
  const [editStatus, setEditStatus] = useState('正常')

  // 删除确认弹窗
  const [deleteOpen, setDeleteOpen] = useState(false)

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

  // 打开新增弹窗
  function handleOpenAdd() {
    const defaultParent =
      currentFlat && currentFlat.level <= 1
        ? currentFlat.path
        : (currentFlat?.parentPath ?? treeData[0]?.name ?? '__ROOT__')
    const parentNode = flat.find((f) => f.path === defaultParent)
    setAddParent(defaultParent)
    setAddName('')
    setAddCode('')
    setAddIndustry(parentNode?.node.industry ?? parentNode?.inheritedIndustry ?? '变压器')
    const defaultPark =
      parentNode?.node.park ?? parentNode?.inheritedPark ?? STANDARD_PARKS[0]
    setAddPark(defaultPark)
    setAddIsCustomPark(!STANDARD_PARKS.includes(defaultPark))
    setAddStatus('正常')
    setAddOpen(true)
  }

  // 改变上级机构时联动产业与所属园区
  function handleAddParentChange(val: string) {
    setAddParent(val)
    if (val === '__ROOT__') {
      setAddIndustry('变压器')
      setAddPark(STANDARD_PARKS[0])
      setAddIsCustomPark(false)
    } else {
      const p = flat.find((f) => f.path === val)
      if (p) {
        if (p.node.industry || p.inheritedIndustry) {
          setAddIndustry(p.node.industry ?? p.inheritedIndustry ?? '变压器')
        }
        const pPark = p.node.park ?? p.inheritedPark
        if (pPark) {
          setAddPark(pPark)
          setAddIsCustomPark(!STANDARD_PARKS.includes(pPark))
        }
      }
    }
  }

  // 确认新增
  function handleSaveAdd() {
    if (!addName.trim()) {
      alert('请输入机构名称')
      return
    }
    const autoCode =
      addCode.trim() ||
      `ORG-${addName.slice(0, 2).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`
    const newNode: OrgNode = {
      name: addName.trim(),
      code: autoCode,
      industry: addIndustry,
      park: addParent === '__ROOT__' ? undefined : (addPark.trim() || undefined),
      status: addStatus,
      unconnected: addStatus === '待接入',
    }
    setTreeData((prev) => addChildToTree(prev, addParent, newNode))
    const newPath =
      addParent === '__ROOT__' ? addName.trim() : `${addParent}/${addName.trim()}`
    if (addParent !== '__ROOT__') {
      setExpanded((p) => (p.includes(addParent) ? p : [...p, addParent]))
    }
    setSelected(newPath)
    setAddOpen(false)
  }

  // 打开编辑弹窗
  function handleOpenEdit() {
    setEditName(current.name)
    setEditCode(current.code ?? ('ORG-' + current.name.slice(0, 2)))
    setEditIndustry(current.industry ?? currentFlat?.inheritedIndustry ?? '变压器')
    const curPark = current.park || currentFlat?.inheritedPark || STANDARD_PARKS[0]
    setEditPark(curPark)
    setEditIsCustomPark(curPark !== '' && !STANDARD_PARKS.includes(curPark))
    const curStatus = current.status ?? (current.unconnected ? '待接入' : '正常')
    setEditStatus(curStatus)
    setEditOpen(true)
  }

  // 确认编辑
  function handleSaveEdit() {
    if (!editName.trim()) {
      alert('请输入机构名称')
      return
    }
    const updatedData: Partial<OrgNode> = {
      name: editName.trim(),
      code: editCode.trim() || undefined,
      industry: editIndustry,
      park: currentFlat?.level === 0 ? undefined : (editPark.trim() || undefined),
      status: editStatus,
      unconnected: editStatus === '待接入',
    }
    setTreeData((prev) => updateNodeInTree(prev, currentFlat.path, updatedData))
    if (editName.trim() !== current.name) {
      const parent = currentFlat.parentPath
      const newPath = parent ? `${parent}/${editName.trim()}` : editName.trim()
      setSelected(newPath)
    }
    setEditOpen(false)
  }

  // 确认删除
  function handleConfirmDelete() {
    if (flat.length <= 1) {
      alert('至少保留一个组织机构！')
      return
    }
    setTreeData((prev) => deleteNodeFromTree(prev, currentFlat.path))
    const fallback =
      currentFlat.parentPath || treeData.find((n) => n.name !== current.name)?.name || ''
    setSelected(fallback)
    setDeleteOpen(false)
  }

  // 计算当前与新增时的层级文字
  const levelText =
    currentFlat?.level === 0
      ? '二级单位 (经营单位)'
      : currentFlat?.level === 1
        ? '三级单位 (制造工厂)'
        : '四级单位 (生产车间/制造工段)'

  const selectedParentNode = flat.find((f) => f.path === addParent)
  const addLevelText =
    addParent === '__ROOT__'
      ? '二级单位 (经营单位)'
      : selectedParentNode?.level === 0
        ? '三级单位 (制造工厂)'
        : '四级单位 (生产车间/制造工段)'

  const statusText = current.status ?? (current.unconnected ? '待接入' : '正常')
  const industryText = current.industry ?? currentFlat?.inheritedIndustry ?? '综合'
  const displayPark = current.park || currentFlat?.inheritedPark || '—'
  const childCount = current.children?.length ?? 0

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      {/* 组织树 */}
      <Panel
        title="组织机构树"
        icon={Building2}
        actions={
          <ActionBtn variant="primary" onClick={handleOpenAdd}>
            <Plus className="size-4" /> 新增机构
          </ActionBtn>
        }
        bodyClassName="max-h-[560px] overflow-y-auto"
      >
        <ul className="flex flex-col gap-0.5">
          {flat.filter(visible).map((f) => {
            const isSel = f.path === selected || (f.node.name === selected && f.level === 0)
            const hasChildren = !!f.node.children?.length
            const isOpen = expanded.includes(f.path)
            return (
              <li key={f.path}>
                <div
                  className={`flex items-center gap-1 rounded-md py-1.5 pr-2 text-sm transition-colors ${
                    isSel ? 'bg-primary/12 text-primary font-medium' : 'text-foreground hover:bg-accent/40'
                  }`}
                  style={{ paddingLeft: `${f.level * 16 + 8}px` }}
                >
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggle(f.path)}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <ChevronRight
                        className={`size-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                      />
                    </button>
                  ) : (
                    <span className="ml-[18px]" />
                  )}
                  <button
                    type="button"
                    onClick={() => setSelected(f.path)}
                    className="flex flex-1 items-center gap-2 text-left cursor-pointer min-w-0"
                  >
                    {f.level === 0 ? (
                      <Factory className="size-3.5 text-primary/80 shrink-0" />
                    ) : f.level === 1 ? (
                      <Building2 className="size-3.5 text-sky-500/80 shrink-0" />
                    ) : (
                      <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    )}
                    <span className="truncate">{f.node.name}</span>
                    {f.node.industry && f.level <= 1 && (
                      <Badge className="shrink-0 text-[10px]">{f.node.industry}</Badge>
                    )}
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
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-foreground">{current.name}</p>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  statusText === '正常'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : statusText === '待接入'
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                }`}
              >
                {statusText === '正常' ? (
                  <CheckCircle2 className="size-3" />
                ) : statusText === '待接入' ? (
                  <Clock className="size-3" />
                ) : (
                  <Ban className="size-3" />
                )}
                {statusText}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
              <span>{industryText}产业</span>
              {currentFlat?.level > 0 && (current.park || currentFlat?.inheritedPark) && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 font-medium text-primary">
                    <MapPin className="size-3" />
                    {current.park || currentFlat?.inheritedPark}
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <ActionBtn onClick={handleOpenEdit}>
              <Pencil className="size-4" /> 编辑
            </ActionBtn>
            <ActionBtn variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="size-4" /> 删除
            </ActionBtn>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(currentFlat?.level === 0
            ? [
                { label: '机构层级', value: levelText },
                { label: '下级机构', value: `${childCount} 个` },
                { label: '状态', value: statusText },
                { label: '所属产业', value: industryText },
                { label: '管辖范围', value: '统筹下辖各产业园区' },
                { label: '机构编码', value: current.code || ('ORG-' + current.name.slice(0, 2)) },
              ]
            : [
                { label: '机构层级', value: levelText },
                { label: '下级机构', value: `${childCount} 个` },
                { label: '状态', value: statusText },
                { label: '所属产业', value: industryText },
                { label: '所属园区', value: displayPark, highlight: true },
                { label: '机构编码', value: current.code || ('ORG-' + current.name.slice(0, 2)) },
              ]
          ).map((k) => (
            <div
              key={k.label}
              className={`rounded-lg border px-3 py-2.5 transition-colors ${
                k.highlight
                  ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border bg-secondary/30'
              }`}
            >
              <p className="text-[11px] text-muted-foreground">{k.label}</p>
              <p
                className={`mt-1 truncate text-sm font-medium ${
                  k.highlight ? 'text-primary font-semibold' : 'text-foreground'
                }`}
                title={k.value}
              >
                {k.value}
              </p>
            </div>
          ))}
        </div>

        {current.children && current.children.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs text-muted-foreground">下级机构（{current.children.length}）</p>
            <div className="flex flex-wrap gap-1.5">
              {current.children.map((c) => {
                const childPath = `${currentFlat.path}/${c.name}`
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      if (!expanded.includes(currentFlat.path)) {
                        setExpanded((p) => [...p, currentFlat.path])
                      }
                      setSelected(childPath)
                    }}
                    className="group flex items-center gap-1.5 rounded-md border border-border bg-panel px-2.5 py-1 text-xs text-foreground transition-all hover:border-primary/60 hover:bg-primary/5 hover:text-primary cursor-pointer"
                  >
                    <span>{c.name}</span>
                    {c.park && (
                      <span className="text-[10px] text-muted-foreground group-hover:text-primary/70">
                        ({c.park.replace('特变电工', '')})
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </Panel>

      {/* 新增机构弹窗 */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="新增组织机构"
        description="支持在指定层级新增经营单位或制造工厂，并维护所属实体产业园区"
        footer={
          <>
            <ActionBtn onClick={() => setAddOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="primary" onClick={handleSaveAdd}>
              确认创建
            </ActionBtn>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="上级机构" required>
            <Select
              className="w-full [&>div]:w-full"
              value={addParent}
              onChange={handleAddParentChange}
              options={[
                { label: '作为顶级 (二级单位 · 经营单位)', value: '__ROOT__' },
                ...flat
                  .filter((f) => f.level <= 1)
                  .map((f) => ({
                    label: `${'　'.repeat(f.level)}${f.node.name} (${f.level === 0 ? '二级经营单位' : '三级制造工厂'})`,
                    value: f.path,
                  })),
              ]}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="机构层级 (自动计算)">
              <div className="flex h-9 items-center rounded-md border border-border bg-secondary/40 px-3 text-sm font-medium text-foreground">
                {addLevelText}
              </div>
            </Field>
            <Field label="机构名称" required>
              <input
                className={inputCls}
                placeholder="如：特种变压器智能制造工厂"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="所属产业">
              <Select
                className="w-full [&>div]:w-full"
                value={addIndustry}
                onChange={setAddIndustry}
                options={[
                  { label: '变压器', value: '变压器' },
                  { label: '线缆', value: '线缆' },
                  { label: '开关', value: '开关' },
                  { label: '综合', value: '综合' },
                ]}
              />
            </Field>
            <Field label="机构编码">
              <input
                className={inputCls}
                placeholder="如：ORG-SB-06（留空自动生成）"
                value={addCode}
                onChange={(e) => setAddCode(e.target.value)}
              />
            </Field>
          </div>

          {/* 所属园区：2、3级制造工厂节点新增必填/可选标准园区与自定义模式；1级经营单位不配置所属园区 */}
          {addParent !== '__ROOT__' && (
            <Field
              label="所属园区"
              required
              hint="2、3 级节点对应之实体产业园区，显示当前工厂所属园区"
            >
              {addIsCustomPark ? (
                <div className="flex gap-2 items-center">
                  <input
                    className={inputCls}
                    placeholder="请输入自定义园区名称（如：特变电工数字产业园）"
                    value={addPark}
                    onChange={(e) => setAddPark(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAddIsCustomPark(false)
                      setAddPark(STANDARD_PARKS[0])
                    }}
                    className="shrink-0 text-xs text-primary hover:underline cursor-pointer"
                  >
                    从标准园区选择
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Select
                    className="w-full [&>div]:w-full"
                    value={addPark}
                    onChange={(v) => {
                      if (v === '__CUSTOM__') {
                        setAddIsCustomPark(true)
                        setAddPark('')
                      } else {
                        setAddPark(v)
                      }
                    }}
                    options={[
                      ...STANDARD_PARKS.map((p) => ({ label: p, value: p })),
                      { label: '✏️ 其他 (自定义输入)...', value: '__CUSTOM__' },
                    ]}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAddIsCustomPark(true)
                      setAddPark('')
                    }}
                    className="shrink-0 text-xs text-primary hover:underline cursor-pointer"
                  >
                    自定义输入
                  </button>
                </div>
              )}
            </Field>
          )}

          <Field label="机构状态">
            <Select
              className="w-full [&>div]:w-full"
              value={addStatus}
              onChange={setAddStatus}
              direction="up"
              options={[
                { label: '正常', value: '正常' },
                { label: '待接入', value: '待接入' },
                { label: '停用', value: '停用' },
              ]}
            />
          </Field>
        </div>
      </Modal>

      {/* 编辑机构弹窗 */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="编辑组织机构"
        description={`正在编辑：${current.name}（${levelText}）`}
        footer={
          <>
            <ActionBtn onClick={() => setEditOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="primary" onClick={handleSaveEdit}>
              保存修改
            </ActionBtn>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="机构名称" required>
              <input
                className={inputCls}
                placeholder="请输入机构名称"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Field>
            <Field label="机构层级 (当前)">
              <div className="flex h-9 items-center rounded-md border border-border bg-secondary/40 px-3 text-sm font-medium text-foreground">
                {levelText}
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="所属产业">
              <Select
                className="w-full [&>div]:w-full"
                value={editIndustry}
                onChange={setEditIndustry}
                options={[
                  { label: '变压器', value: '变压器' },
                  { label: '线缆', value: '线缆' },
                  { label: '开关', value: '开关' },
                  { label: '综合', value: '综合' },
                ]}
              />
            </Field>
            <Field label="机构编码">
              <input
                className={inputCls}
                placeholder="机构编码"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
              />
            </Field>
          </div>

          {/* 所属园区：2、3级节点编辑时回填当前园区并支持修改；1级经营单位不配置与维护所属园区 */}
          {currentFlat?.level > 0 && (
            <Field
              label="所属园区"
              required
              hint="显示与配置当前工厂所属园区，可在右侧机构详情中实时生效"
            >
              {editIsCustomPark ? (
                <div className="flex gap-2 items-center">
                  <input
                    className={inputCls}
                    placeholder="请输入自定义园区名称"
                    value={editPark}
                    onChange={(e) => setEditPark(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditIsCustomPark(false)
                      setEditPark(STANDARD_PARKS[0])
                    }}
                    className="shrink-0 text-xs text-primary hover:underline cursor-pointer"
                  >
                    从标准园区选择
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Select
                    className="w-full [&>div]:w-full"
                    value={editPark}
                    onChange={(v) => {
                      if (v === '__CUSTOM__') {
                        setEditIsCustomPark(true)
                        setEditPark('')
                      } else {
                        setEditPark(v)
                      }
                    }}
                    options={[
                      ...STANDARD_PARKS.map((p) => ({ label: p, value: p })),
                      { label: '✏️ 其他 (自定义输入)...', value: '__CUSTOM__' },
                    ]}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditIsCustomPark(true)
                      setEditPark('')
                    }}
                    className="shrink-0 text-xs text-primary hover:underline cursor-pointer"
                  >
                    自定义输入
                  </button>
                </div>
              )}
            </Field>
          )}

          <Field label="机构状态">
            <Select
              className="w-full [&>div]:w-full"
              value={editStatus}
              onChange={setEditStatus}
              direction="up"
              options={[
                { label: '正常', value: '正常' },
                { label: '待接入', value: '待接入' },
                { label: '停用', value: '停用' },
              ]}
            />
          </Field>
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="删除组织机构"
        description={`确定要删除「${current.name}」吗？此操作无法撤销。`}
        footer={
          <>
            <ActionBtn onClick={() => setDeleteOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="danger" onClick={handleConfirmDelete}>
              确认删除
            </ActionBtn>
          </>
        }
      >
        <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 p-4 text-sm text-foreground space-y-2">
          <p className="font-medium text-[var(--destructive)]">警告：</p>
          <p>您即将删除组织机构：<span className="font-semibold">{current.name}</span></p>
          {childCount > 0 && (
            <p className="text-muted-foreground">
              注意：该机构下包含 <span className="font-semibold text-[var(--destructive)]">{childCount}</span> 个下级机构，删除后所有下级机构也将被一并移除。
            </p>
          )}
        </div>
      </Modal>
    </div>
  )
}

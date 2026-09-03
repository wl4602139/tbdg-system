'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Panel, Toolbar, DataTable, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import {
  factorSourceOptions,
  rawMaterialFactors,
  rawMaterialIndustries,
  powerFactors,
  powerRegions,
  powerSources,
  energyActivityFactors,
  energyActivityCategories,
  coalCoefFactors,
  factorSetProducts,
  type FactorVersion,
} from '@/lib/mock-data'
import { Plus, Search, Pencil, Trash2, History, Tag, X, Package, Lock, Undo2, Layers, Building2 } from 'lucide-react'

/* ---------- 通用类型 ---------- */
type FieldDef = { key: string; label: string; type: 'text' | 'number' | 'select'; options?: string[]; mono?: boolean; placeholder?: string }
type ColKind = 'source' | 'version' | 'value' | 'text'
type ColDef = { key: string; label: string; align?: 'right'; mono?: boolean; kind?: ColKind }
type FactorRow = Record<string, any> & {
  id: string
  source: string
  version: string
  value: number
  defaultValue: number
  updated: string
  history: FactorVersion[]
}
type ModuleConfig = {
  title: string
  desc: string
  idPrefix: string
  productSet?: boolean
  filterKey?: string
  filterLabel?: string
  filterOptions?: string[]
  searchKeys: string[]
  columns: ColDef[]
  fields: FieldDef[]
}

/* 仅原材料碳排因子在此做全量维护，其余因子只读展示（维护在系统管理·能碳基础因子管理） */
const EDITABLE_TAB = 'material'

/* ---------- 模块配置（去掉 status 列/字段，因子值改为当前值/默认值对比） ---------- */
const CONFIGS: Record<string, { data: FactorRow[]; cfg: ModuleConfig }> = {
  material: {
    data: rawMaterialFactors as unknown as FactorRow[],
    cfg: {
      title: '原材料碳排因子',
      desc: '原材料碳排因子在此进行全量与全流程管理：增删改查、版本更新与版本回滚；因子值同时展示当前值与默认值',
      idPrefix: 'RM',
      productSet: true,
      filterKey: 'industry',
      filterLabel: '适用产业',
      filterOptions: rawMaterialIndustries,
      searchKeys: ['name'],
      columns: [
        { key: 'name', label: '原材料名称' },
        { key: 'industry', label: '适用产业' },
        { key: 'value', label: '因子值（当前/默认）', align: 'right', kind: 'value' },
        { key: 'unit', label: '单位' },
        { key: 'source', label: '数据来源', kind: 'source' },
        { key: 'version', label: '版本', kind: 'version' },
      ],
      fields: [
        { key: 'name', label: '原材料名称', type: 'text', placeholder: '如：取向硅钢片' },
        { key: 'industry', label: '适用产业', type: 'select', options: rawMaterialIndustries },
        { key: 'value', label: '因子值', type: 'number', mono: true },
        { key: 'unit', label: '单位', type: 'text', placeholder: 'kgCO2e/kg' },
      ],
    },
  },
  power: {
    data: powerFactors as unknown as FactorRow[],
    cfg: {
      title: '电力碳排因子',
      desc: '只读展示与查询，支持版本查看；维护在「系统管理 · 能碳基础因子管理 · 电力碳排因子」',
      idPrefix: 'PW',
      filterKey: 'region',
      filterLabel: '区域电网',
      filterOptions: powerRegions,
      searchKeys: ['region', 'powerSource'],
      columns: [
        { key: 'region', label: '区域电网' },
        { key: 'powerSource', label: '电力来源' },
        { key: 'value', label: '因子值（当前/默认）', align: 'right', kind: 'value' },
        { key: 'unit', label: '单位' },
        { key: 'source', label: '数据来源', kind: 'source' },
        { key: 'version', label: '版本', kind: 'version' },
      ],
      fields: [],
    },
  },
  energy: {
    data: energyActivityFactors as unknown as FactorRow[],
    cfg: {
      title: '能源活动碳排因子',
      desc: '只读展示与查询，支持版本查看；维护在「系统管理 · 能碳基础因子管理 · 能源活动碳排因子」',
      idPrefix: 'EA',
      filterKey: 'category',
      filterLabel: '能源类别',
      filterOptions: energyActivityCategories,
      searchKeys: ['name'],
      columns: [
        { key: 'name', label: '能源/活动名称' },
        { key: 'category', label: '能源类别' },
        { key: 'value', label: '因子值（当前/默认）', align: 'right', kind: 'value' },
        { key: 'unit', label: '单位' },
        { key: 'source', label: '数据来源', kind: 'source' },
        { key: 'version', label: '版本', kind: 'version' },
      ],
      fields: [],
    },
  },
  coal: {
    data: coalCoefFactors as unknown as FactorRow[],
    cfg: {
      title: '折标煤系数库',
      desc: '只读展示与查询，支持版本查看；维护在「系统管理 · 能碳基础因子管理 · 折标煤系数库」',
      idPrefix: 'CC',
      searchKeys: ['name'],
      columns: [
        { key: 'name', label: '能源品种' },
        { key: 'value', label: '系数（当前/默认）', align: 'right', kind: 'value' },
        { key: 'unit', label: '单位' },
        { key: 'lowHeat', label: '低位热值' },
        { key: 'source', label: '数据来源', kind: 'source' },
        { key: 'version', label: '版本/依据', kind: 'version' },
      ],
      fields: [],
    },
  },
}

const TAB_BY_SEG: Record<string, keyof typeof CONFIGS> = {
  material: 'material',
  power: 'power',
  energy: 'energy',
  coal: 'coal',
}

export default function FactorPage() {
  const params = useParams()
  const seg = Array.isArray(params.section) ? params.section[0] : (params.section as string | undefined)
  const tab = (seg && TAB_BY_SEG[seg]) || 'material'
  return <FactorModule key={tab} tabKey={tab} />
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* 为历史版本补齐 value/source（默认值来源）：最新版本沿用当前值，历史版本按序小幅回溯 */
function normalizeHistory(row: FactorRow): FactorVersion[] {
  return row.history.map((h, i) => ({
    ...h,
    value: h.value ?? Math.round(row.value * (1 + i * 0.035) * 10000) / 10000,
    source: h.source ?? row.source,
  }))
}

/* 默认值 = 初始值或上一个更新的版本值（历史第二项）；仅一个版本时等于当前值 */
function computeDefault(history: FactorVersion[], current: number): number {
  const prev = history[1]
  return prev?.value ?? current
}

function FactorModule({ tabKey }: { tabKey: keyof typeof CONFIGS }) {
  const { data, cfg } = CONFIGS[tabKey]
  const editable = tabKey === EDITABLE_TAB

  const [rows, setRows] = useState<FactorRow[]>(() =>
    data.map((r) => {
      const history = normalizeHistory(r)
      return { ...r, history, defaultValue: computeDefault(history, r.value) }
    }),
  )
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [productSet, setProductSet] = useState('all')
  const activeProduct = useMemo(() => factorSetProducts.find((p) => p.name === productSet) ?? null, [productSet])

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<FactorRow | null>(null)
  const [draft, setDraft] = useState<Record<string, any>>({})
  const [delRow, setDelRow] = useState<FactorRow | null>(null)
  const [verRow, setVerRow] = useState<FactorRow | null>(null)
  const [detailRow, setDetailRow] = useState<FactorRow | null>(null)

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (cfg.productSet && activeProduct) {
        if (r.industry !== activeProduct.industry && r.industry !== '通用') return false
      }
      if (cfg.filterKey && filter !== 'all' && r[cfg.filterKey] !== filter) return false
      if (search.trim()) {
        const kw = search.trim().toLowerCase()
        const hit = cfg.searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(kw))
        if (!hit) return false
      }
      return true
    })
  }, [rows, filter, search, cfg, activeProduct])

  function openAdd() {
    const d: Record<string, any> = { source: factorSourceOptions[0], version: 'v1.0' }
    cfg.fields.forEach((f) => (d[f.key] = f.type === 'select' ? (f.options?.[0] ?? '') : ''))
    setEditing(null)
    setDraft(d)
    setFormOpen(true)
  }
  function openEdit(r: FactorRow) {
    setEditing(r)
    setDraft({ ...r })
    setFormOpen(true)
  }
  function saveForm() {
    if (editing) {
      setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...draft, value: Number(draft.value), updated: todayStr() } : r)))
    } else {
      const id = `${cfg.idPrefix}${String(rows.length + 1).padStart(3, '0')}${Math.floor(Math.random() * 90 + 10)}`
      const now = todayStr()
      const val = Number(draft.value)
      const newRow: FactorRow = {
        ...draft,
        value: val,
        defaultValue: val,
        id,
        updated: now,
        history: [{ version: draft.version, date: now, note: '新建因子', operator: '当前用户', value: val, source: draft.source }],
      } as FactorRow
      setRows((prev) => [newRow, ...prev])
    }
    setFormOpen(false)
  }
  function doDelete() {
    if (!delRow) return
    setRows((prev) => prev.filter((r) => r.id !== delRow.id))
    setDelRow(null)
  }
  /* 版本更新：默认值取更新前的当前值，写入历史并更新当前值/版本/来源 */
  function applyVersion(next: { version: string; value: number; source: string; note: string }) {
    if (!verRow) return
    const now = todayStr()
    setRows((prev) =>
      prev.map((r) =>
        r.id === verRow.id
          ? {
              ...r,
              defaultValue: r.value, // 上一版本值成为默认值
              version: next.version,
              value: next.value,
              source: next.source,
              updated: now,
              history: [{ version: next.version, date: now, note: next.note || '版本更新', operator: '当前用户', value: next.value, source: next.source }, ...r.history],
            }
          : r,
      ),
    )
    setVerRow(null)
  }
  /* 版本回滚：将当前值/版本回退到目标历史版本，记录一条回滚历史 */
  function rollbackVersion(target: FactorVersion) {
    if (!verRow) return
    const now = todayStr()
    setRows((prev) =>
      prev.map((r) =>
        r.id === verRow.id
          ? {
              ...r,
              defaultValue: r.value,
              version: target.version,
              value: target.value ?? r.value,
              source: target.source ?? r.source,
              updated: now,
              history: [
                { version: target.version, date: now, note: `回滚至 ${target.version}`, operator: '当前用户', value: target.value, source: target.source },
                ...r.history,
              ],
            }
          : r,
      ),
    )
    setVerRow(null)
  }

  const columns = cfg.columns.map((c) => ({
    key: c.key,
    label: c.label,
    align: c.align,
    className: c.mono ? 'font-mono' : undefined,
    render:
      c.kind === 'source'
        ? (r: FactorRow) => <Badge tone="default">{r.source}</Badge>
        : c.kind === 'version'
          ? (r: FactorRow) => (
              <button
                type="button"
                onClick={() => setVerRow(r)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                title="查看版本记录 / 回滚"
              >
                <Tag className="size-3" /> {r.version}
              </button>
            )
          : c.kind === 'value'
            ? (r: FactorRow) => (
                <div className="flex flex-col items-end leading-tight">
                  <span className="font-mono text-sm text-foreground">
                    <span className="mr-1 text-[10px] font-sans text-muted-foreground">当前</span>
                    {r.value}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    <span className="mr-1 text-[10px] font-sans">默认</span>
                    {r.defaultValue}
                  </span>
                </div>
              )
            : undefined,
  }))

  // 操作列
  columns.push({
    key: 'action',
    label: '操作',
    align: undefined,
    className: undefined,
    render: (r: FactorRow) =>
      editable ? (
        <div className="flex items-center gap-3">
          {Array.isArray(r.composition) && r.composition.length > 0 && (
            <button type="button" onClick={() => setDetailRow(r)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              <Layers className="size-3.5" /> 构成详情
            </button>
          )}
          <button type="button" onClick={() => openEdit(r)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
            <Pencil className="size-3.5" /> 编辑
          </button>
          <button type="button" onClick={() => setVerRow(r)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <History className="size-3.5" /> 版本记录
          </button>
          <button type="button" onClick={() => setDelRow(r)} className="inline-flex items-center gap-1 text-xs text-[var(--destructive)] hover:underline">
            <Trash2 className="size-3.5" /> 删除
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setVerRow(r)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <History className="size-3.5" /> 版本记录
        </button>
      ),
  } as any)

  return (
    <div className="mt-4 space-y-4">
      {/* 只读模块提示 */}
      {!editable && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm">
          <Lock className="size-4 text-muted-foreground" />
          <span className="text-foreground">{cfg.title}</span>
          <span className="text-muted-foreground">仅供展示与查询，维护入口在</span>
          <span className="font-medium text-primary">系统管理 · 能碳基础因子管理</span>
        </div>
      )}

      <Toolbar>
        {cfg.productSet && (
          <Select
            label="产品"
            value={productSet}
            onChange={setProductSet}
            options={[{ value: 'all', label: '全部产品因子集' }, ...factorSetProducts.map((p) => ({ value: p.name, label: p.name }))]}
          />
        )}
        {/* 原材料：产业标签直接查询；其他模块沿用下拉筛选 */}
        {cfg.filterKey === 'industry' ? (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{cfg.filterLabel}（点击标签筛选）</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[{ v: 'all', l: '全部' }, ...(cfg.filterOptions ?? []).map((o) => ({ v: o, l: o }))].map((t) => {
                const on = filter === t.v
                return (
                  <button
                    key={t.v}
                    type="button"
                    onClick={() => setFilter(t.v)}
                    className={`inline-flex h-9 items-center gap-1 rounded-full border px-3 text-sm transition-colors ${
                      on ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary/60 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    <Tag className="size-3.5" /> {t.l}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          cfg.filterKey && (
            <Select
              label={cfg.filterLabel}
              value={filter}
              onChange={setFilter}
              options={[{ value: 'all', label: `全部${cfg.filterLabel}` }, ...(cfg.filterOptions ?? []).map((o) => ({ value: o, label: o }))]}
            />
          )
        )}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">名称检索</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="输入关键字…"
              className="h-9 w-52 rounded-md border border-border bg-secondary pl-8 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
        </div>
        {editable && (
          <button
            type="button"
            onClick={openAdd}
            className="ml-auto inline-flex h-9 items-center gap-1.5 self-end rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" /> 新增因子
          </button>
        )}
      </Toolbar>

      {cfg.productSet && activeProduct && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <Package className="size-4 text-primary" />
          <span className="font-medium text-foreground">{activeProduct.name}</span>
          <span className="text-muted-foreground">· 原料因子集</span>
          <Badge tone="default">{activeProduct.industry}</Badge>
          <span className="text-xs text-muted-foreground">{activeProduct.desc}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            含 <span className="font-mono text-foreground">{filtered.length}</span> 项因子（{activeProduct.industry} + 通用）
          </span>
        </div>
      )}

      <Panel title={cfg.productSet && activeProduct ? `${cfg.title} · ${activeProduct.name}` : cfg.title} desc={cfg.desc}>
        <DataTable columns={columns as any} rows={filtered} />
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">未找到匹配的因子</p>}
      </Panel>

      {/* 新增 / 编辑（仅原材料） */}
      {editable && (
        <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? `编辑因子 · ${editing.id}` : `新增${cfg.title}`}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {cfg.fields.map((f) => (
                <div key={f.key} className={f.type === 'select' ? 'col-span-2' : ''}>
                  {f.type === 'select' ? (
                    <Select
                      label={f.label}
                      value={draft[f.key] ?? ''}
                      onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
                      options={(f.options ?? []).map((o) => ({ value: o, label: o }))}
                    />
                  ) : (
                    <div>
                      <label className="mb-1.5 block text-xs text-muted-foreground">{f.label}</label>
                      <input
                        type={f.type === 'number' ? 'number' : 'text'}
                        step="any"
                        value={draft[f.key] ?? ''}
                        placeholder={f.placeholder}
                        onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                        className={`h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary ${f.mono ? 'font-mono' : ''}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="数据来源"
                value={draft.source ?? factorSourceOptions[0]}
                onChange={(v) => setDraft((d) => ({ ...d, source: v }))}
                options={factorSourceOptions.map((o) => ({ value: o, label: o }))}
              />
              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground">版本标签</label>
                <input
                  value={draft.version ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, version: e.target.value }))}
                  className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>
            <p className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
              因子变更将记录版本历史与审计日志，历史记录不可删除；更新后原当前值将作为默认值保留以供对比。
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setFormOpen(false)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">
                取消
              </button>
              <button type="button" onClick={saveForm} className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                保存
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 版本记录 + 更新 + 回滚 */}
      {verRow && (
        <VersionModal
          row={verRow}
          editable={editable}
          onClose={() => setVerRow(null)}
          onApply={applyVersion}
          onRollback={rollbackVersion}
        />
      )}

      {/* 因子构成详情（商业因子库拆解） */}
      {detailRow && <CompositionModal row={detailRow} onClose={() => setDetailRow(null)} />}

      {/* 删除确认 */}
      {editable && (
        <Modal open={!!delRow} onClose={() => setDelRow(null)} title="删除因子">
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              确认删除因子
              <span className="mx-1 font-medium text-[var(--destructive)]">{delRow?.name ?? delRow?.region}</span>
              （{delRow?.id}）？该操作不可撤销。
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDelRow(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">
                取消
              </button>
              <button type="button" onClick={doDelete} className="h-9 rounded-md bg-[var(--destructive)] px-4 text-sm font-medium text-white">
                确认删除
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ---------- 版本记录 / 更新 / 回滚弹窗 ---------- */
function VersionModal({
  row,
  editable,
  onClose,
  onApply,
  onRollback,
}: {
  row: FactorRow
  editable: boolean
  onClose: () => void
  onApply: (next: { version: string; value: number; source: string; note: string }) => void
  onRollback: (target: FactorVersion) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [version, setVersion] = useState('')
  const [value, setValue] = useState(String(row.value))
  const [source, setSource] = useState(row.source)
  const [note, setNote] = useState('')

  return (
    <Modal open onClose={onClose} title={`版本记录 · ${row.name ?? `${row.region} / ${row.powerSource}`}`}>
      <div className="space-y-4">
        {/* 当前值 / 默认值 同时对比 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
            <div className="text-xs text-muted-foreground">当前版本</div>
            <div className="mt-0.5 font-mono text-lg font-semibold text-primary">{row.version}</div>
            <div className="mt-1 font-mono text-sm text-foreground">
              当前值 {row.value} <span className="text-xs text-muted-foreground">{row.unit}</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
            <div className="text-xs text-muted-foreground">默认值</div>
            <div className="mt-0.5 font-mono text-lg text-foreground">{row.defaultValue}</div>
            <div className="mt-1 text-xs text-muted-foreground">初始值或上一版本值</div>
          </div>
          <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
            <div className="text-xs text-muted-foreground">数据来源</div>
            <div className="mt-1.5"><Badge tone="default">{row.source}</Badge></div>
            <div className="mt-1 text-xs text-muted-foreground">更新 {row.updated}</div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <History className="size-4 text-primary" /> 版本历史（可回滚）
          </div>
          <ol className="relative space-y-3 border-l border-border pl-4">
            {row.history.map((h, i) => (
              <li key={h.version + i} className="relative">
                <span className={`absolute -left-[21px] top-1 size-2.5 rounded-full border-2 ${i === 0 ? 'border-primary bg-primary' : 'border-border bg-background'}`} />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">{h.version}</span>
                  {i === 0 && <Badge tone="success">当前</Badge>}
                  {i === 1 && <Badge tone="default">默认</Badge>}
                  <span className="text-xs text-muted-foreground">{h.date}</span>
                  {h.value != null && (
                    <span className="font-mono text-xs text-muted-foreground">值 {h.value}</span>
                  )}
                  {editable && i !== 0 && (
                    <button
                      type="button"
                      onClick={() => onRollback(h)}
                      className="ml-auto inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      <Undo2 className="size-3" /> 回滚此版本
                    </button>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {h.note} · 操作人 {h.operator}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {editable ? (
          !showForm ? (
            <button
              type="button"
              onClick={() => {
                setShowForm(true)
                setVersion('')
                setValue(String(row.value))
                setSource(row.source)
                setNote('')
              }}
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <Plus className="size-4" /> 更新为新版本
            </button>
          ) : (
            <div className="space-y-3 rounded-lg border border-border bg-secondary/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">发布新版本</span>
                <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">新版本标签</label>
                  <input
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="如：v3.3"
                    className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">新因子值</label>
                  <input
                    type="number"
                    step="any"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>
              <Select label="数据来源" value={source} onChange={setSource} options={factorSourceOptions.map((o) => ({ value: o, label: o }))} />
              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground">更新说明</label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="本次更新的依据 / 说明"
                  className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!version.trim()}
                  onClick={() => onApply({ version: version.trim(), value: Number(value), source, note })}
                  className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-40"
                >
                  确认更新
                </button>
              </div>
            </div>
          )
        ) : (
          <p className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
            <Lock className="size-3.5" /> 该因子为只读展示，版本维护请前往「系统管理 · 能碳基础因子管理」
          </p>
        )}

        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">
            关闭
          </button>
        </div>
      </div>
    </Modal>
  )
}

/* ---------- 因子构成详情弹窗（商业因子库拆解） ---------- */
function CompositionModal({ row, onClose }: { row: FactorRow; onClose: () => void }) {
  const comp: { stage: string; value: number; pct: number; note?: string }[] = row.composition ?? []
  const maxPct = Math.max(...comp.map((c) => c.pct), 1)
  return (
    <Modal open onClose={onClose} title={`因子构成明细 · ${row.name}`} description="本因子采购自商业因子库，以下为其生命周期阶段构成拆解" size="lg">
      <div className="space-y-4">
        {/* 来源与边界元数据 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-border bg-secondary/40 p-3 sm:grid-cols-4">
          <Meta icon={Building2} label="数据库来源" value={row.provider ?? row.source} />
          <Meta label="核算边界" value={row.boundary ?? '摇篮到大门'} />
          <Meta label="地理代表性" value={row.geo ?? '—'} />
          <Meta label="参考年份" value={row.refYear ?? '—'} />
        </div>

        {/* 因子总值 */}
        <div className="flex items-baseline justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-sm text-muted-foreground">因子当前值（各阶段之和）</span>
          <span className="font-mono text-lg font-semibold text-primary">
            {row.value} <span className="text-xs font-normal text-muted-foreground">{row.unit}</span>
          </span>
        </div>

        {/* 阶段构成条 */}
        <div className="space-y-2.5">
          {comp.map((c) => (
            <div key={c.stage}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground">{c.stage}</span>
                <span className="shrink-0 font-mono text-muted-foreground">
                  <span className="text-foreground">{c.value}</span> {row.unit} · {c.pct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--chart-1),var(--primary))]" style={{ width: `${(c.pct / maxPct) * 100}%` }} />
              </div>
              {c.note && <div className="mt-0.5 text-xs text-muted-foreground">{c.note}</div>}
            </div>
          ))}
        </div>

        <p className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          构成数据由商业因子库随因子一并提供，用于追溯排放来源与热点识别；各阶段数值为该因子在对应生命周期环节的分摊值。
        </p>

        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">
            关闭
          </button>
        </div>
      </div>
    </Modal>
  )
}

function Meta({ icon: Icon, label, value }: { icon?: typeof Building2; label: string; value: string }) {
  return (
    <div>
      <div className="mb-0.5 flex items-center gap-1 text-xs text-muted-foreground">
        {Icon && <Icon className="size-3.5" />} {label}
      </div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Panel, StatusBadge, Toolbar, DataTable, Badge } from '@/components/shared/primitives'
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
  type FactorVersion,
} from '@/lib/mock-data'
import { Plus, Search, Pencil, Trash2, History, Tag, X } from 'lucide-react'

/* ---------- 通用类型 ---------- */
type FieldDef = { key: string; label: string; type: 'text' | 'number' | 'select'; options?: string[]; mono?: boolean; placeholder?: string }
type ColKind = 'source' | 'version' | 'status' | 'text'
type ColDef = { key: string; label: string; align?: 'right'; mono?: boolean; kind?: ColKind }
type FactorRow = Record<string, any> & {
  id: string
  source: string
  version: string
  status: '启用' | '停用'
  updated: string
  history: FactorVersion[]
}
type ModuleConfig = {
  title: string
  desc: string
  idPrefix: string
  filterKey?: string
  filterLabel?: string
  filterOptions?: string[]
  searchKeys: string[]
  columns: ColDef[]
  fields: FieldDef[]
}

/* ---------- 模块配置 ---------- */
const CONFIGS: Record<string, { data: FactorRow[]; cfg: ModuleConfig }> = {
  material: {
    data: rawMaterialFactors as unknown as FactorRow[],
    cfg: {
      title: '原材料碳排因子',
      desc: '各产业主材获取阶段碳排因子，带来源标注与版本管理',
      idPrefix: 'RM',
      filterKey: 'industry',
      filterLabel: '适用产业',
      filterOptions: rawMaterialIndustries,
      searchKeys: ['name'],
      columns: [
        { key: 'name', label: '原材料名称' },
        { key: 'industry', label: '适用产业' },
        { key: 'value', label: '因子值', align: 'right', mono: true },
        { key: 'unit', label: '单位' },
        { key: 'source', label: '数据来源', kind: 'source' },
        { key: 'version', label: '版本', kind: 'version' },
        { key: 'status', label: '状态', kind: 'status' },
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
      desc: '按区域电网与电力来源维护电力碳排因子，带来源标注与版本管理',
      idPrefix: 'PW',
      filterKey: 'region',
      filterLabel: '区域电网',
      filterOptions: powerRegions,
      searchKeys: ['region', 'powerSource'],
      columns: [
        { key: 'region', label: '区域电网' },
        { key: 'powerSource', label: '电力来源' },
        { key: 'value', label: '因子值', align: 'right', mono: true },
        { key: 'unit', label: '单位' },
        { key: 'source', label: '数据来源', kind: 'source' },
        { key: 'version', label: '版本', kind: 'version' },
        { key: 'status', label: '状态', kind: 'status' },
      ],
      fields: [
        { key: 'region', label: '区域电网', type: 'select', options: powerRegions },
        { key: 'powerSource', label: '电力来源', type: 'select', options: powerSources },
        { key: 'value', label: '因子值', type: 'number', mono: true },
        { key: 'unit', label: '单位', type: 'text', placeholder: 'kgCO2e/kWh' },
      ],
    },
  },
  energy: {
    data: energyActivityFactors as unknown as FactorRow[],
    cfg: {
      title: '能源活动碳排因子',
      desc: '化石燃料、热力/蒸汽、制冷剂等能源活动碳排因子，带来源标注与版本管理',
      idPrefix: 'EA',
      filterKey: 'category',
      filterLabel: '能源类别',
      filterOptions: energyActivityCategories,
      searchKeys: ['name'],
      columns: [
        { key: 'name', label: '能源/活动名称' },
        { key: 'category', label: '能源类别' },
        { key: 'value', label: '因子值', align: 'right', mono: true },
        { key: 'unit', label: '单位' },
        { key: 'source', label: '数据来源', kind: 'source' },
        { key: 'version', label: '版本', kind: 'version' },
        { key: 'status', label: '状态', kind: 'status' },
      ],
      fields: [
        { key: 'name', label: '能源/活动名称', type: 'text', placeholder: '如：天然气' },
        { key: 'category', label: '能源类别', type: 'select', options: energyActivityCategories },
        { key: 'value', label: '因子值', type: 'number', mono: true },
        { key: 'unit', label: '单位', type: 'text', placeholder: 'kgCO2e/m³' },
      ],
    },
  },
  coal: {
    data: coalCoefFactors as unknown as FactorRow[],
    cfg: {
      title: '折标煤系数库',
      desc: '各类能源折标准煤系数，含低位热值与国标依据，带来源标注与版本管理',
      idPrefix: 'CC',
      searchKeys: ['name'],
      columns: [
        { key: 'name', label: '能源品种' },
        { key: 'value', label: '折标煤系数', align: 'right', mono: true },
        { key: 'unit', label: '单位' },
        { key: 'lowHeat', label: '低位热值' },
        { key: 'source', label: '数据来源', kind: 'source' },
        { key: 'version', label: '版本/依据', kind: 'version' },
        { key: 'status', label: '状态', kind: 'status' },
      ],
      fields: [
        { key: 'name', label: '能源品种', type: 'text', placeholder: '如：电力' },
        { key: 'value', label: '折标煤系数', type: 'number', mono: true },
        { key: 'unit', label: '单位', type: 'text', placeholder: 'kgce/kWh' },
        { key: 'lowHeat', label: '低位热值', type: 'text', placeholder: '如：35.588 MJ/m³' },
      ],
    },
  },
}

const TAB_BY_SEG: Record<string, keyof typeof CONFIGS> = {
  material: 'material',
  power: 'power',
  energy: 'energy',
  coal: 'coal',
}

export default function FactorClient({ tab: propTab }: { tab?: string }) {
  const params = useParams()
  const seg = Array.isArray(params.section) ? params.section[0] : (params.section as string | undefined)
  const tab = (seg && TAB_BY_SEG[seg]) || 'material'
  // key 强制在切换 tab 时重置内部状态
  return <FactorModule key={tab} tabKey={tab} />
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function FactorModule({ tabKey }: { tabKey: keyof typeof CONFIGS }) {
  const { data, cfg } = CONFIGS[tabKey]
  const [rows, setRows] = useState<FactorRow[]>(() => data.map((r) => ({ ...r, history: [...r.history] })))
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  // 弹窗状态
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<FactorRow | null>(null)
  const [draft, setDraft] = useState<Record<string, any>>({})
  const [delRow, setDelRow] = useState<FactorRow | null>(null)
  const [verRow, setVerRow] = useState<FactorRow | null>(null)

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (cfg.filterKey && filter !== 'all' && r[cfg.filterKey] !== filter) return false
      if (search.trim()) {
        const kw = search.trim().toLowerCase()
        const hit = cfg.searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(kw))
        if (!hit) return false
      }
      return true
    })
  }, [rows, filter, search, cfg])

  function openAdd() {
    const d: Record<string, any> = { source: factorSourceOptions[0], version: 'v1.0', status: '启用' }
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
      const newRow: FactorRow = {
        ...draft,
        value: Number(draft.value),
        id,
        updated: now,
        history: [{ version: draft.version, date: now, note: '新建因子', operator: '当前用户' }],
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
  /* 版本更新：写入历史并更新当前值/版本/来源 */
  function applyVersion(next: { version: string; value: number; source: string; note: string }) {
    if (!verRow) return
    const now = todayStr()
    setRows((prev) =>
      prev.map((r) =>
        r.id === verRow.id
          ? {
              ...r,
              version: next.version,
              value: next.value,
              source: next.source,
              updated: now,
              history: [{ version: next.version, date: now, note: next.note || '版本更新', operator: '当前用户' }, ...r.history],
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
                title="查看/更新版本"
              >
                <Tag className="size-3" /> {r.version}
              </button>
            )
          : c.kind === 'status'
            ? (r: FactorRow) => <StatusBadge tone={r.status === '启用' ? 'ok' : 'warn'}>{r.status}</StatusBadge>
            : undefined,
  }))

  // 操作列
  columns.push({
    key: 'action',
    label: '操作',
    align: undefined,
    className: undefined,
    render: (r: FactorRow) => (
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => openEdit(r)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          <Pencil className="size-3.5" /> 编辑
        </button>
        <button type="button" onClick={() => setVerRow(r)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <History className="size-3.5" /> 版本
        </button>
        <button type="button" onClick={() => setDelRow(r)} className="inline-flex items-center gap-1 text-xs text-[var(--destructive)] hover:underline">
          <Trash2 className="size-3.5" /> 删除
        </button>
      </div>
    ),
  } as any)

  return (
    <div className="mt-4 space-y-4">
      <Toolbar>
        {cfg.filterKey && (
          <Select
            label={cfg.filterLabel}
            value={filter}
            onChange={setFilter}
            options={[{ value: 'all', label: `全部${cfg.filterLabel}` }, ...(cfg.filterOptions ?? []).map((o) => ({ value: o, label: o }))]}
          />
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
        <button
          type="button"
          onClick={openAdd}
          className="ml-auto inline-flex h-9 items-center gap-1.5 self-end rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" /> 新增因子
        </button>
      </Toolbar>

      <Panel title={cfg.title} desc={cfg.desc}>
        <DataTable columns={columns as any} rows={filtered} />
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">未找到匹配的因子</p>}
      </Panel>

      {/* 新增 / 编辑 */}
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
          <Select
            label="状态"
            value={draft.status ?? '启用'}
            onChange={(v) => setDraft((d) => ({ ...d, status: v }))}
            options={[
              { value: '启用', label: '启用' },
              { value: '停用', label: '停用' },
            ]}
          />
          <p className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
            因子变更将记录版本历史与审计日志，历史记录不可删除。
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

      {/* 版本历史 + 更新 */}
      {verRow && <VersionModal row={verRow} onClose={() => setVerRow(null)} onApply={applyVersion} />}

      {/* 删除确认 */}
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
    </div>
  )
}

/* ---------- 版本历史/更新弹窗 ---------- */
function VersionModal({
  row,
  onClose,
  onApply,
}: {
  row: FactorRow
  onClose: () => void
  onApply: (next: { version: string; value: number; source: string; note: string }) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [version, setVersion] = useState('')
  const [value, setValue] = useState(String(row.value))
  const [source, setSource] = useState(row.source)
  const [note, setNote] = useState('')

  return (
    <Modal open onClose={onClose} title={`版本管理 · ${row.name ?? `${row.region} / ${row.powerSource}`}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <div>
            <div className="text-xs text-muted-foreground">当前版本</div>
            <div className="mt-0.5 font-mono text-lg font-semibold text-primary">{row.version}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">当前因子值</div>
            <div className="mt-0.5 font-mono text-lg text-foreground">
              {row.value} <span className="text-xs text-muted-foreground">{row.unit}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">来源</div>
            <div className="mt-0.5"><Badge tone="default">{row.source}</Badge></div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            <History className="size-4 text-primary" /> 版本历史
          </div>
          <ol className="relative space-y-3 border-l border-border pl-4">
            {row.history.map((h, i) => (
              <li key={h.version + i} className="relative">
                <span className={`absolute -left-[21px] top-1 size-2.5 rounded-full border-2 ${i === 0 ? 'border-primary bg-primary' : 'border-border bg-background'}`} />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">{h.version}</span>
                  {i === 0 && <Badge tone="success">最新</Badge>}
                  <span className="text-xs text-muted-foreground">{h.date}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {h.note} · 操作人 {h.operator}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {!showForm ? (
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

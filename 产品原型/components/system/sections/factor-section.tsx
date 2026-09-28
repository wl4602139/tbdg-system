'use client'

import { useMemo, useState } from 'react'
import { Boxes, Search, RotateCcw, Plus, Pencil, Trash2, History, MapPin, Network, Sun } from 'lucide-react'
import { Panel, DataTable, Badge } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { Select } from '@/components/shared/select'
import {
  powerFactors,
  powerRegions,
  powerProvinces,
  powerSources,
  energyActivityFactors,
  energyActivityCategories,
  coalCoefFactors,
  factorSourceOptions,
  type FactorVersion,
} from '@/lib/mock-data'
import { inputCls, ActionBtn, Field } from '@/components/system/ui'

type SubKey = 'power' | 'energy' | 'coal'
type Row = Record<string, any> & { id: string; value: number; version: string; source: string; updated: string; history: FactorVersion[] }
type FieldDef = { key: string; label: string; type: 'text' | 'number' | 'select'; options?: string[]; placeholder?: string }
type SubCfg = {
  title: string
  idPrefix: string
  data: Row[]
  searchKeys: string[]
  columns: { key: string; label: string; align?: 'right'; mono?: boolean }[]
  fields: FieldDef[]
}

const SUBS: Record<SubKey, SubCfg> = {
  power: {
    title: '电力碳排因子',
    idPrefix: 'PW',
    data: powerFactors as unknown as Row[],
    searchKeys: ['province', 'region', 'powerSource'],
    columns: [
      { key: 'province', label: '省份' },
      { key: 'region', label: '区域电网' },
      { key: 'powerSource', label: '电力来源' },
      { key: 'value', label: '因子值', align: 'right', mono: true },
      { key: 'unit', label: '单位' },
    ],
    fields: [
      { key: 'province', label: '省份', type: 'select', options: powerProvinces },
      { key: 'region', label: '区域电网', type: 'select', options: powerRegions },
      { key: 'powerSource', label: '电力来源', type: 'select', options: powerSources },
      { key: 'value', label: '因子值', type: 'number' },
      { key: 'unit', label: '单位', type: 'text', placeholder: 'kgCO2e/kWh' },
    ],
  },
  energy: {
    title: '能源活动碳排因子',
    idPrefix: 'EA',
    data: energyActivityFactors as unknown as Row[],
    searchKeys: ['name'],
    columns: [
      { key: 'name', label: '能源/活动名称' },
      { key: 'category', label: '能源类别' },
      { key: 'value', label: '因子值', align: 'right', mono: true },
      { key: 'unit', label: '单位' },
    ],
    fields: [
      { key: 'name', label: '能源/活动名称', type: 'text', placeholder: '如：天然气' },
      { key: 'category', label: '能源类别', type: 'select', options: energyActivityCategories },
      { key: 'value', label: '因子值', type: 'number' },
      { key: 'unit', label: '单位', type: 'text', placeholder: 'kgCO2e/m³' },
    ],
  },
  coal: {
    title: '折标煤系数库',
    idPrefix: 'CC',
    data: coalCoefFactors as unknown as Row[],
    searchKeys: ['name'],
    columns: [
      { key: 'name', label: '能源品种' },
      { key: 'value', label: '折标煤系数', align: 'right', mono: true },
      { key: 'unit', label: '单位' },
      { key: 'lowHeat', label: '低位热值' },
    ],
    fields: [
      { key: 'name', label: '能源品种', type: 'text', placeholder: '如：电力' },
      { key: 'value', label: '折标煤系数', type: 'number' },
      { key: 'unit', label: '单位', type: 'text', placeholder: 'kgce/kWh' },
      { key: 'lowHeat', label: '低位热值', type: 'text', placeholder: '如：35.588 MJ/m³' },
    ],
  },
}

/* 电力因子分类视图（分省份 / 分区域 / 分电力来源） */
const POWER_VIEWS = [
  { key: 'province', label: '分省份', icon: MapPin, dim: 'province' },
  { key: 'region', label: '分区域', icon: Network, dim: 'region' },
  { key: 'powerSource', label: '分电力来源', icon: Sun, dim: 'powerSource' },
] as const

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function FactorSection({ sub = 'power' }: { sub?: SubKey }) {
  const cfg = SUBS[sub]
  const [rows, setRows] = useState<Row[]>(() => cfg.data.map((r) => ({ ...r, history: [...r.history] })))
  const [kw, setKw] = useState('')
  const [appliedKw, setAppliedKw] = useState('')

  // 电力：分类视图 + 维度取值筛选
  const [powerView, setPowerView] = useState<(typeof POWER_VIEWS)[number]['key']>('province')
  const [dimValue, setDimValue] = useState('all')
  const powerDim = POWER_VIEWS.find((v) => v.key === powerView)!.dim

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Row | null>(null)
  const [draft, setDraft] = useState<Record<string, any>>({})
  const [delRow, setDelRow] = useState<Row | null>(null)
  const [verRow, setVerRow] = useState<Row | null>(null)

  const dimOptions = useMemo(() => {
    if (sub !== 'power') return []
    return Array.from(new Set(rows.map((r) => r[powerDim] as string)))
  }, [rows, sub, powerDim])

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (sub === 'power' && dimValue !== 'all' && r[powerDim] !== dimValue) return false
      if (appliedKw) {
        const hit = cfg.searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(appliedKw.toLowerCase()))
        if (!hit) return false
      }
      return true
    })
  }, [rows, sub, dimValue, powerDim, appliedKw, cfg.searchKeys])

  function openAdd() {
    const d: Record<string, any> = { source: factorSourceOptions[0], version: 'v1.0' }
    cfg.fields.forEach((f) => (d[f.key] = f.type === 'select' ? (f.options?.[0] ?? '') : ''))
    setEditing(null)
    setDraft(d)
    setFormOpen(true)
  }
  function openEdit(r: Row) {
    setEditing(r)
    setDraft({ ...r })
    setFormOpen(true)
  }
  function save() {
    if (editing) {
      setRows((p) => p.map((r) => (r.id === editing.id ? { ...r, ...draft, value: Number(draft.value), updated: today() } : r)))
    } else {
      const id = `${cfg.idPrefix}${String(rows.length + 1).padStart(3, '0')}`
      const now = today()
      setRows((p) => [
        { ...draft, value: Number(draft.value), id, updated: now, history: [{ version: draft.version, date: now, note: '新建因子', operator: '当前用户' }] } as Row,
        ...p,
      ])
    }
    setFormOpen(false)
  }
  function doDelete() {
    if (delRow) setRows((p) => p.filter((r) => r.id !== delRow.id))
    setDelRow(null)
  }

  const columns = cfg.columns.map((c) => ({
    key: c.key,
    label: c.label,
    align: c.align,
    className: c.mono ? 'font-mono' : undefined,
  }))
  columns.push({ key: 'source', label: '数据来源', align: undefined, className: undefined } as any)
  ;(columns as any).push({
    key: 'version',
    label: '版本',
    render: (r: Row) => (
      <button type="button" onClick={() => setVerRow(r)} className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-xs text-foreground hover:border-primary hover:text-primary">
        {r.version}
      </button>
    ),
  })
  ;(columns as any).push({
    key: 'op',
    label: '操作',
    render: (r: Row) => (
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => openEdit(r)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline"><Pencil className="size-3.5" /> 编辑</button>
        <button type="button" onClick={() => setVerRow(r)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><History className="size-3.5" /> 版本</button>
        <button type="button" onClick={() => setDelRow(r)} className="inline-flex items-center gap-1 text-xs text-[var(--destructive)] hover:underline"><Trash2 className="size-3.5" /> 删除</button>
      </div>
    ),
  })

  const sourceCol: any = columns.find((c: any) => c.key === 'source')
  if (sourceCol) sourceCol.render = (r: Row) => <Badge tone="default">{r.source}</Badge>

  return (
    <Panel
      title={cfg.title}
      icon={Boxes}
      actions={<ActionBtn variant="primary" onClick={openAdd}><Plus className="size-4" /> 新增因子</ActionBtn>}
    >
      {/* 电力：分省份/分区域/分电力来源 标签切换 */}
      {sub === 'power' && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {POWER_VIEWS.map((v) => {
            const on = powerView === v.key
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => { setPowerView(v.key); setDimValue('all') }}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${on ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}
              >
                <v.icon className="size-4" /> {v.label}
              </button>
            )
          })}
          <div className="ml-2 h-6 w-px bg-border" />
          {/* 维度取值快捷筛选 chips */}
          <button
            type="button"
            onClick={() => setDimValue('all')}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${dimValue === 'all' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            全部
          </button>
          {dimOptions.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDimValue(d)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${dimValue === d ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <Field label="关键字">
          <input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="名称 / 区域 / 来源" className={`${inputCls} w-52`} />
        </Field>
        <ActionBtn variant="primary" onClick={() => setAppliedKw(kw.trim())}><Search className="size-4" /> 查询</ActionBtn>
        <ActionBtn onClick={() => { setKw(''); setAppliedKw(''); setDimValue('all') }}><RotateCcw className="size-4" /> 重置</ActionBtn>
      </div>

      <DataTable columns={columns as any} rows={filtered} />
      {filtered.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">未找到匹配的因子</p>}

      {/* 新增 / 编辑 */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? `编辑因子 · ${editing.id}` : `新增${cfg.title}`}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            {cfg.fields.map((f) => (
              <Field key={f.key} label={f.label} className={f.type === 'select' ? '' : ''}>
                {f.type === 'select' ? (
                  <Select value={draft[f.key] ?? ''} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} options={(f.options ?? []).map((o) => ({ value: o, label: o }))} />
                ) : (
                  <input
                    type={f.type === 'number' ? 'number' : 'text'}
                    step="any"
                    value={draft[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                    className={inputCls}
                  />
                )}
              </Field>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="数据来源">
              <Select value={draft.source ?? factorSourceOptions[0]} onChange={(v) => setDraft((d) => ({ ...d, source: v }))} options={factorSourceOptions.map((o) => ({ value: o, label: o }))} />
            </Field>
            <Field label="版本标签">
              <input value={draft.version ?? ''} onChange={(e) => setDraft((d) => ({ ...d, version: e.target.value }))} className={`${inputCls} font-mono`} />
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <ActionBtn onClick={() => setFormOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="primary" onClick={save}>保存</ActionBtn>
          </div>
        </div>
      </Modal>

      {/* 版本记录 */}
      <Modal open={!!verRow} onClose={() => setVerRow(null)} title={`版本记录 · ${verRow?.name ?? verRow?.province ?? ''}`} footer={<ActionBtn onClick={() => setVerRow(null)}>关闭</ActionBtn>}>
        {verRow && (
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
              <div>
                <div className="text-xs text-muted-foreground">当前版本</div>
                <div className="mt-0.5 font-mono text-lg font-semibold text-primary">{verRow.version}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">当前因子值</div>
                <div className="mt-0.5 font-mono text-lg text-foreground">{verRow.value} <span className="text-xs text-muted-foreground">{verRow.unit}</span></div>
              </div>
            </div>
            <div className="space-y-2">
              {verRow.history.map((h, i) => (
                <div key={h.version + i} className="flex items-center gap-3 rounded-lg border border-border bg-panel px-3 py-2">
                  <span className="font-mono text-sm text-foreground">{h.version}</span>
                  {i === 0 && <Badge tone="success">当前</Badge>}
                  <span className="flex-1 text-xs text-muted-foreground">{h.note} · 操作人 {h.operator}</span>
                  <span className="font-mono text-xs text-muted-foreground">{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* 删除确认 */}
      <Modal open={!!delRow} onClose={() => setDelRow(null)} title="删除因子" footer={<><ActionBtn onClick={() => setDelRow(null)}>取消</ActionBtn><ActionBtn variant="danger" onClick={doDelete}>确认删除</ActionBtn></>}>
        <p className="text-sm text-foreground">确认删除因子 <span className="font-medium text-[var(--destructive)]">{delRow?.name ?? delRow?.province}</span>（{delRow?.id}）？该操作不可撤销。</p>
      </Modal>
    </Panel>
  )
}

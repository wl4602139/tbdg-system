'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Panel, StatusBadge, DataTable, KpiCard, Badge, Tabs } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import {
  cbamProducts,
  cbamQualifications,
  cbamTraders,
  cbamAlerts,
  cbamDeclScenarios,
  cbamDeclMaterials,
  cbamDeclSteps,
  cbamRequirementSections,
  cbamSimRecords,
  cbamKnowledge,
  type CbamDeclStep,
  type CbamSimRecord,
  cbamSectors,
  cbamProcesses,
  cbamQualTypes,
  cbamTraderRoles,
  cbamCountries,
  cbamKnowledgeSources,
  cbamKnowledgeLangs,
  statusColor,
  type CbamProduct,
  type CbamQual,
  type CbamTrader,
  type CbamAlert,
  type CbamKnowledge,
} from '@/lib/mock-data'
import {
  Bot,
  Search,
  Send,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Check,
  CircleCheck,
  Factory,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Calculator,
  X,
  Paperclip,
  ArrowRight,
  Lock,
  Info,
  BookOpen,
  ListChecks,
  Eye,
} from 'lucide-react'

export default function CbamClient({ tab: initialTab }: { tab?: string }) {
  const params = useParams()
  const seg = Array.isArray(params?.section) ? params.section[0] : (params?.section as string | undefined)
  const tab = seg ?? initialTab ?? 'compliance'

  return (
    <div>
      {tab === 'compliance' && <ComplianceModule />}
      {tab === 'declaration' && <DeclarationModule />}
      {tab === 'knowledge' && <KnowledgeModule />}
    </div>
  )
}

/* ---------- 通用：表单字段 ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
const inputCls =
  'h-9 rounded-md border border-border bg-panel px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring'

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />
}
function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}
/* 线下材料上传控件（模拟）*/
function UploadBox({ files, onAdd, onRemove }: { files: string[]; onAdd: () => void; onRemove: (i: number) => void }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-3">
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full flex-col items-center justify-center gap-1 py-3 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <Upload className="size-5" />
        点击上传材料（PDF / Word / Excel / 图片）
      </button>
      {files.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-border bg-panel px-2.5 py-1.5 text-xs">
              <span className="flex items-center gap-1.5 truncate text-foreground">
                <Paperclip className="size-3.5 text-primary" /> {f}
              </span>
              <button type="button" onClick={() => onRemove(i)} className="text-muted-foreground hover:text-[var(--destructive)]">
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ============================ 合规管理 ============================ */
function ComplianceModule() {
  const [sub, setSub] = useState('scope')

  // 列表数据（可增删改）
  const [products, setProducts] = useState<CbamProduct[]>(cbamProducts)
  const [quals, setQuals] = useState<CbamQual[]>(cbamQualifications)
  const [traders, setTraders] = useState<CbamTrader[]>(cbamTraders)

  const [kw, setKw] = useState('')

  const controlled = products.filter((p) => p.scope === '管控').length
  const validQual = quals.filter((q) => q.status === '有效').length
  const expiring = cbamAlerts.length

  const rows = useMemo(
    () => products.filter((p) => !kw || `${p.name}${p.hs}${p.cn}`.toLowerCase().includes(kw.toLowerCase())),
    [products, kw],
  )

  // 编辑弹窗状态
  const [prodEdit, setProdEdit] = useState<{ data: CbamProduct; isNew: boolean } | null>(null)
  const [qualEdit, setQualEdit] = useState<{ data: CbamQual; isNew: boolean } | null>(null)
  const [traderEdit, setTraderEdit] = useState<{ data: CbamTrader; isNew: boolean } | null>(null)
  const [del, setDel] = useState<{ kind: 'product' | 'qual' | 'trader'; id: string; label: string } | null>(null)
  const [alert, setAlert] = useState<CbamAlert | null>(null)

  function doDelete() {
    if (!del) return
    if (del.kind === 'product') setProducts((l) => l.filter((x) => x.id !== del.id))
    if (del.kind === 'qual') setQuals((l) => l.filter((x) => x.id !== del.id))
    if (del.kind === 'trader') setTraders((l) => l.filter((x) => x.id !== del.id))
    setDel(null)
  }

  return (
    <div className="mt-4 space-y-4">
      {/* 数据总览 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard label="纳入管控产品" value={String(controlled)} unit="项" icon={ShieldCheck} />
        <KpiCard label="有效资质" value={String(validQual)} unit="项" icon={CircleCheck} />
        <KpiCard label="贸易主体" value={String(traders.length)} unit="家" icon={Building2} />
        <KpiCard label="临期预警" value={String(expiring)} unit="项" icon={AlertTriangle} trend={expiring ? '点击查看' : ''} up={false} />
      </div>

      <Tabs
        tabs={[
          { key: 'scope', label: '管控范围判定' },
          { key: 'qual', label: '资质管理' },
        ]}
        value={sub}
        onChange={setSub}
      />

      {sub === 'scope' && (
        <>
          {/* 即时计算窗口 */}
          <InstantAssessment onCreate={(p) => setProducts((l) => [p, ...l])} />

          {/* 临期预警卡片 */}
          {cbamAlerts.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {cbamAlerts.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAlert(a)}
                  className="flex items-start gap-3 rounded-xl border border-[var(--warning)]/40 bg-[var(--warning)]/10 p-4 text-left transition-colors hover:bg-[var(--warning)]/15"
                >
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[var(--warning)]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{a.qualType}</span>
                      <Badge tone="warning">{a.level}风险</Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {a.holder} · {a.code} · 有效期至 {a.validTo}
                    </div>
                    <div className="mt-1.5 text-xs font-medium text-[var(--warning)]">剩余 {a.daysLeft} 天到期 · 点击查看处理建议</div>
                  </div>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}

          <Panel
            title="管控范围判定"
            actions={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={kw}
                    onChange={(e) => setKw(e.target.value)}
                    placeholder="输入产品名称 / HS 码"
                    className="h-9 w-52 rounded-md border border-border bg-secondary pl-8 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setProdEdit({
                      isNew: true,
                      data: { id: `P${Date.now()}`, name: '', hs: '', cn: '', sector: cbamSectors[0], scope: '管控', status: '有效', exempt: false },
                    })
                  }
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Plus className="size-4" /> 新增产品
                </button>
              </div>
            }
          >
            <DataTable
              columns={[
                { key: 'name', label: '产品名称' },
                { key: 'hs', label: 'HS 码', className: 'font-mono' },
                { key: 'cn', label: 'CN 码', className: 'font-mono' },
                { key: 'sector', label: '行业' },
                { key: 'scope', label: '管控范围', render: (r) => <Badge tone={r.scope === '管控' ? 'warning' : 'default'}>{r.scope}</Badge> },
                {
                  key: 'exempt',
                  label: '豁免评估',
                  render: (r) => (
                    <span className={r.exempt ? 'text-[var(--success)]' : 'text-muted-foreground'}>{r.exempt ? '符合豁免' : '不符合'}</span>
                  ),
                },
                { key: 'status', label: '资质状态', render: (r) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge> },
                {
                  key: 'action',
                  label: '操作',
                  render: (r) => (
                    <div className="flex items-center gap-3 text-xs">
                      <button type="button" onClick={() => setProdEdit({ isNew: false, data: { ...r } })} className="inline-flex items-center gap-1 text-primary hover:underline">
                        <Pencil className="size-3.5" /> 编辑
                      </button>
                      <button type="button" onClick={() => setDel({ kind: 'product', id: r.id, label: r.name })} className="inline-flex items-center gap-1 text-[var(--destructive)] hover:underline">
                        <Trash2 className="size-3.5" /> 删除
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={rows}
            />
          </Panel>
        </>
      )}

      {sub === 'qual' && (
        <div className="space-y-4">
          <Panel
            title="资质管理"
            actions={
              <button
                type="button"
                onClick={() =>
                  setQualEdit({
                    isNew: true,
                    data: { id: `Q${Date.now()}`, type: cbamQualTypes[0], code: '', holder: '', validFrom: '', validTo: '', status: '有效' },
                  })
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="size-4" /> 新增资质
              </button>
            }
          >
            <DataTable
              columns={[
                { key: 'type', label: '资质类型' },
                { key: 'code', label: '编号', className: 'font-mono' },
                { key: 'holder', label: '持有主体' },
                { key: 'validTo', label: '有效期至' },
                { key: 'status', label: '状态', render: (r) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge> },
                {
                  key: 'action',
                  label: '操作',
                  render: (r) => (
                    <div className="flex items-center gap-3 text-xs">
                      <button type="button" onClick={() => setQualEdit({ isNew: false, data: { ...r } })} className="inline-flex items-center gap-1 text-primary hover:underline">
                        <Pencil className="size-3.5" /> 编辑
                      </button>
                      <button type="button" onClick={() => setDel({ kind: 'qual', id: r.id, label: r.type })} className="inline-flex items-center gap-1 text-[var(--destructive)] hover:underline">
                        <Trash2 className="size-3.5" /> 删除
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={quals}
            />
          </Panel>

          <Panel
            title="贸易主体"
            actions={
              <button
                type="button"
                onClick={() =>
                  setTraderEdit({
                    isNew: true,
                    data: { id: `T${Date.now()}`, name: '', country: cbamCountries[0], eori: '', role: cbamTraderRoles[0], auth: '待授权' },
                  })
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="size-4" /> 新增主体
              </button>
            }
          >
            <DataTable
              columns={[
                { key: 'name', label: '主体名称' },
                { key: 'country', label: '国家/地区' },
                { key: 'eori', label: 'EORI', className: 'font-mono' },
                { key: 'role', label: '角色' },
                { key: 'auth', label: '授权状态', render: (r) => <StatusBadge tone={r.auth === '已授权' ? 'ok' : 'warn'}>{r.auth}</StatusBadge> },
                {
                  key: 'action',
                  label: '操作',
                  render: (r) => (
                    <div className="flex items-center gap-3 text-xs">
                      <button type="button" onClick={() => setTraderEdit({ isNew: false, data: { ...r } })} className="inline-flex items-center gap-1 text-primary hover:underline">
                        <Pencil className="size-3.5" /> 编辑
                      </button>
                      <button type="button" onClick={() => setDel({ kind: 'trader', id: r.id, label: r.name })} className="inline-flex items-center gap-1 text-[var(--destructive)] hover:underline">
                        <Trash2 className="size-3.5" /> 删除
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={traders}
            />
          </Panel>
        </div>
      )}

      {/* 产品 新增/编辑 */}
      <Modal
        open={!!prodEdit}
        onClose={() => setProdEdit(null)}
        title={prodEdit?.isNew ? '新增管控产品' : '编辑管控产品'}
        footer={
          <>
            <button type="button" onClick={() => setProdEdit(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">
              取消
            </button>
            <button
              type="button"
              onClick={() => {
                if (!prodEdit || !prodEdit.data.name.trim()) return
                setProducts((l) => (prodEdit.isNew ? [prodEdit.data, ...l] : l.map((x) => (x.id === prodEdit.data.id ? prodEdit.data : x))))
                setProdEdit(null)
              }}
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              保存
            </button>
          </>
        }
      >
        {prodEdit && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="产品名称"><TextInput value={prodEdit.data.name} onChange={(e) => setProdEdit({ ...prodEdit, data: { ...prodEdit.data, name: e.target.value } })} /></Field>
            <Field label="行业"><SelectInput value={prodEdit.data.sector} onChange={(v) => setProdEdit({ ...prodEdit, data: { ...prodEdit.data, sector: v } })} options={cbamSectors} /></Field>
            <Field label="HS 码"><TextInput value={prodEdit.data.hs} onChange={(e) => setProdEdit({ ...prodEdit, data: { ...prodEdit.data, hs: e.target.value } })} /></Field>
            <Field label="CN 码"><TextInput value={prodEdit.data.cn} onChange={(e) => setProdEdit({ ...prodEdit, data: { ...prodEdit.data, cn: e.target.value } })} /></Field>
            <Field label="管控范围"><SelectInput value={prodEdit.data.scope} onChange={(v) => setProdEdit({ ...prodEdit, data: { ...prodEdit.data, scope: v as CbamProduct['scope'] } })} options={['管控', '不管控']} /></Field>
            <Field label="资质状态"><SelectInput value={prodEdit.data.status} onChange={(v) => setProdEdit({ ...prodEdit, data: { ...prodEdit.data, status: v as CbamProduct['status'] } })} options={['有效', '临期', '已过期']} /></Field>
            <Field label="豁免评估"><SelectInput value={prodEdit.data.exempt ? '符合豁免' : '不符合'} onChange={(v) => setProdEdit({ ...prodEdit, data: { ...prodEdit.data, exempt: v === '符合豁免' } })} options={['不符合', '符合豁免']} /></Field>
          </div>
        )}
      </Modal>

      {/* 资质 新增/编辑 */}
      <Modal
        open={!!qualEdit}
        onClose={() => setQualEdit(null)}
        title={qualEdit?.isNew ? '新增资质' : '编辑资质'}
        footer={
          <>
            <button type="button" onClick={() => setQualEdit(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">
              取消
            </button>
            <button
              type="button"
              onClick={() => {
                if (!qualEdit || !qualEdit.data.code.trim()) return
                setQuals((l) => (qualEdit.isNew ? [qualEdit.data, ...l] : l.map((x) => (x.id === qualEdit.data.id ? qualEdit.data : x))))
                setQualEdit(null)
              }}
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              保存
            </button>
          </>
        }
      >
        {qualEdit && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="资质类型"><SelectInput value={qualEdit.data.type} onChange={(v) => setQualEdit({ ...qualEdit, data: { ...qualEdit.data, type: v } })} options={cbamQualTypes} /></Field>
            <Field label="编号"><TextInput value={qualEdit.data.code} onChange={(e) => setQualEdit({ ...qualEdit, data: { ...qualEdit.data, code: e.target.value } })} /></Field>
            <Field label="持有主体"><TextInput value={qualEdit.data.holder} onChange={(e) => setQualEdit({ ...qualEdit, data: { ...qualEdit.data, holder: e.target.value } })} /></Field>
            <Field label="状态"><SelectInput value={qualEdit.data.status} onChange={(v) => setQualEdit({ ...qualEdit, data: { ...qualEdit.data, status: v as CbamQual['status'] } })} options={['有效', '临期', '已过期']} /></Field>
            <Field label="生效日期"><TextInput type="date" value={qualEdit.data.validFrom} onChange={(e) => setQualEdit({ ...qualEdit, data: { ...qualEdit.data, validFrom: e.target.value } })} /></Field>
            <Field label="有效期至"><TextInput type="date" value={qualEdit.data.validTo} onChange={(e) => setQualEdit({ ...qualEdit, data: { ...qualEdit.data, validTo: e.target.value } })} /></Field>
          </div>
        )}
      </Modal>

      {/* 贸易主体 新增/编辑 */}
      <Modal
        open={!!traderEdit}
        onClose={() => setTraderEdit(null)}
        title={traderEdit?.isNew ? '新增贸易主体' : '编辑贸易主体'}
        footer={
          <>
            <button type="button" onClick={() => setTraderEdit(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">
              取消
            </button>
            <button
              type="button"
              onClick={() => {
                if (!traderEdit || !traderEdit.data.name.trim()) return
                setTraders((l) => (traderEdit.isNew ? [traderEdit.data, ...l] : l.map((x) => (x.id === traderEdit.data.id ? traderEdit.data : x))))
                setTraderEdit(null)
              }}
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              保存
            </button>
          </>
        }
      >
        {traderEdit && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="主体名称"><TextInput value={traderEdit.data.name} onChange={(e) => setTraderEdit({ ...traderEdit, data: { ...traderEdit.data, name: e.target.value } })} /></Field>
            <Field label="国家/地区"><SelectInput value={traderEdit.data.country} onChange={(v) => setTraderEdit({ ...traderEdit, data: { ...traderEdit.data, country: v } })} options={cbamCountries} /></Field>
            <Field label="EORI"><TextInput value={traderEdit.data.eori} onChange={(e) => setTraderEdit({ ...traderEdit, data: { ...traderEdit.data, eori: e.target.value } })} /></Field>
            <Field label="角色"><SelectInput value={traderEdit.data.role} onChange={(v) => setTraderEdit({ ...traderEdit, data: { ...traderEdit.data, role: v } })} options={cbamTraderRoles} /></Field>
            <Field label="授权状态"><SelectInput value={traderEdit.data.auth} onChange={(v) => setTraderEdit({ ...traderEdit, data: { ...traderEdit.data, auth: v as CbamTrader['auth'] } })} options={['待授权', '已授权']} /></Field>
          </div>
        )}
      </Modal>

      {/* 删除确认 */}
      <Modal
        open={!!del}
        onClose={() => setDel(null)}
        title="确认删除"
        footer={
          <>
            <button type="button" onClick={() => setDel(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">
              取消
            </button>
            <button type="button" onClick={doDelete} className="h-9 rounded-md bg-[var(--destructive)] px-4 text-sm font-medium text-white">
              确认删除
            </button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          确认删除 <span className="text-foreground">{del?.label}</span>？此操作不可撤销。
        </p>
      </Modal>

      {/* 临期预警详情 */}
      <Modal open={!!alert} onClose={() => setAlert(null)} title="临期预警详情" size="lg">
        {alert && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-[var(--warning)]/40 bg-[var(--warning)]/10 p-4">
              <AlertTriangle className="size-6 shrink-0 text-[var(--warning)]" />
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {alert.qualType} · <span className="font-mono">{alert.code}</span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {alert.holder} · 有效期至 {alert.validTo} · 剩余 <span className="font-medium text-[var(--warning)]">{alert.daysLeft}</span> 天
                </div>
              </div>
              <Badge tone="warning">{alert.level}风险</Badge>
            </div>
            <div>
              <div className="mb-1.5 text-sm font-medium text-foreground">预警说明</div>
              <p className="text-sm leading-relaxed text-muted-foreground">{alert.risk}</p>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-foreground">处理建议</div>
              <ol className="space-y-2">
                {alert.actions.map((a, i) => (
                  <li key={i} className="flex gap-2.5 rounded-lg border border-border bg-secondary/40 p-3 text-sm text-foreground">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{i + 1}</span>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ---------- 即时计算窗口（CN 编码匹配 + 豁免资格预评估） ---------- */
function InstantAssessment({ onCreate }: { onCreate: (p: CbamProduct) => void }) {
  // 左：CN 编码匹配
  const [hs, setHs] = useState('')
  const [name, setName] = useState('')
  const [process, setProcess] = useState(cbamProcesses[0])
  const [cnResult, setCnResult] = useState<{ cn: string; sector: string; scope: '管控' | '不管控' } | null>(null)

  // 右：豁免资格预评估
  const [importQty, setImportQty] = useState('')
  const [embedded, setEmbedded] = useState('')
  const [exemptResult, setExemptResult] = useState<{ ok: boolean; text: string } | null>(null)

  function matchCn() {
    // 简化匹配：由 HS 前 4 位推导 CN 码与行业
    const clean = hs.replace(/\D/g, '')
    const cn = clean ? (clean.slice(0, 8).padEnd(8, '0')) : '85042300'
    const sector = clean.startsWith('72') || clean.startsWith('73') ? '钢铁' : clean.startsWith('76') ? '铝' : clean.startsWith('25') ? '水泥' : '钢铁'
    setCnResult({ cn, sector, scope: '管控' })
  }
  function assessExempt() {
    const qty = Number(importQty) || 0
    const emb = Number(embedded) || 0
    // 简化规则：单批次进口量 < 50 吨 视为微量豁免；否则按内含碳排放判断
    const ok = qty > 0 && qty < 50
    setExemptResult({
      ok,
      text: ok
        ? `单批次进口量 ${qty} 吨低于微量豁免阈值（50 吨），本批次可申请豁免。`
        : `单批次进口量 ${qty} 吨，单位内含碳排放 ${emb} tCO2e/t，合计内含碳约 ${(qty * emb).toFixed(1)} tCO2e，需按 CBAM 正常申报并清算证书。`,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* CN 编码精准匹配 */}
      <Panel title="CN 编码精准匹配" icon={Calculator}>
        <div className="grid grid-cols-3 gap-3">
          <Field label="HS 码"><TextInput value={hs} onChange={(e) => setHs(e.target.value)} placeholder="请输入" /></Field>
          <Field label="产品名称"><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入" /></Field>
          <Field label="生产工艺"><SelectInput value={process} onChange={setProcess} options={cbamProcesses} /></Field>
        </div>
        <button
          type="button"
          onClick={matchCn}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" /> 匹配 CN 编码
        </button>
        {cnResult && (
          <div className="mt-3 space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">匹配 CN 码</span>
              <span className="font-mono text-foreground">{cnResult.cn}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">对应行业</span>
              <span className="text-foreground">{cnResult.sector}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">管控判定</span>
              <Badge tone="warning">{cnResult.scope}</Badge>
            </div>
            <button
              type="button"
              onClick={() => {
                onCreate({ id: `P${Date.now()}`, name: name || '未命名产品', hs, cn: cnResult.cn, sector: cnResult.sector, scope: cnResult.scope, status: '有效', exempt: false })
                setCnResult(null)
                setHs('')
                setName('')
              }}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 py-2 text-xs font-medium text-primary hover:bg-primary/20"
            >
              <Plus className="size-3.5" /> 创建为管控台账记录
            </button>
          </div>
        )}
      </Panel>

      {/* 豁免资格预评估 */}
      <Panel title="豁免资格预评估" icon={ShieldCheck}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="单批次进口量（吨）"><TextInput value={importQty} onChange={(e) => setImportQty(e.target.value)} placeholder="请输入" inputMode="decimal" /></Field>
          <Field label="单位内含碳排放（tCO2e/t）"><TextInput value={embedded} onChange={(e) => setEmbedded(e.target.value)} placeholder="请输入" inputMode="decimal" /></Field>
        </div>
        <button
          type="button"
          onClick={assessExempt}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" /> 评估豁免资格
        </button>
        {exemptResult && (
          <div className={`mt-3 flex items-start gap-2 rounded-lg border p-3 text-sm ${exemptResult.ok ? 'border-[var(--success)]/40 bg-[var(--success)]/10' : 'border-[var(--warning)]/40 bg-[var(--warning)]/10'}`}>
            {exemptResult.ok ? <CircleCheck className="mt-0.5 size-4 shrink-0 text-[var(--success)]" /> : <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" />}
            <span className="text-foreground">{exemptResult.text}</span>
          </div>
        )}
      </Panel>
    </div>
  )
}

/* ============================ 申报模拟 ============================ */
const TODAY = '2026-09-03'
const SIM_STATUS: CbamSimRecord['status'][] = ['草稿', '模拟中', '已完成']

function DeclarationModule() {
  // 弹窗：单步骤详解 / CBAM 要求详解
  const [stepDetail, setStepDetail] = useState<CbamDeclStep | null>(null)
  const [reqOpen, setReqOpen] = useState(false)
  // 高亮：点击「我方」步骤后，联动高亮右侧对应材料
  const [highlight, setHighlight] = useState<string[]>([])

  // 模拟任务管理（增删改查）
  const [records, setRecords] = useState<CbamSimRecord[]>(cbamSimRecords)
  const [recDel, setRecDel] = useState<CbamSimRecord | null>(null)
  const [recView, setRecView] = useState<CbamSimRecord | null>(null)
  const [taskEdit, setTaskEdit] = useState<{ data: CbamSimRecord; isNew: boolean } | null>(null)
  // 当前进入的模拟任务：只有选中任务后才能上传申报材料
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = records.find((r) => r.id === activeId) ?? null

  // 每个任务各自的材料上传文件列表（本地模拟）
  const [filesByTask, setFilesByTask] = useState<Record<string, Record<string, string[]>>>({})
  const files = activeId ? (filesByTask[activeId] ?? {}) : {}
  const uploaded = cbamDeclMaterials.filter((m) => (files[m.name]?.length ?? 0) > 0).length
  const requiredMissing = cbamDeclMaterials.filter((m) => m.required && (files[m.name]?.length ?? 0) === 0).length

  const scenarioKeys = cbamDeclScenarios.map((s) => `${s.factory} · ${s.product.split(' ')[0]}`)

  function syncProgress(taskId: string, next: Record<string, string[]>) {
    const up = cbamDeclMaterials.filter((m) => (next[m.name]?.length ?? 0) > 0).length
    setRecords((l) =>
      l.map((r) =>
        r.id === taskId
          ? { ...r, docCount: up, progress: Math.round((up / cbamDeclMaterials.length) * 100), status: up === cbamDeclMaterials.length ? '已完成' : up > 0 ? '模拟中' : r.status, updated: TODAY }
          : r,
      ),
    )
  }
  function addFile(name: string) {
    if (!activeId) return
    const cur = filesByTask[activeId] ?? {}
    const n = (cur[name]?.length ?? 0) + 1
    const next = { ...cur, [name]: [...(cur[name] ?? []), `${name}_附件${n}.pdf`] }
    setFilesByTask((p) => ({ ...p, [activeId]: next }))
    syncProgress(activeId, next)
  }
  function removeFile(name: string, i: number) {
    if (!activeId) return
    const cur = filesByTask[activeId] ?? {}
    const next = { ...cur, [name]: (cur[name] ?? []).filter((_, idx) => idx !== i) }
    setFilesByTask((p) => ({ ...p, [activeId]: next }))
    syncProgress(activeId, next)
  }
  function onStepClick(st: CbamDeclStep) {
    setStepDetail(st)
    setHighlight(st.owner === 'us' ? st.docs : [])
  }
  function newTask() {
    const s = cbamDeclScenarios[0]
    setTaskEdit({
      isNew: true,
      data: { id: `SIM-2026-${String(records.length + 1).padStart(3, '0')}`, scenario: `${s.factory} · ${s.product.split(' ')[0]}`, operator: '当前用户', quarter: s.quarter, emission: s.emission, docCount: 0, progress: 0, status: '草稿', updated: TODAY },
    })
  }
  function saveTask() {
    if (!taskEdit || !taskEdit.data.scenario.trim()) return
    const d = taskEdit.data
    setRecords((l) => (taskEdit.isNew ? [d, ...l] : l.map((x) => (x.id === d.id ? d : x))))
    if (taskEdit.isNew) setActiveId(d.id) // 新建后自动进入，便于上传材料
    setTaskEdit(null)
  }

  return (
    <div className="mt-4 space-y-4">
      {/* 顶部说明条 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <div className="text-sm font-semibold text-foreground">CBAM 申报模拟</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              面向出口欧盟的申报流程模拟：先在模拟任务列表中新建任务，进入任务后即可上传对应申报材料；置灰环节为进口商/主管机关职责，无需我方提供资料。
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setReqOpen(true)}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <BookOpen className="size-4" /> CBAM 申报要求详解
        </button>
      </div>

      {/* ① 模拟任务管理（列表置顶，支持增删改查） */}
      <Panel
        title="模拟任务管理"
        desc="每条记录为一次独立的 CBAM 申报模拟；进入任务后方可上传该任务的申报材料"
        actions={
          <button type="button" onClick={newTask} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="size-4" /> 新建模拟任务
          </button>
        }
      >
        <DataTable
          columns={[
            { key: 'id', label: '模拟编号', className: 'font-mono' },
            { key: 'scenario', label: '模拟场景' },
            { key: 'operator', label: '操作人' },
            { key: 'quarter', label: '申报季度' },
            { key: 'emission', label: '嵌入式排放', render: (r) => <span className="font-mono">{r.emission.toLocaleString()} <span className="text-xs text-muted-foreground">tCO2e</span></span> },
            { key: 'docCount', label: '资料', render: (r) => `${r.docCount} 份` },
            { key: 'progress', label: '完成度', render: (r) => (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${r.progress}%` }} /></div>
                <span className="text-xs text-muted-foreground">{r.progress}%</span>
              </div>
            ) },
            { key: 'status', label: '状态', render: (r) => <StatusBadge tone={r.status === '已完成' ? 'ok' : r.status === '模拟中' ? 'warn' : 'default'}>{r.status}</StatusBadge> },
            {
              key: 'action', label: '操作',
              render: (r) => (
                <div className="flex items-center gap-3 text-xs">
                  <button type="button" onClick={() => setActiveId(r.id)} className={`inline-flex items-center gap-1 hover:underline ${activeId === r.id ? 'font-semibold text-primary' : 'text-primary'}`}>
                    <ArrowRight className="size-3.5" /> {activeId === r.id ? '已进入' : '进入'}
                  </button>
                  <button type="button" onClick={() => setRecView(r)} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Eye className="size-3.5" /> 查看</button>
                  <button type="button" onClick={() => setTaskEdit({ isNew: false, data: { ...r } })} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Pencil className="size-3.5" /> 编辑</button>
                  <button type="button" onClick={() => setRecDel(r)} className="inline-flex items-center gap-1 text-[var(--destructive)] hover:underline"><Trash2 className="size-3.5" /> 删除</button>
                </div>
              ),
            },
          ]}
          rows={records}
        />
      </Panel>

      {/* ② 进入任务后的工作区：申报流程说明 + 申报材料上传 */}
      {active ? (
        <div className="space-y-4 rounded-2xl border border-primary/25 bg-primary/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-primary" />
              <h3 className="text-sm font-semibold text-foreground">当前模拟任务 · <span className="font-mono text-primary">{active.id}</span></h3>
              <span className="text-xs text-muted-foreground">{active.scenario} · {active.quarter}</span>
            </div>
            <button type="button" onClick={() => setActiveId(null)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <X className="size-3.5" /> 退出任务
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            {/* 左：流程说明（置灰非我方环节，点击弹窗详解） */}
            <div className="lg:col-span-2">
              <Panel title="申报流程说明">
                <ol className="relative space-y-3 pl-1">
                  {cbamDeclSteps.map((st, i) => {
                    const isUs = st.owner === 'us'
                    return (
                      <li key={st.step} className="relative flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                              !isUs
                                ? 'border border-border bg-secondary text-muted-foreground/60'
                                : st.done
                                  ? 'bg-primary text-primary-foreground'
                                  : 'border border-primary bg-primary/10 text-primary'
                            }`}
                          >
                            {!isUs ? <Lock className="size-3.5" /> : st.done ? <Check className="size-4" /> : st.step}
                          </span>
                          {i < cbamDeclSteps.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-border" />}
                        </div>
                        <button
                          type="button"
                          onClick={() => onStepClick(st)}
                          className={`flex-1 rounded-lg border p-2.5 text-left transition-colors ${
                            isUs ? 'border-border bg-panel hover:border-primary/50' : 'border-dashed border-border bg-secondary/30 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isUs ? 'text-foreground' : 'text-muted-foreground'}`}>{st.name}</span>
                            {isUs ? <Badge tone="default">需我方提供</Badge> : <Badge tone="default">非我方环节</Badge>}
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{st.desc}</div>
                          <div className="mt-1 text-[11px] text-muted-foreground/80">责任方：{st.ownerLabel} · 点击查看详解</div>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </Panel>
            </div>

            {/* 右：材料上传工具（与左侧「我方」步骤联动高亮） */}
            <div className="lg:col-span-3">
              <Panel title={`申报材料上传 · 已上传 ${uploaded}/${cbamDeclMaterials.length} 项${requiredMissing ? ` · 必填缺失 ${requiredMissing} 项` : ' · 必填齐备'}`}>
                {highlight.length > 0 && (
                  <div className="mb-3 flex items-center justify-between rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary">
                    <span>已联动高亮当前步骤所需 {highlight.length} 项材料</span>
                    <button type="button" onClick={() => setHighlight([])} className="text-muted-foreground hover:text-foreground">
                      清除高亮
                    </button>
                  </div>
                )}
                <div className="space-y-3">
                  {cbamDeclMaterials.map((m) => {
                    const on = highlight.includes(m.name)
                    return (
                      <div key={m.name} className={`rounded-lg border p-3 transition-colors ${on ? 'border-primary bg-primary/5' : 'border-border bg-secondary/40'}`}>
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm text-foreground">{m.name}</span>
                              <Badge tone={m.required ? 'warning' : 'default'}>{m.required ? '必填' : '选填'}</Badge>
                              {on && <Badge tone="default">当前步骤</Badge>}
                            </div>
                            <div className="mt-0.5 truncate text-xs text-muted-foreground">{m.desc}</div>
                          </div>
                          <StatusBadge tone={(files[m.name]?.length ?? 0) > 0 ? 'ok' : 'warn'}>{(files[m.name]?.length ?? 0) > 0 ? '已上传' : '待上传'}</StatusBadge>
                        </div>
                        <UploadBox files={files[m.name] ?? []} onAdd={() => addFile(m.name)} onRemove={(i) => removeFile(m.name, i)} />
                      </div>
                    )
                  })}
                </div>
              </Panel>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/20 px-6 py-12 text-center">
          <Upload className="size-8 text-muted-foreground" />
          <div className="text-sm font-medium text-foreground">尚未进入模拟任务</div>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            申报材料上传需先在上方「模拟任务管理」中新建并进入一个模拟任务。进入任务后，即可查看申报流程说明并上传该任务对应的申报材料。
          </p>
          <button type="button" onClick={newTask} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Plus className="size-4" /> 新建模拟任务
          </button>
        </div>
      )}

      {/* 弹窗：新建/编辑 模拟任务 */}
      <Modal
        open={!!taskEdit}
        onClose={() => setTaskEdit(null)}
        title={taskEdit?.isNew ? '新建模拟任务' : '编辑模拟任务'}
        footer={
          <>
            <button type="button" onClick={() => setTaskEdit(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">取消</button>
            <button type="button" onClick={saveTask} className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">保存</button>
          </>
        }
      >
        {taskEdit && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="模拟编号"><TextInput value={taskEdit.data.id} disabled onChange={() => {}} /></Field>
            <Field label="模拟场景">
              <SelectInput
                value={scenarioKeys.includes(taskEdit.data.scenario) ? taskEdit.data.scenario : scenarioKeys[0]}
                onChange={(v) => {
                  const s = cbamDeclScenarios.find((x) => `${x.factory} · ${x.product.split(' ')[0]}` === v)
                  setTaskEdit({ ...taskEdit, data: { ...taskEdit.data, scenario: v, emission: s?.emission ?? taskEdit.data.emission, quarter: s?.quarter ?? taskEdit.data.quarter } })
                }}
                options={scenarioKeys}
              />
            </Field>
            <Field label="操作人"><TextInput value={taskEdit.data.operator} onChange={(e) => setTaskEdit({ ...taskEdit, data: { ...taskEdit.data, operator: e.target.value } })} /></Field>
            <Field label="申报季度"><TextInput value={taskEdit.data.quarter} onChange={(e) => setTaskEdit({ ...taskEdit, data: { ...taskEdit.data, quarter: e.target.value } })} /></Field>
            <Field label="嵌入式排放 (tCO2e)"><TextInput type="number" value={String(taskEdit.data.emission)} onChange={(e) => setTaskEdit({ ...taskEdit, data: { ...taskEdit.data, emission: Number(e.target.value) || 0 } })} /></Field>
            <Field label="状态"><SelectInput value={taskEdit.data.status} onChange={(v) => setTaskEdit({ ...taskEdit, data: { ...taskEdit.data, status: v as CbamSimRecord['status'] } })} options={SIM_STATUS} /></Field>
          </div>
        )}
      </Modal>

      {/* 弹窗：单步骤详解 */}
      <Modal open={!!stepDetail} onClose={() => setStepDetail(null)} title={stepDetail ? `流程详解 · ${stepDetail.name}` : ''} description={stepDetail?.ownerLabel ? `责任方：${stepDetail.ownerLabel}` : undefined}>
        {stepDetail && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge tone={stepDetail.owner === 'us' ? 'default' : 'warning'}>{stepDetail.owner === 'us' ? '需我方提供资料' : '非我方环节'}</Badge>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{stepDetail.detail}</p>
            {stepDetail.docs.length > 0 && (
              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><ListChecks className="size-4" /> 本步骤对应需上传材料</div>
                <ul className="space-y-1">
                  {stepDetail.docs.map((d) => (
                    <li key={d} className="flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-2.5 py-1.5 text-sm text-foreground">
                      <Paperclip className="size-3.5 text-primary" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 弹窗：CBAM 申报要求详解 */}
      <Modal open={reqOpen} onClose={() => setReqOpen(false)} size="lg" title="CBAM 申报要求详解" description="碳边境调节机制（Carbon Border Adjustment Mechanism）科普">
        <div className="space-y-4">
          {cbamRequirementSections.map((s, i) => (
            <div key={s.title} className="rounded-lg border border-border bg-secondary/30 p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">{i + 1}</span>
                <span className="text-sm font-semibold text-foreground">{s.title}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* 弹窗：模拟记录查看 */}
      <Modal open={!!recView} onClose={() => setRecView(null)} title={recView ? `模拟记录 · ${recView.id}` : ''} description={recView?.scenario}>
        {recView && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="模拟场景"><div className="text-sm text-foreground">{recView.scenario}</div></Field>
            <Field label="操作人"><div className="text-sm text-foreground">{recView.operator}</div></Field>
            <Field label="申报季度"><div className="text-sm text-foreground">{recView.quarter}</div></Field>
            <Field label="嵌入式排放"><div className="font-mono text-sm text-foreground">{recView.emission.toLocaleString()} tCO2e</div></Field>
            <Field label="已上传资料"><div className="text-sm text-foreground">{recView.docCount} 份</div></Field>
            <Field label="完成度"><div className="text-sm text-foreground">{recView.progress}%</div></Field>
            <Field label="状态"><div className="text-sm text-foreground">{recView.status}</div></Field>
            <Field label="更新时间"><div className="text-sm text-foreground">{recView.updated}</div></Field>
          </div>
        )}
      </Modal>

      {/* 弹窗：删除模拟记录 */}
      <Modal open={!!recDel} onClose={() => setRecDel(null)} title="删除模拟记录"
        footer={
          <>
            <button type="button" onClick={() => setRecDel(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">取消</button>
            <button type="button" onClick={() => { if (recDel) setRecords((l) => l.filter((x) => x.id !== recDel.id)); setRecDel(null) }} className="h-9 rounded-md bg-[var(--destructive)] px-4 text-sm font-medium text-white">删除</button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">确认删除模拟记录 <span className="font-mono text-foreground">{recDel?.id}</span>？此操作不可撤销。</p>
      </Modal>
    </div>
  )
}

/* ============================ 知识库 ============================ */
const KTYPES = ['法规', '清单', '指南', '案例', '模板']

function KnowledgeModule() {
  const [items, setItems] = useState<CbamKnowledge[]>(cbamKnowledge)
  const [kw, setKw] = useState('')
  const [type, setType] = useState('all')

  const [edit, setEdit] = useState<CbamKnowledge | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [toDelete, setToDelete] = useState<CbamKnowledge | null>(null)
  const [detail, setDetail] = useState<CbamKnowledge | null>(null)

  const [assistantMsg, setAssistantMsg] = useState('')
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: '您好，我是 CBAM 知识库智能助手。可咨询法规条款、CN 编码归类、申报材料要求、季度申报流程等问题。' },
  ])

  const filtered = useMemo(
    () =>
      items.filter((k) => {
        if (type !== 'all' && k.type !== type) return false
        if (kw && !`${k.title}${k.summary}${k.tags.join('')}`.toLowerCase().includes(kw.toLowerCase())) return false
        return true
      }),
    [items, kw, type],
  )

  function openNew() {
    setIsNew(true)
    setEdit({
      id: `K${String(items.length + 1).padStart(3, '0')}`,
      title: '',
      type: '法规',
      sector: '通用',
      source: cbamKnowledgeSources[0],
      docNo: '',
      lang: cbamKnowledgeLangs[0],
      effectiveDate: new Date().toISOString().slice(0, 10),
      updated: new Date().toISOString().slice(0, 10),
      tags: [],
      summary: '',
      attachments: [],
    })
  }
  function openEdit(k: CbamKnowledge) {
    setIsNew(false)
    setEdit({ ...k })
  }
  function save() {
    if (!edit || !edit.title.trim()) return
    setItems((list) => (isNew ? [{ ...edit, updated: new Date().toISOString().slice(0, 10) }, ...list] : list.map((x) => (x.id === edit.id ? edit : x))))
    setEdit(null)
  }
  function confirmDelete() {
    if (toDelete) setItems((list) => list.filter((x) => x.id !== toDelete.id))
    setToDelete(null)
  }
  function send() {
    if (!assistantMsg.trim()) return
    const q = assistantMsg.trim()
    setChat((c) => [
      ...c,
      { role: 'user', text: q },
      {
        role: 'bot',
        text: '根据 CN 管控清单，电力变压器（HS 8504.23）对应 CN 码 85042300，属于 CBAM 管控范围。建议按季度提交实测嵌入式排放；缺失实测数据时可套用官方默认值 2.26 tCO2e/台，并在核查阶段补充第三方声明。',
      },
    ])
    setAssistantMsg('')
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Panel
          title="CBAM 知识库"
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={kw}
                  onChange={(e) => setKw(e.target.value)}
                  placeholder="关键词检索"
                  className="h-9 w-44 rounded-md border border-border bg-secondary pl-8 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
              <button type="button" onClick={openNew} className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                <Plus className="size-4" /> 新增
              </button>
            </div>
          }
        >
          <div className="mb-3 flex flex-wrap gap-1.5">
            {[{ v: 'all', l: '全部' }, ...KTYPES.map((t) => ({ v: t, l: t }))].map((t) => (
              <button
                key={t.v}
                type="button"
                onClick={() => setType(t.v)}
                className={`rounded-md px-3 py-1 text-xs transition-colors ${type === t.v ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'}`}
              >
                {t.l}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {filtered.map((k) => (
              <button key={k.id} type="button" onClick={() => setDetail(k)} className="rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-left transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2">
                    <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <div className="text-sm text-foreground">{k.title}</div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{k.summary}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span>{k.source}</span>
                        <span>·</span>
                        <span className="font-mono">{k.docNo}</span>
                        {k.attachments.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-primary">
                            <Paperclip className="size-3" />
                            {k.attachments.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone="default">{k.type}</Badge>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); openEdit(k) }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); openEdit(k) } }}
                      className="cursor-pointer text-muted-foreground hover:text-primary"
                      aria-label="编辑"
                    >
                      <Pencil className="size-3.5" />
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); setToDelete(k) }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setToDelete(k) } }}
                      className="cursor-pointer text-muted-foreground hover:text-[var(--destructive)]"
                      aria-label="删除"
                    >
                      <Trash2 className="size-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">未检索到符合条件的资料</div>}
          </div>
        </Panel>
      </div>

      <Panel title="CBAM 智能助手">
        <div className="flex h-[420px] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'border border-border bg-secondary/60 text-foreground'}`}>
                  {m.role === 'bot' && <Bot className="mb-1 size-4 text-primary" />}
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              value={assistantMsg}
              onChange={(e) => setAssistantMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) send()
              }}
              placeholder="输入合规问题…"
              className="h-9 flex-1 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <button type="button" onClick={send} className="inline-flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground" aria-label="发送">
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </Panel>

      {/* 详情 */}
      <Modal open={!!detail} onClose={() => setDetail(null)} size="lg" title={detail?.title ?? ''}>
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              <Meta label="分类" value={detail.type} />
              <Meta label="关联行业" value={detail.sector} />
              <Meta label="来源机构" value={detail.source} />
              <Meta label="文号/编号" value={detail.docNo} />
              <Meta label="语言" value={detail.lang} />
              <Meta label="生效日期" value={detail.effectiveDate} />
            </div>
            {detail.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {detail.tags.map((t) => (
                  <Badge key={t} tone="default">{t}</Badge>
                ))}
              </div>
            )}
            <div>
              <div className="mb-1 text-sm font-medium text-foreground">内容摘要</div>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail.summary}</p>
            </div>
            {detail.attachments.length > 0 && (
              <div>
                <div className="mb-2 text-sm font-medium text-foreground">附件材料</div>
                <div className="space-y-1.5">
                  {detail.attachments.map((a) => (
                    <div key={a.name} className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2 text-foreground">
                        <Paperclip className="size-4 text-primary" /> {a.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{a.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 新增 / 编辑 */}
      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        size="lg"
        title={isNew ? '新增知识库资料' : '编辑知识库资料'}
        footer={
          <>
            <button type="button" onClick={() => setEdit(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">
              取消
            </button>
            <button type="button" onClick={save} className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
              保存
            </button>
          </>
        }
      >
        {edit && (
          <div className="space-y-4">
            <Field label="标题">
              <TextInput value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="资料标题" />
            </Field>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="分类"><SelectInput value={edit.type} onChange={(v) => setEdit({ ...edit, type: v })} options={KTYPES} /></Field>
              <Field label="关联行业"><SelectInput value={edit.sector} onChange={(v) => setEdit({ ...edit, sector: v })} options={['通用', ...cbamSectors]} /></Field>
              <Field label="来源机构"><SelectInput value={edit.source} onChange={(v) => setEdit({ ...edit, source: v })} options={cbamKnowledgeSources} /></Field>
              <Field label="文号/编号"><TextInput value={edit.docNo} onChange={(e) => setEdit({ ...edit, docNo: e.target.value })} placeholder="如 EU 2023/956" /></Field>
              <Field label="语言"><SelectInput value={edit.lang} onChange={(v) => setEdit({ ...edit, lang: v })} options={cbamKnowledgeLangs} /></Field>
              <Field label="生效日期"><TextInput type="date" value={edit.effectiveDate} onChange={(e) => setEdit({ ...edit, effectiveDate: e.target.value })} /></Field>
            </div>
            <Field label="标签（逗号分隔）">
              <TextInput value={edit.tags.join(',')} onChange={(e) => setEdit({ ...edit, tags: e.target.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean) })} placeholder="过渡期, 申报义务" />
            </Field>
            <Field label="内容摘要">
              <textarea
                value={edit.summary}
                onChange={(e) => setEdit({ ...edit, summary: e.target.value })}
                rows={3}
                placeholder="资料内容摘要"
                className="rounded-md border border-border bg-panel px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="材料附件">
              <UploadBox
                files={edit.attachments.map((a) => a.name)}
                onAdd={() => setEdit({ ...edit, attachments: [...edit.attachments, { name: `附件${edit.attachments.length + 1}.pdf`, size: '—' }] })}
                onRemove={(i) => setEdit({ ...edit, attachments: edit.attachments.filter((_, idx) => idx !== i) })}
              />
            </Field>
          </div>
        )}
      </Modal>

      {/* 删除确认 */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="删除资料"
        footer={
          <>
            <button type="button" onClick={() => setToDelete(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">
              取消
            </button>
            <button type="button" onClick={confirmDelete} className="h-9 rounded-md bg-[var(--destructive)] px-4 text-sm font-medium text-white">
              确认删除
            </button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          确认删除资料 <span className="text-foreground">{toDelete?.title}</span>？此操作不可撤销。
        </p>
      </Modal>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-foreground">{value}</div>
    </div>
  )
}

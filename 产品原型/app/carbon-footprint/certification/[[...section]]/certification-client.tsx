'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Panel, StatusBadge, Toolbar, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import {
  certAgencies,
  certRequiredDocs,
  certApplications as seedApplications,
  certResults as seedResults,
  statusColor,
  type CertAgency,
  type CertApplication,
  type CertApplicationStatus,
  type CertResult,
} from '@/lib/mock-data'
import { leafUnits } from '@/lib/procurement'
import {
  Download, Upload, Plus, FileCheck, Building2, Clock, Repeat, Package, CheckCircle2, ArrowRight, Link2,
  Search, RotateCcw, Eye, Pencil, Trash2, ShieldCheck, UserCog, GitBranch, FileText, XCircle,
} from 'lucide-react'

const UNIT_OPTIONS = leafUnits.map((l) => l.name)
const PRODUCT_OPTIONS = Array.from(new Set(certAgencies.flatMap((a) => a.products)))
const TYPE_OPTIONS = Object.keys(certRequiredDocs)

type Role = 'group' | 'unit'

/* 申请状态 → 徽标色 */
function appTone(s: CertApplicationStatus): 'ok' | 'warn' | 'info' | 'danger' {
  if (s === '已通过' || s === '已出证') return 'ok'
  if (s === '待补件' || s === '待提交材料' || s === '待集团审批') return 'warn'
  if (s === '已退回') return 'danger'
  return 'info'
}

/* 全流程节点（申请生命周期） */
const FLOW_STEPS = ['发起申请', '集团审批', '准备材料清单', '上传申报材料', '线下认证', '上传报告与证书', '出证归档']
function stepIndexOf(a: CertApplication): number {
  if (a.status === '待集团审批') return 1
  if (a.status === '已退回') return 1
  if (a.status === '待提交材料') return 2
  if (a.status === '材料已上传') return 3
  if (a.status === '线下认证中' || a.status === '待补件') return 4
  if (a.status === '已通过') return 5
  if (a.status === '已出证') return 6
  return 0
}

export default function CertificationClient({ tab: initialTab }: { tab?: string }) {
  const params = useParams()
  const seg = Array.isArray(params?.section) ? params.section[0] : (params?.section as string | undefined)
  const tab = seg ?? initialTab ?? 'material'

  const [role, setRole] = useState<Role>('group')
  const [applications, setApplications] = useState<CertApplication[]>(() => seedApplications.map((a) => ({ ...a })))
  const [results, setResults] = useState<CertResult[]>(() => seedResults.map((r) => ({ ...r })))

  /* ---------- 认证机构管理 ---------- */
  const [agencyFilter, setAgencyFilter] = useState('all')
  const agencies = agencyFilter === 'all' ? certAgencies : certAgencies.filter((a) => a.id === agencyFilter)
  const [detailAgency, setDetailAgency] = useState<CertAgency | null>(null)

  /* ---------- 认证申请：查询 ---------- */
  const [qUnit, setQUnit] = useState('all')
  const [qStatus, setQStatus] = useState('all')
  const [qKw, setQKw] = useState('')
  const [appApplied, setAppApplied] = useState({ unit: 'all', status: 'all', kw: '' })
  const filteredApps = useMemo(
    () =>
      applications.filter((a) => {
        if (appApplied.unit !== 'all' && a.unit !== appApplied.unit) return false
        if (appApplied.status !== 'all' && a.status !== appApplied.status) return false
        if (appApplied.kw && !`${a.no}${a.product}`.toLowerCase().includes(appApplied.kw.toLowerCase())) return false
        return true
      }),
    [applications, appApplied],
  )

  /* ---------- 发起 / 编辑申请 ---------- */
  const [applyOpen, setApplyOpen] = useState(false)
  const [editingNo, setEditingNo] = useState<string | null>(null)
  const [draft, setDraft] = useState({ unit: UNIT_OPTIONS[0], product: PRODUCT_OPTIONS[0], agency: certAgencies[0].name, type: TYPE_OPTIONS[0] })
  const draftAgency = useMemo(() => certAgencies.find((a) => a.name === draft.agency) ?? certAgencies[0], [draft.agency])
  const draftDocs = certRequiredDocs[draft.type] ?? []

  /* ---------- 审批 / 流程 / 出证 ---------- */
  const [approveFor, setApproveFor] = useState<CertApplication | null>(null)
  const [approveNote, setApproveNote] = useState('')
  const [flowFor, setFlowFor] = useState<CertApplication | null>(null)
  const [issueFor, setIssueFor] = useState<CertApplication | null>(null)
  const [issueDraft, setIssueDraft] = useState({ cert: '', validTo: '' })

  /* ---------- 认证结果 CRUD ---------- */
  const [resultForm, setResultForm] = useState<CertResult | null>(null)
  const [resultIsNew, setResultIsNew] = useState(false)
  const [resultDraft, setResultDraft] = useState<Partial<CertResult>>({})
  const [previewCert, setPreviewCert] = useState<CertResult | null>(null)
  const [delCert, setDelCert] = useState<CertResult | null>(null)

  function openApply() {
    setEditingNo(null)
    setDraft({ unit: UNIT_OPTIONS[0], product: PRODUCT_OPTIONS[0], agency: certAgencies[0].name, type: TYPE_OPTIONS[0] })
    setApplyOpen(true)
  }
  function openEditApply(a: CertApplication) {
    setEditingNo(a.no)
    setDraft({ unit: a.unit, product: a.product, agency: a.agency, type: a.type })
    setApplyOpen(true)
  }
  function submitApply() {
    if (editingNo) {
      setApplications((prev) => prev.map((a) => (a.no === editingNo ? { ...a, ...draft } : a)))
    } else {
      const seq = 121 + applications.filter((a) => a.no.startsWith('CA-2026')).length
      setApplications((prev) => [
        { no: `CA-2026-${seq}`, product: draft.product, unit: draft.unit, agency: draft.agency, type: draft.type, status: '待集团审批', date: '2026-09-02', materialsUploaded: false, reportUploaded: false, approval: '待审批' },
        ...prev,
      ])
    }
    setApplyOpen(false)
  }
  function withdraw(no: string) {
    setApplications((prev) => prev.filter((a) => a.no !== no))
  }
  function decide(pass: boolean) {
    if (!approveFor) return
    setApplications((prev) =>
      prev.map((a) =>
        a.no === approveFor.no
          ? { ...a, approval: pass ? '已通过' : '已退回', status: pass ? '待提交材料' : '已退回', approvalNote: approveNote || (pass ? '审批通过' : '审批退回') }
          : a,
      ),
    )
    setApproveFor(null)
    setApproveNote('')
  }
  function uploadMaterials(no: string) {
    setApplications((prev) => prev.map((a) => (a.no === no ? { ...a, materialsUploaded: true, status: '线下认证中' } : a)))
  }
  function openIssue(app: CertApplication) {
    setIssueFor(app)
    const nextSeq = String(92 + results.filter((r) => r.cert.startsWith('CERT-2026')).length).padStart(4, '0')
    setIssueDraft({ cert: `CERT-2026-${nextSeq}`, validTo: '2029-09-02' })
  }
  function submitIssue() {
    if (!issueFor) return
    setResults((prev) => [
      { cert: issueDraft.cert, fromNo: issueFor.no, product: issueFor.product, unit: issueFor.unit, agency: issueFor.agency, issued: '2026-09-02', validTo: issueDraft.validTo, status: '有效' },
      ...prev,
    ])
    setApplications((prev) => prev.map((a) => (a.no === issueFor.no ? { ...a, status: '已出证', reportUploaded: true, certNo: issueDraft.cert } : a)))
    setIssueFor(null)
  }

  /* 结果 CRUD */
  function openResultAdd() {
    const cert = `CERT-2026-${String(92 + results.length).padStart(4, '0')}`
    const base = { cert, fromNo: '', product: PRODUCT_OPTIONS[0], unit: UNIT_OPTIONS[0], agency: certAgencies[0].name, issued: '2026-09-02', validTo: '2029-09-02', status: '有效' as const }
    setResultIsNew(true)
    setResultForm(base)
    setResultDraft(base)
  }
  function openResultEdit(r: CertResult) {
    setResultIsNew(false)
    setResultForm(r)
    setResultDraft({ ...r })
  }
  function saveResult() {
    const d = resultDraft as CertResult
    setResults((prev) => (resultIsNew ? [{ ...d }, ...prev] : prev.map((r) => (r.cert === resultForm!.cert ? { ...r, ...d } : r))))
    setResultForm(null)
  }
  function deleteResult() {
    if (delCert) setResults((prev) => prev.filter((r) => r.cert !== delCert.cert))
    setDelCert(null)
  }

  return (
    <div>
      {/* 角色切换（集团 / 经营单位）——申请页操作因角色而异 */}
      {tab === 'apply' && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">当前视角</span>
          <div className="inline-flex overflow-hidden rounded-md border border-border">
            <button type="button" onClick={() => setRole('group')} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${role === 'group' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <ShieldCheck className="size-4" /> 集团端
            </button>
            <button type="button" onClick={() => setRole('unit')} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${role === 'unit' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <UserCog className="size-4" /> 经营单位
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            {role === 'group' ? '集团负责审批经营单位申请、查看内容、审理流程与状态' : '经营单位可发起/编辑申请、上传资料、查看流程、撤销申请'}
          </span>
        </div>
      )}

      {/* ============ 认证机构管理 ============ */}
      {tab === 'material' && (
        <div className="mt-4 space-y-4">
          <Toolbar>
            <Select
              label="认证机构"
              value={agencyFilter}
              onChange={setAgencyFilter}
              options={[{ value: 'all', label: '全部机构' }, ...certAgencies.map((a) => ({ value: a.id, label: a.name }))]}
            />
            <span className="text-xs text-muted-foreground">管理合作认证机构：资质范围、出证周期、合作记录与资料模板（点击卡片查看详情）</span>
          </Toolbar>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {agencies.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setDetailAgency(a)}
                className="rounded-xl border border-border bg-panel p-5 text-left transition-colors hover:border-primary/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="size-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.scope}</div>
                    </div>
                  </div>
                  <StatusBadge tone={a.status === '合作中' ? 'ok' : 'warn'}>{a.status}</StatusBadge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4 text-primary" /> 出证周期
                    <span className="font-medium text-foreground">{a.cycle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Repeat className="size-4 text-primary" /> 合作次数
                    <span className="font-mono font-medium text-foreground">{a.cooperations}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Package className="size-3.5" /> 合作产品
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {a.products.map((p) => (
                      <Badge key={p} tone="default">{p}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">{a.templates.length} 个资料模板 · {a.records.length} 条合作记录</span>
                  <span className="inline-flex items-center gap-1 text-primary">查看详情 <ArrowRight className="size-3.5" /></span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ============ 认证申请 ============ */}
      {tab === 'apply' && (
        <div className="mt-4 space-y-4">
          {/* 流程说明 */}
          <Panel title="认证申请流程" desc="经营单位发起 → 集团审批 → 材料清单与模板 → 上传申报材料 → 线下认证 → 上传报告与证书出证归档">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {FLOW_STEPS.map((s, i, arr) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-foreground">{s}</span>
                  {i < arr.length - 1 && <ArrowRight className="size-3.5 text-primary" />}
                </span>
              ))}
            </div>
          </Panel>

          {/* 查询 + 发起 */}
          <Toolbar>
            <Select label="经营单位" value={qUnit} onChange={setQUnit} options={[{ value: 'all', label: '全部经营单位' }, ...Array.from(new Set(applications.map((a) => a.unit))).map((u) => ({ value: u, label: u }))]} />
            <Select label="状态" value={qStatus} onChange={setQStatus} options={[{ value: 'all', label: '全部状态' }, ...Array.from(new Set(applications.map((a) => a.status))).map((s) => ({ value: s, label: s }))]} />
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">编号 / 产品</span>
              <input value={qKw} onChange={(e) => setQKw(e.target.value)} placeholder="关键字" className="h-9 w-44 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <button type="button" onClick={() => setAppApplied({ unit: qUnit, status: qStatus, kw: qKw.trim() })} className="inline-flex h-9 items-center gap-1.5 self-end rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"><Search className="size-4" /> 查询</button>
            <button type="button" onClick={() => { setQUnit('all'); setQStatus('all'); setQKw(''); setAppApplied({ unit: 'all', status: 'all', kw: '' }) }} className="inline-flex h-9 items-center gap-1.5 self-end rounded-md border border-border px-3 text-sm text-muted-foreground hover:text-foreground"><RotateCcw className="size-4" /> 重置</button>
            {role === 'unit' && (
              <button type="button" onClick={openApply} className="ml-auto inline-flex h-9 items-center gap-1.5 self-end rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium text-primary hover:bg-primary/20">
                <Plus className="size-4" /> 发起认证申请
              </button>
            )}
          </Toolbar>

          <DataTable
            columns={[
              { key: 'no', label: '申请编号', className: 'font-mono' },
              { key: 'product', label: '产品型号' },
              { key: 'unit', label: '经营单位' },
              { key: 'agency', label: '认证机构' },
              { key: 'type', label: '认证类型' },
              { key: 'approval', label: '集团审批', render: (r: CertApplication) => <StatusBadge tone={r.approval === '已通过' ? 'ok' : r.approval === '已退回' ? 'danger' : 'warn'}>{r.approval}</StatusBadge> },
              { key: 'status', label: '状态', render: (r: CertApplication) => <StatusBadge tone={appTone(r.status)}>{r.status}</StatusBadge> },
              {
                key: 'action',
                label: '操作',
                render: (r: CertApplication) =>
                  role === 'group' ? (
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <button type="button" onClick={() => setFlowFor(r)} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Eye className="size-3.5" /> 查看详情</button>
                      <button type="button" onClick={() => setFlowFor(r)} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><GitBranch className="size-3.5" /> 审理流程</button>
                      {r.approval === '待审批' ? (
                        <button type="button" onClick={() => { setApproveFor(r); setApproveNote('') }} className="inline-flex items-center gap-1 text-primary hover:underline"><CheckCircle2 className="size-3.5" /> 审批</button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">状态：{r.status}</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <button type="button" onClick={() => setFlowFor(r)} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><GitBranch className="size-3.5" /> 查看流程</button>
                      {(r.status === '待集团审批' || r.status === '已退回') && (
                        <button type="button" onClick={() => openEditApply(r)} className="inline-flex items-center gap-1 text-primary hover:underline"><Pencil className="size-3.5" /> 编辑</button>
                      )}
                      {r.approval === '已通过' && !r.materialsUploaded && r.status !== '已出证' && (
                        <button type="button" onClick={() => uploadMaterials(r.no)} className="inline-flex items-center gap-1 text-primary hover:underline"><Upload className="size-3.5" /> 上传资料</button>
                      )}
                      {r.materialsUploaded && r.status !== '已出证' && (
                        <button type="button" onClick={() => openIssue(r)} className="inline-flex items-center gap-1 text-primary hover:underline"><FileCheck className="size-3.5" /> 上传报告/证书</button>
                      )}
                      {r.status !== '已出证' && (
                        <button type="button" onClick={() => withdraw(r.no)} className="inline-flex items-center gap-1 text-[var(--destructive)] hover:underline"><XCircle className="size-3.5" /> 撤销申请</button>
                      )}
                      {r.status === '已出证' && <span className="inline-flex items-center gap-1 text-muted-foreground"><CheckCircle2 className="size-3.5 text-primary" /> 已出证 {r.certNo}</span>}
                    </div>
                  ),
              },
            ]}
            rows={filteredApps}
          />
        </div>
      )}

      {/* ============ 认证结果管理（增删改查 + 预览/下载） ============ */}
      {tab === 'result' && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <KpiCard label="有效证书" value={String(results.filter((r) => r.status === '有效').length)} unit="份" trend="闭环归档" up />
            <KpiCard label="临期证书" value={String(results.filter((r) => r.status === '临期').length)} unit="份" trend="需续期" up={false} />
            <KpiCard label="已过期" value={String(results.filter((r) => r.status === '已过期').length)} unit="份" trend="已禁用" up={false} />
            <KpiCard label="合作机构" value={String(certAgencies.length)} unit="家" trend="" up />
          </div>
          <Panel
            title="认证结果归档"
            desc="证书与来源申请一一对应，形成申请-出证闭环；支持新增、编辑、删除、预览与下载"
            actions={
              <button type="button" onClick={openResultAdd} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"><Plus className="size-4" /> 新增证书</button>
            }
          >
            <DataTable
              columns={[
                { key: 'cert', label: '证书编号', className: 'font-mono' },
                { key: 'fromNo', label: '来源申请', render: (r: CertResult) => <span className="inline-flex items-center gap-1 font-mono text-xs text-primary"><Link2 className="size-3.5" /> {r.fromNo || '—'}</span> },
                { key: 'product', label: '产品型号' },
                { key: 'unit', label: '经营单位' },
                { key: 'agency', label: '认证机构' },
                { key: 'validTo', label: '有效期至' },
                { key: 'status', label: '状态', render: (r: CertResult) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge> },
                {
                  key: 'action',
                  label: '操作',
                  render: (r: CertResult) => (
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <button type="button" onClick={() => setPreviewCert(r)} className="inline-flex items-center gap-1 text-primary hover:underline"><Eye className="size-3.5" /> 预览</button>
                      <button type="button" onClick={() => setPreviewCert(r)} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Download className="size-3.5" /> 下载</button>
                      <button type="button" onClick={() => openResultEdit(r)} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Pencil className="size-3.5" /> 编辑</button>
                      <button type="button" onClick={() => setDelCert(r)} className="inline-flex items-center gap-1 text-[var(--destructive)] hover:underline"><Trash2 className="size-3.5" /> 删除</button>
                    </div>
                  ),
                },
              ]}
              rows={results}
            />
          </Panel>
        </div>
      )}

      {/* ---------- 机构详情弹窗 ---------- */}
      <Modal open={!!detailAgency} onClose={() => setDetailAgency(null)} size="lg" title={detailAgency ? `${detailAgency.name} · 机构详情` : ''} description={detailAgency?.scope}>
        {detailAgency && (
          <div className="space-y-4">
            <p className="rounded-lg border border-border bg-secondary/40 p-3 text-sm leading-relaxed text-muted-foreground">{detailAgency.intro}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="成立信息" value={detailAgency.established} />
              <Info label="出证周期" value={detailAgency.cycle} />
              <Info label="合作次数" value={`${detailAgency.cooperations} 次`} />
              <Info label="对接联系人" value={detailAgency.contact} />
            </div>
            <div>
              <div className="mb-1.5 text-xs text-muted-foreground">认可资质</div>
              <div className="flex flex-wrap gap-1.5">{detailAgency.qualifications.map((q) => <Badge key={q} tone="primary">{q}</Badge>)}</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-muted-foreground">合作记录</div>
              <DataTable
                columns={[
                  { key: 'date', label: '日期', className: 'font-mono text-xs' },
                  { key: 'product', label: '产品' },
                  { key: 'unit', label: '经营单位' },
                  { key: 'type', label: '认证类型' },
                  { key: 'result', label: '结果' },
                ]}
                rows={detailAgency.records}
              />
            </div>
            <div>
              <div className="mb-2 text-xs text-muted-foreground">资料模板</div>
              <ul className="space-y-1.5">
                {detailAgency.templates.map((t) => (
                  <li key={t.name} className="flex items-center justify-between gap-2 rounded-md border border-border bg-panel px-3 py-2 text-sm">
                    <span className="text-foreground">{t.name}</span>
                    <span className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-mono">{t.version}</span>
                      <span>{t.updated}</span>
                      <button type="button" className="inline-flex items-center gap-1 text-primary hover:underline"><Download className="size-3.5" /> 下载</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------- 发起 / 编辑申请 ---------- */}
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} size="lg" title={editingNo ? `编辑认证申请 · ${editingNo}` : '发起认证申请'} description="选择经营单位、产品与认证机构，系统据认证类型提供所需材料清单与模板">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select label="经营单位" value={draft.unit} onChange={(v) => setDraft((d) => ({ ...d, unit: v }))} options={UNIT_OPTIONS.map((u) => ({ value: u, label: u }))} />
            <Select label="产品型号" value={draft.product} onChange={(v) => setDraft((d) => ({ ...d, product: v }))} options={PRODUCT_OPTIONS.map((p) => ({ value: p, label: p }))} />
            <Select label="认证机构" value={draft.agency} onChange={(v) => setDraft((d) => ({ ...d, agency: v }))} options={certAgencies.map((a) => ({ value: a.name, label: a.name }))} />
            <Select label="认证类型" value={draft.type} onChange={(v) => setDraft((d) => ({ ...d, type: v }))} options={TYPE_OPTIONS.map((t) => ({ value: t, label: t }))} />
          </div>
          <div className="rounded-lg border border-border bg-secondary/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{draftAgency.name} · 所需材料清单</span>
              <span className="text-[11px] text-muted-foreground">出证周期 {draftAgency.cycle}</span>
            </div>
            <ul className="mb-3 space-y-1">
              {draftDocs.map((doc) => (
                <li key={doc} className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="size-3.5 text-primary" /> {doc}</li>
              ))}
            </ul>
            <div className="border-t border-border pt-2">
              <div className="mb-1.5 text-[11px] text-muted-foreground">可下载模板</div>
              <div className="flex flex-wrap gap-2">
                {draftAgency.templates.map((t) => (
                  <button key={t.name} type="button" className="inline-flex items-center gap-1 rounded-md border border-border bg-panel px-2.5 py-1 text-xs text-primary hover:border-primary"><Download className="size-3.5" /> {t.name}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setApplyOpen(false)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">取消</button>
            <button type="button" onClick={submitApply} className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">{editingNo ? '保存修改' : '提交申请'}</button>
          </div>
        </div>
      </Modal>

      {/* ---------- 审批弹窗 ---------- */}
      <Modal open={!!approveFor} onClose={() => setApproveFor(null)} title="申请审批" description={approveFor ? `${approveFor.no} · ${approveFor.unit} · ${approveFor.product}` : ''}>
        {approveFor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="认证机构" value={approveFor.agency} />
              <Info label="认证类型" value={approveFor.type} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">审批意见</label>
              <textarea value={approveNote} onChange={(e) => setApproveNote(e.target.value)} rows={3} placeholder="填写审批意见…" className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => decide(false)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--destructive)]/40 px-4 text-sm text-[var(--destructive)] hover:bg-[var(--destructive)]/10"><XCircle className="size-4" /> 退回</button>
              <button type="button" onClick={() => decide(true)} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"><CheckCircle2 className="size-4" /> 通过</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------- 流程 / 详情弹窗 ---------- */}
      <Modal open={!!flowFor} onClose={() => setFlowFor(null)} title={flowFor ? `申请流程 · ${flowFor.no}` : ''} description={flowFor ? `${flowFor.unit} · ${flowFor.product} · ${flowFor.agency}` : ''}>
        {flowFor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="认证类型" value={flowFor.type} />
              <Info label="申请日期" value={flowFor.date} />
              <Info label="集团审批" value={flowFor.approval} />
              <Info label="当前状态" value={flowFor.status} />
            </div>
            {flowFor.approvalNote && (
              <div className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">审批意见：{flowFor.approvalNote}</div>
            )}
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground"><GitBranch className="size-4 text-primary" /> 流程节点</div>
              <ol className="relative space-y-3 border-l border-border pl-4">
                {FLOW_STEPS.map((s, i) => {
                  const cur = stepIndexOf(flowFor)
                  const done = i < cur
                  const active = i === cur
                  return (
                    <li key={s} className="relative">
                      <span className={`absolute -left-[21px] top-1 size-2.5 rounded-full border-2 ${active ? 'border-primary bg-primary' : done ? 'border-primary bg-background' : 'border-border bg-background'}`} />
                      <div className={`text-sm ${active ? 'font-medium text-primary' : done ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------- 上传报告/证书 → 出证 ---------- */}
      <Modal open={!!issueFor} onClose={() => setIssueFor(null)} title="上传报告与证书" description={issueFor ? `申请 ${issueFor.no} · ${issueFor.product} · ${issueFor.agency}` : ''}>
        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 py-5 text-sm text-muted-foreground hover:border-primary">
            <Upload className="size-6 text-primary" /> 上传认证报告与证书扫描件
            <input type="file" className="hidden" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">证书编号</label>
              <input value={issueDraft.cert} onChange={(e) => setIssueDraft((d) => ({ ...d, cert: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">有效期至</label>
              <input type="date" value={issueDraft.validTo} onChange={(e) => setIssueDraft((d) => ({ ...d, validTo: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">提交后将生成证书并归档至“认证结果管理”，与本申请编号关联形成闭环。</p>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setIssueFor(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">取消</button>
            <button type="button" onClick={submitIssue} className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">确认出证</button>
          </div>
        </div>
      </Modal>

      {/* ---------- 结果 新增/编辑 ---------- */}
      <Modal open={!!resultForm} onClose={() => setResultForm(null)} title={resultForm && results.some((r) => r.cert === resultForm.cert) ? `编辑证书 · ${resultForm.cert}` : '新增证书'}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">证书编号</label>
              <input value={resultDraft.cert ?? ''} onChange={(e) => setResultDraft((d) => ({ ...d, cert: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">来源申请</label>
              <input value={resultDraft.fromNo ?? ''} onChange={(e) => setResultDraft((d) => ({ ...d, fromNo: e.target.value }))} placeholder="可选" className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="产品型号" value={resultDraft.product ?? PRODUCT_OPTIONS[0]} onChange={(v) => setResultDraft((d) => ({ ...d, product: v }))} options={PRODUCT_OPTIONS.map((p) => ({ value: p, label: p }))} />
            <Select label="经营单位" value={resultDraft.unit ?? UNIT_OPTIONS[0]} onChange={(v) => setResultDraft((d) => ({ ...d, unit: v }))} options={UNIT_OPTIONS.map((u) => ({ value: u, label: u }))} />
            <Select label="认证机构" value={resultDraft.agency ?? certAgencies[0].name} onChange={(v) => setResultDraft((d) => ({ ...d, agency: v }))} options={certAgencies.map((a) => ({ value: a.name, label: a.name }))} />
            <Select label="状态" value={resultDraft.status ?? '有效'} onChange={(v) => setResultDraft((d) => ({ ...d, status: v as CertResult['status'] }))} options={['有效', '临期', '已过期'].map((s) => ({ value: s, label: s }))} />
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">出证日期</label>
              <input type="date" value={resultDraft.issued ?? ''} onChange={(e) => setResultDraft((d) => ({ ...d, issued: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">有效期至</label>
              <input type="date" value={resultDraft.validTo ?? ''} onChange={(e) => setResultDraft((d) => ({ ...d, validTo: e.target.value }))} className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setResultForm(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">取消</button>
            <button type="button" onClick={saveResult} className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">保存</button>
          </div>
        </div>
      </Modal>

      {/* ---------- 证书预览 ---------- */}
      <Modal open={!!previewCert} onClose={() => setPreviewCert(null)} title={`证书预览 · ${previewCert?.cert ?? ''}`} footer={<><button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground"><Download className="size-4" /> 下载 PDF</button><button type="button" onClick={() => setPreviewCert(null)} className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">关闭</button></>}>
        {previewCert && (
          <div className="rounded-lg border border-border bg-secondary/30 p-6">
            <div className="flex flex-col items-center gap-2 border-b border-border pb-4 text-center">
              <FileText className="size-8 text-primary" />
              <div className="text-base font-semibold text-foreground">产品碳足迹认证证书</div>
              <div className="font-mono text-sm text-primary">{previewCert.cert}</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Info label="产品型号" value={previewCert.product} />
              <Info label="经营单位" value={previewCert.unit} />
              <Info label="认证机构" value={previewCert.agency} />
              <Info label="来源申请" value={previewCert.fromNo || '—'} />
              <Info label="出证日期" value={previewCert.issued} />
              <Info label="有效期至" value={previewCert.validTo} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>状态：{previewCert.status}</span>
              <span>扫码验真 · {previewCert.cert}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------- 删除证书 ---------- */}
      <Modal open={!!delCert} onClose={() => setDelCert(null)} title="删除证书" footer={<><button type="button" onClick={() => setDelCert(null)} className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground">取消</button><button type="button" onClick={deleteResult} className="h-9 rounded-md bg-[var(--destructive)] px-4 text-sm font-medium text-white">确认删除</button></>}>
        <p className="text-sm text-muted-foreground">确认删除证书 <span className="font-mono text-foreground">{delCert?.cert}</span>（{delCert?.product}）？此操作不可撤销。</p>
      </Modal>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-panel px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm text-foreground">{value}</div>
    </div>
  )
}

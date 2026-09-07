'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { StatusBadge, Toolbar, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import {
  certAgencies,
  certResults as seedResults,
  statusColor,
  type CertAgency,
  type CertResult,
} from '@/lib/mock-data'
import { leafUnits } from '@/lib/procurement'
import {
  Download,
  Upload,
  Plus,
  FileCheck,
  Building2,
  Clock,
  CheckCircle2,
  ArrowRight,
  Link2,
  Search,
  RotateCcw,
  Eye,
  Pencil,
  Trash2,
  FileText,
  XCircle,
  Paperclip,
  Check,
  ShieldCheck,
} from 'lucide-react'

const UNIT_OPTIONS = leafUnits.map((l) => l.name)
const PRODUCT_OPTIONS = [
  'SZ11-2500/10 变压器',
  'SZ11-1600/10 变压器',
  'SFZ11-110 电力变压器',
  'YJV22-8.7/15 电缆',
  'YJLW03-64/110 高压电缆',
  'LGJ-400/35 钢芯铝绞线',
  'KYN28A-12 开关柜',
  'ZF12-126(L) GIS',
  'BAM6.6-334 电容器',
  'BKD-60000/500 电抗器',
  'BRDLW-110 套管',
  'LVQB-220 互感器',
  'ZGL-252 GIL',
  'CRGO-085 硅钢铁心',
  '1K101 非晶合金铁心',
]

/* 权威认证/评价事项列表 */
export const CERT_MATTERS = [
  '全部事项',
  'ISO 14067 产品碳足迹认证',
  'EPD 环境产品声明',
  '零碳工厂自评估评价',
  '绿色设计产品评价',
  'CBAM 碳排第三方核验',
]

/* 每一类认证/评价事项的材料清单规范（系统自动给出 vs 用户线下自备 + 模板支持） */
export interface CertMaterialItem {
  name: string
  source: 'system' | 'offline' // '系统自动给出' | '用户线下自备'
  hasTemplate: boolean
  templateName?: string
  format?: string
  desc: string
}

export const CERT_MATTER_MATERIALS: Record<string, CertMaterialItem[]> = {
  'ISO 14067 产品碳足迹认证': [
    {
      name: '产品 BOM 详细材料定额表',
      source: 'system',
      hasTemplate: true,
      templateName: '特变电工产品BOM清单标准导出.xlsx',
      format: 'XLSX',
      desc: '系统从 ERP/PLM 模块自动抓取，涵盖主要铜、铝、硅钢及绝缘介质物理消耗量',
    },
    {
      name: '工厂近12个月连续能耗实测台账',
      source: 'system',
      hasTemplate: true,
      templateName: '用能在线监测月度消耗报表.pdf',
      format: 'PDF',
      desc: '系统采集中心自动生成电力、天然气、蒸汽分项计量及折标煤数据',
    },
    {
      name: '碳足迹核算模型与 LCA 数据集清单',
      source: 'system',
      hasTemplate: true,
      templateName: 'LCA生命周期清单核算底稿.zip',
      format: 'ZIP',
      desc: '系统基于特变因子库自动输出生命周期各阶段排放核算底稿与溯源链',
    },
    {
      name: '企业营业执照与法人代表身份证明',
      source: 'offline',
      hasTemplate: false,
      desc: '法定有效营业执照正副本彩色扫描件，加盖申报企业公章（无需固定格式模板）',
    },
    {
      name: '第三方认证委托检验协议与审核确认书',
      source: 'offline',
      hasTemplate: true,
      templateName: '第三方认证委托检验协议范本.docx',
      format: 'DOCX',
      desc: '明确认证范围、产品型号规格、执行技术标准及双方权利义务',
    },
    {
      name: '车间生产工艺流向图与工序布置说明',
      source: 'offline',
      hasTemplate: true,
      templateName: '生产工艺流程图规范模板.docx',
      format: 'DOCX',
      desc: '涵盖铁心剪切、绕线、烘干、总装试验等关键工序节点与边界界定',
    },
    {
      name: '主要原辅材料供应商碳足迹声明函',
      source: 'offline',
      hasTemplate: true,
      templateName: '供应商原辅料碳排放声明函模板.docx',
      format: 'DOCX',
      desc: '上游铜杆、硅钢片供应商出具的碳因子证明或采购发票核算凭据',
    },
  ],
  'EPD 环境产品声明': [
    {
      name: 'PCR 产品类别规则符合性对照表',
      source: 'system',
      hasTemplate: true,
      templateName: 'PCR合规性基准评估表.xlsx',
      format: 'XLSX',
      desc: '系统自动依据国际 EPD 组织对应规则生成符合性指标映射',
    },
    {
      name: 'LCI 生命周期清单建模原始源数据',
      source: 'system',
      hasTemplate: true,
      templateName: 'LCI输入输出平衡数据包.json',
      format: 'JSON',
      desc: '系统根据订单实测数据导出全流程物料及能量平衡输入输出',
    },
    {
      name: '原辅料物流运输距离与载具凭单',
      source: 'offline',
      hasTemplate: true,
      templateName: '原材料干线运输物流台账模板.xlsx',
      format: 'XLSX',
      desc: '供应商发货地至特变工厂的铁路/公路吨公里数与货运提单',
    },
    {
      name: '固体废物无害化处置与转移联单',
      source: 'offline',
      hasTemplate: false,
      desc: '危险废物与一般工业固废法定转移联单及资质单位回收证明扫描件',
    },
  ],
  '零碳工厂自评估评价': [
    {
      name: '工厂近三年温室气体排放核算清单',
      source: 'system',
      hasTemplate: true,
      templateName: '温室气体范围一二三盘查报告.pdf',
      format: 'PDF',
      desc: '系统自动依据 ISO 14064-1 标准出具工厂级年度温室气体盘查汇总',
    },
    {
      name: '可再生能源消纳与自建光伏计量凭证',
      source: 'system',
      hasTemplate: true,
      templateName: '微电网分布式光伏发电台账.xlsx',
      format: 'XLSX',
      desc: '集控中心直供绿电、屋顶光伏发电计量与绿证划转凭证',
    },
    {
      name: '节能降碳技改项目实施效益证明',
      source: 'offline',
      hasTemplate: true,
      templateName: '工厂节能技改项目实施成效总结模板.docx',
      format: 'DOCX',
      desc: '余热利用、变频改造及智能控制项目立项与第三方节能量审核说明',
    },
    {
      name: '能源管理体系 (ISO 50001) 认证证书',
      source: 'offline',
      hasTemplate: false,
      desc: '在有效期内的 ISO 50001 能源管理体系证书彩色扫描件',
    },
  ],
  '绿色设计产品评价': [
    {
      name: '产品材料可回收利用率核算说明书',
      source: 'system',
      hasTemplate: true,
      templateName: '产品材料可回收利用率核算表.pdf',
      format: 'PDF',
      desc: '系统自动依据产品 BOM 金属与聚合物成分计算可再生回收率（≥95%）',
    },
    {
      name: '绿色设计产品全生命周期自我声明',
      source: 'offline',
      hasTemplate: true,
      templateName: '绿色设计产品自我评价声明.docx',
      format: 'DOCX',
      desc: '依据国家标准 GB/T 32161 进行指标符合性自评与承诺文件',
    },
    {
      name: '产品低损耗性能国家型式试验报告',
      source: 'offline',
      hasTemplate: false,
      desc: '国家级变压器/线缆质量监督检验中心出具的完整型式试验合格报告',
    },
    {
      name: '环保无害化材料选用证明 (RoHS/REACH)',
      source: 'offline',
      hasTemplate: true,
      templateName: '材料环保合规声明表.xlsx',
      format: 'XLSX',
      desc: '绝缘油无多氯联苯 (PCB) 证明、无卤素及有害物质合规检测报告',
    },
  ],
  'CBAM 碳排第三方核验': [
    {
      name: 'CBAM 欧盟官方通信模板 (Communication Template)',
      source: 'system',
      hasTemplate: true,
      templateName: 'CBAM_Communication_Template_v2.xlsx',
      format: 'XLSX',
      desc: '系统按欧盟 CBAM 规范自动填报产品 CN 码及前驱物直接/间接排放数据',
    },
    {
      name: '工厂实测排放核查计算底稿与边界划分说明',
      source: 'system',
      hasTemplate: true,
      templateName: '工序碳排计量核算底稿.pdf',
      format: 'PDF',
      desc: '系统采集各车间电、气、蒸汽输入与工序产品分摊系数明细',
    },
    {
      name: '欧盟进口商委托核验授权书 (Authorisation)',
      source: 'offline',
      hasTemplate: true,
      templateName: 'CBAM进口商授权代表委托书模板.docx',
      format: 'DOCX',
      desc: '欧盟境内客户签署的授权申报与第三方核验联合委托公文',
    },
    {
      name: '出口报关单与海关放行通知书',
      source: 'offline',
      hasTemplate: false,
      desc: '已离港出口欧盟对应批次的正式海关报关单与物流提单凭证',
    },
  ],
}

/* 申请状态仅保留：线下认证中、证书已上传（审批流程彻底剥离） */
export type CleanCertStatus = '线下认证中' | '证书已上传'

export interface CleanCertApplication {
  no: string
  product: string
  unit: string
  agency: string
  type: string
  status: CleanCertStatus
  date: string
  contact: string
  certNo?: string
  offlineFiles?: string[]
}

const seedCleanApplications: CleanCertApplication[] = [
  {
    no: 'CA-2026-120',
    product: 'SZ11-2500/10 变压器',
    unit: '天变公司',
    agency: 'TÜV 莱茵',
    type: 'ISO 14067 产品碳足迹认证',
    status: '线下认证中',
    date: '2026-09-01',
    contact: '王工 13800138001',
    offlineFiles: ['委托检验协议.docx', '营业执照.pdf', '工艺流程图.docx'],
  },
  {
    no: 'CA-2026-118',
    product: 'SZ11-1600/10 变压器',
    unit: '天变公司',
    agency: 'TÜV 莱茵',
    type: 'ISO 14067 产品碳足迹认证',
    status: '线下认证中',
    date: '2026-08-05',
    contact: '李工 13900139002',
    offlineFiles: ['委托检验协议.docx', '营业执照.pdf'],
  },
  {
    no: 'CA-2026-115',
    product: 'YJV22-8.7/15 电缆',
    unit: '鲁缆本部',
    agency: 'SGS',
    type: 'ISO 14067 产品碳足迹认证',
    status: '证书已上传',
    date: '2026-07-28',
    certNo: 'CERT-2026-0091',
    contact: '张工 13700137003',
    offlineFiles: ['委托检验协议.docx', '供应商碳声明.docx'],
  },
  {
    no: 'CA-2026-109',
    product: 'KYN28A-12 开关柜',
    unit: '沈变本部',
    agency: '方圆 CQM',
    type: '绿色设计产品评价',
    status: '线下认证中',
    date: '2026-07-20',
    contact: '刘工 13600136004',
    offlineFiles: ['自我评价声明.docx', '型式试验报告.pdf'],
  },
  {
    no: 'CA-2026-102',
    product: 'SFZ11-110 电力变压器',
    unit: '超高压公司',
    agency: 'TÜV 莱茵',
    type: 'EPD 环境产品声明',
    status: '证书已上传',
    date: '2026-08-18',
    certNo: 'CERT-2026-0086',
    contact: '陈工 13500135005',
    offlineFiles: ['运输台账.xlsx', '固废联单.pdf'],
  },
]

export default function CertificationClient({ tab: initialTab }: { tab?: string }) {
  const params = useParams()
  const seg = Array.isArray(params?.section) ? params.section[0] : (params?.section as string | undefined)
  const tab = seg ?? initialTab ?? 'material'

  const [applications, setApplications] = useState<CleanCertApplication[]>(seedCleanApplications)
  const [results, setResults] = useState<CertResult[]>(() => seedResults.map((r) => ({ ...r })))

  /* ---------- 认证资料维护 ---------- */
  const [agencyFilter, setAgencyFilter] = useState('all')
  const [matterFilter, setMatterFilter] = useState('全部事项')
  const agencies = agencyFilter === 'all' ? certAgencies : certAgencies.filter((a) => a.id === agencyFilter)
  const [detailAgency, setDetailAgency] = useState<CertAgency | null>(null)
  const [activeMatterInModal, setActiveMatterInModal] = useState('ISO 14067 产品碳足迹认证')

  /* ---------- 认证申请查询 ---------- */
  const [qUnit, setQUnit] = useState('all')
  const [qStatus, setQStatus] = useState('all')
  const [qKw, setQKw] = useState('')
  const [appApplied, setAppApplied] = useState({ unit: 'all', status: 'all', kw: '' })

  const filteredApps = useMemo(
    () =>
      applications.filter((a) => {
        if (appApplied.unit !== 'all' && a.unit !== appApplied.unit) return false
        if (appApplied.status !== 'all' && a.status !== appApplied.status) return false
        if (
          appApplied.kw &&
          !`${a.no}${a.product}${a.agency}${a.type}`.toLowerCase().includes(appApplied.kw.toLowerCase())
        )
          return false
        return true
      }),
    [applications, appApplied],
  )

  /* ---------- 向导式发起认证申请 (Wizard Modal) ---------- */
  const [wizardOpen, setWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1)
  const [wizardDraft, setWizardDraft] = useState({
    unit: UNIT_OPTIONS[0],
    product: PRODUCT_OPTIONS[0],
    agency: certAgencies[0].name,
    type: 'ISO 14067 产品碳足迹认证',
    contactName: '张建军',
    contactPhone: '13812345678',
    expectedDate: '2026-10-31',
  })
  const [uploadedOfflineDocs, setUploadedOfflineDocs] = useState<string[]>([])
  const [systemVerified, setSystemVerified] = useState(true)

  /* 当前所选事项对应的材料清单 */
  const currentMatterDocs = useMemo(() => {
    return CERT_MATTER_MATERIALS[wizardDraft.type] || CERT_MATTER_MATERIALS['ISO 14067 产品碳足迹认证']
  }, [wizardDraft.type])

  const offlineDocs = useMemo(() => currentMatterDocs.filter((d) => d.source === 'offline'), [currentMatterDocs])
  const systemDocs = useMemo(() => currentMatterDocs.filter((d) => d.source === 'system'), [currentMatterDocs])

  function openWizard() {
    setWizardStep(1)
    setWizardDraft({
      unit: UNIT_OPTIONS[0],
      product: PRODUCT_OPTIONS[0],
      agency: certAgencies[0].name,
      type: 'ISO 14067 产品碳足迹认证',
      contactName: '张建军',
      contactPhone: '13812345678',
      expectedDate: '2026-10-31',
    })
    setUploadedOfflineDocs(['营业执照正本扫描件.pdf'])
    setSystemVerified(true)
    setWizardOpen(true)
  }

  function handleAddOfflineDoc(name: string) {
    if (!uploadedOfflineDocs.includes(name)) {
      setUploadedOfflineDocs((prev) => [...prev, name])
    }
  }

  function handleRemoveOfflineDoc(name: string) {
    setUploadedOfflineDocs((prev) => prev.filter((d) => d !== name))
  }

  function submitWizard() {
    const seq = 121 + applications.length
    const newApp: CleanCertApplication = {
      no: `CA-2026-${seq}`,
      product: wizardDraft.product,
      unit: wizardDraft.unit,
      agency: wizardDraft.agency,
      type: wizardDraft.type,
      status: '线下认证中',
      date: new Date().toISOString().split('T')[0],
      contact: `${wizardDraft.contactName} ${wizardDraft.contactPhone}`,
      offlineFiles: [...uploadedOfflineDocs],
    }
    setApplications((prev) => [newApp, ...prev])
    setWizardOpen(false)
  }

  /* ---------- 上传证书与出证 ---------- */
  const [uploadCertFor, setUploadCertFor] = useState<CleanCertApplication | null>(null)
  const [certDraft, setCertDraft] = useState({
    certNo: '',
    validTo: '2029-09-02',
    fileName: '特变电工产品碳足迹证书及核查报告.pdf',
  })

  function openUploadCert(app: CleanCertApplication) {
    setUploadCertFor(app)
    const nextSeq = String(92 + results.filter((r) => r.cert.startsWith('CERT-2026')).length).padStart(4, '0')
    setCertDraft({
      certNo: `CERT-2026-${nextSeq}`,
      validTo: '2029-09-02',
      fileName: `${app.product.split(' ')[0]}_碳足迹核查证书.pdf`,
    })
  }

  function submitUploadCert() {
    if (!uploadCertFor) return
    setApplications((prev) =>
      prev.map((a) => (a.no === uploadCertFor.no ? { ...a, status: '证书已上传', certNo: certDraft.certNo } : a)),
    )
    setResults((prev) => [
      {
        cert: certDraft.certNo,
        fromNo: uploadCertFor.no,
        product: uploadCertFor.product,
        unit: uploadCertFor.unit,
        agency: uploadCertFor.agency,
        issued: new Date().toISOString().split('T')[0],
        validTo: certDraft.validTo,
        status: '有效',
      },
      ...prev,
    ])
    setUploadCertFor(null)
  }

  /* ---------- 查看向导资料详情 ---------- */
  const [viewDetailFor, setViewDetailFor] = useState<CleanCertApplication | null>(null)

  /* ---------- 撤销申请 ---------- */
  function withdraw(no: string) {
    setApplications((prev) => prev.filter((a) => a.no !== no))
  }

  /* ---------- 结果归档 CRUD ---------- */
  const [resultForm, setResultForm] = useState<CertResult | null>(null)
  const [resultIsNew, setResultIsNew] = useState(false)
  const [resultDraft, setResultDraft] = useState<Partial<CertResult>>({})
  const [previewCert, setPreviewCert] = useState<CertResult | null>(null)
  const [delCert, setDelCert] = useState<CertResult | null>(null)

  function openResultAdd() {
    const cert = `CERT-2026-${String(92 + results.length).padStart(4, '0')}`
    const base = {
      cert,
      fromNo: '',
      product: PRODUCT_OPTIONS[0],
      unit: UNIT_OPTIONS[0],
      agency: certAgencies[0].name,
      issued: '2026-09-02',
      validTo: '2029-09-02',
      status: '有效' as const,
    }
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
    setResults((prev) =>
      resultIsNew ? [{ ...d }, ...prev] : prev.map((r) => (r.cert === resultForm!.cert ? { ...r, ...d } : r)),
    )
    setResultForm(null)
  }

  function deleteResult() {
    if (delCert) setResults((prev) => prev.filter((r) => r.cert !== delCert.cert))
    setDelCert(null)
  }

  return (
    <div className="space-y-4">
      {/* ============ TAB 1: 认证资料维护 ============ */}
      {tab === 'material' && (
        <div className="space-y-4">
          {/* 顶部工具栏：机构与事项联动筛选 */}
          <Toolbar>
            <Select
              label="合作机构"
              value={agencyFilter}
              onChange={setAgencyFilter}
              options={[
                { value: 'all', label: '全部合作机构' },
                ...certAgencies.map((a) => ({ value: a.id, label: a.name })),
              ]}
            />
            <Select
              label="办理事项（评价/认证）"
              value={matterFilter}
              onChange={setMatterFilter}
              options={CERT_MATTERS.map((m) => ({ value: m, label: m }))}
            />
            <span className="text-xs text-muted-foreground self-end pb-2">
              直观查看每个机构资质、可选择开展的认证/评价事项、所需材料清单（系统给出 vs 线下自备）及标准模板
            </span>
          </Toolbar>

          {/* 机构卡片网格 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {agencies.map((a) => {
              const currentMatter = matterFilter === '全部事项' ? 'ISO 14067 产品碳足迹认证' : matterFilter
              const matterDocs = CERT_MATTER_MATERIALS[currentMatter] || []
              const sysCount = matterDocs.filter((d) => d.source === 'system').length
              const offCount = matterDocs.filter((d) => d.source === 'offline').length
              const tplCount = matterDocs.filter((d) => d.hasTemplate).length

              return (
                <div
                  key={a.id}
                  className="flex flex-col justify-between rounded-xl border border-border bg-panel p-5 transition-all hover:border-primary/50"
                >
                  <div>
                    {/* 机构头部 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 className="size-5" />
                        </span>
                        <div>
                          <div className="text-base font-bold text-foreground">{a.name}</div>
                          <div className="text-xs text-muted-foreground">{a.scope}</div>
                        </div>
                      </div>
                      <StatusBadge tone={a.status === '合作中' ? 'ok' : 'warn'}>{a.status}</StatusBadge>
                    </div>

                    {/* 机构基本属性 */}
                    <div className="mt-3.5 grid grid-cols-3 gap-2 rounded-lg border border-border/60 bg-secondary/30 p-2.5 text-xs">
                      <div>
                        <span className="text-muted-foreground">出证周期：</span>
                        <span className="font-semibold text-foreground font-mono">{a.cycle}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">合作次数：</span>
                        <span className="font-semibold text-foreground font-mono">{a.cooperations} 次</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">认可资质：</span>
                        <span className="font-semibold text-primary">{a.qualifications.length} 项</span>
                      </div>
                    </div>

                    {/* 事项材料简览 */}
                    <div className="mt-4 rounded-lg border border-border/80 bg-secondary/20 p-3">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                          <FileText className="size-3.5 text-primary" />
                          <span>当前事项：{currentMatter}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">共需提供 {matterDocs.length} 项材料</span>
                      </div>

                      {/* 来源分布指示 */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px] mb-2.5">
                        <div className="rounded bg-primary/10 py-1 text-primary">
                          ⚡ 系统直出 <b>{sysCount}</b> 项
                        </div>
                        <div className="rounded bg-amber-500/10 py-1 text-amber-500">
                          📁 线下自备 <b>{offCount}</b> 项
                        </div>
                        <div className="rounded bg-emerald-500/10 py-1 text-emerald-500">
                          📄 具备模板 <b>{tplCount}</b> 项
                        </div>
                      </div>

                      {/* 材料快速清单预览 */}
                      <div className="space-y-1.5">
                        {matterDocs.slice(0, 3).map((d) => (
                          <div
                            key={d.name}
                            className="flex items-center justify-between text-xs rounded border border-border/60 bg-panel px-2 py-1"
                          >
                            <span className="text-foreground truncate max-w-[260px]">{d.name}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {d.source === 'system' ? (
                                <Badge tone="info">系统自动给出</Badge>
                              ) : (
                                <Badge tone="warning">用户自备</Badge>
                              )}
                              {d.hasTemplate && <Badge tone="success">有模板</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 底部按钮 */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                    <span className="text-muted-foreground">支持一键发起向导申请与模板下载</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDetailAgency(a)
                        setActiveMatterInModal(currentMatter)
                      }}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      查看完整材料清单与模板 <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ============ TAB 2: 认证申请 (审批彻底去掉，状态仅保留：线下认证中、证书已上传) ============ */}
      {tab === 'apply' && (
        <div className="space-y-4">
          {/* 流程与状态收敛说明条 */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-secondary/30 p-3 sm:flex-row sm:items-center sm:justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                <ShieldCheck className="size-3.5" />
              </span>
              <span className="font-semibold text-foreground">认证申请业务工作流：</span>
              <span className="text-muted-foreground">
                向导式提报（基础数据 → 线下自备材料 → 系统自动数据）➔ 直接进入【线下认证中】➔ 现场审核出证后【证书已上传】闭环归档
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="info">线下认证中</Badge>
              <ArrowRight className="size-3 text-muted-foreground" />
              <Badge tone="success">证书已上传</Badge>
            </div>
          </div>

          {/* 查询工具栏 + 发起向导按钮 */}
          <Toolbar>
            <Select
              label="经营单位"
              value={qUnit}
              onChange={setQUnit}
              options={[
                { value: 'all', label: '全部经营单位' },
                ...Array.from(new Set(applications.map((a) => a.unit))).map((u) => ({ value: u, label: u })),
              ]}
            />
            <Select
              label="认证状态"
              value={qStatus}
              onChange={setQStatus}
              options={[
                { value: 'all', label: '全部状态' },
                { value: '线下认证中', label: '线下认证中' },
                { value: '证书已上传', label: '证书已上传' },
              ]}
            />
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">搜索编号 / 产品 / 机构</span>
              <input
                value={qKw}
                onChange={(e) => setQKw(e.target.value)}
                placeholder="关键字检索"
                className="h-9 w-52 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={() => setAppApplied({ unit: qUnit, status: qStatus, kw: qKw.trim() })}
              className="inline-flex h-9 items-center gap-1.5 self-end rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Search className="size-4" /> 查询
            </button>
            <button
              type="button"
              onClick={() => {
                setQUnit('all')
                setQStatus('all')
                setQKw('')
                setAppApplied({ unit: 'all', status: 'all', kw: '' })
              }}
              className="inline-flex h-9 items-center gap-1.5 self-end rounded-md border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-4" /> 重置
            </button>
            <button
              type="button"
              onClick={openWizard}
              className="ml-auto inline-flex h-9 items-center gap-1.5 self-end rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-95"
            >
              <Plus className="size-4" /> 发起认证申请（向导）
            </button>
          </Toolbar>

          {/* 申请表格（行高 44px，审批列与审批操作已彻底剥离） */}
          <DataTable
            columns={[
              { key: 'no', label: '申请编号', className: 'font-mono font-medium' },
              { key: 'product', label: '产品型号' },
              { key: 'unit', label: '经营单位' },
              { key: 'agency', label: '合作认证机构' },
              { key: 'type', label: '办理事项（评价/认证）' },
              { key: 'date', label: '申请日期', className: 'font-mono' },
              {
                key: 'status',
                label: '认证状态',
                render: (r: CleanCertApplication) =>
                  r.status === '证书已上传' ? (
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-500">
                      <CheckCircle2 className="size-3.5" /> 证书已上传 {r.certNo ? `(${r.certNo})` : ''}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                      <Clock className="size-3.5" /> 线下认证中
                    </span>
                  ),
              },
              {
                key: 'action',
                label: '操作',
                render: (r: CleanCertApplication) => (
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewDetailFor(r)}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Eye className="size-3.5" /> 查看向导资料
                    </button>
                    {r.status === '线下认证中' && (
                      <>
                        <button
                          type="button"
                          onClick={() => openUploadCert(r)}
                          className="inline-flex items-center gap-1 font-medium text-emerald-500 hover:underline"
                        >
                          <FileCheck className="size-3.5" /> 上传证书出证
                        </button>
                        <button
                          type="button"
                          onClick={() => withdraw(r.no)}
                          className="inline-flex items-center gap-1 text-[var(--destructive)] hover:underline"
                        >
                          <XCircle className="size-3.5" /> 撤销
                        </button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
            rows={filteredApps}
          />
        </div>
      )}

      {/* ============ TAB 3: 认证结果归档 ============ */}
      {tab === 'result' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <KpiCard
              label="有效证书"
              value={String(results.filter((r) => r.status === '有效').length)}
              unit="份"
              trend="闭环归档"
              up
            />
            <KpiCard
              label="临期证书"
              value={String(results.filter((r) => r.status === '临期').length)}
              unit="份"
              trend="需续期"
              up={false}
            />
            <KpiCard
              label="已过期"
              value={String(results.filter((r) => r.status === '已过期').length)}
              unit="份"
              trend="已禁用"
              up={false}
            />
            <KpiCard label="合作机构" value={String(certAgencies.length)} unit="家" trend="" up />
          </div>
          <div className="rounded-xl border border-border bg-panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">认证结果归档</h3>
                <p className="text-xs text-muted-foreground">
                  证书与来源申请一一对应，形成申请-出证闭环；支持新增、编辑、删除、预览与下载
                </p>
              </div>
              <button
                type="button"
                onClick={openResultAdd}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                <Plus className="size-4" /> 新增证书
              </button>
            </div>
            <DataTable
              columns={[
                { key: 'cert', label: '证书编号', className: 'font-mono' },
                {
                  key: 'fromNo',
                  label: '来源申请',
                  render: (r: CertResult) => (
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-primary">
                      <Link2 className="size-3.5" /> {r.fromNo || '—'}
                    </span>
                  ),
                },
                { key: 'product', label: '产品型号' },
                { key: 'unit', label: '经营单位' },
                { key: 'agency', label: '认证机构' },
                { key: 'validTo', label: '有效期至' },
                {
                  key: 'status',
                  label: '状态',
                  render: (r: CertResult) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge>,
                },
                {
                  key: 'action',
                  label: '操作',
                  render: (r: CertResult) => (
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewCert(r)}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Eye className="size-3.5" /> 预览
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewCert(r)}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Download className="size-3.5" /> 下载
                      </button>
                      <button
                        type="button"
                        onClick={() => openResultEdit(r)}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="size-3.5" /> 编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => setDelCert(r)}
                        className="inline-flex items-center gap-1 text-[var(--destructive)] hover:underline"
                      >
                        <Trash2 className="size-3.5" /> 删除
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={results}
            />
          </div>
        </div>
      )}

      {/* ---------- 机构详情与全量材料清单弹窗 ---------- */}
      <Modal
        open={!!detailAgency}
        onClose={() => setDetailAgency(null)}
        size="lg"
        title={detailAgency ? `${detailAgency.name} · 机构服务与材料清单维护` : ''}
        description={detailAgency?.scope}
      >
        {detailAgency && (
          <div className="space-y-4">
            {/* 机构简况 */}
            <p className="rounded-lg border border-border bg-secondary/30 p-3 text-xs leading-relaxed text-muted-foreground">
              {detailAgency.intro}
            </p>

            {/* 事项选择切换 Tabs */}
            <div>
              <div className="mb-2 text-xs font-semibold text-foreground">可选择做评价或认证的事项：</div>
              <div className="flex flex-wrap gap-1.5">
                {CERT_MATTERS.filter((m) => m !== '全部事项').map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setActiveMatterInModal(m)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                      activeMatterInModal === m
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-panel text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* 针对所选事项所需材料清单（明确区分系统自动给出与用户线下提供，标明模板支持） */}
            <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  办理【{activeMatterInModal}】所需材料清单与提供规则
                </span>
                <span className="text-[11px] text-muted-foreground">
                  共 {(CERT_MATTER_MATERIALS[activeMatterInModal] || []).length} 项
                </span>
              </div>

              <div className="space-y-2">
                {(CERT_MATTER_MATERIALS[activeMatterInModal] || []).map((doc, i) => (
                  <div
                    key={doc.name}
                    className="flex flex-col gap-1.5 rounded-lg border border-border bg-panel p-2.5 text-xs sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground">{i + 1}.</span>
                        <span className="font-bold text-foreground">{doc.name}</span>
                        {doc.source === 'system' ? (
                          <Badge tone="info">⚡ 系统自动给出</Badge>
                        ) : (
                          <Badge tone="warning">📁 用户线下自备</Badge>
                        )}
                        {doc.hasTemplate && <Badge tone="success">有标准模板</Badge>}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">{doc.desc}</div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {doc.hasTemplate ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded border border-primary/40 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/20"
                        >
                          <Download className="size-3" /> 下载模板 ({doc.format})
                        </button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">依据机构格式</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setDetailAgency(null)}
                className="h-8 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------- 发起认证申请向导弹窗 (Wizard Stepper - 3步) ---------- */}
      <Modal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        size="lg"
        title="发起认证申请 · 向导填报"
        description="分步引导：填报基础数据 ➔ 补充线下自备资料 ➔ 确认系统自动生成材料并提交"
      >
        <div className="space-y-4">
          {/* Stepper 步骤引导栏 */}
          <div className="grid grid-cols-3 gap-2 border-b border-border pb-3">
            {[
              { step: 1, label: '第1步：基础数据填报' },
              { step: 2, label: '第2步：补充线下自备资料' },
              { step: 3, label: '第3步：确认系统材料并提交' },
            ].map((s) => {
              const isCur = wizardStep === s.step
              const isPast = wizardStep > s.step
              return (
                <div
                  key={s.step}
                  className={`flex items-center gap-2 rounded-lg p-2 text-xs transition-colors ${
                    isCur
                      ? 'border border-primary/50 bg-primary/10 font-bold text-primary'
                      : isPast
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-mono ${
                      isCur
                        ? 'bg-primary text-primary-foreground'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {isPast ? <Check className="size-3" /> : s.step}
                  </span>
                  <span className="truncate">{s.label}</span>
                </div>
              )
            })}
          </div>

          {/* ===== 步骤 1：填报基础数据 ===== */}
          {wizardStep === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  label="申报经营单位"
                  value={wizardDraft.unit}
                  onChange={(v) => setWizardDraft((d) => ({ ...d, unit: v }))}
                  options={UNIT_OPTIONS.map((u) => ({ value: u, label: u }))}
                />
                <Select
                  label="申报产品型号规格"
                  value={wizardDraft.product}
                  onChange={(v) => setWizardDraft((d) => ({ ...d, product: v }))}
                  options={PRODUCT_OPTIONS.map((p) => ({ value: p, label: p }))}
                />
                <Select
                  label="合作第三方认证机构"
                  value={wizardDraft.agency}
                  onChange={(v) => setWizardDraft((d) => ({ ...d, agency: v }))}
                  options={certAgencies.map((a) => ({ value: a.name, label: a.name }))}
                />
                <Select
                  label="办理事项类别（评价/认证）"
                  value={wizardDraft.type}
                  onChange={(v) => setWizardDraft((d) => ({ ...d, type: v }))}
                  options={CERT_MATTERS.filter((m) => m !== '全部事项').map((t) => ({ value: t, label: t }))}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">申请对接责任人</span>
                  <input
                    value={wizardDraft.contactName}
                    onChange={(e) => setWizardDraft((d) => ({ ...d, contactName: e.target.value }))}
                    className="h-9 rounded-md border border-border bg-panel px-3 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">联系电话</span>
                  <input
                    value={wizardDraft.contactPhone}
                    onChange={(e) => setWizardDraft((d) => ({ ...d, contactPhone: e.target.value }))}
                    className="h-9 rounded-md border border-border bg-panel px-3 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">预计出证日期</span>
                  <input
                    type="date"
                    value={wizardDraft.expectedDate}
                    onChange={(e) => setWizardDraft((d) => ({ ...d, expectedDate: e.target.value }))}
                    className="h-9 rounded-md border border-border bg-panel px-3 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border/80 bg-secondary/30 p-3 text-xs">
                <div className="font-semibold text-foreground mb-1">办理提示：</div>
                <p className="text-muted-foreground leading-relaxed">
                  您选择了【{wizardDraft.agency}】办理【{wizardDraft.type}
                  】。下一步系统将根据该事项自动为您匹配需要您线下自备的材料清单及下载模板。
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWizardOpen(false)}
                  className="h-9 rounded-md border border-border px-4 text-xs text-muted-foreground hover:text-foreground"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  下一步：补充线下自备资料 <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ===== 步骤 2：补充线下自备资料 ===== */}
          {wizardStep === 2 && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border/70 bg-secondary/30 p-2.5 text-xs text-muted-foreground">
                以下为该认证事项所需由经营单位线下自备的资料清单。若有规范模板，可直接点击下载填报并上传附件：
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {offlineDocs.map((doc, idx) => {
                  const isUploaded = uploadedOfflineDocs.some(
                    (f) => f.includes(doc.name) || f.includes(doc.templateName || ''),
                  )
                  return (
                    <div
                      key={doc.name}
                      className="flex flex-col gap-2 rounded-lg border border-border bg-panel p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-muted-foreground">{idx + 1}.</span>
                          <span className="font-bold text-foreground">{doc.name}</span>
                          {doc.hasTemplate ? (
                            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-500 font-medium">
                              具备标准模板
                            </span>
                          ) : (
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              依据机构格式
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{doc.desc}</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {doc.hasTemplate && (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded border border-border bg-secondary/50 px-2 py-1 text-[11px] text-primary hover:border-primary"
                          >
                            <Download className="size-3" /> 下载模板
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleAddOfflineDoc(`${doc.name}_扫描件.pdf`)}
                          className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                            isUploaded
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : 'bg-primary text-primary-foreground hover:opacity-90'
                          }`}
                        >
                          {isUploaded ? <Check className="size-3" /> : <Upload className="size-3" />}
                          {isUploaded ? '已上传附件' : '上传附件'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 已上传附件展示 */}
              <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-2.5">
                <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                  已附加自备材料清单 ({uploadedOfflineDocs.length} 份)：
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {uploadedOfflineDocs.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 rounded bg-panel border border-border px-2 py-0.5 text-[11px] text-foreground"
                    >
                      <Paperclip className="size-3 text-primary" /> {f}
                      <button
                        type="button"
                        onClick={() => handleRemoveOfflineDoc(f)}
                        className="text-muted-foreground hover:text-red-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="h-9 rounded-md border border-border px-4 text-xs text-muted-foreground hover:text-foreground"
                >
                  上一步
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  下一步：确认系统自动生成材料 <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ===== 步骤 3：确认系统自动生成材料并提交 ===== */}
          {wizardStep === 3 && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border/70 bg-secondary/30 p-2.5 text-xs text-muted-foreground">
                以下材料由特变电工能碳数字化平台根据所选申报产品【{wizardDraft.product}
                】实测自动生成并打包封装，无需手动填报：
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {systemDocs.map((doc, idx) => (
                  <div
                    key={doc.name}
                    className="flex flex-col gap-1.5 rounded-lg border border-border bg-panel p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground">{idx + 1}.</span>
                        <span className="font-bold text-foreground">{doc.name}</span>
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          ⚡ 系统自动直出
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">({doc.format})</span>
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">{doc.desc}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                        <CheckCircle2 className="size-3.5" /> 数据就绪
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 勾选确认与免审批说明 */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={systemVerified}
                    onChange={(e) => setSystemVerified(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-0"
                  />
                  <span className="font-semibold text-foreground">
                    我已核验上述基础数据、线下自备材料及系统实测清单，确认发起第三方认证
                  </span>
                </label>
                <p className="text-[11px] text-muted-foreground pl-5">
                  注：本申请提交后将直接生效进入【线下认证中】状态，并同步抄送外部认证机构进行现场抽样与数据核查。
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="h-9 rounded-md border border-border px-4 text-xs text-muted-foreground hover:text-foreground"
                >
                  上一步
                </button>
                <button
                  type="button"
                  disabled={!systemVerified}
                  onClick={submitWizard}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  <Check className="size-3.5" /> 完成并立即提交申请
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ---------- 查看向导资料详情弹窗 ---------- */}
      <Modal
        open={!!viewDetailFor}
        onClose={() => setViewDetailFor(null)}
        size="lg"
        title={viewDetailFor ? `申请向导资料明细 · ${viewDetailFor.no}` : ''}
        description={
          viewDetailFor ? `${viewDetailFor.unit} · ${viewDetailFor.product} · ${viewDetailFor.agency}` : ''
        }
      >
        {viewDetailFor && (
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <div>
                <span className="text-muted-foreground">申请编号：</span>
                <span className="font-mono font-semibold text-foreground">{viewDetailFor.no}</span>
              </div>
              <div>
                <span className="text-muted-foreground">认证状态：</span>
                <span className="font-semibold text-primary">{viewDetailFor.status}</span>
              </div>
              <div>
                <span className="text-muted-foreground">申报单位：</span>
                <span className="text-foreground">{viewDetailFor.unit}</span>
              </div>
              <div>
                <span className="text-muted-foreground">合作机构：</span>
                <span className="text-foreground">{viewDetailFor.agency}</span>
              </div>
              <div>
                <span className="text-muted-foreground">事项类别：</span>
                <span className="text-foreground">{viewDetailFor.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">对接联系人：</span>
                <span className="text-foreground">{viewDetailFor.contact}</span>
              </div>
            </div>

            {/* 自备附件 */}
            <div>
              <div className="font-semibold text-foreground mb-1.5">经营单位自备并上传的材料附件：</div>
              <div className="flex flex-wrap gap-2">
                {(viewDetailFor.offlineFiles || ['营业执照正本扫描件.pdf', '委托检验协议.docx']).map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-2.5 py-1 text-xs text-foreground"
                  >
                    <Paperclip className="size-3 text-primary" /> {f}
                    <button type="button" className="text-primary hover:underline text-[11px] ml-1">
                      下载
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 系统自动材料 */}
            <div>
              <div className="font-semibold text-foreground mb-1.5">系统自动提取并绑定的实测材料包：</div>
              <div className="space-y-1.5">
                {[
                  '产品 BOM 物料定额清单（ERP自动拉取）',
                  '近12个月连续电、气、蒸汽分项能耗在线计量台账',
                  'LCA 碳足迹核算模型底稿及因子溯源链',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-md border border-border bg-panel px-3 py-1.5"
                  >
                    <span className="text-foreground">{item}</span>
                    <span className="inline-flex items-center gap-1 text-emerald-500 font-mono text-[11px]">
                      <CheckCircle2 className="size-3" /> 已核验直出
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewDetailFor(null)}
                className="h-8 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------- 上传证书与出证归档弹窗 ---------- */}
      <Modal
        open={!!uploadCertFor}
        onClose={() => setUploadCertFor(null)}
        title="上传证书与出证归档"
        description={uploadCertFor ? `为申请 ${uploadCertFor.no} 录入证书编号并归档` : ''}
      >
        {uploadCertFor && (
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">正式证书编号</span>
                <input
                  value={certDraft.certNo}
                  onChange={(e) => setCertDraft((d) => ({ ...d, certNo: e.target.value }))}
                  placeholder="如 CERT-2026-0099"
                  className="h-9 rounded-md border border-border bg-panel px-3 font-mono text-foreground outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">有效期至</span>
                <input
                  type="date"
                  value={certDraft.validTo}
                  onChange={(e) => setCertDraft((d) => ({ ...d, validTo: e.target.value }))}
                  className="h-9 rounded-md border border-border bg-panel px-3 text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">证书与核查报告附件 (PDF)</span>
              <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-2.5">
                <span className="flex items-center gap-2 text-foreground truncate">
                  <FileText className="size-4 text-primary" /> {certDraft.fileName}
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-500 font-medium">
                  就绪
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUploadCertFor(null)}
                className="h-8 rounded-md border border-border px-3 text-muted-foreground hover:text-foreground"
              >
                取消
              </button>
              <button
                type="button"
                onClick={submitUploadCert}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-primary px-4 font-medium text-primary-foreground hover:opacity-90"
              >
                <Check className="size-3.5" /> 确认出证并归档
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------- 证书预览/编辑等弹窗保持完备 ---------- */}
      <Modal
        open={!!previewCert}
        onClose={() => setPreviewCert(null)}
        title="证书防伪核验预览"
        description={previewCert?.cert}
      >
        {previewCert && (
          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-primary/30 bg-secondary/20 p-4 text-center space-y-2">
              <ShieldCheck className="size-12 mx-auto text-primary" />
              <div className="text-base font-bold text-foreground">{previewCert.product}</div>
              <div className="text-xs text-muted-foreground font-mono">{previewCert.cert}</div>
              <div className="text-xs text-emerald-500 font-medium">
                第三方认证核验有效 · 集团集采认证中心认证通过
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div>发证机构：{previewCert.agency}</div>
              <div>颁发单位：{previewCert.unit}</div>
              <div>生效日期：{previewCert.issued}</div>
              <div>截止日期：{previewCert.validTo}</div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="h-8 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground"
              >
                确定
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 证书新增/编辑弹窗 */}
      <Modal
        open={!!resultForm}
        onClose={() => setResultForm(null)}
        title={resultIsNew ? '新增证书档案' : '编辑证书档案'}
      >
        {resultForm && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">证书编号</span>
                <input
                  value={resultDraft.cert ?? ''}
                  onChange={(e) => setResultDraft((d) => ({ ...d, cert: e.target.value }))}
                  className="h-8 rounded border border-border bg-panel px-2 text-foreground font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">认证机构</span>
                <input
                  value={resultDraft.agency ?? ''}
                  onChange={(e) => setResultDraft((d) => ({ ...d, agency: e.target.value }))}
                  className="h-8 rounded border border-border bg-panel px-2 text-foreground"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResultForm(null)}
                className="h-8 rounded border border-border px-3 text-muted-foreground"
              >
                取消
              </button>
              <button
                type="button"
                onClick={saveResult}
                className="h-8 rounded bg-primary px-4 font-medium text-primary-foreground"
              >
                保存
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 删除证书确认 */}
      <Modal open={!!delCert} onClose={() => setDelCert(null)} title="确认删除证书">
        {delCert && (
          <div className="space-y-3 text-xs">
            <p className="text-muted-foreground">确认删除证书 {delCert.cert}？删除后不可撤销。</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDelCert(null)}
                className="h-8 rounded border border-border px-3 text-muted-foreground"
              >
                取消
              </button>
              <button
                type="button"
                onClick={deleteResult}
                className="h-8 rounded bg-red-600 px-4 font-medium text-white"
              >
                删除
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

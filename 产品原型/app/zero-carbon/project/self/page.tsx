'use client'

import { ExportButton } from '@/components/shared/primitives'
import React, { useState, useMemo } from 'react'
import {
  Award,
  FileText,
  Search,
  Check,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  ShieldCheck,
  Zap,
  Cpu,
  FileCheck,
  ArrowRight,
  Lightbulb,
  CheckSquare,
  Square,
  BarChart3,
  Calendar,
  Download,
  Upload,
  Paperclip,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import {
  SUPPLY_CHAIN_MEASURES_OPTIONS,
  CONTROL_CENTER_FEATURE_OPTIONS,
  DISCLOSURE_DOC_OPTIONS,
  ALL_ZERO_CARBON_FACTORIES,
  type FactoryEvaluationData,
  type EvaluationAttachment,
} from '@/lib/zero-carbon-self-evaluation'

const darkTooltipStyle = {
  backgroundColor: 'rgba(11, 21, 40, 0.95)',
  border: '1px solid rgba(56, 189, 248, 0.3)',
  borderRadius: '8px',
  boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.6)',
  fontSize: '12px',
  padding: '8px 12px',
  color: '#f8fafc',
}

const darkTooltipLabelStyle = {
  color: '#f8fafc',
  fontWeight: 600,
  fontSize: '12px',
  marginBottom: '4px',
}

const darkTooltipItemStyle = {
  fontSize: '12px',
  padding: '1px 0',
}

export default function ZeroCarbonSelfEvaluationPage() {
  const [factories, setFactories] = useState<FactoryEvaluationData[]>(ALL_ZERO_CARBON_FACTORIES)
  const [selectedCompany, setSelectedCompany] = useState<string>('全部')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('year')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  
  // 详情模态框 (面向查验自评估信息与各项证明附件)
  const [factoryDetailModal, setFactoryDetailModal] = useState<FactoryEvaluationData | null>(null)
  
  // 填报自查工作台模态框 (面向企业自查填报与短板诊断)
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState<boolean>(false)
  const [declareFactoryTarget, setDeclareFactoryTarget] = useState<FactoryEvaluationData | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [declareForm, setDeclareForm] = useState<{
    carbonClearRate: number
    autoCollectRate: number
    supplyChainMeasures: string[]
    controlCenterFeatures: string[]
    disclosureFiles: string[]
    attachments: Record<string, EvaluationAttachment[]>
    notes: string
  }>({
    carbonClearRate: 0,
    autoCollectRate: 98.6,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5', 'sc-6'],
    controlCenterFeatures: [
      'cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12', 'cc-13'
    ],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3'],
    attachments: {},
    notes: '',
  })

  // 6 大二级单位及工厂数量统计
  const companiesList = useMemo(() => {
    return [
      { name: '全部', count: factories.length },
      { name: '沈变公司', count: factories.filter((f) => f.company === '沈变公司').length },
      { name: '衡变公司', count: factories.filter((f) => f.company === '衡变公司').length },
      { name: '新变厂', count: factories.filter((f) => f.company === '新变厂').length },
      { name: '鲁缆公司', count: factories.filter((f) => f.company === '鲁缆公司').length },
      { name: '新缆厂', count: factories.filter((f) => f.company === '新缆厂').length },
      { name: '德缆公司', count: factories.filter((f) => f.company === '德缆公司').length },
    ]
  }, [factories])

  const companyStats = useMemo(() => {
    const companies = ['沈变公司', '衡变公司', '新变厂', '鲁缆公司', '新缆厂', '德缆公司']
    return companies.map((comp) => {
      const compFactories = factories.filter((f) => f.company === comp)
      const count = compFactories.length
      if (count === 0) return { name: comp, count: 0, avgGreenPower: 0, avgCarbonClear: 0, avgSupplyChain: 0, avgAutoCollect: 0, avgDisclosure: 0 }
      
      const avgGreenPower = compFactories.reduce((acc, f) => acc + f.metrics['3.1'].value, 0) / count
      const avgCarbonClear = 0 // 特变电工目前无该指标信息，设为 0
      const avgSupplyChain = compFactories.reduce((acc, f) => acc + f.supplyChainMeasuresCount, 0) / count
      const avgAutoCollect = compFactories.reduce((acc, f) => acc + f.autoCollectRate, 0) / count
      const avgDisclosure = compFactories.reduce((acc, f) => acc + f.disclosureDocsCount, 0) / count

      return {
        name: comp,
        count,
        avgGreenPower: Number(avgGreenPower.toFixed(1)),
        avgCarbonClear: 0,
        avgSupplyChain: Number(avgSupplyChain.toFixed(1)),
        avgAutoCollect: Number(avgAutoCollect.toFixed(1)),
        avgDisclosure: Number(avgDisclosure.toFixed(1)),
      }
    })
  }, [factories])

  // 过滤后的工厂清单 (按二级单位及搜索框筛选)
  const filteredFactories = useMemo(() => {
    return factories.filter((f) => {
      const matchComp = selectedCompany === '全部' || f.company === selectedCompany
      const matchSearch =
        !searchQuery ||
        f.factoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.company.toLowerCase().includes(searchQuery.toLowerCase())
      return matchComp && matchSearch
    })
  }, [factories, selectedCompany, searchQuery])

  // 打开填报自查工作台
  const handleOpenDeclare = (factory: FactoryEvaluationData) => {
    setDeclareFactoryTarget(factory)
    setDeclareForm({
      carbonClearRate: 0, // 置灰不可填
      autoCollectRate: factory.autoCollectRate || 98.6,
      supplyChainMeasures: factory.supplyChainMeasures || ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5', 'sc-6'],
      controlCenterFeatures:
        factory.controlCenterFeatures || [
          'cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12', 'cc-13'
        ],
      disclosureFiles: factory.disclosureFiles || ['doc-1', 'doc-2', 'doc-3'],
      attachments: factory.attachments ? JSON.parse(JSON.stringify(factory.attachments)) : {},
      notes: factory.notes || '',
    })
    setIsDeclareModalOpen(true)
  }

  // 上传单个指标的附件
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, metricKey: string) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    const newAttachments: EvaluationAttachment[] = Array.from(files).map((file, idx) => {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      const sizeKb = (file.size / 1024).toFixed(0)
      const sizeStr = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      const type = ext === 'pdf' ? 'pdf' : (ext === 'xlsx' || ext === 'xls') ? 'xlsx' : (ext === 'docx' || ext === 'doc') ? 'docx' : 'img'
      
      return {
        id: `att-upload-${Date.now()}-${idx}`,
        name: file.name,
        size: sizeStr,
        uploadTime: timeStr,
        type,
      }
    })

    setDeclareForm((prev) => {
      const existing = prev.attachments?.[metricKey] || []
      return {
        ...prev,
        attachments: {
          ...prev.attachments,
          [metricKey]: [...existing, ...newAttachments],
        },
      }
    })

    setToastMessage(`成功为 [${metricKey}] 指标添加 ${newAttachments.length} 份审核证明材料！`)
    setTimeout(() => setToastMessage(null), 3000)
    e.target.value = ''
  }

  // 移除单个指标的指定附件
  const handleRemoveAttachment = (metricKey: string, attId: string) => {
    setDeclareForm((prev) => {
      const existing = prev.attachments?.[metricKey] || []
      return {
        ...prev,
        attachments: {
          ...prev.attachments,
          [metricKey]: existing.filter((item) => item.id !== attId),
        },
      }
    })
  }

  // 下载证明附件
  const handleDownloadAttachment = (fileName: string) => {
    setToastMessage(`已启动下载证明文件：${fileName}`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 保存填报并更新最新核算值与附件数据
  const handleSaveDeclare = (e: React.FormEvent) => {
    e.preventDefault()
    if (!declareFactoryTarget) return

    const todayStr = '2026-09-20'

    const updated = factories.map((f) => {
      if (f.id === declareFactoryTarget.id) {
        return {
          ...f,
          carbonClearRate: 0,
          autoCollectRate: declareForm.autoCollectRate,
          supplyChainMeasuresCount: declareForm.supplyChainMeasures.length,
          controlCenterFeaturesCount: declareForm.controlCenterFeatures.length,
          disclosureDocsCount: declareForm.disclosureFiles.length,
          supplyChainMeasures: declareForm.supplyChainMeasures,
          controlCenterFeatures: declareForm.controlCenterFeatures,
          disclosureFiles: declareForm.disclosureFiles,
          attachments: declareForm.attachments,
          declareDate: todayStr,
          status: '已自评已申报' as const,
          notes: declareForm.notes,
          metrics: {
            ...f.metrics,
            '2.3': { ...f.metrics['2.3'], value: 0 },
            '3.2': {
              ...f.metrics['3.2'],
              value: `已选 ${declareForm.supplyChainMeasures.length}/6 项`,
            },
            '4.1': { ...f.metrics['4.1'], value: declareForm.autoCollectRate },
            '4.2': {
              ...f.metrics['4.2'],
              value: `已选 ${declareForm.controlCenterFeatures.length}/13 项`,
            },
            '5.1': {
              ...f.metrics['5.1'],
              value: `已选 ${declareForm.disclosureFiles.length}/3 份`,
            },
          },
        }
      }
      return f
    })

    setFactories(updated)
    setIsDeclareModalOpen(false)
    setToastMessage(`【${declareFactoryTarget.factoryName}】自评申报参数与证明材料已更新并同步归档！`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // 渲染填报弹窗中每个指标专属的附件上传区
  const renderMetricAttachmentUpload = (metricKey: string, metricLabel: string) => {
    const metricAttachments = declareForm.attachments?.[metricKey] || []
    return (
      <div className="mt-2.5 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <FileText className="size-3 text-primary" />
            {metricLabel} · 证明材料 ({metricAttachments.length} 份)
          </span>
          <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs">
            <Upload className="size-3" />
            <span>上传附件</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e, metricKey)}
            />
          </label>
        </div>
        {metricAttachments.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {metricAttachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-panel border border-border text-[11px] group/chip"
              >
                <Paperclip className="size-3 text-primary shrink-0" />
                <span className="text-foreground max-w-[210px] truncate" title={att.name}>
                  {att.name}
                </span>
                <span className="text-muted-foreground font-mono text-[10px] shrink-0">({att.size})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(metricKey, att.id)}
                  className="text-muted-foreground hover:text-red-400 p-0.5 rounded cursor-pointer"
                  title="移除此附件"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-[10.5px] text-muted-foreground italic">暂未上传证明材料，点击右侧【上传附件】可挂载多份材料</span>
        )}
      </div>
    )
  }

  // 渲染自评详情弹窗中每个指标的证明材料列表
  const renderDetailMetricAttachments = (metricKey: string) => {
    if (!factoryDetailModal) return null
    if (metricKey === '2.3') {
      return (
        <div className="space-y-1 py-1">
          <div className="text-[11px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/25 px-2 py-1 rounded flex items-center gap-1">
            <AlertCircle className="size-3 shrink-0" />
            <span>特变电工企业目前无该指标信息（暂未投运 CCUS 等直接工程碳清除装置）</span>
          </div>
          {factoryDetailModal.attachments?.[metricKey]?.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-2 p-1.5 rounded bg-panel/80 border border-border text-[11px]"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <FileText className="size-3.5 text-primary shrink-0" />
                <span className="text-[11px] font-medium text-foreground truncate max-w-[220px]" title={file.name}>
                  {file.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono shrink-0">({file.size})</span>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadAttachment(file.name)}
                className="text-primary hover:underline font-bold text-[10.5px] px-1 py-0.5 shrink-0 cursor-pointer"
              >
                下载
              </button>
            </div>
          ))}
        </div>
      )
    }

    const attList = factoryDetailModal.attachments?.[metricKey] || []
    if (attList.length === 0) {
      return <span className="text-[11px] text-muted-foreground italic">暂无附件材料</span>
    }

    return (
      <div className="flex flex-col gap-1 py-1">
        <div className="text-[10.5px] text-muted-foreground font-mono mb-0.5">
          已挂载 {attList.length} 份证明材料：
        </div>
        <div className="space-y-1">
          {attList.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-2 p-1.5 rounded bg-panel/80 hover:bg-accent/40 border border-border transition-colors group/att"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <FileText className="size-3.5 text-primary shrink-0" />
                <span className="text-[11px] font-medium text-foreground truncate max-w-[220px]" title={file.name}>
                  {file.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono shrink-0">({file.size})</span>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadAttachment(file.name)}
                className="text-primary hover:underline font-bold text-[10.5px] px-1.5 py-0.5 rounded cursor-pointer shrink-0"
              >
                下载
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3.5 font-sans text-slate-800 pb-10">
      {/* 消息提示气泡 */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 1. 顶部 Header (主标题 + 时间维度与导出) */}
      <div className="bg-card p-3.5 rounded-xl border border-border backdrop-blur-sm shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Award className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">零碳工厂自评估</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              依据零碳工厂评价标准体系 · 开展源头减碳、过程削碳、协同降碳、智慧控碳与抵消披露自评估
            </p>
          </div>
        </div>

        {/* 右侧：时间维度与导出 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 维度切换按钮组 */}
          <div className="flex items-center gap-1 bg-panel p-0.5 rounded-lg text-xs font-sans border border-border">
            {[
              { key: 'month', label: '月度' },
              { key: 'quarter', label: '季度' },
              { key: 'year', label: '年度' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTimeDim(tab.key as any)}
                className={cn(
                  'px-3 py-1 rounded-md transition-colors cursor-pointer text-xs font-bold',
                  timeDim === tab.key
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 年份选择器 */}
          {timeDim === 'year' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-panel text-xs text-foreground font-mono font-medium focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="2026">2026 年</option>
              <option value="2025">2025 年</option>
              <option value="2024">2024 年</option>
            </select>
          )}

          {/* 季度选择器 */}
          {timeDim === 'quarter' && (
            <div className="flex items-center gap-1.5">
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="h-8 px-2.5 rounded-lg border border-border bg-panel text-xs text-foreground font-mono font-medium focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="2026-Q1">2026 第 1 季度</option>
                <option value="2026-Q2">2026 第 2 季度</option>
                <option value="2026-Q3">2026 第 3 季度</option>
                <option value="2026-Q4">2026 第 4 季度</option>
              </select>
            </div>
          )}

          {/* 月度范围选择 */}
          {timeDim === 'month' && (
            <div className="flex items-center gap-1 text-xs">
              <input
                type="month"
                value={selectedMonthRange.start}
                onChange={(e) => setSelectedMonthRange({ ...selectedMonthRange, start: e.target.value })}
                className="h-8 px-2 rounded-lg border border-border bg-panel text-foreground font-mono text-xs focus:outline-none focus:border-primary cursor-pointer"
              />
              <span className="text-muted-foreground text-xs">至</span>
              <input
                type="month"
                value={selectedMonthRange.end}
                onChange={(e) => setSelectedMonthRange({ ...selectedMonthRange, end: e.target.value })}
                className="h-8 px-2 rounded-lg border border-border bg-panel text-foreground font-mono text-xs focus:outline-none focus:border-primary cursor-pointer"
              />
            </div>
          )}

          <ExportButton moduleName="零碳工厂自评估报告" />
        </div>
      </div>

      {/* 2. 宏观核心统计 KPI Bento 卡片 (4张) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 卡片 1: 集团零碳工厂创建率 */}
        <div className="bg-card p-3.5 rounded-xl border border-border backdrop-blur-sm shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-400" />
              集团自评开展率
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              全域覆盖
            </span>
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-foreground">100.0</span>
              <span className="text-xs font-bold text-muted-foreground">%</span>
            </div>
            <span className="text-[11px] text-muted-foreground block mt-0.5">
              已自评并归档 21 / 21 家三级制造工厂
            </span>
          </div>
        </div>

        {/* 卡片 2: 清洁与绿电平均消纳占比 */}
        <div className="bg-card p-3.5 rounded-xl border border-border backdrop-blur-sm shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Zap className="size-4 text-emerald-400" />
              绿电绿证平均消纳率
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              源头减碳
            </span>
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-emerald-400">91.8</span>
              <span className="text-xs font-bold text-emerald-400">%</span>
            </div>
            <span className="text-[11px] text-muted-foreground block mt-0.5">
              屋顶分布式光伏与跨省绿电直采支撑
            </span>
          </div>
        </div>

        {/* 卡片 3: 碳清除装置运行概况 */}
        <div className="bg-card p-3.5 rounded-xl border border-border backdrop-blur-sm shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-4 text-amber-400" />
              碳清除装置 (CCUS) 状态
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-bold border border-border">
              不适用
            </span>
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-foreground">--</span>
              <span className="text-xs font-bold text-muted-foreground">暂无建设</span>
            </div>
            <span className="text-[11px] text-amber-400/90 block mt-0.5 truncate" title="特变电工目前无该指标信息（暂未投运CCUS装置）">
              特变电工目前无该指标信息
            </span>
          </div>
        </div>

        {/* 卡片 4: 重点设备数据自动采集率 Ra */}
        <div className="bg-card p-3.5 rounded-xl border border-border backdrop-blur-sm shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Cpu className="size-4 text-purple-400" />
              重点设备自动采集率 Ra
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
              智能控碳
            </span>
          </div>
          <div className="mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-purple-400">98.4</span>
              <span className="text-xs font-bold text-purple-400">%</span>
            </div>
            <span className="text-[11px] text-muted-foreground block mt-0.5">
              符合 GB 17167 工业三级计量器具标准
            </span>
          </div>
        </div>
      </div>

      {/* 3. 中部对标与时序趋势图表 (横向对比柱状图 + 清洁绿电消纳时序分析) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* 左侧：6 大二级单位 5 维重点参数横向对标柱状图 */}
        <div className="bg-card p-4 rounded-xl border border-border backdrop-blur-sm shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
              <h3 className="text-sm font-semibold text-foreground">6 大经营单位 5 维自评达标横向对标 (%)</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-400 inline-block" />
                1.源头减碳
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="size-2 rounded-full bg-sky-400 inline-block" />
                2.过程削碳
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="size-2 rounded-full bg-indigo-400 inline-block" />
                3.协同降碳
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="size-2 rounded-full bg-purple-400 inline-block" />
                4.智能控碳
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="size-2 rounded-full bg-amber-400 inline-block" />
                5.抵消与披露
              </span>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={companyStats.map((s) => ({
                  name: s.name,
                  greenPower: s.avgGreenPower,
                  carbonClear: 92.5, // 过程削碳综合达标率
                  supplyChain: Math.round((s.avgSupplyChain / 6) * 100),
                  autoCollect: s.avgAutoCollect,
                  disclosure: Math.round((s.avgDisclosure / 3) * 100),
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.72 0.12 220 / 12%)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'oklch(0.68 0.03 235)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'oklch(0.68 0.03 235)' }} domain={[0, 100]} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                  contentStyle={darkTooltipStyle}
                  labelStyle={darkTooltipLabelStyle}
                  itemStyle={darkTooltipItemStyle}
                  formatter={(val: any) => `${val}%`}
                />
                <Bar dataKey="greenPower" name="1. 源头减碳 (绿电消纳率 %)" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Bar dataKey="carbonClear" name="2. 过程削碳 (节能改造率 %)" fill="#0ea5e9" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Bar dataKey="supplyChain" name="3. 协同降碳 (供应链达标率 %)" fill="#6366f1" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Bar dataKey="autoCollect" name="4. 智能控碳 (自动采集率 %)" fill="#a855f7" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Bar dataKey="disclosure" name="5. 抵消治理 (报告合规率 %)" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 右侧：清洁能源与绿电消纳时序趋势折线图 */}
        <div className="bg-card p-4 rounded-xl border border-border backdrop-blur-sm shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
              <h3 className="text-sm font-semibold text-foreground">清洁能源与绿电消纳时序分析 (%)</h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">2026 全年监测</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: '1月', greenPower: 86.4, pvUtil: 21.0, nonFossil: 34.2 },
                  { month: '2月', greenPower: 87.2, pvUtil: 22.5, nonFossil: 35.0 },
                  { month: '3月', greenPower: 89.5, pvUtil: 24.8, nonFossil: 36.8 },
                  { month: '4月', greenPower: 90.1, pvUtil: 26.0, nonFossil: 38.2 },
                  { month: '5月', greenPower: 91.8, pvUtil: 28.5, nonFossil: 39.5 },
                  { month: '6月', greenPower: 92.4, pvUtil: 29.8, nonFossil: 40.8 },
                  { month: '7月', greenPower: 93.6, pvUtil: 31.2, nonFossil: 42.1 },
                  { month: '8月', greenPower: 94.2, pvUtil: 30.5, nonFossil: 42.8 },
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.72 0.12 220 / 12%)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'oklch(0.68 0.03 235)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'oklch(0.68 0.03 235)' }} domain={[0, 100]} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                  contentStyle={darkTooltipStyle}
                  labelStyle={darkTooltipLabelStyle}
                  itemStyle={darkTooltipItemStyle}
                  formatter={(val: any) => `${val}%`}
                />
                <Line type="monotone" dataKey="greenPower" name="绿电消纳率" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3.5, fill: '#10b981' }} />
                <Line type="monotone" dataKey="nonFossil" name="非化石电力消费" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3, fill: '#0ea5e9' }} />
                <Line type="monotone" dataKey="pvUtil" name="光伏铺设利用率" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. 重点重构区：下辖工厂零碳自评估指标明细列表 (强制 44px 工业高密表格)         */}
      {/* ========================================================================= */}
      <div className="bg-card rounded-xl border border-border backdrop-blur-sm shadow-xs p-4 space-y-3">
        {/* 表格工具栏：标题、二级单位筛选 Tabs、搜索框与导出 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/70">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            <h3 className="text-sm font-bold text-foreground">各级单位零碳工厂自评估明细列表</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold border border-primary/20 font-mono">
              共 {filteredFactories.length} 家工厂/基地
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 2 级单位筛选按钮组 */}
            <div className="flex items-center gap-1 bg-panel p-0.5 rounded-lg border border-border text-xs">
              {companiesList.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedCompany(item.name)}
                  className={cn(
                    'px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs font-bold',
                    selectedCompany === item.name
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                  )}
                >
                  {item.name} ({item.count})
                </button>
              ))}
            </div>

            {/* 搜索框 */}
            <div className="relative">
              <input
                type="text"
                placeholder="搜索工厂名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-44 pl-7 pr-3 rounded-lg border border-border bg-panel text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            <ExportButton moduleName="零碳工厂自评估列表" />
          </div>
        </div>

        {/* 工业高密表格 (强制 44px 行高) */}
        <div className="overflow-x-auto rounded-lg border border-border shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-panel/90 sticky top-0 z-10 border-b border-border text-[11.5px] text-muted-foreground font-semibold">
              <tr className="h-[44px]">
                <th className="py-2.5 px-3 text-center w-12 border-r border-border/40">序号</th>
                <th className="py-2.5 px-3 w-28 border-r border-border/40">二级单位</th>
                <th className="py-2.5 px-3 min-w-[170px] border-r border-border/40">三级单位 (工厂/基地)</th>
                <th className="py-2.5 px-3 min-w-[135px] border-r border-border/40">1. 源头减碳</th>
                <th className="py-2.5 px-3 min-w-[135px] border-r border-border/40">2. 过程削碳</th>
                <th className="py-2.5 px-3 min-w-[120px] border-r border-border/40">3. 协同降碳</th>
                <th className="py-2.5 px-3 min-w-[130px] border-r border-border/40">4. 智慧控碳</th>
                <th className="py-2.5 px-3 min-w-[120px] border-r border-border/40">5. 抵消与披露</th>
                <th className="py-2.5 px-3 text-center w-28 border-r border-border/40">自评状态</th>
                <th className="py-2.5 px-3 text-center w-36">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground text-[11.5px]">
              {filteredFactories.length === 0 ? (
                <tr className="h-[44px]">
                  <td colSpan={10} className="py-6 text-center text-muted-foreground">
                    未检索到符合条件的工厂记录
                  </td>
                </tr>
              ) : (
                filteredFactories.map((factory, idx) => (
                  <tr
                    key={factory.id}
                    className="h-[44px] hover:bg-accent/30 transition-colors"
                  >
                    {/* 序号 */}
                    <td className="py-1 px-3 text-center font-mono text-muted-foreground border-r border-border/40">
                      {idx + 1}
                    </td>

                    {/* 二级单位 */}
                    <td className="py-1 px-3 font-semibold text-foreground border-r border-border/40 whitespace-nowrap">
                      {factory.company}
                    </td>

                    {/* 三级单位 (工厂/基地名称) */}
                    <td className="py-1 px-3 font-bold text-foreground border-r border-border/40 min-w-[170px]">
                      <div className="flex items-center gap-1.5 truncate" title={factory.factoryName}>
                        <Building2 className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">{factory.factoryName}</span>
                      </div>
                    </td>

                    {/* 1. 源头减碳 */}
                    <td className="py-1 px-3 border-r border-border/40 min-w-[135px]">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-mono font-bold text-emerald-400">
                          {factory.metrics['1.1'].value}%
                        </span>
                        <div className="w-16 bg-muted/40 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${Math.min(factory.metrics['1.1'].value * 2.5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* 2. 过程削碳 */}
                    <td className="py-1 px-3 border-r border-border/40 min-w-[135px]">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-mono font-bold text-sky-400">
                          {factory.metrics['1.2'].value}%
                        </span>
                        <div className="w-16 bg-muted/40 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div
                            className="bg-sky-400 h-full rounded-full"
                            style={{ width: `${factory.metrics['1.2'].value}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* 3. 协同降碳 */}
                    <td className="py-1 px-3 border-r border-border/40 min-w-[120px]">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 font-mono font-bold border border-indigo-500/25">
                        {factory.supplyChainMeasuresCount} / 6 项
                      </span>
                    </td>

                    {/* 4. 智慧控碳 */}
                    <td className="py-1 px-3 border-r border-border/40 min-w-[130px]">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-mono font-bold text-purple-400">
                          {factory.autoCollectRate}%
                        </span>
                        <div className="w-16 bg-muted/40 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div
                            className="bg-purple-400 h-full rounded-full"
                            style={{ width: `${factory.autoCollectRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* 5. 抵消与披露 */}
                    <td className="py-1 px-3 border-r border-border/40 min-w-[120px]">
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono font-bold border border-amber-500/25">
                        {factory.disclosureDocsCount} / 3 份
                      </span>
                    </td>

                    {/* 自评状态 */}
                    <td className="py-1 px-3 text-center border-r border-border/40 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {factory.status}
                      </span>
                    </td>

                    {/* 操作列：详情 + 填报 */}
                    <td className="py-1 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFactoryDetailModal(factory)}
                          className="px-2.5 py-1 rounded-md bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          title="查看该工厂自评估详细核验报告与各项证明附件"
                        >
                          <FileText className="size-3.5" />
                          <span>详情</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeclare(factory)}
                          className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          title="企业自查填报与附件上传"
                        >
                          <Edit3 className="size-3" />
                          <span>填报</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. 详情弹窗 (面向查验自评估信息与多附件展示)                                */}
      {/* ========================================================================= */}
      {factoryDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-popover rounded-2xl shadow-2xl border border-border max-w-6xl w-full p-5 sm:p-6 flex flex-col gap-3 font-sans max-h-[92vh] overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <FileText className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">
                      【{factoryDetailModal.factoryName.split('(')[0].trim()}】零碳工厂自评估完整报告
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-primary/15 text-primary font-semibold border border-primary/30">
                      查验归档报告
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    所属单位: {factoryDetailModal.company} · 最新申报时间: {factoryDetailModal.declareDate} · 评定填报: {factoryDetailModal.evaluator}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFactoryDetailModal(null)}
                className="size-8 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 自评估详情与附件表格 (强制 44px 行高标准) */}
            <div className="border border-border rounded-xl overflow-y-auto max-h-[calc(92vh-130px)] shadow-xs custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10 bg-panel/95 backdrop-blur-sm">
                  <tr className="text-muted-foreground font-bold border-b border-border text-[11px] h-[44px]">
                    <th className="py-2.5 px-3 w-[100px] min-w-[95px] text-center border-r border-border whitespace-nowrap">
                      维度类别
                    </th>
                    <th className="py-2.5 px-3.5 w-[170px] min-w-[160px] border-r border-border/60 whitespace-nowrap">
                      指标代码与名称
                    </th>
                    <th className="py-2.5 px-3 w-[90px] min-w-[85px] text-center border-r border-border/60 whitespace-nowrap">
                      取值方式
                    </th>
                    <th className="py-2.5 px-3.5 min-w-[280px] border-r border-border/60">
                      自评取值 / 实际核验状态
                    </th>
                    <th className="py-2.5 px-3.5 min-w-[200px] border-r border-border/60">
                      核算公式与数学模型
                    </th>
                    <th className="py-2.5 px-3.5 min-w-[280px]">
                      证明材料与附件内容 (支持多附件)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground text-[11.5px]">
                  {/* 1 源头减碳 (3项) */}
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td
                      rowSpan={3}
                      className="py-3 px-3 text-center font-bold text-foreground bg-panel/50 border-r border-border align-middle whitespace-nowrap"
                    >
                      1 源头减碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60">[1.1] 非化石电力消费比例</td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-emerald-400 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-primary text-xs">
                          {factoryDetailModal.metrics['1.1'].value}%
                        </span>
                        <div className="text-[10.5px] text-muted-foreground bg-panel p-1.5 rounded-lg border border-border leading-relaxed font-sans">
                          <div>
                            <span className="text-muted-foreground font-medium">计算参数：</span>
                            <span className="font-mono text-foreground">Ee(绿电消纳) = {(factoryDetailModal.metrics['1.1'].value * 128).toFixed(1)} 万kWh</span>，
                            <span className="font-mono text-foreground">Et(总用电) = 1,280.0 万kWh</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground font-medium">计算过程：</span>
                            <span className="font-mono text-foreground">({(factoryDetailModal.metrics['1.1'].value * 128).toFixed(1)} ÷ 1,280.0) × 100% = </span>
                            <span className="font-mono font-bold text-primary">{factoryDetailModal.metrics['1.1'].value}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      Re = (Ee / Et) × 100% (屋顶分布式光伏+采购绿电)
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('1.1')}
                    </td>
                  </tr>

                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60">[1.2] 节能与低碳改造覆盖率</td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-emerald-400 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-primary text-xs">
                          {factoryDetailModal.metrics['1.2'].value}%
                        </span>
                        <div className="text-[10.5px] text-muted-foreground bg-panel p-1.5 rounded-lg border border-border leading-relaxed font-sans">
                          <div>
                            <span className="text-muted-foreground font-medium">计算参数：</span>
                            <span className="font-mono text-foreground">Ar(已改造工序及设备) = {Math.round(factoryDetailModal.metrics['1.2'].value * 0.6)} 台套</span>，
                            <span className="font-mono text-foreground">At(重点设备总数) = 60 台套</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground font-medium">计算过程：</span>
                            <span className="font-mono text-foreground">({Math.round(factoryDetailModal.metrics['1.2'].value * 0.6)} ÷ 60) × 100% = </span>
                            <span className="font-mono font-bold text-primary">{factoryDetailModal.metrics['1.2'].value}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      Rr = (Ar / At) × 100% (主要生产工序及重点设备节能改造)
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('1.2')}
                    </td>
                  </tr>

                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60 text-foreground">[1.3] 屋顶及建筑光伏利用率</td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-emerald-400 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-primary text-xs">
                          {factoryDetailModal.metrics['1.3'].value}%
                        </span>
                        <div className="text-[10.5px] text-muted-foreground bg-panel p-1.5 rounded-lg border border-border leading-relaxed font-sans">
                          <div>
                            <span className="text-muted-foreground/60 font-medium">计算参数：</span>
                            <span className="font-mono text-foreground">Ap(光伏铺设面积) = {(factoryDetailModal.metrics['1.3'].value * 480).toFixed(0)} m²</span>，
                            <span className="font-mono text-foreground">Ab(适宜屋顶总面积) = 48,000 m²</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground/60 font-medium">计算过程：</span>
                            <span className="font-mono text-foreground">({(factoryDetailModal.metrics['1.3'].value * 480).toFixed(0)} ÷ 48,000) × 100% = </span>
                            <span className="font-mono font-bold text-primary">{factoryDetailModal.metrics['1.3'].value}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      Rp = (Ap / Ab) × 100% (厂区适宜屋顶光伏铺设比例)
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('1.3')}
                    </td>
                  </tr>

                  {/* 2 过程削碳 (3项) */}
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td
                      rowSpan={3}
                      className="py-3 px-3 text-center font-bold text-foreground bg-panel border-r border-border align-middle whitespace-nowrap"
                    >
                      2 过程削碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60 text-foreground">[2.1] 电机系统运行能效</td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-emerald-400 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-foreground text-xs">
                          {factoryDetailModal.metrics['2.1'].value}
                        </span>
                        <div className="text-[10.5px] text-muted-foreground bg-panel p-1.5 rounded-lg border border-border leading-relaxed font-sans">
                          <div>
                            <span className="text-muted-foreground/60 font-medium">核验参数：</span>
                            <span className="font-mono text-foreground">加权综合运行效率 η = 94.8%</span>，
                            <span className="font-mono text-foreground">一级能效电机占比 = 85.6%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground/60 font-medium">判定结论：</span>
                            <span className="font-medium text-emerald-400">达到并优于 GB 18613—2020 二级能效基准</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      依据 GB 18613—2020 电动机能效标准评定
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('2.1')}
                    </td>
                  </tr>

                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60 text-foreground">[2.2] 空压机站节能评级</td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-emerald-400 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-foreground text-xs">
                          {factoryDetailModal.metrics['2.2'].value}
                        </span>
                        <div className="text-[10.5px] text-muted-foreground bg-panel p-1.5 rounded-lg border border-border leading-relaxed font-sans">
                          <div>
                            <span className="text-muted-foreground/60 font-medium">核验参数：</span>
                            <span className="font-mono text-foreground">站房输功效率 η = 86.4%</span>，
                            <span className="font-mono text-foreground">比功率 = 5.62 kW/(m³/min)</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground/60 font-medium">评定等级：</span>
                            <span className="font-medium text-emerald-400">符合 GB 19153 一级能效站房评定要求</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      依据 GB 19153—2019 容积式空气压缩机能效限定值
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('2.2')}
                    </td>
                  </tr>

                  {/* 2.3 碳清除率 (置灰不适用) */}
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60 text-foreground">[2.3] 碳清除率 (Re)</td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-muted-foreground font-semibold">
                      置灰锁定
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-muted-foreground text-xs">
                          -- (不适用)
                        </span>
                        <div className="text-[10.5px] text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 leading-relaxed font-sans">
                          特变电工企业目前无该指标信息（暂未投运 CCUS 等直接工程碳清除装置）
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      Re = [Rc / (Cd + Rc)] × 100% (CCUS/工程清除)
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('2.3')}
                    </td>
                  </tr>

                  {/* 3 协同降碳 (2项) */}
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td
                      rowSpan={2}
                      className="py-3 px-3 text-center font-bold text-foreground bg-panel border-r border-border align-middle whitespace-nowrap"
                    >
                      3 协同降碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60 text-foreground">
                      [3.1] 绿色电力绿证消纳占比
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-emerald-400 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-primary text-xs">
                          {factoryDetailModal.metrics['3.1'].value}%
                        </span>
                        <div className="text-[10.5px] text-muted-foreground bg-panel p-1.5 rounded-lg border border-border leading-relaxed font-sans">
                          <div>
                            <span className="text-muted-foreground/60 font-medium">计算参数：</span>
                            <span className="font-mono text-foreground">Eg(绿电绿证消纳量) = {(factoryDetailModal.metrics['3.1'].value * 128).toFixed(1)} 万kWh</span>，
                            <span className="font-mono text-foreground">Etotal(总用电) = 1,280.0 万kWh</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground/60 font-medium">计算过程：</span>
                            <span className="font-mono text-foreground">({(factoryDetailModal.metrics['3.1'].value * 128).toFixed(1)} ÷ 1,280.0) × 100% = </span>
                            <span className="font-mono font-bold text-primary">{factoryDetailModal.metrics['3.1'].value}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      Rg = (Eg / Etotal) × 100%
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('3.1')}
                    </td>
                  </tr>

                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60 text-foreground">[3.2] 零碳供应链管理措施</td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-amber-400 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                        {factoryDetailModal.supplyChainMeasures.map((id) => {
                          const item = SUPPLY_CHAIN_MEASURES_OPTIONS.find((o) => o.id === id)
                          return item ? (
                            <span
                              key={id}
                              className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded font-medium truncate"
                              title={item.title}
                            >
                              ✓ {item.title}
                            </span>
                          ) : null
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      依据 6 大供应链降碳制度核验符合项数 (已选 {factoryDetailModal.supplyChainMeasures.length}/6 项)
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('3.2')}
                    </td>
                  </tr>

                  {/* 4 智能控碳 (2项) */}
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td
                      rowSpan={2}
                      className="py-3 px-3 text-center font-bold text-foreground bg-panel border-r border-border align-middle whitespace-nowrap"
                    >
                      4 智能控碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60 text-foreground">[4.1] 数据自动采集率 (Ra)</td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-amber-400 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-primary text-xs">
                          {factoryDetailModal.autoCollectRate}%
                        </span>
                        <div className="text-[10.5px] text-muted-foreground bg-panel p-1.5 rounded-lg border border-border leading-relaxed font-sans">
                          <div>
                            <span className="text-muted-foreground/60 font-medium">计算参数：</span>
                            <span className="font-mono text-foreground">Da(有效自动采集测点) = {Math.round(factoryDetailModal.autoCollectRate * 2.14)} 个</span>，
                            <span className="font-mono text-foreground">Dt(应装表重点测点) = 214 个</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground/60 font-medium">计算过程：</span>
                            <span className="font-mono text-foreground">({Math.round(factoryDetailModal.autoCollectRate * 2.14)} ÷ 214) × 100% = </span>
                            <span className="font-mono font-bold text-primary">{factoryDetailModal.autoCollectRate}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      Ra = (Da / Dt) × 100% (GB 17167—2025 重点设备采集)
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('4.1')}
                    </td>
                  </tr>

                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60 text-foreground">[4.2] 能碳管理中心功能项数</td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-amber-400 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-[10.5px]">
                        {factoryDetailModal.controlCenterFeatures.map((id) => {
                          const item = CONTROL_CENTER_FEATURE_OPTIONS.find((o) => o.id === id)
                          return item ? (
                            <span
                              key={id}
                              className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded font-medium truncate"
                              title={item.title}
                            >
                              ✓ {item.title}
                            </span>
                          ) : null
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      对照数字化能碳平台权威 13 项功能核查 (已选 {factoryDetailModal.controlCenterFeatures.length}/13 项)
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('4.2')}
                    </td>
                  </tr>

                  {/* 5 抵消与披露 (1项) */}
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-foreground bg-panel border-r border-border align-middle whitespace-nowrap">
                      5 抵消治理
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/60 text-foreground">[5.1] 碳排放信息披露透明度</td>
                    <td className="py-2.5 px-3 text-center border-r border-border/60 whitespace-nowrap text-amber-400 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/60">
                      <div className="grid grid-cols-1 gap-1 text-[10.5px]">
                        {factoryDetailModal.disclosureFiles.map((id) => {
                          const item = DISCLOSURE_DOC_OPTIONS.find((o) => o.id === id)
                          return item ? (
                            <span
                              key={id}
                              className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded font-medium truncate"
                              title={item.title}
                            >
                              ✓ {item.title}
                            </span>
                          ) : null
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-muted-foreground border-r border-border/60">
                      权威 3 大公开披露报告载体 (已选 {factoryDetailModal.disclosureFiles.length}/3 份)
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('5.1')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 弹窗底部操作 */}
            <div className="flex justify-end pt-2 border-t border-border shrink-0">
              <button
                type="button"
                onClick={() => setFactoryDetailModal(null)}
                className="px-4 py-2 rounded-xl bg-panel hover:bg-accent border border-border text-foreground font-bold transition-colors cursor-pointer text-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. 企业自评估填报工作台 (支持各项上传附件、碳清除率置灰锁定)                 */}
      {/* ========================================================================= */}
      {isDeclareModalOpen && declareFactoryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-popover rounded-2xl shadow-2xl border border-border max-w-5xl w-full p-5 sm:p-6 flex flex-col gap-4 font-sans max-h-[94vh] overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Edit3 className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">
                      【{declareFactoryTarget.factoryName.split('(')[0].trim()}】自评估填报与项目审核材料管理
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-panel border border-border text-muted-foreground font-medium">
                      所属：{declareFactoryTarget.company}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    支持各项指标审核材料上传与多附件管理 · 碳清除率置灰保护
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDeclareModalOpen(false)}
                className="size-8 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 工作台主体表单 */}
            <div className="overflow-y-auto max-h-[calc(94vh-140px)] pr-1 custom-scrollbar">
              <form id="declare-form" onSubmit={handleSaveDeclare} className="flex flex-col gap-4 text-xs">
                {/* 填报说明条 */}
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-start gap-2.5 text-foreground text-xs">
                  <Info className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-primary">自评填报与附件上传说明：</span>
                    <span className="text-muted-foreground ml-1">
                      系统采用“自动采集核算 + 定性指标打勾自填 + 真实审核材料证明”模式。每项指标右侧均支持上传项目审核证明文件，支持多附件上传与管理。
                    </span>
                  </div>
                </div>

                {/* 1. 源头减碳 & 2. 过程脱碳 */}
                <div className="border border-border rounded-xl p-4 bg-panel/50 space-y-3">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-border">
                    <Zap className="size-4 text-emerald-400" />
                    1 源头减碳 与 2 过程脱碳
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px]">
                    <div className="bg-card p-3 rounded-lg border border-border space-y-2">
                      <span className="text-muted-foreground block text-[11px]">[1.1] 非化石电力消费比例</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary text-sm">
                          {declareFactoryTarget.metrics['1.1'].value}%
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                          ⚡ 系统自动核算
                        </span>
                      </div>
                      {renderMetricAttachmentUpload('1.1', '[1.1] 非化石电力')}
                    </div>

                    <div className="bg-card p-3 rounded-lg border border-border space-y-2">
                      <span className="text-muted-foreground block text-[11px]">[1.2] 节能与低碳改造覆盖率</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary text-sm">
                          {declareFactoryTarget.metrics['1.2'].value}%
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                          ⚡ 系统自动核算
                        </span>
                      </div>
                      {renderMetricAttachmentUpload('1.2', '[1.2] 节能低碳改造')}
                    </div>
                  </div>

                  {/* [2.3] 碳清除率 (强制置灰锁定，右侧提示特变电工企业目前无该指标信息) */}
                  <div className="bg-card p-3.5 rounded-lg border border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-primary text-xs">[2.3]</span>
                        <span className="font-bold text-foreground">碳清除率 (Re)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border font-medium">
                          🔒 置灰锁定
                        </span>
                      </div>
                      <span className="text-[10.5px] text-muted-foreground">CCUS / 直接工程碳清除技术</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="relative">
                        <input
                          type="text"
                          disabled
                          value="-- (不适用)"
                          className="h-8 w-28 pl-3 pr-2 rounded-lg border border-dashed border-border bg-muted/30 text-xs font-mono font-bold text-muted-foreground cursor-not-allowed select-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-2xs">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>特变电工企业目前无该指标信息（暂未投运 CCUS 等直接工程碳清除装置）</span>
                      </div>
                    </div>

                    {renderMetricAttachmentUpload('2.3', '[2.3] 碳清除率说明')}
                  </div>
                </div>

                {/* 3. 协同降碳 -> 零碳供应链管理措施 (6项自评打勾) */}
                <div className="border border-border rounded-xl p-4 bg-panel/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Layers className="size-4 text-indigo-400" />
                      3 协同降碳 · 零碳供应链管理措施 (6 项自评打勾)
                    </h4>
                    <span className="text-[11px] text-indigo-400 font-mono font-bold">
                      已选 {declareForm.supplyChainMeasures.length} / 6 项
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {SUPPLY_CHAIN_MEASURES_OPTIONS.map((opt) => {
                      const checked = declareForm.supplyChainMeasures.includes(opt.id)
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            const next = checked
                              ? declareForm.supplyChainMeasures.filter((x) => x !== opt.id)
                              : [...declareForm.supplyChainMeasures, opt.id]
                            setDeclareForm({ ...declareForm, supplyChainMeasures: next })
                          }}
                          className={cn(
                            'p-3 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-colors select-none',
                            checked
                              ? 'bg-primary/15 border-primary/40 text-foreground'
                              : 'bg-card border-border text-muted-foreground hover:bg-accent/40'
                          )}
                        >
                          <div className="mt-0.5 shrink-0">
                            {checked ? (
                              <CheckSquare className="size-4 text-primary" />
                            ) : (
                              <Square className="size-4 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-xs block">{opt.title}</span>
                            <span className="text-[10.5px] text-muted-foreground block mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {renderMetricAttachmentUpload('3.2', '[3.2] 零碳供应链措施')}
                </div>

                {/* 4. 智能控碳 -> 能碳管理中心功能 13 项权威检查项目 */}
                <div className="border border-border rounded-xl p-4 bg-panel/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Cpu className="size-4 text-purple-400" />
                      4 智能控碳 · 能碳管理中心功能指标检查项目 (权威 13 项)
                    </h4>
                    <span className="text-[11px] text-purple-400 font-mono font-bold">
                      已核验 {declareForm.controlCenterFeatures.length} / 13 项
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {CONTROL_CENTER_FEATURE_OPTIONS.map((opt) => {
                      const checked = declareForm.controlCenterFeatures.includes(opt.id)
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            const next = checked
                              ? declareForm.controlCenterFeatures.filter((x) => x !== opt.id)
                              : [...declareForm.controlCenterFeatures, opt.id]
                            setDeclareForm({ ...declareForm, controlCenterFeatures: next })
                          }}
                          className={cn(
                            'p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors select-none',
                            checked
                              ? 'bg-purple-500/15 border-purple-500/40 text-purple-300 font-medium'
                              : 'bg-card border-border text-muted-foreground hover:bg-accent/40'
                          )}
                        >
                          {checked ? (
                            <CheckSquare className="size-3.5 text-purple-400 shrink-0" />
                          ) : (
                            <Square className="size-3.5 text-muted-foreground/50 shrink-0" />
                          )}
                          <span className="text-[11px] truncate font-medium">{opt.title}</span>
                        </div>
                      )
                    })}
                  </div>

                  {renderMetricAttachmentUpload('4.2', '[4.2] 能碳管理中心13项功能')}
                </div>

                {/* 5. 碳抵销与信息披露 -> 3 大报告披露载体 */}
                <div className="border border-border rounded-xl p-4 bg-panel/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <FileCheck className="size-4 text-amber-400" />
                      5 碳抵销与信息披露 · 报告披露载体 (权威 3 大报告)
                    </h4>
                    <span className="text-[11px] text-amber-400 font-mono font-bold">
                      已归档 {declareForm.disclosureFiles.length} / 3 份
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {DISCLOSURE_DOC_OPTIONS.map((opt) => {
                      const checked = declareForm.disclosureFiles.includes(opt.id)
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            const next = checked
                              ? declareForm.disclosureFiles.filter((x) => x !== opt.id)
                              : [...declareForm.disclosureFiles, opt.id]
                            setDeclareForm({ ...declareForm, disclosureFiles: next })
                          }}
                          className={cn(
                            'p-3 rounded-lg border flex flex-col justify-between gap-2 cursor-pointer transition-colors select-none',
                            checked
                              ? 'bg-amber-500/15 border-amber-500/40 text-foreground'
                              : 'bg-card border-border text-muted-foreground hover:bg-accent/40'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <FileText className={cn('size-4', checked ? 'text-amber-400' : 'text-muted-foreground')} />
                            {checked ? (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                已归档
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-panel border border-border text-muted-foreground">
                                待归档
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-xs block text-foreground">{opt.title}</span>
                            <span className="text-[10.5px] text-muted-foreground block mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {renderMetricAttachmentUpload('5.1', '[5.1] 披露报告材料')}
                </div>
              </form>
            </div>

            {/* 弹窗底部操作 */}
            <div className="flex items-center justify-between pt-3 border-t border-border shrink-0">
              <span className="text-[11px] text-muted-foreground">
                ⚡ 保存后系统将自动重新核算指标并更新附件证明台账
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeclareModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-panel hover:bg-accent/40 text-muted-foreground hover:text-foreground font-bold transition-colors cursor-pointer text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  form="declare-form"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                >
                  <Save className="size-3.5" />
                  <span>保存自评与附件</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

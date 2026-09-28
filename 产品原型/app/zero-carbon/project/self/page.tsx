'use client'

import React, { useState, useMemo } from 'react'
import {
  Award,
  FileText,
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
  BarChart3,
  Upload,
  Paperclip,
  Download,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ExportButton } from '@/components/shared/primitives'
import { BatchDownloadModal } from '@/components/shared/batch-download-modal'
import {
  getAllFactoryAttachments,
  calculateTotalAttachmentsSize,
} from '@/lib/factory-attachment-downloader'
import {
  SUPPLY_CHAIN_MEASURES_OPTIONS,
  CONTROL_CENTER_FEATURE_OPTIONS,
  DISCLOSURE_DOC_OPTIONS,
  ALL_ZERO_CARBON_FACTORIES,
  getMetricItemAttachments,
  type FactoryEvaluationData,
  type EvaluationAttachment,
} from '@/lib/zero-carbon-self-evaluation'

export default function ZeroCarbonSelfEvaluationPage() {
  const [factories, setFactories] = useState<FactoryEvaluationData[]>(ALL_ZERO_CARBON_FACTORIES)
  const [selectedCompany, setSelectedCompany] = useState<string>('全部')
  
  // 详情模态框 (面向查验自评估信息与各项证明附件)
  const [factoryDetailModal, setFactoryDetailModal] = useState<FactoryEvaluationData | null>(null)
  
  // 🌟 一键打包下载弹窗状态目标
  const [batchDownloadTarget, setBatchDownloadTarget] = useState<FactoryEvaluationData | null>(null)

  // 预计算详情弹窗中全量证明材料与附件信息
  const modalAttachments = useMemo(() => {
    if (!factoryDetailModal) return []
    return getAllFactoryAttachments(factoryDetailModal)
  }, [factoryDetailModal])

  const modalTotalSize = useMemo(() => {
    return calculateTotalAttachmentsSize(modalAttachments)
  }, [modalAttachments])
  
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


  // 过滤后的工厂清单 (按经营单位筛选)
  const filteredFactories = useMemo(() => {
    return factories.filter((f) => {
      return selectedCompany === '全部' || f.company === selectedCompany
    })
  }, [factories, selectedCompany])

  // 计算经营单位在当前列表中的单元格纵向合并 rowSpan
  const companyRowSpans = useMemo(() => {
    const spans: number[] = []
    let i = 0
    while (i < filteredFactories.length) {
      let j = i + 1
      while (j < filteredFactories.length && filteredFactories[j].company === filteredFactories[i].company) {
        j++
      }
      const count = j - i
      spans[i] = count
      for (let k = i + 1; k < j; k++) {
        spans[k] = 0 // 0 表示被首行合并，不渲染 td
      }
      i = j
    }
    return spans
  }, [filteredFactories])

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

  // 上传单个指标的附件（严格限制仅支持 PDF 与 Word 格式文档）
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, metricKey: string) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const allowedExtensions = ['pdf', 'doc', 'docx']
    const validFiles: File[] = []
    const invalidFiles: string[] = []

    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      if (allowedExtensions.includes(ext)) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file.name)
      }
    })

    if (validFiles.length === 0) {
      setToastMessage('上传失败：仅支持上传 PDF 或 Word 格式文档（.pdf, .doc, .docx）！')
      setTimeout(() => setToastMessage(null), 3500)
      e.target.value = ''
      return
    }

    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    const newAttachments: EvaluationAttachment[] = validFiles.map((file, idx) => {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      const sizeKb = (file.size / 1024).toFixed(0)
      const sizeStr = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      const type = (ext === 'docx' || ext === 'doc') ? 'docx' : 'pdf'
      
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

    if (invalidFiles.length > 0) {
      setToastMessage(`已上传 ${validFiles.length} 份文档（忽略 ${invalidFiles.length} 份非 PDF/Word 文件）`)
    } else {
      setToastMessage(`成功为 [${metricKey}] 指标添加 ${newAttachments.length} 份证明材料（PDF/Word）！`)
    }
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
              value: `已符合 ${declareForm.supplyChainMeasures.length}/6 项`,
            },
            '4.1': { ...f.metrics['4.1'], value: declareForm.autoCollectRate },
            '4.2': {
              ...f.metrics['4.2'],
              value: `已符合 ${declareForm.controlCenterFeatures.length}/13 项`,
            },
            '5.1': {
              ...f.metrics['5.1'],
              value: `已归档 ${declareForm.disclosureFiles.length}/3 份`,
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
      <div className="mt-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <FileText className="size-3 text-[#2C7CFF]" />
            {metricLabel} · 证明材料 ({metricAttachments.length} 份)
          </span>
          <label
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-[#2C7CFF] border border-blue-200 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
            title="上传 PDF 或 Word 格式文档（.pdf, .doc, .docx）"
          >
            <Upload className="size-3" />
            <span>上传</span>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
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
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border text-[11px] group/chip"
              >
                <Paperclip className="size-3 text-[#2C7CFF] shrink-0" />
                <span className="text-slate-800 dark:text-slate-200 max-w-[210px] truncate" title={att.name}>
                  {att.name}
                </span>
                <span className="text-slate-400 font-mono text-[10px] shrink-0">({att.size})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(metricKey, att.id)}
                  className="text-slate-400 hover:text-red-500 p-0.5 rounded cursor-pointer"
                  title="移除此附件"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-[10.5px] text-slate-400 italic">暂未上传证明材料，点击右侧【上传】可挂载多份材料</span>
        )}
      </div>
    )
  }

  // 渲染自评详情弹窗中每个指标的证明材料列表
  const renderDetailMetricAttachments = (metricKey: string) => {
    if (!factoryDetailModal) return null
    if (metricKey === '2.3') {
      return <span className="font-mono text-slate-400 text-xs">--</span>
    }

    const attList = factoryDetailModal.attachments?.[metricKey] || []
    if (attList.length === 0) {
      return <span className="text-[11px] text-slate-400 italic">暂无附件材料</span>
    }

    return (
      <div className="space-y-1">
        {attList.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-border transition-colors group/att"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <FileText className="size-3.5 text-[#2C7CFF] shrink-0" />
              <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate max-w-[220px]" title={file.name}>
                {file.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">({file.size})</span>
            </div>
            <button
              type="button"
              onClick={() => handleDownloadAttachment(file.name)}
              className="text-[#2C7CFF] hover:underline font-bold text-[10.5px] px-1.5 py-0.5 rounded cursor-pointer shrink-0"
            >
              下载
            </button>
          </div>
        ))}
      </div>
    )
  }

  // 渲染自评详情弹窗中每个细项指标的 1 对 1 证明材料与附件
  const renderDetailItemAttachments = (itemId: string, isChecked: boolean = true) => {
    if (!factoryDetailModal) return null
    if (!isChecked) {
      return <span className="text-[11px] text-slate-400 italic">未申报此项（暂无附件）</span>
    }
    const attList = getMetricItemAttachments(factoryDetailModal, itemId)
    if (attList.length === 0) {
      return <span className="text-[11px] text-slate-400 italic">暂无附件材料</span>
    }
    return (
      <div className="space-y-1">
        {attList.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-border transition-colors"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <FileText className="size-3.5 text-[#2C7CFF] shrink-0" />
              <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate max-w-[220px]" title={file.name}>
                {file.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">({file.size})</span>
            </div>
            <button
              type="button"
              onClick={() => handleDownloadAttachment(file.name)}
              className="text-[#2C7CFF] hover:underline font-bold text-[10.5px] px-1.5 py-0.5 rounded cursor-pointer shrink-0"
            >
              下载
            </button>
          </div>
        ))}
      </div>
    )
  }

  // 指标说明气泡组件（icon悬停指向后再显示详细说明信息）
  const MetricTip = ({ text }: { text: string }) => {
    return (
      <span
        className="relative inline-flex items-center group/tip cursor-pointer text-slate-400 hover:text-[#2C7CFF] transition-colors shrink-0 select-none ml-1"
        title={text}
      >
        <Info className="size-3.5" />
        <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 z-50 hidden group-hover/tip:inline-block w-max max-w-[280px] rounded-lg bg-slate-900/95 backdrop-blur-xs px-2.5 py-1.5 text-[11px] font-normal text-white shadow-xl leading-relaxed whitespace-normal text-left animate-in fade-in duration-150">
          {text}
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900/95" />
        </span>
      </span>
    )
  }

  return (
    <div className="space-y-3.5 font-sans text-slate-800 dark:text-slate-200 pb-10">
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

      {/* 1. 顶部 Header (主标题 + 时间维度，去噪纯粹) */}
      <div className="bg-white dark:bg-card p-3.5 rounded-xl border border-slate-200 dark:border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-[#1677ff] shrink-0">
            <Award className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 dark:text-white">零碳工厂自评估</h1>
          </div>
        </div>

        {/* 右侧：导出操作 */}
        <div className="flex items-center gap-2.5">
          <ExportButton
            onClick={() => alert('已成功导出【零碳工厂自评估工作台与对标台账】(Excel)...')}
          />
        </div>
      </div>



      {/* 4. 下半部分：各级单位零碳工厂自评统筹明细列表 (列表形式，强制 44px 工业高密表格，去噪纯粹) */}
      <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-2xs p-4 space-y-3">
        {/* 表格工具栏：标题与二级单位筛选 Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-border">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              各级单位零碳工厂自评统筹明细列表
            </h3>
          </div>

          {/* 经营单位筛选按钮组 */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0d1b29] p-0.5 dark:p-[3px] rounded-lg border border-slate-200 dark:border-[#133748] text-xs font-sans">
            {companiesList.map((item) => {
              const isActive = selectedCompany === item.name
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedCompany(item.name)}
                  className={cn(
                    'h-7 px-3 rounded-md transition-all cursor-pointer text-xs font-bold flex items-center select-none',
                    isActive
                      ? 'tbea-tab-cyan-active shadow-xs dark:shadow-none'
                      : 'text-slate-600 hover:text-slate-900 dark:text-[#879ca8] dark:hover:text-white bg-transparent dark:bg-transparent',
                  )}
                >
                  {item.name} ({item.count})
                </button>
              )
            })}
          </div>
        </div>

        {/* 工业高密表格 (强制 44px 行高) */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-border shadow-2xs">
          <table className="w-full text-left border-collapse text-xs table-auto">
            <thead className="bg-slate-50/90 dark:bg-panel sticky top-0 z-10 border-b border-slate-200 dark:border-border text-[11.5px] text-slate-600 dark:text-slate-300 font-semibold">
              <tr className="h-[44px]">
                <th className="py-2.5 px-3 text-center w-[4%] border-r border-slate-200 dark:border-border whitespace-nowrap">序号</th>
                <th className="py-2.5 px-3 text-center w-[11%] border-r border-slate-200 dark:border-border whitespace-nowrap">经营单位</th>
                <th className="py-2.5 px-3 w-[20%] border-r border-slate-200 dark:border-border whitespace-nowrap">工厂</th>
                <th className="py-2.5 px-3 text-center w-[11%] border-r border-slate-200 dark:border-border whitespace-nowrap">1. 源头减碳</th>
                <th className="py-2.5 px-3 text-center w-[11%] border-r border-slate-200 dark:border-border whitespace-nowrap">2. 过程脱碳</th>
                <th className="py-2.5 px-3 text-center w-[11%] border-r border-slate-200 dark:border-border whitespace-nowrap">3. 协同降碳</th>
                <th className="py-2.5 px-3 text-center w-[11%] border-r border-slate-200 dark:border-border whitespace-nowrap">4. 智能控碳</th>
                <th className="py-2.5 px-3 text-center w-[11%] border-r border-slate-200 dark:border-border whitespace-nowrap">5. 碳抵销和信息披露</th>
                <th className="py-2.5 px-3 text-center w-[10%] whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 text-[11.5px]">
              {filteredFactories.length === 0 ? (
                <tr className="h-[44px]">
                  <td colSpan={9} className="py-6 text-center text-slate-400">
                    未检索到符合条件的工厂记录
                  </td>
                </tr>
              ) : (
                filteredFactories.map((factory, idx) => (
                  <tr
                    key={factory.id}
                    className="h-[44px] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* 序号 */}
                    <td className="py-1 px-3 text-center font-mono text-slate-400 dark:text-slate-500 border-r border-slate-100 dark:border-border whitespace-nowrap">
                      {idx + 1}
                    </td>

                    {/* 经营单位 (同类型单元格纵向合并) */}
                    {companyRowSpans[idx] > 0 && (
                      <td
                        rowSpan={companyRowSpans[idx]}
                        className="py-1 px-3 text-center font-bold text-slate-800 dark:text-slate-100 border-r border-slate-200 dark:border-border whitespace-nowrap align-middle bg-slate-50/40 dark:bg-slate-900/60"
                      >
                        {factory.company}
                      </td>
                    )}

                    {/* 工厂 */}
                    <td className="py-1 px-3 font-bold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-border whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-[#2C7CFF] shrink-0" />
                        <span>{factory.factoryName}</span>
                      </div>
                    </td>

                    {/* 1. 源头减碳 */}
                    <td className="py-1 px-3 text-center border-r border-slate-100 dark:border-border whitespace-nowrap">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {factory.metrics['1.1']?.value ?? 0.395}%
                      </span>
                    </td>

                    {/* 2. 过程脱碳 */}
                    <td className="py-1 px-3 text-center border-r border-slate-100 dark:border-border whitespace-nowrap">
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-xs">
                        {factory.metrics['1.2']?.value ?? 92}%
                      </span>
                    </td>

                    {/* 3. 协同降碳 */}
                    <td className="py-1 px-3 text-center border-r border-slate-100 dark:border-border whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono font-bold border border-indigo-200 dark:border-indigo-900/60">
                        {factory.supplyChainMeasuresCount ?? 6} / 6 项
                      </span>
                    </td>

                    {/* 4. 智能控碳 */}
                    <td className="py-1 px-3 text-center border-r border-slate-100 dark:border-border whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-mono font-bold border border-purple-200 dark:border-purple-900/60">
                        {factory.controlCenterFeaturesCount ?? (factory.controlCenterFeatures?.length || 13)} / 13 项
                      </span>
                    </td>

                    {/* 5. 碳抵销和信息披露 */}
                    <td className="py-1 px-3 text-center border-r border-slate-100 dark:border-border whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-mono font-bold border border-amber-200 dark:border-amber-900/60">
                        {factory.disclosureDocsCount ?? 3} / 3 份
                      </span>
                    </td>

                    {/* 操作列：详情与打包下载 */}
                    <td className="py-1 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFactoryDetailModal(factory)}
                          className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-[#2C7CFF] dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          title="查看该工厂自评估详细核验报告与各项证明附件"
                        >
                          <FileText className="size-3.5" />
                          <span>详情</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setBatchDownloadTarget(factory)}
                          className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          title="一键打包下载该工厂所有证明材料与附件"
                        >
                          <Download className="size-3" />
                          <span>打包下载</span>
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

      {/* 5. 详情弹窗 (面向查验自评估信息与多附件展示) */}
      {factoryDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border border-slate-200 dark:border-border max-w-6xl w-full p-5 sm:p-6 flex flex-col gap-3 font-sans max-h-[92vh] overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-border pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-[#2C7CFF] shrink-0">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    【{factoryDetailModal.factoryName.split('(')[0].trim()}】零碳工厂自评估完整报告
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFactoryDetailModal(null)}
                className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 自评估详情与附件表格 (强制 44px 行高标准) */}
            <div className="border border-slate-200 dark:border-border rounded-xl overflow-y-auto max-h-[calc(92vh-130px)] shadow-xs custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs table-fixed">
              <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-panel backdrop-blur-sm">
                <tr className="text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-border text-[11px] h-[44px]">
                  <th className="py-2.5 px-3 w-[9%] min-w-[95px] text-center border-r border-slate-200 dark:border-border whitespace-nowrap">
                    维度类别
                  </th>
                  <th className="py-2.5 px-3.5 w-[23%] min-w-[240px] border-r border-slate-200 dark:border-border whitespace-nowrap">
                    指标代码与名称
                  </th>
                  <th className="py-2.5 px-3 w-[8%] min-w-[85px] text-center border-r border-slate-200 dark:border-border whitespace-nowrap">
                    取值方式
                  </th>
                  <th className="py-2.5 px-3.5 w-[28%] min-w-[300px] border-r border-slate-200 dark:border-border">
                    自评取值 / 实际核验状态
                  </th>
                  <th className="py-2.5 px-3.5 w-[32%] min-w-[320px]">
                    证明材料与附件内容 (支持多附件)
                  </th>
                </tr>
              </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 text-[11.5px]">
                  {/* 1 源头减碳 (3项) */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td
                      rowSpan={3}
                      className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-border align-middle whitespace-nowrap"
                    >
                      1 源头减碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[1.1] 单位能耗碳排放</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-600 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <span className="font-mono font-bold text-[#2C7CFF] text-xs">
                        {factoryDetailModal.metrics['1.1'].value} {factoryDetailModal.metrics['1.1'].unit || 'tCO₂/tce'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[1.2] 非化石能源消费占比</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-600 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <span className="font-mono font-bold text-[#2C7CFF] text-xs">
                        {factoryDetailModal.metrics['1.2'].value}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100 dark:border-border text-slate-800 dark:text-slate-200">[1.3] 非化石能源电力消费物理认定量占比</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-600 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <span className="font-mono font-bold text-[#2C7CFF] text-xs">
                        {factoryDetailModal.metrics['1.3'].value}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  {/* 2 过程脱碳 (3项) */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td
                      rowSpan={3}
                      className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-border align-middle whitespace-nowrap"
                    >
                      2 过程脱碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100 dark:border-border text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1">
                        <span>[2.1] 单位工业增加值能耗</span>
                        <MetricTip text="统计期内综合能源消费量与工业增加值的比值 (对接财务 ERP 工业增加值联动)" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-600 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <span className="font-mono font-bold text-[#2C7CFF] text-xs">
                        {factoryDetailModal.metrics['2.1'].value} {factoryDetailModal.metrics['2.1'].unit || 'tce/万元'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100 dark:border-border text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1">
                        <span>[2.2] 节能装备应用占比</span>
                        <MetricTip text="在役重点用能设备达到国家2级能效及以上容量占比" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-amber-700 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <span className="font-mono font-bold text-[#2C7CFF] text-xs">
                        {factoryDetailModal.metrics['2.2'].value}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('2.2')}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100 dark:border-border text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1">
                        <span>[2.3] 碳清除率</span>
                        <MetricTip text="统计期内碳捕集、利用与封存量 (CCUS) 占核算边界内碳排放总量的比值" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-slate-400 font-semibold">
                      锁定
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400 text-xs">-- (不适用)</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-border">
                            未投运 CCUS
                          </span>
                        </div>
                        <div className="text-[10.5px] text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                          <AlertCircle className="size-3.5 shrink-0 text-amber-600" />
                          <span>特变电工企业目前无该指标信息（暂未投运直接碳捕集与封存装置）</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  {/* 3 协同降碳 (7行：3.1占1行，3.2展开6行) */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td
                      rowSpan={7}
                      className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-border align-middle whitespace-nowrap"
                    >
                      3 协同降碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100 dark:border-border text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1">
                        <span>[3.1] 开展产品碳足迹分析占比</span>
                        <MetricTip text="已开展 LCA 认证主要产品系列覆盖率" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-600 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <span className="font-mono font-bold text-[#2C7CFF] text-xs">
                        {factoryDetailModal.metrics['3.1'].value}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  {/* [3.2] 零碳供应链管理措施符合项数 首项 */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td
                      rowSpan={6}
                      className="py-2.5 px-3.5 font-medium border-r border-slate-100 dark:border-border text-slate-800 dark:text-slate-200 align-middle"
                    >
                      <div className="space-y-1">
                        <div className="font-bold">[3.2] 零碳供应链管理措施符合项数</div>
                        <div className="text-[10.5px] text-slate-400 font-mono">
                          已符合 {factoryDetailModal.supplyChainMeasures?.length || 0} / 6 项
                        </div>
                      </div>
                    </td>
                    <td
                      rowSpan={6}
                      className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-amber-700 font-semibold align-middle"
                    >
                      ✍️ 企业申报
                    </td>
                    <td className="py-2 px-3.5 border-r border-slate-100">
                      {(() => {
                        const opt = SUPPLY_CHAIN_MEASURES_OPTIONS[0]
                        const checked = factoryDetailModal.supplyChainMeasures?.includes(opt.id)
                        return (
                          <div className="flex items-center gap-1.5 min-w-0">
                            {checked ? (
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold', checked ? 'text-emerald-800' : 'text-slate-400')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        )
                      })()}
                    </td>
                    <td className="py-2 px-3.5">
                      {renderDetailItemAttachments(
                        SUPPLY_CHAIN_MEASURES_OPTIONS[0].id,
                        factoryDetailModal.supplyChainMeasures?.includes(SUPPLY_CHAIN_MEASURES_OPTIONS[0].id)
                      )}
                    </td>
                  </tr>

                  {/* [3.2] 其余 5 项按行展开 */}
                  {SUPPLY_CHAIN_MEASURES_OPTIONS.slice(1).map((opt) => {
                    const checked = factoryDetailModal.supplyChainMeasures?.includes(opt.id)
                    return (
                      <tr key={opt.id} className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                        <td className="py-2 px-3.5 border-r border-slate-100">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {checked ? (
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold', checked ? 'text-emerald-800' : 'text-slate-400')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        </td>
                        <td className="py-2 px-3.5">
                          {renderDetailItemAttachments(opt.id, checked)}
                        </td>
                      </tr>
                    )
                  })}

                  {/* 4 智能控碳 (14行：4.1占1行，4.2展开13行) */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td
                      rowSpan={14}
                      className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-border align-middle whitespace-nowrap"
                    >
                      4 智能控碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100 dark:border-border text-slate-800 dark:text-slate-200">[4.1] 数据自动采集率 (Ra)</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-amber-700 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#2C7CFF] text-xs">
                          {factoryDetailModal.autoCollectRate}%
                        </span>
                        <MetricTip text="物联电表、流量计自动采集覆盖率 (GB 17167)" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderDetailMetricAttachments('4.1')}
                    </td>
                  </tr>

                  {/* [4.2] 能碳管理中心功能符合项数 首项 */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td
                      rowSpan={13}
                      className="py-2.5 px-3.5 font-medium border-r border-slate-100 dark:border-border text-slate-800 dark:text-slate-200 align-middle"
                    >
                      <div className="space-y-1">
                        <div className="font-bold">[4.2] 能碳管理中心功能符合项数</div>
                        <div className="text-[10.5px] text-slate-400 font-mono">
                          已符合 {factoryDetailModal.controlCenterFeatures?.length || 0} / 13 项
                        </div>
                      </div>
                    </td>
                    <td
                      rowSpan={13}
                      className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-amber-700 font-semibold align-middle"
                    >
                      ✍️ 企业申报
                    </td>
                    <td className="py-2 px-3.5 border-r border-slate-100">
                      {(() => {
                        const opt = CONTROL_CENTER_FEATURE_OPTIONS[0]
                        const checked = factoryDetailModal.controlCenterFeatures?.includes(opt.id)
                        return (
                          <div className="flex items-center gap-1.5 min-w-0">
                            {checked ? (
                              <span className="text-purple-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold', checked ? 'text-purple-800' : 'text-slate-400')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        )
                      })()}
                    </td>
                    <td className="py-2 px-3.5">
                      {renderDetailItemAttachments(
                        CONTROL_CENTER_FEATURE_OPTIONS[0].id,
                        factoryDetailModal.controlCenterFeatures?.includes(CONTROL_CENTER_FEATURE_OPTIONS[0].id)
                      )}
                    </td>
                  </tr>

                  {/* [4.2] 其余 12 项按行展开 */}
                  {CONTROL_CENTER_FEATURE_OPTIONS.slice(1).map((opt) => {
                    const checked = factoryDetailModal.controlCenterFeatures?.includes(opt.id)
                    return (
                      <tr key={opt.id} className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                        <td className="py-2 px-3.5 border-r border-slate-100">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {checked ? (
                              <span className="text-purple-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold', checked ? 'text-purple-800' : 'text-slate-400')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        </td>
                        <td className="py-2 px-3.5">
                          {renderDetailItemAttachments(opt.id, checked)}
                        </td>
                      </tr>
                    )
                  })}

                  {/* 5 碳抵销和信息披露 (3行：5.1展开3行) */}
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                    <td
                      rowSpan={3}
                      className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-border align-middle whitespace-nowrap"
                    >
                      5 碳抵销和信息披露
                    </td>
                    <td
                      rowSpan={3}
                      className="py-2.5 px-3.5 font-medium border-r border-slate-100 dark:border-border text-slate-800 dark:text-slate-200 align-middle"
                    >
                      <div className="space-y-1">
                        <div className="font-bold">[5.1] 碳排放信息披露透明度与质量</div>
                        <div className="text-[10.5px] text-slate-400 font-mono">
                          已归档 {factoryDetailModal.disclosureFiles?.length || 0} / 3 份
                        </div>
                      </div>
                    </td>
                    <td
                      rowSpan={3}
                      className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-amber-700 font-semibold align-middle"
                    >
                      ✍️ 企业申报
                    </td>
                    <td className="py-2 px-3.5 border-r border-slate-100">
                      {(() => {
                        const opt = DISCLOSURE_DOC_OPTIONS[0]
                        const checked = factoryDetailModal.disclosureFiles?.includes(opt.id)
                        return (
                          <div className="flex items-center gap-1.5 min-w-0">
                            {checked ? (
                              <span className="text-amber-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold', checked ? 'text-amber-800' : 'text-slate-400')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        )
                      })()}
                    </td>
                    <td className="py-2 px-3.5">
                      {renderDetailItemAttachments(
                        DISCLOSURE_DOC_OPTIONS[0].id,
                        factoryDetailModal.disclosureFiles?.includes(DISCLOSURE_DOC_OPTIONS[0].id)
                      )}
                    </td>
                  </tr>

                  {/* [5.1] 其余 2 份按行展开 */}
                  {DISCLOSURE_DOC_OPTIONS.slice(1).map((opt) => {
                    const checked = factoryDetailModal.disclosureFiles?.includes(opt.id)
                    return (
                      <tr key={opt.id} className="hover:bg-slate-50/60 dark:hover:bg-blue-950/20 transition-colors">
                        <td className="py-2 px-3.5 border-r border-slate-100">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {checked ? (
                              <span className="text-amber-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold', checked ? 'text-amber-800' : 'text-slate-400')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        </td>
                        <td className="py-2 px-3.5">
                          {renderDetailItemAttachments(opt.id, checked)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-border shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Paperclip className="size-3.5 text-[#2C7CFF]" />
                <span>全企业归档证明材料与附件：<strong className="text-slate-800 dark:text-foreground font-mono font-bold">{modalAttachments.length}</strong> 份</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span>预估总归档容量：<strong className="text-slate-800 dark:text-foreground font-mono font-bold">{modalTotalSize}</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setBatchDownloadTarget(factoryDetailModal)}
                  className="px-4 py-2 rounded-xl bg-[#2C7CFF] hover:bg-blue-600 text-white font-bold transition-all cursor-pointer text-xs flex items-center gap-1.5 shadow-xs"
                  title="一键打包下载该工厂所有证明材料与附件"
                >
                  <Download className="size-3.5" />
                  <span>一键打包下载全部证明材料 ({modalAttachments.length} 份)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFactoryDetailModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer text-xs"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 填报自查工作台模态框 (面向企业自查填报与短板诊断) */}
      {isDeclareModalOpen && declareFactoryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border border-slate-200 dark:border-border max-w-4xl w-full p-5 sm:p-6 flex flex-col gap-3 font-sans max-h-[94vh] overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-border pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 shrink-0">
                  <Edit3 className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                    【{declareFactoryTarget.factoryName.split('(')[0].trim()}】自评估填报与项目审核材料管理
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDeclareModalOpen(false)}
                className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 工作台主体表单 */}
            <div className="overflow-y-auto max-h-[calc(94vh-140px)] pr-1 custom-scrollbar">
              <form id="declare-form" onSubmit={handleSaveDeclare} className="flex flex-col gap-4 text-xs">
                {/* 填报说明条 */}
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl p-3 flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-xs">
                  <Info className="size-4 text-[#2C7CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#2C7CFF]">自评填报与附件上传说明：</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1">
                      系统采用“自动采集核算 + 定性指标打勾自填 + 真实审核材料证明”模式。每项指标右侧均支持上传项目审核证明文件，支持多附件上传与管理。
                    </span>
                  </div>
                </div>

                {/* 1. 源头减碳 & 2. 过程脱碳 */}
                <div className="border border-slate-200 dark:border-border rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-border">
                    <Zap className="size-4 text-emerald-600" />
                    1 源头减碳 与 2 过程脱碳
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px]">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-border space-y-2">
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">[1.1] 单位能耗碳排放</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#2C7CFF] text-sm">
                          {declareFactoryTarget.metrics['1.1'].value} {declareFactoryTarget.metrics['1.1'].unit || 'tCO₂/tce'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
                          ⚡ 系统自动核算
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 py-1 font-mono">-- (系统自动核算，无需证明材料)</div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-border space-y-2">
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px]">[1.2] 非化石能源消费占比</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#2C7CFF] text-sm">
                          {declareFactoryTarget.metrics['1.2'].value}%
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
                          ⚡ 系统自动核算
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 py-1 font-mono">-- (系统自动核算，无需证明材料)</div>
                    </div>
                  </div>

                  {/* [2.3] 碳清除率 (强制置灰锁定，右侧提示特变电工企业目前无该指标信息) */}
                  <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#2C7CFF] text-xs">[2.3]</span>
                        <span className="font-bold text-slate-800 dark:text-foreground">碳清除率</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-border font-medium">
                          锁定
                        </span>
                      </div>
                      <span className="text-[10.5px] text-slate-400">CCUS / 直接工程碳清除技术</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="relative">
                        <input
                          type="text"
                          disabled
                          value="-- (不适用)"
                          className="h-8 w-28 pl-3 pr-2 rounded-lg border border-dashed border-slate-200 dark:border-border bg-slate-100 dark:bg-slate-700 text-xs font-mono font-bold text-slate-400 cursor-not-allowed select-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 text-xs font-bold shadow-2xs">
                        <AlertCircle className="size-4 shrink-0 text-amber-600" />
                        <span>特变电工企业目前无该指标信息（暂未投运 CCUS 等直接工程碳清除装置）</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 协同降碳 -> 零碳供应链管理措施 (6项自评打勾) */}
                <div className="border border-slate-200 dark:border-border rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-border">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5">
                      <Layers className="size-4 text-indigo-600" />
                      3 协同降碳 · 零碳供应链管理措施 (6 项自评打勾)
                    </h4>
                    <span className="text-[11px] text-indigo-600 font-mono font-bold">
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
                            'p-3 rounded-lg border flex flex-col justify-between gap-2 cursor-pointer transition-colors select-none',
                            checked
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-foreground'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-border text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-800 dark:text-foreground">{opt.title}</span>
                            {checked ? (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-900/60">
                                ✓ 已符合
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-border text-slate-400">
                                待核查
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-slate-400">{opt.desc}</span>
                        </div>
                      )
                    })}
                  </div>

                  {renderMetricAttachmentUpload('3.2', '[3.2] 零碳供应链管理证明材料')}
                </div>

                {/* 4. 智能控碳 -> 自动采集率 & 13 项数字化功能 */}
                <div className="border border-slate-200 dark:border-border rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-border">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5">
                      <Cpu className="size-4 text-purple-600" />
                      4 智能控碳 · 能碳数字化管理中心核验
                    </h4>
                  </div>

                  {/* 4.1 自动采集率输入 */}
                  <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-800 dark:text-foreground font-bold text-xs">[4.1] 重点用能设备数据自动采集率 Ra</span>
                      <span className="text-[11px] text-slate-400">满足 GB 17167 重点设备自动计量要求</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={declareForm.autoCollectRate}
                        onChange={(e) =>
                          setDeclareForm({ ...declareForm, autoCollectRate: parseFloat(e.target.value) || 0 })
                        }
                        className="h-8 w-28 px-2.5 rounded-lg border border-slate-200 dark:border-border bg-white dark:bg-slate-700 text-xs font-mono font-bold text-[#2C7CFF] focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-xs font-bold text-slate-400">%</span>
                    </div>
                    {renderMetricAttachmentUpload('4.1', '[4.1] 自动采集率证明材料')}
                  </div>

                  {/* 4.2 数字化 13 项功能模块多选 */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-foreground text-xs">[4.2] 能碳管理中心 13 项数字化功能核验</span>
                      <span className="text-[11px] text-purple-600 font-mono font-bold">
                        已选 {declareForm.controlCenterFeatures.length} / 13 项
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
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
                              'p-2.5 rounded-lg border flex flex-col justify-between gap-1.5 cursor-pointer transition-colors select-none',
                              checked
                                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-slate-900 dark:text-foreground'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-border text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs truncate max-w-[170px]" title={opt.title}>
                                {opt.title}
                              </span>
                              {checked ? (
                                <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold border border-purple-200 shrink-0">
                                  ✓ 已上线
                                </span>
                              ) : (
                                <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-border text-slate-400 shrink-0">
                                  未勾选
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 line-clamp-2">{opt.desc}</span>
                          </div>
                        )
                      })}
                    </div>

                    {renderMetricAttachmentUpload('4.2', '[4.2] 能碳中心功能证明材料')}
                  </div>
                </div>

                {/* 5. 碳抵销和信息披露 -> 3 大载体文件 */}
                <div className="border border-slate-200 dark:border-border rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-border">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5">
                      <Sparkles className="size-4 text-amber-600" />
                      5 碳抵销和信息披露 · 3 大披露载体文件核验
                    </h4>
                    <span className="text-[11px] text-amber-600 font-mono font-bold">
                      已选 {declareForm.disclosureFiles.length} / 3 份
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
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
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-slate-900 dark:text-foreground'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-border text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <FileText className={cn('size-4', checked ? 'text-amber-600' : 'text-slate-400')} />
                            {checked ? (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-900/60">
                                已归档
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-border text-slate-400">
                                待归档
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-xs block text-slate-800 dark:text-foreground">{opt.title}</span>
                            <span className="text-[10.5px] text-slate-400 block mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {renderMetricAttachmentUpload('5.1', '[5.1] 碳排放信息披露证明材料')}
                </div>
              </form>
            </div>

            {/* 弹窗底部操作 */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-border shrink-0">
              <span className="text-[11px] text-slate-400">
                ⚡ 保存后系统将自动重新核算指标并更新附件证明台账
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeclareModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-colors cursor-pointer text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  form="declare-form"
                  className="px-4 py-2 rounded-xl bg-[#2C7CFF] text-white font-bold hover:bg-blue-600 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                >
                  <Save className="size-3.5" />
                  <span>保存自评与附件</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. 一键打包下载全部证明材料与附件模态框 */}
      {batchDownloadTarget && (
        <BatchDownloadModal
          factory={batchDownloadTarget}
          onClose={() => setBatchDownloadTarget(null)}
        />
      )}
    </div>
  )
}

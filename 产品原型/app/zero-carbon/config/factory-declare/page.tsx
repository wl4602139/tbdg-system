'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
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
  ArrowLeft,
  Lightbulb,
  CheckSquare,
  Square,
  BarChart3,
  Calendar,
  Download,
  Upload,
  Paperclip,
  FolderArchive,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Save,
  X,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BatchDownloadModal } from '@/components/shared/batch-download-modal'
import {
  SUPPLY_CHAIN_MEASURES_OPTIONS,
  CONTROL_CENTER_FEATURE_OPTIONS,
  DISCLOSURE_DOC_OPTIONS,
  ALL_ZERO_CARBON_FACTORIES,
  getMetricItemAttachments,
  type FactoryEvaluationData,
  type EvaluationAttachment,
} from '@/lib/zero-carbon-self-evaluation'

// 悬停显示说明信息的通用小组件 (气泡框交互)
function MetricTip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center group ml-1.5 cursor-help">
      <Info className="size-3.5 text-slate-400 group-hover:text-[#2C7CFF] transition-colors" />
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:flex flex-col items-center z-50">
        <span className="bg-slate-800 text-white text-[11px] font-normal leading-relaxed rounded px-2 py-1 shadow-lg whitespace-nowrap">
          {text}
        </span>
        <span className="w-1.5 h-1.5 bg-slate-800 rotate-45 -mt-0.5"></span>
      </span>
    </span>
  )
}

function formatAttachmentDisplayName(name: string): string {
  return name.replace(/^[a-zA-Z0-9_\u4e00-\u9fa5]+_/, '')
}

function FactoryDeclareInner() {
  const searchParams = useSearchParams()
  const initialFactoryId = searchParams.get('factoryId') || 'f-sb-1'

  const [factories, setFactories] = useState<FactoryEvaluationData[]>(ALL_ZERO_CARBON_FACTORIES)
  const [activeEnterpriseFactoryId, setActiveEnterpriseFactoryId] = useState<string>(initialFactoryId)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [batchDownloadTarget, setBatchDownloadTarget] = useState<FactoryEvaluationData | null>(null)
  const [declareDate, setDeclareDate] = useState<string>('2026-08-28')

  // 表单状态
  const [declareForm, setDeclareForm] = useState<{
    energySavingEquipRate: number
    carbonClearRate: number
    autoCollectRate: number
    supplyChainMeasures: string[]
    controlCenterFeatures: string[]
    disclosureFiles: string[]
    attachments: Record<string, EvaluationAttachment[]>
    notes: string
  }>({
    energySavingEquipRate: 92.0,
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

  // URL searchParams 改变时同步更新
  useEffect(() => {
    const qFactoryId = searchParams.get('factoryId')
    if (qFactoryId && qFactoryId !== activeEnterpriseFactoryId) {
      const match = factories.find((f) => f.id === qFactoryId)
      if (match) {
        setActiveEnterpriseFactoryId(qFactoryId)
      }
    }
  }, [searchParams, factories, activeEnterpriseFactoryId])

  // 当前企业选中的工厂实体
  const activeEnterpriseFactory = useMemo(() => {
    return factories.find((f) => f.id === activeEnterpriseFactoryId) || factories[0]
  }, [factories, activeEnterpriseFactoryId])

  // 选中工厂切换时，自动同步表单数据
  useEffect(() => {
    const target = factories.find((f) => f.id === activeEnterpriseFactoryId)
    if (target) {
      if (target.declareDate) {
        setDeclareDate(target.declareDate)
      }
      setDeclareForm({
        energySavingEquipRate:
          typeof target.metrics['2.2']?.value === 'number'
            ? target.metrics['2.2'].value
            : (parseFloat(String(target.metrics['2.2']?.value)) || 92.0),
        carbonClearRate: 0,
        autoCollectRate: target.autoCollectRate || 98.6,
        supplyChainMeasures: target.supplyChainMeasures || ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5', 'sc-6'],
        controlCenterFeatures:
          target.controlCenterFeatures || [
            'cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12', 'cc-13'
          ],
        disclosureFiles: target.disclosureFiles || ['doc-1', 'doc-2', 'doc-3'],
        attachments: target.attachments ? JSON.parse(JSON.stringify(target.attachments)) : {},
        notes: target.notes || '',
      })
    }
  }, [activeEnterpriseFactoryId, factories])

  // 上传单个指标附件（严格限制仅支持 PDF 与 Word 格式文档）
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

  // 移除附件
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

  // 下载证明材料
  const handleDownloadAttachment = (fileName: string) => {
    setToastMessage(`已启动下载证明文件：${fileName}`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 保存企业填报
  const handleSaveEnterpriseDeclare = () => {
    const updated = factories.map((f) => {
      if (f.id === activeEnterpriseFactory.id) {
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
          declareDate: declareDate,
          status: '已自评已申报' as const,
          notes: declareForm.notes,
          metrics: {
            ...f.metrics,
            '2.2': {
              ...f.metrics['2.2'],
              value: declareForm.energySavingEquipRate,
              type: 'declared' as const,
            },
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
              value: `已归档 ${declareForm.disclosureFiles.length}/3 份`,
            },
          },
        }
      }
      return f
    })

    setFactories(updated)
    setToastMessage(`【${activeEnterpriseFactory.factoryName}】申报数据已成功保存（申报时间: ${declareDate}）！`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 渲染附件区域
  const renderEnterpriseMetricAttachments = (metricKey: string, metricTitle: string) => {
    if (metricKey === '2.3') {
      return <span className="text-slate-400 font-mono text-xs">--</span>
    }
    const fallbackList = getMetricItemAttachments(activeEnterpriseFactory, metricKey)
    const attList = declareForm.attachments?.[metricKey] || fallbackList

    return (
      <div className="flex items-center justify-between gap-2 py-0.5 w-full">
        <div className="flex-1 min-w-0">
          {attList.length > 0 ? (
            <div className="space-y-1">
              {attList.map((file) => {
                const isWord = file.type === 'docx' || file.name.endsWith('.docx') || file.name.endsWith('.doc')
                const isSheet = file.type === 'xlsx' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
                const displayName = formatAttachmentDisplayName(file.name)
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs w-full"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {isWord ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
                          <FileText className="size-2.5" />
                          WORD
                        </span>
                      ) : isSheet ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                          <FileSpreadsheet className="size-2.5" />
                          XLS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
                          <FileText className="size-2.5" />
                          PDF
                        </span>
                      )}
                      <span
                        className="text-[11.5px] font-medium text-slate-800 truncate flex-1 min-w-0"
                        title={file.name}
                      >
                        {displayName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                        {file.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDownloadAttachment(file.name)}
                        className="inline-flex items-center gap-1 text-primary hover:text-white hover:bg-primary px-1.5 py-0.5 rounded text-[10.5px] font-semibold transition-colors border border-primary/20 hover:border-primary shadow-2xs cursor-pointer"
                        title={`下载 ${file.name}`}
                      >
                        <Download className="size-2.5" />
                        <span>下载</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(metricKey, file.id)}
                        className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                        title="删除此附件"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 italic">暂未挂载证明材料</span>
          )}
        </div>

        <label
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs shrink-0 self-center"
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
    )
  }

  // 渲染单个指标子项（按行逐项对齐）的证明材料与附件上传
  const renderEnterpriseItemAttachments = (itemId: string, itemTitle: string) => {
    const fallbackList = getMetricItemAttachments(activeEnterpriseFactory, itemId)
    const attList = declareForm.attachments?.[itemId] || fallbackList

    return (
      <div className="flex items-center justify-between gap-2 py-0.5 w-full">
        <div className="flex-1 min-w-0">
          {attList.length > 0 ? (
            <div className="space-y-1">
              {attList.map((file) => {
                const isWord = file.type === 'docx' || file.name.endsWith('.docx') || file.name.endsWith('.doc')
                const isSheet = file.type === 'xlsx' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
                const displayName = formatAttachmentDisplayName(file.name)
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs w-full"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {isWord ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
                          <FileText className="size-2.5" />
                          WORD
                        </span>
                      ) : isSheet ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                          <FileSpreadsheet className="size-2.5" />
                          XLS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
                          <FileText className="size-2.5" />
                          PDF
                        </span>
                      )}
                      <span
                        className="text-[11.5px] font-medium text-slate-800 truncate flex-1 min-w-0"
                        title={file.name}
                      >
                        {displayName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                        {file.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDownloadAttachment(file.name)}
                        className="inline-flex items-center gap-1 text-primary hover:text-white hover:bg-primary px-1.5 py-0.5 rounded text-[10.5px] font-semibold transition-colors border border-primary/20 hover:border-primary shadow-2xs cursor-pointer"
                        title={`下载 ${file.name}`}
                      >
                        <Download className="size-2.5" />
                        <span>下载</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(itemId, file.id)}
                        className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                        title="删除此附件"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 italic">暂未挂载证明材料</span>
          )}
        </div>

        <label
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-[11px] font-bold transition-colors cursor-pointer shadow-2xs shrink-0"
          title="上传 PDF 或 Word 格式文档（.pdf, .doc, .docx）"
        >
          <Upload className="size-3" />
          <span>上传</span>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleFileUpload(e, itemId)}
          />
        </label>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 顶部全局提示 Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2.5 rounded-lg bg-emerald-600 text-white shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="size-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 面包屑导航与页面主标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/zero-carbon/config/entry" className="hover:text-foreground transition-colors">
            企业信息管理
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-semibold">零碳工厂信息</span>
        </div>
      </div>

      {/* 数据填报工作台主体 */}
      <div className="space-y-6">
        {/* 1. 顶部 Header (操作按钮仅保留一个保存) */}
        <div className="bg-card p-4 rounded-xl border border-border backdrop-blur-sm shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                零碳工厂信息
              </h2>
            </div>
          </div>

          {/* 右侧：申报时间选择与操作按钮 */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-xs shadow-2xs font-mono">
              <Calendar className="size-4 text-slate-400 shrink-0" />
              <input
                type="date"
                value={declareDate}
                onChange={(e) => e.target.value && setDeclareDate(e.target.value)}
                className="bg-transparent border-0 text-slate-800 dark:text-foreground text-xs font-bold focus:outline-none cursor-pointer"
                title="申报时间"
              />
            </div>
            <button
              type="button"
              onClick={() => setBatchDownloadTarget(activeEnterpriseFactory)}
              className="px-3.5 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="一键将该企业所有证明材料和附件打包为 ZIP 下载"
            >
              <FolderArchive className="size-3.5" />
              <span>一键打包下载材料</span>
            </button>
            <button
              type="button"
              onClick={handleSaveEnterpriseDeclare}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Save className="size-3.5" />
              <span>保存</span>
            </button>
          </div>
        </div>

        {/* 2. 核心填报工作台：五大维度11项指标填报明细列表 */}
        <div className="bg-card rounded-xl border border-border backdrop-blur-sm shadow-xs p-4 space-y-3">
          {/* 工业高密表格 (强制 44px 行高标准) */}
          <div className="overflow-x-auto rounded-lg border border-border shadow-2xs">
            <table className="w-full min-w-[1360px] text-left border-collapse text-xs table-fixed">
              <thead className="bg-panel/90 sticky top-0 z-10 border-b border-border text-[11.5px] text-muted-foreground font-semibold">
                <tr className="h-[44px]">
                  <th className="py-2.5 px-3 w-[8%] min-w-[100px] text-center border-r border-border/40 whitespace-nowrap">
                    维度类别
                  </th>
                  <th className="py-2.5 px-3.5 w-[22%] min-w-[290px] border-r border-border/40 whitespace-nowrap">
                    指标代码与名称
                  </th>
                  <th className="py-2.5 px-3 w-[7%] min-w-[90px] text-center border-r border-border/40 whitespace-nowrap">
                    取值方式
                  </th>
                  <th className="py-2.5 px-3.5 w-[30%] min-w-[380px] border-r border-border/40">
                    申报参数配置
                  </th>
                  <th className="py-2.5 px-3.5 w-[33%] min-w-[420px]">
                    证明材料与多附件管理
                  </th>
                </tr>
              </thead>
                <tbody className="divide-y divide-border/60 text-foreground text-[11.5px]">
                  {/* ===================== 1 源头减碳 (3项) ===================== */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td
                      rowSpan={3}
                      className="py-3 px-3 text-center font-bold text-foreground bg-slate-50/50 border-r border-border/40 align-middle whitespace-nowrap"
                    >
                      1 源头减碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/40 text-foreground">
                      <div className="flex items-center gap-1">
                        <span>[1.1] 单位能耗碳排放</span>
                        <MetricTip text="物联电表+蒸汽+燃气能耗核算" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-emerald-600 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/40">
                      <span className="font-mono font-bold text-primary text-xs">
                        {activeEnterpriseFactory.metrics['1.1'].value} {activeEnterpriseFactory.metrics['1.1'].unit || 'tCO₂/tce'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/40 text-foreground">
                      <div className="flex items-center gap-1">
                        <span>[1.2] 非化石能源消费占比</span>
                        <MetricTip text="绿电交易凭单自动汇总" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-emerald-600 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/40">
                      <span className="font-mono font-bold text-primary text-xs">
                        {activeEnterpriseFactory.metrics['1.2'].value}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/40 text-foreground">
                      <div className="flex items-center gap-1">
                        <span>[1.3] 非化石能源电力消费物理认定量占比</span>
                        <MetricTip text="厂区分布式光伏自发自用" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-emerald-600 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/40">
                      <span className="font-mono font-bold text-primary text-xs">
                        {activeEnterpriseFactory.metrics['1.3'].value}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  {/* ===================== 2 过程脱碳 (3项) ===================== */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td
                      rowSpan={3}
                      className="py-3 px-3 text-center font-bold text-foreground bg-slate-50/50 border-r border-border/40 align-middle whitespace-nowrap"
                    >
                      2 过程脱碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/40 text-foreground">
                      <div className="flex items-center gap-1">
                        <span>[2.1] 单位工业增加值能耗</span>
                        <MetricTip text="统计期内综合能源消费量与工业增加值的比值 (对接财务 ERP 工业增加值联动)" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-emerald-600 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/40">
                      <span className="font-mono font-bold text-primary text-xs">
                        {activeEnterpriseFactory.metrics['2.1'].value} {activeEnterpriseFactory.metrics['2.1'].unit || 'tce/万元'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/40 text-foreground">
                      <div className="flex items-center gap-1">
                        <span>[2.2] 节能装备应用占比</span>
                        <MetricTip text="在役重点用能设备达到国家2级能效及以上容量占比" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-amber-600 font-semibold">
                      ✍️ 企业填报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/40">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={declareForm.energySavingEquipRate}
                          onChange={(e) =>
                            setDeclareForm({
                              ...declareForm,
                              energySavingEquipRate: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="h-8 w-24 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold text-primary focus:outline-hidden focus:ring-1 focus:ring-primary shadow-2xs"
                        />
                        <span className="font-bold text-slate-700 text-xs">%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderEnterpriseMetricAttachments('2.2', '[2.2] 节能装备应用证明材料')}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/40 text-slate-800">
                      <div className="flex items-center gap-1">
                        <span>[2.3] 碳清除率</span>
                        <MetricTip text="统计期内碳捕集、利用与封存量 (CCUS) 占核算边界内碳排放总量的比值" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-slate-400 font-semibold">
                      锁定
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/40">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400 text-xs">-- (不适用)</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
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

                  {/* ===================== 3 协同降碳 (7行) ===================== */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td
                      rowSpan={7}
                      className="py-3 px-3 text-center font-bold text-foreground bg-slate-50/50 border-r border-border/40 align-middle whitespace-nowrap"
                    >
                      3 协同降碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/40 text-foreground">
                      <div className="flex items-center gap-1">
                        <span>[3.1] 开展产品碳足迹分析占比</span>
                        <MetricTip text="已开展 LCA 认证主要产品系列覆盖率" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-emerald-600 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/40">
                      <span className="font-mono font-bold text-primary text-xs">
                        {activeEnterpriseFactory.metrics['3.1'].value}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-xs">
                      --
                    </td>
                  </tr>

                  {/* [3.2] 零碳供应链管理措施符合项数 首项 */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td
                      rowSpan={6}
                      className="py-2.5 px-3.5 font-medium border-r border-border/40 text-foreground align-middle"
                    >
                      <div className="space-y-1">
                        <div className="font-bold">[3.2] 零碳供应链管理措施符合项数</div>
                        <div className="text-[10.5px] text-muted-foreground font-mono">
                          已选 {declareForm.supplyChainMeasures.length} / 6 项
                        </div>
                      </div>
                    </td>
                    <td
                      rowSpan={6}
                      className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-amber-600 font-semibold align-middle"
                    >
                      ✍️ 企业申报
                    </td>
                    <td className="py-2 px-3.5 border-r border-border/40">
                      {(() => {
                        const opt = SUPPLY_CHAIN_MEASURES_OPTIONS[0]
                        const checked = declareForm.supplyChainMeasures.includes(opt.id)
                        return (
                          <div
                            onClick={() => {
                              const next = checked
                                ? declareForm.supplyChainMeasures.filter((x) => x !== opt.id)
                                : [...declareForm.supplyChainMeasures, opt.id]
                              setDeclareForm({ ...declareForm, supplyChainMeasures: next })
                            }}
                            className="flex items-center gap-1.5 min-w-0 cursor-pointer select-none group"
                          >
                            {checked ? (
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold transition-colors', checked ? 'text-emerald-800' : 'text-slate-400 group-hover:text-slate-600')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        )
                      })()}
                    </td>
                    <td className="py-2 px-3.5">
                      {renderEnterpriseItemAttachments(SUPPLY_CHAIN_MEASURES_OPTIONS[0].id, SUPPLY_CHAIN_MEASURES_OPTIONS[0].title)}
                    </td>
                  </tr>

                  {/* [3.2] 其余 5 项按行展开 */}
                  {SUPPLY_CHAIN_MEASURES_OPTIONS.slice(1).map((opt) => {
                    const checked = declareForm.supplyChainMeasures.includes(opt.id)
                    return (
                      <tr key={opt.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3.5 border-r border-border/40">
                          <div
                            onClick={() => {
                              const next = checked
                                ? declareForm.supplyChainMeasures.filter((x) => x !== opt.id)
                                : [...declareForm.supplyChainMeasures, opt.id]
                              setDeclareForm({ ...declareForm, supplyChainMeasures: next })
                            }}
                            className="flex items-center gap-1.5 min-w-0 cursor-pointer select-none group"
                          >
                            {checked ? (
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold transition-colors', checked ? 'text-emerald-800' : 'text-slate-400 group-hover:text-slate-600')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        </td>
                        <td className="py-2 px-3.5">
                          {renderEnterpriseItemAttachments(opt.id, opt.title)}
                        </td>
                      </tr>
                    )
                  })}

                  {/* ===================== 4 智能控碳 (14行) ===================== */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td
                      rowSpan={14}
                      className="py-3 px-3 text-center font-bold text-foreground bg-slate-50/50 border-r border-border/40 align-middle whitespace-nowrap"
                    >
                      4 智能控碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-border/40 text-foreground">
                      <div className="flex items-center gap-1">
                        <span>[4.1] 数据自动采集率 (Ra)</span>
                        <MetricTip text="物联电表、流量计自动采集覆盖率 (GB 17167)" />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-amber-600 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-border/40">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={declareForm.autoCollectRate}
                          onChange={(e) =>
                            setDeclareForm({
                              ...declareForm,
                              autoCollectRate: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="h-8 w-24 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold text-primary focus:outline-hidden focus:ring-1 focus:ring-primary shadow-2xs"
                        />
                        <span className="font-bold text-slate-700 text-xs">%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      {renderEnterpriseMetricAttachments('4.1', '[4.1] 数据自动采集率证明')}
                    </td>
                  </tr>

                  {/* [4.2] 能碳管理中心功能符合项数 首项 */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td
                      rowSpan={13}
                      className="py-2.5 px-3.5 font-medium border-r border-border/40 text-foreground align-middle"
                    >
                      <div className="space-y-1">
                        <div className="font-bold">[4.2] 能碳管理中心功能符合项数</div>
                        <div className="text-[10.5px] text-muted-foreground font-mono">
                          已核验 {declareForm.controlCenterFeatures.length} / 13 项
                        </div>
                      </div>
                    </td>
                    <td
                      rowSpan={13}
                      className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-amber-600 font-semibold align-middle"
                    >
                      ✍️ 企业申报
                    </td>
                    <td className="py-2 px-3.5 border-r border-border/40">
                      {(() => {
                        const opt = CONTROL_CENTER_FEATURE_OPTIONS[0]
                        const checked = declareForm.controlCenterFeatures.includes(opt.id)
                        return (
                          <div
                            onClick={() => {
                              const next = checked
                                ? declareForm.controlCenterFeatures.filter((x) => x !== opt.id)
                                : [...declareForm.controlCenterFeatures, opt.id]
                              setDeclareForm({ ...declareForm, controlCenterFeatures: next })
                            }}
                            className="flex items-center gap-1.5 min-w-0 cursor-pointer select-none group"
                          >
                            {checked ? (
                              <span className="text-purple-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold transition-colors', checked ? 'text-purple-800' : 'text-slate-400 group-hover:text-slate-600')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        )
                      })()}
                    </td>
                    <td className="py-2 px-3.5">
                      {renderEnterpriseItemAttachments(CONTROL_CENTER_FEATURE_OPTIONS[0].id, CONTROL_CENTER_FEATURE_OPTIONS[0].title)}
                    </td>
                  </tr>

                  {/* [4.2] 其余 12 项按行展开 */}
                  {CONTROL_CENTER_FEATURE_OPTIONS.slice(1).map((opt) => {
                    const checked = declareForm.controlCenterFeatures.includes(opt.id)
                    return (
                      <tr key={opt.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3.5 border-r border-border/40">
                          <div
                            onClick={() => {
                              const next = checked
                                ? declareForm.controlCenterFeatures.filter((x) => x !== opt.id)
                                : [...declareForm.controlCenterFeatures, opt.id]
                              setDeclareForm({ ...declareForm, controlCenterFeatures: next })
                            }}
                            className="flex items-center gap-1.5 min-w-0 cursor-pointer select-none group"
                          >
                            {checked ? (
                              <span className="text-purple-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold transition-colors', checked ? 'text-purple-800' : 'text-slate-400 group-hover:text-slate-600')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        </td>
                        <td className="py-2 px-3.5">
                          {renderEnterpriseItemAttachments(opt.id, opt.title)}
                        </td>
                      </tr>
                    )
                  })}

                  {/* ===================== 5 碳抵销和信息披露 (3行) ===================== */}
                  {/* [5.1] 碳排放信息披露透明度与质量 首项 */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td
                      rowSpan={3}
                      className="py-3 px-3 text-center font-bold text-foreground bg-slate-50/50 border-r border-border/40 align-middle whitespace-nowrap"
                    >
                      5 碳抵销和信息披露
                    </td>
                    <td
                      rowSpan={3}
                      className="py-2.5 px-3.5 font-medium border-r border-border/40 text-foreground align-middle"
                    >
                      <div className="space-y-1">
                        <div className="font-bold">[5.1] 碳排放信息披露透明度与质量</div>
                        <div className="text-[10.5px] text-muted-foreground font-mono">
                          已归档 {declareForm.disclosureFiles.length} / 3 份
                        </div>
                      </div>
                    </td>
                    <td
                      rowSpan={3}
                      className="py-2.5 px-3 text-center border-r border-border/40 whitespace-nowrap text-amber-600 font-semibold align-middle"
                    >
                      ✍️ 企业申报
                    </td>
                    <td className="py-2 px-3.5 border-r border-border/40">
                      {(() => {
                        const opt = DISCLOSURE_DOC_OPTIONS[0]
                        const checked = declareForm.disclosureFiles.includes(opt.id)
                        return (
                          <div
                            onClick={() => {
                              const next = checked
                                ? declareForm.disclosureFiles.filter((x) => x !== opt.id)
                                : [...declareForm.disclosureFiles, opt.id]
                              setDeclareForm({ ...declareForm, disclosureFiles: next })
                            }}
                            className="flex items-center gap-1.5 min-w-0 cursor-pointer select-none group"
                          >
                            {checked ? (
                              <span className="text-amber-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold transition-colors', checked ? 'text-amber-800' : 'text-slate-400 group-hover:text-slate-600')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        )
                      })()}
                    </td>
                    <td className="py-2 px-3.5">
                      {renderEnterpriseItemAttachments(DISCLOSURE_DOC_OPTIONS[0].id, DISCLOSURE_DOC_OPTIONS[0].title)}
                    </td>
                  </tr>

                  {/* [5.1] 其余 2 项按行展开 */}
                  {DISCLOSURE_DOC_OPTIONS.slice(1).map((opt) => {
                    const checked = declareForm.disclosureFiles.includes(opt.id)
                    return (
                      <tr key={opt.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3.5 border-r border-border/40">
                          <div
                            onClick={() => {
                              const next = checked
                                ? declareForm.disclosureFiles.filter((x) => x !== opt.id)
                                : [...declareForm.disclosureFiles, opt.id]
                              setDeclareForm({ ...declareForm, disclosureFiles: next })
                            }}
                            className="flex items-center gap-1.5 min-w-0 cursor-pointer select-none group"
                          >
                            {checked ? (
                              <span className="text-amber-600 font-bold shrink-0">✓</span>
                            ) : (
                              <span className="text-slate-300 font-bold shrink-0">○</span>
                            )}
                            <span className={cn('text-xs font-bold transition-colors', checked ? 'text-amber-800' : 'text-slate-400 group-hover:text-slate-600')}>
                              {opt.title}
                            </span>
                            <MetricTip text={opt.desc} />
                          </div>
                        </td>
                        <td className="py-2 px-3.5">
                          {renderEnterpriseItemAttachments(opt.id, opt.title)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
      </div>

      {/* 一键打包下载全部证明材料与附件模态框 */}
      {batchDownloadTarget && (
        <BatchDownloadModal
          factory={batchDownloadTarget}
          onClose={() => setBatchDownloadTarget(null)}
        />
      )}
    </div>
  )
}

export default function FactoryDeclarePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px] text-xs text-muted-foreground">
          正在加载零碳工厂信息...
        </div>
      }
    >
      <FactoryDeclareInner />
    </Suspense>
  )
}

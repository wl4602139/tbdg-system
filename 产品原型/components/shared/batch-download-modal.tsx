'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Download,
  Package,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  FolderArchive,
  X,
  Loader2,
  Folder,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type FactoryEvaluationData,
} from '@/lib/zero-carbon-self-evaluation'
import {
  getAllFactoryAttachments,
  calculateTotalAttachmentsSize,
  generateFactoryZipPackage,
  triggerBlobDownload,
  type FactoryAttachmentItem,
} from '@/lib/factory-attachment-downloader'

interface BatchDownloadModalProps {
  factory: FactoryEvaluationData | null
  onClose: () => void
}

export function BatchDownloadModal({ factory, onClose }: BatchDownloadModalProps) {
  const [progress, setProgress] = useState(0)
  const [phaseText, setPhaseText] = useState('准备开始打包...')
  const [isDone, setIsDone] = useState(false)
  const [packageData, setPackageData] = useState<{
    blob: Blob
    filename: string
    fileCount: number
    totalSizeStr: string
    items: FactoryAttachmentItem[]
  } | null>(null)

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '01_源头减碳': true,
    '02_过程脱碳': true,
    '03_协同降碳': true,
    '04_智能控碳': false,
    '05_碳抵销和信息披露': false,
  })

  // 按子目录对材料进行归类分组
  const groupedItems = useMemo(() => {
    if (!packageData) return {}
    const groups: Record<string, FactoryAttachmentItem[]> = {}
    packageData.items.forEach((it) => {
      const topFolder = it.subfolder.split('/')[0]
      if (!groups[topFolder]) groups[topFolder] = []
      groups[topFolder].push(it)
    })
    return groups
  }, [packageData])

  useEffect(() => {
    if (!factory) return

    setProgress(5)
    setPhaseText('正在检索企业 5 大维度核验材料档案库...')
    setIsDone(false)

    // 生成 ZIP 包
    const pkg = generateFactoryZipPackage(factory)
    setPackageData(pkg)

    const timer1 = setTimeout(() => {
      setProgress(35)
      setPhaseText('正在归集 1. 源头减碳 与 2. 过程脱碳 技术报告与计量台账...')
    }, 280)

    const timer2 = setTimeout(() => {
      setProgress(70)
      setPhaseText('正在打包 3. 协同降碳 认证与 4. 智能控碳 13 项功能凭据...')
    }, 620)

    const timer3 = setTimeout(() => {
      setProgress(92)
      setPhaseText('正在生成 5. 碳抵销信息披露报告与 ZIP 压缩数据流...')
    }, 950)

    const timer4 = setTimeout(() => {
      setProgress(100)
      setPhaseText('打包完成！已生成全量证明材料归档压缩包。')
      setIsDone(true)
      // 自动触发一次下载
      triggerBlobDownload(pkg.blob, pkg.filename)
    }, 1250)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [factory])

  if (!factory || !packageData) return null

  const handleRedownload = () => {
    if (packageData) {
      triggerBlobDownload(packageData.blob, packageData.filename)
    }
  }

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderKey]: !prev[folderKey],
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150 font-sans">
      <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border border-slate-200 dark:border-border max-w-2xl w-full p-5 flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-[#2C7CFF] shrink-0">
              <FolderArchive className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                一键打包下载证明材料与附件
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 打包进度条卡片 */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-panel border border-slate-200/80 dark:border-border space-y-2.5 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              {!isDone ? (
                <Loader2 className="size-4 text-[#2C7CFF] animate-spin" />
              ) : (
                <CheckCircle2 className="size-4 text-emerald-600" />
              )}
              <span>{phaseText}</span>
            </div>
            <span className={cn('font-mono font-bold', isDone ? 'text-emerald-600' : 'text-[#2C7CFF]')}>
              {progress}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-300 rounded-full',
                isDone ? 'bg-emerald-500' : 'bg-[#2C7CFF]'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          {isDone && (
            <div className="flex items-center justify-between text-[11.5px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 px-3 py-1.5 rounded-lg">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>已成功触发浏览器下载：<strong>{packageData.filename}</strong></span>
              </span>
              <span className="font-mono text-emerald-800 dark:text-emerald-200">
                共 {packageData.fileCount} 份材料 · {packageData.totalSizeStr}
              </span>
            </div>
          )}
        </div>

        {/* 归档文件树目录预览 */}
        <div className="space-y-1.5 flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-bold">
            <span>ZIP 压缩包内文件结构与目录清单</span>
            <span className="text-[11px] font-normal text-slate-400">
              包含 00_总览清单.md 及 5 个维度分类目录
            </span>
          </div>

          <div className="border border-slate-200 dark:border-border rounded-xl overflow-y-auto max-h-[300px] p-2 bg-[#FAFBFD] dark:bg-panel space-y-1 custom-scrollbar text-xs font-mono">
            {/* 根目录总览文档 */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-card border border-slate-200 dark:border-border text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="size-4 text-[#2C7CFF] shrink-0" />
                <span className="font-sans font-bold text-xs truncate">
                  00_【{factory.factoryName}】零碳工厂自评估证明材料与附件总览清单.md
                </span>
              </div>
              <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 shrink-0">
                索引清单
              </span>
            </div>

            {/* 5 个子目录及包含的文件 */}
            {Object.entries(groupedItems).map(([folderKey, fileList]) => {
              const isOpen = expandedFolders[folderKey] ?? true
              return (
                <div key={folderKey} className="rounded-lg border border-slate-200 dark:border-border bg-white dark:bg-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleFolder(folderKey)}
                    className="w-full flex items-center justify-between p-2 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {isOpen ? (
                        <ChevronDown className="size-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="size-3.5 text-slate-400" />
                      )}
                      <Folder className="size-4 text-amber-500 fill-amber-100 dark:fill-amber-950/40" />
                      <span className="font-sans font-bold text-xs text-slate-800 dark:text-white">
                        {folderKey}/
                      </span>
                    </div>
                    <span className="text-[10.5px] font-mono text-slate-400">
                      {fileList.length} 份附件
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 dark:border-border divide-y divide-slate-100/80 dark:divide-slate-800 pl-6 pr-2 bg-slate-50/40 dark:bg-panel/40">
                      {fileList.map((file) => {
                        const isSheet = file.fileType === 'xlsx'
                        return (
                          <div
                            key={file.id}
                            className="py-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {isSheet ? (
                                <FileSpreadsheet className="size-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <FileText className="size-3.5 text-rose-500 shrink-0" />
                              )}
                              <span className="font-sans text-slate-700 dark:text-slate-200 truncate" title={file.fileName}>
                                {file.fileName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-sans">
                                ({file.metricCode})
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {file.fileSize}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 弹窗底栏操作 */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-border shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Package className="size-3.5 text-slate-400" />
            <span>打包格式为标准 UTF-8 兼容 ZIP，支持任意解压软件解压</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRedownload}
              disabled={!isDone}
              className={cn(
                'px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer',
                isDone
                  ? 'bg-[#2C7CFF] hover:bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              )}
            >
              <Download className="size-3.5" />
              <span>重新下载压缩包</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Database,
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  CheckCircle2,
  FolderTree,
  Cpu,
  Check,
  X,
  RotateCcw,
  Sliders,
  Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/shared/modal'
import { INITIAL_BASIC_DATA, type BasicDataItem } from '@/lib/basic-data-dictionary'
import { getProductRelationsForBasicData } from '@/lib/data-governance-hub'

// 本地持久化存储 Key
const LOCAL_STORAGE_KEY = 'tbea_basic_data_storage_v1'

// 4 大标准频次 (遵循 tbea-industrial-design 规范)
const STANDARD_FREQS = ['实时采集', '日更新', '月更新', '静态数据']

// 5 大标准集成方式
const STANDARD_CHANNELS = [
  '系统自动采集',
  '数据对接',
  '集控平台人工填报',
  '平台引擎计算',
  '第三方API集成',
]

// 移除数据来源字符串中的中英文括号及括号内编码内容 (如 SRC-06 等)
function cleanSource(str?: string): string {
  if (!str) return ''
  return str.replace(/[\(（][^\)）]*[\)）]/g, '').trim()
}

export interface BasicDataSectionProps {
  onNavigate?: (module: 'basic-data' | 'product-type' | 'product-model', params?: Record<string, string>) => void
  initialParams?: Record<string, string>
}

export function BasicDataSection({ onNavigate, initialParams }: BasicDataSectionProps) {
  // 全量数据状态 (310项物理基础数据)
  const [dataList, setDataList] = useState<BasicDataItem[]>(INITIAL_BASIC_DATA)

  // 筛选状态 (物理实物量基础数据)
  const [filterSourceSys, setFilterSourceSys] = useState<string>('ALL')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>(initialParams?.code || initialParams?.search || '')

  // 响应外部跳转参数联动
  useEffect(() => {
    if (initialParams?.code) {
      setSearchQuery(initialParams.code)
      setCurrentPage(1)
    } else if (initialParams?.search) {
      setSearchQuery(initialParams.search)
      setCurrentPage(1)
    }
  }, [initialParams])

  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 15

  // 详情弹窗状态
  const [detailItem, setDetailItem] = useState<BasicDataItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)

  // 编辑弹窗状态
  const [editingItem, setEditingItem] = useState<BasicDataItem | null>(null)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [editForm, setEditForm] = useState<Partial<BasicDataItem>>({})

  // 新增弹窗状态
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [addForm, setAddForm] = useState<Partial<BasicDataItem>>({
    code: '',
    name: '',
    category: '能源数据',
    unit: '',
    defaultVal: '0.00',
    source: '项目公司本地EMS',
    sourceChannel: '数据对接',
    method: '系统接口对接',
    freq: '日更新',
    granularity: '工厂级',
    duty: '各项目公司',
    desc: '',
  })

  // 提示信息
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // 单行即时行内编辑状态
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [rowDraft, setRowDraft] = useState<Partial<BasicDataItem>>({})

  // 批量全表编辑状态
  const [isBatchEditing, setIsBatchEditing] = useState<boolean>(false)
  const [batchDraft, setBatchDraft] = useState<Record<string, Partial<BasicDataItem>>>({})

  // 从本地 localStorage 加载持久化数据
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDataList(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load local basic data', e)
    }
  }, [])

  // 持久化保存工具函数
  function persistData(newList: BasicDataItem[]) {
    setDataList(newList)
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList))
    } catch (e) {
      console.error('Failed to save local basic data', e)
    }
  }

  // 恢复出厂系统默认
  function handleResetToDefault() {
    if (confirm('确认将全域基础数据重置为系统出厂预设字典（310项）？您所做的本地编辑与新增项将被清空。')) {
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      } catch (e) {}
      setDataList(INITIAL_BASIC_DATA)
      setIsBatchEditing(false)
      setEditingRowId(null)
      setBatchDraft({})
      showToast('已成功重置为系统出厂预设基础数据字典！')
    }
  }

  // 开启单行就地编辑
  function handleStartRowEdit(item: BasicDataItem) {
    if (isBatchEditing) return
    setEditingRowId(item.id)
    setRowDraft({
      name: item.name,
      category: item.category,
      unit: item.unit,
      defaultVal: item.defaultVal || '0.00',
      source: cleanSource(item.source),
      sourceChannel: item.sourceChannel,
      freq: item.freq || '日更新',
    })
  }

  // 保存单行就地编辑
  function handleSaveRowInline(item: BasicDataItem) {
    if (!editingRowId || !rowDraft.name) return
    const updated = dataList.map((it) =>
      it.id === editingRowId
        ? ({
            ...it,
            ...rowDraft,
            source: cleanSource(rowDraft.source || it.source),
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          } as BasicDataItem)
        : it
    )
    persistData(updated)
    setEditingRowId(null)
    setRowDraft({})
    showToast(`基础数据【${rowDraft.name}】(${item.code}) 修改已成功保存并本地持久化！`)
  }

  // 取消单行就地编辑
  function handleCancelRowInline() {
    setEditingRowId(null)
    setRowDraft({})
  }

  // 批量编辑模式中更新单元格数值
  function updateBatchField(id: string, field: keyof BasicDataItem, val: any) {
    setBatchDraft((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: val,
      },
    }))
  }

  // 计算批量编辑中实际被修改的条目数
  const modifiedBatchCount = useMemo(() => {
    return Object.keys(batchDraft).filter((id) => {
      const draft = batchDraft[id]
      const orig = dataList.find((d) => d.id === id)
      if (!orig || !draft) return false
      return (
        (draft.name !== undefined && draft.name !== orig.name) ||
        (draft.category !== undefined && draft.category !== orig.category) ||
        (draft.unit !== undefined && draft.unit !== orig.unit) ||
        (draft.defaultVal !== undefined && draft.defaultVal !== orig.defaultVal) ||
        (draft.source !== undefined && draft.source !== cleanSource(orig.source)) ||
        (draft.sourceChannel !== undefined && draft.sourceChannel !== orig.sourceChannel) ||
        (draft.freq !== undefined && draft.freq !== orig.freq)
      )
    }).length
  }, [batchDraft, dataList])

  // 保存批量编辑的所有修改
  function handleSaveBatch() {
    const modifiedIds = Object.keys(batchDraft)
    if (modifiedIds.length === 0) {
      setIsBatchEditing(false)
      showToast('未检测到任何修改，已退出批量编辑。')
      return
    }

    const updated = dataList.map((item) => {
      const draft = batchDraft[item.id]
      if (!draft) return item
      return {
        ...item,
        ...draft,
        source: cleanSource(draft.source || item.source),
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      } as BasicDataItem
    })

    persistData(updated)
    setIsBatchEditing(false)
    setBatchDraft({})
    showToast(`成功批量保存 ${modifiedBatchCount} 项基础数据变更！已本地持久化。`)
  }

  // 取消批量编辑
  function handleCancelBatch() {
    if (modifiedBatchCount > 0) {
      if (!confirm(`当前有 ${modifiedBatchCount} 项修改尚未保存，确认放弃并退出批量编辑模式？`)) {
        return
      }
    }
    setIsBatchEditing(false)
    setBatchDraft({})
    showToast('已取消批量编辑，所有未保存修改已还原。')
  }

  // 所有可用系统数据源列表
  const sourceSysOptions = useMemo(() => {
    const set = new Set<string>()
    dataList.forEach((d) => {
      const src = cleanSource(d.source)
      if (src) set.add(src)
    })
    return Array.from(set).sort()
  }, [dataList])

  // 所有可用业务分类列表
  const categoryOptions = useMemo(() => {
    const set = new Set<string>()
    dataList.forEach((d) => {
      if (d.category) set.add(d.category)
    })
    return Array.from(set).sort()
  }, [dataList])

  // 数据过滤计算
  const filteredList = useMemo(() => {
    return dataList.filter((item) => {
      const itemSrc = cleanSource(item.source)

      // 1. 来源系统筛选
      if (filterSourceSys !== 'ALL' && itemSrc !== filterSourceSys) return false

      // 2. 业务分类筛选
      if (filterCategory !== 'ALL' && item.category !== filterCategory) return false

      // 3. 搜索框匹配（支持代码、名称、数据来源、集成方式、单位、说明）
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        const matchCode = item.code.toLowerCase().includes(q)
        const matchName = item.name.toLowerCase().includes(q)
        const matchSource = itemSrc.toLowerCase().includes(q)
        const matchChannel = item.sourceChannel.toLowerCase().includes(q)
        const matchUnit = item.unit.toLowerCase().includes(q)
        const matchDesc = item.desc.toLowerCase().includes(q)
        if (!matchCode && !matchName && !matchSource && !matchChannel && !matchUnit && !matchDesc) return false
      }

      return true
    })
  }, [dataList, filterSourceSys, filterCategory, searchQuery])

  // 当前分页数据
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1
  const displayedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredList.slice(start, start + pageSize)
  }, [filteredList, currentPage, pageSize])


  // 打开详情弹窗
  function handleOpenDetail(item: BasicDataItem) {
    setDetailItem({
      ...item,
      source: cleanSource(item.source),
      sourceSys: cleanSource(item.sourceSys),
    })
    setIsDetailOpen(true)
  }

  // 打开编辑弹窗
  function handleOpenEdit(item: BasicDataItem) {
    setEditingItem(item)
    setEditForm({
      ...item,
      source: cleanSource(item.source),
      sourceSys: cleanSource(item.sourceSys),
      freq: item.freq || '日更新',
    })
    setIsEditOpen(true)
  }

  // 提交编辑更新
  function handleSaveEdit() {
    if (!editingItem || !editForm.name) return
    const updated = dataList.map((item) =>
      item.id === editingItem.id
        ? ({
            ...item,
            ...editForm,
            source: cleanSource(editForm.source || item.source),
            sourceSys: cleanSource(editForm.source || item.sourceSys),
            freq: editForm.freq || item.freq,
            status: editForm.status || item.status,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          } as BasicDataItem)
        : item
    )
    persistData(updated)
    setIsEditOpen(false)
    showToast(`基础数据【${editForm.name}】(${editingItem.code}) 更新维护成功并已本地持久化！`)
  }

  // 删除单条基础数据项
  function handleDelete(item: BasicDataItem) {
    if (confirm(`确认删除基础数据项【${item.name}】(${item.code})？该操作不可撤销。`)) {
      const updated = dataList.filter((d) => d.id !== item.id)
      persistData(updated)
      if (editingRowId === item.id) {
        setEditingRowId(null)
      }
      if (batchDraft[item.id]) {
        setBatchDraft((prev) => {
          const copy = { ...prev }
          delete copy[item.id]
          return copy
        })
      }
      showToast(`已删除基础数据项【${item.name}】(${item.code})`)
    }
  }

  // 提交新增数据项
  function handleSaveAdd() {
    if (!addForm.name || !addForm.code) {
      alert('请填写参数代码与数据项名称！')
      return
    }
    const cleanSrc = cleanSource(addForm.source || '项目公司本地EMS')
    const newItem: BasicDataItem = {
      id: `BD-${Date.now().toString().slice(-4)}`,
      code: addForm.code.trim().toUpperCase(),
      name: addForm.name.trim(),
      category: addForm.category || '能源数据',
      unit: addForm.unit || '',
      valRange: addForm.valRange || '≥ 0',
      defaultVal: addForm.defaultVal || '0.00',
      source: cleanSrc,
      sourceChannel: addForm.sourceChannel || '数据对接',
      sourceSys: cleanSrc,
      sourcePlatform: '各项目公司',
      method: addForm.method || '系统对接',
      freq: addForm.freq || '日更新',
      granularity: addForm.granularity || '工厂级',
      duty: addForm.duty || '各项目公司',
      desc: addForm.desc || '',
      notes: addForm.notes || '',
      route: '',
      page: '',
      status: (addForm.status as 'active' | 'disabled') || 'active',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    }
    persistData([newItem, ...dataList])
    setIsAddOpen(false)
    showToast(`新增基础数据项【${newItem.name}】(${newItem.code}) 成功纳管并已本地持久化！`)
  }

  // 导出 CSV 功能
  function handleExportCsv() {
    const headers = ['序号', '参数代码', '数据项名称', '业务分类', '计量单位', '默认值', '数据来源', '集成方式', '采集频率', '采集颗粒度', '责任主体', '业务描述']
    const rows = filteredList.map((item, idx) => [
      String(idx + 1),
      item.code,
      item.name,
      item.category,
      item.unit,
      item.defaultVal,
      cleanSource(item.source),
      item.sourceChannel,
      item.freq,
      item.granularity,
      item.duty,
      `"${(item.desc || '').replace(/"/g, '""')}"`,
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `特变电工基础数据字典_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(`成功导出 ${filteredList.length} 条基础数据台账 (CSV)`)
  }

  // 渠道徽章色彩映射
  function getChannelBadge(channel: string) {
    switch (channel) {
      case '系统自动采集':
        return 'bg-blue-50 text-[#2C7CFF] border-blue-200'
      case '数据对接':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case '集控平台人工填报':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case '平台引擎计算':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* 顶部操作提示 Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[200] flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 模块主头部卡片 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-[#DBE6EE] bg-white px-5 py-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#2C7CFF]/10 text-[#2C7CFF]">
            <Database className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-slate-800">基础数据管理</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                共 {dataList.length} 项参数
              </span>
            </div>
          </div>
        </div>

        {/* 右侧动作按钮组 */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!isBatchEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2C7CFF] px-3.5 text-xs font-medium text-white hover:bg-[#1f6be8] transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>新增基础数据项</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingRowId(null)
                  setIsBatchEditing(true)
                  setBatchDraft({})
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#2C7CFF] bg-blue-50/40 hover:bg-blue-50 text-[#2C7CFF] px-3.5 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                title="开启表格批量编辑模式，可直接在表格各单元格修改数据"
              >
                <Sliders className="size-3.5" />
                <span>进入批量编辑</span>
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                className="w-[80px] h-9 rounded-lg bg-[#2C7CFF] hover:bg-[#1f6be8] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                title="导出当前筛选基础数据台账 (CSV/Excel)"
              >
                <Download className="size-3.5" />
                <span>导出</span>
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="h-9 px-3 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                title="重置全量数据为系统出厂初始字典（310项）"
              >
                <RotateCcw className="size-3" />
                <span>重置默认</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                <span>已修改</span>
                <strong className="font-mono text-amber-700 font-bold">{modifiedBatchCount}</strong>
                <span>项</span>
              </div>
              <button
                type="button"
                onClick={handleSaveBatch}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-4 text-xs font-bold transition-colors shadow-xs cursor-pointer"
                title="保存所有修改至本地并更新全系统数据"
              >
                <Check className="size-3.5" />
                <span>保存全部修改</span>
              </button>
              <button
                type="button"
                onClick={handleCancelBatch}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 px-3.5 text-xs font-medium transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
                <span>取消编辑</span>
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="h-9 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                title="放弃所有修改并重置为系统出厂预设字典"
              >
                <RotateCcw className="size-3" />
                <span>恢复出厂字典</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 批量编辑模式提示横幅 */}
      {isBatchEditing && (
        <div className="flex items-center justify-between bg-blue-50/90 border border-blue-200 rounded-lg px-4 py-2.5 text-xs text-blue-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#2C7CFF] animate-pulse" />
            <span className="font-bold">表格批量编辑模式已激活：</span>
            <span>可直接在下方单元格内修改【数据项名称】、【业务分类】、【计量单位】、【默认值】、【数据来源】、【集成方式】及【采集频率】，修改后点击右上角「保存全部修改」生效。</span>
          </div>
          <span className="font-mono text-[11px] text-blue-700 font-semibold shrink-0">
            已编辑 {modifiedBatchCount} / {displayedRows.length} 项
          </span>
        </div>
      )}

      {/* 多维筛选栏 (标准规格：36px高度、8px圆角，带标题标签) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 rounded-lg border border-[#DBE6EE] bg-white p-3.5 shadow-xs">
        {/* 1. 数据来源系统 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">数据来源系统</label>
          <select
            value={filterSourceSys}
            onChange={(e) => {
              setFilterSourceSys(e.target.value)
              setCurrentPage(1)
            }}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF] cursor-pointer"
          >
            <option value="ALL">全部数据来源系统 (全量系统)</option>
            {sourceSysOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* 2. 业务数据分类 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">业务数据分类</label>
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF] cursor-pointer"
          >
            <option value="ALL">全部业务数据分类</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* 3. 关键字搜索 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">数据项名称 / 代码搜索</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="搜索数据项名称、代码 (EN-001 等)、数据来源、计量单位..."
              className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            />
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 44px 工业高密数据大表 */}
      <div className="rounded-lg border border-[#DBE6EE] dark:border-border bg-white dark:bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] table-fixed text-left border-collapse font-sans text-xs">
            <thead className="border-b border-[#DBE6EE] dark:border-border bg-slate-50/80 dark:bg-panel text-slate-600 dark:text-muted-foreground font-semibold h-[44px] select-none">
              <tr>
                <th className="px-3 py-2 w-[4%] text-center font-mono whitespace-nowrap">#</th>
                <th className="px-3 py-2 w-[7%] whitespace-nowrap">代码</th>
                <th className="px-3 py-2 w-[20%] whitespace-nowrap">数据项名称</th>
                <th className="px-3 py-2 w-[10%] whitespace-nowrap">业务分类</th>
                <th className="px-3 py-2 w-[7%] text-center whitespace-nowrap">计量单位</th>
                <th className="px-3 py-2 w-[7%] text-center font-mono whitespace-nowrap">默认值</th>
                <th className="px-3 py-2 w-[18%] whitespace-nowrap">数据来源</th>
                <th className="px-3 py-2 w-[11%] text-center whitespace-nowrap">集成方式</th>
                <th className="px-3 py-2 w-[8%] text-center whitespace-nowrap">采集频率</th>
                <th className="px-3 py-2 w-[8%] text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DBE6EE]/60 dark:divide-border/60 text-slate-700 dark:text-foreground">
              {displayedRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-muted-foreground">
                    未查找到匹配的基础数据项！
                  </td>
                </tr>
              ) : (
                displayedRows.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1
                  const isEditingThisRow = editingRowId === item.id
                  const isBatchRow = isBatchEditing

                  // 批量编辑模式下的 Draft 状态
                  const draft = isBatchRow ? (batchDraft[item.id] || {}) : {}
                  const isModifiedInBatch = isBatchRow && Object.keys(draft).length > 0

                  const currentName = isEditingThisRow ? (rowDraft.name ?? item.name) : isBatchRow ? (draft.name ?? item.name) : item.name
                  const currentCategory = isEditingThisRow ? (rowDraft.category ?? item.category) : isBatchRow ? (draft.category ?? item.category) : item.category
                  const currentUnit = isEditingThisRow ? (rowDraft.unit ?? item.unit) : isBatchRow ? (draft.unit ?? item.unit) : item.unit
                  const currentDefaultVal = isEditingThisRow ? (rowDraft.defaultVal ?? item.defaultVal) : isBatchRow ? (draft.defaultVal ?? item.defaultVal) : (item.defaultVal || '0.00')
                  const currentSource = isEditingThisRow ? (rowDraft.source ?? cleanSource(item.source)) : isBatchRow ? (draft.source ?? cleanSource(item.source)) : cleanSource(item.source)
                  const currentChannel = isEditingThisRow ? (rowDraft.sourceChannel ?? item.sourceChannel) : isBatchRow ? (draft.sourceChannel ?? item.sourceChannel) : item.sourceChannel
                  const currentFreq = isEditingThisRow ? (rowDraft.freq ?? item.freq) : isBatchRow ? (draft.freq ?? item.freq) : item.freq

                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        'h-[44px] transition-colors group',
                        isEditingThisRow
                          ? 'bg-blue-50/60 border-l-2 border-l-[#2C7CFF]'
                          : isModifiedInBatch
                          ? 'bg-amber-50/40 border-l-2 border-l-amber-500'
                          : isBatchRow
                          ? 'hover:bg-blue-50/20'
                          : 'hover:bg-blue-50/30 dark:hover:bg-primary/10'
                      )}
                    >
                      {/* 1. 序号 */}
                      <td className="px-3 py-1 text-center font-mono text-slate-400 dark:text-muted-foreground whitespace-nowrap text-[11px]">
                        {String(globalIdx).padStart(2, '0')}
                      </td>

                      {/* 2. 代码 (主键不可改) */}
                      <td className="px-3 py-1 font-mono font-bold text-[#2C7CFF] dark:text-primary whitespace-nowrap text-[11px]">
                        {item.code}
                      </td>

                      {/* 3. 数据项名称 */}
                      <td className="px-3 py-1 overflow-hidden">
                        {isEditingThisRow ? (
                          <input
                            type="text"
                            value={currentName}
                            onChange={(e) => setRowDraft((prev) => ({ ...prev, name: e.target.value }))}
                            className="h-7 w-full rounded border border-[#2C7CFF] bg-white px-2 text-xs font-semibold text-slate-800 outline-none shadow-2xs"
                            placeholder="输入数据项名称"
                          />
                        ) : isBatchRow ? (
                          <input
                            type="text"
                            value={currentName}
                            onChange={(e) => updateBatchField(item.id, 'name', e.target.value)}
                            className={cn(
                              'h-7 w-full rounded border bg-white px-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#2C7CFF]',
                              draft.name !== undefined && draft.name !== item.name ? 'border-amber-400 bg-amber-50/20' : 'border-slate-300'
                            )}
                          />
                        ) : (
                          <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
                            <span
                              className="font-semibold text-slate-900 dark:text-foreground truncate hover:text-[#2C7CFF] dark:hover:text-primary cursor-pointer transition-colors"
                              title={`点击查看【${item.name}】完整业务属性`}
                              onClick={() => handleOpenDetail(item)}
                            >
                              {item.name}
                            </span>
                            {(() => {
                              const rel = getProductRelationsForBasicData(item.code)
                              if (!rel.isProductRelated) return null
                              return (
                                <span
                                  className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/30 shrink-0 font-medium cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenDetail(item)
                                  }}
                                  title={rel.relationDescription}
                                >
                                  {rel.coveredMajorNames.length > 3
                                    ? '覆盖全产业'
                                    : rel.coveredMajorNames.join('/')}
                                </span>
                              )
                            })()}
                          </div>
                        )}
                      </td>

                      {/* 4. 业务分类 */}
                      <td className="px-3 py-1 whitespace-nowrap">
                        {isEditingThisRow ? (
                          <select
                            value={currentCategory}
                            onChange={(e) => setRowDraft((prev) => ({ ...prev, category: e.target.value }))}
                            className="h-7 w-full rounded border border-slate-300 bg-white px-1.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF]"
                          >
                            {categoryOptions.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        ) : isBatchRow ? (
                          <select
                            value={currentCategory}
                            onChange={(e) => updateBatchField(item.id, 'category', e.target.value)}
                            className={cn(
                              'h-7 w-full rounded border bg-white px-1 text-xs text-slate-700 outline-none focus:border-[#2C7CFF]',
                              draft.category !== undefined && draft.category !== item.category ? 'border-amber-400 bg-amber-50/20' : 'border-slate-300'
                            )}
                          >
                            {categoryOptions.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] bg-blue-50 dark:bg-primary/10 text-[#2C7CFF] dark:text-primary border border-blue-200/50 dark:border-primary/20 font-medium">
                            {item.category}
                          </span>
                        )}
                      </td>

                      {/* 5. 计量单位 */}
                      <td className="px-3 py-1 text-center whitespace-nowrap">
                        {isEditingThisRow ? (
                          <input
                            type="text"
                            value={currentUnit}
                            onChange={(e) => setRowDraft((prev) => ({ ...prev, unit: e.target.value }))}
                            className="h-7 w-full rounded border border-slate-300 bg-white px-1 text-center font-mono text-xs text-slate-800 outline-none focus:border-[#2C7CFF]"
                            placeholder="单位"
                          />
                        ) : isBatchRow ? (
                          <input
                            type="text"
                            value={currentUnit}
                            onChange={(e) => updateBatchField(item.id, 'unit', e.target.value)}
                            className={cn(
                              'h-7 w-full rounded border bg-white px-1 text-center font-mono text-xs text-slate-800 outline-none focus:border-[#2C7CFF]',
                              draft.unit !== undefined && draft.unit !== item.unit ? 'border-amber-400 bg-amber-50/20' : 'border-slate-300'
                            )}
                            placeholder="单位"
                          />
                        ) : item.unit ? (
                          <span className="font-mono text-slate-700 dark:text-foreground bg-slate-100 dark:bg-secondary/40 rounded px-1.5 py-0.5 text-[11px]">
                            {item.unit}
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-muted-foreground/40">--</span>
                        )}
                      </td>

                      {/* 6. 默认值 */}
                      <td className="px-3 py-1 text-center font-mono whitespace-nowrap text-[11px]">
                        {isEditingThisRow ? (
                          <input
                            type="text"
                            value={currentDefaultVal}
                            onChange={(e) => setRowDraft((prev) => ({ ...prev, defaultVal: e.target.value }))}
                            className="h-7 w-full rounded border border-[#2C7CFF] bg-white px-1 text-center font-mono font-bold text-[#2C7CFF] text-xs outline-none focus:ring-1 focus:ring-[#2C7CFF]"
                            placeholder="0.00"
                          />
                        ) : isBatchRow ? (
                          <input
                            type="text"
                            value={currentDefaultVal}
                            onChange={(e) => updateBatchField(item.id, 'defaultVal', e.target.value)}
                            className={cn(
                              'h-7 w-full rounded border bg-white px-1 text-center font-mono font-bold text-[#2C7CFF] text-xs outline-none focus:border-[#2C7CFF]',
                              draft.defaultVal !== undefined && draft.defaultVal !== item.defaultVal ? 'border-amber-400 bg-amber-50/30' : 'border-slate-300'
                            )}
                            placeholder="0.00"
                          />
                        ) : (
                          <span className="text-slate-600 dark:text-muted-foreground">
                            {item.defaultVal || '0.00'}
                          </span>
                        )}
                      </td>

                      {/* 7. 数据来源 */}
                      <td className="px-3 py-1 text-slate-700 dark:text-foreground truncate" title={currentSource}>
                        {isEditingThisRow ? (
                          <input
                            type="text"
                            value={currentSource}
                            onChange={(e) => setRowDraft((prev) => ({ ...prev, source: e.target.value }))}
                            className="h-7 w-full rounded border border-slate-300 bg-white px-2 text-xs text-slate-800 outline-none focus:border-[#2C7CFF]"
                            placeholder="数据来源系统"
                          />
                        ) : isBatchRow ? (
                          <input
                            type="text"
                            value={currentSource}
                            onChange={(e) => updateBatchField(item.id, 'source', e.target.value)}
                            className={cn(
                              'h-7 w-full rounded border bg-white px-2 text-xs text-slate-800 outline-none focus:border-[#2C7CFF]',
                              draft.source !== undefined && draft.source !== cleanSource(item.source) ? 'border-amber-400 bg-amber-50/20' : 'border-slate-300'
                            )}
                            placeholder="数据来源系统"
                          />
                        ) : (
                          cleanSource(item.source)
                        )}
                      </td>

                      {/* 8. 集成方式 */}
                      <td className="px-3 py-1 text-center whitespace-nowrap">
                        {isEditingThisRow ? (
                          <select
                            value={currentChannel}
                            onChange={(e) => setRowDraft((prev) => ({ ...prev, sourceChannel: e.target.value }))}
                            className="h-7 w-full rounded border border-slate-300 bg-white px-1 text-xs text-slate-700 outline-none focus:border-[#2C7CFF]"
                          >
                            {STANDARD_CHANNELS.map((ch) => (
                              <option key={ch} value={ch}>
                                {ch}
                              </option>
                            ))}
                          </select>
                        ) : isBatchRow ? (
                          <select
                            value={currentChannel}
                            onChange={(e) => updateBatchField(item.id, 'sourceChannel', e.target.value)}
                            className={cn(
                              'h-7 w-full rounded border bg-white px-1 text-xs text-slate-700 outline-none focus:border-[#2C7CFF]',
                              draft.sourceChannel !== undefined && draft.sourceChannel !== item.sourceChannel ? 'border-amber-400 bg-amber-50/20' : 'border-slate-300'
                            )}
                          >
                            {STANDARD_CHANNELS.map((ch) => (
                              <option key={ch} value={ch}>
                                {ch}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={cn(
                              'px-2.5 py-0.5 rounded text-[11px] font-medium border inline-block whitespace-nowrap',
                              getChannelBadge(item.sourceChannel)
                            )}
                          >
                            {item.sourceChannel}
                          </span>
                        )}
                      </td>

                      {/* 9. 采集频率 */}
                      <td className="px-3 py-1 text-center text-slate-600 dark:text-muted-foreground whitespace-nowrap font-medium text-[11px]" title={currentFreq}>
                        {isEditingThisRow ? (
                          <select
                            value={currentFreq}
                            onChange={(e) => setRowDraft((prev) => ({ ...prev, freq: e.target.value }))}
                            className="h-7 w-full rounded border border-slate-300 bg-white px-1 text-xs text-slate-700 outline-none focus:border-[#2C7CFF]"
                          >
                            {STANDARD_FREQS.map((fr) => (
                              <option key={fr} value={fr}>
                                {fr}
                              </option>
                            ))}
                          </select>
                        ) : isBatchRow ? (
                          <select
                            value={currentFreq}
                            onChange={(e) => updateBatchField(item.id, 'freq', e.target.value)}
                            className={cn(
                              'h-7 w-full rounded border bg-white px-1 text-xs text-slate-700 outline-none focus:border-[#2C7CFF]',
                              draft.freq !== undefined && draft.freq !== item.freq ? 'border-amber-400 bg-amber-50/20' : 'border-slate-300'
                            )}
                          >
                            {STANDARD_FREQS.map((fr) => (
                              <option key={fr} value={fr}>
                                {fr}
                              </option>
                            ))}
                          </select>
                        ) : (
                          item.freq
                        )}
                      </td>

                      {/* 10. 操作 (编辑 / 删除) */}
                      <td className="px-3 py-1 text-center whitespace-nowrap">
                        {isEditingThisRow ? (
                          <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleSaveRowInline(item)}
                              className="inline-flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer text-xs"
                              title="保存该行修改"
                            >
                              <Check className="size-3.5" />
                              <span>保存</span>
                            </button>
                            <span className="text-slate-200">|</span>
                            <button
                              type="button"
                              onClick={handleCancelRowInline}
                              className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                            >
                              取消
                            </button>
                          </div>
                        ) : isBatchRow ? (
                          <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                            {isModifiedInBatch && (
                              <button
                                type="button"
                                onClick={() => {
                                  setBatchDraft((prev) => {
                                    const copy = { ...prev }
                                    delete copy[item.id]
                                    return copy
                                  })
                                }}
                                className="text-slate-400 hover:text-slate-600 text-[11px] cursor-pointer"
                                title="还原此行修改"
                              >
                                还原
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="text-rose-500 hover:text-rose-700 text-xs cursor-pointer"
                              title="删除此行数据"
                            >
                              删除
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartRowEdit(item)}
                              className="inline-flex items-center gap-1 text-slate-600 dark:text-muted-foreground hover:text-[#2C7CFF] dark:hover:text-primary font-medium cursor-pointer transition-colors"
                              title="就地快速编辑此项数据"
                            >
                              <Edit2 className="size-3" />
                              <span>编辑</span>
                            </button>
                            <span className="text-slate-200 dark:text-border">|</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="inline-flex items-center gap-1 text-slate-600 dark:text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 font-medium cursor-pointer transition-colors"
                              title="删除基础数据项"
                            >
                              <Trash2 className="size-3" />
                              <span>删除</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页控制栏 (底栏) */}
        <div className="flex flex-wrap items-center justify-between border-t border-[#DBE6EE] dark:border-border px-4 py-2.5 text-xs text-slate-500 dark:text-muted-foreground bg-slate-50/50 dark:bg-panel font-sans">
          <div>
            共 <span className="font-bold text-slate-800 dark:text-foreground font-mono">{filteredList.length}</span> 条基础数据，每页 {pageSize} 条
          </div>

          <div className="flex items-center gap-1 font-mono">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-border bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              上一页
            </button>
            <span className="px-2 text-slate-700 dark:text-foreground font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-border bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* 详情查看 Modal */}
      <Modal
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="基础数据项详情与口径说明"
        size="lg"
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsDetailOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              关闭
            </button>
          </div>
        }
      >
        {detailItem && (
          <div className="space-y-4 text-xs font-sans">
            {/* 顶栏概览 */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 font-mono">参数代码</span>
                <div className="text-base font-bold font-mono text-[#2C7CFF]">{detailItem.code}</div>
              </div>
              <div>
                <span className="text-slate-400">数据项名称</span>
                <div className="text-sm font-bold text-slate-800">{detailItem.name}</div>
              </div>
              <div>
                <span className="text-slate-400">业务分类</span>
                <div className="text-xs font-semibold text-slate-700">{detailItem.category}</div>
              </div>
              <div>
                <span className="text-slate-400">计量单位</span>
                <div className="text-xs font-bold font-mono text-emerald-600">{detailItem.unit || '—'}</div>
              </div>
            </div>

            {/* 结构化元数据网格 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium">数据来源渠道</span>
                <div className="font-semibold text-slate-800">{detailItem.sourceChannel}</div>
              </div>
              <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium">数据来源系统</span>
                <div className="font-semibold text-slate-800">{cleanSource(detailItem.source)}</div>
              </div>
              <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium">集成接口方式</span>
                <div className="font-semibold text-slate-800">{detailItem.method || '专线/API接口对接'}</div>
              </div>
              <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium">采集频率</span>
                <div className="font-semibold text-slate-800">{detailItem.freq}</div>
              </div>
              <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium">采集颗粒度</span>
                <div className="font-semibold text-slate-800">{detailItem.granularity}</div>
              </div>
              <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-medium">责任主体</span>
                <div className="font-semibold text-slate-800">{detailItem.duty}</div>
              </div>
            </div>

            {/* 业务定义与描述 */}
            <div className="space-y-1 bg-blue-50/30 p-3.5 rounded-lg border border-blue-100">
              <span className="text-[#2C7CFF] font-bold">业务定义与核算口径说明</span>
              <p className="text-slate-700 leading-relaxed mt-1">
                {detailItem.desc || detailItem.notes || '暂无额外业务口径说明'}
              </p>
            </div>

            {/* 关联产品类型与生产型号映射 (主数据协同互联) */}
            {(() => {
              const rel = getProductRelationsForBasicData(detailItem.code)
              return (
                <div className="space-y-2.5 rounded-lg border border-indigo-100 bg-indigo-50/30 p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Cpu className="size-4 text-indigo-600" />
                      <span>关联产品类型与生产型号映射</span>
                    </div>
                    {rel.isProductRelated ? (
                      <span className="rounded bg-indigo-100/80 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                        产品强关联核算项
                      </span>
                    ) : (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                        公辅/全域综合指标
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rel.relationDescription}
                  </p>

                  {rel.isProductRelated && (
                    <>
                      <div className="space-y-1 text-xs">
                        <div className="text-slate-500 font-medium">覆盖 1 级产品大类：</div>
                        <div className="flex flex-wrap gap-1.5">
                          {rel.coveredMajorNames.map((maj) => (
                            <span
                              key={maj}
                              className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200"
                            >
                              <FolderTree className="size-3 text-slate-400" />
                              {maj}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="text-slate-500 font-medium">代表性在产型号示例：</div>
                        <div className="flex flex-wrap gap-1.5">
                          {rel.sampleModels.map((sm) => (
                            <span
                              key={sm}
                              className="font-mono rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-200"
                            >
                              {sm}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-indigo-100/80">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDetailOpen(false)
                            onNavigate?.('product-type')
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C7CFF] hover:underline cursor-pointer"
                        >
                          <FolderTree className="size-3.5" />
                          <span>前往产品类型管理查看标准定义</span>
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDetailOpen(false)
                            onNavigate?.('product-model')
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                        >
                          <Cpu className="size-3.5" />
                          <span>前往产品型号管理查看生产映射</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </Modal>

      {/* 编辑更新 Modal */}
      <Modal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`更新维护基础数据项 (${editingItem?.code})`}
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white transition-colors cursor-pointer"
            >
              保存更新
            </button>
          </div>
        }
      >
        {editingItem && (
          <div className="space-y-3.5 text-xs font-sans">
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-600 font-medium mb-1">数据项名称 *</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">业务分类 *</label>
                <select
                  value={editForm.category || '能源数据'}
                  onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF] bg-white cursor-pointer"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">计量单位</label>
                <input
                  type="text"
                  value={editForm.unit || ''}
                  onChange={(e) => setEditForm((p) => ({ ...p, unit: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">默认值</label>
                <input
                  type="text"
                  value={editForm.defaultVal || ''}
                  onChange={(e) => setEditForm((p) => ({ ...p, defaultVal: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">来源渠道</label>
                <select
                  value={editForm.sourceChannel || '数据对接'}
                  onChange={(e) => setEditForm((p) => ({ ...p, sourceChannel: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF] bg-white cursor-pointer"
                >
                  <option value="系统自动采集">系统自动采集</option>
                  <option value="数据对接">数据对接</option>
                  <option value="集控平台人工填报">集控平台人工填报</option>
                  <option value="平台引擎计算">平台引擎计算</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">采集频率设置 *</label>
                <select
                  value={editForm.freq || '日更新'}
                  onChange={(e) => setEditForm((p) => ({ ...p, freq: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF] bg-white cursor-pointer font-medium"
                >
                  <option value="实时采集">实时采集</option>
                  <option value="日更新">日更新</option>
                  <option value="月更新">月更新</option>
                  <option value="静态数据">静态数据</option>
                  {editForm.freq &&
                    !['实时采集', '日更新', '月更新', '静态数据'].includes(editForm.freq) && (
                      <option value={editForm.freq}>{editForm.freq}</option>
                    )}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-slate-600 font-medium mb-1">数据来源系统</label>
                <input
                  type="text"
                  value={editForm.source || ''}
                  onChange={(e) => setEditForm((p) => ({ ...p, source: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">业务定义与核算口径说明</label>
              <textarea
                rows={3}
                value={editForm.desc || ''}
                onChange={(e) => setEditForm((p) => ({ ...p, desc: e.target.value }))}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 新增基础数据项 Modal */}
      <Modal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="新增基础数据项"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveAdd}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white transition-colors cursor-pointer"
            >
              确认新增
            </button>
          </div>
        }
      >
        <div className="space-y-3.5 text-xs font-sans">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-600 font-medium mb-1">参数代码 * (如 EN-999)</label>
              <input
                type="text"
                placeholder="例如: EN-030"
                value={addForm.code || ''}
                onChange={(e) => setAddForm((p) => ({ ...p, code: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">数据项名称 *</label>
              <input
                type="text"
                placeholder="例如: 柴油发电机消耗量"
                value={addForm.name || ''}
                onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">业务分类 *</label>
              <select
                value={addForm.category || '能源数据'}
                onChange={(e) => setAddForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF] bg-white cursor-pointer"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">计量单位</label>
              <input
                type="text"
                placeholder="例如: L 或 kg"
                value={addForm.unit || ''}
                onChange={(e) => setAddForm((p) => ({ ...p, unit: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">默认值</label>
              <input
                type="text"
                value={addForm.defaultVal || '0.00'}
                onChange={(e) => setAddForm((p) => ({ ...p, defaultVal: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">指标来源渠道</label>
              <select
                value={addForm.sourceChannel || '数据对接'}
                onChange={(e) => setAddForm((p) => ({ ...p, sourceChannel: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF] bg-white cursor-pointer"
              >
                <option value="系统自动采集">系统自动采集</option>
                <option value="数据对接">数据对接</option>
                <option value="集控平台人工填报">集控平台人工填报</option>
                <option value="平台引擎计算">平台引擎计算</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">数据来源系统</label>
              <input
                type="text"
                placeholder="例如: 项目公司本地EMS"
                value={addForm.source || ''}
                onChange={(e) => setAddForm((p) => ({ ...p, source: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">采集频率设置 *</label>
              <select
                value={addForm.freq || '日更新'}
                onChange={(e) => setAddForm((p) => ({ ...p, freq: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF] bg-white cursor-pointer font-medium"
              >
                <option value="实时采集">实时采集</option>
                <option value="日更新">日更新</option>
                <option value="月更新">月更新</option>
                <option value="静态数据">静态数据</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">业务定义与核算口径说明</label>
            <textarea
              rows={3}
              placeholder="请输入本基础数据项的统计范围、核算依据或接入说明..."
              value={addForm.desc || ''}
              onChange={(e) => setAddForm((p) => ({ ...p, desc: e.target.value }))}
              className="w-full p-2.5 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

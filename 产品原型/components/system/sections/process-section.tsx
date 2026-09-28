'use client'

import React, { useState, useMemo } from 'react'
import {
  Workflow,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Layers,
  Zap,
  Flame,
  Factory,
  Building2,
  Package,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  LayoutGrid,
  List,
} from 'lucide-react'
import { Modal } from '@/components/shared/modal'
import { ExportButton } from '@/components/shared/primitives'
import {
  type ProcessMasterItem,
  type ProcessFactoryMapping,
  type MasterFactoryItem,
  type MasterProductItem,
  INITIAL_PROCESS_MASTER_ITEMS,
  PROCESS_CATEGORIES,
  PROCESS_ENERGY_OPTIONS,
  PROCESS_COMPANIES,
  PROCESS_FACTORIES,
  PROCESS_PRODUCT_MODELS,
  PROCESS_MAJOR_CATEGORIES,
  ALL_MASTER_FACTORIES,
  ALL_MASTER_PRODUCTS,
} from '@/lib/process-management-data'
import { cn } from '@/lib/utils'

export interface ProcessSectionProps {
  onNavigate?: (module: 'basic-data' | 'product-type' | 'product-model' | 'process', params?: Record<string, string>) => void
  initialParams?: Record<string, string>
}

/**
 * 单元格文本截断：默认最多展示 15 个字，超出则截断并补省略号
 */
function formatCellText(text: string, maxChars = 15): string {
  if (!text) return ''
  if (text.length <= maxChars) return text
  return `${text.slice(0, maxChars)}...`
}

export function ProcessSection({ onNavigate, initialParams }: ProcessSectionProps) {
  // 工序主数据集状态
  const [processes, setProcesses] = useState<ProcessMasterItem[]>(INITIAL_PROCESS_MASTER_ITEMS)

  // 筛选维度 (5 大查询条件：工序分类、能源类型、关联企业、产品型号、关键词搜索)
  const [filterCategory, setFilterCategory] = useState<string>(initialParams?.category || 'all')
  const [filterEnergy, setFilterEnergy] = useState<string>('all')
  const [filterFactory, setFilterFactory] = useState<string>(initialParams?.factory || 'all')
  const [filterProduct, setFilterProduct] = useState<string>(initialParams?.product || 'all')
  const [filterSearch, setFilterSearch] = useState<string>(initialParams?.search || '')

  // 关联工厂与关联产品中类勾选弹窗状态 (展示所有工厂与中类供管理员勾选关联)
  const [detailProcess, setDetailProcess] = useState<ProcessMasterItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailModalTab, setDetailModalTab] = useState<'factory' | 'product'>('factory')
  const [selectedFactories, setSelectedFactories] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [factorySearchQuery, setFactorySearchQuery] = useState('')
  const [productSearchQuery, setProductSearchQuery] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all')
  const [productViewMode, setProductViewMode] = useState<'card' | 'table'>('card')

  // 新增 / 编辑工序弹窗状态
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProcess, setEditingProcess] = useState<ProcessMasterItem | null>(null)

  // 表单状态
  const [formCode, setFormCode] = useState('')
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState<'transformer' | 'core' | 'cable' | 'other'>('transformer')
  const [formEnergyTypes, setFormEnergyTypes] = useState<string[]>(['电力'])
  const [formUnit, setFormUnit] = useState('kVA')
  const [formDescription, setFormDescription] = useState('')

  // 为工序配置新关联工厂弹窗状态
  const [isLinkFactoryModalOpen, setIsLinkFactoryModalOpen] = useState(false)
  const [linkFactoryProcess, setLinkFactoryProcess] = useState<ProcessMasterItem | null>(null)
  const [linkCompany, setLinkCompany] = useState<string>('沈变公司')
  const [linkFactory, setLinkFactory] = useState<string>('沈变本部')
  const [linkPark, setLinkPark] = useState<string>('特变电工东北输变电产业园')
  const [linkProduct, setLinkProduct] = useState<string>('特高压')
  const [linkUnit, setLinkUnit] = useState<string>('kVA')
  const [linkOrigin, setLinkOrigin] = useState<string>('产品产量由订单汇总')
  const [linkRemark, setLinkRemark] = useState<string>('')

  // 打开新增工序弹窗
  function handleOpenCreateModal() {
    setEditingProcess(null)
    const nextSeq = processes.length + 1
    setFormCode(`PROC-CUSTOM-${nextSeq < 10 ? '0' + nextSeq : nextSeq}`)
    setFormName('')
    setFormCategory('transformer')
    setFormEnergyTypes(['电力'])
    setFormUnit('kVA')
    setFormDescription('')
    setIsEditModalOpen(true)
  }

  // 打开编辑工序弹窗
  function handleOpenEditModal(item: ProcessMasterItem) {
    setEditingProcess(item)
    setFormCode(item.code)
    setFormName(item.name)
    setFormCategory(item.category)
    setFormEnergyTypes([...item.energyTypes])
    setFormUnit(item.unit)
    setFormDescription(item.description || '')
    setIsEditModalOpen(true)
  }

  // 提交工序保存
  function handleSaveProcess(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) {
      alert('请输入生产工序名称！')
      return
    }

    const catLabels: Record<string, string> = {
      transformer: '变压器制造',
      core: '铁心制造',
      cable: '线缆制造',
      other: '其他制造',
    }

    if (editingProcess) {
      // 更新现有工序 (保留原有已关联工厂与产品数据)
      setProcesses((prev) =>
        prev.map((item) => {
          if (item.id === editingProcess.id) {
            return {
              ...item,
              code: formCode,
              name: formName,
              category: formCategory,
              categoryLabel: catLabels[formCategory] || '其他制造',
              energyTypes: formEnergyTypes,
              unit: formUnit,
              description: formDescription,
              updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          }
          return item
        }),
      )
    } else {
      // 新建工序 (工厂与产品在建档后通过“关联工厂/关联产品”弹窗专门绑定)
      const newItem: ProcessMasterItem = {
        id: `proc_${Date.now()}`,
        code: formCode,
        name: formName,
        category: formCategory,
        categoryLabel: catLabels[formCategory] || '其他制造',
        description: formDescription,
        energyTypes: formEnergyTypes,
        unit: formUnit,
        factoryCount: 0,
        linkedFactories: [],
        productModelCount: 0,
        linkedProductModels: [],
        factories: [],
        status: 'enabled',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        operator: '系统管理员',
      }
      setProcesses((prev) => [newItem, ...prev])
    }
    setIsEditModalOpen(false)
  }

  // 删除工序
  function handleDeleteProcess(id: string) {
    if (confirm('确认删除该生产工序及其全部工厂映射关系吗？')) {
      setProcesses((prev) => prev.filter((p) => p.id !== id))
      if (detailProcess && detailProcess.id === id) {
        setIsDetailModalOpen(false)
      }
    }
  }

  // 打开工序关联工厂/关联产品中类勾选弹窗 (支持直达工厂或产品勾选视角)
  function handleOpenDetailModal(item: ProcessMasterItem, tab: 'factory' | 'product' = 'factory') {
    setDetailProcess(item)
    setDetailModalTab(tab)
    setSelectedFactories([...item.linkedFactories])
    setSelectedProducts([...item.linkedProductModels])
    setFactorySearchQuery('')
    setProductSearchQuery('')
    setProductCategoryFilter('all')
    setProductViewMode('card')
    setIsDetailModalOpen(true)
  }

  // 弹窗内搜索过滤后的工厂列表
  const filteredMasterFactories = useMemo(() => {
    if (!factorySearchQuery.trim()) return ALL_MASTER_FACTORIES
    const q = factorySearchQuery.trim().toLowerCase()
    return ALL_MASTER_FACTORIES.filter(
      (f) =>
        f.factoryName.toLowerCase().includes(q) ||
        f.companyName.toLowerCase().includes(q) ||
        f.parkName.toLowerCase().includes(q),
    )
  }, [factorySearchQuery])

  // 弹窗内搜索过滤后的产品中类列表 (支持产量大类筛选、中类名称、编码搜索)
  const filteredMasterProducts = useMemo(() => {
    return ALL_MASTER_PRODUCTS.filter((p) => {
      // 产量大类筛选
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
        return false
      }
      // 关键字搜索
      if (productSearchQuery.trim()) {
        const q = productSearchQuery.trim().toLowerCase()
        const matchesName = p.modelName.toLowerCase().includes(q)
        const matchesCode = (p.code || '').toLowerCase().includes(q)
        const matchesCat = p.category.toLowerCase().includes(q)
        const matchesUnit = p.unit.toLowerCase().includes(q)
        if (!matchesName && !matchesCode && !matchesCat && !matchesUnit) return false
      }
      return true
    })
  }, [productSearchQuery, productCategoryFilter])

  // 保存管理员在弹窗中勾选的关联工厂与关联产品
  function handleSaveLinkedSelection() {
    if (!detailProcess) return

    setProcesses((prev) =>
      prev.map((item) => {
        if (item.id === detailProcess.id) {
          // 重塑 factories 映射明细
          const updatedFactories: ProcessFactoryMapping[] = selectedFactories.map((facName, idx) => {
            const existing = item.factories.find((f) => f.factoryName === facName)
            if (existing) return existing
            const meta = ALL_MASTER_FACTORIES.find((m) => m.factoryName === facName)
            return {
              id: `fac_map_${Date.now()}_${idx}`,
              companyName: meta?.companyName || '特变电工相关企业',
              factoryName: facName,
              parkName: meta?.parkName || '特变电工产业园',
              productModel: selectedProducts[0] || '标准产品',
              unit: item.unit.split(',')[0].trim() || 'kVA',
              dataOrigin: '产品产量由订单汇总',
              remark: '',
            }
          })

          return {
            ...item,
            linkedFactories: selectedFactories,
            factoryCount: selectedFactories.length,
            linkedProductModels: selectedProducts,
            productModelCount: selectedProducts.length,
            factories: updatedFactories,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          }
        }
        return item
      }),
    )

    setDetailProcess((prev) =>
      prev
        ? {
            ...prev,
            linkedFactories: selectedFactories,
            factoryCount: selectedFactories.length,
            linkedProductModels: selectedProducts,
            productModelCount: selectedProducts.length,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          }
        : null,
    )

    setIsDetailModalOpen(false)
  }

  // 打开关联新工厂弹窗
  function handleOpenLinkFactoryModal(processItem: ProcessMasterItem) {
    setLinkFactoryProcess(processItem)
    setLinkCompany('沈变公司')
    setLinkFactory('沈变本部')
    setLinkPark('特变电工东北输变电产业园')
    setLinkProduct(processItem.linkedProductModels[0] || '特高压')
    setLinkUnit(processItem.unit.split(',')[0].trim() || 'kVA')
    setLinkOrigin('产品产量由订单汇总')
    setLinkRemark('')
    setIsLinkFactoryModalOpen(true)
  }

  // 提交工厂关联配置
  function handleSaveLinkFactory(e: React.FormEvent) {
    e.preventDefault()
    if (!linkFactoryProcess) return

    const newMapping: ProcessFactoryMapping = {
      id: `map_${Date.now()}`,
      companyName: linkCompany,
      factoryName: linkFactory,
      parkName: linkPark,
      productModel: linkProduct,
      unit: linkUnit,
      dataOrigin: linkOrigin,
      remark: linkRemark,
    }

    setProcesses((prev) =>
      prev.map((p) => {
        if (p.id === linkFactoryProcess.id) {
          const updatedFactories = [...p.factories, newMapping]
          const uniqueFacNames = Array.from(new Set(updatedFactories.map((f) => f.factoryName)))
          const uniqueProds = Array.from(new Set(updatedFactories.map((f) => f.productModel).filter(Boolean)))
          const updated = {
            ...p,
            factories: updatedFactories,
            linkedFactories: uniqueFacNames,
            factoryCount: uniqueFacNames.length,
            linkedProductModels: uniqueProds,
            productModelCount: uniqueProds.length,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          }
          if (detailProcess && detailProcess.id === p.id) {
            setDetailProcess(updated)
          }
          return updated
        }
        return p
      }),
    )

    setIsLinkFactoryModalOpen(false)
  }

  // 移除某工厂对该工序的映射
  function handleRemoveFactoryMapping(processId: string, mappingId: string) {
    if (confirm('确认解除该制造工厂与本工序的映射关联吗？')) {
      setProcesses((prev) =>
        prev.map((p) => {
          if (p.id === processId) {
            const updatedFactories = p.factories.filter((f) => f.id !== mappingId)
            const uniqueFacNames = Array.from(new Set(updatedFactories.map((f) => f.factoryName)))
            const uniqueProds = Array.from(new Set(updatedFactories.map((f) => f.productModel).filter(Boolean)))
            const updated = {
              ...p,
              factories: updatedFactories,
              linkedFactories: uniqueFacNames,
              factoryCount: uniqueFacNames.length,
              linkedProductModels: uniqueProds,
              productModelCount: uniqueProds.length,
            }
            if (detailProcess && detailProcess.id === p.id) {
              setDetailProcess(updated)
            }
            return updated
          }
          return p
        }),
      )
    }
  }

  // 导出 CSV 功能
  function handleExportCsv() {
    const headers = ['生产工序名称', '工序分类', '使用能源类型', '主要计量单位', '涉及工厂数量', '覆盖制造工厂', '覆盖产品中类', '工序描述']
    const rows = filteredProcesses.map((p) => [
      p.name,
      p.categoryLabel,
      p.energyTypes.join('、'),
      p.unit,
      p.factoryCount,
      `"${p.linkedFactories.join(', ')}"`,
      `"${p.linkedProductModels.join(', ')}"`,
      `"${p.description || ''}"`,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `特变电工_生产工序管理台账_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  // 多维联合筛选
  const filteredProcesses = useMemo(() => {
    return processes.filter((item) => {
      // 1. 分类筛选
      if (filterCategory !== 'all' && item.category !== filterCategory) return false

      // 2. 能源类型筛选
      if (filterEnergy === 'elec' && (item.energyTypes.includes('蒸汽') || !item.energyTypes.includes('电力'))) return false
      if (filterEnergy === 'elec_steam' && (!item.energyTypes.includes('电力') || !item.energyTypes.includes('蒸汽'))) return false

      // 3. 关联企业筛选
      if (filterFactory !== 'all') {
        const matchesFac = item.linkedFactories.some((fac) => fac.includes(filterFactory))
        if (!matchesFac) return false
      }

      // 4. 关联产品型号筛选
      if (filterProduct !== 'all') {
        const matchesProd = item.linkedProductModels.some((prod) => prod.includes(filterProduct))
        if (!matchesProd) return false
      }

      // 5. 关键词搜索
      if (filterSearch.trim()) {
        const kw = filterSearch.toLowerCase().trim()
        const inCode = item.code.toLowerCase().includes(kw)
        const inName = item.name.toLowerCase().includes(kw)
        const inFac = item.linkedFactories.some((f) => f.toLowerCase().includes(kw))
        const inProd = item.linkedProductModels.some((p) => p.toLowerCase().includes(kw))
        const inDesc = (item.description || '').toLowerCase().includes(kw)
        if (!inCode && !inName && !inFac && !inProd && !inDesc) return false
      }

      return true
    })
  }, [processes, filterCategory, filterEnergy, filterFactory, filterProduct, filterSearch])

  return (
    <div className="space-y-4 font-sans">
      {/* 1. 顶部 Header (标题 + 新增按钮 + 导出按钮) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2C7CFF] shrink-0">
            <Workflow className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              生产工序管理
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="h-9 px-4 rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer select-none"
          >
            <Plus className="size-4" />
            <span>新增生产工序</span>
          </button>
          <ExportButton onClick={handleExportCsv} />
        </div>
      </div>

      {/* 2. 多维联合查询过滤工具栏 (参考产品型号管理 5 列网格与顶部标签布局) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 rounded-lg border border-[#DBE6EE] bg-white p-3.5 shadow-xs">
        {/* 维度 1: 工序专业分类 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">工序分类</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
          >
            {PROCESS_CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* 维度 2: 使用能源类型 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">能源类型</label>
          <select
            value={filterEnergy}
            onChange={(e) => setFilterEnergy(e.target.value)}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
          >
            {PROCESS_ENERGY_OPTIONS.map((e) => (
              <option key={e.key} value={e.key}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {/* 维度 3: 关联制造企业 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">关联企业</label>
          <select
            value={filterFactory}
            onChange={(e) => setFilterFactory(e.target.value)}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
          >
            <option value="all">全部制造企业 ({PROCESS_FACTORIES.length} 家)</option>
            {PROCESS_FACTORIES.map((fac) => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </select>
        </div>

        {/* 维度 4: 关联产品中类 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">产品中类</label>
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
          >
            <option value="all">全部产品中类 ({PROCESS_PRODUCT_MODELS.length} 类)</option>
            {PROCESS_PRODUCT_MODELS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* 维度 5: 工序搜索 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">工序搜索</label>
          <div className="relative">
            <input
              type="text"
              placeholder="搜索工序名称、关联工厂或产品..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            />
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
            {filterSearch && (
              <button
                type="button"
                onClick={() => setFilterSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. 44px 工业高密工序主导数据表格 (以工序为主导实体，宽度自适应) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold h-[44px]">
                <th className="w-[4%] min-w-[40px] py-2.5 px-3 text-center font-mono whitespace-nowrap">#</th>
                <th className="w-[20%] min-w-[180px] py-2.5 px-3 whitespace-nowrap">生产工序名称</th>
                <th className="w-[12%] min-w-[120px] py-2.5 px-3 whitespace-nowrap">使用能源类型</th>
                <th className="w-[26%] min-w-[220px] py-2.5 px-3 whitespace-nowrap">关联工厂</th>
                <th className="w-[22%] min-w-[200px] py-2.5 px-3 whitespace-nowrap">关联产品中类</th>
                <th className="w-[7%] min-w-[80px] py-2.5 px-3 text-center whitespace-nowrap">计量单位</th>
                <th className="w-[9%] min-w-[90px] py-2.5 px-3 text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProcesses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-sans">
                    暂无符合条件的生产工序数据！
                  </td>
                </tr>
              ) : (
                filteredProcesses.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-50/30 transition-colors h-[44px] group"
                  >
                    {/* 序号 */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400 text-xs whitespace-nowrap">
                      {idx + 1}
                    </td>

                    {/* 工序名称 + 分类徽章 */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 truncate" title={p.name}>
                        <span className="font-bold text-slate-800 truncate">{p.name}</span>
                        <span
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0',
                            p.category === 'transformer'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : p.category === 'core'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                          )}
                        >
                          {p.categoryLabel}
                        </span>
                      </div>
                    </td>

                    {/* 使用能源类型 (8 大能源标准色) */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {p.energyTypes.map((e) => (
                          <span
                            key={e}
                            className={cn(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold shadow-2xs',
                              e === '电力'
                                ? 'bg-blue-50 text-[#2C7CFF] border border-blue-200'
                                : 'bg-amber-50 text-[#FFBA00] border border-amber-200',
                            )}
                          >
                            {e === '电力' ? <Zap className="size-3" /> : <Flame className="size-3" />}
                            <span>{e}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 关联工厂 (默认最多显示 15 个字，超出截断并补省略号，悬浮或点击查看全部) */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleOpenDetailModal(p, 'factory')}
                          className="shrink-0 px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#2C7CFF] hover:text-blue-700 border border-blue-200 text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                          title="点击以弹窗查看已关联工厂明细"
                        >
                          关联工厂 ({p.factoryCount})
                        </button>
                        {p.linkedFactories.length > 0 ? (
                          <span
                            className="truncate text-xs text-slate-600 font-sans"
                            title={p.linkedFactories.join('、')}
                          >
                            {formatCellText(p.linkedFactories.join('、'), 15)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">暂无关联工厂</span>
                        )}
                      </div>
                    </td>

                    {/* 关联产品中类 (默认最多显示 15 个字，超出截断并补省略号，悬浮或点击查看全部) */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleOpenDetailModal(p, 'product')}
                          className="shrink-0 px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#2C7CFF] hover:text-blue-700 border border-blue-200 text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                          title="点击以弹窗查看已关联产品中类"
                        >
                          关联产品中类 ({p.productModelCount})
                        </button>
                        {p.linkedProductModels.length > 0 ? (
                          <span
                            className="truncate text-xs text-slate-600 font-sans"
                            title={p.linkedProductModels.join('、')}
                          >
                            {formatCellText(p.linkedProductModels.join('、'), 15)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">暂无关联产品中类</span>
                        )}
                      </div>
                    </td>

                    {/* 计量单位 */}
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600 text-xs whitespace-nowrap">
                      {p.unit}
                    </td>

                    {/* 操作 (编辑 / 删除 - 彻底剥离查看关联) */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-[#2C7CFF] font-medium cursor-pointer transition-colors"
                          title="编辑工序"
                        >
                          <Edit2 className="size-3" />
                          <span>编辑</span>
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteProcess(p.id)}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-rose-600 font-medium cursor-pointer transition-colors"
                          title="删除工序"
                        >
                          <Trash2 className="size-3" />
                          <span>删除</span>
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
      {/* 4. 关联工厂与关联产品勾选配置弹窗 (LinkedFactoriesAndProductsModal) */}
      {/* 点开后显示所有制造工厂与产线名称，管理员进行勾选关联 */}
      {/* ========================================================================= */}
      {isDetailModalOpen && detailProcess && (
        <Modal
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`【${detailProcess.name}】${detailModalTab === 'factory' ? '关联制造工厂' : '关联产品中类'}`}
          size="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-sans">
                <span>当前工序已勾选：</span>
                {detailModalTab === 'factory' ? (
                  <span className="font-bold text-[#2C7CFF]">{selectedFactories.length} 家制造工厂</span>
                ) : (
                  <span className="font-bold text-[#2C7CFF]">{selectedProducts.length} 种产品中类</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="h-8 px-4 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveLinkedSelection}
                  className="h-8 px-4 rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  保存关联勾选
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-3 font-sans text-xs">
            {/* 制造工厂或产品型号独立勾选列表 */}
            {detailModalTab === 'factory' ? (
              <div className="space-y-2.5">
                {/* 搜索与批量操作栏 */}
                <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="relative flex-1 max-w-[280px]">
                    <Search className="size-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索工厂名称、所属企业或园区..."
                      value={factorySearchQuery}
                      onChange={(e) => setFactorySearchQuery(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 bg-white border border-[#E2E8F0] rounded-lg text-xs text-slate-700 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedFactories(ALL_MASTER_FACTORIES.map((f) => f.factoryName))}
                      className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      全选所有工厂
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFactories([])}
                      className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      清空已选
                    </button>
                  </div>
                </div>

                {/* 工厂勾选数据大表 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-h-[380px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                      <tr className="text-slate-600 font-bold h-[40px]">
                        <th className="py-2 px-3 w-[8%] text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredMasterFactories.length > 0 &&
                              filteredMasterFactories.every((f) => selectedFactories.includes(f.factoryName))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                const newAdded = filteredMasterFactories.map((f) => f.factoryName)
                                setSelectedFactories(Array.from(new Set([...selectedFactories, ...newAdded])))
                              } else {
                                const toRemove = new Set(filteredMasterFactories.map((f) => f.factoryName))
                                setSelectedFactories(selectedFactories.filter((f) => !toRemove.has(f)))
                              }
                            }}
                            className="rounded text-[#2C7CFF] cursor-pointer"
                          />
                        </th>
                        <th className="py-2 px-3 w-[8%] text-center">#</th>
                        <th className="py-2 px-3 w-[26%]">制造工厂名称</th>
                        <th className="py-2 px-3 w-[20%]">所属经营单位</th>
                        <th className="py-2 px-3 w-[26%]">所属产业园区</th>
                        <th className="py-2 px-3 w-[12%] text-center">勾选关联</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredMasterFactories.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                            未匹配到符合条件的制造工厂！
                          </td>
                        </tr>
                      ) : (
                        filteredMasterFactories.map((fac, idx) => {
                          const isChecked = selectedFactories.includes(fac.factoryName)
                          return (
                            <tr
                              key={fac.id}
                              onClick={() => {
                                if (isChecked) {
                                  setSelectedFactories(selectedFactories.filter((f) => f !== fac.factoryName))
                                } else {
                                  setSelectedFactories([...selectedFactories, fac.factoryName])
                                }
                              }}
                              className={cn(
                                'h-[42px] cursor-pointer transition-colors select-none',
                                isChecked ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50',
                              )}
                            >
                              <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedFactories([...selectedFactories, fac.factoryName])
                                    } else {
                                      setSelectedFactories(selectedFactories.filter((f) => f !== fac.factoryName))
                                    }
                                  }}
                                  className="rounded text-[#2C7CFF] cursor-pointer"
                                />
                              </td>
                              <td className="py-2 px-3 text-center font-mono text-slate-400 text-xs">{idx + 1}</td>
                              <td className="py-2 px-3 font-bold">
                                <span className={isChecked ? 'text-[#2C7CFF]' : 'text-slate-800'}>{fac.factoryName}</span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                                  {fac.companyName}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-slate-500 text-xs">{fac.parkName}</td>
                              <td className="py-2 px-3 text-center">
                                {isChecked ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-[#2C7CFF] text-[11px] font-bold">
                                    <CheckCircle2 className="size-3" />
                                    <span>已关联</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">未关联</span>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Tab 2: 关联产品中类勾选配置 (增加筛选条件：产量大类，下方使用卡片平铺显示产品中类，可勾选) */
              <div className="space-y-2.5">
                {/* 搜索与产量大类筛选工具栏 */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[300px]">
                    {/* 筛选条件 1: 产量大类 */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="text-xs font-bold text-slate-700 whitespace-nowrap">产量大类:</label>
                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF] cursor-pointer"
                      >
                        <option value="all">全部产量大类 ({PROCESS_MAJOR_CATEGORIES.length} 类)</option>
                        {PROCESS_MAJOR_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 筛选条件 2: 搜索输入框 */}
                    <div className="relative flex-1 min-w-[180px] max-w-[260px]">
                      <Search className="size-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="搜索产品中类、编码..."
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        className="w-full h-8 pl-8 pr-7 bg-white border border-[#E2E8F0] rounded-lg text-xs text-slate-700 focus:outline-none focus:border-[#2C7CFF]"
                      />
                      {productSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setProductSearchQuery('')}
                          className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 批量操作与视图切换 */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const currentFilteredNames = filteredMasterProducts.map((p) => p.modelName)
                        setSelectedProducts(Array.from(new Set([...selectedProducts, ...currentFilteredNames])))
                      }}
                      className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                    >
                      全选当前中类
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProducts([])}
                      className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                    >
                      清空已选
                    </button>

                    {/* 视图切换 (默认卡片平铺，支持切换列表明细) */}
                    <div className="flex items-center p-0.5 rounded-lg bg-slate-200/80 border border-slate-300 ml-1">
                      <button
                        type="button"
                        onClick={() => setProductViewMode('card')}
                        className={cn(
                          'px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
                          productViewMode === 'card'
                            ? 'bg-white text-[#2C7CFF] shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900',
                        )}
                        title="卡片平铺视图"
                      >
                        <LayoutGrid className="size-3" />
                        <span>卡片平铺</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductViewMode('table')}
                        className={cn(
                          'px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1',
                          productViewMode === 'table'
                            ? 'bg-white text-[#2C7CFF] shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900',
                        )}
                        title="列表明细视图"
                      >
                        <List className="size-3" />
                        <span>列表明细</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 卡片平铺展示或表格列表展示 */}
                {productViewMode === 'card' ? (
                  /* 卡片平铺视图 (默认高密平铺，可勾选) */
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/40 max-h-[390px] overflow-y-auto">
                    {filteredMasterProducts.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-xs font-sans">
                        未匹配到符合条件的产品中类！
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {filteredMasterProducts.map((prod) => {
                          const isChecked = selectedProducts.includes(prod.modelName)
                          return (
                            <div
                              key={prod.id}
                              onClick={() => {
                                if (isChecked) {
                                  setSelectedProducts(selectedProducts.filter((p) => p !== prod.modelName))
                                } else {
                                  setSelectedProducts([...selectedProducts, prod.modelName])
                                }
                              }}
                              className={cn(
                                'group relative p-3 rounded-lg border transition-all cursor-pointer select-none flex flex-col justify-between min-h-[76px]',
                                isChecked
                                  ? 'bg-blue-50/70 border-[#2C7CFF] ring-1 ring-[#2C7CFF]/60 shadow-2xs'
                                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/80',
                              )}
                            >
                              {/* 顶部：勾选框 + 产品中类名称 + 状态 */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2 min-w-0 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}}
                                    className="mt-0.5 rounded text-[#2C7CFF] cursor-pointer shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className={cn(
                                        'text-xs font-bold truncate leading-tight',
                                        isChecked ? 'text-[#2C7CFF]' : 'text-slate-800',
                                      )}
                                      title={prod.modelName}
                                    >
                                      {prod.modelName}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                                      {prod.code || '-'}
                                    </div>
                                  </div>
                                </div>

                                {isChecked && (
                                  <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-100 text-[#2C7CFF] text-[10px] font-bold">
                                    <CheckCircle2 className="size-2.5" />
                                    <span>已选</span>
                                  </span>
                                )}
                              </div>

                              {/* 底栏：产量大类徽章 + 计量单位 */}
                              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[11px]">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 group-hover:bg-blue-50 text-slate-600 text-[10px] font-medium truncate max-w-[120px]">
                                  {prod.category}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {prod.unit}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* 列表明细数据表格 */
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-h-[390px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                        <tr className="text-slate-600 font-bold h-[40px]">
                          <th className="py-2 px-3 w-[6%] text-center">
                            <input
                              type="checkbox"
                              checked={
                                filteredMasterProducts.length > 0 &&
                                filteredMasterProducts.every((p) => selectedProducts.includes(p.modelName))
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const newAdded = filteredMasterProducts.map((p) => p.modelName)
                                  setSelectedProducts(Array.from(new Set([...selectedProducts, ...newAdded])))
                                } else {
                                  const toRemove = new Set(filteredMasterProducts.map((p) => p.modelName))
                                  setSelectedProducts(selectedProducts.filter((p) => !toRemove.has(p)))
                                }
                              }}
                              className="rounded text-[#2C7CFF] cursor-pointer"
                            />
                          </th>
                          <th className="py-2 px-3 w-[6%] text-center">#</th>
                          <th className="py-2 px-3 w-[16%]">中类编码</th>
                          <th className="py-2 px-3 w-[32%]">产品中类</th>
                          <th className="py-2 px-3 w-[18%]">产量大类</th>
                          <th className="py-2 px-3 w-[10%] text-center">计量单位</th>
                          <th className="py-2 px-3 w-[12%] text-center">勾选关联</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredMasterProducts.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                              未匹配到符合条件的产品中类！
                            </td>
                          </tr>
                        ) : (
                          filteredMasterProducts.map((prod, idx) => {
                            const isChecked = selectedProducts.includes(prod.modelName)
                            return (
                              <tr
                                key={prod.id}
                                onClick={() => {
                                  if (isChecked) {
                                    setSelectedProducts(selectedProducts.filter((p) => p !== prod.modelName))
                                  } else {
                                    setSelectedProducts([...selectedProducts, prod.modelName])
                                  }
                                }}
                                className={cn(
                                  'h-[42px] cursor-pointer transition-colors select-none',
                                  isChecked ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50',
                                )}
                              >
                                <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedProducts([...selectedProducts, prod.modelName])
                                      } else {
                                        setSelectedProducts(selectedProducts.filter((p) => p !== prod.modelName))
                                      }
                                    }}
                                    className="rounded text-[#2C7CFF] cursor-pointer"
                                  />
                                </td>
                                <td className="py-2 px-3 text-center font-mono text-slate-400 text-xs">{idx + 1}</td>
                                <td className="py-2 px-3 font-mono text-[#2C7CFF] font-medium text-xs">
                                  {prod.code || '-'}
                                </td>
                                <td className="py-2 px-3 font-bold">
                                  <span className={isChecked ? 'text-[#2C7CFF]' : 'text-slate-800'}>{prod.modelName}</span>
                                </td>
                                <td className="py-2 px-3">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
                                    {prod.category}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-center font-mono text-slate-600">{prod.unit}</td>
                                <td className="py-2 px-3 text-center">
                                  {isChecked ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-[#2C7CFF] text-[11px] font-bold">
                                      <CheckCircle2 className="size-3" />
                                      <span>已关联</span>
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">未关联</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 5. 新增 / 编辑生产工序弹窗 (ProcessModal) */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <Modal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={editingProcess ? '编辑生产工序' : '新增生产工序'}
          size="md"
        >
          <form onSubmit={handleSaveProcess} className="p-5 space-y-4 font-sans text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">生产工序名称 *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs focus:outline-none"
                  placeholder="如 变压器-高压-干燥"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">工序专业分类 *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="transformer">变压器制造</option>
                  <option value="core">铁心制造</option>
                  <option value="cable">线缆制造</option>
                  <option value="other">其他制造</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">主要计量单位 *</label>
              <input
                type="text"
                required
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] font-mono text-xs focus:outline-none"
                placeholder="如 kVA, t, km*mm2"
              />
            </div>

            {/* 使用能源类型复选 */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">使用能源类型 (多选) *</label>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                {['电力', '蒸汽', '天然气'].map((eType) => (
                  <label key={eType} className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
                    <input
                      type="checkbox"
                      checked={formEnergyTypes.includes(eType)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormEnergyTypes([...formEnergyTypes, eType])
                        } else {
                          setFormEnergyTypes(formEnergyTypes.filter((t) => t !== eType))
                        }
                      }}
                      className="rounded text-[#2C7CFF]"
                    />
                    <span>{eType === '电力' ? '⚡ 电力' : eType === '蒸汽' ? '🔥 蒸汽' : '💨 天然气'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 工序描述 */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">工序技术说明与描述</label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] text-xs focus:outline-none"
                placeholder="填写工序技术要求、工艺特征或产量汇总依据..."
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="h-9 px-4 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="h-9 px-5 rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white font-bold cursor-pointer"
              >
                保存工序
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 6. 为工序配置新工厂弹窗 (LinkFactoryModal) */}
      {/* ========================================================================= */}
      {isLinkFactoryModalOpen && linkFactoryProcess && (
        <Modal
          open={isLinkFactoryModalOpen}
          onClose={() => setIsLinkFactoryModalOpen(false)}
          title={`为【${linkFactoryProcess.name}】关联制造工厂`}
          size="md"
        >
          <form onSubmit={handleSaveLinkFactory} className="p-5 space-y-4 font-sans text-xs">
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">经营单位 *</label>
                <select
                  value={linkCompany}
                  onChange={(e) => setLinkCompany(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs focus:outline-none cursor-pointer"
                >
                  {PROCESS_COMPANIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">制造工厂 / 企业 *</label>
                <input
                  type="text"
                  required
                  value={linkFactory}
                  onChange={(e) => setLinkFactory(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs focus:outline-none"
                  placeholder="如 沈变本部、天变天津基地"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">所属产业园区 *</label>
              <input
                type="text"
                required
                value={linkPark}
                onChange={(e) => setLinkPark(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs focus:outline-none"
                placeholder="如 特变电工东北输变电产业园"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">关联产品中类 *</label>
                <input
                  type="text"
                  required
                  value={linkProduct}
                  onChange={(e) => setLinkProduct(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs focus:outline-none"
                  placeholder="如 交流变压器-1000KV、高压交联电力电缆"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">产量计量单位 *</label>
                <input
                  type="text"
                  required
                  value={linkUnit}
                  onChange={(e) => setLinkUnit(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] font-mono text-xs focus:outline-none"
                  placeholder="如 kVA, km*mm2, t"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">产量获取方式依据</label>
              <input
                type="text"
                value={linkOrigin}
                onChange={(e) => setLinkOrigin(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs focus:outline-none"
                placeholder="如 产品产量由订单汇总、车间分开统计"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsLinkFactoryModalOpen(false)}
                className="h-9 px-4 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="h-9 px-5 rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white font-bold cursor-pointer"
              >
                确认关联
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

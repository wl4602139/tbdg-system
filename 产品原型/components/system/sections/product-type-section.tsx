'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  FolderTree,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  Layers,
  Boxes,
  AlertCircle,
  Cpu,
  Database,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { Modal } from '@/components/shared/modal'
import {
  type ProductMajorType,
  type ProductSubType,
  INITIAL_MAJOR_TYPES,
  INITIAL_SUB_TYPES,
  STANDARD_UNITS,
} from '@/lib/product-type-data'
import {
  getModelsByMajorCode,
  getModelsBySubCode,
  getBasicDataForMajor,
  type LinkedBasicDataItem,
} from '@/lib/data-governance-hub'
import type { ProductModelMappingItem } from '@/lib/product-model-mapping'

export interface ProductTypeSectionProps {
  onNavigate?: (module: 'basic-data' | 'product-type' | 'product-model', params?: Record<string, string>) => void
  initialParams?: Record<string, string>
}

export function ProductTypeSection({ onNavigate, initialParams }: ProductTypeSectionProps) {
  // 数据集状态
  const [majorTypes, setMajorTypes] = useState<ProductMajorType[]>(INITIAL_MAJOR_TYPES)
  const [subTypes, setSubTypes] = useState<ProductSubType[]>(INITIAL_SUB_TYPES)

  // 展开折叠状态 (存储展开的大类编码)
  const [expandedCodes, setExpandedCodes] = useState<string[]>(() =>
    INITIAL_MAJOR_TYPES.map((m) => m.code)
  )

  // 筛选状态
  const [filterIndustry, setFilterIndustry] = useState<string>('all')
  const [filterMajorCode, setFilterMajorCode] = useState<string>(initialParams?.majorCode || 'all')
  const [filterLevel, setFilterLevel] = useState<string>(initialParams?.level || 'all') // 'all' | '1' | '2'
  const [filterSearch, setFilterSearch] = useState<string>(initialParams?.search || '')

  // 响应外部传递的筛选参数
  useEffect(() => {
    if (initialParams?.majorCode) setFilterMajorCode(initialParams.majorCode)
    if (initialParams?.search) setFilterSearch(initialParams.search)
  }, [initialParams])

  // 关联弹窗状态 (主数据互联穿梭)
  const [relationModalType, setRelationModalType] = useState<'models' | 'basicData' | null>(null)
  const [relationTargetTitle, setRelationTargetTitle] = useState<string>('')
  const [selectedMajorForRelation, setSelectedMajorForRelation] = useState<ProductMajorType | null>(null)
  const [selectedSubForRelation, setSelectedSubForRelation] = useState<ProductSubType | null>(null)
  const [relationModelsList, setRelationModelsList] = useState<ProductModelMappingItem[]>([])
  const [relationBasicDataList, setRelationBasicDataList] = useState<LinkedBasicDataItem[]>([])

  // 打开大类关联的生产型号弹窗
  function handleOpenMajorModels(maj: ProductMajorType) {
    const summary = getModelsByMajorCode(maj.code)
    setSelectedMajorForRelation(maj)
    setSelectedSubForRelation(null)
    setRelationTargetTitle(`【${maj.name}】大类关联重点生产型号 (${summary.modelCount} 个型号)`)
    setRelationModelsList(summary.models)
    setRelationModalType('models')
  }

  // 打开中类关联的生产型号弹窗
  function handleOpenSubModels(sub: ProductSubType) {
    const summary = getModelsBySubCode(sub.code)
    setSelectedMajorForRelation(null)
    setSelectedSubForRelation(sub)
    setRelationTargetTitle(`【${sub.name}】中类关联重点生产型号 (${summary.modelCount} 个型号)`)
    setRelationModelsList(summary.models)
    setRelationModalType('models')
  }

  // 打开大类挂载的底座基础数据指标弹窗
  function handleOpenMajorBasicData(maj: ProductMajorType) {
    const list = getBasicDataForMajor(maj.code)
    setSelectedMajorForRelation(maj)
    setSelectedSubForRelation(null)
    setRelationTargetTitle(`【${maj.name}】大类挂载底座基础数据字段 (${list.length} 项)`)
    setRelationBasicDataList(list)
    setRelationModalType('basicData')
  }

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [formLevel, setFormLevel] = useState<'major' | 'sub'>('major')
  const [editingItem, setEditingItem] = useState<ProductMajorType | ProductSubType | null>(null)

  // 表单状态 - 1级大类
  const [formMajorCode, setFormMajorCode] = useState<string>('')
  const [formMajorName, setFormMajorName] = useState<string>('')
  const [formMajorIndustry, setFormMajorIndustry] = useState<'transformer' | 'cable'>('transformer')
  const [formMajorDesc, setFormMajorDesc] = useState<string>('')

  // 表单状态 - 2级中类
  const [formSubCode, setFormSubCode] = useState<string>('')
  const [formSubName, setFormSubName] = useState<string>('')
  const [formSubParentMajorCode, setFormSubParentMajorCode] = useState<string>('1001')
  const [formSubUnit, setFormSubUnit] = useState<string>('万kVA')
  const [formSubDesc, setFormSubDesc] = useState<string>('')

  // 状态启停用
  const [formStatus, setFormStatus] = useState<'enabled' | 'disabled'>('enabled')

  // 折叠/展开控制
  function toggleExpand(code: string) {
    setExpandedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  // 计算每个 1 级大类下的 2 级中类数量
  const subCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    majorTypes.forEach((m) => {
      map[m.code] = subTypes.filter((s) => s.majorCode === m.code).length
    })
    return map
  }, [majorTypes, subTypes])

  // 过滤后的 1 级大类列表
  const filteredMajorTypes = useMemo(() => {
    return majorTypes.filter((item) => {
      if (filterIndustry !== 'all' && item.industry !== filterIndustry) return false
      if (filterMajorCode !== 'all' && item.code !== filterMajorCode) return false
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase().trim()
        const matchCode = item.code.toLowerCase().includes(q)
        const matchName = item.name.toLowerCase().includes(q)
        const matchDesc = item.description.toLowerCase().includes(q)
        const matchChild = subTypes.some(
          (s) =>
            s.majorCode === item.code &&
            (s.code.toLowerCase().includes(q) ||
              s.name.toLowerCase().includes(q) ||
              (s.description || '').toLowerCase().includes(q))
        )
        if (!matchCode && !matchName && !matchDesc && !matchChild) return false
      }
      return true
    })
  }, [majorTypes, subTypes, filterIndustry, filterMajorCode, filterSearch])

  // 过滤后的 2 级中类列表
  const filteredSubTypes = useMemo(() => {
    return subTypes.filter((item) => {
      if (filterIndustry !== 'all' && item.industry !== filterIndustry) return false
      if (filterMajorCode !== 'all' && item.majorCode !== filterMajorCode) return false
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase().trim()
        const matchCode = item.code.toLowerCase().includes(q)
        const matchName = item.name.toLowerCase().includes(q)
        const matchMajor = item.majorName.toLowerCase().includes(q)
        const matchDesc = (item.description || '').toLowerCase().includes(q)
        if (!matchCode && !matchName && !matchMajor && !matchDesc) return false
      }
      return true
    })
  }, [subTypes, filterIndustry, filterMajorCode, filterSearch])


  // 打开新增弹窗
  function handleOpenCreate(level: 'major' | 'sub', defaultParentCode?: string) {
    setModalMode('create')
    setFormLevel(level)
    setEditingItem(null)

    if (level === 'major') {
      const nextMajorNum = 1008 + majorTypes.length
      setFormMajorCode(nextMajorNum.toString())
      setFormMajorName('')
      setFormMajorIndustry('transformer')
      setFormMajorDesc('')
      setFormStatus('enabled')
    } else {
      const parentCode = defaultParentCode || (majorTypes[0]?.code ?? '1001')
      const parent = majorTypes.find((m) => m.code === parentCode)
      setFormSubParentMajorCode(parentCode)
      setFormSubCode(`${parentCode}010101`)
      setFormSubName('')
      setFormSubUnit(parent?.industry === 'cable' ? 'km' : '万kVA')
      setFormSubDesc('')
      setFormStatus('enabled')
    }

    setIsModalOpen(true)
  }

  // 打开编辑弹窗
  function handleOpenEditMajor(item: ProductMajorType) {
    setModalMode('edit')
    setFormLevel('major')
    setEditingItem(item)
    setFormMajorCode(item.code)
    setFormMajorName(item.name)
    setFormMajorIndustry(item.industry)
    setFormMajorDesc(item.description)
    setFormStatus(item.status)
    setIsModalOpen(true)
  }

  function handleOpenEditSub(item: ProductSubType) {
    setModalMode('edit')
    setFormLevel('sub')
    setEditingItem(item)
    setFormSubCode(item.code)
    setFormSubName(item.name)
    setFormSubParentMajorCode(item.majorCode)
    setFormSubUnit(item.unit)
    setFormSubDesc(item.description || '')
    setFormStatus(item.status)
    setIsModalOpen(true)
  }

  // 保存弹窗表单
  function handleSaveForm() {
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')

    if (formLevel === 'major') {
      if (!formMajorName.trim() || !formMajorCode.trim()) {
        alert('请完整填写 1 级大类编码和名称！')
        return
      }

      if (modalMode === 'create') {
        // 查重
        if (majorTypes.some((m) => m.code === formMajorCode.trim())) {
          alert('该大类编码已存在，请重新输入！')
          return
        }

        const newMajor: ProductMajorType = {
          id: `maj-${formMajorCode.trim()}`,
          code: formMajorCode.trim(),
          name: formMajorName.trim(),
          industry: formMajorIndustry,
          description: formMajorDesc.trim() || '无特殊说明',
          status: formStatus,
          updatedAt: timestamp,
          operator: 'Admin (管理员)',
        }
        setMajorTypes((prev) => [newMajor, ...prev])
        setExpandedCodes((prev) => [...prev, newMajor.code])
      } else {
        const target = editingItem as ProductMajorType
        setMajorTypes((prev) =>
          prev.map((m) =>
            m.id === target.id
              ? {
                  ...m,
                  name: formMajorName.trim(),
                  industry: formMajorIndustry,
                  description: formMajorDesc.trim(),
                  status: formStatus,
                  updatedAt: timestamp,
                }
              : m
          )
        )
        // 同步更新下属中类的归属大类名称
        setSubTypes((prev) =>
          prev.map((s) =>
            s.majorCode === target.code
              ? {
                  ...s,
                  majorName: formMajorName.trim(),
                  industry: formMajorIndustry,
                }
              : s
          )
        )
      }
    } else {
      // 2 级中类保存
      if (!formSubName.trim() || !formSubCode.trim()) {
        alert('请完整填写 2 级中类编码和名称！')
        return
      }

      const parentMajor = majorTypes.find((m) => m.code === formSubParentMajorCode)
      if (!parentMajor) {
        alert('所选归属 1 级大类不存在！')
        return
      }

      if (modalMode === 'create') {
        if (subTypes.some((s) => s.code === formSubCode.trim())) {
          alert('该 2 级中类编码已存在，请重新输入！')
          return
        }

        const newSub: ProductSubType = {
          id: `sub-${formSubCode.trim()}`,
          code: formSubCode.trim(),
          name: formSubName.trim(),
          majorCode: parentMajor.code,
          majorName: parentMajor.name,
          industry: parentMajor.industry,
          unit: formSubUnit.trim() || '台',
          description: formSubDesc.trim(),
          status: formStatus,
          updatedAt: timestamp,
          operator: 'Admin (管理员)',
        }
        setSubTypes((prev) => [newSub, ...prev])
        // 自动展开其父级
        if (!expandedCodes.includes(parentMajor.code)) {
          setExpandedCodes((prev) => [...prev, parentMajor.code])
        }
      } else {
        const target = editingItem as ProductSubType
        setSubTypes((prev) =>
          prev.map((s) =>
            s.id === target.id
              ? {
                  ...s,
                  name: formSubName.trim(),
                  majorCode: parentMajor.code,
                  majorName: parentMajor.name,
                  industry: parentMajor.industry,
                  unit: formSubUnit.trim(),
                  description: formSubDesc.trim(),
                  status: formStatus,
                  updatedAt: timestamp,
                }
              : s
          )
        )
      }
    }

    setIsModalOpen(false)
  }

  // 删除 1 级大类 (防错校验)
  function handleDeleteMajor(item: ProductMajorType) {
    const childCount = subCountMap[item.code] || 0
    if (childCount > 0) {
      alert(
        `操作拦截：【${item.name}】大类下仍包含 ${childCount} 项 2 级产品中类！\n为保证业务数据完整性，请先在下方移除或迁移关联中类后再执行删除。`
      )
      return
    }

    if (window.confirm(`确定要删除 1 级产品大类【${item.name}】(${item.code}) 吗？`)) {
      setMajorTypes((prev) => prev.filter((m) => m.id !== item.id))
    }
  }

  // 删除 2 级中类
  function handleDeleteSub(item: ProductSubType) {
    if (window.confirm(`确定要删除 2 级产品中类【${item.name}】(${item.code}) 吗？`)) {
      setSubTypes((prev) => prev.filter((s) => s.id !== item.id))
    }
  }

  // 导出 CSV (包含 1 级与 2 级类型及层级结构)
  function handleExportCsv() {
    const headers = [
      '层级',
      '类型编码',
      '类型名称',
      '所属1级大类',
      '大类编码',
      '所属产业',
      '标准计量单位',
      '说明描述',
      '更新时间',
    ]

    const rows: string[][] = []

    // 树状逐层导出
    majorTypes.forEach((maj) => {
      rows.push([
        '1级(大类)',
        `"${maj.code}"`,
        `"${maj.name}"`,
        '--',
        `"${maj.code}"`,
        maj.industry === 'transformer' ? '变压器产业' : '线缆产业',
        '--',
        `"${maj.description}"`,
        `"${maj.updatedAt}"`,
      ])

      const children = subTypes.filter((s) => s.majorCode === maj.code)
      children.forEach((sub) => {
        rows.push([
          '2级(中类)',
          `"${sub.code}"`,
          `"${sub.name}"`,
          `"${sub.majorName}"`,
          `"${sub.majorCode}"`,
          sub.industry === 'transformer' ? '变压器产业' : '线缆产业',
          `"${sub.unit}"`,
          `"${sub.description || ''}"`,
          `"${sub.updatedAt}"`,
        ])
      })
    })

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `特变电工_产品1级与2级类型标准字典_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* 顶部标题栏与全局操作 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-[#DBE6EE] bg-white px-5 py-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#2C7CFF]/10 text-[#2C7CFF]">
            <FolderTree className="size-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800">产品类型管理</h2>
        </div>

        {/* 顶部核心按钮组 */}
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          {/* 新增产品类型 */}
          <button
            type="button"
            onClick={() => handleOpenCreate('major')}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2C7CFF] px-3.5 text-xs font-medium text-white hover:bg-[#1f6be8] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>新增产品类型</span>
          </button>

          {/* 标准导出按钮 80px x 36px */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="w-[80px] h-9 rounded-lg bg-[#2C7CFF] hover:bg-[#1f6be8] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Download className="size-3.5" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 筛选栏 (标准规格：36px高度、8px圆角) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-lg border border-[#DBE6EE] bg-white p-3.5 shadow-xs">
        {/* 1. 所属产业 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">所属产业</label>
          <select
            value={filterIndustry}
            onChange={(e) => {
              setFilterIndustry(e.target.value)
              setFilterMajorCode('all')
            }}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
          >
            <option value="all">全部产业</option>
            <option value="transformer">变压器产业</option>
            <option value="cable">线缆产业</option>
          </select>
        </div>

        {/* 2. 1级产品大类 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">1 级产品大类</label>
          <select
            value={filterMajorCode}
            onChange={(e) => setFilterMajorCode(e.target.value)}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
          >
            <option value="all">全部产品大类</option>
            {majorTypes
              .filter((m) => filterIndustry === 'all' || m.industry === filterIndustry)
              .map((m) => (
                <option key={m.code} value={m.code}>
                  {m.name} ({m.code})
                </option>
              ))}
          </select>
        </div>

        {/* 3. 层级筛选 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">类型层级</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
          >
            <option value="all">全部层级 (1级 + 2级)</option>
            <option value="1">仅看 1 级大类</option>
            <option value="2">仅看 2 级中类</option>
          </select>
        </div>

        {/* 4. 关键字搜索 */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">类型名称 / 编码搜索</label>
          <div className="relative">
            <input
              type="text"
              placeholder="输入类型名称、编码搜索..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            />
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 44px 工业高密数据大表 */}
      <div className="rounded-lg border border-[#DBE6EE] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] table-fixed text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-[#DBE6EE] bg-slate-50/80 text-slate-600 font-semibold h-[44px] select-none">
                  <th className="px-3 py-2 w-[4%] text-center font-mono whitespace-nowrap">#</th>
                  <th className="px-3 py-2 w-[10%] whitespace-nowrap">类型层级</th>
                  <th className="px-3 py-2 w-[12%] whitespace-nowrap">类型编码</th>
                  <th className="px-3 py-2 w-[34%] whitespace-nowrap">类型名称</th>
                  <th className="px-3 py-2 w-[14%] whitespace-nowrap">所属 1 级大类</th>
                  <th className="px-3 py-2 w-[10%] whitespace-nowrap">所属产业</th>
                  <th className="px-3 py-2 w-[8%] whitespace-nowrap">计量单位</th>
                  <th className="px-3 py-2 w-[8%] text-center whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBE6EE]/60 text-slate-700">
                {filteredMajorTypes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      未查询到匹配的产品类型数据
                    </td>
                  </tr>
                ) : (
                  filteredMajorTypes.map((maj, mIdx) => {
                    const isExpanded = expandedCodes.includes(maj.code)
                    const children = subTypes.filter(
                      (s) =>
                        s.majorCode === maj.code &&
                        (filterSearch.trim()
                          ? s.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
                            s.code.includes(filterSearch)
                          : true)
                    )
                    const showMajorRow = filterLevel === 'all' || filterLevel === '1'
                    const showChildren =
                      (filterLevel === 'all' || filterLevel === '2') &&
                      (isExpanded || filterLevel === '2')

                    return (
                      <React.Fragment key={maj.id}>
                        {/* 1 级产品大类行 */}
                        {showMajorRow && (
                          <tr className="h-[44px] bg-slate-50/30 hover:bg-blue-50/40 transition-colors font-medium">
                            {/* 序号与折叠箭头 */}
                            <td className="px-3.5 py-1 text-center font-mono text-slate-400 text-[11px]">
                              <button
                                type="button"
                                onClick={() => toggleExpand(maj.code)}
                                className="inline-flex items-center justify-center size-5 rounded hover:bg-slate-200/60 text-slate-500 cursor-pointer"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="size-3.5" />
                                ) : (
                                  <ChevronRight className="size-3.5" />
                                )}
                              </button>
                            </td>

                            {/* 类型层级 Badge */}
                            <td className="px-3 py-1 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 rounded bg-[#2C7CFF]/10 text-[#2C7CFF] border border-[#2C7CFF]/20 px-2 py-0.5 text-[11px] font-semibold">
                                <Layers className="size-3" />
                                1级 大类
                              </span>
                            </td>

                            {/* 类型编码 */}
                            <td className="px-3 py-1 whitespace-nowrap">
                              <span className="font-mono text-blue-600 bg-blue-50/70 border border-blue-200/50 rounded px-1.5 py-0.5 text-[11px] font-bold">
                                {maj.code}
                              </span>
                            </td>

                            {/* 类型名称 (自适应延展与提示) */}
                            <td className="px-3 py-1 font-bold text-slate-900 overflow-hidden">
                              <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
                                <span className="shrink-0">{maj.name}</span>
                                {maj.description && (
                                  <span className="text-[11px] text-slate-400 font-normal truncate flex-1 min-w-0" title={maj.description}>
                                    ({maj.description})
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 所属 1 级大类 */}
                            <td className="px-3 py-1 text-slate-400 whitespace-nowrap">--</td>

                            {/* 所属产业 */}
                            <td className="px-3 py-1 whitespace-nowrap">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[11px] font-medium border ${
                                  maj.industry === 'transformer'
                                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {maj.industry === 'transformer' ? '变压器产业' : '线缆产业'}
                              </span>
                            </td>

                            {/* 计量单位 */}
                            <td className="px-3 py-1 text-slate-400 whitespace-nowrap">--</td>

                            {/* 操作 (编辑 / 删除) */}
                            <td className="px-3 py-1 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditMajor(maj)}
                                  className="inline-flex items-center gap-1 text-slate-600 hover:text-[#2C7CFF] font-medium cursor-pointer transition-colors"
                                  title="编辑大类"
                                >
                                  <Edit2 className="size-3" />
                                  <span>编辑</span>
                                </button>
                                <span className="text-slate-200">|</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMajor(maj)}
                                  className="inline-flex items-center gap-1 text-slate-600 hover:text-rose-600 font-medium cursor-pointer transition-colors"
                                  title="删除大类"
                                >
                                  <Trash2 className="size-3" />
                                  <span>删除</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* 展开的 2 级中类行 */}
                        {showChildren &&
                          children.map((sub, sIdx) => (
                            <tr
                              key={sub.id}
                              className="h-[44px] bg-white hover:bg-blue-50/20 transition-colors"
                            >
                              {/* 序号与层级线 */}
                              <td className="px-3 py-1 text-center font-mono text-slate-300 text-[10px] whitespace-nowrap">
                                {mIdx + 1}.{sIdx + 1}
                              </td>

                              {/* 类型层级 Badge */}
                              <td className="px-3 py-1 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 rounded bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 text-[10px] font-medium">
                                  <Boxes className="size-2.5 text-slate-400" />
                                  2级 中类
                                </span>
                              </td>

                              {/* 10位编码 */}
                              <td className="px-3 py-1 whitespace-nowrap">
                                <span className="font-mono text-indigo-600 bg-indigo-50/70 border border-indigo-200/50 rounded px-1.5 py-0.5 text-[11px]">
                                  {sub.code}
                                </span>
                              </td>

                              {/* 中类名称 (带左侧树线缩进，可点击查看详情，自适应截断) */}
                              <td className="px-3 py-1 text-slate-800 overflow-hidden">
                                <div className="flex items-center gap-1.5 pl-3 overflow-hidden min-w-0">
                                  <span className="text-slate-300 select-none shrink-0">└─</span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenSubModels(sub)}
                                    className="font-medium text-slate-900 truncate hover:text-[#2C7CFF] text-left cursor-pointer transition-colors"
                                    title={`点击查看 ${sub.name} 挂载的具体生产型号与制造工厂`}
                                  >
                                    {sub.name}
                                  </button>
                                </div>
                              </td>

                              {/* 所属 1 级大类 */}
                              <td className="px-3 py-1 text-slate-600 font-medium truncate" title={sub.majorName}>
                                {sub.majorName}
                              </td>

                              {/* 所属产业 */}
                              <td className="px-3 py-1 text-slate-500 text-[11px] whitespace-nowrap">
                                {sub.industry === 'transformer' ? '变压器产业' : '线缆产业'}
                              </td>

                              {/* 计量单位 */}
                              <td className="px-3 py-1 whitespace-nowrap">
                                <span className="font-mono text-slate-700 bg-slate-100 rounded px-1.5 py-0.5 text-[11px]">
                                  {sub.unit}
                                </span>
                              </td>

                              {/* 操作 (编辑 / 删除) */}
                              <td className="px-3 py-1 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditSub(sub)}
                                    className="inline-flex items-center gap-1 text-slate-600 hover:text-[#2C7CFF] font-medium cursor-pointer transition-colors"
                                    title="编辑中类"
                                  >
                                    <Edit2 className="size-3" />
                                    <span>编辑</span>
                                  </button>
                                  <span className="text-slate-200">|</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSub(sub)}
                                    className="inline-flex items-center gap-1 text-slate-600 hover:text-rose-600 font-medium cursor-pointer transition-colors"
                                    title="删除中类"
                                  >
                                    <Trash2 className="size-3" />
                                    <span>删除</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
        </div>
      </div>

      {/* 新增 / 编辑产品类型弹窗 */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create'
            ? formLevel === 'major'
              ? '新增 1 级产品大类'
              : '新增 2 级产品中类'
            : formLevel === 'major'
            ? '编辑 1 级产品大类'
            : '编辑 2 级产品中类'
        }
        description="维护特变电工产品标准分类体系，支持 1 级大类与 2 级中类层级规范"
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="h-9 px-4 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveForm}
              className="h-9 px-5 rounded-lg bg-[#2C7CFF] hover:bg-[#1f6be8] text-white text-xs font-medium shadow-xs cursor-pointer"
            >
              确认保存
            </button>
          </div>
        }
      >
        <div className="space-y-4 py-1 text-xs">
          {/* 新增模式下支持选择层级 */}
          {modalMode === 'create' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                产品类型层级 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormLevel('major')}
                  className={`flex items-center justify-center gap-1.5 h-9 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    formLevel === 'major'
                      ? 'border-[#2C7CFF] bg-[#2C7CFF]/10 text-[#2C7CFF] font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Layers className="size-3.5" />
                  <span>1 级产品类型 (产品大类)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormLevel('sub')}
                  className={`flex items-center justify-center gap-1.5 h-9 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    formLevel === 'sub'
                      ? 'border-[#2C7CFF] bg-[#2C7CFF]/10 text-[#2C7CFF] font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Boxes className="size-3.5" />
                  <span>2 级产品类型 (产品中类)</span>
                </button>
              </div>
            </div>
          )}

          {/* 1 级大类表单字段 */}
          {formLevel === 'major' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    大类编码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如: 1008"
                    value={formMajorCode}
                    onChange={(e) => setFormMajorCode(e.target.value)}
                    disabled={modalMode === 'edit'}
                    className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs font-mono text-slate-800 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF] disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    所属产业 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formMajorIndustry}
                    onChange={(e) => setFormMajorIndustry(e.target.value as 'transformer' | 'cable')}
                    className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                  >
                    <option value="transformer">变压器产业</option>
                    <option value="cable">线缆产业</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  1 级产品类型名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="如: 变压器、套管、布电线..."
                  value={formMajorName}
                  onChange={(e) => setFormMajorName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-800 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">说明描述</label>
                <textarea
                  rows={2}
                  placeholder="请输入该产品大类的业务范围与设备定义..."
                  value={formMajorDesc}
                  onChange={(e) => setFormMajorDesc(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                />
              </div>
            </>
          )}

          {/* 2 级中类表单字段 */}
          {formLevel === 'sub' && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  归属 1 级产品大类 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formSubParentMajorCode}
                  onChange={(e) => setFormSubParentMajorCode(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                >
                  {majorTypes.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.name} ({m.code}) - {m.industry === 'transformer' ? '变压器' : '线缆'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    10 位中类编码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如: 1001010701"
                    value={formSubCode}
                    onChange={(e) => setFormSubCode(e.target.value)}
                    disabled={modalMode === 'edit'}
                    className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs font-mono text-slate-800 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF] disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    标准计量单位 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formSubUnit}
                    onChange={(e) => setFormSubUnit(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                  >
                    {STANDARD_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  2 级产品类型名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="如: 交流变压器-1000KV、高压并联电容器..."
                  value={formSubName}
                  onChange={(e) => setFormSubName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-800 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">规格/技术说明</label>
                <textarea
                  rows={2}
                  placeholder="如电压等级、绝缘形式、代表产品说明..."
                  value={formSubDesc}
                  onChange={(e) => setFormSubDesc(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                />
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* 关联弹窗 1：查看挂载的具体生产型号与制造实体 */}
      <Modal
        open={relationModalType === 'models'}
        onClose={() => setRelationModalType(null)}
        title={relationTargetTitle}
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-slate-500">
              共挂载 <strong className="text-indigo-600 font-mono font-bold">{relationModelsList.length}</strong> 项重点在产型号
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRelationModalType(null)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={() => {
                  const majorName = selectedMajorForRelation?.name || selectedSubForRelation?.majorName || ''
                  setRelationModalType(null)
                  onNavigate?.('product-model', majorName ? { major: majorName } : undefined)
                }}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#2C7CFF] text-white hover:bg-blue-600 transition-colors shadow-xs cursor-pointer"
              >
                <span>前往产品型号管理</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            以下为特变电工在ERP/MES系统中挂载于当前产品类型的具体订单生产型号及所属制造基地：
          </p>

          <div className="max-h-96 overflow-y-auto rounded-lg border border-[#DBE6EE]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DBE6EE] bg-slate-50 text-slate-600 font-semibold h-[38px] sticky top-0">
                  <th className="px-3 py-1.5 w-10 text-center">#</th>
                  <th className="px-3 py-1.5">订单生产型号</th>
                  <th className="px-3 py-1.5">经营单位</th>
                  <th className="px-3 py-1.5">制造工厂</th>
                  <th className="px-3 py-1.5">产品中类</th>
                  <th className="px-3 py-1.5 w-16 text-center">单位</th>
                  <th className="px-3 py-1.5 text-center w-24">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBE6EE]/60 text-slate-700">
                {relationModelsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                      当前产品类型暂未绑定生产型号台账，可前往型号管理模块新增
                    </td>
                  </tr>
                ) : (
                  relationModelsList.map((m, idx) => (
                    <tr key={m.id} className="h-[40px] hover:bg-slate-50/80">
                      <td className="px-3 py-1 text-center font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                      <td className="px-3 py-1">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 rounded px-1.5 py-0.5">
                          {m.orderModel}
                        </span>
                      </td>
                      <td className="px-3 py-1 text-slate-700 font-medium">{m.companyName}</td>
                      <td className="px-3 py-1 text-slate-500">{m.factoryName}</td>
                      <td className="px-3 py-1 text-slate-600">{m.erpSubcategoryName}</td>
                      <td className="px-3 py-1 text-center font-mono text-slate-500">{m.unit}</td>
                      <td className="px-3 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setRelationModalType(null)
                            onNavigate?.('product-model', { search: m.orderModel })
                          }}
                          className="text-xs text-[#2C7CFF] hover:underline cursor-pointer"
                        >
                          查看台账
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* 关联弹窗 2：查看挂载的全域底座基础数据字典 */}
      <Modal
        open={relationModalType === 'basicData'}
        onClose={() => setRelationModalType(null)}
        title={relationTargetTitle}
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-slate-500">
              共挂载 <strong className="text-emerald-600 font-mono font-bold">{relationBasicDataList.length}</strong> 项底座核算指标
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRelationModalType(null)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={() => {
                  setRelationModalType(null)
                  onNavigate?.('basic-data')
                }}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#2C7CFF] text-white hover:bg-blue-600 transition-colors shadow-xs cursor-pointer"
              >
                <span>前往基础数据管理</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            该产品类别在能源能耗计算、实物量生产核算及碳足迹追溯中直接依赖的底层物理量与指标点位：
          </p>

          <div className="max-h-96 overflow-y-auto rounded-lg border border-[#DBE6EE]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DBE6EE] bg-slate-50 text-slate-600 font-semibold h-[38px] sticky top-0">
                  <th className="px-3 py-1.5 w-10 text-center">#</th>
                  <th className="px-3 py-1.5 w-24">参数代码</th>
                  <th className="px-3 py-1.5">指标数据项名称</th>
                  <th className="px-3 py-1.5 w-24">业务分类</th>
                  <th className="px-3 py-1.5 w-16 text-center">单位</th>
                  <th className="px-3 py-1.5 w-20">采集频次</th>
                  <th className="px-3 py-1.5">在产品核算中的角色定位</th>
                  <th className="px-3 py-1.5 text-center w-20">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBE6EE]/60 text-slate-700">
                {relationBasicDataList.map((b, idx) => (
                  <tr key={b.code} className="h-[40px] hover:bg-slate-50/80">
                    <td className="px-3 py-1 text-center font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                    <td className="px-3 py-1">
                      <span className="font-mono text-blue-600 font-bold bg-blue-50 border border-blue-200/60 rounded px-1.5 py-0.5 text-[11px]">
                        {b.code}
                      </span>
                    </td>
                    <td className="px-3 py-1 font-bold text-slate-900">{b.name}</td>
                    <td className="px-3 py-1 text-slate-600">{b.category}</td>
                    <td className="px-3 py-1 text-center font-mono text-emerald-600 font-bold">{b.unit}</td>
                    <td className="px-3 py-1 font-mono text-slate-500 text-[11px]">{b.freq}</td>
                    <td className="px-3 py-1 text-slate-600 text-[11px]">{b.roleInProduct}</td>
                    <td className="px-3 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setRelationModalType(null)
                          onNavigate?.('basic-data', { code: b.code })
                        }}
                        className="text-xs text-[#2C7CFF] hover:underline cursor-pointer"
                      >
                        定位字段
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  )
}

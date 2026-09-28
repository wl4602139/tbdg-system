'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  Cpu,
  Plus,
  Search,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UploadCloud,
  ArrowRight,
  RotateCcw,
  Database,
  ExternalLink,
} from 'lucide-react'
import { Modal } from '@/components/shared/modal'
import {
  type ProductModelMappingItem,
  COMPANY_FACTORY_MAP,
  ERP_MAJOR_CATEGORIES,
  ERP_SUBCATEGORIES,
  INITIAL_PRODUCT_MODEL_MAPPINGS,
  resolveOrderModelToErpSubcategory,
} from '@/lib/product-model-mapping'
import { getBasicDataForModel, type LinkedBasicDataItem } from '@/lib/data-governance-hub'

interface ImportPreviewItem {
  tempId: string
  companyId: string
  companyName: string
  factoryId: string
  factoryName: string
  industry: 'transformer' | 'cable'
  erpSystem: string
  orderModel: string
  erpMajorCategoryName: string
  erpMajorCategoryCode: string
  erpSubcategoryName: string
  erpSubcategoryCode: string
  unit: string
  status: 'enabled' | 'disabled'
  matchStatus: 'auto' | 'manual'
}

export interface ProductModelSectionProps {
  onNavigate?: (module: 'basic-data' | 'product-type' | 'product-model', params?: Record<string, string>) => void
  initialParams?: Record<string, string>
}

// 模拟待导入示例批次数据
const DEMO_IMPORT_BATCH = [
  { companyId: 'comp_sb', factoryId: 'fac_sb_main', orderModel: 'ODFPS-1000000/1000' },
  { companyId: 'comp_sb', factoryId: 'fac_sb_main', orderModel: 'SZ11-63000/110' },
  { companyId: 'comp_hb', factoryId: 'fac_hb_main', orderModel: 'SFZ11-50000/110' },
  { companyId: 'comp_xb', factoryId: 'fac_xb_tb_tj', orderModel: 'SCB14-2500/10' },
  { companyId: 'comp_ll', factoryId: 'fac_ll_main', orderModel: 'YJV22-8.7/15kV-3×400' },
  { companyId: 'comp_ll', factoryId: 'fac_ll_main', orderModel: 'YJLW03-127/220kV-1×1200' },
  { companyId: 'comp_hb', factoryId: 'fac_hb_kg', orderModel: '2FZ7-252/T4000-50' },
  { companyId: 'comp_sb', factoryId: 'fac_sb_hx', orderModel: 'BRDLW-1000/2000-4' },
]

export function ProductModelSection({ onNavigate, initialParams }: ProductModelSectionProps) {
  // 台账数据状态
  const [mappings, setMappings] = useState<ProductModelMappingItem[]>(INITIAL_PRODUCT_MODEL_MAPPINGS)

  // 筛选维度状态 (5 大核心查询条件：经营单位、制造工厂、产品大类、产品中类、型号)
  const [filterCompany, setFilterCompany] = useState<string>('all')
  const [filterFactory, setFilterFactory] = useState<string>('all')
  const [filterMajorCat, setFilterMajorCat] = useState<string>(initialParams?.major || 'all')
  const [filterSubCat, setFilterSubCat] = useState<string>('all')
  const [filterSearch, setFilterSearch] = useState<string>(initialParams?.search || '')

  // 响应外部跳转参数联动
  useEffect(() => {
    if (initialParams?.major) setFilterMajorCat(initialParams.major)
    if (initialParams?.search) setFilterSearch(initialParams.search)
  }, [initialParams])

  // 关联底座数据指标弹窗状态
  const [selectedModelForBasicData, setSelectedModelForBasicData] = useState<ProductModelMappingItem | null>(null)
  const [isModelBasicDataModalOpen, setIsModelBasicDataModalOpen] = useState<boolean>(false)

  function handleOpenModelBasicData(item: ProductModelMappingItem) {
    setSelectedModelForBasicData(item)
    setIsModelBasicDataModalOpen(true)
  }

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ProductModelMappingItem | null>(null)

  // 弹窗表单状态（两组：ERP产品大类、ERP产品中类）
  const [formCompanyId, setFormCompanyId] = useState<string>('comp_sb')
  const [formFactoryId, setFormFactoryId] = useState<string>('fac_sb_main')
  const [formOrderModel, setFormOrderModel] = useState<string>('')
  
  // 组 1：产品大类
  const [formMajorCatCode, setFormMajorCatCode] = useState<string>('1001')
  const [formMajorCatName, setFormMajorCatName] = useState<string>('变压器')

  // 组 2：ERP 产品中类
  const [formSubCode, setFormSubCode] = useState<string>('1001010701')
  const [formSubName, setFormSubName] = useState<string>('交流变压器-1000KV')

  const [formUnit, setFormUnit] = useState<string>('万kVA')
  const [formRemark, setFormRemark] = useState<string>('')
  const [autoMatchTip, setAutoMatchTip] = useState<string | null>(null)

  // 导入功能相关状态
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importStep, setImportStep] = useState<'upload' | 'preview'>('upload')
  const [previewRows, setPreviewRows] = useState<ImportPreviewItem[]>([])
  const [uploadFileName, setUploadFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 经营单位联动工厂选项
  const selectedCompanyOption = useMemo(() => {
    return COMPANY_FACTORY_MAP.find((c) => c.companyId === formCompanyId) || COMPANY_FACTORY_MAP[0]
  }, [formCompanyId])

  // 当前筛选下的可用工厂列表 (根据所选经营单位联动)
  const filterAvailableFactories = useMemo(() => {
    if (filterCompany === 'all') {
      return COMPANY_FACTORY_MAP.flatMap((c) => c.factories)
    }
    const comp = COMPANY_FACTORY_MAP.find((c) => c.companyId === filterCompany)
    return comp ? comp.factories : []
  }, [filterCompany])

  // 当前筛选下的可用产品中类列表 (根据所选产品大类联动)
  const filterAvailableSubCategories = useMemo(() => {
    if (filterMajorCat === 'all') {
      return ERP_SUBCATEGORIES
    }
    return ERP_SUBCATEGORIES.filter((s) => s.majorCategoryName === filterMajorCat)
  }, [filterMajorCat])

  // 数据过滤计算 (覆盖 5 大维度：经营单位、制造工厂、产品大类、产品中类、型号、关联工序)
  const filteredList = useMemo(() => {
    return mappings.filter((item) => {
      if (filterCompany !== 'all' && item.companyId !== filterCompany) return false
      if (filterFactory !== 'all' && item.factoryId !== filterFactory) return false
      if (filterMajorCat !== 'all' && item.erpMajorCategoryName !== filterMajorCat) return false
      if (filterSubCat !== 'all' && item.erpSubcategoryName !== filterSubCat) return false
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase().trim()
        const matchModel = item.orderModel.toLowerCase().includes(q)
        const matchMajor = item.erpMajorCategoryName.toLowerCase().includes(q)
        const matchMajorCode = item.erpMajorCategoryCode.toLowerCase().includes(q)
        const matchSub = item.erpSubcategoryName.toLowerCase().includes(q)
        const matchSubCode = item.erpSubcategoryCode.includes(q)
        const matchFactory = item.factoryName.toLowerCase().includes(q)
        if (!matchModel && !matchMajor && !matchMajorCode && !matchSub && !matchSubCode && !matchFactory) return false
      }
      return true
    })
  }, [mappings, filterCompany, filterFactory, filterMajorCat, filterSubCat, filterSearch])

  // 打开新增型号弹窗
  function handleOpenAdd() {
    setEditingItem(null)
    setFormCompanyId('comp_sb')
    setFormFactoryId('fac_sb_main')
    setFormOrderModel('')
    setFormMajorCatCode('1001')
    setFormMajorCatName('变压器')
    setFormSubCode('1001010701')
    setFormSubName('交流变压器-1000KV')
    setFormUnit('万kVA')
    setFormRemark('')
    setAutoMatchTip(null)
    setIsModalOpen(true)
  }

  // 打开编辑弹窗
  function handleOpenEdit(item: ProductModelMappingItem) {
    setEditingItem(item)
    setFormCompanyId(item.companyId)
    setFormFactoryId(item.factoryId)
    setFormOrderModel(item.orderModel)
    setFormMajorCatCode(item.erpMajorCategoryCode)
    setFormMajorCatName(item.erpMajorCategoryName)
    setFormSubCode(item.erpSubcategoryCode)
    setFormSubName(item.erpSubcategoryName)
    setFormUnit(item.unit)
    setFormRemark(item.remark || '')
    setAutoMatchTip(null)
    setIsModalOpen(true)
  }

  // 删除单条
  function handleDelete(id: string) {
    if (confirm('确认删除该产品型号记录？')) {
      setMappings((prev) => prev.filter((item) => item.id !== id))
    }
  }

  // 输入订单型号后触发智能匹配（同时推导 ERP 产品大类与 ERP 产品中类 2 组数据）
  function handleTriggerAutoMatch(modelStr: string) {
    setFormOrderModel(modelStr)
    if (!modelStr.trim()) {
      setAutoMatchTip(null)
      return
    }
    const curComp = COMPANY_FACTORY_MAP.find((c) => c.companyId === formCompanyId)
    const result = resolveOrderModelToErpSubcategory(modelStr, curComp?.industry)
    if (result.matched) {
      setFormMajorCatCode(result.majorCode)
      setFormMajorCatName(result.majorName)
      setFormSubCode(result.subCode)
      setFormSubName(result.subName)
      setFormUnit(result.unit)
      setAutoMatchTip(`⚡ 智能识别命中：大类【${result.majorName}】(${result.majorCode}) ➔ 中类【${result.subName}】(${result.subCode})`)
    } else {
      setAutoMatchTip('⚠️ 未精确命中规则，请核验选择对应的产品大类与中类')
    }
  }

  // 保存新增/编辑表单
  function handleSaveForm(e: React.FormEvent) {
    e.preventDefault()
    if (!formOrderModel.trim()) {
      alert('请输入订单型号！')
      return
    }

    const currentCompany = COMPANY_FACTORY_MAP.find((c) => c.companyId === formCompanyId) || COMPANY_FACTORY_MAP[0]
    const currentFactory = currentCompany.factories.find((f) => f.factoryId === formFactoryId) || currentCompany.factories[0]

    if (editingItem) {
      // 更新现有项
      setMappings((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                companyId: currentCompany.companyId,
                companyName: currentCompany.companyName,
                factoryId: currentFactory.factoryId,
                factoryName: currentFactory.factoryName,
                industry: currentCompany.industry,
                erpSystem: currentCompany.erpSystem,
                orderModel: formOrderModel.trim(),
                erpMajorCategoryName: formMajorCatName,
                erpMajorCategoryCode: formMajorCatCode,
                erpSubcategoryName: formSubName,
                erpSubcategoryCode: formSubCode,
                unit: formUnit,
                updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
                operator: 'Admin (管理员)',
                remark: formRemark,
              }
            : item
        )
      )
    } else {
      // 新增项
      const newItem: ProductModelMappingItem = {
        id: `pm-${Date.now().toString().slice(-4)}`,
        companyId: currentCompany.companyId,
        companyName: currentCompany.companyName,
        factoryId: currentFactory.factoryId,
        factoryName: currentFactory.factoryName,
        industry: currentCompany.industry,
        erpSystem: currentCompany.erpSystem,
        orderModel: formOrderModel.trim(),
        erpMajorCategoryName: formMajorCatName,
        erpMajorCategoryCode: formMajorCatCode,
        erpSubcategoryName: formSubName,
        erpSubcategoryCode: formSubCode,
        unit: formUnit,
        status: 'enabled',
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        operator: 'Admin (管理员)',
        remark: formRemark,
      }
      setMappings((prev) => [newItem, ...prev])
    }

    setIsModalOpen(false)
  }

  // 导出台账 CSV (与优化后的纯净表格列完全拉齐)
  function handleExport() {
    const headers = ['#', '经营单位', '制造工厂', '产品大类', '大类编码', '产品中类', '中类编码', '型号']
    const rows = filteredList.map((item, idx) => [
      idx + 1,
      `"${item.companyName}"`,
      `"${item.factoryName}"`,
      `"${item.erpMajorCategoryName}"`,
      item.erpMajorCategoryCode,
      `"${item.erpSubcategoryName}"`,
      item.erpSubcategoryCode,
      `"${item.orderModel}"`,
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `特变电工_产品型号与大类对应关系台账_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /* ============================================================
   * 🌟 导入功能逻辑：上传数据表 -> 智能自动匹配 -> 预览与手动调整 -> 保存追加
   * ============================================================ */

  // 打开导入弹窗
  function handleOpenImport() {
    setImportStep('upload')
    setPreviewRows([])
    setUploadFileName('')
    setIsImportModalOpen(true)
  }

  // 载入示例待导入批次数据并执行智能匹配
  function handleLoadDemoBatch() {
    setUploadFileName('特变电工_2026年重点产品型号批量导入表.xlsx')
    const rows: ImportPreviewItem[] = DEMO_IMPORT_BATCH.map((item, idx) => {
      const comp = COMPANY_FACTORY_MAP.find((c) => c.companyId === item.companyId) || COMPANY_FACTORY_MAP[0]
      const fac = comp.factories.find((f) => f.factoryId === item.factoryId) || comp.factories[0]
      const match = resolveOrderModelToErpSubcategory(item.orderModel, comp.industry)
      return {
        tempId: `demo-${idx}-${Date.now()}`,
        companyId: comp.companyId,
        companyName: comp.companyName,
        factoryId: fac.factoryId,
        factoryName: fac.factoryName,
        industry: comp.industry,
        erpSystem: comp.erpSystem,
        orderModel: item.orderModel,
        erpMajorCategoryCode: match.majorCode,
        erpMajorCategoryName: match.majorName,
        erpSubcategoryCode: match.subCode,
        erpSubcategoryName: match.subName,
        unit: match.unit,
        status: 'enabled',
        matchStatus: 'auto',
      }
    })
    setPreviewRows(rows)
    setImportStep('preview')
  }

  // 处理文件上传解析
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadFileName(file.name)

    try {
      if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        const text = await file.text()
        const lines = text.split(/\r?\n/).filter((l) => l.trim())
        const dataLines = lines[0].includes('型号') || lines[0].includes('Model') ? lines.slice(1) : lines
        const rows: ImportPreviewItem[] = dataLines.map((line, idx) => {
          const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''))
          let comp = COMPANY_FACTORY_MAP[0]
          let fac = comp.factories[0]
          let model = parts[0]

          if (parts.length >= 3) {
            const foundComp = COMPANY_FACTORY_MAP.find((c) => c.companyName.includes(parts[0]))
            if (foundComp) {
              comp = foundComp
              const foundFac = comp.factories.find((f) => f.factoryName.includes(parts[1]))
              if (foundFac) fac = foundFac
            }
            model = parts[2]
          } else if (parts.length === 2) {
            model = parts[1]
          }

          const match = resolveOrderModelToErpSubcategory(model, comp.industry)
          return {
            tempId: `file-${idx}-${Date.now()}`,
            companyId: comp.companyId,
            companyName: comp.companyName,
            factoryId: fac.factoryId,
            factoryName: fac.factoryName,
            industry: comp.industry,
            erpSystem: comp.erpSystem,
            orderModel: model,
            erpMajorCategoryCode: match.majorCode,
            erpMajorCategoryName: match.majorName,
            erpSubcategoryCode: match.subCode,
            erpSubcategoryName: match.subName,
            unit: match.unit,
            status: 'enabled',
            matchStatus: 'auto',
          }
        })
        if (rows.length > 0) {
          setPreviewRows(rows)
          setImportStep('preview')
          return
        }
      }
    } catch (err) {
      console.error('Failed to parse file:', err)
    }

    // 若上传 xlsx 或通用文件，自动智能解析载入示例模型结构
    handleLoadDemoBatch()
  }

  // 下载标准导入模板 CSV
  function handleDownloadTemplate() {
    const csv =
      '\uFEFF' +
      '经营单位,制造工厂,订单型号,备注\n' +
      '沈变公司,沈变本部,ODFPS-1000000/1000,特高压交流主变示例\n' +
      '沈变公司,沈变本部,SZ11-63000/110,高压变压器示例\n' +
      '衡变公司,衡变本部,SFZ11-50000/110,衡变交流变压器示例\n' +
      '新变厂,天变天津基地,SCB14-2000/10,干式配电变压器示例\n' +
      '鲁缆公司,鲁缆本部 (高压立塔),YJV22-8.7/15kV-3×400,中压电力电缆示例\n' +
      '鲁缆公司,鲁缆本部 (高压立塔),YJLW03-127/220kV-1×1200,超高压电力电缆示例\n' +
      '衡变公司,云集高压开关,2FZ7-252/T4000-50,高压组合电器GIS示例\n' +
      '沈变公司,和新套管,BRDLW-1000/2000-4,直流套管示例\n'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '特变电工_产品型号批量导入模板.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 预览行：手动调整订单型号并重新智能推导匹配
  function handlePreviewModelChange(tempId: string, newModel: string) {
    setPreviewRows((prev) =>
      prev.map((row) => {
        if (row.tempId !== tempId) return row
        const match = resolveOrderModelToErpSubcategory(newModel, row.industry)
        if (match.matched) {
          return {
            ...row,
            orderModel: newModel,
            erpMajorCategoryCode: match.majorCode,
            erpMajorCategoryName: match.majorName,
            erpSubcategoryCode: match.subCode,
            erpSubcategoryName: match.subName,
            unit: match.unit,
            matchStatus: 'auto',
          }
        }
        return {
          ...row,
          orderModel: newModel,
          matchStatus: 'manual',
        }
      })
    )
  }

  // 预览行：手动调整经营单位
  function handlePreviewCompanyChange(tempId: string, companyId: string) {
    const comp = COMPANY_FACTORY_MAP.find((c) => c.companyId === companyId)
    if (!comp) return
    setPreviewRows((prev) =>
      prev.map((row) => {
        if (row.tempId !== tempId) return row
        const firstFactory = comp.factories[0]
        return {
          ...row,
          companyId: comp.companyId,
          companyName: comp.companyName,
          factoryId: firstFactory?.factoryId ?? '',
          factoryName: firstFactory?.factoryName ?? '',
          industry: comp.industry,
          erpSystem: comp.erpSystem,
          matchStatus: 'manual',
        }
      })
    )
  }

  // 预览行：手动调整制造工厂
  function handlePreviewFactoryChange(tempId: string, factoryId: string) {
    setPreviewRows((prev) =>
      prev.map((row) => {
        if (row.tempId !== tempId) return row
        const comp = COMPANY_FACTORY_MAP.find((c) => c.companyId === row.companyId)
        const fac = comp?.factories.find((f) => f.factoryId === factoryId)
        return {
          ...row,
          factoryId,
          factoryName: fac?.factoryName ?? row.factoryName,
          matchStatus: 'manual',
        }
      })
    )
  }

  // 预览行：手动调整 ERP 产品大类
  function handlePreviewMajorCatChange(tempId: string, majorCode: string) {
    const majorDef = ERP_MAJOR_CATEGORIES.find((m) => m.code === majorCode)
    if (!majorDef) return
    const subDef = ERP_SUBCATEGORIES.find((s) => s.majorCategoryCode === majorCode)
    setPreviewRows((prev) =>
      prev.map((row) => {
        if (row.tempId !== tempId) return row
        return {
          ...row,
          erpMajorCategoryCode: majorDef.code,
          erpMajorCategoryName: majorDef.name,
          erpSubcategoryCode: subDef?.code ?? row.erpSubcategoryCode,
          erpSubcategoryName: subDef?.name ?? row.erpSubcategoryName,
          unit: subDef?.unit ?? row.unit,
          matchStatus: 'manual',
        }
      })
    )
  }

  // 预览行：手动调整 ERP 产品中类
  function handlePreviewSubCatChange(tempId: string, subCode: string) {
    const subDef = ERP_SUBCATEGORIES.find((s) => s.code === subCode)
    if (!subDef) return
    setPreviewRows((prev) =>
      prev.map((row) => {
        if (row.tempId !== tempId) return row
        return {
          ...row,
          erpSubcategoryCode: subDef.code,
          erpSubcategoryName: subDef.name,
          erpMajorCategoryCode: subDef.majorCategoryCode,
          erpMajorCategoryName: subDef.majorCategoryName,
          unit: subDef.unit,
          matchStatus: 'manual',
        }
      })
    )
  }

  // 预览行：删除单行
  function handleDeletePreviewRow(tempId: string) {
    setPreviewRows((prev) => prev.filter((r) => r.tempId !== tempId))
  }

  // 预览行：新增一行手动输入
  function handleAddPreviewRow() {
    const comp = COMPANY_FACTORY_MAP[0]
    const fac = comp.factories[0]
    const newRow: ImportPreviewItem = {
      tempId: `imp-row-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      companyId: comp.companyId,
      companyName: comp.companyName,
      factoryId: fac.factoryId,
      factoryName: fac.factoryName,
      industry: comp.industry,
      erpSystem: comp.erpSystem,
      orderModel: '新订单型号示例',
      erpMajorCategoryCode: '1001',
      erpMajorCategoryName: '变压器',
      erpSubcategoryCode: '1001010701',
      erpSubcategoryName: '交流变压器-1000KV',
      unit: '万kVA',
      status: 'enabled',
      matchStatus: 'manual',
    }
    setPreviewRows((prev) => [...prev, newRow])
  }

  // 重新执行智能匹配
  function handleRerunAutoMatch() {
    setPreviewRows((prev) =>
      prev.map((row) => {
        const match = resolveOrderModelToErpSubcategory(row.orderModel, row.industry)
        if (match.matched) {
          return {
            ...row,
            erpMajorCategoryCode: match.majorCode,
            erpMajorCategoryName: match.majorName,
            erpSubcategoryCode: match.subCode,
            erpSubcategoryName: match.subName,
            unit: match.unit,
            matchStatus: 'auto',
          }
        }
        return row
      })
    )
  }

  // 确认保存并增加到数据列表中
  function handleSaveImport() {
    if (previewRows.length === 0) {
      alert('暂无可导入的数据！')
      return
    }
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
    const newItems: ProductModelMappingItem[] = previewRows.map((r, idx) => ({
      id: `pm-imp-${Date.now().toString().slice(-4)}-${idx + 1}`,
      companyId: r.companyId,
      companyName: r.companyName,
      factoryId: r.factoryId,
      factoryName: r.factoryName,
      industry: r.industry,
      erpSystem: r.erpSystem,
      orderModel: r.orderModel.trim(),
      erpMajorCategoryName: r.erpMajorCategoryName,
      erpMajorCategoryCode: r.erpMajorCategoryCode,
      erpSubcategoryName: r.erpSubcategoryName,
      erpSubcategoryCode: r.erpSubcategoryCode,
      unit: r.unit,
      status: 'enabled',
      updatedAt: timestamp,
      operator: 'Admin (批量导入)',
      remark: r.matchStatus === 'manual' ? '管理员手动调整导入' : '系统智能匹配自动导入',
    }))

    setMappings((prev) => [...newItems, ...prev])
    setIsImportModalOpen(false)
    alert(`成功导入 ${newItems.length} 条产品型号数据，已增加至列表中！`)
  }

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-[#DBE6EE] bg-white px-5 py-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#2C7CFF]/10 text-[#2C7CFF]">
            <Cpu className="size-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800">产品型号与大类对应关系管理</h2>
        </div>

        {/* 顶部核心操作按钮组：新增型号 | 导入 | 导出 */}
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          {/* 新增型号按钮 */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2C7CFF] px-3.5 text-xs font-medium text-white hover:bg-[#1f6be8] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>新增型号</span>
          </button>

          {/* 80px x 36px 导入按钮 */}
          <button
            type="button"
            onClick={handleOpenImport}
            className="w-[80px] h-9 rounded-lg bg-[#2C7CFF] hover:bg-[#1f6be8] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Upload className="size-3.5" />
            <span>导入</span>
          </button>

          {/* 80px x 36px 标准导出按钮 */}
          <button
            type="button"
            onClick={handleExport}
            className="w-[80px] h-9 rounded-lg bg-[#2C7CFF] hover:bg-[#1f6be8] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Download className="size-3.5" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 级联多维筛选栏与产品型号映射台账 */}
      <div className="space-y-4">
        {/* 级联多维筛选栏 (5 大核心查询条件：经营单位、制造工厂、产品大类、产品中类、型号) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 rounded-lg border border-[#DBE6EE] bg-white p-3.5 shadow-xs">
          {/* 1. 经营单位 */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">经营单位</label>
            <select
              value={filterCompany}
              onChange={(e) => {
                setFilterCompany(e.target.value)
                setFilterFactory('all')
              }}
              className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            >
              <option value="all">全部经营单位</option>
              {COMPANY_FACTORY_MAP.map((c) => (
                <option key={c.companyId} value={c.companyId}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* 2. 制造工厂 */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">制造工厂</label>
            <select
              value={filterFactory}
              onChange={(e) => setFilterFactory(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            >
              <option value="all">全部制造工厂</option>
              {filterAvailableFactories.map((f) => (
                <option key={f.factoryId} value={f.factoryId}>
                  {f.factoryName}
                </option>
              ))}
            </select>
          </div>

          {/* 3. 产品大类 */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">产品大类</label>
            <select
              value={filterMajorCat}
              onChange={(e) => {
                setFilterMajorCat(e.target.value)
                setFilterSubCat('all')
              }}
              className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            >
              <option value="all">全部产品大类</option>
              {ERP_MAJOR_CATEGORIES.map((m) => (
                <option key={m.code} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. 产品中类 (级联) */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">产品中类</label>
            <select
              value={filterSubCat}
              onChange={(e) => setFilterSubCat(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            >
              <option value="all">全部产品中类</option>
              {filterAvailableSubCategories.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 5. 型号 */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">型号</label>
            <div className="relative">
              <input
                type="text"
                placeholder="输入型号搜索..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
              />
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* 44px 工业高密映射大表 */}
        <div className="rounded-lg border border-[#DBE6EE] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] table-fixed text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-[#DBE6EE] bg-slate-50/80 text-slate-600 font-semibold h-[44px] select-none">
                  <th className="px-3 py-2 w-[3%] text-center font-mono whitespace-nowrap">#</th>
                  <th className="px-3 py-2 w-[12%] whitespace-nowrap">经营单位</th>
                  <th className="px-3 py-2 w-[13%] whitespace-nowrap">制造工厂</th>
                  <th className="px-3 py-2 w-[12%] whitespace-nowrap">产品大类</th>
                  <th className="px-3 py-2 w-[8%] whitespace-nowrap">大类编码</th>
                  <th className="px-3 py-2 w-[15%] whitespace-nowrap">产品中类</th>
                  <th className="px-3 py-2 w-[9%] whitespace-nowrap">中类编码</th>
                  <th className="px-3 py-2 w-[20%] whitespace-nowrap">型号</th>
                  <th className="px-3 py-2 w-[8%] text-center whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBE6EE]/60 text-slate-700">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                      未查询到匹配的产品型号映射数据
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="h-[44px] hover:bg-blue-50/30 transition-colors"
                    >
                      {/* 序号 */}
                      <td className="px-3 py-1 text-center font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {idx + 1}
                      </td>

                      {/* 经营单位 */}
                      <td className="px-3 py-1 truncate" title={item.companyName}>
                        <span className="font-medium text-slate-900">{item.companyName}</span>
                      </td>

                      {/* 制造工厂 */}
                      <td className="px-3 py-1 text-slate-600 truncate" title={item.factoryName}>
                        {item.factoryName}
                      </td>

                      {/* 产品大类 (支持一键穿梭到产品类型管理) */}
                      <td className="px-3 py-1 font-medium text-slate-800 truncate" title={item.erpMajorCategoryName}>
                        <button
                          type="button"
                          onClick={() => onNavigate?.('product-type', { majorCode: item.erpMajorCategoryCode })}
                          className="hover:text-[#2C7CFF] hover:underline inline-flex items-center gap-1 cursor-pointer text-left truncate max-w-full"
                          title="点击前往产品类型管理查看该 1 级大类标准定义"
                        >
                          <span className="truncate">{item.erpMajorCategoryName}</span>
                          <ExternalLink className="size-2.5 text-slate-400 shrink-0" />
                        </button>
                      </td>

                      {/* 大类编码 */}
                      <td className="px-3 py-1 whitespace-nowrap">
                        <span className="font-mono text-blue-600 bg-blue-50/70 border border-blue-200/50 rounded px-1.5 py-0.5 text-[11px]">
                          {item.erpMajorCategoryCode}
                        </span>
                      </td>

                      {/* 产品中类 */}
                      <td className="px-3 py-1 font-medium text-slate-800 truncate" title={item.erpSubcategoryName}>
                        {item.erpSubcategoryName}
                      </td>

                      {/* 中类编码 */}
                      <td className="px-3 py-1 whitespace-nowrap">
                        <span className="font-mono text-indigo-600 bg-indigo-50/70 border border-indigo-200/50 rounded px-1.5 py-0.5 text-[11px]">
                          {item.erpSubcategoryCode}
                        </span>
                      </td>

                      {/* 型号 */}
                      <td className="px-3 py-1 truncate" title={item.orderModel}>
                        <span
                          onClick={() => handleOpenModelBasicData(item)}
                          className="font-mono font-semibold text-slate-900 bg-slate-100 hover:bg-blue-50 hover:text-[#2C7CFF] cursor-pointer rounded px-2 py-0.5 truncate inline-block max-w-full transition-colors"
                          title="点击查看型号底座指标"
                        >
                          {item.orderModel}
                        </span>
                      </td>

                      {/* 操作 (编辑 / 删除) */}
                      <td className="px-3 py-1 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-[#2C7CFF] font-medium cursor-pointer transition-colors"
                            title="编辑型号对应关系"
                          >
                            <Edit2 className="size-3" />
                            <span>编辑</span>
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-rose-600 font-medium cursor-pointer transition-colors"
                            title="删除该型号映射"
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

          {/* 表格底栏信息 */}
          <div className="flex items-center justify-between border-t border-[#DBE6EE] px-4 py-2.5 text-xs text-slate-500 bg-slate-50/50">
            <span>共显示 <strong>{filteredList.length}</strong> 项产品型号映射记录</span>
          </div>
        </div>
      </div>

      {/* ============================================================
       * 🌟 批量导入弹窗 (Modal): 支持上传数据表 -> 智能自动匹配 -> 预览与手动调整 -> 保存追加
       * ============================================================ */}
      <Modal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={importStep === 'upload' ? '批量导入产品型号' : '导入预览与产品大类/种类智能匹配核验'}
        size="3xl"
      >
        {importStep === 'upload' ? (
          <div className="space-y-5">
            {/* 说明区域 */}
            <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4 text-xs text-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <FileSpreadsheet className="size-4 text-[#2C7CFF]" />
                  <span>智能自动匹配规则说明</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1 text-[#2C7CFF] hover:underline font-medium cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>下载标准导入模板.csv</span>
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                系统内置特变电工产品大类与中类知识图谱。上传数据表后，系统将依据【订单型号】<strong>智能自动推导出对应的产品大类、大类编码、产品中类及中类编码</strong>。
              </p>
              <div className="text-[11px] text-slate-500 flex flex-wrap gap-4 pt-1">
                <span>✓ 变压器规则：自动识别 1000kV/750kV/500kV/110kV/干变/箱变/特种变</span>
                <span>✓ 线缆规则：自动识别超高压立塔、中低压力缆、特种电缆等</span>
              </div>
            </div>

            {/* 文件上传拖拽区 */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#DBE6EE] hover:border-[#2C7CFF] bg-slate-50/50 hover:bg-blue-50/20 p-8 text-center cursor-pointer transition-colors"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-[#2C7CFF]/10 text-[#2C7CFF] mb-3">
                <UploadCloud className="size-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-1">
                点击选择或将数据表拖拽至此处上传
              </p>
              <p className="text-xs text-slate-400 mb-3">
                支持 Excel (.xlsx / .xls) 或 CSV 格式文件，单次最大支持 500 条型号记录
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#2C7CFF] bg-white px-3 py-1.5 text-xs font-medium text-[#2C7CFF] shadow-2xs hover:bg-[#2C7CFF]/5">
                <Upload className="size-3.5" /> 选择本地数据文件
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* 一键载入示例数据 */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">快速体验 / 模拟导入</p>
                <p className="text-[11px] text-slate-500">
                  一键载入 8 条特变电工重点待导入型号数据（含特高压交流变、超高压电缆、GIS 等）
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadDemoBatch}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#2C7CFF] px-3 py-1.5 text-xs font-medium text-[#2C7CFF] hover:bg-[#2C7CFF]/5 transition-colors cursor-pointer shadow-xs"
              >
                <span>一键载入示例批次并智能匹配</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================
           * 🌟 步骤 2：预览页面与手动调整表格
           * ============================================================ */
          <div className="space-y-4">
            {/* 状态统计与快捷操作栏 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-blue-100 bg-blue-50/30 px-3.5 py-2.5">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-slate-800">
                  待导入总数：<strong className="text-blue-600 font-bold">{previewRows.length}</strong> 条
                </span>
                <span className="text-slate-300">|</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="size-3.5" />
                  智能已匹配：{previewRows.filter((r) => r.matchStatus === 'auto').length} 条
                </span>
                <span className="text-slate-300">|</span>
                <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                  <Edit2 className="size-3.5" />
                  手动调整：{previewRows.filter((r) => r.matchStatus === 'manual').length} 条
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddPreviewRow}
                  className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Plus className="size-3" /> 添加一行
                </button>
                <button
                  type="button"
                  onClick={handleRerunAutoMatch}
                  className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <RefreshCw className="size-3" /> 重新执行匹配
                </button>
                <button
                  type="button"
                  onClick={() => setImportStep('upload')}
                  className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="size-3" /> 重新上传
                </button>
              </div>
            </div>

            {/* 44px 工业高密可编辑预览表格 */}
            <div className="rounded-lg border border-[#DBE6EE] bg-white overflow-hidden shadow-xs">
              <div className="max-h-[460px] overflow-y-auto overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[1020px]">
                  <thead className="sticky top-0 z-10 bg-slate-50 shadow-xs border-b border-[#DBE6EE]">
                    <tr className="text-slate-600 font-semibold h-[44px]">
                      <th className="px-3 py-2 w-10 text-center">#</th>
                      <th className="px-3 py-2 w-32">经营单位</th>
                      <th className="px-3 py-2 w-36">制造工厂</th>
                      <th className="px-3 py-2 w-48">型号</th>
                      <th className="px-3 py-2 w-36">产品大类</th>
                      <th className="px-3 py-2 w-24">大类编码</th>
                      <th className="px-3 py-2 w-44">产品中类</th>
                      <th className="px-3 py-2 w-28">中类编码</th>
                      <th className="px-3 py-2 w-28 text-center">匹配状态</th>
                      <th className="px-3 py-2 w-12 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DBE6EE]/60 text-slate-700">
                    {previewRows.map((row, idx) => {
                      const comp = COMPANY_FACTORY_MAP.find((c) => c.companyId === row.companyId) || COMPANY_FACTORY_MAP[0]
                      const subOptions = ERP_SUBCATEGORIES.filter(
                        (s) => s.majorCategoryCode === row.erpMajorCategoryCode
                      )
                      const availableSubs = subOptions.length > 0 ? subOptions : ERP_SUBCATEGORIES.filter((s) => s.industry === row.industry)

                      return (
                        <tr
                          key={row.tempId}
                          className={`h-[44px] transition-colors ${
                            row.matchStatus === 'manual' ? 'bg-blue-50/20' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          {/* 序号 */}
                          <td className="px-3 py-1 text-center font-mono text-slate-400 text-[11px]">
                            {idx + 1}
                          </td>

                          {/* 经营单位 */}
                          <td className="px-2 py-1">
                            <select
                              value={row.companyId}
                              onChange={(e) => handlePreviewCompanyChange(row.tempId, e.target.value)}
                              className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF]"
                            >
                              {COMPANY_FACTORY_MAP.map((c) => (
                                <option key={c.companyId} value={c.companyId}>
                                  {c.companyName}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* 制造工厂 */}
                          <td className="px-2 py-1">
                            <select
                              value={row.factoryId}
                              onChange={(e) => handlePreviewFactoryChange(row.tempId, e.target.value)}
                              className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 text-xs text-slate-700 outline-none focus:border-[#2C7CFF]"
                            >
                              {comp.factories.map((f) => (
                                <option key={f.factoryId} value={f.factoryId}>
                                  {f.factoryName}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* 订单型号 (可编辑，变更即时触发重匹配) */}
                          <td className="px-2 py-1">
                            <input
                              type="text"
                              value={row.orderModel}
                              onChange={(e) => handlePreviewModelChange(row.tempId, e.target.value)}
                              className="h-7 w-full rounded border border-slate-200 bg-white px-2 font-mono text-xs font-semibold text-slate-800 outline-none focus:border-[#2C7CFF]"
                            />
                          </td>

                          {/* ERP 产品大类 */}
                          <td className="px-2 py-1">
                            <select
                              value={row.erpMajorCategoryCode}
                              onChange={(e) => handlePreviewMajorCatChange(row.tempId, e.target.value)}
                              className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 text-xs font-medium text-slate-800 outline-none focus:border-[#2C7CFF]"
                            >
                              {ERP_MAJOR_CATEGORIES.map((m) => (
                                <option key={m.code} value={m.code}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* ERP 大类编码 */}
                          <td className="px-3 py-1 font-mono text-blue-600 text-xs">
                            {row.erpMajorCategoryCode}
                          </td>

                          {/* ERP 产品中类 (支持手动调整) */}
                          <td className="px-2 py-1">
                            <select
                              value={row.erpSubcategoryCode}
                              onChange={(e) => handlePreviewSubCatChange(row.tempId, e.target.value)}
                              className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 text-xs font-medium text-slate-800 outline-none focus:border-[#2C7CFF]"
                            >
                              {availableSubs.map((s) => (
                                <option key={s.code} value={s.code}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* ERP 种类编码 */}
                          <td className="px-3 py-1 font-mono text-indigo-600 text-xs">
                            {row.erpSubcategoryCode}
                          </td>

                          {/* 匹配状态 */}
                          <td className="px-2 py-1 text-center">
                            {row.matchStatus === 'auto' ? (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 border border-emerald-200 shrink-0">
                                <CheckCircle2 className="size-3" />
                                智能已匹配
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 border border-blue-200 shrink-0">
                                <Edit2 className="size-3" />
                                手动已调整
                              </span>
                            )}
                          </td>

                          {/* 操作 */}
                          <td className="px-2 py-1 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeletePreviewRow(row.tempId)}
                              title="删除此行"
                              className="rounded p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 底部保存按钮组 */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                核验完毕后点击右侧保存，系统将立即把 {previewRows.length} 条型号数据增加至数据列表中。
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveImport}
                  className="h-9 rounded-lg bg-[#2C7CFF] px-4 text-xs font-medium text-white hover:bg-[#1f6be8] shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>确认保存并导入至数据列表 ({previewRows.length} 条)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================
       * 🌟 新增 / 编辑型号弹窗 Modal (统一标题为 新增型号 / 编辑型号)
       * ============================================================ */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? '编辑产品型号' : '新增产品型号'}
        size="lg"
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          {/* 经营单位与制造工厂联动选择 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                经营单位 (二级单位) <span className="text-red-500">*</span>
              </label>
              <select
                value={formCompanyId}
                onChange={(e) => {
                  const compId = e.target.value
                  setFormCompanyId(compId)
                  const comp = COMPANY_FACTORY_MAP.find((c) => c.companyId === compId)
                  if (comp && comp.factories.length > 0) {
                    setFormFactoryId(comp.factories[0].factoryId)
                  }
                }}
                className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
              >
                {COMPANY_FACTORY_MAP.map((c) => (
                  <option key={c.companyId} value={c.companyId}>
                    {c.companyName} ({c.industry === 'transformer' ? '变压器' : '线缆'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                制造工厂 / 车间 (三级单位) <span className="text-red-500">*</span>
              </label>
              <select
                value={formFactoryId}
                onChange={(e) => setFormFactoryId(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
              >
                {selectedCompanyOption.factories.map((f) => (
                  <option key={f.factoryId} value={f.factoryId}>
                    {f.factoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 订单型号输入框 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              订单型号 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="例如：ODFPS-1000000/1000 或 YJV22-8.7/15kV-3×400"
              value={formOrderModel}
              onChange={(e) => handleTriggerAutoMatch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 font-mono text-xs text-slate-800 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            />
          </div>

          {/* 智能匹配提示 */}
          {autoMatchTip && (
            <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-3.5 py-2 text-xs text-blue-800">
              {autoMatchTip}
            </div>
          )}

          {/* 🌟 产品大类与大类编码 */}
          <div className="rounded-lg border border-blue-100 bg-blue-50/30 p-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  产品大类名称 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formMajorCatCode}
                  onChange={(e) => {
                    const code = e.target.value
                    const found = ERP_MAJOR_CATEGORIES.find((m) => m.code === code)
                    if (found) {
                      setFormMajorCatCode(found.code)
                      setFormMajorCatName(found.name)
                    }
                  }}
                  className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                >
                  {ERP_MAJOR_CATEGORIES.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.name} ({m.industry === 'transformer' ? '变压器' : '线缆'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">大类编码</label>
                <input
                  type="text"
                  value={formMajorCatCode}
                  onChange={(e) => setFormMajorCatCode(e.target.value)}
                  placeholder="如 1001 或 200104"
                  className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 font-mono text-xs text-slate-800 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                />
              </div>
            </div>
          </div>

          {/* 🌟 产品中类与中类编码 */}
          <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  产品中类名称 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formSubCode}
                  onChange={(e) => {
                    const code = e.target.value
                    const found = ERP_SUBCATEGORIES.find((s) => s.code === code)
                    if (found) {
                      setFormSubCode(found.code)
                      setFormSubName(found.name)
                      setFormUnit(found.unit)
                      setFormMajorCatCode(found.majorCategoryCode)
                      setFormMajorCatName(found.majorCategoryName)
                    }
                  }}
                  className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                >
                  {ERP_SUBCATEGORIES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.majorCategoryName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">中类编码</label>
                <input
                  type="text"
                  value={formSubCode}
                  onChange={(e) => setFormSubCode(e.target.value)}
                  placeholder="如 1001010701"
                  className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 font-mono text-xs text-slate-800 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
                />
              </div>
            </div>
          </div>

          {/* 计量单位与备注说明 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">计量单位</label>
              <input
                type="text"
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                placeholder="如 万kVA, km, 台, 吨"
                className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">备注说明</label>
              <input
                type="text"
                placeholder="如工程项目名、特殊订货合同编号等..."
                value={formRemark}
                onChange={(e) => setFormRemark(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
              />
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="h-9 rounded-lg bg-[#2C7CFF] px-4 text-xs font-medium text-white hover:bg-[#1f6be8] shadow-xs cursor-pointer"
            >
              保存型号
            </button>
          </div>
        </form>
      </Modal>

      {/* 型号关联底座指标详情 Modal */}
      <Modal
        open={isModelBasicDataModalOpen}
        onClose={() => setIsModelBasicDataModalOpen(false)}
        title={`【${selectedModelForBasicData?.orderModel || ''}】关联底座基础数据字典`}
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-slate-500">
              归属大类: <strong className="text-slate-800">{selectedModelForBasicData?.erpMajorCategoryName}</strong> ({selectedModelForBasicData?.erpMajorCategoryCode})
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModelBasicDataModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModelBasicDataModalOpen(false)
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
          <div className="rounded-lg bg-blue-50/50 p-3 border border-blue-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">制造实体：</span>
              <span className="font-semibold text-slate-800">{selectedModelForBasicData?.companyName} · {selectedModelForBasicData?.factoryName}</span>
            </div>
            <div>
              <span className="text-slate-500">产品中类：</span>
              <span className="font-medium text-slate-800">{selectedModelForBasicData?.erpSubcategoryName}</span>
            </div>
            <div>
              <span className="text-slate-500">计量单位：</span>
              <span className="font-mono text-emerald-700 font-bold">{selectedModelForBasicData?.unit}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            该订单生产型号在全域能耗对标、工序产量计量及产品碳足迹核算中绑定的底层数据字典：
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
                {selectedModelForBasicData &&
                  getBasicDataForModel(selectedModelForBasicData.orderModel).map((b, idx) => (
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
                            setIsModelBasicDataModalOpen(false)
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

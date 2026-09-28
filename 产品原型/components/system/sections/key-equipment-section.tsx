'use client'

import React, { useState, useMemo } from 'react'
import {
  Cpu,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Eye,
  Building2,
  Factory,
  Zap,
  Flame,
  Droplets,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  FileSpreadsheet,
  Sliders,
  Check,
} from 'lucide-react'
import { Modal } from '@/components/shared/modal'
import { cn } from '@/lib/utils'
import {
  type KeyEquipmentItem,
  ENERGY_CONSUMPTION_TYPES,
  ENTERPRISE_HIERARCHY,
  INITIAL_KEY_EQUIPMENT_LIST,
} from '@/lib/key-equipment-data'

export interface KeyEquipmentSectionProps {
  onNavigate?: (module: string, params?: Record<string, string>) => void
  initialParams?: Record<string, string>
}

export function KeyEquipmentSection({ onNavigate, initialParams }: KeyEquipmentSectionProps) {
  // 设备数据主列表状态
  const [equipmentList, setEquipmentList] = useState<KeyEquipmentItem[]>(INITIAL_KEY_EQUIPMENT_LIST)

  // 筛选状态
  const [filterCompany, setFilterCompany] = useState<string>(initialParams?.company || 'all')
  const [filterEnterprise, setFilterEnterprise] = useState<string>(initialParams?.enterprise || 'all')
  const [filterEnergyType, setFilterEnergyType] = useState<string>(initialParams?.energyType || 'all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSearch, setFilterSearch] = useState<string>(initialParams?.search || '')

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentEditItem, setCurrentEditItem] = useState<KeyEquipmentItem | null>(null)

  // 详情弹窗状态
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<KeyEquipmentItem | null>(null)

  // 删除确认弹窗状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<KeyEquipmentItem | null>(null)

  // 表单状态
  const [formCompany, setFormCompany] = useState<string>('沈变公司')
  const [formEnterprise, setFormEnterprise] = useState<string>('沈变本部')
  const [formWorkshop, setFormWorkshop] = useState<string>('')
  const [formName, setFormName] = useState<string>('')
  const [formEnergyTypes, setFormEnergyTypes] = useState<string[]>(['电力', '蒸汽'])
  const [formSpec, setFormSpec] = useState<string>('')
  const [formRatedPowerKW, setFormRatedPowerKW] = useState<number | string>(1000)
  const [formAnnualEnergyTce, setFormAnnualEnergyTce] = useState<number | string>(500)
  const [formStatus, setFormStatus] = useState<'启用' | '停用'>('启用')
  const [formInstallDate, setFormInstallDate] = useState<string>('2023-01')
  const [formManufacturer, setFormManufacturer] = useState<string>('')
  const [formResponsiblePerson, setFormResponsiblePerson] = useState<string>('')
  const [formContactPhone, setFormContactPhone] = useState<string>('')
  const [formDescription, setFormDescription] = useState<string>('')
  const [formError, setFormError] = useState<string>('')

  // 级联获取当前选中经营单位对应的生产企业列表
  const currentEnterpriseOptions = useMemo(() => {
    const found = ENTERPRISE_HIERARCHY.find((c) => c.company === formCompany)
    return found ? found.enterprises : []
  }, [formCompany])

  // 过滤后的数据集
  const filteredList = useMemo(() => {
    return equipmentList.filter((item) => {
      // 1. 公司过滤
      if (filterCompany !== 'all' && item.company !== filterCompany) return false
      // 2. 企业过滤
      if (filterEnterprise !== 'all' && item.enterprise !== filterEnterprise) return false
      // 3. 能源消耗类型过滤 (包含该介质)
      if (filterEnergyType !== 'all' && !item.energyTypes.includes(filterEnergyType)) return false
      // 4. 状态过滤
      if (filterStatus !== 'all' && item.status !== filterStatus) return false
      // 5. 模糊搜索 (编码、名称、车间、责任人)
      if (filterSearch.trim()) {
        const kw = filterSearch.trim().toLowerCase()
        const matchCode = item.code.toLowerCase().includes(kw)
        const matchName = item.name.toLowerCase().includes(kw)
        const matchWorkshop = item.workshop.toLowerCase().includes(kw)
        const matchResp = item.responsiblePerson.toLowerCase().includes(kw)
        if (!matchCode && !matchName && !matchWorkshop && !matchResp) return false
      }
      return true
    })
  }, [equipmentList, filterCompany, filterEnterprise, filterEnergyType, filterStatus, filterSearch])

  // KPI 统计数据
  const stats = useMemo(() => {
    const total = equipmentList.length
    const enabled = equipmentList.filter((e) => e.status === '启用').length
    const disabled = equipmentList.filter((e) => e.status === '停用').length
    const totalPower = equipmentList.reduce((acc, cur) => acc + (cur.ratedPowerKW || 0), 0)
    const enterprisesCount = new Set(equipmentList.map((e) => e.enterprise)).size
    return { total, enabled, disabled, totalPower, enterprisesCount }
  }, [equipmentList])

  // 重置筛选
  function handleResetFilters() {
    setFilterCompany('all')
    setFilterEnterprise('all')
    setFilterEnergyType('all')
    setFilterStatus('all')
    setFilterSearch('')
  }

  // 打开新增弹窗
  function handleOpenCreateModal() {
    setModalMode('create')
    setCurrentEditItem(null)
    setFormCompany('沈变公司')
    setFormEnterprise('沈变本部')
    setFormWorkshop('')
    setFormName('')
    setFormEnergyTypes(['电力', '蒸汽'])
    setFormSpec('')
    setFormRatedPowerKW(2000)
    setFormAnnualEnergyTce(1200)
    setFormStatus('启用')
    setFormInstallDate('2023-06')
    setFormManufacturer('特变电工装备制造中心')
    setFormResponsiblePerson('')
    setFormContactPhone('')
    setFormDescription('')
    setFormError('')
    setIsModalOpen(true)
  }

  // 打开编辑弹窗
  function handleOpenEditModal(item: KeyEquipmentItem) {
    setModalMode('edit')
    setCurrentEditItem(item)
    setFormCompany(item.company)
    setFormEnterprise(item.enterprise)
    setFormWorkshop(item.workshop)
    setFormName(item.name)
    setFormEnergyTypes([...item.energyTypes])
    setFormSpec(item.spec)
    setFormRatedPowerKW(item.ratedPowerKW)
    setFormAnnualEnergyTce(item.annualEnergyTce)
    setFormStatus(item.status)
    setFormInstallDate(item.installDate)
    setFormManufacturer(item.manufacturer)
    setFormResponsiblePerson(item.responsiblePerson)
    setFormContactPhone(item.contactPhone)
    setFormDescription(item.description || '')
    setFormError('')
    setIsModalOpen(true)
  }

  // 打开详情弹窗
  function handleOpenDetail(item: KeyEquipmentItem) {
    setDetailItem(item)
    setIsDetailModalOpen(true)
  }

  // 打开删除确认
  function handleOpenDelete(item: KeyEquipmentItem) {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  // 执行删除
  function handleConfirmDelete() {
    if (!itemToDelete) return
    setEquipmentList((prev) => prev.filter((item) => item.id !== itemToDelete.id))
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
  }

  // 切换能源消耗类型勾选
  function handleToggleEnergyType(name: string) {
    setFormEnergyTypes((prev) => {
      if (prev.includes(name)) {
        if (prev.length === 1) return prev // 至少保留一种
        return prev.filter((e) => e !== name)
      } else {
        return [...prev, name]
      }
    })
  }

  // 保存新增/编辑表单
  function handleSaveForm(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) {
      setFormError('请输入设备名称！')
      return
    }
    if (formEnergyTypes.length === 0) {
      setFormError('请至少选择一种设备能源消耗类型！')
      return
    }

    const payload: KeyEquipmentItem = {
      id: currentEditItem ? currentEditItem.id : `eq-custom-${Date.now()}`,
      code: currentEditItem?.code || `EQ-${Date.now().toString().slice(-6)}`,
      name: formName.trim(),
      company: formCompany,
      enterprise: formEnterprise,
      workshop: formWorkshop.trim() || '主厂区核心车间',
      energyTypes: formEnergyTypes,
      spec: formSpec.trim() || '标准工业规格',
      ratedPowerKW: Number(formRatedPowerKW) || 0,
      annualEnergyTce: Number(formAnnualEnergyTce) || 0,
      status: formStatus,
      installDate: formInstallDate,
      manufacturer: formManufacturer.trim() || '特变电工定制装备',
      responsiblePerson: formResponsiblePerson.trim() || '设备管理工程师',
      contactPhone: formContactPhone.trim() || '024-88998800',
      description: formDescription.trim(),
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    if (modalMode === 'create') {
      setEquipmentList((prev) => [payload, ...prev])
    } else {
      setEquipmentList((prev) => prev.map((item) => (item.id === payload.id ? payload : item)))
    }

    setIsModalOpen(false)
  }

  // 导出
  function handleExport() {
    alert(`正在导出【重点用能设备清单】(共 ${filteredList.length} 台设备，Excel 格式)...`)
  }

  return (
    <div className="space-y-6">
      {/* 🌟 1. 顶部操作区 */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-[#2C7CFF]">
            <Cpu className="size-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">重点用能设备</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 h-[36px] rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="size-4" />
            <span>新增重点设备</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-1.5 w-[80px] h-[36px] rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            title="导出当前筛选设备列表"
          >
            <Download className="size-3.5 text-white" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 🌟 2. 筛选控制栏 (完全遵循 36px 标准高度与 200px 宽度) */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 经营单位/企业联动 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">关联企业:</span>
            <select
              value={filterCompany}
              onChange={(e) => {
                setFilterCompany(e.target.value)
                setFilterEnterprise('all')
              }}
              className="h-[36px] w-[150px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#2C7CFF] cursor-pointer"
            >
              <option value="all">全部经营单位</option>
              {ENTERPRISE_HIERARCHY.map((c) => (
                <option key={c.company} value={c.company}>
                  {c.company}
                </option>
              ))}
            </select>

            <select
              value={filterEnterprise}
              onChange={(e) => setFilterEnterprise(e.target.value)}
              className="h-[36px] w-[150px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#2C7CFF] cursor-pointer"
            >
              <option value="all">全部生产企业</option>
              {(filterCompany === 'all'
                ? ENTERPRISE_HIERARCHY.flatMap((c) => c.enterprises)
                : ENTERPRISE_HIERARCHY.find((c) => c.company === filterCompany)?.enterprises || []
              ).map((ent) => (
                <option key={ent.name} value={ent.name}>
                  {ent.name}
                </option>
              ))}
            </select>
          </div>

          {/* 能源消耗类型筛选 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">能源消耗类型:</span>
            <select
              value={filterEnergyType}
              onChange={(e) => setFilterEnergyType(e.target.value)}
              className="h-[36px] w-[140px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#2C7CFF] cursor-pointer"
            >
              <option value="all">全部消耗介质</option>
              {ENERGY_CONSUMPTION_TYPES.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* 状态筛选 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">状态:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-[36px] w-[110px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#2C7CFF] cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="启用">启用</option>
              <option value="停用">停用</option>
            </select>
          </div>
        </div>

        {/* 搜索框与重置 */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="输入设备名称、车间工段..."
              className="h-[36px] w-[220px] pl-8 pr-7 bg-white border border-[#E2E8F0] rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#2C7CFF] transition-colors"
            />
            <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            {filterSearch && (
              <button
                type="button"
                onClick={() => setFilterSearch('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {(filterCompany !== 'all' ||
            filterEnterprise !== 'all' ||
            filterEnergyType !== 'all' ||
            filterStatus !== 'all' ||
            filterSearch) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-[36px] px-3 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="重置所有筛选"
            >
              <RotateCcw className="size-3" />
              <span>重置</span>
            </button>
          )}
        </div>
      </div>

      {/* 🌟 3. 数据表格容器 (强制执行 44px 行高规范，无主观定性评价) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-fixed min-w-[1180px] w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 h-[44px]">
                <th className="w-[4%] px-3 text-center">#</th>
                <th className="w-[28%] px-3">重点用能设备名称</th>
                <th className="w-[16%] px-3">关联企业</th>
                <th className="w-[16%] px-3">安装位置 / 车间</th>
                <th className="w-[18%] px-3">设备能源消耗类型</th>
                <th className="w-[9%] px-3 text-right">额定功率</th>
                <th className="w-[9%] px-3 text-center">状态</th>
                <th className="w-[8%] px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="h-[120px] text-center text-slate-400 font-sans">
                    暂无符合条件的重点用能设备数据
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="h-[44px] hover:bg-blue-50/40 transition-colors group"
                  >
                    {/* 序号 */}
                    <td className="px-3 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>

                    {/* 设备名称 */}
                    <td className="px-3">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className="font-bold text-slate-900 truncate" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                    </td>

                    {/* 关联企业 */}
                    <td className="px-3 truncate">
                      <div className="flex items-center gap-1 text-[11px] truncate">
                        <span className="text-slate-500 font-medium">{item.company}</span>
                        <span className="text-slate-300">/</span>
                        <span className="font-bold text-slate-800">{item.enterprise}</span>
                      </div>
                    </td>

                    {/* 安装位置 */}
                    <td className="px-3 text-slate-600 truncate" title={item.workshop}>
                      {item.workshop}
                    </td>

                    {/* 设备能源消耗类型 (色彩规范匹配) */}
                    <td className="px-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {item.energyTypes.map((t) => {
                          const meta = ENERGY_CONSUMPTION_TYPES.find((m) => m.name === t)
                          const color = meta ? meta.color : '#2C7CFF'
                          const bg = meta ? meta.bgLight : '#eff6ff'
                          const border = meta ? meta.borderLight : '#bfdbfe'
                          return (
                            <span
                              key={t}
                              className="inline-flex items-center px-1.5 py-0.2 rounded text-[10.5px] font-mono font-medium"
                              style={{ backgroundColor: bg, borderColor: border, color: color, borderWidth: 1 }}
                            >
                              {t}
                            </span>
                          )
                        })}
                      </div>
                    </td>

                    {/* 额定功率 */}
                    <td className="px-3 text-right font-mono font-bold text-slate-800">
                      {item.ratedPowerKW.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">kW</span>
                    </td>

                    {/* 状态 (客观自解释) */}
                    <td className="px-3 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-sans',
                          item.status === '启用'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        )}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* 操作列 */}
                    <td className="px-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(item)}
                          className="text-[#2C7CFF] hover:text-blue-700 font-medium cursor-pointer"
                          title="查看设备详情与档案"
                        >
                          详情
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="text-slate-600 hover:text-[#2C7CFF] font-medium cursor-pointer"
                          title="编辑设备信息"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(item)}
                          className="text-slate-400 hover:text-rose-600 font-medium cursor-pointer"
                          title="删除设备"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 底部记录数统计 */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
          <div>
            共纳管重点设备 <span className="font-bold font-mono text-slate-800">{equipmentList.length}</span> 台，当前筛选显示{' '}
            <span className="font-bold font-mono text-blue-600">{filteredList.length}</span> 台
          </div>
          <div className="text-[11px] text-slate-400">
            重点用能设备能耗实时遥测可前往【集中监管 / 重点用能设备】进行工况监控
          </div>
        </div>
      </div>

      {/* 🌟 4. 新增 / 编辑设备模态框 (KeyEquipmentModal) */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="2xl"
        title={modalMode === 'create' ? '新增重点用能设备' : '编辑重点用能设备信息'}
      >
        <form onSubmit={handleSaveForm} className="space-y-4 text-xs font-sans">
          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5 font-medium">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. 关联企业选择 (重点落实要求) */}
          <div className="p-3.5 rounded-lg bg-blue-50/40 border border-blue-100 space-y-2.5">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-[#2C7CFF]" />
              <span>关联归属企业与车间</span>
              <span className="text-[11px] font-normal text-blue-600">(*)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">
                  经营单位:
                </label>
                <select
                  value={formCompany}
                  onChange={(e) => {
                    const c = e.target.value
                    setFormCompany(c)
                    const found = ENTERPRISE_HIERARCHY.find((item) => item.company === c)
                    if (found && found.enterprises.length > 0) {
                      setFormEnterprise(found.enterprises[0].name)
                    }
                  }}
                  className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
                >
                  {ENTERPRISE_HIERARCHY.map((c) => (
                    <option key={c.company} value={c.company}>
                      {c.company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">
                  生产企业 / 基地:
                </label>
                <select
                  value={formEnterprise}
                  onChange={(e) => setFormEnterprise(e.target.value)}
                  className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
                >
                  {currentEnterpriseOptions.map((ent) => (
                    <option key={ent.name} value={ent.name}>
                      {ent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                安装物理位置 / 车间工段:
              </label>
              <input
                type="text"
                value={formWorkshop}
                onChange={(e) => setFormWorkshop(e.target.value)}
                placeholder="例如：特高压一车间 (真空注油跨)、500kV超高压立塔交联跨..."
                className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>
          </div>

          {/* 2. 设备名称 */}
          <div>
            <label className="block text-[11px] text-slate-600 font-medium mb-1">
              设备名称 (*):
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="例如：1# 1000kV级气相白真空干燥罐组"
              className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
            />
          </div>

          {/* 3. 设备能源消耗类型 */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div>
              <label className="block text-[11px] text-slate-700 font-bold mb-1.5 flex items-center justify-between">
                <span>设备能源消耗类型 (*) [可多选]:</span>
                <span className="text-[10.5px] font-normal text-slate-500">已选择 {formEnergyTypes.length} 项介质</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ENERGY_CONSUMPTION_TYPES.map((m) => {
                  const isChecked = formEnergyTypes.includes(m.name)
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => handleToggleEnergyType(m.name)}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all text-left cursor-pointer',
                        isChecked
                          ? 'border-[#2C7CFF] bg-blue-50/80 text-blue-900 shadow-2xs font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      )}
                    >
                      <div
                        className={cn(
                          'size-4 rounded flex items-center justify-center border shrink-0',
                          isChecked ? 'bg-[#2C7CFF] border-[#2C7CFF] text-white' : 'border-slate-300 bg-white'
                        )}
                      >
                        {isChecked && <Check className="size-3 text-white" />}
                      </div>
                      <span className="flex-1 truncate">{m.name}</span>
                      <span
                        className="size-2 rounded-full shrink-0"
                        style={{ backgroundColor: m.color }}
                        title={`${m.name} 标准介质标识色`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 4. 规格型号与额定能耗参数 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                规格型号:
              </label>
              <input
                type="text"
                value={formSpec}
                onChange={(e) => setFormSpec(e.target.value)}
                placeholder="例如：VF-1000/120"
                className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                额定功率 (kW):
              </label>
              <input
                type="number"
                value={formRatedPowerKW}
                onChange={(e) => setFormRatedPowerKW(e.target.value)}
                placeholder="例如：4680"
                className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                状态:
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as '启用' | '停用')}
                className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              >
                <option value="启用">启用</option>
                <option value="停用">停用</option>
              </select>
            </div>
          </div>

          {/* 5. 制造厂商与责任人 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                投运年月:
              </label>
              <input
                type="month"
                value={formInstallDate}
                onChange={(e) => setFormInstallDate(e.target.value)}
                className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                责任工程师:
              </label>
              <input
                type="text"
                value={formResponsiblePerson}
                onChange={(e) => setFormResponsiblePerson(e.target.value)}
                placeholder="例如：张立国"
                className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                联系电话:
              </label>
              <input
                type="text"
                value={formContactPhone}
                onChange={(e) => setFormContactPhone(e.target.value)}
                placeholder="例如：138-4011-8892"
                className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 font-medium mb-1">
              设备工艺说明与工况描述:
            </label>
            <textarea
              rows={2}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="简述该设备主要工序环节、耗能关键特征、主要热媒与监控量测点位..."
              className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
            />
          </div>

          {/* 按钮组 */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 h-[36px] rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 h-[36px] rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              {modalMode === 'create' ? '确认新增设备' : '保存修改'}
            </button>
          </div>
        </form>
      </Modal>

      {/* 🌟 5. 设备档案详情模态框 (EquipmentDetailModal) */}
      <Modal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        size="2xl"
        title="重点用能设备档案详情"
        description={detailItem ? detailItem.name : ''}
      >
        {detailItem && (
          <div className="space-y-4 text-xs font-sans">
            {/* 顶栏信息卡 */}
            <div className="p-3.5 rounded-lg bg-blue-50/40 border border-blue-100 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{detailItem.name}</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10.5px] font-bold',
                      detailItem.status === '启用'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    )}
                  >
                    {detailItem.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  投运时间：<strong className="font-mono text-slate-700">{detailItem.installDate}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false)
                  handleOpenEditModal(detailItem)
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 text-xs font-medium text-[#2C7CFF] cursor-pointer"
              >
                <Edit2 className="size-3.5" />
                <span>编辑档案</span>
              </button>
            </div>

            {/* 核心两列参数网格 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 space-y-2 bg-slate-50/50">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Building2 className="size-3.5 text-slate-500" />
                  <span>关联企业与空间</span>
                </div>
                <div className="space-y-1.5 text-slate-600 text-[11px]">
                  <div>经营单位：<strong className="text-slate-800 font-medium">{detailItem.company}</strong></div>
                  <div>生产基地：<strong className="text-slate-800 font-medium">{detailItem.enterprise}</strong></div>
                  <div>安装工段：<strong className="text-slate-800 font-medium">{detailItem.workshop}</strong></div>
                  <div>制造厂商：<strong className="text-slate-800 font-medium">{detailItem.manufacturer}</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 space-y-2 bg-slate-50/50">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Zap className="size-3.5 text-amber-500" />
                  <span>能耗与技术规格</span>
                </div>
                <div className="space-y-1.5 text-slate-600 text-[11px]">
                  <div>规格型号：<strong className="text-slate-800 font-mono font-medium">{detailItem.spec}</strong></div>
                  <div>额定功率：<strong className="text-slate-800 font-mono font-bold">{detailItem.ratedPowerKW.toLocaleString()} kW</strong></div>
                  <div>年预估能耗：<strong className="text-slate-800 font-mono">{detailItem.annualEnergyTce.toLocaleString()} tce/年</strong></div>
                  <div>投运年月：<strong className="text-slate-800 font-mono font-medium">{detailItem.installDate}</strong></div>
                </div>
              </div>
            </div>

            {/* 能源消耗类型专区 */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Flame className="size-3.5 text-[#FF6536]" />
                <span>设备能源消耗类型与介质分配</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {detailItem.energyTypes.map((t) => {
                  const meta = ENERGY_CONSUMPTION_TYPES.find((m) => m.name === t)
                  return (
                    <div
                      key={t}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium"
                      style={{
                        backgroundColor: meta?.bgLight || '#eff6ff',
                        borderColor: meta?.borderLight || '#bfdbfe',
                        color: meta?.color || '#2C7CFF',
                      }}
                    >
                      <span className="size-2 rounded-full" style={{ backgroundColor: meta?.color }} />
                      <span className="font-bold">{t}</span>
                      <span className="text-[10px] opacity-75 font-mono">({meta?.unit})</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 管理责任人 */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/40 flex items-center justify-between text-slate-600 text-[11px]">
              <div>
                管理责任人：<strong className="text-slate-800 font-medium">{detailItem.responsiblePerson}</strong>
              </div>
              <div>
                联系电话：<strong className="text-slate-800 font-mono font-medium">{detailItem.contactPhone}</strong>
              </div>
            </div>

            {detailItem.description && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                <span className="font-bold text-slate-700">工艺工况说明：</span>
                {detailItem.description}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 h-[36px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 🌟 6. 删除确认模态框 */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        size="md"
        title="确认删除重点用能设备"
        description="此操作将物理移除该设备的台账档案，已绑定在线监测的时序点位将暂停采集"
      >
        <div className="space-y-4 text-xs font-sans">
          {itemToDelete && (
            <div className="p-3 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-800 space-y-1">
              <div className="font-bold">您确定要删除以下设备吗？</div>
              <div className="font-bold text-sm text-slate-900">{itemToDelete.name}</div>
              <div className="text-[11px] text-slate-500">归属企业：{itemToDelete.company} - {itemToDelete.enterprise}</div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 h-[36px] rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 h-[36px] rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              确认删除
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

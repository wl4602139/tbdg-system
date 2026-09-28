'use client'

import React, { useState, useMemo } from 'react'
import {
  Sun,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Eye,
  Building2,
  Factory,
  Zap,
  RotateCcw,
  X,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Calendar,
  Phone,
  User,
} from 'lucide-react'
import { Modal } from '@/components/shared/modal'
import { cn } from '@/lib/utils'
import {
  type PvEquipmentItem,
  PARK_FACTORY_HIERARCHY,
  INITIAL_PV_EQUIPMENT_LIST,
} from '@/lib/pv-equipment-data'

export interface PvEquipmentSectionProps {
  onNavigate?: (module: string, params?: Record<string, string>) => void
  initialParams?: Record<string, string>
}

export function PvEquipmentSection({ onNavigate, initialParams }: PvEquipmentSectionProps) {
  // 光伏设备主数据列表状态
  const [equipmentList, setEquipmentList] = useState<PvEquipmentItem[]>(INITIAL_PV_EQUIPMENT_LIST)

  // 筛选控制状态
  const [filterPark, setFilterPark] = useState<string>(initialParams?.park || 'all')
  const [filterFactory, setFilterFactory] = useState<string>(initialParams?.factory || 'all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSearch, setFilterSearch] = useState<string>(initialParams?.search || '')

  // 模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentEditItem, setCurrentEditItem] = useState<PvEquipmentItem | null>(null)

  // 详情弹窗状态
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<PvEquipmentItem | null>(null)

  // 删除确认弹窗状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<PvEquipmentItem | null>(null)

  // 表单状态 (纯粹基础信息)
  const [formPark, setFormPark] = useState<string>('特变电工东北输变电产业园')
  const [formFactory, setFormFactory] = useState<string>('沈变本部')
  const [formName, setFormName] = useState<string>('')
  const [formLocation, setFormLocation] = useState<string>('')
  const [formCapacityKW, setFormCapacityKW] = useState<number | string>(1200)
  const [formCommissionDate, setFormCommissionDate] = useState<string>('2023-01')
  const [formStatus, setFormStatus] = useState<'启用' | '停用'>('启用')
  const [formResponsiblePerson, setFormResponsiblePerson] = useState<string>('')
  const [formContactPhone, setFormContactPhone] = useState<string>('')
  const [formDescription, setFormDescription] = useState<string>('')
  const [formError, setFormError] = useState<string>('')

  // 当前所选园区对应的工厂选项列表
  const currentParkFactoryOptions = useMemo(() => {
    const found = PARK_FACTORY_HIERARCHY.find((p) => p.park === formPark)
    return found ? found.factories : []
  }, [formPark])

  // 筛选栏当前可用工厂列表
  const filterFactoryOptions = useMemo(() => {
    if (filterPark === 'all') {
      const allFactories = Array.from(new Set(PARK_FACTORY_HIERARCHY.flatMap((p) => p.factories)))
      return allFactories
    }
    const found = PARK_FACTORY_HIERARCHY.find((p) => p.park === filterPark)
    return found ? found.factories : []
  }, [filterPark])

  // 过滤后的数据集
  const filteredList = useMemo(() => {
    return equipmentList.filter((item) => {
      // 1. 园区过滤
      if (filterPark !== 'all' && item.park !== filterPark) return false
      // 2. 工厂过滤 (支持全部、特定工厂、以及仅园区直辖未关联工厂)
      if (filterFactory !== 'all') {
        if (filterFactory === 'only_park') {
          if (item.factory) return false
        } else if (item.factory !== filterFactory) {
          return false
        }
      }
      // 3. 状态过滤 (启用/停用)
      if (filterStatus !== 'all' && item.status !== filterStatus) return false
      // 4. 关键词模糊搜索 (设备名称、安装物理位置、责任人)
      if (filterSearch.trim()) {
        const kw = filterSearch.trim().toLowerCase()
        const matchName = item.name.toLowerCase().includes(kw)
        const matchLoc = item.location.toLowerCase().includes(kw)
        const matchResp = item.responsiblePerson.toLowerCase().includes(kw)
        if (!matchName && !matchLoc && !matchResp) return false
      }
      return true
    })
  }, [equipmentList, filterPark, filterFactory, filterStatus, filterSearch])

  // 重置筛选
  function handleResetFilters() {
    setFilterPark('all')
    setFilterFactory('all')
    setFilterStatus('all')
    setFilterSearch('')
  }

  // 打开新增弹窗
  function handleOpenCreateModal() {
    setModalMode('create')
    setCurrentEditItem(null)
    setFormPark('特变电工东北输变电产业园')
    setFormFactory('沈变本部')
    setFormName('')
    setFormLocation('')
    setFormCapacityKW(1200)
    setFormCommissionDate('2023-01')
    setFormStatus('启用')
    setFormResponsiblePerson('')
    setFormContactPhone('')
    setFormDescription('')
    setFormError('')
    setIsModalOpen(true)
  }

  // 打开编辑弹窗
  function handleOpenEditModal(item: PvEquipmentItem) {
    setModalMode('edit')
    setCurrentEditItem(item)
    setFormPark(item.park)
    setFormFactory(item.factory || '')
    setFormName(item.name)
    setFormLocation(item.location)
    setFormCapacityKW(item.capacityKW)
    setFormCommissionDate(item.commissionDate)
    setFormStatus(item.status)
    setFormResponsiblePerson(item.responsiblePerson)
    setFormContactPhone(item.contactPhone)
    setFormDescription(item.description || '')
    setFormError('')
    setIsModalOpen(true)
  }

  // 打开详情弹窗
  function handleOpenDetail(item: PvEquipmentItem) {
    setDetailItem(item)
    setIsDetailModalOpen(true)
  }

  // 打开删除确认弹窗
  function handleOpenDelete(item: PvEquipmentItem) {
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

  // 保存新增/编辑表单
  function handleSaveForm(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) {
      setFormError('请输入光伏设备/电站名称！')
      return
    }
    if (!formPark) {
      setFormError('请选择设备归属的产业园区！')
      return
    }
    if (!formCapacityKW || Number(formCapacityKW) <= 0) {
      setFormError('请输入有效的光伏装机容量 (kWp)！')
      return
    }

    const payload: PvEquipmentItem = {
      id: currentEditItem ? currentEditItem.id : `pv-custom-${Date.now()}`,
      name: formName.trim(),
      park: formPark,
      factory: formFactory.trim() ? formFactory.trim() : null, // 空串代表园区直辖公用资产
      location: formLocation.trim() || '园区核心屋面区域',
      capacityKW: Number(formCapacityKW) || 0,
      commissionDate: formCommissionDate || '2023-01',
      status: formStatus,
      responsiblePerson: formResponsiblePerson.trim() || '光伏运维工程师',
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
    alert(`正在导出【光伏设备台账清单】(共 ${filteredList.length} 项设备，Excel 格式)...`)
  }

  return (
    <div className="space-y-6">
      {/* 🌟 1. 顶部操作区 (纯粹极简，无副文本描述) */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 border border-amber-200 text-amber-500">
            <Sun className="size-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">光伏设备管理</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 h-[36px] rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="size-4" />
            <span>新增光伏设备</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-1.5 w-[80px] h-[36px] rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            title="导出当前筛选光伏设备列表"
          >
            <Download className="size-3.5 text-white" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 🌟 2. 筛选控制栏 (标准 36px 高度) */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 归属园区筛选 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">归属园区:</span>
            <select
              value={filterPark}
              onChange={(e) => {
                setFilterPark(e.target.value)
                setFilterFactory('all')
              }}
              className="h-[36px] w-[180px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#2C7CFF] cursor-pointer"
            >
              <option value="all">全部产业园区</option>
              {PARK_FACTORY_HIERARCHY.map((p) => (
                <option key={p.park} value={p.park}>
                  {p.park}
                </option>
              ))}
            </select>
          </div>

          {/* 关联工厂筛选 (含全部与园区直辖) */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">关联工厂:</span>
            <select
              value={filterFactory}
              onChange={(e) => setFilterFactory(e.target.value)}
              className="h-[36px] w-[180px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#2C7CFF] cursor-pointer"
            >
              <option value="all">全部生产工厂 / 实体</option>
              <option value="only_park">仅园区直辖 (未关联工厂)</option>
              {filterFactoryOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
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
              placeholder="输入光伏设备名称、安装位置..."
              className="h-[36px] w-[230px] pl-8 pr-7 bg-white border border-[#E2E8F0] rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#2C7CFF] transition-colors"
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

          {(filterPark !== 'all' ||
            filterFactory !== 'all' ||
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

      {/* 🌟 3. 数据表格容器 (强制执行 44px 行高规范，客观自解释) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-fixed min-w-[1100px] w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 h-[44px]">
                <th className="w-[4%] px-3 text-center">#</th>
                <th className="w-[26%] px-3">光伏设备名称</th>
                <th className="w-[17%] px-3">归属园区</th>
                <th className="w-[16%] px-3">关联工厂</th>
                <th className="w-[15%] px-3">安装物理位置 / 屋面</th>
                <th className="w-[10%] px-3 text-right">装机容量</th>
                <th className="w-[6%] px-3 text-center">状态</th>
                <th className="w-[8%] px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="h-[120px] text-center text-slate-400 font-sans">
                    暂无符合条件的光伏设备数据
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

                    {/* 归属园区 */}
                    <td className="px-3 text-slate-700 truncate" title={item.park}>
                      {item.park}
                    </td>

                    {/* 关联工厂 (非必选，无工厂时显示园区直辖中性标签) */}
                    <td className="px-3 truncate">
                      {item.factory ? (
                        <div className="flex items-center gap-1 text-[11px] truncate">
                          <Factory className="size-3 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-800 truncate" title={item.factory}>
                            {item.factory}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          园区直辖 (公用)
                        </span>
                      )}
                    </td>

                    {/* 安装物理位置 */}
                    <td className="px-3 text-slate-600 truncate" title={item.location}>
                      {item.location}
                    </td>

                    {/* 装机容量 */}
                    <td className="px-3 text-right font-mono font-bold text-amber-600">
                      {item.capacityKW.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">kWp</span>
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
                          title="查看设备详情"
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

        {/* 底部统计栏 */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
          <div>
            共纳管光伏设备 <span className="font-bold font-mono text-slate-800">{equipmentList.length}</span> 项，当前筛选显示{' '}
            <span className="font-bold font-mono text-blue-600">{filteredList.length}</span> 项
          </div>
          <div className="text-[11px] text-slate-400">
            光伏发电设备实时发电遥测与消纳台账可前往【集中监管 / 工业微电网监测】查看
          </div>
        </div>
      </div>

      {/* 🌟 4. 新增 / 编辑光伏设备模态框 (PvEquipmentModal) */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="2xl"
        title={modalMode === 'create' ? '新增光伏设备' : '编辑光伏设备信息'}
      >
        <form onSubmit={handleSaveForm} className="space-y-4 text-xs font-sans">
          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5 font-medium">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. 归属园区与关联工厂 (核心要求：园区必填，工厂非必选) */}
          <div className="p-3.5 rounded-lg bg-blue-50/40 border border-blue-100 space-y-2.5">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-[#2C7CFF]" />
              <span>园区归属与下级工厂关联</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">
                  归属园区 (*):
                </label>
                <select
                  value={formPark}
                  onChange={(e) => {
                    const p = e.target.value
                    setFormPark(p)
                    const found = PARK_FACTORY_HIERARCHY.find((item) => item.park === p)
                    if (found && found.factories.length > 0) {
                      setFormFactory(found.factories[0])
                    } else {
                      setFormFactory('')
                    }
                  }}
                  className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
                >
                  {PARK_FACTORY_HIERARCHY.map((p) => (
                    <option key={p.park} value={p.park}>
                      {p.park}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1 flex items-center justify-between">
                  <span>关联下级工厂:</span>
                  <span className="text-[10px] text-slate-400 font-normal">非必选 (支持园区直辖)</span>
                </label>
                <select
                  value={formFactory}
                  onChange={(e) => setFormFactory(e.target.value)}
                  className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
                >
                  <option value="">[ 暂不关联工厂 (园区直辖/公用资产) ]</option>
                  {currentParkFactoryOptions.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. 光伏设备名称 */}
          <div>
            <label className="block text-[11px] text-slate-600 font-medium mb-1">
              光伏设备/电站名称 (*):
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="例如：沈变厂区 12.8MWp 屋顶分布式光伏一期、园区动力站屋面光伏..."
              className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
            />
          </div>

          {/* 3. 安装物理位置 */}
          <div>
            <label className="block text-[11px] text-slate-600 font-medium mb-1">
              安装物理位置 / 屋面区域:
            </label>
            <input
              type="text"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              placeholder="例如：特高压一车间及二车间金属彩钢瓦屋面、综合楼楼顶、公共车棚A区..."
              className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
            />
          </div>

          {/* 4. 装机容量与运行参数 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                装机容量 (kWp) (*):
              </label>
              <input
                type="number"
                value={formCapacityKW}
                onChange={(e) => setFormCapacityKW(e.target.value)}
                placeholder="例如：12800"
                className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                并网投运年月:
              </label>
              <input
                type="month"
                value={formCommissionDate}
                onChange={(e) => setFormCommissionDate(e.target.value)}
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

          {/* 5. 运维管理责任人 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                管理责任人:
              </label>
              <input
                type="text"
                value={formResponsiblePerson}
                onChange={(e) => setFormResponsiblePerson(e.target.value)}
                placeholder="例如：关志鹏"
                className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                运维联系电话:
              </label>
              <input
                type="text"
                value={formContactPhone}
                onChange={(e) => setFormContactPhone(e.target.value)}
                placeholder="例如：138-4012-9981"
                className="w-full h-[36px] px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
              />
            </div>
          </div>

          {/* 6. 设备备注说明 */}
          <div>
            <label className="block text-[11px] text-slate-600 font-medium mb-1">
              设备备注说明:
            </label>
            <textarea
              rows={2}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="简述该光伏发电设备的并网点位、发电消纳特性或维护工况..."
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

      {/* 🌟 5. 设备详情模态框 (PvEquipmentDetailModal) */}
      <Modal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        size="2xl"
        title="光伏设备档案详情"
        description={detailItem ? detailItem.name : ''}
      >
        {detailItem && (
          <div className="space-y-4 text-xs font-sans">
            {/* 顶栏卡片 */}
            <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200/60 flex items-center justify-between gap-3">
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
                  投运年月：<strong className="font-mono text-slate-700">{detailItem.commissionDate}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false)
                  handleOpenEditModal(detailItem)
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 text-xs font-medium text-amber-700 cursor-pointer"
              >
                <Edit2 className="size-3.5" />
                <span>编辑档案</span>
              </button>
            </div>

            {/* 两列参数网格 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 space-y-2 bg-slate-50/50">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Building2 className="size-3.5 text-slate-500" />
                  <span>空间与归属</span>
                </div>
                <div className="space-y-1.5 text-slate-600 text-[11px]">
                  <div>归属园区：<strong className="text-slate-800 font-medium">{detailItem.park}</strong></div>
                  <div>关联工厂：<strong className="text-slate-800 font-medium">{detailItem.factory || '园区直辖 (未关联工厂)'}</strong></div>
                  <div>安装位置：<strong className="text-slate-800 font-medium">{detailItem.location}</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 space-y-2 bg-slate-50/50">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Zap className="size-3.5 text-amber-500" />
                  <span>容量与运行</span>
                </div>
                <div className="space-y-1.5 text-slate-600 text-[11px]">
                  <div>装机容量：<strong className="text-amber-600 font-mono font-bold">{detailItem.capacityKW.toLocaleString()} kWp</strong></div>
                  <div>容量折合：<strong className="text-slate-800 font-mono font-medium">{(detailItem.capacityKW / 1000).toFixed(2)} MWp</strong></div>
                  <div>状态：<strong className="text-slate-800 font-medium">{detailItem.status}</strong></div>
                  <div>投运年月：<strong className="text-slate-800 font-mono font-medium">{detailItem.commissionDate}</strong></div>
                </div>
              </div>
            </div>

            {/* 责任人与联系方式 */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/40 flex items-center justify-between text-slate-600 text-[11px]">
              <div>
                管理责任人：<strong className="text-slate-800 font-medium">{detailItem.responsiblePerson}</strong>
              </div>
              <div>
                运维电话：<strong className="text-slate-800 font-mono font-medium">{detailItem.contactPhone}</strong>
              </div>
            </div>

            {detailItem.description && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                <span className="font-bold text-slate-700">设备备注说明：</span>
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
        title="确认删除光伏设备"
        description="此操作将物理移除该光伏发电设备的台账档案"
      >
        <div className="space-y-4 text-xs font-sans">
          {itemToDelete && (
            <div className="p-3 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-800 space-y-1">
              <div className="font-bold">您确定要删除以下光伏设备吗？</div>
              <div className="font-bold text-sm text-slate-900">{itemToDelete.name}</div>
              <div className="text-[11px] text-slate-500">
                归属：{itemToDelete.park} {itemToDelete.factory ? ` - ${itemToDelete.factory}` : ' (园区直辖)'}
              </div>
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

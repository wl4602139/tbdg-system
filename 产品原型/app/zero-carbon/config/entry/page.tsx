'use client'

import { useState } from 'react'
import {
  FileEdit,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  Flame,
  Droplets,
  DollarSign,
  TrendingUp,
  History,
  FileCheck,
  Zap,
  Boxes,
  ShieldAlert,
  Trash2,
  Eye,
  Upload,
  X,
  FileText,
  Sparkles,
  Info,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge, DataTable } from '@/components/shared/primitives'
import { cn } from '@/lib/utils'

export type EntryDataType = 'energy' | 'carbon' | 'production' | 'green_power' | 'material'

interface EntryRecord {
  id: string
  batch: string
  type: string
  typeKey: EntryDataType
  org: string
  period: string
  summary: string
  submitter: string
  submitTime: string
  status: '已入库' | '待审核' | '草稿'
}

const DATA_TYPES: {
  key: EntryDataType
  label: string
  icon: any
  desc: string
  badgeTone: 'ok' | 'warn' | 'danger' | 'info'
}[] = [
  {
    key: 'energy',
    label: '能耗数据',
    icon: Flame,
    desc: '天然气、工业蒸汽、自来水、柴油等非电能源介质月度消耗量与费用账单',
    badgeTone: 'warn',
  },
  {
    key: 'production',
    label: '产量与产值数据',
    icon: DollarSign,
    desc: '企业月度工业总产值、工业增加值、变压器容量、线缆长度等核心核算分母',
    badgeTone: 'info',
  },
  {
    key: 'green_power',
    label: '绿电与绿证数据',
    icon: Zap,
    desc: '市场化交易绿电结算量、国家可再生能源绿证 (GEC) 核销台账与交易凭证',
    badgeTone: 'ok',
  },
  {
    key: 'carbon',
    label: '碳排活动数据',
    icon: ShieldAlert,
    desc: 'CO₂ 焊接保护气、SF₆ 绝缘断路器补充量、切割乙炔等逸散与燃烧活动水平',
    badgeTone: 'danger',
  },
  {
    key: 'material',
    label: '原材料用量数据',
    icon: Boxes,
    desc: '取向硅钢片、电解无氧铜杆、高纯铝杆、变压器绝缘油投料与废品回收率',
    badgeTone: 'info',
  },
]

export default function ManualEntryPage() {
  // 当前选择的数据类型
  const [currentType, setCurrentType] = useState<EntryDataType>('energy')

  // 通用公共信息
  const [selectedOrg, setSelectedOrg] = useState('沈变本部')
  const [entryPeriod, setEntryPeriod] = useState('2026-08')
  const [fillerName, setFillerName] = useState('李工 (能碳专员)')
  const [remark, setRemark] = useState('')
  const [attachmentName, setAttachmentName] = useState<string>('')

  // 1. 能耗数据表单
  const [energyForm, setEnergyForm] = useState({
    gasVolume: '28400',
    gasCost: '8.52',
    steamVolume: '1420',
    steamCost: '32.66',
    waterVolume: '8900',
    waterCost: '4.89',
    dieselVolume: '320',
    dieselCost: '0.24',
  })

  // 2. 产量与产值数据表单
  const [prodForm, setProdForm] = useState({
    outputVal: '14500',
    addedVal: '4200',
    transformerKva: '380000',
    transformerUnits: '128',
    cableKm: '1850',
    copperTon: '420',
  })

  // 3. 绿电与绿证数据表单
  const [greenPowerForm, setGreenPowerForm] = useState({
    dealType: '交易绿电',
    sourceType: '集中式光伏平价项目',
    provider: '三峡能源新疆哈密200MW光伏项目',
    buyer: '特变电工沈阳变压器集团有限公司',
    amount: '148.2',
    unitPrice: '0.450',
    certCode: 'CN-GEC-2026-HM-00921',
    dealDate: '2026-08-15',
  })

  // 4. 碳排活动数据表单
  const [carbonForm, setCarbonForm] = useState({
    co2GasKg: '1850',
    sf6GasKg: '45.5',
    acetyleneM3: '380',
    weldingFluxKg: '820',
    boundaryDesc: '超高压装配车间真空注油与局部放电试验工序',
  })

  // 5. 原材料用量数据表单
  const [materialForm, setMaterialForm] = useState({
    materialName: '取向硅钢片 (30Q120)',
    supplier: '中国宝武钢铁集团',
    inputWeightTon: '1240.5',
    netWeightTon: '1152.0',
    recycleRate: '92.5',
    workOrder: 'WO-202608-TR092',
  })

  // 历史填报与入库台账
  const [records, setRecords] = useState<EntryRecord[]>([
    {
      id: 'REC-001',
      batch: 'DR-260817-01',
      type: '能耗数据',
      typeKey: 'energy',
      org: '衡变本部',
      period: '2026-07',
      summary: '天然气: 29,100 m³ · 蒸汽: 1,480 t · 柴油: 350 L',
      submitter: '王强',
      submitTime: '2026-08-17 09:20',
      status: '已入库',
    },
    {
      id: 'REC-002',
      batch: 'DR-260817-02',
      type: '产量与产值数据',
      typeKey: 'production',
      org: '沈变本部',
      period: '2026-07',
      summary: '总产值: 14,200 万元 · 增加值: 4,150 万元 · 产量: 37.5万kVA',
      submitter: '李工',
      submitTime: '2026-08-17 10:05',
      status: '已入库',
    },
    {
      id: 'REC-003',
      batch: 'DR-260816-03',
      type: '绿电与绿证数据',
      typeKey: 'green_power',
      org: '超高压公司',
      period: '2026-07',
      summary: '集中式光伏交易绿电 148.2 万kWh · 单价 0.45元',
      submitter: '李静',
      submitTime: '2026-08-16 16:40',
      status: '已入库',
    },
    {
      id: 'REC-004',
      batch: 'DR-260815-05',
      type: '原材料用量数据',
      typeKey: 'material',
      org: '沈变本部',
      period: '2026-06',
      summary: '取向硅钢片 1,240.5 t · 废料回收率 92.5%',
      submitter: '赵敏',
      submitTime: '2026-08-15 15:33',
      status: '已入库',
    },
    {
      id: 'REC-005',
      batch: 'DR-260814-02',
      type: '碳排活动数据',
      typeKey: 'carbon',
      org: '天变公司',
      period: '2026-06',
      summary: 'CO₂保护气 1,850 kg · SF₆补充量 45.5 kg',
      submitter: '张伟',
      submitTime: '2026-08-14 11:20',
      status: '已入库',
    },
  ])

  // 状态与通知
  const [successToast, setSuccessToast] = useState<{ show: boolean; msg: string; batch: string }>({
    show: false,
    msg: '',
    batch: '',
  })
  const [filterType, setFilterType] = useState<string>('all')

  // 提交保存处理
  const handleSave = (status: '已入库' | '草稿') => {
    // 生成摘要描述
    let summaryText = ''
    const currentMeta = DATA_TYPES.find((d) => d.key === currentType)!

    if (currentType === 'energy') {
      summaryText = `天然气: ${Number(energyForm.gasVolume).toLocaleString()} m³ · 蒸汽: ${Number(energyForm.steamVolume).toLocaleString()} t · 水: ${Number(energyForm.waterVolume).toLocaleString()} t`
    } else if (currentType === 'production') {
      summaryText = `产值: ${Number(prodForm.outputVal).toLocaleString()} 万元 · 增加值: ${Number(prodForm.addedVal).toLocaleString()} 万元 · 容量: ${Number(prodForm.transformerKva).toLocaleString()} kVA`
    } else if (currentType === 'green_power') {
      summaryText = `${greenPowerForm.dealType}: ${greenPowerForm.amount} 万kWh · 凭证: ${greenPowerForm.certCode}`
    } else if (currentType === 'carbon') {
      summaryText = `CO₂: ${carbonForm.co2GasKg} kg · SF₆: ${carbonForm.sf6GasKg} kg · 割炬: ${carbonForm.acetyleneM3} m³`
    } else if (currentType === 'material') {
      summaryText = `${materialForm.materialName} · 投料: ${materialForm.inputWeightTon} t · 净重: ${materialForm.netWeightTon} t`
    }

    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const batchCode = `DR-${entryPeriod.replace('-', '')}-${String(records.length + 1).padStart(2, '0')}`

    const newRecord: EntryRecord = {
      id: `REC-${Date.now()}`,
      batch: batchCode,
      type: currentMeta.label,
      typeKey: currentType,
      org: selectedOrg,
      period: entryPeriod,
      summary: summaryText,
      submitter: fillerName.split(' ')[0],
      submitTime: timeStr,
      status: status,
    }

    setRecords([newRecord, ...records])

    setSuccessToast({
      show: true,
      msg: `【${currentMeta.label}】数据已成功${status === '已入库' ? '校验并入库' : '保存为草稿'}！已自动挂接至 ${selectedOrg} ${entryPeriod} 能碳核算引擎。`,
      batch: batchCode,
    })

    setTimeout(() => {
      setSuccessToast({ show: false, msg: '', batch: '' })
    }, 4500)
  }

  // 删除某条记录
  const handleDeleteRecord = (id: string) => {
    if (confirm('确认删除该条录入记录？')) {
      setRecords(records.filter((r) => r.id !== id))
    }
  }

  // 过滤后的台账
  const filteredRecords = records.filter((r) => {
    if (filterType === 'all') return true
    return r.typeKey === filterType
  })

  return (
    <div className="space-y-5">
      {/* 顶部标题与基础组织参数栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-[#1677ff]">
            <FileEdit className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-800">能碳业务数据录入</h1>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#1677ff] border border-blue-100">
                双中心统一填报
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              支持按不同数据类型选择针对性表单，录入后自动触发核算引擎计算并留痕归档
            </p>
          </div>
        </div>

        {/* 填报单位与账期选择 */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5">
            <Building2 className="size-3.5 text-slate-500" />
            <span className="text-slate-500">填报单位：</span>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="沈变本部">沈变公司 · 沈变本部</option>
              <option value="衡变本部">衡变公司 · 衡变本部</option>
              <option value="超高压公司">新变厂 · 超高压公司</option>
              <option value="鲁缆本部">鲁缆公司 · 鲁缆本部</option>
              <option value="特变电工新疆电缆有限公司">新缆厂 · 新疆电缆</option>
              <option value="德缆股份公司">德缆公司 · 德缆股份</option>
              <option value="天变公司">天津变压器公司</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5">
            <Calendar className="size-3.5 text-slate-500" />
            <span className="text-slate-500">统计账期：</span>
            <input
              type="month"
              value={entryPeriod}
              onChange={(e) => setEntryPeriod(e.target.value)}
              className="bg-transparent font-mono font-semibold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 成功提醒横幅 */}
      {successToast.show && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs text-emerald-800 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">入库成功（批次号：{successToast.batch}）：</span>
              <span>{successToast.msg}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast({ show: false, msg: '', batch: '' })}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* 🌟 核心：步骤一 · 数据类型选择器 (Tab 选项卡风格) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#1677ff] text-[11px] font-bold text-white">
              1
            </span>
            <h2 className="text-sm font-bold text-slate-800">请选择录入数据类型</h2>
          </div>
          <span className="text-xs text-slate-400">选择数据类型后，系统将自动匹配专属录入表单</span>
        </div>

        {/* 数据类型选择卡片组 */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {DATA_TYPES.map((dt) => {
            const active = currentType === dt.key
            const IconComponent = dt.icon
            return (
              <button
                key={dt.key}
                type="button"
                onClick={() => setCurrentType(dt.key)}
                className={cn(
                  'group flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all cursor-pointer relative',
                  active
                    ? 'border-[#1677ff] bg-blue-50/50 shadow-xs ring-2 ring-[#1677ff]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60',
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg transition-colors',
                      active ? 'bg-[#1677ff] text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
                    )}
                  >
                    <IconComponent className="size-4.5" />
                  </div>
                  {active && (
                    <span className="flex items-center gap-1 rounded-full bg-[#1677ff] px-2 py-0.5 text-[10px] font-bold text-white">
                      当前选中
                    </span>
                  )}
                </div>
                <div>
                  <div className={cn('text-xs font-bold', active ? 'text-[#1677ff]' : 'text-slate-800')}>
                    {dt.label}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {dt.desc}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 🌟 步骤二 · 动态表单录入区 (根据选中的数据类型切换渲染) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <Panel className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#1677ff] text-[11px] font-bold text-white">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-800">
                  填写【{DATA_TYPES.find((d) => d.key === currentType)?.label}】详细指标
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                当前主体：<strong className="text-slate-700">{selectedOrg}</strong> · 账期：
                <strong className="font-mono text-slate-700">{entryPeriod}</strong>
              </span>
            </div>

            {/* 1. 能耗数据录入表单 */}
            {currentType === 'energy' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="rounded-lg bg-amber-50/60 border border-amber-200/60 p-3 text-xs text-amber-800 flex items-start gap-2">
                  <Info className="size-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">适用场景：</span>
                    管道天然气、工业蒸汽、自来水及厂内叉车燃油等非电介质。实物量用于折算综合能耗与直接排放 (Scope 1/2)，费用用于核算能源成本。
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>天然气总用量 (m³)</span>
                      <span className="text-[11px] text-slate-400">燃气表读数/账单</span>
                    </label>
                    <input
                      type="number"
                      value={energyForm.gasVolume}
                      onChange={(e) => setEnergyForm({ ...energyForm, gasVolume: e.target.value })}
                      placeholder="请输入天然气立方数"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400">燃气费用支出 (万元)：</span>
                      <input
                        type="number"
                        value={energyForm.gasCost}
                        onChange={(e) => setEnergyForm({ ...energyForm, gasCost: e.target.value })}
                        className="w-24 rounded border border-slate-200 bg-white px-2 py-0.5 text-right font-mono text-slate-700 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>工业蒸汽消耗量 (t)</span>
                      <span className="text-[11px] text-slate-400">热力计量结算单</span>
                    </label>
                    <input
                      type="number"
                      value={energyForm.steamVolume}
                      onChange={(e) => setEnergyForm({ ...energyForm, steamVolume: e.target.value })}
                      placeholder="请输入蒸汽吨数"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400">蒸汽费用支出 (万元)：</span>
                      <input
                        type="number"
                        value={energyForm.steamCost}
                        onChange={(e) => setEnergyForm({ ...energyForm, steamCost: e.target.value })}
                        className="w-24 rounded border border-slate-200 bg-white px-2 py-0.5 text-right font-mono text-slate-700 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>工业自来水总用量 (t)</span>
                      <span className="text-[11px] text-slate-400">自来水账单/总表</span>
                    </label>
                    <input
                      type="number"
                      value={energyForm.waterVolume}
                      onChange={(e) => setEnergyForm({ ...energyForm, waterVolume: e.target.value })}
                      placeholder="请输入用水吨数"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400">水费支出 (万元)：</span>
                      <input
                        type="number"
                        value={energyForm.waterCost}
                        onChange={(e) => setEnergyForm({ ...energyForm, waterCost: e.target.value })}
                        className="w-24 rounded border border-slate-200 bg-white px-2 py-0.5 text-right font-mono text-slate-700 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>厂内柴油/汽油消耗 (L)</span>
                      <span className="text-[11px] text-slate-400">叉车/发电机燃料</span>
                    </label>
                    <input
                      type="number"
                      value={energyForm.dieselVolume}
                      onChange={(e) => setEnergyForm({ ...energyForm, dieselVolume: e.target.value })}
                      placeholder="请输入用油升数"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400">燃油采购支出 (万元)：</span>
                      <input
                        type="number"
                        value={energyForm.dieselCost}
                        onChange={(e) => setEnergyForm({ ...energyForm, dieselCost: e.target.value })}
                        className="w-24 rounded border border-slate-200 bg-white px-2 py-0.5 text-right font-mono text-slate-700 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 产量与产值数据录入表单 */}
            {currentType === 'production' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="rounded-lg bg-blue-50/60 border border-blue-200/60 p-3 text-xs text-blue-800 flex items-start gap-2">
                  <Info className="size-4 shrink-0 text-blue-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">核心分母核算依据：</span>
                    工业总产值与工业增加值用于核算“万元产值综合能耗”与“单位增加值综合能耗（工信部国标考核）”，完工产量用于驱动产品单耗 Mode B 对标。
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>企业工业总产值 (万元)</span>
                      <span className="text-[11px] text-slate-400">财务经营快报口径</span>
                    </label>
                    <input
                      type="number"
                      value={prodForm.outputVal}
                      onChange={(e) => setProdForm({ ...prodForm, outputVal: e.target.value })}
                      placeholder="请输入总产值"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>企业工业增加值 (万元)</span>
                      <span className="text-[11px] text-slate-400">必须 ≤ 工业总产值</span>
                    </label>
                    <input
                      type="number"
                      value={prodForm.addedVal}
                      onChange={(e) => setProdForm({ ...prodForm, addedVal: e.target.value })}
                      placeholder="请输入增加值"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>变压器完工容量 (万kVA)</span>
                      <span className="text-[11px] text-slate-400">MES 终检合格入库</span>
                    </label>
                    <input
                      type="number"
                      value={prodForm.transformerKva}
                      onChange={(e) => setProdForm({ ...prodForm, transformerKva: e.target.value })}
                      placeholder="请输入容量"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400">完工台数 (台)：</span>
                      <input
                        type="number"
                        value={prodForm.transformerUnits}
                        onChange={(e) => setProdForm({ ...prodForm, transformerUnits: e.target.value })}
                        className="w-24 rounded border border-slate-200 bg-white px-2 py-0.5 text-right font-mono text-slate-700 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>电线电缆完工长度 (万km)</span>
                      <span className="text-[11px] text-slate-400">线缆产业完工量</span>
                    </label>
                    <input
                      type="number"
                      value={prodForm.cableKm}
                      onChange={(e) => setProdForm({ ...prodForm, cableKm: e.target.value })}
                      placeholder="请输入成品长度"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400">耗铜投入量 (吨)：</span>
                      <input
                        type="number"
                        value={prodForm.copperTon}
                        onChange={(e) => setProdForm({ ...prodForm, copperTon: e.target.value })}
                        className="w-24 rounded border border-slate-200 bg-white px-2 py-0.5 text-right font-mono text-slate-700 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 绿电与绿证数据录入表单 */}
            {currentType === 'green_power' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="rounded-lg bg-teal-50/60 border border-teal-200/60 p-3 text-xs text-teal-800 flex items-start gap-2">
                  <Info className="size-4 shrink-0 text-teal-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">绿电抵扣规则：</span>
                    通过电力交易中心划转的市场化交易绿电或国家绿证 (GEC)，1 张 GEC 等效 1,000 kWh 绿色环境权益，录入后实时扣减电网外购电力间接碳排 (Scope 2)。
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">交易资产类型</label>
                    <select
                      value={greenPowerForm.dealType}
                      onChange={(e) => setGreenPowerForm({ ...greenPowerForm, dealType: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-slate-800 focus:border-[#1677ff] focus:outline-none font-medium"
                    >
                      <option value="交易绿电">交易绿电（跨省/省内双边交易）</option>
                      <option value="交易绿证(GEC)">国家绿色电力证书 (GEC) 核销</option>
                      <option value="分布式直供">厂外分布式可再生能源直供</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">绿电/发电来源类型</label>
                    <select
                      value={greenPowerForm.sourceType}
                      onChange={(e) => setGreenPowerForm({ ...greenPowerForm, sourceType: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-slate-800 focus:border-[#1677ff] focus:outline-none font-medium"
                    >
                      <option value="集中式光伏平价项目">集中式光伏平价项目</option>
                      <option value="集中式陆上风电">集中式陆上风电</option>
                      <option value="屋顶分布式光伏">屋顶分布式光伏</option>
                      <option value="生物质自备发电">生物质自备发电</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">提供方 / 发电企业</label>
                    <input
                      type="text"
                      value={greenPowerForm.provider}
                      onChange={(e) => setGreenPowerForm({ ...greenPowerForm, provider: e.target.value })}
                      placeholder="发电企业或交易中心项目名"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">购买消纳主体</label>
                    <input
                      type="text"
                      value={greenPowerForm.buyer}
                      onChange={(e) => setGreenPowerForm({ ...greenPowerForm, buyer: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>结算电量 (万kWh) / 绿证 (张)</span>
                      <span className="text-[11px] text-slate-400">1张=1000度</span>
                    </label>
                    <input
                      type="number"
                      value={greenPowerForm.amount}
                      onChange={(e) => setGreenPowerForm({ ...greenPowerForm, amount: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>结算单价 (元/kWh 或 元/张)</span>
                      <span className="text-[11px] text-slate-400">溢价成本</span>
                    </label>
                    <input
                      type="number"
                      value={greenPowerForm.unitPrice}
                      onChange={(e) => setGreenPowerForm({ ...greenPowerForm, unitPrice: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>GEC 证书防伪编码 / 交易结算单号</span>
                      <span className="text-[11px] text-slate-400">国家绿证中心唯一凭据号</span>
                    </label>
                    <input
                      type="text"
                      value={greenPowerForm.certCode}
                      onChange={(e) => setGreenPowerForm({ ...greenPowerForm, certCode: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. 碳排活动数据录入表单 */}
            {currentType === 'carbon' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="rounded-lg bg-rose-50/60 border border-rose-200/60 p-3 text-xs text-rose-800 flex items-start gap-2">
                  <Info className="size-4 shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">工序逸散核算：</span>
                    变压器制造及开关生产过程中使用的工业保护气 (CO₂)、高压六氟化硫 (SF₆) 灭火/绝缘介质补气，均属于无组织逃逸排放核查关键参数。
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>CO₂ 焊接保护气体领用量 (kg)</span>
                      <span className="text-[11px] text-slate-400">气瓶过磅称重</span>
                    </label>
                    <input
                      type="number"
                      value={carbonForm.co2GasKg}
                      onChange={(e) => setCarbonForm({ ...carbonForm, co2GasKg: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>SF₆ 六氟化硫绝缘补充量 (kg)</span>
                      <span className="text-[11px] text-rose-600 font-bold">GWP=23500 (高排放因子)</span>
                    </label>
                    <input
                      type="number"
                      value={carbonForm.sf6GasKg}
                      onChange={(e) => setCarbonForm({ ...carbonForm, sf6GasKg: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>切割乙炔气消耗量 (m³)</span>
                      <span className="text-[11px] text-slate-400">铁芯下料工序</span>
                    </label>
                    <input
                      type="number"
                      value={carbonForm.acetyleneM3}
                      onChange={(e) => setCarbonForm({ ...carbonForm, acetyleneM3: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50/40 p-3">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>焊丝及辅料领用量 (kg)</span>
                      <span className="text-[11px] text-slate-400">油箱结构焊接</span>
                    </label>
                    <input
                      type="number"
                      value={carbonForm.weldingFluxKg}
                      onChange={(e) => setCarbonForm({ ...carbonForm, weldingFluxKg: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-800">活动水平核算工序与边界说明</label>
                    <input
                      type="text"
                      value={carbonForm.boundaryDesc}
                      onChange={(e) => setCarbonForm({ ...carbonForm, boundaryDesc: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. 原材料用量数据录入表单 */}
            {currentType === 'material' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="rounded-lg bg-purple-50/60 border border-purple-200/60 p-3 text-xs text-purple-800 flex items-start gap-2">
                  <Info className="size-4 shrink-0 text-purple-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">LCA 碳足迹原材料占比 (62%)：</span>
                    录入硅钢片、电解铜等核心主材实际消耗与废料回收率，直接驱动产品碳足迹 ISO 14067 核算与 EU CBAM 前体嵌入碳排测算。
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">主要原材料名称与牌号</label>
                    <select
                      value={materialForm.materialName}
                      onChange={(e) => setMaterialForm({ ...materialForm, materialName: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-slate-800 focus:border-[#1677ff] focus:outline-none font-medium"
                    >
                      <option value="取向硅钢片 (30Q120)">取向硅钢片 (30Q120 / 铁芯主材)</option>
                      <option value="高纯无氧铜杆 (TU1/TU2)">高纯无氧铜杆 (TU1/TU2 / 线圈主材)</option>
                      <option value="电工圆铝杆 (1050A)">电工圆铝杆 (1050A / 铝绕组主材)</option>
                      <option value="克拉玛依变压器绝缘油 (25#)">克拉玛依变压器绝缘油 (25#)</option>
                      <option value="高抗冲环氧树脂注塑料">高抗冲环氧树脂注塑料 (干变封装)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">合格供应商主体</label>
                    <input
                      type="text"
                      value={materialForm.supplier}
                      onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>本月投料总量 (吨)</span>
                      <span className="text-[11px] text-slate-400">领料出库单</span>
                    </label>
                    <input
                      type="number"
                      value={materialForm.inputWeightTon}
                      onChange={(e) => setMaterialForm({ ...materialForm, inputWeightTon: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>产品成品净重 (吨)</span>
                      <span className="text-[11px] text-slate-400">有效主材重量</span>
                    </label>
                    <input
                      type="number"
                      value={materialForm.netWeightTon}
                      onChange={(e) => setMaterialForm({ ...materialForm, netWeightTon: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center justify-between font-semibold text-slate-800">
                      <span>边角料综合回收率 (%)</span>
                      <span className="text-[11px] text-slate-400">循环利用</span>
                    </label>
                    <input
                      type="number"
                      value={materialForm.recycleRate}
                      onChange={(e) => setMaterialForm({ ...materialForm, recycleRate: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">对应生产工单或批次号</label>
                    <input
                      type="text"
                      value={materialForm.workOrder}
                      onChange={(e) => setMaterialForm({ ...materialForm, workOrder: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-slate-800 focus:border-[#1677ff] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 🌟 步骤三 · 责任人、附件与操作动作按钮 */}
            <div className="mt-6 border-t border-slate-100 pt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800">填报责任人</label>
                  <input
                    type="text"
                    value={fillerName}
                    onChange={(e) => setFillerName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-800 focus:border-[#1677ff] focus:outline-none font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800">上传原始账单/凭证 (PDF / Excel)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-slate-600 cursor-pointer transition-colors text-xs shrink-0">
                      <Upload className="size-3.5" />
                      <span>选择凭证文件</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAttachmentName(e.target.files[0].name)
                          }
                        }}
                      />
                    </label>
                    <span className="text-slate-500 truncate text-[11px]">
                      {attachmentName ? attachmentName : '尚未选择凭证扫描件 (非必传)'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-slate-800">填报情况说明与核算备注</label>
                  <textarea
                    rows={2}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="如遇环比波动超过正常区间，请在此说明工艺检修、停产、负荷变动等原因..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:border-[#1677ff] focus:outline-none text-xs placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* 底部保存与提交操作 */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-[11px] text-slate-400">
                  点击保存后，数据将写入本地台账，并触发能碳引擎重新计算对应周期指标
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSave('草稿')}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <FileText className="size-3.5" />
                    保存为草稿
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave('已入库')}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1677ff] hover:bg-[#1565c0] px-6 py-2 font-semibold text-white transition-all shadow-sm shadow-blue-500/20 active:scale-95 cursor-pointer"
                  >
                    <Save className="size-4" />
                    保存并提交入库
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* 右侧：实时数据质量检测与核算流向 */}
        <div className="lg:col-span-4 space-y-4">
          <Panel className="p-4 space-y-3">
            <PanelTitle title="实时数据质量校验" />
            <div className="space-y-2.5 text-xs">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>数值逻辑合规检查通过</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">
                  当前输入的所有实物消耗量与产值数值均为非负数，满足物理守恒与热力学基本定律。
                </p>
              </div>

              {currentType === 'production' && (
                <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3">
                  <span className="font-bold text-blue-800 block">增加值率动态核算</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-lg font-bold text-[#1677ff]">
                      {(
                        (Number(prodForm.addedVal) / (Number(prodForm.outputVal) || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                    <span className="text-[11px] text-blue-600">
                      (增加值/总产值，行业均值 25%~35%)
                    </span>
                  </div>
                </div>
              )}

              {currentType === 'energy' && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3">
                  <span className="font-bold text-amber-800 block">折标煤与碳排预估</span>
                  <p className="text-[11px] text-amber-700 mt-1">
                    天然气折标煤系数：1.33 kgce/m³ · 蒸汽折标煤系数：0.0941 tce/t · 换算综合能耗约{' '}
                    <strong className="font-mono">171.4</strong> 吨标煤。
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-1.5 text-slate-600">
                <span className="font-bold text-slate-800 block">【下游计算引擎联动流向】</span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                  <li>自动重算组织级温室气体直接排放 (Scope 1/2)</li>
                  <li>更新“单位增加值综合能耗”工信部考核指标</li>
                  <li>刷新集控中心大屏「绿电占比」与「碳排放强度」</li>
                </ul>
              </div>
            </div>
          </Panel>

          <Panel className="p-4">
            <PanelTitle title="四眼复核与审计保障" />
            <div className="space-y-2 mt-2 text-xs text-slate-500 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-[#1677ff] mt-1.5 shrink-0" />
                <span>填报后数据进入所属公司账期台账，生成唯一防篡改批次编号。</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-[#1677ff] mt-1.5 shrink-0" />
                <span>园区能管主管可进行合规复核，归档后锁定历史只读权限。</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* 🌟 步骤四 · 填报记录台账列表（支持分类筛选与实时查看） */}
      <Panel className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <History className="size-4.5 text-[#1677ff]" />
            <h3 className="text-sm font-bold text-slate-800">已录入数据台账明细</h3>
            <Badge tone="info">{filteredRecords.length} 条记录</Badge>
          </div>

          {/* 类型筛选器 */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">数据类型过滤：</span>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
                filterType === 'all'
                  ? 'bg-[#1677ff] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              全部
            </button>
            {DATA_TYPES.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setFilterType(d.key)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  filterType === d.key
                    ? 'bg-[#1677ff] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 台账表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium">
                <th className="py-2.5 px-3">批次编号</th>
                <th className="py-2.5 px-3">数据类型</th>
                <th className="py-2.5 px-3">填报单位</th>
                <th className="py-2.5 px-3">统计账期</th>
                <th className="py-2.5 px-3">核心填报内容摘要</th>
                <th className="py-2.5 px-3">填报人</th>
                <th className="py-2.5 px-3">提交时间</th>
                <th className="py-2.5 px-3 text-center">状态</th>
                <th className="py-2.5 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-800">{r.batch}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                      {r.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-700">{r.org}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{r.period}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600 max-w-xs truncate" title={r.summary}>
                    {r.summary}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">{r.submitter}</td>
                  <td className="py-2.5 px-3 text-slate-400">{r.submitTime}</td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    <StatusBadge tone={r.status === '已入库' ? 'ok' : r.status === '待审核' ? 'warn' : 'danger'}>
                      {r.status}
                    </StatusBadge>
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans space-x-2">
                    <button
                      type="button"
                      onClick={() => alert(`批次 ${r.batch} 详情：\n${r.summary}\n填报单位：${r.org}\n填报人：${r.submitter}`)}
                      className="text-[#1677ff] hover:underline cursor-pointer"
                    >
                      查看
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(r.id)}
                      className="text-rose-500 hover:underline cursor-pointer"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

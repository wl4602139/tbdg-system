'use client'

import { useState } from 'react'
import {
  FileEdit,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Flame,
  Droplets,
  DollarSign,
  History,
  Zap,
  Boxes,
  ShieldAlert,
  Trash2,
  Upload,
  Info,
  Layers,
  Sparkles,
  Gauge,
  Camera,
  Activity,
  Award,
} from 'lucide-react'
import { Panel, Badge } from '@/components/shared/primitives'
import { cn } from '@/lib/utils'

// 🌟 严格对应《零碳园区集控中心数据需求清单》中数据来源为“录入”的 5 大业务分类
export type EntryCategory = 
  | 'energy_consumption'  // 1. 能源消耗量录入 (用水量、天然气量、外购蒸汽量、油消耗量、液氧)
  | 'energy_cost'         // 2. 能源费用账单录入 (市电费用、天然气费用、外购蒸汽费用、用水费用、油费用)
  | 'green_trade'         // 3. 绿电与绿证交易录入 (购买绿电量、购买绿证量)
  | 'production_economy'  // 4. 工业增加值与非线缆产量录入 (工业增加值、非线缆产量)
  | 'equipment_project'   // 5. 重点用能设备与项目事件录入 (能效2级设备明细、统计范围设备明细、零碳事件与照片)

interface CategoryMeta {
  key: EntryCategory
  label: string
  icon: any
  desc: string
  targetBadge: string      // 数据对象
  dimBadge: string         // 时间维度
  sourceBadge: string      // 数据来源
  itemCount: number
}

const CATEGORY_LIST: CategoryMeta[] = [
  {
    key: 'energy_consumption',
    label: '能源消耗量录入',
    icon: Flame,
    desc: '用水量 (t)、天然气量 (m³)、外购蒸汽量 (t)、油消耗量 (L)、液氧 (t)',
    targetBadge: '数据对象: 工厂',
    dimBadge: '时间维度: 日/月、月度',
    sourceBadge: '数据来源: 手动录入 / 接入+录入',
    itemCount: 5,
  },
  {
    key: 'energy_cost',
    label: '能源费用账单录入',
    icon: DollarSign,
    desc: '市电费用 (万元)、天然气费用 (万元)、外购蒸汽费用 (万元)、用水费用 (万元)、油费用 (万元)',
    targetBadge: '数据对象: 工厂',
    dimBadge: '时间维度: 月度',
    sourceBadge: '数据来源: 录入',
    itemCount: 5,
  },
  {
    key: 'green_trade',
    label: '绿电与绿证交易录入',
    icon: Zap,
    desc: '购买绿电量 (MWh)、购买绿证量 (个/张)，用于大屏展示与能效消纳监管',
    targetBadge: '数据对象: 园区及工厂',
    dimBadge: '时间维度: 月',
    sourceBadge: '数据来源: 系统界面手动录入',
    itemCount: 2,
  },
  {
    key: 'production_economy',
    label: '工业增加值与非线缆产量',
    icon: Activity,
    desc: '工业增加值 (万元)、产量(非线缆产业、项目公司) (台/套/件)',
    targetBadge: '数据对象: 工厂',
    dimBadge: '时间维度: 月度/年度、月',
    sourceBadge: '数据来源: 系统界面手动录入',
    itemCount: 2,
  },
  {
    key: 'equipment_project',
    label: '重点用能设备与零碳事件',
    icon: Gauge,
    desc: '优于国标2级设备明细 (kW)、纳入统计设备明细 (kW)、零碳关键事件与园区照片',
    targetBadge: '数据对象: 园区/工厂',
    dimBadge: '时间维度: 增量更新',
    sourceBadge: '数据来源: 系统界面手动录入',
    itemCount: 3,
  },
]

interface LedgerItem {
  id: string
  batch: string
  categoryKey: EntryCategory
  categoryName: string
  itemName: string       // 数据项名称
  dataUnit: string       // 数据单位
  dataTarget: string     // 数据对象
  timeDim: string        // 时间维度
  valueDisplay: string   // 录入数值及描述
  org: string            // 填报单位
  period: string         // 填报账期/时间
  source: string         // 数据来源
  submitTime: string
  status: '已入库' | '待复核'
}

export default function ManualEntryPage() {
  const [currentCategory, setCurrentCategory] = useState<EntryCategory>('energy_consumption')

  // 通用公共填报信息
  const [selectedOrg, setSelectedOrg] = useState('沈变本部')
  const [entryPeriod, setEntryPeriod] = useState('2026-08')
  const [submitterName, setSubmitterName] = useState('李工 (能碳专员)')
  const [remark, setRemark] = useState('')
  const [attachmentName, setAttachmentName] = useState<string>('')

  // 1. 能源消耗量表单 (5项)
  const [energyForm, setEnergyForm] = useState({
    waterVolume: '8900',      // 用水量 (t) - 日/月
    gasVolume: '28400',       // 天然气量 (m³) - 月度
    steamVolume: '1420',      // 外购蒸汽量 (t) - 月度
    oilVolume: '320',         // 油消耗量（柴油、煤油、汽油） (L) - 月度
    oxygenVolume: '45.0',     // 液氧 (t) - 月度
  })

  // 2. 能源费用账单表单 (5项)
  const [costForm, setCostForm] = useState({
    gridElecCost: '142.50',   // 市电费用 (万元) - 月度
    gasCost: '8.52',          // 天然气费用 (万元) - 月度
    steamCost: '32.66',       // 外购蒸汽费用 (万元) - 月度
    waterCost: '4.89',        // 用水费用 (万元) - 月度
    oilCost: '0.24',          // 油费用 (万元) - 月度
  })

  // 3. 绿电与绿证交易表单 (2项)
  const [greenForm, setGreenForm] = useState({
    purchasedGreenPowerMWh: '1482.0', // 购买绿电量 (MWh) - 月
    purchasedCertCount: '18000',      // 购买绿证量 (个) - 月
    provider: '三峡能源新疆哈密200MW光伏项目',
    certCode: 'CN-GEC-2026-HM-00921',
    unitPrice: '0.450 元/kWh',
  })

  // 4. 工业增加值与非线缆产量表单 (2项)
  const [economyForm, setEconomyForm] = useState({
    addedValueWan: '4200.0',     // 工业增加值 (万元) - 月度/年度
    nonCableProduction: '128',   // 产量(非线缆产业、项目公司) (台/套/件) - 月
    industryType: '特高压变压器产业',
    productSpec: '500kV及以上主变压器',
  })

  // 5. 重点用能设备与零碳事件表单 (3项)
  const [equipmentForm, setEquipmentForm] = useState({
    level2EquipmentName: '超高效节能电动机 IE4 & 变压器',
    level2EquipmentPowerKw: '3200',   // 达到或优于能效国家标准2级的设备明细 (kW) - 增量更新
    level2EquipmentUsage: '装配一车间主传动与变压器铁芯冲剪生产线',
    statEquipmentName: '容积式空压机站 & 工业制冷机组',
    statEquipmentPowerKw: '4850',     // 纳入统计范围设备明细 (kW) - 增量更新
    keyEventTitle: '园区2.8MWp分布式光伏扩建工程成功并网发电', // 零碳关键事件与照片 - 增量更新
    keyEventDate: '2026-08-18',
    parkPhotoAttached: true,
  })

  // 台账记录源
  const [records, setRecords] = useState<LedgerItem[]>([
    {
      id: 'REC-01',
      batch: 'DR-2608-01',
      categoryKey: 'energy_consumption',
      categoryName: '能源消耗量',
      itemName: '用水量 / 天然气量 / 外购蒸汽量',
      dataUnit: 't / m³ / t',
      dataTarget: '工厂',
      timeDim: '日/月、月度',
      valueDisplay: '用水: 8,900 t · 天然气: 28,400 m³ · 蒸汽: 1,420 t',
      org: '沈变本部',
      period: '2026-08',
      source: '系统界面手动录入',
      submitTime: '2026-08-28 09:30',
      status: '已入库',
    },
    {
      id: 'REC-02',
      batch: 'DR-2608-02',
      categoryKey: 'energy_cost',
      categoryName: '能源费用账单',
      itemName: '市电费用 / 天然气费用 / 蒸汽费用',
      dataUnit: '万元',
      dataTarget: '工厂',
      timeDim: '月度',
      valueDisplay: '市电: ¥142.50万 · 燃气: ¥8.52万 · 蒸汽: ¥32.66万',
      org: '沈变本部',
      period: '2026-08',
      source: '录入',
      submitTime: '2026-08-28 10:15',
      status: '已入库',
    },
    {
      id: 'REC-03',
      batch: 'DR-2608-03',
      categoryKey: 'green_trade',
      categoryName: '绿电与绿证交易',
      itemName: '购买绿电量 / 购买绿证量',
      dataUnit: 'MWh / 个',
      dataTarget: '园区及工厂',
      timeDim: '月',
      valueDisplay: '绿电: 1,482.0 MWh · 绿证: 18,000 个 (GEC-HM-00921)',
      org: '沈变本部',
      period: '2026-08',
      source: '系统界面手动录入',
      submitTime: '2026-08-27 15:40',
      status: '已入库',
    },
    {
      id: 'REC-04',
      batch: 'DR-2608-04',
      categoryKey: 'production_economy',
      categoryName: '工业增加值与非线缆产量',
      itemName: '工业增加值 / 产量(非线缆产业)',
      dataUnit: '万元 / 台套',
      dataTarget: '工厂',
      timeDim: '月度/年度、月',
      valueDisplay: '增加值: 4,200.0 万元 · 非线缆产量: 128 台套',
      org: '沈变本部',
      period: '2026-08',
      source: '系统界面手动录入',
      submitTime: '2026-08-26 11:10',
      status: '已入库',
    },
    {
      id: 'REC-05',
      batch: 'DR-2608-05',
      categoryKey: 'equipment_project',
      categoryName: '重点用能设备与零碳事件',
      itemName: '优于国标2级设备 / 纳入统计设备明细',
      dataUnit: 'kW',
      dataTarget: '工厂',
      timeDim: '增量更新',
      valueDisplay: '2级能效设备: 3,200 kW · 纳入统计设备: 4,850 kW',
      org: '衡变本部',
      period: '2026-08',
      source: '系统界面手动录入',
      submitTime: '2026-08-25 14:20',
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
  const handleSave = (status: '已入库' | '待复核') => {
    const activeMeta = CATEGORY_LIST.find((c) => c.key === currentCategory)!
    let valueDesc = ''

    if (currentCategory === 'energy_consumption') {
      valueDesc = `水: ${energyForm.waterVolume} t · 气: ${energyForm.gasVolume} m³ · 汽: ${energyForm.steamVolume} t · 油: ${energyForm.oilVolume} L · 液氧: ${energyForm.oxygenVolume} t`
    } else if (currentCategory === 'energy_cost') {
      valueDesc = `市电: ¥${costForm.gridElecCost}万 · 燃气: ¥${costForm.gasCost}万 · 蒸汽: ¥${costForm.steamCost}万 · 水: ¥${costForm.waterCost}万`
    } else if (currentCategory === 'green_trade') {
      valueDesc = `购绿电: ${greenForm.purchasedGreenPowerMWh} MWh · 绿证: ${greenForm.purchasedCertCount} 个 (${greenForm.certCode})`
    } else if (currentCategory === 'production_economy') {
      valueDesc = `工业增加值: ${economyForm.addedValueWan} 万元 · 非线缆产量: ${economyForm.nonCableProduction} 台套`
    } else if (currentCategory === 'equipment_project') {
      valueDesc = `国标2级设备: ${equipmentForm.level2EquipmentPowerKw} kW · 统计设备: ${equipmentForm.statEquipmentPowerKw} kW`
    }

    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const batchCode = `DR-${entryPeriod.replace('-', '')}-${String(records.length + 1).padStart(2, '0')}`

    const newRecord: LedgerItem = {
      id: `REC-${Date.now()}`,
      batch: batchCode,
      categoryKey: currentCategory,
      categoryName: activeMeta.label,
      itemName: activeMeta.label,
      dataUnit: activeMeta.key === 'energy_cost' ? '万元' : activeMeta.key === 'green_trade' ? 'MWh / 个' : '标准量',
      dataTarget: activeMeta.targetBadge.replace('数据对象: ', ''),
      timeDim: activeMeta.dimBadge.replace('时间维度: ', ''),
      valueDisplay: valueDesc,
      org: selectedOrg,
      period: entryPeriod,
      source: '系统界面手动录入',
      submitTime: timeStr,
      status: status,
    }

    setRecords([newRecord, ...records])
    setSuccessToast({
      show: true,
      msg: `【${activeMeta.label}】数据已成功校验并${status === '已入库' ? '入库' : '暂存待复核'}！已归集至【${selectedOrg}】${entryPeriod}账期。`,
      batch: batchCode,
    })

    setTimeout(() => {
      setSuccessToast({ show: false, msg: '', batch: '' })
    }, 4500)
  }

  const handleDeleteRecord = (id: string) => {
    if (confirm('确认删除该条录入记录？')) {
      setRecords(records.filter((r) => r.id !== id))
    }
  }

  const filteredRecords = records.filter((r) => {
    if (filterType === 'all') return true
    return r.categoryKey === filterType
  })

  return (
    <div className="space-y-5">
      {/* 顶部标题栏与规范说明 */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-primary">
            <FileEdit className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">能碳业务数据手动录入工作台</h1>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-[#1677ff] border border-blue-500/20 font-bold">
                清单来源口径 · 界面手动录入专用
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              严格遵循《零碳园区集控中心数据需求清单》，仅提供数据来源为「界面手动录入」的 16 项能碳动态与设备基准指标录入
            </p>
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
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold"
          >
            关闭
          </button>
        </div>
      )}

      {/* 🌟 步骤一 · 选择录入数据类型 (严格对应 5 大手动录入业务分类) */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#1677ff] text-[11px] font-bold text-white">
              1
            </span>
            <h2 className="text-sm font-bold text-foreground">
              选择手动录入数据分类 (明确数据对象、时间维度与单位)
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            共 5 大手动录入分类 · 涵盖 16 项清单级核心指标
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORY_LIST.map((cat) => {
            const active = currentCategory === cat.key
            const Icon = cat.icon
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCurrentCategory(cat.key)}
                className={cn(
                  'group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer select-none space-y-2.5',
                  active
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/10 shadow-sm'
                    : 'border-border hover:border-blue-400 bg-panel'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={cn('p-2 rounded-lg', active ? 'bg-[#1677ff] text-white' : 'bg-primary/20 text-primary')}>
                      <Icon className="size-4" />
                    </div>
                    {active && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1677ff] text-white">
                        当前填报
                      </span>
                    )}
                  </div>
                  <div className={cn('text-xs font-bold', active ? 'text-primary' : 'text-foreground')}>
                    {cat.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {cat.desc}
                  </div>
                </div>

                {/* 数据对象与时间维度规范徽章 */}
                <div className="pt-2 border-t border-border/60 space-y-1 text-[10px] font-mono">
                  <div className="text-blue-600 font-bold flex items-center gap-1">
                    <span>🏢</span>
                    <span>{cat.targetBadge}</span>
                  </div>
                  <div className="text-muted-foreground/80 flex items-center gap-1">
                    <span>📅</span>
                    <span>{cat.dimBadge}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 🌟 步骤二 · 动态指标填报表单区 */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <Panel className="p-5">
            {/* 表单 Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-border/60 pb-3 mb-4 gap-3">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#1677ff] text-[11px] font-bold text-white">
                  2
                </span>
                <h3 className="text-sm font-bold text-foreground">
                  填写【{CATEGORY_LIST.find((c) => c.key === currentCategory)?.label}】指标详情
                </h3>
              </div>

              {/* 填报单位与数据周期选择 */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-panel px-2.5 py-1 text-xs">
                  <Building2 className="size-3.5 text-blue-500" />
                  <span className="text-muted-foreground">数据对象 (单位):</span>
                  <select
                    value={selectedOrg}
                    onChange={(e) => setSelectedOrg(e.target.value)}
                    className="border-0 bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="沈变本部">沈变本部 (工厂)</option>
                    <option value="衡变本部">衡变本部 (工厂)</option>
                    <option value="超高压公司">超高压公司 (工厂)</option>
                    <option value="鲁缆本部">鲁缆本部 (工厂)</option>
                    <option value="特变电工新疆电缆有限公司">特变电工新疆电缆有限公司 (工厂)</option>
                    <option value="特变电工（德阳）电缆股份有限公司">特变电工（德阳）电缆股份有限公司 (工厂)</option>
                    <option value="东北输变电产业园">东北输变电产业园 (园区)</option>
                    <option value="南方输变电产业园">南方输变电产业园 (园区)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-panel px-2.5 py-1 text-xs">
                  <Calendar className="size-3.5 text-blue-500" />
                  <span className="text-muted-foreground">填报周期:</span>
                  <input
                    type="month"
                    value={entryPeriod}
                    onChange={(e) => setEntryPeriod(e.target.value)}
                    className="border-0 bg-transparent text-xs font-mono font-bold text-foreground focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 提示条目 */}
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 flex items-start gap-2">
              <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">清单口径约束：</div>
                <div className="text-[11px] text-amber-600/90 mt-0.5 leading-relaxed">
                  本模块仅对清单明确标定为“界面手动录入”项生效。重点设备用电、光伏电量、热泵COP等系统接入项由 SCADA/IoT 自动采集，严禁手工重复填报。
                </div>
              </div>
            </div>

            {/* 1. 分类：能源消耗量录入 (用水量、天然气量、外购蒸汽量、油消耗量、液氧) */}
            {currentCategory === 'energy_consumption' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 用水量 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Droplets className="size-4 text-blue-500" />
                        用水量
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">日/月</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={energyForm.waterVolume}
                        onChange={(e) => setEnergyForm({ ...energyForm, waterVolume: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入用水量"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">t (吨)</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">市政自来水表底抄报 / 水费单核对</div>
                  </div>

                  {/* 天然气量 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Flame className="size-4 text-amber-500" />
                        天然气量
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700">月度</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={energyForm.gasVolume}
                        onChange={(e) => setEnergyForm({ ...energyForm, gasVolume: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入天然气量"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">m³ (标方)</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">燃气锅炉与食堂加热消耗统计</div>
                  </div>

                  {/* 外购蒸汽量 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Layers className="size-4 text-indigo-500" />
                        外购蒸汽量
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700">月度</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={energyForm.steamVolume}
                        onChange={(e) => setEnergyForm({ ...energyForm, steamVolume: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入外购蒸汽量"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">t (吨)</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">园区集中供热与生产用蒸汽月度热量表抄表量</div>
                  </div>

                  {/* 油消耗量（柴油、煤油、汽油） */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Gauge className="size-4 text-rose-500" />
                        油消耗量 (柴油、煤油、汽油)
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700">月度</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={energyForm.oilVolume}
                        onChange={(e) => setEnergyForm({ ...energyForm, oilVolume: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入油消耗量"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">L (升)</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">备用发电机组、厂区叉车与物流燃油领用台账</div>
                  </div>

                  {/* 液氧 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Activity className="size-4 text-teal-500" />
                        液氧
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700">月度</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={energyForm.oxygenVolume}
                        onChange={(e) => setEnergyForm({ ...energyForm, oxygenVolume: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入液氧消耗量"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">t (吨)</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">工业切割与焊接助燃液氧储罐进料月度盘点</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 分类：能源费用账单录入 (市电费用、天然气费用、外购蒸汽费用、用水费用、油费用) */}
            {currentCategory === 'energy_cost' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 市电费用 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Zap className="size-4 text-amber-500" />
                        市电费用
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700">月度</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={costForm.gridElecCost}
                        onChange={(e) => setCostForm({ ...costForm, gridElecCost: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入市电账单金额"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">万元</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">电网结算电费发票总额 (含基本电费与力率调整)</div>
                  </div>

                  {/* 天然气费用 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Flame className="size-4 text-rose-500" />
                        天然气费用
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700">月度</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={costForm.gasCost}
                        onChange={(e) => setCostForm({ ...costForm, gasCost: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入天然气账单金额"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">万元</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">燃气公司月度对账结算发票金额</div>
                  </div>

                  {/* 外购蒸汽费用 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Layers className="size-4 text-indigo-500" />
                        外购蒸汽费用
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700">月度</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={costForm.steamCost}
                        onChange={(e) => setCostForm({ ...costForm, steamCost: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入蒸汽费用"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">万元</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">园区热力公司月度结算凭单金额</div>
                  </div>

                  {/* 用水费用 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Droplets className="size-4 text-blue-500" />
                        用水费用
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700">月度</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={costForm.waterCost}
                        onChange={(e) => setCostForm({ ...costForm, waterCost: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入用水费用"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">万元</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">自来水水务公司月度水费缴费通知单</div>
                  </div>

                  {/* 油费用 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <DollarSign className="size-4 text-emerald-500" />
                        油费用
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700">月度</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={costForm.oilCost}
                        onChange={(e) => setCostForm({ ...costForm, oilCost: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入油费用"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">万元</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">柴油采购发票与加油卡月度对账凭证</div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 分类：绿电与绿证交易录入 (购买绿电量、购买绿证量) */}
            {currentCategory === 'green_trade' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 购买绿电量 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Zap className="size-4 text-[#1677ff]" />
                        购买绿电量
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">园区及工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-bold">月</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={greenForm.purchasedGreenPowerMWh}
                        onChange={(e) => setGreenForm({ ...greenForm, purchasedGreenPowerMWh: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入购买绿电量"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">MWh (兆瓦时)</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">电力交易中心双边协商交易结算电量清单</div>
                  </div>

                  {/* 购买绿证量 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Award className="size-4 text-purple-500" />
                        购买绿证量
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">园区及工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-bold">月</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={greenForm.purchasedCertCount}
                        onChange={(e) => setGreenForm({ ...greenForm, purchasedCertCount: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入购买绿证张数"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">个 (张)</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">国家可再生能源信息管理中心 GEC 绿证核销张数</div>
                  </div>

                  {/* 绿电交易提供方与证书编号 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <label className="text-xs font-bold text-foreground">绿电提供方 / 项目来源</label>
                    <input
                      type="text"
                      value={greenForm.provider}
                      onChange={(e) => setGreenForm({ ...greenForm, provider: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      placeholder="例如: 三峡能源新疆哈密200MW光伏项目"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <label className="text-xs font-bold text-foreground">国家绿证凭证批号 (GEC)</label>
                    <input
                      type="text"
                      value={greenForm.certCode}
                      onChange={(e) => setGreenForm({ ...greenForm, certCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      placeholder="例如: CN-GEC-2026-HM-00921"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. 分类：工业增加值与非线缆产量 (工业增加值、产量-非线缆产业、项目公司) */}
            {currentCategory === 'production_economy' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 工业增加值 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Activity className="size-4 text-emerald-600" />
                        工业增加值 (月度、年度)
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700">月度/年度</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={economyForm.addedValueWan}
                        onChange={(e) => setEconomyForm({ ...economyForm, addedValueWan: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入工业增加值"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">万元</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">统计局口径工业增加值核算指标</div>
                  </div>

                  {/* 产量(非线缆产业、项目公司) */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Boxes className="size-4 text-blue-600" />
                        产量 (非线缆产业、项目公司)
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-bold">月</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={economyForm.nonCableProduction}
                        onChange={(e) => setEconomyForm({ ...economyForm, nonCableProduction: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg text-sm font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="请输入产量数值"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">台/套/件</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">变压器、电抗器、开关柜等离散工业装备月度完工产量</div>
                  </div>

                  {/* 产业类别与产品规格 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <label className="text-xs font-bold text-foreground">非线缆所属产业板块</label>
                    <input
                      type="text"
                      value={economyForm.industryType}
                      onChange={(e) => setEconomyForm({ ...economyForm, industryType: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2">
                    <label className="text-xs font-bold text-foreground">代表性产品规格说明</label>
                    <input
                      type="text"
                      value={economyForm.productSpec}
                      onChange={(e) => setEconomyForm({ ...economyForm, productSpec: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-xs bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. 分类：重点用能设备与项目事件 (能效2级设备明细、统计范围设备明细、零碳关键事件与照片) */}
            {currentCategory === 'equipment_project' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 达到或优于能效强制性国家标准2级的设备明细 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Gauge className="size-4 text-emerald-600" />
                        达到或优于能效强制性国家标准2级的设备明细 (名称、用途、功率等)
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 font-bold">增量更新</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={equipmentForm.level2EquipmentName}
                        onChange={(e) => setEquipmentForm({ ...equipmentForm, level2EquipmentName: e.target.value })}
                        className="px-3 py-2 rounded-lg text-xs bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="设备名称 (如: 超高效电机/工业锅炉)"
                      />
                      <input
                        type="text"
                        value={equipmentForm.level2EquipmentUsage}
                        onChange={(e) => setEquipmentForm({ ...equipmentForm, level2EquipmentUsage: e.target.value })}
                        className="px-3 py-2 rounded-lg text-xs bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="用途说明"
                      />
                      <div className="relative">
                        <input
                          type="number"
                          value={equipmentForm.level2EquipmentPowerKw}
                          onChange={(e) => setEquipmentForm({ ...equipmentForm, level2EquipmentPowerKw: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-xs font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                          placeholder="额定功率"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">kW</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      注：纳入统计范围的设备若有适用的能效强制性国家标准，且级别达到 2 级及以上 (电动机、变压器、工业锅炉、风机、空压机、制冷设备、热泵等)。
                    </div>
                  </div>

                  {/* 纳入统计范围设备明细 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Boxes className="size-4 text-blue-600" />
                        纳入统计范围设备明细 (名称、用途、功率等)
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-bold">工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 font-bold">增量更新</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={equipmentForm.statEquipmentName}
                        onChange={(e) => setEquipmentForm({ ...equipmentForm, statEquipmentName: e.target.value })}
                        className="px-3 py-2 rounded-lg text-xs bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        placeholder="设备名称 (如: 集中压缩空气站组)"
                      />
                      <div className="relative">
                        <input
                          type="number"
                          value={equipmentForm.statEquipmentPowerKw}
                          onChange={(e) => setEquipmentForm({ ...equipmentForm, statEquipmentPowerKw: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-xs font-mono font-bold bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                          placeholder="总装机功率"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">kW</span>
                      </div>
                    </div>
                  </div>

                  {/* 零碳关键事件与照片 */}
                  <div className="p-3.5 rounded-xl border border-border bg-panel space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Camera className="size-4 text-purple-600" />
                        零碳关键事件与园区现场照片
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 font-bold">园区/工厂</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 font-bold">增量更新</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={equipmentForm.keyEventTitle}
                        onChange={(e) => setEquipmentForm({ ...equipmentForm, keyEventTitle: e.target.value })}
                        className="px-3 py-2 rounded-lg text-xs bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary md:col-span-2"
                        placeholder="事件名称 (如: 光伏并网、储能投运、碳足迹上线、零碳工厂认证)"
                      />
                      <input
                        type="date"
                        value={equipmentForm.keyEventDate}
                        onChange={(e) => setEquipmentForm({ ...equipmentForm, keyEventDate: e.target.value })}
                        className="px-3 py-2 rounded-lg text-xs bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium cursor-pointer hover:bg-slate-50">
                        <Upload className="size-3.5 text-[#1677ff]" />
                        <span>上传园区/项目现场照片 (JPG/PNG)</span>
                        <input type="file" className="hidden" onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || '园区全景照片.jpg')} />
                      </label>
                      <span className="text-[11px] text-emerald-600 font-mono">
                        {attachmentName ? `已选择: ${attachmentName}` : '已默认关联园区整体全景航拍底图'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 凭证附件与填报备注 */}
            <div className="pt-4 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  单据凭证 / 账单对账单附件 (PDF / Excel / 照片)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium cursor-pointer hover:bg-slate-50">
                    <Upload className="size-3.5 text-slate-600" />
                    <span>选择上传文件</span>
                    <input type="file" className="hidden" onChange={(e) => setAttachmentName(e.target.files?.[0]?.name || '账单凭证.pdf')} />
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {attachmentName || '未选择附件 (可后续补传)'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  填报情况说明与异常备注
                </label>
                <input
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="如遇环比波动超限或工艺检修停产，请在此注明"
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>

            {/* 操作按钮组 */}
            <div className="pt-5 border-t border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldAlert className="size-4 text-blue-500" />
                <span>数据校验已通过 · 符合国家与行业折标标准</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSave('待复核')}
                  className="px-4 py-2 rounded-lg border border-border bg-panel text-xs font-semibold text-foreground hover:bg-slate-200/60 cursor-pointer transition-colors"
                >
                  暂存草稿
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('已入库')}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  <Save className="size-4" />
                  <span>校验并正式入库</span>
                </button>
              </div>
            </div>
          </Panel>
        </div>

        {/* 右侧：实时质控与标准规范对照 */}
        <div className="lg:col-span-4 space-y-4">
          <Panel className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Sparkles className="size-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-foreground">清单规则与下游驱动</h4>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-1.5 text-xs">
              <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="size-4" />
                <span>数据来源严格符合清单</span>
              </div>
              <p className="text-[11px] text-emerald-700/80 leading-relaxed">
                本工作台展示的 16 项指标全部为需求清单中来源明确标为【系统界面手动录入】或【录入】的必填数据，已剔除全部自动化接入项。
              </p>
            </div>

            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 space-y-1.5 text-xs text-blue-800">
              <div className="font-bold text-[#1677ff] flex items-center gap-1.5">
                <Gauge className="size-4" />
                <span>折标煤与碳排放因子</span>
              </div>
              <ul className="text-[11px] space-y-1 font-mono text-blue-700/90">
                <li>· 天然气折标煤: 1.33 kgce/m³</li>
                <li>· 蒸汽折标煤: 0.0941 tce/t</li>
                <li>· 电网碳排放因子: 0.5367 tCO₂/MWh</li>
              </ul>
            </div>

            <div className="border-t border-border/60 pt-3 space-y-2">
              <div className="text-xs font-bold text-foreground">下游计算引擎驱动：</div>
              <div className="space-y-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-blue-500" />
                  <span>大屏展示：月度总电量、绿电消纳量</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>集中监管：重点设备能效等级对标</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  <span>统计报表：能源月度费用账单核算</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-purple-500" />
                  <span>零碳项目评估：零碳事件与认证材料</span>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* 🌟 步骤四 · 已录入数据台账明细 (支持各分类快捷过滤) */}
      <Panel className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <History className="size-4.5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">已录入数据台账明细</h3>
            <Badge tone="info">{filteredRecords.length} 条记录</Badge>
          </div>

          {/* 类型筛选器 */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground/80">数据分类过滤：</span>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
                filterType === 'all'
                  ? 'bg-[#1677ff] text-white'
                  : 'bg-panel text-muted-foreground hover:bg-slate-200/70'
              )}
            >
              全部
            </button>
            {CATEGORY_LIST.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilterType(c.key)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  filterType === c.key
                    ? 'bg-[#1677ff] text-white'
                    : 'bg-panel text-muted-foreground hover:bg-slate-200/70'
                )}
              >
                {c.label.replace('录入', '')}
              </button>
            ))}
          </div>
        </div>

        {/* 台账表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-panel text-foreground font-semibold">
                <th className="py-2.5 px-3">批次号</th>
                <th className="py-2.5 px-3">数据分类</th>
                <th className="py-2.5 px-3">数据项名称</th>
                <th className="py-2.5 px-3">数据对象</th>
                <th className="py-2.5 px-3">时间维度</th>
                <th className="py-2.5 px-3">所属单位</th>
                <th className="py-2.5 px-3 font-bold">录入数值及摘要</th>
                <th className="py-2.5 px-3">录入时间</th>
                <th className="py-2.5 px-3 text-center">状态</th>
                <th className="py-2.5 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y border-border/60 text-muted-foreground">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-xs text-muted-foreground/80">
                    暂无符合条件的台账记录
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-foreground">{r.batch}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#1677ff]">
                        {r.categoryName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-foreground">{r.itemName}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-foreground font-mono">
                        {r.dataTarget}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{r.timeDim}</td>
                    <td className="py-2.5 px-3 font-medium text-foreground">{r.org}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.valueDisplay}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400">{r.submitTime}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(r.id)}
                        className="text-rose-500 hover:underline cursor-pointer"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

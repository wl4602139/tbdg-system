'use client'

import React, { useState, useMemo } from 'react'
import {
  FileEdit,
  Save,
  CheckCircle2,
  Calendar,
  History,
  Download,
  Upload,
  Plus,
  Trash2,
  X,
  Sparkles,
  Eye,
  Cpu,
  Zap,
  Droplet,
  Gauge,
  Factory,
  Check,
  RotateCcw,
  AlertTriangle,
  Building2,
  ChevronDown,
  Layers,
  Database,
  Sliders,
  ExternalLink,
  Table as TableIcon,
  RefreshCw,
} from 'lucide-react'
import { Panel, Badge } from '@/components/shared/primitives'
import { cn } from '@/lib/utils'

// =========================================================================
// 1. 特变电工 11 大标准工业产品大类目录库 (动态可扩展架构)
// =========================================================================
interface ProductDef {
  id: string
  name: string
  defaultUnit: string
  units: string[]
  defaultSource: 'auto' | 'manual' | 'mes'
  sourceLabel: string
  iconName: 'cpu' | 'zap' | 'factory' | 'gauge' | 'layers'
}

const TBEA_11_PRODUCT_CATALOG: ProductDef[] = [
  { id: 'transformer', name: '变压器', defaultUnit: '台/万kVA', units: ['台/万kVA', '台', '万kVA'], defaultSource: 'manual', sourceLabel: 'ERP待对接 (自填)', iconName: 'cpu' },
  { id: 'cable', name: '线缆', defaultUnit: 'km', units: ['km', '万米', '吨'], defaultSource: 'auto', sourceLabel: '大数据平台直通 (免填)', iconName: 'zap' },
  { id: 'switchgear', name: '开关柜', defaultUnit: '面/台', units: ['面/台', '面', '台'], defaultSource: 'manual', sourceLabel: '厂级MES/自填', iconName: 'factory' },
  { id: 'capacitor', name: '电容器', defaultUnit: '台/组', units: ['台/组', '台', 'kvar'], defaultSource: 'manual', sourceLabel: '厂级ERP/自填', iconName: 'zap' },
  { id: 'reactor', name: '电抗器', defaultUnit: '台/万kVA', units: ['台/万kVA', '台', '万kVA'], defaultSource: 'manual', sourceLabel: '厂级ERP/自填', iconName: 'cpu' },
  { id: 'bushing', name: '套管', defaultUnit: '支/套', units: ['支/套', '支', '套'], defaultSource: 'manual', sourceLabel: '厂级MES/自填', iconName: 'gauge' },
  { id: 'instrument_transformer', name: '互感器', defaultUnit: '台/只', units: ['台/只', '台', '只'], defaultSource: 'manual', sourceLabel: '厂级ERP/自填', iconName: 'cpu' },
  { id: 'gis', name: 'GIS', defaultUnit: '间隔/套', units: ['间隔/套', '间隔', '套'], defaultSource: 'manual', sourceLabel: '工程台账/自填', iconName: 'factory' },
  { id: 'gil', name: 'GIL', defaultUnit: '米/相米', units: ['米/相米', '米', '相米'], defaultSource: 'manual', sourceLabel: '工程台账/自填', iconName: 'gauge' },
  { id: 'silicon_steel_core', name: '硅钢铁心', defaultUnit: '吨', units: ['吨', '千克'], defaultSource: 'mes', sourceLabel: '车间MES直通', iconName: 'layers' },
  { id: 'amorphous_core', name: '非晶合金铁心', defaultUnit: '吨', units: ['吨', '千克'], defaultSource: 'mes', sourceLabel: '车间MES直通', iconName: 'layers' },
]

// 细分型号条目
interface ProductModelItem {
  id: string
  modelCode: string
  modelName: string
  output: string
  remark?: string
}

// 实际已启用的产品填报记录
interface ActiveProductRecord {
  id: string
  categoryId: string
  categoryName: string
  unit: string
  value: string
  lastMonthValue: string
  sourceType: 'auto' | 'manual' | 'mes'
  sourceLabel: string
  isPrimary: boolean
  models: ProductModelItem[]
}

// 设备明细模型
interface EquipmentItem {
  id: string
  name: string
  type: '超高效电动机' | '节能变压器' | '工业锅炉' | '风机' | '空压机' | '制冷设备' | '热泵' | '其他重点设备'
  usage: string
  powerKw: number
}

// 零碳关键事件模型
interface KeyEventItem {
  id: string
  date: string
  title: string
  type: '光伏并网' | '储能投运' | '碳足迹上线' | '零碳认证' | '技改节电'
}

// 基础能耗与经济指标
interface MetricItem {
  id: string
  name: string
  category: 'energy' | 'cost' | 'green' | 'economy'
  categoryLabel: string
  unit: string
  value: string
  lastMonthValue: string
  remark: string
}

// 辅助函数：按月度总量生成 31 天合理日数据
const generateInitialDaily = (total: number, days: number = 31) => {
  const avg = total / days
  return Array.from({ length: days }, (_, i) => {
    const factor = 1 + ((i % 5) - 2) * 0.02
    return Math.round(avg * factor * 10) / 10
  })
}

// 初始常规指标 (14项：5项介质消耗 + 5项费用发票 + 4项绿电)
const INITIAL_METRICS: MetricItem[] = [
  // 1. 能源消耗量 (5项)
  { id: 'm-1', name: '用水量', category: 'energy', categoryLabel: '能源消耗量', unit: 't', value: '8900', lastMonthValue: '8650', remark: '市政自来水水表月度抄报底数' },
  { id: 'm-2', name: '天然气量', category: 'energy', categoryLabel: '能源消耗量', unit: 'm³', value: '28400', lastMonthValue: '27200', remark: '燃气锅炉与车间烘干加热消耗' },
  { id: 'm-3', name: '外购蒸汽量', category: 'energy', categoryLabel: '能源消耗量', unit: 't', value: '1420', lastMonthValue: '1380', remark: '集中供热管网蒸汽抄表结算量' },
  { id: 'm-4', name: '油消耗量（柴油、煤油、汽油）', category: 'energy', categoryLabel: '能源消耗量', unit: 'L', value: '320', lastMonthValue: '350', remark: '应急发电机组试车与厂区叉车加油领用' },
  { id: 'm-5', name: '液氧', category: 'energy', categoryLabel: '能源消耗量', unit: 't', value: '45.0', lastMonthValue: '42.0', remark: '钢板下料切割与绝缘件加工助燃消耗' },

  // 2. 能源费用账单 (5项)
  { id: 'm-6', name: '市电费用', category: 'cost', categoryLabel: '能源费用', unit: '万元', value: '142.50', lastMonthValue: '138.20', remark: '国网电力月度电费增值税发票总额' },
  { id: 'm-7', name: '天然气费用', category: 'cost', categoryLabel: '能源费用', unit: '万元', value: '8.52', lastMonthValue: '8.16', remark: '新奥燃气月度发票结算金额' },
  { id: 'm-8', name: '外购蒸汽费用', category: 'cost', categoryLabel: '能源费用', unit: '万元', value: '32.66', lastMonthValue: '31.74', remark: '园区热力公司当期发票对账单' },
  { id: 'm-9', name: '用水费用', category: 'cost', categoryLabel: '能源费用', unit: '万元', value: '4.89', lastMonthValue: '4.76', remark: '自来水水务集团缴费凭单' },
  { id: 'm-10', name: '油费用', category: 'cost', categoryLabel: '能源费用', unit: '万元', value: '0.24', lastMonthValue: '0.26', remark: '中石化加油卡充值及柴油发票' },

  // 3. 购买绿电交易参数 (4项)
  { id: 'm-11', name: '购买绿电量（kWh）', category: 'green', categoryLabel: '购买绿电', unit: 'kWh', value: '1482000', lastMonthValue: '1200000', remark: '三峡能源哈密200MW光伏电站双边交易电量' },
  { id: 'm-12', name: '购买绿证量', category: 'green', categoryLabel: '购买绿电', unit: '个', value: '18000', lastMonthValue: '15000', remark: '国家绿色电力证书 GEC 划转入账' },
  { id: 'm-12-price', name: '结算单价', category: 'green', categoryLabel: '购买绿电', unit: '元/kWh', value: '0.4280', lastMonthValue: '0.4250', remark: '绿电综合结算到厂单价' },
  { id: 'm-12-date', name: '交易日期', category: 'green', categoryLabel: '购买绿电', unit: '日期', value: '2026-08-18', lastMonthValue: '2026-07-20', remark: '电力交易中心双边合同执行日期' },
]

// 默认两台标准设备 (超高效电动机、节能变压器)
const INITIAL_EQUIPMENT_LEVEL2: EquipmentItem[] = [
  { id: 'eq-1', name: '超高效电动机', type: '超高效电动机', usage: '生产车间空压机主驱动', powerKw: 160 },
  { id: 'eq-2', name: '节能变压器', type: '节能变压器', usage: '10kV动力变电所主供', powerKw: 1600 },
]
const INITIAL_EQUIPMENT_ALL: EquipmentItem[] = [
  { id: 'eq-3', name: '超高效电动机', type: '超高效电动机', usage: '生产车间空压机主驱动', powerKw: 160 },
  { id: 'eq-4', name: '节能变压器', type: '节能变压器', usage: '10kV动力变电所主供', powerKw: 1600 },
]

// 初始默认启用的产品清单 (以沈变为例，默认生产变压器、电抗器、硅钢铁心)
const INITIAL_ACTIVE_PRODUCTS: ActiveProductRecord[] = [
  {
    id: 'prod-1',
    categoryId: 'transformer',
    categoryName: '变压器',
    unit: '台/万kVA',
    value: '128',
    lastMonthValue: '122',
    sourceType: 'manual',
    sourceLabel: 'ERP待对接 (自填)',
    isPrimary: true,
    models: [
      { id: 'm-101', modelCode: 'TB-S20-630', modelName: 'S20-M-630/10 高效油浸式变压器', output: '48' },
      { id: 'm-102', modelCode: 'TB-SZ11-50M', modelName: 'SZ11-50000/110 有载调压变压器', output: '36' },
      { id: 'm-103', modelCode: 'TB-ODFPS-1000', modelName: 'ODFPS-1000MVA/1000kV 特高压变压器', output: '44' },
    ],
  },
  {
    id: 'prod-2',
    categoryId: 'reactor',
    categoryName: '电抗器',
    unit: '台/万kVA',
    value: '45',
    lastMonthValue: '40',
    sourceType: 'manual',
    sourceLabel: '厂级ERP/自填',
    isPrimary: true,
    models: [
      { id: 'm-201', modelCode: 'TB-BKD-66', modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器', output: '45' },
    ],
  },
  {
    id: 'prod-3',
    categoryId: 'silicon_steel_core',
    categoryName: '硅钢铁心',
    unit: '吨',
    value: '3200',
    lastMonthValue: '3100',
    sourceType: 'mes',
    sourceLabel: '车间MES直通',
    isPrimary: false,
    models: [
      { id: 'm-301', modelCode: 'TB-CORE-023', modelName: '0.23mm 高磁感取向硅钢铁心', output: '3200' },
    ],
  },
]

// 自动直通免填数据清单 (盘点表第 2, 4, 5, 7 项)
const AUTO_SYNC_DATA_LIST = [
  { id: 'sync-1', name: '线缆产量数据（各项目公司）', category: '产量数据', sourceSystem: '股份大数据平台', value: '1,560 km', syncTime: '2026-08-31 06:00', status: '已直通免填', note: '大数据平台已有完备日台账，各线缆项目公司100%免填' },
  { id: 'sync-2', name: '各项目公司产值数据', category: '产值数据', sourceSystem: '经营日报系统', value: '45,820 万元', syncTime: '2026-08-31 04:30', status: '已直通免填', note: '日结经营数据直通项目公司级，无需企业手动录入' },
  { id: 'sync-3', name: '经营单位级产值汇总', category: '产值数据', sourceSystem: '经营日报系统', value: '182,400 万元', syncTime: '2026-08-31 04:30', status: '系统自动加总', note: '项目公司产值加总即经营单位产值，算法闭环自动沉淀' },
  { id: 'sync-4', name: '单位产品综合能耗（电耗）', category: '能耗数据', sourceSystem: '能耗采集系统/ERP', value: '38.4 kWh/kVA', syncTime: '2026-08-31 08:00', status: '系统核算预填', note: 'SCADA与智能电表自动聚合，企业一键确认' },
]

// 主数据与型号编码映射表 (解决变压器及各品类编码不一痛点，盘点表第 8~13 项)
const INITIAL_CODE_MAPPINGS = [
  { id: 'map-1', category: '变压器', stdModel: 'S20-M-630/10', companyCode: '沈变: SB-T-00912 / 衡变: HB-TR-881', lineName: '总装一线', status: '已映射' },
  { id: 'map-2', category: '变压器', stdModel: 'SZ11-50000/110', companyCode: '沈变: SB-T-01440 / 新变: XB-TX-662', lineName: '超高压车间', status: '已映射' },
  { id: 'map-3', category: '电抗器', stdModel: 'BKD-66kV/20000kvar', companyCode: '沈变: SB-DK-0021 / 衡变: HB-DK-019', lineName: '特种电抗器线', status: '已映射' },
  { id: 'map-4', category: '线缆', stdModel: 'YJV22-8.7/15kV 3*400', companyCode: '鲁缆: LL-CB-9102 / 新缆: XL-CB-9102', lineName: '中压交联三线', status: '已映射' },
  { id: 'map-5', category: '开关柜', stdModel: 'KYN28A-12', companyCode: '中发: ZF-SW-1288', lineName: '成套柜柔性线', status: '已映射' },
]

interface HistoryRecord {
  id: string
  batch: string
  year: string
  month: string
  submitter: string
  submitTime: string
  summary: string
  totalCostWan: string
  status: '已入库' | '待复核'
}

export default function FactoryMonthlyReportingPage() {
  // 视图模式：'entry' (填报工作台) | 'history' (历史台账)
  const [viewMode, setViewMode] = useState<'entry' | 'history'>('entry')

  // 申报账期
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonth, setSelectedMonth] = useState('08')
  const [submitterName, setSubmitterName] = useState('李工 (能碳专员)')

  // 14 项常规指标
  const [metrics, setMetrics] = useState<MetricItem[]>(INITIAL_METRICS)

  // 工业增加值 (单独作为经济核心指标)
  const [industrialAddValue, setIndustrialAddValue] = useState('4200.0')

  // 动态多产品填报列表 (可随时从 11 大类追加或删除)
  const [activeProducts, setActiveProducts] = useState<ActiveProductRecord[]>(INITIAL_ACTIVE_PRODUCTS)

  // 增报产品弹窗与状态
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [selectedCatToAdd, setSelectedCatToAdd] = useState<string>('switchgear')
  const [customProductName, setCustomProductName] = useState('')

  // 细分型号弹窗状态
  const [editingModelProduct, setEditingModelProduct] = useState<ActiveProductRecord | null>(null)
  const [newModelCode, setNewModelCode] = useState('')
  const [newModelName, setNewModelName] = useState('')
  const [newModelOutput, setNewModelOutput] = useState('')

  // 查看自动直通免填数据抽屉/弹窗
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)

  // 查看/维护主数据与编码映射抽屉/弹窗
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false)
  const [mappingList, setMappingList] = useState(INITIAL_CODE_MAPPINGS)

  // 用水量 (m-1) 与 外购蒸汽量 (m-3) 的 日 / 月 填报模式切换
  const [dimModes, setDimModes] = useState<{ 'm-1': 'month' | 'day'; 'm-3': 'month' | 'day' }>({
    'm-1': 'month',
    'm-3': 'month',
  })
  const [waterDailyList, setWaterDailyList] = useState<number[]>(() => generateInitialDaily(8900, 31))
  const [steamDailyList, setSteamDailyList] = useState<number[]>(() => generateInitialDaily(1420, 31))
  const [activeDailyModal, setActiveDailyModal] = useState<'m-1' | 'm-3' | null>(null)
  const [tempDailyList, setTempDailyList] = useState<number[]>([])

  // 设备台账
  const [equipListLevel2, setEquipListLevel2] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT_LEVEL2)
  const [equipListAll, setEquipListAll] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT_ALL)

  // 零碳园区基本信息
  const [parkInfo, setParkInfo] = useState({
    name: '特变电工沈变工业示范园区',
    location: '辽宁省沈阳市铁西区经济技术开发区二十二号路',
    content: '2.8MWp分布式屋顶光伏扩建工程、10kV智能变配电节能改造、空压机余热循环利用、全厂能碳微电网数字化系统',
    scale: '光伏装机2.8MWp，年发绿电约320万kWh，园区绿电消纳率超65%',
  })
  const [isParkInfoModalOpen, setIsParkInfoModalOpen] = useState(false)
  const [parkPhotos, setParkPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=60',
  ])
  const [isParkPhotoModalOpen, setIsParkPhotoModalOpen] = useState(false)
  const [keyEvents, setKeyEvents] = useState<KeyEventItem[]>([
    { id: 'ev-1', date: '2026-08-15', title: '特变电工沈变本部 2.8MWp 分布式光伏扩建工程顺利并网投运', type: '光伏并网' },
    { id: 'ev-2', date: '2026-06-20', title: '零碳智慧园区能源管理系统 2.0 (SCADA/IoT) 全面验收上线', type: '碳足迹上线' },
    { id: 'ev-3', date: '2026-03-10', title: '通过中国质量认证中心 (CQC) 零碳工厂 (三星级) 现场初核', type: '零碳认证' },
  ])
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [newEventDate, setNewEventDate] = useState('2026-08-15')
  const [newEventTitle, setNewEventTitle] = useState('特变电工沈变本部 2.8MWp 分布式光伏扩建工程顺利并网投运')

  // 成功反馈
  const [successToast, setSuccessToast] = useState<{ show: boolean; msg: string; batch: string }>({
    show: false,
    msg: '',
    batch: '',
  })

  // 历史台账
  const [historyList, setHistoryList] = useState<HistoryRecord[]>([
    {
      id: 'REC-01',
      batch: 'DR-202608-01',
      year: '2026',
      month: '08',
      submitter: '李工 (能碳专员)',
      submitTime: '2026-08-28 09:30',
      summary: '用水 8,900t · 气 28,400m³ · 绿电 1,482,000kWh · 产变压器 128台 · 电抗器 45台 · 铁心 3,200吨',
      totalCostWan: '188.81',
      status: '已入库',
    },
    {
      id: 'REC-02',
      batch: 'DR-202607-02',
      year: '2026',
      month: '07',
      submitter: '王强',
      submitTime: '2026-07-28 14:15',
      summary: '用水 8,650t · 气 27,200m³ · 蒸汽 1,380t · 购绿电 1,200,000kWh · 增加值 ¥3,950万',
      totalCostWan: '175.40',
      status: '已入库',
    },
  ])

  // 修改单个指标值
  const handleMetricChange = (id: string, newVal: string) => {
    setMetrics((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newVal } : item))
    )
  }

  // 切换 日 / 月 填报模式
  const handleToggleDimMode = (id: 'm-1' | 'm-3', mode: 'month' | 'day') => {
    setDimModes((prev) => ({ ...prev, [id]: mode }))
    if (mode === 'day') {
      const list = id === 'm-1' ? waterDailyList : steamDailyList
      const sum = Math.round(list.reduce((a, b) => a + b, 0) * 10) / 10
      handleMetricChange(id, String(sum))
    }
  }

  const handleOpenDailyModal = (id: 'm-1' | 'm-3') => {
    setActiveDailyModal(id)
    const current = id === 'm-1' ? waterDailyList : steamDailyList
    setTempDailyList([...current])
  }

  const tempDailySum = useMemo(() => {
    return Math.round(tempDailyList.reduce((a, b) => a + (parseFloat(b as any) || 0), 0) * 10) / 10
  }, [tempDailyList])

  const handleSaveDailyModal = () => {
    if (!activeDailyModal) return
    if (activeDailyModal === 'm-1') {
      setWaterDailyList(tempDailyList)
      handleMetricChange('m-1', String(tempDailySum))
    } else {
      setSteamDailyList(tempDailyList)
      handleMetricChange('m-3', String(tempDailySum))
    }
    setActiveDailyModal(null)
  }

  // 快捷功能：⚡ 一键带入上月数据
  const handleApplyLastMonthData = () => {
    if (confirm('确认使用【2026年07月】历史基准数据自动填充当前申报表？')) {
      setMetrics((prev) =>
        prev.map((item) => ({ ...item, value: item.lastMonthValue }))
      )
      setIndustrialAddValue('3950.0')
      setActiveProducts((prev) =>
        prev.map((p) => ({ ...p, value: p.lastMonthValue }))
      )
      setSuccessToast({
        show: true,
        msg: '已成功带入上月基准数据！您可以针对本月实际变动项进行微调后直接提交。',
        batch: 'FAST-FILL',
      })
      setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
    }
  }

  // 计算填报完成进度
  const completedCount = useMemo(() => {
    const mCount = metrics.filter((m) => m.value && m.value.trim() !== '').length
    const pCount = activeProducts.filter((p) => p.value && p.value.trim() !== '').length
    const addCount = industrialAddValue.trim() !== '' ? 1 : 0
    return mCount + pCount + addCount
  }, [metrics, activeProducts, industrialAddValue])

  const totalItemsCount = metrics.length + activeProducts.length + 1
  const progressPercent = Math.round((completedCount / totalItemsCount) * 100)

  // 计算本月能源费用总支出
  const totalCostWan = useMemo(() => {
    return metrics
      .filter((m) => m.category === 'cost')
      .reduce((sum, m) => sum + (parseFloat(m.value) || 0), 0)
      .toFixed(2)
  }, [metrics])

  // 设备总装机功率
  const level2TotalKw = useMemo(() => equipListLevel2.reduce((s, e) => s + e.powerKw, 0), [equipListLevel2])
  const allEquipTotalKw = useMemo(() => equipListAll.reduce((s, e) => s + e.powerKw, 0), [equipListAll])

  // 增报新产品
  const handleConfirmAddProduct = () => {
    const def = TBEA_11_PRODUCT_CATALOG.find((d) => d.id === selectedCatToAdd)
    const catName = selectedCatToAdd === 'custom' ? (customProductName.trim() || '新产品') : (def?.name || '新产品')
    const unit = def?.defaultUnit || '台/套'
    const sourceLabel = def?.sourceLabel || '企业自填'
    const sourceType = def?.defaultSource || 'manual'

    // 检查是否已存在
    const exists = activeProducts.some((p) => p.categoryName === catName)
    if (exists) {
      alert(`产品分类【${catName}】已在列表中，请直接在表格中编辑！`)
      return
    }

    const newRecord: ActiveProductRecord = {
      id: `prod-${Date.now()}`,
      categoryId: selectedCatToAdd,
      categoryName: catName,
      unit,
      value: '0',
      lastMonthValue: '0',
      sourceType,
      sourceLabel,
      isPrimary: false,
      models: [],
    }

    setActiveProducts([...activeProducts, newRecord])
    setIsAddProductModalOpen(false)
    setCustomProductName('')
    setSuccessToast({
      show: true,
      msg: `已成功增报产品分类【${catName}】，可直接在产品表格中维护产量与型号。`,
      batch: 'ADD-PROD',
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3500)
  }

  // 移除增报的产品
  const handleRemoveProduct = (id: string, name: string) => {
    if (confirm(`确认移除产品【${name}】的当月产量填报行？`)) {
      setActiveProducts(activeProducts.filter((p) => p.id !== id))
    }
  }

  // 修改产品产量
  const handleProductOutputChange = (id: string, newVal: string) => {
    setActiveProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, value: newVal } : p))
    )
  }

  // 修改产品单位
  const handleProductUnitChange = (id: string, newUnit: string) => {
    setActiveProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, unit: newUnit } : p))
    )
  }

  // 保存细分型号并自动重新汇总产量
  const handleSaveModels = (productId: string, updatedModels: ProductModelItem[]) => {
    const sum = updatedModels.reduce((acc, cur) => acc + (parseFloat(cur.output) || 0), 0)
    setActiveProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              models: updatedModels,
              value: updatedModels.length > 0 ? String(sum) : p.value,
            }
          : p
      )
    )
    setEditingModelProduct(null)
  }

  // 添加细分型号
  const handleAddSingleModel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingModelProduct || !newModelName.trim() || !newModelOutput.trim()) return

    const newM: ProductModelItem = {
      id: `m-${Date.now()}`,
      modelCode: newModelCode.trim() || `TB-${Date.now().toString().slice(-4)}`,
      modelName: newModelName.trim(),
      output: newModelOutput.trim(),
    }
    const updated = [...editingModelProduct.models, newM]
    setEditingModelProduct({ ...editingModelProduct, models: updated })
    handleSaveModels(editingModelProduct.id, updated)

    setNewModelCode('')
    setNewModelName('')
    setNewModelOutput('')
  }

  // 删除细分型号
  const handleDeleteSingleModel = (modelId: string) => {
    if (!editingModelProduct) return
    const updated = editingModelProduct.models.filter((m) => m.id !== modelId)
    setEditingModelProduct({ ...editingModelProduct, models: updated })
    handleSaveModels(editingModelProduct.id, updated)
  }

  // 提交保存入库
  const handleSaveEntry = (status: '已入库' | '待复核') => {
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const batchCode = `DR-${selectedYear}${selectedMonth}-${String(historyList.length + 1).padStart(2, '0')}`

    const prodSummary = activeProducts.map((p) => `${p.categoryName} ${p.value}${p.unit}`).join(' · ')
    const summaryText = `水 ${metrics[0].value}t · 气 ${metrics[1].value}m³ · 绿电 ${metrics[10].value}kWh · ${prodSummary} · 园区信息已归档`

    const newRecord: HistoryRecord = {
      id: `REC-${Date.now()}`,
      batch: batchCode,
      year: selectedYear,
      month: selectedMonth,
      submitter: submitterName,
      submitTime: timeStr,
      summary: summaryText,
      totalCostWan,
      status,
    }

    setHistoryList([newRecord, ...historyList])
    setSuccessToast({
      show: true,
      msg: `${selectedYear}年${selectedMonth}月工厂数据申报已成功${status === '已入库' ? '校验入库' : '保存待复核'}！已自动计入台账。已联动 11 大类工业产品。`,
      batch: batchCode,
    })

    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4500)
  }

  return (
    <div className="space-y-4">
      {/* 🌟 1. 顶部工厂月度申报看板 */}
      <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary">
              <Factory className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-foreground">
                  {selectedYear} 年 {selectedMonth} 月度工厂能碳数据定时申报
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  申报开放中
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                申报单位：<span className="font-semibold text-foreground">特变电工沈阳变压器工厂</span> · 截止时间：2026-09-05 24:00 (剩余 2 天)
              </p>
            </div>
          </div>

          {/* 快捷操作区 */}
          <div className="flex items-center gap-2">
            {/* 一键带入上月数据 */}
            <button
              type="button"
              onClick={handleApplyLastMonthData}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer transition-all shadow-2xs"
              title="复用7月份已有数据，快速完成8月微调"
            >
              <Zap className="size-3.5 text-amber-400 fill-amber-400" />
              <span>一键带入上月数据</span>
            </button>

            {/* 查看直通免填数据 */}
            <button
              type="button"
              onClick={() => setIsSyncModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-panel/70 hover:bg-panel/90 text-xs font-bold text-foreground cursor-pointer transition-colors shadow-2xs"
              title="查看股份大数据平台与经营日报已直通免填的数据清单"
            >
              <Database className="size-3.5 text-emerald-400" />
              <span>直通免填数据 (4项)</span>
            </button>

            {/* 编码映射中心 */}
            <button
              type="button"
              onClick={() => setIsMappingModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-panel/70 hover:bg-panel/90 text-xs font-bold text-foreground cursor-pointer transition-colors shadow-2xs"
              title="维护变压器及各产品型号与各分厂物料编码的映射关系"
            >
              <Sliders className="size-3.5 text-primary" />
              <span>主数据编码映射</span>
            </button>

            {/* 历史台账 */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'entry' ? 'history' : 'entry')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-panel/70 hover:bg-panel/90 text-xs font-bold text-foreground cursor-pointer transition-colors shadow-2xs"
            >
              <History className="size-3.5 text-primary" />
              <span>历史台账 ({historyList.length})</span>
            </button>
          </div>
        </div>

        {/* 自动化直通横条 (减负自解释，免除大面积冗杂表单) */}
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-emerald-200">免填减负已生效：</strong>
              线缆产量、项目公司产值、经营单位产值及单位电耗已由<strong>股份大数据平台与经营日报直通集成</strong>，企业无需重复填报。
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSyncModalOpen(true)}
            className="text-[11px] underline text-emerald-400 hover:text-emerald-200 cursor-pointer font-bold shrink-0"
          >
            查看直通清单 ➔
          </button>
        </div>

        {/* 申报进度条 */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-1">
            <span className="font-bold text-foreground shrink-0">
              申报完成度：
              <span className="text-primary font-mono text-sm">{completedCount}</span> / {totalItemsCount} 项
            </span>
            <div className="flex-1 max-w-sm h-2 rounded-full bg-slate-800 overflow-hidden border border-border/60">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-muted-foreground/70">{progressPercent}%</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            当前支持：<strong className="text-foreground">11 大类工业产品动态扩展</strong> · 44px 工业高密度表格
          </span>
        </div>
      </div>

      {/* 成功入库提示 */}
      {successToast.show && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-2.5 text-xs text-emerald-300 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span className="font-bold">操作成功（{successToast.batch}）：</span>
            <span>{successToast.msg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast({ show: false, msg: '', batch: '' })}
            className="text-emerald-400 hover:text-emerald-200 cursor-pointer font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 视图模式 1：填报工作台 */}
      {/* ========================================================================= */}
      {viewMode === 'entry' && (
        <div className="space-y-4">
          {/* 🌟 核心高可扩展板块：工业产品产量与产能填报区 (涵盖 11 大类，44px 高密度工业网格) */}
          <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <Cpu className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">工业产品产量与产能填报 (支持 11 大类产品柔性扩展)</h3>
                  <p className="text-[11px] text-muted-foreground">
                    可按需增报变压器、线缆、开关柜、电抗器、套管、GIS/GIL、铁心等产品，支持展开细分物料型号明细
                  </p>
                </div>
              </div>

              {/* 右侧扩展操作 */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="size-3.5" />
                  <span>增报产品品类</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('已生成特变电工 11 大类工业产品标准申报 Excel 模版！')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-panel/70 text-xs font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
                >
                  <Download className="size-3.5 text-muted-foreground" />
                  <span>全品类模版</span>
                </button>
              </div>
            </div>

            {/* 44px 高密度工业表格 */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="h-[44px] bg-[#0b1324]/80 text-muted-foreground border-b border-border font-bold select-none">
                    <th className="px-4 py-0">产品种类</th>
                    <th className="px-4 py-0">计量单位</th>
                    <th className="px-4 py-0">当月实际产量</th>
                    <th className="px-4 py-0">上月同期</th>
                    <th className="px-4 py-0">采集模式</th>
                    <th className="px-4 py-0">细分型号台账</th>
                    <th className="px-4 py-0 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border/60">
                  {activeProducts.map((p) => {
                    const def = TBEA_11_PRODUCT_CATALOG.find((d) => d.id === p.categoryId)
                    const unitOptions = def?.units || [p.unit]

                    return (
                      <tr key={p.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                        {/* 产品大类 */}
                        <td className="px-4 py-0 font-bold text-foreground">
                          <div className="flex items-center gap-2">
                            <span className={cn("size-2 rounded-full", p.isPrimary ? "bg-primary" : "bg-blue-400")} />
                            <span>{p.categoryName}</span>
                            {p.isPrimary && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20 font-medium">
                                主营
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 计量单位 */}
                        <td className="px-4 py-0">
                          {unitOptions.length > 1 ? (
                            <select
                              value={p.unit}
                              onChange={(e) => handleProductUnitChange(p.id, e.target.value)}
                              className="px-2 py-1 rounded border bg-[#0b1324] border-border text-foreground text-xs font-mono font-bold focus:outline-none"
                            >
                              {unitOptions.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-mono text-muted-foreground">{p.unit}</span>
                          )}
                        </td>

                        {/* 当月实际产量 (44px 紧凑内嵌输入) */}
                        <td className="px-4 py-0">
                          <div className="relative flex items-center max-w-[180px]">
                            <input
                              type="number"
                              step="any"
                              value={p.value}
                              onChange={(e) => handleProductOutputChange(p.id, e.target.value)}
                              className="w-full pl-2.5 pr-10 py-1 rounded-md border bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs font-mono font-bold focus:outline-none"
                              placeholder="0"
                            />
                            <span className="absolute right-2 text-[11px] font-mono text-muted-foreground/70 select-none">
                              {p.unit}
                            </span>
                          </div>
                        </td>

                        {/* 上月同期 */}
                        <td className="px-4 py-0 font-mono text-muted-foreground">
                          {p.lastMonthValue} {p.unit}
                        </td>

                        {/* 采集模式状态徽章 (自解释，杜绝多余说教) */}
                        <td className="px-4 py-0">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-bold border',
                              p.sourceType === 'auto'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : p.sourceType === 'mes'
                                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            )}
                          >
                            {p.sourceLabel}
                          </span>
                        </td>

                        {/* 细分型号明细按钮 */}
                        <td className="px-4 py-0">
                          <button
                            type="button"
                            onClick={() => setEditingModelProduct(p)}
                            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                          >
                            <TableIcon className="size-3.5" />
                            <span>
                              型号明细 ({p.models.length > 0 ? p.models.length : '未登记'})
                            </span>
                          </button>
                        </td>

                        {/* 操作 */}
                        <td className="px-4 py-0 text-right">
                          {!p.isPrimary ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(p.id, p.categoryName)}
                              className="text-muted-foreground hover:text-rose-500 p-1 cursor-pointer transition-colors"
                              title="移除增报"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground/70 select-none">基础品类</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 业务分组卡片：能源消耗与发票账单 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 卡片 1：💧 能源介质消耗量 (5项) */}
            <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                    <Droplet className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">1. 能源介质实物消耗量</h3>
                    <p className="text-[11px] text-muted-foreground">水、气、蒸汽、油料、液氧实测消耗（支持日/月灵活填报）</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/40 text-amber-300 border border-amber-800/60 font-bold">
                  5 项指标
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {metrics.slice(0, 5).map((m) => {
                  const isDayMonthSupported = m.id === 'm-1' || m.id === 'm-3'
                  const mode = isDayMonthSupported ? dimModes[m.id as 'm-1' | 'm-3'] : 'month'

                  return (
                    <div key={m.id} className="p-3 rounded-xl border bg-panel/70 border-border space-y-1.5 focus-within:border-primary transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-foreground">{m.name}</span>
                          {isDayMonthSupported && (
                            <div className="flex items-center bg-[#0b1324] border border-border p-0.5 rounded-md text-[10px]">
                              <button
                                type="button"
                                onClick={() => handleToggleDimMode(m.id as 'm-1' | 'm-3', 'month')}
                                className={cn(
                                  'px-1.5 py-0.5 rounded font-bold cursor-pointer transition-all',
                                  mode === 'month'
                                    ? 'bg-card border-border text-primary shadow-2xs border'
                                    : 'text-muted-foreground/70 hover:text-foreground'
                                )}
                              >
                                月数据
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleDimMode(m.id as 'm-1' | 'm-3', 'day')}
                                className={cn(
                                  'px-1.5 py-0.5 rounded font-bold cursor-pointer transition-all',
                                  mode === 'day'
                                    ? 'bg-primary text-primary-foreground shadow-2xs'
                                    : 'text-muted-foreground/70 hover:text-foreground'
                                )}
                              >
                                日数据
                              </button>
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground/70">上月: {m.lastMonthValue} {m.unit}</span>
                      </div>

                      {isDayMonthSupported && mode === 'day' ? (
                        <div className="flex items-center gap-2">
                          <div className="relative flex items-center flex-1">
                            <input
                              type="text"
                              readOnly
                              value={m.value}
                              className="w-full pl-3 pr-16 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs font-mono font-bold shadow-2xs"
                            />
                            <span className="absolute right-3 text-[10px] font-bold text-primary select-none">
                              {m.unit} (日累加)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenDailyModal(m.id as 'm-1' | 'm-3')}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shrink-0 shadow-2xs"
                          >
                            <Calendar className="size-3.5" />
                            <span>录入日数据</span>
                          </button>
                        </div>
                      ) : (
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            step="any"
                            value={m.value}
                            onChange={(e) => handleMetricChange(m.id, e.target.value)}
                            className="w-full pl-3 pr-12 py-1.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                            placeholder="输入数值..."
                          />
                          <span className="absolute right-3 text-xs font-mono font-bold text-muted-foreground/70 select-none">
                            {m.unit}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 卡片 2：💰 能源费用账单 (5项) */}
            <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">2. 能源费用发票账单</h3>
                    <p className="text-[11px] text-muted-foreground">市电、天然气、蒸汽、水务、油品结算总额</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 font-mono text-xs font-bold">
                  <span className="text-[10px] text-emerald-400 font-normal">费用合计:</span>
                  <span className="text-sm font-black">¥ {totalCostWan}</span>
                  <span className="text-[10px]">万元</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {metrics.slice(5, 10).map((m) => {
                  return (
                    <div key={m.id} className="p-3 rounded-xl border bg-panel/70 border-border space-y-1.5 focus-within:border-emerald-500 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{m.name}</span>
                        <span className="text-[11px] font-mono text-muted-foreground/70">上月: ¥{m.lastMonthValue}万</span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="any"
                          value={m.value}
                          onChange={(e) => handleMetricChange(m.id, e.target.value)}
                          className="w-full pl-3 pr-14 py-1.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                          placeholder="输入金额..."
                        />
                        <span className="absolute right-3 text-xs font-mono font-bold text-muted-foreground/70 select-none">
                          万元
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 卡片 3：🌿 购买绿电交易与经济指标 */}
            <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">3. 购买绿电交易与工业增加值</h3>
                    <p className="text-[11px] text-muted-foreground">外购绿电/绿证交易参数与政府直报口径工业增加值</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950/40 text-purple-300 border border-purple-800/60 font-bold">
                  5 项参数
                </span>
              </div>

              {/* 购买绿电交易参数 */}
              <div className="p-3 rounded-xl border border-purple-900/40 bg-purple-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-300">购买绿电交易参数</span>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded font-bold">
                    4 项参数
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {metrics.slice(10, 14).map((m) => (
                    <div key={m.id} className="p-2.5 rounded-lg border bg-[#0e182e] border-border space-y-1 focus-within:border-purple-500">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{m.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground/70">
                          上月: {m.lastMonthValue} {m.unit !== '日期' ? m.unit : ''}
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        {m.unit === '日期' ? (
                          <input
                            type="date"
                            value={m.value}
                            onChange={(e) => handleMetricChange(m.id, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                          />
                        ) : (
                          <>
                            <input
                              type="number"
                              step="any"
                              value={m.value}
                              onChange={(e) => handleMetricChange(m.id, e.target.value)}
                              className="w-full pl-3 pr-16 py-1.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                              placeholder="输入数值..."
                            />
                            <span className="absolute right-3 text-xs font-mono font-bold text-muted-foreground/70 select-none">
                              {m.unit}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 工业增加值 (统计局申报口径) */}
              <div className="p-3 rounded-xl border bg-panel/70 border-border space-y-1.5 focus-within:border-primary transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">工业增加值（月度直报）</span>
                  <span className="text-[11px] font-mono text-muted-foreground/70">上月: 3950.0 万元</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="any"
                    value={industrialAddValue}
                    onChange={(e) => setIndustrialAddValue(e.target.value)}
                    className="w-full pl-3 pr-16 py-1.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                    placeholder="按政府统计直报数据填报..."
                  />
                  <span className="absolute right-3 text-xs font-mono font-bold text-muted-foreground/70 select-none">
                    万元
                  </span>
                </div>
              </div>
            </div>

            {/* 卡片 4：⚙️ 重点用能设备模块 */}
            <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                    <Cpu className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">4. 重点用能设备模块</h3>
                    <p className="text-[11px] text-muted-foreground">设备名称、运行用途、额定功率与装机台账</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950/40 text-indigo-300 border border-indigo-800/60 font-bold">
                  2 类重点资产
                </span>
              </div>

              <div className="space-y-3">
                {/* 达到或优于国标 2 级的设备 */}
                <div className="p-3 rounded-xl border border-indigo-900/40 bg-indigo-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-indigo-300">达到或优于国标 2 级的设备</span>
                      <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 px-2 py-0.5 rounded">
                        {level2TotalKw.toLocaleString()} kW ({equipListLevel2.length}台)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {equipListLevel2.map((dev) => (
                      <div
                        key={dev.id}
                        className="flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg border bg-[#0e182e] border-border text-xs shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-foreground shrink-0">{dev.name}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary border border-primary/30 font-medium shrink-0">
                            {dev.type}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate">
                            用途：<span className="text-foreground font-medium">{dev.usage}</span>
                          </span>
                        </div>
                        <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 border-indigo-800/60 text-xs px-2 py-0.5 rounded border shrink-0">
                          {dev.powerKw.toLocaleString()} kW
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 纳入统计范围装备 */}
                <div className="p-3 rounded-xl border border-indigo-900/40 bg-indigo-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-indigo-300">纳入统计范围装备</span>
                      <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 px-2 py-0.5 rounded">
                        {allEquipTotalKw.toLocaleString()} kW ({equipListAll.length}台)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {equipListAll.map((dev) => (
                      <div
                        key={dev.id}
                        className="flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg border bg-[#0e182e] border-border text-xs shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-foreground shrink-0">{dev.name}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary border border-primary/30 font-medium shrink-0">
                            {dev.type}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate">
                            用途：<span className="text-foreground font-medium">{dev.usage}</span>
                          </span>
                        </div>
                        <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 border-indigo-800/60 text-xs px-2 py-0.5 rounded border shrink-0">
                          {dev.powerKw.toLocaleString()} kW
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 卡片 5：🏛️ 零碳园区与重大事件 */}
            <div className="lg:col-span-2 rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">5. 零碳园区要素与重大事件登记</h3>
                    <p className="text-[11px] text-muted-foreground">园区全貌实景航拍、零碳关键事件登记及园区基本信息</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-teal-950/40 text-teal-300 border border-teal-800/60 font-bold">
                  3 项园区要素
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 园区照片 */}
                <div className="p-3.5 rounded-xl border border-teal-900/40 bg-teal-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-300">园区全貌航拍实景</span>
                    <span className="text-[10px] font-mono text-teal-300 bg-teal-900/50 px-1.5 py-0.5 rounded font-bold">
                      {parkPhotos.length} 张已上传
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">用于集控中心大屏轮播展示与现场初核核验。</p>
                  <button
                    type="button"
                    onClick={() => setIsParkPhotoModalOpen(true)}
                    className="w-full py-1.5 rounded-lg border border-teal-800/60 bg-[#0e182e] hover:bg-teal-950/50 text-teal-300 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    管理园区照片
                  </button>
                </div>

                {/* 零碳关键事件 */}
                <div className="p-3.5 rounded-xl border border-teal-900/40 bg-teal-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-300">零碳重大关键事件</span>
                    <span className="text-[10px] font-mono text-teal-300 bg-teal-900/50 px-1.5 py-0.5 rounded font-bold">
                      {keyEvents.length} 条已归档
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate" title={keyEvents[0]?.title}>
                    最新: {keyEvents[0]?.title || '暂无'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsEventModalOpen(true)}
                    className="w-full py-1.5 rounded-lg border border-teal-800/60 bg-[#0e182e] hover:bg-teal-950/50 text-teal-300 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    登记关键事件
                  </button>
                </div>

                {/* 零碳园区基本信息 */}
                <div className="p-3.5 rounded-xl border border-teal-900/40 bg-teal-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-300">零碳园区基本信息</span>
                    <span className="text-[10px] font-mono text-teal-300 bg-teal-900/50 px-1.5 py-0.5 rounded font-bold">
                      已维护
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    维护零碳园区名称、地理位置及低碳建设内容。
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsParkInfoModalOpen(true)}
                    className="w-full py-1.5 rounded-lg border border-teal-800/60 bg-[#0e182e] hover:bg-teal-950/50 text-teal-300 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    维护园区基本信息
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 底部提交动作栏 */}
          <div className="flex items-center justify-between p-4 rounded-2xl border bg-card border-border shadow-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              <span>
                填报数据在点击提交后将进行<strong>环比防错校验与数据防篡改签名</strong>，并直供集控大屏与产品碳足迹核算。
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSaveEntry('待复核')}
                className="px-4 py-2 rounded-xl border border-border bg-panel/70 text-xs font-bold text-foreground hover:bg-panel/90 cursor-pointer transition-colors shadow-2xs"
              >
                存为草稿 (待复核)
              </button>
              <button
                type="button"
                onClick={() => handleSaveEntry('已入库')}
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-md transition-all"
              >
                <Save className="size-4" />
                <span>提交月度申报并归档</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 视图模式 2：历史台账 */}
      {/* ========================================================================= */}
      {viewMode === 'history' && (
        <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">工厂能碳历史申报台账</h2>
              <p className="text-xs text-muted-foreground mt-0.5">查看历次申报批次、操作专员、填报摘要及费用明细</p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('entry')}
              className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-2xs"
            >
              返回填报工作台
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="h-[44px] bg-[#0b1324]/80 text-muted-foreground border-b border-border font-bold">
                  <th className="px-4 py-0">申报批次号</th>
                  <th className="px-4 py-0">申报账期</th>
                  <th className="px-4 py-0">申报人</th>
                  <th className="px-4 py-0">提交时间</th>
                  <th className="px-4 py-0">能源费用总计</th>
                  <th className="px-4 py-0">填报摘要</th>
                  <th className="px-4 py-0">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/60">
                {historyList.map((rec) => (
                  <tr key={rec.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                    <td className="px-4 py-0 font-mono font-bold text-primary">{rec.batch}</td>
                    <td className="px-4 py-0 font-semibold text-foreground">{rec.year}年{rec.month}月</td>
                    <td className="px-4 py-0 text-muted-foreground">{rec.submitter}</td>
                    <td className="px-4 py-0 font-mono text-muted-foreground/70">{rec.submitTime}</td>
                    <td className="px-4 py-0 font-mono font-bold text-emerald-400">¥ {rec.totalCostWan} 万元</td>
                    <td className="px-4 py-0 text-muted-foreground max-w-xs truncate" title={rec.summary}>{rec.summary}</td>
                    <td className="px-4 py-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 1：增报产品品类弹窗 (支持 11 大类及自定义) */}
      {/* ========================================================================= */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-[#0d1527] border-border text-foreground shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="size-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">增报工业产品品类（特变电工 11 大类目录）</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-muted-foreground">
                请从集团预置的 11 大标准工业产品大类中选择需要增报的品类，或输入自定义新产品：
              </p>

              {/* 11 大产品品类网格选择器 */}
              <div className="grid grid-cols-3 gap-2">
                {TBEA_11_PRODUCT_CATALOG.map((cat) => {
                  const isSelected = selectedCatToAdd === cat.id
                  const isAlreadyAdded = activeProducts.some((p) => p.categoryId === cat.id)

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      disabled={isAlreadyAdded}
                      onClick={() => setSelectedCatToAdd(cat.id)}
                      className={cn(
                        'flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer',
                        isSelected
                          ? 'border-primary bg-primary/15 text-primary font-bold shadow-xs'
                          : isAlreadyAdded
                          ? 'opacity-40 border-dashed cursor-not-allowed bg-panel/70 border-border'
                          : 'bg-panel/70 border-border text-foreground hover:border-primary/50'
                      )}
                    >
                      <span className="text-xs font-bold">{cat.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">
                        {isAlreadyAdded ? '(已启用)' : cat.defaultUnit}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* 自定义品类支持 */}
              <div className="pt-2 border-t border-border/60 space-y-1.5">
                <label className="text-xs font-bold text-foreground">或者输入其他新增产品品类名称：</label>
                <input
                  type="text"
                  value={customProductName}
                  onChange={(e) => {
                    setCustomProductName(e.target.value)
                    if (e.target.value) setSelectedCatToAdd('custom')
                  }}
                  className="w-full px-3 py-2 rounded-lg border text-xs bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="如：储能集装箱、直流充电机桩等..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-border bg-panel/70 text-xs font-semibold text-foreground cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmAddProduct}
                className="px-5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-md"
              >
                确认增报
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 2：细分型号明细管理弹窗 (44px 表格) */}
      {/* ========================================================================= */}
      {editingModelProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border bg-[#0d1527] border-border text-foreground shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <TableIcon className="size-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    【{editingModelProduct.categoryName}】细分物料型号与完工台账
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    登记各规格物料编码的完工入库量，系统将自动汇总为该品类当月实际总产量
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingModelProduct(null)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 新增型号单行表单 */}
            <form onSubmit={handleAddSingleModel} className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl border bg-panel/70 border-border">
              <input
                type="text"
                value={newModelCode}
                onChange={(e) => setNewModelCode(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 w-36"
                placeholder="物料编码 (选填)..."
              />
              <input
                type="text"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border text-xs font-bold bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 flex-1 min-w-[180px]"
                placeholder="型号名称规格 (如: S20-M-630/10)..."
              />
              <div className="relative flex items-center w-28">
                <input
                  type="number"
                  step="any"
                  value={newModelOutput}
                  onChange={(e) => setNewModelOutput(e.target.value)}
                  className="w-full pl-2 pr-8 py-1.5 rounded-lg border text-xs font-mono font-bold bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="产量..."
                />
                <span className="absolute right-2 text-[10px] font-mono text-muted-foreground/70 select-none">
                  {editingModelProduct.unit}
                </span>
              </div>
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-2xs"
              >
                <Plus className="size-3" />
                <span>添加</span>
              </button>
            </form>

            {/* 型号清单表格 (强制 44px) */}
            <div className="max-h-60 overflow-y-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="h-[44px] bg-[#0b1324]/80 text-muted-foreground border-b border-border font-bold">
                    <th className="px-3 py-0">物料编码</th>
                    <th className="px-3 py-0">型号规格全称</th>
                    <th className="px-3 py-0">完工产量 ({editingModelProduct.unit})</th>
                    <th className="px-3 py-0 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border/60">
                  {editingModelProduct.models.map((m) => (
                    <tr key={m.id} className="h-[44px] hover:bg-panel/50">
                      <td className="px-3 py-0 font-mono text-muted-foreground">{m.modelCode}</td>
                      <td className="px-3 py-0 font-bold text-foreground">{m.modelName}</td>
                      <td className="px-3 py-0 font-mono font-bold text-primary">{m.output}</td>
                      <td className="px-3 py-0 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteSingleModel(m.id)}
                          className="text-muted-foreground hover:text-rose-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {editingModelProduct.models.length === 0 && (
                    <tr className="h-[44px]">
                      <td colSpan={4} className="text-center text-xs text-muted-foreground/70">
                        暂无细分型号，可使用上方表单登记具体规格完工量
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <span className="text-xs text-muted-foreground">
                合计完工量：
                <strong className="text-primary font-mono text-sm ml-1">
                  {editingModelProduct.models.reduce((s, m) => s + (parseFloat(m.output) || 0), 0)}{' '}
                  {editingModelProduct.unit}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => setEditingModelProduct(null)}
                className="px-5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-md"
              >
                完成并回填
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 3：直通免填数据清单抽屉 (透明化减负成果) */}
      {/* ========================================================================= */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-2xl border bg-[#0d1527] border-border text-foreground shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Database className="size-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">股份大数据平台与系统直通数据中枢</h3>
                  <p className="text-[11px] text-muted-foreground">
                    以下 4 项核心数据已实现后台自动拉取与核算，工厂专员 100% 免填
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 直通数据 44px 高密度表格 */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="h-[44px] bg-[#0b1324]/80 text-muted-foreground border-b border-border font-bold">
                    <th className="px-4 py-0">数据项名称</th>
                    <th className="px-4 py-0">数据类别</th>
                    <th className="px-4 py-0">来源系统</th>
                    <th className="px-4 py-0">当期数值</th>
                    <th className="px-4 py-0">最新同步时间</th>
                    <th className="px-4 py-0">减负状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border/60">
                  {AUTO_SYNC_DATA_LIST.map((item) => (
                    <tr key={item.id} className="h-[44px] hover:bg-panel/50">
                      <td className="px-4 py-0 font-bold text-foreground">{item.name}</td>
                      <td className="px-4 py-0 text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-0 font-mono text-primary">{item.sourceSystem}</td>
                      <td className="px-4 py-0 font-mono font-bold text-emerald-400">{item.value}</td>
                      <td className="px-4 py-0 font-mono text-muted-foreground/70">{item.syncTime}</td>
                      <td className="px-4 py-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
              <span className="text-muted-foreground">
                系统支持每日自动抓取与核验，如数据存在异常可联系股份集控中心运维。
              </span>
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="px-5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-md"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 4：主数据与型号编码映射中心 (解决各分厂物料编码不一痛点) */}
      {/* ========================================================================= */}
      {isMappingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-2xl border bg-[#0d1527] border-border text-foreground shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="size-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">产品主数据与分厂物料编码映射中心</h3>
                  <p className="text-[11px] text-muted-foreground">
                    沉淀特变电工集团标准型号 ↔ 各分厂 ERP/MES 内部物料编码与产线对应关系
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMappingModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 映射 44px 高密度表格 */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="h-[44px] bg-[#0b1324]/80 text-muted-foreground border-b border-border font-bold">
                    <th className="px-4 py-0">产品品类</th>
                    <th className="px-4 py-0">集团标准型号名称</th>
                    <th className="px-4 py-0">各分厂物料编码映射 (沈变 / 衡变 / 新变 / 鲁缆)</th>
                    <th className="px-4 py-0">关联产线/工序</th>
                    <th className="px-4 py-0">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border/60">
                  {mappingList.map((item) => (
                    <tr key={item.id} className="h-[44px] hover:bg-panel/50">
                      <td className="px-4 py-0 font-bold text-foreground">{item.category}</td>
                      <td className="px-4 py-0 font-mono text-primary font-bold">{item.stdModel}</td>
                      <td className="px-4 py-0 font-mono text-muted-foreground">{item.companyCode}</td>
                      <td className="px-4 py-0 text-muted-foreground">{item.lineName}</td>
                      <td className="px-4 py-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
              <span className="text-muted-foreground">
                主数据低频维护（仅在新产品投产或物料编码变更时更新），日常填报无需重复维护。
              </span>
              <button
                type="button"
                onClick={() => setIsMappingModalOpen(false)}
                className="px-5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-md"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 5：日数据录入弹窗 (用水量 / 外购蒸汽量) */}
      {/* ========================================================================= */}
      {activeDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border bg-[#0d1527] border-border text-foreground shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  {activeDailyModal === 'm-1' ? '用水量' : '外购蒸汽量'} - 2026年08月逐日录入 (共31天)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDailyModal(null)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 31 天日数据网格 */}
            <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-72 overflow-y-auto p-1">
              {tempDailyList.map((val, idx) => (
                <div key={idx} className="p-2 rounded-lg border bg-panel/70 border-border text-center space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground/70">8月{idx + 1}日</span>
                  <input
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => {
                      const updated = [...tempDailyList]
                      updated[idx] = parseFloat(e.target.value) || 0
                      setTempDailyList(updated)
                    }}
                    className="w-full text-center px-1 py-1 rounded border text-xs font-mono font-bold bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <span className="text-xs text-muted-foreground">
                31天累加总计：
                <strong className="text-primary font-mono text-sm ml-1">
                  {tempDailySum} {activeDailyModal === 'm-1' ? 't' : 't'}
                </strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDailyModal(null)}
                  className="px-4 py-1.5 rounded-lg border border-border bg-panel/70 text-xs font-semibold text-foreground cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveDailyModal}
                  className="px-5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-md"
                >
                  保存并同步月总量
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 6：园区航拍照片管理 */}
      {/* ========================================================================= */}
      {isParkPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-[#0d1527] border-border text-foreground shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground">园区实景与航拍照片维护</h3>
              <button type="button" onClick={() => setIsParkPhotoModalOpen(false)} className="text-muted-foreground p-1">
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {parkPhotos.map((src, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-border aspect-video">
                  <img src={src} alt="园区实景" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsParkPhotoModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 7：零碳关键事件维护 */}
      {/* ========================================================================= */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-[#0d1527] border-border text-foreground shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground">登记零碳重大关键事件</h3>
              <button type="button" onClick={() => setIsEventModalOpen(false)} className="text-muted-foreground p-1">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">事件日期</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs font-mono font-bold bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">事件描述</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs font-bold bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (newEventTitle.trim()) {
                    setKeyEvents([
                      { id: `ev-${Date.now()}`, date: newEventDate, title: newEventTitle.trim(), type: '光伏并网' },
                      ...keyEvents,
                    ])
                  }
                  setIsEventModalOpen(false)
                }}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
              >
                保存事件
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 8：园区基本信息维护 */}
      {/* ========================================================================= */}
      {isParkInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-[#0d1527] border-border text-foreground shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground">维护零碳园区基本信息</h3>
              <button type="button" onClick={() => setIsParkInfoModalOpen(false)} className="text-muted-foreground p-1">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground">园区名称</label>
                <input
                  type="text"
                  value={parkInfo.name}
                  onChange={(e) => setParkInfo({ ...parkInfo, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border font-bold mt-1 bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="font-bold text-foreground">地理位置</label>
                <input
                  type="text"
                  value={parkInfo.location}
                  onChange={(e) => setParkInfo({ ...parkInfo, location: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border mt-1 bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="font-bold text-foreground">低碳建设内容</label>
                <textarea
                  rows={3}
                  value={parkInfo.content}
                  onChange={(e) => setParkInfo({ ...parkInfo, content: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border mt-1 bg-[#0b1324] border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsParkInfoModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
              >
                保存信息
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

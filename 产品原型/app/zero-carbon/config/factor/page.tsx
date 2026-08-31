'use client'

import React, { useState, useMemo } from 'react'
import {
  Zap,
  Settings2,
  Flame,
  Scale,
  Search,
  Plus,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  FileText,
  Tag,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 1. 省级电力排放因子数据接口
interface ProvincialPowerFactor {
  id: string
  province: string
  region: '华北' | '东北' | '华东' | '华中' | '西北' | '西南' | '南方' | '全国'
  isTbeaPark: boolean // 是否包含特变电工工业基地
  factorTotal: number // 综合电力排放因子 (tCO2/MWh 或 kgCO2/kWh)
  factorFossil: number // 化石能源电力因子 (tCO2/MWh)
  greenFactor: number // 绿电交易核算因子 (固定 0.0000)
  version: string
  publishYear: string
  source: string
  status: '生效中' | '待生效' | '历史版本'
  updatedAt: string
}

// 省级电力因子全量数据集 (重点覆盖特变电工园区所在地：新疆、辽宁、湖南、山东、四川、陕西、天津、江苏等)
const PROVINCIAL_POWER_FACTORS: ProvincialPowerFactor[] = [
  {
    id: 'pf_nat',
    province: '全国平均电网',
    region: '全国',
    isTbeaPark: false,
    factorTotal: 0.5703,
    factorFossil: 0.8120,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '生态环境部《2021、2022年全国电力平均二氧化碳排放因子》',
    status: '生效中',
    updatedAt: '2025-01-15',
  },
  {
    id: 'pf_xj',
    province: '新疆维吾尔自治区',
    region: '西北',
    isTbeaPark: true,
    factorTotal: 0.5312,
    factorFossil: 0.7950,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '国家生态环境部最新区域电网核算因子公告',
    status: '生效中',
    updatedAt: '2025-01-10',
  },
  {
    id: 'pf_ln',
    province: '辽宁省 (沈阳园区)',
    region: '东北',
    isTbeaPark: true,
    factorTotal: 0.5840,
    factorFossil: 0.8320,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '东北区域电网省级排放基准公布目录',
    status: '生效中',
    updatedAt: '2025-01-12',
  },
  {
    id: 'pf_hn',
    province: '湖南省 (衡阳园区)',
    region: '华中',
    isTbeaPark: true,
    factorTotal: 0.5120,
    factorFossil: 0.7890,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '华中区域电网湖南省电力碳足迹因子',
    status: '生效中',
    updatedAt: '2025-01-10',
  },
  {
    id: 'pf_sd',
    province: '山东省 (新泰园区)',
    region: '华东',
    isTbeaPark: true,
    factorTotal: 0.6210,
    factorFossil: 0.8650,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '华东区域电网省级电力排放因子公告',
    status: '生效中',
    updatedAt: '2025-01-15',
  },
  {
    id: 'pf_sc',
    province: '四川省 (德阳园区)',
    region: '西南',
    isTbeaPark: true,
    factorTotal: 0.1820,
    factorFossil: 0.6210,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '西南区域水电高比例清洁电网发布因子',
    status: '生效中',
    updatedAt: '2025-01-10',
  },
  {
    id: 'pf_sn',
    province: '陕西省 (西安园区)',
    region: '西北',
    isTbeaPark: true,
    factorTotal: 0.5630,
    factorFossil: 0.8140,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '西北电网省级排放基准公告',
    status: '生效中',
    updatedAt: '2025-01-10',
  },
  {
    id: 'pf_tj',
    province: '天津市 (天津园区)',
    region: '华北',
    isTbeaPark: true,
    factorTotal: 0.5980,
    factorFossil: 0.8410,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '华北区域电网京津冀电力排放基准',
    status: '生效中',
    updatedAt: '2025-01-12',
  },
  {
    id: 'pf_js',
    province: '江苏省 (南京园区)',
    region: '华东',
    isTbeaPark: true,
    factorTotal: 0.5420,
    factorFossil: 0.8060,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '华东区域电网省级电力排放因子公告',
    status: '生效中',
    updatedAt: '2025-01-15',
  },
  {
    id: 'pf_hb',
    province: '河北省',
    region: '华北',
    isTbeaPark: false,
    factorTotal: 0.6050,
    factorFossil: 0.8520,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '生态环境部统一发布',
    status: '生效中',
    updatedAt: '2025-01-15',
  },
  {
    id: 'pf_gd',
    province: '广东省',
    region: '南方',
    isTbeaPark: false,
    factorTotal: 0.4230,
    factorFossil: 0.7450,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '南方电网五省区电力因子核算公报',
    status: '生效中',
    updatedAt: '2025-01-15',
  },
  {
    id: 'pf_zj',
    province: '浙江省',
    region: '华东',
    isTbeaPark: false,
    factorTotal: 0.5180,
    factorFossil: 0.7920,
    greenFactor: 0.0,
    version: 'v2025.1',
    publishYear: '2024',
    source: '华东电网发布',
    status: '生效中',
    updatedAt: '2025-01-15',
  },
]

// 2. 化石与热力能源碳排放因子数据接口
interface EnergyEmissionFactor {
  id: string
  name: string
  category: '化石气体' | '化石液体' | '化石固体' | '热力工质' | '工业气体'
  unit: string
  factorCO2: number // 排放因子 (tCO2/实物单位)
  lowCalorificMJ: number // 低位发热量 (MJ/单位)
  carbonContentTC_TJ: number // 单位热值含碳量 (tC/TJ)
  carbonOxidationRate: number // 碳氧化率 (%)
  source: string
  version: string
  status: '生效中' | '待生效' | '历史版本'
}

const ENERGY_EMISSION_FACTORS: EnergyEmissionFactor[] = [
  {
    id: 'ef_gas',
    name: '管道天然气',
    category: '化石气体',
    unit: '万m³',
    factorCO2: 21.6220,
    lowCalorificMJ: 389.31,
    carbonContentTC_TJ: 15.32,
    carbonOxidationRate: 99.0,
    source: 'GB/T 32150-2015 工业企业温室气体排放核算通则',
    version: 'v2025.1',
    status: '生效中',
  },
  {
    id: 'ef_diesel',
    name: '轻柴油',
    category: '化石液体',
    unit: 't',
    factorCO2: 3.1000,
    lowCalorificMJ: 42652.0,
    carbonContentTC_TJ: 20.20,
    carbonOxidationRate: 98.0,
    source: '生态环境部企业温室气体核算方法与报告指南',
    version: 'v2025.1',
    status: '生效中',
  },
  {
    id: 'ef_gasoline',
    name: '车用汽油',
    category: '化石液体',
    unit: 't',
    factorCO2: 2.9250,
    lowCalorificMJ: 43070.0,
    carbonContentTC_TJ: 18.90,
    carbonOxidationRate: 98.0,
    source: '生态环境部企业温室气体核算方法与报告指南',
    version: 'v2025.1',
    status: '生效中',
  },
  {
    id: 'ef_steam_low',
    name: '饱和工业蒸汽 (0.8~1.0MPa)',
    category: '热力工质',
    unit: 't',
    factorCO2: 0.0652,
    lowCalorificMJ: 2756.7,
    carbonContentTC_TJ: 25.80,
    carbonOxidationRate: 100.0,
    source: '供热企业温室气体排放核算方法 (焓值法)',
    version: 'v2025.1',
    status: '生效中',
  },
  {
    id: 'ef_steam_high',
    name: '过热工业蒸汽 (1.6MPa, 300℃)',
    category: '热力工质',
    unit: 't',
    factorCO2: 0.0773,
    lowCalorificMJ: 3050.0,
    carbonContentTC_TJ: 25.80,
    carbonOxidationRate: 100.0,
    source: '供热管网过热蒸汽核算基准',
    version: 'v2025.1',
    status: '生效中',
  },
  {
    id: 'ef_coal_raw',
    name: '动力原煤 / 烟煤',
    category: '化石固体',
    unit: 't',
    factorCO2: 1.9000,
    lowCalorificMJ: 20908.0,
    carbonContentTC_TJ: 26.32,
    carbonOxidationRate: 93.0,
    source: 'GB/T 32150 附录化石燃料缺省因子',
    version: 'v2025.1',
    status: '生效中',
  },
  {
    id: 'ef_coke',
    name: '工业焦炭',
    category: '化石固体',
    unit: 't',
    factorCO2: 2.8600,
    lowCalorificMJ: 28435.0,
    carbonContentTC_TJ: 29.42,
    carbonOxidationRate: 95.0,
    source: '生态环境部温室气体核算指南',
    version: 'v2025.1',
    status: '生效中',
  },
  {
    id: 'ef_lng',
    name: '液化天然气 (LNG)',
    category: '化石气体',
    unit: 't',
    factorCO2: 2.7500,
    lowCalorificMJ: 51498.0,
    carbonContentTC_TJ: 15.30,
    carbonOxidationRate: 99.0,
    source: 'GB/T 32150-2015',
    version: 'v2025.1',
    status: '生效中',
  },
  {
    id: 'ef_lpg',
    name: '液化石油气 (LPG)',
    category: '化石气体',
    unit: 't',
    factorCO2: 3.1000,
    lowCalorificMJ: 50241.0,
    carbonContentTC_TJ: 17.20,
    carbonOxidationRate: 98.0,
    source: 'GB/T 32150-2015',
    version: 'v2025.1',
    status: '生效中',
  },
]

// 3. 能源折标准煤系数数据接口
interface StandardCoalFactor {
  id: string
  name: string
  category: '二次电力' | '化石燃料' | '热力工质' | '耗能工质' | '工业气体'
  unit: string
  calorificVal: string // 低位发热量基准
  tceEquiv: number // 当量折标系数 (kgce/单位)
  tceEqual?: number // 等价值折标系数 (kgce/单位)
  standardRef: string
  version: string
  status: '生效中' | '待生效'
}

const STANDARD_COAL_FACTORS: StandardCoalFactor[] = [
  {
    id: 'sc_elec',
    name: '电力 (市电)',
    category: '二次电力',
    unit: '万kWh',
    calorificVal: '36,000 MJ/万kWh (8,600 Mcal)',
    tceEquiv: 1229.0, // 1.229 tce/万kWh = 1229 kgce/万kWh
    tceEqual: 3150.0, // 3.150 tce/万kWh (按全国平均发电供电煤耗)
    standardRef: 'GB/T 2589-2020《综合能耗计算通则》',
    version: 'GB/T 2589-2020',
    status: '生效中',
  },
  {
    id: 'sc_gas',
    name: '管道天然气',
    category: '化石燃料',
    unit: '万m³',
    calorificVal: '389,310 MJ/万m³ (9,300 Mcal)',
    tceEquiv: 13300.0, // 1.3300 kgce/m³
    standardRef: 'GB/T 2589-2020 附录 A.1',
    version: 'GB/T 2589-2020',
    status: '生效中',
  },
  {
    id: 'sc_steam_sat',
    name: '饱和工业蒸汽 (0.8~1.0MPa)',
    category: '热力工质',
    unit: 't',
    calorificVal: '2,756.7 MJ/t',
    tceEquiv: 94.1,
    standardRef: 'GB/T 2589-2020 附录 A.2 (蒸汽表)',
    version: 'GB/T 2589-2020',
    status: '生效中',
  },
  {
    id: 'sc_steam_sup',
    name: '过热工业蒸汽 (1.6MPa, 300℃)',
    category: '热力工质',
    unit: 't',
    calorificVal: '3,050.0 MJ/t',
    tceEquiv: 104.1,
    standardRef: 'GB/T 2589-2020 附录 A.2 (焓值法)',
    version: 'GB/T 2589-2020',
    status: '生效中',
  },
  {
    id: 'sc_diesel',
    name: '轻柴油',
    category: '化石燃料',
    unit: 't',
    calorificVal: '42,652 MJ/t',
    tceEquiv: 1457.1,
    standardRef: 'GB/T 2589-2020 表 A.1',
    version: 'GB/T 2589-2020',
    status: '生效中',
  },
  {
    id: 'sc_gasoline',
    name: '车用汽油',
    category: '化石燃料',
    unit: 't',
    calorificVal: '43,070 MJ/t',
    tceEquiv: 1471.4,
    standardRef: 'GB/T 2589-2020 表 A.1',
    version: 'GB/T 2589-2020',
    status: '生效中',
  },
  {
    id: 'sc_coal',
    name: '动力原煤 / 烟煤',
    category: '化石燃料',
    unit: 't',
    calorificVal: '20,908 MJ/t',
    tceEquiv: 714.3,
    standardRef: 'GB/T 2589-2020 表 A.1',
    version: 'GB/T 2589-2020',
    status: '生效中',
  },
  {
    id: 'sc_water_fresh',
    name: '工业新鲜自来水',
    category: '耗能工质',
    unit: 't',
    calorificVal: '2.51 MJ/t',
    tceEquiv: 0.0857,
    standardRef: '地方耗能工质折标通则',
    version: '地方能耗标准',
    status: '生效中',
  },
  {
    id: 'sc_water_soft',
    name: '工业软化脱盐纯水',
    category: '耗能工质',
    unit: 't',
    calorificVal: '14.23 MJ/t',
    tceEquiv: 0.4857,
    standardRef: '高纯水制备折标标准',
    version: '行业标准',
    status: '生效中',
  },
  {
    id: 'sc_air',
    name: '压缩空气 (0.8MPa)',
    category: '工业气体',
    unit: '万m³',
    calorificVal: '11,700 MJ/万m³',
    tceEquiv: 400.0,
    standardRef: '机械工业用能统计规范',
    version: '行业标准',
    status: '生效中',
  },
]

export default function FactorPage() {
  // 顶层三大维护 Tab 切换
  const [activeTab, setActiveTab] = useState<'power_provincial' | 'energy_carbon' | 'standard_coal'>('power_provincial')

  // 搜索与过滤状态
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedEnergyCategory, setSelectedEnergyCategory] = useState('all')

  // 模拟编辑弹窗状态
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editVal, setEditVal] = useState<string>('')
  const [showSaveToast, setShowSaveToast] = useState(false)

  // 1. 过滤省级电力因子
  const filteredPowerFactors = useMemo(() => {
    return PROVINCIAL_POWER_FACTORS.filter((item) => {
      const matchRegion = selectedRegion === 'all' || item.region === selectedRegion
      const matchKw =
        item.province.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.source.toLowerCase().includes(searchKeyword.toLowerCase())
      return matchRegion && matchKw
    })
  }, [searchKeyword, selectedRegion])

  // 2. 过滤能源碳排放因子
  const filteredEnergyFactors = useMemo(() => {
    return ENERGY_EMISSION_FACTORS.filter((item) => {
      const matchCat = selectedEnergyCategory === 'all' || item.category === selectedEnergyCategory
      const matchKw =
        item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.source.toLowerCase().includes(searchKeyword.toLowerCase())
      return matchCat && matchKw
    })
  }, [searchKeyword, selectedEnergyCategory])

  // 3. 过滤折标煤系数
  const filteredCoalFactors = useMemo(() => {
    return STANDARD_COAL_FACTORS.filter((item) => {
      const matchKw =
        item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.standardRef.toLowerCase().includes(searchKeyword.toLowerCase())
      return matchKw
    })
  }, [searchKeyword])

  // 处理编辑保存
  const handleSaveEdit = () => {
    setShowSaveToast(true)
    setEditingItem(null)
    setTimeout(() => setShowSaveToast(false), 3000)
  }

  return (
    <div className="space-y-4 font-sans text-slate-800">
      
      {/* 顶部 Header */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Settings2 className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">碳排因子</h1>
          </div>
      </div>

      {/* 🌟 1. 顶部 4 大核心资产与版本 KPI 卡片 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">省级电力因子库</span>
            <div className="text-lg font-bold font-mono text-slate-800 mt-0.5">
              31 <span className="text-xs font-sans text-slate-500">省份独立维护</span>
            </div>
            <span className="text-[10px] text-blue-600 font-sans block mt-0.5">覆盖 8 大特变电工园区基地</span>
          </div>
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff]">
            <MapPin className="size-4.5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">能源碳排放因子</span>
            <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">
              14 <span className="text-xs font-sans text-slate-500">种工业燃料/热力</span>
            </div>
            <span className="text-[10px] text-slate-400 font-sans block mt-0.5">GB/T 32150 官方缺省值</span>
          </div>
          <div className="size-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Flame className="size-4.5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">折标煤国家标准库</span>
            <div className="text-lg font-bold font-mono text-amber-600 mt-0.5">GB/T 2589-2020</div>
            <span className="text-[10px] text-amber-700 font-sans block mt-0.5">当量值 ⇄ 等价值双口径</span>
          </div>
          <div className="size-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Scale className="size-4.5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">生效基准版本</span>
            <div className="text-lg font-bold font-mono text-purple-600 mt-0.5">v2025.1 (现行)</div>
            <span className="text-[10px] text-purple-600 font-sans block mt-0.5">生态环境部最新公告因子</span>
          </div>
          <div className="size-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <ShieldCheck className="size-4.5" />
          </div>
        </div>
      </div>

      {/* 🌟 2. 核心主控制区 (三大独立维护 Tab) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Tab 顶栏 */}
        <div className="px-4 pt-3 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/70 gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setActiveTab('power_provincial')
                setSearchKeyword('')
              }}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer',
                activeTab === 'power_provincial'
                  ? 'border-[#1677ff] text-[#1677ff] bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              )}
            >
              <Zap className="size-4 text-blue-600" />
              <span>电力因子单独维护 (省级电网)</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 font-mono">
                {PROVINCIAL_POWER_FACTORS.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('energy_carbon')
                setSearchKeyword('')
              }}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer',
                activeTab === 'energy_carbon'
                  ? 'border-[#1677ff] text-[#1677ff] bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              )}
            >
              <Flame className="size-4 text-emerald-600" />
              <span>化石与热力能源碳排放因子</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-mono">
                {ENERGY_EMISSION_FACTORS.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('standard_coal')
                setSearchKeyword('')
              }}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer',
                activeTab === 'standard_coal'
                  ? 'border-[#1677ff] text-[#1677ff] bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              )}
            >
              <Scale className="size-4 text-amber-600" />
              <span>能源折标准煤系数库 (GB/T 2589)</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-700 font-mono">
                {STANDARD_COAL_FACTORS.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={() => alert('已打开批量导入向导，支持上传生态环境部最新公告 Excel/CSV 因子底稿')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="size-3.5 text-slate-500" />
              <span>批量导入</span>
            </button>
            <button
              onClick={() => {
                setEditingItem({
                  province: '新增因子项',
                  factorTotal: 0.5500,
                  source: '企业自定义上报依据',
                  version: 'v2026.1',
                })
                setEditVal('0.5500')
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>新增因子</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 板块 1: 省级区域电网电力碳排放因子 */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'power_provincial' && (
          <div className="p-4 space-y-3.5">
            {/* 提示 Banner */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-blue-900">
                <Info className="size-4 text-[#1677ff] shrink-0" />
                <span>
                  <strong>电力因子省级独立维护规范</strong>：企业组织碳排放核算与产品碳足迹（Scope 2）优先匹配<strong>各工厂所在省份电网平均二氧化碳排放因子</strong>；市场化交易绿电按 0.0000 tCO2/MWh 计算。
                </span>
              </div>
              <span className="text-[11px] font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                最新执行版次：v2025.1 (生态环境部公告)
              </span>
            </div>

            {/* 搜索与区域过滤 */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="size-3.5" /> 大区电网：
                </span>
                {['all', '全国', '西北', '东北', '华中', '华东', '西南', '华北', '南方'].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer',
                      selectedRegion === reg
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {reg === 'all' ? '全部省份 (31)' : reg}
                  </button>
                ))}
              </div>

              <div className="relative w-64">
                <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索省份 / 园区 / 依据出处..."
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1677ff]"
                />
              </div>
            </div>

            {/* 省级电力因子表格 */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                    <th className="py-2.5 px-3">省份 / 区域电网</th>
                    <th className="py-2.5 px-3">大区归属</th>
                    <th className="py-2.5 px-3">特变电工基地</th>
                    <th className="py-2.5 px-3 font-mono">综合电力碳排因子 (tCO2/MWh)</th>
                                        <th className="py-2.5 px-3 font-mono">绿电交易核算</th>
                    <th className="py-2.5 px-3">核算版本</th>
                    <th className="py-2.5 px-3">发布依据与来源出处</th>
                    <th className="py-2.5 px-3">状态</th>
                    <th className="py-2.5 px-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPowerFactors.map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-blue-500" />
                        <span>{row.province}</span>
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10.5px]">
                          {row.region}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        {row.isTbeaPark ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-100 text-emerald-800">
                            <Building2 className="size-3" />
                            <span>核心工业基地</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-blue-700 text-sm">
                        {row.factorTotal.toFixed(4)}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">tCO2/MWh</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">
                        0.0000 <span className="text-[10px] font-sans text-emerald-700">(零碳核算)</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-purple-700 font-semibold">{row.version}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-500 text-[11px] max-w-xs truncate" title={row.source}>
                        {row.source}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle2 className="size-3" />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(row)
                              setEditVal(String(row.factorTotal))
                            }}
                            className="text-xs text-[#1677ff] hover:underline font-semibold cursor-pointer"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => alert(`已打开【${row.province}】历史 4 个年度因子版本对比走势图`)}
                            className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            版本对比
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 板块 2: 化石与热力能源碳排放因子 */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'energy_carbon' && (
          <div className="p-4 space-y-3.5">
            {/* 提示 Banner */}
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-900">
                <Flame className="size-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>化石燃料与热力碳排放因子库</strong>：收录天然气、柴油、汽油、原煤、工业蒸汽等实物碳排放因子、单位热值含碳量与碳氧化率，用于企业范围一（直接燃烧）与范围二（外购热力）碳排放精准核算。
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                基准规范：GB/T 32150-2015
              </span>
            </div>

            {/* 分类筛选与搜索 */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="size-3.5" /> 能源分类：
                </span>
                {['all', '化石气体', '化石液体', '化石固体', '热力工质'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedEnergyCategory(cat)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer',
                      selectedEnergyCategory === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {cat === 'all' ? '全部能源 (9)' : cat}
                  </button>
                ))}
              </div>

              <div className="relative w-64">
                <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索能源名称 / 来源依据..."
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* 能源碳排因子表格 */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                    <th className="py-2.5 px-3">能源介质名称</th>
                    <th className="py-2.5 px-3">介质类别</th>
                    <th className="py-2.5 px-3">计量单位</th>
                    <th className="py-2.5 px-3 font-mono">实物碳排放因子 (tCO2/单位)</th>
                    <th className="py-2.5 px-3 font-mono">低位发热量 (MJ/单位)</th>
                    <th className="py-2.5 px-3 font-mono">单位热值含碳量 (tC/TJ)</th>
                    <th className="py-2.5 px-3 font-mono">碳氧化率 (%)</th>
                    <th className="py-2.5 px-3">发布依据与来源标准</th>
                    <th className="py-2.5 px-3">状态</th>
                    <th className="py-2.5 px-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredEnergyFactors.map((row) => (
                    <tr key={row.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{row.name}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10.5px]">
                          {row.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{row.unit}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700 text-sm">
                        {row.factorCO2.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-rose-700">
                        {row.lowCalorificMJ.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{row.carbonContentTC_TJ.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-slate-600">{row.carbonOxidationRate.toFixed(1)}%</td>
                      <td className="py-2.5 px-3 font-sans text-slate-500 text-[11px] max-w-xs truncate" title={row.source}>
                        {row.source}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="size-3" />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(row)
                              setEditVal(String(row.factorCO2))
                            }}
                            className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => alert(`已打开【${row.name}】化验报告与实测历史台账`)}
                            className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            溯源
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 板块 3: 能源折标准煤系数库 (GB/T 2589) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'standard_coal' && (
          <div className="p-4 space-y-3.5">
            {/* 提示 Banner */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <Scale className="size-4 text-amber-600 shrink-0" />
                <span>
                  <strong>GB/T 2589-2020 综合能耗折标准煤基准</strong>：标准煤热值基准为 29,307.6 kJ/kgce (7,000 kcal)；电力支持<strong>物理当量值 (0.1229 kgce/kWh)</strong> 与<strong>供电等价值 (0.3150 kgce/kWh)</strong> 双口径配置。
                </span>
              </div>
              <span className="text-[11px] font-mono text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                现行标准：GB/T 2589-2020
              </span>
            </div>

            {/* 搜索栏 */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                共收录 <strong>{filteredCoalFactors.length}</strong> 类常用工业能源折标煤基准与耗能工质规范
              </div>

              <div className="relative w-64">
                <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索能源名称 / 计量单位 / 依据..."
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* 折标煤系数表格 */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                    <th className="py-2.5 px-3">能源介质名称</th>
                    <th className="py-2.5 px-3">介质类别</th>
                    <th className="py-2.5 px-3">计量单位</th>
                    <th className="py-2.5 px-3 font-mono">低位发热量基准</th>
                    <th className="py-2.5 px-3 font-mono">当量折标系数 (kgce/单位)</th>
                    <th className="py-2.5 px-3 font-mono">等价值折标系数 (kgce/单位)</th>
                    <th className="py-2.5 px-3">引用国家标准与依据</th>
                    <th className="py-2.5 px-3">标准版本</th>
                    <th className="py-2.5 px-3">状态</th>
                    <th className="py-2.5 px-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCoalFactors.map((row) => (
                    <tr key={row.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{row.name}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10.5px]">
                          {row.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{row.unit}</td>
                      <td className="py-2.5 px-3 text-rose-700 font-bold">{row.calorificVal}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-700 text-sm">
                        {row.tceEquiv.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-blue-700">
                        {row.tceEqual ? row.tceEqual.toFixed(2) : '—'}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-500 text-[11px] max-w-xs truncate" title={row.standardRef}>
                        {row.standardRef}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-purple-700 font-semibold">{row.version}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <CheckCircle2 className="size-3" />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(row)
                              setEditVal(String(row.tceEquiv))
                            }}
                            className="text-xs text-amber-700 hover:underline font-semibold cursor-pointer"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => alert(`已打开【${row.name}】标准换算推导明细与测试校验`)}
                            className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            校验
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* 🌟 3. 编辑因子弹窗 Dialog */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-5 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-[#1677ff]" />
                <h3 className="text-sm font-bold text-slate-800">
                  编辑因子参数 · {editingItem.province || editingItem.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-600 font-medium">因子名称 / 适用省份：</label>
                <input
                  type="text"
                  disabled
                  defaultValue={editingItem.province || editingItem.name}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-medium">核算因子数值：</label>
                <input
                  type="number"
                  step="0.0001"
                  value={editVal}
                  onChange={(e) => setEditVal(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-[#1677ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-medium">变更依据与来源说明：</label>
                <input
                  type="text"
                  defaultValue={editingItem.source || editingItem.standardRef || '依据最新发改委/生态环境部公告'}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-[#1677ff]"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-[#1677ff]" />
                  <span>审计与多版本合规提示</span>
                </div>
                <p>保存后将自动归档为版本流水记录，并实时同步更新至全厂碳核算与产品碳足迹计算引擎。</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingItem(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-xs font-semibold text-white shadow-2xs cursor-pointer"
              >
                确认保存变更
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功保存 Toast */}
      {showSaveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="size-4" />
          <span>因子参数变更已成功保存并提交生效审批！</span>
        </div>
      )}

    </div>
  )
}

'use client'

import React, { useState, useMemo } from 'react'
import {
  Activity,
  Download,
  Calendar,
  Building2,
  Factory,
  Zap,
  Flame,
  Wind,
  Layers,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronRight,
  PieChart as PieIcon,
  BarChart3,
  ShieldCheck,
  Award,
  CheckCircle2,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend, BarChartGroup, Donut } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 1. 集团下属各三级工厂/车间数据字典映射 (严格去除碳汇与手动油料录入)
interface CompanyUnitData {
  id: string
  name: string
  parentCompany: string
  province: string
  gridFactor: number // 分省电力排放因子 (tCO2/MWh)
  elecKWh: number
  gasM3: number
  steamT: number
  // 三大抵消量 (tCO2)
  solarSelfKWh: number // 直供绿电 (自建光伏自发自用)
  solarOffsetTCO2: number
  greenElecKWh: number // 交易绿电 (跨省市场化交易)
  greenElecOffsetTCO2: number
  gecCertificateCount: number // 交易绿证 (张, 1张=1MWh)
  gecOffsetTCO2: number
  outputValueTenThousand: number // 万元产值
  yoyRate: string
}

const FACTORY_PRESETS: Record<string, CompanyUnitData> = {
  ws_sb_main: {
    id: 'ws_sb_main',
    name: '沈变本部 (超高压制造基地)',
    parentCompany: '沈变公司',
    province: '辽宁省 (东北电网)',
    gridFactor: 0.5703,
    elecKWh: 8450000,
    gasM3: 320000,
    steamT: 4200,
    solarSelfKWh: 3250000,
    solarOffsetTCO2: 1853.5,
    greenElecKWh: 560000,
    greenElecOffsetTCO2: 319.4,
    gecCertificateCount: 153,
    gecOffsetTCO2: 87.4,
    outputValueTenThousand: 22800,
    yoyRate: '-5.4% ↓',
  },
  ws_sb_luna: {
    id: 'ws_sb_luna',
    name: '露娜公司 (特变电工露娜智能电气)',
    parentCompany: '沈变公司',
    province: '天津市 (华北电网)',
    gridFactor: 0.5810,
    elecKWh: 5200000,
    gasM3: 180000,
    steamT: 1850,
    solarSelfKWh: 1980000,
    solarOffsetTCO2: 1150.4,
    greenElecKWh: 280000,
    greenElecOffsetTCO2: 162.7,
    gecCertificateCount: 85,
    gecOffsetTCO2: 49.4,
    outputValueTenThousand: 14200,
    yoyRate: '-4.8% ↓',
  },
  ws_sb_zh: {
    id: 'ws_sb_zh',
    name: '沈变智慧能源中心',
    parentCompany: '沈变公司',
    province: '辽宁省 (东北电网)',
    gridFactor: 0.5703,
    elecKWh: 3200000,
    gasM3: 120000,
    steamT: 1200,
    solarSelfKWh: 2100000,
    solarOffsetTCO2: 1197.6,
    greenElecKWh: 450000,
    greenElecOffsetTCO2: 256.6,
    gecCertificateCount: 60,
    gecOffsetTCO2: 34.2,
    outputValueTenThousand: 9500,
    yoyRate: '-6.1% ↓',
  },
  ws_hb_main: {
    id: 'ws_hb_main',
    name: '衡变本部 (南方特高压基地)',
    parentCompany: '衡变公司',
    province: '湖南省 (华中电网)',
    gridFactor: 0.5271,
    elecKWh: 7800000,
    gasM3: 290000,
    steamT: 3900,
    solarSelfKWh: 2890000,
    solarOffsetTCO2: 1523.3,
    greenElecKWh: 420000,
    greenElecOffsetTCO2: 221.4,
    gecCertificateCount: 120,
    gecOffsetTCO2: 63.3,
    outputValueTenThousand: 20500,
    yoyRate: '-4.6% ↓',
  },
  ws_xb_uhv: {
    id: 'ws_xb_uhv',
    name: '新变厂 (新疆特高压制造部)',
    parentCompany: '新变厂',
    province: '新疆维吾尔自治区 (西北电网)',
    gridFactor: 0.5691,
    elecKWh: 9200000,
    gasM3: 350000,
    steamT: 4600,
    solarSelfKWh: 4100000,
    solarOffsetTCO2: 2333.3,
    greenElecKWh: 680000,
    greenElecOffsetTCO2: 387.0,
    gecCertificateCount: 180,
    gecOffsetTCO2: 102.4,
    outputValueTenThousand: 25600,
    yoyRate: '-5.8% ↓',
  },
  ws_ll_main: {
    id: 'ws_ll_main',
    name: '鲁缆本部 (山东特变线缆基地)',
    parentCompany: '鲁缆公司',
    province: '山东省 (华东电网)',
    gridFactor: 0.5884,
    elecKWh: 6800000,
    gasM3: 210000,
    steamT: 2800,
    solarSelfKWh: 2100000,
    solarOffsetTCO2: 1235.6,
    greenElecKWh: 310000,
    greenElecOffsetTCO2: 182.4,
    gecCertificateCount: 95,
    gecOffsetTCO2: 55.9,
    outputValueTenThousand: 18200,
    yoyRate: '-3.9% ↓',
  },
  ws_xl_main: {
    id: 'ws_xl_main',
    name: '特变电工新疆电缆有限公司',
    parentCompany: '新缆厂',
    province: '新疆维吾尔自治区 (西北电网)',
    gridFactor: 0.5691,
    elecKWh: 4900000,
    gasM3: 150000,
    steamT: 1900,
    solarSelfKWh: 1800000,
    solarOffsetTCO2: 1024.4,
    greenElecKWh: 250000,
    greenElecOffsetTCO2: 142.3,
    gecCertificateCount: 70,
    gecOffsetTCO2: 39.8,
    outputValueTenThousand: 12800,
    yoyRate: '-4.2% ↓',
  },
  ws_dl_main: {
    id: 'ws_dl_main',
    name: '特变电工（德阳）电缆股份有限公司',
    parentCompany: '德缆公司',
    province: '四川省 (西南电网)',
    gridFactor: 0.3850,
    elecKWh: 4300000,
    gasM3: 120000,
    steamT: 1500,
    solarSelfKWh: 1500000,
    solarOffsetTCO2: 577.5,
    greenElecKWh: 210000,
    greenElecOffsetTCO2: 80.9,
    gecCertificateCount: 50,
    gecOffsetTCO2: 19.3,
    outputValueTenThousand: 11500,
    yoyRate: '-6.5% ↓',
  },
}

// 集团 6 家直属制造单位碳排放大盘对比清单
const GROUP_6_COMPANIES_DATA = [
  {
    id: 'ws_sb_main',
    name: '沈变公司',
    province: '辽宁省',
    factor: 0.5703,
    initialCarbon: 12450.6,
    solarOffset: 3420.5,
    greenElecOffset: 680.4,
    gecOffset: 185.2,
    totalOffset: 4286.1,
    netCarbon: 8164.5,
    outputValue: 46500,
    carbonIntensity: 0.1756, // tCO2/万元
    yoyRate: '-5.2% ↓',
  },
  {
    id: 'ws_hb_main',
    name: '衡变公司',
    province: '湖南省',
    factor: 0.5271,
    initialCarbon: 10820.4,
    solarOffset: 2890.2,
    greenElecOffset: 520.0,
    gecOffset: 150.0,
    totalOffset: 3560.2,
    netCarbon: 7260.2,
    outputValue: 42000,
    carbonIntensity: 0.1729,
    yoyRate: '-4.6% ↓',
  },
  {
    id: 'ws_xb_uhv',
    name: '新变厂',
    province: '新疆',
    factor: 0.5691,
    initialCarbon: 13950.0,
    solarOffset: 4100.0,
    greenElecOffset: 750.0,
    gecOffset: 220.0,
    totalOffset: 5070.0,
    netCarbon: 8880.0,
    outputValue: 51200,
    carbonIntensity: 0.1734,
    yoyRate: '-5.8% ↓',
  },
  {
    id: 'ws_ll_main',
    name: '鲁缆公司',
    province: '山东省',
    factor: 0.5884,
    initialCarbon: 9480.2,
    solarOffset: 2100.0,
    greenElecOffset: 420.0,
    gecOffset: 120.0,
    totalOffset: 2640.0,
    netCarbon: 6840.2,
    outputValue: 36400,
    carbonIntensity: 0.1879,
    yoyRate: '-3.9% ↓',
  },
  {
    id: 'ws_xl_main',
    name: '新缆厂',
    province: '新疆',
    factor: 0.5691,
    initialCarbon: 6820.5,
    solarOffset: 1800.0,
    greenElecOffset: 310.0,
    gecOffset: 95.0,
    totalOffset: 2205.0,
    netCarbon: 4615.5,
    outputValue: 25600,
    carbonIntensity: 0.1803,
    yoyRate: '-4.2% ↓',
  },
  {
    id: 'ws_dl_main',
    name: '德缆公司',
    province: '四川省',
    factor: 0.3850,
    initialCarbon: 5098.3,
    solarOffset: 1250.0,
    greenElecOffset: 240.0,
    gecOffset: 65.0,
    totalOffset: 1555.0,
    netCarbon: 3543.3,
    outputValue: 23000,
    carbonIntensity: 0.1541,
    yoyRate: '-6.5% ↓',
  },
]

// 集团变化趋势数据字典（近12个月、近12季度、近3年）
const GROUP_TREND_DATA = {
  months12: [
    { period: '25-09', 初始碳排放: 59850, 净碳排放: 43250, 碳抵消量: 16600, 万元产值碳排放: 0.152 },
    { period: '25-10', 初始碳排放: 59420, 净碳排放: 42720, 碳抵消量: 16700, 万元产值碳排放: 0.150 },
    { period: '25-11', 初始碳排放: 59180, 净碳排放: 42480, 碳抵消量: 16700, 万元产值碳排放: 0.149 },
    { period: '25-12', 初始碳排放: 59750, 净碳排放: 42950, 碳抵消量: 16800, 万元产值碳排放: 0.151 },
    { period: '26-01', 初始碳排放: 58860, 净碳排放: 41960, 碳抵消量: 16900, 万元产值碳排放: 0.147 },
    { period: '26-02', 初始碳排放: 58720, 净碳排放: 41720, 碳抵消量: 17000, 万元产值碳排放: 0.146 },
    { period: '26-03', 初始碳排放: 59010, 净碳排放: 41910, 碳抵消量: 17100, 万元产值碳排放: 0.146 },
    { period: '26-04', 初始碳排放: 58750, 净碳排放: 41550, 碳抵消量: 17200, 万元产值碳排放: 0.145 },
    { period: '26-05', 初始碳排放: 58620, 净碳排放: 41320, 碳抵消量: 17300, 万元产值碳排放: 0.144 },
    { period: '26-06', 初始碳排放: 58890, 净碳排放: 41540, 碳抵消量: 17350, 万元产值碳排放: 0.144 },
    { period: '26-07', 初始碳排放: 58580, 净碳排放: 41210, 碳抵消量: 17370, 万元产值碳排放: 0.143 },
    { period: '26-08', 初始碳排放: 58620, 净碳排放: 41250, 碳抵消量: 17370, 万元产值碳排放: 0.1425 },
  ],
  quarters12: [
    { period: '23-Q4', 初始碳排放: 186500, 净碳排放: 142500, 碳抵消量: 44000, 万元产值碳排放: 0.168 },
    { period: '24-Q1', 初始碳排放: 184200, 净碳排放: 139200, 碳抵消量: 45000, 万元产值碳排放: 0.165 },
    { period: '24-Q2', 初始碳排放: 182600, 净碳排放: 136600, 碳抵消量: 46000, 万元产值碳排放: 0.162 },
    { period: '24-Q3', 初始碳排放: 181500, 净碳排放: 134500, 碳抵消量: 47000, 万元产值碳排放: 0.159 },
    { period: '24-Q4', 初始碳排放: 183200, 净碳排放: 135200, 碳抵消量: 48000, 万元产值碳排放: 0.158 },
    { period: '25-Q1', 初始碳排放: 179500, 净碳排放: 130500, 碳抵消量: 49000, 万元产值碳排放: 0.154 },
    { period: '25-Q2', 初始碳排放: 178200, 净碳排放: 128200, 碳抵消量: 50000, 万元产值碳排放: 0.151 },
    { period: '25-Q3', 初始碳排放: 177400, 净碳排放: 126400, 碳抵消量: 51000, 万元产值碳排放: 0.149 },
    { period: '25-Q4', 初始碳排放: 178100, 净碳排放: 126100, 碳抵消量: 52000, 万元产值碳排放: 0.148 },
    { period: '26-Q1', 初始碳排放: 176200, 净碳排放: 123800, 碳抵消量: 52400, 万元产值碳排放: 0.145 },
    { period: '26-Q2', 初始碳排放: 175800, 净碳排放: 123200, 碳抵消量: 52600, 万元产值碳排放: 0.144 },
    { period: '26-Q3', 初始碳排放: 175860, 净碳排放: 123750, 碳抵消量: 52110, 万元产值碳排放: 0.1425 },
  ],
  years3: [
    { period: '2024年', 初始碳排放: 731800, 净碳排放: 545500, 碳抵消量: 186300, 万元产值碳排放: 0.161 },
    { period: '2025年', 初始碳排放: 713200, 净碳排放: 511200, 碳抵消量: 202000, 万元产值碳排放: 0.150 },
    { period: '2026年(预)', 初始碳排放: 703440, 净碳排放: 495000, 碳抵消量: 208440, 万元产值碳排放: 0.1425 },
  ],
}

export default function CarbonEmissionMonitoringPage() {
  // 左侧组织拓扑树选中节点 (三级驱动)
  const [selectedOrgNode, setSelectedOrgNode] = useState<StandardOrgNode>({
    id: 'ent_root',
    name: '电装集团',
    fullName: '电装集团',
    level: 'group',
    badge: '全集团',
  })

  // 层级模式：isGroupLevel 表示是否在全集团总览页
  const isGroupLevel = selectedOrgNode.id === 'ent_root' || selectedOrgNode.id === 'group_root' || selectedOrgNode.level === 'group'
  const isCompanyLevel = selectedOrgNode.level === 'company' || selectedOrgNode.id.startsWith('comp_')
  const isLevel3 = !isGroupLevel && !isCompanyLevel

  const [selectedUnitKey, setSelectedUnitKey] = useState<string>('ws_sb_main')

  // 时间维度状态
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  // 集团趋势维度：'months12' | 'quarters12' | 'years3'
  const [groupTrendDim, setGroupTrendDim] = useState<'months12' | 'quarters12' | 'years3'>('months12')

  // 当前选中工厂的数据
  const activeFactory = FACTORY_PRESETS[selectedUnitKey] || FACTORY_PRESETS.ws_sb_main

  // 组织树节点点击处理
  const handleSelectTreeNode = (node: StandardOrgNode) => {
    setSelectedOrgNode(node)
    if (node.id === 'ent_root' || node.id === 'group_root' || node.level === 'group') {
      return
    }

    let targetKey = 'ws_sb_main'
    if (FACTORY_PRESETS[node.id]) {
      targetKey = node.id
    } else {
      const foundKey = Object.keys(FACTORY_PRESETS).find(
        (k) =>
          node.id.toLowerCase().includes(k.replace('ws_', '')) ||
          node.name.includes(FACTORY_PRESETS[k].parentCompany) ||
          node.name.includes(FACTORY_PRESETS[k].name.slice(0, 2))
      )
      if (foundKey) targetKey = foundKey
    }
    setSelectedUnitKey(targetKey)
  }

  // =========================================================================
  // 经营单位/工厂级 精准碳排放核算模型 (去碳汇、直供/交易绿电/绿证抵消)
  // =========================================================================
  const unitCalculations = useMemo(() => {
    // 1. 初始排放量 (tCO2)
    // 电力碳排放 = (用电量 / 1000) * 分省电力因子
    const elecGrossCarbon = Number(((activeFactory.elecKWh / 1000) * activeFactory.gridFactor).toFixed(1))
    // 燃气碳排放 = 天然气(m3) * 0.002162 tCO2/m3
    const gasGrossCarbon = Number((activeFactory.gasM3 * 0.002162).toFixed(1))
    // 蒸汽碳排放 = 外购蒸汽(t) * 0.1100 tCO2/t
    const steamGrossCarbon = Number((activeFactory.steamT * 0.1100).toFixed(1))
    const initialCarbon = Number((elecGrossCarbon + gasGrossCarbon + steamGrossCarbon).toFixed(1))

    // 2. 碳抵消量 (直供绿电 + 交易绿电 + 交易绿证)
    const solarOffset = activeFactory.solarOffsetTCO2
    const greenElecOffset = activeFactory.greenElecOffsetTCO2
    const gecOffset = activeFactory.gecOffsetTCO2
    const totalOffset = Number((solarOffset + greenElecOffset + gecOffset).toFixed(1))

    // 3. 净碳排放量 = 初始碳排放 - 碳抵消量
    const netCarbon = Number(Math.max(0, initialCarbon - totalOffset).toFixed(1))
    const offsetRate = Number(((totalOffset / initialCarbon) * 100).toFixed(1))

    // 万元产值碳排放强度 (tCO2/万元)
    const carbonIntensity = Number((netCarbon / activeFactory.outputValueTenThousand).toFixed(4))

    return {
      elecGrossCarbon,
      gasGrossCarbon,
      steamGrossCarbon,
      initialCarbon,
      solarOffset,
      greenElecOffset,
      gecOffset,
      totalOffset,
      netCarbon,
      offsetRate,
      carbonIntensity,
    }
  }, [activeFactory])

  // 经营单位历史趋势数据 (月度/季度/年度自适应)
  const unitTrendData = useMemo(() => {
    const months = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月']
    const baseInitial = unitCalculations.initialCarbon / 8
    const baseOffset = unitCalculations.totalOffset / 8
    return months.map((m, idx) => {
      const init = Number((baseInitial * (0.95 + idx * 0.015)).toFixed(1))
      const off = Number((baseOffset * (0.90 + idx * 0.028)).toFixed(1))
      const net = Number((init - off).toFixed(1))
      const intensity = Number((net / (activeFactory.outputValueTenThousand / 8)).toFixed(3))
      return {
        month: m,
        初始排放: init,
        碳抵消量: off,
        净碳排放: net,
        万元产值碳排放: intensity,
      }
    })
  }, [unitCalculations, activeFactory.outputValueTenThousand])

  // 经营单位净碳排放结构饼图数据
  const unitNetCarbonDonutData = useMemo(() => {
    const remElecCarbon = Math.max(0, unitCalculations.elecGrossCarbon - unitCalculations.totalOffset)
    return [
      { name: '电力剩余净排放', value: Number(remElecCarbon.toFixed(1)), color: '#1677ff' },
      { name: '外购蒸汽排放', value: unitCalculations.steamGrossCarbon, color: '#a855f7' },
      { name: '燃气直接排放', value: unitCalculations.gasGrossCarbon, color: '#fa8c16' },
    ]
  }, [unitCalculations])

  // 集团总览净碳排放结构饼图数据
  const groupNetCarbonDonutData = useMemo(() => {
    return [
      { name: '外购电力净排放', value: 28520, color: '#1677ff' },
      { name: '外购蒸汽碳排放', value: 8210, color: '#a855f7' },
      { name: '燃气及化石能源', value: 4520, color: '#fa8c16' },
    ]
  }, [])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 左侧标准组织机构树 (270px 树状驱动) */}
      <StandardOrgTree
        selectedId={selectedOrgNode.id}
        onSelect={handleSelectTreeNode}
      />

      {/* 右侧主业务看板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* ========================================================================= */}
        {/* 顶部统一时间维度控制栏 (月度 / 季度 / 年度 + 导出) */}
        {/* ========================================================================= */}
        <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Activity className="size-5" />
            </div>
            <h1 className="text-base font-bold text-foreground">能源碳排放监测</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 时间维度切换 (月度 / 季度 / 年度) */}
            <div className="flex items-center bg-panel p-0.5 rounded-lg border border-border text-xs font-sans">
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'month' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                月度
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('quarter')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'quarter' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                季度
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('year')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'year' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                年度
              </button>
            </div>

            {/* 动态时间范围控件 */}
            {timeDim === 'month' && (
              <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                <input
                  type="month"
                  value={selectedMonthRange.start}
                  onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                />
                <span className="text-muted-foreground font-sans">至</span>
                <input
                  type="month"
                  value={selectedMonthRange.end}
                  onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                />
              </div>
            )}

            {timeDim === 'quarter' && (
              <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                >
                  <option value="2026-Q1" className="bg-popover text-foreground">2026年 第一季度 (Q1)</option>
                  <option value="2026-Q2" className="bg-popover text-foreground">2026年 第二季度 (Q2)</option>
                  <option value="2026-Q3" className="bg-popover text-foreground">2026年 第三季度 (Q3)</option>
                  <option value="2026-Q4" className="bg-popover text-foreground">2026年 第四季度 (Q4)</option>
                </select>
              </div>
            )}

            {timeDim === 'year' && (
              <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                >
                  <option value="2026" className="bg-popover text-foreground">2026 年度</option>
                  <option value="2025" className="bg-popover text-foreground">2025 年度</option>
                  <option value="2024" className="bg-popover text-foreground">2024 年度</option>
                </select>
              </div>
            )}

            {/* 导出报表 */}
            <button
              type="button"
              onClick={() => alert(`正在导出【${selectedOrgNode.name}】能源碳排放全景监测报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs cursor-pointer shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 场景 A：电装集团页 (Group Level) */}
        {/* ========================================================================= */}
        {isGroupLevel ? (
          <div className="space-y-3.5">
            {/* 1. 集团三大核心指标卡片 (净碳排放量、初始碳排放量、碳抵消量) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* 卡片 1: 净碳排放量 */}
              <div className="bg-card p-4 rounded-xl border border-primary/30 shadow-xs space-y-2 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_12%,var(--card)),var(--card))]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-primary" />
                    集团净碳排放量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-primary flex items-baseline gap-1.5">
                  41,250.6 <span className="text-xs font-normal text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-sans">
                  <span className="text-muted-foreground">同比变动: <strong className="font-mono text-emerald-400">-4.8% ↓</strong></span>
                  <span className="text-muted-foreground">综合净减排率: <strong className="font-mono text-primary">29.6%</strong></span>
                </div>
              </div>

              {/* 卡片 2: 初始碳排放量 */}
              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Zap className="size-4 text-amber-400" />
                    集团初始碳排放量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-foreground flex items-baseline gap-1.5">
                  58,620.0 <span className="text-xs font-normal text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-sans text-muted-foreground">
                  <span>外购电力: <strong className="font-mono text-foreground">48,210.0 t</strong></span>
                  <span>其他: <strong className="font-mono text-foreground">10,410.0 t</strong></span>
                </div>
              </div>

              {/* 卡片 3: 碳抵消量 (3大抵消拆解) */}
              <div className="bg-card p-4 rounded-xl border border-emerald-500/30 shadow-xs space-y-2 bg-[linear-gradient(135deg,color-mix(in_oklch,#10b981_12%,var(--card)),var(--card))]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Award className="size-4 text-emerald-400" />
                    集团碳抵消总量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-emerald-400 flex items-baseline gap-1.5">
                  17,369.4 <span className="text-xs font-normal text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-border/60 grid grid-cols-3 gap-1 text-[11px] font-sans text-muted-foreground text-center">
                  <div className="bg-panel p-1 rounded border border-border">
                    <span className="text-[10px] text-muted-foreground block">直供绿电</span>
                    <strong className="font-mono text-emerald-400">8,450.2t</strong>
                  </div>
                  <div className="bg-panel p-1 rounded border border-border">
                    <span className="text-[10px] text-muted-foreground block">交易绿电</span>
                    <strong className="font-mono text-primary">5,680.0t</strong>
                  </div>
                  <div className="bg-panel p-1 rounded border border-border">
                    <span className="text-[10px] text-muted-foreground block">交易绿证</span>
                    <strong className="font-mono text-purple-400">3,239.2t</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 净碳排放结构 (环形饼图 + 抵消路径拆解) */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    集团净碳排放结构与 3 大绿色抵消构成全景
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  公式：净碳排放量 (41,250.6 tCO₂) = 初始碳排放量 (58,620.0 tCO₂) - 碳抵消量 (17,369.4 tCO₂)
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* 左侧 5/12: 净碳排放来源构成环形图 */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-2 border-r border-border/60 pr-2">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                    <PieIcon className="size-3.5 text-primary" />
                    净碳排放介质结构占比
                  </div>
                  <Donut data={groupNetCarbonDonutData} height={190} unit="tCO₂" />
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono pt-1">
                    <div className="p-1.5 rounded bg-panel text-primary border border-border text-center">
                      <span className="text-[10px] text-muted-foreground font-sans block">外购电力</span>
                      <strong>69.1%</strong>
                    </div>
                    <div className="p-1.5 rounded bg-panel text-purple-400 border border-border text-center">
                      <span className="text-[10px] text-muted-foreground font-sans block">外购蒸汽</span>
                      <strong>19.9%</strong>
                    </div>
                    <div className="p-1.5 rounded bg-panel text-amber-400 border border-border text-center">
                      <span className="text-[10px] text-muted-foreground font-sans block">化石燃气</span>
                      <strong>11.0%</strong>
                    </div>
                  </div>
                </div>

                {/* 右侧 7/12: 3 大绿色抵消途径深度剖析 */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                    <Award className="size-3.5 text-emerald-400" />
                    三大碳抵消量执行结构与中和进度
                  </div>

                  <div className="space-y-2.5">
                    {/* 1. 直供绿电 */}
                    <div className="p-2.5 rounded-lg bg-panel border border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                          1. 直供绿电抵消
                        </span>
                        <span className="font-mono font-bold text-emerald-400">8,450.2 tCO₂ (占总抵消 48.6%)</span>
                      </div>
                      <div className="w-full bg-panel rounded-full h-2 overflow-hidden border border-border">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '48.6%' }} />
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        直供绿电量: 1,481.8 万 kWh
                      </div>
                    </div>

                    {/* 2. 交易绿电 */}
                    <div className="p-2.5 rounded-lg bg-panel border border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-primary flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-primary" />
                          2. 交易绿电抵消
                        </span>
                        <span className="font-mono font-bold text-primary">5,680.0 tCO₂ (占总抵消 32.7%)</span>
                      </div>
                      <div className="w-full bg-panel rounded-full h-2 overflow-hidden border border-border">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '32.7%' }} />
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        交易绿电量: 996.0 万 kWh
                      </div>
                    </div>

                    {/* 3. 交易绿证 */}
                    <div className="p-2.5 rounded-lg bg-panel border border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-purple-400" />
                          3. 交易绿证抵消
                        </span>
                        <span className="font-mono font-bold text-purple-400">3,239.2 tCO₂ (占总抵消 18.7%)</span>
                      </div>
                      <div className="w-full bg-panel rounded-full h-2 overflow-hidden border border-border">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '18.7%' }} />
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        交易绿证量: 5,680 张 GEC
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 展示 6 家直属制造单位的数 (表格) */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex flex-wrap items-center justify-between bg-panel/60 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    集团 6 大直属制造单位碳排放与绿电/绿证抵消对标明细表
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => alert('正在导出 6 家单位碳排放与抵消对标明细 (Excel)...')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-panel border border-border text-foreground font-medium hover:bg-accent/40 cursor-pointer shadow-2xs text-xs"
                >
                  <Download className="size-3.5 text-muted-foreground" />
                  <span>导出 6 家单位数据</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-panel border-b border-border text-muted-foreground font-semibold font-sans">
                      <th className="py-2.5 px-3">单位名称</th>
                      <th className="py-2.5 px-3">所属电网 / 电力因子</th>
                      <th className="py-2.5 px-3 text-primary font-extrabold">净碳排放量 (tCO₂)</th>
                      <th className="py-2.5 px-3 text-primary font-bold">净碳排放量占比 (%)</th>
                      <th className="py-2.5 px-3">初始碳排放 (tCO₂)</th>
                      <th className="py-2.5 px-3 text-emerald-400">直供绿电抵消 (t)</th>
                      <th className="py-2.5 px-3 text-primary">交易绿电抵消 (t)</th>
                      <th className="py-2.5 px-3 text-purple-400">交易绿证抵消 (t)</th>
                      <th className="py-2.5 px-3 text-emerald-400 font-bold">总抵消量 (tCO₂)</th>
                      <th className="py-2.5 px-3">万元产值碳排放</th>
                      <th className="py-2.5 px-3">同比变动</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {GROUP_6_COMPANIES_DATA.map((row) => {
                      const netRatio = ((row.netCarbon / 39303.7) * 100).toFixed(1)
                      return (
                        <tr key={row.id} className="hover:bg-accent/30 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-foreground font-sans flex items-center gap-1.5">
                            <Factory className="size-3.5 text-muted-foreground" />
                            {row.name}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {row.province} ({row.factor})
                          </td>
                          <td className="py-2.5 px-3 text-primary font-extrabold text-sm">{row.netCarbon.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-extrabold text-primary">{netRatio}%</td>
                          <td className="py-2.5 px-3 font-bold text-foreground">{row.initialCarbon.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">{row.solarOffset.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-primary font-bold">{row.greenElecOffset.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-purple-400 font-bold">{row.gecOffset.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-extrabold">{row.totalOffset.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-bold text-foreground">
                            {row.carbonIntensity} <span className="text-[10px] text-muted-foreground font-normal">t/万元</span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-400">{row.yoyRate}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. 集团变化趋势（近12个月、近12季度、近3年） */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    集团能源碳排放总量与万元产值碳强度中长期变化趋势
                  </h3>
                </div>

                {/* 趋势维度切换：近12个月 | 近12季度 | 近3年 */}
                <div className="flex items-center gap-1 bg-panel p-1 rounded-lg border border-border font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => setGroupTrendDim('months12')}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                      groupTrendDim === 'months12' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    近 12 个月
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroupTrendDim('quarters12')}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                      groupTrendDim === 'quarters12' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    近 12 季度
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroupTrendDim('years3')}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                      groupTrendDim === 'years3' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    近 3 年
                  </button>
                </div>
              </div>

              <div className="h-[270px]">
                <LineTrend
                  data={GROUP_TREND_DATA[groupTrendDim]}
                  xKey="period"
                  height={270}
                  yUnit="tCO₂"
                  lines={[
                    { key: '初始碳排放', name: '初始碳排放总量 (tCO₂)', color: '#f59e0b' },
                    { key: '净碳排放', name: '净碳排放量 (tCO₂)', color: 'oklch(0.72 0.18 210)' },
                    { key: '碳抵消量', name: '绿电与绿证抵消总量 (tCO₂)', color: '#10b981' },
                  ]}
                />
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 场景 B：经营单位和项目公司页 (Unit / Factory Level) */
          /* ========================================================================= */
          <div className="space-y-3.5">
            {/* 1. 顶部电力因子提示条 (仅在3级车间/工厂层级显示) */}
            {isLevel3 && (
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-foreground">
                  <Info className="size-4 text-primary shrink-0" />
                  <span>
                    <strong>电力核算基准因子提示：</strong>当前【{activeFactory.name}】所在区域为<strong>【{activeFactory.province}】</strong>，依<strong>【国家温室气体排放数据库】</strong>选用分省电网电力排放因子：
                    <span className="font-mono font-bold text-primary ml-1 bg-panel px-1.5 py-0.5 rounded border border-primary/30">
                      {activeFactory.gridFactor} tCO₂/MWh
                    </span>
                  </span>
                </div>
                <span className="text-[11px] text-primary font-mono">
                  自动拉取全国统一电力因子库
                </span>
              </div>
            )}

            {/* 2. 主要放 3 个核心数卡片 (净碳排放量、初始碳排放量、碳抵消量) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* 卡片 1: 净碳排放量 */}
              <div className="bg-card p-4 rounded-xl border border-primary/30 shadow-xs space-y-2 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_12%,var(--card)),var(--card))]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-primary" />
                    净碳排放量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-primary flex items-baseline gap-1.5">
                  {unitCalculations.netCarbon.toLocaleString()} <span className="text-xs font-normal text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-sans">
                  <span className="text-muted-foreground">同比变动: <strong className="font-mono text-emerald-400">{activeFactory.yoyRate}</strong></span>
                  <span className="text-muted-foreground">综合减排率: <strong className="font-mono text-primary">{unitCalculations.offsetRate}%</strong></span>
                </div>
              </div>

              {/* 卡片 2: 初始碳排放量 */}
              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Zap className="size-4 text-amber-400" />
                    初始碳排放量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-foreground flex items-baseline gap-1.5">
                  {unitCalculations.initialCarbon.toLocaleString()} <span className="text-xs font-normal text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-sans text-muted-foreground">
                  <span>外购电力: <strong className="font-mono text-foreground">{unitCalculations.elecGrossCarbon} t</strong></span>
                  <span>其他: <strong className="font-mono text-foreground">{(unitCalculations.gasGrossCarbon + unitCalculations.steamGrossCarbon).toFixed(1)} t</strong></span>
                </div>
              </div>

              {/* 卡片 3: 碳抵消量 (直供绿电 + 交易绿电 + 交易绿证) */}
              <div className="bg-card p-4 rounded-xl border border-emerald-500/30 shadow-xs space-y-2 bg-[linear-gradient(135deg,color-mix(in_oklch,#10b981_12%,var(--card)),var(--card))]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Award className="size-4 text-emerald-400" />
                    碳抵消总量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-emerald-400 flex items-baseline gap-1.5">
                  {unitCalculations.totalOffset.toLocaleString()} <span className="text-xs font-normal text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-border/60 grid grid-cols-3 gap-1 text-[11px] font-sans text-muted-foreground text-center">
                  <div className="bg-panel p-1 rounded border border-border">
                    <span className="text-[10px] text-muted-foreground block">直供绿电</span>
                    <strong className="font-mono text-emerald-400">{unitCalculations.solarOffset}t</strong>
                  </div>
                  <div className="bg-panel p-1 rounded border border-border">
                    <span className="text-[10px] text-muted-foreground block">交易绿电</span>
                    <strong className="font-mono text-primary">{unitCalculations.greenElecOffset}t</strong>
                  </div>
                  <div className="bg-panel p-1 rounded border border-border">
                    <span className="text-[10px] text-muted-foreground block">交易绿证</span>
                    <strong className="font-mono text-purple-400">{unitCalculations.gecOffset}t</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 展示净碳排放的结构 (饼图与抵消拆解) */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    净碳排放结构与 3 大绿色抵消构成全景
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  公式：净碳排放量 ({unitCalculations.netCarbon.toLocaleString()} tCO₂) = 初始碳排放量 ({unitCalculations.initialCarbon.toLocaleString()} tCO₂) - 碳抵消量 ({unitCalculations.totalOffset.toLocaleString()} tCO₂)
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* 左侧 5/12: 净碳排放构成环形图 */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-2 border-r border-border/60 pr-2">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                    <PieIcon className="size-3.5 text-primary" />
                    净碳排放介质结构占比
                  </div>
                  <Donut data={unitNetCarbonDonutData} height={190} unit="tCO₂" />
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono pt-1 text-center">
                    <div className="p-1.5 rounded bg-panel text-primary border border-border">
                      <span className="text-[10px] text-muted-foreground font-sans block">外购电力</span>
                      <strong>{((unitNetCarbonDonutData[0].value / unitCalculations.netCarbon) * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="p-1.5 rounded bg-panel text-purple-400 border border-border">
                      <span className="text-[10px] text-muted-foreground font-sans block">外购蒸汽</span>
                      <strong>{((unitCalculations.steamGrossCarbon / unitCalculations.netCarbon) * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="p-1.5 rounded bg-panel text-amber-400 border border-border">
                      <span className="text-[10px] text-muted-foreground font-sans block">化石燃气</span>
                      <strong>{((unitCalculations.gasGrossCarbon / unitCalculations.netCarbon) * 100).toFixed(1)}%</strong>
                    </div>
                  </div>
                </div>

                {/* 右侧 7/12: 3 大绿色抵消途径深度剖析 */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                    <Award className="size-3.5 text-emerald-400" />
                    三大碳抵消量执行结构与中和进度
                  </div>

                  <div className="space-y-2.5">
                    {/* 1. 直供绿电 */}
                    <div className="p-2.5 rounded-lg bg-panel border border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                          1. 直供绿电抵消
                        </span>
                        <span className="font-mono font-bold text-emerald-400">
                          {unitCalculations.solarOffset.toLocaleString()} tCO₂ (占总抵消 {((unitCalculations.solarOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-panel rounded-full h-2 overflow-hidden border border-border">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${((unitCalculations.solarOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        直供绿电量: {(activeFactory.solarSelfKWh / 10000).toFixed(1)} 万 kWh
                      </div>
                    </div>

                    {/* 2. 交易绿电 */}
                    <div className="p-2.5 rounded-lg bg-panel border border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-primary flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-primary" />
                          2. 交易绿电抵消
                        </span>
                        <span className="font-mono font-bold text-primary">
                          {unitCalculations.greenElecOffset.toLocaleString()} tCO₂ (占总抵消 {((unitCalculations.greenElecOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-panel rounded-full h-2 overflow-hidden border border-border">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${((unitCalculations.greenElecOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        交易绿电量: {(activeFactory.greenElecKWh / 10000).toFixed(1)} 万 kWh
                      </div>
                    </div>

                    {/* 3. 交易绿证 */}
                    <div className="p-2.5 rounded-lg bg-panel border border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-purple-400" />
                          3. 交易绿证抵消
                        </span>
                        <span className="font-mono font-bold text-purple-400">
                          {unitCalculations.gecOffset.toLocaleString()} tCO₂ (占总抵消 {((unitCalculations.gecOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-panel rounded-full h-2 overflow-hidden border border-border">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${((unitCalculations.gecOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        交易绿证量: {activeFactory.gecCertificateCount.toLocaleString()} 张 GEC
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 展示碳排放总量、万元产值碳排放变化趋势 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              {/* 图表 1: 碳排放总量历史变化趋势 */}
              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <h3 className="text-xs font-bold text-foreground">
                      碳排放总量历史变化趋势 (tCO₂)
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">初始排放 vs 净碳排放</span>
                </div>

                <div className="h-[240px]">
                  <LineTrend
                    data={unitTrendData}
                    xKey="month"
                    height={240}
                    yUnit="tCO₂"
                    lines={[
                      { key: '初始排放', name: '初始碳排放 (tCO₂)', color: '#f59e0b' },
                      { key: '净碳排放', name: '净碳排放量 (tCO₂)', color: 'oklch(0.72 0.18 210)' },
                      { key: '碳抵消量', name: '绿电绿证抵消 (tCO₂)', color: '#10b981' },
                    ]}
                  />
                </div>
              </div>

              {/* 图表 2: 万元产值碳排放变化趋势 */}
              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    <h3 className="text-xs font-bold text-foreground">
                      万元产值碳排放变化趋势
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">单位产值碳强度 (tCO₂/万元)</span>
                </div>

                <div className="h-[240px]">
                  <LineTrend
                    data={unitTrendData}
                    xKey="month"
                    height={240}
                    yUnit="t/万元"
                    lines={[
                      { key: '万元产值碳排放', name: '万元产值碳排放 (tCO₂/万元)', color: 'oklch(0.72 0.18 210)' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* 5. 底部明细台账表格 */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex flex-wrap items-center justify-between bg-panel/60 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    月度能源消耗与碳排放核算明细台账
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`正在导出【${activeFactory.name}】碳核算明细台账 (Excel)...`)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-panel border border-border text-foreground font-medium hover:bg-accent/40 cursor-pointer shadow-2xs text-xs"
                >
                  <Download className="size-3.5 text-muted-foreground" />
                  <span>导出明细</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-panel border-b border-border text-muted-foreground font-semibold font-sans">
                      <th className="py-2.5 px-3">核算账期</th>
                      <th className="py-2.5 px-3">工业用电 (kWh)</th>
                      <th className="py-2.5 px-3">天然气 (m³)</th>
                      <th className="py-2.5 px-3">外购蒸汽 (t)</th>
                      <th className="py-2.5 px-3">初始碳排放 (tCO₂)</th>
                      <th className="py-2.5 px-3 text-emerald-400 font-bold">直供绿电抵消</th>
                      <th className="py-2.5 px-3 text-primary font-bold">交易绿电抵消</th>
                      <th className="py-2.5 px-3 text-purple-400 font-bold">绿证核销抵消</th>
                      <th className="py-2.5 px-3 text-primary font-extrabold">净碳排放量 (tCO₂)</th>
                      <th className="py-2.5 px-3">万元产值碳强度</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {unitTrendData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-accent/30 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-foreground font-sans">2026年{row.month}</td>
                        <td className="py-2.5 px-3 font-bold text-foreground">
                          {Math.round(activeFactory.elecKWh / 8 * (0.95 + idx * 0.01)).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-amber-400">
                          {Math.round(activeFactory.gasM3 / 8 * (0.92 + idx * 0.02)).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-purple-400">
                          {Math.round(activeFactory.steamT / 8 * (0.96 + idx * 0.01)).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-foreground">{row.初始排放.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">
                          {(row.碳抵消量 * 0.82).toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-primary font-bold">
                          {(row.碳抵消量 * 0.14).toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-purple-400 font-bold">
                          {(row.碳抵消量 * 0.04).toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-primary font-extrabold text-sm">{row.净碳排放.toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-bold text-foreground">
                          {row.万元产值碳排放} <span className="text-[10px] text-muted-foreground font-normal">t/万元</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

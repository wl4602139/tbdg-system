'use client'

import React, { useState, useMemo } from 'react'
import {
  Activity,
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
  LineChart as LineChartIcon,
  Table as TableIcon,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend, BarChartGroup, Donut } from '@/components/shared/charts'
import { ExportButton } from '@/components/shared/primitives'
import { getPeriodScaleFactor, getTimeDimensionLabel } from '@/components/shared/time-dimension-engine'
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

// 集团变化趋势数据字典（近12个月、近4季度、近6年）
const GROUP_TREND_DATA = {
  months12: [
    { period: '25-09', periodLabel: '2025年09月', 初始碳排放: 59850, 净碳排放: 43250, 碳抵消量: 16600, elecCarbon: 49100, steamCarbon: 7180, gasCarbon: 3570, solarOffset: 8050, greenElecOffset: 5480, gecOffset: 3070 },
    { period: '25-10', periodLabel: '2025年10月', 初始碳排放: 59420, 净碳排放: 42720, 碳抵消量: 16700, elecCarbon: 48750, steamCarbon: 7130, gasCarbon: 3540, solarOffset: 8100, greenElecOffset: 5510, gecOffset: 3090 },
    { period: '25-11', periodLabel: '2025年11月', 初始碳排放: 59180, 净碳排放: 42480, 碳抵消量: 16700, elecCarbon: 48550, steamCarbon: 7100, gasCarbon: 3530, solarOffset: 8120, greenElecOffset: 5510, gecOffset: 3070 },
    { period: '25-12', periodLabel: '2025年12月', 初始碳排放: 59750, 净碳排放: 42950, 碳抵消量: 16800, elecCarbon: 49020, steamCarbon: 7170, gasCarbon: 3560, solarOffset: 8160, greenElecOffset: 5540, gecOffset: 3100 },
    { period: '26-01', periodLabel: '2026年01月', 初始碳排放: 58860, 净碳排放: 41960, 碳抵消量: 16900, elecCarbon: 48290, steamCarbon: 7060, gasCarbon: 3510, solarOffset: 8210, greenElecOffset: 5580, gecOffset: 3110 },
    { period: '26-02', periodLabel: '2026年02月', 初始碳排放: 58720, 净碳排放: 41720, 碳抵消量: 17000, elecCarbon: 48170, steamCarbon: 7050, gasCarbon: 3500, solarOffset: 8260, greenElecOffset: 5610, gecOffset: 3130 },
    { period: '26-03', periodLabel: '2026年03月', 初始碳排放: 59010, 净碳排放: 41910, 碳抵消量: 17100, elecCarbon: 48410, steamCarbon: 7080, gasCarbon: 3520, solarOffset: 8310, greenElecOffset: 5640, gecOffset: 3150 },
    { period: '26-04', periodLabel: '2026年04月', 初始碳排放: 58750, 净碳排放: 41550, 碳抵消量: 17200, elecCarbon: 48200, steamCarbon: 7050, gasCarbon: 3500, solarOffset: 8360, greenElecOffset: 5680, gecOffset: 3160 },
    { period: '26-05', periodLabel: '2026年05月', 初始碳排放: 58620, 净碳排放: 41320, 碳抵消量: 17300, elecCarbon: 48090, steamCarbon: 7030, gasCarbon: 3500, solarOffset: 8410, greenElecOffset: 5710, gecOffset: 3180 },
    { period: '26-06', periodLabel: '2026年06月', 初始碳排放: 58890, 净碳排放: 41540, 碳抵消量: 17350, elecCarbon: 48310, steamCarbon: 7070, gasCarbon: 3510, solarOffset: 8430, greenElecOffset: 5730, gecOffset: 3190 },
    { period: '26-07', periodLabel: '2026年07月', 初始碳排放: 58580, 净碳排放: 41210, 碳抵消量: 17370, elecCarbon: 48060, steamCarbon: 7030, gasCarbon: 3490, solarOffset: 8440, greenElecOffset: 5730, gecOffset: 3200 },
    { period: '26-08', periodLabel: '2026年08月', 初始碳排放: 58620, 净碳排放: 41250, 碳抵消量: 17370, elecCarbon: 48090, steamCarbon: 7030, gasCarbon: 3500, solarOffset: 8450, greenElecOffset: 5730, gecOffset: 3190 },
  ],
  quarters4: [
    { period: '25-Q4', periodLabel: '2025年第4季度', 初始碳排放: 178100, 净碳排放: 126100, 碳抵消量: 52000, elecCarbon: 146040, steamCarbon: 21370, gasCarbon: 10690, solarOffset: 25270, greenElecOffset: 17160, gecOffset: 9570 },
    { period: '26-Q1', periodLabel: '2026年第1季度', 初始碳排放: 176200, 净碳排放: 123800, 碳抵消量: 52400, elecCarbon: 144480, steamCarbon: 21140, gasCarbon: 10580, solarOffset: 25460, greenElecOffset: 17290, gecOffset: 9650 },
    { period: '26-Q2', periodLabel: '2026年第2季度', 初始碳排放: 175800, 净碳排放: 123200, 碳抵消量: 52600, elecCarbon: 144160, steamCarbon: 21100, gasCarbon: 10540, solarOffset: 25560, greenElecOffset: 17360, gecOffset: 9680 },
    { period: '26-Q3', periodLabel: '2026年第3季度', 初始碳排放: 175860, 净碳排放: 123750, 碳抵消量: 52110, elecCarbon: 144210, steamCarbon: 21100, gasCarbon: 10550, solarOffset: 25320, greenElecOffset: 17200, gecOffset: 9590 },
  ],
  years6: [
    { period: '2021年', periodLabel: '2021年度', 初始碳排放: 785000, 净碳排放: 660000, 碳抵消量: 125000, elecCarbon: 643700, steamCarbon: 94200, gasCarbon: 47100, solarOffset: 60800, greenElecOffset: 41200, gecOffset: 23000 },
    { period: '2022年', periodLabel: '2022年度', 初始碳排放: 768000, 净碳排放: 620000, 碳抵消量: 148000, elecCarbon: 629800, steamCarbon: 92100, gasCarbon: 46100, solarOffset: 71900, greenElecOffset: 48800, gecOffset: 27300 },
    { period: '2023年', periodLabel: '2023年度', 初始碳排放: 752000, 净碳排放: 583000, 碳抵消量: 169000, elecCarbon: 616600, steamCarbon: 90200, gasCarbon: 45200, solarOffset: 82100, greenElecOffset: 55800, gecOffset: 31100 },
    { period: '2024年', periodLabel: '2024年度', 初始碳排放: 731800, 净碳排放: 545500, 碳抵消量: 186300, elecCarbon: 600100, steamCarbon: 87800, gasCarbon: 43900, solarOffset: 90500, greenElecOffset: 61500, gecOffset: 34300 },
    { period: '2025年', periodLabel: '2025年度', 初始碳排放: 713200, 净碳排放: 511200, 碳抵消量: 202000, elecCarbon: 584800, steamCarbon: 85600, gasCarbon: 42800, solarOffset: 98200, greenElecOffset: 66700, gecOffset: 37100 },
    { period: '2026年', periodLabel: '2026年度', 初始碳排放: 703440, 净碳排放: 495000, 碳抵消量: 208440, elecCarbon: 576800, steamCarbon: 84400, gasCarbon: 42240, solarOffset: 101300, greenElecOffset: 68800, gecOffset: 38340 },
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

  // 时间维度状态: 'month' | 'quarter' | 'year' | 'custom'
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year' | 'custom'>('month')
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })

  // 图表与明细表格切换视图状态: 'chart' | 'table'
  const [trendViewMode, setTrendViewMode] = useState<'chart' | 'table'>('chart')

  // 计算月份间隔数（包含起止月）
  const getMonthsCount = (start: string, end: string): number => {
    if (!start || !end) return 1
    const [sy, sm] = start.split('-').map(Number)
    const [ey, em] = end.split('-').map(Number)
    return (ey - sy) * 12 + (em - sm) + 1
  }

  // 基于年月增减月数，返回 YYYY-MM
  const addMonthsToYm = (ym: string, delta: number): string => {
    const [y, m] = ym.split('-').map(Number)
    const totalMonths = y * 12 + (m - 1) + delta
    const newY = Math.floor(totalMonths / 12)
    const newM = (totalMonths % 12) + 1
    return `${newY}-${newM < 10 ? '0' + newM : newM}`
  }

  const handleCustomStartMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value
    if (!newStart) return
    setSelectedMonthRange((prev) => {
      let newEnd = prev.end
      if (newStart > newEnd) {
        newEnd = newStart
      }
      if (getMonthsCount(newStart, newEnd) > 12) {
        newEnd = addMonthsToYm(newStart, 11)
      }
      return { start: newStart, end: newEnd }
    })
  }

  const handleCustomEndMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value
    if (!newEnd) return
    setSelectedMonthRange((prev) => {
      let newStart = prev.start
      if (newEnd < newStart) {
        newStart = newEnd
      }
      if (getMonthsCount(newStart, newEnd) > 12) {
        newStart = addMonthsToYm(newEnd, -11)
      }
      return { start: newStart, end: newEnd }
    })
  }

  // 集团碳排放变化趋势数据 (数据和上方的时间控件严格联动: 月12个月, 季度4个季度, 年6年)
  const groupTrendData = useMemo(() => {
    if (timeDim === 'month') {
      const endYm = selectedMonth || '2026-08'
      const startYm = addMonthsToYm(endYm, -11)
      const months: string[] = []
      let curr = startYm
      for (let i = 0; i < 12; i++) {
        months.push(curr)
        curr = addMonthsToYm(curr, 1)
      }
      return months.map((m, idx) => {
        const ym = m.slice(2)
        const found = GROUP_TREND_DATA.months12.find((d) => d.period === ym)
        if (found) return found
        const baseInitial = 58620
        const baseOffset = 17370
        const init = Math.round(baseInitial * (0.95 + (idx % 6) * 0.015))
        const off = Math.round(baseOffset * (0.92 + (idx % 6) * 0.018))
        const net = init - off
        return {
          period: ym,
          periodLabel: `${m.slice(0, 4)}年${m.slice(5)}月`,
          初始碳排放: init,
          净碳排放: net,
          碳抵消量: off,
          elecCarbon: Math.round(init * 0.82),
          steamCarbon: Math.round(init * 0.12),
          gasCarbon: Math.round(init * 0.06),
          solarOffset: Math.round(off * 0.48),
          greenElecOffset: Math.round(off * 0.33),
          gecOffset: Math.round(off * 0.19),
        }
      })
    }
    if (timeDim === 'quarter') {
      return GROUP_TREND_DATA.quarters4
    }
    if (timeDim === 'year') {
      return GROUP_TREND_DATA.years6
    }
    if (timeDim === 'custom') {
      const start = selectedMonthRange.start || '2026-01'
      const end = selectedMonthRange.end || '2026-08'
      const months: string[] = []
      let curr = start
      while (curr <= end && months.length < 24) {
        months.push(curr)
        curr = addMonthsToYm(curr, 1)
      }
      return months.map((m, idx) => {
        const ym = m.slice(2)
        const found = GROUP_TREND_DATA.months12.find((d) => d.period === ym)
        if (found) return found
        const baseInitial = 58620
        const baseOffset = 17370
        const init = Math.round(baseInitial * (0.95 + (idx % 6) * 0.015))
        const off = Math.round(baseOffset * (0.92 + (idx % 6) * 0.018))
        const net = init - off
        return {
          period: ym,
          periodLabel: `${m.slice(0, 4)}年${m.slice(5)}月`,
          初始碳排放: init,
          净碳排放: net,
          碳抵消量: off,
          elecCarbon: Math.round(init * 0.82),
          steamCarbon: Math.round(init * 0.12),
          gasCarbon: Math.round(init * 0.06),
          solarOffset: Math.round(off * 0.48),
          greenElecOffset: Math.round(off * 0.33),
          gecOffset: Math.round(off * 0.19),
        }
      })
    }
    return GROUP_TREND_DATA.months12
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

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

  // 周期缩放因子 (依据月度、季度、年度、自定义自动计算倍率)
  const carbonPeriodScaleFactor = useMemo(() => {
    return getPeriodScaleFactor('sum', timeDim, {
      selectedMonth,
      selectedQuarter,
      selectedYear,
      selectedMonthRange,
    }, { basePeriod: 'month' })
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

  // 🌟 集团大盘 KPI 响应时间尺度
  const groupKpiMetrics = useMemo(() => {
    const net = Number((41250.6 * carbonPeriodScaleFactor).toFixed(1))
    const initial = Number((58620.0 * carbonPeriodScaleFactor).toFixed(1))
    const offset = Number((17369.4 * carbonPeriodScaleFactor).toFixed(1))
    const gridCarbon = Number((48210.0 * carbonPeriodScaleFactor).toFixed(1))
    const otherCarbon = Number((10410.0 * carbonPeriodScaleFactor).toFixed(1))
    const solarOffset = Number((8450.2 * carbonPeriodScaleFactor).toFixed(1))
    const greenElecOffset = Number((5680.0 * carbonPeriodScaleFactor).toFixed(1))
    const gecOffset = Number((3239.2 * carbonPeriodScaleFactor).toFixed(1))
    return {
      net,
      initial,
      offset,
      gridCarbon,
      otherCarbon,
      solarOffset,
      greenElecOffset,
      gecOffset,
    }
  }, [carbonPeriodScaleFactor])

  // =========================================================================
  // 经营单位/工厂级 精准碳排放核算模型 (去碳汇、直供/交易绿电/绿证抵消)
  // =========================================================================
  const unitCalculations = useMemo(() => {
    // 1. 初始排放量 (tCO2)
    // 电力碳排放 = (用电量 / 1000) * 分省电力因子
    const elecGrossCarbon = Number((((activeFactory.elecKWh * carbonPeriodScaleFactor) / 1000) * activeFactory.gridFactor).toFixed(1))
    // 燃气碳排放 = 天然气(m3) * 0.002162 tCO2/m3
    const gasGrossCarbon = Number((activeFactory.gasM3 * carbonPeriodScaleFactor * 0.002162).toFixed(1))
    // 蒸汽碳排放 = 外购蒸汽(t) * 0.1100 tCO2/t
    const steamGrossCarbon = Number((activeFactory.steamT * carbonPeriodScaleFactor * 0.1100).toFixed(1))
    const initialCarbon = Number((elecGrossCarbon + gasGrossCarbon + steamGrossCarbon).toFixed(1))

    // 2. 碳抵消量 (直供绿电 + 交易绿电 + 交易绿证)
    const solarOffset = Number((activeFactory.solarOffsetTCO2 * carbonPeriodScaleFactor).toFixed(1))
    const greenElecOffset = Number((activeFactory.greenElecOffsetTCO2 * carbonPeriodScaleFactor).toFixed(1))
    const gecOffset = Number((activeFactory.gecOffsetTCO2 * carbonPeriodScaleFactor).toFixed(1))
    const totalOffset = Number((solarOffset + greenElecOffset + gecOffset).toFixed(1))

    // 3. 净碳排放量 = 初始碳排放 - 碳抵消量
    const netCarbon = Number(Math.max(0, initialCarbon - totalOffset).toFixed(1))
    const offsetRate = initialCarbon > 0 ? Number(((totalOffset / initialCarbon) * 100).toFixed(1)) : 0

    // 万元产值碳排放强度 (tCO2/万元)
    const scaledOutput = activeFactory.outputValueTenThousand * carbonPeriodScaleFactor
    const carbonIntensity = scaledOutput > 0 ? Number((netCarbon / scaledOutput).toFixed(4)) : 0

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
  }, [activeFactory, carbonPeriodScaleFactor])

  // 经营单位历史趋势数据 (月度12个月 / 季度4季度 / 年度6年自适应)
  const unitTrendData = useMemo(() => {
    if (timeDim === 'quarter') {
      // 4 个季度
      const quarters = [
        { period: '25-Q4', label: '2025年第4季度' },
        { period: '26-Q1', label: '2026年第1季度' },
        { period: '26-Q2', label: '2026年第2季度' },
        { period: '26-Q3', label: '2026年第3季度' },
      ]
      const baseInitial = unitCalculations.initialCarbon * 3
      const baseOffset = unitCalculations.totalOffset * 3
      return quarters.map((q, idx) => {
        const init = Number((baseInitial * (0.96 + idx * 0.012)).toFixed(1))
        const off = Number((baseOffset * (0.92 + idx * 0.025)).toFixed(1))
        const net = Number(Math.max(0, init - off).toFixed(1))
        const elec = Math.round((activeFactory.elecKWh * 3) * (0.96 + idx * 0.012))
        const gas = Math.round((activeFactory.gasM3 * 3) * (0.94 + idx * 0.015))
        const steam = Math.round((activeFactory.steamT * 3) * (0.97 + idx * 0.01))
        const solar = Number((off * 0.65).toFixed(1))
        const green = Number((off * 0.25).toFixed(1))
        const gec = Number((off * 0.10).toFixed(1))
        return {
          month: q.period,
          periodLabel: q.label,
          初始排放: init,
          碳抵消量: off,
          净碳排放: net,
          elecKWh: elec,
          gasM3: gas,
          steamT: steam,
          solarOffset: solar,
          greenElecOffset: green,
          gecOffset: gec,
        }
      })
    }
    if (timeDim === 'year') {
      // 6 个年份
      const years = [
        { period: '2021年', label: '2021年度' },
        { period: '2022年', label: '2022年度' },
        { period: '2023年', label: '2023年度' },
        { period: '2024年', label: '2024年度' },
        { period: '2025年', label: '2025年度' },
        { period: '2026年', label: '2026年度' },
      ]
      const baseInitial = unitCalculations.initialCarbon * 12
      const baseOffset = unitCalculations.totalOffset * 12
      return years.map((y, idx) => {
        const factor = 1.08 - idx * 0.025
        const offFactor = 0.60 + idx * 0.08
        const init = Number((baseInitial * factor).toFixed(1))
        const off = Number((baseOffset * offFactor).toFixed(1))
        const net = Number(Math.max(0, init - off).toFixed(1))
        const elec = Math.round((activeFactory.elecKWh * 12) * factor)
        const gas = Math.round((activeFactory.gasM3 * 12) * factor)
        const steam = Math.round((activeFactory.steamT * 12) * factor)
        const solar = Number((off * 0.65).toFixed(1))
        const green = Number((off * 0.25).toFixed(1))
        const gec = Number((off * 0.10).toFixed(1))
        return {
          month: y.period,
          periodLabel: y.label,
          初始排放: init,
          碳抵消量: off,
          净碳排放: net,
          elecKWh: elec,
          gasM3: gas,
          steamT: steam,
          solarOffset: solar,
          greenElecOffset: green,
          gecOffset: gec,
        }
      })
    }
    // 月度 / 自定义默认: 12 个月
    const endYm = selectedMonth || '2026-08'
    const startYm = addMonthsToYm(endYm, -11)
    const monthsList: string[] = []
    let curr = startYm
    for (let i = 0; i < 12; i++) {
      monthsList.push(curr)
      curr = addMonthsToYm(curr, 1)
    }
    const baseInitial = unitCalculations.initialCarbon
    const baseOffset = unitCalculations.totalOffset
    return monthsList.map((m, idx) => {
      const ym = m.slice(2)
      const label = `${m.slice(0, 4)}年${m.slice(5)}月`
      const init = Number((baseInitial * (0.95 + (idx % 6) * 0.015)).toFixed(1))
      const off = Number((baseOffset * (0.90 + (idx % 6) * 0.028)).toFixed(1))
      const net = Number(Math.max(0, init - off).toFixed(1))
      const elec = Math.round(activeFactory.elecKWh * (0.95 + (idx % 6) * 0.015))
      const gas = Math.round(activeFactory.gasM3 * (0.92 + (idx % 6) * 0.02))
      const steam = Math.round(activeFactory.steamT * (0.96 + (idx % 6) * 0.01))
      const solar = Number((off * 0.65).toFixed(1))
      const green = Number((off * 0.25).toFixed(1))
      const gec = Number((off * 0.10).toFixed(1))
      return {
        month: ym,
        periodLabel: label,
        初始排放: init,
        碳抵消量: off,
        净碳排放: net,
        elecKWh: elec,
        gasM3: gas,
        steamT: steam,
        solarOffset: solar,
        greenElecOffset: green,
        gecOffset: gec,
      }
    })
  }, [unitCalculations, activeFactory, timeDim, selectedMonth])

  // 经营单位净碳排放结构饼图数据
  const unitNetCarbonDonutData = useMemo(() => {
    const remElecCarbon = Math.max(0, unitCalculations.elecGrossCarbon - unitCalculations.totalOffset)
    return [
      { name: '电力剩余净排放', value: Number(remElecCarbon.toFixed(1)), color: '#2C7CFF' },
      { name: '外购蒸汽排放', value: unitCalculations.steamGrossCarbon, color: '#a855f7' },
      { name: '燃气直接排放', value: unitCalculations.gasGrossCarbon, color: '#fa8c16' },
    ]
  }, [unitCalculations])

  // 集团总览净碳排放结构饼图数据
  const groupNetCarbonDonutData = useMemo(() => {
    return [
      { name: '外购电力净排放', value: 28520, color: '#2C7CFF' },
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
        {/* 顶部统一时间维度控制栏 (参考用能监测标准高度 p-3.5 完全统一对齐) */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-card p-3.5 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 dark:bg-primary/15 border border-blue-200 dark:border-primary/30 flex items-center justify-center text-[#2C7CFF] dark:text-primary shrink-0">
              <Activity className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800 dark:text-foreground">能源碳排放监测</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 时间维度切换 (样式100%参照用能监测，保持原筛选条件不变) */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg text-sm font-sans">
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'month'
                    ? 'font-bold bg-[#2C7CFF] dark:bg-primary text-white dark:text-primary-foreground shadow-xs'
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-panel'
                )}
              >
                月
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('quarter')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'quarter'
                    ? 'font-bold bg-[#2C7CFF] dark:bg-primary text-white dark:text-primary-foreground shadow-xs'
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-panel'
                )}
              >
                季度
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('year')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'year'
                    ? 'font-bold bg-[#2C7CFF] dark:bg-primary text-white dark:text-primary-foreground shadow-xs'
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-panel'
                )}
              >
                年
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('custom')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'custom'
                    ? 'font-bold bg-[#2C7CFF] dark:bg-primary text-white dark:text-primary-foreground shadow-xs'
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-panel'
                )}
              >
                自定义
              </button>
            </div>

            {/* 时间范围选择控件 (随维度自适应切换，样式参照用能监测) */}
            {timeDim === 'month' && (
              <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 dark:text-muted-foreground shrink-0" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-sm focus:outline-none cursor-pointer font-bold"
                  title="选择指定月份"
                />
              </div>
            )}

            {timeDim === 'quarter' && (
              <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs">
                <Calendar className="size-4 text-slate-400 dark:text-muted-foreground shrink-0" />
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="2026-Q3">2026年 第3季度 (Q3)</option>
                  <option value="2026-Q2">2026年 第2季度 (Q2)</option>
                  <option value="2026-Q1">2026年 第1季度 (Q1)</option>
                  <option value="2025-Q4">2025年 第4季度 (Q4)</option>
                </select>
              </div>
            )}

            {timeDim === 'year' && (
              <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs">
                <Calendar className="size-4 text-slate-400 dark:text-muted-foreground shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="2026">2026 年度</option>
                  <option value="2025">2025 年度</option>
                  <option value="2024">2024 年度</option>
                  <option value="2023">2023 年度</option>
                  <option value="2022">2022 年度</option>
                  <option value="2021">2021 年度</option>
                </select>
              </div>
            )}

            {timeDim === 'custom' && (
              <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 dark:text-muted-foreground shrink-0" />
                <input
                  type="month"
                  value={selectedMonthRange.start}
                  onChange={handleCustomStartMonthChange}
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-sm focus:outline-none cursor-pointer font-bold"
                  title="开始月份 (最多选12个月)"
                />
                <span className="text-slate-400 dark:text-muted-foreground font-sans">至</span>
                <input
                  type="month"
                  value={selectedMonthRange.end}
                  onChange={handleCustomEndMonthChange}
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-sm focus:outline-none cursor-pointer font-bold"
                  title="结束月份 (最多选12个月)"
                />
              </div>
            )}

            {/* 导出报表 */}
            <ExportButton onClick={() => alert(`正在导出【${selectedOrgNode.name}】能源碳排放全景监测报表 (Excel)...`)} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 场景 A：电装集团页 (Group Level) */}
        {/* ========================================================================= */}
        {isGroupLevel ? (
          <div className="space-y-3.5">
            {/* 1. 集团三大核心指标卡片 (净碳排放量、总碳排放量、碳抵消量) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* 卡片 1: 净碳排放量 */}
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-blue-200/80 dark:border-primary/30 shadow-xs space-y-2 bg-gradient-to-br from-blue-50/40 via-white to-white dark:bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_12%,var(--card)),var(--card))]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-primary flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-[#2C7CFF] dark:text-primary" />
                    集团净碳排放量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-[#2C7CFF] dark:text-primary flex items-baseline gap-1.5">
                  {groupKpiMetrics.net.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-blue-100 dark:border-border/60 flex items-center justify-start text-xs font-sans">
                  <span className="text-slate-500 dark:text-muted-foreground">同比: <strong className="font-mono text-emerald-600 dark:text-emerald-400">-4.8% ↓</strong></span>
                </div>
              </div>

              {/* 卡片 2: 集团总碳排放量 */}
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5">
                    <Zap className="size-4 text-amber-500 dark:text-amber-400" />
                    集团总碳排放量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-slate-800 dark:text-foreground flex items-baseline gap-1.5">
                  {groupKpiMetrics.initial.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-border/60 flex items-center justify-between text-xs font-sans text-slate-500 dark:text-muted-foreground">
                  <span>外购电力: <strong className="font-mono text-slate-700 dark:text-foreground">{groupKpiMetrics.gridCarbon.toLocaleString()} t</strong></span>
                </div>
              </div>

              {/* 卡片 3: 碳抵消量 (3大抵消拆解) */}
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-500/30 shadow-xs space-y-2 bg-gradient-to-br from-emerald-50/40 via-white to-white dark:bg-[linear-gradient(135deg,color-mix(in_oklch,#10b981_12%,var(--card)),var(--card))]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-1.5">
                    <Award className="size-4 text-emerald-600 dark:text-emerald-400" />
                    集团碳抵消总量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 flex items-baseline gap-1.5">
                  {groupKpiMetrics.offset.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-emerald-100 dark:border-border/60 grid grid-cols-3 gap-1 text-[11px] font-sans text-slate-600 dark:text-muted-foreground text-center">
                  <div className="bg-emerald-50/70 dark:bg-panel dark:border dark:border-border p-1 rounded">
                    <span className="text-[10px] text-slate-500 dark:text-muted-foreground block">直供绿电</span>
                    <strong className="font-mono text-emerald-700 dark:text-emerald-400">{groupKpiMetrics.solarOffset.toLocaleString()}t</strong>
                  </div>
                  <div className="bg-blue-50/70 dark:bg-panel dark:border dark:border-border p-1 rounded">
                    <span className="text-[10px] text-slate-500 dark:text-muted-foreground block">交易绿电</span>
                    <strong className="font-mono text-blue-700 dark:text-primary">{groupKpiMetrics.greenElecOffset.toLocaleString()}t</strong>
                  </div>
                  <div className="bg-purple-50/70 dark:bg-panel dark:border dark:border-border p-1 rounded">
                    <span className="text-[10px] text-slate-500 dark:text-muted-foreground block">交易绿证</span>
                    <strong className="font-mono text-purple-700 dark:text-purple-400">{groupKpiMetrics.gecOffset.toLocaleString()}t</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 净碳排放结构 (环形饼图 + 抵消路径拆解) */}
            <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                    净碳排放抵扣
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* 左侧 5/12: 净碳排放来源构成环形图 */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-2 border-r border-slate-100 dark:border-border/60 pr-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-foreground flex items-center gap-1.5 font-sans">
                    <PieIcon className="size-3.5 text-[#2C7CFF] dark:text-primary" />
                    净碳排放介质结构占比
                  </div>
                  <Donut data={groupNetCarbonDonutData} height={190} unit="tCO₂" />
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono pt-1">
                    <div className="p-1.5 rounded bg-blue-50 dark:bg-panel text-blue-900 dark:text-primary border border-blue-100 dark:border-border text-center">
                      <span className="text-[10px] text-slate-500 dark:text-muted-foreground font-sans block">外购电力</span>
                      <strong>69.1%</strong>
                    </div>
                    <div className="p-1.5 rounded bg-purple-50 dark:bg-panel text-purple-900 dark:text-purple-400 border border-purple-100 dark:border-border text-center">
                      <span className="text-[10px] text-slate-500 dark:text-muted-foreground font-sans block">外购蒸汽</span>
                      <strong>19.9%</strong>
                    </div>
                    <div className="p-1.5 rounded bg-amber-50 dark:bg-panel text-amber-900 dark:text-amber-400 border border-amber-100 dark:border-border text-center">
                      <span className="text-[10px] text-slate-500 dark:text-muted-foreground font-sans block">化石燃气</span>
                      <strong>11.0%</strong>
                    </div>
                  </div>
                </div>

                {/* 右侧 7/12: 3 大绿色抵消途径深度剖析 */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-foreground flex items-center gap-1.5 font-sans">
                    <Award className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    绿电抵消进度
                  </div>

                  <div className="space-y-2.5">
                    {/* 1. 直供绿电 */}
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-panel border border-emerald-100 dark:border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          1. 直供绿电抵消
                        </span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">8,450.2 tCO₂ (占总抵消 48.6%)</span>
                      </div>
                      <div className="w-full bg-emerald-200/60 dark:bg-emerald-950/60 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '48.6%' }} />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-muted-foreground font-mono">
                        直供绿电量: 1,481.8 万 kWh
                      </div>
                    </div>

                    {/* 2. 交易绿电 */}
                    <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-panel border border-blue-100 dark:border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-blue-900 dark:text-primary flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-[#2C7CFF] dark:text-primary" />
                          2. 交易绿电抵消
                        </span>
                        <span className="font-mono font-bold text-blue-700 dark:text-primary">5,680.0 tCO₂ (占总抵消 32.7%)</span>
                      </div>
                      <div className="w-full bg-blue-200/60 dark:bg-blue-950/60 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#2C7CFF] dark:bg-primary h-2 rounded-full" style={{ width: '32.7%' }} />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-muted-foreground font-mono">
                        交易绿电量: 996.0 万 kWh
                      </div>
                    </div>

                    {/* 3. 交易绿证 */}
                    <div className="p-2.5 rounded-lg bg-purple-50/50 dark:bg-panel border border-purple-100 dark:border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-900 dark:text-purple-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-purple-600 dark:text-purple-400" />
                          3. 交易绿证抵消
                        </span>
                        <span className="font-mono font-bold text-purple-700 dark:text-purple-400">3,239.2 tCO₂ (占总抵消 18.7%)</span>
                      </div>
                      <div className="w-full bg-purple-200/60 dark:bg-purple-950/60 rounded-full h-2 overflow-hidden">
                        <div className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full" style={{ width: '18.7%' }} />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-muted-foreground font-mono">
                        交易绿证量: 5,680 张 GEC
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 经营单位碳排放明细 (6 家直属制造单位明细表) */}
            <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 dark:border-border/60 flex items-center justify-between bg-slate-50/80 dark:bg-panel">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                    经营单位碳排放明细
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-panel border-b border-slate-200 dark:border-border text-slate-600 dark:text-muted-foreground font-semibold font-sans h-[44px]">
                      <th className="py-2.5 px-3">单位名称</th>
                      <th className="py-2.5 px-3 text-[#2C7CFF] dark:text-primary font-extrabold">净碳排放量 (tCO₂)</th>
                      <th className="py-2.5 px-3 font-semibold text-slate-600 dark:text-muted-foreground text-center">同比</th>
                      <th className="py-2.5 px-3 text-blue-800 dark:text-primary font-bold">净碳排放量占比 (%)</th>
                      <th className="py-2.5 px-3">总碳排放量 (tCO₂)</th>
                      <th className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400">直供绿电抵消 (t)</th>
                      <th className="py-2.5 px-3 text-blue-700 dark:text-primary">交易绿电抵消 (t)</th>
                      <th className="py-2.5 px-3 text-purple-700 dark:text-purple-400">交易绿证抵消 (t)</th>
                      <th className="py-2.5 px-3 text-emerald-800 dark:text-emerald-400 font-bold">总抵消量 (tCO₂)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-border/60 text-slate-700 dark:text-foreground">
                    {GROUP_6_COMPANIES_DATA.map((row) => {
                      const netRatio = ((row.netCarbon / 39303.7) * 100).toFixed(1)
                      return (
                        <tr key={row.id} className="hover:bg-blue-50/40 dark:hover:bg-primary/10 transition-colors h-[44px]">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-foreground font-sans flex items-center gap-1.5">
                            <Factory className="size-3.5 text-slate-400 dark:text-muted-foreground" />
                            {row.name}
                          </td>
                          <td className="py-2.5 px-3 text-[#2C7CFF] dark:text-primary font-extrabold text-sm">{row.netCarbon.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">{row.yoyRate}</td>
                          <td className="py-2.5 px-3 font-extrabold text-blue-700 dark:text-primary">{netRatio}%</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-foreground">{row.initialCarbon.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.solarOffset.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-blue-600 dark:text-primary font-bold">{row.greenElecOffset.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-purple-600 dark:text-purple-400 font-bold">{row.gecOffset.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-extrabold">{row.totalOffset.toLocaleString()}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. 碳排放变化趋势 (右上角图标切换走势图与明细表格) */}
            <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                    碳排放变化趋势
                  </h3>
                </div>

                {/* 图/表切换图标按钮 */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-panel p-1 rounded-lg border dark:border-border">
                  <button
                    type="button"
                    onClick={() => setTrendViewMode('chart')}
                    className={cn(
                      'px-2.5 py-1 rounded-md transition-all cursor-pointer select-none flex items-center gap-1 text-xs font-medium',
                      trendViewMode === 'chart'
                        ? 'bg-white dark:bg-primary text-[#2C7CFF] dark:text-primary-foreground font-bold shadow-xs'
                        : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                    )}
                    title="切换为趋势走势图"
                  >
                    <LineChartIcon className="size-3.5" />
                    <span>走势图</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrendViewMode('table')}
                    className={cn(
                      'px-2.5 py-1 rounded-md transition-all cursor-pointer select-none flex items-center gap-1 text-xs font-medium',
                      trendViewMode === 'table'
                        ? 'bg-white dark:bg-primary text-[#2C7CFF] dark:text-primary-foreground font-bold shadow-xs'
                        : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                    )}
                    title="切换为明细表格"
                  >
                    <TableIcon className="size-3.5" />
                    <span>明细表</span>
                  </button>
                </div>
              </div>

              {trendViewMode === 'chart' ? (
                <div className="h-[270px]">
                  <LineTrend
                    data={groupTrendData}
                    xKey="period"
                    height={270}
                    yUnit="tCO₂"
                    lines={[
                      { key: '初始碳排放', name: '总碳排放量 (tCO₂)', color: '#f59e0b' },
                      { key: '净碳排放', name: '净碳排放量 (tCO₂)', color: '#2C7CFF' },
                      { key: '碳抵消量', name: '绿电与绿证抵消总量 (tCO₂)', color: '#10b981' },
                    ]}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-panel border-b border-slate-200 dark:border-border text-slate-600 dark:text-muted-foreground font-semibold font-sans h-[44px]">
                        <th className="py-2.5 px-3">核算账期</th>
                        <th className="py-2.5 px-3">总碳排放量 (tCO₂)</th>
                        <th className="py-2.5 px-3">外购电力碳排 (t)</th>
                        <th className="py-2.5 px-3">外购蒸汽碳排 (t)</th>
                        <th className="py-2.5 px-3">燃气化石碳排 (t)</th>
                        <th className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400">直供绿电抵消 (t)</th>
                        <th className="py-2.5 px-3 text-blue-700 dark:text-primary">交易绿电抵消 (t)</th>
                        <th className="py-2.5 px-3 text-purple-700 dark:text-purple-400">交易绿证抵消 (t)</th>
                        <th className="py-2.5 px-3 text-emerald-800 dark:text-emerald-400 font-bold">总抵消量 (tCO₂)</th>
                        <th className="py-2.5 px-3 text-[#2C7CFF] dark:text-primary font-extrabold">净碳排放量 (tCO₂)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-border/60 text-slate-700 dark:text-foreground">
                      {groupTrendData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-primary/10 transition-colors h-[44px]">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-foreground font-sans">{row.periodLabel || row.period}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-foreground">{row.初始碳排放?.toLocaleString()}</td>
                          <td className="py-2.5 px-3">{row.elecCarbon?.toLocaleString() || Math.round(row.初始碳排放 * 0.82).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-purple-700 dark:text-purple-400">{row.steamCarbon?.toLocaleString() || Math.round(row.初始碳排放 * 0.12).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-amber-700 dark:text-amber-400">{row.gasCarbon?.toLocaleString() || Math.round(row.初始碳排放 * 0.06).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.solarOffset?.toLocaleString() || Math.round(row.碳抵消量 * 0.48).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-blue-600 dark:text-primary font-bold">{row.greenElecOffset?.toLocaleString() || Math.round(row.碳抵消量 * 0.33).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-purple-600 dark:text-purple-400 font-bold">{row.gecOffset?.toLocaleString() || Math.round(row.碳抵消量 * 0.19).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-extrabold">{row.碳抵消量?.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-[#2C7CFF] dark:text-primary font-extrabold text-sm">{row.净碳排放?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 场景 B：经营单位和项目公司页 (Unit / Factory Level) */
          /* ========================================================================= */
          <div className="space-y-3.5">
            {/* 1. 顶部电力核算基准因子条 (2、3级节点均展示) */}
            {!isGroupLevel && (
              <div className="p-3 bg-blue-50/80 dark:bg-panel rounded-xl border border-blue-200/90 dark:border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-blue-900 dark:text-foreground">
                  <Info className="size-4 text-[#2C7CFF] dark:text-primary shrink-0" />
                  <span>
                    <strong>电力核算基准因子核算：</strong>电力碳排放因子取自<strong>【国家温室气体排放因子数据库】</strong>（选用分省电网排放因子：
                    <span className="font-mono font-bold text-[#2C7CFF] dark:text-primary ml-1 bg-white dark:bg-card px-1.5 py-0.5 rounded border border-blue-200 dark:border-border">
                      {activeFactory.gridFactor} tCO₂/MWh
                    </span>
                    ）
                  </span>
                </div>
                <span className="text-[11px] text-blue-700 dark:text-muted-foreground font-mono">
                  自动拉取全国统一电力因子库
                </span>
              </div>
            )}

            {/* 2. 主要放 3 个核心数卡片 (净碳排放量、总碳排放量、碳抵消量) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* 卡片 1: 净碳排放量 */}
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-blue-200/80 dark:border-primary/30 shadow-xs space-y-2 bg-gradient-to-br from-blue-50/40 via-white to-white dark:bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_12%,var(--card)),var(--card))]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-primary flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-[#2C7CFF] dark:text-primary" />
                    净碳排放量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-[#2C7CFF] dark:text-primary flex items-baseline gap-1.5">
                  {unitCalculations.netCarbon.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-blue-100 dark:border-border/60 flex items-center justify-start text-xs font-sans">
                  <span className="text-slate-500 dark:text-muted-foreground">同比: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{activeFactory.yoyRate}</strong></span>
                </div>
              </div>

              {/* 卡片 2: 初始碳排放量 */}
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5">
                    <Zap className="size-4 text-amber-500 dark:text-amber-400" />
                    总碳排放量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-slate-800 dark:text-foreground flex items-baseline gap-1.5">
                  {unitCalculations.initialCarbon.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-border/60 flex items-center justify-between text-xs font-sans text-slate-500 dark:text-muted-foreground">
                  <span>外购电力: <strong className="font-mono text-slate-700 dark:text-foreground">{unitCalculations.elecGrossCarbon} t</strong></span>
                </div>
              </div>

              {/* 卡片 3: 碳抵消量 (直供绿电 + 交易绿电 + 交易绿证) */}
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-500/30 shadow-xs space-y-2 bg-gradient-to-br from-emerald-50/40 via-white to-white dark:bg-[linear-gradient(135deg,color-mix(in_oklch,#10b981_12%,var(--card)),var(--card))]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-1.5">
                    <Award className="size-4 text-emerald-600 dark:text-emerald-400" />
                    碳抵消总量
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 flex items-baseline gap-1.5">
                  {unitCalculations.totalOffset.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">tCO₂</span>
                </div>
                <div className="pt-2 border-t border-emerald-100 dark:border-border/60 grid grid-cols-3 gap-1 text-[11px] font-sans text-slate-600 dark:text-muted-foreground text-center">
                  <div className="bg-emerald-50/70 dark:bg-panel dark:border dark:border-border p-1 rounded">
                    <span className="text-[10px] text-slate-500 dark:text-muted-foreground block">直供绿电</span>
                    <strong className="font-mono text-emerald-700 dark:text-emerald-400">{unitCalculations.solarOffset}t</strong>
                  </div>
                  <div className="bg-blue-50/70 dark:bg-panel dark:border dark:border-border p-1 rounded">
                    <span className="text-[10px] text-slate-500 dark:text-muted-foreground block">交易绿电</span>
                    <strong className="font-mono text-blue-700 dark:text-primary">{unitCalculations.greenElecOffset}t</strong>
                  </div>
                  <div className="bg-purple-50/70 dark:bg-panel dark:border dark:border-border p-1 rounded">
                    <span className="text-[10px] text-slate-500 dark:text-muted-foreground block">交易绿证</span>
                    <strong className="font-mono text-purple-700 dark:text-purple-400">{unitCalculations.gecOffset}t</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 展示净碳排放的结构 (饼图与抵消拆解) */}
            <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                    净碳排放抵扣
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* 左侧 5/12: 净碳排放构成环形图 */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-2 border-r border-slate-100 dark:border-border/60 pr-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-foreground flex items-center gap-1.5 font-sans">
                    <PieIcon className="size-3.5 text-[#2C7CFF] dark:text-primary" />
                    净碳排放介质结构占比
                  </div>
                  <Donut data={unitNetCarbonDonutData} height={190} unit="tCO₂" />
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono pt-1 text-center">
                    <div className="p-1.5 rounded bg-blue-50 dark:bg-panel text-blue-900 dark:text-primary border border-blue-100 dark:border-border">
                      <span className="text-[10px] text-slate-500 dark:text-muted-foreground font-sans block">外购电力</span>
                      <strong>{((unitNetCarbonDonutData[0].value / unitCalculations.netCarbon) * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="p-1.5 rounded bg-purple-50 dark:bg-panel text-purple-900 dark:text-purple-400 border border-purple-100 dark:border-border">
                      <span className="text-[10px] text-slate-500 dark:text-muted-foreground font-sans block">外购蒸汽</span>
                      <strong>{((unitCalculations.steamGrossCarbon / unitCalculations.netCarbon) * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="p-1.5 rounded bg-amber-50 dark:bg-panel text-amber-900 dark:text-amber-400 border border-amber-100 dark:border-border">
                      <span className="text-[10px] text-slate-500 dark:text-muted-foreground font-sans block">化石燃气</span>
                      <strong>{((unitCalculations.gasGrossCarbon / unitCalculations.netCarbon) * 100).toFixed(1)}%</strong>
                    </div>
                  </div>
                </div>

                {/* 右侧 7/12: 3 大绿色抵消途径深度剖析 */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-foreground flex items-center gap-1.5 font-sans">
                    <Award className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    绿电抵消进度
                  </div>

                  <div className="space-y-2.5">
                    {/* 1. 直供绿电 */}
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-panel border border-emerald-100 dark:border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          1. 直供绿电抵消
                        </span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {unitCalculations.solarOffset.toLocaleString()} tCO₂ (占总抵消 {((unitCalculations.solarOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-emerald-200/60 dark:bg-emerald-950/60 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${((unitCalculations.solarOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-muted-foreground font-mono">
                        直供绿电量: {(activeFactory.solarSelfKWh / 10000).toFixed(1)} 万 kWh
                      </div>
                    </div>

                    {/* 2. 交易绿电 */}
                    <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-panel border border-blue-100 dark:border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-blue-900 dark:text-primary flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-[#2C7CFF] dark:text-primary" />
                          2. 交易绿电抵消
                        </span>
                        <span className="font-mono font-bold text-blue-700 dark:text-primary">
                          {unitCalculations.greenElecOffset.toLocaleString()} tCO₂ (占总抵消 {((unitCalculations.greenElecOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-blue-200/60 dark:bg-blue-950/60 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#2C7CFF] dark:bg-primary h-2 rounded-full"
                          style={{ width: `${((unitCalculations.greenElecOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-muted-foreground font-mono">
                        交易绿电量: {(activeFactory.greenElecKWh / 10000).toFixed(1)} 万 kWh
                      </div>
                    </div>

                    {/* 3. 交易绿证 */}
                    <div className="p-2.5 rounded-lg bg-purple-50/50 dark:bg-panel border border-purple-100 dark:border-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-900 dark:text-purple-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-purple-600 dark:text-purple-400" />
                          3. 交易绿证抵消
                        </span>
                        <span className="font-mono font-bold text-purple-700 dark:text-purple-400">
                          {unitCalculations.gecOffset.toLocaleString()} tCO₂ (占总抵消 {((unitCalculations.gecOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-purple-200/60 dark:bg-purple-950/60 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full"
                          style={{ width: `${((unitCalculations.gecOffset / unitCalculations.totalOffset) * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-muted-foreground font-mono">
                        交易绿证量: {activeFactory.gecCertificateCount.toLocaleString()} 张 GEC
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 碳排放变化趋势 (右上角图标切换走势图与明细表格) */}
            <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                    碳排放变化趋势
                  </h3>
                </div>

                {/* 图/表切换图标按钮 */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-panel p-1 rounded-lg border dark:border-border">
                  <button
                    type="button"
                    onClick={() => setTrendViewMode('chart')}
                    className={cn(
                      'px-2.5 py-1 rounded-md transition-all cursor-pointer select-none flex items-center gap-1 text-xs font-medium',
                      trendViewMode === 'chart'
                        ? 'bg-white dark:bg-primary text-[#2C7CFF] dark:text-primary-foreground font-bold shadow-xs'
                        : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                    )}
                    title="切换为趋势走势图"
                  >
                    <LineChartIcon className="size-3.5" />
                    <span>走势图</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrendViewMode('table')}
                    className={cn(
                      'px-2.5 py-1 rounded-md transition-all cursor-pointer select-none flex items-center gap-1 text-xs font-medium',
                      trendViewMode === 'table'
                        ? 'bg-white dark:bg-primary text-[#2C7CFF] dark:text-primary-foreground font-bold shadow-xs'
                        : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                    )}
                    title="切换为明细表格"
                  >
                    <TableIcon className="size-3.5" />
                    <span>明细表</span>
                  </button>
                </div>
              </div>

              {trendViewMode === 'chart' ? (
                <div className="h-[270px]">
                  <LineTrend
                    data={unitTrendData}
                    xKey="month"
                    height={270}
                    yUnit="tCO₂"
                    lines={[
                      { key: '初始排放', name: '总碳排放量 (tCO₂)', color: '#f59e0b' },
                      { key: '净碳排放', name: '净碳排放量 (tCO₂)', color: '#2C7CFF' },
                      { key: '碳抵消量', name: '绿电绿证抵消 (tCO₂)', color: '#10b981' },
                    ]}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-panel border-b border-slate-200 dark:border-border text-slate-600 dark:text-muted-foreground font-semibold font-sans h-[44px]">
                        <th className="py-2.5 px-3">核算账期</th>
                        <th className="py-2.5 px-3">工业用电 (kWh)</th>
                        <th className="py-2.5 px-3">天然气 (m³)</th>
                        <th className="py-2.5 px-3">外购蒸汽 (t)</th>
                        <th className="py-2.5 px-3">总碳排放量 (tCO₂)</th>
                        <th className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400">直供绿电抵消 (t)</th>
                        <th className="py-2.5 px-3 text-blue-700 dark:text-primary">交易绿电抵消 (t)</th>
                        <th className="py-2.5 px-3 text-purple-700 dark:text-purple-400">绿证核销抵消 (t)</th>
                        <th className="py-2.5 px-3 text-emerald-800 dark:text-emerald-400 font-bold">总抵消量 (tCO₂)</th>
                        <th className="py-2.5 px-3 text-[#2C7CFF] dark:text-primary font-extrabold">净碳排放量 (tCO₂)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-border/60 text-slate-700 dark:text-foreground">
                      {unitTrendData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-primary/10 transition-colors h-[44px]">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-foreground font-sans">{row.periodLabel || row.month}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-foreground">{row.elecKWh.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-amber-700 dark:text-amber-400">{row.gasM3.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-purple-700 dark:text-purple-400">{row.steamT.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-foreground">{row.初始排放.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.solarOffset.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-blue-600 dark:text-primary font-bold">{row.greenElecOffset.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-purple-600 dark:text-purple-400 font-bold">{row.gecOffset.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-extrabold">{row.碳抵消量.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-[#2C7CFF] dark:text-primary font-extrabold text-sm">{row.净碳排放.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

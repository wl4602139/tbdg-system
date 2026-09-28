'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Activity,
  Zap,
  Flame,
  Droplets,
  Wind,
  Fuel,
  Snowflake,
  Download,
  Calendar,
  Building2,
  Trees,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  BarChart3,
  LineChart as LineChartIcon,
  Table as TableIcon,
  PieChart as PieIcon,
  Sun,
  Layers,
  Sparkles,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend, BarChartGroup, Donut } from '@/components/shared/charts'
import { OnlineHeader, type TimeDimension } from '@/components/shared/online-header'
import { ExportButton } from '@/components/shared/primitives'
import { cn } from '@/lib/utils'

// 园区与工厂能耗基准数据字典
interface ParkOrFactoryUsageData {
  id: string
  name: string
  orgType: 'park' | 'factory' | 'group'
  location: string
  // 8 大能源介质月均基准 (月数据)
  totalElecKWhMonth: number // 总用电量 (kWh/月) = gridElecKWhMonth + solarElecKWhMonth
  gridElecKWhMonth: number // 市电量 (kWh/月)
  solarElecKWhMonth: number // 直供绿电量 (kWh/月)
  waterM3Month: number // 用水量 (m³/月)
  gasM3Month: number // 天然气量 (m³/月)
  steamTMonth: number // 外购蒸汽量 (t/月)
  oilLiterMonth: number // 油消耗量 (L/月)
  liquidNitrogenTMonth: number // 液氮消耗量 (t/月)
  yoyRate: string
}

const USAGE_PRESETS: Record<string, ParkOrFactoryUsageData> = {
  ent_root: {
    id: 'ent_root',
    name: '电装集团 (全集团15园区与6大制造基地)',
    orgType: 'group',
    location: '全国 17 大制造基地与零碳园区',
    totalElecKWhMonth: 48500000,
    gridElecKWhMonth: 33682000,
    solarElecKWhMonth: 14818000,
    waterM3Month: 285400,
    gasM3Month: 1680000,
    steamTMonth: 22400,
    oilLiterMonth: 42500,
    liquidNitrogenTMonth: 143,
    yoyRate: '-3.8% ↓',
  },
  ws_sb_main: {
    id: 'ws_sb_main',
    name: '沈变公司 / 沈变本部 (超高压基地)',
    orgType: 'factory',
    location: '辽宁省沈阳市铁西经济开发区',
    totalElecKWhMonth: 8450000,
    gridElecKWhMonth: 5200000,
    solarElecKWhMonth: 3250000,
    waterM3Month: 48200,
    gasM3Month: 320000,
    steamTMonth: 4200,
    oilLiterMonth: 6800,
    liquidNitrogenTMonth: 0,
    yoyRate: '-4.2% ↓',
  },
  ws_sb_luna: {
    id: 'ws_sb_luna',
    name: '露娜公司 (特变电工露娜智能电气)',
    orgType: 'factory',
    location: '天津市武清区京津科技谷',
    totalElecKWhMonth: 5200000,
    gridElecKWhMonth: 3220000,
    solarElecKWhMonth: 1980000,
    waterM3Month: 29500,
    gasM3Month: 180000,
    steamTMonth: 1850,
    oilLiterMonth: 3900,
    liquidNitrogenTMonth: 0,
    yoyRate: '-4.8% ↓',
  },
  ws_hb_main: {
    id: 'ws_hb_main',
    name: '衡变公司 / 衡变本部 (南方特高压基地)',
    orgType: 'factory',
    location: '湖南省衡阳市雁峰区',
    totalElecKWhMonth: 7800000,
    gridElecKWhMonth: 4910000,
    solarElecKWhMonth: 2890000,
    waterM3Month: 42600,
    gasM3Month: 290000,
    steamTMonth: 3900,
    oilLiterMonth: 5800,
    liquidNitrogenTMonth: 0,
    yoyRate: '-3.6% ↓',
  },
  ws_xb_uhv: {
    id: 'ws_xb_uhv',
    name: '新变厂 (新疆特高压制造部)',
    orgType: 'factory',
    location: '新疆乌鲁木齐市高新区',
    totalElecKWhMonth: 9200000,
    gridElecKWhMonth: 5100000,
    solarElecKWhMonth: 4100000,
    waterM3Month: 56000,
    gasM3Month: 350000,
    steamTMonth: 4600,
    oilLiterMonth: 7500,
    liquidNitrogenTMonth: 0,
    yoyRate: '-4.5% ↓',
  },
  ws_ll_main: {
    id: 'ws_ll_main',
    name: '鲁缆公司 (山东特变线缆基地)',
    orgType: 'factory',
    location: '山东省新泰市特变电工工业园',
    totalElecKWhMonth: 6800000,
    gridElecKWhMonth: 4700000,
    solarElecKWhMonth: 2100000,
    waterM3Month: 38400,
    gasM3Month: 210000,
    steamTMonth: 2800,
    oilLiterMonth: 5200,
    liquidNitrogenTMonth: 55,
    yoyRate: '-3.2% ↓',
  },
  ws_xl_main: {
    id: 'ws_xl_main',
    name: '新缆厂 (新疆电缆智造基地)',
    orgType: 'factory',
    location: '新疆昌吉市特变电工工业园',
    totalElecKWhMonth: 4900000,
    gridElecKWhMonth: 3100000,
    solarElecKWhMonth: 1800000,
    waterM3Month: 26800,
    gasM3Month: 150000,
    steamTMonth: 1900,
    oilLiterMonth: 3600,
    liquidNitrogenTMonth: 48,
    yoyRate: '-3.9% ↓',
  },
  ws_dl_main: {
    id: 'ws_dl_main',
    name: '德缆公司 (德阳连铸连轧线缆基地)',
    orgType: 'factory',
    location: '四川省德阳市旌阳区',
    totalElecKWhMonth: 4300000,
    gridElecKWhMonth: 2800000,
    solarElecKWhMonth: 1500000,
    waterM3Month: 24500,
    gasM3Month: 120000,
    steamTMonth: 1500,
    oilLiterMonth: 3200,
    liquidNitrogenTMonth: 40,
    yoyRate: '-5.1% ↓',
  },
  park_01: {
    id: 'park_01',
    name: '特变电工东北输变电产业园',
    orgType: 'park',
    location: '辽宁省沈阳市铁西区',
    totalElecKWhMonth: 10200000,
    gridElecKWhMonth: 6400000,
    solarElecKWhMonth: 3800000,
    waterM3Month: 58000,
    gasM3Month: 380000,
    steamTMonth: 5100,
    oilLiterMonth: 8200,
    liquidNitrogenTMonth: 0,
    yoyRate: '-4.6% ↓',
  },
  park_02: {
    id: 'park_02',
    name: '特变电工南方输变电产业园',
    orgType: 'park',
    location: '湖南省衡阳市雁峰区',
    totalElecKWhMonth: 8900000,
    gridElecKWhMonth: 5600000,
    solarElecKWhMonth: 3300000,
    waterM3Month: 49000,
    gasM3Month: 320000,
    steamTMonth: 4400,
    oilLiterMonth: 6900,
    liquidNitrogenTMonth: 0,
    yoyRate: '-3.9% ↓',
  },
}

export default function UsageMonitoringPage() {
  // 左侧组织拓扑树 (支持企业组织/零碳园区)
  const [selectedOrgNode, setSelectedOrgNode] = useState<StandardOrgNode>({
    id: 'ent_root',
    name: '电装集团',
    fullName: '电装集团 (全集团15园区与6大制造基地)',
    level: 'group',
    badge: '全集团',
  })

  // 拓扑树视角切换：'enterprise' (企业与工厂) | 'park' (零碳园区)
  const [treeType, setTreeType] = useState<'enterprise' | 'park'>('enterprise')

  // 时间维度：'day' (日) | 'month' (月) | 'quarter' (季度) | 'year' (年) | 'custom' (跨月自定义)
  const [timeDim, setTimeDim] = useState<TimeDimension>('month')
  const [selectedDate, setSelectedDate] = useState('2026-08-28')
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [startMonth, setStartMonth] = useState('2026-01')
  const [endMonth, setEndMonth] = useState('2026-08')

  // 视图切换：'chart' (走势图) | 'table' (数据表)
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart')

  // 当前选中展示的指标介质
  // 'all_elec' (总用电量) | 'grid_elec' (市电量) | 'solar_elec' (直供绿电量) | 'water' (水) | 'gas' (气) | 'steam' (蒸汽) | 'oil' (油) | 'nitrogen' (液氮)
  const [selectedMediumView, setSelectedMediumView] = useState<
    'all_elec' | 'grid_elec' | 'solar_elec' | 'water' | 'gas' | 'steam' | 'oil' | 'nitrogen'
  >('all_elec')

  // 当前节点数据对象
  const activeData = useMemo(() => {
    if (USAGE_PRESETS[selectedOrgNode.id]) {
      return USAGE_PRESETS[selectedOrgNode.id]
    }
    // 模糊匹配
    const foundKey = Object.keys(USAGE_PRESETS).find(
      (k) =>
        selectedOrgNode.name.includes(USAGE_PRESETS[k].name.slice(0, 2)) ||
        selectedOrgNode.id.includes(k.replace('ws_', '').replace('comp_', '').replace('park_', ''))
    )
    return foundKey ? USAGE_PRESETS[foundKey] : USAGE_PRESETS.ws_sb_main
  }, [selectedOrgNode])

  // 判定当前选定组织是否有液氮（仅线缆产业鲁缆、新缆、德缆，以及全集团汇总有液氮）
  const hasLiquidNitrogen = useMemo(() => {
    const name = selectedOrgNode?.name || ''
    const id = selectedOrgNode?.id || ''
    if (id === 'ent_root' || id === 'all' || !id || name.includes('电装集团')) return true
    if (name.includes('线缆') || name.includes('鲁缆') || name.includes('新缆') || name.includes('德缆') || name.includes('电缆')) return true
    if (id.includes('ll') || id.includes('xl') || id.includes('dl')) return true
    return (activeData?.liquidNitrogenTMonth ?? 0) > 0
  }, [selectedOrgNode, activeData])

  const isCableUnit = hasLiquidNitrogen

  // 若切换至无液氮企业且当前正选液氮，自动回退至总用电量
  useEffect(() => {
    if (!hasLiquidNitrogen && selectedMediumView === 'nitrogen') {
      setSelectedMediumView('all_elec')
    }
  }, [hasLiquidNitrogen, selectedMediumView])

  // 处理树节点切换
  const handleSelectNode = (node: StandardOrgNode) => {
    setSelectedOrgNode(node)
  }

  // =========================================================================
  // 1. 生成多维度时序数据
  // 物理模型恒等式严格保证：总用电量 = 市电量 + 直供绿电量
  // =========================================================================
  const timeSeriesData = useMemo(() => {
    const records: Array<{
      date: string
      label: string
      总用电量: number // 万kWh
      市电量: number // 万kWh
      直供绿电量: number // 万kWh
      绿电占比: number // %
      用水量: number | null // m3
      天然气量: number | null // m3
      外购蒸汽量: number | null // t
      油消耗量: number | null // L
      液氮消耗量: number | null // t
    }> = []

    const baseMonthGrid = activeData.gridElecKWhMonth / 10000 // 万kWh/月
    const baseMonthSolar = activeData.solarElecKWhMonth / 10000 // 万kWh/月
    const baseMonthWater = activeData.waterM3Month
    const baseMonthGas = activeData.gasM3Month
    const baseMonthSteam = activeData.steamTMonth
    const baseMonthOil = activeData.oilLiterMonth
    const baseMonthNitrogen = hasLiquidNitrogen ? activeData.liquidNitrogenTMonth : 0

    const baseDayGrid = baseMonthGrid / 30
    const baseDaySolar = baseMonthSolar / 30
    const baseDayWater = baseMonthWater / 30
    const baseDayGas = baseMonthGas / 30
    const baseDaySteam = baseMonthSteam / 30
    const baseDayOil = baseMonthOil / 30
    const baseDayNitrogen = baseMonthNitrogen / 30

    if (timeDim === 'day') {
      // 🌟 日维度：24 小时逐时分布 (00:00 ~ 23:00)
      // 非电 5 大指标不支持物联逐时采集，数值为 null / "-"
      const hourlyLoadFactors = [
        0.58, 0.55, 0.54, 0.56, 0.60, 0.68,
        0.85, 1.15, 1.38, 1.52, 1.55, 1.48,
        1.18, 1.42, 1.50, 1.46, 1.38, 1.25,
        1.10, 1.02, 0.92, 0.82, 0.68, 0.62
      ]
      const hourlySolarFactors = [
        0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
        0.00, 0.25, 0.65, 1.15, 1.55, 1.75,
        1.80, 1.65, 1.40, 0.95, 0.50, 0.15,
        0.00, 0.00, 0.00, 0.00, 0.00, 0.00
      ]

      const avgLoadFactor = hourlyLoadFactors.reduce((a, b) => a + b, 0) / 24
      const avgSolarFactor = (hourlySolarFactors.reduce((a, b) => a + b, 0) / 24) || 1

      for (let h = 0; h < 24; h++) {
        const hourStr = `${String(h).padStart(2, '0')}:00`
        const normLoad = hourlyLoadFactors[h] / avgLoadFactor
        const normSolar = hourlySolarFactors[h] / avgSolarFactor

        const solElec_h = Number(((baseDaySolar / 24) * normSolar).toFixed(2))
        const grdElec_h = Number(((baseDayGrid / 24) * normLoad).toFixed(2))
        // 恒等式：总用电量 = 市电量 + 直供绿电量
        const totElec_h = Number((grdElec_h + solElec_h).toFixed(2))
        const greenRatio = totElec_h > 0 ? Number(((solElec_h / totElec_h) * 100).toFixed(1)) : 0

        records.push({
          date: `${selectedDate} ${hourStr}`,
          label: hourStr,
          总用电量: totElec_h,
          市电量: grdElec_h,
          直供绿电量: solElec_h,
          绿电占比: greenRatio,
          用水量: null,
          天然气量: null,
          外购蒸汽量: null,
          油消耗量: null,
          液氮消耗量: null,
        })
      }
    } else if (timeDim === 'month') {
      // 🌟 月维度：所选月份每日 (01日 ~ 28/30/31日)
      const [y, m] = selectedMonth.split('-').map(Number)
      const maxDays = m === 8 && y === 2026 ? 28 : new Date(y, m, 0).getDate()

      for (let d = 1; d <= maxDays; d++) {
        const dStr = String(d).padStart(2, '0')
        const isWeekend = (d + m) % 7 === 0 || (d + m) % 7 === 6
        const dailyFluct = isWeekend ? 0.75 : 0.95 + ((d * 3 + m * 7) % 15) * 0.015
        const solarFluct = isWeekend ? 0.90 : 0.90 + ((d * 5 + m * 3) % 20) * 0.02

        const solElec = Number((baseDaySolar * solarFluct).toFixed(2))
        const grdElec = Number((baseDayGrid * dailyFluct).toFixed(2))
        const totElec = Number((grdElec + solElec).toFixed(2))
        const greenRatio = totElec > 0 ? Number(((solElec / totElec) * 100).toFixed(1)) : 0

        records.push({
          date: `${selectedMonth}-${dStr}`,
          label: `${dStr}日`,
          总用电量: totElec,
          市电量: grdElec,
          直供绿电量: solElec,
          绿电占比: greenRatio,
          用水量: null, // 🌟 水/气/汽/油/液氮均为按月填报指标，月维度(单日明细)无逐日抄表数据
          天然气量: null,
          外购蒸汽量: null,
          油消耗量: null,
          液氮消耗量: null,
        })
      }
    } else if (timeDim === 'quarter') {
      // 🌟 季度维度：当季 3 个月度逐月展示
      const [qYear, qPart] = selectedQuarter.split('-')
      const qNum = parseInt(qPart.replace('Q', ''), 10)
      const months = [(qNum - 1) * 3 + 1, (qNum - 1) * 3 + 2, (qNum - 1) * 3 + 3]

      months.forEach((m) => {
        const mStr = `${qYear}-${String(m).padStart(2, '0')}`
        const factor = 0.96 + (m % 3) * 0.04
        const solElec = Number((baseMonthSolar * factor).toFixed(2))
        const grdElec = Number((baseMonthGrid * factor).toFixed(2))
        const totElec = Number((grdElec + solElec).toFixed(2))
        const greenRatio = Number(((solElec / totElec) * 100).toFixed(1))

        records.push({
          date: mStr,
          label: `${m}月`,
          总用电量: totElec,
          市电量: grdElec,
          直供绿电量: solElec,
          绿电占比: greenRatio,
          用水量: Math.round(baseMonthWater * factor),
          天然气量: Math.round(baseMonthGas * factor),
          外购蒸汽量: Number((baseMonthSteam * factor).toFixed(1)),
          油消耗量: Math.round(baseMonthOil * factor),
          液氮消耗量: hasLiquidNitrogen ? Number((baseMonthNitrogen * factor).toFixed(2)) : null,
        })
      })
    } else if (timeDim === 'year') {
      // 🌟 年度维度：12 个月度逐月展示
      for (let m = 1; m <= 12; m++) {
        const mStr = `${selectedYear}-${String(m).padStart(2, '0')}`
        const seasonFactor = m >= 6 && m <= 8 ? 1.15 : m >= 11 || m <= 2 ? 1.08 : 0.92
        const solElec = Number((baseMonthSolar * (m >= 5 && m <= 9 ? 1.25 : 0.8)).toFixed(2))
        const grdElec = Number((baseMonthGrid * seasonFactor).toFixed(2))
        const totElec = Number((grdElec + solElec).toFixed(2))
        const greenRatio = Number(((solElec / totElec) * 100).toFixed(1))

        records.push({
          date: mStr,
          label: `${m}月`,
          总用电量: totElec,
          市电量: grdElec,
          直供绿电量: solElec,
          绿电占比: greenRatio,
          用水量: Math.round(baseMonthWater * seasonFactor),
          天然气量: Math.round(baseMonthGas * (m >= 11 || m <= 3 ? 1.4 : 0.8)),
          外购蒸汽量: Number((baseMonthSteam * seasonFactor).toFixed(1)),
          油消耗量: Math.round(baseMonthOil * seasonFactor),
          液氮消耗量: hasLiquidNitrogen ? Number((baseMonthNitrogen * seasonFactor).toFixed(2)) : null,
        })
      }
    } else {
      // 🌟 跨月自定义维度：起止月份区间逐月展示
      const [startYear, startM] = startMonth.split('-').map(Number)
      const [endYear, endM] = endMonth.split('-').map(Number)
      const cur = new Date(startYear, startM - 1, 1)
      const end = new Date(endYear, endM - 1, 1)

      while (cur <= end) {
        const y = cur.getFullYear()
        const m = cur.getMonth() + 1
        const mStr = `${y}-${String(m).padStart(2, '0')}`
        const factor = 0.94 + (m % 5) * 0.03
        const solElec = Number((baseMonthSolar * factor).toFixed(2))
        const grdElec = Number((baseMonthGrid * factor).toFixed(2))
        const totElec = Number((grdElec + solElec).toFixed(2))
        const greenRatio = Number(((solElec / totElec) * 100).toFixed(1))

        records.push({
          date: mStr,
          label: `${y}.${String(m).padStart(2, '0')}`,
          总用电量: totElec,
          市电量: grdElec,
          直供绿电量: solElec,
          绿电占比: greenRatio,
          用水量: Math.round(baseMonthWater * factor),
          天然气量: Math.round(baseMonthGas * factor),
          外购蒸汽量: Number((baseMonthSteam * factor).toFixed(1)),
          油消耗量: Math.round(baseMonthOil * factor),
          液氮消耗量: hasLiquidNitrogen ? Number((baseMonthNitrogen * factor).toFixed(2)) : null,
        })

        cur.setMonth(cur.getMonth() + 1)
      }
    }

    return records
  }, [timeDim, selectedDate, selectedMonth, selectedQuarter, selectedYear, startMonth, endMonth, activeData, hasLiquidNitrogen])

  // =========================================================================
  // 2. 统计当前时间维度下的卡片累计值与消纳率
  // 严格保证：总用电量 = 市电量 + 直供绿电量
  // 日维度下非电 5 大指标严格展示 "-"
  // =========================================================================
  const cardAggregates = useMemo(() => {
    let totElec = 0
    let grdElec = 0
    let solElec = 0
    let wat = 0
    let gs = 0
    let stm = 0
    let ol = 0
    let nit = 0

    timeSeriesData.forEach((row) => {
      totElec += row.总用电量
      grdElec += row.市电量
      solElec += row.直供绿电量
      if (row.用水量 !== null) wat += row.用水量
      if (row.天然气量 !== null) gs += row.天然气量
      if (row.外购蒸汽量 !== null) stm += row.外购蒸汽量
      if (row.油消耗量 !== null) ol += row.油消耗量
      if (row.液氮消耗量 !== null) nit += row.液氮消耗量
    })

    // 格式化输出
    const totalElecFormatted = Number(totElec.toFixed(1))
    const gridElecFormatted = Number(grdElec.toFixed(1))
    // 保证浮点相加恒等式严格闭合
    const solarElecFormatted = Number((totalElecFormatted - gridElecFormatted).toFixed(1))
    const greenRatio = totalElecFormatted > 0 ? Number(((solarElecFormatted / totalElecFormatted) * 100).toFixed(1)) : 0

    return {
      totalElec: totalElecFormatted.toLocaleString(),
      gridElec: gridElecFormatted.toLocaleString(),
      solarElec: solarElecFormatted.toLocaleString(),
      greenElecRatio: greenRatio,
      // 非电指标在日维度时输出 "-"，按月填报指标在月维度下按月度填报值输出，在多月(季/年/自定义)维度下累加时序数据
      water: timeDim === 'day' ? '-' : (timeDim === 'month' ? Math.round(activeData.waterM3Month).toLocaleString() : Math.round(wat).toLocaleString()),
      gas: timeDim === 'day' ? '-' : (timeDim === 'month' ? Math.round(activeData.gasM3Month).toLocaleString() : Math.round(gs).toLocaleString()),
      steam: timeDim === 'day' ? '-' : (timeDim === 'month' ? Number(activeData.steamTMonth.toFixed(1)).toLocaleString() : Number(stm.toFixed(1)).toLocaleString()),
      oil: timeDim === 'day' ? '-' : (timeDim === 'month' ? Math.round(activeData.oilLiterMonth).toLocaleString() : Math.round(ol).toLocaleString()),
      nitrogen: timeDim === 'day' ? '-' : (!hasLiquidNitrogen ? '-' : (timeDim === 'month' ? Number(activeData.liquidNitrogenTMonth.toFixed(2)).toLocaleString() : Number(nit.toFixed(2)).toLocaleString())),
    }
  }, [timeSeriesData, timeDim, activeData, hasLiquidNitrogen])

  // =========================================================================
  // 3. 市电峰平谷用电分析 (只保留市电；日维度仅展示环形图)
  // 比例：尖峰 16.4%, 高峰 41.1%, 平段 28.9%, 低谷 13.6%
  // =========================================================================
  const touCalculations = useMemo(() => {
    // 纯粹依据市电量计算
    let gridElecTotal = 0
    timeSeriesData.forEach((r) => {
      gridElecTotal += r.市电量
    })
    const baseElec = Number(gridElecTotal.toFixed(1))

    const totalTip = Number((baseElec * 0.164).toFixed(2))
    const totalPeak = Number((baseElec * 0.411).toFixed(2))
    const totalFlat = Number((baseElec * 0.289).toFixed(2))
    const totalValley = Number((baseElec * 0.136).toFixed(2))

    const donutData = [
      { name: '尖峰电量', value: totalTip, color: '#FF6536', ratio: '16.4%' },
      { name: '高峰电量', value: totalPeak, color: '#FFBA00', ratio: '41.1%' },
      { name: '平段电量', value: totalFlat, color: '#2C7CFF', ratio: '28.9%' },
      { name: '低谷电量', value: totalValley, color: '#10C4CE', ratio: '13.6%' },
    ]

    // 非日维度时的右侧分解连续堆叠柱状图
    const decomposedData = timeSeriesData.map((row) => {
      const val = row.市电量
      return {
        day: row.label,
        fullDate: row.date,
        尖峰: Number((val * 0.164).toFixed(2)),
        峰段: Number((val * 0.411).toFixed(2)),
        平段: Number((val * 0.289).toFixed(2)),
        谷段: Number((val * 0.136).toFixed(2)),
        日市电量: val,
      }
    })

    return {
      baseElec,
      totalTip,
      totalPeak,
      totalFlat,
      totalValley,
      donutData,
      decomposedData,
    }
  }, [timeSeriesData])

  // 当前选中指标名称与单位元信息
  const metricMeta = useMemo(() => {
    switch (selectedMediumView) {
      case 'all_elec':
        return { name: '总用电量', unit: '万kWh', isElec: true }
      case 'grid_elec':
        return { name: '市电量', unit: '万kWh', isElec: true }
      case 'solar_elec':
        return { name: '直供绿电量', unit: '万kWh', isElec: true }
      case 'water':
        return { name: '水资源消耗量', unit: 'm³', isElec: false }
      case 'gas':
        return { name: '天然气量', unit: 'm³', isElec: false }
      case 'steam':
        return { name: '外购蒸汽量', unit: 't', isElec: false }
      case 'oil':
        return { name: '油消耗量', unit: 'L', isElec: false }
      case 'nitrogen':
        return { name: '液氮消耗量', unit: 't', isElec: false }
    }
  }, [selectedMediumView])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 组织拓扑树 (支持企业制造工厂 / 零碳园区，纯粹无冗余自述标题) */}
      <StandardOrgTree
        treeType={treeType}
        showTreeTypeSwitch={true}
        onTreeTypeChange={setTreeType}
        selectedId={selectedOrgNode.id}
        onSelect={handleSelectNode}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* 1. 顶部 Header (用能监测 · 日/月/季/年/跨月自定义 + 导出) */}
        <OnlineHeader
          title="用能监测"
          timeDim={timeDim}
          onTimeDimChange={(dim) => setTimeDim(dim)}
          allowedDimensions={['day', 'month', 'quarter', 'year', 'custom']}
          selectedDate={selectedDate}
          onDateChange={(d) => setSelectedDate(d)}
          selectedMonth={selectedMonth}
          onMonthChange={(m) => setSelectedMonth(m)}
          selectedQuarter={selectedQuarter}
          onQuarterChange={(q) => setSelectedQuarter(q)}
          selectedYear={selectedYear}
          onYearChange={(y) => setSelectedYear(y)}
          startMonth={startMonth}
          endMonth={endMonth}
          onMonthRangeChange={(start, end) => {
            setStartMonth(start)
            setEndMonth(end)
          }}
          onExport={() => alert(`正在导出【${activeData.name}】用能监测数据报表 (Excel)...`)}
        />

        {/* 2. 卡片区域 (严格两排排布) */}
        <div className="space-y-4">
          {/* 第一排：三个电量的一个整体控件 (总用电量、市电量、直供绿电量) */}
          <div className="bg-white dark:bg-card p-4 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-border/60 pb-2">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                电力数据
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. 总用电量 */}
              <div
                onClick={() => setSelectedMediumView('all_elec')}
                className={cn(
                  'p-3.5 rounded-lg border transition-all cursor-pointer select-none space-y-1.5',
                  selectedMediumView === 'all_elec'
                    ? 'bg-blue-50/80 dark:bg-[#2C7CFF]/15 border-[#2C7CFF] ring-2 ring-[#2C7CFF]/20 dark:ring-[#2C7CFF]/40 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-card border-slate-200/80 dark:border-border hover:bg-blue-50/30 dark:hover:bg-[#2C7CFF]/10 hover:border-[#2C7CFF]/40'
                )}
              >
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Zap className="size-4 text-[#2C7CFF] dark:text-primary" />
                    总用电量
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-muted-foreground">物联采集</span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#2C7CFF] dark:text-primary truncate">
                  {cardAggregates.totalElec} <span className="text-xs font-normal text-slate-400 dark:text-muted-foreground font-sans">万kWh</span>
                </div>
              </div>

              {/* 2. 市电量 */}
              <div
                onClick={() => setSelectedMediumView('grid_elec')}
                className={cn(
                  'p-3.5 rounded-lg border transition-all cursor-pointer select-none space-y-1.5',
                  selectedMediumView === 'grid_elec'
                    ? 'bg-sky-50/80 dark:bg-[#41C0FF]/15 border-[#41C0FF] ring-2 ring-[#41C0FF]/20 dark:ring-[#41C0FF]/40 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-card border-slate-200/80 dark:border-border hover:bg-sky-50/30 dark:hover:bg-[#41C0FF]/10 hover:border-[#41C0FF]/40'
                )}
              >
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-4 text-[#41C0FF]" />
                    市电量
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-muted-foreground">电网购电</span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#41C0FF] truncate">
                  {cardAggregates.gridElec} <span className="text-xs font-normal text-slate-400 dark:text-muted-foreground font-sans">万kWh</span>
                </div>
              </div>

              {/* 3. 直供绿电量 */}
              <div
                onClick={() => setSelectedMediumView('solar_elec')}
                className={cn(
                  'p-3.5 rounded-lg border transition-all cursor-pointer select-none space-y-1.5',
                  selectedMediumView === 'solar_elec'
                    ? 'bg-emerald-50/80 dark:bg-[#00D492]/15 border-[#00D492] ring-2 ring-[#00D492]/20 dark:ring-[#00D492]/40 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-card border-slate-200/80 dark:border-border hover:bg-emerald-50/30 dark:hover:bg-[#00D492]/10 hover:border-[#00D492]/40'
                )}
              >
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Sun className="size-4 text-[#00D492]" />
                    直供绿电量
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">分布式光伏自发自用</span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#00D492] truncate">
                  {cardAggregates.solarElec} <span className="text-xs font-normal text-slate-400 dark:text-muted-foreground font-sans">万kWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* 第二排：剩下的几个指标，不管几个值，放在一排 (水、气、蒸汽、油、液氮) */}
          <div
            className={cn(
              'grid gap-4',
              hasLiquidNitrogen
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
            )}
          >
            {/* 水资源消耗量 */}
            <div
              onClick={() => setSelectedMediumView('water')}
              className={cn(
                'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none',
                selectedMediumView === 'water'
                  ? 'bg-cyan-50/80 dark:bg-[#10C4CE]/15 border-[#10C4CE] ring-2 ring-[#10C4CE]/20 dark:ring-[#10C4CE]/40 shadow-sm'
                  : 'bg-white dark:bg-card border-[#DBE6EE] dark:border-border hover:border-[#10C4CE]/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-1.5">
                  <Droplets className="size-4 text-[#10C4CE]" />
                  水资源消耗量
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#10C4CE] truncate">
                {cardAggregates.water}{' '}
                {cardAggregates.water !== '-' && <span className="text-xs font-normal text-slate-400 dark:text-muted-foreground font-sans">m³</span>}
              </div>
            </div>

            {/* 天然气量 */}
            <div
              onClick={() => setSelectedMediumView('gas')}
              className={cn(
                'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none',
                selectedMediumView === 'gas'
                  ? 'bg-orange-50/80 dark:bg-[#FF6536]/15 border-[#FF6536] ring-2 ring-[#FF6536]/20 dark:ring-[#FF6536]/40 shadow-sm'
                  : 'bg-white dark:bg-card border-[#DBE6EE] dark:border-border hover:border-[#FF6536]/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-1.5">
                  <Flame className="size-4 text-[#FF6536]" />
                  天然气量
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#FF6536] truncate">
                {cardAggregates.gas}{' '}
                {cardAggregates.gas !== '-' && <span className="text-xs font-normal text-slate-400 dark:text-muted-foreground font-sans">m³</span>}
              </div>
            </div>

            {/* 外购蒸汽量 */}
            <div
              onClick={() => setSelectedMediumView('steam')}
              className={cn(
                'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none',
                selectedMediumView === 'steam'
                  ? 'bg-amber-50/80 dark:bg-[#FFBA00]/15 border-[#FFBA00] ring-2 ring-[#FFBA00]/20 dark:ring-[#FFBA00]/40 shadow-sm'
                  : 'bg-white dark:bg-card border-[#DBE6EE] dark:border-border hover:border-[#FFBA00]/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-1.5">
                  <Wind className="size-4 text-[#FFBA00]" />
                  外购蒸汽量
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#FFBA00] truncate">
                {cardAggregates.steam}{' '}
                {cardAggregates.steam !== '-' && <span className="text-xs font-normal text-slate-400 dark:text-muted-foreground font-sans">t</span>}
              </div>
            </div>

            {/* 油消耗量 */}
            <div
              onClick={() => setSelectedMediumView('oil')}
              className={cn(
                'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none',
                selectedMediumView === 'oil'
                  ? 'bg-purple-50/80 dark:bg-[#8E73ED]/15 border-[#8E73ED] ring-2 ring-[#8E73ED]/20 dark:ring-[#8E73ED]/40 shadow-sm'
                  : 'bg-white dark:bg-card border-[#DBE6EE] dark:border-border hover:border-[#8E73ED]/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-1.5">
                  <Fuel className="size-4 text-[#8E73ED]" />
                  油消耗量
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#8E73ED] truncate">
                {cardAggregates.oil}{' '}
                {cardAggregates.oil !== '-' && <span className="text-xs font-normal text-slate-400 dark:text-muted-foreground font-sans">L</span>}
              </div>
            </div>

            {/* 液氮消耗量 (仅限线缆企业展示) */}
            {hasLiquidNitrogen && (
              <div
                onClick={() => setSelectedMediumView('nitrogen')}
                className={cn(
                  'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none',
                  selectedMediumView === 'nitrogen'
                    ? 'bg-indigo-50/80 dark:bg-[#4F39F6]/15 border-[#4F39F6] ring-2 ring-[#4F39F6]/20 dark:ring-[#4F39F6]/40 shadow-sm'
                    : 'bg-white dark:bg-card border-[#DBE6EE] dark:border-border hover:border-[#4F39F6]/40'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-1.5">
                    <Snowflake className="size-4 text-[#4F39F6]" />
                    液氮消耗量
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#4F39F6] truncate">
                  {cardAggregates.nitrogen}{' '}
                  {cardAggregates.nitrogen !== '-' && <span className="text-xs font-normal text-slate-400 dark:text-muted-foreground font-sans">t</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🌟 3. 能耗数据图表与表格双视图 (原明细台账已融合，右上角支持图/表切换) */}
        <div className="bg-white dark:bg-card p-6 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                能耗数据
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* 图/表切换图标按钮 */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-panel p-1 rounded-lg border border-transparent dark:border-border">
                <button
                  type="button"
                  onClick={() => setViewMode('chart')}
                  className={cn(
                    'px-2.5 py-1 rounded-md transition-all cursor-pointer select-none flex items-center gap-1 text-xs font-medium',
                    viewMode === 'chart'
                      ? 'bg-white text-[#2C7CFF] dark:bg-primary dark:text-primary-foreground font-bold shadow-xs'
                      : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                  )}
                  title="切换为趋势折线图"
                >
                  <LineChartIcon className="size-3.5" />
                  <span>走势图</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'px-2.5 py-1 rounded-md transition-all cursor-pointer select-none flex items-center gap-1 text-xs font-medium',
                    viewMode === 'table'
                      ? 'bg-white text-[#2C7CFF] dark:bg-primary dark:text-primary-foreground font-bold shadow-xs'
                      : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                  )}
                  title="切换为高密数据表格"
                >
                  <TableIcon className="size-3.5" />
                  <span>数据表</span>
                </button>
              </div>

              {/* 导出按钮 (80px × 36px) */}
              <ExportButton
                label="导出"
                onClick={() =>
                  alert(`正在导出【${activeData.name}】${metricMeta.name}数据报表 (Excel)...`)
                }
              />
            </div>
          </div>

          {/* 视图 A: 走势图 */}
          {viewMode === 'chart' && (
            <div className="h-[290px]">
              {(timeDim === 'day' && !metricMeta.isElec) || (timeDim === 'month' && !metricMeta.isElec) ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-slate-200 dark:border-border rounded-lg bg-slate-50/50 dark:bg-panel">
                  <Info className="size-6 text-slate-300 dark:text-muted-foreground" />
                  <p className="text-sm font-medium text-slate-600 dark:text-foreground">
                    {timeDim === 'month'
                      ? `【${metricMeta.name}】为月度填报指标，无单日逐日抄表数据`
                      : `【${metricMeta.name}】为月度台账统计指标，无物联单日逐时采集数据`}
                  </p>
                  <p className="text-xs text-slate-400">
                    请在顶部时间控件中选择【季度】、【年】或【自定义】查看多月时序统计数据
                  </p>
                </div>
              ) : (
                <>
                  {selectedMediumView === 'all_elec' && (
                    <LineTrend
                      data={timeSeriesData}
                      xKey="label"
                      height={290}
                      yUnit={timeDim === 'day' ? '万kWh/h' : '万kWh'}
                      lines={[
                        { key: '总用电量', name: `总用电量 (${timeDim === 'day' ? '万kWh/h' : '万kWh'})`, color: '#2C7CFF' },
                        { key: '市电量', name: `市电量 (${timeDim === 'day' ? '万kWh/h' : '万kWh'})`, color: '#41C0FF' },
                        { key: '直供绿电量', name: `直供绿电量 (${timeDim === 'day' ? '万kWh/h' : '万kWh'})`, color: '#00D492' },
                      ]}
                    />
                  )}
                  {selectedMediumView === 'grid_elec' && (
                    <LineTrend
                      data={timeSeriesData}
                      xKey="label"
                      height={290}
                      yUnit={timeDim === 'day' ? '万kWh/h' : '万kWh'}
                      lines={[
                        { key: '市电量', name: `市电量 (${timeDim === 'day' ? '万kWh/h' : '万kWh'})`, color: '#41C0FF' },
                        { key: '总用电量', name: `总用电量参考 (${timeDim === 'day' ? '万kWh/h' : '万kWh'})`, color: '#94a3b8' },
                      ]}
                    />
                  )}
                  {selectedMediumView === 'solar_elec' && (
                    <LineTrend
                      data={timeSeriesData}
                      xKey="label"
                      height={290}
                      yUnit={timeDim === 'day' ? '万kWh/h' : '万kWh'}
                      lines={[
                        { key: '直供绿电量', name: `直供绿电量 (${timeDim === 'day' ? '万kWh/h' : '万kWh'})`, color: '#00D492' },
                        { key: '总用电量', name: `总用电量参考 (${timeDim === 'day' ? '万kWh/h' : '万kWh'})`, color: '#94a3b8' },
                      ]}
                    />
                  )}
                  {selectedMediumView === 'water' && (
                    <LineTrend
                      data={timeSeriesData}
                      xKey="label"
                      height={290}
                      yUnit="m³"
                      lines={[
                        { key: '用水量', name: '水资源消耗量 (m³)', color: '#10C4CE' },
                      ]}
                    />
                  )}
                  {selectedMediumView === 'gas' && (
                    <LineTrend
                      data={timeSeriesData}
                      xKey="label"
                      height={290}
                      yUnit="m³"
                      lines={[
                        { key: '天然气量', name: '天然气消耗量 (m³)', color: '#FF6536' },
                      ]}
                    />
                  )}
                  {selectedMediumView === 'steam' && (
                    <LineTrend
                      data={timeSeriesData}
                      xKey="label"
                      height={290}
                      yUnit="t"
                      lines={[
                        { key: '外购蒸汽量', name: '外购蒸汽量 (t)', color: '#FFBA00' },
                      ]}
                    />
                  )}
                  {selectedMediumView === 'oil' && (
                    <LineTrend
                      data={timeSeriesData}
                      xKey="label"
                      height={290}
                      yUnit="L"
                      lines={[
                        { key: '油消耗量', name: '油消耗量 (L)', color: '#8E73ED' },
                      ]}
                    />
                  )}
                  {selectedMediumView === 'nitrogen' && hasLiquidNitrogen && (
                    <LineTrend
                      data={timeSeriesData}
                      xKey="label"
                      height={290}
                      yUnit="t"
                      lines={[
                        { key: '液氮消耗量', name: '液氮消耗量 (t)', color: '#4F39F6' },
                      ]}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* 视图 B: 数据表 (44px 工业高密表格) */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto max-h-[360px] custom-scrollbar border border-slate-200 dark:border-border rounded-lg">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="sticky top-0 bg-slate-100 dark:bg-panel z-10">
                  <tr className="border-b border-slate-200 dark:border-border text-slate-700 dark:text-foreground font-semibold font-sans h-[44px]">
                    <th className="py-2.5 px-3">
                      {timeDim === 'day' ? '时段 (24h)' : timeDim === 'month' ? '日期' : timeDim === 'quarter' ? '季度月份' : '统计账期'}
                    </th>
                    {selectedMediumView === 'all_elec' && (
                      <>
                        <th className="py-2.5 px-3 text-[#2C7CFF] dark:text-primary font-bold">总用电量 (万kWh)</th>
                        <th className="py-2.5 px-3 text-[#41C0FF]">市电量 (万kWh)</th>
                        <th className="py-2.5 px-3 text-[#00D492] font-bold">直供绿电量 (万kWh)</th>
                        <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">绿电占比 (%)</th>
                      </>
                    )}
                    {selectedMediumView === 'grid_elec' && (
                      <>
                        <th className="py-2.5 px-3 text-[#41C0FF] font-bold">市电量 (万kWh)</th>
                        <th className="py-2.5 px-3 text-slate-500 dark:text-muted-foreground">总用电量参考 (万kWh)</th>
                      </>
                    )}
                    {selectedMediumView === 'solar_elec' && (
                      <>
                        <th className="py-2.5 px-3 text-[#00D492] font-bold">直供绿电量 (万kWh)</th>
                        <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">消纳占比 (%)</th>
                      </>
                    )}
                    {selectedMediumView === 'water' && (
                      <th className="py-2.5 px-3 text-[#10C4CE] font-bold">水资源消耗量 (m³)</th>
                    )}
                    {selectedMediumView === 'gas' && (
                      <th className="py-2.5 px-3 text-[#FF6536] font-bold">天然气量 (m³)</th>
                    )}
                    {selectedMediumView === 'steam' && (
                      <th className="py-2.5 px-3 text-[#FFBA00] font-bold">外购蒸汽量 (t)</th>
                    )}
                    {selectedMediumView === 'oil' && (
                      <th className="py-2.5 px-3 text-[#8E73ED] font-bold">油消耗量 (L)</th>
                    )}
                    {selectedMediumView === 'nitrogen' && (
                      <th className="py-2.5 px-3 text-[#4F39F6] font-bold">液氮消耗量 (t)</th>
                    )}
                    <th className="py-2.5 px-3 text-slate-600 dark:text-muted-foreground">同比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-border text-slate-700 dark:text-foreground">
                  {timeSeriesData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-primary/10 transition-colors h-[44px]">
                      <td className="py-2 px-3 font-semibold text-slate-900 dark:text-foreground font-sans">
                        {timeDim === 'day' ? row.label : row.date}
                      </td>
                      {selectedMediumView === 'all_elec' && (
                        <>
                          <td className="py-2 px-3 font-bold text-[#2C7CFF]">{row.总用电量.toFixed(2)}</td>
                          <td className="py-2 px-3 text-slate-700">{row.市电量.toFixed(2)}</td>
                          <td className="py-2 px-3 font-bold text-[#00D492]">{row.直供绿电量.toFixed(2)}</td>
                          <td className="py-2 px-3 text-emerald-600">{row.绿电占比}%</td>
                        </>
                      )}
                      {selectedMediumView === 'grid_elec' && (
                        <>
                          <td className="py-2 px-3 font-bold text-[#41C0FF]">{row.市电量.toFixed(2)}</td>
                          <td className="py-2 px-3 text-slate-500">{row.总用电量.toFixed(2)}</td>
                        </>
                      )}
                      {selectedMediumView === 'solar_elec' && (
                        <>
                          <td className="py-2 px-3 font-bold text-[#00D492]">{row.直供绿电量.toFixed(2)}</td>
                          <td className="py-2 px-3 text-emerald-600">{row.绿电占比}%</td>
                        </>
                      )}
                      {selectedMediumView === 'water' && (
                        <td className="py-2 px-3 text-[#10C4CE]">
                          {row.用水量 !== null ? row.用水量.toLocaleString() : '-'}
                        </td>
                      )}
                      {selectedMediumView === 'gas' && (
                        <td className="py-2 px-3 text-[#FF6536]">
                          {row.天然气量 !== null ? row.天然气量.toLocaleString() : '-'}
                        </td>
                      )}
                      {selectedMediumView === 'steam' && (
                        <td className="py-2 px-3 text-[#FFBA00]">
                          {row.外购蒸汽量 !== null ? row.外购蒸汽量.toFixed(1) : '-'}
                        </td>
                      )}
                      {selectedMediumView === 'oil' && (
                        <td className="py-2 px-3 text-[#8E73ED]">
                          {row.油消耗量 !== null ? row.油消耗量.toFixed(1) : '-'}
                        </td>
                      )}
                      {selectedMediumView === 'nitrogen' && (
                        <td className="py-2 px-3 text-[#4F39F6]">
                          {row.液氮消耗量 !== null ? row.液氮消耗量.toFixed(2) : '-'}
                        </td>
                      )}
                      <td className="py-2 px-3 text-slate-500 font-sans">
                        {(timeDim === 'day' || timeDim === 'month') && !metricMeta.isElec ? '-' : `${(idx % 3 === 0 ? '-' : '+')}${(2.4 + (idx % 3) * 0.5).toFixed(1)}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 🌟 4. 市电峰平谷用电分析 (只保留市电；日维度仅展示环形图与四段分时卡片) */}
        {['all_elec', 'grid_elec', 'solar_elec'].includes(selectedMediumView) && (
          <div className="bg-white dark:bg-card p-6 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                  市电峰平谷用电分析
                </h3>
              </div>
            </div>

            {/* 日维度：仅展示环形图与 4 段分时卡片 */}
            {timeDim === 'day' ? (
              <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
                <div className="flex flex-col items-center justify-center">
                  <Donut data={touCalculations.donutData} height={190} unit="万kWh" />
                  <span className="text-xs font-medium text-slate-500 dark:text-muted-foreground mt-2 font-mono">
                    单日市电总量: {touCalculations.baseElec} 万kWh
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 min-w-[320px] max-w-[420px] text-sm font-mono">
                  <div className="p-3 rounded-lg bg-orange-50/80 dark:bg-[#FF6536]/15 border border-[#FF6536]/20 dark:border-[#FF6536]/40 text-orange-900 dark:text-foreground">
                    <div className="flex justify-between items-center text-xs text-[#FF6536] font-medium">
                      <span>尖峰</span>
                      <strong className="font-mono">16.4%</strong>
                    </div>
                    <div className="text-lg font-bold font-mono text-[#FF6536] mt-1">
                      {touCalculations.totalTip} 万kWh
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-[#FFBA00]/15 border border-[#FFBA00]/20 dark:border-[#FFBA00]/40 text-amber-900 dark:text-foreground">
                    <div className="flex justify-between items-center text-xs text-[#FFBA00] font-medium">
                      <span>高峰</span>
                      <strong className="font-mono">41.1%</strong>
                    </div>
                    <div className="text-lg font-bold font-mono text-[#FFBA00] mt-1">
                      {touCalculations.totalPeak} 万kWh
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50/80 dark:bg-[#2C7CFF]/15 border border-[#2C7CFF]/20 dark:border-[#2C7CFF]/40 text-blue-900 dark:text-foreground">
                    <div className="flex justify-between items-center text-xs text-[#2C7CFF] dark:text-primary font-medium">
                      <span>平段</span>
                      <strong className="font-mono">28.9%</strong>
                    </div>
                    <div className="text-lg font-bold font-mono text-[#2C7CFF] dark:text-primary mt-1">
                      {touCalculations.totalFlat} 万kWh
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-50/80 dark:bg-[#10C4CE]/15 border border-[#10C4CE]/20 dark:border-[#10C4CE]/40 text-cyan-900 dark:text-foreground">
                    <div className="flex justify-between items-center text-xs text-[#10C4CE] font-medium">
                      <span>低谷</span>
                      <strong className="font-mono">13.6%</strong>
                    </div>
                    <div className="text-lg font-bold font-mono text-[#10C4CE] mt-1">
                      {touCalculations.totalValley} 万kWh
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 非日维度：左侧环形图 + 右侧连续堆叠柱状图 */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* 左侧 4/12: 总体峰平谷分布 */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-3 border-r border-slate-100 dark:border-border/60 pr-4">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 dark:text-foreground">
                    <span className="flex items-center gap-1.5">
                      <PieIcon className="size-4 text-[#2C7CFF] dark:text-primary" />
                      峰平谷用电构成
                    </span>
                  </div>

                  <Donut data={touCalculations.donutData} height={165} unit="万kWh" />

                  <div className="grid grid-cols-2 gap-2 text-sm font-mono pt-1">
                    <div className="p-2 rounded-lg bg-orange-50/80 dark:bg-[#FF6536]/15 border border-[#FF6536]/20 dark:border-[#FF6536]/40 text-orange-900 dark:text-foreground">
                      <div className="flex justify-between items-center text-xs text-[#FF6536] font-medium">
                        <span>尖峰</span>
                        <strong className="font-mono">16.4%</strong>
                      </div>
                      <div className="text-base font-bold font-mono text-[#FF6536] mt-0.5">
                        {touCalculations.totalTip} 万kWh
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-amber-50/80 dark:bg-[#FFBA00]/15 border border-[#FFBA00]/20 dark:border-[#FFBA00]/40 text-amber-900 dark:text-foreground">
                      <div className="flex justify-between items-center text-xs text-[#FFBA00] font-medium">
                        <span>高峰</span>
                        <strong className="font-mono">41.1%</strong>
                      </div>
                      <div className="text-base font-bold font-mono text-[#FFBA00] mt-0.5">
                        {touCalculations.totalPeak} 万kWh
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-blue-50/80 dark:bg-[#2C7CFF]/15 border border-[#2C7CFF]/20 dark:border-[#2C7CFF]/40 text-blue-900 dark:text-foreground">
                      <div className="flex justify-between items-center text-xs text-[#2C7CFF] dark:text-primary font-medium">
                        <span>平段</span>
                        <strong className="font-mono">28.9%</strong>
                      </div>
                      <div className="text-base font-bold font-mono text-[#2C7CFF] dark:text-primary mt-0.5">
                        {touCalculations.totalFlat} 万kWh
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-cyan-50/80 dark:bg-[#10C4CE]/15 border border-[#10C4CE]/20 dark:border-[#10C4CE]/40 text-cyan-900 dark:text-foreground">
                      <div className="flex justify-between items-center text-xs text-[#10C4CE] font-medium">
                        <span>低谷</span>
                        <strong className="font-mono">13.6%</strong>
                      </div>
                      <div className="text-base font-bold font-mono text-[#10C4CE] mt-0.5">
                        {touCalculations.totalValley} 万kWh
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧 8/12: 分时堆叠柱状图 */}
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5">
                      <BarChart3 className="size-4 text-[#2C7CFF] dark:text-primary" />
                      峰平谷用电分析
                    </span>
                  </div>

                  <div className="h-[235px]">
                    <BarChartGroup
                      data={touCalculations.decomposedData}
                      xKey="day"
                      height={235}
                      yUnit="万kWh"
                      stacked={true}
                      bars={[
                        { key: '谷段', name: '低谷电量', color: '#10C4CE' },
                        { key: '平段', name: '平段电量', color: '#2C7CFF' },
                        { key: '峰段', name: '高峰电量', color: '#FFBA00' },
                        { key: '尖峰', name: '尖峰电量', color: '#FF6536' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

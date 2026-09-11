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
  PieChart as PieIcon,
  Sun,
  Layers,
  Sparkles,
  Sliders,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend, BarChartGroup, Donut } from '@/components/shared/charts'
import { OnlineHeader } from '@/components/shared/online-header'
import { ExportButton } from '@/components/shared/primitives'
import { cn } from '@/lib/utils'

// 园区与工厂能耗基准数据字典
interface ParkOrFactoryUsageData {
  id: string
  name: string
  orgType: 'park' | 'factory' | 'group'
  location: string
  // 8 大能源介质月均基准 (月数据，按日更新)
  totalElecKWhMonth: number // 总用电量 (kWh/月)
  gridElecKWhMonth: number // 市网供电量 (kWh/月)
  solarElecKWhMonth: number // 直供绿电量 (光伏自发自用, kWh/月)
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
    liquidNitrogenTMonth: 380,
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
    liquidNitrogenTMonth: 65,
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
    liquidNitrogenTMonth: 42,
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
    liquidNitrogenTMonth: 58,
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
    liquidNitrogenTMonth: 72,
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
    name: '沈变超高压变压器零碳园区',
    orgType: 'park',
    location: '辽宁省沈阳市铁西区',
    totalElecKWhMonth: 10200000,
    gridElecKWhMonth: 6400000,
    solarElecKWhMonth: 3800000,
    waterM3Month: 58000,
    gasM3Month: 380000,
    steamTMonth: 5100,
    oilLiterMonth: 8200,
    liquidNitrogenTMonth: 78,
    yoyRate: '-4.6% ↓',
  },
  park_02: {
    id: 'park_02',
    name: '衡变特高压智造产业园',
    orgType: 'park',
    location: '湖南省衡阳市雁峰区',
    totalElecKWhMonth: 8900000,
    gridElecKWhMonth: 5600000,
    solarElecKWhMonth: 3300000,
    waterM3Month: 49000,
    gasM3Month: 320000,
    steamTMonth: 4400,
    oilLiterMonth: 6900,
    liquidNitrogenTMonth: 64,
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

  // 时间维度：'day' (日范围，最多30天，15分钟固定频率) | 'month' (指定月份)
  const [timeDim, setTimeDim] = useState<'day' | 'month'>('day')
  const [dateRange, setDateRange] = useState({ start: '2026-08-01', end: '2026-08-28' })
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [startMonth, setStartMonth] = useState('2026-01')
  const [endMonth, setEndMonth] = useState('2026-08')

  // 峰平谷查看对象切换：'total' (总用电量 峰平谷) | 'grid' (市电量 峰平谷)
  const [touTarget, setTouTarget] = useState<'total' | 'grid'>('total')

  // 峰平谷分解查看的具体月份
  const [touDecomposeMonth, setTouDecomposeMonth] = useState('2026-08')

  // 当前选中展示的曲线介质类型 (支持点击上方 8 大 KPI 卡片直接驱动下方图表联动)
  // 'all_elec' (总用电) | 'grid_elec' (市电) | 'solar_elec' (绿电) | 'water' (水) | 'gas' (气) | 'steam' (蒸汽) | 'oil' (油) | 'nitrogen' (液氮) | 'tce' (综合能耗)
  const [selectedMediumView, setSelectedMediumView] = useState<
    'all_elec' | 'grid_elec' | 'solar_elec' | 'water' | 'gas' | 'steam' | 'oil' | 'nitrogen' | 'tce'
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
        selectedOrgNode.id.includes(k.replace('ws_', '').replace('comp_', ''))
    )
    return foundKey ? USAGE_PRESETS[foundKey] : USAGE_PRESETS.ws_sb_main
  }, [selectedOrgNode])

  // 🌟 判定当前选定组织是否属于线缆产业 (鲁缆、新缆、德缆) 或全集团汇总
  const isCableUnit = useMemo(() => {
    const name = selectedOrgNode?.name || ''
    const id = selectedOrgNode?.id || ''
    if (id === 'ent_root' || id === 'all' || !id || name.includes('电装集团')) return true
    if (name.includes('线缆') || name.includes('鲁缆') || name.includes('新缆') || name.includes('德缆')) return true
    if (id.includes('ll') || id.includes('xl') || id.includes('dl')) return true
    return false
  }, [selectedOrgNode])

  // 若切换至非线缆企业且当前正选液氮，自动回退至总用电量
  useEffect(() => {
    if (!isCableUnit && selectedMediumView === 'nitrogen') {
      setSelectedMediumView('all_elec')
    }
  }, [isCableUnit, selectedMediumView])

  // 处理树节点切换
  const handleSelectNode = (node: StandardOrgNode) => {
    setSelectedOrgNode(node)
  }

  // =========================================================================
  // 1. 生成查询日期序列 (日维度：日期范围最多30天，15分钟固定频率；月维度：指定单月)
  // =========================================================================
  const queryDaysList = useMemo(() => {
    if (timeDim === 'day') {
      const dates: string[] = []
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      const cur = new Date(start)

      while (cur <= end) {
        const y = cur.getFullYear()
        const m = String(cur.getMonth() + 1).padStart(2, '0')
        const d = String(cur.getDate()).padStart(2, '0')
        dates.push(`${y}-${m}-${d}`)
        cur.setDate(cur.getDate() + 1)
      }
      return dates.length > 0 ? dates : ['2026-08-28']
    } else {
      // 月维度：生成该月份全部日期
      const [y, m] = selectedMonth.split('-').map(Number)
      const maxDays = m === 8 && y === 2026 ? 28 : new Date(y, m, 0).getDate()
      const dates: string[] = []
      for (let d = 1; d <= maxDays; d++) {
        const dStr = String(d).padStart(2, '0')
        dates.push(`${selectedMonth}-${dStr}`)
      }
      return dates
    }
  }, [timeDim, dateRange, selectedMonth])

  // 当前涉及的月份列表 (用于月度汇总或峰平谷分解)
  const monthList = useMemo(() => {
    if (timeDim === 'day') {
      const startM = dateRange.start.slice(0, 7)
      const endM = dateRange.end.slice(0, 7)
      if (startM === endM) return [startM]
      return [startM, endM]
    }
    return [selectedMonth]
  }, [timeDim, dateRange, selectedMonth])

  // =========================================================================
  // 2. 按日连续更新的曲线走势与 15 分钟高频采样数据
  // =========================================================================
  const dailyTimeSeriesData = useMemo(() => {
    const records: Array<{
      date: string
      dayLabel: string
      总用电量: number // 万kWh
      市电量: number
      直供绿电量: number
      用水量: number // m3
      天然气量: number // m3
      外购蒸汽量: number // t
      油消耗量: number // L
      液氮消耗量: number // t
      综合能耗: number // tce
    }> = []

    const baseDayElec = (activeData.totalElecKWhMonth / 30) / 10000
    const baseDayGrid = (activeData.gridElecKWhMonth / 30) / 10000
    const baseDaySolar = (activeData.solarElecKWhMonth / 30) / 10000
    const baseDayWater = activeData.waterM3Month / 30
    const baseDayGas = activeData.gasM3Month / 30
    const baseDaySteam = activeData.steamTMonth / 30
    const baseDayOil = activeData.oilLiterMonth / 30
    const baseDayNitrogen = activeData.liquidNitrogenTMonth / 30

    if (timeDim === 'month') {
      // 月维度：生成跨月区间各月份数据 (1月份 ~ 8月份)
      const startM = parseInt(startMonth.split('-')[1]) || 1
      const endM = parseInt(endMonth.split('-')[1]) || 8
      const baseMonthElec = activeData.totalElecKWhMonth / 10000
      const baseMonthGrid = activeData.gridElecKWhMonth / 10000
      const baseMonthSolar = activeData.solarElecKWhMonth / 10000
      const baseMonthWater = activeData.waterM3Month
      const baseMonthGas = activeData.gasM3Month
      const baseMonthSteam = activeData.steamTMonth
      const baseMonthOil = activeData.oilLiterMonth
      const baseMonthNitrogen = activeData.liquidNitrogenTMonth

      for (let m = startM; m <= endM; m++) {
        const factor = 0.94 + ((m * 7) % 13) * 0.012
        const solarFactor = 0.85 + ((m * 9) % 20) * 0.02
        const totElec = Number((baseMonthElec * factor).toFixed(1))
        const solElec = Number((baseMonthSolar * solarFactor).toFixed(1))
        const grdElec = Number(Math.max(0, totElec - solElec).toFixed(1))
        const wat = Math.round(baseMonthWater * factor)
        const gs = Math.round(baseMonthGas * (0.92 + (m % 4) * 0.04))
        const stm = Number((baseMonthSteam * (0.9 + (m % 5) * 0.04)).toFixed(1))
        const ol = Math.round(baseMonthOil * (0.88 + (m % 3) * 0.06))
        const nit = Number((baseMonthNitrogen * (0.9 + (m % 4) * 0.05)).toFixed(1))
        const tce = Number((totElec * 10000 * 0.0001229 + gs * 0.0012143 + stm * 0.1286 + (ol * 0.85 * 0.0014571)).toFixed(1))

        records.push({
          date: `2026-${String(m).padStart(2, '0')}`,
          dayLabel: `${m}月份`,
          总用电量: totElec,
          市电量: grdElec,
          直供绿电量: solElec,
          用水量: wat,
          天然气量: gs,
          外购蒸汽量: stm,
          油消耗量: ol,
          液氮消耗量: nit,
          综合能耗: tce,
        })
      }
    } else {
      queryDaysList.forEach((dateStr) => {
        const parts = dateStr.split('-').map(Number)
        const m = parts[1]
        const d = parts[2]
        const isWeekend = (d + m) % 7 === 0 || (d + m) % 7 === 6
        const dailyFluct = isWeekend ? 0.72 : 0.95 + ((d * 3 + m * 7) % 15) * 0.015
        const solarFluct = isWeekend ? 0.90 : 0.90 + ((d * 5 + m * 3) % 20) * 0.02

        const totElec = Number((baseDayElec * dailyFluct).toFixed(2))
        const solElec = Number((baseDaySolar * solarFluct).toFixed(2))
        const grdElec = Number(Math.max(0, totElec - solElec).toFixed(2))
        const wat = Number((baseDayWater * dailyFluct).toFixed(1))
        const gs = Number((baseDayGas * (0.92 + (d % 5) * 0.03)).toFixed(1))
        const stm = Number((baseDaySteam * (0.90 + (d % 6) * 0.03)).toFixed(1))
        const ol = Number((baseDayOil * (0.88 + (d % 4) * 0.05)).toFixed(1))
        const nit = Number((baseDayNitrogen * (0.92 + (d % 3) * 0.05)).toFixed(2))

        const tce = Number(
          (
            totElec * 10000 * 0.0001229 +
            gs * 0.0012143 +
            stm * 0.1286 +
            (ol * 0.85 * 0.0014571)
          ).toFixed(1)
        )

        const dayLabel = `${m}月${String(d).padStart(2, '0')}日`

        records.push({
          date: dateStr,
          dayLabel,
          总用电量: totElec,
          市电量: grdElec,
          直供绿电量: solElec,
          用水量: wat,
          天然气量: gs,
          外购蒸汽量: stm,
          油消耗量: ol,
          液氮消耗量: nit,
          综合能耗: tce,
        })
      })
    }

    return records
  }, [queryDaysList, activeData, timeDim, startMonth, endMonth])

  // 8 大介质累计核算汇总 (所选日范围或指定月份总值)
  const aggregatedMetrics = useMemo(() => {
    let totElec = 0
    let grdElec = 0
    let solElec = 0
    let wat = 0
    let gs = 0
    let stm = 0
    let ol = 0
    let nit = 0
    let tce = 0

    dailyTimeSeriesData.forEach((row) => {
      totElec += row.总用电量 * 10000
      grdElec += row.市电量 * 10000
      solElec += row.直供绿电量 * 10000
      wat += row.用水量
      gs += row.天然气量
      stm += row.外购蒸汽量
      ol += row.油消耗量
      nit += row.液氮消耗量
      tce += row.综合能耗
    })

    const greenRatio = Number(((solElec / (totElec || 1)) * 100).toFixed(1))

    return {
      totalElec: Math.round(totElec),
      gridElec: Math.round(grdElec),
      solarElec: Math.round(solElec),
      greenElecRatio: greenRatio,
      water: Math.round(wat),
      gas: Math.round(gs),
      steam: Number(stm.toFixed(1)),
      oil: Math.round(ol),
      nitrogen: Number(nit.toFixed(2)),
      totalTce: Number(tce.toFixed(1)),
    }
  }, [dailyTimeSeriesData])

  // =========================================================================
  // 3. 用电峰平谷监测数据模型 (总用电量 / 市电量，月度总体 + 分解到日)
  // =========================================================================
  const touCalculations = useMemo(() => {
    // 基准电量：根据选中的目标（总用电量 或 市电量）
    const baseMonthElec =
      touTarget === 'total'
        ? activeData.totalElecKWhMonth / 10000 // 万kWh
        : activeData.gridElecKWhMonth / 10000

    // 月度总体峰平谷比例：尖 16.4%, 峰 41.1%, 平 28.9%, 谷 13.6%
    const monthTip = Number((baseMonthElec * 0.164).toFixed(1))
    const monthPeak = Number((baseMonthElec * 0.411).toFixed(1))
    const monthFlat = Number((baseMonthElec * 0.289).toFixed(1))
    const monthValley = Number((baseMonthElec * 0.136).toFixed(1))

    const monthDonutData = [
      { name: '尖峰电量', value: monthTip, color: '#FF6536', ratio: '16.4%' },
      { name: '高峰电量', value: monthPeak, color: '#FFBA00', ratio: '41.1%' },
      { name: '平段电量', value: monthFlat, color: '#2C7CFF', ratio: '28.9%' },
      { name: '低谷电量', value: monthValley, color: '#10C4CE', ratio: '13.6%' },
    ]

    // 分解到日数据 (针对 touDecomposeMonth 生成每日 尖/峰/平/谷 堆叠数据)
    const [y, m] = touDecomposeMonth.split('-').map(Number)
    const maxDays = m === 8 && y === 2026 ? 28 : new Date(y, m, 0).getDate()
    const baseDay = baseMonthElec / 30

    const dailyDecomposedData = []
    for (let d = 1; d <= maxDays; d++) {
      const isWeekend = (d + m) % 7 === 0 || (d + m) % 7 === 6
      const factor = isWeekend ? 0.72 : 0.95 + ((d * 3 + m * 5) % 12) * 0.015

      const dayTip = Number((baseDay * 0.164 * factor).toFixed(2))
      const dayPeak = Number((baseDay * 0.411 * factor).toFixed(2))
      const dayFlat = Number((baseDay * 0.289 * factor).toFixed(2))
      const dayValley = Number((baseDay * 0.136 * (isWeekend ? 1.3 : 1.0) * factor).toFixed(2))
      const dayTotal = Number((dayTip + dayPeak + dayFlat + dayValley).toFixed(2))

      dailyDecomposedData.push({
        day: `${d < 10 ? '0' + d : d}日`,
        fullDate: `${touDecomposeMonth}-${d < 10 ? '0' + d : d}`,
        尖峰: dayTip,
        峰段: dayPeak,
        平段: dayFlat,
        谷段: dayValley,
        日总电量: dayTotal,
      })
    }

    return {
      baseMonthElec,
      monthTip,
      monthPeak,
      monthFlat,
      monthValley,
      monthDonutData,
      dailyDecomposedData,
    }
  }, [touTarget, activeData, touDecomposeMonth])

  // 🌟 非电能源介质工序消耗结构与负荷数据模型
  const nonElectricStructures = useMemo(() => {
    const map: Record<string, {
      name: string
      unit: string
      donutData: Array<{ name: string; value: number; color: string; ratio: string }>
      trendData: Array<{ time: string; 实际负荷: number; 额定基准: number }>
    }> = {
      water: {
        name: '水资源消耗',
        unit: 'm³',
        donutData: [
          { name: '循环冷却水', value: Math.round(aggregatedMetrics.water * 0.625), color: '#06b6d4', ratio: '62.5%' },
          { name: '纯水制备工序', value: Math.round(aggregatedMetrics.water * 0.182), color: '#3b82f6', ratio: '18.2%' },
          { name: '清洗与生活', value: Math.round(aggregatedMetrics.water * 0.121), color: '#10b981', ratio: '12.1%' },
          { name: '消防与绿化', value: Math.round(aggregatedMetrics.water * 0.072), color: '#6366f1', ratio: '7.2%' },
        ],
        trendData: [
          { time: '00:00', 实际负荷: 8.5, 额定基准: 10.0 },
          { time: '04:00', 实际负荷: 6.2, 额定基准: 10.0 },
          { time: '08:00', 实际负荷: 22.4, 额定基准: 20.0 },
          { time: '12:00', 实际负荷: 26.8, 额定基准: 20.0 },
          { time: '16:00', 实际负荷: 24.5, 额定基准: 20.0 },
          { time: '20:00', 实际负荷: 14.2, 额定基准: 12.0 },
        ],
      },
      gas: {
        name: '天然气量',
        unit: 'm³',
        donutData: [
          { name: '硅钢退火炉', value: Math.round(aggregatedMetrics.gas * 0.520), color: '#fa8c16', ratio: '52.0%' },
          { name: '绝缘干燥烘房', value: Math.round(aggregatedMetrics.gas * 0.265), color: '#f5222d', ratio: '26.5%' },
          { name: '采暖与生活锅炉', value: Math.round(aggregatedMetrics.gas * 0.142), color: '#1677ff', ratio: '14.2%' },
          { name: '辅助公用系统', value: Math.round(aggregatedMetrics.gas * 0.073), color: '#10b981', ratio: '7.3%' },
        ],
        trendData: [
          { time: '00:00', 实际负荷: 45.0, 额定基准: 50.0 },
          { time: '04:00', 实际负荷: 42.0, 额定基准: 50.0 },
          { time: '08:00', 实际负荷: 110.5, 额定基准: 100.0 },
          { time: '12:00', 实际负荷: 125.0, 额定基准: 100.0 },
          { time: '16:00', 实际负荷: 118.2, 额定基准: 100.0 },
          { time: '20:00', 实际负荷: 75.6, 额定基准: 60.0 },
        ],
      },
      steam: {
        name: '外购蒸汽量',
        unit: 't',
        donutData: [
          { name: '煤油汽相干燥', value: Number((aggregatedMetrics.steam * 0.485).toFixed(1)), color: '#a855f7', ratio: '48.5%' },
          { name: '绝缘件热压固化', value: Number((aggregatedMetrics.steam * 0.282).toFixed(1)), color: '#ec4899', ratio: '28.2%' },
          { name: '辅助换热采暖', value: Number((aggregatedMetrics.steam * 0.153).toFixed(1)), color: '#3b82f6', ratio: '15.3%' },
          { name: '管网热损耗', value: Number((aggregatedMetrics.steam * 0.080).toFixed(1)), color: '#64748b', ratio: '8.0%' },
        ],
        trendData: [
          { time: '00:00', 实际负荷: 1.2, 额定基准: 1.5 },
          { time: '04:00', 实际负荷: 0.9, 额定基准: 1.5 },
          { time: '08:00', 实际负荷: 3.8, 额定基准: 3.5 },
          { time: '12:00', 实际负荷: 4.2, 额定基准: 3.5 },
          { time: '16:00', 实际负荷: 3.9, 额定基准: 3.5 },
          { time: '20:00', 实际负荷: 2.1, 额定基准: 2.0 },
        ],
      },
      oil: {
        name: '油消耗量',
        unit: 'L',
        donutData: [
          { name: '重载物流叉车', value: Math.round(aggregatedMetrics.oil * 0.450), color: '#ef4444', ratio: '45.0%' },
          { name: '应急柴油发电机', value: Math.round(aggregatedMetrics.oil * 0.280), color: '#fa8c16', ratio: '28.0%' },
          { name: '试验站拖动油机', value: Math.round(aggregatedMetrics.oil * 0.185), color: '#eab308', ratio: '18.5%' },
          { name: '后勤通勤车辆', value: Math.round(aggregatedMetrics.oil * 0.085), color: '#64748b', ratio: '8.5%' },
        ],
        trendData: [
          { time: '00:00', 实际负荷: 0.0, 额定基准: 2.0 },
          { time: '04:00', 实际负荷: 0.0, 额定基准: 2.0 },
          { time: '08:00', 实际负荷: 18.5, 额定基准: 15.0 },
          { time: '12:00', 实际负荷: 22.0, 额定基准: 15.0 },
          { time: '16:00', 实际负荷: 19.8, 额定基准: 15.0 },
          { time: '20:00', 实际负荷: 5.2, 额定基准: 5.0 },
        ],
      },
      nitrogen: {
        name: '液氮消耗量',
        unit: 't',
        donutData: [
          { name: '高压交联连续硫化', value: Number((aggregatedMetrics.nitrogen * 0.550).toFixed(1)), color: '#6366f1', ratio: '55.0%' },
          { name: '绝缘线芯急冷', value: Number((aggregatedMetrics.nitrogen * 0.250).toFixed(1)), color: '#8b5cf6', ratio: '25.0%' },
          { name: '管道气密性吹扫', value: Number((aggregatedMetrics.nitrogen * 0.120).toFixed(1)), color: '#06b6d4', ratio: '12.0%' },
          { name: '低温储罐维保损耗', value: Number((aggregatedMetrics.nitrogen * 0.080).toFixed(1)), color: '#64748b', ratio: '8.0%' },
        ],
        trendData: [
          { time: '00:00', 实际负荷: 0.2, 额定基准: 0.3 },
          { time: '04:00', 实际负荷: 0.1, 额定基准: 0.3 },
          { time: '08:00', 实际负荷: 0.8, 额定基准: 0.6 },
          { time: '12:00', 实际负荷: 0.9, 额定基准: 0.6 },
          { time: '16:00', 实际负荷: 0.8, 额定基准: 0.6 },
          { time: '20:00', 实际负荷: 0.4, 额定基准: 0.4 },
        ],
      },
    }
    return map[selectedMediumView] || null
  }, [selectedMediumView, aggregatedMetrics])

  // 综合能耗介质构成饼图数据
  const energyDonutData = useMemo(() => {
    return [
      { name: '市网电力', value: Number(((aggregatedMetrics.gridElec * 0.1229) / 1000).toFixed(1)), color: '#1677ff' },
      { name: '直供绿电', value: Number(((aggregatedMetrics.solarElec * 0.1229) / 1000).toFixed(1)), color: '#10b981' },
      { name: '天然气', value: Number(((aggregatedMetrics.gas * 1.2143) / 1000).toFixed(1)), color: '#fa8c16' },
      { name: '外购蒸汽', value: Number((aggregatedMetrics.steam * 0.1286).toFixed(1)), color: '#a855f7' },
      { name: '燃油动力', value: Number(((aggregatedMetrics.oil * 0.85 * 1.4571) / 1000).toFixed(1)), color: '#ef4444' },
    ]
  }, [aggregatedMetrics])

  // 月度各介质汇总柱状图数据
  const monthlyBarData = useMemo(() => {
    return monthList.map((mStr) => {
      const [, m] = mStr.split('-')
      const totElec = Number((activeData.totalElecKWhMonth / 10000).toFixed(1))
      const gridElec = Number((activeData.gridElecKWhMonth / 10000).toFixed(1))
      const solarElec = Number((activeData.solarElecKWhMonth / 10000).toFixed(1))
      const gas = Number((activeData.gasM3Month / 10000).toFixed(1))
      const steam = activeData.steamTMonth
      return {
        month: `${m}月份`,
        总用电量: totElec,
        市网供电: gridElec,
        直供绿电: solarElec,
        天然气量: gas,
        外购蒸汽: steam,
      }
    })
  }, [monthList, activeData])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 组织拓扑树 (支持企业制造工厂 / 零碳园区) */}
      <aside className="w-[270px] min-w-[270px] max-w-[270px] shrink-0 sticky top-0 bg-card rounded-xl border border-border shadow-xs flex flex-col h-[calc(100vh-84px)] overflow-hidden">
        {/* 顶部企业工厂 / 零碳园区 视角切换 Tab */}
        <div className="p-2.5 border-b border-border/60 bg-panel/60 shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-4 text-primary" />
              监测对象拓扑选择
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 bg-panel p-0.5 rounded-lg text-xs font-medium border border-border">
            <button
              type="button"
              onClick={() => setTreeType('enterprise')}
              className={cn(
                'py-1 rounded-md transition-all cursor-pointer text-center select-none',
                treeType === 'enterprise' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              组织
            </button>
            <button
              type="button"
              onClick={() => setTreeType('park')}
              className={cn(
                'py-1 rounded-md transition-all cursor-pointer text-center select-none',
                treeType === 'park' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              园区
            </button>
          </div>
        </div>

        {/* 组织树内容 */}
        <div className="flex-1 overflow-hidden">
          <StandardOrgTree
            treeType={treeType}
            selectedId={selectedOrgNode.id}
            onSelect={handleSelectNode}
          />
        </div>
      </aside>

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* 1. 顶部 Header (日范围最多30天/15min固定频率 + 指定月份 + 导出) */}
        <OnlineHeader
          timeDim={timeDim}
          onTimeDimChange={(dim) => setTimeDim(dim)}
          startDate={dateRange.start}
          endDate={dateRange.end}
          onDateRangeChange={(start, end) => setDateRange({ start, end })}
          selectedMonth={selectedMonth}
          onMonthChange={(m) => setSelectedMonth(m)}
          startMonth={startMonth}
          endMonth={endMonth}
          onMonthRangeChange={(s, e) => {
            setStartMonth(s)
            setEndMonth(e)
          }}
        />

        {/* 3. 核心 8 大能源介质消费大盘卡片 (点击卡片与下方时序图表、分时负荷深度联动) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* 卡片 1: 总用电量 */}
          <div
            onClick={() => {
              setSelectedMediumView('all_elec')
              setTouTarget('total')
            }}
            className={cn(
              'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none hover:scale-[1.01]',
              selectedMediumView === 'all_elec'
                ? 'bg-[#2C7CFF]/15 border-[#2C7CFF] ring-2 ring-[#2C7CFF]/40 shadow-sm'
                : 'bg-card border-border hover:border-[#2C7CFF]/40'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Zap className="size-4 text-[#2C7CFF]" />
                总用电量
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#2C7CFF] truncate">
              {(aggregatedMetrics.totalElec / 10000).toFixed(1)} <span className="text-sm font-normal text-muted-foreground font-sans">万kWh</span>
            </div>
            <div className="text-sm text-muted-foreground border-t border-border/60 pt-1 font-mono">
              {timeDim === 'day' ? '日均:' : '月均:'} {((aggregatedMetrics.totalElec / (dailyTimeSeriesData.length || 1)) / 10000).toFixed(2)}万
            </div>
          </div>

          {/* 卡片 2: 市电量 */}
          <div
            onClick={() => {
              setSelectedMediumView('grid_elec')
              setTouTarget('grid')
            }}
            className={cn(
              'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none hover:scale-[1.01]',
              selectedMediumView === 'grid_elec'
                ? 'bg-[#41C0FF]/15 border-[#41C0FF] ring-2 ring-[#41C0FF]/40 shadow-sm'
                : 'bg-card border-border hover:border-[#41C0FF]/40'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Building2 className="size-4 text-[#41C0FF]" />
                市电量 (外购)
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#41C0FF] truncate">
              {(aggregatedMetrics.gridElec / 10000).toFixed(1)} <span className="text-sm font-normal text-muted-foreground font-sans">万kWh</span>
            </div>
            <div className="text-sm text-muted-foreground border-t border-border/60 pt-1 font-mono">
              占比: {((aggregatedMetrics.gridElec / aggregatedMetrics.totalElec) * 100).toFixed(1)}%
            </div>
          </div>

          {/* 卡片 3: 直供绿电量 */}
          <div
            onClick={() => {
              setSelectedMediumView('solar_elec')
              setTouTarget('total')
            }}
            className={cn(
              'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none hover:scale-[1.01]',
              selectedMediumView === 'solar_elec'
                ? 'bg-[#00D492]/15 border-[#00D492] ring-2 ring-[#00D492]/40 shadow-sm'
                : 'bg-card border-border hover:border-[#00D492]/40'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Sun className="size-4 text-[#00D492]" />
                直供绿电量
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#00D492] truncate">
              {(aggregatedMetrics.solarElec / 10000).toFixed(1)} <span className="text-sm font-normal text-muted-foreground font-sans">万kWh</span>
            </div>
            <div className="text-sm text-[#00D492] border-t border-border/60 pt-1 font-mono font-bold">
              消纳率: {aggregatedMetrics.greenElecRatio}%
            </div>
          </div>

          {/* 卡片 4: 水资源消耗量 */}
          <div
            onClick={() => setSelectedMediumView('water')}
            className={cn(
              'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none hover:scale-[1.01]',
              selectedMediumView === 'water'
                ? 'bg-[#10C4CE]/15 border-[#10C4CE] ring-2 ring-[#10C4CE]/40 shadow-sm'
                : 'bg-card border-border hover:border-[#10C4CE]/40'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Droplets className="size-4 text-[#10C4CE]" />
                水资源消耗量
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#10C4CE] truncate">
              {aggregatedMetrics.water.toLocaleString()} <span className="text-sm font-normal text-muted-foreground font-sans">m³</span>
            </div>
            <div className="text-sm text-muted-foreground border-t border-border/60 pt-1 font-mono">
              {timeDim === 'day' ? '日均:' : '月均:'} {Math.round(aggregatedMetrics.water / (dailyTimeSeriesData.length || 1))}m³
            </div>
          </div>

          {/* 卡片 5: 天然气量 */}
          <div
            onClick={() => setSelectedMediumView('gas')}
            className={cn(
              'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none hover:scale-[1.01]',
              selectedMediumView === 'gas'
                ? 'bg-[#FF6536]/15 border-[#FF6536] ring-2 ring-[#FF6536]/40 shadow-sm'
                : 'bg-card border-border hover:border-[#FF6536]/40'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Flame className="size-4 text-[#FF6536]" />
                天然气量
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#FF6536] truncate">
              {aggregatedMetrics.gas.toLocaleString()} <span className="text-sm font-normal text-muted-foreground font-sans">m³</span>
            </div>
            <div className="text-sm text-muted-foreground border-t border-border/60 pt-1 font-mono">
              折标煤: {((aggregatedMetrics.gas * 1.2143) / 1000).toFixed(1)} tce
            </div>
          </div>

          {/* 卡片 6: 外购蒸汽量 */}
          <div
            onClick={() => setSelectedMediumView('steam')}
            className={cn(
              'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none hover:scale-[1.01]',
              selectedMediumView === 'steam'
                ? 'bg-[#FFBA00]/15 border-[#FFBA00] ring-2 ring-[#FFBA00]/40 shadow-sm'
                : 'bg-card border-border hover:border-[#FFBA00]/40'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Wind className="size-4 text-[#FFBA00]" />
                外购蒸汽量
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#FFBA00] truncate">
              {aggregatedMetrics.steam.toLocaleString()} <span className="text-sm font-normal text-muted-foreground font-sans">t</span>
            </div>
            <div className="text-sm text-muted-foreground border-t border-border/60 pt-1 font-mono">
              热力: {(aggregatedMetrics.steam * 2.75).toFixed(1)} GJ
            </div>
          </div>

          {/* 卡片 7: 油消耗量 */}
          <div
            onClick={() => setSelectedMediumView('oil')}
            className={cn(
              'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none hover:scale-[1.01]',
              selectedMediumView === 'oil'
                ? 'bg-[#8E73ED]/15 border-[#8E73ED] ring-2 ring-[#8E73ED]/40 shadow-sm'
                : 'bg-card border-border hover:border-[#8E73ED]/40'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Fuel className="size-4 text-[#8E73ED]" />
                油消耗量
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#8E73ED] truncate">
              {aggregatedMetrics.oil.toLocaleString()} <span className="text-sm font-normal text-muted-foreground font-sans">L</span>
            </div>
            <div className="text-sm text-muted-foreground border-t border-border/60 pt-1 font-mono">
              车辆与动力
            </div>
          </div>

          {/* 卡片 8: 液氮消耗量 (仅限线缆企业展示) */}
          {isCableUnit && (
          <div
            onClick={() => setSelectedMediumView('nitrogen')}
            className={cn(
              'p-4 rounded-lg border shadow-xs space-y-2 transition-all cursor-pointer select-none hover:scale-[1.01]',
              selectedMediumView === 'nitrogen'
                ? 'bg-[#4F39F6]/15 border-[#4F39F6] ring-2 ring-[#4F39F6]/40 shadow-sm'
                : 'bg-card border-border hover:border-[#4F39F6]/40'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Snowflake className="size-4 text-[#4F39F6]" />
                液氮消耗量
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#4F39F6] truncate">
              {aggregatedMetrics.nitrogen.toLocaleString()} <span className="text-sm font-normal text-muted-foreground font-sans">t</span>
            </div>
            <div className="text-sm text-muted-foreground border-t border-border/60 pt-1 font-mono">
              干燥与惰化
            </div>
          </div>
          )}
        </div>

        {/* 🌟 4. 核心时序曲线：选择几月到几月查看曲线 (月数据，按日更新) */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#2C7CFF]" />
              <h3 className="text-base font-bold text-foreground">
                能耗时序曲线
              </h3>
            </div>
          </div>

          {/* 动态折线曲线 */}
          <div className="h-[280px]">
            {selectedMediumView === 'all_elec' && (
              <LineTrend
                data={dailyTimeSeriesData}
                xKey="dayLabel"
                height={280}
                yUnit="万kWh"
                lines={[
                  { key: '总用电量', name: `总用电量 (万kWh/${timeDim === 'day' ? '日' : '月'})`, color: '#2C7CFF' },
                  { key: '市电量', name: `市网供电量 (万kWh/${timeDim === 'day' ? '日' : '月'})`, color: '#41C0FF' },
                  { key: '直供绿电量', name: `直供绿电量 (光伏自发自用, 万kWh/${timeDim === 'day' ? '日' : '月'})`, color: '#00D492' },
                ]}
              />
            )}
            {selectedMediumView === 'grid_elec' && (
              <LineTrend
                data={dailyTimeSeriesData}
                xKey="dayLabel"
                height={280}
                yUnit="万kWh"
                lines={[
                  { key: '市电量', name: `市网外购电量 (万kWh/${timeDim === 'day' ? '日' : '月'})`, color: '#41C0FF' },
                  { key: '总用电量', name: `总用电量参考 (万kWh/${timeDim === 'day' ? '日' : '月'})`, color: '#94a3b8' },
                ]}
              />
            )}
            {selectedMediumView === 'solar_elec' && (
              <LineTrend
                data={dailyTimeSeriesData}
                xKey="dayLabel"
                height={280}
                yUnit="万kWh"
                lines={[
                  { key: '直供绿电量', name: `直供绿电量 (光伏自发自用, 万kWh/${timeDim === 'day' ? '日' : '月'})`, color: '#00D492' },
                  { key: '总用电量', name: `总用电量参考 (万kWh/${timeDim === 'day' ? '日' : '月'})`, color: '#94a3b8' },
                ]}
              />
            )}
            {selectedMediumView === 'water' && (
              <LineTrend
                data={dailyTimeSeriesData}
                xKey="dayLabel"
                height={280}
                yUnit="m³"
                lines={[
                  { key: '用水量', name: `水资源消耗量 (m³/${timeDim === 'day' ? '日' : '月'})`, color: '#10C4CE' },
                ]}
              />
            )}
            {selectedMediumView === 'gas' && (
              <LineTrend
                data={dailyTimeSeriesData}
                xKey="dayLabel"
                height={280}
                yUnit="m³"
                lines={[
                  { key: '天然气量', name: '天然气消耗量 (m³/日)', color: '#FF6536' },
                ]}
              />
            )}
            {selectedMediumView === 'steam' && (
              <LineTrend
                data={dailyTimeSeriesData}
                xKey="dayLabel"
                height={280}
                yUnit="t"
                lines={[
                  { key: '外购蒸汽量', name: `外购蒸汽量 (t/${timeDim === 'day' ? '日' : '月'})`, color: '#FFBA00' },
                ]}
              />
            )}
            {selectedMediumView === 'oil' && (
              <LineTrend
                data={dailyTimeSeriesData}
                xKey="dayLabel"
                height={280}
                yUnit="L"
                lines={[
                  { key: '油消耗量', name: `燃油消耗量 (L/${timeDim === 'day' ? '日' : '月'})`, color: '#8E73ED' },
                ]}
              />
            )}
            {selectedMediumView === 'nitrogen' && (
              <LineTrend
                data={dailyTimeSeriesData}
                xKey="dayLabel"
                height={280}
                yUnit="t"
                lines={[
                  { key: '液氮消耗量', name: `液氮消耗量 (t/${timeDim === 'day' ? '日' : '月'})`, color: '#4F39F6' },
                ]}
              />
            )}
            {selectedMediumView === 'tce' && (
              <LineTrend
                data={dailyTimeSeriesData}
                xKey="dayLabel"
                height={280}
                yUnit="tce"
                lines={[
                  { key: '综合能耗', name: `综合能耗总量 (tce/${timeDim === 'day' ? '日' : '月'})`, color: '#00D492' },
                ]}
              />
            )}
          </div>
        </div>

        {/* 🌟 5. 【用能结构与负荷监测】电力介质展示峰平谷，非电介质动态展示重点车间/工序能耗结构 */}
        {['all_elec', 'grid_elec', 'solar_elec'].includes(selectedMediumView) ? (
        <div className="bg-card p-6 rounded-lg border border-border shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#FFBA00]" />
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>用电峰平谷时段负荷与结构监测</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-[#FF6536] border border-amber-500/30 font-bold">
                  TOU 分时电量
                </span>
              </h3>
            </div>

            {/* 峰平谷控制栏：1. 监测对象 (总用电量 vs 市电量) | 2. 细化分解月份选择 */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 1. 总用电量 vs 市电量切换 */}
              <div className="flex items-center gap-1 bg-panel p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setTouTarget('total')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer select-none',
                    touTarget === 'total' ? 'bg-[#2C7CFF] text-white font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground font-medium'
                  )}
                >
                  总用电量 峰平谷
                </button>
                <button
                  type="button"
                  onClick={() => setTouTarget('grid')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer select-none',
                    touTarget === 'grid' ? 'bg-[#2C7CFF] text-white font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground font-medium'
                  )}
                >
                  市电量 峰平谷
                </button>
              </div>

              {/* 2. 分解到日月份选择 */}
              <div className="flex items-center gap-2 bg-panel px-3 h-9 rounded-lg border border-border text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground font-medium text-sm">分解月份:</span>
                <input
                  type="month"
                  value={touDecomposeMonth}
                  onChange={(e) => setTouDecomposeMonth(e.target.value)}
                  className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 左侧 4/12: 月度总体峰平谷分布 (Donut + 4 段卡片) */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-3 border-r border-border/60 pr-4">
              <div className="flex items-center justify-between text-sm font-bold text-foreground">
                <span className="flex items-center gap-1.5">
                  <PieIcon className="size-4 text-[#2C7CFF]" />
                  {touDecomposeMonth} 月度总体峰平谷构成
                </span>
                <span className="text-sm font-mono text-[#2C7CFF] font-bold">
                  {touCalculations.baseMonthElec.toLocaleString()} 万kWh
                </span>
              </div>

              <Donut data={touCalculations.monthDonutData} height={165} unit="万kWh" />

              <div className="grid grid-cols-2 gap-2 text-sm font-mono pt-1">
                <div className="p-2 rounded-lg bg-panel border border-[#FF6536]/30 text-foreground">
                  <div className="flex justify-between items-center text-xs text-[#FF6536] font-medium">
                    <span>尖峰</span>
                    <strong className="font-mono">16.4%</strong>
                  </div>
                  <div className="text-base font-bold font-mono text-[#FF6536] mt-0.5">{touCalculations.monthTip} 万kWh</div>
                </div>

                <div className="p-2 rounded-lg bg-panel border border-[#FFBA00]/30 text-foreground">
                  <div className="flex justify-between items-center text-xs text-[#FFBA00] font-medium">
                    <span>高峰</span>
                    <strong className="font-mono">41.1%</strong>
                  </div>
                  <div className="text-base font-bold font-mono text-[#FFBA00] mt-0.5">{touCalculations.monthPeak} 万kWh</div>
                </div>

                <div className="p-2 rounded-lg bg-panel border border-[#2C7CFF]/30 text-foreground">
                  <div className="flex justify-between items-center text-xs text-[#2C7CFF] font-medium">
                    <span>平段</span>
                    <strong className="font-mono">28.9%</strong>
                  </div>
                  <div className="text-base font-bold font-mono text-[#2C7CFF] mt-0.5">{touCalculations.monthFlat} 万kWh</div>
                </div>

                <div className="p-2 rounded-lg bg-panel border border-[#10C4CE]/30 text-foreground">
                  <div className="flex justify-between items-center text-xs text-[#10C4CE] font-medium">
                    <span>低谷</span>
                    <strong className="font-mono">13.6%</strong>
                  </div>
                  <div className="text-base font-bold font-mono text-[#10C4CE] mt-0.5">{touCalculations.monthValley} 万kWh</div>
                </div>
              </div>
            </div>

            {/* 右侧 8/12: 可分解到日（分日堆叠柱状图） */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <BarChart3 className="size-4 text-[#2C7CFF]" />
                  {touDecomposeMonth} 分解到日峰平谷用电量连续堆叠分布 (万kWh/日)
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  尖/峰/平/谷 分时连续采集
                </span>
              </div>

              <div className="h-[235px]">
                <BarChartGroup
                  data={touCalculations.dailyDecomposedData}
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
        </div>
        ) : (
          /* 非电介质专属工序消耗结构与连续负荷走势 */
          nonElectricStructures && (
            <div className="bg-card p-6 rounded-lg border border-border shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#2C7CFF]" />
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <span>【{nonElectricStructures.name}】重点工序/车间消耗结构与时段负荷分布</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-bold">
                      工序分析
                    </span>
                  </h3>
                </div>
                <ExportButton
                  label="导出工序"
                  onClick={() => alert(`正在导出【${nonElectricStructures.name}】工序消耗明细...`)}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* 左侧 4/12: 重点工序消耗占比圆环图 + 明细栏 */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-3 border-r border-border/60 pr-4">
                  <div className="flex items-center justify-between text-sm font-bold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <PieIcon className="size-4 text-[#2C7CFF]" />
                      主要工序消耗占比构成
                    </span>
                    <span className="text-sm font-mono text-[#2C7CFF] font-bold">
                      {nonElectricStructures.unit}
                    </span>
                  </div>

                  <Donut
                    data={nonElectricStructures.donutData}
                    height={165}
                    unit={nonElectricStructures.unit}
                  />

                  <div className="grid grid-cols-2 gap-2 text-sm font-mono pt-1">
                    {nonElectricStructures.donutData.map((item) => (
                      <div key={item.name} className="p-2 rounded-lg bg-panel border border-border text-foreground">
                        <div className="flex justify-between items-center text-xs font-medium truncate" style={{ color: item.color }}>
                          <span className="truncate">{item.name}</span>
                          <strong className="font-mono ml-1">{item.ratio}</strong>
                        </div>
                        <div className="text-sm font-bold font-mono text-foreground mt-0.5">
                          {item.value.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{nonElectricStructures.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 右侧 8/12: 日连续负荷走势与额定基准线 */}
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <BarChart3 className="size-4 text-[#2C7CFF]" />
                      日内连续采样负荷走势与设计基准对比
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      实时采样 vs 设计基准
                    </span>
                  </div>

                  <div className="h-[235px]">
                    <LineTrend
                      data={nonElectricStructures.trendData}
                      xKey="time"
                      height={235}
                      yUnit={nonElectricStructures.unit}
                      lines={[
                        { key: '实际负荷', name: `实际负荷 (${nonElectricStructures.unit})`, color: '#2C7CFF' },
                        { key: '额定基准', name: `额定设计基准 (${nonElectricStructures.unit})`, color: '#94a3b8' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* 7. 底部数据明细：按日更新明细台账表格 (支持导出) */}
        <div className="bg-card rounded-lg border border-border shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border/60 flex flex-wrap items-center justify-between bg-panel/60 gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="size-2 rounded-full bg-[#2C7CFF]" />
              <h3 className="text-base font-bold text-foreground">
                8 大能源介质{timeDim === 'day' ? '按日连续更新' : '月度汇总'}明细台账
              </h3>
            </div>

            <ExportButton
              label="导出台账"
              onClick={() => alert(`正在导出【${activeData.name}】${timeDim === 'day' ? '按日' : '按月'}能耗明细台账 (Excel)...`)}
            />
          </div>

          <div className="overflow-x-auto max-h-[380px] custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-panel z-10">
                <tr className="border-b border-border text-muted-foreground font-semibold font-sans h-[44px]">
                  <th className="py-2.5 px-3">日期 / 账期</th>
                  <th className="py-2.5 px-3 text-[#2C7CFF] font-bold">总用电量 (万kWh)</th>
                  <th className="py-2.5 px-3 text-[#41C0FF] font-semibold">市电量 (万kWh)</th>
                  <th className="py-2.5 px-3 text-[#00D492] font-bold">直供绿电量 (万kWh)</th>
                  <th className="py-2.5 px-3 text-[#10C4CE]">用水量 (m³)</th>
                  <th className="py-2.5 px-3 text-[#FF6536]">天然气量 (m³)</th>
                  <th className="py-2.5 px-3 text-[#FFBA00]">外购蒸汽量 (t)</th>
                  <th className="py-2.5 px-3 text-[#8E73ED]">油消耗量 (L)</th>
                  <th className="py-2.5 px-3 text-[#4F39F6]">液氮消耗量 (t)</th>
                  <th className="py-2.5 px-3 text-[#00D492] font-bold">综合能耗 (tce)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {[...dailyTimeSeriesData].reverse().map((row, idx) => (
                  <tr key={idx} className="hover:bg-accent/30 transition-colors h-[44px]">
                    <td className="py-2 px-3 font-semibold text-foreground font-sans">{row.date}</td>
                    <td className="py-2 px-3 font-bold text-[#2C7CFF]">{row.总用电量.toFixed(2)}</td>
                    <td className="py-2 px-3 text-foreground">{row.市电量.toFixed(2)}</td>
                    <td className="py-2 px-3 font-bold text-[#00D492]">{row.直供绿电量.toFixed(2)}</td>
                    <td className="py-2 px-3 text-[#10C4CE]">{row.用水量.toLocaleString()}</td>
                    <td className="py-2 px-3 text-[#FF6536]">{row.天然气量.toLocaleString()}</td>
                    <td className="py-2 px-3 text-[#FFBA00]">{row.外购蒸汽量.toFixed(1)}</td>
                    <td className="py-2 px-3 text-[#8E73ED]">{row.油消耗量.toFixed(1)}</td>
                    <td className="py-2 px-3 text-[#4F39F6]">{row.液氮消耗量.toFixed(2)}</td>
                    <td className="py-2 px-3 font-extrabold text-[#00D492]">{row.综合能耗.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

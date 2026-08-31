'use client'

import React, { useState, useMemo } from 'react'
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

  // 时间维度：选择几月到几月查看曲线 (默认 2026-01 至 2026-08)
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

  // 处理树节点切换
  const handleSelectNode = (node: StandardOrgNode) => {
    setSelectedOrgNode(node)
  }

  // =========================================================================
  // 1. 计算所选月份跨度月份数与累计汇总 (几月到几月)
  // =========================================================================
  const monthList = useMemo(() => {
    const startY = parseInt(startMonth.split('-')[0])
    const startM = parseInt(startMonth.split('-')[1])
    const endY = parseInt(endMonth.split('-')[0])
    const endM = parseInt(endMonth.split('-')[1])

    const months: string[] = []
    let curY = startY
    let curM = startM

    while (curY < endY || (curY === endY && curM <= endM)) {
      const mStr = `${curY}-${curM < 10 ? '0' + curM : curM}`
      months.push(mStr)
      curM++
      if (curM > 12) {
        curM = 1
        curY++
      }
    }
    return months.length > 0 ? months : ['2026-08']
  }, [startMonth, endMonth])

  const totalMonthsCount = monthList.length

  // 8 大介质累计核算汇总 (所选月份区间总值)
  const aggregatedMetrics = useMemo(() => {
    const mCount = totalMonthsCount
    const totalElec = activeData.totalElecKWhMonth * mCount
    const gridElec = activeData.gridElecKWhMonth * mCount
    const solarElec = activeData.solarElecKWhMonth * mCount
    const greenElecRatio = Number(((solarElec / (totalElec || 1)) * 100).toFixed(1))
    const water = activeData.waterM3Month * mCount
    const gas = activeData.gasM3Month * mCount
    const steam = activeData.steamTMonth * mCount
    const oil = activeData.oilLiterMonth * mCount
    const nitrogen = activeData.liquidNitrogenTMonth * mCount

    // 综合能耗折标煤 (tce)
    const totalTce = Number(
      (
        (totalElec * 0.1229) / 1000 +
        (gas * 1.2143) / 1000 +
        steam * 0.1286 +
        (oil * 0.85 * 1.4571) / 1000
      ).toFixed(1)
    )

    return {
      totalElec,
      gridElec,
      solarElec,
      greenElecRatio,
      water,
      gas,
      steam,
      oil,
      nitrogen,
      totalTce,
    }
  }, [activeData, totalMonthsCount])

  // =========================================================================
  // 2. 按日连续更新的曲线走势数据 (所选几月到几月按日更新)
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

    monthList.forEach((mStr) => {
      const [y, m] = mStr.split('-').map(Number)
      const maxDays = m === 8 && y === 2026 ? 28 : new Date(y, m, 0).getDate()
      const baseDayElec = (activeData.totalElecKWhMonth / 30) / 10000
      const baseDayGrid = (activeData.gridElecKWhMonth / 30) / 10000
      const baseDaySolar = (activeData.solarElecKWhMonth / 30) / 10000
      const baseDayWater = activeData.waterM3Month / 30
      const baseDayGas = activeData.gasM3Month / 30
      const baseDaySteam = activeData.steamTMonth / 30
      const baseDayOil = activeData.oilLiterMonth / 30
      const baseDayNitrogen = activeData.liquidNitrogenTMonth / 30

      for (let d = 1; d <= maxDays; d++) {
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

        const dateStr = `${mStr}-${d < 10 ? '0' + d : d}`
        const dayLabel = `${m}月${d < 10 ? '0' + d : d}日`

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
      }
    })

    return records
  }, [monthList, activeData])

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
      { name: '尖峰电量', value: monthTip, color: '#f5222d', ratio: '16.4%' },
      { name: '高峰电量', value: monthPeak, color: '#fa8c16', ratio: '41.1%' },
      { name: '平段电量', value: monthFlat, color: '#1677ff', ratio: '28.9%' },
      { name: '低谷电量', value: monthValley, color: '#52c41a', ratio: '13.6%' },
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
      <aside className="w-[270px] min-w-[270px] max-w-[270px] shrink-0 sticky top-0 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[calc(100vh-84px)] overflow-hidden">
        {/* 顶部企业工厂 / 零碳园区 视角切换 Tab */}
        <div className="p-2.5 border-b border-slate-100 bg-slate-50/70 shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-4 text-[#1677ff]" />
              监测对象拓扑选择
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] font-mono font-bold">
              园区 & 工厂
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setTreeType('enterprise')}
              className={cn(
                'py-1 rounded-md transition-all cursor-pointer text-center select-none',
                treeType === 'enterprise' ? 'bg-white text-[#1677ff] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              🏭 工厂架构
            </button>
            <button
              type="button"
              onClick={() => setTreeType('park')}
              className={cn(
                'py-1 rounded-md transition-all cursor-pointer text-center select-none',
                treeType === 'park' ? 'bg-white text-emerald-600 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              🏞️ 零碳园区
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
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 1. 顶部 Header (含在线监测 2 大 Tab: 用能监测 / 设备监测 + 统一时间筛选 + 导出) */}
        <OnlineHeader
          startMonth={startMonth}
          endMonth={endMonth}
          onMonthRangeChange={(start, end) => {
            setStartMonth(start)
            setEndMonth(end)
          }}
        />

        {/* 3. 核心 8 大能源介质消费大盘卡片 (点击卡片与下方时序图表、分时负荷深度联动) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* 卡片 1: 总用电量 */}
          <div
            onClick={() => {
              setSelectedMediumView('all_elec')
              setTouTarget('total')
            }}
            className={cn(
              'p-3 rounded-xl border shadow-xs space-y-1 transition-all cursor-pointer select-none hover:scale-[1.015]',
              selectedMediumView === 'all_elec'
                ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-400/40 shadow-sm'
                : 'bg-white border-slate-200 hover:border-blue-300'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                <Zap className="size-3 text-[#1677ff]" />
                总用电量
              </span>
              {selectedMediumView === 'all_elec' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-[#1677ff] font-bold">
                  图表联动中
                </span>
              )}
            </div>
            <div className="text-base font-extrabold font-mono text-[#1677ff] truncate">
              {(aggregatedMetrics.totalElec / 10000).toFixed(1)} <span className="text-[10px] font-normal text-slate-400 font-sans">万kWh</span>
            </div>
            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-0.5 font-mono">
              日均: {((aggregatedMetrics.totalElec / (dailyTimeSeriesData.length || 1)) / 10000).toFixed(2)}万
            </div>
          </div>

          {/* 卡片 2: 市电量 */}
          <div
            onClick={() => {
              setSelectedMediumView('grid_elec')
              setTouTarget('grid')
            }}
            className={cn(
              'p-3 rounded-xl border shadow-xs space-y-1 transition-all cursor-pointer select-none hover:scale-[1.015]',
              selectedMediumView === 'grid_elec'
                ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                : 'bg-white border-slate-200 hover:border-amber-300'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <Building2 className="size-3 text-amber-600" />
                市电量 (外购)
              </span>
              {selectedMediumView === 'grid_elec' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-bold">
                  图表联动中
                </span>
              )}
            </div>
            <div className="text-base font-extrabold font-mono text-amber-600 truncate">
              {(aggregatedMetrics.gridElec / 10000).toFixed(1)} <span className="text-[10px] font-normal text-slate-400 font-sans">万kWh</span>
            </div>
            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-0.5 font-mono">
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
              'p-3 rounded-xl border shadow-xs space-y-1 transition-all cursor-pointer select-none hover:scale-[1.015]',
              selectedMediumView === 'solar_elec'
                ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-400/40 shadow-sm'
                : 'bg-gradient-to-br from-emerald-50/40 via-white to-white border-emerald-200/80 hover:border-emerald-400'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                <Sun className="size-3 text-emerald-600" />
                直供绿电量
              </span>
              {selectedMediumView === 'solar_elec' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-bold">
                  图表联动中
                </span>
              )}
            </div>
            <div className="text-base font-extrabold font-mono text-emerald-600 truncate">
              {(aggregatedMetrics.solarElec / 10000).toFixed(1)} <span className="text-[10px] font-normal text-slate-400 font-sans">万kWh</span>
            </div>
            <div className="text-[10px] text-emerald-700 border-t border-emerald-100 pt-0.5 font-mono font-bold">
              消纳率: {aggregatedMetrics.greenElecRatio}%
            </div>
          </div>

          {/* 卡片 4: 工业用水量 */}
          <div
            onClick={() => setSelectedMediumView('water')}
            className={cn(
              'p-3 rounded-xl border shadow-xs space-y-1 transition-all cursor-pointer select-none hover:scale-[1.015]',
              selectedMediumView === 'water'
                ? 'bg-cyan-50/80 border-cyan-500 ring-2 ring-cyan-400/40 shadow-sm'
                : 'bg-white border-slate-200 hover:border-cyan-300'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <Droplets className="size-3 text-cyan-500" />
                工业用水量
              </span>
              {selectedMediumView === 'water' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-700 font-bold">
                  图表联动中
                </span>
              )}
            </div>
            <div className="text-base font-extrabold font-mono text-cyan-600 truncate">
              {aggregatedMetrics.water.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 font-sans">m³</span>
            </div>
            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-0.5 font-mono">
              日均: {Math.round(aggregatedMetrics.water / (dailyTimeSeriesData.length || 1))}m³
            </div>
          </div>

          {/* 卡片 5: 天然气量 */}
          <div
            onClick={() => setSelectedMediumView('gas')}
            className={cn(
              'p-3 rounded-xl border shadow-xs space-y-1 transition-all cursor-pointer select-none hover:scale-[1.015]',
              selectedMediumView === 'gas'
                ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                : 'bg-white border-slate-200 hover:border-amber-300'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <Flame className="size-3 text-amber-500" />
                天然气量
              </span>
              {selectedMediumView === 'gas' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-bold">
                  图表联动中
                </span>
              )}
            </div>
            <div className="text-base font-extrabold font-mono text-amber-600 truncate">
              {aggregatedMetrics.gas.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 font-sans">m³</span>
            </div>
            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-0.5 font-mono">
              折标煤: {((aggregatedMetrics.gas * 1.2143) / 1000).toFixed(1)} tce
            </div>
          </div>

          {/* 卡片 6: 外购蒸汽量 */}
          <div
            onClick={() => setSelectedMediumView('steam')}
            className={cn(
              'p-3 rounded-xl border shadow-xs space-y-1 transition-all cursor-pointer select-none hover:scale-[1.015]',
              selectedMediumView === 'steam'
                ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-400/40 shadow-sm'
                : 'bg-white border-slate-200 hover:border-purple-300'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <Wind className="size-3 text-purple-500" />
                外购蒸汽量
              </span>
              {selectedMediumView === 'steam' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold">
                  图表联动中
                </span>
              )}
            </div>
            <div className="text-base font-extrabold font-mono text-purple-600 truncate">
              {aggregatedMetrics.steam.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 font-sans">t</span>
            </div>
            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-0.5 font-mono">
              热力: {(aggregatedMetrics.steam * 2.75).toFixed(1)} GJ
            </div>
          </div>

          {/* 卡片 7: 油消耗量 */}
          <div
            onClick={() => setSelectedMediumView('oil')}
            className={cn(
              'p-3 rounded-xl border shadow-xs space-y-1 transition-all cursor-pointer select-none hover:scale-[1.015]',
              selectedMediumView === 'oil'
                ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-400/40 shadow-sm'
                : 'bg-white border-slate-200 hover:border-rose-300'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <Fuel className="size-3 text-rose-500" />
                油消耗量
              </span>
              {selectedMediumView === 'oil' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">
                  图表联动中
                </span>
              )}
            </div>
            <div className="text-base font-extrabold font-mono text-rose-600 truncate">
              {aggregatedMetrics.oil.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 font-sans">L</span>
            </div>
            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-0.5 font-mono">
              车辆与动力
            </div>
          </div>

          {/* 卡片 8: 液氮消耗量 */}
          <div
            onClick={() => setSelectedMediumView('nitrogen')}
            className={cn(
              'p-3 rounded-xl border shadow-xs space-y-1 transition-all cursor-pointer select-none hover:scale-[1.015]',
              selectedMediumView === 'nitrogen'
                ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-400/40 shadow-sm'
                : 'bg-white border-slate-200 hover:border-indigo-300'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <Snowflake className="size-3 text-indigo-500" />
                液氮消耗量
              </span>
              {selectedMediumView === 'nitrogen' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold">
                  图表联动中
                </span>
              )}
            </div>
            <div className="text-base font-extrabold font-mono text-indigo-600 truncate">
              {aggregatedMetrics.nitrogen.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 font-sans">t</span>
            </div>
            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-0.5 font-mono">
              干燥与惰化
            </div>
          </div>
        </div>

        {/* 🌟 4. 核心时序曲线：选择几月到几月查看曲线 (月数据，按日更新) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-900">
                {startMonth} 至 {endMonth} 能耗时序曲线 (按日连续更新，共 {dailyTimeSeriesData.length} 天)
              </h3>
            </div>

            {/* 介质曲线切换 Tab 按钮 */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 font-sans text-xs">
              <button
                type="button"
                onClick={() => setSelectedMediumView('all_elec')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                  ['all_elec', 'grid_elec', 'solar_elec'].includes(selectedMediumView) ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Zap className="size-3" />
                <span>用电 (总用电/市电/直供绿电)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMediumView('water')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                  selectedMediumView === 'water' ? 'font-bold bg-white text-cyan-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Droplets className="size-3" />
                <span>用水量</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMediumView('gas')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                  selectedMediumView === 'gas' ? 'font-bold bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Flame className="size-3" />
                <span>天然气量</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMediumView('steam')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                  selectedMediumView === 'steam' ? 'font-bold bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Wind className="size-3" />
                <span>外购蒸汽</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMediumView('oil')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                  selectedMediumView === 'oil' ? 'font-bold bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Fuel className="size-3" />
                <span>油消耗量</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMediumView('nitrogen')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                  selectedMediumView === 'nitrogen' ? 'font-bold bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Snowflake className="size-3" />
                <span>液氮消耗</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMediumView('tce')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                  selectedMediumView === 'tce' ? 'font-bold bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Layers className="size-3" />
                <span>综合能耗 (tce)</span>
              </button>
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
                  { key: '总用电量', name: '总用电量 (万kWh/日)', color: '#1677ff' },
                  { key: '市电量', name: '市网供电量 (万kWh/日)', color: '#fa8c16' },
                  { key: '直供绿电量', name: '直供绿电量 (光伏自发自用, 万kWh/日)', color: '#10b981' },
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
                  { key: '市电量', name: '市网外购电量 (万kWh/日)', color: '#fa8c16' },
                  { key: '总用电量', name: '总用电量参考 (万kWh/日)', color: '#94a3b8' },
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
                  { key: '直供绿电量', name: '直供绿电量 (光伏自发自用, 万kWh/日)', color: '#10b981' },
                  { key: '总用电量', name: '总用电量参考 (万kWh/日)', color: '#94a3b8' },
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
                  { key: '用水量', name: '工业用水量 (m³/日)', color: '#06b6d4' },
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
                  { key: '天然气量', name: '天然气消耗量 (m³/日)', color: '#f59e0b' },
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
                  { key: '外购蒸汽量', name: '外购蒸汽量 (t/日)', color: '#a855f7' },
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
                  { key: '油消耗量', name: '燃油消耗量 (L/日)', color: '#ef4444' },
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
                  { key: '液氮消耗量', name: '液氮消耗量 (t/日)', color: '#6366f1' },
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
                  { key: '综合能耗', name: '综合能耗总量 (tce/日)', color: '#059669' },
                ]}
              />
            )}
          </div>
        </div>

        {/* 🌟 5. 【核心增强】用电峰平谷监测 (总用电量 / 市电量，月度总体 + 可分解到日) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>用电峰平谷时段负荷与结构监测</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-bold">
                  TOU 分时电量
                </span>
              </h3>
            </div>

            {/* 峰平谷控制栏：1. 监测对象 (总用电量 vs 市电量) | 2. 细化分解月份选择 */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 1. 总用电量 vs 市电量切换 */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-sans text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setTouTarget('total')}
                  className={cn(
                    'px-3 py-1 rounded-md transition-all cursor-pointer select-none',
                    touTarget === 'total' ? 'bg-white text-[#1677ff] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  ⚡ 总用电量 峰平谷
                </button>
                <button
                  type="button"
                  onClick={() => setTouTarget('grid')}
                  className={cn(
                    'px-3 py-1 rounded-md transition-all cursor-pointer select-none',
                    touTarget === 'grid' ? 'bg-white text-amber-600 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  🏢 市电量 峰平谷
                </button>
              </div>

              {/* 2. 分解到日月份选择 */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 text-xs font-mono">
                <Calendar className="size-3 text-slate-400" />
                <span className="text-slate-600 font-sans text-[11px]">分解月份:</span>
                <select
                  value={touDecomposeMonth}
                  onChange={(e) => setTouDecomposeMonth(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 font-bold focus:outline-none cursor-pointer"
                >
                  {monthList.map((mStr) => (
                    <option key={mStr} value={mStr}>
                      {mStr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* 左侧 4/12: 月度总体峰平谷分布 (Donut + 4 段卡片) */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-2 border-r border-slate-100 pr-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <PieIcon className="size-3.5 text-[#1677ff]" />
                  {touDecomposeMonth} 月度总体峰平谷构成
                </span>
                <span className="text-xs font-mono text-[#1677ff] font-bold">
                  {touCalculations.baseMonthElec.toLocaleString()} 万kWh
                </span>
              </div>

              <Donut data={touCalculations.monthDonutData} height={165} unit="万kWh" />

              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono pt-1">
                <div className="p-1.5 rounded bg-rose-50/80 border border-rose-100 text-rose-900">
                  <div className="flex justify-between items-center text-[10px] text-rose-700 font-sans">
                    <span>尖峰</span>
                    <strong className="font-mono">16.4%</strong>
                  </div>
                  <div className="text-xs font-bold font-mono">{touCalculations.monthTip} 万kWh</div>
                </div>

                <div className="p-1.5 rounded bg-amber-50/80 border border-amber-100 text-amber-900">
                  <div className="flex justify-between items-center text-[10px] text-amber-700 font-sans">
                    <span>高峰</span>
                    <strong className="font-mono">41.1%</strong>
                  </div>
                  <div className="text-xs font-bold font-mono">{touCalculations.monthPeak} 万kWh</div>
                </div>

                <div className="p-1.5 rounded bg-blue-50/80 border border-blue-100 text-blue-900">
                  <div className="flex justify-between items-center text-[10px] text-blue-700 font-sans">
                    <span>平段</span>
                    <strong className="font-mono">28.9%</strong>
                  </div>
                  <div className="text-xs font-bold font-mono">{touCalculations.monthFlat} 万kWh</div>
                </div>

                <div className="p-1.5 rounded bg-emerald-50/80 border border-emerald-100 text-emerald-900">
                  <div className="flex justify-between items-center text-[10px] text-emerald-700 font-sans">
                    <span>低谷</span>
                    <strong className="font-mono">13.6%</strong>
                  </div>
                  <div className="text-xs font-bold font-mono">{touCalculations.monthValley} 万kWh</div>
                </div>
              </div>
            </div>

            {/* 右侧 8/12: 可分解到日（分日堆叠柱状图） */}
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="size-3.5 text-amber-600" />
                  {touDecomposeMonth} 分解到日峰平谷用电量连续堆叠分布 (万kWh/日)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  尖/峰/平/谷 分时连续采集
                </span>
              </div>

              <div className="h-[235px]">
                <BarChartGroup
                  data={touCalculations.dailyDecomposedData}
                  xKey="day"
                  height={235}
                  yUnit="万kWh"
                  bars={[
                    { key: '尖峰', name: '尖峰电量', color: '#f5222d' },
                    { key: '峰段', name: '高峰电量', color: '#fa8c16' },
                    { key: '平段', name: '平段电量', color: '#1677ff' },
                    { key: '谷段', name: '低谷电量', color: '#52c41a' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 6. 辅助分析图表：月度能源消耗累计柱状堆叠 + 能耗介质结构环形图 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* 左侧 7/12: 月度能源介质累计柱状堆叠 */}
          <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-800">
                  {startMonth} ~ {endMonth} 各月用电构成与天然气对比 (万kWh / 万m³)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">月度累计对标</span>
            </div>
            <div className="h-[210px]">
              <BarChartGroup
                data={monthlyBarData}
                xKey="month"
                height={210}
                yUnit="万"
                bars={[
                  { key: '市网供电', name: '市网供电 (万kWh)', color: '#1677ff' },
                  { key: '直供绿电', name: '直供绿电 (万kWh)', color: '#10b981' },
                  { key: '天然气量', name: '天然气量 (万m³)', color: '#fa8c16' },
                ]}
              />
            </div>
          </div>

          {/* 右侧 5/12: 能源消耗介质综合折标煤结构 */}
          <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold text-slate-800">
                  综合能耗折标煤结构 ({aggregatedMetrics.totalTce} tce)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">GB/T 2589 标准</span>
            </div>
            <Donut data={energyDonutData} height={155} unit="tce" />
            <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center pt-1">
              <div className="p-1 rounded bg-blue-50 text-blue-900">
                <span className="text-[9px] text-slate-500 block font-sans">市电</span>
                <strong>{((energyDonutData[0].value / aggregatedMetrics.totalTce) * 100).toFixed(1)}%</strong>
              </div>
              <div className="p-1 rounded bg-emerald-50 text-emerald-900">
                <span className="text-[9px] text-slate-500 block font-sans">绿电</span>
                <strong>{((energyDonutData[1].value / aggregatedMetrics.totalTce) * 100).toFixed(1)}%</strong>
              </div>
              <div className="p-1 rounded bg-amber-50 text-amber-900">
                <span className="text-[9px] text-slate-500 block font-sans">燃气</span>
                <strong>{((energyDonutData[2].value / aggregatedMetrics.totalTce) * 100).toFixed(1)}%</strong>
              </div>
              <div className="p-1 rounded bg-purple-50 text-purple-900">
                <span className="text-[9px] text-slate-500 block font-sans">蒸汽</span>
                <strong>{((energyDonutData[3].value / aggregatedMetrics.totalTce) * 100).toFixed(1)}%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 7. 底部数据明细：按日更新明细台账表格 (支持导出) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/80 gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-500" />
              <h3 className="text-xs font-bold text-slate-800">
                {startMonth} 至 {endMonth} 8 大能源介质按日连续更新明细台账
              </h3>
            </div>

            <button
              type="button"
              onClick={() => alert(`正在导出【${activeData.name}】${startMonth}至${endMonth}按日能耗明细台账 (Excel)...`)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer shadow-2xs text-xs"
            >
              <Download className="size-3.5 text-slate-500" />
              <span>导出台账数据</span>
            </button>
          </div>

          <div className="overflow-x-auto max-h-[380px] custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-slate-100 z-10">
                <tr className="border-b border-slate-200 text-slate-700 font-semibold font-sans">
                  <th className="py-2.5 px-3">日期 / 账期</th>
                  <th className="py-2.5 px-3 text-[#1677ff] font-bold">总用电量 (万kWh)</th>
                  <th className="py-2.5 px-3 text-slate-700">市电量 (万kWh)</th>
                  <th className="py-2.5 px-3 text-emerald-600 font-bold">直供绿电量 (万kWh)</th>
                  <th className="py-2.5 px-3 text-cyan-600">用水量 (m³)</th>
                  <th className="py-2.5 px-3 text-amber-600">天然气量 (m³)</th>
                  <th className="py-2.5 px-3 text-purple-600">外购蒸汽量 (t)</th>
                  <th className="py-2.5 px-3 text-rose-600">油消耗量 (L)</th>
                  <th className="py-2.5 px-3 text-indigo-600">液氮消耗量 (t)</th>
                  <th className="py-2.5 px-3 text-emerald-800 font-bold">综合能耗 (tce)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[...dailyTimeSeriesData].reverse().map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-900 font-sans">{row.date}</td>
                    <td className="py-2 px-3 font-bold text-[#1677ff]">{row.总用电量.toFixed(2)}</td>
                    <td className="py-2 px-3 text-slate-700">{row.市电量.toFixed(2)}</td>
                    <td className="py-2 px-3 font-bold text-emerald-600">{row.直供绿电量.toFixed(2)}</td>
                    <td className="py-2 px-3 text-cyan-700">{row.用水量.toLocaleString()}</td>
                    <td className="py-2 px-3 text-amber-700">{row.天然气量.toLocaleString()}</td>
                    <td className="py-2 px-3 text-purple-700">{row.外购蒸汽量.toFixed(1)}</td>
                    <td className="py-2 px-3 text-rose-700">{row.油消耗量.toFixed(1)}</td>
                    <td className="py-2 px-3 text-indigo-700">{row.液氮消耗量.toFixed(2)}</td>
                    <td className="py-2 px-3 font-extrabold text-emerald-700">{row.综合能耗.toFixed(1)}</td>
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

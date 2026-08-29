'use client'

import React, { useState, useMemo } from 'react'
import {
  PieChart as PieChartIcon,
  Calendar,
  Download,
  Building2,
  Factory,
  Zap,
  Flame,
  Wind,
  Fuel,
  Snowflake,
  Droplets,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Sun,
  Layers,
  BarChart3,
  Percent,
  CheckCircle2,
  FileSpreadsheet,
  Info,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend, Donut, BarChartGroup } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 8 大能源介质定义
export type MetricKey =
  | 'totalTce'
  | 'totalElec'
  | 'gridElec'
  | 'greenElec'
  | 'gas'
  | 'steam'
  | 'oil'
  | 'nitrogen'
  | 'water'

interface MetricMeta {
  key: MetricKey
  name: string
  shortName: string
  unit: string
  tceFactor?: number // 折标煤系数
  color: string
  description: string
}

const METRICS_META: Record<MetricKey, MetricMeta> = {
  totalTce: {
    key: 'totalTce',
    name: '综合能源消耗总量',
    shortName: '综合能耗',
    unit: 'tce',
    color: '#059669',
    description: '全能源介质统一按国家标准折算标煤总量',
  },
  totalElec: {
    key: 'totalElec',
    name: '总用电量',
    shortName: '总电量',
    unit: '万kWh',
    tceFactor: 0.1229,
    color: '#1677ff',
    description: '市网供电与直供绿电总和',
  },
  gridElec: {
    key: 'gridElec',
    name: '市电量 (外购网电)',
    shortName: '市电量',
    unit: '万kWh',
    tceFactor: 0.1229,
    color: '#3b82f6',
    description: '从公共电网外购结算电力',
  },
  greenElec: {
    key: 'greenElec',
    name: '直供绿电量',
    shortName: '直供绿电',
    unit: '万kWh',
    tceFactor: 0.1229,
    color: '#10b981',
    description: '厂区分布式光伏及点对点绿色直供电',
  },
  gas: {
    key: 'gas',
    name: '天然气消耗量',
    shortName: '天然气',
    unit: '万m³',
    tceFactor: 1.2143,
    color: '#f59e0b',
    description: '窑炉、烘房及厂区采暖天然气消耗',
  },
  steam: {
    key: 'steam',
    name: '外购蒸汽量',
    shortName: '外购蒸汽',
    unit: 't',
    tceFactor: 0.0943,
    color: '#8b5cf6',
    description: '工业园区集中供热与工艺外购蒸汽',
  },
  oil: {
    key: 'oil',
    name: '油消耗量',
    shortName: '用油消耗',
    unit: '万L',
    tceFactor: 1.09,
    color: '#f43f5e',
    description: '厂区物流运输车辆及柴油发电机消耗',
  },
  nitrogen: {
    key: 'nitrogen',
    name: '液氮消耗量',
    shortName: '液氮消耗',
    unit: 't',
    tceFactor: 0.66,
    color: '#06b6d4',
    description: '变压器及特种绝缘干燥惰化工艺介质 (主要集中在露娜)',
  },
  water: {
    key: 'water',
    name: '工业用水量',
    shortName: '工业用水',
    unit: '万m³',
    color: '#0284c7',
    description: '生产循环冷却水与生活辅助用水',
  },
}

// 6 家直属经营单位/公司能耗数据字典
interface CompanyEnergyData {
  id: string
  name: string
  fullName: string
  province: string
  totalTce: number // tce
  totalElec: number // 万kWh
  gridElec: number // 万kWh
  greenElec: number // 万kWh
  gas: number // 万m³
  steam: number // t
  oil: number // 万L
  nitrogen: number // t
  water: number // 万m³
  nonFossilRatio: number // %
  greenElecRatio: number // %
}

const SIX_COMPANIES_DATA: CompanyEnergyData[] = [
  {
    id: 'comp_sb',
    name: '沈变公司',
    fullName: '特变电工沈阳变压器集团有限公司',
    province: '辽宁省 (沈阳)',
    totalTce: 38200,
    totalElec: 21500,
    gridElec: 13200,
    greenElec: 8300,
    gas: 880,
    steam: 11200,
    oil: 17.5,
    nitrogen: 0,
    water: 58.2,
    nonFossilRatio: 41.5,
    greenElecRatio: 38.6,
  },
  {
    id: 'comp_hb',
    name: '衡变公司',
    fullName: '特变电工衡阳变压器有限公司',
    province: '湖南省 (衡阳)',
    totalTce: 33600,
    totalElec: 18600,
    gridElec: 11500,
    greenElec: 7100,
    gas: 780,
    steam: 9800,
    oil: 15.0,
    nitrogen: 0,
    water: 51.5,
    nonFossilRatio: 40.2,
    greenElecRatio: 38.2,
  },
  {
    id: 'comp_xb',
    name: '新变厂',
    fullName: '特变电工新疆变压器厂',
    province: '新疆 (昌吉)',
    totalTce: 30500,
    totalElec: 17200,
    gridElec: 10200,
    greenElec: 7000,
    gas: 720,
    steam: 8600,
    oil: 14.0,
    nitrogen: 0,
    water: 46.0,
    nonFossilRatio: 43.8,
    greenElecRatio: 40.7,
  },
  {
    id: 'comp_ll',
    name: '鲁缆公司',
    fullName: '特变电工山东鲁能泰山电缆有限公司',
    province: '山东省 (新泰)',
    totalTce: 22800,
    totalElec: 13000,
    gridElec: 8600,
    greenElec: 4400,
    gas: 520,
    steam: 6500,
    oil: 10.5,
    nitrogen: 0,
    water: 35.8,
    nonFossilRatio: 36.5,
    greenElecRatio: 33.8,
  },
  {
    id: 'comp_ln',
    name: '露娜公司',
    fullName: '特变电工露娜智能电气有限公司',
    province: '天津市 (武清)',
    totalTce: 14240,
    totalElec: 7800,
    gridElec: 4800,
    greenElec: 3000,
    gas: 330,
    steam: 4100,
    oil: 6.5,
    nitrogen: 3040, // 特种液氮干燥工艺
    water: 21.2,
    nonFossilRatio: 44.2,
    greenElecRatio: 38.5,
  },
  {
    id: 'comp_xl',
    name: '新缆厂',
    fullName: '特变电工新疆电缆厂',
    province: '新疆 (乌鲁木齐)',
    totalTce: 12000,
    totalElec: 6100,
    gridElec: 3700,
    greenElec: 2400,
    gas: 220,
    steam: 2600,
    oil: 5.0,
    nitrogen: 0,
    water: 15.6,
    nonFossilRatio: 42.0,
    greenElecRatio: 39.3,
  },
]

// 全集团汇总数据
const GROUP_SUMMARY_DATA: CompanyEnergyData = {
  id: 'ent_root',
  name: '电装集团',
  fullName: '特变电工集团（全集团 6 大直属经营单位汇总）',
  province: '全国多基地汇总',
  totalTce: 151340,
  totalElec: 84200,
  gridElec: 52000,
  greenElec: 32200,
  gas: 3450,
  steam: 42800,
  oil: 68.5,
  nitrogen: 3040,
  water: 228.3,
  nonFossilRatio: 41.2,
  greenElecRatio: 38.2,
}

// 集团各类能源占比历史变化趋势 (01月 ~ 08月)
const GROUP_STRUCTURE_TREND = [
  { month: '01月', 市电占比: 44.5, 直供绿电占比: 23.8, 天然气占比: 28.2, 外购蒸汽占比: 2.8, 用油与液氮占比: 0.7 },
  { month: '02月', 市电占比: 44.1, 直供绿电占比: 24.2, 天然气占比: 28.0, 外购蒸汽占比: 3.0, 用油与液氮占比: 0.7 },
  { month: '03月', 市电占比: 43.5, 直供绿电占比: 25.0, 天然气占比: 27.8, 外购蒸汽占比: 2.9, 用油与液氮占比: 0.8 },
  { month: '04月', 市电占比: 42.8, 直供绿电占比: 25.6, 天然气占比: 27.9, 外购蒸汽占比: 2.9, 用油与液氮占比: 0.8 },
  { month: '05月', 市电占比: 42.2, 直供绿电占比: 26.1, 天然气占比: 28.0, 外购蒸汽占比: 2.9, 用油与液氮占比: 0.8 },
  { month: '06月', 市电占比: 41.8, 直供绿电占比: 26.5, 天然气占比: 28.0, 外购蒸汽占比: 2.9, 用油与液氮占比: 0.8 },
  { month: '07月', 市电占比: 41.5, 直供绿电占比: 26.8, 天然气占比: 28.1, 外购蒸汽占比: 2.8, 用油与液氮占比: 0.8 },
  { month: '08月', 市电占比: 41.2, 直供绿电占比: 27.1, 天然气占比: 28.1, 外购蒸汽占比: 2.8, 用油与液氮占比: 0.8 },
]

export default function EnergyStructureAnalysisPage() {
  // 左侧组织拓扑树节点状态
  const [selectedOrgNode, setSelectedOrgNode] = useState<StandardOrgNode>({
    id: 'ent_root',
    name: '电装集团',
    fullName: '电装集团',
    level: 'group',
    badge: '全集团汇总',
  })

  // 时间维度
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  // 🌟 集团页当前选中的数据项 (用于驱动 6 家单位占电装总量的比重：饼图 + 柱状图)
  const [selectedMetricKey, setSelectedMetricKey] = useState<MetricKey>('totalTce')

  // 判断是否处于集团层级
  const isGroupLevel = useMemo(() => {
    return (
      selectedOrgNode.id === 'ent_root' ||
      selectedOrgNode.id === 'group_root' ||
      selectedOrgNode.level === 'group' ||
      selectedOrgNode.name.includes('电装集团')
    )
  }, [selectedOrgNode])

  // 当前选中的公司数据 (如果在经营单位/项目公司层级)
  const currentCompanyData = useMemo(() => {
    if (isGroupLevel) return GROUP_SUMMARY_DATA
    const found = SIX_COMPANIES_DATA.find(
      (c) =>
        c.id === selectedOrgNode.id ||
        c.name === selectedOrgNode.name ||
        selectedOrgNode.name.includes(c.name.slice(0, 2))
    )
    return found || SIX_COMPANIES_DATA[0]
  }, [isGroupLevel, selectedOrgNode])

  // 1. 集团页：计算 6 家单位在当前选中指标下的数值与占比 (用于饼图与柱状图)
  const metricCompanyBreakdown = useMemo(() => {
    const totalVal = SIX_COMPANIES_DATA.reduce((sum, c) => sum + (c[selectedMetricKey] as number), 0)
    const unit = METRICS_META[selectedMetricKey].unit

    const donutData = SIX_COMPANIES_DATA.map((c, i) => {
      const val = c[selectedMetricKey] as number
      const ratio = totalVal > 0 ? Number(((val / totalVal) * 100).toFixed(1)) : 0
      const colors = ['#1677ff', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899']
      return {
        name: c.name,
        value: val,
        ratio,
        color: colors[i % colors.length],
        unit,
      }
    })

    const barData = SIX_COMPANIES_DATA.map((c) => {
      const val = c[selectedMetricKey] as number
      const ratio = totalVal > 0 ? Number(((val / totalVal) * 100).toFixed(1)) : 0
      return {
        name: c.name,
        消耗量: val,
        占比: ratio,
      }
    })

    return { totalVal, donutData, barData, unit }
  }, [selectedMetricKey])

  // 2. 经营单位页：计算该单位自身用能结构占比 (各能源介质折标煤与占比)
  const companyStructureDonutData = useMemo(() => {
    const data = currentCompanyData
    const gridElecTce = (data.gridElec * 10000 * 0.1229) / 1000
    const greenElecTce = (data.greenElec * 10000 * 0.1229) / 1000
    const gasTce = (data.gas * 10000 * 1.2143) / 1000
    const steamTce = data.steam * 0.0943
    const oilTce = (data.oil * 10000 * 1.09) / 1000
    const nitrogenTce = (data.nitrogen * 1000 * 0.66) / 1000

    const total = gridElecTce + greenElecTce + gasTce + steamTce + oilTce + nitrogenTce

    const items = [
      { name: '市网供电', value: Number(gridElecTce.toFixed(1)), color: '#3b82f6', ratio: Number(((gridElecTce / total) * 100).toFixed(1)) },
      { name: '直供绿电', value: Number(greenElecTce.toFixed(1)), color: '#10b981', ratio: Number(((greenElecTce / total) * 100).toFixed(1)) },
      { name: '天然气', value: Number(gasTce.toFixed(1)), color: '#f59e0b', ratio: Number(((gasTce / total) * 100).toFixed(1)) },
      { name: '外购蒸汽', value: Number(steamTce.toFixed(1)), color: '#8b5cf6', ratio: Number(((steamTce / total) * 100).toFixed(1)) },
      { name: '用油消耗', value: Number(oilTce.toFixed(1)), color: '#f43f5e', ratio: Number(((oilTce / total) * 100).toFixed(1)) },
    ]

    if (nitrogenTce > 0) {
      items.push({ name: '液氮消耗', value: Number(nitrogenTce.toFixed(1)), color: '#06b6d4', ratio: Number(((nitrogenTce / total) * 100).toFixed(1)) })
    }

    return items
  }, [currentCompanyData])

  // 3. 经营单位页：该单位各类能源占比历史变化趋势
  const companyStructureTrend = useMemo(() => {
    const baseGreen = currentCompanyData.greenElecRatio
    return [
      { month: '01月', 市电占比: 45.2, 直供绿电占比: Number((baseGreen - 2.8).toFixed(1)), 天然气占比: 26.5, 外购蒸汽占比: 3.2, 用油及其他: 1.1 },
      { month: '02月', 市电占比: 44.8, 直供绿电占比: Number((baseGreen - 2.2).toFixed(1)), 天然气占比: 26.3, 外购蒸汽占比: 3.1, 用油及其他: 1.0 },
      { month: '03月', 市电占比: 44.0, 直供绿电占比: Number((baseGreen - 1.5).toFixed(1)), 天然气占比: 26.1, 外购蒸汽占比: 3.0, 用油及其他: 1.0 },
      { month: '04月', 市电占比: 43.5, 直供绿电占比: Number((baseGreen - 0.8).toFixed(1)), 天然气占比: 26.0, 外购蒸汽占比: 3.0, 用油及其他: 1.0 },
      { month: '05月', 市电占比: 42.8, 直供绿电占比: Number((baseGreen - 0.3).toFixed(1)), 天然气占比: 25.9, 外购蒸汽占比: 3.0, 用油及其他: 1.0 },
      { month: '06月', 市电占比: 42.1, 直供绿电占比: Number(baseGreen.toFixed(1)), 天然气占比: 25.8, 外购蒸汽占比: 3.0, 用油及其他: 1.0 },
      { month: '07月', 市电占比: 41.6, 直供绿电占比: Number((baseGreen + 0.5).toFixed(1)), 天然气占比: 25.8, 外购蒸汽占比: 2.9, 用油及其他: 1.0 },
      { month: '08月', 市电占比: 41.2, 直供绿电占比: Number((baseGreen + 0.8).toFixed(1)), 天然气占比: 25.8, 外购蒸汽占比: 2.9, 用油及其他: 1.0 },
    ]
  }, [currentCompanyData])

  const activeData = isGroupLevel ? GROUP_SUMMARY_DATA : currentCompanyData

  return (
    <div className="flex gap-3.5 items-start font-sans text-slate-800">
      {/* 左侧 270px 经典工业级组织拓扑树 (支持集团、各经营单位及工厂选择) */}
      <StandardOrgTree
        treeType="factory"
        selectedId={selectedOrgNode.id}
        onSelect={(node) => setSelectedOrgNode(node)}
      />

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* 1. 顶部 Header 与 统一时间维度选择 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <PieChartIcon className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-800">用能结构分析</h1>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-bold font-sans',
                    isGroupLevel ? 'bg-blue-50 text-[#1677ff]' : 'bg-emerald-50 text-emerald-700'
                  )}
                >
                  {isGroupLevel ? '集团管控视角 (全集团 6 大单位)' : `${activeData.name} 经营视角`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 时间维度统一 (月度 / 季度 / 年度) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                月度
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('quarter')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'quarter' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                季度
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('year')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'year' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                年度
              </button>
            </div>

            {/* 时间范围选择控件 (随维度自适应切换) */}
            {timeDim === 'month' && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs font-mono">
                <Calendar className="size-3.5 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonthRange.start}
                  onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="bg-transparent border-0 text-slate-700 text-xs focus:outline-none cursor-pointer"
                  title="起始月份"
                />
                <span className="text-slate-400 font-sans">至</span>
                <input
                  type="month"
                  value={selectedMonthRange.end}
                  onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="bg-transparent border-0 text-slate-700 text-xs focus:outline-none cursor-pointer"
                  title="结束月份"
                />
              </div>
            )}

            {timeDim === 'quarter' && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
                <Calendar className="size-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="2026-Q1">2026年 第1季度 (Q1)</option>
                  <option value="2026-Q2">2026年 第2季度 (Q2)</option>
                  <option value="2026-Q3">2026年 第3季度 (Q3)</option>
                  <option value="2026-Q4">2026年 第4季度 (Q4)</option>
                  <option value="2025-Q4">2025年 第4季度 (Q4)</option>
                </select>
              </div>
            )}

            {timeDim === 'year' && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
                <Calendar className="size-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="2026">2026 年度</option>
                  <option value="2025">2025 年度</option>
                  <option value="2024">2024 年度</option>
                </select>
              </div>
            )}

            {/* 导出按钮 */}
            <button
              type="button"
              onClick={() => alert(`正在导出【${activeData.name}】用能结构多维分析报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 1. 核心数据项大盘卡片 (电包括：总电量、市电、直供绿电，点击可联动分析) */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-[#1677ff]" />
              <span>综合能源消耗与各类型能源构成</span>
            </span>
            {isGroupLevel && (
              <span className="text-[11px] text-[#1677ff] font-sans font-medium flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                当前选中分析项: <strong>{METRICS_META[selectedMetricKey].name}</strong>
              </span>
            )}
          </div>

          {/* 8 大能源介质卡片网格 (2行4列 + 综合能耗核心首卡) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 font-mono">
            {/* 卡片 1: 综合能源消耗总量 (tce) */}
            <div
              onClick={() => isGroupLevel && setSelectedMetricKey('totalTce')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                isGroupLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'totalTce' && isGroupLevel
                  ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 font-sans">
                  <div className="size-2 rounded-full bg-emerald-500" />
                  综合能源消耗
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-emerald-700 truncate">
                {activeData.totalTce.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">tce</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>非化石能源占比</span>
                <span className="font-mono font-bold text-emerald-700">{activeData.nonFossilRatio}%</span>
              </div>
            </div>

            {/* 卡片 2: 总用电量 (万kWh) */}
            <div
              onClick={() => isGroupLevel && setSelectedMetricKey('totalElec')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                isGroupLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'totalElec' && isGroupLevel
                  ? 'bg-blue-50/40 border-[#1677ff] ring-2 ring-blue-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5 font-sans">
                  <Zap className="size-3.5 text-[#1677ff]" />
                  总用电量
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-[#1677ff] truncate">
                {activeData.totalElec.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万kWh</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>折标 / 占综合能耗</span>
                <span className="font-mono font-bold text-slate-700">
                  {((activeData.totalElec * 10000 * 0.1229) / 1000).toFixed(0)} tce (
                  {(((activeData.totalElec * 10000 * 0.1229) / 1000 / activeData.totalTce) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* 卡片 3: 市电量 (外购) (万kWh) */}
            <div
              onClick={() => isGroupLevel && setSelectedMetricKey('gridElec')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                isGroupLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'gridElec' && isGroupLevel
                  ? 'bg-blue-50/40 border-blue-500 ring-2 ring-blue-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Building2 className="size-3.5 text-slate-600" />
                  市电量 (外购网电)
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-slate-800 truncate">
                {activeData.gridElec.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万kWh</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>占总电量比重</span>
                <span className="font-mono font-bold text-slate-700">
                  {((activeData.gridElec / activeData.totalElec) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* 卡片 4: 直供绿电量 (万kWh) */}
            <div
              onClick={() => isGroupLevel && setSelectedMetricKey('greenElec')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                isGroupLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'greenElec' && isGroupLevel
                  ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 font-sans">
                  <Sun className="size-3.5 text-emerald-600" />
                  直供绿电量
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-emerald-600 truncate">
                {activeData.greenElec.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万kWh</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>绿电消纳占比</span>
                <span className="font-mono font-bold text-emerald-700">
                  {activeData.greenElecRatio}%
                </span>
              </div>
            </div>

            {/* 卡片 5: 天然气消耗量 (万m³) */}
            <div
              onClick={() => isGroupLevel && setSelectedMetricKey('gas')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                isGroupLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'gas' && isGroupLevel
                  ? 'bg-amber-50/40 border-amber-500 ring-2 ring-amber-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Flame className="size-3.5 text-amber-500" />
                  天然气消耗量
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-amber-600 truncate">
                {activeData.gas.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万m³</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>折标 / 占综合能耗</span>
                <span className="font-mono font-bold text-slate-700">
                  {((activeData.gas * 10000 * 1.2143) / 1000).toFixed(0)} tce (
                  {(((activeData.gas * 10000 * 1.2143) / 1000 / activeData.totalTce) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* 卡片 6: 外购蒸汽量 (t) */}
            <div
              onClick={() => isGroupLevel && setSelectedMetricKey('steam')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                isGroupLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'steam' && isGroupLevel
                  ? 'bg-purple-50/40 border-purple-500 ring-2 ring-purple-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Wind className="size-3.5 text-purple-500" />
                  外购蒸汽量
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-purple-600 truncate">
                {activeData.steam.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">t</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>折标 / 占综合能耗</span>
                <span className="font-mono font-bold text-slate-700">
                  {(activeData.steam * 0.0943).toFixed(0)} tce (
                  {(((activeData.steam * 0.0943) / activeData.totalTce) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* 卡片 7: 油消耗量 (万L) */}
            <div
              onClick={() => isGroupLevel && setSelectedMetricKey('oil')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                isGroupLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'oil' && isGroupLevel
                  ? 'bg-rose-50/40 border-rose-500 ring-2 ring-rose-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Fuel className="size-3.5 text-rose-500" />
                  油消耗量
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-rose-600 truncate">
                {activeData.oil.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万L</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>折标 / 占综合能耗</span>
                <span className="font-mono font-bold text-slate-700">
                  {((activeData.oil * 10000 * 1.09) / 1000).toFixed(0)} tce (
                  {(((activeData.oil * 10000 * 1.09) / 1000 / activeData.totalTce) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* 卡片 8: 液氮消耗量 (t) */}
            <div
              onClick={() => isGroupLevel && setSelectedMetricKey('nitrogen')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                isGroupLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'nitrogen' && isGroupLevel
                  ? 'bg-cyan-50/40 border-cyan-500 ring-2 ring-cyan-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Snowflake className="size-3.5 text-cyan-500" />
                  液氮消耗量
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-cyan-600 truncate">
                {activeData.nitrogen.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">t</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>主要工艺单位</span>
                <span className="font-sans font-bold text-slate-700">
                  {activeData.nitrogen > 0 ? '露娜公司 (100%)' : '0 (无液氮项)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 2. 集团页视角：点击各数据项展示 6 家单位占电装总量的比重 (饼图 + 柱状图) */}
        {/* ========================================================================= */}
        {isGroupLevel && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-900">
                  【{METRICS_META[selectedMetricKey].name}】各直属单位占比与消耗对比
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                点击上方任意卡片可切换分析指标
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 左侧 5/12: 饼图/环形图 (6 家单位占比份额) */}
              <div className="lg:col-span-5 border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <PieChartIcon className="size-3.5 text-[#1677ff]" />
                    6 家单位比重饼图 (份额 %)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    总量: {metricCompanyBreakdown.totalVal.toLocaleString()} {metricCompanyBreakdown.unit}
                  </span>
                </div>
                <div className="h-[230px]">
                  <Donut
                    data={metricCompanyBreakdown.donutData}
                    valueKey="value"
                    nameKey="name"
                    height={230}
                    unit={metricCompanyBreakdown.unit}
                  />
                </div>
              </div>

              {/* 右侧 7/12: 柱状图 (6 家单位消耗量绝对值与排名对比) */}
              <div className="lg:col-span-7 border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <BarChart3 className="size-3.5 text-emerald-600" />
                    6 家单位消耗数值横向对比 ({metricCompanyBreakdown.unit})
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">柱状图对比</span>
                </div>
                <div className="h-[230px]">
                  <BarChartGroup
                    data={metricCompanyBreakdown.barData}
                    xKey="name"
                    height={230}
                    bars={[
                      { key: '消耗量', name: `${METRICS_META[selectedMetricKey].shortName} (${metricCompanyBreakdown.unit})`, color: METRICS_META[selectedMetricKey].color },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* 6 家单位数据明细表格 */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold font-sans">
                      <th className="py-2 px-3">序号</th>
                      <th className="py-2 px-3">直属经营单位</th>
                      <th className="py-2 px-3">所属基地与电网</th>
                      <th className="py-2 px-3 text-[#1677ff]">
                        {METRICS_META[selectedMetricKey].name} ({metricCompanyBreakdown.unit})
                      </th>
                      <th className="py-2 px-3 font-bold text-emerald-700">占全集团比重 (%)</th>
                      <th className="py-2 px-3">非化石能源占比 (%)</th>
                      <th className="py-2 px-3">绿电消纳率 (%)</th>
                      <th className="py-2 px-3 text-right">穿透操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {SIX_COMPANIES_DATA.map((comp, idx) => {
                      const val = comp[selectedMetricKey] as number
                      const ratio = metricCompanyBreakdown.totalVal > 0 ? ((val / metricCompanyBreakdown.totalVal) * 100).toFixed(1) : '0.0'
                      return (
                        <tr key={comp.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2 px-3 font-semibold text-slate-400">{idx + 1}</td>
                          <td className="py-2 px-3 font-bold text-slate-900 font-sans flex items-center gap-1.5">
                            <Factory className="size-3.5 text-slate-500" />
                            {comp.name}
                          </td>
                          <td className="py-2 px-3 font-sans text-slate-500">{comp.province}</td>
                          <td className="py-2 px-3 font-bold text-[#1677ff]">{val.toLocaleString()}</td>
                          <td className="py-2 px-3 font-extrabold text-emerald-700">{ratio}%</td>
                          <td className="py-2 px-3">{comp.nonFossilRatio}%</td>
                          <td className="py-2 px-3">{comp.greenElecRatio}%</td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrgNode({
                                  id: comp.id,
                                  name: comp.name,
                                  fullName: comp.fullName,
                                  level: 'company',
                                })
                              }}
                              className="text-[11px] text-[#1677ff] hover:underline font-sans font-medium cursor-pointer"
                            >
                              查看该单位用能结构 →
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🌟 3. 经营单位及项目公司视角：该单位自身用能结构占比分析 (移至趋势图上方) */}
        {/* ========================================================================= */}
        {!isGroupLevel && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-900">
                  各类能源介质消费构成占比与折标煤对照明细
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {activeData.province} · 综合折标 {activeData.totalTce.toLocaleString()} tce
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 左侧 5/12: 该单位能源结构环形图 */}
              <div className="lg:col-span-5 border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <PieChartIcon className="size-3.5 text-[#1677ff]" />
                    用能构成占比 (按折标煤 tce 统计)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-mono font-bold">
                    非化石占比 {activeData.nonFossilRatio}%
                  </span>
                </div>
                <div className="h-[220px]">
                  <Donut
                    data={companyStructureDonutData}
                    valueKey="value"
                    nameKey="name"
                    height={220}
                    unit="tce"
                  />
                </div>
              </div>

              {/* 右侧 7/12: 各介质折标明细台账 */}
              <div className="lg:col-span-7 border border-slate-200/80 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold font-sans">
                      <th className="py-2.5 px-3">能源介质名称</th>
                      <th className="py-2.5 px-3">实物消耗量</th>
                      <th className="py-2.5 px-3">折标系数</th>
                      <th className="py-2.5 px-3 text-[#1677ff]">折标煤量 (tce)</th>
                      <th className="py-2.5 px-3 font-bold text-emerald-700">占该单位用能比重</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-blue-50/30">
                      <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5">
                        <Building2 className="size-3 text-slate-600" />
                        市网供电 (外购)
                      </td>
                      <td className="py-2 px-3">{activeData.gridElec.toLocaleString()} 万kWh</td>
                      <td className="py-2 px-3 text-slate-400">0.1229 kgce/kWh</td>
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {((activeData.gridElec * 10000 * 0.1229) / 1000).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-[#1677ff]">
                        {(((activeData.gridElec * 10000 * 0.1229) / 1000 / activeData.totalTce) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="hover:bg-emerald-50/30">
                      <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5 text-emerald-900">
                        <Sun className="size-3 text-emerald-600" />
                        直供绿电 (分布式光伏)
                      </td>
                      <td className="py-2 px-3 text-emerald-700">{activeData.greenElec.toLocaleString()} 万kWh</td>
                      <td className="py-2 px-3 text-slate-400">0.1229 kgce/kWh</td>
                      <td className="py-2 px-3 font-bold text-emerald-700">
                        {((activeData.greenElec * 10000 * 0.1229) / 1000).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-emerald-700">
                        {(((activeData.greenElec * 10000 * 0.1229) / 1000 / activeData.totalTce) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="hover:bg-amber-50/30">
                      <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5">
                        <Flame className="size-3 text-amber-500" />
                        天然气消耗
                      </td>
                      <td className="py-2 px-3">{activeData.gas.toLocaleString()} 万m³</td>
                      <td className="py-2 px-3 text-slate-400">1.2143 kgce/m³</td>
                      <td className="py-2 px-3 font-bold text-amber-600">
                        {((activeData.gas * 10000 * 1.2143) / 1000).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-amber-700">
                        {(((activeData.gas * 10000 * 1.2143) / 1000 / activeData.totalTce) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="hover:bg-purple-50/30">
                      <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5">
                        <Wind className="size-3 text-purple-500" />
                        外购蒸汽
                      </td>
                      <td className="py-2 px-3">{activeData.steam.toLocaleString()} t</td>
                      <td className="py-2 px-3 text-slate-400">0.0943 kgce/kg</td>
                      <td className="py-2 px-3 font-bold text-purple-600">
                        {(activeData.steam * 0.0943).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-purple-700">
                        {(((activeData.steam * 0.0943) / activeData.totalTce) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="hover:bg-rose-50/30">
                      <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5">
                        <Fuel className="size-3 text-rose-500" />
                        用油消耗
                      </td>
                      <td className="py-2 px-3">{activeData.oil.toLocaleString()} 万L</td>
                      <td className="py-2 px-3 text-slate-400">1.09 kgce/L</td>
                      <td className="py-2 px-3 font-bold text-rose-600">
                        {((activeData.oil * 10000 * 1.09) / 1000).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-rose-700">
                        {(((activeData.oil * 10000 * 1.09) / 1000 / activeData.totalTce) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    {activeData.nitrogen > 0 && (
                      <tr className="hover:bg-cyan-50/30">
                        <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5">
                          <Snowflake className="size-3 text-cyan-500" />
                          液氮消耗
                        </td>
                        <td className="py-2 px-3">{activeData.nitrogen.toLocaleString()} t</td>
                        <td className="py-2 px-3 text-slate-400">0.66 kgce/kg</td>
                        <td className="py-2 px-3 font-bold text-cyan-600">
                          {((activeData.nitrogen * 1000 * 0.66) / 1000).toFixed(1)}
                        </td>
                        <td className="py-2 px-3 font-extrabold text-cyan-700">
                          {(((activeData.nitrogen * 1000 * 0.66) / 1000 / activeData.totalTce) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🌟 4. 各类能源占比的变化趋势 (集团页 & 经营单位页均包含，置于下方)          */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold text-slate-900">
                01月 至 08月 各类能源占比历史变化趋势曲线 (%)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-sans text-slate-500">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#1677ff]" /> 市电占比</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" /> 直供绿电占比</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" /> 天然气占比</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-purple-500" /> 外购蒸汽占比</span>
            </div>
          </div>

          <div className="h-[260px]">
            <LineTrend
              data={isGroupLevel ? GROUP_STRUCTURE_TREND : companyStructureTrend}
              xKey="month"
              height={260}
              yUnit="%"
              lines={[
                { key: '市电占比', name: '市网供电占比 (%)', color: '#1677ff' },
                { key: '直供绿电占比', name: '直供绿电占比 (%)', color: '#10b981' },
                { key: '天然气占比', name: '天然气占比 (%)', color: '#f59e0b' },
                { key: '外购蒸汽占比', name: '外购蒸汽占比 (%)', color: '#8b5cf6' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

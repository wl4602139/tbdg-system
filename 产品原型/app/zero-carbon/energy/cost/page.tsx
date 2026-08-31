'use client'

import React, { useState, useMemo } from 'react'
import {
  DollarSign,
  Coins,
  Zap,
  Flame,
  Wind,
  Fuel,
  Snowflake,
  Droplets,
  Calendar,
  Download,
  Building2,
  Factory,
  TrendingDown,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Maximize2,
  X,
  Info,
  ChevronRight,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend, Donut, BarChartGroup } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 能源成本指标类型定义
export type CostMetricKey =
  | 'totalCost'
  | 'gridElecCost'
  | 'gasCost'
  | 'steamCost'
  | 'oilCost'
  | 'nitrogenCost'
  | 'waterCost'

interface CostMetricMeta {
  key: CostMetricKey
  name: string
  shortName: string
  unit: string
  color: string
  description: string
}

const COST_METRICS_META: Record<CostMetricKey, CostMetricMeta> = {
  totalCost: {
    key: 'totalCost',
    name: '总用能成本',
    shortName: '总成本',
    unit: '万元',
    color: '#059669',
    description: '全厂区所有能源介质外购与消费总支出',
  },
  gridElecCost: {
    key: 'gridElecCost',
    name: '市电成本 (外购市电)',
    shortName: '市电成本',
    unit: '万元',
    color: '#1677ff',
    description: '从公共电网外购结算的电力总费用',
  },
  gasCost: {
    key: 'gasCost',
    name: '天然气成本',
    shortName: '天然气费',
    unit: '万元',
    color: '#f59e0b',
    description: '管道天然气用气采购与燃料支出',
  },
  steamCost: {
    key: 'steamCost',
    name: '外购蒸汽热力成本',
    shortName: '蒸汽费用',
    unit: '万元',
    color: '#8b5cf6',
    description: '工业园区集中供热与工艺外购蒸汽费用',
  },
  oilCost: {
    key: 'oilCost',
    name: '用油动力成本',
    shortName: '燃油费用',
    unit: '万元',
    color: '#f43f5e',
    description: '厂区物流运输车辆及发电机柴汽油消费',
  },
  nitrogenCost: {
    key: 'nitrogenCost',
    name: '工艺液氮成本',
    shortName: '液氮费用',
    unit: '万元',
    color: '#06b6d4',
    description: '特种绝缘干燥与工艺惰化液氮采购支出',
  },
  waterCost: {
    key: 'waterCost',
    name: '水资源成本 (ESG)',
    shortName: '水费支出',
    unit: '万元',
    color: '#0284c7',
    description: '生产循环水与生活辅助用水费用',
  },
}

// 6 家直属经营单位能源成本数据字典 (单位：万元)
interface CompanyCostData {
  id: string
  name: string
  fullName: string
  province: string
  totalCost: number // 万元
  gridElecCost: number // 万元 (明确为市电)
  gasCost: number // 万元
  steamCost: number // 万元
  oilCost: number // 万元
  nitrogenCost: number // 万元
  waterCost: number // 万元
  elecRatio: number // %
  yoyTrend: number // 同比 %
}

const SIX_COMPANIES_COST: CompanyCostData[] = [
  {
    id: 'comp_sb',
    name: '沈变公司',
    fullName: '特变电工沈阳变压器集团有限公司',
    province: '辽宁省 (沈阳)',
    totalCost: 762.5,
    gridElecCost: 605.0,
    gasCost: 98.0,
    steamCost: 38.5,
    oilCost: 16.0,
    nitrogenCost: 0,
    waterCost: 5.0,
    elecRatio: 79.3,
    yoyTrend: -3.2,
  },
  {
    id: 'comp_hb',
    name: '衡变公司',
    fullName: '特变电工衡阳变压器有限公司',
    province: '湖南省 (衡阳)',
    totalCost: 685.0,
    gridElecCost: 542.0,
    gasCost: 86.0,
    steamCost: 34.0,
    oilCost: 14.0,
    nitrogenCost: 0,
    waterCost: 4.2,
    elecRatio: 79.1,
    yoyTrend: -2.8,
  },
  {
    id: 'comp_xb',
    name: '新变厂',
    fullName: '特变电工新疆变压器厂',
    province: '新疆 (昌吉)',
    totalCost: 590.2,
    gridElecCost: 470.0,
    gasCost: 74.0,
    steamCost: 30.0,
    oilCost: 12.5,
    nitrogenCost: 0,
    waterCost: 3.7,
    elecRatio: 79.6,
    yoyTrend: -3.5,
  },
  {
    id: 'comp_ll',
    name: '鲁缆公司',
    fullName: '特变电工山东鲁能泰山电缆有限公司',
    province: '山东省 (新泰)',
    totalCost: 420.8,
    gridElecCost: 338.0,
    gasCost: 52.0,
    steamCost: 21.0,
    oilCost: 8.0,
    nitrogenCost: 0,
    waterCost: 2.6,
    elecRatio: 80.3,
    yoyTrend: -1.9,
  },
  {
    id: 'comp_ln',
    name: '露娜公司',
    fullName: '特变电工露娜智能电气有限公司',
    province: '天津市 (武清)',
    totalCost: 360.5,
    gridElecCost: 265.0,
    gasCost: 43.0,
    steamCost: 14.5,
    oilCost: 6.5,
    nitrogenCost: 36.0, // 仅露娜包含液氮
    waterCost: 1.8,
    elecRatio: 73.5,
    yoyTrend: -4.1,
  },
  {
    id: 'comp_xl',
    name: '新缆厂',
    fullName: '特变电工新疆电缆厂',
    province: '新疆 (乌鲁木齐)',
    totalCost: 312.0,
    gridElecCost: 262.0,
    gasCost: 32.0,
    steamCost: 10.0,
    oilCost: 5.0,
    nitrogenCost: 0,
    waterCost: 1.4,
    elecRatio: 84.0,
    yoyTrend: -2.4,
  },
]

// 全集团汇总成本数据
const GROUP_SUMMARY_COST: CompanyCostData = {
  id: 'ent_root',
  name: '电装集团',
  fullName: '特变电工集团（全集团 6 大直属经营单位汇总）',
  province: '全国多基地汇总',
  totalCost: 3131.0,
  gridElecCost: 2482.0,
  gasCost: 385.0,
  steamCost: 148.0,
  oilCost: 62.0,
  nitrogenCost: 36.0,
  waterCost: 18.0,
  elecRatio: 79.3,
  yoyTrend: -3.0,
}

// 集团各类能源成本占比历史变化趋势 (01月 ~ 08月)
const GROUP_COST_STRUCTURE_TREND = [
  { month: '01月', 市电成本占比: 81.5, 天然气成本占比: 11.8, 蒸汽成本占比: 4.5, 用油与其他: 2.2 },
  { month: '02月', 市电成本占比: 81.0, 天然气成本占比: 12.0, 蒸汽成本占比: 4.7, 用油与其他: 2.3 },
  { month: '03月', 市电占比: 80.4, 天然气成本占比: 12.2, 蒸汽成本占比: 4.8, 用油与其他: 2.6 },
  { month: '04月', 市电成本占比: 79.9, 天然气成本占比: 12.4, 蒸汽成本占比: 4.9, 用油与其他: 2.8 },
  { month: '05月', 市电成本占比: 79.5, 天然气成本占比: 12.3, 蒸汽成本占比: 4.8, 用油与其他: 3.4 },
  { month: '06月', 市电成本占比: 79.2, 天然气成本占比: 12.3, 蒸汽成本占比: 4.8, 用油与其他: 3.7 },
  { month: '07月', 市电成本占比: 79.4, 天然气成本占比: 12.2, 蒸汽成本占比: 4.7, 用油与其他: 3.7 },
  { month: '08月', 市电成本占比: 79.3, 天然气成本占比: 12.3, 蒸汽成本占比: 4.7, 用油与其他: 3.7 },
]

export default function EnergyCostPage() {
  // 左侧组织拓扑树节点状态
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
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

  // 🌟 当前选中的成本数据项 (驱动 6 家单位占电装总费用比重：饼图 + 柱状图)
  const [selectedMetricKey, setSelectedMetricKey] = useState<CostMetricKey>('totalCost')

  // 南丁格尔玫瑰图悬浮扇区
  const [activeHoverSector, setActiveHoverSector] = useState<string | null>(null)
  // 明细弹窗
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // 判断是否处于集团层级
  const isGroupLevel = useMemo(() => {
    return (
      selectedNode.id === 'ent_root' ||
      selectedNode.id === 'group_root' ||
      selectedNode.level === 'group' ||
      selectedNode.name.includes('电装集团')
    )
  }, [selectedNode])

  // 判断是否是车间/项目公司级
  const isWorkshopLevel = useMemo(() => {
    return selectedNode.level === 'workshop'
  }, [selectedNode])

  // 当前选中的公司数据
  const currentCompanyCost = useMemo(() => {
    if (isGroupLevel) return GROUP_SUMMARY_COST
    const found = SIX_COMPANIES_COST.find(
      (c) =>
        c.id === selectedNode.id ||
        c.name === selectedNode.name ||
        selectedNode.name.includes(c.name.slice(0, 2))
    )
    return found || SIX_COMPANIES_COST[0]
  }, [isGroupLevel, selectedNode])

  // 1. 计算 6 家单位在当前选中成本指标下的数值与占比 (用于饼图与柱状图)
  const metricCompanyBreakdown = useMemo(() => {
    const totalVal = SIX_COMPANIES_COST.reduce((sum, c) => sum + (c[selectedMetricKey] as number), 0)
    const unit = COST_METRICS_META[selectedMetricKey].unit

    const donutData = SIX_COMPANIES_COST.map((c, i) => {
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

    const barData = SIX_COMPANIES_COST.map((c) => {
      const val = c[selectedMetricKey] as number
      const ratio = totalVal > 0 ? Number(((val / totalVal) * 100).toFixed(1)) : 0
      return {
        name: c.name,
        成本费用: val,
        占比: ratio,
      }
    })

    return { totalVal, donutData, barData, unit }
  }, [selectedMetricKey])

  // 2. 经营单位页成本占比走势
  const companyCostTrend = useMemo(() => {
    const baseElec = currentCompanyCost.elecRatio
    return [
      { month: '01月', 市电成本占比: Number((baseElec + 2.2).toFixed(1)), 天然气成本占比: 11.5, 蒸汽成本占比: 4.5, 用油与其他: 1.8 },
      { month: '02月', 市电成本占比: Number((baseElec + 1.8).toFixed(1)), 天然气成本占比: 11.8, 蒸汽成本占比: 4.6, 用油与其他: 2.0 },
      { month: '03月', 市电成本占比: Number((baseElec + 1.0).toFixed(1)), 天然气成本占比: 12.0, 蒸汽成本占比: 4.8, 用油与其他: 2.2 },
      { month: '04月', 市电成本占比: Number((baseElec + 0.5).toFixed(1)), 天然气成本占比: 12.2, 蒸汽成本占比: 4.9, 用油与其他: 2.4 },
      { month: '05月', 市电成本占比: Number(baseElec.toFixed(1)), 天然气成本占比: 12.3, 蒸汽成本占比: 4.8, 用油与其他: 2.9 },
      { month: '06月', 市电成本占比: Number((baseElec - 0.3).toFixed(1)), 天然气成本占比: 12.4, 蒸汽成本占比: 4.8, 用油与其他: 3.1 },
      { month: '07月', 市电成本占比: Number((baseElec - 0.2).toFixed(1)), 天然气成本占比: 12.3, 蒸汽成本占比: 4.8, 用油与其他: 3.1 },
      { month: '08月', 市电成本占比: Number(baseElec.toFixed(1)), 天然气成本占比: 12.3, 蒸汽成本占比: 4.7, 用油与其他: 3.0 },
    ]
  }, [currentCompanyCost])

  const activeData = isGroupLevel ? GROUP_SUMMARY_COST : currentCompanyCost

  // 计算当前视角的成本比例
  const costRatios = useMemo(() => {
    const total = activeData.totalCost || 1
    return {
      elecRatio: ((activeData.gridElecCost / total) * 100).toFixed(1),
      gasRatio: ((activeData.gasCost / total) * 100).toFixed(1),
      steamRatio: ((activeData.steamCost / total) * 100).toFixed(1),
      oilRatio: ((activeData.oilCost / total) * 100).toFixed(1),
      nitrogenRatio: ((activeData.nitrogenCost / total) * 100).toFixed(1),
      waterRatio: ((activeData.waterCost / total) * 100).toFixed(1),
    }
  }, [activeData])

  return (
    <div className="flex gap-3.5 items-start font-sans text-slate-800">
      {/* 🌟 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        treeType="factory"
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* 1. 顶部 Header 与 统一时间筛选 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <DollarSign className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-800">能源成本分析</h1>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-bold font-sans',
                    isGroupLevel
                      ? 'bg-blue-50 text-[#1677ff]'
                      : isWorkshopLevel
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-emerald-50 text-emerald-700'
                  )}
                >
                  {isGroupLevel
                    ? '集团管控视角 (全集团 6 大经营单位)'
                    : isWorkshopLevel
                    ? `${activeData.name} 项目公司/工厂视角`
                    : `${activeData.name} 经营单位视角`}
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

            <button
              type="button"
              onClick={() => alert(`正在导出【${activeData.name}】能源成本多维分析报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 1. 核心成本指标大盘卡片 (市电明确标注，纯金额呈现，点击联动分析) */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Coins className="size-3.5 text-[#1677ff]" />
              <span>总用能成本与各类型能源成本构成</span>
            </span>
            {!isWorkshopLevel && (
              <span className="text-[11px] text-[#1677ff] font-sans font-medium flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                当前选中分析项: <strong>{COST_METRICS_META[selectedMetricKey].name}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 font-mono">
            {/* 卡片 1: 总用能成本 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('totalCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'totalCost' && !isWorkshopLevel
                  ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 font-sans">
                  <Coins className="size-3.5 text-emerald-600" />
                  总用能成本
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-emerald-700 truncate">
                ¥{activeData.totalCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>月度同比</span>
                <span className="font-mono font-bold text-emerald-700 flex items-center gap-0.5">
                  <TrendingDown className="size-3" /> {activeData.yoyTrend}% ↓
                </span>
              </div>
            </div>

            {/* 卡片 2: 市电成本 (外购市电) */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('gridElecCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'gridElecCost' && !isWorkshopLevel
                  ? 'bg-blue-50/40 border-[#1677ff] ring-2 ring-blue-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5 font-sans">
                  <Zap className="size-3.5 text-[#1677ff]" />
                  市电成本 (外购市电)
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-[#1677ff] truncate">
                ¥{activeData.gridElecCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>占总用能成本比重</span>
                <span className="font-mono font-bold text-blue-700">{costRatios.elecRatio}%</span>
              </div>
            </div>

            {/* 卡片 3: 天然气成本 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('gasCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'gasCost' && !isWorkshopLevel
                  ? 'bg-amber-50/40 border-amber-500 ring-2 ring-amber-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Flame className="size-3.5 text-amber-500" />
                  管道天然气成本
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-amber-600 truncate">
                ¥{activeData.gasCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>占总用能成本比重</span>
                <span className="font-mono font-bold text-amber-700">{costRatios.gasRatio}%</span>
              </div>
            </div>

            {/* 卡片 4: 外购蒸汽热力成本 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('steamCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'steamCost' && !isWorkshopLevel
                  ? 'bg-purple-50/40 border-purple-500 ring-2 ring-purple-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Wind className="size-3.5 text-purple-500" />
                  外购蒸汽热力成本
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-purple-600 truncate">
                ¥{activeData.steamCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>占总用能成本比重</span>
                <span className="font-mono font-bold text-purple-700">{costRatios.steamRatio}%</span>
              </div>
            </div>

            {/* 卡片 5: 用油动力成本 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('oilCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'oilCost' && !isWorkshopLevel
                  ? 'bg-rose-50/40 border-rose-500 ring-2 ring-rose-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Fuel className="size-3.5 text-rose-500" />
                  用油动力成本
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-rose-600 truncate">
                ¥{activeData.oilCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>占总用能成本比重</span>
                <span className="font-mono font-bold text-rose-700">{costRatios.oilRatio}%</span>
              </div>
            </div>

            {/* 卡片 6: 工艺液氮成本 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('nitrogenCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'nitrogenCost' && !isWorkshopLevel
                  ? 'bg-cyan-50/40 border-cyan-500 ring-2 ring-cyan-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Snowflake className="size-3.5 text-cyan-500" />
                  工艺液氮成本
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-cyan-600 truncate">
                ¥{activeData.nitrogenCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>主要工艺单位</span>
                <span className="font-sans font-bold text-slate-700">
                  {activeData.nitrogenCost > 0 ? '露娜公司 (100%)' : '0 (无液氮项)'}
                </span>
              </div>
            </div>

            {/* 卡片 7: 水资源成本 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('waterCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'waterCost' && !isWorkshopLevel
                  ? 'bg-sky-50/40 border-sky-500 ring-2 ring-sky-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Droplets className="size-3.5 text-sky-600" />
                  水资源成本 (ESG)
                </span>
                
              </div>
              <div className="text-xl font-extrabold text-sky-600 truncate">
                ¥{activeData.waterCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-between">
                <span>占总用能成本比重</span>
                <span className="font-mono font-bold text-sky-700">{costRatios.waterRatio}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 2. 集团页和经营单位：展示 6 家单位占总能源费用的比重 (饼图 + 柱状图)     */}
        {/* ========================================================================= */}
        {!isWorkshopLevel && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-900">
                  【{COST_METRICS_META[selectedMetricKey].name}】6 家直属单位占电装总能源费用的比重结构分析
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                点击上方任意成本卡片可切换分析指标
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 左侧 5/12: 饼图/环形图 (6 家单位费用占比份额) */}
              <div className="lg:col-span-5 border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <PieChartIcon className="size-3.5 text-[#1677ff]" />
                    6 家单位费用比重饼图 (份额 %)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    总量: ¥{metricCompanyBreakdown.totalVal.toFixed(1)} {metricCompanyBreakdown.unit}
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

              {/* 右侧 7/12: 柱状图 (6 家单位费用横向对比与排名) */}
              <div className="lg:col-span-7 border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <BarChart3 className="size-3.5 text-emerald-600" />
                    6 家单位费用横向对比 ({metricCompanyBreakdown.unit})
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">柱状图对比</span>
                </div>
                <div className="h-[230px]">
                  <BarChartGroup
                    data={metricCompanyBreakdown.barData}
                    xKey="name"
                    height={230}
                    bars={[
                      { key: '成本费用', name: `${COST_METRICS_META[selectedMetricKey].shortName} (${metricCompanyBreakdown.unit})`, color: COST_METRICS_META[selectedMetricKey].color },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* 6 家单位费用明细表格 */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold font-sans">
                      <th className="py-2 px-3">序号</th>
                      <th className="py-2 px-3">直属经营单位</th>
                      <th className="py-2 px-3">所属基地与电网</th>
                      <th className="py-2 px-3 text-[#1677ff]">
                        {COST_METRICS_META[selectedMetricKey].name} ({metricCompanyBreakdown.unit})
                      </th>
                      <th className="py-2 px-3 font-bold text-emerald-700">占全集团费用比重 (%)</th>
                      <th className="py-2 px-3">市电成本占比 (%)</th>
                      <th className="py-2 px-3">同比变化 (%)</th>
                      <th className="py-2 px-3 text-right">穿透操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {SIX_COMPANIES_COST.map((comp, idx) => {
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
                          <td className="py-2 px-3 font-bold text-[#1677ff]">¥{val.toFixed(1)}万</td>
                          <td className="py-2 px-3 font-extrabold text-emerald-700">{ratio}%</td>
                          <td className="py-2 px-3">{comp.elecRatio}%</td>
                          <td className="py-2 px-3 text-emerald-600 font-bold">{comp.yoyTrend}% ↓</td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedNode({
                                  id: comp.id,
                                  name: comp.name,
                                  fullName: comp.fullName,
                                  level: 'company',
                                })
                              }}
                              className="text-[11px] text-[#1677ff] hover:underline font-sans font-medium cursor-pointer"
                            >
                              查看该单位成本 →
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
        {/* 🌟 3. 能源成本构成南丁格尔玫瑰图与各介质成本对比 (全层级均保留展示)                            */}
        {/* ========================================================================= */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h2 className="text-xs font-bold text-slate-900">
                能源成本构成南丁格尔玫瑰图与各介质成本对比
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="size-2.5 rounded-full bg-[#3b82f6]" /> 市电成本 ({costRatios.elecRatio}%)
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="size-2.5 rounded-full bg-[#f59e0b]" /> 天然气 ({costRatios.gasRatio}%)
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="size-2.5 rounded-full bg-[#a855f7]" /> 蒸汽 ({costRatios.steamRatio}%)
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="size-2.5 rounded-full bg-[#06b6d4]" /> 水费 ({costRatios.waterRatio}%)
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* 左侧：SVG 南丁格尔玫瑰图 (保留现有极坐标视觉设计) */}
            <div className="w-full lg:w-[380px] shrink-0 flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-xl border border-slate-200">
              <div className="relative w-[300px] h-[260px] flex items-center justify-center">
                <svg viewBox="0 0 300 260" className="w-full h-full select-none">
                  <g transform="translate(150, 130)">
                    <circle r="30" fill="none" stroke="#cbd5e1" strokeDasharray="2,2" />
                    <circle r="60" fill="none" stroke="#cbd5e1" strokeDasharray="2,2" />
                    <circle r="90" fill="none" stroke="#cbd5e1" strokeDasharray="2,2" />
                    <circle r="115" fill="none" stroke="#cbd5e1" strokeDasharray="2,2" />

                    {/* 市电成本 (主导支出, 半径 115) */}
                    <path
                      d="M 0 0 L 0 -115 A 115 115 0 0 1 110 35 Z"
                      fill="#3b82f6"
                      fillOpacity={activeHoverSector === 'elec' ? '1' : '0.88'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-95 transition-opacity cursor-pointer"
                      onMouseEnter={() => setActiveHoverSector('elec')}
                      onMouseLeave={() => setActiveHoverSector(null)}
                    />

                    {/* 天然气成本 (半径 75) */}
                    <path
                      d="M 0 0 L 110 35 A 75 75 0 0 1 -25 70 Z"
                      fill="#f59e0b"
                      fillOpacity={activeHoverSector === 'gas' ? '1' : '0.88'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-95 transition-opacity cursor-pointer"
                      onMouseEnter={() => setActiveHoverSector('gas')}
                      onMouseLeave={() => setActiveHoverSector(null)}
                    />

                    {/* 蒸汽成本 (半径 55) */}
                    <path
                      d="M 0 0 L -25 70 A 55 55 0 0 1 -50 -20 Z"
                      fill="#a855f7"
                      fillOpacity={activeHoverSector === 'steam' ? '1' : '0.88'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-95 transition-opacity cursor-pointer"
                      onMouseEnter={() => setActiveHoverSector('steam')}
                      onMouseLeave={() => setActiveHoverSector(null)}
                    />

                    {/* 水费与辅助成本 (半径 35) */}
                    <path
                      d="M 0 0 L -50 -20 A 35 35 0 0 1 0 -115 Z"
                      fill="#06b6d4"
                      fillOpacity={activeHoverSector === 'water' ? '1' : '0.88'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-95 transition-opacity cursor-pointer"
                      onMouseEnter={() => setActiveHoverSector('water')}
                      onMouseLeave={() => setActiveHoverSector(null)}
                    />

                    {/* 中心悬浮标牌 */}
                    <circle r="28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" className="shadow-xs" />
                    <text textAnchor="middle" y="-4" fontSize="9.5" fill="#64748b" fontWeight="bold">
                      总用能成本
                    </text>
                    <text
                      textAnchor="middle"
                      y="11"
                      fontSize="10.5"
                      fill="#0f172a"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      ¥{activeData.totalCost.toFixed(1)}万
                    </text>
                  </g>
                </svg>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 font-sans">
                💡 南丁格尔玫瑰图极径视觉放大水费等小占比数据可见性
              </span>
            </div>

            {/* 右侧：各介质成本构成明细与金额对比 */}
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3.5">
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>各能源介质成本费用明细对比</span>
                  <span className="text-[10px] text-slate-400 font-normal">基于实际月度账单支出</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium font-sans">
                      <span className="size-2 rounded-full bg-blue-500" /> 市电成本 (外购市电):
                    </span>
                    <span className="text-blue-600 font-bold">
                      ¥{activeData.gridElecCost.toLocaleString()} 万元 ({costRatios.elecRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${costRatios.elecRatio}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium font-sans">
                      <span className="size-2 rounded-full bg-amber-500" /> 管道天然气成本:
                    </span>
                    <span className="text-amber-600 font-bold">
                      ¥{activeData.gasCost.toLocaleString()} 万元 ({costRatios.gasRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${Math.max(8, Number(costRatios.gasRatio) * 3)}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium font-sans">
                      <span className="size-2 rounded-full bg-purple-500" /> 外购蒸汽热力成本:
                    </span>
                    <span className="text-purple-600 font-bold">
                      ¥{activeData.steamCost.toLocaleString()} 万元 ({costRatios.steamRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${Math.max(6, Number(costRatios.steamRatio) * 3)}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium font-sans">
                      <span className="size-2 rounded-full bg-rose-500" /> 用油动力成本:
                    </span>
                    <span className="text-rose-600 font-bold">
                      ¥{activeData.oilCost.toLocaleString()} 万元 ({costRatios.oilRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${Math.max(4, Number(costRatios.oilRatio) * 3)}%` }} />
                  </div>
                </div>
              </div>

              {/* 展开明细按钮 */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-sans">
                  💡 支持穿透查看各车间工段分项能源费用明细
                </span>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-[#1677ff] hover:bg-blue-100 text-xs font-bold transition-all border border-blue-200 cursor-pointer"
                >
                  <Maximize2 className="size-3.5" />
                  <span>展开车间级明细账 (弹窗)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 4. 各类能源成本占比的变化趋势 (集团、经营单位及项目公司均包含)          */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold text-slate-900">
                01月 至 08月 各类能源成本占比历史变化趋势曲线 (%)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-sans text-slate-500">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#1677ff]" /> 市电成本占比</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" /> 天然气成本占比</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-purple-500" /> 蒸汽成本占比</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-slate-600" /> 用油与其他</span>
            </div>
          </div>

          <div className="h-[260px]">
            <LineTrend
              data={isGroupLevel ? GROUP_COST_STRUCTURE_TREND : companyCostTrend}
              xKey="month"
              height={260}
              yUnit="%"
              lines={[
                { key: '市电成本占比', name: '市电成本占比 (%)', color: '#1677ff' },
                { key: '天然气成本占比', name: '天然气成本占比 (%)', color: '#f59e0b' },
                { key: '蒸汽成本占比', name: '蒸汽热力成本占比 (%)', color: '#8b5cf6' },
                { key: '用油与其他', name: '用油与其他成本占比 (%)', color: '#64748b' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 🌟 展开车间级数据明细透视弹窗 Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#fafbfc]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-[#1677ff]" />
                <h3 className="text-sm font-bold text-slate-800">
                  【{activeData.name}】车间工序级能源成本明细台账
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800">车间/工序级能源成本与 ESG 水耗拆解</span>
                <button
                  type="button"
                  onClick={() => alert(`正在导出【${activeData.name}】车间成本明细 Excel...`)}
                  className="px-3 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  导出 Excel 报表
                </button>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold font-sans">
                    <th className="py-2.5 px-3">工序 / 车间</th>
                    <th className="py-2.5 px-3 text-right">市电支出 (万元)</th>
                    <th className="py-2.5 px-3 text-right">天然气费 (万元)</th>
                    <th className="py-2.5 px-3 text-right">蒸汽费 (万元)</th>
                    <th className="py-2.5 px-3 text-right text-cyan-700">水费 (万元)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/50">
                      用能总成本 (万元)
                    </th>
                    <th className="py-2.5 px-3 text-right">成本占比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">1. 真空干燥工段 (煤油气相/蒸汽)</td>
                    <td className="py-2.5 px-3 text-right">303.1</td>
                    <td className="py-2.5 px-3 text-right">29.1</td>
                    <td className="py-2.5 px-3 text-right">18.0</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">2.1</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">352.3</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">46.2%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">2. 铁芯剪切与叠装工序</td>
                    <td className="py-2.5 px-3 text-right">150.0</td>
                    <td className="py-2.5 px-3 text-right">9.0</td>
                    <td className="py-2.5 px-3 text-right">1.4</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">1.4</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">161.8</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">21.2%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">3. 线圈绕制与绝缘处理工段</td>
                    <td className="py-2.5 px-3 text-right">121.8</td>
                    <td className="py-2.5 px-3 text-right">8.1</td>
                    <td className="py-2.5 px-3 text-right">3.8</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">1.9</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">135.6</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">17.8%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">4. 总装配、试验与辅助动力站房</td>
                    <td className="py-2.5 px-3 text-right">100.1</td>
                    <td className="py-2.5 px-3 text-right">7.4</td>
                    <td className="py-2.5 px-3 text-right">2.4</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">2.9</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">112.8</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">14.8%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-slate-100 bg-[#fafbfc] flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

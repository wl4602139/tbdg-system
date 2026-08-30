'use client'

import React, { useState, useMemo } from 'react'
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Award,
  Zap,
  Cable,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Sliders,
  Filter,
  Search,
  Plus,
  Edit,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  Activity,
  Maximize2,
  X,
  Clock,
  Flame,
  Cpu,
  Info,
  Droplets,
  Leaf,
  ShieldCheck,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts'
import { TimeRange } from '@/components/shared/time-range'
import { cn } from '@/lib/utils'

// 5 大 Tab 键名
type BenchmarkTabKey = 'horizontal' | 'product_horizontal' | 'product_vertical' | 'process' | 'standard_manage'

interface BenchmarkTabConfig {
  key: BenchmarkTabKey
  label: string
  icon: any
}

const BENCHMARK_TABS: BenchmarkTabConfig[] = [
  { key: 'horizontal', label: '核心指标对比', icon: BarChart3 },
  { key: 'product_horizontal', label: '产品单耗对比（横向）', icon: Sliders },
  { key: 'product_vertical', label: '产品单耗对比（纵向）', icon: TrendingUp },
  { key: 'process', label: '关键工序单耗对比', icon: Zap },
  { key: 'standard_manage', label: '基准管理', icon: Award },
]

// ============================================================================
// 1. 国家级零碳工厂 3 大核心指标数据
// ============================================================================

export type ZeroCarbonMetricType = 'carbon_per_tce' | 'non_fossil_ratio' | 'physical_green_ratio'

interface ZeroCarbonMetricMeta {
  key: ZeroCarbonMetricType
  name: string
  shortName: string
  unit: string
  nationalThreshold: number
  nationalThresholdLabel: string
  nationalThresholdCompare: 'lte' | 'gte' // lte: <=, gte: >=
  groupAvg: number
  groupAvgLabel: string
  color: string
  description: string
}

const ZERO_CARBON_METRICS_META: Record<ZeroCarbonMetricType, ZeroCarbonMetricMeta> = {
  carbon_per_tce: {
    key: 'carbon_per_tce',
    name: '单位能耗碳排放',
    shortName: '单位能耗碳排',
    unit: 'tCO₂/tce',
    nationalThreshold: 1.80,
    nationalThresholdLabel: '国家门槛要求值 (≤ 1.80 tCO₂/tce)',
    nationalThresholdCompare: 'lte',
    groupAvg: 1.62,
    groupAvgLabel: '电装集团平均值 (1.62)',
    color: '#3b82f6',
    description: '每消耗 1 吨标准煤综合能源所产生的化石燃料与电力碳排放总量',
  },
  non_fossil_ratio: {
    key: 'non_fossil_ratio',
    name: '非化石能源消费占比',
    shortName: '非化石能源占比',
    unit: '%',
    nationalThreshold: 35.0,
    nationalThresholdLabel: '国家门槛要求值 (≥ 35.0%)',
    nationalThresholdCompare: 'gte',
    groupAvg: 41.5,
    groupAvgLabel: '电装集团平均值 (41.5%)',
    color: '#10b981',
    description: '厂区可再生能源（光伏、风电、生物质等）及外购绿电在总能耗中占比',
  },
  physical_green_ratio: {
    key: 'physical_green_ratio',
    name: '非化石能源电力消费物理认定电量占比',
    shortName: '非化石电力物理认定占比',
    unit: '%',
    nationalThreshold: 30.0,
    nationalThresholdLabel: '国家门槛要求值 (≥ 30.0%)',
    nationalThresholdCompare: 'gte',
    groupAvg: 38.6,
    groupAvgLabel: '电装集团平均值 (38.6%)',
    color: '#8b5cf6',
    description: '厂区自发自用分布式光伏与电网直供物理绿色电力占总用电量比重',
  },
}

// 全集团各项目公司实测零碳指标与管控指标数据库 (共 19 家项目公司)
interface ProjectCompanyBenchmarkRow {
  rank: number
  id: string
  name: string
  parentCompany: string
  industry: string
  // 零碳工厂 3 大指标
  carbonPerTce: number        // 单位能耗碳排放 (tCO2/tce)
  nonFossilRatio: number      // 非化石能源消费占比 (%)
  physicalGreenRatio: number  // 非化石能源电力消费物理认定电量占比 (%)
  // 核心管控指标
  unitOutputTce: number       // 单位产值能耗 (tce/万元)
  unitOutputYoy: string       // 单位产值能耗同比
  unitAddedValueTce: number   // 单位工业增加值能耗 (tce/万元)
  unitAddedValueYoy: string   // 单位工业增加值能耗同比
}

const PROJECT_COMPANIES_BENCHMARK_DATA: ProjectCompanyBenchmarkRow[] = [
  {
    rank: 1,
    id: 'pc-01',
    name: '珠峰硅钢',
    parentCompany: '新变厂',
    industry: '铁芯与硅钢加工',
    carbonPerTce: 1.40,
    nonFossilRatio: 45.0,
    physicalGreenRatio: 42.0,
    unitOutputTce: 0.0835,
    unitOutputYoy: '-6.9%',
    unitAddedValueTce: 0.198,
    unitAddedValueYoy: '-7.5%',
  },
  {
    rank: 2,
    id: 'pc-02',
    name: '和新套管公司',
    parentCompany: '沈变公司',
    industry: '套管研发制造',
    carbonPerTce: 1.42,
    nonFossilRatio: 46.2,
    physicalGreenRatio: 43.5,
    unitOutputTce: 0.0840,
    unitOutputYoy: '-6.5%',
    unitAddedValueTce: 0.205,
    unitAddedValueYoy: '-7.1%',
  },
  {
    rank: 3,
    id: 'pc-03',
    name: '沈变本部',
    parentCompany: '沈变公司',
    industry: '特高压变压器制造',
    carbonPerTce: 1.48,
    nonFossilRatio: 43.8,
    physicalGreenRatio: 41.2,
    unitOutputTce: 0.0845,
    unitOutputYoy: '-6.8%',
    unitAddedValueTce: 0.210,
    unitAddedValueYoy: '-7.2%',
  },
  {
    rank: 4,
    id: 'pc-04',
    name: '康嘉互感器',
    parentCompany: '沈变公司',
    industry: '精密互感器制造',
    carbonPerTce: 1.46,
    nonFossilRatio: 43.0,
    physicalGreenRatio: 40.5,
    unitOutputTce: 0.0849,
    unitOutputYoy: '-6.2%',
    unitAddedValueTce: 0.212,
    unitAddedValueYoy: '-6.8%',
  },
  {
    rank: 5,
    id: 'pc-05',
    name: '鲁缆本部',
    parentCompany: '鲁缆公司',
    industry: '超高压电缆制造',
    carbonPerTce: 1.72,
    nonFossilRatio: 38.5,
    physicalGreenRatio: 35.6,
    unitOutputTce: 0.0858,
    unitOutputYoy: '-5.7%',
    unitAddedValueTce: 0.218,
    unitAddedValueYoy: '-6.3%',
  },
  {
    rank: 6,
    id: 'pc-06',
    name: '曙光公司',
    parentCompany: '鲁缆公司',
    industry: '特种电缆研发',
    carbonPerTce: 1.70,
    nonFossilRatio: 36.8,
    physicalGreenRatio: 33.8,
    unitOutputTce: 0.0859,
    unitOutputYoy: '-5.4%',
    unitAddedValueTce: 0.220,
    unitAddedValueYoy: '-6.0%',
  },
  {
    rank: 7,
    id: 'pc-07',
    name: '湖南电气',
    parentCompany: '衡变公司',
    industry: '输配电智能设备',
    carbonPerTce: 1.55,
    nonFossilRatio: 41.8,
    physicalGreenRatio: 39.0,
    unitOutputTce: 0.0870,
    unitOutputYoy: '-5.3%',
    unitAddedValueTce: 0.224,
    unitAddedValueYoy: '-5.9%',
  },
  {
    rank: 8,
    id: 'pc-08',
    name: '衡变本部',
    parentCompany: '衡变公司',
    industry: '高压变压器制造',
    carbonPerTce: 1.52,
    nonFossilRatio: 42.5,
    physicalGreenRatio: 39.8,
    unitOutputTce: 0.0872,
    unitOutputYoy: '-5.5%',
    unitAddedValueTce: 0.225,
    unitAddedValueYoy: '-6.1%',
  },
  {
    rank: 9,
    id: 'pc-09',
    name: '云集电气',
    parentCompany: '衡变公司',
    industry: '中低压开关柜',
    carbonPerTce: 1.56,
    nonFossilRatio: 41.0,
    physicalGreenRatio: 38.5,
    unitOutputTce: 0.0872,
    unitOutputYoy: '-5.1%',
    unitAddedValueTce: 0.226,
    unitAddedValueYoy: '-5.6%',
  },
  {
    rank: 10,
    id: 'pc-10',
    name: '云集高压开关',
    parentCompany: '衡变公司',
    industry: 'GIS 组合电器',
    carbonPerTce: 1.57,
    nonFossilRatio: 40.8,
    physicalGreenRatio: 38.2,
    unitOutputTce: 0.0873,
    unitOutputYoy: '-5.0%',
    unitAddedValueTce: 0.227,
    unitAddedValueYoy: '-5.5%',
  },
  {
    rank: 11,
    id: 'pc-11',
    name: '特能建',
    parentCompany: '衡变公司',
    industry: '电力工程集成',
    carbonPerTce: 1.54,
    nonFossilRatio: 41.5,
    physicalGreenRatio: 38.8,
    unitOutputTce: 0.0874,
    unitOutputYoy: '-5.2%',
    unitAddedValueTce: 0.228,
    unitAddedValueYoy: '-5.8%',
  },
  {
    rank: 12,
    id: 'pc-12',
    name: '超高压公司',
    parentCompany: '新变厂',
    industry: '特高压变压器制造',
    carbonPerTce: 1.45,
    nonFossilRatio: 48.5,
    physicalGreenRatio: 45.2,
    unitOutputTce: 0.0894,
    unitOutputYoy: '-5.3%',
    unitAddedValueTce: 0.234,
    unitAddedValueYoy: '-5.8%',
  },
  {
    rank: 13,
    id: 'pc-13',
    name: '天变公司',
    parentCompany: '新变厂',
    industry: '干式变压器制造',
    carbonPerTce: 1.58,
    nonFossilRatio: 40.2,
    physicalGreenRatio: 37.5,
    unitOutputTce: 0.0894,
    unitOutputYoy: '-5.2%',
    unitAddedValueTce: 0.236,
    unitAddedValueYoy: '-5.6%',
  },
  {
    rank: 14,
    id: 'pc-14',
    name: '智能电气公司',
    parentCompany: '新变厂',
    industry: '智能化箱式变电站',
    carbonPerTce: 1.50,
    nonFossilRatio: 42.0,
    physicalGreenRatio: 39.2,
    unitOutputTce: 0.0894,
    unitOutputYoy: '-5.1%',
    unitAddedValueTce: 0.235,
    unitAddedValueYoy: '-5.7%',
  },
  {
    rank: 15,
    id: 'pc-15',
    name: '京津冀公司',
    parentCompany: '新变厂',
    industry: '中低压变压器',
    carbonPerTce: 1.60,
    nonFossilRatio: 39.5,
    physicalGreenRatio: 36.8,
    unitOutputTce: 0.0895,
    unitOutputYoy: '-5.0%',
    unitAddedValueTce: 0.238,
    unitAddedValueYoy: '-5.4%',
  },
  {
    rank: 16,
    id: 'pc-16',
    name: '新疆电缆公司',
    parentCompany: '新缆厂',
    industry: '电缆制造及交联',
    carbonPerTce: 1.68,
    nonFossilRatio: 37.2,
    physicalGreenRatio: 34.5,
    unitOutputTce: 0.0898,
    unitOutputYoy: '-5.2%',
    unitAddedValueTce: 0.240,
    unitAddedValueYoy: '-5.6%',
  },
  {
    rank: 17,
    id: 'pc-17',
    name: '德缆股份',
    parentCompany: '德缆公司',
    industry: '线缆制造',
    carbonPerTce: 1.75,
    nonFossilRatio: 35.8,
    physicalGreenRatio: 32.5,
    unitOutputTce: 0.0898,
    unitOutputYoy: '-4.9%',
    unitAddedValueTce: 0.241,
    unitAddedValueYoy: '-5.3%',
  },
  {
    rank: 18,
    id: 'pc-18',
    name: '新疆线缆厂',
    parentCompany: '新缆厂',
    industry: '中低压线缆',
    carbonPerTce: 1.71,
    nonFossilRatio: 36.5,
    physicalGreenRatio: 33.5,
    unitOutputTce: 0.0899,
    unitOutputYoy: '-5.0%',
    unitAddedValueTce: 0.242,
    unitAddedValueYoy: '-5.4%',
  },
  {
    rank: 19,
    id: 'pc-19',
    name: '德缆本部',
    parentCompany: '德缆公司',
    industry: '电缆拉丝与加工',
    carbonPerTce: 1.74,
    nonFossilRatio: 35.5,
    physicalGreenRatio: 32.2,
    unitOutputTce: 0.0899,
    unitOutputYoy: '-4.7%',
    unitAddedValueTce: 0.243,
    unitAddedValueYoy: '-5.1%',
  },
]


// 纵向产品单耗历史时序数据
const VERTICAL_PRODUCT_TREND_DATA = [
  { period: '2025-09', value: 107500, benchmark: 105000, dryKWh: 56000, testKWh: 23500, otherKWh: 28000, mom: '+0.5%', yoy: '+1.8%' },
  { period: '2025-10', value: 106800, benchmark: 105000, dryKWh: 55400, testKWh: 23400, otherKWh: 28000, mom: '-0.7%', yoy: '+1.2%' },
  { period: '2025-11', value: 105900, benchmark: 105000, dryKWh: 54800, testKWh: 23200, otherKWh: 27900, mom: '-0.8%', yoy: '-0.4%' },
  { period: '2025-12', value: 105200, benchmark: 105000, dryKWh: 54100, testKWh: 23200, otherKWh: 27900, mom: '-0.7%', yoy: '-1.1%' },
  { period: '2026-01', value: 104800, benchmark: 105000, dryKWh: 53500, testKWh: 23500, otherKWh: 27800, mom: '-0.4%', yoy: '-1.8%' },
  { period: '2026-02', value: 104500, benchmark: 105000, dryKWh: 53000, testKWh: 23800, otherKWh: 27700, mom: '-0.3%', yoy: '-2.1%' },
  { period: '2026-03', value: 103900, benchmark: 105000, dryKWh: 52200, testKWh: 24000, otherKWh: 27700, mom: '-0.6%', yoy: '-2.8%' },
  { period: '2026-04', value: 103200, benchmark: 105000, dryKWh: 51500, testKWh: 24100, otherKWh: 27600, mom: '-0.7%', yoy: '-3.5%' },
  { period: '2026-05', value: 102800, benchmark: 105000, dryKWh: 50800, testKWh: 24300, otherKWh: 27700, mom: '-0.4%', yoy: '-4.1%' },
  { period: '2026-06', value: 101200, benchmark: 105000, dryKWh: 49200, testKWh: 24400, otherKWh: 27600, mom: '-1.6%', yoy: '-5.2%' },
  { period: '2026-07', value: 101800, benchmark: 105000, dryKWh: 49600, testKWh: 24400, otherKWh: 27800, mom: '+0.6%', yoy: '-4.9%' },
  { period: '2026-08', value: 102400, benchmark: 105000, dryKWh: 49800, testKWh: 24200, otherKWh: 28400, mom: '+0.6%', yoy: '-4.8%' },
]

export default function BenchmarkManagementPage() {
  // 当前主 Tab
  const [activeTab, setActiveTab] = useState<BenchmarkTabKey>('horizontal')

  // 零碳工厂当前选中的对比指标
  const [activeZeroCarbonMetric, setActiveZeroCarbonMetric] = useState<ZeroCarbonMetricType>('carbon_per_tce')

  // 时间维度 (与用能结构/成本页面完全一致)
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  // 弹窗状态
  const [showAddStandardModal, setShowAddStandardModal] = useState(false)
  const [newStandardForm, setNewStandardForm] = useState({
    industry: '变压器产业',
    productModel: 'ODFS-334MVA/500kV 单相自耦变压器',
    indicatorName: '综合电耗定额 (kWh/kVA)',
    nationalStandardVal: '0.305',
    groupBestVal: '0.308',
    standardSource: 'GB/T 1094.1 行业先进值',
    effectiveDate: '2026-08-01',
  })

  // 当前激活指标元信息
  const currentMetricMeta = ZERO_CARBON_METRICS_META[activeZeroCarbonMetric]

  // 转换图表数据格式
  const chartData = useMemo(() => {
    return PROJECT_COMPANIES_BENCHMARK_DATA.map((item) => ({
      name: item.name,
      parentCompany: item.parentCompany,
      carbon_per_tce: item.carbonPerTce,
      non_fossil_ratio: item.nonFossilRatio,
      physical_green_ratio: item.physicalGreenRatio,
      currentVal:
        activeZeroCarbonMetric === 'carbon_per_tce'
          ? item.carbonPerTce
          : activeZeroCarbonMetric === 'non_fossil_ratio'
          ? item.nonFossilRatio
          : item.physicalGreenRatio,
    }))
  }, [activeZeroCarbonMetric])

  return (
    <div className="w-full flex flex-col gap-3.5 font-sans">
      {/* 1. 顶部 Header 与 统一标准时间筛选与操作栏 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
            <BarChart3 className="size-5" />
          </div>
          <h1 className="text-base font-bold text-slate-800">对标管理</h1>
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
            onClick={() => alert('已生成并导出全集团多维度能效对标分析简报 (Excel)...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <Download className="size-3.5" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 2. 🌟 核心 4 大对标维度 Tab 切换栏 */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 flex-wrap">
        {BENCHMARK_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border select-none',
                isActive
                  ? 'bg-[#1677ff] text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-600 hover:text-[#1677ff] hover:bg-slate-50 border-slate-200/80'
              )}
            >
              <Icon className={cn('size-4', isActive ? 'text-white' : 'text-slate-500')} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 核心指标对比 (国家级零碳工厂核心指标对比 + 核心管控指标排名) */}
      {/* ========================================================================= */}
      {activeTab === 'horizontal' && (
        <div className="space-y-3.5">
          
          {/* 上半部分：【国家级零碳工厂核心指标对比】 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#1677ff] rounded-full" />
                <h3 className="text-xs font-bold text-slate-800">
                  【国家级零碳工厂核心指标对比】
                </h3>
              </div>
            </div>

            {/* 3 大核心指标切换卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
              {(Object.keys(ZERO_CARBON_METRICS_META) as ZeroCarbonMetricType[]).map((key) => {
                const meta = ZERO_CARBON_METRICS_META[key]
                const isSelected = activeZeroCarbonMetric === key

                return (
                  <div
                    key={key}
                    onClick={() => setActiveZeroCarbonMetric(key)}
                    className={cn(
                      'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all cursor-pointer select-none relative',
                      isSelected
                        ? 'bg-gradient-to-br from-blue-50/95 via-white to-blue-50/40 border-2 border-[#1677ff] ring-2 ring-blue-100 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                    )}
                  >
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className={cn('font-bold flex items-center gap-1.5', isSelected ? 'text-[#1677ff]' : 'text-slate-800')}>
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                        {meta.name}
                      </span>
                      {isSelected && (
                        <span className="size-2 rounded-full bg-[#1677ff] animate-pulse" />
                      )}
                    </div>

                    <div className="text-xl font-bold tracking-tight text-slate-900">
                      {meta.groupAvg}{' '}
                      <span className="text-xs font-sans text-slate-500 font-normal">{meta.unit}</span>
                      <span className="text-[10px] text-blue-600 font-sans font-normal ml-2">(全集团均值)</span>
                    </div>

                    <div className="text-[11px] font-sans text-slate-600 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        国标门槛: <strong className="text-red-600 font-mono">{meta.nationalThresholdCompare === 'lte' ? '≤' : '≥'} {meta.nationalThreshold} {meta.unit}</strong>
                      </div>
                      <div className="text-right">
                        达标状态: <strong className="text-emerald-600 font-bold">100% 优于门槛</strong>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 大图表区域: 展示各项目公司柱状图 + 国家门槛要求值 + 电装集团平均值 */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 pb-1.5">
                <span className="font-bold flex items-center gap-2">
                  <span>当前展示: <strong>{currentMetricMeta.name}</strong></span>
                  <span className="text-slate-400 font-normal font-sans">(共 19 家主要项目公司)</span>
                </span>

                {/* 标线图例说明 */}
                <div className="flex items-center gap-4 text-[11px] font-sans">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-0.5 border-t-2 border-red-500 border-dashed" />
                    <span className="text-red-600 font-medium font-mono">
                      {currentMetricMeta.nationalThresholdLabel}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-0.5 bg-blue-600" />
                    <span className="text-blue-700 font-medium font-mono">
                      {currentMetricMeta.groupAvgLabel}
                    </span>
                  </span>
                </div>
              </div>

              <div className="h-[290px] w-full">
                <ResponsiveContainer width="100%" height={290}>
                  <BarChart data={chartData} margin={{ top: 12, right: 12, bottom: 24, left: 16 }}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#475569' }}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#475569' }}
                      tickLine={false}
                      axisLine={false}
                      domain={[
                        0,
                        activeZeroCarbonMetric === 'carbon_per_tce' ? 2.2 : 60,
                      ]}
                      unit={currentMetricMeta.unit}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        fontSize: 12,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 18 }} />

                    {/* 国家门槛线 */}
                    <ReferenceLine
                      y={currentMetricMeta.nationalThreshold}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: currentMetricMeta.nationalThresholdLabel,
                        fill: '#ef4444',
                        fontSize: 10,
                        position: 'top',
                      }}
                    />

                    {/* 电装集团平均值线 */}
                    <ReferenceLine
                      y={currentMetricMeta.groupAvg}
                      stroke="#1677ff"
                      strokeWidth={1.5}
                      label={{
                        value: currentMetricMeta.groupAvgLabel,
                        fill: '#1677ff',
                        fontSize: 10,
                        position: 'top',
                      }}
                    />

                    <Bar
                      dataKey="currentVal"
                      name={currentMetricMeta.name + ' (' + currentMetricMeta.unit + ')'}
                      fill={currentMetricMeta.color}
                      radius={[4, 4, 0, 0]}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={'cell-' + index}
                          fill={
                            currentMetricMeta.nationalThresholdCompare === 'lte'
                              ? entry.currentVal <= currentMetricMeta.nationalThreshold
                                ? currentMetricMeta.color
                                : '#f59e0b'
                              : entry.currentVal >= currentMetricMeta.nationalThreshold
                              ? currentMetricMeta.color
                              : '#f59e0b'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 下半部分：【核心管控指标排名】 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/60 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#1677ff] rounded-full" />
                <h3 className="text-xs font-bold text-slate-800">
                  【核心管控指标排名】
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                全集团 19 家项目公司 · 依据单位产值能耗升序排名 · 包含同比变动
              </span>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                    <th className="py-2.5 px-3 w-14 text-center">排名</th>
                    <th className="py-2.5 px-3 min-w-[140px]">项目公司 / 制造车间</th>
                    <th className="py-2.5 px-3 min-w-[100px]">所属经营单位</th>
                    <th className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/40">
                      单位产值能耗 (tce/万元)
                    </th>
                    <th className="py-2.5 px-3 text-center">产值能耗同比</th>
                    <th className="py-2.5 px-3 text-right font-bold text-emerald-700 bg-emerald-50/30">
                      单位工业增加值能耗 (tce/万元)
                    </th>
                    <th className="py-2.5 px-3 text-center">增加值能耗同比</th>
                    <th className="py-2.5 px-3 text-right">对标透视</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {PROJECT_COMPANIES_BENCHMARK_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={cn(
                            'size-5 rounded-full inline-flex items-center justify-center text-[10.5px] font-bold font-sans',
                            row.rank === 1
                              ? 'bg-amber-400 text-white shadow-xs'
                              : row.rank === 2
                              ? 'bg-slate-400 text-white shadow-xs'
                              : row.rank === 3
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                        {row.name}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-600">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {row.parentCompany}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#1677ff] bg-blue-50/30">
                        {row.unitOutputTce.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-emerald-600 font-bold font-mono">
                          {row.unitOutputYoy} ↓
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700 bg-emerald-50/20">
                        {row.unitAddedValueTce.toFixed(3)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-emerald-600 font-bold font-mono">
                          {row.unitAddedValueYoy} ↓
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans">
                        <button
                          type="button"
                          onClick={() => alert('已打开【' + row.name + '】能效对标与用能实况面板。')}
                          className="text-xs text-[#1677ff] hover:underline font-semibold cursor-pointer"
                        >
                          查看用能实况
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 产品单耗对比（横向） */}
      {/* ========================================================================= */}
      {activeTab === 'product_horizontal' && (
        <div className="space-y-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  同产品型号跨制造工厂横向对标 (ODFS-334MVA/500kV 变压器)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">核算口径: 单台制造总耗电 (kWh/台)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-mono">
              {[
                { factory: '沈变本部 (超高压车间)', totalKWh: 105900, dryKWh: 54200, testKWh: 23100, otherKWh: 28600, status: '实测偏差 (+2.8%)', tone: 'blue' },
                { factory: '衡变本部 (特高压车间)', totalKWh: 102400, dryKWh: 49800, testKWh: 24200, otherKWh: 28400, status: '集团最优实测 (基准)', tone: 'emerald' },
                { factory: '新变特高压制造部', totalKWh: 109800, dryKWh: 58000, testKWh: 22800, otherKWh: 29000, status: '实测偏差 (+6.5%)', tone: 'amber' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center font-sans">
                    <span className="font-bold text-slate-900 text-xs">{item.factory}</span>
                    <span className={cn('text-[10px] px-1.5 py-0.2 rounded font-bold', item.tone === 'emerald' ? 'bg-emerald-100 text-emerald-800' : item.tone === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800')}>{item.status}</span>
                  </div>
                  <div className="text-xl font-extrabold text-slate-800">
                    {item.totalKWh.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kWh/台</span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200/60 font-sans">
                    <div className="flex justify-between"><span>干燥工段电耗:</span><strong className="font-mono">{item.dryKWh.toLocaleString()} kWh</strong></div>
                    <div className="flex justify-between"><span>试验站电耗:</span><strong className="font-mono">{item.testKWh.toLocaleString()} kWh</strong></div>
                    <div className="flex justify-between"><span>其他工序辅助:</span><strong className="font-mono">{item.otherKWh.toLocaleString()} kWh</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 产品单耗对比（纵向） */}
      {/* ========================================================================= */}
      {activeTab === 'product_vertical' && (
        <div className="space-y-3.5">
          {/* 顶部控制与产品型号选择 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-900">
                  重点产品型号历史时序单耗纵向对比与能效演进
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="text-slate-500">选择对标产品型号:</span>
                <select className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-800 text-xs focus:outline-none focus:border-[#1677ff]">
                  <option value="p1">ODFS-334MVA/500kV 单相自耦变压器 (超高压)</option>
                  <option value="p2">SZ11-50000/110kV 节能型油浸式变压器</option>
                  <option value="p3">110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)</option>
                  <option value="p4">SCB13-1600kVA 环氧树脂干式变压器</option>
                </select>
              </div>
            </div>

            {/* 4 维核心能效指标卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <span className="text-xs text-slate-500 font-sans block">当期单台总耗电</span>
                <div className="text-xl font-extrabold text-slate-900">102,400 <span className="text-xs font-normal text-slate-500 font-sans">kWh/台</span></div>
                <div className="text-[11px] text-emerald-600 font-bold font-sans">同比 -4.8% ↓ · 环比 -0.6% ↓</div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
                <span className="text-xs text-emerald-800 font-sans block">历史最优单耗纪录</span>
                <div className="text-xl font-extrabold text-emerald-700">101,200 <span className="text-xs font-normal text-slate-500 font-sans">kWh/台</span></div>
                <div className="text-[11px] text-slate-600 font-sans">达成月份: 2026年06月</div>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 space-y-1">
                <span className="text-xs text-purple-800 font-sans block">国家/行业先进标杆定额</span>
                <div className="text-xl font-extrabold text-purple-700">105,000 <span className="text-xs font-normal text-slate-500 font-sans">kWh/台</span></div>
                <div className="text-[11px] text-purple-700 font-bold font-sans">优于行业先进线 2.5%</div>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
                <span className="text-xs text-blue-800 font-sans block">近 12 个月累计节电效益</span>
                <div className="text-xl font-extrabold text-[#1677ff]">5,100 <span className="text-xs font-normal text-slate-500 font-sans">kWh/台</span></div>
                <div className="text-[11px] text-slate-600 font-sans">折合节费 ¥4,080 / 台</div>
              </div>
            </div>

            {/* 纵向历史走势图表 */}
            <div className="pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-sans">
                <span className="font-bold text-slate-800">近 12 个月单台产品耗电时序走势与标杆对比 (kWh/台)</span>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1 text-[#1677ff] font-bold"><span className="size-2 rounded-full bg-[#1677ff]" />实测单耗</span>
                  <span className="flex items-center gap-1 text-purple-600 font-bold"><span className="w-3 h-0.5 bg-purple-600" />行业标杆线 (105,000)</span>
                </div>
              </div>
              <div className="h-[260px] pt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={VERTICAL_PRODUCT_TREND_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                    <YAxis domain={[95000, 115000]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                    <Tooltip
                      formatter={(value: any) => [`${Number(value).toLocaleString()} kWh/台`, '单台耗电']}
                      labelFormatter={(label) => `统计月份: ${label}`}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <ReferenceLine y={105000} stroke="#9333ea" strokeDasharray="4 4" label={{ value: '行业先进标杆 (105,000)', position: 'insideTopRight', fill: '#9333ea', fontSize: 11 }} />
                    <Bar dataKey="value" name="实测单台耗电" fill="#1677ff" radius={[4, 4, 0, 0]} maxBarSize={36}>
                      {VERTICAL_PRODUCT_TREND_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value <= 102400 ? '#10b981' : '#1677ff'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 纵向历史月度明细数据台账 (倒序排列) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-800">近 12 个月历史月度单耗与工序拆解台账</h3>
              </div>
              <button
                type="button"
                onClick={() => alert('正在导出产品纵向时序单耗台账 (Excel)...')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>导出</span>
              </button>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold font-sans">
                    <th className="py-2.5 px-3">时间</th>
                    <th className="py-2.5 px-3 text-right">单台总耗电 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">干燥工序 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">试验站工序 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">辅助工序 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">环比变化 (MoM)</th>
                    <th className="py-2.5 px-3 text-right">同比变化 (YoY)</th>
                    <th className="py-2.5 px-3 text-center">标杆对标状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {[...VERTICAL_PRODUCT_TREND_DATA].reverse().map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{row.period.replace('-', '年')}月</td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-[#1677ff]">{row.value.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-slate-700">{row.dryKWh.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-slate-700">{row.testKWh.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-slate-700">{row.otherKWh.toLocaleString()}</td>
                      <td className={cn('py-2.5 px-3 text-right font-bold', row.mom.startsWith('+') ? 'text-amber-600' : 'text-emerald-600')}>{row.mom}</td>
                      <td className={cn('py-2.5 px-3 text-right font-bold', row.yoy.startsWith('+') ? 'text-amber-600' : 'text-emerald-600')}>{row.yoy}</td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        {row.value <= row.benchmark ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200">
                            ● 优于标杆 ({((row.benchmark - row.value) / row.benchmark * 100).toFixed(1)}%)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10.5px] font-bold border border-amber-200">
                            ▲ 偏离标杆
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 关键工序单耗对比 */}
      {/* ========================================================================= */}
      {activeTab === 'process' && (
        <div className="space-y-3.5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-800">全集团 47 项核心工序能效对标台账</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">纯客观时序统计数据</span>
            </div>

            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                  <th className="py-2.5 px-3">关键工序名称</th>
                  <th className="py-2.5 px-3">沈变实测</th>
                  <th className="py-2.5 px-3">衡变实测</th>
                  <th className="py-2.5 px-3">新变实测</th>
                  <th className="py-2.5 px-3">行业先进标杆 (GB/T)</th>
                  <th className="py-2.5 px-3">当前最优实测单位</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">煤油气相真空干燥 (kWh/t)</td>
                  <td className="py-2.5 px-3 text-blue-700 font-bold">54.2</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">49.8</td>
                  <td className="py-2.5 px-3 text-slate-700">58.0</td>
                  <td className="py-2.5 px-3 text-purple-700 font-bold">48.0</td>
                  <td className="py-2.5 px-3 font-sans"><span className="px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">衡变公司 (49.8)</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">悬垂立塔三层共挤 (kWh/km)</td>
                  <td className="py-2.5 px-3 text-slate-400">—</td>
                  <td className="py-2.5 px-3 text-slate-400">—</td>
                  <td className="py-2.5 px-3 text-blue-700 font-bold">1,208</td>
                  <td className="py-2.5 px-3 text-purple-700 font-bold">1,150</td>
                  <td className="py-2.5 px-3 font-sans"><span className="px-2 py-0.2 rounded bg-blue-50 text-blue-700 font-bold">鲁缆公司 (1,208)</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">铁心硅钢片纵剪叠装 (kWh/t)</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">17.5</td>
                  <td className="py-2.5 px-3 text-slate-700">18.2</td>
                  <td className="py-2.5 px-3 text-slate-700">18.0</td>
                  <td className="py-2.5 px-3 text-purple-700 font-bold">16.8</td>
                  <td className="py-2.5 px-3 font-sans"><span className="px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">沈变本部 (17.5)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 基准管理 */}
      {/* ========================================================================= */}
      {activeTab === 'standard_manage' && (
        <div className="space-y-3.5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-800">国家 / 行业 / 集团历史最优标杆值维护库</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStandardModal(true)}
                className="px-2.5 py-1 rounded bg-[#1677ff] text-white text-xs font-bold cursor-pointer"
              >
                + 新增标杆指标
              </button>
            </div>

            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                  <th className="py-2.5 px-3">所属产业</th>
                  <th className="py-2.5 px-3">产品型号 / 工艺指标</th>
                  <th className="py-2.5 px-3">国家标准先进值 (GB/T)</th>
                  <th className="py-2.5 px-3">集团历史最优纪录</th>
                  <th className="py-2.5 px-3">生效日期</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-sans">变压器产业</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">ODFS-334MVA/500kV 综合单耗</td>
                  <td className="py-2.5 px-3 text-purple-700 font-bold">0.305 kWh/kVA</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">0.308 kWh/kVA (新变)</td>
                  <td className="py-2.5 px-3">2026-08-01</td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="text-[#1677ff] hover:underline cursor-pointer">修改</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-sans">线缆产业</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">500kV 交联悬垂立塔单耗</td>
                  <td className="py-2.5 px-3 text-purple-700 font-bold">1,150 kWh/km</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">1,208 kWh/km (鲁缆)</td>
                  <td className="py-2.5 px-3">2026-08-01</td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="text-[#1677ff] hover:underline cursor-pointer">修改</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 录入/维护标杆值弹窗 */}
      {showAddStandardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Plus className="size-4 text-[#1677ff]" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">录入 / 维护能效对标基准值</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStandardModal(false)}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('已成功录入【' + newStandardForm.productModel + '】最新对标基准！')
                setShowAddStandardModal(false)
              }}
              className="p-4 space-y-3 text-xs font-sans"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">所属核心产业：</label>
                  <select
                    value={newStandardForm.industry}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, industry: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1677ff]"
                  >
                    <option value="变压器产业">变压器产业</option>
                    <option value="线缆产业">线缆产业</option>
                    <option value="开关成套">开关成套及特种电气</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">产品型号/对标项目：</label>
                  <input
                    type="text"
                    value={newStandardForm.productModel}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, productModel: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">国家先进标杆值 (GB/T)：</label>
                  <input
                    type="text"
                    value={newStandardForm.nationalStandardVal}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, nationalStandardVal: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-purple-700 font-mono font-bold focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">集团历史最优基准：</label>
                  <input
                    type="text"
                    value={newStandardForm.groupBestVal}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, groupBestVal: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-emerald-700 font-mono font-bold focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px]">
                提示：更新后的标杆值将即时应用于全集团各项目公司的横向排名与偏离度统计对比。
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStandardModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-xs font-semibold text-white shadow-2xs cursor-pointer"
                >
                  确认保存并发布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

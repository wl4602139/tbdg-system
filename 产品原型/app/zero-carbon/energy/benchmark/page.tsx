'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
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
  Activity,
  Maximize2,
  X,
  Clock,
  Flame,
  Cpu,
  Info,
  Droplets,
  Leaf,
  FileText,
  Package,
  Check,
  Eye,
  Factory,
  BarChart2,
  Coins,
  PieChart as PieChartIcon,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  RotateCcw,
  Building2,
  History,
  ShieldCheck,
  Undo2,
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
  PieChart,
  Pie,
} from 'recharts'
import { TimeRange } from '@/components/shared/time-range'
import { cn } from '@/lib/utils'
import { ExportButton, Badge } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { BENCHMARK_FACTORY_TO_ORG_NODE } from '@/components/shared/standard-org-tree'

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
    nationalThreshold: 30.0,
    nationalThresholdLabel: '国家门槛要求值 (≥ 30.0%)',
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
    nationalThreshold: 10.0,
    nationalThresholdLabel: '国家门槛要求值 (≥ 10.0%)',
    nationalThresholdCompare: 'gte',
    groupAvg: 38.6,
    groupAvgLabel: '电装集团平均值 (38.6%)',
    color: '#8b5cf6',
    description: '厂区自发自用分布式光伏与电网直供物理绿色电力占总用电量比重',
  },
}

// 🌟 全集团 21 家国家级零碳直报工厂实测能耗、碳排与能效对标数据库 (1:1 锚定全域零碳工厂)
interface ZeroCarbonFactoryBenchmarkRow {
  rank: number
  id: string
  name: string               // 国家级零碳工厂规范全称
  shortName: string          // 工厂短名 (严格以“工厂”结尾，用于柱状图X轴)
  parentCompany: string      // 所属制造公司 (沈变公司、衡变公司、新变厂、鲁缆公司、新缆厂、德缆公司)
  industry: string           // 所属主导制造工艺与产品领域
  // 零碳工厂 3 大指标
  carbonPerTce: number        // 单位能耗碳排放 (tCO2/tce)
  carbonPerTceYoy?: string    // 单位能耗碳排放同比
  nonFossilRatio: number      // 非化石能源消费占比 (%)
  nonFossilRatioYoy?: string  // 非化石能源消费占比同比
  physicalGreenRatio: number  // 非化石能源电力消费物理认定电量占比 (%)
  physicalGreenRatioYoy?: string // 物理认定电量占比同比
  // 核心管控指标
  unitOutputTce: number       // 单位产值能耗 (tce/万元)
  unitOutputYoy: string       // 单位产值能耗同比
  unitAddedValueTce: number   // 单位工业增加值能耗 (tce/万元)
  unitAddedValueYoy: string   // 单位工业增加值能耗同比
}

// 零碳工厂 3 大指标确定性同比计算辅助器
const getFactoryYoys = (row: ZeroCarbonFactoryBenchmarkRow) => {
  const cYoy = row.carbonPerTceYoy || `-${(4.8 + ((row.rank * 7) % 25) / 10).toFixed(1)}%`
  const nfYoy = row.nonFossilRatioYoy || `+${(3.5 + ((row.rank * 9) % 28) / 10).toFixed(1)}%`
  const pgYoy = row.physicalGreenRatioYoy || `+${(3.8 + ((row.rank * 11) % 26) / 10).toFixed(1)}%`
  return { carbonYoy: cYoy, nonFossilYoy: nfYoy, physicalGreenYoy: pgYoy }
}

type ProjectCompanyBenchmarkRow = ZeroCarbonFactoryBenchmarkRow

const ZERO_CARBON_FACTORIES_BENCHMARK_DATA: ZeroCarbonFactoryBenchmarkRow[] = [
  {
    rank: 1,
    id: 'fac-01',
    name: '珠峰高牌号硅钢铁芯加工工厂',
    shortName: '珠峰硅钢工厂',
    parentCompany: '新变厂',
    industry: '铁芯与高牌号硅钢加工',
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
    id: 'fac-02',
    name: '和新高压绝缘套管制造工厂',
    shortName: '和新套管工厂',
    parentCompany: '沈变公司',
    industry: '高压绝缘套管研发智造',
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
    id: 'fac-03',
    name: '新变超高压数字化变压器工厂',
    shortName: '超高压变压器工厂',
    parentCompany: '新变厂',
    industry: '特高压及超高压变压器',
    carbonPerTce: 1.45,
    nonFossilRatio: 48.5,
    physicalGreenRatio: 45.2,
    unitOutputTce: 0.0842,
    unitOutputYoy: '-6.7%',
    unitAddedValueTce: 0.208,
    unitAddedValueYoy: '-7.3%',
  },
  {
    rank: 4,
    id: 'fac-04',
    name: '康嘉精密互感器智造工厂',
    shortName: '康嘉互感器工厂',
    parentCompany: '沈变公司',
    industry: '精密互感器研制',
    carbonPerTce: 1.46,
    nonFossilRatio: 43.0,
    physicalGreenRatio: 40.5,
    unitOutputTce: 0.0845,
    unitOutputYoy: '-6.2%',
    unitAddedValueTce: 0.210,
    unitAddedValueYoy: '-6.8%',
  },
  {
    rank: 5,
    id: 'fac-05',
    name: '沈变本部特高压变压器智造工厂',
    shortName: '沈变本部工厂',
    parentCompany: '沈变公司',
    industry: '特高压变压器核心制造',
    carbonPerTce: 1.48,
    nonFossilRatio: 43.8,
    physicalGreenRatio: 41.2,
    unitOutputTce: 0.0848,
    unitOutputYoy: '-6.8%',
    unitAddedValueTce: 0.212,
    unitAddedValueYoy: '-7.2%',
  },
  {
    rank: 6,
    id: 'fac-06',
    name: '智能电气成套箱变智造工厂',
    shortName: '智能电气工厂',
    parentCompany: '新变厂',
    industry: '智能化箱式变电站',
    carbonPerTce: 1.50,
    nonFossilRatio: 42.0,
    physicalGreenRatio: 39.2,
    unitOutputTce: 0.0850,
    unitOutputYoy: '-5.8%',
    unitAddedValueTce: 0.215,
    unitAddedValueYoy: '-6.4%',
  },
  {
    rank: 7,
    id: 'fac-07',
    name: '衡变本部高压变压器智造工厂',
    shortName: '衡变本部工厂',
    parentCompany: '衡变公司',
    industry: '高压及特高压变压器',
    carbonPerTce: 1.52,
    nonFossilRatio: 42.5,
    physicalGreenRatio: 39.8,
    unitOutputTce: 0.0855,
    unitOutputYoy: '-5.5%',
    unitAddedValueTce: 0.218,
    unitAddedValueYoy: '-6.1%',
  },
  {
    rank: 8,
    id: 'fac-08',
    name: '特能建电力工程成套装备工厂',
    shortName: '特能建工程工厂',
    parentCompany: '衡变公司',
    industry: '电力工程成套装备',
    carbonPerTce: 1.54,
    nonFossilRatio: 41.5,
    physicalGreenRatio: 38.8,
    unitOutputTce: 0.0859,
    unitOutputYoy: '-5.2%',
    unitAddedValueTce: 0.220,
    unitAddedValueYoy: '-5.8%',
  },
  {
    rank: 9,
    id: 'fac-09',
    name: '湖南电气输配电智能设备工厂',
    shortName: '湖南电气工厂',
    parentCompany: '衡变公司',
    industry: '输配电智能成套设备',
    carbonPerTce: 1.55,
    nonFossilRatio: 41.8,
    physicalGreenRatio: 39.0,
    unitOutputTce: 0.0862,
    unitOutputYoy: '-5.3%',
    unitAddedValueTce: 0.222,
    unitAddedValueYoy: '-5.9%',
  },
  {
    rank: 10,
    id: 'fac-10',
    name: '云集电气中低压开关成套工厂',
    shortName: '云集电气工厂',
    parentCompany: '衡变公司',
    industry: '中低压开关柜成套',
    carbonPerTce: 1.56,
    nonFossilRatio: 41.0,
    physicalGreenRatio: 38.5,
    unitOutputTce: 0.0865,
    unitOutputYoy: '-5.1%',
    unitAddedValueTce: 0.224,
    unitAddedValueYoy: '-5.6%',
  },
  {
    rank: 11,
    id: 'fac-11',
    name: '云集高压开关GIS制造工厂',
    shortName: '云集高压开关工厂',
    parentCompany: '衡变公司',
    industry: 'GIS 组合电器',
    carbonPerTce: 1.57,
    nonFossilRatio: 40.8,
    physicalGreenRatio: 38.2,
    unitOutputTce: 0.0868,
    unitOutputYoy: '-5.0%',
    unitAddedValueTce: 0.225,
    unitAddedValueYoy: '-5.5%',
  },
  {
    rank: 12,
    id: 'fac-12',
    name: '天变特种干式变压器智造工厂',
    shortName: '天变变压器工厂',
    parentCompany: '新变厂',
    industry: '干式变压器与特种变',
    carbonPerTce: 1.58,
    nonFossilRatio: 40.2,
    physicalGreenRatio: 37.5,
    unitOutputTce: 0.0872,
    unitOutputYoy: '-5.2%',
    unitAddedValueTce: 0.227,
    unitAddedValueYoy: '-5.6%',
  },
  {
    rank: 13,
    id: 'fac-13',
    name: '京津冀中低压节能变压器工厂',
    shortName: '京津冀变压器工厂',
    parentCompany: '新变厂',
    industry: '中低压节能变压器',
    carbonPerTce: 1.60,
    nonFossilRatio: 39.5,
    physicalGreenRatio: 36.8,
    unitOutputTce: 0.0875,
    unitOutputYoy: '-5.0%',
    unitAddedValueTce: 0.229,
    unitAddedValueYoy: '-5.4%',
  },
  {
    rank: 14,
    id: 'fac-14',
    name: '露娜智能装备制造工厂',
    shortName: '露娜智造工厂',
    parentCompany: '沈变公司',
    industry: '智能工装与装备制造',
    carbonPerTce: 1.62,
    nonFossilRatio: 42.0,
    physicalGreenRatio: 39.0,
    unitOutputTce: 0.0878,
    unitOutputYoy: '-5.4%',
    unitAddedValueTce: 0.230,
    unitAddedValueYoy: '-6.0%',
  },
  {
    rank: 15,
    id: 'fac-15',
    name: '南京电研智能配网装备工厂',
    shortName: '南京电研工厂',
    parentCompany: '衡变公司',
    industry: '智能配网及保护控制',
    carbonPerTce: 1.64,
    nonFossilRatio: 40.0,
    physicalGreenRatio: 37.2,
    unitOutputTce: 0.0880,
    unitOutputYoy: '-4.8%',
    unitAddedValueTce: 0.232,
    unitAddedValueYoy: '-5.2%',
  },
  {
    rank: 16,
    id: 'fac-16',
    name: '新疆工业自动化控制系统工厂',
    shortName: '新疆自控工厂',
    parentCompany: '衡变公司',
    industry: '工业自控与软件集成',
    carbonPerTce: 1.65,
    nonFossilRatio: 39.8,
    physicalGreenRatio: 36.5,
    unitOutputTce: 0.0883,
    unitOutputYoy: '-4.9%',
    unitAddedValueTce: 0.234,
    unitAddedValueYoy: '-5.3%',
  },
  {
    rank: 17,
    id: 'fac-17',
    name: '合容电气电力电容器智造工厂',
    shortName: '合容电气工厂',
    parentCompany: '衡变公司',
    industry: '电力电容器及无功补偿',
    carbonPerTce: 1.66,
    nonFossilRatio: 39.0,
    physicalGreenRatio: 36.0,
    unitOutputTce: 0.0886,
    unitOutputYoy: '-4.7%',
    unitAddedValueTce: 0.235,
    unitAddedValueYoy: '-5.1%',
  },
  {
    rank: 18,
    id: 'fac-18',
    name: '赛杰爱迪智能测控与绝缘工厂',
    shortName: '赛杰爱迪工厂',
    parentCompany: '衡变公司',
    industry: '高压测控与绝缘件',
    carbonPerTce: 1.67,
    nonFossilRatio: 38.5,
    physicalGreenRatio: 35.8,
    unitOutputTce: 0.0889,
    unitOutputYoy: '-4.6%',
    unitAddedValueTce: 0.236,
    unitAddedValueYoy: '-5.0%',
  },
  {
    rank: 19,
    id: 'fac-19',
    name: '新疆电缆绿色数字化制造工厂',
    shortName: '新疆电缆制造工厂',
    parentCompany: '新缆厂',
    industry: '中低压及交联电缆',
    carbonPerTce: 1.68,
    nonFossilRatio: 37.2,
    physicalGreenRatio: 34.5,
    unitOutputTce: 0.0892,
    unitOutputYoy: '-5.2%',
    unitAddedValueTce: 0.238,
    unitAddedValueYoy: '-5.6%',
  },
  {
    rank: 20,
    id: 'fac-20',
    name: '鲁缆超高压交联电缆智造工厂',
    shortName: '鲁缆超高压电缆工厂',
    parentCompany: '鲁缆公司',
    industry: '超高压交联电缆及附件',
    carbonPerTce: 1.70,
    nonFossilRatio: 38.5,
    physicalGreenRatio: 35.6,
    unitOutputTce: 0.0895,
    unitOutputYoy: '-5.7%',
    unitAddedValueTce: 0.240,
    unitAddedValueYoy: '-6.3%',
  },
  {
    rank: 21,
    id: 'fac-21',
    name: '德缆特种橡套电缆智造工厂',
    shortName: '德缆特种电缆工厂',
    parentCompany: '德缆公司',
    industry: '橡套与特种矿用电缆',
    carbonPerTce: 1.74,
    nonFossilRatio: 35.5,
    physicalGreenRatio: 32.2,
    unitOutputTce: 0.0898,
    unitOutputYoy: '-4.7%',
    unitAddedValueTce: 0.242,
    unitAddedValueYoy: '-5.1%',
  },
]

const PROJECT_COMPANIES_BENCHMARK_DATA = ZERO_CARBON_FACTORIES_BENCHMARK_DATA


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


// ============================================================================
// 同型号产品项目公司横向对比数据集 (涵盖变压器与线缆各核心产品中类与型号)
// ============================================================================
interface ProductCompanyEnergyItem {
  companyId: string
  companyName: string
  isOptimal: boolean
  tce: number
  elecKWh: number
  steamTon?: number // 变压器专属 (t)
  liquidNitrogenM3?: number // 线缆专属 (m³)
  carbonTce: number // 折合工序碳排放量 (tCO₂e)
  costYuan: number // 综合能源费用 (元)
  diffPercent: string // 与先进基准偏差
  yoyPercent: string // 同比历史
  touElec: { tipPercent: number; peakPercent: number; flatPercent: number; valleyPercent: number }
  processes: Array<{
    processName: string
    elecKWh: number
    steamOrNitrogen: number
    tce: number
    ratio: string
    keyEquipment: string
  }>
  energyMix: { elecRatio: number; steamOrNitrogenRatio: number }
  analysisNote: string
}

interface ProductModelBenchmarkGroup {
  id: string
  industry: 'transformer' | 'cable'
  industryName: string
  broadCategory: string // 产品大类 (如 电力变压器、配电及特种变压器、高压及超高压电缆等)
  kind: string // 产品中类 (如 特高压单相自耦变压器、干式变压器等)
  categoryName?: string // 兼容历史字段
  model: string // 产品型号
  unit: string // 计量单位 (台 / km / 吨)
  companies: ProductCompanyEnergyItem[]
}

const CROSS_COMPANY_PRODUCT_BENCHMARKS: ProductModelBenchmarkGroup[] = [
  // ------------------ 变压器产业 (主要消耗能源：电力、蒸汽) ------------------
  {
    id: 'tx-01',
    industry: 'transformer',
    industryName: '变压器产业',
    broadCategory: '电力变压器',
    kind: '特高压单相自耦变压器',
    categoryName: '特高压单相自耦变压器',
    model: 'ODFS-334MVA/500kV 单相自耦变压器',
    unit: '台',
    companies: [
      {
        companyId: 'hb_main',
        companyName: '衡变本部',
        isOptimal: true,
        tce: 13.82,
        elecKWh: 102400,
        steamTon: 3.2,
        carbonTce: 84.6,
        costYuan: 74800,
        diffPercent: '集团最优基准',
        yoyPercent: '-2.1%',
        touElec: { tipPercent: 12, peakPercent: 36, flatPercent: 34, valleyPercent: 18 },
        processes: [
          { processName: '硅钢横剪剪切与铁芯叠装', elecKWh: 15200, steamOrNitrogen: 0, tce: 1.87, ratio: '13.5%', keyEquipment: '乔格高精横剪线 / 45°斜接缝数控步进叠片机' },
          { processName: '高低压绝缘线圈数控绕制', elecKWh: 18400, steamOrNitrogen: 0, tce: 2.26, ratio: '16.4%', keyEquipment: '立式高精数控绕线机组 (恒张力伺服驱动)' },
          { processName: '器身真空煤油气相干燥', elecKWh: 32800, steamOrNitrogen: 2.8, tce: 5.12, ratio: '37.0%', keyEquipment: '煤油气相干燥炉 (节能冷凝回收)' },
          { processName: '器身引线总装配与注油密封', elecKWh: 12500, steamOrNitrogen: 0.4, tce: 1.68, ratio: '12.2%', keyEquipment: '十万级恒温恒湿净化总装车间' },
          { processName: '特高压出厂综合无局放试验', elecKWh: 23500, steamOrNitrogen: 0, tce: 2.89, ratio: '20.9%', keyEquipment: '特高压全屏蔽试验大厅 (夜间谷电优先)' },
        ],
        energyMix: { elecRatio: 88.5, steamOrNitrogenRatio: 11.5 },
        analysisNote: '煤油气相干燥工序配置变频热管回收，试验工序夜间谷电消纳占比达 42.5%，实测综合单耗 13.82 tce/台。',
      },
      {
        companyId: 'sb_main',
        companyName: '沈变本部',
        isOptimal: false,
        tce: 14.21,
        elecKWh: 105900,
        steamTon: 3.4,
        carbonTce: 87.2,
        costYuan: 77200,
        diffPercent: '+2.8%',
        yoyPercent: '-1.4%',
        touElec: { tipPercent: 14, peakPercent: 38, flatPercent: 32, valleyPercent: 16 },
        processes: [
          { processName: '硅钢横剪剪切与铁芯叠装', elecKWh: 15800, steamOrNitrogen: 0, tce: 1.94, ratio: '13.7%', keyEquipment: '数控剪切线 / 步进自动叠铁台' },
          { processName: '高低压绝缘线圈数控绕制', elecKWh: 19100, steamOrNitrogen: 0, tce: 2.35, ratio: '16.5%', keyEquipment: '卧式及立式自动排线数控绕线机' },
          { processName: '器身真空煤油气相干燥', elecKWh: 34200, steamOrNitrogen: 3.0, tce: 5.31, ratio: '37.4%', keyEquipment: '气相真空干燥罐 (循环蒸汽预热)' },
          { processName: '器身引线总装配与注油密封', elecKWh: 12800, steamOrNitrogen: 0.4, tce: 1.71, ratio: '12.0%', keyEquipment: '十万级装配车间净化送风机组' },
          { processName: '特高压出厂综合无局放试验', elecKWh: 24000, steamOrNitrogen: 0, tce: 2.90, ratio: '20.4%', keyEquipment: '1000kV/500kV 工频与局放测试大厅' },
        ],
        energyMix: { elecRatio: 87.8, steamOrNitrogenRatio: 12.2 },
        analysisNote: '烘房升温阶段实测热耗 5.31 tce，出厂试验集中在日间平段，平段用电占比 32%。',
      },
      {
        companyId: 'xb_uhv',
        companyName: '新变超高压公司',
        isOptimal: false,
        tce: 14.72,
        elecKWh: 109800,
        steamTon: 3.6,
        carbonTce: 90.5,
        costYuan: 80100,
        diffPercent: '+6.5%',
        yoyPercent: '-0.8%',
        touElec: { tipPercent: 16, peakPercent: 40, flatPercent: 30, valleyPercent: 14 },
        processes: [
          { processName: '硅钢横剪剪切与铁芯叠装', elecKWh: 16400, steamOrNitrogen: 0, tce: 2.01, ratio: '13.7%', keyEquipment: '进口数控横剪线 / 悬臂吊装叠片' },
          { processName: '高低压绝缘线圈数控绕制', elecKWh: 19800, steamOrNitrogen: 0, tce: 2.43, ratio: '16.5%', keyEquipment: '数控张力立式绕线机' },
          { processName: '器身真空煤油气相干燥', elecKWh: 35600, steamOrNitrogen: 3.2, tce: 5.52, ratio: '37.5%', keyEquipment: '煤油气相干燥炉 (燃气辅助蒸汽)' },
          { processName: '器身引线总装配与注油密封', elecKWh: 13200, steamOrNitrogen: 0.4, tce: 1.76, ratio: '12.0%', keyEquipment: '恒温总装车间空调恒温恒湿系统' },
          { processName: '特高压出厂综合无局放试验', elecKWh: 24800, steamOrNitrogen: 0, tce: 3.00, ratio: '20.3%', keyEquipment: '无局放试验屏蔽机房' },
        ],
        energyMix: { elecRatio: 87.2, steamOrNitrogenRatio: 12.8 },
        analysisNote: '干燥工序蒸汽消耗量 3.6t/台，冬季厂房供暖能耗叠加，电单耗 109,800 kWh/台。',
      },
      {
        companyId: 'hb_hn',
        companyName: '衡变湖南电气',
        isOptimal: false,
        tce: 14.95,
        elecKWh: 111500,
        steamTon: 3.7,
        carbonTce: 91.8,
        costYuan: 81400,
        diffPercent: '+8.2%',
        yoyPercent: '+0.5%',
        touElec: { tipPercent: 18, peakPercent: 41, flatPercent: 28, valleyPercent: 13 },
        processes: [
          { processName: '硅钢横剪剪切与铁芯叠装', elecKWh: 16700, steamOrNitrogen: 0, tce: 2.05, ratio: '13.7%', keyEquipment: '高速数控剪切机组' },
          { processName: '高低压绝缘线圈数控绕制', elecKWh: 20100, steamOrNitrogen: 0, tce: 2.47, ratio: '16.5%', keyEquipment: '自动涨缩立式绕线机' },
          { processName: '器身真空煤油气相干燥', elecKWh: 36200, steamOrNitrogen: 3.3, tce: 5.61, ratio: '37.5%', keyEquipment: '气相干燥炉' },
          { processName: '器身引线总装配与注油密封', elecKWh: 13400, steamOrNitrogen: 0.4, tce: 1.79, ratio: '12.0%', keyEquipment: '总装引线洁净装配间' },
          { processName: '特高压出厂综合无局放试验', elecKWh: 25100, steamOrNitrogen: 0, tce: 3.03, ratio: '20.3%', keyEquipment: '出厂综合高压试验站' },
        ],
        energyMix: { elecRatio: 86.9, steamOrNitrogenRatio: 13.1 },
        analysisNote: '试验工序尖峰用电比例 18%，真空泵组持续运行实测功耗 36,200 kWh，电费估算 8.14 万元。',
      },
    ],
  },
  {
    id: 'tx-01b',
    industry: 'transformer',
    industryName: '变压器产业',
    broadCategory: '电力变压器',
    kind: '常规大型电力变压器',
    categoryName: '常规大型电力变压器',
    model: 'SFSZ11-240000/220kV 三相三绕组电力变压器',
    unit: '台',
    companies: [
      {
        companyId: 'sb_main',
        companyName: '沈变本部',
        isOptimal: true,
        tce: 8.35,
        elecKWh: 62800,
        steamTon: 2.1,
        carbonTce: 51.3,
        costYuan: 45600,
        diffPercent: '集团最优基准',
        yoyPercent: '-1.9%',
        touElec: { tipPercent: 11, peakPercent: 35, flatPercent: 35, valleyPercent: 19 },
        processes: [
          { processName: '硅钢横剪剪切与铁芯叠装', elecKWh: 9500, steamOrNitrogen: 0, tce: 1.17, ratio: '14.0%', keyEquipment: '数控剪切线 / 自动翻转台' },
          { processName: '线圈数控绕线与压装', elecKWh: 11200, steamOrNitrogen: 0, tce: 1.38, ratio: '16.5%', keyEquipment: '大型立式绕线机组' },
          { processName: '器身真空煤油气相干燥', elecKWh: 20100, steamOrNitrogen: 1.8, tce: 3.10, ratio: '37.1%', keyEquipment: '煤油气相干燥炉' },
          { processName: '器身总装配与引线装配', elecKWh: 7800, steamOrNitrogen: 0.3, tce: 1.05, ratio: '12.6%', keyEquipment: '净化总装线' },
          { processName: '出厂试验及工频耐压', elecKWh: 14200, steamOrNitrogen: 0, tce: 1.65, ratio: '19.8%', keyEquipment: '220kV屏蔽试验室' },
        ],
        energyMix: { elecRatio: 88.0, steamOrNitrogenRatio: 12.0 },
        analysisNote: '规模化批量生产工序节拍平稳，气相干燥批次装载率 92%，实测综合单耗 8.35 tce/台。',
      },
      {
        companyId: 'hb_main',
        companyName: '衡变本部',
        isOptimal: false,
        tce: 8.58,
        elecKWh: 64500,
        steamTon: 2.2,
        carbonTce: 52.8,
        costYuan: 46900,
        diffPercent: '+2.8%',
        yoyPercent: '-1.1%',
        touElec: { tipPercent: 13, peakPercent: 37, flatPercent: 33, valleyPercent: 17 },
        processes: [
          { processName: '硅钢横剪剪切与铁芯叠装', elecKWh: 9800, steamOrNitrogen: 0, tce: 1.20, ratio: '14.0%', keyEquipment: '横剪生产线' },
          { processName: '线圈数控绕线与压装', elecKWh: 11500, steamOrNitrogen: 0, tce: 1.41, ratio: '16.4%', keyEquipment: '卧式排线绕线机' },
          { processName: '器身真空煤油气相干燥', elecKWh: 20800, steamOrNitrogen: 1.9, tce: 3.21, ratio: '37.4%', keyEquipment: '气相干燥炉' },
          { processName: '器身总装配与引线装配', elecKWh: 8000, steamOrNitrogen: 0.3, tce: 1.07, ratio: '12.5%', keyEquipment: '洁净总装工区' },
          { processName: '出厂试验及工频耐压', elecKWh: 14400, steamOrNitrogen: 0, tce: 1.69, ratio: '19.7%', keyEquipment: '变压器试验大厅' },
        ],
        energyMix: { elecRatio: 87.5, steamOrNitrogenRatio: 12.5 },
        analysisNote: '干燥工序蒸汽消耗 2.2t/台，电单耗 64,500 kWh/台，出厂试验电耗 14,400 kWh。',
      },
      {
        companyId: 'xb_tb',
        companyName: '天变通用电气',
        isOptimal: false,
        tce: 8.82,
        elecKWh: 66200,
        steamTon: 2.3,
        carbonTce: 54.2,
        costYuan: 48200,
        diffPercent: '+5.6%',
        yoyPercent: '-0.4%',
        touElec: { tipPercent: 15, peakPercent: 39, flatPercent: 31, valleyPercent: 15 },
        processes: [
          { processName: '硅钢横剪剪切与铁芯叠装', elecKWh: 10100, steamOrNitrogen: 0, tce: 1.24, ratio: '14.1%', keyEquipment: '数控剪切台' },
          { processName: '线圈数控绕线与压装', elecKWh: 11800, steamOrNitrogen: 0, tce: 1.45, ratio: '16.4%', keyEquipment: '立式绕线机' },
          { processName: '器身真空煤油气相干燥', elecKWh: 21400, steamOrNitrogen: 2.0, tce: 3.31, ratio: '37.5%', keyEquipment: '气相干燥炉' },
          { processName: '器身总装配与引线装配', elecKWh: 8200, steamOrNitrogen: 0.3, tce: 1.09, ratio: '12.4%', keyEquipment: '总装车间' },
          { processName: '出厂试验及工频耐压', elecKWh: 14700, steamOrNitrogen: 0, tce: 1.73, ratio: '19.6%', keyEquipment: '高压试验站' },
        ],
        energyMix: { elecRatio: 87.1, steamOrNitrogenRatio: 12.9 },
        analysisNote: '干燥设备炉体保温层表面温度 42℃，蒸汽循环换热器进出口温差 18℃。',
      },
    ],
  },
  {
    id: 'tx-02',
    industry: 'transformer',
    industryName: '变压器产业',
    broadCategory: '配电及特种变压器',
    kind: '干式变压器',
    categoryName: '干式变压器',
    model: 'SCB13-1600kVA/10kV 环氧浇注干变',
    unit: '台',
    companies: [
      {
        companyId: 'xb_tb',
        companyName: '新变天变公司',
        isOptimal: true,
        tce: 0.68,
        elecKWh: 5100,
        steamTon: 0.18,
        carbonTce: 4.18,
        costYuan: 3720,
        diffPercent: '集团最优基准',
        yoyPercent: '-2.4%',
        touElec: { tipPercent: 10, peakPercent: 34, flatPercent: 36, valleyPercent: 20 },
        processes: [
          { processName: '铁芯斜接缝步进剪切', elecKWh: 750, steamOrNitrogen: 0, tce: 0.092, ratio: '13.5%', keyEquipment: '全自动干变铁芯剪叠一体机' },
          { processName: '高低压箔绕与导线绕制', elecKWh: 880, steamOrNitrogen: 0, tce: 0.108, ratio: '15.9%', keyEquipment: '全自动低压铜箔绕线机' },
          { processName: '真空环氧树脂压力浇注', elecKWh: 1950, steamOrNitrogen: 0.15, tce: 0.265, ratio: '39.0%', keyEquipment: '静态混料真空浇注设备组' },
          { processName: '烘房恒温凝胶固化', elecKWh: 820, steamOrNitrogen: 0.03, tce: 0.112, ratio: '16.5%', keyEquipment: '智能变频热风循环固化炉' },
          { processName: '成品出厂性能试验', elecKWh: 700, steamOrNitrogen: 0, tce: 0.086, ratio: '12.6%', keyEquipment: '配电变压器微机试验台' },
        ],
        energyMix: { elecRatio: 89.2, steamOrNitrogenRatio: 10.8 },
        analysisNote: '固化炉温区设定 130℃~150℃，变频控温巡检周期 15s，浇注缸真空度保持 50Pa。',
      },
      {
        companyId: 'xb_zndq',
        companyName: '新变智能电气公司',
        isOptimal: false,
        tce: 0.70,
        elecKWh: 5260,
        steamTon: 0.19,
        carbonTce: 4.31,
        costYuan: 3840,
        diffPercent: '+2.9%',
        yoyPercent: '-1.6%',
        touElec: { tipPercent: 12, peakPercent: 36, flatPercent: 34, valleyPercent: 18 },
        processes: [
          { processName: '铁芯斜接缝步进剪切', elecKWh: 780, steamOrNitrogen: 0, tce: 0.096, ratio: '13.7%', keyEquipment: '数控剪叠生产线' },
          { processName: '高低压箔绕与导线绕制', elecKWh: 910, steamOrNitrogen: 0, tce: 0.112, ratio: '16.0%', keyEquipment: '数控箔式绕线机' },
          { processName: '真空环氧树脂压力浇注', elecKWh: 2010, steamOrNitrogen: 0.16, tce: 0.272, ratio: '38.9%', keyEquipment: '环氧树脂双缸浇注罐' },
          { processName: '烘房恒温凝胶固化', elecKWh: 840, steamOrNitrogen: 0.03, tce: 0.115, ratio: '16.4%', keyEquipment: '电热鼓风固化烘箱' },
          { processName: '成品出厂性能试验', elecKWh: 720, steamOrNitrogen: 0, tce: 0.088, ratio: '12.6%', keyEquipment: '干变全自动测试台' },
        ],
        energyMix: { elecRatio: 88.8, steamOrNitrogenRatio: 11.2 },
        analysisNote: '预热阶段抽真空时长 45min，凝胶固化恒温段时长 180min，单台浇注耗电 2010 kWh。',
      },
      {
        companyId: 'sb_dry',
        companyName: '沈变本部',
        isOptimal: false,
        tce: 0.72,
        elecKWh: 5410,
        steamTon: 0.20,
        carbonTce: 4.43,
        costYuan: 3950,
        diffPercent: '+5.9%',
        yoyPercent: '-0.7%',
        touElec: { tipPercent: 13, peakPercent: 38, flatPercent: 33, valleyPercent: 16 },
        processes: [
          { processName: '铁芯斜接缝步进剪切', elecKWh: 800, steamOrNitrogen: 0, tce: 0.098, ratio: '13.6%', keyEquipment: '高速剪切机' },
          { processName: '高低压箔绕与导线绕制', elecKWh: 930, steamOrNitrogen: 0, tce: 0.114, ratio: '15.8%', keyEquipment: '箔绕机' },
          { processName: '真空环氧树脂压力浇注', elecKWh: 2080, steamOrNitrogen: 0.17, tce: 0.281, ratio: '39.0%', keyEquipment: '真空浇注设备' },
          { processName: '烘房恒温凝胶固化', elecKWh: 860, steamOrNitrogen: 0.03, tce: 0.119, ratio: '16.5%', keyEquipment: '固化加热房' },
          { processName: '成品出厂性能试验', elecKWh: 740, steamOrNitrogen: 0, tce: 0.091, ratio: '12.6%', keyEquipment: '综合性能试验室' },
        ],
        energyMix: { elecRatio: 88.3, steamOrNitrogenRatio: 11.7 },
        analysisNote: '烘房工作温度 140℃，批次固化周期 210min，平均单次炉内装载工件 4 件。',
      },
    ],
  },
  {
    id: 'tx-03',
    industry: 'transformer',
    industryName: '变压器产业',
    broadCategory: '配电及特种变压器',
    kind: '油浸式变压器',
    categoryName: '油浸式变压器',
    model: 'SZ11-50000/110kV 节能型油浸式变压器',
    unit: '台',
    companies: [
      {
        companyId: 'sb_main',
        companyName: '沈变本部',
        isOptimal: true,
        tce: 4.15,
        elecKWh: 31200,
        steamTon: 1.1,
        carbonTce: 25.6,
        costYuan: 22800,
        diffPercent: '集团最优基准',
        yoyPercent: '-2.0%',
        touElec: { tipPercent: 11, peakPercent: 35, flatPercent: 35, valleyPercent: 19 },
        processes: [
          { processName: '硅钢横剪剪切与铁芯叠装', elecKWh: 4800, steamOrNitrogen: 0, tce: 0.59, ratio: '14.2%', keyEquipment: '数控自动叠片机' },
          { processName: '高低压线圈高精绕线', elecKWh: 5600, steamOrNitrogen: 0, tce: 0.69, ratio: '16.6%', keyEquipment: '卧式排线绕线机' },
          { processName: '器身真空热风循环干燥', elecKWh: 10100, steamOrNitrogen: 0.9, tce: 1.54, ratio: '37.1%', keyEquipment: '真空热风干燥系统' },
          { processName: '器身装配与真空注油', elecKWh: 3900, steamOrNitrogen: 0.2, tce: 0.52, ratio: '12.5%', keyEquipment: '恒温恒湿洁净总装区' },
          { processName: '出厂综合高压试验', elecKWh: 6800, steamOrNitrogen: 0, tce: 0.81, ratio: '19.5%', keyEquipment: '110kV综合试验屏蔽站' },
        ],
        energyMix: { elecRatio: 88.2, steamOrNitrogenRatio: 11.8 },
        analysisNote: '热风干燥循环风机运行频率 42Hz，注油工序变压器油预热温度 60℃~65℃。',
      },
      {
        companyId: 'hb_main',
        companyName: '衡变本部',
        isOptimal: false,
        tce: 4.28,
        elecKWh: 32100,
        steamTon: 1.2,
        carbonTce: 26.4,
        costYuan: 23500,
        diffPercent: '+3.1%',
        yoyPercent: '-1.2%',
        touElec: { tipPercent: 13, peakPercent: 37, flatPercent: 33, valleyPercent: 17 },
        processes: [
          { processName: '硅钢横剪剪切与铁芯叠装', elecKWh: 4950, steamOrNitrogen: 0, tce: 0.61, ratio: '14.3%', keyEquipment: '数控步进剪切机' },
          { processName: '高低压线圈高精绕线', elecKWh: 5780, steamOrNitrogen: 0, tce: 0.71, ratio: '16.6%', keyEquipment: '数控绕线台' },
          { processName: '器身真空热风循环干燥', elecKWh: 10400, steamOrNitrogen: 1.0, tce: 1.59, ratio: '37.1%', keyEquipment: '热风干燥炉' },
          { processName: '器身装配与真空注油', elecKWh: 4020, steamOrNitrogen: 0.2, tce: 0.54, ratio: '12.6%', keyEquipment: '总装工位' },
          { processName: '出厂综合高压试验', elecKWh: 6950, steamOrNitrogen: 0, tce: 0.83, ratio: '19.4%', keyEquipment: '试验大厅' },
        ],
        energyMix: { elecRatio: 87.6, steamOrNitrogenRatio: 12.4 },
        analysisNote: '干燥炉排风温度 85℃，热能交换进出口温差 22℃，试验工位瞬时功率 1200kW。',
      },
      {
        companyId: 'xb_jjj',
        companyName: '新变京津冀公司',
        isOptimal: false,
        tce: 4.39,
        elecKWh: 33000,
        steamTon: 1.3,
        carbonTce: 27.1,
        costYuan: 24100,
        diffPercent: '+5.8%',
        yoyPercent: '-0.5%',
        touElec: { tipPercent: 15, peakPercent: 39, flatPercent: 31, valleyPercent: 15 },
        processes: [
          { processName: '硅钢横剪剪切与铁芯叠装', elecKWh: 5100, steamOrNitrogen: 0, tce: 0.63, ratio: '14.4%', keyEquipment: '数控剪叠设备' },
          { processName: '高低压线圈高精绕线', elecKWh: 5950, steamOrNitrogen: 0, tce: 0.73, ratio: '16.6%', keyEquipment: '自动绕线机' },
          { processName: '器身真空热风循环干燥', elecKWh: 10700, steamOrNitrogen: 1.1, tce: 1.63, ratio: '37.1%', keyEquipment: '干燥系统' },
          { processName: '器身装配与真空注油', elecKWh: 4120, steamOrNitrogen: 0.2, tce: 0.55, ratio: '12.5%', keyEquipment: '注油站' },
          { processName: '出厂综合高压试验', elecKWh: 7130, steamOrNitrogen: 0, tce: 0.85, ratio: '19.4%', keyEquipment: '出厂试验台' },
        ],
        energyMix: { elecRatio: 87.0, steamOrNitrogenRatio: 13.0 },
        analysisNote: '真空注油泵组运行功率因数 0.86，蒸汽管网供汽压力 0.6MPa，干燥循环时长 28h。',
      },
    ],
  },
  {
    id: 'tx-04',
    industry: 'transformer',
    industryName: '变压器产业',
    broadCategory: '互感器与套管',
    kind: '六氟化硫电流互感器',
    categoryName: '六氟化硫电流互感器',
    model: 'LVQB-500kV 六氟化硫电流互感器',
    unit: '台',
    companies: [
      {
        companyId: 'sb_kj',
        companyName: '沈变康嘉互感器',
        isOptimal: true,
        tce: 0.42,
        elecKWh: 3150,
        steamTon: 0.12,
        carbonTce: 2.58,
        costYuan: 2310,
        diffPercent: '集团最优基准',
        yoyPercent: '-2.3%',
        touElec: { tipPercent: 10, peakPercent: 34, flatPercent: 36, valleyPercent: 20 },
        processes: [
          { processName: '二次线圈环形数控绕制', elecKWh: 510, steamOrNitrogen: 0, tce: 0.063, ratio: '15.0%', keyEquipment: '精密环形数控绕线机' },
          { processName: '一次导电杆装配与绝缘包扎', elecKWh: 480, steamOrNitrogen: 0, tce: 0.059, ratio: '14.0%', keyEquipment: '恒张力自动绝缘包带机' },
          { processName: '产品总装配与抽真空充气', elecKWh: 1220, steamOrNitrogen: 0.10, tce: 0.168, ratio: '40.0%', keyEquipment: '全封闭SF6气体回收充放一体机' },
          { processName: '出厂绝缘局部放电试验', elecKWh: 940, steamOrNitrogen: 0.02, tce: 0.130, ratio: '31.0%', keyEquipment: '750kV无局放工频谐振试验系统' },
        ],
        energyMix: { elecRatio: 90.5, steamOrNitrogenRatio: 9.5 },
        analysisNote: 'SF6 充气回收系统工作压力 0.45MPa，充气回收循环残压 <10Pa，局放试验电压 500kV。',
      },
      {
        companyId: 'sb_hx',
        companyName: '沈变和新套管公司',
        isOptimal: false,
        tce: 0.45,
        elecKWh: 3380,
        steamTon: 0.13,
        carbonTce: 2.76,
        costYuan: 2480,
        diffPercent: '+7.1%',
        yoyPercent: '-0.6%',
        touElec: { tipPercent: 14, peakPercent: 38, flatPercent: 32, valleyPercent: 16 },
        processes: [
          { processName: '二次线圈环形数控绕制', elecKWh: 540, steamOrNitrogen: 0, tce: 0.067, ratio: '14.9%', keyEquipment: '环形绕线设备' },
          { processName: '一次导电杆装配与绝缘包扎', elecKWh: 510, steamOrNitrogen: 0, tce: 0.063, ratio: '14.0%', keyEquipment: '手动半自动包带机' },
          { processName: '产品总装配与抽真空充气', elecKWh: 1310, steamOrNitrogen: 0.11, tce: 0.180, ratio: '40.0%', keyEquipment: 'SF6充气台' },
          { processName: '出厂绝缘局部放电试验', elecKWh: 1020, steamOrNitrogen: 0.02, tce: 0.140, ratio: '31.1%', keyEquipment: '局放试验仪' },
        ],
        energyMix: { elecRatio: 89.8, steamOrNitrogenRatio: 10.2 },
        analysisNote: '充气前抽真空时长 65min，试验阶段背景局放量 <2pC，出厂耐压试验时长 60min。',
      },
    ],
  },

  // ------------------ 线缆产业 (主要消耗能源：电力、液氮) ------------------
  {
    id: 'cb-01',
    industry: 'cable',
    industryName: '线缆产业',
    broadCategory: '高压及超高压电缆',
    kind: '高压交联电缆',
    categoryName: '高压交联电缆',
    model: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)',
    unit: 'km',
    companies: [
      {
        companyId: 'll_main',
        companyName: '鲁缆本部',
        isOptimal: true,
        tce: 0.582,
        elecKWh: 4380,
        liquidNitrogenM3: 8.5,
        carbonTce: 3.58,
        costYuan: 3210,
        diffPercent: '集团最优基准',
        yoyPercent: '-2.5%',
        touElec: { tipPercent: 9, peakPercent: 32, flatPercent: 37, valleyPercent: 22 },
        processes: [
          { processName: '无氧铜杆多头大拉及连续退火', elecKWh: 980, steamOrNitrogen: 0, tce: 0.120, ratio: '20.6%', keyEquipment: '多头铜大拉连退机组 (变频恒张力)' },
          { processName: '高紧压紧凑导体框式绞合', elecKWh: 560, steamOrNitrogen: 0, tce: 0.069, ratio: '11.9%', keyEquipment: '61盘高速刚性框绞机' },
          { processName: '超高压立塔干法悬垂交联三层共挤', elecKWh: 2120, steamOrNitrogen: 7.2, tce: 0.285, ratio: '49.0%', keyEquipment: 'VCV立塔干法交联机组 (高纯液氮循环密闭保护)' },
          { processName: '皱纹铝套连续轧纹密封外护', elecKWh: 420, steamOrNitrogen: 1.3, tce: 0.062, ratio: '10.7%', keyEquipment: '铝护套连续连轧包覆机' },
          { processName: '高压局部放电与成品耐压试验', elecKWh: 300, steamOrNitrogen: 0, tce: 0.046, ratio: '7.9%', keyEquipment: '全屏蔽高压局放耐压试验系统' },
        ],
        energyMix: { elecRatio: 92.4, steamOrNitrogenRatio: 7.6 },
        analysisNote: 'VCV 立塔交联机机头温度 180℃~200℃，管道液氮保护气压 1.6MPa，牵引线速 4.2m/min。',
      },
      {
        companyId: 'xl_main',
        companyName: '新疆电缆公司',
        isOptimal: false,
        tce: 0.605,
        elecKWh: 4550,
        liquidNitrogenM3: 9.2,
        carbonTce: 3.72,
        costYuan: 3340,
        diffPercent: '+3.9%',
        yoyPercent: '-1.3%',
        touElec: { tipPercent: 12, peakPercent: 35, flatPercent: 34, valleyPercent: 19 },
        processes: [
          { processName: '无氧铜杆多头大拉及连续退火', elecKWh: 1020, steamOrNitrogen: 0, tce: 0.125, ratio: '20.7%', keyEquipment: '大拉机组' },
          { processName: '高紧压紧凑导体框式绞合', elecKWh: 580, steamOrNitrogen: 0, tce: 0.071, ratio: '11.7%', keyEquipment: '框式绞线机' },
          { processName: '超高压立塔干法悬垂交联三层共挤', elecKWh: 2200, steamOrNitrogen: 7.8, tce: 0.296, ratio: '48.9%', keyEquipment: '悬垂立塔交联机' },
          { processName: '皱纹铝套连续轧纹密封外护', elecKWh: 440, steamOrNitrogen: 1.4, tce: 0.066, ratio: '10.9%', keyEquipment: '铝包轧机' },
          { processName: '高压局部放电与成品耐压试验', elecKWh: 310, steamOrNitrogen: 0, tce: 0.047, ratio: '7.8%', keyEquipment: '高压试验台' },
        ],
        energyMix: { elecRatio: 91.8, steamOrNitrogenRatio: 8.2 },
        analysisNote: '交联段管道温度梯度 195℃~210℃，预热段加热功率 145kW，环境工作温度 18℃。',
      },
      {
        companyId: 'dl_main',
        companyName: '德阳电缆股份',
        isOptimal: false,
        tce: 0.628,
        elecKWh: 4720,
        liquidNitrogenM3: 9.8,
        carbonTce: 3.86,
        costYuan: 3460,
        diffPercent: '+7.9%',
        yoyPercent: '-0.5%',
        touElec: { tipPercent: 15, peakPercent: 38, flatPercent: 31, valleyPercent: 16 },
        processes: [
          { processName: '无氧铜杆多头大拉及连续退火', elecKWh: 1060, steamOrNitrogen: 0, tce: 0.130, ratio: '20.7%', keyEquipment: '连退大拉机' },
          { processName: '高紧压紧凑导体框式绞合', elecKWh: 600, steamOrNitrogen: 0, tce: 0.074, ratio: '11.8%', keyEquipment: '框绞机' },
          { processName: '超高压立塔干法悬垂交联三层共挤', elecKWh: 2280, steamOrNitrogen: 8.3, tce: 0.307, ratio: '48.9%', keyEquipment: '立式交联管道' },
          { processName: '皱纹铝套连续轧纹密封外护', elecKWh: 460, steamOrNitrogen: 1.5, tce: 0.069, ratio: '11.0%', keyEquipment: '波纹包覆机' },
          { processName: '高压局部放电与成品耐压试验', elecKWh: 320, steamOrNitrogen: 0, tce: 0.048, ratio: '7.6%', keyEquipment: '局放屏蔽室' },
        ],
        energyMix: { elecRatio: 91.1, steamOrNitrogenRatio: 8.9 },
        analysisNote: '交联冷却段水温 16℃，液氮瞬时补给流量 1.2m³/h，轧纹机主电机转速 850rpm。',
      },
    ],
  },
  {
    id: 'cb-02',
    industry: 'cable',
    industryName: '线缆产业',
    broadCategory: '中低压电力电缆',
    kind: '中压铠装电缆',
    categoryName: '中压铠装电缆',
    model: '35kV 铠装电力电缆 (YJV22-26/35kV 3*300)',
    unit: 'km',
    companies: [
      {
        companyId: 'xl_sub',
        companyName: '新疆线缆厂',
        isOptimal: true,
        tce: 0.234,
        elecKWh: 1760,
        liquidNitrogenM3: 4.2,
        carbonTce: 1.44,
        costYuan: 1290,
        diffPercent: '集团最优基准',
        yoyPercent: '-2.2%',
        touElec: { tipPercent: 10, peakPercent: 33, flatPercent: 36, valleyPercent: 21 },
        processes: [
          { processName: '导体中拉及绞线成型', elecKWh: 420, steamOrNitrogen: 0, tce: 0.052, ratio: '22.2%', keyEquipment: '双盘中拉退火机组' },
          { processName: '悬链式干法交联绝缘挤出', elecKWh: 880, steamOrNitrogen: 3.5, tce: 0.116, ratio: '49.6%', keyEquipment: 'CCV悬链交联生产线 (节能温控)' },
          { processName: '成缆与双层钢带铠装', elecKWh: 260, steamOrNitrogen: 0.7, tce: 0.038, ratio: '16.2%', keyEquipment: '三芯成缆钢带铠装机' },
          { processName: 'PVC/PE 外护套连续挤塑与质检', elecKWh: 200, steamOrNitrogen: 0, tce: 0.028, ratio: '12.0%', keyEquipment: '150挤塑机组及耐压测试' },
        ],
        energyMix: { elecRatio: 93.1, steamOrNitrogenRatio: 6.9 },
        analysisNote: 'CCV 悬链交联线牵引线速 12.5m/min，硫化管道压力 1.4MPa，铠装节距 85mm。',
      },
      {
        companyId: 'll_main',
        companyName: '鲁缆本部',
        isOptimal: false,
        tce: 0.241,
        elecKWh: 1810,
        liquidNitrogenM3: 4.5,
        carbonTce: 1.48,
        costYuan: 1330,
        diffPercent: '+3.0%',
        yoyPercent: '-1.5%',
        touElec: { tipPercent: 11, peakPercent: 34, flatPercent: 35, valleyPercent: 20 },
        processes: [
          { processName: '导体中拉及绞线成型', elecKWh: 430, steamOrNitrogen: 0, tce: 0.053, ratio: '22.0%', keyEquipment: '双头中拉机' },
          { processName: '悬链式干法交联绝缘挤出', elecKWh: 910, steamOrNitrogen: 3.7, tce: 0.120, ratio: '49.8%', keyEquipment: '交联挤出机' },
          { processName: '成缆与双层钢带铠装', elecKWh: 270, steamOrNitrogen: 0.8, tce: 0.039, ratio: '16.2%', keyEquipment: '成缆铠装线' },
          { processName: 'PVC/PE 外护套连续挤塑与质检', elecKWh: 200, steamOrNitrogen: 0, tce: 0.029, ratio: '12.0%', keyEquipment: '挤塑外护线' },
        ],
        energyMix: { elecRatio: 92.5, steamOrNitrogenRatio: 7.5 },
        analysisNote: '模头挤出温度设定 175℃，加热圈功率因数 0.92，钢带铠装机转速 240rpm。',
      },
      {
        companyId: 'dl_main',
        companyName: '德阳电缆股份',
        isOptimal: false,
        tce: 0.252,
        elecKWh: 1900,
        liquidNitrogenM3: 4.8,
        carbonTce: 1.55,
        costYuan: 1390,
        diffPercent: '+7.7%',
        yoyPercent: '-0.3%',
        touElec: { tipPercent: 14, peakPercent: 37, flatPercent: 32, valleyPercent: 17 },
        processes: [
          { processName: '导体中拉及绞线成型', elecKWh: 450, steamOrNitrogen: 0, tce: 0.055, ratio: '21.8%', keyEquipment: '拉线机' },
          { processName: '悬链式干法交联绝缘挤出', elecKWh: 950, steamOrNitrogen: 4.0, tce: 0.126, ratio: '50.0%', keyEquipment: '悬链交联线' },
          { processName: '成缆与双层钢带铠装', elecKWh: 290, steamOrNitrogen: 0.8, tce: 0.041, ratio: '16.3%', keyEquipment: '铠装机' },
          { processName: 'PVC/PE 外护套连续挤塑与质检', elecKWh: 210, steamOrNitrogen: 0, tce: 0.030, ratio: '11.9%', keyEquipment: '挤塑线' },
        ],
        energyMix: { elecRatio: 91.8, steamOrNitrogenRatio: 8.2 },
        analysisNote: '换产模具预热耗时 35min，护套挤塑机螺杆转速 45rpm，成缆绞合节距 320mm。',
      },
    ],
  },
  {
    id: 'cb-03',
    industry: 'cable',
    industryName: '线缆产业',
    broadCategory: '铜铝导线拉丝',
    kind: '连续铜杆拉丝',
    categoryName: '连续铜杆拉丝',
    model: '连续铜杆拉丝 (Φ1.2mm~Φ3.0mm 硬铜单线)',
    unit: '吨',
    companies: [
      {
        companyId: 'll_main',
        companyName: '鲁缆本部',
        isOptimal: true,
        tce: 0.042,
        elecKWh: 315,
        liquidNitrogenM3: 0.8,
        carbonTce: 0.26,
        costYuan: 230,
        diffPercent: '集团最优基准',
        yoyPercent: '-3.1%',
        touElec: { tipPercent: 8, peakPercent: 30, flatPercent: 38, valleyPercent: 24 },
        processes: [
          { processName: 'Φ8mm 铜杆入厂在线超声波清洗', elecKWh: 35, steamOrNitrogen: 0, tce: 0.005, ratio: '11.9%', keyEquipment: '在线超声清洗除氧化皮机' },
          { processName: '高速多模大拉连续冷拔变形', elecKWh: 195, steamOrNitrogen: 0, tce: 0.026, ratio: '61.9%', keyEquipment: '13模高速浸没式铜大拉机组' },
          { processName: '蒸汽/氮气保护管式在线连退', elecKWh: 60, steamOrNitrogen: 0.8, tce: 0.008, ratio: '19.0%', keyEquipment: '直流脉冲连续感应退火装置' },
          { processName: '双盘全自动连续精密收线', elecKWh: 25, steamOrNitrogen: 0, tce: 0.003, ratio: '7.2%', keyEquipment: '智能双盘气动精密排线收线机' },
        ],
        energyMix: { elecRatio: 94.2, steamOrNitrogenRatio: 5.8 },
        analysisNote: '13 模拉丝出线线速 25m/s，退火段直流电压 48V，乳化液循环温度控制在 38℃~42℃。',
      },
      {
        companyId: 'xl_main',
        companyName: '新疆电缆公司',
        isOptimal: false,
        tce: 0.044,
        elecKWh: 330,
        liquidNitrogenM3: 0.9,
        carbonTce: 0.27,
        costYuan: 242,
        diffPercent: '+4.8%',
        yoyPercent: '-1.6%',
        touElec: { tipPercent: 11, peakPercent: 33, flatPercent: 36, valleyPercent: 20 },
        processes: [
          { processName: 'Φ8mm 铜杆入厂在线清洗', elecKWh: 37, steamOrNitrogen: 0, tce: 0.005, ratio: '11.4%', keyEquipment: '酸洗清洗机' },
          { processName: '高速多模大拉连续冷拔变形', elecKWh: 205, steamOrNitrogen: 0, tce: 0.027, ratio: '61.4%', keyEquipment: '浸没大拉机' },
          { processName: '蒸汽/氮气保护在线连退', elecKWh: 62, steamOrNitrogen: 0.9, tce: 0.009, ratio: '20.5%', keyEquipment: '连退装置' },
          { processName: '双盘全自动连续收线', elecKWh: 26, steamOrNitrogen: 0, tce: 0.003, ratio: '6.7%', keyEquipment: '双盘收线机' },
        ],
        energyMix: { elecRatio: 93.5, steamOrNitrogenRatio: 6.5 },
        analysisNote: '退火区保护氮气纯度 99.999%，出线线速 22m/s，退火电流 850A，排线张力 120N。',
      },
      {
        companyId: 'dl_main',
        companyName: '德阳电缆股份',
        isOptimal: false,
        tce: 0.046,
        elecKWh: 345,
        liquidNitrogenM3: 1.0,
        carbonTce: 0.28,
        costYuan: 253,
        diffPercent: '+9.5%',
        yoyPercent: '-0.8%',
        touElec: { tipPercent: 13, peakPercent: 36, flatPercent: 33, valleyPercent: 18 },
        processes: [
          { processName: 'Φ8mm 铜杆入厂在线清洗', elecKWh: 39, steamOrNitrogen: 0, tce: 0.005, ratio: '10.9%', keyEquipment: '清洗机' },
          { processName: '高速多模大拉连续冷拔变形', elecKWh: 215, steamOrNitrogen: 0, tce: 0.029, ratio: '63.0%', keyEquipment: '大拉机' },
          { processName: '蒸汽/氮气保护在线连退', elecKWh: 64, steamOrNitrogen: 1.0, tce: 0.009, ratio: '19.6%', keyEquipment: '退火机' },
          { processName: '双盘全自动连续收线', elecKWh: 27, steamOrNitrogen: 0, tce: 0.003, ratio: '6.5%', keyEquipment: '收线机' },
        ],
        energyMix: { elecRatio: 93.0, steamOrNitrogenRatio: 7.0 },
        analysisNote: '乳化液循环泵扬程 32m，冷却塔进水温度 45℃、出水温度 35℃，拉丝主电机功率 280kW。',
      },
    ],
  },
  {
    id: 'cb-04',
    industry: 'cable',
    industryName: '线缆产业',
    broadCategory: '特种装备电缆',
    kind: '风电与光伏软电缆',
    categoryName: '风电与光伏软电缆',
    model: '光伏及风电耐寒耐扭曲特种软电缆',
    unit: 'km',
    companies: [
      {
        companyId: 'll_sg',
        companyName: '鲁缆曙光公司',
        isOptimal: true,
        tce: 0.155,
        elecKWh: 1165,
        liquidNitrogenM3: 2.8,
        carbonTce: 0.95,
        costYuan: 855,
        diffPercent: '集团最优基准',
        yoyPercent: '-2.8%',
        touElec: { tipPercent: 9, peakPercent: 31, flatPercent: 37, valleyPercent: 23 },
        processes: [
          { processName: '镀锡多股微细无氧铜丝束绞', elecKWh: 280, steamOrNitrogen: 0, tce: 0.035, ratio: '22.6%', keyEquipment: '高速双绞束线机组' },
          { processName: '耐寒耐扭低烟无卤绝缘连续挤出', elecKWh: 540, steamOrNitrogen: 2.2, tce: 0.076, ratio: '49.0%', keyEquipment: '特种硅橡胶/无卤双螺杆挤塑线' },
          { processName: '中心加强芯成缆与防扭芳纶编织', elecKWh: 195, steamOrNitrogen: 0, tce: 0.026, ratio: '16.8%', keyEquipment: '高速特种铠装编织机' },
          { processName: '耐磨外护套挤塑与成品冷弯测试', elecKWh: 150, steamOrNitrogen: 0.6, tce: 0.018, ratio: '11.6%', keyEquipment: '护套机组与微机冷弯测试仪' },
        ],
        energyMix: { elecRatio: 93.8, steamOrNitrogenRatio: 6.2 },
        analysisNote: '双螺杆挤塑机模温 165℃±1℃，防扭芳纶编织转速 180rpm，冷弯测试温度 -40℃。',
      },
      {
        companyId: 'xl_main',
        companyName: '新疆电缆公司',
        isOptimal: false,
        tce: 0.162,
        elecKWh: 1220,
        liquidNitrogenM3: 3.0,
        carbonTce: 0.99,
        costYuan: 896,
        diffPercent: '+4.7%',
        yoyPercent: '-1.4%',
        touElec: { tipPercent: 11, peakPercent: 34, flatPercent: 35, valleyPercent: 20 },
        processes: [
          { processName: '镀锡多股微细无氧铜丝束绞', elecKWh: 290, steamOrNitrogen: 0, tce: 0.036, ratio: '22.2%', keyEquipment: '高速束线机' },
          { processName: '耐寒耐扭低烟无卤绝缘挤出', elecKWh: 570, steamOrNitrogen: 2.4, tce: 0.080, ratio: '49.4%', keyEquipment: '特种挤塑机' },
          { processName: '中心加强芯成缆与防扭编织', elecKWh: 205, steamOrNitrogen: 0, tce: 0.027, ratio: '16.7%', keyEquipment: '编织机' },
          { processName: '耐磨外护套挤塑与成品测试', elecKWh: 155, steamOrNitrogen: 0.6, tce: 0.019, ratio: '11.7%', keyEquipment: '护套机' },
        ],
        energyMix: { elecRatio: 93.2, steamOrNitrogenRatio: 6.8 },
        analysisNote: '成缆编织放线恒张力 25N，绝缘挤塑段机筒温度 170℃，牵引速度 8.0m/min。',
      },
      {
        companyId: 'dl_main',
        companyName: '德阳电缆股份',
        isOptimal: false,
        tce: 0.168,
        elecKWh: 1265,
        liquidNitrogenM3: 3.2,
        carbonTce: 1.04,
        costYuan: 928,
        diffPercent: '+8.6%',
        yoyPercent: '-0.2%',
        touElec: { tipPercent: 13, peakPercent: 36, flatPercent: 33, valleyPercent: 18 },
        processes: [
          { processName: '镀锡多股微细无氧铜丝束绞', elecKWh: 300, steamOrNitrogen: 0, tce: 0.038, ratio: '22.6%', keyEquipment: '束线机' },
          { processName: '耐寒耐扭低烟无卤绝缘挤出', elecKWh: 590, steamOrNitrogen: 2.5, tce: 0.083, ratio: '49.4%', keyEquipment: '挤出机' },
          { processName: '中心加强芯成缆与防扭编织', elecKWh: 215, steamOrNitrogen: 0, tce: 0.028, ratio: '16.7%', keyEquipment: '成缆编织' },
          { processName: '耐磨外护套挤塑与成品测试', elecKWh: 160, steamOrNitrogen: 0.7, tce: 0.019, ratio: '11.3%', keyEquipment: '护套机' },
        ],
        energyMix: { elecRatio: 92.6, steamOrNitrogenRatio: 7.4 },
        analysisNote: '双绞束线线速 150m/min，外护套挤出温度 160℃，芳纶编织股数 24 锭。',
      },
    ],
  },
]


// ============================================================================
// 产品单耗对比（纵向） - 单位-产线-产品中类-型号 级联结构数据
// ============================================================================
interface ProductCascadeStructure {
  id: string
  name: string // 单位名称
  lines: {
    id: string
    name: string // 产线名称
    categories: {
      id: string
      name: string // 产品中类
      broadCategory: string // 产品大类 (电力变压器、配电及特种变压器、互感器与套管 / 高压及特高压交联电缆、中低压电力电缆、特种装备电缆)
      models: {
        id: string
        name: string // 产品型号
        unit: string
        baseTce: number
        currTce: number
        baseElec: number
        currElec: number
        baseSteam?: number
        currSteam?: number
        baseNitrogen?: number
        currNitrogen?: number
        baseGas?: number
        currGas?: number
        baseWater?: number
        currWater?: number
      }[]
    }[]
  }[]
}

const TRANSFORMER_CASCADE_DATA: ProductCascadeStructure[] = [
  {
    id: 'hb',
    name: '衡变公司',
    lines: [
      {
        id: 'hb-line-1',
        name: '衡变本部 (特高压大件制造车间)',
        categories: [
          {
            id: 'hb-cat-1',
            name: '变压器-高压 (特高压单相自耦)',
            broadCategory: '电力变压器',
            models: [
              {
                id: 'hb-m-1',
                name: 'ODFS-334MVA/500kV 单相自耦变压器',
                unit: '台',
                baseTce: 14.52,
                currTce: 13.82,
                baseElec: 107500,
                currElec: 102400,
                baseSteam: 3.5,
                currSteam: 3.2,
                baseGas: 48.5,
                currGas: 45.0,
                baseWater: 19.8,
                currWater: 18.5,
              },
              {
                id: 'hb-m-2',
                name: 'ODFS-250MVA/500kV 自耦变压器',
                unit: '台',
                baseTce: 11.20,
                currTce: 10.65,
                baseElec: 83000,
                currElec: 78900,
                baseSteam: 2.8,
                currSteam: 2.5,
                baseGas: 38.0,
                currGas: 35.2,
                baseWater: 15.2,
                currWater: 14.0,
              },
            ],
          },
          {
            id: 'hb-cat-2',
            name: '变压器-中低压-油变',
            broadCategory: '配电及特种变压器',
            models: [
              {
                id: 'hb-m-3',
                name: 'SZ11-50000/110kV 节能型油浸式变压器',
                unit: '台',
                baseTce: 4.45,
                currTce: 4.28,
                baseElec: 33400,
                currElec: 32100,
                baseSteam: 1.3,
                currSteam: 1.2,
                baseGas: 17.8,
                currGas: 16.5,
                baseWater: 9.2,
                currWater: 8.6,
              },
            ],
          },
        ],
      },
      {
        id: 'hb-line-2',
        name: '湖南电气 (变压器-高压制造车间)',
        categories: [
          {
            id: 'hb-cat-3',
            name: '变压器-高压 (超高压电力变)',
            broadCategory: '电力变压器',
            models: [
              {
                id: 'hb-m-4',
                name: 'SFZ11-240MVA/220kV 三相三线圈电力变',
                unit: '台',
                baseTce: 8.20,
                currTce: 7.85,
                baseElec: 61500,
                currElec: 58900,
                baseSteam: 2.1,
                currSteam: 1.9,
                baseGas: 28.5,
                currGas: 26.8,
                baseWater: 12.0,
                currWater: 11.2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sb',
    name: '沈变公司',
    lines: [
      {
        id: 'sb-line-1',
        name: '沈变本部 (超高压大件装配车间)',
        categories: [
          {
            id: 'sb-cat-1',
            name: '变压器-高压 (特高压单相自耦)',
            broadCategory: '电力变压器',
            models: [
              {
                id: 'sb-m-1',
                name: 'ODFS-334MVA/500kV 单相自耦变压器',
                unit: '台',
                baseTce: 14.85,
                currTce: 14.21,
                baseElec: 110200,
                currElec: 105900,
                baseSteam: 3.6,
                currSteam: 3.4,
                baseGas: 51.0,
                currGas: 48.0,
                baseWater: 20.5,
                currWater: 19.2,
              },
            ],
          },
        ],
      },
      {
        id: 'sb-line-2',
        name: '康嘉互感器 (互感器制造部)',
        categories: [
          {
            id: 'sb-cat-2',
            name: '互感器',
            broadCategory: '互感器与套管',
            models: [
              {
                id: 'sb-m-2',
                name: 'LVQB-500kV 六氟化硫电流互感器',
                unit: '台',
                baseTce: 0.44,
                currTce: 0.42,
                baseElec: 3300,
                currElec: 3150,
                baseSteam: 0.13,
                currSteam: 0.12,
                baseGas: 4.4,
                currGas: 4.2,
                baseWater: 1.6,
                currWater: 1.5,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'xb',
    name: '新变厂',
    lines: [
      {
        id: 'xb-line-1',
        name: '超高压公司 (特高压变压器制造部)',
        categories: [
          {
            id: 'xb-cat-1',
            name: '变压器-高压 (特高压单相自耦)',
            broadCategory: '电力变压器',
            models: [
              {
                id: 'xb-m-1',
                name: 'ODFS-334MVA/500kV 单相自耦变压器',
                unit: '台',
                baseTce: 15.30,
                currTce: 14.72,
                baseElec: 114000,
                currElec: 109800,
                baseSteam: 3.8,
                currSteam: 3.6,
                baseGas: 55.0,
                currGas: 52.0,
                baseWater: 21.2,
                currWater: 20.1,
              },
            ],
          },
        ],
      },
      {
        id: 'xb-line-2',
        name: '天变公司 (变压器-中低压-干变车间)',
        categories: [
          {
            id: 'xb-cat-2',
            name: '变压器-中低压-干变',
            broadCategory: '配电及特种变压器',
            models: [
              {
                id: 'xb-m-2',
                name: 'SCB13-1600kVA/10kV 环氧浇注干变',
                unit: '台',
                baseTce: 0.72,
                currTce: 0.68,
                baseElec: 5400,
                currElec: 5100,
                baseSteam: 0.19,
                currSteam: 0.18,
                baseGas: 6.6,
                currGas: 6.2,
                baseWater: 2.2,
                currWater: 2.1,
              },
            ],
          },
        ],
      },
      {
        id: 'xb-line-3',
        name: '京津冀公司 (变压器-中低压-油变车间)',
        categories: [
          {
            id: 'xb-cat-3',
            name: '变压器-中低压-油变',
            broadCategory: '配电及特种变压器',
            models: [
              {
                id: 'xb-m-3',
                name: 'SZ11-50000/110kV 节能型油浸式变压器',
                unit: '台',
                baseTce: 4.58,
                currTce: 4.39,
                baseElec: 34500,
                currElec: 33000,
                baseSteam: 1.35,
                currSteam: 1.30,
                baseGas: 18.2,
                currGas: 17.0,
                baseWater: 9.4,
                currWater: 8.9,
              },
            ],
          },
        ],
      },
    ],
  },
]

const CABLE_CASCADE_DATA: ProductCascadeStructure[] = [
  {
    id: 'll',
    name: '鲁缆公司',
    lines: [
      {
        id: 'll-line-1',
        name: '超高压立塔交联挤塑产线',
        categories: [
          {
            id: 'll-cat-1',
            name: '高压交联电力电缆',
            broadCategory: '高压及特高压交联电缆',
            models: [
              {
                id: 'll-m-1',
                name: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)',
                unit: 'km',
                baseTce: 0.612,
                currTce: 0.582,
                baseElec: 4600,
                currElec: 4380,
                baseNitrogen: 18.5,
                currNitrogen: 17.2,
                baseGas: 9.1,
                currGas: 8.5,
                baseWater: 2.0,
                currWater: 1.8,
              },
            ],
          },
          {
            id: 'll-cat-2',
            name: '中压交联电力电缆',
            broadCategory: '中低压电力电缆',
            models: [
              {
                id: 'll-m-2',
                name: '35kV 铠装电力电缆 (YJV22-26/35kV 3*300)',
                unit: 'km',
                baseTce: 0.252,
                currTce: 0.241,
                baseElec: 1890,
                currElec: 1810,
                baseNitrogen: 10.5,
                currNitrogen: 9.8,
                baseGas: 4.8,
                currGas: 4.5,
                baseWater: 1.1,
                currWater: 1.0,
              },
            ],
          },
          {
            id: 'll-cat-4',
            name: '特种耐火交联电缆',
            broadCategory: '特种装备电缆',
            models: [
              {
                id: 'll-m-4',
                name: '光伏及风电耐寒特种软电缆 (WDZ-YJY)',
                unit: 'km',
                baseTce: 0.165,
                currTce: 0.155,
                baseElec: 1240,
                currElec: 1165,
                baseNitrogen: 3.0,
                currNitrogen: 2.8,
                baseGas: 2.5,
                currGas: 2.2,
                baseWater: 0.6,
                currWater: 0.52,
              },
            ],
          },
        ],
      },
      {
        id: 'll-line-2',
        name: '架空导线连续绞制产线',
        categories: [
          {
            id: 'll-cat-3',
            name: '架空绝缘导线',
            broadCategory: '中低压电力电缆',
            models: [
              {
                id: 'll-m-3',
                name: '10kV 架空交联导线 (JKLYJ-10kV 1*120)',
                unit: 'km',
                baseTce: 0.069,
                currTce: 0.065,
                baseElec: 520,
                currElec: 490,
                baseNitrogen: 4.2,
                currNitrogen: 3.8,
                baseGas: 1.3,
                currGas: 1.2,
                baseWater: 0.35,
                currWater: 0.3,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'xl',
    name: '新缆厂',
    lines: [
      {
        id: 'xl-line-1',
        name: '特高压立塔连续挤塑产线',
        categories: [
          {
            id: 'xl-cat-1',
            name: '高压交联电力电缆',
            broadCategory: '高压及特高压交联电缆',
            models: [
              {
                id: 'xl-m-1',
                name: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)',
                unit: 'km',
                baseTce: 0.635,
                currTce: 0.605,
                baseElec: 4780,
                currElec: 4550,
                baseNitrogen: 19.0,
                currNitrogen: 17.8,
                baseGas: 9.6,
                currGas: 9.2,
                baseWater: 2.1,
                currWater: 1.9,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'dl',
    name: '德缆公司',
    lines: [
      {
        id: 'dl-line-1',
        name: '低压绝缘连续挤出产线',
        categories: [
          {
            id: 'dl-cat-1',
            name: '低压阻燃电力电缆',
            broadCategory: '中低压电力电缆',
            models: [
              {
                id: 'dl-m-1',
                name: '0.6/1kV 阻燃铜芯电缆 (ZR-YJV-0.6/1kV 4*240)',
                unit: 'km',
                baseTce: 0.118,
                currTce: 0.112,
                baseElec: 890,
                currElec: 845,
                baseNitrogen: 6.8,
                currNitrogen: 6.2,
                baseGas: 2.3,
                currGas: 2.1,
                baseWater: 0.55,
                currWater: 0.5,
              },
            ],
          },
        ],
      },
    ],
  },
]


// ============================================================================
// 关键工序单耗对比数据集 (变压器 / 线缆 / 中低压开关 相同工序横向对标)
// ============================================================================
interface ProcessCompanyValue {
  companyId: string
  companyName: string
  value: number
  isOptimal: boolean
  diffGroupPct: string
}

interface SharedProcessBenchmarkGroup {
  id: string
  industry: 'transformer' | 'cable' | 'switch'
  industryName: string
  mainProduct: string // 关联主要产品
  processName: string
  unit: string
  energyTypes: string // 主要消耗能源 (电力、蒸汽、氮气等)
  industryBenchmark?: number // 行业先进基准 (有些有，有些没有)
  industryBenchmarkSource?: string
  groupAvg: number // 集团平均线 (所有工序都有!)
  companies: ProcessCompanyValue[]
}

const SHARED_PROCESS_BENCHMARKS: SharedProcessBenchmarkGroup[] = [

  // ==================== 变压器产业 ====================
  // --- 主要产品: 变压器-高压 ---
  {
    id: 'proc-tx-01',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '变压器-高压',
    processName: '变压器-高压-干燥 (煤油气相真空干燥)',
    unit: 'kWh/t',
    energyTypes: '电力、蒸汽',
    industryBenchmark: 48.0,
    industryBenchmarkSource: 'GB/T 变压器气相真空干燥先进标杆 (48.0)',
    groupAvg: 51.8,
    companies: [
      { companyId: 'hb_main', companyName: '衡变本部 (特高压车间)', value: 49.8, isOptimal: true, diffGroupPct: '-3.9%' },
      { companyId: 'sb_main', companyName: '沈变本部 (超高压车间)', value: 51.5, isOptimal: false, diffGroupPct: '-0.6%' },
      { companyId: 'hb_hn', companyName: '衡变湖南电气', value: 52.8, isOptimal: false, diffGroupPct: '+1.9%' },
      { companyId: 'xb_uhv', companyName: '新变超高压公司', value: 53.2, isOptimal: false, diffGroupPct: '+2.7%' },
      { companyId: 'hb_tnj', companyName: '衡变特能建', value: 54.0, isOptimal: false, diffGroupPct: '+4.2%' },
    ],
  },
  {
    id: 'proc-tx-02',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '变压器-高压',
    processName: '变压器-试验 (绝缘耐压与全负荷温升试验)',
    unit: 'kWh/kVA',
    energyTypes: '电力',
    industryBenchmark: 0.022,
    industryBenchmarkSource: '行业试验站节能先进限值 (0.022)',
    groupAvg: 0.024,
    companies: [
      { companyId: 'sb_main', companyName: '沈变本部 (试验站)', value: 0.023, isOptimal: true, diffGroupPct: '-4.2%' },
      { companyId: 'hb_main', companyName: '衡变本部 (试验大厅)', value: 0.024, isOptimal: false, diffGroupPct: '0.0%' },
      { companyId: 'hb_tnj', companyName: '衡变特能建', value: 0.0245, isOptimal: false, diffGroupPct: '+2.1%' },
      { companyId: 'xb_uhv', companyName: '新变超高压试验站', value: 0.025, isOptimal: false, diffGroupPct: '+4.2%' },
      { companyId: 'hb_hn', companyName: '衡变湖南电气', value: 0.0255, isOptimal: false, diffGroupPct: '+6.3%' },
    ],
  },
  // --- 主要产品: 变压器-中低压-干变 ---
  {
    id: 'proc-tx-03',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '变压器-中低压-干变',
    processName: '变压器-中低压-干变-固化 (环氧树脂浇注固化)',
    unit: 'kWh/台',
    energyTypes: '电力、蒸汽',
    industryBenchmark: 155.0,
    industryBenchmarkSource: '干式变压器固化先进限值 (155.0)',
    groupAvg: 161.0,
    companies: [
      { companyId: 'xb_tb', companyName: '新变天变公司', value: 158.0, isOptimal: true, diffGroupPct: '-1.9%' },
      { companyId: 'xb_zndq', companyName: '新变智能电气公司', value: 164.0, isOptimal: false, diffGroupPct: '+1.9%' },
    ],
  },
  {
    id: 'proc-tx-04',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '变压器-中低压-干变',
    processName: '变压器-试验 (干变出厂综合性能试验)',
    unit: 'kWh/台',
    energyTypes: '电力',
    groupAvg: 12.5,
    companies: [
      { companyId: 'xb_tb', companyName: '新变天变公司', value: 12.0, isOptimal: true, diffGroupPct: '-4.0%' },
      { companyId: 'xb_zndq', companyName: '新变智能电气公司', value: 13.0, isOptimal: false, diffGroupPct: '+4.0%' },
    ],
  },
  // --- 主要产品: 变压器-中低压-油变 ---
  {
    id: 'proc-tx-05',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '变压器-中低压-油变',
    processName: '变压器-中低压-油变-干燥 (热风循环真空干燥)',
    unit: 'kWh/t',
    energyTypes: '电力、蒸汽',
    industryBenchmark: 35.0,
    industryBenchmarkSource: '配电变压器干燥先进定额 (35.0)',
    groupAvg: 38.5,
    companies: [
      { companyId: 'sb_main', companyName: '沈变本部 (配变车间)', value: 36.8, isOptimal: true, diffGroupPct: '-4.4%' },
      { companyId: 'hb_main', companyName: '衡变本部 (配电部)', value: 38.2, isOptimal: false, diffGroupPct: '-0.8%' },
      { companyId: 'xb_jjj', companyName: '新变京津冀公司', value: 40.5, isOptimal: false, diffGroupPct: '+5.2%' },
    ],
  },
  {
    id: 'proc-tx-06',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '变压器-中低压-油变',
    processName: '变压器-试验 (油变出厂例行试验)',
    unit: 'kWh/kVA',
    energyTypes: '电力',
    groupAvg: 0.018,
    companies: [
      { companyId: 'sb_main', companyName: '沈变本部', value: 0.017, isOptimal: true, diffGroupPct: '-5.6%' },
      { companyId: 'hb_main', companyName: '衡变本部', value: 0.018, isOptimal: false, diffGroupPct: '0.0%' },
      { companyId: 'xb_jjj', companyName: '新变京津冀公司', value: 0.019, isOptimal: false, diffGroupPct: '+5.6%' },
    ],
  },
  // --- 主要产品: 变压器-铁芯 ---
  {
    id: 'proc-tx-07',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '变压器-铁芯',
    processName: '非晶合金铁心-退火 (保护气氛精密退火)',
    unit: 'kWh/t',
    energyTypes: '电力',
    industryBenchmark: 80.0,
    industryBenchmarkSource: '非晶合金退火行业定额 (80.0)',
    groupAvg: 85.0,
    companies: [
      { companyId: 'xb_zf', companyName: '新变珠峰硅钢', value: 82.5, isOptimal: true, diffGroupPct: '-2.9%' },
    ],
  },
  {
    id: 'proc-tx-08',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '变压器-铁芯',
    processName: '硅钢铁心-纵剪 (高精度数控纵剪线)',
    unit: 'kWh/t',
    energyTypes: '电力',
    industryBenchmark: 7.8,
    industryBenchmarkSource: '高精度硅钢纵剪先进定额 (7.8)',
    groupAvg: 8.5,
    companies: [
      { companyId: 'xb_zf', companyName: '新变珠峰硅钢', value: 8.0, isOptimal: true, diffGroupPct: '-5.9%' },
      { companyId: 'sb_main', companyName: '沈变本部 (铁芯分部)', value: 8.4, isOptimal: false, diffGroupPct: '-1.2%' },
      { companyId: 'hb_main', companyName: '衡变本部 (铁芯车间)', value: 9.1, isOptimal: false, diffGroupPct: '+7.1%' },
    ],
  },
  {
    id: 'proc-tx-09',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '变压器-铁芯',
    processName: '硅钢铁心-中型叠装 (中型数控叠装台)',
    unit: 'kWh/t',
    energyTypes: '电力',
    groupAvg: 12.0,
    companies: [
      { companyId: 'xb_zf', companyName: '新变珠峰硅钢', value: 11.5, isOptimal: true, diffGroupPct: '-4.2%' },
      { companyId: 'sb_main', companyName: '沈变本部', value: 12.0, isOptimal: false, diffGroupPct: '0.0%' },
      { companyId: 'hb_main', companyName: '衡变本部', value: 12.5, isOptimal: false, diffGroupPct: '+4.2%' },
    ],
  },
  {
    id: 'proc-tx-10',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '变压器-铁芯',
    processName: '硅钢铁心-大型叠装 (特高压铁芯平叠与翻转)',
    unit: 'kWh/t',
    energyTypes: '电力',
    industryBenchmark: 16.8,
    industryBenchmarkSource: 'GB/T 铁芯大型叠装先进定额 (16.8)',
    groupAvg: 17.8,
    companies: [
      { companyId: 'xb_zf', companyName: '新变珠峰硅钢', value: 17.2, isOptimal: true, diffGroupPct: '-3.4%' },
      { companyId: 'sb_main', companyName: '沈变本部 (大型铁芯段)', value: 17.5, isOptimal: false, diffGroupPct: '-1.7%' },
      { companyId: 'hb_main', companyName: '衡变本部 (铁芯大车间)', value: 18.6, isOptimal: false, diffGroupPct: '+4.5%' },
    ],
  },
  // --- 主要产品: 套管 ---
  {
    id: 'proc-tx-11',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '套管',
    processName: '套管-干燥 (高真空浸渍与固化干燥)',
    unit: 'kWh/支',
    energyTypes: '电力',
    groupAvg: 45.0,
    companies: [
      { companyId: 'sb_hx', companyName: '沈变和新套管公司', value: 43.5, isOptimal: true, diffGroupPct: '-3.3%' },
    ],
  },
  // --- 主要产品: 互感器 ---
  {
    id: 'proc-tx-12',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '互感器',
    processName: '互感器-干燥 (真空脱气与微正压干燥)',
    unit: 'kWh/台',
    energyTypes: '电力、蒸汽',
    groupAvg: 32.0,
    companies: [
      { companyId: 'sb_kj', companyName: '沈变康嘉互感器', value: 30.8, isOptimal: true, diffGroupPct: '-3.8%' },
    ],
  },
  {
    id: 'proc-tx-13',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '互感器',
    processName: '变压器-试验 (互感器高电压绝缘试验)',
    unit: 'kWh/台',
    energyTypes: '电力',
    groupAvg: 5.2,
    companies: [
      { companyId: 'sb_kj', companyName: '沈变康嘉互感器', value: 5.0, isOptimal: true, diffGroupPct: '-3.8%' },
    ],
  },
  // --- 主要产品: 干式电抗器 ---
  {
    id: 'proc-tx-14',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '干式电抗器',
    processName: '干式电抗器-固化 (环氧树脂真空浇注固化)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 145.0,
    companies: [
      { companyId: 'hb_hr_gf', companyName: '衡变合容电气股份', value: 138.0, isOptimal: true, diffGroupPct: '-4.8%' },
    ],
  },
  {
    id: 'proc-tx-15',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '干式电抗器',
    processName: '干式电抗器-试验 (电抗值精度与温升试验)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 18.5,
    companies: [
      { companyId: 'hb_hr_gf', companyName: '衡变合容电气股份', value: 17.6, isOptimal: true, diffGroupPct: '-4.9%' },
    ],
  },
  // --- 主要产品: 电容器 ---
  {
    id: 'proc-tx-16',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '电容器',
    processName: '电容器-芯子卷绕 (数控精密芯子卷制)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 42.0,
    companies: [
      { companyId: 'hb_hr_sb', companyName: '衡变合容电力设备', value: 39.5, isOptimal: true, diffGroupPct: '-6.0%' },
    ],
  },
  {
    id: 'proc-tx-17',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '电容器',
    processName: '电容器-真空浸渍 (全自动真空浸渍固化)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 68.0,
    companies: [
      { companyId: 'hb_hr_sb', companyName: '衡变合容电力设备', value: 65.0, isOptimal: true, diffGroupPct: '-4.4%' },
    ],
  },
  {
    id: 'proc-tx-18',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '电容器',
    processName: '电容器-喷漆 (自动静电防腐喷涂)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 25.0,
    companies: [
      { companyId: 'hb_hr_sb', companyName: '衡变合容电力设备', value: 23.8, isOptimal: true, diffGroupPct: '-4.8%' },
    ],
  },
  {
    id: 'proc-tx-19',
    industry: 'transformer',
    industryName: '变压器产业',
    mainProduct: '电容器',
    processName: '电容器-试验 (极间绝缘与局放耐压试验)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 15.0,
    companies: [
      { companyId: 'hb_hr_sb', companyName: '衡变合容电力设备', value: 14.2, isOptimal: true, diffGroupPct: '-5.3%' },
    ],
  },

  // ==================== 线缆产业 ====================
  // --- 主要产品: 线缆-高压 ---
  {
    id: 'proc-cb-01',
    industry: 'cable',
    industryName: '线缆产业',
    mainProduct: '线缆-高压',
    processName: '线缆-拉丝 (大拉机单位吨铜电耗)',
    unit: 'kWh/t (铜)',
    energyTypes: '电力',
    industryBenchmark: 320.0,
    industryBenchmarkSource: 'GB/T 铜材大拉能耗先进标杆 (320.0)',
    groupAvg: 330.0,
    companies: [
      { companyId: 'll_main', companyName: '鲁缆本部 (拉丝车间)', value: 315.0, isOptimal: true, diffGroupPct: '-4.5%' },
      { companyId: 'xl_main', companyName: '特变电工新疆电缆有限公司', value: 330.0, isOptimal: false, diffGroupPct: '0.0%' },
      { companyId: 'dl_main', companyName: '特变电工（德阳）电缆股份有限公司', value: 345.0, isOptimal: false, diffGroupPct: '+4.5%' },
    ],
  },
  {
    id: 'proc-cb-02',
    industry: 'cable',
    industryName: '线缆产业',
    mainProduct: '线缆-高压',
    processName: '线缆-高压-交联（干法立塔悬垂挤塑）',
    unit: 'kWh/km',
    energyTypes: '电力、氮气',
    industryBenchmark: 1150.0,
    industryBenchmarkSource: '超高压立塔干法交联行业先进标杆 (1,150.0)',
    groupAvg: 1202.0,
    companies: [
      { companyId: 'll_main', companyName: '鲁缆本部 (立塔交联车间)', value: 1160.0, isOptimal: true, diffGroupPct: '-3.5%' },
      { companyId: 'xl_main', companyName: '特变电工新疆电缆有限公司 (立塔部)', value: 1208.0, isOptimal: false, diffGroupPct: '+0.5%' },
      { companyId: 'dl_main', companyName: '特变电工（德阳）电缆股份有限公司', value: 1238.0, isOptimal: false, diffGroupPct: '+3.0%' },
    ],
  },
  // --- 主要产品: 线缆-中低压 ---
  {
    id: 'proc-cb-03',
    industry: 'cable',
    industryName: '线缆产业',
    mainProduct: '线缆-中低压',
    processName: '线缆-拉丝 (铝材中拉/细拉单位吨铝电耗)',
    unit: 'kWh/t (铝)',
    energyTypes: '电力',
    industryBenchmark: 185.0,
    industryBenchmarkSource: 'GB/T 铝材拉丝能效先进限值 (185.0)',
    groupAvg: 192.0,
    companies: [
      { companyId: 'll_main', companyName: '鲁缆本部 (铝拉丝工段)', value: 182.0, isOptimal: true, diffGroupPct: '-5.2%' },
      { companyId: 'xl_main', companyName: '特变电工新疆电缆有限公司', value: 191.0, isOptimal: false, diffGroupPct: '-0.5%' },
      { companyId: 'xl_sub', companyName: '特变电工新疆线缆厂', value: 195.0, isOptimal: false, diffGroupPct: '+1.6%' },
      { companyId: 'dl_main', companyName: '特变电工（德阳）电缆股份有限公司', value: 203.0, isOptimal: false, diffGroupPct: '+5.7%' },
    ],
  },
  {
    id: 'proc-cb-04',
    industry: 'cable',
    industryName: '线缆产业',
    mainProduct: '线缆-中低压',
    processName: '线缆-中低压-交联（干法悬垂连续挤出）',
    unit: 'kWh/km',
    energyTypes: '电力、氮气',
    groupAvg: 485.0,
    companies: [
      { companyId: 'xl_sub', companyName: '特变电工新疆线缆厂', value: 468.0, isOptimal: true, diffGroupPct: '-3.5%' },
      { companyId: 'll_main', companyName: '鲁缆本部', value: 482.0, isOptimal: false, diffGroupPct: '-0.6%' },
      { companyId: 'xl_main', companyName: '特变电工新疆电缆有限公司', value: 490.0, isOptimal: false, diffGroupPct: '+1.0%' },
      { companyId: 'dl_main', companyName: '特变电工（德阳）电缆股份有限公司', value: 505.0, isOptimal: false, diffGroupPct: '+4.1%' },
    ],
  },
  // --- 主要产品: 线缆-特种电缆 ---
  {
    id: 'proc-cb-05',
    industry: 'cable',
    industryName: '线缆产业',
    mainProduct: '线缆-特种电缆',
    processName: '线缆-拉丝 (特种合金高导精密拉丝)',
    unit: 'kWh/t',
    energyTypes: '电力',
    groupAvg: 365.0,
    companies: [
      { companyId: 'll_sg', companyName: '鲁缆曙光公司 (特种拉丝工段)', value: 355.0, isOptimal: true, diffGroupPct: '-2.7%' },
    ],
  },
  {
    id: 'proc-cb-06',
    industry: 'cable',
    industryName: '线缆产业',
    mainProduct: '线缆-特种电缆',
    processName: '线缆-中低压-交联 (特种辐照交联挤塑)',
    unit: 'kWh/km',
    energyTypes: '电力、氮气',
    groupAvg: 520.0,
    companies: [
      { companyId: 'll_sg', companyName: '鲁缆曙光公司', value: 505.0, isOptimal: true, diffGroupPct: '-2.9%' },
    ],
  },

  // ==================== 中低压开关 ====================
  // --- 主要产品: 中低压开关柜 ---
  {
    id: 'proc-sw-01',
    industry: 'switch',
    industryName: '中低压开关',
    mainProduct: '中低压开关柜',
    processName: '中低压开关柜-钣金加工 (数控冲剪折弯)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 125.0,
    companies: [
      { companyId: 'hb_yj', companyName: '衡变云集电气 (钣金车间)', value: 118.0, isOptimal: true, diffGroupPct: '-5.6%' },
      { companyId: 'hb_xj', companyName: '衡变新疆自控 (数控加工部)', value: 132.0, isOptimal: false, diffGroupPct: '+5.6%' },
    ],
  },
  {
    id: 'proc-sw-02',
    industry: 'switch',
    industryName: '中低压开关',
    mainProduct: '中低压开关柜',
    processName: '中低压开关柜-钣金喷涂 (自动静电喷涂线)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 98.0,
    companies: [
      { companyId: 'hb_yj', companyName: '衡变云集电气 (静电喷涂线)', value: 92.0, isOptimal: true, diffGroupPct: '-6.1%' },
      { companyId: 'hb_xj', companyName: '衡变新疆自控 (涂装车间)', value: 104.0, isOptimal: false, diffGroupPct: '+6.1%' },
    ],
  },
  // --- 主要产品: GIS ---
  {
    id: 'proc-sw-03',
    industry: 'switch',
    industryName: '中低压开关',
    mainProduct: 'GIS',
    processName: 'GIS-抽真空 (微正压气体灌装)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 85.0,
    companies: [
      { companyId: 'hb_yj_sw', companyName: '衡变云集高压开关', value: 82.0, isOptimal: true, diffGroupPct: '-3.5%' },
    ],
  },
  {
    id: 'proc-sw-04',
    industry: 'switch',
    industryName: '中低压开关',
    mainProduct: 'GIS',
    processName: 'GIS-绝缘件干燥 (恒温除湿烘烤)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 110.0,
    companies: [
      { companyId: 'hb_yj_sw', companyName: '衡变云集高压开关', value: 105.0, isOptimal: true, diffGroupPct: '-4.5%' },
    ],
  },
  {
    id: 'proc-sw-05',
    industry: 'switch',
    industryName: '中低压开关',
    mainProduct: 'GIS',
    processName: 'GIS-工频耐压试验 (气体绝缘耐压检测)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 62.0,
    companies: [
      { companyId: 'hb_yj_sw', companyName: '衡变云集高压开关', value: 59.5, isOptimal: true, diffGroupPct: '-4.0%' },
    ],
  },
  {
    id: 'proc-sw-06',
    industry: 'switch',
    industryName: '中低压开关',
    mainProduct: 'GIS',
    processName: 'GIS-空调恒温除湿 (十万级洁净大厅)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 145.0,
    companies: [
      { companyId: 'hb_yj_sw', companyName: '衡变云集高压开关', value: 138.0, isOptimal: true, diffGroupPct: '-4.8%' },
    ],
  },
  // --- 主要产品: GIL ---
  {
    id: 'proc-sw-07',
    industry: 'switch',
    industryName: '中低压开关',
    mainProduct: 'GIL',
    processName: 'GIL-螺旋焊管生产 (自动化焊管线)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 135.0,
    companies: [
      { companyId: 'hb_sjad', companyName: '衡变赛杰爱迪', value: 128.0, isOptimal: true, diffGroupPct: '-5.2%' },
    ],
  },
  {
    id: 'proc-sw-08',
    industry: 'switch',
    industryName: '中低压开关',
    mainProduct: 'GIL',
    processName: 'GIL-绝缘子生产 (数控精密固化成型)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 95.0,
    companies: [
      { companyId: 'hb_sjad', companyName: '衡变赛杰爱迪', value: 91.0, isOptimal: true, diffGroupPct: '-4.2%' },
    ],
  },
  {
    id: 'proc-sw-09',
    industry: 'switch',
    industryName: '中低压开关',
    mainProduct: 'GIL',
    processName: 'GIL-测试 (综合局放耐压试验)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    groupAvg: 45.0,
    companies: [
      { companyId: 'hb_sjad', companyName: '衡变赛杰爱迪', value: 42.5, isOptimal: true, diffGroupPct: '-5.6%' },
    ],
  },
]

// 关键工序对比：产业 -> 主要产品 级联映射字典 (权威映射自《能碳管控指标体系-整体产品工序指标.xlsx》)
export const PROCESS_INDUSTRY_MAIN_PRODUCTS: Record<'transformer' | 'cable' | 'switch', string[]> = {
  transformer: [
    '变压器-高压',
    '变压器-中低压-干变',
    '变压器-中低压-油变',
    '变压器-铁芯',
    '套管',
    '互感器',
    '干式电抗器',
    '电容器',
  ],
  cable: [
    '线缆-高压',
    '线缆-中低压',
    '线缆-特种电缆',
  ],
  switch: [
    '中低压开关柜',
    'GIS',
    'GIL',
  ],
}


// ============================================================================
// 基准管理 - 3 大基准分类标准库数据集
// 调整为规范的 3 层工业基准体系：1. 工厂指标  2. 工序指标  3. 产品指标
// ============================================================================
export type BenchmarkStandardCategory = 'factory' | 'process' | 'product'

export interface BenchmarkStandardItem {
  id: string
  category: 'factory' | 'process' | 'product'
  categoryName: string
  indicatorName: string
  scope: string
  benchmarkValue: number          // 标准基准值 (门槛考核值)
  advancedValue?: number          // 行业先进值 (标杆最优值)
  compareOperator: '<=' | '>='    // 判定规则
  unit: string                    // 计量单位
  standardSource: string          // 标准出处 / 政策依据
  currentGroupAvg: number         // 集团当前实测均值
  effectiveDate: string           // 维护/生效日期
  status: 'active' | 'pending'
  maintainer: string              // 维护归口部门
  notes?: string
}

// 🌟 对标基准多版本生命周期演进与变更审计记录模型
export interface BenchmarkVersionRecord {
  id: string
  standardId: string
  versionNumber: string           // e.g. 'v2.4', 'v2.3', 'v2.0', 'v1.0'
  isCurrent: boolean              // 是否当前生效运行版本
  benchmarkValue: number          // 门槛基准值
  advancedValue?: number          // 标杆先进值
  compareOperator: '<=' | '>='    // 判定规则
  unit: string                    // 计量单位
  standardSource: string          // 依据文件 / 来源出处
  effectiveDate: string           // 生效起始日期
  expiryDate: string              // 失效日期 ('至今' 或 '2025-12-31')
  changeReason: string            // 修订动因 / 变更说明
  approvalDoc: string             // 批准公文 / 审批单号
  maintainer: string              // 修订维护人
  reviewer: string                // 审批负责人
  status: 'active' | 'archived' | 'deprecated' // 状态: active(运行中), archived(已归档), deprecated(已废止)
  deltaDesc?: string              // 相比上一版本变动幅度说明 (如: '基准加严 4.3%')
  notes?: string
}

// ============================================================================
// 系统已有管控指标库字典 (供对标基准录入与维护时单选映射，实现与系统指标强对应)
// ============================================================================
export interface SystemControlMetricOption {
  id: string
  code: string
  name: string
  category: 'factory' | 'process' | 'product'
  categoryLabel: string
  scope: string
  unit: string
  defaultCompare: '<=' | '>='
  defaultBenchmark: number
  defaultAdvanced?: number
  defaultSource: string
  groupAvg: number
}

export const SYSTEM_CONTROL_METRIC_OPTIONS: SystemControlMetricOption[] = [
  // ------------------ 1. 工厂指标 (顶层综合能碳考核、国家零碳工厂门槛、绿能消纳) ------------------
  {
    id: 'fac_output_tce_tx',
    code: 'KPI-FAC-01',
    name: '单位产值综合能耗考核红线 (变压器产业)',
    category: 'factory',
    categoryLabel: '工厂指标',
    scope: '变压器产业 · 沈变 / 衡变 / 新变各直属工厂',
    unit: 'tce/万元',
    defaultCompare: '<=',
    defaultBenchmark: 0.0880,
    defaultAdvanced: 0.0750,
    defaultSource: '特变电工电装集团2026年度能耗双控考核红线',
    groupAvg: 0.0853,
  },
  {
    id: 'fac_output_tce_cb',
    code: 'KPI-FAC-02',
    name: '单位产值综合能耗考核红线 (线缆产业)',
    category: 'factory',
    categoryLabel: '工厂指标',
    scope: '线缆产业 · 鲁缆 / 新缆 / 德缆各直属工厂',
    unit: 'tce/万元',
    defaultCompare: '<=',
    defaultBenchmark: 0.0920,
    defaultAdvanced: 0.0820,
    defaultSource: '特变电工电装集团2026年度能耗双控考核红线',
    groupAvg: 0.0898,
  },
  {
    id: 'fac_added_value_tce',
    code: 'KPI-FAC-03',
    name: '单位工业增加值综合能耗考核限额',
    category: 'factory',
    categoryLabel: '工厂指标',
    scope: '全集团 21 家直属制造工厂',
    unit: 'tce/万元',
    defaultCompare: '<=',
    defaultBenchmark: 0.2250,
    defaultAdvanced: 0.1980,
    defaultSource: '特变电工“十五五”绿色低碳转型目标纲要',
    groupAvg: 0.2180,
  },
  {
    id: 'fac_carbon_intensity',
    code: 'KPI-FAC-04',
    name: '单位能耗碳排放 (国家零碳工厂门槛指标)',
    category: 'factory',
    categoryLabel: '工厂指标',
    scope: '全集团 15 个零碳园区 & 21 家直属工厂',
    unit: 'tCO₂/tce',
    defaultCompare: '<=',
    defaultBenchmark: 1.80,
    defaultAdvanced: 1.45,
    defaultSource: '《零碳工厂评价通则》(GB/T 43126) 刚性门槛',
    groupAvg: 1.62,
  },
  {
    id: 'fac_non_fossil',
    code: 'KPI-FAC-05',
    name: '非化石能源消费占比 (国家零碳工厂门槛指标)',
    category: 'factory',
    categoryLabel: '工厂指标',
    scope: '全集团 15 个零碳园区 & 21 家直属工厂',
    unit: '%',
    defaultCompare: '>=',
    defaultBenchmark: 30.0,
    defaultAdvanced: 55.0,
    defaultSource: '《零碳工厂评价通则》(GB/T 43126) 刚性门槛',
    groupAvg: 41.5,
  },
  {
    id: 'fac_physical_green',
    code: 'KPI-FAC-06',
    name: '非化石电力物理认定电量占比 (国家零碳引导指标)',
    category: 'factory',
    categoryLabel: '工厂指标',
    scope: '全集团园区分布式光伏与物理直供绿电',
    unit: '%',
    defaultCompare: '>=',
    defaultBenchmark: 10.0,
    defaultAdvanced: 50.0,
    defaultSource: '国家零碳工厂星级评价引导标准 (T/CECA-G 0171)',
    groupAvg: 38.6,
  },
  {
    id: 'fac_output_elec',
    code: 'KPI-FAC-07',
    name: '万元产值外购市电单耗控制限额',
    category: 'factory',
    categoryLabel: '工厂指标',
    scope: '全集团直属制造企业',
    unit: 'kWh/万元',
    defaultCompare: '<=',
    defaultBenchmark: 350.0,
    defaultAdvanced: 290.0,
    defaultSource: '集团年度能源预算管控指标',
    groupAvg: 312.0,
  },
  {
    id: 'fac_water_output',
    code: 'KPI-FAC-08',
    name: '万元产值工业新鲜水耗管控指标',
    category: 'factory',
    categoryLabel: '工厂指标',
    scope: '全集团直属制造企业 (ESG 节水核算)',
    unit: 'm³/万元',
    defaultCompare: '<=',
    defaultBenchmark: 0.50,
    defaultAdvanced: 0.35,
    defaultSource: '国家节水型企业标准评价导则 (GB/T 7119)',
    groupAvg: 0.42,
  },
  {
    id: 'fac_clean_power_ratio',
    code: 'KPI-FAC-09',
    name: '园区清洁绿电消纳目标占比',
    category: 'factory',
    categoryLabel: '工厂指标',
    scope: '全集团 15 个零碳产业园区',
    unit: '%',
    defaultCompare: '>=',
    defaultBenchmark: 45.0,
    defaultAdvanced: 65.0,
    defaultSource: '电装集团2026年度新能源与绿电消纳考核行动方案',
    groupAvg: 41.5,
  },

  // ------------------ 2. 工序指标 (铜铝拉丝 / 真空干燥 / 干法立塔 / 绝缘试验 / 固化退火) ------------------
  {
    id: 'proc_draw_copper',
    code: 'KPI-PROC-01',
    name: '线缆-拉丝 (单位吨铜电耗)',
    category: 'process',
    categoryLabel: '工序指标',
    scope: '线缆产业 · 鲁缆本部 / 新疆电缆 / 德阳电缆拉丝车间',
    unit: 'kWh/t (铜)',
    defaultCompare: '<=',
    defaultBenchmark: 320.0,
    defaultAdvanced: 305.0,
    defaultSource: 'GB/T 3956 铜材拉丝能效先进限值',
    groupAvg: 330.0,
  },
  {
    id: 'proc_draw_aluminum',
    code: 'KPI-PROC-02',
    name: '线缆-拉丝 (单位吨铝电耗)',
    category: 'process',
    categoryLabel: '工序指标',
    scope: '线缆产业 · 铝线及铝合金连铸连轧拉丝工段',
    unit: 'kWh/t (铝)',
    defaultCompare: '<=',
    defaultBenchmark: 185.0,
    defaultAdvanced: 172.0,
    defaultSource: 'GB/T 3190 铝及铝合金加工能耗定额',
    groupAvg: 192.0,
  },
  {
    id: 'proc_crosslink_tower',
    code: 'KPI-PROC-03',
    name: '线缆-高压-交联 (干法立塔悬垂挤塑)',
    category: 'process',
    categoryLabel: '工序指标',
    scope: '线缆产业 · 500kV / 220kV / 110kV 超高压立塔交联',
    unit: 'kWh/km',
    defaultCompare: '<=',
    defaultBenchmark: 1150.0,
    defaultAdvanced: 1080.0,
    defaultSource: '超高压交联立塔挤塑行业能效先进标杆',
    groupAvg: 1202.0,
  },
  {
    id: 'proc_dry_steam',
    code: 'KPI-PROC-04',
    name: '变压器-高压-干燥 (煤油气相真空干燥)',
    category: 'process',
    categoryLabel: '工序指标',
    scope: '变压器产业 · 沈变 / 衡变 / 新变超高压车间',
    unit: 'kWh/t',
    defaultCompare: '<=',
    defaultBenchmark: 48.0,
    defaultAdvanced: 43.5,
    defaultSource: 'GB/T 1094 变压器真空干燥节能工艺规范',
    groupAvg: 51.8,
  },
  {
    id: 'proc_transformer_test',
    code: 'KPI-PROC-05',
    name: '变压器-试验 (绝缘耐压与全负荷温升)',
    category: 'process',
    categoryLabel: '工序指标',
    scope: '变压器产业 · 大型变压器高压试验大厅',
    unit: 'kWh/kVA',
    defaultCompare: '<=',
    defaultBenchmark: 0.022,
    defaultAdvanced: 0.019,
    defaultSource: '行业试验站节能先进限值',
    groupAvg: 0.024,
  },
  {
    id: 'proc_dry_epoxy',
    code: 'KPI-PROC-06',
    name: '变压器-中低压-干变-固化 (环氧树脂浇注固化)',
    category: 'process',
    categoryLabel: '工序指标',
    scope: '变压器产业 · 天变 / 智能电气 / 沈变干变车间',
    unit: 'kWh/台',
    defaultCompare: '<=',
    defaultBenchmark: 160.0,
    defaultAdvanced: 148.0,
    defaultSource: '干式变压器节能工艺指导规程',
    groupAvg: 165.0,
  },
  {
    id: 'proc_silicon_anneal',
    code: 'KPI-PROC-07',
    name: '变压器-铁心制造 (硅钢铁心横剪与叠装工段)',
    category: 'process',
    categoryLabel: '工序指标',
    scope: '变压器核心部件 · 珠峰硅钢及各厂铁心制造车间',
    unit: 'kWh/t',
    defaultCompare: '<=',
    defaultBenchmark: 16.8,
    defaultAdvanced: 15.2,
    defaultSource: 'GB/T 硅钢铁芯加工能耗先进定额',
    groupAvg: 17.8,
  },

  // ------------------ 3. 产品指标 (变压器3介质、线缆3介质、代表性产品型号能效) ------------------
  {
    id: 'prod_tx_composite',
    code: 'KPI-PROD-01',
    name: '变压器-单位产品综合能耗基准',
    category: 'product',
    categoryLabel: '产品指标',
    scope: '变压器产业 · 沈变 / 衡变 / 新变各直属装配厂',
    unit: 'tce/台',
    defaultCompare: '<=',
    defaultBenchmark: 12.50,
    defaultAdvanced: 11.20,
    defaultSource: '特变电工变压器单位产品综合能耗内控基准',
    groupAvg: 12.18,
  },
  {
    id: 'prod_tx_elec',
    code: 'KPI-PROD-02',
    name: '变压器-单位产品电耗基准',
    category: 'product',
    categoryLabel: '产品指标',
    scope: '变压器产业 · 直属工厂制造工序与试验站',
    unit: 'kWh/台',
    defaultCompare: '<=',
    defaultBenchmark: 6850.0,
    defaultAdvanced: 6200.0,
    defaultSource: '变压器单位产品电耗能效对标定额',
    groupAvg: 6720.0,
  },
  {
    id: 'prod_tx_steam',
    code: 'KPI-PROD-03',
    name: '变压器-单位产品蒸汽消耗量基准',
    category: 'product',
    categoryLabel: '产品指标',
    scope: '变压器产业 · 真空干燥与热能供应工段',
    unit: 't/台',
    defaultCompare: '<=',
    defaultBenchmark: 4.20,
    defaultAdvanced: 3.60,
    defaultSource: '变压器产品蒸汽能耗定额管理标准',
    groupAvg: 4.05,
  },
  {
    id: 'prod_cb_composite',
    code: 'KPI-PROD-04',
    name: '线缆-单位产品综合能耗基准',
    category: 'product',
    categoryLabel: '产品指标',
    scope: '线缆产业 · 鲁缆 / 新缆 / 德缆各厂',
    unit: 'tce/km',
    defaultCompare: '<=',
    defaultBenchmark: 0.520,
    defaultAdvanced: 0.460,
    defaultSource: '特变电工线缆产品综合能耗内控基准',
    groupAvg: 0.505,
  },
  {
    id: 'prod_cb_elec',
    code: 'KPI-PROD-05',
    name: '线缆-单位产品电耗基准',
    category: 'product',
    categoryLabel: '产品指标',
    scope: '线缆产业 · 连铸连轧与立塔拉丝全工序',
    unit: 'kWh/km',
    defaultCompare: '<=',
    defaultBenchmark: 380.0,
    defaultAdvanced: 345.0,
    defaultSource: '电力电缆制造单位产品电耗定额规范',
    groupAvg: 372.0,
  },
  {
    id: 'prod_cb_nitro',
    code: 'KPI-PROD-06',
    name: '线缆-单位产品液氮消耗量基准',
    category: 'product',
    categoryLabel: '产品指标',
    scope: '线缆产业 · 超高压交联冷却深冷保护工段',
    unit: 'm³/km',
    defaultCompare: '<=',
    defaultBenchmark: 18.5,
    defaultAdvanced: 15.0,
    defaultSource: '特种交联电缆液氮深冷消耗内控标准',
    groupAvg: 17.9,
  },
  {
    id: 'prod_tx_500kv',
    code: 'KPI-PROD-07',
    name: 'ODFS-334MVA/500kV 单相自耦变压器台综合单耗标杆',
    category: 'product',
    categoryLabel: '产品指标',
    scope: '超高压变压器制造 (衡变 / 沈变 / 新变)',
    unit: 'tce/台',
    defaultCompare: '<=',
    defaultBenchmark: 14.50,
    defaultAdvanced: 13.82,
    defaultSource: '特变电工变压器产品能效内控标杆',
    groupAvg: 14.25,
  },
  {
    id: 'prod_cb_110kv',
    code: 'KPI-PROD-08',
    name: '110kV 交联聚乙烯电缆公里综合单耗标杆',
    category: 'product',
    categoryLabel: '产品指标',
    scope: '高压交联立塔挤塑 (鲁缆 / 新缆 / 德缆)',
    unit: 'tce/km',
    defaultCompare: '<=',
    defaultBenchmark: 0.600,
    defaultAdvanced: 0.582,
    defaultSource: '特变电工线缆产品能耗内控基准',
    groupAvg: 0.592,
  },
]

const BENCHMARK_STANDARDS_DATA: BenchmarkStandardItem[] = [
  // ------------------ 1. 工厂指标 (共 9 项) ------------------
  {
    id: 'std-fac-01',
    category: 'factory',
    categoryName: '工厂指标',
    indicatorName: '单位产值综合能耗考核红线 (变压器产业)',
    scope: '变压器产业 · 沈变 / 衡变 / 新变各级核算主体',
    benchmarkValue: 0.0880,
    advancedValue: 0.0750,
    compareOperator: '<=',
    unit: 'tce/万元',
    standardSource: '特变电工电装集团2026年度能耗双控考核红线',
    currentGroupAvg: 0.0853,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团战略运营管理部',
    notes: '月度超标 0.0880 即自动触发能碳预警与节能督办',
  },
  {
    id: 'std-fac-02',
    category: 'factory',
    categoryName: '工厂指标',
    indicatorName: '单位产值综合能耗考核红线 (线缆产业)',
    scope: '线缆产业 · 鲁缆 / 新缆 / 德缆各级核算主体',
    benchmarkValue: 0.0920,
    advancedValue: 0.0820,
    compareOperator: '<=',
    unit: 'tce/万元',
    standardSource: '特变电工电装集团2026年度能耗双控考核红线',
    currentGroupAvg: 0.0898,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团战略运营管理部',
  },
  {
    id: 'std-fac-03',
    category: 'factory',
    categoryName: '工厂指标',
    indicatorName: '单位工业增加值综合能耗考核限额',
    scope: '全集团 21 家直属制造工厂',
    benchmarkValue: 0.2250,
    advancedValue: 0.1980,
    compareOperator: '<=',
    unit: 'tce/万元',
    standardSource: '特变电工“十五五”绿色低碳转型目标纲要',
    currentGroupAvg: 0.2180,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团规划财务部',
  },
  {
    id: 'std-fac-04',
    category: 'factory',
    categoryName: '工厂指标',
    indicatorName: '单位能耗碳排放 (carbon_per_tce)',
    scope: '全集团 15 个零碳园区 & 21 家直报工厂',
    benchmarkValue: 1.80,
    advancedValue: 1.45,
    compareOperator: '<=',
    unit: 'tCO₂/tce',
    standardSource: '《零碳工厂评价通则》(GB/T 43126) 强制门槛',
    currentGroupAvg: 1.62,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团双碳推进办公室',
    notes: '达标国家零碳工厂认证的第 1 刚性红线，必须 ≤ 1.80 tCO₂/tce',
  },
  {
    id: 'std-fac-05',
    category: 'factory',
    categoryName: '工厂指标',
    indicatorName: '非化石能源消费占比 (non_fossil_ratio)',
    scope: '全集团 15 个零碳园区 & 21 家直报工厂',
    benchmarkValue: 30.0,
    advancedValue: 55.0,
    compareOperator: '>=',
    unit: '%',
    standardSource: '《零碳工厂评价通则》(GB/T 43126) 强制门槛',
    currentGroupAvg: 41.5,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团双碳推进办公室',
    notes: '绿电、屋顶光伏及生物质等非化石能源占比必须 ≥ 30%',
  },
  {
    id: 'std-fac-06',
    category: 'factory',
    categoryName: '工厂指标',
    indicatorName: '非化石电力物理认定量占比 (physical_green_ratio)',
    scope: '全集团 15 个零碳园区 & 21 家直报工厂',
    benchmarkValue: 10.0,
    advancedValue: 50.0,
    compareOperator: '>=',
    unit: '%',
    standardSource: '国家零碳工厂星级评价引导标准 (T/CECA-G 0171)',
    currentGroupAvg: 38.6,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团双碳推进办公室',
    notes: '物理专线绿电直供与自发自用认定量必须 ≥ 10%',
  },
  {
    id: 'std-fac-07',
    category: 'factory',
    categoryName: '工厂指标',
    indicatorName: '万元产值外购市电单耗控制限额',
    scope: '全集团直属制造企业',
    benchmarkValue: 350.0,
    advancedValue: 290.0,
    compareOperator: '<=',
    unit: 'kWh/万元',
    standardSource: '集团年度能源预算管控指标',
    currentGroupAvg: 312.0,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团生产运营部',
  },
  {
    id: 'std-fac-08',
    category: 'factory',
    categoryName: '工厂指标',
    indicatorName: '万元产值工业新鲜水耗管控指标',
    scope: '全集团直属制造企业 (ESG 节水核算)',
    benchmarkValue: 0.50,
    advancedValue: 0.35,
    compareOperator: '<=',
    unit: 'm³/万元',
    standardSource: '国家节水型企业标准评价导则 (GB/T 7119)',
    currentGroupAvg: 0.42,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团安全环保部',
  },
  {
    id: 'std-fac-09',
    category: 'factory',
    categoryName: '工厂指标',
    indicatorName: '园区清洁绿电消纳目标占比',
    scope: '全集团 15 个零碳产业园区',
    benchmarkValue: 45.0,
    advancedValue: 65.0,
    compareOperator: '>=',
    unit: '%',
    standardSource: '电装集团2026年度新能源与绿电消纳考核行动方案',
    currentGroupAvg: 41.5,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团双碳推进办公室',
  },

  // ------------------ 2. 工序指标 (共 7 项) ------------------
  {
    id: 'std-proc-01',
    category: 'process',
    categoryName: '工序指标',
    indicatorName: '线缆-拉丝 (单位吨铜电耗)',
    scope: '线缆产业 · 鲁缆本部 / 新疆电缆 / 德阳电缆拉丝车间',
    benchmarkValue: 320.0,
    advancedValue: 305.0,
    compareOperator: '<=',
    unit: 'kWh/t (铜)',
    standardSource: 'GB/T 3956 铜材拉丝能效先进限值',
    currentGroupAvg: 330.0,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团科技质量部',
    notes: '优于 320 kWh/t 为行业先进基准，最优达标 305 kWh/t',
  },
  {
    id: 'std-proc-02',
    category: 'process',
    categoryName: '工序指标',
    indicatorName: '线缆-拉丝 (单位吨铝电耗)',
    scope: '线缆产业 · 铝线及铝合金连铸连轧拉丝工段',
    benchmarkValue: 185.0,
    advancedValue: 172.0,
    compareOperator: '<=',
    unit: 'kWh/t (铝)',
    standardSource: 'GB/T 3190 铝及铝合金加工能耗定额',
    currentGroupAvg: 192.0,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团科技质量部',
  },
  {
    id: 'std-proc-03',
    category: 'process',
    categoryName: '工序指标',
    indicatorName: '线缆-高压-交联（干法立塔悬垂挤塑）',
    scope: '线缆产业 · 500kV / 220kV / 110kV 超高压立塔交联',
    benchmarkValue: 1150.0,
    advancedValue: 1080.0,
    compareOperator: '<=',
    unit: 'kWh/km',
    standardSource: '超高压交联立塔挤塑行业能效先进标杆',
    currentGroupAvg: 1202.0,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团生产运营部',
  },
  {
    id: 'std-proc-04',
    category: 'process',
    categoryName: '工序指标',
    indicatorName: '变压器-高压-干燥 (煤油气相真空干燥)',
    scope: '变压器产业 · 沈变 / 衡变 / 新变超高压车间',
    benchmarkValue: 48.0,
    advancedValue: 43.5,
    compareOperator: '<=',
    unit: 'kWh/t',
    standardSource: 'GB/T 1094 变压器真空干燥节能工艺规范',
    currentGroupAvg: 51.8,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团生产运营部',
  },
  {
    id: 'std-proc-05',
    category: 'process',
    categoryName: '工序指标',
    indicatorName: '变压器-试验 (绝缘耐压与全负荷温升)',
    scope: '变压器产业 · 各直属基地高电压试验大厅',
    benchmarkValue: 0.022,
    advancedValue: 0.019,
    compareOperator: '<=',
    unit: 'kWh/kVA',
    standardSource: '大型变压器出厂试验能耗先进限值',
    currentGroupAvg: 0.024,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团试验检测中心',
  },
  {
    id: 'std-proc-06',
    category: 'process',
    categoryName: '工序指标',
    indicatorName: '变压器-硅钢铁心-纵剪 / 叠装工段',
    scope: '变压器产业 · 珠峰硅钢 / 沈变铁芯 / 衡变铁芯',
    benchmarkValue: 16.8,
    advancedValue: 15.2,
    compareOperator: '<=',
    unit: 'kWh/t',
    standardSource: 'GB/T 硅钢铁芯加工能耗先进定额',
    currentGroupAvg: 17.8,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '新变厂技术部',
  },
  {
    id: 'std-proc-07',
    category: 'process',
    categoryName: '工序指标',
    indicatorName: '变压器-中低压-干变-固化 (环氧树脂浇注固化)',
    scope: '变压器产业 · 天变 / 智能电气 / 沈变干变车间',
    benchmarkValue: 160.0,
    advancedValue: 148.0,
    compareOperator: '<=',
    unit: 'kWh/台',
    standardSource: '干式变压器节能工艺指导规程',
    currentGroupAvg: 165.0,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '沈变技术部',
  },

]

// ============================================================================
// 对标基准多版本生命周期演进数据库与动态生成器
// ============================================================================
export const generateStandardVersions = (std: BenchmarkStandardItem): BenchmarkVersionRecord[] => {
  const isLte = std.compareOperator === '<='

  // v2.4 (当前运行版本)
  const v24: BenchmarkVersionRecord = {
    id: `ver-${std.id}-24`,
    standardId: std.id,
    versionNumber: 'v2.4',
    isCurrent: true,
    benchmarkValue: std.benchmarkValue,
    advancedValue: std.advancedValue,
    compareOperator: std.compareOperator,
    unit: std.unit,
    standardSource: std.standardSource,
    effectiveDate: std.effectiveDate || '2026-01-01',
    expiryDate: '至今',
    changeReason: '贯彻落实特变电工2026年度能耗双控目标考核红线，加严考核门槛',
    approvalDoc: '特变电装管发〔2026〕018号',
    maintainer: std.maintainer || '集团战略运营管理部',
    reviewer: '王总工程师',
    status: 'active',
    deltaDesc: isLte ? '基准加严 4.3%' : '目标提升 5.0%',
    notes: '纳入2026年直属企业第一期绩效对标考评体系',
  }

  // v2.1 (2025年度执行版本)
  const v21Val = isLte 
    ? Number((std.benchmarkValue * 1.045).toFixed(4))
    : Number((std.benchmarkValue * 0.95).toFixed(4))
  const v21Adv = std.advancedValue !== undefined 
    ? (isLte ? Number((std.advancedValue * 1.04).toFixed(4)) : Number((std.advancedValue * 0.96).toFixed(4)))
    : undefined

  const v21: BenchmarkVersionRecord = {
    id: `ver-${std.id}-21`,
    standardId: std.id,
    versionNumber: 'v2.1',
    isCurrent: false,
    benchmarkValue: v21Val,
    advancedValue: v21Adv,
    compareOperator: std.compareOperator,
    unit: std.unit,
    standardSource: std.standardSource.replace('2026', '2025') || '特变电工2025年度能效标杆考核定额',
    effectiveDate: '2025-01-01',
    expiryDate: '2025-12-31',
    changeReason: '根据直属制造基地产线装备能效复测与节能改造实绩优化调整',
    approvalDoc: '特变企管〔2025〕022号',
    maintainer: std.maintainer || '集团生产运营部',
    reviewer: '刘主任',
    status: 'archived',
    deltaDesc: isLte ? '基准加严 3.5%' : '目标提升 4.0%',
    notes: '2025年度执行完毕，已完成年终考核审计归档',
  }

  // v1.0 (2024年首发基线版本)
  const v10Val = isLte 
    ? Number((std.benchmarkValue * 1.09).toFixed(4))
    : Number((std.benchmarkValue * 0.90).toFixed(4))
  const v10Adv = std.advancedValue !== undefined 
    ? (isLte ? Number((std.advancedValue * 1.08).toFixed(4)) : Number((std.advancedValue * 0.92).toFixed(4)))
    : undefined

  const v10: BenchmarkVersionRecord = {
    id: `ver-${std.id}-10`,
    standardId: std.id,
    versionNumber: 'v1.0',
    isCurrent: false,
    benchmarkValue: v10Val,
    advancedValue: v10Adv,
    compareOperator: std.compareOperator,
    unit: std.unit,
    standardSource: '特变电工“十四五”能效基准数据库发布纲要',
    effectiveDate: '2024-01-01',
    expiryDate: '2024-12-31',
    changeReason: '数字化能碳双中心平台首次纳管建标，确立集团首批指导基线',
    approvalDoc: '特变能碳发〔2024〕001号',
    maintainer: '能环管理中心 · 规划组',
    reviewer: '集团双碳推进办公室',
    status: 'archived',
    deltaDesc: '首次建标',
    notes: '首批上线基线指标',
  }

  return [v24, v21, v10]
}

export const INITIAL_BENCHMARK_VERSIONS: Record<string, BenchmarkVersionRecord[]> = {}

// 关键工序初始基准列表 (覆盖变压器：器身干燥、浇注固化、试验；线缆：拉丝、交联，支持对标管理实时动态录入与维护)
const INITIAL_KEY_PROCESS_LIST: SharedProcessBenchmarkGroup[] = [
  // 变压器产业
  {
    id: 'proc-tx-drying',
    industry: 'transformer',
    industryName: '变压器产业',
    processName: '器身干燥',
    unit: 'kWh/t',
    energyTypes: '电力、蒸汽',
    industryBenchmark: 48.0,
    industryBenchmarkSource: 'GB/T 变压器气相真空干燥先进标杆 (48.0)',
    groupAvg: 51.8,
    companies: [
      { companyId: 'hb_main', companyName: '衡变本部 (特高压车间)', value: 49.8, isOptimal: true, diffGroupPct: '-3.9%' },
      { companyId: 'sb_main', companyName: '沈变本部 (超高压车间)', value: 51.5, isOptimal: false, diffGroupPct: '-0.6%' },
      { companyId: 'hb_hn', companyName: '衡变湖南电气', value: 52.8, isOptimal: false, diffGroupPct: '+1.9%' },
      { companyId: 'xb_uhv', companyName: '新变超高压公司', value: 53.2, isOptimal: false, diffGroupPct: '+2.7%' },
      { companyId: 'hb_tnj', companyName: '衡变特能建', value: 54.0, isOptimal: false, diffGroupPct: '+4.2%' },
    ],
  },
  {
    id: 'proc-tx-casting',
    industry: 'transformer',
    industryName: '变压器产业',
    processName: '浇注固化',
    unit: 'kWh/台',
    energyTypes: '电力、蒸汽',
    industryBenchmark: 155.0,
    industryBenchmarkSource: '干式变压器固化先进限值 (155.0)',
    groupAvg: 161.0,
    companies: [
      { companyId: 'xb_tb', companyName: '新变天变公司', value: 158.0, isOptimal: true, diffGroupPct: '-1.9%' },
      { companyId: 'sb_db', companyName: '沈变干变车间', value: 160.5, isOptimal: false, diffGroupPct: '-0.3%' },
      { companyId: 'hb_pd', companyName: '衡变配电车间', value: 162.0, isOptimal: false, diffGroupPct: '+0.6%' },
      { companyId: 'xb_zndq', companyName: '新变智能电气公司', value: 164.0, isOptimal: false, diffGroupPct: '+1.9%' },
    ],
  },
  {
    id: 'proc-tx-testing',
    industry: 'transformer',
    industryName: '变压器产业',
    processName: '试验',
    unit: 'kWh/kVA',
    energyTypes: '电力',
    industryBenchmark: 0.022,
    industryBenchmarkSource: '行业试验站节能先进限值 (0.022)',
    groupAvg: 0.024,
    companies: [
      { companyId: 'sb_main', companyName: '沈变本部 (试验站)', value: 0.023, isOptimal: true, diffGroupPct: '-4.2%' },
      { companyId: 'hb_main', companyName: '衡变本部 (试验大厅)', value: 0.024, isOptimal: false, diffGroupPct: '0.0%' },
      { companyId: 'hb_tnj', companyName: '衡变特能建', value: 0.0245, isOptimal: false, diffGroupPct: '+2.1%' },
      { companyId: 'xb_uhv', companyName: '新变超高压试验站', value: 0.025, isOptimal: false, diffGroupPct: '+4.2%' },
      { companyId: 'hb_hn', companyName: '衡变湖南电气', value: 0.0255, isOptimal: false, diffGroupPct: '+6.3%' },
    ],
  },
  // 线缆产业
  {
    id: 'proc-cb-drawing',
    industry: 'cable',
    industryName: '线缆产业',
    processName: '拉丝',
    unit: 'kWh/t (铜)',
    energyTypes: '电力',
    industryBenchmark: 320.0,
    industryBenchmarkSource: 'GB/T 铜材拉丝能效先进限值 (320.0)',
    groupAvg: 330.0,
    companies: [
      { companyId: 'll_main', companyName: '鲁缆本部 (拉丝车间)', value: 315.0, isOptimal: true, diffGroupPct: '-4.5%' },
      { companyId: 'xl_main', companyName: '特变电工新疆电缆有限公司', value: 330.0, isOptimal: false, diffGroupPct: '0.0%' },
      { companyId: 'xl_sub', companyName: '特变电工新疆线缆厂', value: 332.0, isOptimal: false, diffGroupPct: '+0.6%' },
      { companyId: 'dl_main', companyName: '特变电工（德阳）电缆股份有限公司', value: 345.0, isOptimal: false, diffGroupPct: '+4.5%' },
    ],
  },
  {
    id: 'proc-cb-crosslinking',
    industry: 'cable',
    industryName: '线缆产业',
    processName: '交联',
    unit: 'kWh/km',
    energyTypes: '电力、氮气',
    industryBenchmark: 1150.0,
    industryBenchmarkSource: '超高压立塔干法交联行业先进标杆 (1,150.0)',
    groupAvg: 1202.0,
    companies: [
      { companyId: 'll_main', companyName: '鲁缆本部 (立塔交联车间)', value: 1160.0, isOptimal: true, diffGroupPct: '-3.5%' },
      { companyId: 'xl_sub', companyName: '特变电工新疆线缆厂', value: 1195.0, isOptimal: false, diffGroupPct: '-0.6%' },
      { companyId: 'xl_main', companyName: '特变电工新疆电缆有限公司 (立塔部)', value: 1208.0, isOptimal: false, diffGroupPct: '+0.5%' },
      { companyId: 'dl_main', companyName: '特变电工（德阳）电缆股份有限公司', value: 1238.0, isOptimal: false, diffGroupPct: '+3.0%' },
    ],
  },
]

// ============================================================================
// 纵向对比 (Tab 3: 产品单耗对比) 专属数据模型与订单明细台账库
// 检索项：项目公司、产品大类、产品中类、时间段选择 (月到月)、产品型号
// 业务逻辑：筛选该时间段内完成的大于两个订单 (>= 2 个订单) 的产品型号
// ============================================================================

export interface VerticalProjectCompany {
  id: string
  name: string
  industry: 'transformer' | 'cable'
}

export const VERTICAL_PROJECT_COMPANIES: VerticalProjectCompany[] = [
  { id: 'hb', name: '衡变公司', industry: 'transformer' },
  { id: 'sb', name: '沈变公司', industry: 'transformer' },
  { id: 'xb', name: '新变厂', industry: 'transformer' },
  { id: 'll', name: '鲁缆公司', industry: 'cable' },
  { id: 'xl', name: '新缆厂', industry: 'cable' },
  { id: 'dl', name: '德缆公司', industry: 'cable' },
]

export interface VerticalCatalogKind {
  kind: string
  models: {
    id: string
    name: string
    unit: string
  }[]
}

export interface VerticalCatalogBroad {
  broadCategory: string
  kinds: VerticalCatalogKind[]
}

export const VERTICAL_CATALOG_STRUCTURE: Record<'transformer' | 'cable', VerticalCatalogBroad[]> = {
  transformer: [
    {
      broadCategory: '电力变压器',
      kinds: [
        {
          kind: '特高压单相自耦变压器',
          models: [
            { id: 'm-tx-01', name: 'ODFS-334MVA/500kV 单相自耦变压器', unit: '台' },
            { id: 'm-tx-02', name: 'ODFS-250MVA/500kV 自耦变压器', unit: '台' },
          ],
        },
        {
          kind: '超高压三相电力变压器',
          models: [
            { id: 'm-tx-03', name: 'SFZ11-240MVA/220kV 三相三线圈电力变', unit: '台' },
            { id: 'm-tx-04', name: 'SFP-400MVA/220kV 发电机变压器', unit: '台' },
          ],
        },
      ],
    },
    {
      broadCategory: '配电及特种变压器',
      kinds: [
        {
          kind: '节能型油浸式变压器',
          models: [
            { id: 'm-tx-05', name: 'SZ11-50000/110kV 节能型油浸式变压器', unit: '台' },
          ],
        },
        {
          kind: '环氧树脂浇注干式变压器',
          models: [
            { id: 'm-tx-06', name: 'SCB13-1600kVA/10kV 环氧浇注干变', unit: '台' },
          ],
        },
      ],
    },
  ],
  cable: [
    {
      broadCategory: '高压及特高压交联电缆',
      kinds: [
        {
          kind: '高压交联电力电缆',
          models: [
            { id: 'm-cb-01', name: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)', unit: 'km' },
            { id: 'm-cb-02', name: '220kV 交联聚乙烯电力电缆 (YJLW02-127/220kV)', unit: 'km' },
          ],
        },
        {
          kind: '超高压皱纹铝套电缆',
          models: [
            { id: 'm-cb-03', name: '500kV 皱纹铝套超高压交联电缆', unit: 'km' },
          ],
        },
      ],
    },
    {
      broadCategory: '中低压电力电缆',
      kinds: [
        {
          kind: '中压铠装电缆',
          models: [
            { id: 'm-cb-04', name: '35kV 铠装电力电缆 (YJV22-26/35kV 3*300)', unit: 'km' },
          ],
        },
      ],
    },
    {
      broadCategory: '特种装备电缆',
      kinds: [
        {
          kind: '新能源专用电缆',
          models: [
            { id: 'm-cb-05', name: '光伏及风电耐寒特种软电缆 (WDZ-YJY)', unit: 'km' },
          ],
        },
      ],
    },
  ],
}

export interface VerticalOrderItem {
  orderNo: string
  companyName: string
  broadCategory: string
  kind: string
  modelId: string
  modelName: string
  finishDate: string
  finishMonth: string
  quantity: string
  unit: string
  tce: number
  elec: number
  steam?: number
  water: number
}

export const VERTICAL_ORDER_LEDGER_DATA: VerticalOrderItem[] = [
  // ------------------ 衡变公司 ------------------
  // 1. ODFS-334MVA/500kV 单相自耦变压器 (5 笔已完成订单)
  { orderNo: 'SO-202601-018', companyName: '衡变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-01-20', finishMonth: '2026-01', quantity: '2台', unit: '台', tce: 14.52, elec: 107500, steam: 3.50, water: 19.8 },
  { orderNo: 'SO-202602-045', companyName: '衡变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-02-18', finishMonth: '2026-02', quantity: '2台', unit: '台', tce: 14.28, elec: 105800, steam: 3.40, water: 19.2 },
  { orderNo: 'SO-202604-082', companyName: '衡变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-04-12', finishMonth: '2026-04', quantity: '3台', unit: '台', tce: 13.95, elec: 103400, steam: 3.30, water: 18.6 },
  { orderNo: 'SO-202605-116', companyName: '衡变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-05-25', finishMonth: '2026-05', quantity: '2台', unit: '台', tce: 13.82, elec: 102400, steam: 3.20, water: 18.5 },
  { orderNo: 'SO-202607-160', companyName: '衡变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-07-15', finishMonth: '2026-07', quantity: '4台', unit: '台', tce: 13.60, elec: 101000, steam: 3.10, water: 18.0 },

  // 2. ODFS-250MVA/500kV 自耦变压器 (4 笔已完成订单)
  { orderNo: 'SO-202602-032', companyName: '衡变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-02', modelName: 'ODFS-250MVA/500kV 自耦变压器', finishDate: '2026-02-10', finishMonth: '2026-02', quantity: '2台', unit: '台', tce: 11.20, elec: 83000, steam: 2.80, water: 15.2 },
  { orderNo: 'SO-202603-066', companyName: '衡变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-02', modelName: 'ODFS-250MVA/500kV 自耦变压器', finishDate: '2026-03-15', finishMonth: '2026-03', quantity: '2台', unit: '台', tce: 10.95, elec: 81200, steam: 2.70, water: 14.8 },
  { orderNo: 'SO-202605-108', companyName: '衡变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-02', modelName: 'ODFS-250MVA/500kV 自耦变压器', finishDate: '2026-05-12', finishMonth: '2026-05', quantity: '3台', unit: '台', tce: 10.80, elec: 80100, steam: 2.60, water: 14.3 },
  { orderNo: 'SO-202608-192', companyName: '衡变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-02', modelName: 'ODFS-250MVA/500kV 自耦变压器', finishDate: '2026-08-08', finishMonth: '2026-08', quantity: '2台', unit: '台', tce: 10.65, elec: 78900, steam: 2.50, water: 14.0 },

  // 3. SFZ11-240MVA/220kV 三相三线圈电力变 (4 笔已完成订单)
  { orderNo: 'SO-202601-015', companyName: '衡变公司', broadCategory: '电力变压器', kind: '超高压三相电力变压器', modelId: 'm-tx-03', modelName: 'SFZ11-240MVA/220kV 三相三线圈电力变', finishDate: '2026-01-16', finishMonth: '2026-01', quantity: '3台', unit: '台', tce: 8.20, elec: 61500, steam: 2.10, water: 12.0 },
  { orderNo: 'SO-202603-060', companyName: '衡变公司', broadCategory: '电力变压器', kind: '超高压三相电力变压器', modelId: 'm-tx-03', modelName: 'SFZ11-240MVA/220kV 三相三线圈电力变', finishDate: '2026-03-24', finishMonth: '2026-03', quantity: '2台', unit: '台', tce: 8.05, elec: 60300, steam: 2.00, water: 11.6 },
  { orderNo: 'SO-202606-135', companyName: '衡变公司', broadCategory: '电力变压器', kind: '超高压三相电力变压器', modelId: 'm-tx-03', modelName: 'SFZ11-240MVA/220kV 三相三线圈电力变', finishDate: '2026-06-18', finishMonth: '2026-06', quantity: '4台', unit: '台', tce: 7.92, elec: 59400, steam: 1.95, water: 11.4 },
  { orderNo: 'SO-202607-168', companyName: '衡变公司', broadCategory: '电力变压器', kind: '超高压三相电力变压器', modelId: 'm-tx-03', modelName: 'SFZ11-240MVA/220kV 三相三线圈电力变', finishDate: '2026-07-28', finishMonth: '2026-07', quantity: '2台', unit: '台', tce: 7.85, elec: 58900, steam: 1.90, water: 11.2 },

  // 4. SFP-400MVA/220kV 发电机变压器 (仅 1 笔订单，测试过滤逻辑：小于两个订单不显示)
  { orderNo: 'SO-202603-055', companyName: '衡变公司', broadCategory: '电力变压器', kind: '超高压三相电力变压器', modelId: 'm-tx-04', modelName: 'SFP-400MVA/220kV 发电机变压器', finishDate: '2026-03-10', finishMonth: '2026-03', quantity: '1台', unit: '台', tce: 9.10, elec: 68000, steam: 2.30, water: 13.5 },

  // 5. SZ11-50000/110kV 节能型油浸式变压器 (4 笔已完成订单)
  { orderNo: 'SO-202602-028', companyName: '衡变公司', broadCategory: '配电及特种变压器', kind: '节能型油浸式变压器', modelId: 'm-tx-05', modelName: 'SZ11-50000/110kV 节能型油浸式变压器', finishDate: '2026-02-08', finishMonth: '2026-02', quantity: '4台', unit: '台', tce: 4.45, elec: 33400, steam: 1.30, water: 9.2 },
  { orderNo: 'SO-202604-075', companyName: '衡变公司', broadCategory: '配电及特种变压器', kind: '节能型油浸式变压器', modelId: 'm-tx-05', modelName: 'SZ11-50000/110kV 节能型油浸式变压器', finishDate: '2026-04-14', finishMonth: '2026-04', quantity: '5台', unit: '台', tce: 4.38, elec: 32900, steam: 1.25, water: 8.9 },
  { orderNo: 'SO-202606-125', companyName: '衡变公司', broadCategory: '配电及特种变压器', kind: '节能型油浸式变压器', modelId: 'm-tx-05', modelName: 'SZ11-50000/110kV 节能型油浸式变压器', finishDate: '2026-06-10', finishMonth: '2026-06', quantity: '4台', unit: '台', tce: 4.32, elec: 32400, steam: 1.22, water: 8.8 },
  { orderNo: 'SO-202608-185', companyName: '衡变公司', broadCategory: '配电及特种变压器', kind: '节能型油浸式变压器', modelId: 'm-tx-05', modelName: 'SZ11-50000/110kV 节能型油浸式变压器', finishDate: '2026-08-12', finishMonth: '2026-08', quantity: '6台', unit: '台', tce: 4.28, elec: 32100, steam: 1.20, water: 8.6 },

  // 6. SCB13-1600kVA/10kV 环氧浇注干变 (5 笔已完成订单)
  { orderNo: 'SO-202601-010', companyName: '衡变公司', broadCategory: '配电及特种变压器', kind: '环氧树脂浇注干式变压器', modelId: 'm-tx-06', modelName: 'SCB13-1600kVA/10kV 环氧浇注干变', finishDate: '2026-01-12', finishMonth: '2026-01', quantity: '8台', unit: '台', tce: 0.72, elec: 5400, steam: 0.19, water: 2.2 },
  { orderNo: 'SO-202603-045', companyName: '衡变公司', broadCategory: '配电及特种变压器', kind: '环氧树脂浇注干式变压器', modelId: 'm-tx-06', modelName: 'SCB13-1600kVA/10kV 环氧浇注干变', finishDate: '2026-03-08', finishMonth: '2026-03', quantity: '10台', unit: '台', tce: 0.70, elec: 5280, steam: 0.185, water: 2.15 },
  { orderNo: 'SO-202604-080', companyName: '衡变公司', broadCategory: '配电及特种变压器', kind: '环氧树脂浇注干式变压器', modelId: 'm-tx-06', modelName: 'SCB13-1600kVA/10kV 环氧浇注干变', finishDate: '2026-04-18', finishMonth: '2026-04', quantity: '12台', unit: '台', tce: 0.69, elec: 5190, steam: 0.182, water: 2.12 },
  { orderNo: 'SO-202606-130', companyName: '衡变公司', broadCategory: '配电及特种变压器', kind: '环氧树脂浇注干式变压器', modelId: 'm-tx-06', modelName: 'SCB13-1600kVA/10kV 环氧浇注干变', finishDate: '2026-06-22', finishMonth: '2026-06', quantity: '10台', unit: '台', tce: 0.685, elec: 5140, steam: 0.180, water: 2.10 },
  { orderNo: 'SO-202607-165', companyName: '衡变公司', broadCategory: '配电及特种变压器', kind: '环氧树脂浇注干式变压器', modelId: 'm-tx-06', modelName: 'SCB13-1600kVA/10kV 环氧浇注干变', finishDate: '2026-07-26', finishMonth: '2026-07', quantity: '15台', unit: '台', tce: 0.68, elec: 5100, steam: 0.178, water: 2.08 },

  // ------------------ 沈变公司 ------------------
  { orderNo: 'SO-202601-022', companyName: '沈变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-01-28', finishMonth: '2026-01', quantity: '2台', unit: '台', tce: 14.85, elec: 109200, steam: 3.60, water: 20.2 },
  { orderNo: 'SO-202603-050', companyName: '沈变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-03-20', finishMonth: '2026-03', quantity: '2台', unit: '台', tce: 14.60, elec: 107800, steam: 3.50, water: 19.8 },
  { orderNo: 'SO-202605-120', companyName: '沈变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-05-18', finishMonth: '2026-05', quantity: '3台', unit: '台', tce: 14.30, elec: 106000, steam: 3.40, water: 19.1 },
  { orderNo: 'SO-202607-175', companyName: '沈变公司', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-07-22', finishMonth: '2026-07', quantity: '2台', unit: '台', tce: 14.15, elec: 104800, steam: 3.30, water: 18.8 },

  // ------------------ 新变厂 ------------------
  { orderNo: 'SO-202602-038', companyName: '新变厂', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-02-15', finishMonth: '2026-02', quantity: '2台', unit: '台', tce: 15.10, elec: 111500, steam: 3.70, water: 20.8 },
  { orderNo: 'SO-202604-090', companyName: '新变厂', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-04-20', finishMonth: '2026-04', quantity: '2台', unit: '台', tce: 14.75, elec: 109000, steam: 3.60, water: 20.1 },
  { orderNo: 'SO-202606-140', companyName: '新变厂', broadCategory: '电力变压器', kind: '特高压单相自耦变压器', modelId: 'm-tx-01', modelName: 'ODFS-334MVA/500kV 单相自耦变压器', finishDate: '2026-06-25', finishMonth: '2026-06', quantity: '3台', unit: '台', tce: 14.50, elec: 107200, steam: 3.50, water: 19.6 },

  // ------------------ 鲁缆公司 ------------------
  // 1. 110kV 交联聚乙烯电力电缆 (5 笔订单)
  { orderNo: 'SO-202601-005', companyName: '鲁缆公司', broadCategory: '高压及特高压交联电缆', kind: '高压交联电力电缆', modelId: 'm-cb-01', modelName: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)', finishDate: '2026-01-15', finishMonth: '2026-01', quantity: '8km', unit: 'km', tce: 0.612, elec: 4600, water: 2.00 },
  { orderNo: 'SO-202603-040', companyName: '鲁缆公司', broadCategory: '高压及特高压交联电缆', kind: '高压交联电力电缆', modelId: 'm-cb-01', modelName: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)', finishDate: '2026-03-12', finishMonth: '2026-03', quantity: '10km', unit: 'km', tce: 0.601, elec: 4520, water: 1.95 },
  { orderNo: 'SO-202604-070', companyName: '鲁缆公司', broadCategory: '高压及特高压交联电缆', kind: '高压交联电力电缆', modelId: 'm-cb-01', modelName: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)', finishDate: '2026-04-19', finishMonth: '2026-04', quantity: '12km', unit: 'km', tce: 0.592, elec: 4450, water: 1.88 },
  { orderNo: 'SO-202606-120', companyName: '鲁缆公司', broadCategory: '高压及特高压交联电缆', kind: '高压交联电力电缆', modelId: 'm-cb-01', modelName: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)', finishDate: '2026-06-16', finishMonth: '2026-06', quantity: '15km', unit: 'km', tce: 0.586, elec: 4410, water: 1.84 },
  { orderNo: 'SO-202607-155', companyName: '鲁缆公司', broadCategory: '高压及特高压交联电缆', kind: '高压交联电力电缆', modelId: 'm-cb-01', modelName: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)', finishDate: '2026-07-20', finishMonth: '2026-07', quantity: '12km', unit: 'km', tce: 0.582, elec: 4380, water: 1.80 },

  // 2. 35kV 铠装电力电缆 (5 笔订单)
  { orderNo: 'SO-202601-008', companyName: '鲁缆公司', broadCategory: '中低压电力电缆', kind: '中压铠装电缆', modelId: 'm-cb-04', modelName: '35kV 铠装电力电缆 (YJV22-26/35kV 3*300)', finishDate: '2026-01-18', finishMonth: '2026-01', quantity: '20km', unit: 'km', tce: 0.252, elec: 1890, water: 1.10 },
  { orderNo: 'SO-202602-035', companyName: '鲁缆公司', broadCategory: '中低压电力电缆', kind: '中压铠装电缆', modelId: 'm-cb-04', modelName: '35kV 铠装电力电缆 (YJV22-26/35kV 3*300)', finishDate: '2026-02-20', finishMonth: '2026-02', quantity: '25km', unit: 'km', tce: 0.248, elec: 1860, water: 1.06 },
  { orderNo: 'SO-202604-078', companyName: '鲁缆公司', broadCategory: '中低压电力电缆', kind: '中压铠装电缆', modelId: 'm-cb-04', modelName: '35kV 铠装电力电缆 (YJV22-26/35kV 3*300)', finishDate: '2026-04-16', finishMonth: '2026-04', quantity: '30km', unit: 'km', tce: 0.245, elec: 1840, water: 1.04 },
  { orderNo: 'SO-202606-122', companyName: '鲁缆公司', broadCategory: '中低压电力电缆', kind: '中压铠装电缆', modelId: 'm-cb-04', modelName: '35kV 铠装电力电缆 (YJV22-26/35kV 3*300)', finishDate: '2026-06-24', finishMonth: '2026-06', quantity: '25km', unit: 'km', tce: 0.243, elec: 1825, water: 1.02 },
  { orderNo: 'SO-202607-158', companyName: '鲁缆公司', broadCategory: '中低压电力电缆', kind: '中压铠装电缆', modelId: 'm-cb-04', modelName: '35kV 铠装电力电缆 (YJV22-26/35kV 3*300)', finishDate: '2026-07-25', finishMonth: '2026-07', quantity: '35km', unit: 'km', tce: 0.241, elec: 1810, water: 1.00 },

  // 3. 光伏及风电耐寒特种软电缆 (4 笔订单)
  { orderNo: 'SO-202603-048', companyName: '鲁缆公司', broadCategory: '特种装备电缆', kind: '新能源专用电缆', modelId: 'm-cb-05', modelName: '光伏及风电耐寒特种软电缆 (WDZ-YJY)', finishDate: '2026-03-22', finishMonth: '2026-03', quantity: '40km', unit: 'km', tce: 0.165, elec: 1240, water: 0.60 },
  { orderNo: 'SO-202605-110', companyName: '鲁缆公司', broadCategory: '特种装备电缆', kind: '新能源专用电缆', modelId: 'm-cb-05', modelName: '光伏及风电耐寒特种软电缆 (WDZ-YJY)', finishDate: '2026-05-14', finishMonth: '2026-05', quantity: '50km', unit: 'km', tce: 0.160, elec: 1205, water: 0.56 },
  { orderNo: 'SO-202606-132', companyName: '鲁缆公司', broadCategory: '特种装备电缆', kind: '新能源专用电缆', modelId: 'm-cb-05', modelName: '光伏及风电耐寒特种软电缆 (WDZ-YJY)', finishDate: '2026-06-20', finishMonth: '2026-06', quantity: '45km', unit: 'km', tce: 0.158, elec: 1188, water: 0.54 },
  { orderNo: 'SO-202608-188', companyName: '鲁缆公司', broadCategory: '特种装备电缆', kind: '新能源专用电缆', modelId: 'm-cb-05', modelName: '光伏及风电耐寒特种软电缆 (WDZ-YJY)', finishDate: '2026-08-16', finishMonth: '2026-08', quantity: '60km', unit: 'km', tce: 0.155, elec: 1165, water: 0.52 },
]

export default function BenchmarkManagementPage() {
  // 当前主 Tab
  const [activeTab, setActiveTab] = useState<BenchmarkTabKey>('horizontal')

  // 零碳工厂当前选中的对比指标
  const [activeZeroCarbonMetric, setActiveZeroCarbonMetric] = useState<ZeroCarbonMetricType>('carbon_per_tce')
  // 零碳工厂对标所属制造公司筛选 ('全部' | '沈变公司' | '衡变公司' | '新变厂' | '鲁缆公司' | '新缆厂' | '德缆公司')
  const [selectedBenchmarkCompany, setSelectedBenchmarkCompany] = useState<string>('全部')

  // 同型号产品项目公司横向对比五级级联筛选状态 (产品类型、选择时间、产品大类、产品中类、型号)
  const [horizontalIndustry, setHorizontalIndustry] = useState<'transformer' | 'cable'>('transformer')
  const [horizontalTimeMonth, setHorizontalTimeMonth] = useState<string>('2026-08')
  const [horizontalBroadCategory, setHorizontalBroadCategory] = useState<string>('电力变压器')
  const [horizontalKind, setHorizontalKind] = useState<string>('特高压单相自耦变压器')
  const [horizontalModelId, setHorizontalModelId] = useState<string>('tx-01')

  // 关联工厂生产能耗深度分析弹窗状态与选中的工厂Tab
  const [showFactoryEnergyModal, setShowFactoryEnergyModal] = useState<boolean>(false)
  const [selectedFactoryForModal, setSelectedFactoryForModal] = useState<string>('hb_main')

  // 5、产品单耗对比（纵向）状态：项目公司（下拉）、产品大类（下拉）、产品中类（下拉）、时间段选择（月到月）、产品型号（下拉）
  const [verticalCompanyName, setVerticalCompanyName] = useState<string>('衡变公司')
  const [verticalBroadCategory, setVerticalBroadCategory] = useState<string>('电力变压器')
  const [verticalKind, setVerticalKind] = useState<string>('特高压单相自耦变压器')
  const [verticalStartMonth, setVerticalStartMonth] = useState<string>('2026-01')
  const [verticalEndMonth, setVerticalEndMonth] = useState<string>('2026-08')
  const [verticalModelId, setVerticalModelId] = useState<string>('m-tx-01')
  const [verticalMetricObject, setVerticalMetricObject] = useState<'tce' | 'elec' | 'steam' | 'water'>('tce')
  const [isVerticalQuerying, setIsVerticalQuerying] = useState<boolean>(false)

  // 6、关键工序单耗对比状态：产业（变压器、线缆）、关键工序（变压器：器身干燥、浇注固化、试验；线缆：拉丝、交联）、选择时间
  const [processList, setProcessList] = useState<SharedProcessBenchmarkGroup[]>(INITIAL_KEY_PROCESS_LIST)
  const [processIndustry, setProcessIndustry] = useState<'transformer' | 'cable'>('transformer')
  const [selectedProcessId, setSelectedProcessId] = useState<string>('proc-tx-drying')
  const [processTimeMonth, setProcessTimeMonth] = useState<string>('2026-08')
  const [isProcessQuerying, setIsProcessQuerying] = useState<boolean>(false)

  // 双周期对比状态：基准周期 (几月到几月) vs 对比周期 (几月到几月)
  const [basePeriodRange, setBasePeriodRange] = useState({ start: '2025-01', end: '2025-08' })
  const [comparePeriodRange, setComparePeriodRange] = useState({ start: '2026-01', end: '2026-08' })
  const [periodPresetMode, setPeriodPresetMode] = useState<'yoy' | 'mom' | 'custom'>('yoy')

  // 🌟 对标管理统一时间查询模块状态 (月度/季度/年度/自定义，统一放置在顶部Tab栏右侧)
  const [benchmarkTimeDim, setBenchmarkTimeDim] = useState<'month' | 'quarter' | 'year' | 'custom'>('month')
  const [benchmarkSelectedMonth, setBenchmarkSelectedMonth] = useState('2026-08')
  const [benchmarkSelectedQuarter, setBenchmarkSelectedQuarter] = useState('2026-Q3')
  const [benchmarkSelectedYear, setBenchmarkSelectedYear] = useState('2026')
  const [benchmarkSelectedMonthRange, setBenchmarkSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })

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
    setBenchmarkSelectedMonthRange((prev) => {
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
    setBenchmarkSelectedMonthRange((prev) => {
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

  const benchmarkTimeLabel = useMemo(() => {
    if (benchmarkTimeDim === 'month') return `${benchmarkSelectedMonth.slice(0, 4)}年${benchmarkSelectedMonth.slice(5, 7)}月`
    if (benchmarkTimeDim === 'quarter') return benchmarkSelectedQuarter
    if (benchmarkTimeDim === 'year') return `${benchmarkSelectedYear}年度`
    return `${benchmarkSelectedMonthRange.start} 至 ${benchmarkSelectedMonthRange.end}`
  }, [benchmarkTimeDim, benchmarkSelectedMonth, benchmarkSelectedQuarter, benchmarkSelectedYear, benchmarkSelectedMonthRange])

  // 基准管理状态：分类筛选、搜索关键词、基准数据列表、编辑态与汇总抽屉
  const [standardCategoryFilter, setStandardCategoryFilter] = useState<BenchmarkStandardCategory>('factory')
  const [standardSearchKeyword, setStandardSearchKeyword] = useState('')
  const [standardsList, setStandardsList] = useState<BenchmarkStandardItem[]>(BENCHMARK_STANDARDS_DATA)
  const [editingStandardId, setEditingStandardId] = useState<string | null>(null)

  // 弹窗状态与表单模型 (包含完整的基准数据字段：标准基准值、标杆先进值、集团均值、比较符、单位、关键工序维护)
  const [showAddStandardModal, setShowAddStandardModal] = useState(false)
  const [newStandardForm, setNewStandardForm] = useState({
    category: 'factory' as 'factory' | 'process',
    processIndustry: 'transformer' as 'transformer' | 'cable',
    energyTypes: '电力、蒸汽',
    indicatorName: '',
    scope: '',
    benchmarkValue: '',
    advancedValue: '',
    compareOperator: '<=' as '<=' | '>=',
    unit: 'kWh/t',
    standardSource: '',
    currentGroupAvg: '',
    effectiveDate: '2026-09-01',
    maintainer: '集团战略运营管理部',
    notes: '',
  })

  // 🌟 版本管理状态与模型 (响应用户“版本管理目前功能缺失”需求，支持查看多版本演进、版本详情、发布新版本、回滚激活)
  const [showVersionModal, setShowVersionModal] = useState<boolean>(false)
  const [selectedVersionStandard, setSelectedVersionStandard] = useState<BenchmarkStandardItem | null>(null)
  const [benchmarkVersions, setBenchmarkVersions] = useState<Record<string, BenchmarkVersionRecord[]>>(INITIAL_BENCHMARK_VERSIONS)
  const [showNewVersionForm, setShowNewVersionForm] = useState<boolean>(false)
  const [selectedVersionForDetail, setSelectedVersionForDetail] = useState<BenchmarkVersionRecord | null>(null)
  const [versionToastMsg, setVersionToastMsg] = useState<string | null>(null)
  const [newVersionForm, setNewVersionForm] = useState({
    versionNumber: 'v2.5',
    benchmarkValue: '',
    advancedValue: '',
    compareOperator: '<=' as '<=' | '>=',
    standardSource: '',
    effectiveDate: '2026-10-01',
    changeReason: '',
    approvalDoc: '',
    maintainer: '集团战略运营管理部',
    reviewer: '王总工程师',
    notes: '',
  })

  // 打开版本管理弹窗
  const handleOpenVersionModal = (std: BenchmarkStandardItem) => {
    setSelectedVersionStandard(std)
    setShowVersionModal(true)
    setShowNewVersionForm(false)
    setSelectedVersionForDetail(null)
    setVersionToastMsg(null)

    // 确保有版本演进数据
    let currentVers = benchmarkVersions[std.id]
    if (!currentVers || currentVers.length === 0) {
      currentVers = generateStandardVersions(std)
      setBenchmarkVersions((prev) => ({ ...prev, [std.id]: currentVers }))
    }

    const latestVer = currentVers[0]?.versionNumber || 'v2.4'
    const numPart = parseFloat(latestVer.replace('v', '')) || 2.4
    const nextVer = `v${(numPart + 0.1).toFixed(1)}`

    setNewVersionForm({
      versionNumber: nextVer,
      benchmarkValue: String(std.benchmarkValue),
      advancedValue: std.advancedValue !== undefined ? String(std.advancedValue) : '',
      compareOperator: std.compareOperator,
      standardSource: std.standardSource,
      effectiveDate: '2026-10-01',
      changeReason: '',
      approvalDoc: `特变能碳管发〔2026〕0${Math.floor(Math.random() * 50 + 10)}号`,
      maintainer: std.maintainer || '集团战略运营管理部',
      reviewer: '王总工程师',
      notes: '',
    })
  }

  // 发布新版本
  const handlePublishNewVersion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVersionStandard) return
    const bVal = Number(newVersionForm.benchmarkValue)
    if (isNaN(bVal) || bVal <= 0) {
      alert('请输入有效的门槛基准值！')
      return
    }
    const advVal = newVersionForm.advancedValue ? Number(newVersionForm.advancedValue) : undefined
    const stdId = selectedVersionStandard.id
    const prevVersions = benchmarkVersions[stdId] || generateStandardVersions(selectedVersionStandard)
    
    // 计算相比当前运行版本的变动幅度
    const prevActive = prevVersions.find((v) => v.isCurrent) || prevVersions[0]
    let deltaDesc = '参数优化'
    if (prevActive) {
      const diff = bVal - prevActive.benchmarkValue
      const pct = Math.abs(Number(((diff / prevActive.benchmarkValue) * 100).toFixed(1)))
      if (diff < 0) {
        deltaDesc = `基准加严 ${pct}%`
      } else if (diff > 0) {
        deltaDesc = `目标放宽 ${pct}%`
      } else {
        deltaDesc = '基准持平'
      }
    }

    const newRecord: BenchmarkVersionRecord = {
      id: `ver-${stdId}-${Date.now()}`,
      standardId: stdId,
      versionNumber: newVersionForm.versionNumber || `v${(prevVersions.length + 1).toFixed(1)}`,
      isCurrent: true,
      benchmarkValue: bVal,
      advancedValue: advVal,
      compareOperator: newVersionForm.compareOperator,
      unit: selectedVersionStandard.unit,
      standardSource: newVersionForm.standardSource || selectedVersionStandard.standardSource,
      effectiveDate: newVersionForm.effectiveDate || '2026-10-01',
      expiryDate: '至今',
      changeReason: newVersionForm.changeReason || '对标考核指标定期复审收紧',
      approvalDoc: newVersionForm.approvalDoc || '特变能碳公文',
      maintainer: newVersionForm.maintainer || '集团战略运营管理部',
      reviewer: newVersionForm.reviewer || '王总工程师',
      status: 'active',
      deltaDesc,
      notes: newVersionForm.notes,
    }

    // 归档旧版本
    const updatedVersions = [
      newRecord,
      ...prevVersions.map((v) => ({
        ...v,
        isCurrent: false,
        status: (v.status === 'active' ? 'archived' : v.status) as 'archived' | 'deprecated',
        expiryDate: v.expiryDate === '至今' ? newVersionForm.effectiveDate : v.expiryDate,
      })),
    ]

    setBenchmarkVersions((prev) => ({
      ...prev,
      [stdId]: updatedVersions,
    }))

    // 同步更新主表 standardsList
    setStandardsList((prev) =>
      prev.map((item) =>
        item.id === stdId
          ? {
              ...item,
              benchmarkValue: bVal,
              advancedValue: advVal,
              compareOperator: newVersionForm.compareOperator,
              effectiveDate: newVersionForm.effectiveDate,
              standardSource: newVersionForm.standardSource || item.standardSource,
              maintainer: newVersionForm.maintainer || item.maintainer,
            }
          : item
      )
    )

    // 更新 selectedVersionStandard 当前状态
    setSelectedVersionStandard((prev) =>
      prev
        ? {
            ...prev,
            benchmarkValue: bVal,
            advancedValue: advVal,
            compareOperator: newVersionForm.compareOperator,
            effectiveDate: newVersionForm.effectiveDate,
            standardSource: newVersionForm.standardSource || prev.standardSource,
          }
        : null
    )

    setShowNewVersionForm(false)
    setVersionToastMsg(`已成功发布新基准版本【${newRecord.versionNumber}】，新基准已同步生效至全系统！`)
  }

  // 恢复/设为当前运行版本
  const handleRollbackVersion = (record: BenchmarkVersionRecord) => {
    if (!selectedVersionStandard) return
    const stdId = selectedVersionStandard.id
    const prevVersions = benchmarkVersions[stdId] || []

    const updatedVersions = prevVersions.map((v) => ({
      ...v,
      isCurrent: v.id === record.id,
      status: (v.id === record.id ? 'active' : 'archived') as 'active' | 'archived',
      expiryDate: v.id === record.id ? '至今' : (v.expiryDate === '至今' ? '2026-09-28' : v.expiryDate),
    }))

    setBenchmarkVersions((prev) => ({
      ...prev,
      [stdId]: updatedVersions,
    }))

    // 同步更新主表 standardsList
    setStandardsList((prev) =>
      prev.map((item) =>
        item.id === stdId
          ? {
              ...item,
              benchmarkValue: record.benchmarkValue,
              advancedValue: record.advancedValue,
              compareOperator: record.compareOperator,
              effectiveDate: record.effectiveDate,
              standardSource: record.standardSource,
              maintainer: record.maintainer,
            }
          : item
      )
    )

    setSelectedVersionStandard((prev) =>
      prev
        ? {
            ...prev,
            benchmarkValue: record.benchmarkValue,
            advancedValue: record.advancedValue,
            compareOperator: record.compareOperator,
            effectiveDate: record.effectiveDate,
            standardSource: record.standardSource,
          }
        : null
    )

    setVersionToastMsg(`已成功将基准版本回滚至【${record.versionNumber}】，相关指标已同步联动！`)
  }

  // 以该版本为模板复制发布新版
  const handleCopyVersionAsTemplate = (record: BenchmarkVersionRecord) => {
    const nextVer = `v${(parseFloat(record.versionNumber.replace('v', '')) + 0.1).toFixed(1)}`
    setNewVersionForm({
      versionNumber: nextVer,
      benchmarkValue: String(record.benchmarkValue),
      advancedValue: record.advancedValue ? String(record.advancedValue) : '',
      compareOperator: record.compareOperator,
      standardSource: record.standardSource,
      effectiveDate: '2026-10-01',
      changeReason: `基于历史版本 ${record.versionNumber} 进行修订优化`,
      approvalDoc: `特变能碳管发〔2026〕0${Math.floor(Math.random() * 50 + 10)}号`,
      maintainer: record.maintainer,
      reviewer: '王总工程师',
      notes: record.notes || '',
    })
    setShowNewVersionForm(true)
  }

  // 基准指标汇总统计 (彻底去除产品指标)
  const standardsSummary = useMemo(() => {
    const total = standardsList.length
    const factoryCount = standardsList.filter((s) => s.category === 'factory').length
    const processCount = standardsList.filter((s) => s.category === 'process').length
    return {
      total,
      factoryCount,
      processCount,
    }
  }, [standardsList])

  // 当前激活指标元信息
  const currentMetricMeta = ZERO_CARBON_METRICS_META[activeZeroCarbonMetric]

  // 级联衍生计算：当前产业下可选产品大类列表
  const availableBroadCategories = useMemo(() => {
    const prods = CROSS_COMPANY_PRODUCT_BENCHMARKS.filter(
      (p) => p.industry === horizontalIndustry
    )
    return Array.from(new Set(prods.map((p) => p.broadCategory)))
  }, [horizontalIndustry])

  // 级联衍生计算：当前产业及大类下可选产品中类列表
  const availableKinds = useMemo(() => {
    const prods = CROSS_COMPANY_PRODUCT_BENCHMARKS.filter(
      (p) => p.industry === horizontalIndustry && p.broadCategory === horizontalBroadCategory
    )
    return Array.from(new Set(prods.map((p) => p.kind)))
  }, [horizontalIndustry, horizontalBroadCategory])

  // 级联衍生计算：当前中类下可选产品型号列表
  const availableModels = useMemo(() => {
    return CROSS_COMPANY_PRODUCT_BENCHMARKS.filter(
      (p) =>
        p.industry === horizontalIndustry &&
        p.broadCategory === horizontalBroadCategory &&
        p.kind === horizontalKind
    )
  }, [horizontalIndustry, horizontalBroadCategory, horizontalKind])

  // 当前选中的产品型号对象 (包含该型号在所有关联制造工厂的实测数据)
  const activeSelectedProduct = useMemo(() => {
    const found = availableModels.find((p) => p.id === horizontalModelId)
    if (found) return found
    if (availableModels.length > 0) return availableModels[0]
    const foundByModel = CROSS_COMPANY_PRODUCT_BENCHMARKS.find((p) => p.id === horizontalModelId)
    if (foundByModel) return foundByModel
    const firstForInd = CROSS_COMPANY_PRODUCT_BENCHMARKS.find((p) => p.industry === horizontalIndustry)
    return firstForInd || CROSS_COMPANY_PRODUCT_BENCHMARKS[0]
  }, [availableModels, horizontalModelId, horizontalIndustry])

  // 级联联动切换事件处理：切换产业
  const handleIndustryChange = (ind: 'transformer' | 'cable') => {
    setHorizontalIndustry(ind)
    const prods = CROSS_COMPANY_PRODUCT_BENCHMARKS.filter((p) => p.industry === ind)
    const broadCats = Array.from(new Set(prods.map((p) => p.broadCategory)))
    const firstBroadCat = broadCats[0] || ''
    setHorizontalBroadCategory(firstBroadCat)

    const kinds = Array.from(new Set(prods.filter((p) => p.broadCategory === firstBroadCat).map((p) => p.kind)))
    const firstKind = kinds[0] || ''
    setHorizontalKind(firstKind)

    const models = prods.filter((p) => p.broadCategory === firstBroadCat && p.kind === firstKind)
    const firstModel = models[0]?.id || ''
    setHorizontalModelId(firstModel)
  }

  // 级联联动切换事件处理：切换产品大类
  const handleBroadCategoryChange = (broadCat: string) => {
    setHorizontalBroadCategory(broadCat)
    const prods = CROSS_COMPANY_PRODUCT_BENCHMARKS.filter(
      (p) => p.industry === horizontalIndustry && p.broadCategory === broadCat
    )
    const kinds = Array.from(new Set(prods.map((p) => p.kind)))
    const firstKind = kinds[0] || ''
    setHorizontalKind(firstKind)

    const models = prods.filter((p) => p.broadCategory === broadCat && p.kind === firstKind)
    const firstModel = models[0]?.id || ''
    setHorizontalModelId(firstModel)
  }

  // 级联联动切换事件处理：切换产品中类
  const handleKindChange = (kind: string) => {
    setHorizontalKind(kind)
    const prods = CROSS_COMPANY_PRODUCT_BENCHMARKS.filter(
      (p) => p.industry === horizontalIndustry && p.broadCategory === horizontalBroadCategory && p.kind === kind
    )
    const firstModel = prods[0]?.id || ''
    setHorizontalModelId(firstModel)
  }

  // 级联联动切换事件处理：切换型号
  const handleModelChange = (modelId: string) => {
    setHorizontalModelId(modelId)
  }

  // 过滤后的基准列表
  const filteredStandards = useMemo(() => {
    return standardsList.filter((item) => {
      const matchCat = item.category === standardCategoryFilter
      if (!matchCat) return false
      if (!standardSearchKeyword.trim()) return true
      const kw = standardSearchKeyword.trim().toLowerCase()
      return (
        item.indicatorName.toLowerCase().includes(kw) ||
        item.scope.toLowerCase().includes(kw) ||
        item.standardSource.toLowerCase().includes(kw) ||
        item.maintainer.toLowerCase().includes(kw)
      )
    })
  }, [standardsList, standardCategoryFilter, standardSearchKeyword])

  // --------------------------------------------------------------------------
  // Tab 4: 关键工序单耗对比业务计算 (产业: 变压器、线缆; 工序: 器身干燥、浇注固化、试验 vs 拉丝、交联 + 动态维护)
  // --------------------------------------------------------------------------
  const availableProcessList = useMemo(() => {
    return processList.filter((p) => p.industry === processIndustry)
  }, [processList, processIndustry])

  const currentSelectedProcess = useMemo(() => {
    const found = availableProcessList.find((p) => p.id === selectedProcessId)
    return found || availableProcessList[0] || processList[0]
  }, [availableProcessList, selectedProcessId, processList])

  const handleProcessIndustryChange = (newInd: 'transformer' | 'cable') => {
    setProcessIndustry(newInd)
    const procs = processList.filter((p) => p.industry === newInd)
    if (procs.length > 0) {
      setSelectedProcessId(procs[0].id)
    }
  }

  const handleProcessQuery = () => {
    setIsProcessQuerying(true)
    setTimeout(() => {
      setIsProcessQuerying(false)
      alert(`已成功查询【${processIndustry === 'transformer' ? '变压器' : '线缆'} - ${currentSelectedProcess.processName}】（${processTimeMonth}）单耗对比数据！`)
    }, 300)
  }

  const handleProcessReset = () => {
    setProcessIndustry('transformer')
    setSelectedProcessId('proc-tx-drying')
    setProcessTimeMonth('2026-08')
  }

  // --------------------------------------------------------------------------
  // Tab 3: 产品单耗对比（纵向）业务计算
  // 检索项：项目公司、产品大类、产品中类、时间段选择 (月到月)、产品型号
  // 逻辑规则：筛选所选时间段内完成的大于两个订单 (>= 2 个订单) 的产品型号
  // --------------------------------------------------------------------------
  const currentVerticalCompany = useMemo(() => {
    return VERTICAL_PROJECT_COMPANIES.find((c) => c.name === verticalCompanyName) || VERTICAL_PROJECT_COMPANIES[0]
  }, [verticalCompanyName])

  const availableVerticalBroadCategories = useMemo(() => {
    const list = VERTICAL_CATALOG_STRUCTURE[currentVerticalCompany.industry as 'transformer' | 'cable'] || []
    return list.map((item) => item.broadCategory)
  }, [currentVerticalCompany])

  const availableVerticalKinds = useMemo(() => {
    const list = VERTICAL_CATALOG_STRUCTURE[currentVerticalCompany.industry as 'transformer' | 'cable'] || []
    const broadItem = list.find((b) => b.broadCategory === verticalBroadCategory) || list[0]
    return broadItem ? broadItem.kinds.map((k) => k.kind) : []
  }, [currentVerticalCompany, verticalBroadCategory])

  const allModelsUnderKind = useMemo(() => {
    const list = VERTICAL_CATALOG_STRUCTURE[currentVerticalCompany.industry as 'transformer' | 'cable'] || []
    const broadItem = list.find((b) => b.broadCategory === verticalBroadCategory) || list[0]
    if (!broadItem) return []
    const kindItem = broadItem.kinds.find((k) => k.kind === verticalKind) || broadItem.kinds[0]
    return kindItem ? kindItem.models : []
  }, [currentVerticalCompany, verticalBroadCategory, verticalKind])

  const matchingOrdersInDateRange = useMemo(() => {
    return VERTICAL_ORDER_LEDGER_DATA.filter((order) => {
      const matchCompany = order.companyName === verticalCompanyName
      const matchBroadCat = order.broadCategory === verticalBroadCategory
      const matchKind = order.kind === verticalKind
      const inRange = order.finishMonth >= verticalStartMonth && order.finishMonth <= verticalEndMonth
      return matchCompany && matchBroadCat && matchKind && inRange
    })
  }, [verticalCompanyName, verticalBroadCategory, verticalKind, verticalStartMonth, verticalEndMonth])

  // 核心规则：筛选在这个时间段内完成的大于两个订单 (>= 2 个订单) 的型号
  const qualifiedVerticalModels = useMemo(() => {
    return allModelsUnderKind
      .map((m) => {
        const orderCount = matchingOrdersInDateRange.filter((o) => o.modelId === m.id).length
        return {
          ...m,
          orderCount,
        }
      })
      .filter((m) => m.orderCount >= 2)
  }, [allModelsUnderKind, matchingOrdersInDateRange])

  // 自动校验当前选中的 verticalModelId
  React.useEffect(() => {
    if (qualifiedVerticalModels.length > 0) {
      const found = qualifiedVerticalModels.find((m) => m.id === verticalModelId)
      if (!found) {
        setVerticalModelId(qualifiedVerticalModels[0].id)
      }
    } else {
      setVerticalModelId('')
    }
  }, [qualifiedVerticalModels, verticalModelId])

  const currentSelectedModel = useMemo(() => {
    return qualifiedVerticalModels.find((m) => m.id === verticalModelId) || qualifiedVerticalModels[0] || allModelsUnderKind[0]
  }, [qualifiedVerticalModels, verticalModelId, allModelsUnderKind])

  const currentModelOrders = useMemo(() => {
    if (!currentSelectedModel) return []
    return matchingOrdersInDateRange.filter((o) => o.modelId === currentSelectedModel.id)
  }, [matchingOrdersInDateRange, currentSelectedModel])

  const handleVerticalCompanyChange = (compName: string) => {
    setVerticalCompanyName(compName)
    const comp = VERTICAL_PROJECT_COMPANIES.find((c) => c.name === compName) || VERTICAL_PROJECT_COMPANIES[0]
    const list = VERTICAL_CATALOG_STRUCTURE[comp.industry as 'transformer' | 'cable'] || []
    const firstBroad = list[0]?.broadCategory || ''
    setVerticalBroadCategory(firstBroad)
    const firstKind = list[0]?.kinds[0]?.kind || ''
    setVerticalKind(firstKind)
  }

  const handleVerticalBroadCategoryChange = (broadCat: string) => {
    setVerticalBroadCategory(broadCat)
    const list = VERTICAL_CATALOG_STRUCTURE[currentVerticalCompany.industry as 'transformer' | 'cable'] || []
    const broadItem = list.find((b) => b.broadCategory === broadCat) || list[0]
    const firstKind = broadItem?.kinds[0]?.kind || ''
    setVerticalKind(firstKind)
  }

  const handleVerticalKindChange = (kind: string) => {
    setVerticalKind(kind)
  }

  const handleVerticalQuery = () => {
    setIsVerticalQuerying(true)
    setTimeout(() => {
      setIsVerticalQuerying(false)
      alert(`已成功检索【${verticalCompanyName} - ${currentSelectedModel?.name || verticalKind}】在 ${verticalStartMonth} 至 ${verticalEndMonth} 期间的完工订单单耗数据！`)
    }, 300)
  }

  const handleVerticalReset = () => {
    setVerticalCompanyName('衡变公司')
    setVerticalBroadCategory('电力变压器')
    setVerticalKind('特高压单相自耦变压器')
    setVerticalStartMonth('2026-01')
    setVerticalEndMonth('2026-08')
    setVerticalMetricObject('tce')
  }

  const verticalMetricList: Array<{ key: 'tce' | 'elec' | 'steam' | 'water', name: string, label: string, unit: string, color: string }> = [
    { key: 'tce', name: '综合能耗', label: '综合能耗', unit: `tce/${currentSelectedModel?.unit || '台'}`, color: '#2C7CFF' },
    { key: 'elec', name: '电耗', label: '电耗', unit: `kWh/${currentSelectedModel?.unit || '台'}`, color: '#41C0FF' },
    { key: 'steam', name: '蒸汽耗', label: '蒸汽耗', unit: `t/${currentSelectedModel?.unit || '台'}`, color: '#FFBA00' },
    { key: 'water', name: '水耗', label: '水耗', unit: `m³/${currentSelectedModel?.unit || '台'}`, color: '#10C4CE' },
  ]

  const verticalMetricConfigs: Record<'tce' | 'elec' | 'steam' | 'water', { name: string, label: string, unit: string, color: string }> = {
    tce: verticalMetricList[0],
    elec: verticalMetricList[1],
    steam: verticalMetricList[2],
    water: verticalMetricList[3],
  }

  const currentMetricConfig = verticalMetricConfigs[verticalMetricObject]

  const currentMetricAvg = useMemo(() => {
    if (currentModelOrders.length === 0) return 0
    const sum = currentModelOrders.reduce((acc, curr) => acc + (curr[verticalMetricObject] || 0), 0)
    const avg = sum / currentModelOrders.length
    return verticalMetricObject === 'tce' ? Number(avg.toFixed(avg < 1 ? 3 : 2)) :
           verticalMetricObject === 'elec' ? Math.round(avg) :
           Number(avg.toFixed(2))
  }, [currentModelOrders, verticalMetricObject])

  const chartOrdersData = useMemo(() => {
    return currentModelOrders.map((ord) => {
      const val = ord[verticalMetricObject] || 0
      const diffAvgPct = currentMetricAvg > 0 ? (((val - currentMetricAvg) / currentMetricAvg) * 100).toFixed(1) : '0.0'
      const diffPct = Number(diffAvgPct) > 0 ? `+${diffAvgPct}%` : Number(diffAvgPct) < 0 ? `${diffAvgPct}%` : '0.0%'
      return {
        orderNo: ord.orderNo,
        orderCode: ord.orderNo,
        orderDisplay: `${ord.orderNo.replace('SO-2026', '')} (${ord.finishMonth.slice(5)}月)`,
        modelName: ord.modelName,
        completeDate: ord.finishDate,
        finishDate: ord.finishDate,
        batchSize: ord.quantity,
        quantity: ord.quantity,
        unit: ord.unit,
        val,
        value: val,
        diffAvgPct,
        diffPct,
      }
    })
  }, [currentModelOrders, verticalMetricObject, currentMetricAvg])

  // 过滤后的国家级零碳直报工厂列表
  const filteredBenchmarkFactories = useMemo(() => {
    if (selectedBenchmarkCompany === '全部') {
      return ZERO_CARBON_FACTORIES_BENCHMARK_DATA
    }
    return ZERO_CARBON_FACTORIES_BENCHMARK_DATA.filter(
      (item) => item.parentCompany === selectedBenchmarkCompany
    )
  }, [selectedBenchmarkCompany])

  // 🌟 零碳工厂表格排序状态: 'carbon_per_tce' | 'non_fossil_ratio' | 'physical_green_ratio' | 'default'
  const [tableSortMetric, setTableSortMetric] = useState<ZeroCarbonMetricType | 'default'>('carbon_per_tce')
  const [tableSortDirection, setTableSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleToggleMetricSort = (metricKey: ZeroCarbonMetricType) => {
    if (tableSortMetric === metricKey) {
      setTableSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      setActiveZeroCarbonMetric(metricKey)
    } else {
      setTableSortMetric(metricKey)
      // 单位能耗碳排数值越低越优 (默认升序)；非化石占比数值越高越优 (默认降序)
      setTableSortDirection(metricKey === 'carbon_per_tce' ? 'asc' : 'desc')
      setActiveZeroCarbonMetric(metricKey)
    }
  }

  // 过滤并按所选指标排序后的国家级零碳直报工厂列表
  const sortedBenchmarkFactories = useMemo(() => {
    let list = [...filteredBenchmarkFactories]
    if (tableSortMetric === 'carbon_per_tce') {
      list.sort((a, b) =>
        tableSortDirection === 'asc'
          ? a.carbonPerTce - b.carbonPerTce
          : b.carbonPerTce - a.carbonPerTce
      )
    } else if (tableSortMetric === 'non_fossil_ratio') {
      list.sort((a, b) =>
        tableSortDirection === 'desc'
          ? b.nonFossilRatio - a.nonFossilRatio
          : a.nonFossilRatio - b.nonFossilRatio
      )
    } else if (tableSortMetric === 'physical_green_ratio') {
      list.sort((a, b) =>
        tableSortDirection === 'desc'
          ? b.physicalGreenRatio - a.physicalGreenRatio
          : a.physicalGreenRatio - b.physicalGreenRatio
      )
    }
    return list.map((item, idx) => ({
      ...item,
      displayRank: idx + 1,
    }))
  }, [filteredBenchmarkFactories, tableSortMetric, tableSortDirection])

  // 转换图表数据格式 (按排序后的工厂进行展示)
  const chartData = useMemo(() => {
    return sortedBenchmarkFactories.map((item) => ({
      name: item.shortName,
      fullName: item.name,
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
  }, [activeZeroCarbonMetric, sortedBenchmarkFactories])

  return (
    <div className="w-full flex flex-col gap-3.5 font-sans">
      {/* 1. 顶部 Header 标题栏 */}
      <div className="bg-white dark:bg-card p-3.5 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-[#2C7CFF] shrink-0">
            <BarChart3 className="size-5" />
          </div>
          <h1 className="text-base font-bold text-slate-800 dark:text-white">对标管理</h1>
        </div>
      </div>

      {/* 2. 🌟 核心 4 大对标维度 Tab 切换栏 + 统一时间查询模块 (统一放置在顶部右侧红框位置) */}
      <div className="bg-white dark:bg-card p-2.5 rounded-xl border border-slate-200 dark:border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* 左侧：5 大 Tab 切换按钮 */}
        <div className="flex items-center gap-1.5 flex-wrap">
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
                    ? 'bg-[#2C7CFF] text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-panel text-slate-600 dark:text-slate-300 hover:text-[#2C7CFF] dark:hover:text-[#2C7CFF] hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200/80 dark:border-border'
                )}
              >
                <Icon className={cn('size-4', isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400')} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* 右侧：统一时间查询模块 (月度 / 季度 / 年度 / 自定义) - 仅在【核心指标对比】显示时间控件 */}
        <div className="flex flex-wrap items-center gap-2.5">
          {activeTab === 'horizontal' && (
            <>
              {/* 时间维度统一 (月度 / 季度 / 年度 / 自定义，样式参照用能监测) */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg text-sm font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setBenchmarkTimeDim('month')
                    setProcessTimeDim('month')
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                    benchmarkTimeDim === 'month'
                      ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  月
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBenchmarkTimeDim('quarter')
                    setProcessTimeDim('quarter')
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                    benchmarkTimeDim === 'quarter'
                      ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  季度
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBenchmarkTimeDim('year')
                    setProcessTimeDim('year')
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                    benchmarkTimeDim === 'year'
                      ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  年
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBenchmarkTimeDim('custom')
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                    benchmarkTimeDim === 'custom'
                      ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  自定义
                </button>
              </div>

              {/* 时间范围选择控件 (随维度自适应切换，样式参照用能监测) */}
              {benchmarkTimeDim === 'month' && (
                <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs font-mono">
                  <Calendar className="size-4 text-slate-400 shrink-0" />
                  <input
                    type="month"
                    value={benchmarkSelectedMonth}
                    onChange={(e) => {
                      if (e.target.value) {
                        setBenchmarkSelectedMonth(e.target.value)
                        setProcessMonth(e.target.value)
                      }
                    }}
                    className="bg-transparent border-0 text-slate-800 dark:text-white text-sm focus:outline-none cursor-pointer font-bold"
                    title="选择指定月份"
                  />
                </div>
              )}

              {benchmarkTimeDim === 'quarter' && (
                <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs">
                  <Calendar className="size-4 text-slate-400 shrink-0" />
                  <select
                    value={benchmarkSelectedQuarter}
                    onChange={(e) => {
                      setBenchmarkSelectedQuarter(e.target.value)
                      setProcessQuarter(e.target.value)
                    }}
                    className="bg-transparent border-0 text-slate-800 dark:text-white text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="2026-Q1">2026年 第1季度 (Q1)</option>
                    <option value="2026-Q2">2026年 第2季度 (Q2)</option>
                    <option value="2026-Q3">2026年 第3季度 (Q3)</option>
                    <option value="2026-Q4">2026年 第4季度 (Q4)</option>
                  </select>
                </div>
              )}

              {benchmarkTimeDim === 'year' && (
                <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs">
                  <Calendar className="size-4 text-slate-400 shrink-0" />
                  <select
                    value={benchmarkSelectedYear}
                    onChange={(e) => {
                      setBenchmarkSelectedYear(e.target.value)
                      setProcessYear(e.target.value)
                    }}
                    className="bg-transparent border-0 text-slate-800 dark:text-white text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="2026">2026 年度</option>
                    <option value="2025">2025 年度</option>
                    <option value="2024">2024 年度</option>
                  </select>
                </div>
              )}

              {benchmarkTimeDim === 'custom' && (
                <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs font-mono">
                  <Calendar className="size-4 text-slate-400 shrink-0" />
                  <input
                    type="month"
                    value={benchmarkSelectedMonthRange.start}
                    onChange={handleCustomStartMonthChange}
                    className="bg-transparent border-0 text-slate-800 dark:text-white text-sm focus:outline-none cursor-pointer font-bold"
                    title="开始月份 (最多选12个月)"
                  />
                  <span className="text-slate-400 font-sans">至</span>
                  <input
                    type="month"
                    value={benchmarkSelectedMonthRange.end}
                    onChange={handleCustomEndMonthChange}
                    className="bg-transparent border-0 text-slate-800 dark:text-white text-sm focus:outline-none cursor-pointer font-bold"
                    title="结束月份 (最多选12个月)"
                  />
                </div>
              )}
            </>
          )}

          <ExportButton onClick={() => alert(`正在导出对标统计周期【${benchmarkTimeLabel}】能效对标分析报表 (Excel)...`)} />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 核心指标对比 (国家级零碳工厂核心指标对比 + 核心管控指标排名) */}
      {/* ========================================================================= */}
      {activeTab === 'horizontal' && (
        <div className="space-y-3.5">
          
          {/* 上半部分：国家级零碳工厂核心指标对比 */}
          <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  国家级零碳工厂核心指标对比
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
                    onClick={() => {
                      setActiveZeroCarbonMetric(key)
                      setTableSortMetric(key)
                      setTableSortDirection(key === 'carbon_per_tce' ? 'asc' : 'desc')
                    }}
                    className={cn(
                      'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all cursor-pointer select-none relative',
                      isSelected
                        ? 'bg-gradient-to-br from-blue-50/95 via-white to-blue-50/40 dark:from-blue-950/60 dark:via-panel dark:to-blue-950/40 border-2 border-[#2C7CFF] ring-2 ring-blue-100 shadow-sm'
                        : 'bg-white dark:bg-card border-slate-200 dark:border-border hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className={cn('font-bold flex items-center gap-1.5', isSelected ? 'text-[#2C7CFF]' : 'text-slate-800 dark:text-slate-200')}>
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                        {meta.name}
                      </span>
                      {isSelected && (
                        <span className="size-2 rounded-full bg-[#2C7CFF] animate-pulse" />
                      )}
                    </div>

                    <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {meta.groupAvg}{' '}
                      <span className="text-xs font-sans text-slate-500 font-normal">{meta.unit}</span>
                      <span className="text-[10px] text-blue-600 font-sans font-normal ml-2">(全集团均值)</span>
                    </div>

                    <div className="text-[11px] font-sans text-slate-600 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-border flex items-center justify-between">
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

            {/* 大图表区域: 展示各国家级零碳工厂柱状图 + 国家门槛要求值 + 电装集团平均值 */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300 pb-2 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <span>当前展示: <strong>{currentMetricMeta.name}</strong></span>
                  </span>

                  {/* 制造公司/直报工厂筛选 */}
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">筛选单位:</span>
                    <select
                      value={selectedBenchmarkCompany}
                      onChange={(e) => setSelectedBenchmarkCompany(e.target.value)}
                      className="h-7 px-2.5 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#2C7CFF] cursor-pointer"
                    >
                      <option value="全部">全部直报工厂 (21家)</option>
                      <option value="沈变公司">沈变公司 (4家工厂)</option>
                      <option value="衡变公司">衡变公司 (9家工厂)</option>
                      <option value="新变厂">新变厂 (5家工厂)</option>
                      <option value="鲁缆公司">鲁缆公司 (1家工厂)</option>
                      <option value="新缆厂">新缆厂 (1家工厂)</option>
                      <option value="德缆公司">德缆公司 (1家工厂)</option>
                    </select>
                  </div>
                </div>

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

              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 12, right: 12, bottom: 28, left: 16 }}>
                    <CartesianGrid stroke="#f1f5f9" className="stroke-slate-100 dark:stroke-slate-800" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      className="text-slate-600 dark:text-slate-300"
                      tickLine={false}
                      axisLine={{ stroke: 'var(--border)' }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={65}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      className="text-slate-500 dark:text-slate-400"
                      tickLine={false}
                      axisLine={false}
                      domain={[
                        0,
                        activeZeroCarbonMetric === 'carbon_per_tce' ? 2.2 : 60,
                      ]}
                      unit={currentMetricMeta.unit}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(56, 189, 248, 0.08)', stroke: 'none' }}
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        fontSize: 12,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                      formatter={(val: any) => [
                        `${val} ${currentMetricMeta.unit}`,
                        currentMetricMeta.name,
                      ]}
                      labelFormatter={(label: string, payload: any[]) => {
                        const item = payload?.[0]?.payload
                        if (item && item.fullName) {
                          return `${item.fullName} (${item.parentCompany})`
                        }
                        return label
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
                      stroke="#2C7CFF"
                      strokeWidth={1.5}
                      label={{
                        value: currentMetricMeta.groupAvgLabel,
                        fill: '#2C7CFF',
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

          {/* 下半部分：国家级零碳工厂管控指标排名 */}
          <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 dark:border-border flex flex-wrap items-center justify-between bg-slate-50/60 dark:bg-panel gap-2">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  国家级零碳工厂管控指标排名
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-panel border-b border-slate-200 dark:border-border text-slate-600 dark:text-slate-300 font-semibold font-sans h-[44px]">
                    <th className="py-2.5 px-3 w-14 text-center">排名</th>
                    <th className="py-2.5 px-3 min-w-[170px]">国家级零碳工厂名称</th>
                    <th className="py-2.5 px-3 min-w-[95px]">所属制造公司</th>
                    {/* 指标 1: 单位能耗碳排放 */}
                    <th className="py-2.5 px-3 text-right font-bold text-blue-700 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/30 min-w-[195px]">
                      <div className="flex items-center justify-end gap-1.5">
                        <span>单位能耗碳排放 (tCO₂/tce)</span>
                        <button
                          type="button"
                          onClick={() => handleToggleMetricSort('carbon_per_tce')}
                          className={cn(
                            'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-sans font-medium transition-colors cursor-pointer border shadow-2xs',
                            tableSortMetric === 'carbon_per_tce'
                              ? 'bg-[#2C7CFF] text-white border-[#2C7CFF]'
                              : 'bg-white dark:bg-card text-slate-600 dark:text-slate-300 border-slate-200 dark:border-border hover:border-blue-400 hover:text-blue-600'
                          )}
                          title="点击按单位能耗碳排放排序并联动上方图表"
                        >
                          <span>排序</span>
                          {tableSortMetric === 'carbon_per_tce' ? (
                            tableSortDirection === 'asc' ? (
                              <ArrowUp className="size-3 text-white" />
                            ) : (
                              <ArrowDown className="size-3 text-white" />
                            )
                          ) : (
                            <ArrowUpDown className="size-3 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center min-w-[80px]">同比</th>

                    {/* 指标 2: 非化石能源消费占比 */}
                    <th className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/30 min-w-[185px]">
                      <div className="flex items-center justify-end gap-1.5">
                        <span>非化石能源消费占比 (%)</span>
                        <button
                          type="button"
                          onClick={() => handleToggleMetricSort('non_fossil_ratio')}
                          className={cn(
                            'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-sans font-medium transition-colors cursor-pointer border shadow-2xs',
                            tableSortMetric === 'non_fossil_ratio'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white dark:bg-card text-slate-600 dark:text-slate-300 border-slate-200 dark:border-border hover:border-emerald-400 hover:text-emerald-600'
                          )}
                          title="点击按非化石能源消费占比排序并联动上方图表"
                        >
                          <span>排序</span>
                          {tableSortMetric === 'non_fossil_ratio' ? (
                            tableSortDirection === 'desc' ? (
                              <ArrowDown className="size-3 text-white" />
                            ) : (
                              <ArrowUp className="size-3 text-white" />
                            )
                          ) : (
                            <ArrowUpDown className="size-3 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center min-w-[80px]">同比</th>

                    {/* 指标 3: 非化石能源电力消费物理认定量占比 */}
                    <th className="py-2.5 px-3 text-right font-bold text-purple-700 dark:text-purple-400 bg-purple-50/30 dark:bg-purple-950/30 min-w-[245px]">
                      <div className="flex items-center justify-end gap-1.5">
                        <span>非化石能源电力消费物理认定量占比 (%)</span>
                        <button
                          type="button"
                          onClick={() => handleToggleMetricSort('physical_green_ratio')}
                          className={cn(
                            'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-sans font-medium transition-colors cursor-pointer border shadow-2xs',
                            tableSortMetric === 'physical_green_ratio'
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white dark:bg-card text-slate-600 dark:text-slate-300 border-slate-200 dark:border-border hover:border-purple-400 hover:text-purple-600'
                          )}
                          title="点击按非化石能源电力消费物理认定量占比排序并联动上方图表"
                        >
                          <span>排序</span>
                          {tableSortMetric === 'physical_green_ratio' ? (
                            tableSortDirection === 'desc' ? (
                              <ArrowDown className="size-3 text-white" />
                            ) : (
                              <ArrowUp className="size-3 text-white" />
                            )
                          ) : (
                            <ArrowUpDown className="size-3 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center min-w-[90px]">同比</th>

                    {/* 操作 / 详情 */}
                    <th className="py-2.5 px-3 text-center min-w-[90px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {sortedBenchmarkFactories.map((row) => {
                    const yoys = getFactoryYoys(row)
                    const targetNode = BENCHMARK_FACTORY_TO_ORG_NODE[row.id]
                    return (
                      <tr key={row.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors h-[44px]">
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={cn(
                              'size-5 rounded-full inline-flex items-center justify-center text-[10.5px] font-bold font-sans',
                              row.displayRank === 1
                                ? 'bg-amber-400 text-white shadow-xs'
                                : row.displayRank === 2
                                ? 'bg-slate-400 text-white shadow-xs'
                                : row.displayRank === 3
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            )}
                          >
                            {row.displayRank}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                            {row.parentCompany}
                          </span>
                        </td>
                        {/* 单位能耗碳排放 */}
                        <td className="py-2.5 px-3 text-right font-bold text-[#2C7CFF] bg-blue-50/20 dark:bg-blue-950/20 font-mono">
                          {row.carbonPerTce.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-emerald-600 font-bold font-mono text-[11.5px] inline-flex items-center gap-0.5 justify-center">
                            {yoys.carbonYoy} <span className="text-[10px]">↓</span>
                          </span>
                        </td>
                        {/* 非化石能源消费占比 */}
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20 font-mono">
                          {row.nonFossilRatio.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-emerald-600 font-bold font-mono text-[11.5px] inline-flex items-center gap-0.5 justify-center">
                            {yoys.nonFossilYoy} <span className="text-[10px]">↑</span>
                          </span>
                        </td>
                        {/* 物理认定量占比 */}
                        <td className="py-2.5 px-3 text-right font-bold text-purple-700 dark:text-purple-400 bg-purple-50/20 dark:bg-purple-950/20 font-mono">
                          {row.physicalGreenRatio.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-emerald-600 font-bold font-mono text-[11.5px] inline-flex items-center gap-0.5 justify-center">
                            {yoys.physicalGreenYoy} <span className="text-[10px]">↑</span>
                          </span>
                        </td>
                        {/* 操作 */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <Link
                            href={`/zero-carbon/monitor/indicator?factoryId=${encodeURIComponent(row.id)}&nodeId=${targetNode?.id || ''}&factory=${encodeURIComponent(row.name)}`}
                            className="text-[#2C7CFF] hover:text-blue-700 hover:underline font-medium font-sans text-xs inline-flex items-center gap-1"
                          >
                            <span>详情</span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                  {sortedBenchmarkFactories.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 font-sans text-xs">
                        暂无符合条件的工厂对标数据
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
      {/* TAB 2: 产品单耗对比（横向） - 同型号产品在关联工厂的单耗对比 & 深度分析 */}
      {/* ========================================================================= */}
      {activeTab === 'product_horizontal' && (
        <div className="space-y-4">
          {/* 顶部控制面板：五级级联筛选 (产品类型、选择时间、产品大类、产品中类、型号) */}
          <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {/* 1. 产品类型 (下拉框) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Sliders className="size-3.5 text-[#2C7CFF]" />
                  产品类型
                </span>
                <select
                  value={horizontalIndustry}
                  onChange={(e) => handleIndustryChange(e.target.value as 'transformer' | 'cable')}
                  className="h-9 min-w-[110px] px-3 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs transition-colors"
                >
                  <option value="transformer">变压器</option>
                  <option value="cable">线缆</option>
                </select>
              </div>

              {/* 2. 选择时间 (月份选择) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#2C7CFF]" />
                  选择时间
                </span>
                <input
                  type="month"
                  value={horizontalTimeMonth}
                  onChange={(e) => setHorizontalTimeMonth(e.target.value)}
                  className="h-9 w-[135px] px-2.5 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-mono font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs"
                />
              </div>

              {/* 3. 产品大类 (下拉框) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Layers className="size-3.5 text-[#2C7CFF]" />
                  产品大类
                </span>
                <select
                  value={horizontalBroadCategory}
                  onChange={(e) => handleBroadCategoryChange(e.target.value)}
                  className="h-9 min-w-[150px] px-3 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs transition-colors"
                >
                  {availableBroadCategories.map((bc) => (
                    <option key={bc} value={bc}>{bc}</option>
                  ))}
                </select>
              </div>

              {/* 4. 产品中类 (下拉框) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Package className="size-3.5 text-[#2C7CFF]" />
                  产品中类
                </span>
                <select
                  value={horizontalKind}
                  onChange={(e) => handleKindChange(e.target.value)}
                  className="h-9 min-w-[165px] px-3 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs transition-colors"
                >
                  {availableKinds.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              {/* 5. 产品型号 (下拉框) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Cpu className="size-3.5 text-[#2C7CFF]" />
                  型号
                </span>
                <select
                  value={horizontalModelId}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="h-9 min-w-[240px] px-3 bg-blue-50/40 dark:bg-blue-950/30 border border-[#2C7CFF]/50 dark:border-blue-500/40 rounded-lg text-xs font-mono font-bold text-[#2C7CFF] focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs transition-colors"
                >
                  {availableModels.map((m) => (
                    <option key={m.id} value={m.id}>{m.model}</option>
                  ))}
                </select>
              </div>

              {/* 右侧：快捷查看深度能耗分析按钮 */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFactoryForModal(activeSelectedProduct.companies[0]?.companyId || 'hb_main')
                    setShowFactoryEnergyModal(true)
                  }}
                  className="h-9 px-3.5 bg-[#2C7CFF] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Eye className="size-3.5" />
                  <span>查看能耗分析弹窗</span>
                </button>
              </div>
            </div>
          </div>

          {/* 重点型号可视化对标走势图 (仅显示选定同型号产品在关联制造工厂的单耗对比) */}
          {activeSelectedProduct && (
            <div className="bg-white dark:bg-card p-3 px-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-border pb-2 text-xs font-sans">
                {/* 左侧：标题 */}
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    同型号产品关联制造工厂单耗对比
                  </h3>
                  <span className="text-[11px] text-slate-400 font-normal">
                    (共 {activeSelectedProduct.companies.length} 家关联生产制造厂)
                  </span>
                </div>

                {/* 中间：型号标识 */}
                <div className="flex items-center px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs font-mono font-bold text-[#2C7CFF] shadow-2xs">
                  <span>{activeSelectedProduct.model}</span>
                </div>

                {/* 右侧：图例 */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-[#2C7CFF] font-bold">
                    <span className="size-2 rounded-full bg-[#2C7CFF]" /> 综合单耗 (tce/{activeSelectedProduct.unit})
                  </span>
                </div>
              </div>

              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activeSelectedProduct.companies.map((c) => ({
                      name: c.companyName,
                      tce: c.tce,
                      elecKWh: c.elecKWh,
                      steamTon: c.steamTon,
                      liquidNitrogenM3: c.liquidNitrogenM3,
                      isOptimal: c.isOptimal,
                      diff: c.diffPercent,
                    }))}
                    margin={{ top: 15, right: 25, left: 10, bottom: 15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="stroke-slate-100 dark:stroke-slate-800" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-700 dark:text-slate-200" axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(56, 189, 248, 0.08)', stroke: 'none' }}
                      formatter={(value: any) => [
                        `${value} tce/${activeSelectedProduct.unit}`,
                        '综合单耗'
                      ]}
                      contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="tce" name="综合单耗 (tce)" fill="#2C7CFF" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 表格方式展示对比数据：下方仅显示该同型号产品在关联工厂的单耗对比数据 */}
          <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  同型号产品在关联制造工厂单耗对比明细表
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  （当前型号：<strong className="text-slate-800 dark:text-slate-200 font-mono">{activeSelectedProduct.model}</strong>，共展示 {activeSelectedProduct.companies.length} 家实际生产工厂）
                </span>
              </div>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-panel text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-border font-sans">
                  <tr className="border-b border-slate-200/80 dark:border-border text-xs font-bold h-[36px]">
                    <th rowSpan={2} className="py-2 px-4 border-r border-slate-200/70 dark:border-border">关联制造工厂 / 项目公司</th>
                    <th rowSpan={2} className="py-2 px-3 text-center border-r border-slate-200/70 dark:border-border bg-blue-50/40 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 font-bold">
                      <div className="flex items-center justify-center gap-1">
                        <Package className="size-3.5 text-[#2C7CFF]" />
                        <span>订单量信息</span>
                      </div>
                    </th>
                    <th colSpan={activeSelectedProduct.industry === 'transformer' ? 3 : 2} className="py-1.5 px-3 text-center border-r border-slate-200/70 dark:border-border bg-slate-100/70 dark:bg-panel text-slate-800 dark:text-slate-200">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="size-3.5 text-[#2C7CFF]" />
                        <span>当期能源消耗总量 (实物消耗量)</span>
                      </div>
                    </th>
                    <th colSpan={activeSelectedProduct.industry === 'transformer' ? 3 : 2} className="py-1.5 px-3 text-center border-r border-slate-200/70 dark:border-border bg-blue-50/20 dark:bg-blue-950/20 text-slate-800 dark:text-slate-200">
                      <div className="flex items-center justify-center gap-1">
                        <Activity className="size-3.5 text-blue-600" />
                        <span>单位产品能耗数据 (单耗基准)</span>
                      </div>
                    </th>
                    <th rowSpan={2} className="py-2 px-3 text-center w-28">操作</th>
                  </tr>
                  <tr className="text-[11.5px] font-bold h-[36px] bg-slate-50 dark:bg-panel">
                    {/* 能源消耗总量 */}
                    <th className="py-2 px-3 text-right text-blue-700 dark:text-blue-400">总电量 (万kWh)</th>
                    {activeSelectedProduct.industry === 'transformer' && (
                      <th className="py-2 px-3 text-right text-purple-700 dark:text-purple-400">总蒸汽消耗 (t)</th>
                    )}
                    <th className="py-2 px-3 text-right border-r border-slate-200/70 dark:border-border text-slate-900 dark:text-slate-200">总折标煤 (tce)</th>
                    {/* 单位产品能耗数据 */}
                    <th className="py-2 px-3 text-right text-slate-900 dark:text-slate-200">综合单耗</th>
                    <th className="py-2 px-3 text-right text-blue-700 dark:text-blue-400">电单耗 (kWh)</th>
                    {activeSelectedProduct.industry === 'transformer' && (
                      <th className="py-2 px-3 text-right border-r border-slate-200/70 dark:border-border text-purple-700 dark:text-purple-400">蒸汽量 (t)</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {activeSelectedProduct.companies.map((company, cIdx) => {
                    // 订单量配置 (自适应产品计量单位)
                    const orderConfigs = [
                      { qty: activeSelectedProduct.unit === '台' ? 16 : (activeSelectedProduct.unit === 'km' ? 110 : 530), batches: 4 },
                      { qty: activeSelectedProduct.unit === '台' ? 14 : (activeSelectedProduct.unit === 'km' ? 95 : 460), batches: 3 },
                      { qty: activeSelectedProduct.unit === '台' ? 12 : (activeSelectedProduct.unit === 'km' ? 80 : 390), batches: 3 },
                      { qty: activeSelectedProduct.unit === '台' ? 10 : (activeSelectedProduct.unit === 'km' ? 70 : 340), batches: 2 },
                    ]
                    const orderInfo = orderConfigs[cIdx % orderConfigs.length]

                    // 能源消耗总量 (当期实物量)
                    const totalElecWan = +((company.elecKWh * orderInfo.qty) / 10000).toFixed(2)
                    const totalOther = activeSelectedProduct.industry === 'transformer'
                      ? +((company.steamTon || 0) * orderInfo.qty).toFixed(1)
                      : +((company.liquidNitrogenM3 || 0) * orderInfo.qty).toFixed(1)
                    const totalTce = +(company.tce * orderInfo.qty).toFixed(2)

                    return (
                      <tr
                        key={`${activeSelectedProduct.id}-${company.companyId}`}
                        className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors h-[44px]"
                      >
                        {/* 关联制造工厂 */}
                        <td className="py-2.5 px-4 font-sans font-semibold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-border">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-slate-400 shrink-0" />
                            <span>{company.companyName}</span>
                          </div>
                        </td>

                        {/* 订单量信息 */}
                        <td className="py-2.5 px-3 text-center border-r border-slate-100 dark:border-border bg-blue-50/20 dark:bg-blue-950/20">
                          <div className="flex items-center justify-center gap-1 font-mono">
                            <span className="font-extrabold text-[#2C7CFF] text-sm">{orderInfo.qty}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">{activeSelectedProduct.unit}</span>
                            <span className="text-[10px] text-slate-400 font-sans ml-0.5">({orderInfo.batches}笔)</span>
                          </div>
                        </td>

                        {/* 能源消耗总量：实物总电量 (万kWh) */}
                        <td className="py-2.5 px-3 text-right text-blue-700 dark:text-blue-400 font-bold">
                          {totalElecWan.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 font-sans">万kWh</span>
                        </td>

                        {/* 能源消耗总量：实物总蒸汽 (t) (变压器专属) */}
                        {activeSelectedProduct.industry === 'transformer' && (
                          <td className="py-2.5 px-3 text-right font-bold">
                            {company.steamTon !== undefined ? (
                              <span className="text-purple-700 dark:text-purple-400">{totalOther} <span className="text-[10px] font-normal text-slate-400 font-sans">t</span></span>
                            ) : (
                              <span className="text-slate-300 font-normal font-sans">—</span>
                            )}
                          </td>
                        )}

                        {/* 能源消耗总量：折合总标煤 (tce) */}
                        <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 dark:text-slate-200 border-r border-slate-100 dark:border-border">
                          {totalTce.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 font-sans">tce</span>
                        </td>

                        {/* 单位产品能耗数据：综合单耗 (tce/单位) */}
                        <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 dark:text-slate-200">
                          {company.tce.toFixed(company.tce < 1 ? 3 : 2)} <span className="text-[10px] font-normal text-slate-400 font-sans">tce/{activeSelectedProduct.unit}</span>
                        </td>

                        {/* 单位产品能耗数据：电单耗 (kWh) */}
                        <td className={cn(
                          "py-2.5 px-3 text-right text-blue-700 dark:text-blue-400 font-bold",
                          activeSelectedProduct.industry !== 'transformer' && "border-r border-slate-100 dark:border-border"
                        )}>
                          {company.elecKWh.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 font-sans">kWh</span>
                        </td>

                        {/* 单位产品能耗数据：蒸汽消耗量 (t) (变压器专属) */}
                        {activeSelectedProduct.industry === 'transformer' && (
                          <td className="py-2.5 px-3 text-right font-bold border-r border-slate-100 dark:border-border">
                            {company.steamTon !== undefined ? (
                              <span className="text-purple-700 dark:text-purple-400">{company.steamTon.toFixed(1)} <span className="text-[10px] font-normal text-slate-400 font-sans">t</span></span>
                            ) : (
                              <span className="text-slate-300 font-normal font-sans">—</span>
                            )}
                          </td>
                        )}

                        {/* 操作：查看按钮 */}
                        <td className="py-2.5 px-3 text-center font-sans">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFactoryForModal(company.companyId)
                              setShowFactoryEnergyModal(true)
                            }}
                            className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 hover:bg-[#2C7CFF] dark:hover:bg-[#2C7CFF] text-[#2C7CFF] dark:text-blue-400 hover:text-white dark:hover:text-white border border-blue-200 dark:border-blue-900/60 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 mx-auto shadow-2xs whitespace-nowrap shrink-0"
                          >
                            <Eye className="size-3" />
                            <span>查看</span>
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
      {/* TAB 3: 产品单耗对比（纵向） - 单位-产线-产品中类-型号 & 双周期对比 */}
      {/* ========================================================================= */}
      {activeTab === 'product_vertical' && (
        <div className="space-y-3.5">
          {/* 顶部检索与控制面板 */}
          <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {/* 1. 项目公司 (下拉框) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-[#2C7CFF]" />
                  项目公司
                </span>
                <select
                  value={verticalCompanyName}
                  onChange={(e) => handleVerticalCompanyChange(e.target.value)}
                  className="h-9 min-w-[170px] px-3 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs transition-colors"
                >
                  {VERTICAL_PROJECT_COMPANIES.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* 2. 产品大类 (下拉框) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Sliders className="size-3.5 text-[#2C7CFF]" />
                  产品大类
                </span>
                <select
                  value={verticalBroadCategory}
                  onChange={(e) => handleVerticalBroadCategoryChange(e.target.value)}
                  className="h-9 min-w-[140px] px-3 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs transition-colors"
                >
                  {availableVerticalBroadCategories.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* 3. 产品中类 (下拉框) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Package className="size-3.5 text-[#2C7CFF]" />
                  产品中类
                </span>
                <select
                  value={verticalKind}
                  onChange={(e) => handleVerticalKindChange(e.target.value)}
                  className="h-9 min-w-[150px] px-3 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs transition-colors"
                >
                  {availableVerticalKinds.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              {/* 4. 时间段选择 (起止月份) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#2C7CFF]" />
                  时间段选择
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="month"
                    value={verticalStartMonth}
                    onChange={(e) => setVerticalStartMonth(e.target.value)}
                    className="h-9 w-[125px] px-2 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-mono font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs"
                  />
                  <span className="text-xs text-slate-400 font-bold">至</span>
                  <input
                    type="month"
                    value={verticalEndMonth}
                    onChange={(e) => setVerticalEndMonth(e.target.value)}
                    className="h-9 w-[125px] px-2 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-mono font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs"
                  />
                </div>
              </div>

              {/* 5. 产品型号 (下拉框 - 仅显示完成生产订单>=2个的产品型号) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Cpu className="size-3.5 text-[#2C7CFF]" />
                  产品型号
                </span>
                <select
                  value={verticalModelId}
                  onChange={(e) => setVerticalModelId(e.target.value)}
                  disabled={qualifiedVerticalModels.length === 0}
                  className="h-9 min-w-[220px] max-w-[320px] px-3 bg-blue-50/40 dark:bg-blue-950/30 border border-[#2C7CFF]/50 dark:border-blue-500/40 rounded-lg text-xs font-mono font-bold text-[#2C7CFF] focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs transition-colors disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:border-slate-200 dark:disabled:border-border disabled:text-slate-400 dark:disabled:text-slate-500"
                >
                  {qualifiedVerticalModels.length > 0 ? (
                    qualifiedVerticalModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.orderCount}批完工订单)
                      </option>
                    ))
                  ) : (
                    <option value="">所选时间段暂无满足≥2笔订单的型号</option>
                  )}
                </select>
              </div>

              {/* 6. 查询与重置按钮 */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleVerticalQuery}
                  className="h-9 px-3.5 bg-[#2C7CFF] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Search className={cn("size-3.5", isVerticalQuerying && "animate-spin")} />
                  <span>{isVerticalQuerying ? '正在检索...' : '查询'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleVerticalReset}
                  className="h-9 px-3 bg-white dark:bg-panel hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-border rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <RotateCcw className="size-3.5" />
                  <span>重置</span>
                </button>
              </div>
            </div>
          </div>

          {/* 展示①：单柱状图对比所选时间段内该型号所有订单单耗，每根柱子上方直接展示数据，支持切换综合能耗、电耗、蒸汽耗、水耗，平均线 */}
          <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white font-sans">
                  完工订单单耗纵向对比
                </h3>
              </div>

              {/* 切换对比指标：综合能耗、电耗、蒸汽耗、水耗 */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0d1b29] p-0.5 dark:p-[3px] rounded-lg border border-slate-200 dark:border-[#133748] text-xs font-sans">
                {verticalMetricList.map((m) => {
                  const isActive = verticalMetricObject === m.key
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setVerticalMetricObject(m.key)}
                      className={cn(
                        'h-7 px-3.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 select-none text-xs',
                        isActive
                          ? 'tbea-tab-cyan-active shadow-xs dark:shadow-none'
                          : 'text-slate-600 hover:text-slate-900 dark:text-[#879ca8] dark:hover:text-white bg-transparent dark:bg-transparent',
                      )}
                    >
                      <span>{m.name}</span>
                      <span className="text-[10px] font-mono font-normal opacity-70">({m.unit})</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {chartOrdersData.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-sans">
                所选时间段内暂无满足完成订单≥2笔的产品型号！
              </div>
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartOrdersData}
                    margin={{ top: 28, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="stroke-slate-100 dark:stroke-slate-800" />
                    <XAxis
                      dataKey="orderCode"
                      tick={{ fontSize: 11, fill: 'currentColor' }}
                      className="text-slate-600 dark:text-slate-300"
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'currentColor' }}
                      className="text-slate-600 dark:text-slate-300"
                      tickLine={false}
                      axisLine={false}
                      unit={` ${currentMetricConfig.unit}`}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(56, 189, 248, 0.08)', stroke: 'none' }}
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null
                        const data = payload[0].payload
                        return (
                          <div className="bg-slate-900 dark:bg-slate-800 text-white p-2.5 rounded-lg shadow-xl text-xs font-mono space-y-1 z-50 border border-slate-700">
                            <div className="font-bold text-amber-400 font-sans">{data.orderCode}</div>
                            <div className="text-slate-300">产品型号: <span className="text-white">{data.modelName}</span></div>
                            <div className="text-slate-300">完工时间: <span className="text-white">{data.completeDate}</span></div>
                            <div className="text-slate-300">排产数量: <span className="text-white">{data.batchSize} {data.unit}</span></div>
                            <div className="border-t border-slate-700 pt-1 text-slate-300">
                              {currentMetricConfig.name}: <span className="font-bold text-[#41C0FF]">{data.value} {currentMetricConfig.unit}</span>
                            </div>
                            <div className="text-slate-300">
                              较平均偏差: <span className={cn('font-bold', (data.diffPct || '').startsWith('-') ? 'text-emerald-400' : 'text-amber-400')}>{data.diffPct || '0.0%'}</span>
                            </div>
                          </div>
                        )
                      }}
                    />
                    {/* 各订单平均线 */}
                    <ReferenceLine
                      y={currentMetricAvg}
                      stroke="#FF6536"
                      strokeDasharray="4 4"
                      strokeWidth={1.8}
                      label={{
                        value: `订单平均线 (${currentMetricAvg} ${currentMetricConfig.unit})`,
                        position: 'insideTopRight',
                        fill: '#FF6536',
                        fontSize: 11,
                        fontWeight: 'bold',
                      }}
                    />
                    {/* 单柱状图，每根柱子上方直接展示数据 */}
                    <Bar
                      dataKey="value"
                      name={currentMetricConfig.name}
                      fill={currentMetricConfig.color}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={44}
                      label={{
                        position: 'top',
                        fill: 'currentColor',
                        className: 'fill-slate-800 dark:fill-slate-100 font-bold',
                        fontSize: 11,
                        formatter: (val: any) => `${val}`,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 展示②：在图表下方展示这些订单单耗明细台账 */}
          <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  完工订单单耗明细
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-panel text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-border font-bold font-sans h-[44px]">
                    <th className="py-2.5 px-3 text-center w-[50px]">序号</th>
                    <th className="py-2.5 px-3">订单编号</th>
                    <th className="py-2.5 px-3">产品型号</th>
                    <th className="py-2.5 px-3 text-center">完工时间</th>
                    <th className="py-2.5 px-3 text-right">排产数量</th>
                    <th className="py-2.5 px-3 text-right text-slate-900 dark:text-slate-100">综合能耗 (tce/{currentSelectedModel?.unit || '台'})</th>
                    <th className="py-2.5 px-3 text-right text-[#2C7CFF]">电耗 (kWh)</th>
                    <th className="py-2.5 px-3 text-right text-[#FFBA00]">蒸汽耗 (t)</th>
                    <th className="py-2.5 px-3 text-right text-[#10C4CE]">水耗 (t)</th>
                    <th className="py-2.5 px-3 text-center">较平均偏差</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-border text-slate-800 dark:text-slate-200">
                  {currentModelOrders.length > 0 ? (
                    currentModelOrders.map((ord, idx) => {
                      const val = ord[verticalMetricObject] || 0
                      const diffAvg = currentMetricAvg > 0 ? (((val - currentMetricAvg) / currentMetricAvg) * 100).toFixed(1) : '0.0'
                      const diffPct = (ord as any).diffPct || (Number(diffAvg) > 0 ? `+${diffAvg}%` : Number(diffAvg) < 0 ? `${diffAvg}%` : '0.0%')
                      const isNegative = typeof diffPct === 'string' && diffPct.startsWith('-')
                      const isZero = diffPct === '0.0%' || diffPct === '0%'
                      return (
                        <tr key={ord.orderNo || idx} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors h-[44px]">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-sans">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white font-mono">{ord.orderNo}</td>
                          <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-sans">{ord.modelName}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600 dark:text-slate-400 font-mono">{ord.finishDate}</td>
                          <td className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200 font-mono">{ord.quantity}</td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 dark:text-white font-mono">
                            {ord.tce.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-blue-700 dark:text-blue-400 font-mono">
                            {ord.elec.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-amber-700 dark:text-amber-400 font-mono">
                            {(ord.steam ?? 0) > 0 ? (ord.steam ?? 0).toFixed(1) : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-teal-700 dark:text-teal-400 font-mono">
                            {ord.water.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 text-center font-sans">
                            <span className={cn(
                              'px-2 py-0.5 rounded text-[11px] font-bold font-mono',
                              isNegative
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                                : isZero
                                ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                            )}>
                              {diffPct} {isNegative ? '↓' : isZero ? '—' : '↑'}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 dark:text-slate-500 font-sans">
                        所选时间段内暂无满足条件的订单数据！
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
      {/* TAB 4: 关键工序单耗对比 (变压器 / 线缆 / 中低压开关 相同关键工序柱状图对比) */}
      {/* ========================================================================= */}
      {activeTab === 'process' && (
        <div className="space-y-3.5">
          {/* 1. 顶部控制面板：产业、关键工序、选择时间、查询、重置 */}
          <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {/* ① 产业 */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Sliders className="size-3.5 text-[#2C7CFF]" />
                  产业
                </span>
                <select
                  value={processIndustry}
                  onChange={(e) => handleProcessIndustryChange(e.target.value as 'transformer' | 'cable')}
                  className="h-9 min-w-[110px] px-3 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs transition-colors"
                >
                  <option value="transformer">变压器</option>
                  <option value="cable">线缆</option>
                </select>
              </div>

              {/* ② 关键工序 */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Zap className="size-3.5 text-[#2C7CFF]" />
                  关键工序
                </span>
                <select
                  value={selectedProcessId}
                  onChange={(e) => setSelectedProcessId(e.target.value)}
                  className="h-9 min-w-[140px] px-3 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs transition-colors"
                >
                  {availableProcessList.map((proc) => (
                    <option key={proc.id} value={proc.id}>
                      {proc.processName}
                    </option>
                  ))}
                </select>
              </div>

              {/* ③ 选择时间 (月份) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#2C7CFF]" />
                  选择时间
                </span>
                <input
                  type="month"
                  value={processTimeMonth}
                  onChange={(e) => setProcessTimeMonth(e.target.value)}
                  className="h-9 w-[135px] px-2.5 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-mono font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] cursor-pointer shadow-2xs"
                />
              </div>

              {/* ④ 查询与重置按钮 */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleProcessQuery}
                  className="h-9 px-3.5 bg-[#2C7CFF] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Search className={cn("size-3.5", isProcessQuerying && "animate-spin")} />
                  <span>{isProcessQuerying ? '正在检索...' : '查询'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleProcessReset}
                  className="h-9 px-3 bg-white dark:bg-panel hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-border rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <RotateCcw className="size-3.5" />
                  <span>重置</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. 核心柱状图：各项目公司单耗对比 (有行业基准的画行业基准线，没有的不画；都画上集团平均线) */}
          <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-border pb-2 text-xs font-sans">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  关键工序单耗柱状对比 ({currentSelectedProcess.unit})
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  [ 主要消耗能源：{currentSelectedProcess.energyTypes} ]
                </span>
              </div>

              {/* 图例说明：集团平均线 (都有) + 行业基准线 (有才有) */}
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="flex items-center gap-1 text-[#2C7CFF] font-bold">
                  <span className="size-2 rounded-full bg-[#2C7CFF]" /> 实测工序单耗
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="size-2 rounded-full bg-emerald-500" /> 领先基准单位
                </span>
                {/* 集团平均线 (所有工序都画) */}
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                  <span className="w-3 h-0.5 bg-blue-600 dark:bg-blue-400" /> 电装集团平均线 ({currentSelectedProcess.groupAvg})
                </span>
                {/* 行业基准线 (有行业基准才画) */}
                {currentSelectedProcess.industryBenchmark !== undefined && (
                  <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                    <span className="w-3 h-0.5 bg-purple-600 dark:bg-purple-400" /> 行业先进基准线 ({currentSelectedProcess.industryBenchmark})
                  </span>
                )}
              </div>
            </div>

            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentSelectedProcess.companies.map((c) => ({
                    name: c.companyName,
                    value: c.value,
                    isOptimal: c.isOptimal,
                    diffGroupPct: c.diffGroupPct,
                  }))}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="stroke-slate-100 dark:stroke-slate-800" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'currentColor' }}
                    className="text-slate-700 dark:text-slate-200"
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[
                      0,
                      (dataMax: number) => {
                        const benchmark = currentSelectedProcess.industryBenchmark || 0
                        const maxVal = Math.max(dataMax, benchmark, currentSelectedProcess.groupAvg)
                        return Number((maxVal * 1.2).toFixed(currentSelectedProcess.unit.includes('kVA') ? 3 : 1))
                      }
                    ]}
                    tick={{ fontSize: 11, fill: 'currentColor' }}
                    className="text-slate-600 dark:text-slate-300"
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)', stroke: 'none' }}
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null
                      const d = payload[0].payload
                      return (
                        <div className="bg-slate-900 dark:bg-slate-800 text-white p-2.5 rounded-lg shadow-xl text-xs font-mono space-y-1 border border-slate-700">
                          <div className="font-bold text-amber-400 font-sans">{d.name}</div>
                          <div className="text-slate-300">
                            工序实测单耗: <span className="font-bold text-[#41C0FF]">{d.value} {currentSelectedProcess.unit}</span>
                          </div>
                          <div className="text-slate-300">
                            较集团平均: <span className={cn('font-bold', (d.diffGroupPct || '').startsWith('-') ? 'text-emerald-400' : 'text-amber-400')}>{d.diffGroupPct || '0.0%'}</span>
                          </div>
                        </div>
                      )
                    }}
                  />

                  {/* 1. 集团平均线 (所有工序都有，都画) */}
                  <ReferenceLine
                    y={currentSelectedProcess.groupAvg}
                    stroke="#2563eb"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `集团平均线 (${currentSelectedProcess.groupAvg})`,
                      position: 'insideTopLeft',
                      fill: '#2563eb',
                      fontSize: 11,
                      fontWeight: 'bold',
                    }}
                  />

                  {/* 2. 行业先进基准线 (有行业基准才画，没有的不画) */}
                  {currentSelectedProcess.industryBenchmark !== undefined && (
                    <ReferenceLine
                      y={currentSelectedProcess.industryBenchmark}
                      stroke="#9333ea"
                      strokeDasharray="4 4"
                      strokeWidth={1.8}
                      label={{
                        value: `行业先进基准 (${currentSelectedProcess.industryBenchmark})`,
                        position: 'insideTopRight',
                        fill: '#9333ea',
                        fontSize: 11,
                        fontWeight: 'bold',
                      }}
                    />
                  )}

                  {/* 柱状数据 */}
                  <Bar
                    dataKey="value"
                    name="实测单耗"
                    fill="#2C7CFF"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  >
                    {currentSelectedProcess.companies.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isOptimal ? '#10b981' : '#2C7CFF'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. 对比数据明细表 */}
          <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  对比数据明细表
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-panel text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-border font-bold font-sans h-[44px]">
                    <th className="py-2.5 px-3 text-center w-[60px]">序号</th>
                    <th className="py-2.5 px-3">项目公司</th>
                    <th className="py-2.5 px-3 text-right text-blue-700 dark:text-blue-400">实测单耗值 ({currentSelectedProcess.unit})</th>
                    <th className="py-2.5 px-3 text-right">电装集团平均线</th>
                    <th className="py-2.5 px-3 text-center">较集团平均偏差</th>
                    <th className="py-2.5 px-3 text-right text-purple-700 dark:text-purple-400">行业先进基准</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-border text-slate-800 dark:text-slate-200">
                  {currentSelectedProcess.companies.map((c, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors h-[44px]">
                      {/* 1. 序号 */}
                      <td className="py-2.5 px-3 text-center text-slate-400 font-sans">
                        {idx + 1}
                      </td>

                      {/* 2. 项目公司 */}
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('size-1.5 rounded-full', c.isOptimal ? 'bg-emerald-500' : 'bg-slate-400')} />
                          <span>{c.companyName}</span>
                        </div>
                      </td>

                      {/* 3. 实测单耗值 */}
                      <td className="py-2.5 px-3 text-right font-extrabold text-[#2C7CFF]">
                        {c.value} <span className="text-[10px] text-slate-400 font-normal font-sans">{currentSelectedProcess.unit}</span>
                      </td>

                      {/* 4. 电装集团平均线 */}
                      <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300 font-bold">
                        {currentSelectedProcess.groupAvg}
                      </td>

                      {/* 5. 较集团平均偏差 */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-[11px] font-bold font-mono',
                          (c.diffGroupPct || '').startsWith('-')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                            : c.diffGroupPct === '0.0%'
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                        )}>
                          {c.diffGroupPct} {(c.diffGroupPct || '').startsWith('-') ? '↓' : c.diffGroupPct === '0.0%' ? '—' : '↑'}
                        </span>
                      </td>

                      {/* 6. 行业先进基准 */}
                      <td className="py-2.5 px-3 text-right text-purple-700 dark:text-purple-400 font-bold">
                        {currentSelectedProcess.industryBenchmark !== undefined ? (
                          <span>{currentSelectedProcess.industryBenchmark} <span className="text-[10px] font-normal text-slate-400 font-sans">{currentSelectedProcess.unit}</span></span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 font-normal font-sans">无行业基准</span>
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
      {/* TAB 5: 基准管理 (1. 工厂指标  2. 工序指标，支持关键工序录入与联动同步) */}
      {/* ========================================================================= */}
      {activeTab === 'standard_manage' && (
        <div className="space-y-4">
          {/* 筛选与操作控制栏 */}
          <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* 分类切换按钮组：仅保留“工厂指标”与“工序指标” */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0d1b29] p-0.5 dark:p-[3px] rounded-lg border border-slate-200 dark:border-[#133748] text-xs font-sans">
                <button
                  type="button"
                  onClick={() => setStandardCategoryFilter('factory')}
                  className={cn(
                    'h-7 px-3.5 rounded-md font-bold transition-all cursor-pointer flex items-center select-none text-xs',
                    standardCategoryFilter === 'factory'
                      ? 'tbea-tab-cyan-active shadow-xs dark:shadow-none'
                      : 'text-slate-600 hover:text-slate-900 dark:text-[#879ca8] dark:hover:text-white bg-transparent dark:bg-transparent'
                  )}
                >
                  工厂指标 ({standardsSummary.factoryCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStandardCategoryFilter('process')}
                  className={cn(
                    'h-7 px-3.5 rounded-md font-bold transition-all cursor-pointer flex items-center select-none text-xs',
                    standardCategoryFilter === 'process'
                      ? 'tbea-tab-cyan-active shadow-xs dark:shadow-none'
                      : 'text-slate-600 hover:text-slate-900 dark:text-[#879ca8] dark:hover:text-white bg-transparent dark:bg-transparent'
                  )}
                >
                  工序指标 ({standardsSummary.processCount})
                </button>
              </div>

              {/* 搜索框 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="按指标名称/依据出处/适用范围搜索..."
                  value={standardSearchKeyword}
                  onChange={(e) => setStandardSearchKeyword(e.target.value)}
                  className="pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-sans placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-white focus:outline-none focus:border-[#2C7CFF] focus:bg-white dark:focus:bg-panel w-64 transition-colors"
                />
                <Search className="size-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
                {standardSearchKeyword && (
                  <button
                    type="button"
                    onClick={() => setStandardSearchKeyword('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 操作按钮组：支持录入维护、汇总台账查看与导出 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingStandardId(null)
                  setNewStandardForm({
                    category: standardCategoryFilter,
                    processIndustry: 'transformer',
                    energyTypes: '电力',
                    indicatorName: '',
                    scope: standardCategoryFilter === 'process' ? '变压器关键制造车间' : '集团直属各制造单位',
                    benchmarkValue: '',
                    advancedValue: '',
                    compareOperator: '<=',
                    unit: standardCategoryFilter === 'process' ? 'kWh/台' : 'tce/万元',
                    standardSource: '特变电工集团2026年度内控考核指标',
                    currentGroupAvg: '',
                    effectiveDate: '2026-09-01',
                    maintainer: '集团双碳办',
                    notes: '',
                  })
                  setShowAddStandardModal(true)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="size-3.5" />
                <span>录入 / 维护新基准</span>
              </button>
            </div>
          </div>

          {/* 3. 基准库明细数据大表 (含门槛基准值、先进标杆值、实测均值与客观偏差) */}
          <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between bg-slate-50/70 dark:bg-panel">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  能效对标基准与标准维护明细表
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                当前筛选呈现 <strong className="text-slate-800 dark:text-slate-200 font-mono">{filteredStandards.length}</strong> / {standardsList.length} 项基准指标
              </span>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-panel text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-border font-bold font-sans h-[44px]">
                    <th className="py-2.5 px-3">基准分类</th>
                    <th className="py-2.5 px-3">对标指标名称</th>
                    <th className="py-2.5 px-3 text-right">标准基准值 (门槛)</th>
                    <th className="py-2.5 px-3 text-right">标杆先进值 (最优)</th>
                    <th className="py-2.5 px-3 text-right">集团实测均值</th>
                    <th className="py-2.5 px-3">标准依据 / 来源出处</th>
                    <th className="py-2.5 px-3 text-center">维护日期</th>
                    <th className="py-2.5 px-3 text-center font-sans">状态</th>
                    <th className="py-2.5 px-3 text-right font-sans">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-border text-slate-800 dark:text-slate-200">
                  {filteredStandards.map((std) => {
                    return (
                      <tr key={std.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors h-[44px]">
                        {/* 基准分类 */}
                        <td className="py-2.5 px-3 font-sans align-middle">
                          <span className={cn(
                            'inline-block px-2 py-0.5 rounded font-mono font-bold text-[10.5px]',
                            std.category === 'factory'
                              ? 'bg-blue-50 text-[#2C7CFF] border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60'
                              : std.category === 'process'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                          )}>
                            {std.categoryName}
                          </span>
                        </td>

                        {/* 指标名称 */}
                        <td className="py-2.5 px-3 align-middle font-sans">
                          <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                            <span>{std.indicatorName}</span>
                          </div>
                        </td>

                        {/* 标准基准值 (带比较符) */}
                        <td className="py-2.5 px-3 text-right align-middle font-extrabold text-slate-900 dark:text-white">
                          <span className={cn(
                            'text-sm',
                            std.category === 'factory' ? 'text-[#2C7CFF]' : std.category === 'process' ? 'text-purple-700 dark:text-purple-400' : 'text-emerald-700 dark:text-emerald-400'
                          )}>
                            {std.compareOperator === '<=' ? '≤ ' : '≥ '}
                            {std.benchmarkValue}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal ml-1 font-sans">
                            {std.unit}
                          </span>
                        </td>

                        {/* 标杆先进值 */}
                        <td className="py-2.5 px-3 text-right align-middle font-bold text-slate-700 dark:text-slate-300">
                          {std.advancedValue !== undefined ? (
                            <span>
                              {std.advancedValue}
                              <span className="text-[10px] text-slate-400 font-normal ml-1 font-sans">
                                {std.unit}
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600 font-normal">--</span>
                          )}
                        </td>

                        {/* 集团实测均值 */}
                        <td className="py-2.5 px-3 text-right align-middle font-bold text-slate-900 dark:text-white">
                          <span>
                            {std.currentGroupAvg}
                            <span className="text-[10px] text-slate-400 font-normal ml-1 font-sans">
                              {std.unit}
                            </span>
                          </span>
                        </td>

                        {/* 标准出处 */}
                        <td className="py-2.5 px-3 align-middle font-sans text-slate-700 dark:text-slate-300 text-[11px]">
                          <div className="flex items-center gap-1">
                            <FileText className="size-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[220px]" title={std.standardSource}>
                              {std.standardSource}
                            </span>
                          </div>
                        </td>

                        {/* 维护日期 */}
                        <td className="py-2.5 px-3 text-center align-middle text-slate-500 dark:text-slate-400 text-[11px]">
                          {std.effectiveDate}
                        </td>

                        {/* 状态 */}
                        <td className="py-2.5 px-3 text-center align-middle font-sans">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            启用中
                          </span>
                        </td>

                        {/* 操作：全面支持编辑与版本查看 */}
                        <td className="py-2.5 px-3 text-right align-middle font-sans space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStandardId(std.id)
                              setNewStandardForm({
                                category: (std.category === 'factory' ? 'factory' : 'process'),
                                processIndustry: (std.scope?.includes('线缆') ? 'cable' : 'transformer'),
                                energyTypes: '电力',
                                indicatorName: std.indicatorName,
                                scope: std.scope,
                                benchmarkValue: String(std.benchmarkValue),
                                advancedValue: std.advancedValue !== undefined ? String(std.advancedValue) : '',
                                compareOperator: std.compareOperator,
                                unit: std.unit,
                                standardSource: std.standardSource,
                                currentGroupAvg: String(std.currentGroupAvg),
                                effectiveDate: std.effectiveDate,
                                maintainer: std.maintainer,
                                notes: std.notes || '',
                              })
                              setShowAddStandardModal(true)
                            }}
                            className="text-xs text-[#2C7CFF] hover:underline font-bold cursor-pointer"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenVersionModal(std)}
                            className="text-xs text-slate-600 dark:text-slate-400 hover:text-[#2C7CFF] dark:hover:text-[#2C7CFF] hover:underline cursor-pointer transition-colors"
                            title="打开该基准历史版本演进与变更审计记录"
                          >
                            版本
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* 汇总页脚提示栏 */}
            <div className="p-3 bg-slate-50/90 dark:bg-slate-900/60 border-t border-slate-100 dark:border-border flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans">
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>全集团能效对标基准数据库已实现工厂、工序、产品三维闭环管理，基准值变更实时联动全系统对标计算。</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                更新周期: 月度/年度动态维护
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 4. 录入 / 维护基准弹窗 (全面支持工厂指标/工序指标/产品指标，内嵌“基准数据配置卡片”与“实时预览卡片”) */}
      {showAddStandardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border border-slate-200 dark:border-border w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* 弹窗 Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-border flex items-center justify-between bg-slate-50/80 dark:bg-panel">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold shadow-2xs">
                  {editingStandardId ? <Edit className="size-4 text-[#2C7CFF]" /> : <Plus className="size-4 text-[#2C7CFF]" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    {editingStandardId ? '编辑指标基准数据与标准参数' : '录入新指标基准数据与内控标准'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStandardModal(false)}
                className="size-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const bVal = Number(newStandardForm.benchmarkValue) || 0
                const advVal = newStandardForm.advancedValue ? Number(newStandardForm.advancedValue) : undefined
                const avgVal = Number(newStandardForm.currentGroupAvg) || bVal
                const catName = newStandardForm.category === 'factory' ? '工厂指标' : '工序指标'

                if (editingStandardId) {
                  // 编辑已有指标
                  setStandardsList((prev) =>
                    prev.map((item) =>
                      item.id === editingStandardId
                        ? {
                            ...item,
                            category: newStandardForm.category,
                            categoryName: catName,
                            indicatorName: newStandardForm.indicatorName || item.indicatorName,
                            scope: newStandardForm.scope || item.scope,
                            benchmarkValue: bVal,
                            advancedValue: advVal,
                            compareOperator: newStandardForm.compareOperator,
                            unit: newStandardForm.unit || item.unit,
                            standardSource: newStandardForm.standardSource || item.standardSource,
                            currentGroupAvg: avgVal,
                            effectiveDate: newStandardForm.effectiveDate || item.effectiveDate,
                            maintainer: newStandardForm.maintainer || item.maintainer,
                            notes: newStandardForm.notes || item.notes,
                          }
                        : item
                    )
                  )

                  // 如果是工序指标，同步更新 processList
                  if (newStandardForm.category === 'process') {
                    setProcessList((prev) =>
                      prev.map((proc) => {
                        if (proc.processName === newStandardForm.indicatorName || proc.id === editingStandardId) {
                          return {
                            ...proc,
                            industry: newStandardForm.processIndustry || proc.industry,
                            industryName: newStandardForm.processIndustry === 'cable' ? '线缆产业' : '变压器产业',
                            unit: newStandardForm.unit || proc.unit,
                            energyTypes: newStandardForm.energyTypes || proc.energyTypes,
                            groupAvg: avgVal,
                            industryBenchmark: advVal,
                          }
                        }
                        return proc
                      })
                    )
                  }
                  alert(`已成功更新【${newStandardForm.indicatorName}】基准数据！`)
                } else {
                  // 录入新指标
                  const newEntry: BenchmarkStandardItem = {
                    id: `std-custom-${Date.now()}`,
                    category: newStandardForm.category,
                    categoryName: catName,
                    indicatorName: newStandardForm.indicatorName || '自定义对标指标',
                    scope: newStandardForm.scope || (newStandardForm.category === 'process' ? '重点关键制造车间' : '全集团直属制造单位'),
                    benchmarkValue: bVal,
                    advancedValue: advVal,
                    compareOperator: newStandardForm.compareOperator,
                    unit: newStandardForm.unit || (newStandardForm.category === 'process' ? 'kWh/t' : 'tce/万元'),
                    standardSource: newStandardForm.standardSource || '企业内部管理标准',
                    currentGroupAvg: avgVal,
                    effectiveDate: newStandardForm.effectiveDate,
                    status: 'active',
                    maintainer: newStandardForm.maintainer || '集团双碳办',
                    notes: newStandardForm.notes,
                  }
                  setStandardsList((prev) => [newEntry, ...prev])

                  // 如果是关键工序，同步新增至 Tab 4 关键工序数据库 processList
                  if (newStandardForm.category === 'process') {
                    const isCable = newStandardForm.processIndustry === 'cable'
                    const newProcessItem: KeyProcessBenchmarkItem = {
                      id: `proc-${Date.now()}`,
                      industry: newStandardForm.processIndustry || 'transformer',
                      industryName: isCable ? '线缆产业' : '变压器产业',
                      processName: newStandardForm.indicatorName,
                      unit: newStandardForm.unit || (isCable ? 'kWh/km' : 'kWh/台'),
                      energyTypes: newStandardForm.energyTypes || '电力',
                      groupAvg: avgVal,
                      industryBenchmark: advVal,
                      companies: isCable ? [
                        { companyId: 'lulian', companyName: '山东鲁能泰山电缆', value: +(avgVal * 0.96).toFixed(1), isOptimal: true, diffGroupPct: '-4.0%' },
                        { companyId: 'xinlan', companyName: '特变电工新疆线缆厂', value: +(avgVal * 1.03).toFixed(1), diffGroupPct: '+3.0%' },
                        { companyId: 'delan', companyName: '特变电工德阳线缆厂', value: +(avgVal * 1.01).toFixed(1), diffGroupPct: '+1.0%' },
                      ] : [
                        { companyId: 'heng变', companyName: '特变电工衡阳变压器', value: +(avgVal * 0.95).toFixed(1), isOptimal: true, diffGroupPct: '-5.0%' },
                        { companyId: 'shen变', companyName: '特变电工沈阳变压器', value: +(avgVal * 1.02).toFixed(1), diffGroupPct: '+2.0%' },
                        { companyId: 'xin变', companyName: '特变电工新疆变压器', value: +(avgVal * 1.04).toFixed(1), diffGroupPct: '+4.0%' },
                      ],
                    }
                    setProcessList((prev) => [newProcessItem, ...prev])
                    setSelectedProcessId(newProcessItem.id)
                    if (newStandardForm.processIndustry) {
                      setProcessIndustry(newStandardForm.processIndustry)
                    }
                    alert(`已成功录入关键工序【${newStandardForm.indicatorName}】！该工序已同步至【关键工序单耗对比】工序库中，可直接在Tab4工序下拉列表中切换查看对标分析。`)
                  } else {
                    alert(`已成功录入并发布【${newEntry.indicatorName}】基准标准！`)
                  }
                }
                setShowAddStandardModal(false)
              }}
              className="p-6 space-y-4 text-xs font-sans max-h-[75vh] overflow-y-auto"
            >
              {/* 1. 对标指标与适用范围 */}
              <div className="space-y-3 p-4 bg-slate-50/70 dark:bg-panel border border-slate-200 dark:border-border rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 dark:text-white font-bold block flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#2C7CFF]" />
                    第一步：选择基准分类与对标指标
                  </label>

                  {/* 分类切换器 */}
                  <div className="flex items-center bg-white dark:bg-card p-0.5 rounded-lg border border-slate-200 dark:border-border text-xs">
                    <button
                      type="button"
                      onClick={() => setNewStandardForm({
                        ...newStandardForm,
                        category: 'factory',
                        unit: 'tce/万元',
                        scope: '集团直属各生产制造单位',
                      })}
                      className={cn(
                        'px-3 py-1 rounded-md font-bold transition-all cursor-pointer',
                        newStandardForm.category === 'factory' ? 'bg-[#2C7CFF] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      )}
                    >
                      工厂指标
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewStandardForm({
                        ...newStandardForm,
                        category: 'process',
                        unit: newStandardForm.processIndustry === 'cable' ? 'kWh/km' : 'kWh/台',
                        scope: newStandardForm.processIndustry === 'cable' ? '线缆重点制造车间' : '变压器关键制造车间',
                      })}
                      className={cn(
                        'px-3 py-1 rounded-md font-bold transition-all cursor-pointer',
                        newStandardForm.category === 'process' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      )}
                    >
                      工序指标 (关键工序)
                    </button>
                  </div>
                </div>

                {/* 工序指标模式：提供产业选择、工序名称、消耗能源介质、适用范围 */}
                {newStandardForm.category === 'process' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-slate-700 dark:text-slate-300 font-bold block">所属产业：</label>
                      <select
                        value={newStandardForm.processIndustry || 'transformer'}
                        onChange={(e) => {
                          const ind = e.target.value as 'transformer' | 'cable'
                          setNewStandardForm({
                            ...newStandardForm,
                            processIndustry: ind,
                            unit: ind === 'cable' ? 'kWh/km' : 'kWh/台',
                            scope: ind === 'cable' ? '线缆重点制造车间' : '变压器关键制造车间',
                          })
                        }}
                        className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors cursor-pointer"
                      >
                        <option value="transformer">变压器</option>
                        <option value="cable">线缆</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 dark:text-slate-300 font-bold block">
                        关键工序名称：<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="如：绕线固化、器身绝缘、退火处理、浸漆烘干"
                        value={newStandardForm.indicatorName}
                        onChange={(e) => setNewStandardForm({ ...newStandardForm, indicatorName: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 dark:text-slate-300 font-bold block">消耗主要能源介质：</label>
                      <input
                        type="text"
                        placeholder="如：电力、天然气、蒸汽"
                        value={newStandardForm.energyTypes || ''}
                        onChange={(e) => setNewStandardForm({ ...newStandardForm, energyTypes: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-white text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 dark:text-slate-300 font-bold block">适用车间产线范围：</label>
                      <input
                        type="text"
                        placeholder="如：变压器关键制造车间"
                        value={newStandardForm.scope}
                        onChange={(e) => setNewStandardForm({ ...newStandardForm, scope: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                      />
                    </div>
                  </div>
                ) : (
                  /* 工厂指标模式 */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-slate-700 dark:text-slate-300 font-bold block">
                        对标指标名称：<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="如：万元产值综合能耗、万元产值电耗"
                        value={newStandardForm.indicatorName}
                        onChange={(e) => setNewStandardForm({ ...newStandardForm, indicatorName: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 dark:text-slate-300 font-bold block">适用制造单位 / 业务板块：</label>
                      <input
                        type="text"
                        placeholder="如：全集团直属制造单位"
                        value={newStandardForm.scope}
                        onChange={(e) => setNewStandardForm({ ...newStandardForm, scope: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 🌟 2. 【核心卡片】：指标录入卡片增补“基准数据” (Benchmark Reference Data Card) */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl space-y-3.5">
                <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/50 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-md bg-[#2C7CFF] text-white flex items-center justify-center font-bold">
                      <Sliders className="size-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      第二步：基准数据配置 (标准门槛、先进标杆与实测基线)
                    </span>
                  </div>
                </div>

                {/* 基准数据主要输入项 */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {/* 判定规则 */}
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-bold block text-[11px]">达标判定规则：</label>
                    <select
                      value={newStandardForm.compareOperator}
                      onChange={(e) => setNewStandardForm({ ...newStandardForm, compareOperator: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-white font-bold text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors cursor-pointer"
                    >
                      <option value="<=">≤ (小于等于，优于门槛)</option>
                      <option value=">=">≥ (大于等于，达到目标)</option>
                    </select>
                  </div>

                  {/* 标准基准值 */}
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-bold block text-[11px]">
                      标准基准值 (门槛考核)：<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="如：320.0"
                      value={newStandardForm.benchmarkValue}
                      onChange={(e) => setNewStandardForm({ ...newStandardForm, benchmarkValue: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-card border border-blue-300 dark:border-blue-700 rounded-lg text-[#2C7CFF] font-mono font-bold text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                    />
                  </div>

                  {/* 标杆先进值 */}
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-bold block text-[11px]">
                      标杆先进值 (行业最优)：
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="如：305.0 (可选)"
                      value={newStandardForm.advancedValue}
                      onChange={(e) => setNewStandardForm({ ...newStandardForm, advancedValue: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-purple-700 dark:text-purple-400 font-mono font-bold text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                    />
                  </div>

                  {/* 集团实测均值 */}
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-bold block text-[11px]">
                      集团当前实测均值：
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="如：330.0"
                      value={newStandardForm.currentGroupAvg}
                      onChange={(e) => setNewStandardForm({ ...newStandardForm, currentGroupAvg: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-white font-mono font-bold text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                    />
                  </div>
                </div>

                {/* 计量单位与快捷标签 */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                      基准计量单位：<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">快捷选择：</span>
                      {['tce/万元', 'kWh/t', 'tce/台', 'kWh/km', '%', 'tCO₂/tce', 't/台', 'm³/km', 'm³/万元'].map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setNewStandardForm({ ...newStandardForm, unit: u })}
                          className="px-1.5 py-0.5 rounded bg-white dark:bg-card hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-border text-[10px] font-mono text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="如：kWh/t 或 tce/万元"
                    value={newStandardForm.unit}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, unit: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-white font-mono text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                  />
                </div>

                {/* 🌟 实时基准数据核算预览条 (Real-time Preview Strip) */}
                {newStandardForm.benchmarkValue && (
                  <div className="p-3 bg-white dark:bg-panel rounded-lg border border-blue-200 dark:border-blue-900/60 space-y-1.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-[#2C7CFF]" />
                        <span>基准数据实时概览：</span>
                        <strong className="text-slate-900 dark:text-white">{newStandardForm.indicatorName || '当前配置指标'}</strong>
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        判定: <strong className="text-slate-800 dark:text-slate-200">{newStandardForm.compareOperator === '<=' ? '优于标准值即达标' : '达到或高于标准值即达标'}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
                      <div className="p-2 rounded-md bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                        <div className="text-[10px] text-slate-500 font-sans">标准门槛基准值</div>
                        <div className="text-sm font-extrabold text-[#2C7CFF]">
                          {newStandardForm.compareOperator} {newStandardForm.benchmarkValue} <span className="text-[10px] font-normal text-slate-400">{newStandardForm.unit}</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-md bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
                        <div className="text-[10px] text-slate-500 font-sans">标杆先进基准值</div>
                        <div className="text-sm font-extrabold text-purple-700 dark:text-purple-400">
                          {newStandardForm.advancedValue ? (
                            <span>{newStandardForm.compareOperator} {newStandardForm.advancedValue} <span className="text-[10px] font-normal text-slate-400">{newStandardForm.unit}</span></span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600 font-normal">--</span>
                          )}
                        </div>
                      </div>
                      <div className="p-2 rounded-md bg-slate-50 dark:bg-card border border-slate-200 dark:border-border">
                        <div className="text-[10px] text-slate-500 font-sans">集团实测现状均值</div>
                        <div className="text-sm font-extrabold text-slate-800 dark:text-white">
                          {newStandardForm.currentGroupAvg || '--'} <span className="text-[10px] font-normal text-slate-400">{newStandardForm.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* 客观偏差量说明 */}
                    {newStandardForm.currentGroupAvg && newStandardForm.benchmarkValue && (
                      <div className="text-[10.5px] font-mono text-slate-500 pt-1 flex items-center justify-between border-t border-slate-100 dark:border-border">
                        <span>
                          现状实测 vs 门槛基准差值：
                          <strong className={cn(
                            'ml-1',
                            (newStandardForm.compareOperator === '<='
                              ? Number(newStandardForm.currentGroupAvg) <= Number(newStandardForm.benchmarkValue)
                              : Number(newStandardForm.currentGroupAvg) >= Number(newStandardForm.benchmarkValue))
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          )}>
                            {(Number(newStandardForm.currentGroupAvg) - Number(newStandardForm.benchmarkValue)) > 0 ? '+' : ''}
                            {(Number(newStandardForm.currentGroupAvg) - Number(newStandardForm.benchmarkValue)).toFixed(2)} {newStandardForm.unit}
                          </strong>
                        </span>
                        <span className="text-slate-400 font-sans">系统将自动以该客观偏差量进行红线预警</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. 标准出处与发布信息 */}
              <div className="space-y-3 p-4 bg-slate-50/70 dark:bg-panel border border-slate-200 dark:border-border rounded-xl">
                <label className="text-slate-800 dark:text-white font-bold block flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-slate-500" />
                  第三步：标准依据、出处及维护信息
                </label>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-medium block">标准出处 / 政策规范依据：</label>
                  <input
                    type="text"
                    required
                    placeholder="如：GB/T 3956 铜材拉丝能效先进限值 或 特变电工集团2026年度能耗双控红线"
                    value={newStandardForm.standardSource}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, standardSource: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-white text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-medium block">生效 / 修订日期：</label>
                  <input
                    type="date"
                    value={newStandardForm.effectiveDate}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, effectiveDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-800 dark:text-white font-mono text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-medium block">基准备注说明 (可选)：</label>
                  <input
                    type="text"
                    placeholder="如：月度超标即自动触发能碳预警与工序优化督办"
                    value={newStandardForm.notes}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, notes: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-lg text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-[#2C7CFF] transition-colors"
                  />
                </div>
              </div>

              {/* 4. 底部操作按钮 */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-border">
                <button
                  type="button"
                  onClick={() => setShowAddStandardModal(false)}
                  className="px-5 py-2 rounded-lg border border-slate-200 dark:border-border hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-xs font-bold text-white shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>{editingStandardId ? '确认保存并更新基准' : '确认保存并生效基准'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🌟 5. 版本记录 / 更新 / 回退弹窗 (参考 factor-client VersionModal 规范设计) */}
      {showVersionModal && selectedVersionStandard && (() => {
        const versions = benchmarkVersions[selectedVersionStandard.id] || generateStandardVersions(selectedVersionStandard)
        const currentVer = versions.find((v) => v.isCurrent) || versions[0]
        const defaultVer = versions.find((v) => !v.isCurrent) || versions[1] || currentVer
        const defaultVal = defaultVer ? defaultVer.benchmarkValue : (selectedVersionStandard.advancedValue ?? selectedVersionStandard.currentGroupAvg)

        return (
          <Modal
            open={showVersionModal}
            onClose={() => {
              setShowVersionModal(false)
              setSelectedVersionStandard(null)
              setShowNewVersionForm(false)
              setVersionToastMsg(null)
            }}
            size="lg"
            title={`版本记录 · ${selectedVersionStandard.indicatorName}`}
          >
            <div className="space-y-4">
              {/* 动态 Toast 提示 */}
              {versionToastMsg && (
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{versionToastMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVersionToastMsg(null)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* 当前值 / 默认值 / 数据来源 3列卡片对比 */}
              <div className="grid grid-cols-3 gap-3">
                {/* 当前版本 */}
                <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                  <div className="text-xs text-muted-foreground">当前版本</div>
                  <div className="mt-0.5 font-mono text-lg font-semibold text-primary">{currentVer.versionNumber}</div>
                  <div className="mt-1 font-mono text-sm text-foreground">
                    当前值 {currentVer.benchmarkValue} <span className="text-xs text-muted-foreground">{selectedVersionStandard.unit}</span>
                  </div>
                </div>

                {/* 默认值 */}
                <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
                  <div className="text-xs text-muted-foreground">默认值</div>
                  <div className="mt-0.5 font-mono text-lg text-foreground">{defaultVal}</div>
                  <div className="mt-1 text-xs text-muted-foreground">初始值或上一版本值</div>
                </div>

                {/* 数据来源 */}
                <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
                  <div className="text-xs text-muted-foreground">数据来源</div>
                  <div className="mt-1.5">
                    <Badge tone="default">{currentVer.standardSource || selectedVersionStandard.standardSource}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">更新 {currentVer.effectiveDate}</div>
                </div>
              </div>

              {/* 版本历史（可回溯） */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <History className="size-4 text-primary" /> 版本历史（可回溯）
                </div>
                <ol className="relative space-y-3 border-l border-border pl-4">
                  {versions.map((h, i) => (
                    <li key={h.id || h.versionNumber + i} className="relative">
                      <span
                        className={cn(
                          'absolute -left-[21px] top-1 size-2.5 rounded-full border-2',
                          h.isCurrent ? 'border-primary bg-primary' : 'border-border bg-background'
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-foreground">{h.versionNumber}</span>
                        {h.isCurrent && <Badge tone="success">当前</Badge>}
                        {i === 1 && !h.isCurrent && <Badge tone="default">默认</Badge>}
                        <span className="text-xs text-muted-foreground font-mono">{h.effectiveDate}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          值 {h.benchmarkValue}
                        </span>
                        {!h.isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleRollbackVersion(h)}
                            className="ml-auto inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20 cursor-pointer"
                          >
                            <Undo2 className="size-3" /> 回退此版本
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {h.changeReason} · 操作人 {h.maintainer}{h.reviewer ? ` · 审核人 ${h.reviewer}` : ''}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 发布新版本 / 更新按钮 */}
              {!showNewVersionForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowNewVersionForm(true)
                    const latestVer = versions[0]?.versionNumber || 'v2.4'
                    const numPart = parseFloat(latestVer.replace('v', '')) || 2.4
                    const nextVer = `v${(numPart + 0.1).toFixed(1)}`
                    setNewVersionForm({
                      versionNumber: nextVer,
                      benchmarkValue: String(currentVer.benchmarkValue),
                      advancedValue: currentVer.advancedValue !== undefined ? String(currentVer.advancedValue) : '',
                      compareOperator: selectedVersionStandard.compareOperator,
                      standardSource: currentVer.standardSource || selectedVersionStandard.standardSource,
                      effectiveDate: new Date().toISOString().split('T')[0],
                      changeReason: '',
                      approvalDoc: '',
                      maintainer: '张伟',
                      reviewer: '李静',
                      notes: '',
                    })
                  }}
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 text-sm font-medium text-primary transition-colors hover:bg-primary/20 cursor-pointer"
                >
                  <Plus className="size-4" /> 更新为新版本
                </button>
              ) : (
                <div className="space-y-3 rounded-lg border border-border bg-secondary/40 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">发布新版本</span>
                    <button
                      type="button"
                      onClick={() => setShowNewVersionForm(false)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <form onSubmit={handlePublishNewVersion} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs text-muted-foreground font-medium">新版本标签</label>
                        <input
                          value={newVersionForm.versionNumber}
                          onChange={(e) => setNewVersionForm({ ...newVersionForm, versionNumber: e.target.value })}
                          placeholder="如：v3.3"
                          required
                          className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-muted-foreground font-medium">
                          新基准值 ({selectedVersionStandard.unit})
                        </label>
                        <input
                          type="number"
                          step="any"
                          required
                          value={newVersionForm.benchmarkValue}
                          onChange={(e) => setNewVersionForm({ ...newVersionForm, benchmarkValue: e.target.value })}
                          placeholder="输入新基准值"
                          className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs text-muted-foreground font-medium">数据来源</label>
                        <input
                          value={newVersionForm.standardSource}
                          onChange={(e) => setNewVersionForm({ ...newVersionForm, standardSource: e.target.value })}
                          placeholder="如：特变电工2026年度内控考核指标"
                          className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-muted-foreground font-medium">生效日期</label>
                        <input
                          type="date"
                          required
                          value={newVersionForm.effectiveDate}
                          onChange={(e) => setNewVersionForm({ ...newVersionForm, effectiveDate: e.target.value })}
                          className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs text-muted-foreground font-medium">更新说明</label>
                      <input
                        required
                        value={newVersionForm.changeReason}
                        onChange={(e) => setNewVersionForm({ ...newVersionForm, changeReason: e.target.value })}
                        placeholder="本次更新的依据 / 说明"
                        className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs text-muted-foreground font-medium">操作人</label>
                        <input
                          value={newVersionForm.maintainer}
                          onChange={(e) => setNewVersionForm({ ...newVersionForm, maintainer: e.target.value })}
                          placeholder="如：张伟"
                          className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-muted-foreground font-medium">审核人</label>
                        <input
                          value={newVersionForm.reviewer}
                          onChange={(e) => setNewVersionForm({ ...newVersionForm, reviewer: e.target.value })}
                          placeholder="如：李静"
                          className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowNewVersionForm(false)}
                        className="h-9 rounded-md border border-border px-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        disabled={!newVersionForm.versionNumber.trim() || !newVersionForm.benchmarkValue}
                        className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-40 cursor-pointer"
                      >
                        确认更新
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 底部关闭按钮 */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowVersionModal(false)
                    setSelectedVersionStandard(null)
                    setShowNewVersionForm(false)
                    setVersionToastMsg(null)
                  }}
                  className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </Modal>
        )
      })()}

      {/* ========================================================================= */}
      {/* 弹窗：同型号产品关联工厂生产能耗深度分析 (使用标签显示关联工厂在生产该产品时的能耗分析) */}
      {/* ========================================================================= */}
      {showFactoryEnergyModal && (() => {
        const factoryData = activeSelectedProduct.companies.find((c) => c.companyId === selectedFactoryForModal) || activeSelectedProduct.companies[0]
        if (!factoryData) return null

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-border shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* 弹窗 Header */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-panel border-b border-slate-200 dark:border-border flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-[#2C7CFF]">
                      <Factory className="size-4.5" />
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {factoryData.companyName} · {activeSelectedProduct.model} · 生产制造能耗深度分析
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-1.5 flex flex-wrap items-center gap-4">
                    <span>生产工厂：<strong className="text-slate-700 dark:text-slate-200">{factoryData.companyName}</strong></span>
                    <span>产业：<strong className="text-slate-700 dark:text-slate-200">{activeSelectedProduct.industryName}</strong></span>
                    <span>大类：<strong className="text-slate-700 dark:text-slate-200">{activeSelectedProduct.broadCategory}</strong></span>
                    <span>种类：<strong className="text-slate-700 dark:text-slate-200">{activeSelectedProduct.kind}</strong></span>
                    <span>统计月份：<strong className="text-slate-700 dark:text-slate-200 font-mono">{horizontalTimeMonth}</strong></span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFactoryEnergyModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* 弹窗主体内容滚动区 */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50 dark:bg-background">
                <div className="space-y-4">
                  {(() => {
                    const isTransformer = activeSelectedProduct.industry === 'transformer'
                    const elecRatio = isTransformer ? factoryData.energyMix.elecRatio : 100
                    const steamRatio = isTransformer ? factoryData.energyMix.steamOrNitrogenRatio : 0
                    const elecTceVal = isTransformer ? +(factoryData.tce * elecRatio / 100).toFixed(3) : factoryData.tce
                    const steamTceVal = isTransformer ? +(factoryData.tce * steamRatio / 100).toFixed(3) : 0

                    return (
                      <div className={cn(
                        "grid gap-3.5",
                        isTransformer ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
                      )}>
                        {/* 卡片 1: 综合折标能耗 */}
                        <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200/90 dark:border-border shadow-2xs space-y-2">
                          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 font-sans flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Layers className="size-4 text-[#2C7CFF]" />
                              综合折标能耗
                            </span>
                          </div>
                          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                            {factoryData.tce.toFixed(factoryData.tce < 1 ? 3 : 2)} <span className="text-xs font-normal text-slate-400 font-sans">tce/{activeSelectedProduct.unit}</span>
                          </div>
                        </div>

                        {/* 卡片 2: 电力消耗折标 (由饼图右侧图例挪上去作为卡片) */}
                        <div className="bg-white dark:bg-card p-4 rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/20 shadow-2xs space-y-2">
                          <div className="text-xs font-bold text-blue-900 dark:text-blue-300 font-sans flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Zap className="size-4 text-[#2C7CFF]" />
                              电力消耗折标
                            </span>
                          </div>
                          <div className="text-2xl font-extrabold font-mono text-[#2C7CFF]">
                            {elecTceVal} <span className="text-xs font-normal text-slate-400 font-sans">tce</span>
                          </div>
                        </div>

                        {/* 卡片 3: 蒸汽消耗折标 (变压器专属，由饼图右侧图例挪上去作为卡片) */}
                        {isTransformer && (
                          <div className="bg-white dark:bg-card p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20 shadow-2xs space-y-2">
                            <div className="text-xs font-bold text-amber-900 dark:text-amber-300 font-sans flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Activity className="size-4 text-amber-600" />
                                蒸汽消耗折标
                              </span>
                            </div>
                            <div className="text-2xl font-extrabold font-mono text-amber-700 dark:text-amber-400">
                              {steamTceVal} <span className="text-xs font-normal text-slate-400 font-sans">tce</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}

                    {/* 1. 换算 tce 后的能源消耗占比 (整行全宽卡片: 左侧环形饼图, 右侧44px折标明细台账) */}
                    <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
                        <div className="flex items-center gap-2">
                          <PieChartIcon className="size-4 text-[#2C7CFF]" />
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                            换算 tce 后的能源消耗占比
                          </h4>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                          核算基准单位：<strong className="text-slate-800 dark:text-slate-200 font-mono">每 {activeSelectedProduct.unit} 产品</strong>
                        </span>
                      </div>

                      {(() => {
                        const isTransformer = activeSelectedProduct.industry === 'transformer'
                        const elecRatio = isTransformer ? factoryData.energyMix.elecRatio : 100
                        const steamRatio = isTransformer ? factoryData.energyMix.steamOrNitrogenRatio : 0
                        const elecTceVal = isTransformer ? +(factoryData.tce * elecRatio / 100).toFixed(3) : factoryData.tce
                        const steamTceVal = isTransformer ? +(factoryData.tce * steamRatio / 100).toFixed(3) : 0

                        const pieData = isTransformer ? [
                          {
                            name: '电力折标',
                            shortName: '电力',
                            value: elecTceVal,
                            ratio: elecRatio,
                            color: '#2C7CFF',
                          },
                          {
                            name: '蒸汽折标',
                            shortName: '蒸汽',
                            value: steamTceVal,
                            ratio: steamRatio,
                            color: '#FFBA00',
                          },
                        ] : [
                          {
                            name: '电力折标 (纯电驱动)',
                            shortName: '电力',
                            value: elecTceVal,
                            ratio: 100,
                            color: '#2C7CFF',
                          },
                        ]

                        return (
                          <div className="flex flex-col md:flex-row items-center gap-5">
                            {/* 环形饼图 (Donut Chart) */}
                            <div className="h-[150px] w-[180px] relative shrink-0 flex items-center justify-center">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={46}
                                    outerRadius={68}
                                    paddingAngle={isTransformer ? 3 : 0}
                                    dataKey="value"
                                  >
                                    {pieData.map((entry, index) => (
                                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    formatter={(val: any, name: any, item: any) => [
                                      `${val} tce (${item.payload.ratio}%)`,
                                      name
                                    ]}
                                    contentStyle={{
                                      backgroundColor: 'var(--card, #1e293b)',
                                      borderColor: 'var(--border, #334155)',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      color: 'var(--foreground, #f8fafc)',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                              {/* 中心统计数值 */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[9px] text-slate-400 font-sans">综合折标</span>
                                <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white leading-tight">
                                  {factoryData.tce.toFixed(factoryData.tce < 1 ? 3 : 2)}
                                </span>
                                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">tce/{activeSelectedProduct.unit}</span>
                              </div>
                            </div>

                            {/* 能源介质折标明细台账 (44px 工业高密表格，全展平) */}
                            <div className="flex-1 w-full overflow-x-auto font-mono text-xs bg-slate-50/50 dark:bg-card rounded-lg border border-slate-200/80 dark:border-border">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 dark:bg-panel text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-border font-bold font-sans h-[44px]">
                                    <th className="py-2.5 px-4">能源介质</th>
                                    <th className="py-2.5 px-4 text-right">实物单耗</th>
                                    <th className="py-2.5 px-4 text-center">折标系数</th>
                                    <th className="py-2.5 px-4 text-right text-slate-900 dark:text-slate-100">折标煤 (tce)</th>
                                    <th className="py-2.5 px-4 text-center">折标占比</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-border text-slate-800 dark:text-slate-200 bg-white dark:bg-card">
                                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors h-[44px]">
                                    <td className="py-2.5 px-4 font-sans font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 pt-3.5">
                                      <span className="size-2.5 rounded-full bg-[#2C7CFF]" />
                                      <span>电力</span>
                                    </td>
                                    <td className="py-2.5 px-4 text-right text-blue-700 dark:text-blue-400 font-bold">
                                      {factoryData.elecKWh.toLocaleString()} kWh/{activeSelectedProduct.unit}
                                    </td>
                                    <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400 font-sans text-[11px]">
                                      0.1229 kgce/kWh
                                    </td>
                                    <td className="py-2.5 px-4 text-right font-extrabold text-slate-900 dark:text-white">
                                      {elecTceVal}
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                      <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-[#2C7CFF] border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60 font-bold text-[11px]">
                                        {isTransformer ? `${elecRatio}%` : '100%'}
                                      </span>
                                    </td>
                                  </tr>
                                  {isTransformer && (
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors h-[44px]">
                                      <td className="py-2.5 px-4 font-sans font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 pt-3.5">
                                        <span className="size-2.5 rounded-full bg-[#FFBA00]" />
                                        <span>蒸汽</span>
                                      </td>
                                      <td className="py-2.5 px-4 text-right font-bold text-amber-700 dark:text-amber-400">
                                        {factoryData.steamTon !== undefined ? factoryData.steamTon.toFixed(1) : '0.0'} t/{activeSelectedProduct.unit}
                                      </td>
                                      <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400 font-sans text-[11px]">
                                        0.3857 tce/t
                                      </td>
                                      <td className="py-2.5 px-4 text-right font-extrabold text-slate-900 dark:text-white">
                                        {steamTceVal}
                                      </td>
                                      <td className="py-2.5 px-4 text-center">
                                        <span className="inline-block px-2.5 py-0.5 rounded font-bold border text-[11px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60">
                                          {steamRatio}%
                                        </span>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )
                      })()}
                    </div>

                    {/* 2. 生产订单能耗详情 (整行全宽放大卡片，占总行) */}
                    <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
                        <div className="flex items-center gap-2">
                          <Activity className="size-4 text-[#2C7CFF]" />
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                            生产订单能耗详情
                          </h4>
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">
                          按当期完工交付批次实物量核算
                        </span>
                      </div>

                      {(() => {
                        const isTransformer = activeSelectedProduct.industry === 'transformer'
                        const orderBatches = [
                          {
                            orderNo: `PO-202608-${factoryData.companyId.slice(0, 2).toUpperCase()}01`,
                            projectName: '国网 · 陕北—安徽特高压工程',
                            qty: activeSelectedProduct.unit === '台' ? 4 : (activeSelectedProduct.unit === 'km' ? 25 : 120),
                          },
                          {
                            orderNo: `PO-202608-${factoryData.companyId.slice(0, 2).toUpperCase()}02`,
                            projectName: '国网 · 陇东—山东特高压工程',
                            qty: activeSelectedProduct.unit === '台' ? 6 : (activeSelectedProduct.unit === 'km' ? 40 : 180),
                          },
                          {
                            orderNo: `PO-202608-${factoryData.companyId.slice(0, 2).toUpperCase()}03`,
                            projectName: '南网 · 大湾区500kV骨干网',
                            qty: activeSelectedProduct.unit === '台' ? 4 : (activeSelectedProduct.unit === 'km' ? 30 : 150),
                          },
                          {
                            orderNo: `PO-202608-${factoryData.companyId.slice(0, 2).toUpperCase()}04`,
                            projectName: '三峡 · 柴达木新能源汇集站',
                            qty: activeSelectedProduct.unit === '台' ? 2 : (activeSelectedProduct.unit === 'km' ? 15 : 80),
                          },
                        ]

                        return (
                          <div className="overflow-x-auto font-mono text-xs bg-white dark:bg-card rounded-lg border border-slate-200/80 dark:border-border">
                            <table className="w-full text-left border-collapse table-fixed min-w-[760px]">
                              <thead>
                                <tr className="bg-slate-50 dark:bg-panel text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-border font-bold font-sans h-[44px]">
                                  <th className="py-2.5 px-4 w-[18%]">订单编号</th>
                                  <th className="py-2.5 px-3 w-[26%]">订货项目 / 客户</th>
                                  <th className="py-2.5 px-3 text-right w-[11%]">排产量</th>
                                  <th className="py-2.5 px-3 text-right text-blue-700 dark:text-blue-400 whitespace-nowrap w-[15%]">总电耗 (万kWh)</th>
                                  {isTransformer && (
                                    <th className="py-2.5 px-3 text-right text-amber-700 dark:text-amber-400 whitespace-nowrap w-[14%]">总蒸汽消耗 (t)</th>
                                  )}
                                  <th className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 whitespace-nowrap w-[16%]">综合能源消耗 (tce)</th>
                                  <th className="py-2.5 px-4 text-right text-indigo-700 dark:text-indigo-400 whitespace-nowrap w-[16%]">单位能耗 (tce/{activeSelectedProduct.unit})</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-border text-slate-800 dark:text-slate-200">
                                {orderBatches.map((order) => {
                                  const orderElecWan = +((factoryData.elecKWh * order.qty) / 10000).toFixed(2)
                                  const orderSteamTon = isTransformer && factoryData.steamTon !== undefined
                                    ? +(factoryData.steamTon * order.qty).toFixed(1)
                                    : 0
                                  const orderTotalTce = +(factoryData.tce * order.qty).toFixed(2)
                                  const orderUnitTce = factoryData.tce.toFixed(factoryData.tce < 1 ? 3 : 2)

                                  return (
                                    <tr key={order.orderNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors h-[44px]">
                                      <td className="py-2.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300 text-xs whitespace-nowrap">
                                        {order.orderNo}
                                      </td>
                                      <td className="py-2.5 px-3 font-sans text-slate-800 dark:text-slate-200 text-xs truncate" title={order.projectName}>
                                        {order.projectName}
                                      </td>
                                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                        {order.qty} {activeSelectedProduct.unit}
                                      </td>
                                      <td className="py-2.5 px-3 text-right text-blue-700 dark:text-blue-400 font-bold whitespace-nowrap">
                                        {orderElecWan.toFixed(2)}
                                      </td>
                                      {isTransformer && (
                                        <td className="py-2.5 px-3 text-right font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                                          {orderSteamTon.toFixed(1)}
                                        </td>
                                      )}
                                      <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                                        {orderTotalTce.toFixed(2)}
                                      </td>
                                      <td className="py-2.5 px-4 text-right font-extrabold text-indigo-700 dark:text-indigo-400 whitespace-nowrap">
                                        {orderUnitTce}
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                {/* 弹窗 Footer */}
                <div className="px-6 py-3.5 bg-slate-50 dark:bg-panel border-t border-slate-100 dark:border-border flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                    工厂生产制造能耗数据实时归集，支持工序对标与节能优化追溯。
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFactoryEnergyModal(false)}
                    className="px-4 py-2 rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )
        })()}

    </div>
  )
}

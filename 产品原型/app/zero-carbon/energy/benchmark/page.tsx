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
  FileText,
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


// ============================================================================
// 同型号产品项目公司横向对比数据集 (涵盖变压器与线缆各核心产品种类与型号)
// ============================================================================
interface ProductCompanyEnergyItem {
  companyId: string
  companyName: string
  isOptimal: boolean
  tce: number
  elecKWh: number
  steamTon?: number
  gasM3?: number
  waterTon?: number
  diffPercent: string
}

interface ProductModelBenchmarkGroup {
  id: string
  industry: 'transformer' | 'cable'
  industryName: string
  categoryName: string // 产品种类
  model: string // 产品型号
  unit: string // 计量单位 (台 / km)
  companies: ProductCompanyEnergyItem[]
}

const CROSS_COMPANY_PRODUCT_BENCHMARKS: ProductModelBenchmarkGroup[] = [
  // ------------------ 变压器产业 (主要消耗能源：电力、蒸汽) ------------------
  {
    id: 'tx-01',
    industry: 'transformer',
    industryName: '变压器产业',
    categoryName: '变压器-高压 (特高压单相自耦)',
    model: 'ODFS-334MVA/500kV 单相自耦变压器',
    unit: '台',
    companies: [
      { companyId: 'hb_main', companyName: '衡变本部 (特高压制造部)', isOptimal: true, tce: 13.82, elecKWh: 102400, steamTon: 3.2, gasM3: 45.0, waterTon: 18.5, diffPercent: '集团最优基准' },
      { companyId: 'sb_main', companyName: '沈变本部 (超高压车间)', isOptimal: false, tce: 14.21, elecKWh: 105900, steamTon: 3.4, gasM3: 48.0, waterTon: 19.2, diffPercent: '+2.8%' },
      { companyId: 'xb_uhv', companyName: '新变超高压公司', isOptimal: false, tce: 14.72, elecKWh: 109800, steamTon: 3.6, gasM3: 52.0, waterTon: 20.1, diffPercent: '+6.5%' },
      { companyId: 'hb_hn', companyName: '衡变湖南电气', isOptimal: false, tce: 14.95, elecKWh: 111500, steamTon: 3.7, gasM3: 53.5, waterTon: 20.8, diffPercent: '+8.2%' },
    ],
  },
  {
    id: 'tx-02',
    industry: 'transformer',
    industryName: '变压器产业',
    categoryName: '变压器-中低压-干变 (干式变压器)',
    model: 'SCB13-1600kVA/10kV 环氧浇注干变',
    unit: '台',
    companies: [
      { companyId: 'xb_tb', companyName: '新变天变公司', isOptimal: true, tce: 0.68, elecKWh: 5100, steamTon: 0.18, gasM3: 6.2, waterTon: 2.1, diffPercent: '集团最优基准' },
      { companyId: 'xb_zndq', companyName: '新变智能电气公司', isOptimal: false, tce: 0.70, elecKWh: 5260, steamTon: 0.19, gasM3: 6.5, waterTon: 2.2, diffPercent: '+2.9%' },
      { companyId: 'sb_dry', companyName: '沈变本部 (干变车间)', isOptimal: false, tce: 0.72, elecKWh: 5410, steamTon: 0.20, gasM3: 6.8, waterTon: 2.3, diffPercent: '+5.9%' },
    ],
  },
  {
    id: 'tx-03',
    industry: 'transformer',
    industryName: '变压器产业',
    categoryName: '变压器-中低压-油变 (油浸式变压器)',
    model: 'SZ11-50000/110kV 节能型油浸式变压器',
    unit: '台',
    companies: [
      { companyId: 'sb_main', companyName: '沈变本部', isOptimal: true, tce: 4.15, elecKWh: 31200, steamTon: 1.1, gasM3: 15.0, waterTon: 8.2, diffPercent: '集团最优基准' },
      { companyId: 'hb_main', companyName: '衡变本部', isOptimal: false, tce: 4.28, elecKWh: 32100, steamTon: 1.2, gasM3: 16.5, waterTon: 8.6, diffPercent: '+3.1%' },
      { companyId: 'xb_jjj', companyName: '新变京津冀公司', isOptimal: false, tce: 4.39, elecKWh: 33000, steamTon: 1.3, gasM3: 17.0, waterTon: 8.9, diffPercent: '+5.8%' },
    ],
  },
  {
    id: 'tx-04',
    industry: 'transformer',
    industryName: '变压器产业',
    categoryName: '互感器 / 套管类产品',
    model: 'LVQB-500kV 六氟化硫电流互感器',
    unit: '台',
    companies: [
      { companyId: 'sb_kj', companyName: '沈变康嘉互感器', isOptimal: true, tce: 0.42, elecKWh: 3150, steamTon: 0.12, gasM3: 4.2, waterTon: 1.5, diffPercent: '集团最优基准' },
      { companyId: 'sb_hx', companyName: '沈变和新套管公司', isOptimal: false, tce: 0.45, elecKWh: 3380, steamTon: 0.13, gasM3: 4.5, waterTon: 1.6, diffPercent: '+7.1%' },
    ],
  },

  // ------------------ 线缆产业 (主要消耗能源：电力、氮气) ------------------
  {
    id: 'cb-01',
    industry: 'cable',
    industryName: '线缆产业',
    categoryName: '线缆-高压 (交联干法)',
    model: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)',
    unit: 'km',
    companies: [
      { companyId: 'll_main', companyName: '鲁缆本部 (高压交联车间)', isOptimal: true, tce: 0.582, elecKWh: 4380, gasM3: 8.5, waterTon: 1.8, diffPercent: '集团最优基准' },
      { companyId: 'xl_main', companyName: '新疆电缆有限公司 (立塔制造部)', isOptimal: false, tce: 0.605, elecKWh: 4550, gasM3: 9.2, waterTon: 1.9, diffPercent: '+3.9%' },
      { companyId: 'dl_main', companyName: '德阳电缆股份 (高压交联分厂)', isOptimal: false, tce: 0.628, elecKWh: 4720, gasM3: 9.8, waterTon: 2.1, diffPercent: '+7.9%' },
    ],
  },
  {
    id: 'cb-02',
    industry: 'cable',
    industryName: '线缆产业',
    categoryName: '线缆-中低压 (交联干法)',
    model: '35kV 铠装电力电缆 (YJV22-26/35kV 3*300)',
    unit: 'km',
    companies: [
      { companyId: 'xl_sub', companyName: '新疆线缆厂 (中压线缆分部)', isOptimal: true, tce: 0.234, elecKWh: 1760, gasM3: 4.2, waterTon: 0.9, diffPercent: '集团最优基准' },
      { companyId: 'll_main', companyName: '鲁缆本部 (连续挤出车间)', isOptimal: false, tce: 0.241, elecKWh: 1810, gasM3: 4.5, waterTon: 1.0, diffPercent: '+3.0%' },
      { companyId: 'dl_main', companyName: '德阳电缆股份 (挤塑制造部)', isOptimal: false, tce: 0.252, elecKWh: 1900, gasM3: 4.8, waterTon: 1.1, diffPercent: '+7.7%' },
    ],
  },
  {
    id: 'cb-03',
    industry: 'cable',
    industryName: '线缆产业',
    categoryName: '线缆-拉丝 (吨铜/吨铝电耗)',
    model: '连续铜杆拉丝 (Φ1.2mm~Φ3.0mm 硬铜单线)',
    unit: '吨',
    companies: [
      { companyId: 'll_main', companyName: '鲁缆本部 (拉丝车间)', isOptimal: true, tce: 0.042, elecKWh: 315, gasM3: 1.1, waterTon: 0.4, diffPercent: '集团最优基准' },
      { companyId: 'xl_main', companyName: '新疆电缆有限公司 (铜材分部)', isOptimal: false, tce: 0.044, elecKWh: 330, gasM3: 1.2, waterTon: 0.4, diffPercent: '+4.8%' },
      { companyId: 'dl_main', companyName: '德阳电缆股份 (拉丝工段)', isOptimal: false, tce: 0.046, elecKWh: 345, gasM3: 1.3, waterTon: 0.5, diffPercent: '+9.5%' },
    ],
  },
  {
    id: 'cb-04',
    industry: 'cable',
    industryName: '线缆产业',
    categoryName: '线缆-特种电缆 (曙光公司)',
    model: '光伏及风电耐寒耐扭曲特种软电缆',
    unit: 'km',
    companies: [
      { companyId: 'll_sg', companyName: '鲁缆曙光公司 (特缆部)', isOptimal: true, tce: 0.155, elecKWh: 1165, gasM3: 3.2, waterTon: 0.7, diffPercent: '集团最优基准' },
      { companyId: 'xl_main', companyName: '新疆电缆有限公司 (特缆分厂)', isOptimal: false, tce: 0.162, elecKWh: 1220, gasM3: 3.4, waterTon: 0.8, diffPercent: '+4.7%' },
      { companyId: 'dl_main', companyName: '德阳电缆股份 (特缆分部)', isOptimal: false, tce: 0.168, elecKWh: 1265, gasM3: 3.6, waterTon: 0.8, diffPercent: '+8.6%' },
    ],
  },
]


// ============================================================================
// 产品单耗对比（纵向） - 单位-产线-产品种类-型号 级联结构数据
// ============================================================================
interface ProductCascadeStructure {
  id: string
  name: string // 单位名称
  lines: {
    id: string
    name: string // 产线名称
    categories: {
      id: string
      name: string // 产品种类
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
        baseGas: number
        currGas: number
        baseWater: number
        currWater: number
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
            models: [
              {
                id: 'll-m-1',
                name: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)',
                unit: 'km',
                baseTce: 0.612,
                currTce: 0.582,
                baseElec: 4600,
                currElec: 4380,
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
            models: [
              {
                id: 'll-m-2',
                name: '35kV 铠装电力电缆 (YJV22-26/35kV 3*300)',
                unit: 'km',
                baseTce: 0.252,
                currTce: 0.241,
                baseElec: 1890,
                currElec: 1810,
                baseGas: 4.8,
                currGas: 4.5,
                baseWater: 1.1,
                currWater: 1.0,
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
            models: [
              {
                id: 'll-m-3',
                name: '10kV 架空交联导线 (JKLYJ-10kV 1*120)',
                unit: 'km',
                baseTce: 0.069,
                currTce: 0.065,
                baseElec: 520,
                currElec: 490,
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
            models: [
              {
                id: 'xl-m-1',
                name: '110kV 交联聚乙烯电力电缆 (YJLW03-64/110kV)',
                unit: 'km',
                baseTce: 0.635,
                currTce: 0.605,
                baseElec: 4780,
                currElec: 4550,
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
            models: [
              {
                id: 'dl-m-1',
                name: '0.6/1kV 阻燃铜芯电缆 (ZR-YJV-0.6/1kV 4*240)',
                unit: 'km',
                baseTce: 0.118,
                currTce: 0.112,
                baseElec: 890,
                currElec: 845,
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
  processName: string
  unit: string
  energyTypes: string // 主要消耗能源 (电力、蒸汽、氮气等)
  industryBenchmark?: number // 行业先进基准 (有些有，有些没有)
  industryBenchmarkSource?: string
  groupAvg: number // 集团平均线 (所有工序都有!)
  companies: ProcessCompanyValue[]
}

const SHARED_PROCESS_BENCHMARKS: SharedProcessBenchmarkGroup[] = [
  // ------------------ 1. 变压器产业 ------------------
  {
    id: 'proc-tx-01',
    industry: 'transformer',
    industryName: '变压器产业',
    processName: '变压器-高压-干燥 (煤油气相真空干燥)',
    unit: 'kWh/t',
    energyTypes: '电力、蒸汽',
    industryBenchmark: 48.0,
    industryBenchmarkSource: 'GB/T 变压器气相真空干燥先进标杆 (48.0)',
    groupAvg: 51.8,
    companies: [
      { companyId: 'hb_main', companyName: '衡变本部 (特高压车间)', value: 49.8, isOptimal: true, diffGroupPct: '-3.9%' },
      { companyId: 'sb_main', companyName: '沈变本部 (超高压车间)', value: 51.5, isOptimal: false, diffGroupPct: '-0.6%' },
      { companyId: 'xb_uhv', companyName: '新变超高压公司', value: 53.2, isOptimal: false, diffGroupPct: '+2.7%' },
      { companyId: 'hb_hn', companyName: '衡变湖南电气', value: 52.8, isOptimal: false, diffGroupPct: '+1.9%' },
    ],
  },
  {
    id: 'proc-tx-02',
    industry: 'transformer',
    industryName: '变压器产业',
    processName: '变压器-试验 (绝缘耐压与全负荷温升试验)',
    unit: 'kWh/kVA',
    energyTypes: '电力',
    industryBenchmark: 0.022,
    industryBenchmarkSource: '行业试验站节能先进限值 (0.022)',
    groupAvg: 0.024,
    companies: [
      { companyId: 'sb_main', companyName: '沈变本部 (试验站)', value: 0.023, isOptimal: true, diffGroupPct: '-4.2%' },
      { companyId: 'hb_main', companyName: '衡变本部 (试验大厅)', value: 0.024, isOptimal: false, diffGroupPct: '0.0%' },
      { companyId: 'xb_uhv', companyName: '新变超高压试验站', value: 0.025, isOptimal: false, diffGroupPct: '+4.2%' },
      { companyId: 'xb_tb', companyName: '新变天变试验站', value: 0.025, isOptimal: false, diffGroupPct: '+4.2%' },
    ],
  },
  {
    id: 'proc-tx-03',
    industry: 'transformer',
    industryName: '变压器产业',
    processName: '变压器-中低压-油变-干燥',
    unit: 'kWh/t',
    energyTypes: '电力、蒸汽',
    // 没有行业基准
    groupAvg: 38.5,
    companies: [
      { companyId: 'sb_main', companyName: '沈变本部', value: 36.8, isOptimal: true, diffGroupPct: '-4.4%' },
      { companyId: 'hb_main', companyName: '衡变本部', value: 38.2, isOptimal: false, diffGroupPct: '-0.8%' },
      { companyId: 'xb_jjj', companyName: '新变京津冀公司', value: 40.5, isOptimal: false, diffGroupPct: '+5.2%' },
    ],
  },
  {
    id: 'proc-tx-04',
    industry: 'transformer',
    industryName: '变压器产业',
    processName: '变压器-中低压-干变-固化 (环氧树脂浇注固化)',
    unit: 'kWh/台',
    energyTypes: '电力、蒸汽',
    // 没有行业基准
    groupAvg: 165.0,
    companies: [
      { companyId: 'xb_tb', companyName: '新变天变公司', value: 158.0, isOptimal: true, diffGroupPct: '-4.2%' },
      { companyId: 'xb_zndq', companyName: '新变智能电气公司', value: 164.0, isOptimal: false, diffGroupPct: '-0.6%' },
      { companyId: 'sb_dry', companyName: '沈变本部 (干变车间)', value: 173.0, isOptimal: false, diffGroupPct: '+4.8%' },
    ],
  },
  {
    id: 'proc-tx-05',
    industry: 'transformer',
    industryName: '变压器产业',
    processName: '硅钢铁心-纵剪 / 叠装工段',
    unit: 'kWh/t',
    energyTypes: '电力',
    industryBenchmark: 16.8,
    industryBenchmarkSource: 'GB/T 铁芯加工先进定额 (16.8)',
    groupAvg: 17.8,
    companies: [
      { companyId: 'xb_zf', companyName: '新变珠峰硅钢', value: 17.2, isOptimal: true, diffGroupPct: '-3.4%' },
      { companyId: 'sb_main', companyName: '沈变本部 (铁芯工段)', value: 17.5, isOptimal: false, diffGroupPct: '-1.7%' },
      { companyId: 'hb_main', companyName: '衡变本部 (铁芯分部)', value: 18.6, isOptimal: false, diffGroupPct: '+4.5%' },
    ],
  },

  // ------------------ 2. 线缆产业 ------------------
  {
    id: 'proc-cb-01',
    industry: 'cable',
    industryName: '线缆产业',
    processName: '线缆-拉丝 (单位吨铜电耗)',
    unit: 'kWh/t (铜)',
    energyTypes: '电力',
    industryBenchmark: 320.0,
    industryBenchmarkSource: 'GB/T 铜材大拉/中拉能耗先进标杆 (320.0)',
    groupAvg: 330.0,
    companies: [
      { companyId: 'll_main', companyName: '鲁缆本部 (拉丝车间)', value: 315.0, isOptimal: true, diffGroupPct: '-4.5%' },
      { companyId: 'xl_main', companyName: '新疆电缆有限公司', value: 330.0, isOptimal: false, diffGroupPct: '0.0%' },
      { companyId: 'dl_main', companyName: '德阳电缆股份有限公司', value: 345.0, isOptimal: false, diffGroupPct: '+4.5%' },
    ],
  },
  {
    id: 'proc-cb-02',
    industry: 'cable',
    industryName: '线缆产业',
    processName: '线缆-拉丝 (单位吨铝电耗)',
    unit: 'kWh/t (铝)',
    energyTypes: '电力',
    industryBenchmark: 185.0,
    industryBenchmarkSource: 'GB/T 铝材拉丝能效先进限值 (185.0)',
    groupAvg: 192.0,
    companies: [
      { companyId: 'll_main', companyName: '鲁缆本部 (铝拉丝工段)', value: 182.0, isOptimal: true, diffGroupPct: '-5.2%' },
      { companyId: 'xl_main', companyName: '新疆电缆有限公司', value: 191.0, isOptimal: false, diffGroupPct: '-0.5%' },
      { companyId: 'dl_main', companyName: '德阳电缆股份有限公司', value: 203.0, isOptimal: false, diffGroupPct: '+5.7%' },
    ],
  },
  {
    id: 'proc-cb-03',
    industry: 'cable',
    industryName: '线缆产业',
    processName: '线缆-高压-交联（干法立塔悬垂挤塑）',
    unit: 'kWh/km',
    energyTypes: '电力、氮气',
    industryBenchmark: 1150.0,
    industryBenchmarkSource: '超高压交联立塔行业先进标杆 (1,150.0)',
    groupAvg: 1202.0,
    companies: [
      { companyId: 'll_main', companyName: '鲁缆本部 (立塔交联车间)', value: 1160.0, isOptimal: true, diffGroupPct: '-3.5%' },
      { companyId: 'xl_main', companyName: '新疆电缆有限公司 (立塔部)', value: 1208.0, isOptimal: false, diffGroupPct: '+0.5%' },
      { companyId: 'dl_main', companyName: '德阳电缆股份有限公司', value: 1238.0, isOptimal: false, diffGroupPct: '+3.0%' },
    ],
  },
  {
    id: 'proc-cb-04',
    industry: 'cable',
    industryName: '线缆产业',
    processName: '线缆-中低压-交联（干法悬垂连续挤出）',
    unit: 'kWh/km',
    energyTypes: '电力、氮气',
    // 没有行业基准
    groupAvg: 485.0,
    companies: [
      { companyId: 'xl_sub', companyName: '新疆线缆厂', value: 468.0, isOptimal: true, diffGroupPct: '-3.5%' },
      { companyId: 'll_main', companyName: '鲁缆本部', value: 482.0, isOptimal: false, diffGroupPct: '-0.6%' },
      { companyId: 'dl_main', companyName: '德阳电缆股份有限公司', value: 505.0, isOptimal: false, diffGroupPct: '+4.1%' },
    ],
  },

  // ------------------ 3. 中低压开关产业 ------------------
  {
    id: 'proc-sw-01',
    industry: 'switch',
    industryName: '中低压开关',
    processName: '中低压开关柜-钣金加工 (数控冲剪折弯)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    // 没有行业基准
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
    processName: '中低压开关柜-钣金喷涂 (自动静电喷涂线)',
    unit: 'kWh/万元',
    energyTypes: '电力',
    // 没有行业基准
    groupAvg: 98.0,
    companies: [
      { companyId: 'hb_yj', companyName: '衡变云集电气 (静电喷涂线)', value: 92.0, isOptimal: true, diffGroupPct: '-6.1%' },
      { companyId: 'hb_xj', companyName: '衡变新疆自控 (涂装车间)', value: 104.0, isOptimal: false, diffGroupPct: '+6.1%' },
    ],
  },
]


// ============================================================================
// 基准管理 - 3 大基准分类标准库数据集
// 1. 关键工序行业基准  2. 国家零碳工厂3个核心指标基准  3. 集团管控基准与内控红线
// ============================================================================
export type BenchmarkStandardCategory = 'all' | 'process' | 'zero_carbon' | 'group_control'

export interface BenchmarkStandardItem {
  id: string
  category: 'process' | 'zero_carbon' | 'group_control'
  categoryName: string
  indicatorName: string
  scope: string
  benchmarkValue: number
  compareOperator: '<=' | '>='
  unit: string
  standardSource: string
  currentGroupAvg: number
  effectiveDate: string
  status: 'active' | 'pending'
  maintainer: string
  notes?: string
}

// ============================================================================
// 系统已有管控指标库字典 (供对标基准录入与维护时单选映射，实现与系统指标强对应)
// ============================================================================
export interface SystemControlMetricOption {
  id: string
  code: string
  name: string
  category: 'process' | 'zero_carbon' | 'group_control'
  categoryLabel: string
  scope: string
  unit: string
  defaultCompare: '<=' | '>='
  defaultBenchmark: number
  defaultSource: string
  groupAvg: number
}

export const SYSTEM_CONTROL_METRIC_OPTIONS: SystemControlMetricOption[] = [
  // 1. 关键工序单耗指标 (拉丝 / 干燥 / 交联 / 试验 / 固化 / 退火)
  {
    id: 'proc_draw_copper',
    code: 'KPI-PROC-01',
    name: '线缆-拉丝 (单位吨铜电耗)',
    category: 'process',
    categoryLabel: '关键工序行业基准',
    scope: '线缆产业 · 鲁缆本部 / 新疆电缆 / 德阳电缆拉丝车间',
    unit: 'kWh/t (铜)',
    defaultCompare: '<=',
    defaultBenchmark: 320.0,
    defaultSource: 'GB/T 3956 铜材拉丝能效先进限值',
    groupAvg: 330.0,
  },
  {
    id: 'proc_draw_aluminum',
    code: 'KPI-PROC-02',
    name: '线缆-拉丝 (单位吨铝电耗)',
    category: 'process',
    categoryLabel: '关键工序行业基准',
    scope: '线缆产业 · 铝线及铝合金连铸连轧拉丝工段',
    unit: 'kWh/t (铝)',
    defaultCompare: '<=',
    defaultBenchmark: 185.0,
    defaultSource: 'GB/T 3190 铝及铝合金加工能耗定额',
    groupAvg: 192.0,
  },
  {
    id: 'proc_crosslink_tower',
    code: 'KPI-PROC-03',
    name: '线缆-高压-交联 (干法立塔悬垂挤塑)',
    category: 'process',
    categoryLabel: '关键工序行业基准',
    scope: '线缆产业 · 500kV / 220kV / 110kV 超高压立塔交联',
    unit: 'kWh/km',
    defaultCompare: '<=',
    defaultBenchmark: 1150.0,
    defaultSource: '超高压交联立塔挤塑行业能效先进标杆',
    groupAvg: 1202.0,
  },
  {
    id: 'proc_dry_steam',
    code: 'KPI-PROC-04',
    name: '变压器-高压-干燥 (煤油气相真空干燥)',
    category: 'process',
    categoryLabel: '关键工序行业基准',
    scope: '变压器产业 · 沈变 / 衡变 / 新变超高压车间',
    unit: 'kWh/t',
    defaultCompare: '<=',
    defaultBenchmark: 48.0,
    defaultSource: 'GB/T 变压器气相真空干燥先进标杆',
    groupAvg: 51.8,
  },
  {
    id: 'proc_transformer_test',
    code: 'KPI-PROC-05',
    name: '变压器-试验 (绝缘耐压与全负荷温升试验)',
    category: 'process',
    categoryLabel: '关键工序行业基准',
    scope: '变压器产业 · 大型变压器高压试验大厅',
    unit: 'kWh/kVA',
    defaultCompare: '<=',
    defaultBenchmark: 0.022,
    defaultSource: '行业试验站节能先进限值',
    groupAvg: 0.024,
  },
  {
    id: 'proc_dry_epoxy',
    code: 'KPI-PROC-06',
    name: '变压器-中低压-干变-固化 (环氧树脂浇注固化)',
    category: 'process',
    categoryLabel: '关键工序行业基准',
    scope: '变压器产业 · 天变 / 智能电气 / 沈变干变车间',
    unit: 'kWh/台',
    defaultCompare: '<=',
    defaultBenchmark: 160.0,
    defaultSource: '干式变压器节能工艺指导规程',
    groupAvg: 165.0,
  },
  {
    id: 'proc_silicon_anneal',
    code: 'KPI-PROC-07',
    name: '变压器-铁心制造 (硅钢铁心横剪与叠装电耗)',
    category: 'process',
    categoryLabel: '关键工序行业基准',
    scope: '变压器核心部件 · 珠峰硅钢及各厂铁心制造车间',
    unit: 'kWh/t',
    defaultCompare: '<=',
    defaultBenchmark: 42.0,
    defaultSource: '变压器铁心制造节能工序指标',
    groupAvg: 44.5,
  },

  // 2. 国家零碳工厂 3 大核心指标
  {
    id: 'zc_carbon_intensity',
    code: 'KPI-ZC-01',
    name: '国家零碳工厂门槛：单位能耗碳排放',
    category: 'zero_carbon',
    categoryLabel: '国家零碳工厂3大指标',
    scope: '全集团 15 个零碳园区 / 21 家直属工厂',
    unit: 'tCO₂/tce',
    defaultCompare: '<=',
    defaultBenchmark: 1.80,
    defaultSource: 'T/CECA-G 0154-2022 零碳工厂评价通则',
    groupAvg: 1.62,
  },
  {
    id: 'zc_non_fossil',
    code: 'KPI-ZC-02',
    name: '国家零碳工厂门槛：非化石能源消费占比',
    category: 'zero_carbon',
    categoryLabel: '国家零碳工厂3大指标',
    scope: '全集团各直属园区与制造工厂',
    unit: '%',
    defaultCompare: '>=',
    defaultBenchmark: 35.0,
    defaultSource: '工信部工业绿色低碳与零碳工厂国家标准',
    groupAvg: 41.5,
  },
  {
    id: 'zc_physical_green',
    code: 'KPI-ZC-03',
    name: '国家零碳工厂门槛：非化石电力物理认定电量占比',
    category: 'zero_carbon',
    categoryLabel: '国家零碳工厂3大指标',
    scope: '全集团园区分布式光伏与物理直供绿电',
    unit: '%',
    defaultCompare: '>=',
    defaultBenchmark: 30.0,
    defaultSource: '国家发改委/能源局绿电消费认证导则',
    groupAvg: 38.6,
  },

  // 3. 集团管控基准与内控红线
  {
    id: 'gc_output_tce',
    code: 'KPI-GC-01',
    name: '万元产值综合能耗 (集团红线)',
    category: 'group_control',
    categoryLabel: '集团管控基准',
    scope: '全集团 6 大直属经营单位及各项目公司',
    unit: 'tce/万元',
    defaultCompare: '<=',
    defaultBenchmark: 0.088,
    defaultSource: '集团“十四五”双碳行动规划下达指标',
    groupAvg: 0.087,
  },
  {
    id: 'gc_output_elec',
    code: 'KPI-GC-02',
    name: '万元产值外购市电单耗',
    category: 'group_control',
    categoryLabel: '集团管控基准',
    scope: '全集团直属制造企业',
    unit: 'kWh/万元',
    defaultCompare: '<=',
    defaultBenchmark: 350.0,
    defaultSource: '集团年度能源预算管控指标',
    groupAvg: 312.0,
  },
  {
    id: 'gc_added_value_tce',
    code: 'KPI-GC-03',
    name: '单位工业增加值综合能耗 (红线考核)',
    category: 'group_control',
    categoryLabel: '集团管控基准',
    scope: '全集团直属制造企业',
    unit: 'tce/万元',
    defaultCompare: '<=',
    defaultBenchmark: 0.220,
    defaultSource: '自治区重点用能单位“十四五”目标责任考核',
    groupAvg: 0.218,
  },
  {
    id: 'gc_prod_tx_500kv',
    code: 'KPI-GC-04',
    name: 'ODFS-334MVA/500kV 单相自耦变压器台综合单耗',
    category: 'group_control',
    categoryLabel: '集团管控基准',
    scope: '变压器产业特高压制造 (衡变 / 沈变 / 新变)',
    unit: 'tce/台',
    defaultCompare: '<=',
    defaultBenchmark: 14.50,
    defaultSource: '特变电工变压器产品能效内控标杆',
    groupAvg: 13.82,
  },
  {
    id: 'gc_prod_cb_110kv',
    code: 'KPI-GC-05',
    name: '110kV 交联聚乙烯电缆公里综合单耗',
    category: 'group_control',
    categoryLabel: '集团管控基准',
    scope: '线缆产业超高压交联 (鲁缆 / 新缆 / 德缆)',
    unit: 'tce/km',
    defaultCompare: '<=',
    defaultBenchmark: 0.600,
    defaultSource: '特变电工线缆产品能耗内控基准',
    groupAvg: 0.582,
  },
  {
    id: 'gc_water_output',
    code: 'KPI-GC-06',
    name: '万元产值工业新鲜水耗',
    category: 'group_control',
    categoryLabel: '集团管控基准',
    scope: '全集团直属制造企业 (ESG 节水核算)',
    unit: 'm³/万元',
    defaultCompare: '<=',
    defaultBenchmark: 0.50,
    defaultSource: '国家节水型企业标准评价导则 (GB/T 7119)',
    groupAvg: 0.42,
  },
]

const BENCHMARK_STANDARDS_DATA: BenchmarkStandardItem[] = [
  // ------------------ 1. 关键工序行业基准 ------------------
  {
    id: 'std-proc-01',
    category: 'process',
    categoryName: '关键工序行业基准',
    indicatorName: '线缆-拉丝 (单位吨铜电耗)',
    scope: '线缆产业 · 鲁缆本部 / 新疆电缆 / 德阳电缆拉丝车间',
    benchmarkValue: 320.0,
    compareOperator: '<=',
    unit: 'kWh/t (铜)',
    standardSource: 'GB/T 3956 铜材拉丝能效先进限值',
    currentGroupAvg: 330.0,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团科技质量部',
    notes: '优于 320 kWh/t 评定为行业领跑水平',
  },
  {
    id: 'std-proc-02',
    category: 'process',
    categoryName: '关键工序行业基准',
    indicatorName: '线缆-拉丝 (单位吨铝电耗)',
    scope: '线缆产业 · 铝线及铝合金连铸连轧拉丝工段',
    benchmarkValue: 185.0,
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
    categoryName: '关键工序行业基准',
    indicatorName: '线缆-高压-交联（干法立塔悬垂挤塑）',
    scope: '线缆产业 · 500kV / 220kV / 110kV 超高压立塔交联',
    benchmarkValue: 1150.0,
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
    categoryName: '关键工序行业基准',
    indicatorName: '变压器-高压-干燥 (煤油气相真空干燥)',
    scope: '变压器产业 · 沈变 / 衡变 / 新变超高压车间',
    benchmarkValue: 48.0,
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
    categoryName: '关键工序行业基准',
    indicatorName: '变压器-试验 (绝缘耐压与全负荷温升)',
    scope: '变压器产业 · 各直属基地高电压试验大厅',
    benchmarkValue: 0.022,
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
    categoryName: '关键工序行业基准',
    indicatorName: '硅钢铁心-纵剪 / 叠装工段',
    scope: '变压器产业 · 珠峰硅钢 / 沈变铁芯 / 衡变铁芯',
    benchmarkValue: 16.8,
    compareOperator: '<=',
    unit: 'kWh/t',
    standardSource: 'GB/T 硅钢铁芯加工能耗先进定额',
    currentGroupAvg: 17.8,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '新变厂技术部',
  },

  // ------------------ 2. 国家零碳工厂 3 个核心指标基准 ------------------
  {
    id: 'std-zc-01',
    category: 'zero_carbon',
    categoryName: '国家零碳工厂3大指标',
    indicatorName: '单位能耗碳排放 (carbon_per_tce)',
    scope: '全集团 15 个零碳园区 & 21 家直属项目公司',
    benchmarkValue: 1.80,
    compareOperator: '<=',
    unit: 'tCO₂/tce',
    standardSource: '《零碳工厂评价通则》(GB/T 43126) 强制门槛',
    currentGroupAvg: 1.62,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团双碳推进办公室',
    notes: '达标零碳工厂认证的第 1 刚性红线，必须 ≤ 1.80 tCO₂/tce',
  },
  {
    id: 'std-zc-02',
    category: 'zero_carbon',
    categoryName: '国家零碳工厂3大指标',
    indicatorName: '非化石能源消费占比 (non_fossil_ratio)',
    scope: '全集团 15 个零碳园区 & 21 家直属项目公司',
    benchmarkValue: 35.0,
    compareOperator: '>=',
    unit: '%',
    standardSource: '《零碳工厂评价通则》(GB/T 43126) 强制门槛',
    currentGroupAvg: 41.5,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团双碳推进办公室',
    notes: '绿电、屋顶光伏及生物质等非化石能源占比必须 ≥ 35%',
  },
  {
    id: 'std-zc-03',
    category: 'zero_carbon',
    categoryName: '国家零碳工厂3大指标',
    indicatorName: '非化石电力物理认定量占比 (physical_green_ratio)',
    scope: '全集团 15 个零碳园区 & 21 家直属项目公司',
    benchmarkValue: 30.0,
    compareOperator: '>=',
    unit: '%',
    standardSource: '国家零碳工厂星级评价引导标准 (T/CECA-G 0171)',
    currentGroupAvg: 38.6,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团双碳推进办公室',
    notes: '物理专线绿电直供与自发自用认定量必须 ≥ 30%',
  },

  // ------------------ 3. 集团管控基准与内控红线 ------------------
  {
    id: 'std-gc-01',
    category: 'group_control',
    categoryName: '集团管控基准',
    indicatorName: '单位产值综合能耗考核红线 (变压器产业)',
    scope: '变压器产业 · 沈变 / 衡变 / 新变各级核算主体',
    benchmarkValue: 0.0880,
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
    id: 'std-gc-02',
    category: 'group_control',
    categoryName: '集团管控基准',
    indicatorName: '单位产值综合能耗考核红线 (线缆产业)',
    scope: '线缆产业 · 鲁缆 / 新缆 / 德缆各级核算主体',
    benchmarkValue: 0.0920,
    compareOperator: '<=',
    unit: 'tce/万元',
    standardSource: '特变电工电装集团2026年度能耗双控考核红线',
    currentGroupAvg: 0.0898,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团战略运营管理部',
  },
  {
    id: 'std-gc-03',
    category: 'group_control',
    categoryName: '集团管控基准',
    indicatorName: '单位工业增加值综合能耗考核限额',
    scope: '全集团 21 家直属项目公司',
    benchmarkValue: 0.2250,
    compareOperator: '<=',
    unit: 'tce/万元',
    standardSource: '特变电工“十五五”绿色低碳转型目标纲要',
    currentGroupAvg: 0.2180,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团规划财务部',
  },
  {
    id: 'std-gc-04',
    category: 'group_control',
    categoryName: '集团管控基准',
    indicatorName: 'ODFS-334MVA/500kV 自耦变历史最优单耗标杆',
    scope: '超高压变压器装配产线 (衡变保持纪录)',
    benchmarkValue: 13.82,
    compareOperator: '<=',
    unit: 'tce/台',
    standardSource: '特变电工历史最优制造实测纪录库 (2026-06)',
    currentGroupAvg: 14.25,
    effectiveDate: '2026-06-30',
    status: 'active',
    maintainer: '集团科技管理部',
  },
  {
    id: 'std-gc-05',
    category: 'group_control',
    categoryName: '集团管控基准',
    indicatorName: '110kV 交联电力电缆历史最优单耗标杆',
    scope: '高压交联立塔挤塑产线 (鲁缆保持纪录)',
    benchmarkValue: 0.582,
    compareOperator: '<=',
    unit: 'tce/km',
    standardSource: '特变电工历史最优制造实测纪录库 (2026-07)',
    currentGroupAvg: 0.605,
    effectiveDate: '2026-07-31',
    status: 'active',
    maintainer: '集团科技管理部',
  },
  {
    id: 'std-gc-06',
    category: 'group_control',
    categoryName: '集团管控基准',
    indicatorName: '园区清洁绿电消纳目标占比',
    scope: '全集团 15 个零碳产业园区',
    benchmarkValue: 45.0,
    compareOperator: '>=',
    unit: '%',
    standardSource: '电装集团2026年度新能源与绿电消纳考核行动方案',
    currentGroupAvg: 41.5,
    effectiveDate: '2026-01-01',
    status: 'active',
    maintainer: '集团双碳推进办公室',
  },
]

export default function BenchmarkManagementPage() {
  // 当前主 Tab
  const [activeTab, setActiveTab] = useState<BenchmarkTabKey>('horizontal')

  // 零碳工厂当前选中的对比指标
  const [activeZeroCarbonMetric, setActiveZeroCarbonMetric] = useState<ZeroCarbonMetricType>('carbon_per_tce')

  // 同型号产品项目公司横向对比状态
  const [productIndustryFilter, setProductIndustryFilter] = useState<'transformer' | 'cable'>('transformer')
  const [productSearchKeyword, setProductSearchKeyword] = useState('')
  const [selectedProductModelId, setSelectedProductModelId] = useState<string>('tx-01')

  // 产品单耗对比（纵向）状态：产品大类、四级级联选择、双周期对比
  const [verticalIndustry, setVerticalIndustry] = useState<'transformer' | 'cable'>('transformer')
  const [verticalCompanyId, setVerticalCompanyId] = useState<string>('hb')
  const [verticalLineId, setVerticalLineId] = useState<string>('hb-line-1')
  const [verticalCategoryId, setVerticalCategoryId] = useState<string>('hb-cat-1')
  const [verticalModelId, setVerticalModelId] = useState<string>('hb-m-1')

  // 关键工序单耗对比状态：选择产业 (变压器/线缆/中低压开关)、选择关键工序、对比时间 (月度/季度/年度)
  const [processIndustry, setProcessIndustry] = useState<'transformer' | 'cable' | 'switch'>('transformer')
  const [selectedProcessId, setSelectedProcessId] = useState<string>('proc-tx-01')
  const [processTimeDim, setProcessTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [processMonth, setProcessMonth] = useState('2026-08')
  const [processQuarter, setProcessQuarter] = useState('2026-Q3')
  const [processYear, setProcessYear] = useState('2026')

  // 双周期对比状态：基准周期 (几月到几月) vs 对比周期 (几月到几月)
  const [basePeriodRange, setBasePeriodRange] = useState({ start: '2025-01', end: '2025-08' })
  const [comparePeriodRange, setComparePeriodRange] = useState({ start: '2026-01', end: '2026-08' })
  const [periodPresetMode, setPeriodPresetMode] = useState<'yoy' | 'mom' | 'custom'>('yoy')

  // 时间维度 (与用能结构/成本页面完全一致)
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  // 基准管理状态：分类筛选、搜索关键词、基准数据列表、弹窗维护
  const [standardCategoryFilter, setStandardCategoryFilter] = useState<BenchmarkStandardCategory>('all')
  const [standardSearchKeyword, setStandardSearchKeyword] = useState('')
  const [standardsList, setStandardsList] = useState<BenchmarkStandardItem[]>(BENCHMARK_STANDARDS_DATA)

  // 弹窗状态
  const [showAddStandardModal, setShowAddStandardModal] = useState(false)
  const [newStandardForm, setNewStandardForm] = useState({
    category: 'process' as 'process' | 'zero_carbon' | 'group_control',
    indicatorName: '',
    scope: '',
    benchmarkValue: '',
    compareOperator: '<=' as '<=' | '>=',
    unit: 'kWh/t',
    standardSource: '',
    currentGroupAvg: '',
    effectiveDate: '2026-09-01',
    maintainer: '集团双碳办公室',
  })

  // 🌟 纵向对比当前选中的能源介质单耗 ('tce' | 'elec' | 'steam' | 'gas' | 'water')
  const [verticalMetricKey, setVerticalMetricKey] = useState<'tce' | 'elec' | 'steam' | 'gas' | 'water'>('tce')
  const [isVerticalQuerying, setIsVerticalQuerying] = useState(false)

  // 当前激活指标元信息
  const currentMetricMeta = ZERO_CARBON_METRICS_META[activeZeroCarbonMetric]

  // 过滤后的同型号产品对比列表
  const filteredProductBenchmarks = useMemo(() => {
    return CROSS_COMPANY_PRODUCT_BENCHMARKS.filter((p) => {
      const matchIndustry = p.industry === productIndustryFilter
      if (!matchIndustry) return false
      if (!productSearchKeyword.trim()) return true
      const kw = productSearchKeyword.trim().toLowerCase()
      return (
        p.categoryName.toLowerCase().includes(kw) ||
        p.model.toLowerCase().includes(kw) ||
        p.companies.some((c) => c.companyName.toLowerCase().includes(kw))
      )
    })
  }, [productIndustryFilter, productSearchKeyword])

  // 当前选中用于图表 PK 的产品 (确保产业切换时图表数据100%同步切换)
  const activeSelectedProduct = useMemo(() => {
    const currentIndustryProducts = CROSS_COMPANY_PRODUCT_BENCHMARKS.filter(
      (p) => p.industry === productIndustryFilter
    )
    const found = currentIndustryProducts.find((p) => p.id === selectedProductModelId)
    return found || currentIndustryProducts[0] || CROSS_COMPANY_PRODUCT_BENCHMARKS[0]
  }, [selectedProductModelId, productIndustryFilter])

  // 过滤后的基准列表
  const filteredStandards = useMemo(() => {
    return standardsList.filter((item) => {
      const matchCat = standardCategoryFilter === 'all' || item.category === standardCategoryFilter
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

  // 关键工序当前产业工序列表
  const currentIndustryProcessList = useMemo(() => {
    return SHARED_PROCESS_BENCHMARKS.filter((p) => p.industry === processIndustry)
  }, [processIndustry])

  // 当前选中的关键工序对象
  const currentSelectedProcess = useMemo(() => {
    const found = currentIndustryProcessList.find((p) => p.id === selectedProcessId)
    return found || currentIndustryProcessList[0] || SHARED_PROCESS_BENCHMARKS[0]
  }, [currentIndustryProcessList, selectedProcessId])

  // 纵向当前产业数据源
  const currentCascadeData = verticalIndustry === 'transformer' ? TRANSFORMER_CASCADE_DATA : CABLE_CASCADE_DATA

  // 当前选中单位
  const currentSelectedCompany = useMemo(() => {
    return currentCascadeData.find((c) => c.id === verticalCompanyId) || currentCascadeData[0]
  }, [currentCascadeData, verticalCompanyId])

  // 当前选中产线
  const currentSelectedLine = useMemo(() => {
    return currentSelectedCompany.lines.find((l) => l.id === verticalLineId) || currentSelectedCompany.lines[0]
  }, [currentSelectedCompany, verticalLineId])

  // 当前选中产品种类
  const currentSelectedCategory = useMemo(() => {
    return currentSelectedLine.categories.find((cat) => cat.id === verticalCategoryId) || currentSelectedLine.categories[0]
  }, [currentSelectedLine, verticalCategoryId])

  // 当前选中产品型号
  const currentSelectedModel = useMemo(() => {
    return currentSelectedCategory.models.find((m) => m.id === verticalModelId) || currentSelectedCategory.models[0]
  }, [currentSelectedCategory, verticalModelId])

  // 快捷切换对比预设
  const handleSetPeriodPreset = (mode: 'yoy' | 'mom' | 'custom') => {
    setPeriodPresetMode(mode)
    if (mode === 'yoy') {
      setBasePeriodRange({ start: '2025-01', end: '2025-08' })
      setComparePeriodRange({ start: '2026-01', end: '2026-08' })
    } else if (mode === 'mom') {
      setBasePeriodRange({ start: '2025-09', end: '2025-12' })
      setComparePeriodRange({ start: '2026-01', end: '2026-04' })
    }
  }

  // 纵向 8 个月时序明细对比数据 (基准周期 vs 对比周期对应月份)
  const verticalMonthlyComparisonList = useMemo(() => {
    const months = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月']
    const m = currentSelectedModel

    return months.map((month, idx) => {
      // 模拟月份波动
      const wave = (idx - 3.5) * 0.008
      const baseMonthTce = Number((m.baseTce * (1 + wave * 0.5)).toFixed(m.baseTce < 1 ? 3 : 2))
      const currMonthTce = Number((m.currTce * (1 - idx * 0.006)).toFixed(m.currTce < 1 ? 3 : 2))
      const tceDiffPct = (((currMonthTce - baseMonthTce) / baseMonthTce) * 100).toFixed(1)

      const baseElec = Math.round(m.baseElec * (1 + wave * 0.6))
      const currElec = Math.round(m.currElec * (1 - idx * 0.006))
      const elecDiffPct = (((currElec - baseElec) / baseElec) * 100).toFixed(1)

      const baseSteam = m.baseSteam !== undefined ? Number((m.baseSteam * (1 + wave * 0.3)).toFixed(1)) : undefined
      const currSteam = m.currSteam !== undefined ? Number((m.currSteam * (1 - idx * 0.005)).toFixed(1)) : undefined
      const steamDiffPct = baseSteam && currSteam ? (((currSteam - baseSteam) / baseSteam) * 100).toFixed(1) : undefined

      const baseGas = Number((m.baseGas * (1 + wave * 0.4)).toFixed(1))
      const currGas = Number((m.currGas * (1 - idx * 0.005)).toFixed(1))
      const gasDiffPct = (((currGas - baseGas) / baseGas) * 100).toFixed(1)

      const baseWater = Number((m.baseWater * (1 + wave * 0.2)).toFixed(1))
      const currWater = Number((m.currWater * (1 - idx * 0.004)).toFixed(1))
      const waterDiffPct = (((currWater - baseWater) / baseWater) * 100).toFixed(1)

      return {
        monthName: month,
        basePeriodLabel: `${basePeriodRange.start.slice(0, 4)}年${month}`,
        currPeriodLabel: `${comparePeriodRange.start.slice(0, 4)}年${month}`,
        baseTce: baseMonthTce,
        currTce: currMonthTce,
        tceDiffPct,
        baseElec,
        currElec,
        elecDiffPct,
        baseSteam,
        currSteam,
        steamDiffPct,
        baseGas,
        currGas,
        gasDiffPct,
        baseWater,
        currWater,
        waterDiffPct,
      }
    })
  }, [currentSelectedModel, basePeriodRange, comparePeriodRange])

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
      {/* 1. 顶部 Header 与 统一操作栏 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
            <BarChart3 className="size-5" />
          </div>
          <h1 className="text-base font-bold text-slate-800">对标管理</h1>
        </div>

        <button
          type="button"
          onClick={() => alert('已生成并导出全集团多维度能效对标分析简报 (Excel)...')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
        >
          <Download className="size-3.5" />
          <span>导出</span>
        </button>
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

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
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
      {/* TAB 2: 产品单耗对比（横向） - 同型号产品项目公司对比 (表格化展示，不含工序能耗) */}
      {/* ========================================================================= */}
      {activeTab === 'product_horizontal' && (
        <div className="space-y-3.5">
          {/* 顶部控制面板：压缩为单行 (标题 + 产品大类筛选 + 模糊搜索框) */}
          <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* 左侧：标题 + 分割线 + 选择产品 (变压器 / 线缆) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-900">
                  同型号产品项目公司对比
                </h3>
              </div>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setProductIndustryFilter('transformer')
                    setSelectedProductModelId('tx-01')
                  }}
                  className={cn(
                    'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none flex items-center gap-1',
                    productIndustryFilter === 'transformer'
                      ? 'font-bold bg-white text-[#1677ff] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <span>⚡ 变压器</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProductIndustryFilter('cable')
                    setSelectedProductModelId('cb-01')
                  }}
                  className={cn(
                    'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none flex items-center gap-1',
                    productIndustryFilter === 'cable'
                      ? 'font-bold bg-white text-[#1677ff] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <span>🔌 线缆</span>
                </button>
              </div>
            </div>

            {/* 右侧：搜索框 (按产品种类/型号模糊查询) */}
            <div className="relative">
              <input
                type="text"
                placeholder="按产品种类/型号模糊查询..."
                value={productSearchKeyword}
                onChange={(e) => setProductSearchKeyword(e.target.value)}
                className="pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#1677ff] focus:bg-white w-60 transition-colors"
              />
              <Search className="size-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
              {productSearchKeyword && (
                <button
                  type="button"
                  onClick={() => setProductSearchKeyword('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 重点型号可视化对标走势图 (按选定型号展现项目公司 PK 柱图 - 紧凑高度设计) */}
          {activeSelectedProduct && (
            <div className="bg-white p-3 px-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs font-sans">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#1677ff]" />
                    <span className="font-bold text-slate-900">
                      同型号产品单耗对比
                    </span>
                  </div>

                  {/* 🌟 紧凑产品型号标识直接置于 Header 中 */}
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/80 border border-blue-200 text-xs font-mono">
                    <span className="text-slate-500 font-sans text-[11px] font-bold">当前型号:</span>
                    <span className="text-[#1677ff] font-bold">{activeSelectedProduct.model}</span>
                    <span className="text-slate-400 font-sans text-[10.5px]">({activeSelectedProduct.categoryName})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-[#1677ff] font-bold">
                    <span className="size-2 rounded-full bg-[#1677ff]" /> 综合产品单耗 (tce/{activeSelectedProduct.unit})
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="size-2 rounded-full bg-emerald-500" /> 集团最优标杆
                  </span>
                </div>
              </div>

              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activeSelectedProduct.companies.map((c) => ({
                      name: c.companyName,
                      tce: c.tce,
                      elecKWh: c.elecKWh,
                      isOptimal: c.isOptimal,
                      diff: c.diffPercent,
                    }))}
                    margin={{ top: 15, right: 25, left: 10, bottom: 15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#334155' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                    <Tooltip
                      formatter={(value: any, name: any, item: any) => [
                        `${value} tce/${activeSelectedProduct.unit} (${item?.payload?.isOptimal ? '🏆 集团最优' : item?.payload?.diff})`,
                        '综合单耗'
                      ]}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="tce" name="综合单耗 (tce)" fill="#1677ff" radius={[3, 3, 0, 0]} maxBarSize={28}>
                      {activeSelectedProduct.companies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isOptimal ? '#10b981' : '#1677ff'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 表格方式展示对比数据：产品种类、产品型号、每家公司的(产品单耗tce、电单耗、蒸汽单耗、天然气单耗、水单耗)，不显示工序能耗 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-800">
                  同型号产品项目公司单耗对比明细表
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                共匹配 <strong className="text-slate-800">{filteredProductBenchmarks.length}</strong> 款同型产品对标组
              </span>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold font-sans">
                    <th className="py-2.5 px-3">产品种类</th>
                    <th className="py-2.5 px-3">产品型号</th>
                    <th className="py-2.5 px-3">对比制造工厂 / 项目公司</th>
                    <th className="py-2.5 px-3 text-right">综合单耗 (tce)</th>
                    <th className="py-2.5 px-3 text-right text-blue-700">⚡ 电单耗 (kWh)</th>
                    <th className="py-2.5 px-3 text-right text-purple-700">💨 蒸汽单耗 (t)</th>
                    <th className="py-2.5 px-3 text-right text-amber-700">🔥 天然气单耗 (m³)</th>
                    <th className="py-2.5 px-3 text-right text-cyan-700">💧 水单耗 (t)</th>
                    <th className="py-2.5 px-3 text-center font-sans">快捷图表</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredProductBenchmarks.map((productGroup) => {
                    return productGroup.companies.map((company, cIdx) => {
                      const isFirstRow = cIdx === 0
                      const rowSpan = productGroup.companies.length
                      const isSelectedProduct = selectedProductModelId === productGroup.id

                      return (
                        <tr
                          key={`${productGroup.id}-${company.companyId}`}
                          className={cn(
                            'hover:bg-blue-50/40 transition-colors',
                            isSelectedProduct && 'bg-blue-50/20'
                          )}
                        >
                          {/* 产品种类 (合并单元格，垂直居中) */}
                          {isFirstRow && (
                            <td
                              rowSpan={rowSpan}
                              className="py-2.5 px-3 font-sans font-bold text-slate-800 border-r border-slate-100 bg-white align-middle"
                            >
                              <div className="space-y-1">
                                <span className={cn(
                                  'inline-block text-[10.5px] px-2 py-0.5 rounded font-mono font-bold',
                                  productGroup.industry === 'transformer'
                                    ? 'bg-blue-50 text-[#1677ff] border border-blue-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                )}>
                                  {productGroup.industryName}
                                </span>
                                <div className="text-xs font-semibold text-slate-700">
                                  {productGroup.categoryName}
                                </div>
                              </div>
                            </td>
                          )}

                          {/* 产品型号 (合并单元格，垂直居中) */}
                          {isFirstRow && (
                            <td
                              rowSpan={rowSpan}
                              className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-100 bg-white align-middle"
                            >
                              <div className="space-y-1">
                                <div>{productGroup.model}</div>
                                <div className="text-[11px] text-slate-400 font-normal">
                                  计量基准：每 {productGroup.unit} 产品
                                </div>
                              </div>
                            </td>
                          )}

                          {/* 项目公司 */}
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">
                            <div className="flex items-center gap-1.5">
                              <span className={cn('size-1.5 rounded-full', company.isOptimal ? 'bg-emerald-500' : 'bg-slate-400')} />
                              <span>{company.companyName}</span>
                            </div>
                          </td>

                          {/* 综合单耗 (tce) */}
                          <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                            {company.tce.toFixed(company.tce < 1 ? 3 : 2)} <span className="text-[10px] font-normal text-slate-400 font-sans">tce/{productGroup.unit}</span>
                          </td>

                          {/* ⚡ 电单耗 */}
                          <td className="py-2.5 px-3 text-right text-blue-700 font-bold">
                            {company.elecKWh.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 font-sans">kWh</span>
                          </td>

                          {/* 💨 蒸汽单耗 */}
                          <td className="py-2.5 px-3 text-right text-purple-700 font-bold">
                            {company.steamTon !== undefined ? (
                              <span>{company.steamTon.toFixed(1)} <span className="text-[10px] font-normal text-slate-400 font-sans">t</span></span>
                            ) : (
                              <span className="text-slate-300 font-normal font-sans">—</span>
                            )}
                          </td>

                          {/* 🔥 天然气单耗 */}
                          <td className="py-2.5 px-3 text-right text-amber-700 font-bold">
                            {company.gasM3 !== undefined ? (
                              <span>{company.gasM3.toFixed(1)} <span className="text-[10px] font-normal text-slate-400 font-sans">m³</span></span>
                            ) : (
                              <span className="text-slate-300 font-normal font-sans">—</span>
                            )}
                          </td>

                          {/* 💧 水单耗 */}
                          <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">
                            {company.waterTon !== undefined ? (
                              <span>{company.waterTon.toFixed(1)} <span className="text-[10px] font-normal text-slate-400 font-sans">t</span></span>
                            ) : (
                              <span className="text-slate-300 font-normal font-sans">—</span>
                            )}
                          </td>

                          {/* 快捷图表联动 */}
                          {isFirstRow && (
                            <td
                              rowSpan={rowSpan}
                              className="py-2.5 px-3 text-center font-sans border-l border-slate-100 bg-white align-middle"
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedProductModelId(productGroup.id)}
                                className={cn(
                                  'px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer',
                                  isSelectedProduct
                                    ? 'bg-[#1677ff] text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                )}
                              >
                                {isSelectedProduct ? '当前图表' : '图表对标'}
                              </button>
                            </td>
                          )}
                        </tr>
                      )
                    })
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 产品单耗对比（纵向） - 单位-产线-产品种类-型号 & 双周期对比 */}
      {/* ========================================================================= */}
      {activeTab === 'product_vertical' && (
        <div className="space-y-3.5">
          {/* 1. 顶部控制面板：四级联动选择器 (选择产品 -> 选择单位 -> 产线 -> 种类 -> 型号) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-900">
                  产品单耗时序纵向对比与能效演进分析
                </h3>
              </div>
            </div>

            {/* 核心筛选栏：选择产品大类 + 四级联动选择器 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* ① 选择产品大类 */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">1. 选择产品大类：</label>
                <select
                  value={verticalIndustry}
                  onChange={(e) => {
                    const ind = e.target.value as 'transformer' | 'cable'
                    setVerticalIndustry(ind)
                    if (ind === 'transformer') {
                      setVerticalCompanyId('hb')
                      setVerticalLineId('hb-line-1')
                      setVerticalCategoryId('hb-cat-1')
                      setVerticalModelId('hb-m-1')
                    } else {
                      setVerticalCompanyId('ll')
                      setVerticalLineId('ll-line-1')
                      setVerticalCategoryId('ll-cat-1')
                      setVerticalModelId('ll-m-1')
                    }
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 text-xs focus:outline-none focus:border-[#1677ff] focus:bg-white cursor-pointer"
                >
                  <option value="transformer">变压器</option>
                  <option value="cable">线缆</option>
                </select>
              </div>

              {/* ② 选择单位 */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">2. 选择制造单位：</label>
                <select
                  value={verticalCompanyId}
                  onChange={(e) => {
                    const compId = e.target.value
                    setVerticalCompanyId(compId)
                    const comp = currentCascadeData.find((c) => c.id === compId) || currentCascadeData[0]
                    const firstLine = comp.lines[0]
                    setVerticalLineId(firstLine.id)
                    const firstCat = firstLine.categories[0]
                    setVerticalCategoryId(firstCat.id)
                    setVerticalModelId(firstCat.models[0].id)
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 text-xs focus:outline-none focus:border-[#1677ff] focus:bg-white"
                >
                  {currentCascadeData.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* ③ 选择产品种类 */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">3. 选择产品种类：</label>
                <select
                  value={verticalCategoryId}
                  onChange={(e) => {
                    const catId = e.target.value
                    setVerticalCategoryId(catId)
                    const cat = currentSelectedLine.categories.find((c) => c.id === catId) || currentSelectedLine.categories[0]
                    setVerticalModelId(cat.models[0].id)
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 text-xs focus:outline-none focus:border-[#1677ff] focus:bg-white"
                >
                  {currentSelectedLine.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* ④ 选择产品型号 */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">4. 选择具体型号：</label>
                <select
                  value={verticalModelId}
                  onChange={(e) => setVerticalModelId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 text-xs focus:outline-none focus:border-[#1677ff] focus:bg-white"
                >
                  {currentSelectedCategory.models.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. 选择对比周期 (基准周期几月到几月 vs 对比周期几月到几月) */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#1677ff]" />
                  <span>设置对比周期：</span>
                </span>

                {/* 基准期 A */}
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs font-mono">
                  <span className="text-slate-400 font-sans text-[11px] font-bold">基准期：</span>
                  <input
                    type="month"
                    value={basePeriodRange.start}
                    onChange={(e) => setBasePeriodRange((prev) => ({ ...prev, start: e.target.value }))}
                    className="bg-transparent border-0 text-slate-700 text-xs focus:outline-none cursor-pointer"
                  />
                  <span className="text-slate-400 font-sans">至</span>
                  <input
                    type="month"
                    value={basePeriodRange.end}
                    onChange={(e) => setBasePeriodRange((prev) => ({ ...prev, end: e.target.value }))}
                    className="bg-transparent border-0 text-slate-700 text-xs focus:outline-none cursor-pointer"
                  />
                </div>

                <span className="text-slate-400 font-bold">VS</span>

                {/* 对比期 B */}
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs font-mono ring-1 ring-blue-100">
                  <span className="text-blue-600 font-sans text-[11px] font-bold">对比期：</span>
                  <input
                    type="month"
                    value={comparePeriodRange.start}
                    onChange={(e) => setComparePeriodRange((prev) => ({ ...prev, start: e.target.value }))}
                    className="bg-transparent border-0 text-slate-700 text-xs focus:outline-none cursor-pointer font-bold"
                  />
                  <span className="text-slate-400 font-sans">至</span>
                  <input
                    type="month"
                    value={comparePeriodRange.end}
                    onChange={(e) => setComparePeriodRange((prev) => ({ ...prev, end: e.target.value }))}
                    className="bg-transparent border-0 text-slate-700 text-xs focus:outline-none cursor-pointer font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsVerticalQuerying(true)
                    setTimeout(() => {
                      setIsVerticalQuerying(false)
                      alert(`已成功根据【基准期: ${basePeriodRange.start}~${basePeriodRange.end}】与【对比期: ${comparePeriodRange.start}~${comparePeriodRange.end}】完成【${currentSelectedCompany.name} - ${currentSelectedModel.name}】全介质能耗双套数据对比检索！`)
                    }, 400)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  <Search className={cn("size-3.5", isVerticalQuerying && "animate-spin")} />
                  <span>{isVerticalQuerying ? '正在检索两套数据...' : '执行纵向对比'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. 核心对比数据 KPI 看板：时间跨期、综合产品单耗、各类能源单耗 (点击直接切换图表对比介质) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
            {/* ① 综合产品单耗对比 */}
            <div
              onClick={() => setVerticalMetricKey('tce')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 cursor-pointer transition-all duration-150',
                verticalMetricKey === 'tce'
                  ? 'ring-2 ring-emerald-500 bg-emerald-50/50 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-sans block font-bold">📊 综合产品单耗</span>
                {verticalMetricKey === 'tce' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    图表已聚焦
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                (tce/{currentSelectedModel.unit})
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div className="text-lg font-extrabold text-slate-900">
                  {currentSelectedModel.currTce} <span className="text-xs font-normal text-slate-400 font-sans">当期</span>
                </div>
                <span className="text-xs text-slate-400">基准: {currentSelectedModel.baseTce}</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold font-sans pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>同比：</span>
                <span>{(((currentSelectedModel.currTce - currentSelectedModel.baseTce) / currentSelectedModel.baseTce) * 100).toFixed(1)}% ↓</span>
              </div>
            </div>

            {/* ② 电单耗对比 */}
            <div
              onClick={() => setVerticalMetricKey('elec')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 cursor-pointer transition-all duration-150',
                verticalMetricKey === 'elec'
                  ? 'ring-2 ring-blue-500 bg-blue-50/50 border-blue-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/20'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-sans block font-bold">⚡ 产品电单耗</span>
                {verticalMetricKey === 'elec' && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                    图表已聚焦
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                (kWh/{currentSelectedModel.unit})
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div className="text-lg font-extrabold text-[#1677ff]">
                  {currentSelectedModel.currElec.toLocaleString()}
                </div>
                <span className="text-xs text-slate-400">{currentSelectedModel.baseElec.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold font-sans pt-1 border-t border-blue-100 flex items-center justify-between">
                <span>同比：</span>
                <span>{(((currentSelectedModel.currElec - currentSelectedModel.baseElec) / currentSelectedModel.baseElec) * 100).toFixed(1)}% ↓</span>
              </div>
            </div>

            {/* ③ 蒸汽单耗对比 */}
            <div
              onClick={() => {
                if (currentSelectedModel.currSteam !== undefined) {
                  setVerticalMetricKey('steam')
                }
              }}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all duration-150',
                currentSelectedModel.currSteam !== undefined ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed',
                verticalMetricKey === 'steam'
                  ? 'ring-2 ring-purple-500 bg-purple-50/50 border-purple-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50/20'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-purple-800 font-sans block font-bold">💨 蒸汽单耗</span>
                {verticalMetricKey === 'steam' && (
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                    图表已聚焦
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                (t/{currentSelectedModel.unit})
              </div>
              {currentSelectedModel.currSteam !== undefined ? (
                <>
                  <div className="flex items-baseline justify-between pt-1">
                    <div className="text-lg font-extrabold text-purple-700">
                      {currentSelectedModel.currSteam.toFixed(1)} <span className="text-xs font-normal text-slate-400 font-sans">t</span>
                    </div>
                    <span className="text-xs text-slate-400">{currentSelectedModel.baseSteam?.toFixed(1)} t</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-bold font-sans pt-1 border-t border-purple-100 flex items-center justify-between">
                    <span>同比：</span>
                    <span>{currentSelectedModel.baseSteam && (((currentSelectedModel.currSteam - currentSelectedModel.baseSteam) / currentSelectedModel.baseSteam) * 100).toFixed(1)}% ↓</span>
                  </div>
                </>
              ) : (
                <div className="py-2 text-slate-400 text-center font-sans">该线缆型号无蒸汽消耗</div>
              )}
            </div>

            {/* ④ 天然气单耗对比 */}
            <div
              onClick={() => setVerticalMetricKey('gas')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 cursor-pointer transition-all duration-150',
                verticalMetricKey === 'gas'
                  ? 'ring-2 ring-amber-500 bg-amber-50/50 border-amber-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/20'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-sans block font-bold">🔥 天然气单耗</span>
                {verticalMetricKey === 'gas' && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                    图表已聚焦
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                (m³/{currentSelectedModel.unit})
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div className="text-lg font-extrabold text-amber-700">
                  {currentSelectedModel.currGas.toFixed(1)} <span className="text-xs font-normal text-slate-400 font-sans">m³</span>
                </div>
                <span className="text-xs text-slate-400">{currentSelectedModel.baseGas.toFixed(1)} m³</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold font-sans pt-1 border-t border-amber-100 flex items-center justify-between">
                <span>同比：</span>
                <span>{(((currentSelectedModel.currGas - currentSelectedModel.baseGas) / currentSelectedModel.baseGas) * 100).toFixed(1)}% ↓</span>
              </div>
            </div>

            {/* ⑤ 水单耗对比 */}
            <div
              onClick={() => setVerticalMetricKey('water')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 cursor-pointer transition-all duration-150',
                verticalMetricKey === 'water'
                  ? 'ring-2 ring-cyan-500 bg-cyan-50/50 border-cyan-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/20'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-cyan-800 font-sans block font-bold">💧 水单耗</span>
                {verticalMetricKey === 'water' && (
                  <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-1.5 py-0.5 rounded">
                    图表已聚焦
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                (t/{currentSelectedModel.unit})
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div className="text-lg font-extrabold text-cyan-700">
                  {currentSelectedModel.currWater.toFixed(1)} <span className="text-xs font-normal text-slate-400 font-sans">t</span>
                </div>
                <span className="text-xs text-slate-400">{currentSelectedModel.baseWater.toFixed(1)} t</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold font-sans pt-1 border-t border-cyan-100 flex items-center justify-between">
                <span>同比：</span>
                <span>{(((currentSelectedModel.currWater - currentSelectedModel.baseWater) / currentSelectedModel.baseWater) * 100).toFixed(1)}% ↓</span>
              </div>
            </div>
          </div>

          {/* 4. 双周期时序演进走势图 (对比基准期各月 vs 对比期各月两套数据动态对比) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 text-xs font-sans">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <span className="font-bold text-slate-900 text-sm">
                  双周期各月份【
                  {verticalMetricKey === 'tce'
                    ? `综合产品单耗 (tce/${currentSelectedModel.unit})`
                    : verticalMetricKey === 'elec'
                    ? `产品电单耗 (kWh/${currentSelectedModel.unit})`
                    : verticalMetricKey === 'steam'
                    ? `蒸汽单耗 (t/${currentSelectedModel.unit})`
                    : verticalMetricKey === 'gas'
                    ? `天然气单耗 (m³/${currentSelectedModel.unit})`
                    : `水单耗 (t/${currentSelectedModel.unit})`
                  }】对比呈现
                </span>
              </div>

              {/* 介质快捷切换药丸组件 */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { key: 'tce' as const, name: '综合单耗', icon: '📊' },
                  { key: 'elec' as const, name: '电单耗', icon: '⚡' },
                  { key: 'steam' as const, name: '蒸汽单耗', icon: '💨' },
                  { key: 'gas' as const, name: '天然气单耗', icon: '🔥' },
                  { key: 'water' as const, name: '水单耗', icon: '💧' },
                ].map((item) => {
                  if (item.key === 'steam' && currentSelectedModel.currSteam === undefined) return null
                  const isActive = verticalMetricKey === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setVerticalMetricKey(item.key)}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1',
                        isActive
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      )}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 图表副标题及图例 */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
              <span className="text-[11px] text-slate-400 font-sans">
                基准期 ({basePeriodRange.start} ~ {basePeriodRange.end}) VS 对比期 ({comparePeriodRange.start} ~ {comparePeriodRange.end})
              </span>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="size-2 rounded-full bg-slate-400" />
                  <span>基准期单耗 ({basePeriodRange.start.slice(0, 4)}年)</span>
                </span>
                <span className="flex items-center gap-1 text-slate-800 font-bold">
                  <span className={cn(
                    "size-2 rounded-full",
                    verticalMetricKey === 'tce' ? "bg-emerald-500" : verticalMetricKey === 'elec' ? "bg-[#1677ff]" : verticalMetricKey === 'steam' ? "bg-purple-500" : verticalMetricKey === 'gas' ? "bg-amber-500" : "bg-cyan-500"
                  )} />
                  <span>对比期单耗 ({comparePeriodRange.start.slice(0, 4)}年)</span>
                </span>
              </div>
            </div>

            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={verticalMonthlyComparisonList} margin={{ top: 15, right: 20, left: 10, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => {
                      const unitStr =
                        verticalMetricKey === 'tce'
                          ? `tce/${currentSelectedModel.unit}`
                          : verticalMetricKey === 'elec'
                          ? `kWh/${currentSelectedModel.unit}`
                          : verticalMetricKey === 'steam'
                          ? `t/${currentSelectedModel.unit}`
                          : verticalMetricKey === 'gas'
                          ? `m³/${currentSelectedModel.unit}`
                          : `t/${currentSelectedModel.unit}`
                      const diffPct =
                        verticalMetricKey === 'tce'
                          ? item?.payload?.tceDiffPct
                          : verticalMetricKey === 'elec'
                          ? item?.payload?.elecDiffPct
                          : verticalMetricKey === 'steam'
                          ? item?.payload?.steamDiffPct
                          : verticalMetricKey === 'gas'
                          ? item?.payload?.gasDiffPct
                          : item?.payload?.waterDiffPct
                      return [
                        `${value} ${unitStr} ${name.includes('对比期') && diffPct ? `(较基准期 ${diffPct}% ↓)` : ''}`,
                        name
                      ]
                    }}
                    labelFormatter={(label) => `统计月份: ${label} (${basePeriodRange.start.slice(0, 4)}年 vs ${comparePeriodRange.start.slice(0, 4)}年)`}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Bar
                    dataKey={
                      verticalMetricKey === 'tce'
                        ? 'baseTce'
                        : verticalMetricKey === 'elec'
                        ? 'baseElec'
                        : verticalMetricKey === 'steam'
                        ? 'baseSteam'
                        : verticalMetricKey === 'gas'
                        ? 'baseGas'
                        : 'baseWater'
                    }
                    name={`基准期单耗 (${basePeriodRange.start.slice(0, 4)}年)`}
                    fill="#94a3b8"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={26}
                  />
                  <Bar
                    dataKey={
                      verticalMetricKey === 'tce'
                        ? 'currTce'
                        : verticalMetricKey === 'elec'
                        ? 'currElec'
                        : verticalMetricKey === 'steam'
                        ? 'currSteam'
                        : verticalMetricKey === 'gas'
                        ? 'currGas'
                        : 'currWater'
                    }
                    name={`对比期单耗 (${comparePeriodRange.start.slice(0, 4)}年)`}
                    fill={
                      verticalMetricKey === 'tce'
                        ? '#10b981'
                        : verticalMetricKey === 'elec'
                        ? '#1677ff'
                        : verticalMetricKey === 'steam'
                        ? '#8b5cf6'
                        : verticalMetricKey === 'gas'
                        ? '#f59e0b'
                        : '#06b6d4'
                    }
                    radius={[3, 3, 0, 0]}
                    maxBarSize={26}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5. 对比数据明细大表：时间、产品单耗、各类能源单耗 (无工序拆解) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-800">
                  双周期各月份单耗与各能源介质明细对比台账
                </h3>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                基准期 ({basePeriodRange.start} ~ {basePeriodRange.end}) ⇄ 对比期 ({comparePeriodRange.start} ~ {comparePeriodRange.end})
              </div>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold font-sans">
                    <th className="py-2.5 px-3">统计时间 / 月份</th>
                    <th className="py-2.5 px-3 text-right">产品单耗(基准期)</th>
                    <th className="py-2.5 px-3 text-right">产品单耗(对比期)</th>
                    <th className="py-2.5 px-3 text-center">同比</th>
                    <th className="py-2.5 px-3 text-right text-blue-700">⚡ 电单耗(基准/对比)</th>
                    <th className="py-2.5 px-3 text-right text-purple-700">💨 蒸汽单耗(基准/对比)</th>
                    <th className="py-2.5 px-3 text-right text-amber-700">🔥 天然气单耗(基准/对比)</th>
                    <th className="py-2.5 px-3 text-right text-cyan-700">💧 水单耗(基准/对比)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {verticalMonthlyComparisonList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                      {/* 时间 */}
                      <td className="py-2.5 px-3 font-bold text-slate-900 font-sans">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900">{row.monthName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {row.basePeriodLabel} vs {row.currPeriodLabel}
                          </div>
                        </div>
                      </td>

                      {/* 基准期产品单耗 (tce) */}
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {row.baseTce} <span className="text-[10px] text-slate-400 font-sans">tce</span>
                      </td>

                      {/* 对比期产品单耗 (tce) */}
                      <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                        {row.currTce} <span className="text-[10px] text-slate-400 font-sans">tce</span>
                      </td>

                      {/* 综合变动率 */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-[11px] font-bold',
                          row.tceDiffPct.startsWith('-') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        )}>
                          {row.tceDiffPct}% {row.tceDiffPct.startsWith('-') ? '↓' : '↑'}
                        </span>
                      </td>

                      {/* ⚡ 电单耗 */}
                      <td className="py-2.5 px-3 text-right text-blue-700 font-bold">
                        <div>
                          <span>{row.currElec.toLocaleString()}</span>
                          <span className="text-slate-400 font-normal text-[10px] ml-1">({row.baseElec.toLocaleString()})</span>
                        </div>
                        <div className="text-[10px] text-emerald-600">{row.elecDiffPct}% ↓</div>
                      </td>

                      {/* 💨 蒸汽单耗 */}
                      <td className="py-2.5 px-3 text-right text-purple-700 font-bold">
                        {row.currSteam !== undefined && row.baseSteam !== undefined ? (
                          <div>
                            <div>{row.currSteam} <span className="text-slate-400 font-normal text-[10px]">({row.baseSteam}) t</span></div>
                            <div className="text-[10px] text-emerald-600">{row.steamDiffPct}% ↓</div>
                          </div>
                        ) : (
                          <span className="text-slate-300 font-normal font-sans">—</span>
                        )}
                      </td>

                      {/* 🔥 天然气单耗 */}
                      <td className="py-2.5 px-3 text-right text-amber-700 font-bold">
                        <div>
                          <div>{row.currGas} <span className="text-slate-400 font-normal text-[10px]">({row.baseGas}) m³</span></div>
                          <div className="text-[10px] text-emerald-600">{row.gasDiffPct}% ↓</div>
                        </div>
                      </td>

                      {/* 💧 水单耗 */}
                      <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">
                        <div>
                          <div>{row.currWater} <span className="text-slate-400 font-normal text-[10px]">({row.baseWater}) t</span></div>
                          <div className="text-[10px] text-emerald-600">{row.waterDiffPct}% ↓</div>
                        </div>
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
      {/* TAB 4: 关键工序单耗对比 (变压器 / 线缆 / 中低压开关 相同关键工序柱状图对比) */}
      {/* ========================================================================= */}
      {activeTab === 'process' && (
        <div className="space-y-3.5">
          {/* 1. 顶部控制面板：选择产业 -> 选择关键工序 -> 对比时间 (月度/季度/年度) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  相同关键工序跨项目公司单耗对标
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* ① 选择产业大类 (变压器 / 线缆 / 中低压开关) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">选择产业：</span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setProcessIndustry('transformer')
                      setSelectedProcessId('proc-tx-01')
                    }}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                      processIndustry === 'transformer'
                        ? 'font-bold bg-white text-[#1677ff] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    ⚡ 变压器
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProcessIndustry('cable')
                      setSelectedProcessId('proc-cb-01')
                    }}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                      processIndustry === 'cable'
                        ? 'font-bold bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    🔌 线缆
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProcessIndustry('switch')
                      setSelectedProcessId('proc-sw-01')
                    }}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                      processIndustry === 'switch'
                        ? 'font-bold bg-white text-purple-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    ⚙️ 中低压开关
                  </button>
                </div>
              </div>

              {/* ② 选择关键工序 */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-600">选择关键工序：</span>
                <select
                  value={selectedProcessId}
                  onChange={(e) => setSelectedProcessId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-800 text-xs focus:outline-none focus:border-[#1677ff] focus:bg-white min-w-[240px]"
                >
                  {currentIndustryProcessList.map((proc) => (
                    <option key={proc.id} value={proc.id}>
                      {proc.processName} ({proc.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* ③ 对比时间 (月度 / 季度 / 年度) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">对比时间：</span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => setProcessTimeDim('month')}
                    className={cn(
                      'px-2.5 py-0.5 rounded font-medium transition-all cursor-pointer',
                      processTimeDim === 'month' ? 'bg-white text-[#1677ff] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    月度
                  </button>
                  <button
                    type="button"
                    onClick={() => setProcessTimeDim('quarter')}
                    className={cn(
                      'px-2.5 py-0.5 rounded font-medium transition-all cursor-pointer',
                      processTimeDim === 'quarter' ? 'bg-white text-[#1677ff] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    季度
                  </button>
                  <button
                    type="button"
                    onClick={() => setProcessTimeDim('year')}
                    className={cn(
                      'px-2.5 py-0.5 rounded font-medium transition-all cursor-pointer',
                      processTimeDim === 'year' ? 'bg-white text-[#1677ff] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    年度
                  </button>
                </div>

                {/* 时间选择器 */}
                {processTimeDim === 'month' && (
                  <input
                    type="month"
                    value={processMonth}
                    onChange={(e) => setProcessMonth(e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 focus:outline-none cursor-pointer"
                  />
                )}
                {processTimeDim === 'quarter' && (
                  <select
                    value={processQuarter}
                    onChange={(e) => setProcessQuarter(e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="2026-Q1">2026年 Q1</option>
                    <option value="2026-Q2">2026年 Q2</option>
                    <option value="2026-Q3">2026年 Q3</option>
                    <option value="2026-Q4">2026年 Q4</option>
                  </select>
                )}
                {processTimeDim === 'year' && (
                  <select
                    value={processYear}
                    onChange={(e) => setProcessYear(e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="2026">2026 年度</option>
                    <option value="2025">2025 年度</option>
                  </select>
                )}

                <button
                  type="button"
                  onClick={() => alert(`正在导出【${currentSelectedProcess.processName}】工序单耗对比数据 (Excel)...`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer ml-1"
                >
                  <Download className="size-3.5" />
                  <span>导出</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. 核心柱状图：各项目公司单耗对比 (有行业基准的画行业基准线，没有的不画；都画上集团平均线) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2 text-xs font-sans">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <span className="font-bold text-slate-900">
                  关键工序单耗柱状对比 ({currentSelectedProcess.unit})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  [ 主要消耗能源：{currentSelectedProcess.energyTypes} ]
                </span>
              </div>

              {/* 图例说明：集团平均线 (都有) + 行业基准线 (有才有) */}
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="flex items-center gap-1 text-[#1677ff] font-bold">
                  <span className="size-2 rounded-full bg-[#1677ff]" /> 实测工序单耗
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <span className="size-2 rounded-full bg-emerald-500" /> 集团最优单位
                </span>
                {/* 集团平均线 (所有工序都画) */}
                <span className="flex items-center gap-1 text-blue-600 font-bold">
                  <span className="w-3 h-0.5 bg-blue-600" /> 电装集团平均线 ({currentSelectedProcess.groupAvg})
                </span>
                {/* 行业基准线 (有行业基准才画) */}
                {currentSelectedProcess.industryBenchmark !== undefined && (
                  <span className="flex items-center gap-1 text-purple-600 font-bold">
                    <span className="w-3 h-0.5 bg-purple-600" /> 行业先进基准线 ({currentSelectedProcess.industryBenchmark})
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#334155' }}
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
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      `${value} ${currentSelectedProcess.unit}`,
                      '工序实测单耗'
                    ]}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
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
                    fill="#1677ff"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  >
                    {currentSelectedProcess.companies.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isOptimal ? '#10b981' : '#1677ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. 关键工序单耗对比数据明细表 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-800">
                  关键工序单耗对比数据明细表
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                产业归属：{currentSelectedProcess.industryName} · 共涉及 {currentSelectedProcess.companies.length} 家项目公司
              </span>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold font-sans">
                    <th className="py-2.5 px-3">关键工序名称</th>
                    <th className="py-2.5 px-3">项目公司 / 制造车间</th>
                    <th className="py-2.5 px-3 text-right text-blue-700">实测单耗值 ({currentSelectedProcess.unit})</th>
                    <th className="py-2.5 px-3 text-right">集团平均线</th>
                    <th className="py-2.5 px-3 text-center">较集团平均偏差</th>
                    <th className="py-2.5 px-3 text-right text-purple-700">行业先进基准</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {currentSelectedProcess.companies.map((c, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                      {/* 1. 关键工序名称 (移动到最左侧并合并垂直居中显示) */}
                      {idx === 0 && (
                        <td
                          rowSpan={currentSelectedProcess.companies.length}
                          className="py-3 px-4 font-sans font-bold text-slate-900 bg-slate-50/60 border-r border-slate-200/80 align-middle text-left"
                        >
                          <div className="space-y-1.5">
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <Layers className="size-3.5 text-[#1677ff] shrink-0" />
                              <span>{currentSelectedProcess.processName}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              单位：{currentSelectedProcess.unit}
                            </div>
                          </div>
                        </td>
                      )}

                      {/* 2. 项目公司 / 制造车间 */}
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('size-1.5 rounded-full', c.isOptimal ? 'bg-emerald-500' : 'bg-slate-400')} />
                          <span>{c.companyName}</span>
                        </div>
                      </td>

                      {/* 3. 实测单耗值 */}
                      <td className="py-2.5 px-3 text-right font-extrabold text-[#1677ff]">
                        {c.value} <span className="text-[10px] text-slate-400 font-normal font-sans">{currentSelectedProcess.unit}</span>
                      </td>

                      {/* 4. 集团平均线 */}
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {currentSelectedProcess.groupAvg}
                      </td>

                      {/* 5. 较集团平均偏差 */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-[11px] font-bold',
                          c.diffGroupPct.startsWith('-') ? 'bg-emerald-50 text-emerald-700' : c.diffGroupPct === '0.0%' ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-700'
                        )}>
                          {c.diffGroupPct} {c.diffGroupPct.startsWith('-') ? '↓' : c.diffGroupPct === '0.0%' ? '—' : '↑'}
                        </span>
                      </td>

                      {/* 6. 行业先进基准 */}
                      <td className="py-2.5 px-3 text-right text-purple-700 font-bold">
                        {currentSelectedProcess.industryBenchmark !== undefined ? (
                          <span>{currentSelectedProcess.industryBenchmark} <span className="text-[10px] font-normal text-slate-400 font-sans">{currentSelectedProcess.unit}</span></span>
                        ) : (
                          <span className="text-slate-300 font-normal font-sans">无行业基准</span>
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
      {/* TAB 5: 基准管理 (1. 关键工序行业基准  2. 国家零碳工厂3大核心指标基准  3. 集团管控基准) */}
      {/* ========================================================================= */}
      {activeTab === 'standard_manage' && (
        <div className="space-y-3.5">
          {/* 1. 顶部 3 大核心分类概览 KPI 统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            {/* 类别 1: 关键工序行业基准 */}
            <div
              onClick={() => setStandardCategoryFilter('process')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer select-none space-y-1.5',
                standardCategoryFilter === 'process'
                  ? 'bg-purple-50/80 border-2 border-purple-500 shadow-xs ring-2 ring-purple-100'
                  : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50/60'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="size-4 text-purple-600" />
                  <span>1. 关键工序行业基准</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans">
                涵盖拉丝吨铜/吨铝电耗、高压干燥、耐压试验、立塔交联等国家先进标杆
              </div>
            </div>

            {/* 类别 2: 国家零碳工厂3大核心指标 */}
            <div
              onClick={() => setStandardCategoryFilter('zero_carbon')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer select-none space-y-1.5',
                standardCategoryFilter === 'zero_carbon'
                  ? 'bg-emerald-50/80 border-2 border-emerald-500 shadow-xs ring-2 ring-emerald-100'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>2. 国家零碳工厂3大指标</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans">
                GB/T 43126 单位能耗碳排放(≤1.8)、非化石能源(≥35%)、物理绿电(≥30%)
              </div>
            </div>

            {/* 类别 3: 集团管控基准与内控红线 */}
            <div
              onClick={() => setStandardCategoryFilter('group_control')}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer select-none space-y-1.5',
                standardCategoryFilter === 'group_control'
                  ? 'bg-blue-50/80 border-2 border-[#1677ff] shadow-xs ring-2 ring-blue-100'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="size-4 text-[#1677ff]" />
                  <span>3. 集团管控基准与内控红线</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans">
                产值能耗考核红线、增加值能耗限额、同型产品历史最优实测纪录基准
              </div>
            </div>
          </div>

          {/* 2. 筛选与操作控制栏 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* 分类切换按钮 */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => setStandardCategoryFilter('all')}
                  className={cn(
                    'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                    standardCategoryFilter === 'all' ? 'bg-white text-[#1677ff] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  全部基准 ({standardsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStandardCategoryFilter('process')}
                  className={cn(
                    'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                    standardCategoryFilter === 'process' ? 'bg-white text-purple-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  关键工序行业基准 (6)
                </button>
                <button
                  type="button"
                  onClick={() => setStandardCategoryFilter('zero_carbon')}
                  className={cn(
                    'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                    standardCategoryFilter === 'zero_carbon' ? 'bg-white text-emerald-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  国家零碳工厂3大指标 (3)
                </button>
                <button
                  type="button"
                  onClick={() => setStandardCategoryFilter('group_control')}
                  className={cn(
                    'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                    standardCategoryFilter === 'group_control' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  集团管控基准 (6)
                </button>
              </div>

              {/* 搜索框 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="按指标名称/适用范围/依据出处搜索..."
                  value={standardSearchKeyword}
                  onChange={(e) => setStandardSearchKeyword(e.target.value)}
                  className="pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#1677ff] focus:bg-white w-60 transition-colors"
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

            {/* 操作按钮组 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewStandardForm({
                    category: standardCategoryFilter === 'all' ? 'process' : standardCategoryFilter,
                    indicatorName: '',
                    scope: '',
                    benchmarkValue: '',
                    compareOperator: '<=',
                    unit: 'kWh/t',
                    standardSource: '',
                    currentGroupAvg: '',
                    effectiveDate: '2026-09-01',
                    maintainer: '集团双碳办公室',
                  })
                  setShowAddStandardModal(true)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="size-3.5" />
                <span>录入 / 维护新基准</span>
              </button>

              <button
                type="button"
                onClick={() => alert('正在导出全集团能效对标基准库明细 (Excel)...')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>导出基准库</span>
              </button>
            </div>
          </div>

          {/* 3. 基准库明细数据大表 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-800">
                  能效对标基准与内控标准维护明细表
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                当前筛选展示 <strong className="text-slate-800">{filteredStandards.length}</strong> 条基准规则
              </span>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold font-sans">
                    <th className="py-2.5 px-3">基准分类</th>
                    <th className="py-2.5 px-3">对标指标名称 / 适用范围</th>
                    <th className="py-2.5 px-3 text-right">标准基准值 (门槛/标杆)</th>
                    <th className="py-2.5 px-3">标准依据 / 来源出处</th>
                    <th className="py-2.5 px-3 text-center font-sans">维护部门</th>
                    <th className="py-2.5 px-3 text-center">维护日期</th>
                    <th className="py-2.5 px-3 text-center font-sans">状态</th>
                    <th className="py-2.5 px-3 text-right font-sans">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredStandards.map((std) => (
                    <tr key={std.id} className="hover:bg-blue-50/30 transition-colors">
                      {/* 基准分类 */}
                      <td className="py-2.5 px-3 font-sans align-middle">
                        <span className={cn(
                          'inline-block px-2 py-0.5 rounded font-mono font-bold text-[10.5px]',
                          std.category === 'process'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : std.category === 'zero_carbon'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-[#1677ff] border border-blue-200'
                        )}>
                          {std.categoryName}
                        </span>
                      </td>

                      {/* 指标名称与适用范围 */}
                      <td className="py-2.5 px-3 align-middle font-sans">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 text-xs">
                            {std.indicatorName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            适用：{std.scope}
                          </div>
                          {std.notes && (
                            <div className="text-[10px] text-amber-600 bg-amber-50/60 px-1.5 py-0.5 rounded border border-amber-200/60 inline-block font-sans">
                              {std.notes}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 标准基准值 (带比较符) */}
                      <td className="py-2.5 px-3 text-right align-middle font-extrabold text-slate-900">
                        <span className={cn(
                          'text-sm',
                          std.category === 'process' ? 'text-purple-700' : std.category === 'zero_carbon' ? 'text-emerald-700' : 'text-[#1677ff]'
                        )}>
                          {std.compareOperator === '<=' ? '≤ ' : '≥ '}
                          {std.benchmarkValue}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal ml-1 font-sans">
                          {std.unit}
                        </span>
                      </td>

                      {/* 标准出处 */}
                      <td className="py-2.5 px-3 align-middle font-sans text-slate-700 text-[11px]">
                        <div className="flex items-center gap-1">
                          <FileText className="size-3 text-slate-400 shrink-0" />
                          <span>{std.standardSource}</span>
                        </div>
                      </td>

                      {/* 维护部门 */}
                      <td className="py-2.5 px-3 text-center align-middle font-sans text-[11px] text-slate-600">
                        {std.maintainer}
                      </td>

                      {/* 维护日期 */}
                      <td className="py-2.5 px-3 text-center align-middle text-slate-500 text-[11px]">
                        {std.effectiveDate}
                      </td>

                      {/* 状态 */}
                      <td className="py-2.5 px-3 text-center align-middle font-sans">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          启用中
                        </span>
                      </td>

                      {/* 操作 */}
                      <td className="py-2.5 px-3 text-right align-middle font-sans space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewStandardForm({
                              category: std.category,
                              indicatorName: std.indicatorName,
                              scope: std.scope,
                              benchmarkValue: String(std.benchmarkValue),
                              compareOperator: std.compareOperator,
                              unit: std.unit,
                              standardSource: std.standardSource,
                              currentGroupAvg: String(std.currentGroupAvg),
                              effectiveDate: std.effectiveDate,
                              maintainer: std.maintainer,
                            })
                            setShowAddStandardModal(true)
                          }}
                          className="text-xs text-[#1677ff] hover:underline font-bold cursor-pointer"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`已打开【${std.indicatorName}】历史修订版本与变更记录。`)}
                          className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          版本
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

      {/* 🌟 4. 录入 / 维护基准弹窗 (全面支持关键工序/零碳3大指标/集团管控基准) */}
      {showAddStandardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* 弹窗 Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold shadow-2xs">
                  <Plus className="size-4.5 text-[#1677ff]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">录入 / 维护能效对标基准与标准值</h3>
                  <p className="text-[11px] text-slate-400 font-normal">支持国家标准、行业先进值及集团内部对标红线配置</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStandardModal(false)}
                className="size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const val = Number(newStandardForm.benchmarkValue) || 0
                const avg = Number(newStandardForm.currentGroupAvg) || val
                const newCatName =
                  newStandardForm.category === 'process'
                    ? '关键工序行业基准'
                    : newStandardForm.category === 'zero_carbon'
                    ? '国家零碳工厂3大指标'
                    : '集团管控基准'

                const newEntry: BenchmarkStandardItem = {
                  id: `std-custom-${Date.now()}`,
                  category: newStandardForm.category,
                  categoryName: newCatName,
                  indicatorName: newStandardForm.indicatorName || '自定义能效基准',
                  scope: newStandardForm.scope || '全集团直属单位',
                  benchmarkValue: val,
                  compareOperator: newStandardForm.compareOperator,
                  unit: newStandardForm.unit || 'kWh/t',
                  standardSource: newStandardForm.standardSource || '企业内部管理标准',
                  currentGroupAvg: avg,
                  effectiveDate: newStandardForm.effectiveDate,
                  status: 'active',
                  maintainer: newStandardForm.maintainer || '集团双碳办',
                }

                setStandardsList((prev) => [newEntry, ...prev])
                alert(`已成功保存并发布【${newEntry.indicatorName}】基准标准！`)
                setShowAddStandardModal(false)
              }}
              className="p-6 space-y-4 text-xs font-sans"
            >
              {/* 1. 单选：从系统中已有的管控指标中选择 */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#1677ff]" />
                    从系统中已有的管控指标中选择（单选对应）：
                  </span>
                  <span className="text-[11px] text-[#1677ff] font-normal font-sans">
                    * 选择后自动关联并映射指标参数与适用范围
                  </span>
                </label>
                <select
                  required
                  value={
                    SYSTEM_CONTROL_METRIC_OPTIONS.find(
                      (m) => m.name === newStandardForm.indicatorName
                    )?.id || ''
                  }
                  onChange={(e) => {
                    const selected = SYSTEM_CONTROL_METRIC_OPTIONS.find((m) => m.id === e.target.value)
                    if (selected) {
                      setNewStandardForm({
                        ...newStandardForm,
                        category: selected.category,
                        indicatorName: selected.name,
                        scope: selected.scope,
                        unit: selected.unit,
                        compareOperator: selected.defaultCompare,
                        benchmarkValue: String(selected.defaultBenchmark),
                        standardSource: selected.defaultSource,
                        currentGroupAvg: String(selected.groupAvg),
                      })
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-blue-50/50 border border-blue-200 rounded-lg text-slate-800 font-bold text-xs focus:outline-none focus:border-[#1677ff] focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="">-- 请选择系统中已有的管控指标（单选） --</option>
                  <optgroup label="🏭 1. 关键工序行业基准指标 (拉丝 / 干燥 / 交联 / 试验 / 固化 / 铁心退火)">
                    {SYSTEM_CONTROL_METRIC_OPTIONS.filter((m) => m.category === 'process').map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.unit})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌱 2. 国家零碳工厂 3 大核心指标 (碳排放强度 / 非化石消费 / 物理绿电)">
                    {SYSTEM_CONTROL_METRIC_OPTIONS.filter((m) => m.category === 'zero_carbon').map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.unit})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📊 3. 集团管控基准与内控红线 (产值能耗 / 增加值能耗 / 产品单耗 / 产值水耗)">
                    {SYSTEM_CONTROL_METRIC_OPTIONS.filter((m) => m.category === 'group_control').map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.unit})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* 2. 已选指标联动信息展示卡片 */}
              {newStandardForm.indicatorName ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className={cn(
                        'size-2 rounded-full',
                        newStandardForm.category === 'process'
                          ? 'bg-purple-500'
                          : newStandardForm.category === 'zero_carbon'
                          ? 'bg-emerald-500'
                          : 'bg-blue-500'
                      )} />
                      {newStandardForm.indicatorName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      集团实测均值: <strong className="text-slate-700">{newStandardForm.currentGroupAvg}</strong> {newStandardForm.unit}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="font-bold text-slate-700">适用范围 / 产业：</span>
                    <span>{newStandardForm.scope}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                  <span className="font-bold">⚠️</span>
                  <span>请先在上方的下拉列表中单选目标管控指标，系统将自动映射对应的单位、适用范围及出处。</span>
                </div>
              )}

              {/* 3. 比较符、基准值与单位 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-bold block">判定规则：</label>
                  <select
                    value={newStandardForm.compareOperator}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, compareOperator: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold text-xs focus:outline-none focus:border-[#1677ff] transition-colors"
                  >
                    <option value="<=">≤ (小于等于，优于门槛)</option>
                    <option value=">=">≥ (大于等于，达到目标)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-bold block">标准基准值：</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="如：320.0"
                    value={newStandardForm.benchmarkValue}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, benchmarkValue: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[#1677ff] font-mono font-bold text-xs focus:outline-none focus:border-[#1677ff] focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-bold block">计量单位：</label>
                  <input
                    type="text"
                    placeholder="如：kWh/t 或 %"
                    value={newStandardForm.unit}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, unit: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:border-[#1677ff] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* 4. 标准出处 / 政策依据 */}
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold block">标准出处 / 政策依据：</label>
                <input
                  type="text"
                  placeholder="如：GB/T 国家先进标准"
                  value={newStandardForm.standardSource}
                  onChange={(e) => setNewStandardForm({ ...newStandardForm, standardSource: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#1677ff] focus:bg-white transition-colors"
                />
              </div>

              {/* 5. 提示说明 */}
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-800 text-xs leading-relaxed flex items-start gap-2">
                <span className="text-[#1677ff] font-bold shrink-0">💡</span>
                <span>
                  <strong>数据联动提示：</strong>维护后的基准值将自动实时同步至全集团各项目公司的「核心指标对比」、「关键工序单耗对比」及「产品单耗对比」的基准线与达标阈值中。
                </span>
              </div>

              {/* 6. 底部操作按钮 */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStandardModal(false)}
                  className="px-5 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-xs font-bold text-white shadow-xs cursor-pointer transition-colors"
                >
                  确认保存并生效
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

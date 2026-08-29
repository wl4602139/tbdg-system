'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Building2,
  TrendingDown,
  TrendingUp,
  Search,
  Zap,
  Flame,
  Droplets,
  Calendar,
  Layers,
  Info,
  FileText,
  Clock,
  Coins,
  Cpu,
  BarChart3,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Download,
  ExternalLink,
  Table,
  Calculator,
  RefreshCw,
  X,
  PieChart,
  Sliders,
  Check,
  AlertCircle,
  Factory,
  Lightbulb,
  ArrowRight,
  Filter,
  Maximize2,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 指标数据接口
interface IndicatorMetric {
  id: string
  code: string
  name: string
  category: 'company' | 'product' | 'process'
  categoryName: string
  unit: string
  curVal: string
  yoy: string
  isYoyDown: boolean
  status: '常规监测' | '正常变动' | '历史同频' | '分析对标'
  statusType: 'green' | 'blue' | 'purple' | 'slate'
  badge: string
  tipText: string
  formula: string
  formulaDesc: string
  numeratorName: string
  numeratorVal: string
  denominatorName: string
  denominatorVal: string
  dataSource: string
  rawMeters: {
    medium: string
    meterCode: string
    location: string
    reading: string
    unit: string
    coeff: string
    tce: string
  }[]
  trendHistory: { period: string; value: number; yoy: string; mom: string }[]
}

// 1. 一、经营单位及项目公司整体指标 (前 10 项)

// 🌟 集团大盘数据定义
interface CompanyGroupMetrics {
  id: string
  name: string
  fullName: string
  industry: 'transformer' | 'cable'
  industryName: string
  unit: string
  // 综合指标
  energyTce: number
  energyShare: string
  costWan: number
  costShare: string
  unitOutputTce: string
  unitOutputElec: string
  unitOutputWater: string
  greenRatio: string
  yoy: string
  // 产品管控指标
  productEnergyTce: string
  productElec: string
  productSteam?: string
  productGas: string
  productWater: string
}

const GROUP_OVERALL_KPI = {
  totalTce: '5,529.1',
  totalTceUnit: 'tce',
  totalTceYoy: '-2.4%',
  unitOutputTce: '0.0526',
  unitOutputTceUnit: 'tce/万元',
  unitOutputTceYoy: '-3.8%',
  greenRatio: '36.8%',
  greenRatioYoy: '+4.5%',
  savedTce: '142.5',
  savedCost: '82.6',
}

const GROUP_COMPANIES_METRICS: CompanyGroupMetrics[] = [
  {
    id: 'comp_sb',
    name: '沈变公司',
    fullName: '特变电工沈阳变压器集团',
    industry: 'transformer',
    industryName: '变压器产业',
    unit: '万kVA',
    energyTce: 1577.2,
    energyShare: '32.5%',
    costWan: 762.5,
    costShare: '31.8%',
    unitOutputTce: '0.0553',
    unitOutputElec: '312.0',
    unitOutputWater: '0.42',
    greenRatio: '38.6%',
    yoy: '-2.7%',
    productEnergyTce: '0.0825',
    productElec: '534.2',
    productSteam: '1.85',
    productGas: '12.4',
    productWater: '0.75',
  },
  {
    id: 'comp_hb',
    name: '衡变公司',
    fullName: '特变电工衡阳变压器有限公司',
    industry: 'transformer',
    industryName: '变压器产业',
    unit: '万kVA',
    energyTce: 1420.5,
    energyShare: '28.2%',
    costWan: 685.0,
    costShare: '28.5%',
    unitOutputTce: '0.0582',
    unitOutputElec: '325.4',
    unitOutputWater: '0.48',
    greenRatio: '35.2%',
    yoy: '-2.0%',
    productEnergyTce: '0.0860',
    productElec: '552.0',
    productSteam: '1.92',
    productGas: '13.1',
    productWater: '0.80',
  },
  {
    id: 'comp_xb',
    name: '新变厂',
    fullName: '特变电工新疆变压器厂',
    industry: 'transformer',
    industryName: '变压器产业',
    unit: '万kVA',
    energyTce: 1280.0,
    energyShare: '24.1%',
    costWan: 590.2,
    costShare: '24.6%',
    unitOutputTce: '0.0510',
    unitOutputElec: '298.0',
    unitOutputWater: '0.38',
    greenRatio: '42.5%',
    yoy: '-2.1%',
    productEnergyTce: '0.0792',
    productElec: '518.5',
    productSteam: '1.70',
    productGas: '11.2',
    productWater: '0.68',
  },
  {
    id: 'comp_ll',
    name: '鲁缆公司',
    fullName: '特变电工山东鲁能泰山电缆',
    industry: 'cable',
    industryName: '线缆产业',
    unit: '万km·mm²',
    energyTce: 890.4,
    energyShare: '8.2%',
    costWan: 420.8,
    costShare: '8.3%',
    unitOutputTce: '0.0465',
    unitOutputElec: '285.0',
    unitOutputWater: '0.32',
    greenRatio: '31.0%',
    yoy: '-3.0%',
    productEnergyTce: '0.0425',
    productElec: '310.8',
    productGas: '8.5',
    productWater: '0.52',
  },
  {
    id: 'comp_xl',
    name: '新缆厂',
    fullName: '特变电工新疆线缆厂',
    industry: 'cable',
    industryName: '线缆产业',
    unit: '万km·mm²',
    energyTce: 740.2,
    energyShare: '4.5%',
    costWan: 360.5,
    costShare: '4.4%',
    unitOutputTce: '0.0440',
    unitOutputElec: '272.0',
    unitOutputWater: '0.28',
    greenRatio: '36.5%',
    yoy: '-1.9%',
    productEnergyTce: '0.0398',
    productElec: '295.4',
    productGas: '7.8',
    productWater: '0.45',
  },
  {
    id: 'comp_dl',
    name: '德缆公司',
    fullName: '特变电工（德阳）电缆股份有限公司',
    industry: 'cable',
    industryName: '线缆产业',
    unit: '万km·mm²',
    energyTce: 620.8,
    energyShare: '2.5%',
    costWan: 310.0,
    costShare: '2.4%',
    unitOutputTce: '0.0480',
    unitOutputElec: '292.5',
    unitOutputWater: '0.35',
    greenRatio: '29.8%',
    yoy: '-2.4%',
    productEnergyTce: '0.0450',
    productElec: '320.0',
    productGas: '9.1',
    productWater: '0.58',
  },
]


// 🌟 集团大盘 10 项公司整体管控指标定义清单 (与二三级 10 个参数 100% 保持完全一致)
const GROUP_OVERALL_TOP10_METRICS: IndicatorMetric[] = [
  {
    id: 'gm-total-energy',
    code: 'GK-01',
    name: '综合能源消费量',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tce',
    curVal: '1,284.5',
    yoy: '-4.8%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内组织综合能源消费的总吨标准煤。',
    formula: 'E = ∑(Ei × ki)',
    formulaDesc: '月度指标。E: 综合能源消耗量，单位为tce；n: 消耗的能源种类数；Ei: 实际消耗的第i种能源量；ki: 第i种能源的折标准煤系数。',
    numeratorName: '各直属单位能源实物折标煤之和 ∑(Ei × ki)',
    numeratorVal: '1,284.5 tce',
    denominatorName: '核算周期 (自然月)',
    denominatorVal: '1 个月',
    dataSource: '覆盖直属经营单位关口电表、天然气门站、蒸汽流量计及油料台账。',
    rawMeters: [
      { medium: '电力消费', meterCode: 'SUM-ELEC-GRID', location: '全集团关口', reading: '18,540,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '2,278.6' },
      { medium: '天然气', meterCode: 'SUM-GAS-MAIN', location: '全集团燃气', reading: '1,280,000 m³', unit: 'm³', coeff: '1.2143', tce: '1,554.3' },
      { medium: '外购蒸汽', meterCode: 'SUM-STEAM-MAIN', location: '蒸汽主干', reading: '15,600 t', unit: 't', coeff: '0.0943', tce: '1,471.1' },
    ],
    trendHistory: [
      { period: '25-09', value: 1380, yoy: '-3.2%', mom: '-0.8%' },
      { period: '25-10', value: 1360, yoy: '-3.8%', mom: '-1.4%' },
      { period: '25-11', value: 1340, yoy: '-4.0%', mom: '-1.5%' },
      { period: '25-12', value: 1390, yoy: '-3.5%', mom: '+3.7%' },
      { period: '26-01', value: 1320, yoy: '-4.1%', mom: '-5.0%' },
      { period: '26-02', value: 1300, yoy: '-4.5%', mom: '-1.5%' },
      { period: '26-03', value: 1310, yoy: '-4.4%', mom: '+0.8%' },
      { period: '26-04', value: 1295, yoy: '-4.1%', mom: '-1.1%' },
      { period: '26-05', value: 1305, yoy: '-4.7%', mom: '+0.8%' },
      { period: '26-06', value: 1340, yoy: '-4.3%', mom: '+2.7%' },
      { period: '26-07', value: 1300, yoy: '-4.8%', mom: '-3.0%' },
      { period: '26-08', value: 1284.5, yoy: '-4.8%', mom: '-1.2%' },
    ],
  },
  {
    id: 'gm-total-carbon',
    code: 'GK-02',
    name: '总碳排放量',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tCO2',
    curVal: '2,946.8',
    yoy: '-5.4%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内组织产生的温室气体二氧化碳总排放量。',
    formula: 'C = C燃烧 + C过程 + C购入电 - C输出电 + C购入热 - C输出热 - C回收利用',
    formulaDesc: '月度指标。C: 二氧化碳总排放量 (tCO2)；C燃烧: 化石燃料燃烧排放；C购入电: 购入电力排放；C购入热: 购入热力排放。',
    numeratorName: '化石燃料燃烧 + 净购入电力与热力碳排放',
    numeratorVal: '2,946.8 tCO2',
    denominatorName: '核算周期 (自然月)',
    denominatorVal: '1 个月',
    dataSource: '基于月度电力、天然气、蒸汽实物量及全国电网平均排放因子 (0.5703 tCO2/MWh) 自动核算生成。',
    rawMeters: [
      { medium: '外购市电', meterCode: 'EM-GRID-SUM', location: '主进线柜', reading: '18,540,000 kWh', unit: 'kWh', coeff: '0.5703', tce: '10,573 t' },
    ],
    trendHistory: [
      { period: '25-09', value: 3180, yoy: '-3.8%', mom: '-0.5%' },
      { period: '25-10', value: 3140, yoy: '-4.1%', mom: '-1.3%' },
      { period: '25-11', value: 3110, yoy: '-4.3%', mom: '-1.0%' },
      { period: '25-12', value: 3200, yoy: '-3.9%', mom: '+2.9%' },
      { period: '26-01', value: 3050, yoy: '-4.8%', mom: '-4.7%' },
      { period: '26-02', value: 3010, yoy: '-5.0%', mom: '-1.3%' },
      { period: '26-03', value: 3025, yoy: '-4.9%', mom: '+0.5%' },
      { period: '26-04', value: 2990, yoy: '-4.8%', mom: '-1.2%' },
      { period: '26-05', value: 2980, yoy: '-5.2%', mom: '-0.3%' },
      { period: '26-06', value: 3040, yoy: '-4.8%', mom: '+2.0%' },
      { period: '26-07', value: 2975, yoy: '-5.3%', mom: '-2.1%' },
      { period: '26-08', value: 2946.8, yoy: '-5.4%', mom: '-0.9%' },
    ],
  },
  {
    id: 'gm-carbon-per-energy',
    code: 'GK-03',
    name: '单位能耗碳排放',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tCO2/tce',
    curVal: '2.294',
    yoy: '-0.6%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内每消费一吨标准煤产生的二氧化碳排放量，用以衡量企业综合用能结构的绿色低碳化程度。',
    formula: 'I = C / E',
    formulaDesc: '月度指标。I: 单位能耗碳排放 (tCO2/tce)；C: 二氧化碳排放量 (tCO2)；E: 综合能源消耗量 (tce)。',
    numeratorName: '全集团总二氧化碳排放量 C',
    numeratorVal: '2,946.8 tCO2',
    denominatorName: '全集团综合能源消费量 E',
    denominatorVal: '1,284.5 tce',
    dataSource: '根据当期总碳排放量与综合能源消费总量比值自动结算。',
    rawMeters: [
      { medium: '碳能比率', meterCode: 'RATIO-C-E-SUM', location: '集控中枢', reading: '2.294 tCO2/tce', unit: 'tCO2/tce', coeff: '1.0', tce: '-' },
    ],
    trendHistory: [
      { period: '25-09', value: 2.304, yoy: '-0.5%', mom: '+0.1%' },
      { period: '25-10', value: 2.308, yoy: '-0.4%', mom: '+0.2%' },
      { period: '25-11', value: 2.320, yoy: '-0.3%', mom: '+0.5%' },
      { period: '25-12', value: 2.302, yoy: '-0.4%', mom: '-0.8%' },
      { period: '26-01', value: 2.310, yoy: '-0.5%', mom: '+0.3%' },
      { period: '26-02', value: 2.315, yoy: '-0.5%', mom: '+0.2%' },
      { period: '26-03', value: 2.309, yoy: '-0.5%', mom: '-0.3%' },
      { period: '26-04', value: 2.308, yoy: '-0.6%', mom: '0.0%' },
      { period: '26-05', value: 2.283, yoy: '-0.6%', mom: '-1.1%' },
      { period: '26-06', value: 2.268, yoy: '-0.5%', mom: '-0.7%' },
      { period: '26-07', value: 2.288, yoy: '-0.6%', mom: '+0.9%' },
      { period: '26-08', value: 2.294, yoy: '-0.6%', mom: '+0.3%' },
    ],
  },
  {
    id: 'gm-green-energy-ratio',
    code: 'GK-04',
    name: '非化石能源消费占比',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: '%',
    curVal: '38.6',
    yoy: '+4.2%',
    isYoyDown: false,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内非化石能源消费量与综合能源消费量的比值。月度指标，交易绿电、绿证可纳入分子。',
    formula: 'r = (R / E) × 100%',
    formulaDesc: '月度指标。r: 非化石能源消费占比；R: 各类非化石能源消费量 (不含原料用能, tce)；E: 综合能源消费量 (不含原料用能, tce)。',
    numeratorName: '全集团非化石能源消费量 R (自建光伏 + 交易绿电 + 绿证折算)',
    numeratorVal: '495.8 tce',
    denominatorName: '全集团综合能源消费量 E',
    denominatorVal: '1,284.5 tce',
    dataSource: '各园区自建分布式光伏自发自用量 + 全国电力交易中心绿电结算凭单 + 中国绿色电力证书 (GEC) 核销台账。',
    rawMeters: [
      { medium: '全集团非化石消纳', meterCode: 'GREEN-SUM-01', location: '调度中心', reading: '17,365 MWh', unit: 'MWh', coeff: '0.1229', tce: '2,134.2' },
    ],
    trendHistory: [
      { period: '25-09', value: 32.5, yoy: '+2.8%', mom: '+0.5%' },
      { period: '25-10', value: 33.1, yoy: '+3.1%', mom: '+1.8%' },
      { period: '25-11', value: 33.8, yoy: '+3.5%', mom: '+2.1%' },
      { period: '25-12', value: 34.2, yoy: '+3.2%', mom: '+1.2%' },
      { period: '26-01', value: 35.0, yoy: '+3.9%', mom: '+2.3%' },
      { period: '26-02', value: 35.6, yoy: '+4.0%', mom: '+1.7%' },
      { period: '26-03', value: 34.2, yoy: '+3.4%', mom: '-3.9%' },
      { period: '26-04', value: 35.8, yoy: '+4.3%', mom: '+4.7%' },
      { period: '26-05', value: 37.1, yoy: '+4.3%', mom: '+3.6%' },
      { period: '26-06', value: 37.8, yoy: '+4.4%', mom: '+1.9%' },
      { period: '26-07', value: 38.2, yoy: '+4.2%', mom: '+1.1%' },
      { period: '26-08', value: 38.6, yoy: '+4.2%', mom: '+1.0%' },
    ],
  },
  {
    id: 'gm-phy-green-ratio',
    code: 'GK-05',
    name: '非化石能源电力消费物理认定量占比',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: '%',
    curVal: '27.8',
    yoy: '+3.5%',
    isYoyDown: false,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内具备物理可溯源条件的非化石能源电力消费量占同期总用电量的比值。月底指标，交易绿电、绿证不纳入分子。',
    formula: 'E_ui = (E_z / Q) × 100%',
    formulaDesc: '月度指标。E_ui: 非化石能源电力消费物理认定量占比；E_z: 具备物理可溯源条件的非化石能源电力消费量 (kWh)；Q: 总用电量 (kWh)。',
    numeratorName: '具备物理可溯源非化石电量 E_z (全集团园区屋顶光伏+专线直供)',
    numeratorVal: '1,482,000 kWh',
    denominatorName: '同期全集团工业总用电量 Q',
    denominatorVal: '5,322,000 kWh',
    dataSource: '各园区自建分布式光伏逆变器关口计量表及直供专用隔离配电柜时序电表，严格剔除外部市场化凭证。',
    rawMeters: [
      { medium: '物理光伏就地消纳', meterCode: 'PV-PHYS-SUM', location: '各园区总表', reading: '1,482,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '182.1' },
    ],
    trendHistory: [
      { period: '25-09', value: 23.5, yoy: '+2.1%', mom: '+0.5%' },
      { period: '25-10', value: 24.0, yoy: '+2.4%', mom: '+2.1%' },
      { period: '25-11', value: 24.5, yoy: '+2.6%', mom: '+2.1%' },
      { period: '25-12', value: 24.8, yoy: '+2.5%', mom: '+1.2%' },
      { period: '26-01', value: 25.2, yoy: '+3.0%', mom: '+1.6%' },
      { period: '26-02', value: 25.8, yoy: '+3.2%', mom: '+2.4%' },
      { period: '26-03', value: 25.0, yoy: '+2.8%', mom: '-3.1%' },
      { period: '26-04', value: 26.2, yoy: '+3.4%', mom: '+4.8%' },
      { period: '26-05', value: 26.8, yoy: '+3.5%', mom: '+2.3%' },
      { period: '26-06', value: 27.2, yoy: '+3.6%', mom: '+1.5%' },
      { period: '26-07', value: 27.5, yoy: '+3.5%', mom: '+1.1%' },
      { period: '26-08', value: 27.8, yoy: '+3.5%', mom: '+1.1%' },
    ],
  },
  {
    id: 'gm-unit-industrial-added-value',
    code: 'GK-06',
    name: '单位工业增加值能耗',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tce/万元',
    curVal: '0.1425',
    yoy: '-4.6%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内综合能源消费量与工业增加值的比值。月度指标，年度重新汇算。',
    formula: 'E_nva = E / G_nva',
    formulaDesc: '月度指标。E_nva: 单位工业增加值能耗 (tce/万元)；E: 综合能源消费量 (tce)；G_nva: 工业增加值 (万元)。',
    numeratorName: '综合能源消费量 E',
    numeratorVal: '1,284.5 tce',
    denominatorName: '工业增加值 G_nva',
    denominatorVal: '9,014.0 万元',
    dataSource: '根据经营财务月报工业增加值与能源关口数据综合核算。',
    rawMeters: [
      { medium: '增加值能耗核算', meterCode: 'SUM-NVA-ALL', location: '集控中枢', reading: '1,284.5 / 9,014.0', unit: 'tce/万元', coeff: '1.0', tce: '0.1425' },
    ],
    trendHistory: [
      { period: '25-09', value: 0.1510, yoy: '-3.5%', mom: '-0.5%' },
      { period: '25-10', value: 0.1495, yoy: '-3.8%', mom: '-1.0%' },
      { period: '25-11', value: 0.1482, yoy: '-4.0%', mom: '-0.9%' },
      { period: '25-12', value: 0.1490, yoy: '-3.6%', mom: '+0.5%' },
      { period: '26-01', value: 0.1470, yoy: '-4.1%', mom: '-1.3%' },
      { period: '26-02', value: 0.1465, yoy: '-4.2%', mom: '-0.3%' },
      { period: '26-03', value: 0.1460, yoy: '-4.0%', mom: '-0.3%' },
      { period: '26-04', value: 0.1450, yoy: '-4.2%', mom: '-0.7%' },
      { period: '26-05', value: 0.1442, yoy: '-4.4%', mom: '-0.6%' },
      { period: '26-06', value: 0.1438, yoy: '-4.5%', mom: '-0.3%' },
      { period: '26-07', value: 0.1430, yoy: '-4.5%', mom: '-0.6%' },
      { period: '26-08', value: 0.1425, yoy: '-4.6%', mom: '-0.3%' },
    ],
  },
  {
    id: 'gm-unit-output',
    code: 'GK-07',
    name: '单位产值能耗',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tce/万元',
    curVal: '0.0553',
    yoy: '-5.2%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '公司管理要求',
    tipText: '指统计期内综合能源消费量与产品产值的比值。',
    formula: 'g = E / G',
    formulaDesc: '月度指标。g: 单位产值能耗，单位为tce/万元；E: 综合能源消费量，单位tce；G: 产品产值，单位为万元。',
    numeratorName: '综合能源消费量 E',
    numeratorVal: '1,577.2 tce',
    denominatorName: '企业工业总产值 G',
    denominatorVal: '28,500 万元',
    dataSource: '财务经营月报工业总产值 (万元) 与关口能源关口表数据结合汇总清分。',
    rawMeters: [
      { medium: '总折标能耗', meterCode: 'SUM-ENERGY', location: '厂界全域', reading: '1,577.2 tce', unit: 'tce', coeff: '1.0', tce: '1,577.2' },
    ],
    trendHistory: [
      { period: '25-09', value: 0.0585, yoy: '-3.5%', mom: '-0.5%' },
      { period: '25-10', value: 0.0578, yoy: '-3.8%', mom: '-1.2%' },
      { period: '25-11', value: 0.0574, yoy: '-4.0%', mom: '-0.7%' },
      { period: '25-12', value: 0.0579, yoy: '-3.6%', mom: '+0.9%' },
      { period: '26-01', value: 0.0570, yoy: '-4.2%', mom: '-1.6%' },
      { period: '26-02', value: 0.0568, yoy: '-4.4%', mom: '-0.4%' },
      { period: '26-03', value: 0.0568, yoy: '-4.0%', mom: '0.0%' },
      { period: '26-04', value: 0.0565, yoy: '-4.2%', mom: '-0.5%' },
      { period: '26-05', value: 0.0562, yoy: '-4.4%', mom: '-0.5%' },
      { period: '26-06', value: 0.0560, yoy: '-4.6%', mom: '-0.4%' },
      { period: '26-07', value: 0.0556, yoy: '-4.9%', mom: '-0.7%' },
      { period: '26-08', value: 0.0553, yoy: '-5.2%', mom: '-0.5%' },
    ],
  },
  {
    id: 'gm-product-unit-energy',
    code: 'GK-08',
    name: '单位产品综合能耗',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tce/万kVA',
    curVal: '0.0825',
    yoy: '-5.8%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级绿色工厂',
    tipText: '统计期内综合能源消费总量与合格产品产量（变压器按容量万kVA，线缆按长度km）的比值。',
    formula: 'e = E / M',
    formulaDesc: '月度指标。e: 产品单耗 (tce/万kVA)；E: 制造过程综合能源消费量 (tce)；M: 合格产品产出总量 (万kVA)。',
    numeratorName: '各工段综合能源消费总量 E',
    numeratorVal: '456.2 tce',
    denominatorName: '当月完工合格产品产出总量 M',
    denominatorVal: '5,530 万kVA',
    dataSource: 'MES 制造执行系统产品合格工单报工与车间分时计量表计系统。',
    rawMeters: [
      { medium: '工序综合用能与出厂产出', meterCode: 'MES-PROD-OUTPUT-ALL', location: '制造部与总装车间', reading: '456.2 tce / 5,530 万kVA', unit: 'tce/万kVA', coeff: '1.0', tce: '456.2' },
    ],
    trendHistory: [
      { period: '25-09', value: 0.0875, yoy: '-4.2%', mom: '-0.3%' },
      { period: '25-10', value: 0.0870, yoy: '-4.5%', mom: '-0.6%' },
      { period: '25-11', value: 0.0862, yoy: '-4.8%', mom: '-0.9%' },
      { period: '25-12', value: 0.0855, yoy: '-5.0%', mom: '-0.8%' },
      { period: '26-01', value: 0.0850, yoy: '-5.1%', mom: '-0.6%' },
      { period: '26-02', value: 0.0848, yoy: '-5.2%', mom: '-0.2%' },
      { period: '26-03', value: 0.0840, yoy: '-5.4%', mom: '-0.9%' },
      { period: '26-04', value: 0.0838, yoy: '-5.5%', mom: '-0.2%' },
      { period: '26-05', value: 0.0835, yoy: '-5.6%', mom: '-0.4%' },
      { period: '26-06', value: 0.0830, yoy: '-5.7%', mom: '-0.6%' },
      { period: '26-07', value: 0.0828, yoy: '-5.7%', mom: '-0.2%' },
      { period: '26-08', value: 0.0825, yoy: '-5.8%', mom: '-0.4%' },
    ],
  },
  {
    id: 'gm-energy-saving-equipment-ratio',
    code: 'GK-09',
    name: '节能装备应用占比',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: '%',
    curVal: '92.4',
    yoy: '+3.8%',
    isYoyDown: false,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内达到或优于能效强制性国家标准 2 级水平和《重点用能产品设备能效先进水平、节能水平和准入水平》节能水平的装备累计额定总功率占纳入统计范围装备累计额定总功率的比例。',
    formula: 'S = (R_es / E_ts) × 100%',
    formulaDesc: '月度指标。S: 节能装备应用占比；R_es: 达到或优于能效国标 2 级水平装备累计额定总功率 (kW)；E_ts: 纳入统计范围装备累计额定总功率 (kW)。',
    numeratorName: '能效2级及以上先进节能装备总额定功率 R_es',
    numeratorVal: '32,850 kW',
    denominatorName: '纳入统计范围设备总额定功率 E_ts',
    denominatorVal: '35,550 kW',
    dataSource: '设备资产台账及能效铭牌技术参数库，覆盖高效电动机、节能变压器、工业锅炉、磁悬浮空压机等。',
    rawMeters: [
      { medium: '节能设备总台账', meterCode: 'EQ-ASSET-ALL', location: '装备动力部', reading: '32,850 / 35,550 kW', unit: 'kW', coeff: '1.0', tce: '-' },
    ],
    trendHistory: [
      { period: '25-09', value: 88.5, yoy: '+2.5%', mom: '+0.0%' },
      { period: '25-10', value: 88.5, yoy: '+2.5%', mom: '+0.0%' },
      { period: '25-11', value: 89.2, yoy: '+2.8%', mom: '+0.8%' },
      { period: '25-12', value: 90.0, yoy: '+3.1%', mom: '+0.9%' },
      { period: '26-01', value: 90.5, yoy: '+3.2%', mom: '+0.6%' },
      { period: '26-02', value: 90.5, yoy: '+3.2%', mom: '+0.0%' },
      { period: '26-03', value: 91.2, yoy: '+3.5%', mom: '+0.8%' },
      { period: '26-04', value: 91.5, yoy: '+3.6%', mom: '+0.3%' },
      { period: '26-05', value: 91.8, yoy: '+3.6%', mom: '+0.3%' },
      { period: '26-06', value: 92.0, yoy: '+3.7%', mom: '+0.2%' },
      { period: '26-07', value: 92.2, yoy: '+3.8%', mom: '+0.2%' },
      { period: '26-08', value: 92.4, yoy: '+3.8%', mom: '+0.2%' },
    ],
  },
  {
    id: 'gm-pcf-ratio',
    code: 'GK-10',
    name: '开展产品碳足迹分析占比',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: '%',
    curVal: '85.7',
    yoy: '+12.5%',
    isYoyDown: false,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内开展主要产品碳足迹分析的产品类别数量占主要产品类别总数的比值。',
    formula: 'R_cf = (N_cf / N) × 100%',
    formulaDesc: '月度指标。R_cf: 开展产品碳足迹分析占比；N_cf: 开展主要产品碳足迹分析的产品类别数量；N: 主要产品类别总数。',
    numeratorName: '已开展主要产品碳足迹分析的产品类别数 N_cf',
    numeratorVal: '12 类',
    denominatorName: '主要产品类别总数 N',
    denominatorVal: '14 类',
    dataSource: '产品碳足迹集采中心实景数据库与生命周期评估 (LCA) 认证报告清单。',
    rawMeters: [
      { medium: '碳足迹认证台账', meterCode: 'PCF-CERT-01', location: '集采中心', reading: '12 / 14 类别', unit: '类', coeff: '1.0', tce: '-' },
    ],
    trendHistory: [
      { period: '25-09', value: 71.4, yoy: '+8.0%', mom: '+0.0%' },
      { period: '25-10', value: 71.4, yoy: '+8.0%', mom: '+0.0%' },
      { period: '25-11', value: 78.6, yoy: '+10.2%', mom: '+7.2%' },
      { period: '25-12', value: 78.6, yoy: '+10.2%', mom: '+0.0%' },
      { period: '26-01', value: 78.6, yoy: '+10.2%', mom: '+0.0%' },
      { period: '26-02', value: 78.6, yoy: '+10.2%', mom: '+0.0%' },
      { period: '26-03', value: 85.7, yoy: '+14.3%', mom: '+7.1%' },
      { period: '26-04', value: 85.7, yoy: '+14.3%', mom: '+0.0%' },
      { period: '26-05', value: 85.7, yoy: '+14.3%', mom: '+0.0%' },
      { period: '26-06', value: 85.7, yoy: '+14.3%', mom: '+0.0%' },
      { period: '26-07', value: 85.7, yoy: '+14.3%', mom: '+0.0%' },
      { period: '26-08', value: 85.7, yoy: '+12.5%', mom: '+0.0%' },
    ],
  },
]

const FACTORY_TOP10_METRICS: IndicatorMetric[] = [
  {
    id: 'm-total-energy',
    code: 'GK-01',
    name: '综合能源消费量',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tce',
    curVal: '1,284.5',
    yoy: '-4.8%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内组织综合能源消费的总吨标准煤。',
    formula: 'E = ∑(Ei × ki)',
    formulaDesc: '月度指标。E: 综合能源消耗量，单位为tce；n: 消耗的能源种类数；Ei: 实际消耗的第i种能源量；ki: 第i种能源的折标准煤系数。',
    numeratorName: '各介质实物消耗折标煤之和 ∑(Ei × ki)',
    numeratorVal: '1,284.5 tce',
    denominatorName: '核算周期 (自然月)',
    denominatorVal: '1 个月',
    dataSource: '分子与分母的核算范围保持一致。提供电（包括市电和绿电）、天然气、蒸汽、热水、柴油、煤油等所有消耗能源种类的消耗量。其中电力消费量折算标煤按照等价值计算。',
    rawMeters: [
      { medium: '电力 (市电)', meterCode: 'EM-10KV-01', location: '1号变电所', reading: '3,840,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '471.9' },
      { medium: '过热蒸汽', meterCode: 'STM-FM-02', location: '蒸汽减温站', reading: '4,280 t', unit: 't', coeff: '0.1286', tce: '550.4' },
      { medium: '天然气', meterCode: 'GAS-MAIN-01', location: '燃气门站', reading: '197,000 m³', unit: 'm³', coeff: '1.3300', tce: '262.2' },
    ],
    trendHistory: [
      { period: '25-09', value: 1380, yoy: '-3.2%', mom: '-0.8%' },
      { period: '25-10', value: 1360, yoy: '-3.8%', mom: '-1.4%' },
      { period: '25-11', value: 1340, yoy: '-4.0%', mom: '-1.5%' },
      { period: '25-12', value: 1390, yoy: '-3.5%', mom: '+3.7%' },
      { period: '26-01', value: 1320, yoy: '-4.1%', mom: '-5.0%' },
      { period: '26-02', value: 1300, yoy: '-4.5%', mom: '-1.5%' },
      { period: '26-03', value: 1310, yoy: '-4.4%', mom: '+0.8%' },
      { period: '26-04', value: 1295, yoy: '-4.1%', mom: '-1.1%' },
      { period: '26-05', value: 1305, yoy: '-4.7%', mom: '+0.8%' },
      { period: '26-06', value: 1340, yoy: '-4.3%', mom: '+2.7%' },
      { period: '26-07', value: 1300, yoy: '-4.8%', mom: '-3.0%' },
      { period: '26-08', value: 1284.5, yoy: '-4.8%', mom: '-1.2%' },
    ],
  },
  {
    id: 'm-total-carbon',
    code: 'GK-02',
    name: '总碳排放量',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tCO2',
    curVal: '2,946.8',
    yoy: '-5.4%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内企业组织产生的二氧化碳总排放量。由于电装产业在生产过程碳排放、回收利用中固碳非常少，且数据难统计，本次主要考虑能源碳排放。',
    formula: 'C = C燃烧 + C过程 + C购入电 - C输出电 + C购入热 - C输出热 - C回收利用',
    formulaDesc: '月度指标。C: 二氧化碳总排放量 (tCO2)；C燃烧: 化石燃料燃烧排放；C购入电: 购入电力排放；C购入热: 购入热力排放。',
    numeratorName: '化石燃料燃烧 + 净购入电力与热力碳排放',
    numeratorVal: '2,946.8 tCO2',
    denominatorName: '核算周期 (自然月)',
    denominatorVal: '1 个月',
    dataSource: '基于月度电力、天然气、蒸汽实物量及全国电网平均排放因子 (0.5703 tCO2/MWh) 自动核算生成。',
    rawMeters: [
      { medium: '外购市电', meterCode: 'EM-GRID-01', location: '主进线柜', reading: '3,840,000 kWh', unit: 'kWh', coeff: '0.5703', tce: '2,190.0' },
      { medium: '天然气燃烧', meterCode: 'GAS-BURN-01', location: '锅炉房', reading: '197,000 m³', unit: 'm³', coeff: '2.1622', tce: '425.9' },
      { medium: '外购蒸汽', meterCode: 'STM-BUY-01', location: '分汽缸', reading: '4,280 t', unit: 't', coeff: '0.0773', tce: '330.9' },
    ],
    trendHistory: [
      { period: '25-09', value: 3180, yoy: '-3.8%', mom: '-0.5%' },
      { period: '25-10', value: 3140, yoy: '-4.1%', mom: '-1.3%' },
      { period: '25-11', value: 3110, yoy: '-4.3%', mom: '-1.0%' },
      { period: '25-12', value: 3200, yoy: '-3.9%', mom: '+2.9%' },
      { period: '26-01', value: 3050, yoy: '-4.8%', mom: '-4.7%' },
      { period: '26-02', value: 3010, yoy: '-5.0%', mom: '-1.3%' },
      { period: '26-03', value: 3025, yoy: '-4.9%', mom: '+0.5%' },
      { period: '26-04', value: 2990, yoy: '-4.8%', mom: '-1.2%' },
      { period: '26-05', value: 2980, yoy: '-5.2%', mom: '-0.3%' },
      { period: '26-06', value: 3040, yoy: '-4.8%', mom: '+2.0%' },
      { period: '26-07', value: 2975, yoy: '-5.3%', mom: '-2.1%' },
      { period: '26-08', value: 2946.8, yoy: '-5.4%', mom: '-0.9%' },
    ],
  },
  {
    id: 'm-carbon-per-energy',
    code: 'GK-03',
    name: '单位能耗碳排放',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tCO2/tce',
    curVal: '2.294',
    yoy: '-0.6%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内每消费一吨标准煤产生的二氧化碳排放量，用以衡量企业综合用能结构的绿色低碳化程度。',
    formula: 'I = C / E',
    formulaDesc: '月度指标。I: 单位能耗碳排放 (tCO2/tce)；C: 二氧化碳排放量 (tCO2)；E: 综合能源消耗量 (tce)。',
    numeratorName: '总二氧化碳排放量 C',
    numeratorVal: '2,946.8 tCO2',
    denominatorName: '综合能源消费量 E',
    denominatorVal: '1,284.5 tce',
    dataSource: '根据当期总碳排放量与综合能源消费总量比值自动结算。',
    rawMeters: [
      { medium: '碳能比率', meterCode: 'RATIO-C-E', location: '集控中枢', reading: '2.294 tCO2/tce', unit: 'tCO2/tce', coeff: '1.0', tce: '-' },
    ],
    trendHistory: [
      { period: '25-09', value: 2.304, yoy: '-0.5%', mom: '+0.1%' },
      { period: '25-10', value: 2.308, yoy: '-0.4%', mom: '+0.2%' },
      { period: '25-11', value: 2.320, yoy: '-0.3%', mom: '+0.5%' },
      { period: '25-12', value: 2.302, yoy: '-0.4%', mom: '-0.8%' },
      { period: '26-01', value: 2.310, yoy: '-0.5%', mom: '+0.3%' },
      { period: '26-02', value: 2.315, yoy: '-0.5%', mom: '+0.2%' },
      { period: '26-03', value: 2.309, yoy: '-0.5%', mom: '-0.3%' },
      { period: '26-04', value: 2.308, yoy: '-0.6%', mom: '0.0%' },
      { period: '26-05', value: 2.283, yoy: '-0.6%', mom: '-1.1%' },
      { period: '26-06', value: 2.268, yoy: '-0.5%', mom: '-0.7%' },
      { period: '26-07', value: 2.288, yoy: '-0.6%', mom: '+0.9%' },
      { period: '26-08', value: 2.294, yoy: '-0.6%', mom: '+0.3%' },
    ],
  },
  {
    id: 'm-green-energy-ratio',
    code: 'GK-04',
    name: '非化石能源消费占比',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: '%',
    curVal: '38.6',
    yoy: '+4.2%',
    isYoyDown: false,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内非化石能源消费量与综合能源消费量的比值。月度指标，交易绿电、绿证可纳入分子。',
    formula: 'r = (R / E) × 100%',
    formulaDesc: '月度指标。r: 非化石能源消费占比；R: 各类非化石能源消费量 (不含原料用能, tce)；E: 综合能源消费量 (不含原料用能, tce)。',
    numeratorName: '非化石能源消费量 R (自建光伏 + 交易绿电 + 绿证折算)',
    numeratorVal: '495.8 tce',
    denominatorName: '综合能源消费量 E',
    denominatorVal: '1,284.5 tce',
    dataSource: '厂区自建分布式光伏自发自用量 + 全国电力交易中心绿电结算凭单 + 中国绿色电力证书 (GEC) 核销台账。',
    rawMeters: [
      { medium: '光伏自用电量', meterCode: 'PV-SELF-01', location: '屋顶光伏', reading: '1,482,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '182.1' },
      { medium: '交易绿电消纳', meterCode: 'TRD-GREEN-01', location: '交易结算', reading: '801,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '98.4' },
      { medium: 'GEC绿证核销', meterCode: 'GEC-CERT-01', location: '国家绿证网', reading: '18,000 张', unit: '张', coeff: '0.1229', tce: '215.3' },
    ],
    trendHistory: [
      { period: '25-09', value: 32.5, yoy: '+2.8%', mom: '+0.5%' },
      { period: '25-10', value: 33.1, yoy: '+3.1%', mom: '+1.8%' },
      { period: '25-11', value: 33.8, yoy: '+3.5%', mom: '+2.1%' },
      { period: '25-12', value: 34.2, yoy: '+3.2%', mom: '+1.2%' },
      { period: '26-01', value: 35.0, yoy: '+3.9%', mom: '+2.3%' },
      { period: '26-02', value: 35.6, yoy: '+4.0%', mom: '+1.7%' },
      { period: '26-03', value: 34.2, yoy: '+3.4%', mom: '-3.9%' },
      { period: '26-04', value: 35.8, yoy: '+4.3%', mom: '+4.7%' },
      { period: '26-05', value: 37.1, yoy: '+4.3%', mom: '+3.6%' },
      { period: '26-06', value: 37.8, yoy: '+4.4%', mom: '+1.9%' },
      { period: '26-07', value: 38.2, yoy: '+4.2%', mom: '+1.1%' },
      { period: '26-08', value: 38.6, yoy: '+4.2%', mom: '+1.0%' },
    ],
  },
  {
    id: 'm-phy-green-ratio',
    code: 'GK-05',
    name: '非化石能源电力消费物理认定量占比',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: '%',
    curVal: '27.8',
    yoy: '+3.5%',
    isYoyDown: false,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内具备物理可溯源条件的非化石能源电力消费量占同期总用电量的比值。月底指标，交易绿电、绿证不纳入分子。',
    formula: 'E_ui = (E_z / Q) × 100%',
    formulaDesc: '月度指标。E_ui: 非化石能源电力消费物理认定量占比；E_z: 具备物理可溯源条件的非化石能源电力消费量 (kWh)；Q: 总用电量 (kWh)。',
    numeratorName: '具备物理可溯源非化石电量 E_z (厂区屋顶光伏+专线直供)',
    numeratorVal: '1,482,000 kWh',
    denominatorName: '同期全厂总用电量 Q',
    denominatorVal: '5,322,000 kWh',
    dataSource: '厂区自建分布式光伏逆变器关口计量表及直供专用隔离配电柜时序电表，严格剔除外部市场化凭证。',
    rawMeters: [
      { medium: '光伏物理就地消纳', meterCode: 'PV-PHYS-01', location: '1-4号厂房屋顶', reading: '1,482,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '182.1' },
    ],
    trendHistory: [
      { period: '25-09', value: 23.5, yoy: '+2.1%', mom: '+0.5%' },
      { period: '25-10', value: 24.0, yoy: '+2.4%', mom: '+2.1%' },
      { period: '25-11', value: 24.5, yoy: '+2.6%', mom: '+2.1%' },
      { period: '25-12', value: 24.8, yoy: '+2.5%', mom: '+1.2%' },
      { period: '26-01', value: 25.2, yoy: '+3.0%', mom: '+1.6%' },
      { period: '26-02', value: 25.8, yoy: '+3.2%', mom: '+2.4%' },
      { period: '26-03', value: 25.0, yoy: '+2.8%', mom: '-3.1%' },
      { period: '26-04', value: 26.2, yoy: '+3.4%', mom: '+4.8%' },
      { period: '26-05', value: 26.8, yoy: '+3.5%', mom: '+2.3%' },
      { period: '26-06', value: 27.2, yoy: '+3.6%', mom: '+1.5%' },
      { period: '26-07', value: 27.5, yoy: '+3.5%', mom: '+1.1%' },
      { period: '26-08', value: 27.8, yoy: '+3.5%', mom: '+1.1%' },
    ],
  },
  {
    id: 'm-unit-industrial-added-value',
    code: 'GK-06',
    name: '单位工业增加值能耗',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tce/万元',
    curVal: '0.1425',
    yoy: '-4.6%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内综合能源消费量与工业增加值的比值。月度指标，年度重新汇算。',
    formula: 'E_nva = E / G_nva',
    formulaDesc: '月度指标。E_nva: 单位工业增加值能耗 (tce/万元)；E: 综合能源消费量 (tce)；G_nva: 工业增加值 (万元)。',
    numeratorName: '综合能源消费量 E',
    numeratorVal: '1,284.5 tce',
    denominatorName: '工业增加值 G_nva',
    denominatorVal: '9,014.0 万元',
    dataSource: '根据经营财务月报工业增加值与能源关口数据综合核算。',
    rawMeters: [
      { medium: '总能耗折标', meterCode: 'SUM-NVA-01', location: '厂界全域', reading: '1,284.5 tce', unit: 'tce', coeff: '1.0', tce: '1,284.5' },
    ],
    trendHistory: [
      { period: '25-09', value: 0.1510, yoy: '-3.5%', mom: '-0.5%' },
      { period: '25-10', value: 0.1495, yoy: '-3.8%', mom: '-1.0%' },
      { period: '25-11', value: 0.1482, yoy: '-4.0%', mom: '-0.9%' },
      { period: '25-12', value: 0.1490, yoy: '-3.6%', mom: '+0.5%' },
      { period: '26-01', value: 0.1470, yoy: '-4.1%', mom: '-1.3%' },
      { period: '26-02', value: 0.1465, yoy: '-4.2%', mom: '-0.3%' },
      { period: '26-03', value: 0.1460, yoy: '-4.0%', mom: '-0.3%' },
      { period: '26-04', value: 0.1450, yoy: '-4.2%', mom: '-0.7%' },
      { period: '26-05', value: 0.1442, yoy: '-4.4%', mom: '-0.6%' },
      { period: '26-06', value: 0.1438, yoy: '-4.5%', mom: '-0.3%' },
      { period: '26-07', value: 0.1430, yoy: '-4.5%', mom: '-0.6%' },
      { period: '26-08', value: 0.1425, yoy: '-4.6%', mom: '-0.3%' },
    ],
  },
  {
    id: 'm-unit-output',
    code: 'GK-07',
    name: '单位产值能耗',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 'tce/万元',
    curVal: '0.0553',
    yoy: '-5.2%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '公司管理要求',
    tipText: '指统计期内综合能源消费量与产品产值的比值。',
    formula: 'g = E / G',
    formulaDesc: '月度指标。g: 单位产值能耗，单位为tce/万元；E: 综合能源消费量，单位tce；G: 产品产值，单位为万元。',
    numeratorName: '综合能源消费量 E',
    numeratorVal: '1,577.2 tce',
    denominatorName: '企业工业总产值 G',
    denominatorVal: '28,500 万元',
    dataSource: '财务经营月报工业总产值 (万元) 与关口能源关口表数据结合汇总清分。',
    rawMeters: [
      { medium: '总折标能耗', meterCode: 'SUM-ENERGY', location: '厂界全域', reading: '1,577.2 tce', unit: 'tce', coeff: '1.0', tce: '1,577.2' },
    ],
    trendHistory: [
      { period: '25-09', value: 0.0585, yoy: '-3.5%', mom: '-0.5%' },
      { period: '25-10', value: 0.0578, yoy: '-3.8%', mom: '-1.2%' },
      { period: '25-11', value: 0.0574, yoy: '-4.0%', mom: '-0.7%' },
      { period: '25-12', value: 0.0579, yoy: '-3.6%', mom: '+0.9%' },
      { period: '26-01', value: 0.0570, yoy: '-4.2%', mom: '-1.6%' },
      { period: '26-02', value: 0.0568, yoy: '-4.4%', mom: '-0.4%' },
      { period: '26-03', value: 0.0568, yoy: '-4.0%', mom: '0.0%' },
      { period: '26-04', value: 0.0564, yoy: '-4.3%', mom: '-0.7%' },
      { period: '26-05', value: 0.0561, yoy: '-4.5%', mom: '-0.5%' },
      { period: '26-06', value: 0.0559, yoy: '-4.8%', mom: '-0.4%' },
      { period: '26-07', value: 0.0556, yoy: '-5.0%', mom: '-0.5%' },
      { period: '26-08', value: 0.0553, yoy: '-5.2%', mom: '-0.5%' },
    ],
  },
  {
    id: 'm-water-consumption',
    code: 'GK-08',
    name: '水资源消耗量',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: 't',
    curVal: '15,480',
    yoy: '-4.2%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '公司管理要求',
    tipText: '指统计期内企业组织在生产制造、公辅系统及生活办公中消耗的新鲜水总量。',
    formula: 'W = ∑ Wi',
    formulaDesc: '月度指标。W: 水资源消耗总量 (t)；Wi: 各车间、工段及公辅设施水表计量用水量之和。',
    numeratorName: '各车间工段新鲜水总耗量 W',
    numeratorVal: '15,480 t',
    denominatorName: '核算周期 (自然月)',
    denominatorVal: '1 个月',
    dataSource: '厂区总进水关口超声波水表及各车间分级智能远传水表系统。',
    rawMeters: [
      { medium: '市政自来水', meterCode: 'WM-MAIN-01', location: '厂区总进水泵房', reading: '15,480 t', unit: 't', coeff: '0.0001', tce: '1.5' },
    ],
    trendHistory: [
      { period: '25-09', value: 16200, yoy: '-3.1%', mom: '-0.5%' },
      { period: '25-10', value: 16100, yoy: '-3.4%', mom: '-0.6%' },
      { period: '25-11', value: 15950, yoy: '-3.8%', mom: '-0.9%' },
      { period: '25-12', value: 15800, yoy: '-3.9%', mom: '-0.9%' },
      { period: '26-01', value: 15750, yoy: '-4.0%', mom: '-0.3%' },
      { period: '26-02', value: 15700, yoy: '-4.0%', mom: '-0.3%' },
      { period: '26-03', value: 15650, yoy: '-4.1%', mom: '-0.3%' },
      { period: '26-04', value: 15600, yoy: '-4.1%', mom: '-0.3%' },
      { period: '26-05', value: 15550, yoy: '-4.2%', mom: '-0.3%' },
      { period: '26-06', value: 15520, yoy: '-4.2%', mom: '-0.2%' },
      { period: '26-07', value: 15500, yoy: '-4.2%', mom: '-0.1%' },
      { period: '26-08', value: 15480, yoy: '-4.2%', mom: '-0.1%' },
    ],
  },
  {
    id: 'm-energy-saving-equipment-ratio',
    code: 'GK-09',
    name: '节能装备应用占比',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: '%',
    curVal: '92.4',
    yoy: '+3.8%',
    isYoyDown: false,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内达到或优于能效强制性国家标准 2 级水平和《重点用能产品设备能效先进水平、节能水平和准入水平》节能水平的装备累计额定总功率占纳入统计范围装备累计额定总功率的比例。',
    formula: 'S = (R_es / E_ts) × 100%',
    formulaDesc: '月度指标。S: 节能装备应用占比；R_es: 达到或优于能效国标 2 级水平装备累计额定总功率 (kW)；E_ts: 纳入统计范围装备累计额定总功率 (kW)。',
    numeratorName: '能效2级及以上先进节能装备总额定功率 R_es',
    numeratorVal: '32,850 kW',
    denominatorName: '纳入统计范围设备总额定功率 E_ts',
    denominatorVal: '35,550 kW',
    dataSource: '设备资产台账及能效铭牌技术参数库，覆盖高效电动机、节能变压器、工业锅炉、磁悬浮空压机等。',
    rawMeters: [
      { medium: '能效设备台账', meterCode: 'EQ-ASSET-01', location: '动力科', reading: '32,850 / 35,550 kW', unit: 'kW', coeff: '1.0', tce: '-' },
    ],
    trendHistory: [
      { period: '25-09', value: 88.5, yoy: '+2.5%', mom: '+0.0%' },
      { period: '25-10', value: 88.5, yoy: '+2.5%', mom: '+0.0%' },
      { period: '25-11', value: 89.2, yoy: '+2.8%', mom: '+0.8%' },
      { period: '25-12', value: 90.0, yoy: '+3.1%', mom: '+0.9%' },
      { period: '26-01', value: 90.5, yoy: '+3.2%', mom: '+0.6%' },
      { period: '26-02', value: 90.5, yoy: '+3.2%', mom: '+0.0%' },
      { period: '26-03', value: 91.2, yoy: '+3.5%', mom: '+0.8%' },
      { period: '26-04', value: 91.5, yoy: '+3.6%', mom: '+0.3%' },
      { period: '26-05', value: 91.8, yoy: '+3.6%', mom: '+0.3%' },
      { period: '26-06', value: 92.0, yoy: '+3.7%', mom: '+0.2%' },
      { period: '26-07', value: 92.2, yoy: '+3.8%', mom: '+0.2%' },
      { period: '26-08', value: 92.4, yoy: '+3.8%', mom: '+0.2%' },
    ],
  },
  {
    id: 'm-pcf-ratio',
    code: 'GK-10',
    name: '开展产品碳足迹分析占比',
    category: 'company',
    categoryName: '一、经营单位及项目公司整体指标',
    unit: '%',
    curVal: '85.7',
    yoy: '+12.5%',
    isYoyDown: false,
    status: '常规监测',
    statusType: 'green',
    badge: '国家级零碳工厂',
    tipText: '指统计期内开展主要产品碳足迹分析的产品类别数量占主要产品类别总数的比值。',
    formula: 'R_cf = (N_cf / N) × 100%',
    formulaDesc: '月度指标。R_cf: 开展产品碳足迹分析占比；N_cf: 开展主要产品碳足迹分析的产品类别数量；N: 主要产品类别总数。',
    numeratorName: '已开展主要产品碳足迹分析的产品类别数 N_cf',
    numeratorVal: '12 类',
    denominatorName: '主要产品类别总数 N',
    denominatorVal: '14 类',
    dataSource: '产品碳足迹集采中心实景数据库与生命周期评估 (LCA) 认证报告清单。',
    rawMeters: [
      { medium: '碳足迹认证台账', meterCode: 'PCF-CERT-01', location: '集采中心', reading: '12 / 14 类别', unit: '类', coeff: '1.0', tce: '-' },
    ],
    trendHistory: [
      { period: '25-09', value: 71.4, yoy: '+8.0%', mom: '+0.0%' },
      { period: '25-10', value: 71.4, yoy: '+8.0%', mom: '+0.0%' },
      { period: '25-11', value: 78.6, yoy: '+10.2%', mom: '+7.2%' },
      { period: '25-12', value: 78.6, yoy: '+10.2%', mom: '+0.0%' },
      { period: '26-01', value: 78.6, yoy: '+10.2%', mom: '+0.0%' },
      { period: '26-02', value: 78.6, yoy: '+10.2%', mom: '+0.0%' },
      { period: '26-03', value: 85.7, yoy: '+14.3%', mom: '+7.1%' },
      { period: '26-04', value: 85.7, yoy: '+14.3%', mom: '+0.0%' },
      { period: '26-05', value: 85.7, yoy: '+14.3%', mom: '+0.0%' },
      { period: '26-06', value: 85.7, yoy: '+14.3%', mom: '+0.0%' },
      { period: '26-07', value: 85.7, yoy: '+14.3%', mom: '+0.0%' },
      { period: '26-08', value: 85.7, yoy: '+12.5%', mom: '+0.0%' },
    ],
  },
]

// 2. 二、产品管控指标
const PRODUCT_CONTROL_METRICS: IndicatorMetric[] = [
  {
    id: 'm-prod-tce',
    code: 'CP-01',
    name: '单位产品能耗（型号）',
    category: 'product',
    categoryName: '二、产品管控指标',
    unit: 'tce/万kVA',
    curVal: '0.317',
    yoy: '-6.2%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '综合单耗',
    tipText: '指统计期内综合能源总消费量与产品产量的比值。',
    formula: 'e = E / M',
    formulaDesc: '月度指标。e: 单位产品能耗，单位为 tce/产品单位；E: 综合能源消费量，单位 tce；M: 产品产量，单位为产品单位，如万kVA、万km*mm²等。',
    numeratorName: '综合能源消费量 E',
    numeratorVal: '1,577.2 tce',
    denominatorName: '产品产量 M (下线容量)',
    denominatorVal: '4,975.4 万kVA',
    dataSource: 'MES 生产工单产出量与车间嵌入式电能/蒸汽分表。',
    rawMeters: [
      { medium: '综合折标能耗', meterCode: 'SUM-PROD-ENERGY', location: '超高压变压器车间', reading: '1,577.2 tce', unit: 'tce', coeff: '1.0', tce: '1,577.2' },
    ],
    trendHistory: [
      { period: '25-09', value: 0.345, yoy: '-4.2%', mom: '-0.5%' },
      { period: '25-10', value: 0.341, yoy: '-4.5%', mom: '-1.1%' },
      { period: '25-11', value: 0.338, yoy: '-4.8%', mom: '-0.8%' },
      { period: '25-12', value: 0.342, yoy: '-4.5%', mom: '+1.1%' },
      { period: '26-01', value: 0.335, yoy: '-5.2%', mom: '-2.0%' },
      { period: '26-02', value: 0.334, yoy: '-5.3%', mom: '-0.3%' },
      { period: '26-03', value: 0.338, yoy: '-5.0%', mom: '+1.2%' },
      { period: '26-04', value: 0.332, yoy: '-5.4%', mom: '-1.7%' },
      { period: '26-05', value: 0.328, yoy: '-5.8%', mom: '-1.2%' },
      { period: '26-06', value: 0.325, yoy: '-6.0%', mom: '-0.9%' },
      { period: '26-07', value: 0.321, yoy: '-6.1%', mom: '-1.2%' },
      { period: '26-08', value: 0.317, yoy: '-6.2%', mom: '-1.2%' },
    ],
  },
  {
    id: 'm-prod-elec',
    code: 'CP-02',
    name: '单位产品电耗',
    category: 'product',
    categoryName: '二、产品管控指标',
    unit: 'kWh/万kVA',
    curVal: '2,420.5',
    yoy: '-5.8%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '单电耗',
    tipText: '指统计期内电能源消费量（包括公辅设备）与产品产量的比值。',
    formula: 'q_电 = Q_电 / M',
    formulaDesc: '月度指标。q_电: 单位产品电耗，单位为 kWh/产品单位；Q_电: 电能源消费量，单位 kWh；M: 产品产量，单位为产品单位，如万kVA、万km*mm²等。',
    numeratorName: '电能源消费量 Q_电 (含公辅)',
    numeratorVal: '12,043,000 kWh',
    denominatorName: '产品产量 M (下线容量)',
    denominatorVal: '4,975.4 万kVA',
    dataSource: '变电所专线电表与公辅配电智能表。',
    rawMeters: [
      { medium: '生产及公辅用电', meterCode: 'EM-PROD-SUM', location: '全车间电网', reading: '12,043,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '1,480.1' },
    ],
    trendHistory: [
      { period: '25-09', value: 2600, yoy: '-4.2%', mom: '-0.8%' },
      { period: '25-10', value: 2580, yoy: '-4.5%', mom: '-0.7%' },
      { period: '25-11', value: 2560, yoy: '-4.8%', mom: '-0.7%' },
      { period: '25-12', value: 2590, yoy: '-4.3%', mom: '+1.1%' },
      { period: '26-01', value: 2530, yoy: '-5.0%', mom: '-2.3%' },
      { period: '26-02', value: 2525, yoy: '-5.1%', mom: '-0.2%' },
      { period: '26-03', value: 2560, yoy: '-4.8%', mom: '+1.4%' },
      { period: '26-04', value: 2520, yoy: '-5.0%', mom: '-1.5%' },
      { period: '26-05', value: 2480, yoy: '-5.3%', mom: '-1.6%' },
      { period: '26-06', value: 2460, yoy: '-5.5%', mom: '-0.8%' },
      { period: '26-07', value: 2435, yoy: '-5.7%', mom: '-1.0%' },
      { period: '26-08', value: 2420.5, yoy: '-5.8%', mom: '-0.6%' },
    ],
  },
  {
    id: 'm-prod-steam',
    code: 'CP-03',
    name: '单位产品蒸汽消耗',
    category: 'product',
    categoryName: '二、产品管控指标',
    unit: 'GJ/万kVA',
    curVal: '3.85',
    yoy: '-4.5%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'purple',
    badge: '单汽耗',
    tipText: '指统计期内蒸汽能源消费量与产品产量的比值。',
    formula: 'q_蒸汽 = Q_蒸汽 / M',
    formulaDesc: '月度指标。q_蒸汽: 单位产品蒸汽消耗，单位为 GJ/产品单位；Q_蒸汽: 蒸汽能源消费量，单位 GJ；M: 产品产量，单位为产品单位，如万kVA、万km*mm²等。',
    numeratorName: '蒸汽能源消费量 Q_蒸汽',
    numeratorVal: '19,155.3 GJ',
    denominatorName: '产品产量 M',
    denominatorVal: '4,975.4 万kVA',
    dataSource: '蒸汽减温减压站专表。',
    rawMeters: [
      { medium: '过热蒸汽', meterCode: 'STM-PROD-01', location: '气相干燥站', reading: '6,450 t (19,155.3 GJ)', unit: 'GJ', coeff: '0.1286', tce: '829.5' },
    ],
    trendHistory: [
      { period: '25-09', value: 4.15, yoy: '-3.2%', mom: '-0.5%' },
      { period: '25-10', value: 4.10, yoy: '-3.5%', mom: '-1.2%' },
      { period: '25-11', value: 4.08, yoy: '-3.7%', mom: '-0.5%' },
      { period: '25-12', value: 4.12, yoy: '-3.4%', mom: '+1.0%' },
      { period: '26-01', value: 4.02, yoy: '-3.9%', mom: '-2.4%' },
      { period: '26-02', value: 4.00, yoy: '-4.0%', mom: '-0.5%' },
      { period: '26-03', value: 4.08, yoy: '-3.8%', mom: '+2.0%' },
      { period: '26-04', value: 4.01, yoy: '-4.0%', mom: '-1.7%' },
      { period: '26-05', value: 3.96, yoy: '-4.2%', mom: '-1.2%' },
      { period: '26-06', value: 3.92, yoy: '-4.3%', mom: '-1.0%' },
      { period: '26-07', value: 3.88, yoy: '-4.4%', mom: '-1.0%' },
      { period: '26-08', value: 3.85, yoy: '-4.5%', mom: '-0.8%' },
    ],
  },
  {
    id: 'm-prod-gas',
    code: 'CP-04',
    name: '单位产品天然气消耗',
    category: 'product',
    categoryName: '二、产品管控指标',
    unit: 'm³/万kVA',
    curVal: '45.2',
    yoy: '-4.1%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'green',
    badge: '单气耗',
    tipText: '指统计期内天然气能源消费量与产品产量的比值。',
    formula: 'q_天然气 = Q_天然气 / M',
    formulaDesc: '月度指标。q_天然气: 单位产品天然气消耗，单位为 m³/产品单位；Q_天然气: 天然气能源消费量，单位 m³；M: 产品产量，单位为产品单位，如万kVA、万km*mm²等。',
    numeratorName: '天然气能源消费量 Q_天然气',
    numeratorVal: '224,888 m³',
    denominatorName: '产品产量 M',
    denominatorVal: '4,975.4 万kVA',
    dataSource: '燃气门站流量计与固化炉流量计。',
    rawMeters: [
      { medium: '天然气', meterCode: 'GAS-PROD-01', location: '热风炉门站', reading: '224,888 m³', unit: 'm³', coeff: '1.3300', tce: '299.1' },
    ],
    trendHistory: [
      { period: '25-09', value: 48.5, yoy: '-2.8%', mom: '-0.5%' },
      { period: '25-10', value: 48.0, yoy: '-3.0%', mom: '-1.0%' },
      { period: '25-11', value: 47.6, yoy: '-3.2%', mom: '-0.8%' },
      { period: '25-12', value: 48.2, yoy: '-2.9%', mom: '+1.2%' },
      { period: '26-01', value: 47.0, yoy: '-3.5%', mom: '-2.5%' },
      { period: '26-02', value: 46.8, yoy: '-3.6%', mom: '-0.4%' },
      { period: '26-03', value: 47.8, yoy: '-3.2%', mom: '+2.1%' },
      { period: '26-04', value: 47.1, yoy: '-3.5%', mom: '-1.5%' },
      { period: '26-05', value: 46.5, yoy: '-3.8%', mom: '-1.3%' },
      { period: '26-06', value: 46.0, yoy: '-3.9%', mom: '-1.0%' },
      { period: '26-07', value: 45.6, yoy: '-4.0%', mom: '-0.9%' },
      { period: '26-08', value: 45.2, yoy: '-4.1%', mom: '-0.9%' },
    ],
  },
  {
    id: 'm-prod-water',
    code: 'CP-05',
    name: '单位产品水耗',
    category: 'product',
    categoryName: '二、产品管控指标',
    unit: 't/万kVA',
    curVal: '12.4',
    yoy: '-3.9%',
    isYoyDown: true,
    status: '常规监测',
    statusType: 'blue',
    badge: '单水耗',
    tipText: '指统计期内水能源消费量与产品产量的比值。',
    formula: 'q_水 = Q_水 / M',
    formulaDesc: '月度指标。q_水: 单位产品水耗，单位为 t/产品单位；Q_水: 水能源消费量，单位 t；M: 产品产量，单位为产品单位，如万kVA、万km*mm²等。',
    numeratorName: '水能源消费量 Q_水',
    numeratorVal: '61,695 t',
    denominatorName: '产品产量 M',
    denominatorVal: '4,975.4 万kVA',
    dataSource: '车间冷却水与生产关口表。',
    rawMeters: [
      { medium: '新鲜水', meterCode: 'WM-PROD-01', location: '水表房', reading: '61,695 t', unit: 't', coeff: '0.0857', tce: '-' },
    ],
    trendHistory: [
      { period: '25-09', value: 13.5, yoy: '-2.5%', mom: '-0.5%' },
      { period: '25-10', value: 13.3, yoy: '-2.8%', mom: '-1.5%' },
      { period: '25-11', value: 13.1, yoy: '-3.0%', mom: '-1.5%' },
      { period: '25-12', value: 13.4, yoy: '-2.7%', mom: '+2.3%' },
      { period: '26-01', value: 12.9, yoy: '-3.3%', mom: '-3.7%' },
      { period: '26-02', value: 12.8, yoy: '-3.4%', mom: '-0.8%' },
      { period: '26-03', value: 13.2, yoy: '-3.0%', mom: '+3.1%' },
      { period: '26-04', value: 13.0, yoy: '-3.2%', mom: '-1.5%' },
      { period: '26-05', value: 12.8, yoy: '-3.5%', mom: '-1.5%' },
      { period: '26-06', value: 12.6, yoy: '-3.7%', mom: '-1.6%' },
      { period: '26-07', value: 12.5, yoy: '-3.8%', mom: '-0.8%' },
      { period: '26-08', value: 12.4, yoy: '-3.9%', mom: '-0.8%' },
    ],
  },
]

// 3. 三、关键制造工序能效管控指标 (全量标准规范 17-65 序号表)
const PROCESS_CONTROL_METRICS: IndicatorMetric[] = [
  {
    id: 'm-17', code: '17', name: '吨铜电耗（线缆-拉丝）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/t', curVal: '142.5', yoy: '-3.8%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '线缆拉丝',
    tipText: '拉丝工序，拉1吨铜耗电量 (电装管理要求集控)', formula: 'q_线-拉丝Cu-电 = Q_线-拉丝Cu-电 / M_线-拉丝Cu', formulaDesc: '月度指标。q: 单位铜电耗 (kWh/t)；Q: 电能消耗 (kWh)；M: 铜产量 (t)。',
    numeratorName: '线缆拉丝工序电能源消费量 Q', numeratorVal: '456,000 kWh', denominatorName: '拉丝工序铜产量 M', denominatorVal: '3,200 t', dataSource: '大拉机智能电表与 MES 产线称重记录。',
    rawMeters: [{ medium: '铜拉丝用电', meterCode: 'EQ-DRAW-CU-01', location: '拉丝车间', reading: '456,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '56.0' }],
    trendHistory: [{ period: '25-09', value: 152.0, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 150.0, yoy: '-3.0%', mom: '-1.3%' }, { period: '25-11', value: 149.0, yoy: '-3.1%', mom: '-0.7%' }, { period: '25-12', value: 151.0, yoy: '-2.9%', mom: '+1.3%' }, { period: '26-01', value: 147.0, yoy: '-3.3%', mom: '-2.6%' }, { period: '26-02', value: 146.5, yoy: '-3.4%', mom: '-0.3%' }, { period: '26-03', value: 148.0, yoy: '-3.2%', mom: '+1.0%' }, { period: '26-04', value: 146.5, yoy: '-3.4%', mom: '-1.0%' }, { period: '26-05', value: 145.0, yoy: '-3.5%', mom: '-1.0%' }, { period: '26-06', value: 144.2, yoy: '-3.6%', mom: '-0.5%' }, { period: '26-07', value: 143.0, yoy: '-3.7%', mom: '-0.8%' }, { period: '26-08', value: 142.5, yoy: '-3.8%', mom: '-0.3%' }],
  },
  {
    id: 'm-18', code: '18', name: '吨铝电耗（线缆-拉丝）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/t', curVal: '215.0', yoy: '-4.1%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '铝拉丝',
    tipText: '拉丝工序，拉1吨铝耗电量 (电装管理要求集控)', formula: 'q_线-拉丝Al-电 = Q_线-拉丝Al-电 / M_线-拉丝Al', formulaDesc: '月度指标。q: 单位铝电耗 (kWh/t)；Q: 电能消耗 (kWh)；M: 铝产量 (t)。',
    numeratorName: '线缆铝拉丝用电总量 Q', numeratorVal: '537,500 kWh', denominatorName: '铝拉丝产线产量 M', denominatorVal: '2,500 t', dataSource: '铝拉丝机组智能电表。',
    rawMeters: [{ medium: '铝拉丝电力', meterCode: 'EQ-DRAW-AL-01', location: '铝缆车间', reading: '537,500 kWh', unit: 'kWh', coeff: '0.1229', tce: '66.1' }],
    trendHistory: [{ period: '25-09', value: 228.0, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 225.0, yoy: '-3.2%', mom: '-1.3%' }, { period: '25-11', value: 223.0, yoy: '-3.4%', mom: '-0.9%' }, { period: '25-12', value: 226.0, yoy: '-3.1%', mom: '+1.3%' }, { period: '26-01', value: 220.0, yoy: '-3.7%', mom: '-2.7%' }, { period: '26-02', value: 219.5, yoy: '-3.8%', mom: '-0.2%' }, { period: '26-03', value: 224.0, yoy: '-3.5%', mom: '+2.0%' }, { period: '26-04', value: 221.5, yoy: '-3.7%', mom: '-1.1%' }, { period: '26-05', value: 219.0, yoy: '-3.8%', mom: '-1.1%' }, { period: '26-06', value: 217.5, yoy: '-3.9%', mom: '-0.7%' }, { period: '26-07', value: 216.0, yoy: '-4.0%', mom: '-0.7%' }, { period: '26-08', value: 215.0, yoy: '-4.1%', mom: '-0.5%' }],
  },
  {
    id: 'm-19', code: '19', name: '交联电耗（线缆-中低压-交联）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/km*mm²', curVal: '18.4', yoy: '-3.6%', isYoyDown: true, status: '常规监测', statusType: 'blue', badge: '中低压交联',
    tipText: '中低压产线交联工序，单位产量耗电量', formula: 'q_线-中低压-交联-电 = Q / M', formulaDesc: '月度指标。q: 单位电耗 (kWh/km*mm²)；Q: 电能消耗 (kWh)；M: 产品规格产量 (km*mm²)。',
    numeratorName: '中低压交联线用电量 Q', numeratorVal: '736,000 kWh', denominatorName: '交联产品规格产量 M', denominatorVal: '40,000 km*mm²', dataSource: '中低压立塔交联机电表与 MES 规格汇总。',
    rawMeters: [{ medium: '交联塔电力', meterCode: 'EQ-XLPE-LOW', location: '交联车间', reading: '736,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '90.5' }],
    trendHistory: [{ period: '25-09', value: 19.5, yoy: '-2.5%', mom: '-0.5%' }, { period: '25-10', value: 19.3, yoy: '-2.8%', mom: '-1.0%' }, { period: '25-11', value: 19.2, yoy: '-2.9%', mom: '-0.5%' }, { period: '25-12', value: 19.6, yoy: '-2.6%', mom: '+2.1%' }, { period: '26-01', value: 18.9, yoy: '-3.2%', mom: '-3.6%' }, { period: '26-02', value: 18.8, yoy: '-3.3%', mom: '-0.5%' }, { period: '26-03', value: 19.1, yoy: '-3.0%', mom: '+1.6%' }, { period: '26-04', value: 18.9, yoy: '-3.2%', mom: '-1.0%' }, { period: '26-05', value: 18.7, yoy: '-3.4%', mom: '-1.1%' }, { period: '26-06', value: 18.6, yoy: '-3.5%', mom: '-0.5%' }, { period: '26-07', value: 18.5, yoy: '-3.5%', mom: '-0.5%' }, { period: '26-08', value: 18.4, yoy: '-3.6%', mom: '-0.5%' }],
  },
  {
    id: 'm-20', code: '20', name: '交联电耗（线缆-高压-交联）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/km*mm²', curVal: '24.2', yoy: '-4.8%', isYoyDown: true, status: '常规监测', statusType: 'blue', badge: '高压交联',
    tipText: '高压产线交联工序，单位产量耗电量', formula: 'q_线-高压-交联-电 = Q / M', formulaDesc: '月度指标。q: 单位电耗 (kWh/km*mm²)；Q: 电能消耗 (kWh)；M: 规格产量 (km*mm²)。',
    numeratorName: '500kV 悬垂立塔交联用电量 Q', numeratorVal: '1,210,000 kWh', denominatorName: '高压交联规格产量 M', denominatorVal: '50,000 km*mm²', dataSource: '500kV 悬垂立塔专用开闭所智能电表。',
    rawMeters: [{ medium: '立塔高压用电', meterCode: 'EQ-XLPE-HIGH-01', location: '超高压立塔', reading: '1,210,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '148.7' }],
    trendHistory: [{ period: '25-09', value: 25.8, yoy: '-3.8%', mom: '-0.5%' }, { period: '25-10', value: 25.4, yoy: '-4.0%', mom: '-1.5%' }, { period: '25-11', value: 25.1, yoy: '-4.2%', mom: '-1.2%' }, { period: '25-12', value: 25.6, yoy: '-3.9%', mom: '+2.0%' }, { period: '26-01', value: 24.8, yoy: '-4.5%', mom: '-3.1%' }, { period: '26-02', value: 24.6, yoy: '-4.6%', mom: '-0.8%' }, { period: '26-03', value: 25.4, yoy: '-4.0%', mom: '+3.2%' }, { period: '26-04', value: 25.1, yoy: '-4.2%', mom: '-1.2%' }, { period: '26-05', value: 24.8, yoy: '-4.5%', mom: '-1.2%' }, { period: '26-06', value: 24.6, yoy: '-4.6%', mom: '-0.8%' }, { period: '26-07', value: 24.4, yoy: '-4.7%', mom: '-0.8%' }, { period: '26-08', value: 24.2, yoy: '-4.8%', mom: '-0.8%' }],
  },
  {
    id: 'm-21', code: '21', name: '单位产值能耗（变压器-高压-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'tce/万元', curVal: '0.0125', yoy: '-5.3%', isYoyDown: true, status: '常规监测', statusType: 'purple', badge: '高压干燥',
    tipText: '变压器高压产线干燥工序每万元产值综合能耗', formula: 'g_变-高压-干燥 = E / G', formulaDesc: '月度指标。g: 单位产值能耗 (tce/万元)；E: 干燥工序综合能耗 (tce)；G: 产值 (万元)。',
    numeratorName: '高压气相干燥工序综合能耗 E', numeratorVal: '185.3 tce', denominatorName: '高压干燥产线对应产值 G', denominatorVal: '14,824.0 万元', dataSource: '1-6号煤油气相干燥罐电表与减温站蒸汽流量计。',
    rawMeters: [{ medium: '气相干燥电/汽', meterCode: 'EQ-DRY-HIGH-SUM', location: '干燥车间', reading: '185.3 tce', unit: 'tce', coeff: '1.0', tce: '185.3' }],
    trendHistory: [{ period: '25-09', value: 0.0135, yoy: '-4.0%', mom: '-0.5%' }, { period: '25-10', value: 0.0132, yoy: '-4.5%', mom: '-2.2%' }, { period: '25-11', value: 0.0130, yoy: '-4.8%', mom: '-1.5%' }, { period: '25-12', value: 0.0133, yoy: '-4.2%', mom: '+2.3%' }, { period: '26-01', value: 0.0128, yoy: '-5.0%', mom: '-3.7%' }, { period: '26-02', value: 0.0127, yoy: '-5.1%', mom: '-0.8%' }, { period: '26-03', value: 0.0132, yoy: '-4.5%', mom: '+3.9%' }, { period: '26-04', value: 0.0130, yoy: '-4.8%', mom: '-1.5%' }, { period: '26-05', value: 0.0128, yoy: '-5.0%', mom: '-1.5%' }, { period: '26-06', value: 0.0127, yoy: '-5.1%', mom: '-0.8%' }, { period: '26-07', value: 0.0126, yoy: '-5.2%', mom: '-0.8%' }, { period: '26-08', value: 0.0125, yoy: '-5.3%', mom: '-0.8%' }],
  },
  {
    id: 'm-22', code: '22', name: '单位产值能耗（变压器-中低压-油变-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'tce/万元', curVal: '0.0108', yoy: '-4.6%', isYoyDown: true, status: '常规监测', statusType: 'purple', badge: '油变干燥',
    tipText: '变压器中低压产线油变干燥工序每万元产值综合能耗', formula: 'g_变-中低压-油变-干燥 = E / G', formulaDesc: '月度指标。g: 单位产值能耗 (tce/万元)；E: 综合能耗 (tce)；G: 产值 (万元)。',
    numeratorName: '中低压油变干燥能耗 E', numeratorVal: '95.0 tce', denominatorName: '中低压油变干燥产值 G', denominatorVal: '8,796.3 万元', dataSource: '中低压油变干燥罐分表。',
    rawMeters: [{ medium: '油变干燥能耗', meterCode: 'EQ-DRY-LOW-OIL', location: '中低压车间', reading: '95.0 tce', unit: 'tce', coeff: '1.0', tce: '95.0' }],
    trendHistory: [{ period: '25-09', value: 0.0116, yoy: '-3.5%', mom: '-0.5%' }, { period: '25-10', value: 0.0113, yoy: '-3.8%', mom: '-2.5%' }, { period: '25-11', value: 0.0111, yoy: '-4.0%', mom: '-1.8%' }, { period: '25-12', value: 0.0114, yoy: '-3.6%', mom: '+2.7%' }, { period: '26-01', value: 0.0110, yoy: '-4.2%', mom: '-3.5%' }, { period: '26-02', value: 0.0109, yoy: '-4.4%', mom: '-0.9%' }, { period: '26-03', value: 0.0113, yoy: '-3.8%', mom: '+3.7%' }, { period: '26-04', value: 0.0111, yoy: '-4.0%', mom: '-1.8%' }, { period: '26-05', value: 0.0110, yoy: '-4.2%', mom: '-0.9%' }, { period: '26-06', value: 0.0109, yoy: '-4.4%', mom: '-0.9%' }, { period: '26-07', value: 0.0108, yoy: '-4.5%', mom: '-0.9%' }, { period: '26-08', value: 0.0108, yoy: '-4.6%', mom: '0.0%' }],
  },
  {
    id: 'm-23', code: '23', name: '单位产值能耗（变压器-中低压-干变-固化）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'tce/万元', curVal: '0.0094', yoy: '-4.2%', isYoyDown: true, status: '常规监测', statusType: 'purple', badge: '干变固化',
    tipText: '变压器中低压产线干变固化工序每万元产值综合能耗', formula: 'g_变-中低压-干变-固化 = E / G', formulaDesc: '月度指标。g: 单位产值能耗 (tce/万元)；E: 固化能耗 (tce)；G: 产值 (万元)。',
    numeratorName: '干变固化烘房能耗 E', numeratorVal: '76.5 tce', denominatorName: '干变产线产值 G', denominatorVal: '8,138.3 万元', dataSource: '干变树脂浇注固化烘房智能表。',
    rawMeters: [{ medium: '浇注固化用电', meterCode: 'EQ-CURE-DRY', location: '干变车间', reading: '76.5 tce', unit: 'tce', coeff: '1.0', tce: '76.5' }],
    trendHistory: [{ period: '25-09', value: 0.0100, yoy: '-3.2%', mom: '-0.5%' }, { period: '25-10', value: 0.0098, yoy: '-3.5%', mom: '-2.0%' }, { period: '25-11', value: 0.0097, yoy: '-3.7%', mom: '-1.0%' }, { period: '25-12', value: 0.0099, yoy: '-3.4%', mom: '+2.1%' }, { period: '26-01', value: 0.0096, yoy: '-3.9%', mom: '-3.0%' }, { period: '26-02', value: 0.0095, yoy: '-4.0%', mom: '-1.0%' }, { period: '26-03', value: 0.0098, yoy: '-3.5%', mom: '+3.1%' }, { period: '26-04', value: 0.0097, yoy: '-3.7%', mom: '-1.0%' }, { period: '26-05', value: 0.0096, yoy: '-3.9%', mom: '-1.0%' }, { period: '26-06', value: 0.0095, yoy: '-4.0%', mom: '-1.0%' }, { period: '26-07', value: 0.0094, yoy: '-4.1%', mom: '-1.0%' }, { period: '26-08', value: 0.0094, yoy: '-4.2%', mom: '0.0%' }],
  },
  {
    id: 'm-24', code: '24', name: '单位产值电耗（变压器-高压-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '98.5', yoy: '-4.0%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '高压干燥电耗',
    tipText: '变压器高压产线干燥工序每万元产值电耗', formula: 'u_变-高压-干燥-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 电能消耗 (kWh)；G: 产值 (万元)。',
    numeratorName: '高压干燥罐用电量 Q', numeratorVal: '1,460,000 kWh', denominatorName: '高压干燥产值 G', denominatorVal: '14,824.0 万元', dataSource: '高压真空干燥罐变频主电表。',
    rawMeters: [{ medium: '干燥用电', meterCode: 'EM-DRY-HIGH-ELEC', location: '干燥车间', reading: '1,460,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '179.4' }],
    trendHistory: [{ period: '25-09', value: 104.0, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 102.5, yoy: '-3.2%', mom: '-1.4%' }, { period: '25-11', value: 101.0, yoy: '-3.5%', mom: '-1.5%' }, { period: '25-12', value: 103.0, yoy: '-3.1%', mom: '+2.0%' }, { period: '26-01', value: 99.8, yoy: '-3.8%', mom: '-3.1%' }, { period: '26-02', value: 99.2, yoy: '-3.9%', mom: '-0.6%' }, { period: '26-03', value: 102.5, yoy: '-3.2%', mom: '+3.3%' }, { period: '26-04', value: 101.0, yoy: '-3.5%', mom: '-1.5%' }, { period: '26-05', value: 99.8, yoy: '-3.8%', mom: '-1.2%' }, { period: '26-06', value: 99.2, yoy: '-3.9%', mom: '-0.6%' }, { period: '26-07', value: 98.8, yoy: '-4.0%', mom: '-0.4%' }, { period: '26-08', value: 98.5, yoy: '-4.0%', mom: '-0.3%' }],
  },
  {
    id: 'm-25', code: '25', name: '单位产值电耗（变压器-中低压-油变-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '85.2', yoy: '-3.8%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '油变干燥电耗',
    tipText: '变压器中低压产线油变干燥工序每万元产值电耗', formula: 'u_变-中低压-油变-干燥-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 电消耗 (kWh)；G: 产值 (万元)。',
    numeratorName: '中低压油变干燥用电量 Q', numeratorVal: '749,445 kWh', denominatorName: '中低压油变干燥产值 G', denominatorVal: '8,796.3 万元', dataSource: '油变干燥罐专用电表。',
    rawMeters: [{ medium: '干燥电能', meterCode: 'EM-DRY-LOW-ELEC', location: '油变车间', reading: '749,445 kWh', unit: 'kWh', coeff: '0.1229', tce: '92.1' }],
    trendHistory: [{ period: '25-09', value: 90.0, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 88.5, yoy: '-3.0%', mom: '-1.7%' }, { period: '25-11', value: 87.2, yoy: '-3.2%', mom: '-1.5%' }, { period: '25-12', value: 89.0, yoy: '-2.9%', mom: '+2.1%' }, { period: '26-01', value: 86.5, yoy: '-3.5%', mom: '-2.8%' }, { period: '26-02', value: 86.0, yoy: '-3.6%', mom: '-0.6%' }, { period: '26-03', value: 88.5, yoy: '-3.0%', mom: '+2.9%' }, { period: '26-04', value: 87.2, yoy: '-3.2%', mom: '-1.5%' }, { period: '26-05', value: 86.5, yoy: '-3.5%', mom: '-0.8%' }, { period: '26-06', value: 86.0, yoy: '-3.6%', mom: '-0.6%' }, { period: '26-07', value: 85.6, yoy: '-3.7%', mom: '-0.5%' }, { period: '26-08', value: 85.2, yoy: '-3.8%', mom: '-0.5%' }],
  },
  {
    id: 'm-26', code: '26', name: '单位产值电耗（变压器-中低压-干变-固化）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '76.4', yoy: '-3.5%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '干变固化电耗',
    tipText: '变压器中低压产线干变固化工序每万元产值电耗', formula: 'u_变-中低压-干变-固化-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 电消耗 (kWh)；G: 产值 (万元)。',
    numeratorName: '干变浇注固化用电量 Q', numeratorVal: '621,766 kWh', denominatorName: '干变固化产值 G', denominatorVal: '8,138.3 万元', dataSource: '干变固化烘房控制器电表。',
    rawMeters: [{ medium: '烘房用电', meterCode: 'EM-CURE-ELEC', location: '干变车间', reading: '621,766 kWh', unit: 'kWh', coeff: '0.1229', tce: '76.4' }],
    trendHistory: [{ period: '25-09', value: 80.5, yoy: '-2.5%', mom: '-0.5%' }, { period: '25-10', value: 79.2, yoy: '-2.8%', mom: '-1.6%' }, { period: '25-11', value: 78.5, yoy: '-3.0%', mom: '-0.9%' }, { period: '25-12', value: 79.8, yoy: '-2.7%', mom: '+1.7%' }, { period: '26-01', value: 77.6, yoy: '-3.2%', mom: '-2.8%' }, { period: '26-02', value: 77.2, yoy: '-3.3%', mom: '-0.5%' }, { period: '26-03', value: 79.2, yoy: '-2.8%', mom: '+2.6%' }, { period: '26-04', value: 78.5, yoy: '-3.0%', mom: '-0.9%' }, { period: '26-05', value: 77.6, yoy: '-3.2%', mom: '-1.1%' }, { period: '26-06', value: 77.2, yoy: '-3.3%', mom: '-0.5%' }, { period: '26-07', value: 76.8, yoy: '-3.4%', mom: '-0.5%' }, { period: '26-08', value: 76.4, yoy: '-3.5%', mom: '-0.5%' }],
  },
  {
    id: 'm-27', code: '27', name: '单位产值蒸汽消耗（变压器-高压-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 't/万元', curVal: '0.288', yoy: '-4.2%', isYoyDown: true, status: '常规监测', statusType: 'purple', badge: '高压干燥蒸汽',
    tipText: '变压器高压产线干燥工序每万元产值蒸汽消耗', formula: 'u_变-高压-干燥-蒸汽 = Q / G', formulaDesc: '月度指标。u: 单位产值蒸汽耗 (t/万元)；Q: 蒸汽量 (t)；G: 产值 (万元)。',
    numeratorName: '高压干燥气相加热用蒸汽量 Q', numeratorVal: '4,269.3 t', denominatorName: '高压干燥产值 G', denominatorVal: '14,824.0 万元', dataSource: '干燥车间蒸汽总进管流量计。',
    rawMeters: [{ medium: '过热蒸汽', meterCode: 'STM-DRY-HIGH-01', location: '干燥站', reading: '4,269.3 t', unit: 't', coeff: '0.1286', tce: '549.0' }],
    trendHistory: [{ period: '25-09', value: 0.308, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 0.302, yoy: '-3.3%', mom: '-1.9%' }, { period: '25-11', value: 0.298, yoy: '-3.6%', mom: '-1.3%' }, { period: '25-12', value: 0.304, yoy: '-3.2%', mom: '+2.0%' }, { period: '26-01', value: 0.294, yoy: '-3.9%', mom: '-3.3%' }, { period: '26-02', value: 0.292, yoy: '-4.0%', mom: '-0.7%' }, { period: '26-03', value: 0.302, yoy: '-3.3%', mom: '+3.4%' }, { period: '26-04', value: 0.298, yoy: '-3.6%', mom: '-1.3%' }, { period: '26-05', value: 0.294, yoy: '-3.9%', mom: '-1.3%' }, { period: '26-06', value: 0.292, yoy: '-4.0%', mom: '-0.7%' }, { period: '26-07', value: 0.290, yoy: '-4.1%', mom: '-0.7%' }, { period: '26-08', value: 0.288, yoy: '-4.2%', mom: '-0.7%' }],
  },
  {
    id: 'm-28', code: '28', name: '单位产量能耗（变压器-高压-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'tce/万kVA', curVal: '0.0372', yoy: '-5.1%', isYoyDown: true, status: '常规监测', statusType: 'purple', badge: '高压干燥单耗',
    tipText: '变压器高压产线干燥工序每万kVA综合能耗', formula: 'e_变-高压-干燥 = E / M', formulaDesc: '月度指标。e: 单位产品能耗 (tce/万kVA)；E: 综合能耗 (tce)；M: 产量 (万kVA)。',
    numeratorName: '高压干燥综合能耗 E', numeratorVal: '185.3 tce', denominatorName: '高压干燥下线容量 M', denominatorVal: '4,975.4 万kVA', dataSource: '干燥罐分表与 MES 完工下线记录。',
    rawMeters: [{ medium: '干燥折标能耗', meterCode: 'EQ-DRY-TOTAL', location: '干燥车间', reading: '185.3 tce', unit: 'tce', coeff: '1.0', tce: '185.3' }],
    trendHistory: [{ period: '25-09', value: 0.0402, yoy: '-3.8%', mom: '-0.5%' }, { period: '25-10', value: 0.0395, yoy: '-4.1%', mom: '-1.7%' }, { period: '25-11', value: 0.0390, yoy: '-4.4%', mom: '-1.3%' }, { period: '25-12', value: 0.0398, yoy: '-4.0%', mom: '+2.1%' }, { period: '26-01', value: 0.0384, yoy: '-4.7%', mom: '-3.5%' }, { period: '26-02', value: 0.0381, yoy: '-4.8%', mom: '-0.8%' }, { period: '26-03', value: 0.0395, yoy: '-4.1%', mom: '+3.7%' }, { period: '26-04', value: 0.0390, yoy: '-4.4%', mom: '-1.3%' }, { period: '26-05', value: 0.0384, yoy: '-4.7%', mom: '-1.5%' }, { period: '26-06', value: 0.0381, yoy: '-4.8%', mom: '-0.8%' }, { period: '26-07', value: 0.0376, yoy: '-5.0%', mom: '-1.3%' }, { period: '26-08', value: 0.0372, yoy: '-5.1%', mom: '-1.1%' }],
  },
  {
    id: 'm-29', code: '29', name: '单位产量能耗（变压器-中低压-油变-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'tce/万kVA', curVal: '0.0312', yoy: '-4.5%', isYoyDown: true, status: '常规监测', statusType: 'purple', badge: '油变干燥单耗',
    tipText: '变压器中低压产线油变干燥工序每万kVA综合能耗', formula: 'e_变-中低压-油变-干燥 = E / M', formulaDesc: '月度指标。e: 单位产品能耗 (tce/万kVA)；E: 综合能耗 (tce)；M: 产量 (万kVA)。',
    numeratorName: '油变干燥综合能耗 E', numeratorVal: '95.0 tce', denominatorName: '油变合格下线容量 M', denominatorVal: '3,044.8 万kVA', dataSource: '油变干燥分表与 MES 下线容量。',
    rawMeters: [{ medium: '油变干燥折标', meterCode: 'EQ-OIL-TOTAL', location: '油变车间', reading: '95.0 tce', unit: 'tce', coeff: '1.0', tce: '95.0' }],
    trendHistory: [{ period: '25-09', value: 0.0335, yoy: '-3.2%', mom: '-0.5%' }, { period: '25-10', value: 0.0328, yoy: '-3.5%', mom: '-2.1%' }, { period: '25-11', value: 0.0324, yoy: '-3.8%', mom: '-1.2%' }, { period: '25-12', value: 0.0330, yoy: '-3.4%', mom: '+1.9%' }, { period: '26-01', value: 0.0320, yoy: '-4.1%', mom: '-3.0%' }, { period: '26-02', value: 0.0318, yoy: '-4.2%', mom: '-0.6%' }, { period: '26-03', value: 0.0328, yoy: '-3.5%', mom: '+3.1%' }, { period: '26-04', value: 0.0324, yoy: '-3.8%', mom: '-1.2%' }, { period: '26-05', value: 0.0320, yoy: '-4.1%', mom: '-1.2%' }, { period: '26-06', value: 0.0318, yoy: '-4.2%', mom: '-0.6%' }, { period: '26-07', value: 0.0315, yoy: '-4.4%', mom: '-0.9%' }, { period: '26-08', value: 0.0312, yoy: '-4.5%', mom: '-1.0%' }],
  },
  {
    id: 'm-30', code: '30', name: '单位产量能耗（变压器-中低压-干变-固化）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'tce/万kVA', curVal: '0.0286', yoy: '-4.0%', isYoyDown: true, status: '常规监测', statusType: 'purple', badge: '干变固化单耗',
    tipText: '变压器中低压产线干变固化工序每万kVA综合能耗', formula: 'e_变-中低压-干变-固化 = E / M', formulaDesc: '月度指标。e: 单位产品能耗 (tce/万kVA)；E: 固化能耗 (tce)；M: 产量 (万kVA)。',
    numeratorName: '干变固化烘房能耗 E', numeratorVal: '76.5 tce', denominatorName: '干变完工产量 M', denominatorVal: '2,674.8 万kVA', dataSource: '固化烘房智能总表。',
    rawMeters: [{ medium: '固化烘房折标', meterCode: 'EQ-CURE-TOTAL', location: '干变车间', reading: '76.5 tce', unit: 'tce', coeff: '1.0', tce: '76.5' }],
    trendHistory: [{ period: '25-09', value: 0.0305, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 0.0300, yoy: '-3.2%', mom: '-1.6%' }, { period: '25-11', value: 0.0296, yoy: '-3.4%', mom: '-1.3%' }, { period: '25-12', value: 0.0302, yoy: '-3.1%', mom: '+2.0%' }, { period: '26-01', value: 0.0292, yoy: '-3.7%', mom: '-3.3%' }, { period: '26-02', value: 0.0290, yoy: '-3.8%', mom: '-0.7%' }, { period: '26-03', value: 0.0300, yoy: '-3.2%', mom: '+3.4%' }, { period: '26-04', value: 0.0296, yoy: '-3.4%', mom: '-1.3%' }, { period: '26-05', value: 0.0292, yoy: '-3.7%', mom: '-1.3%' }, { period: '26-06', value: 0.0290, yoy: '-3.8%', mom: '-0.7%' }, { period: '26-07', value: 0.0288, yoy: '-3.9%', mom: '-0.7%' }, { period: '26-08', value: 0.0286, yoy: '-4.0%', mom: '-0.7%' }],
  },
  {
    id: 'm-31', code: '31', name: '单位产量电耗（变压器-高压-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万kVA', curVal: '293.4', yoy: '-4.3%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '高压干燥电耗',
    tipText: '变压器高压产线干燥工序每万kVA电耗', formula: 'q_变-高压-干燥-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/万kVA)；Q: 电能消耗 (kWh)；M: 产量 (万kVA)。',
    numeratorName: '高压干燥真空泵及加热电量 Q', numeratorVal: '1,460,000 kWh', denominatorName: '高压下线容量 M', denominatorVal: '4,975.4 万kVA', dataSource: '干燥罐变频主电表。',
    rawMeters: [{ medium: '干燥用电', meterCode: 'EM-DRY-ELEC-01', location: '干燥车间', reading: '1,460,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '179.4' }],
    trendHistory: [{ period: '25-09', value: 312.0, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 308.0, yoy: '-3.3%', mom: '-1.3%' }, { period: '25-11', value: 304.0, yoy: '-3.5%', mom: '-1.3%' }, { period: '25-12', value: 310.0, yoy: '-3.1%', mom: '+2.0%' }, { period: '26-01', value: 298.0, yoy: '-3.9%', mom: '-3.9%' }, { period: '26-02', value: 296.5, yoy: '-4.0%', mom: '-0.5%' }, { period: '26-03', value: 308.0, yoy: '-3.3%', mom: '+3.9%' }, { period: '26-04', value: 304.0, yoy: '-3.5%', mom: '-1.3%' }, { period: '26-05', value: 298.0, yoy: '-3.9%', mom: '-2.0%' }, { period: '26-06', value: 296.5, yoy: '-4.0%', mom: '-0.5%' }, { period: '26-07', value: 295.0, yoy: '-4.1%', mom: '-0.5%' }, { period: '26-08', value: 293.4, yoy: '-4.3%', mom: '-0.5%' }],
  },
  {
    id: 'm-32', code: '32', name: '单位产量电耗（变压器-中低压-油变-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万kVA', curVal: '246.1', yoy: '-3.9%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '油变干燥电耗',
    tipText: '变压器中低压产线油变干燥工序每万kVA电耗', formula: 'q_变-中低压-油变-干燥-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/万kVA)；Q: 电消耗 (kWh)；M: 产量 (万kVA)。',
    numeratorName: '中低压油变干燥电量 Q', numeratorVal: '749,445 kWh', denominatorName: '油变产量 M', denominatorVal: '3,044.8 万kVA', dataSource: '油变干燥罐配电表。',
    rawMeters: [{ medium: '油变干燥用电', meterCode: 'EM-OIL-ELEC', location: '油变车间', reading: '749,445 kWh', unit: 'kWh', coeff: '0.1229', tce: '92.1' }],
    trendHistory: [{ period: '25-09', value: 260.0, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 256.0, yoy: '-3.0%', mom: '-1.5%' }, { period: '25-11', value: 252.0, yoy: '-3.2%', mom: '-1.6%' }, { period: '25-12', value: 258.0, yoy: '-2.9%', mom: '+2.4%' }, { period: '26-01', value: 249.0, yoy: '-3.5%', mom: '-3.5%' }, { period: '26-02', value: 248.0, yoy: '-3.6%', mom: '-0.4%' }, { period: '26-03', value: 256.0, yoy: '-3.0%', mom: '+3.2%' }, { period: '26-04', value: 252.0, yoy: '-3.2%', mom: '-1.6%' }, { period: '26-05', value: 249.0, yoy: '-3.5%', mom: '-1.2%' }, { period: '26-06', value: 248.0, yoy: '-3.6%', mom: '-0.4%' }, { period: '26-07', value: 247.0, yoy: '-3.7%', mom: '-0.4%' }, { period: '26-08', value: 246.1, yoy: '-3.9%', mom: '-0.4%' }],
  },
  {
    id: 'm-33', code: '33', name: '单位产量电耗（变压器-中低压-干变-固化）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万kVA', curVal: '232.4', yoy: '-3.7%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '干变固化电耗',
    tipText: '变压器中低压产线干变固化工序每万kVA电耗', formula: 'q_变-中低压-干变-固化-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/万kVA)；Q: 电消耗 (kWh)；M: 产量 (万kVA)。',
    numeratorName: '干变浇注固化用电量 Q', numeratorVal: '621,766 kWh', denominatorName: '干变产量 M', denominatorVal: '2,674.8 万kVA', dataSource: '固化烘房智能表。',
    rawMeters: [{ medium: '固化烘房用电', meterCode: 'EM-DRY-CURE', location: '干变车间', reading: '621,766 kWh', unit: 'kWh', coeff: '0.1229', tce: '76.4' }],
    trendHistory: [{ period: '25-09', value: 245.0, yoy: '-2.5%', mom: '-0.5%' }, { period: '25-10', value: 241.0, yoy: '-2.8%', mom: '-1.6%' }, { period: '25-11', value: 238.0, yoy: '-3.0%', mom: '-1.2%' }, { period: '25-12', value: 243.0, yoy: '-2.7%', mom: '+2.1%' }, { period: '26-01', value: 235.0, yoy: '-3.3%', mom: '-3.3%' }, { period: '26-02', value: 234.0, yoy: '-3.4%', mom: '-0.4%' }, { period: '26-03', value: 241.0, yoy: '-2.8%', mom: '+3.0%' }, { period: '26-04', value: 238.0, yoy: '-3.0%', mom: '-1.2%' }, { period: '26-05', value: 235.0, yoy: '-3.3%', mom: '-1.3%' }, { period: '26-06', value: 234.0, yoy: '-3.4%', mom: '-0.4%' }, { period: '26-07', value: 233.0, yoy: '-3.5%', mom: '-0.4%' }, { period: '26-08', value: 232.4, yoy: '-3.7%', mom: '-0.3%' }],
  },
  {
    id: 'm-34', code: '34', name: '单位产量蒸汽消耗（变压器-高压-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 't/万kVA', curVal: '0.858', yoy: '-4.5%', isYoyDown: true, status: '常规监测', statusType: 'purple', badge: '高压干燥蒸汽',
    tipText: '变压器高压产线干燥工序每万kVA蒸汽消耗', formula: 'q_变-高压-干燥-蒸汽 = Q / M', formulaDesc: '月度指标。q: 单位产品蒸汽耗 (t/万kVA)；Q: 蒸汽量 (t)；M: 产量 (万kVA)。',
    numeratorName: '干燥气相加热用蒸汽 Q', numeratorVal: '4,269.3 t', denominatorName: '高压下线容量 M', denominatorVal: '4,975.4 万kVA', dataSource: '干燥罐关口蒸汽流量计。',
    rawMeters: [{ medium: '过热蒸汽', meterCode: 'STM-DRY-HIGH', location: '干燥站', reading: '4,269.3 t', unit: 't', coeff: '0.1286', tce: '549.0' }],
    trendHistory: [{ period: '25-09', value: 0.920, yoy: '-3.2%', mom: '-0.5%' }, { period: '25-10', value: 0.900, yoy: '-3.5%', mom: '-2.2%' }, { period: '25-11', value: 0.885, yoy: '-3.8%', mom: '-1.7%' }, { period: '25-12', value: 0.905, yoy: '-3.4%', mom: '+2.3%' }, { period: '26-01', value: 0.875, yoy: '-4.1%', mom: '-3.3%' }, { period: '26-02', value: 0.870, yoy: '-4.2%', mom: '-0.6%' }, { period: '26-03', value: 0.900, yoy: '-3.5%', mom: '+3.4%' }, { period: '26-04', value: 0.885, yoy: '-3.8%', mom: '-1.7%' }, { period: '26-05', value: 0.875, yoy: '-4.1%', mom: '-1.1%' }, { period: '26-06', value: 0.870, yoy: '-4.2%', mom: '-0.6%' }, { period: '26-07', value: 0.862, yoy: '-4.4%', mom: '-0.9%' }, { period: '26-08', value: 0.858, yoy: '-4.5%', mom: '-0.5%' }],
  },
  {
    id: 'm-35', code: '35', name: '单位产值电耗（变压器-试验）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '42.5', yoy: '-3.6%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '变压器试验',
    tipText: '变压器试验工序每万元产值电耗', formula: 'u_变-试验-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 试验用电 (kWh)；G: 产值 (万元)。',
    numeratorName: '特高压/超高压试验大厅用电量 Q', numeratorVal: '630,000 kWh', denominatorName: '试验合格产品产值 G', denominatorVal: '14,824.0 万元', dataSource: '无局放试验大厅专用智能电表。',
    rawMeters: [{ medium: '试验大厅用电', meterCode: 'EM-TEST-HALL', location: '高压试验站', reading: '630,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '77.4' }],
    trendHistory: [{ period: '25-09', value: 45.0, yoy: '-2.5%', mom: '-0.5%' }, { period: '25-10', value: 44.2, yoy: '-2.8%', mom: '-1.8%' }, { period: '25-11', value: 43.6, yoy: '-3.0%', mom: '-1.4%' }, { period: '25-12', value: 44.5, yoy: '-2.7%', mom: '+2.1%' }, { period: '26-01', value: 43.0, yoy: '-3.2%', mom: '-3.4%' }, { period: '26-02', value: 42.8, yoy: '-3.3%', mom: '-0.5%' }, { period: '26-03', value: 44.2, yoy: '-2.8%', mom: '+3.3%' }, { period: '26-04', value: 43.6, yoy: '-3.0%', mom: '-1.4%' }, { period: '26-05', value: 43.0, yoy: '-3.2%', mom: '-1.4%' }, { period: '26-06', value: 42.8, yoy: '-3.3%', mom: '-0.5%' }, { period: '26-07', value: 42.6, yoy: '-3.5%', mom: '-0.5%' }, { period: '26-08', value: 42.5, yoy: '-3.6%', mom: '-0.2%' }],
  },
  {
    id: 'm-36', code: '36', name: '单位产量电耗（变压器-试验）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万kVA', curVal: '126.6', yoy: '-3.8%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '试验单电耗',
    tipText: '变压器试验工序每万kVA电耗', formula: 'q_变-试验-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/万kVA)；Q: 试验用电 (kWh)；M: 容量 (万kVA)。',
    numeratorName: '试验大厅高压冲击及负载试验用电 Q', numeratorVal: '630,000 kWh', denominatorName: '试验合格产量容量 M', denominatorVal: '4,975.4 万kVA', dataSource: '高压试验大厅控制台电表。',
    rawMeters: [{ medium: '试验用电', meterCode: 'EM-TEST-MAIN', location: '试验站', reading: '630,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '77.4' }],
    trendHistory: [{ period: '25-09', value: 134.0, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 131.5, yoy: '-3.0%', mom: '-1.9%' }, { period: '25-11', value: 129.8, yoy: '-3.2%', mom: '-1.3%' }, { period: '25-12', value: 132.5, yoy: '-2.9%', mom: '+2.1%' }, { period: '26-01', value: 128.0, yoy: '-3.5%', mom: '-3.4%' }, { period: '26-02', value: 127.5, yoy: '-3.6%', mom: '-0.4%' }, { period: '26-03', value: 131.5, yoy: '-3.0%', mom: '+3.1%' }, { period: '26-04', value: 129.8, yoy: '-3.2%', mom: '-1.3%' }, { period: '26-05', value: 128.0, yoy: '-3.5%', mom: '-1.4%' }, { period: '26-06', value: 127.5, yoy: '-3.6%', mom: '-0.4%' }, { period: '26-07', value: 127.0, yoy: '-3.7%', mom: '-0.4%' }, { period: '26-08', value: 126.6, yoy: '-3.8%', mom: '-0.3%' }],
  },
  {
    id: 'm-37', code: '37', name: '单位产值电耗（中低压开关柜-钣金加工）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '58.4', yoy: '-3.5%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '开关柜钣金',
    tipText: '中低压开关柜钣金加工工序万元产值电耗，产值取产品产值', formula: 'u_柜-加工-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 冲床用电 (kWh)；G: 产值 (万元)。',
    numeratorName: '数控转塔冲床及柔性钣金线用电 Q', numeratorVal: '262,800 kWh', denominatorName: '开关柜产品产值 G', denominatorVal: '4,500.0 万元', dataSource: '钣金冲压车间机床分表。',
    rawMeters: [{ medium: '数控冲床用电', meterCode: 'EQ-SHEET-METAL', location: '钣金车间', reading: '262,800 kWh', unit: 'kWh', coeff: '0.1229', tce: '32.3' }],
    trendHistory: [{ period: '25-09', value: 61.5, yoy: '-2.5%', mom: '-0.5%' }, { period: '25-10', value: 60.5, yoy: '-2.8%', mom: '-1.6%' }, { period: '25-11', value: 59.8, yoy: '-3.0%', mom: '-1.2%' }, { period: '25-12', value: 61.0, yoy: '-2.7%', mom: '+2.0%' }, { period: '26-01', value: 59.0, yoy: '-3.2%', mom: '-3.3%' }, { period: '26-02', value: 58.8, yoy: '-3.3%', mom: '-0.3%' }, { period: '26-03', value: 60.5, yoy: '-2.8%', mom: '+2.9%' }, { period: '26-04', value: 59.8, yoy: '-3.0%', mom: '-1.2%' }, { period: '26-05', value: 59.0, yoy: '-3.2%', mom: '-1.3%' }, { period: '26-06', value: 58.8, yoy: '-3.3%', mom: '-0.3%' }, { period: '26-07', value: 58.6, yoy: '-3.4%', mom: '-0.3%' }, { period: '26-08', value: 58.4, yoy: '-3.5%', mom: '-0.3%' }],
  },
  {
    id: 'm-38', code: '38', name: '单位产值电耗（中低压开关柜-钣金喷涂）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '64.2', yoy: '-3.9%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '钣金喷涂',
    tipText: '中低压开关柜钣金喷涂工序万元产值电耗', formula: 'u_柜-喷涂-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 喷涂线用电 (kWh)；G: 产值 (万元)。',
    numeratorName: '静电喷涂与烘干喷粉线用电 Q', numeratorVal: '288,900 kWh', denominatorName: '喷涂柜体产值 G', denominatorVal: '4,500.0 万元', dataSource: '自动喷涂烘干线主电表。',
    rawMeters: [{ medium: '喷涂线用电', meterCode: 'EQ-PAINT-LINE', location: '喷涂车间', reading: '288,900 kWh', unit: 'kWh', coeff: '0.1229', tce: '35.5' }],
    trendHistory: [{ period: '25-09', value: 68.0, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 66.8, yoy: '-3.0%', mom: '-1.8%' }, { period: '25-11', value: 66.0, yoy: '-3.2%', mom: '-1.2%' }, { period: '25-12', value: 67.2, yoy: '-2.9%', mom: '+1.8%' }, { period: '26-01', value: 65.0, yoy: '-3.5%', mom: '-3.3%' }, { period: '26-02', value: 64.6, yoy: '-3.6%', mom: '-0.6%' }, { period: '26-03', value: 66.8, yoy: '-3.0%', mom: '+3.4%' }, { period: '26-04', value: 66.0, yoy: '-3.2%', mom: '-1.2%' }, { period: '26-05', value: 65.0, yoy: '-3.5%', mom: '-1.5%' }, { period: '26-06', value: 64.6, yoy: '-3.6%', mom: '-0.6%' }, { period: '26-07', value: 64.4, yoy: '-3.8%', mom: '-0.3%' }, { period: '26-08', value: 64.2, yoy: '-3.9%', mom: '-0.3%' }],
  },
  {
    id: 'm-39', code: '39', name: '单位产值电耗（套管-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '72.8', yoy: '-4.1%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '套管干燥',
    tipText: '套管干燥工序每万元产值电耗', formula: 'u_套-干燥-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 干燥罐用电 (kWh)；G: 产值 (万元)。',
    numeratorName: '和新套管真空干燥罐用电 Q', numeratorVal: '218,400 kWh', denominatorName: '套管产品产值 G', denominatorVal: '3,000.0 万元', dataSource: '套管干燥罐智能分配电表。',
    rawMeters: [{ medium: '套管干燥用电', meterCode: 'EQ-BUSH-DRY', location: '套管车间', reading: '218,400 kWh', unit: 'kWh', coeff: '0.1229', tce: '26.8' }],
    trendHistory: [{ period: '25-09', value: 77.0, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 75.8, yoy: '-3.2%', mom: '-1.6%' }, { period: '25-11', value: 74.8, yoy: '-3.5%', mom: '-1.3%' }, { period: '25-12', value: 76.2, yoy: '-3.1%', mom: '+1.9%' }, { period: '26-01', value: 73.8, yoy: '-3.8%', mom: '-3.1%' }, { period: '26-02', value: 73.4, yoy: '-3.9%', mom: '-0.5%' }, { period: '26-03', value: 75.8, yoy: '-3.2%', mom: '+3.3%' }, { period: '26-04', value: 74.8, yoy: '-3.5%', mom: '-1.3%' }, { period: '26-05', value: 73.8, yoy: '-3.8%', mom: '-1.3%' }, { period: '26-06', value: 73.4, yoy: '-3.9%', mom: '-0.5%' }, { period: '26-07', value: 73.0, yoy: '-4.0%', mom: '-0.5%' }, { period: '26-08', value: 72.8, yoy: '-4.1%', mom: '-0.3%' }],
  },
  {
    id: 'm-42', code: '42', name: '单位产值综合能耗（互感器-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'tce/万元', curVal: '0.0142', yoy: '-4.5%', isYoyDown: true, status: '常规监测', statusType: 'purple', badge: '互感器干燥',
    tipText: '互感器干燥工序每万元产值综合能耗。电和蒸汽都有，蒸汽用的多，80%蒸汽', formula: 'g_互-干燥 = E / G', formulaDesc: '月度指标。g: 单位产值能耗 (tce/万元)；E: 干燥综合能耗 (tce)；G: 产值 (万元)。',
    numeratorName: '互感器干燥电能与蒸汽折标总能耗 E', numeratorVal: '35.5 tce', denominatorName: '互感器产值 G', denominatorVal: '2,500.0 万元', dataSource: '康嘉互感器干燥罐蒸汽流量计与电表。',
    rawMeters: [{ medium: '干燥蒸汽+电', meterCode: 'EQ-MUTUAL-DRY', location: '互感器车间', reading: '35.5 tce', unit: 'tce', coeff: '1.0', tce: '35.5' }],
    trendHistory: [{ period: '25-09', value: 0.0152, yoy: '-3.2%', mom: '-0.5%' }, { period: '25-10', value: 0.0149, yoy: '-3.5%', mom: '-2.0%' }, { period: '25-11', value: 0.0147, yoy: '-3.8%', mom: '-1.3%' }, { period: '25-12', value: 0.0150, yoy: '-3.4%', mom: '+2.0%' }, { period: '26-01', value: 0.0145, yoy: '-4.1%', mom: '-3.3%' }, { period: '26-02', value: 0.0144, yoy: '-4.2%', mom: '-0.7%' }, { period: '26-03', value: 0.0149, yoy: '-3.5%', mom: '+3.5%' }, { period: '26-04', value: 0.0147, yoy: '-3.8%', mom: '-1.3%' }, { period: '26-05', value: 0.0145, yoy: '-4.1%', mom: '-1.4%' }, { period: '26-06', value: 0.0144, yoy: '-4.2%', mom: '-0.7%' }, { period: '26-07', value: 0.0143, yoy: '-4.4%', mom: '-0.7%' }, { period: '26-08', value: 0.0142, yoy: '-4.5%', mom: '-0.7%' }],
  },
  {
    id: 'm-43', code: '43', name: '单位产值电耗（互感器-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '34.8', yoy: '-3.9%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '互感器干燥电耗',
    tipText: '互感器干燥工序每万元产值电耗', formula: 'u_互-干燥-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 电能消耗 (kWh)；G: 产值 (万元)。',
    numeratorName: '互感器干燥真空泵电量 Q', numeratorVal: '87,000 kWh', denominatorName: '互感器产值 G', denominatorVal: '2,500.0 万元', dataSource: '干燥真空泵控制柜表。',
    rawMeters: [{ medium: '干燥泵用电', meterCode: 'EM-MUTUAL-PUMP', location: '互感器车间', reading: '87,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '10.7' }],
    trendHistory: [{ period: '25-09', value: 36.8, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 36.2, yoy: '-3.0%', mom: '-1.6%' }, { period: '25-11', value: 35.8, yoy: '-3.2%', mom: '-1.1%' }, { period: '25-12', value: 36.4, yoy: '-2.9%', mom: '+1.7%' }, { period: '26-01', value: 35.2, yoy: '-3.5%', mom: '-3.3%' }, { period: '26-02', value: 35.0, yoy: '-3.6%', mom: '-0.6%' }, { period: '26-03', value: 36.2, yoy: '-3.0%', mom: '+3.4%' }, { period: '26-04', value: 35.8, yoy: '-3.2%', mom: '-1.1%' }, { period: '26-05', value: 35.2, yoy: '-3.5%', mom: '-1.7%' }, { period: '26-06', value: 35.0, yoy: '-3.6%', mom: '-0.6%' }, { period: '26-07', value: 34.9, yoy: '-3.8%', mom: '-0.3%' }, { period: '26-08', value: 34.8, yoy: '-3.9%', mom: '-0.3%' }],
  },
  {
    id: 'm-44', code: '44', name: '单位产值蒸汽消耗（互感器-干燥）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 't/万元', curVal: '0.198', yoy: '-4.3%', isYoyDown: true, status: '常规监测', statusType: 'purple', badge: '互感器干燥蒸汽',
    tipText: '互感器干燥工序每万元产值蒸汽消耗 (占能耗80%)', formula: 'u_互-干燥-蒸汽 = Q / G', formulaDesc: '月度指标。u: 单位产值蒸汽耗 (t/万元)；Q: 蒸汽消耗 (t)；G: 产值 (万元)。',
    numeratorName: '互感器干燥用过热蒸汽总量 Q', numeratorVal: '495.0 t', denominatorName: '互感器产值 G', denominatorVal: '2,500.0 万元', dataSource: '干燥罐专用蒸汽流量计。',
    rawMeters: [{ medium: '过热蒸汽', meterCode: 'STM-MUTUAL-DRY', location: '互感器车间', reading: '495.0 t', unit: 't', coeff: '0.1286', tce: '63.7' }],
    trendHistory: [{ period: '25-09', value: 0.210, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 0.206, yoy: '-3.3%', mom: '-1.9%' }, { period: '25-11', value: 0.203, yoy: '-3.6%', mom: '-1.5%' }, { period: '25-12', value: 0.208, yoy: '-3.2%', mom: '+2.5%' }, { period: '26-01', value: 0.201, yoy: '-3.9%', mom: '-3.4%' }, { period: '26-02', value: 0.200, yoy: '-4.0%', mom: '-0.5%' }, { period: '26-03', value: 0.206, yoy: '-3.3%', mom: '+3.0%' }, { period: '26-04', value: 0.203, yoy: '-3.6%', mom: '-1.5%' }, { period: '26-05', value: 0.201, yoy: '-3.9%', mom: '-1.0%' }, { period: '26-06', value: 0.200, yoy: '-4.0%', mom: '-0.5%' }, { period: '26-07', value: 0.199, yoy: '-4.1%', mom: '-0.5%' }, { period: '26-08', value: 0.198, yoy: '-4.3%', mom: '-0.5%' }],
  },
  {
    id: 'm-45', code: '45', name: '单位产值电耗（互感器-试验）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '28.6', yoy: '-3.5%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '互感器试验',
    tipText: '互感器试验工序每万元产值电耗', formula: 'u_互-试验-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 试验电量 (kWh)；G: 产值 (万元)。',
    numeratorName: '互感器高压工频及局放试验用电 Q', numeratorVal: '71,500 kWh', denominatorName: '合格互感器产值 G', denominatorVal: '2,500.0 万元', dataSource: '试验站屏蔽室主电表。',
    rawMeters: [{ medium: '试验屏蔽室用电', meterCode: 'EM-MUTUAL-TEST', location: '互感器试验站', reading: '71,500 kWh', unit: 'kWh', coeff: '0.1229', tce: '8.8' }],
    trendHistory: [{ period: '25-09', value: 30.2, yoy: '-2.5%', mom: '-0.5%' }, { period: '25-10', value: 29.8, yoy: '-2.8%', mom: '-1.3%' }, { period: '25-11', value: 29.4, yoy: '-3.0%', mom: '-1.3%' }, { period: '25-12', value: 30.0, yoy: '-2.7%', mom: '+2.0%' }, { period: '26-01', value: 29.0, yoy: '-3.2%', mom: '-3.3%' }, { period: '26-02', value: 28.9, yoy: '-3.3%', mom: '-0.3%' }, { period: '26-03', value: 29.8, yoy: '-2.8%', mom: '+3.1%' }, { period: '26-04', value: 29.4, yoy: '-3.0%', mom: '-1.3%' }, { period: '26-05', value: 29.0, yoy: '-3.2%', mom: '-1.4%' }, { period: '26-06', value: 28.9, yoy: '-3.3%', mom: '-0.3%' }, { period: '26-07', value: 28.7, yoy: '-3.4%', mom: '-0.7%' }, { period: '26-08', value: 28.6, yoy: '-3.5%', mom: '-0.3%' }],
  },
  {
    id: 'm-46', code: '46', name: '单位产值电耗（二次-SMT贴片）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '45.8', yoy: '-4.0%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: 'SMT贴片',
    tipText: '二次-SMT贴片工序每万元产值电耗', formula: 'u_二次-贴片-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 贴片机电量 (kWh)；G: 产值 (万元)。',
    numeratorName: '高速 SMT 贴片机组用电量 Q', numeratorVal: '183,200 kWh', denominatorName: '二次自动化控制板产值 G', denominatorVal: '4,000.0 万元', dataSource: 'SMT 净化车间专用智能电表。',
    rawMeters: [{ medium: '贴片机用电', meterCode: 'EQ-SMT-01', location: '二次净化车间', reading: '183,200 kWh', unit: 'kWh', coeff: '0.1229', tce: '22.5' }],
    trendHistory: [{ period: '25-09', value: 48.5, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 47.8, yoy: '-3.2%', mom: '-1.4%' }, { period: '25-11', value: 47.2, yoy: '-3.5%', mom: '-1.3%' }, { period: '25-12', value: 48.0, yoy: '-3.1%', mom: '+1.7%' }, { period: '26-01', value: 46.5, yoy: '-3.8%', mom: '-3.1%' }, { period: '26-02', value: 46.2, yoy: '-3.9%', mom: '-0.6%' }, { period: '26-03', value: 47.8, yoy: '-3.2%', mom: '+3.5%' }, { period: '26-04', value: 47.2, yoy: '-3.5%', mom: '-1.3%' }, { period: '26-05', value: 46.5, yoy: '-3.8%', mom: '-1.5%' }, { period: '26-06', value: 46.2, yoy: '-3.9%', mom: '-0.6%' }, { period: '26-07', value: 46.0, yoy: '-4.0%', mom: '-0.4%' }, { period: '26-08', value: 45.8, yoy: '-4.0%', mom: '-0.4%' }],
  },
  {
    id: 'm-47', code: '47', name: '单位产值电耗（二次-高温老化）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '52.4', yoy: '-4.2%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '高温老化',
    tipText: '二次-高温老化工序每万元产值电耗', formula: 'u_二次-高温-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 老化房用电 (kWh)；G: 产值 (万元)。',
    numeratorName: '高温老化房持续加温用电 Q', numeratorVal: '209,600 kWh', denominatorName: '老化产品产值 G', denominatorVal: '4,000.0 万元', dataSource: '老化房加温恒温控制器电表。',
    rawMeters: [{ medium: '老化房用电', meterCode: 'EQ-BURN-IN', location: '二次车间', reading: '209,600 kWh', unit: 'kWh', coeff: '0.1229', tce: '25.8' }],
    trendHistory: [{ period: '25-09', value: 55.8, yoy: '-3.2%', mom: '-0.5%' }, { period: '25-10', value: 54.8, yoy: '-3.5%', mom: '-1.8%' }, { period: '25-11', value: 54.2, yoy: '-3.8%', mom: '-1.1%' }, { period: '25-12', value: 55.0, yoy: '-3.4%', mom: '+1.5%' }, { period: '26-01', value: 53.5, yoy: '-4.0%', mom: '-2.7%' }, { period: '26-02', value: 53.2, yoy: '-4.1%', mom: '-0.6%' }, { period: '26-03', value: 54.8, yoy: '-3.5%', mom: '+3.0%' }, { period: '26-04', value: 54.2, yoy: '-3.8%', mom: '-1.1%' }, { period: '26-05', value: 53.5, yoy: '-4.0%', mom: '-1.3%' }, { period: '26-06', value: 53.2, yoy: '-4.1%', mom: '-0.6%' }, { period: '26-07', value: 52.8, yoy: '-4.1%', mom: '-0.8%' }, { period: '26-08', value: 52.4, yoy: '-4.2%', mom: '-0.8%' }],
  },
  {
    id: 'm-48', code: '48', name: '单位产值电耗（二次-波峰焊）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '36.5', yoy: '-3.8%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '波峰焊',
    tipText: '二次-波峰焊工序每万元产值电耗', formula: 'u_二次-波峰焊-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 波峰焊用电 (kWh)；G: 产值 (万元)。',
    numeratorName: '无铅氮气波峰焊机用电 Q', numeratorVal: '146,000 kWh', denominatorName: '二次焊接控制板产值 G', denominatorVal: '4,000.0 万元', dataSource: '波峰焊生产线主电表。',
    rawMeters: [{ medium: '波峰焊用电', meterCode: 'EQ-WAVE-SOLDER', location: '二次车间', reading: '146,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '17.9' }],
    trendHistory: [{ period: '25-09', value: 38.8, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 38.2, yoy: '-3.0%', mom: '-1.5%' }, { period: '25-11', value: 37.8, yoy: '-3.2%', mom: '-1.0%' }, { period: '25-12', value: 38.5, yoy: '-2.9%', mom: '+1.9%' }, { period: '26-01', value: 37.2, yoy: '-3.5%', mom: '-3.4%' }, { period: '26-02', value: 37.0, yoy: '-3.6%', mom: '-0.5%' }, { period: '26-03', value: 38.2, yoy: '-3.0%', mom: '+3.2%' }, { period: '26-04', value: 37.8, yoy: '-3.2%', mom: '-1.0%' }, { period: '26-05', value: 37.2, yoy: '-3.5%', mom: '-1.6%' }, { period: '26-06', value: 37.0, yoy: '-3.6%', mom: '-0.5%' }, { period: '26-07', value: 36.8, yoy: '-3.7%', mom: '-0.5%' }, { period: '26-08', value: 36.5, yoy: '-3.8%', mom: '-0.8%' }],
  },
  {
    id: 'm-49', code: '49', name: '单位产量电耗（电容器-芯子卷绕）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/kvar', curVal: '0.85', yoy: '-3.9%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '芯子卷绕',
    tipText: '电容器芯子卷绕工序每万元产值电耗 (按产量 kvar 算)', formula: 'q_容-卷绕-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/kvar)；Q: 卷绕机用电 (kWh)；M: 产量 (kvar)。',
    numeratorName: '全自动无尘卷绕机组用电 Q', numeratorVal: '170,000 kWh', denominatorName: '电容器芯子卷绕产量 M', denominatorVal: '200,000 kvar', dataSource: '卷绕车间无尘室电表。',
    rawMeters: [{ medium: '卷绕机用电', meterCode: 'EQ-CAP-WIND', location: '电容器车间', reading: '170,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '20.9' }],
    trendHistory: [{ period: '25-09', value: 0.90, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 0.89, yoy: '-3.0%', mom: '-1.1%' }, { period: '25-11', value: 0.88, yoy: '-3.2%', mom: '-1.1%' }, { period: '25-12', value: 0.90, yoy: '-2.9%', mom: '+2.3%' }, { period: '26-01', value: 0.87, yoy: '-3.5%', mom: '-3.3%' }, { period: '26-02', value: 0.86, yoy: '-3.6%', mom: '-1.1%' }, { period: '26-03', value: 0.89, yoy: '-3.0%', mom: '+3.5%' }, { period: '26-04', value: 0.88, yoy: '-3.2%', mom: '-1.1%' }, { period: '26-05', value: 0.87, yoy: '-3.5%', mom: '-1.1%' }, { period: '26-06', value: 0.86, yoy: '-3.6%', mom: '-1.1%' }, { period: '26-07', value: 0.85, yoy: '-3.8%', mom: '-1.2%' }, { period: '26-08', value: 0.85, yoy: '-3.9%', mom: '0.0%' }],
  },
  {
    id: 'm-50', code: '50', name: '单位产量电耗（电容器-真空浸渍）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/kvar', curVal: '1.42', yoy: '-4.2%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '真空浸渍',
    tipText: '电容器真空浸渍工序每万元产值电耗 (按产量 kvar 算)', formula: 'q_容-真空-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/kvar)；Q: 浸渍罐用电 (kWh)；M: 产量 (kvar)。',
    numeratorName: '真空浸渍罐加热及抽真空电量 Q', numeratorVal: '284,000 kWh', denominatorName: '浸渍产品容量 M', denominatorVal: '200,000 kvar', dataSource: '真空浸渍系统控制器主电表。',
    rawMeters: [{ medium: '浸渍罐用电', meterCode: 'EQ-CAP-IMPREG', location: '电容器车间', reading: '284,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '34.9' }],
    trendHistory: [{ period: '25-09', value: 1.52, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 1.49, yoy: '-3.3%', mom: '-2.0%' }, { period: '25-11', value: 1.47, yoy: '-3.6%', mom: '-1.3%' }, { period: '25-12', value: 1.50, yoy: '-3.2%', mom: '+2.0%' }, { period: '26-01', value: 1.45, yoy: '-3.9%', mom: '-3.3%' }, { period: '26-02', value: 1.44, yoy: '-4.0%', mom: '-0.7%' }, { period: '26-03', value: 1.49, yoy: '-3.3%', mom: '+3.5%' }, { period: '26-04', value: 1.47, yoy: '-3.6%', mom: '-1.3%' }, { period: '26-05', value: 1.45, yoy: '-3.9%', mom: '-1.4%' }, { period: '26-06', value: 1.44, yoy: '-4.0%', mom: '-0.7%' }, { period: '26-07', value: 1.43, yoy: '-4.1%', mom: '-0.7%' }, { period: '26-08', value: 1.42, yoy: '-4.2%', mom: '-0.7%' }],
  },
  {
    id: 'm-51', code: '51', name: '单位产量电耗（电容器-喷漆）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/kvar', curVal: '0.48', yoy: '-3.6%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '电容喷漆',
    tipText: '电容器喷漆工序每万元产值电耗 (按产量 kvar 算)', formula: 'q_容-喷漆-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/kvar)；Q: 喷漆线用电 (kWh)；M: 产量 (kvar)。',
    numeratorName: '电容器外壳自动喷漆烘干用电 Q', numeratorVal: '96,000 kWh', denominatorName: '喷漆合格产量 M', denominatorVal: '200,000 kvar', dataSource: '喷漆烘干线专用智能表。',
    rawMeters: [{ medium: '喷漆线用电', meterCode: 'EQ-CAP-PAINT', location: '电容器车间', reading: '96,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '11.8' }],
    trendHistory: [{ period: '25-09', value: 0.51, yoy: '-2.5%', mom: '-0.5%' }, { period: '25-10', value: 0.50, yoy: '-2.8%', mom: '-2.0%' }, { period: '25-11', value: 0.49, yoy: '-3.0%', mom: '-2.0%' }, { period: '25-12', value: 0.51, yoy: '-2.7%', mom: '+4.1%' }, { period: '26-01', value: 0.49, yoy: '-3.2%', mom: '-3.9%' }, { period: '26-02', value: 0.49, yoy: '-3.3%', mom: '0.0%' }, { period: '26-03', value: 0.50, yoy: '-2.8%', mom: '+2.0%' }, { period: '26-04', value: 0.49, yoy: '-3.0%', mom: '-2.0%' }, { period: '26-05', value: 0.49, yoy: '-3.2%', mom: '0.0%' }, { period: '26-06', value: 0.49, yoy: '-3.3%', mom: '0.0%' }, { period: '26-07', value: 0.48, yoy: '-3.5%', mom: '-2.0%' }, { period: '26-08', value: 0.48, yoy: '-3.6%', mom: '0.0%' }],
  },
  {
    id: 'm-52', code: '52', name: '单位产量电耗（电容器-试验）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/kvar', curVal: '0.35', yoy: '-3.5%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '电容试验',
    tipText: '电容器试验工序每万元产值电耗 (按产量 kvar 算)', formula: 'q_容-试验-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/kvar)；Q: 试验用电 (kWh)；M: 产量 (kvar)。',
    numeratorName: '高压电容出厂出厂耐压及损耗试验用电 Q', numeratorVal: '70,000 kWh', denominatorName: '试验合格产量 M', denominatorVal: '200,000 kvar', dataSource: '电容器出厂试验站电表。',
    rawMeters: [{ medium: '电容试验用电', meterCode: 'EM-CAP-TEST', location: '电容试验站', reading: '70,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '8.6' }],
    trendHistory: [{ period: '25-09', value: 0.37, yoy: '-2.5%', mom: '-0.5%' }, { period: '25-10', value: 0.36, yoy: '-2.8%', mom: '-2.7%' }, { period: '25-11', value: 0.36, yoy: '-3.0%', mom: '0.0%' }, { period: '25-12', value: 0.37, yoy: '-2.7%', mom: '+2.8%' }, { period: '26-01', value: 0.36, yoy: '-3.2%', mom: '-2.7%' }, { period: '26-02', value: 0.35, yoy: '-3.3%', mom: '-2.8%' }, { period: '26-03', value: 0.36, yoy: '-2.8%', mom: '+2.9%' }, { period: '26-04', value: 0.36, yoy: '-3.0%', mom: '0.0%' }, { period: '26-05', value: 0.35, yoy: '-3.2%', mom: '-2.8%' }, { period: '26-06', value: 0.35, yoy: '-3.3%', mom: '0.0%' }, { period: '26-07', value: 0.35, yoy: '-3.4%', mom: '0.0%' }, { period: '26-08', value: 0.35, yoy: '-3.5%', mom: '0.0%' }],
  },
  {
    id: 'm-53', code: '53', name: '单位产值电耗（干式电抗器-固化）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '68.2', yoy: '-4.0%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '电抗器固化',
    tipText: '干式电抗器-固化工序每万元产值电耗', formula: 'u_抗-固化-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 固化电量 (kWh)；G: 产值 (万元)。',
    numeratorName: '干式电抗器浇注固化烘房用电 Q', numeratorVal: '204,600 kWh', denominatorName: '干式电抗器产值 G', denominatorVal: '3,000.0 万元', dataSource: '电抗器固化烘房电表。',
    rawMeters: [{ medium: '固化烘房用电', meterCode: 'EQ-REACT-CURE', location: '电抗器车间', reading: '204,600 kWh', unit: 'kWh', coeff: '0.1229', tce: '25.1' }],
    trendHistory: [{ period: '25-09', value: 72.0, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 71.0, yoy: '-3.2%', mom: '-1.4%' }, { period: '25-11', value: 70.0, yoy: '-3.5%', mom: '-1.4%' }, { period: '25-12', value: 71.5, yoy: '-3.1%', mom: '+2.1%' }, { period: '26-01', value: 69.2, yoy: '-3.8%', mom: '-3.2%' }, { period: '26-02', value: 68.8, yoy: '-3.9%', mom: '-0.6%' }, { period: '26-03', value: 71.0, yoy: '-3.2%', mom: '+3.2%' }, { period: '26-04', value: 70.0, yoy: '-3.5%', mom: '-1.4%' }, { period: '26-05', value: 69.2, yoy: '-3.8%', mom: '-1.1%' }, { period: '26-06', value: 68.8, yoy: '-3.9%', mom: '-0.6%' }, { period: '26-07', value: 68.5, yoy: '-4.0%', mom: '-0.4%' }, { period: '26-08', value: 68.2, yoy: '-4.0%', mom: '-0.4%' }],
  },
  {
    id: 'm-54', code: '54', name: '单位产值电耗（干式电抗器-试验）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '32.4', yoy: '-3.7%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '电抗器试验',
    tipText: '干式电抗器-试验工序每万元产值电耗', formula: 'u_抗-试验-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 试验用电 (kWh)；G: 产值 (万元)。',
    numeratorName: '电抗器温升及工频耐压试验用电 Q', numeratorVal: '97,200 kWh', denominatorName: '电抗器合格产值 G', denominatorVal: '3,000.0 万元', dataSource: '电抗器试验台配电表。',
    rawMeters: [{ medium: '试验台用电', meterCode: 'EM-REACT-TEST', location: '电抗器试验站', reading: '97,200 kWh', unit: 'kWh', coeff: '0.1229', tce: '11.9' }],
    trendHistory: [{ period: '25-09', value: 34.2, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 33.6, yoy: '-3.0%', mom: '-1.8%' }, { period: '25-11', value: 33.2, yoy: '-3.2%', mom: '-1.2%' }, { period: '25-12', value: 33.8, yoy: '-2.9%', mom: '+1.8%' }, { period: '26-01', value: 32.8, yoy: '-3.5%', mom: '-3.0%' }, { period: '26-02', value: 32.6, yoy: '-3.6%', mom: '-0.6%' }, { period: '26-03', value: 33.6, yoy: '-3.0%', mom: '+3.1%' }, { period: '26-04', value: 33.2, yoy: '-3.2%', mom: '-1.2%' }, { period: '26-05', value: 32.8, yoy: '-3.5%', mom: '-1.2%' }, { period: '26-06', value: 32.6, yoy: '-3.6%', mom: '-0.6%' }, { period: '26-07', value: 32.5, yoy: '-3.6%', mom: '-0.3%' }, { period: '26-08', value: 32.4, yoy: '-3.7%', mom: '-0.3%' }],
  },
  {
    id: 'm-55', code: '55', name: '单位产值电耗（GIL-螺旋焊管生产)', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '88.5', yoy: '-4.3%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: 'GIL螺旋焊管',
    tipText: 'GIL螺旋焊管生产工序每万元产值电耗', formula: 'u_GIL-螺旋焊管-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 焊管机用电 (kWh)；G: 产值 (万元)。',
    numeratorName: 'GIL 铝合金螺旋焊管自动生产线用电 Q', numeratorVal: '354,000 kWh', denominatorName: 'GIL 管道产品产值 G', denominatorVal: '4,000.0 万元', dataSource: 'GIL 焊管车间主分配电表。',
    rawMeters: [{ medium: '焊管线用电', meterCode: 'EQ-GIL-WELD', location: 'GIL车间', reading: '354,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '43.5' }],
    trendHistory: [{ period: '25-09', value: 94.0, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 92.5, yoy: '-3.3%', mom: '-1.6%' }, { period: '25-11', value: 91.0, yoy: '-3.5%', mom: '-1.6%' }, { period: '25-12', value: 93.0, yoy: '-3.1%', mom: '+2.2%' }, { period: '26-01', value: 89.8, yoy: '-3.9%', mom: '-3.4%' }, { period: '26-02', value: 89.2, yoy: '-4.0%', mom: '-0.7%' }, { period: '26-03', value: 92.5, yoy: '-3.3%', mom: '+3.7%' }, { period: '26-04', value: 91.0, yoy: '-3.5%', mom: '-1.6%' }, { period: '26-05', value: 89.8, yoy: '-3.9%', mom: '-1.3%' }, { period: '26-06', value: 89.2, yoy: '-4.0%', mom: '-0.7%' }, { period: '26-07', value: 88.8, yoy: '-4.2%', mom: '-0.4%' }, { period: '26-08', value: 88.5, yoy: '-4.3%', mom: '-0.3%' }],
  },
  {
    id: 'm-56', code: '56', name: '单位产值电耗（GIL-测试)', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '38.2', yoy: '-3.8%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: 'GIL测试',
    tipText: 'GIL-测试工序每万元产值电耗', formula: 'u_GIL-测试-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 测试用电 (kWh)；G: 产值 (万元)。',
    numeratorName: 'GIL 管道气密性测试及耐压试验用电 Q', numeratorVal: '152,800 kWh', denominatorName: 'GIL 合格测试产值 G', denominatorVal: '4,000.0 万元', dataSource: 'GIL 测试大厅专用智能电表。',
    rawMeters: [{ medium: 'GIL测试用电', meterCode: 'EM-GIL-TEST', location: 'GIL测试站', reading: '152,800 kWh', unit: 'kWh', coeff: '0.1229', tce: '18.8' }],
    trendHistory: [{ period: '25-09', value: 40.5, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 39.8, yoy: '-3.0%', mom: '-1.7%' }, { period: '25-11', value: 39.2, yoy: '-3.2%', mom: '-1.5%' }, { period: '25-12', value: 40.0, yoy: '-2.9%', mom: '+2.0%' }, { period: '26-01', value: 38.8, yoy: '-3.5%', mom: '-3.0%' }, { period: '26-02', value: 38.5, yoy: '-3.6%', mom: '-0.8%' }, { period: '26-03', value: 39.8, yoy: '-3.0%', mom: '+3.4%' }, { period: '26-04', value: 39.2, yoy: '-3.2%', mom: '-1.5%' }, { period: '26-05', value: 38.8, yoy: '-3.5%', mom: '-1.0%' }, { period: '26-06', value: 38.5, yoy: '-3.6%', mom: '-0.8%' }, { period: '26-07', value: 38.3, yoy: '-3.7%', mom: '-0.5%' }, { period: '26-08', value: 38.2, yoy: '-3.8%', mom: '-0.3%' }],
  },
  {
    id: 'm-57', code: '57', name: '单位产值电耗（GIL-绝缘子生产)', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '54.6', yoy: '-4.1%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: 'GIL绝缘子',
    tipText: 'GIL-绝缘子生产工序每万元产值电耗', formula: 'u_GIL-绝缘-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 浇注用电 (kWh)；G: 产值 (万元)。',
    numeratorName: '盆式绝缘子浇注及高温固化用电 Q', numeratorVal: '218,400 kWh', denominatorName: '绝缘子产值 G', denominatorVal: '4,000.0 万元', dataSource: '绝缘子浇注净化车间电表。',
    rawMeters: [{ medium: '绝缘子浇注用电', meterCode: 'EQ-GIL-INSULATOR', location: '绝缘子车间', reading: '218,400 kWh', unit: 'kWh', coeff: '0.1229', tce: '26.8' }],
    trendHistory: [{ period: '25-09', value: 58.0, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 57.0, yoy: '-3.2%', mom: '-1.7%' }, { period: '25-11', value: 56.2, yoy: '-3.5%', mom: '-1.4%' }, { period: '25-12', value: 57.5, yoy: '-3.1%', mom: '+2.3%' }, { period: '26-01', value: 55.5, yoy: '-3.8%', mom: '-3.5%' }, { period: '26-02', value: 55.0, yoy: '-3.9%', mom: '-0.9%' }, { period: '26-03', value: 57.0, yoy: '-3.2%', mom: '+3.6%' }, { period: '26-04', value: 56.2, yoy: '-3.5%', mom: '-1.4%' }, { period: '26-05', value: 55.5, yoy: '-3.8%', mom: '-1.2%' }, { period: '26-06', value: 55.0, yoy: '-3.9%', mom: '-0.9%' }, { period: '26-07', value: 54.8, yoy: '-4.0%', mom: '-0.4%' }, { period: '26-08', value: 54.6, yoy: '-4.1%', mom: '-0.4%' }],
  },
  {
    id: 'm-58', code: '58', name: '单位产值电耗（GIS-抽真空)', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '42.8', yoy: '-3.9%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: 'GIS抽真空',
    tipText: 'GIS-抽真空工序每万元产值电耗', formula: 'u_GIS-真空-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 真空泵用电 (kWh)；G: 产值 (万元)。',
    numeratorName: 'GIS 组合电器 SF6 抽真空充气用电 Q', numeratorVal: '214,000 kWh', denominatorName: 'GIS 产值 G', denominatorVal: '5,000.0 万元', dataSource: 'GIS 装配车间真空泵电表。',
    rawMeters: [{ medium: '抽真空用电', meterCode: 'EQ-GIS-VACUUM', location: 'GIS车间', reading: '214,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '26.3' }],
    trendHistory: [{ period: '25-09', value: 45.5, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 44.6, yoy: '-3.0%', mom: '-2.0%' }, { period: '25-11', value: 44.0, yoy: '-3.2%', mom: '-1.3%' }, { period: '25-12', value: 45.0, yoy: '-2.9%', mom: '+2.3%' }, { period: '26-01', value: 43.5, yoy: '-3.5%', mom: '-3.3%' }, { period: '26-02', value: 43.2, yoy: '-3.6%', mom: '-0.7%' }, { period: '26-03', value: 44.6, yoy: '-3.0%', mom: '+3.2%' }, { period: '26-04', value: 44.0, yoy: '-3.2%', mom: '-1.3%' }, { period: '26-05', value: 43.5, yoy: '-3.5%', mom: '-1.1%' }, { period: '26-06', value: 43.2, yoy: '-3.6%', mom: '-0.7%' }, { period: '26-07', value: 43.0, yoy: '-3.8%', mom: '-0.5%' }, { period: '26-08', value: 42.8, yoy: '-3.9%', mom: '-0.5%' }],
  },
  {
    id: 'm-59', code: '59', name: '单位产值电耗（GIS-绝缘件干燥)', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '48.5', yoy: '-4.2%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: 'GIS干燥',
    tipText: 'GIS-绝缘件干燥工序每万元产值电耗', formula: 'u_GIS-干燥-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 干燥烘箱用电 (kWh)；G: 产值 (万元)。',
    numeratorName: 'GIS 绝缘拉杆及盆子干燥烘箱用电 Q', numeratorVal: '242,500 kWh', denominatorName: 'GIS 干燥产值 G', denominatorVal: '5,000.0 万元', dataSource: '干燥烘箱智能控表。',
    rawMeters: [{ medium: '绝缘干燥用电', meterCode: 'EQ-GIS-DRY', location: 'GIS干燥房', reading: '242,500 kWh', unit: 'kWh', coeff: '0.1229', tce: '29.8' }],
    trendHistory: [{ period: '25-09', value: 51.5, yoy: '-3.0%', mom: '-0.5%' }, { period: '25-10', value: 50.5, yoy: '-3.3%', mom: '-1.9%' }, { period: '25-11', value: 49.8, yoy: '-3.6%', mom: '-1.4%' }, { period: '25-12', value: 51.0, yoy: '-3.2%', mom: '+2.4%' }, { period: '26-01', value: 49.2, yoy: '-3.9%', mom: '-3.5%' }, { period: '26-02', value: 48.8, yoy: '-4.0%', mom: '-0.8%' }, { period: '26-03', value: 50.5, yoy: '-3.3%', mom: '+3.5%' }, { period: '26-04', value: 49.8, yoy: '-3.6%', mom: '-1.4%' }, { period: '26-05', value: 49.2, yoy: '-3.9%', mom: '-1.2%' }, { period: '26-06', value: 48.8, yoy: '-4.0%', mom: '-0.8%' }, { period: '26-07', value: 48.6, yoy: '-4.1%', mom: '-0.4%' }, { period: '26-08', value: 48.5, yoy: '-4.2%', mom: '-0.2%' }],
  },
  {
    id: 'm-60', code: '60', name: '单位产值电耗（GIS-工频耐压试验)', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '35.6', yoy: '-3.7%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: 'GIS耐压试验',
    tipText: 'GIS-工频耐压试验工序每万元产值电耗', formula: 'u_GIS-试验-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 试验变压器用电 (kWh)；G: 产值 (万元)。',
    numeratorName: 'GIS 整体工频耐压及局放测试用电 Q', numeratorVal: '178,000 kWh', denominatorName: 'GIS 试验产值 G', denominatorVal: '5,000.0 万元', dataSource: 'GIS 试验大厅专用配电表。',
    rawMeters: [{ medium: 'GIS耐压试验用电', meterCode: 'EM-GIS-TEST', location: 'GIS试验大厅', reading: '178,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '21.9' }],
    trendHistory: [{ period: '25-09', value: 37.8, yoy: '-2.5%', mom: '-0.5%' }, { period: '25-10', value: 37.0, yoy: '-2.8%', mom: '-2.1%' }, { period: '25-11', value: 36.5, yoy: '-3.0%', mom: '-1.4%' }, { period: '25-12', value: 37.2, yoy: '-2.7%', mom: '+1.9%' }, { period: '26-01', value: 36.0, yoy: '-3.2%', mom: '-3.2%' }, { period: '26-02', value: 35.8, yoy: '-3.3%', mom: '-0.6%' }, { period: '26-03', value: 37.0, yoy: '-2.8%', mom: '+3.4%' }, { period: '26-04', value: 36.5, yoy: '-3.0%', mom: '-1.4%' }, { period: '26-05', value: 36.0, yoy: '-3.2%', mom: '-1.4%' }, { period: '26-06', value: 35.8, yoy: '-3.3%', mom: '-0.6%' }, { period: '26-07', value: 35.7, yoy: '-3.5%', mom: '-0.3%' }, { period: '26-08', value: 35.6, yoy: '-3.7%', mom: '-0.3%' }],
  },
  {
    id: 'm-61', code: '61', name: '单位产值电耗（GIS-空调恒温除湿)', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/万元', curVal: '52.1', yoy: '-4.5%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: 'GIS净化除湿',
    tipText: 'GIS-空调恒温除湿工序每万元产值电耗', formula: 'u_GIS-除湿-电 = Q / G', formulaDesc: '月度指标。u: 单位产值电耗 (kWh/万元)；Q: 净化空调用电 (kWh)；G: 产值 (万元)。',
    numeratorName: 'GIS 尘洁净化车间恒温恒湿空调机组用电 Q', numeratorVal: '260,500 kWh', denominatorName: 'GIS 装配产值 G', denominatorVal: '5,000.0 万元', dataSource: '净化空调机房专用电能表。',
    rawMeters: [{ medium: '净化除湿用电', meterCode: 'EM-GIS-HVAC', location: 'GIS净化厂房', reading: '260,500 kWh', unit: 'kWh', coeff: '0.1229', tce: '32.0' }],
    trendHistory: [{ period: '25-09', value: 55.5, yoy: '-3.2%', mom: '-0.5%' }, { period: '25-10', value: 54.5, yoy: '-3.5%', mom: '-1.8%' }, { period: '25-11', value: 53.8, yoy: '-3.8%', mom: '-1.3%' }, { period: '25-12', value: 55.0, yoy: '-3.4%', mom: '+2.2%' }, { period: '26-01', value: 53.0, yoy: '-4.1%', mom: '-3.6%' }, { period: '26-02', value: 52.6, yoy: '-4.2%', mom: '-0.8%' }, { period: '26-03', value: 54.5, yoy: '-3.5%', mom: '+3.6%' }, { period: '26-04', value: 53.8, yoy: '-3.8%', mom: '-1.3%' }, { period: '26-05', value: 53.0, yoy: '-4.1%', mom: '-1.5%' }, { period: '26-06', value: 52.6, yoy: '-4.2%', mom: '-0.8%' }, { period: '26-07', value: 52.3, yoy: '-4.4%', mom: '-0.6%' }, { period: '26-08', value: 52.1, yoy: '-4.5%', mom: '-0.4%' }],
  },
  {
    id: 'm-62', code: '62', name: '单位产量电耗（非晶合金铁心-退火）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/t', curVal: '320.5', yoy: '-4.8%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '非晶退火',
    tipText: '生产每t非晶合金铁心，退火工序耗电量', formula: 'q_非晶-退火-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/t)；Q: 退火炉用电 (kWh)；M: 铁心产量 (t)。',
    numeratorName: '非晶铁心磁场退火炉加热用电 Q', numeratorVal: '480,750 kWh', denominatorName: '非晶合金铁心产量 M', denominatorVal: '1,500 t', dataSource: '非晶退火炉智能调功控制器电表。',
    rawMeters: [{ medium: '非晶退火用电', meterCode: 'EQ-AMORPHOUS-FURN', location: '非晶车间', reading: '480,750 kWh', unit: 'kWh', coeff: '0.1229', tce: '59.1' }],
    trendHistory: [{ period: '25-09', value: 342.0, yoy: '-3.5%', mom: '-0.5%' }, { period: '25-10', value: 336.0, yoy: '-3.8%', mom: '-1.8%' }, { period: '25-11', value: 332.0, yoy: '-4.0%', mom: '-1.2%' }, { period: '25-12', value: 338.0, yoy: '-3.6%', mom: '+1.8%' }, { period: '26-01', value: 326.0, yoy: '-4.3%', mom: '-3.6%' }, { period: '26-02', value: 324.0, yoy: '-4.4%', mom: '-0.6%' }, { period: '26-03', value: 336.0, yoy: '-3.8%', mom: '+3.7%' }, { period: '26-04', value: 332.0, yoy: '-4.0%', mom: '-1.2%' }, { period: '26-05', value: 326.0, yoy: '-4.3%', mom: '-1.8%' }, { period: '26-06', value: 324.0, yoy: '-4.4%', mom: '-0.6%' }, { period: '26-07', value: 322.0, yoy: '-4.6%', mom: '-0.6%' }, { period: '26-08', value: 320.5, yoy: '-4.8%', mom: '-0.5%' }],
  },
  {
    id: 'm-63', code: '63', name: '单位产量电耗（硅钢铁心-纵剪）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/t', curVal: '68.5', yoy: '-3.6%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '硅钢纵剪',
    tipText: '生产每t硅钢铁心，纵剪工序耗电量', formula: 'q_硅钢-纵剪-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/t)；Q: 纵剪机电量 (kWh)；M: 产量 (t)。',
    numeratorName: '纵剪机组用电量 Q', numeratorVal: '287,700 kWh', denominatorName: '加工硅钢片重量 M', denominatorVal: '4,200 t', dataSource: '纵剪线多功能数显电表。',
    rawMeters: [{ medium: '纵剪用电', meterCode: 'EQ-CUT-SILICON', location: '铁芯车间', reading: '287,700 kWh', unit: 'kWh', coeff: '0.1229', tce: '35.4' }],
    trendHistory: [{ period: '25-09', value: 72.5, yoy: '-2.5%', mom: '-0.5%' }, { period: '25-10', value: 71.2, yoy: '-2.8%', mom: '-1.8%' }, { period: '25-11', value: 70.5, yoy: '-3.0%', mom: '-1.0%' }, { period: '25-12', value: 71.8, yoy: '-2.7%', mom: '+1.8%' }, { period: '26-01', value: 69.5, yoy: '-3.2%', mom: '-3.2%' }, { period: '26-02', value: 69.2, yoy: '-3.3%', mom: '-0.4%' }, { period: '26-03', value: 71.2, yoy: '-2.8%', mom: '+2.9%' }, { period: '26-04', value: 70.5, yoy: '-3.0%', mom: '-1.0%' }, { period: '26-05', value: 69.5, yoy: '-3.2%', mom: '-1.4%' }, { period: '26-06', value: 69.2, yoy: '-3.3%', mom: '-0.4%' }, { period: '26-07', value: 68.8, yoy: '-3.5%', mom: '-0.6%' }, { period: '26-08', value: 68.5, yoy: '-3.6%', mom: '-0.4%' }],
  },
  {
    id: 'm-64', code: '64', name: '单位产量电耗（硅钢铁心-中型叠装）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/t', curVal: '42.8', yoy: '-3.4%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '中型叠装',
    tipText: '生产每t硅钢铁心，中型叠装工序耗电量', formula: 'q_硅钢-中型叠装-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/t)；Q: 叠片机电量 (kWh)；M: 产量 (t)。',
    numeratorName: '中型自动叠片机械手用电 Q', numeratorVal: '107,000 kWh', denominatorName: '中型铁心产量 M', denominatorVal: '2,500 t', dataSource: '中型叠装生产线电表。',
    rawMeters: [{ medium: '中型叠装用电', meterCode: 'EQ-MID-STACK', location: '铁芯车间', reading: '107,000 kWh', unit: 'kWh', coeff: '0.1229', tce: '13.1' }],
    trendHistory: [{ period: '25-09', value: 45.2, yoy: '-2.4%', mom: '-0.5%' }, { period: '25-10', value: 44.5, yoy: '-2.6%', mom: '-1.5%' }, { period: '25-11', value: 44.0, yoy: '-2.8%', mom: '-1.1%' }, { period: '25-12', value: 44.8, yoy: '-2.5%', mom: '+1.8%' }, { period: '26-01', value: 43.5, yoy: '-3.0%', mom: '-2.9%' }, { period: '26-02', value: 43.2, yoy: '-3.1%', mom: '-0.7%' }, { period: '26-03', value: 44.5, yoy: '-2.6%', mom: '+3.0%' }, { period: '26-04', value: 44.0, yoy: '-2.8%', mom: '-1.1%' }, { period: '26-05', value: 43.5, yoy: '-3.0%', mom: '-1.1%' }, { period: '26-06', value: 43.2, yoy: '-3.1%', mom: '-0.7%' }, { period: '26-07', value: 43.0, yoy: '-3.3%', mom: '-0.5%' }, { period: '26-08', value: 42.8, yoy: '-3.4%', mom: '-0.5%' }],
  },
  {
    id: 'm-65', code: '65', name: '单位产量电耗（硅钢铁心-大型叠装）', category: 'process', categoryName: '三、关键制造工序能效管控指标', unit: 'kWh/t', curVal: '54.2', yoy: '-3.9%', isYoyDown: true, status: '常规监测', statusType: 'green', badge: '大型叠装',
    tipText: '生产每t硅钢铁心，大型叠装工序耗电量', formula: 'q_硅钢-大型叠装-电 = Q / M', formulaDesc: '月度指标。q: 单位产品电耗 (kWh/t)；Q: 翻转台用电 (kWh)；M: 产量 (t)。',
    numeratorName: '特高压大型铁心翻转叠装台用电 Q', numeratorVal: '135,500 kWh', denominatorName: '大型铁心产量 M', denominatorVal: '2,500 t', dataSource: '大型叠装车间天车及翻转台电表。',
    rawMeters: [{ medium: '大型叠装用电', meterCode: 'EQ-LARGE-STACK', location: '铁芯车间', reading: '135,500 kWh', unit: 'kWh', coeff: '0.1229', tce: '16.7' }],
    trendHistory: [{ period: '25-09', value: 57.5, yoy: '-2.8%', mom: '-0.5%' }, { period: '25-10', value: 56.5, yoy: '-3.0%', mom: '-1.7%' }, { period: '25-11', value: 55.8, yoy: '-3.2%', mom: '-1.2%' }, { period: '25-12', value: 56.8, yoy: '-2.9%', mom: '+1.8%' }, { period: '26-01', value: 55.0, yoy: '-3.5%', mom: '-3.2%' }, { period: '26-02', value: 54.8, yoy: '-3.6%', mom: '-0.4%' }, { period: '26-03', value: 56.5, yoy: '-3.0%', mom: '+3.1%' }, { period: '26-04', value: 55.8, yoy: '-3.2%', mom: '-1.2%' }, { period: '26-05', value: 55.0, yoy: '-3.5%', mom: '-1.4%' }, { period: '26-06', value: 54.8, yoy: '-3.6%', mom: '-0.4%' }, { period: '26-07', value: 54.5, yoy: '-3.7%', mom: '-0.5%' }, { period: '26-08', value: 54.2, yoy: '-3.9%', mom: '-0.5%' }],
  },
]

export default function IndicatorControlPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'comp_sb',
    name: '沈变公司',
    fullName: '沈变公司 (东北输变电中心)',
    level: 'company',
    badge: '5单位',
  })

  // 时间维度: 'month' | 'quarter' | 'year'
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  
  // 🌟 点击卡片激活的 Mode B 详情指标 Mode B (Null 时为 Mode A 全景概览)
  const [activeViewMetric, setActiveViewMetric] = useState<IndicatorMetric | null>(null)
  
  // 🌟 集团层级综合对比视图切换: 'card' (卡片PK) | 'table' (透视大表)
  const [groupViewMode, setGroupViewMode] = useState<'card' | 'table'>('card')
  const [selectedGroupMetricId, setSelectedGroupMetricId] = useState<string>('gm-total-energy')
  const activeGroupMetric = useMemo(() => {
    return (
      GROUP_OVERALL_TOP10_METRICS.find((m) => m.id === selectedGroupMetricId) ||
      GROUP_OVERALL_TOP10_METRICS[1]
    )
  }, [selectedGroupMetricId])

  const [procSearchKey, setProcSearchKey] = useState('')

  // 判断当前选中节点层级
  const isGroupLevel = selectedNode.level === 'group'
  const isCompanyLevel = selectedNode.level === 'company'
  const isWorkshopLevel = selectedNode.level === 'workshop'

  // 工序指标搜索过滤
  const filteredProcessMetrics = useMemo(() => {
    if (!procSearchKey.trim()) return PROCESS_CONTROL_METRICS
    const kw = procSearchKey.trim().toLowerCase()
    return PROCESS_CONTROL_METRICS.filter(
      (m) =>
        m.name.toLowerCase().includes(kw) ||
        m.code.toLowerCase().includes(kw) ||
        m.formula.toLowerCase().includes(kw) ||
        m.unit.toLowerCase().includes(kw)
    )
  }, [procSearchKey])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => {
          setSelectedNode(node)
          setActiveViewMetric(null) // 切换组织节点时自动回到全景概览
        }}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        
        {/* ========================================================================= */}
        {/* 模式 B: 点击卡片后直接呈现【指标详情透视与 12 个月历史明细台账内页】 (参照 media_1787836545294.png) */}
        {/* ========================================================================= */}
        {activeViewMetric !== null ? (
          <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            {/* 顶部面包屑与全景概览返回导航 */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveViewMetric(null)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                >
                  <ChevronLeft className="size-4 text-slate-500" />
                  <span>返回</span>
                </button>
                <div className="h-4 w-px bg-slate-200" />
                <div>
                  <h1 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{activeViewMetric.name} ({activeViewMetric.unit})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-mono font-bold">
                      {activeViewMetric.categoryName}
                    </span>
                  </h1>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    考核单位：【<strong className="text-slate-700">{selectedNode.name}</strong>】 · 数据频率：按月汇总 · 归口中心：零碳园区集控中心
                  </p>
                </div>
              </div>
            </div>

            {/* 顶部 3 栏信息卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs font-mono">
              {/* 1. 指标物理定义 */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold font-sans">
                  <Info className="size-4 text-[#1677ff]" />
                  <span>指标物理定义</span>
                </div>
                <p className="text-slate-600 font-sans text-[11.5px] leading-relaxed">
                  {activeViewMetric.tipText}
                </p>
              </div>

              {/* 2. 核算数学公式 */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold font-sans">
                  <Calculator className="size-4 text-purple-600" />
                  <span>核算数学公式</span>
                </div>
                <div className="text-slate-900 font-extrabold text-xs font-sans bg-purple-50/60 p-2 rounded-lg border border-purple-100">
                  {activeViewMetric.formula}
                </div>
                <p className="text-slate-500 text-[10.5px] font-sans leading-relaxed">
                  {activeViewMetric.formulaDesc}
                </p>
              </div>

              {/* 3. 因子说明 (根据指标动态显示折标煤系数或碳排放因子) */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                {(() => {
                  const factorInfo = getFactorDescription(activeViewMetric)
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold font-sans">
                          <Layers className="size-4 text-emerald-600" />
                          <span>因子说明</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/80">
                          {factorInfo.title}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-sans">
                        {factorInfo.subtitle}
                      </div>
                      <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                        {factorInfo.content}
                      </p>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* 中间图表：近 12 个月数据变化趋势走势 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#1677ff]" />
                  <h3 className="text-xs font-bold text-slate-800">
                    ● 近 12 个月数据变化趋势与基准对比走势
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-mono">
                    2025.09 ~ 2026.08
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-[#1677ff] font-bold">
                    <span className="size-2.5 rounded-full bg-[#1677ff]" /> 实测值走势
                  </span>
                </div>
              </div>

              <div className="h-[260px]">
                <LineTrend
                  data={activeViewMetric.trendHistory}
                  xKey="period"
                  height={260}
                  lines={[
                    { key: 'value', name: `实测值 (${activeViewMetric.unit})`, color: '#1677ff' },
                  ]}
                />
              </div>
            </div>

            {/* 底部表格：数据明细 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <Table className="size-4 text-slate-700" />
                  <h3 className="text-xs font-bold text-slate-800">
                    数据明细
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`正在导出【${activeViewMetric.name}】历史明细台账 (Excel)...`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
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
                      <th className="py-2.5 px-3 text-right">⚡ 用电量 (万kWh)</th>
                      <th className="py-2.5 px-3 text-right">💧 用水量 (万t)</th>
                      <th className="py-2.5 px-3 text-right">🔥 用气量 (万m³)</th>
                      <th className="py-2.5 px-3 text-right">💨 蒸汽量 (t)</th>
                      <th className="py-2.5 px-3 font-mono text-right">月度实测值</th>
                      <th className="py-2.5 px-3 font-mono text-right">环比变化 (MoM)</th>
                      <th className="py-2.5 px-3 font-mono text-right">同比变化 (YoY)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {activeViewMetric.trendHistory.map((item, idx) => {
                      const baseFactor = item.value / (activeViewMetric.trendHistory[activeViewMetric.trendHistory.length - 1].value || 1)
                      const elecVal = (324.6 + idx * 2.3).toFixed(1)
                      const waterVal = (4.06 + idx * 0.03).toFixed(2)
                      const gasVal = (16.7 + idx * 0.12).toFixed(1)
                      const steamVal = (362 + idx * 2.5).toFixed(0)

                      return (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-bold">
                            {item.period === '26-08' ? '2026年08月' : `20${item.period.replace('-', '年')}月`}
                          </td>
                          <td className="py-2.5 px-3 text-right text-blue-700 font-bold">{elecVal}</td>
                          <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">{waterVal}</td>
                          <td className="py-2.5 px-3 text-right text-amber-700 font-bold">{gasVal}</td>
                          <td className="py-2.5 px-3 text-right text-purple-700 font-bold">{steamVal}</td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-[#1677ff]">
                            {item.value} {activeViewMetric.unit}
                          </td>
                          <td className={cn('py-2.5 px-3 text-right font-bold', item.mom.startsWith('+') ? 'text-amber-600' : 'text-emerald-600')}>
                            {item.mom}
                          </td>
                          <td className={cn('py-2.5 px-3 text-right font-bold', item.yoy.startsWith('+') ? 'text-amber-600' : 'text-emerald-600')}>
                            {item.yoy}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 模式 A: 全景概览 View (Section 1 5-cols, Section 2 5-cols, Section 3 4-cols) */
          /* ========================================================================= */
          <div className="space-y-3.5">
            {/* 1. 顶部 Header 与 统一时间筛选 */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
                  <BarChart3 className="size-5" />
                </div>
                <h1 className="text-base font-bold text-slate-800">指标管控</h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 时间维度统一 (月度/季度/年度) */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setTimeDim('month')}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                      timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    月度 (08月)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeDim('quarter')}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                      timeDim === 'quarter' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    季度 (Q3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeDim('year')}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                      timeDim === 'year' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    年度 (2026)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`正在导出【${selectedNode.name}】指标管控报表 (Excel)...`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  <Download className="size-3.5" />
                  <span>导出指标数据表</span>
                </button>
              </div>
            </div>

                        {/* 集团视角 (整体指标呈现 6 大单位能耗与费用占比情况) */}
            {isGroupLevel && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-[#1677ff] shrink-0" />
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      【一、经营单位及项目公司整体指标 (6 大单位占比)】
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    统计周期: 2026年08月 · 6 大制造公司能耗与费用横向占比
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 font-mono">
                  {GROUP_COMPANIES_METRICS.map((c, idx) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedNode({
                          id: c.id,
                          name: c.name,
                          fullName: c.fullName,
                          level: 'company',
                          badge: c.industryName,
                        })
                      }}
                      className={cn(
                        'p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 group shadow-2xs select-none',
                        idx === 0
                          ? 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                      )}
                    >
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-bold text-slate-900">{idx + 1}. {c.name}</span>
                        <span className={cn(
                          'px-1.5 py-0.2 rounded font-bold text-[10px]',
                          idx === 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                        )}>
                          能耗占比 {c.energyShare}
                        </span>
                      </div>
                      <div className={cn(
                        'text-xl font-bold',
                        idx === 0 ? 'text-[#1677ff]' : 'text-slate-900'
                      )}>
                        {c.costWan.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">万元 ({c.energyTce.toFixed(1)} tce)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60 font-sans flex justify-between">
                        <span>费用占比: <strong className="text-slate-800 font-mono">{c.costShare}</strong></span>
                        <span className="text-emerald-600 font-bold">同比 {c.yoy} ↓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 二级单位与项目公司通用整体指标 (10 项指标卡片) */}
            {(isWorkshopLevel || isCompanyLevel) && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-[#1677ff] shrink-0" />
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      【一、经营单位及项目公司整体指标】
                    </h2>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    保留同比变化 · 点击查看 12 个月历史明细与公式
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
                  {FACTORY_TOP10_METRICS.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setActiveViewMetric(m)}
                      className="p-3.5 bg-slate-50/70 hover:bg-blue-50/40 rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer space-y-2 group shadow-2xs"
                    >
                      <div className="flex items-center justify-between font-sans gap-1">
                        <span className="text-[11px] font-bold text-slate-700 truncate">{m.name}</span>
                        {m.badge && (
                          <span
                            className={cn(
                              'text-[9px] px-1.5 py-0.5 rounded font-sans font-medium shrink-0 whitespace-nowrap',
                              m.badge === '国家级零碳工厂' && 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
                              m.badge === '国家级绿色工厂' && 'bg-teal-50 text-teal-700 border border-teal-200/80',
                              m.badge === '公司管理要求' && 'bg-blue-50 text-blue-700 border border-blue-200/80'
                            )}
                          >
                            {m.badge}
                          </span>
                        )}
                      </div>

                      <div className="text-lg font-extrabold text-slate-900 group-hover:text-[#1677ff] transition-colors">
                        {m.curVal} <span className="text-xs font-normal text-slate-500 font-sans">{m.unit}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-sans">
                        <span className="text-slate-500">同比</span>
                        <span className="font-bold text-emerald-600 font-mono">{m.yoy} ↓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 二、产品管控指标 (5卡片/行 + 跳转链接) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-1 rounded-full bg-amber-500 shrink-0" />
                      <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        【二、产品管控指标】
                      </h2>
                    </div>
                    <Link
                      href="/zero-carbon/energy/unit-product"
                      className="flex items-center gap-1 text-xs text-[#1677ff] font-bold hover:underline"
                    >
                      <span>跳转到【单位产品能耗分析 (产线-产品种类-产品型号)】</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
                    {PRODUCT_CONTROL_METRICS.map((pm) => (
                      <div
                        key={pm.id}
                        onClick={() => setActiveViewMetric(pm)}
                        className="p-3.5 bg-amber-50/30 hover:bg-amber-50/80 rounded-xl border border-amber-200/80 hover:border-amber-300 transition-all cursor-pointer space-y-2 group shadow-2xs"
                      >
                        <div className="flex items-center justify-between font-sans">
                          <span className="text-[11px] font-bold text-slate-800 truncate" title={pm.name}>
                            {pm.name}
                          </span>
                        </div>

                        <div className="text-lg font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {pm.curVal} <span className="text-[10.5px] font-normal text-slate-500 font-sans">{pm.unit}</span>
                        </div>

                        <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-sans">
                          <span className="text-slate-500">同比</span>
                          <span className="font-bold text-emerald-600 font-mono">{pm.yoy} ↓</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 三、关键制造工序能效管控指标 (4卡片/行) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-1 rounded-full bg-purple-600 shrink-0" />
                      <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        【三、关键制造工序能效管控指标】
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={procSearchKey}
                          onChange={(e) => setProcSearchKey(e.target.value)}
                          placeholder="搜索工序指标 (如: 拉丝 / 干燥 / 固化)..."
                          className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-600 font-sans w-64"
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-mono">集控统一采集 · 序号 17-65</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
                    {filteredProcessMetrics.map((prm) => (
                      <div
                        key={prm.id}
                        onClick={() => setActiveViewMetric(prm)}
                        className="p-3.5 rounded-xl border border-purple-200/80 bg-purple-50/30 hover:bg-purple-50/80 transition-all cursor-pointer space-y-2 group shadow-2xs"
                      >
                        <div className="flex items-center justify-between font-sans">
                          <span className="text-xs font-bold text-slate-900 truncate" title={prm.name}>
                            {prm.name}
                          </span>
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold shrink-0">
                            {prm.badge}
                          </span>
                        </div>

                        <div className="text-lg font-extrabold text-[#1677ff] group-hover:text-purple-700 transition-colors">
                          {prm.curVal} <span className="text-xs font-normal text-slate-500 font-sans">{prm.unit}</span>
                        </div>

                        <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-[11px] font-sans">
                          <span className="text-slate-500 truncate" title={prm.formula}>
                            {prm.formula}
                          </span>
                          <span className="font-bold text-emerald-600 font-mono shrink-0 ml-1">{prm.yoy} ↓</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
// 因子说明生成函数 (依据指标类别动态返回折标煤系数或碳排放因子)
function getFactorDescription(metric: IndicatorMetric): { title: string; subtitle: string; content: string } {
  const name = metric.name || ''
  const unit = metric.unit || ''

  // 1. 碳排放相关指标
  if (name.includes('碳排放') || name.includes('碳足迹') || unit.includes('tCO2')) {
    return {
      title: '碳排放因子说明',
      subtitle: '依据生态环境部最新电网基准与发改委温室气体核算指南',
      content: '电力碳排放因子：0.5703 tCO2/MWh（全国电网平均因子）；天然气碳排放因子：2.1622 tCO2/万m³（单位热值含碳量 15.32 tC/TJ）；自建分布式光伏与物理直供绿电按 0 排放核算。',
    }
  }

  // 2. 绿电与非化石能源占比类指标
  if (name.includes('非化石') || name.includes('绿电') || name.includes('绿能')) {
    return {
      title: '绿能折算与因子说明',
      subtitle: '依据《零碳工厂评价规范》及国家可再生能源绿证核销机制',
      content: '物理可溯源绿电直供折算系数：1.0（自建屋顶光伏逆变器关口直供，不含外部市场化凭证）；交易绿电与绿证核销折算：1 绿证等效抵扣 1,000 kWh 可再生能源消纳量。',
    }
  }

  // 3. 水资源指标
  if (name.includes('水资源') || name.includes('水耗') || unit.includes('t/万') || unit === 't') {
    return {
      title: '水资源折算因子说明',
      subtitle: '依据 GB/T 18916 工业取水定额与国家节能标准',
      content: '新鲜水等效折标煤系数：0.0001 tce/t（折标煤系数 0.0857 kgce/t）；全厂市政自来水经总水表与车间二级远传表精确计量，重复利用水不重复计入新鲜水消耗总量。',
    }
  }

  // 4. 节能装备与碳足迹占比
  if (name.includes('节能装备') || name.includes('设备')) {
    return {
      title: '能效等级准入因子说明',
      subtitle: '依据 GB 18613-2020 与《重点用能产品设备能效先进水平》',
      content: '先进节能装备额定功率折算系数：1.0（达到强制性国家标准 2 级及以上能效电动机、节能变压器、一级能效空压机）；普通低效设备不计入节能装备额定总功率。',
    }
  }

  // 5. 综合能耗 / 单耗 / 工序能耗等各类折标煤指标
  return {
    title: '折标煤系数说明',
    subtitle: '依据 GB/T 2589-2020《综合能耗计算通则》',
    content: '电力折标系数：0.1229 kgce/kWh（当量值）；天然气折标系数：1.2143 kgce/m³；饱和蒸汽折标系数：0.1286 kgce/kg；新鲜水折标系数：0.0857 kgce/t。按报告期各种能源实物消耗量折标加总。',
  }
}



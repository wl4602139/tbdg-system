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
import { LineTrend, SankeyFlow } from '@/components/shared/charts'
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


// 🌟 集团大盘 10 项公司整体管控指标定义清单 (与图片顺序 100% 保持完全一致)
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
    dataSource: '基于月度电力、天然气、蒸汽实物量及各属地省级电网排放因子自动核算生成。',
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
    id: 'gm-water-consumption',
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
    dataSource: '基于月度电力、天然气、蒸汽实物量及各属地省级电网排放因子自动核算生成。',
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

// 🌟 1、2、3 级组织节点能流与指标下钻桑基图数据生成器 (一级集团 ➔ 二级公司 ➔ 三级全量直属工厂，从上到下严格按公司拓扑排序)
function getMetricSankeyData(
  metricId: string,
  metric: IndicatorMetric,
  selectedNode?: StandardOrgNode
): {
  nodes: { name: string; itemStyle?: { color: string }; depth?: number; displayVal?: string }[]
  links: { source: string; target: string; value: number }[]
  unit: string
} {
  const unit = metric.unit || 'tce'
  const isCompany = selectedNode?.level === 'company'
  const compName = selectedNode?.name || ''

  // 全集团 28 个直属分厂/专业制造工厂标准配色（按 6 大公司色系从上到下阶梯渐变）
  const factoryColors: Record<string, string> = {
    // 沈变公司系 (深蓝渐变)
    '沈变本部': '#1d39c4',
    '和新套管公司': '#2f54eb',
    '康嘉互感器': '#597ef7',
    '露娜智能制造': '#85a5ff',
    '智慧能源': '#adc6ff',
    '印能公司': '#d6e4ff',

    // 衡变公司系 (青绿/青色渐变)
    '衡变本部': '#08979c',
    '南京电研': '#13c2c2',
    '云集电气': '#36cfc9',
    '云集高压开关': '#5cdbd3',
    '湖南电气': '#87e8de',
    '新疆自控': '#006d75',
    '特能建': '#00474f',
    '合容电气': '#13c2c2',
    '赛杰爱迪': '#36cfc9',

    // 新变厂系 (紫色/丁香渐变)
    '超高压公司': '#531dab',
    '天变公司': '#722ed1',
    '珠峰硅钢': '#9254de',
    '智能电气公司': '#b37feb',
    '京津冀公司': '#d3adf7',
    '银利电气': '#efdbff',

    // 鲁缆公司系 (琥珀橙渐变)
    '鲁缆本部': '#d46b08',
    '曙光公司': '#fa8c16',
    '智缆公司': '#ffa940',
    '昭和公司': '#ffd591',

    // 新缆厂系 (翠绿/生机渐变)
    '新缆厂本部': '#389e0d',
    '新疆电缆公司': '#52c41a',

    // 德缆公司系 (洋红/玫瑰渐变)
    '德缆公司本部': '#c41d7f',
  }

  // 🌟 全量 28 个直属工厂节点定义（从上到下严格依照公司组织结构严格排列）
  const GROUP_LEVEL_NODES = [
    // 1级 集团总部
    { name: '电装集团', depth: 0, itemStyle: { color: '#1677ff' } },

    // 2级 6 大经营制造公司 (从上到下按企业结构)
    { name: '沈变公司', depth: 1, itemStyle: { color: '#2f54eb' } },
    { name: '衡变公司', depth: 1, itemStyle: { color: '#13c2c2' } },
    { name: '新变厂', depth: 1, itemStyle: { color: '#722ed1' } },
    { name: '鲁缆公司', depth: 1, itemStyle: { color: '#fa8c16' } },
    { name: '新缆厂', depth: 1, itemStyle: { color: '#52c41a' } },
    { name: '德缆公司', depth: 1, itemStyle: { color: '#eb2f96' } },

    // 3级 直属工厂 (严格按所属公司从上到下顺序分组呈现)
    // ---------------- [1. 沈变公司直属工厂 6家] ----------------
    { name: '沈变本部', depth: 2, itemStyle: { color: factoryColors['沈变本部'] } },
    { name: '和新套管公司', depth: 2, itemStyle: { color: factoryColors['和新套管公司'] } },
    { name: '康嘉互感器', depth: 2, itemStyle: { color: factoryColors['康嘉互感器'] } },
    { name: '露娜智能制造', depth: 2, itemStyle: { color: factoryColors['露娜智能制造'] } },
    { name: '智慧能源', depth: 2, itemStyle: { color: factoryColors['智慧能源'] } },
    { name: '印能公司', depth: 2, itemStyle: { color: factoryColors['印能公司'] } },

    // ---------------- [2. 衡变公司直属工厂 9家] ----------------
    { name: '衡变本部', depth: 2, itemStyle: { color: factoryColors['衡变本部'] } },
    { name: '南京电研', depth: 2, itemStyle: { color: factoryColors['南京电研'] } },
    { name: '云集电气', depth: 2, itemStyle: { color: factoryColors['云集电气'] } },
    { name: '云集高压开关', depth: 2, itemStyle: { color: factoryColors['云集高压开关'] } },
    { name: '湖南电气', depth: 2, itemStyle: { color: factoryColors['湖南电气'] } },
    { name: '新疆自控', depth: 2, itemStyle: { color: factoryColors['新疆自控'] } },
    { name: '特能建', depth: 2, itemStyle: { color: factoryColors['特能建'] } },
    { name: '合容电气', depth: 2, itemStyle: { color: factoryColors['合容电气'] } },
    { name: '赛杰爱迪', depth: 2, itemStyle: { color: factoryColors['赛杰爱迪'] } },

    // ---------------- [3. 新变厂直属工厂 6家] ----------------
    { name: '超高压公司', depth: 2, itemStyle: { color: factoryColors['超高压公司'] } },
    { name: '天变公司', depth: 2, itemStyle: { color: factoryColors['天变公司'] } },
    { name: '珠峰硅钢', depth: 2, itemStyle: { color: factoryColors['珠峰硅钢'] } },
    { name: '智能电气公司', depth: 2, itemStyle: { color: factoryColors['智能电气公司'] } },
    { name: '京津冀公司', depth: 2, itemStyle: { color: factoryColors['京津冀公司'] } },
    { name: '银利电气', depth: 2, itemStyle: { color: factoryColors['银利电气'] } },

    // ---------------- [4. 鲁缆公司直属工厂 4家] ----------------
    { name: '鲁缆本部', depth: 2, itemStyle: { color: factoryColors['鲁缆本部'] } },
    { name: '曙光公司', depth: 2, itemStyle: { color: factoryColors['曙光公司'] } },
    { name: '智缆公司', depth: 2, itemStyle: { color: factoryColors['智缆公司'] } },
    { name: '昭和公司', depth: 2, itemStyle: { color: factoryColors['昭和公司'] } },

    // ---------------- [5. 新缆厂直属工厂 2家] ----------------
    { name: '新缆厂本部', depth: 2, itemStyle: { color: factoryColors['新缆厂本部'] } },
    { name: '新疆电缆公司', depth: 2, itemStyle: { color: factoryColors['新疆电缆公司'] } },

    // ---------------- [6. 德缆公司直属工厂 1家] ----------------
    { name: '德缆公司本部', depth: 2, itemStyle: { color: factoryColors['德缆公司本部'] } },
  ]

  // =========================================================================
  // 🏢 模式 A: 左侧组织树点击选中具体公司时，能流图自适应下钻至该企业工厂与重点车间
  // =========================================================================
  if (isCompany) {
    if (compName.includes('沈变')) {
      return {
        unit,
        nodes: [
          { name: '沈变公司', depth: 0, itemStyle: { color: '#2f54eb' } },
          { name: '沈变本部', depth: 1, itemStyle: { color: '#1d39c4' } },
          { name: '和新套管公司', depth: 1, itemStyle: { color: '#2f54eb' } },
          { name: '康嘉互感器', depth: 1, itemStyle: { color: '#597ef7' } },
          { name: '露娜智能制造', depth: 1, itemStyle: { color: '#85a5ff' } },
          { name: '智慧能源', depth: 1, itemStyle: { color: '#adc6ff' } },
          { name: '印能公司', depth: 1, itemStyle: { color: '#d6e4ff' } },
          { name: '超高压装配车间', depth: 2, itemStyle: { color: '#08979c' } },
          { name: '绝缘干燥窑炉工段', depth: 2, itemStyle: { color: '#13c2c2' } },
          { name: '高压套管卷制线', depth: 2, itemStyle: { color: '#722ed1' } },
          { name: '互感器蒸汽干燥罐', depth: 2, itemStyle: { color: '#9254de' } },
          { name: '智能配电柜装配线', depth: 2, itemStyle: { color: '#fa8c16' } },
          { name: '综合能源监控中心', depth: 2, itemStyle: { color: '#389e0d' } },
        ],
        links: [
          { source: '沈变公司', target: '沈变本部', value: 215.0 },
          { source: '沈变公司', target: '和新套管公司', value: 82.0 },
          { source: '沈变公司', target: '康嘉互感器', value: 46.0 },
          { source: '沈变公司', target: '露娜智能制造', value: 45.0 },
          { source: '沈变公司', target: '智慧能源', value: 18.0 },
          { source: '沈变公司', target: '印能公司', value: 12.0 },
          { source: '沈变本部', target: '超高压装配车间', value: 125.0 },
          { source: '沈变本部', target: '绝缘干燥窑炉工段', value: 90.0 },
          { source: '和新套管公司', target: '高压套管卷制线', value: 82.0 },
          { source: '康嘉互感器', target: '互感器蒸汽干燥罐', value: 46.0 },
          { source: '露娜智能制造', target: '智能配电柜装配线', value: 45.0 },
          { source: '智慧能源', target: '综合能源监控中心', value: 18.0 },
        ],
      }
    }

    if (compName.includes('衡变')) {
      return {
        unit,
        nodes: [
          { name: '衡变公司', depth: 0, itemStyle: { color: '#13c2c2' } },
          { name: '衡变本部', depth: 1, itemStyle: { color: '#08979c' } },
          { name: '南京电研', depth: 1, itemStyle: { color: '#13c2c2' } },
          { name: '云集电气', depth: 1, itemStyle: { color: '#36cfc9' } },
          { name: '云集高压开关', depth: 1, itemStyle: { color: '#5cdbd3' } },
          { name: '湖南电气', depth: 1, itemStyle: { color: '#87e8de' } },
          { name: '新疆自控', depth: 1, itemStyle: { color: '#006d75' } },
          { name: '特能建', depth: 1, itemStyle: { color: '#00474f' } },
          { name: '合容电气', depth: 1, itemStyle: { color: '#13c2c2' } },
          { name: '赛杰爱迪', depth: 1, itemStyle: { color: '#36cfc9' } },
          { name: '特大容量变压器车间', depth: 2, itemStyle: { color: '#1677ff' } },
          { name: 'SMT自动化贴片线', depth: 2, itemStyle: { color: '#722ed1' } },
          { name: '中低压开关柜总装线', depth: 2, itemStyle: { color: '#fa8c16' } },
          { name: 'GIS真空充气站', depth: 2, itemStyle: { color: '#52c41a' } },
          { name: '电容器无尘卷绕房', depth: 2, itemStyle: { color: '#eb2f96' } },
          { name: 'GIL铝合金焊管线', depth: 2, itemStyle: { color: '#d46b08' } },
        ],
        links: [
          { source: '衡变公司', target: '衡变本部', value: 165.0 },
          { source: '衡变公司', target: '南京电研', value: 38.0 },
          { source: '衡变公司', target: '云集电气', value: 35.0 },
          { source: '衡变公司', target: '云集高压开关', value: 32.0 },
          { source: '衡变公司', target: '湖南电气', value: 28.5 },
          { source: '衡变公司', target: '新疆自控', value: 18.0 },
          { source: '衡变公司', target: '特能建', value: 16.0 },
          { source: '衡变公司', target: '合容电气', value: 18.0 },
          { source: '衡变公司', target: '赛杰爱迪', value: 12.0 },
          { source: '衡变本部', target: '特大容量变压器车间', value: 165.0 },
          { source: '南京电研', target: 'SMT自动化贴片线', value: 38.0 },
          { source: '云集电气', target: '中低压开关柜总装线', value: 35.0 },
          { source: '云集高压开关', target: 'GIS真空充气站', value: 32.0 },
          { source: '合容电气', target: '电容器无尘卷绕房', value: 18.0 },
          { source: '赛杰爱迪', target: 'GIL铝合金焊管线', value: 12.0 },
        ],
      }
    }

    if (compName.includes('新变')) {
      return {
        unit,
        nodes: [
          { name: '新变厂', depth: 0, itemStyle: { color: '#722ed1' } },
          { name: '超高压公司', depth: 1, itemStyle: { color: '#531dab' } },
          { name: '天变公司', depth: 1, itemStyle: { color: '#722ed1' } },
          { name: '珠峰硅钢', depth: 1, itemStyle: { color: '#9254de' } },
          { name: '智能电气公司', depth: 1, itemStyle: { color: '#b37feb' } },
          { name: '京津冀公司', depth: 1, itemStyle: { color: '#d3adf7' } },
          { name: '银利电气', depth: 1, itemStyle: { color: '#efdbff' } },
          { name: '特高压变压器主线', depth: 2, itemStyle: { color: '#1677ff' } },
          { name: '干变浇注固化生产线', depth: 2, itemStyle: { color: '#13c2c2' } },
          { name: '硅钢智能高速纵剪线', depth: 2, itemStyle: { color: '#fa8c16' } },
          { name: '智能节能配变生产线', depth: 2, itemStyle: { color: '#389e0d' } },
          { name: '智能箱变总装车间', depth: 2, itemStyle: { color: '#eb2f96' } },
        ],
        links: [
          { source: '新变厂', target: '超高压公司', value: 145.0 },
          { source: '新变厂', target: '天变公司', value: 62.0 },
          { source: '新变厂', target: '珠峰硅钢', value: 45.0 },
          { source: '新变厂', target: '智能电气公司', value: 26.5 },
          { source: '新变厂', target: '京津冀公司', value: 18.0 },
          { source: '新变厂', target: '银利电气', value: 13.0 },
          { source: '超高压公司', target: '特高压变压器主线', value: 145.0 },
          { source: '天变公司', target: '干变浇注固化生产线', value: 62.0 },
          { source: '珠峰硅钢', target: '硅钢智能高速纵剪线', value: 45.0 },
          { source: '智能电气公司', target: '智能节能配变生产线', value: 26.5 },
          { source: '京津冀公司', target: '智能箱变总装车间', value: 18.0 },
        ],
      }
    }

    if (compName.includes('鲁缆')) {
      return {
        unit,
        nodes: [
          { name: '鲁缆公司', depth: 0, itemStyle: { color: '#fa8c16' } },
          { name: '鲁缆本部', depth: 1, itemStyle: { color: '#d46b08' } },
          { name: '曙光公司', depth: 1, itemStyle: { color: '#fa8c16' } },
          { name: '智缆公司', depth: 1, itemStyle: { color: '#ffa940' } },
          { name: '昭和公司', depth: 1, itemStyle: { color: '#ffd591' } },
          { name: '超高压VCV立塔交联线', depth: 2, itemStyle: { color: '#1677ff' } },
          { name: '中低压CCV悬链交联线', depth: 2, itemStyle: { color: '#722ed1' } },
          { name: '特种智能电缆挤出线', depth: 2, itemStyle: { color: '#13c2c2' } },
          { name: '高压电缆附件模压工段', depth: 2, itemStyle: { color: '#389e0d' } },
        ],
        links: [
          { source: '鲁缆公司', target: '鲁缆本部', value: 62.0 },
          { source: '鲁缆公司', target: '曙光公司', value: 23.5 },
          { source: '鲁缆公司', target: '智缆公司', value: 12.0 },
          { source: '鲁缆公司', target: '昭和公司', value: 8.0 },
          { source: '鲁缆本部', target: '超高压VCV立塔交联线', value: 62.0 },
          { source: '曙光公司', target: '中低压CCV悬链交联线', value: 23.5 },
          { source: '智缆公司', target: '特种智能电缆挤出线', value: 12.0 },
          { source: '昭和公司', target: '高压电缆附件模压工段', value: 8.0 },
        ],
      }
    }

    if (compName.includes('新缆')) {
      return {
        unit,
        nodes: [
          { name: '新缆厂', depth: 0, itemStyle: { color: '#52c41a' } },
          { name: '新缆厂本部', depth: 1, itemStyle: { color: '#389e0d' } },
          { name: '新疆电缆公司', depth: 1, itemStyle: { color: '#52c41a' } },
          { name: '35kV干法交联生产线', depth: 2, itemStyle: { color: '#1677ff' } },
          { name: '铝合金导线大拉机组', depth: 2, itemStyle: { color: '#13c2c2' } },
          { name: '变压吸附自制氮气站', depth: 2, itemStyle: { color: '#fa8c16' } },
        ],
        links: [
          { source: '新缆厂', target: '新缆厂本部', value: 42.0 },
          { source: '新缆厂', target: '新疆电缆公司', value: 16.0 },
          { source: '新缆厂本部', target: '35kV干法交联生产线', value: 26.0 },
          { source: '新缆厂本部', target: '铝合金导线大拉机组', value: 16.0 },
          { source: '新疆电缆公司', target: '变压吸附自制氮气站', value: 16.0 },
        ],
      }
    }

    if (compName.includes('德缆')) {
      return {
        unit,
        nodes: [
          { name: '德缆公司', depth: 0, itemStyle: { color: '#eb2f96' } },
          { name: '德缆公司本部', depth: 1, itemStyle: { color: '#c41d7f' } },
          { name: '交联电缆智能挤出线', depth: 2, itemStyle: { color: '#1677ff' } },
          { name: '环保橡套连续硫化线', depth: 2, itemStyle: { color: '#13c2c2' } },
          { name: '多头铜丝高速拉拔机', depth: 2, itemStyle: { color: '#fa8c16' } },
        ],
        links: [
          { source: '德缆公司', target: '德缆公司本部', value: 31.0 },
          { source: '德缆公司本部', target: '交联电缆智能挤出线', value: 16.0 },
          { source: '德缆公司本部', target: '环保橡套连续硫化线', value: 9.0 },
          { source: '德缆公司本部', target: '多头铜丝高速拉拔机', value: 6.0 },
        ],
      }
    }
  }

  // =========================================================================
  // 🌐 模式 B: 集团大盘全景模式，10 项指标 100% 细分到 28 家工厂，严格从上到下按公司排布
  // =========================================================================
  switch (metricId) {
    case 'gm-total-energy':
    default:
      // 1. 综合能源消费量 (基准重工能耗分布：沈变/衡变特高压重工主导，新变大容量基地紧随其后)
      return {
        unit: 'tce',
        nodes: GROUP_LEVEL_NODES,
        links: [
          { source: '电装集团', target: '沈变公司', value: 418.0 },
          { source: '电装集团', target: '衡变公司', value: 362.5 },
          { source: '电装集团', target: '新变厂', value: 309.5 },
          { source: '电装集团', target: '鲁缆公司', value: 105.5 },
          { source: '电装集团', target: '新缆厂', value: 58.0 },
          { source: '电装集团', target: '德缆公司', value: 31.0 },

          // 沈变系 6家 (合计 418.0)
          { source: '沈变公司', target: '沈变本部', value: 215.0 },
          { source: '沈变公司', target: '和新套管公司', value: 82.0 },
          { source: '沈变公司', target: '康嘉互感器', value: 46.0 },
          { source: '沈变公司', target: '露娜智能制造', value: 45.0 },
          { source: '沈变公司', target: '智慧能源', value: 18.0 },
          { source: '沈变公司', target: '印能公司', value: 12.0 },

          // 衡变系 9家 (合计 362.5)
          { source: '衡变公司', target: '衡变本部', value: 165.0 },
          { source: '衡变公司', target: '南京电研', value: 38.0 },
          { source: '衡变公司', target: '云集电气', value: 35.0 },
          { source: '衡变公司', target: '云集高压开关', value: 32.5 },
          { source: '衡变公司', target: '湖南电气', value: 28.0 },
          { source: '衡变公司', target: '新疆自控', value: 18.0 },
          { source: '衡变公司', target: '特能建', value: 16.0 },
          { source: '衡变公司', target: '合容电气', value: 18.0 },
          { source: '衡变公司', target: '赛杰爱迪', value: 12.0 },

          // 新变系 6家 (合计 309.5)
          { source: '新变厂', target: '超高压公司', value: 145.0 },
          { source: '新变厂', target: '天变公司', value: 62.0 },
          { source: '新变厂', target: '珠峰硅钢', value: 45.0 },
          { source: '新变厂', target: '智能电气公司', value: 26.5 },
          { source: '新变厂', target: '京津冀公司', value: 18.0 },
          { source: '新变厂', target: '银利电气', value: 13.0 },

          // 鲁缆系 4家 (合计 105.5)
          { source: '鲁缆公司', target: '鲁缆本部', value: 62.0 },
          { source: '鲁缆公司', target: '曙光公司', value: 23.5 },
          { source: '鲁缆公司', target: '智缆公司', value: 12.0 },
          { source: '鲁缆公司', target: '昭和公司', value: 8.0 },

          // 新缆系 2家 (合计 58.0)
          { source: '新缆厂', target: '新缆厂本部', value: 42.0 },
          { source: '新缆厂', target: '新疆电缆公司', value: 16.0 },

          // 德缆系 1家 (合计 31.0)
          { source: '德缆公司', target: '德缆公司本部', value: 31.0 },
        ],
      }

    case 'gm-total-carbon':
      // 2. 总碳排放量 (西北电网与山东电网火电碳排放因子显著高于华中清洁水电，新变厂、鲁缆碳排权重明显上升，衡变明显缩减)
      return {
        unit: 'tCO2',
        nodes: GROUP_LEVEL_NODES,
        links: [
          { source: '电装集团', target: '沈变公司', value: 965.0 },
          { source: '电装集团', target: '新变厂', value: 815.0 },
          { source: '电装集团', target: '衡变公司', value: 620.0 },
          { source: '电装集团', target: '鲁缆公司', value: 325.0 },
          { source: '电装集团', target: '新缆厂', value: 152.0 },
          { source: '电装集团', target: '德缆公司', value: 69.8 },

          // 沈变系 6家 (合计 965.0)
          { source: '沈变公司', target: '沈变本部', value: 495.0 },
          { source: '沈变公司', target: '和新套管公司', value: 190.0 },
          { source: '沈变公司', target: '康嘉互感器', value: 106.0 },
          { source: '沈变公司', target: '露娜智能制造', value: 104.0 },
          { source: '沈变公司', target: '智慧能源', value: 42.0 },
          { source: '沈变公司', target: '印能公司', value: 28.0 },

          // 衡变系 9家 (合计 620.0，华中绿电富集区，碳排明显收敛)
          { source: '衡变公司', target: '衡变本部', value: 282.0 },
          { source: '衡变公司', target: '南京电研', value: 65.0 },
          { source: '衡变公司', target: '云集电气', value: 60.0 },
          { source: '衡变公司', target: '云集高压开关', value: 55.0 },
          { source: '衡变公司', target: '湖南电气', value: 48.0 },
          { source: '衡变公司', target: '新疆自控', value: 31.0 },
          { source: '衡变公司', target: '特能建', value: 27.0 },
          { source: '衡变公司', target: '合容电气', value: 31.0 },
          { source: '衡变公司', target: '赛杰爱迪', value: 21.0 },

          // 新变系 6家 (合计 815.0，大容量特高压试验与西北电网特性)
          { source: '新变厂', target: '超高压公司', value: 382.0 },
          { source: '新变厂', target: '天变公司', value: 162.0 },
          { source: '新变厂', target: '珠峰硅钢', value: 120.0 },
          { source: '新变厂', target: '智能电气公司', value: 70.0 },
          { source: '新变厂', target: '京津冀公司', value: 47.0 },
          { source: '新变厂', target: '银利电气', value: 34.0 },

          // 鲁缆系 4家 (合计 325.0)
          { source: '鲁缆公司', target: '鲁缆本部', value: 191.0 },
          { source: '鲁缆公司', target: '曙光公司', value: 72.0 },
          { source: '鲁缆公司', target: '智缆公司', value: 38.0 },
          { source: '鲁缆公司', target: '昭和公司', value: 24.0 },

          // 新缆系 2家 (合计 152.0)
          { source: '新缆厂', target: '新缆厂本部', value: 110.0 },
          { source: '新缆厂', target: '新疆电缆公司', value: 42.0 },

          // 德缆系 1家 (合计 69.8)
          { source: '德缆公司', target: '德缆公司本部', value: 69.8 },
        ],
      }

    case 'gm-carbon-per-energy':
      // 3. 吨标煤综合能耗碳排放量 (碳排放强度加权能流，新变、鲁缆碳强度高，衡变低碳清洁优势显著)
      return {
        unit: 'tCO2/tce',
        nodes: GROUP_LEVEL_NODES,
        links: [
          { source: '电装集团', target: '新变厂', value: 350.0 },
          { source: '电装集团', target: '沈变公司', value: 300.0 },
          { source: '电装集团', target: '鲁缆公司', value: 180.0 },
          { source: '电装集团', target: '衡变公司', value: 150.0 },
          { source: '电装集团', target: '新缆厂', value: 80.0 },
          { source: '电装集团', target: '德缆公司', value: 40.0 },

          // 沈变系 6家 (合计 300.0)
          { source: '沈变公司', target: '沈变本部', value: 155.0 },
          { source: '沈变公司', target: '和新套管公司', value: 59.0 },
          { source: '沈变公司', target: '康嘉互感器', value: 33.0 },
          { source: '沈变公司', target: '露娜智能制造', value: 32.0 },
          { source: '沈变公司', target: '智慧能源', value: 13.0 },
          { source: '沈变公司', target: '印能公司', value: 8.0 },

          // 衡变系 9家 (合计 150.0)
          { source: '衡变公司', target: '衡变本部', value: 68.0 },
          { source: '衡变公司', target: '南京电研', value: 16.0 },
          { source: '衡变公司', target: '云集电气', value: 15.0 },
          { source: '衡变公司', target: '云集高压开关', value: 13.0 },
          { source: '衡变公司', target: '湖南电气', value: 12.0 },
          { source: '衡变公司', target: '新疆自控', value: 7.5 },
          { source: '衡变公司', target: '特能建', value: 6.5 },
          { source: '衡变公司', target: '合容电气', value: 7.5 },
          { source: '衡变公司', target: '赛杰爱迪', value: 4.5 },

          // 新变系 6家 (合计 350.0)
          { source: '新变厂', target: '超高压公司', value: 165.0 },
          { source: '新变厂', target: '天变公司', value: 70.0 },
          { source: '新变厂', target: '珠峰硅钢', value: 52.0 },
          { source: '新变厂', target: '智能电气公司', value: 30.0 },
          { source: '新变厂', target: '京津冀公司', value: 20.0 },
          { source: '新变厂', target: '银利电气', value: 13.0 },

          // 鲁缆系 4家 (合计 180.0)
          { source: '鲁缆公司', target: '鲁缆本部', value: 106.0 },
          { source: '鲁缆公司', target: '曙光公司', value: 40.0 },
          { source: '鲁缆公司', target: '智缆公司', value: 21.0 },
          { source: '鲁缆公司', target: '昭和公司', value: 13.0 },

          // 新缆系 2家 (合计 80.0)
          { source: '新缆厂', target: '新缆厂本部', value: 58.0 },
          { source: '新缆厂', target: '新疆电缆公司', value: 22.0 },

          // 德缆系 1家 (合计 40.0)
          { source: '德缆公司', target: '德缆公司本部', value: 40.0 },
        ],
      }

    case 'gm-green-energy-ratio':
      // 4. 非化石能源消费占比 (集团内部工厂均为光伏发电，无风电，规范为各园区光伏发电)
      return {
        unit: 'MWh',
        nodes: [
          { name: '电装集团', depth: 0, itemStyle: { color: '#1677ff' } },
          { name: '新变厂', depth: 1, itemStyle: { color: '#722ed1' } },
          { name: '沈变公司', depth: 1, itemStyle: { color: '#2f54eb' } },
          { name: '衡变公司', depth: 1, itemStyle: { color: '#13c2c2' } },
          { name: '新缆厂', depth: 1, itemStyle: { color: '#52c41a' } },
          { name: '鲁缆公司', depth: 1, itemStyle: { color: '#fa8c16' } },
          { name: '德缆公司', depth: 1, itemStyle: { color: '#eb2f96' } },
          { name: '新变厂-昌吉园区光伏发电', depth: 2, itemStyle: { color: '#531dab' } },
          { name: '沈变公司-沈阳园区光伏发电', depth: 2, itemStyle: { color: '#1d39c4' } },
          { name: '衡变公司-衡阳园区光伏发电', depth: 2, itemStyle: { color: '#08979c' } },
          { name: '新缆厂-米东园区光伏发电', depth: 2, itemStyle: { color: '#389e0d' } },
          { name: '鲁缆公司-新泰园区光伏发电', depth: 2, itemStyle: { color: '#d46b08' } },
          { name: '德缆公司-德阳园区光伏发电', depth: 2, itemStyle: { color: '#c41d7f' } },
        ],
        links: [
          { source: '电装集团', target: '新变厂', value: 520 },
          { source: '电装集团', target: '沈变公司', value: 310 },
          { source: '电装集团', target: '衡变公司', value: 280 },
          { source: '电装集团', target: '新缆厂', value: 190 },
          { source: '电装集团', target: '鲁缆公司', value: 120 },
          { source: '电装集团', target: '德缆公司', value: 62 },

          { source: '新变厂', target: '新变厂-昌吉园区光伏发电', value: 520 },
          { source: '沈变公司', target: '沈变公司-沈阳园区光伏发电', value: 310 },
          { source: '衡变公司', target: '衡变公司-衡阳园区光伏发电', value: 280 },
          { source: '新缆厂', target: '新缆厂-米东园区光伏发电', value: 190 },
          { source: '鲁缆公司', target: '鲁缆公司-新泰园区光伏发电', value: 120 },
          { source: '德缆公司', target: '德缆公司-德阳园区光伏发电', value: 62 },
        ],
      }

    case 'gm-phy-green-ratio':
      // 5. 非化石能源电力消费 (厂房屋顶光伏与物理直供光伏消纳，统一为各园区光伏发电)
      return {
        unit: 'MWh',
        nodes: [
          { name: '电装集团', depth: 0, itemStyle: { color: '#1677ff' } },
          { name: '衡变公司', depth: 1, itemStyle: { color: '#13c2c2' } },
          { name: '新变厂', depth: 1, itemStyle: { color: '#722ed1' } },
          { name: '鲁缆公司', depth: 1, itemStyle: { color: '#fa8c16' } },
          { name: '沈变公司', depth: 1, itemStyle: { color: '#2f54eb' } },
          { name: '新缆厂', depth: 1, itemStyle: { color: '#52c41a' } },
          { name: '德缆公司', depth: 1, itemStyle: { color: '#eb2f96' } },
          { name: '衡变公司-衡阳园区光伏发电', depth: 2, itemStyle: { color: '#08979c' } },
          { name: '新变厂-昌吉园区光伏发电', depth: 2, itemStyle: { color: '#531dab' } },
          { name: '鲁缆公司-新泰园区光伏发电', depth: 2, itemStyle: { color: '#d46b08' } },
          { name: '沈变公司-沈阳园区光伏发电', depth: 2, itemStyle: { color: '#1d39c4' } },
          { name: '新缆厂-米东园区光伏发电', depth: 2, itemStyle: { color: '#389e0d' } },
          { name: '德缆公司-德阳园区光伏发电', depth: 2, itemStyle: { color: '#c41d7f' } },
        ],
        links: [
          { source: '电装集团', target: '衡变公司', value: 380 },
          { source: '电装集团', target: '新变厂', value: 335 },
          { source: '电装集团', target: '鲁缆公司', value: 150 },
          { source: '电装集团', target: '沈变公司', value: 110 },
          { source: '电装集团', target: '新缆厂', value: 65 },
          { source: '电装集团', target: '德缆公司', value: 40 },

          { source: '衡变公司', target: '衡变公司-衡阳园区光伏发电', value: 380 },
          { source: '新变厂', target: '新变厂-昌吉园区光伏发电', value: 335 },
          { source: '鲁缆公司', target: '鲁缆公司-新泰园区光伏发电', value: 150 },
          { source: '沈变公司', target: '沈变公司-沈阳园区光伏发电', value: 110 },
          { source: '新缆厂', target: '新缆厂-米东园区光伏发电', value: 65 },
          { source: '德缆公司', target: '德缆公司-德阳园区光伏发电', value: 40 },
        ],
      }

    case 'gm-water-consumption':
      // 6. 水资源消耗总量 (线缆连铸连轧拉丝循环水池与挤出冷却水槽用水量极大，鲁缆、新缆、德缆占据半壁江山，呈现强烈工业异构！)
      return {
        unit: 't',
        nodes: GROUP_LEVEL_NODES,
        links: [
          { source: '电装集团', target: '鲁缆公司', value: 5260 },
          { source: '电装集团', target: '沈变公司', value: 3450 },
          { source: '电装集团', target: '新缆厂', value: 2680 },
          { source: '电装集团', target: '衡变公司', value: 2150 },
          { source: '电装集团', target: '德缆公司', value: 1120 },
          { source: '电装集团', target: '新变厂', value: 820 },

          // 沈变系 6家 (合计 3450)
          { source: '沈变公司', target: '沈变本部', value: 1780 },
          { source: '沈变公司', target: '露娜智能制造', value: 620 },
          { source: '沈变公司', target: '和新套管公司', value: 480 },
          { source: '沈变公司', target: '康嘉互感器', value: 310 },
          { source: '沈变公司', target: '智慧能源', value: 140 },
          { source: '沈变公司', target: '印能公司', value: 120 },

          // 衡变系 9家 (合计 2150)
          { source: '衡变公司', target: '衡变本部', value: 980 },
          { source: '衡变公司', target: '南京电研', value: 280 },
          { source: '衡变公司', target: '云集电气', value: 240 },
          { source: '衡变公司', target: '云集高压开关', value: 210 },
          { source: '衡变公司', target: '湖南电气', value: 180 },
          { source: '衡变公司', target: '合容电气', value: 110 },
          { source: '衡变公司', target: '新疆自控', value: 60 },
          { source: '衡变公司', target: '特能建', value: 50 },
          { source: '衡变公司', target: '赛杰爱迪', value: 40 },

          // 新变系 6家 (合计 820，干旱内陆节水闭式循环，用水量最少)
          { source: '新变厂', target: '超高压公司', value: 390 },
          { source: '新变厂', target: '天变公司', value: 165 },
          { source: '新变厂', target: '珠峰硅钢', value: 120 },
          { source: '新变厂', target: '智能电气公司', value: 75 },
          { source: '新变厂', target: '京津冀公司', value: 45 },
          { source: '新变厂', target: '银利电气', value: 25 },

          // 鲁缆系 4家 (合计 5260，连续挤出水槽冷却水主阵地，色带极度宽阔！)
          { source: '鲁缆公司', target: '鲁缆本部', value: 3080 },
          { source: '鲁缆公司', target: '曙光公司', value: 1180 },
          { source: '鲁缆公司', target: '智缆公司', value: 620 },
          { source: '鲁缆公司', target: '昭和公司', value: 380 },

          // 新缆系 2家 (合计 2680)
          { source: '新缆厂', target: '新缆厂本部', value: 1920 },
          { source: '新缆厂', target: '新疆电缆公司', value: 760 },

          // 德缆系 1家 (合计 1120)
          { source: '德缆公司', target: '德缆公司本部', value: 1120 },
        ],
      }

    case 'gm-unit-industrial-added-value':
      // 7. 单位工业增加值能耗 (特高压/超高压重型变压器附加值极高，增加值产出大，沈变、衡变经济创造力高度凸显)
      return {
        unit: 'tce/万元',
        nodes: GROUP_LEVEL_NODES,
        links: [
          { source: '电装集团', target: '沈变公司', value: 3450 },
          { source: '电装集团', target: '衡变公司', value: 2980 },
          { source: '电装集团', target: '新变厂', value: 1560 },
          { source: '电装集团', target: '鲁缆公司', value: 580 },
          { source: '电装集团', target: '新缆厂', value: 284 },
          { source: '电装集团', target: '德缆公司', value: 160 },

          // 沈变系 6家 (合计 3450)
          { source: '沈变公司', target: '沈变本部', value: 1820 },
          { source: '沈变公司', target: '和新套管公司', value: 680 },
          { source: '沈变公司', target: '露娜智能制造', value: 450 },
          { source: '沈变公司', target: '康嘉互感器', value: 280 },
          { source: '沈变公司', target: '智慧能源', value: 130 },
          { source: '沈变公司', target: '印能公司', value: 90 },

          // 衡变系 9家 (合计 2980)
          { source: '衡变公司', target: '衡变本部', value: 1360 },
          { source: '衡变公司', target: '南京电研', value: 380 },
          { source: '衡变公司', target: '云集电气', value: 320 },
          { source: '衡变公司', target: '云集高压开关', value: 290 },
          { source: '衡变公司', target: '湖南电气', value: 240 },
          { source: '衡变公司', target: '合容电气', value: 150 },
          { source: '衡变公司', target: '新疆自控', value: 100 },
          { source: '衡变公司', target: '特能建', value: 80 },
          { source: '衡变公司', target: '赛杰爱迪', value: 60 },

          // 新变系 6家 (合计 1560)
          { source: '新变厂', target: '超高压公司', value: 740 },
          { source: '新变厂', target: '天变公司', value: 310 },
          { source: '新变厂', target: '珠峰硅钢', value: 230 },
          { source: '新变厂', target: '智能电气公司', value: 140 },
          { source: '新变厂', target: '京津冀公司', value: 90 },
          { source: '新变厂', target: '银利电气', value: 50 },

          // 鲁缆系 4家 (合计 580)
          { source: '鲁缆公司', target: '鲁缆本部', value: 340 },
          { source: '鲁缆公司', target: '曙光公司', value: 130 },
          { source: '鲁缆公司', target: '智缆公司', value: 70 },
          { source: '鲁缆公司', target: '昭和公司', value: 40 },

          // 新缆系 2家 (合计 284)
          { source: '新缆厂', target: '新缆厂本部', value: 204 },
          { source: '新缆厂', target: '新疆电缆公司', value: 80 },

          // 德缆系 1家 (合计 160)
          { source: '德缆公司', target: '德缆公司本部', value: 160 },
        ],
      }

    case 'gm-unit-output':
      // 8. 万元工业产值综合能耗 (工业总产值流通，变压器高单价高产值，反映经济产出与能耗比例)
      return {
        unit: 'tce/万元',
        nodes: GROUP_LEVEL_NODES,
        links: [
          { source: '电装集团', target: '沈变公司', value: 10800 },
          { source: '电装集团', target: '衡变公司', value: 9200 },
          { source: '电装集团', target: '新变厂', value: 4900 },
          { source: '电装集团', target: '鲁缆公司', value: 2100 },
          { source: '电装集团', target: '新缆厂', value: 980 },
          { source: '电装集团', target: '德缆公司', value: 520 },

          // 沈变系 6家 (合计 10800)
          { source: '沈变公司', target: '沈变本部', value: 5600 },
          { source: '沈变公司', target: '和新套管公司', value: 2100 },
          { source: '沈变公司', target: '露娜智能制造', value: 1450 },
          { source: '沈变公司', target: '康嘉互感器', value: 920 },
          { source: '沈变公司', target: '智慧能源', value: 430 },
          { source: '沈变公司', target: '印能公司', value: 300 },

          // 衡变系 9家 (合计 9200)
          { source: '衡变公司', target: '衡变本部', value: 4200 },
          { source: '衡变公司', target: '南京电研', value: 1180 },
          { source: '衡变公司', target: '云集电气', value: 1020 },
          { source: '衡变公司', target: '云集高压开关', value: 910 },
          { source: '衡变公司', target: '湖南电气', value: 750 },
          { source: '衡变公司', target: '合容电气', value: 480 },
          { source: '衡变公司', target: '新疆自控', value: 310 },
          { source: '衡变公司', target: '特能建', value: 210 },
          { source: '衡变公司', target: '赛杰爱迪', value: 140 },

          // 新变系 6家 (合计 4900)
          { source: '新变厂', target: '超高压公司', value: 2340 },
          { source: '新变厂', target: '天变公司', value: 980 },
          { source: '新变厂', target: '珠峰硅钢', value: 720 },
          { source: '新变厂', target: '智能电气公司', value: 440 },
          { source: '新变厂', target: '京津冀公司', value: 260 },
          { source: '新变厂', target: '银利电气', value: 160 },

          // 鲁缆系 4家 (合计 2100)
          { source: '鲁缆公司', target: '鲁缆本部', value: 1230 },
          { source: '鲁缆公司', target: '曙光公司', value: 470 },
          { source: '鲁缆公司', target: '智缆公司', value: 250 },
          { source: '鲁缆公司', target: '昭和公司', value: 150 },

          // 新缆系 2家 (合计 980)
          { source: '新缆厂', target: '新缆厂本部', value: 705 },
          { source: '新缆厂', target: '新疆电缆公司', value: 275 },

          // 德缆系 1家 (合计 520)
          { source: '德缆公司', target: '德缆公司本部', value: 520 },
        ],
      }

    case 'gm-energy-saving-equipment-ratio':
      // 9. 节能装备装机功率与应用占比 (露娜智能制造、智能电气公司、智缆公司等标杆数字化智慧工厂拔得头筹)
      return {
        unit: 'kW',
        nodes: GROUP_LEVEL_NODES,
        links: [
          { source: '电装集团', target: '衡变公司', value: 11850 },
          { source: '电装集团', target: '沈变公司', value: 9600 },
          { source: '电装集团', target: '新变厂', value: 6800 },
          { source: '电装集团', target: '鲁缆公司', value: 2750 },
          { source: '电装集团', target: '新缆厂', value: 1150 },
          { source: '电装集团', target: '德缆公司', value: 700 },

          // 沈变系 6家 (合计 9600，露娜智能制造智能化最高)
          { source: '沈变公司', target: '露娜智能制造', value: 3850 },
          { source: '沈变公司', target: '沈变本部', value: 3420 },
          { source: '沈变公司', target: '和新套管公司', value: 1120 },
          { source: '沈变公司', target: '康嘉互感器', value: 650 },
          { source: '沈变公司', target: '智慧能源', value: 340 },
          { source: '沈变公司', target: '印能公司', value: 220 },

          // 衡变系 9家 (合计 11850，现代化智能装备总装机量第一)
          { source: '衡变公司', target: '衡变本部', value: 5420 },
          { source: '衡变公司', target: '合容电气', value: 1680 },
          { source: '衡变公司', target: '南京电研', value: 1450 },
          { source: '衡变公司', target: '云集电气', value: 1120 },
          { source: '衡变公司', target: '云集高压开关', value: 980 },
          { source: '衡变公司', target: '湖南电气', value: 560 },
          { source: '衡变公司', target: '新疆自控', value: 280 },
          { source: '衡变公司', target: '特能建', value: 210 },
          { source: '衡变公司', target: '赛杰爱迪', value: 150 },

          // 新变系 6家 (合计 6800)
          { source: '新变厂', target: '超高压公司', value: 3120 },
          { source: '新变厂', target: '智能电气公司', value: 1650 },
          { source: '新变厂', target: '天变公司', value: 980 },
          { source: '新变厂', target: '珠峰硅钢', value: 560 },
          { source: '新变厂', target: '京津冀公司', value: 310 },
          { source: '新变厂', target: '银利电气', value: 180 },

          // 鲁缆系 4家 (合计 2750，智缆公司数字化智能车间)
          { source: '鲁缆公司', target: '智缆公司', value: 1320 },
          { source: '鲁缆公司', target: '鲁缆本部', value: 980 },
          { source: '鲁缆公司', target: '曙光公司', value: 290 },
          { source: '鲁缆公司', target: '昭和公司', value: 160 },

          // 新缆系 2家 (合计 1150)
          { source: '新缆厂', target: '新缆厂本部', value: 820 },
          { source: '新缆厂', target: '新疆电缆公司', value: 330 },

          // 德缆系 1家 (合计 700)
          { source: '德缆公司', target: '德缆公司本部', value: 700 },
        ],
      }

    case 'gm-pcf-ratio':
      // 10. 开展产品碳足迹认证覆盖款数 (面向海外出口认证与CBAM合规，衡变、沈变外贸重装与德缆特种出口线缆认证品类最全)
      return {
        unit: '款',
        nodes: GROUP_LEVEL_NODES,
        links: [
          { source: '电装集团', target: '衡变公司', value: 16 },
          { source: '电装集团', target: '沈变公司', value: 14 },
          { source: '电装集团', target: '新变厂', value: 8 },
          { source: '电装集团', target: '德缆公司', value: 4 },
          { source: '电装集团', target: '鲁缆公司', value: 4 },
          { source: '电装集团', target: '新缆厂', value: 2 },

          // 沈变系 6家 (合计 14)
          { source: '沈变公司', target: '沈变本部', value: 6 },
          { source: '沈变公司', target: '和新套管公司', value: 3 },
          { source: '沈变公司', target: '露娜智能制造', value: 3 },
          { source: '沈变公司', target: '康嘉互感器', value: 2 },
          { source: '沈变公司', target: '智慧能源', value: 0 },
          { source: '沈变公司', target: '印能公司', value: 0 },

          // 衡变系 9家 (合计 16，外贸高端出海重器认证最多)
          { source: '衡变公司', target: '衡变本部', value: 7 },
          { source: '衡变公司', target: '云集高压开关', value: 3 },
          { source: '衡变公司', target: '南京电研', value: 2 },
          { source: '衡变公司', target: '湖南电气', value: 2 },
          { source: '衡变公司', target: '合容电气', value: 2 },
          { source: '衡变公司', target: '新疆自控', value: 0 },
          { source: '衡变公司', target: '特能建', value: 0 },
          { source: '衡变公司', target: '赛杰爱迪', value: 0 },

          // 新变系 6家 (合计 8)
          { source: '新变厂', target: '超高压公司', value: 4 },
          { source: '新变厂', target: '天变公司', value: 2 },
          { source: '新变厂', target: '智能电气公司', value: 2 },
          { source: '新变厂', target: '珠峰硅钢', value: 0 },
          { source: '新变厂', target: '京津冀公司', value: 0 },
          { source: '新变厂', target: '银利电气', value: 0 },

          // 鲁缆系 4家 (合计 4)
          { source: '鲁缆公司', target: '鲁缆本部', value: 2 },
          { source: '鲁缆公司', target: '智缆公司', value: 2 },
          { source: '鲁缆公司', target: '曙光公司', value: 0 },
          { source: '鲁缆公司', target: '昭和公司', value: 0 },

          // 新缆系 2家 (合计 2)
          { source: '新缆厂', target: '新缆厂本部', value: 2 },
          { source: '新缆厂', target: '新疆电缆公司', value: 0 },

          // 德缆系 1家 (合计 4，欧盟出口风电光伏特种电缆)
          { source: '德缆公司', target: '德缆公司本部', value: 4 },
        ],
      }
  }
}

// 🌟 能源介质列定义
export interface EnergyColumnDef {
  key: string
  label: string
  unit: string
  headerClass: string
  valClass: string
  calcVal: (idx: number, baseFactor: number) => string
}

// 🌟 根据指标计算公式（依据《“双中心”项目能碳管控指标体系V1.5.xlsx》）动态生成数据明细表格的分子、分母及构成列，与公式字段 100% 保持一致
export interface DynamicTableColumn {
  key: string
  label: string
  unit?: string
  headerClass: string
  valClass: string
  renderVal: (item: { period: string; value: number; yoy: string; mom: string }, idx: number, total: number) => string
}

export function getMetricDetailTableColumns(metric: MetricDetail): {
  columns: DynamicTableColumn[]
  resultHeader: string
} {
  // 1. 综合能源消费量 E = ∑(Ei × ki) -> 展示主要实物消耗构成与综合折标煤 E
  if (metric.id.includes('energy-sum') || metric.name === '综合能源消费量') {
    return {
      columns: [
        {
          key: 'elec',
          label: '消耗电量 Ei_电',
          unit: '万kWh',
          headerClass: 'text-blue-700',
          valClass: 'text-blue-700 font-bold',
          renderVal: (item, idx) => ((330.0 + idx * 1.8) * (item.value / 1284.5)).toFixed(1),
        },
        {
          key: 'steam',
          label: '消耗蒸汽 Ei_汽',
          unit: 't',
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx) => ((380 + idx * 1.5) * (item.value / 1284.5)).toFixed(0),
        },
        {
          key: 'gas',
          label: '消耗天然气 Ei_气',
          unit: '万m³',
          headerClass: 'text-amber-700',
          valClass: 'text-amber-700 font-bold',
          renderVal: (item, idx) => ((15.2 + idx * 0.1) * (item.value / 1284.5)).toFixed(1),
        },
      ],
      resultHeader: `综合能源消费量 E (${metric.unit})`,
    }
  }

  // 2. 总碳排放量 C = C_燃烧 + C_购入电 + C_购入热 -> 展示各范围排放构成与总碳排 C
  if (metric.id.includes('carbon-sum') || metric.name === '总碳排放量') {
    return {
      columns: [
        {
          key: 'c_elec',
          label: '购入电力碳排 (C购入电)',
          unit: 'tCO2',
          headerClass: 'text-blue-700',
          valClass: 'text-blue-700 font-bold',
          renderVal: (item, idx) => (item.value * 0.815).toFixed(1),
        },
        {
          key: 'c_burn',
          label: '化石燃料燃烧 (C燃烧)',
          unit: 'tCO2',
          headerClass: 'text-amber-700',
          valClass: 'text-amber-700 font-bold',
          renderVal: (item, idx) => (item.value * 0.125).toFixed(1),
        },
        {
          key: 'c_heat',
          label: '购入热力碳排 (C购入热)',
          unit: 'tCO2',
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx) => (item.value * 0.060).toFixed(1),
        },
      ],
      resultHeader: `二氧化碳排放量 C (${metric.unit})`,
    }
  }

  // 3. 产品碳足迹 -> 展示生命周期阶段碳排构成
  if (metric.name.includes('产品碳足迹') && !metric.name.includes('占比')) {
    return {
      columns: [
        {
          key: 'p_raw',
          label: '原材料获取阶段排放',
          unit: 'tCO2/台套',
          headerClass: 'text-slate-700',
          valClass: 'text-slate-700 font-bold',
          renderVal: (item) => (item.value * 0.72).toFixed(2),
        },
        {
          key: 'p_mfg',
          label: '生产制造阶段排放',
          unit: 'tCO2/台套',
          headerClass: 'text-blue-700',
          valClass: 'text-blue-700 font-bold',
          renderVal: (item) => (item.value * 0.23).toFixed(2),
        },
        {
          key: 'p_trans',
          label: '运输分销阶段排放',
          unit: 'tCO2/台套',
          headerClass: 'text-emerald-700',
          valClass: 'text-emerald-700 font-bold',
          renderVal: (item) => (item.value * 0.05).toFixed(2),
        },
      ],
      resultHeader: `产品碳足迹 (${metric.unit})`,
    }
  }

  // 4. 单位能耗碳排放 I = C / E
  if (metric.name.includes('单位能耗碳排放') || metric.formula.includes('I = C / E')) {
    return {
      columns: [
        {
          key: 'c_num',
          label: '二氧化碳排放量 C',
          unit: 'tCO2',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1260 + (idx / Math.max(total - 1, 1)) * 24.5
            const val = denVal * item.value
            return val.toFixed(1)
          },
        },
        {
          key: 'e_den',
          label: '综合能源消耗量 E',
          unit: 'tce',
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1260 + (idx / Math.max(total - 1, 1)) * 24.5
            return denVal.toFixed(1)
          },
        },
      ],
      resultHeader: `单位能耗碳排放 I (${metric.unit})`,
    }
  }

  // 5. 非化石能源消费占比 r = (R / E) * 100%
  if (metric.name.includes('非化石能源消费占比') || metric.formula.includes('r = (R / E)')) {
    return {
      columns: [
        {
          key: 'r_num',
          label: '非化石能源消费量 R',
          unit: 'tce',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1260 + (idx / Math.max(total - 1, 1)) * 24.5
            const val = (denVal * item.value) / 100
            return val.toFixed(1)
          },
        },
        {
          key: 'e_den',
          label: '综合能源消费量 E',
          unit: 'tce',
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1260 + (idx / Math.max(total - 1, 1)) * 24.5
            return denVal.toFixed(1)
          },
        },
      ],
      resultHeader: `非化石能源消费占比 r (${metric.unit})`,
    }
  }

  // 6. 非化石能源电力消费物理认定量占比 E_ui = (E_z / Q) * 100%
  if (metric.name.includes('物理认定量占比') || metric.formula.includes('E_ui')) {
    return {
      columns: [
        {
          key: 'ez_num',
          label: '物理可溯源非化石电量 Ez',
          unit: '万kWh',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 510 + (idx / Math.max(total - 1, 1)) * 22.2
            const val = (denVal * item.value) / 100
            return val.toFixed(1)
          },
        },
        {
          key: 'q_den',
          label: '工业总用电量 Q',
          unit: '万kWh',
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 510 + (idx / Math.max(total - 1, 1)) * 22.2
            return denVal.toFixed(1)
          },
        },
      ],
      resultHeader: `物理认定量占比 E_ui (${metric.unit})`,
    }
  }

  // 7. 单位工业增加值能耗 E_nva = E / G_nva
  if (metric.name.includes('单位工业增加值能耗') || metric.formula.includes('E_nva')) {
    return {
      columns: [
        {
          key: 'e_num',
          label: '综合能源消费量 E',
          unit: 'tce',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 8600 + (idx / Math.max(total - 1, 1)) * 258.6
            const val = denVal * item.value
            return val.toFixed(1)
          },
        },
        {
          key: 'gnva_den',
          label: '工业增加值 Gnva',
          unit: '万元',
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 8600 + (idx / Math.max(total - 1, 1)) * 258.6
            return Math.round(denVal).toLocaleString()
          },
        },
      ],
      resultHeader: `单位工业增加值能耗 E_nva (${metric.unit})`,
    }
  }

  // 8. 单位产值能耗 g = E / G
  if (metric.name.includes('单位产值能耗') || metric.formula.includes('g = E / G')) {
    return {
      columns: [
        {
          key: 'e_num',
          label: '综合能源消费量 E',
          unit: 'tce',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 27500 + (idx / Math.max(total - 1, 1)) * 1000
            const val = denVal * item.value
            return val.toFixed(1)
          },
        },
        {
          key: 'g_den',
          label: '企业工业总产值 G',
          unit: '万元',
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 27500 + (idx / Math.max(total - 1, 1)) * 1000
            return Math.round(denVal).toLocaleString()
          },
        },
      ],
      resultHeader: `单位产值能耗 g (${metric.unit})`,
    }
  }

  // 9. 节能装备应用占比 S = (R_es / E_ts) * 100%
  if (metric.name.includes('节能装备应用占比') || metric.formula.includes('S = (R_es / E_ts)')) {
    return {
      columns: [
        {
          key: 'res_num',
          label: '节能水平装备额定总功率 Res',
          unit: 'kW',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 55000 + (idx / Math.max(total - 1, 1)) * 3000
            const val = (denVal * item.value) / 100
            return Math.round(val).toLocaleString()
          },
        },
        {
          key: 'ets_den',
          label: '纳入统计装备额定总功率 Ets',
          unit: 'kW',
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 55000 + (idx / Math.max(total - 1, 1)) * 3000
            return Math.round(denVal).toLocaleString()
          },
        },
      ],
      resultHeader: `节能装备应用占比 S (${metric.unit})`,
    }
  }

  // 10. 开展产品碳足迹分析占比 R_cf = (N_cf / N) * 100%
  if (metric.name.includes('开展产品碳足迹分析占比') || metric.formula.includes('R_cf')) {
    return {
      columns: [
        {
          key: 'ncf_num',
          label: '开展碳足迹分析类别数 Ncf',
          unit: '个',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item) => Math.round((8 * item.value) / 100).toString(),
        },
        {
          key: 'n_den',
          label: '主要产品类别总数 N',
          unit: '个',
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: () => '8',
        },
      ],
      resultHeader: `开展分析占比 R_cf (${metric.unit})`,
    }
  }

  // 11. 【产品管控】单位产品综合能耗 e = E / M 或 g = E / M
  if (metric.name.includes('单位产品能耗') || metric.name.includes('单位产量能耗')) {
    return {
      columns: [
        {
          key: 'e_num',
          label: '综合能源消费量 E',
          unit: 'tce',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1500 + (idx / Math.max(total - 1, 1)) * 77.2
            const val = denVal * item.value
            return val.toFixed(1)
          },
        },
        {
          key: 'm_den',
          label: '产品产量 M',
          unit: metric.unit.replace('tce/', ''),
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1500 + (idx / Math.max(total - 1, 1)) * 77.2
            return denVal.toFixed(1)
          },
        },
      ],
      resultHeader: `单位产品能耗 e (${metric.unit})`,
    }
  }

  // 12. 【产品管控】单位产品电耗 q_电 = Q_电 / M 或 e_elec = E_elec / M
  if (metric.name.includes('单位产品电耗') || metric.name.includes('单位产量电耗') || metric.name.includes('吨铜电耗') || metric.name.includes('吨铝电耗') || metric.name.includes('交联电耗')) {
    return {
      columns: [
        {
          key: 'q_num',
          label: '电能源消费量 Q_电',
          unit: metric.unit.startsWith('kWh') ? 'kWh' : '万kWh',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1500 + (idx / Math.max(total - 1, 1)) * 77.2
            const val = denVal * item.value
            return val >= 10000 ? Math.round(val).toLocaleString() : val.toFixed(1)
          },
        },
        {
          key: 'm_den',
          label: '产品产量 M',
          unit: metric.unit.replace(/.*?\//, ''),
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1500 + (idx / Math.max(total - 1, 1)) * 77.2
            return denVal >= 10000 ? Math.round(denVal).toLocaleString() : denVal.toFixed(1)
          },
        },
      ],
      resultHeader: `单位产品电耗 q_电 (${metric.unit})`,
    }
  }

  // 13. 【产品管控】单位产品蒸汽耗 q_蒸汽 = Q_蒸汽 / M 或 e_steam = E_steam / M
  if (metric.name.includes('单位产品蒸汽') || metric.name.includes('单位产量蒸汽')) {
    return {
      columns: [
        {
          key: 'q_steam',
          label: '蒸汽能源消费量 Q_蒸汽',
          unit: metric.unit.startsWith('GJ') ? 'GJ' : 't',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1500 + (idx / Math.max(total - 1, 1)) * 77.2
            const val = denVal * item.value
            return val >= 10000 ? Math.round(val).toLocaleString() : val.toFixed(1)
          },
        },
        {
          key: 'm_den',
          label: '产品产量 M',
          unit: metric.unit.replace(/.*?\//, ''),
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1500 + (idx / Math.max(total - 1, 1)) * 77.2
            return denVal >= 10000 ? Math.round(denVal).toLocaleString() : denVal.toFixed(1)
          },
        },
      ],
      resultHeader: `单位产品蒸汽耗 q_蒸汽 (${metric.unit})`,
    }
  }

  // 14. 【产品管控】单位产品天然气耗 q_气 = Q_气 / M 或 e_gas = E_gas / M
  if (metric.name.includes('单位产品天然气') || metric.name.includes('单位产量天然气')) {
    return {
      columns: [
        {
          key: 'q_gas',
          label: '天然气能源消费量 Q_天然气',
          unit: 'm³',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1500 + (idx / Math.max(total - 1, 1)) * 77.2
            const val = denVal * item.value
            return val >= 10000 ? Math.round(val).toLocaleString() : val.toFixed(1)
          },
        },
        {
          key: 'm_den',
          label: '产品产量 M',
          unit: metric.unit.replace(/.*?\//, ''),
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1500 + (idx / Math.max(total - 1, 1)) * 77.2
            return denVal >= 10000 ? Math.round(denVal).toLocaleString() : denVal.toFixed(1)
          },
        },
      ],
      resultHeader: `单位产品天然气耗 q_天然气 (${metric.unit})`,
    }
  }

  // 15. 【产品管控】单位产品水耗 q_水 = Q_水 / M 或 e_water = W_total / M
  if (metric.name.includes('单位产品水耗') || metric.name.includes('单位产量水耗') || metric.name.includes('水资源消耗')) {
    return {
      columns: [
        {
          key: 'q_water',
          label: '水能源消费量 Q_水',
          unit: 't',
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1500 + (idx / Math.max(total - 1, 1)) * 77.2
            const val = denVal * item.value
            return val >= 10000 ? Math.round(val).toLocaleString() : val.toFixed(1)
          },
        },
        {
          key: 'm_den',
          label: '产品产量 M',
          unit: metric.unit.replace(/.*?\//, ''),
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 1500 + (idx / Math.max(total - 1, 1)) * 77.2
            return denVal >= 10000 ? Math.round(denVal).toLocaleString() : denVal.toFixed(1)
          },
        },
      ],
      resultHeader: `单位产品水耗 q_水 (${metric.unit})`,
    }
  }

  // 16. 【工序指标】单位产值单耗 (如 变压器干燥/固化/试验单位产值能耗/电耗/蒸汽)
  if (metric.category === 'process' && metric.unit.includes('万元')) {
    const isElec = metric.name.includes('电耗')
    const isSteam = metric.name.includes('蒸汽')
    const energyLabel = isElec ? '工序电量 Q' : isSteam ? '工序蒸汽量 Q' : '工序综合能耗 E'
    const energyUnit = isElec ? 'kWh' : isSteam ? 't' : 'tce'
    return {
      columns: [
        {
          key: 'p_energy',
          label: energyLabel,
          unit: energyUnit,
          headerClass: 'text-[#1677ff]',
          valClass: 'text-[#1677ff] font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 14000 + (idx / Math.max(total - 1, 1)) * 824
            const val = denVal * item.value
            return val >= 10000 ? Math.round(val).toLocaleString() : val.toFixed(1)
          },
        },
        {
          key: 'p_value',
          label: '工序产值 G',
          unit: '万元',
          headerClass: 'text-purple-700',
          valClass: 'text-purple-700 font-bold',
          renderVal: (item, idx, total) => {
            const denVal = 14000 + (idx / Math.max(total - 1, 1)) * 824
            return Math.round(denVal).toLocaleString()
          },
        },
      ],
      resultHeader: `${metric.name} (${metric.unit})`,
    }
  }

  // 17. 通用解析回退
  const parseValAndUnit = (rawStr: string) => {
    if (!rawStr) return { num: 1000, unit: '' }
    const cleaned = rawStr.replace(/,/g, '').trim()
    const match = cleaned.match(/^([\d.]+)\s*(.*)$/)
    if (match) {
      return { num: parseFloat(match[1]) || 1000, unit: match[2] || '' }
    }
    return { num: 1000, unit: '' }
  }

  const numInfo = parseValAndUnit(metric.numeratorVal)
  const denInfo = parseValAndUnit(metric.denominatorVal)

  const cleanName = (name: string) => {
    return name
      .replace(/全集团/g, '')
      .replace(/各直属单位/g, '')
      .replace(/各车间工段/g, '')
      .replace(/各介质实物消耗折标煤之和/g, '综合能耗')
      .replace(/\(.*?\)/g, '')
      .trim()
  }

  const numLabel = cleanName(metric.numeratorName) || '分子数据'
  const denLabel = cleanName(metric.denominatorName) || '分母数据'

  return {
    columns: [
      {
        key: 'numerator',
        label: numLabel,
        unit: numInfo.unit || undefined,
        headerClass: 'text-[#1677ff]',
        valClass: 'text-[#1677ff] font-bold',
        renderVal: (item, idx, total) => {
          const timeFactor = 0.94 + (idx / Math.max(total - 1, 1)) * 0.06
          let val = numInfo.num * timeFactor
          if (metric.unit === '%' || metric.unit === 'tCO2/tce' || metric.unit.includes('万元') || metric.unit.includes('产品单位') || metric.unit.includes('万kVA') || metric.unit.includes('km*mm')) {
            const denVal = denInfo.num * (0.96 + (idx / Math.max(total - 1, 1)) * 0.04)
            if (metric.unit === '%') {
              val = (denVal * item.value) / 100
            } else {
              val = denVal * item.value
            }
          }
          return val >= 10000 ? Math.round(val).toLocaleString() : val >= 100 ? val.toFixed(1) : val.toFixed(2)
        },
      },
      {
        key: 'denominator',
        label: denLabel,
        unit: denInfo.unit || undefined,
        headerClass: 'text-purple-700',
        valClass: 'text-purple-700 font-bold',
        renderVal: (item, idx, total) => {
          const timeFactor = 0.96 + (idx / Math.max(total - 1, 1)) * 0.04
          const val = denInfo.num * timeFactor
          return val >= 10000 ? Math.round(val).toLocaleString() : val >= 100 ? val.toFixed(1) : val.toFixed(2)
        },
      },
    ],
    resultHeader: `${metric.name} (${metric.unit})`,
  }
}

export const ENERGY_COLUMN_DEFINITIONS: Record<string, EnergyColumnDef> = {
  '电力': {
    key: 'elec',
    label: '⚡ 用电量',
    unit: '万kWh',
    headerClass: 'text-blue-700',
    valClass: 'text-blue-700 font-bold',
    calcVal: (idx, bf) => ((324.6 + idx * 2.3) * bf).toFixed(1),
  },
  '蒸汽': {
    key: 'steam',
    label: '💨 蒸汽量',
    unit: 't',
    headerClass: 'text-purple-700',
    valClass: 'text-purple-700 font-bold',
    calcVal: (idx, bf) => ((362 + idx * 2.5) * bf).toFixed(0),
  },
  '氮气': {
    key: 'nitrogen',
    label: '🫧 氮气量',
    unit: '万m³',
    headerClass: 'text-teal-700',
    valClass: 'text-teal-700 font-bold',
    calcVal: (idx, bf) => ((12.8 + idx * 0.15) * bf).toFixed(2),
  },
  '天然气': {
    key: 'gas',
    label: '🔥 用气量',
    unit: '万m³',
    headerClass: 'text-amber-700',
    valClass: 'text-amber-700 font-bold',
    calcVal: (idx, bf) => ((16.7 + idx * 0.12) * bf).toFixed(1),
  },
  '水': {
    key: 'water',
    label: '💧 用水量',
    unit: '万t',
    headerClass: 'text-cyan-700',
    valClass: 'text-cyan-700 font-bold',
    calcVal: (idx, bf) => ((4.06 + idx * 0.03) * bf).toFixed(2),
  },
}

// 🌟 生产单位（1级、2级、3级）对应主要产品、关键工序及主要消耗能源映射表 (严格100%依据《生产单位与涉及关键工序对应表(1).et》)
export const UNIT_PRODUCT_PROCESS_MAPPING: Record<string, { products: string[]; processes: string[]; energies: string[] }> = {
  // 0. 集团根节点
  '电装集团': {
    products: [
      '变压器-高压',
      '变压器-中低压-干变',
      '变压器-中低压-油变',
      '变压器-铁芯',
      '线缆-中低压',
      '线缆-高压',
      '线缆-特种电缆',
      '套管',
      '互感器',
      '中低压开关柜',
      'GIS',
      '干式电抗器',
      '电容器',
      'GIL',
    ],
    processes: [],
    energies: ['电力', '蒸汽'],
  },
  '特变电工集团': {
    products: [
      '变压器-高压',
      '变压器-中低压-干变',
      '变压器-中低压-油变',
      '变压器-铁芯',
      '线缆-中低压',
      '线缆-高压',
      '线缆-特种电缆',
      '套管',
      '互感器',
      '中低压开关柜',
      'GIS',
      '干式电抗器',
      '电容器',
      'GIL',
    ],
    processes: [],
    energies: ['电力', '蒸汽'],
  },

  // 1. 沈变公司
  '沈变公司': {
    products: ['变压器-高压', '套管', '互感器'],
    processes: ['①变压器-高压-干燥', '②变压器-试验', '①套管-干燥', '①互感器-干燥'],
    energies: ['电力', '蒸汽'],
  },
  '沈变本部': {
    products: ['变压器-高压'],
    processes: ['①变压器-高压-干燥', '②变压器-试验'],
    energies: ['电力', '蒸汽'],
  },
  '和新套管公司': {
    products: ['套管'],
    processes: ['①套管-干燥'],
    energies: ['电力'],
  },
  '康嘉互感器': {
    products: ['互感器'],
    processes: ['①互感器-干燥', '②变压器-试验'],
    energies: ['电力', '蒸汽'],
  },
  '智慧能源': {
    products: [],
    processes: [],
    energies: ['电力'],
  },
  '印能公司': {
    products: [],
    processes: [],
    energies: ['电力'],
  },
  '露娜公司 (特变电工露娜智能)': {
    products: [],
    processes: [],
    energies: ['电力'],
  },
  '特变电工露娜智能': {
    products: [],
    processes: [],
    energies: ['电力'],
  },
  '露娜智能制造': {
    products: [],
    processes: [],
    energies: ['电力'],
  },

  // 2. 衡变公司
  '衡变公司': {
    products: ['变压器-高压', '中低压开关柜', 'GIS', '干式电抗器', '电容器', 'GIL'],
    processes: [
      '①变压器-高压-干燥',
      '②变压器-试验',
      '①中低压开关柜-钣金加工',
      '②中低压开关柜-钣金喷涂',
      '①GIS-抽真空',
      '②GIS-绝缘件干燥',
      '③GIS-工频耐压试验',
      '④GIS-空调恒温除湿',
      '①干式电抗器-固化',
      '②干式电抗器-试验',
      '①电容器-芯子卷绕',
      '②电容器-真空浸渍',
      '③电容器-喷漆',
      '④电容器-试验',
      '①GIL-螺旋焊管生产',
      '②GIL-绝缘子生产',
      '③GIL-测试',
    ],
    energies: ['电力', '蒸汽'],
  },
  '衡变本部': {
    products: ['变压器-高压'],
    processes: ['①变压器-高压-干燥', '②变压器-试验'],
    energies: ['电力', '蒸汽'],
  },
  '南京电研': {
    products: [],
    processes: [],
    energies: ['电力'],
  },
  '云集电气': {
    products: ['中低压开关柜'],
    processes: ['①中低压开关柜-钣金加工', '②中低压开关柜-钣金喷涂'],
    energies: ['电力'],
  },
  '湖南电气': {
    products: ['变压器-高压'],
    processes: ['①变压器-高压-干燥', '②变压器-试验'],
    energies: ['电力', '蒸汽'],
  },
  '云集高压开关': {
    products: ['GIS'],
    processes: ['①GIS-抽真空', '②GIS-绝缘件干燥', '③GIS-工频耐压试验', '④GIS-空调恒温除湿'],
    energies: ['电力'],
  },
  '新疆自控': {
    products: ['中低压开关柜'],
    processes: ['①中低压开关柜-钣金加工', '②中低压开关柜-钣金喷涂'],
    energies: ['电力'],
  },
  '上开': {
    products: [],
    processes: [],
    energies: ['电力'],
  },
  '柯贝尔': {
    products: [],
    processes: [],
    energies: ['电力'],
  },
  '特能建': {
    products: ['变压器-高压'],
    processes: ['①变压器-高压-干燥', '②变压器-试验'],
    energies: ['电力', '蒸汽'],
  },
  '合容电气股份': {
    products: ['干式电抗器'],
    processes: ['①干式电抗器-固化', '②干式电抗器-试验'],
    energies: ['电力'],
  },
  '合容电气': {
    products: ['干式电抗器'],
    processes: ['①干式电抗器-固化', '②干式电抗器-试验'],
    energies: ['电力'],
  },
  '合容电力设备': {
    products: ['电容器'],
    processes: ['①电容器-芯子卷绕', '②电容器-真空浸渍', '③电容器-喷漆', '④电容器-试验'],
    energies: ['电力'],
  },
  '赛杰爱迪': {
    products: ['GIL'],
    processes: ['①GIL-螺旋焊管生产', '②GIL-绝缘子生产', '③GIL-测试'],
    energies: ['电力'],
  },

  // 3. 新变厂
  '新变厂': {
    products: ['变压器-高压', '变压器-中低压-干变', '变压器-中低压-油变', '变压器-铁芯'],
    processes: [
      '①变压器-高压-干燥',
      '②变压器-试验',
      '①变压器-中低压-干变-固化',
      '①变压器-中低压-油变-干燥',
      '①非晶合金铁心-退火',
      '②硅钢铁心-纵剪',
      '③硅钢铁心-中型叠装',
      '④硅钢铁心-大型叠装',
    ],
    energies: ['电力', '蒸汽'],
  },
  '超高压公司': {
    products: ['变压器-高压'],
    processes: ['①变压器-高压-干燥', '②变压器-试验'],
    energies: ['电力', '蒸汽'],
  },
  '天变公司': {
    products: ['变压器-中低压-干变'],
    processes: ['①变压器-中低压-干变-固化', '②变压器-试验'],
    energies: ['电力', '蒸汽'],
  },
  '智能电气公司': {
    products: ['变压器-中低压-干变'],
    processes: ['①变压器-中低压-干变-固化', '②变压器-试验'],
    energies: ['电力', '蒸汽'],
  },
  '京津冀公司': {
    products: ['变压器-中低压-油变'],
    processes: ['①变压器-中低压-油变-干燥', '②变压器-试验'],
    energies: ['电力', '蒸汽'],
  },
  '珠峰硅钢': {
    products: ['变压器-铁芯'],
    processes: ['①非晶合金铁心-退火', '②硅钢铁心-纵剪', '③硅钢铁心-中型叠装', '④硅钢铁心-大型叠装'],
    energies: ['电力'],
  },
  '银利电气': {
    products: [],
    processes: [],
    energies: ['电力'],
  },

  // 4. 鲁缆公司
  '鲁缆公司': {
    products: ['线缆-中低压', '线缆-高压', '线缆-特种电缆'],
    processes: ['①线缆-拉丝', '②线缆-中低压-交联（干法）', '③线缆-高压-交联（干法）'],
    energies: ['电力'],
  },
  '鲁缆本部': {
    products: ['线缆-中低压', '线缆-高压'],
    processes: ['①线缆-拉丝', '②线缆-中低压-交联（干法）', '③线缆-高压-交联（干法）'],
    energies: ['电力'],
  },
  '智缆公司': {
    products: [],
    processes: [],
    energies: ['电力'],
  },
  '昭和公司': {
    products: [],
    processes: [],
    energies: ['电力'],
  },
  '曙光公司': {
    products: ['线缆-特种电缆'],
    processes: [],
    energies: ['电力'],
  },

  // 5. 新缆厂
  '新缆厂': {
    products: ['线缆-中低压'],
    processes: ['①线缆-拉丝', '②线缆-中低压-交联（干法）'],
    energies: ['电力', '氮气'],
  },
  '特变电工新疆电缆有限公司': {
    products: ['线缆-中低压'],
    processes: ['①线缆-拉丝', '②线缆-中低压-交联（干法）'],
    energies: ['电力', '氮气'],
  },
  '特变电工新疆线缆厂': {
    products: ['线缆-中低压'],
    processes: ['①线缆-拉丝', '②线缆-中低压-交联（干法）'],
    energies: ['电力', '氮气'],
  },
  '新缆厂本部': {
    products: ['线缆-中低压'],
    processes: ['①线缆-拉丝', '②线缆-中低压-交联（干法）'],
    energies: ['电力', '氮气'],
  },

  // 6. 德缆公司
  '德缆公司': {
    products: ['线缆-中低压'],
    processes: ['①线缆-拉丝', '②线缆-中低压-交联（干法）'],
    energies: ['电力'],
  },
  '特变电工（德阳）电缆股份有限公司': {
    products: ['线缆-中低压'],
    processes: ['①线缆-拉丝', '②线缆-中低压-交联（干法）'],
    energies: ['电力'],
  },
  '德缆公司本部': {
    products: ['线缆-中低压'],
    processes: ['①线缆-拉丝', '②线缆-中低压-交联（干法）'],
    energies: ['电力'],
  },
}

// 🌟 产品与关键制造工序对标映射表 (依据《生产单位产品及关键工序对应表》)
export const PRODUCT_PROCESS_KEYWORD_MAP: Record<string, string[]> = {
  '变压器-高压': ['高压-干燥', '高压干燥', '变压器-试验', '试验大厅', '特高压', '超高压'],
  '变压器-中低压-干变': ['干变-固化', '干变固化', '变压器-试验', '试验大厅', '干变'],
  '变压器-中低压-油变': ['油变-干燥', '油变干燥', '变压器-试验', '试验大厅', '油变'],
  '变压器-铁芯': ['非晶', '退火', '硅钢', '纵剪', '中型叠装', '大型叠装', '铁心', '铁芯'],
  '套管': ['套管-干燥', '套管'],
  '互感器': ['互感器-干燥', '互感器-试验', '互感器'],
  '中低压开关柜': ['开关柜-钣金加工', '开关柜-钣金喷涂', '开关柜-组装', '开关柜-试验', '开关柜', '钣金'],
  'GIS': ['GIS-抽真空', 'GIS-绝缘件干燥', 'GIS-工频耐压试验', 'GIS-空调恒温除湿', 'GIS-表面处理', 'GIS-零部件干燥', 'GIS-绝缘装配试验', 'GIS-整机绝缘试验', 'GIS'],
  '干式电抗器': ['干式电抗器-固化', '干式电抗器-试验', '干式电抗器', '电抗器-固化', '电抗器-试验'],
  '申抗器': ['电抗器-真空含浸', '电抗器-表面处理', '电抗器-组装', '电抗器-试验', '电抗器'],
  '电抗器': ['电抗器-真空含浸', '电抗器-表面处理', '电抗器-组装', '电抗器-试验', '电抗器'],
  '电容器': ['电容器-芯子卷绕', '电容器-真空浸渍', '电容器-喷漆', '电容器-试验', '电容器', '芯子卷绕', '真空浸渍'],
  'GIL': ['GIL-螺旋焊管生产', 'GIL-绝缘子生产', 'GIL-测试', 'GIL-绝缘件加工', 'GIL-连接', 'GIL'],
  '二次自动化': ['二次-SMT贴片', '二次-高温老化', '二次-波峰焊', '二次'],
  '线缆-中低压': ['线缆-拉丝', '线缆-中低压-交联', '铜拉丝', '铝拉丝', '中低压交联', '吨铜电耗', '吨铝电耗'],
  '线缆-高压': ['线缆-拉丝', '线缆-高压-交联', '铜拉丝', '铝拉丝', '高压交联', '立塔高压', '吨铜电耗', '吨铝电耗'],
  '线缆-特种电缆': ['线缆-拉丝', '线缆-特种电缆', '特种电缆', '铜拉丝', '铝拉丝', '吨铜电耗'],
}

// 🌟 产品专属指标基准库 (当切换不同产品标签时动态驱动 5 大单耗指标数值与单位)
export const PRODUCT_SPECIFIC_METRICS: Record<string, {
  unitSuffix: string
  energy: { val: string; yoy: string }
  elec: { val: string; yoy: string }
  steam: { val: string; yoy: string }
  gas: { val: string; yoy: string }
  water: { val: string; yoy: string }
}> = {
  '线缆-中低压': {
    unitSuffix: 'km*mm²',
    energy: { val: '0.317', yoy: '-6.2%' },
    elec: { val: '2,420.5', yoy: '-5.8%' },
    steam: { val: '3.85', yoy: '-4.5%' },
    gas: { val: '45.2', yoy: '-4.1%' },
    water: { val: '12.4', yoy: '-3.9%' },
  },
  '线缆-高压': {
    unitSuffix: 'km*mm²',
    energy: { val: '0.485', yoy: '-5.4%' },
    elec: { val: '3,680.0', yoy: '-5.1%' },
    steam: { val: '5.20', yoy: '-4.1%' },
    gas: { val: '62.8', yoy: '-3.8%' },
    water: { val: '18.5', yoy: '-3.5%' },
  },
  '线缆-特种电缆': {
    unitSuffix: 'km*mm²',
    energy: { val: '0.620', yoy: '-4.8%' },
    elec: { val: '4,850.0', yoy: '-4.2%' },
    steam: { val: '6.50', yoy: '-3.6%' },
    gas: { val: '78.0', yoy: '-3.2%' },
    water: { val: '22.0', yoy: '-3.0%' },
  },
  '变压器-高压': {
    unitSuffix: '万kVA',
    energy: { val: '0.328', yoy: '-5.8%' },
    elec: { val: '2,510.0', yoy: '-5.2%' },
    steam: { val: '3.92', yoy: '-4.8%' },
    gas: { val: '48.0', yoy: '-4.3%' },
    water: { val: '13.1', yoy: '-4.0%' },
  },
  '变压器-中低压-干变': {
    unitSuffix: '万kVA',
    energy: { val: '0.245', yoy: '-4.5%' },
    elec: { val: '1,880.0', yoy: '-4.1%' },
    steam: { val: '2.85', yoy: '-3.9%' },
    gas: { val: '35.0', yoy: '-3.5%' },
    water: { val: '9.8', yoy: '-3.2%' },
  },
  '变压器-中低压-油变': {
    unitSuffix: '万kVA',
    energy: { val: '0.280', yoy: '-4.9%' },
    elec: { val: '2,150.0', yoy: '-4.6%' },
    steam: { val: '3.30', yoy: '-4.2%' },
    gas: { val: '41.0', yoy: '-3.9%' },
    water: { val: '11.5', yoy: '-3.6%' },
  },
  '变压器-铁芯': {
    unitSuffix: 't',
    energy: { val: '0.115', yoy: '-3.8%' },
    elec: { val: '890.0', yoy: '-3.5%' },
    steam: { val: '0.00', yoy: '-0.0%' },
    gas: { val: '0.0', yoy: '-0.0%' },
    water: { val: '4.2', yoy: '-2.8%' },
  },
  '套管': {
    unitSuffix: '支',
    energy: { val: '0.180', yoy: '-4.2%' },
    elec: { val: '1,380.0', yoy: '-4.0%' },
    steam: { val: '0.00', yoy: '-0.0%' },
    gas: { val: '0.0', yoy: '-0.0%' },
    water: { val: '5.6', yoy: '-3.0%' },
  },
  '互感器': {
    unitSuffix: '台',
    energy: { val: '0.165', yoy: '-3.9%' },
    elec: { val: '1,260.0', yoy: '-3.7%' },
    steam: { val: '1.85', yoy: '-3.5%' },
    gas: { val: '22.0', yoy: '-3.1%' },
    water: { val: '6.8', yoy: '-2.9%' },
  },
  '中低压开关柜': {
    unitSuffix: '台',
    energy: { val: '0.095', yoy: '-4.1%' },
    elec: { val: '720.0', yoy: '-3.9%' },
    steam: { val: '0.00', yoy: '-0.0%' },
    gas: { val: '0.0', yoy: '-0.0%' },
    water: { val: '3.5', yoy: '-2.5%' },
  },
  'GIS': {
    unitSuffix: '间隔',
    energy: { val: '1.240', yoy: '-5.1%' },
    elec: { val: '9,520.0', yoy: '-4.8%' },
    steam: { val: '0.00', yoy: '-0.0%' },
    gas: { val: '0.0', yoy: '-0.0%' },
    water: { val: '28.0', yoy: '-3.8%' },
  },
  '干式电抗器': {
    unitSuffix: '台',
    energy: { val: '0.420', yoy: '-4.0%' },
    elec: { val: '3,200.0', yoy: '-3.8%' },
    steam: { val: '0.00', yoy: '-0.0%' },
    gas: { val: '0.0', yoy: '-0.0%' },
    water: { val: '14.5', yoy: '-3.1%' },
  },
  '电容器': {
    unitSuffix: 'kvar',
    energy: { val: '0.086', yoy: '-3.5%' },
    elec: { val: '660.0', yoy: '-3.2%' },
    steam: { val: '0.00', yoy: '-0.0%' },
    gas: { val: '0.0', yoy: '-0.0%' },
    water: { val: '2.8', yoy: '-2.4%' },
  },
  'GIL': {
    unitSuffix: '百米',
    energy: { val: '1.850', yoy: '-4.6%' },
    elec: { val: '14,200.0', yoy: '-4.4%' },
    steam: { val: '0.00', yoy: '-0.0%' },
    gas: { val: '0.0', yoy: '-0.0%' },
    water: { val: '42.0', yoy: '-3.5%' },
  },
}

export default function IndicatorControlPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'ent_root',
    name: '电装集团',
    fullName: '电装集团',
    level: 'group',
    badge: '全集团',
  })

  // 🌟 板块二【产品管控指标】独立选中的产品标签
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  // 🌟 板块三【关键制造工序能效对标指标】独立选中的产品标签 (二、三板块标签解耦，互不联动)
  const [selectedProcessProduct, setSelectedProcessProduct] = useState<string | null>(null)

  // 时间维度: 'month' | 'quarter' | 'year' (默认月度)
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  // 时间范围选择
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')
  
  // 🌟 点击卡片激活的 Mode B 详情指标 Mode B (Null 时为 Mode A 全景概览)
  const [activeViewMetric, setActiveViewMetric] = useState<IndicatorMetric | null>(null)
  
  // 🌟 集团层级选中的指标 ID (默认选中第 1 个: 综合能源消费量 gm-total-energy)
  const [selectedGroupMetricId, setSelectedGroupMetricId] = useState<string>('gm-total-energy')
  const activeGroupMetric = useMemo(() => {
    return (
      GROUP_OVERALL_TOP10_METRICS.find((m) => m.id === selectedGroupMetricId) ||
      GROUP_OVERALL_TOP10_METRICS[0]
    )
  }, [selectedGroupMetricId])

  // 🌟 板块二视图切换: 'sankey' (1/2/3级能流桑基图) | 'trend' (12个月趋势走势)
  const [section2ViewTab, setSection2ViewTab] = useState<'sankey' | 'trend'>('sankey')

  // 动态计算当前选中指标对应的 1/2/3 级能流桑基图数据
  const currentSankeyData = useMemo(() => {
    return getMetricSankeyData(selectedGroupMetricId, activeGroupMetric, selectedNode)
  }, [selectedGroupMetricId, activeGroupMetric, selectedNode])

  const [procSearchKey, setProcSearchKey] = useState('')

  // 🌟 根据当前选中的组织节点解析其所属的 2、3 级主要产品与关键工序 (严格匹配对应表，未登记的严禁随意填造，严格为空)
  const activeUnitInfo = useMemo(() => {
    const nodeName = selectedNode.name || ''
    // 精确匹配
    if (UNIT_PRODUCT_PROCESS_MAPPING[nodeName]) {
      return UNIT_PRODUCT_PROCESS_MAPPING[nodeName]
    }
    // 前缀或包含匹配 (仅对确定的企业名有效)
    for (const [key, val] of Object.entries(UNIT_PRODUCT_PROCESS_MAPPING)) {
      if (nodeName && (nodeName === key || (nodeName.length >= 3 && key.includes(nodeName)) || (key.length >= 3 && nodeName.includes(key)))) {
        return val
      }
    }
    // 表中未记录的单位一律为 null，允许为空，不瞎显示
    return null
  }, [selectedNode])

  // 🌟 当前在板块二【产品管控指标】中选中的产品 (若未手动选，默认取所属单位的第 1 个主要产品)
  const currentProduct = useMemo(() => {
    if (selectedProduct && activeUnitInfo?.products?.includes(selectedProduct)) {
      return selectedProduct
    }
    return activeUnitInfo?.products?.[0] || null
  }, [selectedProduct, activeUnitInfo])

  // 🌟 当前在板块三【关键制造工序能效对标指标】中选中的产品 (独立于板块二)
  const currentProcessProduct = useMemo(() => {
    if (selectedProcessProduct && activeUnitInfo?.products?.includes(selectedProcessProduct)) {
      return selectedProcessProduct
    }
    return activeUnitInfo?.products?.[0] || null
  }, [selectedProcessProduct, activeUnitInfo])

  // 🌟 根据选中的产品动态生成 5 大产品管控指标 (单位产品能耗、电耗、蒸汽耗、天然气耗、水耗)
  const currentProductControlMetrics = useMemo(() => {
    // 🌟 若当前单位没有登记主要产品（如智慧能源、印能公司、南京电研等），则返回空数组，不显示产品单耗
    if (!activeUnitInfo?.products || activeUnitInfo.products.length === 0) {
      return []
    }
    const prodKey = currentProduct || ''
    const spec = PRODUCT_SPECIFIC_METRICS[prodKey]
    const targetUnit = spec ? spec.unitSuffix : '万kVA'

    return [
      {
        id: 'pm-unit-energy',
        name: currentProduct ? `单位产品能耗 (${currentProduct})` : '单位产品能耗 (型号)',
        code: 'SEC-PROD-01',
        category: 'product' as const,
        categoryName: '二、产品管控指标',
        unit: spec ? `tce/${spec.unitSuffix}` : 'tce/万kVA',
        curVal: spec?.energy.val || '0.317',
        yoy: spec?.energy.yoy || '-6.2%',
        isYoyDown: true,
        formula: 'e = E / M',
        formulaDesc: `月度指标。e: 单位产品能耗，单位为 tce/${targetUnit}；E: 综合能源消耗量，单位 tce；M: 产成品产量，单位为产量单位，如 ${targetUnit}等。`,
        tipText: `考核统计期内【${currentProduct || '产品'}】每单位合格产成品的综合能源消耗量。`,
        trendHistory: [
          { period: '25-09', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.08).toFixed(3)) : 0.352, mom: '-0.8%', yoy: '-5.2%' },
          { period: '25-10', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.07).toFixed(3)) : 0.349, mom: '-0.9%', yoy: '-5.4%' },
          { period: '25-11', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.06).toFixed(3)) : 0.346, mom: '-0.9%', yoy: '-5.5%' },
          { period: '25-12', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.05).toFixed(3)) : 0.342, mom: '-1.2%', yoy: '-5.8%' },
          { period: '26-01', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.04).toFixed(3)) : 0.339, mom: '-0.9%', yoy: '-5.9%' },
          { period: '26-02', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.03).toFixed(3)) : 0.336, mom: '-0.9%', yoy: '-6.0%' },
          { period: '26-03', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.03).toFixed(3)) : 0.333, mom: '-0.9%', yoy: '-6.1%' },
          { period: '26-04', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.02).toFixed(3)) : 0.330, mom: '-0.9%', yoy: '-6.1%' },
          { period: '26-05', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.02).toFixed(3)) : 0.327, mom: '-0.9%', yoy: '-6.2%' },
          { period: '26-06', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.01).toFixed(3)) : 0.324, mom: '-0.9%', yoy: '-6.2%' },
          { period: '26-07', value: spec ? parseFloat((parseFloat(spec.energy.val) * 1.01).toFixed(3)) : 0.320, mom: '-1.2%', yoy: '-6.2%' },
          { period: '26-08', value: spec ? parseFloat(spec.energy.val) : 0.317, mom: '-0.9%', yoy: spec?.energy.yoy || '-6.2%' },
        ],
      },
      {
        id: 'pm-unit-electricity',
        name: currentProduct ? `单位产品电耗 (${currentProduct})` : '单位产品电耗',
        code: 'SEC-PROD-02',
        category: 'product' as const,
        categoryName: '二、产品管控指标',
        unit: spec ? `kWh/${spec.unitSuffix}` : 'kWh/万kVA',
        curVal: spec?.elec.val || '2,420.5',
        yoy: spec?.elec.yoy || '-5.8%',
        isYoyDown: true,
        formula: 'e_elec = E_elec / M',
        formulaDesc: `月度指标。e_elec: 单位产品电耗，单位为 kWh/${targetUnit}；E_elec: 耗电总量，单位 kWh；M: 产成品产量。`,
        tipText: `考核统计期内【${currentProduct || '产品'}】每单位产成品消耗的电力量。`,
        trendHistory: [
          { period: '25-09', value: 2680.0, mom: '-0.8%', yoy: '-4.8%' },
          { period: '25-10', value: 2650.0, mom: '-1.1%', yoy: '-5.0%' },
          { period: '25-11', value: 2620.0, mom: '-1.1%', yoy: '-5.1%' },
          { period: '25-12', value: 2580.0, mom: '-1.5%', yoy: '-5.3%' },
          { period: '26-01', value: 2550.0, mom: '-1.2%', yoy: '-5.4%' },
          { period: '26-02', value: 2520.0, mom: '-1.2%', yoy: '-5.5%' },
          { period: '26-03', value: 2490.0, mom: '-1.2%', yoy: '-5.6%' },
          { period: '26-04', value: 2470.0, mom: '-0.8%', yoy: '-5.6%' },
          { period: '26-05', value: 2450.0, mom: '-0.8%', yoy: '-5.7%' },
          { period: '26-06', value: 2440.0, mom: '-0.4%', yoy: '-5.7%' },
          { period: '26-07', value: 2430.0, mom: '-0.4%', yoy: '-5.8%' },
          { period: '26-08', value: spec ? parseFloat(spec.elec.val.replace(',', '')) : 2420.5, mom: '-0.4%', yoy: spec?.elec.yoy || '-5.8%' },
        ],
      },
      {
        id: 'pm-unit-steam',
        name: currentProduct ? `单位产品蒸汽耗 (${currentProduct})` : '单位产品蒸汽耗',
        code: 'SEC-PROD-03',
        category: 'product' as const,
        categoryName: '二、产品管控指标',
        unit: spec ? `GJ/${spec.unitSuffix}` : 'GJ/万kVA',
        curVal: spec?.steam.val || '3.85',
        yoy: spec?.steam.yoy || '-4.5%',
        isYoyDown: true,
        formula: 'e_steam = E_steam / M',
        formulaDesc: `月度指标。e_steam: 单位产品蒸汽耗，单位为 GJ/${targetUnit}；E_steam: 消耗蒸汽总量折算热量，单位 GJ；M: 产成品产量。`,
        tipText: `考核【${currentProduct || '产品'}】生产工序（如高压干燥、固化等）的蒸汽能效。`,
        trendHistory: [
          { period: '25-09', value: 4.25, mom: '-0.7%', yoy: '-3.8%' },
          { period: '25-10', value: 4.20, mom: '-1.2%', yoy: '-3.9%' },
          { period: '25-11', value: 4.15, mom: '-1.2%', yoy: '-4.0%' },
          { period: '25-12', value: 4.10, mom: '-1.2%', yoy: '-4.1%' },
          { period: '26-01', value: 4.05, mom: '-1.2%', yoy: '-4.2%' },
          { period: '26-02', value: 4.00, mom: '-1.2%', yoy: '-4.3%' },
          { period: '26-03', value: 3.96, mom: '-1.0%', yoy: '-4.3%' },
          { period: '26-04', value: 3.93, mom: '-0.8%', yoy: '-4.4%' },
          { period: '26-05', value: 3.90, mom: '-0.8%', yoy: '-4.4%' },
          { period: '26-06', value: 3.88, mom: '-0.5%', yoy: '-4.4%' },
          { period: '26-07', value: 3.86, mom: '-0.5%', yoy: '-4.5%' },
          { period: '26-08', value: spec ? parseFloat(spec.steam.val) : 3.85, mom: '-0.3%', yoy: spec?.steam.yoy || '-4.5%' },
        ],
      },
      {
        id: 'pm-unit-gas',
        name: currentProduct ? `单位产品天然气耗 (${currentProduct})` : '单位产品天然气耗',
        code: 'SEC-PROD-04',
        category: 'product' as const,
        categoryName: '二、产品管控指标',
        unit: spec ? `m³/${spec.unitSuffix}` : 'm³/万kVA',
        curVal: spec?.gas.val || '45.2',
        yoy: spec?.gas.yoy || '-4.1%',
        isYoyDown: true,
        formula: 'e_gas = E_gas / M',
        formulaDesc: `月度指标。e_gas: 单位产品天然气耗，单位为 m³/${targetUnit}；E_gas: 天然气总耗量，单位 m³；M: 产成品产量。`,
        tipText: `考核【${currentProduct || '产品'}】生产供热与工艺用气单耗。`,
        trendHistory: [
          { period: '25-09', value: 49.5, mom: '-0.8%', yoy: '-3.2%' },
          { period: '25-10', value: 49.0, mom: '-1.0%', yoy: '-3.4%' },
          { period: '25-11', value: 48.5, mom: '-1.0%', yoy: '-3.5%' },
          { period: '25-12', value: 47.8, mom: '-1.4%', yoy: '-3.6%' },
          { period: '26-01', value: 47.2, mom: '-1.3%', yoy: '-3.8%' },
          { period: '26-02', value: 46.8, mom: '-0.8%', yoy: '-3.8%' },
          { period: '26-03', value: 46.3, mom: '-1.1%', yoy: '-3.9%' },
          { period: '26-04', value: 45.9, mom: '-0.9%', yoy: '-4.0%' },
          { period: '26-05', value: 45.6, mom: '-0.7%', yoy: '-4.0%' },
          { period: '26-06', value: 45.4, mom: '-0.4%', yoy: '-4.1%' },
          { period: '26-07', value: 45.3, mom: '-0.2%', yoy: '-4.1%' },
          { period: '26-08', value: spec ? parseFloat(spec.gas.val) : 45.2, mom: '-0.2%', yoy: spec?.gas.yoy || '-4.1%' },
        ],
      },
      {
        id: 'pm-unit-water',
        name: currentProduct ? `单位产品水耗 (${currentProduct})` : '单位产品水耗',
        code: 'SEC-PROD-05',
        category: 'product' as const,
        categoryName: '二、产品管控指标',
        unit: spec ? `t/${spec.unitSuffix}` : 't/万kVA',
        curVal: spec?.water.val || '12.4',
        yoy: spec?.water.yoy || '-3.9%',
        isYoyDown: true,
        formula: 'e_water = W_total / M',
        formulaDesc: `月度指标。e_water: 单位产品取水量，单位为 t/${targetUnit}；W_total: 新鲜水消耗总量，单位 t；M: 产成品产量。`,
        tipText: `考核【${currentProduct || '产品'}】每单位产成品的工业新鲜水耗用水平。`,
        trendHistory: [
          { period: '25-09', value: 13.5, mom: '-0.7%', yoy: '-3.1%' },
          { period: '25-10', value: 13.4, mom: '-0.7%', yoy: '-3.2%' },
          { period: '25-11', value: 13.2, mom: '-1.5%', yoy: '-3.3%' },
          { period: '25-12', value: 13.0, mom: '-1.5%', yoy: '-3.5%' },
          { period: '26-01', value: 12.9, mom: '-0.8%', yoy: '-3.6%' },
          { period: '26-02', value: 12.8, mom: '-0.8%', yoy: '-3.6%' },
          { period: '26-03', value: 12.7, mom: '-0.8%', yoy: '-3.7%' },
          { period: '26-04', value: 12.6, mom: '-0.8%', yoy: '-3.8%' },
          { period: '26-05', value: 12.5, mom: '-0.8%', yoy: '-3.8%' },
          { period: '26-06', value: 12.5, mom: '0.0%', yoy: '-3.8%' },
          { period: '26-07', value: 12.4, mom: '-0.8%', yoy: '-3.9%' },
          { period: '26-08', value: spec ? parseFloat(spec.water.val) : 12.4, mom: '0.0%', yoy: spec?.water.yoy || '-3.9%' },
        ],
      },
    ]
  }, [currentProduct])

  // 判断当前选中节点层级
  const isGroupLevel = selectedNode.level === 'group' || selectedNode.id === 'ent_root'
  const isCompanyLevel = selectedNode.level === 'company'
  const isWorkshopLevel = selectedNode.level === 'workshop'

  // 🌟 根据当前查看的指标与所属单位的“工序主要消耗能源”动态计算数据明细中呈现的能源列
  const displayedEnergyColumns = useMemo(() => {
    if (!activeViewMetric) return []

    // 1. 若当前查看的是特定单一介质指标
    if (activeViewMetric.name.includes('电耗') || activeViewMetric.name.includes('用电')) {
      return ['电力']
    }
    if (activeViewMetric.name.includes('水耗') || activeViewMetric.name.includes('用水')) {
      return ['水']
    }
    if (activeViewMetric.name.includes('天然气') || activeViewMetric.name.includes('用气')) {
      return ['天然气']
    }
    if (activeViewMetric.name.includes('蒸汽')) {
      return ['蒸汽']
    }
    if (activeViewMetric.name.includes('氮气')) {
      return ['氮气']
    }

    // 2. 若为工序指标，检查指标自身涉及的能源类型
    if (activeViewMetric.category === 'process') {
      const pName = activeViewMetric.name
      if (pName.includes('干燥') || pName.includes('固化')) {
        return ['电力', '蒸汽']
      }
      if (pName.includes('交联') && (selectedNode.name.includes('新缆') || selectedNode.name.includes('新疆'))) {
        return ['电力', '氮气']
      }
      return ['电力']
    }

    // 3. 若为综合指标 / 单位产品能耗，根据单位在表格中登记的“工序主要消耗能源”进行展示
    if (activeUnitInfo?.energies && activeUnitInfo.energies.length > 0) {
      return activeUnitInfo.energies
    }

    // 4. 集团层级默认综合四介质
    return ['电力', '水', '天然气', '蒸汽']
  }, [activeViewMetric, activeUnitInfo, selectedNode])

  // 🌟 工序指标过滤：严格依据当前选中单位登记的关键制造工序及选中的产品标签动态呈现
  const filteredProcessMetrics = useMemo(() => {
    // 1. 若当前选中的是非集团单位，且未登记任何关键制造工序（如智慧能源、印能公司、南京电研、上开、柯贝尔、银利电气、智缆、昭和、曙光等），严格返回空数组
    if (!activeUnitInfo?.processes || activeUnitInfo.processes.length === 0) {
      return []
    }

    // 2. 获取该单位登记允许的关键制造工序名称列表 (去除①②③④等编号前缀)
    const allowedProcessKeywords = activeUnitInfo.processes.map((p) =>
      p.replace(/^[①②③④⑤⑥\d\.\s]+/, '').trim()
    )

    // 3. 从全量工序指标库中筛选出属于该单位所拥有的工序指标
    let list = PROCESS_CONTROL_METRICS.filter((metric) => {
      return allowedProcessKeywords.some((apk) => {
        const normApk = apk.replace(/（干法）/, '').replace(/\(干法\)/, '')
        return metric.name.includes(normApk) || metric.name.includes(apk)
      })
    })

    // 4. 若在板块三中选中了特定产品标签，则进一步按产品关联工序过滤
    if (currentProcessProduct) {
      const keywords = PRODUCT_PROCESS_KEYWORD_MAP[currentProcessProduct] || [currentProcessProduct]
      const matched = list.filter((m) =>
        keywords.some(
          (kw) =>
            m.name.includes(kw) ||
            m.badge.includes(kw) ||
            m.tipText.includes(kw) ||
            m.formula.includes(kw)
        )
      )
      if (matched.length > 0) {
        list = matched
      }
    }

    // 5. 搜索关键词过滤
    if (procSearchKey.trim()) {
      const kw = procSearchKey.trim().toLowerCase()
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(kw) ||
          m.code.toLowerCase().includes(kw) ||
          m.formula.toLowerCase().includes(kw) ||
          m.unit.toLowerCase().includes(kw)
      )
    }
    return list
  }, [activeUnitInfo, currentProcessProduct, procSearchKey])

  // 动态整体综合指标 (根据选中的组织节点自适应数值与同比，彻底解决公司/工厂级数据同质化问题)
  const currentOverallMetrics = useMemo(() => {
    const isGroup = selectedNode.level === 'group' || selectedNode.id === 'ent_root'
    const nodeName = selectedNode.name || ''

    // 预置各主要直属制造单位与代表性工厂的自适应指标特征字典
    const companyProfiles: Record<string, {
      totalEnergy: string; energyYoy: string;
      totalCarbon: string; carbonYoy: string;
      carbonIntensity: string; carbonIntensityYoy: string;
      greenRatio: string; greenYoy: string;
      phyGreenRatio: string; phyGreenYoy: string;
      unitAddedValue: string; unitAddedValueYoy: string;
      unitOutput: string; unitOutputYoy: string;
      waterTotal: string; waterYoy: string;
      savingEquip: string; savingEquipYoy: string;
      pcfRatio: string; pcfYoy: string;
    }> = {
      // 1. 沈变系 (特高压/大容量变压器主阵地，能耗高，产值大，单耗低)
      '沈变公司': {
        totalEnergy: '418.0', energyYoy: '-5.2%',
        totalCarbon: '965.0', carbonYoy: '-5.6%',
        carbonIntensity: '2.308', carbonIntensityYoy: '-0.4%',
        greenRatio: '31.0%', greenYoy: '+5.8%',
        phyGreenRatio: '18.5%', phyGreenYoy: '+3.2%',
        unitAddedValue: '0.1212', unitAddedValueYoy: '-4.2%',
        unitOutput: '0.0387', unitOutputYoy: '-4.5%',
        waterTotal: '3,450', waterYoy: '-3.8%',
        savingEquip: '91.5%', savingEquipYoy: '+3.4%',
        pcfRatio: '87.5%', pcfYoy: '+8.0%',
      },
      '沈变本部': {
        totalEnergy: '215.0', energyYoy: '-5.5%',
        totalCarbon: '495.0', carbonYoy: '-5.8%',
        carbonIntensity: '2.302', carbonIntensityYoy: '-0.3%',
        greenRatio: '28.5%', greenYoy: '+4.9%',
        phyGreenRatio: '16.2%', phyGreenYoy: '+2.8%',
        unitAddedValue: '0.1181', unitAddedValueYoy: '-4.6%',
        unitOutput: '0.0384', unitOutputYoy: '-4.8%',
        waterTotal: '1,780', waterYoy: '-4.0%',
        savingEquip: '89.2%', savingEquipYoy: '+3.1%',
        pcfRatio: '85.7%', pcfYoy: '+7.5%',
      },
      '露娜智能制造': {
        totalEnergy: '45.0', energyYoy: '-8.2%',
        totalCarbon: '104.0', carbonYoy: '-9.0%',
        carbonIntensity: '2.311', carbonIntensityYoy: '-0.8%',
        greenRatio: '52.0%', greenYoy: '+12.4%',
        phyGreenRatio: '38.0%', phyGreenYoy: '+8.5%',
        unitAddedValue: '0.1000', unitAddedValueYoy: '-6.5%',
        unitOutput: '0.0310', unitOutputYoy: '-6.8%',
        waterTotal: '620', waterYoy: '-5.2%',
        savingEquip: '98.5%', savingEquipYoy: '+5.2%',
        pcfRatio: '100%', pcfYoy: '+15.0%',
      },
      // 2. 衡变系 (清洁水电比例高，28MW分布式屋顶光伏领跑)
      '衡变公司': {
        totalEnergy: '362.5', energyYoy: '-4.8%',
        totalCarbon: '620.0', carbonYoy: '-6.2%',
        carbonIntensity: '1.710', carbonIntensityYoy: '-1.5%',
        greenRatio: '34.2%', greenYoy: '+6.5%',
        phyGreenRatio: '35.2%', phyGreenYoy: '+7.8%',
        unitAddedValue: '0.1215', unitAddedValueYoy: '-4.0%',
        unitOutput: '0.0394', unitOutputYoy: '-4.3%',
        waterTotal: '2,150', waterYoy: '-4.2%',
        savingEquip: '94.2%', savingEquipYoy: '+4.0%',
        pcfRatio: '93.8%', pcfYoy: '+9.2%',
      },
      '衡变本部': {
        totalEnergy: '165.0', energyYoy: '-5.0%',
        totalCarbon: '282.0', carbonYoy: '-6.5%',
        carbonIntensity: '1.709', carbonIntensityYoy: '-1.6%',
        greenRatio: '38.5%', greenYoy: '+7.2%',
        phyGreenRatio: '39.0%', phyGreenYoy: '+8.5%',
        unitAddedValue: '0.1213', unitAddedValueYoy: '-4.2%',
        unitOutput: '0.0393', unitOutputYoy: '-4.5%',
        waterTotal: '980', waterYoy: '-4.5%',
        savingEquip: '95.0%', savingEquipYoy: '+4.2%',
        pcfRatio: '92.3%', pcfYoy: '+8.8%',
      },
      // 3. 新变厂系 (新疆大漠戈壁风光绿电枢纽，综合绿电消费比例高达 58.5%)
      '新变厂': {
        totalEnergy: '309.5', energyYoy: '-4.5%',
        totalCarbon: '815.0', carbonYoy: '-4.2%',
        carbonIntensity: '2.633', carbonIntensityYoy: '+0.3%',
        greenRatio: '58.5%', greenYoy: '+14.2%',
        phyGreenRatio: '31.0%', phyGreenYoy: '+6.8%',
        unitAddedValue: '0.1984', unitAddedValueYoy: '-3.5%',
        unitOutput: '0.0632', unitOutputYoy: '-3.8%',
        waterTotal: '820', waterYoy: '-2.5%',
        savingEquip: '89.6%', savingEquipYoy: '+3.2%',
        pcfRatio: '80.0%', pcfYoy: '+6.5%',
      },
      '超高压公司': {
        totalEnergy: '145.0', energyYoy: '-4.8%',
        totalCarbon: '382.0', carbonYoy: '-4.5%',
        carbonIntensity: '2.634', carbonIntensityYoy: '+0.3%',
        greenRatio: '55.0%', greenYoy: '+13.5%',
        phyGreenRatio: '29.5%', phyGreenYoy: '+6.2%',
        unitAddedValue: '0.1959', unitAddedValueYoy: '-3.8%',
        unitOutput: '0.0620', unitOutputYoy: '-4.0%',
        waterTotal: '390', waterYoy: '-2.8%',
        savingEquip: '91.0%', savingEquipYoy: '+3.5%',
        pcfRatio: '83.3%', pcfYoy: '+7.0%',
      },
      // 4. 鲁缆公司 (电线电缆龙头，连铸连轧拉丝与挤出水槽冷却水耗大)
      '鲁缆公司': {
        totalEnergy: '105.5', energyYoy: '-3.8%',
        totalCarbon: '325.0', carbonYoy: '-3.5%',
        carbonIntensity: '3.080', carbonIntensityYoy: '+0.3%',
        greenRatio: '22.8%', greenYoy: '+4.2%',
        phyGreenRatio: '14.2%', phyGreenYoy: '+3.0%',
        unitAddedValue: '0.1819', unitAddedValueYoy: '-3.2%',
        unitOutput: '0.0502', unitOutputYoy: '-3.4%',
        waterTotal: '5,260', waterYoy: '-5.0%',
        savingEquip: '88.2%', savingEquipYoy: '+3.0%',
        pcfRatio: '80.0%', pcfYoy: '+6.0%',
      },
      '鲁缆本部': {
        totalEnergy: '62.0', energyYoy: '-4.0%',
        totalCarbon: '191.0', carbonYoy: '-3.8%',
        carbonIntensity: '3.081', carbonIntensityYoy: '+0.2%',
        greenRatio: '20.5%', greenYoy: '+3.8%',
        phyGreenRatio: '13.8%', phyGreenYoy: '+2.8%',
        unitAddedValue: '0.1824', unitAddedValueYoy: '-3.4%',
        unitOutput: '0.0504', unitOutputYoy: '-3.6%',
        waterTotal: '3,080', waterYoy: '-5.2%',
        savingEquip: '87.5%', savingEquipYoy: '+2.8%',
        pcfRatio: '75.0%', pcfYoy: '+5.5%',
      },
      // 5. 新缆厂 (新疆本地线缆枢纽，兼具高水耗与新疆高绿电消纳)
      '新缆厂': {
        totalEnergy: '58.0', energyYoy: '-4.0%',
        totalCarbon: '152.0', carbonYoy: '-4.2%',
        carbonIntensity: '2.620', carbonIntensityYoy: '-0.2%',
        greenRatio: '62.0%', greenYoy: '+15.6%',
        phyGreenRatio: '22.5%', phyGreenYoy: '+5.2%',
        unitAddedValue: '0.2042', unitAddedValueYoy: '-3.0%',
        unitOutput: '0.0592', unitOutputYoy: '-3.2%',
        waterTotal: '2,680', waterYoy: '-4.2%',
        savingEquip: '87.0%', savingEquipYoy: '+2.8%',
        pcfRatio: '66.7%', pcfYoy: '+5.0%',
      },
      // 6. 德缆公司 (特种电缆与欧盟出口主力，水耗显著，PCF 认证覆盖率高)
      '德缆公司': {
        totalEnergy: '31.0', energyYoy: '-3.5%',
        totalCarbon: '69.8', carbonYoy: '-3.8%',
        carbonIntensity: '2.251', carbonIntensityYoy: '-0.3%',
        greenRatio: '24.5%', greenYoy: '+4.5%',
        phyGreenRatio: '12.9%', phyGreenYoy: '+2.5%',
        unitAddedValue: '0.1938', unitAddedValueYoy: '-3.1%',
        unitOutput: '0.0596', unitOutputYoy: '-3.3%',
        waterTotal: '1,120', waterYoy: '-4.5%',
        savingEquip: '85.0%', savingEquipYoy: '+2.5%',
        pcfRatio: '80.0%', pcfYoy: '+7.5%',
      },
    }

    // 匹配当前节点 profile
    let profile = companyProfiles[nodeName]
    if (!profile) {
      for (const [key, p] of Object.entries(companyProfiles)) {
        if (nodeName.includes(key) || key.includes(nodeName)) {
          profile = p
          break
        }
      }
    }
    // 若仍未匹配（如其他直属工厂），则根据所属行业和工厂类型自适应
    if (!profile) {
      const isCable = nodeName.includes('缆') || nodeName.includes('线')
      profile = {
        totalEnergy: isCable ? '18.5' : '32.0', energyYoy: '-4.0%',
        totalCarbon: isCable ? '48.0' : '72.0', carbonYoy: '-4.2%',
        carbonIntensity: '2.300', carbonIntensityYoy: '-0.2%',
        greenRatio: isCable ? '25.0%' : '32.0%', greenYoy: '+5.0%',
        phyGreenRatio: '15.0%', phyGreenYoy: '+3.0%',
        unitAddedValue: isCable ? '0.1850' : '0.1250', unitAddedValueYoy: '-3.5%',
        unitOutput: isCable ? '0.0520' : '0.0400', unitOutputYoy: '-3.8%',
        waterTotal: isCable ? '450' : '180', waterYoy: '-3.5%',
        savingEquip: '88.0%', savingEquipYoy: '+3.0%',
        pcfRatio: '75.0%', pcfYoy: '+5.0%',
      }
    }

    return FACTORY_TOP10_METRICS.map((m) => {
      let curVal = m.curVal
      let yoy = m.yoy

      if (m.id === 'm-total-energy') {
        curVal = profile.totalEnergy
        yoy = profile.energyYoy
      } else if (m.id === 'm-total-carbon') {
        curVal = profile.totalCarbon
        yoy = profile.carbonYoy
      } else if (m.id === 'm-carbon-per-energy') {
        curVal = profile.carbonIntensity
        yoy = profile.carbonIntensityYoy
      } else if (m.id === 'm-green-energy-ratio') {
        curVal = profile.greenRatio
        yoy = profile.greenYoy
      } else if (m.id === 'm-phy-green-ratio') {
        curVal = profile.phyGreenRatio
        yoy = profile.phyGreenYoy
      } else if (m.id === 'm-unit-industrial-added-value') {
        curVal = profile.unitAddedValue
        yoy = profile.unitAddedValueYoy
      } else if (m.id === 'm-unit-output') {
        curVal = profile.unitOutput
        yoy = profile.unitOutputYoy
      } else if (m.id === 'm-water-consumption') {
        curVal = profile.waterTotal
        yoy = profile.waterYoy
      } else if (m.id === 'm-energy-saving-equipment-ratio') {
        curVal = profile.savingEquip
        yoy = profile.savingEquipYoy
      } else if (m.id === 'm-pcf-ratio') {
        curVal = profile.pcfRatio
        yoy = profile.pcfYoy
      }

      return {
        ...m,
        curVal,
        yoy,
      }
    })
  }, [selectedNode])

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
            <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveViewMetric(null)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-panel hover:bg-accent/40 text-foreground font-bold text-xs cursor-pointer transition-colors shadow-2xs shrink-0 border border-border"
                >
                  <ChevronLeft className="size-4 text-muted-foreground" />
                  <span>返回全景概览</span>
                </button>
                <div className="h-4 w-px bg-border" />
                <h1 className="text-sm font-extrabold text-foreground">
                  {activeViewMetric.name} <span className="text-primary font-mono">({activeViewMetric.unit})</span>
                </h1>
              </div>
            </div>

            {/* 顶部 3 栏信息卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs font-mono">
              {/* 1. 指标物理定义 */}
              <div className="p-4 bg-card rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-foreground font-bold font-sans">
                  <Info className="size-4 text-primary" />
                  <span>指标物理定义</span>
                </div>
                <p className="text-muted-foreground font-sans text-[11.5px] leading-relaxed">
                  {activeViewMetric.tipText}
                </p>
              </div>

              {/* 2. 核算数学公式 */}
              <div className="p-4 bg-card rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-foreground font-bold font-sans">
                  <Calculator className="size-4 text-purple-400" />
                  <span>核算数学公式</span>
                </div>
                <div className="text-purple-300 font-extrabold text-xs font-sans bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                  {activeViewMetric.formula}
                </div>
                <p className="text-muted-foreground text-[10.5px] font-sans leading-relaxed">
                  {activeViewMetric.formulaDesc}
                </p>
              </div>

              {/* 3. 因子说明 (根据指标动态显示折标煤系数或碳排放因子) */}
              <div className="p-4 bg-card rounded-xl border border-border shadow-xs space-y-2">
                {(() => {
                  const factorInfo = getFactorDescription(activeViewMetric, selectedNode)
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-foreground font-bold font-sans">
                          <Layers className="size-4 text-emerald-400" />
                          <span>因子说明</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                          {factorInfo.title}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-muted-foreground font-sans">
                        {factorInfo.subtitle}
                      </div>
                      <p className="text-muted-foreground font-sans text-[11px] leading-relaxed">
                        {factorInfo.content}
                      </p>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* 中间图表：数据变化趋势 */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    数据变化趋势
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-panel text-muted-foreground font-mono border border-border">
                    2025.09 ~ 2026.08
                  </span>
                </div>
              </div>

              <div className="h-[260px]">
                <LineTrend
                  data={activeViewMetric.trendHistory}
                  xKey="period"
                  height={260}
                  lines={[
                    { key: 'value', name: `实测值 (${activeViewMetric.unit})`, color: 'oklch(0.72 0.18 210)' },
                  ]}
                />
              </div>
            </div>

            {/* 底部表格：数据明细 */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-4 border-b border-border/60 flex items-center justify-between bg-panel/60">
                <div className="flex items-center gap-2">
                  <Table className="size-4 text-primary" />
                  <h3 className="text-xs font-bold text-foreground">
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
                {(() => {
                  const tableConfig = getMetricDetailTableColumns(activeViewMetric)
                  return (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-panel text-muted-foreground border-b border-border font-bold font-sans h-[44px]">
                          <th className="py-2.5 px-3 whitespace-nowrap min-w-[110px]">时间</th>
                          {tableConfig.columns.map((col) => (
                            <th key={col.key} className={cn('py-2.5 px-3 text-right whitespace-nowrap', col.headerClass)}>
                              {col.label} {col.unit ? `(${col.unit})` : ''}
                            </th>
                          ))}
                          <th className="py-2.5 px-3 font-mono text-right whitespace-nowrap text-primary">
                            {tableConfig.resultHeader}
                          </th>
                          <th className="py-2.5 px-3 font-mono text-right whitespace-nowrap">环比</th>
                          <th className="py-2.5 px-3 font-mono text-right whitespace-nowrap">同比</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-foreground">
                        {[...activeViewMetric.trendHistory].reverse().map((item, revIdx) => {
                          const idx = activeViewMetric.trendHistory.length - 1 - revIdx
                          const total = activeViewMetric.trendHistory.length

                          return (
                            <tr key={item.period} className="hover:bg-accent/30 transition-colors h-[44px]">
                              <td className="py-2.5 px-3 font-bold whitespace-nowrap">
                                {item.period === '26-08' ? '2026年08月' : `20${item.period.replace('-', '年')}月`}
                              </td>
                              {tableConfig.columns.map((col) => (
                                <td key={col.key} className={cn('py-2.5 px-3 text-right', col.valClass)}>
                                  {col.renderVal(item, idx, total)}
                                </td>
                              ))}
                              <td className="py-2.5 px-3 text-right font-extrabold text-primary whitespace-nowrap">
                                {item.value} {activeViewMetric.unit}
                              </td>
                              <td className={cn('py-2.5 px-3 text-right font-bold whitespace-nowrap', item.mom.startsWith('+') ? 'text-amber-400' : 'text-emerald-400')}>
                                {item.mom}
                              </td>
                              <td className={cn('py-2.5 px-3 text-right font-bold whitespace-nowrap', item.yoy.startsWith('+') ? 'text-amber-400' : 'text-emerald-400')}>
                                {item.yoy}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )
                })()}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 模式 A: 全景概览 View (Section 1 5-cols, Section 2 5-cols, Section 3 4-cols) */
          /* ========================================================================= */
          <div className="space-y-3.5">
            {/* 1. 顶部 Header 与 统一时间筛选 */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border shadow-xs">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <BarChart3 className="size-5" />
                </div>
                <h1 className="text-base font-bold text-foreground">指标管控</h1>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* 时间维度统一 (月度 / 季度 / 年度) */}
                <div className="flex items-center bg-panel p-0.5 rounded-lg border border-border text-xs">
                  <button
                    type="button"
                    onClick={() => setTimeDim('month')}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                      timeDim === 'month' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    月度
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeDim('quarter')}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                      timeDim === 'quarter' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    季度
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeDim('year')}
                    className={cn(
                      'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                      timeDim === 'year' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    年度
                  </button>
                </div>

                {/* 时间范围选择控件 (随维度自适应切换) */}
                {timeDim === 'month' && (
                  <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
                    <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                    <input
                      type="month"
                      value={selectedMonthRange.start}
                      onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, start: e.target.value }))}
                      className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                      title="起始月份"
                    />
                    <span className="text-muted-foreground font-sans">至</span>
                    <input
                      type="month"
                      value={selectedMonthRange.end}
                      onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, end: e.target.value }))}
                      className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                      title="结束月份"
                    />
                  </div>
                )}

                {timeDim === 'quarter' && (
                  <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs">
                    <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                    <select
                      value={selectedQuarter}
                      onChange={(e) => setSelectedQuarter(e.target.value)}
                      className="bg-transparent border-0 text-foreground text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
                    >
                      <option value="2026-Q1" className="bg-popover text-foreground">2026年 第1季度 (Q1)</option>
                      <option value="2026-Q2" className="bg-popover text-foreground">2026年 第2季度 (Q2)</option>
                      <option value="2026-Q3" className="bg-popover text-foreground">2026年 第3季度 (Q3)</option>
                      <option value="2026-Q4" className="bg-popover text-foreground">2026年 第4季度 (Q4)</option>
                      <option value="2025-Q4" className="bg-popover text-foreground">2025年 第4季度 (Q4)</option>
                    </select>
                  </div>
                )}

                {timeDim === 'year' && (
                  <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs">
                    <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="bg-transparent border-0 text-foreground text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
                    >
                      <option value="2026" className="bg-popover text-foreground">2026 年度</option>
                      <option value="2025" className="bg-popover text-foreground">2025 年度</option>
                      <option value="2024" className="bg-popover text-foreground">2024 年度</option>
                    </select>
                  </div>
                )}

                {/* 导出按钮 */}
                <button
                  type="button"
                  onClick={() => alert(`正在导出【${selectedNode.name}】指标管控报表 (Excel)...`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  <Download className="size-3.5" />
                  <span>导出</span>
                </button>
              </div>
            </div>

            {/* 🌟 依据节点层级区分呈现：集团级 (1级节点) 呈现 10 大指标联动看板 + 6 大单位横向 PK；单体公司/车间呈现产品与工序指标 */}
            {isGroupLevel ? (
              <div className="space-y-3.5">
                {/* 一、经营单位及项目公司整体指标 (10 项指标卡片) */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-1 rounded-full bg-primary shrink-0" />
                      <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        【一、经营单位及项目公司整体指标】
                      </h2>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      保留同比变化 · 点击查看 12 个月历史明细与公式
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
                    {GROUP_OVERALL_TOP10_METRICS.map((m) => {
                      const isSelected = selectedGroupMetricId === m.id
                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedGroupMetricId(m.id)}
                          className={cn(
                            'p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 group shadow-2xs relative select-none bg-panel',
                            isSelected
                              ? 'border-primary ring-2 ring-primary/20 shadow-xs bg-primary/15'
                              : 'border-border hover:border-primary/40 hover:bg-accent/40'
                          )}
                        >
                          <div className="flex items-center justify-between font-sans gap-1">
                            <span className={cn('text-[11px] font-bold truncate', isSelected ? 'text-primary' : 'text-foreground')} title={m.name}>
                              {m.name}
                            </span>
                            {m.badge && (
                              <span
                                className={cn(
                                  'text-[9px] px-1.5 py-0.5 rounded font-sans font-medium shrink-0 whitespace-nowrap',
                                  m.badge === '国家级零碳工厂' && 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
                                  m.badge === '国家级绿色工厂' && 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
                                  m.badge === '公司管理要求' && 'bg-primary/15 text-primary border border-primary/30'
                                )}
                              >
                                {m.badge}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className={cn('text-lg font-extrabold transition-colors', isSelected ? 'text-primary' : 'text-foreground')}>
                              {m.curVal} <span className="text-xs font-normal text-muted-foreground font-sans">{m.unit}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveViewMetric(m)
                              }}
                              className="text-[11px] font-medium text-primary hover:bg-primary/15 px-2 py-0.5 rounded border border-primary/30 transition-all cursor-pointer flex items-center gap-0.5 shrink-0"
                            >
                              <span>详情</span>
                            </button>
                          </div>

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                            <span className="text-muted-foreground">同比</span>
                            <span className="font-bold font-mono text-emerald-400">
                              {m.yoy} {m.isYoyDown ? '↓' : '↑'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 二、1、2、3 级全景能流桑基图 */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-1 rounded-full bg-primary shrink-0" />
                      <h3 className="text-xs font-bold text-foreground">
                        【二、数据变化桑基图】
                      </h3>
                    </div>
                  </div>

                  {/* 桑基图 */}
                  <div className="pt-1">
                    <SankeyFlow
                      nodes={currentSankeyData.nodes}
                      links={currentSankeyData.links}
                      unit={currentSankeyData.unit}
                      height={340}
                    />
                  </div>
                </div>

                {/* 三、产品管控指标 (集团全谱系主要产品联动) */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="h-3.5 w-1 rounded-full bg-amber-400 shrink-0" />
                      <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        【三、产品管控指标】
                      </h2>
                      {activeUnitInfo?.products && activeUnitInfo.products.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 font-sans">
                          {activeUnitInfo.products.map((prod) => {
                            const isActive = currentProduct === prod
                            return (
                              <button
                                key={prod}
                                type="button"
                                onClick={() => setSelectedProduct(prod)}
                                className={cn(
                                  'text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer shadow-2xs select-none flex items-center gap-1',
                                  isActive
                                    ? 'text-white bg-amber-500 border-amber-500 shadow-xs scale-105'
                                    : 'text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30'
                                )}
                              >
                                {isActive && <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                                <span>{prod}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {currentProductControlMetrics.length === 0 ? (
                    <div className="py-8 flex items-center justify-center text-center text-muted-foreground">
                      <span className="text-xs font-medium">暂无相关产品！</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
                      {currentProductControlMetrics.map((pm) => {
                        return (
                          <div
                            key={pm.id}
                            onClick={() => setActiveViewMetric(pm)}
                            className="p-3.5 bg-panel hover:bg-amber-500/10 rounded-xl border border-border hover:border-amber-400/40 transition-all cursor-pointer space-y-2 group shadow-2xs"
                          >
                            <div className="flex items-center justify-between font-sans">
                              <span className="text-[11px] font-bold text-foreground truncate" title={pm.name}>
                                {pm.name}
                              </span>
                            </div>

                            <div className="text-lg font-extrabold text-foreground group-hover:text-amber-400 transition-colors">
                              {pm.curVal} <span className="text-[10.5px] font-normal text-muted-foreground font-sans">{pm.unit}</span>
                            </div>

                            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                              <span className="text-muted-foreground">同比</span>
                              <span className="font-bold text-emerald-400 font-mono">{pm.yoy} ↓</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* 单体公司/车间视角: 呈现工厂 10 大整体指标 + 产品管控指标 + 关键工序管控指标 */
              <div className="space-y-3.5">
                {Boolean(selectedNode?.unconnected) && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs shrink-0 shadow-xs">
                    <Info className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="font-medium">
                      当前单位（{selectedNode.name}）暂不具备自动化数据联网接入条件，各专项能效指标正在推进硬件表计数字化改造，当前呈现离线归档参考值。
                    </span>
                  </div>
                )}
                {/* 一、经营单位及项目公司整体指标 (10 项指标卡片) */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-1 rounded-full bg-primary shrink-0" />
                      <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        【一、经营单位及项目公司整体指标】
                      </h2>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      保留同比变化 · 点击查看 12 个月历史明细与公式
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
                    {currentOverallMetrics.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setActiveViewMetric(m)}
                        className="p-3.5 bg-panel hover:bg-accent/40 rounded-xl border border-border hover:border-primary/40 transition-all cursor-pointer space-y-2 group shadow-2xs"
                      >
                        <div className="flex items-center justify-between font-sans gap-1">
                          <span className="text-[11px] font-bold text-foreground truncate">{m.name}</span>
                          {m.badge && (
                            <span
                              className={cn(
                                'text-[9px] px-1.5 py-0.5 rounded font-sans font-medium shrink-0 whitespace-nowrap',
                                m.badge === '国家级零碳工厂' && 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
                                m.badge === '国家级绿色工厂' && 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
                                m.badge === '公司管理要求' && 'bg-primary/15 text-primary border border-primary/30'
                              )}
                            >
                              {m.badge}
                            </span>
                          )}
                        </div>

                        <div className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">
                          {m.curVal} <span className="text-xs font-normal text-muted-foreground font-sans">{m.unit}</span>
                        </div>

                        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                          <span className="text-muted-foreground">同比</span>
                          <span className="font-bold text-emerald-400 font-mono">{m.yoy} ↓</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 二、产品管控指标 (5卡片/行) */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="h-3.5 w-1 rounded-full bg-amber-400 shrink-0" />
                      <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        【二、产品管控指标】
                      </h2>
                      {activeUnitInfo?.products && activeUnitInfo.products.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 font-sans">
                          {activeUnitInfo.products.map((prod) => {
                            const isActive = currentProduct === prod
                            return (
                              <button
                                key={prod}
                                type="button"
                                onClick={() => setSelectedProduct(prod)}
                                className={cn(
                                  'text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer shadow-2xs select-none flex items-center gap-1',
                                  isActive
                                    ? 'text-white bg-amber-500 border-amber-500 shadow-xs scale-105'
                                    : 'text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30'
                                )}
                              >
                                {isActive && <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                                <span>{prod}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
                    {currentProductControlMetrics.map((pm) => {
                      return (
                        <div
                          key={pm.id}
                          onClick={() => setActiveViewMetric(pm)}
                          className="p-3.5 bg-panel hover:bg-amber-500/10 rounded-xl border border-border hover:border-amber-400/40 transition-all cursor-pointer space-y-2 group shadow-2xs"
                        >
                          <div className="flex items-center justify-between font-sans">
                            <span className="text-[11px] font-bold text-foreground truncate" title={pm.name}>
                              {pm.name}
                            </span>
                          </div>

                          <div className="text-lg font-extrabold text-foreground group-hover:text-amber-400 transition-colors">
                            {pm.curVal} <span className="text-[10.5px] font-normal text-muted-foreground font-sans">{pm.unit}</span>
                          </div>

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                            <span className="text-muted-foreground">同比</span>
                            <span className="font-bold text-emerald-400 font-mono">{pm.yoy} ↓</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 三、关键制造工序能效对标指标 (4卡片/行) */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="h-3.5 w-1 rounded-full bg-purple-400 shrink-0" />
                      <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        【三、关键制造工序能效对标指标】
                      </h2>
                      {activeUnitInfo?.products && activeUnitInfo.products.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 font-sans">
                          {activeUnitInfo.products.map((prod) => {
                            const isActive = currentProcessProduct === prod
                            return (
                              <button
                                key={prod}
                                type="button"
                                onClick={() => setSelectedProcessProduct(prod)}
                                className={cn(
                                  'text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer shadow-2xs select-none flex items-center gap-1',
                                  isActive
                                    ? 'text-white bg-purple-500 border-purple-500 shadow-xs scale-105'
                                    : 'text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/30'
                                )}
                              >
                                {isActive && <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                                <span>{prod}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={procSearchKey}
                          onChange={(e) => setProcSearchKey(e.target.value)}
                          placeholder="搜索工序指标 (如: 拉丝 / 干燥 / 固化)..."
                          className="pl-8 pr-2.5 py-1 text-xs bg-panel border border-border rounded-lg focus:outline-none focus:border-purple-400 font-sans w-64 text-foreground"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {filteredProcessMetrics.length > 0 ? `已筛选 ${filteredProcessMetrics.length} 项工序指标` : '工序核定清单'}
                      </span>
                    </div>
                  </div>

                  {filteredProcessMetrics.length === 0 ? (
                    <div className="py-12 flex items-center justify-center text-center text-muted-foreground">
                      <span className="text-sm font-medium">暂无相关工序！</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
                      {filteredProcessMetrics.map((prm) => (
                        <div
                          key={prm.id}
                          onClick={() => setActiveViewMetric(prm)}
                          className="p-3.5 rounded-xl border border-border bg-panel hover:border-purple-400/40 hover:bg-purple-500/10 transition-all cursor-pointer space-y-2 group shadow-2xs"
                        >
                          <div className="flex items-center justify-between font-sans">
                            <span className="text-xs font-bold text-foreground truncate" title={prm.name}>
                              {prm.name}
                            </span>
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold shrink-0">
                              {prm.badge}
                            </span>
                          </div>

                          <div className="text-lg font-extrabold text-primary group-hover:text-purple-300 transition-colors">
                            {prm.curVal} <span className="text-xs font-normal text-muted-foreground font-sans">{prm.unit}</span>
                          </div>

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                            <span className="text-muted-foreground truncate" title={prm.formula}>
                              {prm.formula}
                            </span>
                            <span className="font-bold text-emerald-400 font-mono shrink-0 ml-1">{prm.yoy} ↓</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
// 因子说明生成函数 (依据指标类别动态返回折标煤系数或碳排放因子)
function getFactorDescription(
  metric: IndicatorMetric,
  selectedNode?: StandardOrgNode
): { title: string; subtitle: string; content: string } {
  const name = metric.name || ''
  const unit = metric.unit || ''

  // 1. 碳排放相关指标
  if (name.includes('碳排放') || name.includes('碳足迹') || unit.includes('tCO2')) {
    const isGroup = !selectedNode || selectedNode.id === 'ent_root' || selectedNode.level === 'group'
    const nodeName = selectedNode?.name || ''
    
    // 省级因子映射表
    let provinceName = ''
    let provinceFactor = ''
    if (nodeName.includes('沈变') || nodeName.includes('露娜') || nodeName.includes('和新') || nodeName.includes('康嘉')) {
      provinceName = '辽宁省'
      provinceFactor = '0.5410'
    } else if (nodeName.includes('衡变') || nodeName.includes('云集') || nodeName.includes('湖南') || nodeName.includes('特能建') || nodeName.includes('合容') || nodeName.includes('赛杰')) {
      provinceName = '湖南省'
      provinceFactor = '0.5120'
    } else if (nodeName.includes('新变') || nodeName.includes('超高压') || nodeName.includes('智能电气') || nodeName.includes('新缆') || nodeName.includes('自控')) {
      provinceName = '新疆'
      provinceFactor = '0.5920'
    } else if (nodeName.includes('鲁缆') || nodeName.includes('智缆') || nodeName.includes('昭和') || nodeName.includes('曙光')) {
      provinceName = '山东省'
      provinceFactor = '0.5880'
    } else if (nodeName.includes('德缆')) {
      provinceName = '四川省'
      provinceFactor = '0.2850'
    } else if (nodeName.includes('天变')) {
      provinceName = '天津市'
      provinceFactor = '0.5480'
    } else if (nodeName.includes('保定') || nodeName.includes('京津冀') || nodeName.includes('珠峰')) {
      provinceName = '河北省'
      provinceFactor = '0.5620'
    } else if (nodeName.includes('南京')) {
      provinceName = '江苏省'
      provinceFactor = '0.5370'
    }

    if (isGroup || !provinceFactor) {
      return {
        title: '碳排放因子说明',
        subtitle: '依据生态环境部最新电网基准与发改委温室气体核算指南',
        content: '电力碳排放因子：按各下属经营单位所在省份最新省级电网排放因子加权核算（辽宁、湖南、新疆、山东、四川各省独立适用，集团层面不设单一绝对值）；天然气碳排放因子：2.1622 tCO2/万m³（单位热值含碳量 15.32 tC/TJ）；自建分布式光伏与物理直供绿电按 0 排放核算。',
      }
    }

    return {
      title: '碳排放因子说明',
      subtitle: `依据生态环境部发布之最新${provinceName}电网基准与国家核算指南`,
      content: `电力碳排放因子：${provinceFactor} tCO2/MWh（${provinceName}最新电网平均因子）；天然气碳排放因子：2.1622 tCO2/万m³（单位热值含碳量 15.32 tC/TJ）；自建分布式光伏与物理直供绿电按 0 排放核算。`,
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



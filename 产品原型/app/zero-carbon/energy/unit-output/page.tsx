'use client'

import React, { useState, useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Zap,
  Flame,
  Droplets,
  Layers,
  Building2,
  BarChart3,
  Award,
  Factory,
  ChevronRight,
  Info,
  Wind,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// ============================================================================
// 1. 数据类型与配置定义
// ============================================================================

export type MetricType = 'tce' | 'elec' | 'steam' | 'gas' | 'water'

interface UnitOutputKpiItem {
  key: MetricType
  name: string
  shortName: string
  val: string
  unit: string
  yoy: string
  mom?: string
  color: string
  icon: any
}

interface SubUnitOutputRow {
  id: string
  name: string
  industry: string
  outputBillion: number // 工业总产值 (亿元)
  energyTce: number     // 综合能源消费 (tce)
  unitOutputTce: number // 万元产值综合能耗 (tce/万元)
  unitElec: number      // 万元产值电耗 (kWh/万元)
  unitSteam?: number    // 万元产值蒸汽消耗 (t/万元)
  unitGas?: number      // 万元产值天然气消耗 (m³/万元)
  unitWater?: number    // 万元产值水耗 (t/万元)
  yoy: string           // 同比
  mom: string           // 环比
}

// 集团 6 大制造公司数据
const GROUP_SIX_COMPANIES_OUTPUT: SubUnitOutputRow[] = [
  {
    id: '01',
    name: '沈变公司',
    industry: '变压器制造',
    outputBillion: 12.85,
    energyTce: 10854.2,
    unitOutputTce: 0.0844,
    unitElec: 212.5,
    unitSteam: 0.28,
    unitGas: 1.85,
    unitWater: 2.8,
    yoy: '-6.7%',
    mom: '-0.5%',
  },
  {
    id: '02',
    name: '衡变公司',
    industry: '变压器制造',
    outputBillion: 11.40,
    energyTce: 9940.6,
    unitOutputTce: 0.0872,
    unitElec: 219.0,
    unitSteam: 0.26,
    unitGas: 2.10,
    unitWater: 3.1,
    yoy: '-5.4%',
    mom: '-0.6%',
  },
  {
    id: '03',
    name: '鲁缆公司',
    industry: '线缆制造',
    outputBillion: 8.60,
    energyTce: 7380.5,
    unitOutputTce: 0.0858,
    unitElec: 215.2,
    unitGas: 1.60,
    unitWater: 2.5,
    yoy: '-5.6%',
    mom: '-0.4%',
  },
  {
    id: '04',
    name: '新变厂',
    industry: '变压器制造',
    outputBillion: 9.80,
    energyTce: 8760.3,
    unitOutputTce: 0.0894,
    unitElec: 224.8,
    unitSteam: 0.22,
    unitGas: 2.45,
    unitWater: 2.9,
    yoy: '-5.2%',
    mom: '-0.3%',
  },
  {
    id: '05',
    name: '新缆厂',
    industry: '线缆制造',
    outputBillion: 6.50,
    energyTce: 5840.2,
    unitOutputTce: 0.0898,
    unitElec: 226.5,
    unitGas: 1.75,
    unitWater: 2.6,
    yoy: '-5.1%',
    mom: '-0.3%',
  },
  {
    id: '06',
    name: '德缆公司',
    industry: '线缆制造',
    outputBillion: 5.80,
    energyTce: 5210.4,
    unitOutputTce: 0.0898,
    unitElec: 227.0,
    unitWater: 2.4,
    yoy: '-4.8%',
    mom: '-0.2%',
  },
]

// 各经营单位下属项目公司数据字典
const COMPANY_PROJECT_UNITS_MAP: Record<string, SubUnitOutputRow[]> = {
  '沈变公司': [
    {
      id: 'sb-01',
      name: '沈变本部',
      industry: '特高压变压器制造',
      outputBillion: 8.80,
      energyTce: 7436.0,
      unitOutputTce: 0.0845,
      unitElec: 210.0,
      unitSteam: 0.32,
      unitGas: 1.90,
      unitWater: 2.7,
      yoy: '-6.8%',
      mom: '-0.6%',
    },
    {
      id: 'sb-02',
      name: '和新套管公司',
      industry: '套管研发制造',
      outputBillion: 2.25,
      energyTce: 1890.2,
      unitOutputTce: 0.0840,
      unitElec: 218.0,
      unitWater: 2.6,
      yoy: '-6.5%',
      mom: '-0.4%',
    },
    {
      id: 'sb-03',
      name: '康嘉互感器',
      industry: '精密互感器制造',
      outputBillion: 1.80,
      energyTce: 1528.0,
      unitOutputTce: 0.0849,
      unitElec: 215.0,
      unitSteam: 0.21,
      unitWater: 2.9,
      yoy: '-6.2%',
      mom: '-0.3%',
    },
  ],
  '衡变公司': [
    {
      id: 'hb-01',
      name: '衡变本部',
      industry: '高压变压器制造',
      outputBillion: 6.20,
      energyTce: 5406.4,
      unitOutputTce: 0.0872,
      unitElec: 218.0,
      unitSteam: 0.28,
      unitGas: 2.15,
      unitWater: 3.2,
      yoy: '-5.5%',
      mom: '-0.6%',
    },
    {
      id: 'hb-02',
      name: '湖南电气',
      industry: '输配电智能设备',
      outputBillion: 2.10,
      energyTce: 1827.0,
      unitOutputTce: 0.0870,
      unitElec: 216.0,
      unitSteam: 0.24,
      unitWater: 3.0,
      yoy: '-5.3%',
      mom: '-0.5%',
    },
    {
      id: 'hb-03',
      name: '特能建',
      industry: '电力工程集成',
      outputBillion: 1.20,
      energyTce: 1048.8,
      unitOutputTce: 0.0874,
      unitElec: 220.0,
      unitWater: 2.8,
      yoy: '-5.2%',
      mom: '-0.4%',
    },
    {
      id: 'hb-04',
      name: '云集电气',
      industry: '中低压开关柜',
      outputBillion: 0.95,
      energyTce: 828.4,
      unitOutputTce: 0.0872,
      unitElec: 222.0,
      unitWater: 3.0,
      yoy: '-5.1%',
      mom: '-0.3%',
    },
    {
      id: 'hb-05',
      name: '云集高压开关',
      industry: 'GIS 组合电器',
      outputBillion: 0.95,
      energyTce: 829.0,
      unitOutputTce: 0.0873,
      unitElec: 224.0,
      unitWater: 3.1,
      yoy: '-5.0%',
      mom: '-0.3%',
    },
  ],
  '新变厂': [
    {
      id: 'xb-01',
      name: '超高压公司',
      industry: '特高压/超高压变压器',
      outputBillion: 4.50,
      energyTce: 4023.0,
      unitOutputTce: 0.0894,
      unitElec: 224.0,
      unitSteam: 0.25,
      unitGas: 2.50,
      unitWater: 2.9,
      yoy: '-5.3%',
      mom: '-0.4%',
    },
    {
      id: 'xb-02',
      name: '天变公司',
      industry: '干式变压器',
      outputBillion: 2.20,
      energyTce: 1966.8,
      unitOutputTce: 0.0894,
      unitElec: 225.0,
      unitGas: 2.30,
      unitWater: 2.8,
      yoy: '-5.2%',
      mom: '-0.3%',
    },
    {
      id: 'xb-03',
      name: '智能电气公司',
      industry: '智能化箱式变电站',
      outputBillion: 1.50,
      energyTce: 1341.0,
      unitOutputTce: 0.0894,
      unitElec: 226.0,
      unitWater: 2.9,
      yoy: '-5.1%',
      mom: '-0.3%',
    },
    {
      id: 'xb-04',
      name: '京津冀公司',
      industry: '中低压油浸式变压器',
      outputBillion: 0.90,
      energyTce: 805.5,
      unitOutputTce: 0.0895,
      unitElec: 227.0,
      unitSteam: 0.20,
      unitWater: 3.0,
      yoy: '-5.0%',
      mom: '-0.2%',
    },
    {
      id: 'xb-05',
      name: '珠峰硅钢',
      industry: '铁芯与硅钢加工',
      outputBillion: 0.70,
      energyTce: 624.0,
      unitOutputTce: 0.0891,
      unitElec: 220.0,
      unitWater: 2.5,
      yoy: '-5.4%',
      mom: '-0.3%',
    },
  ],
  '鲁缆公司': [
    {
      id: 'll-01',
      name: '鲁缆本部',
      industry: '中低压/超高压电缆',
      outputBillion: 6.80,
      energyTce: 5834.4,
      unitOutputTce: 0.0858,
      unitElec: 215.0,
      unitGas: 1.65,
      unitWater: 2.5,
      yoy: '-5.7%',
      mom: '-0.5%',
    },
    {
      id: 'll-02',
      name: '曙光公司',
      industry: '特种电缆',
      outputBillion: 1.80,
      energyTce: 1546.1,
      unitOutputTce: 0.0859,
      unitElec: 216.0,
      unitWater: 2.4,
      yoy: '-5.4%',
      mom: '-0.3%',
    },
  ],
  '新缆厂': [
    {
      id: 'xl-01',
      name: '特变电工新疆电缆有限公司',
      industry: '电缆制造与交联',
      outputBillion: 3.80,
      energyTce: 3412.4,
      unitOutputTce: 0.0898,
      unitElec: 226.0,
      unitGas: 1.80,
      unitWater: 2.6,
      yoy: '-5.2%',
      mom: '-0.3%',
    },
    {
      id: 'xl-02',
      name: '特变电工新疆线缆厂',
      industry: '中低压电缆制造',
      outputBillion: 2.70,
      energyTce: 2427.8,
      unitOutputTce: 0.0899,
      unitElec: 227.0,
      unitWater: 2.5,
      yoy: '-5.0%',
      mom: '-0.2%',
    },
  ],
  '德缆公司': [
    {
      id: 'dl-01',
      name: '特变电工（德阳）电缆股份有限公司',
      industry: '线缆制造及交联生产',
      outputBillion: 3.60,
      energyTce: 3232.8,
      unitOutputTce: 0.0898,
      unitElec: 227.0,
      unitWater: 2.4,
      yoy: '-4.9%',
      mom: '-0.2%',
    },
    {
      id: 'dl-02',
      name: '德缆公司本部',
      industry: '中低压电缆及拉丝',
      outputBillion: 2.20,
      energyTce: 1977.6,
      unitOutputTce: 0.0899,
      unitElec: 227.0,
      unitWater: 2.3,
      yoy: '-4.7%',
      mom: '-0.2%',
    },
  ],
}

function getCompanySubUnits(companyName: string): SubUnitOutputRow[] {
  for (const [key, list] of Object.entries(COMPANY_PROJECT_UNITS_MAP)) {
    if (companyName.includes(key) || key.includes(companyName)) {
      return list
    }
  }
  return COMPANY_PROJECT_UNITS_MAP['沈变公司'] || []
}

// ============================================================================
// 2. 多介质历史趋势数据字典 (区分 12 个月、12 个季度、近 3 年)
// ============================================================================

interface TrendPoint {
  period: string
  value: number
  yoy: string
  mom?: string
}

const METRICS_TREND_DATABASE: Record<MetricType, {
  name: string
  unit: string
  color: string
  '12months': TrendPoint[]
  '12quarters': TrendPoint[]
  '3years': TrendPoint[]
}> = {
  tce: {
    name: '万元产值综合能耗',
    unit: 'tce/万元',
    color: '#1677ff',
    '12months': [
      { period: '25-09', value: 0.0932, yoy: '-5.0%', mom: '-0.5%' },
      { period: '25-10', value: 0.0925, yoy: '-5.2%', mom: '-0.8%' },
      { period: '25-11', value: 0.0918, yoy: '-5.3%', mom: '-0.8%' },
      { period: '25-12', value: 0.0924, yoy: '-5.1%', mom: '+0.7%' },
      { period: '26-01', value: 0.0908, yoy: '-5.5%', mom: '-1.7%' },
      { period: '26-02', value: 0.0902, yoy: '-5.6%', mom: '-0.7%' },
      { period: '26-03', value: 0.0895, yoy: '-5.7%', mom: '-0.8%' },
      { period: '26-04', value: 0.0888, yoy: '-5.8%', mom: '-0.8%' },
      { period: '26-05', value: 0.0881, yoy: '-5.9%', mom: '-0.8%' },
      { period: '26-06', value: 0.0875, yoy: '-6.0%', mom: '-0.7%' },
      { period: '26-07', value: 0.0868, yoy: '-6.1%', mom: '-0.8%' },
      { period: '26-08', value: 0.0864, yoy: '-6.2%', mom: '-0.5%' },
    ],
    '12quarters': [
      { period: '23-Q4', value: 0.1015, yoy: '-4.2%' },
      { period: '24-Q1', value: 0.0998, yoy: '-4.5%' },
      { period: '24-Q2', value: 0.0982, yoy: '-4.8%' },
      { period: '24-Q3', value: 0.0965, yoy: '-5.0%' },
      { period: '24-Q4', value: 0.0950, yoy: '-5.2%' },
      { period: '25-Q1', value: 0.0935, yoy: '-5.5%' },
      { period: '25-Q2', value: 0.0920, yoy: '-5.7%' },
      { period: '25-Q3', value: 0.0905, yoy: '-5.9%' },
      { period: '25-Q4', value: 0.0892, yoy: '-6.0%' },
      { period: '26-Q1', value: 0.0880, yoy: '-6.1%' },
      { period: '26-Q2', value: 0.0870, yoy: '-6.2%' },
      { period: '26-Q3', value: 0.0864, yoy: '-6.2%' },
    ],
    '3years': [
      { period: '2024年度', value: 0.0974, yoy: '-4.8%' },
      { period: '2025年度', value: 0.0913, yoy: '-5.7%' },
      { period: '2026年(至8月)', value: 0.0868, yoy: '-6.2%' },
    ],
  },
  elec: {
    name: '万元产值电耗',
    unit: 'kWh/万元',
    color: '#1677ff',
    '12months': [
      { period: '25-09', value: 235.0, yoy: '-4.8%', mom: '-0.4%' },
      { period: '25-10', value: 233.2, yoy: '-5.0%', mom: '-0.8%' },
      { period: '25-11', value: 231.5, yoy: '-5.1%', mom: '-0.7%' },
      { period: '25-12', value: 233.0, yoy: '-4.9%', mom: '+0.6%' },
      { period: '26-01', value: 229.0, yoy: '-5.3%', mom: '-1.7%' },
      { period: '26-02', value: 227.5, yoy: '-5.4%', mom: '-0.7%' },
      { period: '26-03', value: 225.8, yoy: '-5.5%', mom: '-0.7%' },
      { period: '26-04', value: 224.0, yoy: '-5.6%', mom: '-0.8%' },
      { period: '26-05', value: 222.2, yoy: '-5.7%', mom: '-0.8%' },
      { period: '26-06', value: 220.5, yoy: '-5.7%', mom: '-0.8%' },
      { period: '26-07', value: 219.0, yoy: '-5.8%', mom: '-0.7%' },
      { period: '26-08', value: 218.4, yoy: '-5.8%', mom: '-0.3%' },
    ],
    '12quarters': [
      { period: '23-Q4', value: 256.0, yoy: '-4.0%' },
      { period: '24-Q1', value: 252.0, yoy: '-4.3%' },
      { period: '24-Q2', value: 248.0, yoy: '-4.6%' },
      { period: '24-Q3', value: 244.0, yoy: '-4.8%' },
      { period: '24-Q4', value: 240.0, yoy: '-5.0%' },
      { period: '25-Q1', value: 236.0, yoy: '-5.2%' },
      { period: '25-Q2', value: 232.0, yoy: '-5.4%' },
      { period: '25-Q3', value: 228.0, yoy: '-5.6%' },
      { period: '25-Q4', value: 225.0, yoy: '-5.7%' },
      { period: '26-Q1', value: 222.0, yoy: '-5.8%' },
      { period: '26-Q2', value: 220.0, yoy: '-5.8%' },
      { period: '26-Q3', value: 218.4, yoy: '-5.8%' },
    ],
    '3years': [
      { period: '2024年度', value: 246.0, yoy: '-4.6%' },
      { period: '2025年度', value: 230.5, yoy: '-5.5%' },
      { period: '2026年(至8月)', value: 219.5, yoy: '-5.8%' },
    ],
  },
  steam: {
    name: '万元产值蒸汽消耗',
    unit: 't/万元',
    color: '#722ed1',
    '12months': [
      { period: '25-09', value: 0.32, yoy: '-3.8%', mom: '-0.5%' },
      { period: '25-10', value: 0.31, yoy: '-4.0%', mom: '-3.1%' },
      { period: '25-11', value: 0.30, yoy: '-4.1%', mom: '-3.2%' },
      { period: '25-12', value: 0.31, yoy: '-3.9%', mom: '+3.3%' },
      { period: '26-01', value: 0.29, yoy: '-4.2%', mom: '-6.5%' },
      { period: '26-02', value: 0.28, yoy: '-4.3%', mom: '-3.4%' },
      { period: '26-03', value: 0.28, yoy: '-4.3%', mom: '0.0%' },
      { period: '26-04', value: 0.27, yoy: '-4.4%', mom: '-3.6%' },
      { period: '26-05', value: 0.26, yoy: '-4.4%', mom: '-3.7%' },
      { period: '26-06', value: 0.26, yoy: '-4.5%', mom: '0.0%' },
      { period: '26-07', value: 0.25, yoy: '-4.5%', mom: '-3.8%' },
      { period: '26-08', value: 0.25, yoy: '-4.5%', mom: '0.0%' },
    ],
    '12quarters': [
      { period: '23-Q4', value: 0.38, yoy: '-3.5%' },
      { period: '24-Q1', value: 0.36, yoy: '-3.8%' },
      { period: '24-Q2', value: 0.35, yoy: '-4.0%' },
      { period: '24-Q3', value: 0.34, yoy: '-4.1%' },
      { period: '24-Q4', value: 0.33, yoy: '-4.2%' },
      { period: '25-Q1', value: 0.32, yoy: '-4.3%' },
      { period: '25-Q2', value: 0.31, yoy: '-4.4%' },
      { period: '25-Q3', value: 0.30, yoy: '-4.5%' },
      { period: '25-Q4', value: 0.29, yoy: '-4.5%' },
      { period: '26-Q1', value: 0.28, yoy: '-4.5%' },
      { period: '26-Q2', value: 0.26, yoy: '-4.5%' },
      { period: '26-Q3', value: 0.25, yoy: '-4.5%' },
    ],
    '3years': [
      { period: '2024年度', value: 0.35, yoy: '-4.0%' },
      { period: '2025年度', value: 0.30, yoy: '-4.4%' },
      { period: '2026年(至8月)', value: 0.26, yoy: '-4.5%' },
    ],
  },
  gas: {
    name: '万元产值天然气消耗',
    unit: 'm³/万元',
    color: '#fa8c16',
    '12months': [
      { period: '25-09', value: 2.65, yoy: '-3.5%', mom: '-0.5%' },
      { period: '25-10', value: 2.60, yoy: '-3.7%', mom: '-1.9%' },
      { period: '25-11', value: 2.56, yoy: '-3.8%', mom: '-1.5%' },
      { period: '25-12', value: 2.58, yoy: '-3.6%', mom: '+0.8%' },
      { period: '26-01', value: 2.50, yoy: '-3.9%', mom: '-3.1%' },
      { period: '26-02', value: 2.48, yoy: '-4.0%', mom: '-0.8%' },
      { period: '26-03', value: 2.44, yoy: '-4.0%', mom: '-1.6%' },
      { period: '26-04', value: 2.40, yoy: '-4.1%', mom: '-1.6%' },
      { period: '26-05', value: 2.38, yoy: '-4.1%', mom: '-0.8%' },
      { period: '26-06', value: 2.35, yoy: '-4.1%', mom: '-1.3%' },
      { period: '26-07', value: 2.33, yoy: '-4.1%', mom: '-0.9%' },
      { period: '26-08', value: 2.33, yoy: '-4.1%', mom: '0.0%' },
    ],
    '12quarters': [
      { period: '23-Q4', value: 3.10, yoy: '-3.2%' },
      { period: '24-Q1', value: 2.95, yoy: '-3.5%' },
      { period: '24-Q2', value: 2.88, yoy: '-3.6%' },
      { period: '24-Q3', value: 2.80, yoy: '-3.8%' },
      { period: '24-Q4', value: 2.75, yoy: '-3.9%' },
      { period: '25-Q1', value: 2.70, yoy: '-4.0%' },
      { period: '25-Q2', value: 2.62, yoy: '-4.0%' },
      { period: '25-Q3', value: 2.55, yoy: '-4.1%' },
      { period: '25-Q4', value: 2.48, yoy: '-4.1%' },
      { period: '26-Q1', value: 2.42, yoy: '-4.1%' },
      { period: '26-Q2', value: 2.36, yoy: '-4.1%' },
      { period: '26-Q3', value: 2.33, yoy: '-4.1%' },
    ],
    '3years': [
      { period: '2024年度', value: 2.85, yoy: '-3.6%' },
      { period: '2025年度', value: 2.59, yoy: '-4.0%' },
      { period: '2026年(至8月)', value: 2.36, yoy: '-4.1%' },
    ],
  },
  water: {
    name: '万元产值水耗',
    unit: 't/万元',
    color: '#13c2c2',
    '12months': [
      { period: '25-09', value: 3.4, yoy: '-3.2%', mom: '-0.5%' },
      { period: '25-10', value: 3.3, yoy: '-3.4%', mom: '-2.9%' },
      { period: '25-11', value: 3.2, yoy: '-3.5%', mom: '-3.0%' },
      { period: '25-12', value: 3.3, yoy: '-3.3%', mom: '+3.1%' },
      { period: '26-01', value: 3.1, yoy: '-3.6%', mom: '-6.1%' },
      { period: '26-02', value: 3.0, yoy: '-3.7%', mom: '-3.2%' },
      { period: '26-03', value: 3.0, yoy: '-3.7%', mom: '0.0%' },
      { period: '26-04', value: 2.9, yoy: '-3.8%', mom: '-3.3%' },
      { period: '26-05', value: 2.9, yoy: '-3.8%', mom: '0.0%' },
      { period: '26-06', value: 2.8, yoy: '-3.9%', mom: '-3.4%' },
      { period: '26-07', value: 2.8, yoy: '-3.9%', mom: '0.0%' },
      { period: '26-08', value: 2.8, yoy: '-3.9%', mom: '0.0%' },
    ],
    '12quarters': [
      { period: '23-Q4', value: 3.9, yoy: '-3.0%' },
      { period: '24-Q1', value: 3.8, yoy: '-3.2%' },
      { period: '24-Q2', value: 3.7, yoy: '-3.4%' },
      { period: '24-Q3', value: 3.6, yoy: '-3.5%' },
      { period: '24-Q4', value: 3.5, yoy: '-3.6%' },
      { period: '25-Q1', value: 3.4, yoy: '-3.7%' },
      { period: '25-Q2', value: 3.3, yoy: '-3.8%' },
      { period: '25-Q3', value: 3.2, yoy: '-3.8%' },
      { period: '25-Q4', value: 3.1, yoy: '-3.9%' },
      { period: '26-Q1', value: 3.0, yoy: '-3.9%' },
      { period: '26-Q2', value: 2.9, yoy: '-3.9%' },
      { period: '26-Q3', value: 2.8, yoy: '-3.9%' },
    ],
    '3years': [
      { period: '2024年度', value: 3.65, yoy: '-3.4%' },
      { period: '2025年度', value: 3.25, yoy: '-3.8%' },
      { period: '2026年(至8月)', value: 2.88, yoy: '-3.9%' },
    ],
  },
}

// ============================================================================
// 3. 主页面组件
// ============================================================================

export default function UnitOutputPage() {
  // 当前选中的组织拓扑节点 (默认为集团，支持点击左侧树下钻到经营单位、项目公司)
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'ent_root',
    name: '特变电工集团',
    fullName: '特变电工股份有限公司 (集团总部)',
    level: 'group',
    badge: '集团总部',
  })

  // 🌟 当前选中的 KPI 卡片介质 (默认为综合能耗 'tce'，支持点击任意卡片同步驱动趋势图与明细)
  const [activeMetricKey, setActiveMetricKey] = useState<MetricType>('tce')

  // 趋势时间范围切换: 近12个月 / 近12个季度 / 近3年
  const [trendTimeRange, setTrendTimeRange] = useState<'12months' | '12quarters' | '3years'>('12months')

  // 🌟 时间维度统一 (月度 / 季度 / 年度) 与所选时间范围 (与单位产品能耗完全一致)
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  // 判断当前选中节点层级
  const isGroupLevel = selectedNode.level === 'group' || selectedNode.id === 'ent_root'
  const isCompanyLevel = selectedNode.level === 'company'
  const isProjectCompanyLevel = selectedNode.level === 'workshop' || (!isGroupLevel && !isCompanyLevel)

  // 🌟 根据选中的组织节点动态构建该单位具备的能源介质万元产值单耗卡片列表
  const kpiMetrics = useMemo<UnitOutputKpiItem[]>(() => {
    const nodeName = selectedNode.name || ''
    const isCable = nodeName.includes('缆')
    const isGroup = isGroupLevel

    // 基础万元产值综合能耗
    const baseTce = isGroup ? '0.0864' : (isCable ? '0.0872' : (nodeName.includes('衡变') ? '0.0872' : (nodeName.includes('新变') ? '0.0894' : '0.0844')))
    const baseTceYoy = isGroup ? '-6.2%' : (isCable ? '-5.4%' : (nodeName.includes('衡变') ? '-5.4%' : (nodeName.includes('新变') ? '-5.2%' : '-6.7%')))

    // 万元产值电耗 (所有单位均有)
    const baseElec = isGroup ? '218.4' : (isCable ? '219.8' : (nodeName.includes('衡变') ? '219.0' : (nodeName.includes('新变') ? '224.8' : '212.5')))
    const baseElecYoy = isGroup ? '-5.8%' : (isCable ? '-5.1%' : (nodeName.includes('衡变') ? '-5.4%' : (nodeName.includes('新变') ? '-5.2%' : '-6.2%')))

    const list: UnitOutputKpiItem[] = [
      {
        key: 'tce',
        name: '万元产值综合能耗',
        shortName: '综合能耗',
        val: baseTce,
        unit: 'tce/万元',
        yoy: baseTceYoy,
        mom: '-0.5%',
        color: '#1677ff',
        icon: Award,
      },
      {
        key: 'elec',
        name: '万元产值电耗',
        shortName: '产值电耗',
        val: baseElec,
        unit: 'kWh/万元',
        yoy: baseElecYoy,
        mom: '-0.4%',
        color: '#1677ff',
        icon: Zap,
      },
    ]

    // 蒸汽消耗 (变压器产线如沈变、衡变、新变及集团有蒸汽，线缆厂通常无或极少)
    if (isGroup || !isCable || nodeName.includes('变') || nodeName.includes('互感器')) {
      const steamVal = isGroup ? '0.25' : (nodeName.includes('衡变') ? '0.26' : (nodeName.includes('新变') ? '0.22' : '0.28'))
      list.push({
        key: 'steam',
        name: '万元产值蒸汽消耗',
        shortName: '蒸汽消耗',
        val: steamVal,
        unit: 't/万元',
        yoy: '-4.5%',
        mom: '-0.3%',
        color: '#722ed1',
        icon: Layers,
      })
    }

    // 天然气消耗 (除德缆等纯电拉丝外，各主要单位与集团均有窑炉/烘房气耗)
    if (isGroup || !nodeName.includes('德缆')) {
      const gasVal = isGroup ? '2.33' : (nodeName.includes('衡变') ? '2.10' : (nodeName.includes('新变') ? '2.45' : (isCable ? '1.60' : '1.85')))
      list.push({
        key: 'gas',
        name: '万元产值天然气消耗',
        shortName: '天然气消耗',
        val: gasVal,
        unit: 'm³/万元',
        yoy: '-4.1%',
        mom: '-0.2%',
        color: '#fa8c16',
        icon: Flame,
      })
    }

    // 水资源消耗
    const waterVal = isGroup ? '2.8' : (nodeName.includes('衡变') ? '3.1' : (nodeName.includes('新变') ? '2.9' : (isCable ? '2.5' : '2.8')))
    list.push({
      key: 'water',
      name: '万元产值水耗',
      shortName: '水耗',
      val: waterVal,
      unit: 't/万元',
      yoy: '-3.9%',
      mom: '-0.1%',
      color: '#13c2c2',
      icon: Droplets,
    })

    return list
  }, [selectedNode, isGroupLevel])

  // 当前激活的指标元数据
  const activeMetricMeta = useMemo(() => {
    return METRICS_TREND_DATABASE[activeMetricKey] || METRICS_TREND_DATABASE.tce
  }, [activeMetricKey])

  // 🌟 当前层级下属单位列表 (集团页 ➔ 6家单位; 经营单位页 ➔ 其项目公司; 项目公司页 ➔ 无)
  const currentSubUnits = useMemo<SubUnitOutputRow[]>(() => {
    if (isGroupLevel) {
      return GROUP_SIX_COMPANIES_OUTPUT
    }
    if (isCompanyLevel) {
      return getCompanySubUnits(selectedNode.name)
    }
    return []
  }, [isGroupLevel, isCompanyLevel, selectedNode.name])

  // 🌟 趋势图表当前选中的数据源 (严格与 activeMetricKey 同步)
  const currentTrendData = useMemo(() => {
    const db = METRICS_TREND_DATABASE[activeMetricKey] || METRICS_TREND_DATABASE.tce
    return db[trendTimeRange] || db['12months']
  }, [activeMetricKey, trendTimeRange])

  // 最新期指标点
  const latestTrendPoint = useMemo(() => {
    return currentTrendData[currentTrendData.length - 1]
  }, [currentTrendData])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => {
          setSelectedNode(node)
          // 切换组织节点时若当前选中的介质在该单位不存在则退回 tce
          if (node.name.includes('德缆') && activeMetricKey === 'gas') {
            setActiveMetricKey('tce')
          }
        }}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        
        {/* 1. 顶部 Header 与 统一标准时间筛选 (与单位产品能耗完全一致) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <TrendingUp className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">单位产值能耗</h1>
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
              onClick={() => alert(`正在导出【${selectedNode.name}】单位产值能耗分析报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 2. 核心能源介质万元产值单耗卡片 (点击卡片同步联动趋势图与数据) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#1677ff] rounded-full" />
              <h2 className="text-xs font-bold text-slate-800">
                万元产值能源单耗指标
              </h2>
            </div>
          </div>

          <div className={cn(
            'grid gap-3 font-mono',
            kpiMetrics.length <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
          )}>
            {kpiMetrics.map((m) => {
              const IconComponent = m.icon
              const isSelected = activeMetricKey === m.key

              return (
                <div
                  key={m.key}
                  onClick={() => setActiveMetricKey(m.key)}
                  className={cn(
                    'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all cursor-pointer relative select-none group',
                    isSelected
                      ? 'bg-gradient-to-br from-blue-50/95 via-white to-blue-50/40 border-2 border-[#1677ff] ring-2 ring-[#1677ff]/20 shadow-sm scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                  )}
                >
                  <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
                    <span className={cn('font-bold flex items-center gap-1.5', isSelected ? 'text-[#1677ff]' : 'text-slate-800')}>
                      <IconComponent className={cn('size-3.5', isSelected ? 'text-[#1677ff]' : 'text-slate-500')} />
                      {m.name}
                    </span>
                    {isSelected && (
                      <span className="size-2 rounded-full bg-[#1677ff] animate-pulse" />
                    )}
                  </div>

                  <div className={cn('text-xl font-bold tracking-tight', isSelected ? 'text-[#1677ff]' : 'text-slate-900')}>
                    {m.val} <span className="text-xs font-sans text-slate-500 font-normal">{m.unit}</span>
                  </div>

                  <div className="text-[11px] font-sans text-slate-600 pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span>
                      同比: <strong className="text-emerald-600 font-mono font-bold">{m.yoy} ↓</strong>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. 万元产值能耗变化趋势 (随卡片点击精准同步切换数值与单位) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#1677ff] rounded-full" />
              <h3 className="text-xs font-bold text-slate-800">
                {activeMetricMeta.name}变化趋势
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] font-mono font-bold border border-blue-200/80">
                单位: {activeMetricMeta.unit}
              </span>
            </div>

            {/* 时间颗粒度切换 (近12个月 / 近12个季度 / 近3年) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setTrendTimeRange('12months')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  trendTimeRange === '12months'
                    ? 'font-bold bg-white text-[#1677ff] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                近12个月
              </button>
              <button
                type="button"
                onClick={() => setTrendTimeRange('12quarters')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  trendTimeRange === '12quarters'
                    ? 'font-bold bg-white text-[#1677ff] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                近12个季度
              </button>
              <button
                type="button"
                onClick={() => setTrendTimeRange('3years')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  trendTimeRange === '3years'
                    ? 'font-bold bg-white text-[#1677ff] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                近3年
              </button>
            </div>
          </div>

          {/* 图表渲染 (专注呈现当前点击卡片的单耗指标趋势) */}
          <div className="h-[270px]">
            <LineTrend
              data={currentTrendData}
              xKey="period"
              height={270}
              lines={[
                {
                  key: 'value',
                  name: `${activeMetricMeta.name} (${activeMetricMeta.unit})`,
                  color: activeMetricMeta.color || '#1677ff',
                },
              ]}
            />
          </div>

          {/* 趋势明细透视底栏 */}
          <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-sans text-slate-500">最新实测 ({latestTrendPoint?.period}):</span>
              <strong className="text-[#1677ff] font-bold text-sm">
                {latestTrendPoint?.value} {activeMetricMeta.unit}
              </strong>
            </div>
            <div className="flex items-center gap-3">
              {latestTrendPoint?.mom && (
                <span>环比变化: <strong className="text-slate-700">{latestTrendPoint.mom}</strong></span>
              )}
              <span>
                同比变化: <strong className="text-emerald-600 font-bold">{latestTrendPoint?.yoy} ↓</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 4. 下级单位对比展示 (集团页 ➔ 6家单位; 经营单位页 ➔ 下属项目公司; 项目公司页 ➔ 历史明细台账) */}
        {isGroupLevel || isCompanyLevel ? (
          <div className="space-y-3.5">
            {/* 卡片网格 */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-[#1677ff] rounded-full" />
                  <h3 className="text-xs font-bold text-slate-800">
                    {isGroupLevel
                      ? '各经营单位单位产值能耗'
                      : '各项目公司单位产值能耗'}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {isGroupLevel ? '共 6 家经营单位' : `共 ${currentSubUnits.length} 家下属项目公司/车间`}
                </span>
              </div>

              <div className={cn(
                'grid gap-3 font-mono',
                currentSubUnits.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              )}>
                {currentSubUnits.map((r) => {
                  // 根据 activeMetricKey 动态展现子单位在该介质下的数值
                  let activeValDisplay = `${r.unitOutputTce.toFixed(4)} tce/万元`
                  let activeValLabel = '万元产值综合能耗'
                  if (activeMetricKey === 'elec') {
                    activeValDisplay = `${r.unitElec.toFixed(1)} kWh/万元`
                    activeValLabel = '万元产值电耗'
                  } else if (activeMetricKey === 'steam') {
                    activeValDisplay = r.unitSteam ? `${r.unitSteam.toFixed(2)} t/万元` : '-'
                    activeValLabel = '万元产值蒸汽'
                  } else if (activeMetricKey === 'gas') {
                    activeValDisplay = r.unitGas ? `${r.unitGas.toFixed(2)} m³/万元` : '-'
                    activeValLabel = '万元产值天然气'
                  } else if (activeMetricKey === 'water') {
                    activeValDisplay = r.unitWater ? `${r.unitWater.toFixed(1)} t/万元` : '-'
                    activeValLabel = '万元产值水耗'
                  }

                  return (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs font-sans text-slate-900 flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-[#1677ff]" />
                          {r.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                        <div className="p-2 rounded-lg bg-white border border-slate-100 space-y-0.5">
                          <span className="text-[10px] text-slate-400 block font-sans truncate" title={activeValLabel}>
                            {activeValLabel}
                          </span>
                          <strong className="text-[#1677ff] text-sm block truncate">{activeValDisplay}</strong>
                          <span className="text-[10px] text-emerald-600 block font-bold">同比 {r.yoy} ↓</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-100 space-y-0.5">
                          <span className="text-[10px] text-slate-400 block font-sans">工业总产值</span>
                          <strong className="text-slate-800 text-sm block">{r.outputBillion.toFixed(2)} 亿元</strong>
                          <span className="text-[10px] text-slate-500 block font-sans truncate">
                            综合能耗: {r.energyTce.toLocaleString()} tce
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 明细表格 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-[#1677ff] rounded-full" />
                  <h3 className="text-xs font-bold text-slate-800">
                    {isGroupLevel
                      ? '各经营单位产值综合能耗明细'
                      : '各项目公司产值综合能耗明细'}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">报告期：2026年08月</span>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                      <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 w-12 text-center">序号</th>
                      <th className="py-2.5 px-3 sticky left-12 bg-slate-50 z-10 min-w-[140px]">
                        {isGroupLevel ? '经营单位' : '项目公司 / 制造车间'}
                      </th>
                      <th className="py-2.5 px-3 text-right">工业总产值 (亿元)</th>
                      <th className="py-2.5 px-3 text-right">综合能源消费 (tce)</th>
                      <th className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/40">
                        万元产值综合能耗 (tce/万元)
                      </th>
                      <th className="py-2.5 px-3 text-right">万元产值电耗 (kWh/万元)</th>
                      <th className="py-2.5 px-3 text-right">万元产值蒸汽 (t/万元)</th>
                      <th className="py-2.5 px-3 text-right">万元产值天然气 (m³/万元)</th>
                      <th className="py-2.5 px-3 text-center">同比</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                    {currentSubUnits.map((r, i) => (
                      <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2.5 px-3 sticky left-0 bg-white font-sans text-slate-400 text-center">
                          {String(i + 1).padStart(2, '0')}
                        </td>
                        <td className="py-2.5 px-3 sticky left-12 bg-white font-sans font-bold text-slate-900">
                          {r.name}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {r.outputBillion.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {r.energyTce.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#1677ff] bg-blue-50/30">
                          {r.unitOutputTce.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700">
                          {r.unitElec.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {r.unitSteam ? r.unitSteam.toFixed(2) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {r.unitGas ? r.unitGas.toFixed(2) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-emerald-600 font-bold font-mono">
                            {r.yoy} ↓
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* 项目公司 / 车间视角: 展示该项目公司的 12 个月历史明细台账 */
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#1677ff] rounded-full" />
                <h3 className="text-xs font-bold text-slate-800">
                  万元产值能耗历史明细台账
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">近 12 个月月度连续监测</span>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                    <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 w-24">时间月份</th>
                    <th className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/40">
                      万元产值综合能耗 (tce/万元)
                    </th>
                    <th className="py-2.5 px-3 text-right">万元产值电耗 (kWh/万元)</th>
                    <th className="py-2.5 px-3 text-right">万元产值蒸汽 (t/万元)</th>
                    <th className="py-2.5 px-3 text-right">万元产值天然气 (m³/万元)</th>
                    <th className="py-2.5 px-3 text-right">万元产值水耗 (t/万元)</th>
                    <th className="py-2.5 px-3 text-center">环比</th>
                    <th className="py-2.5 px-3 text-center">同比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                  {[...METRICS_TREND_DATABASE.tce['12months']].reverse().map((tceItem, idx) => {
                    const elecItem = METRICS_TREND_DATABASE.elec['12months'][11 - idx]
                    const steamItem = METRICS_TREND_DATABASE.steam['12months'][11 - idx]
                    const gasItem = METRICS_TREND_DATABASE.gas['12months'][11 - idx]
                    const waterItem = METRICS_TREND_DATABASE.water['12months'][11 - idx]

                    return (
                      <tr key={tceItem.period} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2.5 px-3 sticky left-0 bg-white font-sans font-bold text-slate-900">
                          {tceItem.period === '26-08' ? '2026年08月' : `20${tceItem.period.replace('-', '年')}月`}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#1677ff] bg-blue-50/30">
                          {tceItem.value.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-800">
                          {elecItem?.value.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {steamItem?.value.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {gasItem?.value.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {waterItem?.value.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={cn('font-bold', tceItem.mom?.startsWith('+') ? 'text-amber-600' : 'text-emerald-600')}>
                            {tceItem.mom}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-emerald-600 font-bold">
                            {tceItem.yoy} ↓
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

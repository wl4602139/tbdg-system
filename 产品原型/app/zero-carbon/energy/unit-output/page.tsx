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
import { getPeriodScaleFactor, getTimeDimensionLabel } from '@/components/shared/time-dimension-engine'
import { ExportButton } from '@/components/shared/primitives'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from 'recharts'

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
  mom?: string
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
    color: '#2C7CFF',
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
    color: '#2C7CFF',
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

  // 🌟 时间维度统一 (月度 / 季度 / 年度 / 自定义) 与所选时间范围 (与单位产品能耗完全一致)
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year' | 'custom'>('month')
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })

  // 趋势时间范围自动与顶部全局时间维度严格联动: 月度/自定义 -> 近12个月; 季度 -> 近12个季度; 年度 -> 近3年
  const trendTimeRange = useMemo<'12months' | '12quarters' | '3years'>(() => {
    if (timeDim === 'quarter') return '12quarters'
    if (timeDim === 'year') return '3years'
    return '12months'
  }, [timeDim])

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
    setSelectedMonthRange((prev) => {
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
    setSelectedMonthRange((prev) => {
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

  // 判断当前选中节点层级
  const isGroupLevel = selectedNode.level === 'group' || selectedNode.id === 'ent_root'
  const isCompanyLevel = selectedNode.level === 'company'
  const isProjectCompanyLevel = selectedNode.level === 'workshop' || (!isGroupLevel && !isCompanyLevel)

  // 🌟 产值能耗周期聚合与强度计算因子 (依据所选月度、季度、年度动态换算，实现时间控件实时联动数据明细)
  const outputSumScaleFactor = useMemo(() => {
    return getPeriodScaleFactor('sum', timeDim, {
      selectedMonth,
      selectedQuarter,
      selectedYear,
      selectedMonthRange,
    }, { basePeriod: 'month' })
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

  const outputIntensityFactor = useMemo(() => {
    if (timeDim === 'month') {
      const [y, m] = selectedMonth.split('-').map(Number)
      const yearDiff = (2026 - y) * 0.055 // 每年能耗降约 5.5%
      // 工业负荷月份微波动: 夏季(7,8)高温制冷用电高，冬季(12,1)采暖保供用能高，春秋(3,4,5,9,10)相对平稳
      const mWeight = {
        1: 0.035, 2: -0.015, 3: -0.020, 4: -0.018,
        5: -0.010, 6: 0.005, 7: 0.018, 8: 0.0,
        9: -0.012, 10: -0.016, 11: 0.008, 12: 0.030
      }
      return 1.0 + yearDiff + (mWeight[m] || 0)
    }
    if (timeDim === 'quarter') {
      const is2025 = selectedQuarter.startsWith('2025')
      const q = selectedQuarter.split('-')[1]
      const yearDiff = is2025 ? 0.055 : 0
      const qWeight = {
        'Q1': 0.028, // 冬季供暖
        'Q2': -0.015, // 春季平水
        'Q3': 0.008, // 夏季高温
        'Q4': 0.022, // 年末冲刺
      }
      return 1.0 + yearDiff + (qWeight[q] || 0)
    }
    if (timeDim === 'year') {
      if (selectedYear === '2024') return 1.105 // 2024能耗高 10.5%
      if (selectedYear === '2025') return 1.055 // 2025能耗高 5.5%
      return 1.002 // 2026年度
    }
    if (timeDim === 'custom') {
      const count = getMonthsCount(selectedMonthRange.start, selectedMonthRange.end)
      return 1.0 + (count > 6 ? 0.012 : -0.008)
    }
    return 1.0
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

  // 🌟 根据选中的组织节点动态构建该单位具备的能源介质万元产值能耗卡片列表
  const kpiMetrics = useMemo<UnitOutputKpiItem[]>(() => {
    const nodeName = selectedNode.name || ''
    const isCable = nodeName.includes('缆')
    const isGroup = isGroupLevel

    // 基础万元产值综合能耗 (叠加时间维度微波动)
    const rawTce = isGroup ? 0.0864 : (isCable ? 0.0872 : (nodeName.includes('衡变') ? 0.0872 : (nodeName.includes('新变') ? 0.0894 : 0.0844)))
    const baseTce = (rawTce * outputIntensityFactor).toFixed(4)
    const baseTceYoy = isGroup ? '-6.2%' : (isCable ? '-5.4%' : (nodeName.includes('衡变') ? '-5.4%' : (nodeName.includes('新变') ? '-5.2%' : '-6.7%')))

    // 万元产值电耗 (所有单位均有)
    const rawElec = isGroup ? 218.4 : (isCable ? 219.8 : (nodeName.includes('衡变') ? 219.0 : (nodeName.includes('新变') ? 224.8 : 212.5)))
    const baseElec = (rawElec * outputIntensityFactor).toFixed(1)
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
        color: '#2C7CFF',
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
        color: '#2C7CFF',
        icon: Zap,
      },
    ]

    // 蒸汽消耗
    if (isGroup || !isCable || nodeName.includes('变') || nodeName.includes('互感器')) {
      const rawSteam = isGroup ? 0.25 : (nodeName.includes('衡变') ? 0.26 : (nodeName.includes('新变') ? 0.22 : 0.28))
      const steamVal = (rawSteam * outputIntensityFactor).toFixed(2)
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

    // 天然气消耗
    if (isGroup || !nodeName.includes('德缆')) {
      const rawGas = isGroup ? 2.33 : (nodeName.includes('衡变') ? 2.10 : (nodeName.includes('新变') ? 2.45 : (isCable ? 1.60 : 1.85)))
      const gasVal = (rawGas * outputIntensityFactor).toFixed(2)
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
    const rawWater = isGroup ? 2.8 : (nodeName.includes('衡变') ? 3.1 : (nodeName.includes('新变') ? 2.9 : (isCable ? 2.5 : 2.8)))
    const waterVal = (rawWater * outputIntensityFactor).toFixed(1)
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
  }, [selectedNode, isGroupLevel, outputIntensityFactor])

  // 当前激活的指标元数据
  const activeMetricMeta = useMemo(() => {
    return METRICS_TREND_DATABASE[activeMetricKey] || METRICS_TREND_DATABASE.tce
  }, [activeMetricKey])

  // 🌟 当前层级下属单位列表 (集团页 ➔ 6家单位; 经营单位页 ➔ 其项目公司; 项目公司页 ➔ 无)
  const currentSubUnits = useMemo<SubUnitOutputRow[]>(() => {
    let baseList: SubUnitOutputRow[] = []
    if (isGroupLevel) {
      baseList = GROUP_SIX_COMPANIES_OUTPUT
    } else if (isCompanyLevel) {
      baseList = getCompanySubUnits(selectedNode.name)
    }
    return baseList.map((item) => {
      const outputVal = Number((item.outputBillion * outputSumScaleFactor).toFixed(2))
      const tceVal = Number((item.energyTce * outputSumScaleFactor).toFixed(1))
      const unitTce = Number((item.unitOutputTce * outputIntensityFactor).toFixed(4))
      const unitElec = Number((item.unitElec * outputIntensityFactor).toFixed(1))
      const unitSteam = item.unitSteam ? Number((item.unitSteam * outputIntensityFactor).toFixed(2)) : undefined
      const unitGas = item.unitGas ? Number((item.unitGas * outputIntensityFactor).toFixed(2)) : undefined
      const unitWater = item.unitWater ? Number((item.unitWater * outputIntensityFactor).toFixed(1)) : undefined

      // 同比指标随年份/维度动态更新
      let dynamicYoy = item.yoy
      if (timeDim === 'year') {
        if (selectedYear === '2025') dynamicYoy = '-5.1%'
        if (selectedYear === '2024') dynamicYoy = '-4.6%'
      } else if (timeDim === 'month' && selectedMonth === '2026-01') {
        dynamicYoy = '-5.8%'
      }

      return {
        ...item,
        outputBillion: outputVal,
        energyTce: tceVal,
        unitOutputTce: unitTce,
        unitElec,
        unitSteam,
        unitGas,
        unitWater,
        yoy: dynamicYoy,
      }
    })
  }, [isGroupLevel, isCompanyLevel, selectedNode.name, outputSumScaleFactor, outputIntensityFactor, timeDim, selectedYear, selectedMonth])

  // 🌟 趋势图表当前选中的数据源 (严格与 activeMetricKey 同步)
  const currentTrendData = useMemo(() => {
    const db = METRICS_TREND_DATABASE[activeMetricKey] || METRICS_TREND_DATABASE.tce
    return db[trendTimeRange] || db['12months']
  }, [activeMetricKey, trendTimeRange])

  // 最新期指标点
  const latestTrendPoint = useMemo(() => {
    return currentTrendData[currentTrendData.length - 1]
  }, [currentTrendData])

  // 🌟 项目公司 / 经营单位单位产值能耗柱状图对比数据
  const subUnitsBarData = useMemo(() => {
    return currentSubUnits.map((item) => {
      let val = item.unitOutputTce
      if (activeMetricKey === 'elec') val = item.unitElec
      else if (activeMetricKey === 'steam') val = item.unitSteam || 0
      else if (activeMetricKey === 'gas') val = item.unitGas || 0
      else if (activeMetricKey === 'water') val = item.unitWater || 0
      return {
        name: item.name,
        value: Number(val.toFixed(4)),
        unit: activeMetricMeta.unit,
        yoy: item.yoy,
        outputBillion: item.outputBillion,
      }
    })
  }, [currentSubUnits, activeMetricKey, activeMetricMeta])

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
        
        {/* 1. 顶部 Header 与 统一标准时间筛选 (参考用能监测标准高度 p-3.5 完全统一对齐) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-card p-3.5 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-[#2C7CFF] shrink-0">
              <TrendingUp className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800 dark:text-white">单位产值能耗</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 时间维度切换 (样式100%参照用能监测，保持原筛选条件不变) */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg text-sm font-sans">
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'month'
                    ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                月
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('quarter')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'quarter'
                    ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                季度
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('year')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'year'
                    ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                年
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('custom')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'custom'
                    ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                自定义
              </button>
            </div>

            {/* 时间范围选择控件 (随维度自适应切换，样式参照用能监测) */}
            {timeDim === 'month' && (
              <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 dark:text-white text-sm focus:outline-none cursor-pointer font-bold"
                  title="选择指定月份"
                />
              </div>
            )}

            {timeDim === 'quarter' && (
              <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 dark:text-white text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
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
              <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 dark:text-white text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="2026">2026 年度</option>
                  <option value="2025">2025 年度</option>
                  <option value="2024">2024 年度</option>
                </select>
              </div>
            )}

            {timeDim === 'custom' && (
              <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonthRange.start}
                  onChange={handleCustomStartMonthChange}
                  className="bg-transparent border-0 text-slate-800 dark:text-white text-sm focus:outline-none cursor-pointer font-bold"
                  title="开始月份 (最多选12个月)"
                />
                <span className="text-slate-400 font-sans">至</span>
                <input
                  type="month"
                  value={selectedMonthRange.end}
                  onChange={handleCustomEndMonthChange}
                  className="bg-transparent border-0 text-slate-800 dark:text-white text-sm focus:outline-none cursor-pointer font-bold"
                  title="结束月份 (最多选12个月)"
                />
              </div>
            )}

            <ExportButton onClick={() => alert(`正在导出【${selectedNode.name}】单位产值能耗分析报表 (Excel)...`)} />
          </div>
        </div>

        {/* 2. 核心能源介质万元产值能耗卡片 (点击卡片同步联动趋势图与数据) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                万元产值能耗
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
                    'p-3.5 rounded-lg border shadow-xs space-y-1.5 transition-all cursor-pointer relative select-none group',
                    isSelected
                      ? 'bg-gradient-to-br from-blue-50/95 via-white to-blue-50/40 dark:from-blue-950/60 dark:via-panel dark:to-blue-950/40 border-2 border-[#2C7CFF] ring-2 ring-[#2C7CFF]/20 shadow-sm scale-[1.01]'
                      : 'bg-white dark:bg-card border-slate-200 dark:border-border hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/60'
                  )}
                >
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-sans">
                    <span className={cn('font-bold flex items-center gap-1.5', isSelected ? 'text-[#2C7CFF]' : 'text-slate-800 dark:text-slate-200')}>
                      <IconComponent className={cn('size-3.5', isSelected ? 'text-[#2C7CFF]' : 'text-slate-500 dark:text-slate-400')} />
                      {m.name}
                    </span>
                    {isSelected && (
                      <span className="size-2 rounded-full bg-[#2C7CFF] animate-pulse" />
                    )}
                  </div>

                  <div className={cn('text-xl font-bold tracking-tight', isSelected ? 'text-[#2C7CFF]' : 'text-slate-900 dark:text-white')}>
                    {m.val} <span className="text-xs font-sans text-slate-500 font-normal">{m.unit}</span>
                  </div>

                  <div className="text-[11px] font-sans text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-border flex items-center justify-start">
                    <span>
                      同比: <strong className="text-emerald-600 font-mono font-bold">{m.yoy} ↓</strong>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. 经营单位万元产值变化趋势 (左) + 项目公司单位产值能耗柱状图对比 (右) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 左侧：经营单位万元产值变化趋势 */}
          <div className="bg-white dark:bg-card p-4 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  万元产值变化
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeMetricMeta.name} ({activeMetricMeta.unit})
              </span>
            </div>

            {/* 折线图渲染 */}
            <div className="h-[270px]">
              <LineTrend
                data={currentTrendData}
                xKey="period"
                height={270}
                lines={[
                  {
                    key: 'value',
                    name: `${activeMetricMeta.name} (${activeMetricMeta.unit})`,
                    color: activeMetricMeta.color || '#2C7CFF',
                  },
                ]}
              />
            </div>
          </div>

          {/* 右侧：项目公司单位产值能耗柱状图对比 */}
          <div className="bg-white dark:bg-card p-4 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  产值能耗对比
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {subUnitsBarData.length} 家对比单位
              </span>
            </div>

            {/* 柱状对比图 */}
            <div className="h-[270px]">
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={subUnitsBarData} margin={{ top: 20, right: 25, left: -10, bottom: 5 }} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="stroke-slate-100 dark:stroke-slate-800" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-slate-600 dark:text-slate-300"
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  {/* 左轴：产值能耗 */}
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fill: 'currentColor', fontSize: 11, fontFamily: 'monospace' }}
                    className="text-slate-500 dark:text-slate-400"
                    axisLine={false}
                    tickLine={false}
                    unit={` ${activeMetricMeta.unit.split('/')[0]}`}
                  />
                  {/* 右轴：工业总产值 */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: 'currentColor', fontSize: 11, fontFamily: 'monospace' }}
                    className="text-slate-500 dark:text-slate-400"
                    axisLine={false}
                    tickLine={false}
                    unit=" 亿"
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white/95 dark:bg-panel/95 backdrop-blur-sm p-2.5 rounded-lg border border-slate-200 dark:border-border shadow-lg text-xs space-y-1.5 font-sans">
                            <div className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-border pb-1">{data.name}</div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                <span className="size-2 rounded-full bg-[#2C7CFF]" />
                                产值能耗:
                              </span>
                              <span className="font-mono font-bold text-[#2C7CFF]">
                                {data.value} {data.unit}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                <span className="size-2 rounded-full bg-[#FFBA00]" />
                                工业总产值:
                              </span>
                              <span className="font-mono font-bold text-amber-600">
                                {data.outputBillion} 亿元
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100 dark:border-border text-[11px]">
                              <span className="text-slate-500 dark:text-slate-400">同比:</span>
                              <span className="font-mono font-bold text-emerald-600">
                                {data.yoy} ↓
                              </span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                  <Bar
                    yAxisId="left"
                    dataKey="value"
                    name={`产值能耗 (${activeMetricMeta.unit})`}
                    fill="#2C7CFF"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="outputBillion"
                    name="工业总产值 (亿元)"
                    fill="#FFBA00"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 4. 下级单位对比展示 (集团页 ➔ 6家单位; 经营单位页 ➔ 下属项目公司; 项目公司页 ➔ 历史明细台账) */}
        {isGroupLevel || isCompanyLevel ? (
          <div className="space-y-6">
            {/* 卡片网格 */}
            <div className="p-4 bg-white dark:bg-card rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    单位产值能耗
                  </h3>
                </div>
              </div>

              <div className={cn(
                'grid gap-3.5',
                currentSubUnits.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              )}>
                {currentSubUnits.map((r) => {
                  // 根据 activeMetricKey 动态展现子单位在该介质下的数值
                  let activeValNum = r.unitOutputTce.toFixed(4)
                  let activeValUnit = 'tce/万元'
                  let activeValLabel = '万元产值综合能耗'
                  if (activeMetricKey === 'elec') {
                    activeValNum = r.unitElec.toFixed(1)
                    activeValUnit = 'kWh/万元'
                    activeValLabel = '万元产值电耗'
                  } else if (activeMetricKey === 'steam') {
                    activeValNum = r.unitSteam ? r.unitSteam.toFixed(2) : '-'
                    activeValUnit = r.unitSteam ? 't/万元' : ''
                    activeValLabel = '万元产值蒸汽耗'
                  } else if (activeMetricKey === 'gas') {
                    activeValNum = r.unitGas ? r.unitGas.toFixed(2) : '-'
                    activeValUnit = r.unitGas ? 'm³/万元' : ''
                    activeValLabel = '万元产值天然气耗'
                  } else if (activeMetricKey === 'water') {
                    activeValNum = r.unitWater ? r.unitWater.toFixed(1) : '-'
                    activeValUnit = r.unitWater ? 't/万元' : ''
                    activeValLabel = '万元产值水耗'
                  }

                  return (
                    <div
                      key={r.id}
                      className="p-4 rounded-lg border border-[#DBE6EE] dark:border-border bg-white dark:bg-card hover:border-[#2C7CFF] dark:hover:border-[#2C7CFF] hover:shadow-xs transition-all space-y-3 group select-none"
                    >
                      {/* 顶部标题行：公司名称与产业分类 */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-border">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="size-2 rounded-full bg-[#2C7CFF] shrink-0" />
                          <span className="font-bold text-sm text-slate-800 dark:text-white font-sans truncate">
                            {r.name}
                          </span>
                        </div>
                        {r.industry && (
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-sans font-normal shrink-0">
                            {r.industry}
                          </span>
                        )}
                      </div>

                      {/* 卡片主体：双列清晰布局（左侧单耗主值与左下角同比，右侧产值与综合能耗基准） */}
                      <div className="grid grid-cols-12 gap-3 items-stretch">
                        {/* 左侧 7 列：主指标与左下角同比 */}
                        <div className="col-span-7 flex flex-col justify-between space-y-2">
                          <div className="space-y-0.5">
                            <span className="text-xs text-slate-400 dark:text-slate-400 block font-sans truncate" title={activeValLabel}>
                              {activeValLabel}
                            </span>
                            <div className="flex items-baseline gap-1 font-mono">
                              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#2C7CFF] transition-colors">
                                {activeValNum}
                              </span>
                              {activeValUnit && (
                                <span className="text-xs font-normal text-slate-500 font-sans">
                                  {activeValUnit}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* 🌟 严格放置于卡片左下角的同比数据 */}
                          <div className="text-xs font-sans text-slate-500 dark:text-slate-400 pt-1">
                            同比: <strong className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{r.yoy} ↓</strong>
                          </div>
                        </div>

                        {/* 右侧 5 列：支撑基准数据（工业总产值 + 综合能耗） */}
                        <div className="col-span-5 border-l border-slate-100 dark:border-border pl-3 flex flex-col justify-between space-y-2 py-0.5">
                          <div className="space-y-0.5">
                            <span className="text-[11px] text-slate-400 dark:text-slate-400 block font-sans">
                              工业总产值
                            </span>
                            <div className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                              {r.outputBillion.toFixed(2)} <span className="font-normal font-sans text-[11px] text-slate-500">亿元</span>
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[11px] text-slate-400 dark:text-slate-400 block font-sans">
                              综合能耗
                            </span>
                            <div className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                              {r.energyTce.toLocaleString()} <span className="font-normal font-sans text-[11px] text-slate-500">tce</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 明细表格：字段与上方 5 大单耗指标卡片完全对应（无多余高亮） */}
            <div className="bg-white dark:bg-card rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between bg-[#fafbfc] dark:bg-panel">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    万元产值能耗
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-panel text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-border font-bold font-sans select-none h-[44px]">
                      <th className="py-2.5 px-3 sticky left-0 bg-slate-50 dark:bg-panel z-10 w-12 text-center">序号</th>
                      <th className="py-2.5 px-3 sticky left-12 bg-slate-50 dark:bg-panel z-10 min-w-[130px]">
                        {isGroupLevel ? '经营单位' : '项目公司 / 制造车间'}
                      </th>
                      <th className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200">
                        万元产值综合能耗 (tce/万元)
                      </th>
                      <th className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                        万元产值电耗 (kWh/万元)
                      </th>
                      <th className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                        万元产值蒸汽消耗 (t/万元)
                      </th>
                      <th className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                        万元产值天然气消耗 (m³/万元)
                      </th>
                      <th className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                        万元产值水耗 (t/万元)
                      </th>
                      <th className="py-2.5 px-3 text-center">同比</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 text-[11.5px]">
                    {currentSubUnits.map((r, i) => (
                      <tr key={r.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors h-[44px]">
                        <td className="py-2.5 px-3 sticky left-0 bg-white dark:bg-card font-sans text-slate-400 dark:text-slate-500 text-center">
                          {String(i + 1).padStart(2, '0')}
                        </td>
                        <td className="py-2.5 px-3 sticky left-12 bg-white dark:bg-card font-sans font-bold text-slate-900 dark:text-white">
                          {r.name}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                          {r.unitOutputTce.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                          {r.unitElec.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                          {r.unitSteam ? r.unitSteam.toFixed(2) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                          {r.unitGas ? r.unitGas.toFixed(2) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                          {r.unitWater ? r.unitWater.toFixed(1) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-emerald-600 font-bold">
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
          <div className="bg-white dark:bg-card rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs overflow-hidden flex flex-col">
            <div className="p-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between bg-[#fafbfc] dark:bg-panel">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  万元产值能耗
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-panel text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-border font-bold font-sans select-none h-[44px]">
                    <th className="py-2.5 px-3 sticky left-0 bg-slate-50 dark:bg-panel z-10 w-24">时间周期</th>
                    <th className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200">
                      万元产值综合能耗 (tce/万元)
                    </th>
                    <th className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                      万元产值电耗 (kWh/万元)
                    </th>
                    <th className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                      万元产值蒸汽消耗 (t/万元)
                    </th>
                    <th className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                      万元产值天然气消耗 (m³/万元)
                    </th>
                    <th className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                      万元产值水耗 (t/万元)
                    </th>
                    <th className="py-2.5 px-3 text-center">同比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 text-[11.5px]">
                  {[...METRICS_TREND_DATABASE.tce[trendTimeRange] || METRICS_TREND_DATABASE.tce['12months']].reverse().map((tceItem, idx, arr) => {
                    const revIdx = arr.length - 1 - idx
                    const elecItem = (METRICS_TREND_DATABASE.elec[trendTimeRange] || METRICS_TREND_DATABASE.elec['12months'])[revIdx]
                    const steamItem = (METRICS_TREND_DATABASE.steam[trendTimeRange] || METRICS_TREND_DATABASE.steam['12months'])[revIdx]
                    const gasItem = (METRICS_TREND_DATABASE.gas[trendTimeRange] || METRICS_TREND_DATABASE.gas['12months'])[revIdx]
                    const waterItem = (METRICS_TREND_DATABASE.water[trendTimeRange] || METRICS_TREND_DATABASE.water['12months'])[revIdx]

                    return (
                      <tr key={tceItem.period} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors h-[44px]">
                        <td className="py-2.5 px-3 sticky left-0 bg-white dark:bg-card font-sans font-bold text-slate-900 dark:text-white">
                          {tceItem.period.includes('-') && !tceItem.period.includes('Q') ? `20${tceItem.period.replace('-', '年')}月` : tceItem.period}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                          {tceItem.value.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                          {elecItem ? elecItem.value.toFixed(1) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                          {steamItem ? steamItem.value.toFixed(2) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                          {gasItem ? gasItem.value.toFixed(2) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                          {waterItem ? waterItem.value.toFixed(1) : '-'}
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

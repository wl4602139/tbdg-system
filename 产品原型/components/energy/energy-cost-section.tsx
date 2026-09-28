'use client'

import React, { useState, useMemo } from 'react'
import {
  Coins,
  Zap,
  Flame,
  Wind,
  Fuel,
  Snowflake,
  Droplets,
  PieChart as PieChartIcon,
  BarChart3,
  Factory,
  ChevronRight,
  Info,
} from 'lucide-react'
import { type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { ExportButton } from '@/components/shared/primitives'
import { BarChartGroup } from '@/components/shared/charts'
import { getPeriodScaleFactor } from '@/components/shared/time-dimension-engine'
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

export const COST_METRICS_META: Record<CostMetricKey, CostMetricMeta> = {
  totalCost: {
    key: 'totalCost',
    name: '总用能成本',
    shortName: '总用能成本',
    unit: '万元',
    color: '#059669',
    description: '全厂区所有能源介质外购与消费总支出',
  },
  gridElecCost: {
    key: 'gridElecCost',
    name: '电（市电+绿证）',
    shortName: '电（市电+绿证）',
    unit: '万元',
    color: '#41C0FF',
    description: '从公共电网外购结算的电力总费用',
  },
  gasCost: {
    key: 'gasCost',
    name: '天然气',
    shortName: '天然气',
    unit: '万元',
    color: '#FF6536',
    description: '管道天然气用气采购与燃料支出',
  },
  steamCost: {
    key: 'steamCost',
    name: '外购蒸汽',
    shortName: '外购蒸汽',
    unit: '万元',
    color: '#FFBA00',
    description: '工业园区集中供热与工艺外购蒸汽费用',
  },
  oilCost: {
    key: 'oilCost',
    name: '油',
    shortName: '油',
    unit: '万元',
    color: '#8E73ED',
    description: '厂区物流运输车辆及发电机柴汽油消费',
  },
  nitrogenCost: {
    key: 'nitrogenCost',
    name: '氮气',
    shortName: '氮气',
    unit: '万元',
    color: '#4F39F6',
    description: '特种绝缘干燥与工艺惰化液氮采购支出',
  },
  waterCost: {
    key: 'waterCost',
    name: '水',
    shortName: '水',
    unit: '万元',
    color: '#10C4CE',
    description: '生产循环水与生活辅助用水费用',
  },
}

// 6 家直属经营单位能源成本数据字典 (单位：万元)
export interface CompanyCostData {
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

export const SIX_COMPANIES_COST: CompanyCostData[] = [
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

// 🏢 各 2 级经营公司下属 3 级单位 (车间/项目公司) 成本数据字典
export const COMPANY_SUB_UNITS_COST: Record<string, CompanyCostData[]> = {
  '沈变公司': [
    { id: 'ws_sb_main', name: '沈变本部', fullName: '沈变本部（特高压制造车间）', province: '辽宁省 (沈阳)', totalCost: 420.0, gridElecCost: 335.0, gasCost: 55.0, steamCost: 22.0, oilCost: 8.0, nitrogenCost: 0, waterCost: 2.8, elecRatio: 79.8, yoyTrend: -3.5 },
    { id: 'ws_sb_luna', name: '露娜公司', fullName: '特变电工露娜智能电气有限公司', province: '天津市 (武清)', totalCost: 120.0, gridElecCost: 95.0, gasCost: 15.0, steamCost: 6.0, oilCost: 2.5, nitrogenCost: 0, waterCost: 0.8, elecRatio: 79.2, yoyTrend: -2.8 },
    { id: 'ws_sb_hx', name: '和新套管公司', fullName: '沈变和新高压套管车间', province: '辽宁省 (沈阳)', totalCost: 65.0, gridElecCost: 52.0, gasCost: 8.0, steamCost: 3.0, oilCost: 1.5, nitrogenCost: 0, waterCost: 0.5, elecRatio: 80.0, yoyTrend: -3.0 },
    { id: 'ws_sb_kj', name: '康嘉互感器', fullName: '沈变康嘉互感器制造车间', province: '辽宁省 (沈阳)', totalCost: 55.0, gridElecCost: 43.5, gasCost: 7.0, steamCost: 2.5, oilCost: 1.5, nitrogenCost: 0, waterCost: 0.5, elecRatio: 79.1, yoyTrend: -2.5 },
    { id: 'ws_sb_yn', name: '印能公司', fullName: '沈变印能绝缘材料车间', province: '辽宁省 (沈阳)', totalCost: 30.0, gridElecCost: 21.5, gasCost: 4.0, steamCost: 1.5, oilCost: 1.0, nitrogenCost: 0, waterCost: 0.4, elecRatio: 71.7, yoyTrend: -2.0 },
  ],
  '衡变公司': [
    { id: 'ws_hb_main', name: '衡变本部', fullName: '衡变本部（高压变压器车间）', province: '湖南省 (衡阳)', totalCost: 320.0, gridElecCost: 253.0, gasCost: 40.0, steamCost: 16.0, oilCost: 6.5, nitrogenCost: 0, waterCost: 2.0, elecRatio: 79.1, yoyTrend: -3.1 },
    { id: 'ws_hb_nj', name: '南京电研', fullName: '南京电气自动化研发基地', province: '江苏省 (南京)', totalCost: 85.0, gridElecCost: 67.5, gasCost: 10.5, steamCost: 4.0, oilCost: 1.8, nitrogenCost: 0, waterCost: 0.5, elecRatio: 79.4, yoyTrend: -2.9 },
    { id: 'ws_hb_yj', name: '云集电气', fullName: '衡变云集电气成套车间', province: '湖南省 (衡阳)', totalCost: 62.0, gridElecCost: 49.0, gasCost: 8.0, steamCost: 3.0, oilCost: 1.2, nitrogenCost: 0, waterCost: 0.4, elecRatio: 79.0, yoyTrend: -2.5 },
    { id: 'ws_hb_hn', name: '湖南电气', fullName: '湖南智能输配电设备制造', province: '湖南省 (衡阳)', totalCost: 58.0, gridElecCost: 46.0, gasCost: 7.0, steamCost: 3.0, oilCost: 1.2, nitrogenCost: 0, waterCost: 0.4, elecRatio: 79.3, yoyTrend: -2.6 },
    { id: 'ws_hb_kg', name: '云集高压开关', fullName: '云集GIS高压开关制造', province: '湖南省 (衡阳)', totalCost: 45.0, gridElecCost: 35.5, gasCost: 6.0, steamCost: 2.0, oilCost: 1.0, nitrogenCost: 0, waterCost: 0.3, elecRatio: 78.9, yoyTrend: -2.4 },
    { id: 'ws_hb_xj', name: '新疆自控', fullName: '新疆自控系统车间', province: '新疆 (昌吉)', totalCost: 35.0, gridElecCost: 27.5, gasCost: 4.5, steamCost: 1.8, oilCost: 0.8, nitrogenCost: 0, waterCost: 0.2, elecRatio: 78.6, yoyTrend: -2.1 },
    { id: 'ws_hb_sk', name: '上开', fullName: '上海开关制造车间', province: '上海市', totalCost: 25.0, gridElecCost: 20.0, gasCost: 3.0, steamCost: 1.2, oilCost: 0.5, nitrogenCost: 0, waterCost: 0.15, elecRatio: 80.0, yoyTrend: -1.8 },
    { id: 'ws_hb_kbe', name: '柯贝尔', fullName: '柯贝尔绝缘器件制造', province: '湖南省 (衡阳)', totalCost: 20.0, gridElecCost: 16.0, gasCost: 2.5, steamCost: 1.0, oilCost: 0.4, nitrogenCost: 0, waterCost: 0.12, elecRatio: 80.0, yoyTrend: -2.0 },
    { id: 'ws_hb_tnj', name: '特能建', fullName: '特能建电力工程集成', province: '湖南省 (衡阳)', totalCost: 15.0, gridElecCost: 12.0, gasCost: 2.0, steamCost: 0.7, oilCost: 0.3, nitrogenCost: 0, waterCost: 0.1, elecRatio: 80.0, yoyTrend: -3.0 },
    { id: 'ws_hb_hr', name: '合容电气', fullName: '合容电气电容补偿车间', province: '湖南省 (衡阳)', totalCost: 12.0, gridElecCost: 9.5, gasCost: 1.5, steamCost: 0.6, oilCost: 0.3, nitrogenCost: 0, waterCost: 0.08, elecRatio: 79.2, yoyTrend: -2.2 },
    { id: 'ws_hb_gil', name: '赛杰爱迪', fullName: '赛杰爱迪GIL管线车间', province: '湖南省 (衡阳)', totalCost: 8.0, gridElecCost: 6.0, gasCost: 1.0, steamCost: 0.7, oilCost: 0.3, nitrogenCost: 0, waterCost: 0.05, elecRatio: 75.0, yoyTrend: -1.5 },
  ],
  '新变厂': [
    { id: 'ws_xb_uhv', name: '超高压公司', fullName: '新变超高压变压器车间', province: '新疆 (昌吉)', totalCost: 280.0, gridElecCost: 223.0, gasCost: 35.0, steamCost: 14.0, oilCost: 6.0, nitrogenCost: 0, waterCost: 1.8, elecRatio: 79.6, yoyTrend: -3.8 },
    { id: 'ws_xb_tb', name: '天变公司', fullName: '天津变压器制造基地', province: '天津市 (静海)', totalCost: 110.0, gridElecCost: 87.5, gasCost: 14.0, steamCost: 5.5, oilCost: 2.3, nitrogenCost: 0, waterCost: 0.7, elecRatio: 79.5, yoyTrend: -3.4 },
    { id: 'ws_xb_zndq', name: '智能电气公司', fullName: '新变智能电气制造车间', province: '新疆 (昌吉)', totalCost: 80.0, gridElecCost: 63.5, gasCost: 10.0, steamCost: 4.2, oilCost: 1.7, nitrogenCost: 0, waterCost: 0.5, elecRatio: 79.4, yoyTrend: -3.2 },
    { id: 'ws_xb_jjj', name: '京津冀公司', fullName: '京津冀变压器集成车间', province: '天津市 (武清)', totalCost: 55.0, gridElecCost: 44.0, gasCost: 7.0, steamCost: 2.8, oilCost: 1.2, nitrogenCost: 0, waterCost: 0.4, elecRatio: 80.0, yoyTrend: -3.0 },
    { id: 'ws_xb_zf', name: '珠峰硅钢', fullName: '珠峰硅钢深加工车间', province: '新疆 (昌吉)', totalCost: 35.2, gridElecCost: 28.0, gasCost: 4.5, steamCost: 1.8, oilCost: 0.7, nitrogenCost: 0, waterCost: 0.2, elecRatio: 79.5, yoyTrend: -2.8 },
    { id: 'ws_xb_yl', name: '银利电气', fullName: '银利电气电磁线车间', province: '新疆 (昌吉)', totalCost: 12.0, gridElecCost: 9.5, gasCost: 1.3, steamCost: 0.8, oilCost: 0.2, nitrogenCost: 0, waterCost: 0.08, elecRatio: 79.2, yoyTrend: -2.5 },
  ],
  '鲁缆公司': [
    { id: 'ws_ll_main', name: '鲁缆本部', fullName: '鲁能泰山高压电缆车间', province: '山东省 (新泰)', totalCost: 260.0, gridElecCost: 209.0, gasCost: 32.0, steamCost: 13.0, oilCost: 5.0, nitrogenCost: 0, waterCost: 1.6, elecRatio: 80.4, yoyTrend: -2.1 },
    { id: 'ws_ll_zl', name: '智缆公司', fullName: '智缆特种电缆车间', province: '山东省 (新泰)', totalCost: 75.0, gridElecCost: 60.0, gasCost: 9.5, steamCost: 3.8, oilCost: 1.5, nitrogenCost: 0, waterCost: 0.5, elecRatio: 80.0, yoyTrend: -1.8 },
    { id: 'ws_ll_sw', name: '昭和公司', fullName: '昭和铝包钢制造车间', province: '山东省 (新泰)', totalCost: 50.8, gridElecCost: 41.0, gasCost: 6.0, steamCost: 2.5, oilCost: 1.0, nitrogenCost: 0, waterCost: 0.3, elecRatio: 80.7, yoyTrend: -1.6 },
    { id: 'ws_ll_sg', name: '曙光公司', fullName: '曙光电力金具车间', province: '山东省 (新泰)', totalCost: 35.0, gridElecCost: 28.0, gasCost: 4.5, steamCost: 1.7, oilCost: 0.5, nitrogenCost: 0, waterCost: 0.2, elecRatio: 80.0, yoyTrend: -1.5 },
  ],
  '新缆厂': [
    { id: 'ws_xl_main', name: '特变电工新疆电缆有限公司', fullName: '新疆电缆高压制造车间', province: '新疆 (乌鲁木齐)', totalCost: 200.0, gridElecCost: 168.0, gasCost: 20.0, steamCost: 7.0, oilCost: 3.5, nitrogenCost: 0, waterCost: 0.9, elecRatio: 84.0, yoyTrend: -2.6 },
    { id: 'ws_xl_sub', name: '特变电工新疆线缆厂', fullName: '新疆线缆民用线缆车间', province: '新疆 (乌鲁木齐)', totalCost: 112.0, gridElecCost: 94.0, gasCost: 12.0, steamCost: 3.0, oilCost: 1.5, nitrogenCost: 0, waterCost: 0.5, elecRatio: 83.9, yoyTrend: -2.0 },
  ],
  '德缆公司': [
    { id: 'ws_dl_main', name: '特变电工（德阳）电缆股份有限公司', fullName: '德阳电缆制造主体车间', province: '四川省 (德阳)', totalCost: 360.5, gridElecCost: 265.0, gasCost: 43.0, steamCost: 14.5, oilCost: 6.5, nitrogenCost: 36.0, waterCost: 1.8, elecRatio: 73.5, yoyTrend: -4.1 },
  ],
}

// 全集团汇总成本数据
export const GROUP_SUMMARY_COST: CompanyCostData = {
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

// 极坐标转换辅助计算函数 (用于南丁格尔玫瑰图，控制精度以避免 SSR 与客户端浮点微差导致的 Hydration Mismatch)
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  const x = centerX + radius * Math.cos(angleInRadians)
  const y = centerY + radius * Math.sin(angleInRadians)
  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
  }
}

function describeRoseSector(x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
  const rOut = Number(outerRadius.toFixed(2))
  const rIn = Number(innerRadius.toFixed(2))
  const startOuter = polarToCartesian(x, y, rOut, endAngle)
  const endOuter = polarToCartesian(x, y, rOut, startAngle)
  const startInner = polarToCartesian(x, y, rIn, startAngle)
  const endInner = polarToCartesian(x, y, rIn, endAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return [
    'M', startOuter.x, startOuter.y,
    'A', rOut, rOut, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    'L', startInner.x, startInner.y,
    'A', rIn, rIn, 0, largeArcFlag, 1, endInner.x, endInner.y,
    'Z',
  ].join(' ')
}

export interface EnergyCostSectionProps {
  selectedOrgNode: StandardOrgNode
  timeDim: 'month' | 'quarter' | 'year' | 'custom'
  selectedMonth: string
  selectedQuarter: string
  selectedYear: string
  selectedMonthRange: { start: string; end: string }
  onSelectOrgNode?: (node: StandardOrgNode) => void
}

export function EnergyCostSection({
  selectedOrgNode,
  timeDim,
  selectedMonth,
  selectedQuarter,
  selectedYear,
  selectedMonthRange,
  onSelectOrgNode,
}: EnergyCostSectionProps) {
  // 6家直属经营单位南丁格尔玫瑰图悬浮项
  const [hoveredUnitRose, setHoveredUnitRose] = useState<string | null>(null)

  // 🌟 当前选中的成本数据项 (驱动 6 家单位占电装总费用比重：饼图 + 柱状图)
  const [selectedMetricKey, setSelectedMetricKey] = useState<CostMetricKey>('totalCost')

  // 南丁格尔玫瑰图悬浮扇区
  const [activeHoverSector, setActiveHoverSector] = useState<string | null>(null)

  // 判断是否处于集团层级 (1级节点)
  const isGroupLevel = useMemo(() => {
    return (
      selectedOrgNode.id === 'ent_root' ||
      selectedOrgNode.id === 'group_root' ||
      selectedOrgNode.level === 'group' ||
      selectedOrgNode.name.includes('电装集团')
    )
  }, [selectedOrgNode])

  // 判断是否是车间/项目公司级 (3级节点)
  const isWorkshopLevel = useMemo(() => {
    return selectedOrgNode.level === 'workshop'
  }, [selectedOrgNode])

  // 🌟 能源成本周期缩放因子 (依据单月份、季度、年度或自定义区间自动计算累计倍率)
  const costScaleFactor = useMemo(() => {
    return getPeriodScaleFactor(
      'sum',
      timeDim,
      {
        selectedMonth,
        selectedQuarter,
        selectedYear,
        selectedMonthRange,
      },
      { basePeriod: 'monthRange8' }
    )
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

  // 🌟 当前层级展示的下级单位数据列表 (选1级集团节点 ➔ 6家2级经营公司; 选2级经营公司节点 ➔ 其下属3级车间/项目公司)
  const currentLevelUnits = useMemo<CompanyCostData[]>(() => {
    if (isGroupLevel) {
      return SIX_COMPANIES_COST
    }
    const matchedKey = Object.keys(COMPANY_SUB_UNITS_COST).find(
      (k) => selectedOrgNode.name.includes(k) || k.includes(selectedOrgNode.name.slice(0, 2))
    )
    if (matchedKey && COMPANY_SUB_UNITS_COST[matchedKey]) {
      return COMPANY_SUB_UNITS_COST[matchedKey]
    }
    return SIX_COMPANIES_COST
  }, [isGroupLevel, selectedOrgNode.name])

  // 当前选中的公司数据
  const currentCompanyCost = useMemo(() => {
    if (isGroupLevel) return GROUP_SUMMARY_COST
    const found = SIX_COMPANIES_COST.find(
      (c) =>
        c.id === selectedOrgNode.id ||
        c.name === selectedOrgNode.name ||
        selectedOrgNode.name.includes(c.name.slice(0, 2))
    )
    return found || SIX_COMPANIES_COST[0]
  }, [isGroupLevel, selectedOrgNode])

  // 1. 计算当前单位列表在当前选中成本指标下的数值与占比 (用于饼图与柱状图)
  const metricCompanyBreakdown = useMemo(() => {
    const list = currentLevelUnits
    const totalVal = Number(
      (
        list.reduce((sum, c) => sum + (c[selectedMetricKey] as number), 0) * costScaleFactor
      ).toFixed(1)
    )
    const unit = COST_METRICS_META[selectedMetricKey].unit

    const donutData = list.map((c, i) => {
      const val = Number(((c[selectedMetricKey] as number) * costScaleFactor).toFixed(1))
      const ratio = totalVal > 0 ? Number(((val / totalVal) * 100).toFixed(1)) : 0
      const colors = [
        '#2C7CFF',
        '#10b981',
        '#f59e0b',
        '#8b5cf6',
        '#06b6d4',
        '#ec4899',
        '#3b82f6',
        '#14b8a6',
        '#f97316',
        '#6366f1',
        '#84cc16',
      ]
      return {
        name: c.name,
        value: val,
        ratio,
        color: colors[i % colors.length],
        unit,
      }
    })

    const barData = list.map((c) => {
      const val = Number(((c[selectedMetricKey] as number) * costScaleFactor).toFixed(1))
      const ratio = totalVal > 0 ? Number(((val / totalVal) * 100).toFixed(1)) : 0
      return {
        name: c.name,
        成本费用: val,
        占比: ratio,
      }
    })

    return { totalVal, donutData, barData, unit }
  }, [currentLevelUnits, selectedMetricKey, costScaleFactor])

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

  // 🌟 3. 能源成本明细台账数据模型 (对应上方各能源成本指标，随时间维度动态切片计算，求和严格等于上方卡片数据)
  const costLedgerData = useMemo(() => {
    const targetTotalCost = activeData.totalCost
    const targetGridElecCost = activeData.gridElecCost
    const targetGasCost = activeData.gasCost
    const targetSteamCost = activeData.steamCost
    const targetOilCost = activeData.oilCost
    const targetNitrogenCost = activeData.nitrogenCost
    const targetWaterCost = activeData.waterCost

    if (timeDim === 'month') {
      const [yearStr, monthStr] = (selectedMonth || '2026-08').split('-')
      const year = Number(yearStr) || 2026
      const month = Number(monthStr) || 8
      const daysInMonth = new Date(year, month, 0).getDate()

      const weights: number[] = []
      for (let d = 1; d <= daysInMonth; d++) {
        const dayOfWeek = new Date(year, month - 1, d).getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const w = isWeekend ? 0.82 : 1.04 + ((d * 3 + month * 5) % 9) * 0.012
        weights.push(w)
      }
      const totalWeight = weights.reduce((a, b) => a + b, 0)

      let sumTotal = 0
      let sumGrid = 0
      let sumGas = 0
      let sumSteam = 0
      let sumOil = 0
      let sumNitrogen = 0
      let sumWater = 0

      const dayList: Array<{
        date: string
        totalCost: number
        gridElecCost: number
        gasCost: number
        steamCost: number
        oilCost: number
        nitrogenCost: number
        waterCost: number
      }> = []

      for (let d = 1; d <= daysInMonth; d++) {
        const dStr = String(d).padStart(2, '0')
        const idx = d - 1
        const isLast = d === daysInMonth
        const w = weights[idx] / totalWeight

        const tot = isLast
          ? Number((targetTotalCost - sumTotal).toFixed(2))
          : Number((targetTotalCost * w).toFixed(2))
        const grid = isLast
          ? Number((targetGridElecCost - sumGrid).toFixed(2))
          : Number((targetGridElecCost * w).toFixed(2))
        const gas = isLast
          ? Number((targetGasCost - sumGas).toFixed(2))
          : Number((targetGasCost * w).toFixed(2))
        const steam = isLast
          ? Number((targetSteamCost - sumSteam).toFixed(2))
          : Number((targetSteamCost * w).toFixed(2))
        const oil = isLast
          ? Number((targetOilCost - sumOil).toFixed(2))
          : Number((targetOilCost * w).toFixed(2))
        const nitrogen = isLast
          ? Number((targetNitrogenCost - sumNitrogen).toFixed(2))
          : Number((targetNitrogenCost * w).toFixed(2))
        const water = isLast
          ? Number((targetWaterCost - sumWater).toFixed(2))
          : Number((targetWaterCost * w).toFixed(2))

        sumTotal += tot
        sumGrid += grid
        sumGas += gas
        sumSteam += steam
        sumOil += oil
        sumNitrogen += nitrogen
        sumWater += water

        dayList.push({
          date: `${year}-${String(month).padStart(2, '0')}-${dStr}`,
          totalCost: tot,
          gridElecCost: grid,
          gasCost: gas,
          steamCost: steam,
          oilCost: oil,
          nitrogenCost: nitrogen,
          waterCost: water,
        })
      }

      return dayList.reverse()
    } else if (timeDim === 'quarter') {
      const quarterMap: Record<string, string[]> = {
        '2026-Q1': ['2026-01', '2026-02', '2026-03'],
        '2026-Q2': ['2026-04', '2026-05', '2026-06'],
        '2026-Q3': ['2026-07', '2026-08', '2026-09'],
        '2026-Q4': ['2026-10', '2026-11', '2026-12'],
        '2025-Q4': ['2025-10', '2025-11', '2025-12'],
      }
      const months = quarterMap[selectedQuarter] || ['2026-07', '2026-08', '2026-09']
      const qWeights = [0.33, 0.35, 0.32]

      let sumTotal = 0
      let sumGrid = 0
      let sumGas = 0
      let sumSteam = 0
      let sumOil = 0
      let sumNitrogen = 0
      let sumWater = 0

      const monthList = months.map((ym, idx) => {
        const isLast = idx === months.length - 1
        const w = qWeights[idx] || 1 / months.length

        const tot = isLast
          ? Number((targetTotalCost - sumTotal).toFixed(2))
          : Number((targetTotalCost * w).toFixed(2))
        const grid = isLast
          ? Number((targetGridElecCost - sumGrid).toFixed(2))
          : Number((targetGridElecCost * w).toFixed(2))
        const gas = isLast
          ? Number((targetGasCost - sumGas).toFixed(2))
          : Number((targetGasCost * w).toFixed(2))
        const steam = isLast
          ? Number((targetSteamCost - sumSteam).toFixed(2))
          : Number((targetSteamCost * w).toFixed(2))
        const oil = isLast
          ? Number((targetOilCost - sumOil).toFixed(2))
          : Number((targetOilCost * w).toFixed(2))
        const nitrogen = isLast
          ? Number((targetNitrogenCost - sumNitrogen).toFixed(2))
          : Number((targetNitrogenCost * w).toFixed(2))
        const water = isLast
          ? Number((targetWaterCost - sumWater).toFixed(2))
          : Number((targetWaterCost * w).toFixed(2))

        sumTotal += tot
        sumGrid += grid
        sumGas += gas
        sumSteam += steam
        sumOil += oil
        sumNitrogen += nitrogen
        sumWater += water

        return {
          date: ym,
          totalCost: tot,
          gridElecCost: grid,
          gasCost: gas,
          steamCost: steam,
          oilCost: oil,
          nitrogenCost: nitrogen,
          waterCost: water,
        }
      })

      return monthList.reverse()
    } else if (timeDim === 'year') {
      const y = selectedYear || '2026'
      const yearWeights = [0.075, 0.065, 0.082, 0.084, 0.088, 0.092, 0.095, 0.098, 0.086, 0.082, 0.078, 0.075]
      const totalYw = yearWeights.reduce((a, b) => a + b, 0)

      let sumTotal = 0
      let sumGrid = 0
      let sumGas = 0
      let sumSteam = 0
      let sumOil = 0
      let sumNitrogen = 0
      let sumWater = 0

      const yearList: Array<{
        date: string
        totalCost: number
        gridElecCost: number
        gasCost: number
        steamCost: number
        oilCost: number
        nitrogenCost: number
        waterCost: number
      }> = []

      for (let m = 1; m <= 12; m++) {
        const mStr = String(m).padStart(2, '0')
        const ym = `${y}-${mStr}`
        const idx = m - 1
        const isLast = m === 12
        const w = yearWeights[idx] / totalYw

        const tot = isLast
          ? Number((targetTotalCost - sumTotal).toFixed(2))
          : Number((targetTotalCost * w).toFixed(2))
        const grid = isLast
          ? Number((targetGridElecCost - sumGrid).toFixed(2))
          : Number((targetGridElecCost * w).toFixed(2))
        const gas = isLast
          ? Number((targetGasCost - sumGas).toFixed(2))
          : Number((targetGasCost * w).toFixed(2))
        const steam = isLast
          ? Number((targetSteamCost - sumSteam).toFixed(2))
          : Number((targetSteamCost * w).toFixed(2))
        const oil = isLast
          ? Number((targetOilCost - sumOil).toFixed(2))
          : Number((targetOilCost * w).toFixed(2))
        const nitrogen = isLast
          ? Number((targetNitrogenCost - sumNitrogen).toFixed(2))
          : Number((targetNitrogenCost * w).toFixed(2))
        const water = isLast
          ? Number((targetWaterCost - sumWater).toFixed(2))
          : Number((targetWaterCost * w).toFixed(2))

        sumTotal += tot
        sumGrid += grid
        sumGas += gas
        sumSteam += steam
        sumOil += oil
        sumNitrogen += nitrogen
        sumWater += water

        yearList.push({
          date: ym,
          totalCost: tot,
          gridElecCost: grid,
          gasCost: gas,
          steamCost: steam,
          oilCost: oil,
          nitrogenCost: nitrogen,
          waterCost: water,
        })
      }

      return yearList.reverse()
    } else {
      // 自定义月份区间
      const start = selectedMonthRange.start || '2026-01'
      const end = selectedMonthRange.end || '2026-08'
      const [sy, sm] = start.split('-').map(Number)
      const [ey, em] = end.split('-').map(Number)

      const ymList: string[] = []
      let curY = sy
      let curM = sm
      while (curY < ey || (curY === ey && curM <= em)) {
        ymList.push(`${curY}-${String(curM).padStart(2, '0')}`)
        curM++
        if (curM > 12) {
          curM = 1
          curY++
        }
      }

      const count = ymList.length || 1
      let sumTotal = 0
      let sumGrid = 0
      let sumGas = 0
      let sumSteam = 0
      let sumOil = 0
      let sumNitrogen = 0
      let sumWater = 0

      const customList = ymList.map((ym, idx) => {
        const isLast = idx === ymList.length - 1
        const w = 1 / count

        const tot = isLast
          ? Number((targetTotalCost - sumTotal).toFixed(2))
          : Number((targetTotalCost * w).toFixed(2))
        const grid = isLast
          ? Number((targetGridElecCost - sumGrid).toFixed(2))
          : Number((targetGridElecCost * w).toFixed(2))
        const gas = isLast
          ? Number((targetGasCost - sumGas).toFixed(2))
          : Number((targetGasCost * w).toFixed(2))
        const steam = isLast
          ? Number((targetSteamCost - sumSteam).toFixed(2))
          : Number((targetSteamCost * w).toFixed(2))
        const oil = isLast
          ? Number((targetOilCost - sumOil).toFixed(2))
          : Number((targetOilCost * w).toFixed(2))
        const nitrogen = isLast
          ? Number((targetNitrogenCost - sumNitrogen).toFixed(2))
          : Number((targetNitrogenCost * w).toFixed(2))
        const water = isLast
          ? Number((targetWaterCost - sumWater).toFixed(2))
          : Number((targetWaterCost * w).toFixed(2))

        sumTotal += tot
        sumGrid += grid
        sumGas += gas
        sumSteam += steam
        sumOil += oil
        sumNitrogen += nitrogen
        sumWater += water

        return {
          date: ym,
          totalCost: tot,
          gridElecCost: grid,
          gasCost: gas,
          steamCost: steam,
          oilCost: oil,
          nitrogenCost: nitrogen,
          waterCost: water,
        }
      })

      return customList.reverse()
    }
  }, [activeData, timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

  // 台账本期合计汇总 (严格等于 activeData)
  const costLedgerTotals = useMemo(() => {
    return {
      totalCost: activeData.totalCost,
      gridElecCost: activeData.gridElecCost,
      gasCost: activeData.gasCost,
      steamCost: activeData.steamCost,
      oilCost: activeData.oilCost,
      nitrogenCost: activeData.nitrogenCost,
      waterCost: activeData.waterCost,
    }
  }, [activeData])

  return (
    <div className="space-y-3.5">
      {/* ========================================================================= */}
      {/* 🌟 1. 核心成本指标大盘卡片 (市电明确标注，纯金额呈现，点击联动分析) */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
            <h2 className="text-base font-bold text-slate-800 dark:text-foreground">
              能源成本
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 font-mono">
          {/* 卡片 1: 总用能成本 */}
          <div
            onClick={() => !isWorkshopLevel && setSelectedMetricKey('totalCost')}
            className={cn(
              'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
              !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
              selectedMetricKey === 'totalCost' && !isWorkshopLevel
                ? 'bg-emerald-50/40 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-800'
                : 'bg-white dark:bg-card border-slate-200 dark:border-border'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-1.5 font-sans">
                <Coins className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                总用能成本
              </span>
            </div>
            <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 truncate">
              ¥{activeData.totalCost.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 dark:border-border pt-1 flex items-center justify-start gap-1.5">
              <span>同比</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {activeData.yoyTrend}%
              </span>
            </div>
          </div>

          {/* 卡片 2: 电（市电+绿证） */}
          <div
            onClick={() => !isWorkshopLevel && setSelectedMetricKey('gridElecCost')}
            className={cn(
              'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
              !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
              selectedMetricKey === 'gridElecCost' && !isWorkshopLevel
                ? 'bg-blue-50/40 dark:bg-blue-950/40 border-[#2C7CFF] ring-2 ring-blue-200 dark:ring-blue-800'
                : 'bg-white dark:bg-card border-slate-200 dark:border-border'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-400 flex items-center gap-1.5 font-sans">
                <Zap className="size-3.5 text-[#2C7CFF]" />
                电（市电+绿证）
              </span>
            </div>
            <div className="text-xl font-extrabold text-[#2C7CFF] truncate">
              ¥{activeData.gridElecCost.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 dark:border-border pt-1 flex items-center justify-start gap-1.5">
              <span>占比</span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-400">{costRatios.elecRatio}%</span>
            </div>
          </div>

          {/* 卡片 3: 天然气 */}
          <div
            onClick={() => !isWorkshopLevel && setSelectedMetricKey('gasCost')}
            className={cn(
              'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
              !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
              selectedMetricKey === 'gasCost' && !isWorkshopLevel
                ? 'bg-amber-50/40 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-200 dark:ring-amber-800'
                : 'bg-white dark:bg-card border-slate-200 dark:border-border'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5 font-sans">
                <Flame className="size-3.5 text-amber-500" />
                天然气
              </span>
            </div>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 truncate">
              ¥{activeData.gasCost.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 dark:border-border pt-1 flex items-center justify-start gap-1.5">
              <span>占比</span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{costRatios.gasRatio}%</span>
            </div>
          </div>

          {/* 卡片 4: 外购蒸汽 */}
          <div
            onClick={() => !isWorkshopLevel && setSelectedMetricKey('steamCost')}
            className={cn(
              'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
              !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
              selectedMetricKey === 'steamCost' && !isWorkshopLevel
                ? 'bg-purple-50/40 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800'
                : 'bg-white dark:bg-card border-slate-200 dark:border-border'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5 font-sans">
                <Wind className="size-3.5 text-purple-500" />
                外购蒸汽
              </span>
            </div>
            <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 truncate">
              ¥{activeData.steamCost.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 dark:border-border pt-1 flex items-center justify-start gap-1.5">
              <span>占比</span>
              <span className="font-mono font-bold text-purple-700 dark:text-purple-400">{costRatios.steamRatio}%</span>
            </div>
          </div>

          {/* 卡片 5: 油 */}
          <div
            onClick={() => !isWorkshopLevel && setSelectedMetricKey('oilCost')}
            className={cn(
              'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
              !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
              selectedMetricKey === 'oilCost' && !isWorkshopLevel
                ? 'bg-rose-50/40 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-200 dark:ring-rose-800'
                : 'bg-white dark:bg-card border-slate-200 dark:border-border'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5 font-sans">
                <Fuel className="size-3.5 text-rose-500" />
                油
              </span>
            </div>
            <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 truncate">
              ¥{activeData.oilCost.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 dark:border-border pt-1 flex items-center justify-start gap-1.5">
              <span>占比</span>
              <span className="font-mono font-bold text-rose-700 dark:text-rose-400">{costRatios.oilRatio}%</span>
            </div>
          </div>

          {/* 卡片 6: 氮气 */}
          <div
            onClick={() => !isWorkshopLevel && setSelectedMetricKey('nitrogenCost')}
            className={cn(
              'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
              !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
              selectedMetricKey === 'nitrogenCost' && !isWorkshopLevel
                ? 'bg-cyan-50/40 dark:bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-200 dark:ring-cyan-800'
                : 'bg-white dark:bg-card border-slate-200 dark:border-border'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5 font-sans">
                <Snowflake className="size-3.5 text-cyan-500" />
                氮气
              </span>
            </div>
            <div className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 truncate">
              ¥{activeData.nitrogenCost.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 dark:border-border pt-1 flex items-center justify-start gap-1.5">
              <span>占比</span>
              <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">{costRatios.nitrogenRatio}%</span>
            </div>
          </div>

          {/* 卡片 7: 水 */}
          <div
            onClick={() => !isWorkshopLevel && setSelectedMetricKey('waterCost')}
            className={cn(
              'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
              !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
              selectedMetricKey === 'waterCost' && !isWorkshopLevel
                ? 'bg-sky-50/40 dark:bg-sky-950/40 border-sky-500 ring-2 ring-sky-200 dark:ring-sky-800'
                : 'bg-white dark:bg-card border-slate-200 dark:border-border'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5 font-sans">
                <Droplets className="size-3.5 text-sky-600" />
                水
              </span>
            </div>
            <div className="text-xl font-extrabold text-sky-600 truncate">
              ¥{activeData.waterCost.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">万元</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 dark:border-border pt-1 flex items-center justify-start gap-1.5">
              <span>占比</span>
              <span className="font-mono font-bold text-sky-700 dark:text-sky-400">{costRatios.waterRatio}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 2. 集团页和经营单位：展示 6 家单位占总能源费用的比重 (饼图 + 柱状图)     */}
      {/* ========================================================================= */}
      {!isWorkshopLevel && (
        <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-border pb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                {COST_METRICS_META[selectedMetricKey].name}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* 左侧 5/12: 南丁格尔玫瑰图 (默认清爽纯净，鼠标指向扇区时触发显示占比与金额) */}
            <div className="lg:col-span-5 border border-slate-100 dark:border-border rounded-xl p-3 bg-slate-50/50 dark:bg-panel space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5">
                  <PieChartIcon className="size-3.5 text-[#2C7CFF]" />
                  经营单位费用比重玫瑰图 (份额与金额)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  总量: ¥{metricCompanyBreakdown.totalVal.toFixed(1)} {metricCompanyBreakdown.unit}
                </span>
              </div>

              {/* 🌟 动态极坐标南丁格尔玫瑰图 SVG (鼠标悬浮指向时动态展现数据提示) */}
              <div className="relative w-full h-[290px] flex items-center justify-center">
                <svg viewBox="0 0 460 300" className="w-full h-full select-none overflow-visible">
                  <g transform="translate(230, 150)">
                    {/* 背景同心极坐标网格线 */}
                    <circle r="32" fill="none" stroke="#e2e8f0" strokeDasharray="2,2" />
                    <circle r="64" fill="none" stroke="#e2e8f0" strokeDasharray="2,2" />
                    <circle r="96" fill="none" stroke="#e2e8f0" strokeDasharray="2,2" />
                    <circle r="126" fill="none" stroke="#cbd5e1" strokeDasharray="2,2" />

                    {/* 各直属经营单位玫瑰扇区 */}
                    {metricCompanyBreakdown.donutData.map((item, idx) => {
                      const count = metricCompanyBreakdown.donutData.length
                      const angleStep = 360 / count
                      const pad = 1.5
                      const startAngle = idx * angleStep + pad
                      const endAngle = (idx + 1) * angleStep - pad
                      const midAngle = (idx + 0.5) * angleStep

                      // 最大值与极径映射
                      const maxVal = Math.max(...metricCompanyBreakdown.donutData.map((d) => d.value), 1)
                      const isHovered = hoveredUnitRose === item.name
                      const baseRadius = Number((44 + (item.value / maxVal) * 78).toFixed(2))
                      const outerRadius = isHovered ? baseRadius + 7 : baseRadius
                      const innerRadius = 26

                      const pathD = describeRoseSector(0, 0, innerRadius, outerRadius, startAngle, endAngle)

                      // 引线三点坐标计算
                      const P1 = polarToCartesian(0, 0, outerRadius + 2, midAngle)
                      const P2 = polarToCartesian(0, 0, outerRadius + 14, midAngle)
                      const isRight = P2.x >= 0
                      const P3 = {
                        x: Number((P2.x + (isRight ? 16 : -16)).toFixed(2)),
                        y: P2.y,
                      }

                      return (
                        <g
                          key={item.name}
                          className="cursor-pointer transition-all select-none"
                          onMouseEnter={() => setHoveredUnitRose(item.name)}
                          onMouseLeave={() => setHoveredUnitRose(null)}
                        >
                          {/* 花瓣扇面 */}
                          <path
                            d={pathD}
                            fill={item.color}
                            fillOpacity={hoveredUnitRose ? (isHovered ? 1 : 0.4) : 0.88}
                            stroke="#ffffff"
                            strokeWidth={isHovered ? 2.5 : 1.5}
                            className="transition-all duration-200"
                          />

                          {/* 🌟 仅在鼠标指向当前扇区时显示折线与数据浮标 */}
                          {isHovered && (
                            <g className="transition-opacity duration-200">
                              {/* 外围引线 (折线) */}
                              <polyline
                                points={`${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}`}
                                fill="none"
                                stroke={item.color}
                                strokeWidth={1.8}
                              />
                              {/* 引线端点圆点 */}
                              <circle cx={P3.x} cy={P3.y} r={2.8} fill={item.color} />

                              {/* 浮标气泡卡片 */}
                              <rect
                                x={isRight ? P3.x + 2 : P3.x - 104}
                                y={P3.y - 16}
                                width="102"
                                height="32"
                                rx="5"
                                fill="#ffffff"
                                stroke={item.color}
                                strokeWidth="1.5"
                                className="shadow-md"
                              />
                              <text
                                x={isRight ? P3.x + 8 : P3.x - 98}
                                y={P3.y - 2}
                                fontSize="10.5"
                                fontWeight="bold"
                                fill="#0f172a"
                                fontFamily="sans-serif"
                              >
                                {item.name}{' '}
                                <tspan fill={item.color} fontWeight="bold" fontFamily="monospace">
                                  {item.ratio}%
                                </tspan>
                              </text>
                              <text
                                x={isRight ? P3.x + 8 : P3.x - 98}
                                y={P3.y + 11}
                                fontSize="9.5"
                                fill="#475569"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                ¥{item.value.toFixed(1)} 万元
                              </text>
                            </g>
                          )}
                        </g>
                      )
                    })}

                    {/* 中心极核悬浮汇总徽章 */}
                    <circle r="25" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" className="shadow-xs" />
                    {hoveredUnitRose ? (
                      (() => {
                        const activeRose = metricCompanyBreakdown.donutData.find((d) => d.name === hoveredUnitRose)
                        return (
                          <>
                            <text textAnchor="middle" y="-3" fontSize="9" fill="#64748b" fontWeight="bold">
                              {activeRose?.name}
                            </text>
                            <text textAnchor="middle" y="9" fontSize="10.5" fill="#2C7CFF" fontWeight="bold" fontFamily="monospace">
                              {activeRose?.ratio}%
                            </text>
                          </>
                        )
                      })()
                    ) : (
                      <>
                        <text textAnchor="middle" y="-3" fontSize="8.5" fill="#64748b" fontWeight="bold">
                          总额
                        </text>
                        <text textAnchor="middle" y="9" fontSize="9.5" fill="#0f172a" fontWeight="bold" fontFamily="monospace">
                          ¥{metricCompanyBreakdown.totalVal.toFixed(0)}万
                        </text>
                      </>
                    )}
                  </g>
                </svg>
              </div>

              {/* 底部简洁图例指示条 */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-2 border-t border-slate-100 text-xs">
                {metricCompanyBreakdown.donutData.map((item) => (
                  <div
                    key={item.name}
                    onMouseEnter={() => setHoveredUnitRose(item.name)}
                    onMouseLeave={() => setHoveredUnitRose(null)}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all cursor-pointer select-none text-[11px]',
                      hoveredUnitRose === item.name
                        ? 'bg-blue-50 text-[#2C7CFF] font-bold ring-1 ring-blue-300'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧 7/12: 柱状图 */}
            <div className="lg:col-span-7 border border-slate-100 dark:border-border rounded-xl p-3 bg-slate-50/50 dark:bg-panel space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-foreground flex items-center gap-1.5">
                  <BarChart3 className="size-3.5 text-emerald-600" />
                  经营单位费用横向对比 ({metricCompanyBreakdown.unit})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">柱状图对比</span>
              </div>
              <div className="h-[310px]">
                <BarChartGroup
                  data={metricCompanyBreakdown.barData}
                  xKey="name"
                  height={310}
                  bars={[
                    {
                      key: '成本费用',
                      name: `${COST_METRICS_META[selectedMetricKey].shortName} (${metricCompanyBreakdown.unit})`,
                      color: COST_METRICS_META[selectedMetricKey].color,
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* 下级单位费用明细表格 */}
          <div className="border border-slate-200/80 dark:border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-100 dark:bg-panel border-b border-slate-200 dark:border-border text-slate-700 dark:text-slate-300 font-semibold font-sans h-[44px]">
                    <th className="py-2 px-3">序号</th>
                    <th className="py-2 px-3">直属经营单位</th>
                    <th className="py-2 px-3 text-[#2C7CFF]">
                      {COST_METRICS_META[selectedMetricKey].name} ({metricCompanyBreakdown.unit})
                    </th>
                    <th className="py-2 px-3 font-bold text-emerald-700">
                      {isGroupLevel ? '占全集团费用比重 (%)' : `占${selectedOrgNode.name}比重 (%)`}
                    </th>
                    <th className="py-2 px-3 text-center">同比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-border/60 text-slate-700 dark:text-slate-300">
                  {currentLevelUnits.map((comp, idx) => {
                    const val = comp[selectedMetricKey] as number
                    const ratio =
                      metricCompanyBreakdown.totalVal > 0
                        ? ((val / metricCompanyBreakdown.totalVal) * 100).toFixed(1)
                        : '0.0'
                    return (
                      <tr
                        key={comp.id}
                        onClick={() => {
                          if (onSelectOrgNode && isGroupLevel) {
                            onSelectOrgNode({
                              id: comp.id,
                              name: comp.name,
                              fullName: comp.fullName,
                              level: 'company',
                            })
                          }
                        }}
                        className={cn(
                          'hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors h-[44px]',
                          onSelectOrgNode && isGroupLevel ? 'cursor-pointer' : ''
                        )}
                      >
                        <td className="py-2 px-3 font-semibold text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-foreground font-sans flex items-center gap-1.5">
                          <Factory className="size-3.5 text-slate-500" />
                          {comp.name}
                        </td>
                        <td className="py-2 px-3 font-bold text-[#2C7CFF]">¥{val.toFixed(1)}万</td>
                        <td className="py-2 px-3 font-extrabold text-emerald-700">{ratio}%</td>
                        <td className="py-2 px-3 text-emerald-600 font-bold">{comp.yoyTrend}%</td>
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
      {/* 🌟 3. 能源成本构成南丁格尔玫瑰图 (全层级均保留展示)                                      */}
      {/* ========================================================================= */}
      <div className="p-4 bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-border pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
            <h2 className="text-base font-bold text-slate-800 dark:text-foreground">
              能源成本构成南丁格尔玫瑰图
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="size-2.5 rounded-full bg-[#3b82f6]" /> 电（市电+绿证）成本 ({costRatios.elecRatio}%)
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="size-2.5 rounded-full bg-[#f59e0b]" /> 天然气 ({costRatios.gasRatio}%)
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="size-2.5 rounded-full bg-[#a855f7]" /> 蒸汽 ({costRatios.steamRatio}%)
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="size-2.5 rounded-full bg-[#06b6d4]" /> 水费 ({costRatios.waterRatio}%)
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* 左侧：SVG 南丁格尔玫瑰图 (保留现有极坐标视觉设计) */}
          <div className="w-full lg:w-[380px] shrink-0 flex flex-col items-center justify-center p-4 bg-slate-50/70 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-border">
            <div className="relative w-[300px] h-[260px] flex items-center justify-center">
              <svg viewBox="0 0 300 260" className="w-full h-full select-none">
                <g transform="translate(150, 130)">
                  <circle r="30" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeDasharray="2,2" />
                  <circle r="60" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeDasharray="2,2" />
                  <circle r="90" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeDasharray="2,2" />
                  <circle r="115" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeDasharray="2,2" />

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
                  <circle r="28" fill="currentColor" stroke="#cbd5e1" strokeWidth="1.5" className="text-white dark:text-slate-800 shadow-xs" />
                  <text textAnchor="middle" y="-4" fontSize="9.5" fill="#64748b" fontWeight="bold">
                    总用能成本
                  </text>
                  <text
                    textAnchor="middle"
                    y="11"
                    fontSize="10.5"
                    fill="currentColor"
                    className="text-slate-900 dark:text-white"
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
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="bg-slate-50/80 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-border space-y-3">
              <div className="text-xs font-bold text-slate-800 dark:text-foreground flex items-center justify-between">
                <span>各能源介质成本费用明细对比</span>
                <span className="text-[10px] text-slate-400 font-normal">基于实际月度账单支出</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium font-sans">
                    <span className="size-2 rounded-full bg-blue-500" /> 电（市电+绿证）成本:
                  </span>
                  <span className="text-blue-600 font-bold">
                    ¥{activeData.gridElecCost.toLocaleString()} 万元 ({costRatios.elecRatio}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${costRatios.elecRatio}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium font-sans">
                    <span className="size-2 rounded-full bg-amber-500" /> 管道天然气成本:
                  </span>
                  <span className="text-amber-600 font-bold">
                    ¥{activeData.gasCost.toLocaleString()} 万元 ({costRatios.gasRatio}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${Math.max(8, Number(costRatios.gasRatio) * 3)}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium font-sans">
                    <span className="size-2 rounded-full bg-purple-500" /> 外购蒸汽热力成本:
                  </span>
                  <span className="text-purple-600 font-bold">
                    ¥{activeData.steamCost.toLocaleString()} 万元 ({costRatios.steamRatio}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${Math.max(6, Number(costRatios.steamRatio) * 3)}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium font-sans">
                    <span className="size-2 rounded-full bg-rose-500" /> 用油动力成本:
                  </span>
                  <span className="text-rose-600 font-bold">
                    ¥{activeData.oilCost.toLocaleString()} 万元 ({costRatios.oilRatio}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${Math.max(4, Number(costRatios.oilRatio) * 3)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 4. 明细台账 (对应上方各能源成本指标，替代原折线图，符合台账模式) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-card rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-border flex flex-wrap items-center justify-between bg-slate-50/80 dark:bg-panel gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
            <h3 className="text-base font-bold text-slate-800 dark:text-foreground">明细台账</h3>
          </div>
          <ExportButton
            label="导出台账"
            onClick={() =>
              alert(
                `正在导出【${activeData.name}】${
                  timeDim === 'month'
                    ? selectedMonth + '逐日'
                    : timeDim === 'quarter'
                    ? selectedQuarter
                    : timeDim === 'year'
                    ? selectedYear + '年度'
                    : selectedMonthRange.start + '至' + selectedMonthRange.end
                }能源成本明细台账 (Excel)...`
              )
            }
          />
        </div>

        <div className="overflow-x-auto max-h-[380px] custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="sticky top-0 bg-slate-100 dark:bg-panel z-10">
              <tr className="border-b border-slate-200 dark:border-border text-slate-700 dark:text-slate-300 font-semibold font-sans h-[44px]">
                <th className="py-2.5 px-3">日期 / 账期</th>
                <th className="py-2.5 px-3 text-[#059669] font-bold">总用能成本 (万元)</th>
                <th className="py-2.5 px-3 text-[#41C0FF] font-semibold">电（市电+绿证）(万元)</th>
                <th className="py-2.5 px-3 text-[#FF6536]">天然气 (万元)</th>
                <th className="py-2.5 px-3 text-[#FFBA00]">外购蒸汽 (万元)</th>
                <th className="py-2.5 px-3 text-[#8E73ED]">油 (万元)</th>
                {activeData.nitrogenCost > 0 && (
                  <th className="py-2.5 px-3 text-[#4F39F6]">氮气 (万元)</th>
                )}
                <th className="py-2.5 px-3 text-[#10C4CE]">水 (万元)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border/60 text-slate-700 dark:text-slate-300">
              {costLedgerData.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors h-[44px]">
                  <td className="py-2 px-3 font-semibold text-slate-900 dark:text-foreground font-sans">{row.date}</td>
                  <td className="py-2 px-3 font-bold text-[#059669]">¥{row.totalCost.toFixed(2)}</td>
                  <td className="py-2 px-3 text-[#41C0FF] font-semibold">¥{row.gridElecCost.toFixed(2)}</td>
                  <td className="py-2 px-3 text-[#FF6536]">¥{row.gasCost.toFixed(2)}</td>
                  <td className="py-2 px-3 text-[#FFBA00]">¥{row.steamCost.toFixed(2)}</td>
                  <td className="py-2 px-3 text-[#8E73ED]">¥{row.oilCost.toFixed(2)}</td>
                  {activeData.nitrogenCost > 0 && (
                    <td className="py-2 px-3 text-[#4F39F6]">¥{row.nitrogenCost.toFixed(2)}</td>
                  )}
                  <td className="py-2 px-3 text-[#10C4CE]">¥{row.waterCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="sticky bottom-0 bg-slate-50 dark:bg-panel font-bold border-t-2 border-slate-200 dark:border-border text-slate-800 dark:text-foreground z-10">
              <tr className="h-[44px]">
                <td className="py-2 px-3 font-sans">本期合计</td>
                <td className="py-2 px-3 text-[#059669] font-bold">¥{costLedgerTotals.totalCost.toLocaleString()} 万元</td>
                <td className="py-2 px-3 text-[#41C0FF] font-bold">¥{costLedgerTotals.gridElecCost.toLocaleString()} 万元</td>
                <td className="py-2 px-3 text-[#FF6536] font-bold">¥{costLedgerTotals.gasCost.toLocaleString()} 万元</td>
                <td className="py-2 px-3 text-[#FFBA00] font-bold">¥{costLedgerTotals.steamCost.toLocaleString()} 万元</td>
                <td className="py-2 px-3 text-[#8E73ED] font-bold">¥{costLedgerTotals.oilCost.toLocaleString()} 万元</td>
                {activeData.nitrogenCost > 0 && (
                  <td className="py-2 px-3 text-[#4F39F6] font-bold">¥{costLedgerTotals.nitrogenCost.toLocaleString()} 万元</td>
                )}
                <td className="py-2 px-3 text-[#10C4CE] font-bold">¥{costLedgerTotals.waterCost.toLocaleString()} 万元</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

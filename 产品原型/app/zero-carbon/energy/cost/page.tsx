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
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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
    shortName: '总用能成本',
    unit: '万元',
    color: '#059669',
    description: '全厂区所有能源介质外购与消费总支出',
  },
  gridElecCost: {
    key: 'gridElecCost',
    name: '市电',
    shortName: '市电',
    unit: '万元',
    color: '#1677ff',
    description: '从公共电网外购结算的电力总费用',
  },
  gasCost: {
    key: 'gasCost',
    name: '天然气',
    shortName: '天然气',
    unit: '万元',
    color: '#f59e0b',
    description: '管道天然气用气采购与燃料支出',
  },
  steamCost: {
    key: 'steamCost',
    name: '外购蒸汽',
    shortName: '外购蒸汽',
    unit: '万元',
    color: '#8b5cf6',
    description: '工业园区集中供热与工艺外购蒸汽费用',
  },
  oilCost: {
    key: 'oilCost',
    name: '油',
    shortName: '油',
    unit: '万元',
    color: '#f43f5e',
    description: '厂区物流运输车辆及发电机柴汽油消费',
  },
  nitrogenCost: {
    key: 'nitrogenCost',
    name: '氮气',
    shortName: '氮气',
    unit: '万元',
    color: '#06b6d4',
    description: '特种绝缘干燥与工艺惰化液氮采购支出',
  },
  waterCost: {
    key: 'waterCost',
    name: '水',
    shortName: '水',
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

// 🏢 各 2 级经营公司下属 3 级单位 (车间/项目公司) 成本数据字典
const COMPANY_SUB_UNITS_COST: Record<string, CompanyCostData[]> = {
  '沈变公司': [
    { id: 'ws_sb_main', name: '沈变本部', fullName: '沈变本部（特高压制造车间）', province: '辽宁省 (沈阳)', totalCost: 420.0, gridElecCost: 335.0, gasCost: 55.0, steamCost: 22.0, oilCost: 8.0, nitrogenCost: 0, waterCost: 2.8, elecRatio: 79.8, yoyTrend: -3.5 },
    { id: 'ws_sb_luna', name: '露娜公司', fullName: '特变电工露娜智能电气有限公司', province: '天津市 (武清)', totalCost: 120.0, gridElecCost: 95.0, gasCost: 15.0, steamCost: 6.0, oilCost: 2.5, nitrogenCost: 0, waterCost: 0.8, elecRatio: 79.2, yoyTrend: -2.8 },
    { id: 'ws_sb_zh', name: '智慧能源', fullName: '沈变智慧能源微网运维', province: '辽宁省 (沈阳)', totalCost: 72.5, gridElecCost: 58.0, gasCost: 9.0, steamCost: 3.5, oilCost: 1.5, nitrogenCost: 0, waterCost: 0.5, elecRatio: 80.0, yoyTrend: -4.1 },
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
    { id: 'ws_xb_zhny', name: '智慧能源', fullName: '新变智慧微网运维中心', province: '新疆 (昌吉)', totalCost: 18.0, gridElecCost: 14.5, gasCost: 2.2, steamCost: 0.9, oilCost: 0.4, nitrogenCost: 0, waterCost: 0.1, elecRatio: 80.6, yoyTrend: -4.0 },
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
  { month: '03月', 市电成本占比: 80.4, 天然气成本占比: 12.2, 蒸汽成本占比: 4.8, 用油与其他: 2.6 },
  { month: '04月', 市电成本占比: 79.9, 天然气成本占比: 12.4, 蒸汽成本占比: 4.9, 用油与其他: 2.8 },
  { month: '05月', 市电成本占比: 79.5, 天然气成本占比: 12.3, 蒸汽成本占比: 4.8, 用油与其他: 3.4 },
  { month: '06月', 市电成本占比: 79.2, 天然气成本占比: 12.3, 蒸汽成本占比: 4.8, 用油与其他: 3.7 },
  { month: '07月', 市电成本占比: 79.4, 天然气成本占比: 12.2, 蒸汽成本占比: 4.7, 用油与其他: 3.7 },
  { month: '08月', 市电成本占比: 79.3, 天然气成本占比: 12.3, 蒸汽成本占比: 4.7, 用油与其他: 3.7 },
]

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

export default function EnergyCostPage() {
  // 6家直属经营单位南丁格尔玫瑰图悬浮项
  const [hoveredUnitRose, setHoveredUnitRose] = useState<string | null>(null)
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

  // 判断是否处于集团层级 (1级节点)
  const isGroupLevel = useMemo(() => {
    return (
      selectedNode.id === 'ent_root' ||
      selectedNode.id === 'group_root' ||
      selectedNode.level === 'group' ||
      selectedNode.name.includes('电装集团')
    )
  }, [selectedNode])

  // 判断是否是车间/项目公司级 (3级节点)
  const isWorkshopLevel = useMemo(() => {
    return selectedNode.level === 'workshop'
  }, [selectedNode])

  // 🌟 当前层级展示的下级单位数据列表 (选1级集团节点 ➔ 6家2级经营公司; 选2级经营公司节点 ➔ 其下属3级车间/项目公司)
  const currentLevelUnits = useMemo<CompanyCostData[]>(() => {
    if (isGroupLevel) {
      return SIX_COMPANIES_COST
    }
    const matchedKey = Object.keys(COMPANY_SUB_UNITS_COST).find((k) =>
      selectedNode.name.includes(k) || k.includes(selectedNode.name.slice(0, 2))
    )
    if (matchedKey && COMPANY_SUB_UNITS_COST[matchedKey]) {
      return COMPANY_SUB_UNITS_COST[matchedKey]
    }
    return SIX_COMPANIES_COST
  }, [isGroupLevel, selectedNode.name])

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

  // 1. 计算当前单位列表在当前选中成本指标下的数值与占比 (用于饼图与柱状图)
  const metricCompanyBreakdown = useMemo(() => {
    const list = currentLevelUnits
    const totalVal = list.reduce((sum, c) => sum + (c[selectedMetricKey] as number), 0)
    const unit = COST_METRICS_META[selectedMetricKey].unit

    const donutData = list.map((c, i) => {
      const val = c[selectedMetricKey] as number
      const ratio = totalVal > 0 ? Number(((val / totalVal) * 100).toFixed(1)) : 0
      const colors = [
        '#1677ff', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899',
        '#3b82f6', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
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
      const val = c[selectedMetricKey] as number
      const ratio = totalVal > 0 ? Number(((val / totalVal) * 100).toFixed(1)) : 0
      return {
        name: c.name,
        成本费用: val,
        占比: ratio,
      }
    })

    return { totalVal, donutData, barData, unit }
  }, [currentLevelUnits, selectedMetricKey])

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
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <DollarSign className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-foreground">能源成本分析</h1>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-bold font-sans border',
                    isGroupLevel
                      ? 'bg-primary/20 text-primary border-primary/30'
                      : isWorkshopLevel
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
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
                  <option value="2026-Q1" className="bg-card text-foreground">2026年 第1季度 (Q1)</option>
                  <option value="2026-Q2" className="bg-card text-foreground">2026年 第2季度 (Q2)</option>
                  <option value="2026-Q3" className="bg-card text-foreground">2026年 第3季度 (Q3)</option>
                  <option value="2026-Q4" className="bg-card text-foreground">2026年 第4季度 (Q4)</option>
                  <option value="2025-Q4" className="bg-card text-foreground">2025年 第4季度 (Q4)</option>
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
                  <option value="2026" className="bg-card text-foreground">2026 年度</option>
                  <option value="2025" className="bg-card text-foreground">2025 年度</option>
                  <option value="2024" className="bg-card text-foreground">2024 年度</option>
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={() => alert(`正在导出【${activeData.name}】能源成本多维分析报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs cursor-pointer transition-colors"
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
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Coins className="size-3.5 text-primary" />
              <span>总用能成本与各类型能源成本构成</span>
            </span>
            {!isWorkshopLevel && (
              <span className="text-[11px] text-primary font-sans font-medium flex items-center gap-1">
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
                  ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-card border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                  <Coins className="size-3.5 text-emerald-400" />
                  总用能成本
                </span>
              </div>
              <div className="text-xl font-extrabold text-emerald-400 truncate">
                ¥{activeData.totalCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-muted-foreground font-sans">万元</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-sans border-t border-border/60 pt-1 flex items-center justify-between">
                <span>月度同比</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingDown className="size-3" /> {activeData.yoyTrend}% ↓
                </span>
              </div>
            </div>

            {/* 卡片 2: 市电 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('gridElecCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'gridElecCost' && !isWorkshopLevel
                  ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                  : 'bg-card border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                  <Zap className="size-3.5 text-primary" />
                  市电
                </span>
              </div>
              <div className="text-xl font-extrabold text-primary truncate">
                ¥{activeData.gridElecCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-muted-foreground font-sans">万元</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-sans border-t border-border/60 pt-1 flex items-center justify-between">
                <span>占比</span>
                <span className="font-mono font-bold text-primary">{costRatios.elecRatio}%</span>
              </div>
            </div>

            {/* 卡片 3: 天然气 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('gasCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'gasCost' && !isWorkshopLevel
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20'
                  : 'bg-card border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                  <Flame className="size-3.5 text-amber-400" />
                  天然气
                </span>
              </div>
              <div className="text-xl font-extrabold text-amber-400 truncate">
                ¥{activeData.gasCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-muted-foreground font-sans">万元</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-sans border-t border-border/60 pt-1 flex items-center justify-between">
                <span>占比</span>
                <span className="font-mono font-bold text-amber-400">{costRatios.gasRatio}%</span>
              </div>
            </div>

            {/* 卡片 4: 外购蒸汽 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('steamCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'steamCost' && !isWorkshopLevel
                  ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/20'
                  : 'bg-card border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                  <Wind className="size-3.5 text-purple-400" />
                  外购蒸汽
                </span>
              </div>
              <div className="text-xl font-extrabold text-purple-400 truncate">
                ¥{activeData.steamCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-muted-foreground font-sans">万元</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-sans border-t border-border/60 pt-1 flex items-center justify-between">
                <span>占比</span>
                <span className="font-mono font-bold text-purple-400">{costRatios.steamRatio}%</span>
              </div>
            </div>

            {/* 卡片 5: 油 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('oilCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'oilCost' && !isWorkshopLevel
                  ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/20'
                  : 'bg-card border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                  <Fuel className="size-3.5 text-rose-400" />
                  油
                </span>
              </div>
              <div className="text-xl font-extrabold text-rose-400 truncate">
                ¥{activeData.oilCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-muted-foreground font-sans">万元</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-sans border-t border-border/60 pt-1 flex items-center justify-between">
                <span>占比</span>
                <span className="font-mono font-bold text-rose-400">{costRatios.oilRatio}%</span>
              </div>
            </div>

            {/* 卡片 6: 氮气 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('nitrogenCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'nitrogenCost' && !isWorkshopLevel
                  ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/20'
                  : 'bg-card border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                  <Snowflake className="size-3.5 text-cyan-400" />
                  氮气
                </span>
              </div>
              <div className="text-xl font-extrabold text-cyan-400 truncate">
                ¥{activeData.nitrogenCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-muted-foreground font-sans">万元</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-sans border-t border-border/60 pt-1 flex items-center justify-between">
                <span>占比</span>
                <span className="font-mono font-bold text-cyan-400">{costRatios.nitrogenRatio}%</span>
              </div>
            </div>

            {/* 卡片 7: 水 */}
            <div
              onClick={() => !isWorkshopLevel && setSelectedMetricKey('waterCost')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                !isWorkshopLevel ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'waterCost' && !isWorkshopLevel
                  ? 'bg-sky-500/10 border-sky-500 ring-2 ring-sky-500/20'
                  : 'bg-card border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                  <Droplets className="size-3.5 text-sky-400" />
                  水
                </span>
              </div>
              <div className="text-xl font-extrabold text-sky-400 truncate">
                ¥{activeData.waterCost.toLocaleString()}{' '}
                <span className="text-xs font-normal text-muted-foreground font-sans">万元</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-sans border-t border-border/60 pt-1 flex items-center justify-between">
                <span>占比</span>
                <span className="font-mono font-bold text-sky-400">{costRatios.waterRatio}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 2. 集团页和经营单位：展示 6 家单位占总能源费用的比重 (饼图 + 柱状图)     */}
        {/* ========================================================================= */}
        {!isWorkshopLevel && (
          <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between border-b border-border/60 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                <h3 className="text-xs font-bold text-foreground">
                  【{COST_METRICS_META[selectedMetricKey].name}】6 家直属经营单位占电装总能源费用的比重结构分析
                </h3>
              </div>
              <span className="text-xs text-muted-foreground font-sans">
                点击上方任意成本卡片可切换分析指标
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 左侧 5/12: 南丁格尔玫瑰图 (默认清爽纯净，鼠标指向扇区时触发显示占比与金额) */}
              <div className="lg:col-span-5 border border-border rounded-xl p-3 bg-panel space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <PieChartIcon className="size-3.5 text-primary" />
                    6 家直属经营单位费用比重玫瑰图 (份额与金额)
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    总量: ¥{metricCompanyBreakdown.totalVal.toFixed(1)} {metricCompanyBreakdown.unit}
                  </span>
                </div>

                {/* 🌟 动态极坐标南丁格尔玫瑰图 SVG (鼠标悬浮指向时动态展现数据提示) */}
                <div className="relative w-full h-[290px] flex items-center justify-center">
                  <svg viewBox="0 0 460 300" className="w-full h-full select-none overflow-visible">
                    <g transform="translate(230, 150)">
                      {/* 背景同心极坐标网格线 */}
                      <circle r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
                      <circle r="64" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
                      <circle r="96" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
                      <circle r="126" fill="none" stroke="rgba(255,255,255,0.15)" strokeDasharray="2,2" />

                      {/* 各直属经营单位玫瑰扇区 */}
                      {metricCompanyBreakdown.donutData.map((item, idx) => {
                        const count = metricCompanyBreakdown.donutData.length
                        const angleStep = 360 / count
                        const pad = 1.5
                        const startAngle = idx * angleStep + pad
                        const endAngle = (idx + 1) * angleStep - pad
                        const midAngle = (idx + 0.5) * angleStep

                        // 最大值与极径映射 (¥762.5万最长，¥312.0万最短)
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
                              stroke="#0a192f"
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
                                  fill="#0f172a"
                                  stroke={item.color}
                                  strokeWidth="1.5"
                                  className="shadow-md"
                                />
                                <text
                                  x={isRight ? P3.x + 8 : P3.x - 98}
                                  y={P3.y - 2}
                                  fontSize="10.5"
                                  fontWeight="bold"
                                  fill="#f8fafc"
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
                                  fill="#94a3b8"
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
                      <circle r="25" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" className="shadow-xs" />
                      {hoveredUnitRose ? (
                        (() => {
                          const activeRose = metricCompanyBreakdown.donutData.find((d) => d.name === hoveredUnitRose)
                          return (
                            <>
                              <text textAnchor="middle" y="-3" fontSize="9" fill="#94a3b8" fontWeight="bold">
                                {activeRose?.name}
                              </text>
                              <text textAnchor="middle" y="9" fontSize="10.5" fill="#38bdf8" fontWeight="bold" fontFamily="monospace">
                                {activeRose?.ratio}%
                              </text>
                            </>
                          )
                        })()
                      ) : (
                        <>
                          <text textAnchor="middle" y="-3" fontSize="8.5" fill="#94a3b8" fontWeight="bold">
                            总额
                          </text>
                          <text textAnchor="middle" y="9" fontSize="9.5" fill="#f8fafc" fontWeight="bold" fontFamily="monospace">
                            ¥{metricCompanyBreakdown.totalVal.toFixed(0)}万
                          </text>
                        </>
                      )}
                    </g>
                  </svg>
                </div>

                {/* 底部简洁图例指示条 */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-2 border-t border-border/60 text-xs">
                  {metricCompanyBreakdown.donutData.map((item) => (
                    <div
                      key={item.name}
                      onMouseEnter={() => setHoveredUnitRose(item.name)}
                      onMouseLeave={() => setHoveredUnitRose(null)}
                      className={cn(
                        'flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all cursor-pointer select-none text-[11px]',
                        hoveredUnitRose === item.name
                          ? 'bg-primary/20 text-primary font-bold ring-1 ring-primary/40'
                          : 'text-muted-foreground hover:bg-accent/30'
                      )}
                    >
                      <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 右侧 7/12: 柱状图 */}
              <div className="lg:col-span-7 border border-border rounded-xl p-3 bg-panel space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <BarChart3 className="size-3.5 text-emerald-400" />
                    6 家直属经营单位费用横向对比 ({metricCompanyBreakdown.unit})
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">柱状图对比</span>
                </div>
                <div className="h-[310px]">
                  <BarChartGroup
                    data={metricCompanyBreakdown.barData}
                    xKey="name"
                    height={310}
                    bars={[
                      { key: '成本费用', name: `${COST_METRICS_META[selectedMetricKey].shortName} (${metricCompanyBreakdown.unit})`, color: COST_METRICS_META[selectedMetricKey].color },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* 下级单位费用明细表格 */}
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-panel border-b border-border text-muted-foreground font-semibold font-sans">
                      <th className="py-2 px-3">序号</th>
                      <th className="py-2 px-3">直属经营单位</th>
                      <th className="py-2 px-3 text-primary">
                        {COST_METRICS_META[selectedMetricKey].name} ({metricCompanyBreakdown.unit})
                      </th>
                      <th className="py-2 px-3 font-bold text-emerald-400">
                        {isGroupLevel ? '占全集团费用比重 (%)' : `占${selectedNode.name}比重 (%)`}
                      </th>
                      <th className="py-2 px-3">同比变化 (%)</th>
                      <th className="py-2 px-3 text-right">穿透操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {currentLevelUnits.map((comp, idx) => {
                      const val = comp[selectedMetricKey] as number
                      const ratio = metricCompanyBreakdown.totalVal > 0 ? ((val / metricCompanyBreakdown.totalVal) * 100).toFixed(1) : '0.0'
                      return (
                        <tr key={comp.id} className="hover:bg-accent/30 transition-colors">
                          <td className="py-2 px-3 font-semibold text-muted-foreground">{idx + 1}</td>
                          <td className="py-2 px-3 font-bold text-foreground font-sans flex items-center gap-1.5">
                            <Factory className="size-3.5 text-muted-foreground" />
                            {comp.name}
                          </td>
                          <td className="py-2 px-3 font-bold text-primary">¥{val.toFixed(1)}万</td>
                          <td className="py-2 px-3 font-extrabold text-emerald-400">{ratio}%</td>
                          <td className="py-2 px-3 text-emerald-400 font-bold">{comp.yoyTrend}% ↓</td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedNode({
                                  id: comp.id,
                                  name: comp.name,
                                  fullName: comp.fullName,
                                  level: isGroupLevel ? 'company' : 'workshop',
                                })
                              }}
                              className="text-[11px] text-primary hover:underline font-sans font-medium cursor-pointer"
                            >
                              {isGroupLevel ? '下钻查看该单位成本 →' : '查看车间用能明细 →'}
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
        <div className="p-4 bg-card rounded-xl border border-border shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <h2 className="text-xs font-bold text-foreground">
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
            <div className="w-full lg:w-[380px] shrink-0 flex flex-col items-center justify-center p-4 bg-panel rounded-xl border border-border">
              <div className="relative w-[300px] h-[260px] flex items-center justify-center">
                <svg viewBox="0 0 300 260" className="w-full h-full select-none">
                  <g transform="translate(150, 130)">
                    <circle r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
                    <circle r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
                    <circle r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
                    <circle r="115" fill="none" stroke="rgba(255,255,255,0.15)" strokeDasharray="2,2" />

                    {/* 市电成本 (主导支出, 半径 115) */}
                    <path
                      d="M 0 0 L 0 -115 A 115 115 0 0 1 110 35 Z"
                      fill="#3b82f6"
                      fillOpacity={activeHoverSector === 'elec' ? '1' : '0.88'}
                      stroke="#0a192f"
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
                      stroke="#0a192f"
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
                      stroke="#0a192f"
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
                      stroke="#0a192f"
                      strokeWidth="2"
                      className="hover:opacity-95 transition-opacity cursor-pointer"
                      onMouseEnter={() => setActiveHoverSector('water')}
                      onMouseLeave={() => setActiveHoverSector(null)}
                    />

                    {/* 中心悬浮标牌 */}
                    <circle r="28" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" className="shadow-xs" />
                    <text textAnchor="middle" y="-4" fontSize="9.5" fill="#94a3b8" fontWeight="bold">
                      总用能成本
                    </text>
                    <text
                      textAnchor="middle"
                      y="11"
                      fontSize="10.5"
                      fill="#f8fafc"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      ¥{activeData.totalCost.toFixed(1)}万
                    </text>
                  </g>
                </svg>
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 font-sans">
                💡 南丁格尔玫瑰图极径视觉放大水费等小占比数据可见性
              </span>
            </div>

            {/* 右侧：各介质成本构成明细与金额对比 */}
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3.5">
              <div className="bg-panel p-4 rounded-xl border border-border space-y-3">
                <div className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>各能源介质成本费用明细对比</span>
                  <span className="text-[10px] text-muted-foreground font-normal">基于实际月度账单支出</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium font-sans">
                      <span className="size-2 rounded-full bg-blue-500" /> 市电成本 (外购市电):
                    </span>
                    <span className="text-primary font-bold">
                      ¥{activeData.gridElecCost.toLocaleString()} 万元 ({costRatios.elecRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-accent/40 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${costRatios.elecRatio}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium font-sans">
                      <span className="size-2 rounded-full bg-amber-500" /> 管道天然气成本:
                    </span>
                    <span className="text-amber-400 font-bold">
                      ¥{activeData.gasCost.toLocaleString()} 万元 ({costRatios.gasRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-accent/40 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${Math.max(8, Number(costRatios.gasRatio) * 3)}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium font-sans">
                      <span className="size-2 rounded-full bg-purple-500" /> 外购蒸汽热力成本:
                    </span>
                    <span className="text-purple-400 font-bold">
                      ¥{activeData.steamCost.toLocaleString()} 万元 ({costRatios.steamRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-accent/40 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${Math.max(6, Number(costRatios.steamRatio) * 3)}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium font-sans">
                      <span className="size-2 rounded-full bg-rose-500" /> 用油动力成本:
                    </span>
                    <span className="text-rose-400 font-bold">
                      ¥{activeData.oilCost.toLocaleString()} 万元 ({costRatios.oilRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-accent/40 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${Math.max(4, Number(costRatios.oilRatio) * 3)}%` }} />
                  </div>
                </div>
              </div>

              {/* 展开明细按钮 */}
              <div className="flex items-center justify-between pt-1 border-t border-border/60">
                <span className="text-xs text-muted-foreground font-sans">
                  💡 支持穿透查看各车间工段分项能源费用明细
                </span>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 text-xs font-bold transition-all border border-primary/30 cursor-pointer"
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
        <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between border-b border-border/60 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              <h3 className="text-xs font-bold text-foreground">
                01月 至 08月 各类能源成本占比历史变化趋势曲线 (%)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-sans text-muted-foreground">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary" /> 市电成本占比</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-400" /> 天然气成本占比</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-purple-400" /> 蒸汽成本占比</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-slate-400" /> 用油与其他</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-border bg-panel">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  【{activeData.name}】车间工序级能源成本明细台账
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/30 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="font-bold text-foreground">车间/工序级能源成本与 ESG 水耗拆解</span>
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
                  <tr className="bg-panel text-muted-foreground border-b border-border font-bold font-sans">
                    <th className="py-2.5 px-3">工序 / 车间</th>
                    <th className="py-2.5 px-3 text-right">市电支出 (万元)</th>
                    <th className="py-2.5 px-3 text-right">天然气费 (万元)</th>
                    <th className="py-2.5 px-3 text-right">蒸汽费 (万元)</th>
                    <th className="py-2.5 px-3 text-right text-cyan-400">水费 (万元)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-foreground bg-primary/10">
                      用能总成本 (万元)
                    </th>
                    <th className="py-2.5 px-3 text-right">成本占比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground font-mono">
                  <tr className="hover:bg-accent/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-foreground">1. 真空干燥工段 (煤油气相/蒸汽)</td>
                    <td className="py-2.5 px-3 text-right">303.1</td>
                    <td className="py-2.5 px-3 text-right">29.1</td>
                    <td className="py-2.5 px-3 text-right">18.0</td>
                    <td className="py-2.5 px-3 text-right text-cyan-400 font-bold">2.1</td>
                    <td className="py-2.5 px-3 text-right font-bold text-foreground bg-primary/10">352.3</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary">46.2%</td>
                  </tr>
                  <tr className="hover:bg-accent/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-foreground">2. 铁芯剪切与叠装工序</td>
                    <td className="py-2.5 px-3 text-right">150.0</td>
                    <td className="py-2.5 px-3 text-right">9.0</td>
                    <td className="py-2.5 px-3 text-right">1.4</td>
                    <td className="py-2.5 px-3 text-right text-cyan-400 font-bold">1.4</td>
                    <td className="py-2.5 px-3 text-right font-bold text-foreground bg-primary/10">161.8</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary">21.2%</td>
                  </tr>
                  <tr className="hover:bg-accent/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-foreground">3. 线圈绕制与绝缘处理工段</td>
                    <td className="py-2.5 px-3 text-right">121.8</td>
                    <td className="py-2.5 px-3 text-right">8.1</td>
                    <td className="py-2.5 px-3 text-right">3.8</td>
                    <td className="py-2.5 px-3 text-right text-cyan-400 font-bold">1.9</td>
                    <td className="py-2.5 px-3 text-right font-bold text-foreground bg-primary/10">135.6</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary">17.8%</td>
                  </tr>
                  <tr className="hover:bg-accent/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-foreground">4. 总装配、试验与辅助动力站房</td>
                    <td className="py-2.5 px-3 text-right">100.1</td>
                    <td className="py-2.5 px-3 text-right">7.4</td>
                    <td className="py-2.5 px-3 text-right">2.4</td>
                    <td className="py-2.5 px-3 text-right text-cyan-400 font-bold">2.9</td>
                    <td className="py-2.5 px-3 text-right font-bold text-foreground bg-primary/10">112.8</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary">14.8%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-border bg-panel flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
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

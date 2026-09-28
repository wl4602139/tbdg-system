'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Calendar,
  Download,
  Zap,
  Cable,
  Factory,
  Search,
  Building2,
  Cpu,
  Award,
  CheckCircle2,
  X,
  Layers,
  Flame,
  Droplets,
  Wind,
  TrendingDown,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Sliders,
  TrendingUp,
  Boxes,
  PieChart as PieChartIcon,
  BarChart3,
  RotateCcw,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts'

import { getPeriodScaleFactor } from '@/components/shared/time-dimension-engine'
import { ExportButton } from '@/components/shared/primitives'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'
import {
  getProductLinesForUnit,
  PRODUCT_TO_LINES_MAPPING,
} from '@/lib/product-line-subcategories'
import { CollapsibleTagBar } from '@/components/shared/collapsible-tag-bar'
import {
  getProductMajorsForUnit,
  getSubcategoriesForMajor,
  MAJOR_CATEGORY_METRICS,
} from '@/lib/product-major-categories'
import { SubcategoryCompositionTable } from '@/components/shared/subcategory-composition-table'

// 🌟 变压器产业 17 大标准产线（严格对齐《01-6 产品分类与产线匹配关系-外发.xlsx》与指标管控看板）
export const ALL_TRANSFORMER_PRODUCT_LINES = [
  '高压产线',
  '超高压产线',
  '特高压产线',
  '配变产线（干变）',
  '配变产线（油变）',
  '配变产线（中特）',
  '配变产线（箱变）',
  'GIS 产线',
  'GIL 产线',
  '开关柜产线',
  '二次产线',
  '电抗器产线（干式空心）',
  '套管产线',
  '互感器产线',
  '硅钢产线（横剪）',
  '电容器产线（油浸式）',
  '电容器产线（干式）',
]

// 🌟 线缆产业 8 大标准产线（严格对齐《线缆产线分类.xlsx》与指标管控看板）
export const ALL_CABLE_PRODUCT_LINES = [
  '高压力缆产线',
  '中压力缆产线',
  '低压力缆产线',
  '导线产线',
  '布电线产线',
  '特种电缆产线',
  '橡套电缆产线',
  '电气装备电缆产线',
]

// 🌟 10 大标准产品大类（用于底部明细台账 3 级级联筛选：产品大类 -> 产品中类 -> 产品型号）
export interface MajorCategoryOption {
  id: string
  name: string
  industry: 'transformer' | 'cable'
  categoryIds: string[]
}

export const PRODUCT_MAJOR_OPTIONS: MajorCategoryOption[] = [
  { id: 'major-tr', name: '变压器', industry: 'transformer', categoryIds: ['cat-mp-tr-high', 'cat-mp-tr-dry', 'cat-mp-tr-oil', 'cat-mp-tr-core'] },
  { id: 'major-gis', name: '高压组合电器 GIS', industry: 'transformer', categoryIds: ['cat-mp-gis', 'cat-mp-gil'] },
  { id: 'major-bushing', name: '套管', industry: 'transformer', categoryIds: ['cat-mp-bushing'] },
  { id: 'major-ct', name: '互感器', industry: 'transformer', categoryIds: ['cat-mp-ct'] },
  { id: 'major-cap-react', name: '电抗器与电容器', industry: 'transformer', categoryIds: ['cat-mp-capacitor', 'cat-mp-reactor'] },
  { id: 'major-switchgear', name: '开关柜设备', industry: 'transformer', categoryIds: ['cat-mp-switchgear'] },
  { id: 'major-cb-high', name: '高压电力电缆', industry: 'cable', categoryIds: ['cat-mp-cb-high'] },
  { id: 'major-cb-midlow', name: '中低压电力电缆', industry: 'cable', categoryIds: ['cat-mp-cb-midlow'] },
  { id: 'major-cb-special', name: '特种电缆与橡套电缆', industry: 'cable', categoryIds: ['cat-mp-cb-special'] },
  { id: 'major-cb-drawing', name: '裸导线与架空导线', industry: 'cable', categoryIds: ['cat-mp-cb-drawing'] },
]

// 🌟 生产单位产品及关键工序对应表 (基于 0829 需求文档) - 主要产品分类接口定义
export interface ProductCategoryItem {
  id: string
  name: string // 主要产品名称 (如 "变压器-高压", "变压器-中低压-干变", "套管", "GIS", "线缆-高压" 等)
  shortName: string
  category: 'transformer' | 'cable'
  groupTag: string // 二级品类分组
  productLines?: string[]
  producerUnits: string // 生产单位 (如 "沈变本部、衡变本部、湖南电气、特能建、超高压公司")
  producerUnitIds: string[] // 对应的组织树节点 ID 列表，用于左侧组织树智能联动
  keyProcesses: string[] // 涉及关键工序 (如 ["①变压器-高压-干燥", "②变压器-试验"])
  energyTypes: string // 工序主要消耗能源 (如 "电力、蒸汽"、"电力、氮气")
  kpiIndicators: string // 关键工序对应指标
  voltageLevel: '500kV级' | '220kV级' | '110kV级' | '35kV级及以下' | 'all'
  desc: string
  unitTce: number
  unitTceStr: string
  unitElec: number
  unitElecStr: string
  steamOrNitrogen: string
  gasStr: string
  waterStr: string
  modelCount: number
  outputShare: string
  diffYoy: string
  trend12Months: { period: string; tce: number; elec: number }[]
}

// 🌟 变压器产业主要产品库 (严格对应《生产单位产品及关键工序对应表》中的 11 大主要产品)
export const TRANSFORMER_CATEGORIES: ProductCategoryItem[] = [
  // 1. 变压器-高压
  {
    id: 'cat-mp-tr-high',
    name: '变压器-高压',
    shortName: '变压器-高压',
    category: 'transformer',
    groupTag: '高压产线',
    productLines: ['高压产线', '超高压产线', '特高压产线'],
    producerUnits: '沈变本部、衡变本部、湖南电气、特能建、超高压公司',
    producerUnitIds: ['ws_sb_main', 'ws_hb_main', 'ws_hb_hn', 'ws_hb_tnj', 'ws_xb_uhv', 'comp_sb', 'comp_hb', 'comp_xb'],
    keyProcesses: ['①变压器-高压-干燥', '②变压器-试验'],
    energyTypes: '电力、蒸汽',
    kpiIndicators: '单位产值/产量综合能耗、单位电耗、单位蒸汽消耗',
    voltageLevel: '500kV级',
    desc: '超高压及特高压骨干变压器，涵盖 110kV~1000kV 单相自耦变与大型发电机主变',
    unitTce: 14.21,
    unitTceStr: '14.21 tce/万kVA',
    unitElec: 0.317,
    unitElecStr: '0.317 kWh/kVA',
    steamOrNitrogen: '3.40 t/万kVA (蒸汽)',
    gasStr: '48.0 m³/万kVA',
    waterStr: '19.2 t/万kVA',
    modelCount: 186,
    outputShare: '42.5%',
    diffYoy: '-6.2%',
    trend12Months: [
      { period: '25-09', tce: 15.15, elec: 0.338 },
      { period: '25-10', tce: 15.02, elec: 0.335 },
      { period: '25-11', tce: 14.90, elec: 0.332 },
      { period: '25-12', tce: 14.78, elec: 0.329 },
      { period: '26-01', tce: 14.65, elec: 0.326 },
      { period: '26-02', tce: 14.55, elec: 0.324 },
      { period: '26-03', tce: 14.48, elec: 0.322 },
      { period: '26-04', tce: 14.40, elec: 0.320 },
      { period: '26-05', tce: 14.35, elec: 0.319 },
      { period: '26-06', tce: 14.30, elec: 0.318 },
      { period: '26-07', tce: 14.25, elec: 0.317 },
      { period: '26-08', tce: 14.21, elec: 0.317 },
    ],
  },

  // 2. 变压器-中低压-干变
  {
    id: 'cat-mp-tr-dry',
    name: '变压器-中低压-干变',
    shortName: '中低压-干变',
    category: 'transformer',
    groupTag: '配变产线（干变）',
    productLines: ['配变产线（干变）', '配变产线（中特）', '配变产线（箱变）'],
    producerUnits: '天变公司、智能电气公司',
    producerUnitIds: ['ws_xb_tb', 'ws_xb_zndq'],
    keyProcesses: ['①变压器-中低压-干变-固化', '②变压器-试验'],
    energyTypes: '电力、蒸汽',
    kpiIndicators: '单位产值/产量综合能耗、单位电耗、单位蒸汽消耗',
    voltageLevel: '35kV级及以下',
    desc: '环氧树脂浇注干式变压器及非晶合金立体卷铁芯干变',
    unitTce: 0.76,
    unitTceStr: '0.76 tce/万kVA',
    unitElec: 0.328,
    unitElecStr: '0.328 kWh/kVA',
    steamOrNitrogen: '0.20 t/万kVA (蒸汽)',
    gasStr: '6.8 m³/万kVA',
    waterStr: '2.3 t/万kVA',
    modelCount: 520,
    outputShare: '18.5%',
    diffYoy: '-5.8%',
    trend12Months: [
      { period: '25-09', tce: 0.81, elec: 0.345 },
      { period: '25-10', tce: 0.80, elec: 0.342 },
      { period: '25-11', tce: 0.79, elec: 0.340 },
      { period: '25-12', tce: 0.79, elec: 0.338 },
      { period: '26-01', tce: 0.78, elec: 0.335 },
      { period: '26-02', tce: 0.77, elec: 0.333 },
      { period: '26-03', tce: 0.77, elec: 0.331 },
      { period: '26-04', tce: 0.765, elec: 0.330 },
      { period: '26-05', tce: 0.763, elec: 0.329 },
      { period: '26-06', tce: 0.762, elec: 0.329 },
      { period: '26-07', tce: 0.761, elec: 0.328 },
      { period: '26-08', tce: 0.760, elec: 0.328 },
    ],
  },

  // 3. 变压器-中低压-油变
  {
    id: 'cat-mp-tr-oil',
    name: '变压器-中低压-油变',
    shortName: '中低压-油变',
    category: 'transformer',
    groupTag: '配变产线（油变）',
    productLines: ['配变产线（油变）', '配变产线（中特）', '配变产线（箱变）'],
    producerUnits: '京津冀公司',
    producerUnitIds: ['ws_xb_jjj'],
    keyProcesses: ['①变压器-中低压-油变-干燥', '②变压器-试验'],
    energyTypes: '电力、蒸汽',
    kpiIndicators: '单位产值/产量综合能耗、单位电耗、单位蒸汽消耗',
    voltageLevel: '35kV级及以下',
    desc: '35kV 及 10kV 节能型油浸式配电变压器、非晶配变',
    unitTce: 0.92,
    unitTceStr: '0.92 tce/万kVA',
    unitElec: 0.322,
    unitElecStr: '0.322 kWh/kVA',
    steamOrNitrogen: '0.25 t/万kVA (蒸汽)',
    gasStr: '8.2 m³/万kVA',
    waterStr: '2.8 t/万kVA',
    modelCount: 355,
    outputShare: '12.0%',
    diffYoy: '-5.8%',
    trend12Months: [
      { period: '25-09', tce: 0.98, elec: 0.342 },
      { period: '25-10', tce: 0.97, elec: 0.339 },
      { period: '25-11', tce: 0.96, elec: 0.336 },
      { period: '25-12', tce: 0.95, elec: 0.334 },
      { period: '26-01', tce: 0.94, elec: 0.331 },
      { period: '26-02', tce: 0.935, elec: 0.328 },
      { period: '26-03', tce: 0.93, elec: 0.326 },
      { period: '26-04', tce: 0.926, elec: 0.325 },
      { period: '26-05', tce: 0.924, elec: 0.324 },
      { period: '26-06', tce: 0.922, elec: 0.323 },
      { period: '26-07', tce: 0.921, elec: 0.322 },
      { period: '26-08', tce: 0.920, elec: 0.322 },
    ],
  },

  // 4. 变压器-铁芯
  {
    id: 'cat-mp-tr-core',
    name: '变压器-铁芯',
    shortName: '变压器-铁芯',
    category: 'transformer',
    groupTag: '硅钢产线（横剪）',
    productLines: ['硅钢产线（横剪）'],
    producerUnits: '珠峰硅钢',
    producerUnitIds: ['ws_xb_zf'],
    keyProcesses: ['①非晶合金铁心-退火', '②硅钢铁心-纵剪', '③硅钢铁心-中型叠装', '④硅钢铁心-大型叠装'],
    energyTypes: '电力',
    kpiIndicators: '单位产量电耗 (退火/纵剪/中大型叠装)',
    voltageLevel: 'all',
    desc: '取向硅钢铁心剪切叠装与非晶合金铁心真空退火加工',
    unitTce: 0.175,
    unitTceStr: '0.175 tce/t',
    unitElec: 142.5,
    unitElecStr: '142.5 kWh/t',
    steamOrNitrogen: '— (无蒸汽)',
    gasStr: '3.5 m³/t',
    waterStr: '0.6 t/t',
    modelCount: 160,
    outputShare: '6.5%',
    diffYoy: '-6.5%',
    trend12Months: [
      { period: '25-09', tce: 0.188, elec: 152.0 },
      { period: '25-10', tce: 0.185, elec: 150.0 },
      { period: '25-11', tce: 0.183, elec: 148.5 },
      { period: '25-12', tce: 0.180, elec: 146.0 },
      { period: '26-01', tce: 0.178, elec: 145.0 },
      { period: '26-02', tce: 0.177, elec: 144.2 },
      { period: '26-03', tce: 0.176, elec: 143.5 },
      { period: '26-04', tce: 0.175, elec: 143.0 },
      { period: '26-05', tce: 0.175, elec: 142.8 },
      { period: '26-06', tce: 0.175, elec: 142.6 },
      { period: '26-07', tce: 0.175, elec: 142.5 },
      { period: '26-08', tce: 0.175, elec: 142.5 },
    ],
  },

  // 5. 套管
  {
    id: 'cat-mp-bushing',
    name: '套管',
    shortName: '套管',
    category: 'transformer',
    groupTag: '套管产线',
    productLines: ['套管产线'],
    producerUnits: '和新套管公司',
    producerUnitIds: ['ws_sb_hx'],
    keyProcesses: ['①套管-干燥'],
    energyTypes: '电力',
    kpiIndicators: '单位产值电耗、套管干燥电耗',
    voltageLevel: '500kV级',
    desc: '特高压胶浸纸电容式套管及油纸电容式高压穿墙套管',
    unitTce: 0.420,
    unitTceStr: '0.420 tce/支',
    unitElec: 315,
    unitElecStr: '315 kWh/支',
    steamOrNitrogen: '— (无蒸汽)',
    gasStr: '4.8 m³/支',
    waterStr: '1.2 t/支',
    modelCount: 85,
    outputShare: '3.5%',
    diffYoy: '-5.4%',
    trend12Months: [
      { period: '25-09', tce: 0.445, elec: 334 },
      { period: '25-10', tce: 0.440, elec: 330 },
      { period: '25-11', tce: 0.436, elec: 327 },
      { period: '25-12', tce: 0.432, elec: 324 },
      { period: '26-01', tce: 0.428, elec: 321 },
      { period: '26-02', tce: 0.425, elec: 319 },
      { period: '26-03', tce: 0.423, elec: 317 },
      { period: '26-04', tce: 0.421, elec: 316 },
      { period: '26-05', tce: 0.421, elec: 316 },
      { period: '26-06', tce: 0.420, elec: 315 },
      { period: '26-07', tce: 0.420, elec: 315 },
      { period: '26-08', tce: 0.420, elec: 315 },
    ],
  },

  // 6. 互感器
  {
    id: 'cat-mp-ct',
    name: '互感器',
    shortName: '互感器',
    category: 'transformer',
    groupTag: '互感器产线',
    productLines: ['互感器产线'],
    producerUnits: '康嘉互感器',
    producerUnitIds: ['ws_sb_kj'],
    keyProcesses: ['①互感器-干燥', '②变压器-试验'],
    energyTypes: '电力、蒸汽',
    kpiIndicators: '单位产值综合能耗、单位产值电耗、单位产值蒸汽消耗',
    voltageLevel: '220kV级',
    desc: '高压及超高压电流互感器、电压互感器 (CT/PT)',
    unitTce: 0.385,
    unitTceStr: '0.385 tce/台',
    unitElec: 280,
    unitElecStr: '280 kWh/台',
    steamOrNitrogen: '0.08 t/台 (蒸汽)',
    gasStr: '4.2 m³/台',
    waterStr: '1.0 t/台',
    modelCount: 110,
    outputShare: '3.8%',
    diffYoy: '-5.2%',
    trend12Months: [
      { period: '25-09', tce: 0.408, elec: 296 },
      { period: '25-10', tce: 0.402, elec: 292 },
      { period: '25-11', tce: 0.398, elec: 289 },
      { period: '25-12', tce: 0.394, elec: 286 },
      { period: '26-01', tce: 0.390, elec: 284 },
      { period: '26-02', tce: 0.388, elec: 282 },
      { period: '26-03', tce: 0.386, elec: 281 },
      { period: '26-04', tce: 0.385, elec: 280 },
      { period: '26-05', tce: 0.385, elec: 280 },
      { period: '26-06', tce: 0.385, elec: 280 },
      { period: '26-07', tce: 0.385, elec: 280 },
      { period: '26-08', tce: 0.385, elec: 280 },
    ],
  },

  // 7. 中低压开关柜
  {
    id: 'cat-mp-switchgear',
    name: '中低压开关柜',
    shortName: '中低压开关柜',
    category: 'transformer',
    groupTag: '开关柜产线',
    productLines: ['开关柜产线', '二次产线'],
    producerUnits: '云集电气、新疆自控',
    producerUnitIds: ['ws_hb_yj', 'ws_hb_xj'],
    keyProcesses: ['①中低压开关柜-钣金加工', '②中低压开关柜-钣金喷涂'],
    energyTypes: '电力',
    kpiIndicators: '单位产值电耗、钣金加工及涂装单耗',
    voltageLevel: '35kV级及以下',
    desc: 'KYN28/HXGN 铠装移开式金属封闭开关柜、智能低压柜',
    unitTce: 0.210,
    unitTceStr: '0.210 tce/面',
    unitElec: 165,
    unitElecStr: '165 kWh/面',
    steamOrNitrogen: '— (无蒸汽)',
    gasStr: '5.2 m³/面',
    waterStr: '0.8 t/面',
    modelCount: 240,
    outputShare: '4.5%',
    diffYoy: '-4.8%',
    trend12Months: [
      { period: '25-09', tce: 0.222, elec: 174 },
      { period: '25-10', tce: 0.219, elec: 172 },
      { period: '25-11', tce: 0.217, elec: 170 },
      { period: '25-12', tce: 0.215, elec: 168 },
      { period: '26-01', tce: 0.213, elec: 167 },
      { period: '26-02', tce: 0.212, elec: 166 },
      { period: '26-03', tce: 0.211, elec: 165 },
      { period: '26-04', tce: 0.210, elec: 165 },
      { period: '26-05', tce: 0.210, elec: 165 },
      { period: '26-06', tce: 0.210, elec: 165 },
      { period: '26-07', tce: 0.210, elec: 165 },
      { period: '26-08', tce: 0.210, elec: 165 },
    ],
  },

  // 8. GIS
  {
    id: 'cat-mp-gis',
    name: 'GIS (气体绝缘金属封闭开关设备)',
    shortName: 'GIS',
    category: 'transformer',
    groupTag: 'GIS 产线',
    productLines: ['GIS 产线'],
    producerUnits: '云集高压开关',
    producerUnitIds: ['ws_hb_kg'],
    keyProcesses: ['①GIS-抽真空', '②GIS-绝缘件干燥', '③GIS-工频耐压试验', '④GIS-空调恒温除湿'],
    energyTypes: '电力',
    kpiIndicators: '单位产值电耗、抽真空/干燥/耐压试验工序电耗',
    voltageLevel: '500kV级',
    desc: '126kV~550kV 气体绝缘金属封闭全组合电器 (GIS)',
    unitTce: 1.850,
    unitTceStr: '1.850 tce/间隔',
    unitElec: 1420,
    unitElecStr: '1,420 kWh/间隔',
    steamOrNitrogen: '— (无蒸汽)',
    gasStr: '12.0 m³/间隔',
    waterStr: '3.5 t/间隔',
    modelCount: 45,
    outputShare: '3.2%',
    diffYoy: '-6.0%',
    trend12Months: [
      { period: '25-09', tce: 1.980, elec: 1515 },
      { period: '25-10', tce: 1.950, elec: 1495 },
      { period: '25-11', tce: 1.920, elec: 1470 },
      { period: '25-12', tce: 1.895, elec: 1450 },
      { period: '26-01', tce: 0.875, elec: 1438 },
      { period: '26-02', tce: 1.865, elec: 1430 },
      { period: '26-03', tce: 1.858, elec: 1425 },
      { period: '26-04', tce: 1.853, elec: 1422 },
      { period: '26-05', tce: 1.851, elec: 1421 },
      { period: '26-06', tce: 1.850, elec: 1420 },
      { period: '26-07', tce: 1.850, elec: 1420 },
      { period: '26-08', tce: 1.850, elec: 1420 },
    ],
  },

  // 9. 干式电抗器
  {
    id: 'cat-mp-reactor',
    name: '干式电抗器',
    shortName: '干式电抗器',
    category: 'transformer',
    groupTag: '电抗器产线（干式空心）',
    productLines: ['电抗器产线（干式空心）'],
    producerUnits: '合容电气股份',
    producerUnitIds: ['ws_hb_hr'],
    keyProcesses: ['①干式电抗器-固化', '②干式电抗器-试验'],
    energyTypes: '电力',
    kpiIndicators: '单位产值电耗、固化与试验工序电耗',
    voltageLevel: '220kV级',
    desc: '空心干式并联电抗器、干式滤波电抗器及消弧线圈',
    unitTce: 0.680,
    unitTceStr: '0.680 tce/台',
    unitElec: 520,
    unitElecStr: '520 kWh/台',
    steamOrNitrogen: '— (无蒸汽)',
    gasStr: '6.5 m³/台',
    waterStr: '1.5 t/台',
    modelCount: 95,
    outputShare: '2.5%',
    diffYoy: '-5.1%',
    trend12Months: [
      { period: '25-09', tce: 0.720, elec: 550 },
      { period: '25-10', tce: 0.710, elec: 542 },
      { period: '25-11', tce: 0.702, elec: 536 },
      { period: '25-12', tce: 0.695, elec: 531 },
      { period: '26-01', tce: 0.690, elec: 527 },
      { period: '26-02', tce: 0.686, elec: 524 },
      { period: '26-03', tce: 0.683, elec: 522 },
      { period: '26-04', tce: 0.681, elec: 521 },
      { period: '26-05', tce: 0.680, elec: 520 },
      { period: '26-06', tce: 0.680, elec: 520 },
      { period: '26-07', tce: 0.680, elec: 520 },
      { period: '26-08', tce: 0.680, elec: 520 },
    ],
  },

  // 10. 电容器
  {
    id: 'cat-mp-capacitor',
    name: '电容器',
    shortName: '电容器',
    category: 'transformer',
    groupTag: '电容器产线（油浸式）',
    productLines: ['电容器产线（油浸式）', '电容器产线（干式）'],
    producerUnits: '合容电力设备',
    producerUnitIds: ['ws_hb_hr'],
    keyProcesses: ['①电容器-芯子卷绕', '②电容器-真空浸渍', '③电容器-喷漆', '④电容器-试验'],
    energyTypes: '电力',
    kpiIndicators: '单位产值电耗、芯子卷绕与真空浸渍工序电耗',
    voltageLevel: '110kV级',
    desc: '高压并联电力电容器、交流滤波电容器及电容器成套装置',
    unitTce: 0.145,
    unitTceStr: '0.145 tce/kvar',
    unitElec: 112,
    unitElecStr: '112 kWh/kvar',
    steamOrNitrogen: '— (无蒸汽)',
    gasStr: '2.1 m³/kvar',
    waterStr: '0.4 t/kvar',
    modelCount: 130,
    outputShare: '2.0%',
    diffYoy: '-4.6%',
    trend12Months: [
      { period: '25-09', tce: 0.153, elec: 118 },
      { period: '25-10', tce: 0.151, elec: 116 },
      { period: '25-11', tce: 0.149, elec: 115 },
      { period: '25-12', tce: 0.148, elec: 114 },
      { period: '26-01', tce: 0.147, elec: 113 },
      { period: '26-02', tce: 0.146, elec: 113 },
      { period: '26-03', tce: 0.145, elec: 112 },
      { period: '26-04', tce: 0.145, elec: 112 },
      { period: '26-05', tce: 0.145, elec: 112 },
      { period: '26-06', tce: 0.145, elec: 112 },
      { period: '26-07', tce: 0.145, elec: 112 },
      { period: '26-08', tce: 0.145, elec: 112 },
    ],
  },

  // 11. GIL
  {
    id: 'cat-mp-gil',
    name: 'GIL (气体绝缘输电线路)',
    shortName: 'GIL',
    category: 'transformer',
    groupTag: 'GIL 产线',
    productLines: ['GIL 产线'],
    producerUnits: '赛杰爱迪',
    producerUnitIds: ['ws_hb_gil'],
    keyProcesses: ['①GIL-螺旋焊管生产', '②GIL-绝缘子生产', '③GIL-测试'],
    energyTypes: '电力',
    kpiIndicators: '单位产值电耗、焊管与绝缘子生产测试工序电耗',
    voltageLevel: '500kV级',
    desc: '500kV/220kV 气体绝缘金属封闭输电线路及三相共箱 GIL',
    unitTce: 0.820,
    unitTceStr: '0.820 tce/百米',
    unitElec: 635,
    unitElecStr: '635 kWh/百米',
    steamOrNitrogen: '— (无蒸汽)',
    gasStr: '8.0 m³/百米',
    waterStr: '1.8 t/百米',
    modelCount: 38,
    outputShare: '1.0%',
    diffYoy: '-5.5%',
    trend12Months: [
      { period: '25-09', tce: 0.872, elec: 675 },
      { period: '25-10', tce: 0.860, elec: 665 },
      { period: '25-11', tce: 0.850, elec: 658 },
      { period: '25-12', tce: 0.840, elec: 650 },
      { period: '26-01', tce: 0.832, elec: 644 },
      { period: '26-02', tce: 0.828, elec: 640 },
      { period: '26-03', tce: 0.824, elec: 638 },
      { period: '26-04', tce: 0.822, elec: 636 },
      { period: '26-05', tce: 0.821, elec: 635 },
      { period: '26-06', tce: 0.820, elec: 635 },
      { period: '26-07', tce: 0.820, elec: 635 },
      { period: '26-08', tce: 0.820, elec: 635 },
    ],
  },
]

// 🌟 线缆产业主要产品库 (严格对应《生产单位产品及关键工序对应表》中的 4 大主要产品)
export const CABLE_CATEGORIES: ProductCategoryItem[] = [
  // 1. 线缆-高压
  {
    id: 'cat-mp-cb-high',
    name: '线缆-高压',
    shortName: '线缆-高压',
    category: 'cable',
    groupTag: '高压力缆产线',
    productLines: ['高压力缆产线'],
    producerUnits: '鲁缆本部',
    producerUnitIds: ['ws_ll_main', 'comp_ll'],
    keyProcesses: ['①线缆-高压-交联（干法）', '②线缆-拉丝'],
    energyTypes: '电力、氮气',
    kpiIndicators: '单位产量电耗、单位吨铜电耗、单位吨铝电耗、氮气消耗量',
    voltageLevel: '500kV级',
    desc: '110kV~500kV 皱纹铝套超高压交联聚乙烯电力电缆 (立塔 VCV 交联工艺)',
    unitTce: 0.877,
    unitTceStr: '0.877 tce/万km·mm²',
    unitElec: 6616,
    unitElecStr: '6,616 kWh/万km·mm²',
    steamOrNitrogen: '19.7 m³/万km·mm² (氮气)',
    gasStr: '12.2 m³/万km·mm²',
    waterStr: '2.6 t/万km·mm²',
    modelCount: 168,
    outputShare: '32.5%',
    diffYoy: '-6.8%',
    trend12Months: [
      { period: '25-09', tce: 0.941, elec: 7080 },
      { period: '25-10', tce: 0.932, elec: 7020 },
      { period: '25-11', tce: 0.924, elec: 6960 },
      { period: '25-12', tce: 0.915, elec: 6900 },
      { period: '26-01', tce: 0.908, elec: 6840 },
      { period: '26-02', tce: 0.900, elec: 6780 },
      { period: '26-03', tce: 0.893, elec: 6730 },
      { period: '26-04', tce: 0.888, elec: 6690 },
      { period: '26-05', tce: 0.884, elec: 6660 },
      { period: '26-06', tce: 0.880, elec: 6635 },
      { period: '26-07', tce: 0.878, elec: 6620 },
      { period: '26-08', tce: 0.877, elec: 6616 },
    ],
  },

  // 2. 线缆-中低压
  {
    id: 'cat-mp-cb-midlow',
    name: '线缆-中低压',
    shortName: '线缆-中低压',
    category: 'cable',
    groupTag: '中低压力缆产线',
    productLines: ['中压力缆产线', '低压力缆产线'],
    producerUnits: '鲁缆本部、特变电工新疆电缆有限公司、特变电工新疆线缆厂、特变电工（德阳）电缆股份有限公司',
    producerUnitIds: ['ws_ll_main', 'ws_xl_main', 'ws_xl_sub', 'ws_dl_main', 'comp_ll', 'comp_xl', 'comp_dl'],
    keyProcesses: ['①线缆-拉丝', '②线缆-中低压-交联（干法）'],
    energyTypes: '电力、氮气',
    kpiIndicators: '单位产量电耗、单位吨铜电耗、单位吨铝电耗、氮气单耗',
    voltageLevel: '35kV级及以下',
    desc: '35kV/10kV 钢带铠装交联电力电缆及 0.6/1kV 低烟无卤阻燃电力电缆',
    unitTce: 0.238,
    unitTceStr: '0.238 tce/万km·mm²',
    unitElec: 1785,
    unitElecStr: '1,785 kWh/万km·mm²',
    steamOrNitrogen: '6.6 m³/万km·mm² (氮气)',
    gasStr: '4.3 m³/万km·mm²',
    waterStr: '0.9 t/万km·mm²',
    modelCount: 980,
    outputShare: '42.0%',
    diffYoy: '-5.3%',
    trend12Months: [
      { period: '25-09', tce: 0.252, elec: 1890 },
      { period: '25-10', tce: 0.250, elec: 1875 },
      { period: '25-11', tce: 0.247, elec: 1855 },
      { period: '25-12', tce: 0.245, elec: 1840 },
      { period: '26-01', tce: 0.243, elec: 1825 },
      { period: '26-02', tce: 0.241, elec: 1810 },
      { period: '26-03', tce: 0.240, elec: 1800 },
      { period: '26-04', tce: 0.239, elec: 1795 },
      { period: '26-05', tce: 0.239, elec: 1790 },
      { period: '26-06', tce: 0.238, elec: 1788 },
      { period: '26-07', tce: 0.238, elec: 1786 },
      { period: '26-08', tce: 0.238, elec: 1785 },
    ],
  },

  // 3. 线缆-特种电缆
  {
    id: 'cat-mp-cb-special',
    name: '线缆-特种电缆',
    shortName: '线缆-特种电缆',
    category: 'cable',
    groupTag: '特种电缆产线',
    productLines: ['特种电缆产线', '橡套电缆产线', '电气装备电缆产线'],
    producerUnits: '曙光公司',
    producerUnitIds: ['ws_ll_sg'],
    keyProcesses: ['①特种绝缘挤出', '②辐照交联', '③耐寒耐扭曲编织铠装'],
    energyTypes: '电力、氮气、天然气',
    kpiIndicators: '单位产量电耗、光伏风电储能专用特种电缆单耗',
    voltageLevel: '35kV级及以下',
    desc: '光伏耐候直流电缆、风电耐扭曲软电缆、储能高压电缆、矿物绝缘柔性防火电缆',
    unitTce: 0.155,
    unitTceStr: '0.155 tce/万km·mm²',
    unitElec: 1165,
    unitElecStr: '1,165 kWh/万km·mm²',
    steamOrNitrogen: '4.2 m³/万km·mm² (氮气)',
    gasStr: '3.2 m³/万km·mm²',
    waterStr: '0.7 t/万km·mm²',
    modelCount: 450,
    outputShare: '15.5%',
    diffYoy: '-5.8%',
    trend12Months: [
      { period: '25-09', tce: 0.165, elec: 1240 },
      { period: '25-10', tce: 0.163, elec: 1225 },
      { period: '25-11', tce: 0.161, elec: 1210 },
      { period: '25-12', tce: 0.159, elec: 1195 },
      { period: '26-01', tce: 0.158, elec: 1188 },
      { period: '26-02', tce: 0.157, elec: 1180 },
      { period: '26-03', tce: 0.156, elec: 1175 },
      { period: '26-04', tce: 0.156, elec: 1172 },
      { period: '26-05', tce: 0.155, elec: 1168 },
      { period: '26-06', tce: 0.155, elec: 1166 },
      { period: '26-07', tce: 0.155, elec: 1165 },
      { period: '26-08', tce: 0.155, elec: 1165 },
    ],
  },

  // 4. 架空导线及铜铝拉丝产品
  {
    id: 'cat-mp-cb-drawing',
    name: '架空导线及铜铝拉丝',
    shortName: '架空导线及拉丝',
    category: 'cable',
    groupTag: '导线及布电线产线',
    productLines: ['导线产线', '布电线产线'],
    producerUnits: '鲁缆、新疆线缆厂、德阳电缆',
    producerUnitIds: ['ws_ll_main', 'ws_xl_sub', 'ws_dl_main'],
    keyProcesses: ['①线缆-拉丝 (单位吨铜电耗/单位吨铝电耗)', '②多股绞线'],
    energyTypes: '电力',
    kpiIndicators: '单位吨铜电耗、单位吨铝电耗、多股绞线单耗',
    voltageLevel: 'all',
    desc: 'JKLYJ 架空绝缘导线、LGJ 钢芯铝绞线、高导电率铝合金导线及控制电缆',
    unitTce: 0.086,
    unitTceStr: '0.086 tce/万km·mm²',
    unitElec: 645,
    unitElecStr: '645 kWh/万km·mm²',
    steamOrNitrogen: '1.2 m³/万km·mm² (氮气)',
    gasStr: '1.5 m³/万km·mm²',
    waterStr: '0.3 t/万km·mm²',
    modelCount: 580,
    outputShare: '10.0%',
    diffYoy: '-5.0%',
    trend12Months: [
      { period: '25-09', tce: 0.091, elec: 685 },
      { period: '25-10', tce: 0.090, elec: 675 },
      { period: '25-11', tce: 0.089, elec: 668 },
      { period: '25-12', tce: 0.088, elec: 660 },
      { period: '26-01', tce: 0.088, elec: 658 },
      { period: '26-02', tce: 0.087, elec: 652 },
      { period: '26-03', tce: 0.087, elec: 650 },
      { period: '26-04', tce: 0.086, elec: 648 },
      { period: '26-05', tce: 0.086, elec: 646 },
      { period: '26-06', tce: 0.086, elec: 645 },
      { period: '26-07', tce: 0.086, elec: 645 },
      { period: '26-08', tce: 0.086, elec: 645 },
    ],
  },
]

// 产品型号单耗记录接口 (按产品型号规格聚合，支持几千条型号)
interface ProductModelRecord {
  id: string
  modelCode: string
  modelName: string
  category: 'transformer' | 'cable'
  categoryId?: string
  voltageLevel: string
  companyId: string
  companyName: string
  productionVolume: string
  // 1. 单位产品综合能耗
  unitTce: string
  // 2. 单位产品电耗
  unitElecKWh: string
  // 3. 单位产品蒸汽消耗 (变压器类有)
  unitSteamTon?: string
  // 4. 单位产品氮气消耗 (线缆类干法交联有)
  unitNitrogenM3?: string
  // 5. 单位产品天然气消耗
  unitGasM3?: string
  // 6. 单位产品水耗
  unitWaterTon?: string
  diffYoy: string
  quotaStatus: '先进标杆' | '达标受控' | '良好'
}

// 丰富的产品型号单耗数据库 (模拟上千条产品型号库中的核心代表型号，归属 11 大变压器主要产品与 4 大线缆主要产品)
const ALL_PRODUCT_MODELS: ProductModelRecord[] = [
  // ---------------------- 变压器类主要产品型号 (电力、蒸汽、天然气、水) ----------------------
  // 1. 变压器-高压 (cat-mp-tr-high)
  {
    id: 'm-tr-1000-01',
    modelCode: 'TR-1000-ODFPS-1000',
    modelName: 'ODFPS-1000MVA/1000kV 特高压单相自耦变压器',
    category: 'transformer',
    categoryId: 'cat-mp-tr-high',
    voltageLevel: '500kV级',
    companyId: 'ws_sb_main',
    companyName: '沈变本部',
    productionVolume: '3,000 MVA (3台)',
    unitTce: '16.85 tce/万kVA',
    unitElecKWh: '0.312 kWh/kVA',
    unitSteamTon: '4.20 t/万kVA',
    unitGasM3: '56.0 m³/万kVA',
    unitWaterTon: '22.5 t/万kVA',
    diffYoy: '-6.8%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-tr-750-01',
    modelCode: 'TR-750-ODFS-500',
    modelName: 'ODFS-500MVA/750kV 单相自耦无励磁调压变压器',
    category: 'transformer',
    categoryId: 'cat-mp-tr-high',
    voltageLevel: '500kV级',
    companyId: 'ws_xb_uhv',
    companyName: '超高压公司',
    productionVolume: '2,000 MVA (4台)',
    unitTce: '15.20 tce/万kVA',
    unitElecKWh: '0.315 kWh/kVA',
    unitSteamTon: '3.80 t/万kVA',
    unitGasM3: '51.0 m³/万kVA',
    unitWaterTon: '20.6 t/万kVA',
    diffYoy: '-6.5%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-tr-01',
    modelCode: 'TR-500-ODFS-334',
    modelName: 'ODFS-334MVA/500kV 单相自耦无励磁调压变压器',
    category: 'transformer',
    categoryId: 'cat-mp-tr-high',
    voltageLevel: '500kV级',
    companyId: 'ws_sb_main',
    companyName: '沈变本部',
    productionVolume: '1,670 MVA (5台)',
    unitTce: '14.21 tce/万kVA',
    unitElecKWh: '0.317 kWh/kVA',
    unitSteamTon: '3.40 t/万kVA',
    unitGasM3: '48.0 m³/万kVA',
    unitWaterTon: '19.2 t/万kVA',
    diffYoy: '-6.2%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-tr-02',
    modelCode: 'TR-500-SSP-840',
    modelName: 'SSP-840MVA/500kV 三相发电机主变压器',
    category: 'transformer',
    categoryId: 'cat-mp-tr-high',
    voltageLevel: '500kV级',
    companyId: 'ws_hb_main',
    companyName: '衡变本部',
    productionVolume: '1,680 MVA (2台)',
    unitTce: '13.80 tce/万kVA',
    unitElecKWh: '0.318 kWh/kVA',
    unitSteamTon: '3.20 t/万kVA',
    unitGasM3: '46.5 m³/万kVA',
    unitWaterTon: '18.6 t/万kVA',
    diffYoy: '-5.9%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-tr-05',
    modelCode: 'TR-220-SFZ11-240',
    modelName: 'SFZ11-240MVA/220kV 三相三绕组有载调压变压器',
    category: 'transformer',
    categoryId: 'cat-mp-tr-high',
    voltageLevel: '220kV级',
    companyId: 'ws_hb_hn',
    companyName: '湖南电气',
    productionVolume: '720 MVA (3台)',
    unitTce: '7.02 tce/万kVA',
    unitElecKWh: '0.325 kWh/kVA',
    unitSteamTon: '1.70 t/万kVA',
    unitGasM3: '24.0 m³/万kVA',
    unitWaterTon: '10.5 t/万kVA',
    diffYoy: '-5.3%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-tr-07',
    modelCode: 'TR-110-SZ11-50',
    modelName: 'SZ11-50000kVA/110kV 节能型有载调压变压器',
    category: 'transformer',
    categoryId: 'cat-mp-tr-high',
    voltageLevel: '110kV级',
    companyId: 'ws_sb_main',
    companyName: '沈变本部',
    productionVolume: '450 MVA (9台)',
    unitTce: '4.25 tce/万kVA',
    unitElecKWh: '0.327 kWh/kVA',
    unitSteamTon: '1.18 t/万kVA',
    unitGasM3: '15.5 m³/万kVA',
    unitWaterTon: '8.4 t/万kVA',
    diffYoy: '-4.9%',
    quotaStatus: '达标受控',
  },

  // 2. 变压器-中低压-干变 (cat-mp-tr-dry)
  {
    id: 'm-tr-10',
    modelCode: 'TR-35-SCB13-2500',
    modelName: 'SCB13-2500kVA/35kV 环氧树脂浇注干式变压器',
    category: 'transformer',
    categoryId: 'cat-mp-tr-dry',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xb_tb',
    companyName: '天变公司',
    productionVolume: '45 MVA (18台)',
    unitTce: '0.85 tce/万kVA',
    unitElecKWh: '0.318 kWh/kVA',
    unitSteamTon: '0.22 t/万kVA',
    unitGasM3: '7.8 m³/万kVA',
    unitWaterTon: '2.6 t/万kVA',
    diffYoy: '-6.5%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-tr-11',
    modelCode: 'TR-10-SCB14-2000',
    modelName: 'SCB14-2000kVA/10kV 新一代节能干式配电变压器',
    category: 'transformer',
    categoryId: 'cat-mp-tr-dry',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xb_zndq',
    companyName: '智能电气公司',
    productionVolume: '48 MVA (24台)',
    unitTce: '0.70 tce/万kVA',
    unitElecKWh: '0.328 kWh/kVA',
    unitSteamTon: '0.19 t/万kVA',
    unitGasM3: '6.5 m³/万kVA',
    unitWaterTon: '2.2 t/万kVA',
    diffYoy: '-5.4%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-tr-10-am-01',
    modelCode: 'TR-10-SCBH15-1250',
    modelName: 'SCBH15-1250kVA/10kV 非晶合金立体卷铁芯干变',
    category: 'transformer',
    categoryId: 'cat-mp-tr-dry',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xb_tb',
    companyName: '天变公司',
    productionVolume: '25 MVA (20台)',
    unitTce: '0.65 tce/万kVA',
    unitElecKWh: '0.315 kWh/kVA',
    unitSteamTon: '0.18 t/万kVA',
    unitGasM3: '6.0 m³/万kVA',
    unitWaterTon: '2.0 t/万kVA',
    diffYoy: '-7.0%',
    quotaStatus: '先进标杆',
  },

  // 3. 变压器-中低压-油变 (cat-mp-tr-oil)
  {
    id: 'm-tr-35-oil-01',
    modelCode: 'TR-35-S13-1600',
    modelName: 'S13-1600kVA/35kV 节能油浸式配电变压器',
    category: 'transformer',
    categoryId: 'cat-mp-tr-oil',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xb_jjj',
    companyName: '京津冀公司',
    productionVolume: '32 MVA (20台)',
    unitTce: '0.92 tce/万kVA',
    unitElecKWh: '0.322 kWh/kVA',
    unitSteamTon: '0.25 t/万kVA',
    unitGasM3: '8.2 m³/万kVA',
    unitWaterTon: '2.8 t/万kVA',
    diffYoy: '-5.8%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-tr-10-oil-am-01',
    modelCode: 'TR-10-SBH15-630',
    modelName: 'SBH15-630kVA/10kV 油浸式非晶合金配电变压器',
    category: 'transformer',
    categoryId: 'cat-mp-tr-oil',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xb_jjj',
    companyName: '京津冀公司',
    productionVolume: '18.9 MVA (30台)',
    unitTce: '0.58 tce/万kVA',
    unitElecKWh: '0.312 kWh/kVA',
    unitSteamTon: '0.16 t/万kVA',
    unitGasM3: '5.5 m³/万kVA',
    unitWaterTon: '1.8 t/万kVA',
    diffYoy: '-6.2%',
    quotaStatus: '先进标杆',
  },

  // 4. 变压器-铁芯 (cat-mp-tr-core)
  {
    id: 'm-tr-core-01',
    modelCode: 'TR-CORE-Q-01',
    modelName: '高导磁取向硅钢铁心纵剪叠装组件 (大型主变专用)',
    category: 'transformer',
    categoryId: 'cat-mp-tr-core',
    voltageLevel: 'all',
    companyId: 'ws_xb_zf',
    companyName: '珠峰硅钢',
    productionVolume: '1,200 吨',
    unitTce: '0.175 tce/t',
    unitElecKWh: '142.5 kWh/t',
    unitGasM3: '3.5 m³/t',
    unitWaterTon: '0.6 t/t',
    diffYoy: '-6.5%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-tr-core-02',
    modelCode: 'TR-CORE-AM-02',
    modelName: '非晶合金立体卷铁芯 (真空退火工序)',
    category: 'transformer',
    categoryId: 'cat-mp-tr-core',
    voltageLevel: 'all',
    companyId: 'ws_xb_zf',
    companyName: '珠峰硅钢',
    productionVolume: '450 吨',
    unitTce: '0.162 tce/t',
    unitElecKWh: '131.8 kWh/t',
    unitGasM3: '3.1 m³/t',
    unitWaterTon: '0.5 t/t',
    diffYoy: '-7.2%',
    quotaStatus: '先进标杆',
  },

  // 5. 套管 (cat-mp-bushing)
  {
    id: 'm-bush-01',
    modelCode: 'BSH-500-RIP',
    modelName: '500kV 胶浸纸电容式变压器出线套管 (干燥工序)',
    category: 'transformer',
    categoryId: 'cat-mp-bushing',
    voltageLevel: '500kV级',
    companyId: 'ws_sb_hx',
    companyName: '和新套管公司',
    productionVolume: '120 支',
    unitTce: '0.420 tce/支',
    unitElecKWh: '315 kWh/支',
    unitGasM3: '4.8 m³/支',
    unitWaterTon: '1.2 t/支',
    diffYoy: '-5.4%',
    quotaStatus: '先进标杆',
  },

  // 6. 互感器 (cat-mp-ct)
  {
    id: 'm-ct-01',
    modelCode: 'CT-220-LB',
    modelName: '220kV 油浸倒立式电流互感器 (干燥与试验工序)',
    category: 'transformer',
    categoryId: 'cat-mp-ct',
    voltageLevel: '220kV级',
    companyId: 'ws_sb_kj',
    companyName: '康嘉互感器',
    productionVolume: '360 台',
    unitTce: '0.385 tce/台',
    unitElecKWh: '280 kWh/台',
    unitSteamTon: '0.08 t/台',
    unitGasM3: '4.2 m³/台',
    unitWaterTon: '1.0 t/台',
    diffYoy: '-5.2%',
    quotaStatus: '先进标杆',
  },

  // 7. 中低压开关柜 (cat-mp-switchgear)
  {
    id: 'm-sw-01',
    modelCode: 'SW-KYN28-12',
    modelName: 'KYN28-12 铠装移开式交流金属封闭开关设备 (钣金与涂装)',
    category: 'transformer',
    categoryId: 'cat-mp-switchgear',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_hb_yj',
    companyName: '云集电气',
    productionVolume: '480 面',
    unitTce: '0.210 tce/面',
    unitElecKWh: '165 kWh/面',
    unitGasM3: '5.2 m³/面',
    unitWaterTon: '0.8 t/面',
    diffYoy: '-4.8%',
    quotaStatus: '先进标杆',
  },

  // 8. GIS (cat-mp-gis)
  {
    id: 'm-gis-01',
    modelCode: 'GIS-ZF-252',
    modelName: 'ZF-252kV 气体绝缘金属封闭开关设备 (抽真空与工频试验)',
    category: 'transformer',
    categoryId: 'cat-mp-gis',
    voltageLevel: '500kV级',
    companyId: 'ws_hb_kg',
    companyName: '云集高压开关',
    productionVolume: '42 间隔',
    unitTce: '1.850 tce/间隔',
    unitElecKWh: '1,420 kWh/间隔',
    unitGasM3: '12.0 m³/间隔',
    unitWaterTon: '3.5 t/间隔',
    diffYoy: '-6.0%',
    quotaStatus: '先进标杆',
  },

  // 9. 干式电抗器 (cat-mp-reactor)
  {
    id: 'm-reac-01',
    modelCode: 'REA-BKG-35',
    modelName: 'BKG-35kV 户内空心干式并联电抗器 (固化与试验工序)',
    category: 'transformer',
    categoryId: 'cat-mp-reactor',
    voltageLevel: '220kV级',
    companyId: 'ws_hb_hr',
    companyName: '合容电气',
    productionVolume: '85 台',
    unitTce: '0.680 tce/台',
    unitElecKWh: '520 kWh/台',
    unitGasM3: '6.5 m³/台',
    unitWaterTon: '1.5 t/台',
    diffYoy: '-5.1%',
    quotaStatus: '先进标杆',
  },

  // 10. 电容器 (cat-mp-capacitor)
  {
    id: 'm-cap-01',
    modelCode: 'CAP-BAM-11',
    modelName: 'BAM-11kV 高压并联电容器装置 (真空浸渍工序)',
    category: 'transformer',
    categoryId: 'cat-mp-capacitor',
    voltageLevel: '110kV级',
    companyId: 'ws_hb_hr',
    companyName: '合容电气',
    productionVolume: '150,000 kvar',
    unitTce: '0.145 tce/kvar',
    unitElecKWh: '112 kWh/kvar',
    unitGasM3: '2.1 m³/kvar',
    unitWaterTon: '0.4 t/kvar',
    diffYoy: '-4.6%',
    quotaStatus: '达标受控',
  },

  // 11. GIL (cat-mp-gil)
  {
    id: 'm-gil-01',
    modelCode: 'GIL-500-T',
    modelName: '500kV 气体绝缘金属封闭输电线路 (螺旋焊管与绝缘子生产)',
    category: 'transformer',
    categoryId: 'cat-mp-gil',
    voltageLevel: '500kV级',
    companyId: 'ws_hb_gil',
    companyName: '赛杰爱迪',
    productionVolume: '3.5 km',
    unitTce: '0.820 tce/百米',
    unitElecKWh: '635 kWh/百米',
    unitGasM3: '8.0 m³/百米',
    unitWaterTon: '1.8 t/百米',
    diffYoy: '-5.5%',
    quotaStatus: '先进标杆',
  },

  // ---------------------- 线缆类主要产品型号 (电力、氮气、天然气、水，无蒸汽) ----------------------
  // 1. 线缆-高压 (cat-mp-cb-high)
  {
    id: 'm-cb-01',
    modelCode: 'CB-500-YJLW03-1x2500',
    modelName: '500kV 皱纹铝套高压交联聚乙烯电力电缆 (1x2500mm²)',
    category: 'cable',
    categoryId: 'cat-mp-cb-high',
    voltageLevel: '500kV级',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '45 万km·mm²',
    unitTce: '0.877 tce/万km·mm²',
    unitElecKWh: '6,616 kWh/万km·mm²',
    unitNitrogenM3: '19.7 m³/万km·mm²',
    unitGasM3: '12.2 m³/万km·mm²',
    unitWaterTon: '2.6 t/万km·mm²',
    diffYoy: '-6.8%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-02',
    modelCode: 'CB-220-YJLW03-1x1600',
    modelName: '220kV 皱纹铝套交联聚乙烯绝缘电力电缆 (1x1600mm²)',
    category: 'cable',
    categoryId: 'cat-mp-cb-high',
    voltageLevel: '220kV级',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '95 万km·mm²',
    unitTce: '0.642 tce/万km·mm²',
    unitElecKWh: '4,850 kWh/万km·mm²',
    unitNitrogenM3: '14.5 m³/万km·mm²',
    unitGasM3: '9.0 m³/万km·mm²',
    unitWaterTon: '2.0 t/万km·mm²',
    diffYoy: '-5.9%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-03',
    modelCode: 'CB-110-YJLW03-1x1200',
    modelName: '110kV 平滑铝套交联聚乙烯绝缘电力电缆 (1x1200mm²)',
    category: 'cable',
    categoryId: 'cat-mp-cb-high',
    voltageLevel: '110kV级',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '180 万km·mm²',
    unitTce: '0.482 tce/万km·mm²',
    unitElecKWh: '3,640 kWh/万km·mm²',
    unitNitrogenM3: '11.0 m³/万km·mm²',
    unitGasM3: '7.2 m³/万km·mm²',
    unitWaterTon: '1.6 t/万km·mm²',
    diffYoy: '-6.1%',
    quotaStatus: '先进标杆',
  },

  // 2. 线缆-中低压 (cat-mp-cb-midlow)
  {
    id: 'm-cb-06',
    modelCode: 'CB-35-YJV22-3x300',
    modelName: '35kV 钢带铠装交联聚乙烯绝缘电力电缆 (YJV22 3x300mm²)',
    category: 'cable',
    categoryId: 'cat-mp-cb-midlow',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '260 万km·mm²',
    unitTce: '0.238 tce/万km·mm²',
    unitElecKWh: '1,785 kWh/万km·mm²',
    unitNitrogenM3: '6.6 m³/万km·mm²',
    unitGasM3: '4.3 m³/万km·mm²',
    unitWaterTon: '0.9 t/万km·mm²',
    diffYoy: '-5.3%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-10-22-01',
    modelCode: 'CB-10-YJV22-3x240',
    modelName: '10kV 三芯铠装交联电力电缆 (YJV22 3x240mm²)',
    category: 'cable',
    categoryId: 'cat-mp-cb-midlow',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xl_main',
    companyName: '特变电工新疆电缆有限公司',
    productionVolume: '320 万km·mm²',
    unitTce: '0.195 tce/万km·mm²',
    unitElecKWh: '1,465 kWh/万km·mm²',
    unitNitrogenM3: '5.2 m³/万km·mm²',
    unitGasM3: '3.6 m³/万km·mm²',
    unitWaterTon: '0.8 t/万km·mm²',
    diffYoy: '-5.5%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-09',
    modelCode: 'CB-LV-WDZ-YJY-4x240',
    modelName: '0.6/1kV 低烟无卤阻燃电力电缆 (WDZ-YJY 4x240mm²)',
    category: 'cable',
    categoryId: 'cat-mp-cb-midlow',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_dl_main',
    companyName: '特变电工（德阳）电缆股份有限公司',
    productionVolume: '380 万km·mm²',
    unitTce: '0.168 tce/万km·mm²',
    unitElecKWh: '1,260 kWh/万km·mm²',
    unitNitrogenM3: '3.8 m³/万km·mm²',
    unitGasM3: '3.0 m³/万km·mm²',
    unitWaterTon: '0.6 t/万km·mm²',
    diffYoy: '-4.7%',
    quotaStatus: '达标受控',
  },

  // 3. 线缆-特种电缆 (cat-mp-cb-special)
  {
    id: 'm-cb-08',
    modelCode: 'CB-SP-PV-1x4',
    modelName: '光伏及风电耐寒耐扭曲特种软电缆 (WDZ-FEYH 1x4mm²)',
    category: 'cable',
    categoryId: 'cat-mp-cb-special',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_sg',
    companyName: '曙光公司',
    productionVolume: '450 万km·mm²',
    unitTce: '0.155 tce/万km·mm²',
    unitElecKWh: '1,165 kWh/万km·mm²',
    unitNitrogenM3: '4.2 m³/万km·mm²',
    unitGasM3: '3.2 m³/万km·mm²',
    unitWaterTon: '0.7 t/万km·mm²',
    diffYoy: '-5.8%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-wind-01',
    modelCode: 'CB-WIND-FDEH-3x120',
    modelName: '风力发电专用耐扭曲低温橡套软电缆 (FDEH 3x120+1x35mm²)',
    category: 'cable',
    categoryId: 'cat-mp-cb-special',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_sg',
    companyName: '曙光公司',
    productionVolume: '85 万km·mm²',
    unitTce: '0.180 tce/万km·mm²',
    unitElecKWh: '1,350 kWh/万km·mm²',
    unitNitrogenM3: '4.8 m³/万km·mm²',
    unitGasM3: '3.6 m³/万km·mm²',
    unitWaterTon: '0.8 t/万km·mm²',
    diffYoy: '-6.2%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-fire-01',
    modelCode: 'CB-FIRE-BTTZ-4x25',
    modelName: '0.6/1kV 矿物绝缘柔性防火电缆 (BTTZ 4x25mm²)',
    category: 'cable',
    categoryId: 'cat-mp-cb-special',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_sg',
    companyName: '曙光公司',
    productionVolume: '140 万km·mm²',
    unitTce: '0.220 tce/万km·mm²',
    unitElecKWh: '1,650 kWh/万km·mm²',
    unitNitrogenM3: '5.6 m³/万km·mm²',
    unitGasM3: '4.0 m³/万km·mm²',
    unitWaterTon: '0.9 t/万km·mm²',
    diffYoy: '-5.8%',
    quotaStatus: '先进标杆',
  },

  // 4. 架空导线及铜铝拉丝 (cat-mp-cb-drawing)
  {
    id: 'm-cb-jklyj-01',
    modelCode: 'CB-OVH-JKLYJ-1x120',
    modelName: 'JKLYJ 10kV 架空绝缘导线 (拉丝与绞线工序)',
    category: 'cable',
    categoryId: 'cat-mp-cb-drawing',
    voltageLevel: 'all',
    companyId: 'ws_xl_sub',
    companyName: '特变电工新疆线缆厂',
    productionVolume: '260 万km·mm²',
    unitTce: '0.086 tce/万km·mm²',
    unitElecKWh: '645 kWh/万km·mm²',
    unitNitrogenM3: '1.2 m³/万km·mm²',
    unitGasM3: '1.5 m³/万km·mm²',
    unitWaterTon: '0.3 t/万km·mm²',
    diffYoy: '-5.0%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-cb-lgj-01',
    modelCode: 'CB-OVH-LGJ-400/35',
    modelName: 'LGJ 钢芯铝绞线 (单位吨铝电耗/单位吨铜电耗)',
    category: 'cable',
    categoryId: 'cat-mp-cb-drawing',
    voltageLevel: 'all',
    companyId: 'ws_xl_main',
    companyName: '特变电工新疆电缆有限公司',
    productionVolume: '580 万km·mm²',
    unitTce: '0.065 tce/万km·mm²',
    unitElecKWh: '490 kWh/万km·mm²',
    unitNitrogenM3: '0.8 m³/万km·mm²',
    unitGasM3: '1.1 m³/万km·mm²',
    unitWaterTon: '0.2 t/万km·mm²',
    diffYoy: '-4.8%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-kvv-01',
    modelCode: 'CB-CTR-KVVP-4x2.5',
    modelName: '屏蔽控制电缆及计算机信号电缆 (KVVP 4x2.5mm²)',
    category: 'cable',
    categoryId: 'cat-mp-cb-drawing',
    voltageLevel: 'all',
    companyId: 'ws_dl_main',
    companyName: '特变电工（德阳）电缆股份有限公司',
    productionVolume: '380 万km·mm²',
    unitTce: '0.098 tce/万km·mm²',
    unitElecKWh: '735 kWh/万km·mm²',
    unitNitrogenM3: '1.8 m³/万km·mm²',
    unitGasM3: '1.8 m³/万km·mm²',
    unitWaterTon: '0.4 t/万km·mm²',
    diffYoy: '-4.2%',
    quotaStatus: '达标受控',
  },
]

/**
 * 🌟 校验产品中类是否匹配组织节点 (严格对齐公司/车间在产品分类与型号管理中的生产归属)
 */
function isCategoryMatchedNode(cat: ProductCategoryItem, node: StandardOrgNode | null): boolean {
  if (
    !node ||
    node.id === 'ent_root' ||
    node.id === 'group_root' ||
    node.id === 'park_root' ||
    node.level === 'group'
  ) {
    return true
  }
  const nodeName = node.name || ''
  const nodeId = node.id || ''

  // 1. 节点 ID 直接包含
  if (cat.producerUnitIds && cat.producerUnitIds.includes(nodeId)) {
    return true
  }

  // 2. 生产单位名称直接匹配或包含
  if (cat.producerUnits && (cat.producerUnits.includes(nodeName) || nodeName.includes(cat.producerUnits))) {
    return true
  }

  // 3. 经营单位与下级车间智能匹配
  if (nodeId.includes('sb') || nodeName.includes('沈变')) {
    return (
      cat.producerUnits.includes('沈变') ||
      cat.producerUnits.includes('套管') ||
      cat.producerUnits.includes('互感器')
    )
  }
  if (nodeId.includes('hb') || nodeName.includes('衡变')) {
    return (
      cat.producerUnits.includes('衡变') ||
      cat.producerUnits.includes('湖南电气') ||
      cat.producerUnits.includes('特能建') ||
      cat.producerUnits.includes('云集') ||
      cat.producerUnits.includes('合容') ||
      cat.producerUnits.includes('开关') ||
      cat.producerUnits.includes('赛杰爱迪')
    )
  }
  if (nodeId.includes('xb') || nodeName.includes('新变')) {
    return (
      cat.producerUnits.includes('新变') ||
      cat.producerUnits.includes('超高压') ||
      cat.producerUnits.includes('天变') ||
      cat.producerUnits.includes('智能电气') ||
      cat.producerUnits.includes('京津冀') ||
      cat.producerUnits.includes('珠峰硅钢')
    )
  }
  if (nodeId.includes('ll') || nodeName.includes('鲁缆')) {
    return cat.category === 'cable' && (cat.producerUnits.includes('鲁缆') || cat.producerUnits.includes('曙光'))
  }
  if (nodeId.includes('xl') || nodeName.includes('新缆') || nodeName.includes('新疆电缆')) {
    return cat.category === 'cable' && (cat.producerUnits.includes('新疆') || cat.producerUnits.includes('导线'))
  }
  if (nodeId.includes('dl') || nodeName.includes('德缆') || nodeName.includes('德阳')) {
    return cat.category === 'cable' && (cat.producerUnits.includes('德') || cat.producerUnits.includes('特种电缆'))
  }

  return false
}

export default function UnitProductPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'ent_root',
    name: '电装集团',
    fullName: '特变电工电装集团',
    level: 'group',
    badge: '全集团',
  })

  // 🌟 1. 产业大类判定（工厂：根据工厂产业类型；经营单位：根据下级工厂产业类型；集团：显示全部下级产业类型）
  const activeIndustries = useMemo<('transformer' | 'cable')[]>(() => {
    // 集团级：拥有全部下级产业类型 (变压器 + 线缆)
    if (
      selectedNode.level === 'group' ||
      selectedNode.id === 'ent_root' ||
      selectedNode.id === 'group_root' ||
      selectedNode.id === 'park_root'
    ) {
      return ['transformer', 'cable']
    }

    // 经营单位与工厂级
    const id = selectedNode.id.toLowerCase()
    if (
      id.startsWith('comp_ll') ||
      id.startsWith('ws_ll') ||
      id.startsWith('comp_xl') ||
      id.startsWith('ws_xl') ||
      id.startsWith('comp_dl') ||
      id.startsWith('ws_dl') ||
      selectedNode.name.includes('缆')
    ) {
      return ['cable']
    }

    return ['transformer']
  }, [selectedNode])

  const isGroupLevel = activeIndustries.length > 1
  const currentIndustryMode: 'transformer' | 'cable' | 'all' = isGroupLevel ? 'all' : activeIndustries[0]

  // 🌟 中间主要产品分类选中状态 ('all' | cat.id)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all')
  // 🌟 产线/产品分类二级分组过滤 ('all' | 产线名称)
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>('all')
  const [categorySearchKw, setCategorySearchKw] = useState<string>('')
  const [categorySortBy, setCategorySortBy] = useState<'tce_desc' | 'models_desc' | 'yoy_desc'>('tce_desc')

  // 🌟 当前产业范围下的主要产品库 (11 项变压器 + 4 项线缆)
  const currentCategories = useMemo(() => {
    if (currentIndustryMode === 'all') {
      return [...TRANSFORMER_CATEGORIES, ...CABLE_CATEGORIES]
    }
    return currentIndustryMode === 'transformer' ? TRANSFORMER_CATEGORIES : CABLE_CATEGORIES
  }, [currentIndustryMode])

  // 🌟 当前在板块【产品管控指标】中激活选中的产品大类与搜索关键字
  const [selectedProductLine, setSelectedProductLine] = useState<string>('')
  const [lineSearchKey, setLineSearchKey] = useState<string>('')

  // 🌟 当前单位可用的全部 1 级标准产品大类 (严格对齐指标管控页面及系统设置【生产数据维护】中产品类型与型号管理)
  const availableProductLines = useMemo(() => {
    return getProductMajorsForUnit(selectedNode?.name || '')
  }, [selectedNode])

  // 🌟 当前在板块【产品管控指标】中激活选中的产品大类 (若未手动选或不在可用列表中，默认取第 1 个可用大类)
  const currentProductLine = useMemo(() => {
    if (selectedProductLine && availableProductLines.includes(selectedProductLine)) {
      return selectedProductLine
    }
    return availableProductLines[0] || null
  }, [selectedProductLine, availableProductLines])

  // 🌟 对应的当前产品大类下 2 级产品中类原始列表 (严格对齐系统设置【产品类型管理】2级中类)
  const subcategoriesForCurrentLine = useMemo(() => {
    if (!currentProductLine) return []
    return getSubcategoriesForMajor(currentProductLine)
  }, [currentProductLine])

  // 🌟 产品大类对应的基础能耗指标基准 (提供蒸汽、天然气、水耗基准)
  const currentLineSpec = useMemo(() => {
    if (!currentProductLine) return undefined
    const spec = MAJOR_CATEGORY_METRICS[currentProductLine] || MAJOR_CATEGORY_METRICS['变压器']
    return {
      unitSuffix: spec.unitSuffix,
      energy: { val: spec.energyVal, yoy: spec.yoy },
      elec: { val: spec.elecVal, yoy: spec.yoy },
      steam: spec.steamVal ? { val: spec.steamVal, yoy: '-4.8%' } : undefined,
      gas: spec.gasVal ? { val: spec.gasVal, yoy: '-5.6%' } : undefined,
      water: spec.waterVal ? { val: spec.waterVal, yoy: '-4.1%' } : undefined,
    }
  }, [currentProductLine])

  // 🌟 根据选中的 1 级标准产品大类动态生成 5 大产品管控指标 (单位产品能耗、电耗、蒸汽耗、天然气耗、水耗)
  const currentProductControlMetrics = useMemo(() => {
    if (availableProductLines.length === 0 || !currentProductLine) {
      return []
    }
    const spec = MAJOR_CATEGORY_METRICS[currentProductLine] || MAJOR_CATEGORY_METRICS['变压器']

    const metricsList = [
      {
        id: 'pm-unit-energy',
        name: '单位产品能耗',
        code: 'SEC-PROD-01',
        category: 'product' as const,
        unit: `tce/${spec.unitSuffix}`,
        curVal: spec.energyVal,
        yoy: spec.yoy,
        isYoyDown: spec.isYoyDown,
      },
      {
        id: 'pm-unit-electricity',
        name: '单位产品电耗',
        code: 'SEC-PROD-02',
        category: 'product' as const,
        unit: `kWh/${spec.unitSuffix}`,
        curVal: spec.elecVal,
        yoy: spec.yoy,
        isYoyDown: spec.isYoyDown,
      },
    ]

    if (spec.hasSteam && spec.steamVal) {
      metricsList.push({
        id: 'pm-unit-steam',
        name: '单位产品蒸汽耗',
        code: 'SEC-PROD-03',
        category: 'product' as const,
        unit: `GJ/${spec.unitSuffix}`,
        curVal: spec.steamVal,
        yoy: '-4.8%',
        isYoyDown: true,
      })
    }

    if (spec.hasGas && spec.gasVal) {
      metricsList.push({
        id: 'pm-unit-gas',
        name: '单位产品天然气耗',
        code: 'SEC-PROD-04',
        category: 'product' as const,
        unit: `m³/${spec.unitSuffix}`,
        curVal: spec.gasVal,
        yoy: '-5.6%',
        isYoyDown: true,
      })
    }

    if (spec.hasWater && spec.waterVal) {
      metricsList.push({
        id: 'pm-unit-water',
        name: '单位产品水耗',
        code: 'SEC-PROD-05',
        category: 'product' as const,
        unit: `t/${spec.unitSuffix}`,
        curVal: spec.waterVal,
        yoy: '-4.1%',
        isYoyDown: true,
      })
    }

    return metricsList
  }, [availableProductLines, currentProductLine])

  // 🌟 过滤并排序展示的主要产品分类 (保持原参数：变压器 11 项 / 线缆 4 项)
  const displayedCategories = useMemo(() => {
    return currentCategories
      .filter((cat) => {
        if (selectedCategoryGroup !== 'all') {
          const lines = cat.productLines || []
          if (!lines.includes(selectedCategoryGroup) && cat.groupTag !== selectedCategoryGroup) {
            return false
          }
        }
        if (categorySearchKw.trim()) {
          const kw = categorySearchKw.trim().toLowerCase()
          return (
            cat.name.toLowerCase().includes(kw) ||
            cat.shortName.toLowerCase().includes(kw) ||
            cat.groupTag.toLowerCase().includes(kw) ||
            (cat.productLines && cat.productLines.some((l) => l.toLowerCase().includes(kw))) ||
            cat.producerUnits.toLowerCase().includes(kw)
          )
        }
        return true
      })
      .sort((a, b) => {
        if (categorySortBy === 'tce_desc') return b.unitTce - a.unitTce
        if (categorySortBy === 'models_desc') return b.modelCount - a.modelCount
        if (categorySortBy === 'yoy_desc') return parseFloat(a.diffYoy) - parseFloat(b.diffYoy)
        return 0
      })
  }, [currentCategories, selectedCategoryGroup, categorySearchKw, categorySortBy])

  const activeSelectedCategory = useMemo(() => {
    if (selectedCategoryId === 'all') return null
    return currentCategories.find((c) => c.id === selectedCategoryId) || null
  }, [currentCategories, selectedCategoryId])

  // 🌟 底部明细台账 3 级级联筛选：产品大类、产品中类、产品型号
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<string>('all')
  const [selectedKindFilter, setSelectedKindFilter] = useState<string>('all')
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('all')

  // 1. 可选产品大类列表 (根据当前组织树节点与产业模式自动关联约束)
  const filteredMajorOptions = useMemo(() => {
    let list = PRODUCT_MAJOR_OPTIONS

    // 受当前产业模式约束 (如果有指定产业)
    if (currentIndustryMode !== 'all') {
      list = list.filter((opt) => opt.industry === currentIndustryMode)
    }

    // 集团级或根节点: 显示该产业下的所有大类
    if (
      !selectedNode ||
      selectedNode.id === 'ent_root' ||
      selectedNode.id === 'group_root' ||
      selectedNode.id === 'park_root' ||
      selectedNode.level === 'group'
    ) {
      return list
    }

    // 单体公司/工厂/车间级: 严格根据该节点可用的产品大类关联过滤
    const unitMajors = getProductMajorsForUnit(selectedNode.name || '')
    if (unitMajors && unitMajors.length > 0) {
      const filtered = list.filter((opt) =>
        unitMajors.some(
          (um) => opt.name === um || opt.name.includes(um) || um.includes(opt.name)
        )
      )
      return filtered.length > 0 ? filtered : list
    }

    return list
  }, [selectedNode, currentIndustryMode])

  // 2. 可选产品中类列表 (受当前组织树节点、产品大类与产业模式级联自动关联约束)
  const allCategoryKinds = useMemo(() => {
    return [...TRANSFORMER_CATEGORIES, ...CABLE_CATEGORIES]
  }, [])

  const availableKindOptions = useMemo(() => {
    let list = allCategoryKinds

    // 1. 产业模式约束
    if (currentIndustryMode !== 'all') {
      list = list.filter((c) => c.category === currentIndustryMode)
    }

    // 2. 组织树节点关联过滤
    if (
      selectedNode &&
      selectedNode.id !== 'ent_root' &&
      selectedNode.id !== 'group_root' &&
      selectedNode.id !== 'park_root' &&
      selectedNode.level !== 'group'
    ) {
      const nodeMatched = list.filter((c) => isCategoryMatchedNode(c, selectedNode))
      if (nodeMatched.length > 0) {
        list = nodeMatched
      }
    }

    // 3. 产品大类下拉过滤约束
    if (selectedMajorFilter !== 'all') {
      const major = PRODUCT_MAJOR_OPTIONS.find((m) => m.id === selectedMajorFilter)
      if (major) {
        list = list.filter((c) => major.categoryIds.includes(c.id))
      }
    }

    return list
  }, [allCategoryKinds, currentIndustryMode, selectedNode, selectedMajorFilter])

  // 3. 可选产品型号列表 (受大类、中类、组织节点级联约束)
  const availableModelOptions = useMemo(() => {
    let list = ALL_PRODUCT_MODELS
    if (currentIndustryMode !== 'all') {
      list = list.filter((m) => m.category === currentIndustryMode)
    }
    if (selectedMajorFilter !== 'all') {
      const major = PRODUCT_MAJOR_OPTIONS.find((m) => m.id === selectedMajorFilter)
      if (major) {
        list = list.filter((m) => major.categoryIds.includes(m.categoryId || ''))
      }
    }
    if (selectedKindFilter !== 'all') {
      list = list.filter((m) => m.categoryId === selectedKindFilter)
    }
    // 组织树节点过滤
    if (selectedNode.level === 'company') {
      const compPrefix = selectedNode.id.replace('comp_', '')
      list = list.filter(
        (m) =>
          m.companyId.startsWith(`ws_${compPrefix}`) ||
          (compPrefix === 'sb' && (m.companyName.includes('沈变') || m.companyName.includes('套管') || m.companyName.includes('互感器'))) ||
          (compPrefix === 'hb' && (m.companyName.includes('衡变') || m.companyName.includes('湖南电气') || m.companyName.includes('特能建') || m.companyName.includes('云集') || m.companyName.includes('合容') || m.companyName.includes('开关') || m.companyName.includes('赛杰'))) ||
          (compPrefix === 'xb' && (m.companyName.includes('新变') || m.companyName.includes('超高压') || m.companyName.includes('天变') || m.companyName.includes('智能电气') || m.companyName.includes('京津冀') || m.companyName.includes('珠峰'))) ||
          (compPrefix === 'll' && (m.companyName.includes('鲁缆') || m.companyName.includes('曙光') || m.companyName.includes('昭和'))) ||
          (compPrefix === 'xl' && (m.companyName.includes('新疆') || m.companyName.includes('线缆'))) ||
          (compPrefix === 'dl' && (m.companyName.includes('德阳') || m.companyName.includes('德缆')))
      )
    } else if (selectedNode.level === 'workshop') {
      list = list.filter((m) => m.companyId === selectedNode.id || m.companyName.includes(selectedNode.name))
    }
    return list
  }, [currentIndustryMode, selectedMajorFilter, selectedKindFilter, selectedNode])

  // 🌟 节点树选择时，下方产品大类、产品中类 根据节点自动关联
  useEffect(() => {
    const unitMajors = getProductMajorsForUnit(selectedNode?.name || '')

    // 集团级或全集团根节点：大类重置为全部
    if (
      !selectedNode ||
      selectedNode.id === 'ent_root' ||
      selectedNode.id === 'group_root' ||
      selectedNode.id === 'park_root' ||
      selectedNode.level === 'group'
    ) {
      setSelectedMajorFilter('all')
      setSelectedKindFilter('all')
      setSelectedModelFilter('all')
      setCurrentPage(1)
      return
    }

    // 单体公司/工厂/车间节点：自动选中该节点第 1 个可用的产品大类，并重置产品中类与型号
    if (unitMajors && unitMajors.length > 0) {
      const matchedMajor = PRODUCT_MAJOR_OPTIONS.find((opt) =>
        unitMajors.some((um) => opt.name === um || opt.name.includes(um) || um.includes(opt.name))
      )
      if (matchedMajor) {
        setSelectedMajorFilter(matchedMajor.id)
      } else {
        setSelectedMajorFilter('all')
      }
    } else {
      setSelectedMajorFilter('all')
    }

    setSelectedKindFilter('all')
    setSelectedModelFilter('all')
    setCurrentPage(1)
  }, [selectedNode])

  // 2. 时间维度统一 (月度 / 季度 / 年度 / 自定义)
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year' | 'custom'>('month')
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })

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
    const startVal = e.target.value
    if (!startVal) return
    setSelectedMonthRange((prev) => {
      let newStart = startVal
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
    const endVal = e.target.value
    if (!endVal) return
    setSelectedMonthRange((prev) => {
      let newStart = prev.start
      let newEnd = endVal
      if (newEnd < newStart) {
        newStart = newEnd
      }
      if (getMonthsCount(newStart, newEnd) > 12) {
        newEnd = addMonthsToYm(newEnd, -11)
      }
      return { start: newStart, end: newEnd }
    })
  }

  // 3. 🌟 当前选中的 KPI 卡片能源介质 (默认综合能耗，点击卡片即时联动图表与坐标轴)
  const [selectedKpiId, setSelectedKpiId] = useState<string>('kpi-tce-all')
  // 4. 电压等级过滤 (针对海量型号快捷筛选)
  const [voltageFilter, setVoltageFilter] = useState<'all' | '500kV级' | '220kV级' | '110kV级' | '35kV级及以下'>('all')
  // 5. 搜索关键字
  const [searchKw, setSearchKw] = useState('')
  // 6. 分页状态 (每页10条)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // 🌟 组织树选中智能联动：重置筛选，并根据层级校准激活 KPI
  useEffect(() => {
    setSelectedMajorFilter('all')
    setSelectedKindFilter('all')
    setSelectedModelFilter('all')
    setSelectedCategoryId('all')
    setSelectedCategoryGroup('all')
    setCategorySearchKw('')
    setSearchKw('')
    setCurrentPage(1)
    if (isGroupLevel) {
      setSelectedKpiId('kpi-tce-all')
    } else if (activeIndustries[0] === 'transformer') {
      setSelectedKpiId('kpi-tce-trans')
    } else {
      setSelectedKpiId('kpi-tce-cable')
    }
  }, [selectedNode.id, isGroupLevel, activeIndustries])

  // 🌟 1. 历史趋势数据构建
  const trendChartConfig = useMemo(() => {
    const periodsMonth = ['25-09', '25-10', '25-11', '25-12', '26-01', '26-02', '26-03', '26-04', '26-05', '26-06', '26-07', '26-08']
    const periodsQuarter = ['23-Q4', '24-Q1', '24-Q2', '24-Q3', '24-Q4', '25-Q1', '25-Q2', '25-Q3', '25-Q4', '26-Q1', '26-Q2', '26-Q3']
    const periodsYear = ['2024年度', '2025年度', '2026年(累计)']

    const periodList = timeDim === 'month' ? periodsMonth : timeDim === 'quarter' ? periodsQuarter : periodsYear
    const len = periodList.length

    const data = periodList.map((period, idx) => {
      const ratio = 1 - (idx / (len - 1)) * 0.058
      return {
        period,
        变压器综合单耗: +(5.12 * ratio).toFixed(3),
        线缆综合单耗: +(0.442 * ratio).toFixed(3),
        变压器实测电耗: +(0.336 * ratio).toFixed(3),
        线缆实测电耗: +(3360 * ratio).toFixed(0),
        变压器蒸汽单耗: +(1.36 * ratio).toFixed(3),
        线缆液氮单耗: +(9.2 * ratio).toFixed(2),
      }
    })

    return { data }
  }, [timeDim])

  // 🌟 2. 坐标轴与折线根据当前选中的指标和产业范围动态配置
  const chartAxisAndLines = useMemo(() => {
    // 1. 集团级 (同时展示变压器与线缆或单项聚焦)
    if (isGroupLevel) {
      if (selectedKpiId === 'kpi-elec-trans') {
        return {
          title: '单位产品电耗变化趋势',
          lines: [{ key: '变压器实测电耗', name: '变压器实测电耗 (kWh/kVA)', color: '#2C7CFF' }],
        }
      }
      if (selectedKpiId === 'kpi-elec-cable') {
        return {
          title: '单位产品电耗变化趋势',
          lines: [{ key: '线缆实测电耗', name: '线缆实测电耗 (kWh/万km·mm²)', color: '#2C7CFF' }],
        }
      }
      if (selectedKpiId === 'kpi-steam-trans') {
        return {
          title: '单位产品蒸汽消耗量变化趋势',
          lines: [{ key: '变压器蒸汽单耗', name: '变压器干燥工序蒸汽单耗 (t/万kVA)', color: '#f59e0b' }],
        }
      }
      if (selectedKpiId === 'kpi-nitrogen-cable') {
        return {
          title: '单位产品液氮消耗量变化趋势',
          lines: [{ key: '线缆液氮单耗', name: '线缆立塔交联工序液氮单耗 (m³/万km·mm²)', color: '#0d9488' }],
        }
      }
      if (selectedKpiId === 'kpi-tce-trans') {
        return {
          title: '单位产品综合能耗变化趋势',
          lines: [{ key: '变压器综合单耗', name: '变压器综合单耗 (tce/万kVA)', color: '#2C7CFF' }],
        }
      }
      if (selectedKpiId === 'kpi-tce-cable') {
        return {
          title: '单位产品综合能耗变化趋势',
          lines: [{ key: '线缆综合单耗', name: '线缆综合单耗 (tce/万km·mm²)', color: '#8b5cf6' }],
        }
      }
      // 默认双曲线展示
      return {
        title: '单位产品综合能耗变化趋势',
        lines: [
          { key: '变压器综合单耗', name: '变压器综合单耗 (tce/万kVA)', color: '#2C7CFF' },
          { key: '线缆综合单耗', name: '线缆综合单耗 (tce/万km·mm²)', color: '#8b5cf6' },
        ],
      }
    }

    // 2. 变压器单产业 (沈变/衡变/新变 或 变压器工厂)
    if (activeIndustries[0] === 'transformer') {
      if (selectedKpiId === 'kpi-elec-trans') {
        return {
          title: '单位产品电耗变化趋势',
          lines: [{ key: '变压器实测电耗', name: '变压器实测电耗 (kWh/kVA)', color: '#2C7CFF' }],
        }
      }
      if (selectedKpiId === 'kpi-steam-trans') {
        return {
          title: '单位产品蒸汽消耗量变化趋势',
          lines: [{ key: '变压器蒸汽单耗', name: '变压器干燥工序蒸汽单耗 (t/万kVA)', color: '#f59e0b' }],
        }
      }
      return {
        title: '单位产品综合能耗变化趋势',
        lines: [{ key: '变压器综合单耗', name: '变压器综合单耗 (tce/万kVA)', color: '#2C7CFF' }],
      }
    }

    // 3. 线缆单产业 (鲁缆/新缆/德缆 或 线缆工厂)
    if (selectedKpiId === 'kpi-elec-cable') {
      return {
        title: '单位产品电耗变化趋势',
        lines: [{ key: '线缆实测电耗', name: '线缆实测电耗 (kWh/万km·mm²)', color: '#2C7CFF' }],
      }
    }
    if (selectedKpiId === 'kpi-nitrogen-cable') {
      return {
        title: '单位产品液氮消耗量变化趋势',
        lines: [{ key: '线缆液氮单耗', name: '线缆立塔交联工序液氮单耗 (m³/万km·mm²)', color: '#0d9488' }],
      }
    }
    return {
      title: '单位产品综合能耗变化趋势',
      lines: [{ key: '线缆综合单耗', name: '线缆综合单耗 (tce/万km·mm²)', color: '#2C7CFF' }],
    }
  }, [isGroupLevel, activeIndustries, selectedKpiId])

  // 🌟 3. 产品型号列表过滤 (叠加分类卡片选中、产线分组、特定型号下拉与文本模糊检索)
  const filteredModels = useMemo(() => {
    let list = availableModelOptions
    if (selectedCategoryId !== 'all') {
      list = list.filter((m) => m.categoryId === selectedCategoryId)
    } else if (selectedCategoryGroup !== 'all') {
      const visibleCatIds = displayedCategories.map((c) => c.id)
      list = list.filter((m) => visibleCatIds.includes(m.categoryId || ''))
    }
    if (selectedModelFilter !== 'all') {
      list = list.filter((m) => m.id === selectedModelFilter)
    }
    if (searchKw.trim()) {
      const kw = searchKw.trim().toLowerCase()
      list = list.filter(
        (m) =>
          m.modelCode.toLowerCase().includes(kw) ||
          m.modelName.toLowerCase().includes(kw) ||
          m.companyName.toLowerCase().includes(kw)
      )
    }
    return list
  }, [availableModelOptions, selectedCategoryId, selectedCategoryGroup, displayedCategories, selectedModelFilter, searchKw])

  // 分页计算
  const totalPages = Math.ceil(filteredModels.length / pageSize) || 1
  const displayedModels = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredModels.slice(start, start + pageSize)
  }, [filteredModels, currentPage, pageSize])

  // 🌟 4. 判断下方明细台账对应的能源类型展示模式
  const currentTableMode = useMemo<'transformer' | 'cable' | 'all'>(() => {
    return currentIndustryMode
  }, [currentIndustryMode])

  // 🌟 5. 指标卡片参数定义（变压器与线缆严格根据用户规则）
  // 变压器：单位产品综合能耗、单位产品电耗、单位产品蒸汽消耗量
  const transformerKPIs = useMemo(() => [
    {
      id: 'kpi-tce-trans',
      name: '单位产品综合能耗',
      value: '0.485',
      unit: 'tce/万kVA',
      diffText: '同比 -2.1% ↓',
      icon: Factory,
      colorClass: 'text-[#2C7CFF]',
    },
    {
      id: 'kpi-elec-trans',
      name: '单位产品电耗',
      value: '0.317',
      unit: 'kWh/kVA',
      diffText: '同比 -1.8% ↓',
      icon: Zap,
      colorClass: 'text-blue-700',
    },
    {
      id: 'kpi-steam-trans',
      name: '单位产品蒸汽消耗量',
      value: '0.020',
      unit: 't/万kVA',
      diffText: '同比 -0.5% ↓',
      icon: Flame,
      colorClass: 'text-amber-600',
    },
  ], [])

  // 线缆：单位产品综合能耗、单位产品电耗、单位产品液氮消耗量
  const cableKPIs = useMemo(() => [
    {
      id: 'kpi-tce-cable',
      name: '单位产品综合能耗',
      value: '0.418',
      unit: 'tce/万km·mm²',
      diffText: '同比 -1.9% ↓',
      icon: Factory,
      colorClass: 'text-[#2C7CFF]',
    },
    {
      id: 'kpi-elec-cable',
      name: '单位产品电耗',
      value: '3,180',
      unit: 'kWh/万km·mm²',
      diffText: '同比 -1.6% ↓',
      icon: Zap,
      colorClass: 'text-blue-700',
    },
    {
      id: 'kpi-nitrogen-cable',
      name: '单位产品液氮消耗量',
      value: '8.6',
      unit: 'm³/万km·mm²',
      diffText: '同比 -0.8% ↓',
      icon: Wind,
      colorClass: 'text-teal-700',
    },
  ], [])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 经典工业级拓扑树 (productUnitOnly: 仅生产变压器/线缆的项目公司可交互，其他置灰) */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        productUnitOnly={true}
        onSelect={(node) => {
          setSelectedNode(node)
          setCurrentPage(1)
        }}
      />

      {/* 🌟 右侧主面板：集团、经营单位及项目公司显示样式保持高度统一一致 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        
        {/* 1. 顶部 Header 与 统一标准时间筛选 (参考用能监测标准高度 p-3.5 完全统一对齐) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-card p-3.5 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#2C7CFF] shrink-0">
              <Factory className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800 dark:text-foreground">单位产品能耗</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 时间维度统一 (月 / 季度 / 年 / 自定义) */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg text-sm font-sans bg-slate-100 dark:bg-panel border border-slate-200 dark:border-border">
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'month'
                    ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-white dark:hover:bg-slate-800'
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
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-white dark:hover:bg-slate-800'
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
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-white dark:hover:bg-slate-800'
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
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-white dark:hover:bg-slate-800'
                )}
              >
                自定义
              </button>
            </div>

            {/* 时间范围选择控件 (随维度自适应切换，样式与单位产值能耗完全对齐) */}
            {timeDim === 'month' && (
              <div className="flex items-center gap-2 bg-white dark:bg-panel px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-sm focus:outline-none cursor-pointer font-bold"
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
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
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
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
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
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-sm focus:outline-none cursor-pointer font-bold"
                  title="开始月份 (最多选12个月)"
                />
                <span className="text-slate-400 font-sans">至</span>
                <input
                  type="month"
                  value={selectedMonthRange.end}
                  onChange={handleCustomEndMonthChange}
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-sm focus:outline-none cursor-pointer font-bold"
                  title="结束月份 (最多选12个月)"
                />
              </div>
            )}

            <ExportButton
              onClick={() => alert(`正在导出【${selectedNode.name}】单位产品能耗分析报表 (周期: ${timeDim === 'month' ? selectedMonth : timeDim === 'quarter' ? selectedQuarter : timeDim === 'year' ? selectedYear : selectedMonthRange.start + ' 至 ' + selectedMonthRange.end})...`)}
            />
          </div>
        </div>

        {/* 🌟 2. 统计模块：单位产品各类能源消耗看板（根据集团、经营单位和工厂区分展示） */}
        {isGroupLevel ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
            {/* 变压器产业 3 项指标 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                  变压器产业能耗指标
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                {transformerKPIs.map((kpi) => {
                  const Icon = kpi.icon
                  const isSelected = selectedKpiId === kpi.id || (selectedKpiId === 'kpi-tce-all' && kpi.id === 'kpi-tce-trans')
                  return (
                    <div
                      key={kpi.id}
                      onClick={() => setSelectedKpiId(selectedKpiId === kpi.id ? 'kpi-tce-all' : kpi.id)}
                      className={cn(
                        'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all cursor-pointer select-none relative group',
                        isSelected
                          ? 'bg-gradient-to-br from-blue-50/95 via-white to-blue-50/40 dark:from-blue-950/60 dark:via-panel dark:to-blue-950/40 border-2 border-[#2C7CFF] ring-2 ring-[#2C7CFF]/20 shadow-sm scale-[1.01]'
                          : 'bg-white dark:bg-card border-slate-200 dark:border-border hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/60 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-sans">
                        <span className={cn('flex items-center gap-1 font-bold', isSelected ? 'text-[#2C7CFF]' : 'text-slate-800 dark:text-foreground')}>
                          <Icon className={cn('size-3.5', isSelected ? 'text-[#2C7CFF]' : 'text-slate-500')} />
                          {kpi.name}
                        </span>
                      </div>
                      <div className={cn('text-xl font-extrabold', isSelected ? 'text-[#2C7CFF]' : kpi.colorClass)}>
                        {kpi.value} <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">{kpi.unit}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-border font-sans flex justify-between items-center">
                        <span className="text-emerald-600 font-bold font-mono">{kpi.diffText}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 线缆产业 3 项指标 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                  线缆产业能耗指标
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                {cableKPIs.map((kpi) => {
                  const Icon = kpi.icon
                  const isSelected = selectedKpiId === kpi.id || (selectedKpiId === 'kpi-tce-all' && kpi.id === 'kpi-tce-cable')
                  return (
                    <div
                      key={kpi.id}
                      onClick={() => setSelectedKpiId(selectedKpiId === kpi.id ? 'kpi-tce-all' : kpi.id)}
                      className={cn(
                        'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all cursor-pointer select-none relative group',
                        isSelected
                          ? 'bg-gradient-to-br from-blue-50/95 via-white to-blue-50/40 dark:from-blue-950/60 dark:via-panel dark:to-blue-950/40 border-2 border-[#2C7CFF] ring-2 ring-[#2C7CFF]/20 shadow-sm scale-[1.01]'
                          : 'bg-white dark:bg-card border-slate-200 dark:border-border hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/60 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-sans">
                        <span className={cn('flex items-center gap-1 font-bold', isSelected ? 'text-[#2C7CFF]' : 'text-slate-800 dark:text-foreground')}>
                          <Icon className={cn('size-3.5', isSelected ? 'text-[#2C7CFF]' : 'text-slate-500')} />
                          {kpi.name}
                        </span>
                      </div>
                      <div className={cn('text-xl font-extrabold', isSelected ? 'text-[#2C7CFF]' : kpi.colorClass)}>
                        {kpi.value} <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">{kpi.unit}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-border font-sans flex justify-between items-center">
                        <span className="text-emerald-600 font-bold font-mono">{kpi.diffText}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          /* 经营单位与工厂级：只展示对应产业的 3 张指标卡片 */
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                {activeIndustries[0] === 'transformer' ? '变压器产业能耗指标' : '线缆产业能耗指标'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-mono text-xs">
              {(activeIndustries[0] === 'transformer' ? transformerKPIs : cableKPIs).map((kpi) => {
                const Icon = kpi.icon
                const isSelected = selectedKpiId === kpi.id
                return (
                  <div
                    key={kpi.id}
                    onClick={() => setSelectedKpiId(kpi.id)}
                    className={cn(
                      'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all cursor-pointer select-none relative group',
                      isSelected
                        ? 'bg-gradient-to-br from-blue-50/95 via-white to-blue-50/40 dark:from-blue-950/60 dark:via-panel dark:to-blue-950/40 border-2 border-[#2C7CFF] ring-2 ring-[#2C7CFF]/20 shadow-sm scale-[1.01]'
                        : 'bg-white dark:bg-card border-slate-200 dark:border-border hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/60 dark:hover:bg-slate-800'
                    )}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-sans">
                      <span className={cn('flex items-center gap-1 font-bold', isSelected ? 'text-[#2C7CFF]' : 'text-slate-800 dark:text-foreground')}>
                        <Icon className={cn('size-3.5', isSelected ? 'text-[#2C7CFF]' : 'text-slate-500')} />
                        {kpi.name}
                      </span>
                    </div>
                    <div className={cn('text-xl font-extrabold', isSelected ? 'text-[#2C7CFF]' : kpi.colorClass)}>
                      {kpi.value} <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">{kpi.unit}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-border font-sans flex justify-between items-center">
                      <span className="text-emerald-600 font-bold font-mono">{kpi.diffText}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🌟 3. 选定能耗指标近 12 个月变化趋势全景折线图 (点击上方卡片动态联动) */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-border pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                {chartAxisAndLines.title}
              </h3>
            </div>
          </div>

          {/* 折线图呈现 (参考图片 1) */}
          <div className="h-[220px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartConfig.data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: 'currentColor', fontFamily: 'monospace' }}
                  className="text-slate-600 dark:text-slate-300"
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'currentColor', fontFamily: 'monospace' }}
                  className="text-slate-600 dark:text-slate-300"
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip
                  cursor={{ stroke: 'rgba(56, 189, 248, 0.25)', strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                    color: '#f8fafc',
                  }}
                />
                {chartAxisAndLines.lines.map((line) => (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    name={line.name}
                    stroke={line.color}
                    strokeWidth={2.2}
                    dot={{ r: 3.5, fill: '#ffffff', stroke: line.color, strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: line.color }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 底部自定义图例与单位说明，完全对齐图1 */}
          <div className="flex items-center justify-center gap-8 text-xs font-mono pt-2 text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-border flex-wrap">
            {chartAxisAndLines.lines.map((line) => (
              <div key={line.key} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-bold" style={{ color: line.color }}>
                  <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: line.color }} />
                  <span className="size-2 rounded-full border bg-white inline-block" style={{ borderColor: line.color }} />
                  <span className="w-4 h-0.5 inline-block" style={{ backgroundColor: line.color }} />
                </span>
                <span>{line.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 4. 产品管控指标 (严格对齐指标管控页面：品类Tag栏 + 5大核心管控卡片 + 产品中类明细表) */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-card p-6 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-border pb-2.5">
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h2 className="text-base font-bold text-slate-800 dark:text-foreground shrink-0">
                产品管控指标
              </h2>
              {availableProductLines.length > 0 && (
                <CollapsibleTagBar
                  items={availableProductLines}
                  activeItem={currentProductLine}
                  onSelect={(line) => {
                    setSelectedProductLine(line)
                    const matchedMajor = PRODUCT_MAJOR_OPTIONS.find(
                      (m) => m.name === line || line.includes(m.name) || m.name.includes(line)
                    )
                    if (matchedMajor) {
                      setSelectedMajorFilter(matchedMajor.id)
                      setSelectedKindFilter('all')
                      setSelectedModelFilter('all')
                    }
                  }}
                  colorTheme="amber"
                />
              )}
            </div>
          </div>

          {currentProductControlMetrics.length === 0 ? (
            <div className="py-8 px-4 rounded-xl border border-dashed border-slate-200 dark:border-border bg-amber-50/20 dark:bg-panel flex flex-col items-center justify-center text-center space-y-2">
              <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
                <Factory className="size-5 opacity-80" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-800 dark:text-foreground">
                  {selectedNode.name ? `【${selectedNode.name}】暂未纳管工业产品管控指标` : '暂无产品管控指标'}
                </h3>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 font-mono">
              {currentProductControlMetrics.map((pm) => {
                return (
                  <div
                    key={pm.id}
                    className="p-4 bg-amber-50/30 dark:bg-panel hover:bg-amber-50/80 dark:hover:bg-slate-800/80 rounded-lg border border-amber-200/80 dark:border-border hover:border-amber-300 dark:hover:border-amber-500/50 transition-all cursor-pointer space-y-2 group shadow-2xs"
                  >
                    <div className="flex items-center justify-between font-sans">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-300 truncate" title={pm.name}>
                        {pm.name}
                      </span>
                    </div>

                    <div className="text-2xl font-bold font-mono text-slate-900 dark:text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {pm.curVal} <span className="text-sm font-normal text-slate-500 dark:text-muted-foreground font-sans">{pm.unit}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* 产品中类明细 (对齐指标管控页面：展示各产品中类能耗折标与构成色彩带) */}
          <div className="pt-2">
            <SubcategoryCompositionTable
              hideHeaderTitle
              currentProductLine={currentProductLine}
              subcategories={subcategoriesForCurrentLine}
              lineSpec={currentLineSpec}
              unitName={selectedNode?.name}
              searchKey={lineSearchKey}
              onSearchChange={setLineSearchKey}
              onSelectMetric={() => {}}
              className="border-0 p-0 shadow-none bg-transparent space-y-3"
            />
          </div>
        </div>

        {/* 🌟 5. 产品能耗明细 (产品大类、产品中类、产品型号下拉 + 检索) */}
        <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 dark:border-border flex flex-wrap items-center justify-between bg-slate-50/70 dark:bg-panel gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
                产品能耗明细
              </h3>
              {activeSelectedCategory && (
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded text-xs font-medium">
                  <span>已联动筛选</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId('all')
                      setCurrentPage(1)
                    }}
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-900 cursor-pointer ml-0.5"
                    title="清除分类联动"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
            </div>

            {/* 🌟 3 级级联下拉 + 快速检索与重置工具栏 (严格契合批注要求) */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* 1. 产品大类下拉 */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-panel px-2.5 h-8 rounded-lg border border-slate-200 dark:border-border text-xs shadow-2xs">
                <span className="text-slate-400 font-sans text-[11px] shrink-0">产品大类:</span>
                <select
                  value={selectedMajorFilter}
                  onChange={(e) => {
                    setSelectedMajorFilter(e.target.value)
                    setSelectedKindFilter('all')
                    setSelectedModelFilter('all')
                    setCurrentPage(1)
                  }}
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-xs font-sans font-medium focus:outline-none cursor-pointer max-w-[130px] truncate"
                  title="选择产品大类"
                >
                  <option value="all">全部产品大类</option>
                  {filteredMajorOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. 产品中类下拉 */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-panel px-2.5 h-8 rounded-lg border border-slate-200 dark:border-border text-xs shadow-2xs">
                <span className="text-slate-400 font-sans text-[11px] shrink-0">产品中类:</span>
                <select
                  value={selectedKindFilter}
                  onChange={(e) => {
                    setSelectedKindFilter(e.target.value)
                    setSelectedModelFilter('all')
                    setCurrentPage(1)
                  }}
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-xs font-sans font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
                  title="选择产品中类"
                >
                  <option value="all">全部产品中类</option>
                  {availableKindOptions.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.shortName || k.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. 产品型号下拉 */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-panel px-2.5 h-8 rounded-lg border border-slate-200 dark:border-border text-xs shadow-2xs">
                <span className="text-slate-400 font-sans text-[11px] shrink-0">产品型号:</span>
                <select
                  value={selectedModelFilter}
                  onChange={(e) => {
                    setSelectedModelFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="bg-transparent border-0 text-slate-800 dark:text-foreground text-xs font-sans font-medium focus:outline-none cursor-pointer max-w-[160px] truncate"
                  title="选择具体产品型号"
                >
                  <option value="all">全部产品型号 ({availableModelOptions.length})</option>
                  {availableModelOptions.map((m) => (
                    <option key={m.id} value={m.id} title={`${m.modelCode} - ${m.modelName}`}>
                      {m.modelCode}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. 检索输入框 */}
              <div className="relative w-48 sm:w-56">
                <input
                  type="text"
                  value={searchKw}
                  onChange={(e) => {
                    setSearchKw(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="检索型号/规格/编码..."
                  className="w-full pl-7 pr-7 py-1 bg-white dark:bg-panel border border-slate-200 dark:border-border rounded-lg text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#2C7CFF] text-slate-800 dark:text-foreground h-8 transition-colors shadow-2xs"
                />
                <Search className="size-3.5 text-slate-400 absolute left-2 top-2.5 pointer-events-none" />
                {searchKw && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchKw('')
                      setCurrentPage(1)
                    }}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="清空搜索"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* 5. 查询按钮 */}
              <button
                type="button"
                onClick={() => {
                  setCurrentPage(1)
                }}
                className="flex items-center gap-1.5 px-3.5 h-8 rounded-lg bg-[#2C7CFF] hover:bg-blue-600 text-white text-xs font-sans font-medium transition-colors cursor-pointer shrink-0 shadow-2xs"
                title="按条件查询型号"
              >
                <Search className="size-3.5 text-white" />
                <span>查询</span>
              </button>

              {/* 6. 重置按钮 */}
              <button
                type="button"
                onClick={() => {
                  setSelectedMajorFilter('all')
                  setSelectedKindFilter('all')
                  setSelectedModelFilter('all')
                  setSelectedCategoryId('all')
                  setSelectedCategoryGroup('all')
                  setSearchKw('')
                  setCurrentPage(1)
                }}
                className="flex items-center gap-1.5 px-3.5 h-8 rounded-lg bg-slate-100 dark:bg-panel hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-sans font-medium transition-colors cursor-pointer shrink-0 border border-slate-200 dark:border-border"
                title="重置所有筛选条件"
              >
                <RotateCcw className="size-3 text-slate-500" />
                <span>重置</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 dark:bg-panel border-b border-slate-200 dark:border-border text-slate-600 dark:text-slate-300 font-semibold font-sans h-[44px]">
                  <th className="py-2.5 px-3">序号</th>
                  <th className="py-2.5 px-3">产品型号规格</th>
                  
                  {/* 单位产品综合能耗 */}
                  <th className="py-2.5 px-3 text-right text-slate-900 dark:text-foreground font-bold">
                    {currentTableMode === 'transformer'
                      ? '单位产品综合能耗 (tce/万kVA)'
                      : currentTableMode === 'cable'
                      ? '单位产品综合能耗 (tce/万km·mm²)'
                      : '单位产品综合能耗'}
                  </th>

                  {/* 单位产品电耗 */}
                  <th className="py-2.5 px-3 text-right text-blue-700">
                    {currentTableMode === 'transformer'
                      ? '⚡ 单位电耗 (kWh/kVA)'
                      : currentTableMode === 'cable'
                      ? '⚡ 单位电耗 (kWh/万km·mm²)'
                      : '⚡ 单位产品电耗'}
                  </th>

                  {/* 蒸汽消耗量 (仅变压器/全部模式显示，线缆完全不显示) */}
                  {(currentTableMode === 'transformer' || currentTableMode === 'all') && (
                    <th className="py-2.5 px-3 text-right text-purple-700">
                      💨 单位蒸汽消耗量 (t)
                    </th>
                  )}

                  {/* 液氮消耗量 (仅线缆/全部模式显示，变压器完全不显示) */}
                  {(currentTableMode === 'cable' || currentTableMode === 'all') && (
                    <th className="py-2.5 px-3 text-right text-teal-700">
                      💨 单位液氮消耗量 (m³)
                    </th>
                  )}

                  {/* 天然气消耗 */}
                  <th className="py-2.5 px-3 text-right text-amber-700">
                    🔥 天然气消耗 (m³)
                  </th>

                  {/* 工艺水耗 */}
                  <th className="py-2.5 px-3 text-right text-cyan-700">
                    💧 工艺水耗 (t)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedModels.length > 0 ? (
                  displayedModels.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2.5 px-3 text-slate-400 font-mono">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 font-sans text-xs">
                          {m.modelName}
                        </div>
                        <div className="text-[10.5px] text-slate-400 font-mono">
                          型号编码: {m.modelCode}
                        </div>
                      </td>
                      
                      {/* 1. 单位产品综合能耗 */}
                      <td className="py-2.5 px-3 text-right font-extrabold text-[#2C7CFF]">
                        {m.unitTce}
                      </td>

                      {/* 2. 单位产品电耗 */}
                      <td className="py-2.5 px-3 text-right text-blue-700 font-bold">
                        {m.unitElecKWh}
                      </td>

                      {/* 3. 单位蒸汽消耗 (变压器/全部模式显示) */}
                      {(currentTableMode === 'transformer' || currentTableMode === 'all') && (
                        <td className="py-2.5 px-3 text-right text-purple-700 font-bold">
                          {m.unitSteamTon ? (
                            <span>{m.unitSteamTon}</span>
                          ) : (
                            <span className="text-slate-300 font-normal font-sans">—</span>
                          )}
                        </td>
                      )}

                      {/* 4. 单位氮气消耗 (线缆/全部模式显示) */}
                      {(currentTableMode === 'cable' || currentTableMode === 'all') && (
                        <td className="py-2.5 px-3 text-right text-teal-700 font-bold">
                          {m.unitNitrogenM3 ? (
                            <span>{m.unitNitrogenM3}</span>
                          ) : (
                            <span className="text-slate-300 font-normal font-sans">—</span>
                          )}
                        </td>
                      )}

                      {/* 5. 天然气消耗 */}
                      <td className="py-2.5 px-3 text-right text-amber-700">
                        {m.unitGasM3 || <span className="text-slate-300 font-sans">—</span>}
                      </td>

                      {/* 6. 工艺耗水 */}
                      <td className="py-2.5 px-3 text-right text-cyan-700">
                        {m.unitWaterTon || <span className="text-slate-300 font-sans">—</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={currentTableMode === 'all' ? 13 : 11} className="py-8 text-center text-slate-400 font-sans">
                      未检索到符合条件的产品型号单耗数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 6. 工业级分页控制器 (支持海量型号分页翻页) */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
            <div className="text-slate-500 font-mono">
              显示第 <strong className="text-slate-800">{(currentPage - 1) * pageSize + 1}</strong> 到第{' '}
              <strong className="text-slate-800">
                {Math.min(currentPage * pageSize, filteredModels.length)}
              </strong>{' '}
              条 · 共 <strong className="text-[#2C7CFF]">{filteredModels.length}</strong> 条型号
            </div>

            <div className="flex items-center gap-1 font-mono">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={cn(
                  'px-2.5 py-1 rounded border transition-colors flex items-center gap-1 cursor-pointer',
                  currentPage === 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100 bg-white'
                )}
              >
                <ChevronLeft className="size-3.5" />
                <span>上一页</span>
              </button>

              <div className="px-2 font-bold text-slate-700">
                {currentPage} / {totalPages} 页
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={cn(
                  'px-2.5 py-1 rounded border transition-colors flex items-center gap-1 cursor-pointer',
                  currentPage >= totalPages
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100 bg-white'
                )}
              >
                <span>下一页</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

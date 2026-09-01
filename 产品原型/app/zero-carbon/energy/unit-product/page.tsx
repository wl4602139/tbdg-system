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
  Filter,
  Sliders,
  TrendingUp,
  Boxes,
  PieChart as PieChartIcon,
  BarChart3,
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
  Line,
} from 'recharts'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 🌟 产品细分类别 (分类层级) 接口定义
export interface ProductCategoryItem {
  id: string
  name: string
  shortName: string
  category: 'transformer' | 'cable'
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

// 🌟 变压器产业 5 大细分产品分类能效画像库
export const TRANSFORMER_CATEGORIES: ProductCategoryItem[] = [
  {
    id: 'cat-tr-500',
    name: '特高压及500kV级变压器',
    shortName: '500kV及以上',
    category: 'transformer',
    voltageLevel: '500kV级',
    desc: '单相自耦变压器、三相发电机主变压器等超大容量旗舰产品',
    unitTce: 14.21,
    unitTceStr: '14.21 tce/万kVA',
    unitElec: 0.317,
    unitElecStr: '0.317 kWh/kVA',
    steamOrNitrogen: '3.40 t/万kVA (蒸汽)',
    gasStr: '48.0 m³/万kVA',
    waterStr: '19.2 t/万kVA',
    modelCount: 42,
    outputShare: '28.5%',
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
  {
    id: 'cat-tr-220',
    name: '220kV~330kV 超高压变压器',
    shortName: '220kV~330kV级',
    category: 'transformer',
    voltageLevel: '220kV级',
    desc: '三相三绕组有载调压变压器、双绕组发电机变压器',
    unitTce: 7.02,
    unitTceStr: '7.02 tce/万kVA',
    unitElec: 0.325,
    unitElecStr: '0.325 kWh/kVA',
    steamOrNitrogen: '1.70 t/万kVA (蒸汽)',
    gasStr: '24.0 m³/万kVA',
    waterStr: '10.5 t/万kVA',
    modelCount: 68,
    outputShare: '24.2%',
    diffYoy: '-5.3%',
    trend12Months: [
      { period: '25-09', tce: 7.42, elec: 0.342 },
      { period: '25-10', tce: 7.36, elec: 0.340 },
      { period: '25-11', tce: 7.30, elec: 0.338 },
      { period: '25-12', tce: 7.25, elec: 0.335 },
      { period: '26-01', tce: 7.20, elec: 0.332 },
      { period: '26-02', tce: 7.16, elec: 0.330 },
      { period: '26-03', tce: 7.12, elec: 0.328 },
      { period: '26-04', tce: 7.09, elec: 0.327 },
      { period: '26-05', tce: 7.07, elec: 0.326 },
      { period: '26-06', tce: 7.05, elec: 0.325 },
      { period: '26-07', tce: 7.03, elec: 0.325 },
      { period: '26-08', tce: 7.02, elec: 0.325 },
    ],
  },
  {
    id: 'cat-tr-110',
    name: '110kV~66kV 节能电力变压器',
    shortName: '110kV级',
    category: 'transformer',
    voltageLevel: '110kV级',
    desc: 'SZ11/SZ13 有载调压、低损耗油浸式电力变压器',
    unitTce: 4.25,
    unitTceStr: '4.25 tce/万kVA',
    unitElec: 0.327,
    unitElecStr: '0.327 kWh/kVA',
    steamOrNitrogen: '1.18 t/万kVA (蒸汽)',
    gasStr: '15.5 m³/万kVA',
    waterStr: '8.4 t/万kVA',
    modelCount: 126,
    outputShare: '26.8%',
    diffYoy: '-4.9%',
    trend12Months: [
      { period: '25-09', tce: 4.48, elec: 0.344 },
      { period: '25-10', tce: 4.45, elec: 0.342 },
      { period: '25-11', tce: 4.41, elec: 0.339 },
      { period: '25-12', tce: 4.38, elec: 0.336 },
      { period: '26-01', tce: 4.35, elec: 0.334 },
      { period: '26-02', tce: 4.32, elec: 0.332 },
      { period: '26-03', tce: 4.30, elec: 0.330 },
      { period: '26-04', tce: 4.28, elec: 0.329 },
      { period: '26-05', tce: 4.27, elec: 0.328 },
      { period: '26-06', tce: 4.26, elec: 0.328 },
      { period: '26-07', tce: 4.25, elec: 0.327 },
      { period: '26-08', tce: 4.25, elec: 0.327 },
    ],
  },
  {
    id: 'cat-tr-35',
    name: '35kV及以下干式/配电变压器',
    shortName: '35kV及以下(干变)',
    category: 'transformer',
    voltageLevel: '35kV级及以下',
    desc: 'SCB13/SCB14 环氧树脂浇注干式变压器、箱式变电站',
    unitTce: 0.76,
    unitTceStr: '0.76 tce/万kVA',
    unitElec: 0.328,
    unitElecStr: '0.328 kWh/kVA',
    steamOrNitrogen: '0.20 t/万kVA (蒸汽)',
    gasStr: '6.8 m³/万kVA',
    waterStr: '2.3 t/万kVA',
    modelCount: 340,
    outputShare: '14.5%',
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
  {
    id: 'cat-tr-special',
    name: '特种与新能源专用变压器',
    shortName: '特种/新能源',
    category: 'transformer',
    voltageLevel: 'all',
    desc: '整流变压器、牵引变压器、光伏风电并网升压箱变',
    unitTce: 2.15,
    unitTceStr: '2.15 tce/万kVA',
    unitElec: 0.332,
    unitElecStr: '0.332 kWh/kVA',
    steamOrNitrogen: '0.65 t/万kVA (蒸汽)',
    gasStr: '8.5 m³/万kVA',
    waterStr: '3.6 t/万kVA',
    modelCount: 85,
    outputShare: '6.0%',
    diffYoy: '-4.6%',
    trend12Months: [
      { period: '25-09', tce: 2.26, elec: 0.348 },
      { period: '25-10', tce: 2.24, elec: 0.345 },
      { period: '25-11', tce: 2.22, elec: 0.342 },
      { period: '25-12', tce: 2.20, elec: 0.340 },
      { period: '26-01', tce: 2.19, elec: 0.337 },
      { period: '26-02', tce: 2.18, elec: 0.335 },
      { period: '26-03', tce: 2.17, elec: 0.334 },
      { period: '26-04', tce: 2.16, elec: 0.333 },
      { period: '26-05', tce: 2.16, elec: 0.333 },
      { period: '26-06', tce: 2.15, elec: 0.332 },
      { period: '26-07', tce: 2.15, elec: 0.332 },
      { period: '26-08', tce: 2.15, elec: 0.332 },
    ],
  },
]

// 🌟 线缆产业 5 大细分产品分类能效画像库
export const CABLE_CATEGORIES: ProductCategoryItem[] = [
  {
    id: 'cat-cb-500',
    name: '超高压及高压电力电缆 (110kV~500kV)',
    shortName: '超高压/高压电缆',
    category: 'cable',
    voltageLevel: '500kV级',
    desc: '皱纹铝套高压交联聚乙烯电力电缆 (立塔干法交联工艺)',
    unitTce: 0.877,
    unitTceStr: '0.877 tce/km',
    unitElec: 6616,
    unitElecStr: '6,616 kWh/km',
    steamOrNitrogen: '19.7 m³/km (氮气)',
    gasStr: '12.2 m³/km',
    waterStr: '2.6 t/km',
    modelCount: 56,
    outputShare: '32.0%',
    diffYoy: '-6.3%',
    trend12Months: [
      { period: '25-09', tce: 0.936, elec: 7050 },
      { period: '25-10', tce: 0.928, elec: 7000 },
      { period: '25-11', tce: 0.920, elec: 6940 },
      { period: '25-12', tce: 0.912, elec: 6880 },
      { period: '26-01', tce: 0.905, elec: 6820 },
      { period: '26-02', tce: 0.898, elec: 6770 },
      { period: '26-03', tce: 0.892, elec: 6720 },
      { period: '26-04', tce: 0.887, elec: 6680 },
      { period: '26-05', tce: 0.883, elec: 6650 },
      { period: '26-06', tce: 0.880, elec: 6630 },
      { period: '26-07', tce: 0.878, elec: 6620 },
      { period: '26-08', tce: 0.877, elec: 6616 },
    ],
  },
  {
    id: 'cat-cb-35',
    name: '中压铠装交联电力电缆 (10kV~35kV)',
    shortName: '中压铠装电缆',
    category: 'cable',
    voltageLevel: '35kV级及以下',
    desc: 'YJV22/YJLV22 钢带铠装交联聚乙烯绝缘电力电缆',
    unitTce: 0.238,
    unitTceStr: '0.238 tce/km',
    unitElec: 1785,
    unitElecStr: '1,785 kWh/km',
    steamOrNitrogen: '6.6 m³/km (氮气)',
    gasStr: '4.3 m³/km',
    waterStr: '0.9 t/km',
    modelCount: 185,
    outputShare: '36.5%',
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
  {
    id: 'cat-cb-lv',
    name: '低压与低烟无卤阻燃电缆 (0.6/1kV)',
    shortName: '低压/阻燃电缆',
    category: 'cable',
    voltageLevel: '35kV级及以下',
    desc: 'WDZ-YJY/VV 低烟无卤阻燃环保型低压电力电缆',
    unitTce: 0.168,
    unitTceStr: '0.168 tce/km',
    unitElec: 1260,
    unitElecStr: '1,260 kWh/km',
    steamOrNitrogen: '3.8 m³/km (氮气)',
    gasStr: '3.0 m³/km',
    waterStr: '0.6 t/km',
    modelCount: 420,
    outputShare: '18.0%',
    diffYoy: '-4.7%',
    trend12Months: [
      { period: '25-09', tce: 0.177, elec: 1330 },
      { period: '25-10', tce: 0.175, elec: 1315 },
      { period: '25-11', tce: 0.174, elec: 1305 },
      { period: '25-12', tce: 0.172, elec: 1290 },
      { period: '26-01', tce: 0.171, elec: 1282 },
      { period: '26-02', tce: 0.170, elec: 1275 },
      { period: '26-03', tce: 0.169, elec: 1270 },
      { period: '26-04', tce: 0.169, elec: 1268 },
      { period: '26-05', tce: 0.168, elec: 1265 },
      { period: '26-06', tce: 0.168, elec: 1262 },
      { period: '26-07', tce: 0.168, elec: 1260 },
      { period: '26-08', tce: 0.168, elec: 1260 },
    ],
  },
  {
    id: 'cat-cb-pv',
    name: '新能源与特种耐寒耐扭曲电缆',
    shortName: '新能源特种电缆',
    category: 'cable',
    voltageLevel: '35kV级及以下',
    desc: 'WDZ-FEYH 光伏电缆、风电耐扭曲耐低温特种软电缆',
    unitTce: 0.155,
    unitTceStr: '0.155 tce/km',
    unitElec: 1165,
    unitElecStr: '1,165 kWh/km',
    steamOrNitrogen: '4.2 m³/km (氮气)',
    gasStr: '3.2 m³/km',
    waterStr: '0.7 t/km',
    modelCount: 110,
    outputShare: '8.5%',
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
  {
    id: 'cat-cb-overhead',
    name: '架空绝缘导线与铝合金裸导线',
    shortName: '架空导线',
    category: 'cable',
    voltageLevel: 'all',
    desc: 'JKLYJ 架空绝缘导线、LGJ 钢芯铝绞线、高导电率导线',
    unitTce: 0.086,
    unitTceStr: '0.086 tce/km',
    unitElec: 645,
    unitElecStr: '645 kWh/km',
    steamOrNitrogen: '1.2 m³/km (氮气)',
    gasStr: '1.5 m³/km',
    waterStr: '0.3 t/km',
    modelCount: 260,
    outputShare: '5.0%',
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

// 丰富的产品型号单耗数据库 (模拟上千条产品型号库中的核心代表型号)
const ALL_PRODUCT_MODELS: ProductModelRecord[] = [
  // ---------------------- 变压器类产品型号 (电力、蒸汽、天然气、水) ----------------------
  {
    id: 'm-tr-01',
    modelCode: 'TR-500-ODFS-334',
    modelName: 'ODFS-334MVA/500kV 单相自耦无励磁调压变压器',
    category: 'transformer',
    categoryId: 'cat-tr-500',
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
    categoryId: 'cat-tr-500',
    voltageLevel: '500kV级',
    companyId: 'ws_hb_main',
    companyName: '衡变本部',
    productionVolume: '1,680 MVA (2台)',
    unitTce: '25.80 tce/万kVA',
    unitElecKWh: '0.306 kWh/kVA',
    unitSteamTon: '5.80 t/万kVA',
    unitGasM3: '82.0 m³/万kVA',
    unitWaterTon: '32.0 t/万kVA',
    diffYoy: '-7.2%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-tr-03',
    modelCode: 'TR-500-ODFS-250',
    modelName: 'ODFS-250MVA/500kV 单相自耦变压器',
    category: 'transformer',
    categoryId: 'cat-tr-500',
    voltageLevel: '500kV级',
    companyId: 'ws_hb_tnj',
    companyName: '特能建',
    productionVolume: '1,000 MVA (4台)',
    unitTce: '10.65 tce/万kVA',
    unitElecKWh: '0.315 kWh/kVA',
    unitSteamTon: '2.50 t/万kVA',
    unitGasM3: '35.2 m³/万kVA',
    unitWaterTon: '14.0 t/万kVA',
    diffYoy: '-5.8%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-tr-04',
    modelCode: 'TR-500-ODFS-334-XB',
    modelName: 'ODFS-334MVA/500kV 超高压大容量变压器',
    category: 'transformer',
    categoryId: 'cat-tr-500',
    voltageLevel: '500kV级',
    companyId: 'ws_xb_uhv',
    companyName: '超高压公司',
    productionVolume: '1,336 MVA (4台)',
    unitTce: '14.72 tce/万kVA',
    unitElecKWh: '0.328 kWh/kVA',
    unitSteamTon: '3.60 t/万kVA',
    unitGasM3: '52.0 m³/万kVA',
    unitWaterTon: '20.1 t/万kVA',
    diffYoy: '-4.2%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-tr-05',
    modelCode: 'TR-220-SFZ11-240',
    modelName: 'SFZ11-240MVA/220kV 三相三绕组有载调压变压器',
    category: 'transformer',
    categoryId: 'cat-tr-220',
    voltageLevel: '220kV级',
    companyId: 'ws_hb_hn',
    companyName: '湖南电气',
    productionVolume: '720 MVA (3台)',
    unitTce: '7.85 tce/万kVA',
    unitElecKWh: '0.327 kWh/kVA',
    unitSteamTon: '1.90 t/万kVA',
    unitGasM3: '26.8 m³/万kVA',
    unitWaterTon: '11.2 t/万kVA',
    diffYoy: '-4.6%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-tr-06',
    modelCode: 'TR-220-SFP-180',
    modelName: 'SFP-180MVA/220kV 双绕组无励磁发电机变压器',
    category: 'transformer',
    categoryId: 'cat-tr-220',
    voltageLevel: '220kV级',
    companyId: 'ws_sb_main',
    companyName: '沈变本部',
    productionVolume: '540 MVA (3台)',
    unitTce: '6.20 tce/万kVA',
    unitElecKWh: '0.322 kWh/kVA',
    unitSteamTon: '1.50 t/万kVA',
    unitGasM3: '21.0 m³/万kVA',
    unitWaterTon: '9.0 t/万kVA',
    diffYoy: '-5.3%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-tr-07',
    modelCode: 'TR-110-SZ11-50',
    modelName: 'SZ11-50000kVA/110kV 节能型有载调压变压器',
    category: 'transformer',
    categoryId: 'cat-tr-110',
    voltageLevel: '110kV级',
    companyId: 'ws_sb_main',
    companyName: '沈变本部',
    productionVolume: '450 MVA (9台)',
    unitTce: '4.15 tce/万kVA',
    unitElecKWh: '0.330 kWh/kVA',
    unitSteamTon: '1.10 t/万kVA',
    unitGasM3: '15.0 m³/万kVA',
    unitWaterTon: '8.2 t/万kVA',
    diffYoy: '-4.8%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-tr-08',
    modelCode: 'TR-110-SZ11-63',
    modelName: 'SZ11-63000kVA/110kV 低损耗油浸式电力变压器',
    category: 'transformer',
    categoryId: 'cat-tr-110',
    voltageLevel: '110kV级',
    companyId: 'ws_hb_main',
    companyName: '衡变本部',
    productionVolume: '378 MVA (6台)',
    unitTce: '4.28 tce/万kVA',
    unitElecKWh: '0.321 kWh/kVA',
    unitSteamTon: '1.20 t/万kVA',
    unitGasM3: '16.5 m³/万kVA',
    unitWaterTon: '8.6 t/万kVA',
    diffYoy: '-5.1%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-tr-09',
    modelCode: 'TR-110-SZ11-50-JJJ',
    modelName: 'SZ11-50000kVA/110kV 环保管控型油浸变压器',
    category: 'transformer',
    categoryId: 'cat-tr-110',
    voltageLevel: '110kV级',
    companyId: 'ws_xb_jjj',
    companyName: '京津冀公司',
    productionVolume: '250 MVA (5台)',
    unitTce: '4.39 tce/万kVA',
    unitElecKWh: '0.330 kWh/kVA',
    unitSteamTon: '1.30 t/万kVA',
    unitGasM3: '17.0 m³/万kVA',
    unitWaterTon: '8.9 t/万kVA',
    diffYoy: '-4.9%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-tr-10',
    modelCode: 'TR-35-SCB13-2500',
    modelName: 'SCB13-2500kVA/35kV 环氧树脂浇注干式变压器',
    category: 'transformer',
    categoryId: 'cat-tr-35',
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
    modelName: 'SCB14-2000kVA/10kV 新一代节能干式变压器',
    category: 'transformer',
    categoryId: 'cat-tr-35',
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
    quotaStatus: '达标受控',
  },
  {
    id: 'm-tr-12',
    modelCode: 'TR-10-SCB13-1600',
    modelName: 'SCB13-1600kVA/10kV 环氧浇注干式配电变压器',
    category: 'transformer',
    categoryId: 'cat-tr-35',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_sb_main',
    companyName: '沈变本部',
    productionVolume: '32 MVA (20台)',
    unitTce: '0.72 tce/万kVA',
    unitElecKWh: '0.338 kWh/kVA',
    unitSteamTon: '0.20 t/万kVA',
    unitGasM3: '6.8 m³/万kVA',
    unitWaterTon: '2.3 t/万kVA',
    diffYoy: '-3.9%',
    quotaStatus: '达标受控',
  },

  // ---------------------- 线缆类产品型号 (电力、氮气、天然气、水，无蒸汽) ----------------------
  {
    id: 'm-cb-01',
    modelCode: 'CB-500-YJLW03-1x2500',
    modelName: '500kV 皱纹铝套高压交联聚乙烯电力电缆 (1x2500mm²)',
    category: 'cable',
    categoryId: 'cat-cb-500',
    voltageLevel: '500kV级',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '45 km',
    unitTce: '1.208 tce/km',
    unitElecKWh: '9,120 kWh/km (1.208 kWh/km)',
    unitNitrogenM3: '28.5 m³/km',
    unitGasM3: '16.5 m³/km',
    unitWaterTon: '3.6 t/km',
    diffYoy: '-6.8%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-02',
    modelCode: 'CB-220-YJLW03-1x1600',
    modelName: '220kV 皱纹铝套交联聚乙烯绝缘电力电缆 (1x1600mm²)',
    category: 'cable',
    categoryId: 'cat-cb-500',
    voltageLevel: '220kV级',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '95 km',
    unitTce: '0.842 tce/km',
    unitElecKWh: '6,350 kWh/km (1.180 kWh/km)',
    unitNitrogenM3: '18.2 m³/km',
    unitGasM3: '11.8 m³/km',
    unitWaterTon: '2.5 t/km',
    diffYoy: '-5.9%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-03',
    modelCode: 'CB-110-YJLW03-1x1200',
    modelName: '110kV 皱纹铝套交联聚乙烯绝缘电力电缆 (1x1200mm²)',
    category: 'cable',
    categoryId: 'cat-cb-500',
    voltageLevel: '110kV级',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '180 km',
    unitTce: '0.582 tce/km',
    unitElecKWh: '4,380 kWh/km (1.208 kWh/km)',
    unitNitrogenM3: '12.5 m³/km',
    unitGasM3: '8.5 m³/km',
    unitWaterTon: '1.8 t/km',
    diffYoy: '-6.1%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-04',
    modelCode: 'CB-110-YJLW03-1x800-XL',
    modelName: '110kV 铝套电力电缆 (YJLW03 1x800mm²)',
    category: 'cable',
    categoryId: 'cat-cb-500',
    voltageLevel: '110kV级',
    companyId: 'ws_xl_main',
    companyName: '特变电工新疆电缆有限公司',
    productionVolume: '140 km',
    unitTce: '0.605 tce/km',
    unitElecKWh: '4,550 kWh/km (1.220 kWh/km)',
    unitNitrogenM3: '13.2 m³/km',
    unitGasM3: '9.2 m³/km',
    unitWaterTon: '1.9 t/km',
    diffYoy: '-4.8%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-cb-05',
    modelCode: 'CB-110-YJLW03-1x630-DL',
    modelName: '110kV 高压耐温电力电缆 (YJLW03 1x630mm²)',
    category: 'cable',
    categoryId: 'cat-cb-500',
    voltageLevel: '110kV级',
    companyId: 'ws_dl_main',
    companyName: '特变电工（德阳）电缆股份有限公司',
    productionVolume: '110 km',
    unitTce: '0.628 tce/km',
    unitElecKWh: '4,720 kWh/km (1.238 kWh/km)',
    unitNitrogenM3: '13.8 m³/km',
    unitGasM3: '9.8 m³/km',
    unitWaterTon: '2.1 t/km',
    diffYoy: '-4.3%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-cb-06',
    modelCode: 'CB-35-YJV22-3x300',
    modelName: '35kV 钢带铠装交联聚乙烯绝缘电力电缆 (YJV22 3x300mm²)',
    category: 'cable',
    categoryId: 'cat-cb-35',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '260 km',
    unitTce: '0.241 tce/km',
    unitElecKWh: '1,810 kWh/km (0.942 kWh/km)',
    unitNitrogenM3: '6.8 m³/km',
    unitGasM3: '4.5 m³/km',
    unitWaterTon: '1.0 t/km',
    diffYoy: '-5.2%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-07',
    modelCode: 'CB-35-YJV22-3x240-XL',
    modelName: '35kV 铠装中压电力电缆 (YJV22 3x240mm²)',
    category: 'cable',
    categoryId: 'cat-cb-35',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xl_sub',
    companyName: '特变电工新疆线缆厂',
    productionVolume: '220 km',
    unitTce: '0.234 tce/km',
    unitElecKWh: '1,760 kWh/km (0.935 kWh/km)',
    unitNitrogenM3: '6.5 m³/km',
    unitGasM3: '4.2 m³/km',
    unitWaterTon: '0.9 t/km',
    diffYoy: '-5.5%',
    quotaStatus: '达标受控',
  },
  {
    id: 'm-cb-08',
    modelCode: 'CB-SP-PV-1x4',
    modelName: '光伏及风电耐寒耐扭曲特种软电缆 (WDZ-FEYH 1x4mm²)',
    category: 'cable',
    categoryId: 'cat-cb-pv',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_sg',
    companyName: '曙光公司',
    productionVolume: '450 km',
    unitTce: '0.155 tce/km',
    unitElecKWh: '1,165 kWh/km (0.706 kWh/km)',
    unitNitrogenM3: '4.2 m³/km',
    unitGasM3: '3.2 m³/km',
    unitWaterTon: '0.7 t/km',
    diffYoy: '-5.8%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-09',
    modelCode: 'CB-LV-WDZ-YJY-4x240',
    modelName: '0.6/1kV 低烟无卤阻燃电力电缆 (WDZ-YJY 4x240mm²)',
    category: 'cable',
    categoryId: 'cat-cb-lv',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_sg',
    companyName: '曙光公司',
    productionVolume: '380 km',
    unitTce: '0.168 tce/km',
    unitElecKWh: '1,260 kWh/km (0.718 kWh/km)',
    unitNitrogenM3: '3.8 m³/km',
    unitGasM3: '3.0 m³/km',
    unitWaterTon: '0.6 t/km',
    diffYoy: '-4.7%',
    quotaStatus: '达标受控',
  },
]

export default function UnitProductPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'ent_root',
    name: '电装集团',
    fullName: '特变电工电装集团',
    level: 'group',
    badge: '全集团',
  })

  // 1. 产业大类选择 (全部 / 变压器 / 线缆)
  const [category, setCategory] = useState<'transformer' | 'cable'>('transformer')
  // 🌟 1.1 中间【分类】层级选中状态 ('all' | 分类id)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all')
  // 2. 时间维度 (月度 / 季度 / 年度)
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')
  // 3. 🌟 当前选中的 KPI 卡片能源介质 (默认综合能耗 'kpi-tce'，点击卡片即时联动图表与坐标轴)
  const [selectedKpiId, setSelectedKpiId] = useState<string>('kpi-tce')
  // 4. 电压等级过滤 (针对海量型号快捷筛选)
  const [voltageFilter, setVoltageFilter] = useState<'all' | '500kV级' | '220kV级' | '110kV级' | '35kV级及以下'>('all')
  // 5. 搜索关键字
  const [searchKw, setSearchKw] = useState('')
  // 6. 分页状态 (每页10条)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // 判断当前选中范围的主要产品产业类型 (变压器 / 线缆 / 综合全谱系)
  const activeIndustry = useMemo(() => {
    return category
  }, [category])

  // 🌟 当前大类下的 5 大细分产品分类列表
  const currentCategories = useMemo(() => {
    return category === 'transformer' ? TRANSFORMER_CATEGORIES : CABLE_CATEGORIES
  }, [category])

  // 🌟 当前选中的产品分类对象 (若为 'all' 则为 null)
  const activeSelectedCategory = useMemo(() => {
    if (selectedCategoryId === 'all') return null
    return currentCategories.find((c) => c.id === selectedCategoryId) || null
  }, [currentCategories, selectedCategoryId])

  // 当大类切换时，自动重置选中的细分类别为全部
  useEffect(() => {
    setSelectedCategoryId('all')
    setCurrentPage(1)
  }, [category])

  // 🌟 组织树选中智能联动分类
  useEffect(() => {
    if (selectedNode.id === 'ent_root' || selectedNode.id === 'group_root' || selectedNode.id === 'park_root') {
      return
    }
    const nodeName = selectedNode.name
    const nodeId = selectedNode.id

    if (
      nodeName.includes('缆') ||
      nodeName.includes('线') ||
      nodeId.includes('ll') ||
      nodeId.includes('xl') ||
      nodeId.includes('dl')
    ) {
      setCategory('cable')
      setCurrentPage(1)
    } else if (
      nodeName.includes('变') ||
      nodeName.includes('套管') ||
      nodeName.includes('互感器') ||
      nodeName.includes('开关') ||
      nodeName.includes('超高压') ||
      nodeId.includes('sb') ||
      nodeId.includes('hb') ||
      nodeId.includes('xb')
    ) {
      setCategory('transformer')
      setCurrentPage(1)
    }
  }, [selectedNode])

  // 当产业类型切换时自动校准介质 (如线缆无蒸汽，变压器无氮气)
  useEffect(() => {
    if (activeIndustry === 'cable' && selectedKpiId === 'kpi-steam') {
      setSelectedKpiId('kpi-nitrogen')
    } else if (activeIndustry === 'transformer' && selectedKpiId === 'kpi-nitrogen') {
      setSelectedKpiId('kpi-steam')
    }
  }, [activeIndustry, selectedKpiId])

  // 🌟 1. 历史趋势数据构建：根据选中的介质 (综合/电/汽/氮/气/水) 与时间颗粒度 (近12个月/近12个季度/近3年)
  const trendChartConfig = useMemo(() => {
    const periodsMonth = ['25-09', '25-10', '25-11', '25-12', '26-01', '26-02', '26-03', '26-04', '26-05', '26-06', '26-07', '26-08']
    const periodsQuarter = ['23-Q4', '24-Q1', '24-Q2', '24-Q3', '24-Q4', '25-Q1', '25-Q2', '25-Q3', '25-Q4', '26-Q1', '26-Q2', '26-Q3']
    const periodsYear = ['2024年度', '2025年度', '2026年(累计)']

    const periodList = timeDim === 'month' ? periodsMonth : timeDim === 'quarter' ? periodsQuarter : periodsYear
    const periodName = timeDim === 'month' ? '近12个月' : timeDim === 'quarter' ? '近12个季度' : '近3年'
    const len = periodList.length

    // 动态生成平滑曲线数据 (支持各能源介质)
    const data = periodList.map((period, idx) => {
      const ratio = 1 - (idx / (len - 1)) * 0.058

      if (selectedKpiId === 'kpi-tce') {
        // 单位产品综合能耗 (变压器: tce/万kVA; 线缆: tce/km)
        return {
          period,
          变压器单耗: +(5.12 * ratio).toFixed(3),
          线缆单耗: +(0.442 * ratio).toFixed(3),
        }
      } else if (selectedKpiId === 'kpi-elec') {
        // 单位产品电耗 (变压器: kWh/kVA; 线缆: kWh/km)
        return {
          period,
          变压器单耗: +(0.336 * ratio).toFixed(3),
          线缆单耗: +(3360 * ratio).toFixed(0),
        }
      } else if (selectedKpiId === 'kpi-steam') {
        // 单位产品蒸汽消耗 (变压器专用: t/万kVA)
        return {
          period,
          变压器单耗: +(1.36 * ratio).toFixed(3),
        }
      } else if (selectedKpiId === 'kpi-nitrogen') {
        // 单位产品氮气消耗 (线缆专用: m³/km)
        return {
          period,
          线缆单耗: +(9.2 * ratio).toFixed(2),
        }
      } else if (selectedKpiId === 'kpi-gas') {
        // 单位产品天然气消耗 (变压器: m³/万kVA; 线缆: m³/km)
        return {
          period,
          变压器单耗: +(17.8 * ratio).toFixed(2),
          线缆单耗: +(6.6 * ratio).toFixed(2),
        }
      } else if (selectedKpiId === 'kpi-water') {
        // 单位产品水消耗 (变压器: t/万kVA; 线缆: t/km)
        return {
          period,
          变压器单耗: +(9.0 * ratio).toFixed(2),
          线缆单耗: +(1.48 * ratio).toFixed(2),
        }
      }

      return {
        period,
        变压器单耗: +(0.335 * ratio).toFixed(3),
        线缆单耗: +(1.280 * ratio).toFixed(3),
      }
    })

    return {
      data,
      periodName,
    }
  }, [timeDim, selectedKpiId])

  // 🌟 2. 坐标轴单位与曲线根据选中的介质和种类动态配置
  const chartAxisAndLines = useMemo(() => {
    const kpiMetaMap: Record<string, { name: string; transUnit: string; cableUnit: string; transLineName: string; cableLineName: string }> = {
      'kpi-tce': {
        name: '单位产品综合能耗',
        transUnit: 'tce/万kVA (变压器综合能耗)',
        cableUnit: 'tce/km (线缆综合能耗)',
        transLineName: '变压器综合单耗 (tce/万kVA)',
        cableLineName: '线缆综合单耗 (tce/km)',
      },
      'kpi-elec': {
        name: '单位产品电耗',
        transUnit: 'kWh/kVA (变压器电耗)',
        cableUnit: 'kWh/km (线缆电耗)',
        transLineName: '变压器实测电耗 (kWh/kVA)',
        cableLineName: '线缆实测电耗 (kWh/km)',
      },
      'kpi-steam': {
        name: '单位产品蒸汽消耗',
        transUnit: 't/万kVA (蒸汽消耗)',
        cableUnit: 't/km',
        transLineName: '变压器干燥工序蒸汽单耗 (t/万kVA)',
        cableLineName: '线缆蒸汽单耗',
      },
      'kpi-nitrogen': {
        name: '单位产品氮气消耗',
        transUnit: 'm³/万kVA',
        cableUnit: 'm³/km (氮气消耗)',
        transLineName: '变压器氮气单耗',
        cableLineName: '线缆立塔交联工序氮气单耗 (m³/km)',
      },
      'kpi-gas': {
        name: '单位产品天然气消耗',
        transUnit: 'm³/万kVA (变压器燃气耗)',
        cableUnit: 'm³/km (线缆燃气耗)',
        transLineName: '变压器天然气单耗 (m³/万kVA)',
        cableLineName: '线缆天然气单耗 (m³/km)',
      },
      'kpi-water': {
        name: '单位产品水消耗',
        transUnit: 't/万kVA (变压器水耗)',
        cableUnit: 't/km (线缆水耗)',
        transLineName: '变压器水单耗 (t/万kVA)',
        cableLineName: '线缆水单耗 (t/km)',
      },
    }

    const meta = kpiMetaMap[selectedKpiId] || kpiMetaMap['kpi-tce']

    if (category === 'transformer' || (category === 'all' && activeIndustry === 'transformer' && selectedNode.id !== 'ent_root')) {
      return {
        yUnit: meta.transUnit,
        titleDesc: `【变压器产品】${meta.name}变化趋势 (${trendChartConfig.periodName})`,
        lines: [
          { key: '变压器单耗', name: meta.transLineName, color: '#1677ff' },
        ],
      }
    } else if (category === 'cable' || (category === 'all' && activeIndustry === 'cable')) {
      return {
        yUnit: meta.cableUnit,
        titleDesc: `【线缆产品】${meta.name}变化趋势 (${trendChartConfig.periodName})`,
        lines: [
          { key: '线缆单耗', name: meta.cableLineName, color: '#a855f7' },
        ],
      }
    } else {
      // 全部产品总览 (双曲线 或 单产业特有介质单曲线)
      if (selectedKpiId === 'kpi-steam') {
        return {
          yUnit: meta.transUnit,
          titleDesc: `【变压器干燥工序】${meta.name}变化趋势 (${trendChartConfig.periodName})`,
          lines: [
            { key: '变压器单耗', name: meta.transLineName, color: '#1677ff' },
          ],
        }
      }
      if (selectedKpiId === 'kpi-nitrogen') {
        return {
          yUnit: meta.cableUnit,
          titleDesc: `【线缆立塔交联工序】${meta.name}变化趋势 (${trendChartConfig.periodName})`,
          lines: [
            { key: '线缆单耗', name: meta.cableLineName, color: '#a855f7' },
          ],
        }
      }

      return {
        yUnit: `${meta.transUnit.split(' ')[0]} (变压器) · ${meta.cableUnit.split(' ')[0]} (线缆)`,
        titleDesc: `【全集团两大核心产品】${meta.name}变化趋势 (${trendChartConfig.periodName})`,
        lines: [
          { key: '变压器单耗', name: meta.transLineName, color: '#1677ff' },
          { key: '线缆单耗', name: meta.cableLineName, color: '#a855f7' },
        ],
      }
    }
  }, [category, activeIndustry, selectedNode, selectedKpiId, trendChartConfig.periodName])

  // 🌟 3. 产品型号列表过滤 (支持几千条型号检索、分类联动与分页)
  const filteredModels = useMemo(() => {
    return ALL_PRODUCT_MODELS.filter((m) => {
      // 1. 产业大类过滤
      if (category !== 'all' && m.category !== category) {
        return false
      }
      // 2. 中间【分类】层级联动过滤 (若选中了特定分类，则只保留该分类下的型号)
      if (selectedCategoryId !== 'all' && m.categoryId !== selectedCategoryId) {
        return false
      }
      // 3. 电压等级过滤
      if (voltageFilter !== 'all' && m.voltageLevel !== voltageFilter) {
        return false
      }
      // 4. 组织树节点过滤
      if (selectedNode.level === 'company') {
        const compPrefix = selectedNode.id.replace('comp_', '')
        if (compPrefix === 'sb' && !m.companyName.includes('沈变')) return false
        if (compPrefix === 'hb' && !m.companyName.includes('衡变') && !m.companyName.includes('湖南电气') && !m.companyName.includes('特能建')) return false
        if (compPrefix === 'xb' && !m.companyName.includes('新变') && !m.companyName.includes('超高压') && !m.companyName.includes('天变') && !m.companyName.includes('智能电气') && !m.companyName.includes('京津冀')) return false
        if (compPrefix === 'll' && !m.companyName.includes('鲁缆') && !m.companyName.includes('曙光')) return false
        if (compPrefix === 'xl' && !m.companyName.includes('新疆电缆') && !m.companyName.includes('新疆线缆')) return false
        if (compPrefix === 'dl' && !m.companyName.includes('德阳')) return false
      } else if (selectedNode.level === 'workshop') {
        if (m.companyId !== selectedNode.id) {
          return false
        }
      }
      // 5. 关键词过滤
      if (searchKw.trim()) {
        const kw = searchKw.trim().toLowerCase()
        return m.modelCode.toLowerCase().includes(kw) || m.modelName.toLowerCase().includes(kw) || m.companyName.toLowerCase().includes(kw)
      }
      return true
    })
  }, [selectedNode, category, selectedCategoryId, voltageFilter, searchKw])

  // 分页计算
  const totalPages = Math.ceil(filteredModels.length / pageSize) || 1
  const displayedModels = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredModels.slice(start, start + pageSize)
  }, [filteredModels, currentPage, pageSize])

  // 🌟 4. 判断下方明细台账对应的能源类型展示模式 (变压器: 电/蒸汽/气/水; 线缆: 电/氮气/气/水; 全部产品: 综合全列)
  const currentTableMode = useMemo<'transformer' | 'cable'>(() => {
    return category
  }, [category])

  // 🌟 5. 动态 KPI 卡片 (消耗了啥显示啥)
  const dynamicEnergyKPIs = useMemo(() => {
    const isCable = activeIndustry === 'cable'

    if (isCable) {
      // 线缆产业：消耗电力、氮气、天然气、水 (无蒸汽)
      return [
        {
          id: 'kpi-tce',
          name: '单位产品综合能耗',
          value: '0.418',
          unit: 'tce/km',
          diffText: '同比 -5.6% ↓',
          badge: '综合折标',
          icon: Factory,
          colorClass: 'text-[#1677ff]',
          bgClass: 'bg-blue-50/40 border-blue-200',
          badgeClass: 'bg-blue-100 text-blue-700',
        },
        {
          id: 'kpi-elec',
          name: '单位产品电耗',
          value: '3,180',
          unit: 'kWh/km',
          diffText: '同比 -5.4% ↓',
          badge: '电力',
          icon: Zap,
          colorClass: 'text-blue-700',
          bgClass: 'bg-white border-slate-200',
          badgeClass: 'bg-slate-100 text-slate-700',
        },
        {
          id: 'kpi-nitrogen',
          name: '单位产品氮气消耗',
          value: '8.6',
          unit: 'm³/km',
          diffText: '同比 -6.2% ↓',
          badge: '氮气',
          icon: Wind,
          colorClass: 'text-teal-700',
          bgClass: 'bg-white border-slate-200',
          badgeClass: 'bg-teal-50 text-teal-700',
        },
        {
          id: 'kpi-gas',
          name: '单位产品天然气消耗',
          value: '6.2',
          unit: 'm³/km',
          diffText: '同比 -4.5% ↓',
          badge: '天然气',
          icon: Flame,
          colorClass: 'text-amber-700',
          bgClass: 'bg-white border-slate-200',
          badgeClass: 'bg-amber-50 text-amber-700',
        },
        {
          id: 'kpi-water',
          name: '单位产品水消耗',
          value: '1.4',
          unit: 't/km',
          diffText: '同比 -3.8% ↓',
          badge: '新鲜水',
          icon: Droplets,
          colorClass: 'text-cyan-700',
          bgClass: 'bg-white border-slate-200',
          badgeClass: 'bg-cyan-50 text-cyan-700',
        },
      ]
    }

    // 变压器产业：消耗电力、蒸汽、天然气、水
    return [
      {
        id: 'kpi-tce',
        name: '单位产品综合能耗',
        value: '0.485',
        unit: 'tce/万kVA',
        diffText: '同比 -5.2% ↓',
        badge: '综合折标',
        icon: Factory,
        colorClass: 'text-[#1677ff]',
        bgClass: 'bg-blue-50/40 border-blue-200',
        badgeClass: 'bg-blue-100 text-blue-700',
      },
      {
        id: 'kpi-elec',
        name: '单位产品电耗',
        value: '0.317',
        unit: 'kWh/kVA',
        diffText: '同比 -5.4% ↓',
        badge: '电力',
        icon: Zap,
        colorClass: 'text-blue-700',
        bgClass: 'bg-white border-slate-200',
        badgeClass: 'bg-slate-100 text-slate-700',
      },
      {
        id: 'kpi-steam',
        name: '单位产品蒸汽消耗',
        value: '0.020',
        unit: 't/万kVA',
        diffText: '同比 -4.8% ↓',
        badge: '蒸汽',
        icon: Flame,
        colorClass: 'text-purple-700',
        bgClass: 'bg-white border-slate-200',
        badgeClass: 'bg-purple-50 text-purple-700',
      },
      {
        id: 'kpi-gas',
        name: '单位产品天然气消耗',
        value: '0.168',
        unit: 'm³/万kVA',
        diffText: '同比 -4.1% ↓',
        badge: '天然气',
        icon: Flame,
        colorClass: 'text-amber-700',
        bgClass: 'bg-white border-slate-200',
        badgeClass: 'bg-amber-50 text-amber-700',
      },
      {
        id: 'kpi-water',
        name: '单位产品水消耗',
        value: '0.085',
        unit: 't/万kVA',
        diffText: '同比 -3.9% ↓',
        badge: '新鲜水',
        icon: Droplets,
        colorClass: 'text-cyan-700',
        bgClass: 'bg-white border-slate-200',
        badgeClass: 'bg-cyan-50 text-cyan-700',
      },
    ]
  }, [activeIndustry])

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
        
        {/* 1. 顶部 Header 与 统一标准时间筛选 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Factory className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">单位产品能耗</h1>
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
              onClick={() => alert(`正在导出【${selectedNode.name}】单位产品能耗分析报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 🌟 2. 核心筛选控制栏 (单位产品能耗种类切换 + 搜索框) */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">单位产品能耗:</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-sans">
              <button
                type="button"
                onClick={() => {
                  setCategory('transformer')
                  setCurrentPage(1)
                }}
                className={cn(
                  'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer',
                  category === 'transformer'
                    ? 'bg-white text-[#1677ff] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Zap className="size-3.5 text-amber-500" />
                <span>变压器</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('cable')
                  setCurrentPage(1)
                }}
                className={cn(
                  'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer',
                  category === 'cable'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Cable className="size-3.5 text-emerald-600" />
                <span>线缆</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <div className="relative">
              <input
                type="text"
                value={searchKw}
                onChange={(e) => {
                  setSearchKw(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="按产品型号 / 规格模糊搜索..."
                className="pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#1677ff] focus:bg-white w-64 transition-colors"
              />
              <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
              {searchKw && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchKw('')
                    setCurrentPage(1)
                  }}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 🌟 3. 统计模块：单位产品各类能源消耗看板 (点击卡片即时驱动下方图表联动) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
          {dynamicEnergyKPIs.map((kpi) => {
            const Icon = kpi.icon
            const isSelected = selectedKpiId === kpi.id
            return (
              <div
                key={kpi.id}
                onClick={() => setSelectedKpiId(kpi.id)}
                className={cn(
                  'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all cursor-pointer select-none relative group',
                  isSelected
                    ? 'bg-gradient-to-br from-blue-50/95 via-white to-blue-50/40 border-2 border-[#1677ff] ring-2 ring-[#1677ff]/20 shadow-sm scale-[1.01]'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                )}
              >
                <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
                  <span className={cn('flex items-center gap-1 font-bold', isSelected ? 'text-[#1677ff]' : 'text-slate-800')}>
                    <Icon className={cn('size-3.5', isSelected ? 'text-[#1677ff]' : 'text-slate-500')} />
                    {kpi.name}
                  </span>
                </div>
                <div className={cn('text-xl font-extrabold', isSelected ? 'text-[#1677ff]' : kpi.colorClass)}>
                  {kpi.value} <span className="text-xs font-normal text-slate-500 font-sans">{kpi.unit}</span>
                </div>
                <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 font-sans flex justify-between items-center">
                  <span className="text-emerald-600 font-bold font-mono">{kpi.diffText}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ========================================================================= */}
        {/* 🌟 4. 中间分类层级：产品细分类别（分类）能耗分布与能效演进分析看板 */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
          {/* ① 分类看板 Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Boxes className="size-4 text-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-900">
                {category === 'transformer' ? '【变压器产品分类】各类别单耗对标与能效演进' : '【线缆产品分类】各类别单耗对标与能效演进'}
              </h3>
            </div>

            {/* 分类快捷切换药丸 */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-400 font-sans text-[11px]">选择产品分类:</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryId('all')
                  setCurrentPage(1)
                }}
                className={cn(
                  'px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold select-none text-xs border',
                  selectedCategoryId === 'all'
                    ? 'bg-[#1677ff] text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200'
                )}
              >
                全部分类 ({currentCategories.length})
              </button>
              {currentCategories.map((cat) => {
                const isCatSelected = selectedCategoryId === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(cat.id)
                      setCurrentPage(1)
                    }}
                    className={cn(
                      'px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium select-none text-xs border flex items-center gap-1',
                      isCatSelected
                        ? 'bg-[#1677ff] text-white font-bold border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                    )}
                  >
                    <span>{cat.shortName}</span>
                    <span className={cn('text-[10px] px-1 rounded', isCatSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600')}>
                      {cat.modelCount}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ② 5 大细分产品分类能耗画像卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
            {currentCategories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryId(selectedCategoryId === cat.id ? 'all' : cat.id)
                    setCurrentPage(1)
                  }}
                  className={cn(
                    'p-3 rounded-xl border shadow-2xs space-y-2 transition-all cursor-pointer select-none relative group',
                    isSelected
                      ? 'bg-gradient-to-br from-blue-50/95 via-white to-blue-50/50 border-2 border-[#1677ff] ring-2 ring-[#1677ff]/20 shadow-xs scale-[1.01]'
                      : 'bg-slate-50/60 border-slate-200 hover:border-blue-300 hover:bg-white'
                  )}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className={cn('font-bold text-xs font-sans line-clamp-1', isSelected ? 'text-[#1677ff]' : 'text-slate-800')}>
                      {cat.name}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="size-3.5 text-[#1677ff] shrink-0" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-400 font-sans">综合单耗:</span>
                      <strong className={cn('text-sm font-extrabold', isSelected ? 'text-[#1677ff]' : 'text-slate-900')}>
                        {cat.unitTceStr}
                      </strong>
                    </div>
                    <div className="flex items-baseline justify-between text-[11px]">
                      <span className="text-slate-400 font-sans">电单耗:</span>
                      <span className="text-blue-700 font-bold">{cat.unitElecStr}</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10.5px] font-sans">
                    <span className="text-slate-500">{cat.modelCount} 款在产型号</span>
                    <span className="text-emerald-600 font-bold font-mono">同比 {cat.diffYoy} ↓</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ③ 分类可视化分析双图表：左侧分类单耗横向PK柱图 + 右侧分类时序演进折线图 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
            {/* 左图：各产品分类单耗横向对标柱状图 */}
            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-sans border-b border-slate-200/70 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span className="size-2 rounded-full bg-[#1677ff]" />
                  <span>各产品分类综合单耗对比</span>
                  <span className="text-[11px] text-slate-400 font-normal font-mono">
                    ({category === 'transformer' ? 'tce/万kVA' : 'tce/km'})
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  点击柱体联动筛选单品
                </span>
              </div>

              <div className="h-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentCategories.map((c) => ({
                      id: c.id,
                      name: c.shortName,
                      fullName: c.name,
                      unitTce: c.unitTce,
                      unitElec: c.unitElec,
                      unitTceStr: c.unitTceStr,
                      isSelected: selectedCategoryId === c.id,
                    }))}
                    margin={{ top: 12, right: 15, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#334155' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                    <Tooltip
                      formatter={(value: any, name: any, item: any) => [
                        `${item?.payload?.unitTceStr}`,
                        '分类综合单耗'
                      ]}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Bar
                      dataKey="unitTce"
                      name="综合单耗"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                      onClick={(entry: any) => {
                        if (entry && entry.id) {
                          setSelectedCategoryId(selectedCategoryId === entry.id ? 'all' : entry.id)
                          setCurrentPage(1)
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {currentCategories.map((entry, index) => (
                        <Cell
                          key={`cat-bar-${index}`}
                          fill={selectedCategoryId === entry.id ? '#1677ff' : selectedCategoryId === 'all' ? '#3b82f6' : '#94a3b8'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 右图：选中分类 (或全产业) 12个月单耗时序演进折线图 */}
            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-sans border-b border-slate-200/70 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <TrendingUp className="size-3.5 text-emerald-600" />
                  <span>
                    {activeSelectedCategory ? `【${activeSelectedCategory.name}】` : '【全产业分类综合】'}
                    单耗月度演进趋势
                  </span>
                </div>
                <span className="text-[11px] text-[#1677ff] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                  {category === 'transformer' ? '单位: tce/万kVA' : '单位: tce/km'}
                </span>
              </div>

              <div className="h-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      activeSelectedCategory
                        ? activeSelectedCategory.trend12Months
                        : currentCategories[0].trend12Months.map((m, idx) => {
                            const avgTce = +(
                              currentCategories.reduce((acc, c) => acc + (c.trend12Months[idx]?.tce || 0), 0) /
                              currentCategories.length
                            ).toFixed(3)
                            return { period: m.period, tce: avgTce }
                          })
                    }
                    margin={{ top: 12, right: 15, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorCategoryTce" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1677ff" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1677ff" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 10, fill: '#334155' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip
                      formatter={(val: any) => [`${val} ${category === 'transformer' ? 'tce/万kVA' : 'tce/km'}`, '综合单耗']}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="tce"
                      stroke="#1677ff"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorCategoryTce)"
                      dot={{ r: 3, fill: '#1677ff' }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 5. 产品型号单耗明细台账 (根据选择的产品，精准匹配对应的能源消耗类型) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/70 gap-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800">
                {currentTableMode === 'transformer'
                  ? '【变压器产品】型号单耗明细台账 (电耗 · 蒸汽耗 · 气水耗)'
                  : currentTableMode === 'cable'
                  ? '【线缆产品】型号单耗明细台账 (电耗 · 氮气耗 · 气水耗)'
                  : '全集团产品型号单耗明细台账'}
              </h3>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              在产产品型号库共 <strong className="text-slate-900">2,840</strong> 种 · 当前筛选展示 <strong className="text-[#1677ff]">{filteredModels.length}</strong> 条型号
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                  <th className="py-2.5 px-3">序号</th>
                  <th className="py-2.5 px-3">产品型号规格</th>
                  
                  {/* 单位产品综合能耗 */}
                  <th className="py-2.5 px-3 text-right text-slate-900 font-bold">
                    {currentTableMode === 'transformer'
                      ? '单位产品综合能耗 (tce/万kVA)'
                      : currentTableMode === 'cable'
                      ? '单位产品综合能耗 (tce/km)'
                      : '单位产品综合能耗'}
                  </th>

                  {/* 单位产品电耗 */}
                  <th className="py-2.5 px-3 text-right text-blue-700">
                    {currentTableMode === 'transformer'
                      ? '⚡ 单位电耗 (kWh/kVA)'
                      : currentTableMode === 'cable'
                      ? '⚡ 单位电耗 (kWh/km)'
                      : '⚡ 单位产品电耗'}
                  </th>

                  {/* 蒸汽消耗 (仅变压器/全部模式显示，线缆完全不显示) */}
                  {(currentTableMode === 'transformer' || currentTableMode === 'all') && (
                    <th className="py-2.5 px-3 text-right text-purple-700">
                      💨 单位蒸汽消耗 (t)
                    </th>
                  )}

                  {/* 氮气消耗 (仅线缆/全部模式显示，变压器完全不显示) */}
                  {(currentTableMode === 'cable' || currentTableMode === 'all') && (
                    <th className="py-2.5 px-3 text-right text-teal-700">
                      💨 单位氮气消耗 (m³)
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
                      <td className="py-2.5 px-3 text-right font-extrabold text-[#1677ff]">
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
              条 · 共 <strong className="text-[#1677ff]">{filteredModels.length}</strong> 条型号
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

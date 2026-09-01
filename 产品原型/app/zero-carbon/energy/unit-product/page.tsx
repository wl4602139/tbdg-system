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

// 🌟 产品细分类别 (分类层级) 接口定义 (支持数十种产品种类)
export interface ProductCategoryItem {
  id: string
  name: string
  shortName: string
  category: 'transformer' | 'cable'
  groupTag: string // 二级分组标签
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

// 🌟 变压器产业 20 种核心产品种类全景能效库 (涵盖特高压/超高压、中高压、干变配电变、新能源箱变与特种变)
export const TRANSFORMER_CATEGORIES: ProductCategoryItem[] = [
  // --- 1. 特高压及超高压类 ---
  {
    id: 'cat-tr-1000',
    name: '1000kV 特高压单相自耦变压器',
    shortName: '1000kV特高压自耦变',
    category: 'transformer',
    groupTag: '特高压/超高压',
    voltageLevel: '500kV级',
    desc: '国家特高压交直流示范工程主力主变，容量达 1000MVA/相',
    unitTce: 16.85,
    unitTceStr: '16.85 tce/万kVA',
    unitElec: 0.312,
    unitElecStr: '0.312 kWh/kVA',
    steamOrNitrogen: '4.20 t/万kVA (蒸汽)',
    gasStr: '56.0 m³/万kVA',
    waterStr: '22.5 t/万kVA',
    modelCount: 18,
    outputShare: '12.5%',
    diffYoy: '-6.8%',
    trend12Months: [
      { period: '25-09', tce: 17.95, elec: 0.334 },
      { period: '25-10', tce: 17.80, elec: 0.330 },
      { period: '25-11', tce: 17.65, elec: 0.328 },
      { period: '25-12', tce: 17.50, elec: 0.325 },
      { period: '26-01', tce: 17.35, elec: 0.322 },
      { period: '26-02', tce: 17.20, elec: 0.320 },
      { period: '26-03', tce: 17.10, elec: 0.318 },
      { period: '26-04', tce: 17.02, elec: 0.316 },
      { period: '26-05', tce: 16.95, elec: 0.314 },
      { period: '26-06', tce: 16.90, elec: 0.313 },
      { period: '26-07', tce: 16.88, elec: 0.312 },
      { period: '26-08', tce: 16.85, elec: 0.312 },
    ],
  },
  {
    id: 'cat-tr-750',
    name: '750kV 超高压单相自耦变压器',
    shortName: '750kV超高压自耦变',
    category: 'transformer',
    groupTag: '特高压/超高压',
    voltageLevel: '500kV级',
    desc: '西北电网主干枢纽变电站核心自耦变压器',
    unitTce: 15.20,
    unitTceStr: '15.20 tce/万kVA',
    unitElec: 0.315,
    unitElecStr: '0.315 kWh/kVA',
    steamOrNitrogen: '3.80 t/万kVA (蒸汽)',
    gasStr: '51.0 m³/万kVA',
    waterStr: '20.6 t/万kVA',
    modelCount: 24,
    outputShare: '10.2%',
    diffYoy: '-6.5%',
    trend12Months: [
      { period: '25-09', tce: 16.20, elec: 0.336 },
      { period: '25-10', tce: 16.05, elec: 0.333 },
      { period: '25-11', tce: 15.92, elec: 0.330 },
      { period: '25-12', tce: 15.78, elec: 0.327 },
      { period: '26-01', tce: 15.65, elec: 0.325 },
      { period: '26-02', tce: 15.52, elec: 0.322 },
      { period: '26-03', tce: 15.42, elec: 0.320 },
      { period: '26-04', tce: 15.35, elec: 0.318 },
      { period: '26-05', tce: 15.28, elec: 0.317 },
      { period: '26-06', tce: 15.24, elec: 0.316 },
      { period: '26-07', tce: 15.22, elec: 0.315 },
      { period: '26-08', tce: 15.20, elec: 0.315 },
    ],
  },
  {
    id: 'cat-tr-500',
    name: '500kV 单相自耦无励磁调压变压器 (ODFS)',
    shortName: '500kV自耦变(ODFS)',
    category: 'transformer',
    groupTag: '特高压/超高压',
    voltageLevel: '500kV级',
    desc: '单相自耦变压器旗舰产品，广泛用于 500kV 枢纽变电站',
    unitTce: 14.21,
    unitTceStr: '14.21 tce/万kVA',
    unitElec: 0.317,
    unitElecStr: '0.317 kWh/kVA',
    steamOrNitrogen: '3.40 t/万kVA (蒸汽)',
    gasStr: '48.0 m³/万kVA',
    waterStr: '19.2 t/万kVA',
    modelCount: 42,
    outputShare: '18.5%',
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
    id: 'cat-tr-500-ssp',
    name: '500kV 三相发电机主变压器 (SSP)',
    shortName: '500kV发电机主变(SSP)',
    category: 'transformer',
    groupTag: '特高压/超高压',
    voltageLevel: '500kV级',
    desc: '百万千瓦大型核电、火电机组配套三相升压主变',
    unitTce: 13.80,
    unitTceStr: '13.80 tce/万kVA',
    unitElec: 0.318,
    unitElecStr: '0.318 kWh/kVA',
    steamOrNitrogen: '3.20 t/万kVA (蒸汽)',
    gasStr: '46.5 m³/万kVA',
    waterStr: '18.6 t/万kVA',
    modelCount: 35,
    outputShare: '14.2%',
    diffYoy: '-5.9%',
    trend12Months: [
      { period: '25-09', tce: 14.65, elec: 0.338 },
      { period: '25-10', tce: 14.52, elec: 0.335 },
      { period: '25-11', tce: 14.40, elec: 0.332 },
      { period: '25-12', tce: 14.28, elec: 0.329 },
      { period: '26-01', tce: 14.16, elec: 0.326 },
      { period: '26-02', tce: 14.05, elec: 0.324 },
      { period: '26-03', tce: 13.98, elec: 0.322 },
      { period: '26-04', tce: 13.92, elec: 0.320 },
      { period: '26-05', tce: 13.88, elec: 0.319 },
      { period: '26-06', tce: 13.84, elec: 0.319 },
      { period: '26-07', tce: 13.82, elec: 0.318 },
      { period: '26-08', tce: 13.80, elec: 0.318 },
    ],
  },
  {
    id: 'cat-tr-500-osfps',
    name: '500kV 三相自耦有载调压变压器 (OSFPS)',
    shortName: '500kV有载自耦变(OSFPS)',
    category: 'transformer',
    groupTag: '特高压/超高压',
    voltageLevel: '500kV级',
    desc: '有载分接调压结构复杂，综合能效控制标杆产品',
    unitTce: 14.50,
    unitTceStr: '14.50 tce/万kVA',
    unitElec: 0.320,
    unitElecStr: '0.320 kWh/kVA',
    steamOrNitrogen: '3.50 t/万kVA (蒸汽)',
    gasStr: '49.0 m³/万kVA',
    waterStr: '19.8 t/万kVA',
    modelCount: 28,
    outputShare: '9.8%',
    diffYoy: '-5.5%',
    trend12Months: [
      { period: '25-09', tce: 15.35, elec: 0.339 },
      { period: '25-10', tce: 15.22, elec: 0.336 },
      { period: '25-11', tce: 15.10, elec: 0.333 },
      { period: '25-12', tce: 14.98, elec: 0.330 },
      { period: '26-01', tce: 14.86, elec: 0.328 },
      { period: '26-02', tce: 14.75, elec: 0.326 },
      { period: '26-03', tce: 14.68, elec: 0.324 },
      { period: '26-04', tce: 14.62, elec: 0.322 },
      { period: '26-05', tce: 14.58, elec: 0.321 },
      { period: '26-06', tce: 14.54, elec: 0.321 },
      { period: '26-07', tce: 14.52, elec: 0.320 },
      { period: '26-08', tce: 14.50, elec: 0.320 },
    ],
  },

  // --- 2. 中高压电力变类 ---
  {
    id: 'cat-tr-330',
    name: '330kV 三相三绕组电力变压器 (SFZ)',
    shortName: '330kV三绕组变压器',
    category: 'transformer',
    groupTag: '中高压电力变',
    voltageLevel: '220kV级',
    desc: '330kV 输变电核心电力变压器',
    unitTce: 9.80,
    unitTceStr: '9.80 tce/万kVA',
    unitElec: 0.322,
    unitElecStr: '0.322 kWh/kVA',
    steamOrNitrogen: '2.30 t/万kVA (蒸汽)',
    gasStr: '32.5 m³/万kVA',
    waterStr: '13.8 t/万kVA',
    modelCount: 32,
    outputShare: '7.5%',
    diffYoy: '-5.4%',
    trend12Months: [
      { period: '25-09', tce: 10.36, elec: 0.340 },
      { period: '25-10', tce: 10.28, elec: 0.338 },
      { period: '25-11', tce: 10.19, elec: 0.335 },
      { period: '25-12', tce: 10.10, elec: 0.332 },
      { period: '26-01', tce: 10.02, elec: 0.330 },
      { period: '26-02', tce: 9.95, elec: 0.328 },
      { period: '26-03', tce: 9.90, elec: 0.326 },
      { period: '26-04', tce: 9.87, elec: 0.324 },
      { period: '26-05', tce: 9.84, elec: 0.323 },
      { period: '26-06', tce: 9.82, elec: 0.323 },
      { period: '26-07', tce: 9.81, elec: 0.322 },
      { period: '26-08', tce: 9.80, elec: 0.322 },
    ],
  },
  {
    id: 'cat-tr-220',
    name: '220kV 三相三绕组有载调压变压器 (SFZ11/13)',
    shortName: '220kV有载调压变(SFZ)',
    category: 'transformer',
    groupTag: '中高压电力变',
    voltageLevel: '220kV级',
    desc: '三相三绕组有载调压变压器，省域电网骨干主力设备',
    unitTce: 7.02,
    unitTceStr: '7.02 tce/万kVA',
    unitElec: 0.325,
    unitElecStr: '0.325 kWh/kVA',
    steamOrNitrogen: '1.70 t/万kVA (蒸汽)',
    gasStr: '24.0 m³/万kVA',
    waterStr: '10.5 t/万kVA',
    modelCount: 68,
    outputShare: '15.6%',
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
    id: 'cat-tr-220-sfp',
    name: '220kV 双绕组无励磁发电机变压器 (SFP)',
    shortName: '220kV发电机变(SFP)',
    category: 'transformer',
    groupTag: '中高压电力变',
    voltageLevel: '220kV级',
    desc: '30万/60万千瓦发电机组主变',
    unitTce: 6.20,
    unitTceStr: '6.20 tce/万kVA',
    unitElec: 0.322,
    unitElecStr: '0.322 kWh/kVA',
    steamOrNitrogen: '1.50 t/万kVA (蒸汽)',
    gasStr: '21.0 m³/万kVA',
    waterStr: '9.0 t/万kVA',
    modelCount: 45,
    outputShare: '8.4%',
    diffYoy: '-5.3%',
    trend12Months: [
      { period: '25-09', tce: 6.55, elec: 0.338 },
      { period: '25-10', tce: 6.50, elec: 0.336 },
      { period: '25-11', tce: 6.45, elec: 0.334 },
      { period: '25-12', tce: 6.40, elec: 0.332 },
      { period: '26-01', tce: 6.35, elec: 0.330 },
      { period: '26-02', tce: 6.30, elec: 0.328 },
      { period: '26-03', tce: 6.27, elec: 0.326 },
      { period: '26-04', tce: 6.25, elec: 0.324 },
      { period: '26-05', tce: 6.23, elec: 0.323 },
      { period: '26-06', tce: 6.22, elec: 0.323 },
      { period: '26-07', tce: 6.21, elec: 0.322 },
      { period: '26-08', tce: 6.20, elec: 0.322 },
    ],
  },
  {
    id: 'cat-tr-110',
    name: '110kV 节能型有载调压油浸变压器 (SZ11/18)',
    shortName: '110kV节能有载油变',
    category: 'transformer',
    groupTag: '中高压电力变',
    voltageLevel: '110kV级',
    desc: '城市电网与工业园区核心供电变压器，产销量大',
    unitTce: 4.25,
    unitTceStr: '4.25 tce/万kVA',
    unitElec: 0.327,
    unitElecStr: '0.327 kWh/kVA',
    steamOrNitrogen: '1.18 t/万kVA (蒸汽)',
    gasStr: '15.5 m³/万kVA',
    waterStr: '8.4 t/万kVA',
    modelCount: 126,
    outputShare: '18.2%',
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
    id: 'cat-tr-66',
    name: '66kV 级油浸式电力变压器 (SZ11/S11)',
    shortName: '66kV电力油浸变压器',
    category: 'transformer',
    groupTag: '中高压电力变',
    voltageLevel: '110kV级',
    desc: '东北及华北区域特色 66kV 输配电网主变',
    unitTce: 2.65,
    unitTceStr: '2.65 tce/万kVA',
    unitElec: 0.328,
    unitElecStr: '0.328 kWh/kVA',
    steamOrNitrogen: '0.75 t/万kVA (蒸汽)',
    gasStr: '10.2 m³/万kVA',
    waterStr: '5.2 t/万kVA',
    modelCount: 52,
    outputShare: '5.4%',
    diffYoy: '-4.5%',
    trend12Months: [
      { period: '25-09', tce: 2.78, elec: 0.342 },
      { period: '25-10', tce: 2.75, elec: 0.340 },
      { period: '25-11', tce: 2.73, elec: 0.338 },
      { period: '25-12', tce: 2.71, elec: 0.335 },
      { period: '26-01', tce: 2.69, elec: 0.333 },
      { period: '26-02', tce: 2.68, elec: 0.331 },
      { period: '26-03', tce: 2.67, elec: 0.330 },
      { period: '26-04', tce: 2.66, elec: 0.329 },
      { period: '26-05', tce: 2.66, elec: 0.329 },
      { period: '26-06', tce: 2.65, elec: 0.328 },
      { period: '26-07', tce: 2.65, elec: 0.328 },
      { period: '26-08', tce: 2.65, elec: 0.328 },
    ],
  },

  // --- 3. 干式与配电变类 ---
  {
    id: 'cat-tr-35',
    name: '35kV 环氧树脂浇注干式变压器 (SCB13/14)',
    shortName: '35kV环氧树脂干变',
    category: 'transformer',
    groupTag: '干式与配电变',
    voltageLevel: '35kV级及以下',
    desc: '环氧树脂薄绝缘真空浇注工艺，耐火防爆免维护',
    unitTce: 0.85,
    unitTceStr: '0.85 tce/万kVA',
    unitElec: 0.318,
    unitElecStr: '0.318 kWh/kVA',
    steamOrNitrogen: '0.22 t/万kVA (蒸汽)',
    gasStr: '7.8 m³/万kVA',
    waterStr: '2.6 t/万kVA',
    modelCount: 180,
    outputShare: '12.0%',
    diffYoy: '-6.5%',
    trend12Months: [
      { period: '25-09', tce: 0.91, elec: 0.340 },
      { period: '25-10', tce: 0.90, elec: 0.338 },
      { period: '25-11', tce: 0.89, elec: 0.335 },
      { period: '25-12', tce: 0.88, elec: 0.332 },
      { period: '26-01', tce: 0.87, elec: 0.330 },
      { period: '26-02', tce: 0.86, elec: 0.326 },
      { period: '26-03', tce: 0.86, elec: 0.324 },
      { period: '26-04', tce: 0.855, elec: 0.322 },
      { period: '26-05', tce: 0.853, elec: 0.320 },
      { period: '26-06', tce: 0.852, elec: 0.319 },
      { period: '26-07', tce: 0.851, elec: 0.318 },
      { period: '26-08', tce: 0.850, elec: 0.318 },
    ],
  },
  {
    id: 'cat-tr-35-oil',
    name: '35kV 级节能油浸式配电变压器 (S13/S20)',
    shortName: '35kV节能配电油变',
    category: 'transformer',
    groupTag: '干式与配电变',
    voltageLevel: '35kV级及以下',
    desc: '35kV 农网与工矿配电主力油浸变',
    unitTce: 0.92,
    unitTceStr: '0.92 tce/万kVA',
    unitElec: 0.322,
    unitElecStr: '0.322 kWh/kVA',
    steamOrNitrogen: '0.25 t/万kVA (蒸汽)',
    gasStr: '8.2 m³/万kVA',
    waterStr: '2.8 t/万kVA',
    modelCount: 145,
    outputShare: '9.2%',
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
  {
    id: 'cat-tr-10-scb',
    name: '10kV 新一代节能干式配电变压器 (SCB14/18)',
    shortName: '10kV节能干变(SCB)',
    category: 'transformer',
    groupTag: '干式与配电变',
    voltageLevel: '35kV级及以下',
    desc: '一级能效国标配电干式变压器，建筑与医院商圈标配',
    unitTce: 0.70,
    unitTceStr: '0.70 tce/万kVA',
    unitElec: 0.328,
    unitElecStr: '0.328 kWh/kVA',
    steamOrNitrogen: '0.19 t/万kVA (蒸汽)',
    gasStr: '6.5 m³/万kVA',
    waterStr: '2.2 t/万kVA',
    modelCount: 340,
    outputShare: '16.5%',
    diffYoy: '-5.4%',
    trend12Months: [
      { period: '25-09', tce: 0.74, elec: 0.345 },
      { period: '25-10', tce: 0.73, elec: 0.342 },
      { period: '25-11', tce: 0.725, elec: 0.340 },
      { period: '25-12', tce: 0.72, elec: 0.338 },
      { period: '26-01', tce: 0.715, elec: 0.335 },
      { period: '26-02', tce: 0.71, elec: 0.333 },
      { period: '26-03', tce: 0.708, elec: 0.331 },
      { period: '26-04', tce: 0.705, elec: 0.330 },
      { period: '26-05', tce: 0.703, elec: 0.329 },
      { period: '26-06', tce: 0.702, elec: 0.329 },
      { period: '26-07', tce: 0.701, elec: 0.328 },
      { period: '26-08', tce: 0.700, elec: 0.328 },
    ],
  },
  {
    id: 'cat-tr-10-amorphous',
    name: '10kV 非晶合金立体卷铁芯干变 (SCBH15)',
    shortName: '10kV非晶合金干变',
    category: 'transformer',
    groupTag: '干式与配电变',
    voltageLevel: '35kV级及以下',
    desc: '非晶合金铁芯空载损耗降低 60% 以上的绿色低碳干变',
    unitTce: 0.65,
    unitTceStr: '0.65 tce/万kVA',
    unitElec: 0.315,
    unitElecStr: '0.315 kWh/kVA',
    steamOrNitrogen: '0.18 t/万kVA (蒸汽)',
    gasStr: '6.0 m³/万kVA',
    waterStr: '2.0 t/万kVA',
    modelCount: 160,
    outputShare: '7.8%',
    diffYoy: '-7.0%',
    trend12Months: [
      { period: '25-09', tce: 0.70, elec: 0.338 },
      { period: '25-10', tce: 0.69, elec: 0.335 },
      { period: '25-11', tce: 0.685, elec: 0.332 },
      { period: '25-12', tce: 0.68, elec: 0.328 },
      { period: '26-01', tce: 0.672, elec: 0.325 },
      { period: '26-02', tce: 0.665, elec: 0.322 },
      { period: '26-03', tce: 0.66, elec: 0.320 },
      { period: '26-04', tce: 0.656, elec: 0.318 },
      { period: '26-05', tce: 0.654, elec: 0.317 },
      { period: '26-06', tce: 0.652, elec: 0.316 },
      { period: '26-07', tce: 0.651, elec: 0.315 },
      { period: '26-08', tce: 0.650, elec: 0.315 },
    ],
  },
  {
    id: 'cat-tr-10-oil-amorphous',
    name: '10kV 油浸式非晶合金配电变压器 (SBH15)',
    shortName: '10kV非晶配电油变',
    category: 'transformer',
    groupTag: '干式与配电变',
    voltageLevel: '35kV级及以下',
    desc: '农村电网及低负荷率台区专用超低损耗油浸配电变',
    unitTce: 0.58,
    unitTceStr: '0.58 tce/万kVA',
    unitElec: 0.312,
    unitElecStr: '0.312 kWh/kVA',
    steamOrNitrogen: '0.16 t/万kVA (蒸汽)',
    gasStr: '5.5 m³/万kVA',
    waterStr: '1.8 t/万kVA',
    modelCount: 210,
    outputShare: '10.5%',
    diffYoy: '-6.2%',
    trend12Months: [
      { period: '25-09', tce: 0.62, elec: 0.332 },
      { period: '25-10', tce: 0.615, elec: 0.330 },
      { period: '25-11', tce: 0.61, elec: 0.327 },
      { period: '25-12', tce: 0.605, elec: 0.324 },
      { period: '26-01', tce: 0.598, elec: 0.320 },
      { period: '26-02', tce: 0.592, elec: 0.318 },
      { period: '26-03', tce: 0.588, elec: 0.316 },
      { period: '26-04', tce: 0.585, elec: 0.314 },
      { period: '26-05', tce: 0.583, elec: 0.313 },
      { period: '26-06', tce: 0.582, elec: 0.313 },
      { period: '26-07', tce: 0.581, elec: 0.312 },
      { period: '26-08', tce: 0.580, elec: 0.312 },
    ],
  },

  // --- 4. 新能源与特种变类 ---
  {
    id: 'cat-tr-pv',
    name: '光伏/风电专用升压华式箱变 (ZGS/YB)',
    shortName: '光伏/风电升压箱变',
    category: 'transformer',
    groupTag: '新能源与特种变',
    voltageLevel: '35kV级及以下',
    desc: '戈壁荒漠及海上风电基地专用一体化智能箱式变电站',
    unitTce: 0.95,
    unitTceStr: '0.95 tce/万kVA',
    unitElec: 0.325,
    unitElecStr: '0.325 kWh/kVA',
    steamOrNitrogen: '0.26 t/万kVA (蒸汽)',
    gasStr: '8.6 m³/万kVA',
    waterStr: '2.9 t/万kVA',
    modelCount: 195,
    outputShare: '13.5%',
    diffYoy: '-5.6%',
    trend12Months: [
      { period: '25-09', tce: 1.01, elec: 0.344 },
      { period: '25-10', tce: 1.00, elec: 0.341 },
      { period: '25-11', tce: 0.99, elec: 0.338 },
      { period: '25-12', tce: 0.98, elec: 0.335 },
      { period: '26-01', tce: 0.972, elec: 0.332 },
      { period: '26-02', tce: 0.965, elec: 0.330 },
      { period: '26-03', tce: 0.96, elec: 0.328 },
      { period: '26-04', tce: 0.956, elec: 0.327 },
      { period: '26-05', tce: 0.954, elec: 0.326 },
      { period: '26-06', tce: 0.952, elec: 0.326 },
      { period: '26-07', tce: 0.951, elec: 0.325 },
      { period: '26-08', tce: 0.950, elec: 0.325 },
    ],
  },
  {
    id: 'cat-tr-ess',
    name: '储能专用变流升压一体舱变压器',
    shortName: '储能一体升压变',
    category: 'transformer',
    groupTag: '新能源与特种变',
    voltageLevel: '35kV级及以下',
    desc: '大容量电化学储能电站并网变流升压一体化设备',
    unitTce: 1.05,
    unitTceStr: '1.05 tce/万kVA',
    unitElec: 0.328,
    unitElecStr: '0.328 kWh/kVA',
    steamOrNitrogen: '0.30 t/万kVA (蒸汽)',
    gasStr: '9.2 m³/万kVA',
    waterStr: '3.1 t/万kVA',
    modelCount: 85,
    outputShare: '6.5%',
    diffYoy: '-6.0%',
    trend12Months: [
      { period: '25-09', tce: 1.12, elec: 0.348 },
      { period: '25-10', tce: 1.11, elec: 0.345 },
      { period: '25-11', tce: 1.095, elec: 0.341 },
      { period: '25-12', tce: 1.085, elec: 0.338 },
      { period: '26-01', tce: 1.075, elec: 0.335 },
      { period: '26-02', tce: 1.068, elec: 0.333 },
      { period: '26-03', tce: 1.062, elec: 0.331 },
      { period: '26-04', tce: 1.058, elec: 0.330 },
      { period: '26-05', tce: 1.055, elec: 0.329 },
      { period: '26-06', tce: 1.053, elec: 0.329 },
      { period: '26-07', tce: 1.051, elec: 0.328 },
      { period: '26-08', tce: 1.050, elec: 0.328 },
    ],
  },
  {
    id: 'cat-tr-rectifier',
    name: '工业大功率整流变压器 (ZHSFT)',
    shortName: '大功率工业整流变',
    category: 'transformer',
    groupTag: '新能源与特种变',
    voltageLevel: '110kV级',
    desc: '电解铝、绿氢电解槽供电专用大功率整流变压器',
    unitTce: 3.40,
    unitTceStr: '3.40 tce/万kVA',
    unitElec: 0.335,
    unitElecStr: '0.335 kWh/kVA',
    steamOrNitrogen: '0.95 t/万kVA (蒸汽)',
    gasStr: '12.5 m³/万kVA',
    waterStr: '5.8 t/万kVA',
    modelCount: 48,
    outputShare: '4.5%',
    diffYoy: '-4.2%',
    trend12Months: [
      { period: '25-09', tce: 3.55, elec: 0.350 },
      { period: '25-10', tce: 3.52, elec: 0.347 },
      { period: '25-11', tce: 3.49, elec: 0.344 },
      { period: '25-12', tce: 3.47, elec: 0.341 },
      { period: '26-01', tce: 3.45, elec: 0.339 },
      { period: '26-02', tce: 3.43, elec: 0.338 },
      { period: '26-03', tce: 3.42, elec: 0.337 },
      { period: '26-04', tce: 3.41, elec: 0.336 },
      { period: '26-05', tce: 3.41, elec: 0.336 },
      { period: '26-06', tce: 3.405, elec: 0.335 },
      { period: '26-07', tce: 3.402, elec: 0.335 },
      { period: '26-08', tce: 3.400, elec: 0.335 },
    ],
  },
  {
    id: 'cat-tr-traction',
    name: '电气化铁道牵引变压器 (QSFP/TB)',
    shortName: '高铁专用牵引变压器',
    category: 'transformer',
    groupTag: '新能源与特种变',
    voltageLevel: '220kV级',
    desc: '350km/h 高铁客运专线及重载铁路牵引变电所专用主变',
    unitTce: 5.60,
    unitTceStr: '5.60 tce/万kVA',
    unitElec: 0.330,
    unitElecStr: '0.330 kWh/kVA',
    steamOrNitrogen: '1.45 t/万kVA (蒸汽)',
    gasStr: '19.8 m³/万kVA',
    waterStr: '8.5 t/万kVA',
    modelCount: 42,
    outputShare: '4.8%',
    diffYoy: '-4.8%',
    trend12Months: [
      { period: '25-09', tce: 5.88, elec: 0.346 },
      { period: '25-10', tce: 5.83, elec: 0.343 },
      { period: '25-11', tce: 5.78, elec: 0.340 },
      { period: '25-12', tce: 5.73, elec: 0.338 },
      { period: '26-01', tce: 5.69, elec: 0.335 },
      { period: '26-02', tce: 5.66, elec: 0.333 },
      { period: '26-03', tce: 5.64, elec: 0.332 },
      { period: '26-04', tce: 5.62, elec: 0.331 },
      { period: '26-05', tce: 5.61, elec: 0.331 },
      { period: '26-06', tce: 5.605, elec: 0.330 },
      { period: '26-07', tce: 5.602, elec: 0.330 },
      { period: '26-08', tce: 5.600, elec: 0.330 },
    ],
  },
  {
    id: 'cat-tr-reactor',
    name: '特高压/超高压并联电抗器 (BKD)',
    shortName: '高压并联电抗器(BKD)',
    category: 'transformer',
    groupTag: '新能源与特种变',
    voltageLevel: '500kV级',
    desc: '特高压长距离输电线路无功补偿核心限制过电压设备',
    unitTce: 8.20,
    unitTceStr: '8.20 tce/万kVA',
    unitElec: 0.325,
    unitElecStr: '0.325 kWh/kVA',
    steamOrNitrogen: '2.10 t/万kVA (蒸汽)',
    gasStr: '28.0 m³/万kVA',
    waterStr: '11.8 t/万kVA',
    modelCount: 30,
    outputShare: '3.6%',
    diffYoy: '-5.0%',
    trend12Months: [
      { period: '25-09', tce: 8.64, elec: 0.342 },
      { period: '25-10', tce: 8.58, elec: 0.339 },
      { period: '25-11', tce: 8.51, elec: 0.336 },
      { period: '25-12', tce: 8.44, elec: 0.333 },
      { period: '26-01', tce: 8.38, elec: 0.331 },
      { period: '26-02', tce: 8.32, elec: 0.329 },
      { period: '26-03', tce: 8.28, elec: 0.327 },
      { period: '26-04', tce: 8.25, elec: 0.326 },
      { period: '26-05', tce: 8.23, elec: 0.326 },
      { period: '26-06', tce: 8.22, elec: 0.325 },
      { period: '26-07', tce: 8.21, elec: 0.325 },
      { period: '26-08', tce: 8.20, elec: 0.325 },
    ],
  },
]

// 🌟 线缆产业 20 种核心产品种类全景能效库 (涵盖高压超高压电缆、中低压电力电缆、新能源与特种电缆、架空导线与控制线)
export const CABLE_CATEGORIES: ProductCategoryItem[] = [
  // --- 1. 超高压及高压电缆 ---
  {
    id: 'cat-cb-500',
    name: '500kV 皱纹铝套超高压交联电缆 (立塔干法)',
    shortName: '500kV皱纹铝套高压电缆',
    category: 'cable',
    groupTag: '高压及超高压电缆',
    voltageLevel: '500kV级',
    desc: '立式交联生产线 (VCV) 制造，国内最高电压等级电缆',
    unitTce: 0.877,
    unitTceStr: '0.877 tce/km',
    unitElec: 6616,
    unitElecStr: '6,616 kWh/km',
    steamOrNitrogen: '19.7 m³/km (氮气)',
    gasStr: '12.2 m³/km',
    waterStr: '2.6 t/km',
    modelCount: 45,
    outputShare: '14.0%',
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
  {
    id: 'cat-cb-220',
    name: '220kV 皱纹铝套高压交联聚乙烯电缆',
    shortName: '220kV皱纹铝套高压电缆',
    category: 'cable',
    groupTag: '高压及超高压电缆',
    voltageLevel: '220kV级',
    desc: '大中城市电网 220kV 进城入地主力输电电缆',
    unitTce: 0.642,
    unitTceStr: '0.642 tce/km',
    unitElec: 4850,
    unitElecStr: '4,850 kWh/km',
    steamOrNitrogen: '14.5 m³/km (氮气)',
    gasStr: '9.0 m³/km',
    waterStr: '2.0 t/km',
    modelCount: 68,
    outputShare: '16.5%',
    diffYoy: '-5.9%',
    trend12Months: [
      { period: '25-09', tce: 0.682, elec: 5150 },
      { period: '25-10', tce: 0.675, elec: 5100 },
      { period: '25-11', tce: 0.668, elec: 5050 },
      { period: '25-12', tce: 0.662, elec: 5000 },
      { period: '26-01', tce: 0.656, elec: 4950 },
      { period: '26-02', tce: 0.651, elec: 4920 },
      { period: '26-03', tce: 0.648, elec: 4890 },
      { period: '26-04', tce: 0.646, elec: 4880 },
      { period: '26-05', tce: 0.644, elec: 4865 },
      { period: '26-06', tce: 0.643, elec: 4858 },
      { period: '26-07', tce: 0.642, elec: 4852 },
      { period: '26-08', tce: 0.642, elec: 4850 },
    ],
  },
  {
    id: 'cat-cb-110',
    name: '110kV 平滑铝套高压电力电缆',
    shortName: '110kV平滑铝套高压电缆',
    category: 'cable',
    groupTag: '高压及超高压电缆',
    voltageLevel: '110kV级',
    desc: '平滑铝套抗拉抗压性能优异，高压电缆市场主流',
    unitTce: 0.482,
    unitTceStr: '0.482 tce/km',
    unitElec: 3640,
    unitElecStr: '3,640 kWh/km',
    steamOrNitrogen: '11.0 m³/km (氮气)',
    gasStr: '7.2 m³/km',
    waterStr: '1.6 t/km',
    modelCount: 120,
    outputShare: '22.0%',
    diffYoy: '-6.1%',
    trend12Months: [
      { period: '25-09', tce: 0.513, elec: 3880 },
      { period: '25-10', tce: 0.508, elec: 3840 },
      { period: '25-11', tce: 0.502, elec: 3790 },
      { period: '25-12', tce: 0.497, elec: 3750 },
      { period: '26-01', tce: 0.492, elec: 3710 },
      { period: '26-02', tce: 0.488, elec: 3680 },
      { period: '26-03', tce: 0.486, elec: 3670 },
      { period: '26-04', tce: 0.484, elec: 3655 },
      { period: '26-05', tce: 0.483, elec: 3650 },
      { period: '26-06', tce: 0.483, elec: 3645 },
      { period: '26-07', tce: 0.482, elec: 3642 },
      { period: '26-08', tce: 0.482, elec: 3640 },
    ],
  },
  {
    id: 'cat-cb-66',
    name: '66kV 级中高压交联聚乙烯绝缘电缆',
    shortName: '66kV中高压交联电缆',
    category: 'cable',
    groupTag: '高压及超高压电缆',
    voltageLevel: '110kV级',
    desc: '风电场集电线路及区域高压配电专用',
    unitTce: 0.365,
    unitTceStr: '0.365 tce/km',
    unitElec: 2750,
    unitElecStr: '2,750 kWh/km',
    steamOrNitrogen: '8.8 m³/km (氮气)',
    gasStr: '5.8 m³/km',
    waterStr: '1.2 t/km',
    modelCount: 75,
    outputShare: '9.2%',
    diffYoy: '-4.8%',
    trend12Months: [
      { period: '25-09', tce: 0.383, elec: 2890 },
      { period: '25-10', tce: 0.380, elec: 2865 },
      { period: '25-11', tce: 0.376, elec: 2835 },
      { period: '25-12', tce: 0.373, elec: 2810 },
      { period: '26-01', tce: 0.370, elec: 2790 },
      { period: '26-02', tce: 0.368, elec: 2775 },
      { period: '26-03', tce: 0.367, elec: 2765 },
      { period: '26-04', tce: 0.366, elec: 2760 },
      { period: '26-05', tce: 0.366, elec: 2755 },
      { period: '26-06', tce: 0.365, elec: 2752 },
      { period: '26-07', tce: 0.365, elec: 2750 },
      { period: '26-08', tce: 0.365, elec: 2750 },
    ],
  },
  {
    id: 'cat-cb-subsea',
    name: '110kV~220kV 海底光电复合交联电缆',
    shortName: '海底光电复合高压缆',
    category: 'cable',
    groupTag: '高压及超高压电缆',
    voltageLevel: '500kV级',
    desc: '海上风电送出与海岛跨海供电高技术高附加值产品',
    unitTce: 0.960,
    unitTceStr: '0.960 tce/km',
    unitElec: 7250,
    unitElecStr: '7,250 kWh/km',
    steamOrNitrogen: '22.0 m³/km (氮气)',
    gasStr: '14.5 m³/km',
    waterStr: '3.2 t/km',
    modelCount: 28,
    outputShare: '6.5%',
    diffYoy: '-5.2%',
    trend12Months: [
      { period: '25-09', tce: 1.012, elec: 7650 },
      { period: '25-10', tce: 1.005, elec: 7590 },
      { period: '25-11', tce: 0.995, elec: 7520 },
      { period: '25-12', tce: 0.988, elec: 7460 },
      { period: '26-01', tce: 0.980, elec: 7400 },
      { period: '26-02', tce: 0.974, elec: 7350 },
      { period: '26-03', tce: 0.970, elec: 7320 },
      { period: '26-04', tce: 0.966, elec: 7290 },
      { period: '26-05', tce: 0.964, elec: 7275 },
      { period: '26-06', tce: 0.962, elec: 7260 },
      { period: '26-07', tce: 0.961, elec: 7255 },
      { period: '26-08', tce: 0.960, elec: 7250 },
    ],
  },

  // --- 2. 中低压电力电缆 ---
  {
    id: 'cat-cb-35-yjv22',
    name: '35kV 钢带铠装中压交联电缆 (YJV22)',
    shortName: '35kV钢带铠装中压缆',
    category: 'cable',
    groupTag: '中低压电力电缆',
    voltageLevel: '35kV级及以下',
    desc: '35kV 配网主力直埋中压铠装电缆',
    unitTce: 0.238,
    unitTceStr: '0.238 tce/km',
    unitElec: 1785,
    unitElecStr: '1,785 kWh/km',
    steamOrNitrogen: '6.6 m³/km (氮气)',
    gasStr: '4.3 m³/km',
    waterStr: '0.9 t/km',
    modelCount: 185,
    outputShare: '18.5%',
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
    id: 'cat-cb-35-yjv32',
    name: '35kV 细钢丝铠装中压交联电缆 (YJV32)',
    shortName: '35kV钢丝铠装中压缆',
    category: 'cable',
    groupTag: '中低压电力电缆',
    voltageLevel: '35kV级及以下',
    desc: '竖井与高落差地段专用抗拉中压电缆',
    unitTce: 0.265,
    unitTceStr: '0.265 tce/km',
    unitElec: 1990,
    unitElecStr: '1,990 kWh/km',
    steamOrNitrogen: '7.2 m³/km (氮气)',
    gasStr: '4.8 m³/km',
    waterStr: '1.0 t/km',
    modelCount: 90,
    outputShare: '7.2%',
    diffYoy: '-5.0%',
    trend12Months: [
      { period: '25-09', tce: 0.279, elec: 2095 },
      { period: '25-10', tce: 0.276, elec: 2075 },
      { period: '25-11', tce: 0.273, elec: 2050 },
      { period: '25-12', tce: 0.270, elec: 2030 },
      { period: '26-01', tce: 0.268, elec: 2015 },
      { period: '26-02', tce: 0.267, elec: 2005 },
      { period: '26-03', tce: 0.266, elec: 2000 },
      { period: '26-04', tce: 0.265, elec: 1995 },
      { period: '26-05', tce: 0.265, elec: 1992 },
      { period: '26-06', tce: 0.265, elec: 1990 },
      { period: '26-07', tce: 0.265, elec: 1990 },
      { period: '26-08', tce: 0.265, elec: 1990 },
    ],
  },
  {
    id: 'cat-cb-10-yjv22',
    name: '10kV 三芯铠装交联电力电缆 (YJV22)',
    shortName: '10kV三芯铠装电力缆',
    category: 'cable',
    groupTag: '中低压电力电缆',
    voltageLevel: '35kV级及以下',
    desc: '城市配电网地下排管与直埋应用最广电缆',
    unitTce: 0.195,
    unitTceStr: '0.195 tce/km',
    unitElec: 1465,
    unitElecStr: '1,465 kWh/km',
    steamOrNitrogen: '5.2 m³/km (氮气)',
    gasStr: '3.6 m³/km',
    waterStr: '0.8 t/km',
    modelCount: 260,
    outputShare: '24.0%',
    diffYoy: '-5.5%',
    trend12Months: [
      { period: '25-09', tce: 0.206, elec: 1550 },
      { period: '25-10', tce: 0.204, elec: 1535 },
      { period: '25-11', tce: 0.202, elec: 1520 },
      { period: '25-12', tce: 0.200, elec: 1505 },
      { period: '26-01', tce: 0.198, elec: 1490 },
      { period: '26-02', tce: 0.197, elec: 1480 },
      { period: '26-03', tce: 0.196, elec: 1475 },
      { period: '26-04', tce: 0.196, elec: 1470 },
      { period: '26-05', tce: 0.195, elec: 1468 },
      { period: '26-06', tce: 0.195, elec: 1466 },
      { period: '26-07', tce: 0.195, elec: 1465 },
      { period: '26-08', tce: 0.195, elec: 1465 },
    ],
  },
  {
    id: 'cat-cb-10-yjv',
    name: '10kV 单芯交联聚乙烯电力电缆 (YJV)',
    shortName: '10kV单芯交联电力缆',
    category: 'cable',
    groupTag: '中低压电力电缆',
    voltageLevel: '35kV级及以下',
    desc: '大截面大电流配电回路专用单芯中压电缆',
    unitTce: 0.165,
    unitTceStr: '0.165 tce/km',
    unitElec: 1240,
    unitElecStr: '1,240 kWh/km',
    steamOrNitrogen: '4.5 m³/km (氮气)',
    gasStr: '3.1 m³/km',
    waterStr: '0.7 t/km',
    modelCount: 210,
    outputShare: '18.5%',
    diffYoy: '-4.9%',
    trend12Months: [
      { period: '25-09', tce: 0.174, elec: 1305 },
      { period: '25-10', tce: 0.172, elec: 1290 },
      { period: '25-11', tce: 0.170, elec: 1280 },
      { period: '25-12', tce: 0.169, elec: 1270 },
      { period: '26-01', tce: 0.168, elec: 1260 },
      { period: '26-02', tce: 0.167, elec: 1255 },
      { period: '26-03', tce: 0.166, elec: 1250 },
      { period: '26-04', tce: 0.166, elec: 1245 },
      { period: '26-05', tce: 0.165, elec: 1242 },
      { period: '26-06', tce: 0.165, elec: 1241 },
      { period: '26-07', tce: 0.165, elec: 1240 },
      { period: '26-08', tce: 0.165, elec: 1240 },
    ],
  },
  {
    id: 'cat-cb-lv-wdz',
    name: '0.6/1kV 低烟无卤阻燃电力电缆 (WDZ-YJY)',
    shortName: '0.6/1kV低烟无卤阻燃缆',
    category: 'cable',
    groupTag: '中低压电力电缆',
    voltageLevel: '35kV级及以下',
    desc: '大型商场、地铁、数据中心绿色低碳环保首选',
    unitTce: 0.168,
    unitTceStr: '0.168 tce/km',
    unitElec: 1260,
    unitElecStr: '1,260 kWh/km',
    steamOrNitrogen: '3.8 m³/km (氮气)',
    gasStr: '3.0 m³/km',
    waterStr: '0.6 t/km',
    modelCount: 420,
    outputShare: '26.5%',
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
    id: 'cat-cb-lv-vv',
    name: '0.6/1kV 聚氯乙烯绝缘铠装电缆 (VV22)',
    shortName: '0.6/1kV铠装电力电缆',
    category: 'cable',
    groupTag: '中低压电力电缆',
    voltageLevel: '35kV级及以下',
    desc: '传统工业动力配电经济型铠装电缆',
    unitTce: 0.145,
    unitTceStr: '0.145 tce/km',
    unitElec: 1090,
    unitElecStr: '1,090 kWh/km',
    steamOrNitrogen: '3.2 m³/km (氮气)',
    gasStr: '2.6 m³/km',
    waterStr: '0.5 t/km',
    modelCount: 310,
    outputShare: '18.0%',
    diffYoy: '-4.5%',
    trend12Months: [
      { period: '25-09', tce: 0.152, elec: 1145 },
      { period: '25-10', tce: 0.150, elec: 1130 },
      { period: '25-11', tce: 0.149, elec: 1120 },
      { period: '25-12', tce: 0.148, elec: 1110 },
      { period: '26-01', tce: 0.147, elec: 1105 },
      { period: '26-02', tce: 0.146, elec: 1100 },
      { period: '26-03', tce: 0.146, elec: 1095 },
      { period: '26-04', tce: 0.145, elec: 1092 },
      { period: '26-05', tce: 0.145, elec: 1091 },
      { period: '26-06', tce: 0.145, elec: 1090 },
      { period: '26-07', tce: 0.145, elec: 1090 },
      { period: '26-08', tce: 0.145, elec: 1090 },
    ],
  },
  {
    id: 'cat-cb-fire',
    name: '0.6/1kV 矿物绝缘柔性防火电缆 (BTTZ/YTTW)',
    shortName: '矿物绝缘柔性防火缆',
    category: 'cable',
    groupTag: '中低压电力电缆',
    voltageLevel: '35kV级及以下',
    desc: '超高耐火极限 (950℃/3h)，特级消防负荷专用电缆',
    unitTce: 0.220,
    unitTceStr: '0.220 tce/km',
    unitElec: 1650,
    unitElecStr: '1,650 kWh/km',
    steamOrNitrogen: '5.6 m³/km (氮气)',
    gasStr: '4.0 m³/km',
    waterStr: '0.9 t/km',
    modelCount: 140,
    outputShare: '9.5%',
    diffYoy: '-5.8%',
    trend12Months: [
      { period: '25-09', tce: 0.234, elec: 1755 },
      { period: '25-10', tce: 0.231, elec: 1730 },
      { period: '25-11', tce: 0.228, elec: 1710 },
      { period: '25-12', tce: 0.226, elec: 1695 },
      { period: '26-01', tce: 0.224, elec: 1680 },
      { period: '26-02', tce: 0.223, elec: 1670 },
      { period: '26-03', tce: 0.222, elec: 1665 },
      { period: '26-04', tce: 0.221, elec: 1658 },
      { period: '26-05', tce: 0.221, elec: 1654 },
      { period: '26-06', tce: 0.220, elec: 1652 },
      { period: '26-07', tce: 0.220, elec: 1650 },
      { period: '26-08', tce: 0.220, elec: 1650 },
    ],
  },

  // --- 3. 新能源与特种电缆 ---
  {
    id: 'cat-cb-pv',
    name: '光伏系统专用耐候阻燃直流电缆 (PV1-F)',
    shortName: '光伏专用直流耐候缆',
    category: 'cable',
    groupTag: '新能源与特种电缆',
    voltageLevel: '35kV级及以下',
    desc: '抗紫外线、耐臭氧、耐高低温极端荒漠气候专用',
    unitTce: 0.155,
    unitTceStr: '0.155 tce/km',
    unitElec: 1165,
    unitElecStr: '1,165 kWh/km',
    steamOrNitrogen: '4.2 m³/km (氮气)',
    gasStr: '3.2 m³/km',
    waterStr: '0.7 t/km',
    modelCount: 110,
    outputShare: '12.0%',
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
    id: 'cat-cb-wind',
    name: '风力发电专用耐扭曲低温橡套软电缆',
    shortName: '风电耐扭曲耐低温软缆',
    category: 'cable',
    groupTag: '新能源与特种电缆',
    voltageLevel: '35kV级及以下',
    desc: '风电机组机舱塔筒垂吊专用，耐扭曲超百万次',
    unitTce: 0.180,
    unitTceStr: '0.180 tce/km',
    unitElec: 1350,
    unitElecStr: '1,350 kWh/km',
    steamOrNitrogen: '4.8 m³/km (氮气)',
    gasStr: '3.6 m³/km',
    waterStr: '0.8 t/km',
    modelCount: 85,
    outputShare: '7.8%',
    diffYoy: '-6.2%',
    trend12Months: [
      { period: '25-09', tce: 0.192, elec: 1440 },
      { period: '25-10', tce: 0.190, elec: 1425 },
      { period: '25-11', tce: 0.187, elec: 1405 },
      { period: '25-12', tce: 0.185, elec: 1390 },
      { period: '26-01', tce: 0.183, elec: 1375 },
      { period: '26-02', tce: 0.182, elec: 1365 },
      { period: '26-03', tce: 0.181, elec: 1360 },
      { period: '26-04', tce: 0.180, elec: 1355 },
      { period: '26-05', tce: 0.180, elec: 1352 },
      { period: '26-06', tce: 0.180, elec: 1350 },
      { period: '26-07', tce: 0.180, elec: 1350 },
      { period: '26-08', tce: 0.180, elec: 1350 },
    ],
  },
  {
    id: 'cat-cb-ess',
    name: '储能电池系统专用高压软电缆',
    shortName: '储能电池专用高压缆',
    category: 'cable',
    groupTag: '新能源与特种电缆',
    voltageLevel: '35kV级及以下',
    desc: '耐直流高压、耐酸碱与阻燃性能优异的储能舱软电缆',
    unitTce: 0.140,
    unitTceStr: '0.140 tce/km',
    unitElec: 1050,
    unitElecStr: '1,050 kWh/km',
    steamOrNitrogen: '3.6 m³/km (氮气)',
    gasStr: '2.8 m³/km',
    waterStr: '0.6 t/km',
    modelCount: 95,
    outputShare: '8.4%',
    diffYoy: '-5.4%',
    trend12Months: [
      { period: '25-09', tce: 0.148, elec: 1110 },
      { period: '25-10', tce: 0.146, elec: 1095 },
      { period: '25-11', tce: 0.144, elec: 1080 },
      { period: '25-12', tce: 0.143, elec: 1072 },
      { period: '26-01', tce: 0.142, elec: 1065 },
      { period: '26-02', tce: 0.141, elec: 1058 },
      { period: '26-03', tce: 0.141, elec: 1055 },
      { period: '26-04', tce: 0.140, elec: 1052 },
      { period: '26-05', tce: 0.140, elec: 1050 },
      { period: '26-06', tce: 0.140, elec: 1050 },
      { period: '26-07', tce: 0.140, elec: 1050 },
      { period: '26-08', tce: 0.140, elec: 1050 },
    ],
  },
  {
    id: 'cat-cb-ev',
    name: '电动汽车充电桩专用柔性电缆',
    shortName: '充电桩专用柔性电缆',
    category: 'cable',
    groupTag: '新能源与特种电缆',
    voltageLevel: '35kV级及以下',
    desc: '液冷大功率超充枪线与高频弯折专用软缆',
    unitTce: 0.125,
    unitTceStr: '0.125 tce/km',
    unitElec: 940,
    unitElecStr: '940 kWh/km',
    steamOrNitrogen: '3.0 m³/km (氮气)',
    gasStr: '2.4 m³/km',
    waterStr: '0.5 t/km',
    modelCount: 120,
    outputShare: '9.0%',
    diffYoy: '-4.6%',
    trend12Months: [
      { period: '25-09', tce: 0.131, elec: 985 },
      { period: '25-10', tce: 0.129, elec: 970 },
      { period: '25-11', tce: 0.128, elec: 962 },
      { period: '25-12', tce: 0.127, elec: 955 },
      { period: '26-01', tce: 0.126, elec: 948 },
      { period: '26-02', tce: 0.126, elec: 945 },
      { period: '26-03', tce: 0.125, elec: 942 },
      { period: '26-04', tce: 0.125, elec: 941 },
      { period: '26-05', tce: 0.125, elec: 940 },
      { period: '26-06', tce: 0.125, elec: 940 },
      { period: '26-07', tce: 0.125, elec: 940 },
      { period: '26-08', tce: 0.125, elec: 940 },
    ],
  },

  // --- 4. 架空导线与控制线 ---
  {
    id: 'cat-cb-overhead-jklyj',
    name: 'JKLYJ 架空绝缘导线 (10kV/1kV)',
    shortName: 'JKLYJ架空绝缘导线',
    category: 'cable',
    groupTag: '架空导线与控制线',
    voltageLevel: 'all',
    desc: '农网配电及林区防触电架空绝缘导线',
    unitTce: 0.086,
    unitTceStr: '0.086 tce/km',
    unitElec: 645,
    unitElecStr: '645 kWh/km',
    steamOrNitrogen: '1.2 m³/km (氮气)',
    gasStr: '1.5 m³/km',
    waterStr: '0.3 t/km',
    modelCount: 260,
    outputShare: '15.5%',
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
  {
    id: 'cat-cb-overhead-lgj',
    name: 'LGJ 钢芯铝绞线及高导电率导线',
    shortName: 'LGJ钢芯铝绞线',
    category: 'cable',
    groupTag: '架空导线与控制线',
    voltageLevel: 'all',
    desc: '长距离特高压与超高压架空输电线路主力裸导线',
    unitTce: 0.065,
    unitTceStr: '0.065 tce/km',
    unitElec: 490,
    unitElecStr: '490 kWh/km',
    steamOrNitrogen: '0.8 m³/km (氮气)',
    gasStr: '1.1 m³/km',
    waterStr: '0.2 t/km',
    modelCount: 320,
    outputShare: '21.0%',
    diffYoy: '-4.8%',
    trend12Months: [
      { period: '25-09', tce: 0.069, elec: 520 },
      { period: '25-10', tce: 0.068, elec: 512 },
      { period: '25-11', tce: 0.067, elec: 505 },
      { period: '25-12', tce: 0.067, elec: 502 },
      { period: '26-01', tce: 0.066, elec: 498 },
      { period: '26-02', tce: 0.066, elec: 495 },
      { period: '26-03', tce: 0.065, elec: 492 },
      { period: '26-04', tce: 0.065, elec: 491 },
      { period: '26-05', tce: 0.065, elec: 490 },
      { period: '26-06', tce: 0.065, elec: 490 },
      { period: '26-07', tce: 0.065, elec: 490 },
      { period: '26-08', tce: 0.065, elec: 490 },
    ],
  },
  {
    id: 'cat-cb-control-kvv',
    name: '屏蔽控制电缆及计算机信号缆 (KVVP/DJYPVP)',
    shortName: '屏蔽控制及信号电缆',
    category: 'cable',
    groupTag: '架空导线与控制线',
    voltageLevel: 'all',
    desc: '发电厂与智能变电站二次控制与抗电磁干扰信号线',
    unitTce: 0.098,
    unitTceStr: '0.098 tce/km',
    unitElec: 735,
    unitElecStr: '735 kWh/km',
    steamOrNitrogen: '1.8 m³/km (氮气)',
    gasStr: '1.8 m³/km',
    waterStr: '0.4 t/km',
    modelCount: 380,
    outputShare: '16.5%',
    diffYoy: '-4.2%',
    trend12Months: [
      { period: '25-09', tce: 0.103, elec: 772 },
      { period: '25-10', tce: 0.102, elec: 765 },
      { period: '25-11', tce: 0.101, elec: 758 },
      { period: '25-12', tce: 0.100, elec: 750 },
      { period: '26-01', tce: 0.099, elec: 742 },
      { period: '26-02', tce: 0.099, elec: 740 },
      { period: '26-03', tce: 0.098, elec: 738 },
      { period: '26-04', tce: 0.098, elec: 736 },
      { period: '26-05', tce: 0.098, elec: 735 },
      { period: '26-06', tce: 0.098, elec: 735 },
      { period: '26-07', tce: 0.098, elec: 735 },
      { period: '26-08', tce: 0.098, elec: 735 },
    ],
  },
  {
    id: 'cat-cb-aluminum',
    name: '稀土高铁铝合金电力电缆 (AC90/ZB-TC90)',
    shortName: '稀土高铁铝合金电缆',
    category: 'cable',
    groupTag: '架空导线与控制线',
    voltageLevel: '35kV级及以下',
    desc: '以铝节铜新型节能环保电缆，重量轻导电优',
    unitTce: 0.135,
    unitTceStr: '0.135 tce/km',
    unitElec: 1015,
    unitElecStr: '1,015 kWh/km',
    steamOrNitrogen: '2.8 m³/km (氮气)',
    gasStr: '2.2 m³/km',
    waterStr: '0.5 t/km',
    modelCount: 90,
    outputShare: '6.8%',
    diffYoy: '-5.5%',
    trend12Months: [
      { period: '25-09', tce: 0.143, elec: 1075 },
      { period: '25-10', tce: 0.141, elec: 1060 },
      { period: '25-11', tce: 0.139, elec: 1045 },
      { period: '25-12', tce: 0.138, elec: 1038 },
      { period: '26-01', tce: 0.137, elec: 1030 },
      { period: '26-02', tce: 0.136, elec: 1022 },
      { period: '26-03', tce: 0.136, elec: 1020 },
      { period: '26-04', tce: 0.135, elec: 1018 },
      { period: '26-05', tce: 0.135, elec: 1016 },
      { period: '26-06', tce: 0.135, elec: 1015 },
      { period: '26-07', tce: 0.135, elec: 1015 },
      { period: '26-08', tce: 0.135, elec: 1015 },
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
  // 1. 特高压 1000kV
  {
    id: 'm-tr-1000-01',
    modelCode: 'TR-1000-ODFPS-1000',
    modelName: 'ODFPS-1000MVA/1000kV 特高压单相自耦变压器',
    category: 'transformer',
    categoryId: 'cat-tr-1000',
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
    id: 'm-tr-1000-02',
    modelCode: 'TR-1000-ODFPS-500',
    modelName: 'ODFPS-500MVA/1000kV 特高压示范工程自耦变',
    category: 'transformer',
    categoryId: 'cat-tr-1000',
    voltageLevel: '500kV级',
    companyId: 'ws_hb_main',
    companyName: '衡变本部',
    productionVolume: '1,500 MVA (3台)',
    unitTce: '17.10 tce/万kVA',
    unitElecKWh: '0.314 kWh/kVA',
    unitSteamTon: '4.35 t/万kVA',
    unitGasM3: '58.0 m³/万kVA',
    unitWaterTon: '23.0 t/万kVA',
    diffYoy: '-6.2%',
    quotaStatus: '达标受控',
  },

  // 2. 750kV 超高压
  {
    id: 'm-tr-750-01',
    modelCode: 'TR-750-ODFS-500',
    modelName: 'ODFS-500MVA/750kV 单相自耦无励磁调压变压器',
    category: 'transformer',
    categoryId: 'cat-tr-750',
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

  // 3. 500kV ODFS
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
    id: 'm-tr-03',
    modelCode: 'TR-500-ODFS-250',
    modelName: 'ODFS-250MVA/500kV 单相自耦变压器',
    category: 'transformer',
    categoryId: 'cat-tr-500',
    voltageLevel: '500kV级',
    companyId: 'ws_hb_tnj',
    companyName: '特能建',
    productionVolume: '1,000 MVA (4台)',
    unitTce: '14.35 tce/万kVA',
    unitElecKWh: '0.319 kWh/kVA',
    unitSteamTon: '3.45 t/万kVA',
    unitGasM3: '48.5 m³/万kVA',
    unitWaterTon: '19.5 t/万kVA',
    diffYoy: '-5.8%',
    quotaStatus: '达标受控',
  },

  // 4. 500kV SSP 主变
  {
    id: 'm-tr-02',
    modelCode: 'TR-500-SSP-840',
    modelName: 'SSP-840MVA/500kV 三相发电机主变压器',
    category: 'transformer',
    categoryId: 'cat-tr-500-ssp',
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

  // 5. 500kV OSFPS 有载调压
  {
    id: 'm-tr-500-osfps-01',
    modelCode: 'TR-500-OSFPS-750',
    modelName: 'OSFPS-750MVA/500kV 三相自耦有载调压变压器',
    category: 'transformer',
    categoryId: 'cat-tr-500-osfps',
    voltageLevel: '500kV级',
    companyId: 'ws_sb_main',
    companyName: '沈变本部',
    productionVolume: '1,500 MVA (2台)',
    unitTce: '14.50 tce/万kVA',
    unitElecKWh: '0.320 kWh/kVA',
    unitSteamTon: '3.50 t/万kVA',
    unitGasM3: '49.0 m³/万kVA',
    unitWaterTon: '19.8 t/万kVA',
    diffYoy: '-5.5%',
    quotaStatus: '良好',
  },

  // 6. 330kV SFZ
  {
    id: 'm-tr-330-01',
    modelCode: 'TR-330-SFZ-360',
    modelName: 'SFZ-360MVA/330kV 三相三绕组电力变压器',
    category: 'transformer',
    categoryId: 'cat-tr-330',
    voltageLevel: '220kV级',
    companyId: 'ws_xb_uhv',
    companyName: '超高压公司',
    productionVolume: '720 MVA (2台)',
    unitTce: '9.80 tce/万kVA',
    unitElecKWh: '0.322 kWh/kVA',
    unitSteamTon: '2.30 t/万kVA',
    unitGasM3: '32.5 m³/万kVA',
    unitWaterTon: '13.8 t/万kVA',
    diffYoy: '-5.4%',
    quotaStatus: '先进标杆',
  },

  // 7. 220kV SFZ11/13
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
    unitTce: '7.02 tce/万kVA',
    unitElecKWh: '0.325 kWh/kVA',
    unitSteamTon: '1.70 t/万kVA',
    unitGasM3: '24.0 m³/万kVA',
    unitWaterTon: '10.5 t/万kVA',
    diffYoy: '-5.3%',
    quotaStatus: '达标受控',
  },

  // 8. 220kV SFP
  {
    id: 'm-tr-06',
    modelCode: 'TR-220-SFP-180',
    modelName: 'SFP-180MVA/220kV 双绕组无励磁发电机变压器',
    category: 'transformer',
    categoryId: 'cat-tr-220-sfp',
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

  // 9. 110kV SZ11
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
    unitTce: '4.25 tce/万kVA',
    unitElecKWh: '0.327 kWh/kVA',
    unitSteamTon: '1.18 t/万kVA',
    unitGasM3: '15.5 m³/万kVA',
    unitWaterTon: '8.4 t/万kVA',
    diffYoy: '-4.9%',
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
    unitElecKWh: '0.328 kWh/kVA',
    unitSteamTon: '1.20 t/万kVA',
    unitGasM3: '16.0 m³/万kVA',
    unitWaterTon: '8.6 t/万kVA',
    diffYoy: '-5.1%',
    quotaStatus: '先进标杆',
  },

  // 10. 66kV SZ11
  {
    id: 'm-tr-66-01',
    modelCode: 'TR-66-SZ11-31500',
    modelName: 'SZ11-31500kVA/66kV 油浸式电力变压器',
    category: 'transformer',
    categoryId: 'cat-tr-66',
    voltageLevel: '110kV级',
    companyId: 'ws_sb_main',
    companyName: '沈变本部',
    productionVolume: '189 MVA (6台)',
    unitTce: '2.65 tce/万kVA',
    unitElecKWh: '0.328 kWh/kVA',
    unitSteamTon: '0.75 t/万kVA',
    unitGasM3: '10.2 m³/万kVA',
    unitWaterTon: '5.2 t/万kVA',
    diffYoy: '-4.5%',
    quotaStatus: '达标受控',
  },

  // 11. 35kV SCB13
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

  // 12. 35kV 节能油变
  {
    id: 'm-tr-35-oil-01',
    modelCode: 'TR-35-S13-1600',
    modelName: 'S13-1600kVA/35kV 节能油浸式配电变压器',
    category: 'transformer',
    categoryId: 'cat-tr-35-oil',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xb_zndq',
    companyName: '智能电气公司',
    productionVolume: '32 MVA (20台)',
    unitTce: '0.92 tce/万kVA',
    unitElecKWh: '0.322 kWh/kVA',
    unitSteamTon: '0.25 t/万kVA',
    unitGasM3: '8.2 m³/万kVA',
    unitWaterTon: '2.8 t/万kVA',
    diffYoy: '-5.8%',
    quotaStatus: '达标受控',
  },

  // 13. 10kV SCB14
  {
    id: 'm-tr-11',
    modelCode: 'TR-10-SCB14-2000',
    modelName: 'SCB14-2000kVA/10kV 新一代节能干式配电变压器',
    category: 'transformer',
    categoryId: 'cat-tr-10-scb',
    voltageLevel: '35kV级及以下',
    desc: '一级能效国标干变',
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

  // 14. 10kV 非晶干变
  {
    id: 'm-tr-10-am-01',
    modelCode: 'TR-10-SCBH15-1250',
    modelName: 'SCBH15-1250kVA/10kV 非晶合金立体卷铁芯干变',
    category: 'transformer',
    categoryId: 'cat-tr-10-amorphous',
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

  // 15. 10kV 非晶油变
  {
    id: 'm-tr-10-oil-am-01',
    modelCode: 'TR-10-SBH15-630',
    modelName: 'SBH15-630kVA/10kV 油浸式非晶合金配电变压器',
    category: 'transformer',
    categoryId: 'cat-tr-10-oil-amorphous',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_hb_hn',
    companyName: '湖南电气',
    productionVolume: '18.9 MVA (30台)',
    unitTce: '0.58 tce/万kVA',
    unitElecKWh: '0.312 kWh/kVA',
    unitSteamTon: '0.16 t/万kVA',
    unitGasM3: '5.5 m³/万kVA',
    unitWaterTon: '1.8 t/万kVA',
    diffYoy: '-6.2%',
    quotaStatus: '先进标杆',
  },

  // 16. 光伏风电升压箱变
  {
    id: 'm-tr-pv-01',
    modelCode: 'TR-PV-ZGS-3150',
    modelName: 'ZGS-3150kVA/35kV 光伏/风电专用华式升压箱变',
    category: 'transformer',
    categoryId: 'cat-tr-pv',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xb_zndq',
    companyName: '智能电气公司',
    productionVolume: '63 MVA (20台)',
    unitTce: '0.95 tce/万kVA',
    unitElecKWh: '0.325 kWh/kVA',
    unitSteamTon: '0.26 t/万kVA',
    unitGasM3: '8.6 m³/万kVA',
    unitWaterTon: '2.9 t/万kVA',
    diffYoy: '-5.6%',
    quotaStatus: '先进标杆',
  },

  // 17. 储能升压一体变
  {
    id: 'm-tr-ess-01',
    modelCode: 'TR-ESS-YB-3450',
    modelName: 'YB-3450kVA/35kV 储能变流升压一体舱专用变压器',
    category: 'transformer',
    categoryId: 'cat-tr-ess',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_hb_tnj',
    companyName: '特能建',
    productionVolume: '51.75 MVA (15台)',
    unitTce: '1.05 tce/万kVA',
    unitElecKWh: '0.328 kWh/kVA',
    unitSteamTon: '0.30 t/万kVA',
    unitGasM3: '9.2 m³/万kVA',
    unitWaterTon: '3.1 t/万kVA',
    diffYoy: '-6.0%',
    quotaStatus: '达标受控',
  },

  // 18. 整流变
  {
    id: 'm-tr-rec-01',
    modelCode: 'TR-REC-ZHSFT-63000',
    modelName: 'ZHSFT-63000kVA/110kV 绿氢/电解铝大功率整流变压器',
    category: 'transformer',
    categoryId: 'cat-tr-rectifier',
    voltageLevel: '110kV级',
    companyId: 'ws_sb_main',
    companyName: '沈变本部',
    productionVolume: '189 MVA (3台)',
    unitTce: '3.40 tce/万kVA',
    unitElecKWh: '0.335 kWh/kVA',
    unitSteamTon: '0.95 t/万kVA',
    unitGasM3: '12.5 m³/万kVA',
    unitWaterTon: '5.8 t/万kVA',
    diffYoy: '-4.2%',
    quotaStatus: '达标受控',
  },

  // 19. 铁道牵引变
  {
    id: 'm-tr-trac-01',
    modelCode: 'TR-TRA-QSFP-50000',
    modelName: 'QSFP-50000kVA/220kV 高铁专用单相自耦牵引变压器',
    category: 'transformer',
    categoryId: 'cat-tr-traction',
    voltageLevel: '220kV级',
    companyId: 'ws_hb_main',
    companyName: '衡变本部',
    productionVolume: '200 MVA (4台)',
    unitTce: '5.60 tce/万kVA',
    unitElecKWh: '0.330 kWh/kVA',
    unitSteamTon: '1.45 t/万kVA',
    unitGasM3: '19.8 m³/万kVA',
    unitWaterTon: '8.5 t/万kVA',
    diffYoy: '-4.8%',
    quotaStatus: '良好',
  },

  // 20. 并联电抗器
  {
    id: 'm-tr-reac-01',
    modelCode: 'TR-REA-BKD-80000',
    modelName: 'BKD-80000kvar/500kV 特高压单相并联电抗器',
    category: 'transformer',
    categoryId: 'cat-tr-reactor',
    voltageLevel: '500kV级',
    companyId: 'ws_sb_main',
    companyName: '沈变本部',
    productionVolume: '240 Mvar (3台)',
    unitTce: '8.20 tce/万kVA',
    unitElecKWh: '0.325 kWh/kVA',
    unitSteamTon: '2.10 t/万kVA',
    unitGasM3: '28.0 m³/万kVA',
    unitWaterTon: '11.8 t/万kVA',
    diffYoy: '-5.0%',
    quotaStatus: '达标受控',
  },

  // ---------------------- 线缆类产品型号 (电力、氮气、天然气、水，无蒸汽) ----------------------
  // 1. 500kV 皱纹铝套超高压
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
    unitTce: '0.877 tce/km',
    unitElecKWh: '6,616 kWh/km',
    unitNitrogenM3: '19.7 m³/km',
    unitGasM3: '12.2 m³/km',
    unitWaterTon: '2.6 t/km',
    diffYoy: '-6.8%',
    quotaStatus: '先进标杆',
  },

  // 2. 220kV 皱纹铝套
  {
    id: 'm-cb-02',
    modelCode: 'CB-220-YJLW03-1x1600',
    modelName: '220kV 皱纹铝套交联聚乙烯绝缘电力电缆 (1x1600mm²)',
    category: 'cable',
    categoryId: 'cat-cb-220',
    voltageLevel: '220kV级',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '95 km',
    unitTce: '0.642 tce/km',
    unitElecKWh: '4,850 kWh/km',
    unitNitrogenM3: '14.5 m³/km',
    unitGasM3: '9.0 m³/km',
    unitWaterTon: '2.0 t/km',
    diffYoy: '-5.9%',
    quotaStatus: '先进标杆',
  },

  // 3. 110kV 平滑铝套
  {
    id: 'm-cb-03',
    modelCode: 'CB-110-YJLW03-1x1200',
    modelName: '110kV 平滑铝套交联聚乙烯绝缘电力电缆 (1x1200mm²)',
    category: 'cable',
    categoryId: 'cat-cb-110',
    voltageLevel: '110kV级',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '180 km',
    unitTce: '0.482 tce/km',
    unitElecKWh: '3,640 kWh/km',
    unitNitrogenM3: '11.0 m³/km',
    unitGasM3: '7.2 m³/km',
    unitWaterTon: '1.6 t/km',
    diffYoy: '-6.1%',
    quotaStatus: '先进标杆',
  },
  {
    id: 'm-cb-04',
    modelCode: 'CB-110-YJLW03-1x800-XL',
    modelName: '110kV 铝套电力电缆 (YJLW03 1x800mm²)',
    category: 'cable',
    categoryId: 'cat-cb-110',
    voltageLevel: '110kV级',
    companyId: 'ws_xl_main',
    companyName: '特变电工新疆电缆有限公司',
    productionVolume: '140 km',
    unitTce: '0.485 tce/km',
    unitElecKWh: '3,660 kWh/km',
    unitNitrogenM3: '11.2 m³/km',
    unitGasM3: '7.4 m³/km',
    unitWaterTon: '1.7 t/km',
    diffYoy: '-4.8%',
    quotaStatus: '达标受控',
  },

  // 4. 66kV 中高压
  {
    id: 'm-cb-66-01',
    modelCode: 'CB-66-YJV-1x500',
    modelName: '66kV 级中高压交联聚乙烯绝缘电缆 (1x500mm²)',
    category: 'cable',
    categoryId: 'cat-cb-66',
    voltageLevel: '110kV级',
    companyId: 'ws_dl_main',
    companyName: '特变电工（德阳）电缆股份有限公司',
    productionVolume: '75 km',
    unitTce: '0.365 tce/km',
    unitElecKWh: '2,750 kWh/km',
    unitNitrogenM3: '8.8 m³/km',
    unitGasM3: '5.8 m³/km',
    unitWaterTon: '1.2 t/km',
    diffYoy: '-4.8%',
    quotaStatus: '达标受控',
  },

  // 5. 海底光电复合缆
  {
    id: 'm-cb-sub-01',
    modelCode: 'CB-SUB-HYJQF41-220',
    modelName: '220kV 海底光电复合交联电缆 (HYJQF41 3x500mm²)',
    category: 'cable',
    categoryId: 'cat-cb-subsea',
    voltageLevel: '500kV级',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '28 km',
    unitTce: '0.960 tce/km',
    unitElecKWh: '7,250 kWh/km',
    unitNitrogenM3: '22.0 m³/km',
    unitGasM3: '14.5 m³/km',
    unitWaterTon: '3.2 t/km',
    diffYoy: '-5.2%',
    quotaStatus: '先进标杆',
  },

  // 6. 35kV 钢带铠装
  {
    id: 'm-cb-06',
    modelCode: 'CB-35-YJV22-3x300',
    modelName: '35kV 钢带铠装交联聚乙烯绝缘电力电缆 (YJV22 3x300mm²)',
    category: 'cable',
    categoryId: 'cat-cb-35-yjv22',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '260 km',
    unitTce: '0.238 tce/km',
    unitElecKWh: '1,785 kWh/km',
    unitNitrogenM3: '6.6 m³/km',
    unitGasM3: '4.3 m³/km',
    unitWaterTon: '0.9 t/km',
    diffYoy: '-5.3%',
    quotaStatus: '先进标杆',
  },

  // 7. 35kV 细钢丝铠装
  {
    id: 'm-cb-35-32-01',
    modelCode: 'CB-35-YJV32-3x240',
    modelName: '35kV 细钢丝铠装中压交联电缆 (YJV32 3x240mm²)',
    category: 'cable',
    categoryId: 'cat-cb-35-yjv32',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xl_sub',
    companyName: '特变电工新疆线缆厂',
    productionVolume: '90 km',
    unitTce: '0.265 tce/km',
    unitElecKWh: '1,990 kWh/km',
    unitNitrogenM3: '7.2 m³/km',
    unitGasM3: '4.8 m³/km',
    unitWaterTon: '1.0 t/km',
    diffYoy: '-5.0%',
    quotaStatus: '良好',
  },

  // 8. 10kV 三芯铠装
  {
    id: 'm-cb-10-22-01',
    modelCode: 'CB-10-YJV22-3x240',
    modelName: '10kV 三芯铠装交联电力电缆 (YJV22 3x240mm²)',
    category: 'cable',
    categoryId: 'cat-cb-10-yjv22',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_main',
    companyName: '鲁缆本部',
    productionVolume: '320 km',
    unitTce: '0.195 tce/km',
    unitElecKWh: '1,465 kWh/km',
    unitNitrogenM3: '5.2 m³/km',
    unitGasM3: '3.6 m³/km',
    unitWaterTon: '0.8 t/km',
    diffYoy: '-5.5%',
    quotaStatus: '先进标杆',
  },

  // 9. 10kV 单芯交联
  {
    id: 'm-cb-10-yjv-01',
    modelCode: 'CB-10-YJV-1x400',
    modelName: '10kV 单芯交联聚乙烯电力电缆 (YJV 1x400mm²)',
    category: 'cable',
    categoryId: 'cat-cb-10-yjv',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xl_main',
    companyName: '特变电工新疆电缆有限公司',
    productionVolume: '210 km',
    unitTce: '0.165 tce/km',
    unitElecKWh: '1,240 kWh/km',
    unitNitrogenM3: '4.5 m³/km',
    unitGasM3: '3.1 m³/km',
    unitWaterTon: '0.7 t/km',
    diffYoy: '-4.9%',
    quotaStatus: '达标受控',
  },

  // 10. 0.6/1kV 低烟无卤
  {
    id: 'm-cb-09',
    modelCode: 'CB-LV-WDZ-YJY-4x240',
    modelName: '0.6/1kV 低烟无卤阻燃电力电缆 (WDZ-YJY 4x240mm²)',
    category: 'cable',
    categoryId: 'cat-cb-lv-wdz',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_sg',
    companyName: '曙光公司',
    productionVolume: '380 km',
    unitTce: '0.168 tce/km',
    unitElecKWh: '1,260 kWh/km',
    unitNitrogenM3: '3.8 m³/km',
    unitGasM3: '3.0 m³/km',
    unitWaterTon: '0.6 t/km',
    diffYoy: '-4.7%',
    quotaStatus: '达标受控',
  },

  // 11. 0.6/1kV VV22
  {
    id: 'm-cb-vv-01',
    modelCode: 'CB-LV-VV22-4x185',
    modelName: '0.6/1kV 聚氯乙烯绝缘铠装电缆 (VV22 4x185mm²)',
    category: 'cable',
    categoryId: 'cat-cb-lv-vv',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_dl_main',
    companyName: '特变电工（德阳）电缆股份有限公司',
    productionVolume: '310 km',
    unitTce: '0.145 tce/km',
    unitElecKWh: '1,090 kWh/km',
    unitNitrogenM3: '3.2 m³/km',
    unitGasM3: '2.6 m³/km',
    unitWaterTon: '0.5 t/km',
    diffYoy: '-4.5%',
    quotaStatus: '良好',
  },

  // 12. 矿物绝缘防火缆
  {
    id: 'm-cb-fire-01',
    modelCode: 'CB-FIRE-BTTZ-4x25',
    modelName: '0.6/1kV 矿物绝缘柔性防火电缆 (BTTZ 4x25mm²)',
    category: 'cable',
    categoryId: 'cat-cb-fire',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_sg',
    companyName: '曙光公司',
    productionVolume: '140 km',
    unitTce: '0.220 tce/km',
    unitElecKWh: '1,650 kWh/km',
    unitNitrogenM3: '5.6 m³/km',
    unitGasM3: '4.0 m³/km',
    unitWaterTon: '0.9 t/km',
    diffYoy: '-5.8%',
    quotaStatus: '先进标杆',
  },

  // 13. 光伏专用直流耐候缆
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
    unitElecKWh: '1,165 kWh/km',
    unitNitrogenM3: '4.2 m³/km',
    unitGasM3: '3.2 m³/km',
    unitWaterTon: '0.7 t/km',
    diffYoy: '-5.8%',
    quotaStatus: '先进标杆',
  },

  // 14. 风电耐扭曲软缆
  {
    id: 'm-cb-wind-01',
    modelCode: 'CB-WIND-FDEH-3x120',
    modelName: '风力发电专用耐扭曲低温橡套软电缆 (FDEH 3x120+1x35mm²)',
    category: 'cable',
    categoryId: 'cat-cb-wind',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_xl_main',
    companyName: '特变电工新疆电缆有限公司',
    productionVolume: '85 km',
    unitTce: '0.180 tce/km',
    unitElecKWh: '1,350 kWh/km',
    unitNitrogenM3: '4.8 m³/km',
    unitGasM3: '3.6 m³/km',
    unitWaterTon: '0.8 t/km',
    diffYoy: '-6.2%',
    quotaStatus: '先进标杆',
  },

  // 15. 储能高压软缆
  {
    id: 'm-cb-ess-01',
    modelCode: 'CB-ESS-ES-1x150',
    modelName: '储能电池系统专用直流高压软电缆 (ES-DC 1x150mm²)',
    category: 'cable',
    categoryId: 'cat-cb-ess',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_sg',
    companyName: '曙光公司',
    productionVolume: '95 km',
    unitTce: '0.140 tce/km',
    unitElecKWh: '1,050 kWh/km',
    unitNitrogenM3: '3.6 m³/km',
    unitGasM3: '2.8 m³/km',
    unitWaterTon: '0.6 t/km',
    diffYoy: '-5.4%',
    quotaStatus: '先进标杆',
  },

  // 16. 充电桩柔性电缆
  {
    id: 'm-cb-ev-01',
    modelCode: 'CB-EV-EVDC-2x70',
    modelName: '电动汽车大功率液冷超充专用柔性电缆 (EVDC 2x70+2x25mm²)',
    category: 'cable',
    categoryId: 'cat-cb-ev',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_dl_main',
    companyName: '特变电工（德阳）电缆股份有限公司',
    productionVolume: '120 km',
    unitTce: '0.125 tce/km',
    unitElecKWh: '940 kWh/km',
    unitNitrogenM3: '3.0 m³/km',
    unitGasM3: '2.4 m³/km',
    unitWaterTon: '0.5 t/km',
    diffYoy: '-4.6%',
    quotaStatus: '达标受控',
  },

  // 17. JKLYJ 架空绝缘导线
  {
    id: 'm-cb-jklyj-01',
    modelCode: 'CB-OVH-JKLYJ-1x120',
    modelName: 'JKLYJ 10kV 架空绝缘导线 (1x120mm²)',
    category: 'cable',
    categoryId: 'cat-cb-overhead-jklyj',
    voltageLevel: 'all',
    companyId: 'ws_xl_sub',
    companyName: '特变电工新疆线缆厂',
    productionVolume: '260 km',
    unitTce: '0.086 tce/km',
    unitElecKWh: '645 kWh/km',
    unitNitrogenM3: '1.2 m³/km',
    unitGasM3: '1.5 m³/km',
    unitWaterTon: '0.3 t/km',
    diffYoy: '-5.0%',
    quotaStatus: '达标受控',
  },

  // 18. LGJ 钢芯铝绞线
  {
    id: 'm-cb-lgj-01',
    modelCode: 'CB-OVH-LGJ-400/35',
    modelName: 'LGJ 钢芯铝绞线 (LGJ-400/35 特高压输电线路导线)',
    category: 'cable',
    categoryId: 'cat-cb-overhead-lgj',
    voltageLevel: 'all',
    companyId: 'ws_xl_main',
    companyName: '特变电工新疆电缆有限公司',
    productionVolume: '580 km',
    unitTce: '0.065 tce/km',
    unitElecKWh: '490 kWh/km',
    unitNitrogenM3: '0.8 m³/km',
    unitGasM3: '1.1 m³/km',
    unitWaterTon: '0.2 t/km',
    diffYoy: '-4.8%',
    quotaStatus: '先进标杆',
  },

  // 19. 屏蔽控制电缆
  {
    id: 'm-cb-kvv-01',
    modelCode: 'CB-CTR-KVVP-4x2.5',
    modelName: '屏蔽控制电缆及计算机信号电缆 (KVVP 4x2.5mm²)',
    category: 'cable',
    categoryId: 'cat-cb-control-kvv',
    voltageLevel: 'all',
    companyId: 'ws_dl_main',
    companyName: '特变电工（德阳）电缆股份有限公司',
    productionVolume: '380 km',
    unitTce: '0.098 tce/km',
    unitElecKWh: '735 kWh/km',
    unitNitrogenM3: '1.8 m³/km',
    unitGasM3: '1.8 m³/km',
    unitWaterTon: '0.4 t/km',
    diffYoy: '-4.2%',
    quotaStatus: '达标受控',
  },

  // 20. 稀土高铁铝合金电缆
  {
    id: 'm-cb-ac90-01',
    modelCode: 'CB-AL-AC90-3x120',
    modelName: '稀土高铁铝合金电力电缆 (AC90 3x120+1x70mm²)',
    category: 'cable',
    categoryId: 'cat-cb-aluminum',
    voltageLevel: '35kV级及以下',
    companyId: 'ws_ll_sg',
    companyName: '曙光公司',
    productionVolume: '90 km',
    unitTce: '0.135 tce/km',
    unitElecKWh: '1,015 kWh/km',
    unitNitrogenM3: '2.8 m³/km',
    unitGasM3: '2.2 m³/km',
    unitWaterTon: '0.5 t/km',
    diffYoy: '-5.5%',
    quotaStatus: '先进标杆',
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
  // 🌟 1.2 中间【分类】二级分组过滤 ('all' | groupTag)
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>('all')
  // 🌟 1.3 中间【分类】搜索关键字
  const [categorySearchKw, setCategorySearchKw] = useState<string>('')
  // 🌟 1.4 中间【分类】排序方式 ('tce_desc' | 'models_desc' | 'yoy_desc')
  const [categorySortBy, setCategorySortBy] = useState<'tce_desc' | 'models_desc' | 'yoy_desc'>('tce_desc')

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

  // 🌟 当前大类下的数十种细分产品分类全景库
  const currentCategories = useMemo(() => {
    return category === 'transformer' ? TRANSFORMER_CATEGORIES : CABLE_CATEGORIES
  }, [category])

  // 🌟 提取当前产业大类下的所有二级分组标签 (如 特高压/超高压、中高压电力变、干式与配电变、新能源与特种变)
  const categoryGroups = useMemo(() => {
    const groups = Array.from(new Set(currentCategories.map((c) => c.groupTag)))
    return ['all', ...groups]
  }, [currentCategories])

  // 🌟 过滤与排序数十种产品种类
  const displayedCategories = useMemo(() => {
    return currentCategories
      .filter((cat) => {
        if (selectedCategoryGroup !== 'all' && cat.groupTag !== selectedCategoryGroup) {
          return false
        }
        if (categorySearchKw.trim()) {
          const kw = categorySearchKw.trim().toLowerCase()
          return cat.name.toLowerCase().includes(kw) || cat.shortName.toLowerCase().includes(kw) || cat.groupTag.toLowerCase().includes(kw)
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

  // 🌟 当前选中的产品分类对象 (若为 'all' 则为 null)
  const activeSelectedCategory = useMemo(() => {
    if (selectedCategoryId === 'all') return null
    return currentCategories.find((c) => c.id === selectedCategoryId) || null
  }, [currentCategories, selectedCategoryId])

  // 当前激活选中的品类，如果 selectedCategoryId === 'all'，默认展示列表第一项作为趋势参考
  const activeCategoryDetail = useMemo(() => {
    if (selectedCategoryId !== 'all') {
      return currentCategories.find((c) => c.id === selectedCategoryId) || currentCategories[0]
    }
    return displayedCategories[0] || currentCategories[0]
  }, [currentCategories, selectedCategoryId, displayedCategories])

  // 计算最大综合单耗，用于左侧条形进度百分比
  const maxCategoryTce = useMemo(() => {
    return Math.max(...currentCategories.map((c) => c.unitTce), 1)
  }, [currentCategories])

  // 当大类切换时，自动重置选中的细分类别为全部
  useEffect(() => {
    setSelectedCategoryId('all')
    setSelectedCategoryGroup('all')
    setCategorySearchKw('')
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
        {/* 🌟 4. 中间分类层级：数十种产品种类能效对标与时序演进中心 (支持 20~50+ 种品类) */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          {/* ① 顶部功能栏：品类总览、二级分组 Tabs、品类搜索与排序 */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Boxes className="size-4 text-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-900">
                {category === 'transformer' ? '【变压器】产品种类能耗对标与时序演进' : '【线缆】产品种类能耗对标与时序演进'}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] font-mono font-bold border border-blue-100">
                共在产 {currentCategories.length} 种细分种类 · 覆盖 2,840 款型号
              </span>
            </div>

            {/* 右侧：品类检索框与排序选择 */}
            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <input
                  type="text"
                  value={categorySearchKw}
                  onChange={(e) => setCategorySearchKw(e.target.value)}
                  placeholder="按产品种类名称快速过滤..."
                  className="pl-7 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#1677ff] focus:bg-white w-48 transition-colors"
                />
                <Search className="size-3.5 text-slate-400 absolute left-2 top-1.5 pointer-events-none" />
                {categorySearchKw && (
                  <button
                    type="button"
                    onClick={() => setCategorySearchKw('')}
                    className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <select
                value={categorySortBy}
                onChange={(e) => setCategorySortBy(e.target.value as any)}
                aria-label="产品种类排序方式"
                className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:border-[#1677ff] cursor-pointer"
              >
                <option value="tce_desc">按综合单耗降序</option>
                <option value="models_desc">按在产型号数量</option>
                <option value="yoy_desc">按节能降耗幅度</option>
              </select>
            </div>
          </div>

          {/* ② 品类二级分组 Tabs 药丸 (特高压/超高压、中高压电力变、干式与配电变、新能源与特种变) */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-sans text-[11px]">品类分组:</span>
              {categoryGroups.map((grp) => {
                const isGrpSelected = selectedCategoryGroup === grp
                const count = grp === 'all'
                  ? currentCategories.length
                  : currentCategories.filter((c) => c.groupTag === grp).length
                return (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setSelectedCategoryGroup(grp)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium select-none text-xs border flex items-center gap-1',
                      isGrpSelected
                        ? 'bg-[#1677ff] text-white font-bold border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                    )}
                  >
                    <span>{grp === 'all' ? '全部分组' : grp}</span>
                    <span className={cn('text-[10px] px-1 rounded', isGrpSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600')}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {selectedCategoryId !== 'all' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryId('all')
                  setCurrentPage(1)
                }}
                className="text-xs text-[#1677ff] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>清除单选 (显示全部品类型号)</span>
              </button>
            )}
          </div>

          {/* ③ 双栏布局：左侧数十种产品种类滚动对标列表 (55%) + 右侧选定品类深度透视看板 (45%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pt-1">
            {/* 左侧：数十种产品品类横向对标滚动列表 (7列宽) */}
            <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50/40 p-3 flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs font-sans text-slate-600 pb-1.5 border-b border-slate-200/80 px-1 font-bold">
                <span className="flex items-center gap-1">
                  <span>产品种类名称 & 分组</span>
                  <span className="text-[10.5px] font-normal text-slate-400 font-mono">(点击可单选联动)</span>
                </span>
                <div className="flex items-center gap-6 font-mono text-[11px]">
                  <span>下辖型号</span>
                  <span>综合单耗 / 进度</span>
                  <span className="w-14 text-right">同比</span>
                </div>
              </div>

              {/* 滚动容器：容纳几十种产品种类 */}
              <div className="max-h-[310px] overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                {displayedCategories.map((cat, idx) => {
                  const isSelected = selectedCategoryId === cat.id
                  const ratio = Math.min(100, Math.max(10, (cat.unitTce / maxCategoryTce) * 100))

                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryId(selectedCategoryId === cat.id ? 'all' : cat.id)
                        setCurrentPage(1)
                      }}
                      className={cn(
                        'p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs gap-2 select-none',
                        isSelected
                          ? 'bg-blue-50/90 border-[#1677ff] ring-1 ring-[#1677ff] shadow-xs'
                          : 'bg-white border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300'
                      )}
                    >
                      {/* 左侧：序号 + 种类名称 + 分组标签 */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={cn('text-[11px] font-mono font-bold w-5 text-center', isSelected ? 'text-[#1677ff]' : 'text-slate-400')}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={cn('font-bold text-xs truncate', isSelected ? 'text-[#1677ff]' : 'text-slate-900')}>
                              {cat.name}
                            </span>
                            {isSelected && <CheckCircle2 className="size-3.5 text-[#1677ff] shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 text-[10.5px] text-slate-400 font-sans">
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px]">
                              {cat.groupTag}
                            </span>
                            <span className="font-mono text-slate-500">
                              ⚡ 电单耗: {cat.unitElecStr}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 右侧：型号数 + 单耗进度柱 + 数值 + 同比 */}
                      <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                        <span className="text-[11px] text-slate-500 w-12 text-right">
                          {cat.modelCount} 款
                        </span>

                        <div className="w-24 flex flex-col items-end gap-0.5">
                          <strong className={cn('text-xs font-bold', isSelected ? 'text-[#1677ff]' : 'text-slate-800')}>
                            {cat.unitTceStr}
                          </strong>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all', isSelected ? 'bg-[#1677ff]' : 'bg-blue-400')}
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                        </div>

                        <span className="text-emerald-600 font-bold text-[11px] w-14 text-right">
                          {cat.diffYoy} ↓
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 右侧：选定产品种类的深度透视看板 (5列宽) */}
            <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-3.5 flex flex-col space-y-3 shadow-2xs">
              {/* 头部：当前品类概要 */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="min-w-0">
                  <span className="text-[10.5px] text-slate-400 block font-sans">当前透视种类画像</span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {activeCategoryDetail.name}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] font-mono text-[11px] font-bold border border-blue-100">
                  {activeCategoryDetail.groupTag}
                </span>
              </div>

              {/* 4 个指标快报小卡 */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-sans block">综合单耗</span>
                  <strong className="text-[#1677ff] text-sm block">{activeCategoryDetail.unitTceStr}</strong>
                  <span className="text-[10px] text-emerald-600 font-bold block font-sans">同比 {activeCategoryDetail.diffYoy} ↓</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-sans block">单位电耗</span>
                  <strong className="text-blue-700 text-sm block">{activeCategoryDetail.unitElecStr}</strong>
                  <span className="text-[10px] text-slate-500 font-sans block">在产型号: {activeCategoryDetail.modelCount} 款</span>
                </div>
              </div>

              {/* 12 个月单耗改善走势面积折线图 */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-sans text-slate-500">
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <TrendingUp className="size-3 text-emerald-600" />
                    近12个月单耗演进趋势
                  </span>
                  <span className="font-mono text-slate-400">
                    {category === 'transformer' ? '单位: tce/万kVA' : '单位: tce/km'}
                  </span>
                </div>

                <div className="h-[145px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={activeCategoryDetail.trend12Months}
                      margin={{ top: 8, right: 10, left: -15, bottom: 0 }}
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
                        tick={{ fontSize: 9.5, fill: '#64748b' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 9.5, fill: '#64748b' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        formatter={(val: any) => [`${val} ${category === 'transformer' ? 'tce/万kVA' : 'tce/km'}`, '综合单耗']}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="tce"
                        stroke="#1677ff"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCategoryTce)"
                        dot={{ r: 2.5, fill: '#1677ff' }}
                        activeDot={{ r: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* 底部各介质拆解胶囊 */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-sans text-slate-500 flex-wrap gap-1">
                  <span>💨 {activeCategoryDetail.steamOrNitrogen}</span>
                  <span>🔥 天然气: {activeCategoryDetail.gasStr}</span>
                  <span>💧 工艺水: {activeCategoryDetail.waterStr}</span>
                </div>
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
                {activeSelectedCategory
                  ? `【${activeSelectedCategory.name}】产品型号单耗明细台账`
                  : currentTableMode === 'transformer'
                  ? '【变压器产品全谱系】型号单耗明细台账 (电耗 · 蒸汽耗 · 气水耗)'
                  : currentTableMode === 'cable'
                  ? '【线缆产品全谱系】型号单耗明细台账 (电耗 · 氮气耗 · 气水耗)'
                  : '全集团产品型号单耗明细台账'}
              </h3>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              在产型号总库共 <strong className="text-slate-900">2,840</strong> 种 · 当前筛选展示 <strong className="text-[#1677ff]">{filteredModels.length}</strong> 条型号
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

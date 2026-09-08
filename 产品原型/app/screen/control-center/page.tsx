'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Flame,
  Sun,
  BatteryCharging,
  Award,
  CloudSun,
  Building2,
  Zap,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Line,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceArea,
} from 'recharts'
import { cn } from '@/lib/utils'

// =========================================================================
// 1. 静态数据字典与业务模型定义
// =========================================================================

// 1.1 6家经营单位综合能耗消费量比重 (万tce)
interface UnitEnergyData {
  name: string
  tce: number
  percentage: number
  color: string
}

const OPERATING_UNITS_ENERGY: UnitEnergyData[] = [
  { name: '沈变公司', tce: 3.42, percentage: 26.7, color: '#00f0ff' },
  { name: '衡变公司', tce: 3.15, percentage: 24.6, color: '#0091ff' },
  { name: '新变厂', tce: 2.85, percentage: 22.3, color: '#10b981' },
  { name: '鲁缆公司', tce: 1.68, percentage: 13.1, color: '#f59e0b' },
  { name: '新缆厂', tce: 0.98, percentage: 7.7, color: '#a855f7' },
  { name: '德缆公司', tce: 0.72, percentage: 5.6, color: '#06b6d4' },
]

// 1.2 集团不同能源类型用能总量对比 (统一换算为 tce 吨标准煤)
interface EnergyTypeData {
  type: string
  rawVal: string
  tce: number
  ratio: number
  color: string
}

const GROUP_ENERGY_TYPES: EnergyTypeData[] = [
  { type: '工业电力', rawVal: '58,420万kWh', tce: 7.18, ratio: 56.1, color: '#00f0ff' },
  { type: '天然气', rawVal: '2,338万m³', tce: 2.84, ratio: 22.2, color: '#10b981' },
  { type: '蒸汽消耗量', rawVal: '19.72万t', tce: 1.86, ratio: 14.5, color: '#38bdf8' },
  { type: '原煤/燃油', rawVal: '426t', tce: 0.62, ratio: 4.8, color: '#f59e0b' },
  { type: '工业自来水', rawVal: '350万t', tce: 0.30, ratio: 2.4, color: '#a855f7' },
]

// 1.3 集团市电与绿电对比
interface GridPowerData {
  name: string
  value: number
  ratio: number
  color: string
}

const POWER_SOURCE_DATA: GridPowerData[] = [
  { name: '传统市网电量', value: 33533, ratio: 57.4, color: '#2563eb' },
  { name: '自发光伏消纳', value: 11200, ratio: 19.2, color: '#00f0ff' },
  { name: '市场化绿电直购', value: 8687, ratio: 14.9, color: '#10b981' },
  { name: '绿色电力证书(GEC)', value: 5000, ratio: 8.5, color: '#06b6d4' },
]

// 1.4 15个园区光伏装机容量对比 (MWp)
interface ParkPvData {
  parkId: string
  shortName: string
  fullName: string
  capacityMw: number
  region: string
}

const PARK_PV_CAPACITIES: ParkPvData[] = [
  { parkId: 'sbcp', shortName: '输变电产业园', fullName: '特变电工输变电产业园(昌吉)', capacityMw: 45.0, region: '新疆' },
  { parkId: 'xazb', shortName: '西安智能装备', fullName: '特变电工西安智能装备产业园', capacityMw: 35.6, region: '陕西' },
  { parkId: 'nfsb', shortName: '南方输变电', fullName: '特变电工南方输变电产业园(衡变)', capacityMw: 30.3, region: '湖南' },
  { parkId: 'ecy', shortName: '二次产业园', fullName: '特变电工二次产业园区(南京)', capacityMw: 28.6, region: '江苏' },
  { parkId: 'dbsb', shortName: '东北输变电', fullName: '特变电工东北输变电产业园(沈变)', capacityMw: 26.8, region: '辽宁' },
  { parkId: 'yj5g', shortName: '云集5G科技', fullName: '特变电工云集5G科技产业园', capacityMw: 22.4, region: '湖南' },
  { parkId: 'tb', shortName: '天变产业园', fullName: '特变电工天变低碳产业园', capacityMw: 21.5, region: '天津' },
  { parkId: 'hnny', shortName: '湖南能源建设', fullName: '特变电工湖南能源建设园区', capacityMw: 19.8, region: '湖南' },
  { parkId: 'dy', shortName: '德阳电缆', fullName: '特变电工(德阳)电缆园区', capacityMw: 18.7, region: '四川' },
  { parkId: 'jjj', shortName: '京津冀科技', fullName: '特变电工京津冀智能科技产业园', capacityMw: 18.2, region: '河北' },
  { parkId: 'nanfang', shortName: '大湾区南方', fullName: '特变电工南方输配电产业园', capacityMw: 17.5, region: '广东' },
  { parkId: 'gil', shortName: 'GIL产业园', fullName: '特变电工GIL产业园', capacityMw: 16.5, region: '陕西' },
  { parkId: 'hd', shortName: '华东输变电', fullName: '特变电工华东输变电科技产业园', capacityMw: 16.2, region: '山东' },
  { parkId: 'sg', shortName: '曙光电缆', fullName: '特变电工曙光电缆产业园', capacityMw: 14.8, region: '河北' },
  { parkId: 'xjxl', shortName: '新疆线缆', fullName: '特变电工新疆线缆产业园', capacityMw: 13.5, region: '新疆' },
]

// 2. 零碳项目时序运行数据 (24小时走势)
interface PvBalancePoint {
  time: string
  generation: number // 发电量 kW
  selfUse: number // 自发自用消纳量 kW
  gridFeed: number // 余电上网量 kW
}

const PV_BALANCE_SERIES: PvBalancePoint[] = [
  { time: '00:00', generation: 0, selfUse: 0, gridFeed: 0 },
  { time: '02:00', generation: 0, selfUse: 0, gridFeed: 0 },
  { time: '04:00', generation: 0, selfUse: 0, gridFeed: 0 },
  { time: '06:00', generation: 220, selfUse: 220, gridFeed: 0 },
  { time: '08:00', generation: 1850, selfUse: 1520, gridFeed: 330 },
  { time: '10:00', generation: 5200, selfUse: 3800, gridFeed: 1400 },
  { time: '12:00', generation: 7100, selfUse: 4650, gridFeed: 2450 },
  { time: '14:00', generation: 5950, selfUse: 4200, gridFeed: 1750 },
  { time: '16:00', generation: 3200, selfUse: 2750, gridFeed: 450 },
  { time: '18:00', generation: 680, selfUse: 680, gridFeed: 0 },
  { time: '20:00', generation: 0, selfUse: 0, gridFeed: 0 },
  { time: '22:00', generation: 0, selfUse: 0, gridFeed: 0 },
]

// 储能运行监测时序 (双纵轴：充放电量 MWh + 套利收益 万元)
interface StorageRunPoint {
  time: string
  charge: number // 充电量 MWh
  discharge: number // 放电量 MWh
  revenue: number // 套利收益 万元
}

const STORAGE_RUN_SERIES: StorageRunPoint[] = [
  { time: '00:00', charge: 4.5, discharge: 0, revenue: 0 },
  { time: '02:00', charge: 4.8, discharge: 0, revenue: 0 },
  { time: '04:00', charge: 4.2, discharge: 0, revenue: 0 },
  { time: '06:00', charge: 1.2, discharge: 0, revenue: 0.1 },
  { time: '08:00', charge: 0, discharge: 4.9, revenue: 1.25 },
  { time: '10:00', charge: 0, discharge: 5.4, revenue: 2.65 },
  { time: '12:00', charge: 3.8, discharge: 0, revenue: 2.65 },
  { time: '14:00', charge: 2.4, discharge: 0, revenue: 2.70 },
  { time: '16:00', charge: 0, discharge: 1.5, revenue: 3.10 },
  { time: '18:00', charge: 0, discharge: 5.6, revenue: 4.45 },
  { time: '20:00', charge: 0, discharge: 4.8, revenue: 5.68 },
  { time: '22:00', charge: 0.8, discharge: 0, revenue: 5.72 },
]

// 热泵运行监测时序 (双纵轴：每日供热量 GJ + 制热耗电量 万kWh)
interface HeatPumpRunPoint {
  time: string
  heatOutputGj: number // 供热量 GJ
  powerKwh: number // 制热耗电量 万kWh
}

const HEAT_PUMP_SERIES: HeatPumpRunPoint[] = [
  { time: '00:00', heatOutputGj: 240, powerKwh: 1.82 },
  { time: '02:00', heatOutputGj: 220, powerKwh: 1.68 },
  { time: '04:00', heatOutputGj: 230, powerKwh: 1.74 },
  { time: '06:00', heatOutputGj: 310, powerKwh: 2.35 },
  { time: '08:00', heatOutputGj: 580, powerKwh: 4.25 },
  { time: '10:00', heatOutputGj: 640, powerKwh: 4.68 },
  { time: '12:00', heatOutputGj: 520, powerKwh: 3.82 },
  { time: '14:00', heatOutputGj: 550, powerKwh: 4.05 },
  { time: '16:00', heatOutputGj: 610, powerKwh: 4.48 },
  { time: '18:00', heatOutputGj: 690, powerKwh: 5.06 },
  { time: '20:00', heatOutputGj: 480, powerKwh: 3.55 },
  { time: '22:00', heatOutputGj: 320, powerKwh: 2.41 },
]

// 3. 零碳工厂评估雷达图数据模型 (国标对标体系)
export const NATIONAL_STANDARD_BENCHMARK: Record<string, number> = {
  能源低碳化: 90,
  工艺脱碳: 90,
  绿电消纳: 92,
  数字化管控: 95,
  供应链减碳: 85,
  信息披露: 90,
}
export const NATIONAL_ZERO_CARBON_THRESHOLD = 90.0

export interface FactoryRadarItem {
  dimension: string
  score: number // 工厂当前实际得分
  benchmark: number // 国标零碳要求基准分
  full: number
}

export interface FactoryEvaluation {
  id: string
  factoryName: string
  overallScore: number
  benchmarkScore: number // 90.0
  autoCollectRate: number
  nonFossilRate: number
  unconnected?: boolean
  radarData: FactoryRadarItem[]
}

interface RawRadarItem {
  dimension: string
  score: number
  full: number
}

interface RawFactoryEvaluation {
  id: string
  factoryName: string
  overallScore: number
  autoCollectRate: number
  nonFossilRate: number
  unconnected?: boolean
  radarData: RawRadarItem[]
}

// 严格对齐项目企业组织拓扑树 (ENTERPRISE_TREE_DATA: 6大经营单位 · 31个二级工厂实体)
const FACTORY_EVALUATIONS_RAW: Record<string, RawFactoryEvaluation[]> = {
  沈变公司: [
    {
      id: 'sb-1',
      factoryName: '沈变本部',
      overallScore: 92.4,
      autoCollectRate: 98.6,
      nonFossilRate: 41.5,
      radarData: [
        { dimension: '能源低碳化', score: 94, full: 100 },
        { dimension: '工艺脱碳', score: 92, full: 100 },
        { dimension: '绿电消纳', score: 95, full: 100 },
        { dimension: '数字化管控', score: 98, full: 100 },
        { dimension: '供应链减碳', score: 86, full: 100 },
        { dimension: '信息披露', score: 90, full: 100 },
      ],
    },
    {
      id: 'sb-2',
      factoryName: '露娜公司 (特变电工露娜智能)',
      overallScore: 89.2,
      autoCollectRate: 98.0,
      nonFossilRate: 38.2,
      radarData: [
        { dimension: '能源低碳化', score: 88, full: 100 },
        { dimension: '工艺脱碳', score: 89, full: 100 },
        { dimension: '绿电消纳', score: 90, full: 100 },
        { dimension: '数字化管控', score: 96, full: 100 },
        { dimension: '供应链减碳', score: 84, full: 100 },
        { dimension: '信息披露', score: 88, full: 100 },
      ],
    },
    {
      id: 'sb-3',
      factoryName: '智慧能源',
      overallScore: 86.5,
      autoCollectRate: 97.5,
      nonFossilRate: 39.0,
      unconnected: true,
      radarData: [
        { dimension: '能源低碳化', score: 86, full: 100 },
        { dimension: '工艺脱碳', score: 87, full: 100 },
        { dimension: '绿电消纳', score: 88, full: 100 },
        { dimension: '数字化管控', score: 92, full: 100 },
        { dimension: '供应链减碳', score: 82, full: 100 },
        { dimension: '信息披露', score: 84, full: 100 },
      ],
    },
    {
      id: 'sb-4',
      factoryName: '和新套管公司',
      overallScore: 85.6,
      autoCollectRate: 95.2,
      nonFossilRate: 35.8,
      radarData: [
        { dimension: '能源低碳化', score: 85, full: 100 },
        { dimension: '工艺脱碳', score: 86, full: 100 },
        { dimension: '绿电消纳', score: 84, full: 100 },
        { dimension: '数字化管控', score: 92, full: 100 },
        { dimension: '供应链减碳', score: 80, full: 100 },
        { dimension: '信息披露', score: 86, full: 100 },
      ],
    },
    {
      id: 'sb-5',
      factoryName: '康嘉互感器',
      overallScore: 83.1,
      autoCollectRate: 94.0,
      nonFossilRate: 33.5,
      radarData: [
        { dimension: '能源低碳化', score: 82, full: 100 },
        { dimension: '工艺脱碳', score: 84, full: 100 },
        { dimension: '绿电消纳', score: 81, full: 100 },
        { dimension: '数字化管控', score: 90, full: 100 },
        { dimension: '供应链减碳', score: 78, full: 100 },
        { dimension: '信息披露', score: 83, full: 100 },
      ],
    },
    {
      id: 'sb-6',
      factoryName: '印能公司',
      overallScore: 81.5,
      autoCollectRate: 92.8,
      nonFossilRate: 32.0,
      unconnected: true,
      radarData: [
        { dimension: '能源低碳化', score: 80, full: 100 },
        { dimension: '工艺脱碳', score: 81, full: 100 },
        { dimension: '绿电消纳', score: 82, full: 100 },
        { dimension: '数字化管控', score: 88, full: 100 },
        { dimension: '供应链减碳', score: 76, full: 100 },
        { dimension: '信息披露', score: 82, full: 100 },
      ],
    },
  ],
  衡变公司: [
    {
      id: 'hb-1',
      factoryName: '衡变本部',
      overallScore: 93.8,
      autoCollectRate: 99.1,
      nonFossilRate: 46.2,
      radarData: [
        { dimension: '能源低碳化', score: 96, full: 100 },
        { dimension: '工艺脱碳', score: 94, full: 100 },
        { dimension: '绿电消纳', score: 96, full: 100 },
        { dimension: '数字化管控', score: 98, full: 100 },
        { dimension: '供应链减碳', score: 88, full: 100 },
        { dimension: '信息披露', score: 92, full: 100 },
      ],
    },
    {
      id: 'hb-2',
      factoryName: '南京电研',
      overallScore: 91.5,
      autoCollectRate: 97.8,
      nonFossilRate: 43.0,
      radarData: [
        { dimension: '能源低碳化', score: 92, full: 100 },
        { dimension: '工艺脱碳', score: 90, full: 100 },
        { dimension: '绿电消纳', score: 93, full: 100 },
        { dimension: '数字化管控', score: 96, full: 100 },
        { dimension: '供应链减碳', score: 87, full: 100 },
        { dimension: '信息披露', score: 90, full: 100 },
      ],
    },
    {
      id: 'hb-3',
      factoryName: '云集电气',
      overallScore: 86.4,
      autoCollectRate: 95.0,
      nonFossilRate: 37.8,
      radarData: [
        { dimension: '能源低碳化', score: 85, full: 100 },
        { dimension: '工艺脱碳', score: 86, full: 100 },
        { dimension: '绿电消纳', score: 87, full: 100 },
        { dimension: '数字化管控', score: 92, full: 100 },
        { dimension: '供应链减碳', score: 81, full: 100 },
        { dimension: '信息披露', score: 85, full: 100 },
      ],
    },
    {
      id: 'hb-4',
      factoryName: '湖南电气',
      overallScore: 84.7,
      autoCollectRate: 94.2,
      nonFossilRate: 36.1,
      radarData: [
        { dimension: '能源低碳化', score: 84, full: 100 },
        { dimension: '工艺脱碳', score: 85, full: 100 },
        { dimension: '绿电消纳', score: 83, full: 100 },
        { dimension: '数字化管控', score: 91, full: 100 },
        { dimension: '供应链减碳', score: 79, full: 100 },
        { dimension: '信息披露', score: 84, full: 100 },
      ],
    },
    {
      id: 'hb-5',
      factoryName: '云集高压开关',
      overallScore: 88.0,
      autoCollectRate: 96.5,
      nonFossilRate: 39.5,
      radarData: [
        { dimension: '能源低碳化', score: 88, full: 100 },
        { dimension: '工艺脱碳', score: 87, full: 100 },
        { dimension: '绿电消纳', score: 89, full: 100 },
        { dimension: '数字化管控', score: 94, full: 100 },
        { dimension: '供应链减碳', score: 82, full: 100 },
        { dimension: '信息披露', score: 87, full: 100 },
      ],
    },
    {
      id: 'hb-6',
      factoryName: '新疆自控',
      overallScore: 85.2,
      autoCollectRate: 94.8,
      nonFossilRate: 36.5,
      radarData: [
        { dimension: '能源低碳化', score: 84, full: 100 },
        { dimension: '工艺脱碳', score: 86, full: 100 },
        { dimension: '绿电消纳', score: 85, full: 100 },
        { dimension: '数字化管控', score: 92, full: 100 },
        { dimension: '供应链减碳', score: 80, full: 100 },
        { dimension: '信息披露', score: 84, full: 100 },
      ],
    },
    {
      id: 'hb-7',
      factoryName: '上开',
      overallScore: 82.0,
      autoCollectRate: 93.0,
      nonFossilRate: 33.2,
      unconnected: true,
      radarData: [
        { dimension: '能源低碳化', score: 81, full: 100 },
        { dimension: '工艺脱碳', score: 82, full: 100 },
        { dimension: '绿电消纳', score: 83, full: 100 },
        { dimension: '数字化管控', score: 89, full: 100 },
        { dimension: '供应链减碳', score: 77, full: 100 },
        { dimension: '信息披露', score: 81, full: 100 },
      ],
    },
    {
      id: 'hb-8',
      factoryName: '柯贝尔',
      overallScore: 80.8,
      autoCollectRate: 92.5,
      nonFossilRate: 31.8,
      unconnected: true,
      radarData: [
        { dimension: '能源低碳化', score: 80, full: 100 },
        { dimension: '工艺脱碳', score: 81, full: 100 },
        { dimension: '绿电消纳', score: 80, full: 100 },
        { dimension: '数字化管控', score: 88, full: 100 },
        { dimension: '供应链减碳', score: 75, full: 100 },
        { dimension: '信息披露', score: 81, full: 100 },
      ],
    },
    {
      id: 'hb-9',
      factoryName: '特能建',
      overallScore: 89.6,
      autoCollectRate: 97.0,
      nonFossilRate: 42.5,
      radarData: [
        { dimension: '能源低碳化', score: 90, full: 100 },
        { dimension: '工艺脱碳', score: 89, full: 100 },
        { dimension: '绿电消纳', score: 91, full: 100 },
        { dimension: '数字化管控', score: 95, full: 100 },
        { dimension: '供应链减碳', score: 84, full: 100 },
        { dimension: '信息披露', score: 88, full: 100 },
      ],
    },
    {
      id: 'hb-10',
      factoryName: '合容电气',
      overallScore: 87.3,
      autoCollectRate: 95.8,
      nonFossilRate: 38.0,
      radarData: [
        { dimension: '能源低碳化', score: 86, full: 100 },
        { dimension: '工艺脱碳', score: 88, full: 100 },
        { dimension: '绿电消纳', score: 88, full: 100 },
        { dimension: '数字化管控', score: 93, full: 100 },
        { dimension: '供应链减碳', score: 82, full: 100 },
        { dimension: '信息披露', score: 86, full: 100 },
      ],
    },
    {
      id: 'hb-11',
      factoryName: '赛杰爱迪',
      overallScore: 86.8,
      autoCollectRate: 95.5,
      nonFossilRate: 37.6,
      radarData: [
        { dimension: '能源低碳化', score: 86, full: 100 },
        { dimension: '工艺脱碳', score: 87, full: 100 },
        { dimension: '绿电消纳', score: 87, full: 100 },
        { dimension: '数字化管控', score: 92, full: 100 },
        { dimension: '供应链减碳', score: 81, full: 100 },
        { dimension: '信息披露', score: 87, full: 100 },
      ],
    },
  ],
  新变厂: [
    {
      id: 'xb-1',
      factoryName: '超高压公司',
      overallScore: 94.2,
      autoCollectRate: 99.3,
      nonFossilRate: 48.5,
      radarData: [
        { dimension: '能源低碳化', score: 97, full: 100 },
        { dimension: '工艺脱碳', score: 95, full: 100 },
        { dimension: '绿电消纳', score: 97, full: 100 },
        { dimension: '数字化管控', score: 99, full: 100 },
        { dimension: '供应链减碳', score: 89, full: 100 },
        { dimension: '信息披露', score: 93, full: 100 },
      ],
    },
    {
      id: 'xb-2',
      factoryName: '天变公司',
      overallScore: 90.1,
      autoCollectRate: 97.4,
      nonFossilRate: 42.1,
      radarData: [
        { dimension: '能源低碳化', score: 90, full: 100 },
        { dimension: '工艺脱碳', score: 89, full: 100 },
        { dimension: '绿电消纳', score: 91, full: 100 },
        { dimension: '数字化管控', score: 95, full: 100 },
        { dimension: '供应链减碳', score: 85, full: 100 },
        { dimension: '信息披露', score: 88, full: 100 },
      ],
    },
    {
      id: 'xb-3',
      factoryName: '智能电气公司',
      overallScore: 87.5,
      autoCollectRate: 96.0,
      nonFossilRate: 38.6,
      radarData: [
        { dimension: '能源低碳化', score: 87, full: 100 },
        { dimension: '工艺脱碳', score: 88, full: 100 },
        { dimension: '绿电消纳', score: 88, full: 100 },
        { dimension: '数字化管控', score: 93, full: 100 },
        { dimension: '供应链减碳', score: 82, full: 100 },
        { dimension: '信息披露', score: 86, full: 100 },
      ],
    },
    {
      id: 'xb-4',
      factoryName: '京津冀公司',
      overallScore: 83.0,
      autoCollectRate: 93.5,
      nonFossilRate: 34.2,
      radarData: [
        { dimension: '能源低碳化', score: 82, full: 100 },
        { dimension: '工艺脱碳', score: 83, full: 100 },
        { dimension: '绿电消纳', score: 82, full: 100 },
        { dimension: '数字化管控', score: 89, full: 100 },
        { dimension: '供应链减碳', score: 78, full: 100 },
        { dimension: '信息披露', score: 82, full: 100 },
      ],
    },
    {
      id: 'xb-5',
      factoryName: '珠峰硅钢',
      overallScore: 85.8,
      autoCollectRate: 95.0,
      nonFossilRate: 37.0,
      radarData: [
        { dimension: '能源低碳化', score: 85, full: 100 },
        { dimension: '工艺脱碳', score: 86, full: 100 },
        { dimension: '绿电消纳', score: 86, full: 100 },
        { dimension: '数字化管控', score: 92, full: 100 },
        { dimension: '供应链减碳', score: 80, full: 100 },
        { dimension: '信息披露', score: 84, full: 100 },
      ],
    },
    {
      id: 'xb-6',
      factoryName: '智慧能源',
      overallScore: 84.6,
      autoCollectRate: 94.5,
      nonFossilRate: 35.8,
      unconnected: true,
      radarData: [
        { dimension: '能源低碳化', score: 84, full: 100 },
        { dimension: '工艺脱碳', score: 85, full: 100 },
        { dimension: '绿电消纳', score: 85, full: 100 },
        { dimension: '数字化管控', score: 90, full: 100 },
        { dimension: '供应链减碳', score: 79, full: 100 },
        { dimension: '信息披露', score: 83, full: 100 },
      ],
    },
    {
      id: 'xb-7',
      factoryName: '银利电气',
      overallScore: 82.3,
      autoCollectRate: 93.2,
      nonFossilRate: 33.6,
      unconnected: true,
      radarData: [
        { dimension: '能源低碳化', score: 81, full: 100 },
        { dimension: '工艺脱碳', score: 82, full: 100 },
        { dimension: '绿电消纳', score: 83, full: 100 },
        { dimension: '数字化管控', score: 88, full: 100 },
        { dimension: '供应链减碳', score: 77, full: 100 },
        { dimension: '信息披露', score: 82, full: 100 },
      ],
    },
  ],
  鲁缆公司: [
    {
      id: 'll-1',
      factoryName: '鲁缆本部',
      overallScore: 91.2,
      autoCollectRate: 98.2,
      nonFossilRate: 43.8,
      radarData: [
        { dimension: '能源低碳化', score: 91, full: 100 },
        { dimension: '工艺脱碳', score: 92, full: 100 },
        { dimension: '绿电消纳', score: 93, full: 100 },
        { dimension: '数字化管控', score: 97, full: 100 },
        { dimension: '供应链减碳', score: 85, full: 100 },
        { dimension: '信息披露', score: 89, full: 100 },
      ],
    },
    {
      id: 'll-2',
      factoryName: '智缆公司',
      overallScore: 88.6,
      autoCollectRate: 96.8,
      nonFossilRate: 40.2,
      unconnected: true,
      radarData: [
        { dimension: '能源低碳化', score: 88, full: 100 },
        { dimension: '工艺脱碳', score: 89, full: 100 },
        { dimension: '绿电消纳', score: 90, full: 100 },
        { dimension: '数字化管控', score: 94, full: 100 },
        { dimension: '供应链减碳', score: 83, full: 100 },
        { dimension: '信息披露', score: 86, full: 100 },
      ],
    },
    {
      id: 'll-3',
      factoryName: '昭和公司',
      overallScore: 86.0,
      autoCollectRate: 95.4,
      nonFossilRate: 37.5,
      unconnected: true,
      radarData: [
        { dimension: '能源低碳化', score: 85, full: 100 },
        { dimension: '工艺脱碳', score: 86, full: 100 },
        { dimension: '绿电消纳', score: 87, full: 100 },
        { dimension: '数字化管控', score: 92, full: 100 },
        { dimension: '供应链减碳', score: 80, full: 100 },
        { dimension: '信息披露', score: 84, full: 100 },
      ],
    },
    {
      id: 'll-4',
      factoryName: '曙光公司',
      overallScore: 84.5,
      autoCollectRate: 94.1,
      nonFossilRate: 35.8,
      unconnected: true,
      radarData: [
        { dimension: '能源低碳化', score: 83, full: 100 },
        { dimension: '工艺脱碳', score: 85, full: 100 },
        { dimension: '绿电消纳', score: 85, full: 100 },
        { dimension: '数字化管控', score: 90, full: 100 },
        { dimension: '供应链减碳', score: 79, full: 100 },
        { dimension: '信息披露', score: 83, full: 100 },
      ],
    },
  ],
  新缆厂: [
    {
      id: 'xl-1',
      factoryName: '特变电工新疆电缆有限公司',
      overallScore: 90.5,
      autoCollectRate: 97.6,
      nonFossilRate: 42.4,
      radarData: [
        { dimension: '能源低碳化', score: 91, full: 100 },
        { dimension: '工艺脱碳', score: 90, full: 100 },
        { dimension: '绿电消纳', score: 92, full: 100 },
        { dimension: '数字化管控', score: 96, full: 100 },
        { dimension: '供应链减碳', score: 84, full: 100 },
        { dimension: '信息披露', score: 88, full: 100 },
      ],
    },
    {
      id: 'xl-2',
      factoryName: '特变电工新疆线缆厂',
      overallScore: 87.8,
      autoCollectRate: 96.2,
      nonFossilRate: 39.0,
      radarData: [
        { dimension: '能源低碳化', score: 87, full: 100 },
        { dimension: '工艺脱碳', score: 88, full: 100 },
        { dimension: '绿电消纳', score: 89, full: 100 },
        { dimension: '数字化管控', score: 93, full: 100 },
        { dimension: '供应链减碳', score: 82, full: 100 },
        { dimension: '信息披露', score: 86, full: 100 },
      ],
    },
  ],
  德缆公司: [
    {
      id: 'dl-1',
      factoryName: '特变电工（德阳）电缆股份有限公司',
      overallScore: 91.8,
      autoCollectRate: 98.0,
      nonFossilRate: 44.5,
      radarData: [
        { dimension: '能源低碳化', score: 92, full: 100 },
        { dimension: '工艺脱碳', score: 91, full: 100 },
        { dimension: '绿电消纳', score: 94, full: 100 },
        { dimension: '数字化管控', score: 97, full: 100 },
        { dimension: '供应链减碳', score: 86, full: 100 },
        { dimension: '信息披露', score: 90, full: 100 },
      ],
    },
  ],
}

const FACTORY_EVALUATIONS_MAP: Record<string, FactoryEvaluation[]> = Object.fromEntries(
  Object.entries(FACTORY_EVALUATIONS_RAW).map(([company, factories]) => [
    company,
    factories.map((f) => ({
      ...f,
      benchmarkScore: NATIONAL_ZERO_CARBON_THRESHOLD,
      radarData: f.radarData.map((r) => ({
        ...r,
        benchmark: NATIONAL_STANDARD_BENCHMARK[r.dimension] ?? 90,
      })),
    })),
  ])
)

const OPERATING_UNITS_LIST = ['沈变公司', '衡变公司', '新变厂', '鲁缆公司', '新缆厂', '德缆公司']

// =========================================================================
// 4. 大屏核心组件实现
// =========================================================================
// 独立时钟组件 (避免秒级刷新导致全页面与图表重复重渲闪烁)
// =========================================================================
function HeaderClock() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const weekDay = days[now.getDay()]
      setCurrentTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${weekDay}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
      {currentTime}
    </span>
  )
}

// =========================================================================
// 集控中心大屏主组件
// =========================================================================

export default function CentralControlScreenPage() {
  const [activeUnit, setActiveUnit] = useState<string>('沈变公司')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // 当前选中经营单位的工厂列表
  const currentFactories = useMemo(() => {
    return FACTORY_EVALUATIONS_MAP[activeUnit] || FACTORY_EVALUATIONS_MAP['沈变公司']
  }, [activeUnit])

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#01040d] text-slate-100 font-sans overflow-hidden select-none flex flex-col justify-between">
      {/* 科技背景网格与径向蓝晕 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,140,255,0.12),transparent_75%)]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,180,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.035) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ========================================================================= */}
      {/* 🌟 1. 顶部科技 HUD 导航栏 */}
      {/* ========================================================================= */}
      <header className="relative z-30 shrink-0 h-13 px-5 flex items-center justify-between border-b border-[#0e2a5c]/80 bg-gradient-to-b from-[#06183a]/90 to-[#020b1f]/90 backdrop-blur-md">
        {/* 左侧：品牌与返回 */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black tracking-widest text-[#00f0ff] font-mono drop-shadow-[0_0_8px_#00c2ff]">
              TBEA
            </span>
            <span className="font-bold text-white tracking-wider text-sm">特变电工</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-[#0e2a5c] text-slate-400">
            <span className="tracking-widest font-mono text-slate-300 text-xs">
              装备中国 装备世界
            </span>
          </div>

          <Link
            href="/zero-carbon/screen"
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-[#0091ff]/40 bg-[#0091ff]/10 hover:bg-[#0091ff]/20 text-[#00c2ff] transition-colors shadow-[0_0_10px_rgba(0,145,255,0.15)]"
          >
            <ArrowLeft className="size-3.5" />
            <span>返回全景大屏</span>
          </Link>
        </div>

        {/* 中央主标题科技梯形 HUD - 绝对定位锁定全屏与中间板块100%中轴线居中 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="relative flex flex-col items-center px-14 py-1.5 pointer-events-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0091ff]/30 via-[#0055aa]/20 to-transparent border-t-2 border-[#00e5ff] [clip-path:polygon(0_0,100%_0,88%_100%,12%_100%)] pointer-events-none drop-shadow-[0_4px_16px_rgba(0,210,255,0.4)]" />
            <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-72 h-[2px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent shadow-[0_0_16px_#00ffff]" />

            <h1 className="font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d4ebff] to-[#00d2ff] drop-shadow-[0_2px_16px_rgba(0,210,255,0.6)] text-xl flex items-center gap-2">
              特变电工集团能碳集控中心大屏
            </h1>
          </div>
          <div className="flex items-center gap-3 -mt-0.5 pointer-events-auto">
            <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#00c2ff]/60" />
            <span className="font-mono tracking-[0.35em] text-[#00c2ff]/90 font-bold uppercase text-[9px]">
              ENERGY & CARBON INTEGRATED CONTROL CENTER
            </span>
            <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#00c2ff]/60" />
          </div>
        </div>

        {/* 右侧：状态指示胶囊、时钟、天气与全屏 */}
        <div className="relative z-10 flex items-center gap-3 font-mono">
          {/* 实时在线状态胶囊 */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider text-[11px] font-medium font-sans">零碳集控·实时在线</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 text-xs">
            <HeaderClock />
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <CloudSun className="size-4 text-amber-400" />
              北京 28℃ 晴
            </span>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-[#0091ff]/40 bg-[#002456]/50 hover:bg-[#003882]/70 text-slate-200 transition-colors cursor-pointer"
            title="全屏切换"
          >
            {isFullscreen ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5 text-[#00e5ff]" />
            )}
            <span>{isFullscreen ? '还原' : '全屏'}</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🌟 2. 大屏主体 16:9 三栏 Bento 布局 */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 min-h-0 grid grid-cols-12 gap-2.5 p-2.5 overflow-hidden">
        {/* ======================================================================= */}
        {/* ⬅️ 板块 1: 综合能源分析 (4列 / 12 大框) */}
        {/* ======================================================================= */}
        <section className="col-span-4 relative rounded-xl border border-[#0e2a5c] bg-gradient-to-b from-[#061536]/90 via-[#030e28]/95 to-[#020b1e]/98 p-2.5 flex flex-col min-h-0 shadow-[0_4px_20px_-2px_rgba(0,10,30,0.8),0_0_1px_1px_rgba(0,210,255,0.12)]">
          <div className="absolute top-0 left-0 size-2 border-t-2 border-l-2 border-[#00d2ff]" />
          <div className="absolute top-0 right-0 size-2 border-t-2 border-r-2 border-[#00d2ff]" />
          <div className="absolute bottom-0 left-0 size-1.5 border-b border-l border-[#00d2ff]/40" />
          <div className="absolute bottom-0 right-0 size-1.5 border-b border-r border-[#00d2ff]/40" />

          {/* 大框标题：综合能源分析 */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#0e2a5c] shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-[#00c2ff]/15 border border-[#00c2ff]/40 text-[#00c2ff]">
                <Zap className="size-3.5 text-[#00f0ff]" />
              </div>
              <h2 className="font-bold text-slate-100 tracking-wider text-xs flex items-center gap-1.5">
                综合能源分析
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 font-medium">
                ● LIVE
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
              折标总能耗: <span className="text-cyan-300 font-bold">12.80万 tce</span>
            </div>
          </div>

          {/* 内部 3 行 Grid 保持 100% 亚像素级严格水平对齐 */}
          <div className="flex-1 min-h-0 grid grid-rows-3 gap-2 overflow-hidden">
            {/* 1. 顶部：2 个饼图并排 (经营单位能耗比重 + 市电与绿电结构) */}
            <div className="grid grid-cols-2 gap-2 min-h-0 h-full">
              {/* 1.1 6家经营单位综合能耗比重 */}
              <div className="relative rounded-lg border border-[#0e2a5c]/80 bg-[#02091d]/85 p-2 flex flex-col min-h-0 h-full shadow-[inset_0_0_12px_rgba(0,145,255,0.05)]">
                <div className="absolute top-0 left-0 size-1.5 border-t border-l border-[#00d2ff]/50" />
                <div className="absolute top-0 right-0 size-1.5 border-t border-r border-[#00d2ff]/50" />
              <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-3 bg-gradient-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                  <h2 className="font-bold text-slate-100 tracking-wider text-xs">经营单位能耗比重</h2>
                </div>
                <span className="font-mono text-[10px] text-cyan-300 font-bold">总计 12.80万tce</span>
              </div>

              <div className="flex-1 min-h-0 relative flex items-center justify-center">
                {/* 科技虚线外轨道 SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                  <circle cx="100" cy="96" r="64" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="100" cy="96" r="26" fill="none" stroke="#0070e0" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />
                </svg>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={OPERATING_UNITS_ENERGY}
                      cx="50%"
                      cy="48%"
                      innerRadius={34}
                      outerRadius={54}
                      paddingAngle={3}
                      dataKey="tce"
                      isAnimationActive={false}
                    >
                      {OPERATING_UNITS_ENERGY.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} stroke="#03091d" strokeWidth={1.5} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload as UnitEnergyData
                          return (
                            <div className="rounded-md border border-[#0e2a5c] bg-[#0b1528]/95 p-2 shadow-xl text-xs backdrop-blur-md">
                              <div className="font-bold text-white mb-0.5">{d.name}</div>
                              <div className="text-slate-300">
                                消费量: <span className="font-mono text-cyan-300 font-bold">{d.tce}</span> 万tce
                              </div>
                              <div className="text-slate-300">
                                全集团占比: <span className="font-mono text-emerald-400 font-bold">{d.percentage}%</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* 环形中央综合能耗核心 KPI 锚点 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center pb-2">
                  <div className="w-14 h-14 rounded-full bg-[#00f0ff]/5 flex flex-col items-center justify-center backdrop-blur-xs">
                    <span className="text-[8px] text-slate-400 font-sans tracking-wide">综合能耗</span>
                    <span className="font-mono font-black text-sm text-cyan-300 drop-shadow-[0_0_8px_rgba(0,210,255,0.7)] leading-none my-0.5">
                      12.80
                    </span>
                    <span className="text-[7.5px] text-cyan-400/80 font-mono">万tce</span>
                  </div>
                </div>
              </div>

              {/* 极简两列图例 */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-1 border-t border-[#0e2a5c]/60 text-[9.5px]">
                {OPERATING_UNITS_ENERGY.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1 truncate">
                      <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-mono text-slate-400 shrink-0 ml-1">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1.2 集团市电与绿电结构 (环形图) */}
            <div className="relative rounded-lg border border-[#0e2a5c]/80 bg-[#02091d]/85 p-2 flex flex-col min-h-0 h-full shadow-[inset_0_0_12px_rgba(0,145,255,0.05)]">
              <div className="absolute top-0 left-0 size-1.5 border-t border-l border-[#00d2ff]/50" />
              <div className="absolute top-0 right-0 size-1.5 border-t border-r border-[#00d2ff]/50" />
              <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-3 bg-gradient-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                  <h2 className="font-bold text-slate-100 tracking-wider text-xs">市电与绿电结构</h2>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">绿电 42.6%</span>
              </div>

              <div className="flex-1 min-h-0 relative flex items-center justify-center">
                {/* 科技虚线外轨道 SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                  <circle cx="100" cy="96" r="64" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="100" cy="96" r="26" fill="none" stroke="#059669" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />
                </svg>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={POWER_SOURCE_DATA}
                      cx="50%"
                      cy="48%"
                      innerRadius={34}
                      outerRadius={54}
                      dataKey="value"
                      paddingAngle={3}
                      isAnimationActive={false}
                    >
                      {POWER_SOURCE_DATA.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} stroke="#03091d" strokeWidth={1.5} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload as GridPowerData
                          return (
                            <div className="rounded-md border border-[#0e2a5c] bg-[#0b1528]/95 p-2 shadow-xl text-xs">
                              <div className="font-bold text-white mb-0.5">{d.name}</div>
                              <div className="text-slate-300">
                                电量: <span className="font-mono text-cyan-300 font-bold">{d.value.toLocaleString()}</span> 万kWh
                              </div>
                              <div className="text-slate-300">
                                比例: <span className="font-mono text-emerald-400 font-bold">{d.ratio}%</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* 环形中央绿电渗透率指标 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center pb-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-400/5 flex flex-col items-center justify-center backdrop-blur-xs">
                    <span className="text-[8px] text-slate-400 font-sans tracking-wide">绿电渗透率</span>
                    <span className="font-mono font-black text-sm text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] leading-none my-0.5">
                      42.6%
                    </span>
                    <span className="text-[7.5px] text-emerald-400/80 font-mono">绿色转型</span>
                  </div>
                </div>
              </div>

              {/* 细分标签列表 */}
              <div className="flex flex-col gap-0.5 pt-1 border-t border-[#0e2a5c]/60 text-[9px]">
                {POWER_SOURCE_DATA.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1 truncate">
                      <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="truncate">{p.name}</span>
                    </span>
                    <span className="font-mono text-slate-400 shrink-0">{p.ratio}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* 2. 中层：能源类型折标对比 (全宽水平条形图) */}
          {/* ======================================================================= */}
          <div className="relative rounded-lg border border-[#0e2a5c]/80 bg-[#02091d]/85 p-2 flex flex-col min-h-0 h-full shadow-[inset_0_0_12px_rgba(0,145,255,0.05)]">
            <div className="absolute top-0 left-0 size-1.5 border-t border-l border-[#00d2ff]/50" />
            <div className="absolute top-0 right-0 size-1.5 border-t border-r border-[#00d2ff]/50" />
            <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-3 bg-gradient-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                <h2 className="font-bold text-slate-100 tracking-wider text-xs">能源类型折标对比</h2>
              </div>
              <span className="font-mono text-[10px] text-cyan-400">统一折标煤 (tce)</span>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={GROUP_ENERGY_TYPES}
                  layout="vertical"
                  margin={{ top: 2, right: 62, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="barGradElec" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0070e0" />
                      <stop offset="100%" stopColor="#00f0ff" />
                    </linearGradient>
                    <linearGradient id="barGradGas" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                    <linearGradient id="barGradSteam" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                    <linearGradient id="barGradCoal" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                    <linearGradient id="barGradWater" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(14, 42, 92, 0.4)" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="type"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={72}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload as EnergyTypeData
                        return (
                          <div className="rounded-md border border-[#0e2a5c] bg-[#0b1528]/95 p-2 shadow-xl text-xs">
                            <div className="font-bold text-white mb-0.5">{d.type}</div>
                            <div className="text-slate-300">
                              物理原量: <span className="font-mono text-cyan-300 font-bold">{d.rawVal}</span>
                            </div>
                            <div className="text-slate-300">
                              统一折标: <span className="font-mono text-emerald-400 font-bold">{d.tce}</span> 万tce
                            </div>
                            <div className="text-slate-300">
                              综合占比: <span className="font-mono text-amber-300 font-bold">{d.ratio}%</span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="tce"
                    isAnimationActive={false}
                    radius={[0, 4, 4, 0]}
                    label={{ position: 'right', fill: '#00f0ff', fontSize: 10, fontWeight: 700, formatter: (val: any) => `${val}万 tce` }}
                  >
                    {GROUP_ENERGY_TYPES.map((entry, index) => {
                      const gradIds = ['url(#barGradElec)', 'url(#barGradGas)', 'url(#barGradSteam)', 'url(#barGradCoal)', 'url(#barGradWater)']
                      return <Cell key={entry.type} fill={gradIds[index % gradIds.length]} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-1.5 border-t border-[#0e2a5c]/60 flex items-center justify-between text-[9px] text-slate-300 font-mono">
              <span className="px-2 py-0.5 rounded-full bg-[#071739]/80 border border-[#0091ff]/30 text-slate-300 flex items-center gap-1">
                <span className="size-1 rounded-full bg-cyan-400" />
                电力: <strong className="text-cyan-400">0.1229</strong> kgce/kWh
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#071739]/80 border border-emerald-500/30 text-slate-300 flex items-center gap-1">
                <span className="size-1 rounded-full bg-emerald-400" />
                天然气: <strong className="text-emerald-400">1.2143</strong> kgce/m³
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#071739]/80 border border-sky-500/30 text-slate-300 flex items-center gap-1">
                <span className="size-1 rounded-full bg-sky-400" />
                蒸汽: <strong className="text-sky-400">0.1286</strong> kgce/kg
              </span>
            </div>
          </div>

          {/* 3. 下方：15个园区光伏装机容量 (全宽垂直柱状图) */}
          <div className="relative rounded-lg border border-[#0e2a5c]/80 bg-[#02091d]/85 p-2 flex flex-col min-h-0 h-full shadow-[inset_0_0_12px_rgba(0,145,255,0.05)]">
            <div className="absolute top-0 left-0 size-1.5 border-t border-l border-[#00d2ff]/50" />
            <div className="absolute top-0 right-0 size-1.5 border-t border-r border-[#00d2ff]/50" />
            <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-3 bg-gradient-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                <h2 className="font-bold text-slate-100 tracking-wider text-xs">15个零碳产业园区光伏装机容量</h2>
              </div>
              <span className="font-mono text-[10px] text-cyan-400">单位: MWp</span>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PARK_PV_CAPACITIES}
                  margin={{ top: 12, right: 10, left: -20, bottom: 22 }}
                >
                  <defs>
                    <linearGradient id="pvColGradTop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="#0055aa" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="pvColGradMid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0091ff" />
                      <stop offset="100%" stopColor="#003388" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="pvColGradLow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#012a66" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(14, 42, 92, 0.4)" />
                  <XAxis
                    dataKey="shortName"
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    tick={{ fill: '#94a3b8', fontSize: 8.5 }}
                    axisLine={{ stroke: '#0e2a5c' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload as ParkPvData
                        return (
                          <div className="rounded-md border border-[#0e2a5c] bg-[#0b1528]/95 p-2 shadow-xl text-xs">
                            <div className="font-bold text-white mb-0.5">{d.fullName}</div>
                            <div className="text-slate-300">
                              区域: <span className="font-medium text-slate-200">{d.region}</span>
                            </div>
                            <div className="text-slate-300">
                              装机容量: <span className="font-mono text-cyan-300 font-bold">{d.capacityMw}</span> MWp
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="capacityMw"
                    isAnimationActive={false}
                    radius={[3, 3, 0, 0]}
                  >
                    {PARK_PV_CAPACITIES.map((entry, index) => (
                      <Cell
                        key={entry.parkId}
                        fill={index < 3 ? 'url(#pvColGradTop)' : index < 8 ? 'url(#pvColGradMid)' : 'url(#pvColGradLow)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-1.5 border-t border-[#0e2a5c]/60 flex items-center justify-between text-[9.5px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#071739]/80 border border-[#0091ff]/30 text-slate-300 shadow-[0_0_10px_rgba(0,145,255,0.15)]">
                <Zap className="size-3 text-cyan-400" />
                集团总装机: <strong className="text-cyan-300 font-bold">334.8 MWp</strong>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#071739]/80 border border-emerald-500/30 text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="size-3 text-emerald-400" />
                覆盖园区: <strong>15个在运标杆</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

        {/* ======================================================================= */}
        {/* ⬆️ 板块 2: 零碳项目展示 (4列 / 12 大框) */}
        {/* ======================================================================= */}
        <section className="col-span-4 relative rounded-xl border border-[#0e2a5c] bg-gradient-to-b from-[#061536]/90 via-[#030e28]/95 to-[#020b1e]/98 p-2.5 flex flex-col min-h-0 shadow-[0_4px_20px_-2px_rgba(0,10,30,0.8),0_0_1px_1px_rgba(0,210,255,0.12)]">
          <div className="absolute top-0 left-0 size-2 border-t-2 border-l-2 border-[#00d2ff]" />
          <div className="absolute top-0 right-0 size-2 border-t-2 border-r-2 border-[#00d2ff]" />
          <div className="absolute bottom-0 left-0 size-1.5 border-b border-l border-[#00d2ff]/40" />
          <div className="absolute bottom-0 right-0 size-1.5 border-b border-r border-[#00d2ff]/40" />

          {/* 大框标题：零碳项目展示 */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#0e2a5c] shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-[#00c2ff]/15 border border-[#00c2ff]/40 text-[#00c2ff]">
                <Sun className="size-3.5 text-amber-400" />
              </div>
              <h2 className="font-bold text-slate-100 tracking-wider text-xs flex items-center gap-1.5">
                零碳项目展示
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 font-medium">
                ● LIVE
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
              光储热就地消纳: <span className="text-emerald-400 font-bold">72.8%</span>
            </div>
          </div>

          {/* 内部 3 行 Grid 保持 100% 亚像素级严格水平对齐 */}
          <div className="flex-1 min-h-0 grid grid-rows-3 gap-2 overflow-hidden">
            {/* 2.1 光伏发电与消纳平衡时序趋势 */}
            <div className="relative rounded-lg border border-[#0e2a5c]/80 bg-[#02091d]/85 p-2 flex flex-col min-h-0 h-full shadow-[inset_0_0_12px_rgba(0,145,255,0.05)]">
              <div className="absolute top-0 left-0 size-1.5 border-t border-l border-[#00d2ff]/50" />
              <div className="absolute top-0 right-0 size-1.5 border-t border-r border-[#00d2ff]/50" />
              <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-2.5 bg-gradient-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_6px_#00e5ff]" />
                  <h3 className="font-bold text-slate-100 tracking-wider text-[11px] flex items-center gap-1">
                    <Sun className="size-3 text-amber-400" />
                    光伏发电与消纳平衡走势
                  </h3>
                </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="size-1.5 rounded-full bg-cyan-400" />
                  总发电量
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  自用消纳
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="size-1.5 rounded-full bg-amber-400" />
                  余电上网
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={PV_BALANCE_SERIES}
                  margin={{ top: 6, right: 10, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="pvGenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="pvSelfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(14, 42, 92, 0.4)" />
                  <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 9.5 }} axisLine={{ stroke: '#0e2a5c' }} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 9.5 }} axisLine={false} tickLine={false} unit="kW" />
                  <Tooltip
                    cursor={{ stroke: 'rgba(56, 189, 248, 0.25)', strokeDasharray: '4 4' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-md border border-[#0e2a5c] bg-[#0b1528]/95 p-2 shadow-xl text-xs">
                            <div className="font-bold text-white mb-1">{label} 光伏消纳动态</div>
                            {payload.map((p) => (
                              <div key={p.name} className="flex items-center justify-between gap-3 text-slate-300">
                                <span className="flex items-center gap-1.5">
                                  <span className="size-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                                  <span>{p.name}:</span>
                                </span>
                                <span className="font-mono font-bold" style={{ color: p.color }}>
                                  {p.value} kW
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area type="monotone" dataKey="generation" name="总发电量" stroke="#00f0ff" fill="url(#pvGenGrad)" strokeWidth={2} isAnimationActive={false} />
                  <Area type="monotone" dataKey="selfUse" name="自用消纳" stroke="#10b981" fill="url(#pvSelfGrad)" strokeWidth={2} isAnimationActive={false} />
                  <Line type="monotone" dataKey="gridFeed" name="余电上网" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 2, fill: '#f59e0b' }} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-1.5 border-t border-[#0e2a5c]/60 flex items-center justify-between text-[9.5px] font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#071739]/80 border border-[#0e2a5c] text-slate-300">
                <Sun className="size-3 text-amber-400" />
                日照发电峰值: <strong className="text-amber-300">12:00 (7,100 kW)</strong>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                当日综合就地消纳率: 72.8%
              </span>
            </div>
          </div>

          {/* 2.2 储能运行监测 (充放电时序 + 套利收益走势 双纵轴) */}
          <div className="relative rounded-lg border border-[#0e2a5c]/80 bg-[#02091d]/85 p-2 flex flex-col min-h-0 h-full shadow-[inset_0_0_12px_rgba(0,145,255,0.05)]">
            <div className="absolute top-0 left-0 size-1.5 border-t border-l border-[#00d2ff]/50" />
            <div className="absolute top-0 right-0 size-1.5 border-t border-r border-[#00d2ff]/50" />
            <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-2.5 bg-gradient-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_6px_#00e5ff]" />
                <h3 className="font-bold text-slate-100 tracking-wider text-[11px] flex items-center gap-1">
                  <BatteryCharging className="size-3 text-cyan-400" />
                  储能充放运行与套利收益监测 (双纵轴)
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[9.5px] font-mono">
                <span className="text-[#0091ff]">充/放电量(MWh)</span>
                <span className="text-amber-400">套利收益(万元)</span>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={STORAGE_RUN_SERIES}
                  margin={{ top: 6, right: 6, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="storeChargeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="#0055aa" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="storeDischargeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  {/* 分时电价时段底色映射: 谷电时段微蓝底, 峰电时段微橙底 */}
                  <ReferenceArea yAxisId="left" x1="00:00" x2="06:00" fill="rgba(0, 145, 255, 0.07)" />
                  <ReferenceArea yAxisId="left" x1="12:00" x2="14:00" fill="rgba(0, 145, 255, 0.07)" />
                  <ReferenceArea yAxisId="left" x1="08:00" x2="10:00" fill="rgba(245, 158, 11, 0.07)" />
                  <ReferenceArea yAxisId="left" x1="18:00" x2="20:00" fill="rgba(245, 158, 11, 0.07)" />

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(14, 42, 92, 0.4)" />
                  <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 9.5 }} axisLine={{ stroke: '#0e2a5c' }} tickLine={false} />
                  {/* 左轴：充放电量 MWh */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#94a3b8', fontSize: 9.5 }}
                    axisLine={false}
                    tickLine={false}
                    unit="MWh"
                  />
                  {/* 右轴：套利收益 万元 */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#f59e0b', fontSize: 9.5 }}
                    axisLine={false}
                    tickLine={false}
                    unit="万"
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-md border border-[#0e2a5c] bg-[#0b1528]/95 p-2 shadow-xl text-xs">
                            <div className="font-bold text-white mb-1">{label} 储能运行状态</div>
                            {payload.map((p) => (
                              <div key={p.name} className="flex items-center justify-between gap-3 text-slate-300">
                                <span>{p.name}:</span>
                                <span className="font-mono font-bold" style={{ color: p.color }}>
                                  {p.value} {p.name === '累计套利收益' ? '万元' : 'MWh'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar yAxisId="left" dataKey="charge" name="充电量" fill="url(#storeChargeGrad)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                  <Bar yAxisId="left" dataKey="discharge" name="放电量" fill="url(#storeDischargeGrad)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="累计套利收益"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 2.2, fill: '#f59e0b' }}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-1.5 border-t border-[#0e2a5c]/60 flex items-center justify-between text-[9.5px] font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#071739]/80 border border-[#0091ff]/30 text-slate-300">
                <BatteryCharging className="size-3 text-cyan-400" />
                充放策略: <strong className="text-cyan-300">分时电价·两充两放</strong>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                <TrendingUp className="size-3 text-amber-400" />
                当日累计套利: 5.72 万元
              </span>
            </div>
          </div>

          {/* 2.3 热泵运行监测 (供热量 GJ + 制热耗电量 万kWh 双纵轴) */}
          <div className="relative rounded-lg border border-[#0e2a5c]/80 bg-[#02091d]/85 p-2 flex flex-col min-h-0 h-full shadow-[inset_0_0_12px_rgba(0,145,255,0.05)]">
            <div className="absolute top-0 left-0 size-1.5 border-t border-l border-[#00d2ff]/50" />
            <div className="absolute top-0 right-0 size-1.5 border-t border-r border-[#00d2ff]/50" />
            <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-2.5 bg-gradient-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_6px_#00e5ff]" />
                <h3 className="font-bold text-slate-100 tracking-wider text-[11px] flex items-center gap-1">
                  <Flame className="size-3 text-rose-400" />
                  热泵供热量与耗电平衡监测 (双纵轴)
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[9.5px] font-mono">
                <span className="text-rose-400">供热量(GJ)</span>
                <span className="text-cyan-400">耗电量(万kWh)</span>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={HEAT_PUMP_SERIES}
                  margin={{ top: 6, right: 6, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="heatPumpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb7185" />
                      <stop offset="100%" stopColor="#be123c" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(14, 42, 92, 0.4)" />
                  <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 9.5 }} axisLine={{ stroke: '#0e2a5c' }} tickLine={false} />
                  {/* 左轴：供热量 GJ */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#94a3b8', fontSize: 9.5 }}
                    axisLine={false}
                    tickLine={false}
                    unit="GJ"
                  />
                  {/* 右轴：制热耗电量 万kWh */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#00f0ff', fontSize: 9.5 }}
                    axisLine={false}
                    tickLine={false}
                    unit="万"
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-md border border-[#0e2a5c] bg-[#0b1528]/95 p-2 shadow-xl text-xs">
                            <div className="font-bold text-white mb-1">{label} 热泵运行参数</div>
                            {payload.map((p) => (
                              <div key={p.name} className="flex items-center justify-between gap-3 text-slate-300">
                                <span>{p.name}:</span>
                                <span className="font-mono font-bold" style={{ color: p.color }}>
                                  {p.value} {p.name === '制热耗电量' ? '万kWh' : 'GJ'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar yAxisId="left" dataKey="heatOutputGj" name="每日供热量" fill="url(#heatPumpGrad)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="powerKwh"
                    name="制热耗电量"
                    stroke="#00f0ff"
                    strokeWidth={2}
                    dot={{ r: 2.2, fill: '#00f0ff' }}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-1.5 border-t border-[#0e2a5c]/60 flex items-center justify-between text-[9.5px] font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#071739]/80 border border-rose-500/30 text-slate-300">
                <Flame className="size-3 text-rose-400" />
                综合能效比 (COP): <strong className="text-rose-400 font-bold">4.12</strong>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                替代天然气标煤折减: 14.8 tce/日
              </span>
            </div>
          </div>
        </div>
      </section>

        {/* ======================================================================= */}
        {/* ➡️ 板块 3: 零碳工厂评估 (4列 / 12 大框) */}
        {/* ======================================================================= */}
        <section className="col-span-4 relative rounded-xl border border-[#0e2a5c] bg-gradient-to-b from-[#061536]/90 via-[#030e28]/95 to-[#020b1e]/98 p-2.5 flex flex-col min-h-0 shadow-[0_4px_20px_-2px_rgba(0,10,30,0.8),0_0_1px_1px_rgba(0,210,255,0.12)]">
          <div className="absolute top-0 left-0 size-2 border-t-2 border-l-2 border-[#00d2ff]" />
          <div className="absolute top-0 right-0 size-2 border-t-2 border-r-2 border-[#00d2ff]" />
          <div className="absolute bottom-0 left-0 size-1.5 border-b border-l border-[#00d2ff]/40" />
          <div className="absolute bottom-0 right-0 size-1.5 border-b border-r border-[#00d2ff]/40" />

          {/* 3.1 头部与 6 大经营单位 Tab 切换 */}
          <div className="border-b border-[#0e2a5c] pb-1.5 mb-1.5 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-[#00c2ff]/15 border border-[#00c2ff]/40 text-[#00c2ff]">
                  <Award className="size-3.5 text-amber-400" />
                </div>
                <h2 className="font-bold text-slate-100 tracking-wider text-xs flex items-center gap-1.5">
                  零碳工厂成熟度雷达评估
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono border border-amber-500/40 bg-amber-950/40 text-amber-400 font-medium">
                  ● 国标对标
                </span>
                <span className="text-[10px] text-cyan-400 font-mono ml-0.5">
                  [{activeUnit} · {currentFactories.length}单位]
                </span>
              </div>
              {/* 国标与实际对比图例 */}
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="size-1.5 rounded-full bg-cyan-400" />
                  当前工厂状态
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-[1.5px] bg-amber-400 inline-block border-b border-dashed border-amber-400" />
                  国标零碳基准 (90分)
                </span>
              </div>
            </div>

            {/* 6 家经营单位 Tab 切换按钮组 (严格映射企业组织树 31 个二级单位) */}
            <div className="grid grid-cols-6 gap-1 bg-[#020714] p-1 rounded-lg border border-[#0e2a5c]">
              {OPERATING_UNITS_LIST.map((unit) => {
                const isActive = activeUnit === unit
                const unitCount = FACTORY_EVALUATIONS_MAP[unit]?.length ?? 0
                return (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setActiveUnit(unit)}
                    className={cn(
                      'py-1 px-1 text-center font-medium transition-all rounded-md text-[11px] cursor-pointer truncate flex items-center justify-center gap-1',
                      isActive
                        ? 'bg-gradient-to-r from-[#0091ff]/30 via-[#00c8ff]/25 to-[#00f0ff]/30 border border-[#00f0ff] text-white font-bold shadow-[0_0_14px_rgba(0,240,255,0.4)] ring-1 ring-[#00f0ff]/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#071739]/60 border border-transparent'
                    )}
                  >
                    <span>{unit}</span>
                    <span className={cn('text-[9.5px] font-mono', isActive ? 'text-cyan-300 font-bold' : 'text-slate-500')}>
                      ({unitCount})
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3.2 下属工厂雷达图卡片矩阵 (尺寸锁定固定高，多工厂滚动展示) */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 grid grid-cols-2 gap-2 content-start [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#051538]/30 [&::-webkit-scrollbar-thumb]:bg-[#0091ff]/30 [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-[#00f0ff]/50">
            {currentFactories.map((factory) => {
              const diffScore = factory.overallScore - factory.benchmarkScore
              const isPassing = diffScore >= 0
              return (
                <div
                  key={factory.id}
                  className={cn(
                    'relative rounded-lg border border-[#0e2a5c] bg-gradient-to-b from-[#071a3e]/80 via-[#04112c]/90 to-[#020b1e]/95 p-2 flex flex-col h-[225px] shrink-0 transition-all hover:border-[#00f0ff]/70 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] group',
                    currentFactories.length === 1 && 'col-span-2'
                  )}
                >
                  <div className="absolute top-0 left-0 size-1.5 border-t border-l border-[#00d2ff]/60" />
                  <div className="absolute top-0 right-0 size-1.5 border-t border-r border-[#00d2ff]/60" />

                  {/* 卡片头部：工厂名称、未接入徽标、实际得分与国标要求差距 */}
                  <div className="flex items-center justify-between border-b border-[#0e2a5c]/80 pb-1.5 mb-0.5">
                    <span className="font-bold text-slate-100 text-xs truncate flex items-center gap-1.5 min-w-0 pr-1.5" title={factory.factoryName}>
                      <Building2 className={cn('size-3.5 shrink-0', factory.unconnected ? 'text-slate-500' : 'text-cyan-400')} />
                      <span className={cn('truncate', factory.unconnected ? 'text-slate-400' : 'text-slate-100')}>{factory.factoryName}</span>
                      {factory.unconnected && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950/40 text-amber-400 border border-amber-500/40 shrink-0">
                          未接入
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                      <div className="px-1.5 py-0.5 rounded bg-[#03091e]/80 border border-[#0e2a5c]">
                        <span className="text-slate-400">实测:</span>
                        <span className="font-black text-cyan-300 ml-0.5">{factory.overallScore}</span>
                      </div>
                      <div className={cn(
                        'px-1.5 py-0.5 rounded border font-bold shadow-xs',
                        isPassing
                          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                          : 'bg-amber-950/50 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                      )}>
                        {isPassing ? `+${diffScore.toFixed(1)}` : diffScore.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* 工厂 6 维雷达图 (国标基准 vs 当前状态 双层直观呈现) */}
                  <div className="flex-1 min-h-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        data={factory.radarData}
                      >
                        <PolarGrid stroke="rgba(0, 210, 255, 0.22)" strokeDasharray="3 3" />
                        <PolarAngleAxis
                          dataKey="dimension"
                          tick={{ fill: '#e2e8f0', fontSize: 8.5, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload as FactoryRadarItem
                              const dimDiff = d.score - d.benchmark
                              return (
                                <div className="rounded-md border border-[#0e2a5c] bg-[#0b1528]/95 p-2 shadow-xl text-[10.5px]">
                                  <div className="text-white font-bold mb-1 border-b border-[#0e2a5c] pb-0.5">
                                    {d.dimension}
                                  </div>
                                  <div className="flex items-center justify-between gap-3 text-slate-300">
                                    <span className="flex items-center gap-1 text-cyan-300">
                                      <span className="size-1.5 rounded-full bg-cyan-400" />
                                      工厂实际:
                                    </span>
                                    <span className="font-mono font-bold text-cyan-300">{d.score} 分</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3 text-slate-300">
                                    <span className="flex items-center gap-1 text-amber-400">
                                      <span className="size-1.5 rounded-full bg-amber-400" />
                                      国标基准:
                                    </span>
                                    <span className="font-mono font-bold text-amber-400">{d.benchmark} 分</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3 text-slate-300 pt-0.5 border-t border-[#0e2a5c]/60 mt-0.5">
                                    <span>要求差距:</span>
                                    <span
                                      className={cn(
                                        'font-mono font-bold',
                                        dimDiff >= 0 ? 'text-emerald-400' : 'text-amber-400'
                                      )}
                                    >
                                      {dimDiff >= 0 ? `+${dimDiff}` : dimDiff} 分
                                    </span>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        {/* 1. 国标零碳基准多边形 (金黄色虚线) */}
                        <Radar
                          name="国标零碳基准"
                          dataKey="benchmark"
                          stroke="#f59e0b"
                          strokeDasharray="4 3"
                          fill="#f59e0b"
                          fillOpacity={0.08}
                          strokeWidth={2}
                          dot={{ r: 2.2, fill: '#f59e0b' }}
                          isAnimationActive={false}
                        />
                        {/* 2. 工厂当前状态多边形 (科技蓝实线) */}
                        <Radar
                          name="当前工厂状态"
                          dataKey="score"
                          stroke="#00f0ff"
                          fill="#00f0ff"
                          fillOpacity={0.28}
                          strokeWidth={2.2}
                          dot={{ r: 2.5, fill: '#ffffff', stroke: '#00f0ff', strokeWidth: 1.5 }}
                          isAnimationActive={false}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 底部指标精炼徽章 */}
                  <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-[#0e2a5c]/80 text-[9px] font-mono">
                    <div className="truncate text-slate-400 px-1 py-0.5 rounded bg-[#02091c]/60 text-center">
                      国标: <span className="text-amber-300 font-bold">{factory.benchmarkScore}</span>
                    </div>
                    <div className="truncate text-slate-400 text-center px-1 py-0.5 rounded bg-[#02091c]/60">
                      数采率: <span className="text-emerald-400 font-bold">{factory.autoCollectRate}%</span>
                    </div>
                    <div className="truncate text-slate-400 text-center px-1 py-0.5 rounded bg-[#02091c]/60">
                      非化石: <span className="text-cyan-400 font-bold">{factory.nonFossilRate}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 底部雷达图规范说明栏 */}
          <div className="pt-2 mt-1 border-t border-[#0e2a5c] flex items-center justify-between text-[10px] text-slate-400 shrink-0 font-mono px-1">
            <span className="text-slate-400">
              国标要求: <span className="text-slate-300">低碳90</span> | <span className="text-slate-300">脱碳90</span> | <span className="text-slate-300">绿电92</span> | <span className="text-slate-300">数采95</span> | <span className="text-slate-300">供应链85</span> | <span className="text-slate-300">披露90</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/50 text-amber-300 border border-amber-500/40 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.35)]">
              综合零碳门槛: ≥90.0分
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}

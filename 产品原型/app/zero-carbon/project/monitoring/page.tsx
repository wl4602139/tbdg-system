'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Sun,
  BatteryCharging,
  Flame,
  Activity,
  Calendar,
  Download,
  CheckCircle2,
  TrendingUp,
  Zap,
  Coins,
  ArrowUpRight,
  Filter,
  Gauge,
  Thermometer,
  Sliders,
  Radio,
  ArrowDownRight,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { CollapsibleProjectBar } from '@/components/shared/collapsible-project-bar'
import { cn } from '@/lib/utils'

// =========================================================================
// 1. 光伏实时监测数据模型
// =========================================================================
export interface PvMonitoringItem {
  id: string
  time: string // 时间 (如 2026-08-28)
  park: string
  company: string
  projectName: string
  stationGroup?: string // 所属光伏电站/项目组 (如 '沈变厂区分布式光伏')
  phase?: string // 期次 (如 '一期', '二期')
  capacity: string // 如 12.8 MWp
  powerKw: number // 实时发电功率 (kW)
  dailyGenKwh: number // 日发电量 (kWh)
  selfUseKwh: number // 消纳电量 (kWh)
  gridKwh: number // 上网电量 (kWh)
  selfRevenueYuan: number // 自消纳收益 (元)
  gridRevenueYuan: number // 上网收益 (元)
  totalRevenueYuan: number // 综合日收益 (元)
  selfUseRatio: number // 消纳比例 (%)
  status: '正常发电' | '逆变待机' | '限电限发'
}

// =========================================================================
// 2. 储能实时监测数据模型
// =========================================================================
export interface StorageMonitoringItem {
  id: string
  time: string // 时间 (如 2026-08-28)
  park: string
  company: string
  projectName: string
  capacity: string // 如 6MW / 12MWh
  ratedPowerKw: number // 功率 / 额定功率 (kW)
  chargeDischargePowerKw: number // 充放电功率 (kW, 正数充电，负数放电)
  chargeKwh: number // 充电量 (kWh)
  dischargeKwh: number // 放电量 (kWh)
  soc: number // SOC 荷电状态 (%)
  status: '充电' | '放电' | '待机' // 状态(充/放)
  revenueYuan: number // 收益(按日) (元)
  efficiency: number // 综合效率(日) (%)
  gridChargeRatio: number // 市充占比 (%)
  greenChargeRatio: number // 绿充占比 (%)
  criticalPeakDischargeRatio: number // 尖放占比 (%)
  peakDischargeRatio: number // 峰放占比 (%)
}

// =========================================================================
// 3. 热泵实时监测数据模型
// =========================================================================
export interface HeatPumpMonitoringItem {
  id: string
  time: string // 时间 (如 2026-08-28)
  park: string
  company: string
  projectName: string
  capacity: string // 如 2.5 MW (制热功率)
  cop: number // COP (能效比)
  supplyTemp: number // 供水温度 (℃)
  returnTemp: number // 回水温度 (℃)
  heatOutputGj: number // 制热量 (GJ)
  powerConsumptionKwh: number // 耗电量 (kWh)
  powerKw: number // 功率 (kW)
  pressureMpa: number // 压力 (MPa)
  greenPowerRatio: number // 绿电占比 (%)
  peakRatio: number // 尖/峰占比 (%)
  savingsYuan: number // 收益 (元, 替代天然气节费)
  status: '正常供热' | '变频稳压' | '低负荷保温'
}
// =========================================================================
// 4. 空调实时监测数据模型
// =========================================================================
export interface HvacMonitoringItem {
  id: string
  time: string // 时间 (如 2026-08-28)
  park: string
  company: string
  projectName: string
  capacity: string // 如 4,200 kW (1,200 RT)
  cop: number // COP (能效比)
  supplyTemp: number // 供水温度 (℃)
  returnTemp: number // 回水温度 (℃)
  coolingOutputGj: number // 制冷量 (GJ)
  powerConsumptionKwh: number // 耗电量 (kWh)
  powerKw: number // 功率 (kW)
  pressureMpa: number // 压力 (MPa)
  greenPowerRatio: number // 绿电占比 (%)
  peakRatio: number // 尖/峰占比 (%)
  savingsYuan: number // 收益 (元, 高效节费)
  status: '正常供冷' | '变频稳压' | '低负荷保温'
}


// =========================================================================
// Mock 数据集：光伏监测数据
// =========================================================================
const MOCK_PV_DATA: PvMonitoringItem[] = [
  // --- 1. 沈变本部 12.8MWp 屋顶分布式光伏一期 ---
  {
    id: 'pv-01',
    time: '2026-08-28',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    projectName: '沈变本部 12.8MWp 屋顶分布式光伏一期',
    phase: '一期',
    capacity: '12.8 MWp',
    powerKw: 8640.5,
    dailyGenKwh: 48520.0,
    selfUseKwh: 44832.5,
    gridKwh: 3687.5,
    selfRevenueYuan: 32503.6,
    gridRevenueYuan: 1401.3,
    totalRevenueYuan: 33904.9,
    selfUseRatio: 92.4,
    status: '正常发电',
  },
  // --- 2. 和新套管 3.2MWp 厂区连跨屋顶分布式光伏二期 ---
  {
    id: 'pv-08',
    time: '2026-08-28',
    park: '特变电工东北输变电产业园',
    company: '和新套管',
    projectName: '和新套管 3.2MWp 厂区连跨屋顶分布式光伏二期',
    phase: '二期',
    capacity: '3.2 MWp',
    powerKw: 2160.0,
    dailyGenKwh: 12150.0,
    selfUseKwh: 11190.2,
    gridKwh: 959.8,
    selfRevenueYuan: 8112.9,
    gridRevenueYuan: 364.7,
    totalRevenueYuan: 8477.6,
    selfUseRatio: 92.1,
    status: '正常发电',
  },
  // --- 3. 衡变本部 10.5MWp 厂房屋顶及车棚分布式光伏项目 ---
  {
    id: 'pv-02',
    time: '2026-08-28',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    projectName: '衡变本部 10.5MWp 厂房屋顶及车棚分布式光伏项目',
    capacity: '10.5 MWp',
    powerKw: 7250.0,
    dailyGenKwh: 41200.0,
    selfUseKwh: 37904.0,
    gridKwh: 3296.0,
    selfRevenueYuan: 28049.0,
    gridRevenueYuan: 1252.5,
    totalRevenueYuan: 29301.5,
    selfUseRatio: 92.0,
    status: '正常发电',
  },
  // --- 4. 鲁缆公司 8.6MWp BAPV 连跨厂房光伏电站 ---
  {
    id: 'pv-03',
    time: '2026-08-28',
    park: '特变电工山东线缆产业园',
    company: '鲁缆公司',
    projectName: '鲁缆公司 8.6MWp BAPV 连跨厂房光伏电站',
    capacity: '8.6 MWp',
    powerKw: 5840.0,
    dailyGenKwh: 33600.0,
    selfUseKwh: 30408.0,
    gridKwh: 3192.0,
    selfRevenueYuan: 22197.8,
    gridRevenueYuan: 1213.0,
    totalRevenueYuan: 23410.8,
    selfUseRatio: 90.5,
    status: '正常发电',
  },
  // --- 5. 新变超高压基地 13.9MWp 智能微网分布式光伏电站 ---
  {
    id: 'pv-04',
    time: '2026-08-28',
    park: '特变电工超高压智能制造基地',
    company: '超高压公司',
    projectName: '新变超高压基地 13.9MWp 智能微网分布式光伏电站',
    capacity: '13.9 MWp',
    powerKw: 9850.0,
    dailyGenKwh: 58600.0,
    selfUseKwh: 54498.0,
    gridKwh: 4102.0,
    selfRevenueYuan: 38148.6,
    gridRevenueYuan: 1558.8,
    totalRevenueYuan: 39707.4,
    selfUseRatio: 93.0,
    status: '正常发电',
  },
  // --- 6. 德缆产业园 6.2MWp 屋顶柔性支架分布式光伏 ---
  {
    id: 'pv-05',
    time: '2026-08-28',
    park: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    projectName: '德缆产业园 6.2MWp 屋顶柔性支架分布式光伏',
    capacity: '6.2 MWp',
    powerKw: 4280.0,
    dailyGenKwh: 24800.0,
    selfUseKwh: 22617.6,
    gridKwh: 2182.4,
    selfRevenueYuan: 16850.1,
    gridRevenueYuan: 829.3,
    totalRevenueYuan: 17679.4,
    selfUseRatio: 91.2,
    status: '正常发电',
  },
  // --- 7. 西变智能装备产业园 7.5MWp 厂房连跨分布式光伏 ---
  {
    id: 'pv-06',
    time: '2026-08-28',
    park: '特变电工西安变压器产业园',
    company: '西变装备',
    projectName: '西变智能装备产业园 7.5MWp 厂房连跨分布式光伏',
    capacity: '7.5 MWp',
    powerKw: 5180.0,
    dailyGenKwh: 29500.0,
    selfUseKwh: 27081.0,
    gridKwh: 2419.0,
    selfRevenueYuan: 19904.5,
    gridRevenueYuan: 919.2,
    totalRevenueYuan: 20823.7,
    selfUseRatio: 91.8,
    status: '正常发电',
  },
  // --- 8. 天变产业园 5.0MWp BIPV 绿色建筑一体化光伏 ---
  {
    id: 'pv-07',
    time: '2026-08-28',
    park: '特变电工天变产业园',
    company: '天变公司',
    projectName: '天变产业园 5.0MWp BIPV 绿色建筑一体化光伏',
    capacity: '5.0 MWp',
    powerKw: 3450.0,
    dailyGenKwh: 19800.0,
    selfUseKwh: 17978.4,
    gridKwh: 1821.6,
    selfRevenueYuan: 13124.2,
    gridRevenueYuan: 692.2,
    totalRevenueYuan: 13816.4,
    selfUseRatio: 90.8,
    status: '正常发电',
  },
  // --- 历史时序对照 (2026-08-27) ---
  {
    id: 'pv-01-d27',
    time: '2026-08-27',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    projectName: '沈变本部 12.8MWp 屋顶分布式光伏一期',
    phase: '一期',
    capacity: '12.8 MWp',
    powerKw: 8420.0,
    dailyGenKwh: 47600.0,
    selfUseKwh: 43982.4,
    gridKwh: 3617.6,
    selfRevenueYuan: 31887.2,
    gridRevenueYuan: 1374.7,
    totalRevenueYuan: 33261.9,
    selfUseRatio: 92.4,
    status: '正常发电',
  },
  {
    id: 'pv-02-d27',
    time: '2026-08-27',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    projectName: '衡变本部 10.5MWp 厂房屋顶及车棚分布式光伏项目',
    capacity: '10.5 MWp',
    powerKw: 7100.0,
    dailyGenKwh: 40500.0,
    selfUseKwh: 37260.0,
    gridKwh: 3240.0,
    selfRevenueYuan: 27572.4,
    gridRevenueYuan: 1231.2,
    totalRevenueYuan: 28803.6,
    selfUseRatio: 92.0,
    status: '正常发电',
  },
  {
    id: 'pv-04-d27',
    time: '2026-08-27',
    park: '特变电工超高压智能制造基地',
    company: '超高压公司',
    projectName: '新变超高压基地 13.9MWp 智能微网分布式光伏电站',
    capacity: '13.9 MWp',
    powerKw: 9680.0,
    dailyGenKwh: 57800.0,
    selfUseKwh: 53754.0,
    gridKwh: 4046.0,
    selfRevenueYuan: 37627.8,
    gridRevenueYuan: 1537.5,
    totalRevenueYuan: 39165.3,
    selfUseRatio: 93.0,
    status: '正常发电',
  },
]

// =========================================================================
// Mock 数据集：储能监测数据
// =========================================================================
const MOCK_STORAGE_DATA: StorageMonitoringItem[] = [
  {
    id: 'st-01',
    time: '2026-08-28',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    projectName: '衡变公司 6MW/12MWh 磷酸铁锂用户侧储能电站',
    capacity: '6MW / 12MWh',
    ratedPowerKw: 6000.0,
    chargeDischargePowerKw: -3120.0, // 负数代表放电中
    chargeKwh: 12450.0,
    dischargeKwh: 10831.5,
    soc: 78.5,
    status: '放电',
    revenueYuan: 8420.5,
    efficiency: 87.0,
    gridChargeRatio: 28.5,
    greenChargeRatio: 71.5,
    criticalPeakDischargeRatio: 62.0,
    peakDischargeRatio: 38.0,
  },
  {
    id: 'st-02',
    time: '2026-08-28',
    park: '特变电工山东线缆产业园',
    company: '鲁缆公司',
    projectName: '鲁缆公司 3MW/6MWh 智慧储能调峰电站',
    capacity: '3MW / 6MWh',
    ratedPowerKw: 3000.0,
    chargeDischargePowerKw: 1850.0, // 正数代表充电中
    chargeKwh: 6200.0,
    dischargeKwh: 5394.0,
    soc: 84.0,
    status: '充电',
    revenueYuan: 4150.0,
    efficiency: 87.0,
    gridChargeRatio: 32.0,
    greenChargeRatio: 68.0,
    criticalPeakDischargeRatio: 58.0,
    peakDischargeRatio: 42.0,
  },
  {
    id: 'st-03',
    time: '2026-08-28',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    projectName: '沈变本部 5MW/10MWh 零碳工业储能电站',
    capacity: '5MW / 10MWh',
    ratedPowerKw: 5000.0,
    chargeDischargePowerKw: -2640.0,
    chargeKwh: 10500.0,
    dischargeKwh: 9187.5,
    soc: 62.0,
    status: '放电',
    revenueYuan: 7120.0,
    efficiency: 87.5,
    gridChargeRatio: 24.0,
    greenChargeRatio: 76.0,
    criticalPeakDischargeRatio: 60.0,
    peakDischargeRatio: 40.0,
  },
  {
    id: 'st-04',
    time: '2026-08-28',
    park: '特变电工超高压智能制造基地',
    company: '超高压公司',
    projectName: '新变厂超高压 4MW/8MWh 调频储能电站',
    capacity: '4MW / 8MWh',
    ratedPowerKw: 4000.0,
    chargeDischargePowerKw: 0.0,
    chargeKwh: 8400.0,
    dischargeKwh: 7291.2,
    soc: 91.5,
    status: '待机',
    revenueYuan: 5380.0,
    efficiency: 86.8,
    gridChargeRatio: 19.0,
    greenChargeRatio: 81.0,
    criticalPeakDischargeRatio: 64.0,
    peakDischargeRatio: 36.0,
  },
  {
    id: 'st-01-d27',
    time: '2026-08-27',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    projectName: '衡变公司 6MW/12MWh 磷酸铁锂用户侧储能电站',
    capacity: '6MW / 12MWh',
    ratedPowerKw: 6000.0,
    chargeDischargePowerKw: -2980.0,
    chargeKwh: 12200.0,
    dischargeKwh: 10580.0,
    soc: 76.0,
    status: '放电',
    revenueYuan: 8150.0,
    efficiency: 86.7,
    gridChargeRatio: 30.0,
    greenChargeRatio: 70.0,
    criticalPeakDischargeRatio: 60.5,
    peakDischargeRatio: 39.5,
  },
]

// =========================================================================
// Mock 数据集：热泵监测数据
// =========================================================================
const MOCK_HEAT_PUMP_DATA: HeatPumpMonitoringItem[] = [
  {
    id: 'hp-01',
    time: '2026-08-28',
    park: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    projectName: '德缆产业园 2.5MW 高温工业水源热泵系统',
    capacity: '2.5 MW (制热量)',
    cop: 3.85,
    supplyTemp: 68.5,
    returnTemp: 52.0,
    heatOutputGj: 207.9,
    powerConsumptionKwh: 15000.0,
    powerKw: 1480.0,
    pressureMpa: 1.25,
    greenPowerRatio: 72.0,
    peakRatio: 24.5,
    savingsYuan: 6184.0,
    status: '正常供热',
  },
  {
    id: 'hp-02',
    time: '2026-08-28',
    park: '特变电工天变产业园',
    company: '天变公司',
    projectName: '天变公司 1.8MW 真空干燥罐冷凝余热梯级利用改造',
    capacity: '1.8 MW (制热量)',
    cop: 4.12,
    supplyTemp: 72.0,
    returnTemp: 55.5,
    heatOutputGj: 149.7,
    powerConsumptionKwh: 10100.0,
    powerKw: 1020.0,
    pressureMpa: 1.32,
    greenPowerRatio: 78.5,
    peakRatio: 18.0,
    savingsYuan: 4720.0,
    status: '正常供热',
  },
  {
    id: 'hp-03',
    time: '2026-08-28',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    projectName: '沈变本部 3.2MW 地源/工业中温热泵机组',
    capacity: '3.2 MW (制热量)',
    cop: 3.65,
    supplyTemp: 65.0,
    returnTemp: 48.0,
    heatOutputGj: 266.1,
    powerConsumptionKwh: 20250.0,
    powerKw: 1850.0,
    pressureMpa: 1.18,
    greenPowerRatio: 65.0,
    peakRatio: 30.0,
    savingsYuan: 7650.0,
    status: '正常供热',
  },
  {
    id: 'hp-04',
    time: '2026-08-28',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    projectName: '衡变本部 2.0MW 空气源跨临界CO₂热泵采暖系统',
    capacity: '2.0 MW (制热量)',
    cop: 3.90,
    supplyTemp: 70.0,
    returnTemp: 50.0,
    heatOutputGj: 166.3,
    powerConsumptionKwh: 11850.0,
    powerKw: 1150.0,
    pressureMpa: 1.28,
    greenPowerRatio: 75.0,
    peakRatio: 21.0,
    savingsYuan: 5120.0,
    status: '正常供热',
  },
  {
    id: 'hp-01-d27',
    time: '2026-08-27',
    park: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    projectName: '德缆产业园 2.5MW 高温工业水源热泵系统',
    capacity: '2.5 MW (制热量)',
    cop: 3.82,
    supplyTemp: 68.0,
    returnTemp: 51.5,
    heatOutputGj: 204.5,
    powerConsumptionKwh: 14800.0,
    powerKw: 1460.0,
    pressureMpa: 1.24,
    greenPowerRatio: 71.5,
    peakRatio: 25.0,
    savingsYuan: 6050.0,
    status: '变频稳压',
  },
]

// =========================================================================
// Mock 数据集：空调监测数据
// =========================================================================
const MOCK_HVAC_DATA: HvacMonitoringItem[] = [
  {
    id: 'hvac-01',
    time: '2026-08-28',
    park: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    projectName: '德缆产业园 3.2MW 变频高效冷站系统',
    capacity: '3,200 kW (910 RT)',
    cop: 4.38,
    supplyTemp: 7.0,
    returnTemp: 12.0,
    coolingOutputGj: 245.6,
    powerConsumptionKwh: 15600.0,
    powerKw: 1420.0,
    pressureMpa: 0.46,
    greenPowerRatio: 76.5,
    peakRatio: 21.0,
    savingsYuan: 5840.0,
    status: '正常供冷',
  },
  {
    id: 'hvac-02',
    time: '2026-08-28',
    park: '特变电工新疆产业园',
    company: '新变厂',
    projectName: '新疆变压器厂区 特高压干燥恒温冷站',
    capacity: '4,500 kW (1,280 RT)',
    cop: 4.22,
    supplyTemp: 7.2,
    returnTemp: 12.5,
    coolingOutputGj: 312.0,
    powerConsumptionKwh: 20500.0,
    powerKw: 1150.0,
    pressureMpa: 0.48,
    greenPowerRatio: 82.0,
    peakRatio: 19.5,
    savingsYuan: 7210.0,
    status: '正常供冷',
  },
  {
    id: 'hvac-03',
    time: '2026-08-28',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    projectName: '沈变厂区 2.0MW 磁悬浮离心冷水机组',
    capacity: '2,000 kW (570 RT)',
    cop: 4.52,
    supplyTemp: 6.8,
    returnTemp: 11.9,
    coolingOutputGj: 182.4,
    powerConsumptionKwh: 11200.0,
    powerKw: 580.0,
    pressureMpa: 0.45,
    greenPowerRatio: 68.5,
    peakRatio: 26.2,
    savingsYuan: 4120.0,
    status: '正常供冷',
  },
  {
    id: 'hvac-04',
    time: '2026-08-28',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    projectName: '衡变公司 研发大楼水冷螺杆中央空调',
    capacity: '1,200 kW (340 RT)',
    cop: 3.95,
    supplyTemp: 7.5,
    returnTemp: 12.8,
    coolingOutputGj: 120.0,
    powerConsumptionKwh: 8900.0,
    powerKw: 270.0,
    pressureMpa: 0.44,
    greenPowerRatio: 71.0,
    peakRatio: 24.5,
    savingsYuan: 2450.0,
    status: '变频稳压',
  },
  {
    id: 'hvac-01-d27',
    time: '2026-08-27',
    park: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    projectName: '德缆产业园 3.2MW 变频高效冷站系统',
    capacity: '3,200 kW (910 RT)',
    cop: 4.35,
    supplyTemp: 7.1,
    returnTemp: 12.1,
    coolingOutputGj: 241.0,
    powerConsumptionKwh: 15450.0,
    powerKw: 1410.0,
    pressureMpa: 0.46,
    greenPowerRatio: 76.0,
    peakRatio: 21.5,
    savingsYuan: 5780.0,
    status: '正常供冷',
  },
  {
    id: 'hvac-03-d27',
    time: '2026-08-27',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    projectName: '沈变厂区 2.0MW 磁悬浮离心冷水机组',
    capacity: '2,000 kW (570 RT)',
    cop: 4.50,
    supplyTemp: 6.9,
    returnTemp: 12.0,
    coolingOutputGj: 180.0,
    powerConsumptionKwh: 11100.0,
    powerKw: 575.0,
    pressureMpa: 0.45,
    greenPowerRatio: 68.0,
    peakRatio: 26.5,
    savingsYuan: 4080.0,
    status: '正常供冷',
  },
]

// 园区与直属企业关联关系映射字典
const PARK_TO_ENTERPRISES_MAP: Record<string, { id: string; name: string }[]> = {
  '特变电工东北输变电产业园': [
    { id: '沈变本部', name: '沈变本部' },
    { id: '和新套管', name: '和新套管' },
    { id: '和新套管公司', name: '和新套管公司' },
    { id: '康嘉互感器', name: '康嘉互感器' },
  ],
  '特变电工南方输变电产业园': [
    { id: '衡变本部', name: '衡变本部' },
    { id: '南京电研', name: '南京电研' },
    { id: '云集电气', name: '云集电气' },
  ],
  '特变电工新疆产业园': [
    { id: '新变厂', name: '新变厂' },
    { id: '超高压公司', name: '超高压公司' },
    { id: '新疆自控', name: '新疆自控' },
  ],
  '特变电工超高压智能制造基地': [
    { id: '超高压公司', name: '超高压公司' },
  ],
  '特变电工山东线缆产业园': [
    { id: '鲁缆公司', name: '鲁缆公司' },
    { id: '鲁缆本部', name: '鲁缆本部' },
    { id: '智缆公司', name: '智缆公司' },
  ],
  '特变电工新疆电缆产业园': [
    { id: '特变电工新疆线缆厂', name: '特变电工新疆线缆厂' },
    { id: '特变电工新疆电缆有限公司', name: '特变电工新疆电缆有限公司' },
  ],
  '特变电工(德阳)电缆园区': [
    { id: '德缆公司', name: '德缆公司' },
    { id: '特变电工（德阳）电缆股份有限公司', name: '特变电工（德阳）电缆股份有限公司' },
  ],
  '特变电工西安变压器产业园': [
    { id: '西变装备', name: '西变装备' },
  ],
  '特变电工天变产业园': [
    { id: '天变公司', name: '天变公司' },
    { id: '天变天津基地', name: '天变天津基地' },
  ],
  '特变电工华东输变电科技产业园': [
    { id: '鲁缆本部', name: '鲁缆本部' },
    { id: '智缆公司', name: '智缆公司' },
  ],
}

export default function RealtimeMonitoringPage() {
  // 1. 分类选择：光伏 / 储能 / 热泵 (默认光伏)
  const [categoryFilter, setCategoryFilter] = useState<'光伏' | '储能' | '热泵' | '空调'>('光伏')

  // 2. 园区与企业过滤
  const [parkFilter, setParkFilter] = useState<string>('all')
  const [companyFilter, setCompanyFilter] = useState<string>('all')

  // 3. 时间维度与日期范围：'day' (日) | 'month' (月) | 'custom' (自定义) (光伏模块默认'month')
  const [timeDim, setTimeDim] = useState<'day' | 'month' | 'custom'>('month')
  const [selectedDate, setSelectedDate] = useState('2026-08-28')
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [dateRange, setDateRange] = useState({ start: '2026-08-01', end: '2026-08-28' })

  // 辅助函数：计算两日期相差天数
  const getDaysDiff = (d1: string, d2: string) => {
    const t1 = new Date(d1).getTime()
    const t2 = new Date(d2).getTime()
    return Math.round(Math.abs(t2 - t1) / (1000 * 60 * 60 * 24)) + 1
  }

  // 辅助函数：给定起始日期加 N 天生成合法日期字符串
  const addDays = (dStr: string, days: number) => {
    const d = new Date(dStr)
    d.setDate(d.getDate() + days)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  // 自定义区间起止日期处理 (严格限制跨度 ≤ 30 天)
  const handleCustomStartDateChange = (newStart: string) => {
    let newEnd = dateRange.end
    if (newStart > newEnd) {
      newEnd = newStart
    } else {
      const diff = getDaysDiff(newStart, newEnd)
      if (diff > 30) {
        newEnd = addDays(newStart, 29)
      }
    }
    setDateRange({ start: newStart, end: newEnd })
  }

  const handleCustomEndDateChange = (newEnd: string) => {
    let newStart = dateRange.start
    if (newEnd < newStart) {
      newStart = newEnd
    } else {
      const diff = getDaysDiff(newStart, newEnd)
      if (diff > 30) {
        newStart = addDays(newEnd, -29)
      }
    }
    setDateRange({ start: newStart, end: newEnd })
  }

  // 4. 左侧组织树选中节点
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'park_root',
    name: '特变电工集团',
    fullName: '特变电工电装集团 (15 零碳园区)',
    level: 'group',
  })

  // 5. 搜索关键字
  const [searchKw, setSearchKw] = useState('')

  // 动态关联计算：当前选定园区下的可用企业列表
  const availableCompanies = useMemo(() => {
    if (parkFilter === 'all') return null
    return PARK_TO_ENTERPRISES_MAP[parkFilter] || []
  }, [parkFilter])

  // 园区下拉切换
  const handleParkChange = (newPark: string) => {
    setParkFilter(newPark)
    if (newPark === 'all') {
      setSelectedNode({
        id: 'park_root',
        name: '特变电工集团',
        fullName: '特变电工电装集团 (15 零碳园区)',
        level: 'group',
      })
    } else {
      setSelectedNode({
        id: 'park_selected',
        name: newPark,
        fullName: newPark,
        level: 'park',
      })
      const comps = PARK_TO_ENTERPRISES_MAP[newPark] || []
      const isValid = comps.some((c) => c.name === companyFilter)
      if (!isValid) {
        setCompanyFilter('all')
      }
    }
  }

  // 企业下拉切换
  const handleCompanyChange = (newCompany: string) => {
    setCompanyFilter(newCompany)
    if (newCompany !== 'all') {
      for (const [pName, comps] of Object.entries(PARK_TO_ENTERPRISES_MAP)) {
        if (comps.some((c) => c.name === newCompany || newCompany.includes(c.name))) {
          if (parkFilter === 'all') {
            setParkFilter(pName)
          }
          break
        }
      }
      setSelectedNode({
        id: 'comp_selected',
        name: newCompany,
        fullName: newCompany,
        level: 'company',
      })
    }
  }

  // 通用过滤逻辑辅助函数
  const matchOrg = (itemPark: string, itemCompany: string) => {
    if (parkFilter !== 'all') {
      if (!itemPark.includes(parkFilter) && !parkFilter.includes(itemPark)) return false
    }
    if (companyFilter !== 'all') {
      if (!itemCompany.includes(companyFilter) && !companyFilter.includes(itemCompany)) return false
    }
    if (selectedNode.id !== 'park_root' && selectedNode.level !== 'group') {
      if (selectedNode.level === 'park') {
        const matchPark =
          itemPark.includes(selectedNode.name) ||
          selectedNode.name.includes(itemPark) ||
          (selectedNode.fullName && itemPark.includes(selectedNode.fullName))
        if (!matchPark) return false
      } else if (selectedNode.level === 'workshop' || selectedNode.level === 'company') {
        const cleanKey = selectedNode.name.replace('公司', '').replace('厂', '').replace('本部', '')
        const matchComp =
          itemCompany === selectedNode.name ||
          itemCompany.includes(selectedNode.name) ||
          itemCompany.includes(cleanKey) ||
          selectedNode.name.includes(itemCompany)
        if (!matchComp) return false
      }
    }
    return true
  }

  // 6. 当前监控模块与当前组织下的有效项目列表 (展示项目名称，首项支持全部叠加，100% 对齐项目运行评估)
  const currentProjectList = useMemo(() => {
    const list: Array<{
      id: string
      name: string
      displayName: string
      fullName: string
    }> = []

    let sourceData: Array<{ id: string; projectName: string; park: string; company: string }> = []
    if (categoryFilter === '光伏') sourceData = MOCK_PV_DATA
    else if (categoryFilter === '储能') sourceData = MOCK_STORAGE_DATA
    else if (categoryFilter === '热泵') sourceData = MOCK_HEAT_PUMP_DATA
    else if (categoryFilter === '空调') sourceData = MOCK_HVAC_DATA

    const matched = sourceData.filter((item) => matchOrg(item.park, item.company))
    const baseList = matched.length > 0 ? matched : sourceData

    // 第一项：全部 (多个项目叠加)
    list.push({
      id: `${categoryFilter}-all`,
      name: '全部 (多个项目叠加)',
      displayName: '全部 (多个项目叠加)',
      fullName: '全部 (多个项目叠加)',
    })

    const seen = new Set<string>()
    for (const item of baseList) {
      if (!seen.has(item.projectName)) {
        seen.add(item.projectName)
        list.push({
          id: item.id,
          name: item.projectName,
          displayName: item.projectName,
          fullName: item.projectName,
        })
      }
    }
    return list
  }, [categoryFilter, selectedNode, parkFilter, companyFilter])

  // 当前选中的项目名称
  const [selectedProjectName, setSelectedProjectName] = useState<string>('全部 (多个项目叠加)')

  // 🌟 光伏专属：期次切换状态 ('ALL' | '一期' | '二期')
  const [selectedPvPhase, setSelectedPvPhase] = useState<string>('ALL')

  // 🌟 光伏专属：图表内标签切换状态 ('energy' | 'revenue')
  const [pvChartSubTab, setPvChartSubTab] = useState<'energy' | 'revenue'>('energy')

  // 当项目列表更新（如切换分类或组织节点）时，自适应校准选中的项目
  useEffect(() => {
    if (currentProjectList.length > 0) {
      if (!currentProjectList.some((p) => p.name === selectedProjectName)) {
        setSelectedProjectName(currentProjectList[0].name)
        setSelectedPvPhase('ALL')
      }
    } else {
      setSelectedProjectName('')
      setSelectedPvPhase('ALL')
    }
  }, [currentProjectList, selectedProjectName])

  // 🌟 可缩放交互时间轴滑动区间状态 (支持各模块双图联动缩放与平移)
  const [pvBrushRange, setPvBrushRange] = useState<{ startIndex?: number; endIndex?: number }>({})
  const [storageBrushRange, setStorageBrushRange] = useState<{ startIndex?: number; endIndex?: number }>({})
  const [heatPumpBrushRange, setHeatPumpBrushRange] = useState<{ startIndex?: number; endIndex?: number }>({})
  const [hvacBrushRange, setHvacBrushRange] = useState<{ startIndex?: number; endIndex?: number }>({})

  // 切换时间维度、选定日期、模块分类、项目或期次时，重置时间轴缩放区间至全景
  useEffect(() => {
    setPvBrushRange({})
    setStorageBrushRange({})
    setHeatPumpBrushRange({})
    setHvacBrushRange({})
  }, [timeDim, categoryFilter, selectedProjectName, selectedPvPhase, selectedDate, selectedMonth])

  // 1. 过滤光伏数据
  const filteredPvData = useMemo(() => {
    return MOCK_PV_DATA.filter((item) => {
      if (categoryFilter !== '光伏') return false
      // 组织架构匹配
      if (!matchOrg(item.park, item.company)) return false

      // 项目筛选
      if (selectedProjectName && !selectedProjectName.includes('全部') && selectedProjectName !== 'ALL') {
        if (item.projectName !== selectedProjectName) return false
      }

      // 时间筛选
      if (timeDim === 'day') {
        if (selectedDate && item.time !== selectedDate) {
          const hasDayData = MOCK_PV_DATA.some(
            (d) =>
              d.time === selectedDate &&
              (!selectedProjectName ||
                selectedProjectName.includes('全部') ||
                d.projectName === selectedProjectName),
          )
          if (hasDayData) return false
          if (item.time !== '2026-08-28') return false
        }
      } else if (timeDim === 'month') {
        if (selectedMonth && !item.time.startsWith(selectedMonth)) return false
      } else if (timeDim === 'custom') {
        if (dateRange.start && item.time < dateRange.start) return false
        if (dateRange.end && item.time > dateRange.end) return false
      }

      if (searchKw.trim()) {
        const kw = searchKw.toLowerCase()
        return (
          item.projectName.toLowerCase().includes(kw) ||
          item.company.toLowerCase().includes(kw) ||
          item.park.toLowerCase().includes(kw) ||
          item.time.includes(kw)
        )
      }
      return true
    })
  }, [categoryFilter, selectedProjectName, selectedPvPhase, timeDim, selectedDate, selectedMonth, dateRange, parkFilter, companyFilter, selectedNode, searchKw])

  // 2. 过滤储能数据
  const filteredStorageData = useMemo(() => {
    return MOCK_STORAGE_DATA.filter((item) => {
      if (categoryFilter !== '储能') return false
      if (selectedProjectName && !selectedProjectName.includes('全部') && selectedProjectName !== 'ALL' && item.projectName !== selectedProjectName) return false
      if (timeDim === 'day') {
        if (selectedDate && item.time !== selectedDate) {
          const hasDayData = MOCK_STORAGE_DATA.some(
            (d) => d.time === selectedDate && (!selectedProjectName || selectedProjectName.includes('全部') || d.projectName === selectedProjectName),
          )
          if (hasDayData) return false
          if (item.time !== '2026-08-28') return false
        }
      } else if (timeDim === 'month') {
        if (selectedMonth && !item.time.startsWith(selectedMonth)) return false
      } else if (timeDim === 'custom') {
        if (dateRange.start && item.time < dateRange.start) return false
        if (dateRange.end && item.time > dateRange.end) return false
      }
      if (!matchOrg(item.park, item.company)) return false
      if (searchKw.trim()) {
        const kw = searchKw.toLowerCase()
        return (
          item.projectName.toLowerCase().includes(kw) ||
          item.company.toLowerCase().includes(kw) ||
          item.park.toLowerCase().includes(kw) ||
          item.time.includes(kw)
        )
      }
      return true
    })
  }, [categoryFilter, selectedProjectName, timeDim, selectedDate, selectedMonth, dateRange, parkFilter, companyFilter, selectedNode, searchKw])

  // 3. 过滤热泵数据
  const filteredHeatPumpData = useMemo(() => {
    return MOCK_HEAT_PUMP_DATA.filter((item) => {
      if (categoryFilter !== '热泵') return false
      if (selectedProjectName && !selectedProjectName.includes('全部') && selectedProjectName !== 'ALL' && item.projectName !== selectedProjectName) return false
      if (timeDim === 'day') {
        if (selectedDate && item.time !== selectedDate) {
          const hasDayData = MOCK_HEAT_PUMP_DATA.some(
            (d) => d.time === selectedDate && (!selectedProjectName || selectedProjectName.includes('全部') || d.projectName === selectedProjectName),
          )
          if (hasDayData) return false
          if (item.time !== '2026-08-28') return false
        }
      } else if (timeDim === 'month') {
        if (selectedMonth && !item.time.startsWith(selectedMonth)) return false
      } else if (timeDim === 'custom') {
        if (dateRange.start && item.time < dateRange.start) return false
        if (dateRange.end && item.time > dateRange.end) return false
      }
      if (!matchOrg(item.park, item.company)) return false
      if (searchKw.trim()) {
        const kw = searchKw.toLowerCase()
        return (
          item.projectName.toLowerCase().includes(kw) ||
          item.company.toLowerCase().includes(kw) ||
          item.park.toLowerCase().includes(kw) ||
          item.time.includes(kw)
        )
      }
      return true
    })
  }, [categoryFilter, selectedProjectName, timeDim, selectedDate, selectedMonth, dateRange, parkFilter, companyFilter, selectedNode, searchKw])

  // 4. 过滤空调数据
  const filteredHvacData = useMemo(() => {
    return MOCK_HVAC_DATA.filter((item) => {
      if (categoryFilter !== '空调') return false
      if (selectedProjectName && !selectedProjectName.includes('全部') && selectedProjectName !== 'ALL' && item.projectName !== selectedProjectName) return false
      if (timeDim === 'day') {
        if (selectedDate && item.time !== selectedDate) {
          const hasDayData = MOCK_HVAC_DATA.some(
            (d) => d.time === selectedDate && (!selectedProjectName || selectedProjectName.includes('全部') || d.projectName === selectedProjectName),
          )
          if (hasDayData) return false
          if (item.time !== '2026-08-28') return false
        }
      } else if (timeDim === 'month') {
        if (selectedMonth && !item.time.startsWith(selectedMonth)) return false
      } else if (timeDim === 'custom') {
        if (dateRange.start && item.time < dateRange.start) return false
        if (dateRange.end && item.time > dateRange.end) return false
      }
      if (!matchOrg(item.park, item.company)) return false
      if (searchKw.trim()) {
        const kw = searchKw.toLowerCase()
        return (
          item.projectName.toLowerCase().includes(kw) ||
          item.company.toLowerCase().includes(kw) ||
          item.park.toLowerCase().includes(kw) ||
          item.time.includes(kw)
        )
      }
      return true
    })
  }, [categoryFilter, selectedProjectName, timeDim, selectedDate, selectedMonth, dateRange, parkFilter, companyFilter, selectedNode, searchKw])


  // 光伏模块统计
  const pvSummary = useMemo(() => {
    if (filteredPvData.length === 0) {
      return {
        totalPower: 0,
        totalGen: 0,
        totalSelf: 0,
        totalGrid: 0,
        totalSelfRev: 0,
        totalGridRev: 0,
        avgSelfRatio: '0.0',
      }
    }
    const totalPower = filteredPvData.reduce((acc, i) => acc + i.powerKw, 0)
    const totalGen = filteredPvData.reduce((acc, i) => acc + i.dailyGenKwh, 0)
    const totalSelf = filteredPvData.reduce((acc, i) => acc + i.selfUseKwh, 0)
    const totalGrid = filteredPvData.reduce((acc, i) => acc + i.gridKwh, 0)
    const totalSelfRev = filteredPvData.reduce((acc, i) => acc + i.selfRevenueYuan, 0)
    const totalGridRev = filteredPvData.reduce((acc, i) => acc + i.gridRevenueYuan, 0)
    const avgSelfRatio = ((totalSelf / totalGen) * 100).toFixed(1)

    return {
      totalPower: totalPower.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalGen: totalGen.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalSelf: totalSelf.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalGrid: totalGrid.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalSelfRev: totalSelfRev.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalGridRev: totalGridRev.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      avgSelfRatio,
    }
  }, [filteredPvData])

  // 储能模块统计
  const storageSummary = useMemo(() => {
    if (filteredStorageData.length === 0) {
      return {
        totalRatedPower: 0,
        totalCurrentPower: 0,
        totalCharge: 0,
        totalDischarge: 0,
        avgSoc: '0.0',
        totalRevenue: 0,
        avgEfficiency: '0.0',
        operatingStatus: '待机',
      }
    }
    const totalRatedPower = filteredStorageData.reduce((acc, i) => acc + i.ratedPowerKw, 0)
    const totalCurrentPower = filteredStorageData.reduce((acc, i) => acc + Math.abs(i.chargeDischargePowerKw), 0)
    const totalCharge = filteredStorageData.reduce((acc, i) => acc + i.chargeKwh, 0)
    const totalDischarge = filteredStorageData.reduce((acc, i) => acc + i.dischargeKwh, 0)
    const avgSoc = (filteredStorageData.reduce((acc, i) => acc + i.soc, 0) / filteredStorageData.length).toFixed(1)
    const totalRevenue = filteredStorageData.reduce((acc, i) => acc + i.revenueYuan, 0)
    const avgEfficiency = ((totalDischarge / totalCharge) * 100).toFixed(1)

    // 计算当前综合充放电运行状态
    const operatingStatus = filteredStorageData.some((i) => i.status === '放电')
      ? '放电'
      : filteredStorageData.some((i) => i.status === '充电')
      ? '充电'
      : '待机'

    return {
      totalRatedPower: totalRatedPower.toLocaleString(),
      totalCurrentPower: totalCurrentPower.toLocaleString(),
      totalCharge: totalCharge.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalDischarge: totalDischarge.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      avgSoc,
      totalRevenue: totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      avgEfficiency,
      operatingStatus,
    }
  }, [filteredStorageData])

  // 热泵模块统计
  const heatPumpSummary = useMemo(() => {
    if (filteredHeatPumpData.length === 0) {
      return {
        avgCop: '0.0',
        avgSupplyTemp: '0.0',
        avgReturnTemp: '0.0',
        totalHeat: 0,
        totalPowerKwh: 0,
        totalPowerKw: 0,
        avgGreenRatio: '0.0',
        avgPeakRatio: '0.0',
        totalSavings: 0,
      }
    }
    const avgCop = (filteredHeatPumpData.reduce((acc, i) => acc + i.cop, 0) / filteredHeatPumpData.length).toFixed(2)
    const avgSupplyTemp = (filteredHeatPumpData.reduce((acc, i) => acc + i.supplyTemp, 0) / filteredHeatPumpData.length).toFixed(1)
    const avgReturnTemp = (filteredHeatPumpData.reduce((acc, i) => acc + i.returnTemp, 0) / filteredHeatPumpData.length).toFixed(1)
    const totalHeat = filteredHeatPumpData.reduce((acc, i) => acc + i.heatOutputGj, 0).toFixed(1)
    const totalPowerKwh = filteredHeatPumpData.reduce((acc, i) => acc + i.powerConsumptionKwh, 0)
    const totalPowerKw = filteredHeatPumpData.reduce((acc, i) => acc + i.powerKw, 0)
    const avgGreenRatio = (filteredHeatPumpData.reduce((acc, i) => acc + i.greenPowerRatio, 0) / filteredHeatPumpData.length).toFixed(1)
    const avgPeakRatio = (filteredHeatPumpData.reduce((acc, i) => acc + i.peakRatio, 0) / filteredHeatPumpData.length).toFixed(1)
    const totalSavings = filteredHeatPumpData.reduce((acc, i) => acc + i.savingsYuan, 0)

    return {
      avgCop,
      avgSupplyTemp,
      avgReturnTemp,
      totalHeat,
      totalPowerKwh: totalPowerKwh.toLocaleString(),
      totalPowerKw: totalPowerKw.toLocaleString(),
      avgGreenRatio,
      avgPeakRatio,
      totalSavings: totalSavings.toLocaleString(undefined, { maximumFractionDigits: 1 }),
    }
  }, [filteredHeatPumpData])
// 空调模块统计
  const hvacSummary = useMemo(() => {
    if (filteredHvacData.length === 0) {
      return {
        avgCop: '0.0',
        avgSupplyTemp: '0.0',
        avgReturnTemp: '0.0',
        totalCooling: 0,
        totalPowerKwh: 0,
        totalPowerKw: 0,
        avgPressure: '0.0',
        avgGreenRatio: '0.0',
        avgPeakRatio: '0.0',
        totalSavings: 0,
      }
    }
    const avgCop = (filteredHvacData.reduce((acc, i) => acc + i.cop, 0) / filteredHvacData.length).toFixed(2)
    const avgSupplyTemp = (filteredHvacData.reduce((acc, i) => acc + i.supplyTemp, 0) / filteredHvacData.length).toFixed(1)
    const avgReturnTemp = (filteredHvacData.reduce((acc, i) => acc + i.returnTemp, 0) / filteredHvacData.length).toFixed(1)
    const totalCooling = filteredHvacData.reduce((acc, i) => acc + i.coolingOutputGj, 0).toFixed(1)
    const totalPowerKwh = filteredHvacData.reduce((acc, i) => acc + i.powerConsumptionKwh, 0)
    const totalPowerKw = filteredHvacData.reduce((acc, i) => acc + i.powerKw, 0)
    const avgPressure = (filteredHvacData.reduce((acc, i) => acc + i.pressureMpa, 0) / filteredHvacData.length).toFixed(2)
    const avgGreenRatio = (filteredHvacData.reduce((acc, i) => acc + i.greenPowerRatio, 0) / filteredHvacData.length).toFixed(1)
    const avgPeakRatio = (filteredHvacData.reduce((acc, i) => acc + i.peakRatio, 0) / filteredHvacData.length).toFixed(1)
    const totalSavings = filteredHvacData.reduce((acc, i) => acc + i.savingsYuan, 0)

    return {
      avgCop,
      avgSupplyTemp,
      avgReturnTemp,
      totalCooling,
      totalPowerKwh: totalPowerKwh.toLocaleString(),
      totalPowerKw: totalPowerKw.toLocaleString(),
      avgPressure,
      avgGreenRatio,
      avgPeakRatio,
      totalSavings: totalSavings.toLocaleString(undefined, { maximumFractionDigits: 1 }),
    }
  }, [filteredHvacData])


  // 图表数据转换
  const pvChartData = useMemo(() => {
    if (filteredPvData.length === 0) return []
    // 累加所有有效项目电量与收益总额
    const totalGen = filteredPvData.reduce((acc, i) => acc + i.dailyGenKwh, 0)
    const totalSelf = filteredPvData.reduce((acc, i) => acc + i.selfUseKwh, 0)
    const totalGrid = filteredPvData.reduce((acc, i) => acc + i.gridKwh, 0)
    const totalSelfRev = filteredPvData.reduce((acc, i) => acc + i.selfRevenueYuan, 0)
    const totalGridRev = filteredPvData.reduce((acc, i) => acc + i.gridRevenueYuan, 0)
    const totalRev = filteredPvData.reduce((acc, i) => acc + i.totalRevenueYuan, 0)

    if (timeDim === 'day') {
      // 🌟 用户明确要求：时间选择日 -- 则为 15 分钟趋势 (全天 96 个连续采样点: 00:00, 00:15 ... 23:45)
      // 06:00 (index 24) 至 19:00 (index 76) 之间呈现高斯平滑正弦出力钟形曲线，正午 12:30 出力最高
      const points = 96
      const weights: number[] = new Array(points).fill(0)
      let sumWeight = 0
      for (let i = 0; i < points; i++) {
        if (i >= 24 && i <= 76) {
          const t = (i - 24) / (76 - 24) // 0 ~ 1
          const w = Math.pow(Math.sin(Math.PI * t), 1.8)
          weights[i] = w
          sumWeight += w
        }
      }
      const normRatios = weights.map((w) => (sumWeight > 0 ? w / sumWeight : 0))

      return Array.from({ length: points }, (_, i) => {
        const h = Math.floor(i / 4)
        const m = (i % 4) * 15
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        const r = normRatios[i]
        return {
          time: timeStr,
          发电量: Math.round(totalGen * r),
          消纳电量: Math.round(totalSelf * r),
          上网电量: Math.round(totalGrid * r),
          自消纳收益: Math.round(totalSelfRev * r),
          上网收益: Math.round(totalGridRev * r),
          综合日收益: Math.round(totalRev * r),
        }
      })
    }

    if (timeDim === 'month') {
      // 🌟 用户明确要求：时间选择为月则横轴为日 (08-01 至 08-28)
      return Array.from({ length: 28 }, (_, i) => {
        const day = i + 1
        const dayStr = `08-${String(day).padStart(2, '0')}`
        const factor = 0.88 + (((day * 13) % 25) / 100)
        return {
          time: dayStr,
          发电量: Math.round(totalGen * factor),
          消纳电量: Math.round(totalSelf * factor),
          上网电量: Math.round(totalGrid * factor),
          自消纳收益: Math.round(totalSelfRev * factor),
          上网收益: Math.round(totalGridRev * factor),
          综合日收益: Math.round(totalRev * factor),
        }
      })
    }

    // 🌟 用户明确要求：自定义为选择多日 (展示选定多日时序)
    let daysList: string[] = []
    if (dateRange.start && dateRange.end) {
      const d1 = new Date(dateRange.start)
      const d2 = new Date(dateRange.end)
      const diffDays = Math.min(31, Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)) + 1))
      daysList = Array.from({ length: diffDays }, (_, i) => {
        const d = new Date(d1.getTime() + i * 24 * 3600 * 1000)
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${m}-${day}`
      })
    } else {
      daysList = Array.from({ length: 14 }, (_, i) => `08-${String(i + 15).padStart(2, '0')}`)
    }
    return daysList.map((dayStr, idx) => {
      const factor = 0.9 + (((idx * 7 + 3) % 20) / 100)
      return {
        time: dayStr,
        发电量: Math.round(totalGen * factor),
        消纳电量: Math.round(totalSelf * factor),
        上网电量: Math.round(totalGrid * factor),
        自消纳收益: Math.round(totalSelfRev * factor),
        上网收益: Math.round(totalGridRev * factor),
        综合日收益: Math.round(totalRev * factor),
      }
    })
  }, [filteredPvData, timeDim, dateRange])

  const storageChartData = useMemo(() => {
    if (filteredStorageData.length === 0) return []
    const cur = filteredStorageData[0] || MOCK_STORAGE_DATA[0]

    if (timeDim === 'day') {
      // 24小时逐时储能充放电模型 (工业储能两充两放典型运行曲线)
      // 谷充(00:00-05:00) -> 待机(06:00-07:00) -> 峰放(08:00-11:00) -> 平充(12:00-13:00) -> 待机(14:00-16:00) -> 尖峰放(17:00-21:00) -> 待机(22:00-23:00)
      const hourlySchedule: Array<{ cRatio: number; dRatio: number; soc: number; revRatio: number }> = [
        { cRatio: 0, dRatio: 0, soc: 22, revRatio: 0 },         // 00:00
        { cRatio: 0.18, dRatio: 0, soc: 36, revRatio: 0 },      // 01:00
        { cRatio: 0.26, dRatio: 0, soc: 58, revRatio: 0 },      // 02:00
        { cRatio: 0.24, dRatio: 0, soc: 78, revRatio: 0 },      // 03:00
        { cRatio: 0.18, dRatio: 0, soc: 90, revRatio: 0 },      // 04:00
        { cRatio: 0.04, dRatio: 0, soc: 93, revRatio: 0 },      // 05:00
        { cRatio: 0, dRatio: 0, soc: 93, revRatio: 0 },         // 06:00
        { cRatio: 0, dRatio: 0, soc: 93, revRatio: 0 },         // 07:00
        { cRatio: 0, dRatio: 0.14, soc: 80, revRatio: 0.14 },   // 08:00
        { cRatio: 0, dRatio: 0.20, soc: 60, revRatio: 0.20 },   // 09:00
        { cRatio: 0, dRatio: 0.12, soc: 46, revRatio: 0.12 },   // 10:00
        { cRatio: 0, dRatio: 0.04, soc: 40, revRatio: 0.04 },   // 11:00
        { cRatio: 0.05, dRatio: 0, soc: 52, revRatio: 0 },      // 12:00
        { cRatio: 0.05, dRatio: 0, soc: 64, revRatio: 0 },      // 13:00
        { cRatio: 0, dRatio: 0, soc: 64, revRatio: 0 },         // 14:00
        { cRatio: 0, dRatio: 0, soc: 64, revRatio: 0 },         // 15:00
        { cRatio: 0, dRatio: 0, soc: 64, revRatio: 0 },         // 16:00
        { cRatio: 0, dRatio: 0.10, soc: 54, revRatio: 0.10 },   // 17:00
        { cRatio: 0, dRatio: 0.16, soc: 38, revRatio: 0.16 },   // 18:00
        { cRatio: 0, dRatio: 0.14, soc: 24, revRatio: 0.14 },   // 19:00
        { cRatio: 0, dRatio: 0.07, soc: 20, revRatio: 0.07 },   // 20:00
        { cRatio: 0, dRatio: 0.03, soc: 20, revRatio: 0.03 },   // 21:00
        { cRatio: 0, dRatio: 0, soc: 20, revRatio: 0 },         // 22:00
        { cRatio: 0, dRatio: 0, soc: 20, revRatio: 0 },         // 23:00
      ]

      return hourlySchedule.map((slot, h) => {
        const hourStr = `${String(h).padStart(2, '0')}:00`
        return {
          time: hourStr,
          日充电量: Math.round(cur.chargeKwh * slot.cRatio),
          日放电量: Math.round(cur.dischargeKwh * slot.dRatio),
          收益: Math.round(cur.revenueYuan * slot.revRatio),
          综合效率: cur.efficiency,
          SOC: slot.soc,
        }
      })
    }

    if (timeDim === 'month') {
      // 月度 28 天日充放电时序
      return Array.from({ length: 28 }, (_, i) => {
        const day = i + 1
        const dayStr = `08-${String(day).padStart(2, '0')}`
        const factor = 0.9 + (((day * 11) % 20) / 100)
        return {
          time: dayStr,
          日充电量: Math.round(cur.chargeKwh * factor),
          日放电量: Math.round(cur.dischargeKwh * factor),
          收益: Math.round(cur.revenueYuan * factor),
          综合效率: +(cur.efficiency + (((day * 3) % 15 - 7) / 10)).toFixed(1),
          SOC: +(cur.soc + (((day * 5) % 10 - 5) / 2)).toFixed(1),
        }
      })
    }

    // 自定义区间时序 (14天)
    return Array.from({ length: 14 }, (_, i) => {
      const day = i + 15
      const dayStr = `08-${String(day).padStart(2, '0')}`
      const factor = 0.92 + (((day * 9) % 18) / 100)
      return {
        time: dayStr,
        日充电量: Math.round(cur.chargeKwh * factor),
        日放电量: Math.round(cur.dischargeKwh * factor),
        收益: Math.round(cur.revenueYuan * factor),
        综合效率: cur.efficiency,
        SOC: cur.soc,
      }
    })
  }, [filteredStorageData, timeDim])

  const heatPumpChartData = useMemo(() => {
    if (filteredHeatPumpData.length === 0) return []
    const cur = filteredHeatPumpData[0] || MOCK_HEAT_PUMP_DATA[0]

    if (timeDim === 'day') {
      // 24小时逐时热泵运行出力模型
      const hourlyDistribution = [
        0.03, 0.03, 0.03, 0.03, 0.03, 0.04, 0.05, 0.06, 0.06, 0.05, 0.05, 0.04, 0.04, 0.04, 0.05, 0.05, 0.06, 0.06, 0.05, 0.04, 0.04, 0.03, 0.03, 0.03,
      ]
      const totalRatio = hourlyDistribution.reduce((a, b) => a + b, 0)
      const normRatios = hourlyDistribution.map((r) => r / totalRatio)

      return Array.from({ length: 24 }, (_, h) => {
        const hourStr = `${String(h).padStart(2, '0')}:00`
        const ratio = normRatios[h]
        return {
          time: hourStr,
          制热量: +(cur.heatOutputGj * ratio).toFixed(1),
          耗电量: Math.round(cur.powerConsumptionKwh * ratio),
          COP: +(cur.cop * (0.95 + (h % 3) * 0.03)).toFixed(2),
          供水温度: +(cur.supplyTemp + ((h % 4) - 2) * 0.3).toFixed(1),
          收益: Math.round(cur.savingsYuan * ratio),
        }
      })
    }

    if (timeDim === 'month') {
      return Array.from({ length: 28 }, (_, i) => {
        const day = i + 1
        const dayStr = `08-${String(day).padStart(2, '0')}`
        const factor = 0.9 + (((day * 7) % 20) / 100)
        return {
          time: dayStr,
          制热量: +(cur.heatOutputGj * factor).toFixed(1),
          耗电量: Math.round(cur.powerConsumptionKwh * factor),
          COP: +(cur.cop * (0.96 + ((day % 5) * 0.02))).toFixed(2),
          供水温度: +(cur.supplyTemp + ((day % 3) - 1) * 0.5).toFixed(1),
          收益: Math.round(cur.savingsYuan * factor),
        }
      })
    }

    return Array.from({ length: 14 }, (_, i) => {
      const day = i + 15
      const dayStr = `08-${String(day).padStart(2, '0')}`
      const factor = 0.92 + (((day * 11) % 16) / 100)
      return {
        time: dayStr,
        制热量: +(cur.heatOutputGj * factor).toFixed(1),
        耗电量: Math.round(cur.powerConsumptionKwh * factor),
        COP: cur.cop,
        供水温度: cur.supplyTemp,
        收益: Math.round(cur.savingsYuan * factor),
      }
    })
  }, [filteredHeatPumpData, timeDim])

  const hvacChartData = useMemo(() => {
    if (filteredHvacData.length === 0) return []
    const cur = filteredHvacData[0] || MOCK_HVAC_DATA[0]

    if (timeDim === 'day') {
      // 24小时逐时空调负荷出力模型 (日间生产班次制冷为主)
      const hourlyDistribution = [
        0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.03, 0.05, 0.07, 0.08, 0.09, 0.10, 0.10, 0.10, 0.09, 0.07, 0.05, 0.04, 0.03, 0.02, 0.01, 0.01, 0.01, 0.01,
      ]
      const totalRatio = hourlyDistribution.reduce((a, b) => a + b, 0)
      const normRatios = hourlyDistribution.map((r) => r / totalRatio)

      return Array.from({ length: 24 }, (_, h) => {
        const hourStr = `${String(h).padStart(2, '0')}:00`
        const ratio = normRatios[h]
        return {
          time: hourStr,
          制冷量: +(cur.coolingOutputGj * ratio).toFixed(1),
          耗电量: Math.round(cur.powerConsumptionKwh * ratio),
          COP: +(cur.cop * (0.96 + (h % 3) * 0.02)).toFixed(2),
          供水温度: +(cur.supplyTemp + ((h % 3) - 1) * 0.2).toFixed(1),
          收益: Math.round(cur.savingsYuan * ratio),
        }
      })
    }

    if (timeDim === 'month') {
      return Array.from({ length: 28 }, (_, i) => {
        const day = i + 1
        const dayStr = `08-${String(day).padStart(2, '0')}`
        const factor = 0.88 + (((day * 13) % 24) / 100)
        return {
          time: dayStr,
          制冷量: +(cur.coolingOutputGj * factor).toFixed(1),
          耗电量: Math.round(cur.powerConsumptionKwh * factor),
          COP: +(cur.cop * (0.95 + ((day % 4) * 0.03))).toFixed(2),
          供水温度: +(cur.supplyTemp + (day % 2 ? 0.2 : -0.2)).toFixed(1),
          收益: Math.round(cur.savingsYuan * factor),
        }
      })
    }

    return Array.from({ length: 14 }, (_, i) => {
      const day = i + 15
      const dayStr = `08-${String(day).padStart(2, '0')}`
      const factor = 0.9 + (((day * 8) % 20) / 100)
      return {
        time: dayStr,
        制冷量: +(cur.coolingOutputGj * factor).toFixed(1),
        耗电量: Math.round(cur.powerConsumptionKwh * factor),
        COP: cur.cop,
        供水温度: cur.supplyTemp,
        收益: Math.round(cur.savingsYuan * factor),
      }
    })
  }, [filteredHvacData, timeDim])


  return (
    <div className="flex gap-3.5 items-start font-sans pb-10">
      {/* 🌟 左侧 260px 园区组织结构树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => {
          setSelectedNode(node)
          if (node.level === 'park') {
            handleParkChange(node.name)
          } else if (node.level === 'workshop' || node.level === 'company') {
            handleCompanyChange(node.name)
          } else if (node.level === 'group') {
            handleParkChange('all')
          }
        }}
        treeType="park"
      />

      {/* 🌟 右侧主监控工作台 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* 1. 顶部 Header */}
        <div className="bg-white dark:bg-card p-3.5 rounded-xl border border-slate-200 dark:border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#2C7CFF] shrink-0">
              <Activity className="size-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 dark:text-slate-100">
                实时监控
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 时间维度切换：日 / 月 / 自定义 (光伏模块下隐藏"日") */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg text-sm font-sans">
              {categoryFilter !== '光伏' && (
                <button
                  type="button"
                  onClick={() => setTimeDim('day')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                    timeDim === 'day'
                      ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800',
                  )}
                >
                  日
                </button>
              )}
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'month'
                    ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                月
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('custom')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                  timeDim === 'custom'
                    ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                自定义
              </button>
            </div>

            {/* 1. 日维度：单一日期选择器 (选择具体某一天) */}
            {timeDim === 'day' && (
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 h-9 rounded-lg border border-[#E2E8F0] dark:border-slate-700 text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 dark:text-slate-200 text-sm focus:outline-none cursor-pointer"
                  title="选择具体监测日期"
                />
              </div>
            )}

            {/* 2. 月维度：单一月份选择器 (选择具体某个月) */}
            {timeDim === 'month' && (
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 h-9 rounded-lg border border-[#E2E8F0] dark:border-slate-700 text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 dark:text-slate-200 text-sm focus:outline-none cursor-pointer font-bold"
                  title="选择具体监测月份"
                />
              </div>
            )}

            {/* 3. 自定义维度：起始日期 至 结束日期 (严格限制 ≤ 30 天) */}
            {timeDim === 'custom' && (
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 h-9 rounded-lg border border-[#E2E8F0] dark:border-slate-700 text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleCustomStartDateChange(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 dark:text-slate-200 text-sm focus:outline-none cursor-pointer"
                  title="自定义起始日期 (最多可选30天)"
                />
                <span className="text-slate-400 font-sans text-xs">至</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleCustomEndDateChange(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 dark:text-slate-200 text-sm focus:outline-none cursor-pointer"
                  title="自定义结束日期 (最多可选30天)"
                />
              </div>
            )}

            {/* 统一规范导出按钮 (80px * 36px, 8px 圆角, #2C7CFF 蓝底白字) */}
            <button
              type="button"
              onClick={() =>
                alert(
                  `已成功导出【${selectedNode.name}】${categoryFilter}模块实时监测数据报表！`,
                )
              }
              className="w-[80px] h-[36px] bg-[#2C7CFF] hover:bg-[#1E6BFF] text-white rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium shadow-xs transition-colors shrink-0 cursor-pointer"
              title="导出当前监测数据报表"
            >
              <Download className="size-4 text-white" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 🌟 2. 核心监控模块分类切换 与 切换项目 Tab 栏 (relative z-10 保证浮于卡片之上，同时不遮挡顶栏 z-40 浮层) */}
        <div className="relative z-10 bg-white dark:bg-card p-3 rounded-xl border border-slate-200 dark:border-border shadow-xs flex flex-wrap items-center justify-between gap-3 font-sans">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">监控模块：</span>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0d1b29] p-0.5 dark:p-[3px] rounded-lg border border-slate-200 dark:border-[#133748] text-xs font-sans">
              {[
                { key: '光伏', label: '光伏', icon: '☀️' },
                { key: '储能', label: '储能', icon: '🔋' },
                { key: '热泵', label: '热泵', icon: '♨️' },
                { key: '空调', label: '空调', icon: '❄️' },
              ].map((tab) => {
                const isActive = categoryFilter === tab.key
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      const nextCat = tab.key as any
                      setCategoryFilter(nextCat)
                      if (nextCat === '光伏' && timeDim === 'day') {
                        setTimeDim('month')
                      }
                    }}
                    className={cn(
                      'h-7 px-3.5 rounded-md transition-all cursor-pointer font-bold text-xs flex items-center gap-1.5 select-none',
                      isActive
                        ? 'tbea-tab-cyan-active shadow-xs dark:shadow-none'
                        : 'text-slate-600 hover:text-slate-900 dark:text-[#879ca8] dark:hover:text-white bg-transparent dark:bg-transparent',
                    )}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 右侧：切换项目 Tab 页 与 更多浮层 */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0">
              切换项目：
            </span>
            {currentProjectList.length > 0 ? (
              <CollapsibleProjectBar
                items={currentProjectList}
                activeItem={selectedProjectName}
                onSelect={(proj) => {
                  setSelectedProjectName(proj.name)
                  setSelectedPvPhase('ALL')
                }}
              />
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">当前组织暂无相关项目</span>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 🌟 1. 光伏实时监测模块 (Photovoltaic Monitoring) */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {categoryFilter === '光伏' && (
          <div className="space-y-3.5">
            {/* 光伏 6 大核心 KPI 指标卡片 (用户指定指标全面覆盖) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px]">发电功率</span>
                  <Zap className="size-3.5 text-amber-500" />
                </div>
                <div className="text-base font-bold font-mono text-slate-800">
                  {pvSummary.totalPower} <span className="text-xs font-normal">kW</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px]">发电量</span>
                  <Sun className="size-3.5 text-amber-600" />
                </div>
                <div className="text-base font-bold font-mono text-amber-600">
                  {pvSummary.totalGen} <span className="text-xs font-normal">kWh</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px]">消纳电量</span>
                  <Activity className="size-3.5 text-emerald-500" />
                </div>
                <div className="text-base font-bold font-mono text-emerald-600">
                  {pvSummary.totalSelf} <span className="text-xs font-normal">kWh</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px]">上网电量</span>
                  <ArrowUpRight className="size-3.5 text-blue-500" />
                </div>
                <div className="text-base font-bold font-mono text-blue-600">
                  {pvSummary.totalGrid} <span className="text-xs font-normal">kWh</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px]">自消纳收益</span>
                  <Coins className="size-3.5 text-emerald-600" />
                </div>
                <div className="text-base font-bold font-mono text-emerald-600">
                  ¥{pvSummary.totalSelfRev}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px]">上网收益</span>
                  <Coins className="size-3.5 text-blue-600" />
                </div>
                <div className="text-base font-bold font-mono text-blue-600">
                  ¥{pvSummary.totalGridRev}
                </div>
              </div>
            </div>

            {/* 🌟 用户指定：两个平衡趋势合并为一个图，用标签切换 (电量平衡趋势 / 收益对比趋势) */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 font-sans">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <h3 className="text-xs font-bold text-slate-800">
                      能效分析
                    </h3>
                  </div>

                  {/* 🌟 核心标签切换 */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setPvChartSubTab('energy')}
                      className={cn(
                        'px-3 py-1 rounded-md transition-all cursor-pointer font-bold text-xs flex items-center gap-1.5 select-none',
                        pvChartSubTab === 'energy'
                          ? 'bg-white text-[#2C7CFF] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900',
                      )}
                    >
                      <Zap className="size-3 text-amber-500" />
                      <span>电量平衡趋势</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPvChartSubTab('revenue')}
                      className={cn(
                        'px-3 py-1 rounded-md transition-all cursor-pointer font-bold text-xs flex items-center gap-1.5 select-none',
                        pvChartSubTab === 'revenue'
                          ? 'bg-white text-[#2C7CFF] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900',
                      )}
                    >
                      <Coins className="size-3 text-emerald-500" />
                      <span>收益对比趋势</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span>单位：{pvChartSubTab === 'energy' ? 'kWh' : '元'}</span>
                </div>
              </div>

              <div className="h-[280px]">
                {pvChartSubTab === 'energy' ? (
                  <LineTrend
                    data={pvChartData}
                    xKey="time"
                    height={280}
                    xInterval={timeDim === 'day' ? 7 : timeDim === 'month' ? 2 : 1}
                    showBrush={true}
                    brushStartIndex={pvBrushRange.startIndex}
                    brushEndIndex={pvBrushRange.endIndex}
                    onBrushChange={setPvBrushRange}
                    lines={[
                      { key: '发电量', name: '日发电量 (kWh)', color: '#fa8c16' },
                      { key: '消纳电量', name: '消纳电量 (kWh)', color: '#52c41a' },
                      { key: '上网电量', name: '上网电量 (kWh)', color: '#2C7CFF' },
                    ]}
                  />
                ) : (
                  <LineTrend
                    data={pvChartData}
                    xKey="time"
                    height={280}
                    xInterval={timeDim === 'day' ? 7 : timeDim === 'month' ? 2 : 1}
                    showBrush={true}
                    brushStartIndex={pvBrushRange.startIndex}
                    brushEndIndex={pvBrushRange.endIndex}
                    onBrushChange={setPvBrushRange}
                    lines={[
                      { key: '自消纳收益', name: '自消纳收益 (元)', color: '#10b981' },
                      { key: '上网收益', name: '余电上网收益 (元)', color: '#3b82f6' },
                      { key: '综合日收益', name: '综合日总收益 (元)', color: '#f59e0b' },
                    ]}
                  />
                )}
              </div>
            </div>

            {/* 光伏监测数据表格 (严格包含用户指定的全部 6 大字段) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-500" />
                  <h3 className="text-xs font-bold text-slate-800">项目台账</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 h-[44px]">
                      <th className="py-2.5 px-3 whitespace-nowrap">时间</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">建设单位</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">装机容量</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">发电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">消纳电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">上网电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">自消纳收益 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">上网收益 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">综合日收益 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">消纳比例</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredPvData.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50/40 transition-colors h-[44px]">
                        <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{item.projectName}</span>
                            {item.phase && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                {item.phase}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-slate-400">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-amber-700 whitespace-nowrap">{item.capacity}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.dailyGenKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                          {item.selfUseKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-600">
                          {item.gridKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                          ¥{item.selfRevenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-600">
                          ¥{item.gridRevenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                          ¥{item.totalRevenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                          {item.selfUseRatio}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 🌟 2. 储能实时监测模块 (Storage Monitoring) */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {categoryFilter === '储能' && (
          <div className="space-y-3.5">
            {/* 储能 6 大核心 KPI 指标卡片 (单行6列展示) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {/* 1. 充放电功率 */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px]">充放电功率</span>
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded text-[10px] font-sans font-bold border',
                          storageSummary.operatingStatus === '放电'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60'
                            : storageSummary.operatingStatus === '充电'
                            ? 'bg-blue-50 text-blue-600 border-blue-200/60'
                            : 'bg-slate-50 text-slate-600 border-slate-200/60',
                        )}
                      >
                        {storageSummary.operatingStatus}
                      </span>
                    </div>
                    <Zap
                      className={cn(
                        'size-3.5',
                        storageSummary.operatingStatus === '放电' ? 'text-emerald-500' : 'text-blue-500',
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      'text-base font-bold font-mono',
                      storageSummary.operatingStatus === '放电' ? 'text-emerald-600' : 'text-blue-600',
                    )}
                  >
                    {storageSummary.totalCurrentPower} <span className="text-xs font-normal">kW</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">15:30:00</div>
              </div>

              {/* 2. 充电量 */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px]">充电量</span>
                    <BatteryCharging className="size-3.5 text-blue-500" />
                  </div>
                  <div className="text-base font-bold font-mono text-blue-600">
                    {storageSummary.totalCharge} <span className="text-xs font-normal">kWh</span>
                  </div>
                </div>
              </div>

              {/* 3. 放电量 */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px]">放电量</span>
                    <TrendingUp className="size-3.5 text-emerald-500" />
                  </div>
                  <div className="text-base font-bold font-mono text-emerald-600">
                    {storageSummary.totalDischarge} <span className="text-xs font-normal">kWh</span>
                  </div>
                </div>
              </div>

              {/* 4. 当前 SOC */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px]">当前 SOC</span>
                    <BatteryCharging className="size-3.5 text-purple-500" />
                  </div>
                  <div className="text-base font-bold font-mono text-purple-600">
                    {storageSummary.avgSoc}%
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">15:30:00</div>
              </div>

              {/* 5. 收益 (按日) */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px]">收益 (按日)</span>
                    <Coins className="size-3.5 text-emerald-600" />
                  </div>
                  <div className="text-base font-bold font-mono text-emerald-600">
                    ¥{storageSummary.totalRevenue}
                  </div>
                </div>
              </div>

              {/* 6. 综合效率 (日) */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px]">综合效率 (日)</span>
                    <Gauge className="size-3.5 text-[#2C7CFF]" />
                  </div>
                  <div className="text-base font-bold font-mono text-[#2C7CFF]">
                    {storageSummary.avgEfficiency}%
                  </div>
                </div>
              </div>
            </div>

            {/* 储能图表时序展示 (合并为一个表：充放电量、套利收益、综合效率、SOC) */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-500" />
                  <h3 className="text-xs font-bold text-slate-800">
                    能效分析
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                  <span>左轴：电量 (kWh) / 收益 (元)</span>
                  <span>右轴：百分比 (%)</span>
                </div>
              </div>
              <div className="h-[270px]">
                <LineTrend
                  data={storageChartData}
                  xKey="time"
                  height={270}
                  xInterval={timeDim === 'day' ? 2 : 2}
                  showBrush={true}
                  brushStartIndex={storageBrushRange.startIndex}
                  brushEndIndex={storageBrushRange.endIndex}
                  onBrushChange={setStorageBrushRange}
                  secondaryYUnit="%"
                  secondaryDomain={[0, 100]}
                  lines={[
                    { key: '日充电量', name: '日充电量 (kWh)', color: '#2C7CFF', yAxisId: 'left' },
                    { key: '日放电量', name: '日放电量 (kWh)', color: '#52c41a', yAxisId: 'left' },
                    { key: '收益', name: '套利收益 (元)', color: '#fa8c16', yAxisId: 'left' },
                    { key: '综合效率', name: '综合效率 (%)', color: '#722ed1', yAxisId: 'right' },
                    { key: 'SOC', name: 'SOC 荷电 (%)', color: '#13c2c2', yAxisId: 'right' },
                  ]}
                />
              </div>
            </div>

            {/* 储能监测数据表格 (严格包含用户指定的全部 8 大字段) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800">项目台账</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 h-[44px]">
                      <th className="py-2.5 px-3 whitespace-nowrap">时间</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">建设单位</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">充电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">放电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">收益(按日) (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">综合效率(日)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">绿充占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">尖放占比</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredStorageData.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/40 transition-colors h-[44px]">
                        <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                          {item.projectName}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-slate-400">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.chargeKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.dischargeKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                          ¥{item.revenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#2C7CFF]">
                          {item.efficiency}%
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                          {item.greenChargeRatio}%
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-purple-600">
                          {item.criticalPeakDischargeRatio}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 🌟 3. 热泵实时监测模块 (Heat Pump Monitoring) */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {categoryFilter === '热泵' && (
          <div className="space-y-3.5">
            {/* 热泵 8 大核心 KPI 指标卡片 (2行展示，每行4张) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">COP 能效</span>
                <div className="text-base font-bold font-mono text-emerald-600">
                  {heatPumpSummary.avgCop}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">供水温度</span>
                <div className="text-base font-bold font-mono text-rose-600">
                  {heatPumpSummary.avgSupplyTemp} <span className="text-xs font-normal">℃</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">回水温度</span>
                <div className="text-base font-bold font-mono text-blue-600">
                  {heatPumpSummary.avgReturnTemp} <span className="text-xs font-normal">℃</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">制热量</span>
                <div className="text-base font-bold font-mono text-orange-600">
                  {heatPumpSummary.totalHeat} <span className="text-xs font-normal">GJ</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">耗电量</span>
                <div className="text-base font-bold font-mono text-slate-800">
                  {heatPumpSummary.totalPowerKwh} <span className="text-xs font-normal">kWh</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">功率</span>
                <div className="text-base font-bold font-mono text-slate-800">
                  {heatPumpSummary.totalPowerKw} <span className="text-xs font-normal">kW</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">压力</span>
                <div className="text-base font-bold font-mono text-purple-600">
                  1.25 <span className="text-xs font-normal">MPa</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">尖/峰占比</span>
                <div className="text-base font-bold font-mono text-amber-600">
                  {heatPumpSummary.avgPeakRatio}%
                </div>
              </div>
            </div>

            {/* 热泵图表时序展示 (合并为一个表：供热量、耗电量、COP) */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-orange-500" />
                  <h3 className="text-xs font-bold text-slate-800">
                    能效分析
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">供热量、耗电量、COP</span>
              </div>
              <div className="h-[270px]">
                <LineTrend
                  data={heatPumpChartData}
                  xKey="time"
                  height={270}
                  xInterval={timeDim === 'day' ? 2 : 2}
                  showBrush={true}
                  brushStartIndex={heatPumpBrushRange.startIndex}
                  brushEndIndex={heatPumpBrushRange.endIndex}
                  onBrushChange={setHeatPumpBrushRange}
                  lines={[
                    { key: '制热量', name: '日供热量 (GJ)', color: '#FF6536' },
                    { key: '耗电量', name: '日耗电量 (kWh)', color: '#2C7CFF' },
                    { key: 'COP', name: 'COP 能效比', color: '#10b981' },
                  ]}
                />
              </div>
            </div>

            {/* 热泵监测数据表格 (严格包含用户指定的全部 10 大字段) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-orange-600" />
                  <h3 className="text-xs font-bold text-slate-800">项目台账</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 h-[44px]">
                      <th className="py-2.5 px-3 whitespace-nowrap">时间</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">建设单位</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">COP</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">供水温度 (℃)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">回水温度 (℃)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">制热量 (GJ)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">耗电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">功率 (kW)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">压力 (MPa)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">绿电占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">尖/峰占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">收益 (元)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredHeatPumpData.map((item) => (
                      <tr key={item.id} className="hover:bg-orange-50/40 transition-colors h-[44px]">
                        <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                          {item.projectName}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-slate-400">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                          {item.cop}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-rose-600">
                          {item.supplyTemp} ℃
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-600">
                          {item.returnTemp} ℃
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-orange-600">
                          {item.heatOutputGj}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.powerConsumptionKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.powerKw.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-purple-600">
                          {item.pressureMpa}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                          {item.greenPowerRatio}%
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-600">
                          {item.peakRatio}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                          ¥{item.savingsYuan.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
{/* ══════════════════════════════════════════════════════════════════ */}
        {/* 🌟 4. 空调实时监测模块 (HVAC / Chiller Plant Monitoring) */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {categoryFilter === '空调' && (
          <div className="space-y-3.5">
            {/* 空调 8 大核心 KPI 指标卡片 (2行展示，每行4张) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">COP 能效</span>
                <div className="text-base font-bold font-mono text-emerald-600">
                  {hvacSummary.avgCop}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">供水温度</span>
                <div className="text-base font-bold font-mono text-cyan-600">
                  {hvacSummary.avgSupplyTemp} <span className="text-xs font-normal">℃</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">回水温度</span>
                <div className="text-base font-bold font-mono text-blue-600">
                  {hvacSummary.avgReturnTemp} <span className="text-xs font-normal">℃</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">制冷量</span>
                <div className="text-base font-bold font-mono text-cyan-600">
                  {hvacSummary.totalCooling} <span className="text-xs font-normal">GJ</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">耗电量</span>
                <div className="text-base font-bold font-mono text-slate-800">
                  {hvacSummary.totalPowerKwh} <span className="text-xs font-normal">kWh</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">功率</span>
                <div className="text-base font-bold font-mono text-slate-800">
                  {hvacSummary.totalPowerKw} <span className="text-xs font-normal">kW</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">压力</span>
                <div className="text-base font-bold font-mono text-purple-600">
                  {hvacSummary.avgPressure} <span className="text-xs font-normal">MPa</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block mb-0.5">尖/峰占比</span>
                <div className="text-base font-bold font-mono text-amber-600">
                  {hvacSummary.avgPeakRatio}%
                </div>
              </div>
            </div>

            {/* 空调图表时序展示 (合并为一个表：制冷量、耗电量、COP) */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan-500" />
                  <h3 className="text-xs font-bold text-slate-800">
                    能效分析
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">制冷量、耗电量、COP</span>
              </div>
              <div className="h-[270px]">
                <LineTrend
                  data={hvacChartData}
                  xKey="time"
                  height={270}
                  xInterval={timeDim === 'day' ? 2 : 2}
                  showBrush={true}
                  brushStartIndex={hvacBrushRange.startIndex}
                  brushEndIndex={hvacBrushRange.endIndex}
                  onBrushChange={setHvacBrushRange}
                  lines={[
                    { key: '制冷量', name: '日制冷量 (GJ)', color: '#10C4CE' },
                    { key: '耗电量', name: '日耗电量 (kWh)', color: '#2C7CFF' },
                    { key: 'COP', name: 'COP 能效比', color: '#10b981' },
                  ]}
                />
              </div>
            </div>

            {/* 空调监测数据表格 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan-500" />
                  <h3 className="text-xs font-bold text-slate-800">项目台账</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 h-[44px]">
                      <th className="py-2.5 px-3 whitespace-nowrap">时间</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">建设单位</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">COP</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">供水温度 (℃)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">回水温度 (℃)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">制冷量 (GJ)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">耗电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">功率 (kW)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">压力 (MPa)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">绿电占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">尖/峰占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">收益 (元)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredHvacData.map((item) => (
                      <tr key={item.id} className="hover:bg-cyan-50/40 transition-colors h-[44px]">
                        <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                          {item.projectName}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-slate-400">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                          {item.cop}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-cyan-600">
                          {item.supplyTemp} ℃
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-600">
                          {item.returnTemp} ℃
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-cyan-600">
                          {item.coolingOutputGj}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.powerConsumptionKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.powerKw.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-purple-600">
                          {item.pressureMpa}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                          {item.greenPowerRatio}%
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-600">
                          {item.peakRatio}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                          ¥{item.savingsYuan.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

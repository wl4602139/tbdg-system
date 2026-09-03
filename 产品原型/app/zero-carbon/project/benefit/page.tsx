'use client'

import React, { useState, useMemo } from 'react'
import {
  Coins,
  TrendingUp,
  Sun,
  BatteryCharging,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Download,
  Filter,
  Activity,
  Zap,
  Calculator,
  HelpCircle,
  Info,
  ChevronRight,
  X,
  FileText,
  Check,
  Eye,
  Scale,
  Gauge,
  Sliders,
  DollarSign,
  Leaf,
  ShieldCheck,
} from 'lucide-react'
import { LineTrend, AreaTrend, Donut, BarChartGroup } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// ==========================================
// 1. 储能效益数据模型与台账数据
// ==========================================
export interface StorageBenefitItem {
  id: string
  name: string
  park: string
  company: string
  capacity: string // 如 6MW / 12MWh
  chargeKwh: number // 日充电量 (kWh)
  dischargeKwh: number // 日放电量 (kWh)
  revenueYuan: number // 日收益 (元)
  efficiency: number // 综合效率 (%)
  gridChargeRatio: number // 市充占比 (%)
  greenChargeRatio: number // 绿充占比 (%)
  criticalPeakDischargeRatio: number // 尖放占比 (%)
  peakDischargeRatio: number // 峰放占比 (%)
  // 扩展分析字段
  monthlyChargeWanKwh: number // 月度累计充电量 (万kWh)
  monthlyDischargeWanKwh: number // 月度累计放电量 (万kWh)
  monthlyRevenueWan: number // 月度累计收益 (万元)
  carbonReductionTons: number // 核证碳减排 (tCO2)
  // 详细算法核算上下文参数
  calcContext: {
    criticalPeakPrice: number // 尖段电价 (元/kWh)
    peakPrice: number // 峰段电价 (元/kWh)
    flatPrice: number // 平段电价 (元/kWh)
    valleyPrice: number // 谷段电价 (元/kWh)
    greenPowerPrice: number // 绿电消纳协议价 (元/kWh)
    gridChargeKwh: number // 市电充电量 (kWh)
    greenChargeKwh: number // 绿电充电量 (kWh)
    criticalDischargeKwh: number // 尖段放电量 (kWh)
    peakDischargeKwh: number // 峰段放电量 (kWh)
    dischargeIncomeYuan: number // 放电总收入 (元)
    chargeCostYuan: number // 充电总成本 (元)
    roundTripLossKwh: number // 循环损耗电量 (kWh)
    formula: string
  }
}

// ==========================================
// 2. 热泵效益数据模型与台账数据
// ==========================================
export interface HeatPumpBenefitItem {
  id: string
  name: string
  park: string
  company: string
  capacity: string // 如 2.5 MW (制热功率)
  gridPowerKwh: number // 市电量 (kWh)
  greenPowerKwh: number // 绿电量 (kWh)
  gridCostYuan: number // 市电费 (元)
  greenCostYuan: number // 绿电费 (元)
  greenPowerRatio: number // 绿电占比 (%)
  peakRatio: number // 尖峰占比 (%)
  // 扩展分析字段
  cop: number // 制热能效比 COP
  replacedGasM3: number // 替代天然气量 (m³)
  dailySavingsYuan: number // 当期日节费 (元)
  monthlySavingsWan: number // 月度累计节费 (万元)
  carbonReductionTons: number // 减碳量 (tCO2)
  // 详细算法核算上下文参数
  calcContext: {
    gridAvgPrice: number // 市电平均综合电价 (元/kWh)
    greenAvgPrice: number // 绿电加权交易电价 (元/kWh)
    gasPricePerM3: number // 替代天然气基准单价 (元/m³)
    gasThermalEfficiency: number // 原燃气锅炉热效率 (如 88%)
    heatOutputGj: number // 当期总供热量 (GJ)
    replacedGasCostYuan: number // 替代基准燃气费用 (元)
    heatPumpTotalCostYuan: number // 热泵运行总电费 (元)
    formula: string
  }
}

// ==========================================
// 3. 光伏效益数据模型与台账数据 (补充完善)
// ==========================================
export interface PvBenefitItem {
  id: string
  name: string
  park: string
  company: string
  capacity: string // 如 12.8 MWp
  dailyGenKwh: number // 日发电量 (kWh)
  dailySelfKwh: number // 自发自用量 (kWh)
  dailyGridKwh: number // 余电上网量 (kWh)
  selfUseRatio: number // 自用比例 (%)
  selfSavingsYuan: number // 自用节费 (元)
  gridRevenueYuan: number // 上网收益 (元)
  totalBenefitYuan: number // 综合效益 (元)
  dailyHours: number // 等效利用小时数 (h)
  dailyCarbonTons: number // 核证减排量 (tCO2)
  // 扩展分析字段
  monthlyGenWanKwh: number // 月累计发电 (万kWh)
  monthlyBenefitWan: number // 月累计收益 (万元)
  // 详细算法核算上下文参数
  calcContext: {
    gridTariffAvg: number // 替代企业外购电加权平均电价 (元/kWh)
    feedInTariff: number // 燃煤脱硫标杆上网电价 (元/kWh)
    prRatio: number // 光伏系统性能比 PR (%)
    emissionFactor: number // 电网碳排放因子 (tCO2/MWh)
    formula: string
  }
}

// ==========================================
// 4. 全景宏观项目模型
// ==========================================
export interface MacroProjectItem {
  id: string
  name: string
  base: string
  park: string
  type: '分布式光伏' | '用户侧储能' | '工业热泵'
  capacity: string
  investment: number // 万元
  actualGenKwh: string // 实际发电/节电/替代能耗
  savingsYuan: number // 当期节费 (万元)
  arbitrageYuan?: number // 峰谷套利/附加收益 (万元)
  carbonReduction: number // 核证碳减排量 (tCO2)
  tceSaving: number // 标煤节约量 (tce)
  irr: string // 实际内部收益率 IRR
  paybackYears: number // 动态投资回收期 (年)
  macc: number // 单位边际减排成本 (元/tCO2)
  npv: number // 净现值 (万元)
}

// 模拟宏观综合数据
const ALL_PROJECT_BENEFITS: MacroProjectItem[] = [
  {
    id: 'p-01',
    name: '沈变本部 12.8MWp 屋顶分布式光伏一期',
    base: '沈变公司',
    park: '特变电工东北输变电产业园',
    type: '分布式光伏',
    capacity: '12.8 MWp',
    investment: 4850.0,
    actualGenKwh: '118.5 万kWh',
    savingsYuan: 78.6,
    arbitrageYuan: 12.4,
    carbonReduction: 634.0,
    tceSaving: 145.6,
    irr: '14.8%',
    paybackYears: 4.8,
    macc: -145.0,
    npv: 820.5,
  },
  {
    id: 'p-02',
    name: '衡变公司 6MW/12MWh 磷酸铁锂用户侧储能',
    base: '衡变公司',
    park: '特变电工南方输变电产业园',
    type: '用户侧储能',
    capacity: '6MW / 12MWh',
    investment: 1680.0,
    actualGenKwh: '充放 62.0 万kWh',
    savingsYuan: 31.2,
    arbitrageYuan: 18.6,
    carbonReduction: 186.0,
    tceSaving: 76.2,
    irr: '17.2%',
    paybackYears: 4.2,
    macc: -48.0,
    npv: 345.0,
  },
  {
    id: 'p-03',
    name: '德缆产业园 2.5MW 高温工业水源热泵系统',
    base: '德缆公司',
    park: '特变电工(德阳)电缆园区',
    type: '工业热泵',
    capacity: '2.5 MW (制热量)',
    investment: 620.0,
    actualGenKwh: '替代天然气 3.8 万m³',
    savingsYuan: 14.2,
    arbitrageYuan: 2.1,
    carbonReduction: 82.0,
    tceSaving: 46.5,
    irr: '24.1%',
    paybackYears: 3.4,
    macc: -112.0,
    npv: 168.0,
  },
  {
    id: 'p-04',
    name: '新疆变压器厂区 20MWp 分布式光伏三期',
    base: '新变厂',
    park: '特变电工新疆产业园',
    type: '分布式光伏',
    capacity: '20.0 MWp',
    investment: 7600.0,
    actualGenKwh: '210.0 万kWh',
    savingsYuan: 135.0,
    arbitrageYuan: 15.0,
    carbonReduction: 1482.0,
    tceSaving: 320.0,
    irr: '14.8%',
    paybackYears: 5.6,
    macc: -148.0,
    npv: 1350.0,
  },
  {
    id: 'p-05',
    name: '鲁缆公司 3MW/6MWh 智慧储能调峰电站',
    base: '鲁缆公司',
    park: '特变电工华东输变电科技产业园',
    type: '用户侧储能',
    capacity: '3MW / 6MWh',
    investment: 890.0,
    actualGenKwh: '充放 31.0 万kWh',
    savingsYuan: 16.5,
    arbitrageYuan: 9.8,
    carbonReduction: 98.0,
    tceSaving: 38.5,
    irr: '16.5%',
    paybackYears: 4.5,
    macc: -52.0,
    npv: 185.0,
  },
  {
    id: 'p-06',
    name: '新缆厂 4.5MWp 屋顶分布式光伏二期',
    base: '新缆厂',
    park: '特变电工新疆电缆产业园',
    type: '分布式光伏',
    capacity: '4.5 MWp',
    investment: 1710.0,
    actualGenKwh: '45.8 万kWh',
    savingsYuan: 28.5,
    arbitrageYuan: 4.2,
    carbonReduction: 245.0,
    tceSaving: 56.3,
    irr: '15.6%',
    paybackYears: 4.6,
    macc: -138.0,
    npv: 290.0,
  },
  {
    id: 'p-07',
    name: '天变公司 1.8MW 真空干燥罐余热水源热泵',
    base: '天变公司',
    park: '特变电工天变产业园',
    type: '工业热泵',
    capacity: '1.8 MW (制热量)',
    investment: 380.0,
    actualGenKwh: '替代天然气 2.6 万m³',
    savingsYuan: 9.8,
    arbitrageYuan: 1.5,
    carbonReduction: 56.0,
    tceSaving: 31.8,
    irr: '21.5%',
    paybackYears: 3.9,
    macc: -98.0,
    npv: 112.0,
  },
]

// 模拟储能效益详细台账数据
const STORAGE_BENEFIT_DATA: StorageBenefitItem[] = [
  {
    id: 'st-01',
    name: '衡变公司 6MW/12MWh 磷酸铁锂用户侧储能电站',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    capacity: '6MW / 12MWh',
    chargeKwh: 12450.0,
    dischargeKwh: 10831.5,
    revenueYuan: 8420.5,
    efficiency: 87.0,
    gridChargeRatio: 28.5,
    greenChargeRatio: 71.5,
    criticalPeakDischargeRatio: 62.0,
    peakDischargeRatio: 38.0,
    monthlyChargeWanKwh: 37.35,
    monthlyDischargeWanKwh: 32.49,
    monthlyRevenueWan: 25.26,
    carbonReductionTons: 186.0,
    calcContext: {
      criticalPeakPrice: 1.28,
      peakPrice: 0.98,
      flatPrice: 0.65,
      valleyPrice: 0.32,
      greenPowerPrice: 0.42,
      gridChargeKwh: 3548.25,
      greenChargeKwh: 8901.75,
      criticalDischargeKwh: 6715.53,
      peakDischargeKwh: 4115.97,
      dischargeIncomeYuan: 12629.53,
      chargeCostYuan: 4209.03,
      roundTripLossKwh: 1618.5,
      formula: '收益 = (尖段放电量×尖电价 + 峰段放电量×峰电价) - (谷段市充量×谷电价 + 绿充电量×绿电价)',
    },
  },
  {
    id: 'st-02',
    name: '鲁缆公司 3MW/6MWh 智慧储能调峰电站',
    park: '特变电工华东输变电科技产业园',
    company: '鲁缆公司',
    capacity: '3MW / 6MWh',
    chargeKwh: 6200.0,
    dischargeKwh: 5394.0,
    revenueYuan: 4150.0,
    efficiency: 87.0,
    gridChargeRatio: 32.0,
    greenChargeRatio: 68.0,
    criticalPeakDischargeRatio: 58.0,
    peakDischargeRatio: 42.0,
    monthlyChargeWanKwh: 18.6,
    monthlyDischargeWanKwh: 16.18,
    monthlyRevenueWan: 12.45,
    carbonReductionTons: 98.0,
    calcContext: {
      criticalPeakPrice: 1.25,
      peakPrice: 0.95,
      flatPrice: 0.63,
      valleyPrice: 0.31,
      greenPowerPrice: 0.41,
      gridChargeKwh: 1984.0,
      greenChargeKwh: 4216.0,
      criticalDischargeKwh: 3128.52,
      peakDischargeKwh: 2265.48,
      dischargeIncomeYuan: 6062.86,
      chargeCostYuan: 1912.86,
      roundTripLossKwh: 806.0,
      formula: '综合效率 = (放电总量 / 充电总量) × 100%；收益 = 尖峰放电收益 - 谷平绿充成本',
    },
  },
  {
    id: 'st-03',
    name: '沈变本部 5MW/10MWh 工业级微网储能系统',
    park: '特变电工东北输变电产业园',
    company: '沈变公司',
    capacity: '5MW / 10MWh',
    chargeKwh: 10500.0,
    dischargeKwh: 9187.5,
    revenueYuan: 7120.0,
    efficiency: 87.5,
    gridChargeRatio: 25.0,
    greenChargeRatio: 75.0,
    criticalPeakDischargeRatio: 65.0,
    peakDischargeRatio: 35.0,
    monthlyChargeWanKwh: 31.5,
    monthlyDischargeWanKwh: 27.56,
    monthlyRevenueWan: 21.36,
    carbonReductionTons: 156.0,
    calcContext: {
      criticalPeakPrice: 1.28,
      peakPrice: 0.98,
      flatPrice: 0.65,
      valleyPrice: 0.32,
      greenPowerPrice: 0.42,
      gridChargeKwh: 2625.0,
      greenChargeKwh: 7875.0,
      criticalDischargeKwh: 5971.88,
      peakDischargeKwh: 3215.62,
      dischargeIncomeYuan: 10795.31,
      chargeCostYuan: 3675.0,
      roundTripLossKwh: 1312.5,
      formula: '尖放占比 = (尖段放电量 / 总放电量) × 100%；绿充占比 = (绿充电量 / 总充电量) × 100%',
    },
  },
  {
    id: 'st-04',
    name: '新变厂 4MW/8MWh 削峰填谷储能示范站',
    park: '特变电工新疆产业园',
    company: '新变厂',
    capacity: '4MW / 8MWh',
    chargeKwh: 8400.0,
    dischargeKwh: 7291.2,
    revenueYuan: 5380.0,
    efficiency: 86.8,
    gridChargeRatio: 20.0,
    greenChargeRatio: 80.0,
    criticalPeakDischargeRatio: 55.0,
    peakDischargeRatio: 45.0,
    monthlyChargeWanKwh: 25.2,
    monthlyDischargeWanKwh: 21.87,
    monthlyRevenueWan: 16.14,
    carbonReductionTons: 125.0,
    calcContext: {
      criticalPeakPrice: 1.22,
      peakPrice: 0.92,
      flatPrice: 0.60,
      valleyPrice: 0.28,
      greenPowerPrice: 0.38,
      gridChargeKwh: 1680.0,
      greenChargeKwh: 6720.0,
      criticalDischargeKwh: 4010.16,
      peakDischargeKwh: 3281.04,
      dischargeIncomeYuan: 7910.95,
      chargeCostYuan: 2530.95,
      roundTripLossKwh: 1108.8,
      formula: '收益 = (放电收入 - 充电成本)；市充占比 = (市电充电量 / 总充电量) × 100%',
    },
  },
]

// 模拟热泵效益详细台账数据
const HEAT_PUMP_BENEFIT_DATA: HeatPumpBenefitItem[] = [
  {
    id: 'hp-01',
    name: '德缆产业园 2.5MW 高温工业水源热泵系统',
    park: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    capacity: '2.5 MW (制热量)',
    gridPowerKwh: 4200.0,
    greenPowerKwh: 10800.0,
    gridCostYuan: 3150.0,
    greenCostYuan: 4536.0,
    greenPowerRatio: 72.0,
    peakRatio: 24.5,
    cop: 3.85,
    replacedGasM3: 3850,
    dailySavingsYuan: 6184.0,
    monthlySavingsWan: 18.55,
    carbonReductionTons: 82.0,
    calcContext: {
      gridAvgPrice: 0.75,
      greenAvgPrice: 0.42,
      gasPricePerM3: 3.6,
      gasThermalEfficiency: 0.88,
      heatOutputGj: 207.9,
      replacedGasCostYuan: 13860.0,
      heatPumpTotalCostYuan: 7686.0,
      formula: '净节费 = (替代天然气量×燃气单价) - (市电量×市电价 + 绿电量×绿电价)',
    },
  },
  {
    id: 'hp-02',
    name: '天变公司 1.8MW 真空干燥罐冷凝余热梯级利用改造',
    park: '特变电工天变产业园',
    company: '天变公司',
    capacity: '1.8 MW (制热量)',
    gridPowerKwh: 2800.0,
    greenPowerKwh: 7600.0,
    gridCostYuan: 2156.0,
    greenCostYuan: 3192.0,
    greenPowerRatio: 73.1,
    peakRatio: 22.0,
    cop: 4.12,
    replacedGasM3: 2680,
    dailySavingsYuan: 4300.0,
    monthlySavingsWan: 12.9,
    carbonReductionTons: 56.0,
    calcContext: {
      gridAvgPrice: 0.77,
      greenAvgPrice: 0.42,
      gasPricePerM3: 3.6,
      gasThermalEfficiency: 0.88,
      heatOutputGj: 153.8,
      replacedGasCostYuan: 9648.0,
      heatPumpTotalCostYuan: 5348.0,
      formula: '绿电占比 = (绿电量 / (市电量+绿电量)) × 100%；尖峰占比 = (尖峰时段用电量 / 总电量) × 100%',
    },
  },
  {
    id: 'hp-03',
    name: '沈变厂区 3.2MW 深层地源热泵集中供暖系统',
    park: '特变电工东北输变电产业园',
    company: '沈变公司',
    capacity: '3.2 MW (供暖/供热水)',
    gridPowerKwh: 5600.0,
    greenPowerKwh: 13400.0,
    gridCostYuan: 4368.0,
    greenCostYuan: 5628.0,
    greenPowerRatio: 70.5,
    peakRatio: 25.8,
    cop: 3.92,
    replacedGasM3: 4900,
    dailySavingsYuan: 7644.0,
    monthlySavingsWan: 22.93,
    carbonReductionTons: 105.0,
    calcContext: {
      gridAvgPrice: 0.78,
      greenAvgPrice: 0.42,
      gasPricePerM3: 3.6,
      gasThermalEfficiency: 0.88,
      heatOutputGj: 268.0,
      replacedGasCostYuan: 17640.0,
      heatPumpTotalCostYuan: 9996.0,
      formula: '节能量 = 产热量/COP折算用电与锅炉能耗差；减碳量 = 替代化石能源碳排 - 运行耗电碳排',
    },
  },
]

// 模拟光伏效益详细台账数据
const PV_BENEFIT_DATA: PvBenefitItem[] = [
  {
    id: 'pv-01',
    name: '沈变本部 12.8MWp 屋顶分布式光伏一期',
    park: '特变电工东北输变电产业园',
    company: '沈变公司',
    capacity: '12.8 MWp',
    dailyGenKwh: 48500.0,
    dailySelfKwh: 42680.0,
    dailyGridKwh: 5820.0,
    selfUseRatio: 88.0,
    selfSavingsYuan: 34144.0,
    gridRevenueYuan: 2211.6,
    totalBenefitYuan: 36355.6,
    dailyHours: 3.79,
    dailyCarbonTons: 25.95,
    monthlyGenWanKwh: 118.5,
    monthlyBenefitWan: 91.0,
    calcContext: {
      gridTariffAvg: 0.80,
      feedInTariff: 0.38,
      prRatio: 82.5,
      emissionFactor: 0.535,
      formula: '综合收益 = 自发自用电量×企业电价 + 上网电量×燃煤标杆上网电价',
    },
  },
  {
    id: 'pv-02',
    name: '新疆变压器厂区 20MWp 分布式光伏三期',
    park: '特变电工新疆产业园',
    company: '新变厂',
    capacity: '20.0 MWp',
    dailyGenKwh: 86000.0,
    dailySelfKwh: 73100.0,
    dailyGridKwh: 12900.0,
    selfUseRatio: 85.0,
    selfSavingsYuan: 54825.0,
    gridRevenueYuan: 4257.0,
    totalBenefitYuan: 59082.0,
    dailyHours: 4.3,
    dailyCarbonTons: 46.01,
    monthlyGenWanKwh: 210.0,
    monthlyBenefitWan: 150.0,
    calcContext: {
      gridTariffAvg: 0.75,
      feedInTariff: 0.33,
      prRatio: 84.0,
      emissionFactor: 0.535,
      formula: '自用比例 = (自用电量 / 总发电量) × 100%；等效利用小时 = 发电量 / 装机容量',
    },
  },
  {
    id: 'pv-03',
    name: '新缆厂 4.5MWp 屋顶分布式光伏二期',
    park: '特变电工新疆电缆产业园',
    company: '新缆厂',
    capacity: '4.5 MWp',
    dailyGenKwh: 18800.0,
    dailySelfKwh: 17296.0,
    dailyGridKwh: 1504.0,
    selfUseRatio: 92.0,
    selfSavingsYuan: 12972.0,
    gridRevenueYuan: 496.3,
    totalBenefitYuan: 13468.3,
    dailyHours: 4.18,
    dailyCarbonTons: 10.06,
    monthlyGenWanKwh: 45.8,
    monthlyBenefitWan: 32.7,
    calcContext: {
      gridTariffAvg: 0.75,
      feedInTariff: 0.33,
      prRatio: 83.2,
      emissionFactor: 0.535,
      formula: '减碳量 = 发电量(MWh) × 区域电网碳排放因子 (0.5350 tCO2/MWh)',
    },
  },
]

export default function BenefitEvaluationPage() {
  // 1. 顶部模块大 Tab 切换: 储能效益 | 热泵效益
  const [activeModule, setActiveModule] = useState<'storage' | 'heatpump'>('storage')

  // 2. 时间维度与范围选择
  const [timeDim, setTimeDim] = useState<'day' | 'month' | 'quarter' | 'year'>('month')
  const [selectedDate, setSelectedDate] = useState('2026-08-28')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  // 3. 算法计算详情弹窗状态
  const [selectedCalcDetail, setSelectedCalcDetail] = useState<{
    isOpen: boolean
    type: 'storage' | 'heatpump' | 'pv' | 'macro'
    data: any
  }>({
    isOpen: false,
    type: 'storage',
    data: null,
  })

  // 4. 宏观项目技术类型筛选 (全部综合视图下使用)
  const [macroFilterType, setMacroFilterType] = useState<string>('all')

  const filteredMacroProjects = useMemo(() => {
    return ALL_PROJECT_BENEFITS.filter((p) => {
      if (macroFilterType !== 'all' && p.type !== macroFilterType) return false
      return true
    })
  }, [macroFilterType])

  // 宏观 KPI 汇总指标
  const summaryStats = useMemo(() => {
    let multiplier = 1.0
    if (timeDim === 'day') multiplier = 1 / 30
    else if (timeDim === 'quarter') multiplier = 3.0
    else if (timeDim === 'year') multiplier = 12.0
    else if (timeDim === 'month') multiplier = 1.0

    const totalSavingsWan = filteredMacroProjects.reduce(
      (acc, p) => acc + (p.savingsYuan + (p.arbitrageYuan || 0)) * multiplier,
      0,
    )
    const totalCarbonTons = filteredMacroProjects.reduce((acc, p) => acc + p.carbonReduction * multiplier, 0)
    const totalTce = filteredMacroProjects.reduce((acc, p) => acc + p.tceSaving * multiplier, 0)
    const avgIrr =
      filteredMacroProjects.length > 0
        ? (filteredMacroProjects.reduce((acc, p) => acc + parseFloat(p.irr), 0) / filteredMacroProjects.length).toFixed(1)
        : '0.0'
    const avgPayback =
      filteredMacroProjects.length > 0
        ? (filteredMacroProjects.reduce((acc, p) => acc + p.paybackYears, 0) / filteredMacroProjects.length).toFixed(1)
        : '0.0'

    return {
      totalSavingsWan: totalSavingsWan.toFixed(1),
      totalCarbonTons: totalCarbonTons.toFixed(1),
      totalTce: totalTce.toFixed(1),
      avgIrr: `${avgIrr}%`,
      avgPayback: `${avgPayback} 年`,
    }
  }, [filteredMacroProjects, timeDim])

  // 储能模块专用汇总指标
  const storageSummary = useMemo(() => {
    const totalCharge = STORAGE_BENEFIT_DATA.reduce((acc, item) => acc + item.chargeKwh, 0)
    const totalDischarge = STORAGE_BENEFIT_DATA.reduce((acc, item) => acc + item.dischargeKwh, 0)
    const totalRev = STORAGE_BENEFIT_DATA.reduce((acc, item) => acc + item.revenueYuan, 0)
    const avgEff = (totalDischarge / totalCharge) * 100
    const avgGreenChargeRatio = (STORAGE_BENEFIT_DATA.reduce((acc, i) => acc + i.greenChargeRatio, 0) / STORAGE_BENEFIT_DATA.length).toFixed(1)
    const avgCritPeakDischarge = (STORAGE_BENEFIT_DATA.reduce((acc, i) => acc + i.criticalPeakDischargeRatio, 0) / STORAGE_BENEFIT_DATA.length).toFixed(1)
    const totalMonthlyWan = STORAGE_BENEFIT_DATA.reduce((acc, item) => acc + item.monthlyRevenueWan, 0)

    return {
      totalDailyChargeKwh: totalCharge.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalDailyDischargeKwh: totalDischarge.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalDailyRevenueYuan: totalRev.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      avgEfficiency: `${avgEff.toFixed(1)}%`,
      avgGreenChargeRatio: `${avgGreenChargeRatio}%`,
      avgCritPeakDischarge: `${avgCritPeakDischarge}%`,
      totalMonthlyWan: totalMonthlyWan.toFixed(2),
    }
  }, [])

  // 热泵模块专用汇总指标
  const heatPumpSummary = useMemo(() => {
    const totalGridKwh = HEAT_PUMP_BENEFIT_DATA.reduce((acc, item) => acc + item.gridPowerKwh, 0)
    const totalGreenKwh = HEAT_PUMP_BENEFIT_DATA.reduce((acc, item) => acc + item.greenPowerKwh, 0)
    const totalGridCost = HEAT_PUMP_BENEFIT_DATA.reduce((acc, item) => acc + item.gridCostYuan, 0)
    const totalGreenCost = HEAT_PUMP_BENEFIT_DATA.reduce((acc, item) => acc + item.greenCostYuan, 0)
    const totalPower = totalGridKwh + totalGreenKwh
    const greenRatio = ((totalGreenKwh / totalPower) * 100).toFixed(1)
    const avgPeakRatio = (HEAT_PUMP_BENEFIT_DATA.reduce((acc, i) => acc + i.peakRatio, 0) / HEAT_PUMP_BENEFIT_DATA.length).toFixed(1)
    const totalDailySavings = HEAT_PUMP_BENEFIT_DATA.reduce((acc, item) => acc + item.dailySavingsYuan, 0)
    const totalMonthlySavingsWan = HEAT_PUMP_BENEFIT_DATA.reduce((acc, item) => acc + item.monthlySavingsWan, 0)

    return {
      totalGridKwh: totalGridKwh.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalGreenKwh: totalGreenKwh.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalGridCost: totalGridCost.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalGreenCost: totalGreenCost.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      greenRatio: `${greenRatio}%`,
      avgPeakRatio: `${avgPeakRatio}%`,
      totalDailySavings: totalDailySavings.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalMonthlySavingsWan: totalMonthlySavingsWan.toFixed(2),
    }
  }, [])

  // 光伏模块专用汇总指标
  const pvSummary = useMemo(() => {
    const totalDailyGen = PV_BENEFIT_DATA.reduce((acc, item) => acc + item.dailyGenKwh, 0)
    const totalSelfKwh = PV_BENEFIT_DATA.reduce((acc, item) => acc + item.dailySelfKwh, 0)
    const totalGridKwh = PV_BENEFIT_DATA.reduce((acc, item) => acc + item.dailyGridKwh, 0)
    const avgSelfUseRatio = ((totalSelfKwh / totalDailyGen) * 100).toFixed(1)
    const totalDailyBenefit = PV_BENEFIT_DATA.reduce((acc, item) => acc + item.totalBenefitYuan, 0)
    const totalMonthlyBenefitWan = PV_BENEFIT_DATA.reduce((acc, item) => acc + item.monthlyBenefitWan, 0)
    const totalCarbonReduction = PV_BENEFIT_DATA.reduce((acc, item) => acc + item.dailyCarbonTons, 0)

    return {
      totalDailyGen: totalDailyGen.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalSelfKwh: totalSelfKwh.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalGridKwh: totalGridKwh.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      avgSelfUseRatio: `${avgSelfUseRatio}%`,
      totalDailyBenefit: totalDailyBenefit.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalMonthlyBenefitWan: totalMonthlyBenefitWan.toFixed(2),
      totalCarbonReduction: totalCarbonReduction.toFixed(1),
    }
  }, [])

  // 历史月度趋势数据
  const monthlyBenefitTrendData = [
    { time: '1月', 累计节费: 42.5, 碳减排量: 340, 标煤节约: 78 },
    { time: '2月', 累计节费: 86.0, 碳减排量: 690, 标煤节约: 158 },
    { time: '3月', 累计节费: 135.2, 碳减排量: 1080, 标煤节约: 246 },
    { time: '4月', 累计节费: 188.4, 碳减排量: 1510, 标煤节约: 345 },
    { time: '5月', 累计节费: 246.8, 碳减排量: 1980, 标煤节约: 452 },
    { time: '6月', 累计节费: 312.0, 碳减排量: 2500, 标煤节约: 572 },
    { time: '7月', 累计节费: 385.6, 碳减排量: 3090, 标煤节约: 708 },
    { time: '8月', 累计节费: 462.5, 碳减排量: 3710, 标煤节约: 850 },
  ]

  // 储能充放电与套利趋势图数据
  const storageTrendData = [
    { time: '8/22', 充电量: 37.2, 放电量: 32.4, 套利收益: 2.51 },
    { time: '8/23', 充电量: 36.8, 放电量: 32.1, 套利收益: 2.48 },
    { time: '8/24', 充电量: 38.5, 放电量: 33.6, 套利收益: 2.62 },
    { time: '8/25', 充电量: 37.9, 放电量: 33.0, 套利收益: 2.56 },
    { time: '8/26', 充电量: 39.1, 放电量: 34.2, 套利收益: 2.68 },
    { time: '8/27', 充电量: 38.2, 放电量: 33.3, 套利收益: 2.59 },
    { time: '8/28', 充电量: 37.55, 放电量: 32.7, 套利收益: 2.51 },
  ]

  // 热泵电量与用能成本对比
  const heatPumpTrendData = [
    { time: '8/22', 市电量: 1.25, 绿电量: 3.18, 节约气费: 1.82 },
    { time: '8/23', 市电量: 1.22, 绿电量: 3.15, 节约气费: 1.79 },
    { time: '8/24', 市电量: 1.30, 绿电量: 3.25, 节约气费: 1.88 },
    { time: '8/25', 市电量: 1.28, 绿电量: 3.20, 节约气费: 1.84 },
    { time: '8/26', 市电量: 1.32, 绿电量: 3.30, 节约气费: 1.91 },
    { time: '8/27', 市电量: 1.27, 绿电量: 3.22, 节约气费: 1.85 },
    { time: '8/28', 市电量: 1.26, 绿电量: 3.18, 节约气费: 1.81 },
  ]

  // 打开计算推导演练弹窗
  const handleOpenCalcDetail = (type: 'storage' | 'heatpump' | 'pv' | 'macro', item: any) => {
    setSelectedCalcDetail({
      isOpen: true,
      type,
      data: item,
    })
  }

  return (
    <div className="space-y-3.5 font-sans pb-10 text-foreground">
      {/* 1. 顶部 Header (主标题 + 模块分类选择 + 时间控件 + 数据导出) */}
      <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Coins className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">项目运行评估</h1>
          </div>
        </div>

        {/* 右侧：时间维度与导出 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 维度切换按钮组 */}
          <div className="flex items-center gap-1 bg-panel p-0.5 rounded-lg text-xs font-sans border border-border">
            {[
              { key: 'day', label: '日' },
              { key: 'month', label: '月度' },
              { key: 'quarter', label: '季度' },
              { key: 'year', label: '年度' },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setTimeDim(p.key as any)}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === p.key
                    ? 'font-bold bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* 时间选择器 */}
          {timeDim === 'day' && (
            <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
              />
            </div>
          )}

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
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => alert('已导出项目经济效益台账与算法核算报告 (Excel / PDF)！')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-foreground bg-panel hover:bg-accent/40 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="size-3.5 text-muted-foreground" />
            <span>导出报表</span>
          </button>
        </div>
      </div>

      {/* 2. 核心大模块导航选项卡 (储能效益评估 | 热泵效益评估) */}
      <div className="bg-card p-2 rounded-xl border border-border shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            {
              key: 'storage',
              label: '储能效益评估',
              icon: BatteryCharging,
              color: 'text-primary',
              activeBg: 'bg-primary/20 border-primary/30 text-primary',
            },
            {
              key: 'heatpump',
              label: '热泵效益评估',
              icon: Flame,
              color: 'text-amber-400',
              activeBg: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
            },
          ].map((m) => {
            const Icon = m.icon
            const isActive = activeModule === m.key
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setActiveModule(m.key as any)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg border text-left transition-all cursor-pointer select-none shrink-0',
                  isActive
                    ? `${m.activeBg} font-bold shadow-2xs`
                    : 'bg-panel border-border text-muted-foreground hover:text-foreground hover:bg-accent/30',
                )}
              >
                <div
                  className={cn(
                    'size-6 rounded-md flex items-center justify-center shrink-0',
                    isActive ? 'bg-card shadow-2xs' : 'bg-panel text-muted-foreground',
                  )}
                >
                  <Icon className={cn('size-3.5', isActive && m.color)} />
                </div>
                <span className="text-xs leading-none font-bold">{m.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 模块 A：储能效益评估 (Storage Benefit Module) */}
      {/* ========================================================================= */}
      {activeModule === 'storage' && (
        <div className="space-y-3.5">
          {/* 储能 8 大核心评估指标卡 (双行 4x2 布局) */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2.5">
            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">日充电量</span>
                <BatteryCharging className="size-3.5 text-primary" />
              </div>
              <div className="text-base font-bold font-mono text-foreground">
                {storageSummary.totalDailyChargeKwh}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">kWh (当期合计)</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">日放电量</span>
                <Zap className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono text-foreground">
                {storageSummary.totalDailyDischargeKwh}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">kWh (尖峰消纳)</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">日套利收益</span>
                <Coins className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                ¥{storageSummary.totalDailyRevenueYuan}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                月累 ¥{storageSummary.totalMonthlyWan}万
              </div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">综合效率</span>
                <Gauge className="size-3.5 text-primary" />
              </div>
              <div className="text-base font-bold font-mono text-primary">
                {storageSummary.avgEfficiency}
              </div>
              <div className="text-[10px] text-primary font-mono mt-0.5">放电 / 充电比</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">市充占比</span>
                <Activity className="size-3.5 text-muted-foreground" />
              </div>
              <div className="text-base font-bold font-mono text-foreground">
                {(100 - parseFloat(storageSummary.avgGreenChargeRatio)).toFixed(1)}%
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">夜间谷电市充</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">绿充占比</span>
                <Leaf className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {storageSummary.avgGreenChargeRatio}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">光伏绿电直充</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">尖放占比</span>
                <TrendingUp className="size-3.5 text-purple-400" />
              </div>
              <div className="text-base font-bold font-mono text-purple-400">
                {storageSummary.avgCritPeakDischarge}
              </div>
              <div className="text-[10px] text-purple-400 font-mono mt-0.5">尖峰高电价释放</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">峰放占比</span>
                <TrendingUp className="size-3.5 text-primary" />
              </div>
              <div className="text-base font-bold font-mono text-primary">
                {(100 - parseFloat(storageSummary.avgCritPeakDischarge)).toFixed(1)}%
              </div>
              <div className="text-[10px] text-primary font-mono mt-0.5">高峰时段放电</div>
            </div>
          </div>

          {/* 储能图表分析区 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    储能系统充放电量时序平衡与峰谷套利收益趋势
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  充电量 (千kWh) / 放电量 (千kWh) / 套利收益 (千元)
                </span>
              </div>
              <div className="h-[240px]">
                <LineTrend
                  data={storageTrendData}
                  xKey="time"
                  height={240}
                  lines={[
                    { key: '充电量', name: '日充电量 (千kWh)', color: '#1677ff' },
                    { key: '放电量', name: '日放电量 (千kWh)', color: '#52c41a' },
                    { key: '套利收益', name: '套利净收益 (千元)', color: '#fa8c16' },
                  ]}
                />
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    <h3 className="text-xs font-bold text-foreground">储能充电来源与放电时段结构</h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground">综合平均</span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-muted-foreground mb-1 text-[11px]">
                      <span>绿电充电占比 vs 市电充电</span>
                      <span className="font-bold text-emerald-400">绿 71.5% / 市 28.5%</span>
                    </div>
                    <div className="w-full bg-panel rounded-full h-2 flex overflow-hidden">
                      <div className="bg-emerald-500 h-2" style={{ width: '71.5%' }} />
                      <div className="bg-muted-foreground/40 h-2" style={{ width: '28.5%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-muted-foreground mb-1 text-[11px]">
                      <span>尖峰放电占比 vs 高峰放电</span>
                      <span className="font-bold text-purple-400">尖 62.0% / 峰 38.0%</span>
                    </div>
                    <div className="w-full bg-panel rounded-full h-2 flex overflow-hidden">
                      <div className="bg-purple-500 h-2" style={{ width: '62%' }} />
                      <div className="bg-primary h-2" style={{ width: '38%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-panel border border-border text-[11px] text-foreground font-sans mt-3 space-y-1">
                <div className="font-bold flex items-center gap-1 text-primary">
                  <Sparkles className="size-3.5 text-primary" /> 储能套利调度策略
                </div>
                <p className="text-[10px] text-muted-foreground">
                  采用「午间光伏富余大发绿充 + 夜间深谷低价市充」以及「早尖峰 + 晚高峰两充两放」智能调度策略，最大化电价差套利收益。
                </p>
              </div>
            </div>
          </div>

          {/* 储能效益台账明细表 (含用户要求的全部 8 项指标 + 详情按钮) */}
          <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-panel">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                <h3 className="text-xs font-bold text-foreground">储能电站效益评估与充放电台账明细表</h3>
                <span className="text-[10px] text-muted-foreground font-mono">
                  共 {STORAGE_BENEFIT_DATA.length} 个电站
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                数据更新频率：每日0点自动结算日账单
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-panel text-muted-foreground font-bold border-b border-border font-sans">
                    <th className="py-2.5 px-3 whitespace-nowrap">储能项目名称</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">额定规模</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">日充电量 (kWh)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">日放电量 (kWh)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">日套利收益 (元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">综合效率</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">市充占比</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">绿充占比</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">尖放占比</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">峰放占比</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">月累收益 (万元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">数值计算推导</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono text-foreground">
                  {STORAGE_BENEFIT_DATA.map((item) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-foreground">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-muted-foreground">
                        <div className="text-foreground">{item.company}</div>
                        <div className="text-[10px] text-muted-foreground">{item.park}</div>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-primary">{item.capacity}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-foreground">
                        {item.chargeKwh.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-foreground">
                        {item.dischargeKwh.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ¥{item.revenueYuan.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-primary">
                        {item.efficiency}%
                      </td>
                      <td className="py-2.5 px-3 text-center text-muted-foreground">
                        {item.gridChargeRatio}%
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-400">
                        {item.greenChargeRatio}%
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-purple-400">
                        {item.criticalPeakDischargeRatio}%
                      </td>
                      <td className="py-2.5 px-3 text-center text-primary">
                        {item.peakDischargeRatio}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ¥{item.monthlyRevenueWan}
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <button
                          type="button"
                          onClick={() => handleOpenCalcDetail('storage', item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/20 text-primary hover:bg-primary/30 text-[11px] font-sans font-bold transition-all border border-primary/30 cursor-pointer shadow-2xs"
                        >
                          <Calculator className="size-3" />
                          <span>算法详情</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 模块 B：热泵效益评估 (Heat Pump Benefit Module) */}
      {/* ========================================================================= */}
      {activeModule === 'heatpump' && (
        <div className="space-y-3.5">
          {/* 热泵 8 大核心评估指标卡 (双行 4x2 布局) */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2.5">
            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">市电量</span>
                <Zap className="size-3.5 text-muted-foreground" />
              </div>
              <div className="text-base font-bold font-mono text-foreground">
                {heatPumpSummary.totalGridKwh}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">kWh (市网外购)</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">绿电量</span>
                <Leaf className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {heatPumpSummary.totalGreenKwh}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">kWh (光伏消纳)</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">市电费</span>
                <DollarSign className="size-3.5 text-muted-foreground" />
              </div>
              <div className="text-base font-bold font-mono text-foreground">
                ¥{heatPumpSummary.totalGridCost}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">元 (综合电费)</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">绿电费</span>
                <DollarSign className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                ¥{heatPumpSummary.totalGreenCost}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">元 (绿电交易)</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">绿电占比</span>
                <Leaf className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {heatPumpSummary.greenRatio}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">清洁电力替代率</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">尖峰占比</span>
                <Flame className="size-3.5 text-amber-400" />
              </div>
              <div className="text-base font-bold font-mono text-amber-400">
                {heatPumpSummary.avgPeakRatio}
              </div>
              <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">峰段运行负荷</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">日节费收益</span>
                <Coins className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                ¥{heatPumpSummary.totalDailySavings}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">相比传统燃气</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">月累计节费</span>
                <TrendingUp className="size-3.5 text-primary" />
              </div>
              <div className="text-base font-bold font-mono text-primary">
                ¥{heatPumpSummary.totalMonthlySavingsWan} <span className="text-xs">万</span>
              </div>
              <div className="text-[10px] text-primary font-mono mt-0.5">万元 / 当期</div>
            </div>
          </div>

          {/* 热泵图表分析区 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    热泵用电结构 (市电/绿电) 与替代化石燃料费用节约时序趋势
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  市电量 (万kWh) / 绿电量 (万kWh) / 节约气费 (万元)
                </span>
              </div>
              <div className="h-[240px]">
                <LineTrend
                  data={heatPumpTrendData}
                  xKey="time"
                  height={240}
                  lines={[
                    { key: '绿电量', name: '绿电用量 (万kWh)', color: '#52c41a' },
                    { key: '市电量', name: '市网用电 (万kWh)', color: '#1677ff' },
                    { key: '节约气费', name: '替代燃气节费 (万元)', color: '#fa8c16' },
                  ]}
                />
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-400" />
                    <h3 className="text-xs font-bold text-foreground">热泵供热替代效益模型</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">COP 3.96 (加权)</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-muted-foreground mb-1 text-[11px]">
                      <span>能源消费清洁化占比 (绿电比例)</span>
                      <span className="font-bold text-emerald-400">72.0%</span>
                    </div>
                    <div className="w-full bg-panel rounded-full h-2 flex overflow-hidden">
                      <div className="bg-emerald-500 h-2" style={{ width: '72%' }} />
                      <div className="bg-muted-foreground/30 h-2" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-panel border border-border space-y-1.5 text-[11px] text-foreground">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">替代天然气单价基准：</span>
                      <span className="font-bold font-mono">¥3.60 元/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">原燃气锅炉综合热效率：</span>
                      <span className="font-bold font-mono">88.0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">热泵综合能效 COP：</span>
                      <span className="font-bold font-mono text-emerald-400">3.85 ~ 4.12</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-panel border border-border text-[11px] text-foreground font-sans mt-3">
                <div className="font-bold flex items-center gap-1 text-amber-400">
                  <Flame className="size-3.5 text-amber-400" /> 热泵替代天然气效益测算
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  1份电能可驱动产生近 4 份热能，且 72% 以上由光伏绿电驱动，实现零碳排供热与大幅度运行成本削减。
                </p>
              </div>
            </div>
          </div>

          {/* 热泵效益台账明细表 (含用户要求的全部 6 项指标 + 详情按钮) */}
          <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-panel">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-400" />
                <h3 className="text-xs font-bold text-foreground">
                  工业水源/地源热泵效益评估与电费节费明细表
                </h3>
                <span className="text-[10px] text-muted-foreground font-mono">
                  共 {HEAT_PUMP_BENEFIT_DATA.length} 个项目
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                数据采集：智能热量表 + 绿电分时计量表
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-panel text-muted-foreground font-bold border-b border-border font-sans">
                    <th className="py-2.5 px-3 whitespace-nowrap">热泵项目名称</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">装机热功率</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">市电量 (kWh)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">绿电量 (kWh)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">市电费 (元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">绿电费 (元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">绿电占比</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">尖峰占比</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">替代天然气 (m³)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">日节费 (元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">月节费 (万元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">数值计算推导</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono text-foreground">
                  {HEAT_PUMP_BENEFIT_DATA.map((item) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-foreground">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-muted-foreground">
                        <div className="text-foreground">{item.company}</div>
                        <div className="text-[10px] text-muted-foreground">{item.park}</div>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-amber-400">{item.capacity}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-foreground">
                        {item.gridPowerKwh.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        {item.greenPowerKwh.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground">
                        ¥{item.gridCostYuan.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ¥{item.greenCostYuan.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-400">
                        {item.greenPowerRatio}%
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-400">
                        {item.peakRatio}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-foreground">
                        {item.replacedGasM3.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ¥{item.dailySavingsYuan.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ¥{item.monthlySavingsWan}
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <button
                          type="button"
                          onClick={() => handleOpenCalcDetail('heatpump', item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-[11px] font-sans font-bold transition-all border border-amber-500/30 cursor-pointer shadow-2xs"
                        >
                          <Calculator className="size-3" />
                          <span>算法详情</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 模块 C：光伏效益评估 (Photovoltaic Benefit Module) */}
      {/* ========================================================================= */}
      {activeModule === 'pv' && (
        <div className="space-y-3.5">
          {/* 光伏核心指标卡 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">日总发电量</span>
                <Sun className="size-3.5 text-amber-400" />
              </div>
              <div className="text-base font-bold font-mono text-foreground">
                {pvSummary.totalDailyGen}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">kWh (清洁绿电)</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">自发自用量</span>
                <Zap className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {pvSummary.totalSelfKwh}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">kWh (厂内就地消纳)</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">余电上网量</span>
                <ArrowUpRight className="size-3.5 text-primary" />
              </div>
              <div className="text-base font-bold font-mono text-primary">
                {pvSummary.totalGridKwh}
              </div>
              <div className="text-[10px] text-primary font-mono mt-0.5">kWh (反送电网售电)</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">自用比例</span>
                <Gauge className="size-3.5 text-primary" />
              </div>
              <div className="text-base font-bold font-mono text-primary">
                {pvSummary.avgSelfUseRatio}
              </div>
              <div className="text-[10px] text-primary font-mono mt-0.5">就地消纳率</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">日综合收益</span>
                <Coins className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                ¥{pvSummary.totalDailyBenefit}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">含自用节费+上网</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">月累计收益</span>
                <TrendingUp className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                ¥{pvSummary.totalMonthlyBenefitWan} <span className="text-xs font-sans">万元</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">万元 / 当期</div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px]">日核证减碳</span>
                <Leaf className="size-3.5 text-purple-400" />
              </div>
              <div className="text-base font-bold font-mono text-purple-400">
                {pvSummary.totalCarbonReduction} <span className="text-xs font-sans">tCO₂</span>
              </div>
              <div className="text-[10px] text-purple-400 font-mono mt-0.5">吨二氧化碳减排</div>
            </div>
          </div>

          {/* 光伏效益台账明细表 */}
          <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-panel">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-400" />
                <h3 className="text-xs font-bold text-foreground">
                  屋顶分布式光伏项目发电效益与电费节约明细表
                </h3>
                <span className="text-[10px] text-muted-foreground font-mono">
                  共 {PV_BENEFIT_DATA.length} 个光伏电站
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                计量源：关口双向电表 + 逆变器通信网关
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-panel text-muted-foreground font-bold border-b border-border font-sans">
                    <th className="py-2.5 px-3 whitespace-nowrap">光伏项目名称</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">装机容量</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">日发电量 (kWh)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">自用电量 (kWh)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">上网电量 (kWh)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">自用比例</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">自用节费 (元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">上网收益 (元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">日综合效益 (元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">等效小时 (h)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">月累收益 (万元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">数值计算推导</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono text-foreground">
                  {PV_BENEFIT_DATA.map((item) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-foreground">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-muted-foreground">
                        <div className="text-foreground">{item.company}</div>
                        <div className="text-[10px] text-muted-foreground">{item.park}</div>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-amber-400">{item.capacity}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-foreground">
                        {item.dailyGenKwh.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        {item.dailySelfKwh.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-primary">
                        {item.dailyGridKwh.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-400">
                        {item.selfUseRatio}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ¥{item.selfSavingsYuan.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-primary">
                        ¥{item.gridRevenueYuan.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ¥{item.totalBenefitYuan.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-400">
                        {item.dailyHours} h
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ¥{item.monthlyBenefitWan}
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <button
                          type="button"
                          onClick={() => handleOpenCalcDetail('pv', item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-[11px] font-sans font-bold transition-all border border-amber-500/30 cursor-pointer shadow-2xs"
                        >
                          <Calculator className="size-3" />
                          <span>算法详情</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 模块 D：全景综合评估 (Overview Module) */}
      {/* ========================================================================= */}
      {activeModule === 'overview' && (
        <div className="space-y-3.5">
          {/* 4 大宏观效益 KPI 仪表板 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">经济效益：当期节费与收益</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  ¥{summaryStats.totalSavingsWan} <span className="text-xs font-sans text-muted-foreground font-normal">万元</span>
                </div>
                <span className="text-[10px] text-emerald-400 block mt-1 font-mono">
                  含电费节约 + 峰谷套利收益
                </span>
              </div>
              <div className="size-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Coins className="size-4.5" />
              </div>
            </div>

            <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">环保效益：核证碳减排量</span>
                <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">
                  {summaryStats.totalCarbonTons} <span className="text-xs font-sans text-muted-foreground font-normal">tCO₂</span>
                </div>
                <span className="text-[10px] text-purple-400 block mt-1 font-mono">
                  折合标煤节约 {summaryStats.totalTce} tce
                </span>
              </div>
              <div className="size-9 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <CheckCircle2 className="size-4.5" />
              </div>
            </div>

            <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">加权实测内部收益率 (IRR)</span>
                <div className="text-xl font-bold font-mono text-primary mt-0.5">
                  {summaryStats.avgIrr}
                </div>
                <span className="text-[10px] text-muted-foreground block mt-1 font-mono">
                  立项测算基准基线 14.0%
                </span>
              </div>
              <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <TrendingUp className="size-4.5" />
              </div>
            </div>

            <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">加权平均动态投资回收期</span>
                <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                  {summaryStats.avgPayback}
                </div>
                <span className="text-[10px] text-muted-foreground block mt-1 font-mono">
                  全投资回收周期基准 5.0 年
                </span>
              </div>
              <div className="size-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Calendar className="size-4.5" />
              </div>
            </div>
          </div>

          {/* 累计趋势与 MACC 成本阶梯 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    零碳项目月度累计节费收益与核证碳减排时序增长趋势
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  累计节费 (万元) / 碳减排量 (tCO₂) / 标煤节约 (tce)
                </span>
              </div>

              <div className="h-[260px]">
                <LineTrend
                  data={monthlyBenefitTrendData}
                  xKey="time"
                  height={260}
                  lines={[
                    { key: '累计节费', name: '累计节费 (万元)', color: '#10b981' },
                    { key: '碳减排量', name: '核证碳减排 (tCO₂)', color: '#8b5cf6' },
                    { key: '标煤节约', name: '标煤节约 (tce)', color: '#f59e0b' },
                  ]}
                />
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-purple-400" />
                    <h3 className="text-xs font-bold text-foreground">各技术路线单位减排成本 (MACC)</h3>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold">元/tCO₂</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-mono mb-3">
                  注：负值代表项目自带自偿性财务回报（节费覆盖投资）
                </p>

                <div className="space-y-4 font-mono text-xs pt-2">
                  <div>
                    <div className="flex items-center justify-between text-foreground mb-1">
                      <span className="font-bold truncate max-w-[150px]">屋顶分布式光伏</span>
                      <span className="text-emerald-400 font-bold">-145 元/吨</span>
                    </div>
                    <div className="w-full bg-panel rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-foreground mb-1">
                      <span className="font-bold truncate max-w-[150px]">工业水源热泵</span>
                      <span className="text-emerald-400 font-bold">-112 元/吨</span>
                    </div>
                    <div className="w-full bg-panel rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-foreground mb-1">
                      <span className="font-bold truncate max-w-[150px]">用户侧储能调峰</span>
                      <span className="text-primary font-bold">-48 元/吨</span>
                    </div>
                    <div className="w-full bg-panel rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-panel border border-border text-[10px] text-muted-foreground font-mono mt-2">
                依据标准：MACC = (总投资折现 + 运维折现 - 节电收益折现) / 累计核证碳减排量
              </div>
            </div>
          </div>

          {/* 全技术总表 */}
          <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-border/60 flex flex-wrap items-center justify-between gap-3 bg-panel">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                <h3 className="text-xs font-bold text-foreground">
                  光伏、储能、热泵等零碳项目经济效益与环保指标总览表
                </h3>
                <span className="text-[10px] text-muted-foreground font-mono">
                  共 {filteredMacroProjects.length} 项
                </span>
              </div>

              <div className="flex items-center gap-1 bg-panel p-0.5 rounded-lg text-xs font-sans border border-border">
                {[
                  { key: 'all', label: '全部项目' },
                  { key: '分布式光伏', label: '光伏项目' },
                  { key: '用户侧储能', label: '储能项目' },
                  { key: '工业热泵', label: '热泵项目' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setMacroFilterType(tab.key)}
                    className={cn(
                      'px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium',
                      macroFilterType === tab.key
                        ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-panel text-muted-foreground font-bold border-b border-border font-sans">
                    <th className="py-2.5 px-3 whitespace-nowrap">项目名称</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">技术类型</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">所属单位 / 园区</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">装机规模</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">总投资 (万元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">当期实际产电/替代</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">当期节费与收益 (万元)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">核证碳减排 (tCO₂)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">实测 IRR</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">回收期 (年)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">减排成本 MACC</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center">算法推导</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono text-foreground">
                  {filteredMacroProjects.map((item) => (
                    <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-foreground">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded bg-panel text-muted-foreground text-[10px] font-medium border border-border">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-muted-foreground">
                        <div className="text-foreground">{item.base}</div>
                        <div className="text-[10px] text-muted-foreground">{item.park}</div>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-foreground">{item.capacity}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-foreground">
                        ¥{item.investment.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-foreground">
                        {item.actualGenKwh}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        ¥{(item.savingsYuan + (item.arbitrageYuan || 0)).toFixed(1)} 万元
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-400">
                        {item.carbonReduction.toLocaleString()} 吨
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-primary">
                        {item.irr}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-400">
                        {item.paybackYears} 年
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        {item.macc} 元/吨
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.type === '用户侧储能') {
                              const sItem = STORAGE_BENEFIT_DATA[0]
                              handleOpenCalcDetail('storage', { ...sItem, name: item.name })
                            } else if (item.type === '工业热泵') {
                              const hItem = HEAT_PUMP_BENEFIT_DATA[0]
                              handleOpenCalcDetail('heatpump', { ...hItem, name: item.name })
                            } else {
                              const pItem = PV_BENEFIT_DATA[0]
                              handleOpenCalcDetail('pv', { ...pItem, name: item.name })
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/20 text-primary hover:bg-primary/30 text-[11px] font-sans font-bold transition-all border border-primary/30 cursor-pointer shadow-2xs"
                        >
                          <Calculator className="size-3" />
                          <span>算法详情</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 核心弹窗：数值计算公式与推导演练溯源详情对话框 (加一详情按钮) */}
      {/* ========================================================================= */}
      {selectedCalcDetail.isOpen && selectedCalcDetail.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-foreground">
            {/* 弹窗 Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-panel">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                  <Calculator className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      效益指标算法公式与数值推导溯源详情
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 font-sans">
                      {selectedCalcDetail.type === 'storage' && '储能效益模型'}
                      {selectedCalcDetail.type === 'heatpump' && '热泵效益模型'}
                      {selectedCalcDetail.type === 'pv' && '光伏效益模型'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                    项目：<span className="font-bold text-foreground">{selectedCalcDetail.data.name}</span> (
                    {selectedCalcDetail.data.capacity})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCalcDetail({ isOpen: false, type: 'storage', data: null })}
                className="size-8 rounded-lg hover:bg-accent/40 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 弹窗 Body (可滚动) */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* 1. 项目计量上下文与数据采集源 */}
              <div className="bg-panel p-3 rounded-xl border border-border grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-muted-foreground block text-[10px] font-sans">所属园区/基地</span>
                  <span className="font-bold text-foreground font-sans">
                    {selectedCalcDetail.data.company}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-sans">计量源点位</span>
                  <span className="font-bold text-foreground font-sans">
                    {selectedCalcDetail.type === 'storage' && 'PCS变流柜双向智能表 #E-01'}
                    {selectedCalcDetail.type === 'heatpump' && '热泵进线计量表 + 超声波热量计'}
                    {selectedCalcDetail.type === 'pv' && '光伏并网防逆流双向关口表'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-sans">结算周期</span>
                  <span className="font-bold text-foreground">2026-08-28 (日结)</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-sans">数据核验状态</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1 font-sans">
                    <CheckCircle2 className="size-3" /> 双表对齐核验无误
                  </span>
                </div>
              </div>

              {/* 2. 储能模块算法与数值推导演练 */}
              {selectedCalcDetail.type === 'storage' && (
                <div className="space-y-3.5">
                  {/* 公式定义卡片 */}
                  <div className="p-3.5 rounded-xl bg-panel border border-border space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
                      <Sparkles className="size-4 text-primary" />
                      <span>储能 8 大指标数学模型与计算公式</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono text-muted-foreground">
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-primary font-bold block mb-0.5">① 综合充放效率 (η):</span>
                        η = (日放电量 / 日充电量) × 100%
                      </div>
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-primary font-bold block mb-0.5">② 净套利收益 (Revenue):</span>
                        Revenue = (尖放收益 + 峰放收益) - (市电充成本 + 绿电充成本)
                      </div>
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-primary font-bold block mb-0.5">③ 绿充占比 / 市充占比:</span>
                        绿充% = (绿充电量/总充电量)×100% ；市充% = (市充电量/总充电量)×100%
                      </div>
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-primary font-bold block mb-0.5">④ 尖放占比 / 峰放占比:</span>
                        尖放% = (尖段放电量/总放电量)×100% ；峰放% = (峰段放电量/总放电量)×100%
                      </div>
                    </div>
                  </div>

                  {/* 输入参数与分时电价矩阵 */}
                  <div>
                    <h4 className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                      <Sliders className="size-3.5 text-primary" />
                      <span>输入参数与分时电价清单</span>
                    </h4>
                    <table className="w-full text-[11px] text-left border-collapse border border-border rounded-lg overflow-hidden font-mono">
                      <thead className="bg-panel text-muted-foreground font-bold font-sans">
                        <tr>
                          <th className="p-2 border-b border-border">时段类型</th>
                          <th className="p-2 border-b border-border">电价费率 (元/kWh)</th>
                          <th className="p-2 border-b border-border text-right">充电量 (kWh)</th>
                          <th className="p-2 border-b border-border text-right">放电量 (kWh)</th>
                          <th className="p-2 border-b border-border text-right">费用/收入 (元)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        <tr>
                          <td className="p-2 font-sans font-medium text-purple-400">尖段 (18:00-20:00)</td>
                          <td className="p-2">¥{selectedCalcDetail.data.calcContext.criticalPeakPrice}</td>
                          <td className="p-2 text-right text-muted-foreground">0.0</td>
                          <td className="p-2 text-right font-bold text-purple-400">
                            {selectedCalcDetail.data.calcContext.criticalDischargeKwh.toLocaleString()}
                          </td>
                          <td className="p-2 text-right font-bold text-emerald-400">
                            +¥{(selectedCalcDetail.data.calcContext.criticalDischargeKwh * selectedCalcDetail.data.calcContext.criticalPeakPrice).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 font-sans font-medium text-primary">峰段 (08:30-11:30)</td>
                          <td className="p-2">¥{selectedCalcDetail.data.calcContext.peakPrice}</td>
                          <td className="p-2 text-right text-muted-foreground">0.0</td>
                          <td className="p-2 text-right font-bold text-primary">
                            {selectedCalcDetail.data.calcContext.peakDischargeKwh.toLocaleString()}
                          </td>
                          <td className="p-2 text-right font-bold text-emerald-400">
                            +¥{(selectedCalcDetail.data.calcContext.peakDischargeKwh * selectedCalcDetail.data.calcContext.peakPrice).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 font-sans font-medium text-emerald-400">
                            午间光伏绿电充 (12:00-14:00)
                          </td>
                          <td className="p-2">¥{selectedCalcDetail.data.calcContext.greenPowerPrice}</td>
                          <td className="p-2 text-right font-bold text-emerald-400">
                            {selectedCalcDetail.data.calcContext.greenChargeKwh.toLocaleString()}
                          </td>
                          <td className="p-2 text-right text-muted-foreground">0.0</td>
                          <td className="p-2 text-right font-bold text-rose-400">
                            -¥{(selectedCalcDetail.data.calcContext.greenChargeKwh * selectedCalcDetail.data.calcContext.greenPowerPrice).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 font-sans font-medium text-muted-foreground">
                            夜间深谷市电充 (00:00-06:00)
                          </td>
                          <td className="p-2">¥{selectedCalcDetail.data.calcContext.valleyPrice}</td>
                          <td className="p-2 text-right font-bold text-foreground">
                            {selectedCalcDetail.data.calcContext.gridChargeKwh.toLocaleString()}
                          </td>
                          <td className="p-2 text-right text-muted-foreground">0.0</td>
                          <td className="p-2 text-right font-bold text-rose-400">
                            -¥{(selectedCalcDetail.data.calcContext.gridChargeKwh * selectedCalcDetail.data.calcContext.valleyPrice).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 逐步代入演练过程 */}
                  <div className="bg-black/50 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] space-y-2 border border-border">
                    <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CodeBracketIcon className="size-3.5" /> 逐步代入数值计算演算步骤 (Step-by-Step Breakdown)
                    </div>
                    <div className="space-y-1 text-slate-300">
                      <div>
                        <span className="text-primary">Step 1 [综合效率]:</span>{' '}
                        {selectedCalcDetail.data.dischargeKwh} ÷ {selectedCalcDetail.data.chargeKwh} × 100% ={' '}
                        <span className="text-emerald-400 font-bold">{selectedCalcDetail.data.efficiency}%</span> (循环损耗 {selectedCalcDetail.data.calcContext.roundTripLossKwh} kWh)
                      </div>
                      <div>
                        <span className="text-primary">Step 2 [放电总收入]:</span>{' '}
                        ({selectedCalcDetail.data.calcContext.criticalDischargeKwh} × 1.28) + ({selectedCalcDetail.data.calcContext.peakDischargeKwh} × 0.98) ={' '}
                        <span className="text-emerald-400 font-bold">¥{selectedCalcDetail.data.calcContext.dischargeIncomeYuan.toFixed(2)} 元</span>
                      </div>
                      <div>
                        <span className="text-primary">Step 3 [充电总成本]:</span>{' '}
                        ({selectedCalcDetail.data.calcContext.greenChargeKwh} × 0.42) + ({selectedCalcDetail.data.calcContext.gridChargeKwh} × 0.32) ={' '}
                        <span className="text-rose-400 font-bold">¥{selectedCalcDetail.data.calcContext.chargeCostYuan.toFixed(2)} 元</span>
                      </div>
                      <div>
                        <span className="text-primary">Step 4 [净套利收益]:</span>{' '}
                        {selectedCalcDetail.data.calcContext.dischargeIncomeYuan.toFixed(2)} - {selectedCalcDetail.data.calcContext.chargeCostYuan.toFixed(2)} ={' '}
                        <span className="text-amber-400 font-bold text-xs">¥{selectedCalcDetail.data.revenueYuan} 元</span>
                      </div>
                      <div>
                        <span className="text-primary">Step 5 [结构占比]:</span>{' '}
                        绿充 {selectedCalcDetail.data.greenChargeRatio}% | 市充 {selectedCalcDetail.data.gridChargeRatio}% | 尖放 {selectedCalcDetail.data.criticalPeakDischargeRatio}% | 峰放 {selectedCalcDetail.data.peakDischargeRatio}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. 热泵模块算法与数值推导演练 */}
              {selectedCalcDetail.type === 'heatpump' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-panel border border-border space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
                      <Sparkles className="size-4 text-amber-400" />
                      <span>热泵 6 大核心指标与替代节费数学模型</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono text-muted-foreground">
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-amber-400 font-bold block mb-0.5">① 绿电用能占比:</span>
                        绿电占比 = [绿电量 / (市电量 + 绿电量)] × 100%
                      </div>
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-amber-400 font-bold block mb-0.5">② 尖峰负荷占比:</span>
                        尖峰占比 = (尖峰时段运行电量 / 总电量) × 100%
                      </div>
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-amber-400 font-bold block mb-0.5">③ 热泵总运行电费:</span>
                        总电费 = 市电量 × 市网加权价 + 绿电量 × 绿电协议价
                      </div>
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-amber-400 font-bold block mb-0.5">④ 替代化石节费收益:</span>
                        节费 = (替代天然气量 × 气价 ¥3.6) - 热泵运行总电费
                      </div>
                    </div>
                  </div>

                  {/* 详细逐步演算 */}
                  <div className="bg-black/50 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] space-y-2 border border-border">
                    <div className="text-amber-400 font-bold flex items-center gap-1.5">
                      <CodeBracketIcon className="size-3.5" /> 热泵用电与替代天然气实测演算 (Step-by-Step Breakdown)
                    </div>
                    <div className="space-y-1 text-slate-300">
                      <div>
                        <span className="text-amber-400">Step 1 [总电量与绿电占比]:</span>{' '}
                        {selectedCalcDetail.data.gridPowerKwh} (市) + {selectedCalcDetail.data.greenPowerKwh} (绿) ={' '}
                        {selectedCalcDetail.data.gridPowerKwh + selectedCalcDetail.data.greenPowerKwh} kWh ；
                        绿电占比 = <span className="text-emerald-400 font-bold">{selectedCalcDetail.data.greenPowerRatio}%</span>
                      </div>
                      <div>
                        <span className="text-amber-400">Step 2 [热泵综合电费]:</span>{' '}
                        ({selectedCalcDetail.data.gridPowerKwh} × 0.75) + ({selectedCalcDetail.data.greenPowerKwh} × 0.42) ={' '}
                        {selectedCalcDetail.data.gridCostYuan} + {selectedCalcDetail.data.greenCostYuan} ={' '}
                        <span className="text-rose-400 font-bold">¥{selectedCalcDetail.data.calcContext.heatPumpTotalCostYuan} 元</span>
                      </div>
                      <div>
                        <span className="text-amber-400">Step 3 [基准燃气锅炉等热量折算]:</span>{' '}
                        产供热量 {selectedCalcDetail.data.calcContext.heatOutputGj} GJ 需耗天然气 {selectedCalcDetail.data.replacedGasM3} m³ ；
                        燃气成本 = {selectedCalcDetail.data.replacedGasM3} × ¥3.60 ={' '}
                        <span className="text-amber-400 font-bold">¥{selectedCalcDetail.data.calcContext.replacedGasCostYuan} 元</span>
                      </div>
                      <div>
                        <span className="text-amber-400">Step 4 [净节费计算]:</span>{' '}
                        {selectedCalcDetail.data.calcContext.replacedGasCostYuan} (燃气基准) - {selectedCalcDetail.data.calcContext.heatPumpTotalCostYuan} (热泵电费) ={' '}
                        <span className="text-emerald-400 font-bold text-xs">¥{selectedCalcDetail.data.dailySavingsYuan} 元/天</span> (月累计 ¥{selectedCalcDetail.data.monthlySavingsWan} 万元)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. 光伏模块算法与数值推导演练 */}
              {selectedCalcDetail.type === 'pv' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-panel border border-border space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
                      <Sparkles className="size-4 text-amber-400" />
                      <span>光伏消纳与节费收益数学模型</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono text-muted-foreground">
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-amber-400 font-bold block mb-0.5">① 自发自用消纳比例:</span>
                        自用比例 = (自用电量 / 总发电量) × 100%
                      </div>
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-amber-400 font-bold block mb-0.5">② 综合电费节约与收益:</span>
                        收益 = 自用电量 × 替代工商业电价 + 上网电量 × 脱硫煤基准价
                      </div>
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-amber-400 font-bold block mb-0.5">③ 等效满发利用小时数:</span>
                        利用小时 = 当期总发电量(kWh) / 光伏额定装机容量(kWp)
                      </div>
                      <div className="bg-card p-2 rounded border border-border">
                        <span className="text-amber-400 font-bold block mb-0.5">④ 核证碳减排量 (tCO₂):</span>
                        减碳量 = 发电量(MWh) × 区域电网基线碳排放因子 (0.5350)
                      </div>
                    </div>
                  </div>

                  {/* 详细演算过程 */}
                  <div className="bg-black/50 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] space-y-2 border border-border">
                    <div className="text-amber-400 font-bold flex items-center gap-1.5">
                      <CodeBracketIcon className="size-3.5" /> 光伏发电效益逐步演算 (Step-by-Step Breakdown)
                    </div>
                    <div className="space-y-1 text-slate-300">
                      <div>
                        <span className="text-amber-400">Step 1 [发电与消纳分流]:</span>{' '}
                        日总发电 {selectedCalcDetail.data.dailyGenKwh} kWh = 自用 {selectedCalcDetail.data.dailySelfKwh} (
                        {selectedCalcDetail.data.selfUseRatio}%) + 上网 {selectedCalcDetail.data.dailyGridKwh} kWh
                      </div>
                      <div>
                        <span className="text-amber-400">Step 2 [自用节电效益]:</span>{' '}
                        {selectedCalcDetail.data.dailySelfKwh} kWh × ¥0.80/kWh ={' '}
                        <span className="text-emerald-400 font-bold">¥{selectedCalcDetail.data.selfSavingsYuan} 元</span>
                      </div>
                      <div>
                        <span className="text-amber-400">Step 3 [余电上网收益]:</span>{' '}
                        {selectedCalcDetail.data.dailyGridKwh} kWh × ¥0.38/kWh ={' '}
                        <span className="text-primary font-bold">¥{selectedCalcDetail.data.gridRevenueYuan} 元</span>
                      </div>
                      <div>
                        <span className="text-amber-400">Step 4 [日综合经济收益]:</span>{' '}
                        {selectedCalcDetail.data.selfSavingsYuan} + {selectedCalcDetail.data.gridRevenueYuan} ={' '}
                        <span className="text-amber-400 font-bold text-xs">¥{selectedCalcDetail.data.totalBenefitYuan} 元</span>
                      </div>
                      <div>
                        <span className="text-amber-400">Step 5 [环保减碳贡献]:</span>{' '}
                        ({selectedCalcDetail.data.dailyGenKwh} / 1000) MWh × 0.5350 tCO2/MWh ={' '}
                        <span className="text-purple-400 font-bold">{selectedCalcDetail.data.dailyCarbonTons} tCO₂</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. 合规依据与计量标准 */}
              <div className="p-3 rounded-lg bg-panel border border-border text-[10px] text-muted-foreground font-sans space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  <span>核算方法学与标准依据</span>
                </div>
                <p>
                  1. GB/T 51366-2019 《建筑碳排放计算标准》 / NB/T 33015-2014 《电化学储能系统接入配电网运行控制规范》
                  <br />
                  2. 国家发改委《关于进一步完善分时电价机制的通知》（发改价格〔2021〕1093号）
                  <br />
                  3. 生态环境部《关于做好2026年企业温室气体排放报告管理工作的通知》（全国电网平均排放因子 0.5350 tCO₂/MWh）
                </p>
              </div>
            </div>

            {/* 弹窗 Footer */}
            <div className="p-3.5 border-t border-border bg-panel flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-mono">
                校验结果：所有指标与关口双向计量台账 100% 吻合
              </span>
              <button
                type="button"
                onClick={() => setSelectedCalcDetail({ isOpen: false, type: 'storage', data: null })}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
              >
                已完成核算查验
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CodeBracketIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
      />
    </svg>
  )
}

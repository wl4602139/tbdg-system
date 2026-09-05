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
  Building,
  ArrowDownRight,
  Ruler,
  Maximize2,
  PieChart as PieIcon,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend, AreaTrend, Donut, BarChartGroup } from '@/components/shared/charts'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  Line,
  ComposedChart,
  ReferenceLine,
} from 'recharts'
import { cn } from '@/lib/utils'

// ==========================================
// 紧凑型高保真结构环形图组件 (杜绝文字重叠与视口溢出)
// ==========================================
interface DonutItem {
  name: string
  value: number
  color: string
}

function MiniStructureDonut({
  title,
  mainPercentage,
  mainLabel,
  items,
}: {
  title: string
  mainPercentage: string
  mainLabel: string
  items: DonutItem[]
}) {
  const total = items.reduce((acc, i) => acc + i.value, 0) || 1
  let accumulatedPercent = 0

  return (
    <div className="flex flex-col items-center w-full px-1">
      <span className="text-xs font-bold text-foreground block mb-1">{title}</span>

      {/* SVG 环形进度圈与中央关键指标 */}
      <div className="relative size-24 shrink-0 flex items-center justify-center my-1">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="11"
            fill="transparent"
          />
          {items.map((item, idx) => {
            const percent = (item.value / total) * 100
            const strokeDasharray = `${(percent * 2.3876).toFixed(1)} 238.76`
            const strokeDashoffset = `-${(accumulatedPercent * 2.3876).toFixed(1)}`
            accumulatedPercent += percent

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r="38"
                stroke={item.color}
                strokeWidth="11"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
                className="transition-all duration-300 hover:opacity-80"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-base font-bold font-mono text-foreground leading-none">
            {mainPercentage}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
            {mainLabel}
          </span>
        </div>
      </div>

      {/* 结构图例清单 */}
      <div className="w-full mt-2 space-y-1.5 pt-2 border-t border-border/60">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-[11px] leading-tight">
            <span className="flex items-center gap-1.5 text-muted-foreground truncate max-w-[110px]" title={item.name}>
              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="font-mono font-bold text-foreground shrink-0 ml-1">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// 1. 储能效益数据模型 (严格对齐客户需求)
// ==========================================
export interface StorageBenefitItem {
  id: string
  name: string
  park: string
  company: string
  capacity: string // 储能装机容量，如 6MW / 12MWh
  chargeKwh: number // 充电量 (kWh)
  dischargeKwh: number // 放电量 (kWh)
  revenueYuan: number // 套利收益 (元)
  efficiency: number // 综合效率 (%)
  greenChargeRatio: number // 充电量（绿电）占比 (%)
  valleyChargeRatio: number // 充电量（市电谷/深谷）占比 (%)
  criticalPeakDischargeRatio: number // 尖放占比 (%)
  peakDischargeRatio: number // 峰放占比 (%)
  peakCombinedDesc: string // 放电量（尖/峰）占比描述，如 尖62% / 峰38%
  monthlyChargeWanKwh: number // 月度充电量 (万kWh)
  monthlyDischargeWanKwh: number // 月度放电量 (万kWh)
  monthlyRevenueWan: number // 月度累计收益 (万元)
  carbonReductionTons: number // 核证碳减排 (tCO2)
  calcContext: {
    criticalPeakPrice: number
    peakPrice: number
    flatPrice: number
    valleyPrice: number
    greenPowerPrice: number
    gridChargeKwh: number
    greenChargeKwh: number
    criticalDischargeKwh: number
    peakDischargeKwh: number
    dischargeIncomeYuan: number
    chargeCostYuan: number
    roundTripLossKwh: number
    formula: string
  }
}

// ==========================================
// 2. 热泵效益数据模型 (严格对齐客户 A*H/3 折算与指标需求)
// ==========================================
export interface BuildingHeightItem {
  buildingName: string
  areaWanM2: number // 原始面积 (万㎡)
  heightM: number // 建筑层高 (m)
  convertedAreaWanM2: number // 折算面积 = areaWanM2 * heightM / 3 (万㎡)
}

export interface HeatPumpBenefitItem {
  id: string
  name: string
  park: string
  company: string
  capacity: string // 装机热功率，如 2.5 MW (制热量)
  cop: number // COP 综合制热性能系数
  heatOutputGj: number // 供热量 (GJ)
  heatOutputEquivalentKwh: number // 供热量折算电量 (万kWh)
  powerKwh: number // 耗电量 (kWh)
  areaWanM2: number // 原始供暖面积 A (万㎡)
  heightM: number // 建筑平均层高 H (m)
  convertedAreaWanM2: number // 折算供暖面积 A*H/3 (万㎡)
  kwhPerM2: number // 单位面积供热耗电量 (kWh/㎡) = powerKwh / (convertedAreaWanM2 * 10000)
  greenPowerRatio: number // 制热电耗占比（绿电）(%)
  peakPowerRatio: number // 制热电耗占比（市电尖/峰）(%)
  flatValleyPowerRatio: number // 制热电耗平谷占比 (%)
  replacedGasM3: number // 替代天然气 (m³)
  dailySavingsYuan: number // 日节费 (元)
  monthlySavingsWan: number // 月节费 (万元)
  carbonReductionTons: number // 碳减排量 (tCO2)
  heightBreakdown: BuildingHeightItem[]
  calcContext: {
    gasPrice: number
    electricityAvgPrice: number
    replacedGasCostYuan: number
    heatPumpElecCostYuan: number
    formula: string
  }
}

// ==========================================
// 3. 光伏效益数据模型 (全新构建，严格对齐消纳/上网双轨)
// ==========================================
export interface PvBenefitItem {
  id: string
  name: string
  park: string
  company: string
  capacityMwp: number // 光伏装机 (MWp)
  genKwhWan: number // 周期发电量 (万kWh)
  effectiveHours: number // 有效发电小时数 (h) = genKwhWan * 10000 / (capacityMwp * 1000)
  consumedKwhWan: number // 消纳电量 (万kWh)
  consumedIncomeWan: number // 消纳收益 (万元) = 消纳电量 × 消纳均价
  consumedAvgPrice: number // 消纳均价 (元/kWh)
  consumedRatio: number // 消纳率 (%) = 消纳电量 / 发电量
  gridKwhWan: number // 上网电量 (万kWh)
  gridIncomeWan: number // 上网收益 (万元) = 上网电量 × 上网单价
  gridPrice: number // 上网单价 (元/kWh，标杆燃煤基准价)
  totalIncomeWan: number // 总收益 = 消纳收益 + 上网收益
  carbonReductionTons: number // 核证减排 (tCO2)
  calcContext: {
    co2Factor: number
    tceFactor: number
    formula: string
  }
}

// ==========================================
// 4. 模拟数据清单
// ==========================================

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
    greenChargeRatio: 71.5,
    valleyChargeRatio: 28.5,
    criticalPeakDischargeRatio: 62.0,
    peakDischargeRatio: 38.0,
    peakCombinedDesc: '尖 62.0% / 峰 38.0%',
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
      formula: '套利收益 = (尖放电量×尖电价 + 峰放电量×峰电价) - (市电谷充电量×谷电价 + 绿充电量×绿电价)',
    },
  },
  {
    id: 'st-02',
    name: '鲁缆公司 3MW/6MWh 智慧储能调峰电站',
    park: '特变电工山东线缆产业园',
    company: '鲁缆公司',
    capacity: '3MW / 6MWh',
    chargeKwh: 6200.0,
    dischargeKwh: 5394.0,
    revenueYuan: 4150.0,
    efficiency: 87.0,
    greenChargeRatio: 68.0,
    valleyChargeRatio: 32.0,
    criticalPeakDischargeRatio: 58.0,
    peakDischargeRatio: 42.0,
    peakCombinedDesc: '尖 58.0% / 峰 42.0%',
    monthlyChargeWanKwh: 18.6,
    monthlyDischargeWanKwh: 16.18,
    monthlyRevenueWan: 12.45,
    carbonReductionTons: 92.5,
    calcContext: {
      criticalPeakPrice: 1.22,
      peakPrice: 0.95,
      flatPrice: 0.62,
      valleyPrice: 0.31,
      greenPowerPrice: 0.41,
      gridChargeKwh: 1984.0,
      greenChargeKwh: 4216.0,
      criticalDischargeKwh: 3128.52,
      peakDischargeKwh: 2265.48,
      dischargeIncomeYuan: 6023.7,
      chargeCostYuan: 1873.7,
      roundTripLossKwh: 806.0,
      formula: '套利收益 = (放电总收入 - 充电总成本)；放电尖峰比严格执行电网两充两放调度策略',
    },
  },
  {
    id: 'st-03',
    name: '沈变本部 5MW/10MWh 零碳工业储能电站',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    capacity: '5MW / 10MWh',
    chargeKwh: 10500.0,
    dischargeKwh: 9187.5,
    revenueYuan: 7120.0,
    efficiency: 87.5,
    greenChargeRatio: 76.0,
    valleyChargeRatio: 24.0,
    criticalPeakDischargeRatio: 60.0,
    peakDischargeRatio: 40.0,
    peakCombinedDesc: '尖 60.0% / 峰 40.0%',
    monthlyChargeWanKwh: 31.5,
    monthlyDischargeWanKwh: 27.56,
    monthlyRevenueWan: 21.36,
    carbonReductionTons: 158.0,
    calcContext: {
      criticalPeakPrice: 1.25,
      peakPrice: 0.96,
      flatPrice: 0.63,
      valleyPrice: 0.33,
      greenPowerPrice: 0.43,
      gridChargeKwh: 2520.0,
      greenChargeKwh: 7980.0,
      criticalDischargeKwh: 5512.5,
      peakDischargeKwh: 3675.0,
      dischargeIncomeYuan: 10418.6,
      chargeCostYuan: 3298.6,
      roundTripLossKwh: 1312.5,
      formula: '绿电午间充入 + 夜间深谷充入，早晚双尖峰最大化套利释放',
    },
  },
  {
    id: 'st-04',
    name: '新变厂超高压 4MW/8MWh 调频储能电站',
    park: '特变电工超高压智能制造基地',
    company: '超高压公司',
    capacity: '4MW / 8MWh',
    chargeKwh: 8400.0,
    dischargeKwh: 7291.2,
    revenueYuan: 5380.0,
    efficiency: 86.8,
    greenChargeRatio: 81.0,
    valleyChargeRatio: 19.0,
    criticalPeakDischargeRatio: 64.0,
    peakDischargeRatio: 36.0,
    peakCombinedDesc: '尖 64.0% / 峰 36.0%',
    monthlyChargeWanKwh: 25.2,
    monthlyDischargeWanKwh: 21.87,
    monthlyRevenueWan: 16.14,
    carbonReductionTons: 124.0,
    calcContext: {
      criticalPeakPrice: 1.20,
      peakPrice: 0.92,
      flatPrice: 0.60,
      valleyPrice: 0.28,
      greenPowerPrice: 0.38,
      gridChargeKwh: 1596.0,
      greenChargeKwh: 6804.0,
      criticalDischargeKwh: 4666.37,
      peakDischargeKwh: 2624.83,
      dischargeIncomeYuan: 8014.5,
      chargeCostYuan: 2634.5,
      roundTripLossKwh: 1108.8,
      formula: '新疆准东荒漠大光伏直接绿充电量，夜间参与电网调频辅助服务',
    },
  },
]

const HEAT_PUMP_BENEFIT_DATA: HeatPumpBenefitItem[] = [
  {
    id: 'hp-01',
    name: '德缆产业园 2.5MW 高温工业水源热泵系统',
    park: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    capacity: '2.5 MW (制热量)',
    cop: 3.85,
    heatOutputGj: 207.9,
    heatOutputEquivalentKwh: 5.77,
    powerKwh: 15000.0,
    areaWanM2: 2.5,
    heightM: 9.0,
    convertedAreaWanM2: 7.5,
    kwhPerM2: 2.0,
    greenPowerRatio: 72.0,
    peakPowerRatio: 24.5,
    flatValleyPowerRatio: 3.5,
    replacedGasM3: 3850,
    dailySavingsYuan: 6184.0,
    monthlySavingsWan: 18.55,
    carbonReductionTons: 82.0,
    heightBreakdown: [
      { buildingName: '电缆交联重型主车间', areaWanM2: 1.5, heightM: 12.0, convertedAreaWanM2: 6.0 },
      { buildingName: '中低压线缆副厂房', areaWanM2: 1.0, heightM: 4.5, convertedAreaWanM2: 1.5 },
    ],
    calcContext: {
      gasPrice: 3.6,
      electricityAvgPrice: 0.51,
      replacedGasCostYuan: 13860.0,
      heatPumpElecCostYuan: 7676.0,
      formula: '折算供暖面积 = A×H/3；单位面积供热电耗 = 制热总耗电量 ÷ (折算面积×10000)',
    },
  },
  {
    id: 'hp-02',
    name: '天变公司 1.8MW 真空干燥罐冷凝余热梯级利用改造',
    park: '特变电工天变产业园',
    company: '天变公司',
    capacity: '1.8 MW (制热量)',
    cop: 4.12,
    heatOutputGj: 149.7,
    heatOutputEquivalentKwh: 4.16,
    powerKwh: 10100.0,
    areaWanM2: 1.2,
    heightM: 12.5,
    convertedAreaWanM2: 5.0,
    kwhPerM2: 2.02,
    greenPowerRatio: 78.5,
    peakPowerRatio: 18.0,
    flatValleyPowerRatio: 3.5,
    replacedGasM3: 2780,
    dailySavingsYuan: 4720.0,
    monthlySavingsWan: 14.16,
    carbonReductionTons: 63.0,
    heightBreakdown: [
      { buildingName: '真空注油干燥主跨', areaWanM2: 0.8, heightM: 15.0, convertedAreaWanM2: 4.0 },
      { buildingName: '线圈装配辅跨', areaWanM2: 0.4, heightM: 7.5, convertedAreaWanM2: 1.0 },
    ],
    calcContext: {
      gasPrice: 3.5,
      electricityAvgPrice: 0.48,
      replacedGasCostYuan: 9730.0,
      heatPumpElecCostYuan: 5010.0,
      formula: '高大空间通过高度 H/3 修正建筑传热系数比，实现不同车间精准同频能效考核',
    },
  },
  {
    id: 'hp-03',
    name: '沈变本部 3.2MW 地源/工业中温热泵机组',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    capacity: '3.2 MW (制热量)',
    cop: 3.65,
    heatOutputGj: 266.1,
    heatOutputEquivalentKwh: 7.39,
    powerKwh: 20250.0,
    areaWanM2: 1.8,
    heightM: 15.0,
    convertedAreaWanM2: 9.0,
    kwhPerM2: 2.25,
    greenPowerRatio: 65.0,
    peakPowerRatio: 30.0,
    flatValleyPowerRatio: 5.0,
    replacedGasM3: 4920,
    dailySavingsYuan: 7650.0,
    monthlySavingsWan: 22.95,
    carbonReductionTons: 105.0,
    heightBreakdown: [
      { buildingName: '超高压变压器总装车间', areaWanM2: 1.2, heightM: 18.0, convertedAreaWanM2: 7.2 },
      { buildingName: '铁芯下料与退火工段', areaWanM2: 0.6, heightM: 9.0, convertedAreaWanM2: 1.8 },
    ],
    calcContext: {
      gasPrice: 3.7,
      electricityAvgPrice: 0.52,
      replacedGasCostYuan: 18204.0,
      heatPumpElecCostYuan: 10554.0,
      formula: '东北严寒地区冬季替代燃气蒸汽锅炉采暖，通过 COP 3.65 驱动单位面积电耗压降',
    },
  },
  {
    id: 'hp-04',
    name: '衡变本部 2.0MW 空气源跨临界CO₂热泵采暖系统',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    capacity: '2.0 MW (制热量)',
    cop: 3.90,
    heatOutputGj: 166.3,
    heatOutputEquivalentKwh: 4.62,
    powerKwh: 11850.0,
    areaWanM2: 1.5,
    heightM: 8.0,
    convertedAreaWanM2: 4.0,
    kwhPerM2: 2.96,
    greenPowerRatio: 75.0,
    peakPowerRatio: 21.0,
    flatValleyPowerRatio: 4.0,
    replacedGasM3: 3100,
    dailySavingsYuan: 5120.0,
    monthlySavingsWan: 15.36,
    carbonReductionTons: 71.0,
    heightBreakdown: [
      { buildingName: '电气开关柜装配车间', areaWanM2: 1.0, heightM: 9.0, convertedAreaWanM2: 3.0 },
      { buildingName: '办公与研发中心大楼', areaWanM2: 0.5, heightM: 6.0, convertedAreaWanM2: 1.0 },
    ],
    calcContext: {
      gasPrice: 3.65,
      electricityAvgPrice: 0.49,
      replacedGasCostYuan: 11315.0,
      heatPumpElecCostYuan: 6195.0,
      formula: '采用环保跨临界 CO₂ 制冷剂，绿色电力就地驱动，年减排超 800 吨',
    },
  },
]

// ============================================================
// 光伏和自己对比：1~8月逐月历史对标数据集 (实际 vs 去年同期同比 vs 计划/标杆)
// ============================================================
const PV_SELF_HISTORY_DATA = [
  { month: '01月', gen2026: 62.4, gen2025: 57.2, genPlan: 60.0, hours2026: 48.8, hours2025: 44.7, hoursBenchmark: 45.0, ratio2026: 94.2, ratio2025: 93.0, ratioTarget: 90.0, momGen: 0, yoyGen: 9.1 },
  { month: '02月', gen2026: 78.5, gen2025: 71.0, genPlan: 75.0, hours2026: 61.3, hours2025: 55.5, hoursBenchmark: 55.0, ratio2026: 93.8, ratio2025: 92.5, ratioTarget: 90.0, momGen: 25.8, yoyGen: 10.6 },
  { month: '03月', gen2026: 105.2, gen2025: 98.4, genPlan: 102.0, hours2026: 82.2, hours2025: 76.9, hoursBenchmark: 80.0, ratio2026: 93.1, ratio2025: 91.8, ratioTarget: 90.0, momGen: 34.0, yoyGen: 6.9 },
  { month: '04月', gen2026: 122.8, gen2025: 114.2, genPlan: 120.0, hours2026: 95.9, hours2025: 89.2, hoursBenchmark: 90.0, ratio2026: 92.6, ratio2025: 91.2, ratioTarget: 90.0, momGen: 16.7, yoyGen: 7.5 },
  { month: '05月', gen2026: 138.4, gen2025: 126.5, genPlan: 132.0, hours2026: 108.1, hours2025: 98.8, hoursBenchmark: 100.0, ratio2026: 91.9, ratio2025: 90.5, ratioTarget: 90.0, momGen: 12.7, yoyGen: 9.4 },
  { month: '06月', gen2026: 132.6, gen2025: 123.0, genPlan: 128.0, hours2026: 103.6, hours2025: 96.1, hoursBenchmark: 98.0, ratio2026: 91.5, ratio2025: 89.8, ratioTarget: 90.0, momGen: -4.2, yoyGen: 7.8 },
  { month: '07月', gen2026: 114.8, gen2025: 106.2, genPlan: 112.0, hours2026: 89.7, hours2025: 83.0, hoursBenchmark: 88.0, ratio2026: 92.9, ratio2025: 91.0, ratioTarget: 90.0, momGen: -13.4, yoyGen: 8.1 },
  { month: '08月', gen2026: 118.5, gen2025: 109.1, genPlan: 115.0, hours2026: 92.6, hours2025: 85.2, hoursBenchmark: 90.0, ratio2026: 92.4, ratio2025: 90.6, ratioTarget: 90.0, momGen: 3.2, yoyGen: 8.6 },
]

// ============================================================
// 光伏横向对比：全集团 7 大分布式光伏电站横向对标数据集
// ============================================================
const PV_HORIZONTAL_COMPARE_DATA = [
  { rank: 1, name: '新变超高压基地', company: '超高压公司', capacity: 13.9, gen: 142.8, hours: 1027.3, ratio: 93.0, consumedGen: 132.8, income: 96.76, isBenchmark: true },
  { rank: 2, name: '衡变本部光伏', company: '衡变本部', capacity: 10.5, gen: 102.4, hours: 975.2, ratio: 92.0, consumedGen: 94.2, income: 72.83, isBenchmark: false },
  { rank: 3, name: '德缆产业园光伏', company: '德缆公司', capacity: 6.2, gen: 59.8, hours: 964.5, ratio: 91.2, consumedGen: 54.5, income: 42.15, isBenchmark: false },
  { rank: 4, name: '西变智能装备园', company: '西变装备', capacity: 7.5, gen: 72.0, hours: 960.0, ratio: 91.8, consumedGen: 66.1, income: 51.30, isBenchmark: false },
  { rank: 5, name: '鲁缆公司 BAPV', company: '鲁缆公司', capacity: 8.6, gen: 81.2, hours: 944.2, ratio: 90.5, consumedGen: 73.5, income: 56.59, isBenchmark: false },
  { rank: 6, name: '天变产业园光伏', company: '天变公司', capacity: 5.0, gen: 46.5, hours: 930.0, ratio: 90.8, consumedGen: 42.2, income: 32.80, isBenchmark: false },
  { rank: 7, name: '沈变本部一期', company: '沈变本部', capacity: 12.8, gen: 118.5, hours: 925.8, ratio: 92.4, consumedGen: 109.5, income: 82.81, isCurrent: true },
]

const PV_BENEFIT_DATA: PvBenefitItem[] = [
  {
    id: 'pv-01',
    name: '沈变本部 12.8MWp 屋顶分布式光伏一期',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    capacityMwp: 12.8,
    genKwhWan: 118.5,
    effectiveHours: 925.8,
    consumedKwhWan: 109.5,
    consumedIncomeWan: 79.39,
    consumedAvgPrice: 0.725,
    consumedRatio: 92.4,
    gridKwhWan: 9.0,
    gridIncomeWan: 3.42,
    gridPrice: 0.380,
    totalIncomeWan: 82.81,
    carbonReductionTons: 633.9,
    calcContext: {
      co2Factor: 0.535,
      tceFactor: 0.1229,
      formula: '总收益 = (消纳电量×消纳均价) + (上网电量×标杆燃煤基准电价)；消纳率 = 消纳电量 ÷ 总发电量',
    },
  },
  {
    id: 'pv-02',
    name: '衡变本部 10.5MWp 厂房屋顶及车棚分布式光伏项目',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    capacityMwp: 10.5,
    genKwhWan: 102.4,
    effectiveHours: 975.2,
    consumedKwhWan: 94.2,
    consumedIncomeWan: 69.71,
    consumedAvgPrice: 0.740,
    consumedRatio: 92.0,
    gridKwhWan: 8.2,
    gridIncomeWan: 3.12,
    gridPrice: 0.380,
    totalIncomeWan: 72.83,
    carbonReductionTons: 547.8,
    calcContext: {
      co2Factor: 0.535,
      tceFactor: 0.1229,
      formula: '高消纳率自发自用直接替代峰段高价市电，投资回收期缩短至 4.5 年',
    },
  },
  {
    id: 'pv-03',
    name: '鲁缆公司 8.6MWp BAPV 连跨厂房光伏电站',
    park: '特变电工山东线缆产业园',
    company: '鲁缆公司',
    capacityMwp: 8.6,
    genKwhWan: 81.2,
    effectiveHours: 944.2,
    consumedKwhWan: 73.5,
    consumedIncomeWan: 53.66,
    consumedAvgPrice: 0.730,
    consumedRatio: 90.5,
    gridKwhWan: 7.7,
    gridIncomeWan: 2.93,
    gridPrice: 0.380,
    totalIncomeWan: 56.59,
    carbonReductionTons: 434.4,
    calcContext: {
      co2Factor: 0.535,
      tceFactor: 0.1229,
      formula: '大跨度钢结构厂房屋顶布置防眩光组件，自发自用比例常年稳定在 90% 以上',
    },
  },
  {
    id: 'pv-04',
    name: '新变超高压基地 13.9MWp 智能微网分布式光伏电站',
    park: '特变电工超高压智能制造基地',
    company: '超高压公司',
    capacityMwp: 13.9,
    genKwhWan: 142.8,
    effectiveHours: 1027.3,
    consumedKwhWan: 132.8,
    consumedIncomeWan: 92.96,
    consumedAvgPrice: 0.700,
    consumedRatio: 93.0,
    gridKwhWan: 10.0,
    gridIncomeWan: 3.80,
    gridPrice: 0.380,
    totalIncomeWan: 96.76,
    carbonReductionTons: 763.9,
    calcContext: {
      co2Factor: 0.535,
      tceFactor: 0.1229,
      formula: '新疆充足辐照资源赋能超高利用小时数，自用均价与储能协同平抑需量电费',
    },
  },
  {
    id: 'pv-05',
    name: '德缆产业园 6.2MWp 屋顶柔性支架分布式光伏',
    park: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    capacityMwp: 6.2,
    genKwhWan: 59.8,
    effectiveHours: 964.5,
    consumedKwhWan: 54.5,
    consumedIncomeWan: 42.15,
    consumedAvgPrice: 0.745,
    consumedRatio: 91.2,
    gridKwhWan: 5.3,
    gridIncomeWan: 2.01,
    gridPrice: 0.380,
    totalIncomeWan: 44.16,
    carbonReductionTons: 320.5,
    calcContext: {
      co2Factor: 0.535,
      tceFactor: 0.1229,
      formula: '西南多阴雨区柔性光伏支架抗强风高净空，自消纳满足车间持续电力负荷',
    },
  },
  {
    id: 'pv-06',
    name: '西变智能装备产业园 7.5MWp 厂房连跨分布式光伏',
    park: '特变电工西安变压器产业园',
    company: '西变装备',
    capacityMwp: 7.5,
    genKwhWan: 72.0,
    effectiveHours: 960.0,
    consumedKwhWan: 66.1,
    consumedIncomeWan: 51.30,
    consumedAvgPrice: 0.735,
    consumedRatio: 91.8,
    gridKwhWan: 5.9,
    gridIncomeWan: 2.24,
    gridPrice: 0.380,
    totalIncomeWan: 53.54,
    carbonReductionTons: 385.2,
    calcContext: {
      co2Factor: 0.535,
      tceFactor: 0.1229,
      formula: '西北黄土高原高辐照优势赋能，消纳节费协同厂区高峰负荷平抑',
    },
  },
  {
    id: 'pv-07',
    name: '天变产业园 5.0MWp BIPV 绿色建筑一体化光伏',
    park: '特变电工天变产业园',
    company: '天变公司',
    capacityMwp: 5.0,
    genKwhWan: 46.5,
    effectiveHours: 930.0,
    consumedKwhWan: 42.2,
    consumedIncomeWan: 32.80,
    consumedAvgPrice: 0.730,
    consumedRatio: 90.8,
    gridKwhWan: 4.3,
    gridIncomeWan: 1.63,
    gridPrice: 0.380,
    totalIncomeWan: 34.43,
    carbonReductionTons: 248.8,
    calcContext: {
      co2Factor: 0.535,
      tceFactor: 0.1229,
      formula: 'BIPV 屋面建材级光伏一体化布置，结构自防水免维护，消纳率保持 90% 以上',
    },
  },
]

export default function BenefitEvaluationPage() {
  // 0. 园区结构树选择状态 (默认全集团)
  const [selectedParkId, setSelectedParkId] = useState('park_root')
  const [selectedParkNode, setSelectedParkNode] = useState<StandardOrgNode | null>(null)

  const isParkRoot =
    !selectedParkNode || selectedParkNode.id === 'park_root' || selectedParkNode.name.includes('电装集团')

  // 1. 顶部模块大 Tab 切换: 储能效益 | 热泵效益 | 光伏效益 (对齐客户三大业态)
  const [activeModule, setActiveModule] = useState<'storage' | 'heatpump' | 'pv'>('storage')

  // 2. 时间维度与范围选择
  const [timeDim, setTimeDim] = useState<'day' | 'month' | 'quarter' | 'year'>('month')
  const [selectedDate, setSelectedDate] = useState('2026-08-28')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })

  // 3. 算法计算详情弹窗状态
  const [selectedCalcDetail, setSelectedCalcDetail] = useState<{
    isOpen: boolean
    type: 'storage' | 'heatpump' | 'pv'
    data: any
  }>({
    isOpen: false,
    type: 'storage',
    data: null,
  })

  // 光伏对比指标维度：发电量(gen) | 发电小时数(hours) | 综合消纳率(ratio)
  const [pvCompareMetric, setPvCompareMetric] = useState<'gen' | 'hours' | 'ratio'>('gen')

  // 4. 热泵建筑层高折算明细弹窗
  const [selectedHeightDetail, setSelectedHeightDetail] = useState<{
    isOpen: boolean
    item: HeatPumpBenefitItem | null
  }>({
    isOpen: false,
    item: null,
  })

  // 5. 根据当前选中的园区筛选数据
  const filteredStorageData = useMemo(() => {
    if (isParkRoot) return STORAGE_BENEFIT_DATA
    const target = selectedParkNode.name
    const res = STORAGE_BENEFIT_DATA.filter(
      (item) =>
        item.park.includes(target) ||
        target.includes(item.park) ||
        item.company.includes(target) ||
        target.includes(item.company),
    )
    return res.length > 0 ? res : STORAGE_BENEFIT_DATA
  }, [selectedParkNode, isParkRoot])

  const filteredHeatPumpData = useMemo(() => {
    if (isParkRoot) return HEAT_PUMP_BENEFIT_DATA
    const target = selectedParkNode.name
    const res = HEAT_PUMP_BENEFIT_DATA.filter(
      (item) =>
        item.park.includes(target) ||
        target.includes(item.park) ||
        item.company.includes(target) ||
        target.includes(item.company),
    )
    return res.length > 0 ? res : HEAT_PUMP_BENEFIT_DATA
  }, [selectedParkNode, isParkRoot])

  const filteredPvData = useMemo(() => {
    if (isParkRoot) return PV_BENEFIT_DATA
    const target = selectedParkNode.name
    const res = PV_BENEFIT_DATA.filter(
      (item) =>
        item.park.includes(target) ||
        target.includes(item.park) ||
        item.company.includes(target) ||
        target.includes(item.company),
    )
    return res.length > 0 ? res : PV_BENEFIT_DATA
  }, [selectedParkNode, isParkRoot])

  // ============================================================
  // 图表多维数据集 (涵盖时序走势、负荷结构环形图与横向对标柱状图)
  // ============================================================

  // 储能图表数据
  const storageTrendData = [
    { date: '08-22', 充电量: 3.65, 放电量: 3.18, 收益: 2420 },
    { date: '08-23', 充电量: 3.72, 放电量: 3.24, 收益: 2480 },
    { date: '08-24', 充电量: 3.80, 放电量: 3.31, 收益: 2550 },
    { date: '08-25', 充电量: 3.75, 放电量: 3.26, 收益: 2510 },
    { date: '08-26', 充电量: 3.68, 放电量: 3.20, 收益: 2460 },
    { date: '08-27', 充电量: 3.78, 放电量: 3.29, 收益: 2530 },
    { date: '08-28', 充电量: 3.76, 放电量: 3.27, 收益: 2507 },
  ]

  const storageBenchmarkData = [
    { name: '衡变储能', 综合效率: 87.0, 日套利收益: 8420 },
    { name: '沈变储能', 综合效率: 87.5, 日套利收益: 7120 },
    { name: '新变超高压', 综合效率: 86.8, 日套利收益: 5380 },
    { name: '鲁缆储能', 综合效率: 87.0, 日套利收益: 4150 },
  ]

  // 热泵图表数据
  const heatPumpTrendData = [
    { date: '08-22', 供热量GJ: 195.2, 耗电量万kWh: 1.42, COP: 3.82 },
    { date: '08-23', 供热量GJ: 202.5, 耗电量万kWh: 1.46, COP: 3.86 },
    { date: '08-24', 供热量GJ: 215.0, 耗电量万kWh: 1.54, COP: 3.88 },
    { date: '08-25', 供热量GJ: 208.4, 耗电量万kWh: 1.50, COP: 3.85 },
    { date: '08-26', 供热量GJ: 205.1, 耗电量万kWh: 1.48, COP: 3.84 },
    { date: '08-27', 供热量GJ: 212.8, 耗电量万kWh: 1.52, COP: 3.87 },
    { date: '08-28', 供热量GJ: 207.9, 耗电量万kWh: 1.50, COP: 3.85 },
  ]

  const heatPumpPowerSourceDonut = [
    { name: '清洁绿电直供 (光伏微网)', value: 72.0, color: '#52c41a' },
    { name: '市电低谷电网输入', value: 24.5, color: '#1677ff' },
    { name: '市电平段补充', value: 3.5, color: '#fa8c16' },
  ]

  const heatPumpPeakValleyDonut = [
    { name: '平谷避峰时段制热', value: 75.5, color: '#13c2c2' },
    { name: '尖峰时段运行电耗', value: 24.5, color: '#f5222d' },
  ]

  const heatPumpWorkshopBenchmark = [
    { name: '超高压总装(18m)', 原始面积: 1.2, 折算供暖面积: 7.2, 单位面积电耗: 2.15 },
    { name: '电缆交联跨(12m)', 原始面积: 1.5, 折算供暖面积: 6.0, 单位面积电耗: 2.00 },
    { name: '真空干燥跨(15m)', 原始面积: 0.8, 折算供暖面积: 4.0, 单位面积电耗: 2.02 },
    { name: '线圈装配辅跨(7.5m)', 原始面积: 0.4, 折算供暖面积: 1.0, 单位面积电耗: 2.30 },
    { name: '研发综合楼(6m)', 原始面积: 0.5, 折算供暖面积: 1.0, 单位面积电耗: 2.96 },
  ]

  // 光伏图表数据
  const pvHourlyTrendData = [
    { time: '06:00', 总发电量: 0.12, 厂区消纳: 0.12, 余电上网: 0.0 },
    { time: '07:00', 总发电量: 0.45, 厂区消纳: 0.45, 余电上网: 0.0 },
    { time: '08:00', 总发电量: 1.28, 厂区消纳: 1.28, 余电上网: 0.0 },
    { time: '09:00', 总发电量: 2.56, 厂区消纳: 2.42, 余电上网: 0.14 },
    { time: '10:00', 总发电量: 3.82, 厂区消纳: 3.50, 余电上网: 0.32 },
    { time: '11:00', 总发电量: 4.65, 厂区消纳: 4.15, 余电上网: 0.50 },
    { time: '12:00', 总发电量: 4.80, 厂区消纳: 4.20, 余电上网: 0.60 },
    { time: '13:00', 总发电量: 4.52, 厂区消纳: 4.08, 余电上网: 0.44 },
    { time: '14:00', 总发电量: 3.78, 厂区消纳: 3.52, 余电上网: 0.26 },
    { time: '15:00', 总发电量: 2.64, 厂区消纳: 2.55, 余电上网: 0.09 },
    { time: '16:00', 总发电量: 1.45, 厂区消纳: 1.45, 余电上网: 0.0 },
    { time: '17:00', 总发电量: 0.62, 厂区消纳: 0.62, 余电上网: 0.0 },
    { time: '18:00', 总发电量: 0.15, 厂区消纳: 0.15, 余电上网: 0.0 },
  ]

  const pvFlowDonut = [
    { name: '厂区车间自发自用消纳', value: 91.8, color: '#1677ff' },
    { name: '余电反送电网上网', value: 8.2, color: '#52c41a' },
  ]

  const pvRevenueDonut = [
    { name: '自用替代工商业电费节约', value: 95.5, color: '#fa8c16' },
    { name: '余电上网售电收益', value: 4.5, color: '#13c2c2' },
  ]

  const pvBenchmarkData = [
    { name: '新变超高压', 有效小时数: 1027, 综合消纳率: 93.0 },
    { name: '衡变本部', 有效小时数: 975, 综合消纳率: 92.0 },
    { name: '德缆光伏', 有效小时数: 965, 综合消纳率: 91.2 },
    { name: '西变装备', 有效小时数: 960, 综合消纳率: 91.8 },
    { name: '鲁缆光伏', 有效小时数: 944, 综合消纳率: 90.5 },
    { name: '天变光伏', 有效小时数: 930, 综合消纳率: 90.8 },
    { name: '沈变光伏', 有效小时数: 926, 综合消纳率: 92.4 },
  ]

  // ============================================================
  // 核心 KPI 动态计算汇总 (严格按客户指定字段输出)
  // ============================================================

  // 储能 KPI
  const storageKpi = useMemo(() => {
    const totalCharge = filteredStorageData.reduce((acc, i) => acc + i.chargeKwh, 0)
    const totalDischarge = filteredStorageData.reduce((acc, i) => acc + i.dischargeKwh, 0)
    const totalRevenue = filteredStorageData.reduce((acc, i) => acc + i.revenueYuan, 0)
    const avgEfficiency = (
      filteredStorageData.reduce((acc, i) => acc + i.efficiency, 0) / (filteredStorageData.length || 1)
    ).toFixed(1)
    const avgGreenRatio = (
      filteredStorageData.reduce((acc, i) => acc + i.greenChargeRatio, 0) / (filteredStorageData.length || 1)
    ).toFixed(1)
    const avgValleyRatio = (
      filteredStorageData.reduce((acc, i) => acc + i.valleyChargeRatio, 0) / (filteredStorageData.length || 1)
    ).toFixed(1)
    const avgCritPeak = (
      filteredStorageData.reduce((acc, i) => acc + i.criticalPeakDischargeRatio, 0) /
      (filteredStorageData.length || 1)
    ).toFixed(1)
    const avgPeak = (
      filteredStorageData.reduce((acc, i) => acc + i.peakDischargeRatio, 0) /
      (filteredStorageData.length || 1)
    ).toFixed(1)

    return {
      totalCapacity: `${filteredStorageData.reduce((acc, i) => acc + parseInt(i.capacity), 0)}MW / ${filteredStorageData.reduce((acc, i) => acc + parseInt(i.capacity.split('/')[1] || '0'), 0)}MWh`,
      efficiency: avgEfficiency,
      totalCharge: totalCharge.toLocaleString(),
      totalDischarge: totalDischarge.toLocaleString(),
      totalRevenue: totalRevenue.toLocaleString(),
      greenChargeRatio: avgGreenRatio,
      valleyChargeRatio: avgValleyRatio,
      dischargePeakDesc: `尖 ${avgCritPeak}% / 峰 ${avgPeak}%`,
    }
  }, [filteredStorageData])

  // 热泵 KPI
  const heatPumpKpi = useMemo(() => {
    const avgCop = (
      filteredHeatPumpData.reduce((acc, i) => acc + i.cop, 0) / (filteredHeatPumpData.length || 1)
    ).toFixed(2)
    const totalHeatGj = filteredHeatPumpData.reduce((acc, i) => acc + i.heatOutputGj, 0).toFixed(1)
    const totalPower = filteredHeatPumpData.reduce((acc, i) => acc + i.powerKwh, 0)
    const totalRawArea = filteredHeatPumpData.reduce((acc, i) => acc + i.areaWanM2, 0).toFixed(1)
    const totalConvertedArea = filteredHeatPumpData
      .reduce((acc, i) => acc + i.convertedAreaWanM2, 0)
      .toFixed(1)
    const avgKwhPerM2 = (
      totalPower / (parseFloat(totalConvertedArea) * 10000 || 1)
    ).toFixed(2)
    const avgGreenRatio = (
      filteredHeatPumpData.reduce((acc, i) => acc + i.greenPowerRatio, 0) /
      (filteredHeatPumpData.length || 1)
    ).toFixed(1)
    const avgPeakRatio = (
      filteredHeatPumpData.reduce((acc, i) => acc + i.peakPowerRatio, 0) /
      (filteredHeatPumpData.length || 1)
    ).toFixed(1)

    return {
      cop: avgCop,
      totalHeatGj,
      totalPower: totalPower.toLocaleString(),
      rawArea: totalRawArea,
      convertedArea: totalConvertedArea,
      kwhPerM2: avgKwhPerM2,
      greenRatio: avgGreenRatio,
      peakRatio: avgPeakRatio,
    }
  }, [filteredHeatPumpData])

  // 光伏 KPI
  const pvKpi = useMemo(() => {
    const totalCapacity = filteredPvData.reduce((acc, i) => acc + i.capacityMwp, 0).toFixed(1)
    const totalGen = filteredPvData.reduce((acc, i) => acc + i.genKwhWan, 0).toFixed(1)
    const avgHours = (
      filteredPvData.reduce((acc, i) => acc + i.effectiveHours, 0) / (filteredPvData.length || 1)
    ).toFixed(1)
    const totalConsumed = filteredPvData.reduce((acc, i) => acc + i.consumedKwhWan, 0).toFixed(1)
    const totalConsumedIncome = filteredPvData.reduce((acc, i) => acc + i.consumedIncomeWan, 0).toFixed(2)
    const avgConsumedPrice = (
      filteredPvData.reduce((acc, i) => acc + i.consumedAvgPrice, 0) / (filteredPvData.length || 1)
    ).toFixed(3)
    const avgConsumedRatio = (
      (parseFloat(totalConsumed) / (parseFloat(totalGen) || 1)) *
      100
    ).toFixed(1)
    const totalGrid = filteredPvData.reduce((acc, i) => acc + i.gridKwhWan, 0).toFixed(1)
    const totalGridIncome = filteredPvData.reduce((acc, i) => acc + i.gridIncomeWan, 0).toFixed(2)
    const gridPrice = '0.380'

    return {
      totalCapacity,
      totalGen,
      avgHours,
      totalConsumed,
      totalConsumedIncome,
      avgConsumedPrice,
      avgConsumedRatio,
      totalGrid,
      totalGridIncome,
      gridPrice,
    }
  }, [filteredPvData])

  return (
    <div className="flex gap-3.5 items-start font-sans pb-10">
      {/* 🌟 园区结构树 (Park Structure Tree) 270px */}
      <StandardOrgTree
        selectedId={selectedParkId}
        onSelect={(node) => {
          setSelectedParkId(node.id)
          setSelectedParkNode(node)
        }}
        treeType="park"
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 1. 顶部 Header (主标题 + 模块分类选择 + 时间控件 + 数据导出) */}
        <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Coins className="size-5" />
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-foreground">项目运行评估</h1>
              {selectedParkNode && !isParkRoot && (
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-200">
                  {selectedParkNode.name}
                </span>
              )}
            </div>
          </div>

          {/* 右侧：时间维度与导出 */}
          <div className="flex flex-wrap items-center gap-2">
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
                      ? 'font-bold bg-card text-primary shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* 时间选择器 */}
            <div className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <input
                type="month"
                value={selectedMonthRange.end}
                onChange={(e) => setSelectedMonthRange({ ...selectedMonthRange, end: e.target.value })}
                className="font-bold text-foreground focus:outline-none cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => alert(`已成功导出当前【${activeModule === 'storage' ? '储能' : activeModule === 'heatpump' ? '热泵' : '光伏'}运行评估报告】`)}
              className="flex items-center gap-1.5 px-3 py-1 bg-card hover:bg-panel text-foreground border border-border rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>导出报表</span>
            </button>
          </div>
        </div>

        {/* 🌟 2. 核心模块大 Tab 选项卡 (储能运行评估 | 热泵运行评估 | 光伏运行评估) */}
        <div className="flex items-center gap-2 border-b border-border pb-1">
          <button
            type="button"
            onClick={() => setActiveModule('storage')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer border-b-2',
              activeModule === 'storage'
                ? 'border-primary text-primary bg-primary/15 text-blue-300'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-panel',
            )}
          >
            <BatteryCharging className="size-4" />
            <span>储能运行评估</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('heatpump')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer border-b-2',
              activeModule === 'heatpump'
                ? 'border-orange-500 text-orange-400 bg-orange-500/20/50'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-panel',
            )}
          >
            <Flame className="size-4" />
            <span>热泵运行评估</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('pv')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer border-b-2',
              activeModule === 'pv'
                ? 'border-amber-500 text-amber-400 bg-amber-500/20/50'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-panel',
            )}
          >
            <Sun className="size-4" />
            <span>光伏运行评估</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* 模块 1：储能运行评估 (8大KPI + 充放电时序图 + 来源环形图 + 横向柱状图 + 台账) */}
        {/* ============================================================ */}
        {activeModule === 'storage' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* 8 大核心 KPI 卡片 (4列 × 2行 标准网格排版) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">储能装机规模</span>
                  <span className="text-[10px] text-blue-600 bg-primary/15 px-1.5 py-0.5 rounded font-medium">额定容量</span>
                </div>
                <div className="text-lg font-bold text-blue-700 mt-1.5 font-mono truncate">{storageKpi.totalCapacity}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">额定功率 / 储能电量</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">综合转换效率</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-medium">放/充</span>
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-1.5 font-mono">{storageKpi.efficiency}%</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">放电量 ÷ 充电量</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">周期总充电量</span>
                  <span className="text-[10px] text-muted-foreground bg-panel px-1.5 py-0.5 rounded font-medium">充入</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-1.5 font-mono">{storageKpi.totalCharge} <span className="text-xs font-normal">kWh</span></div>
                <div className="text-[11px] text-muted-foreground mt-0.5">尖峰时段前预先充入</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">周期总放电量</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-medium">释放</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-1.5 font-mono">{storageKpi.totalDischarge} <span className="text-xs font-normal">kWh</span></div>
                <div className="text-[11px] text-muted-foreground mt-0.5">高峰/尖峰大负荷释放</div>
              </div>

              <div className="bg-card p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/15 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-200 font-medium">净套利收益</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/200/25 px-1.5 py-0.5 rounded font-medium">价差收益</span>
                </div>
                <div className="text-lg font-bold text-amber-400 mt-1.5 font-mono">¥{storageKpi.totalRevenue} <span className="text-xs font-normal">元</span></div>
                <div className="text-[11px] text-amber-400/80 mt-0.5">放电收入扣除充电成本</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">充电量（绿电）占比</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-medium">清洁电</span>
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-1.5 font-mono">{storageKpi.greenChargeRatio}%</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">光伏低成本绿电直充</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">充电量（市电谷/深谷）占比</span>
                  <span className="text-[10px] text-blue-600 bg-primary/15 px-1.5 py-0.5 rounded font-medium">低谷电</span>
                </div>
                <div className="text-lg font-bold text-blue-600 mt-1.5 font-mono">{storageKpi.valleyChargeRatio}%</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">夜间深谷/低谷电网充入</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">放电量（尖/峰）占比</span>
                  <span className="text-[10px] text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded font-medium">最高价</span>
                </div>
                <div className="text-base font-bold text-purple-400 mt-1.5 font-mono truncate">{storageKpi.dischargePeakDesc}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">早晚双尖峰最大化释放</div>
              </div>
            </div>

            {/* 🌟 储能可视化图表区 1：左右分栏（时序动态充放平衡图 + 来源/时段结构双环图） */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* 左侧 8列：充放电平衡与分时套利时序图 */}
              <div className="lg:col-span-8 bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" />
                    <h3 className="text-xs font-bold text-foreground">储能日度充放电量动态平衡与峰谷套利走势</h3>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">左轴：万kWh / 右轴：元</span>
                </div>
                <ResponsiveContainer width="100%" height={230}>
                  <ComposedChart data={storageTrendData} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="chargeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1677ff" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#1677ff" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="dischargeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#52c41a" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#52c41a" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      domain={[0, 4.5]}
                      unit="万"
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 3500]}
                      unit="元"
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4, color: '#94a3b8' }} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="充电量"
                      name="日充电量 (万kWh)"
                      stroke="#1677ff"
                      strokeWidth={2}
                      fill="url(#chargeGrad)"
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="放电量"
                      name="日放电量 (万kWh)"
                      stroke="#52c41a"
                      strokeWidth={2}
                      fill="url(#dischargeGrad)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="收益"
                      name="净套利收益 (元)"
                      stroke="#fa8c16"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#fa8c16' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* 右侧 4列：充电来源与放电时段双环形图 */}
              <div className="lg:col-span-4 bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center gap-1.5">
                  <PieIcon className="size-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-foreground">充电来源与放电时段结构分析</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/60">
                  <MiniStructureDonut
                    title="充电电量来源"
                    mainPercentage="74.1%"
                    mainLabel="绿电直充"
                    items={[
                      { name: '绿电充入(光伏)', value: 74.1, color: '#52c41a' },
                      { name: '市电深谷充入', value: 18.5, color: '#1677ff' },
                      { name: '市电普通谷充', value: 7.4, color: '#13c2c2' },
                    ]}
                  />
                  <div className="border-l border-border/60 pl-2">
                    <MiniStructureDonut
                      title="放电释放时段"
                      mainPercentage="61.0%"
                      mainLabel="尖峰释放"
                      items={[
                        { name: '尖峰时段释放', value: 61.0, color: '#722ed1' },
                        { name: '高峰时段释放', value: 39.0, color: '#fa8c16' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 🌟 储能可视化图表区 2：横向电站综合效率与套利收益对比柱状图 */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-foreground">各园区储能电站综合转换效率与套利收益对标排行</h3>
                </div>
                <span className="text-[11px] text-muted-foreground">行业高效基准线：综合效率 ≥ 85%</span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={storageBenchmarkData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[70, 100]}
                    unit="%"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 10000]}
                    unit="元"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4, color: '#94a3b8' }} />
                  <Bar
                    yAxisId="left"
                    dataKey="综合效率"
                    name="综合转换效率 (%)"
                    fill="#52c41a"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="日套利收益"
                    name="日套利收益 (元)"
                    fill="#fa8c16"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 储能电站台账明细表 */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-panel">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-600" />
                  <h3 className="text-xs font-bold text-foreground">储能电站效益评估与充放电台账明细表</h3>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    共 {filteredStorageData.length} 个电站
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  数据更新频率：每日0点自动结算日账单
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-panel text-muted-foreground font-bold border-b border-border">
                      <th className="py-2.5 px-3 whitespace-nowrap">储能项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">储能装机</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">充电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">放电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">综合效率</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">套利收益 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">充电量(绿电)占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">充电量(市电谷/深谷)占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">放电量(尖/峰)占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">月累收益 (万元)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono">
                    {filteredStorageData.map((item) => (
                      <tr key={item.id} className="hover:hover:bg-primary/10 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-foreground">{item.name}</td>
                        <td className="py-2.5 px-3 font-sans text-muted-foreground">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-muted-foreground">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-blue-700">{item.capacity}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground">
                          {item.chargeKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                          {item.dischargeKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-400">{item.efficiency}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                          ¥{item.revenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">{item.greenChargeRatio}%</td>
                        <td className="py-2.5 px-3 text-center text-blue-600 font-bold">{item.valleyChargeRatio}%</td>
                        <td className="py-2.5 px-3 text-center text-purple-400 font-bold">{item.peakCombinedDesc}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground">{item.monthlyRevenueWan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 模块 2：热泵运行评估 (8大KPI + 供热电耗COP趋势 + 驱动电能环形图 + 折算面积柱状图 + 台账) */}
        {/* ============================================================ */}
        {activeModule === 'heatpump' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* 8 大核心 KPI 卡片 (4列 × 2行 标准网格排版) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">系统综合 COP</span>
                  <span className="text-[10px] text-orange-400 bg-orange-500/20 px-1.5 py-0.5 rounded font-medium">能效比</span>
                </div>
                <div className="text-lg font-bold text-orange-400 mt-1.5 font-mono">{heatPumpKpi.cop}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">供热量 ÷ 制热耗电量</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">累计供热量</span>
                  <span className="text-[10px] text-muted-foreground bg-panel px-1.5 py-0.5 rounded font-medium">产热</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-1.5 font-mono">{heatPumpKpi.totalHeatGj} <span className="text-xs font-normal">GJ</span></div>
                <div className="text-[11px] text-muted-foreground mt-0.5">吉焦热量输出</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">制热总耗电量</span>
                  <span className="text-[10px] text-muted-foreground bg-panel px-1.5 py-0.5 rounded font-medium">输入</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-1.5 font-mono">{heatPumpKpi.totalPower} <span className="text-xs font-normal">kWh</span></div>
                <div className="text-[11px] text-muted-foreground mt-0.5">压缩机及循环泵总电耗</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">原始供暖面积 A</span>
                  <span className="text-[10px] text-muted-foreground bg-panel px-1.5 py-0.5 rounded font-medium">实测占地</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-1.5 font-mono">{heatPumpKpi.rawArea} <span className="text-xs font-normal">万㎡</span></div>
                <div className="text-[11px] text-muted-foreground mt-0.5">厂房地面实测占地面积</div>
              </div>

              <div className="bg-card p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/200/10 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-200 font-bold">折算供暖面积</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/200/25 px-1.5 py-0.5 rounded font-bold">A×H/3</span>
                </div>
                <div className="text-lg font-bold text-amber-400 mt-1.5 font-mono">{heatPumpKpi.convertedArea} <span className="text-xs font-normal">万㎡</span></div>
                <div className="text-[11px] text-amber-300 mt-0.5">按建筑层高 H/3 修正折算</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-orange-500/30 bg-orange-500/200/10 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-orange-200 font-bold">单位面积供热耗电量</span>
                  <span className="text-[10px] text-orange-400 bg-orange-500/200/25 px-1.5 py-0.5 rounded font-bold">国标指标</span>
                </div>
                <div className="text-lg font-bold text-orange-400 mt-1.5 font-mono">{heatPumpKpi.kwhPerM2} <span className="text-xs font-normal">kWh/㎡</span></div>
                <div className="text-[11px] text-orange-300 mt-0.5">耗电量 ÷ (折算面积×10000)</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">制热电耗（绿电）占比</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-medium">清洁电</span>
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-1.5 font-mono">{heatPumpKpi.greenRatio}%</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">可再生绿电直供驱动比例</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">制热电耗（市电尖/峰）占比</span>
                  <span className="text-[10px] text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded font-medium">避峰考核</span>
                </div>
                <div className="text-lg font-bold text-purple-400 mt-1.5 font-mono">{heatPumpKpi.peakRatio}%</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">高峰时段市网输入占比</div>
              </div>
            </div>

            {/* 🌟 热泵可视化图表区 1：左右分栏（供热量与电耗平衡趋势图 + 驱动电能来源环形图） */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* 左侧 8列：供热量 vs 耗电量 vs COP 综合趋势图 */}
              <div className="lg:col-span-8 bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-orange-400" />
                    <h3 className="text-xs font-bold text-foreground">热泵每日供热量 (GJ) 与制热耗电量 (万kWh) 动态平衡走势</h3>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">系统平均 COP：3.85</span>
                </div>
                <AreaTrend
                  data={heatPumpTrendData}
                  areas={[
                    { key: '供热量GJ', name: '供热量 (GJ)', color: '#fa8c16' },
                    { key: '耗电量万kWh', name: '耗电量 (万kWh)', color: '#1677ff' },
                  ]}
                  xKey="date"
                  height={220}
                />
              </div>

              {/* 右侧 4列：驱动电力来源与避峰运行结构 */}
              <div className="lg:col-span-4 bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center gap-1.5">
                  <PieIcon className="size-4 text-orange-400" />
                  <h3 className="text-xs font-bold text-foreground">制热电能来源与避峰时段构成</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/60">
                  <MiniStructureDonut
                    title="驱动电能来源"
                    mainPercentage="72.0%"
                    mainLabel="清洁绿电"
                    items={[
                      { name: '清洁绿电直供', value: 72.0, color: '#52c41a' },
                      { name: '市电低谷电网', value: 24.5, color: '#1677ff' },
                      { name: '市电平段补充', value: 3.5, color: '#fa8c16' },
                    ]}
                  />
                  <div className="border-l border-border/60 pl-2">
                    <MiniStructureDonut
                      title="峰谷负荷分布"
                      mainPercentage="75.5%"
                      mainLabel="避峰制热"
                      items={[
                        { name: '平谷避峰制热', value: 75.5, color: '#13c2c2' },
                        { name: '尖峰时段耗电', value: 24.5, color: '#f5222d' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 🌟 热泵可视化图表区 2：不同高大厂房折算面积 (A*H/3) 与单位面积供热电耗对标柱状图 */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="size-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-foreground">典型工业厂房原始占地 vs 折算供暖面积 (A×H/3) 与单位面积耗电量 (kWh/㎡) 对标</h3>
                </div>
                <span className="text-[11px] text-muted-foreground">工业严寒/寒冷地区特级基准：≤ 2.5 kWh/㎡</span>
              </div>
              <BarChartGroup
                data={heatPumpWorkshopBenchmark}
                bars={[
                  { key: '原始面积', name: '原始供暖面积 (万㎡)', color: '#94a3b8' },
                  { key: '折算供暖面积', name: '折算供暖面积 A*H/3 (万㎡)', color: '#fa8c16' },
                  { key: '单位面积电耗', name: '单位面积供热电耗 (kWh/㎡)', color: '#1677ff' },
                ]}
                xKey="name"
                height={200}
              />
            </div>

            {/* 热泵效益台账明细表 (含 A*H/3 折算过程与层高明细) */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-panel">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-orange-600" />
                  <h3 className="text-xs font-bold text-foreground">热泵机组供热与折算面积耗电量台账明细表</h3>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    共 {filteredHeatPumpData.length} 个热泵系统
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  数据采集：智能热量表 (GJ) + 智慧电表 + 厂房层高档案
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-panel text-muted-foreground font-bold border-b border-border">
                      <th className="py-2.5 px-3 whitespace-nowrap">热泵项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">COP</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">供热量 (GJ)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">耗电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">原始供暖面积(万㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">建筑层高(m)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center bg-amber-500/20/60 text-amber-200">折算供暖面积(万㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-orange-500/20/60 text-orange-900">单位面积供热电耗 (kWh/㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">制热电耗(绿电)占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">制热电耗(市电尖/峰)占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">日节费 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">层高折算明细</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono">
                    {filteredHeatPumpData.map((item) => (
                      <tr key={item.id} className="hover:bg-orange-500/20/40 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-foreground">{item.name}</td>
                        <td className="py-2.5 px-3 font-sans text-muted-foreground">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-muted-foreground">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-orange-400">{item.cop}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground">{item.heatOutputGj}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground">
                          {item.powerKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center">{item.areaWanM2}</td>
                        <td className="py-2.5 px-3 text-center">{item.heightM}m</td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-300 bg-amber-500/200/10">
                          {item.convertedAreaWanM2}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-orange-400 bg-orange-500/20/30">
                          {item.kwhPerM2}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">{item.greenPowerRatio}%</td>
                        <td className="py-2.5 px-3 text-center text-purple-400 font-bold">{item.peakPowerRatio}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                          ¥{item.dailySavingsYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <button
                            type="button"
                            onClick={() => setSelectedHeightDetail({ isOpen: true, item })}
                            className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 hover:bg-orange-500/200/25 text-[11px] font-bold transition-colors cursor-pointer border border-orange-200"
                          >
                            层高折算查验
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

        {/* ============================================================ */}
        {/* 模块 3：光伏运行评估 (8大KPI + 24小时三轨功率平衡图 + 消纳/收益环形图 + 横向柱状图 + 台账) */}
        {/* ============================================================ */}
        {activeModule === 'pv' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* 8 大核心 KPI 卡片 (4列 × 2行 标准网格排版，深度集成同比/环比/达成率) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">光伏装机容量</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded font-medium">装机</span>
                </div>
                <div className="text-lg font-bold text-amber-400 mt-1.5 font-mono">{pvKpi.totalCapacity} <span className="text-xs font-normal">MWp</span></div>
                <div className="text-[10px] text-muted-foreground mt-1">并网标称装机功率</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">周期总发电量</span>
                  <span className="text-[10px] text-muted-foreground bg-panel px-1.5 py-0.5 rounded font-medium">关口发电</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-1.5 font-mono">{pvKpi.totalGen} <span className="text-xs font-normal">万kWh</span></div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono">
                  <span className="text-emerald-400 bg-emerald-500/15 px-1 py-0.2 rounded font-bold">同比 +8.6% ↑</span>
                  <span className="text-blue-400 bg-primary/10 px-1 py-0.2 rounded">环比 +3.2% ↑</span>
                </div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">有效发电小时数</span>
                  <span className="text-[10px] text-blue-600 bg-primary/15 px-1.5 py-0.5 rounded font-medium">利用小时</span>
                </div>
                <div className="text-lg font-bold text-blue-600 mt-1.5 font-mono">{pvKpi.avgHours} <span className="text-xs font-normal">h</span></div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono">
                  <span className="text-blue-400 bg-primary/15 px-1 py-0.2 rounded font-bold">同比 +4.8% ↑</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">超标杆 +25.8h</span>
                </div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/200/10 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-200 font-bold">综合消纳率</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/200/25 px-1.5 py-0.5 rounded font-bold">消纳/发电</span>
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-1.5 font-mono">{pvKpi.avgConsumedRatio}%</div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono">
                  <span className="text-emerald-400 bg-emerald-500/20 px-1 py-0.2 rounded font-bold">同比 +1.8% ↑</span>
                  <span className="text-amber-400 bg-amber-500/15 px-1 py-0.2 rounded">环比 -0.5% ↓</span>
                </div>
              </div>

              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">厂区消纳电量</span>
                  <span className="text-[10px] text-blue-600 bg-primary/15 px-1.5 py-0.5 rounded font-medium">自发自用</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-1.5 font-mono">{pvKpi.totalConsumed} <span className="text-xs font-normal">万kWh</span></div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono">
                  <span className="text-blue-400 bg-primary/10 px-1 py-0.2 rounded font-bold">同比 +9.2% ↑</span>
                  <span className="text-muted-foreground">自用消纳为主</span>
                </div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/200/10 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-200 font-medium">消纳节约收益</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/200/25 px-1.5 py-0.5 rounded font-medium">替代节费</span>
                </div>
                <div className="text-lg font-bold text-amber-400 mt-1.5 font-mono">¥{pvKpi.totalConsumedIncome} <span className="text-xs font-normal">万</span></div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono">
                  <span className="text-amber-400 bg-amber-500/20 px-1 py-0.2 rounded font-bold">同比 +8.4% ↑</span>
                  <span className="text-muted-foreground">均价 {pvKpi.avgConsumedPrice}元</span>
                </div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-border shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">余电上网电量</span>
                  <span className="text-[10px] text-muted-foreground bg-panel px-1.5 py-0.5 rounded font-medium">反送售电</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-1.5 font-mono">{pvKpi.totalGrid} <span className="text-xs font-normal">万kWh</span></div>
                <div className="text-[10px] text-muted-foreground mt-1">反送电网余电上网量</div>
              </div>
              <div className="bg-card p-3.5 rounded-xl border border-emerald-200 bg-emerald-500/20/30 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-200 font-medium">上网结算收益</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/200/25 px-1.5 py-0.5 rounded font-medium">脱硫煤价</span>
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-1.5 font-mono">¥{pvKpi.totalGridIncome} <span className="text-xs font-normal">万</span></div>
                <div className="text-[10px] text-muted-foreground mt-1">上网结算单价 {pvKpi.gridPrice} 元/kWh</div>
              </div>
            </div>

            {/* 🌟 光伏可视化图表区 1：左右分栏（24小时三轨功率平衡面积图 + 电量流向/收益构成双环图） */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* 左侧 8列：光伏运行历史对比分析（和自己比 · 发电量、发电小时数、消纳率） */}
              <div className="lg:col-span-8 bg-card p-4 rounded-xl border border-border shadow-xs space-y-2.5">
                {/* 顶栏控制组：卡片标题 + 指标切换胶囊 */}
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-foreground">光伏运行历史对比分析（和自己比）</span>
                  </div>

                  {/* 对比指标切换胶囊 (仅保留: 发电量 / 发电小时数 / 消纳率) */}
                  <div className="flex items-center gap-1 text-[10.5px]">
                    <span className="text-muted-foreground mr-0.5">对比指标:</span>
                    {(
                      [
                        { key: 'gen', label: '发电量' },
                        { key: 'hours', label: '发电小时数' },
                        { key: 'ratio', label: '消纳率' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setPvCompareMetric(m.key)}
                        className={cn(
                          'px-2.5 py-0.5 rounded transition-all cursor-pointer font-medium',
                          pvCompareMetric === m.key
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold shadow-2xs'
                            : 'text-muted-foreground bg-panel border border-border/60 hover:text-foreground'
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🌟 和自己对比 (纵向·同比/环比/历史走势) */}
                <div className="space-y-2">
                  {/* 三大指标同比环比速览条（精炼简洁，去除多余冗余信息） */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-panel/70 p-2 rounded-lg border border-border/60 text-xs">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">周期发电量</span>
                        <span className="font-mono font-bold text-foreground">118.5 万kWh</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                        <span className="text-emerald-400 bg-emerald-500/15 px-1 py-0.2 rounded font-bold">同比 +8.6% ↑</span>
                        <span className="text-blue-400 bg-primary/10 px-1 py-0.2 rounded">环比 +3.2% ↑</span>
                      </div>
                    </div>
                    <div className="flex flex-col md:border-l border-border/60 md:pl-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">有效发电小时数</span>
                        <span className="font-mono font-bold text-blue-400">925.8 h</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                        <span className="text-blue-400 bg-primary/15 px-1 py-0.2 rounded font-bold">同比 +4.8% ↑</span>
                        <span className="text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">环比 +2.0% ↑</span>
                      </div>
                    </div>
                    <div className="flex flex-col md:border-l border-border/60 md:pl-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">综合消纳率</span>
                        <span className="font-mono font-bold text-emerald-400">92.4%</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                        <span className="text-emerald-400 bg-emerald-500/20 px-1 py-0.2 rounded font-bold">同比 +1.8% ↑</span>
                        <span className="text-amber-400 bg-amber-500/15 px-1 py-0.2 rounded">环比 -0.5% ↓</span>
                      </div>
                    </div>
                  </div>

                  {/* 1~8月历史逐月走势与同期对照图 */}
                  <div className="pt-0.5">
                    <div className="flex items-center justify-between text-[10.5px] text-muted-foreground mb-1 font-mono">
                      <span className="font-sans font-medium text-slate-300">
                        {pvCompareMetric === 'gen' && '沈变本部 1~8月逐月发电量 (2026实际 vs 2025同期同比 vs 设计计划)'}
                        {pvCompareMetric === 'hours' && '沈变本部 1~8月有效利用小时数 (2026实际 vs 2025同比 vs 资源区标杆)'}
                        {pvCompareMetric === 'ratio' && '沈变本部 1~8月综合就地消纳率走势 (2026实际 vs 2025同比 vs 90%达标线)'}
                      </span>
                      <span>
                        {pvCompareMetric === 'gen' && '单位：万kWh'}
                        {pvCompareMetric === 'hours' && '单位：小时 (h)'}
                        {pvCompareMetric === 'ratio' && '单位：%'}
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={195}>
                      <ComposedChart data={PV_SELF_HISTORY_DATA} margin={{ top: 8, right: 16, left: -15, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />

                        {pvCompareMetric === 'gen' && (
                          <YAxis domain={[40, 160]} unit="万" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        )}
                        {pvCompareMetric === 'hours' && (
                          <YAxis domain={[30, 120]} unit="h" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        )}
                        {pvCompareMetric === 'ratio' && (
                          <YAxis domain={[85, 100]} unit="%" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        )}

                        <Tooltip
                          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }}
                        />
                        <Legend wrapperStyle={{ fontSize: 10.5, paddingTop: 2, color: '#94a3b8' }} />

                        {pvCompareMetric === 'gen' && (
                          <>
                            <Bar dataKey="gen2026" name="2026实际发电量 (万kWh)" fill="#faad14" radius={[3, 3, 0, 0]} maxBarSize={22} />
                            <Bar dataKey="gen2025" name="2025同期发电量 (同比)" fill="rgba(250, 173, 20, 0.35)" radius={[3, 3, 0, 0]} maxBarSize={22} />
                            <Line type="monotone" dataKey="genPlan" name="设计月度目标值" stroke="#1677ff" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
                          </>
                        )}

                        {pvCompareMetric === 'hours' && (
                          <>
                            <Bar dataKey="hours2026" name="2026实际利用小时 (h)" fill="#1677ff" radius={[3, 3, 0, 0]} maxBarSize={22} />
                            <Bar dataKey="hours2025" name="2025同期利用小时 (同比)" fill="rgba(22, 119, 255, 0.35)" radius={[3, 3, 0, 0]} maxBarSize={22} />
                            <Line type="monotone" dataKey="hoursBenchmark" name="资源区月度基准小时" stroke="#52c41a" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
                          </>
                        )}

                        {pvCompareMetric === 'ratio' && (
                          <>
                            <Line type="monotone" dataKey="ratio2026" name="2026综合消纳率 (%)" stroke="#52c41a" strokeWidth={2.5} dot={{ r: 3, fill: '#52c41a' }} />
                            <Line type="monotone" dataKey="ratio2025" name="2025同期消纳率 (%)" stroke="#94a3b8" strokeWidth={1.8} strokeDasharray="4 4" dot={{ r: 2 }} />
                            <ReferenceLine y={90.0} stroke="#ff4d4f" strokeDasharray="3 3" label={{ value: '90%考核达标线', fill: '#ff4d4f', fontSize: 10, position: 'insideTopRight' }} />
                          </>
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* 右侧 4列：电量流向与双轨收益双环形图 */}
              <div className="lg:col-span-4 bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center gap-1.5">
                  <PieIcon className="size-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-foreground">光伏电量消纳流向与经济收益构成</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/60">
                  <MiniStructureDonut
                    title="发电量流向"
                    mainPercentage="91.8%"
                    mainLabel="自发自用"
                    items={[
                      { name: '厂区就地消纳', value: 91.8, color: '#1677ff' },
                      { name: '余电反送上网', value: 8.2, color: '#52c41a' },
                    ]}
                  />
                  <div className="border-l border-border/60 pl-2">
                    <MiniStructureDonut
                      title="总效益构成"
                      mainPercentage="95.5%"
                      mainLabel="替代节费"
                      items={[
                        { name: '工商业节费', value: 95.5, color: '#fa8c16' },
                        { name: '余电上网售电', value: 4.5, color: '#13c2c2' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 🌟 光伏可视化图表区 2：各园区电站有效利用小时数与消纳率横向排行榜 */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-foreground">各分布式光伏电站有效发电小时数 (h) 与综合消纳率 (%) 排行榜</h3>
                </div>
                <span className="text-[11px] text-muted-foreground">一类资源区基准有效利用小时数：≥ 900 h</span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={pvBenchmarkData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[800, 1200]}
                    unit="h"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[80, 100]}
                    unit="%"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4, color: '#94a3b8' }} />
                  <Bar
                    yAxisId="left"
                    dataKey="有效小时数"
                    name="有效发电小时数 (h)"
                    fill="#1677ff"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="综合消纳率"
                    name="综合就地消纳率 (%)"
                    fill="#52c41a"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 光伏电站消纳与上网台账明细表 */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-panel">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-500/200" />
                  <h3 className="text-xs font-bold text-foreground">分布式光伏电站发电出力与消纳/上网台账明细表</h3>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    共 {filteredPvData.length} 个光伏项目
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  电网双向计量关口表同步结算
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-panel text-muted-foreground font-bold border-b border-border">
                      <th className="py-2.5 px-3 whitespace-nowrap">光伏项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">光伏装机 (MWp)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">发电量 (万kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">有效小时数 (h)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-primary/15 text-blue-300 text-blue-900">消纳电量 (万kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-primary/15 text-blue-300 text-blue-900">消纳收益 (万元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center bg-primary/15 text-blue-300 text-blue-900">消纳均价 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-bold text-emerald-400">消纳率 (%)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-emerald-500/200/15 text-emerald-300 text-emerald-200">上网电量 (万kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-emerald-500/200/15 text-emerald-300 text-emerald-200">上网收益 (万元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center bg-emerald-500/200/15 text-emerald-300 text-emerald-200">上网单价 (元)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono">
                    {filteredPvData.map((item) => (
                      <tr key={item.id} className="hover:hover:bg-amber-500/200/10 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-foreground">{item.name}</td>
                        <td className="py-2.5 px-3 font-sans text-muted-foreground">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-muted-foreground">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-400">{item.capacityMwp}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground">{item.genKwhWan}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-600">{item.effectiveHours}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-700 bg-primary/10">{item.consumedKwhWan}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-400 bg-primary/10">¥{item.consumedIncomeWan}</td>
                        <td className="py-2.5 px-3 text-center bg-primary/10">{item.consumedAvgPrice}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-400">{item.consumedRatio}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground bg-emerald-500/200/10">{item.gridKwhWan}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400 bg-emerald-500/200/10">¥{item.gridIncomeWan}</td>
                        <td className="py-2.5 px-3 text-center bg-emerald-500/200/10">{item.gridPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 弹窗 1：热泵供暖面积与建筑层高折算明细 (对齐 A*H/3 与不同层高车间) */}
      {/* ========================================================================= */}
      {selectedHeightDetail.isOpen && selectedHeightDetail.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between bg-orange-500/20/60">
              <div className="flex items-center gap-2">
                <Ruler className="size-5 text-orange-400" />
                <h3 className="text-sm font-bold text-foreground">
                  【{selectedHeightDetail.item.name}】供暖面积与层高折算台账
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHeightDetail({ isOpen: false, item: null })}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="rounded-xl border border-orange-500/30 bg-orange-500/200/10 p-3.5 space-y-1.5">
                <span className="font-bold text-orange-900 block text-xs">标准折算计算公式与原则：</span>
                <p className="text-muted-foreground leading-relaxed font-mono">
                  折算供暖面积 = 原始面积 A (万㎡) × 层高 H (m) ÷ 3 (标准参考层高 3m)
                </p>
                <p className="text-muted-foreground text-[11px]">
                  注：变压器与电缆制造厂房多为 9~18 米高大空间，热对流耗热量显著高于普通建筑，依据工信部工业绿色建筑供暖折算规范统一标准化折算。
                </p>
              </div>

              <div>
                <span className="font-bold text-foreground block mb-2">不同建筑层高明细分解表：</span>
                <table className="w-full text-left border-collapse border border-border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-panel/80 text-muted-foreground font-bold border-b border-border">
                      <th className="py-2 px-3">车间/建筑功能单元</th>
                      <th className="py-2 px-3 text-center">原始面积 A (万㎡)</th>
                      <th className="py-2 px-3 text-center">净空层高 H (m)</th>
                      <th className="py-2 px-3 text-center bg-orange-500/20/60 text-orange-900">折算供暖面积 (万㎡)</th>
                      <th className="py-2 px-3 text-right">折算倍率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono text-[11px]">
                    {selectedHeightDetail.item.heightBreakdown.map((b, idx) => (
                      <tr key={idx} className="hover:bg-panel">
                        <td className="py-2 px-3 font-sans font-medium text-foreground">{b.buildingName}</td>
                        <td className="py-2 px-3 text-center">{b.areaWanM2}</td>
                        <td className="py-2 px-3 text-center font-bold text-blue-600">{b.heightM}m</td>
                        <td className="py-2 px-3 text-center font-bold text-orange-400 bg-orange-500/15">{b.convertedAreaWanM2}</td>
                        <td className="py-2 px-3 text-right font-sans text-muted-foreground">{(b.heightM / 3).toFixed(1)}x</td>
                      </tr>
                    ))}
                    <tr className="bg-orange-500/20/40 font-bold text-foreground">
                      <td className="py-2 px-3 font-sans">合计汇总</td>
                      <td className="py-2 px-3 text-center">{selectedHeightDetail.item.areaWanM2} 万㎡</td>
                      <td className="py-2 px-3 text-center font-sans text-muted-foreground">-</td>
                      <td className="py-2 px-3 text-center text-orange-400">{selectedHeightDetail.item.convertedAreaWanM2} 万㎡</td>
                      <td className="py-2 px-3 text-right font-sans text-orange-400">
                        {(selectedHeightDetail.item.convertedAreaWanM2 / selectedHeightDetail.item.areaWanM2).toFixed(2)}x
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg border border-border bg-panel p-3 space-y-1">
                <span className="font-bold text-foreground block">单位面积供热耗电量推导：</span>
                <p className="font-mono text-muted-foreground text-[11px]">
                  {selectedHeightDetail.item.powerKwh} kWh ÷ ({selectedHeightDetail.item.convertedAreaWanM2} × 10,000 ㎡) = <strong className="text-orange-400 font-bold text-xs">{selectedHeightDetail.item.kwhPerM2} kWh/㎡</strong>
                </p>
              </div>
            </div>

            <div className="p-3 border-t border-border bg-panel flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedHeightDetail({ isOpen: false, item: null })}
                className="px-4 py-1.5 rounded-lg bg-primary text-white font-bold text-xs hover:bg-blue-600 transition-colors"
              >
                已核实确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 2：算法详情与计算推导演练对话框 */}
      {/* ========================================================================= */}
      {selectedCalcDetail.isOpen && selectedCalcDetail.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between bg-primary/15 text-blue-300">
              <div className="flex items-center gap-2">
                <Calculator className="size-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  【{selectedCalcDetail.data.name}】数值计算推导演练
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCalcDetail({ isOpen: false, type: 'storage', data: null })}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="rounded-xl border border-primary/30 bg-primary/15 text-blue-300 p-3.5 space-y-1">
                <span className="font-bold text-blue-950 block">核算公式与业务逻辑：</span>
                <p className="font-mono text-foreground leading-relaxed text-[11px]">
                  {selectedCalcDetail.data.calcContext?.formula}
                </p>
              </div>

              {selectedCalcDetail.type === 'storage' && (
                <div className="space-y-2 bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px]">
                  <div className="text-emerald-400 font-bold">储能充放电与套利计算步骤：</div>
                  <div>1. 综合效率 = {selectedCalcDetail.data.dischargeKwh} ÷ {selectedCalcDetail.data.chargeKwh} = {selectedCalcDetail.data.efficiency}%</div>
                  <div>2. 放电收入 = 尖放 {selectedCalcDetail.data.calcContext.criticalDischargeKwh}kWh × 1.28 + 峰放 {selectedCalcDetail.data.calcContext.peakDischargeKwh}kWh × 0.98 = ¥{selectedCalcDetail.data.calcContext.dischargeIncomeYuan.toFixed(2)} 元</div>
                  <div>3. 充电成本 = 绿电充 {selectedCalcDetail.data.calcContext.greenChargeKwh}kWh × 0.42 + 市电充 {selectedCalcDetail.data.calcContext.gridChargeKwh}kWh × 0.32 = ¥{selectedCalcDetail.data.calcContext.chargeCostYuan.toFixed(2)} 元</div>
                  <div className="text-amber-300 font-bold">4. 净套利收益 = ¥{selectedCalcDetail.data.revenueYuan} 元</div>
                </div>
              )}

              {selectedCalcDetail.type === 'pv' && (
                <div className="space-y-2 bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px]">
                  <div className="text-amber-400 font-bold">光伏消纳与余电上网计算步骤：</div>
                  <div>1. 有效发电小时数 = {selectedCalcDetail.data.genKwhWan}万kWh × 10000 ÷ ({selectedCalcDetail.data.capacityMwp}MWp × 1000) = {selectedCalcDetail.data.effectiveHours} h</div>
                  <div>2. 消纳收益 = {selectedCalcDetail.data.consumedKwhWan}万kWh × {selectedCalcDetail.data.consumedAvgPrice}元/kWh = ¥{selectedCalcDetail.data.consumedIncomeWan} 万元</div>
                  <div>3. 上网收益 = {selectedCalcDetail.data.gridKwhWan}万kWh × {selectedCalcDetail.data.gridPrice}元/kWh = ¥{selectedCalcDetail.data.gridIncomeWan} 万元</div>
                  <div className="text-emerald-300 font-bold">4. 总经济效益 = ¥{selectedCalcDetail.data.totalIncomeWan} 万元 (消纳率 {selectedCalcDetail.data.consumedRatio}%)</div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border bg-panel flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCalcDetail({ isOpen: false, type: 'storage', data: null })}
                className="px-4 py-1.5 rounded-lg bg-primary text-white font-bold text-xs hover:bg-blue-600 transition-colors"
              >
                已完成查验
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

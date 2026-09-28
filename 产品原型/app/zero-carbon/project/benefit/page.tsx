'use client'

import React, { useState, useMemo, useEffect } from 'react'
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
  Snowflake,
  PieChart as PieIcon,
  SunMedium,
  Clock,
  Building2,
  CircleDollarSign,
  Share2,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { ExportButton } from '@/components/shared/primitives'
import { CollapsibleProjectBar } from '@/components/shared/collapsible-project-bar'
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
  amount?: string
}

function MiniStructureDonut({
  title,
  mainPercentage,
  mainLabel,
  items,
  layout = 'vertical',
  ratio = '5:7',
}: {
  title?: string
  mainPercentage: string
  mainLabel: string
  items: DonutItem[]
  layout?: 'vertical' | 'horizontal'
  ratio?: '5:7' | '4:6' | '1:1'
}) {
  const total = items.reduce((acc, i) => acc + i.value, 0) || 1
  let accumulatedPercent = 0

  if (layout === 'horizontal') {
    const leftColSpan = ratio === '1:1' ? 'sm:col-span-6' : 'sm:col-span-5'
    const rightColSpan = ratio === '1:1' ? 'sm:col-span-6' : 'sm:col-span-7'

    return (
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center w-full py-1">
        {/* 左侧图 (约 41.7% 黄金比例)：SVG 环形进度圈与中央关键指标 */}
        <div className={`${leftColSpan} flex flex-col items-center justify-center`}>
          {title && <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1.5">{title}</span>}
          <div className="relative size-32 shrink-0 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#f1f5f9"
                className="stroke-slate-100 dark:stroke-slate-800"
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
              <span className="text-xl font-bold font-mono text-slate-800 dark:text-white leading-none">
                {mainPercentage}
              </span>
              <span className="text-[11px] text-slate-400 font-medium mt-1.5">
                {mainLabel}
              </span>
            </div>
          </div>
        </div>

        {/* 右侧数据 (约 58.3% 黄金比例)：带左侧细边框隔离，结构清单与实测总量/金额/占比/进度条 */}
        <div className={`${rightColSpan} w-full space-y-4 pl-0 sm:pl-5 sm:border-l sm:border-slate-100 dark:sm:border-border flex flex-col justify-center`}>
          {items.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium truncate" title={item.name}>
                  <span className="size-2.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </span>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  {item.amount && (
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">{item.amount}</span>
                  )}
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 w-14 text-right">
                    {item.value}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, item.value))}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full px-1">
      {title && <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">{title}</span>}

      {/* SVG 环形进度圈与中央关键指标 */}
      <div className="relative size-24 shrink-0 flex items-center justify-center my-1">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#f1f5f9"
            className="stroke-slate-100 dark:stroke-slate-800"
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
          <span className="text-base font-bold font-mono text-slate-800 dark:text-white leading-none">
            {mainPercentage}
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            {mainLabel}
          </span>
        </div>
      </div>

      {/* 结构图例清单 */}
      <div className="w-full mt-2 space-y-1.5 pt-2 border-t border-slate-100 dark:border-border">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-[11px] leading-tight">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate max-w-[110px]" title={item.name}>
              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-100 shrink-0 ml-1">
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
// 4. 空调效益数据模型 (涵盖功率、用电量、供冷量、COP及折算面积)
// ==========================================
export interface HvacBenefitItem {
  id: string
  name: string
  park: string
  company: string
  capacityKw: number // 额定装机冷量/功率 (kW)
  powerKw: number // 实时运行总功率 (kW)
  cop: number // COP 综合制冷能效比
  coolingOutputGj: number // 供冷量 (GJ)
  coolingOutputEquivalentKwh: number // 供冷量折算电量 (万kWh)
  powerKwh: number // 供冷总耗电量 (kWh)
  areaWanM2: number // 原始供冷面积 A (万㎡)
  heightM: number // 建筑平均层高 H (m)
  convertedAreaWanM2: number // 折算供冷面积 A*H/3 (万㎡)
  kwhPerM2: number // 单位面积供冷耗电量 (kWh/㎡)
  greenPowerRatio: number // 供冷电耗占比（绿电）(%)
  peakPowerRatio: number // 供冷电耗占比（市电尖/峰）(%)
  flatValleyPowerRatio: number // 供冷电耗平谷占比 (%)
  dailySavingsYuan: number // 日节费 (元)
  monthlySavingsWan: number // 月节费 (万元)
  carbonReductionTons: number // 碳减排量 (tCO2)
}

// ==========================================
// 5. 模拟数据清单
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
    id: 'pv-08',
    name: '和新套管 3.2MWp 厂区连跨屋顶分布式光伏二期',
    park: '特变电工东北输变电产业园',
    company: '和新套管',
    capacityMwp: 3.2,
    genKwhWan: 30.2,
    effectiveHours: 943.8,
    consumedKwhWan: 27.8,
    consumedIncomeWan: 20.16,
    consumedAvgPrice: 0.725,
    consumedRatio: 92.1,
    gridKwhWan: 2.4,
    gridIncomeWan: 0.91,
    gridPrice: 0.380,
    totalIncomeWan: 21.07,
    carbonReductionTons: 161.6,
    calcContext: {
      co2Factor: 0.535,
      tceFactor: 0.1229,
      formula: '利用和新厂房优质彩钢瓦屋面铺设轻质高效单晶硅组件，就地消纳率达 92.1%',
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

const HVAC_BENEFIT_DATA: HvacBenefitItem[] = [
  {
    id: 'hvac-01',
    name: '德缆产业园 3.2MW 变频高效冷站系统',
    park: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    capacityKw: 3200,
    powerKw: 1420.0,
    cop: 4.38,
    coolingOutputGj: 245.6,
    coolingOutputEquivalentKwh: 6.82,
    powerKwh: 15600.0,
    areaWanM2: 2.8,
    heightM: 8.5,
    convertedAreaWanM2: 7.9,
    kwhPerM2: 0.20,
    greenPowerRatio: 76.5,
    peakPowerRatio: 21.0,
    flatValleyPowerRatio: 2.5,
    dailySavingsYuan: 5840.0,
    monthlySavingsWan: 17.52,
    carbonReductionTons: 68.2,
  },
  {
    id: 'hvac-02',
    name: '新疆变压器厂区 特高压干燥恒温冷站',
    park: '特变电工新疆产业园',
    company: '新变厂',
    capacityKw: 4500,
    powerKw: 1150.0,
    cop: 4.22,
    coolingOutputGj: 312.0,
    coolingOutputEquivalentKwh: 8.67,
    powerKwh: 20500.0,
    areaWanM2: 2.4,
    heightM: 12.0,
    convertedAreaWanM2: 9.6,
    kwhPerM2: 0.21,
    greenPowerRatio: 82.0,
    peakPowerRatio: 19.5,
    flatValleyPowerRatio: 0.0,
    dailySavingsYuan: 7210.0,
    monthlySavingsWan: 21.63,
    carbonReductionTons: 89.5,
  },
  {
    id: 'hvac-03',
    name: '沈变厂区 2.0MW 磁悬浮离心冷水机组',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    capacityKw: 2000,
    powerKw: 580.0,
    cop: 4.52,
    coolingOutputGj: 182.4,
    coolingOutputEquivalentKwh: 5.07,
    powerKwh: 11200.0,
    areaWanM2: 1.2,
    heightM: 10.0,
    convertedAreaWanM2: 4.0,
    kwhPerM2: 0.28,
    greenPowerRatio: 68.5,
    peakPowerRatio: 26.2,
    flatValleyPowerRatio: 5.3,
    dailySavingsYuan: 4120.0,
    monthlySavingsWan: 12.36,
    carbonReductionTons: 48.6,
  },
  {
    id: 'hvac-04',
    name: '衡变公司 研发大楼水冷螺杆中央空调',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    capacityKw: 1200,
    powerKw: 270.0,
    cop: 3.95,
    coolingOutputGj: 120.0,
    coolingOutputEquivalentKwh: 3.33,
    powerKwh: 8900.0,
    areaWanM2: 0.8,
    heightM: 4.5,
    convertedAreaWanM2: 1.2,
    kwhPerM2: 0.74,
    greenPowerRatio: 71.0,
    peakPowerRatio: 24.5,
    flatValleyPowerRatio: 4.5,
    dailySavingsYuan: 2450.0,
    monthlySavingsWan: 7.35,
    carbonReductionTons: 38.5,
  },
]

export default function BenefitEvaluationPage() {
  // 0. 园区结构树选择状态 (默认全集团)
  const [selectedParkId, setSelectedParkId] = useState('park_root')
  const [selectedParkNode, setSelectedParkNode] = useState<StandardOrgNode | null>(null)

  const isParkRoot =
    !selectedParkNode || selectedParkNode.id === 'park_root' || selectedParkNode.name.includes('电装集团')

  // 1. 顶部模块大 Tab 切换: 光伏效益 | 储能效益 | 热泵效益 | 空调效益 (参照【实时监控】统一模块顺序)
  const [activeModule, setActiveModule] = useState<'pv' | 'storage' | 'heatpump' | 'hvac'>('pv')

  // 1.1 当前选中的项目名称 (支持单项与全部叠加，100% 对齐实时监控页)
  const [selectedProjectName, setSelectedProjectName] = useState<string>('全部 (多个项目叠加)')

  // 核心模块切换或组织树切换时，复位为全部
  useEffect(() => {
    setSelectedProjectName('全部 (多个项目叠加)')
  }, [activeModule, selectedParkId])

  // 2. 时间维度与范围选择 (按照【指标管控】规范统一为月度、季度、年度、自定义)
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

  // 4. 热泵建筑层高折算明细弹窗
  const [selectedHeightDetail, setSelectedHeightDetail] = useState<{
    isOpen: boolean
    item: HeatPumpBenefitItem | null
  }>({
    isOpen: false,
    item: null,
  })


  // 5. 动态时间因子与范围解析 (月/季/年/自定义全时序联动)
  const resolveCustomMonths = (start: string, end: string): string[] => {
    if (!start || !end) return ['2026-08']
    const [sy, sm] = start.split('-').map(Number)
    const [ey, em] = end.split('-').map(Number)
    const list: string[] = []
    let cy = sy
    let cm = sm
    while (cy < ey || (cy === ey && cm <= em)) {
      list.push(`${cy}-${cm < 10 ? '0' + cm : cm}`)
      cm++
      if (cm > 12) {
        cm = 1
        cy++
      }
      if (list.length >= 12) break
    }
    return list.length > 0 ? list : ['2026-08']
  }

  const timeFactor = useMemo(() => {
    let scale = 1.0
    let label = selectedMonth
    let seed = 8

    if (timeDim === 'month') {
      const m = parseInt(selectedMonth.split('-')[1] || '8', 10)
      seed = m
      scale = 0.92 + ((m * 7) % 20) / 100
      label = `${selectedMonth}`
    } else if (timeDim === 'quarter') {
      const q = parseInt(selectedQuarter.replace(/.*Q/, '') || '3', 10)
      seed = q * 3
      scale = 2.85 + q * 0.12
      label = `${selectedQuarter}`
    } else if (timeDim === 'year') {
      const y = parseInt(selectedYear || '2026', 10)
      seed = y % 10
      scale = 11.8 + (seed % 5) * 0.1
      label = `${selectedYear}年度`
    } else if (timeDim === 'custom') {
      const count = getMonthsCount(selectedMonthRange.start, selectedMonthRange.end)
      scale = Math.max(1, count) * 1.01
      seed = count
      label = `${selectedMonthRange.start} 至 ${selectedMonthRange.end}`
    }

    return { scale, label, seed }
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

  // 5.1 当前评估模块与当前组织下的有效项目列表 (首项支持全部叠加，100% 对齐实时监控页)
  const currentProjectList = useMemo(() => {
    const list: Array<{
      id: string
      name: string
      displayName: string
      fullName: string
    }> = []

    let sourceData: Array<{ id: string; name: string; park: string; company: string }> = []
    if (activeModule === 'pv') sourceData = PV_BENEFIT_DATA
    else if (activeModule === 'storage') sourceData = STORAGE_BENEFIT_DATA
    else if (activeModule === 'heatpump') sourceData = HEAT_PUMP_BENEFIT_DATA
    else if (activeModule === 'hvac') sourceData = HVAC_BENEFIT_DATA

    const target = selectedParkNode?.name || ''
    const matched = isParkRoot
      ? sourceData
      : sourceData.filter(
          (item) =>
            item.park.includes(target) ||
            target.includes(item.park) ||
            item.company.includes(target) ||
            target.includes(item.company),
        )

    const baseList = matched.length > 0 ? matched : sourceData

    // 第一项：全部 (多个项目叠加)
    list.push({
      id: `${activeModule}-all`,
      name: '全部 (多个项目叠加)',
      displayName: '全部 (多个项目叠加)',
      fullName: '全部 (多个项目叠加)',
    })

    const seen = new Set<string>()
    for (const item of baseList) {
      if (!seen.has(item.name)) {
        seen.add(item.name)
        list.push({
          id: item.id,
          name: item.name,
          displayName: item.name,
          fullName: item.name,
        })
      }
    }
    return list
  }, [activeModule, selectedParkNode, isParkRoot])

  // 6. 根据当前选中的园区及选中的具体项目筛选数据并联动时间周期
  const filteredStorageData = useMemo(() => {
    const target = selectedParkNode?.name || ''
    const base = isParkRoot
      ? STORAGE_BENEFIT_DATA
      : STORAGE_BENEFIT_DATA.filter(
          (item) =>
            item.park.includes(target) ||
            target.includes(item.park) ||
            item.company.includes(target) ||
            target.includes(item.company),
        )
    const list = base.length > 0 ? base : STORAGE_BENEFIT_DATA
    const projectFiltered =
      selectedProjectName === '全部 (多个项目叠加)'
        ? list
        : list.filter((item) => item.name === selectedProjectName)
    const finalData = projectFiltered.length > 0 ? projectFiltered : list
    const scale = timeFactor.scale
    return finalData.map((item) => ({
      ...item,
      chargeKwh: Math.round(item.chargeKwh * scale),
      dischargeKwh: Math.round(item.dischargeKwh * scale),
      revenueYuan: Math.round(item.revenueYuan * scale),
    }))
  }, [selectedParkNode, isParkRoot, timeFactor, selectedProjectName])

  const filteredHeatPumpData = useMemo(() => {
    const target = selectedParkNode?.name || ''
    const base = isParkRoot
      ? HEAT_PUMP_BENEFIT_DATA
      : HEAT_PUMP_BENEFIT_DATA.filter(
          (item) =>
            item.park.includes(target) ||
            target.includes(item.park) ||
            item.company.includes(target) ||
            target.includes(item.company),
        )
    const list = base.length > 0 ? base : HEAT_PUMP_BENEFIT_DATA
    const projectFiltered =
      selectedProjectName === '全部 (多个项目叠加)'
        ? list
        : list.filter((item) => item.name === selectedProjectName)
    const finalData = projectFiltered.length > 0 ? projectFiltered : list
    const scale = timeFactor.scale
    const copDelta = timeDim === 'year' ? 0.05 : timeDim === 'quarter' ? 0.02 : 0
    return finalData.map((item) => ({
      ...item,
      heatOutputGj: +(item.heatOutputGj * scale).toFixed(1),
      powerKwh: Math.round(item.powerKwh * scale),
      cop: +(item.cop + copDelta).toFixed(2),
    }))
  }, [selectedParkNode, isParkRoot, timeFactor, timeDim, selectedProjectName])

  const filteredPvData = useMemo(() => {
    if (!selectedParkNode) return PV_BENEFIT_DATA
    const target = selectedParkNode.name
    const base = isParkRoot
      ? PV_BENEFIT_DATA
      : PV_BENEFIT_DATA.filter(
          (item) =>
            item.park.includes(target) ||
            target.includes(item.park) ||
            item.company.includes(target) ||
            target.includes(item.company),
        )
    const list = base.length > 0 ? base : PV_BENEFIT_DATA
    const projectFiltered =
      selectedProjectName === '全部 (多个项目叠加)'
        ? list
        : list.filter((item) => item.name === selectedProjectName)
    const finalData = projectFiltered.length > 0 ? projectFiltered : list
    const scale = timeFactor.scale
    return finalData.map((item) => ({
      ...item,
      genKwhWan: +(item.genKwhWan * scale).toFixed(1),
      consumedKwhWan: +(item.consumedKwhWan * scale).toFixed(1),
      gridKwhWan: +(item.gridKwhWan * scale).toFixed(1),
      consumedIncomeWan: +(item.consumedIncomeWan * scale).toFixed(2),
      gridIncomeWan: +(item.gridIncomeWan * scale).toFixed(2),
      effectiveHours: +(item.effectiveHours * scale).toFixed(1),
    }))
  }, [selectedParkNode, isParkRoot, timeFactor, selectedProjectName])

  const filteredHvacData = useMemo(() => {
    const target = selectedParkNode?.name || ''
    const base = isParkRoot
      ? HVAC_BENEFIT_DATA
      : HVAC_BENEFIT_DATA.filter(
          (item) =>
            item.park.includes(target) ||
            target.includes(item.park) ||
            item.company.includes(target) ||
            target.includes(item.company),
        )
    const list = base.length > 0 ? base : HVAC_BENEFIT_DATA
    const projectFiltered =
      selectedProjectName === '全部 (多个项目叠加)'
        ? list
        : list.filter((item) => item.name === selectedProjectName)
    const finalData = projectFiltered.length > 0 ? projectFiltered : list
    const scale = timeFactor.scale
    const copDelta = timeDim === 'year' ? 0.06 : timeDim === 'quarter' ? 0.03 : 0
    return finalData.map((item) => ({
      ...item,
      coolingOutputGj: +(item.coolingOutputGj * scale).toFixed(1),
      powerKwh: Math.round(item.powerKwh * scale),
      cop: +(item.cop + copDelta).toFixed(2),
    }))
  }, [selectedParkNode, isParkRoot, timeFactor, timeDim, selectedProjectName])

  // ============================================================
  // 图表多维数据集 (涵盖时序走势、负荷结构环形图与横向对标柱状图)
  // ============================================================

  // 储能图表数据 (随查询时间联动)
  const storageTrendData = useMemo(() => {
    const { seed } = timeFactor

    if (timeDim === 'month') {
      const monthStr = selectedMonth.slice(5)
      return [
        { date: `${monthStr}-05`, 充电量: +(3.65 * (0.96 + (seed % 3) * 0.02)).toFixed(2), 放电量: +(3.18 * (0.96 + (seed % 3) * 0.02)).toFixed(2), 收益: Math.round(2420 * (0.96 + (seed % 3) * 0.02)) },
        { date: `${monthStr}-09`, 充电量: +(3.72 * (0.98 + (seed % 4) * 0.02)).toFixed(2), 放电量: +(3.24 * (0.98 + (seed % 4) * 0.02)).toFixed(2), 收益: Math.round(2480 * (0.98 + (seed % 4) * 0.02)) },
        { date: `${monthStr}-14`, 充电量: +(3.80 * (0.97 + (seed % 5) * 0.02)).toFixed(2), 放电量: +(3.31 * (0.97 + (seed % 5) * 0.02)).toFixed(2), 收益: Math.round(2550 * (0.97 + (seed % 5) * 0.02)) },
        { date: `${monthStr}-18`, 充电量: +(3.75 * (0.95 + (seed % 3) * 0.03)).toFixed(2), 放电量: +(3.26 * (0.95 + (seed % 3) * 0.03)).toFixed(2), 收益: Math.round(2510 * (0.95 + (seed % 3) * 0.03)) },
        { date: `${monthStr}-22`, 充电量: +(3.68 * (0.97 + (seed % 4) * 0.02)).toFixed(2), 放电量: +(3.20 * (0.97 + (seed % 4) * 0.02)).toFixed(2), 收益: Math.round(2460 * (0.97 + (seed % 4) * 0.02)) },
        { date: `${monthStr}-26`, 充电量: +(3.78 * (0.98 + (seed % 3) * 0.02)).toFixed(2), 放电量: +(3.29 * (0.98 + (seed % 3) * 0.02)).toFixed(2), 收益: Math.round(2530 * (0.98 + (seed % 3) * 0.02)) },
        { date: `${monthStr}-30`, 充电量: +(3.76 * (0.97 + (seed % 4) * 0.02)).toFixed(2), 放电量: +(3.27 * (0.97 + (seed % 4) * 0.02)).toFixed(2), 收益: Math.round(2507 * (0.97 + (seed % 4) * 0.02)) },
      ]
    } else if (timeDim === 'quarter') {
      const qNum = parseInt(selectedQuarter.replace(/.*Q/, '') || '3', 10)
      const startM = (qNum - 1) * 3 + 1
      const months = [`${startM < 10 ? '0' + startM : startM}月`, `${startM + 1 < 10 ? '0' + (startM + 1) : startM + 1}月`, `${startM + 2 < 10 ? '0' + (startM + 2) : startM + 2}月`]
      return months.map((mName, idx) => ({
        date: mName,
        充电量: +(11.2 + idx * 0.6 + seed * 0.1).toFixed(2),
        放电量: +(9.8 + idx * 0.5 + seed * 0.09).toFixed(2),
        收益: Math.round(7450 + idx * 350 + seed * 80),
      }))
    } else if (timeDim === 'year') {
      return Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1 < 10 ? '0' + (i + 1) : i + 1}月`,
        充电量: +(10.8 + Math.sin(i * 0.5) * 1.5 + (seed % 3) * 0.1).toFixed(2),
        放电量: +(9.4 + Math.sin(i * 0.5) * 1.3 + (seed % 3) * 0.09).toFixed(2),
        收益: Math.round(7100 + Math.sin(i * 0.5) * 900 + (seed % 4) * 70),
      }))
    } else {
      const months = resolveCustomMonths(selectedMonthRange.start, selectedMonthRange.end)
      return months.map((mStr, idx) => ({
        date: mStr.slice(5) + '月',
        充电量: +(11.0 + idx * 0.3 + (seed % 3) * 0.1).toFixed(2),
        放电量: +(9.6 + idx * 0.25 + (seed % 3) * 0.09).toFixed(2),
        收益: Math.round(7300 + idx * 200 + (seed % 4) * 60),
      }))
    }
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange, timeFactor])

  const storageBenchmarkData = [
    { name: '衡变储能', 综合效率: 87.0, 日套利收益: 8420 },
    { name: '沈变储能', 综合效率: 87.5, 日套利收益: 7120 },
    { name: '新变超高压', 综合效率: 86.8, 日套利收益: 5380 },
    { name: '鲁缆储能', 综合效率: 87.0, 日套利收益: 4150 },
  ]

  // 热泵图表数据 (集成 COP 与同比 COP 双柱对比，随查询时间联动)
  const heatPumpTrendData = useMemo(() => {
    const { seed } = timeFactor

    if (timeDim === 'month') {
      const monthStr = selectedMonth.slice(5)
      return [
        { date: `${monthStr}-05`, 供热量GJ: +(195.2 * (0.95 + (seed % 3) * 0.03)).toFixed(1), 耗电量万kWh: +(1.42 * (0.95 + (seed % 3) * 0.03)).toFixed(2), 本期COP: +(3.80 + ((seed * 2) % 10) * 0.01).toFixed(2), 同期COP: +(3.65 + ((seed * 2) % 8) * 0.01).toFixed(2) },
        { date: `${monthStr}-09`, 供热量GJ: +(202.5 * (0.96 + (seed % 4) * 0.02)).toFixed(1), 耗电量万kWh: +(1.46 * (0.96 + (seed % 4) * 0.02)).toFixed(2), 本期COP: +(3.84 + ((seed * 3) % 9) * 0.01).toFixed(2), 同期COP: +(3.68 + ((seed * 3) % 7) * 0.01).toFixed(2) },
        { date: `${monthStr}-14`, 供热量GJ: +(215.0 * (0.97 + (seed % 5) * 0.02)).toFixed(1), 耗电量万kWh: +(1.54 * (0.97 + (seed % 5) * 0.02)).toFixed(2), 本期COP: +(3.88 + ((seed * 4) % 8) * 0.01).toFixed(2), 同期COP: +(3.70 + ((seed * 4) % 6) * 0.01).toFixed(2) },
        { date: `${monthStr}-18`, 供热量GJ: +(208.4 * (0.95 + (seed % 3) * 0.03)).toFixed(1), 耗电量万kWh: +(1.50 * (0.95 + (seed % 3) * 0.03)).toFixed(2), 本期COP: +(3.85 + ((seed * 5) % 9) * 0.01).toFixed(2), 同期COP: +(3.66 + ((seed * 5) % 7) * 0.01).toFixed(2) },
        { date: `${monthStr}-22`, 供热量GJ: +(205.1 * (0.96 + (seed % 4) * 0.02)).toFixed(1), 耗电量万kWh: +(1.48 * (0.96 + (seed % 4) * 0.02)).toFixed(2), 本期COP: +(3.83 + ((seed * 6) % 8) * 0.01).toFixed(2), 同期COP: +(3.65 + ((seed * 6) % 6) * 0.01).toFixed(2) },
        { date: `${monthStr}-26`, 供热量GJ: +(212.8 * (0.98 + (seed % 3) * 0.02)).toFixed(1), 耗电量万kWh: +(1.52 * (0.98 + (seed % 3) * 0.02)).toFixed(2), 本期COP: +(3.87 + ((seed * 7) % 9) * 0.01).toFixed(2), 同期COP: +(3.69 + ((seed * 7) % 7) * 0.01).toFixed(2) },
        { date: `${monthStr}-30`, 供热量GJ: +(207.9 * (0.97 + (seed % 4) * 0.02)).toFixed(1), 耗电量万kWh: +(1.50 * (0.97 + (seed % 4) * 0.02)).toFixed(2), 本期COP: +(3.85 + ((seed * 8) % 8) * 0.01).toFixed(2), 同期COP: +(3.67 + ((seed * 8) % 6) * 0.01).toFixed(2) },
      ]
    } else if (timeDim === 'quarter') {
      const qNum = parseInt(selectedQuarter.replace(/.*Q/, '') || '3', 10)
      const startM = (qNum - 1) * 3 + 1
      const months = [`${startM < 10 ? '0' + startM : startM}月`, `${startM + 1 < 10 ? '0' + (startM + 1) : startM + 1}月`, `${startM + 2 < 10 ? '0' + (startM + 2) : startM + 2}月`]
      return months.map((mName, idx) => ({
        date: mName,
        供热量GJ: +(620.5 + idx * 25.4 + seed * 5).toFixed(1),
        耗电量万kWh: +(4.45 + idx * 0.18 + seed * 0.05).toFixed(2),
        本期COP: +(3.82 + idx * 0.04 + (seed % 3) * 0.02).toFixed(2),
        同期COP: +(3.66 + idx * 0.03 + (seed % 2) * 0.02).toFixed(2),
      }))
    } else if (timeDim === 'year') {
      return Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1 < 10 ? '0' + (i + 1) : i + 1}月`,
        供热量GJ: +(580.0 + Math.sin(i * 0.5) * 80 + seed * 4).toFixed(1),
        耗电量万kWh: +(4.2 + Math.sin(i * 0.5) * 0.6 + seed * 0.04).toFixed(2),
        本期COP: +(3.80 + Math.cos(i * 0.5) * 0.1 + (seed % 3) * 0.01).toFixed(2),
        同期COP: +(3.65 + Math.cos(i * 0.5) * 0.08 + (seed % 2) * 0.01).toFixed(2),
      }))
    } else {
      const months = resolveCustomMonths(selectedMonthRange.start, selectedMonthRange.end)
      return months.map((mStr, idx) => ({
        date: mStr.slice(5) + '月',
        供热量GJ: +(600.0 + idx * 15 + seed * 3).toFixed(1),
        耗电量万kWh: +(4.3 + idx * 0.1 + seed * 0.03).toFixed(2),
        本期COP: +(3.82 + (idx % 3) * 0.03 + (seed % 2) * 0.01).toFixed(2),
        同期COP: +(3.66 + (idx % 3) * 0.02 + (seed % 2) * 0.01).toFixed(2),
      }))
    }
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange, timeFactor])

  const heatPumpPowerSourceDonut = [
    { name: '清洁绿电直供 (光伏微网)', value: 72.0, color: '#52c41a' },
    { name: '市电低谷电网输入', value: 24.5, color: '#2C7CFF' },
    { name: '市电平段补充', value: 3.5, color: '#fa8c16' },
  ]

  const heatPumpPeakValleyDonut = [
    { name: '平谷避峰时段制热', value: 75.5, color: '#13c2c2' },
    { name: '尖峰时段运行电耗', value: 24.5, color: '#f5222d' },
  ]

  // 空调图表数据 (随查询时间联动)
  const hvacTrendData = useMemo(() => {
    const { seed } = timeFactor

    if (timeDim === 'month') {
      const monthStr = selectedMonth.slice(5)
      return [
        { date: `${monthStr}-05`, 供冷量GJ: +(220.5 * (0.96 + (seed % 3) * 0.02)).toFixed(1), 耗电量万kWh: +(1.45 * (0.96 + (seed % 3) * 0.02)).toFixed(2), COP: +(4.22 + ((seed * 2) % 6) * 0.02).toFixed(2) },
        { date: `${monthStr}-09`, 供冷量GJ: +(228.0 * (0.98 + (seed % 4) * 0.02)).toFixed(1), 耗电量万kWh: +(1.48 * (0.98 + (seed % 4) * 0.02)).toFixed(2), COP: +(4.28 + ((seed * 3) % 7) * 0.02).toFixed(2) },
        { date: `${monthStr}-14`, 供冷量GJ: +(242.6 * (0.97 + (seed % 5) * 0.02)).toFixed(1), 耗电量万kWh: +(1.55 * (0.97 + (seed % 5) * 0.02)).toFixed(2), COP: +(4.34 + ((seed * 4) % 6) * 0.02).toFixed(2) },
        { date: `${monthStr}-18`, 供冷量GJ: +(238.4 * (0.95 + (seed % 3) * 0.03)).toFixed(1), 耗电量万kWh: +(1.52 * (0.95 + (seed % 3) * 0.03)).toFixed(2), COP: +(4.30 + ((seed * 5) % 7) * 0.02).toFixed(2) },
        { date: `${monthStr}-22`, 供冷量GJ: +(236.5 * (0.97 + (seed % 4) * 0.02)).toFixed(1), 耗电量万kWh: +(1.50 * (0.97 + (seed % 4) * 0.02)).toFixed(2), COP: +(4.29 + ((seed * 6) % 6) * 0.02).toFixed(2) },
        { date: `${monthStr}-26`, 供冷量GJ: +(245.0 * (0.98 + (seed % 3) * 0.02)).toFixed(1), 耗电量万kWh: +(1.54 * (0.98 + (seed % 3) * 0.02)).toFixed(2), COP: +(4.33 + ((seed * 7) % 7) * 0.02).toFixed(2) },
        { date: `${monthStr}-30`, 供冷量GJ: +(245.6 * (0.97 + (seed % 4) * 0.02)).toFixed(1), 耗电量万kWh: +(1.56 * (0.97 + (seed % 4) * 0.02)).toFixed(2), COP: +(4.38 + ((seed * 8) % 6) * 0.02).toFixed(2) },
      ]
    } else if (timeDim === 'quarter') {
      const qNum = parseInt(selectedQuarter.replace(/.*Q/, '') || '3', 10)
      const startM = (qNum - 1) * 3 + 1
      const months = [`${startM < 10 ? '0' + startM : startM}月`, `${startM + 1 < 10 ? '0' + (startM + 1) : startM + 1}月`, `${startM + 2 < 10 ? '0' + (startM + 2) : startM + 2}月`]
      return months.map((mName, idx) => ({
        date: mName,
        供冷量GJ: +(690.0 + idx * 30.5 + seed * 6).toFixed(1),
        耗电量万kWh: +(4.5 + idx * 0.2 + seed * 0.04).toFixed(2),
        COP: +(4.25 + idx * 0.04 + (seed % 3) * 0.02).toFixed(2),
      }))
    } else if (timeDim === 'year') {
      return Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1 < 10 ? '0' + (i + 1) : i + 1}月`,
        供冷量GJ: +(650.0 + Math.sin(i * 0.5) * 110 + seed * 5).toFixed(1),
        耗电量万kWh: +(4.3 + Math.sin(i * 0.5) * 0.7 + seed * 0.03).toFixed(2),
        COP: +(4.20 + Math.cos(i * 0.5) * 0.12 + (seed % 3) * 0.02).toFixed(2),
      }))
    } else {
      const months = resolveCustomMonths(selectedMonthRange.start, selectedMonthRange.end)
      return months.map((mStr, idx) => ({
        date: mStr.slice(5) + '月',
        供冷量GJ: +(670.0 + idx * 18 + seed * 4).toFixed(1),
        耗电量万kWh: +(4.4 + idx * 0.12 + seed * 0.03).toFixed(2),
        COP: +(4.26 + (idx % 3) * 0.03 + (seed % 2) * 0.02).toFixed(2),
      }))
    }
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange, timeFactor])

  const hvacPowerSourceDonut = [
    { name: '清洁绿电直供 (光伏微网)', value: 74.5, color: '#10b981' },
    { name: '市电低谷电网输入', value: 20.8, color: '#0284c7' },
    { name: '市电平段补充', value: 4.7, color: '#f59e0b' },
  ]

  const hvacPeakValleyDonut = [
    { name: '平谷避峰时段供冷', value: 77.2, color: '#06b6d4' },
    { name: '尖峰时段供冷电耗', value: 22.8, color: '#f43f5e' },
  ]

  // 光伏图表数据 (随查询时间联动)
  const pvHourlyTrendData = useMemo(() => {
    const { seed } = timeFactor
    const monthFactor = 0.9 + ((seed * 5) % 25) / 100
    return [
      { time: '06:00', 总发电量: +(0.12 * monthFactor).toFixed(2), 厂区消纳: +(0.12 * monthFactor).toFixed(2), 余电上网: 0.0 },
      { time: '07:00', 总发电量: +(0.45 * monthFactor).toFixed(2), 厂区消纳: +(0.45 * monthFactor).toFixed(2), 余电上网: 0.0 },
      { time: '08:00', 总发电量: +(1.28 * monthFactor).toFixed(2), 厂区消纳: +(1.28 * monthFactor).toFixed(2), 余电上网: 0.0 },
      { time: '09:00', 总发电量: +(2.56 * monthFactor).toFixed(2), 厂区消纳: +(2.42 * monthFactor).toFixed(2), 余电上网: +(0.14 * monthFactor).toFixed(2) },
      { time: '10:00', 总发电量: +(3.82 * monthFactor).toFixed(2), 厂区消纳: +(3.50 * monthFactor).toFixed(2), 余电上网: +(0.32 * monthFactor).toFixed(2) },
      { time: '11:00', 总发电量: +(4.65 * monthFactor).toFixed(2), 厂区消纳: +(4.15 * monthFactor).toFixed(2), 余电上网: +(0.50 * monthFactor).toFixed(2) },
      { time: '12:00', 总发电量: +(4.80 * monthFactor).toFixed(2), 厂区消纳: +(4.20 * monthFactor).toFixed(2), 余电上网: +(0.60 * monthFactor).toFixed(2) },
      { time: '13:00', 总发电量: +(4.52 * monthFactor).toFixed(2), 厂区消纳: +(4.08 * monthFactor).toFixed(2), 余电上网: +(0.44 * monthFactor).toFixed(2) },
      { time: '14:00', 总发电量: +(3.78 * monthFactor).toFixed(2), 厂区消纳: +(3.52 * monthFactor).toFixed(2), 余电上网: +(0.26 * monthFactor).toFixed(2) },
      { time: '15:00', 总发电量: +(2.64 * monthFactor).toFixed(2), 厂区消纳: +(2.55 * monthFactor).toFixed(2), 余电上网: +(0.09 * monthFactor).toFixed(2) },
      { time: '16:00', 总发电量: +(1.45 * monthFactor).toFixed(2), 厂区消纳: +(1.45 * monthFactor).toFixed(2), 余电上网: 0.0 },
      { time: '17:00', 总发电量: +(0.62 * monthFactor).toFixed(2), 厂区消纳: +(0.62 * monthFactor).toFixed(2), 余电上网: 0.0 },
      { time: '18:00', 总发电量: +(0.15 * monthFactor).toFixed(2), 厂区消纳: +(0.15 * monthFactor).toFixed(2), 余电上网: 0.0 },
    ]
  }, [timeFactor])

  const pvFlowDonut = [
    { name: '厂区车间自发自用消纳', value: 91.8, color: '#2C7CFF' },
    { name: '余电反送电网上网', value: 8.2, color: '#52c41a' },
  ]

  const pvRevenueDonut = [
    { name: '自用替代工商业电费节约', value: 95.5, color: '#fa8c16' },
    { name: '余电上网售电收益', value: 4.5, color: '#13c2c2' },
  ]

  const pvBenchmarkData = useMemo(() => {
    return filteredPvData
      .map((item) => {
        let shortName = item.name
        if (item.name.includes('新变超高压')) shortName = '新变超高压'
        else if (item.name.includes('衡变本部')) shortName = '衡变本部'
        else if (item.name.includes('德缆')) shortName = '德缆光伏'
        else if (item.name.includes('西变')) shortName = '西变装备'
        else if (item.name.includes('鲁缆')) shortName = '鲁缆光伏'
        else if (item.name.includes('天变')) shortName = '天变光伏'
        else if (item.name.includes('和新')) shortName = '和新二期'
        else if (item.name.includes('沈变')) shortName = '沈变本部'
        else shortName = item.name.slice(0, 5)

        return {
          name: shortName,
          fullName: item.name,
          有效小时数: item.effectiveHours,
          综合消纳率: item.consumedRatio,
        }
      })
      .sort((a, b) => b.有效小时数 - a.有效小时数)
  }, [filteredPvData])

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
    const totalCapacityNum = filteredPvData.reduce((acc, i) => acc + i.capacityMwp, 0)
    const totalGenNum = filteredPvData.reduce((acc, i) => acc + i.genKwhWan, 0)
    const totalCapacity = totalCapacityNum.toFixed(1)
    const totalGen = totalGenNum.toFixed(1)
    // 园区级别：有效发电小时数 = 实际发电量 (万kWh * 10000) ÷ 额定发电功率 (MWp * 1000) = (万kWh * 10) ÷ MWp
    const avgHours = totalCapacityNum > 0 ? ((totalGenNum * 10) / totalCapacityNum).toFixed(1) : '0.0'
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

  // 空调 KPI
  const hvacKpi = useMemo(() => {
    const avgCop = (
      filteredHvacData.reduce((acc, i) => acc + i.cop, 0) / (filteredHvacData.length || 1)
    ).toFixed(2)
    const totalCoolingGj = filteredHvacData
      .reduce((acc, i) => acc + i.coolingOutputGj, 0)
      .toFixed(1)
    const totalPower = filteredHvacData.reduce((acc, i) => acc + i.powerKwh, 0)
    const totalRunningPower = filteredHvacData
      .reduce((acc, i) => acc + i.powerKw, 0)
      .toLocaleString()
    const totalRawArea = filteredHvacData
      .reduce((acc, i) => acc + i.areaWanM2, 0)
      .toFixed(1)
    const totalConvertedArea = filteredHvacData
      .reduce((acc, i) => acc + i.convertedAreaWanM2, 0)
      .toFixed(1)
    const avgKwhPerM2 = (
      totalPower / (parseFloat(totalConvertedArea) * 10000 || 1)
    ).toFixed(2)
    const avgGreenRatio = (
      filteredHvacData.reduce((acc, i) => acc + i.greenPowerRatio, 0) /
      (filteredHvacData.length || 1)
    ).toFixed(1)
    const avgPeakRatio = (
      filteredHvacData.reduce((acc, i) => acc + i.peakPowerRatio, 0) /
      (filteredHvacData.length || 1)
    ).toFixed(1)

    return {
      cop: avgCop,
      totalCoolingGj,
      totalPower: totalPower.toLocaleString(),
      totalRunningPower,
      rawArea: totalRawArea,
      convertedArea: totalConvertedArea,
      kwhPerM2: avgKwhPerM2,
      greenRatio: avgGreenRatio,
      peakRatio: avgPeakRatio,
    }
  }, [filteredHvacData])

  // 🌟 光伏 8 大标准化 KPI 卡片 (严格对齐单位产品能耗卡片规范)
  const pvKPIs = useMemo(() => [
    {
      id: 'pv-cap',
      name: '光伏装机容量',
      value: pvKpi.totalCapacity,
      unit: 'MWp',
      diffText: '同比 --',
      diffClass: 'text-slate-500',
      icon: SunMedium,
      colorClass: 'text-amber-600',
    },
    {
      id: 'pv-gen',
      name: '周期总发电量',
      value: pvKpi.totalGen,
      unit: '万kWh',
      diffText: '同比 +0.6% ↑',
      diffClass: 'text-emerald-600',
      icon: Zap,
      colorClass: 'text-slate-800',
    },
    {
      id: 'pv-hours',
      name: '有效利用小时数',
      value: pvKpi.avgHours,
      unit: 'h',
      diffText: '同比 +1.2% ↑',
      diffClass: 'text-emerald-600',
      icon: Clock,
      colorClass: 'text-blue-600',
    },
    {
      id: 'pv-ratio',
      name: '综合消纳率',
      value: `${pvKpi.avgConsumedRatio}%`,
      unit: '',
      diffText: '同比 +1.8% ↑',
      diffClass: 'text-emerald-600',
      icon: Activity,
      colorClass: 'text-emerald-600',
    },
    {
      id: 'pv-consumed',
      name: '厂区消纳电量',
      value: pvKpi.totalConsumed,
      unit: '万kWh',
      diffText: '同比 +0.2% ↑',
      diffClass: 'text-blue-700',
      icon: Building2,
      colorClass: 'text-slate-800',
    },
    {
      id: 'pv-income',
      name: '消纳节约收益',
      value: `¥${pvKpi.totalConsumedIncome}`,
      unit: '万',
      diffText: '同比 +0.4% ↑',
      diffClass: 'text-amber-700',
      icon: Coins,
      colorClass: 'text-amber-600',
    },
    {
      id: 'pv-grid',
      name: '余电上网电量',
      value: pvKpi.totalGrid,
      unit: '万kWh',
      diffText: '同比 -4.5% ↓',
      diffClass: 'text-blue-600',
      icon: Share2,
      colorClass: 'text-slate-800',
    },
    {
      id: 'pv-grid-income',
      name: '上网结算收益',
      value: `¥${pvKpi.totalGridIncome}`,
      unit: '万',
      diffText: '同比 +2.8% ↑',
      diffClass: 'text-emerald-700',
      icon: CircleDollarSign,
      colorClass: 'text-emerald-700',
    },
  ], [pvKpi])

  // 🌟 储能 8 大标准化 KPI 卡片
  const storageKPIs = useMemo(() => [
    {
      id: 'st-cap',
      name: '储能装机规模',
      value: storageKpi.totalCapacity,
      unit: '',
      diffText: '同比 --',
      diffClass: 'text-slate-500',
      icon: BatteryCharging,
      colorClass: 'text-blue-700',
    },
    {
      id: 'st-eff',
      name: '综合转换效率',
      value: `${storageKpi.efficiency}%`,
      unit: '',
      diffText: '同比 +1.5% ↑',
      diffClass: 'text-emerald-600',
      icon: Activity,
      colorClass: 'text-emerald-600',
    },
    {
      id: 'st-charge',
      name: '周期总充电量',
      value: storageKpi.totalCharge,
      unit: 'kWh',
      diffText: '同比 +5.2% ↑',
      diffClass: 'text-emerald-600',
      icon: Zap,
      colorClass: 'text-slate-800',
    },
    {
      id: 'st-discharge',
      name: '周期总放电量',
      value: storageKpi.totalDischarge,
      unit: 'kWh',
      diffText: '同比 +6.8% ↑',
      diffClass: 'text-emerald-600',
      icon: Zap,
      colorClass: 'text-slate-800',
    },
    {
      id: 'st-rev',
      name: '净套利收益',
      value: `¥${storageKpi.totalRevenue}`,
      unit: '元',
      diffText: '同比 +8.2% ↑',
      diffClass: 'text-amber-700',
      icon: Coins,
      colorClass: 'text-amber-600',
    },
    {
      id: 'st-green',
      name: '充电量（绿电）占比',
      value: `${storageKpi.greenChargeRatio}%`,
      unit: '',
      diffText: '同比 +3.4% ↑',
      diffClass: 'text-emerald-600',
      icon: Leaf,
      colorClass: 'text-emerald-600',
    },
    {
      id: 'st-valley',
      name: '充电量（市电谷/深谷）占比',
      value: `${storageKpi.valleyChargeRatio}%`,
      unit: '',
      diffText: '同比 -1.8% ↓',
      diffClass: 'text-blue-600',
      icon: ArrowDownCircle,
      colorClass: 'text-blue-600',
    },
    {
      id: 'st-peak',
      name: '放电量（尖/峰）占比',
      value: storageKpi.dischargePeakDesc,
      unit: '',
      diffText: '同比 +4.1% ↑',
      diffClass: 'text-purple-700',
      icon: ArrowUpCircle,
      colorClass: 'text-purple-700',
    },
  ], [storageKpi])

  // 🌟 热泵 8 大标准化 KPI 卡片
  const heatPumpKPIs = useMemo(() => [
    {
      id: 'hp-cop',
      name: '系统综合 COP',
      value: heatPumpKpi.cop,
      unit: '',
      diffText: '同比 +0.8% ↑',
      diffClass: 'text-emerald-600',
      icon: Flame,
      colorClass: 'text-orange-600',
    },
    {
      id: 'hp-heat',
      name: '累计供热量',
      value: heatPumpKpi.totalHeatGj,
      unit: 'GJ',
      diffText: '同比 +3.5% ↑',
      diffClass: 'text-emerald-600',
      icon: Flame,
      colorClass: 'text-slate-800',
    },
    {
      id: 'hp-power',
      name: '制热总耗电量',
      value: heatPumpKpi.totalPower,
      unit: 'kWh',
      diffText: '同比 -1.2% ↓',
      diffClass: 'text-emerald-600',
      icon: Zap,
      colorClass: 'text-slate-800',
    },
    {
      id: 'hp-area',
      name: '供热面积',
      value: heatPumpKpi.rawArea,
      unit: '万㎡',
      diffText: '同比 --',
      diffClass: 'text-slate-500',
      icon: Building2,
      colorClass: 'text-slate-800',
    },
    {
      id: 'hp-kwh-m2',
      name: '单位面积供热耗电量',
      value: heatPumpKpi.kwhPerM2,
      unit: 'kWh/㎡',
      diffText: '同比 -2.4% ↓',
      diffClass: 'text-emerald-600',
      icon: Gauge,
      colorClass: 'text-orange-600',
    },
    {
      id: 'hp-green',
      name: '制热电耗（绿电）占比',
      value: `${heatPumpKpi.greenRatio}%`,
      unit: '',
      diffText: '同比 +4.6% ↑',
      diffClass: 'text-emerald-600',
      icon: Leaf,
      colorClass: 'text-emerald-600',
    },
    {
      id: 'hp-peak',
      name: '制热电耗（市电尖/峰）占比',
      value: `${heatPumpKpi.peakRatio}%`,
      unit: '',
      diffText: '同比 -1.5% ↓',
      diffClass: 'text-purple-700',
      icon: ArrowUpCircle,
      colorClass: 'text-purple-700',
    },
    {
      id: 'hp-conv-area',
      name: '折算供暖面积',
      value: heatPumpKpi.convertedArea,
      unit: '万㎡',
      diffText: '同比 --',
      diffClass: 'text-slate-500',
      icon: Building2,
      colorClass: 'text-slate-800',
    },
  ], [heatPumpKpi])

  // 🌟 空调 8 大标准化 KPI 卡片
  const hvacKPIs = useMemo(() => [
    {
      id: 'hvac-cop',
      name: '系统综合 COP',
      value: hvacKpi.cop,
      unit: '',
      diffText: '同比 +0.5% ↑',
      diffClass: 'text-emerald-600',
      icon: Snowflake,
      colorClass: 'text-cyan-600',
    },
    {
      id: 'hvac-cooling',
      name: '累计供冷量',
      value: hvacKpi.totalCoolingGj,
      unit: 'GJ',
      diffText: '同比 +2.8% ↑',
      diffClass: 'text-emerald-600',
      icon: Snowflake,
      colorClass: 'text-slate-800',
    },
    {
      id: 'hvac-power',
      name: '供冷总耗电量',
      value: hvacKpi.totalPower,
      unit: 'kWh',
      diffText: '同比 -1.6% ↓',
      diffClass: 'text-emerald-600',
      icon: Zap,
      colorClass: 'text-slate-800',
    },
    {
      id: 'hvac-running-power',
      name: '供冷运行功率',
      value: hvacKpi.totalRunningPower,
      unit: 'kW',
      diffText: '同比 --',
      diffClass: 'text-slate-500',
      icon: Gauge,
      colorClass: 'text-purple-600',
    },
    {
      id: 'hvac-kwh-m2',
      name: '单位面积供冷耗电量',
      value: hvacKpi.kwhPerM2,
      unit: 'kWh/㎡',
      diffText: '同比 -2.1% ↓',
      diffClass: 'text-emerald-600',
      icon: Gauge,
      colorClass: 'text-cyan-600',
    },
    {
      id: 'hvac-green',
      name: '供冷电耗（绿电）占比',
      value: `${hvacKpi.greenRatio}%`,
      unit: '',
      diffText: '同比 +5.2% ↑',
      diffClass: 'text-emerald-600',
      icon: Leaf,
      colorClass: 'text-emerald-600',
    },
    {
      id: 'hvac-peak',
      name: '供冷电耗（市电尖/峰）占比',
      value: `${hvacKpi.peakRatio}%`,
      unit: '',
      diffText: '同比 -2.0% ↓',
      diffClass: 'text-rose-600',
      icon: ArrowUpCircle,
      colorClass: 'text-rose-600',
    },
    {
      id: 'hvac-conv-area',
      name: '折算供冷面积',
      value: hvacKpi.convertedArea,
      unit: '万㎡',
      diffText: '同比 --',
      diffClass: 'text-slate-500',
      icon: Building2,
      colorClass: 'text-slate-800',
    },
  ], [hvacKpi])

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
        <div className="bg-white dark:bg-card p-3.5 rounded-xl border border-slate-200 dark:border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-[#2C7CFF] shrink-0">
              <Coins className="size-5" />
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-slate-800 dark:text-white">项目运行评估</h1>
            </div>
          </div>

          {/* 右侧：时间维度与导出 (按照【指标管控】标准规范) */}
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
              <div className="flex items-center gap-2 bg-white dark:bg-card px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 dark:text-slate-200 text-sm focus:outline-none cursor-pointer font-bold"
                  title="选择指定月份"
                />
              </div>
            )}

            {timeDim === 'quarter' && (
              <div className="flex items-center gap-2 bg-white dark:bg-card px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 dark:text-slate-200 text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1 [&>option]:bg-white dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-200"
                >
                  <option value="2026-Q1">2026年 第1季度 (Q1)</option>
                  <option value="2026-Q2">2026年 第2季度 (Q2)</option>
                  <option value="2026-Q3">2026年 第3季度 (Q3)</option>
                  <option value="2026-Q4">2026年 第4季度 (Q4)</option>
                </select>
              </div>
            )}

            {timeDim === 'year' && (
              <div className="flex items-center gap-2 bg-white dark:bg-card px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 dark:text-slate-200 text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1 [&>option]:bg-white dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-200"
                >
                  <option value="2026">2026 年度</option>
                  <option value="2025">2025 年度</option>
                  <option value="2024">2024 年度</option>
                </select>
              </div>
            )}

            {timeDim === 'custom' && (
              <div className="flex items-center gap-2 bg-white dark:bg-card px-3 h-9 rounded-lg border border-[#DBE6EE] dark:border-border text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonthRange.start}
                  onChange={handleCustomStartMonthChange}
                  className="bg-transparent border-0 text-slate-800 dark:text-slate-200 text-sm focus:outline-none cursor-pointer font-bold"
                  title="开始月份 (最多选12个月)"
                />
                <span className="text-slate-400 dark:text-slate-500 font-sans">至</span>
                <input
                  type="month"
                  value={selectedMonthRange.end}
                  onChange={handleCustomEndMonthChange}
                  className="bg-transparent border-0 text-slate-800 dark:text-slate-200 text-sm focus:outline-none cursor-pointer font-bold"
                  title="结束月份 (最多选12个月)"
                />
              </div>
            )}

            <ExportButton
              onClick={() => alert(`已成功导出当前【${activeModule === 'storage' ? '储能' : activeModule === 'pv' ? '光伏' : activeModule === 'heatpump' ? '热泵' : '空调'}运行评估报告】`)}
            />
          </div>
        </div>

        {/* 🌟 2. 核心评估模块分类切换 与 切换项目 Tab 栏 (relative z-10 保证浮于卡片之上，同时不遮挡顶栏 z-40 浮层) */}
        <div className="relative z-10 bg-white dark:bg-card p-3 rounded-xl border border-slate-200 dark:border-border shadow-xs flex flex-wrap items-center justify-between gap-3 font-sans">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">评估模块：</span>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0d1b29] p-0.5 dark:p-[3px] rounded-lg border border-slate-200 dark:border-[#133748] text-xs font-sans">
              {[
                { key: 'pv', label: '光伏', icon: '☀️' },
                { key: 'storage', label: '储能', icon: '🔋' },
                { key: 'heatpump', label: '热泵', icon: '♨️' },
                { key: 'hvac', label: '空调', icon: '❄️' },
              ].map((tab) => {
                const isActive = activeModule === tab.key
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveModule(tab.key as any)}
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

          {/* 右侧：切换项目 Tab 页 与 更多浮层 (100% 同步实时监控页) */}
          <div className="min-w-0 flex-1 flex items-center justify-end">
            {currentProjectList.length > 0 ? (
              <CollapsibleProjectBar
                label="切换项目："
                items={currentProjectList}
                activeItem={selectedProjectName}
                onSelect={(proj) => {
                  setSelectedProjectName(proj.name)
                }}
              />
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0">
                  切换项目：
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">当前组织暂无相关项目</span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 模块 1：储能运行评估 (8大KPI + 充放电时序图 + 来源环形图 + 横向柱状图 + 台账) */}
        {/* ============================================================ */}
        {activeModule === 'storage' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* 8 大核心 KPI 卡片 (4列 × 2行 标准网格排版，严格对齐单位产品能耗卡片规范) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {storageKPIs.map((kpi) => {
                const Icon = kpi.icon
                return (
                  <div
                    key={kpi.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-xs space-y-1.5 select-none relative group"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
                      <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100">
                        <Icon className="size-3.5 text-slate-500 dark:text-slate-400" />
                        {kpi.name}
                      </span>
                    </div>
                    <div className={cn('text-xl font-extrabold font-mono', kpi.colorClass)}>
                      {kpi.value} {kpi.unit && <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">{kpi.unit}</span>}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-border font-sans flex justify-between items-center">
                      <span className={cn('font-bold font-mono', kpi.diffClass || 'text-emerald-600')}>{kpi.diffText}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 🌟 储能可视化图表区 1：左右分栏（时序动态充放平衡图 + 来源/时段结构双环图） */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* 左侧 8列：充放电平衡与分时套利时序图 */}
              <div className="lg:col-span-8 bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">储能充放电分析</h3>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={230}>
                  <ComposedChart data={storageTrendData} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="chargeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2C7CFF" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#2C7CFF" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="dischargeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#52c41a" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#52c41a" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#f1f5f9" className="stroke-slate-100 dark:stroke-slate-800/80" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-600 dark:text-slate-400" axisLine={false} tickLine={false} />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      domain={[0, 4.5]}
                      unit="万"
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      className="text-slate-600 dark:text-slate-400"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 3500]}
                      unit="元"
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      className="text-slate-600 dark:text-slate-400"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ stroke: 'rgba(56, 189, 248, 0.25)' }}
                      contentStyle={{ backgroundColor: 'var(--tooltip-bg, #ffffff)', borderColor: 'var(--tooltip-border, #e2e8f0)', borderRadius: '8px', fontSize: '12px' }}
                      wrapperClassName="dark:[&_.recharts-default-tooltip]:!bg-slate-900/95 dark:[&_.recharts-default-tooltip]:!border-slate-700 dark:[&_.recharts-default-tooltip]:!text-slate-100"
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="充电量"
                      name="日充电量 (万kWh)"
                      stroke="#2C7CFF"
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
              <div className="lg:col-span-4 bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-border pb-2.5">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">充电来源与放电时段结构分析</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-border">
                  <MiniStructureDonut
                    title="充电电量来源"
                    mainPercentage="74.1%"
                    mainLabel="绿电直充"
                    items={[
                      { name: '绿电充入(光伏)', value: 74.1, color: '#52c41a' },
                      { name: '市电深谷充入', value: 18.5, color: '#2C7CFF' },
                      { name: '市电普通谷充', value: 7.4, color: '#13c2c2' },
                    ]}
                  />
                  <div className="border-l border-slate-100 dark:border-border pl-2">
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
            <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">储能效能横向对比</h3>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={storageBenchmarkData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" className="stroke-slate-100 dark:stroke-slate-800/80" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-600 dark:text-slate-400" axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[70, 100]}
                    unit="%"
                    tick={{ fontSize: 10, fill: 'currentColor' }}
                    className="text-slate-600 dark:text-slate-400"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 10000]}
                    unit="元"
                    tick={{ fontSize: 10, fill: 'currentColor' }}
                    className="text-slate-600 dark:text-slate-400"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                    contentStyle={{ backgroundColor: 'var(--tooltip-bg, #ffffff)', borderColor: 'var(--tooltip-border, #e2e8f0)', borderRadius: '8px', fontSize: '12px' }}
                    wrapperClassName="dark:[&_.recharts-default-tooltip]:!bg-slate-900/95 dark:[&_.recharts-default-tooltip]:!border-slate-700 dark:[&_.recharts-default-tooltip]:!text-slate-100"
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
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
            <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between bg-[#fafbfc] dark:bg-panel">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">项目台账</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-panel text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-border h-[44px]">
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {filteredStorageData.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors h-[44px]">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-slate-100">{item.name}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-300">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-blue-700 dark:text-blue-400">{item.capacity}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                          {item.chargeKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                          {item.dischargeKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{item.efficiency}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-600 dark:text-amber-400">
                          ¥{item.revenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">{item.greenChargeRatio}%</td>
                        <td className="py-2.5 px-3 text-center text-blue-600 dark:text-blue-400 font-bold">{item.valleyChargeRatio}%</td>
                        <td className="py-2.5 px-3 text-center text-purple-700 dark:text-purple-400 font-bold">{item.peakCombinedDesc}</td>
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
            {/* 8 大核心 KPI 卡片 (4列 × 2行 标准网格排版，严格对齐单位产品能耗卡片规范) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {heatPumpKPIs.map((kpi) => {
                const Icon = kpi.icon
                return (
                  <div
                    key={kpi.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-xs space-y-1.5 select-none relative group"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
                      <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100">
                        <Icon className="size-3.5 text-slate-500 dark:text-slate-400" />
                        {kpi.name}
                      </span>
                    </div>
                    <div className={cn('text-xl font-extrabold font-mono', kpi.colorClass)}>
                      {kpi.value} {kpi.unit && <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">{kpi.unit}</span>}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-border font-sans flex justify-between items-center">
                      <span className={cn('font-bold font-mono', kpi.diffClass || 'text-emerald-600')}>{kpi.diffText}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 🌟 热泵可视化图表区 1：左右分栏（供热量与电耗平衡趋势图 + 驱动电能来源环形图） */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* 左侧 8列：用双柱状图展示同比的COP (响应用户批注截图 media_1790164850429.png) */}
              <div className="lg:col-span-8 bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">热泵能效同期对比</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">双柱对标 (本期实际 vs 去年同期)</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={heatPumpTrendData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                    <CartesianGrid stroke="#f1f5f9" className="stroke-slate-100 dark:stroke-slate-800/80" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-600 dark:text-slate-400" axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[2.5, 4.5]}
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      className="text-slate-600 dark:text-slate-400"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                      contentStyle={{ backgroundColor: 'var(--tooltip-bg, #ffffff)', borderColor: 'var(--tooltip-border, #e2e8f0)', borderRadius: '8px', fontSize: '12px' }}
                      wrapperClassName="dark:[&_.recharts-default-tooltip]:!bg-slate-900/95 dark:[&_.recharts-default-tooltip]:!border-slate-700 dark:[&_.recharts-default-tooltip]:!text-slate-100"
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                    <Bar
                      dataKey="本期COP"
                      name="本期实际 COP"
                      fill="#FF6536"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={22}
                    />
                    <Bar
                      dataKey="同期COP"
                      name="去年同期 COP (同比)"
                      fill="rgba(255, 101, 54, 0.35)"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={22}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 右侧 4列：驱动电力来源与避峰运行结构 */}
              <div className="lg:col-span-4 bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-border pb-2.5">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">制热电能来源与避峰时段构成</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-border">
                  <MiniStructureDonut
                    title="驱动电能来源"
                    mainPercentage="72.0%"
                    mainLabel="清洁绿电"
                    items={[
                      { name: '清洁绿电直供', value: 72.0, color: '#52c41a' },
                      { name: '市电低谷电网', value: 24.5, color: '#2C7CFF' },
                      { name: '市电平段补充', value: 3.5, color: '#fa8c16' },
                    ]}
                  />
                  <div className="border-l border-slate-100 pl-2">
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

            {/* 热泵效益台账明细表 (含 A*H/3 折算过程与层高明细) */}
            <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between bg-[#fafbfc] dark:bg-panel">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">项目台账</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 h-[44px]">
                      <th className="py-2.5 px-3 whitespace-nowrap">热泵项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">COP</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">供热量 (GJ)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">耗电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">供热面积(万㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">单位面积供热电耗 (kWh/㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">制热电耗(绿电)占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">制热电耗(市电尖/峰)占比</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredHeatPumpData.map((item) => (
                      <tr key={item.id} className="hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-colors h-[44px]">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-slate-400">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-orange-600 dark:text-orange-400">{item.cop}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">{item.heatOutputGj}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                          {item.powerKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                          {item.convertedAreaWanM2}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-orange-600 dark:text-orange-400">
                          {item.kwhPerM2}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">{item.greenPowerRatio}%</td>
                        <td className="py-2.5 px-3 text-center text-purple-700 dark:text-purple-400 font-bold">{item.peakPowerRatio}%</td>
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
            {/* 8 大核心 KPI 卡片 (4列 × 2行 标准网格排版，严格对齐单位产品能耗卡片规范) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pvKPIs.map((kpi) => {
                const Icon = kpi.icon
                return (
                  <div
                    key={kpi.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-xs space-y-1.5 select-none relative group"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
                      <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100">
                        <Icon className="size-3.5 text-slate-500 dark:text-slate-400" />
                        {kpi.name}
                      </span>
                    </div>
                    <div className={cn('text-xl font-extrabold font-mono', kpi.colorClass)}>
                      {kpi.value} {kpi.unit && <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">{kpi.unit}</span>}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-border font-sans flex justify-between items-center">
                      <span className={cn('font-bold font-mono', kpi.diffClass || 'text-emerald-600')}>{kpi.diffText}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 🌟 光伏可视化图表区：电量消纳流向 与 经济收益构成（横着放一行，每图各占 1/2 宽，左右结构：左侧图，右侧数据） */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* 图表 1：光伏电量消纳流向 (左侧图，右侧数据) */}
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">光伏电量消纳流向</h3>
                  </div>
                </div>

                <div className="py-2 px-1">
                  <MiniStructureDonut
                    layout="horizontal"
                    title="发电量流向"
                    mainPercentage={parseFloat(pvKpi.avgConsumedRatio) > 0 ? `${pvKpi.avgConsumedRatio}%` : '91.8%'}
                    mainLabel="自发自用"
                    items={[
                      {
                        name: '厂区就地消纳',
                        value: parseFloat(pvKpi.avgConsumedRatio) > 0 ? parseFloat(pvKpi.avgConsumedRatio) : 91.8,
                        amount: `${pvKpi.totalConsumed} 万kWh`,
                        color: '#2C7CFF',
                      },
                      {
                        name: '余电反送上网',
                        value: parseFloat(pvKpi.avgConsumedRatio) > 0
                          ? parseFloat((100 - parseFloat(pvKpi.avgConsumedRatio)).toFixed(1))
                          : 8.2,
                        amount: `${pvKpi.totalGrid} 万kWh`,
                        color: '#52c41a',
                      },
                    ]}
                  />
                </div>
              </div>

              {/* 图表 2：光伏经济收益构成 (左侧图，右侧数据) */}
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                {(() => {
                  const consumedIncomeNum = parseFloat(pvKpi.totalConsumedIncome) || 0
                  const gridIncomeNum = parseFloat(pvKpi.totalGridIncome) || 0
                  const totalIncomeNum = consumedIncomeNum + gridIncomeNum
                  const consumedRatio = totalIncomeNum > 0 ? parseFloat(((consumedIncomeNum / totalIncomeNum) * 100).toFixed(1)) : 95.5
                  const gridRatio = totalIncomeNum > 0 ? parseFloat((100 - consumedRatio).toFixed(1)) : 4.5

                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                          <h3 className="text-base font-bold text-slate-800 dark:text-white">光伏经济收益构成</h3>
                        </div>
                      </div>

                      <div className="py-2 px-1">
                        <MiniStructureDonut
                          layout="horizontal"
                          title="总效益构成"
                          mainPercentage={`${consumedRatio}%`}
                          mainLabel="替代节费"
                          items={[
                            {
                              name: '工商业节费收益',
                              value: consumedRatio,
                              amount: `¥${pvKpi.totalConsumedIncome} 万`,
                              color: '#fa8c16',
                            },
                            {
                              name: '余电上网售电收益',
                              value: gridRatio,
                              amount: `¥${pvKpi.totalGridIncome} 万`,
                              color: '#13c2c2',
                            },
                          ]}
                        />
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* 🌟 光伏项目横向对比排行榜（有两个及以上项目就对比，没有就不对比；点击电装集团横向对比所有项目） */}
            {pvBenchmarkData.length >= 2 && (
              <div className="bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">光伏效能横向对比</h3>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={pvBenchmarkData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="#f1f5f9" className="stroke-slate-100 dark:stroke-slate-800/80" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      domain={[800, 1100]}
                      unit="h"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[80, 100]}
                      unit="%"
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      className="text-slate-600 dark:text-slate-400"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                      contentStyle={{ backgroundColor: 'var(--tooltip-bg, #ffffff)', borderColor: 'var(--tooltip-border, #e2e8f0)', borderRadius: '8px', fontSize: '12px' }}
                      wrapperClassName="dark:[&_.recharts-default-tooltip]:!bg-slate-900/95 dark:[&_.recharts-default-tooltip]:!border-slate-700 dark:[&_.recharts-default-tooltip]:!text-slate-100"
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                    <Bar
                      yAxisId="left"
                      dataKey="有效小时数"
                      name="有效发电小时数 (h)"
                      fill="#2C7CFF"
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
            )}

            {/* 光伏电站消纳与上网台账明细表 */}
            <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between bg-[#fafbfc] dark:bg-panel">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">项目台账</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 h-[44px]">
                      <th className="py-2.5 px-3 whitespace-nowrap">光伏项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">光伏装机 (MWp)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">发电量 (万kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">有效小时数 (h)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200">消纳电量 (万kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200">消纳收益 (万元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200">消纳均价 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-bold text-emerald-700 dark:text-emerald-400">消纳率 (%)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">上网电量 (万kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">上网收益 (万元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">上网单价 (元)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredPvData.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="py-8 text-center text-slate-400 dark:text-slate-500 font-sans text-xs">
                          当前园区暂无相关光伏项目
                        </td>
                      </tr>
                    ) : (
                      filteredPvData.map((item) => (
                        <tr key={item.id} className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors h-[44px]">
                          <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{item.name}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-600">
                            <div>{item.company}</div>
                            <div className="text-[10px] text-slate-400">{item.park}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-amber-700 dark:text-amber-400">{item.capacityMwp}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">{item.genKwhWan}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-blue-600 dark:text-blue-400">{item.effectiveHours}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-blue-700 dark:text-blue-300 bg-blue-50/20 dark:bg-blue-950/30">{item.consumedKwhWan}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-amber-600 dark:text-amber-400 bg-blue-50/20 dark:bg-blue-950/30">¥{item.consumedIncomeWan}</td>
                          <td className="py-2.5 px-3 text-center bg-blue-50/20 dark:bg-blue-950/30 dark:text-slate-200">{item.consumedAvgPrice}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{item.consumedRatio}%</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-700 dark:text-slate-300 bg-emerald-50/20 dark:bg-emerald-950/30">{item.gridKwhWan}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/20 dark:bg-emerald-950/30">¥{item.gridIncomeWan}</td>
                          <td className="py-2.5 px-3 text-center bg-emerald-50/20 dark:bg-emerald-950/30 dark:text-slate-200">{item.gridPrice}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 模块 4：空调运行评估 (8大KPI + 供冷电耗COP趋势 + 驱动电能双环图 + 44px台账) */}
        {/* ============================================================ */}
        {activeModule === 'hvac' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* 8 大核心 KPI 卡片 (4列 × 2行 标准网格排版，严格对齐单位产品能耗卡片规范) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {hvacKPIs.map((kpi) => {
                const Icon = kpi.icon
                return (
                  <div
                    key={kpi.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-xs space-y-1.5 select-none relative group"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
                      <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100">
                        <Icon className="size-3.5 text-slate-500 dark:text-slate-400" />
                        {kpi.name}
                      </span>
                    </div>
                    <div className={cn('text-xl font-extrabold font-mono', kpi.colorClass)}>
                      {kpi.value} {kpi.unit && <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">{kpi.unit}</span>}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-border font-sans flex justify-between items-center">
                      <span className={cn('font-bold font-mono', kpi.diffClass || 'text-emerald-600')}>{kpi.diffText}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 可视化图表区：左右分栏（供冷量与电耗平衡趋势图 + 驱动电能来源环形图） */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* 左侧 8列：供冷量 vs 耗电量 vs COP 综合趋势图 */}
              <div className="lg:col-span-8 bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">空调能效分析</h3>
                  </div>
                </div>
                <AreaTrend
                  data={hvacTrendData}
                  areas={[
                    { key: '供冷量GJ', name: '供冷量 (GJ)', color: '#06b6d4' },
                    { key: '耗电量万kWh', name: '耗电量 (万kWh)', color: '#2C7CFF' },
                  ]}
                  xKey="date"
                  height={220}
                />
              </div>

              {/* 右侧 4列：驱动电力来源与避峰运行结构 */}
              <div className="lg:col-span-4 bg-white dark:bg-card p-4 rounded-xl border border-slate-200 dark:border-border shadow-xs space-y-2">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-border pb-2.5">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">供冷电能来源与避峰时段构成</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-border">
                  <MiniStructureDonut
                    title="驱动电能来源"
                    mainPercentage="74.5%"
                    mainLabel="清洁绿电"
                    items={[
                      { name: '清洁绿电直供', value: 74.5, color: '#52c41a' },
                      { name: '市电低谷电网', value: 20.8, color: '#2C7CFF' },
                      { name: '市电平段补充', value: 4.7, color: '#fa8c16' },
                    ]}
                  />
                  <div className="border-l border-slate-100 pl-2">
                    <MiniStructureDonut
                      title="峰谷负荷分布"
                      mainPercentage="77.2%"
                      mainLabel="避峰供冷"
                      items={[
                        { name: '平谷避峰供冷', value: 77.2, color: '#13c2c2' },
                        { name: '尖峰时段耗电', value: 22.8, color: '#f5222d' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 空调机组供冷与折算面积耗电量台账明细表 (44px 行高) */}
            <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between bg-slate-50/80 dark:bg-panel">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">项目台账</h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 h-[44px]">
                      <th className="py-2.5 px-3 whitespace-nowrap">空调项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">运行功率 (kW)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center text-cyan-600 font-bold">COP</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">供冷量 (GJ)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">耗电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">原始供冷面积 (万㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right text-amber-700 font-bold">折算供冷面积 (万㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-bold text-cyan-600">单位面积供冷电耗 (kWh/㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-bold text-emerald-600">供冷电耗绿电占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-bold text-rose-600">市电尖/峰占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-bold text-emerald-600">日节费 (元)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredHvacData.map((item) => (
                      <tr key={item.id} className="hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20 transition-colors h-[44px]">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-slate-400">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right text-purple-600 dark:text-purple-400">{item.powerKw.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-cyan-600 dark:text-cyan-400">{item.cop}</td>
                        <td className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200">{item.coolingOutputGj}</td>
                        <td className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200">{item.powerKwh.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">{item.areaWanM2}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-700 dark:text-amber-400">{item.convertedAreaWanM2}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-cyan-600 dark:text-cyan-400">{item.kwhPerM2}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">{item.greenPowerRatio}%</td>
                        <td className="py-2.5 px-3 text-center font-bold text-rose-600 dark:text-rose-400">{item.peakPowerRatio}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">¥{item.dailySavingsYuan.toLocaleString()}</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border border-slate-200 dark:border-border w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-border flex items-center justify-between bg-orange-50/60 dark:bg-panel">
              <div className="flex items-center gap-2">
                <Ruler className="size-5 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  【{selectedHeightDetail.item.name}】供暖面积与层高折算台账
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHeightDetail({ isOpen: false, item: null })}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="rounded-xl border border-orange-200 dark:border-orange-950/60 bg-orange-50/40 dark:bg-orange-950/30 p-3.5 space-y-1.5">
                <span className="font-bold text-orange-900 dark:text-orange-200 block text-xs">标准折算计算公式与原则：</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                  折算供暖面积 = 原始面积 A (万㎡) × 层高 H (m) ÷ 3 (标准参考层高 3m)
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  注：变压器与电缆制造厂房多为 9~18 米高大空间，热对流耗热量显著高于普通建筑，依据工信部工业绿色建筑供暖折算规范统一标准化折算。
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">不同建筑层高明细分解表：</span>
                <table className="w-full text-left border-collapse border border-slate-200 dark:border-border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100/80 dark:bg-panel text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-border h-[44px]">
                      <th className="py-2 px-3">车间/建筑功能单元</th>
                      <th className="py-2 px-3 text-center">原始面积 A (万㎡)</th>
                      <th className="py-2 px-3 text-center">净空层高 H (m)</th>
                      <th className="py-2 px-3 text-center bg-orange-50/60 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200">折算供暖面积 (万㎡)</th>
                      <th className="py-2 px-3 text-right">折算倍率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px]">
                    {selectedHeightDetail.item.heightBreakdown.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 h-[44px]">
                        <td className="py-2 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">{b.buildingName}</td>
                        <td className="py-2 px-3 text-center dark:text-slate-300">{b.areaWanM2}</td>
                        <td className="py-2 px-3 text-center font-bold text-blue-600 dark:text-blue-400">{b.heightM}m</td>
                        <td className="py-2 px-3 text-center font-bold text-orange-600 dark:text-orange-400 bg-orange-50/20 dark:bg-orange-950/30">{b.convertedAreaWanM2}</td>
                        <td className="py-2 px-3 text-right font-sans text-slate-500 dark:text-slate-400">{(b.heightM / 3).toFixed(1)}x</td>
                      </tr>
                    ))}
                    <tr className="bg-orange-50/40 dark:bg-orange-950/30 font-bold text-slate-800 dark:text-slate-100 h-[44px]">
                      <td className="py-2 px-3 font-sans">合计汇总</td>
                      <td className="py-2 px-3 text-center dark:text-slate-300">{selectedHeightDetail.item.areaWanM2} 万㎡</td>
                      <td className="py-2 px-3 text-center font-sans text-slate-500 dark:text-slate-400">-</td>
                      <td className="py-2 px-3 text-center text-orange-700 dark:text-orange-400">{selectedHeightDetail.item.convertedAreaWanM2} 万㎡</td>
                      <td className="py-2 px-3 text-right font-sans text-orange-700 dark:text-orange-400">
                        {(selectedHeightDetail.item.convertedAreaWanM2 / selectedHeightDetail.item.areaWanM2).toFixed(2)}x
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-border bg-slate-50 dark:bg-panel p-3 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">单位面积供热耗电量推导：</span>
                <p className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                  {selectedHeightDetail.item.powerKwh} kWh ÷ ({selectedHeightDetail.item.convertedAreaWanM2} × 10,000 ㎡) = <strong className="text-orange-600 dark:text-orange-400 font-bold text-xs">{selectedHeightDetail.item.kwhPerM2} kWh/㎡</strong>
                </p>
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-border bg-slate-50 dark:bg-panel flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedHeightDetail({ isOpen: false, item: null })}
                className="px-4 py-1.5 rounded-lg bg-[#2C7CFF] text-white font-bold text-xs hover:bg-blue-600 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border border-slate-200 dark:border-border w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-border flex items-center justify-between bg-blue-50/50 dark:bg-panel">
              <div className="flex items-center gap-2">
                <Calculator className="size-5 text-[#2C7CFF]" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  【{selectedCalcDetail.data.name}】数值计算推导演练
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCalcDetail({ isOpen: false, type: 'storage', data: null })}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-3.5 space-y-1">
                <span className="font-bold text-blue-950 dark:text-blue-200 block">核算公式与业务逻辑：</span>
                <p className="font-mono text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
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

            <div className="p-3 border-t border-slate-200 dark:border-border bg-slate-50 dark:bg-panel flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCalcDetail({ isOpen: false, type: 'storage', data: null })}
                className="px-4 py-1.5 rounded-lg bg-[#2C7CFF] text-white font-bold text-xs hover:bg-blue-600 transition-colors"
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

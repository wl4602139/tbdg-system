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
      <span className="text-xs font-bold text-slate-700 block mb-1">{title}</span>

      {/* SVG 环形进度圈与中央关键指标 */}
      <div className="relative size-24 shrink-0 flex items-center justify-center my-1">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#f1f5f9"
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
          <span className="text-base font-bold font-mono text-slate-800 leading-none">
            {mainPercentage}
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            {mainLabel}
          </span>
        </div>
      </div>

      {/* 结构图例清单 */}
      <div className="w-full mt-2 space-y-1.5 pt-2 border-t border-slate-100">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-[11px] leading-tight">
            <span className="flex items-center gap-1.5 text-slate-600 truncate max-w-[110px]" title={item.name}>
              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="font-mono font-bold text-slate-800 shrink-0 ml-1">
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
    { name: '衡变光伏', 有效小时数: 975, 综合消纳率: 92.0 },
    { name: '鲁缆光伏', 有效小时数: 944, 综合消纳率: 90.5 },
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
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Coins className="size-5" />
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-slate-800">项目运行评估</h1>
              {selectedParkNode && !isParkRoot && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  {selectedParkNode.name}
                </span>
              )}
            </div>
          </div>

          {/* 右侧：时间维度与导出 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-sans border border-slate-200">
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
                      ? 'font-bold bg-white text-[#1677ff] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* 时间选择器 */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs font-mono">
              <Calendar className="size-3.5 text-slate-400 shrink-0" />
              <input
                type="month"
                value={selectedMonthRange.end}
                onChange={(e) => setSelectedMonthRange({ ...selectedMonthRange, end: e.target.value })}
                className="font-bold text-slate-700 focus:outline-none cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => alert(`已成功导出当前【${activeModule === 'storage' ? '储能' : activeModule === 'heatpump' ? '热泵' : '光伏'}运行评估报告】`)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="size-3.5 text-slate-500" />
              <span>导出报表</span>
            </button>
          </div>
        </div>

        {/* 🌟 2. 核心模块大 Tab 选项卡 (储能运行评估 | 热泵运行评估 | 光伏运行评估) */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            type="button"
            onClick={() => setActiveModule('storage')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-all cursor-pointer border-b-2',
              activeModule === 'storage'
                ? 'border-[#1677ff] text-[#1677ff] bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50',
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
                ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50',
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
                ? 'border-amber-500 text-amber-600 bg-amber-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50',
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
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">储能装机规模</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">额定容量</span>
                </div>
                <div className="text-lg font-bold text-blue-700 mt-1.5 font-mono truncate">{storageKpi.totalCapacity}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">额定功率 / 储能电量</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">综合转换效率</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">放/充</span>
                </div>
                <div className="text-lg font-bold text-emerald-600 mt-1.5 font-mono">{storageKpi.efficiency}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">放电量 ÷ 充电量</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">周期总充电量</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">充入</span>
                </div>
                <div className="text-lg font-bold text-slate-800 mt-1.5 font-mono">{storageKpi.totalCharge} <span className="text-xs font-normal">kWh</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">尖峰时段前预先充入</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">周期总放电量</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">释放</span>
                </div>
                <div className="text-lg font-bold text-slate-800 mt-1.5 font-mono">{storageKpi.totalDischarge} <span className="text-xs font-normal">kWh</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">高峰/尖峰大负荷释放</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-900 font-medium">净套利收益</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-medium">价差收益</span>
                </div>
                <div className="text-lg font-bold text-amber-600 mt-1.5 font-mono">¥{storageKpi.totalRevenue} <span className="text-xs font-normal">元</span></div>
                <div className="text-[11px] text-amber-700/80 mt-0.5">放电收入扣除充电成本</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">充电量（绿电）占比</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">清洁电</span>
                </div>
                <div className="text-lg font-bold text-emerald-600 mt-1.5 font-mono">{storageKpi.greenChargeRatio}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">光伏低成本绿电直充</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">充电量（市电谷/深谷）占比</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">低谷电</span>
                </div>
                <div className="text-lg font-bold text-blue-600 mt-1.5 font-mono">{storageKpi.valleyChargeRatio}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">夜间深谷/低谷电网充入</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">放电量（尖/峰）占比</span>
                  <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-medium">最高价</span>
                </div>
                <div className="text-base font-bold text-purple-700 mt-1.5 font-mono truncate">{storageKpi.dischargePeakDesc}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">早晚双尖峰最大化释放</div>
              </div>
            </div>

            {/* 🌟 储能可视化图表区 1：左右分栏（时序动态充放平衡图 + 来源/时段结构双环图） */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* 左侧 8列：充放电平衡与分时套利时序图 */}
              <div className="lg:col-span-8 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-[#1677ff]" />
                    <h3 className="text-xs font-bold text-slate-800">储能日度充放电量动态平衡与峰谷套利走势</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">左轴：万kWh / 右轴：元</span>
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
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      domain={[0, 4.5]}
                      unit="万"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 3500]}
                      unit="元"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
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
              <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5">
                  <PieIcon className="size-4 text-purple-600" />
                  <h3 className="text-xs font-bold text-slate-800">充电来源与放电时段结构分析</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
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
                  <div className="border-l border-slate-100 pl-2">
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
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800">各园区储能电站综合转换效率与套利收益对标排行</h3>
                </div>
                <span className="text-[11px] text-slate-400">行业高效基准线：综合效率 ≥ 85%</span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={storageBenchmarkData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[70, 100]}
                    unit="%"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 10000]}
                    unit="元"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
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
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800">储能电站效益评估与充放电台账明细表</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    共 {filteredStorageData.length} 个电站
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  数据更新频率：每日0点自动结算日账单
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
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
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredStorageData.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-slate-400">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-blue-700">{item.capacity}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.chargeKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                          {item.dischargeKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{item.efficiency}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-600">
                          ¥{item.revenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{item.greenChargeRatio}%</td>
                        <td className="py-2.5 px-3 text-center text-blue-600 font-bold">{item.valleyChargeRatio}%</td>
                        <td className="py-2.5 px-3 text-center text-purple-700 font-bold">{item.peakCombinedDesc}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">{item.monthlyRevenueWan}</td>
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
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">系统综合 COP</span>
                  <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-medium">能效比</span>
                </div>
                <div className="text-lg font-bold text-orange-600 mt-1.5 font-mono">{heatPumpKpi.cop}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">供热量 ÷ 制热耗电量</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">累计供热量</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">产热</span>
                </div>
                <div className="text-lg font-bold text-slate-800 mt-1.5 font-mono">{heatPumpKpi.totalHeatGj} <span className="text-xs font-normal">GJ</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">吉焦热量输出</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">制热总耗电量</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">输入</span>
                </div>
                <div className="text-lg font-bold text-slate-800 mt-1.5 font-mono">{heatPumpKpi.totalPower} <span className="text-xs font-normal">kWh</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">压缩机及循环泵总电耗</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">原始供暖面积 A</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">实测占地</span>
                </div>
                <div className="text-lg font-bold text-slate-800 mt-1.5 font-mono">{heatPumpKpi.rawArea} <span className="text-xs font-normal">万㎡</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">厂房地面实测占地面积</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-900 font-bold">折算供暖面积</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">A×H/3</span>
                </div>
                <div className="text-lg font-bold text-amber-700 mt-1.5 font-mono">{heatPumpKpi.convertedArea} <span className="text-xs font-normal">万㎡</span></div>
                <div className="text-[11px] text-amber-800 mt-0.5">按建筑层高 H/3 修正折算</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-orange-200 bg-orange-50/40 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-orange-950 font-bold">单位面积供热耗电量</span>
                  <span className="text-[10px] text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded font-bold">国标指标</span>
                </div>
                <div className="text-lg font-bold text-orange-600 mt-1.5 font-mono">{heatPumpKpi.kwhPerM2} <span className="text-xs font-normal">kWh/㎡</span></div>
                <div className="text-[11px] text-orange-800 mt-0.5">耗电量 ÷ (折算面积×10000)</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">制热电耗（绿电）占比</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">清洁电</span>
                </div>
                <div className="text-lg font-bold text-emerald-600 mt-1.5 font-mono">{heatPumpKpi.greenRatio}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">可再生绿电直供驱动比例</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">制热电耗（市电尖/峰）占比</span>
                  <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-medium">避峰考核</span>
                </div>
                <div className="text-lg font-bold text-purple-700 mt-1.5 font-mono">{heatPumpKpi.peakRatio}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">高峰时段市网输入占比</div>
              </div>
            </div>

            {/* 🌟 热泵可视化图表区 1：左右分栏（供热量与电耗平衡趋势图 + 驱动电能来源环形图） */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* 左侧 8列：供热量 vs 耗电量 vs COP 综合趋势图 */}
              <div className="lg:col-span-8 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-orange-600" />
                    <h3 className="text-xs font-bold text-slate-800">热泵每日供热量 (GJ) 与制热耗电量 (万kWh) 动态平衡走势</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">系统平均 COP：3.85</span>
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
              <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5">
                  <PieIcon className="size-4 text-orange-600" />
                  <h3 className="text-xs font-bold text-slate-800">制热电能来源与避峰时段构成</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
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

            {/* 🌟 热泵可视化图表区 2：不同高大厂房折算面积 (A*H/3) 与单位面积供热电耗对标柱状图 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="size-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-800">典型工业厂房原始占地 vs 折算供暖面积 (A×H/3) 与单位面积耗电量 (kWh/㎡) 对标</h3>
                </div>
                <span className="text-[11px] text-slate-400">工业严寒/寒冷地区特级基准：≤ 2.5 kWh/㎡</span>
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
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-orange-600" />
                  <h3 className="text-xs font-bold text-slate-800">热泵机组供热与折算面积耗电量台账明细表</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    共 {filteredHeatPumpData.length} 个热泵系统
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  数据采集：智能热量表 (GJ) + 智慧电表 + 厂房层高档案
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3 whitespace-nowrap">热泵项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">COP</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">供热量 (GJ)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">耗电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">原始供暖面积(万㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">建筑层高(m)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center bg-amber-50/60 text-amber-900">折算供暖面积(万㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-orange-50/60 text-orange-900">单位面积供热电耗 (kWh/㎡)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">制热电耗(绿电)占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">制热电耗(市电尖/峰)占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">日节费 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">层高折算明细</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredHeatPumpData.map((item) => (
                      <tr key={item.id} className="hover:bg-orange-50/40 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-slate-400">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-orange-600">{item.cop}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">{item.heatOutputGj}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {item.powerKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center">{item.areaWanM2}</td>
                        <td className="py-2.5 px-3 text-center">{item.heightM}m</td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-800 bg-amber-50/30">
                          {item.convertedAreaWanM2}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-orange-700 bg-orange-50/30">
                          {item.kwhPerM2}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{item.greenPowerRatio}%</td>
                        <td className="py-2.5 px-3 text-center text-purple-700 font-bold">{item.peakPowerRatio}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-600">
                          ¥{item.dailySavingsYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <button
                            type="button"
                            onClick={() => setSelectedHeightDetail({ isOpen: true, item })}
                            className="px-2.5 py-1 rounded bg-orange-50 text-orange-700 hover:bg-orange-100 text-[11px] font-bold transition-colors cursor-pointer border border-orange-200"
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
            {/* 8 大核心 KPI 卡片 (4列 × 2行 标准网格排版) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">光伏装机容量</span>
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium">装机</span>
                </div>
                <div className="text-lg font-bold text-amber-600 mt-1.5 font-mono">{pvKpi.totalCapacity} <span className="text-xs font-normal">MWp</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">并网标称装机功率</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">周期总发电量</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">关口发电</span>
                </div>
                <div className="text-lg font-bold text-slate-800 mt-1.5 font-mono">{pvKpi.totalGen} <span className="text-xs font-normal">万kWh</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">电网关口计量总发电</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">有效发电小时数</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">利用小时</span>
                </div>
                <div className="text-lg font-bold text-blue-600 mt-1.5 font-mono">{pvKpi.avgHours} <span className="text-xs font-normal">h</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">总发电量 ÷ 装机容量</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-900 font-bold">综合消纳率</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">消纳/发电</span>
                </div>
                <div className="text-lg font-bold text-emerald-600 mt-1.5 font-mono">{pvKpi.avgConsumedRatio}%</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">厂区消纳电量 ÷ 总发电量</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">厂区消纳电量</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">自发自用</span>
                </div>
                <div className="text-lg font-bold text-slate-800 mt-1.5 font-mono">{pvKpi.totalConsumed} <span className="text-xs font-normal">万kWh</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">车间生产负荷就地消纳</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-900 font-medium">消纳节约收益</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-medium">替代节费</span>
                </div>
                <div className="text-lg font-bold text-amber-600 mt-1.5 font-mono">¥{pvKpi.totalConsumedIncome} <span className="text-xs font-normal">万</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">消纳替代均价 {pvKpi.avgConsumedPrice} 元/kWh</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">余电上网电量</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">反送售电</span>
                </div>
                <div className="text-lg font-bold text-slate-800 mt-1.5 font-mono">{pvKpi.totalGrid} <span className="text-xs font-normal">万kWh</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">反送电网余电上网量</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-900 font-medium">上网结算收益</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-medium">脱硫煤价</span>
                </div>
                <div className="text-lg font-bold text-emerald-700 mt-1.5 font-mono">¥{pvKpi.totalGridIncome} <span className="text-xs font-normal">万</span></div>
                <div className="text-[11px] text-slate-400 mt-0.5">上网结算单价 {pvKpi.gridPrice} 元/kWh</div>
              </div>
            </div>

            {/* 🌟 光伏可视化图表区 1：左右分栏（24小时三轨功率平衡面积图 + 电量流向/收益构成双环图） */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* 左侧 8列：24小时光伏发电出力 vs 厂区就地消纳 vs 余电上网三轨平衡图 */}
              <div className="lg:col-span-8 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="size-4 text-amber-600" />
                    <h3 className="text-xs font-bold text-slate-800">光伏 24小时出力曲线 vs 厂区消纳功率 vs 余电上网动态平衡</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">单位：万kWh / 功率</span>
                </div>
                <AreaTrend
                  data={pvHourlyTrendData}
                  areas={[
                    { key: '总发电量', name: '光伏理论总出力 (万kWh)', color: '#faad14' },
                    { key: '厂区消纳', name: '厂区就地消纳 (万kWh)', color: '#1677ff' },
                    { key: '余电上网', name: '余电反送上网 (万kWh)', color: '#52c41a' },
                  ]}
                  xKey="time"
                  height={220}
                />
              </div>

              {/* 右侧 4列：电量流向与双轨收益双环形图 */}
              <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5">
                  <PieIcon className="size-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-800">光伏电量消纳流向与经济收益构成</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                  <MiniStructureDonut
                    title="发电量流向"
                    mainPercentage="91.8%"
                    mainLabel="自发自用"
                    items={[
                      { name: '厂区就地消纳', value: 91.8, color: '#1677ff' },
                      { name: '余电反送上网', value: 8.2, color: '#52c41a' },
                    ]}
                  />
                  <div className="border-l border-slate-100 pl-2">
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
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800">各分布式光伏电站有效发电小时数 (h) 与综合消纳率 (%) 排行榜</h3>
                </div>
                <span className="text-[11px] text-slate-400">一类资源区基准有效利用小时数：≥ 900 h</span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={pvBenchmarkData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[800, 1200]}
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
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
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
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-500" />
                  <h3 className="text-xs font-bold text-slate-800">分布式光伏电站发电出力与消纳/上网台账明细表</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    共 {filteredPvData.length} 个光伏项目
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  电网双向计量关口表同步结算
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3 whitespace-nowrap">光伏项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/基地</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">光伏装机 (MWp)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">发电量 (万kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">有效小时数 (h)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-blue-50/50 text-blue-900">消纳电量 (万kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-blue-50/50 text-blue-900">消纳收益 (万元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center bg-blue-50/50 text-blue-900">消纳均价 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-bold text-emerald-700">消纳率 (%)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-emerald-50/50 text-emerald-900">上网电量 (万kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right bg-emerald-50/50 text-emerald-900">上网收益 (万元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center bg-emerald-50/50 text-emerald-900">上网单价 (元)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredPvData.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-slate-400">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-700">{item.capacityMwp}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">{item.genKwhWan}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-600">{item.effectiveHours}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/20">{item.consumedKwhWan}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-600 bg-blue-50/20">¥{item.consumedIncomeWan}</td>
                        <td className="py-2.5 px-3 text-center bg-blue-50/20">{item.consumedAvgPrice}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{item.consumedRatio}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-700 bg-emerald-50/20">{item.gridKwhWan}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700 bg-emerald-50/20">¥{item.gridIncomeWan}</td>
                        <td className="py-2.5 px-3 text-center bg-emerald-50/20">{item.gridPrice}</td>
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
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-orange-50/60">
              <div className="flex items-center gap-2">
                <Ruler className="size-5 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  【{selectedHeightDetail.item.name}】供暖面积与层高折算台账
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHeightDetail({ isOpen: false, item: null })}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="rounded-xl border border-orange-200 bg-orange-50/40 p-3.5 space-y-1.5">
                <span className="font-bold text-orange-900 block text-xs">标准折算计算公式与原则：</span>
                <p className="text-slate-600 leading-relaxed font-mono">
                  折算供暖面积 = 原始面积 A (万㎡) × 层高 H (m) ÷ 3 (标准参考层高 3m)
                </p>
                <p className="text-slate-500 text-[11px]">
                  注：变压器与电缆制造厂房多为 9~18 米高大空间，热对流耗热量显著高于普通建筑，依据工信部工业绿色建筑供暖折算规范统一标准化折算。
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-2">不同建筑层高明细分解表：</span>
                <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2 px-3">车间/建筑功能单元</th>
                      <th className="py-2 px-3 text-center">原始面积 A (万㎡)</th>
                      <th className="py-2 px-3 text-center">净空层高 H (m)</th>
                      <th className="py-2 px-3 text-center bg-orange-50/60 text-orange-900">折算供暖面积 (万㎡)</th>
                      <th className="py-2 px-3 text-right">折算倍率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {selectedHeightDetail.item.heightBreakdown.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-sans font-medium text-slate-800">{b.buildingName}</td>
                        <td className="py-2 px-3 text-center">{b.areaWanM2}</td>
                        <td className="py-2 px-3 text-center font-bold text-blue-600">{b.heightM}m</td>
                        <td className="py-2 px-3 text-center font-bold text-orange-600 bg-orange-50/20">{b.convertedAreaWanM2}</td>
                        <td className="py-2 px-3 text-right font-sans text-slate-500">{(b.heightM / 3).toFixed(1)}x</td>
                      </tr>
                    ))}
                    <tr className="bg-orange-50/40 font-bold text-slate-800">
                      <td className="py-2 px-3 font-sans">合计汇总</td>
                      <td className="py-2 px-3 text-center">{selectedHeightDetail.item.areaWanM2} 万㎡</td>
                      <td className="py-2 px-3 text-center font-sans text-slate-500">-</td>
                      <td className="py-2 px-3 text-center text-orange-700">{selectedHeightDetail.item.convertedAreaWanM2} 万㎡</td>
                      <td className="py-2 px-3 text-right font-sans text-orange-700">
                        {(selectedHeightDetail.item.convertedAreaWanM2 / selectedHeightDetail.item.areaWanM2).toFixed(2)}x
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1">
                <span className="font-bold text-slate-700 block">单位面积供热耗电量推导：</span>
                <p className="font-mono text-slate-600 text-[11px]">
                  {selectedHeightDetail.item.powerKwh} kWh ÷ ({selectedHeightDetail.item.convertedAreaWanM2} × 10,000 ㎡) = <strong className="text-orange-600 font-bold text-xs">{selectedHeightDetail.item.kwhPerM2} kWh/㎡</strong>
                </p>
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedHeightDetail({ isOpen: false, item: null })}
                className="px-4 py-1.5 rounded-lg bg-[#1677ff] text-white font-bold text-xs hover:bg-blue-600 transition-colors"
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
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-2">
                <Calculator className="size-5 text-[#1677ff]" />
                <h3 className="text-sm font-bold text-slate-800">
                  【{selectedCalcDetail.data.name}】数值计算推导演练
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCalcDetail({ isOpen: false, type: 'storage', data: null })}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 space-y-1">
                <span className="font-bold text-blue-950 block">核算公式与业务逻辑：</span>
                <p className="font-mono text-slate-700 leading-relaxed text-[11px]">
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

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCalcDetail({ isOpen: false, type: 'storage', data: null })}
                className="px-4 py-1.5 rounded-lg bg-[#1677ff] text-white font-bold text-xs hover:bg-blue-600 transition-colors"
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

'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  PieChart as PieChartIcon,
  Calendar,
  Download,
  Building2,
  Factory,
  Zap,
  Flame,
  Wind,
  Fuel,
  Snowflake,
  Droplets,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Sun,
  Layers,
  BarChart3,
  Percent,
  FileSpreadsheet,
  Info,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { Donut, BarChartGroup } from '@/components/shared/charts'
import { ExportButton } from '@/components/shared/primitives'
import { getPeriodScaleFactor } from '@/components/shared/time-dimension-engine'
import { EnergyCostSection } from '@/components/energy/energy-cost-section'
import { cn } from '@/lib/utils'

// 8 大能源介质定义
export type MetricKey =
  | 'totalTce'
  | 'totalElec'
  | 'gridElec'
  | 'greenElec'
  | 'gas'
  | 'steam'
  | 'oil'
  | 'nitrogen'
  | 'water'

interface MetricMeta {
  key: MetricKey
  name: string
  shortName: string
  unit: string
  tceFactor?: number // 折标煤系数
  color: string
  description: string
}

const METRICS_META: Record<MetricKey, MetricMeta> = {
  totalTce: {
    key: 'totalTce',
    name: '能源消耗总量',
    shortName: '综合能耗',
    unit: 'tce',
    color: '#059669',
    description: '全能源介质统一按国家标准折算标煤总量',
  },
  totalElec: {
    key: 'totalElec',
    name: '总用电量',
    shortName: '总电量',
    unit: '万kWh',
    tceFactor: 0.1229,
    color: '#2C7CFF',
    description: '市网供电与直供绿电总和',
  },
  gridElec: {
    key: 'gridElec',
    name: '市电量',
    shortName: '市电量',
    unit: '万kWh',
    tceFactor: 0.1229,
    color: '#41C0FF',
    description: '从公共电网外购结算电力',
  },
  greenElec: {
    key: 'greenElec',
    name: '直供绿电量',
    shortName: '直供绿电量',
    unit: '万kWh',
    tceFactor: 0.1229,
    color: '#00D492',
    description: '厂区分布式光伏及点对点绿色直供电',
  },
  gas: {
    key: 'gas',
    name: '天然气消耗量',
    shortName: '天然气',
    unit: '万m³',
    tceFactor: 1.2143,
    color: '#FF6536',
    description: '窑炉、烘房及厂区采暖天然气消耗',
  },
  steam: {
    key: 'steam',
    name: '外购蒸汽量',
    shortName: '外购蒸汽',
    unit: 't',
    tceFactor: 0.0943,
    color: '#FFBA00',
    description: '工业园区集中供热与工艺外购蒸汽',
  },
  oil: {
    key: 'oil',
    name: '油消耗量',
    shortName: '用油消耗',
    unit: '万L',
    tceFactor: 1.09,
    color: '#8E73ED',
    description: '厂区物流运输车辆及柴油发电机消耗',
  },
  nitrogen: {
    key: 'nitrogen',
    name: '液氮消耗量',
    shortName: '液氮消耗',
    unit: 't',
    tceFactor: 0.66,
    color: '#4F39F6',
    description: '变压器及特种绝缘干燥惰化工艺介质',
  },
  water: {
    key: 'water',
    name: '工业用水量',
    shortName: '工业用水',
    unit: '万m³',
    color: '#10C4CE',
    description: '生产循环冷却水与生活辅助用水',
  },
}

// 直属经营单位与下属生产单位能耗数据模型
interface CompanyEnergyData {
  id: string
  name: string
  fullName: string
  province: string
  totalTce: number // tce
  totalElec: number // 万kWh
  gridElec: number // 万kWh
  greenElec: number // 万kWh
  gas: number // 万m³
  steam: number // t
  oil: number // 万L
  nitrogen: number // t
  water: number // 万m³
  nonFossilRatio: number // %
  greenElecRatio: number // %
}

// 6 家二级直属经营单位汇总数据 (对应 ENTERPRISE_TREE_DATA 二级节点)
const SIX_COMPANIES_DATA: CompanyEnergyData[] = [
  {
    id: 'comp_sb',
    name: '沈变公司',
    fullName: '特变电工沈阳变压器集团有限公司',
    province: '辽宁省 (沈阳)',
    totalTce: 38200,
    totalElec: 21500,
    gridElec: 13200,
    greenElec: 8300,
    gas: 880,
    steam: 11200,
    oil: 17.5,
    nitrogen: 0,
    water: 58.2,
    nonFossilRatio: 41.5,
    greenElecRatio: 38.6,
  },
  {
    id: 'comp_hb',
    name: '衡变公司',
    fullName: '特变电工衡阳变压器有限公司',
    province: '湖南省 (衡阳)',
    totalTce: 33600,
    totalElec: 18600,
    gridElec: 11500,
    greenElec: 7100,
    gas: 780,
    steam: 9800,
    oil: 15.0,
    nitrogen: 0,
    water: 51.5,
    nonFossilRatio: 40.2,
    greenElecRatio: 38.2,
  },
  {
    id: 'comp_xb',
    name: '新变厂',
    fullName: '特变电工新疆变压器厂',
    province: '新疆 (昌吉)',
    totalTce: 30500,
    totalElec: 17200,
    gridElec: 10200,
    greenElec: 7000,
    gas: 720,
    steam: 8600,
    oil: 14.0,
    nitrogen: 0,
    water: 46.0,
    nonFossilRatio: 43.8,
    greenElecRatio: 40.7,
  },
  {
    id: 'comp_ll',
    name: '鲁缆公司',
    fullName: '特变电工山东鲁能泰山电缆有限公司',
    province: '山东省 (新泰)',
    totalTce: 22800,
    totalElec: 13000,
    gridElec: 8600,
    greenElec: 4400,
    gas: 520,
    steam: 6500,
    oil: 10.5,
    nitrogen: 1380,
    water: 35.8,
    nonFossilRatio: 36.5,
    greenElecRatio: 33.8,
  },
  {
    id: 'comp_dl',
    name: '德缆公司',
    fullName: '特变电工（德阳）电缆股份有限公司',
    province: '四川省 (德阳)',
    totalTce: 14240,
    totalElec: 7800,
    gridElec: 4800,
    greenElec: 3000,
    gas: 330,
    steam: 4100,
    oil: 6.5,
    nitrogen: 1160,
    water: 21.2,
    nonFossilRatio: 44.2,
    greenElecRatio: 38.5,
  },
  {
    id: 'comp_xl',
    name: '新缆厂',
    fullName: '特变电工新疆电缆厂',
    province: '新疆 (乌鲁木齐)',
    totalTce: 12000,
    totalElec: 6100,
    gridElec: 3700,
    greenElec: 2400,
    gas: 220,
    steam: 2600,
    oil: 5.0,
    nitrogen: 500,
    water: 15.6,
    nonFossilRatio: 42.0,
    greenElecRatio: 39.3,
  },
]

// 各二级直属单位下属的三级生产厂/项目公司能耗数据字典 (数据求和严格等于二级单位总值)
const COMPANY_SUBUNITS_DATA: Record<string, CompanyEnergyData[]> = {
  // 1. 沈变公司 ➔ 5 个下属单位
  comp_sb: [
    {
      id: 'ws_sb_main',
      name: '沈变本部',
      fullName: '特变电工沈阳变压器集团本部',
      province: '辽宁省 (沈阳)',
      totalTce: 23680,
      totalElec: 13330,
      gridElec: 8180,
      greenElec: 5150,
      gas: 546,
      steam: 6940,
      oil: 10.8,
      nitrogen: 0,
      water: 36.1,
      nonFossilRatio: 41.6,
      greenElecRatio: 38.6,
    },
    {
      id: 'ws_sb_hx',
      name: '和新套管',
      fullName: '特变电工沈变和新高压套管',
      province: '辽宁省 (沈阳)',
      totalTce: 6110,
      totalElec: 3440,
      gridElec: 2110,
      greenElec: 1330,
      gas: 141,
      steam: 1790,
      oil: 2.8,
      nitrogen: 0,
      water: 9.3,
      nonFossilRatio: 41.5,
      greenElecRatio: 38.7,
    },
    {
      id: 'ws_sb_kj',
      name: '康嘉互感器',
      fullName: '沈变康嘉互感器制造部',
      province: '辽宁省 (沈阳)',
      totalTce: 4580,
      totalElec: 2580,
      gridElec: 1580,
      greenElec: 1000,
      gas: 106,
      steam: 1350,
      oil: 2.1,
      nitrogen: 0,
      water: 7.0,
      nonFossilRatio: 41.4,
      greenElecRatio: 38.8,
    },

    {
      id: 'ws_sb_yn',
      name: '印能公司',
      fullName: '沈变印能电气制造分厂',
      province: '辽宁省 (沈阳)',
      totalTce: 1530,
      totalElec: 860,
      gridElec: 530,
      greenElec: 330,
      gas: 34,
      steam: 450,
      oil: 0.7,
      nitrogen: 0,
      water: 2.3,
      nonFossilRatio: 41.0,
      greenElecRatio: 38.4,
    },
  ],
  // 2. 衡变公司 ➔ 9 个下属单位
  comp_hb: [
    {
      id: 'ws_hb_main',
      name: '衡变本部',
      fullName: '特变电工衡阳变压器本部',
      province: '湖南省 (衡阳)',
      totalTce: 15120,
      totalElec: 8370,
      gridElec: 5180,
      greenElec: 3190,
      gas: 351,
      steam: 4410,
      oil: 6.8,
      nitrogen: 0,
      water: 23.2,
      nonFossilRatio: 40.3,
      greenElecRatio: 38.1,
    },
    {
      id: 'ws_hb_nj',
      name: '南京公司',
      fullName: '特变电工南京智能电气有限公司',
      province: '江苏省 (南京)',
      totalTce: 4370,
      totalElec: 2420,
      gridElec: 1500,
      greenElec: 920,
      gas: 101,
      steam: 1270,
      oil: 2.0,
      nitrogen: 0,
      water: 6.7,
      nonFossilRatio: 40.1,
      greenElecRatio: 38.0,
    },
    {
      id: 'ws_hb_kg',
      name: '云集高压开关',
      fullName: '特变电工云集高压开关有限公司',
      province: '湖南省 (衡阳)',
      totalTce: 3700,
      totalElec: 2050,
      gridElec: 1270,
      greenElec: 780,
      gas: 86,
      steam: 1080,
      oil: 1.6,
      nitrogen: 0,
      water: 5.7,
      nonFossilRatio: 40.2,
      greenElecRatio: 38.0,
    },
    {
      id: 'ws_hb_hr',
      name: '合容电气',
      fullName: '特变电工合容电气有限公司',
      province: '陕西省 (西安)',
      totalTce: 3020,
      totalElec: 1670,
      gridElec: 1030,
      greenElec: 640,
      gas: 70,
      steam: 880,
      oil: 1.3,
      nitrogen: 0,
      water: 4.6,
      nonFossilRatio: 40.4,
      greenElecRatio: 38.3,
    },
    {
      id: 'ws_hb_yj',
      name: '云集电气',
      fullName: '特变电工云集5G智能成套设备',
      province: '湖南省 (衡阳)',
      totalTce: 2350,
      totalElec: 1300,
      gridElec: 800,
      greenElec: 500,
      gas: 55,
      steam: 690,
      oil: 1.1,
      nitrogen: 0,
      water: 3.6,
      nonFossilRatio: 40.5,
      greenElecRatio: 38.5,
    },
    {
      id: 'ws_hb_hn',
      name: '湖南电气',
      fullName: '特变电工湖南电气装备制造部',
      province: '湖南省 (衡阳)',
      totalTce: 1680,
      totalElec: 930,
      gridElec: 570,
      greenElec: 360,
      gas: 39,
      steam: 490,
      oil: 0.8,
      nitrogen: 0,
      water: 2.6,
      nonFossilRatio: 40.0,
      greenElecRatio: 38.7,
    },
    {
      id: 'ws_hb_xj',
      name: '新疆自控',
      fullName: '特变电工新疆自控成套车间',
      province: '新疆 (昌吉)',
      totalTce: 1340,
      totalElec: 740,
      gridElec: 460,
      greenElec: 280,
      gas: 31,
      steam: 390,
      oil: 0.6,
      nitrogen: 0,
      water: 2.1,
      nonFossilRatio: 39.8,
      greenElecRatio: 37.8,
    },
    {
      id: 'ws_hb_tnj',
      name: '特缆建',
      fullName: '特变电工湖南能电建设园区',
      province: '湖南省 (衡阳)',
      totalTce: 1180,
      totalElec: 660,
      gridElec: 410,
      greenElec: 250,
      gas: 28,
      steam: 350,
      oil: 0.5,
      nitrogen: 0,
      water: 1.8,
      nonFossilRatio: 40.0,
      greenElecRatio: 37.9,
    },
    {
      id: 'ws_hb_gil',
      name: '事杰爱迪',
      fullName: '特变电工事杰爱迪GIL公司',
      province: '湖南省 (衡阳)',
      totalTce: 840,
      totalElec: 460,
      gridElec: 280,
      greenElec: 180,
      gas: 19,
      steam: 240,
      oil: 0.3,
      nitrogen: 0,
      water: 1.2,
      nonFossilRatio: 40.0,
      greenElecRatio: 39.1,
    },
  ],
  // 3. 新变厂 ➔ 7 个下属单位
  comp_xb: [
    {
      id: 'ws_xb_uhv',
      name: '超高压公司',
      fullName: '特变电工新疆超高压制造中心',
      province: '新疆 (昌吉)',
      totalTce: 11590,
      totalElec: 6540,
      gridElec: 3880,
      greenElec: 2660,
      gas: 274,
      steam: 3270,
      oil: 5.3,
      nitrogen: 0,
      water: 17.5,
      nonFossilRatio: 43.9,
      greenElecRatio: 40.7,
    },
    {
      id: 'ws_xb_tb',
      name: '天变公司',
      fullName: '特变电工天津变压器有限公司',
      province: '天津市',
      totalTce: 7930,
      totalElec: 4470,
      gridElec: 2650,
      greenElec: 1820,
      gas: 187,
      steam: 2240,
      oil: 3.6,
      nitrogen: 0,
      water: 12.0,
      nonFossilRatio: 43.7,
      greenElecRatio: 40.7,
    },
    {
      id: 'ws_xb_zndq',
      name: '智能电气',
      fullName: '特变电工智能电气配变车间',
      province: '新疆 (昌吉)',
      totalTce: 4270,
      totalElec: 2410,
      gridElec: 1430,
      greenElec: 980,
      gas: 101,
      steam: 1200,
      oil: 2.0,
      nitrogen: 0,
      water: 6.4,
      nonFossilRatio: 43.8,
      greenElecRatio: 40.7,
    },
    {
      id: 'ws_xb_jjj',
      name: '京津冀科技',
      fullName: '特变电工京津冀智能科技产业基地',
      province: '河北省 (固安)',
      totalTce: 2750,
      totalElec: 1550,
      gridElec: 920,
      greenElec: 630,
      gas: 65,
      steam: 770,
      oil: 1.3,
      nitrogen: 0,
      water: 4.1,
      nonFossilRatio: 43.8,
      greenElecRatio: 40.6,
    },
    {
      id: 'ws_xb_zf',
      name: '珠峰硅钢',
      fullName: '珠峰硅钢精密冲剪退火制造部',
      province: '新疆 (昌吉)',
      totalTce: 1980,
      totalElec: 1120,
      gridElec: 660,
      greenElec: 460,
      gas: 47,
      steam: 560,
      oil: 0.9,
      nitrogen: 0,
      water: 3.0,
      nonFossilRatio: 44.0,
      greenElecRatio: 41.1,
    },

    {
      id: 'ws_xb_yl',
      name: '银利电气',
      fullName: '特变电工银利智能电气制造厂',
      province: '新疆 (昌吉)',
      totalTce: 760,
      totalElec: 420,
      gridElec: 250,
      greenElec: 170,
      gas: 17,
      steam: 220,
      oil: 0.3,
      nitrogen: 0,
      water: 1.2,
      nonFossilRatio: 43.5,
      greenElecRatio: 40.5,
    },
  ],
  // 4. 鲁缆公司 ➔ 3 个下属单位
  comp_ll: [
    {
      id: 'ws_ll_main',
      name: '鲁缆本部',
      fullName: '鲁缆本部高压交联立塔制造部',
      province: '山东省 (新泰)',
      totalTce: 16420,
      totalElec: 9360,
      gridElec: 6190,
      greenElec: 3170,
      gas: 374,
      steam: 4680,
      oil: 7.6,
      nitrogen: 1020,
      water: 25.8,
      nonFossilRatio: 36.6,
      greenElecRatio: 33.9,
    },
    {
      id: 'ws_ll_sw',
      name: '昭和',
      fullName: '特变电工昭和高压电缆附件制造厂',
      province: '山东省 (新泰)',
      totalTce: 4100,
      totalElec: 2340,
      gridElec: 1550,
      greenElec: 790,
      gas: 94,
      steam: 1170,
      oil: 1.9,
      nitrogen: 120,
      water: 6.4,
      nonFossilRatio: 36.4,
      greenElecRatio: 33.8,
    },
    {
      id: 'ws_ll_sg',
      name: '曙光',
      fullName: '特变电工曙光特种电缆分厂',
      province: '山东省 (新泰)',
      totalTce: 2280,
      totalElec: 1300,
      gridElec: 860,
      greenElec: 440,
      gas: 52,
      steam: 650,
      oil: 1.0,
      nitrogen: 240,
      water: 3.6,
      nonFossilRatio: 36.2,
      greenElecRatio: 33.8,
    },
  ],
  // 5. 德缆公司 ➔ 1 个主体单位
  comp_dl: [
    {
      id: 'ws_dl_main',
      name: '德缆公司',
      fullName: '特变电工（德阳）电缆股份有限公司',
      province: '四川省 (德阳)',
      totalTce: 14240,
      totalElec: 7800,
      gridElec: 4800,
      greenElec: 3000,
      gas: 330,
      steam: 4100,
      oil: 6.5,
      nitrogen: 1160,
      water: 21.2,
      nonFossilRatio: 44.2,
      greenElecRatio: 38.5,
    },
  ],
  // 6. 新缆厂 ➔ 2 个下属单位
  comp_xl: [
    {
      id: 'ws_xl_sub',
      name: '新疆线缆厂',
      fullName: '特变电工新疆特种线缆制造厂',
      province: '新疆 (乌鲁木齐)',
      totalTce: 7800,
      totalElec: 3965,
      gridElec: 2405,
      greenElec: 1560,
      gas: 143,
      steam: 1690,
      oil: 3.25,
      nitrogen: 320,
      water: 10.14,
      nonFossilRatio: 42.0,
      greenElecRatio: 39.3,
    },
    {
      id: 'ws_xl_main',
      name: '新疆电缆',
      fullName: '特变电工新疆电缆实业公司',
      province: '新疆 (乌鲁木齐)',
      totalTce: 4200,
      totalElec: 2135,
      gridElec: 1295,
      greenElec: 840,
      gas: 77,
      steam: 910,
      oil: 1.75,
      nitrogen: 180,
      water: 5.46,
      nonFossilRatio: 42.0,
      greenElecRatio: 39.3,
    },
  ],
}

// 全集团汇总数据
const GROUP_SUMMARY_DATA: CompanyEnergyData = {
  id: 'ent_root',
  name: '电装集团',
  fullName: '特变电工集团（全集团 6 大直属经营单位汇总）',
  province: '全国多基地汇总',
  totalTce: 151340,
  totalElec: 84200,
  gridElec: 52000,
  greenElec: 32200,
  gas: 3450,
  steam: 42800,
  oil: 68.5,
  nitrogen: 3040,
  water: 228.3,
  nonFossilRatio: 41.2,
  greenElecRatio: 38.2,
}

export default function EnergyStructureAnalysisPage() {
  // 左侧组织拓扑树节点状态
  const [selectedOrgNode, setSelectedOrgNode] = useState<StandardOrgNode>({
    id: 'ent_root',
    name: '电装集团',
    fullName: '电装集团',
    level: 'group',
    badge: '全集团汇总',
  })

  // 选项卡：用能结构 vs 成本结构
  const [analysisTab, setAnalysisTab] = useState<'physical' | 'cost'>('physical')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('tab') === 'cost') {
        setAnalysisTab('cost')
      }
    }
  }, [])

  // 时间维度统一 (月度 / 季度 / 年度 / 自定义)
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

  // 🌟 集团页当前选中的数据项 (用于驱动 6 家单位占电装总量的比重：饼图 + 柱状图)
  const [selectedMetricKey, setSelectedMetricKey] = useState<MetricKey>('totalTce')

  // 判断是否处于集团层级
  const isGroupLevel = useMemo(() => {
    return (
      selectedOrgNode.id === 'ent_root' ||
      selectedOrgNode.id === 'group_root' ||
      selectedOrgNode.level === 'group' ||
      selectedOrgNode.name.includes('电装集团')
    )
  }, [selectedOrgNode])

  // 判断是否处于 3 级单体单位 (工厂/车间层级，无下属单位)
  const isWorkshopLevel = useMemo(() => {
    if (isGroupLevel) return false
    // 1. 若明确标记为 workshop 层级
    if (selectedOrgNode.level === 'workshop') return true
    // 2. 若在 3 级子单位数据字典中匹配到 (根据 id 或精确名称)
    for (const list of Object.values(COMPANY_SUBUNITS_DATA)) {
      if (list.some((s) => s.id === selectedOrgNode.id || s.name === selectedOrgNode.name)) {
        return true
      }
    }
    return false
  }, [isGroupLevel, selectedOrgNode])

  // 当前选中层级对应的下属子单位列表 (若为集团层级，则下属为 6 大经营单位；若为 2 级经营单位，则下属为各 3 级生产厂/车间；若为 3 级单体，则无下属单位)
  const currentSubUnits = useMemo(() => {
    // 1. 集团层级：下属 6 大直属经营单位
    if (isGroupLevel) {
      return SIX_COMPANIES_DATA
    }
    // 2. 3 级单体工厂/车间层级：无下属生产单位，展示单体用能结构
    if (isWorkshopLevel) {
      return null
    }
    // 3. 2 级经营单位层级：匹配该经营单位下属的 3 级生产厂
    if (COMPANY_SUBUNITS_DATA[selectedOrgNode.id]) {
      return COMPANY_SUBUNITS_DATA[selectedOrgNode.id]
    }
    const foundCompany = SIX_COMPANIES_DATA.find(
      (c) => c.name === selectedOrgNode.name || c.id === selectedOrgNode.id
    )
    if (foundCompany && COMPANY_SUBUNITS_DATA[foundCompany.id]) {
      return COMPANY_SUBUNITS_DATA[foundCompany.id]
    }
    return null
  }, [isGroupLevel, isWorkshopLevel, selectedOrgNode])

  // 是否具有下属单位 (用于决定展示 结构对比模块 还是 单体折标明细模块)
  const hasSubUnits = Boolean(currentSubUnits && currentSubUnits.length > 0)

  // 当前选中的公司或车间自身数据
  const currentCompanyData = useMemo(() => {
    if (isGroupLevel) return GROUP_SUMMARY_DATA
    // 1. 若为 3 级单体单位，优先在 3 级子单位字典中精确匹配
    if (isWorkshopLevel) {
      for (const list of Object.values(COMPANY_SUBUNITS_DATA)) {
        const foundSub = list.find((s) => s.id === selectedOrgNode.id || s.name === selectedOrgNode.name)
        if (foundSub) return foundSub
      }
    }
    // 2. 在 6 大经营单位中匹配
    const foundCompany = SIX_COMPANIES_DATA.find(
      (c) =>
        c.id === selectedOrgNode.id ||
        c.name === selectedOrgNode.name ||
        (selectedOrgNode.level === 'company' && selectedOrgNode.name.includes(c.name.slice(0, 2)))
    )
    if (foundCompany && !isWorkshopLevel) {
      return foundCompany
    }
    // 3. 兜底在 3 级子单位中匹配
    for (const list of Object.values(COMPANY_SUBUNITS_DATA)) {
      const foundSub = list.find((s) => s.id === selectedOrgNode.id || s.name === selectedOrgNode.name)
      if (foundSub) return foundSub
    }
    if (foundCompany) return foundCompany
    return SIX_COMPANIES_DATA[0]
  }, [isGroupLevel, isWorkshopLevel, selectedOrgNode])

  // 用能结构周期缩放因子 (依据单月份、季度、年度或自定义区间自动计算累计倍率)
  const structureScaleFactor = useMemo(() => {
    return getPeriodScaleFactor('sum', timeDim, {
      selectedMonth,
      selectedQuarter,
      selectedYear,
      selectedMonthRange,
    }, { basePeriod: 'monthRange8' })
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

  // 1. 结构分析模块：计算下属各单位在当前选中指标下的数值与占比 (用于饼图与柱状图)
  const metricCompanyBreakdown = useMemo(() => {
    const units = currentSubUnits || SIX_COMPANIES_DATA
    const totalVal = Number((units.reduce((sum, c) => sum + (c[selectedMetricKey] as number), 0) * structureScaleFactor).toFixed(1))
    const unit = METRICS_META[selectedMetricKey].unit

    const donutData = units.map((c, i) => {
      const val = Number(((c[selectedMetricKey] as number) * structureScaleFactor).toFixed(1))
      const ratio = totalVal > 0 ? Number(((val / totalVal) * 100).toFixed(1)) : 0
      const colors = ['#2C7CFF', '#00D492', '#FF6536', '#8E73ED', '#41C0FF', '#FFBA00', '#4F39F6', '#10C4CE', '#059669']
      return {
        name: c.name,
        value: val,
        ratio,
        color: colors[i % colors.length],
        unit,
      }
    })

    const barData = units.map((c) => {
      const val = Number(((c[selectedMetricKey] as number) * structureScaleFactor).toFixed(1))
      const ratio = totalVal > 0 ? Number(((val / totalVal) * 100).toFixed(1)) : 0
      return {
        name: c.name,
        消耗量: val,
        占比: ratio,
      }
    })

    return { totalVal, donutData, barData, unit }
  }, [currentSubUnits, selectedMetricKey, structureScaleFactor])

  const activeData = isGroupLevel ? GROUP_SUMMARY_DATA : currentCompanyData

  // 🌟 只有使用液氮的工厂才会显示液氮卡片；当切换到无液氮单位时若当前选中了液氮指标，自动安全回退至综合能耗
  useEffect(() => {
    if (selectedMetricKey === 'nitrogen' && (!activeData.nitrogen || activeData.nitrogen <= 0)) {
      setSelectedMetricKey('totalTce')
    }
  }, [selectedMetricKey, activeData])

  // 2. 三级单体单位：计算该单体单位自身用能结构占比 (各能源介质折标煤与占比)
  const companyStructureDonutData = useMemo(() => {
    const data = activeData
    const gridElecTce = (data.gridElec * structureScaleFactor * 10000 * 0.1229) / 1000
    const greenElecTce = (data.greenElec * structureScaleFactor * 10000 * 0.1229) / 1000
    const gasTce = (data.gas * structureScaleFactor * 10000 * 1.2143) / 1000
    const steamTce = data.steam * structureScaleFactor * 0.0943
    const oilTce = (data.oil * structureScaleFactor * 10000 * 1.09) / 1000
    const nitrogenTce = (data.nitrogen * structureScaleFactor * 1000 * 0.66) / 1000

    const total = gridElecTce + greenElecTce + gasTce + steamTce + oilTce + nitrogenTce

    const items = [
      { name: '市网供电', value: Number(gridElecTce.toFixed(1)), color: '#41C0FF', ratio: total > 0 ? Number(((gridElecTce / total) * 100).toFixed(1)) : 0 },
      { name: '直供绿电（绿证+绿电）', value: Number(greenElecTce.toFixed(1)), color: '#00D492', ratio: total > 0 ? Number(((greenElecTce / total) * 100).toFixed(1)) : 0 },
      { name: '天然气', value: Number(gasTce.toFixed(1)), color: '#FF6536', ratio: total > 0 ? Number(((gasTce / total) * 100).toFixed(1)) : 0 },
      { name: '外购蒸汽', value: Number(steamTce.toFixed(1)), color: '#FFBA00', ratio: total > 0 ? Number(((steamTce / total) * 100).toFixed(1)) : 0 },
      { name: '用油消耗', value: Number(oilTce.toFixed(1)), color: '#8E73ED', ratio: total > 0 ? Number(((oilTce / total) * 100).toFixed(1)) : 0 },
    ]

    if (nitrogenTce > 0) {
      items.push({ name: '液氮消耗', value: Number(nitrogenTce.toFixed(1)), color: '#4F39F6', ratio: total > 0 ? Number(((nitrogenTce / total) * 100).toFixed(1)) : 0 })
    }

    return items
  }, [activeData, structureScaleFactor])

  // 🌟 4. 用能结构明细台账数据模型 (对应上方 7/8 个指标，随时间维度动态切片计算，求和严格等于上方卡片数据)
  const structureLedgerData = useMemo(() => {
    // 目标总值（与上方指标卡片及中间明细数据 100% 保持一致）
    const targetTotalTce = activeData.totalTce
    const targetTotalElec = activeData.totalElec
    const targetGridElec = activeData.gridElec
    const targetGreenElec = activeData.greenElec
    const targetGas = activeData.gas
    const targetSteam = activeData.steam
    const targetOil = activeData.oil
    const targetNitrogen = activeData.nitrogen

    const records: Array<{
      date: string
      totalTce: number
      totalElec: number
      gridElec: number
      greenElec: number
      gas: number
      steam: number
      oil: number
      nitrogen: number
    }> = []

    if (timeDim === 'month') {
      // 月度维度：展现该月每日明细 (01日 ~ 28/30/31日)，每日有合理工业负荷波动，全月求和精准等于 activeData
      const [yearStr, monthStr] = (selectedMonth || '2026-08').split('-')
      const year = Number(yearStr) || 2026
      const month = Number(monthStr) || 8
      const daysInMonth = new Date(year, month, 0).getDate()

      const weights: number[] = []
      const solarWeights: number[] = []
      for (let d = 1; d <= daysInMonth; d++) {
        const dayOfWeek = new Date(year, month - 1, d).getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const w = isWeekend ? 0.82 : 1.04 + ((d * 3 + month * 5) % 9) * 0.012
        const sw = isWeekend ? 0.96 : 0.90 + ((d * 7 + month * 2) % 11) * 0.018
        weights.push(w)
        solarWeights.push(sw)
      }
      const totalWeight = weights.reduce((a, b) => a + b, 0)
      const totalSolarWeight = solarWeights.reduce((a, b) => a + b, 0)

      let sumTce = 0
      let sumElec = 0
      let sumGrid = 0
      let sumGreen = 0
      let sumGas = 0
      let sumSteam = 0
      let sumOil = 0
      let sumNitrogen = 0

      const dayList: Array<{
        date: string
        totalTce: number
        totalElec: number
        gridElec: number
        greenElec: number
        gas: number
        steam: number
        oil: number
        nitrogen: number
      }> = []

      for (let d = 1; d <= daysInMonth; d++) {
        const dStr = String(d).padStart(2, '0')
        const idx = d - 1
        const isLast = d === daysInMonth

        const w = weights[idx] / totalWeight
        const sw = solarWeights[idx] / totalSolarWeight

        const tce = isLast ? Number((targetTotalTce - sumTce).toFixed(1)) : Number((targetTotalTce * w).toFixed(1))
        const totElec = isLast ? Number((targetTotalElec - sumElec).toFixed(2)) : Number((targetTotalElec * w).toFixed(2))
        const solElec = isLast ? Number((targetGreenElec - sumGreen).toFixed(2)) : Number((targetGreenElec * sw).toFixed(2))
        const grdElec = isLast ? Number((targetGridElec - sumGrid).toFixed(2)) : Number((targetGridElec * w).toFixed(2))
        const gs = isLast ? Number((targetGas - sumGas).toFixed(2)) : Number((targetGas * w).toFixed(2))
        const stm = isLast ? Number((targetSteam - sumSteam).toFixed(1)) : Number((targetSteam * w).toFixed(1))
        const ol = isLast ? Number((targetOil - sumOil).toFixed(2)) : Number((targetOil * w).toFixed(2))
        const nit = isLast ? Number((targetNitrogen - sumNitrogen).toFixed(2)) : Number((targetNitrogen * w).toFixed(2))

        sumTce += tce
        sumElec += totElec
        sumGrid += grdElec
        sumGreen += solElec
        sumGas += gs
        sumSteam += stm
        sumOil += ol
        sumNitrogen += nit

        dayList.push({
          date: `${year}-${String(month).padStart(2, '0')}-${dStr}`,
          totalTce: tce,
          totalElec: totElec,
          gridElec: grdElec,
          greenElec: solElec,
          gas: gs,
          steam: stm,
          oil: ol,
          nitrogen: nit,
        })
      }

      return dayList.reverse()
    } else if (timeDim === 'quarter') {
      // 季度维度：展现该季度 3 个月度，求和精准等于 activeData
      const quarterMap: Record<string, string[]> = {
        '2026-Q1': ['2026-01', '2026-02', '2026-03'],
        '2026-Q2': ['2026-04', '2026-05', '2026-06'],
        '2026-Q3': ['2026-07', '2026-08', '2026-09'],
        '2026-Q4': ['2026-10', '2026-11', '2026-12'],
        '2025-Q4': ['2025-10', '2025-11', '2025-12'],
      }
      const months = quarterMap[selectedQuarter] || ['2026-07', '2026-08', '2026-09']
      const qWeights = [0.33, 0.35, 0.32]

      let sumTce = 0
      let sumElec = 0
      let sumGrid = 0
      let sumGreen = 0
      let sumGas = 0
      let sumSteam = 0
      let sumOil = 0
      let sumNitrogen = 0

      const monthList = months.map((ym, idx) => {
        const isLast = idx === months.length - 1
        const w = qWeights[idx] || 1 / months.length

        const tce = isLast ? Number((targetTotalTce - sumTce).toFixed(1)) : Number((targetTotalTce * w).toFixed(1))
        const totElec = isLast ? Number((targetTotalElec - sumElec).toFixed(2)) : Number((targetTotalElec * w).toFixed(2))
        const grdElec = isLast ? Number((targetGridElec - sumGrid).toFixed(2)) : Number((targetGridElec * w).toFixed(2))
        const solElec = isLast ? Number((targetGreenElec - sumGreen).toFixed(2)) : Number((targetGreenElec * w).toFixed(2))
        const gs = isLast ? Number((targetGas - sumGas).toFixed(2)) : Number((targetGas * w).toFixed(2))
        const stm = isLast ? Number((targetSteam - sumSteam).toFixed(1)) : Number((targetSteam * w).toFixed(1))
        const ol = isLast ? Number((targetOil - sumOil).toFixed(2)) : Number((targetOil * w).toFixed(2))
        const nit = isLast ? Number((targetNitrogen - sumNitrogen).toFixed(2)) : Number((targetNitrogen * w).toFixed(2))

        sumTce += tce
        sumElec += totElec
        sumGrid += grdElec
        sumGreen += solElec
        sumGas += gs
        sumSteam += stm
        sumOil += ol
        sumNitrogen += nit

        return {
          date: ym,
          totalTce: tce,
          totalElec: totElec,
          gridElec: grdElec,
          greenElec: solElec,
          gas: gs,
          steam: stm,
          oil: ol,
          nitrogen: nit,
        }
      })

      return monthList.reverse()
    } else if (timeDim === 'year') {
      // 年度维度：展示该年 12 个月，求和精准等于 activeData
      const y = selectedYear || '2026'
      const yearWeights = [0.075, 0.065, 0.082, 0.084, 0.088, 0.092, 0.095, 0.098, 0.086, 0.082, 0.078, 0.075]
      const totalYw = yearWeights.reduce((a, b) => a + b, 0)

      let sumTce = 0
      let sumElec = 0
      let sumGrid = 0
      let sumGreen = 0
      let sumGas = 0
      let sumSteam = 0
      let sumOil = 0
      let sumNitrogen = 0

      const yearList: typeof records = []
      for (let m = 1; m <= 12; m++) {
        const mStr = String(m).padStart(2, '0')
        const ym = `${y}-${mStr}`
        const idx = m - 1
        const isLast = m === 12
        const w = yearWeights[idx] / totalYw

        const tce = isLast ? Number((targetTotalTce - sumTce).toFixed(1)) : Number((targetTotalTce * w).toFixed(1))
        const totElec = isLast ? Number((targetTotalElec - sumElec).toFixed(2)) : Number((targetTotalElec * w).toFixed(2))
        const grdElec = isLast ? Number((targetGridElec - sumGrid).toFixed(2)) : Number((targetGridElec * w).toFixed(2))
        const solElec = isLast ? Number((targetGreenElec - sumGreen).toFixed(2)) : Number((targetGreenElec * w).toFixed(2))
        const gs = isLast ? Number((targetGas - sumGas).toFixed(2)) : Number((targetGas * w).toFixed(2))
        const stm = isLast ? Number((targetSteam - sumSteam).toFixed(1)) : Number((targetSteam * w).toFixed(1))
        const ol = isLast ? Number((targetOil - sumOil).toFixed(2)) : Number((targetOil * w).toFixed(2))
        const nit = isLast ? Number((targetNitrogen - sumNitrogen).toFixed(2)) : Number((targetNitrogen * w).toFixed(2))

        sumTce += tce
        sumElec += totElec
        sumGrid += grdElec
        sumGreen += solElec
        sumGas += gs
        sumSteam += stm
        sumOil += ol
        sumNitrogen += nit

        yearList.push({
          date: ym,
          totalTce: tce,
          totalElec: totElec,
          gridElec: grdElec,
          greenElec: solElec,
          gas: gs,
          steam: stm,
          oil: ol,
          nitrogen: nit,
        })
      }

      return yearList.reverse()
    } else {
      // 自定义月份区间，求和精准等于 activeData
      const start = selectedMonthRange.start || '2026-01'
      const end = selectedMonthRange.end || '2026-08'
      const [sy, sm] = start.split('-').map(Number)
      const [ey, em] = end.split('-').map(Number)

      const ymList: string[] = []
      let curY = sy
      let curM = sm
      while (curY < ey || (curY === ey && curM <= em)) {
        ymList.push(`${curY}-${String(curM).padStart(2, '0')}`)
        curM++
        if (curM > 12) {
          curM = 1
          curY++
        }
      }

      const count = ymList.length || 1
      let sumTce = 0
      let sumElec = 0
      let sumGrid = 0
      let sumGreen = 0
      let sumGas = 0
      let sumSteam = 0
      let sumOil = 0
      let sumNitrogen = 0

      const customList = ymList.map((ym, idx) => {
        const isLast = idx === ymList.length - 1
        const w = 1 / count

        const tce = isLast ? Number((targetTotalTce - sumTce).toFixed(1)) : Number((targetTotalTce * w).toFixed(1))
        const totElec = isLast ? Number((targetTotalElec - sumElec).toFixed(2)) : Number((targetTotalElec * w).toFixed(2))
        const grdElec = isLast ? Number((targetGridElec - sumGrid).toFixed(2)) : Number((targetGridElec * w).toFixed(2))
        const solElec = isLast ? Number((targetGreenElec - sumGreen).toFixed(2)) : Number((targetGreenElec * w).toFixed(2))
        const gs = isLast ? Number((targetGas - sumGas).toFixed(2)) : Number((targetGas * w).toFixed(2))
        const stm = isLast ? Number((targetSteam - sumSteam).toFixed(1)) : Number((targetSteam * w).toFixed(1))
        const ol = isLast ? Number((targetOil - sumOil).toFixed(2)) : Number((targetOil * w).toFixed(2))
        const nit = isLast ? Number((targetNitrogen - sumNitrogen).toFixed(2)) : Number((targetNitrogen * w).toFixed(2))

        sumTce += tce
        sumElec += totElec
        sumGrid += grdElec
        sumGreen += solElec
        sumGas += gs
        sumSteam += stm
        sumOil += ol
        sumNitrogen += nit

        return {
          date: ym,
          totalTce: tce,
          totalElec: totElec,
          gridElec: grdElec,
          greenElec: solElec,
          gas: gs,
          steam: stm,
          oil: ol,
          nitrogen: nit,
        }
      })

      return customList.reverse()
    }
  }, [activeData, timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

  // 台账本期合计汇总 (严格等于 activeData)
  const ledgerTotals = useMemo(() => {
    return {
      totalTce: activeData.totalTce,
      totalElec: activeData.totalElec,
      gridElec: activeData.gridElec,
      greenElec: activeData.greenElec,
      gas: activeData.gas,
      steam: activeData.steam,
      oil: activeData.oil,
      nitrogen: activeData.nitrogen,
    }
  }, [activeData])

  return (
    <div className="flex gap-3.5 items-start font-sans text-slate-800">
      {/* 左侧 270px 经典工业级组织拓扑树 (支持集团、各经营单位及工厂选择) */}
      <StandardOrgTree
        treeType="factory"
        selectedId={selectedOrgNode.id}
        onSelect={(node) => setSelectedOrgNode(node)}
      />

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* 1. 顶部 Header 与 统一时间维度选择 (参考用能监测标准高度 p-3.5 完全统一对齐) */}
        <div className="bg-white p-3.5 rounded-lg border border-[#DBE6EE] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2C7CFF] shrink-0">
              <PieChartIcon className="size-5" />
            </div>
            <div className="flex items-center gap-3.5">
              <h1 className="text-base font-bold text-slate-800">用能结构分析</h1>
              {/* 选项卡：用能结构 vs 成本结构 */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0d1b29] p-0.5 dark:p-[3px] rounded-lg border border-slate-200 dark:border-[#133748] text-xs font-sans">
                {[
                  { key: 'physical', label: '用能结构' },
                  { key: 'cost', label: '成本结构' },
                ].map((tab) => {
                  const isActive = analysisTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setAnalysisTab(tab.key as any)}
                      className={cn(
                        'h-7 px-3.5 rounded-md transition-all cursor-pointer font-bold text-xs flex items-center select-none',
                        isActive
                          ? 'tbea-tab-cyan-active shadow-xs dark:shadow-none'
                          : 'text-slate-600 hover:text-slate-900 dark:text-[#879ca8] dark:hover:text-white bg-transparent dark:bg-transparent',
                      )}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

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
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                自定义
              </button>
            </div>

            {/* 时间范围选择控件 (随维度自适应切换，样式参照用能监测) */}
            {timeDim === 'month' && (
              <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 text-sm focus:outline-none cursor-pointer font-bold"
                  title="选择指定月份"
                />
              </div>
            )}

            {timeDim === 'quarter' && (
              <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
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
              <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="2026">2026 年度</option>
                  <option value="2025">2025 年度</option>
                  <option value="2024">2024 年度</option>
                </select>
              </div>
            )}

            {timeDim === 'custom' && (
              <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonthRange.start}
                  onChange={handleCustomStartMonthChange}
                  className="bg-transparent border-0 text-slate-800 text-sm focus:outline-none cursor-pointer font-bold"
                  title="开始月份 (最多选12个月)"
                />
                <span className="text-slate-400 font-sans">至</span>
                <input
                  type="month"
                  value={selectedMonthRange.end}
                  onChange={handleCustomEndMonthChange}
                  className="bg-transparent border-0 text-slate-800 text-sm focus:outline-none cursor-pointer font-bold"
                  title="结束月份 (最多选12个月)"
                />
              </div>
            )}

            {/* 导出按钮 */}
            <ExportButton
              onClick={() =>
                alert(
                  analysisTab === 'physical'
                    ? `正在导出【${activeData.name}】用能结构多维分析报表 (Excel)...`
                    : `正在导出【${activeData.name}】能源成本多维分析报表 (Excel)...`
                )
              }
            />
          </div>
        </div>

        {analysisTab === 'physical' ? (
          <>
            {/* ========================================================================= */}
            {/* 🌟 1. 核心数据项大盘卡片 (电包括：总电量、市电、直供绿电，点击可联动分析) */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h2 className="text-base font-bold text-slate-800 dark:text-foreground">
                综合能源消耗量
              </h2>
            </div>
          </div>

          {/* 8 大能源介质卡片网格 (2行4列 + 综合能耗核心首卡) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 font-mono">
            {/* 卡片 1: 综合能源消耗总量 (tce) */}
            <div
              onClick={() => hasSubUnits && setSelectedMetricKey('totalTce')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                hasSubUnits ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'totalTce' && hasSubUnits
                  ? 'bg-emerald-50/40 border-[#059669] ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 font-sans">
                  <div className="size-2 rounded-full bg-emerald-500" />
                  综合能源消耗
                </span>
              </div>
              <div className="text-xl font-extrabold text-emerald-700 truncate">
                {activeData.totalTce.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">tce</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-start">
                <span className="text-emerald-600 font-mono font-bold">同比 -3.8%</span>
              </div>
            </div>

            {/* 卡片 2: 总用电量 (万kWh) */}
            <div
              onClick={() => hasSubUnits && setSelectedMetricKey('totalElec')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                hasSubUnits ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'totalElec' && hasSubUnits
                  ? 'bg-blue-50/40 border-[#2C7CFF] ring-2 ring-blue-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5 font-sans">
                  <Zap className="size-3.5 text-[#2C7CFF]" />
                  总用电量
                </span>
              </div>
              <div className="text-xl font-extrabold text-[#2C7CFF] truncate">
                {activeData.totalElec.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万kWh</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-start">
                <span className="text-emerald-600 font-mono font-bold">同比 -4.2%</span>
              </div>
            </div>

            {/* 卡片 3: 市电量 (万kWh) */}
            <div
              onClick={() => hasSubUnits && setSelectedMetricKey('gridElec')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                hasSubUnits ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'gridElec' && hasSubUnits
                  ? 'bg-sky-50/40 border-[#41C0FF] ring-2 ring-sky-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Building2 className="size-3.5 text-slate-600" />
                  市电量
                </span>
              </div>
              <div className="text-xl font-extrabold text-[#41C0FF] truncate">
                {activeData.gridElec.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万kWh</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-start">
                <span className="text-emerald-600 font-mono font-bold">同比 -6.5%</span>
              </div>
            </div>

            {/* 卡片 4: 直供绿电量 (万kWh) */}
            <div
              onClick={() => hasSubUnits && setSelectedMetricKey('greenElec')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                hasSubUnits ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'greenElec' && hasSubUnits
                  ? 'bg-emerald-50/40 border-[#00D492] ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 font-sans">
                  <Sun className="size-3.5 text-emerald-600" />
                  直供绿电量
                </span>
              </div>
              <div className="text-xl font-extrabold text-[#00D492] truncate">
                {activeData.greenElec.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万kWh</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-start">
                <span className="text-emerald-600 font-mono font-bold">同比 +12.4%</span>
              </div>
            </div>

            {/* 卡片 5: 天然气消耗量 (万m³) */}
            <div
              onClick={() => hasSubUnits && setSelectedMetricKey('gas')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                hasSubUnits ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'gas' && hasSubUnits
                  ? 'bg-amber-50/40 border-[#FF6536] ring-2 ring-orange-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Flame className="size-3.5 text-[#FF6536]" />
                  天然气消耗量
                </span>
              </div>
              <div className="text-xl font-extrabold text-[#FF6536] truncate">
                {activeData.gas.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万m³</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-start">
                <span className="text-emerald-600 font-mono font-bold">同比 -2.1%</span>
              </div>
            </div>

            {/* 卡片 6: 外购蒸汽量 (t) */}
            <div
              onClick={() => hasSubUnits && setSelectedMetricKey('steam')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                hasSubUnits ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'steam' && hasSubUnits
                  ? 'bg-amber-50/40 border-[#FFBA00] ring-2 ring-yellow-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Wind className="size-3.5 text-[#FFBA00]" />
                  外购蒸汽量
                </span>
              </div>
              <div className="text-xl font-extrabold text-[#FFBA00] truncate">
                {activeData.steam.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">t</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-start">
                <span className="text-emerald-600 font-mono font-bold">同比 -1.5%</span>
              </div>
            </div>

            {/* 卡片 7: 油消耗量 (万L) */}
            <div
              onClick={() => hasSubUnits && setSelectedMetricKey('oil')}
              className={cn(
                'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                hasSubUnits ? 'cursor-pointer hover:shadow-md' : '',
                selectedMetricKey === 'oil' && hasSubUnits
                  ? 'bg-purple-50/40 border-[#8E73ED] ring-2 ring-purple-200'
                  : 'bg-white border-slate-200'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                  <Fuel className="size-3.5 text-[#8E73ED]" />
                  油消耗量
                </span>
              </div>
              <div className="text-xl font-extrabold text-[#8E73ED] truncate">
                {activeData.oil.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">万L</span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-start">
                <span className="text-emerald-600 font-mono font-bold">同比 -8.3%</span>
              </div>
            </div>

            {/* 卡片 8: 液氮消耗量 (t) - 只有使用液氮的工厂才显示 */}
            {activeData.nitrogen > 0 && (
              <div
                onClick={() => hasSubUnits && setSelectedMetricKey('nitrogen')}
                className={cn(
                  'p-3.5 rounded-xl border shadow-xs space-y-1.5 transition-all select-none',
                  hasSubUnits ? 'cursor-pointer hover:shadow-md' : '',
                  selectedMetricKey === 'nitrogen' && hasSubUnits
                    ? 'bg-indigo-50/40 border-[#4F39F6] ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                    <Snowflake className="size-3.5 text-[#4F39F6]" />
                    液氮消耗量
                  </span>
                </div>
                <div className="text-xl font-extrabold text-[#4F39F6] truncate">
                  {activeData.nitrogen.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-400 font-sans">t</span>
                </div>
                <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1 flex items-center justify-start">
                  <span className="text-emerald-600 font-mono font-bold">同比 -3.2%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 2. 集团 & 二级经营单位结构分析：各下属生产/经营单位占比与消耗对比 (饼图 + 柱状图 + 明细表) */}
        {/* ========================================================================= */}
        {hasSubUnits && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800">
                  {METRICS_META[selectedMetricKey].name}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 左侧 5/12: 环形图 (经营单位比重 / 下属单位比重) */}
              <div className="lg:col-span-5 border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <PieChartIcon className="size-3.5 text-[#2C7CFF]" />
                    {isGroupLevel ? '经营单位比重' : '下属单位比重'}
                  </span>
                </div>
                <div className="h-[230px]">
                  <Donut
                    data={metricCompanyBreakdown.donutData}
                    valueKey="value"
                    nameKey="name"
                    height={230}
                    unit={metricCompanyBreakdown.unit}
                  />
                </div>
              </div>

              {/* 右侧 7/12: 柱状图 (经营单位能源消耗量 / 下属单位能源消耗量) */}
              <div className="lg:col-span-7 border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <BarChart3 className="size-3.5 text-emerald-600" />
                    {isGroupLevel ? '经营单位能源消耗量' : '下属单位能源消耗量'}
                  </span>
                </div>
                <div className="h-[230px]">
                  <BarChartGroup
                    data={metricCompanyBreakdown.barData}
                    xKey="name"
                    height={230}
                    bars={[
                      { key: '消耗量', name: `${METRICS_META[selectedMetricKey].shortName} (${metricCompanyBreakdown.unit})`, color: METRICS_META[selectedMetricKey].color },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* 下属生产/经营单位数据明细表格 (44px 工业高密表格，依红框圈定彻底剥离穿透操作列) */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="h-[44px] bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold font-sans">
                      <th className="py-2.5 px-3">序号</th>
                      <th className="py-2.5 px-3">{isGroupLevel ? '直属经营单位' : '下属生产单位'}</th>
                      <th className="py-2.5 px-3 text-[#2C7CFF]">
                        {METRICS_META[selectedMetricKey].name} ({metricCompanyBreakdown.unit})
                      </th>
                      <th className="py-2.5 px-3 font-bold text-emerald-700">
                        {isGroupLevel ? '占全集团比重 (%)' : '占全公司比重 (%)'}
                      </th>
                      <th className="py-2.5 px-3">直供绿电（绿证+绿电）</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(currentSubUnits || []).map((comp, idx) => {
                      const val = comp[selectedMetricKey] as number
                      const ratio = metricCompanyBreakdown.totalVal > 0 ? ((val / metricCompanyBreakdown.totalVal) * 100).toFixed(1) : '0.0'
                      return (
                        <tr
                          key={comp.id}
                          onClick={() => {
                            setSelectedOrgNode({
                              id: comp.id,
                              name: comp.name,
                              fullName: comp.fullName,
                              level: isGroupLevel ? 'company' : 'workshop',
                            })
                          }}
                          className="h-[44px] hover:bg-blue-50/40 transition-colors cursor-pointer"
                          title={`点击切换至【${comp.name}】`}
                        >
                          <td className="py-2.5 px-3 font-semibold text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 font-sans flex items-center gap-1.5 pt-3">
                            <Factory className="size-3.5 text-slate-500" />
                            <span>{comp.name}</span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#2C7CFF]">{val.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-extrabold text-emerald-700">{ratio}%</td>
                          <td className="py-2.5 px-3">{comp.greenElecRatio}%</td>
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
        {/* 🌟 3. 三级单体单位视角：该单体车间/工厂自身用能结构构成分析 (无下属单位时展示) */}
        {/* ========================================================================= */}
        {!hasSubUnits && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                <h3 className="text-base font-bold text-slate-800">
                  各能源折标煤占比
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 左侧 5/12: 该单体单位能源结构环形图 */}
              <div className="lg:col-span-5 border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <PieChartIcon className="size-3.5 text-[#2C7CFF]" />
                    用能构成占比 (按折标煤 tce 统计)
                  </span>
                </div>
                <div className="h-[220px]">
                  <Donut
                    data={companyStructureDonutData}
                    valueKey="value"
                    nameKey="name"
                    height={220}
                    unit="tce"
                  />
                </div>
              </div>

              {/* 右侧 7/12: 各介质折标明细台账 */}
              <div className="lg:col-span-7 border border-slate-200/80 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="h-[44px] bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold font-sans">
                      <th className="py-2.5 px-3">能源介质名称</th>
                      <th className="py-2.5 px-3">实物消耗量</th>
                      <th className="py-2.5 px-3">折标系数</th>
                      <th className="py-2.5 px-3 text-[#2C7CFF]">折标煤量 (tce)</th>
                      <th className="py-2.5 px-3 font-bold text-emerald-700">占该单位用能比重</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="h-[44px] hover:bg-blue-50/30">
                      <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5 pt-3">
                        <Building2 className="size-3 text-slate-600" />
                        市网供电 (外购)
                      </td>
                      <td className="py-2 px-3">{activeData.gridElec.toLocaleString()} 万kWh</td>
                      <td className="py-2 px-3 text-slate-400">0.1229 kgce/kWh</td>
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {((activeData.gridElec * 10000 * 0.1229) / 1000).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-[#2C7CFF]">
                        {activeData.totalTce > 0 ? (((activeData.gridElec * 10000 * 0.1229) / 1000 / activeData.totalTce) * 100).toFixed(1) : '0.0'}%
                      </td>
                    </tr>
                    <tr className="h-[44px] hover:bg-emerald-50/30">
                      <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5 text-emerald-900 pt-3">
                        <Sun className="size-3 text-emerald-600" />
                        直供绿电（绿证+绿电）
                      </td>
                      <td className="py-2 px-3 text-emerald-700">{activeData.greenElec.toLocaleString()} 万kWh</td>
                      <td className="py-2 px-3 text-slate-400">0.1229 kgce/kWh</td>
                      <td className="py-2 px-3 font-bold text-emerald-700">
                        {((activeData.greenElec * 10000 * 0.1229) / 1000).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-emerald-700">
                        {activeData.totalTce > 0 ? (((activeData.greenElec * 10000 * 0.1229) / 1000 / activeData.totalTce) * 100).toFixed(1) : '0.0'}%
                      </td>
                    </tr>
                    <tr className="h-[44px] hover:bg-amber-50/30">
                      <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5 pt-3">
                        <Flame className="size-3 text-[#FF6536]" />
                        天然气消耗
                      </td>
                      <td className="py-2 px-3">{activeData.gas.toLocaleString()} 万m³</td>
                      <td className="py-2 px-3 text-slate-400">1.2143 kgce/m³</td>
                      <td className="py-2 px-3 font-bold text-[#FF6536]">
                        {((activeData.gas * 10000 * 1.2143) / 1000).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-[#FF6536]">
                        {activeData.totalTce > 0 ? (((activeData.gas * 10000 * 1.2143) / 1000 / activeData.totalTce) * 100).toFixed(1) : '0.0'}%
                      </td>
                    </tr>
                    <tr className="h-[44px] hover:bg-yellow-50/30">
                      <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5 pt-3">
                        <Wind className="size-3 text-[#FFBA00]" />
                        外购蒸汽
                      </td>
                      <td className="py-2 px-3">{activeData.steam.toLocaleString()} t</td>
                      <td className="py-2 px-3 text-slate-400">0.0943 kgce/kg</td>
                      <td className="py-2 px-3 font-bold text-[#FFBA00]">
                        {(activeData.steam * 0.0943).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-[#FFBA00]">
                        {activeData.totalTce > 0 ? (((activeData.steam * 0.0943) / activeData.totalTce) * 100).toFixed(1) : '0.0'}%
                      </td>
                    </tr>
                    <tr className="h-[44px] hover:bg-purple-50/30">
                      <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5 pt-3">
                        <Fuel className="size-3 text-[#8E73ED]" />
                        用油消耗
                      </td>
                      <td className="py-2 px-3">{activeData.oil.toLocaleString()} 万L</td>
                      <td className="py-2 px-3 text-slate-400">1.09 kgce/L</td>
                      <td className="py-2 px-3 font-bold text-[#8E73ED]">
                        {((activeData.oil * 10000 * 1.09) / 1000).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 font-extrabold text-[#8E73ED]">
                        {activeData.totalTce > 0 ? (((activeData.oil * 10000 * 1.09) / 1000 / activeData.totalTce) * 100).toFixed(1) : '0.0'}%
                      </td>
                    </tr>
                    {activeData.nitrogen > 0 && (
                      <tr className="h-[44px] hover:bg-indigo-50/30">
                        <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5 pt-3">
                          <Snowflake className="size-3 text-[#4F39F6]" />
                          液氮消耗
                        </td>
                        <td className="py-2 px-3">{activeData.nitrogen.toLocaleString()} t</td>
                        <td className="py-2 px-3 text-slate-400">0.66 kgce/kg</td>
                        <td className="py-2 px-3 font-bold text-[#4F39F6]">
                          {((activeData.nitrogen * 1000 * 0.66) / 1000).toFixed(1)}
                        </td>
                        <td className="py-2 px-3 font-extrabold text-[#4F39F6]">
                          {activeData.totalTce > 0 ? (((activeData.nitrogen * 1000 * 0.66) / 1000 / activeData.totalTce) * 100).toFixed(1) : '0.0'}%
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🌟 4. 明细台账 (对应上方 7/8 个核心指标，表头名称与指标卡片严格 1:1 拉齐) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-lg border border-[#DBE6EE] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/80 gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h3 className="text-base font-bold text-slate-800">
                明细台账
              </h3>
            </div>
            <ExportButton
              label="导出台账"
              onClick={() =>
                alert(
                  `正在导出【${activeData.name}】${
                    timeDim === 'month'
                      ? selectedMonth + '逐日'
                      : timeDim === 'quarter'
                      ? selectedQuarter
                      : timeDim === 'year'
                      ? selectedYear + '年度'
                      : selectedMonthRange.start + '至' + selectedMonthRange.end
                  }能耗明细台账 (Excel)...`
                )
              }
            />
          </div>

          <div className="overflow-x-auto max-h-[380px] custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-slate-100 z-10">
                <tr className="border-b border-slate-200 text-slate-700 font-semibold font-sans h-[44px]">
                  <th className="py-2.5 px-3">日期 / 账期</th>
                  <th className="py-2.5 px-3 text-[#059669] font-bold">综合能源消耗 (tce)</th>
                  <th className="py-2.5 px-3 text-[#2C7CFF] font-bold">总用电量 (万kWh)</th>
                  <th className="py-2.5 px-3 text-[#41C0FF] font-semibold">市电量 (万kWh)</th>
                  <th className="py-2.5 px-3 text-[#00D492] font-bold">直供绿电量 (万kWh)</th>
                  <th className="py-2.5 px-3 text-[#FF6536]">天然气消耗量 (万m³)</th>
                  <th className="py-2.5 px-3 text-[#FFBA00]">外购蒸汽量 (t)</th>
                  <th className="py-2.5 px-3 text-[#8E73ED]">油消耗量 (万L)</th>
                  {activeData.nitrogen > 0 && (
                    <th className="py-2.5 px-3 text-[#4F39F6]">液氮消耗量 (t)</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {structureLedgerData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/40 transition-colors h-[44px]">
                    <td className="py-2 px-3 font-semibold text-slate-900 font-sans">{row.date}</td>
                    <td className="py-2 px-3 font-bold text-[#059669]">{row.totalTce.toFixed(1)}</td>
                    <td className="py-2 px-3 font-bold text-[#2C7CFF]">{row.totalElec.toFixed(2)}</td>
                    <td className="py-2 px-3 text-slate-700">{row.gridElec.toFixed(2)}</td>
                    <td className="py-2 px-3 font-bold text-[#00D492]">{row.greenElec.toFixed(2)}</td>
                    <td className="py-2 px-3 text-[#FF6536]">{row.gas.toFixed(2)}</td>
                    <td className="py-2 px-3 text-[#FFBA00]">{row.steam.toFixed(1)}</td>
                    <td className="py-2 px-3 text-[#8E73ED]">{row.oil.toFixed(2)}</td>
                    {activeData.nitrogen > 0 && (
                      <td className="py-2 px-3 text-[#4F39F6]">{row.nitrogen.toFixed(2)}</td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-slate-50 font-bold border-t-2 border-slate-200 text-slate-800 z-10">
                <tr className="h-[44px]">
                  <td className="py-2 px-3 font-sans">本期合计</td>
                  <td className="py-2 px-3 text-[#059669] font-bold">{ledgerTotals.totalTce.toLocaleString()}</td>
                  <td className="py-2 px-3 text-[#2C7CFF] font-bold">{ledgerTotals.totalElec.toLocaleString()}</td>
                  <td className="py-2 px-3 text-slate-700 font-bold">{ledgerTotals.gridElec.toLocaleString()}</td>
                  <td className="py-2 px-3 text-[#00D492] font-bold">{ledgerTotals.greenElec.toLocaleString()}</td>
                  <td className="py-2 px-3 text-[#FF6536] font-bold">{ledgerTotals.gas.toLocaleString()}</td>
                  <td className="py-2 px-3 text-[#FFBA00] font-bold">{ledgerTotals.steam.toLocaleString()}</td>
                  <td className="py-2 px-3 text-[#8E73ED] font-bold">{ledgerTotals.oil.toLocaleString()}</td>
                  {activeData.nitrogen > 0 && (
                    <td className="py-2 px-3 text-[#4F39F6] font-bold">{ledgerTotals.nitrogen.toLocaleString()}</td>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
          </>
        ) : (
          <EnergyCostSection
            selectedOrgNode={selectedOrgNode}
            timeDim={timeDim}
            selectedMonth={selectedMonth}
            selectedQuarter={selectedQuarter}
            selectedYear={selectedYear}
            selectedMonthRange={selectedMonthRange}
            onSelectOrgNode={(node) => setSelectedOrgNode(node)}
          />
        )}
      </div>
    </div>
  )
}

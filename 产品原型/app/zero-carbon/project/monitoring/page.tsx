'use client'

import React, { useState, useMemo } from 'react'
import {
  Sun,
  BatteryCharging,
  Flame,
  Activity,
  Calendar,
  Download,
  Search,
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
  capacity: string // 如 12.8 MWp
  powerKw: number // 实时发电功率 (kW)
  dailyGenKwh: number // 日发电量 (kWh)
  selfUseKwh: number // 消纳电量 (kWh)
  gridKwh: number // 上网电量 (kWh)
  selfRevenueYuan: number // 消纳收益 (元)
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
// Mock 数据集：光伏监测数据
// =========================================================================
const MOCK_PV_DATA: PvMonitoringItem[] = [
  {
    id: 'pv-01',
    time: '2026-08-28',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    projectName: '沈变厂区 12.8MWp 屋顶分布式光伏一期',
    capacity: '12.8 MWp',
    powerKw: 8640.5,
    dailyGenKwh: 48520.0,
    selfUseKwh: 42697.6,
    gridKwh: 5822.4,
    selfRevenueYuan: 34158.0,
    gridRevenueYuan: 2212.5,
    totalRevenueYuan: 36370.5,
    selfUseRatio: 88.0,
    status: '正常发电',
  },
  {
    id: 'pv-02',
    time: '2026-08-28',
    park: '特变电工新疆产业园',
    company: '新变厂',
    projectName: '新疆变压器厂区 20MWp 分布式光伏三期',
    capacity: '20.0 MWp',
    powerKw: 14250.0,
    dailyGenKwh: 86200.0,
    selfUseKwh: 73270.0,
    gridKwh: 12930.0,
    selfRevenueYuan: 54952.5,
    gridRevenueYuan: 4266.9,
    totalRevenueYuan: 59219.4,
    selfUseRatio: 85.0,
    status: '正常发电',
  },
  {
    id: 'pv-03',
    time: '2026-08-28',
    park: '特变电工新疆电缆产业园',
    company: '特变电工新疆线缆厂',
    projectName: '新缆厂 4.5MWp 屋顶分布式光伏二期',
    capacity: '4.5 MWp',
    powerKw: 3120.0,
    dailyGenKwh: 18850.0,
    selfUseKwh: 17342.0,
    gridKwh: 1508.0,
    selfRevenueYuan: 13006.5,
    gridRevenueYuan: 497.6,
    totalRevenueYuan: 13504.1,
    selfUseRatio: 92.0,
    status: '正常发电',
  },
  {
    id: 'pv-04',
    time: '2026-08-28',
    park: '特变电工南方输变电产业园',
    company: '衡变本部',
    projectName: '衡变南方产业园 8.2MWp 柔性支架光伏电站',
    capacity: '8.2 MWp',
    powerKw: 5680.0,
    dailyGenKwh: 32400.0,
    selfUseKwh: 29160.0,
    gridKwh: 3240.0,
    selfRevenueYuan: 23328.0,
    gridRevenueYuan: 1231.2,
    totalRevenueYuan: 24559.2,
    selfUseRatio: 90.0,
    status: '正常发电',
  },
  {
    id: 'pv-05',
    time: '2026-08-28',
    park: '特变电工(德阳)电缆园区',
    company: '特变电工（德阳）电缆股份有限公司',
    projectName: '德缆产业园 6MWp BIPV建筑一体化光伏电站',
    capacity: '6.0 MWp',
    powerKw: 4120.0,
    dailyGenKwh: 23600.0,
    selfUseKwh: 20768.0,
    gridKwh: 2832.0,
    selfRevenueYuan: 16614.4,
    gridRevenueYuan: 1076.2,
    totalRevenueYuan: 17690.6,
    selfUseRatio: 88.0,
    status: '正常发电',
  },
  {
    id: 'pv-06',
    time: '2026-08-27',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    projectName: '沈变厂区 12.8MWp 屋顶分布式光伏一期',
    capacity: '12.8 MWp',
    powerKw: 8420.0,
    dailyGenKwh: 47600.0,
    selfUseKwh: 41888.0,
    gridKwh: 5712.0,
    selfRevenueYuan: 33510.4,
    gridRevenueYuan: 2170.5,
    totalRevenueYuan: 35680.9,
    selfUseRatio: 88.0,
    status: '正常发电',
  },
  {
    id: 'pv-07',
    time: '2026-08-27',
    park: '特变电工新疆产业园',
    company: '新变厂',
    projectName: '新疆变压器厂区 20MWp 分布式光伏三期',
    capacity: '20.0 MWp',
    powerKw: 13980.0,
    dailyGenKwh: 84900.0,
    selfUseKwh: 72165.0,
    gridKwh: 12735.0,
    selfRevenueYuan: 54123.7,
    gridRevenueYuan: 4202.5,
    totalRevenueYuan: 58326.2,
    selfUseRatio: 85.0,
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
    park: '特变电工华东输变电科技产业园',
    company: '鲁缆本部',
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
    projectName: '沈变本部 5MW/10MWh 工业级微网储能系统',
    capacity: '5MW / 10MWh',
    ratedPowerKw: 5000.0,
    chargeDischargePowerKw: -2640.0,
    chargeKwh: 10500.0,
    dischargeKwh: 9187.5,
    soc: 62.0,
    status: '放电',
    revenueYuan: 7120.0,
    efficiency: 87.5,
    gridChargeRatio: 25.0,
    greenChargeRatio: 75.0,
    criticalPeakDischargeRatio: 65.0,
    peakDischargeRatio: 35.0,
  },
  {
    id: 'st-04',
    time: '2026-08-28',
    park: '特变电工新疆电缆产业园',
    company: '特变电工新疆线缆厂',
    projectName: '新疆线缆 4MW/8MWh 智慧储能削峰填谷示范站',
    capacity: '4MW / 8MWh',
    ratedPowerKw: 4000.0,
    chargeDischargePowerKw: 0.0,
    chargeKwh: 8400.0,
    dischargeKwh: 7291.2,
    soc: 91.5,
    status: '待机',
    revenueYuan: 5380.0,
    efficiency: 86.8,
    gridChargeRatio: 20.0,
    greenChargeRatio: 80.0,
    criticalPeakDischargeRatio: 55.0,
    peakDischargeRatio: 45.0,
  },
  {
    id: 'st-05',
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
    company: '特变电工（德阳）电缆股份有限公司',
    projectName: '德缆产业园 2.5MW 高温工业水源热泵系统',
    capacity: '2.5 MWth',
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
    projectName: '天变公司 1.8MW 真空干燥罐冷凝余热水源热泵',
    capacity: '1.8 MWth',
    cop: 4.12,
    supplyTemp: 72.0,
    returnTemp: 55.5,
    heatOutputGj: 153.8,
    powerConsumptionKwh: 10400.0,
    powerKw: 1020.0,
    pressureMpa: 1.32,
    greenPowerRatio: 73.1,
    peakRatio: 22.0,
    savingsYuan: 4300.0,
    status: '正常供热',
  },
  {
    id: 'hp-03',
    time: '2026-08-28',
    park: '特变电工东北输变电产业园',
    company: '沈变本部',
    projectName: '沈变厂区 3.2MW 深层地源热泵集中供暖系统',
    capacity: '3.2 MWth',
    cop: 3.92,
    supplyTemp: 65.0,
    returnTemp: 48.0,
    heatOutputGj: 268.0,
    powerConsumptionKwh: 19000.0,
    powerKw: 1850.0,
    pressureMpa: 1.18,
    greenPowerRatio: 70.5,
    peakRatio: 25.8,
    savingsYuan: 7644.0,
    status: '正常供热',
  },
  {
    id: 'hp-04',
    time: '2026-08-27',
    park: '特变电工(德阳)电缆园区',
    company: '特变电工（德阳）电缆股份有限公司',
    projectName: '德缆产业园 2.5MW 高温工业水源热泵系统',
    capacity: '2.5 MWth',
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

// 园区与直属企业关联关系映射字典
const PARK_TO_ENTERPRISES_MAP: Record<string, { id: string; name: string }[]> = {
  '特变电工东北输变电产业园': [
    { id: '沈变本部', name: '沈变本部' },
    { id: '智慧能源', name: '智慧能源' },
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
  '特变电工新疆电缆产业园': [
    { id: '特变电工新疆线缆厂', name: '特变电工新疆线缆厂' },
    { id: '特变电工新疆电缆有限公司', name: '特变电工新疆电缆有限公司' },
  ],
  '特变电工(德阳)电缆园区': [
    { id: '特变电工（德阳）电缆股份有限公司', name: '特变电工（德阳）电缆股份有限公司' },
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
  const [categoryFilter, setCategoryFilter] = useState<'光伏' | '储能' | '热泵'>('光伏')

  // 2. 园区与企业过滤
  const [parkFilter, setParkFilter] = useState<string>('all')
  const [companyFilter, setCompanyFilter] = useState<string>('all')

  // 3. 时间维度与日期范围
  const [timeDim, setTimeDim] = useState<'day' | 'month'>('day')
  const [startDate, setStartDate] = useState('2026-08-01')
  const [endDate, setEndDate] = useState('2026-08-28')
  const [selectedMonth, setSelectedMonth] = useState('2026-08')

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

  // 1. 过滤光伏数据
  const filteredPvData = useMemo(() => {
    return MOCK_PV_DATA.filter((item) => {
      if (categoryFilter !== '光伏') return false
      if (timeDim === 'day') {
        if (startDate && item.time < startDate) return false
        if (endDate && item.time > endDate) return false
      } else if (timeDim === 'month') {
        if (selectedMonth && !item.time.startsWith(selectedMonth)) return false
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
  }, [categoryFilter, timeDim, startDate, endDate, selectedMonth, parkFilter, companyFilter, selectedNode, searchKw])

  // 2. 过滤储能数据
  const filteredStorageData = useMemo(() => {
    return MOCK_STORAGE_DATA.filter((item) => {
      if (categoryFilter !== '储能') return false
      if (timeDim === 'day') {
        if (startDate && item.time < startDate) return false
        if (endDate && item.time > endDate) return false
      } else if (timeDim === 'month') {
        if (selectedMonth && !item.time.startsWith(selectedMonth)) return false
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
  }, [categoryFilter, timeDim, startDate, endDate, selectedMonth, parkFilter, companyFilter, selectedNode, searchKw])

  // 3. 过滤热泵数据
  const filteredHeatPumpData = useMemo(() => {
    return MOCK_HEAT_PUMP_DATA.filter((item) => {
      if (categoryFilter !== '热泵') return false
      if (timeDim === 'day') {
        if (startDate && item.time < startDate) return false
        if (endDate && item.time > endDate) return false
      } else if (timeDim === 'month') {
        if (selectedMonth && !item.time.startsWith(selectedMonth)) return false
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
  }, [categoryFilter, timeDim, startDate, endDate, selectedMonth, parkFilter, companyFilter, selectedNode, searchKw])

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
      }
    }
    const totalRatedPower = filteredStorageData.reduce((acc, i) => acc + i.ratedPowerKw, 0)
    const totalCurrentPower = filteredStorageData.reduce((acc, i) => acc + Math.abs(i.chargeDischargePowerKw), 0)
    const totalCharge = filteredStorageData.reduce((acc, i) => acc + i.chargeKwh, 0)
    const totalDischarge = filteredStorageData.reduce((acc, i) => acc + i.dischargeKwh, 0)
    const avgSoc = (filteredStorageData.reduce((acc, i) => acc + i.soc, 0) / filteredStorageData.length).toFixed(1)
    const totalRevenue = filteredStorageData.reduce((acc, i) => acc + i.revenueYuan, 0)
    const avgEfficiency = ((totalDischarge / totalCharge) * 100).toFixed(1)

    return {
      totalRatedPower: totalRatedPower.toLocaleString(),
      totalCurrentPower: totalCurrentPower.toLocaleString(),
      totalCharge: totalCharge.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      totalDischarge: totalDischarge.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      avgSoc,
      totalRevenue: totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      avgEfficiency,
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

  // 图表数据转换
  const pvChartData = useMemo(() => {
    return [...filteredPvData]
      .reverse()
      .map((item) => ({
        time: item.time.slice(5),
        发电量: item.dailyGenKwh,
        消纳电量: item.selfUseKwh,
        上网电量: item.gridKwh,
        消纳收益: item.selfRevenueYuan,
        上网收益: item.gridRevenueYuan,
      }))
  }, [filteredPvData])

  const storageChartData = useMemo(() => {
    return [...filteredStorageData]
      .reverse()
      .map((item) => ({
        time: item.time.slice(5),
        日充电量: item.chargeKwh,
        日放电量: item.dischargeKwh,
        收益: item.revenueYuan,
        综合效率: item.efficiency,
        SOC: item.soc,
      }))
  }, [filteredStorageData])

  const heatPumpChartData = useMemo(() => {
    return [...filteredHeatPumpData]
      .reverse()
      .map((item) => ({
        time: item.time.slice(5),
        制热量: item.heatOutputGj,
        耗电量: item.powerConsumptionKwh,
        COP: item.cop,
        供水温度: item.supplyTemp,
        收益: item.savingsYuan,
      }))
  }, [filteredHeatPumpData])

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
        <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Activity className="size-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground flex items-center gap-2">
                实时监控
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {selectedNode.name}
                </span>
              </h1>
              <p className="text-[11px] text-muted-foreground">
                集成光伏、储能、热泵三类零碳资产实时功率、工况与运行收益在线监测
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 时间维度切换：日 / 月 */}
            <div className="flex items-center bg-panel p-0.5 rounded-lg border border-border text-xs font-sans">
              <button
                type="button"
                onClick={() => setTimeDim('day')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'day' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                日
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'month' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                月
              </button>
            </div>

            {/* 日期选择器 */}
            {timeDim === 'day' && (
              <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                  title="起始日期"
                />
                <span className="text-muted-foreground font-sans">至</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                  title="结束日期"
                />
              </div>
            )}

            {timeDim === 'month' && (
              <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer font-bold"
                  title="选择指定月份"
                />
              </div>
            )}

            {/* 导出按钮 */}
            <button
              type="button"
              onClick={() =>
                alert(
                  `已成功导出【${selectedNode.name}】${categoryFilter}模块实时监测数据报表！`,
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-panel hover:bg-accent/40 text-foreground text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>导出报表</span>
            </button>
          </div>
        </div>

        {/* 🌟 2. 核心分类与园区/企业筛选工具栏 */}
        <div className="bg-card p-3 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3 font-sans">
          <div className="flex flex-wrap items-center gap-3">
            {/* 分类切换按钮组：光伏 / 储能 / 热泵 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground whitespace-nowrap">监控模块：</span>
              <div className="flex items-center gap-1 bg-panel p-0.5 rounded-lg border border-border text-xs font-sans">
                {[
                  { key: '光伏', label: '☀️ 光伏' },
                  { key: '储能', label: '🔋 储能' },
                  { key: '热泵', label: '♨️ 热泵' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setCategoryFilter(tab.key as any)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-md transition-all cursor-pointer font-bold text-xs flex items-center gap-1.5 select-none',
                      categoryFilter === tab.key
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 园区下拉选择框 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground whitespace-nowrap">所属园区：</span>
              <select
                value={parkFilter}
                onChange={(e) => handleParkChange(e.target.value)}
                className="h-8 px-2.5 rounded-lg border border-border bg-panel text-xs text-foreground font-medium focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
              >
                <option value="all" className="bg-card text-foreground">全部园区 (全集团 15 园区)</option>
                <option value="特变电工东北输变电产业园" className="bg-card text-foreground">特变电工东北输变电产业园 (沈阳)</option>
                <option value="特变电工南方输变电产业园" className="bg-card text-foreground">特变电工南方输变电产业园 (衡阳)</option>
                <option value="特变电工新疆产业园" className="bg-card text-foreground">特变电工新疆产业园 (乌鲁木齐)</option>
                <option value="特变电工新疆电缆产业园" className="bg-card text-foreground">特变电工新疆电缆产业园 (昌吉)</option>
                <option value="特变电工(德阳)电缆园区" className="bg-card text-foreground">特变电工(德阳)电缆园区 (德阳)</option>
                <option value="特变电工天变产业园" className="bg-card text-foreground">特变电工天变产业园 (天津)</option>
                <option value="特变电工华东输变电科技产业园" className="bg-card text-foreground">特变电工华东输变电科技产业园 (新泰)</option>
              </select>
            </div>

            {/* 企业下拉选择框 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground whitespace-nowrap">所属企业：</span>
              <select
                value={companyFilter}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className="h-8 px-2.5 rounded-lg border border-border bg-panel text-xs text-foreground font-medium focus:outline-none focus:border-primary shadow-2xs max-w-[220px] cursor-pointer"
              >
                <option value="all" className="bg-card text-foreground">全部所属企业</option>
                {availableCompanies ? (
                  availableCompanies.map((c) => (
                    <option key={c.id} value={c.name} className="bg-card text-foreground">
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="沈变本部" className="bg-card text-foreground">沈变本部</option>
                    <option value="衡变本部" className="bg-card text-foreground">衡变本部</option>
                    <option value="新变厂" className="bg-card text-foreground">新变厂</option>
                    <option value="特变电工新疆线缆厂" className="bg-card text-foreground">特变电工新疆线缆厂</option>
                    <option value="特变电工（德阳）电缆股份有限公司" className="bg-card text-foreground">特变电工（德阳）电缆股份有限公司</option>
                    <option value="天变公司" className="bg-card text-foreground">天变公司</option>
                    <option value="鲁缆本部" className="bg-card text-foreground">鲁缆本部</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* 右侧搜索 */}
          <div className="flex items-center gap-2">
            <div className="relative w-52">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索项目/日期/基地..."
                value={searchKw}
                onChange={(e) => setSearchKw(e.target.value)}
                className="w-full h-8 pl-8 pr-2.5 text-xs rounded-lg border border-border bg-panel text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            {(parkFilter !== 'all' || companyFilter !== 'all' || searchKw) && (
              <button
                type="button"
                onClick={() => {
                  setParkFilter('all')
                  setCompanyFilter('all')
                  setSearchKw('')
                }}
                className="text-[11px] text-muted-foreground hover:text-rose-400 font-bold px-1.5 py-1 rounded transition-colors cursor-pointer"
              >
                重置
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* 🌟 1. 光伏实时监测模块 (Photovoltaic Monitoring) */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {categoryFilter === '光伏' && (
          <div className="space-y-3.5">
            {/* 光伏 6 大核心 KPI 指标卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">发电功率</span>
                  <Zap className="size-3.5 text-amber-400" />
                </div>
                <div className="text-base font-bold font-mono text-foreground">
                  {pvSummary.totalPower} <span className="text-xs font-normal text-muted-foreground">kW</span>
                </div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">实时逆变输出</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">发电量</span>
                  <Sun className="size-3.5 text-amber-400" />
                </div>
                <div className="text-base font-bold font-mono text-amber-400">
                  {pvSummary.totalGen} <span className="text-xs font-normal text-muted-foreground">kWh</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">当期累计发电</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">消纳电量</span>
                  <Activity className="size-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {pvSummary.totalSelf} <span className="text-xs font-normal text-muted-foreground">kWh</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                  就地消纳率 {pvSummary.avgSelfRatio}%
                </div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">上网电量</span>
                  <ArrowUpRight className="size-3.5 text-primary" />
                </div>
                <div className="text-base font-bold font-mono text-primary">
                  {pvSummary.totalGrid} <span className="text-xs font-normal text-muted-foreground">kWh</span>
                </div>
                <div className="text-[10px] text-primary font-mono mt-0.5">反送公用电网</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">消纳收益</span>
                  <Coins className="size-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  ¥{pvSummary.totalSelfRev}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">自发自用节电费</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">上网收益</span>
                  <Coins className="size-3.5 text-primary" />
                </div>
                <div className="text-base font-bold font-mono text-primary">
                  ¥{pvSummary.totalGridRev}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">燃煤标杆售电</div>
              </div>
            </div>

            {/* 光伏图表时序展示 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-400" />
                    <h3 className="text-xs font-bold text-foreground">
                      光伏发电量与消纳/上网时序平衡趋势
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">电量 (kWh)</span>
                </div>
                <div className="h-[240px]">
                  <LineTrend
                    data={pvChartData}
                    xKey="time"
                    height={240}
                    lines={[
                      { key: '发电量', name: '日发电量 (kWh)', color: '#fa8c16' },
                      { key: '消纳电量', name: '消纳电量 (kWh)', color: '#10b981' },
                      { key: '上网电量', name: '上网电量 (kWh)', color: '#3b82f6' },
                    ]}
                  />
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    <h3 className="text-xs font-bold text-foreground">
                      光伏自用消纳节费与上网售电收益对比
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">收益 (元)</span>
                </div>
                <div className="h-[240px]">
                  <LineTrend
                    data={pvChartData}
                    xKey="time"
                    height={240}
                    lines={[
                      { key: '消纳收益', name: '消纳节费收益 (元)', color: '#10b981' },
                      { key: '上网收益', name: '余电上网收益 (元)', color: '#3b82f6' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* 光伏监测数据表格 */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-panel">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <h3 className="text-xs font-bold text-foreground">光伏项目实时发电与消纳台账表</h3>
                  <span className="text-[10px] text-muted-foreground font-mono">共 {filteredPvData.length} 个项目</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">数据采集周期：15分钟</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-panel text-muted-foreground font-bold border-b border-border">
                      <th className="py-2.5 px-3 whitespace-nowrap">项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/企业</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">装机容量</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">发电功率 (kW)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">发电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">消纳电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">上网电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">消纳收益 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">上网收益 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">综合日收益 (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">消纳比例</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">运行状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono text-foreground">
                    {filteredPvData.map((item) => (
                      <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-foreground">
                          {item.projectName}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-muted-foreground">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-muted-foreground/70">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-amber-400">{item.capacity}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                          {item.powerKw.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground">
                          {item.dailyGenKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                          {item.selfUseKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-primary">
                          {item.gridKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                          ¥{item.selfRevenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-primary">
                          ¥{item.gridRevenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                          ¥{item.totalRevenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-400">
                          {item.selfUseRatio}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {item.status}
                          </span>
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
            {/* 储能 8 大核心 KPI 指标卡片 (2行展示，每行4张) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2.5">
              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">额定功率</span>
                  <Gauge className="size-3.5 text-primary" />
                </div>
                <div className="text-base font-bold font-mono text-foreground">
                  {storageSummary.totalRatedPower}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">kW (装机总容量)</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">充放电功率</span>
                  <Zap className="size-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {storageSummary.totalCurrentPower}
                </div>
                <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">kW (实时负荷)</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">充电量</span>
                  <BatteryCharging className="size-3.5 text-primary" />
                </div>
                <div className="text-base font-bold font-mono text-primary">
                  {storageSummary.totalCharge}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">kWh (当期累计)</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">放电量</span>
                  <TrendingUp className="size-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {storageSummary.totalDischarge}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">kWh (削峰释放)</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">当前 SOC</span>
                  <BatteryCharging className="size-3.5 text-purple-400" />
                </div>
                <div className="text-base font-bold font-mono text-purple-400">
                  {storageSummary.avgSoc}%
                </div>
                <div className="text-[10px] text-purple-400 font-mono mt-0.5">荷电状态均值</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">实时状态</span>
                  <Radio className="size-3.5 text-emerald-400 animate-pulse" />
                </div>
                <div className="text-base font-bold font-sans text-emerald-400">
                  放电消纳中
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">晚高峰顶峰调度</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">收益 (按日)</span>
                  <Coins className="size-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  ¥{storageSummary.totalRevenue}
                </div>
                <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">峰谷套利净额</div>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px]">综合效率 (日)</span>
                  <Gauge className="size-3.5 text-primary" />
                </div>
                <div className="text-base font-bold font-mono text-primary">
                  {storageSummary.avgEfficiency}%
                </div>
                <div className="text-[10px] text-primary font-mono mt-0.5">全系统转换比</div>
              </div>
            </div>

            {/* 储能图表双栏展示 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <h3 className="text-xs font-bold text-foreground">
                      储能充放电量时序与套利收益趋势
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">电量 (kWh) / 收益 (元)</span>
                </div>
                <div className="h-[240px]">
                  <LineTrend
                    data={storageChartData}
                    xKey="time"
                    height={240}
                    lines={[
                      { key: '日充电量', name: '日充电量 (kWh)', color: '#1677ff' },
                      { key: '日放电量', name: '日放电量 (kWh)', color: '#10b981' },
                      { key: '收益', name: '套利收益 (元)', color: '#fa8c16' },
                    ]}
                  />
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-purple-400" />
                    <h3 className="text-xs font-bold text-foreground">
                      储能综合充放效率与 SOC 荷电状态跟踪
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">百分比 (%)</span>
                </div>
                <div className="h-[240px]">
                  <LineTrend
                    data={storageChartData}
                    xKey="time"
                    height={240}
                    lines={[
                      { key: '综合效率', name: '综合效率 (%)', color: '#722ed1' },
                      { key: 'SOC', name: 'SOC 荷电 (%)', color: '#13c2c2' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* 储能监测数据表格 */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-panel">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">储能电站实时运行监测台账表</h3>
                  <span className="text-[10px] text-muted-foreground font-mono">共 {filteredStorageData.length} 个电站</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">数据采集源：PCS变流器 + BMS</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-panel text-muted-foreground font-bold border-b border-border">
                      <th className="py-2.5 px-3 whitespace-nowrap">项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/企业</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">功率 (kW)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">充放电功率 (kW)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">充电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">放电量 (kWh)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">SOC</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">状态 (充/放)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right">收益(按日) (元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">综合效率(日)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">绿充占比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">尖放占比</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono text-foreground">
                    {filteredStorageData.map((item) => (
                      <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-foreground">
                          {item.projectName}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-muted-foreground">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-muted-foreground/70">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-primary">
                          {item.ratedPowerKw.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold">
                          <span className={item.chargeDischargePowerKw >= 0 ? 'text-primary' : 'text-emerald-400'}>
                            {item.chargeDischargePowerKw >= 0 ? `+${item.chargeDischargePowerKw}` : item.chargeDischargePowerKw}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground">
                          {item.chargeKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground">
                          {item.dischargeKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-purple-400">
                          {item.soc}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-sans font-bold border',
                              item.status === '充电'
                                ? 'bg-primary/20 text-primary border-primary/30'
                                : item.status === '放电'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-panel text-muted-foreground border-border',
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                          ¥{item.revenueYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-primary">
                          {item.efficiency}%
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-400">
                          {item.greenChargeRatio}%
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-purple-400">
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
            {/* 热泵 10 大核心 KPI 指标卡片 (2行展示，每行5张) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2.5">
              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">COP 能效</span>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {heatPumpSummary.avgCop}
                </div>
                <span className="text-[10px] text-muted-foreground">实时制热COP</span>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">供水温度</span>
                <div className="text-base font-bold font-mono text-rose-400">
                  {heatPumpSummary.avgSupplyTemp} <span className="text-xs font-normal text-muted-foreground">℃</span>
                </div>
                <span className="text-[10px] text-muted-foreground">出水恒温控制</span>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">回水温度</span>
                <div className="text-base font-bold font-mono text-primary">
                  {heatPumpSummary.avgReturnTemp} <span className="text-xs font-normal text-muted-foreground">℃</span>
                </div>
                <span className="text-[10px] text-muted-foreground">回水温差正常</span>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">制热量</span>
                <div className="text-base font-bold font-mono text-amber-400">
                  {heatPumpSummary.totalHeat} <span className="text-xs font-normal text-muted-foreground">GJ</span>
                </div>
                <span className="text-[10px] text-muted-foreground">当期累计产热</span>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">耗电量</span>
                <div className="text-base font-bold font-mono text-foreground">
                  {heatPumpSummary.totalPowerKwh} <span className="text-xs font-normal text-muted-foreground">kWh</span>
                </div>
                <span className="text-[10px] text-muted-foreground">热泵运行电耗</span>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">功率</span>
                <div className="text-base font-bold font-mono text-foreground">
                  {heatPumpSummary.totalPowerKw} <span className="text-xs font-normal text-muted-foreground">kW</span>
                </div>
                <span className="text-[10px] text-muted-foreground">实时电功率</span>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">压力</span>
                <div className="text-base font-bold font-mono text-purple-400">
                  1.25 <span className="text-xs font-normal text-muted-foreground">MPa</span>
                </div>
                <span className="text-[10px] text-muted-foreground">冷凝管网压力</span>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">绿电占比</span>
                <div className="text-base font-bold font-mono text-emerald-400">
                  {heatPumpSummary.avgGreenRatio}%
                </div>
                <span className="text-[10px] text-emerald-400">光伏绿电直驱</span>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">尖/峰占比</span>
                <div className="text-base font-bold font-mono text-amber-400">
                  {heatPumpSummary.avgPeakRatio}%
                </div>
                <span className="text-[10px] text-muted-foreground">高电价时段负荷</span>
              </div>

              <div className="bg-card p-3 rounded-xl border border-border shadow-xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">收益 (节费)</span>
                <div className="text-base font-bold font-mono text-emerald-400">
                  ¥{heatPumpSummary.totalSavings}
                </div>
                <span className="text-[10px] text-emerald-400">替代燃气节费</span>
              </div>
            </div>

            {/* 热泵图表时序展示 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-400" />
                    <h3 className="text-xs font-bold text-foreground">
                      热泵制热量 (GJ) 与耗电量 (kWh) 时序能效分析
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">制热与耗电</span>
                </div>
                <div className="h-[240px]">
                  <LineTrend
                    data={heatPumpChartData}
                    xKey="time"
                    height={240}
                    lines={[
                      { key: '制热量', name: '日制热量 (GJ)', color: '#fa8c16' },
                      { key: '耗电量', name: '日耗电量 (kWh)', color: '#1677ff' },
                      { key: '收益', name: '替代节费 (元)', color: '#10b981' },
                    ]}
                  />
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    <h3 className="text-xs font-bold text-foreground">
                      热泵供水温度 (℃) 与 COP 能效比跟踪曲线
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">温度与能效</span>
                </div>
                <div className="h-[240px]">
                  <LineTrend
                    data={heatPumpChartData}
                    xKey="time"
                    height={240}
                    lines={[
                      { key: '供水温度', name: '供水温度 (℃)', color: '#f43f5e' },
                      { key: 'COP', name: 'COP 能效比', color: '#10b981' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* 热泵监测数据表格 */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-panel">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    工业热泵机组实时运行工况与节费台账表
                  </h3>
                  <span className="text-[10px] text-muted-foreground font-mono">共 {filteredHeatPumpData.length} 台套</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">采集源：超声波热量表 + PLC控制器</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-panel text-muted-foreground font-bold border-b border-border">
                      <th className="py-2.5 px-3 whitespace-nowrap">项目名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所属园区/企业</th>
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
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">工况状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono text-foreground">
                    {filteredHeatPumpData.map((item) => (
                      <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-foreground">
                          {item.projectName}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-muted-foreground">
                          <div>{item.company}</div>
                          <div className="text-[10px] text-muted-foreground/70">{item.park}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-400">
                          {item.cop}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-rose-400">
                          {item.supplyTemp} ℃
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-primary">
                          {item.returnTemp} ℃
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                          {item.heatOutputGj}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground">
                          {item.powerConsumptionKwh.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-foreground">
                          {item.powerKw.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-purple-400">
                          {item.pressureMpa}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-400">
                          {item.greenPowerRatio}%
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-400">
                          {item.peakRatio}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                          ¥{item.savingsYuan.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {item.status}
                          </span>
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

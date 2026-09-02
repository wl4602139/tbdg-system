'use client'

import React, { useState, useMemo } from 'react'
import {
  Zap,
  Sun,
  BatteryCharging,
  Coins,
  Calendar,
  Plus,
  TrendingUp,
  TrendingDown,
  Download,
  Building2,
  Check,
  X,
  MapPin,
  Maximize2,
  Search,
  Gauge,
  Leaf,
  FileText,
  DollarSign,
  CheckCircle2,
  Activity,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 15 个零碳产业园区电力、微电网与绿电全景数据字典
interface ParkGridDetail {
  id: string
  name: string
  fullName: string
  location: string
  company: string
  loadKw: number
  pvKw: number
  storageKw: number
  pvSavings: string
  surplusRevenue: string
  totalRevenue: string
  greenRate: number
  voltage: string
  feedInTariff: string
  industrialPrice: string
  pvCapacity: string
  pvGenerationKWh: string
  selfUseKWh: string
  gridExportKWh: string
  purchasedGreenElec: string
  gecCertificateCount: number
  gridPoints: {
    name: string
    accountName: string
    voltage: string
    loadKw: number
    status: '正常' | '检修' | '无变压器'
  }[]
}

const PARK_GRID_MAP: Record<string, ParkGridDetail> = {
  park_root: {
    id: 'park_root',
    name: '电装集团',
    fullName: '特变电工（电装集团）15 大工业园区',
    location: '全国多基地汇总',
    company: '全集团汇总',
    loadKw: 12450,
    pvKw: 4850,
    storageKw: 1200,
    pvSavings: '¥632.6 万元/月',
    surplusRevenue: '¥88.2 万元/月',
    totalRevenue: '¥720.8 万元/月',
    greenRate: 38.9,
    voltage: '10kV / 35kV / 110kV',
    feedInTariff: '0.250 ~ 0.450 元/kWh (各省标杆上网价)',
    industrialPrice: '0.620 元/kWh (平均)',
    pvCapacity: '48.5 MWp',
    pvGenerationKWh: '1,280.5 万kWh',
    selfUseKWh: '1,020.2 万kWh',
    gridExportKWh: '260.3 万kWh',
    purchasedGreenElec: '380.5 万kWh',
    gecCertificateCount: 85000,
    gridPoints: [
      { name: '东北产业园 1# 开闭所并网点', accountName: '沈变公司 10kV 专线', voltage: '10.22 kV', loadKw: 4680, status: '正常' },
      { name: '东北产业园 2# 开闭所并网点', accountName: '和新套管 10kV 专线', voltage: '10.20 kV', loadKw: 3540, status: '正常' },
      { name: '东北产业园 3# 开闭所并网点', accountName: '西变互感器 10kV 专线', voltage: '10.25 kV', loadKw: 2450, status: '正常' },
      { name: '南方产业园 主变并网点 A', accountName: '衡变公司 35kV 变电站', voltage: '35.40 kV', loadKw: 5800, status: '正常' },
      { name: '南方产业园 光伏并网点 B', accountName: '衡变光伏 10kV 并网', voltage: '10.15 kV', loadKw: 2200, status: '正常' },
      { name: '鲁缆产业园 连续挤塑并网点', accountName: '鲁缆公司 10kV 变电所', voltage: '10.30 kV', loadKw: 3100, status: '正常' },
    ],
  },
  park_01: {
    id: 'park_01',
    name: '特变电工东北输变电产业园',
    fullName: '特变电工东北输变电产业园 (沈阳)',
    location: '沈阳市',
    company: '沈变公司主基地',
    loadKw: 12450,
    pvKw: 4850,
    storageKw: 1200,
    pvSavings: '¥100.8 万元/月',
    surplusRevenue: '¥12.9 万元/月',
    totalRevenue: '¥113.7 万元/月',
    greenRate: 38.9,
    voltage: '10.22 kV',
    feedInTariff: '0.375 元/kWh (辽宁脱硫燃煤基准价)',
    industrialPrice: '0.680 元/kWh',
    pvCapacity: '5.8 MWp',
    pvGenerationKWh: '182.6 万kWh',
    selfUseKWh: '148.2 万kWh',
    gridExportKWh: '34.4 万kWh',
    purchasedGreenElec: '80.1 万kWh',
    gecCertificateCount: 18000,
    gridPoints: [
      { name: '开户并网点 A (沈变本部 10kV 第一开闭所)', accountName: '沈变本部', voltage: '10.22 kV', loadKw: 4680, status: '正常' },
      { name: '开户并网点 B (和新套管 10kV 专用变电所)', accountName: '和新套管', voltage: '10.20 kV', loadKw: 3540, status: '正常' },
      { name: '开户并网点 C (西变互感器 10kV 专用变电所)', accountName: '西变互感器', voltage: '10.25 kV', loadKw: 2450, status: '正常' },
      { name: '园区 10kV 分布式光伏汇集点', accountName: '东北园光伏', voltage: '10.18 kV', loadKw: 4850, status: '正常' },
      { name: '园区 2MW/4MWh 储能电站并网点', accountName: '东北园储能', voltage: '10.20 kV', loadKw: 1200, status: '正常' },
    ],
  },
  park_02: {
    id: 'park_02',
    name: '特变电工南方输变电产业园',
    fullName: '特变电工南方输变电产业园 (衡阳)',
    location: '衡阳市',
    company: '衡变公司主基地',
    loadKw: 11200,
    pvKw: 4200,
    storageKw: 1000,
    pvSavings: '¥85.0 万元/月',
    surplusRevenue: '¥10.8 万元/月',
    totalRevenue: '¥95.8 万元/月',
    greenRate: 37.5,
    voltage: '35.40 kV',
    feedInTariff: '0.450 元/kWh (湖南标杆价)',
    industrialPrice: '0.720 元/kWh',
    pvCapacity: '4.2 MWp',
    pvGenerationKWh: '142.0 万kWh',
    selfUseKWh: '118.0 万kWh',
    gridExportKWh: '24.0 万kWh',
    purchasedGreenElec: '65.0 万kWh',
    gecCertificateCount: 12000,
    gridPoints: [
      { name: '南方产业园 主变并网点 A', accountName: '衡变公司 35kV', voltage: '35.40 kV', loadKw: 5800, status: '正常' },
      { name: '南方产业园 光伏并网点 B', accountName: '衡变光伏 10kV', voltage: '10.15 kV', loadKw: 2200, status: '正常' },
    ],
  },
}

// 模拟绿电/绿证交易凭证台账
interface GreenCertItem {
  id: string
  dealCode: string
  dealType: '直供绿电' | '交易绿电' | '交易绿证(GEC)'
  sourceType: '屋顶光伏' | '集中式风电' | '光伏平价项目' | '自备电厂'
  provider: string
  buyer: string // 购买方 / 消纳企业 (精确到企业级)
  amount: string
  unitPrice: string
  dealDate: string
  certCode: string
  status: '已核销' | '核验中' | '已交割'
}

const INITIAL_CERT_LIST: GreenCertItem[] = [
  { id: '1', dealCode: 'TX-GE-202608-01', dealType: '直供绿电', sourceType: '屋顶光伏', provider: '沈变超高压厂房5.8MWp光伏电站', buyer: '沈变本部', amount: '148.2 万kWh', unitPrice: '0.485 元/kWh', dealDate: '2026-08-20', certCode: 'GEC-2026-SY-88902', status: '已核销' },
  { id: '2', dealCode: 'TX-GE-202608-02', dealType: '交易绿电', sourceType: '集中式风电', provider: '国家电投辽宁康平风电场', buyer: '和新套管公司', amount: '80.1 万kWh', unitPrice: '0.412 元/kWh', dealDate: '2026-08-18', certCode: 'GEC-2026-KP-77312', status: '已交割' },
  { id: '3', dealCode: 'TX-GC-202608-03', dealType: '交易绿证(GEC)', sourceType: '光伏平价项目', provider: '三峡能源新疆哈密200MW光伏项目', buyer: '衡变本部', amount: '18,000 张 (等效1800万kWh)', unitPrice: '15.5 元/张', dealDate: '2026-08-15', certCode: 'CN-GEC-2026-HM-00921', status: '已核销' },
  { id: '4', dealCode: 'TX-GE-202607-04', dealType: '交易绿电', sourceType: '集中式风电', provider: '华能湖南城步风电场', buyer: '超高压公司', amount: '65.0 万kWh', unitPrice: '0.435 元/kWh', dealDate: '2026-07-28', certCode: 'GEC-2026-CB-55421', status: '已核销' },
  { id: '5', dealCode: 'TX-GC-202607-05', dealType: '交易绿证(GEC)', sourceType: '集中式风电', provider: '龙源电力内蒙古风电场', buyer: '鲁缆本部', amount: '12,000 张', unitPrice: '14.8 元/张', dealDate: '2026-07-10', certCode: 'CN-GEC-2026-NM-33120', status: '已核销' },
  { id: '6', dealCode: 'TX-GE-202607-06', dealType: '交易绿电', sourceType: '集中式风电', provider: '华能新疆达坂城风电场', buyer: '特变电工新疆电缆有限公司', amount: '45.6 万kWh', unitPrice: '0.398 元/kWh', dealDate: '2026-07-08', certCode: 'GEC-2026-XJ-66108', status: '已交割' },
  { id: '7', dealCode: 'TX-GE-202606-07', dealType: '直供绿电', sourceType: '屋顶光伏', provider: '德缆智能车间2.8MWp光伏电站', buyer: '特变电工（德阳）电缆股份有限公司', amount: '34.0 万kWh', unitPrice: '0.460 元/kWh', dealDate: '2026-06-25', certCode: 'GEC-2026-DY-55190', status: '已核销' },
]

export default function MicrogridMonitoringPage() {
  const [selectedParkNode, setSelectedParkNode] = useState<StandardOrgNode>({
    id: 'park_root',
    name: '电装集团',
    fullName: '特变电工（电装集团）15 大工业园区',
    level: 'group',
    badge: '全集团汇总',
  })

  // 🌟 选项：'power' (功率) | 'energy' (电量) | 'green' (绿电)
  const [viewMode, setViewMode] = useState<'power' | 'energy' | 'green'>('power')

  // 时间维度与日期
  const [timeDim, setTimeDim] = useState<'day' | 'month'>('day')
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '2026-08-01', end: '2026-08-28' })
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [queryDate, setQueryDate] = useState('2026-08-27')

  // 🌟 绿电卡片联动选态：'trade' (各企业绿电购买数量，默认) | 'pv_gen' (新能源发电量) | 'revenue' (新能源综合收益) | 'rate' (绿电综合消纳率)
  const [activeGreenCard, setActiveGreenCard] = useState<'trade' | 'pv_gen' | 'revenue' | 'rate'>('trade')

  // 表格搜索与绿电弹窗
  const [tableSearchKey, setTableSearchKey] = useState('')
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)
  const [certList, setCertList] = useState<GreenCertItem[]>(INITIAL_CERT_LIST)
  const [newCert, setNewCert] = useState({
    dealType: '交易绿电' as '直供绿电' | '交易绿电' | '交易绿证(GEC)',
    sourceType: '集中式风电' as '屋顶光伏' | '集中式风电' | '光伏平价项目' | '自备电厂',
    provider: '',
    buyer: '沈变本部',
    amount: '',
    unitPrice: '',
    dealDate: '2026-08-28',
    certCode: '',
  })

  const currentParkDetail = useMemo(() => {
    return PARK_GRID_MAP[selectedParkNode.id] || PARK_GRID_MAP['park_01']
  }, [selectedParkNode.id])

  // 15 分钟功率台账
  const detailedLedgerData = useMemo(() => {
    const times = [
      '12:00', '11:45', '11:30', '11:15', '11:00', '10:45', '10:30', '10:15',
      '10:00', '09:45', '09:30', '09:15', '09:00', '08:45', '08:30', '08:15', '08:00'
    ]
    const points = currentParkDetail.gridPoints || []
    const records: Array<{
      id: string
      time: string
      pointName: string
      accountName: string
      loadKw: number
      gridKw: number
      pvKw: number
      storageKw: number
      voltage: string
      cosPhi: string
      status: string
    }> = []

    times.forEach((t, idx) => {
      const p = points[idx % points.length] || points[0]
      const totalL = Math.round(p.loadKw * (0.92 + (idx % 4) * 0.03))
      const isDaytime = parseInt(t.split(':')[0]) >= 8 && parseInt(t.split(':')[0]) <= 17
      const pv = isDaytime ? Math.round(currentParkDetail.pvKw * (0.75 - (idx % 3) * 0.05)) : 0
      const storage = idx % 2 === 0 ? 1200 : -600
      const grid = Math.max(0, totalL - pv - (storage > 0 ? storage : 0))

      records.push({
        id: `rec-${idx + 1}`,
        time: `${queryDate} ${t}:00`,
        pointName: p.name,
        accountName: p.accountName,
        loadKw: totalL,
        gridKw: grid,
        pvKw: pv,
        storageKw: storage,
        voltage: p.voltage,
        cosPhi: (0.97 + (idx % 3) * 0.01).toFixed(2),
        status: '正常',
      })
    })

    return records
  }, [queryDate, currentParkDetail])

  // 🌟 24 小时 15 分钟高频监测点数据生成器 (全天 96 个采样点，每 15 分钟一个监测点)
  const dayTrendData = useMemo(() => {
    const baseLoad = currentParkDetail.loadKw
    const basePv = currentParkDetail.pvKw
    const points: Array<{
      time: string
      园区总负荷: number
      光伏出力: number
      市电受电: number
      储能充放电: number
    }> = []

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        const t = h + m / 60 // 浮点小时数 (0 ~ 23.75)

        // 1. 园区总负荷 (Load): 夜间基础负荷 50~58%，白班 08:30~11:30 与 13:30~17:30 达到高峰 95~102%，午间 11:30~13:00 稍降
        let loadRatio = 0.52
        if (t >= 0 && t < 6) {
          loadRatio = 0.50 + Math.sin(t * 0.5) * 0.04
        } else if (t >= 6 && t < 8.5) {
          loadRatio = 0.55 + ((t - 6) / 2.5) * 0.38
        } else if (t >= 8.5 && t < 11.5) {
          loadRatio = 0.93 + Math.sin((t - 8.5) * 2) * 0.06
        } else if (t >= 11.5 && t < 13) {
          loadRatio = 0.78 + Math.cos((t - 11.5) * 2) * 0.04
        } else if (t >= 13 && t < 17.5) {
          loadRatio = 0.96 + Math.sin((t - 13) * 1.5) * 0.05
        } else if (t >= 17.5 && t < 21) {
          loadRatio = 0.82 - ((t - 17.5) / 3.5) * 0.16
        } else {
          loadRatio = 0.64 - ((t - 21) / 3) * 0.12
        }
        const loadVal = Math.round(baseLoad * loadRatio)

        // 2. 光伏实时出力 (PV): 06:15 开始起发，12:15~13:00 达峰值，19:00 归零
        let pvVal = 0
        if (t >= 6.25 && t <= 18.75) {
          const solarAngle = ((t - 6.25) / 12.5) * Math.PI
          const solarFactor = Math.sin(solarAngle)
          // 叠加 15 分钟高频微云层扰动
          const cloudNoise = 0.96 + Math.sin(t * 7) * 0.03 + Math.cos(t * 13) * 0.02
          pvVal = Math.max(0, Math.round(basePv * solarFactor * cloudNoise))
        }

        // 3. 储能充放电功率 (Storage): 负为充电(谷充/消纳)，正为放电(尖峰顶峰)
        let storageVal = 0
        if (t >= 0 && t < 6) {
          // 夜间谷电充电 -500 ~ -700 kW
          storageVal = -Math.round(500 + Math.sin(t * 1.5) * 150)
        } else if (t >= 8.75 && t < 11.5) {
          // 早高峰放电 +800 ~ +1100 kW
          storageVal = Math.round(850 + Math.sin((t - 8.75) * 2) * 200)
        } else if (t >= 11.75 && t < 13.5 && pvVal > loadVal * 0.4) {
          // 正午光伏大发消纳充电 -600 ~ -800 kW
          storageVal = -Math.round(650 + Math.sin((t - 11.75) * 3) * 150)
        } else if (t >= 18.5 && t < 21) {
          // 晚高峰顶峰放电 +800 ~ +1150 kW
          storageVal = Math.round(900 + Math.sin((t - 18.5) * 2.5) * 220)
        }

        // 4. 市电受电 (Grid Inflow): P_grid = max(0, P_load - P_pv - P_storage)
        const gridVal = Math.max(0, Math.round(loadVal - pvVal - storageVal))

        points.push({
          time: timeStr,
          园区总负荷: loadVal,
          光伏出力: pvVal,
          市电受电: gridVal,
          储能充放电: storageVal,
        })
      }
    }

    return points
  }, [currentParkDetail])

  // 🌟 24 小时 15 分钟高频电量趋势数据 (全天 96 个监测点，每 15 分钟计量电量 kWh)
  const dayEnergyTrendData = useMemo(() => {
    const baseLoad = currentParkDetail.loadKw
    const basePv = currentParkDetail.pvKw
    const points: Array<{
      time: string
      园区总用电: number
      光伏发电: number
      市网购电: number
      储能充放: number
    }> = []

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        const t = h + m / 60

        // 负荷系数
        let loadRatio = 0.52
        if (t >= 0 && t < 6) {
          loadRatio = 0.50 + Math.sin(t * 0.5) * 0.04
        } else if (t >= 6 && t < 8.5) {
          loadRatio = 0.55 + ((t - 6) / 2.5) * 0.38
        } else if (t >= 8.5 && t < 11.5) {
          loadRatio = 0.93 + Math.sin((t - 8.5) * 2) * 0.06
        } else if (t >= 11.5 && t < 13) {
          loadRatio = 0.78 + Math.cos((t - 11.5) * 2) * 0.04
        } else if (t >= 13 && t < 17.5) {
          loadRatio = 0.96 + Math.sin((t - 13) * 1.5) * 0.05
        } else if (t >= 17.5 && t < 21) {
          loadRatio = 0.82 - ((t - 17.5) / 3.5) * 0.16
        } else {
          loadRatio = 0.64 - ((t - 21) / 3) * 0.12
        }
        // 15分钟电量 (kWh) = 功率 (kW) * 0.25h
        const loadKWh = Math.round(baseLoad * loadRatio * 0.25)

        // 光伏 15 分钟发电量 (kWh)
        let pvKWh = 0
        if (t >= 6.25 && t <= 18.75) {
          const solarAngle = ((t - 6.25) / 12.5) * Math.PI
          const solarFactor = Math.sin(solarAngle)
          const cloudNoise = 0.96 + Math.sin(t * 7) * 0.03 + Math.cos(t * 13) * 0.02
          pvKWh = Math.max(0, Math.round(basePv * solarFactor * cloudNoise * 0.25))
        }

        // 储能 15 分钟充放电量 (kWh)
        let storageKWh = 0
        if (t >= 0 && t < 6) {
          storageKWh = -Math.round((500 + Math.sin(t * 1.5) * 150) * 0.25)
        } else if (t >= 8.75 && t < 11.5) {
          storageKWh = Math.round((850 + Math.sin((t - 8.75) * 2) * 200) * 0.25)
        } else if (t >= 11.75 && t < 13.5 && pvKWh > loadKWh * 0.4) {
          storageKWh = -Math.round((650 + Math.sin((t - 11.75) * 3) * 150) * 0.25)
        } else if (t >= 18.5 && t < 21) {
          storageKWh = Math.round((900 + Math.sin((t - 18.5) * 2.5) * 220) * 0.25)
        }

        // 市电购电量 (kWh)
        const gridKWh = Math.max(0, Math.round(loadKWh - pvKWh - storageKWh))

        points.push({
          time: timeStr,
          园区总用电: loadKWh,
          光伏发电: pvKWh,
          市网购电: gridKWh,
          储能充放: storageKWh,
        })
      }
    }

    return points
  }, [currentParkDetail])

  // 🌟 15 分钟电量高频明细台账数据
  const detailedEnergyLedgerData = useMemo(() => {
    const times = [
      '12:00:00', '11:45:00', '11:30:00', '11:15:00', '11:00:00', '10:45:00', '10:30:00', '10:15:00',
      '10:00:00', '09:45:00', '09:30:00', '09:15:00', '09:00:00', '08:45:00', '08:30:00', '08:15:00',
    ]
    return times.map((t, idx) => {
      const hour = parseInt(t.split(':')[0])
      const isDaytime = hour >= 8 && hour <= 18
      const totalEnergy = Math.round((currentParkDetail.loadKw * 0.95 + (16 - idx) * 80) * 0.25)
      const pvEnergy = isDaytime ? Math.round((currentParkDetail.pvKw * 0.82 - idx * 40) * 0.25) : 0
      const storageEnergy = idx % 2 === 0 ? 300 : -200
      const gridEnergy = Math.max(0, totalEnergy - pvEnergy - (storageEnergy > 0 ? storageEnergy : 0))
      const greenRate = totalEnergy > 0 ? ((pvEnergy / totalEnergy) * 100).toFixed(1) + '%' : '0.0%'

      return {
        id: `eng-rec-${idx + 1}`,
        time: `${queryDate} ${t}`,
        totalEnergyKWh: totalEnergy,
        gridEnergyKWh: gridEnergy,
        pvEnergyKWh: pvEnergy,
        storageEnergyKWh: storageEnergy,
        greenRate,
      }
    })
  }, [queryDate, currentParkDetail])

  // 🌟 1. 【各个企业绿电购买数量】时序走势数据 (万kWh)
  const enterpriseGreenTradeTrendData = useMemo(() => {
    return [
      { time: '01月', 沈变本部: 42.5, 衡变本部: 38.0, 超高压公司: 28.5, 鲁缆本部: 32.0, 特变电工新疆电缆: 24.5, 德缆公司: 18.2 },
      { time: '02月', 沈变本部: 45.0, 衡变本部: 41.2, 超高压公司: 30.0, 鲁缆本部: 34.5, 特变电工新疆电缆: 26.0, 德缆公司: 19.5 },
      { time: '03月', 沈变本部: 52.8, 衡变本部: 46.5, 超高压公司: 35.2, 鲁缆本部: 39.0, 特变电工新疆电缆: 31.2, 德缆公司: 23.0 },
      { time: '04月', 沈变本部: 58.0, 衡变本部: 50.4, 超高压公司: 38.6, 鲁缆本部: 42.5, 特变电工新疆电缆: 34.0, 德缆公司: 25.8 },
      { time: '05月', 沈变本部: 65.2, 衡变本部: 56.0, 超高压公司: 44.0, 鲁缆本部: 48.2, 特变电工新疆电缆: 39.5, 德缆公司: 29.4 },
      { time: '06月', 沈变本部: 72.0, 衡变本部: 61.5, 超高压公司: 49.2, 鲁缆本部: 53.0, 特变电工新疆电缆: 43.8, 德缆公司: 32.5 },
      { time: '07月', 沈变本部: 80.1, 衡变本部: 68.2, 超高压公司: 55.0, 鲁缆本部: 58.6, 特变电工新疆电缆: 48.0, 德缆公司: 36.2 },
      { time: '08月', 沈变本部: 80.1, 衡变本部: 65.0, 超高压公司: 52.5, 鲁缆本部: 55.4, 特变电工新疆电缆: 45.6, 德缆公司: 34.0 },
    ]
  }, [])

  // 🌟 2. 【新能源月发电量】发电与消纳时序趋势 (万kWh)
  const pvGenTrendData = useMemo(() => {
    return [
      { time: '01月', 新能源发电量: 142.5, 自发自用电量: 120.2, 余电上网量: 22.3 },
      { time: '02月', 新能源发电量: 155.0, 自发自用电量: 128.5, 余电上网量: 26.5 },
      { time: '03月', 新能源发电量: 168.2, 自发自用电量: 139.0, 余电上网量: 29.2 },
      { time: '04月', 新能源发电量: 175.4, 自发自用电量: 144.1, 余电上网量: 31.3 },
      { time: '05月', 新能源发电量: 188.0, 自发自用电量: 152.0, 余电上网量: 36.0 },
      { time: '06月', 新能源发电量: 195.6, 自发自用电量: 158.4, 余电上网量: 37.2 },
      { time: '07月', 新能源发电量: 202.1, 自发自用电量: 162.8, 余电上网量: 39.3 },
      { time: '08月', 新能源发电量: 182.6, 自发自用电量: 148.2, 余电上网量: 34.4 },
    ]
  }, [])

  // 🌟 3. 【新能源综合收益】时序走势 (万元)
  const revenueTrendData = useMemo(() => {
    return [
      { time: '01月', 综合月收益: 88.5, 自用省电费: 78.2, 上网电费收益: 10.3 },
      { time: '02月', 综合月收益: 95.2, 自用省电费: 83.5, 上网电费收益: 11.7 },
      { time: '03月', 综合月收益: 104.6, 自用省电费: 91.0, 上网电费收益: 13.6 },
      { time: '04月', 综合月收益: 109.8, 自用省电费: 95.2, 上网电费收益: 14.6 },
      { time: '05月', 综合月收益: 118.2, 自用省电费: 101.5, 上网电费收益: 16.7 },
      { time: '06月', 综合月收益: 123.5, 自用省电费: 105.8, 上网电费收益: 17.7 },
      { time: '07月', 综合月收益: 128.0, 自用省电费: 109.2, 上网电费收益: 18.8 },
      { time: '08月', 综合月收益: 113.7, 自用省电费: 100.8, 上网电费收益: 12.9 },
    ]
  }, [])

  // 🌟 4. 【绿电综合消纳率与碳减排】时序走势 (% / tCO2)
  const greenRateTrendData = useMemo(() => {
    return [
      { time: '01月', 绿电综合消纳率: 32.4, 碳减排量: 82.6 },
      { time: '02月', 绿电综合消纳率: 33.8, 碳减排量: 89.9 },
      { time: '03月', 绿电综合消纳率: 35.1, 碳减排量: 97.5 },
      { time: '04月', 绿电综合消纳率: 36.2, 碳减排量: 101.7 },
      { time: '05月', 绿电综合消纳率: 37.8, 碳减排量: 109.0 },
      { time: '06月', 绿电综合消纳率: 38.5, 碳减排量: 113.4 },
      { time: '07月', 绿电综合消纳率: 39.2, 碳减排量: 117.2 },
      { time: '08月', 绿电综合消纳率: 37.5, 碳减排量: 105.9 },
    ]
  }, [])

  const filteredLedger = useMemo(() => {
    return detailedLedgerData.filter((r) => {
      return !tableSearchKey.trim() || r.time.includes(tableSearchKey) || r.pointName.includes(tableSearchKey)
    })
  }, [detailedLedgerData, tableSearchKey])

  const filteredEnergyLedger = useMemo(() => {
    return detailedEnergyLedgerData.filter((r) => {
      return !tableSearchKey.trim() || r.time.includes(tableSearchKey)
    })
  }, [detailedEnergyLedgerData, tableSearchKey])

  const filteredCertList = useMemo(() => {
    return certList.filter((c) => {
      return (
        !tableSearchKey.trim() ||
        c.dealCode.includes(tableSearchKey) ||
        c.provider.includes(tableSearchKey) ||
        (c.buyer && c.buyer.includes(tableSearchKey)) ||
        c.certCode.includes(tableSearchKey)
      )
    })
  }, [certList, tableSearchKey])

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCert.provider || !newCert.buyer || !newCert.amount) {
      alert('请填写完整的提供方、购买方企业与电量/张数信息')
      return
    }
    const created: GreenCertItem = {
      id: String(Date.now()),
      dealCode: `TX-${newCert.dealType === '交易绿证(GEC)' ? 'GC' : 'GE'}-202608-${Math.floor(Math.random() * 90 + 10)}`,
      dealType: newCert.dealType,
      sourceType: newCert.sourceType,
      provider: newCert.provider,
      buyer: newCert.buyer,
      amount: newCert.amount,
      unitPrice: newCert.unitPrice || '0.450 元/kWh',
      dealDate: newCert.dealDate,
      certCode: newCert.certCode || `GEC-2026-${Math.floor(Math.random() * 89999 + 10000)}`,
      status: '已交割',
    }
    setCertList([created, ...certList])
    setIsEntryModalOpen(false)
    setNewCert({
      dealType: '交易绿电',
      sourceType: '集中式风电',
      provider: '',
      buyer: '沈变本部',
      amount: '',
      unitPrice: '',
      dealDate: '2026-08-28',
      certCode: '',
    })
    alert('绿电/绿证交易凭据录入成功，已记入台账！')
  }

  return (
    <div className="flex gap-3.5 items-start">
      {/* 左侧 270px 经典工业级拓扑树 (15个零碳产业园区，展示3级结构但仅可点击至2级) */}
      <StandardOrgTree
        treeType="park"
        maxSelectableLevel={2}
        selectedId={selectedParkNode.id}
        onSelect={(node) => setSelectedParkNode(node)}
      />

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 1. 页面标题 + 功率/电量/绿电 Tab 切换 + 统一时间筛选与导出 */}
        <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="size-5" />
            </div>
            <h1 className="text-base font-bold text-foreground">工业微电网监测</h1>

            {/* 🌟 参照在线监测页规范的 3 大 Tab 栏：功率 / 电量 / 绿电 */}
            <div className="flex items-center bg-panel p-0.5 rounded-lg border border-border text-xs font-medium ml-2">
              <button
                type="button"
                onClick={() => setViewMode('power')}
                className={cn(
                  'px-3 py-1 rounded-md transition-all select-none cursor-pointer',
                  viewMode === 'power'
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                功率
              </button>
              <button
                type="button"
                onClick={() => setViewMode('energy')}
                className={cn(
                  'px-3 py-1 rounded-md transition-all select-none cursor-pointer',
                  viewMode === 'energy'
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                电量
              </button>
              <button
                type="button"
                onClick={() => setViewMode('green')}
                className={cn(
                  'px-3 py-1 rounded-md transition-all select-none cursor-pointer',
                  viewMode === 'green'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                绿电
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 时间维度切换 (日 / 月) */}
            <div className="flex items-center bg-panel p-0.5 rounded-lg border border-border text-xs font-sans">
              <button
                type="button"
                onClick={() => setTimeDim('day')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'day' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                日
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'month' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                月
              </button>
            </div>

            {/* 1. 日维度：日期范围 (最多30天) + 15分钟固定频率 */}
            {timeDim === 'day' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
                  <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                  <input
                    type="date"
                    value={selectedDateRange.start}
                    onChange={(e) => {
                      const newStart = e.target.value
                      let newEnd = selectedDateRange.end
                      const t1 = new Date(newStart).getTime()
                      const t2 = new Date(newEnd).getTime()
                      if (newStart > newEnd || (t2 - t1) / (1000 * 3600 * 24) > 29) {
                        const d = new Date(newStart)
                        d.setDate(d.getDate() + 27)
                        newEnd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                      }
                      setSelectedDateRange({ start: newStart, end: newEnd })
                    }}
                    className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                    title="起始日期 (最多可选30天)"
                  />
                  <span className="text-muted-foreground font-sans">至</span>
                  <input
                    type="date"
                    value={selectedDateRange.end}
                    onChange={(e) => {
                      const newEnd = e.target.value
                      let newStart = selectedDateRange.start
                      const t1 = new Date(newStart).getTime()
                      const t2 = new Date(newEnd).getTime()
                      if (newEnd < newStart || (t2 - t1) / (1000 * 3600 * 24) > 29) {
                        const d = new Date(newEnd)
                        d.setDate(d.getDate() - 27)
                        newStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                      }
                      setSelectedDateRange({ start: newStart, end: newEnd })
                    }}
                    className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                    title="结束日期 (最多可选30天)"
                  />
                </div>
              </div>
            )}

            {/* 2. 月维度：选择指定月份 */}
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
              onClick={() => alert(`正在导出【${currentParkDetail.name}】微电网监测报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 功率监测看板 (viewMode === 'power') */}
        {/* ========================================================================= */}
        {viewMode === 'power' && (
          <>
            {/* 4 项核心功率指标看板 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <Gauge className="size-4 text-muted-foreground" />
                    总负荷
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-panel border border-border font-mono">运行功率</span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {currentParkDetail.loadKw.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-muted-foreground">kW</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>同比</span>
                  <span className="text-rose-400 font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp className="size-3" /> +3.2% ↑
                  </span>
                </div>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <Zap className="size-4 text-primary" />
                    市电负荷
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary border border-primary/30 font-mono font-bold">
                    电网受电
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-primary">
                  {Math.round(currentParkDetail.loadKw * 0.61).toLocaleString()}{' '}
                  <span className="text-xs font-normal text-muted-foreground">kW</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>同比</span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-0.5">
                    <TrendingDown className="size-3" /> -5.8% ↓
                  </span>
                </div>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <Sun className="size-4 text-emerald-400" />
                    光伏出力
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                    发用平衡
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {currentParkDetail.pvKw.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-muted-foreground">kW</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>同比</span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp className="size-3" /> +12.4% ↑
                  </span>
                </div>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <BatteryCharging className="size-4 text-amber-400" />
                    储能充放电功率
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold">
                    削峰填谷
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  {currentParkDetail.storageKw.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-muted-foreground">kW</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>同比</span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp className="size-3" /> +8.1% ↑
                  </span>
                </div>
              </div>
            </div>

            {/* 24 小时源网荷储功率平衡曲线 */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    源网荷储微电网协同平衡曲线
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-sans text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-slate-400" />园区总负荷</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-400" />光伏出力</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary" />市电受电</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-400" />储能充放电</span>
                </div>
              </div>
              <LineTrend
                data={dayTrendData}
                xKey="time"
                height={260}
                yUnit="kW"
                xInterval={7}
                lines={[
                  { key: '园区总负荷', name: '园区总负荷 (kW)', color: '#94a3b8' },
                  { key: '市电受电', name: '市电受电功率 (kW)', color: '#1677ff' },
                  { key: '光伏出力', name: '光伏实时出力 (kW)', color: '#10b981' },
                  { key: '储能充放电', name: '储能充放电 (kW)', color: '#fa8c16' },
                ]}
              />
            </div>

            {/* 15 分钟颗粒度明细台账 */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex flex-wrap items-center justify-between bg-panel/60 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    微电网功率监测明细台账
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="搜索采样时间..."
                      value={tableSearchKey}
                      onChange={(e) => setTableSearchKey(e.target.value)}
                      className="pl-8 pr-3 py-1 bg-panel border border-border rounded-md text-xs font-sans text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`正在导出【${currentParkDetail.name}】15分钟高频功率明细 (Excel)...`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-panel border border-border text-foreground font-medium hover:bg-accent/40 cursor-pointer shadow-2xs text-xs"
                  >
                    <Download className="size-3.5 text-muted-foreground" />
                    <span>导出</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[360px] custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="sticky top-0 bg-panel z-10">
                    <tr className="border-b border-border text-muted-foreground font-semibold font-sans">
                      <th className="py-2.5 px-3">采样时间</th>
                      <th className="py-2.5 px-3">园区总负荷 (kW)</th>
                      <th className="py-2.5 px-3 text-primary">市电受电 (kW)</th>
                      <th className="py-2.5 px-3 text-emerald-400">光伏实时出力 (kW)</th>
                      <th className="py-2.5 px-3 text-amber-400">储能充放 (kW)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {filteredLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-accent/30 transition-colors">
                        <td className="py-2 px-3 font-semibold text-foreground font-sans">{row.time}</td>
                        <td className="py-2 px-3 font-bold text-foreground">{row.loadKw.toLocaleString()}</td>
                        <td className="py-2 px-3 text-primary font-bold">{row.gridKw.toLocaleString()}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{row.pvKw.toLocaleString()}</td>
                        <td className="py-2 px-3 font-bold text-amber-400">
                          {row.storageKw > 0 ? `+${row.storageKw} (放)` : `${row.storageKw} (充)`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 电量监测看板 (viewMode === 'energy') */}
        {/* ========================================================================= */}
        {viewMode === 'energy' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <Zap className="size-4 text-primary" />
                    园区总用电量
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary border border-primary/30 font-mono font-bold">当日累计</span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {(currentParkDetail.loadKw * 18.2).toFixed(0)}{' '}
                  <span className="text-xs font-normal text-muted-foreground">kWh</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>绿色消纳率</span>
                  <span className="text-emerald-400 font-mono font-bold">{currentParkDetail.greenRate}%</span>
                </div>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <Building2 className="size-4 text-muted-foreground" />
                    市电量
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-panel border border-border font-mono font-bold">外购电</span>
                </div>
                <div className="text-2xl font-bold font-mono text-primary">
                  {(currentParkDetail.loadKw * 11.2).toFixed(0)}{' '}
                  <span className="text-xs font-normal text-muted-foreground">kWh</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>占比</span>
                  <span className="text-foreground font-mono font-bold">61.5%</span>
                </div>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <Sun className="size-4 text-emerald-400" />
                    直供绿电量
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">自发自用</span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {(currentParkDetail.pvKw * 6.5).toFixed(0)}{' '}
                  <span className="text-xs font-normal text-muted-foreground">kWh</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>自用占比</span>
                  <span className="text-emerald-400 font-mono font-bold">81.2%</span>
                </div>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <BatteryCharging className="size-4 text-amber-400" />
                    储能系统
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold">充放计量</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                      充电量
                    </div>
                    <div className="text-lg font-bold font-mono text-amber-400 truncate">
                      {Math.round(currentParkDetail.storageKw * 2.2).toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-muted-foreground font-sans">kWh</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                      放电量
                    </div>
                    <div className="text-lg font-bold font-mono text-emerald-400 truncate">
                      {Math.round(currentParkDetail.storageKw * 2.2 * 0.894).toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-muted-foreground font-sans">kWh</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>综合效率</span>
                  <span className="text-emerald-400 font-mono font-bold">89.4%</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    源网荷储微电网用电量统计走势
                  </h3>
                </div>
              </div>
              <LineTrend
                data={dayEnergyTrendData}
                xKey="time"
                height={260}
                yUnit="kWh"
                xInterval={7}
                lines={[
                  { key: '园区总用电', name: '园区总用电量 (kWh)', color: '#94a3b8' },
                  { key: '市网购电', name: '市电量 (kWh)', color: '#1677ff' },
                  { key: '光伏发电', name: '直供绿电量 (kWh)', color: '#10b981' },
                  { key: '储能充放', name: '储能充放电量 (kWh)', color: '#fa8c16' },
                ]}
              />
            </div>

            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex flex-wrap items-center justify-between bg-panel/60 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    微电网电量监测明细台账
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`正在导出【${currentParkDetail.name}】逐小时电量台账 (Excel)...`)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-panel border border-border text-foreground font-medium hover:bg-accent/40 cursor-pointer shadow-2xs text-xs"
                >
                  <Download className="size-3.5 text-muted-foreground" />
                  <span>导出</span>
                </button>
              </div>
              <div className="overflow-x-auto max-h-[360px] custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="sticky top-0 bg-panel z-10">
                    <tr className="border-b border-border text-muted-foreground font-semibold font-sans">
                      <th className="py-2.5 px-3">统计时段</th>
                      <th className="py-2.5 px-3">园区总用电量 (kWh)</th>
                      <th className="py-2.5 px-3 text-primary">市电量 (kWh)</th>
                      <th className="py-2.5 px-3 text-emerald-400">直供绿电量 (kWh)</th>
                      <th className="py-2.5 px-3 text-amber-400">储能充放电量 (kWh)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {filteredEnergyLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-accent/30 transition-colors">
                        <td className="py-2 px-3 font-semibold text-foreground font-sans">{row.time}</td>
                        <td className="py-2 px-3 font-bold text-foreground">{row.totalEnergyKWh.toLocaleString()}</td>
                        <td className="py-2 px-3 text-primary font-bold">{row.gridEnergyKWh.toLocaleString()}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{row.pvEnergyKWh.toLocaleString()}</td>
                        <td className="py-2 px-3 font-bold text-amber-400">
                          {row.storageEnergyKWh > 0 ? `+${row.storageEnergyKWh} (放)` : `${row.storageEnergyKWh} (充)`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}


        {/* ========================================================================= */}
        {/* 🌟 TAB 3: 绿电监测看板 (viewMode === 'green', 点击卡片与下方时序曲线深度联动) */}
        {viewMode === 'green' && (
          <>
            {/* 4 项核心绿电指标看板 (支持点击与下方曲线双向联动，带有选中激活光晕) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 1. 新能源月发电量 */}
              <div
                onClick={() => setActiveGreenCard('pv_gen')}
                className={cn(
                  'bg-card p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'pv_gen'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/10 shadow-sm'
                    : 'border-border hover:border-primary/40 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <Sun className="size-4 text-emerald-400" />
                    新能源月发电量
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                    装机: {currentParkDetail.pvCapacity}
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {currentParkDetail.pvGenerationKWh.replace(' 万kWh', '')}{' '}
                  <span className="text-xs font-normal text-muted-foreground">万kWh</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>自用 / 上网</span>
                  <span className="text-foreground font-mono font-bold">
                    {currentParkDetail.selfUseKWh} / {currentParkDetail.gridExportKWh}
                  </span>
                </div>
              </div>

              {/* 2. 新能源综合收益 */}
              <div
                onClick={() => setActiveGreenCard('revenue')}
                className={cn(
                  'bg-card p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'revenue'
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/10 shadow-sm'
                    : 'border-border hover:border-primary/40 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <DollarSign className="size-4 text-amber-400" />
                    新能源综合收益
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold">
                    自用省钱+创收
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  {currentParkDetail.totalRevenue.replace('¥', '').replace(' 万元/月', '')}{' '}
                  <span className="text-xs font-normal text-muted-foreground">万元/月</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>省电费 / 上网收益</span>
                  <span className="text-foreground font-mono font-bold">
                    {currentParkDetail.pvSavings} / {currentParkDetail.surplusRevenue}
                  </span>
                </div>
              </div>

              {/* 3. 绿电与绿证交易 (核心：点击可查看各个企业的绿电购买数量曲线) */}
              <div
                onClick={() => setActiveGreenCard('trade')}
                className={cn(
                  'bg-card p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'trade'
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/10 shadow-sm'
                    : 'border-border hover:border-primary/40 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <FileText className="size-4 text-primary" />
                    绿电与绿证交易
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary border border-primary/30 font-mono font-bold">
                    各企业购买
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-primary">
                  {currentParkDetail.purchasedGreenElec.replace(' 万kWh', '')}{' '}
                  <span className="text-xs font-normal text-muted-foreground">万kWh</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>GEC 绿证核销</span>
                  <span className="text-foreground font-mono font-bold">
                    {currentParkDetail.gecCertificateCount.toLocaleString()} 张
                  </span>
                </div>
              </div>

              {/* 4. 绿电综合消纳率 */}
              <div
                onClick={() => setActiveGreenCard('rate')}
                className={cn(
                  'bg-card p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'rate'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/10 shadow-sm'
                    : 'border-border hover:border-primary/40 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold flex items-center gap-1.5 text-foreground">
                    <Leaf className="size-4 text-emerald-400" />
                    绿电综合消纳率
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                    直供+交易
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {currentParkDetail.greenRate}{' '}
                  <span className="text-xs font-normal text-muted-foreground">%</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t border-border/60">
                  <span>月度碳减排贡献</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    -{Math.round(parseFloat(currentParkDetail.pvGenerationKWh || '100') * 0.58)} tCO₂
                  </span>
                </div>
              </div>
            </div>

            {/* 🌟 核心时序走势图表 (根据 activeGreenCard 动态联动切换展示对应数据) */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-border/60 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'size-2 rounded-full',
                    activeGreenCard === 'trade' ? 'bg-primary' :
                    activeGreenCard === 'pv_gen' ? 'bg-emerald-400' :
                    activeGreenCard === 'revenue' ? 'bg-amber-400' : 'bg-emerald-500'
                  )} />
                  <h3 className="text-xs font-bold text-foreground">
                    {activeGreenCard === 'trade' && '各个企业月度绿电购买数量走势对比 (万kWh)'}
                    {activeGreenCard === 'pv_gen' && '新能源月度发电量与自发自用/余电上网消纳时序走势 (万kWh)'}
                    {activeGreenCard === 'revenue' && '新能源月度综合收益走势 (省电费收益 vs 余电上网收益 / 万元)'}
                    {activeGreenCard === 'rate' && '绿电综合消纳率与月度等效碳减排贡献时序走势 (% / tCO₂)'}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground font-mono">
                    {activeGreenCard === 'trade' && '按主要企业维度分别统计'}
                    {activeGreenCard === 'pv_gen' && '直供与消纳月度累计'}
                    {activeGreenCard === 'revenue' && '财务综合结算月度统计'}
                    {activeGreenCard === 'rate' && '清洁能源消纳考核口径'}
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`正在导出当前绿电时序曲线数据...`)}
                    className="flex items-center gap-1 text-primary hover:underline font-sans cursor-pointer"
                  >
                    <Download className="size-3" />
                    导出曲线
                  </button>
                </div>
              </div>

              {/* 1. 绿电与绿证交易 -> 显示各个企业的绿电购买数量对比曲线 */}
              {activeGreenCard === 'trade' && (
                <LineTrend
                  data={enterpriseGreenTradeTrendData}
                  xKey="time"
                  height={260}
                  yUnit="万kWh"
                  lines={[
                    { key: '沈变本部', name: '沈变本部 (万kWh)', color: '#1677ff' },
                    { key: '衡变本部', name: '衡变本部 (万kWh)', color: '#10b981' },
                    { key: '超高压公司', name: '超高压公司 (万kWh)', color: '#8b5cf6' },
                    { key: '鲁缆本部', name: '鲁缆本部 (万kWh)', color: '#f59e0b' },
                    { key: '特变电工新疆电缆', name: '特变电工新疆电缆 (万kWh)', color: '#06b6d4' },
                    { key: '德缆公司', name: '德缆公司 (万kWh)', color: '#ec4899' },
                  ]}
                />
              )}

              {/* 2. 新新能源月发电量走势 */}
              {activeGreenCard === 'pv_gen' && (
                <LineTrend
                  data={pvGenTrendData}
                  xKey="time"
                  height={260}
                  yUnit="万kWh"
                  lines={[
                    { key: '新能源发电量', name: '新能源发电量 (万kWh)', color: '#10b981' },
                    { key: '自发自用电量', name: '自发自用电量 (万kWh)', color: '#1677ff' },
                    { key: '余电上网量', name: '余电上网电量 (万kWh)', color: '#fa8c16' },
                  ]}
                />
              )}

              {/* 3. 新能源综合收益走势 */}
              {activeGreenCard === 'revenue' && (
                <LineTrend
                  data={revenueTrendData}
                  xKey="time"
                  height={260}
                  yUnit="万元"
                  lines={[
                    { key: '综合月收益', name: '综合月收益 (万元)', color: '#d97706' },
                    { key: '自用省电费', name: '自用省电费 (万元)', color: '#10b981' },
                    { key: '上网电费收益', name: '上网电费收益 (万元)', color: '#3b82f6' },
                  ]}
                />
              )}

              {/* 4. 绿电消纳率与碳减排 */}
              {activeGreenCard === 'rate' && (
                <LineTrend
                  data={greenRateTrendData}
                  xKey="time"
                  height={260}
                  yUnit="%"
                  lines={[
                    { key: '绿电综合消纳率', name: '绿电综合消纳率 (%)', color: '#10b981' },
                    { key: '碳减排量', name: '等效碳减排量 (tCO₂)', color: '#1677ff' },
                  ]}
                />
              )}
            </div>

            {/* 绿电与绿证交易台账明细 (增加购买方/消纳企业列) */}
            <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-border/60 flex flex-wrap items-center justify-between bg-panel/60 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    直供绿电、交易绿电与绿证交易凭证台账
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="搜索交易单号 / 发电方 / 购买方企业 / 证书..."
                      value={tableSearchKey}
                      onChange={(e) => setTableSearchKey(e.target.value)}
                      className="pl-8 pr-3 py-1 bg-panel border border-border rounded-md text-xs font-sans text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`正在导出【${currentParkDetail.name}】绿电绿证交易台账 (Excel)...`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-panel border border-border text-foreground font-medium hover:bg-accent/40 cursor-pointer shadow-2xs text-xs"
                  >
                    <Download className="size-3.5 text-muted-foreground" />
                    <span>导出</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[360px] custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="sticky top-0 bg-panel z-10">
                    <tr className="border-b border-border text-muted-foreground font-semibold font-sans">
                      <th className="py-2.5 px-3">交易单号</th>
                      <th className="py-2.5 px-3">交易类型</th>
                      <th className="py-2.5 px-3">能源品种</th>
                      <th className="py-2.5 px-3">绿电提供方 / 项目来源</th>
                      <th className="py-2.5 px-3 text-primary font-bold">购买方 / 消纳企业</th>
                      <th className="py-2.5 px-3 font-bold text-emerald-400">核算电量 / 张数</th>
                      <th className="py-2.5 px-3">结算单价</th>
                      <th className="py-2.5 px-3">交易/交割日期</th>
                      <th className="py-2.5 px-3">交割状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {filteredCertList.map((row) => (
                      <tr key={row.id} className="hover:bg-accent/30 transition-colors">
                        <td className="py-2 px-3 font-semibold text-foreground font-sans">{row.dealCode}</td>
                        <td className="py-2 px-3">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-sans font-bold border',
                              row.dealType === '直供绿电'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : row.dealType === '交易绿电'
                                ? 'bg-primary/20 text-primary border-primary/30'
                                : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            )}
                          >
                            {row.dealType}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans text-muted-foreground">{row.sourceType}</td>
                        <td className="py-2 px-3 font-sans text-foreground">{row.provider}</td>
                        <td className="py-2 px-3 font-sans">
                          <span className="inline-flex items-center gap-1 font-bold text-foreground bg-panel px-2 py-0.5 rounded border border-border text-[11px]">
                            <Building2 className="size-3 text-primary" />
                            {row.buyer || '沈变本部'}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-bold text-emerald-400">{row.amount}</td>
                        <td className="py-2 px-3 font-mono">{row.unitPrice}</td>
                        <td className="py-2 px-3 font-sans">{row.dealDate}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-panel border border-border text-muted-foreground font-sans">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 绿电录入模态框 (宽屏舒适双列排版，尺寸适配 max-w-4xl) */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 sm:p-6">
          <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* 模态框 Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-panel shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Plus className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    录入绿电与绿证交易凭据
                  </h3>
                  <p className="text-xs text-muted-foreground font-sans mt-0.5">
                    录入企业分布式绿电直供、市场化交易电量及国家绿色电力证书 (GEC) 核销交易台账
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEntryModalOpen(false)}
                className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 模态框 表单主体 */}
            <form onSubmit={handleSaveCert} className="p-6 space-y-4 text-xs overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* 1. 交易类型 */}
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">
                    交易类型 <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={newCert.dealType}
                    onChange={(e) => setNewCert({ ...newCert, dealType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-xs font-sans cursor-pointer transition-colors"
                  >
                    <option value="交易绿电">交易绿电 (双边市场化交易)</option>
                    <option value="直供绿电">直供绿电 (分布式自发自用)</option>
                    <option value="交易绿证(GEC)">交易绿证(GEC) (国家可再生能源绿证)</option>
                  </select>
                </div>

                {/* 2. 能源发电类型 */}
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">
                    能源发电类型 <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={newCert.sourceType}
                    onChange={(e) => setNewCert({ ...newCert, sourceType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-xs font-sans cursor-pointer transition-colors"
                  >
                    <option value="集中式风电">集中式陆上风电</option>
                    <option value="屋顶光伏">屋顶分布式光伏</option>
                    <option value="光伏平价项目">集中式光伏平价项目</option>
                    <option value="自备电厂">生物质/其他绿电</option>
                  </select>
                </div>

                {/* 3. 绿电提供方 / 项目来源 */}
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">
                    绿电提供方 / 项目来源 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 衡变特高压智造产业园4.2MWp光伏电站"
                    value={newCert.provider}
                    onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
                    className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-xs font-sans transition-colors placeholder:text-muted-foreground"
                    required
                  />
                </div>

                {/* 4. 购买方 / 消纳企业 */}
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">
                    购买方 / 消纳企业 <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={newCert.buyer}
                    onChange={(e) => setNewCert({ ...newCert, buyer: e.target.value })}
                    className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:border-primary cursor-pointer font-sans text-xs transition-colors"
                    required
                  >
                    <option value="">-- 请选择购买消纳企业 (精确到企业级) --</option>
                    <optgroup label="🏢 沈变公司">
                      <option value="沈变本部">沈变本部</option>
                      <option value="露娜公司 (特变电工露娜智能)">露娜公司 (特变电工露娜智能)</option>
                      <option value="智慧能源">智慧能源 (沈变)</option>
                      <option value="和新套管公司">和新套管公司</option>
                      <option value="康嘉互感器">康嘉互感器</option>
                      <option value="印能公司">印能公司</option>
                    </optgroup>
                    <optgroup label="🏢 衡变公司">
                      <option value="衡变本部">衡变本部</option>
                      <option value="南京电研">南京电研</option>
                      <option value="云集电气">云集电气</option>
                      <option value="湖南电气">湖南电气</option>
                      <option value="云集高压开关">云集高压开关</option>
                      <option value="新疆自控">新疆自控</option>
                      <option value="上开">上开</option>
                      <option value="柯贝尔">柯贝尔</option>
                      <option value="特能建">特能建</option>
                      <option value="合容电气">合容电气</option>
                      <option value="赛杰爱迪">赛杰爱迪</option>
                    </optgroup>
                    <optgroup label="🏢 新变厂">
                      <option value="超高压公司">超高压公司</option>
                      <option value="天变公司">天变公司</option>
                      <option value="智能电气公司">智能电气公司</option>
                      <option value="京津冀公司">京津冀公司</option>
                      <option value="珠峰硅钢">珠峰硅钢</option>
                      <option value="智慧能源 (新变)">智慧能源 (新变)</option>
                      <option value="银利电气">银利电气</option>
                    </optgroup>
                    <optgroup label="🏢 鲁缆公司">
                      <option value="鲁缆本部">鲁缆本部</option>
                      <option value="智缆公司">智缆公司</option>
                      <option value="昭和公司">昭和公司</option>
                      <option value="曙光公司">曙光公司</option>
                    </optgroup>
                    <optgroup label="🏢 新缆厂">
                      <option value="特变电工新疆电缆有限公司">特变电工新疆电缆有限公司</option>
                      <option value="特变电工新疆线缆厂">特变电工新疆线缆厂</option>
                    </optgroup>
                    <optgroup label="🏢 德缆公司">
                      <option value="特变电工（德阳）电缆股份有限公司">特变电工（德阳）电缆股份有限公司</option>
                    </optgroup>
                  </select>
                </div>

                {/* 5. 结算电量 / 绿证张数 */}
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">
                    结算电量 / 绿证张数 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 120.5 万kWh 或 15,000 张"
                    value={newCert.amount}
                    onChange={(e) => setNewCert({ ...newCert, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-xs font-mono transition-colors placeholder:font-sans placeholder:text-muted-foreground"
                    required
                  />
                </div>

                {/* 6. 结算单价 */}
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">结算单价</label>
                  <input
                    type="text"
                    placeholder="例如: 0.450 元/kWh 或 15.5 元/张"
                    value={newCert.unitPrice}
                    onChange={(e) => setNewCert({ ...newCert, unitPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-xs font-mono transition-colors placeholder:font-sans placeholder:text-muted-foreground"
                  />
                </div>

                {/* 7. 交易与核销交割日期 */}
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">交易与交割核销日期</label>
                  <input
                    type="date"
                    value={newCert.dealDate}
                    onChange={(e) => setNewCert({ ...newCert, dealDate: e.target.value })}
                    className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-xs font-mono cursor-pointer transition-colors"
                  />
                </div>

                {/* 8. GEC 证书/交割合约编码 */}
                <div>
                  <label className="block text-foreground font-semibold mb-1.5">GEC 证书 / 交割合约编码</label>
                  <input
                    type="text"
                    placeholder="例如: GEC-2026-HB-88902 或 合约编号"
                    value={newCert.certCode}
                    onChange={(e) => setNewCert({ ...newCert, certCode: e.target.value })}
                    className="w-full px-3 py-2 bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-xs font-mono transition-colors placeholder:font-sans placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* 模态框 Footer 操作区 */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border mt-2">
                <span className="text-[11px] text-muted-foreground font-sans flex items-center gap-1">
                  💡 录入凭据将自动记入工业微电网绿电台账，并实时联动测算园区消纳率。
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEntryModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-accent/40 font-semibold cursor-pointer transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Check className="size-4" />
                    <span>确认入账</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


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
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')
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

  // 24 小时功率曲线
  const dayTrendData = useMemo(() => {
    const baseLoad = currentParkDetail.loadKw
    const basePv = currentParkDetail.pvKw
    return [
      { time: '00:00', 园区总负荷: Math.round(baseLoad * 0.55), 光伏出力: 0, 市电受电: Math.round(baseLoad * 0.55), 储能充放电: -500 },
      { time: '03:00', 园区总负荷: Math.round(baseLoad * 0.50), 光伏出力: 0, 市电受电: Math.round(baseLoad * 0.50), 储能充放电: -600 },
      { time: '06:00', 园区总负荷: Math.round(baseLoad * 0.65), 光伏出力: Math.round(basePv * 0.15), 市电受电: Math.round(baseLoad * 0.65 - basePv * 0.15), 储能充放电: 0 },
      { time: '09:00', 园区总负荷: Math.round(baseLoad * 0.90), 光伏出力: Math.round(basePv * 0.70), 市电受电: Math.round(baseLoad * 0.90 - basePv * 0.70), 储能充放电: 300 },
      { time: '12:00', 园区总负荷: baseLoad, 光伏出力: basePv, 市电受电: Math.max(0, baseLoad - basePv - 200), 储能充放电: 960 },
      { time: '15:00', 园区总负荷: Math.round(baseLoad * 0.95), 光伏出力: Math.round(basePv * 0.85), 市电受电: Math.round(baseLoad * 0.95 - basePv * 0.85), 储能充放电: 500 },
      { time: '18:00', 园区总负荷: Math.round(baseLoad * 0.80), 光伏出力: Math.round(basePv * 0.20), 市电受电: Math.round(baseLoad * 0.80 - basePv * 0.20), 储能充放电: -200 },
      { time: '21:00', 园区总负荷: Math.round(baseLoad * 0.65), 光伏出力: 0, 市电受电: Math.round(baseLoad * 0.65), 储能充放电: -400 },
    ]
  }, [currentParkDetail])

  // 24 小时电量趋势数据
  const dayEnergyTrendData = useMemo(() => {
    const baseLoad = currentParkDetail.loadKw
    const basePv = currentParkDetail.pvKw
    return [
      { time: '00:00', 园区总用电: Math.round(baseLoad * 0.55 * 3), 光伏发电: 0, 市网购电: Math.round(baseLoad * 0.55 * 3), 储能充放: -1500 },
      { time: '03:00', 园区总用电: Math.round(baseLoad * 0.50 * 3), 光伏发电: 0, 市网购电: Math.round(baseLoad * 0.50 * 3), 储能充放: -1800 },
      { time: '06:00', 园区总用电: Math.round(baseLoad * 0.65 * 3), 光伏发电: Math.round(basePv * 0.15 * 3), 市网购电: Math.round((baseLoad * 0.65 - basePv * 0.15) * 3), 储能充放: 0 },
      { time: '09:00', 园区总用电: Math.round(baseLoad * 0.90 * 3), 光伏发电: Math.round(basePv * 0.70 * 3), 市网购电: Math.round((baseLoad * 0.90 - basePv * 0.70) * 3), 储能充放: 900 },
      { time: '12:00', 园区总用电: Math.round(baseLoad * 3), 光伏发电: Math.round(basePv * 3), 市网购电: Math.round(Math.max(0, baseLoad - basePv - 200) * 3), 储能充放: 2880 },
      { time: '15:00', 园区总用电: Math.round(baseLoad * 0.95 * 3), 光伏发电: Math.round(basePv * 0.85 * 3), 市网购电: Math.round((baseLoad * 0.95 - basePv * 0.85) * 3), 储能充放: 1500 },
      { time: '18:00', 园区总用电: Math.round(baseLoad * 0.80 * 3), 光伏发电: Math.round(basePv * 0.20 * 3), 市网购电: Math.round((baseLoad * 0.80 - basePv * 0.20) * 3), 储能充放: -600 },
      { time: '21:00', 园区总用电: Math.round(baseLoad * 0.65 * 3), 光伏发电: 0, 市网购电: Math.round(baseLoad * 0.65 * 3), 储能充放: -1200 },
    ]
  }, [currentParkDetail])

  // 逐小时电量明细台账数据
  const detailedEnergyLedgerData = useMemo(() => {
    const times = [
      '12:00', '11:00', '10:00', '09:00', '08:00', '07:00', '06:00', '05:00', '04:00', '03:00', '02:00', '01:00'
    ]
    return times.map((t, idx) => {
      const isDaytime = parseInt(t.split(':')[0]) >= 8 && parseInt(t.split(':')[0]) <= 18
      const totalEnergy = Math.round((currentParkDetail.loadKw * 0.95 + (12 - idx) * 120))
      const pvEnergy = isDaytime ? Math.round((currentParkDetail.pvKw * 0.82 - idx * 60)) : 0
      const storageEnergy = idx % 2 === 0 ? 1200 : -800
      const gridEnergy = Math.max(0, totalEnergy - pvEnergy - (storageEnergy > 0 ? storageEnergy : 0))
      const greenRate = totalEnergy > 0 ? ((pvEnergy / totalEnergy) * 100).toFixed(1) + '%' : '0.0%'

      return {
        id: `eng-rec-${idx + 1}`,
        time: `${queryDate} ${t}:00`,
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
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shrink-0">
              <Zap className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">工业微电网监测</h1>

            {/* 🌟 参照在线监测页规范的 3 大 Tab 栏：功率 / 电量 / 绿电 */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium ml-2">
              <button
                type="button"
                onClick={() => setViewMode('power')}
                className={cn(
                  'px-3 py-1 rounded-md transition-all select-none cursor-pointer',
                  viewMode === 'power'
                    ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
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
                    ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
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
                    ? 'bg-white text-emerald-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                绿电
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 时间维度切换 (月度 / 季度 / 年度) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-sans">
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

            {/* 时间范围选择控件 */}
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
                </select>
              </div>
            )}

            {/* 导出按钮 */}
            <button
              type="button"
              onClick={() => alert(`正在导出【${currentParkDetail.name}】微电网监测报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
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
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Gauge className="size-4 text-slate-600" />
                    总负荷
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 font-mono">运行功率</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {currentParkDetail.loadKw.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-500">kW</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>同比</span>
                  <span className="text-rose-600 font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp className="size-3" /> +3.2% ↑
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Zap className="size-4 text-[#1677ff]" />
                    市电负荷
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-mono font-bold">
                    电网受电
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#1677ff]">
                  {Math.round(currentParkDetail.loadKw * 0.61).toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-500">kW</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>同比</span>
                  <span className="text-emerald-600 font-mono font-bold flex items-center gap-0.5">
                    <TrendingDown className="size-3" /> -5.8% ↓
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Sun className="size-4 text-emerald-500" />
                    光伏出力
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-600 font-mono font-bold">
                    发用平衡
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-600">
                  {currentParkDetail.pvKw.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-500">kW</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>同比</span>
                  <span className="text-emerald-600 font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp className="size-3" /> +12.4% ↑
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <BatteryCharging className="size-4 text-amber-500" />
                    储能充放电功率
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-600 font-mono font-bold">
                    削峰填谷
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-600">
                  {currentParkDetail.storageKw.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-500">kW</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>同比</span>
                  <span className="text-emerald-600 font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp className="size-3" /> +8.1% ↑
                  </span>
                </div>
              </div>
            </div>

            {/* 24 小时源网荷储功率平衡曲线 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#1677ff]" />
                  <h3 className="text-xs font-bold text-slate-900">
                    24 小时源网荷储微电网协同平衡曲线 (实时 / kW)
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-sans text-slate-500">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-slate-800" />园区总负荷</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" />光伏出力</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#1677ff]" />市电受电</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" />储能充放电</span>
                </div>
              </div>
              <LineTrend
                data={dayTrendData}
                xKey="time"
                height={260}
                yUnit="kW"
                lines={[
                  { key: '园区总负荷', name: '园区总负荷 (kW)', color: '#1e293b' },
                  { key: '市电受电', name: '市电受电功率 (kW)', color: '#1677ff' },
                  { key: '光伏出力', name: '光伏实时出力 (kW)', color: '#10b981' },
                  { key: '储能充放电', name: '储能充放电 (kW)', color: '#fa8c16' },
                ]}
              />
            </div>

            {/* 15 分钟颗粒度明细台账 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/80 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#1677ff]" />
                  <h3 className="text-xs font-bold text-slate-800">
                    15 分钟高频功率监测明细台账
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="搜索采样时间 / 并网点..."
                      value={tableSearchKey}
                      onChange={(e) => setTableSearchKey(e.target.value)}
                      className="pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1677ff]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`正在导出【${currentParkDetail.name}】15分钟高频功率明细 (Excel)...`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer shadow-2xs text-xs"
                  >
                    <Download className="size-3.5 text-slate-500" />
                    <span>导出</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[360px] custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="sticky top-0 bg-slate-100 z-10">
                    <tr className="border-b border-slate-200 text-slate-700 font-semibold font-sans">
                      <th className="py-2.5 px-3">采样时间</th>
                      <th className="py-2.5 px-3">开户并网点名称</th>
                      <th className="py-2.5 px-3">园区总负荷 (kW)</th>
                      <th className="py-2.5 px-3 text-[#1677ff]">市电受电 (kW)</th>
                      <th className="py-2.5 px-3 text-emerald-600">光伏实时出力 (kW)</th>
                      <th className="py-2.5 px-3 text-amber-600">储能充放 (kW)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-900 font-sans">{row.time}</td>
                        <td className="py-2 px-3 font-sans">{row.pointName}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{row.loadKw.toLocaleString()}</td>
                        <td className="py-2 px-3 text-[#1677ff] font-bold">{row.gridKw.toLocaleString()}</td>
                        <td className="py-2 px-3 text-emerald-600 font-bold">{row.pvKw.toLocaleString()}</td>
                        <td className="py-2 px-3 font-bold text-amber-600">
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
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Zap className="size-4 text-blue-600" />
                    园区总用电量
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-mono font-bold">当日累计</span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {(currentParkDetail.loadKw * 18.2).toFixed(0)}{' '}
                  <span className="text-xs font-normal text-slate-500">kWh</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>绿色消纳率</span>
                  <span className="text-emerald-600 font-mono font-bold">{currentParkDetail.greenRate}%</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Building2 className="size-4 text-slate-600" />
                    市网购电量
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 font-mono font-bold">外购电</span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#1677ff]">
                  {(currentParkDetail.loadKw * 11.2).toFixed(0)}{' '}
                  <span className="text-xs font-normal text-slate-500">kWh</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>占比</span>
                  <span className="text-slate-700 font-mono font-bold">61.5%</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Sun className="size-4 text-emerald-500" />
                    光伏发电量
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-600 font-mono font-bold">自发自用</span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-600">
                  {(currentParkDetail.pvKw * 6.5).toFixed(0)}{' '}
                  <span className="text-xs font-normal text-slate-500">kWh</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>自用占比</span>
                  <span className="text-emerald-600 font-mono font-bold">81.2%</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <BatteryCharging className="size-4 text-amber-500" />
                    储能充放电量
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-600 font-mono font-bold">循环吞吐</span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-600">
                  {(currentParkDetail.storageKw * 4.0).toFixed(0)}{' '}
                  <span className="text-xs font-normal text-slate-500">kWh</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>充放效率</span>
                  <span className="text-emerald-600 font-mono font-bold">89.4%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-900">
                    24 小时微电网电量统计走势 (kWh)
                  </h3>
                </div>
              </div>
              <LineTrend
                data={dayEnergyTrendData}
                xKey="time"
                height={260}
                yUnit="kWh"
                lines={[
                  { key: '园区总用电', name: '园区总用电量 (kWh)', color: '#1e293b' },
                  { key: '市网购电', name: '市网购电量 (kWh)', color: '#1677ff' },
                  { key: '光伏发电', name: '光伏发电量 (kWh)', color: '#10b981' },
                  { key: '储能充放', name: '储能充放电量 (kWh)', color: '#fa8c16' },
                ]}
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/80 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-500" />
                  <h3 className="text-xs font-bold text-slate-800">
                    逐小时微电网电量明细台账
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`正在导出【${currentParkDetail.name}】逐小时电量台账 (Excel)...`)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer shadow-2xs text-xs"
                >
                  <Download className="size-3.5 text-slate-500" />
                  <span>导出</span>
                </button>
              </div>
              <div className="overflow-x-auto max-h-[360px] custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="sticky top-0 bg-slate-100 z-10">
                    <tr className="border-b border-slate-200 text-slate-700 font-semibold font-sans">
                      <th className="py-2.5 px-3">统计时段</th>
                      <th className="py-2.5 px-3">园区总用电量 (kWh)</th>
                      <th className="py-2.5 px-3 text-[#1677ff]">市网购电量 (kWh)</th>
                      <th className="py-2.5 px-3 text-emerald-600">光伏发电量 (kWh)</th>
                      <th className="py-2.5 px-3 text-amber-600">储能充放电量 (kWh)</th>
                      <th className="py-2.5 px-3">实时绿电消纳率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredEnergyLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-900 font-sans">{row.time}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{row.totalEnergyKWh.toLocaleString()}</td>
                        <td className="py-2 px-3 text-[#1677ff] font-bold">{row.gridEnergyKWh.toLocaleString()}</td>
                        <td className="py-2 px-3 text-emerald-600 font-bold">{row.pvEnergyKWh.toLocaleString()}</td>
                        <td className="py-2 px-3 text-amber-600 font-bold">
                          {row.storageEnergyKWh > 0 ? `+${row.storageEnergyKWh} (放)` : `${row.storageEnergyKWh} (充)`}
                        </td>
                        <td className="py-2 px-3 font-extrabold text-emerald-700">{row.greenRate}</td>
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
                  'bg-white p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'pv_gen'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Sun className="size-4 text-emerald-500" />
                    新能源月发电量
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-600 font-mono font-bold">
                    装机: {currentParkDetail.pvCapacity}
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {currentParkDetail.pvGenerationKWh.replace(' 万kWh', '')}{' '}
                  <span className="text-xs font-normal text-slate-500">万kWh</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>自用 / 上网</span>
                  <span className="text-slate-700 font-mono font-bold">
                    {currentParkDetail.selfUseKWh} / {currentParkDetail.gridExportKWh}
                  </span>
                </div>
              </div>

              {/* 2. 新能源综合收益 */}
              <div
                onClick={() => setActiveGreenCard('revenue')}
                className={cn(
                  'bg-white p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'revenue'
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <DollarSign className="size-4 text-amber-500" />
                    新能源综合收益
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-600 font-mono font-bold">
                    自用省钱+创收
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-600">
                  {currentParkDetail.totalRevenue.replace('¥', '').replace(' 万元/月', '')}{' '}
                  <span className="text-xs font-normal text-slate-500">万元/月</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>省电费 / 上网收益</span>
                  <span className="text-slate-700 font-mono font-bold">
                    {currentParkDetail.pvSavings} / {currentParkDetail.surplusRevenue}
                  </span>
                </div>
              </div>

              {/* 3. 绿电与绿证交易 (核心：点击可查看各个企业的绿电购买数量曲线) */}
              <div
                onClick={() => setActiveGreenCard('trade')}
                className={cn(
                  'bg-white p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'trade'
                    ? 'border-[#1677ff] ring-2 ring-blue-500/20 bg-blue-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <FileText className="size-4 text-blue-600" />
                    绿电与绿证交易
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#1677ff] font-mono font-bold">
                    各企业购买
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#1677ff]">
                  {currentParkDetail.purchasedGreenElec.replace(' 万kWh', '')}{' '}
                  <span className="text-xs font-normal text-slate-500">万kWh</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>GEC 绿证核销</span>
                  <span className="text-slate-700 font-mono font-bold">
                    {currentParkDetail.gecCertificateCount.toLocaleString()} 张
                  </span>
                </div>
              </div>

              {/* 4. 绿电综合消纳率 */}
              <div
                onClick={() => setActiveGreenCard('rate')}
                className={cn(
                  'bg-white p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'rate'
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Leaf className="size-4 text-emerald-600" />
                    绿电综合消纳率
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-600 font-mono font-bold">
                    直供+交易
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-600">
                  {currentParkDetail.greenRate}{' '}
                  <span className="text-xs font-normal text-slate-500">%</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>月度碳减排贡献</span>
                  <span className="text-emerald-600 font-mono font-bold">
                    -{Math.round(parseFloat(currentParkDetail.pvGenerationKWh || '100') * 0.58)} tCO₂
                  </span>
                </div>
              </div>
            </div>

            {/* 🌟 核心时序走势图表 (根据 activeGreenCard 动态联动切换展示对应数据) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'size-2 rounded-full',
                    activeGreenCard === 'trade' ? 'bg-[#1677ff]' :
                    activeGreenCard === 'pv_gen' ? 'bg-emerald-500' :
                    activeGreenCard === 'revenue' ? 'bg-amber-500' : 'bg-emerald-600'
                  )} />
                  <h3 className="text-xs font-bold text-slate-900">
                    {activeGreenCard === 'trade' && '各个企业月度绿电购买数量走势对比 (万kWh)'}
                    {activeGreenCard === 'pv_gen' && '新能源月度发电量与自发自用/余电上网消纳时序走势 (万kWh)'}
                    {activeGreenCard === 'revenue' && '新能源月度综合收益走势 (省电费收益 vs 余电上网收益 / 万元)'}
                    {activeGreenCard === 'rate' && '绿电综合消纳率与月度等效碳减排贡献时序走势 (% / tCO₂)'}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 font-mono">
                    {activeGreenCard === 'trade' && '按主要企业维度分别统计'}
                    {activeGreenCard === 'pv_gen' && '直供与消纳月度累计'}
                    {activeGreenCard === 'revenue' && '财务综合结算月度统计'}
                    {activeGreenCard === 'rate' && '清洁能源消纳考核口径'}
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`正在导出当前绿电时序曲线数据...`)}
                    className="flex items-center gap-1 text-[#1677ff] hover:underline font-sans cursor-pointer"
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

              {/* 2. 新能源月发电量走势 */}
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
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/80 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800">
                    直供绿电、交易绿电与绿证交易凭证台账
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEntryModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer shadow-2xs text-xs"
                  >
                    <Plus className="size-3.5" />
                    <span>录入凭证</span>
                  </button>
                  <div className="relative">
                    <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="搜索交易单号 / 发电方 / 购买方企业 / 证书..."
                      value={tableSearchKey}
                      onChange={(e) => setTableSearchKey(e.target.value)}
                      className="pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1677ff]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`正在导出【${currentParkDetail.name}】绿电绿证交易台账 (Excel)...`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer shadow-2xs text-xs"
                  >
                    <Download className="size-3.5 text-slate-500" />
                    <span>导出</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[360px] custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="sticky top-0 bg-slate-100 z-10">
                    <tr className="border-b border-slate-200 text-slate-700 font-semibold font-sans">
                      <th className="py-2.5 px-3">交易单号</th>
                      <th className="py-2.5 px-3">交易类型</th>
                      <th className="py-2.5 px-3">能源品种</th>
                      <th className="py-2.5 px-3">绿电提供方 / 项目来源</th>
                      <th className="py-2.5 px-3 text-[#1677ff] font-bold">购买方 / 消纳企业</th>
                      <th className="py-2.5 px-3 font-bold text-emerald-600">核算电量 / 张数</th>
                      <th className="py-2.5 px-3">结算单价</th>
                      <th className="py-2.5 px-3">交易/交割日期</th>
                      <th className="py-2.5 px-3">GEC凭证/合约编码</th>
                      <th className="py-2.5 px-3">交割状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredCertList.map((row) => (
                      <tr key={row.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-900 font-sans">{row.dealCode}</td>
                        <td className="py-2 px-3">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-sans font-bold',
                              row.dealType === '直供绿电'
                                ? 'bg-emerald-50 text-emerald-700'
                                : row.dealType === '交易绿电'
                                ? 'bg-blue-50 text-[#1677ff]'
                                : 'bg-purple-50 text-purple-700'
                            )}
                          >
                            {row.dealType}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-600">{row.sourceType}</td>
                        <td className="py-2 px-3 font-sans text-slate-800">{row.provider}</td>
                        <td className="py-2 px-3 font-sans">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200/60 text-[11px]">
                            <Building2 className="size-3 text-[#1677ff]" />
                            {row.buyer || '沈变本部'}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-bold text-emerald-700">{row.amount}</td>
                        <td className="py-2 px-3 font-mono">{row.unitPrice}</td>
                        <td className="py-2 px-3 font-sans">{row.dealDate}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{row.certCode}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-sans">
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

      {/* 绿电录入模态框 */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="size-4 text-emerald-600" />
                录入绿电与绿证交易凭据
              </h3>
              <button
                type="button"
                onClick={() => setIsEntryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCert} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">交易类型</label>
                  <select
                    value={newCert.dealType}
                    onChange={(e) => setNewCert({ ...newCert, dealType: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="直供绿电">直供绿电 (分布式自发自用)</option>
                    <option value="交易绿电">交易绿电 (双边市场化交易)</option>
                    <option value="交易绿证(GEC)">交易绿证(GEC) (国家可再生能源绿证)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">能源发电类型</label>
                  <select
                    value={newCert.sourceType}
                    onChange={(e) => setNewCert({ ...newCert, sourceType: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="屋顶光伏">屋顶分布式光伏</option>
                    <option value="集中式风电">集中式陆上风电</option>
                    <option value="光伏平价项目">集中式光伏平价项目</option>
                    <option value="自备电厂">生物质/其他绿电</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">绿电提供方 / 项目来源</label>
                <input
                  type="text"
                  placeholder="例如: 衡变特高压智造产业园4.2MWp光伏电站"
                  value={newCert.provider}
                  onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  购买方 / 消纳企业 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newCert.buyer}
                  onChange={(e) => setNewCert({ ...newCert, buyer: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer font-sans"
                  required
                >
                  <option value="">-- 请选择购买消纳企业 (精确到企业级) --</option>
                  <optgroup label="🏢 沈变公司">
                    <option value="沈变本部">沈变本部</option>
                    <option value="露娜公司 (特变电工露娜智能)">露娜公司 (特变电工露娜智能)</option>
                    <option value="智慧能源">智慧能源</option>
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
                    <option value="智慧能源">智慧能源</option>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">结算电量 / 绿证张数</label>
                  <input
                    type="text"
                    placeholder="例如: 120.5 万kWh 或 15,000 张"
                    value={newCert.amount}
                    onChange={(e) => setNewCert({ ...newCert, amount: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">结算单价</label>
                  <input
                    type="text"
                    placeholder="例如: 0.450 元/kWh"
                    value={newCert.unitPrice}
                    onChange={(e) => setNewCert({ ...newCert, unitPrice: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">交易与核销日期</label>
                  <input
                    type="date"
                    value={newCert.dealDate}
                    onChange={(e) => setNewCert({ ...newCert, dealDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">GEC 证书/交割合约编码</label>
                  <input
                    type="text"
                    placeholder="GEC-2026-HB-XXXX"
                    value={newCert.certCode}
                    onChange={(e) => setNewCert({ ...newCert, certCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  确认入账
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

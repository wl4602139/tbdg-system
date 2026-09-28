'use client'

import React, { useState, useMemo, useEffect } from 'react'
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
  Award,
  DollarSign,
  CheckCircle2,
  Activity,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { ExportButton } from '@/components/shared/primitives'
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
  totalPowerKWh?: string
  greenVsGridKWh?: string
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
    totalPowerKWh: '2,850.6 万kWh',
    greenVsGridKWh: '1,400.7 / 1,449.9 万kWh',
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
    totalPowerKWh: '456.2 万kWh',
    greenVsGridKWh: '228.3 / 227.9 万kWh',
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
    totalPowerKWh: '382.5 万kWh',
    greenVsGridKWh: '183.0 / 199.5 万kWh',
    gridPoints: [
      { name: '南方产业园 主变并网点 A', accountName: '衡变公司 35kV', voltage: '35.40 kV', loadKw: 5800, status: '正常' },
      { name: '南方产业园 光伏并网点 B', accountName: '衡变光伏 10kV', voltage: '10.15 kV', loadKw: 2200, status: '正常' },
    ],
  },
}

// 模拟绿电/绿证交易凭证台账
interface GreenCertItem {
  id: string
  dealCode?: string
  dealType: '光伏自用' | '购买绿电' | '购买绿证' | '直供绿电' | '交易绿电' | '交易绿证(GEC)'
  sourceType?: string
  provider: string
  buyer: string // 购买方 / 消纳企业 (精确到企业级)
  amount: string
  unitPrice?: string
  dealDate?: string
  certCode?: string
  status?: string
}

const INITIAL_CERT_LIST: GreenCertItem[] = [
  { id: '1', dealCode: 'TX-GE-202608-01', dealType: '光伏自用', sourceType: '屋顶光伏', provider: '沈变超高压厂房5.8MWp光伏电站', buyer: '沈变本部', amount: '148.2 万kWh', unitPrice: '0.485 元/kWh', dealDate: '2026-08-20', certCode: 'GEC-2026-SY-88902', status: '已核销' },
  { id: '2', dealCode: 'TX-GE-202608-02', dealType: '购买绿电', sourceType: '集中式风电', provider: '国家电投辽宁康平风电场', buyer: '和新套管公司', amount: '80.1 万kWh', unitPrice: '0.412 元/kWh', dealDate: '2026-08-18', certCode: 'GEC-2026-KP-77312', status: '已交割' },
  { id: '3', dealCode: 'TX-GC-202608-03', dealType: '购买绿证', sourceType: '光伏平价项目', provider: '三峡能源新疆哈密200MW光伏项目', buyer: '衡变本部', amount: '18,000 张', unitPrice: '15.5 元/张', dealDate: '2026-08-15', certCode: 'CN-GEC-2026-HM-00921', status: '已核销' },
  { id: '4', dealCode: 'TX-GE-202607-04', dealType: '购买绿电', sourceType: '集中式风电', provider: '华能湖南城步风电场', buyer: '超高压公司', amount: '65.0 万kWh', unitPrice: '0.435 元/kWh', dealDate: '2026-07-28', certCode: 'GEC-2026-CB-55421', status: '已核销' },
  { id: '5', dealCode: 'TX-GC-202607-05', dealType: '购买绿证', sourceType: '集中式风电', provider: '龙源电力内蒙古风电场', buyer: '鲁缆本部', amount: '12,000 张', unitPrice: '14.8 元/张', dealDate: '2026-07-10', certCode: 'CN-GEC-2026-NM-33120', status: '已核销' },
  { id: '6', dealCode: 'TX-GE-202607-06', dealType: '购买绿电', sourceType: '集中式风电', provider: '华能新疆达坂城风电场', buyer: '特变电工新疆电缆有限公司', amount: '45.6 万kWh', unitPrice: '0.398 元/kWh', dealDate: '2026-07-08', certCode: 'GEC-2026-XJ-66108', status: '已交割' },
  { id: '7', dealCode: 'TX-GE-202606-07', dealType: '光伏自用', sourceType: '屋顶光伏', provider: '德缆智能车间2.8MWp光伏电站', buyer: '特变电工（德阳）电缆股份有限公司', amount: '34.0 万kWh', unitPrice: '0.460 元/kWh', dealDate: '2026-06-25', certCode: 'GEC-2026-DY-55190', status: '已核销' },
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

  // 时间维度与日期：'day' (日) | 'month' (月) | 'custom' (自定义)
  const [timeDim, setTimeDim] = useState<'day' | 'month' | 'custom'>('day')
  const [selectedDate, setSelectedDate] = useState('2026-08-28')
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [dateRange, setDateRange] = useState({ start: '2026-08-01', end: '2026-08-28' })
  const [queryDate, setQueryDate] = useState('2026-08-27')

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

  // 🌟 功率监测采样步长控制：'15m' (15分钟) | '1h' (1小时) | '1d' (1天)，选择月份时默认按天进行显示
  const [powerSamplingStep, setPowerSamplingStep] = useState<'15m' | '1h' | '1d'>('1d')
  const [ledgerDayFilter, setLedgerDayFilter] = useState<'all' | string>('all')

  // 当时间维度、步长、月份或区间切换时，重置台账日期过滤为全周期平铺
  useEffect(() => {
    setLedgerDayFilter('all')
  }, [timeDim, powerSamplingStep, selectedMonth, dateRange])

  // 🌟 选择月份时默认按天进行显示 (响应用户明确指令)
  useEffect(() => {
    if (timeDim === 'month') {
      setPowerSamplingStep('1d')
    }
  }, [timeDim, selectedMonth])

  // 🌟 绿电监测维度规则：时间控件不要日，自动切换至月度
  useEffect(() => {
    if (viewMode === 'green' && timeDim === 'day') {
      setTimeDim('month')
    }
  }, [viewMode, timeDim])

  // 🌟 绿电卡片联动选态：'total_power' (总用电量) | 'physical_green' (物理认定绿电) | 'trade' (购买绿电量) | 'cert' (购买绿证量)
  const [activeGreenCard, setActiveGreenCard] = useState<'total_power' | 'physical_green' | 'cert' | 'trade'>('total_power')

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

  // 🌟 当前有效查询日期 (日维度取选定单日，月维度取该月28日，自定义取区间结束日)
  const effectiveDate = useMemo(() => {
    if (timeDim === 'day') return selectedDate
    if (timeDim === 'month') return `${selectedMonth}-28`
    return dateRange.end
  }, [timeDim, selectedDate, selectedMonth, dateRange.end])

  // 🌟 根据选定日期动态生成工业负荷与光照真实波动因子 (工作日满负荷/周末微降/日照波动)
  const dateFluctuation = useMemo(() => {
    const parts = effectiveDate.split('-').map(Number)
    const day = parts[2] || 28
    const month = parts[1] || 8
    const isWeekend = (day % 7 === 0 || day % 7 === 6)
    const loadMult = isWeekend ? 0.88 : Number((1.0 + ((day % 5) - 2) * 0.018).toFixed(3))
    const pvMult = Number((1.0 + ((day % 4) - 1.5) * 0.035).toFixed(3))
    return { loadMult, pvMult, day, month }
  }, [effectiveDate])

  const currentParkDetail = useMemo(() => {
    const base = PARK_GRID_MAP[selectedParkNode.id] || PARK_GRID_MAP['park_01']
    const scaledLoad = Math.round(base.loadKw * dateFluctuation.loadMult)
    const scaledPv = Math.round(base.pvKw * dateFluctuation.pvMult)
    const grid = Math.max(0, scaledLoad - scaledPv - (base.storageKw > 0 ? base.storageKw : 0))
    return {
      ...base,
      loadKw: scaledLoad,
      gridKw: grid,
      pvKw: scaledPv,
    }
  }, [selectedParkNode.id, dateFluctuation])

  // 🌟 解析选定月份的年份、月份与该月实际天数
  const { monthYear, monthNum, monthMaxDays } = useMemo(() => {
    const parts = (selectedMonth || '2026-08').split('-').map(Number)
    const y = parts[0] || 2026
    const m = parts[1] || 8
    const daysInM = (y === 2026 && m === 8) ? 28 : new Date(y, m, 0).getDate()
    return { monthYear: y, monthNum: m, monthMaxDays: daysInM }
  }, [selectedMonth])

  // 🌟 自定义区间的跨越天数
  const customDays = useMemo(() => {
    return getDaysDiff(dateRange.start, dateRange.end)
  }, [dateRange.start, dateRange.end])

  // 🌟 统一微电网功率明细台账适配器 (随日/月/自定义维度自适应：日=15分钟, 月=日, 自定义=日)
  const displayedPowerLedger = useMemo(() => {
    if (timeDim === 'day') {
      const records: Array<{
        id: string
        time: string
        loadKw: number
        gridKw: number
        pvKw: number
        storageKw: number
      }> = []
      // 15分钟高频台账：从 23:45 倒序至 00:00 (共 96 个监测点)
      for (let h = 23; h >= 0; h--) {
        for (let m = 45; m >= 0; m -= 15) {
          const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
          const t = h + m / 60
          let loadRatio = 0.52
          if (t >= 0 && t < 6) loadRatio = 0.50 + Math.sin(t * 0.5) * 0.04
          else if (t >= 6 && t < 8.5) loadRatio = 0.55 + ((t - 6) / 2.5) * 0.38
          else if (t >= 8.5 && t < 11.5) loadRatio = 0.93 + Math.sin((t - 8.5) * 2) * 0.06
          else if (t >= 11.5 && t < 13) loadRatio = 0.78 + Math.cos((t - 11.5) * 2) * 0.04
          else if (t >= 13 && t < 17.5) loadRatio = 0.96 + Math.sin((t - 13) * 1.5) * 0.05
          else if (t >= 17.5 && t < 21) loadRatio = 0.82 - ((t - 17.5) / 3.5) * 0.16
          else loadRatio = 0.64 - ((t - 21) / 3) * 0.12

          const loadVal = Math.round(currentParkDetail.loadKw * loadRatio)
          let pvVal = 0
          if (t >= 6.25 && t <= 18.75) {
            pvVal = Math.max(0, Math.round(currentParkDetail.pvKw * Math.sin(((t - 6.25) / 12.5) * Math.PI) * (0.96 + Math.sin(t * 7) * 0.03)))
          }
          let storageVal = 0
          if (t >= 0 && t < 6) storageVal = -Math.round(550)
          else if (t >= 8.75 && t < 11.5) storageVal = Math.round(900)
          else if (t >= 11.75 && t < 13.5 && pvVal > loadVal * 0.4) storageVal = -Math.round(650)
          else if (t >= 18.5 && t < 21) storageVal = Math.round(950)

          const gridVal = Math.max(0, loadVal - pvVal - (storageVal > 0 ? storageVal : 0))

          records.push({
            id: `pwr-${h}-${m}`,
            time: `${effectiveDate} ${timeStr}`,
            loadKw: loadVal,
            gridKw: gridVal,
            pvKw: pvVal,
            storageKw: storageVal,
          })
        }
      }
      return records
    }

    if (timeDim === 'custom') {
      const records: Array<{
        id: string
        time: string
        loadKw: number
        gridKw: number
        pvKw: number
        storageKw: number
      }> = []
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      const cur = new Date(end)
      let idx = 0
      while (cur >= start && idx < 31) {
        const yStr = cur.getFullYear()
        const mStr = String(cur.getMonth() + 1).padStart(2, '0')
        const dStr = String(cur.getDate()).padStart(2, '0')
        const fullDate = `${yStr}-${mStr}-${dStr}`
        const isWeekend = cur.getDay() === 0 || cur.getDay() === 6
        const factor = isWeekend ? 0.88 : 1 + Math.sin(idx * 0.6) * 0.08
        const totalKw = Math.round(currentParkDetail.loadKw * factor)
        const pvKw = Math.round(currentParkDetail.pvKw * (0.85 + Math.cos(idx * 0.4) * 0.1))
        const storageKw = Math.round(currentParkDetail.storageKw * 1.0)
        const gridKw = Math.max(0, totalKw - pvKw)

        records.push({
          id: `pwr-custom-${idx}`,
          time: fullDate,
          loadKw: totalKw,
          gridKw: gridKw,
          pvKw: pvKw,
          storageKw: storageKw,
        })
        cur.setDate(cur.getDate() - 1)
        idx++
      }
      return records
    }

    // month 维度：当月各日倒序台账 (日颗粒度)
    const records: Array<{
      id: string
      time: string
      loadKw: number
      gridKw: number
      pvKw: number
      storageKw: number
    }> = []
    for (let d = monthMaxDays; d >= 1; d--) {
      const dayStr = `${selectedMonth}-${String(d).padStart(2, '0')}`
      const dayOfWeek = new Date(monthYear, monthNum - 1, d).getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const factor = isWeekend ? 0.88 : 1 + Math.sin(d * 0.45) * 0.08
      const totalKw = Math.round(currentParkDetail.loadKw * factor)
      const pvKw = Math.round(currentParkDetail.pvKw * (0.85 + Math.cos(d * 0.35) * 0.1))
      const storageKw = Math.round(currentParkDetail.storageKw * 1.0)
      const gridKw = Math.max(0, totalKw - pvKw)

      records.push({
        id: `pwr-month-${d}`,
        time: dayStr,
        loadKw: totalKw,
        gridKw: gridKw,
        pvKw: pvKw,
        storageKw: storageKw,
      })
    }
    return records
  }, [timeDim, effectiveDate, selectedMonth, dateRange, monthMaxDays, monthYear, monthNum, currentParkDetail])

  // 兼容别名供过滤逻辑使用
  const detailedLedgerData = displayedPowerLedger


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

  // 🌟 全园区当月微电网电量走势数据 (展示当月每天 01日 ~ 28日 数据，单位 kWh)
  const monthEnergyTrendData = useMemo(() => {
    const days: Array<{ time: string; 园区总用电: number; 市网购电: number; 光伏发电: number; 储能充放: number }> = []
    for (let d = 1; d <= monthMaxDays; d++) {
      const dayStr = `${String(d).padStart(2, '0')}日`
      const dayOfWeek = new Date(monthYear, monthNum - 1, d).getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const factor = isWeekend ? 0.85 : 1 + Math.sin(d * 0.5) * 0.09
      const totalKWh = Math.round(currentParkDetail.loadKw * 18.2 * factor)
      const pvKWh = Math.round(currentParkDetail.pvKw * 6.5 * (isWeekend ? 1.0 : 0.95 + Math.cos(d * 0.3) * 0.08))
      const storageKWh = Math.round(currentParkDetail.storageKw * 2.2)
      const gridKWh = Math.max(0, totalKWh - pvKWh - storageKWh)
      days.push({
        time: dayStr,
        '园区总用电': totalKWh,
        '市网购电': gridKWh,
        '光伏发电': pvKWh,
        '储能充放': storageKWh,
      })
    }
    return days
  }, [monthMaxDays, monthYear, monthNum, currentParkDetail])

  // 🌟 自定义日期区间电量走势数据 (单位 kWh)
  const customEnergyTrendData = useMemo(() => {
    if (timeDim !== 'custom') return []
    const start = new Date(dateRange.start)
    const end = new Date(dateRange.end)
    const days: Array<{ time: string; 园区总用电: number; 市网购电: number; 光伏发电: number; 储能充放: number }> = []
    const cur = new Date(start)
    let idx = 0
    while (cur <= end && idx < 31) {
      const monthStr = String(cur.getMonth() + 1).padStart(2, '0')
      const dayStr = String(cur.getDate()).padStart(2, '0')
      const label = `${monthStr}-${dayStr}`
      const isWeekend = (cur.getDay() === 0 || cur.getDay() === 6)
      const dayFactor = isWeekend ? 0.85 : 1 + Math.sin(idx * 0.7) * 0.1
      const totalKWh = Math.round(currentParkDetail.loadKw * 18.2 * dayFactor)
      const pvKWh = Math.round(currentParkDetail.pvKw * 6.5 * (isWeekend ? 1.0 : 0.95 + Math.cos(idx * 0.3) * 0.08))
      const storageKWh = Math.round(currentParkDetail.storageKw * 2.2)
      const gridKWh = Math.max(0, totalKWh - pvKWh - storageKWh)
      days.push({
        time: label,
        '园区总用电': totalKWh,
        '市网购电': gridKWh,
        '光伏发电': pvKWh,
        '储能充放': storageKWh,
      })
      cur.setDate(cur.getDate() + 1)
      idx++
    }
    return days
  }, [timeDim, dateRange, currentParkDetail])

  // 🌟 统一生成微电网功率平衡曲线与明细台账数据 (随 日/月/自定义 维度与 15分钟/1小时/1天 采样步长自适应联动)
  const {
    powerChartData,
    powerLedgerPoints,
    powerChartXInterval,
    powerSummaryLabels,
    powerStats,
  } = useMemo(() => {
    const baseLoad = currentParkDetail.loadKw
    const basePv = currentParkDetail.pvKw

    // 辅助计算：在给定浮点小时数 t (0~24) 与日波动因子下，计算功率四要素
    const getHourPower = (t: number, dayFactor: number, pvDayFactor: number) => {
      let loadRatio = 0.52
      if (t >= 0 && t < 6) loadRatio = 0.50 + Math.sin(t * 0.5) * 0.04
      else if (t >= 6 && t < 8.5) loadRatio = 0.55 + ((t - 6) / 2.5) * 0.38
      else if (t >= 8.5 && t < 11.5) loadRatio = 0.93 + Math.sin((t - 8.5) * 2) * 0.06
      else if (t >= 11.5 && t < 13) loadRatio = 0.78 + Math.cos((t - 11.5) * 2) * 0.04
      else if (t >= 13 && t < 17.5) loadRatio = 0.96 + Math.sin((t - 13) * 1.5) * 0.05
      else if (t >= 17.5 && t < 21) loadRatio = 0.82 - ((t - 17.5) / 3.5) * 0.16
      else loadRatio = 0.64 - ((t - 21) / 3) * 0.12

      const loadVal = Math.round(baseLoad * loadRatio * dayFactor)

      let pvVal = 0
      if (t >= 6.25 && t <= 18.75) {
        const solarAngle = ((t - 6.25) / 12.5) * Math.PI
        const solarFactor = Math.sin(solarAngle)
        const cloudNoise = 0.96 + Math.sin(t * 7) * 0.03
        pvVal = Math.max(0, Math.round(basePv * solarFactor * cloudNoise * pvDayFactor))
      }

      let storageVal = 0
      if (t >= 0 && t < 6) {
        storageVal = -Math.round(500 + Math.sin(t * 1.5) * 150)
      } else if (t >= 8.75 && t < 11.5) {
        storageVal = Math.round(850 + Math.sin((t - 8.75) * 2) * 200)
      } else if (t >= 11.75 && t < 13.5 && pvVal > loadVal * 0.4) {
        storageVal = -Math.round(650 + Math.sin((t - 11.75) * 3) * 150)
      } else if (t >= 18.5 && t < 21) {
        storageVal = Math.round(900 + Math.sin((t - 18.5) * 2.5) * 220)
      }

      const gridVal = Math.max(0, Math.round(loadVal - pvVal - storageVal))
      return { loadVal, pvVal, storageVal, gridVal }
    }

    // -----------------------------------------------------------------
    // 维度 1: 日维度 (timeDim === 'day')：固定展现当天 24 小时高频 15 分钟时序
    // -----------------------------------------------------------------
    if (timeDim === 'day') {
      const dayFactor = dateFluctuation.loadMult
      const pvDayFactor = dateFluctuation.pvMult
      const points: Array<{
        time: string
        columnLabel: string
        fullTime: string
        园区总负荷: number
        光伏出力: number
        市电受电: number
        储能充放电: number
      }> = []

      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
          const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          const t = h + m / 60
          const { loadVal, pvVal, storageVal, gridVal } = getHourPower(t, dayFactor, pvDayFactor)
          points.push({
            time: timeStr,
            columnLabel: timeStr,
            fullTime: `${selectedDate} ${timeStr}`,
            园区总负荷: loadVal,
            光伏出力: pvVal,
            市电受电: gridVal,
            储能充放电: storageVal,
          })
        }
      }

      const maxLoad = Math.max(...points.map((p) => p.园区总负荷))
      const avgLoad = Math.round(points.reduce((s, p) => s + p.园区总负荷, 0) / points.length)
      const maxStorage = Math.max(0, ...points.map((p) => p.储能充放电))
      const avgStorage = Math.round(points.reduce((s, p) => s + Math.abs(p.储能充放电), 0) / points.length)
      const maxPv = Math.max(...points.map((p) => p.光伏出力))
      const avgPv = Math.round(points.reduce((s, p) => s + p.光伏出力, 0) / points.length)
      const maxGrid = Math.max(...points.map((p) => p.市电受电))
      const avgGrid = Math.round(points.reduce((s, p) => s + p.市电受电, 0) / points.length)

      return {
        powerChartData: points,
        powerLedgerPoints: points,
        powerChartXInterval: 7, // 每 2 小时打标一次
        powerSummaryLabels: { peak: '当日峰值', avg: '当日均值' },
        powerStats: {
          load: { max: maxLoad, avg: avgLoad },
          storage: { max: maxStorage, avg: avgStorage },
          pv: { max: maxPv, avg: avgPv },
          grid: { max: maxGrid, avg: avgGrid },
        },
      }
    }

    // -----------------------------------------------------------------
    // 维度 2: 月维度 (timeDim === 'month')：全月周期，支持 15分钟 / 1小时 / 1天 步长
    // -----------------------------------------------------------------
    if (timeDim === 'month') {
      const points: Array<{
        time: string
        columnLabel: string
        fullTime: string
        园区总负荷: number
        光伏出力: number
        市电受电: number
        储能充放电: number
      }> = []

      // 步长 2.1: 1天步长 (全月 01日 ~ 28日)
      if (powerSamplingStep === '1d') {
        for (let d = 1; d <= monthMaxDays; d++) {
          const dayStr = `${String(d).padStart(2, '0')}日`
          const dayOfWeek = new Date(monthYear, monthNum - 1, d).getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          const dayFactor = isWeekend ? 0.88 : 1 + Math.sin(d * 0.45) * 0.08
          const totalKw = Math.round(baseLoad * dayFactor)
          const pvKw = Math.round(basePv * (0.85 + Math.cos(d * 0.35) * 0.1))
          const storageKw = Math.round(currentParkDetail.storageKw * 1.0)
          const gridKw = Math.max(0, totalKw - pvKw)

          points.push({
            time: dayStr,
            columnLabel: dayStr,
            fullTime: `${selectedMonth}-${String(d).padStart(2, '0')}`,
            园区总负荷: totalKw,
            光伏出力: pvKw,
            市电受电: gridKw,
            储能充放电: storageKw,
          })
        }

        const maxLoad = Math.max(...points.map((p) => p.园区总负荷))
        const avgLoad = Math.round(points.reduce((s, p) => s + p.园区总负荷, 0) / points.length)
        const maxStorage = Math.max(0, ...points.map((p) => p.储能充放电))
        const avgStorage = Math.round(points.reduce((s, p) => s + Math.abs(p.储能充放电), 0) / points.length)
        const maxPv = Math.max(...points.map((p) => p.光伏出力))
        const avgPv = Math.round(points.reduce((s, p) => s + p.光伏出力, 0) / points.length)
        const maxGrid = Math.max(...points.map((p) => p.市电受电))
        const avgGrid = Math.round(points.reduce((s, p) => s + p.市电受电, 0) / points.length)

        return {
          powerChartData: points,
          powerLedgerPoints: points,
          powerChartXInterval: 0, // 每天打标一次 (固定展示 01日 ~ 28日)
          powerSummaryLabels: { peak: '当月峰值', avg: '当月均值' },
          powerStats: {
            load: { max: maxLoad, avg: avgLoad },
            storage: { max: maxStorage, avg: avgStorage },
            pv: { max: maxPv, avg: avgPv },
            grid: { max: maxGrid, avg: avgGrid },
          },
        }
      }

      // 步长 2.2: 1小时步长 (全月各日 00:00 ~ 23:00)
      if (powerSamplingStep === '1h') {
        for (let d = 1; d <= monthMaxDays; d++) {
          const dayOfWeek = new Date(monthYear, monthNum - 1, d).getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          const dayFactor = isWeekend ? 0.88 : 1 + Math.sin(d * 0.45) * 0.08
          const pvDayFactor = 0.85 + Math.cos(d * 0.35) * 0.1

          for (let h = 0; h < 24; h++) {
            const timeLabel = `${String(d).padStart(2, '0')}日 ${String(h).padStart(2, '0')}:00`
            const { loadVal, pvVal, storageVal, gridVal } = getHourPower(h, dayFactor, pvDayFactor)
            points.push({
              time: timeLabel,
              columnLabel: timeLabel,
              fullTime: `${selectedMonth}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:00`,
              园区总负荷: loadVal,
              光伏出力: pvVal,
              市电受电: gridVal,
              储能充放电: storageVal,
            })
          }
        }

        const maxLoad = Math.max(...points.map((p) => p.园区总负荷))
        const avgLoad = Math.round(points.reduce((s, p) => s + p.园区总负荷, 0) / points.length)
        const maxStorage = Math.max(0, ...points.map((p) => p.储能充放电))
        const avgStorage = Math.round(points.reduce((s, p) => s + Math.abs(p.储能充放电), 0) / points.length)
        const maxPv = Math.max(...points.map((p) => p.光伏出力))
        const avgPv = Math.round(points.reduce((s, p) => s + p.光伏出力, 0) / points.length)
        const maxGrid = Math.max(...points.map((p) => p.市电受电))
        const avgGrid = Math.round(points.reduce((s, p) => s + p.市电受电, 0) / points.length)

        return {
          powerChartData: points,
          powerLedgerPoints: points,
          powerChartXInterval: 23, // 每天 00:00 打标一次
          powerSummaryLabels: { peak: '当月峰值', avg: '当月均值' },
          powerStats: {
            load: { max: maxLoad, avg: avgLoad },
            storage: { max: maxStorage, avg: avgStorage },
            pv: { max: maxPv, avg: avgPv },
            grid: { max: maxGrid, avg: avgGrid },
          },
        }
      }

      // 步长 2.3: 15分钟步长 (全月各日 15分钟采样点)
      for (let d = 1; d <= monthMaxDays; d++) {
        const dayOfWeek = new Date(monthYear, monthNum - 1, d).getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const dayFactor = isWeekend ? 0.88 : 1 + Math.sin(d * 0.45) * 0.08
        const pvDayFactor = 0.85 + Math.cos(d * 0.35) * 0.1

        for (let h = 0; h < 24; h++) {
          for (let m = 0; m < 60; m += 15) {
            const timeLabel = `${String(d).padStart(2, '0')}日 ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
            const t = h + m / 60
            const { loadVal, pvVal, storageVal, gridVal } = getHourPower(t, dayFactor, pvDayFactor)
            points.push({
              time: timeLabel,
              columnLabel: timeLabel,
              fullTime: `${selectedMonth}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
              园区总负荷: loadVal,
              光伏出力: pvVal,
              市电受电: gridVal,
              储能充放电: storageVal,
            })
          }
        }
      }

      const maxLoad = Math.max(...points.map((p) => p.园区总负荷))
      const avgLoad = Math.round(points.reduce((s, p) => s + p.园区总负荷, 0) / points.length)
      const maxStorage = Math.max(0, ...points.map((p) => p.储能充放电))
      const avgStorage = Math.round(points.reduce((s, p) => s + Math.abs(p.储能充放电), 0) / points.length)
      const maxPv = Math.max(...points.map((p) => p.光伏出力))
      const avgPv = Math.round(points.reduce((s, p) => s + p.光伏出力, 0) / points.length)
      const maxGrid = Math.max(...points.map((p) => p.市电受电))
      const avgGrid = Math.round(points.reduce((s, p) => s + p.市电受电, 0) / points.length)

      return {
        powerChartData: points,
        powerLedgerPoints: points,
        powerChartXInterval: 95, // 每天 00:00 打标一次
        powerSummaryLabels: { peak: '当月峰值', avg: '当月均值' },
        powerStats: {
          load: { max: maxLoad, avg: avgLoad },
          storage: { max: maxStorage, avg: avgStorage },
          pv: { max: maxPv, avg: avgPv },
          grid: { max: maxGrid, avg: avgGrid },
        },
      }
    }

    // -----------------------------------------------------------------
    // 维度 3: 自定义维度 (timeDim === 'custom')：根据所选时间段展现
    // -----------------------------------------------------------------
    const start = new Date(dateRange.start)
    const end = new Date(dateRange.end)
    const points: Array<{
      time: string
      columnLabel: string
      fullTime: string
      园区总负荷: number
      光伏出力: number
      市电受电: number
      储能充放电: number
    }> = []

    // 步长 3.1: 1天步长
    if (powerSamplingStep === '1d') {
      const cur = new Date(start)
      let idx = 0
      while (cur <= end && idx < 31) {
        const monthStr = String(cur.getMonth() + 1).padStart(2, '0')
        const dayStr = String(cur.getDate()).padStart(2, '0')
        const label = `${monthStr}-${dayStr}`
        const isWeekend = cur.getDay() === 0 || cur.getDay() === 6
        const dayFactor = isWeekend ? 0.88 : 1 + Math.sin(idx * 0.6) * 0.08
        const totalKw = Math.round(baseLoad * dayFactor)
        const pvKw = Math.round(basePv * (0.85 + Math.cos(idx * 0.4) * 0.1))
        const storageKw = Math.round(currentParkDetail.storageKw * 1.0)
        const gridKw = Math.max(0, totalKw - pvKw)

        points.push({
          time: label,
          columnLabel: label,
          fullTime: `${cur.getFullYear()}-${label}`,
          园区总负荷: totalKw,
          光伏出力: pvKw,
          市电受电: gridKw,
          储能充放电: storageKw,
        })
        cur.setDate(cur.getDate() + 1)
        idx++
      }

      const maxLoad = Math.max(...points.map((p) => p.园区总负荷))
      const avgLoad = Math.round(points.reduce((s, p) => s + p.园区总负荷, 0) / (points.length || 1))
      const maxStorage = Math.max(0, ...points.map((p) => p.储能充放电))
      const avgStorage = Math.round(points.reduce((s, p) => s + Math.abs(p.储能充放电), 0) / (points.length || 1))
      const maxPv = Math.max(...points.map((p) => p.光伏出力))
      const avgPv = Math.round(points.reduce((s, p) => s + p.光伏出力, 0) / (points.length || 1))
      const maxGrid = Math.max(...points.map((p) => p.市电受电))
      const avgGrid = Math.round(points.reduce((s, p) => s + p.市电受电, 0) / (points.length || 1))

      return {
        powerChartData: points,
        powerLedgerPoints: points,
        powerChartXInterval: 0, // 每天打标一次 (固定展示各日 MM-DD)
        powerSummaryLabels: { peak: '区间峰值', avg: '区间均值' },
        powerStats: {
          load: { max: maxLoad, avg: avgLoad },
          storage: { max: maxStorage, avg: avgStorage },
          pv: { max: maxPv, avg: avgPv },
          grid: { max: maxGrid, avg: avgGrid },
        },
      }
    }

    // 步长 3.2: 1小时步长
    if (powerSamplingStep === '1h') {
      const cur = new Date(start)
      let idx = 0
      while (cur <= end && idx < 31) {
        const monthStr = String(cur.getMonth() + 1).padStart(2, '0')
        const dayStr = String(cur.getDate()).padStart(2, '0')
        const datePrefix = `${monthStr}-${dayStr}`
        const isWeekend = cur.getDay() === 0 || cur.getDay() === 6
        const dayFactor = isWeekend ? 0.88 : 1 + Math.sin(idx * 0.6) * 0.08
        const pvDayFactor = 0.85 + Math.cos(idx * 0.4) * 0.1

        for (let h = 0; h < 24; h++) {
          const timeLabel = `${datePrefix} ${String(h).padStart(2, '0')}:00`
          const { loadVal, pvVal, storageVal, gridVal } = getHourPower(h, dayFactor, pvDayFactor)
          points.push({
            time: timeLabel,
            columnLabel: timeLabel,
            fullTime: `${cur.getFullYear()}-${datePrefix} ${String(h).padStart(2, '0')}:00`,
            园区总负荷: loadVal,
            光伏出力: pvVal,
            市电受电: gridVal,
            储能充放电: storageVal,
          })
        }
        cur.setDate(cur.getDate() + 1)
        idx++
      }

      const maxLoad = Math.max(...points.map((p) => p.园区总负荷))
      const avgLoad = Math.round(points.reduce((s, p) => s + p.园区总负荷, 0) / (points.length || 1))
      const maxStorage = Math.max(0, ...points.map((p) => p.储能充放电))
      const avgStorage = Math.round(points.reduce((s, p) => s + Math.abs(p.储能充放电), 0) / (points.length || 1))
      const maxPv = Math.max(...points.map((p) => p.光伏出力))
      const avgPv = Math.round(points.reduce((s, p) => s + p.光伏出力, 0) / (points.length || 1))
      const maxGrid = Math.max(...points.map((p) => p.市电受电))
      const avgGrid = Math.round(points.reduce((s, p) => s + p.市电受电, 0) / (points.length || 1))

      return {
        powerChartData: points,
        powerLedgerPoints: points,
        powerChartXInterval: 23, // 每天打标一次
        powerSummaryLabels: { peak: '区间峰值', avg: '区间均值' },
        powerStats: {
          load: { max: maxLoad, avg: avgLoad },
          storage: { max: maxStorage, avg: avgStorage },
          pv: { max: maxPv, avg: avgPv },
          grid: { max: maxGrid, avg: avgGrid },
        },
      }
    }

    // 步长 3.3: 15分钟步长
    const cur = new Date(start)
    let idx = 0
    while (cur <= end && idx < 31) {
      const monthStr = String(cur.getMonth() + 1).padStart(2, '0')
      const dayStr = String(cur.getDate()).padStart(2, '0')
      const datePrefix = `${monthStr}-${dayStr}`
      const isWeekend = cur.getDay() === 0 || cur.getDay() === 6
      const dayFactor = isWeekend ? 0.88 : 1 + Math.sin(idx * 0.6) * 0.08
      const pvDayFactor = 0.85 + Math.cos(idx * 0.4) * 0.1

      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
          const timeLabel = `${datePrefix} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          const t = h + m / 60
          const { loadVal, pvVal, storageVal, gridVal } = getHourPower(t, dayFactor, pvDayFactor)
          points.push({
            time: timeLabel,
            columnLabel: timeLabel,
            fullTime: `${cur.getFullYear()}-${datePrefix} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
            园区总负荷: loadVal,
            光伏出力: pvVal,
            市电受电: gridVal,
            储能充放电: storageVal,
          })
        }
      }
      cur.setDate(cur.getDate() + 1)
      idx++
    }

    const maxLoad = Math.max(...points.map((p) => p.园区总负荷))
    const avgLoad = Math.round(points.reduce((s, p) => s + p.园区总负荷, 0) / (points.length || 1))
    const maxStorage = Math.max(0, ...points.map((p) => p.储能充放电))
    const avgStorage = Math.round(points.reduce((s, p) => s + Math.abs(p.储能充放电), 0) / (points.length || 1))
    const maxPv = Math.max(...points.map((p) => p.光伏出力))
    const avgPv = Math.round(points.reduce((s, p) => s + p.光伏出力, 0) / (points.length || 1))
    const maxGrid = Math.max(...points.map((p) => p.市电受电))
    const avgGrid = Math.round(points.reduce((s, p) => s + p.市电受电, 0) / (points.length || 1))

    return {
      powerChartData: points,
      powerLedgerPoints: points,
      powerChartXInterval: 95, // 每天打标一次
      powerSummaryLabels: { peak: '区间峰值', avg: '区间均值' },
      powerStats: {
        load: { max: maxLoad, avg: avgLoad },
        storage: { max: maxStorage, avg: avgStorage },
        pv: { max: maxPv, avg: avgPv },
        grid: { max: maxGrid, avg: avgGrid },
      },
    }
  }, [timeDim, powerSamplingStep, currentParkDetail, selectedDate, selectedMonth, dateRange, dateFluctuation, monthMaxDays, monthYear, monthNum])

  // 可选过滤日期列表 (当月度或自定义高频模式 15m/1h 时提供单日筛选)
  const availableLedgerDays = useMemo(() => {
    if (timeDim === 'day' || powerSamplingStep === '1d') return []
    if (timeDim === 'month') {
      const days: Array<{ value: string; label: string }> = []
      for (let d = 1; d <= monthMaxDays; d++) {
        const val = `${selectedMonth}-${String(d).padStart(2, '0')}`
        const label = `${selectedMonth}-${String(d).padStart(2, '0')}日`
        days.push({ value: val, label })
      }
      return days
    }
    if (timeDim === 'custom') {
      const days: Array<{ value: string; label: string }> = []
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      const cur = new Date(start)
      let idx = 0
      while (cur <= end && idx < 31) {
        const monthStr = String(cur.getMonth() + 1).padStart(2, '0')
        const dayStr = String(cur.getDate()).padStart(2, '0')
        const val = `${cur.getFullYear()}-${monthStr}-${dayStr}`
        const label = `${monthStr}-${dayStr}`
        days.push({ value: val, label })
        cur.setDate(cur.getDate() + 1)
        idx++
      }
      return days
    }
    return []
  }, [timeDim, powerSamplingStep, monthMaxDays, selectedMonth, dateRange])

  // 实际呈现于明细台账的点位 (支持全周期平铺或单日过滤)
  const displayedTablePoints = useMemo(() => {
    if (ledgerDayFilter === 'all') return powerLedgerPoints
    return powerLedgerPoints.filter((pt) => pt.fullTime && pt.fullTime.startsWith(ledgerDayFilter))
  }, [powerLedgerPoints, ledgerDayFilter])

  // 兼容别名以供其余关联组件引用
  const day15MinPowerPoints = displayedTablePoints

  // 🌟 24 小时 15 分钟高频累计电量走势数据 (96 个监测点，单调累计递增)
  const dayCumulativeEnergyTrendData = useMemo(() => {
    let cumTotal = 0
    let cumGrid = 0
    let cumPv = 0
    let cumStorage = 0

    return dayEnergyTrendData.map((pt) => {
      cumTotal += pt.园区总用电
      cumGrid += pt.市网购电
      cumPv += pt.光伏发电
      if (pt.储能充放 > 0) {
        cumStorage += pt.储能充放
      }
      return {
        time: pt.time,
        '园区累计用电': cumTotal,
        '市电累计用量': cumGrid,
        '光伏累计消纳': cumPv,
        '储能累计放电': cumStorage,
      }
    })
  }, [dayEnergyTrendData])

  // 🌟 全园区当月微电网电量累计走势数据 (日累计递增)
  const monthCumulativeEnergyTrendData = useMemo(() => {
    let cumTotal = 0
    let cumGrid = 0
    let cumPv = 0
    let cumStorage = 0

    return monthEnergyTrendData.map((pt) => {
      cumTotal += pt['园区总用电']
      cumGrid += pt['市网购电']
      cumPv += pt['光伏发电']
      if (pt['储能充放'] > 0) {
        cumStorage += pt['储能充放']
      }
      return {
        time: pt.time,
        '园区累计用电': cumTotal,
        '市电累计用量': cumGrid,
        '光伏累计消纳': cumPv,
        '储能累计放电': cumStorage,
      }
    })
  }, [monthEnergyTrendData])

  // 🌟 自定义日期区间电量累计走势数据
  const customCumulativeEnergyTrendData = useMemo(() => {
    let cumTotal = 0
    let cumGrid = 0
    let cumPv = 0
    let cumStorage = 0

    return customEnergyTrendData.map((pt) => {
      cumTotal += pt['园区总用电']
      cumGrid += pt['市网购电']
      cumPv += pt['光伏发电']
      if (pt['储能充放'] > 0) {
        cumStorage += pt['储能充放']
      }
      return {
        time: pt.time,
        '园区累计用电': cumTotal,
        '市电累计用量': cumGrid,
        '光伏累计消纳': cumPv,
        '储能累计放电': cumStorage,
      }
    })
  }, [customEnergyTrendData])

  // 🌟 物理认定绿电时序走势 (自发自用光伏消纳 + 购买物理绿电，不含纯绿证)
  const physicalGreenTrendData = useMemo(() => {
    if (timeDim === 'custom') {
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      const days: Array<{ time: string; 物理认定绿电: number; 光伏自发自用: number; 购买绿电: number }> = []
      const cur = new Date(start)
      let idx = 0
      while (cur <= end && idx < 31) {
        const monthStr = String(cur.getMonth() + 1).padStart(2, '0')
        const dayStr = String(cur.getDate()).padStart(2, '0')
        const label = `${monthStr}-${dayStr}`
        const pv = Number((((currentParkDetail.pvKw * 6.5 * 0.88) / 10000) * (0.95 + Math.sin(idx * 0.5) * 0.08)).toFixed(2))
        const trade = Number((((currentParkDetail.loadKw * 18.2 * 0.28) / 10000) * (0.96 + Math.cos(idx * 0.4) * 0.07)).toFixed(2))
        const total = Number((pv + trade).toFixed(2))
        days.push({
          time: label,
          物理认定绿电: total,
          光伏自发自用: pv,
          购买绿电: trade,
        })
        cur.setDate(cur.getDate() + 1)
        idx++
      }
      return days
    }

    return [
      { time: '01月', 物理认定绿电: 145.2, 光伏自发自用: 105.0, 购买绿电: 40.2 },
      { time: '02月', 物理认定绿电: 152.0, 光伏自发自用: 110.2, 购买绿电: 41.8 },
      { time: '03月', 物理认定绿电: 168.5, 光伏自发自用: 122.5, 购买绿电: 46.0 },
      { time: '04月', 物理认定绿电: 175.4, 光伏自发自用: 128.0, 购买绿电: 47.4 },
      { time: '05月', 物理认定绿电: 189.6, 光伏自发自用: 138.6, 购买绿电: 51.0 },
      { time: '06月', 物理认定绿电: 196.2, 光伏自发自用: 143.2, 购买绿电: 53.0 },
      { time: '07月', 物理认定绿电: 204.5, 光伏自发自用: 149.5, 购买绿电: 55.0 },
      { time: '08月', 物理认定绿电: 182.0, 光伏自发自用: 133.0, 购买绿电: 49.0 },
    ]
  }, [timeDim, dateRange, currentParkDetail])


  // 🌟 统一电量台账适配器 (随日/月/自定义维度自适应：日=15分钟, 月=日, 自定义=日)
  const displayedEnergyLedger = useMemo(() => {
    if (timeDim === 'day') {
      const records: Array<{
        id: string
        time: string
        total: string
        grid: string
        pv: string
        storage: string
      }> = []
      // 15分钟高频台账：从 23:45 倒序至 00:00 (共 96 个监测点)
      for (let h = 23; h >= 0; h--) {
        for (let m = 45; m >= 0; m -= 15) {
          const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
          const t = h + m / 60
          let loadRatio = 0.52
          if (t >= 0 && t < 6) loadRatio = 0.50 + Math.sin(t * 0.5) * 0.04
          else if (t >= 6 && t < 8.5) loadRatio = 0.55 + ((t - 6) / 2.5) * 0.38
          else if (t >= 8.5 && t < 11.5) loadRatio = 0.93 + Math.sin((t - 8.5) * 2) * 0.06
          else if (t >= 11.5 && t < 13) loadRatio = 0.78 + Math.cos((t - 11.5) * 2) * 0.04
          else if (t >= 13 && t < 17.5) loadRatio = 0.96 + Math.sin((t - 13) * 1.5) * 0.05
          else if (t >= 17.5 && t < 21) loadRatio = 0.82 - ((t - 17.5) / 3.5) * 0.16
          else loadRatio = 0.64 - ((t - 21) / 3) * 0.12

          const totalEnergy = Math.round(currentParkDetail.loadKw * loadRatio * 0.25)
          let pvEnergy = 0
          if (t >= 6.25 && t <= 18.75) {
            pvEnergy = Math.max(0, Math.round(currentParkDetail.pvKw * Math.sin(((t - 6.25) / 12.5) * Math.PI) * (0.96 + Math.sin(t * 7) * 0.03) * 0.25))
          }
          let storageEnergy = 0
          if (t >= 0 && t < 6) storageEnergy = -Math.round(550 * 0.25)
          else if (t >= 8.75 && t < 11.5) storageEnergy = Math.round(900 * 0.25)
          else if (t >= 11.75 && t < 13.5 && pvEnergy > totalEnergy * 0.4) storageEnergy = -Math.round(650 * 0.25)
          else if (t >= 18.5 && t < 21) storageEnergy = Math.round(950 * 0.25)

          const gridEnergy = Math.max(0, totalEnergy - pvEnergy - (storageEnergy > 0 ? storageEnergy : 0))

          records.push({
            id: `eng-day-${h}-${m}`,
            time: `${effectiveDate} ${timeStr}`,
            total: totalEnergy.toLocaleString(),
            grid: gridEnergy.toLocaleString(),
            pv: pvEnergy.toLocaleString(),
            storage: storageEnergy > 0 ? `+${storageEnergy} (放)` : storageEnergy < 0 ? `${storageEnergy} (充)` : '0',
          })
        }
      }
      return records
    }

    if (timeDim === 'custom') {
      const records: Array<{
        id: string
        time: string
        total: string
        grid: string
        pv: string
        storage: string
      }> = []
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      const cur = new Date(end)
      let idx = 0
      while (cur >= start && idx < 31) {
        const yStr = cur.getFullYear()
        const mStr = String(cur.getMonth() + 1).padStart(2, '0')
        const dStr = String(cur.getDate()).padStart(2, '0')
        const fullDate = `${yStr}-${mStr}-${dStr}`
        const isWeekend = cur.getDay() === 0 || cur.getDay() === 6
        const factor = isWeekend ? 0.85 : 1 + Math.sin(idx * 0.7) * 0.1
        const totalKWh = Math.round(currentParkDetail.loadKw * 18.2 * factor)
        const pvKWh = Math.round(currentParkDetail.pvKw * 6.5 * (isWeekend ? 1.0 : 0.95 + Math.cos(idx * 0.3) * 0.08))
        const storageKWh = Math.round(currentParkDetail.storageKw * 2.2)
        const gridKWh = Math.max(0, totalKWh - pvKWh - storageKWh)

        records.push({
          id: `eng-custom-${idx}`,
          time: fullDate,
          total: totalKWh.toLocaleString(),
          grid: gridKWh.toLocaleString(),
          pv: pvKWh.toLocaleString(),
          storage: `+${storageKWh.toLocaleString()} (放)`,
        })
        cur.setDate(cur.getDate() - 1)
        idx++
      }
      return records
    }

    // month 维度：当月各日倒序台账 (日颗粒度)
    const records: Array<{
      id: string
      time: string
      total: string
      grid: string
      pv: string
      storage: string
    }> = []
    for (let d = monthMaxDays; d >= 1; d--) {
      const dayStr = `${selectedMonth}-${String(d).padStart(2, '0')}`
      const dayOfWeek = new Date(monthYear, monthNum - 1, d).getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const factor = isWeekend ? 0.85 : 1 + Math.sin(d * 0.5) * 0.09
      const totalKWh = Math.round(currentParkDetail.loadKw * 18.2 * factor)
      const pvKWh = Math.round(currentParkDetail.pvKw * 6.5 * (isWeekend ? 1.0 : 0.95 + Math.cos(d * 0.3) * 0.08))
      const storageKWh = Math.round(currentParkDetail.storageKw * 2.2)
      const gridKWh = Math.max(0, totalKWh - pvKWh - storageKWh)

      records.push({
        id: `eng-month-${d}`,
        time: dayStr,
        total: totalKWh.toLocaleString(),
        grid: gridKWh.toLocaleString(),
        pv: pvKWh.toLocaleString(),
        storage: `+${storageKWh.toLocaleString()} (放)`,
      })
    }
    return records
  }, [timeDim, effectiveDate, selectedMonth, dateRange, monthMaxDays, monthYear, monthNum, currentParkDetail])

  // 🌟 全园区月度绿电结构占比走势数据 (绿电占比、直供绿电占比、交易绿电占比、交易绿证占比 4条曲线)
  const greenRatioTrendData = useMemo(() => {
    return [
      { time: '01月', 绿电综合占比: 31.5, 直供绿电占比: 21.2, 交易绿电占比: 8.5, 交易绿证占比: 1.8 },
      { time: '02月', 绿电综合占比: 33.0, 直供绿电占比: 22.0, 交易绿电占比: 9.0, 交易绿证占比: 2.0 },
      { time: '03月', 绿电综合占比: 35.5, 直供绿电占比: 23.5, 交易绿电占比: 9.8, 交易绿证占比: 2.2 },
      { time: '04月', 绿电综合占比: 37.6, 直供绿电占比: 25.1, 交易绿电占比: 10.2, 交易绿证占比: 2.3 },
      { time: '05月', 绿电综合占比: 40.6, 直供绿电占比: 27.4, 交易绿电占比: 10.8, 交易绿证占比: 2.4 },
      { time: '06月', 绿电综合占比: 42.9, 直供绿电占比: 29.2, 交易绿电占比: 11.2, 交易绿证占比: 2.5 },
      { time: '07月', 绿电综合占比: 44.6, 直供绿电占比: 30.5, 交易绿电占比: 11.5, 交易绿证占比: 2.6 },
      { time: '08月', 绿电综合占比: 45.3, 直供绿电占比: 31.0, 交易绿电占比: 11.6, 交易绿证占比: 2.7 },
    ]
  }, [])

  // 🌟 【总用电量】时序走势与结构数据 (根据 timeDim 自适应：日=24小时, 月=当月各日, 自定义=区间各日)
  const totalPowerTrendData = useMemo(() => {
    if (timeDim === 'day') {
      const hours: Array<{ time: string; 总用电量: number; 市电量: number; 绿电消纳量: number }> = []
      for (let h = 0; h < 24; h++) {
        const timeStr = `${String(h).padStart(2, '0')}:00`
        const ratio = 0.52 + Math.sin(h / 3.8) * 0.42
        const total = Math.round(currentParkDetail.loadKw * ratio)
        const pv = (h >= 7 && h <= 18) ? Math.round(currentParkDetail.pvKw * Math.sin(((h - 7) / 11) * Math.PI)) : 0
        const green = Math.round(pv + total * 0.12)
        const grid = Math.max(0, total - green)
        hours.push({
          time: timeStr,
          '总用电量': total,
          '市电量': grid,
          '绿电消纳量': green,
        })
      }
      return hours
    }
    if (timeDim === 'custom') {
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      const cur = new Date(start)
      const days: Array<{ time: string; 总用电量: number; 市电量: number; 绿电消纳量: number }> = []
      let idx = 0
      while (cur <= end && idx < 31) {
        const mStr = String(cur.getMonth() + 1).padStart(2, '0')
        const dStr = String(cur.getDate()).padStart(2, '0')
        const isWeekend = cur.getDay() === 0 || cur.getDay() === 6
        const factor = isWeekend ? 0.85 : 1 + Math.sin(idx * 0.6) * 0.08
        const total = Math.round(currentParkDetail.loadKw * 18.2 * factor)
        const pv = Math.round(currentParkDetail.pvKw * 6.5 * (isWeekend ? 0.95 : 1.0))
        const green = Math.round(pv + total * 0.15)
        const grid = Math.max(0, total - green)
        days.push({
          time: `${mStr}-${dStr}`,
          '总用电量': total,
          '市电量': grid,
          '绿电消纳量': green,
        })
        cur.setDate(cur.getDate() + 1)
        idx++
      }
      return days
    }
    // month 维度：展示当月各日 (01日 ~ 28日)
    const days: Array<{ time: string; 总用电量: number; 市电量: number; 绿电消纳量: number }> = []
    for (let d = 1; d <= monthMaxDays; d++) {
      const dayStr = `${String(d).padStart(2, '0')}日`
      const dayOfWeek = new Date(monthYear, monthNum - 1, d).getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const factor = isWeekend ? 0.85 : 1 + Math.sin(d * 0.5) * 0.09
      const total = Math.round(currentParkDetail.loadKw * 18.2 * factor)
      const pv = Math.round(currentParkDetail.pvKw * 6.5 * (isWeekend ? 0.95 : 1.0))
      const green = Math.round(pv + total * 0.15)
      const grid = Math.max(0, total - green)
      days.push({
        time: dayStr,
        '总用电量': total,
        '市电量': grid,
        '绿电消纳量': green,
      })
    }
    return days
  }, [timeDim, dateRange, monthMaxDays, monthYear, monthNum, currentParkDetail])

  // 🌟 1. 【各个企业绿证购买数量】时序走势数据 (张)
  const enterpriseGreenCertTrendData = useMemo(() => {
    return [
      { time: '01月', 沈变本部: 9500, 衡变本部: 7200, 超高压公司: 5000, 鲁缆本部: 6500, 特变电工新疆电缆: 4200, 德缆公司: 3100 },
      { time: '02月', 沈变本部: 10200, 衡变本部: 7800, 超高压公司: 5500, 鲁缆本部: 7000, 特变电工新疆电缆: 4600, 德缆公司: 3400 },
      { time: '03月', 沈变本部: 11800, 衡变本部: 8900, 超高压公司: 6300, 鲁缆本部: 8100, 特变电工新疆电缆: 5300, 德缆公司: 4000 },
      { time: '04月', 沈变本部: 13000, 衡变本部: 9800, 超高压公司: 7100, 鲁缆本部: 8900, 特变电工新疆电缆: 6000, 德缆公司: 4600 },
      { time: '05月', 沈变本部: 14500, 衡变本部: 11000, 超高压公司: 8200, 鲁缆本部: 10200, 特变电工新疆电缆: 7100, 德缆公司: 5400 },
      { time: '06月', 沈变本部: 16200, 衡变本部: 12500, 超高压公司: 9500, 鲁缆本部: 11600, 特变电工新疆电缆: 8300, 德缆公司: 6200 },
      { time: '07月', 沈变本部: 18000, 衡变本部: 14200, 超高压公司: 10800, 鲁缆本部: 13000, 特变电工新疆电缆: 9500, 德缆公司: 7200 },
      { time: '08月', 沈变本部: 18000, 衡变本部: 15000, 超高压公司: 12000, 鲁缆本部: 14000, 特变电工新疆电缆: 10000, 德缆公司: 8000 },
    ]
  }, [])

  // 🌟 2. 【各个企业绿电购买数量】时序走势数据 (万kWh)
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
      return !tableSearchKey.trim() || r.time.includes(tableSearchKey)
    })
  }, [detailedLedgerData, tableSearchKey])

  const filteredEnergyLedger = useMemo(() => {
    return displayedEnergyLedger.filter((r) => {
      return !tableSearchKey.trim() || r.time.includes(tableSearchKey)
    })
  }, [displayedEnergyLedger, tableSearchKey])

  const filteredCertList = useMemo(() => {
    return certList.filter((c) => {
      return (
        !tableSearchKey.trim() ||
        c.dealType.includes(tableSearchKey) ||
        c.provider.includes(tableSearchKey) ||
        (c.buyer && c.buyer.includes(tableSearchKey)) ||
        (c.dealCode && c.dealCode.includes(tableSearchKey)) ||
        (c.certCode && c.certCode.includes(tableSearchKey))
      )
    })
  }, [certList, tableSearchKey])

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCert.provider || !newCert.buyer || !newCert.amount) {
      alert('请填写完整的提供方、购买方企业与电量/张数信息')
      return
    }
    let formattedAmount = newCert.amount.trim()
    if (/^\d+(\.\d+)?$/.test(formattedAmount)) {
      formattedAmount = newCert.dealType.includes('绿证') ? `${Number(formattedAmount).toLocaleString()} 张` : `${formattedAmount} 万kWh`
    }
    const created: GreenCertItem = {
      id: String(Date.now()),
      dealCode: `TX-${newCert.dealType.includes('绿证') ? 'GC' : 'GE'}-202608-${Math.floor(Math.random() * 90 + 10)}`,
      dealType: newCert.dealType,
      sourceType: newCert.sourceType,
      provider: newCert.provider,
      buyer: newCert.buyer,
      amount: formattedAmount,
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
    alert('交易凭证录入成功，已记入台账！')
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
        {/* 1. 页面标题 + 功率/电量/绿电 Tab 切换 + 统一时间筛选与导出 (参考用能监测标准高度 p-3.5 完全统一对齐) */}
        <div className="bg-white p-3.5 rounded-lg border border-[#DBE6EE] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shrink-0">
              <Zap className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">工业微电网监测</h1>

            {/* 🌟 参照统一规范的 3 大 Tab 栏：功率 / 电量 / 绿电 */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0d1b29] p-0.5 dark:p-[3px] rounded-lg border border-slate-200 dark:border-[#133748] text-xs font-sans ml-2">
              {[
                { key: 'power', label: '功率' },
                { key: 'energy', label: '电量' },
                { key: 'green', label: '绿电' },
              ].map((tab) => {
                const isActive = viewMode === tab.key
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setViewMode(tab.key as any)}
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

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 时间维度切换：日 / 月 / 自定义 (绿电模式下不要日) */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg text-sm font-sans">
              {viewMode !== 'green' && (
                <button
                  type="button"
                  onClick={() => setTimeDim('day')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                    timeDim === 'day'
                      ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )}
                >
                  日
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setTimeDim('month')
                  setPowerSamplingStep('1d')
                }}
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

            {/* 1. 日维度：单一日期选择器 (选择具体某一天) */}
            {timeDim === 'day' && (
              <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 text-sm focus:outline-none cursor-pointer font-bold"
                  title="选择具体监测日期"
                />
              </div>
            )}

            {/* 2. 月维度：单一月份选择器 (选择具体某个月，默认按天展示) */}
            {timeDim === 'month' && (
              <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value)
                    setPowerSamplingStep('1d')
                  }}
                  className="bg-transparent border-0 text-slate-800 text-sm focus:outline-none cursor-pointer font-bold"
                  title="选择具体监测月份"
                />
              </div>
            )}

            {/* 3. 自定义维度：起始日期 至 结束日期 (严格限制 ≤ 30 天) */}
            {timeDim === 'custom' && (
              <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs font-mono">
                <Calendar className="size-4 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleCustomStartDateChange(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 text-sm focus:outline-none cursor-pointer font-bold"
                  title="自定义起始日期 (最多可选30天)"
                />
                <span className="text-slate-400 font-sans text-xs">至</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleCustomEndDateChange(e.target.value)}
                  className="bg-transparent border-0 text-slate-800 text-sm focus:outline-none cursor-pointer font-bold"
                  title="自定义结束日期 (最多可选30天)"
                />
              </div>
            )}

            {/* 统一规范导出按钮 (80px * 36px, 8px 圆角, #2C7CFF 蓝底白字) */}
            <button
              type="button"
              onClick={() => alert(`正在导出【${currentParkDetail.name}】微电网监测报表...`)}
              className="w-[80px] h-[36px] bg-[#2C7CFF] hover:bg-[#1E6BFF] text-white rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium shadow-xs transition-colors shrink-0 cursor-pointer"
              title="导出当前监测数据"
            >
              <Download className="size-4 text-white" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 功率监测看板 (viewMode === 'power') */}
        {/* ========================================================================= */}
        {viewMode === 'power' && (
          <>
            {/* 24 小时源网荷储功率平衡曲线 (月维度支持时间轴滑动与步长调整) */}
            {/* 24 小时源网荷储功率平衡曲线 (当选择月和自定义时显示右上角采样步长) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    微电网平衡曲线
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 text-xs font-sans text-slate-500">
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-slate-800" />园区总负荷</span>
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" />储能</span>
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" />光伏</span>
                    <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#2C7CFF]" />市电</span>
                  </div>

                  {/* 🌟 当选择月 和 自定义时，显示右上角的采样步长，点击后可根据步长在图表上显示数据 */}
                  {(timeDim === 'month' || timeDim === 'custom') && (
                    <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                      <span className="text-xs text-slate-600 font-medium font-sans">采样步长：</span>
                      <div className="flex items-center bg-slate-100/90 p-0.5 rounded-lg border border-slate-200 text-xs">
                        <button
                          type="button"
                          onClick={() => setPowerSamplingStep('15m')}
                          className={cn(
                            'px-2.5 py-1 rounded-md transition-all cursor-pointer select-none text-xs',
                            powerSamplingStep === '15m'
                              ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          )}
                        >
                          15分钟
                        </button>
                        <button
                          type="button"
                          onClick={() => setPowerSamplingStep('1h')}
                          className={cn(
                            'px-2.5 py-1 rounded-md transition-all cursor-pointer select-none text-xs',
                            powerSamplingStep === '1h'
                              ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          )}
                        >
                          1小时
                        </button>
                        <button
                          type="button"
                          onClick={() => setPowerSamplingStep('1d')}
                          className={cn(
                            'px-2.5 py-1 rounded-md transition-all cursor-pointer select-none text-xs',
                            powerSamplingStep === '1d'
                              ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          )}
                        >
                          1天
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <LineTrend
                data={powerChartData}
                xKey="time"
                height={260}
                yUnit="kW"
                xInterval={powerChartXInterval}
                xTickFormatter={(val: any) => {
                  if (typeof val === 'string' && val.includes(' ')) {
                    return val.split(' ')[0]
                  }
                  return val
                }}
                lines={[
                  { key: '园区总负荷', name: '园区总负荷 (kW)', color: '#1e293b' },
                  { key: '储能充放电', name: '储能 (kW)', color: '#fa8c16' },
                  { key: '光伏出力', name: '光伏 (kW)', color: '#10b981' },
                  { key: '市电受电', name: '市电 (kW)', color: '#2C7CFF' },
                ]}
              />
            </div>

            {/* 🌟 微电网功率监测明细台账：根据筛选条件显示，表格的维度数据 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/80 gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    监测明细
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {/* 当月度/自定义且步长为高频 (15m/1h) 时，支持快速单日查看切换 */}
                  {(timeDim === 'month' || timeDim === 'custom') && powerSamplingStep !== '1d' && availableLedgerDays.length > 1 && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-sans">台账日期过滤：</span>
                      <select
                        value={ledgerDayFilter}
                        onChange={(e) => setLedgerDayFilter(e.target.value)}
                        className="bg-transparent border-0 text-slate-800 font-mono text-xs focus:outline-none cursor-pointer font-bold"
                      >
                        <option value="all">全周期平铺 ({availableLedgerDays.length}天)</option>
                        {availableLedgerDays.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <ExportButton onClick={() => alert(`正在导出【${currentParkDetail.name}】微电网功率监测明细台账 (Excel)...`)} />
                </div>
              </div>
              <div className="overflow-x-auto max-w-full custom-scrollbar">
                <table
                  className="text-left text-xs border-collapse font-mono"
                  style={{ minWidth: `${Math.max(1080, 330 + displayedTablePoints.length * 68)}px` }}
                >
                  <thead>
                    <tr className="bg-slate-100 dark:bg-panel border-b border-slate-200 dark:border-border text-slate-700 dark:text-muted-foreground font-semibold font-sans h-[44px]">
                      <th className="py-2 px-3 sticky left-0 z-30 bg-slate-100 dark:bg-panel border-r border-slate-200 dark:border-border min-w-[150px] shadow-xs">
                        监测指标 / 物理量
                      </th>
                      <th className="py-2 px-3 sticky left-[150px] z-30 bg-slate-100 dark:bg-panel border-r border-slate-200 dark:border-border text-center min-w-[90px] shadow-xs">
                        {powerSummaryLabels.peak}
                      </th>
                      <th className="py-2 px-3 sticky left-[240px] z-30 bg-slate-100 dark:bg-panel border-r border-slate-200 dark:border-border text-center min-w-[90px] shadow-xs">
                        {powerSummaryLabels.avg}
                      </th>
                      {displayedTablePoints.map((pt) => (
                        <th
                          key={pt.fullTime || pt.time}
                          className="py-2 px-2 text-center min-w-[68px] font-mono text-xs whitespace-nowrap border-r border-slate-200/60 dark:border-border/60 text-slate-600 dark:text-muted-foreground font-medium"
                        >
                          {pt.columnLabel || pt.time}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-border/60 text-slate-700 dark:text-foreground">
                    {/* 行 1: 园区总负荷 (kW) */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors h-[44px]">
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-foreground font-sans sticky left-0 z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border flex items-center gap-1.5 h-[44px]">
                        <span className="size-2 rounded-full bg-slate-800 dark:bg-slate-200 shrink-0" />
                        <span>园区总负荷 (kW)</span>
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-foreground font-mono text-center sticky left-[150px] z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border">
                        {powerStats.load.max.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-600 dark:text-muted-foreground font-mono text-center sticky left-[240px] z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border">
                        {powerStats.load.avg.toLocaleString()}
                      </td>
                      {displayedTablePoints.map((pt) => (
                        <td
                          key={pt.fullTime || pt.time}
                          className="py-2 px-2 text-center font-mono font-bold text-slate-800 dark:text-foreground border-r border-slate-100 dark:border-border/60 whitespace-nowrap"
                        >
                          {pt.园区总负荷.toLocaleString()}
                        </td>
                      ))}
                    </tr>

                    {/* 行 2: 储能 (kW) */}
                    <tr className="hover:bg-amber-50/30 dark:hover:bg-amber-500/10 transition-colors h-[44px]">
                      <td className="py-2 px-3 font-bold text-amber-600 dark:text-amber-400 font-sans sticky left-0 z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border flex items-center gap-1.5 h-[44px]">
                        <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                        <span>储能 (kW)</span>
                      </td>
                      <td className="py-2 px-3 font-bold text-amber-600 dark:text-amber-400 font-mono text-center sticky left-[150px] z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border">
                        {powerStats.storage.max > 0 ? `+${powerStats.storage.max}` : `${powerStats.storage.max}`}
                      </td>
                      <td className="py-2 px-3 font-semibold text-amber-600 dark:text-amber-400 font-mono text-center sticky left-[240px] z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border">
                        {powerStats.storage.avg.toLocaleString()}
                      </td>
                      {displayedTablePoints.map((pt) => (
                        <td
                          key={pt.fullTime || pt.time}
                          className="py-2 px-2 text-center font-mono font-semibold text-amber-600 dark:text-amber-400 border-r border-slate-100 dark:border-border/60 whitespace-nowrap"
                        >
                          {pt.储能充放电 > 0
                            ? `+${pt.储能充放电} (放)`
                            : pt.储能充放电 < 0
                            ? `${pt.储能充放电} (充)`
                            : '0'}
                        </td>
                      ))}
                    </tr>

                    {/* 行 3: 光伏 (kW) */}
                    <tr className="hover:bg-emerald-50/30 dark:hover:bg-emerald-500/10 transition-colors h-[44px]">
                      <td className="py-2 px-3 font-bold text-emerald-600 dark:text-emerald-400 font-sans sticky left-0 z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border flex items-center gap-1.5 h-[44px]">
                        <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                        <span>光伏 (kW)</span>
                      </td>
                      <td className="py-2 px-3 font-bold text-emerald-600 dark:text-emerald-400 font-mono text-center sticky left-[150px] z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border">
                        {powerStats.pv.max.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-center sticky left-[240px] z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border">
                        {powerStats.pv.avg.toLocaleString()}
                      </td>
                      {displayedTablePoints.map((pt) => (
                        <td
                          key={pt.fullTime || pt.time}
                          className="py-2 px-2 text-center font-mono text-emerald-600 dark:text-emerald-400 font-semibold border-r border-slate-100 dark:border-border/60 whitespace-nowrap"
                        >
                          {pt.光伏出力.toLocaleString()}
                        </td>
                      ))}
                    </tr>

                    {/* 行 4: 市电 (kW) */}
                    <tr className="hover:bg-blue-50/30 dark:hover:bg-primary/10 transition-colors h-[44px]">
                      <td className="py-2 px-3 font-bold text-[#2C7CFF] dark:text-primary font-sans sticky left-0 z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border flex items-center gap-1.5 h-[44px]">
                        <span className="size-2 rounded-full bg-[#2C7CFF] shrink-0" />
                        <span>市电 (kW)</span>
                      </td>
                      <td className="py-2 px-3 font-bold text-[#2C7CFF] dark:text-primary font-mono text-center sticky left-[150px] z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border">
                        {powerStats.grid.max.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 font-semibold text-[#2C7CFF] dark:text-primary font-mono text-center sticky left-[240px] z-20 bg-white dark:bg-card border-r border-slate-200 dark:border-border">
                        {powerStats.grid.avg.toLocaleString()}
                      </td>
                      {displayedTablePoints.map((pt) => (
                        <td
                          key={pt.fullTime || pt.time}
                          className="py-2 px-2 text-center font-mono text-[#2C7CFF] dark:text-primary font-semibold border-r border-slate-100 dark:border-border/60 whitespace-nowrap"
                        >
                          {pt.市电受电.toLocaleString()}
                        </td>
                      ))}
                    </tr>
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
              {/* 卡片 1: 园区总用电量 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Zap className="size-4 text-blue-600" />
                    园区总用电量
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {timeDim === 'day'
                    ? `${(currentParkDetail.loadKw * 18.2).toLocaleString(undefined, { maximumFractionDigits: 0 })} `
                    : timeDim === 'month'
                    ? `${((currentParkDetail.loadKw * 18.2 * monthMaxDays) / 10000).toFixed(1)} `
                    : `${((currentParkDetail.loadKw * 18.2 * customDays) / 10000).toFixed(1)} `}
                  <span className="text-xs font-normal text-slate-500">{timeDim === 'day' ? 'kWh' : '万kWh'}</span>
                </div>
              </div>

              {/* 卡片 2: 储能充放电量 (更名规范) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <BatteryCharging className="size-4 text-amber-500" />
                    储能充放电量
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                      充电量
                    </div>
                    <div className="text-lg font-bold font-mono text-amber-600 truncate">
                      {timeDim === 'day'
                        ? Math.round(currentParkDetail.storageKw * 2.2).toLocaleString()
                        : timeDim === 'month'
                        ? ((currentParkDetail.storageKw * 2.2 * monthMaxDays) / 10000).toFixed(1)
                        : ((currentParkDetail.storageKw * 2.2 * customDays) / 10000).toFixed(1)}{' '}
                      <span className="text-[10px] font-normal text-slate-400 font-sans">{timeDim === 'day' ? 'kWh' : '万kWh'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                      放电量
                    </div>
                    <div className="text-lg font-bold font-mono text-emerald-600 truncate">
                      {timeDim === 'day'
                        ? Math.round(currentParkDetail.storageKw * 2.2 * 0.894).toLocaleString()
                        : timeDim === 'month'
                        ? ((currentParkDetail.storageKw * 2.2 * 0.894 * monthMaxDays) / 10000).toFixed(1)
                        : ((currentParkDetail.storageKw * 2.2 * 0.894 * customDays) / 10000).toFixed(1)}{' '}
                      <span className="text-[10px] font-normal text-slate-400 font-sans">{timeDim === 'day' ? 'kWh' : '万kWh'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 卡片 3: 光伏消纳量 (更名规范) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Sun className="size-4 text-emerald-500" />
                    光伏消纳量
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-600">
                  {timeDim === 'day'
                    ? `${(currentParkDetail.pvKw * 6.5).toLocaleString(undefined, { maximumFractionDigits: 0 })} `
                    : timeDim === 'month'
                    ? `${((currentParkDetail.pvKw * 6.5 * monthMaxDays) / 10000).toFixed(1)} `
                    : `${((currentParkDetail.pvKw * 6.5 * customDays) / 10000).toFixed(1)} `}
                  <span className="text-xs font-normal text-slate-500">{timeDim === 'day' ? 'kWh' : '万kWh'}</span>
                </div>
              </div>

              {/* 卡片 4: 市电用量 (更名规范) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Building2 className="size-4 text-[#2C7CFF]" />
                    市电用量
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#2C7CFF]">
                  {timeDim === 'day'
                    ? `${(currentParkDetail.loadKw * 11.2).toLocaleString(undefined, { maximumFractionDigits: 0 })} `
                    : timeDim === 'month'
                    ? `${((currentParkDetail.loadKw * 11.2 * monthMaxDays) / 10000).toFixed(1)} `
                    : `${((currentParkDetail.loadKw * 11.2 * customDays) / 10000).toFixed(1)} `}
                  <span className="text-xs font-normal text-slate-500">{timeDim === 'day' ? 'kWh' : '万kWh'}</span>
                </div>
              </div>
            </div>

            {/* 🌟 累计走势图 (源网荷储微电网电量累计走势曲线) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    微电网累计曲线
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-sans text-slate-500">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-slate-800" />园区累计用电</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#2C7CFF]" />市电累计用量</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" />光伏累计消纳</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" />储能累计放电</span>
                </div>
              </div>
              <LineTrend
                data={timeDim === 'day' ? dayCumulativeEnergyTrendData : timeDim === 'custom' ? customCumulativeEnergyTrendData : monthCumulativeEnergyTrendData}
                xKey="time"
                height={260}
                yUnit="kWh"
                xInterval={timeDim === 'day' ? 7 : 2}
                lines={[
                  { key: '园区累计用电', name: '园区累计用电 (kWh)', color: '#1e293b' },
                  { key: '市电累计用量', name: '市电累计用量 (kWh)', color: '#2C7CFF' },
                  { key: '光伏累计消纳', name: '光伏累计消纳 (kWh)', color: '#10b981' },
                  { key: '储能累计放电', name: '储能累计放电 (kWh)', color: '#fa8c16' },
                ]}
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/80 gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    监测明细
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <ExportButton onClick={() => alert(`正在导出【${currentParkDetail.name}】${timeDim === 'day' ? '电量明细台账' : '逐日电量台账'} (Excel)...`)} />
                </div>
              </div>
              <div className="overflow-x-auto max-h-[360px] custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-panel z-10">
                    <tr className="border-b border-slate-200 dark:border-border text-slate-700 dark:text-muted-foreground font-semibold font-sans h-[44px]">
                      <th className="py-2.5 px-3">{timeDim === 'day' ? '采样时间' : '统计日期'}</th>
                      <th className="py-2.5 px-3">园区总用电量 (kWh)</th>
                      <th className="py-2.5 px-3 text-amber-600 dark:text-amber-400">储能充放电量 (kWh)</th>
                      <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">光伏消纳量 (kWh)</th>
                      <th className="py-2.5 px-3 text-[#2C7CFF] dark:text-primary">市电用量 (kWh)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-border/60 text-slate-700 dark:text-foreground">
                    {filteredEnergyLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-blue-50/40 dark:hover:bg-primary/10 transition-colors h-[44px]">
                        <td className="py-2 px-3 font-semibold text-slate-900 dark:text-foreground font-sans">{row.time}</td>
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-foreground">{row.total}</td>
                        <td className="py-2 px-3 text-amber-600 dark:text-amber-400 font-bold">{row.storage}</td>
                        <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.pv}</td>
                        <td className="py-2 px-3 text-[#2C7CFF] dark:text-primary font-bold">{row.grid}</td>
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
        {/* ========================================================================= */}
        {viewMode === 'green' && (
          <>
            {/* 🌟 权威核算口径规范澄清 Banner (遵循国家发改委及零碳工厂标准) */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-[#2C7CFF] text-white flex items-center justify-center shrink-0">
                    <Info className="size-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    绿电与绿色电力证书 (GEC)
                  </h4>
                </div>
                <span className="text-[11px] font-sans text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                  发改运行〔2024〕1128号 / 零碳工厂评价标准
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-0.5 text-xs font-sans">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>物理认定绿电</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.2 rounded border border-emerald-200">权威主口径</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    园区实体物理实际消纳的绿色电力。核算公式：<strong className="text-slate-800">厂区光伏自发自用 + 购买绿电</strong>（证电合一+无证绿电），属于真实减碳实物电量。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#2C7CFF]">
                    <span className="size-2 rounded-full bg-[#2C7CFF] shrink-0" />
                    <span>购买绿电</span>
                    <span className="text-[10px] bg-blue-50 text-[#2C7CFF] px-1.5 py-0.2 rounded border border-blue-200">物理交易量</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    包含<strong className="text-slate-800">证电合一</strong>市场化交易绿电与<strong className="text-slate-800">无证绿电</strong>（电网物理调峰消纳），通过大电网物理输送至园区实际消纳。
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-bold text-purple-700">
                    <span className="size-2 rounded-full bg-purple-500 shrink-0" />
                    <span>购买绿证量</span>
                    <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.2 rounded border border-purple-200">纯环境权益</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    <strong className="text-purple-700">只购买了绿色电力证书 (GEC)</strong>，属于环境属性权益凭证，<strong className="text-rose-600">非物理绿电</strong>，不得重复计入物理绿电消纳量。
                  </p>
                </div>
              </div>
            </div>

            {/* 4 项核心绿电指标看板 (总用电量、物理认定绿电、购买绿电量、购买绿证量) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 1. 总用电量 */}
              <div
                onClick={() => setActiveGreenCard('total_power')}
                className={cn(
                  'bg-white p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'total_power'
                    ? 'border-[#2C7CFF] ring-2 ring-blue-500/20 bg-blue-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Zap className="size-4 text-[#2C7CFF]" />
                    总用电量
                  </span>
                  <span className="text-[10px] font-sans bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    全量负荷
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {timeDim === 'month'
                    ? `${((currentParkDetail.loadKw * 18.2 * monthMaxDays) / 10000).toFixed(1)} `
                    : `${((currentParkDetail.loadKw * 18.2 * customDays) / 10000).toFixed(1)} `}
                  <span className="text-xs font-normal text-slate-500">万kWh</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>绿电 / 市电</span>
                  <span className="text-slate-700 font-mono font-bold">
                    {timeDim === 'month'
                      ? `${((currentParkDetail.loadKw * 18.2 * monthMaxDays * 0.45) / 10000).toFixed(1)} / ${((currentParkDetail.loadKw * 18.2 * monthMaxDays * 0.55) / 10000).toFixed(1)} 万kWh`
                      : `${((currentParkDetail.loadKw * 18.2 * customDays * 0.45) / 10000).toFixed(1)} / ${((currentParkDetail.loadKw * 18.2 * customDays * 0.55) / 10000).toFixed(1)} 万kWh`}
                  </span>
                </div>
              </div>

              {/* 2. 物理认定绿电 (新增核心指标) */}
              <div
                onClick={() => setActiveGreenCard('physical_green')}
                className={cn(
                  'bg-white p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'physical_green'
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Leaf className="size-4 text-emerald-600" />
                    物理认定绿电
                  </span>
                  <span className="text-[10px] font-sans bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                    物理绿电
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-600">
                  {timeDim === 'month'
                    ? `${(((currentParkDetail.pvKw * 6.5 * 0.88 + currentParkDetail.loadKw * 18.2 * 0.28) * monthMaxDays) / 10000).toFixed(1)} `
                    : `${(((currentParkDetail.pvKw * 6.5 * 0.88 + currentParkDetail.loadKw * 18.2 * 0.28) * customDays) / 10000).toFixed(1)} `}
                  <span className="text-xs font-normal text-slate-500">万kWh</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 font-sans">
                  <span>光伏自发自用 + 购买绿电</span>
                  <span className="text-emerald-700 font-bold text-[11px]">真实物理消纳</span>
                </div>
              </div>

              {/* 3. 购买绿电量 (证电合一+无证绿电) */}
              <div
                onClick={() => setActiveGreenCard('trade')}
                className={cn(
                  'bg-white p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'trade'
                    ? 'border-[#2C7CFF] ring-2 ring-blue-500/20 bg-blue-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Zap className="size-4 text-[#2C7CFF]" />
                    购买绿电量
                  </span>
                  <span className="text-[10px] font-sans bg-blue-50 text-[#2C7CFF] px-1.5 py-0.5 rounded border border-blue-200 font-medium">
                    证电合一+无证
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#2C7CFF]">
                  {timeDim === 'month'
                    ? `${((currentParkDetail.loadKw * 18.2 * monthMaxDays * 0.28) / 10000).toFixed(1)} `
                    : `${((currentParkDetail.loadKw * 18.2 * customDays * 0.28) / 10000).toFixed(1)} `}
                  <span className="text-xs font-normal text-slate-500">万kWh</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 font-sans">
                  <span>电网物理输送交易</span>
                  <span className="text-[#2C7CFF] font-bold text-[11px]">物理量</span>
                </div>
              </div>

              {/* 4. 购买绿证量 (只购买了绿证，非物理绿电) */}
              <div
                onClick={() => setActiveGreenCard('cert')}
                className={cn(
                  'bg-white p-4 rounded-xl border transition-all cursor-pointer select-none space-y-2',
                  activeGreenCard === 'cert'
                    ? 'border-purple-600 ring-2 ring-purple-500/20 bg-purple-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                )}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-slate-700">
                    <Award className="size-4 text-purple-600" />
                    购买绿证量
                  </span>
                  <span className="text-[10px] font-sans bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 font-bold">
                    纯环境权益
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-purple-700">
                  {(currentParkDetail.gecCertificateCount ?? 85000).toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-500">张</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 font-sans">
                  <span>只购买了绿证</span>
                  <span className="text-purple-700 font-bold text-[11px]">非物理绿电</span>
                </div>
              </div>
            </div>

            {/* 🌟 核心时序走势图表 (根据 activeGreenCard 动态联动切换展示对应数据) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    {activeGreenCard === 'total_power' && '园区总用电量与用能构成'}
                    {activeGreenCard === 'physical_green' && '园区物理认定绿电对比'}
                    {activeGreenCard === 'trade' && '园区月度购买绿电数量对比'}
                    {activeGreenCard === 'cert' && '园区绿证购买数量对比'}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 font-mono">
                    {activeGreenCard === 'total_power' && '园区总用电量、市电量与绿电消纳量时序统计'}
                    {activeGreenCard === 'physical_green' && '物理认定绿电 = 光伏自发自用 + 购买绿电 (不含纯绿证)'}
                    {activeGreenCard === 'trade' && '证电合一 + 无证绿电 (物理交易电量按主要企业统计)'}
                    {activeGreenCard === 'cert' && '按主要企业 GEC 交易与核销张数统计 (只购买了绿证，非物理绿电)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`正在导出当前绿电时序曲线数据...`)}
                    className="flex items-center gap-1 text-[#2C7CFF] hover:underline font-sans cursor-pointer"
                  >
                    <Download className="size-3" />
                    导出曲线
                  </button>
                </div>
              </div>

              {/* 1. 总用电量 -> 显示园区月度总用电量与用能构成时序走势 */}
              {activeGreenCard === 'total_power' && (
                <LineTrend
                  data={totalPowerTrendData}
                  xKey="time"
                  height={260}
                  yUnit="kWh"
                  xInterval={2}
                  lines={[
                    { key: '总用电量', name: '总用电量 (kWh)', color: '#2C7CFF' },
                    { key: '市电量', name: '市电量 (kWh)', color: '#41C0FF' },
                    { key: '绿电消纳量', name: '绿电消纳量 (kWh)', color: '#00D492' },
                  ]}
                />
              )}

              {/* 2. 物理认定绿电 -> 走势与构成对比 */}
              {activeGreenCard === 'physical_green' && (
                <LineTrend
                  data={physicalGreenTrendData}
                  xKey="time"
                  height={260}
                  yUnit="万kWh"
                  lines={[
                    { key: '物理认定绿电', name: '物理认定绿电 (万kWh)', color: '#00D492' },
                    { key: '光伏自发自用', name: '光伏自发自用 (万kWh)', color: '#10b981' },
                    { key: '购买绿电', name: '购买绿电 (万kWh)', color: '#2C7CFF' },
                  ]}
                />
              )}

              {/* 3. 购买绿电量 -> 显示各个企业的绿电购买数量对比曲线 */}
              {activeGreenCard === 'trade' && (
                <LineTrend
                  data={enterpriseGreenTradeTrendData}
                  xKey="time"
                  height={260}
                  yUnit="万kWh"
                  lines={[
                    { key: '沈变本部', name: '沈变本部 (万kWh)', color: '#2C7CFF' },
                    { key: '衡变本部', name: '衡变本部 (万kWh)', color: '#10b981' },
                    { key: '超高压公司', name: '超高压公司 (万kWh)', color: '#8b5cf6' },
                    { key: '鲁缆本部', name: '鲁缆本部 (万kWh)', color: '#f59e0b' },
                    { key: '特变电工新疆电缆', name: '特变电工新疆电缆 (万kWh)', color: '#06b6d4' },
                    { key: '德缆公司', name: '德缆公司 (万kWh)', color: '#ec4899' },
                  ]}
                />
              )}

              {/* 4. 购买绿证量 -> 显示各个企业的绿证购买数量对比曲线 */}
              {activeGreenCard === 'cert' && (
                <LineTrend
                  data={enterpriseGreenCertTrendData}
                  xKey="time"
                  height={260}
                  yUnit="张"
                  lines={[
                    { key: '沈变本部', name: '沈变本部 (张)', color: '#2C7CFF' },
                    { key: '衡变本部', name: '衡变本部 (张)', color: '#10b981' },
                    { key: '超高压公司', name: '超高压公司 (张)', color: '#8b5cf6' },
                    { key: '鲁缆本部', name: '鲁缆本部 (张)', color: '#f59e0b' },
                    { key: '特变电工新疆电缆', name: '特变电工新疆电缆 (张)', color: '#06b6d4' },
                    { key: '德缆公司', name: '德缆公司 (张)', color: '#ec4899' },
                  ]}
                />
              )}
            </div>

            {/* 绿电与绿证交易台账明细 (增加口径属性列，区分物理绿电与纯绿证) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/80 gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    绿电台账
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEntryModalOpen(true)}
                    className="h-9 px-3 rounded-lg bg-[#2C7CFF] hover:bg-[#1E6BFF] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                    title="增加交易凭证"
                  >
                    <Plus className="size-3.5 text-white" />
                    <span>增加交易凭证</span>
                  </button>
                  <ExportButton onClick={() => alert(`正在导出【${currentParkDetail.name}】绿电绿证台账 (Excel)...`)} />
                </div>
              </div>
              <div className="overflow-x-auto max-h-[360px] custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-panel z-10">
                    <tr className="border-b border-slate-200 dark:border-border text-slate-700 dark:text-muted-foreground font-semibold font-sans h-[44px]">
                      <th className="py-2.5 px-4 w-[140px]">绿电类型</th>
                      <th className="py-2.5 px-4">绿电提供方 / 项目来源</th>
                      <th className="py-2.5 px-4 text-[#2C7CFF] dark:text-primary font-bold">购买方 / 消纳企业</th>
                      <th className="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">核算电量 / 张数</th>
                      <th className="py-2.5 px-4 font-bold text-slate-700 dark:text-foreground">口径属性</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-border/60 text-slate-700 dark:text-foreground">
                    {filteredCertList.map((row) => (
                      <tr key={row.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-500/10 transition-colors h-[44px]">
                        <td className="py-2 px-4">
                          <span
                            className={cn(
                              'px-2.5 py-1 rounded text-xs font-sans font-bold',
                              row.dealType === '光伏自用' || row.dealType === '直供绿电'
                                ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/30'
                                : row.dealType === '购买绿电' || row.dealType === '交易绿电'
                                ? 'bg-blue-50 dark:bg-primary/15 text-[#2C7CFF] dark:text-primary border border-blue-200/60 dark:border-primary/30'
                                : 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-200/60 dark:border-purple-500/30'
                            )}
                          >
                            {row.dealType === '直供绿电' ? '光伏自用' : row.dealType === '交易绿电' ? '购买绿电' : row.dealType === '交易绿证(GEC)' ? '购买绿证' : row.dealType}
                          </span>
                        </td>
                        <td className="py-2 px-4 font-sans text-slate-800 dark:text-foreground font-medium">{row.provider}</td>
                        <td className="py-2 px-4 font-sans">
                          <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 dark:text-foreground bg-blue-50/80 dark:bg-primary/10 px-2.5 py-1 rounded border border-blue-200/60 dark:border-primary/30 text-xs">
                            <Building2 className="size-3.5 text-[#2C7CFF] dark:text-primary" />
                            {row.buyer || '沈变本部'}
                          </span>
                        </td>
                        <td className="py-2 px-4 font-bold font-mono text-emerald-700 dark:text-emerald-400 text-sm">
                          {row.amount}
                        </td>
                        <td className="py-2 px-4 font-sans">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[11px] font-bold',
                              row.dealType.includes('绿证')
                                ? 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30'
                                : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                            )}
                          >
                            {row.dealType.includes('绿证') ? '纯绿证 (非物理绿电)' : '物理认定绿电'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* 模态框 Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2C7CFF] shrink-0">
                  <Plus className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    增加交易凭证
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEntryModalOpen(false)}
                className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 模态框 表单主体 */}
            <form onSubmit={handleSaveCert} className="p-6 space-y-4 text-xs overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* 1. 交易类型 */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    交易类型 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newCert.dealType}
                    onChange={(e) => setNewCert({ ...newCert, dealType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 text-xs font-sans cursor-pointer transition-colors"
                  >
                    <option value="交易绿电">交易绿电 (双边市场化交易 · 证电合一/无证物理绿电)</option>
                    <option value="直供绿电">直供绿电 (分布式光伏自发自用 · 物理绿电)</option>
                    <option value="交易绿证(GEC)">交易绿证(GEC) (国家绿色电力证书 · 纯环境权益，非物理绿电)</option>
                  </select>
                </div>

                {/* 2. 能源发电类型 */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    能源发电类型 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newCert.sourceType}
                    onChange={(e) => setNewCert({ ...newCert, sourceType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 text-xs font-sans cursor-pointer transition-colors"
                  >
                    <option value="集中式风电">集中式陆上风电</option>
                    <option value="屋顶光伏">屋顶分布式光伏</option>
                    <option value="光伏平价项目">集中式光伏平价项目</option>
                    <option value="自备电厂">生物质/其他绿电</option>
                  </select>
                </div>

                {/* 3. 绿电提供方 / 项目来源 */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    绿电提供方 / 项目来源 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 衡变特高压智造产业园4.2MWp光伏电站"
                    value={newCert.provider}
                    onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 text-xs font-sans transition-colors placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* 4. 购买方 / 消纳企业 */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    购买方 / 消纳企业 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newCert.buyer}
                    onChange={(e) => setNewCert({ ...newCert, buyer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer font-sans text-xs transition-colors"
                    required
                  >
                    <option value="">-- 请选择购买消纳企业 (精确到企业级) --</option>
                    <optgroup label="🏢 沈变公司">
                      <option value="沈变本部">沈变本部</option>
                      <option value="露娜公司 (特变电工露娜智能)">露娜公司 (特变电工露娜智能)</option>
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
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    核算电量 / 绿证张数 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 120.5 万kWh 或 15,000 张"
                    value={newCert.amount}
                    onChange={(e) => setNewCert({ ...newCert, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 text-xs font-mono transition-colors placeholder:font-sans placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* 6. 结算单价 */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">结算单价</label>
                  <input
                    type="text"
                    placeholder="例如: 0.450 元/kWh 或 15.5 元/张"
                    value={newCert.unitPrice}
                    onChange={(e) => setNewCert({ ...newCert, unitPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 text-xs font-mono transition-colors placeholder:font-sans placeholder:text-slate-400"
                  />
                </div>

                {/* 7. 交易与核销交割日期 */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">交易与交割核销日期</label>
                  <input
                    type="date"
                    value={newCert.dealDate}
                    onChange={(e) => setNewCert({ ...newCert, dealDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 text-xs font-mono cursor-pointer transition-colors"
                  />
                </div>

                {/* 8. GEC 证书/交割合约编码 */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">GEC 证书 / 交割合约编码</label>
                  <input
                    type="text"
                    placeholder="例如: GEC-2026-HB-88902 或 合约编号"
                    value={newCert.certCode}
                    onChange={(e) => setNewCert({ ...newCert, certCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 text-xs font-mono transition-colors placeholder:font-sans placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* 模态框 Footer 操作区 */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
                <span className="text-[11px] text-slate-400 font-sans flex items-center gap-1">
                  💡 录入凭据将自动记入工业微电网绿电台账，并实时联动测算园区消纳率。
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEntryModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#2C7CFF] hover:bg-[#1E6BFF] text-white font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
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

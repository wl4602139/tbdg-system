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
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 15 个零碳产业园区电力与微电网全景数据字典
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
  greenRate: number
  voltage: string
  feedInTariff: string
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
    pvSavings: '¥42.6万/月',
    surplusRevenue: '¥8.6万/月',
    greenRate: 38.9,
    voltage: '10kV / 35kV / 110kV',
    feedInTariff: '0.250 ~ 0.450 元/kWh (各省标杆上网价)',
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
    pvSavings: '¥42.6万/月',
    surplusRevenue: '¥8.6万/月',
    greenRate: 38.9,
    voltage: '10.22 kV',
    feedInTariff: '0.375 元/kWh (辽宁燃煤基准价)',
    gridPoints: [
      { name: '开户并网点 A (沈变本部 10kV 第一开闭所)', accountName: '沈变本部', voltage: '10.22 kV', loadKw: 4680, status: '正常' },
      { name: '开户并网点 B (和新套管 10kV 专用变电所)', accountName: '和新套管', voltage: '10.20 kV', loadKw: 3540, status: '正常' },
      { name: '开户并网点 C (西变互感器 10kV 配电所)', accountName: '西变互感器', voltage: '10.25 kV', loadKw: 2450, status: '正常' },
    ],
  },
  park_02: {
    id: 'park_02',
    name: '特变电工南方输变电产业园',
    fullName: '特变电工南方输变电产业园 (衡阳)',
    location: '衡阳市',
    company: '衡变公司主基地',
    loadKw: 11200,
    pvKw: 4100,
    storageKw: 1000,
    pvSavings: '¥38.2万/月',
    surplusRevenue: '¥7.4万/月',
    greenRate: 36.6,
    voltage: '10.18 kV',
    feedInTariff: '0.450 元/kWh (湖南标杆价)',
    gridPoints: [
      { name: '开户并网点 A (衡变超高压 35kV 变电站)', accountName: '衡变超高压', voltage: '35.20 kV', loadKw: 6200, status: '正常' },
      { name: '开户并网点 B (特种变压器 10kV 开闭所)', accountName: '特种变压器', voltage: '10.15 kV', loadKw: 3200, status: '正常' },
      { name: '开户并网点 C (南方智能电气 10kV 配电所)', accountName: '南方智能电气', voltage: '10.18 kV', loadKw: 1800, status: '正常' },
    ],
  },
  park_03: {
    id: 'park_03',
    name: '特变电工二次产业园区',
    fullName: '特变电工二次产业园区 (南京)',
    location: '南京市',
    company: '南京二次智能电气',
    loadKw: 4200,
    pvKw: 1600,
    storageKw: 500,
    pvSavings: '¥14.5万/月',
    surplusRevenue: '¥2.8万/月',
    greenRate: 38.1,
    voltage: '10.15 kV',
    feedInTariff: '0.391 元/kWh',
    gridPoints: [
      { name: '开户并网点 A (二次电力自动化配电所)', accountName: '二次自动化', voltage: '10.15 kV', loadKw: 2400, status: '正常' },
      { name: '开户并网点 B (研发测试中心 10kV 专变)', accountName: '研发中心', voltage: '10.12 kV', loadKw: 1800, status: '正常' },
    ],
  },
}

export default function MicrogridPage() {
  const [selectedParkNode, setSelectedParkNode] = useState<StandardOrgNode>({
    id: 'park_01',
    name: '东北输变电产业园',
    level: 'park',
    badge: '沈阳',
  })

  // 🌟 选项维度：'power' (功率) | 'energy' (电量)
  const [viewMode, setViewMode] = useState<'power' | 'energy'>('power')
  // 🌟 时间维度与范围筛选 (月度 / 季度 / 年度)
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [queryDate, setQueryDate] = useState('2026-08-27')
  const [showAddTradeModal, setShowAddTradeModal] = useState(false)
  const [tradeForm, setTradeForm] = useState({
    company: '沈变公司',
    period: '2026-08',
    greenElecKWh: '1,200,000',
    greenCertificateCount: 1200,
    voucherNo: 'TBEA-GC-20260805',
  })

  const [tableSearchKey, setTableSearchKey] = useState('')
  const [tableChannelFilter, setTableChannelFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // 15分钟粒度采样明细台账假数据生成 (功率模式)
  const detailedLedgerData = useMemo(() => {
    const records = []
    const points = [
      { point: '10kV 第一开闭所进线 (沈变本部)', voltage: '10.22 kV' },
      { point: '10kV 专用变电所进线 (和新套管)', voltage: '10.20 kV' },
      { point: '10kV 配电所进线 (西变互感器)', voltage: '10.25 kV' },
      { point: '屋顶光伏 1# 逆变升压并网点', voltage: '10.21 kV' },
      { point: '储能电站变流充放一体舱', voltage: '10.20 kV' },
    ]

    const times = [
      '12:00', '11:45', '11:30', '11:15',
      '11:00', '10:45', '10:30', '10:15',
      '10:00', '09:45', '09:30', '09:15',
      '09:00', '08:45', '08:30', '08:15',
      '08:00', '07:45', '07:30', '07:15',
    ]

    times.forEach((t, idx) => {
      const pIdx = idx % points.length
      const p = points[pIdx]
      const isDaytime = parseInt(t.split(':')[0]) >= 8 && parseInt(t.split(':')[0]) <= 18
      const pv = isDaytime ? Math.round(4850 * (0.7 + (idx % 4) * 0.08)) : 0
      const storage = idx % 2 === 0 ? 1200 : -600
      const totalLoad = Math.round(12450 * (0.85 + (idx % 5) * 0.03))
      const gridLoad = Math.max(0, totalLoad - pv - (storage > 0 ? storage : 0))

      records.push({
        id: `rec-${idx + 1}`,
        time: `${queryDate} ${t}:00`,
        pointName: p.point,
        totalLoadKw: totalLoad,
        gridLoadKw: gridLoad,
        pvKw: pv,
        storageKw: storage,
        voltage: p.voltage,
        cosPhi: (0.97 + (idx % 3) * 0.01).toFixed(2),
        status: '正常',
      })
    })

    return records
  }, [queryDate])

  const filteredLedger = useMemo(() => {
    return detailedLedgerData.filter((r) => {
      const matchKw = !tableSearchKey.trim() || 
        r.time.includes(tableSearchKey) || 
        r.pointName.includes(tableSearchKey)
      return matchKw
    })
  }, [detailedLedgerData, tableSearchKey])

  const currentParkDetail = useMemo(() => {
    return PARK_GRID_MAP[selectedParkNode.id] || PARK_GRID_MAP['park_01']
  }, [selectedParkNode.id])

  // 24 小时源网荷储功率平衡曲线
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

  // 🌟 24 小时微电网电量统计趋势数据 (电量模式)
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

  // 🌟 电量逐小时明细台账数据 (电量模式)
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

  const filteredEnergyLedger = useMemo(() => {
    return detailedEnergyLedgerData.filter((r) => {
      return !tableSearchKey.trim() || r.time.includes(tableSearchKey)
    })
  }, [detailedEnergyLedgerData, tableSearchKey])

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
        {/* 1. 页面标题 + 功率/电量 + 统一时间筛选与导出 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shrink-0">
              <Zap className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">工业微电网监测</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 🌟 选项 “功率、电量” */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-sans text-xs">
              <button
                type="button"
                onClick={() => setViewMode('power')}
                className={cn(
                  'px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer select-none',
                  viewMode === 'power'
                    ? 'bg-[#1677ff] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                )}
              >
                功率
              </button>
              <button
                type="button"
                onClick={() => setViewMode('energy')}
                className={cn(
                  'px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer select-none',
                  viewMode === 'energy'
                    ? 'bg-[#1677ff] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                )}
              >
                电量
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200" />

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

            {/* 时间范围选择控件 (随维度自适应切换) */}
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
                  <option value="2025-Q4">2025年 第4季度 (Q4)</option>
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
                  <option value="2024">2024 年度</option>
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

        {/* 时间筛选与绿电录入操作栏 */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="size-4 text-[#1677ff]" />
              <span>
                {viewMode === 'power' ? '历史数据 15 分钟颗粒度查询:' : '历史数据逐小时电量查询:'}
              </span>
            </span>
            <input
              type="date"
              value={queryDate}
              onChange={(e) => setQueryDate(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-mono text-slate-800 focus:outline-none focus:border-[#1677ff]"
            />
            <span className="text-slate-400 font-mono">
              {viewMode === 'power' ? '默认展示当天实时采样数据' : '默认展示当天累计电量台账'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddTradeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="size-3.5" />
            <span>+ 手动录入绿电/绿证购买</span>
          </button>
        </div>

        {/* 顶部 4 大核心 KPI 监控舱 (功率 / 电量 自适应联动) */}
        {viewMode === 'power' ? (
          /* ===== 功率模式 KPI ===== */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 font-mono">
            {/* 1. 总负荷 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
                <span className="flex items-center gap-1 font-bold">
                  <Gauge className="size-3.5 text-slate-700" />
                  总负荷
                </span>
                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">运行总功率</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {currentParkDetail.loadKw.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className="font-bold text-red-500 font-mono">+3.2% ↑</span>
              </div>
            </div>

            {/* 2. 市电负荷 */}
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-blue-800 font-sans">
                <span className="flex items-center gap-1 font-bold">
                  <Zap className="size-3.5 text-blue-600" />
                  市电负荷
                </span>
                <span className="px-1.5 py-0.2 rounded bg-blue-100 text-[#1677ff] text-[10px] font-bold">电网受电</span>
              </div>
              <div className="text-2xl font-extrabold text-[#1677ff]">
                {(currentParkDetail.loadKw - currentParkDetail.pvKw > 0 ? currentParkDetail.loadKw - currentParkDetail.pvKw : 7600).toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
              </div>
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className="font-bold text-emerald-600 font-mono">-5.8% ↓</span>
              </div>
            </div>

            {/* 3. 光伏出力 */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-sans">
                <span className="flex items-center gap-1 font-bold">
                  <Sun className="size-3.5 text-emerald-600" />
                  光伏出力
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">发用平衡</span>
              </div>
              <div className="text-2xl font-extrabold text-emerald-700">
                {currentParkDetail.pvKw.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
              </div>
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className="font-bold text-emerald-600 font-mono">+12.4% ↑</span>
              </div>
            </div>

            {/* 4. 储能充放电功率 */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-amber-800 font-sans">
                <span className="flex items-center gap-1 font-bold">
                  <BatteryCharging className="size-3.5 text-amber-600" />
                  储能充放电功率
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">削峰填谷</span>
              </div>
              <div className="text-2xl font-extrabold text-amber-700">
                {currentParkDetail.storageKw.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
              </div>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className="font-bold text-emerald-600 font-mono">+8.1% ↑</span>
              </div>
            </div>
          </div>
        ) : (
          /* ===== 电量模式 KPI ===== */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 font-mono">
            {/* 1. 园区总用电量 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
                <span className="flex items-center gap-1 font-bold">
                  <Gauge className="size-3.5 text-slate-700" />
                  园区总用电量
                </span>
                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">当日累计用电</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {Math.round(currentParkDetail.loadKw * 15.6).toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kWh</span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className="font-bold text-emerald-600 font-mono">-2.6% ↓</span>
              </div>
            </div>

            {/* 2. 市网购电量 */}
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-blue-800 font-sans">
                <span className="flex items-center gap-1 font-bold">
                  <Zap className="size-3.5 text-blue-600" />
                  市网购电量
                </span>
                <span className="px-1.5 py-0.2 rounded bg-blue-100 text-[#1677ff] text-[10px] font-bold">外部网电受入</span>
              </div>
              <div className="text-2xl font-extrabold text-[#1677ff]">
                {Math.round((currentParkDetail.loadKw - currentParkDetail.pvKw > 0 ? currentParkDetail.loadKw - currentParkDetail.pvKw : 7600) * 14.8).toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kWh</span>
              </div>
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className="font-bold text-emerald-600 font-mono">-5.4% ↓</span>
              </div>
            </div>

            {/* 3. 光伏发电量 */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-sans">
                <span className="flex items-center gap-1 font-bold">
                  <Sun className="size-3.5 text-emerald-600" />
                  光伏发电量
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">绿色消纳</span>
              </div>
              <div className="text-2xl font-extrabold text-emerald-700">
                {Math.round(currentParkDetail.pvKw * 7.5).toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kWh</span>
              </div>
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className="font-bold text-emerald-600 font-mono">+14.2% ↑</span>
              </div>
            </div>

            {/* 4. 储能放/充电量 */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-amber-800 font-sans">
                <span className="flex items-center gap-1 font-bold">
                  <BatteryCharging className="size-3.5 text-amber-600" />
                  储能放/充电量
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">充放循环电量</span>
              </div>
              <div className="text-2xl font-extrabold text-amber-700">
                {Math.round(currentParkDetail.storageKw * 4.2).toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kWh</span>
              </div>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className="font-bold text-emerald-600 font-mono">+9.6% ↑</span>
              </div>
            </div>
          </div>
        )}

        {/* 中部图表：24 小时微电网走势曲线 (功率 / 电量) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-900">
                {viewMode === 'power'
                  ? `【${currentParkDetail.name}】24 小时源网荷储微电网合并平衡曲线 (实时 / kW)`
                  : `【${currentParkDetail.name}】24 小时微电网电量平衡与逐时消纳走势 (累计 / kWh)`}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-sans">
              {viewMode === 'power' ? (
                <>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-slate-900" />园区总负荷</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" />光伏出力</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#1677ff]" />市电受电</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" />储能充放电</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-slate-900" />园区总用电</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" />光伏发电</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#1677ff]" />市网购电</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" />储能充放</span>
                </>
              )}
            </div>
          </div>

          <div className="h-[280px]">
            {viewMode === 'power' ? (
              <LineTrend
                data={dayTrendData}
                xKey="time"
                height={280}
                lines={[
                  { key: '园区总负荷', name: '园区总负荷 (kW)', color: '#0f172a' },
                  { key: '光伏出力', name: '光伏实时出力 (kW)', color: '#10b981' },
                  { key: '市电受电', name: '市电受电功率 (kW)', color: '#1677ff' },
                  { key: '储能充放电', name: '储能充放电 (kW)', color: '#f59e0b' },
                ]}
              />
            ) : (
              <LineTrend
                data={dayEnergyTrendData}
                xKey="time"
                height={280}
                lines={[
                  { key: '园区总用电', name: '园区总用电量 (kWh)', color: '#0f172a' },
                  { key: '光伏发电', name: '光伏发电量 (kWh)', color: '#10b981' },
                  { key: '市网购电', name: '市网购电量 (kWh)', color: '#1677ff' },
                  { key: '储能充放', name: '储能充放量 (kWh)', color: '#f59e0b' },
                ]}
              />
            )}
          </div>
        </div>

        {/* 底部台账：监测数据明细台账 (功率 / 电量) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
          <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#1677ff] shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {viewMode === 'power'
                  ? `【${currentParkDetail.name}】监测数据明细台账`
                  : `【${currentParkDetail.name}】微电网电量统计明细台账 (逐小时)`}
              </h3>
            </div>

            <div className="flex items-center gap-2.5">
              {/* 搜索过滤框 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={viewMode === 'power' ? '搜索采样时间...' : '搜索统计时间...'}
                  value={tableSearchKey}
                  onChange={(e) => setTableSearchKey(e.target.value)}
                  className="pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#1677ff] w-44"
                />
                <Search className="size-3.5 text-slate-400 absolute left-2 top-2" />
              </div>

              {/* 导出按钮 */}
              <button
                type="button"
                onClick={() => alert(`正在导出【${currentParkDetail.name}】${queryDate} ${viewMode === 'power' ? '功率采样' : '电量统计'}明细台账 (Excel)...`)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs cursor-pointer transition-colors"
              >
                <Download className="size-3.5 text-slate-500" />
                <span>导出</span>
              </button>
            </div>
          </div>

          {/* 明细台账数据表 */}
          <div className="overflow-x-auto">
            {viewMode === 'power' ? (
              /* ===== 功率明细表 ===== */
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold font-sans">
                    <th className="py-2.5 px-3">采样时间</th>
                    <th className="py-2.5 px-3 text-right">园区总负荷 (kW)</th>
                    <th className="py-2.5 px-3 text-right">市电受电 (kW)</th>
                    <th className="py-2.5 px-3 text-right">光伏实时出力 (kW)</th>
                    <th className="py-2.5 px-3 text-right">储能充放 (kW)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredLedger.map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{row.time}</td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">{row.totalLoadKw.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-[#1677ff] font-bold">{row.gridLoadKw.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">{row.pvKw.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">
                        {row.storageKw >= 0 ? (
                          <span className="text-amber-700 font-bold">+{row.storageKw} (放)</span>
                        ) : (
                          <span className="text-blue-600 font-bold">{row.storageKw} (充)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* ===== 电量明细表 ===== */
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold font-sans">
                    <th className="py-2.5 px-3">统计时间</th>
                    <th className="py-2.5 px-3 text-right">园区总用电量 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">市网购电量 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">光伏发电量 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">储能充/放电量 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">绿电消纳占比 (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredEnergyLedger.map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{row.time}</td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">{row.totalEnergyKWh.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-[#1677ff] font-bold">{row.gridEnergyKWh.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">{row.pvEnergyKWh.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">
                        {row.storageEnergyKWh >= 0 ? (
                          <span className="text-amber-700 font-bold">+{row.storageEnergyKWh} (放)</span>
                        ) : (
                          <span className="text-blue-600 font-bold">{row.storageEnergyKWh} (充)</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{row.greenRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 表格底部分页与汇总 */}
          <div className="p-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-sans bg-slate-50/40 text-slate-500">
            <div>
              {viewMode === 'power' ? (
                <>
                  共 <strong className="text-slate-800 font-mono">96</strong> 条采样记录 · 采样频率：<strong className="text-slate-800 font-mono">15 min</strong> · 今日在线率：<strong className="text-emerald-700 font-mono">100.0%</strong>
                </>
              ) : (
                <>
                  共 <strong className="text-slate-800 font-mono">24</strong> 条逐时电量记录 · 统计频率：<strong className="text-slate-800 font-mono">1 hour</strong> · 综合绿电消纳率：<strong className="text-emerald-700 font-mono">{currentParkDetail.greenRate}%</strong>
                </>
              )}
            </div>

            <div className="flex items-center gap-1 font-mono">
              <button
                type="button"
                className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50 text-xs"
                disabled
              >
                上一页
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-[#1677ff] text-white font-bold text-xs shadow-2xs"
              >
                1
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer text-xs"
              >
                2
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer text-xs"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

{/* 绿电录入弹窗 */}
      {showAddTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Plus className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">录入外部市场化绿电交易凭单</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTradeModal(false)}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert(`已成功录入【${tradeForm.company}】${tradeForm.period} 绿电交易凭证！`)
                setShowAddTradeModal(false)
              }}
              className="p-4 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">所属直属基地：</label>
                  <select
                    value={tradeForm.company}
                    onChange={(e) => setTradeForm({ ...tradeForm, company: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="沈变公司">沈变公司 (东北产业园)</option>
                    <option value="衡变公司">衡变公司 (南方产业园)</option>
                    <option value="新变厂">新变厂 (新疆产业园)</option>
                    <option value="鲁缆公司">鲁缆公司 (新泰产业园)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">核销结算月份：</label>
                  <input
                    type="month"
                    value={tradeForm.period}
                    onChange={(e) => setTradeForm({ ...tradeForm, period: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">购买绿电量 (kWh)：</label>
                  <input
                    type="text"
                    value={tradeForm.greenElecKWh}
                    onChange={(e) => setTradeForm({ ...tradeForm, greenElecKWh: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">配套绿证张数 (GEC)：</label>
                  <input
                    type="number"
                    value={tradeForm.greenCertificateCount}
                    onChange={(e) => setTradeForm({ ...tradeForm, greenCertificateCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
                提示：录入后将自动完成该园区当月绿电抵扣，并同步抵消组织碳核算与产品碳足迹中的外购电力排放（按 0.5703 tCO2/MWh 计算）。
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTradeModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-2xs cursor-pointer"
                >
                  确认录入核销
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

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
  Download,
  Building2,
  Check,
  X,
  MapPin,
  Maximize2,
  Search,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { OnlineHeader } from '@/components/shared/online-header'
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
    name: '特变电工所属园区 (15 园区全域汇总)',
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

  // 15分钟粒度采样明细台账假数据生成
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

  return (
    <div className="flex gap-3.5 items-start">
      {/* 左侧 270px 经典工业级拓扑树 (15个零碳产业园区) */}
      <StandardOrgTree
        treeType="park"
        selectedId={selectedParkNode.id}
        onSelect={(node) => setSelectedParkNode(node)}
      />

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 1. 顶部 Header 与 3 大核心监测板块 Tab */}
        <OnlineHeader />
        {/* 时间筛选与绿电录入操作栏 */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="size-4 text-[#1677ff]" />
              <span>历史数据 15 分钟颗粒度查询:</span>
            </span>
            <input
              type="date"
              value={queryDate}
              onChange={(e) => setQueryDate(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-mono text-slate-800 focus:outline-none focus:border-[#1677ff]"
            />
            <span className="text-slate-400 font-mono">默认展示当天实时采样数据</span>
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

        {/* 顶部 4 大核心遥测 KPI 监控舱 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="flex items-center gap-1 font-bold">
                <Zap className="size-3.5 text-blue-600" />
                园区受电总负荷 (市电)
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] text-[10px] font-bold">受电在线</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {currentParkDetail.loadKw.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-sans flex justify-between">
              <span>进线电压: {currentParkDetail.voltage}</span>
              <span className="text-blue-600 font-bold">总负荷平稳</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-sans">
              <span className="flex items-center gap-1 font-bold">
                <Sun className="size-3.5 text-emerald-600" />
                光伏实时出力与收益
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">发用平衡</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">
              {currentParkDetail.pvKw.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
            </div>
            <div className="text-[11px] text-slate-600 pt-1 border-t border-emerald-200/60 font-sans flex justify-between">
              <span>光伏发电节费: <strong className="text-emerald-700">{currentParkDetail.pvSavings}</strong></span>
              <span className="text-emerald-700 font-bold">消纳 100%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-800 font-sans">
              <span className="flex items-center gap-1 font-bold">
                <BatteryCharging className="size-3.5 text-amber-600" />
                储能充放电实时功率
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">削峰填谷</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-700">
              {currentParkDetail.storageKw.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
            </div>
            <div className="text-[11px] text-slate-600 pt-1 border-t border-amber-200/60 font-sans flex justify-between">
              <span>夜间低谷储电，白天释放</span>
              <span className="text-amber-700 font-bold">充放充裕</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-blue-800 font-sans">
              <span className="flex items-center gap-1 font-bold">
                <Coins className="size-3.5 text-blue-600" />
                余电上网收益与电价
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">收益测算</span>
            </div>
            <div className="text-2xl font-extrabold text-[#1677ff]">
              {currentParkDetail.surplusRevenue}
            </div>
            <div className="text-[11px] text-slate-600 pt-1 border-t border-blue-200/60 font-sans flex justify-between">
              <span>基准上网价: 0.375 元/kWh</span>
              <span className="text-blue-700 font-bold">按月结算</span>
            </div>
          </div>
        </div>

        {/* 24 小时源网荷储微电网合并平衡曲线 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-900">
                【{currentParkDetail.name}】24 小时源网荷储微电网合并平衡曲线 (实时 / kW)
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-sans">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-slate-900" />园区总负荷</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" />光伏出力</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#1677ff]" />市电受电</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" />储能充放电</span>
            </div>
          </div>

          <div className="h-[280px]">
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
          </div>
        </div>

        {/* 监测数据明细台账 (15分钟粒度采样) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
          <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#1677ff] shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                【{currentParkDetail.name}】监测数据明细台账
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] font-mono font-bold">
                15分钟粒度连续采样 · SCADA 实时校准
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* 搜索过滤框 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索点位名称/采样时间..."
                  value={tableSearchKey}
                  onChange={(e) => setTableSearchKey(e.target.value)}
                  className="pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#1677ff] w-48"
                />
                <Search className="size-3.5 text-slate-400 absolute left-2 top-2" />
              </div>

              {/* 导出按钮 */}
              <button
                type="button"
                onClick={() => alert(`正在导出【${currentParkDetail.name}】${queryDate} 监测数据明细台账 (Excel)...`)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs cursor-pointer transition-colors"
              >
                <Download className="size-3.5 text-slate-500" />
                <span>导出明细</span>
              </button>
            </div>
          </div>

          {/* 明细台账数据表 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold font-sans">
                  <th className="py-2.5 px-3">采样时间</th>
                  <th className="py-2.5 px-3">监测并网点位 / 变电回路</th>
                  <th className="py-2.5 px-3 text-right">园区总负荷 (kW)</th>
                  <th className="py-2.5 px-3 text-right">市电受电 (kW)</th>
                  <th className="py-2.5 px-3 text-right">光伏实时出力 (kW)</th>
                  <th className="py-2.5 px-3 text-right">储能充放 (kW)</th>
                  <th className="py-2.5 px-3 text-center">母线电压</th>
                  <th className="py-2.5 px-3 text-center">功率因数</th>
                  <th className="py-2.5 px-3 text-center">遥测状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{row.time}</td>
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{row.pointName}</td>
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
                    <td className="py-2.5 px-3 text-center text-slate-600">{row.voltage}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">{row.cosPhi}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        正常
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 表格底部分页与汇总 */}
          <div className="p-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-sans bg-slate-50/40 text-slate-500">
            <div>
              共 <strong className="text-slate-800 font-mono">96</strong> 条采样记录 · 采样频率：<strong className="text-slate-800 font-mono">15 min</strong> · 今日在线率：<strong className="text-emerald-700 font-mono">100.0%</strong>
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
                3
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

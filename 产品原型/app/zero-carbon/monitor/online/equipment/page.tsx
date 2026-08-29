'use client'

import React, { useState, useMemo } from 'react'
import {
  Cpu,
  Zap,
  Flame,
  Droplets,
  Wind,
  Search,
  ChevronRight,
  ChevronDown,
  Building2,
  Calendar,
  Download,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  Info,
  Activity,
} from 'lucide-react'
import { LineTrend, BarChartGroup, Donut, AreaTrend } from '@/components/shared/charts'
import { OnlineHeader } from '@/components/shared/online-header'
import { cn } from '@/lib/utils'

interface KeyEquipmentInfo {
  id: string
  name: string
  code: string
  company: string
  location: string
  status: '运行中' | '待机' | '检修'
  powerKW: number
  energyKWh: number
  mediumTag: string
  steamFlowT?: number
  gasFlowM3?: number
  pressureMpa?: number
  temperatureC?: number
  powerYoy?: string
  energyYoy?: string
  flowYoy?: string
  pressureYoy?: string
}

const KEY_EQUIPMENT_LIST: KeyEquipmentInfo[] = [
  { id: 'eq-dry-01', name: '1# 1000kV级气相白真空干燥罐组', code: 'EQ-SB-DRY-01', company: '沈变公司', location: '特高压一车间', status: '运行中', powerKW: 4680, energyKWh: 112340, mediumTag: '电·汽', steamFlowT: 1.85, pressureMpa: 0.005, temperatureC: 135.2, powerYoy: '-4.2% ↓', energyYoy: '-3.8% ↓', flowYoy: '-5.1% ↓', pressureYoy: '+0.2% ↑' },
  { id: 'eq-dry-02', name: '2# 特高压变压器煤油汽相干燥罐', code: 'EQ-SB-DRY-02', company: '沈变公司', location: '特高压二车间', status: '运行中', powerKW: 3950, energyKWh: 94800, mediumTag: '电·汽', steamFlowT: 1.62, pressureMpa: 0.006, temperatureC: 132.8, powerYoy: '-3.5% ↓', energyYoy: '-4.1% ↓', flowYoy: '-2.8% ↓', pressureYoy: '+0.1% ↑' },
  { id: 'eq-dry-03', name: '3# 500kV 悬垂立塔交联生产线', code: 'EQ-LL-VUL-01', company: '鲁缆公司', location: '超高压立塔车间', status: '运行中', powerKW: 3850, energyKWh: 92400, mediumTag: '电·汽', steamFlowT: 2.10, pressureMpa: 1.85, temperatureC: 210.5, powerYoy: '+1.8% ↑', energyYoy: '-2.4% ↓', flowYoy: '-3.6% ↓', pressureYoy: '-0.5% ↓' },
  { id: 'eq-dry-04', name: '4# 连续硫化橡胶挤塑机组', code: 'EQ-LL-VUL-02', company: '鲁缆公司', location: '橡缆挤塑车间', status: '运行中', powerKW: 1620, energyKWh: 38880, mediumTag: '电·水', pressureMpa: 0.65, temperatureC: 175.0, powerYoy: '-5.2% ↓', energyYoy: '-4.7% ↓', flowYoy: '—', pressureYoy: '+0.3% ↑' },
  { id: 'eq-dry-05', name: '5# 铁心纵剪硅钢片十头纵剪线', code: 'EQ-XB-SHR-01', company: '新变厂', location: '铁心智造中心', status: '运行中', powerKW: 2120, energyKWh: 50880, mediumTag: '电', pressureMpa: 0.0, temperatureC: 28.5, powerYoy: '-2.1% ↓', energyYoy: '-3.3% ↓', flowYoy: '—', pressureYoy: '—' },
  { id: 'eq-dry-06', name: '6# 煤油喷淋回收及热循环系统', code: 'EQ-HB-REC-01', company: '衡变公司', location: '干燥辅助站房', status: '运行中', powerKW: 1050, energyKWh: 25200, mediumTag: '电·气', gasFlowM3: 45.2, pressureMpa: 0.42, temperatureC: 85.0, powerYoy: '-6.4% ↓', energyYoy: '-5.9% ↓', flowYoy: '-4.8% ↓', pressureYoy: '+0.1% ↑' },
  { id: 'eq-dry-07', name: '7# 35kV及以下三层共挤交联生产线', code: 'EQ-XL-VUL-01', company: '新缆厂', location: '中压交联车间', status: '运行中', powerKW: 2350, energyKWh: 56400, mediumTag: '电·汽', steamFlowT: 1.45, pressureMpa: 1.20, temperatureC: 198.0, powerYoy: '-3.1% ↓', energyYoy: '-2.8% ↓', flowYoy: '-3.0% ↓', pressureYoy: '+0.1% ↑' },
  { id: 'eq-dry-08', name: '8# 铝合金杆连铸连轧机组', code: 'EQ-DL-CAS-01', company: '德缆公司', location: '连铸连轧车间', status: '运行中', powerKW: 3100, energyKWh: 74400, mediumTag: '电·水', pressureMpa: 0.55, temperatureC: 85.0, powerYoy: '-4.5% ↓', energyYoy: '-3.9% ↓', flowYoy: '—', pressureYoy: '-0.2% ↓' },
]

export default function EquipmentPage() {
  const [selectedEqId, setSelectedEqId] = useState<string>('eq-dry-01')
  const [eqSearchKw, setEqSearchKw] = useState('')

  // 拓扑树折叠展开状态 (1级节点默认展开，支持用户点击收起/展开；2级节点也可独立收起/展开)
  const [isRootCollapsed, setIsRootCollapsed] = useState(false)
  const [collapsedCompanies, setCollapsedCompanies] = useState<Record<string, boolean>>({
    鲁缆公司: true,
    新变厂: true,
    衡变公司: true,
    新缆厂: true,
    德缆公司: true,
  })

  const toggleCompanyCollapse = (compName: string) => {
    setCollapsedCompanies((prev) => ({
      ...prev,
      [compName]: !prev[compName],
    }))
  }

  // 🌟 1. 能源类型选择：'elec' (电) | 'steam' (蒸汽)
  const [energyType, setEnergyType] = useState<'elec' | 'steam'>('elec')

  // 🌟 2. 查询时间维度选择：'day' (日) | 'month' (月)
  const [timeDim, setTimeDim] = useState<'day' | 'month'>('day')
  const [selectedDay, setSelectedDay] = useState('2026-08-27')
  const [selectedMonth, setSelectedMonth] = useState('2026-08')

  const selectedEq = useMemo(() => {
    return KEY_EQUIPMENT_LIST.find((e) => e.id === selectedEqId) || KEY_EQUIPMENT_LIST[0]
  }, [selectedEqId])

  const basePower = selectedEq.powerKW || 4680
  const baseSteam = selectedEq.steamFlowT || 1.85

  // =========================================================================
  // 1. 【电】+【日】：15分钟功率曲线 (标注最大最小值) & 峰平谷 (总饼图 + 分日堆叠图)
  // =========================================================================
  const elecDayPowerData = useMemo(() => {
    const hours = [
      '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
      '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ]
    return hours.map((t) => {
      const h = parseInt(t.split(':')[0])
      let factor = 0.75
      if (h >= 10 && h <= 12) factor = 1.036 // 峰值 4850 kW
      else if (h >= 2 && h <= 4) factor = 0.453 // 谷值 2120 kW
      else if (h >= 8 && h <= 18) factor = 0.90 + (h % 3) * 0.04
      else factor = 0.60 + (h % 2) * 0.05

      const kw = Math.round(basePower * factor)
      return {
        time: t,
        实时功率: kw,
      }
    })
  }, [basePower])

  // 电-日：峰平谷总饼图数据
  const elecDayDonutData = useMemo(() => {
    const totalKWh = selectedEq.energyKWh || 112340
    return [
      { name: '尖峰电量', value: Math.round(totalKWh * 0.164), color: '#f5222d', ratio: '16.4%' },
      { name: '高峰电量', value: Math.round(totalKWh * 0.411), color: '#fa8c16', ratio: '41.1%' },
      { name: '平段电量', value: Math.round(totalKWh * 0.289), color: '#1677ff', ratio: '28.9%' },
      { name: '低谷电量', value: Math.round(totalKWh * 0.136), color: '#52c41a', ratio: '13.6%' },
    ]
  }, [selectedEq.energyKWh])

  // 电-日：分日时段峰平谷堆叠柱状图数据 (24小时各时段)
  const elecDayStackedBarData = useMemo(() => {
    return [
      { time: '00:00', 尖峰: 0, 峰段: 0, 平段: 0, 谷段: 2100 },
      { time: '02:00', 尖峰: 0, 峰段: 0, 平段: 0, 谷段: 2120 },
      { time: '04:00', 尖峰: 0, 峰段: 0, 平段: 0, 谷段: 2200 },
      { time: '06:00', 尖峰: 0, 峰段: 0, 平段: 0, 谷段: 2450 },
      { time: '08:00', 尖峰: 0, 峰段: 3800, 平段: 0, 谷段: 0 },
      { time: '10:00', 尖峰: 2200, 峰段: 2500, 平段: 0, 谷段: 0 },
      { time: '11:00', 尖峰: 2400, 峰段: 2450, 平段: 0, 谷段: 0 },
      { time: '12:00', 尖峰: 0, 峰段: 0, 平段: 4200, 谷段: 0 },
      { time: '14:00', 尖峰: 0, 峰段: 4150, 平段: 0, 谷段: 0 },
      { time: '16:00', 尖峰: 0, 峰段: 4300, 平段: 0, 谷段: 0 },
      { time: '18:00', 尖峰: 1800, 峰段: 2300, 平段: 0, 谷段: 0 },
      { time: '20:00', 尖峰: 0, 峰段: 0, 平段: 3600, 谷段: 0 },
      { time: '22:00', 尖峰: 0, 峰段: 0, 平段: 0, 谷段: 2500 },
    ]
  }, [])

  // =========================================================================
  // 2. 【电】+【月】：每日最大功率曲线 (标注最大最小值) & 峰平谷 (总饼图 + 分月分日堆叠图)
  // =========================================================================
  const elecMonthMaxPowerData = useMemo(() => {
    const days = []
    for (let d = 1; d <= 31; d++) {
      const dayStr = d < 10 ? `0${d}日` : `${d}日`
      let maxKw = Math.round(basePower * (0.85 + Math.sin(d * 0.5) * 0.15))
      if (d === 15) maxKw = 5120 // 当月最大
      if (d === 3) maxKw = 2860 // 当月最小
      days.push({
        day: dayStr,
        每日最大功率: maxKw,
      })
    }
    return days
  }, [basePower])

  // 电-月：峰平谷总饼图数据 (月度累计)
  const elecMonthDonutData = useMemo(() => {
    const totalMonthKWh = Math.round((selectedEq.energyKWh || 112340) * 25.1)
    return [
      { name: '尖峰电量', value: Math.round(totalMonthKWh * 0.172), color: '#f5222d', ratio: '17.2%' },
      { name: '高峰电量', value: Math.round(totalMonthKWh * 0.418), color: '#fa8c16', ratio: '41.8%' },
      { name: '平段电量', value: Math.round(totalMonthKWh * 0.282), color: '#1677ff', ratio: '28.2%' },
      { name: '低谷电量', value: Math.round(totalMonthKWh * 0.128), color: '#52c41a', ratio: '12.8%' },
    ]
  }, [selectedEq.energyKWh])

  // 电-月：分月每日堆叠柱状图 (1日~31日各天)
  const elecMonthStackedBarData = useMemo(() => {
    const days = []
    for (let d = 1; d <= 31; d++) {
      const dayStr = d < 10 ? `0${d}日` : `${d}日`
      const isWeekend = d % 7 === 0 || d % 7 === 6
      const baseDayKWh = isWeekend ? 65000 : 98000
      days.push({
        day: dayStr,
        尖峰: Math.round(baseDayKWh * (isWeekend ? 0.08 : 0.18)),
        峰段: Math.round(baseDayKWh * 0.42),
        平段: Math.round(baseDayKWh * 0.28),
        谷段: Math.round(baseDayKWh * (isWeekend ? 0.22 : 0.12)),
      })
    }
    return days
  }, [])

  // =========================================================================
  // 3. 【蒸汽】+【日】：瞬时流量曲线 (标注最大最小值) & 日累计用量
  // =========================================================================
  const steamDayFlowData = useMemo(() => {
    const hours = [
      '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '11:00', '12:00',
      '14:00', '16:00', '18:00', '20:00', '22:00', '23:00'
    ]
    return hours.map((t) => {
      let flow = Number((baseSteam * (0.8 + Math.sin(parseInt(t) * 0.4) * 0.3)).toFixed(2))
      if (t === '10:00' || t === '11:00') flow = 2.35 // 最大值
      if (t === '04:00') flow = 0.62 // 最小值
      return {
        time: t,
        瞬时流量: flow,
      }
    })
  }, [baseSteam])

  // 蒸汽-日：逐时累计蒸汽用量
  const steamDayAccumulatedData = useMemo(() => {
    const hours = [
      '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00',
      '14:00', '16:00', '18:00', '20:00', '22:00'
    ]
    let acc = 0
    return hours.map((t) => {
      const delta = Number((baseSteam * (0.9 + Math.random() * 0.3)).toFixed(2))
      acc = Number((acc + delta * 2).toFixed(2))
      return {
        time: t,
        小时用量: Number((delta * 2).toFixed(2)),
        当日累计: acc,
      }
    })
  }, [baseSteam])

  // =========================================================================
  // 4. 【蒸汽】+【月】：每日最大流量曲线 (标注最大最小值) & 月累计用量
  // =========================================================================
  const steamMonthMaxFlowData = useMemo(() => {
    const days = []
    for (let d = 1; d <= 31; d++) {
      const dayStr = d < 10 ? `0${d}日` : `${d}日`
      let maxF = Number((baseSteam * (0.9 + Math.cos(d * 0.4) * 0.25)).toFixed(2))
      if (d === 18) maxF = 2.68 // 当月最大
      if (d === 4) maxF = 0.85 // 当月最小
      days.push({
        day: dayStr,
        每日最大流量: maxF,
      })
    }
    return days
  }, [baseSteam])

  // 蒸汽-月：每日累计蒸汽消耗柱状图
  const steamMonthAccumulatedData = useMemo(() => {
    const days = []
    for (let d = 1; d <= 31; d++) {
      const dayStr = d < 10 ? `0${d}日` : `${d}日`
      const isWeekend = d % 7 === 0 || d % 7 === 6
      const val = Number((isWeekend ? 22.4 + (d % 3) : 38.6 + (d % 5) * 1.2).toFixed(1))
      days.push({
        day: dayStr,
        日用量: val,
      })
    }
    return days
  }, [])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 左侧 270px 企业及重点设备拓扑树 */}
      <aside className="w-[270px] min-w-[270px] max-w-[270px] shrink-0 sticky top-0 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[calc(100vh-84px)] overflow-hidden">
        <div className="p-3 border-b border-slate-100 space-y-2 shrink-0 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Cpu className="size-4 text-[#1677ff]" />
              企业及下级推送设备拓扑
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono font-bold">
              设备感知
            </span>
          </div>

          <div className="relative">
            <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={eqSearchKw}
              onChange={(e) => setEqSearchKw(e.target.value)}
              placeholder="搜索企业 / 重点设备..."
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-[#1677ff]"
            />
          </div>
        </div>

        <div className="p-2 overflow-y-auto flex-1 text-xs font-sans space-y-1.5">
          {/* 1级节点：电装集团 (支持点击展开/收起) */}
          <div
            onClick={() => setIsRootCollapsed(!isRootCollapsed)}
            className="flex items-center gap-1.5 py-1 px-1.5 rounded bg-blue-50/70 text-[#1677ff] font-bold cursor-pointer hover:bg-blue-100/70 transition-colors select-none"
            title="点击收起/展开下级组织与重点设备"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsRootCollapsed(!isRootCollapsed)
              }}
              className="size-4 flex items-center justify-center text-[#1677ff] hover:text-blue-700 shrink-0 cursor-pointer"
            >
              {isRootCollapsed ? (
                <ChevronRight className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
            <Building2 className="size-3.5 shrink-0 text-[#1677ff]" />
            <span className="flex-1 truncate">电装集团</span>
          </div>

          {/* 1级节点展开后的下级公司与设备列表 */}
          {!isRootCollapsed && (
            <div className="border-l border-slate-200 ml-3.5 pl-2 space-y-1">
              {['沈变公司', '鲁缆公司', '新变厂', '衡变公司', '新缆厂', '德缆公司'].map((compName) => {
                const compEqs = KEY_EQUIPMENT_LIST.filter(
                  (e) =>
                    e.company === compName &&
                    (!eqSearchKw.trim() ||
                      e.name.toLowerCase().includes(eqSearchKw.trim().toLowerCase()) ||
                      e.code.toLowerCase().includes(eqSearchKw.trim().toLowerCase()) ||
                      compName.includes(eqSearchKw.trim()))
                )
                const isCompanyCollapsed = !eqSearchKw.trim() && Boolean(collapsedCompanies[compName])

                if (eqSearchKw.trim() && compEqs.length === 0) return null

                return (
                  <div key={compName} className="space-y-0.5">
                    {/* 2级节点：各制造基地 (支持点击展开/收起) */}
                    <div
                      onClick={() => toggleCompanyCollapse(compName)}
                      className="flex items-center gap-1.5 py-1 px-1.5 rounded text-slate-800 font-bold hover:bg-slate-100 cursor-pointer select-none transition-colors"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCompanyCollapse(compName)
                        }}
                        className="size-3.5 flex items-center justify-center text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer"
                      >
                        {isCompanyCollapsed ? (
                          <ChevronRight className="size-3 text-slate-400" />
                        ) : (
                          <ChevronDown className="size-3 text-slate-500" />
                        )}
                      </button>
                      <span className="flex-1 truncate">{compName}</span>
                    </div>

                    {/* 3级节点：重点设备列表 */}
                    {!isCompanyCollapsed && (
                      <div className="border-l border-slate-200 ml-3 pl-2 space-y-0.5">
                        {compEqs.map((eq) => {
                          const isSelected = selectedEqId === eq.id
                          return (
                            <div
                              key={eq.id}
                              onClick={() => setSelectedEqId(eq.id)}
                              className={cn(
                                'flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition-colors text-[11px] group',
                                isSelected
                                  ? 'bg-[#e6f4ff] text-[#1677ff] font-bold shadow-2xs'
                                  : 'hover:bg-slate-100 text-slate-700'
                              )}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="truncate" title={eq.name}>{eq.name}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </aside>

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 1. 顶部 Header */}
        <OnlineHeader />

        {/* 2. 选中设备主卡片 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Cpu className="size-4 text-[#1677ff]" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>{selectedEq.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                    {selectedEq.code}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] font-bold font-sans">
                    {selectedEq.company}
                  </span>
                </h2>
                <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-0.5">
                  <span>安装位置: {selectedEq.location}</span>
                  <span>多能介质: {selectedEq.mediumTag}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    在线运行中
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {/* 1. 实时有功功率 */}
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-1">
              <div className="text-xs text-blue-800 font-sans flex items-center gap-1 font-bold">
                <Zap className="size-3 text-blue-600" />
                实时有功功率
              </div>
              <div className="text-2xl font-extrabold text-[#1677ff]">
                {selectedEq.powerKW?.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
              </div>
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className={cn('font-bold font-mono', (selectedEq.powerYoy || '-4.2%').includes('+') ? 'text-red-500' : 'text-emerald-600')}>
                  {selectedEq.powerYoy || '-4.2% ↓'}
                </span>
              </div>
            </div>

            {/* 2. 当月累计用电量 */}
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-1">
              <div className="text-xs text-emerald-800 font-sans flex items-center gap-1 font-bold">
                <Zap className="size-3 text-emerald-600" />
                当月累计用电量
              </div>
              <div className="text-2xl font-extrabold text-emerald-700">
                {selectedEq.energyKWh?.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kWh</span>
              </div>
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className={cn('font-bold font-mono', (selectedEq.energyYoy || '-3.8%').includes('+') ? 'text-red-500' : 'text-emerald-600')}>
                  {selectedEq.energyYoy || '-3.8% ↓'}
                </span>
              </div>
            </div>

            {/* 3. 蒸汽/天然气瞬时流量 */}
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/80 space-y-1">
              <div className="text-xs text-purple-800 font-sans flex items-center gap-1 font-bold">
                <Wind className="size-3 text-purple-600" />
                {selectedEq.gasFlowM3 ? '天然气瞬时流量' : '蒸汽瞬时流量'}
              </div>
              <div className="text-2xl font-extrabold text-purple-700">
                {selectedEq.steamFlowT ? `${selectedEq.steamFlowT} t/h` : selectedEq.gasFlowM3 ? `${selectedEq.gasFlowM3} m³/h` : '—'}
              </div>
              <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className={cn('font-bold font-mono', (selectedEq.flowYoy || '-5.1%').includes('+') ? 'text-red-500' : (selectedEq.flowYoy === '—' ? 'text-slate-400' : 'text-emerald-600'))}>
                  {selectedEq.flowYoy || (selectedEq.steamFlowT || selectedEq.gasFlowM3 ? '-5.1% ↓' : '—')}
                </span>
              </div>
            </div>

            {/* 4. 管道工作压力 */}
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1">
              <div className="text-xs text-amber-800 font-sans flex items-center gap-1 font-bold">
                <Flame className="size-3 text-amber-600" />
                管道工作压力
              </div>
              <div className="text-2xl font-extrabold text-amber-700">
                {selectedEq.pressureMpa ? `${selectedEq.pressureMpa} MPa` : '—'}
              </div>
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">同比</span>
                <span className={cn('font-bold font-mono', (selectedEq.pressureYoy || '+0.2%').includes('+') ? 'text-slate-600' : (selectedEq.pressureYoy === '—' ? 'text-slate-400' : 'text-emerald-600'))}>
                  {selectedEq.pressureYoy || (selectedEq.pressureMpa ? '+0.2% ↑' : '—')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 核心监测区域（红框深度重构）：电/蒸汽 × 日/月 4维监测与峰平谷/累计分析 */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
          
          {/* 顶部控制栏：能源类型选择 (电 / 蒸汽) + 时间维度切换 (日 / 月) + 日期筛选 + 综合导出 */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* 1. 能源类型切换 (电 / 蒸汽) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => setEnergyType('elec')}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer select-none',
                    energyType === 'elec'
                      ? 'bg-[#1677ff] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  )}
                >
                  <Zap className="size-3.5" />
                  <span>电力监测 (电)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEnergyType('steam')}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-bold transition-all cursor-pointer select-none',
                    energyType === 'steam'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  )}
                >
                  <Wind className="size-3.5" />
                  <span>蒸汽监测 (汽)</span>
                </button>
              </div>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              {/* 2. 查询维度切换 (日 / 月) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => setTimeDim('day')}
                  className={cn(
                    'px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer select-none',
                    timeDim === 'day' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  按日监测 (日)
                </button>
                <button
                  type="button"
                  onClick={() => setTimeDim('month')}
                  className={cn(
                    'px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer select-none',
                    timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  按月监测 (月)
                </button>
              </div>

              {/* 3. 具体日期/月份选择器 */}
              {timeDim === 'day' ? (
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono">
                  <Calendar className="size-3.5 text-slate-400" />
                  <span className="text-slate-600 font-sans">监测日期:</span>
                  <input
                    type="date"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 font-bold focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono">
                  <Calendar className="size-3.5 text-slate-400" />
                  <span className="text-slate-600 font-sans">监测账期:</span>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 font-bold focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
              )}
            </div>

            {/* 导出按钮 */}
            <button
              type="button"
              onClick={() => alert(`正在导出【${selectedEq.name}】${energyType === 'elec' ? '电力' : '蒸汽'}(${timeDim === 'day' ? selectedDay : selectedMonth})用能全景监测报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 🌟 1. 上部分图表：功率走势 (电) / 瞬时流量走势 (蒸汽) + 标注最大最小值 */}
          {/* ========================================================================= */}
          <div className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={cn('size-2.5 rounded-full', energyType === 'elec' ? 'bg-[#1677ff]' : 'bg-purple-600')} />
                <h3 className="text-xs font-bold text-slate-900">
                  {energyType === 'elec'
                    ? (timeDim === 'day'
                        ? `【${selectedEq.name}】15分钟实时有功功率负荷走势曲线 (标注最大最小值 / kW)`
                        : `【${selectedEq.name}】当月每日最大负荷功率走势曲线 (标注最大最小值 / kW)`)
                    : (timeDim === 'day'
                        ? `【${selectedEq.name}】15分钟瞬时蒸汽流量走势曲线 (标注最大最小值 / t/h)`
                        : `【${selectedEq.name}】当月每日最大蒸汽流量走势曲线 (标注最大最小值 / t/h)`)}
                </h3>
              </div>

              {/* 🌟 曲线最大值、最小值醒目标注徽章卡片 */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                {energyType === 'elec' ? (
                  timeDim === 'day' ? (
                    <>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/80 font-bold">
                        <span className="size-1.5 rounded-full bg-red-500" />
                        最大值: 4,850 kW (11:15)
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        最小值: 2,120 kW (03:30)
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/80">
                        平均: 3,720 kW
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/80 font-bold">
                        <span className="size-1.5 rounded-full bg-red-500" />
                        当月最高: 5,120 kW (08-15)
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        当月最低: 2,860 kW (08-03)
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/80">
                        日均最高: 4,180 kW
                      </span>
                    </>
                  )
                ) : (
                  timeDim === 'day' ? (
                    <>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/80 font-bold">
                        <span className="size-1.5 rounded-full bg-red-500" />
                        最大流量: 2.35 t/h (10:45)
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        最小流量: 0.62 t/h (04:15)
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200/80">
                        平均流量: 1.65 t/h
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200/80 font-bold">
                        <span className="size-1.5 rounded-full bg-red-500" />
                        当月最高: 2.68 t/h (08-18)
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        当月最低: 0.85 t/h (08-04)
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200/80">
                        日均最高: 1.92 t/h
                      </span>
                    </>
                  )
                )}

                <button
                  type="button"
                  onClick={() => alert(`正在导出【上部分走势曲线数据】(Excel)...`)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                  title="导出上部曲线数据"
                >
                  <Download className="size-3 text-slate-500" />
                  <span>导出曲线</span>
                </button>
              </div>
            </div>

            {/* 折线图渲染 (含 ReferenceLine 最大/最小值标记) */}
            <div className="h-[250px] bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
              {energyType === 'elec' ? (
                timeDim === 'day' ? (
                  <LineTrend
                    data={elecDayPowerData}
                    xKey="time"
                    height={230}
                    yUnit="kW"
                    lines={[{ key: '实时功率', name: '实时有功功率 (kW)', color: '#1677ff' }]}
                    refLines={[
                      { y: 4850, label: '最大值: 4,850 kW (11:15)', color: '#ef4444' },
                      { y: 2120, label: '最小值: 2,120 kW (03:30)', color: '#10b981' },
                    ]}
                  />
                ) : (
                  <LineTrend
                    data={elecMonthMaxPowerData}
                    xKey="day"
                    height={230}
                    yUnit="kW"
                    lines={[{ key: '每日最大功率', name: '每日最高功率 (kW)', color: '#1677ff' }]}
                    refLines={[
                      { y: 5120, label: '最高值: 5,120 kW (08-15)', color: '#ef4444' },
                      { y: 2860, label: '最低值: 2,860 kW (08-03)', color: '#10b981' },
                    ]}
                  />
                )
              ) : (
                timeDim === 'day' ? (
                  <LineTrend
                    data={steamDayFlowData}
                    xKey="time"
                    height={230}
                    yUnit="t/h"
                    lines={[{ key: '瞬时流量', name: '瞬时蒸汽流量 (t/h)', color: '#9333ea' }]}
                    refLines={[
                      { y: 2.35, label: '最大流量: 2.35 t/h (10:45)', color: '#ef4444' },
                      { y: 0.62, label: '最小流量: 0.62 t/h (04:15)', color: '#10b981' },
                    ]}
                  />
                ) : (
                  <LineTrend
                    data={steamMonthMaxFlowData}
                    xKey="day"
                    height={230}
                    yUnit="t/h"
                    lines={[{ key: '每日最大流量', name: '每日最大蒸汽流量 (t/h)', color: '#9333ea' }]}
                    refLines={[
                      { y: 2.68, label: '最高流量: 2.68 t/h (08-18)', color: '#ef4444' },
                      { y: 0.85, label: '最低流量: 0.85 t/h (08-04)', color: '#10b981' },
                    ]}
                  />
                )
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🌟 2. 下部分图表：电量峰平谷 (总饼图 + 分日/分月堆叠图) / 蒸汽累计用量 */}
          {/* ========================================================================= */}
          <div className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={cn('size-2.5 rounded-full', energyType === 'elec' ? 'bg-amber-500' : 'bg-purple-500')} />
                <h3 className="text-xs font-bold text-slate-900">
                  {energyType === 'elec'
                    ? (timeDim === 'day'
                        ? `【${selectedEq.name}】当日用电量峰平谷构成分析与逐时段负荷 (总饼图 + 分日堆叠图)`
                        : `【${selectedEq.name}】当月用电量峰平谷累计构成与每日用电 (总饼图 + 分月堆叠图)`)
                    : (timeDim === 'day'
                        ? `【${selectedEq.name}】当日蒸汽逐时累计用量走势与总量分析 (t)`
                        : `【${selectedEq.name}】当月蒸汽每日累计用量分布与月度消耗汇总 (t)`)}
                </h3>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => alert(`正在导出【下部分峰平谷/累计用能数据】(Excel)...`)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                  title="导出下部数据"
                >
                  <Download className="size-3 text-slate-500" />
                  <span>导出分析数据</span>
                </button>
              </div>
            </div>

            {/* 下部展示区 */}
            {energyType === 'elec' ? (
              /* 【电】：总的饼图 + 分日/分月堆叠图 */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                {/* 左侧 4/12：总的峰平谷饼图 */}
                <div className="lg:col-span-4 bg-white p-3 rounded-lg border border-slate-200/60 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-sans">
                      <PieIcon className="size-3.5 text-amber-500" />
                      {timeDim === 'day' ? '当日峰平谷电量总占比' : '当月峰平谷电量总占比'}
                    </span>
                    <span className="text-[10.5px] font-mono font-bold text-[#1677ff]">
                      {timeDim === 'day' ? '总量 112,340 kWh' : '总量 2,822,000 kWh'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Donut
                      data={timeDim === 'day' ? elecDayDonutData : elecMonthDonutData}
                      height={190}
                      unit="kWh"
                    />
                  </div>

                  {/* 峰平谷指标明细栏 */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono pt-1.5 border-t border-slate-100">
                    <div className="p-1.5 rounded bg-red-50/70 border border-red-100 flex items-center justify-between">
                      <span className="text-red-700 font-sans font-medium">尖峰:</span>
                      <strong className="text-red-800">{timeDim === 'day' ? '18,400 (16.4%)' : '48.5万 (17.2%)'}</strong>
                    </div>
                    <div className="p-1.5 rounded bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                      <span className="text-amber-700 font-sans font-medium">高峰:</span>
                      <strong className="text-amber-800">{timeDim === 'day' ? '46,200 (41.1%)' : '118.0万 (41.8%)'}</strong>
                    </div>
                    <div className="p-1.5 rounded bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                      <span className="text-blue-700 font-sans font-medium">平段:</span>
                      <strong className="text-blue-800">{timeDim === 'day' ? '32,500 (28.9%)' : '79.5万 (28.2%)'}</strong>
                    </div>
                    <div className="p-1.5 rounded bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                      <span className="text-emerald-700 font-sans font-medium">低谷:</span>
                      <strong className="text-emerald-800">{timeDim === 'day' ? '15,240 (13.6%)' : '36.2万 (12.8%)'}</strong>
                    </div>
                  </div>
                </div>

                {/* 右侧 8/12：分日/分月峰平谷堆叠柱状图 */}
                <div className="lg:col-span-8 bg-white p-3 rounded-lg border border-slate-200/60 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-sans">
                      <BarChart3 className="size-3.5 text-[#1677ff]" />
                      {timeDim === 'day' ? '逐时段峰平谷电量堆叠 (kWh)' : '当月每日峰平谷电量堆叠 (kWh)'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">尖/峰/平/谷 四色堆叠</span>
                  </div>

                  <div className="h-[250px] pt-1">
                    <BarChartGroup
                      data={timeDim === 'day' ? elecDayStackedBarData : elecMonthStackedBarData}
                      xKey={timeDim === 'day' ? 'time' : 'day'}
                      height={240}
                      stacked={true}
                      bars={[
                        { key: '尖峰', name: '尖峰电量', color: '#f5222d' },
                        { key: '峰段', name: '高峰电量', color: '#fa8c16' },
                        { key: '平段', name: '平段电量', color: '#1677ff' },
                        { key: '谷段', name: '低谷电量', color: '#52c41a' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* 【蒸汽】：日累计用量 / 月累计用量 */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                {/* 左侧 4/12：累计蒸汽指标统计卡片 */}
                <div className="lg:col-span-4 bg-white p-3.5 rounded-lg border border-slate-200/60 shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                      <Wind className="size-3.5 text-purple-600" />
                      {timeDim === 'day' ? '当日蒸汽累计总量' : '当月蒸汽累计总量'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-mono font-bold">
                      流量计计量
                    </span>
                  </div>

                  <div className="p-3 bg-purple-50/40 rounded-lg border border-purple-100 space-y-1">
                    <div className="text-xs text-slate-500 font-sans">累计蒸汽用量</div>
                    <div className="text-2xl font-extrabold font-mono text-purple-700">
                      {timeDim === 'day' ? '38.60' : '1,142.80'} <span className="text-xs font-normal text-slate-500 font-sans">t (吨)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-purple-200/50 flex justify-between font-sans">
                      <span>折合标煤:</span>
                      <strong className="text-slate-800 font-mono">{timeDim === 'day' ? '15.15 tce' : '448.55 tce'}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] text-slate-500 font-sans block">平均管道压力</span>
                      <strong className="text-amber-700 text-sm">{selectedEq.pressureMpa || 0.005} MPa</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] text-slate-500 font-sans block">平均工况温度</span>
                      <strong className="text-purple-700 text-sm">{selectedEq.temperatureC || 135.2} ℃</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    * 实时采集自供汽管网流量传感器与温压补偿计量表，数据经工业网关每15分钟高频上传校核。
                  </div>
                </div>

                {/* 右侧 8/12：蒸汽逐时累计 / 分日消耗柱状图 */}
                <div className="lg:col-span-8 bg-white p-3 rounded-lg border border-slate-200/60 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-sans">
                      <BarChart3 className="size-3.5 text-purple-600" />
                      {timeDim === 'day' ? '当日逐时消耗蒸汽柱状图 (t)' : '当月每日累计蒸汽消耗 (t)'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {timeDim === 'day' ? '逐时用量统计' : '31天逐日消耗'}
                    </span>
                  </div>

                  <div className="h-[250px] pt-1">
                    <BarChartGroup
                      data={timeDim === 'day' ? steamDayAccumulatedData : steamMonthAccumulatedData}
                      xKey={timeDim === 'day' ? 'time' : 'day'}
                      height={240}
                      bars={[
                        {
                          key: timeDim === 'day' ? '小时用量' : '日用量',
                          name: timeDim === 'day' ? '小时蒸汽用量 (t)' : '每日蒸汽消耗 (t)',
                          color: '#a855f7',
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 🌟 3. 底部明细台账：随能源类型与时间维度自适应切换 + 统一导出 */}
          {/* ========================================================================= */}
          <div className="rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/80 gap-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold text-slate-800">
                  【{selectedEq.name}】{energyType === 'elec' ? '电力监测数据明细台账' : '蒸汽监测数据明细台账'} (
                  {timeDim === 'day' ? `${selectedDay} 逐时段采样` : `${selectedMonth} 每日汇总`})
                </h3>
              </div>

              <button
                type="button"
                onClick={() => alert(`正在导出【${selectedEq.name}】${energyType === 'elec' ? '电力' : '蒸汽'}明细台账 (Excel)...`)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer shadow-2xs text-xs"
              >
                <Download className="size-3.5 text-slate-500" />
                <span>导出</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                    <th className="py-2.5 px-3">时间</th>
                    {energyType === 'elec' ? (
                      timeDim === 'day' ? (
                        <>
                          <th className="py-2.5 px-3">实时有功功率 (kW)</th>
                          <th className="py-2.5 px-3">功率因数 (cosφ)</th>
                          <th className="py-2.5 px-3">尖峰电量 (kWh)</th>
                          <th className="py-2.5 px-3">高峰电量 (kWh)</th>
                          <th className="py-2.5 px-3">平段电量 (kWh)</th>
                          <th className="py-2.5 px-3">低谷电量 (kWh)</th>
                          <th className="py-2.5 px-3">时段总电量 (kWh)</th>
                        </>
                      ) : (
                        <>
                          <th className="py-2.5 px-3">当日最高功率 (kW)</th>
                          <th className="py-2.5 px-3">平均负荷率</th>
                          <th className="py-2.5 px-3">尖峰电量 (kWh)</th>
                          <th className="py-2.5 px-3">高峰电量 (kWh)</th>
                          <th className="py-2.5 px-3">平段电量 (kWh)</th>
                          <th className="py-2.5 px-3">低谷电量 (kWh)</th>
                          <th className="py-2.5 px-3">当日总电量 (kWh)</th>
                        </>
                      )
                    ) : (
                      timeDim === 'day' ? (
                        <>
                          <th className="py-2.5 px-3">瞬时流量 (t/h)</th>
                          <th className="py-2.5 px-3">管道压力 (MPa)</th>
                          <th className="py-2.5 px-3">工况温度 (℃)</th>
                          <th className="py-2.5 px-3">小时蒸汽消耗 (t)</th>
                          <th className="py-2.5 px-3">当日累计用量 (t)</th>
                          <th className="py-2.5 px-3">折合标煤 (tce)</th>
                        </>
                      ) : (
                        <>
                          <th className="py-2.5 px-3">当日最大流量 (t/h)</th>
                          <th className="py-2.5 px-3">平均管道压力 (MPa)</th>
                          <th className="py-2.5 px-3">平均温度 (℃)</th>
                          <th className="py-2.5 px-3">当日蒸汽消耗 (t)</th>
                          <th className="py-2.5 px-3">月度累计用量 (t)</th>
                          <th className="py-2.5 px-3">折合标煤 (tce)</th>
                        </>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {energyType === 'elec' ? (
                    timeDim === 'day' ? (
                      elecDayStackedBarData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{row.time}</td>
                          <td className="py-2.5 px-3 font-bold text-blue-700">
                            {(basePower * (0.8 + idx * 0.01)).toFixed(0)}
                          </td>
                          <td className="py-2.5 px-3">0.95</td>
                          <td className="py-2.5 px-3 text-red-600 font-bold">{row.尖峰}</td>
                          <td className="py-2.5 px-3 text-amber-600 font-bold">{row.峰段}</td>
                          <td className="py-2.5 px-3 text-blue-600 font-bold">{row.平段}</td>
                          <td className="py-2.5 px-3 text-emerald-600 font-bold">{row.谷段}</td>
                          <td className="py-2.5 px-3 font-extrabold text-slate-900">
                            {(row.尖峰 + row.峰段 + row.平段 + row.谷段).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      elecMonthStackedBarData.slice(0, 15).map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{selectedMonth}-{row.day}</td>
                          <td className="py-2.5 px-3 font-bold text-blue-700">
                            {(basePower * (0.9 + (idx % 4) * 0.03)).toFixed(0)}
                          </td>
                          <td className="py-2.5 px-3">82.5%</td>
                          <td className="py-2.5 px-3 text-red-600 font-bold">{row.尖峰.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-amber-600 font-bold">{row.峰段.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-blue-600 font-bold">{row.平段.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-emerald-600 font-bold">{row.谷段.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-extrabold text-slate-900">
                            {(row.尖峰 + row.峰段 + row.平段 + row.谷段).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    timeDim === 'day' ? (
                      steamDayAccumulatedData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{row.time}</td>
                          <td className="py-2.5 px-3 font-bold text-purple-700">
                            {(baseSteam * (0.85 + (idx % 3) * 0.1)).toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-amber-700">{selectedEq.pressureMpa || 0.005}</td>
                          <td className="py-2.5 px-3">{selectedEq.temperatureC || 135.2}</td>
                          <td className="py-2.5 px-3 font-bold text-purple-700">{row.小时用量}</td>
                          <td className="py-2.5 px-3 font-extrabold text-slate-900">{row.当日累计}</td>
                          <td className="py-2.5 px-3 text-emerald-700 font-bold">{(row.当日累计 * 0.392).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      steamMonthAccumulatedData.slice(0, 15).map((row, idx) => (
                        <tr key={idx} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{selectedMonth}-{row.day}</td>
                          <td className="py-2.5 px-3 font-bold text-purple-700">
                            {(baseSteam * (1.1 + (idx % 4) * 0.05)).toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-amber-700">{selectedEq.pressureMpa || 0.005}</td>
                          <td className="py-2.5 px-3">{selectedEq.temperatureC || 135.2}</td>
                          <td className="py-2.5 px-3 font-bold text-purple-700">{row.日用量}</td>
                          <td className="py-2.5 px-3 font-extrabold text-slate-900">
                            {(row.日用量 * (idx + 1)).toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 text-emerald-700 font-bold">
                            {(row.日用量 * 0.392).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

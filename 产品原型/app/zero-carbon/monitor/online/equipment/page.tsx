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
} from 'lucide-react'
import { LineTrend } from '@/components/shared/charts'
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
]

export default function EquipmentPage() {
  const [selectedEqId, setSelectedEqId] = useState<string>('eq-dry-01')
  const [eqSearchKw, setEqSearchKw] = useState('')

  const selectedEq = useMemo(() => {
    return KEY_EQUIPMENT_LIST.find((e) => e.id === selectedEqId) || KEY_EQUIPMENT_LIST[0]
  }, [selectedEqId])

  const eqTrendData = useMemo(() => {
    const baseP = selectedEq.powerKW || 3500
    const baseF = selectedEq.steamFlowT || selectedEq.gasFlowM3 || 1.8
    return [
      { time: '00:00', 实时功率: Math.round(baseP * 0.75), 介质流量: Number((baseF * 0.75).toFixed(2)) },
      { time: '04:00', 实时功率: Math.round(baseP * 0.70), 介质流量: Number((baseF * 0.70).toFixed(2)) },
      { time: '08:00', 实时功率: Math.round(baseP * 0.95), 介质流量: Number((baseF * 0.95).toFixed(2)) },
      { time: '12:00', 实时功率: baseP, 介质流量: Number(baseF.toFixed(2)) },
      { time: '16:00', 实时功率: Math.round(baseP * 0.98), 介质流量: Number((baseF * 0.98).toFixed(2)) },
      { time: '20:00', 实时功率: Math.round(baseP * 0.85), 介质流量: Number((baseF * 0.85).toFixed(2)) },
    ]
  }, [selectedEq])

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
          <div className="flex items-center gap-1.5 py-1 px-1.5 rounded bg-blue-50/70 text-[#1677ff] font-bold">
            <Building2 className="size-3.5 shrink-0 text-[#1677ff]" />
            <span className="flex-1 truncate">特变电工集团 (6 大企业)</span>
            <span className="text-[9.5px] px-1 py-0.2 rounded bg-blue-100 text-blue-700 font-mono font-bold">6 大企业</span>
          </div>

          <div className="border-l border-slate-200 ml-3.5 pl-2 space-y-1">
            {['沈变公司', '鲁缆公司', '新变厂', '衡变公司'].map((compName) => {
              const compEqs = KEY_EQUIPMENT_LIST.filter((e) => e.company === compName)
              return (
                <div key={compName} className="space-y-0.5">
                  <div className="flex items-center gap-1.5 py-1 px-1.5 rounded text-slate-800 font-bold hover:bg-slate-100 cursor-pointer">
                    <ChevronRight className="size-3 text-slate-400 rotate-90" />
                    <span className="flex-1 truncate">{compName}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono font-bold">
                      {compEqs.length} 台设备
                    </span>
                  </div>

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
                          <span className="text-[9.5px] font-mono text-emerald-600 shrink-0 font-bold ml-1">
                            {eq.powerKW}kW
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </aside>

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 1. 顶部 Header 与 3 大核心监测板块 Tab */}
        <OnlineHeader />
        {/* 选中设备主卡片 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Cpu className="size-4 text-[#1677ff]" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>1# {selectedEq.name}</span>
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

        {/* 24 小时运行负荷与用能趋势 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-900">
                【{selectedEq.name}】24 小时运行负荷与用能趋势
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">15分钟传感器实时采样，动态连续感知</span>
          </div>

          <div className="h-[260px]">
            <LineTrend
              data={eqTrendData}
              xKey="time"
              height={260}
              lines={[
                { key: '实时功率', name: '实时功率 (kW)', color: '#1677ff' },
                { key: '介质流量', name: '蒸汽/燃气流量', color: '#a855f7' },
              ]}
            />
          </div>
        </div>

        {/* 实时监测数据明细表格 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/60 gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold text-slate-800">
                【{selectedEq.name}】实时监测数据明细台账 (15分钟/次采样)
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => alert(`正在导出【${selectedEq.name}】实时能耗采集数据 (Excel)...`)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                <Download className="size-3.5 text-slate-500" />
                <span>导出数据</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                  <th className="py-2.5 px-3">采样时间</th>
                  <th className="py-2.5 px-3">实时有功功率 (kW)</th>
                  <th className="py-2.5 px-3">功率因数 (cosφ)</th>
                  <th className="py-2.5 px-3">瞬时介质消耗</th>
                  <th className="py-2.5 px-3">管道压力 (MPa)</th>
                  <th className="py-2.5 px-3">工况温度 (℃)</th>
                  <th className="py-2.5 px-3">当日累计用电 (kWh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { time: '12:00:00', kw: selectedEq.powerKW || 4680, cos: 0.95, flow: selectedEq.steamFlowT ? `${selectedEq.steamFlowT} t/h` : selectedEq.gasFlowM3 ? `${selectedEq.gasFlowM3} m³/h` : '—', mpa: selectedEq.pressureMpa ? `${selectedEq.pressureMpa} MPa` : '—', temp: `${selectedEq.temperatureC || 32.5} °C`, kwh: (selectedEq.energyKWh || 112340).toLocaleString() },
                  { time: '11:45:00', kw: Math.round((selectedEq.powerKW || 4680) * 0.98), cos: 0.95, flow: selectedEq.steamFlowT ? `${(selectedEq.steamFlowT * 0.98).toFixed(2)} t/h` : selectedEq.gasFlowM3 ? `${(selectedEq.gasFlowM3 * 0.98).toFixed(1)} m³/h` : '—', mpa: selectedEq.pressureMpa ? `${selectedEq.pressureMpa} MPa` : '—', temp: `${((selectedEq.temperatureC || 32.5) - 0.2).toFixed(1)} °C`, kwh: ((selectedEq.energyKWh || 112340) + 720).toLocaleString() },
                  { time: '11:30:00', kw: Math.round((selectedEq.powerKW || 4680) * 0.99), cos: 0.95, flow: selectedEq.steamFlowT ? `${(selectedEq.steamFlowT * 0.99).toFixed(2)} t/h` : selectedEq.gasFlowM3 ? `${(selectedEq.gasFlowM3 * 0.99).toFixed(1)} m³/h` : '—', mpa: selectedEq.pressureMpa ? `${selectedEq.pressureMpa} MPa` : '—', temp: `${((selectedEq.temperatureC || 32.5) - 0.5).toFixed(1)} °C`, kwh: ((selectedEq.energyKWh || 112340) + 480).toLocaleString() },
                  { time: '11:15:00', kw: Math.round((selectedEq.powerKW || 4680) * 0.97), cos: 0.94, flow: selectedEq.steamFlowT ? `${(selectedEq.steamFlowT * 0.97).toFixed(2)} t/h` : selectedEq.gasFlowM3 ? `${(selectedEq.gasFlowM3 * 0.97).toFixed(1)} m³/h` : '—', mpa: selectedEq.pressureMpa ? `${selectedEq.pressureMpa} MPa` : '—', temp: `${((selectedEq.temperatureC || 32.5) - 0.8).toFixed(1)} °C`, kwh: ((selectedEq.energyKWh || 112340) + 240).toLocaleString() },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-600 font-semibold">{row.time}</td>
                    <td className="py-2.5 px-3 font-bold text-blue-700">{row.kw.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.cos}</td>
                    <td className="py-2.5 px-3 font-bold text-purple-700">{row.flow}</td>
                    <td className="py-2.5 px-3 text-amber-700">{row.mpa}</td>
                    <td className="py-2.5 px-3 text-slate-800">{row.temp}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">{row.kwh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import {
  Layers,
  Building2,
  Calendar,
  Download,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { LineTrend } from '@/components/shared/charts'
import { OnlineHeader } from '@/components/shared/online-header'
import { cn } from '@/lib/utils'

const COMPANY_PROCESSES = [
  {
    company: '沈变公司',
    processes: [
      { id: 'prc_sb_01', name: '真空干燥工段 (煤油气相)', targetKWh: 58000, actualKWh: 54200, isOk: true, yoy: '-6.5%', diff: '-3,800 kWh' },
      { id: 'prc_sb_02', name: '特高压试验站工段', targetKWh: 24000, actualKWh: 23100, isOk: true, yoy: '-3.8%', diff: '-900 kWh' },
      { id: 'prc_sb_03', name: '铁心纵剪及叠片工段', targetKWh: 18000, actualKWh: 17500, isOk: true, yoy: '-2.8%', diff: '-500 kWh' },
    ],
  },
  {
    company: '衡变公司',
    processes: [
      { id: 'prc_hb_01', name: '煤油气相干燥与喷淋工段', targetKWh: 52000, actualKWh: 49800, isOk: true, yoy: '-4.2%', diff: '-2,200 kWh' },
      { id: 'prc_hb_02', name: '互感器环氧浇注固化工序', targetKWh: 21000, actualKWh: 20400, isOk: true, yoy: '-2.9%', diff: '-600 kWh' },
    ],
  },
  {
    company: '新变厂',
    processes: [
      { id: 'prc_xb_01', name: '110kV~220kV 变压器总装工段', targetKWh: 32000, actualKWh: 31200, isOk: true, yoy: '-2.5%', diff: '-800 kWh' },
      { id: 'prc_xb_02', name: '硅钢片数控横剪线工序', targetKWh: 15000, actualKWh: 14600, isOk: true, yoy: '-2.7%', diff: '-400 kWh' },
    ],
  },
  {
    company: '鲁缆公司',
    processes: [
      { id: 'prc_ll_01', name: '500kV 悬垂立塔三层共挤交联工序', targetKWh: 82000, actualKWh: 78500, isOk: true, yoy: '-4.3%', diff: '-3,500 kWh' },
      { id: 'prc_ll_02', name: '连续硫化橡胶护套挤出工序', targetKWh: 45000, actualKWh: 43200, isOk: true, yoy: '-4.0%', diff: '-1,800 kWh' },
      { id: 'prc_ll_03', name: '大截面铝合金导体绞线工段', targetKWh: 28000, actualKWh: 27100, isOk: true, yoy: '-3.2%', diff: '-900 kWh' },
    ],
  },
]

export default function ProcessPage() {
  const [selectedProcessId, setSelectedProcessId] = useState<string>('prc_sb_01')

  return (
    <div className="flex gap-3.5 items-start">
      {/* 左侧 270px 工序拓扑树 */}
      <aside className="w-[270px] min-w-[270px] max-w-[270px] shrink-0 sticky top-0 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[calc(100vh-84px)] overflow-hidden">
        <div className="p-3 border-b border-slate-100 space-y-1 shrink-0 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="size-4 text-[#1677ff]" />
              关键工序树 (日更新)
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-mono font-bold">
              离线计算
            </span>
          </div>
          <p className="text-[11px] text-slate-400">已接入 47 项核心工序日能耗</p>
        </div>

        <div className="p-2 overflow-y-auto flex-1 text-xs font-sans space-y-1.5">
          <div className="flex items-center gap-1.5 py-1 px-1.5 rounded bg-blue-50/70 text-[#1677ff] font-bold">
            <Building2 className="size-3.5 shrink-0 text-[#1677ff]" />
            <span className="flex-1 truncate">特变电工集团 (1,2级工序)</span>
            <span className="text-[9.5px] px-1 py-0.2 rounded bg-blue-100 text-blue-700 font-mono">日更新</span>
          </div>

          <div className="border-l border-slate-200 ml-3.5 pl-2 space-y-1">
            {COMPANY_PROCESSES.map((cp) => (
              <div key={cp.company} className="space-y-0.5">
                <div className="flex items-center gap-1.5 py-1 px-1.5 rounded text-slate-800 font-bold hover:bg-slate-100 cursor-pointer">
                  <ChevronRight className="size-3 text-slate-400 rotate-90" />
                  <span className="flex-1 truncate">{cp.company}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-mono font-bold">
                    {cp.processes.length} 工序
                  </span>
                </div>

                <div className="border-l border-slate-200 ml-3 pl-2 space-y-0.5">
                  {cp.processes.map((p) => {
                    const isSelected = selectedProcessId === p.id
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProcessId(p.id)}
                        className={cn(
                          'flex items-center justify-between py-1 px-1.5 rounded text-slate-700 text-[11px] cursor-pointer transition-colors',
                          isSelected ? 'bg-purple-100 text-purple-900 font-bold' : 'hover:bg-slate-100'
                        )}
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="text-[9.5px] font-mono text-purple-700 font-bold shrink-0">
                          {p.actualKWh.toLocaleString()} kWh
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 1. 顶部 Header 与 3 大核心监测板块 Tab */}
        <OnlineHeader />
        {/* 工序计算规则与分表求和兜底机制说明卡片 */}
        <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 flex items-start gap-3 text-xs">
          <Info className="size-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-slate-700 font-sans">
            <div className="font-bold text-purple-900 text-xs flex items-center gap-2">
              <span>关键工序能耗日更新与核算标准说明</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-200/80 text-purple-900 text-[10px] font-bold">
                权威统计口径
              </span>
            </div>
            <p className="leading-relaxed text-[11.5px]">
              <strong>一、更新频率：</strong>本板块每日凌晨 02:00 由能耗大数据引擎自动拉取前一工作日全部批次 MES 工单及分表电量，支持按日回溯。<br />
              <strong>二、分表求和兜底机制：</strong>对于具备独立工序计量子表的车间，直接由硬件直采（如煤油干燥、立塔交联）；对于尚未加装独立分表的老旧工序，系统启动<strong>“车间进线总表 - 其余辅表求和 = 工序兜底能耗”</strong>智能平账算法，确保工序能耗与全厂总用电量 100% 严密闭合。
            </p>
          </div>
        </div>

        {/* 关键工序日能耗统计表 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/60 gap-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-purple-600" />
              <h3 className="text-xs font-bold text-slate-800">
                全集团重点关键制造工序日能耗统计台账 (昨日更新)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">核算周期: 2026-08-27 全天</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                  <th className="py-2.5 px-3">所属基地公司</th>
                  <th className="py-2.5 px-3">关键工序名称</th>
                  <th className="py-2.5 px-3">昨日考核目标电量 (kWh)</th>
                  <th className="py-2.5 px-3">昨日实测总能耗 (kWh)</th>
                  <th className="py-2.5 px-3">能耗节超对比 (kWh)</th>
                  <th className="py-2.5 px-3">同比变动 (YoY)</th>
                  <th className="py-2.5 px-3">工序达标判定</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {COMPANY_PROCESSES.flatMap((c) =>
                  c.processes.map((p) => (
                    <tr
                      key={p.id}
                      className={cn(
                        'hover:bg-slate-50 transition-colors',
                        selectedProcessId === p.id ? 'bg-purple-50/60 font-semibold' : ''
                      )}
                    >
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-800">{c.company}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.targetKWh.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-bold text-purple-700">{p.actualKWh.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-bold">{p.diff}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{p.yoy}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          达标在控
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

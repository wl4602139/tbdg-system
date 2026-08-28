'use client'

import React from 'react'
import { Cpu, Zap, Sun, BatteryCharging, Flame, Layers } from 'lucide-react'

export default function ModelMonitoringPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {/* 1. 分布式光伏发电出力模型 */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sun className="size-4 text-emerald-600" />
              分布式光伏实时出力与衰减模型
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] font-mono font-bold">IEC 61724 规范</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 font-mono text-xs text-slate-800 space-y-1">
          <div className="font-bold text-slate-900">计算公式：</div>
          <div className="text-blue-700 bg-white p-2 rounded border border-slate-200">
            P_theory(t) = G(t) / 1000 × P_installed × [1 - α × (Y - 1)] × PR
          </div>
          <div className="text-[11px] text-slate-500 font-sans pt-1">
            其中：G(t) 为太阳辐射强度 (W/m²)，P_installed 为装机容量，α 为年化衰减率 (0.55%)，PR 为系统综合性能比 (默认 82%)。
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
            <span className="text-slate-500 block">首年衰减率基准</span>
            <span className="text-lg font-bold text-slate-900 font-mono">2.0%</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
            <span className="text-slate-500 block">后续逐年衰减率</span>
            <span className="text-lg font-bold text-slate-900 font-mono">0.55% / 年</span>
          </div>
        </div>
      </div>

      {/* 2. 储能充放电及度电成本模型 */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-amber-500" />
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <BatteryCharging className="size-4 text-amber-600" />
              电化学储能充放电与度电成本模型
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold">LCOS 规范</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 font-mono text-xs text-slate-800 space-y-1">
          <div className="font-bold text-slate-900">计算公式：</div>
          <div className="text-amber-700 bg-white p-2 rounded border border-slate-200">
            RTE = E_discharge / E_charge × 100% | LCOS = TotalCost / TotalEnergy
          </div>
          <div className="text-[11px] text-slate-500 font-sans pt-1">
            其中：RTE 为充放电综合综合效率 (默认 88.5%)，SOH 为电池健康度寿命衰减因子，支持两充两放峰谷套利收益测算。
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
            <span className="text-slate-500 block">充放电往返效率 (RTE)</span>
            <span className="text-lg font-bold text-emerald-700 font-mono">88.5%</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
            <span className="text-slate-500 block">循环寿命基准</span>
            <span className="text-lg font-bold text-slate-900 font-mono">6,000 次 (80% EOL)</span>
          </div>
        </div>
      </div>

      {/* 3. 工业余热利用热力学折标模型 */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-purple-500" />
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Flame className="size-4 text-purple-600" />
              工业余热利用热力学折标模型
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-mono font-bold">GB/T 2589 推荐值</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 font-mono text-xs text-slate-800 space-y-1">
          <div className="font-bold text-slate-900">计算公式：</div>
          <div className="text-purple-700 bg-white p-2 rounded border border-slate-200">
            Q_heat = m × (h_steam - h_water) × η_recover
          </div>
          <div className="text-[11px] text-slate-500 font-sans pt-1">
            其中：m 为回收废热流量 (t)，h 为蒸汽热焓差值 (MJ/t)，按 0.1286 kgce/kg 蒸汽折标系数计算节能量与碳减排。
          </div>
        </div>
      </div>

      {/* 4. 智慧微电网与负荷柔性平衡模型 */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-500" />
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="size-4 text-[#1677ff]" />
              智慧微电网与负荷柔性平衡模型
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] font-mono font-bold">EMS 能量管理</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 font-mono text-xs text-slate-800 space-y-1">
          <div className="font-bold text-slate-900">计算公式：</div>
          <div className="text-blue-700 bg-white p-2 rounded border border-slate-200">
            P_grid_in(t) = P_load(t) - P_pv(t) - P_bess_dis(t) + P_bess_chg(t)
          </div>
          <div className="text-[11px] text-slate-500 font-sans pt-1">
            实现 15 个零碳园区并网点动态潮流自平衡调度，最大化提升绿电自发自用率与需量电费节约。
          </div>
        </div>
      </div>
    </div>
  )
}

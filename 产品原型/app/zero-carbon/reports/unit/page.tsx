'use client'

import { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  Search,
  Zap,
  Cable,
  Building2,
  TrendingDown,
  Layers,
  FileSpreadsheet,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

interface TransformerOrderRow {
  id: string
  base: string
  model: string
  capacityMva: number
  cutStack: number
  winding: number
  vacuumDry: number
  assemblyTest: number
  unitKwhPerKva: number
  tcePerUnit: number
  yoy: string
}

interface CableOrderRow {
  id: string
  base: string
  model: string
  lengthKm: number
  drawing: number
  stranding: number
  crosslinking: number
  sheathing: number
  unitKwhPerKm: number
  tcePerKm: number
  yoy: string
}

interface OutputMacroRow {
  id: string
  factory: string
  industry: string
  outputBillion: number
  energyTce: number
  unitOutputTce: number
  yoyDrop: string
}

const TRANSFORMER_ORDERS: TransformerOrderRow[] = [
  {
    id: 'ORD-2026-BY01',
    base: '沈变本部',
    model: 'ODFS-334MVA/500kV',
    capacityMva: 334.0,
    cutStack: 12450,
    winding: 8320,
    vacuumDry: 58400,
    assemblyTest: 26830,
    unitKwhPerKva: 0.317,
    tcePerUnit: 13.02,
    yoy: '-6.2%',
  },
  {
    id: 'ORD-2026-BY02',
    base: '衡变本部',
    model: 'SFP-240MVA/220kV',
    capacityMva: 240.0,
    cutStack: 8900,
    winding: 6120,
    vacuumDry: 41200,
    assemblyTest: 19780,
    unitKwhPerKva: 0.316,
    tcePerUnit: 9.34,
    yoy: '-6.5%',
  },
  {
    id: 'ORD-2026-BY03',
    base: '新变超高压',
    model: 'SZ11-50MVA/110kV',
    capacityMva: 50.0,
    cutStack: 2100,
    winding: 1450,
    vacuumDry: 8900,
    assemblyTest: 4050,
    unitKwhPerKva: 0.330,
    tcePerUnit: 2.03,
    yoy: '-4.3%',
  },
  {
    id: 'ORD-2026-BY04',
    base: '沈变本部',
    model: 'SSP-840MVA/500kV',
    capacityMva: 840.0,
    cutStack: 28400,
    winding: 19800,
    vacuumDry: 142000,
    assemblyTest: 68800,
    unitKwhPerKva: 0.308,
    tcePerUnit: 31.85,
    yoy: '-7.2%',
  },
  {
    id: 'ORD-2026-BY05',
    base: '天变制造',
    model: 'SCB13-1600kVA 干式变',
    capacityMva: 1.6,
    cutStack: 120,
    winding: 95,
    vacuumDry: 380,
    assemblyTest: 185,
    unitKwhPerKva: 0.487,
    tcePerUnit: 0.12,
    yoy: '-5.4%',
  },
]

const CABLE_ORDERS: CableOrderRow[] = [
  {
    id: 'ORD-2026-XL01',
    base: '鲁缆公司',
    model: 'YJLW03-64/110kV 1x1200mm²',
    lengthKm: 120.0,
    drawing: 14200,
    stranding: 9800,
    crosslinking: 82400,
    sheathing: 38600,
    unitKwhPerKm: 1.208,
    tcePerKm: 0.18,
    yoy: '-6.1%',
  },
  {
    id: 'ORD-2026-XL02',
    base: '新缆厂',
    model: 'JKLYJ-10kV 1x240mm² 架空线',
    lengthKm: 280.0,
    drawing: 18500,
    stranding: 12400,
    crosslinking: 95000,
    sheathing: 42000,
    unitKwhPerKm: 0.599,
    tcePerKm: 0.09,
    yoy: '-5.8%',
  },
  {
    id: 'ORD-2026-XL03',
    base: '德缆公司',
    model: 'WDZ-YJY-0.6/1kV 4x185mm²',
    lengthKm: 160.0,
    drawing: 11200,
    stranding: 8300,
    crosslinking: 64000,
    sheathing: 29500,
    unitKwhPerKm: 0.706,
    tcePerKm: 0.11,
    yoy: '-4.5%',
  },
]

const OUTPUT_MACRO_ROWS: OutputMacroRow[] = [
  {
    id: '01',
    factory: '沈变公司',
    industry: '变压器制造',
    outputBillion: 12.85,
    energyTce: 10854.2,
    unitOutputTce: 0.084,
    yoyDrop: '-6.7%',
  },
  {
    id: '02',
    factory: '衡变公司',
    industry: '变压器制造',
    outputBillion: 11.40,
    energyTce: 9940.6,
    unitOutputTce: 0.087,
    yoyDrop: '-5.4%',
  },
  {
    id: '03',
    factory: '鲁缆公司',
    industry: '线缆制造',
    outputBillion: 8.60,
    energyTce: 7380.5,
    unitOutputTce: 0.085,
    yoyDrop: '-5.6%',
  },
  {
    id: '04',
    factory: '新变厂',
    industry: '变压器制造',
    outputBillion: 9.80,
    energyTce: 8760.3,
    unitOutputTce: 0.089,
    yoyDrop: '-5.2%',
  },
  {
    id: '05',
    factory: '新缆厂',
    industry: '线缆制造',
    outputBillion: 6.50,
    energyTce: 5840.2,
    unitOutputTce: 0.089,
    yoyDrop: '-5.1%',
  },
  {
    id: '06',
    factory: '德缆公司',
    industry: '线缆制造',
    outputBillion: 5.80,
    energyTce: 5210.4,
    unitOutputTce: 0.089,
    yoyDrop: '-4.8%',
  },
  {
    id: '07',
    factory: '天变制造',
    industry: '变压器制造',
    outputBillion: 4.10,
    energyTce: 3610.1,
    unitOutputTce: 0.088,
    yoyDrop: '-5.5%',
  },
  {
    id: '08',
    factory: '中辰开关',
    industry: '高压成套',
    outputBillion: 2.60,
    energyTce: 2304.2,
    unitOutputTce: 0.088,
    yoyDrop: '-4.9%',
  },
]

export default function UnitReportPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'group_root',
    name: '特变电工集团 (全景汇总)',
    fullName: '特变电工集团 (全景汇总)',
    level: 'group',
    badge: '全集团',
  })

  const [activeTab, setActiveTab] = useState<'transformer' | 'cable' | 'output'>('transformer')
  const [searchKw, setSearchKw] = useState('')

  const filteredTransOrders = useMemo(() => {
    if (!searchKw.trim()) return TRANSFORMER_ORDERS
    const kw = searchKw.toLowerCase()
    return TRANSFORMER_ORDERS.filter(
      (r) =>
        r.id.toLowerCase().includes(kw) ||
        r.base.toLowerCase().includes(kw) ||
        r.model.toLowerCase().includes(kw),
    )
  }, [searchKw])

  const filteredCableOrders = useMemo(() => {
    if (!searchKw.trim()) return CABLE_ORDERS
    const kw = searchKw.toLowerCase()
    return CABLE_ORDERS.filter(
      (r) =>
        r.id.toLowerCase().includes(kw) ||
        r.base.toLowerCase().includes(kw) ||
        r.model.toLowerCase().includes(kw),
    )
  }, [searchKw])

  const filteredOutputRows = useMemo(() => {
    if (!searchKw.trim()) return OUTPUT_MACRO_ROWS
    const kw = searchKw.toLowerCase()
    return OUTPUT_MACRO_ROWS.filter(
      (r) =>
        r.factory.toLowerCase().includes(kw) ||
        r.industry.toLowerCase().includes(kw),
    )
  }, [searchKw])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* 顶部面包屑与操作栏 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Layers className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">单耗报表</h1>
            </div>
          </div>

          {/* 工具栏 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
              <Calendar className="size-3.5 text-slate-400" />
              <span>2026年08月 (当月完工订单)</span>
            </div>

            <button
              onClick={() => alert('正在导出【产业分类订单单耗统计报表 (Excel/PDF)】...')}
              className="h-8 px-3 rounded-lg bg-[#1677ff] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600 shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出产业单耗报表</span>
            </button>
          </div>
        </div>

        {/* 产业分类统计看板 (变压器 vs 线缆 独立统计对比) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {/* 变压器产业看板 */}
          <div className="bg-gradient-to-br from-blue-50/70 to-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold flex items-center gap-1">
                  <span>⚡ 变压器制造产业</span>
                  <span className="text-[10px] text-blue-600 font-normal">(沈变 / 衡变 / 新变)</span>
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">核算基准: 容量 (kVA)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="p-2 rounded-lg bg-white border border-blue-100 shadow-xs">
                  <div className="text-[10px] text-slate-500">完工订单总数</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    48 <span className="text-xs font-normal">笔</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-blue-100 shadow-xs">
                  <div className="text-[10px] text-slate-500">累计产出总容量</div>
                  <div className="text-lg font-bold font-mono text-blue-700 mt-0.5 tabular-nums">
                    12,450 <span className="text-xs font-normal">MVA</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-blue-100 shadow-xs">
                  <div className="text-[10px] text-slate-500">综合平均单耗</div>
                  <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5 tabular-nums">
                    0.318 <span className="text-[10px] font-normal">kWh/kVA</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-2.5 flex items-center justify-between border-t border-blue-100/60 pt-2">
              <span>
                核心耗能工序: <b className="text-slate-800">真空干燥工序 (占54.3%)</b>
              </span>
              <span className="text-emerald-700 font-bold">同比下降 6.2%</span>
            </div>
          </div>

          {/* 线缆产业看板 */}
          <div className="bg-gradient-to-br from-amber-50/70 to-white p-4 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold flex items-center gap-1">
                  <span>🔌 线缆制造产业</span>
                  <span className="text-[10px] text-amber-600 font-normal">(鲁缆 / 新缆 / 德缆)</span>
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">核算基准: 长度 (km)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="p-2 rounded-lg bg-white border border-amber-100 shadow-xs">
                  <div className="text-[10px] text-slate-500">完工订单总数</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                    62 <span className="text-xs font-normal">笔</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-amber-100 shadow-xs">
                  <div className="text-[10px] text-slate-500">累计生产总长度</div>
                  <div className="text-lg font-bold font-mono text-amber-700 mt-0.5 tabular-nums">
                    3,840 <span className="text-xs font-normal">km</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-amber-100 shadow-xs">
                  <div className="text-[10px] text-slate-500">综合平均单耗</div>
                  <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5 tabular-nums">
                    1.420 <span className="text-[10px] font-normal">kWh/km</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-2.5 flex items-center justify-between border-t border-amber-100/60 pt-2">
              <span>
                核心耗能工序: <b className="text-slate-800">三层共挤交联工序 (占48.5%)</b>
              </span>
              <span className="text-emerald-700 font-bold">同比下降 5.4%</span>
            </div>
          </div>
        </div>

        {/* 主数据报表：多 Tab 产业独立工作台 (变压器 / 线缆 / 万元产值) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* 产业分类 Tab 栏 */}
          <div className="p-2.5 border-b border-slate-200 bg-[#fafbfc] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('transformer')}
                className={cn(
                  'px-3 py-1.5 rounded-md font-bold shadow-xs flex items-center gap-1.5 transition-all',
                  activeTab === 'transformer'
                    ? 'bg-white text-[#1677ff]'
                    : 'text-slate-600 hover:text-slate-900 font-medium',
                )}
              >
                <Zap className="size-3.5" />
                <span>变压器产业订单单耗报表 ({TRANSFORMER_ORDERS.length}笔)</span>
              </button>

              <button
                onClick={() => setActiveTab('cable')}
                className={cn(
                  'px-3 py-1.5 rounded-md font-bold shadow-xs flex items-center gap-1.5 transition-all',
                  activeTab === 'cable'
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-600 hover:text-slate-900 font-medium',
                )}
              >
                <Cable className="size-3.5" />
                <span>线缆产业订单单耗报表 ({CABLE_ORDERS.length}笔)</span>
              </button>

              <button
                onClick={() => setActiveTab('output')}
                className={cn(
                  'px-3 py-1.5 rounded-md font-bold shadow-xs flex items-center gap-1.5 transition-all',
                  activeTab === 'output'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:text-slate-900 font-medium',
                )}
              >
                <span>万元产值能耗宏观汇总 (8基地)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchKw}
                  onChange={(e) => setSearchKw(e.target.value)}
                  placeholder="搜索订单号 / 产品型号 / 生产基地..."
                  className="h-8 pl-8 pr-2.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-blue-500 w-60"
                />
              </div>
            </div>
          </div>

          {/* 1. 变压器产业订单单耗明细表格 */}
          {activeTab === 'transformer' && (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                    <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10">订单编号</th>
                    <th className="py-2.5 px-3 sticky left-28 bg-slate-50 z-10 min-w-[110px]">生产基地</th>
                    <th className="py-2.5 px-3 min-w-[160px]">产品规格型号</th>
                    <th className="py-2.5 px-3 text-right">额定容量 (MVA)</th>
                    <th className="py-2.5 px-3 text-right">剪切叠装 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">线圈绕制 (kWh)</th>
                    <th className="py-2.5 px-3 text-right text-rose-600 font-bold">真空干燥 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">总装及试验 (kWh)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/40">
                      综合单耗 (kWh/kVA)
                    </th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-700">折标煤 (tce/台)</th>
                    <th className="py-2.5 px-3 text-center">同比变动</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                  {filteredTransOrders.map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 sticky left-0 bg-white font-bold text-blue-600">
                        {r.id}
                      </td>
                      <td className="py-2.5 px-3 sticky left-28 bg-white font-sans font-medium text-slate-800">
                        {r.base}
                      </td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">
                        {r.model}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                        {r.capacityMva.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {r.cutStack.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {r.winding.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-bold tabular-nums">
                        {r.vacuumDry.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {r.assemblyTest.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/40 tabular-nums">
                        {r.unitKwhPerKva.toFixed(3)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                        {r.tcePerUnit.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">
                        {r.yoy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. 线缆产业订单单耗明细表格 */}
          {activeTab === 'cable' && (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-50/80 text-slate-600 border-b border-amber-200 font-bold select-none">
                    <th className="py-2.5 px-3 sticky left-0 bg-amber-50 z-10">订单编号</th>
                    <th className="py-2.5 px-3 sticky left-28 bg-amber-50 z-10 min-w-[110px]">生产基地</th>
                    <th className="py-2.5 px-3 min-w-[170px]">线缆规格型号</th>
                    <th className="py-2.5 px-3 text-right">生产长度 (km)</th>
                    <th className="py-2.5 px-3 text-right">铜/铝拉丝 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">导体绞合 (kWh)</th>
                    <th className="py-2.5 px-3 text-right text-amber-700 font-bold">三层共挤交联 (kWh)</th>
                    <th className="py-2.5 px-3 text-right">护套及成缆 (kWh)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-amber-100/40">
                      综合单耗 (kWh/km)
                    </th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-700">折标煤 (tce/km)</th>
                    <th className="py-2.5 px-3 text-center">同比变动</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                  {filteredCableOrders.map((r) => (
                    <tr key={r.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-2.5 px-3 sticky left-0 bg-white font-bold text-amber-700">
                        {r.id}
                      </td>
                      <td className="py-2.5 px-3 sticky left-28 bg-white font-sans font-medium text-slate-800">
                        {r.base}
                      </td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">
                        {r.model}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                        {r.lengthKm.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {r.drawing.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {r.stranding.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-amber-700 font-bold tabular-nums">
                        {r.crosslinking.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {r.sheathing.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-amber-800 bg-amber-100/40 tabular-nums">
                        {r.unitKwhPerKm.toFixed(3)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                        {r.tcePerKm.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">
                        {r.yoy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. 万元产值能耗宏观汇总表格 */}
          {activeTab === 'output' && (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                    <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 w-12 text-center">序号</th>
                    <th className="py-2.5 px-3 sticky left-12 bg-slate-50 z-10 min-w-[140px]">制造工厂 / 基地</th>
                    <th className="py-2.5 px-3 min-w-[100px]">主营业务板块</th>
                    <th className="py-2.5 px-3 text-right">月度工业总产值 (亿元)</th>
                    <th className="py-2.5 px-3 text-right">综合能源消费 (tce)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/40">
                      万元产值能耗 (tce/万元)
                    </th>
                    <th className="py-2.5 px-3 text-center">同比降幅</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                  {filteredOutputRows.map((r, i) => (
                    <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 sticky left-0 bg-white font-sans text-slate-400 text-center">
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="py-2.5 px-3 sticky left-12 bg-white font-sans font-bold text-slate-900">
                        {r.factory}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-bold',
                            r.industry === '变压器制造'
                              ? 'bg-blue-50 text-blue-700'
                              : r.industry === '线缆制造'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-purple-50 text-purple-700',
                          )}
                        >
                          {r.industry}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                        {r.outputBillion.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {r.energyTce.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/40 tabular-nums">
                        {r.unitOutputTce.toFixed(3)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">
                        {r.yoyDrop}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

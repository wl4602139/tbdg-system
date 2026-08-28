'use client'

import { useState } from 'react'
import {
  TrendingUp,
  Calendar,
  Download,
  Zap,
  Flame,
  Layers,
  Package,
  CheckCircle2,
  TrendingDown,
  Building2,
  BarChart3,
  Award,
  Sparkles,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

interface FactoryOutputRow {
  id: string
  factory: string
  industry: string
  outputBillion: number
  energyTce: number
  unitOutputTce: number
  targetTce: number
  yoy: string
  status: '达标' | '超额达标' | '预警'
}

const FACTORY_OUTPUT_ROWS: FactoryOutputRow[] = [
  {
    id: '01',
    factory: '沈变公司',
    industry: '变压器制造',
    outputBillion: 12.85,
    energyTce: 10854.2,
    unitOutputTce: 0.084,
    targetTce: 0.089,
    yoy: '-6.7%',
    status: '超额达标',
  },
  {
    id: '02',
    factory: '衡变公司',
    industry: '变压器制造',
    outputBillion: 11.40,
    energyTce: 9940.6,
    unitOutputTce: 0.087,
    targetTce: 0.091,
    yoy: '-5.4%',
    status: '超额达标',
  },
  {
    id: '03',
    factory: '鲁缆公司',
    industry: '线缆制造',
    outputBillion: 8.60,
    energyTce: 7380.5,
    unitOutputTce: 0.085,
    targetTce: 0.090,
    yoy: '-5.6%',
    status: '超额达标',
  },
  {
    id: '04',
    factory: '新变厂',
    industry: '变压器制造',
    outputBillion: 9.80,
    energyTce: 8760.3,
    unitOutputTce: 0.089,
    targetTce: 0.093,
    yoy: '-5.2%',
    status: '达标',
  },
  {
    id: '05',
    factory: '新缆厂',
    industry: '线缆制造',
    outputBillion: 6.50,
    energyTce: 5840.2,
    unitOutputTce: 0.089,
    targetTce: 0.094,
    yoy: '-5.1%',
    status: '达标',
  },
  {
    id: '06',
    factory: '德缆公司',
    industry: '线缆制造',
    outputBillion: 5.80,
    energyTce: 5210.4,
    unitOutputTce: 0.089,
    targetTce: 0.093,
    yoy: '-4.8%',
    status: '达标',
  },
  {
    id: '07',
    factory: '天变制造',
    industry: '变压器制造',
    outputBillion: 4.10,
    energyTce: 3610.1,
    unitOutputTce: 0.088,
    targetTce: 0.092,
    yoy: '-5.5%',
    status: '超额达标',
  },
  {
    id: '08',
    factory: '中辰开关',
    industry: '高压成套',
    outputBillion: 2.60,
    energyTce: 2304.2,
    unitOutputTce: 0.088,
    targetTce: 0.092,
    yoy: '-4.9%',
    status: '达标',
  },
]

export default function UnitOutputPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'comp_sb',
    name: '沈变公司',
    fullName: '沈变公司 (东北输变电中心)',
    level: 'company',
    badge: '东北中心',
  })

  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        
        {/* 1. 顶部 Header 与 统一时间筛选 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <TrendingUp className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">单位产值能耗</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 时间维度统一 */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                月度 (08月)
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('quarter')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'quarter' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                季度 (Q3)
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('year')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'year' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                年度 (2026)
              </button>
            </div>

            <button
              type="button"
              onClick={() => alert(`正在导出【${selectedNode.name}】万元产值能耗考核对标报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出产值能耗表</span>
            </button>
          </div>
        </div>

        {/* 2. 5 大核心 KPI 卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          {/* 卡片 1: 单位产值综合能耗 (总裁督办重点) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/90 to-white border-2 border-[#1677ff] shadow-xs space-y-1.5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold flex items-center gap-1 text-blue-900">
                <Award className="size-3.5 text-[#1677ff]" />
                单位产值综合能耗
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                总裁考核
              </span>
            </div>
            <div className="text-xl font-bold text-[#1677ff]">
              0.318 <span className="text-xs font-sans text-slate-500 font-normal">tce/万元</span>
            </div>
            <div className="text-[11px] font-sans text-slate-600 pt-1 border-t border-blue-100 flex items-center justify-between">
              <span>同比变动: <strong className="text-emerald-600 font-mono font-bold">-6.2% ↓</strong></span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                超额达标(目标-5%)
              </span>
            </div>
          </div>

          {/* 卡片 2: 万元产值综合电耗 */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold flex items-center gap-1 text-slate-800">
                <Zap className="size-3.5 text-blue-600" />
                万元产值电耗
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                电力
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900">
              218.4 <span className="text-xs font-sans text-slate-500 font-normal">kWh/万元</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>同比: <strong className="text-emerald-600 font-mono font-bold">-5.8% ↓</strong></span>
              <span className="text-slate-400 font-mono">环比 -1.2%</span>
            </div>
          </div>

          {/* 卡片 3: 万元产值气耗 */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold flex items-center gap-1 text-amber-900">
                <Flame className="size-3.5 text-amber-600" />
                万元产值气耗
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                天然气
              </span>
            </div>
            <div className="text-xl font-bold text-amber-600">
              2.33 <span className="text-xs font-sans text-slate-500 font-normal">m³/万元</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>同比: <strong className="text-emerald-600 font-mono font-bold">-4.1% ↓</strong></span>
              <span className="text-slate-400 font-mono">环比 -0.8%</span>
            </div>
          </div>

          {/* 卡片 4: 工业总产值 */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold flex items-center gap-1 text-emerald-900">
                <Building2 className="size-3.5 text-emerald-600" />
                当期工业总产值
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                总产值分母
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900">
              4.96 <span className="text-xs font-sans text-slate-500 font-normal">亿元</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>同比: <strong className="text-emerald-600 font-mono font-bold">+3.2% ↑</strong></span>
              <span className="text-slate-400 font-mono">产值稳步扩张</span>
            </div>
          </div>

          {/* 卡片 5: 综合能耗折标总量 */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold flex items-center gap-1 text-slate-800">
                <Zap className="size-3.5 text-[#1677ff]" />
                综合能耗总量
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] text-[10px] font-bold">
                折标分子
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900">
              1,577.2 <span className="text-xs font-sans text-slate-500 font-normal">tce</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>同比: <strong className="text-emerald-600 font-mono font-bold">-2.7% ↓</strong></span>
              <span className="text-emerald-600 font-bold font-mono">能耗总量受控</span>
            </div>
          </div>
        </div>

        {/* 3. 8 大制造基地万元产值能耗卡片网格 */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#1677ff] rounded-full" />
              <h3 className="text-xs font-bold text-slate-800">
                【特变电工集团 8 大制造基地万元产值能耗与工业产值分布】
              </h3>
              <span className="text-[10px] text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                穿透口径：8大制造基地汇流层
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">考核标准：同比下降 ≥ 5.0%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {FACTORY_OUTPUT_ROWS.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-sans text-slate-900 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#1677ff]" />
                    {r.factory}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded font-bold font-sans',
                      r.status === '超额达标'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    )}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                  <div className="p-1.5 rounded bg-white border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-sans">产值能耗</span>
                    <strong className="text-[#1677ff]">{r.unitOutputTce}</strong>
                    <span className="text-[10px] text-emerald-600 block">同比 {r.yoy}</span>
                  </div>
                  <div className="p-1.5 rounded bg-white border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-sans">工业产值</span>
                    <strong className="text-slate-800">{r.outputBillion} 亿元</strong>
                    <span className="text-[10px] text-slate-400 block font-sans">{r.industry}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 8 大制造基地万元产值能耗横向对标透视表 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#1677ff] rounded-full" />
              <h3 className="text-xs font-bold text-slate-800">
                【1. 全集团 8 大制造基地月度万元产值能耗考核达成明细表 (2026年08月)】
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-mono">考核标准: 同比下降 ≥ 5.0%</div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                  <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3 sticky left-12 bg-slate-50 z-10 min-w-[140px]">制造工厂 / 基地</th>
                  <th className="py-2.5 px-3 min-w-[100px]">主营业务板块</th>
                  <th className="py-2.5 px-3 text-right">工业总产值 (亿元)</th>
                  <th className="py-2.5 px-3 text-right">综合能源消费 (tce)</th>
                  <th className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/40">
                    万元产值能耗 (tce/万元)
                  </th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-700">考核目标值</th>
                  <th className="py-2.5 px-3 text-center">同比降幅</th>
                  <th className="py-2.5 px-3 text-center">达成状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                {FACTORY_OUTPUT_ROWS.map((r, i) => (
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
                            : 'bg-purple-50 text-purple-700'
                        )}
                      >
                        {r.industry}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                      {r.outputBillion.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {r.energyTce.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#1677ff] bg-blue-50/30">
                      {r.unitOutputTce.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      {r.targetTce.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-emerald-600 font-bold font-mono">
                        {r.yoy}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1',
                          r.status === '超额达标'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        )}
                      >
                        <CheckCircle2 className="size-3" />
                        {r.status}
                      </span>
                    </td>
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

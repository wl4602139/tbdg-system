'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
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
      {/* 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* 1. 顶部 Header 与 模式子页面切换器 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#1677ff]" />
            <h1 className="text-xs font-bold text-slate-800">能效与单耗多维穿透</h1>
            <span className="text-xs font-mono font-normal text-slate-400 ml-1">
              【{selectedNode.name}】
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-mono font-bold ml-1">
              数据按日更新 (每日 00:00) · 总裁督办目标
            </span>
          </div>

          {/* 子页面切换 Tab */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button className="px-3 py-1 rounded-md font-bold bg-[#1677ff] text-white shadow-xs transition-all flex items-center gap-1.5">
              <Layers className="size-3.5" />
              <span>单位产值能耗 (全厂宏观 · 总裁同比-5%目标)</span>
            </button>
            <Link
              href="/zero-carbon/energy/unit-product"
              className="px-3 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5"
            >
              <Package className="size-3.5" />
              <span>单位产品能耗 (产线/型号/订单追溯)</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* 时间维度 */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-2 py-0.5 rounded-md font-medium transition-all',
                  timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600',
                )}
              >
                月度
              </button>
              <button
                onClick={() => setTimeDim('quarter')}
                className={cn(
                  'px-2 py-0.5 rounded-md font-medium transition-all',
                  timeDim === 'quarter' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600',
                )}
              >
                季度
              </button>
              <button
                onClick={() => setTimeDim('year')}
                className={cn(
                  'px-2 py-0.5 rounded-md font-medium transition-all',
                  timeDim === 'year' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600',
                )}
              >
                年度
              </button>
            </div>
            <button
              onClick={() => alert('正在导出万元产值能耗报表...')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出明细</span>
            </button>
          </div>
        </div>

        {/* 2. 总裁战略目标督办 KPI 卡片 (前置重点突出同比变化) */}
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

        {/* 3. 8 大制造基地万元产值能耗横向对标透视表 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-800">
                全集团 8 大制造基地月度万元产值能耗考核达成明细表 (2026年08月)
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
                    <td className="py-2.5 px-3 text-right font-bold text-slate-700 tabular-nums">
                      {r.targetTce.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">
                      {r.yoy}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1',
                          r.status === '超额达标'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === '达标'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800',
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

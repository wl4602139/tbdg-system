'use client'

import React, { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  Zap,
  Cable,
  TrendingDown,
  TrendingUp,
  Award,
  BarChart3,
  Layers,
  Sparkles,
  Maximize2,
  X,
  Building2,
  Lightbulb,
  Search,
  Filter,
  Check,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

// 8 家主要制造基地横向 PK 数据
interface BenchmarkBaseCard {
  id: string
  name: string
  rankBadge: string
  rankTone: 'gold' | 'silver' | 'bronze' | 'normal'
  unitKwhPerKva: number
  diffRatio: string
  savingPotential: string
  keyProcessDiff: string
}

const TRANSFORMER_BENCHMARK_BASES: BenchmarkBaseCard[] = [
  {
    id: 'xb',
    name: '新变厂 (新疆特高压)',
    rankBadge: '🥇 集团领跑',
    rankTone: 'gold',
    unitKwhPerKva: 0.308,
    diffRatio: '标杆基准 (0.0%)',
    savingPotential: '标杆基地',
    keyProcessDiff: '煤油气相干燥能效领先 8.4%',
  },
  {
    id: 'hb',
    name: '衡变公司 (南方制造)',
    rankBadge: '🥈 集团次优',
    rankTone: 'silver',
    unitKwhPerKva: 0.316,
    diffRatio: '+2.6% (距标杆)',
    savingPotential: '月降本 ¥3.8万',
    keyProcessDiff: '线圈绕制电加热保温待优化',
  },
  {
    id: 'sb',
    name: '沈变公司 (超高压本部)',
    rankBadge: '🥉 骨干基地',
    rankTone: 'bronze',
    unitKwhPerKva: 0.317,
    diffRatio: '+2.9% (距标杆)',
    savingPotential: '月降本 ¥4.2万',
    keyProcessDiff: '建议引入集中蒸汽替代电烘房',
  },
  {
    id: 'tb',
    name: '天变制造 (天津基地)',
    rankBadge: '第 4 名',
    rankTone: 'normal',
    unitKwhPerKva: 0.324,
    diffRatio: '+5.2% (距标杆)',
    savingPotential: '月降本 ¥6.5万',
    keyProcessDiff: '叠装液压机待变频改造',
  },
  {
    id: 'll',
    name: '鲁缆制造基地',
    rankBadge: '第 5 名',
    rankTone: 'normal',
    unitKwhPerKva: 0.332,
    diffRatio: '+7.8% (距标杆)',
    savingPotential: '月降本 ¥8.2万',
    keyProcessDiff: '热风循环风机变频调速待升级',
  },
  {
    id: 'xlc',
    name: '新缆厂特种装备',
    rankBadge: '第 6 名',
    rankTone: 'normal',
    unitKwhPerKva: 0.335,
    diffRatio: '+8.8% (距标杆)',
    savingPotential: '月降本 ¥9.4万',
    keyProcessDiff: '真空泵组待加装智能启停',
  },
  {
    id: 'dl',
    name: '德缆装备制造',
    rankBadge: '第 7 名',
    rankTone: 'normal',
    unitKwhPerKva: 0.338,
    diffRatio: '+9.7% (距标杆)',
    savingPotential: '月降本 ¥10.5万',
    keyProcessDiff: '待实施余热冷凝回收',
  },
  {
    id: 'zc',
    name: '中辰开关基地',
    rankBadge: '第 8 名',
    rankTone: 'normal',
    unitKwhPerKva: 0.345,
    diffRatio: '+12.0% (距标杆)',
    savingPotential: '月降本 ¥13.2万',
    keyProcessDiff: '烘烤固化炉温控待精准分区',
  },
]

export default function BenchmarkManagementPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'group_root',
    name: '特变电工集团 (全景汇总)',
    fullName: '特变电工集团 (全景汇总)',
    level: 'group',
    badge: '全集团',
  })

  // 先选品后看数
  const [category, setCategory] = useState<'transformer' | 'cable'>('transformer')
  const [pLineType, setPLineType] = useState('all')
  const [modelType, setModelType] = useState('ODFS-334MVA')
  const [baseStandard, setBaseStandard] = useState('nat_top')
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [isGroupTrendModalOpen, setIsGroupTrendModalOpen] = useState(false)

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        
        {/* 1. 顶部 Header 与 集团大盘趋势弹窗入口 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#1677ff]" />
            <h1 className="text-xs font-bold text-slate-800">跨公司产品横向对标管理</h1>
            <span className="text-xs font-mono font-normal text-slate-400 ml-1">
              【{selectedNode.name}】
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-mono font-bold ml-1">
              数据按日更新 (每日 00:00) · 跨基地横向 PK
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 集团看大盘：排名与趋势弹窗 */}
            <button
              type="button"
              onClick={() => setIsGroupTrendModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <BarChart3 className="size-3.5 text-emerald-600" />
              <span>集团大盘排名与趋势总览 (弹窗)</span>
            </button>
            <button
              type="button"
              onClick={() => alert('已生成并导出跨公司产品能耗横向对标简报 (Excel)...')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出对标分析简报</span>
            </button>
          </div>
        </div>

        {/* 2. 🌟 核心操作流：“先选品，后看数” 复合多选筛选工作台 (彻底砍掉顶部无意义汇总块) */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* 先选品：大类切换 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-bold">1. 选择产品大类:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCategory('transformer')}
                  className={cn(
                    'px-3 py-1 rounded-md font-bold transition-all cursor-pointer',
                    category === 'transformer'
                      ? 'bg-[#1677ff] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  ⚡ 变压器大类 (沈变/衡变/新变 · kWh/kVA)
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('cable')}
                  className={cn(
                    'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                    category === 'cable'
                      ? 'bg-amber-500 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  🔌 线缆大类 (鲁缆/新缆/德缆 · kWh/km)
                </button>
              </div>
            </div>

            {/* 多选筛选组合 */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 产线种类 */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-bold">成品产线:</span>
                <select
                  value={pLineType}
                  onChange={(e) => setPLineType(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-800 font-medium outline-none text-xs"
                >
                  <option value="all">全量成品产线</option>
                  <option value="ehv">特高压及超高压成品线 (500~1000kV)</option>
                  <option value="main">110~220kV 主变成品线</option>
                  <option value="dist">10~35kV 配电变及干变线</option>
                </select>
              </div>

              {/* 产品型号选择 */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-bold">产品型号:</span>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="bg-white border border-blue-300 rounded px-2.5 py-1 text-[#1677ff] font-bold outline-none cursor-pointer text-xs"
                >
                  <option value="ODFS-334MVA">ODFS-334MVA/500kV 单相自耦变压器 (重点对标)</option>
                  <option value="SSP-750MVA">SSP-750MVA/500kV 三相发电机变压器</option>
                  <option value="SZ-110kV">SZ-110kV/63000kVA 三相双绕组主变</option>
                  <option value="S13-M-800kVA">S13-M-800kVA 节能配电变压器</option>
                </select>
              </div>

              {/* 对标基准类型 */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">对标基准:</span>
                <select
                  value={baseStandard}
                  onChange={(e) => setBaseStandard(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 outline-none text-xs"
                >
                  <option value="nat_top">国家行业先进标杆 (GB/T)</option>
                  <option value="group_best">集团内部最优历史记录</option>
                </select>
              </div>

              {/* 时间周期 */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setTimeDim('month')}
                  className={cn(
                    'px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer',
                    timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600'
                  )}
                >
                  月度
                </button>
                <button
                  type="button"
                  onClick={() => setTimeDim('quarter')}
                  className={cn(
                    'px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer',
                    timeDim === 'quarter' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600'
                  )}
                >
                  季度
                </button>
                <button
                  type="button"
                  onClick={() => setTimeDim('year')}
                  className={cn(
                    'px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer',
                    timeDim === 'year' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600'
                  )}
                >
                  年度
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 🌟 8 家主要制造单位全量平铺看板 (空间换效率，免逐层点击展开) */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#1677ff] shrink-0" />
              <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                【8家主要制造基地同品类产品横向单耗平铺看板】
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">全量平铺 · 空间换效率 · 严禁过度下钻</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {TRANSFORMER_BENCHMARK_BASES.map((b) => (
              <div
                key={b.id}
                className={cn(
                  'p-3.5 rounded-xl border space-y-1.5 shadow-xs transition-all',
                  b.rankTone === 'gold'
                    ? 'border-2 border-emerald-500 bg-emerald-50/40'
                    : b.rankTone === 'silver'
                    ? 'border-blue-300 bg-blue-50/30'
                    : b.rankTone === 'bronze'
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="font-bold text-slate-900">{b.name}</span>
                  <span
                    className={cn(
                      'px-1.5 py-0.2 rounded text-[10px] font-bold',
                      b.rankTone === 'gold'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.rankTone === 'silver'
                        ? 'bg-blue-100 text-blue-800'
                        : b.rankTone === 'bronze'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {b.rankBadge}
                  </span>
                </div>

                <div className="text-lg font-extrabold text-slate-900 mt-1">
                  <span
                    className={
                      b.rankTone === 'gold'
                        ? 'text-emerald-700'
                        : b.rankTone === 'silver'
                        ? 'text-blue-700'
                        : 'text-slate-800'
                    }
                  >
                    {b.unitKwhPerKva.toFixed(3)}
                  </span>{' '}
                  <span className="text-xs font-normal text-slate-500 font-sans">kWh/kVA</span>
                </div>

                <div className="text-[11px] font-sans text-slate-600 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                  <span>{b.diffRatio}</span>
                  <span className="font-bold text-emerald-700">{b.savingPotential}</span>
                </div>

                <div className="text-[10px] font-sans text-slate-500 truncate" title={b.keyProcessDiff}>
                  💡 {b.keyProcessDiff}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 对标优化与技术改造建议指导框 */}
        <div className="p-4 bg-emerald-50/90 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed shadow-xs">
          <div className="font-bold flex items-center gap-1.5 text-emerald-800 mb-1.5">
            <Lightbulb className="size-4 text-emerald-600" />
            <span className="text-sm">跨基地对标节能降耗策略建议:</span>
          </div>
          针对沈变公司与衡变公司对比新变厂（标杆 0.308 kWh/kVA）的能耗差异分析，主要差距源自
          <span className="font-bold text-emerald-800 underline">
            煤油气相干燥与变压器铁心退火工段
          </span>
          。建议推广新变厂的“真空泵变频矩阵 + 余热梯度利用”成套成熟经验，预计可使全集团超高压变压器综合单耗整体降低
          <span className="font-bold font-mono"> 2.8%</span>，年节约用电量 <span className="font-bold font-mono">420 万kWh</span>。
        </div>
      </div>

      {/* 集团大盘排名与趋势总览 Modal 弹窗 */}
      {isGroupTrendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in">
          <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#fafbfc]">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  集团大盘产品能耗横向对标排名与近 6 个月趋势演进
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGroupTrendModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900 text-xs">
                  📊 当前对标型号：ODFS-334MVA/500kV 单相自耦变压器
                </span>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  全集团共有 3 家基地生产该型号，新变厂连续 3 个季度保持综合能耗领跑，沈变与衡变差距正在逐步收窄。
                </p>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                    <th className="py-2.5 px-3">对标排名</th>
                    <th className="py-2.5 px-3">基地名称</th>
                    <th className="py-2.5 px-3 text-right">3月单耗</th>
                    <th className="py-2.5 px-3 text-right">4月单耗</th>
                    <th className="py-2.5 px-3 text-right">5月单耗</th>
                    <th className="py-2.5 px-3 text-right">6月单耗</th>
                    <th className="py-2.5 px-3 text-right">7月单耗</th>
                    <th className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/50">
                      8月当期 (kWh/kVA)
                    </th>
                    <th className="py-2.5 px-3 text-center">半年降幅</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr className="hover:bg-emerald-50/30">
                    <td className="py-2 px-3 font-sans font-bold text-emerald-700">🥇 第 1 名</td>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">新变厂</td>
                    <td className="py-2 px-3 text-right">0.322</td>
                    <td className="py-2 px-3 text-right">0.319</td>
                    <td className="py-2 px-3 text-right">0.315</td>
                    <td className="py-2 px-3 text-right">0.312</td>
                    <td className="py-2 px-3 text-right">0.310</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700 bg-emerald-50/40">
                      0.308
                    </td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">-4.3%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2 px-3 font-sans font-bold text-blue-700">🥈 第 2 名</td>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">衡变公司</td>
                    <td className="py-2 px-3 text-right">0.334</td>
                    <td className="py-2 px-3 text-right">0.328</td>
                    <td className="py-2 px-3 text-right">0.324</td>
                    <td className="py-2 px-3 text-right">0.320</td>
                    <td className="py-2 px-3 text-right">0.318</td>
                    <td className="py-2 px-3 text-right font-bold text-blue-700 bg-blue-50/40">
                      0.316
                    </td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">-5.4%</td>
                  </tr>
                  <tr className="hover:bg-amber-50/30">
                    <td className="py-2 px-3 font-sans font-bold text-amber-700">🥉 第 3 名</td>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">沈变公司</td>
                    <td className="py-2 px-3 text-right">0.338</td>
                    <td className="py-2 px-3 text-right">0.332</td>
                    <td className="py-2 px-3 text-right">0.326</td>
                    <td className="py-2 px-3 text-right">0.322</td>
                    <td className="py-2 px-3 text-right">0.319</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-800 bg-amber-50/40">
                      0.317
                    </td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">-6.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-slate-100 bg-[#fafbfc] flex justify-end">
              <button
                type="button"
                onClick={() => setIsGroupTrendModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

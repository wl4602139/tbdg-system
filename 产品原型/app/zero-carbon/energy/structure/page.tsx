'use client'

import React, { useState } from 'react'
import {
  Calendar,
  Download,
  Building2,
  Zap,
  Flame,
  Droplets,
  Layers,
  Sparkles,
  Maximize2,
  X,
  FileSpreadsheet,
  TrendingDown,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

// 集团 6 大直属经营单位水电消耗与能耗结构
interface CompanyPanorama {
  id: string
  name: string
  color: string
  totalTce: number
  elecWanKwh: number
  elecYoy: string
  waterWanT: number
  waterYoy: string
  status: 'active' | 'grayed' // 灰色搁置标识
}

const PANORAMA_COMPANIES: CompanyPanorama[] = [
  { id: 'comp_sb', name: '沈变公司', color: '#1677ff', totalTce: 1577.2, elecWanKwh: 1080.0, elecYoy: '-3.2%', waterWanT: 4.8, waterYoy: '-4.0%', status: 'active' },
  { id: 'comp_hb', name: '衡变公司', color: '#10b981', totalTce: 1420.5, elecWanKwh: 985.0, elecYoy: '-2.8%', waterWanT: 4.2, waterYoy: '-3.5%', status: 'active' },
  { id: 'comp_xb', name: '新变厂', color: '#8b5cf6', totalTce: 1280.0, elecWanKwh: 890.0, elecYoy: '-2.1%', waterWanT: 3.9, waterYoy: '-2.0%', status: 'active' },
  { id: 'comp_ll', name: '鲁缆公司', color: '#f59e0b', totalTce: 860.4, elecWanKwh: 620.0, elecYoy: '-3.0%', waterWanT: 2.1, waterYoy: '-1.5%', status: 'active' },
  { id: 'comp_xlc', name: '新缆厂', color: '#06b6d4', totalTce: 740.2, elecWanKwh: 540.0, elecYoy: '-1.8%', waterWanT: 1.8, waterYoy: '-1.2%', status: 'active' },
  { id: 'comp_dl', name: '德缆公司', color: '#f43f5e', totalTce: 620.8, elecWanKwh: 450.0, elecYoy: '-2.4%', waterWanT: 1.5, waterYoy: '-2.0%', status: 'active' },
  { id: 'comp_sk', name: '上海上开 (无归属搁置)', color: '#94a3b8', totalTce: 0.0, elecWanKwh: 0.0, elecYoy: '0%', waterWanT: 0.0, waterYoy: '0%', status: 'grayed' },
]

export default function EnergyStructurePage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'comp_sb',
    name: '沈变公司',
    fullName: '沈变公司 (东北输变电中心)',
    level: 'company',
    badge: '东北中心',
  })

  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [highlightedMedium, setHighlightedMedium] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        
        {/* 1. 顶部 Header 与 统一时间维度筛选 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#1677ff]" />
            <h1 className="text-xs font-bold text-slate-800">用能结构分析中心</h1>
            <span className="text-xs font-mono font-normal text-slate-400 ml-1">
              【{selectedNode.name}】
            </span>
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
              onClick={() => alert(`正在导出【${selectedNode.name}】用能结构与 ESG 资源透视表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出数据表</span>
            </button>
          </div>
        </div>

        {/* 2. 5 大核心指标卡片 (替代原总费用框，增加 ESG 水资源消耗展示) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          {/* 卡片 1: 综合能耗折标总量 */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold flex items-center gap-1 text-slate-800">
                <Zap className="size-3.5 text-[#1677ff]" />
                综合能耗总量 (tce)
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] text-[10px] font-bold">
                折标总核算
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              1,577.2 <span className="text-xs font-sans text-slate-500 font-normal">tce</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>同比: <strong className="text-emerald-600 font-mono">-2.7% ↓</strong></span>
              <span>环比: <strong className="text-emerald-600 font-mono">-1.1% ↓</strong></span>
            </div>
          </div>

          {/* 卡片 2: 生产电力消耗 */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold flex items-center gap-1 text-blue-800">
                <Zap className="size-3.5 text-blue-500" />
                生产电力消耗
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                占比 84.2%
              </span>
            </div>
            <div className="text-xl font-extrabold text-[#1677ff]">
              1,080.0 <span className="text-xs font-sans text-slate-500 font-normal">万kWh</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>折标: <strong className="font-mono text-slate-800">1,327.3</strong> tce</span>
              <span className="text-emerald-600 font-mono font-bold">同比 -3.2%</span>
            </div>
          </div>

          {/* 卡片 3: 管道天然气 */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold flex items-center gap-1 text-amber-800">
                <Flame className="size-3.5 text-amber-500" />
                管道天然气
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">
                占比 9.6%
              </span>
            </div>
            <div className="text-xl font-extrabold text-amber-600">
              12.5 <span className="text-xs font-sans text-slate-500 font-normal">万m³</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>折标: <strong className="font-mono text-slate-800">151.8</strong> tce</span>
              <span className="text-emerald-600 font-mono font-bold">同比 -1.8%</span>
            </div>
          </div>

          {/* 卡片 4: 工业蒸汽 */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold flex items-center gap-1 text-purple-800">
                <span className="size-2 rounded-full bg-purple-500" />
                工业蒸汽
              </span>
              <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">
                占比 6.2%
              </span>
            </div>
            <div className="text-xl font-extrabold text-purple-700">
              740.0 <span className="text-xs font-sans text-slate-500 font-normal">t</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>折标: <strong className="font-mono text-slate-800">98.1</strong> tce</span>
              <span className="text-amber-600 font-mono font-bold">同比 +0.5%</span>
            </div>
          </div>

          {/* 卡片 5: 水资源消耗 (ESG合规关键指标，替换原当期总费用框) */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-cyan-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold flex items-center gap-1 text-cyan-800">
                <Droplets className="size-3.5 text-cyan-600" />
                水资源消耗 (ESG)
              </span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-700 text-[10px] font-bold border border-cyan-200">
                独立指标
              </span>
            </div>
            <div className="text-xl font-extrabold text-cyan-700">
              4.8 <span className="text-xs font-sans text-slate-500 font-normal">万t</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>水费支出: <strong className="font-mono text-slate-800">¥8.3万</strong></span>
              <span className="text-emerald-600 font-mono font-bold">同比 -4.0% ↓</span>
            </div>
          </div>
        </div>

        {/* 3. 集团全景板块：6 大直属经营单位水电消耗分布透视 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#1677ff] shrink-0" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                【特变电工集团 6 大直属经营单位水电消耗与综合能耗分布】
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] font-mono">
                集团统管 · ESG水指标独立展现
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              无归属节点 (如上开) 标灰搁置
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {PANORAMA_COMPANIES.map((c) => (
              <div
                key={c.id}
                className={cn(
                  'p-3.5 rounded-xl border transition-all space-y-2',
                  c.status === 'grayed'
                    ? 'bg-slate-100 border-slate-200 opacity-60'
                    : 'bg-slate-50/50 hover:border-blue-300 border-slate-200'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-sans text-slate-900 flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                  {c.status === 'grayed' ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-500 font-sans font-bold">
                      暂无归属搁置
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold">
                      {c.totalTce.toFixed(1)} tce
                    </span>
                  )}
                </div>

                {c.status !== 'grayed' && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                    <div className="p-2 rounded bg-white border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-sans">⚡ 用电量 (万kWh)</span>
                      <strong className="text-[#1677ff]">{c.elecWanKwh.toFixed(1)}</strong>
                      <span className="text-[10px] text-emerald-600 block">同比 {c.elecYoy}</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-sans">💧 用水量 (万t)</span>
                      <strong className="text-cyan-700">{c.waterWanT.toFixed(1)}</strong>
                      <span className="text-[10px] text-emerald-600 block">同比 {c.waterYoy}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. 核心模块一：用能结构南丁格尔玫瑰图 + 绿色降本增效指导 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#1677ff] shrink-0" />
              <h2 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                【1. 各能源介质用能结构 (南丁格尔玫瑰图) 与折标/费用联动透视】
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono font-bold">
                玫瑰图放大水/气小占比数据视觉可见性
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium font-sans">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#1677ff]" /> ⚡ 电力 (84.2%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#fa8c16]" /> 🔥 天然气 (9.6%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#722ed1]" /> 💨 蒸汽 (6.2%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#0ea5e9]" /> 💧 工业水 (ESG)
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* 左栏：SVG 南丁格尔玫瑰图 (极坐标半径差异明显) */}
            <div className="w-full lg:w-[340px] shrink-0 flex flex-col items-center justify-center p-3 bg-slate-50/70 rounded-xl border border-slate-200">
              <div className="relative w-full flex items-center justify-center py-2" style={{ height: '250px' }}>
                <svg className="w-64 h-64 select-none" viewBox="0 0 240 240">
                  {/* 同心极坐标网格 */}
                  <circle cx="120" cy="120" r="105" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="120" cy="120" r="75" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="120" cy="120" r="50" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="120" cy="120" r="28" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />

                  {/* 1. 电力扇区 (R=105, -90°~45°, 极大半径) */}
                  <path
                    d="M 120 120 L 120 15 A 105 105 0 0 1 194.2 194.2 Z"
                    fill="#1677ff"
                    fillOpacity={highlightedMedium === 'elec' ? '1' : '0.85'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:fill-opacity-100"
                    onMouseEnter={() => setHighlightedMedium('elec')}
                    onMouseLeave={() => setHighlightedMedium(null)}
                  />

                  {/* 2. 天然气扇区 (R=75, 45°~135°, 中等半径) */}
                  <path
                    d="M 120 120 L 173.0 173.0 A 75 75 0 0 1 67.0 173.0 Z"
                    fill="#fa8c16"
                    fillOpacity={highlightedMedium === 'gas' ? '1' : '0.85'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:fill-opacity-100"
                    onMouseEnter={() => setHighlightedMedium('gas')}
                    onMouseLeave={() => setHighlightedMedium(null)}
                  />

                  {/* 3. 蒸汽扇区 (R=60, 135°~225°, 小半径) */}
                  <path
                    d="M 120 120 L 77.6 162.4 A 60 60 0 0 1 77.6 77.6 Z"
                    fill="#722ed1"
                    fillOpacity={highlightedMedium === 'steam' ? '1' : '0.85'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:fill-opacity-100"
                    onMouseEnter={() => setHighlightedMedium('steam')}
                    onMouseLeave={() => setHighlightedMedium(null)}
                  />

                  {/* 4. 工业水扇区 (R=50, 225°~270°, ESG水资源显眼化) */}
                  <path
                    d="M 120 120 L 84.6 84.6 A 50 50 0 0 1 120 70 Z"
                    fill="#0ea5e9"
                    fillOpacity={highlightedMedium === 'water' ? '1' : '0.9'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:fill-opacity-100"
                    onMouseEnter={() => setHighlightedMedium('water')}
                    onMouseLeave={() => setHighlightedMedium(null)}
                  />

                  {/* 中心总折标数 */}
                  <circle cx="120" cy="120" r="26" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="120" y="116" fontSize="9" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">
                    总折标
                  </text>
                  <text
                    x="120"
                    y="128"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#1e293b"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    1,577
                  </text>
                </svg>
              </div>

              {/* 南丁格尔玫瑰图优势说明提示 */}
              <div className="w-full mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 font-sans">
                💡 <strong>南丁格尔玫瑰图优势</strong>：水费与电费数值悬殊，环形图易使水/气隐藏。玫瑰图利用极坐标面积弥补差距，强化 ESG 水资源可见性。
              </div>
            </div>

            {/* 右栏：4 大介质折标/费用联动与绿色降本指导 */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              {/* 电力 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#1677ff]" /> 1. 生产电力 (主供能介质)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#1677ff] bg-blue-50 px-2 py-0.5 rounded">
                    用能折标 84.2% · 费用占比 88.5%
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono text-xs pt-1 border-t border-slate-100">
                  <div><span className="text-[10px] text-slate-400 block font-sans">物理用量</span><strong>1,080.0 万kWh</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">折标当量</span><strong className="text-blue-600">1,327.3 tce</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">当期水/电费</span><strong className="text-slate-800">¥675.0万元</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">同比增减</span><strong className="text-emerald-600">-3.2% ↓</strong></div>
                </div>
              </div>

              {/* 天然气 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition-all space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#fa8c16]" /> 2. 管道天然气 (清洁热源)
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    用能折标 9.6% · 费用占比 7.0% (高性价比)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono text-xs pt-1 border-t border-slate-100">
                  <div><span className="text-[10px] text-slate-400 block font-sans">物理用量</span><strong>12.5 万m³</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">折标当量</span><strong className="text-amber-600">151.8 tce</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">当期气费</span><strong className="text-slate-800">¥53.6万元</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">同比增减</span><strong className="text-emerald-600">-1.8% ↓</strong></div>
                </div>
              </div>

              {/* 蒸汽 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-all space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#722ed1]" /> 3. 工业蒸汽 (干燥工艺)
                  </span>
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    用能折标 6.2% · 费用占比 3.4%
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono text-xs pt-1 border-t border-slate-100">
                  <div><span className="text-[10px] text-slate-400 block font-sans">物理用量</span><strong>740.0 t</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">折标当量</span><strong className="text-purple-700">98.1 tce</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">当期汽费</span><strong className="text-slate-800">¥25.6万元</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">同比增减</span><strong className="text-amber-600">+0.5% ↑</strong></div>
                </div>
              </div>

              {/* 工业水 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 transition-all space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#0ea5e9]" /> 4. 工业水资源 (ESG独立节点)
                  </span>
                  <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                    实物量 4.8万t · 费用占比 1.1%
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono text-xs pt-1 border-t border-slate-100">
                  <div><span className="text-[10px] text-slate-400 block font-sans">物理用水</span><strong>4.8 万t</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">ESG环保属性</span><strong className="text-cyan-700">独立合规项</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">当期水费</span><strong className="text-slate-800">¥8.3万元</strong></div>
                  <div><span className="text-[10px] text-slate-400 block font-sans">同比增减</span><strong className="text-emerald-600">-4.0% ↓</strong></div>
                </div>
              </div>

              {/* 💡 绿色降本增效结构优化指导框 */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1 font-sans">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Sparkles className="size-4 text-[#1677ff]" />
                  <span>降本增效决策依据：天然气 vs 电力结构优化建议</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  天然气折标用能占比 9.6% 但费用仅占 7.0%，热值单价明显低于电力。建议在烘干与清洗工序中优先提升天然气替代比例，预计可为【{selectedNode.name}】降低年度能源成本 <strong>¥24.5 万元</strong>。
                </p>
              </div>
            </div>
          </div>

          {/* 展开弹窗明细按钮 */}
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-sans">
              💡 图表集中展示，避免多页面反复跳转。支持透视表下载。
            </span>
            <button
              type="button"
              onClick={() => setIsDetailModalOpen(true)}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-50 text-[#1677ff] hover:bg-blue-100 text-xs font-bold transition-all border border-blue-200 cursor-pointer"
            >
              <Maximize2 className="size-3.5" />
              <span>展开具体数据明细 (弹窗)</span>
            </button>
          </div>
        </div>

      </div>

      {/* 🌟 具体数据明细透视弹窗 Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#fafbfc]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-[#1677ff]" />
                <h3 className="text-sm font-bold text-slate-800">
                  【{selectedNode.name}】用能结构与 ESG 资源消耗全景明细透视
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800">车间/工序级能源介质消耗与折标分解</span>
                <button
                  type="button"
                  onClick={() => alert(`正在导出【${selectedNode.name}】明细 Excel...`)}
                  className="px-3 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  导出 Excel 报表
                </button>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold font-sans">
                    <th className="py-2.5 px-3">工序 / 车间</th>
                    <th className="py-2.5 px-3 text-right">电力 (万kWh)</th>
                    <th className="py-2.5 px-3 text-right">天然气 (万m³)</th>
                    <th className="py-2.5 px-3 text-right">工业蒸汽 (t)</th>
                    <th className="py-2.5 px-3 text-right text-cyan-700">工业水 (万t) [ESG]</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/50">
                      折标当量 (tce)
                    </th>
                    <th className="py-2.5 px-3 text-right">能耗占比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">1. 真空干燥工段 (煤油气相/蒸汽)</td>
                    <td className="py-2.5 px-3 text-right">485.0</td>
                    <td className="py-2.5 px-3 text-right">6.8</td>
                    <td className="py-2.5 px-3 text-right">520.0</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">1.2</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">747.5</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">47.4%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">2. 铁芯剪切与叠装工序</td>
                    <td className="py-2.5 px-3 text-right">240.0</td>
                    <td className="py-2.5 px-3 text-right">2.1</td>
                    <td className="py-2.5 px-3 text-right">40.0</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">0.8</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">325.8</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">20.7%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">3. 线圈绕制与绝缘处理工段</td>
                    <td className="py-2.5 px-3 text-right">195.0</td>
                    <td className="py-2.5 px-3 text-right">1.9</td>
                    <td className="py-2.5 px-3 text-right">110.0</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">1.1</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">277.3</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">17.6%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">4. 总装配、试验与辅助动力站房</td>
                    <td className="py-2.5 px-3 text-right">160.0</td>
                    <td className="py-2.5 px-3 text-right">1.7</td>
                    <td className="py-2.5 px-3 text-right">70.0</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">1.7</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">226.6</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">14.3%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-slate-100 bg-[#fafbfc] flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
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

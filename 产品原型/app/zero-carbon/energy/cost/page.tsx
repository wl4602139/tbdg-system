'use client'

import React, { useState, useMemo } from 'react'
import {
  DollarSign,
  Coins,
  Zap,
  Flame,
  Droplets,
  Calendar,
  Download,
  Lightbulb,
  Sun,
  TrendingDown,
  Clock,
  ArrowRight,
  Sparkles,
  Maximize2,
  X,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 集团 6 大直属经营单位成本与水电分布
interface CompanyCostInfo {
  id: string
  name: string
  color: string
  totalCostWan: number
  elecCostWan: number
  waterCostWan: number
  waterWanT: number
  status: 'active' | 'grayed' // 灰色搁置标识
}

const PANORAMA_COMPANY_COSTS: CompanyCostInfo[] = [
  { id: 'comp_sb', name: '沈变公司', color: '#1677ff', totalCostWan: 762.5, elecCostWan: 675.0, waterCostWan: 8.3, waterWanT: 4.8, status: 'active' },
  { id: 'comp_hb', name: '衡变公司', color: '#10b981', totalCostWan: 685.0, elecCostWan: 605.0, waterCostWan: 7.2, waterWanT: 4.2, status: 'active' },
  { id: 'comp_xb', name: '新变厂', color: '#8b5cf6', totalCostWan: 590.2, elecCostWan: 520.0, waterCostWan: 6.8, waterWanT: 3.9, status: 'active' },
  { id: 'comp_ll', name: '鲁缆公司', color: '#f59e0b', totalCostWan: 420.8, elecCostWan: 375.0, waterCostWan: 3.6, waterWanT: 2.1, status: 'active' },
  { id: 'comp_xlc', name: '新缆厂', color: '#06b6d4', totalCostWan: 360.5, elecCostWan: 320.0, waterCostWan: 3.1, waterWanT: 1.8, status: 'active' },
  { id: 'comp_dl', name: '德缆公司', color: '#f43f5e', totalCostWan: 310.0, elecCostWan: 275.0, waterCostWan: 2.6, waterWanT: 1.5, status: 'active' },
  { id: 'comp_sk', name: '上海上开 (无归属搁置)', color: '#94a3b8', totalCostWan: 0.0, elecCostWan: 0.0, waterCostWan: 0.0, waterWanT: 0.0, status: 'grayed' },
]

export default function EnergyCostPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'comp_sb',
    name: '沈变公司',
    fullName: '沈变公司 (东北输变电中心)',
    level: 'company',
    badge: '东北中心',
  })

  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [activeHoverSector, setActiveHoverSector] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // 新能源消纳与超发上网 24 小时曲线 (合并展示消纳与上网)
  const greenPowerTrendData = [
    { time: '00:00', 新能源总出力: 0, 厂区自用消纳: 0, 超发上网电量: 0 },
    { time: '04:00', 新能源总出力: 0, 厂区自用消纳: 0, 超发上网电量: 0 },
    { time: '08:00', 新能源总出力: 2100, 厂区自用消纳: 2100, 超发上网电量: 0 },
    { time: '11:00', 新能源总出力: 4500, 厂区自用消纳: 3800, 超发上网电量: 700 },
    { time: '13:00', 新能源总出力: 4850, 厂区自用消纳: 3600, 超发上网电量: 1250 },
    { time: '15:00', 新能源总出力: 4100, 厂区自用消纳: 3800, 超发上网电量: 300 },
    { time: '18:00', 新新能源总出力: 350, 厂区自用消纳: 350, 超发上网电量: 0 },
    { time: '22:00', 新能源总出力: 0, 厂区自用消纳: 0, 超发上网电量: 0 },
  ]

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
              <DollarSign className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">能源成本分析</h1>
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
              onClick={() => alert(`正在导出【${selectedNode.name}】能源成本与折标分析报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出成本分析表</span>
            </button>
          </div>
        </div>

        {/* 2. 5 大核心 KPI 卡片 (折标煤移至本模块重点展示，剔除总费用，增加 ESG 水资源) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          {/* 卡片 1: 综合折标能耗总量 (原指标管控/结构迁移至此) */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs font-sans">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Zap className="size-3.5 text-[#1677ff]" />
                综合折标能耗总量
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] font-bold">
                tce 单位换算
              </span>
            </div>
            <div className="my-2">
              <div className="text-xl font-extrabold font-mono text-slate-900">
                1,577.2 <span className="text-xs font-normal text-slate-500 font-sans">tce</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                折标成本单价: <span className="font-mono text-slate-700 font-bold">4,834 元/tce</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400 font-sans">
              <span>用于指导性价比选型</span>
              <span className="text-emerald-600 font-bold font-mono">同比 -2.7% ↓</span>
            </div>
          </div>

          {/* 卡片 2: 生产电力总支出 */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs font-sans">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Zap className="size-3.5 text-blue-500" />
                生产电力总支出
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 font-bold">
                88.5% 占比
              </span>
            </div>
            <div className="my-2">
              <div className="text-xl font-extrabold font-mono text-blue-600">
                ¥675.0 <span className="text-xs font-normal text-slate-500 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                用电量: <span className="font-mono text-slate-700 font-bold">1,080.0 万kWh</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400 font-sans">
              <span>平均电价: <strong className="font-mono text-slate-700">0.625元/度</strong></span>
              <span className="text-emerald-600 font-bold font-mono">同比 -3.2%</span>
            </div>
          </div>

          {/* 卡片 3: 管道天然气成本 */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs font-sans">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Flame className="size-3.5 text-amber-500" />
                管道天然气成本
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-bold">
                7.0% 占比
              </span>
            </div>
            <div className="my-2">
              <div className="text-xl font-extrabold font-mono text-amber-600">
                ¥53.6 <span className="text-xs font-normal text-slate-500 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                用气量: <span className="font-mono text-slate-700 font-bold">12.5 万m³</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400 font-sans">
              <span>单位气价: <strong className="font-mono text-slate-700">4.29元/m³</strong></span>
              <span className="text-emerald-600 font-bold font-mono">同比 -1.8%</span>
            </div>
          </div>

          {/* 卡片 4: 工业蒸汽热力成本 */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs font-sans">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <span className="size-2 rounded-full bg-purple-500" />
                工业蒸汽热力成本
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-bold">
                3.4% 占比
              </span>
            </div>
            <div className="my-2">
              <div className="text-xl font-extrabold font-mono text-purple-700">
                ¥25.6 <span className="text-xs font-normal text-slate-500 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                蒸汽量: <span className="font-mono text-slate-700 font-bold">740.0 t</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400 font-sans">
              <span>单位蒸汽价: <strong className="font-mono text-slate-700">346元/t</strong></span>
              <span className="text-amber-600 font-bold font-mono">同比 +0.5%</span>
            </div>
          </div>

          {/* 卡片 5: 水资源消耗 (ESG合规要点，替换原总费用框) */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-cyan-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs font-sans">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Droplets className="size-3.5 text-cyan-600" />
                水资源消耗 (ESG)
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
                独立成本项
              </span>
            </div>
            <div className="my-2">
              <div className="text-xl font-extrabold font-mono text-cyan-700">
                4.8 <span className="text-xs font-normal text-slate-500 font-sans">万吨 (¥8.3万)</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                综合水价: <span className="font-mono text-slate-700 font-bold">1.73 元/t</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-400 font-sans">
              <span>复用率: <strong className="font-mono text-emerald-600">92.4%</strong></span>
              <span className="text-emerald-600 font-bold font-mono">同比 -4.0%</span>
            </div>
          </div>
        </div>

        {/* 3. 集团全景板块：6 大直属经营单位水电成本与折标分布透视 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#1677ff] shrink-0" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                【特变电工集团 6 大直属经营单位水电成本与折标总量分布】
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] font-mono">
                集团汇总 · ESG水费独立展现
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              无归属节点 (如上开) 标灰搁置
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {PANORAMA_COMPANY_COSTS.map((c) => (
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
                      用能成本 ¥{c.totalCostWan.toFixed(1)}万
                    </span>
                  )}
                </div>

                {c.status !== 'grayed' && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                    <div className="p-2 rounded bg-white border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-sans">⚡ 电费支出 (万元)</span>
                      <strong className="text-[#1677ff]">¥{c.elecCostWan.toFixed(1)}万</strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-sans">💧 水费/水量 (ESG)</span>
                      <strong className="text-cyan-700">¥{c.waterCostWan.toFixed(1)}万 ({c.waterWanT}万t)</strong>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. 核心模块一：能源成本构成南丁格尔玫瑰图与各介质折标单价 (元/TCE) 对标 */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-blue-600 shrink-0" />
              <h2 className="text-xs font-bold text-slate-900">
                【1. 能源成本构成 (南丁格尔玫瑰图) 与各介质折标单价 (元/TCE) 效益对标】
              </h2>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono">
                极坐标玫瑰图极径视觉放大水费等小占比数据可见性
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="size-2.5 rounded-full bg-blue-500" /> 电费 (88.5%)
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="size-2.5 rounded-full bg-amber-500" /> 气费 (7.0%)
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="size-2.5 rounded-full bg-purple-500" /> 汽费 (3.4%)
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="size-2.5 rounded-full bg-cyan-500" /> 水费 (1.1%) [ESG]
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* 左侧：高清 SVG 南丁格尔玫瑰图 (固定 380px 宽度) */}
            <div className="w-full lg:w-[380px] shrink-0 flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-xl border border-slate-200">
              <div className="relative w-[300px] h-[260px] flex items-center justify-center">
                <svg viewBox="0 0 300 260" className="w-full h-full select-none">
                  <g transform="translate(150, 130)">
                    <circle r="30" fill="none" stroke="#cbd5e1" strokeDasharray="2,2" />
                    <circle r="60" fill="none" stroke="#cbd5e1" strokeDasharray="2,2" />
                    <circle r="90" fill="none" stroke="#cbd5e1" strokeDasharray="2,2" />
                    <circle r="115" fill="none" stroke="#cbd5e1" strokeDasharray="2,2" />

                    {/* 电力 (88.5% 支出, 半径 115) */}
                    <path
                      d="M 0 0 L 0 -115 A 115 115 0 0 1 110 35 Z"
                      fill="#3b82f6"
                      fillOpacity={activeHoverSector === 'elec' ? '1' : '0.88'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-95 transition-opacity cursor-pointer"
                      onMouseEnter={() => setActiveHoverSector('elec')}
                      onMouseLeave={() => setActiveHoverSector(null)}
                    />

                    {/* 天然气 (7.0% 支出, 半径 75) */}
                    <path
                      d="M 0 0 L 110 35 A 75 75 0 0 1 -25 70 Z"
                      fill="#f59e0b"
                      fillOpacity={activeHoverSector === 'gas' ? '1' : '0.88'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-95 transition-opacity cursor-pointer"
                      onMouseEnter={() => setActiveHoverSector('gas')}
                      onMouseLeave={() => setActiveHoverSector(null)}
                    />

                    {/* 蒸汽 (3.4% 支出, 半径 55) */}
                    <path
                      d="M 0 0 L -25 70 A 55 55 0 0 1 -50 -20 Z"
                      fill="#a855f7"
                      fillOpacity={activeHoverSector === 'steam' ? '1' : '0.88'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-95 transition-opacity cursor-pointer"
                      onMouseEnter={() => setActiveHoverSector('steam')}
                      onMouseLeave={() => setActiveHoverSector(null)}
                    />

                    {/* 水费 (1.1% 支出, 半径 35) [ESG合规] */}
                    <path
                      d="M 0 0 L -50 -20 A 35 35 0 0 1 0 -115 Z"
                      fill="#06b6d4"
                      fillOpacity={activeHoverSector === 'water' ? '1' : '0.88'}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:opacity-95 transition-opacity cursor-pointer"
                      onMouseEnter={() => setActiveHoverSector('water')}
                      onMouseLeave={() => setActiveHoverSector(null)}
                    />

                    {/* 中心悬浮标牌 */}
                    <circle r="28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" className="shadow-xs" />
                    <text textAnchor="middle" y="-4" fontSize="9.5" fill="#64748b" fontWeight="bold">
                      折标总价
                    </text>
                    <text
                      textAnchor="middle"
                      y="11"
                      fontSize="10.5"
                      fill="#0f172a"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      ¥762.5万
                    </text>
                  </g>
                </svg>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 font-sans">
                💡 南丁格尔玫瑰图面积与极径保障水费等小占比数据强可见性
              </span>
            </div>

            {/* 右侧：折标单价对标与决策依据 */}
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3.5">
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>各能源介质单位折标成本 (元/tce) 对标</span>
                  <span className="text-[10px] text-slate-400 font-normal">指导用能优化选型</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <span className="size-2 rounded-full bg-blue-500" /> 生产电力:
                    </span>
                    <span className="font-mono text-blue-600 font-bold">
                      7,281 <span className="text-[10px] text-slate-400 font-sans">元/tce (最高价)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: '95%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <span className="size-2 rounded-full bg-amber-500" /> 管道天然气:
                    </span>
                    <span className="font-mono text-amber-600 font-bold">
                      2,870 <span className="text-[10px] text-slate-400 font-sans">元/tce (中价位)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: '37.4%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <span className="size-2 rounded-full bg-purple-500" /> 工业蒸汽:
                    </span>
                    <span className="font-mono text-purple-600 font-bold">
                      1,847 <span className="text-[10px] text-emerald-600 font-bold font-sans">元/tce (性价比最高)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: '24.1%' }} />
                  </div>
                </div>
              </div>

              {/* 结构优化指导 */}
              <div className="p-3.5 bg-emerald-50/90 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800 mb-1">
                  <Lightbulb className="size-4 text-emerald-600" />
                  <span>降本增效决策依据：</span>
                </div>
                对比各介质折标单价发现，蒸汽折标成本（1,847元/tce）远低于电力（7,281元/tce），建议在变压器干燥与线圈预热等工序中，优先利用集中供热蒸汽替代电加热，月度预计节约用能成本 <strong className="font-mono">5.4 万元</strong>。
              </div>
            </div>
          </div>

          {/* 展开弹窗明细按钮 */}
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-sans">
              💡 集中显示图表与下载，避免多页面反复跳转。支持导出 Excel。
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

        {/* 5. 关联模块：绿电收益核算 (领导重点关注 - 对应图中标注上网电价与自用/上网合并曲线) */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                【2. 绿电降低成本与超发上网收益核算 (领导重点关注)】
              </h2>
              <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono font-bold">
                标注上网电价：0.375 元/kWh (辽宁燃基准价)
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <span className="size-2.5 rounded-full bg-emerald-500" /> 新能源总出力
              </span>
              <span className="flex items-center gap-1 text-slate-800 font-bold">
                <span className="size-2.5 rounded-full bg-[#1e293b]" /> 厂区自用消纳
              </span>
              <span className="flex items-center gap-1 text-blue-600 font-bold">
                <span className="size-2.5 rounded-full bg-[#1677ff]" /> 超发上网电量
              </span>
            </div>
          </div>

          {/* 绿电降低成本 3 大 KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 font-mono">
            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-1">
              <div className="text-xs text-emerald-800 font-sans flex items-center justify-between">
                <span>自发自用省钱收益</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                  直接降低网购电费
                </span>
              </div>
              <div className="text-2xl font-extrabold text-emerald-700">
                ¥100.8 <span className="text-xs font-normal text-slate-500 font-sans">万元/月</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-emerald-200/60 font-sans flex justify-between">
                <span>自用电量: 148.2万kWh</span>
                <span className="text-emerald-700 font-mono font-bold">按0.68元/kWh抵扣</span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 space-y-1">
              <div className="text-xs text-blue-800 font-sans flex items-center justify-between">
                <span>超发上网结算收益</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">
                  电网结算给公司
                </span>
              </div>
              <div className="text-2xl font-extrabold text-[#1677ff]">
                ¥12.9 <span className="text-xs font-normal text-slate-500 font-sans">万元/月</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-blue-200/60 font-sans flex justify-between">
                <span>上网电量: 34.4万kWh</span>
                <span className="text-blue-700 font-mono font-bold">按0.375元/kWh结算</span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1">
              <div className="text-xs text-amber-900 font-sans flex items-center justify-between">
                <span>新能源月度总创效</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                  省钱 + 创收
                </span>
              </div>
              <div className="text-2xl font-extrabold text-amber-700">
                ¥113.7 <span className="text-xs font-normal text-slate-500 font-sans">万元/月</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-amber-200/60 font-sans flex justify-between">
                <span>领导关注: 一眼看懂省钱</span>
                <span className="text-amber-800 font-mono font-bold">不含建设成本折旧</span>
              </div>
            </div>
          </div>

          {/* 合并 3 走势曲线 (新能源总出力、厂区自用消纳、超发上网电量) */}
          <div className="h-[260px]">
            <LineTrend
              data={greenPowerTrendData}
              xKey="time"
              height={260}
              lines={[
                { key: '新能源总出力', name: '新能源总出力 (kW)', color: '#10b981' },
                { key: '厂区自用消纳', name: '厂区自用消纳 (kW)', color: '#1e293b' },
                { key: '超发上网电量', name: '超发上网电量 (kW)', color: '#1677ff' },
              ]}
            />
          </div>
        </div>

      </div>

      {/* 🌟 展开具体数据明细透视弹窗 Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#fafbfc]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-[#1677ff]" />
                <h3 className="text-sm font-bold text-slate-800">
                  【{selectedNode.name}】能源成本明细与 ESG 水资源消耗全景透视
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
                <span className="font-bold text-slate-800">车间/工序级能源成本与 ESG 水耗拆解</span>
                <button
                  type="button"
                  onClick={() => alert(`正在导出【${selectedNode.name}】成本透视明细 Excel...`)}
                  className="px-3 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  导出 Excel 报表
                </button>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold font-sans">
                    <th className="py-2.5 px-3">工序 / 车间</th>
                    <th className="py-2.5 px-3 text-right">电费支出 (万元)</th>
                    <th className="py-2.5 px-3 text-right">天然气费 (万元)</th>
                    <th className="py-2.5 px-3 text-right">蒸汽费 (万元)</th>
                    <th className="py-2.5 px-3 text-right text-cyan-700">水费/水量 [ESG]</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/50">
                      用能总成本 (万元)
                    </th>
                    <th className="py-2.5 px-3 text-right">成本占比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">1. 真空干燥工段 (煤油气相/蒸汽)</td>
                    <td className="py-2.5 px-3 text-right">303.1</td>
                    <td className="py-2.5 px-3 text-right">29.1</td>
                    <td className="py-2.5 px-3 text-right">18.0</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">¥2.1万 (1.2万t)</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">352.3</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">46.2%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">2. 铁芯剪切与叠装工序</td>
                    <td className="py-2.5 px-3 text-right">150.0</td>
                    <td className="py-2.5 px-3 text-right">9.0</td>
                    <td className="py-2.5 px-3 text-right">1.4</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">¥1.4万 (0.8万t)</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">161.8</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">21.2%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">3. 线圈绕制与绝缘处理工段</td>
                    <td className="py-2.5 px-3 text-right">121.8</td>
                    <td className="py-2.5 px-3 text-right">8.1</td>
                    <td className="py-2.5 px-3 text-right">3.8</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">¥1.9万 (1.1万t)</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">135.6</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">17.8%</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">4. 总装配、试验与辅助动力站房</td>
                    <td className="py-2.5 px-3 text-right">100.1</td>
                    <td className="py-2.5 px-3 text-right">7.4</td>
                    <td className="py-2.5 px-3 text-right">2.4</td>
                    <td className="py-2.5 px-3 text-right text-cyan-700 font-bold">¥2.9万 (1.7万t)</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">112.8</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600">14.8%</td>
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

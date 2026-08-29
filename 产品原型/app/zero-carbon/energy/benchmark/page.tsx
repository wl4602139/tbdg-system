'use client'

import React, { useState, useMemo } from 'react'
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Award,
  Zap,
  Cable,
  Download,
  Calendar,
  Layers,
  Sparkles,
  History,
  Sliders,
  Filter,
  Search,
  Plus,
  Edit,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  Activity,
  Maximize2,
  X,
  Clock,
  Flame,
  Cpu,
  Info,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 5 大 Tab 键名
type BenchmarkTabKey = 'horizontal' | 'product_model' | 'process' | 'history_cycle' | 'standard_manage'

interface BenchmarkTabConfig {
  key: BenchmarkTabKey
  label: string
  icon: any
}

const BENCHMARK_TABS: BenchmarkTabConfig[] = [
  { key: 'horizontal', label: '1. 集团工厂横向对标', icon: BarChart3 },
  { key: 'product_model', label: '2. 同产品型号/同类单位对标', icon: Sliders },
  { key: 'process', label: '3. 关键产线与工序能效对标', icon: Zap },
  { key: 'history_cycle', label: '4. 同产品历史周期时间对标', icon: History },
  { key: 'standard_manage', label: '5. 标杆值管理与维护', icon: Award },
]

// 四象限气泡数据结构
interface QuadrantBubbleItem {
  id: string
  name: string
  x: number // 综合单耗 (tce/万元)
  y: number // 碳排放强度 (tCO2/万元)
  outputWan: number // 产值规模 (万元)
  greenRatio: number // 绿电占比 (%)
  color: string
  quadrantName: string
}

const QUADRANT_BUBBLES: QuadrantBubbleItem[] = [
  { id: 'xb', name: '新变特高压', x: 0.62, y: 0.28, outputWan: 128000, greenRatio: 62.5, color: '#10b981', quadrantName: '低能耗 · 低碳排' },
  { id: 'sb', name: '沈变本部', x: 0.71, y: 0.35, outputWan: 145000, greenRatio: 41.2, color: '#059669', quadrantName: '低能耗 · 低碳排' },
  { id: 'hb', name: '衡变本部', x: 0.73, y: 0.36, outputWan: 132000, greenRatio: 38.5, color: '#0d9488', quadrantName: '低能耗 · 低碳排' },
  { id: 'mat', name: '新材料科技', x: 0.66, y: 0.44, outputWan: 62000, greenRatio: 32.0, color: '#f59e0b', quadrantName: '低能耗 · 高碳排' },
  { id: 'll', name: '鲁缆制造', x: 0.82, y: 0.45, outputWan: 86000, greenRatio: 28.5, color: '#f97316', quadrantName: '高能耗 · 高碳排' },
  { id: 'tb', name: '天变制造', x: 0.79, y: 0.42, outputWan: 75000, greenRatio: 32.0, color: '#ea580c', quadrantName: '高能耗 · 高碳排' },
  { id: 'xl', name: '新缆特装', x: 0.85, y: 0.48, outputWan: 68000, greenRatio: 25.0, color: '#ef4444', quadrantName: '高能耗 · 高碳排' },
  { id: 'dl', name: '德缆装备', x: 0.88, y: 0.51, outputWan: 55000, greenRatio: 22.4, color: '#dc2626', quadrantName: '高能耗 · 高碳排' },
  { id: 'zc', name: '中辰开关', x: 0.92, y: 0.55, outputWan: 42000, greenRatio: 19.8, color: '#b91c1c', quadrantName: '高能耗 · 高碳排' },
  { id: 'elec', name: '特种电工材', x: 0.84, y: 0.33, outputWan: 78000, greenRatio: 48.0, color: '#2563eb', quadrantName: '高能耗 · 低碳排' },
]

export default function BenchmarkManagementPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'group_root',
    name: '电装集团',
    fullName: '电装集团',
    level: 'group',
    badge: '全集团',
  })

  // 当前主 Tab
  const [activeTab, setActiveTab] = useState<BenchmarkTabKey>('horizontal')

  // 筛选器状态
  const [metricType, setMetricType] = useState('output_tce')
  const [rankOrder, setRankOrder] = useState<'asc' | 'desc'>('asc')
  const [benchmarkStandard, setBenchmarkStandard] = useState('national_gbt')
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [startDate, setStartDate] = useState('2026-08-01')
  const [endDate, setEndDate] = useState('2026-08-26')

  // 悬浮选中的气泡
  const [hoveredBubble, setHoveredBubble] = useState<QuadrantBubbleItem | null>(null)

  // 弹窗状态
  const [showAddStandardModal, setShowAddStandardModal] = useState(false)
  const [newStandardForm, setNewStandardForm] = useState({
    industry: '变压器产业',
    productModel: 'ODFS-334MVA/500kV 单相自耦变压器',
    indicatorName: '综合电耗定额 (kWh/kVA)',
    nationalStandardVal: '0.305',
    groupBestVal: '0.308',
    standardSource: 'GB/T 1094.1 行业先进值',
    effectiveDate: '2026-08-01',
  })

  // 1. 横向对标各工厂纯客观数据
  const FACTORY_RANK_DATA = [
    { rank: 1, name: '新变特高压厂区', tcePerWan: 0.62, diff: '-4.6%', diffType: 'better', greenRate: '62.5%', carbonIntensity: 0.28 },
    { rank: 2, name: '沈变本部 (当前分析单位)', tcePerWan: 0.71, diff: '+9.2%', diffType: 'close', greenRate: '41.2%', carbonIntensity: 0.35 },
    { rank: 3, name: '衡变本部 (南方智能电气)', tcePerWan: 0.73, diff: '+12.3%', diffType: 'close', greenRate: '38.5%', carbonIntensity: 0.36 },
    { rank: 4, name: '天变制造 (天津输变电基地)', tcePerWan: 0.79, diff: '+21.5%', diffType: 'warning', greenRate: '32.0%', carbonIntensity: 0.42 },
    { rank: 5, name: '鲁缆制造基地 (新泰)', tcePerWan: 0.82, diff: '+26.2%', diffType: 'warning', greenRate: '28.5%', carbonIntensity: 0.45 },
    { rank: 6, name: '新缆厂特种装备', tcePerWan: 0.85, diff: '+30.8%', diffType: 'warning', greenRate: '25.0%', carbonIntensity: 0.48 },
    { rank: 7, name: '德缆装备制造 (德阳)', tcePerWan: 0.88, diff: '+35.4%', diffType: 'warning', greenRate: '22.4%', carbonIntensity: 0.51 },
    { rank: 8, name: '中辰开关制造基地', tcePerWan: 0.92, diff: '+41.5%', diffType: 'warning', greenRate: '19.8%', carbonIntensity: 0.55 },
  ]

  // 2. 指标趋势数据
  const trendHistoryData = [
    { month: '2026-03', 集团实测走势: 0.85, 行业先进标杆: 0.65, 集团最优Top10: 0.45 },
    { month: '2026-04', 集团实测走势: 0.84, 行业先进标杆: 0.65, 集团最优Top10: 0.45 },
    { month: '2026-05', 集团实测走势: 0.82, 行业先进标杆: 0.65, 集团最优Top10: 0.45 },
    { month: '2026-06', 集团实测走势: 0.80, 行业先进标杆: 0.65, 集团最优Top10: 0.45 },
    { month: '2026-07', 集团实测走势: 0.81, 行业先进标杆: 0.65, 集团最优Top10: 0.45 },
    { month: '2026-08', 集团实测走势: 0.79, 行业先进标杆: 0.65, 集团最优Top10: 0.45 },
  ]

  // 四象限数学坐标转换
  // SVG 视口：宽 520, 高 260
  // X 范围: 0.55 ~ 0.98 -> 45px ~ 495px (宽 450px)
  // Y 范围: 0.20 ~ 0.60 -> 225px ~ 25px (高 200px, Y 轴向上)
  // X 分割线: 0.75 -> 45 + (0.75 - 0.55)/(0.98 - 0.55) * 450 = 254.4px
  // Y 分割线: 0.40 -> 225 - (0.40 - 0.20)/(0.60 - 0.20) * 200 = 125px
  const getSvgX = (val: number) => 45 + ((val - 0.55) / (0.98 - 0.55)) * 450
  const getSvgY = (val: number) => 225 - ((val - 0.20) / (0.60 - 0.20)) * 200
  const getBubbleR = (output: number) => 10 + ((output - 40000) / (150000 - 40000)) * 14

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5 font-sans">
        {/* 1. 顶部 Header 与 统一标准时间筛选与操作栏 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <BarChart3 className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">对标管理</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 时间维度统一 (月度/季度/年度) */}
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
              onClick={() => setShowAddStandardModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="size-3.5" />
              <span>录入 / 维护标杆值</span>
            </button>
            <button
              type="button"
              onClick={() => alert('已生成并导出全集团多维度能效对标分析简报 (Excel)...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出对标简报</span>
            </button>
          </div>
        </div>

        {/* 2. 🌟 核心 5 大对标维度 Tab 切换栏 (标准简洁卡片规范，无小标签) */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 flex-wrap">
          {BENCHMARK_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border select-none',
                  isActive
                    ? 'bg-[#1677ff] text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-600 hover:text-[#1677ff] hover:bg-slate-50 border-slate-200/80'
                )}
              >
                <Icon className={cn('size-4', isActive ? 'text-white' : 'text-slate-500')} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* 3. 复合筛选控制条 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* 对标指标 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-bold">对标指标:</span>
              <select
                value={metricType}
                onChange={(e) => setMetricType(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:border-[#1677ff]"
              >
                <option value="output_tce">综合产值单耗 (tce/万元)</option>
                <option value="product_elec">单位产品电耗 (kWh/kVA · kWh/km)</option>
                <option value="carbon_intensity">碳排放强度 (tCO2/万元)</option>
                <option value="green_ratio">绿色电力消纳占比 (%)</option>
              </select>
            </div>

            {/* 排名规则 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-bold">排名规则:</span>
              <select
                value={rankOrder}
                onChange={(e) => setRankOrder(e.target.value as 'asc' | 'desc')}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:border-[#1677ff]"
              >
                <option value="asc">升序 (数值越低越优 · 领跑)</option>
                <option value="desc">降序 (数值越高越优)</option>
              </select>
            </div>

            {/* 对标基准 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-bold">对标基准:</span>
              <select
                value={benchmarkStandard}
                onChange={(e) => setBenchmarkStandard(e.target.value)}
                className="bg-white border border-blue-200 rounded-lg px-2.5 py-1 text-[#1677ff] font-bold focus:outline-none focus:border-[#1677ff]"
              >
                <option value="national_gbt">国家行业先进标杆值 (GB/T 领先)</option>
                <option value="group_top10">集团前 10% 示范值</option>
                <option value="group_avg">集团全域基线均值</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <Calendar className="size-3.5 text-slate-400" />
            <span className="text-slate-500 font-sans font-medium">统计跨度:</span>
            <span>{startDate}</span>
            <span className="text-slate-400">至</span>
            <span>{endDate}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 集团工厂横向对标 */}
        {/* ========================================================================= */}
        {activeTab === 'horizontal' && (
          <div className="space-y-3.5">
            {/* 4 大核心 KPI 指标卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <Building2 className="size-3.5 text-blue-600" />
                    参与对标工厂数
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] text-[10px] font-bold">100% 覆盖</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  21 <span className="text-xs font-normal text-slate-500 font-sans">家制造基地</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-sans flex justify-between">
                  <span>覆盖板块: 变压器/线缆/开关</span>
                  <span className="text-blue-600 font-bold">全部受控</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-sans">
                  <span className="flex items-center gap-1 font-bold">
                    <Award className="size-3.5 text-emerald-600" />
                    优于行业标杆工厂
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">低于标杆</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-700">
                  4 <span className="text-xs font-normal text-slate-500 font-sans">家 (新变特高压/沈变本部等)</span>
                </div>
                <div className="text-[11px] text-slate-600 pt-1 border-t border-emerald-200/60 font-sans flex justify-between">
                  <span>平均单耗优势: 低于国标 14.2%</span>
                  <span className="text-emerald-700 font-bold">能耗最优</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-800 font-sans">
                  <span className="flex items-center gap-1 font-bold">
                    <Activity className="size-3.5 text-amber-600" />
                    待优化节能工厂
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">能效提升</span>
                </div>
                <div className="text-2xl font-extrabold text-amber-700">
                  14 <span className="text-xs font-normal text-slate-500 font-sans">家</span>
                </div>
                <div className="text-[11px] text-slate-600 pt-1 border-t border-amber-200/60 font-sans flex justify-between">
                  <span>测算节能潜力: 年节 1,280 tce</span>
                  <span className="text-amber-700 font-bold">具备空间</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-purple-800 font-sans">
                  <span className="flex items-center gap-1 font-bold">
                    <Sparkles className="size-3.5 text-purple-600" />
                    集团指标综合达标率
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">客观统计</span>
                </div>
                <div className="text-2xl font-extrabold text-purple-700">
                  85.7%
                </div>
                <div className="text-[11px] text-slate-600 pt-1 border-t border-purple-200/60 font-sans flex justify-between">
                  <span>相比去年同期: +4.6% ↑</span>
                  <span className="text-purple-700 font-bold">持续改善</span>
                </div>
              </div>
            </div>

            {/* 左右双图：【标准四象限散点气泡图】与【走势对比】 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              {/* 左：🌟 工业级标准四象限散点气泡图 (Quadrant Scatter Bubble Chart) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5 relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      工厂能效-碳排放双维度四象限气泡图
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans flex items-center gap-1">
                    <Info className="size-3" />
                    气泡大小 = 产值规模 · 悬浮看详情
                  </span>
                </div>

                {/* SVG 四象限气泡图画布 */}
                <div className="h-[270px] w-full relative bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden select-none">
                  <svg viewBox="0 0 520 260" className="w-full h-full">
                    <defs>
                      {/* 象限渐变背景 */}
                      <linearGradient id="grad-q-left-bottom" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
                      </linearGradient>
                      <linearGradient id="grad-q-right-top" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.03" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.12" />
                      </linearGradient>
                      <linearGradient id="grad-q-left-top" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="grad-q-right-bottom" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                      </linearGradient>

                      {/* 阴影滤镜 */}
                      <filter id="bubble-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
                      </filter>
                    </defs>

                    {/* 1. 四象限背景区块 */}
                    {/* 左下象限：低能耗 · 低碳排 (标杆区) */}
                    <rect x="45" y="125" width="209.4" height="100" fill="url(#grad-q-left-bottom)" />
                    <text x="55" y="215" fill="#059669" fontSize="10.5" fontWeight="bold">【低能耗 · 低碳排】区间</text>

                    {/* 左上象限：低能耗 · 高碳排 */}
                    <rect x="45" y="25" width="209.4" height="100" fill="url(#grad-q-left-top)" />
                    <text x="55" y="42" fill="#d97706" fontSize="10.5" fontWeight="bold">【低能耗 · 高碳排】区间</text>

                    {/* 右下象限：高能耗 · 低碳排 */}
                    <rect x="254.4" y="125" width="240.6" height="100" fill="url(#grad-q-right-bottom)" />
                    <text x="365" y="215" fill="#2563eb" fontSize="10.5" fontWeight="bold">【高能耗 · 低碳排】区间</text>

                    {/* 右上象限：高能耗 · 高碳排 */}
                    <rect x="254.4" y="25" width="240.6" height="100" fill="url(#grad-q-right-top)" />
                    <text x="365" y="42" fill="#dc2626" fontSize="10.5" fontWeight="bold">【高能耗 · 高碳排】区间</text>

                    {/* 2. 背景网格线 */}
                    <line x1="45" y1="75" x2="495" y2="75" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="45" y1="175" x2="495" y2="175" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="150" y1="25" x2="150" y2="225" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="375" y1="25" x2="375" y2="225" stroke="#e2e8f0" strokeDasharray="2 2" />

                    {/* 3. 象限十字基准中轴线 (行业标杆分割线) */}
                    {/* 垂直分割线: 综合单耗标杆 0.75 tce */}
                    <line x1="254.4" y1="20" x2="254.4" y2="225" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 3" />
                    <rect x="220" y="8" width="68" height="14" rx="3" fill="#0ea5e9" opacity="0.9" />
                    <text x="254.4" y="18" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">单耗标杆 0.75</text>

                    {/* 水平分割线: 碳排放强度基准 0.40 tCO2 */}
                    <line x1="45" y1="125" x2="500" y2="125" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 3" />
                    <rect x="442" y="118" width="68" height="14" rx="3" fill="#0ea5e9" opacity="0.9" />
                    <text x="476" y="128" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">碳排基线 0.40</text>

                    {/* 4. X 轴与 Y 轴边框 */}
                    <line x1="45" y1="225" x2="495" y2="225" stroke="#94a3b8" strokeWidth="1.2" />
                    <line x1="45" y1="25" x2="45" y2="225" stroke="#94a3b8" strokeWidth="1.2" />

                    {/* 5. 轴刻度文字 */}
                    {/* Y 轴刻度 */}
                    <text x="40" y="228" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">0.20</text>
                    <text x="40" y="178" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">0.30</text>
                    <text x="40" y="128" fill="#0ea5e9" fontSize="9.5" fontWeight="bold" textAnchor="end" fontFamily="monospace">0.40</text>
                    <text x="40" y="78" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">0.50</text>
                    <text x="40" y="28" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">0.60</text>
                    {/* Y 轴标题 */}
                    <text x="18" y="18" fill="#475569" fontSize="9.5" fontWeight="bold">↑ 碳排放强度 (tCO2/万元)</text>

                    {/* X 轴刻度 */}
                    <text x="45" y="238" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">0.55</text>
                    <text x="150" y="238" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">0.65</text>
                    <text x="254.4" y="238" fill="#0ea5e9" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">0.75</text>
                    <text x="375" y="238" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">0.85</text>
                    <text x="495" y="238" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">0.98</text>
                    {/* X 轴标题 */}
                    <text x="495" y="252" fill="#475569" fontSize="9.5" fontWeight="bold" textAnchor="end">综合能耗 (tce/万元) →</text>

                    {/* 6. 工厂气泡散点渲染 */}
                    {QUADRANT_BUBBLES.map((bubble) => {
                      const cx = getSvgX(bubble.x)
                      const cy = getSvgY(bubble.y)
                      const r = getBubbleR(bubble.outputWan)
                      const isHovered = hoveredBubble?.id === bubble.id

                      return (
                        <g
                          key={bubble.id}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredBubble(bubble)}
                          onMouseLeave={() => setHoveredBubble(null)}
                          onClick={() => alert(`已锁定【${bubble.name}】：综合单耗 ${bubble.x} tce/万元，碳排强度 ${bubble.y} tCO2/万元，产值 ${bubble.outputWan / 10000} 亿元。`)}
                        >
                          {/* 气泡外光晕 */}
                          {isHovered && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={r + 4}
                              fill="none"
                              stroke={bubble.color}
                              strokeWidth="2.5"
                              opacity="0.8"
                              className="animate-ping"
                            />
                          )}

                          {/* 气泡实体 */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHovered ? r + 2 : r}
                            fill={bubble.color}
                            fillOpacity={isHovered ? 0.95 : 0.82}
                            stroke="#ffffff"
                            strokeWidth={isHovered ? 2.5 : 1.8}
                            filter="url(#bubble-shadow)"
                          />

                          {/* 气泡内部/下方文字标签 */}
                          <text
                            x={cx}
                            y={cy - r - 3}
                            fill="#1e293b"
                            fontSize="9.5"
                            fontWeight="bold"
                            textAnchor="middle"
                            className="pointer-events-none drop-shadow-xs"
                          >
                            {bubble.name}
                          </text>
                        </g>
                      )
                    })}
                  </svg>

                  {/* 悬浮 Tooltip 动态卡片 */}
                  {hoveredBubble && (
                    <div
                      className="absolute z-20 bg-slate-900/90 backdrop-blur-md text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1 pointer-events-none border border-slate-700"
                      style={{
                        left: `${Math.min(Math.max(getSvgX(hoveredBubble.x) - 70, 10), 360)}px`,
                        top: `${Math.max(getSvgY(hoveredBubble.y) - 100, 10)}px`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span className="size-2 rounded-full" style={{ backgroundColor: hoveredBubble.color }} />
                          {hoveredBubble.name}
                        </span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono">
                          {hoveredBubble.quadrantName}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 text-[11px] text-slate-300 font-mono">
                        <div>产值规模: <strong className="text-white">{(hoveredBubble.outputWan / 10000).toFixed(1)} 亿元</strong></div>
                        <div>绿电占比: <strong className="text-emerald-400">{hoveredBubble.greenRatio}%</strong></div>
                        <div>综合单耗: <strong className="text-cyan-300">{hoveredBubble.x} tce</strong></div>
                        <div>碳排强度: <strong className="text-amber-300">{hoveredBubble.y} tCO2</strong></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between items-center pt-0.5 font-sans">
                  <span>💡 点击气泡可直达具体制造基地实测用能明细</span>
                  <span className="text-emerald-700 font-bold">行业准入线 100% 达标</span>
                </div>
              </div>

              {/* 右：指标趋势对比 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <h3 className="text-xs font-bold text-slate-900">
                      指标趋势对比 (实测走势 vs 行业标杆 vs 集团均线)
                    </h3>
                  </div>
                  <span className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">动态透视</span>
                </div>

                <div className="h-[270px]">
                  <LineTrend
                    data={trendHistoryData}
                    xKey="month"
                    height={270}
                    lines={[
                      { key: '集团实测走势', name: '集团平均实测单耗', color: '#1677ff' },
                      { key: '行业先进标杆', name: '国标行业先进标杆 (0.65)', color: '#10b981' },
                      { key: '集团最优Top10', name: '集团领跑Top10%线', color: '#a855f7' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* 集团各工厂关键指标横向排名清单 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/60 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800">
                    集团各工厂关键指标横向排名清单 (按综合单耗升序 · 优选)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">共 21 家直属单元 · 纯客观数据对标</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                      <th className="py-2.5 px-3">排名</th>
                      <th className="py-2.5 px-3">工厂 / 制造基地</th>
                      <th className="py-2.5 px-3">综合单耗 (tce/万元)</th>
                      <th className="py-2.5 px-3">标杆偏离率 (Δ)</th>
                      <th className="py-2.5 px-3">绿电占比 (%)</th>
                      <th className="py-2.5 px-3">碳排放强度 (tCO2/万元)</th>
                      <th className="py-2.5 px-3 text-right">对标明细与操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {FACTORY_RANK_DATA.map((row) => (
                      <tr key={row.rank} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              'size-5 rounded-full inline-flex items-center justify-center text-[10.5px] font-bold',
                              row.rank === 1
                                ? 'bg-amber-400 text-white'
                                : row.rank === 2
                                ? 'bg-slate-400 text-white'
                                : row.rank === 3
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {row.rank}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{row.name}</td>
                        <td className="py-2.5 px-3 font-bold text-blue-700">{row.tcePerWan}</td>
                        <td
                          className={cn(
                            'py-2.5 px-3 font-bold',
                            row.diffType === 'better'
                              ? 'text-emerald-700'
                              : row.diffType === 'close'
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          )}
                        >
                          {row.diff}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-700 font-bold">{row.greenRate}</td>
                        <td className="py-2.5 px-3 text-slate-700">{row.carbonIntensity}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => alert(`已打开【${row.name}】能效对标明细面板。`)}
                            className="text-xs text-[#1677ff] hover:underline font-semibold cursor-pointer"
                          >
                            查看用能实况
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 同产品型号/同类单位对标 */}
        {/* ========================================================================= */}
        {activeTab === 'product_model' && (
          <div className="space-y-3.5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="size-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    同产品型号跨制造工厂横向对标 (ODFS-334MVA/500kV 变压器)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">核算口径: 单台制造总耗电 (kWh/台)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {[
                  { factory: '沈变本部 (超高压车间)', totalKWh: 105900, dryKWh: 54200, testKWh: 23100, otherKWh: 28600, status: '实测偏差 (+2.8%)', tone: 'blue' },
                  { factory: '衡变本部 (特高压车间)', totalKWh: 102400, dryKWh: 49800, testKWh: 24200, otherKWh: 28400, status: '集团最优实测 (基准)', tone: 'emerald' },
                  { factory: '新变特高压制造部', totalKWh: 109800, dryKWh: 58000, testKWh: 22800, otherKWh: 29000, status: '实测偏差 (+6.5%)', tone: 'amber' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-xs">{item.factory}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.2 rounded font-bold', item.tone === 'emerald' ? 'bg-emerald-100 text-emerald-800' : item.tone === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800')}>{item.status}</span>
                    </div>
                    <div className="text-xl font-extrabold text-slate-800 font-mono">
                      {item.totalKWh.toLocaleString()} <span className="text-xs font-normal text-slate-500">kWh/台</span>
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200/60 font-mono">
                      <div className="flex justify-between"><span>干燥工段电耗:</span><strong>{item.dryKWh.toLocaleString()} kWh</strong></div>
                      <div className="flex justify-between"><span>试验站电耗:</span><strong>{item.testKWh.toLocaleString()} kWh</strong></div>
                      <div className="flex justify-between"><span>其他工序辅助:</span><strong>{item.otherKWh.toLocaleString()} kWh</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 关键产线与工序能效对标 */}
        {/* ========================================================================= */}
        {activeTab === 'process' && (
          <div className="space-y-3.5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-purple-600" />
                  <h3 className="text-xs font-bold text-slate-800">全集团 47 项核心工序能效对标台账</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">纯客观时序统计数据</span>
              </div>

              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                    <th className="py-2.5 px-3">关键工序名称</th>
                    <th className="py-2.5 px-3">沈变实测</th>
                    <th className="py-2.5 px-3">衡变实测</th>
                    <th className="py-2.5 px-3">新变实测</th>
                    <th className="py-2.5 px-3">行业先进标杆 (GB/T)</th>
                    <th className="py-2.5 px-3">当前最优实测单位</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">煤油气相真空干燥 (kWh/t)</td>
                    <td className="py-2.5 px-3 text-blue-700 font-bold">54.2</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">49.8</td>
                    <td className="py-2.5 px-3 text-slate-700">58.0</td>
                    <td className="py-2.5 px-3 text-purple-700 font-bold">48.0</td>
                    <td className="py-2.5 px-3 font-sans"><span className="px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">衡变公司 (49.8)</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">悬垂立塔三层共挤 (kWh/km)</td>
                    <td className="py-2.5 px-3 text-slate-400">—</td>
                    <td className="py-2.5 px-3 text-slate-400">—</td>
                    <td className="py-2.5 px-3 text-blue-700 font-bold">1,208</td>
                    <td className="py-2.5 px-3 text-purple-700 font-bold">1,150</td>
                    <td className="py-2.5 px-3 font-sans"><span className="px-2 py-0.2 rounded bg-blue-50 text-blue-700 font-bold">鲁缆公司 (1,208)</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">铁心硅钢片纵剪叠装 (kWh/t)</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">17.5</td>
                    <td className="py-2.5 px-3 text-slate-700">18.2</td>
                    <td className="py-2.5 px-3 text-slate-700">18.0</td>
                    <td className="py-2.5 px-3 text-purple-700 font-bold">16.8</td>
                    <td className="py-2.5 px-3 font-sans"><span className="px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">沈变本部 (17.5)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: 同产品历史周期时间对标 */}
        {/* ========================================================================= */}
        {activeTab === 'history_cycle' && (
          <div className="space-y-3.5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <History className="size-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    同产品历史三年四季周期性单耗变动对标
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">剔除环境温湿度与冬季供暖干扰</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-sans block">春季单耗均值 (03~05月)</span>
                  <span className="text-lg font-bold text-slate-800">0.315 kWh/kVA</span>
                  <span className="text-[10px] text-slate-500 font-sans block pt-1">温和适中 · 处于稳态</span>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                  <span className="text-amber-800 font-sans block">夏季单耗均值 (06~08月)</span>
                  <span className="text-lg font-bold text-amber-700">0.328 kWh/kVA</span>
                  <span className="text-[10px] text-amber-700 font-sans block pt-1">制冷空调负荷增加 +4.1%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-sans block">秋季单耗均值 (09~11月)</span>
                  <span className="text-lg font-bold text-slate-800">0.312 kWh/kVA</span>
                  <span className="text-[10px] text-slate-500 font-sans block pt-1">生产周期平稳期</span>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                  <span className="text-blue-800 font-sans block">冬季单耗均值 (12~02月)</span>
                  <span className="text-lg font-bold text-blue-700">0.342 kWh/kVA</span>
                  <span className="text-[10px] text-blue-700 font-sans block pt-1">蒸汽预热保温损耗 +9.6%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: 标杆值管理与维护 */}
        {/* ========================================================================= */}
        {activeTab === 'standard_manage' && (
          <div className="space-y-3.5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-slate-700" />
                  <h3 className="text-xs font-bold text-slate-800">国家 / 行业 / 集团历史最优标杆值维护库</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddStandardModal(true)}
                  className="px-2.5 py-1 rounded bg-[#1677ff] text-white text-xs font-bold cursor-pointer"
                >
                  + 新增标杆指标
                </button>
              </div>

              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                    <th className="py-2.5 px-3">所属产业</th>
                    <th className="py-2.5 px-3">产品型号 / 工艺指标</th>
                    <th className="py-2.5 px-3">国家标准先进值 (GB/T)</th>
                    <th className="py-2.5 px-3">集团历史最优纪录</th>
                    <th className="py-2.5 px-3">生效日期</th>
                    <th className="py-2.5 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans">变压器产业</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">ODFS-334MVA/500kV 综合单耗</td>
                    <td className="py-2.5 px-3 text-purple-700 font-bold">0.305 kWh/kVA</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">0.308 kWh/kVA (新变)</td>
                    <td className="py-2.5 px-3">2026-08-01</td>
                    <td className="py-2.5 px-3 text-right">
                      <button className="text-[#1677ff] hover:underline cursor-pointer">修改</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans">线缆产业</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">500kV 交联悬垂立塔单耗</td>
                    <td className="py-2.5 px-3 text-purple-700 font-bold">1,150 kWh/km</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">1,208 kWh/km (鲁缆)</td>
                    <td className="py-2.5 px-3">2026-08-01</td>
                    <td className="py-2.5 px-3 text-right">
                      <button className="text-[#1677ff] hover:underline cursor-pointer">修改</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 录入/维护标杆值弹窗 */}
      {showAddStandardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Plus className="size-4 text-[#1677ff]" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">录入 / 维护能效对标基准值</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStandardModal(false)}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert(`已成功录入【${newStandardForm.productModel}】最新对标基准！`)
                setShowAddStandardModal(false)
              }}
              className="p-4 space-y-3 text-xs font-sans"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">所属核心产业：</label>
                  <select
                    value={newStandardForm.industry}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, industry: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#1677ff]"
                  >
                    <option value="变压器产业">变压器产业 (沈变/衡变/新变)</option>
                    <option value="线缆产业">线缆产业 (鲁缆/新缆/德缆)</option>
                    <option value="高压成套">高压成套与智能开关</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">生效起始月份：</label>
                  <input
                    type="date"
                    value={newStandardForm.effectiveDate}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, effectiveDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-medium">产品型号 / 关键工序名称：</label>
                <input
                  type="text"
                  value={newStandardForm.productModel}
                  onChange={(e) => setNewStandardForm({ ...newStandardForm, productModel: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-[#1677ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">国家/行业先进标杆值：</label>
                  <input
                    type="text"
                    value={newStandardForm.nationalStandardVal}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, nationalStandardVal: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-purple-700 font-mono font-bold focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-medium">集团历史最优纪录值：</label>
                  <input
                    type="text"
                    value={newStandardForm.groupBestVal}
                    onChange={(e) => setNewStandardForm({ ...newStandardForm, groupBestVal: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-emerald-700 font-mono font-bold focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px]">
                提示：更新后的标杆值将即时应用于全集团 21 家直属工厂的横向排名与偏离度统计对比。
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStandardModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-xs font-semibold text-white shadow-2xs cursor-pointer"
                >
                  确认保存并发布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

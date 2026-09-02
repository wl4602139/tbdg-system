'use client'

import React, { useState } from 'react'
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Factory,
  Layers,
  Sparkles,
  PieChart,
  RefreshCw,
  Flame,
  Zap,
} from 'lucide-react'
import { OrgTreeSidebar, type OrgNodeItem } from '@/components/shared/org-tree-sidebar'
import { LineTrend, Donut } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 四象限基地数据
interface QuadrantPlant {
  name: string
  x: number // 碳排放强度 tCO2/万元 (横轴)
  y: number // 产值能效 tce/万元 (纵轴)
  output: number // 产值 亿元
  color: string
  zone: 'I区: 低碳高效(标杆)' | 'II区: 高碳高效(需绿电替代)' | 'III区: 低碳低效' | 'IV区: 高碳低效(需整改)'
}

const QUADRANT_PLANTS: QuadrantPlant[] = [
  { name: '新变厂', x: 0.245, y: 0.112, output: 14.8, color: '#10b981', zone: 'I区: 低碳高效(标杆)' },
  { name: '鲁缆公司', x: 0.185, y: 0.098, output: 12.5, color: '#10b981', zone: 'I区: 低碳高效(标杆)' },
  { name: '沈变本部', x: 0.312, y: 0.138, output: 18.2, color: '#1677ff', zone: 'I区: 低碳高效(标杆)' },
  { name: '衡变本部', x: 0.298, y: 0.132, output: 16.5, color: '#1677ff', zone: 'I区: 低碳高效(标杆)' },
  { name: '天池特变', x: 0.218, y: 0.105, output: 6.2, color: '#10b981', zone: 'I区: 低碳高效(标杆)' },
  { name: '新缆厂', x: 0.192, y: 0.095, output: 7.8, color: '#10b981', zone: 'I区: 低碳高效(标杆)' },
  { name: '德缆公司', x: 0.368, y: 0.165, output: 8.4, color: '#f43f5e', zone: 'IV区: 高碳低效(需整改)' },
  { name: '国际集成', x: 0.142, y: 0.082, output: 5.5, color: '#10b981', zone: 'I区: 低碳高效(标杆)' },
]

export default function CarbonAnalysisPage() {
  const [selectedOrg, setSelectedOrg] = useState<OrgNodeItem>({
    id: 'group_all',
    name: '特变电工集团 (电装大盘)',
    fullName: '特变电工集团（电装板块全景）',
    level: 'group',
  })

  const [analysisMode, setAnalysisMode] = useState<'trend' | 'compare' | 'attribution'>('trend')

  // 12 个月大盘演进趋势模拟数据
  const monthlyTrendData = [
    { month: '2025-09', 万元产值碳强度: 0.342, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2025-10', 万元产值碳强度: 0.338, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2025-11', 万元产值碳强度: 0.332, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2025-12', 万元产值碳强度: 0.335, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2026-01', 万元产值碳强度: 0.328, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2026-02', 万元产值碳强度: 0.324, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2026-03', 万元产值碳强度: 0.326, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2026-04', 万元产值碳强度: 0.322, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2026-05', 万元产值碳强度: 0.325, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2026-06', 万元产值碳强度: 0.320, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2026-07', 万元产值碳强度: 0.321, 考核限值: 0.334, 行业基准: 0.385 },
    { month: '2026-08', 万元产值碳强度: 0.318, 考核限值: 0.334, 行业基准: 0.385 },
  ]

  // 核心高耗能工序碳热点拆解
  const processHotspots = [
    { name: '真空干燥气相加热', value: 38.5, color: '#722ed1' },
    { name: '超高压试验大厅测试', value: 24.2, color: '#1677ff' },
    { name: '低氮燃气锅炉供热', value: 16.8, color: '#fa8c16' },
    { name: '工业高纯制氮站', value: 11.5, color: '#13c2c2' },
    { name: '空压机动力动力站', value: 9.0, color: '#52c41a' },
  ]

  return (
    <div className="flex w-full items-start gap-4">
      {/* 🌟 左侧 270px 经典工业级导线拓扑树 */}
      <OrgTreeSidebar
        title="工厂与用能拓扑 (3级)"
        subtitle="全层级穿透"
        selectedId={selectedOrg.id}
        onSelect={(node) => setSelectedOrg(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 顶部控制与视角提示卡片 */}
        <div className="bg-card rounded-xl border border-border p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <BarChart3 className="size-5" />
            </div>
            <h1 className="text-base font-bold text-foreground">碳排放分析</h1>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <div className="inline-flex rounded-lg border border-border p-0.5 bg-panel text-xs">
              <button
                onClick={() => setAnalysisMode('trend')}
                className={cn(
                  'px-2.5 py-1 rounded-md transition-all cursor-pointer',
                  analysisMode === 'trend' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                月度趋势
              </button>
              <button
                onClick={() => setAnalysisMode('compare')}
                className={cn(
                  'px-2.5 py-1 rounded-md transition-all cursor-pointer',
                  analysisMode === 'compare' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                同环比对比
              </button>
              <button
                onClick={() => setAnalysisMode('attribution')}
                className={cn(
                  'px-2.5 py-1 rounded-md transition-all cursor-pointer',
                  analysisMode === 'attribution' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                减排归因
              </button>
            </div>
            <button
              onClick={() => alert('已刷新四象限与工序碳热点分析模型！')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>刷新分析</span>
            </button>
          </div>
        </div>

        {/* 4 栏大盘分析核心 KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
            <div className="text-xs text-muted-foreground mb-1 font-bold">集团万元产值平均碳强度</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-400">0.318</span>
              <span className="text-xs text-muted-foreground">tCO₂/万元</span>
            </div>
            <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/60 flex justify-between font-mono">
              <span>考核线: 0.334</span>
              <span className="text-emerald-400 font-bold">同比 -6.2% (达标)</span>
            </div>
          </div>

          <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
            <div className="text-xs text-muted-foreground mb-1 font-bold">领跑示范制造基地</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-primary">6</span>
              <span className="text-xs text-muted-foreground">/ 8 家基地</span>
            </div>
            <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/60 flex justify-between font-mono">
              <span>鲁缆/新变超额领跑</span>
              <span className="text-primary font-mono">达标率 87.5%</span>
            </div>
          </div>

          <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
            <div className="text-xs text-muted-foreground mb-1 font-bold">高碳预警与异常产线</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-rose-400">2</span>
              <span className="text-xs text-muted-foreground">条产线/工序</span>
            </div>
            <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/60 flex justify-between font-mono">
              <span>德缆橡套线/沈变3#干燥</span>
              <span className="text-rose-400 font-bold">需技改干预</span>
            </div>
          </div>

          <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
            <div className="text-xs text-muted-foreground mb-1 font-bold">集团绿电综合渗透率</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-400">18.4%</span>
              <span className="text-xs text-muted-foreground">占总用电量</span>
            </div>
            <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/60 flex justify-between font-mono">
              <span>自备光伏+市场化交易</span>
              <span className="text-emerald-400 font-bold">年化减排3.8万吨</span>
            </div>
          </div>
        </div>

        {/* 2 栏核心图表：左侧四象限矩阵 + 右侧 12 个月大盘演进趋势 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 左侧：四象限矩阵分析 */}
          <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                <h3 className="text-xs font-bold text-foreground">
                  8 家主要制造基地能效-碳排放四象限矩阵分析
                </h3>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">横轴: 碳强度 | 纵轴: 能效强度</span>
            </div>

            <div className="relative w-full h-[260px] bg-panel/40 rounded-lg border border-border p-3 flex flex-col justify-between">
              {/* 四象限背景与基准分割线 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-px bg-border/80 border-b border-dashed" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-full w-px bg-border/80 border-r border-dashed" />
              </div>

              {/* 象限标签 */}
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono z-10">
                <span>II区: 高碳高效区</span>
                <span className="text-rose-400 font-bold">IV区: 高碳高耗(整改区)</span>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono z-10">
                <span className="text-emerald-400 font-bold">I区: 低碳高效(标杆区)</span>
                <span>III区: 低碳低效区</span>
              </div>

              {/* 散点渲染 */}
              <div className="absolute inset-4 z-20">
                {QUADRANT_PLANTS.map((plant) => {
                  // 坐标归一化
                  const leftPercent = Math.min(90, Math.max(10, ((plant.x - 0.1) / 0.3) * 100))
                  const bottomPercent = Math.min(90, Math.max(10, ((plant.y - 0.05) / 0.15) * 100))

                  return (
                    <div
                      key={plant.name}
                      style={{ left: `${leftPercent}%`, bottom: `${bottomPercent}%` }}
                      className="absolute -translate-x-1/2 translate-y-1/2 group cursor-pointer"
                    >
                      <div
                        style={{ backgroundColor: plant.color }}
                        className="size-4 rounded-full border-2 border-slate-900 shadow-xs group-hover:scale-125 transition-transform"
                      />
                      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-foreground whitespace-nowrap bg-card/90 px-1 rounded border border-border shadow-2xs">
                        {plant.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              💡 新变厂、鲁缆公司处于 I 区领跑标杆；德缆公司处于 IV 区，需推进光伏与余热技改。
            </p>
          </div>

          {/* 右侧：12个月大盘演进趋势 */}
          <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400" />
                <h3 className="text-xs font-bold text-foreground">近 12 个月大盘产值碳强度演进走势</h3>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">对标行业基准线</span>
            </div>

            <div className="h-[260px]">
              <LineTrend
                data={monthlyTrendData}
                xKey="month"
                height={260}
                lines={[
                  { key: '万元产值碳强度', name: '实测碳强度 (tCO2/万)', color: '#10b981' },
                  { key: '考核限值', name: '考核目标线 (0.334)', color: '#f43f5e' },
                  { key: '行业基准', name: '全国行业平均 (0.385)', color: '#94a3b8' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* 下方 2 栏：核心工序碳热点拆解 + 基地碳效排名前后红黑榜 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 核心工序碳热点拆解 */}
          <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h3 className="text-xs font-bold text-foreground">
                制造全工序碳排放热点分布拆解 (占比 %)
              </h3>
              <span className="text-xs text-muted-foreground font-mono">排查降碳突破口</span>
            </div>
            <div className="h-[220px]">
              <Donut data={processHotspots} height={220} nameKey="name" valueKey="value" />
            </div>
          </div>

          {/* 基地碳效对标归因表 */}
          <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h3 className="text-xs font-bold text-foreground">主要基地碳效对标与减排归因</h3>
              <span className="text-xs text-muted-foreground font-mono">按碳强度由优至劣排序</span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-panel text-muted-foreground border-b border-border font-semibold">
                  <tr>
                    <th className="px-3 py-2">基地名称</th>
                    <th className="px-3 py-2 text-right">碳强度 (t/万)</th>
                    <th className="px-3 py-2 text-center">所属象限</th>
                    <th className="px-3 py-2">核心减排优势 / 存在短板</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono text-foreground">
                  <tr>
                    <td className="px-3 py-2 font-sans font-medium text-foreground">1. 国际集成</td>
                    <td className="px-3 py-2 text-right text-emerald-400 font-bold">0.142</td>
                    <td className="px-3 py-2 text-center font-sans"><span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">I区 标杆</span></td>
                    <td className="px-3 py-2 font-sans text-muted-foreground">总装物流为主，单位产值能耗低</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-sans font-medium text-foreground">2. 鲁缆公司</td>
                    <td className="px-3 py-2 text-right text-emerald-400 font-bold">0.185</td>
                    <td className="px-3 py-2 text-center font-sans"><span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">I区 标杆</span></td>
                    <td className="px-3 py-2 font-sans text-muted-foreground">分布式光伏全覆盖，氮气循环高效</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-sans font-medium text-foreground">3. 新变厂</td>
                    <td className="px-3 py-2 text-right text-emerald-400 font-bold">0.245</td>
                    <td className="px-3 py-2 text-center font-sans"><span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">I区 标杆</span></td>
                    <td className="px-3 py-2 font-sans text-muted-foreground">特高压产值高，储能削峰利用充分</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-sans font-medium text-foreground">4. 德缆公司</td>
                    <td className="px-3 py-2 text-right text-rose-400 font-bold">0.268</td>
                    <td className="px-3 py-2 text-center font-sans"><span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">IV区 待整改</span></td>
                    <td className="px-3 py-2 font-sans text-rose-400">老旧挤出机能耗偏高，需变频改造</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

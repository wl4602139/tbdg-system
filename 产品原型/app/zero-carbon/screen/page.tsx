'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Globe2,
  Zap,
  TrendingDown,
  TrendingUp,
  Building2,
  Factory,
  Sun,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Gauge,
  Flame,
  Droplets,
  Award,
  Maximize2,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge } from '@/components/shared/primitives'
import { LineTrend, Donut, AreaTrend } from '@/components/shared/charts'
import { screenKpis, parkProgress, energyTrend, energyStructure, hourlyLoadData } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const parkCoordinates = [
  { name: '特变电工东北输变电产业园', city: '沈阳', stage: '已认证', greenRatio: '42.5%', score: 94, top: '28%', left: '76%' },
  { name: '特变电工南方输变电产业园', city: '衡阳', stage: '在建', greenRatio: '39.8%', score: 88, top: '65%', left: '68%' },
  { name: '特变电工输变电产业园', city: '昌吉', stage: '在建', greenRatio: '36.2%', score: 82, top: '32%', left: '26%' },
  { name: '特变电工华东输变电科技产业园', city: '泰安', stage: '在建', greenRatio: '38.0%', score: 79, top: '42%', left: '72%' },
  { name: '特变电工新疆电缆产业园', city: '昌吉', stage: '规划', greenRatio: '31.5%', score: 68, top: '36%', left: '28%' },
  { name: '特变电工(德阳)电缆园区', city: '德阳', stage: '在建', greenRatio: '35.4%', score: 75, top: '56%', left: '54%' },
  { name: '特变电工天变产业园', city: '天津', stage: '已认证', greenRatio: '44.0%', score: 92, top: '36%', left: '74%' },
  { name: '特变电工智能电气产业园', city: '乌鲁木齐', stage: '在建', greenRatio: '34.8%', score: 80, top: '30%', left: '29%' },
  { name: '特变电工西安智能装备产业园', city: '西安', stage: '在建', greenRatio: '37.6%', score: 85, top: '48%', left: '58%' },
]

export default function ScreenPage() {
  const [selectedPark, setSelectedPark] = useState(parkCoordinates[0])
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-3">
      {/* 顶部标题与时钟栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-blue-50 text-[#1677ff] flex items-center justify-center font-bold">
            <LayoutDashboard className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              特变电工（电装集团）零碳园区集控大屏驾驶舱
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-mono font-bold">
                集团综合视图
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">
              实时接入全国 15 个零碳产业园区、21 家项目工厂综合能耗、实时负荷与碳减排指标
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span>全网数据实时接入中</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="size-3.5 text-[#1677ff]" />
            <span>{currentTime || '2026-08-25 14:30:00'}</span>
          </div>

          <a
            href="/screen/executive"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Maximize2 className="size-3.5 text-emerald-400" />
            <span>4K 独立黑底大屏</span>
          </a>
        </div>
      </div>

      {/* 顶部 6 大核心 KPI 矩阵 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {screenKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="p-3 rounded-lg bg-white border border-[#e5e7eb] shadow-xs hover:border-blue-300 transition-all group"
          >
            <span className="text-xs text-slate-500 block truncate">{kpi.label}</span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-slate-800 group-hover:text-[#1677ff] transition-colors">
                {kpi.value}
              </span>
              <span className="text-xs text-slate-400">{kpi.unit}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span className={kpi.up ? 'text-emerald-600 font-semibold' : 'text-blue-600 font-semibold'}>
                {kpi.delta}
              </span>
              <span className="text-slate-400 scale-90">较上期</span>
            </div>
          </div>
        ))}
      </div>

      {/* 中部核心：左侧能耗趋势 + 中间 GIS 园区分布地图 + 右侧结构与自评估 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* 左侧：月度能耗趋势 + 24h光储负荷 */}
        <div className="lg:col-span-3 space-y-3">
          <Panel className="p-3.5">
            <PanelTitle icon={Activity}>集团月度用能趋势 (万tce)</PanelTitle>
            <div className="h-44 mt-1">
              <AreaTrend
                data={energyTrend}
                xKey="month"
                areas={[
                  { key: '电力', color: '#1677ff' },
                  { key: '天然气', color: '#fa8c16' },
                  { key: '蒸汽', color: '#722ed1' },
                ]}
              />
            </div>
          </Panel>

          <Panel className="p-3.5">
            <PanelTitle icon={Sun}>光储与市电实时出力 (MW)</PanelTitle>
            <div className="h-44 mt-1">
              <LineTrend
                data={hourlyLoadData.slice(0, 8)}
                xKey="time"
                lines={[
                  { key: '总用电负荷', color: '#1677ff' },
                  { key: '光伏发电', color: '#52c41a' },
                  { key: '储能充放', color: '#fa8c16' },
                ]}
              />
            </div>
          </Panel>
        </div>

        {/* 中间：全国 15 个零碳园区 GIS 空间交互地图 */}
        <div className="lg:col-span-6">
          <Panel className="p-4 h-full flex flex-col justify-between relative bg-white">
            <div className="flex items-center justify-between">
              <PanelTitle icon={Globe2}>全国 15 个零碳产业园区 GIS 拓扑与达标态势</PanelTitle>
              <span className="text-xs text-slate-400">点击园区节点查看详情</span>
            </div>

            {/* 地图模拟容器 */}
            <div className="relative flex-1 min-h-[380px] my-2 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
              {/* 背景浅色微网格 */}
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

              {/* 园区打点标注 */}
              {parkCoordinates.map((park) => {
                const isSelected = selectedPark.name === park.name
                return (
                  <div
                    key={park.name}
                    style={{ top: park.top, left: park.left }}
                    onClick={() => setSelectedPark(park)}
                    className={cn(
                      'absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-20 group',
                      isSelected ? 'scale-115 z-30' : 'hover:scale-110'
                    )}
                  >
                    <div className="relative flex items-center justify-center">
                      <span
                        className={cn(
                          'size-3 rounded-full border-2 transition-all',
                          park.stage === '已认证'
                            ? 'bg-emerald-500 border-white shadow-md'
                            : park.stage === '在建'
                            ? 'bg-[#1677ff] border-white shadow-md'
                            : 'bg-amber-500 border-white shadow-md'
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        'mt-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-medium whitespace-nowrap border shadow-xs transition-colors',
                        isSelected
                          ? 'bg-[#1677ff] text-white border-[#1677ff]'
                          : 'bg-white text-slate-700 border-slate-200 group-hover:border-[#1677ff]'
                      )}
                    >
                      {park.city} · {park.stage}
                    </div>
                  </div>
                )
              })}

              {/* 地图底部选中园区浮层 */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-white/95 border border-blue-200 shadow-md flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-blue-50 text-[#1677ff] flex items-center justify-center font-bold">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      {selectedPark.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      建设阶段：<strong className="text-emerald-600">{selectedPark.stage}</strong> · 绿电综合占比：{selectedPark.greenRatio}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">自评估综合评分</span>
                    <span className="text-base font-bold font-mono text-emerald-600">
                      {selectedPark.score} 分
                    </span>
                  </div>
                  <a
                    href="/zero-carbon/monitor/indicator"
                    className="px-3 py-1.5 rounded bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span>穿透至工厂</span>
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 阶段图例 */}
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>已通过零碳认证 (3个)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <span>在建推进中 (10个)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" />
                <span>前期规划中 (2个)</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* 右侧：用能结构环形图 + 园区自评估得分排行 */}
        <div className="lg:col-span-3 space-y-3">
          <Panel className="p-3.5">
            <PanelTitle icon={Gauge}>全集团用能介质结构占比</PanelTitle>
            <div className="h-44 mt-1">
              <Donut data={energyStructure} />
            </div>
          </Panel>

          <Panel className="p-3.5">
            <PanelTitle icon={Award}>零碳园区自评估建设排行榜</PanelTitle>
            <div className="space-y-1.5 mt-2">
              {parkProgress.map((p, idx) => (
                <div key={p.park} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-50">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className={cn(
                        'size-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center shrink-0',
                        idx === 0
                          ? 'bg-amber-100 text-amber-700'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate text-slate-700">{p.park}</span>
                  </div>
                  <span className="text-emerald-600 font-bold font-mono">{p.score}分</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

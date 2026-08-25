'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
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
  ArrowLeft,
  Bot,
  Swords,
} from 'lucide-react'
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

export default function ExecutiveWhiteScreenPage() {
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
    <div className="min-h-screen bg-[#f0f2f5] text-slate-800 p-3.5 md:p-4 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between space-y-3">
      {/* 4K 大屏高保真顶栏 */}
      <header className="bg-white border border-[#e5e7eb] px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/zero-carbon/screen"
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors text-xs flex items-center gap-1 border border-slate-200 font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>返回系统</span>
          </Link>
          <div className="size-8 rounded-lg bg-blue-50 text-[#1677ff] flex items-center justify-center font-bold">
            <Globe2 className="size-4" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold tracking-wide text-slate-900 flex items-center gap-2">
              特变电工（电装集团）能碳管控决策大屏
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-mono font-bold">
                集团综合大屏 · 全景决策视图
              </span>
            </h1>
          </div>
        </div>

        {/* 顶部中央遥测信息 */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
          <span>全集团 15 个零碳园区 · 21 家重点工厂时序遥测数据流实时接入中</span>
        </div>

        {/* 右侧时钟 */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="size-3.5 text-[#1677ff]" />
            <span>{currentTime || '2026-08-25 15:55:00'}</span>
          </div>
        </div>
      </header>

      {/* 顶部 6 大核心 KPI 矩阵 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {screenKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="p-3.5 rounded-xl bg-white border border-[#e5e7eb] hover:border-blue-300 transition-all group shadow-xs"
          >
            <span className="text-xs text-slate-500 block truncate font-medium">{kpi.label}</span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-800 tracking-tight group-hover:text-[#1677ff] transition-colors">
                {kpi.value}
              </span>
              <span className="text-xs text-slate-400 font-mono">{kpi.unit}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span className={kpi.up ? 'text-emerald-600 font-bold' : 'text-blue-600 font-bold'}>
                {kpi.delta}
              </span>
              <span className="text-slate-400 scale-90">较上期</span>
            </div>
          </div>
        ))}
      </div>

      {/* 中部核心三栏大屏：左侧能碳堆叠 + 中间 3D GIS 园区分布 + 右侧红黑榜 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
        {/* 左侧：集团月度能耗堆叠图 + 光储实时出力 */}
        <div className="lg:col-span-3 space-y-3 flex flex-col justify-between">
          <div className="p-3.5 rounded-xl bg-white border border-[#e5e7eb] shadow-xs space-y-2 flex-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                <Activity className="size-3.5 text-[#1677ff]" />
                集团月度用能趋势 (万tce)
              </span>
            </div>
            <div className="h-44">
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
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#e5e7eb] shadow-xs space-y-2 flex-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                <Sun className="size-3.5 text-[#1677ff]" />
                光储与市电实时出力 (MW)
              </span>
            </div>
            <div className="h-44">
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
          </div>
        </div>

        {/* 中间：全国 15 个零碳园区 GIS 空间地图 */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-xs h-full flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between z-10 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2 font-sans">
                <Globe2 className="size-4 text-[#1677ff]" />
                全国 15 个零碳产业园区 GIS 拓扑与达标态势
              </span>
              <span className="text-[11px] text-slate-400">点击园区节点穿透</span>
            </div>

            {/* 地图模拟容器 */}
            <div className="relative flex-1 min-h-[400px] my-3 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
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
                          'size-3.5 rounded-full border-2 transition-all',
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

              {/* 底部悬浮卡片 */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-white/95 border border-blue-200 shadow-md z-20 flex flex-wrap items-center justify-between gap-3 font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-blue-50 text-[#1677ff] flex items-center justify-center font-bold">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      {selectedPark.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-sans">
                      建设阶段：<strong className="text-emerald-600">{selectedPark.stage}</strong> · 绿电综合占比：{selectedPark.greenRatio}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-sans">自评估综合评分</span>
                    <span className="text-base font-bold text-emerald-600 font-mono">
                      {selectedPark.score} 分
                    </span>
                  </div>
                  <Link
                    href="/zero-carbon/monitor/indicator"
                    className="px-3 py-1.5 rounded bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span>穿透至工厂</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
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
          </div>
        </div>

        {/* 右侧：能源介质占比 + 全集团 21 家工厂能效排行榜 */}
        <div className="lg:col-span-3 space-y-3 flex flex-col justify-between">
          <div className="p-3.5 rounded-xl bg-white border border-[#e5e7eb] shadow-xs space-y-2 flex-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                <Gauge className="size-3.5 text-[#1677ff]" />
                全集团用能介质结构占比
              </span>
            </div>
            <div className="h-44">
              <Donut data={energyStructure} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#e5e7eb] shadow-xs space-y-2 flex-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                <Award className="size-3.5 text-[#1677ff]" />
                零碳园区自评估建设排行榜
              </span>
            </div>
            <div className="space-y-1.5 mt-2 font-mono">
              {parkProgress.map((p, idx) => (
                <div
                  key={p.park}
                  className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className={cn(
                        'size-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0',
                        idx === 0
                          ? 'bg-amber-100 text-amber-700'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate text-slate-700 font-sans">{p.park}</span>
                  </div>
                  <span className="text-emerald-600 font-bold font-mono">
                    {p.score}分
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

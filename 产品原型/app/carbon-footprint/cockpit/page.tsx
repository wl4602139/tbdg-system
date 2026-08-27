'use client'

import { useEffect, useState } from 'react'
import { Database, FileCheck2, Award, TrendingDown, Boxes, Factory, MapPin, ExternalLink, Sparkles, Layers, ArrowUpRight } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, KpiCard, DataTable, StatusBadge, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { AreaTrend, Donut, BarGroup } from '@/components/shared/charts'
import { carbonTrend, hotspotData, productFootprint, honors, parks } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

// 园区气泡数据 (气泡大小=总碳排，颜色深浅=单位碳强度)
const parkBubbles = [
  { name: '东北输变电产业园', city: '沈阳', industry: '变压器', totalCarbon: '2.8 万t', unitPcf: 0.43, intensity: 'normal', color: '#1677ff', certifiedModels: 8, totalModels: 14, top: '28%', left: '76%' },
  { name: '南方输变电产业园', city: '衡阳', industry: '变压器', totalCarbon: '2.4 万t', unitPcf: 0.38, intensity: 'low', color: '#10b981', certifiedModels: 6, totalModels: 12, top: '65%', left: '68%' },
  { name: '天变产业园', city: '天津', industry: '变压器', totalCarbon: '1.6 万t', unitPcf: 0.48, intensity: 'high', color: '#f59e0b', certifiedModels: 5, totalModels: 9, top: '36%', left: '74%' },
  { name: '新疆线缆产业园', city: '昌吉', industry: '线缆', totalCarbon: '3.2 万t', unitPcf: 0.68, intensity: 'normal', color: '#1677ff', certifiedModels: 4, totalModels: 16, top: '34%', left: '26%' },
  { name: '德阳电缆园区', city: '德阳', industry: '线缆', totalCarbon: '2.1 万t', unitPcf: 0.72, intensity: 'high', color: '#f59e0b', certifiedModels: 3, totalModels: 11, top: '56%', left: '54%' },
  { name: '江苏智能电气产业园', city: '南京', industry: '开关', totalCarbon: '1.2 万t', unitPcf: 0.35, intensity: 'low', color: '#10b981', certifiedModels: 2, totalModels: 6, top: '52%', left: '78%' },
]

export default function CockpitPage() {
  const [honorIdx, setHonorIdx] = useState(0)
  const [selectedPark, setSelectedPark] = useState(parkBubbles[0])
  const [industry, setIndustry] = useState('all')

  useEffect(() => {
    const t = setInterval(() => setHonorIdx((i) => (i + 1) % honors.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-4">
      <PageHeader
        title="产品碳足迹对外示范驾驶舱"
        positioning="对外示范窗口 · 集团全景"
        desc="可视化呈现电装集团产品碳足迹总量、产业均值、21家经营单位气泡地图下钻、权威第三方认证轮播与全流程合规管控。"
      />

      {/* 4 大核心 KPI 矩阵 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="实景库工单" value="48,260" unit="单" delta="+1,240" up icon={Database} />
        <KpiCard label="因子库标准化因子" value="3,860" unit="个" delta="+126" up icon={Boxes} />
        <KpiCard label="ISO 14067 认证产品" value="21" unit="项" delta="+3" up icon={FileCheck2} />
        <KpiCard label="平均产品碳强度" value="0.42" unit="tCO2/万kVA" delta="-6.2%" up={false} icon={TrendingDown} />
      </div>

      {/* 园区气泡地图与选定园区下钻 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 p-4 rounded-xl bg-card border border-border space-y-3 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <PanelTitle icon={MapPin}>电装集团产业园区产品碳足迹气泡地图 (气泡大小=碳排量，颜色=碳强度)</PanelTitle>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-emerald-500" /> 🟢 低碳标杆 (&lt;0.4)</span>
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-blue-500" /> 🔵 正常受控 (0.4~0.6)</span>
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-amber-500" /> 🟡 需改进 (&gt;0.6)</span>
            </div>
          </div>

          <div className="relative flex-1 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {parkBubbles.map((p) => (
              <div
                key={p.name}
                onClick={() => setSelectedPark(p)}
                className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-125 z-10"
                style={{ top: p.top, left: p.left }}
              >
                <div
                  className="size-9 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold shadow-lg ring-2 ring-white/40 animate-pulse"
                  style={{ backgroundColor: p.color }}
                >
                  <span>{p.city.slice(0, 1)}</span>
                </div>
                <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] px-1.5 py-0.5 rounded bg-slate-900/95 text-slate-200 border border-slate-700 font-sans shadow">
                  {p.name} · {p.totalCarbon}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 选定园区下钻卡片 */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-card border border-border space-y-3">
          <PanelTitle icon={Factory}>【{selectedPark.name}】下钻详情</PanelTitle>
          <div className="p-3 rounded-lg bg-accent/40 border border-border space-y-2.5 text-xs">
            <span className="font-bold text-sm text-foreground block">{selectedPark.name}</span>
            <div className="flex justify-between"><span>所属主导产业：</span><Badge tone="default">{selectedPark.industry}产业</Badge></div>
            <div className="flex justify-between"><span>园区总碳排量：</span><span className="font-mono font-bold text-foreground">{selectedPark.totalCarbon}</span></div>
            <div className="flex justify-between"><span>单位产品碳强度：</span><span className="font-mono font-bold text-emerald-400">{selectedPark.unitPcf} tCO2/万kVA</span></div>
            <div className="flex justify-between"><span>已认证产品占比：</span><span className="font-mono font-bold text-sky-400">{selectedPark.certifiedModels} / {selectedPark.totalModels} 型号 (57.1%)</span></div>
            
            <div className="pt-2">
              <button
                onClick={() => alert(`正在跳转进入【${selectedPark.name}】本地实景碳足迹追踪与量化报告系统...`)}
                className="w-full py-2 rounded-md bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 shadow"
              >
                <ExternalLink className="size-3.5" />
                进入本地碳足迹追踪系统
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 趋势与构成 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2 p-4">
          <PanelTitle title="集团产品碳足迹趋势" subtitle="按范围一/二/三拆解，支持按产业筛选" icon={Factory} />
          <AreaTrend
            data={carbonTrend}
            keys={[
              { key: '范围一', name: '范围一', color: 'var(--chart-3)' },
              { key: '范围二', name: '范围二', color: 'var(--chart-1)' },
              { key: '范围三', name: '范围三', color: 'var(--chart-4)' },
            ]}
          />
        </Panel>
        <Panel className="p-4">
          <PanelTitle title="全生命周期碳构成" subtitle="原材料/制造/运输/废弃" />
          <Donut data={hotspotData} />
        </Panel>
      </div>

      {/* 第三方认证荣誉轮播 */}
      <Panel className="overflow-hidden p-3 bg-gradient-to-r from-accent/30 via-accent/10 to-accent/30 border border-border">
        <div className="flex items-center gap-3">
          <Award className="size-5 shrink-0 text-amber-400" />
          <div className="relative h-6 flex-1 overflow-hidden">
            {honors.map((h, i) => (
              <div
                key={h}
                className={cn(
                  'absolute inset-0 flex items-center justify-between text-xs transition-all duration-500',
                  i === honorIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                )}
              >
                <span className="font-semibold text-foreground">
                  🏅 官方认证荣誉：{h}
                </span>
                <span className="text-muted-foreground font-mono">2026 权威核定</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  )
}

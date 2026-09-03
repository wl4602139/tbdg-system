'use client'

import { useMemo, useState } from 'react'
import { Database, FileCheck2, Award, TrendingDown, Boxes, ExternalLink, Layers } from 'lucide-react'
import { Panel, PanelTitle, KpiCard, StatusBadge } from '@/components/shared/primitives'
import { AreaTrend, Donut } from '@/components/shared/charts'
import { ChinaMap, type MapBubble } from '@/components/shared/china-map'
import { carbonTrend, hotspotData, honors } from '@/lib/mock-data'
import { parkGeos, parkFootprint, parkIndustryColor, intensityColor, type ParkIndustry } from '@/lib/park-geo'

const industries: ('全部' | ParkIndustry)[] = ['全部', '变压器', '线缆', '开关', '电容器', '综合']

export default function CockpitPage() {
  const [industry, setIndustry] = useState<'全部' | ParkIndustry>('全部')
  const [selected, setSelected] = useState<string | null>('nfsb')

  /* 每个园区的产品碳足迹指标 */
  const rows = useMemo(
    () => parkGeos.map((p) => ({ geo: p, m: parkFootprint(p) })),
    [],
  )
  const maxTotal = Math.max(...rows.map((r) => r.m.footprintTotal))

  const bubbles: MapBubble[] = rows.map(({ geo, m }) => {
    const dimmed = industry !== '全部' && geo.industry !== industry
    return {
      id: geo.id,
      name: geo.short,
      coordinates: geo.coordinates,
      size: m.footprintTotal / maxTotal,
      fill: parkIndustryColor[geo.industry],
      ring: intensityColor(m.unitIntensity),
      dimmed,
      badge: `${geo.short} ${m.analysisRatio}%`,
      tooltip: (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{geo.name}</p>
          <p className="text-muted-foreground">{geo.industry} · {geo.city}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 pt-1 font-mono text-[11px]">
            <span className="text-muted-foreground">碳足迹总量</span>
            <span className="text-right text-foreground">{m.footprintTotal} 万tCO2e</span>
            <span className="text-muted-foreground">单位碳强度</span>
            <span className="text-right text-foreground">{m.unitIntensity}</span>
            <span className="text-muted-foreground">分析占比</span>
            <span className="text-right text-foreground">{m.analysisRatio}%</span>
            <span className="text-muted-foreground">碳足迹均值</span>
            <span className="text-right text-foreground">{m.meanFootprint} tCO2/台套</span>
          </div>
        </div>
      ),
    }
  })

  const sel = rows.find((r) => r.geo.id === selected) ?? rows[0]

  return (
    <div className="space-y-4">
      {/* ① 顶部标题栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-[linear-gradient(120deg,color-mix(in_oklch,var(--primary)_16%,var(--panel)),var(--panel))] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-primary" />
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-foreground">集团碳足迹大屏</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {industries.map((it) => (
            <button
              key={it}
              type="button"
              onClick={() => setIndustry(it)}
              className={`h-8 rounded-md border px-3 text-xs font-medium transition-colors ${
                industry === it ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-panel text-muted-foreground hover:text-foreground'
              }`}
            >
              {it}
            </button>
          ))}
        </div>
      </div>

      {/* ③④② 主区：左分布 · 中地图 · 右成果 */}
      <div className="grid gap-4 lg:grid-cols-[300px_1fr_320px]">
        {/* ② 左：产品碳足迹分布/构成/标杆 */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="碳足迹总量" value="2.68" unit="万tCO2e" delta="-4.1%" up icon={TrendingDown} />
            <KpiCard label="分析占比" value="76" unit="%" delta="+8%" up icon={Layers} />
          </div>
          <Panel>
            <PanelTitle title="各系列产品碳足迹分布" subtitle="点击系列下钻构成（含标杆对比）" />
            <div className="space-y-2.5">
              {rows
                .slice()
                .sort((a, b) => b.m.footprintTotal - a.m.footprintTotal)
                .slice(0, 7)
                .map(({ geo, m }) => (
                  <div key={geo.id} className="flex items-center gap-2">
                    <span className="w-20 shrink-0 truncate text-xs text-foreground">{geo.short}</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${(m.footprintTotal / maxTotal) * 100}%`, background: parkIndustryColor[geo.industry] }} />
                    </div>
                    <span className="w-12 text-right font-mono text-[11px] text-foreground">{m.footprintTotal}</span>
                  </div>
                ))}
            </div>
          </Panel>
          <Panel>
            <PanelTitle title="生命周期构成" subtitle="选中园区碳排热点识别" />
            <Donut data={hotspotData} height={180} showLegend={false} />
            <div className="mt-2 space-y-1">
              {hotspotData.map((h, i) => (
                <div key={h.name} className="flex items-center gap-2 text-xs">
                  <span className="size-2.5 rounded-sm" style={{ background: `var(--chart-${(i % 5) + 1})` }} />
                  <span className="flex-1 text-muted-foreground">{h.name}</span>
                  <span className="font-mono text-foreground">{h.value}%</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ③ 中：园区/产业碳足迹气泡地图（主视觉） */}
        <Panel className="flex flex-col">
          <PanelTitle title="园区/产业碳足迹气泡地图" subtitle="气泡大小=碳足迹总量 · 颜色=产业 · 内环=单位碳强度" />
          <ChinaMap bubbles={bubbles} selectedId={selected} onSelect={setSelected} height={560} />
          {/* 图例 */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: 'var(--success)' }} />碳强度低 &lt;0.22</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: 'var(--warning)' }} />中 0.22~0.30</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: 'var(--destructive)' }} />高 &gt;0.30</span>
            <span className="ml-auto">产业：变压器/线缆/开关/电容器/综合（气泡填充色）</span>
          </div>
        </Panel>

        {/* ④ 右：选中园区经营单位成果 + 实时状态 */}
        <div className="space-y-4">
          <Panel>
            <PanelTitle title="经营单位成果" subtitle={sel.geo.name} />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-secondary/40 p-3">
                <div className="font-mono text-xl font-semibold text-foreground">{sel.m.modelCount}</div>
                <div className="text-[11px] text-muted-foreground">产品型号数</div>
              </div>
              <div className="rounded-lg border border-border bg-secondary/40 p-3">
                <div className="font-mono text-xl font-semibold text-primary">{sel.m.certifiedCount}</div>
                <div className="text-[11px] text-muted-foreground">已认证型号数</div>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {sel.geo.units.slice(0, 5).map((u) => (
                <div key={u} className="flex items-center justify-between rounded-md border border-border bg-panel px-3 py-2 text-xs">
                  <span className="text-foreground">{u}</span>
                  <StatusBadge tone={sel.m.unitIntensity < 0.22 ? 'ok' : sel.m.unitIntensity <= 0.3 ? 'warn' : 'danger'}>
                    {sel.m.unitIntensity} tCO2/万元
                  </StatusBadge>
                </div>
              ))}
            </div>
            <button type="button" className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
              <ExternalLink className="size-3.5" /> 进入本地碳足迹系统
            </button>
          </Panel>

          <div className="grid grid-cols-1 gap-3">
            <KpiCard label="实景数据库订单" value="48,260" unit="单" delta="+1,240" up icon={Database} />
            <KpiCard label="因子库因子" value="3,860" unit="个" delta="+126" up icon={Boxes} />
            <KpiCard label="认证产品" value="21" unit="项" delta="+3" up icon={FileCheck2} />
          </div>
        </div>
      </div>

      {/* ⑤ 底部：趋势 + 荣誉墙 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="集团碳足迹趋势" subtitle="按范围一/二/三拆解，标注标杆与目标" />
          <AreaTrend
            data={carbonTrend}
            keys={[
              { key: '范围一', name: '范围一', color: 'var(--chart-3)' },
              { key: '范围二', name: '范围二', color: 'var(--chart-1)' },
              { key: '范围三', name: '范围三', color: 'var(--chart-4)' },
            ]}
          />
        </Panel>
        <Panel>
          <div className="mb-3 flex items-center gap-2">
            <Award className="size-4 text-[var(--warning)]" />
            <h3 className="text-sm font-semibold text-foreground">认证荣誉墙</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['ISO 14067', 'CQC 认证', 'TÜV 莱茵', 'SGS 核证'].map((c) => (
              <div key={c} className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border bg-secondary/40 py-4 text-center">
                <FileCheck2 className="size-5 text-primary" />
                <span className="text-xs text-foreground">{c}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            {honors.slice(0, 3).map((h) => (
              <p key={h} className="truncate text-[11px] text-muted-foreground">· {h}</p>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

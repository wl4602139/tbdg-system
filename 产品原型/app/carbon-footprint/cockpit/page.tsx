'use client'

import { useMemo, useState } from 'react'
import { Boxes, Layers, Package, Factory, Truck, Recycle, Gauge } from 'lucide-react'
import { Panel, PanelTitle, KpiCard } from '@/components/shared/primitives'
import { Donut, RoseChart } from '@/components/shared/charts'
import { industries, allModelsOf, unitMetrics } from '@/lib/procurement'

/* 本地确定性伪随机：为每个型号生成稳定、有差异的阶段占比 */
function h(str: string): number {
  let x = 2166136261
  for (let i = 0; i < str.length; i++) {
    x ^= str.charCodeAt(i)
    x = Math.imul(x, 16777619)
  }
  return (x >>> 0) / 4294967295
}

/* 单个型号 · 各生命周期阶段自身占比（归一化到 100%） */
function modelStages(model: string) {
  const material = 0.5 + h(model + '|m') * 0.26 // 0.50 ~ 0.76
  const transport = 0.06 + h(model + '|t') * 0.06 // 0.06 ~ 0.12
  const produce = 0.14 + h(model + '|p') * 0.16 // 0.14 ~ 0.30
  const waste = 0.04 + h(model + '|w') * 0.06 // 0.04 ~ 0.10
  const s = material + transport + produce + waste
  return { material: material / s, transport: transport / s, produce: produce / s, waste: waste / s }
}

/* 原材料内部构成（铜/铝/钢/其他），按产业基准 */
const MATERIAL_MIX: Record<string, { name: string; base: number }[]> = {
  变压器: [
    { name: '硅钢片', base: 0.4 },
    { name: '铜绕组', base: 0.32 },
    { name: '铝', base: 0.1 },
    { name: '绝缘及其他', base: 0.18 },
  ],
  线缆: [
    { name: '铜导体', base: 0.46 },
    { name: '铝导体', base: 0.22 },
    { name: '交联聚乙烯', base: 0.2 },
    { name: '其他', base: 0.12 },
  ],
  开关: [
    { name: '钢材', base: 0.38 },
    { name: '铜', base: 0.26 },
    { name: 'SF6 及气体', base: 0.16 },
    { name: '其他', base: 0.2 },
  ],
}

/* 生命周期阶段定义 + 分布区间 */
const STAGES = [
  {
    key: 'material' as const,
    name: '原材料获取',
    icon: Package,
    color: 'var(--chart-1)',
    bands: [
      { name: '<50%', lo: 0, hi: 50 },
      { name: '50–60%', lo: 50, hi: 60 },
      { name: '60–70%', lo: 60, hi: 70 },
      { name: '≥70%', lo: 70, hi: 999 },
    ],
  },
  {
    key: 'produce' as const,
    name: '生产制造',
    icon: Factory,
    color: 'var(--chart-3)',
    bands: [
      { name: '<15%', lo: 0, hi: 15 },
      { name: '15–20%', lo: 15, hi: 20 },
      { name: '20–25%', lo: 20, hi: 25 },
      { name: '≥25%', lo: 25, hi: 999 },
    ],
  },
  {
    key: 'transport' as const,
    name: '原材料运输',
    icon: Truck,
    color: 'var(--chart-2)',
    bands: [
      { name: '<7%', lo: 0, hi: 7 },
      { name: '7–9%', lo: 7, hi: 9 },
      { name: '9–11%', lo: 9, hi: 11 },
      { name: '≥11%', lo: 11, hi: 999 },
    ],
  },
  {
    key: 'waste' as const,
    name: '废弃物处理',
    icon: Recycle,
    color: 'var(--chart-4)',
    bands: [
      { name: '<5%', lo: 0, hi: 5 },
      { name: '5–7%', lo: 5, hi: 7 },
      { name: '7–9%', lo: 7, hi: 9 },
      { name: '≥9%', lo: 9, hi: 999 },
    ],
  },
]

const MONTHS = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08']
const TAGS = ['全部', ...industries]

export default function CockpitPage() {
  const [tag, setTag] = useState('全部')
  const [from, setFrom] = useState('2026-01')
  const [to, setTo] = useState('2026-08')

  const models = useMemo(() => {
    const inds = tag === '全部' ? industries : [tag]
    return inds.flatMap((ind) =>
      allModelsOf(ind).map((m) => {
        const um = unitMetrics(m.model, ind)
        const perUnitAvg = um.length ? um.reduce((s, u) => s + u.perUnit, 0) / um.length : 0
        return { ...m, ind, shares: modelStages(m.model), perUnitAvg: Math.round(perUnitAvg * 1000) / 1000, units: um.length }
      }),
    )
  }, [tag])

  const total = models.length

  const agg = useMemo(() => {
    const a = { material: 0, transport: 0, produce: 0, waste: 0 }
    for (const m of models) {
      a.material += m.shares.material
      a.transport += m.shares.transport
      a.produce += m.shares.produce
      a.waste += m.shares.waste
    }
    const n = total || 1
    return { material: a.material / n, transport: a.transport / n, produce: a.produce / n, waste: a.waste / n }
  }, [models, total])

  const materialMix = useMemo(() => {
    const inds = tag === '全部' ? industries : [tag]
    const buckets = { 铜: 0, 铝: 0, 钢等金属: 0, 其他: 0 }
    let cnt = 0
    for (const ind of inds) {
      const mix = MATERIAL_MIX[ind] ?? []
      const w = allModelsOf(ind).length
      cnt += w
      for (const it of mix) {
        const key = it.name.includes('铜') ? '铜' : it.name.includes('铝') ? '铝' : it.name.includes('钢') ? '钢等金属' : '其他'
        buckets[key as keyof typeof buckets] += it.base * w
      }
    }
    const c = cnt || 1
    return [
      { name: '铜', value: Math.round((buckets['铜'] / c) * 100) },
      { name: '铝', value: Math.round((buckets['铝'] / c) * 100) },
      { name: '钢等金属', value: Math.round((buckets['钢等金属'] / c) * 100) },
      { name: '其他', value: Math.round((buckets['其他'] / c) * 100) },
    ]
  }, [tag])

  const distributions = useMemo(
    () =>
      STAGES.map((st) => {
        const bands = st.bands.map((b) => {
          const count = models.filter((m) => {
            const v = m.shares[st.key] * 100
            return v >= b.lo && v < b.hi
          }).length
          return { ...b, count, pct: total ? Math.round((count / total) * 100) : 0 }
        })
        const top = [...bands].sort((a, b) => b.count - a.count)[0]
        return { st, bands, top }
      }),
    [models, total],
  )

  const materialGe60 = total ? Math.round((models.filter((m) => m.shares.material >= 0.6).length / total) * 100) : 0
  const metalPct = materialMix[0].value + materialMix[1].value + materialMix[2].value
  const categories = new Set(models.map((m) => m.category)).size

  const groups = useMemo(() => {
    const map = new Map<string, typeof models>()
    for (const m of models) {
      const k = tag === '全部' ? m.ind : m.category
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(m)
    }
    return [...map.entries()].map(([name, arr]) => {
      const a = { material: 0, transport: 0, produce: 0, waste: 0 }
      for (const m of arr) {
        a.material += m.shares.material
        a.transport += m.shares.transport
        a.produce += m.shares.produce
        a.waste += m.shares.waste
      }
      const n = arr.length || 1
      return { name, count: arr.length, material: a.material / n, transport: a.transport / n, produce: a.produce / n, waste: a.waste / n }
    })
  }, [models, tag])

  return (
    <div className="flex flex-col gap-2.5">
      {/* ① 顶部：标题 + 产品标签 + 时间维度（最低到月） */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-[linear-gradient(120deg,color-mix(in_oklch,var(--primary)_14%,var(--panel)),var(--panel))] px-4 py-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-primary" />
          <div>
            <h1 className="text-base font-semibold tracking-wide text-foreground">电装集团产品碳足迹总览</h1>
            <p className="text-[11px] text-muted-foreground">产品碳足迹构成与阶段占比分布 · {from} 至 {to}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((it) => (
              <button
                key={it}
                type="button"
                onClick={() => setTag(it)}
                className={`h-7 rounded-md border px-3 text-xs font-medium transition-colors ${
                  tag === it ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-panel text-muted-foreground hover:text-foreground'
                }`}
              >
                {it}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-7 rounded-md border border-border bg-panel px-2 text-foreground">
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <span>至</span>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="h-7 rounded-md border border-border bg-panel px-2 text-foreground">
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ② KPI 概览 */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <KpiCard label="覆盖产品型号" value={String(total)} unit="个" icon={Boxes} />
        <KpiCard label="覆盖细分类别" value={String(categories)} unit="类" icon={Layers} />
        <KpiCard label="平均原材料占比" value={String(Math.round(agg.material * 100))} unit="%" icon={Package} />
        <KpiCard label="原材料占比≥60%的型号" value={String(materialGe60)} unit="%" icon={Gauge} />
      </div>

      {/* ③ 主区：构成总览 + 阶段区间分布（玫瑰图），填满余下高度 */}
      <div className="grid gap-2.5 lg:grid-cols-[320px_1fr]">
        {/* 左：整体碳足迹构成 */}
        <Panel className="flex min-h-0 flex-col p-3">
          <PanelTitle title="碳足迹构成总览" subtitle="按生命周期阶段的平均占比" />
          <div className="flex items-center gap-2">
            <div className="w-1/2">
              <Donut
                data={[
                  { name: '原材料获取', value: Math.round(agg.material * 100) },
                  { name: '生产制造', value: Math.round(agg.produce * 100) },
                  { name: '原材料运输', value: Math.round(agg.transport * 100) },
                  { name: '废弃物处理', value: Math.round(agg.waste * 100) },
                ]}
                height={128}
                innerRadius={34}
                showLegend={false}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              {[
                { n: '原材料获取', v: agg.material, c: 'var(--chart-1)' },
                { n: '生产制造', v: agg.produce, c: 'var(--chart-3)' },
                { n: '原材料运输', v: agg.transport, c: 'var(--chart-2)' },
                { n: '废弃物处理', v: agg.waste, c: 'var(--chart-4)' },
              ].map((r) => (
                <div key={r.n} className="flex items-center gap-2 text-xs">
                  <span className="size-2.5 rounded-sm" style={{ background: r.c }} />
                  <span className="flex-1 text-muted-foreground">{r.n}</span>
                  <span className="font-mono text-foreground">{Math.round(r.v * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 原材料内部构成 */}
          <div className="mt-3 border-t border-border pt-2.5">
            <div className="mb-1.5 text-xs font-medium text-foreground">原材料内部构成</div>
            <div className="flex h-3.5 w-full overflow-hidden rounded-full">
              {materialMix.map((m, i) => (
                <div key={m.name} title={`${m.name} ${m.value}%`} style={{ width: `${m.value}%`, background: `color-mix(in oklch, var(--chart-1) ${100 - i * 22}%, var(--muted))` }} />
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              {materialMix.map((m, i) => (
                <div key={m.name} className="flex items-center gap-2 text-xs">
                  <span className="size-2.5 rounded-sm" style={{ background: `color-mix(in oklch, var(--chart-1) ${100 - i * 22}%, var(--muted))` }} />
                  <span className="flex-1 text-muted-foreground">{m.name}</span>
                  <span className="font-mono text-foreground">{m.value}%</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              金属材料（铜/铝/钢）合计占原材料 <span className="font-mono text-primary">{metalPct}%</span>。
            </p>
          </div>
        </Panel>

        {/* 右：各阶段占比区间分布（玫瑰图，一屏平铺） */}
        <Panel className="flex min-h-0 flex-col p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="mt-0.5 h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
              <h3 className="text-sm font-semibold text-foreground">各阶段占比区间分布</h3>
            </div>
            <span className="text-[11px] text-muted-foreground">花瓣越长 = 落在该占比区间的型号越多</span>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
            {distributions.map(({ st, bands, top }) => (
              <div key={st.key} className="flex flex-col items-center">
                <div className="mb-0.5 flex items-center gap-1.5">
                  <st.icon className="size-4" style={{ color: st.color }} />
                  <span className="text-sm font-medium text-foreground">{st.name}</span>
                </div>
                <RoseChart data={bands.map((b) => ({ name: b.name, value: b.pct }))} color={st.color} size={124} />
                <div className="mt-1 text-[11px] text-muted-foreground">
                  主要区间 <span className="font-mono text-foreground">{top.name}</span>（{top.pct}%）
                </div>
                <div className="mt-1 grid w-full grid-cols-2 gap-x-2 gap-y-0.5">
                  {bands.map((b, i) => (
                    <span key={b.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span className="size-2 shrink-0 rounded-sm" style={{ background: `color-mix(in oklch, ${st.color} ${50 + i * 16}%, var(--muted))` }} />
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* ④ 分组构成对比 */}
      <Panel className="p-3">
        <PanelTitle title={tag === '全部' ? '各产品大类碳足迹构成对比' : '各细分类别碳足迹构成对比'} subtitle="各生命周期阶段的平均占比" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="min-w-0 flex-1 space-y-2">
            {groups.map((g) => (
              <div key={g.name} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <div className="truncate text-xs font-medium text-foreground">{g.name}</div>
                  <div className="text-[10px] text-muted-foreground">{g.count} 个型号</div>
                </div>
                <div className="flex h-5 flex-1 overflow-hidden rounded-md">
                  {[
                    { v: g.material, c: 'var(--chart-1)', n: '原材料获取' },
                    { v: g.produce, c: 'var(--chart-3)', n: '生产制造' },
                    { v: g.transport, c: 'var(--chart-2)', n: '原材料运输' },
                    { v: g.waste, c: 'var(--chart-4)', n: '废弃物处理' },
                  ].map((s) => (
                    <div
                      key={s.n}
                      title={`${s.n} ${Math.round(s.v * 100)}%`}
                      className="flex items-center justify-center text-[10px] font-medium text-white"
                      style={{ width: `${s.v * 100}%`, background: s.c }}
                    >
                      {s.v >= 0.12 ? `${Math.round(s.v * 100)}%` : ''}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {[
              { n: '原材料获取', c: 'var(--chart-1)' },
              { n: '生产制造', c: 'var(--chart-3)' },
              { n: '原材料运输', c: 'var(--chart-2)' },
              { n: '废弃物处理', c: 'var(--chart-4)' },
            ].map((s) => (
              <span key={s.n} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="size-2.5 rounded-sm" style={{ background: s.c }} />
                {s.n}
              </span>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  )
}

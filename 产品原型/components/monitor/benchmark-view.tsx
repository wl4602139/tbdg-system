'use client'

import { useState } from 'react'
import {
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  AlertTriangle,
  GitCompare,
  Gauge,
  ArrowRight,
} from 'lucide-react'
import { Panel, PanelTitle, StatusBadge, DataTable } from '@/components/shared/primitives'
import { LineTrend } from '@/components/shared/charts'
import {
  benchDimensions,
  benchMetrics,
  benchMetricByKey,
  benchData,
  dimSummary,
  rankByMetric,
  compositeScore,
  achievement,
  gapPct,
  metricStatus,
  statusTone,
  type BenchMetric,
} from '@/lib/benchmark'

const toneVar = { ok: 'var(--success)', warn: 'var(--warning)', danger: 'var(--destructive)' } as const
type Tone = keyof typeof toneVar

function fmt(v: number, unit: string) {
  if (unit === 'tce/万元') return v.toFixed(2)
  if (unit === '%') return v.toFixed(1)
  return Math.round(v).toLocaleString('zh-CN')
}

/* 同比箭头 */
function YoY({ v, lowerBetter }: { v: number; lowerBetter: boolean }) {
  const improving = lowerBetter ? v < 0 : v > 0
  const flat = Math.abs(v) < 0.5
  const Icon = flat ? Minus : v > 0 ? TrendingUp : TrendingDown
  const color = flat ? 'text-muted-foreground' : improving ? 'text-[var(--success)]' : 'text-[var(--destructive)]'
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${color}`}>
      <Icon className="size-3.5" />
      {v > 0 ? '+' : ''}
      {v.toFixed(1)}%
    </span>
  )
}

/* 关键指标总览卡：集团均值 vs 零碳标杆 */
function MetricOverviewCard({ dim, m }: { dim: string; m: BenchMetric }) {
  const list = benchData[dim]
  const avg = list.reduce((s, e) => s + e.values[m.key], 0) / list.length
  const status = metricStatus(avg, m)
  const tone = statusTone(status) as Tone
  const gap = gapPct(avg, m)
  const reached = gap <= 0
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{m.name}</p>
        <StatusBadge tone={tone}>{status}</StatusBadge>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-mono text-2xl font-semibold text-foreground text-glow">{fmt(avg, m.unit)}</span>
        <span className="text-xs text-muted-foreground">{m.unit}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">
          零碳标杆 <span className="font-mono text-foreground">{fmt(m.benchmark, m.unit)}</span>
        </span>
        <span
          className="font-medium"
          style={{ color: reached ? 'var(--success)' : 'var(--destructive)' }}
        >
          {reached ? '已达标' : `差${Math.abs(gap).toFixed(0)}%`}
        </span>
      </div>
      {/* 达标度进度条：标杆位于 5/6 处，越过即达标 */}
      <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${Math.min(100, (achievement(avg, m) / 1.2) * 100)}%`, background: toneVar[tone] }}
        />
        <div className="absolute inset-y-0 w-px bg-foreground/50" style={{ left: `${(1 / 1.2) * 100}%` }} />
      </div>
    </div>
  )
}

/* 红黑榜单行 */
function RankBar({
  row,
  metricKey,
  scale,
}: {
  row: ReturnType<typeof rankByMetric>[number]
  metricKey: string
  scale: { benchPct: number; barPct: (r: any) => number }
}) {
  const isScore = metricKey === 'score'
  const m = isScore ? null : benchMetricByKey[metricKey]
  const tone = statusTone(row.status) as Tone
  const rankColors = ['#F5C451', '#C9D1D9', '#CD8B62']
  const rankBg = row.rank <= 3 ? rankColors[row.rank - 1] : undefined
  const val = isScore ? row.metricValue : row.metricValue
  const unit = isScore ? '分' : m!.unit
  const reached = isScore ? row.metricValue >= 90 : row.metricGap <= 0
  return (
    <div className="flex items-center gap-3 py-2">
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
        style={
          rankBg
            ? { background: rankBg, color: '#1a1a1a' }
            : { background: 'var(--muted)', color: 'var(--muted-foreground)' }
        }
      >
        {row.rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium text-foreground">{row.name}</span>
            <span className="hidden truncate text-[11px] text-muted-foreground sm:inline">{row.meta}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-mono text-sm font-semibold text-foreground">
              {fmt(val, isScore ? '' : m!.unit)}
              <span className="ml-0.5 font-sans text-[10px] font-normal text-muted-foreground">{unit}</span>
            </span>
            {!isScore && <YoY v={row.yoy[metricKey]} lowerBetter={m!.lowerBetter} />}
          </div>
        </div>
        <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all"
            style={{ width: `${scale.barPct(row)}%`, background: toneVar[tone] }}
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-foreground/60"
            style={{ left: `${scale.benchPct}%` }}
            title="零碳标杆"
          />
        </div>
      </div>
      <span
        className="w-14 shrink-0 text-right text-xs font-medium"
        style={{ color: reached ? 'var(--success)' : 'var(--destructive)' }}
      >
        {isScore
          ? reached
            ? '达标'
            : `差${row.metricGap.toFixed(0)}`
          : row.metricGap <= 0
            ? '达标'
            : `+${row.metricGap.toFixed(0)}%`}
      </span>
    </div>
  )
}

export function BenchmarkView() {
  const [dim, setDim] = useState('factory')
  const [metricKey, setMetricKey] = useState('score')

  const dimObj = benchDimensions.find((d) => d.key === dim)!
  const summary = dimSummary(dim)
  const ranked = rankByMetric(dim, metricKey)
  const isScore = metricKey === 'score'
  const m = isScore ? null : benchMetricByKey[metricKey]

  // 达标度进度条比例
  const benchPct = (1 / 1.2) * 100
  const barPct = (r: any) => {
    if (isScore) return Math.min(100, (r.metricValue / 108) * 100)
    return Math.min(100, (achievement(r.metricValue, m!) / 1.2) * 100)
  }

  const worst = ranked[ranked.length - 1]
  // 最差实体最大差距指标（管理抓手）
  const worstEntity = benchData[dim].find((e) => e.name === worst.name)!
  const worstMetric = [...benchMetrics].sort((a, b) => gapPct(worstEntity.values[b.key], b) - gapPct(worstEntity.values[a.key], a))[0]
  const worstMetricGap = gapPct(worstEntity.values[worstMetric.key], worstMetric)

  // 生产计划维度：时间序列
  const planTrend =
    dimObj.temporal && !isScore
      ? benchData[dim].map((e) => ({ name: e.meta, [m!.name]: e.values[m!.key], 零碳标杆: m!.benchmark }))
      : benchData[dim].map((e) => ({ name: e.meta, 综合得分: compositeScore(e.values), 标杆线: 90 }))

  return (
    <div className="space-y-4">
      {/* 维度切换 + 指标选择 */}
      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto">
            <GitCompare className="size-4 shrink-0 text-primary" />
            <span className="shrink-0 text-xs text-muted-foreground">对标维度</span>
            <div className="flex gap-1">
              {benchDimensions.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDim(d.key)}
                  className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    dim === d.key
                      ? 'bg-primary text-primary-foreground shadow-[0_0_16px_-4px_var(--primary)]'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-xs text-muted-foreground">对标指标</span>
            <div className="flex gap-1">
              <button
                onClick={() => setMetricKey('score')}
                className={`shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  metricKey === 'score'
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                零碳综合得分
              </button>
              {benchMetrics.map((mm) => (
                <button
                  key={mm.key}
                  onClick={() => setMetricKey(mm.key)}
                  className={`shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    metricKey === mm.key
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {mm.short}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {dimObj.desc}
          {dimObj.temporal && '（当前产品：SG10-2500kVA 变压器，观察相同产品不同批次的减碳趋势）'}
        </p>
      </Panel>

      {/* 关键指标总览：集团均值 vs 零碳标杆 */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          <h3 className="text-sm font-semibold text-foreground">
            零碳关键指标总览 · {dimObj.name}口径
          </h3>
          <span className="text-xs text-muted-foreground">（{dimObj.name}平均值与零碳标杆的差距）</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {benchMetrics.map((mm) => (
            <MetricOverviewCard key={mm.key} dim={dim} m={mm} />
          ))}
        </div>
      </div>

      {/* 领导视角宏观概要 */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {/* 平均得分 */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4">
          <div className="tech-radial pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{dimObj.name}平均零碳得分</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-bold text-primary text-glow">{summary.avgScore}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">零碳标杆线 90 分</p>
            </div>
            <div className="rounded-lg border border-border bg-primary/10 p-2">
              <Gauge className="size-5 text-primary" />
            </div>
          </div>
        </div>
        {/* 达标数 */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">达到零碳标杆</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-3xl font-bold text-[var(--success)] text-glow">{summary.reachCount}</span>
            <span className="text-sm text-muted-foreground">/ {summary.total} 个{dimObj.entityLabel}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[var(--success)]"
              style={{ width: `${(summary.reachCount / summary.total) * 100}%` }}
            />
          </div>
        </div>
        {/* 标杆单位 */}
        <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-4">
          <div className="flex items-center gap-1.5 text-xs text-[var(--success)]">
            <Crown className="size-3.5" /> 标杆{dimObj.entityLabel}
          </div>
          <p className="mt-2 truncate text-base font-semibold text-foreground" title={summary.best.name}>
            {summary.best.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            综合得分 <span className="font-mono text-[var(--success)]">{summary.best.score}</span> 分 · 全组领先
          </p>
        </div>
        {/* 管理抓手（最差） */}
        <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 p-4">
          <div className="flex items-center gap-1.5 text-xs text-[var(--destructive)]">
            <Target className="size-3.5" /> 管理抓手
          </div>
          <p className="mt-2 truncate text-base font-semibold text-foreground" title={summary.worst.name}>
            {summary.worst.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            主要差距：{worstMetric.name} 距标杆
            <span className="ml-1 font-mono text-[var(--destructive)]">+{worstMetricGap.toFixed(0)}%</span>
          </p>
        </div>
      </div>

      {/* 红黑榜 + 趋势 */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel>
          <PanelTitle
            title={`${dimObj.name}对标红黑榜`}
            subtitle={`按${isScore ? '零碳综合得分' : m!.name}排名，竖线为零碳标杆，条形越过标杆即达标`}
            icon={Trophy}
          />
          <div className="divide-y divide-border/50">
            {ranked.map((row) => (
              <RankBar key={row.id} row={row} metricKey={metricKey} scale={{ benchPct, barPct }} />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full" style={{ background: 'var(--success)' }} /> 优秀·达标
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full" style={{ background: 'var(--warning)' }} /> 正常·接近
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full" style={{ background: 'var(--destructive)' }} /> 异常·差距大
            </span>
            <span className="ml-auto flex items-center gap-1">
              <span className="h-3 w-0.5 bg-foreground/60" /> 零碳标杆线
            </span>
          </div>
        </Panel>

        <Panel>
          <PanelTitle
            title={dimObj.temporal ? '相同产品·减碳趋势' : `${dimObj.name}综合得分分布`}
            subtitle={dimObj.temporal ? '不同时间批次对标零碳标杆' : '各单位综合得分对标标杆线'}
            icon={dimObj.temporal ? TrendingDown : GitCompare}
          />
          <LineTrend
            data={planTrend}
            xKey="name"
            keys={
              dimObj.temporal && !isScore
                ? [
                    { key: m!.name, name: m!.name, color: 'var(--chart-1)' },
                    { key: '零碳标杆', name: '零碳标杆', color: 'var(--chart-3)' },
                  ]
                : [
                    { key: '综合得分', name: '综合得分', color: 'var(--chart-1)' },
                    { key: '标杆线', name: '零碳标杆线', color: 'var(--chart-3)' },
                  ]
            }
            height={260}
          />
        </Panel>
      </div>

      {/* 多指标明细对标表 */}
      <Panel>
        <PanelTitle
          title={`${dimObj.name}多指标对标明细`}
          subtitle="综合得分 + 5 项零碳关键指标，红色标注差距最大的管理抓手"
          icon={GitCompare}
        />
        <DataTable
          columns={[
            {
              key: 'rank',
              label: '排名',
              render: (r) => <span className="font-mono text-muted-foreground">{r._rank}</span>,
            },
            {
              key: 'name',
              label: dimObj.entityLabel,
              render: (r) => (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{r.name}</span>
                  <span className="text-[11px] text-muted-foreground">{r.meta}</span>
                </div>
              ),
            },
            {
              key: 'score',
              label: '综合得分',
              align: 'right',
              render: (r) => (
                <span
                  className="font-mono font-semibold"
                  style={{ color: r._score >= 90 ? 'var(--success)' : r._score >= 78 ? 'var(--warning)' : 'var(--destructive)' }}
                >
                  {r._score}
                </span>
              ),
            },
            ...benchMetrics.map((mm) => ({
              key: mm.key,
              label: mm.short,
              align: 'right' as const,
              render: (r: any) => {
                const g = gapPct(r.values[mm.key], mm)
                const st = metricStatus(r.values[mm.key], mm)
                const isWorst = r._worstKey === mm.key
                return (
                  <div className={`text-right ${isWorst ? 'rounded-md bg-[var(--destructive)]/10 px-1.5 py-0.5' : ''}`}>
                    <span className="font-mono text-foreground">{fmt(r.values[mm.key], mm.unit)}</span>
                    <span
                      className="ml-1 text-[10px]"
                      style={{ color: statusTone(st) === 'ok' ? 'var(--success)' : statusTone(st) === 'warn' ? 'var(--warning)' : 'var(--destructive)' }}
                    >
                      {g <= 0 ? '达标' : `+${g.toFixed(0)}%`}
                    </span>
                  </div>
                )
              },
            })),
          ]}
          rows={rankByMetric(dim, 'score').map((r) => {
            const wk = [...benchMetrics].sort((a, b) => gapPct(r.values[b.key], b) - gapPct(r.values[a.key], a))[0].key
            return { ...r, _rank: r.rank, _score: r.metricValue, _worstKey: wk }
          })}
        />
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <AlertTriangle className="size-3.5 text-[var(--destructive)]" />
          红色高亮为各{dimObj.entityLabel}距零碳标杆差距最大的指标，即优先改进的管理抓手
          <ArrowRight className="size-3.5" />
          可下钻至指标管控查看原始数据与计算说明
        </p>
      </Panel>
    </div>
  )
}

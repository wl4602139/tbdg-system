'use client'

import { useMemo, useState } from 'react'
import { Target, ChevronRight, TriangleAlert, Search, RotateCcw } from 'lucide-react'
import { Panel, StatusBadge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { BarBenchmark, BarGroup } from '@/components/shared/charts'
import { CascadeFilter, TimeFilter, initCascade, type CascadeSel } from './cascade-filter'
import {
  workshopLines,
  benchmarkValues,
  benchTone,
  carbonHotspots,
  materialBreakdown,
  produceBreakdown,
  type WorkshopLine,
} from '@/lib/procurement'

export function BenchmarkView() {
  const [sel, setSel] = useState<CascadeSel>(() => initCascade('变压器'))
  const [from, setFrom] = useState('2026-06')
  const [to, setTo] = useState('2026-08')
  const [scope, setScope] = useState('全部车间产线')
  const [bench, setBench] = useState(benchmarkValues)
  const [setOpen, setSetOpen] = useState(false)
  const [drillLine, setDrillLine] = useState<WorkshopLine | null>(null)
  const [hotspot, setHotspot] = useState<(typeof carbonHotspots)[number] | null>(null)
  /* 已应用的查询条件（点击查询后生效） */
  const [applied, setApplied] = useState<CascadeSel>(sel)

  const lines = useMemo(() => workshopLines(applied.model, applied.ind), [applied.model, applied.ind])

  function onQuery() {
    setApplied(sel)
  }
  function onReset() {
    const ns = initCascade('变压器')
    setSel(ns)
    setFrom('2026-06')
    setTo('2026-08')
    setScope('全部车间产线')
    setApplied(ns)
  }

  return (
    <div className="space-y-5">
      <Panel
        className="relative z-30"
        title="基准对比"
        desc="以车间产线为对象，将单台、主材、生产环节碳排分别与基准值对比，识别高碳排热点并给出改进建议；支持维护各维度基准值"
      >
        <CascadeFilter
          value={sel}
          onChange={setSel}
          time={<TimeFilter from={from} to={to} onFrom={setFrom} onTo={setTo} />}
        >
          <button type="button" onClick={onQuery} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Search className="size-4" /> 查询
          </button>
          <button type="button" onClick={onReset} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <RotateCcw className="size-4" /> 重置
          </button>
          <button
            onClick={() => setSetOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <Target className="size-4" />
            基准值设置
          </button>
        </CascadeFilter>
      </Panel>

      {/* 三图基准对比 */}
      <Panel
        title={`车间产线碳足迹对比 · ${applied.model}`}
        desc="横轴=各车间产线 · 柱=实际值 · 虚线=基准值 · 超基准柱标红 · 点击柱体查看该产线明细"
        actions={
          <Select
            label="对比范围"
            value={scope}
            onChange={setScope}
            options={['全部车间产线', '仅高压产线', '仅本部产线'].map((v) => ({ label: v, value: v }))}
          />
        }
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 text-xs font-medium text-foreground">单台产品碳足迹</div>
            <div className="mb-1 text-[11px] text-muted-foreground">tCO2/台 vs 单台基准</div>
            <BarBenchmark data={lines} dataKey="perUnit" benchmark={bench.perUnit} unit=" tCO2" onBarClick={setDrillLine} />
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 text-xs font-medium text-foreground">主材碳排总量</div>
            <div className="mb-1 text-[11px] text-muted-foreground">tCO2/台 vs 主材基准</div>
            <BarBenchmark data={lines} dataKey="material" benchmark={bench.material} unit=" tCO2" onBarClick={setDrillLine} />
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 text-xs font-medium text-foreground">生产环节碳排</div>
            <div className="mb-1 text-[11px] text-muted-foreground">tCO2/台 vs 生产环节基准</div>
            <BarBenchmark data={lines} dataKey="produce" benchmark={bench.produce} unit=" tCO2" onBarClick={setDrillLine} />
          </div>
        </div>
      </Panel>

      {/* 车间产线碳排汇总 */}
      <Panel title="车间产线碳排汇总" desc="点击行查看该产线全维度基准对比详情">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-2.5 text-left font-medium">车间产线</th>
                <th className="px-3 py-2.5 text-right font-medium">单台碳足迹</th>
                <th className="px-3 py-2.5 text-right font-medium">主材碳排/占比</th>
                <th className="px-3 py-2.5 text-right font-medium">生产环节/占比</th>
                <th className="px-3 py-2.5 text-center font-medium">对标状态</th>
                <th className="px-3 py-2.5 text-center font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const tone = benchTone(l.perUnit, bench.perUnit)
                return (
                  <tr
                    key={l.name}
                    onClick={() => setDrillLine(l)}
                    className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40"
                  >
                    <td className="px-3 py-2.5 text-foreground">{l.name}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-foreground">{l.perUnit}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                      {l.material} · {Math.round((l.material / l.perUnit) * 100)}%
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                      {l.produce} · {Math.round((l.produce / l.perUnit) * 100)}%
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <StatusBadge tone={tone}>
                        {tone === 'ok' ? '达标' : tone === 'warn' ? '临界' : '超基准'}
                      </StatusBadge>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <ChevronRight className="mx-auto size-4 text-muted-foreground" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 高碳排热点 */}
      <Panel title="高碳排热点 · 建议与分析" desc="点击热点卡片查看详情与改进建议" className="border-l-2 border-l-[var(--destructive)]">
        <div className="grid gap-3 lg:grid-cols-3">
          {carbonHotspots.map((h) => (
            <button
              key={h.title}
              onClick={() => setHotspot(h)}
              className="rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent/40"
            >
              <div className="flex items-start justify-between gap-2">
                <TriangleAlert
                  className="mt-0.5 size-4 shrink-0"
                  style={{ color: h.tone === 'danger' ? 'var(--destructive)' : 'var(--warning)' }}
                />
                <StatusBadge tone={h.tone}>{h.over}</StatusBadge>
              </div>
              <div className="mt-2 text-sm font-medium text-foreground">{h.title}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{h.line}</div>
            </button>
          ))}
        </div>
      </Panel>

      {/* 基准值设置弹窗 */}
      <BenchSetModal open={setOpen} onClose={() => setSetOpen(false)} value={bench} onSave={setBench} />

      {/* 车间产线明细弹窗 */}
      <LineDrill line={drillLine} bench={bench} onClose={() => setDrillLine(null)} />

      {/* 热点详情弹窗 */}
      <Modal
        open={!!hotspot}
        onClose={() => setHotspot(null)}
        title={hotspot?.title ?? ''}
        description={hotspot?.line}
        size="md"
      >
        {hotspot && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">超基准</span>
              <StatusBadge tone={hotspot.tone}>{hotspot.over}</StatusBadge>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm leading-relaxed text-foreground">
              {hotspot.advice}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* 基准值设置弹窗 */
function BenchSetModal({
  open,
  onClose,
  value,
  onSave,
}: {
  open: boolean
  onClose: () => void
  value: typeof benchmarkValues
  onSave: (v: typeof benchmarkValues) => void
}) {
  const [draft, setDraft] = useState(value)
  const fields: { key: keyof typeof benchmarkValues; label: string; unit: string }[] = [
    { key: 'perUnit', label: '单台产品碳足迹基准', unit: 'tCO2/台' },
    { key: 'material', label: '主材碳排基准', unit: 'tCO2/台' },
    { key: 'produce', label: '生产环节碳排基准', unit: 'tCO2/台' },
  ]
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="基准值设置"
      description="维护各维度基准值，用于车间产线对标（演示：即时生效）"
      size="md"
      footer={
        <>
          <button onClick={onClose} className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-accent">
            取消
          </button>
          <button
            onClick={() => {
              onSave(draft)
              onClose()
            }}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            保存基准值
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="flex items-center justify-between gap-3">
            <label className="text-sm text-foreground">{f.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={draft[f.key]}
                onChange={(e) => setDraft({ ...draft, [f.key]: Number(e.target.value) })}
                className="h-9 w-28 rounded-md border border-border bg-panel px-3 text-right font-mono text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="w-20 text-xs text-muted-foreground">{f.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

/* 车间产线全维度明细弹窗 */
function LineDrill({
  line,
  bench,
  onClose,
}: {
  line: WorkshopLine | null
  bench: typeof benchmarkValues
  onClose: () => void
}) {
  if (!line) return null
  const dims = [
    { name: '单台产品碳足迹', actual: line.perUnit, base: bench.perUnit },
    { name: '主材碳排', actual: line.material, base: bench.material },
    { name: '生产环节碳排', actual: line.produce, base: bench.produce },
  ]
  const mat = materialBreakdown(line.name)
  const proc = produceBreakdown(line.name)
  return (
    <Modal open={!!line} onClose={onClose} title={`${line.name} · 基准对比详情`} description={`所属经营单位：${line.unit}`} size="xl">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {dims.map((d) => {
            const tone = benchTone(d.actual, d.base)
            const diff = (((d.actual - d.base) / d.base) * 100).toFixed(1)
            return (
              <div key={d.name} className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground">{d.name}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-mono text-xl font-semibold text-foreground">{d.actual}</span>
                  <span className="text-[11px] text-muted-foreground">tCO2</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">基准 {d.base}</span>
                  <StatusBadge tone={tone}>{Number(diff) > 0 ? `+${diff}%` : `${diff}%`}</StatusBadge>
                </div>
              </div>
            )
          })}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 text-xs font-medium text-foreground">主材碳排构成</div>
            <BarGroup data={mat} keys={[{ key: 'value', name: '主材碳排', color: 'var(--chart-1)' }]} height={190} />
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 text-xs font-medium text-foreground">生产环节碳排构成</div>
            <BarGroup data={proc} keys={[{ key: 'value', name: '环节碳排', color: 'var(--chart-3)' }]} height={190} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

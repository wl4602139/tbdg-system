'use client'

/* 实景数据库：将已核算完成的产品型号碳足迹作为「产品碳足迹因子」沉淀，
 * 以最终成果形式支持集团内部管理与应用。按时间查询、按产品(产业宏观产品)标签选择、
 * 按经营单位筛选，列表展示具体产品碳足迹因子，并可穿透至碳足迹核算页做详情追溯。
 * 上方三张卡片同时作为视图切换（筛选设置）：
 *   - 产品碳足迹数据：同一型号跨经营单位取平均，仅展示各型号一条
 *   - 实测值记录：展示全部实测明细（含经营单位列）
 *   - 覆盖细分类别：按细分产品类别聚合，仅展示单位产品碳足迹 */
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Database, Boxes, CalendarRange, Search, RotateCcw, ArrowUpRight } from 'lucide-react'
import { Panel, DataTable } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import {
  industries,
  majorCategoriesOf,
  mediumCategoriesOf,
  modelsOf,
} from '@/lib/procurement'
import { modelAccounting } from '@/lib/accounting'

type Granularity = 'month' | 'year' | 'range'
type ViewMode = 'model' | 'measured' | 'category'
const ALL_UNIT = '全部经营单位'
const ALL_MAJOR = '全部大类'
const ALL_MEDIUM = '全部中类'
const DEFAULT_FROM = '2026-06'
const DEFAULT_TO = '2026-08'

type FactorEntry = {
  id: string
  ind: string
  majorCat: string
  mediumCat: string
  cat: string
  model: string
  unit: string
  perUnit: number
  perFeature: number
  feature: number
  featureUnit: string
}

export function RealSceneView() {
  const router = useRouter()
  const [ind, setInd] = useState('变压器')
  const [majorCat, setMajorCat] = useState(ALL_MAJOR)
  const [mediumCat, setMediumCat] = useState(ALL_MEDIUM)
  const [granularity, setGranularity] = useState<Granularity>('range')
  const [from, setFrom] = useState(DEFAULT_FROM)
  const [to, setTo] = useState(DEFAULT_TO)
  const [year, setYear] = useState('2026')
  const [unit, setUnit] = useState(ALL_UNIT)
  const [kw, setKw] = useState('')
  // 视图模式（由上方卡片点击切换，直接作为筛选设置）
  const [view, setView] = useState<ViewMode>('model')
  // 提交态
  const [applied, setApplied] = useState({
    ind: '变压器',
    majorCat: ALL_MAJOR,
    mediumCat: ALL_MEDIUM,
    granularity: 'range' as Granularity,
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    year: '2026',
    unit: ALL_UNIT,
    kw: '',
  })

  // 大类与中类下拉选项
  const majorCatOptions = useMemo(() => {
    return [
      { label: '全部产品大类', value: ALL_MAJOR },
      ...majorCategoriesOf(ind).map((c) => ({ label: c, value: c })),
    ]
  }, [ind])

  const mediumCatOptions = useMemo(() => {
    const meds =
      majorCat === ALL_MAJOR
        ? Array.from(new Set(majorCategoriesOf(ind).flatMap((maj) => mediumCategoriesOf(ind, maj))))
        : mediumCategoriesOf(ind, majorCat)
    return [
      { label: '全部产品中类', value: ALL_MEDIUM },
      ...meds.map((m) => ({ label: m, value: m })),
    ]
  }, [ind, majorCat])

  // 根据粒度换算查询区间
  const range = useMemo(() => {
    if (applied.granularity === 'year') return { from: `${applied.year}-01`, to: `${applied.year}-12` }
    if (applied.granularity === 'month') return { from: applied.from, to: applied.from }
    return { from: applied.from, to: applied.to }
  }, [applied])

  // 数据时间展示：按粒度显示为一个实际范围
  const rangeLabel = useMemo(() => {
    if (applied.granularity === 'year') return `${applied.year} 年全年`
    if (applied.granularity === 'month') return applied.from
    return `${range.from} 至 ${range.to}`
  }, [applied.granularity, applied.year, applied.from, range.from, range.to])

  // 全量因子：该产业下 大类→中类→型号→各生产经营单位 的已核算结果（实测明细）
  const allEntries = useMemo<FactorEntry[]>(() => {
    const out: FactorEntry[] = []
    const majorCats = majorCategoriesOf(applied.ind)
    for (const maj of majorCats) {
      const medCats = mediumCategoriesOf(applied.ind, maj)
      for (const med of medCats) {
        const models = modelsOf(applied.ind, maj, med)
        for (const model of models) {
          for (const r of modelAccounting(model, applied.ind)) {
            out.push({
              id: `${model}|${r.unit}`,
              ind: applied.ind,
              majorCat: maj,
              mediumCat: med,
              cat: med,
              model,
              unit: r.unit,
              perUnit: r.perUnit,
              perFeature: r.perFeature,
              feature: r.feature,
              featureUnit: r.featureUnit,
            })
          }
        }
      }
    }
    return out
  }, [applied.ind])

  const unitOptions = useMemo(
    () => [ALL_UNIT, ...Array.from(new Set(allEntries.map((e) => e.unit)))],
    [allEntries],
  )

  // 实测明细（经产品大类、产品中类、关键词、经营单位筛选后）
  const entries = useMemo(() => {
    return allEntries.filter((e) => {
      if (applied.majorCat !== ALL_MAJOR && e.majorCat !== applied.majorCat) return false
      if (applied.mediumCat !== ALL_MEDIUM && e.mediumCat !== applied.mediumCat) return false
      if (applied.unit !== ALL_UNIT && e.unit !== applied.unit) return false
      if (applied.kw && !`${e.model}${e.cat}${e.majorCat}${e.mediumCat}`.toLowerCase().includes(applied.kw.toLowerCase())) return false
      return true
    })
  }, [allEntries, applied.majorCat, applied.mediumCat, applied.unit, applied.kw])

  // 视图一：同一型号跨经营单位取平均 —— 每个型号一条
  const modelRows = useMemo(() => {
    const map = new Map<string, { majorCat: string; mediumCat: string; cat: string; model: string; ind: string; perUnitSum: number; perFeatureSum: number; n: number; featureUnit: string }>()
    for (const e of entries) {
      const cur = map.get(e.model) ?? { majorCat: e.majorCat, mediumCat: e.mediumCat, cat: e.cat, model: e.model, ind: e.ind, perUnitSum: 0, perFeatureSum: 0, n: 0, featureUnit: e.featureUnit }
      cur.perUnitSum += e.perUnit
      cur.perFeatureSum += e.perFeature
      cur.n += 1
      map.set(e.model, cur)
    }
    return Array.from(map.values()).map((m) => ({
      id: m.model,
      ind: m.ind,
      majorCat: m.majorCat,
      mediumCat: m.mediumCat,
      cat: m.cat,
      model: m.model,
      unitCount: m.n,
      perUnit: m.perUnitSum / m.n,
      perFeature: m.perFeatureSum / m.n,
      featureUnit: m.featureUnit,
      rangeLabel,
    }))
  }, [entries, rangeLabel])

  // 视图三：按产品中类聚合 —— 每个类别一条（仅单位产品碳足迹）
  const categoryRows = useMemo(() => {
    const map = new Map<string, { majorCat: string; mediumCat: string; cat: string; ind: string; perFeatureSum: number; n: number; featureUnit: string; models: Set<string> }>()
    for (const e of entries) {
      const cur = map.get(e.mediumCat) ?? { majorCat: e.majorCat, mediumCat: e.mediumCat, cat: e.cat, ind: e.ind, perFeatureSum: 0, n: 0, featureUnit: e.featureUnit, models: new Set<string>() }
      cur.perFeatureSum += e.perFeature
      cur.n += 1
      cur.models.add(e.model)
      map.set(e.mediumCat, cur)
    }
    return Array.from(map.values()).map((c) => ({
      id: c.mediumCat,
      ind: c.ind,
      majorCat: c.majorCat,
      mediumCat: c.mediumCat,
      cat: c.cat,
      modelCount: c.models.size,
      perFeature: c.perFeatureSum / c.n,
      featureUnit: c.featureUnit,
      rangeLabel,
    }))
  }, [entries, rangeLabel])

  // 概览计数
  const modelCount = modelRows.length
  const catCount = categoryRows.length

  const cards: { key: ViewMode; label: string; value: number; unit: string; icon: typeof Database; hint: string }[] = [
    { key: 'model', label: '产品碳足迹数据', value: modelCount, unit: '个型号', icon: Database, hint: '跨经营单位取平均' },
    { key: 'measured', label: '实测值记录', value: entries.length, unit: '条', icon: Boxes, hint: '各经营单位实测明细' },
    { key: 'category', label: '覆盖细分类别', value: catCount, unit: '类', icon: CalendarRange, hint: '按细分类别聚合' },
  ]

  function onQuery() {
    setApplied({ ind, majorCat, mediumCat, granularity, from, to, year, unit, kw })
  }
  function onReset() {
    setInd('变压器'); setMajorCat(ALL_MAJOR); setMediumCat(ALL_MEDIUM); setGranularity('range'); setFrom(DEFAULT_FROM); setTo(DEFAULT_TO); setYear('2026'); setUnit(ALL_UNIT); setKw('')
    setApplied({ ind: '变压器', majorCat: ALL_MAJOR, mediumCat: ALL_MEDIUM, granularity: 'range', from: DEFAULT_FROM, to: DEFAULT_TO, year: '2026', unit: ALL_UNIT, kw: '' })
  }

  function toDetail(ind: string, majorCat: string, mediumCat: string, model: string, unit?: string) {
    const q = new URLSearchParams({ ind, majorCat, mediumCat, cat: mediumCat, model, ...(unit ? { unit } : {}) })
    router.push(`/carbon-footprint/database/accounting?${q.toString()}`)
  }

  const detailBtn = (ind: string, majorCat: string, mediumCat: string, model: string, unit?: string) => (
    <button
      type="button"
      onClick={() => toDetail(ind, majorCat, mediumCat, model, unit)}
      className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
    >
      因子详情 <ArrowUpRight className="size-3.5" />
    </button>
  )

  // 各视图的列与行
  const table = useMemo(() => {
    if (view === 'measured') {
      return {
        title: '实测值记录明细',
        desc: '各经营单位对同一型号的实测碳足迹明细；点击「因子详情」穿透至碳足迹核算查看数据来源与算法',
        columns: [
          { key: 'majorCat', label: '产品大类' },
          { key: 'mediumCat', label: '产品中类' },
          { key: 'model', label: '产品型号', className: 'font-mono text-xs text-foreground' },
          { key: 'unit', label: '经营单位' },
          { key: 'perUnit', label: '单台碳足迹', align: 'right', className: 'font-mono', render: (r: any) => <span>{r.perUnit.toLocaleString()} <span className="text-[10px] text-muted-foreground">kgCO2e/台</span></span> },
          { key: 'perFeature', label: '单位产品碳足迹', align: 'right', className: 'font-mono', render: (r: any) => <span>{r.perFeature.toFixed(4)} <span className="text-[10px] text-muted-foreground">kgCO2e/{r.featureUnit}</span></span> },
          { key: 'time', label: '数据时间', align: 'right', className: 'font-mono text-xs text-muted-foreground', render: () => rangeLabel },
          { key: 'action', label: '操作', align: 'right', render: (r: any) => detailBtn(r.ind, r.majorCat, r.mediumCat, r.model, r.unit) },
        ],
        rows: entries as any[],
      }
    }
    if (view === 'category') {
      return {
        title: '细分类别碳足迹',
        desc: '按细分产品类别聚合的单位产品碳足迹（该类别下各型号取平均），有几个类别展示几条',
        columns: [
          { key: 'majorCat', label: '产品大类' },
          { key: 'mediumCat', label: '产品中类' },
          { key: 'modelCount', label: '覆盖型号', align: 'right', className: 'font-mono', render: (r: any) => <span>{r.modelCount} <span className="text-[10px] text-muted-foreground">个</span></span> },
          { key: 'perFeature', label: '单位产品碳足迹', align: 'right', className: 'font-mono', render: (r: any) => <span>{r.perFeature.toFixed(4)} <span className="text-[10px] text-muted-foreground">kgCO2e/{r.featureUnit}</span></span> },
          { key: 'time', label: '数据时间', align: 'right', className: 'font-mono text-xs text-muted-foreground', render: () => rangeLabel },
        ],
        rows: categoryRows as any[],
      }
    }
    // model
    return {
      title: '产品碳足迹因子清单',
      desc: '同一型号跨经营单位取平均后的产品碳足迹因子，每个型号一条；点击「因子详情」穿透至碳足迹核算查看数据来源与算法',
      columns: [
        { key: 'majorCat', label: '产品大类' },
        { key: 'mediumCat', label: '产品中类' },
        { key: 'model', label: '产品型号', className: 'font-mono text-xs text-foreground' },
        { key: 'unitCount', label: '生产单位数', align: 'right', className: 'font-mono', render: (r: any) => <span>{r.unitCount} <span className="text-[10px] text-muted-foreground">家平均</span></span> },
        { key: 'perUnit', label: '单台碳足迹(均)', align: 'right', className: 'font-mono', render: (r: any) => <span>{r.perUnit.toLocaleString()} <span className="text-[10px] text-muted-foreground">kgCO2e/台</span></span> },
        { key: 'perFeature', label: '单位产品碳足迹(均)', align: 'right', className: 'font-mono', render: (r: any) => <span>{r.perFeature.toFixed(4)} <span className="text-[10px] text-muted-foreground">kgCO2e/{r.featureUnit}</span></span> },
        { key: 'time', label: '数据时间', align: 'right', className: 'font-mono text-xs text-muted-foreground', render: () => rangeLabel },
        { key: 'action', label: '操作', align: 'right', render: (r: any) => detailBtn(r.ind, r.majorCat, r.mediumCat, r.model) },
      ],
      rows: modelRows as any[],
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, entries, modelRows, categoryRows, rangeLabel])

  return (
    <div className="space-y-5">
      <Panel
        className="relative z-30"
        title="实景数据库"
        desc="已核算完成的产品型号碳足迹因子，作为最终成果沉淀，支持按时间检索、按产品与经营单位筛选，并可穿透追溯核算过程"
      >
        {/* 产品产业、产品大类与产品中类（种类）多级筛选 */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">产业</span>
            {industries.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setInd(p)
                  setMajorCat(ALL_MAJOR)
                  setMediumCat(ALL_MEDIUM)
                }}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  ind === p
                    ? 'border-primary bg-primary/15 text-primary font-medium'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-border/60" />

          {/* 产品大类 */}
          <Select
            label="产品大类"
            value={majorCat}
            onChange={(v) => {
              setMajorCat(v)
              setMediumCat(ALL_MEDIUM)
            }}
            options={majorCatOptions}
          />

          {/* 产品中类（种类） */}
          <Select
            label="产品中类"
            value={mediumCat}
            onChange={(v) => setMediumCat(v)}
            options={mediumCatOptions}
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <Select
            label="时间粒度"
            value={granularity}
            onChange={(v) => setGranularity(v as Granularity)}
            options={[
              { label: '整月', value: 'month' },
              { label: '按年', value: 'year' },
              { label: '跨月', value: 'range' },
            ]}
          />
          {granularity === 'year' ? (
            <Select label="年份" value={year} onChange={setYear} options={['2024', '2025', '2026'].map((y) => ({ label: `${y} 年`, value: y }))} />
          ) : granularity === 'month' ? (
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              月份
              <input type="month" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 rounded-md border border-border bg-input px-3 text-sm text-foreground" />
            </label>
          ) : (
            <div className="flex items-end gap-2">
              <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                起始月
                <input type="month" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 rounded-md border border-border bg-input px-3 text-sm text-foreground" />
              </label>
              <span className="pb-2 text-muted-foreground">至</span>
              <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                结束月
                <input type="month" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 rounded-md border border-border bg-input px-3 text-sm text-foreground" />
              </label>
            </div>
          )}
          <Select label="经营单位" value={unit} onChange={setUnit} options={unitOptions.map((u) => ({ label: u, value: u }))} />
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            型号 / 类别
            <input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="搜索型号或类别" className="h-9 w-44 rounded-md border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground" />
          </label>
          <button type="button" onClick={onQuery} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Search className="size-4" /> 查询
          </button>
          <button type="button" onClick={onReset} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <RotateCcw className="size-4" /> 重置
          </button>
        </div>
      </Panel>

      {/* 概览卡片：同时作为视图切换（点击即筛选） */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => {
          const on = view === c.key
          const Icon = c.icon
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setView(c.key)}
              aria-pressed={on}
              className={`relative overflow-hidden rounded-xl border p-4 text-left transition-colors ${
                on ? 'border-primary bg-primary/10 shadow-[0_0_0_1px_var(--primary)]' : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <div className="tech-radial pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className={`text-xs ${on ? 'text-primary' : 'text-muted-foreground'}`}>{c.label}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-mono text-2xl font-semibold text-foreground text-glow">{c.value}</span>
                    <span className="text-xs text-muted-foreground">{c.unit}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{c.hint}</p>
                </div>
                <span className={`flex size-9 items-center justify-center rounded-lg ${on ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  <Icon className="size-4" />
                </span>
              </div>
              <div className={`relative mt-3 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${on ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {on ? '当前视图' : '点击切换'}
              </div>
            </button>
          )
        })}
      </div>

      <Panel title={`${table.title} · ${applied.ind}`} desc={table.desc}>
        <DataTable columns={table.columns as any} rows={table.rows} />
      </Panel>
    </div>
  )
}

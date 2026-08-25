'use client'

import { useState } from 'react'
import {
  MonitorCog,
  AlertTriangle,
  Sigma,
  Database,
  LineChart as LineIcon,
  ChevronRight,
  ChevronDown,
  Building2,
  Package,
  Cog,
  FileText,
  Target,
  Factory,
  ArrowLeft,
  Gauge,
  Search,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge, DataTable } from '@/components/shared/primitives'
import { LineTrend } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { seedFactor } from '@/lib/variant'
import { orgTree, isLeaf, filterOrg, type OrgNode } from '@/lib/org'
import {
  indicators,
  indicatorTone,
  indicatorRawData,
  indicatorTrend,
  periodLabels,
  type Indicator,
} from '@/lib/indicators'
import { cn } from '@/lib/utils'

/* 指标三级划分：工厂综合 / 产品整体 / 工序详情 */
const levelGroups = [
  {
    key: 'factory',
    label: '工厂综合',
    icon: Building2,
    categories: ['综合能耗类', '碳排放类', '单位产值能耗类', '绿电与非化石类', '管理效率类'],
  },
  { key: 'product', label: '产品整体', icon: Package, categories: ['单位产品能耗类'] },
  { key: 'process', label: '工序详情', icon: Cog, categories: ['关键工序能耗类'] },
] as const

const zcIndicators = indicators.filter((i) => i.center === '集控')

export default function IndicatorPage() {
  const defaultOpen = orgTree.flatMap((l1) => [l1.name, ...(l1.children ?? []).map((l2) => `${l1.name}/${l2.name}`)])
  const [openNodes, setOpenNodes] = useState<string[]>(defaultOpen)
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null)
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month')
  const [keyword, setKeyword] = useState('')
  const filteredOrg = filterOrg(orgTree, keyword)

  const toggleNode = (key: string) =>
    setOpenNodes((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))

  const selectUnit = (key: string, name: string) => {
    if (selectedUnit === name && !selectedLevel && !selectedIndicator) {
      setSelectedUnit(null)
    } else {
      setSelectedUnit(name)
    }
    setSelectedLevel(null)
    setSelectedIndicator(null)
    if (!openNodes.includes(key)) toggleNode(key)
  }
  const selectLevel = (unitName: string, levelKey: string) => {
    if (selectedUnit === unitName && selectedLevel === levelKey && !selectedIndicator) {
      setSelectedLevel(null)
    } else {
      setSelectedUnit(unitName)
      setSelectedLevel(levelKey)
    }
    setSelectedIndicator(null)
  }
  const selectIndicator = (ind: Indicator) => setSelectedIndicator(ind)

  const groups = levelGroups.map((lg) => ({
    ...lg,
    items: zcIndicators.filter((i) => lg.categories.includes(i.category)),
  }))

  /* 右侧展示范围 */
  const levelItems = selectedLevel ? groups.find((g) => g.key === selectedLevel)?.items ?? [] : []
  const showIndicators = selectedIndicator ? [selectedIndicator] : selectedLevel ? levelItems : zcIndicators
  const abnormal = showIndicators.filter((i) => i.status === '异常')
  const normal = showIndicators.filter((i) => i.status !== '异常')
  const f = seedFactor(selectedUnit ?? '全部单位')

  /* 递归渲染组织架构单位节点 */
  const renderUnit = (node: OrgNode, path: string, level: number): React.ReactNode => {
    const key = path
    const open = openNodes.includes(key)
    const leaf = isLeaf(node)
    const active = selectedUnit === node.name && !selectedLevel && !selectedIndicator
    return (
      <div key={key}>
        <div className={cn('flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 transition-colors', active ? 'bg-primary/15 text-primary' : 'hover:bg-accent/40')}>
          <button type="button" onClick={() => toggleNode(key)} className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground">
            {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </button>
          <button type="button" onClick={() => selectUnit(key, node.name)} className="flex flex-1 items-center gap-2 text-left">
            {level === 1 ? <Factory className="size-3.5 shrink-0 text-primary" /> : <span className="size-1.5 shrink-0 rounded-full bg-primary/60" />}
            <span className={cn('truncate', level === 1 ? 'font-semibold' : level === 2 ? 'font-medium' : 'text-[13px]')}>{node.name}</span>
          </button>
        </div>
        {open && (
          <div className="ml-3 border-l border-border/60 pl-2">
            {leaf
              ? groups.map((lg) => renderLevel(lg, key, node.name))
              : (node.children ?? []).map((child) => renderUnit(child, `${key}/${child.name}`, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderLevel = (lg: (typeof groups)[number], unitKey: string, unitName: string): React.ReactNode => {
    const key = `${unitKey}#${lg.key}`
    const open = openNodes.includes(key)
    const active = selectedUnit === unitName && selectedLevel === lg.key && !selectedIndicator
    const LevelIcon = lg.icon
    return (
      <div key={key}>
        <div className={cn('flex w-full items-center gap-1.5 rounded-md py-1 pr-2 transition-colors', active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground')}>
          <button type="button" onClick={() => toggleNode(key)} className="shrink-0 rounded p-0.5">
            {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
          </button>
          <button type="button" onClick={() => selectLevel(unitName, lg.key)} className="flex flex-1 items-center gap-2 text-left">
            <LevelIcon className="size-3.5 shrink-0 text-primary" />
            <span className="font-medium">{lg.label}</span>
            <span className="ml-auto text-xs text-muted-foreground">{lg.items.length}</span>
          </button>
        </div>
        {open && (
          <div className="ml-3 border-l border-border/60 pl-2">
            {lg.items.map((ind) => (
              <button
                key={ind.id}
                type="button"
                onClick={() => selectIndicator(ind)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors',
                  selectedIndicator?.id === ind.id ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
                )}
              >
                <span className={cn('size-1.5 shrink-0 rounded-full', ind.status === '异常' ? 'bg-[var(--destructive)]' : ind.status === '优秀' ? 'bg-[var(--success)]' : 'bg-primary')} />
                <span className="truncate">{ind.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* ============ 左侧树：组织架构 → 指标级别 → 指标 ============ */}
      <Panel className="self-start" bodyClassName="px-1">
        <PanelTitle title="指标目录" subtitle="单位层级 · 指标级别 · 指标" icon={MonitorCog} />
        <div className="mb-2 flex items-center gap-1.5 rounded-md border border-border bg-panel px-2.5 py-1.5">
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索单位 / 指标"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="text-sm">{filteredOrg.map((l1) => renderUnit(l1, l1.name, 1))}</div>
      </Panel>

      {/* ============ 右侧：概况卡片 / 指标详情 ============ */}
      <div className="grid content-start gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="size-3.5 text-[var(--destructive)]" />
            异常指标 {zcIndicators.filter((i) => i.status === '异常').length} 项
          </div>
          <TimeRange />
        </div>
        {selectedIndicator && (
          <IndicatorDetail ind={selectedIndicator} f={f} period={period} setPeriod={setPeriod} onBack={() => setSelectedIndicator(null)} />
        )}

        {!selectedIndicator && (
          <>
            {abnormal.length > 0 && (
              <Panel>
                <PanelTitle title="异常指标集" subtitle="波动幅度过大、偏离基准较大的指标归集呈现" icon={AlertTriangle} />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {abnormal.map((ind) => (
                    <IndicatorCard key={ind.id} ind={ind} f={f} onClick={() => selectIndicator(ind)} danger />
                  ))}
                </div>
              </Panel>
            )}
            <Panel>
              <PanelTitle
                title={selectedLevel ? groups.find((g) => g.key === selectedLevel)?.label ?? '指标概况' : `${selectedUnit ?? '全部单位'} · 指标概况`}
                subtitle="数据块展示全部指标、同比变化与标杆对比，点击卡片查看详情"
                icon={MonitorCog}
                action={<Badge tone="primary">{showIndicators.length} 项</Badge>}
              />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {normal.map((ind) => (
                  <IndicatorCard key={ind.id} ind={ind} f={f} onClick={() => selectIndicator(ind)} />
                ))}
                {normal.length === 0 && <div className="col-span-full py-8 text-center text-sm text-muted-foreground">暂无指标数据</div>}
              </div>
            </Panel>
          </>
        )}
      </div>
    </div>
  )
}

/* ============ 指标概况卡片（数据块） ============ */
function IndicatorCard({ ind, f, onClick, danger }: { ind: Indicator; f: number; onClick: () => void; danger?: boolean }) {
  const current = ind.current != null ? +(ind.current * f).toFixed(ind.current < 10 ? 2 : 1) : ind.current
  const delta = ind.current != null && ind.base != null ? (((ind.current - ind.base) / ind.base) * 100).toFixed(1) : null
  const good = ind.status === '优秀'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group rounded-xl border p-4 text-left transition-colors',
        danger ? 'border-[var(--destructive)]/40 bg-[var(--destructive)]/5 hover:bg-[var(--destructive)]/10' : 'border-border bg-card hover:border-primary/50',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{ind.name}</span>
        <StatusBadge tone={indicatorTone(ind.status)}>
          {ind.status === '异常' && <AlertTriangle className="mr-1 inline size-3" />}
          {ind.status}
        </StatusBadge>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-mono text-2xl font-semibold text-foreground text-glow">{current}</span>
        <span className="text-xs text-muted-foreground">{ind.unit}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className={cn('font-mono', good ? 'text-[var(--success)]' : delta && parseFloat(delta) > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>
          {delta != null ? (parseFloat(delta) > 0 ? '▲' : '▼') + ' ' + Math.abs(parseFloat(delta)) + '% 较基准' : '—'}
        </span>
        <span>标杆 {ind.base}</span>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
        查看详情 <ChevronRight className="size-3" />
      </div>
    </button>
  )
}

/* ============ 指标详情（含异常判定依据） ============ */
function IndicatorDetail({
  ind,
  f,
  period,
  setPeriod,
  onBack,
}: {
  ind: Indicator
  f: number
  period: 'month' | 'quarter' | 'year'
  setPeriod: (p: 'month' | 'quarter' | 'year') => void
  onBack: () => void
}) {
  const scaled = ind.current != null ? +(ind.current * f).toFixed(ind.current < 10 ? 2 : 1) : ind.current
  const dp = periodLabels[period]
  const rawRows = indicatorRawData(ind, dp)
  const trendRows = indicatorTrend(ind, dp)

  const vsBase = ind.current != null && ind.base != null ? (((ind.current - ind.base) / ind.base) * 100) : null
  const vsTarget = ind.current != null && ind.target != null ? (((ind.current - ind.target) / ind.target) * 100) : null
  const overTarget = vsTarget != null && vsTarget > 0
  const overBase = vsBase != null && vsBase > 0
  const yoy = ((ind.id * 7 + 13) % 21) - 10
  const mom = ((ind.id * 5 + 7) % 13) - 6
  const yoyVal = ind.current != null ? +(ind.current * yoy / 100).toFixed(ind.current < 10 ? 2 : 1) : 0
  const momVal = ind.current != null ? +(ind.current * mom / 100).toFixed(ind.current < 10 ? 2 : 1) : 0

  return (
    <>
      <button type="button" onClick={onBack} className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="size-4" /> 返回指标概况
      </button>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">{ind.name}</h2>
                <StatusBadge tone={indicatorTone(ind.status)}>
                  {ind.status === '异常' && <AlertTriangle className="mr-1 inline size-3.5" />}
                  {ind.status}
                </StatusBadge>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge tone="primary">{ind.category}</Badge>
                <span>覆盖范围：{ind.scope}</span>
                <span>统计周期：{ind.freq}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">当前值</p>
            <p className="font-mono text-4xl font-semibold text-foreground text-glow">
              {scaled}
              <span className="ml-1 text-sm font-normal text-muted-foreground">{ind.unit}</span>
            </p>
          </div>
        </div>

        {/* 异常判定依据 */}
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-panel px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Target className="size-3.5 text-primary" /> 同比 / 环比</div>
            <div className="mt-1 grid gap-1.5">
              <div className="flex items-baseline gap-2">
                <span className="w-7 shrink-0 text-xs text-muted-foreground">同比</span>
                <span className={cn('font-mono text-xl text-foreground', yoy > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{yoy > 0 ? '+' : ''}{yoyVal}<span className="ml-1 text-xs">{ind.unit}</span></span>
                <span className={cn('font-mono text-xs', yoy > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{yoy > 0 ? '▲' : '▼'} {Math.abs(yoy)}%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="w-7 shrink-0 text-xs text-muted-foreground">环比</span>
                <span className={cn('font-mono text-xl text-foreground', mom > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{mom > 0 ? '+' : ''}{momVal}<span className="ml-1 text-xs">{ind.unit}</span></span>
                <span className={cn('font-mono text-xs', mom > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{mom > 0 ? '▲' : '▼'} {Math.abs(mom)}%</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-panel px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Target className="size-3.5 text-[var(--warning)]" /> 基准值（标杆）</div>
            <p className="mt-1 font-mono text-xl text-foreground">{ind.base}<span className="ml-1 text-xs text-muted-foreground">{ind.unit}</span></p>
            {vsBase != null && <p className={cn('mt-1 text-xs font-mono', overBase ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{overBase ? '▲ 超出' : '▼ 优于'} {Math.abs(vsBase).toFixed(1)}%</p>}
          </div>
          <div className="rounded-lg border border-border bg-panel px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Target className="size-3.5 text-[var(--success)]" /> 目标值</div>
            <p className="mt-1 font-mono text-xl text-foreground">{ind.target}<span className="ml-1 text-xs text-muted-foreground">{ind.unit}</span></p>
            {vsTarget != null && <p className={cn('mt-1 text-xs font-mono', overTarget ? 'text-[var(--warning)]' : 'text-[var(--success)]')}>{overTarget ? '▲ 超出' : '▼ 优于'} {Math.abs(vsTarget).toFixed(1)}%</p>}
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-border bg-panel px-4 py-3 text-sm">
          <span className="font-medium text-foreground">异常判定依据：</span>
          <span className="text-muted-foreground">
            {ind.status === '异常' ? (
              overTarget
                ? `当前值超出目标值 ${vsTarget!.toFixed(1)}%，判定为异常（与目标值对标）`
                : overBase
                  ? `当前值超出基准值 ${vsBase!.toFixed(1)}%，判定为异常（与基准值对标）`
                  : '偏离基准较大，判定为异常'
            ) : ind.status === '优秀' ? (
              `当前值优于基准值 ${Math.abs(vsBase ?? 0).toFixed(1)}%，判定为优秀`
            ) : (
              '当前值处于基准值与目标值之间，判定为正常'
            )}
          </span>
        </div>
      </Panel>

      <Panel>
        <PanelTitle title="计算说明" subtitle="指标定义 · 计算公式" icon={Sigma} />
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-panel p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><Sigma className="size-4 text-primary" /> 计算公式</div>
            <p className="rounded-md bg-background/60 px-3 py-2 font-mono text-sm text-primary">{ind.formula}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{ind.desc}</p>
          </div>
          <div className="rounded-lg border border-border bg-panel p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><FileText className="size-4 text-primary" /> 指标定义</div>
            <p className="text-xs leading-relaxed text-muted-foreground">{ind.definition}</p>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="mb-3 flex items-center justify-between gap-3">
          <PanelTitle title="指标变化曲线" icon={LineIcon} />
          <div className="inline-flex overflow-hidden rounded-md border border-border">
            {(['month', 'quarter', 'year'] as const).map((p) => (
              <button key={p} type="button" onClick={() => setPeriod(p)} className={cn('px-3 py-1.5 text-xs transition-colors', period === p ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground')}>
                {{ month: '按月', quarter: '按季', year: '按年' }[p]}
              </button>
            ))}
          </div>
        </div>
        <LineTrend data={trendRows} keys={['实际值', '目标值']} height={240} />
      </Panel>

      <Panel>
        <PanelTitle title="指标计算原始数据" subtitle="分子 / 分母 / 结果 · 可追溯" icon={Database} />
        <DataTable
          columns={[
            { key: 'period', label: '统计周期' },
            { key: 'molecule', label: '分子', align: 'right', className: 'font-mono' },
            { key: 'denominator', label: '分母', align: 'right', className: 'font-mono' },
            { key: 'value', label: `结果(${ind.unit})`, align: 'right', className: 'font-mono text-primary' },
            { key: 'source', label: '数据来源', className: 'text-muted-foreground' },
          ]}
          rows={rawRows}
        />
      </Panel>
    </>
  )
}

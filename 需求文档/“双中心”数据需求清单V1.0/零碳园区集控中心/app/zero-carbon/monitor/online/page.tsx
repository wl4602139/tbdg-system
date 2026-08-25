'use client'

import { useState } from 'react'
import { Activity, Sun, LineChart as LineIcon, TableProperties, ChevronRight, ChevronDown, Factory, Cog, Gauge, MonitorCog, Zap, Droplets, Flame, TrendingUp, Leaf, Search, BarChart3 } from 'lucide-react'
import { Panel, PanelTitle, DataTable, KpiCard, StatusBadge, Badge } from '@/components/shared/primitives'
import { AreaTrend, LineTrend } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { seedFactor } from '@/lib/variant'
import { orgTree, isLeaf, filterOrg, findOrgNode, type OrgNode } from '@/lib/org'
import { cn } from '@/lib/utils'

/* 产线 → 工序 → 设备（设备可能没有） */
type LineNode = { name: string; children?: LineNode[] }

const lineStructure: LineNode[] = [
  {
    name: '变压器一线',
    children: [
      { name: '绕线工序', children: [{ name: '绕线机' }, { name: '真空干燥炉' }] },
      { name: '干燥工序', children: [{ name: '干燥炉' }] },
      { name: '试验工序', children: [{ name: '试验台' }] },
    ],
  },
  {
    name: '变压器二线',
    children: [
      { name: '绕线工序', children: [{ name: '绕线机' }] },
      { name: '装配工序' },
    ],
  },
  { name: '电缆拉丝线', children: [{ name: '拉丝工序', children: [{ name: '拉丝机' }, { name: '退火炉' }] }] },
  { name: '电缆交联线', children: [{ name: '交联工序', children: [{ name: '交联机' }] }] },
  {
    name: '开关装配线',
    children: [{ name: '装配工序' }, { name: '试验工序', children: [{ name: '试验台' }] }],
  },
]

type SelectedItem = { type: 'line' | 'process' | 'device'; name: string }

export default function OnlinePage() {
  const [openNodes, setOpenNodes] = useState<string[]>(orgTree.map((n) => n.name))
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart')
  const [keyword, setKeyword] = useState('')
  const filteredOrg = filterOrg(orgTree, keyword)

  const toggleNode = (key: string) =>
    setOpenNodes((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))

  const selectUnit = (key: string, name: string) => {
    if (selectedUnit === name && !selectedItem) {
      setSelectedUnit(null)
    } else {
      setSelectedUnit(name)
    }
    setSelectedItem(null)
    if (!openNodes.includes(key)) toggleNode(key)
  }
  const selectItem = (type: SelectedItem['type'], name: string) => {
    if (selectedItem?.name === name && selectedItem?.type === type) {
      setSelectedItem(null)
    } else {
      setSelectedItem({ type, name })
    }
  }

  const unitKey = selectedUnit ?? '全部单位'
  const f = seedFactor(unitKey)
  const seed = Math.round(f * 100)

  /* ===== 各层级指标对比 ===== */
  const selectedNode = selectedUnit ? findOrgNode(selectedUnit) : null
  const isNonLeaf = !!selectedNode && !isLeaf(selectedNode)
  const childNodes = isNonLeaf && selectedNode ? (selectedNode.children ?? []) : []

  const unitCols = [
    { key: '总负荷', label: '总负荷(kW)', better: 'low' as const },
    { key: '综合能耗', label: '综合能耗(tce)', better: 'low' as const },
    { key: '天然气', label: '天然气(m³/h)', better: 'low' as const },
    { key: '碳排放', label: '碳排放(tCO₂)', better: 'low' as const },
    { key: '绿电占比', label: '绿电占比(%)', better: 'high' as const },
  ]
  const lineCols = [
    { key: '实时功率', label: '实时功率(kW)', better: 'low' as const },
    { key: '今日用电', label: '今日用电(kWh)', better: 'low' as const },
    { key: '综合能耗', label: '综合能耗(tce)', better: 'low' as const },
    { key: '负荷率', label: '负荷率(%)', better: 'low' as const },
  ]
  const processCols = [
    { key: '实时功率', label: '实时功率(kW)', better: 'low' as const },
    { key: '今日用电', label: '今日用电(kWh)', better: 'low' as const },
    { key: '单耗', label: '单耗(kWh/产量)', better: 'low' as const },
  ]
  const deviceCols = [
    { key: '实时功率', label: '实时功率(kW)', better: 'low' as const },
    { key: '今日用电', label: '今日用电(kWh)', better: 'low' as const },
    { key: '负荷率', label: '负荷率(%)', better: 'low' as const },
  ]

  const makeRow = (name: string, k: number) => {
    const cf = seedFactor(`${k}-${name}`)
    return {
      name,
      总负荷: Math.round(16000 + cf * 10000),
      综合能耗: +(2.5 + cf * 3).toFixed(1),
      天然气: Math.round(150 + cf * 220),
      碳排放: Math.round(600 + cf * 700),
      绿电占比: Math.round(20 + cf * 50),
      实时功率: Math.round(300 + cf * 600),
      今日用电: Math.round(2200 + cf * 4200),
      单耗: +(0.3 + cf * 0.4).toFixed(2),
      负荷率: Math.round(50 + cf * 40),
    }
  }

  const firstLevelCompare = orgTree.map((l1) => makeRow(l1.name, 1))
  const childCompare = childNodes.map((child) => makeRow(child.name, 2))
  const lineCompare = lineStructure.map((line) => makeRow(line.name, 3))

  const findLineNode = (name: string): LineNode | null => {
    for (const line of lineStructure) {
      if (line.name === name) return line
      for (const proc of line.children ?? []) {
        if (proc.name === name) return proc
      }
    }
    return null
  }
  const selectedLineNode = selectedItem?.type === 'line' ? lineStructure.find((l) => l.name === selectedItem.name) ?? null : null
  const selectedProcessNode = selectedItem?.type === 'process' ? findLineNode(selectedItem.name) : null
  const processCompare = (selectedLineNode?.children ?? []).map((p) => makeRow(p.name, 4))
  const deviceCompare = (selectedProcessNode?.children ?? []).map((d) => makeRow(d.name, 5))

  /* 组织架构节点 */
  const renderOrg = (node: OrgNode, path: string, level: number): React.ReactNode => {
    const key = path
    const open = openNodes.includes(key)
    const leaf = isLeaf(node)
    const active = selectedUnit === node.name && !selectedItem
    const uf = seedFactor(node.name)
    const load = Math.round(18000 + uf * 9000)
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
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{load.toLocaleString()} kW</span>
        </div>
        {open && (
          <div className="ml-3 border-l border-border/60 pl-2">
            {leaf
              ? lineStructure.map((line) => renderLine(line, `${key}/${line.name}`))
              : (node.children ?? []).map((child) => renderOrg(child, `${key}/${child.name}`, level + 1))}
          </div>
        )}
      </div>
    )
  }

  /* 产线 / 工序 / 设备 节点 */
  const renderLine = (node: LineNode, path: string): React.ReactNode => {
    const key = path
    const open = openNodes.includes(key)
    const hasChildren = !!node.children?.length
    const type: SelectedItem['type'] = node.name.includes('线') ? 'line' : hasChildren ? 'process' : 'device'
    const active = selectedItem?.name === node.name
    const Icon = type === 'line' ? Gauge : type === 'process' ? Cog : MonitorCog
    return (
      <div key={key}>
        <div className={cn('flex w-full items-center gap-1.5 rounded-md py-1 pr-2 transition-colors', active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground')}>
          <button
            type="button"
            onClick={() => (hasChildren ? toggleNode(key) : selectItem(type, node.name))}
            className="shrink-0 rounded p-0.5"
          >
            {hasChildren ? (open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />) : <span className="inline-block size-1.5 rounded-full bg-[var(--success)]" />}
          </button>
          <button type="button" onClick={() => selectItem(type, node.name)} className="flex flex-1 items-center gap-2 text-left">
            <Icon className="size-3 shrink-0 text-primary" />
            <span className="truncate text-[13px]">{node.name}</span>
          </button>
        </div>
        {open && hasChildren && (
          <div className="ml-3 border-l border-border/60 pl-2">
            {node.children!.map((child) => renderLine(child, `${key}/${child.name}`))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* ============ 左侧树 ============ */}
      <Panel className="self-start" bodyClassName="px-1">
        <PanelTitle title="监测对象" subtitle="单位 · 产线 · 工序 · 设备" icon={MonitorCog} />
        <div className="mb-2 flex items-center gap-1.5 rounded-md border border-border bg-panel px-2.5 py-1.5">
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索单位 / 产线 / 工序 / 设备"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="text-sm">{filteredOrg.map((l1) => renderOrg(l1, l1.name, 1))}</div>
      </Panel>

      {/* ============ 右侧 ============ */}
      <div className="grid content-start gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="size-3.5 text-[var(--success)]" />
            实时数据 · 各单位汇总能源使用情况
          </div>
          <TimeRange />
        </div>

        {/* 选中设备：多能源详情 */}
        {selectedItem?.type === 'device' && <EnergyDetail name={selectedItem.name} type={selectedItem.type} unit={selectedUnit ?? ''} viewMode={viewMode} setViewMode={setViewMode} />}

        {/* 非设备选中：关键指标块 + 对比 + 汇总 */}
        {selectedItem?.type !== 'device' && (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
              <KpiCard label="碳排放量" value={(3860 * f).toFixed(0)} unit="tCO₂" delta="+5.6%" up icon={Leaf} />
              <KpiCard label="综合能耗" value={(12.8 * f).toFixed(1)} unit="tce" delta="+4.1%" up icon={TrendingUp} />
              <KpiCard label="绿电占比" value="38.6" unit="%" delta="+3.2%" up icon={Sun} />
              <KpiCard label="用电量" value={(186.4 * f).toFixed(1)} unit="万kWh" delta="+4.6%" up icon={Zap} />
              <KpiCard label="天然气用量" value={(9.8 * f).toFixed(1)} unit="万m³" delta="+3.5%" up icon={Flame} />
              <KpiCard label="用水量" value={(2.3 * f).toFixed(1)} unit="万m³" delta="-2.4%" up={false} icon={Droplets} />
            </div>

            {/* 对比表格（关键指标块下面） */}
            {selectedItem?.type === 'process' && (
              <CompareTable title={`${selectedUnit ?? ''} · ${selectedItem.name} · 设备指标对比`} subtitle="该工序下各设备指标对比" cols={deviceCols} rows={deviceCompare} />
            )}
            {selectedItem?.type === 'line' && (
              <CompareTable title={`${selectedUnit ?? ''} · ${selectedItem.name} · 工序指标对比`} subtitle="该产线下各工序指标对比" cols={processCols} rows={processCompare} />
            )}
            {!selectedItem && selectedUnit && !isNonLeaf && (
              <CompareTable title={`${selectedUnit} · 产线指标对比`} subtitle="该企业下各产线指标对比" cols={lineCols} rows={lineCompare} />
            )}
            {!selectedItem && isNonLeaf && (
              <CompareTable title={`${selectedUnit} · 子单位指标对比`} subtitle="各子单位指标对比" cols={unitCols} rows={childCompare} />
            )}
            {!selectedItem && !selectedUnit && (
              <CompareTable title="一级公司指标对比" subtitle="各一级公司指标对比" cols={unitCols} rows={firstLevelCompare} />
            )}

            <Panel>
              <PanelTitle title={`${selectedUnit ?? '全部单位'} · 汇总能源使用情况`} subtitle="本级单位整体 + 下属单位累加的能耗实时数据（水 / 电 / 气）" icon={MonitorCog} action={<Badge tone="primary">实时汇总</Badge>} />
              <AreaTrend
                data={[
                  { month: '00:00', 电: Math.round(620 * f), 气: Math.round(210 * f), 水: Math.round(90 * f) },
                  { month: '03:00', 电: Math.round(580 * f), 气: Math.round(190 * f), 水: Math.round(82 * f) },
                  { month: '06:00', 电: Math.round(690 * f), 气: Math.round(240 * f), 水: Math.round(96 * f) },
                  { month: '09:00', 电: Math.round(780 * f), 气: Math.round(280 * f), 水: Math.round(105 * f) },
                  { month: '12:00', 电: Math.round(880 * f), 气: Math.round(320 * f), 水: Math.round(120 * f) },
                  { month: '15:00', 电: Math.round(820 * f), 气: Math.round(300 * f), 水: Math.round(115 * f) },
                  { month: '18:00', 电: Math.round(760 * f), 气: Math.round(260 * f), 水: Math.round(98 * f) },
                  { month: '21:00', 电: Math.round(700 * f), 气: Math.round(230 * f), 水: Math.round(90 * f) },
                ]}
                keys={['电', '气', '水']}
                xKey="month"
                stacked
                height={280}
              />
              <div className="mt-4">
                <DataTable
                  columns={[
                    { key: 'name', label: '能源介质' },
                    { key: 'power', label: '实时功率/流量', align: 'right', className: 'font-mono' },
                    { key: 'today', label: '今日累计', align: 'right', className: 'font-mono' },
                    { key: 'load', label: '占比', align: 'right', className: 'font-mono' },
                  ]}
                  rows={[
                    { name: '电', power: `${(12860 * f).toFixed(0)} kW`, today: `${(186.4 * f).toFixed(1)} 万kWh`, load: '68%' },
                    { name: '天然气', power: `${(820 * f).toFixed(0)} m³/h`, today: `${(9.8 * f).toFixed(1)} 万m³`, load: '18%' },
                    { name: '水', power: `${(310 * f).toFixed(0)} t/h`, today: `${(2.3 * f).toFixed(1)} 万m³`, load: '9%' },
                    { name: '蒸汽', power: `${(120 * f).toFixed(0)} t/h`, today: `${(0.9 * f).toFixed(1)} 万t`, load: '5%' },
                  ]}
                />
              </div>
            </Panel>
          </>
        )}
      </div>
    </div>
  )
}

/* ============ 指标对比表格 ============ */
function CompareTable({ title, subtitle, cols, rows }: { title: string; subtitle: string; cols: { key: string; label: string; better: 'low' | 'high' }[]; rows: any[] }) {
  const colStats = cols.map((col) => {
    const vals = rows.map((r) => r[col.key] as number)
    const best = col.better === 'low' ? Math.min(...vals) : Math.max(...vals)
    const worst = col.better === 'low' ? Math.max(...vals) : Math.min(...vals)
    return { ...col, best, worst }
  })
  return (
    <Panel>
      <PanelTitle title={title} subtitle={`${subtitle}（绿=最优 ★，橙=最差 ⚠）`} icon={BarChart3} />
      <DataTable
        columns={[
          { key: 'name', label: '名称' },
          ...colStats.map((col) => ({
            key: col.key,
            label: col.label,
            align: 'right' as const,
            render: (r: any) => {
              const v = r[col.key]
              const isBest = v === col.best
              const isWorst = v === col.worst
              return <span className={cn('font-mono', isBest ? 'text-[var(--success)] font-medium' : isWorst ? 'text-[var(--warning)] font-medium' : 'text-foreground')}>{v}{isBest ? ' ★' : isWorst ? ' ⚠' : ''}</span>
            },
          })),
        ]}
        rows={rows}
      />
    </Panel>
  )
}

/* ============ 工序/设备 多能源详情 ============ */
function EnergyDetail({
  name,
  type,
  unit,
  viewMode,
  setViewMode,
}: {
  name: string
  type: 'line' | 'process' | 'device'
  unit: string
  viewMode: 'chart' | 'table'
  setViewMode: (v: 'chart' | 'table') => void
}) {
  const f = seedFactor(name)
  const typeLabel = type === 'line' ? '产线' : type === 'process' ? '工序' : '设备'

  const elec = {
    power: Math.round((380 + f * 220)),
    today: Math.round((9200 * f)),
    peak: Math.round((9200 * f * 0.32)),
    flat: Math.round((9200 * f * 0.41)),
    valley: Math.round((9200 * f * 0.27)),
    load: Math.round(55 + f * 35),
  }
  const water = { flow: +(12 * f).toFixed(1), today: Math.round(280 * f), pressure: +(0.4 * f).toFixed(2) }
  const gas = { flow: +(45 * f).toFixed(1), today: Math.round(1080 * f) }
  const totalTce = +(elec.power * 0.0001229 + gas.flow * 0.00133 + water.flow * 0.0000857).toFixed(2)

  const series = [
    { month: '00:00', 电: Math.round(elec.power * 0.7), 气: Math.round(gas.flow * 0.6), 水: Math.round(water.flow * 0.5) },
    { month: '03:00', 电: Math.round(elec.power * 0.6), 气: Math.round(gas.flow * 0.5), 水: Math.round(water.flow * 0.5) },
    { month: '06:00', 电: Math.round(elec.power * 0.8), 气: Math.round(gas.flow * 0.7), 水: Math.round(water.flow * 0.6) },
    { month: '09:00', 电: Math.round(elec.power * 1.1), 气: Math.round(gas.flow * 1.0), 水: Math.round(water.flow * 0.9) },
    { month: '12:00', 电: Math.round(elec.power * 1.2), 气: Math.round(gas.flow * 1.1), 水: Math.round(water.flow * 1.0) },
    { month: '15:00', 电: Math.round(elec.power * 1.1), 气: Math.round(gas.flow * 1.0), 水: Math.round(water.flow * 0.9) },
    { month: '18:00', 电: Math.round(elec.power * 0.9), 气: Math.round(gas.flow * 0.8), 水: Math.round(water.flow * 0.7) },
    { month: '21:00', 电: Math.round(elec.power * 0.8), 气: Math.round(gas.flow * 0.7), 水: Math.round(water.flow * 0.6) },
  ]

  return (
    <>
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">{unit} · {name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{typeLabel} · 多能源实时监测（电 / 水 / 天然气）</p>
            </div>
          </div>
          <div className="inline-flex overflow-hidden rounded-md border border-border">
            <button type="button" onClick={() => setViewMode('chart')} className={cn('flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors', viewMode === 'chart' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground')}>
              <LineIcon className="size-3.5" /> 图形
            </button>
            <button type="button" onClick={() => setViewMode('table')} className={cn('flex items-center gap-1.5 border-l border-border px-3 py-1.5 text-xs transition-colors', viewMode === 'table' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground')}>
              <TableProperties className="size-3.5" /> 表格
            </button>
          </div>
        </div>

        {/* 汇总 */}
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-panel px-4 py-3">
            <p className="text-xs text-muted-foreground">综合能耗（折标煤）</p>
            <p className="mt-1 font-mono text-xl text-foreground text-glow">{totalTce}<span className="ml-1 text-xs text-muted-foreground">tce/h</span></p>
          </div>
          <div className="rounded-lg border border-border bg-panel px-4 py-3">
            <p className="text-xs text-muted-foreground">综合功率</p>
            <p className="mt-1 font-mono text-xl text-foreground">{elec.power}<span className="ml-1 text-xs text-muted-foreground">kW</span></p>
          </div>
          <div className="rounded-lg border border-border bg-panel px-4 py-3">
            <p className="text-xs text-muted-foreground">用能介质</p>
            <p className="mt-1 font-mono text-xl text-foreground">3<span className="ml-1 text-xs text-muted-foreground">种</span></p>
          </div>
          <div className="rounded-lg border border-border bg-panel px-4 py-3">
            <p className="text-xs text-muted-foreground">负荷率</p>
            <p className={cn('mt-1 font-mono text-xl', elec.load > 88 ? 'text-[var(--warning)]' : 'text-foreground')}>{elec.load}<span className="ml-1 text-xs text-muted-foreground">%</span></p>
          </div>
        </div>
      </Panel>

      {/* 明细：三种能源 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel>
          <PanelTitle title="电" subtitle="实时功率 · 峰平谷" icon={Zap} />
          <div className="mb-3 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold text-foreground text-glow">{elec.power}</span>
            <span className="text-xs text-muted-foreground">kW</span>
          </div>
          <DataTable
            columns={[
              { key: 'k', label: '项目' },
              { key: 'v', label: '数值', align: 'right', className: 'font-mono' },
            ]}
            rows={[
              { k: '今日用电', v: `${elec.today.toLocaleString()} kWh` },
              { k: '峰电量', v: `${elec.peak.toLocaleString()} kWh` },
              { k: '平电量', v: `${elec.flat.toLocaleString()} kWh` },
              { k: '谷电量', v: `${elec.valley.toLocaleString()} kWh` },
              { k: '负荷率', v: `${elec.load}%` },
            ]}
          />
        </Panel>
        <Panel>
          <PanelTitle title="水" subtitle="瞬时流量 · 累计流量 · 水压" icon={Droplets} />
          <div className="mb-3 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold text-foreground text-glow">{water.flow}</span>
            <span className="text-xs text-muted-foreground">t/h</span>
          </div>
          <DataTable
            columns={[
              { key: 'k', label: '项目' },
              { key: 'v', label: '数值', align: 'right', className: 'font-mono' },
            ]}
            rows={[
              { k: '瞬时流量', v: `${water.flow} t/h` },
              { k: '累计流量', v: `${water.today.toLocaleString()} t` },
              { k: '水压', v: `${water.pressure} MPa` },
            ]}
          />
        </Panel>
        <Panel>
          <PanelTitle title="天然气" subtitle="瞬时流量 · 累计流量" icon={Flame} />
          <div className="mb-3 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold text-foreground text-glow">{gas.flow}</span>
            <span className="text-xs text-muted-foreground">m³/h</span>
          </div>
          <DataTable
            columns={[
              { key: 'k', label: '项目' },
              { key: 'v', label: '数值', align: 'right', className: 'font-mono' },
            ]}
            rows={[
              { k: '瞬时流量', v: `${gas.flow} m³/h` },
              { k: '累计流量', v: `${gas.today.toLocaleString()} m³` },
            ]}
          />
        </Panel>
      </div>

      {/* 趋势 */}
      <Panel>
        <PanelTitle title="多能源实时趋势" subtitle="电 / 水 / 天然气" icon={LineIcon} />
        {viewMode === 'chart' ? (
          <LineTrend data={series} keys={['电', '气', '水']} height={240} />
        ) : (
          <DataTable
            columns={[
              { key: 'month', label: '时段' },
              { key: '电', label: '电(kW)', align: 'right', className: 'font-mono' },
              { key: '气', label: '气(m³/h)', align: 'right', className: 'font-mono' },
              { key: '水', label: '水(t/h)', align: 'right', className: 'font-mono' },
            ]}
            rows={series}
          />
        )}
      </Panel>
    </>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const axisStyle = { fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }
const gridColor = 'var(--grid-line)'

/* 特变电工 8 大能源介质官方标准色表 */
export const ENERGY_COLORS = {
  total: '#2C7CFF',        // 总用电量
  grid: '#41C0FF',         // 市电量
  greenPower: '#00D492',   // 直供绿电量
  water: '#10C4CE',        // 水资源
  gas: '#FF6536',          // 天然气
  steam: '#FFBA00',        // 蒸汽
  diesel: '#8E73ED',       // 油消耗
  nitrogen: '#4F39F6',     // 液氮
} as const

/* 特变电工 TOU 4 段分时电量官方标准色表 */
export const TOU_COLORS = {
  sharp: '#FF6536',        // 尖
  peak: '#FFBA00',         // 峰
  flat: '#2C7CFF',         // 平
  valley: '#10C4CE',       // 谷
} as const

export const chartColors = [
  '#2C7CFF',
  '#00D492',
  '#FFBA00',
  '#10C4CE',
  '#8E73ED',
]
export const donutColors = chartColors

const tooltipStyle = {
  background: 'rgba(11, 21, 40, 0.95)',
  border: '1px solid rgba(56, 189, 248, 0.4)',
  borderRadius: 8,
  color: '#f8fafc',
  fontSize: 12,
  boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.6)',
}

const tooltipLabelStyle = {
  color: '#f8fafc',
  fontWeight: 600,
  fontSize: 12,
  marginBottom: 4,
}

export type SeriesKey = string | { key: string; name?: string; color?: string; yAxisId?: 'left' | 'right' }
function normKeys(keys?: SeriesKey[]) {
  return (keys ?? []).map((k, i) =>
    typeof k === 'string'
      ? { key: k, name: k, color: chartColors[i % chartColors.length], yAxisId: 'left' as const }
      : { key: k.key, name: k.name ?? k.key, color: k.color ?? chartColors[i % chartColors.length], yAxisId: k.yAxisId ?? 'left' },
  )
}

/** 智能判断颜色亮度，防止暗深色线条在暗色浮层内不可见 */
function isColorDark(colorStr?: string): boolean {
  if (!colorStr) return false
  const s = String(colorStr).trim().toLowerCase()
  if (s === '#000' || s === '#000000') return true
  if (
    s === '#1e293b' ||
    s === '#0f172a' ||
    s === '#334155' ||
    s === '#475569' ||
    s === '#111827' ||
    s === '#18181b' ||
    s === '#27272a'
  ) return true

  if (s.startsWith('#') && (s.length === 4 || s.length === 7)) {
    const hex = s.length === 4
      ? s[1] + s[1] + s[2] + s[2] + s[3] + s[3]
      : s.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness < 90
    }
  }
  return false
}

/** 工业级高对比度浮动提示框，彻底根除深暗色序列在暗色背景内文字不可见缺陷 */
export function IndustrialChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null

  return (
    <div
      style={tooltipStyle}
      className="px-3 py-2 text-xs shadow-xl min-w-[140px]"
    >
      <div style={tooltipLabelStyle}>{label}</div>
      <div className="space-y-1 mt-1 font-mono">
        {payload.map((entry: any, index: number) => {
          if (!entry) return null
          const isDark = isColorDark(entry.color)
          const textColor = isDark ? '#f8fafc' : (entry.color || '#f8fafc')
          const dotColor = isDark ? '#e2e8f0' : (entry.color || '#38bdf8')
          const displayVal = typeof entry.value === 'number' ? entry.value.toLocaleString() : (entry.value ?? '--')

          return (
            <div
              key={index}
              className="flex items-center gap-2 leading-tight"
              style={{ color: textColor }}
            >
              <span
                className="size-2 rounded-full inline-block shrink-0 shadow-xs"
                style={{ backgroundColor: dotColor }}
              />
              <span className="font-sans">
                {entry.name || entry.dataKey} :
              </span>
              <span className="font-mono font-bold ml-auto">
                {displayVal}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


export function LineTrend({
  data,
  keys,
  lines,
  xKey = 'month',
  height = 240,
  yUnit,
  secondaryYUnit,
  secondaryDomain,
  refLines,
  xInterval,
  xTickFormatter,
  showMinMax = false,
  markPoints,
  showBrush = false,
  brushStartIndex,
  brushEndIndex,
  onBrushChange,
}: {
  data: any[]
  keys?: SeriesKey[]
  lines?: SeriesKey[]
  xKey?: string
  height?: number
  yUnit?: string
  secondaryYUnit?: string
  secondaryDomain?: [number | string, number | string]
  refLines?: { y: number; label?: string; color?: string; strokeDasharray?: string }[]
  xInterval?: number | 'preserveStartEnd' | 'preserveStart' | 'preserveEnd'
  xTickFormatter?: (value: any, index: number) => string
  showMinMax?: boolean
  markPoints?: Array<{
    x: string | number
    y: number
    label?: string
    color?: string
    position?: 'top' | 'bottom' | 'left' | 'right'
  }>
  showBrush?: boolean
  brushStartIndex?: number
  brushEndIndex?: number
  onBrushChange?: (range: { startIndex?: number; endIndex?: number }) => void
}) {
  const series = normKeys(lines || keys || [])
  const hasRightAxis = series.some((s) => s.yAxisId === 'right')

  // 自动计算图表曲线的最大值点与最小值点
  let computedMaxPoint: { x: any; y: number; label: string } | null = null
  let computedMinPoint: { x: any; y: number; label: string } | null = null

  if (showMinMax && data && data.length > 0 && series.length > 0) {
    const mainKey = series[0].key
    let maxVal = -Infinity
    let minVal = Infinity
    let maxX = data[0][xKey]
    let minX = data[0][xKey]

    data.forEach((item) => {
      const val = Number(item[mainKey])
      if (!isNaN(val)) {
        if (val > maxVal) {
          maxVal = val
          maxX = item[xKey]
        }
        if (val < minVal) {
          minVal = val
          minX = item[xKey]
        }
      }
    })

    if (maxVal !== -Infinity) {
      computedMaxPoint = {
        x: maxX,
        y: maxVal,
        label: `最大值: ${maxVal.toLocaleString()}${yUnit ? ' ' + yUnit : ''}`,
      }
    }
    if (minVal !== Infinity) {
      computedMinPoint = {
        x: minX,
        y: minVal,
        label: `最小值: ${minVal.toLocaleString()}${yUnit ? ' ' + yUnit : ''}`,
      }
    }
  }

  return (
    <div className="relative w-full">
      {yUnit && (
        <div className="absolute -top-3 left-2 text-[10.5px] text-muted-foreground font-mono z-10 select-none bg-panel/90 px-1.5 py-0.5 rounded border border-border/40">
          单位: {yUnit}
        </div>
      )}
      {secondaryYUnit && (
        <div className="absolute -top-3 right-2 text-[10.5px] text-muted-foreground font-mono z-10 select-none bg-panel/90 px-1.5 py-0.5 rounded border border-border/40">
          单位: {secondaryYUnit}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{
            top: showMinMax || yUnit || secondaryYUnit ? 24 : 8,
            right: hasRightAxis ? 28 : 16,
            bottom: showBrush ? 4 : 0,
            left: -12,
          }}
        >
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} interval={xInterval} tickFormatter={xTickFormatter} />
          {hasRightAxis ? (
            <>
              <YAxis yAxisId="left" tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={axisStyle}
                tickLine={false}
                axisLine={false}
                domain={secondaryDomain}
                unit={secondaryYUnit ? ` ${secondaryYUnit}` : undefined}
              />
            </>
          ) : (
            <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
          )}
          <Tooltip content={<IndustrialChartTooltip />} cursor={{ stroke: 'rgba(56, 189, 248, 0.25)' }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
          {refLines?.map((rf, i) => (
            <ReferenceLine
              key={i}
              y={rf.y}
              yAxisId={hasRightAxis ? 'left' : undefined}
              label={{
                value: rf.label,
                fill: rf.color || '#ef4444',
                fontSize: 10,
                position: 'insideTopRight',
              }}
              stroke={rf.color || '#ef4444'}
              strokeDasharray={rf.strokeDasharray || '3 3'}
            />
          ))}
          {series.map((s) => (
            <Line
              key={s.key}
              yAxisId={hasRightAxis ? (s.yAxisId || 'left') : undefined}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}

          {/* 🌟 曲线最大值高亮标点与文字徽章 */}
          {computedMaxPoint && (
            <ReferenceDot
              x={computedMaxPoint.x}
              y={computedMaxPoint.y}
              r={6}
              fill="#e11d48"
              stroke="#ffffff"
              strokeWidth={2.5}
              label={{
                value: `🔴 ${computedMaxPoint.label}`,
                position: 'top',
                fill: '#be123c',
                fontSize: 11,
                fontWeight: 'bold',
                offset: 8,
              }}
            />
          )}

          {/* 🌟 曲线最小值高亮标点与文字徽章 */}
          {computedMinPoint && (
            <ReferenceDot
              x={computedMinPoint.x}
              y={computedMinPoint.y}
              r={6}
              fill="#059669"
              stroke="#ffffff"
              strokeWidth={2.5}
              label={{
                value: `🟢 ${computedMinPoint.label}`,
                position: 'bottom',
                fill: '#047857',
                fontSize: 11,
                fontWeight: 'bold',
                offset: 8,
              }}
            />
          )}

          {/* 自定义标记点 */}
          {markPoints?.map((mp, i) => (
            <ReferenceDot
              key={i}
              x={mp.x}
              y={mp.y}
              r={5}
              fill={mp.color || '#2C7CFF'}
              stroke="#ffffff"
              strokeWidth={2}
              label={
                mp.label
                  ? {
                      value: mp.label,
                      position: mp.position || 'top',
                      fill: mp.color || '#2C7CFF',
                      fontSize: 11,
                      fontWeight: 'bold',
                    }
                  : undefined
              }
            />
          ))}

          {/* 🌟 交互式时间轴/缩放滑动条 (Timeline Brush / DataZoom) */}
          {showBrush && data && data.length > 1 && (
            <Brush
              dataKey={xKey}
              height={22}
              stroke="#2C7CFF"
              fill="#f8fafc"
              travellerWidth={8}
              startIndex={brushStartIndex}
              endIndex={brushEndIndex}
              onChange={onBrushChange}
              tickFormatter={xTickFormatter}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AreaTrend({
  data,
  keys,
  areas,
  xKey = 'month',
  height = 240,
  stacked = false,
}: {
  data: any[]
  keys?: SeriesKey[]
  areas?: SeriesKey[]
  xKey?: string
  height?: number
  stacked?: boolean
}) {
  const series = normKeys(areas || keys || [])
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient id={`grad-${xKey}-${i}`} key={s.key} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip content={<IndustrialChartTooltip />} cursor={{ stroke: 'rgba(56, 189, 248, 0.25)' }} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
        {series.map((s, i) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stackId={stacked ? '1' : undefined}
            stroke={s.color}
            strokeWidth={2}
            fill={`url(#grad-${xKey}-${i})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function Donut({
  data = [],
  height = 200,
  innerRadius = 45,
  outerRadius,
  nameKey = 'name',
  valueKey = 'value',
  unit = '%',
  showLegend = true,
}: {
  data?: any[]
  height?: number
  innerRadius?: number
  outerRadius?: number
  nameKey?: string
  valueKey?: string
  unit?: string
  showLegend?: boolean
}) {
  if (!data || !Array.isArray(data) || data.length === 0) return null
  const computedOuter = outerRadius ?? (innerRadius ? innerRadius + 24 : 75)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(value: any) => (unit ? `${value}${unit}` : value)} />
        {showLegend && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />}
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={computedOuter}
          paddingAngle={2}
          stroke="transparent"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color || chartColors[i % chartColors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export function BarChartGroup({
  data,
  keys,
  bars,
  xKey = 'name',
  nameKey,
  height = 240,
  stacked = false,
}: {
  data: any[]
  keys?: SeriesKey[]
  bars?: SeriesKey[]
  xKey?: string
  nameKey?: string
  height?: number
  stacked?: boolean
}) {
  const actualXKey = nameKey || xKey
  const series = normKeys(bars || keys || [])
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis dataKey={actualXKey} tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip content={<IndustrialChartTooltip />} cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            fill={s.color}
            stackId={stacked ? '1' : undefined}
            radius={stacked ? undefined : [3, 3, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export const BarGroup = BarChartGroup

export function RadarCompare({
  data,
  keys = [],
  series: seriesProp,
  lines: linesProp,
  angleKey = 'subject',
  height = 240,
}: {
  data: any[]
  keys?: SeriesKey[]
  series?: SeriesKey[]
  lines?: SeriesKey[]
  angleKey?: string
  height?: number
}) {
  const series = normKeys(seriesProp || linesProp || (keys.length > 0 ? keys : [{ key: 'value', name: '数值' }]))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey={angleKey}
          tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
        />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
        {series.map((s) => (
          <Radar
            key={s.key}
            name={s.name}
            dataKey={s.key}
            stroke={s.color}
            strokeWidth={2}
            fill={s.color}
            fillOpacity={0.3}
            dot={{ r: 3, fill: s.color, strokeWidth: 1, stroke: '#ffffff' }}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}

// 🌟 1、2、3 级全景能流桑基图 (Sankey Flow Chart)
// 业务规范：
// 1. 仅 tce (综合能耗)、碳 (tCO2)、水 (t/万t) 等实物资源总量显示占比；强度/率指标（如 tCO2/tce、%、tce/万元等）不显示占比。
// 2. 2级经营单位节点占比为【占全集团比重】；3级分厂车间节点占比为【占所属经营单位比重】。
export interface SankeyNode {
  name: string
  itemStyle?: { color?: string; borderColor?: string }
  depth?: number
  value?: number
  displayVal?: string
  localY?: number
}

export interface SankeyLink {
  source: string
  target: string
  value: number
}

export function SankeyFlow({
  nodes,
  links,
  height = 320,
  unit = 'tce',
  showRatio,
  className = '',
}: {
  nodes: SankeyNode[]
  links: SankeyLink[]
  height?: number
  unit?: string
  showRatio?: boolean
  className?: string
}) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)

  // 判定当前指标是否应展示占比（仅限 tce、碳 tCO2、水 t/万t、电 kWh/万kWh、气 m³/万m³、绿电 MWh、额定功率 kW、产值 万元 等资源总量与实体指标）
  const shouldDisplayRatio =
    showRatio !== undefined
      ? showRatio
      : unit === 'tce' ||
        unit === 'tCO2' ||
        unit === 't' ||
        unit === '万t' ||
        unit === '万kWh' ||
        unit === 'kWh' ||
        unit === 'm³' ||
        unit === '万m³' ||
        unit === 'MWh' ||
        unit === 'kW' ||
        unit === '万元' ||
        unit === '类'

  useEffect(() => {
    let isMounted = true

    async function initChart() {
      if (!chartRef.current) return
      
      const echarts = await import('echarts')
      if (!isMounted || !chartRef.current) return

      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current)
      }

      // 1. 计算根节点 (depth === 0) 的全集团总通量
      const rootNode = nodes.find((n: any) => n.depth === 0)
      let rootTotal = 0
      if (rootNode && (rootNode as any).value !== undefined) {
        rootTotal = Number((rootNode as any).value)
      } else {
        const rootLinks = links.filter((l: any) => {
          const srcNode = nodes.find((n: any) => n.name === l.source)
          return srcNode ? srcNode.depth === 0 : false
        })
        rootTotal = rootLinks.reduce((sum: number, l: any) => sum + (Number(l.value) || 0), 0)
      }

      // 2. 预计算每个节点的父级经营单位名称及其总通量 (支持 3 级节点精准计算占经营单位比重)
      const nodeParentMap: Record<string, { parentName: string; parentTotal: number; depth: number }> = {}
      
      // 先计算各 2 级经营单位的自身总通量（由 1 级流入或流向 3 级的汇总）
      const companyTotals: Record<string, number> = {}
      links.forEach((l) => {
        const srcNode = nodes.find((n) => n.name === l.source)
        const tgtNode = nodes.find((n) => n.name === l.target)
        if (srcNode?.depth === 0 && tgtNode?.depth === 1) {
          companyTotals[tgtNode.name] = Number(l.value) || 0
        }
      })

      // 记录每个节点的从属关系
      nodes.forEach((n) => {
        const depth = n.depth ?? (n.name === '电装集团' ? 0 : 2)
        if (depth === 1) {
          nodeParentMap[n.name] = {
            parentName: '全集团',
            parentTotal: rootTotal,
            depth: 1,
          }
        } else if (depth === 2) {
          // 找到流入该 3 级节点的目标链接
          const incomingLink = links.find((l) => l.target === n.name)
          const parentName = incomingLink ? incomingLink.source : ''
          const parentTotal = companyTotals[parentName] || 0
          nodeParentMap[n.name] = {
            parentName: parentName || '经营单位',
            parentTotal: parentTotal,
            depth: 2,
          }
        }
      })

                  // 3. 🌟 1、2、3 级全层级全景高度自适应排版算法 (localY 拓扑流向水平拉伸对齐)
      // 保证 1 级（集团）、2 级（各经营公司）、3 级（全量直属工厂）均能优雅铺满/适配图表高度，消除上下巨大空白与严重下倾
      const nodeGap = 3
      const topPadding = 20
      const bottomPadding = 20
      const drawHeight = Math.max(100, height - topPadding - bottomPadding)

      // 计算每个节点的基础流量权重 (max(出度, 入度, 自身值))
      const nodeFlowValues: Record<string, number> = {}
      nodes.forEach((n) => { nodeFlowValues[n.name] = 0 })
      const outValues: Record<string, number> = {}
      const inValues: Record<string, number> = {}
      links.forEach((l) => {
        const v = Number(l.value) || 0
        outValues[l.source] = (outValues[l.source] || 0) + v
        inValues[l.target] = (inValues[l.target] || 0) + v
      })
      nodes.forEach((n) => {
        const outV = outValues[n.name] || 0
        const inV = inValues[n.name] || 0
        nodeFlowValues[n.name] = Math.max(outV, inV, (n as any).value || 0)
      })

      // 按层级 depth 分组
      const depthGroups: Record<number, SankeyNode[]> = {}
      nodes.forEach((n) => {
        const d = n.depth ?? 0
        if (!depthGroups[d]) depthGroups[d] = []
        depthGroups[d].push(n)
      })

      const depths = Object.keys(depthGroups).map(Number).sort((a, b) => a - b)

      // 寻找全图最小比例因子 minKy (由节点数最多的列决定，保证物理守恒及能流色带宽度统一)
      let minKy = Infinity
      depths.forEach((d) => {
        const group = depthGroups[d]
        const n = group.length
        let sum = 0
        group.forEach((node) => { sum += nodeFlowValues[node.name] || 0 })
        if (sum > 0) {
          const ky = (drawHeight - (n - 1) * nodeGap) / sum
          if (ky < minKy) minKy = ky
        }
      })

      const nodeLocalYMap: Record<string, number> = {}

      if (depths.length === 3) {
        // 3 级组织架构：0级集团 ➔ 1级公司 ➔ 2级工厂
        const level2Nodes = depthGroups[2] || []
        const level1Nodes = depthGroups[1] || []
        const level0Nodes = depthGroups[0] || []

        // 计算 3 级全量直属工厂在图表中的物理位置
        let curY2 = 0
        const level2Positions: Record<string, { y: number; dy: number }> = {}
        level2Nodes.forEach((node) => {
          const dy = (nodeFlowValues[node.name] || 0) * minKy
          level2Positions[node.name] = { y: curY2, dy }
          curY2 += dy + nodeGap
        })

        // 🌟 核心适配：使 2 级各经营公司在垂直方向上均匀铺展，与对应的 3 级工厂集群中轴完美对齐
        let prevBottom = 0
        const level1Positions: Record<string, { y: number; dy: number }> = {}

        level1Nodes.forEach((comp) => {
          const dy = (nodeFlowValues[comp.name] || 0) * minKy
          const targetLinks = links.filter((l) => l.source === comp.name)
          const targetNames = targetLinks.map((l) => l.target).filter((t) => level2Positions[t])

          let targetCenter = 0
          if (targetNames.length > 0) {
            const firstTarget = level2Positions[targetNames[0]]
            const lastTarget = level2Positions[targetNames[targetNames.length - 1]]
            const startY = firstTarget.y
            const endY = lastTarget.y + lastTarget.dy
            targetCenter = (startY + endY) / 2
          } else {
            targetCenter = curY2 / 2
          }

          let y = targetCenter - dy / 2
          if (y < prevBottom + nodeGap) {
            y = prevBottom + nodeGap
          }
          level1Positions[comp.name] = { y, dy }
          prevBottom = y + dy
        })

        // 反向回溯防止公司节点溢出底部
        if (prevBottom > drawHeight) {
          let nextTop = drawHeight
          for (let i = level1Nodes.length - 1; i >= 0; i--) {
            const comp = level1Nodes[i]
            const pos = level1Positions[comp.name]
            if (pos.y + pos.dy > nextTop) {
              pos.y = nextTop - pos.dy
            }
            nextTop = pos.y - nodeGap
          }
        }

        // 注入 2 级公司的自适应高度坐标
        level1Nodes.forEach((comp) => {
          const pos = level1Positions[comp.name]
          nodeLocalYMap[comp.name] = Math.max(0, pos.y) / drawHeight
        })

        // 🌟 1 级集团总部节点垂直居中并充满核心视觉带 (占画布 ~80% 高度)
        level0Nodes.forEach((root) => {
          const dy = (nodeFlowValues[root.name] || 0) * minKy
          const y = Math.max(0, (drawHeight - dy) / 2)
          nodeLocalYMap[root.name] = y / drawHeight
        })
      } else if (depths.length === 2) {
        // 单公司下钻模式 (公司 ➔ 工厂)
        const level0Nodes = depthGroups[0] || []
        level0Nodes.forEach((root) => {
          const dy = (nodeFlowValues[root.name] || 0) * minKy
          const y = Math.max(0, (drawHeight - dy) / 2)
          nodeLocalYMap[root.name] = y / drawHeight
        })
      }

      // 生成带自适应坐标 localY 的节点数据
      const processedNodes = nodes.map((n) => {
        if (nodeLocalYMap[n.name] !== undefined) {
          return {
            ...n,
            localY: nodeLocalYMap[n.name],
          }
        }
        return n
      })

      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

      const option: any = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          backgroundColor: isDark ? 'rgba(11, 21, 40, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          borderColor: isDark ? 'rgba(56, 189, 248, 0.4)' : '#e2e8f0',
          borderWidth: 1,
          padding: [8, 12],
          textStyle: {
            color: '#f8fafc',
            fontSize: 12,
            fontFamily: 'sans-serif',
          },
          formatter: (params: any) => {
            if (params.dataType === 'node') {
              const depth = params.data?.depth
              let ratioStr = ''
              const valStr = params.data?.displayVal !== undefined ? params.data.displayVal : (params.value !== undefined ? params.value.toLocaleString() : '-')
              if (shouldDisplayRatio && params.value !== undefined) {
                if (depth === 1 && rootTotal > 0) {
                  const ratio = ((params.value / rootTotal) * 100).toFixed(1)
                  ratioStr = `<span style="color: #34d399; font-weight: bold; margin-left: 6px;">(占全集团: ${ratio}%)</span>`
                } else if (depth === 2) {
                  const parentInfo = nodeParentMap[params.name]
                  if (parentInfo && parentInfo.parentTotal > 0) {
                    const ratio = ((params.value / parentInfo.parentTotal) * 100).toFixed(1)
                    ratioStr = `<span style="color: #34d399; font-weight: bold; margin-left: 6px;">(占${parentInfo.parentName}: ${ratio}%)</span>`
                  }
                }
              }
              const headerColor = isDark ? '#ffffff' : '#0f172a'
              const borderBottom = isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #e2e8f0'
              const subColor = isDark ? '#cbd5e1' : '#475569'
              const valColor = isDark ? '#38bdf8' : '#2C7CFF'
              return `<div style="font-weight: bold; color: ${headerColor}; border-bottom: ${borderBottom}; padding-bottom: 4px; margin-bottom: 4px;">${params.name}</div>
                      <div style="color: ${subColor};">数值: <strong style="color: ${valColor}; font-family: monospace;">${valStr}</strong> ${unit}${ratioStr}</div>`
            } else if (params.dataType === 'edge') {
              let edgeRatioStr = ''
              if (shouldDisplayRatio && params.data?.value !== undefined) {
                const srcNode = nodes.find((n) => n.name === params.data.source)
                if (srcNode?.depth === 0 && rootTotal > 0) {
                  edgeRatioStr = `<span style="color: #34d399; font-weight: bold; margin-left: 6px;">(占全集团: ${((params.data.value / rootTotal) * 100).toFixed(1)}%)</span>`
                } else if (srcNode?.depth === 1) {
                  const pTotal = companyTotals[params.data.source] || 0
                  if (pTotal > 0) {
                    edgeRatioStr = `<span style="color: #34d399; font-weight: bold; margin-left: 6px;">(占${params.data.source}: ${((params.data.value / pTotal) * 100).toFixed(1)}%)</span>`
                  }
                }
              }
              const headerColor = isDark ? '#ffffff' : '#0f172a'
              const titleColor = isDark ? '#94a3b8' : '#64748b'
              const subColor = isDark ? '#cbd5e1' : '#475569'
              const valColor = isDark ? '#38bdf8' : '#2C7CFF'
              return `<div style="font-size: 11px; color: ${titleColor}; margin-bottom: 4px;">能量/数据流向传递</div>
                      <div style="font-weight: 600; color: ${headerColor};">${params.data.source} ➔ ${params.data.target}</div>
                      <div style="margin-top: 4px; color: ${subColor};">数值: <strong style="color: ${valColor}; font-family: monospace;">${params.data.value?.toLocaleString()}</strong> ${unit}${edgeRatioStr}</div>`
            }
            return ''
          },
        },
        series: [
          {
            type: 'sankey',
            layout: 'none',
            emphasis: {
              focus: 'adjacency',
            },
            nodeWidth: 18,
            nodeGap: 3,
            layoutIterations: 0,
            draggable: false,
            top: 20,
            bottom: 20,
            left: 30,
            right: 80,
            data: processedNodes,
            links: links,
            lineStyle: {
              color: 'gradient',
              curveness: 0.5,
              opacity: isDark ? 0.55 : 0.42,
            },
            label: isDark
              ? {
                  color: '#ffffff',
                  fontSize: 11.5,
                  fontWeight: 700,
                  fontFamily: 'sans-serif',
                  textBorderColor: 'rgba(2, 8, 23, 0.95)',
                  textBorderWidth: 3,
                  textShadowColor: 'rgba(0, 0, 0, 0.9)',
                  textShadowBlur: 4,
                  formatter: '{b}',
                }
              : {
                  color: '#0f172a',
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: 'sans-serif',
                  textBorderColor: '#ffffff',
                  textBorderWidth: 2,
                  formatter: '{b}',
                },
            itemStyle: isDark
              ? {
                  borderWidth: 1.5,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: 3,
                }
              : {
                  borderWidth: 1,
                  borderColor: '#ffffff',
                  borderRadius: 3,
                },
          },
        ],
      }

      chartInstance.current.setOption(option, true)
    }

    initChart()

    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener('resize', handleResize)

    // 监听深浅色皮肤切换，自动实时重绘桑基图
    const observer = new MutationObserver(() => {
      initChart()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      isMounted = false
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [nodes, links, height, unit, shouldDisplayRatio])

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [])

  return (
    <div className={`w-full relative select-none ${className}`}>
      <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />
    </div>
  )
}

export interface IndicatorBarItem {
  name: string
  value: number
  yoy?: string
  displayVal?: string
  color?: string
  company?: string
}

/* 🌟 指标对比柱状图 (IndicatorBarChart) - 用于非能流指标的各工厂/各单位柱状图对比 */
export function IndicatorBarChart({
  data,
  unit = '',
  height = 380,
  benchmark,
  benchmarkLabel = '全集团指标',
  className = '',
}: {
  data: IndicatorBarItem[]
  unit?: string
  height?: number
  benchmark?: number
  benchmarkLabel?: string
  className?: string
}) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)

  useEffect(() => {
    let isMounted = true

    async function initChart() {
      if (!chartRef.current) return
      const echarts = await import('echarts')
      if (!isMounted || !chartRef.current) return

      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current)
      }

      const isPercent = unit === '%'
      const maxVal = Math.max(...data.map((d) => d.value), benchmark || 0)
      const yMax = isPercent ? (maxVal > 80 ? 100 : Math.ceil(maxVal * 1.15)) : undefined
      const isManyItems = data.length > 8
      const isVeryManyItems = data.length > 12

      const option: any = {
        backgroundColor: 'transparent',
        grid: {
          top: 36,
          right: 24,
          bottom: isVeryManyItems ? 54 : isManyItems ? 40 : 28,
          left: 48,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(0, 0, 0, 0.04)',
            },
          },
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderColor: '#DBE6EE',
          borderWidth: 1,
          padding: [8, 12],
          textStyle: {
            color: '#1e293b',
            fontSize: 12,
          },
          formatter: (params: any) => {
            if (!params || !params.length) return ''
            const p = params[0]
            const item = data[p.dataIndex]
            if (!item) return ''
            let html = `<div style="font-weight:700;color:#0f172a;margin-bottom:4px;">${p.name}${item.company ? ` <span style="font-size:11px;font-weight:normal;color:#64748b;">(${item.company})</span>` : ''}</div>`
            html += `<div style="display:flex;justify-content:space-between;gap:16px;color:#475569;">`
            html += `<span>实测值:</span><span style="font-weight:700;font-family:monospace;color:#2C7CFF;">${item.value.toLocaleString()} ${unit}</span>`
            html += `</div>`
            if (item.yoy) {
              const isDown = item.yoy.includes('-') || item.yoy.includes('↓')
              const yoyColor = isDown ? '#16a34a' : '#2563eb'
              html += `<div style="display:flex;justify-content:space-between;gap:16px;color:#475569;margin-top:2px;">`
              html += `<span>同比:</span><span style="font-weight:700;font-family:monospace;color:${yoyColor};">${item.yoy}</span>`
              html += `</div>`
            }
            return html
          },
        },
        xAxis: {
          type: 'category',
          data: data.map((d) => d.name),
          axisLine: { lineStyle: { color: '#E2E8F0' } },
          axisTick: { show: false },
          axisLabel: {
            color: '#475569',
            fontSize: isVeryManyItems ? 11 : 12,
            fontWeight: 500,
            interval: 0,
            rotate: isManyItems ? 35 : 0,
          },
        },
        yAxis: {
          type: 'value',
          max: yMax,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: {
              color: '#F1F5F9',
              type: 'dashed',
            },
          },
          axisLabel: {
            color: '#64748b',
            fontSize: 11,
            formatter: (v: number) => (isPercent ? `${v}%` : v >= 10000 ? `${(v / 10000).toFixed(1)}万` : String(v)),
          },
        },
        series: [
          {
            name: '实测数据',
            type: 'bar',
            barWidth: isVeryManyItems ? 18 : isManyItems ? 24 : 36,
            data: data.map((d) => ({
              value: d.value,
              itemStyle: {
                color: d.color || '#2C7CFF',
                borderRadius: [4, 4, 0, 0],
              },
            })),
            label: {
              show: true,
              position: 'top',
              formatter: (p: any) =>
                isVeryManyItems
                  ? `${p.value.toLocaleString()}${isPercent ? '%' : ''}`
                  : `${p.value.toLocaleString()} ${unit}`,
              fontSize: isVeryManyItems ? 10 : 11,
              fontWeight: 600,
              fontFamily: 'monospace',
              color: '#334155',
            },
            markLine:
              benchmark !== undefined && benchmark > 0
                ? {
                    symbol: 'none',
                    lineStyle: {
                      color: '#2C7CFF',
                      type: 'dashed',
                      width: 1.5,
                    },
                    label: {
                      formatter: `${benchmarkLabel}: ${benchmark.toLocaleString()} ${unit}`,
                      position: 'insideEndTop',
                      color: '#2C7CFF',
                      fontSize: 11,
                      fontWeight: 700,
                    },
                    data: [{ yAxis: benchmark }],
                  }
                : undefined,
          },
        ],
      }

      chartInstance.current.setOption(option, true)
    }

    initChart()

    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      isMounted = false
      window.removeEventListener('resize', handleResize)
    }
  }, [data, unit, height, benchmark, benchmarkLabel])

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [])

  return (
    <div className={`w-full relative select-none ${className}`}>
      <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />
    </div>
  )
}

/* 基准对比柱状图：各对象柱 + 基准值参考虚线；超基准柱标红 */
export function BarBenchmark({
  data,
  dataKey,
  nameKey = 'name',
  benchmark,
  height = 220,
  unit = '',
  onBarClick,
}: {
  data: any[]
  dataKey: string
  nameKey?: string
  benchmark: number
  height?: number
  unit?: string
  onBarClick?: (row: any) => void
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 18, right: 8, bottom: 0, left: -14 }}>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis
          dataKey={nameKey}
          tick={{ ...axisStyle, fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-16}
          textAnchor="end"
          height={48}
        />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(v: number) => `${v}${unit}`} cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} />
        <ReferenceLine
          y={benchmark}
          stroke="var(--chart-4)"
          strokeDasharray="5 4"
          strokeWidth={1.5}
          label={{ value: `基准 ${benchmark}${unit}`, position: 'insideTopRight', fill: 'var(--chart-4)', fontSize: 10 }}
        />
        <Bar
          dataKey={dataKey}
          radius={3}
          barSize={26}
          onClick={onBarClick}
          cursor={onBarClick ? 'pointer' : undefined}
        >
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d[dataKey] > benchmark ? 'var(--destructive)' : 'var(--chart-1)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}




/* 南丁格尔玫瑰图：等角度扇形，半径 ∝ 数值，直观表达"哪个区间的型号最多" */
function rosePolar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}
function roseSector(cx: number, cy: number, r: number, start: number, end: number) {
  const [x1, y1] = rosePolar(cx, cy, r, start)
  const [x2, y2] = rosePolar(cx, cy, r, end)
  const large = end - start > 180 ? 1 : 0
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`
}
export function RoseChart({
  data,
  size = 136,
  color = '#00b4d8',
}: {
  data: { name: string; value: number }[]
  size?: number
  color?: string
}) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 8
  const max = Math.max(...data.map((d) => d.value), 1)
  const n = data.length || 1
  const seg = 360 / n
  const opacities = [0.45, 0.65, 0.85, 1.0]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto block">
      {/* 3同心参考圈 */}
      {[0.34, 0.67, 1.0].map((f, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={maxR * f}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeDasharray="2 3"
        />
      ))}
      {data.map((d, i) => {
        const r = Math.max(8, maxR * (d.value / max))
        const start = i * seg
        const end = start + seg - 3
        const mid = start + seg / 2
        const fill = color
        const fillOpacity = opacities[i % opacities.length]
        const [tx, ty] = rosePolar(cx, cy, r * 0.65, mid)
        const showLabel = d.value >= 25 && r >= 30

        return (
          <g key={d.name}>
            <path
              d={roseSector(cx, cy, r, start, end)}
              fill={fill}
              fillOpacity={fillOpacity}
              stroke="#091424"
              strokeWidth={1}
            >
              <title>{`${d.name}：${d.value}%`}</title>
            </path>
            {showLabel && (
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight={700}
                fill="#ffffff"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
              >
                {d.value}%
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

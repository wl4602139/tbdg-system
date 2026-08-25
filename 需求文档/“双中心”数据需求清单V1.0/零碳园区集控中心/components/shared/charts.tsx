'use client'

// charts: keys 支持 string[] 或 {key,name,color}[]
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const axisStyle = { fontSize: 11, fill: 'oklch(0.68 0.03 235)' }
const gridColor = 'oklch(0.72 0.12 220 / 12%)'

const chartColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

const tooltipStyle = {
  background: 'oklch(0.2 0.035 252)',
  border: '1px solid oklch(0.72 0.12 220 / 25%)',
  borderRadius: 8,
  color: 'oklch(0.92 0.02 240)',
  fontSize: 12,
}

/* keys 允许 string[] 或 {key,name,color}[] 两种写法 */
export type SeriesKey = string | { key: string; name?: string; color?: string }
function normKeys(keys: SeriesKey[]) {
  return (keys ?? []).map((k, i) =>
    typeof k === 'string'
      ? { key: k, name: k, color: chartColors[i % chartColors.length] }
      : { key: k.key, name: k.name ?? k.key, color: k.color ?? chartColors[i % chartColors.length] },
  )
}

/* 推断类别（X 轴 / 分类轴）字段：优先 name、month，否则取首个非数值字段 */
function inferCat(data: any[]) {
  const row = data?.[0] ?? {}
  if ('name' in row) return 'name'
  if ('month' in row) return 'month'
  const firstStr = Object.keys(row).find((k) => typeof row[k] === 'string')
  return firstStr ?? 'name'
}

export function LineTrend({
  data,
  keys,
  xKey = 'month',
  height = 260,
}: {
  data: any[]
  keys: SeriesKey[]
  xKey?: string
  height?: number
}) {
  const series = normKeys(keys)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: gridColor }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function AreaTrend({
  data,
  keys,
  xKey = 'month',
  height = 260,
  stacked = false,
}: {
  data: any[]
  keys: SeriesKey[]
  xKey?: string
  height?: number
  stacked?: boolean
}) {
  const series = normKeys(keys)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient id={`grad-${xKey}-${i}`} key={s.key} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0.03} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: gridColor }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
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

export function BarGroup({
  data,
  keys,
  bars,
  xKey,
  nameKey,
  height = 260,
  stacked = false,
  layout = 'horizontal',
  vertical: verticalProp,
}: {
  data: any[]
  keys?: SeriesKey[]
  bars?: SeriesKey[]
  xKey?: string
  nameKey?: string
  height?: number
  stacked?: boolean
  layout?: 'horizontal' | 'vertical'
  vertical?: boolean
}) {
  const series = normKeys(keys ?? bars ?? [])
  const cat = xKey ?? nameKey ?? inferCat(data)
  const vertical = verticalProp ?? layout === 'vertical'
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={vertical ? 'vertical' : 'horizontal'}
        margin={{ top: 8, right: 8, bottom: 0, left: vertical ? 20 : -12 }}
      >
        <CartesianGrid stroke={gridColor} vertical={vertical} horizontal={!vertical} />
        {vertical ? (
          <>
            <XAxis type="number" tick={axisStyle} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey={cat} tick={axisStyle} tickLine={false} axisLine={false} width={90} />
          </>
        ) : (
          <>
            <XAxis dataKey={cat} tick={axisStyle} tickLine={false} axisLine={false} />
            <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
          </>
        )}
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'oklch(0.72 0.12 220 / 8%)' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stackId={stacked ? '1' : undefined}
            fill={s.color}
            radius={stacked ? 0 : 3}
            barSize={vertical ? 14 : 22}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function Donut({
  data,
  height = 260,
  innerRadius = 55,
  unit = '%',
}: {
  data: { name: string; value: number; color?: string }[]
  height?: number
  innerRadius?: number
  unit?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={innerRadius + 30}
          paddingAngle={2}
          stroke="transparent"
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color ?? chartColors[i % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}${unit}`} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function RadarCompare({
  data,
  height = 260,
}: {
  data: { metric: string; value: number; benchmark: number }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke={gridColor} />
        <PolarAngleAxis dataKey="metric" tick={axisStyle} />
        <Radar name="本单位" dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} />
        <Radar name="行业标杆" dataKey="benchmark" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.2} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

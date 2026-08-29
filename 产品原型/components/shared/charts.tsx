'use client'

import { useEffect, useRef } from 'react'
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
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const axisStyle = { fontSize: 11, fill: '#64748b' }
const gridColor = '#f1f5f9'

const chartColors = [
  '#1677ff', // TBEA Blue
  '#52c41a', // Leaf Green
  '#fa8c16', // Orange
  '#13c2c2', // Cyan
  '#722ed1', // Purple
  '#f5222d', // Red
]

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  color: '#1f2937',
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
}

export type SeriesKey = string | { key: string; name?: string; color?: string }
function normKeys(keys?: SeriesKey[]) {
  return (keys ?? []).map((k, i) =>
    typeof k === 'string'
      ? { key: k, name: k, color: chartColors[i % chartColors.length] }
      : { key: k.key, name: k.name ?? k.key, color: k.color ?? chartColors[i % chartColors.length] },
  )
}

export function LineTrend({
  data,
  keys,
  lines,
  xKey = 'month',
  height = 240,
  yUnit,
  refLines,
}: {
  data: any[]
  keys?: SeriesKey[]
  lines?: SeriesKey[]
  xKey?: string
  height?: number
  yUnit?: string
  refLines?: { y: number; label?: string; color?: string; strokeDasharray?: string }[]
}) {
  const series = normKeys(lines || keys || [])
  return (
    <div className="relative w-full">
      {yUnit && (
        <div className="absolute -top-3 left-2 text-[10.5px] text-slate-500 font-mono z-10 select-none bg-white/80 px-1 rounded">
          单位: {yUnit}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: yUnit ? 16 : 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#cbd5e1' }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
          {refLines?.map((rf, i) => (
            <ReferenceLine
              key={i}
              y={rf.y}
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
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#cbd5e1' }} />
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
  nameKey = 'name',
  valueKey = 'value',
  unit,
}: {
  data?: any[]
  height?: number
  nameKey?: string
  valueKey?: string
  unit?: string
}) {
  if (!data || !Array.isArray(data) || data.length === 0) return null
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: any) => (unit ? `${value} ${unit}` : value)}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={3}
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
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f8fafc' }} />
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
        <Tooltip contentStyle={tooltipStyle} />
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
export interface SankeyNode {
  name: string
  itemStyle?: { color?: string; borderColor?: string }
  depth?: number
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
  className = '',
}: {
  nodes: SankeyNode[]
  links: SankeyLink[]
  height?: number
  unit?: string
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

      const option: any = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderColor: '#cbd5e1',
          borderWidth: 1,
          padding: [8, 12],
          textStyle: {
            color: '#1e293b',
            fontSize: 12,
            fontFamily: 'sans-serif',
          },
          formatter: (params: any) => {
            if (params.dataType === 'node') {
              return `<div style="font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">${params.name}</div>
                      <div style="color: #475569;">总通量: <strong style="color: #1677ff; font-family: monospace;">${params.value !== undefined ? params.value.toLocaleString() : '-'}</strong> ${unit}</div>`
            } else if (params.dataType === 'edge') {
              return `<div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">能量流向传递</div>
                      <div style="font-weight: 600; color: #1e293b;">${params.data.source} ➔ ${params.data.target}</div>
                      <div style="margin-top: 4px; color: #334155;">流转量: <strong style="color: #1677ff; font-family: monospace;">${params.data.value?.toLocaleString()}</strong> ${unit}</div>`
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
            nodeGap: 14,
            draggable: false,
            top: 25,
            bottom: 20,
            left: 30,
            right: 30,
            data: nodes,
            links: links,
            lineStyle: {
              color: 'gradient',
              curveness: 0.5,
              opacity: 0.42,
            },
            label: {
              color: '#0f172a',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'sans-serif',
              formatter: (params: any) => {
                const valStr = params.value !== undefined ? `\n{val|${params.value} ${unit}}` : ''
                return `${params.name}${valStr}`
              },
              rich: {
                val: {
                  fontSize: 10,
                  color: '#64748b',
                  fontFamily: 'monospace',
                  padding: [2, 0, 0, 0],
                },
              },
            },
            itemStyle: {
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

    return () => {
      isMounted = false
      window.removeEventListener('resize', handleResize)
    }
  }, [nodes, links, height, unit])

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


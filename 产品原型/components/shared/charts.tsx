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
  ReferenceDot,
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
  xInterval,
  showMinMax = false,
  markPoints,
}: {
  data: any[]
  keys?: SeriesKey[]
  lines?: SeriesKey[]
  xKey?: string
  height?: number
  yUnit?: string
  refLines?: { y: number; label?: string; color?: string; strokeDasharray?: string }[]
  xInterval?: number | 'preserveStartEnd' | 'preserveStart' | 'preserveEnd'
  showMinMax?: boolean
  markPoints?: Array<{
    x: string | number
    y: number
    label?: string
    color?: string
    position?: 'top' | 'bottom' | 'left' | 'right'
  }>
}) {
  const series = normKeys(lines || keys || [])

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
        label: `最大值: ${maxVal.toLocaleString()}${yUnit ? ' ' + yUnit : ''} (${maxX})`,
      }
    }
    if (minVal !== Infinity) {
      computedMinPoint = {
        x: minX,
        y: minVal,
        label: `最小值: ${minVal.toLocaleString()}${yUnit ? ' ' + yUnit : ''} (${minX})`,
      }
    }
  }

  return (
    <div className="relative w-full">
      {yUnit && (
        <div className="absolute -top-3 left-2 text-[10.5px] text-slate-500 font-mono z-10 select-none bg-white/80 px-1 rounded">
          单位: {yUnit}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: showMinMax || yUnit ? 24 : 8, right: 16, bottom: 0, left: -12 }}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} interval={xInterval} />
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
              fill={mp.color || '#1677ff'}
              stroke="#ffffff"
              strokeWidth={2}
              label={
                mp.label
                  ? {
                      value: mp.label,
                      position: mp.position || 'top',
                      fill: mp.color || '#1677ff',
                      fontSize: 11,
                      fontWeight: 'bold',
                    }
                  : undefined
              }
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
// 业务规范：
// 1. 仅 tce (综合能耗)、碳 (tCO2)、水 (t/万t) 等实物资源总量显示占比；强度/率指标（如 tCO2/tce、%、tce/万元等）不显示占比。
// 2. 2级经营单位节点占比为【占全集团比重】；3级分厂车间节点占比为【占所属经营单位比重】。
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

  // 判定当前指标是否应展示占比（仅限 tce、碳 tCO2、水 t/万t、电 kWh/万kWh、气 m³/万m³ 等资源总量指标）
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
        unit === '万m³'

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
              const depth = params.data?.depth
              let ratioStr = ''
              if (shouldDisplayRatio && params.value !== undefined) {
                if (depth === 1 && rootTotal > 0) {
                  const ratio = ((params.value / rootTotal) * 100).toFixed(1)
                  ratioStr = `<span style="color: #10b981; font-weight: bold; margin-left: 6px;">(占全集团: ${ratio}%)</span>`
                } else if (depth === 2) {
                  const parentInfo = nodeParentMap[params.name]
                  if (parentInfo && parentInfo.parentTotal > 0) {
                    const ratio = ((params.value / parentInfo.parentTotal) * 100).toFixed(1)
                    ratioStr = `<span style="color: #10b981; font-weight: bold; margin-left: 6px;">(占${parentInfo.parentName}: ${ratio}%)</span>`
                  }
                }
              }
              return `<div style="font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">${params.name}</div>
                      <div style="color: #475569;">数值: <strong style="color: #1677ff; font-family: monospace;">${params.value !== undefined ? params.value.toLocaleString() : '-'}</strong> ${unit}${ratioStr}</div>`
            } else if (params.dataType === 'edge') {
              let edgeRatioStr = ''
              if (shouldDisplayRatio && params.data?.value !== undefined) {
                const srcNode = nodes.find((n) => n.name === params.data.source)
                if (srcNode?.depth === 0 && rootTotal > 0) {
                  edgeRatioStr = `<span style="color: #10b981; font-weight: bold; margin-left: 6px;">(占全集团: ${((params.data.value / rootTotal) * 100).toFixed(1)}%)</span>`
                } else if (srcNode?.depth === 1) {
                  const pTotal = companyTotals[params.data.source] || 0
                  if (pTotal > 0) {
                    edgeRatioStr = `<span style="color: #10b981; font-weight: bold; margin-left: 6px;">(占${params.data.source}: ${((params.data.value / pTotal) * 100).toFixed(1)}%)</span>`
                  }
                }
              }
              return `<div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">能量/数据流向传递</div>
                      <div style="font-weight: 600; color: #1e293b;">${params.data.source} ➔ ${params.data.target}</div>
                      <div style="margin-top: 4px; color: #334155;">数值: <strong style="color: #1677ff; font-family: monospace;">${params.data.value?.toLocaleString()}</strong> ${unit}${edgeRatioStr}</div>`
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
                if (params.value === undefined) return params.name
                const depth = params.data?.depth
                if (!shouldDisplayRatio || depth === 0) {
                  return `${params.name}\n{val|${params.value.toLocaleString()} ${unit}}`
                }
                if (depth === 1 && rootTotal > 0) {
                  const ratio = ((params.value / rootTotal) * 100).toFixed(1)
                  return `${params.name}\n{val|${params.value.toLocaleString()} ${unit}} {ratio|(${ratio}%)}`
                }
                if (depth === 2) {
                  const parentInfo = nodeParentMap[params.name]
                  if (parentInfo && parentInfo.parentTotal > 0) {
                    const ratio = ((params.value / parentInfo.parentTotal) * 100).toFixed(1)
                    return `${params.name}\n{val|${params.value.toLocaleString()} ${unit}} {ratio|(${ratio}%)}`
                  }
                }
                return `${params.name}\n{val|${params.value.toLocaleString()} ${unit}}`
              },
              rich: {
                val: {
                  fontSize: 10,
                  color: '#64748b',
                  fontFamily: 'monospace',
                  padding: [2, 0, 0, 0],
                },
                ratio: {
                  fontSize: 10,
                  color: '#10b981',
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif',
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


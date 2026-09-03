'use client'

import { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { Plus, Minus, Locate } from 'lucide-react'

const GEO_URL = '/china.geo.json'

export type MapBubble = {
  id: string
  name: string
  coordinates: [number, number]
  /** 归一后的相对大小 0~1，用于计算气泡半径 */
  size: number
  fill: string
  /** 描边/内环色（碳强度色阶） */
  ring: string
  dimmed?: boolean
  /** 悬浮/选中时展示的补充信息 */
  tooltip?: React.ReactNode
  /** 气泡旁常驻标注（如“衡变 58%”） */
  badge?: string
}

export function ChinaMap({
  bubbles,
  selectedId,
  onSelect,
  height = 560,
  minR = 6,
  maxR = 26,
}: {
  bubbles: MapBubble[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  height?: number
  minR?: number
  maxR?: number
}) {
  const [hover, setHover] = useState<string | null>(null)
  const [view, setView] = useState({ center: [104, 36] as [number, number], zoom: 1 })

  const active = hover ?? selectedId ?? null
  const activeBubble = useMemo(() => bubbles.find((b) => b.id === active), [bubbles, active])

  const radius = (s: number) => minR + Math.sqrt(Math.max(0, Math.min(1, s))) * (maxR - minR)

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-[color-mix(in_oklch,var(--panel)_92%,var(--primary))]" style={{ height }}>
      {/* 缩放控件 */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
        <button type="button" onClick={() => setView((v) => ({ ...v, zoom: Math.min(v.zoom * 1.5, 8) }))} className="flex size-8 items-center justify-center rounded-md border border-border bg-panel/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground" aria-label="放大">
          <Plus className="size-4" />
        </button>
        <button type="button" onClick={() => setView((v) => ({ ...v, zoom: Math.max(v.zoom / 1.5, 1) }))} className="flex size-8 items-center justify-center rounded-md border border-border bg-panel/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground" aria-label="缩小">
          <Minus className="size-4" />
        </button>
        <button type="button" onClick={() => setView({ center: [104, 36], zoom: 1 })} className="flex size-8 items-center justify-center rounded-md border border-border bg-panel/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground" aria-label="复位">
          <Locate className="size-4" />
        </button>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [104, 37.5], scale: 620 }}
        width={800}
        height={height}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup center={view.center} zoom={view.zoom} onMoveEnd={(pos: any) => setView(pos)} maxZoom={8}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: 'color-mix(in oklch, var(--secondary) 65%, transparent)', stroke: 'var(--border)', strokeWidth: 0.5, outline: 'none' },
                    hover: { fill: 'color-mix(in oklch, var(--primary) 14%, var(--secondary))', stroke: 'var(--primary)', strokeWidth: 0.6, outline: 'none' },
                    pressed: { fill: 'color-mix(in oklch, var(--primary) 20%, var(--secondary))', outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {bubbles.map((b) => {
            const r = radius(b.size)
            const isActive = b.id === active
            const op = b.dimmed ? 0.28 : 1
            return (
              <Marker key={b.id} coordinates={b.coordinates}>
                <g
                  onMouseEnter={() => setHover(b.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onSelect?.(b.id)}
                  style={{ cursor: 'pointer' }}
                  opacity={op}
                >
                  {/* 脉冲光晕 */}
                  {isActive && (
                    <circle r={r + 6} fill={b.fill} opacity={0.18}>
                      <animate attributeName="r" values={`${r};${r + 10};${r}`} dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle r={r} fill={b.fill} fillOpacity={0.55} stroke={b.ring} strokeWidth={isActive ? 2.5 : 1.5} />
                  <circle r={Math.max(r * 0.35, 2)} fill={b.ring} />
                  {b.badge && (
                    <text
                      textAnchor="middle"
                      y={-r - 5}
                      style={{ fontSize: 9, fontWeight: 600, fill: 'var(--foreground)', paintOrder: 'stroke', stroke: 'var(--background)', strokeWidth: 2.5 }}
                    >
                      {b.badge}
                    </text>
                  )}
                </g>
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* 悬浮/选中信息卡 */}
      {activeBubble?.tooltip && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-20 max-w-xs rounded-lg border border-primary/40 bg-popover/95 p-3 text-xs shadow-xl backdrop-blur">
          {activeBubble.tooltip}
        </div>
      )}
    </div>
  )
}

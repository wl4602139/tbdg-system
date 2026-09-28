'use client'

import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FlowStage = {
  name: string
  value: string // 主值（净碳排 / 综合能耗）
  unit: string
  ratio: number // 0~1
  lines?: { label: string; value: string; tone?: 'grid' | 'green' | 'muted' }[]
}

/* 生产制造工序流：开始 → 各工序卡片 → 结束（横向，带箭头连接） */
export function StageFlow({ stages, accent = 'primary' }: { stages: FlowStage[]; accent?: 'primary' | 'chart-1' }) {
  return (
    <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
      <Endcap label="开始" />
      {stages.map((s, i) => (
        <div key={s.name} className="flex items-stretch gap-1">
          <ChevronRight className="my-auto size-4 shrink-0 text-primary/60" />
          <div className="flex min-w-[8.5rem] flex-col rounded-lg border border-border bg-secondary/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{s.name}</span>
              <span className="text-[10px] text-muted-foreground">{(s.ratio * 100).toFixed(1)}%</span>
            </div>
            <div className="font-mono text-lg text-primary text-glow">
              {s.value}
              <span className="ml-1 text-[10px] font-sans text-muted-foreground">{s.unit}</span>
            </div>
            {/* 占比条 */}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full', accent === 'primary' ? 'bg-primary' : 'bg-[var(--chart-1)]')}
                style={{ width: `${Math.max(s.ratio * 100, 4)}%` }}
              />
            </div>
            {s.lines && (
              <div className="mt-2 space-y-0.5 text-[10px]">
                {s.lines.map((l) => (
                  <div key={l.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{l.label}</span>
                    <span
                      className={cn(
                        'font-mono',
                        l.tone === 'green'
                          ? 'text-[var(--success)]'
                          : l.tone === 'grid'
                            ? 'text-[var(--chart-1)]'
                            : 'text-foreground',
                      )}
                    >
                      {l.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {i === stages.length - 1 && <ChevronRight className="my-auto size-4 shrink-0 text-primary/60" />}
        </div>
      ))}
      <Endcap label="结束" />
    </div>
  )
}

function Endcap({ label }: { label: string }) {
  return (
    <div className="flex min-w-[3.5rem] items-center justify-center rounded-lg border border-primary/40 bg-primary/10 px-2 text-xs font-medium text-primary">
      {label}
    </div>
  )
}

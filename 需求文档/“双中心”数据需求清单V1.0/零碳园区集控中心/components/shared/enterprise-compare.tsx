'use client'

import { Panel, PanelTitle, DataTable } from '@/components/shared/primitives'
import { BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CompareCol = { key: string; label: string; better: 'low' | 'high' }

export function EnterpriseCompare({
  title = '企业对比分析',
  subtitle,
  cols,
  rows,
  selected,
}: {
  title?: string
  subtitle?: string
  cols: CompareCol[]
  rows: Record<string, any>[]
  selected: string | null
}) {
  const colStats = cols.map((col) => {
    const vals = rows.map((r) => r[col.key] as number)
    return {
      ...col,
      best: col.better === 'low' ? Math.min(...vals) : Math.max(...vals),
      worst: col.better === 'low' ? Math.max(...vals) : Math.min(...vals),
    }
  })

  /* 多指标归一化加权评分 */
  const scored = rows.map((r) => {
    const scores = colStats.map((c) => {
      const v = r[c.key] as number
      if (c.best === c.worst) return 100
      return Math.round(c.better === 'low' ? ((c.worst - v) / (c.worst - c.best)) * 100 : ((v - c.worst) / (c.best - c.worst)) * 100)
    })
    return { name: r.name, score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }
  })
  const sorted = [...scored].sort((a, b) => b.score - a.score)
  const rankMap: Record<string, number> = {}
  sorted.forEach((s, i) => (rankMap[s.name] = i + 1))
  const selectedRank = selected ? rankMap[selected] : undefined

  return (
    <Panel>
      <PanelTitle title={title} subtitle={subtitle ?? '各企业指标对比（绿=最优 ★，橙=最差 ⚠）'} icon={BarChart3} />
      {selected && selectedRank && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm">
          <span className="font-medium text-primary">{selected}</span>
          <span className="text-muted-foreground">
            综合评分排名第 <span className="font-mono text-primary">{selectedRank}</span> / {rows.length} 家，优于 {rows.length - selectedRank} 家企业
            {selectedRank === 1 ? '（领跑）' : selectedRank >= rows.length - 1 ? '（需重点关注）' : ''}
          </span>
        </div>
      )}
      <DataTable
        columns={[
          {
            key: 'name',
            label: '企业',
            render: (r) => (
              <span className={cn('font-medium', selected === r.name ? 'text-primary' : 'text-foreground')}>
                {r.name}
                {rankMap[r.name] === 1 ? ' 🏆' : ''}
              </span>
            ),
          },
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
          { key: 'score', label: '综合评分', align: 'right', render: (r) => <span className="font-mono text-primary">{rankMap[r.name]} 名</span> },
        ]}
        rows={rows}
      />
    </Panel>
  )
}

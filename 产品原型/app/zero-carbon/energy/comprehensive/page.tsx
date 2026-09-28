'use client'

import { useState } from 'react'
import { Trophy, Target, BarChart3, Leaf, Zap, DollarSign, Package, TrendingUp, Building2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { BarGroup } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { factories } from '@/lib/mock-data'
import { seedFactor } from '@/lib/variant'
import { cn } from '@/lib/utils'

const comprehensiveCols = [
  { key: '能源成本', label: '能源成本(万元)', better: 'low' as const, dim: '成本' },
  { key: '产品产量', label: '产品产量(台)', better: 'high' as const, dim: '产量' },
  { key: '碳排放量', label: '碳排放量(tCO₂)', better: 'low' as const, dim: '排放' },
  { key: '碳强度', label: '碳强度(tCO₂/万元)', better: 'low' as const, dim: '排放' },
  { key: '绿电占比', label: '绿电占比(%)', better: 'high' as const, dim: '绿色能源' },
  { key: '非化石能源占比', label: '非化石能源消费占比(%)', better: 'high' as const, dim: '零碳工厂' },
  { key: '非化石电力占比', label: '非化石电力物理认定占比(%)', better: 'high' as const, dim: '零碳工厂' },
]

const dimOptions = ['全部维度', '成本', '产量', '排放', '绿色能源', '零碳工厂']

function makeRow(name: string) {
  const cf = seedFactor(name)
  return {
    name,
    能源成本: Math.round(2000 + cf * 3000),
    产品产量: Math.round(5000 + cf * 8000),
    碳排放量: Math.round(2000 + cf * 3200),
    碳强度: +(0.3 + cf * 0.5).toFixed(2),
    绿电占比: Math.round(20 + cf * 50),
    非化石能源占比: Math.round(25 + cf * 40),
    非化石电力占比: Math.round(20 + cf * 45),
  }
}

function calcScore(val: number, best: number, worst: number, better: 'low' | 'high') {
  if (best === worst) return 100
  return Math.round(better === 'low' ? ((worst - val) / (worst - best)) * 100 : ((val - worst) / (best - worst)) * 100)
}

export default function ComprehensivePage() {
  const [dim, setDim] = useState('全部维度')

  const rows = factories.map((f) => makeRow(f))
  const cols = dim === '全部维度' ? comprehensiveCols : comprehensiveCols.filter((c) => c.dim === dim)

  /* 每列最值 + 综合评分 */
  const colStats = cols.map((col) => {
    const vals = rows.map((r) => r[col.key as keyof typeof r] as number)
    return { ...col, best: col.better === 'low' ? Math.min(...vals) : Math.max(...vals), worst: col.better === 'low' ? Math.max(...vals) : Math.min(...vals) }
  })
  const scored = rows.map((r) => {
    const scores = colStats.map((c) => calcScore(r[c.key as keyof typeof r] as number, c.best, c.worst, c.better))
    return { name: r.name, 综合评分: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }
  })
  const sorted = [...scored].sort((a, b) => b.综合评分 - a.综合评分)
  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  return (
    <div>
      <PageHeader
        actions={
          <>
            <div className="inline-flex overflow-hidden rounded-md border border-border">
              {dimOptions.map((d) => (
                <button key={d} type="button" onClick={() => setDim(d)} className={cn('px-3 py-1.5 text-xs transition-colors', dim === d ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground')}>
                  {d}
                </button>
              ))}
            </div>
            <TimeRange />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="参与统计企业" value={String(rows.length)} unit="家" delta="集团经营单位" icon={Target} />
        <KpiCard label="基准能耗单位" value={best.name} delta={`${best.综合评分} 分`} icon={Building2} />
        <KpiCard label="重点监测单位" value={worst.name} delta={`${worst.综合评分} 分`} icon={BarChart3} />
        <KpiCard label="对比维度" value={String(cols.length)} unit="项" delta={dim} icon={TrendingUp} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="综合指标分析" subtitle={`各企业${dim === '全部维度' ? '多维度' : dim}指标统计分布`} icon={BarChart3} />
          <DataTable
            columns={[
              { key: 'name', label: '企业' },
              ...colStats.map((col) => ({
                key: col.key,
                label: col.label,
                align: 'right' as const,
                render: (r: any) => {
                  const v = r[col.key]
                  return <span className="font-mono text-slate-800">{v}</span>
                },
              })),
            ]}
            rows={rows}
          />
        </Panel>
        <Panel>
          <PanelTitle title="综合能碳指数分布" subtitle="多指标归一化综合指数（0-100）" icon={BarChart3} />
          <BarGroup
            data={scored}
            keys={[{ key: '综合评分', name: '综合指数', color: '#2C7CFF' }]}
            nameKey="name"
            height={340}
          />
          <div className="mt-3 grid gap-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-[#DBE6EE] bg-white px-3 py-2">
              <span className="flex items-center gap-2 text-slate-800"><Building2 className="size-4 text-[#2C7CFF]" /> 指标基准单位</span>
              <span className="font-mono text-slate-800 font-medium">{best.name}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#DBE6EE] bg-white px-3 py-2">
              <span className="flex items-center gap-2 text-slate-800"><BarChart3 className="size-4 text-slate-400" /> 时序跟踪单位</span>
              <span className="font-mono text-slate-800 font-medium">{worst.name}</span>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel>
          <PanelTitle title="维度指标说明" subtitle="各维度指标定义与技术口径" icon={Leaf} />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {[
              { dim: '成本', icon: DollarSign, desc: '能源综合成本，反映用能经济性' },
              { dim: '产量', icon: Package, desc: '产品产量反映制造产出规模' },
              { dim: '排放', icon: Leaf, desc: '碳排放总量与万元产值碳强度' },
              { dim: '绿色能源', icon: Zap, desc: '直供与自发绿电消纳占比' },
              { dim: '零碳工厂', icon: Target, desc: '非化石能源消费与清洁电气化比率' },
            ].map((d) => (
              <div key={d.dim} className="rounded-lg border border-[#DBE6EE] bg-white p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-800"><d.icon className="size-4 text-[#2C7CFF]" />{d.dim}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{d.desc}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

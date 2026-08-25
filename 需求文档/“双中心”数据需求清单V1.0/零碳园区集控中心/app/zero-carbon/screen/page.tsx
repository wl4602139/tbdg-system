'use client'

import { useState } from 'react'
import {
  Building2,
  Factory,
  Leaf,
  Zap,
  Gauge,
  Target,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, KpiCard, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { AreaTrend, Donut, BarGroup } from '@/components/shared/charts'
import {
  screenKpis,
  parkProgress,
  energyTrend,
  greenPower,
  carbonTrend,
  parks,
} from '@/lib/mock-data'
import { seedFactor, vary } from '@/lib/variant'

const kpiIcons = [Building2, Factory, Leaf, Zap, Gauge, Target]

const periodLabels: Record<string, string[]> = {
  year: ['2021', '2022', '2023', '2024', '2025', '2026'],
  quarter: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
  month: ['1月', '2月', '3月', '4月', '5月', '6月'],
}

export default function ScreenPage() {
  const [park, setPark] = useState('all')
  const [period, setPeriod] = useState('year')

  /* 下拉联动：园区 + 周期共同决定数据缩放与时间轴 */
  const f = seedFactor(park, period)
  const labels = periodLabels[period] ?? periodLabels.month
  const relabel = <T extends Record<string, any>>(rows: T[]) =>
    rows.map((r, i) => ({ ...r, month: labels[i] ?? r.month }))

  const energyTrendV = relabel(vary(energyTrend, f))
  const greenPowerV = relabel(vary(greenPower, f))
  const carbonTrendV = relabel(vary(carbonTrend, f))
  const screenKpisV = screenKpis.map((k) => {
    const num = Number(String(k.value).replace(/,/g, ''))
    if (!Number.isFinite(num) || num === 0) return k
    const scaled = Math.round(num * f)
    return { ...k, value: scaled.toLocaleString('en-US') }
  })

  return (
    <div>
      <PageHeader
        title="集控中心大屏"
        positioning="对外窗口"
        desc="基于 GIS 展示零碳园区地理位置、建设阶段、成效对比与里程碑，面向集团领导层及企业参观对象。支持下钻进入园区碳管理系统。"
        actions={
          <>
            <Select
              label="园区"
              value={park}
              onChange={setPark}
              options={[
                { label: '全部园区', value: 'all' },
                ...parks.map((p) => ({ label: p, value: p })),
              ]}
            />
            <Select
              label="周期"
              value={period}
              onChange={setPeriod}
              options={[
                { label: '本年', value: 'year' },
                { label: '本季度', value: 'quarter' },
                { label: '本月', value: 'month' },
              ]}
            />
          </>
        }
      />

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {screenKpisV.map((k, i) => (
          <KpiCard key={k.label} {...k} icon={kpiIcons[i]} />
        ))}
      </div>

      {/* 主图区 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="综合能耗趋势" subtitle="各能源介质月度消耗（单位：万tce）" icon={Gauge} />
          <AreaTrend data={energyTrendV} keys={['电', '气', '水', '蒸汽']} stacked height={280} />
        </Panel>
        <Panel>
          <PanelTitle title="用能结构占比" subtitle="各能源介质占比" icon={Zap} />
          <Donut
            data={[
              { name: '电', value: 52, color: 'var(--chart-1)' },
              { name: '天然气', value: 21, color: 'var(--chart-3)' },
              { name: '蒸汽', value: 16, color: 'var(--chart-4)' },
              { name: '水', value: 7, color: 'var(--chart-2)' },
              { name: '其他', value: 4, color: 'var(--chart-5)' },
            ]}
            height={280}
          />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle title="绿电消纳情况" subtitle="直供绿电 + 交易绿电 + 购绿证（万kWh）" icon={Leaf} />
          <BarGroup data={greenPowerV} keys={['直供绿电', '交易绿电', '购绿证']} stacked height={260} />
        </Panel>
        <Panel>
          <PanelTitle title="碳排放趋势" subtitle="范围一 / 二 / 三 月度排放（tCO2）" icon={Target} />
          <AreaTrend data={carbonTrendV} keys={['范围一', '范围二', '范围三']} height={260} />
        </Panel>
      </div>

      {/* 园区建设进度 */}
      <Panel className="mt-4">
        <PanelTitle title="零碳园区建设进度与成效" subtitle="点击园区可下钻进入园区碳管理系统" icon={Building2} />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {parkProgress.map((p) => (
            <button
              key={p.park}
              className="group rounded-lg border border-border bg-panel p-4 text-left transition-colors hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{p.park}</span>
                <Badge
                  tone={p.stage === '已建成' ? 'success' : p.stage === '在建' ? 'primary' : 'warning'}
                >
                  {p.stage}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>建设进度</span>
                <span className="font-mono text-foreground">{p.progress}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">综合评分</span>
                <span className="font-mono text-primary">{p.score} 分</span>
              </div>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  )
}

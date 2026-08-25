'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, DataTable, StatusBadge, Toolbar, KpiCard } from '@/components/shared/primitives'
import { Tabs } from '@/components/shared/tabs'
import { Select } from '@/components/shared/select'
import { Donut, BarGroup, RadarCompare } from '@/components/shared/charts'
import { productFootprint, hotspotData, compareData } from '@/lib/mock-data'
import { seedFactor, vary } from '@/lib/variant'
import { Badge } from '@/components/shared/primitives'
import { indicators, indicatorTone } from '@/lib/indicators'
import { Sigma } from 'lucide-react'

const tabs = [
  { label: '产品碳足迹总览', value: 'overview' },
  { label: '同品类横向对比', value: 'compare' },
  { label: '碳热点分析与模拟', value: 'hotspot' },
  { label: '基准管理分析', value: 'benchmark' },
  { label: '管控指标', value: 'kpi' },
]

/* 集采中心管控指标 */
const cfIndicators = indicators.filter((i) => i.center === '集采')

const lineMap: Record<string, string> = { all: '', tr: '变压器', cable: '电缆', switch: '开关' }

export default function AnalysisPage() {
  const [tab, setTab] = useState('overview')
  const [reMat, setReMat] = useState(0)
  const [green, setGreen] = useState(0)
  const [line, setLine] = useState('all')
  const [seriesSel, setSeriesSel] = useState('all')
  const [sort, setSort] = useState('desc')
  const [cmpDim, setCmpDim] = useState('factory')

  /* 总览：按产线过滤 + 按碳足迹排序 */
  const overviewRows = productFootprint
    .filter((r) => line === 'all' || r.line?.includes(lineMap[line]))
    .slice()
    .sort((a, b) => (sort === 'desc' ? b.pcf - a.pcf : a.pcf - b.pcf))

  /* 对比：按工厂 / 按批次切换数据 */
  const compareView =
    cmpDim === 'factory'
      ? compareData
      : vary(compareData, seedFactor('batch')).map((r, i) => ({ ...r, factory: `批次 B${i + 1}` }))

  const simulated = hotspotData.map((d) =>
    d.name === '原材料获取'
      ? { ...d, value: Math.round(d.value * (1 - reMat / 100)) }
      : d.name === '生产制造'
        ? { ...d, value: Math.round(d.value * (1 - green / 100)) }
        : d,
  )
  const reducePct = Math.round((62 * reMat) / 100 + (21 * green) / 100)

  return (
    <div className="space-y-5">
      <PageHeader
        title="多维分析"
        positioning="横向 · 纵向 · 对标"
        desc="对产品碳足迹进行横向、纵向、对标分析，识别碳排热点，并对减排场景进行模拟。"
      />

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'overview' && (
        <Panel title="产品碳足迹总览" desc="各产线、各产品系列碳足迹分布与构成，支持按产线/产品系列筛选，红黑榜排名可下钻至经营单位及生产订单">
          <Toolbar>
            <Select label="产线" value={line} onChange={setLine} options={[{ label: '全部产线', value: 'all' }, { label: '变压器', value: 'tr' }, { label: '电缆', value: 'cable' }, { label: '开关', value: 'switch' }]} />
            <Select label="产品系列" value={seriesSel} onChange={setSeriesSel} options={[{ label: '全部系列', value: 'all' }, { label: 'SG10 系列', value: 'sg10' }, { label: 'YJV 系列', value: 'yjv' }]} />
            <Select label="排序" value={sort} onChange={setSort} options={[{ label: '碳足迹降序', value: 'desc' }, { label: '碳足迹升序', value: 'asc' }]} />
          </Toolbar>
          <DataTable
            columns={[
              { key: 'rank', label: '排名', render: (r) => <span className="font-mono text-primary">#{r.rank}</span> },
              { key: 'product', label: '产品名称' },
              { key: 'line', label: '产线' },
              { key: 'pcf', label: '碳足迹(kgCO2)', align: 'right', className: 'font-mono' },
              { key: 'base', label: '基准值', align: 'right', className: 'font-mono text-muted-foreground' },
              { key: 'diff', label: '对标', render: (r) => <StatusBadge tone={r.pcf <= r.base ? 'ok' : 'danger'}>{r.pcf <= r.base ? `低于基准 ${(((r.base - r.pcf) / r.base) * 100).toFixed(1)}%` : `高于基准 ${(((r.pcf - r.base) / r.base) * 100).toFixed(1)}%`}</StatusBadge> },
              { key: 'op', label: '操作', render: () => <button className="link-btn">下钻订单</button> },
            ]}
            rows={overviewRows}
          />
        </Panel>
      )}

      {tab === 'compare' && (
        <div className="space-y-5">
          <Panel title="同品类横向对比" desc="同一产品规格在不同工厂、不同批次间的碳足迹横向对比，通过差异分解定位核心差异原因">
            <Toolbar>
              <Select label="对比产品" options={[{ label: 'SG10-2500kVA 变压器', value: 'sg10' }, { label: 'YJV-8.7/15kV 电缆', value: 'yjv' }]} />
              <Select label="对比维度" value={cmpDim} onChange={setCmpDim} options={[{ label: '按工厂', value: 'factory' }, { label: '按批次', value: 'batch' }]} />
            </Toolbar>
            <BarGroup
              data={compareView}
              stacked
              nameKey="factory"
              keys={[
                { key: '原材料', name: '原材料', color: 'var(--chart-1)' },
                { key: '生产', name: '生产', color: 'var(--chart-3)' },
                { key: '运输', name: '运输', color: 'var(--chart-4)' },
              ]}
            />
          </Panel>
          <Panel title="差异分解排名" desc="快速识别低碳标杆与高碳改进对象">
            <DataTable
              columns={[
                { key: 'factory', label: '工厂' },
                { key: 'total', label: '总碳足迹', align: 'right', className: 'font-mono', render: (r) => (r.原材料 + r.生产 + r.运输).toLocaleString() },
                { key: 'mat', label: '原材料', align: 'right', className: 'font-mono', render: (r) => r.原材料 },
                { key: 'prod', label: '生产', align: 'right', className: 'font-mono', render: (r) => r.生产 },
                { key: 'trans', label: '运输', align: 'right', className: 'font-mono', render: (r) => r.运输 },
                { key: 'tag', label: '标签', render: (r) => <StatusBadge tone={(r.原材料 + r.生产 + r.运输) < 11500 ? 'ok' : 'warn'}>{(r.原材料 + r.生产 + r.运输) < 11500 ? '低碳标杆' : '改进对象'}</StatusBadge> },
              ]}
              rows={compareView}
            />
          </Panel>
        </div>
      )}

      {tab === 'hotspot' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="碳热点构成" desc="依据生产环节及原材料主材自动生成碳足迹构成，识别排放热点">
            <Donut data={simulated} />
          </Panel>
          <Panel title="减排场景模拟" desc="模拟原材料替换、绿电接入等场景的减排潜力，辅助低碳技术选型">
            <div className="space-y-6 py-2">
              <Slider label="再生铜替代原生铜比例" value={reMat} onChange={setReMat} />
              <Slider label="绿电接入比例" value={green} onChange={setGreen} />
              <div className="flex flex-col items-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
                <div className="text-sm text-[var(--muted)]">单台产品碳足迹预计下降</div>
                <div className="my-2 font-mono text-4xl font-bold text-[var(--success)]">{reducePct}%</div>
                <StatusBadge tone="ok">对应减少约 {(12680 * reducePct / 100).toFixed(0)} kgCO2/台</StatusBadge>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {tab === 'benchmark' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <KpiCard label="年度目标基准" value="12,000" unit="kgCO2" />
            <KpiCard label="行业标杆值" value="13,200" unit="kgCO2" />
            <KpiCard label="集团当前均值" value="12,680" unit="kgCO2" delta="-3.9% vs 行业" up />
          </div>
          <Panel title="集团产品与行业标杆差距" desc="支持自定义多级基准值（年度目标、行业标杆）">
            <RadarCompare
              data={[
                { dim: '变压器', 集团: 88, 行业标杆: 80 },
                { dim: '电缆', 集团: 76, 行业标杆: 82 },
                { dim: '开关', 集团: 91, 行业标杆: 78 },
                { dim: '互感器', 集团: 84, 行业标杆: 80 },
                { dim: '母线', 集团: 79, 行业标杆: 85 },
              ]}
              keys={[
                { key: '集团', name: '集团均值', color: 'var(--chart-1)' },
                { key: '行业标杆', name: '行业标杆', color: 'var(--chart-4)' },
              ]}
            />
          </Panel>
        </div>
      )}

      {tab === 'kpi' && (
        <Panel
          title="集采中心管控指标"
          desc="依据《管控指标明细》整理的集采中心指标（含计算公式、单位、来源与覆盖范围），支撑产品碳足迹的横向对比与对标"
        >
          <DataTable
            columns={[
              { key: 'name', label: '指标名称' },
              { key: 'category', label: '类别', render: (r) => <Badge tone="primary">{r.category}</Badge> },
              {
                key: 'formula',
                label: '计算公式',
                render: (r) => (
                  <span className="inline-flex items-center gap-1 text-xs text-primary">
                    <Sigma className="size-3.5 shrink-0" />
                    {r.formula}
                  </span>
                ),
              },
              { key: 'unit', label: '单位', className: 'text-muted-foreground' },
              { key: 'source', label: '指标来源', className: 'text-xs text-muted-foreground' },
              { key: 'scope', label: '覆盖范围', className: 'text-xs text-muted-foreground' },
              {
                key: 'status',
                label: '状态',
                render: (r) => (r.status ? <StatusBadge tone={indicatorTone(r.status)}>{r.status}</StatusBadge> : '—'),
              },
            ]}
            rows={cfIndicators}
          />
        </Panel>
      )}
    </div>
  )
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="font-mono text-primary">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
    </div>
  )
}

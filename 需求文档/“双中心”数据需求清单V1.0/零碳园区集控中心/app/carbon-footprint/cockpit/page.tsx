'use client'

import { useEffect, useState } from 'react'
import { Database, FileCheck2, Award, TrendingDown, Boxes, Factory } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, KpiCard, DataTable, StatusBadge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { AreaTrend, Donut, BarGroup } from '@/components/shared/charts'
import { carbonTrend, hotspotData, productFootprint, honors, parks } from '@/lib/mock-data'
import { seedFactor, vary } from '@/lib/variant'

export default function CockpitPage() {
  const [honorIdx, setHonorIdx] = useState(0)
  const [park, setPark] = useState('全部园区')
  const [industry, setIndustry] = useState('all')
  useEffect(() => {
    const t = setInterval(() => setHonorIdx((i) => (i + 1) % honors.length), 3000)
    return () => clearInterval(t)
  }, [])

  /* 园区 + 产业下拉联动：缩放趋势、构成与产品分布 */
  const f = seedFactor(park, industry)
  const carbonTrendV = vary(carbonTrend, f)
  const hotspotV = vary(hotspotData, f, { only: ['value'] })
  const productBar = vary(
    productFootprint.slice(0, 6).map((p) => ({ name: p.product.slice(0, 8), 碳足迹: p.pcf, 基准: p.base })),
    f,
    { only: ['碳足迹'] },
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="集团驾驶舱"
        positioning="对外示范窗口"
        desc="可视化展示集团各园区、各产业的碳足迹数值、分布、构成、趋势及热力图，满足集团对各大园区及各经营单位的碳足迹集中管控与辅助决策。"
        actions={
          <div className="flex gap-2">
            <Select label="园区" value={park} onChange={setPark} options={['全部园区', ...parks].map((p) => ({ label: p, value: p }))} />
            <Select label="产业" value={industry} onChange={setIndustry} options={[{ label: '全部产业', value: 'all' }, { label: '变压器', value: 'tr' }, { label: '电缆', value: 'cable' }, { label: '开关', value: 'switch' }]} />
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="实景库订单" value="48,260" unit="单" delta="+1,240" up icon={Database} />
        <KpiCard label="因子库因子" value="3,860" unit="个" delta="+126" up icon={Boxes} />
        <KpiCard label="认证产品" value="21" unit="项" delta="+3" up icon={FileCheck2} />
        <KpiCard label="平均碳足迹强度" value="0.58" unit="tCO2/万元" delta="-6.2%" up={false} icon={TrendingDown} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="集团碳足迹趋势" subtitle="按范围一/二/三拆解，支持下钻至各经营单位产品碳足迹" icon={Factory} />
          <AreaTrend
            data={carbonTrendV}
            keys={[
              { key: '范围一', name: '范围一', color: 'var(--chart-3)' },
              { key: '范围二', name: '范围二', color: 'var(--chart-1)' },
              { key: '范围三', name: '范围三', color: 'var(--chart-4)' },
            ]}
          />
        </Panel>
        <Panel>
          <PanelTitle title="碳足迹构成" subtitle="生命周期各环节占比" />
          <Donut data={hotspotV} />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelTitle title="各产业产品碳足迹分布" subtitle="点击下钻至经营单位与生产订单" />
          <BarGroup
            data={productBar}
            keys={[
              { key: '碳足迹', name: '产品碳足迹(kgCO2)', color: 'var(--chart-1)' },
              { key: '基准', name: '基准值(kgCO2)', color: 'var(--chart-5)' },
            ]}
          />
        </Panel>
        <Panel>
          <PanelTitle title="碳足迹红黑榜" subtitle="低碳标杆与高碳改进对象" />
          <DataTable
            columns={[
              { key: 'rank', label: '#', render: (r) => <span className="font-mono text-primary">{r.rank}</span> },
              { key: 'product', label: '产品', render: (r) => <span className="text-xs">{r.product.slice(0, 10)}</span> },
              { key: 'pcf', label: 'kgCO2', align: 'right', className: 'font-mono' },
              { key: 'flag', label: '', render: (r) => <StatusBadge tone={r.pcf <= r.base ? 'ok' : 'danger'}>{r.pcf <= r.base ? '优' : '高'}</StatusBadge> },
            ]}
            rows={productFootprint}
          />
        </Panel>
      </div>

      {/* 荣誉轮播 */}
      <Panel className="overflow-hidden">
        <div className="flex items-center gap-3">
          <Award className="size-5 shrink-0 text-[var(--warning)]" />
          <div className="relative h-6 flex-1 overflow-hidden">
            {honors.map((h, i) => (
              <div
                key={h}
                className="absolute inset-0 flex items-center text-sm text-foreground transition-all duration-500"
                style={{ transform: `translateY(${(i - honorIdx) * 100}%)`, opacity: i === honorIdx ? 1 : 0 }}
              >
                {h}
              </div>
            ))}
          </div>
          <div className="flex gap-1.5">
            {honors.map((_, i) => (
              <span key={i} className={i === honorIdx ? 'h-1.5 w-4 rounded-full bg-primary' : 'h-1.5 w-1.5 rounded-full bg-border'} />
            ))}
          </div>
        </div>
      </Panel>
    </div>
  )
}

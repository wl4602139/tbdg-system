'use client'

import { useMemo, useState } from 'react'
import { Database, Cpu, PencilLine, Layers } from 'lucide-react'
import { Panel, PanelTitle, DataTable, StatusBadge, KpiCard, Toolbar } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { catalogStats, type DataItem } from '@/lib/data-catalog'

/* 数据来源 → 徽章色 */
function sourceTone(source: string): 'ok' | 'info' | 'warn' | 'muted' {
  if (source.includes('系统接入')) return 'ok'
  if (source.includes('大数据') || source.includes('ERP') || source.includes('碳足迹系统')) return 'info'
  if (source.includes('录入') || source.includes('线下')) return 'warn'
  return 'muted'
}

export function DataCatalogView({
  items,
  title,
  desc,
  note,
}: {
  items: DataItem[]
  title: string
  desc: string
  note?: string
}) {
  const [kind, setKind] = useState('全部')
  const [source, setSource] = useState('全部')
  const [usage, setUsage] = useState('全部')

  const sourceOptions = useMemo(
    () => ['全部', ...Array.from(new Set(items.map((i) => i.source)))],
    [items],
  )
  const usageOptions = useMemo(() => {
    const set = new Set<string>()
    items.forEach((i) => i.usage.split('、').forEach((u) => set.add(u.trim())))
    return ['全部', ...Array.from(set)]
  }, [items])

  const rows = items.filter(
    (i) =>
      (kind === '全部' || i.kind === kind) &&
      (source === '全部' || i.source === source) &&
      (usage === '全部' || i.usage.includes(usage)),
  )

  const stat = catalogStats(items)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="数据项总数" value={String(stat.total)} unit="项" icon={Layers} />
        <KpiCard label="动态 / 静态" value={`${stat.dynamic} / ${stat.static}`} unit="项" icon={Database} />
        <KpiCard label="系统自动接入" value={String(stat.auto)} unit="项" icon={Cpu} />
        <KpiCard label="录入 / 线下收集" value={String(stat.manual)} unit="项" icon={PencilLine} />
      </div>

      <Panel title={title} desc={desc}>
        <Toolbar>
          <Select
            label="数据类型"
            value={kind}
            onChange={setKind}
            options={['全部', '静态数据', '动态数据'].map((k) => ({ label: k, value: k }))}
          />
          <Select
            label="数据来源"
            value={source}
            onChange={setSource}
            options={sourceOptions.map((s) => ({ label: s, value: s }))}
          />
          <Select
            label="用途"
            value={usage}
            onChange={setUsage}
            options={usageOptions.map((u) => ({ label: u, value: u }))}
          />
          <div className="ml-auto flex gap-2">
            <button className="rounded-md border border-border bg-panel px-3 py-2 text-sm text-foreground hover:border-primary/50">
              导出清单
            </button>
            <button className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary hover:bg-primary/20">
              + 新增数据项
            </button>
          </div>
        </Toolbar>

        <DataTable
          columns={[
            { key: 'id', label: '序号', className: 'font-mono text-muted-foreground' },
            {
              key: 'kind',
              label: '数据类型',
              render: (r) => <StatusBadge tone={r.kind === '静态数据' ? 'muted' : 'info'}>{r.kind}</StatusBadge>,
            },
            { key: 'name', label: '数据项名称' },
            { key: 'unit', label: '单位', className: 'text-muted-foreground' },
            { key: 'object', label: '数据对象' },
            {
              key: 'source',
              label: '数据来源',
              render: (r) => <StatusBadge tone={sourceTone(r.source)}>{r.source}</StatusBadge>,
            },
            { key: 'usage', label: '用途', className: 'text-muted-foreground' },
            { key: 'freq', label: '采集频率 / 备注', className: 'max-w-xs whitespace-normal text-xs text-muted-foreground' },
          ]}
          rows={rows}
        />
      </Panel>

      {note && (
        <Panel>
          <PanelTitle title="数据说明" icon={Database} />
          <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>
        </Panel>
      )}
    </div>
  )
}

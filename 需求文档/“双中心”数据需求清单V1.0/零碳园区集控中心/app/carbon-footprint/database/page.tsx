'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, StatusBadge, Toolbar, DataTable, KpiCard } from '@/components/shared/primitives'
import { Tabs } from '@/components/shared/tabs'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { BarGroup, Donut } from '@/components/shared/charts'
import { orderAccounting, traceNodes, cfReports, statusColor } from '@/lib/mock-data'
import { seedFactor, vary } from '@/lib/variant'
import { FileText, Download, GitBranch, QrCode, Search } from 'lucide-react'

export default function DatabasePage() {
  const [tab, setTab] = useState('accounting')
  const [dim, setDim] = useState('product')
  const [entry, setEntry] = useState('online')
  const [traceOpen, setTraceOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [activeOrder, setActiveOrder] = useState<string>('')

  /* 核算维度 + 核算入口联动：缩放各环节明细数值 */
  const f = seedFactor(dim, entry)
  const accountingRows = vary(orderAccounting, f, { only: ['material', 'produce', 'transport'] }).map((r) => ({
    ...r,
    total: Math.round(r.material + r.produce + r.transport),
  }))

  return (
    <div>
      <PageHeader
        title="实景数据库"
        desc="依据各经营单位核算结果与本地系统，对产品碳足迹进行实景核算、溯源与报告"
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: 'accounting', label: '碳足迹核算' },
          { value: 'trace', label: '原始数据穿透' },
          { value: 'report', label: '碳足迹报告' },
          { value: 'energy', label: '能耗追踪' },
        ]}
      />

      {tab === 'accounting' && (
        <div className="mt-4 space-y-4">
          <Toolbar>
            <Select
              label="核算维度"
              value={dim}
              onChange={setDim}
              options={[
                { value: 'industry', label: '按产业' },
                { value: 'line', label: '按产线' },
                { value: 'category', label: '按产品类别' },
                { value: 'model', label: '按产品型号' },
                { value: 'product', label: '按订单产品' },
              ]}
            />
            <Select
              label="核算入口"
              value={entry}
              onChange={setEntry}
              options={[
                { value: 'online', label: '在线核算' },
                { value: 'local', label: '实景核算（本地系统）' },
              ]}
            />
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-[var(--chart-2)]" />
                地图链接查看实景核算
              </span>
            </div>
          </Toolbar>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <KpiCard label="在线核算订单" value="12,480" unit="单" trend="+320" up />
            <KpiCard label="实景核算覆盖率" value="86.4" unit="%" trend="+2.1%" up />
            <KpiCard label="平均单台碳足迹" value="1,842" unit="kgCO2e" trend="-3.4%" up />
            <KpiCard label="数据完整性" value="99.2" unit="%" trend="+0.3%" up />
          </div>

          <DataTable
            columns={[
              { key: 'order', label: '订单号', className: 'font-mono' },
              { key: 'product', label: '产品型号' },
              { key: 'unit', label: '经营单位' },
              { key: 'material', label: '原材料', align: 'right' },
              { key: 'produce', label: '生产', align: 'right' },
              { key: 'transport', label: '运输', align: 'right' },
              {
                key: 'total',
                label: '合计(kgCO2e)',
                align: 'right',
                render: (r) => <span className="font-mono text-primary">{r.total}</span>,
              },
              {
                key: 'action',
                label: '操作',
                render: (r) => (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveOrder(r.order)
                      setTraceOpen(true)
                    }}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <GitBranch className="size-3.5" />
                    数据穿透
                  </button>
                ),
              },
            ]}
            rows={accountingRows}
          />
        </div>
      )}

      {tab === 'trace' && (
        <div className="mt-4 space-y-4">
          <Toolbar>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="输入订单号 / BOM 编码检索"
                className="h-9 w-72 rounded-md border border-border bg-secondary pl-8 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={() => setTraceOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              <GitBranch className="size-4" />
              生成计算路径图
            </button>
          </Toolbar>

          <Panel title="数据链溯源" desc="从原始数据（BOM、能耗、因子）到最终结果的计算路径">
            <div className="flex flex-col gap-3">
              {traceNodes.map((n, i) => (
                <div key={n.stage} className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-xs text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 rounded-lg border border-border bg-secondary/50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{n.stage}</span>
                      <span className="font-mono text-sm text-primary">{n.value} kgCO2e</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{n.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {tab === 'report' && (
        <div className="mt-4 space-y-4">
          <Toolbar>
            <span className="text-xs text-muted-foreground">依据 ISO 14067 自动生成碳足迹量化报告</span>
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              <FileText className="size-4" />
              生成报告
            </button>
          </Toolbar>
          <DataTable
            columns={[
              { key: 'no', label: '报告编号', className: 'font-mono' },
              { key: 'product', label: '产品型号' },
              { key: 'standard', label: '标准' },
              { key: 'date', label: '生成日期' },
              {
                key: 'status',
                label: '状态',
                render: (r) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge>,
              },
              {
                key: 'action',
                label: '操作',
                render: () => (
                  <div className="flex items-center gap-3 text-xs">
                    <button type="button" className="inline-flex items-center gap-1 text-primary hover:underline">
                      <Download className="size-3.5" /> Word
                    </button>
                    <button type="button" className="inline-flex items-center gap-1 text-primary hover:underline">
                      <Download className="size-3.5" /> PDF
                    </button>
                    <button type="button" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary">
                      <QrCode className="size-3.5" /> 验证码
                    </button>
                  </div>
                ),
              },
            ]}
            rows={cfReports}
          />
        </div>
      )}

      {tab === 'energy' && (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="产品型号能耗分摊" desc="依据能耗分摊算法实现型号级追踪">
            <BarGroup
              data={[
                { name: 'SZ11-1600', value: 3200 },
                { name: 'SZ11-2500', value: 4850 },
                { name: 'YJV-8.7', value: 1280 },
                { name: 'ZW32-12', value: 960 },
              ]}
              bars={[{ key: 'value', name: '单位能耗(kWh)', color: 'var(--chart-1)' }]}
            />
          </Panel>
          <Panel title="订单级能源构成" desc="电 / 天然气 / 蒸汽 占比">
            <Donut
              data={[
                { name: '电', value: 62 },
                { name: '天然气', value: 24 },
                { name: '蒸汽', value: 14 },
              ]}
            />
          </Panel>
        </div>
      )}

      <Modal open={traceOpen} onClose={() => setTraceOpen(false)} title={`数据链溯源 ${activeOrder}`}>
        <div className="space-y-3">
          {traceNodes.map((n, i) => (
            <div key={n.stage} className="flex items-center gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-xs text-primary">
                {i + 1}
              </div>
              <div className="flex-1 rounded-md border border-border bg-secondary/50 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{n.stage}</span>
                  <span className="font-mono text-xs text-primary">{n.value} kgCO2e</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="生成碳足迹量化报告">
        <div className="space-y-4">
          <Select
            label="选择产品型号"
            value="SZ11-1600"
            onChange={() => {}}
            options={[
              { value: 'SZ11-1600', label: 'SZ11-1600/10 变压器' },
              { value: 'YJV-8.7', label: 'YJV-8.7/15 电缆' },
              { value: 'ZW32-12', label: 'ZW32-12 开关' },
            ]}
          />
          <Select
            label="报告标准"
            value="iso14067"
            onChange={() => {}}
            options={[{ value: 'iso14067', label: 'ISO 14067:2018' }]}
          />
          <Select
            label="导出格式"
            value="pdf"
            onChange={() => {}}
            options={[
              { value: 'pdf', label: 'PDF' },
              { value: 'word', label: 'Word' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReportOpen(false)}
              className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => setReportOpen(false)}
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              生成并下载
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

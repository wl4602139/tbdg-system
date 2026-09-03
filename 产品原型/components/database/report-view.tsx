'use client'

import { useMemo, useState } from 'react'
import { Panel, Toolbar, DataTable } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { TimeFilter } from '@/components/procurement/cascade-filter'
import { Modal } from '@/components/shared/modal'
import { cfReports } from '@/lib/mock-data'
import { Download, QrCode, Search, RotateCcw, Eye, Trash2 } from 'lucide-react'

type Report = (typeof cfReports)[number]

const STAGES = [
  { name: '原材料获取', value: '5,301', ratio: '62.0%' },
  { name: '原材料运输', value: '58.4', ratio: '0.7%' },
  { name: '生产制造', value: '1,795.5', ratio: '21.0%' },
  { name: '废弃物处理', value: '0', ratio: '0%' },
]

const DEFAULT_FROM = '2026-06'
const DEFAULT_TO = '2026-08'

export function ReportView() {
  const [reports, setReports] = useState<Report[]>(cfReports)

  // 报告查询条件：经营单位 / 核算时间 / 产品型号
  const [unit, setUnit] = useState('all')
  const [product, setProduct] = useState('all')
  const [dFrom, setDFrom] = useState(DEFAULT_FROM)
  const [dTo, setDTo] = useState(DEFAULT_TO)
  const [applied, setApplied] = useState({ unit: 'all', product: 'all', from: DEFAULT_FROM, to: DEFAULT_TO })

  const [preview, setPreview] = useState<Report | null>(null)
  const [toDelete, setToDelete] = useState<Report | null>(null)

  const products = useMemo(() => Array.from(new Set(reports.map((r) => r.product))), [reports])
  const units = useMemo(() => Array.from(new Set(reports.map((r) => r.unit))), [reports])

  // 报告生成（核算）日期取月份（YYYY-MM），用于时间区间过滤
  const filtered = useMemo(
    () =>
      reports.filter((r) => {
        if (applied.unit !== 'all' && r.unit !== applied.unit) return false
        if (applied.product !== 'all' && r.product !== applied.product) return false
        const month = r.date.slice(0, 7)
        if (month < applied.from || month > applied.to) return false
        return true
      }),
    [reports, applied],
  )

  function onQuery() {
    setApplied({ unit, product, from: dFrom, to: dTo })
  }
  function onReset() {
    setUnit('all')
    setProduct('all')
    setDFrom(DEFAULT_FROM)
    setDTo(DEFAULT_TO)
    setApplied({ unit: 'all', product: 'all', from: DEFAULT_FROM, to: DEFAULT_TO })
  }
  function confirmDelete() {
    if (toDelete) setReports((rs) => rs.filter((r) => r.no !== toDelete.no))
    setToDelete(null)
  }

  return (
    <div className="space-y-4">
      <Panel
        className="relative z-30"
        title="碳足迹报告"
        desc="依据 ISO 14067 自动生成产品碳足迹量化报告，覆盖原材料获取 / 运输 / 生产制造 / 废弃物处理各生命周期阶段，支持查询、预览、删除与 Word / PDF 导出"
      >
        {/* 报告查询：经营单位 / 核算时间 / 产品型号 */}
        <Toolbar>
          <Select
            label="经营单位"
            value={unit}
            onChange={setUnit}
            options={[{ value: 'all', label: '全部经营单位' }, ...units.map((u) => ({ value: u, label: u }))]}
          />
          <TimeFilter from={dFrom} to={dTo} onFrom={setDFrom} onTo={setDTo} />
          <Select
            label="产品型号"
            value={product}
            onChange={setProduct}
            options={[{ value: 'all', label: '全部型号' }, ...products.map((p) => ({ value: p, label: p }))]}
          />
          <button
            type="button"
            onClick={onQuery}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Search className="size-4" />
            报告查询
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            重置
          </button>
        </Toolbar>

        <div className="mt-2">
          <DataTable
            columns={[
              { key: 'no', label: '报告编号', className: 'font-mono' },
              { key: 'unit', label: '经营单位' },
              { key: 'product', label: '产品型号' },
              { key: 'standard', label: '标准' },
              { key: 'date', label: '核算时间' },
              {
                key: 'action',
                label: '操作',
                render: (r) => (
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreview(r)}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Eye className="size-3.5" /> 预览
                    </button>
                    <button type="button" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary">
                      <Download className="size-3.5" /> Word
                    </button>
                    <button type="button" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary">
                      <Download className="size-3.5" /> PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(r)}
                      className="inline-flex items-center gap-1 text-[var(--destructive)] hover:underline"
                    >
                      <Trash2 className="size-3.5" /> 删除
                    </button>
                  </div>
                ),
              },
            ]}
            rows={filtered}
          />
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">未查询到符合条件的报告</div>
          )}
        </div>
      </Panel>

      {/* 报告预览 */}
      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        size="lg"
        title={`报告预览 · ${preview?.no ?? ''}`}
        description={`${preview?.product ?? ''} · ${preview?.standard ?? ''} · ${preview?.date ?? ''}`}
        footer={
          <>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground"
            >
              <Download className="size-4" /> 下载 PDF
            </button>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              关闭
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-secondary/40 p-4 text-center">
            <div className="text-xs text-muted-foreground">{preview?.product} 单位产品碳足迹</div>
            <div className="mt-1 font-mono text-2xl font-semibold text-foreground text-glow">
              8,554.9 <span className="text-sm text-muted-foreground">kgCO2e / 台</span>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-foreground">生命周期阶段碳排（kgCO2e）</div>
            <DataTable
              columns={[
                { key: 'name', label: '生命周期阶段' },
                { key: 'value', label: '碳排放量', align: 'right', render: (r) => <span className="font-mono">{r.value}</span> },
                { key: 'ratio', label: '占比', align: 'right' },
              ]}
              rows={STAGES}
            />
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3">
            <QrCode className="size-10 text-primary" />
            <div className="text-xs text-muted-foreground">
              扫码溯源验证 · 报告编号 {preview?.no}
              <div className="mt-1">数据依据 ISO 14067:2018，因子来源 eFootprint / IPCC / 国家温室气体数据库</div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 删除确认 */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="删除报告"
        footer={
          <>
            <button
              type="button"
              onClick={() => setToDelete(null)}
              className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground"
            >
              取消
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="h-9 rounded-md bg-[var(--destructive)] px-4 text-sm font-medium text-white"
            >
              确认删除
            </button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          确认删除报告 <span className="font-mono text-foreground">{toDelete?.no}</span>（{toDelete?.product}）？此操作不可撤销。
        </p>
      </Modal>
    </div>
  )
}

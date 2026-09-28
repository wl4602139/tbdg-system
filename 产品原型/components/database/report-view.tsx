'use client'

import { useMemo, useState } from 'react'
import { Panel, Toolbar, DataTable } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { TimeFilter } from '@/components/procurement/cascade-filter'
import { Modal } from '@/components/shared/modal'
import { cfReports } from '@/lib/mock-data'
import { leafUnits, industries, allModelsOf } from '@/lib/procurement'
import { Download, QrCode, Search, RotateCcw, Eye, Trash2, FilePlus, Check, Loader2 } from 'lucide-react'

type Report = (typeof cfReports)[number]

/* 支持的核算标准（可多选，一次生成多份报告），按国际 / 国内分组 */
const STANDARD_GROUPS = [
  { group: '国际标准', items: ['ISO 14067', 'PAS 2050', 'GHG Protocol', '欧盟 PEF'] },
  { group: '国内标准', items: ['GB/T 24067-2024', 'GB/T 24040/24044', 'GB/T 32150-2015'] },
] as const
const CF_STANDARDS = STANDARD_GROUPS.flatMap((g) => g.items)

/* 生成用可选项：全部经营单位 & 全部产品型号 */
const GEN_UNITS = leafUnits.map((l) => l.name)
const GEN_MODELS = Array.from(new Set(industries.flatMap((ind) => allModelsOf(ind).map((m) => m.model))))

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

  // 报告生成：经营单位 / 产品型号 / 核算时间区间 / 核算标准（可多选）
  const [genOpen, setGenOpen] = useState(false)
  const [genUnit, setGenUnit] = useState(GEN_UNITS[0])
  const [genProduct, setGenProduct] = useState(GEN_MODELS[0])
  const [genFrom, setGenFrom] = useState(DEFAULT_FROM)
  const [genTo, setGenTo] = useState(DEFAULT_TO)
  const [genStandards, setGenStandards] = useState<string[]>(['ISO 14067'])
  const [generating, setGenerating] = useState(false)

  function toggleStandard(s: string) {
    setGenStandards((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))
  }
  function openGen() {
    setGenUnit(GEN_UNITS[0])
    setGenProduct(GEN_MODELS[0])
    setGenFrom(DEFAULT_FROM)
    setGenTo(DEFAULT_TO)
    setGenStandards(['ISO 14067'])
    setGenOpen(true)
  }
  function runGenerate() {
    if (!genStandards.length || generating) return
    setGenerating(true)
    // 模拟异步核算；每个选中的标准生成一份报告
    setTimeout(() => {
      setReports((rs) => {
        const maxSeq = rs.reduce((m, r) => {
          const n = Number(r.no.split('-').pop())
          return Number.isFinite(n) ? Math.max(m, n) : m
        }, 0)
        // 核算时间以所选区间的截止月为准，确保落在查询范围内
        const acctDate = `${genTo}-15`
        const created = genStandards.map((standard, i) => ({
          no: `CFR-2026-${String(maxSeq + 1 + i).padStart(4, '0')}`,
          unit: genUnit,
          product: genProduct,
          standard,
          date: acctDate,
          status: '已生成',
        }))
        return [...created, ...rs]
      })
      // 同步查询条件到本次生成范围，使新报告立即可见
      setUnit(genUnit)
      setProduct(genProduct)
      setDFrom(genFrom)
      setDTo(genTo)
      setApplied({ unit: genUnit, product: genProduct, from: genFrom, to: genTo })
      setGenerating(false)
      setGenOpen(false)
    }, 700)
  }

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
          <button
            type="button"
            onClick={openGen}
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <FilePlus className="size-4" />
            报告生成
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

      {/* 报告生成：选择经营单位 / 产品型号 / 核算时间 / 核算标准（可多选） */}
      <Modal
        open={genOpen}
        onClose={() => !generating && setGenOpen(false)}
        size="lg"
        title="报告生成"
        description="选择核算对象与时间区间，勾选一个或多个核算标准，系统按标准分别生成产品碳足迹报告"
        footer={
          <>
            <button
              type="button"
              onClick={() => setGenOpen(false)}
              disabled={generating}
              className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={runGenerate}
              disabled={generating || genStandards.length === 0}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {generating ? <Loader2 className="size-4 animate-spin" /> : <FilePlus className="size-4" />}
              {generating ? '生成中…' : `生成报告${genStandards.length > 1 ? ` (${genStandards.length} 份)` : ''}`}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="经营单位"
              value={genUnit}
              onChange={setGenUnit}
              options={GEN_UNITS.map((u) => ({ value: u, label: u }))}
            />
            <Select
              label="产品型号"
              value={genProduct}
              onChange={setGenProduct}
              options={GEN_MODELS.map((p) => ({ value: p, label: p }))}
            />
          </div>
          <div>
            <div className="mb-2 text-xs text-muted-foreground">核算时间</div>
            <TimeFilter from={genFrom} to={genTo} onFrom={setGenFrom} onTo={setGenTo} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">核算标准（可多选）</span>
              <span className="text-[11px] text-muted-foreground">已选 {genStandards.length} 项</span>
            </div>
            <div className="space-y-3">
              {STANDARD_GROUPS.map((g) => (
                <div key={g.group}>
                  <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{g.group}</div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s) => {
                      const on = genStandards.includes(s)
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleStandard(s)}
                          aria-pressed={on}
                          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                            on
                              ? 'border-primary/50 bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                          }`}
                        >
                          <span className={`flex size-4 items-center justify-center rounded-[4px] border ${on ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                            {on && <Check className="size-3" />}
                          </span>
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

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

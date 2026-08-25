'use client'

import { useState } from 'react'
import { Activity, Sun, FileText, Paperclip, Download, ChevronRight, ChevronDown, Factory, MonitorCog, Leaf, Search, Zap, BarChart3 } from 'lucide-react'
import { Panel, PanelTitle, Badge, DataTable, KpiCard } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { LineTrend, Donut } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { seedFactor, vary } from '@/lib/variant'
import { orgTree, isLeaf, filterOrg, findOrgNode, type OrgNode } from '@/lib/org'
import { cn } from '@/lib/utils'

type GreenSource = {
  key: string
  name: string
  ratio: number
  qty: number
  color: string
  desc: string
  detail: { period: string; qty: string; from: string; no: string }[]
  files: { name: string; type: string; size: string }[]
}

const greenSources: GreenSource[] = [
  {
    key: 'direct',
    name: '直供绿电（新能源）',
    ratio: 58,
    qty: 7.3,
    color: 'var(--chart-2)',
    desc: '厂区分布式光伏 + 风电就地消纳，物理直供可溯源',
    detail: [
      { period: '当日', qty: '7.3 万kWh', from: '厂区光伏并网点', no: 'PV-2026-0819' },
      { period: '本月累计', qty: '182.6 万kWh', from: '厂区光伏 + 风电', no: 'PV-2026-08' },
      { period: '本年累计', qty: '1,486 万kWh', from: '厂区新能源', no: 'PV-2026' },
    ],
    files: [
      { name: '分布式光伏并网协议.pdf', type: 'PDF', size: '2.4 MB' },
      { name: '光伏发电计量报告-2026.08.xlsx', type: 'Excel', size: '860 KB' },
    ],
  },
  {
    key: 'trade',
    name: '交易绿电',
    ratio: 29,
    qty: 3.7,
    color: 'var(--chart-1)',
    desc: '通过电力交易中心购入的绿色电力，含省内绿电交易',
    detail: [
      { period: '当日', qty: '3.7 万kWh', from: '省电力交易中心', no: 'GT-2026-1187' },
      { period: '本月累计', qty: '92.4 万kWh', from: '绿电中长期交易', no: 'GT-2026-08' },
      { period: '本年累计', qty: '742 万kWh', from: '绿电交易合约', no: 'GT-2026' },
    ],
    files: [{ name: '绿电交易结算单-2026.08.pdf', type: 'PDF', size: '1.8 MB' }],
  },
  {
    key: 'cert',
    name: '购买绿证',
    ratio: 13,
    qty: 1.6,
    color: 'var(--chart-3)',
    desc: '购买绿色电力证书抵消外购电力碳排放',
    detail: [
      { period: '当日', qty: '16 个（1.6 万kWh）', from: '绿证核发平台', no: 'GEC-2026-4471' },
      { period: '本月累计', qty: '412 个', from: '绿证交易', no: 'GEC-2026-08' },
      { period: '本年累计', qty: '3,268 个', from: '绿证交易', no: 'GEC-2026' },
    ],
    files: [{ name: '绿证认购凭证-2026.08.pdf', type: 'PDF', size: '640 KB' }],
  },
]

export default function GreenPage() {
  const [openNodes, setOpenNodes] = useState<string[]>(orgTree.map((n) => n.name))
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [keyword, setKeyword] = useState('')
  const [attachSrc, setAttachSrc] = useState<GreenSource | null>(null)

  const filteredOrg = filterOrg(orgTree, keyword)
  const unitKey = selectedUnit ?? '全局'
  const f = seedFactor(unitKey)

  /* 非叶子节点 → 子节点绿电指标对比分析 */
  const selectedNode = selectedUnit ? findOrgNode(selectedUnit) : null
  const isNonLeaf = !!selectedNode && !isLeaf(selectedNode)
  const childNodes = isNonLeaf && selectedNode ? (selectedNode.children ?? []) : []
  const compareCols = [
    { key: '绿电占比', label: '绿电占比(%)', better: 'high' as const },
    { key: '光伏装机', label: '光伏装机(MW)', better: 'high' as const },
    { key: '发电量', label: '当日发电(万kWh)', better: 'high' as const },
    { key: '消纳率', label: '消纳率(%)', better: 'high' as const },
  ]
  const childCompare = childNodes.map((child) => {
    const cf = seedFactor(child.name)
    return {
      name: child.name,
      绿电占比: Math.round(20 + cf * 50),
      光伏装机: Math.round(5 + cf * 30),
      发电量: +(1.5 + cf * 5).toFixed(1),
      消纳率: Math.round(85 + cf * 12),
    }
  })
  const colStats = compareCols.map((col) => {
    const vals = childCompare.map((r) => r[col.key as keyof typeof r] as number)
    const best = col.better === 'low' ? Math.min(...vals) : Math.max(...vals)
    const worst = col.better === 'low' ? Math.max(...vals) : Math.min(...vals)
    return { ...col, best, worst }
  })
  const firstLevelCompare = orgTree.map((l1) => {
    const cf = seedFactor(l1.name)
    return {
      name: l1.name,
      绿电占比: Math.round(20 + cf * 50),
      光伏装机: Math.round(20 + cf * 60),
      发电量: +(5 + cf * 15).toFixed(1),
      消纳率: Math.round(85 + cf * 12),
    }
  })
  const firstLevelStats = compareCols.map((col) => {
    const vals = firstLevelCompare.map((r) => r[col.key as keyof typeof r] as number)
    const best = col.better === 'low' ? Math.min(...vals) : Math.max(...vals)
    const worst = col.better === 'low' ? Math.max(...vals) : Math.min(...vals)
    return { ...col, best, worst }
  })

  const toggleNode = (key: string) =>
    setOpenNodes((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))

  const selectUnit = (key: string, name: string) => {
    setSelectedUnit(selectedUnit === name ? null : name)
    if (!openNodes.includes(key)) toggleNode(key)
  }

  const renderOrg = (node: OrgNode, path: string, level: number): React.ReactNode => {
    const key = path
    const open = openNodes.includes(key)
    const leaf = isLeaf(node)
    const active = selectedUnit === node.name
    const gf = seedFactor(node.name)
    const greenRatio = Math.round(20 + gf * 50)
    return (
      <div key={key}>
        <div className={cn('flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 transition-colors', active ? 'bg-primary/15 text-primary' : 'hover:bg-accent/40')}>
          <button type="button" onClick={() => toggleNode(key)} className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground">
            {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </button>
          <button type="button" onClick={() => selectUnit(key, node.name)} className="flex flex-1 items-center gap-2 text-left">
            {level === 1 ? <Factory className="size-3.5 shrink-0 text-primary" /> : <span className="size-1.5 shrink-0 rounded-full bg-primary/60" />}
            <span className={cn('truncate', level === 1 ? 'font-semibold' : level === 2 ? 'font-medium' : 'text-[13px]')}>{node.name}</span>
          </button>
          <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-[var(--success)]">
            <Zap className="size-3" /> {greenRatio}%
          </span>
        </div>
        {open && (
          <div className="ml-3 border-l border-border/60 pl-2">
            {(node.children ?? []).map((child) => renderOrg(child, `${key}/${child.name}`, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* ============ 左侧树 ============ */}
      <Panel className="self-start" bodyClassName="px-1">
        <PanelTitle title="经营单位" subtitle="单位层级 · 绿电占比" icon={MonitorCog} />
        <div className="mb-2 flex items-center gap-1.5 rounded-md border border-border bg-panel px-2.5 py-1.5">
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索经营单位"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="text-sm">{filteredOrg.map((l1) => renderOrg(l1, l1.name, 1))}</div>
      </Panel>

      {/* ============ 右侧 ============ */}
      <div className="grid content-start gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Leaf className="size-3.5 text-[var(--success)]" />
            节点右侧为各单位绿电占比
          </div>
          <TimeRange />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="光伏装机容量" value={(86 * f).toFixed(0)} unit="MW" delta="+12%" up icon={Sun} />
          <KpiCard label="当日发电量" value={(12.6 * f).toFixed(1)} unit="万kWh" delta="+8.4%" up icon={Zap} />
          <KpiCard label="绿电占比" value={selectedUnit ? Math.round(20 + seedFactor(selectedUnit) * 50) : 38.6} unit="%" delta="+3.2%" up icon={Sun} />
          <KpiCard label="新能源消纳率" value={(96.2 * f).toFixed(1)} unit="%" delta="+1.1%" up icon={Sun} />
        </div>

        {!selectedUnit && (
          <Panel>
            <PanelTitle title="一级公司绿电指标对比" subtitle="各一级公司绿电指标对比（绿=最优，橙=最差）" icon={BarChart3} />
            <DataTable
              columns={[
                { key: 'name', label: '一级公司' },
                ...firstLevelStats.map((col) => ({
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
              ]}
              rows={firstLevelCompare}
            />
          </Panel>
        )}

        {isNonLeaf && (
          <Panel>
            <PanelTitle title={`${selectedUnit} · 子单位绿电指标对比`} subtitle="快速识别各子单位绿电指标优劣（绿=最优，橙=最差）" icon={BarChart3} />
            <DataTable
              columns={[
                { key: 'name', label: '子单位' },
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
              ]}
              rows={childCompare}
            />
          </Panel>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2">
            <PanelTitle title={`${selectedUnit ?? '全局'} · 绿电消纳趋势`} subtitle="直供绿电 + 交易绿电 + 购绿证（当周 万kWh）" icon={Sun} />
            <LineTrend
              data={vary(
                [
                  { month: '周一', 直供绿电: 6.2, 交易绿电: 3.1, 购买绿证: 1.2 },
                  { month: '周二', 直供绿电: 7.1, 交易绿电: 3.4, 购买绿证: 1.3 },
                  { month: '周三', 直供绿电: 7.3, 交易绿电: 3.7, 购买绿证: 1.6 },
                  { month: '周四', 直供绿电: 6.8, 交易绿电: 3.2, 购买绿证: 1.4 },
                  { month: '周五', 直供绿电: 7.9, 交易绿电: 4.1, 购买绿证: 1.7 },
                  { month: '周六', 直供绿电: 5.6, 交易绿电: 2.8, 购买绿证: 1.1 },
                  { month: '周日', 直供绿电: 4.9, 交易绿电: 2.4, 购买绿证: 0.9 },
                ],
                f,
              )}
              keys={['直供绿电', '交易绿电', '购买绿证']}
              height={260}
            />
          </Panel>
          <Panel>
            <PanelTitle title="绿电来源构成" subtitle="当日绿电证据链占比" icon={Sun} />
            <Donut data={greenSources.map((s) => ({ name: s.name, value: s.ratio, color: s.color }))} height={220} />
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 py-2 text-sm text-primary hover:bg-primary/20">
              <FileText className="size-4" /> 生成绿电消纳报告
            </button>
          </Panel>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {greenSources.map((s) => (
            <Panel key={s.key}>
              <PanelTitle title={s.name} subtitle={s.desc} icon={Sun} action={<Badge tone="primary">{s.ratio}%</Badge>} />
              <div className="mb-3 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-semibold text-foreground text-glow">{(s.qty * f).toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">万kWh · 当日</span>
              </div>
              <DataTable
                columns={[
                  { key: 'period', label: '周期' },
                  { key: 'qty', label: '电量/数量', className: 'font-mono' },
                  { key: 'from', label: '数据来源', className: 'text-muted-foreground' },
                ]}
                rows={s.detail}
              />
              <button
                type="button"
                onClick={() => setAttachSrc(s)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-panel py-2 text-xs text-foreground transition-colors hover:border-primary/50"
              >
                <Paperclip className="size-3.5" /> 查看附件材料（{s.files.length}）
              </button>
            </Panel>
          ))}
        </div>
      </div>

      <Modal
        open={!!attachSrc}
        onClose={() => setAttachSrc(null)}
        title={attachSrc ? `${attachSrc.name} · 附件材料` : ''}
        description="绿电证据链支撑材料，支持在线查看与下载"
        size="lg"
      >
        {attachSrc && (
          <div className="grid gap-2">
            {attachSrc.files.map((file) => (
              <div key={file.name} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-panel px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
                    <FileText className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.type} · {file.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground hover:border-primary/50">预览</button>
                  <button className="flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-xs text-primary hover:bg-primary/20">
                    <Download className="size-3.5" /> 下载
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}

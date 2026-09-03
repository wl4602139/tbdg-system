'use client'

import { useMemo, useState } from 'react'
import { Boxes, Search, RotateCcw, Download, History, Lock, RefreshCw, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Panel, DataTable, StatusBadge, Badge } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { Select } from '@/components/shared/select'
import { sysFactors, sysFactorCategories, type SysFactor } from '@/lib/mock-data'
import { inputCls, ActionBtn } from '@/components/system/ui'

/* 上次因子同步时间（由因子库统一下发） */
const LAST_SYNC = '2026-08-17 02:00'

/* 依据当前版本推导只读版本历史（数据随因子库同步，此处仅供查看） */
function versionHistory(f: SysFactor) {
  return [
    { version: f.version, date: f.effective, note: '因子库最新版本，已同步', synced: true },
    { version: 'v2023.2', date: '2025-06-01', note: '按低位热值修订', synced: false },
    { version: 'v2023.1', date: '2025-01-01', note: '初始建库', synced: false },
  ]
}

export function FactorSection() {
  const [cat, setCat] = useState('all')
  const [kw, setKw] = useState('')
  const [applied, setApplied] = useState({ cat: 'all', kw: '' })
  const [verRow, setVerRow] = useState<SysFactor | null>(null)

  const rows = useMemo(
    () =>
      sysFactors.filter((f) => {
        if (applied.cat !== 'all' && f.category !== applied.cat) return false
        if (applied.kw && !`${f.name}${f.source}`.toLowerCase().includes(applied.kw.toLowerCase())) return false
        return true
      }),
    [applied],
  )

  return (
    <Panel
      title="能碳基础因子管理"
      icon={Boxes}
      actions={<ActionBtn><Download className="size-4" /> 导出因子集</ActionBtn>}
    >
      {/* 同步说明：只读，数据来自因子库管理 */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-primary/25 bg-primary/[0.04] px-3 py-2.5 text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium text-primary">
          <Lock className="size-3.5" /> 只读视图
        </span>
        <span className="text-muted-foreground">
          本模块因子由「产品碳足迹集采中心 · 因子库管理」统一维护并自动同步，此处不支持新增与编辑，仅可查询与查看版本。
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <RefreshCw className="size-3.5" /> 上次同步 <span className="font-mono text-foreground">{LAST_SYNC}</span>
        </span>
        <Link
          href="/carbon-footprint/factor/material"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          前往因子库管理 <ExternalLink className="size-3.5" />
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">关键字</span>
          <input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="因子名称 / 来源" className={`${inputCls} w-52`} />
        </label>
        <div className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">因子类别</span>
          <Select value={cat} onChange={setCat} options={[{ label: '全部类别', value: 'all' }, ...sysFactorCategories.map((c) => ({ label: c, value: c }))]} />
        </div>
        <ActionBtn variant="primary" onClick={() => setApplied({ cat, kw })}><Search className="size-4" /> 查询</ActionBtn>
        <ActionBtn onClick={() => { setCat('all'); setKw(''); setApplied({ cat: 'all', kw: '' }) }}><RotateCcw className="size-4" /> 重置</ActionBtn>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: '因子名称' },
          { key: 'category', label: '类别', render: (r) => <Badge tone="primary">{r.category}</Badge> },
          { key: 'value', label: '因子值', align: 'right', render: (r) => <span className="font-mono text-foreground">{r.value}</span> },
          { key: 'unit', label: '单位', className: 'text-xs text-muted-foreground' },
          { key: 'source', label: '数据来源' },
          { key: 'scope', label: '适用范围' },
          { key: 'version', label: '同步版本', className: 'font-mono text-xs' },
          { key: 'effective', label: '生效日期', className: 'font-mono text-xs' },
          { key: 'status', label: '状态', render: (r) => <StatusBadge tone={r.status === '启用' ? 'ok' : 'muted'}>{r.status}</StatusBadge> },
          {
            key: 'op',
            label: '操作',
            render: (r) => (
              <button onClick={() => setVerRow(r)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                <History className="size-3.5" /> 版本查看
              </button>
            ),
          },
        ]}
        rows={rows}
      />

      {/* 只读版本查看 */}
      <Modal
        open={!!verRow}
        onClose={() => setVerRow(null)}
        title={`版本查看 · ${verRow?.name ?? ''}`}
        description="版本随因子库同步，系统管理侧仅供查看，不可编辑"
        footer={<ActionBtn onClick={() => setVerRow(null)}>关闭</ActionBtn>}
      >
        {verRow && (
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
                <div className="text-xs text-muted-foreground">当前因子值</div>
                <div className="mt-1 font-mono text-lg text-foreground">{verRow.value}</div>
                <div className="text-[11px] text-muted-foreground">{verRow.unit}</div>
              </div>
              <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
                <div className="text-xs text-muted-foreground">数据来源</div>
                <div className="mt-1 text-sm text-foreground">{verRow.source}</div>
              </div>
              <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
                <div className="text-xs text-muted-foreground">适用范围</div>
                <div className="mt-1 text-sm text-foreground">{verRow.scope}</div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">版本历史</div>
              <div className="space-y-2">
                {versionHistory(verRow).map((v) => (
                  <div key={v.version} className="flex items-center gap-3 rounded-lg border border-border bg-panel px-3 py-2">
                    <span className="font-mono text-sm text-foreground">{v.version}</span>
                    {v.synced && <Badge tone="success">当前同步</Badge>}
                    <span className="flex-1 text-xs text-muted-foreground">{v.note}</span>
                    <span className="font-mono text-xs text-muted-foreground">{v.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Panel>
  )
}

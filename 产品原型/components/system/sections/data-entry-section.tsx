'use client'

import { useMemo, useState } from 'react'
import { ClipboardEdit, Plus, Upload, Search, RotateCcw } from 'lucide-react'
import { Panel, DataTable, StatusBadge, type BadgeTone } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { Select } from '@/components/shared/select'
import { sysEntries, sysEntryTypes, type SysEntry } from '@/lib/mock-data'
import { Field, inputCls, ActionBtn } from '@/components/system/ui'

const STATUS_TONE: Record<SysEntry['status'], BadgeTone> = {
  草稿: 'muted',
  待审核: 'warn',
  已入库: 'ok',
  已退回: 'danger',
}

export function DataEntrySection() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [applied, setApplied] = useState({ type: 'all', status: 'all' })
  const [addOpen, setAddOpen] = useState(false)
  const [entryType, setEntryType] = useState(sysEntryTypes[0])

  const rows = useMemo(
    () =>
      sysEntries.filter((e) => {
        if (applied.type !== 'all' && e.type !== applied.type) return false
        if (applied.status !== 'all' && e.status !== applied.status) return false
        return true
      }),
    [applied],
  )

  const stats = useMemo(() => {
    const total = sysEntries.length
    return {
      total,
      pending: sysEntries.filter((e) => e.status === '待审核').length,
      stored: sysEntries.filter((e) => e.status === '已入库').length,
      returned: sysEntries.filter((e) => e.status === '已退回').length,
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {/* 概览 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: '录入批次', value: stats.total, tone: 'text-foreground' },
          { label: '待审核', value: stats.pending, tone: 'text-[var(--warning)]' },
          { label: '已入库', value: stats.stored, tone: 'text-[var(--success)]' },
          { label: '已退回', value: stats.returned, tone: 'text-[var(--destructive)]' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`mt-1.5 font-mono text-2xl font-semibold ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <Panel
        title="数据录入台账"
        icon={ClipboardEdit}
        actions={
          <div className="flex gap-2">
            <ActionBtn><Upload className="size-4" /> 批量导入</ActionBtn>
            <ActionBtn variant="primary" onClick={() => setAddOpen(true)}><Plus className="size-4" /> 新增录入</ActionBtn>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">数据类型</span>
            <Select value={typeFilter} onChange={setTypeFilter} options={[{ label: '全部类型', value: 'all' }, ...sysEntryTypes.map((t) => ({ label: t, value: t }))]} />
          </div>
          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">状态</span>
            <Select value={statusFilter} onChange={setStatusFilter} options={[{ label: '全部状态', value: 'all' }, { label: '草稿', value: '草稿' }, { label: '待审核', value: '待审核' }, { label: '已入库', value: '已入库' }, { label: '已退回', value: '已退回' }]} />
          </div>
          <ActionBtn variant="primary" onClick={() => setApplied({ type: typeFilter, status: statusFilter })}>
            <Search className="size-4" /> 查询
          </ActionBtn>
          <ActionBtn onClick={() => { setTypeFilter('all'); setStatusFilter('all'); setApplied({ type: 'all', status: 'all' }) }}>
            <RotateCcw className="size-4" /> 重置
          </ActionBtn>
        </div>

        <DataTable
          columns={[
            { key: 'batch', label: '录入批次', className: 'font-mono text-xs' },
            { key: 'type', label: '数据类型' },
            { key: 'org', label: '经营单位' },
            { key: 'period', label: '数据周期', className: 'font-mono text-xs' },
            { key: 'submitter', label: '提交人' },
            { key: 'submitTime', label: '提交时间', className: 'font-mono text-xs' },
            { key: 'status', label: '状态', render: (r) => <StatusBadge tone={STATUS_TONE[r.status as SysEntry['status']]}>{r.status}</StatusBadge> },
            {
              key: 'op',
              label: '操作',
              render: (r) => (
                <div className="flex gap-3 text-xs">
                  <button className="text-primary hover:underline">查看</button>
                  {(r.status === '草稿' || r.status === '已退回') && <button className="text-primary hover:underline">编辑</button>}
                  {r.status === '待审核' && <button className="text-[var(--success)] hover:underline">审核</button>}
                </div>
              ),
            },
          ]}
          rows={rows}
        />
      </Panel>

      {/* 新增录入 */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="新增数据录入"
        description="选择数据类型与周期，手工录入或上传台账文件"
        footer={
          <>
            <ActionBtn onClick={() => setAddOpen(false)}>存为草稿</ActionBtn>
            <ActionBtn variant="primary" onClick={() => setAddOpen(false)}>提交审核</ActionBtn>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="数据类型" required>
              <Select className="w-full [&>div]:w-full" value={entryType} onChange={setEntryType} options={sysEntryTypes.map((t) => ({ label: t, value: t }))} />
            </Field>
            <Field label="经营单位" required><input className={inputCls} placeholder="如：衡变本部" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="数据周期" required><input className={inputCls} placeholder="2026-07" /></Field>
            <Field label="计量单位"><input className={inputCls} placeholder="如：kWh / t / m³" /></Field>
          </div>
          <Field label="数据数值" required><input className={inputCls} placeholder="请输入本期数值" /></Field>
          <Field label="台账附件" hint="支持 Excel / PDF，作为数据来源佐证">
            <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/20 px-3 py-6 text-sm text-muted-foreground">
              <Upload className="size-4" /> 点击或拖拽上传台账文件
            </div>
          </Field>
          <Field label="备注"><textarea className={`${inputCls} h-16 py-2`} placeholder="选填" /></Field>
        </div>
      </Modal>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, StatusBadge, Toolbar, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Tabs } from '@/components/shared/tabs'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { factorSets, factorItems, factorDispatch } from '@/lib/mock-data'
import { RefreshCw, Send, Search, Pencil, CheckCircle2 } from 'lucide-react'

const unitLabel: Record<string, string> = { all: '', tj: '天津', hy: '衡阳', sy: '沈阳' }

export default function FactorPage() {
  const [tab, setTab] = useState('sync')
  const [editOpen, setEditOpen] = useState(false)
  const [editItem, setEditItem] = useState<string>('')
  const [dispatchUnit, setDispatchUnit] = useState('all')

  /* 目标经营单位下拉过滤下发日志 */
  const dispatchRows =
    dispatchUnit === 'all'
      ? factorDispatch
      : factorDispatch.filter((r) => r.unit?.includes(unitLabel[dispatchUnit]))

  return (
    <div>
      <PageHeader title="因子库管理" desc="建立特变电工各产业本地化因子库，统一构建、下发与版本管理" />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: 'sync', label: '股份因子同步' },
          { value: 'dispatch', label: '经营单位因子下发' },
          { value: 'build', label: '因子集构建' },
        ]}
      />

      {tab === 'sync' && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <KpiCard label="已同步因子" value="1,230" unit="项" trend="+48" up />
            <KpiCard label="最近同步" value="08-15" unit="02:00" trend="成功" up />
            <KpiCard label="同步来源" value="股份碳足迹系统" unit="" trend="" up />
          </div>
          <Panel
            title="股份因子同步"
            desc="待股份公司产品碳足迹系统上线后，可从股份碳足迹系统同步原材料、能源等因子"
            actions={
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                <RefreshCw className="size-4" /> 立即同步
              </button>
            }
          >
            <DataTable
              columns={[
                { key: 'name', label: '因子集' },
                { key: 'category', label: '类别' },
                { key: 'count', label: '因子数', align: 'right', className: 'font-mono' },
                { key: 'version', label: '版本', className: 'font-mono' },
                {
                  key: 'status',
                  label: '状态',
                  render: (r) => <StatusBadge tone={r.confirmed ? 'ok' : 'warn'}>{r.status}</StatusBadge>,
                },
              ]}
              rows={factorSets}
            />
          </Panel>
        </div>
      )}

      {tab === 'dispatch' && (
        <div className="mt-4 space-y-4">
          <Toolbar>
            <Select
              label="目标经营单位"
              value={dispatchUnit}
              onChange={setDispatchUnit}
              options={[
                { value: 'all', label: '全部经营单位' },
                { value: 'tj', label: '天津变压器厂' },
                { value: 'hy', label: '衡阳电缆厂' },
                { value: 'sy', label: '沈阳开关厂' },
              ]}
            />
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              <Send className="size-4" /> 下发最新版本
            </button>
            <span className="text-xs text-muted-foreground">通过系统接口自动同步至各经营单位产品碳足迹系统</span>
          </Toolbar>
          <Panel title="因子下发日志">
            <DataTable
              columns={[
                { key: 'unit', label: '经营单位' },
                { key: 'set', label: '因子集' },
                { key: 'version', label: '版本', className: 'font-mono' },
                { key: 'time', label: '下发时间', className: 'font-mono' },
                {
                  key: 'result',
                  label: '结果',
                  render: (r) => <StatusBadge tone={r.result === '成功' ? 'ok' : 'danger'}>{r.result}</StatusBadge>,
                },
              ]}
              rows={dispatchRows}
            />
          </Panel>
        </div>
      )}

      {tab === 'build' && (
        <div className="mt-4 space-y-4">
          <Panel
            title="因子集构建"
            desc="能源、原材料（变压器/线缆/其他）、运输等因子集梳理，成果经招标方确认后固化。所有因子带版本标签"
            actions={
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="因子名称检索"
                  className="h-9 w-52 rounded-md border border-border bg-secondary pl-8 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            }
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {factorSets.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs"
                >
                  <span className="text-foreground">{s.name}</span>
                  <Badge tone="default">{s.version}</Badge>
                  {s.confirmed ? (
                    <CheckCircle2 className="size-3.5 text-[var(--success)]" />
                  ) : (
                    <span className="text-[var(--warning)]">待确认</span>
                  )}
                </div>
              ))}
            </div>
            <DataTable
              columns={[
                { key: 'name', label: '因子名称' },
                { key: 'value', label: '因子值', align: 'right', className: 'font-mono' },
                { key: 'unit', label: '单位' },
                {
                  key: 'source',
                  label: '数据来源',
                  render: (r) => <Badge tone="default">{r.source}</Badge>,
                },
                { key: 'version', label: '版本标签', className: 'font-mono' },
                {
                  key: 'action',
                  label: '操作',
                  render: (r) => (
                    <button
                      type="button"
                      onClick={() => {
                        setEditItem(r.name)
                        setEditOpen(true)
                      }}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Pencil className="size-3.5" /> 修改
                    </button>
                  ),
                },
              ]}
              rows={factorItems}
            />
          </Panel>
        </div>
      )}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={`修改因子 · ${editItem}`}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">因子值</label>
            <input
              defaultValue="2.05"
              className="h-9 w-full rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <Select
            label="数据来源"
            value="measured"
            onChange={() => {}}
            options={[
              { value: 'measured', label: '实测' },
              { value: 'third', label: '第三方' },
              { value: 'national', label: '国家标准' },
              { value: 'industry', label: '行业标准' },
            ]}
          />
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">新版本标签</label>
            <input
              defaultValue="v3.3"
              className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <p className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
            所有因子变更将记录审计日志，日志不可删除。
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              保存并生成新版本
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

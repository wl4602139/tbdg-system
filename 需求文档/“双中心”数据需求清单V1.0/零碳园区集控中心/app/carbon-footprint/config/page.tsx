'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, StatusBadge, DataTable, Badge } from '@/components/shared/primitives'
import { Tabs } from '@/components/shared/tabs'
import { accounts, statusColor } from '@/lib/mock-data'
import { ShieldCheck, ChevronRight, Lock } from 'lucide-react'

const classTree = [
  {
    industry: '变压器产业',
    lines: [
      { line: '电力变压器产线', categories: ['油浸式变压器', '干式变压器'], models: ['SZ11-1600/10', 'SZ11-2500/10', 'SCB13-1000'] },
      { line: '互感器产线', categories: ['电流互感器', '电压互感器'], models: ['LZZBJ9-10', 'JDZX9-10'] },
    ],
  },
  {
    industry: '线缆产业',
    lines: [{ line: '电力电缆产线', categories: ['交联电缆', '架空导线'], models: ['YJV-8.7/15', 'LGJ-240', 'YJV22-26'] }],
  },
  {
    industry: '开关产业',
    lines: [{ line: '高压开关产线', categories: ['真空断路器', '环网柜'], models: ['ZW32-12', 'XGN15-12'] }],
  },
]

export default function CarbonConfigPage() {
  const [tab, setTab] = useState('account')
  const [expanded, setExpanded] = useState<string[]>(['变压器产业'])

  const toggle = (k: string) =>
    setExpanded((e) => (e.includes(k) ? e.filter((x) => x !== k) : [...e, k]))

  return (
    <div>
      <PageHeader title="基础配置" desc="基础支撑：复用集控中心账号权限、数据安全、产品品类管理" />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: 'account', label: '账号权限' },
          { value: 'security', label: '数据安全' },
          { value: 'category', label: '产品品类管理' },
        ]}
      />

      {tab === 'account' && (
        <div className="mt-4 space-y-4">
          <Panel title="账号权限" desc="复用集控中心系统账号权限，集团 / 园区 / 经营单位三级，权限细化至按钮级">
            <DataTable
              columns={[
                { key: 'name', label: '账号' },
                { key: 'role', label: '角色' },
                { key: 'scope', label: '数据范围' },
                {
                  key: 'level',
                  label: '权限层级',
                  render: (r) => <Badge tone="default">{r.level}</Badge>,
                },
                {
                  key: 'status',
                  label: '状态',
                  render: (r) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge>,
                },
              ]}
              rows={accounts}
            />
          </Panel>
        </div>
      )}

      {tab === 'security' && (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="加密存储" desc="敏感数据（供应商碳数据、订单信息）采用国密算法加密">
            <div className="space-y-3">
              {[
                { name: '供应商碳数据', algo: 'SM4', status: '已加密' },
                { name: '订单信息', algo: 'SM4', status: '已加密' },
                { name: '认证证书附件', algo: 'SM2', status: '已加密' },
                { name: '因子核算过程数据', algo: 'SM4', status: '已加密' },
              ].map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="size-4 text-[var(--success)]" />
                    <span className="text-sm text-foreground">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone="default">{s.algo}</Badge>
                    <StatusBadge tone="ok">{s.status}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="操作审计日志" desc="所有登录、数据修改、因子变更操作均记录审计日志，日志不可删除">
            <div className="space-y-2 text-sm">
              {[
                { time: '2026-08-17 09:24', user: '集团管理员', act: '修改因子 硅钢片 v3.2→v3.3' },
                { time: '2026-08-17 08:51', user: '天津厂操作员', act: '生成碳足迹报告 CFR-2026-0451' },
                { time: '2026-08-16 22:10', user: '系统', act: '因子集下发至衡阳电缆厂' },
                { time: '2026-08-16 18:35', user: '园区管理员', act: '新增 CBAM 产品映射' },
              ].map((l, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-border/60 pb-2 last:border-0">
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">{l.time}</span>
                  <span className="shrink-0 text-primary">{l.user}</span>
                  <span className="text-foreground">{l.act}</span>
                </div>
              ))}
            </div>
          </Panel>
          <div className="lg:col-span-2">
            <Panel>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="size-5 text-[var(--success)]" />
                系统符合等保三级要求，敏感字段全链路国密加密，审计日志留存不少于 180 天且不可篡改。
              </div>
            </Panel>
          </div>
        </div>
      )}

      {tab === 'category' && (
        <div className="mt-4">
          <Panel title="集团级产业产品分类树" desc="产业 → 产线 → 产品类别 → 型号">
            <div className="space-y-2">
              {classTree.map((ind) => {
                const open = expanded.includes(ind.industry)
                return (
                  <div key={ind.industry} className="rounded-lg border border-border bg-secondary/40">
                    <button
                      type="button"
                      onClick={() => toggle(ind.industry)}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
                    >
                      <ChevronRight
                        className={`size-4 text-primary transition-transform ${open ? 'rotate-90' : ''}`}
                      />
                      <span className="font-medium text-foreground">{ind.industry}</span>
                      <Badge tone="default">{ind.lines.length} 条产线</Badge>
                    </button>
                    {open && (
                      <div className="space-y-2 border-t border-border/60 px-4 py-3">
                        {ind.lines.map((l) => (
                          <div key={l.line} className="rounded-md border border-border/60 bg-background/40 p-3">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{l.line}</span>
                            </div>
                            <div className="mb-2 flex flex-wrap gap-1.5">
                              {l.categories.map((c) => (
                                <span
                                  key={c}
                                  className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {l.models.map((m) => (
                                <span
                                  key={m}
                                  className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}

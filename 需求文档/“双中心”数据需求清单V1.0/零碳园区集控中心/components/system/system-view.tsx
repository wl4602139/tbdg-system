'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  UserPlus,
  ShieldCheck,
  Boxes,
  Plug,
  ScrollText,
  Lock,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, DataTable } from '@/components/shared/primitives'
import { Tabs } from '@/components/shared/tabs'
import { Modal } from '@/components/shared/modal'
import { Select } from '@/components/shared/select'
import { accounts, statusColor } from '@/lib/mock-data'

const tabs = [
  { label: '账号权限', value: 'account' },
  { label: '数据安全', value: 'security' },
  { label: '产品品类管理', value: 'catalog' },
  { label: '接口配置管理', value: 'interface' },
  { label: '操作审计日志', value: 'audit' },
]

const productTree = [
  {
    name: '变压器产业',
    children: [
      { name: '干式变压器', children: ['SG10 系列', 'SCB13 系列'] },
      { name: '油浸式变压器', children: ['S13-M 系列', 'S11 系列'] },
    ],
  },
  {
    name: '线缆产业',
    children: [
      { name: '中压电缆', children: ['YJV-8.7/15kV', 'YJV22-26/35kV'] },
      { name: '低压电缆', children: ['YJV-0.6/1kV'] },
    ],
  },
  {
    name: '开关产业',
    children: [{ name: '高压开关', children: ['ZW32-12', 'LW3-12'] }],
  },
]

const auditLog = [
  { time: '2026-08-17 09:41', user: '张伟', action: '修改碳排因子', target: '电力（华北电网）', ip: '10.20.3.11' },
  { time: '2026-08-17 09:12', user: '李静', action: '新增账号', target: 'wangqiang', ip: '10.20.4.22' },
  { time: '2026-08-16 17:30', user: '赵敏', action: '导出碳排放报告', target: '沈阳园区', ip: '10.20.6.7' },
  { time: '2026-08-16 15:05', user: '张伟', action: '接口配置变更', target: '天津变压器厂 URL', ip: '10.20.3.11' },
]

const interfaceRows = [
  { factory: '天津变压器厂', url: 'https://tj.tbea.local/api', auth: 'Token', timeout: '30s', retry: '3 次', status: '在线' },
  { factory: '衡阳电缆厂', url: 'https://hy.tbea.local/api', auth: 'AppKey', timeout: '20s', retry: '2 次', status: '在线' },
  { factory: '沈阳开关厂', url: 'https://sy.tbea.local/api', auth: 'Token', timeout: '30s', retry: '3 次', status: '异常' },
]

export function SystemView() {
  const [tab, setTab] = useState('account')
  const [addOpen, setAddOpen] = useState(false)
  const [role, setRole] = useState('园区管理员')

  return (
    <div className="tech-grid min-h-screen bg-background">
      <div className="tech-radial pointer-events-none fixed inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 py-6">
        {/* 顶栏 */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3.5 py-2 text-sm text-foreground transition-colors hover:border-primary/50"
          >
            <ArrowLeft className="size-4" />
            返回总览
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="size-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">系统管理</h1>
            <Badge tone="primary">共性配置 · 两大平台复用</Badge>
          </div>
        </div>

        <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-5" />

        {tab === 'account' && (
          <Panel>
            <PanelTitle
              title="账号权限管理"
              subtitle="集团 / 园区 / 经营单位三级权限，权限细化至按钮级"
              icon={UserPlus}
              action={
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="size-4" />
                  新增账号
                </button>
              }
            />
            <DataTable
              columns={[
                { key: 'name', label: '姓名' },
                { key: 'account', label: '账号', className: 'font-mono text-xs' },
                {
                  key: 'role',
                  label: '角色',
                  render: (r) => <Badge tone="primary">{r.role}</Badge>,
                },
                { key: 'scope', label: '数据范围' },
                {
                  key: 'status',
                  label: '状态',
                  render: (r) => <span className={statusColor[r.status]}>{r.status}</span>,
                },
                {
                  key: 'op',
                  label: '操作',
                  render: () => (
                    <div className="flex gap-3 text-xs">
                      <button className="text-primary hover:underline">编辑</button>
                      <button className="text-muted-foreground hover:text-foreground">重置密码</button>
                      <button className="text-[var(--destructive)] hover:underline">停用</button>
                    </div>
                  ),
                },
              ]}
              rows={accounts}
            />
          </Panel>
        )}

        {tab === 'security' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Panel>
              <PanelTitle title="数据加密存储" subtitle="敏感数据采用国密算法加密" icon={Lock} />
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  { name: '供应商碳数据', algo: 'SM4', status: '已加密' },
                  { name: '订单信息', algo: 'SM4', status: '已加密' },
                  { name: '成本测算数据', algo: 'SM2', status: '已加密' },
                  { name: '认证证书附件', algo: 'SM4', status: '已加密' },
                ].map((d) => (
                  <li key={d.name} className="flex items-center justify-between rounded-lg border border-border bg-panel px-3 py-2.5">
                    <span className="text-foreground">{d.name}</span>
                    <div className="flex items-center gap-3">
                      <Badge>{d.algo}</Badge>
                      <span className="text-[var(--success)]">{d.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel>
              <PanelTitle title="安全策略" subtitle="登录、修改、因子变更均记录审计日志且不可删除" icon={ShieldCheck} />
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  '密码复杂度策略：8 位以上含大小写与数字',
                  '会话超时：30 分钟无操作自动登出',
                  '登录失败锁定：连续 5 次锁定 15 分钟',
                  '审计日志留存：≥ 3 年，不可删除',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2 rounded-lg border border-border bg-panel px-3 py-2.5 text-foreground">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        )}

        {tab === 'catalog' && (
          <Panel>
            <PanelTitle
              title="产品品类管理"
              subtitle="集团级产业产品分类树：产业 → 产线 → 产品类别 → 型号"
              icon={Boxes}
            />
            <div className="grid gap-4 md:grid-cols-3">
              {productTree.map((cat) => (
                <div key={cat.name} className="rounded-lg border border-border bg-panel p-3">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {cat.name}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {cat.children.map((line) => (
                      <li key={line.name}>
                        <p className="flex items-center gap-1 text-sm text-foreground">
                          <ChevronRight className="size-3.5 text-muted-foreground" />
                          {line.name}
                        </p>
                        <ul className="ml-5 mt-1 flex flex-wrap gap-1.5">
                          {line.children.map((m) => (
                            <li key={m}>
                              <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                                {m}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === 'interface' && (
          <Panel>
            <PanelTitle
              title="接口配置管理"
              subtitle="维护各工厂接口访问地址、认证方式、超时与重试策略，支持字段映射与测试连接"
              icon={Plug}
            />
            <DataTable
              columns={[
                { key: 'factory', label: '工厂' },
                { key: 'url', label: '访问地址(URL)', className: 'font-mono text-xs' },
                { key: 'auth', label: '认证方式', render: (r) => <Badge>{r.auth}</Badge> },
                { key: 'timeout', label: '超时' },
                { key: 'retry', label: '重试策略' },
                {
                  key: 'status',
                  label: '连接状态',
                  render: (r) => (
                    <span className={r.status === '在线' ? 'text-[var(--success)]' : 'text-[var(--destructive)]'}>
                      ● {r.status}
                    </span>
                  ),
                },
                {
                  key: 'op',
                  label: '操作',
                  render: () => (
                    <div className="flex gap-3 text-xs">
                      <button className="text-primary hover:underline">字段映射</button>
                      <button className="text-primary hover:underline">测试连接</button>
                    </div>
                  ),
                },
              ]}
              rows={interfaceRows}
            />
          </Panel>
        )}

        {tab === 'audit' && (
          <Panel>
            <PanelTitle title="操作审计日志" subtitle="所有登录、数据修改、因子变更等操作均记录，日志不可删除" icon={ScrollText} />
            <DataTable
              columns={[
                { key: 'time', label: '时间', className: 'font-mono text-xs' },
                { key: 'user', label: '操作人' },
                { key: 'action', label: '操作类型', render: (r) => <Badge tone="primary">{r.action}</Badge> },
                { key: 'target', label: '操作对象' },
                { key: 'ip', label: 'IP 地址', className: 'font-mono text-xs' },
              ]}
              rows={auditLog}
            />
          </Panel>
        )}
      </div>

      {/* 新增账号弹窗 */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="新增账号"
        description="填写账号信息并分配角色与数据范围"
        footer={
          <>
            <button
              onClick={() => setAddOpen(false)}
              className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              取消
            </button>
            <button
              onClick={() => setAddOpen(false)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              确认创建
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="姓名">
            <input className={inputCls} placeholder="请输入姓名" />
          </Field>
          <Field label="登录账号">
            <input className={inputCls} placeholder="请输入账号" />
          </Field>
          <Field label="角色">
            <Select
              className="w-full [&>div]:w-full"
              value={role}
              onChange={setRole}
              options={[
                { label: '集团管理员', value: '集团管理员' },
                { label: '园区管理员', value: '园区管理员' },
                { label: '经营单位', value: '经营单位' },
                { label: '节能专员', value: '节能专员' },
              ]}
            />
          </Field>
          <Field label="数据范围">
            <input className={inputCls} placeholder="如：天津园区 / 衡阳电缆厂" />
          </Field>
        </div>
      </Modal>
    </div>
  )
}

const inputCls =
  'h-9 w-full rounded-md border border-border bg-panel px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

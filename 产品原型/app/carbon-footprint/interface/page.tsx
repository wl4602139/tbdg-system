'use client'

import { useState } from 'react'
import { Panel, StatusBadge, Toolbar, DataTable, Badge } from '@/components/shared/primitives'
import { Tabs } from '@/components/shared/tabs'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { interfaceConfigs, fieldMappings } from '@/lib/mock-data'
import { Plug, Settings, Wifi, Plus } from 'lucide-react'

export default function InterfacePage() {
  const [tab, setTab] = useState('config')
  const [cfgOpen, setCfgOpen] = useState(false)
  const [testResult, setTestResult] = useState<string>('')

  const runTest = () => {
    setTestResult('测试中…')
    setTimeout(() => setTestResult('连接成功 · 响应 128ms'), 800)
  }

  return (
    <div>
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: 'config', label: '接口配置管理' },
          { value: 'share', label: '与股份系统接口' },
          { value: 'unit', label: '与经营单位接口' },
        ]}
      />

      {tab === 'config' && (
        <div className="mt-4 space-y-4">
          <Toolbar>
            <button
              type="button"
              onClick={() => setCfgOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              <Plus className="size-4" /> 新增接口
            </button>
            <span className="text-xs text-muted-foreground">
              维护访问地址、认证方式、超时与重试策略，支持字段映射与测试连接
            </span>
          </Toolbar>
          <Panel title="接口连接配置">
            <DataTable
              columns={[
                { key: 'name', label: '接口名称' },
                { key: 'url', label: '访问地址(URL)', className: 'font-mono text-xs' },
                {
                  key: 'auth',
                  label: '认证方式',
                  render: (r) => <Badge tone="default">{r.auth}</Badge>,
                },
                { key: 'timeout', label: '超时(s)', align: 'right', className: 'font-mono' },
                { key: 'retry', label: '重试', align: 'right', className: 'font-mono' },
                {
                  key: 'status',
                  label: '状态',
                  render: (r) => (
                    <StatusBadge tone={r.status === '在线' ? 'ok' : 'danger'}>
                      <Wifi className="mr-1 inline size-3" />
                      {r.status}
                    </StatusBadge>
                  ),
                },
                {
                  key: 'action',
                  label: '操作',
                  render: () => (
                    <div className="flex items-center gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setCfgOpen(true)}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Settings className="size-3.5" /> 配置
                      </button>
                      <button type="button" onClick={runTest} className="text-primary hover:underline">
                        测试
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={interfaceConfigs}
            />
            {testResult && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-xs text-foreground">
                <Plug className="size-3.5 text-[var(--success)]" />
                {testResult}
              </div>
            )}
          </Panel>

          <Panel title="接口字段映射配置" desc="工厂侧字段映射到平台标准字段">
            <DataTable
              columns={[
                { key: 'source', label: '工厂侧字段', className: 'font-mono' },
                { key: 'target', label: '平台标准字段' },
                {
                  key: 'type',
                  label: '类型',
                  render: (r) => <Badge tone="default">{r.type}</Badge>,
                },
              ]}
              rows={fieldMappings}
            />
          </Panel>
        </div>
      )}

      {tab === 'share' && (
        <div className="mt-4">
          <Panel title="与股份碳足迹系统接口" desc="构建标准的因子交互接口，实现股份碳足迹系统因子获取">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                { name: '因子获取接口', method: 'GET /api/v2/factors', desc: '拉取原材料、能源等标准因子' },
                { name: '因子版本查询', method: 'GET /api/v2/factors/versions', desc: '查询因子版本与更新时间' },
                { name: '增量同步接口', method: 'POST /api/v2/factors/sync', desc: '按版本增量同步因子集' },
                { name: '心跳检测', method: 'GET /api/v2/health', desc: '接口在线状态检测' },
              ].map((i) => (
                <div key={i.name} className="rounded-lg border border-border bg-secondary/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{i.name}</span>
                    <StatusBadge tone="ok">已联通</StatusBadge>
                  </div>
                  <code className="mt-1 block font-mono text-xs text-primary">{i.method}</code>
                  <p className="mt-1 text-xs text-muted-foreground">{i.desc}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {tab === 'unit' && (
        <div className="mt-4">
          <Panel
            title="与经营单位碳足迹系统接口"
            desc="多源、异构、多要素数据统一对接，实现全品类产品、全订单的核算结果 / 源数据 / 因子 / 认证数据互通"
          >
            <DataTable
              columns={[
                { key: 'data', label: '互通数据' },
                { key: 'dir', label: '方向' },
                { key: 'freq', label: '频率' },
                {
                  key: 'status',
                  label: '状态',
                  render: (r: any) => <StatusBadge tone={r.status === '正常' ? 'ok' : 'warn'}>{r.status}</StatusBadge>,
                },
              ]}
              rows={[
                { data: '核算结果', dir: '经营单位 → 平台', freq: '实时', status: '正常' },
                { data: '源数据（BOM/能耗）', dir: '经营单位 → 平台', freq: '每日', status: '正常' },
                { data: '因子数据', dir: '平台 → 经营单位', freq: '版本触发', status: '正常' },
                { data: '认证数据', dir: '双向', freq: '事件触发', status: '待联调' },
              ]}
            />
          </Panel>
        </div>
      )}

      <Modal open={cfgOpen} onClose={() => setCfgOpen(false)} title="接口连接配置">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">访问地址(URL)</label>
            <input
              defaultValue="https://tj.local/cf/api"
              className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <Select
            label="认证方式"
            value="appkey"
            onChange={() => {}}
            options={[
              { value: 'token', label: 'Token' },
              { value: 'appkey', label: 'AppKey' },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">请求超时(s)</label>
              <input
                defaultValue="20"
                className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">重试次数</label>
              <input
                defaultValue="2"
                className="h-9 w-full rounded-md border border-border bg-secondary px-3 font-mono text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={runTest}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm text-primary"
          >
            <Plug className="size-4" /> 测试连接
          </button>
          {testResult && <p className="text-xs text-[var(--success)]">{testResult}</p>}
          <p className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
            所有配置变更记录操作日志。
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setCfgOpen(false)}
              className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => setCfgOpen(false)}
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              保存配置
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

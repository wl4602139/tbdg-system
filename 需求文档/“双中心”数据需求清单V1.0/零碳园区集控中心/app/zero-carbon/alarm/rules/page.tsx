'use client'

import { useState } from 'react'
import { Panel, DataTable, StatusBadge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { alertRules, statusColor } from '@/lib/mock-data'

export default function RulesPage() {
  const [ruleModal, setRuleModal] = useState(false)

  return (
    <Panel
      title="告警规则配置"
      desc="按能耗、单耗、碳排放、项目效益等多维度自定义规则"
      actions={
        <button
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => setRuleModal(true)}
        >
          + 新建告警规则
        </button>
      }
    >
      <DataTable
        columns={[
          { key: 'name', label: '规则名称' },
          { key: 'dimension', label: '监控维度' },
          { key: 'condition', label: '触发条件' },
          { key: 'level', label: '告警级别', render: (r) => <StatusBadge tone={statusColor(r.level)}>{r.levelText}</StatusBadge> },
          { key: 'channel', label: '推送渠道' },
          { key: 'enabled', label: '状态', render: (r) => <StatusBadge tone={r.enabled ? 'ok' : 'muted'}>{r.enabled ? '启用' : '停用'}</StatusBadge> },
          {
            key: 'op',
            label: '操作',
            render: () => (
              <div className="flex gap-3">
                <button className="text-xs text-primary hover:underline" onClick={() => setRuleModal(true)}>编辑</button>
                <button className="text-xs text-primary hover:underline">复制</button>
                <button className="text-xs text-[var(--destructive)] hover:underline">删除</button>
              </div>
            ),
          },
        ]}
        rows={alertRules}
      />

      <Modal open={ruleModal} onClose={() => setRuleModal(false)} title="告警规则配置" size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">规则名称</label>
              <input className="w-full rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" defaultValue="单位产品综合能耗超标" />
            </div>
            <Select
              label="监控维度"
              options={[
                { label: '能耗', value: 'energy' },
                { label: '单耗', value: 'unit' },
                { label: '碳排放', value: 'carbon' },
                { label: '项目效益', value: 'project' },
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">触发条件</label>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                options={[
                  { label: '阈值', value: 'threshold' },
                  { label: '同比', value: 'yoy' },
                  { label: '环比', value: 'mom' },
                  { label: '与标杆偏差', value: 'benchmark' },
                ]}
              />
              <Select
                options={[
                  { label: '大于', value: 'gt' },
                  { label: '小于', value: 'lt' },
                  { label: '偏离', value: 'dev' },
                ]}
              />
              <input className="w-24 rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" defaultValue="120" />
              <span className="text-sm text-muted-foreground">持续 ≥</span>
              <input className="w-20 rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" defaultValue="30" />
              <span className="text-sm text-muted-foreground">分钟</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="告警级别"
              options={[
                { label: '提示', value: 'info' },
                { label: '警告', value: 'warn' },
                { label: '严重', value: 'critical' },
              ]}
            />
            <Select
              label="常用规则模板"
              options={[
                { label: '单耗超标模板', value: 'unit' },
                { label: '碳排超配额模板', value: 'carbon' },
                { label: '用能突增模板', value: 'peak' },
                { label: '项目收益异常模板', value: 'project' },
              ]}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:border-primary/50" onClick={() => setRuleModal(false)}>
            取消
          </button>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={() => setRuleModal(false)}>
            保存并启用
          </button>
        </div>
      </Modal>
    </Panel>
  )
}

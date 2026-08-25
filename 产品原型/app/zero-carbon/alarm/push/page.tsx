'use client'

import { Panel } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'

export default function PushPage() {
  return (
    <Panel title="告警推送策略" desc="按角色、组织架构或设备范围配置接收对象与推送渠道">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <Select
            label="接收范围"
            options={[
              { label: '按角色（工厂管理员/节能专员）', value: 'role' },
              { label: '指定人员', value: 'user' },
              { label: '组织架构（园区/工厂）', value: 'org' },
              { label: '设备范围', value: 'device' },
            ]}
          />
          <Select
            label="分级推送策略"
            options={[
              { label: '提示 - 站内消息', value: 'info' },
              { label: '警告 - 站内 + 企业微信', value: 'warn' },
              { label: '严重 - 全渠道 + 电话语音', value: 'critical' },
            ]}
          />
          <Select
            label="未升级自动上报"
            options={[
              { label: '30 分钟未处理上报上级', value: '30' },
              { label: '1 小时未处理上报上级', value: '60' },
              { label: '不自动上报', value: 'none' },
            ]}
          />
        </div>
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">推送渠道</div>
          {['站内消息', '企业微信', '短信', '邮件', '电话语音'].map((c) => (
            <label
              key={c}
              className="flex items-center gap-3 rounded-lg border border-border bg-panel px-4 py-2.5 text-sm text-foreground"
            >
              <input type="checkbox" defaultChecked={c !== '电话语音'} className="accent-[var(--primary)]" />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          保存推送策略
        </button>
      </div>
    </Panel>
  )
}

'use client'

import { useState } from 'react'
import { Panel, DataTable, StatusBadge, Toolbar, KpiCard } from '@/components/shared/primitives'
import { BellRing, Clock, CheckCircle2, TrendingUp } from 'lucide-react'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { alertRecords, statusColor } from '@/lib/mock-data'

export default function RecordsPage() {
  const [detail, setDetail] = useState<(typeof alertRecords)[number] | null>(null)
  const [fLevel, setFLevel] = useState('all')
  const [fStatus, setFStatus] = useState('all')
  const [fObject, setFObject] = useState('all')

  const records = alertRecords.filter(
    (r) =>
      (fLevel === 'all' || r.levelText === fLevel) &&
      (fStatus === 'all' || r.status === fStatus) &&
      (fObject === 'all' || r.object?.includes(fObject)),
  )

  return (
    <div className="space-y-3.5">
      {/* 顶部 Header */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <BellRing className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">告警处理</h1>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <KpiCard label="待处理告警" value="6" unit="条" delta="需关注" up icon={BellRing} />
        <KpiCard label="处理中" value="1" unit="条" delta="节能专员处理" icon={Clock} />
        <KpiCard label="今日已闭环" value="7" unit="条" delta="平均耗时 42 分钟" up={false} icon={CheckCircle2} />
        <KpiCard label="本月累计" value="126" unit="条" delta="闭环率 94%" icon={TrendingUp} />
      </div>
      <Panel title="告警处理" desc="责任人在线确认告警，完成闭环处理">
      <Toolbar>
        <Select
          label="告警级别"
          value={fLevel}
          onChange={setFLevel}
          options={[
            { label: '全部级别', value: 'all' },
            { label: '提示', value: '提示' },
            { label: '警告', value: '警告' },
            { label: '严重', value: '严重' },
          ]}
        />
        <Select
          label="处理状态"
          value={fStatus}
          onChange={setFStatus}
          options={[
            { label: '全部状态', value: 'all' },
            { label: '未处理', value: '未处理' },
            { label: '已处理', value: '已处理' },
          ]}
        />
        <Select
          label="所属对象"
          value={fObject}
          onChange={setFObject}
          options={[
            { label: '全部对象', value: 'all' },
            { label: '天津', value: '天津' },
            { label: '衡阳', value: '衡阳' },
          ]}
        />
      </Toolbar>
      <DataTable
        columns={[
          { key: 'time', label: '触发时间' },
          { key: 'name', label: '告警内容' },
          { key: 'object', label: '所属对象' },
          { key: 'level', label: '级别', render: (r) => <StatusBadge tone={statusColor(r.level)}>{r.levelText}</StatusBadge> },
          { key: 'status', label: '状态', render: (r) => <StatusBadge tone={r.status === '已处理' ? 'ok' : 'warn'}>{r.status}</StatusBadge> },
          {
            key: 'op',
            label: '操作',
            render: (r) => (
              <button className="text-xs text-primary hover:underline" onClick={() => setDetail(r)}>
                {r.status === '已处理' ? '查看' : '处理'}
              </button>
            ),
          },
        ]}
        rows={records}
      />

      <Modal open={!!detail} onClose={() => setDetail(null)} title="告警处理" size="lg">
        {detail && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-panel p-4 text-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-foreground">{detail.name}</span>
                <StatusBadge tone={statusColor(detail.level)}>{detail.levelText}</StatusBadge>
              </div>
              <div className="text-muted-foreground">所属对象：{detail.object}</div>
              <div className="text-muted-foreground">触发时间：{detail.time}</div>
            </div>
            <Select
              label="处理状态"
              options={[
                { label: '已处理', value: 'done' },
                { label: '处理中', value: 'doing' },
                { label: '误报关闭', value: 'false' },
              ]}
            />
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">处理说明</label>
              <textarea
                className="h-24 w-full resize-none rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                placeholder="请填写处理过程与结果……"
              />
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:border-primary/50" onClick={() => setDetail(null)}>
            取消
          </button>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={() => setDetail(null)}>
            确认处理
          </button>
        </div>
      </Modal>
      </Panel>
    </div>
  )
}

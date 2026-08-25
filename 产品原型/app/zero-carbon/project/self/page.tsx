'use client'

import { useState } from 'react'
import { Panel, PanelTitle, StatusBadge, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { RadarCompare, BarGroup } from '@/components/shared/charts'
import { Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react'

const buildItems = [
  { cat: '能源结构优化', name: '分布式光伏覆盖', progress: 90, weight: '10%', status: '已完成' },
  { cat: '能源结构优化', name: '绿电采购协议签订', progress: 70, weight: '8%', status: '进行中' },
  { cat: '能效提升', name: '重点设备节能技改', progress: 85, weight: '12%', status: '进行中' },
  { cat: '能效提升', name: '能源管理系统建设', progress: 100, weight: '10%', status: '已完成' },
  { cat: '碳管理', name: '碳排放核算体系', progress: 100, weight: '10%', status: '已完成' },
  { cat: '碳管理', name: '碳减排目标设定', progress: 60, weight: '10%', status: '进行中' },
  { cat: '电气化', name: '运输车辆电动化', progress: 40, weight: '8%', status: '进行中' },
  { cat: '电气化', name: '锅炉电气化替代', progress: 30, weight: '7%', status: '规划' },
]

const radarData = [
  { metric: '能源结构', value: 82, benchmark: 90 },
  { metric: '能效提升', value: 88, benchmark: 85 },
  { metric: '碳管理', value: 90, benchmark: 88 },
  { metric: '电气化', value: 45, benchmark: 70 },
  { metric: '绿电占比', value: 62, benchmark: 75 },
]

export default function SelfPage() {
  const [park, setPark] = useState('天津能碳产业园')

  const finished = buildItems.filter((i) => i.status === '已完成').length
  const score = 74.6

  return (
    <div className="grid gap-4">
      <div className="flex items-end gap-3">
        <Select label="园区" value={park} onChange={setPark} options={['天津能碳产业园', '新疆新能源产业园', '内蒙新能源产业园'].map((p) => ({ label: p, value: p }))} />
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">发起自评估</button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="综合评分" value={String(score)} unit="分" delta="较上期 +6.2" up icon={Target} />
        <KpiCard label="建设达标率" value="72" unit="%" delta="目标 85%" up icon={TrendingUp} />
        <KpiCard label="已完成建设项" value={String(finished)} unit="项" delta={`共 ${buildItems.length} 项`} icon={CheckCircle2} />
        <KpiCard label="预测达标年份" value="2027" unit="年" delta="目标 2026" icon={Clock} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle title="建设进展雷达图" subtitle="五维建设水平对标" icon={Target} />
          <RadarCompare data={radarData} height={320} />
        </Panel>
        <Panel>
          <PanelTitle title="建设水平评分" subtitle="各维度评分对比" icon={TrendingUp} />
          <BarGroup
            data={radarData.map((r) => ({ name: r.metric, 评分: r.value, 标杆: r.benchmark }))}
            keys={[{ key: '评分', name: '本期评分', color: 'var(--chart-1)' }, { key: '标杆', name: '标杆', color: 'var(--chart-4)' }]}
            nameKey="name"
            height={320}
          />
        </Panel>
      </div>

      <Panel>
        <PanelTitle title="建设项勾选填报" subtitle="在线勾选/填报建设项完成情况与进度" icon={CheckCircle2} action={<Badge tone="primary">结合能耗/碳排数据自动计算</Badge>} />
        <DataTable
          columns={[
            { key: 'cat', label: '建设大类', render: (r) => <Badge tone="primary">{r.cat}</Badge> },
            { key: 'name', label: '建设项' },
            { key: 'progress', label: '完成进度', render: (r) => (
              <div className="flex items-center gap-2">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-panel">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${r.progress}%` }} />
                </div>
                <span className="font-mono text-xs text-foreground">{r.progress}%</span>
              </div>
            ) },
            { key: 'weight', label: '权重', align: 'right', className: 'font-mono text-muted-foreground' },
            { key: 'status', label: '状态', render: (r) => <StatusBadge tone={r.status === '已完成' ? 'ok' : r.status === '进行中' ? 'info' : 'muted'}>{r.status}</StatusBadge> },
            { key: 'op', label: '操作', render: () => <button className="text-xs text-primary hover:underline">填报</button> },
          ]}
          rows={buildItems}
        />
      </Panel>
    </div>
  )
}

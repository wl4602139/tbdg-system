'use client'

import { Panel, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Boxes, GitBranch, Target } from 'lucide-react'

export default function ModelPage() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KpiCard label="运行中模型" value="4" unit="个" delta="迭代中 1" icon={Boxes} />
        <KpiCard label="历史版本" value="23" unit="个" delta="全部可回溯" icon={GitBranch} />
        <KpiCard label="本月预测偏差" value="3.8" unit="%" delta="< 5% 达标" up={false} icon={Target} />
      </div>

      <Panel title="模型管理" desc="实时监控模型与项目经济效益评估模型，支持版本迭代与历史回溯">
        <DataTable
          columns={[
            { key: 'name', label: '模型名称' },
            { key: 'type', label: '模型类型', render: (r) => <Badge tone="primary">{r.type}</Badge> },
            { key: 'version', label: '当前版本', render: (r) => <Badge>{r.version}</Badge> },
            { key: 'updated', label: '更新时间', className: 'font-mono text-xs' },
            { key: 'desc', label: '模型说明', className: 'text-muted-foreground' },
            { key: 'op', label: '操作', render: () => (
              <div className="flex gap-3">
                <button className="text-xs text-primary hover:underline">编辑</button>
                <button className="text-xs text-primary hover:underline">版本历史</button>
                <button className="text-xs text-primary hover:underline">迭代</button>
              </div>
            ) },
          ]}
          rows={[
            { name: '光伏发电量预测模型', type: '实时监控模型', version: 'v2.3', updated: '2026-07-12', desc: '预测分布式光伏发电功率与发电量' },
            { name: '储能充放策略模型', type: '实时监控模型', version: 'v2.1', updated: '2026-05-02', desc: '优化储能充放电策略与 SOC 管理' },
            { name: '储能经济效益评估模型', type: '经济效益模型', version: 'v1.8', updated: '2026-06-28', desc: '计算储能节费收益与投资回收期' },
            { name: '碳减排量核算模型', type: '环保效益模型', version: 'v3.1', updated: '2026-08-01', desc: '核算光伏/储能/热泵碳减排量' },
            { name: '热泵节费评估模型', type: '经济效益模型', version: 'v1.4', updated: '2026-05-20', desc: '评估热泵替代锅炉的节费效益' },
          ]}
        />
      </Panel>
    </div>
  )
}

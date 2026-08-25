'use client'

import { FileText, Download, ShieldCheck, FolderOpen, Plus, Pencil } from 'lucide-react'
import { Panel, PanelTitle, DataTable, Badge } from '@/components/shared/primitives'

const templateRows = [
  { name: '集团碳核算报告模板', scope: '集团', version: 'v2.3', updated: '2026-06-01' },
  { name: '园区碳核算报告模板', scope: '园区', version: 'v1.8', updated: '2026-05-15' },
  { name: '第三方核查支撑模板', scope: '集团', version: 'v1.2', updated: '2026-04-20' },
  { name: 'CBAM 报告模板', scope: '出口产品', version: 'v1.0', updated: '2026-03-10' },
]

const reportRows = [
  { name: '2026 Q2 集团碳排放报告', scope: '组织层面', date: '2026-07-05', status: '已归档' },
  { name: '2026 Q1 集团碳排放报告', scope: '组织层面', date: '2026-04-08', status: '已归档' },
  { name: '天津园区 2025 年度报告', scope: '园区', date: '2026-01-15', status: '已核查' },
  { name: '衡阳园区 2025 年度报告', scope: '园区', date: '2026-01-20', status: '已核查' },
]

const verifyMaterials = [
  { name: '能源消耗台账', type: '过程数据', period: '2026 Q2', status: '已归档' },
  { name: '排放因子来源说明', type: '支撑材料', period: '2026', status: '已归档' },
  { name: '外购电力结算单', type: '支撑材料', period: '2026 Q2', status: '已归档' },
  { name: '组织边界说明', type: '支撑材料', period: '2026', status: '待补充' },
]

export default function ReportPage() {
  return (
    <div className="grid gap-4">
      <Panel
        title="碳报告与核查支撑"
        desc="按国标固定模板自动生成排放报告，汇集核算过程数据支撑第三方核查"
        icon={FileText}
        actions={
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:border-primary/50">
              <Plus className="size-4" /> 上传自定义模板
            </button>
            <button className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <FileText className="size-4" /> 生成报告
            </button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle title="报告模板库" subtitle="国标固定模板，支持模板维护" icon={FileText} />
          <DataTable
            columns={[
              { key: 'name', label: '模板名称' },
              { key: 'scope', label: '适用范围', render: (r) => <Badge tone="primary">{r.scope}</Badge> },
              { key: 'version', label: '版本', render: (r) => <Badge>{r.version}</Badge> },
              { key: 'updated', label: '更新时间', className: 'font-mono text-xs' },
              { key: 'op', label: '操作', render: () => <button className="flex items-center gap-1 text-xs text-primary hover:underline"><Pencil className="size-3" /> 维护</button> },
            ]}
            rows={templateRows}
          />
        </Panel>
        <Panel>
          <PanelTitle title="第三方核查支撑" subtitle="汇集碳核算过程数据与支撑材料" icon={ShieldCheck} />
          <DataTable
            columns={[
              { key: 'name', label: '材料名称' },
              { key: 'type', label: '类型', render: (r) => <Badge>{r.type}</Badge> },
              { key: 'period', label: '周期', className: 'font-mono text-xs' },
              { key: 'status', label: '状态', render: (r) => <span className={r.status === '已归档' ? 'text-[var(--success)]' : 'text-[var(--warning)]'}>{r.status}</span> },
              { key: 'op', label: '操作', render: () => <button className="flex items-center gap-1 text-xs text-primary hover:underline"><Download className="size-3" /> 导出</button> },
            ]}
            rows={verifyMaterials}
          />
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 py-2 text-sm text-primary hover:bg-primary/20">
            <ShieldCheck className="size-4" /> 导出核查支撑材料包
          </button>
        </Panel>
      </div>

      <Panel>
        <PanelTitle title="历年报告归档" subtitle="在线归档，支持对比分析与导出" icon={FolderOpen} />
        <DataTable
          columns={[
            { key: 'name', label: '报告名称' },
            { key: 'scope', label: '范围', render: (r) => <Badge tone="primary">{r.scope}</Badge> },
            { key: 'date', label: '生成日期', className: 'font-mono text-xs' },
            { key: 'status', label: '状态', render: (r) => <span className="text-[var(--success)]">{r.status}</span> },
            { key: 'op', label: '操作', render: () => (
              <div className="flex gap-3">
                <button className="flex items-center gap-1 text-xs text-primary hover:underline"><Download className="size-3" /> 导出</button>
                <button className="text-xs text-primary hover:underline">对比分析</button>
              </div>
            ) },
          ]}
          rows={reportRows}
        />
      </Panel>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { ScrollText, Search, RotateCcw, Download } from 'lucide-react'
import { Panel, DataTable, StatusBadge, Badge } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { sysLogs, sysLogCategories } from '@/lib/mock-data'
import { inputCls, ActionBtn } from '@/components/system/ui'

export function LogSection() {
  const [cat, setCat] = useState('all')
  const [kw, setKw] = useState('')
  const [result, setResult] = useState('all')
  const [applied, setApplied] = useState({ cat: 'all', kw: '', result: 'all' })

  const rows = useMemo(
    () =>
      sysLogs.filter((l) => {
        if (applied.cat !== 'all' && l.category !== applied.cat) return false
        if (applied.result !== 'all' && l.result !== applied.result) return false
        if (applied.kw && !`${l.user}${l.action}${l.target}${l.ip}`.toLowerCase().includes(applied.kw.toLowerCase())) return false
        return true
      }),
    [applied],
  )

  return (
    <Panel
      title="日志管理"
      icon={ScrollText}
      actions={<ActionBtn><Download className="size-4" /> 导出日志</ActionBtn>}
    >
      <p className="mb-4 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
        记录登录、数据操作、因子变更、权限变更、导出等全部关键操作，日志留存 ≥ 3 年且不可删除。
      </p>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">关键字</span>
          <input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="操作人 / 对象 / IP" className={`${inputCls} w-52`} />
        </label>
        <div className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">日志类型</span>
          <Select value={cat} onChange={setCat} options={[{ label: '全部类型', value: 'all' }, ...sysLogCategories.map((c) => ({ label: c, value: c }))]} />
        </div>
        <div className="grid gap-1.5">
          <span className="text-xs text-muted-foreground">结果</span>
          <Select value={result} onChange={setResult} options={[{ label: '全部', value: 'all' }, { label: '成功', value: '成功' }, { label: '失败', value: '失败' }]} />
        </div>
        <ActionBtn variant="primary" onClick={() => setApplied({ cat, kw, result })}><Search className="size-4" /> 查询</ActionBtn>
        <ActionBtn onClick={() => { setCat('all'); setKw(''); setResult('all'); setApplied({ cat: 'all', kw: '', result: 'all' }) }}><RotateCcw className="size-4" /> 重置</ActionBtn>
      </div>

      <DataTable
        columns={[
          { key: 'time', label: '时间', className: 'font-mono text-xs' },
          { key: 'user', label: '操作人' },
          { key: 'category', label: '类型', render: (r) => <Badge tone="primary">{r.category}</Badge> },
          { key: 'action', label: '操作' },
          { key: 'target', label: '操作对象' },
          { key: 'ip', label: 'IP 地址', className: 'font-mono text-xs' },
          { key: 'result', label: '结果', render: (r) => <StatusBadge tone={r.result === '成功' ? 'ok' : 'danger'}>{r.result}</StatusBadge> },
        ]}
        rows={rows}
      />
    </Panel>
  )
}

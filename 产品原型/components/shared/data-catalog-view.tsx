'use client'

import { useMemo, useState } from 'react'
import { Database, Cpu, PencilLine, Layers, Plus, Download, X, CheckCircle2, Sparkles } from 'lucide-react'
import { Panel, PanelTitle, DataTable, StatusBadge, KpiCard, Toolbar } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { catalogStats, type DataItem } from '@/lib/data-catalog'

/* 数据来源 → 徽章色 */
function sourceTone(source: string): 'ok' | 'info' | 'warn' | 'muted' {
  if (source.includes('系统接入')) return 'ok'
  if (source.includes('大数据') || source.includes('ERP') || source.includes('碳足迹系统')) return 'info'
  if (source.includes('录入') || source.includes('线下')) return 'warn'
  return 'muted'
}

export function DataCatalogView({
  items: initialItems,
  title,
  desc,
  note,
}: {
  items: DataItem[]
  title: string
  desc: string
  note?: string
}) {
  const [items, setItems] = useState<DataItem[]>(initialItems)
  const [kind, setKind] = useState('全部')
  const [source, setSource] = useState('全部')
  const [usage, setUsage] = useState('全部')

  // 弹窗状态
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState<Omit<DataItem, 'id'>>({
    name: '',
    kind: '动态数据',
    unit: 'kWh',
    object: '园区及工厂',
    source: '系统接入',
    usage: '集中监管、能耗分析',
    freq: '15分钟',
  })

  const sourceOptions = useMemo(
    () => ['全部', ...Array.from(new Set(items.map((i) => i.source)))],
    [items],
  )
  const usageOptions = useMemo(() => {
    const set = new Set<string>()
    items.forEach((i) => i.usage.split('、').forEach((u) => set.add(u.trim())))
    return ['全部', ...Array.from(set)]
  }, [items])

  const rows = items.filter(
    (i) =>
      (kind === '全部' || i.kind === kind) &&
      (source === '全部' || i.source === source) &&
      (usage === '全部' || i.usage.includes(usage)),
  )

  const stat = catalogStats(items)

  // 提交新增数据项
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('请输入数据项名称！')
      return
    }

    const newItem: DataItem = {
      id: items.length + 1,
      ...formData,
    }

    setItems([newItem, ...items])
    setShowAddModal(false)
    setFormData({
      name: '',
      kind: '动态数据',
      unit: 'kWh',
      object: '园区及工厂',
      source: '系统接入',
      usage: '集中监管、能耗分析',
      freq: '15分钟',
    })
    alert(`✅ 已成功新增数据项【${newItem.name}】并归集入清单！`)
  }

  return (
    <div className="space-y-5">
      {/* 顶部 KPI 统计卡片 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="数据项总数" value={String(stat.total)} unit="项" icon={Layers} />
        <KpiCard label="动态 / 静态" value={`${stat.dynamic} / ${stat.static}`} unit="项" icon={Database} />
        <KpiCard label="系统自动接入" value={String(stat.auto)} unit="项" icon={Cpu} />
        <KpiCard label="录入 / 线下收集" value={String(stat.manual)} unit="项" icon={PencilLine} />
      </div>

      <Panel title={title} desc={desc}>
        <Toolbar>
          <Select
            label="数据类型"
            value={kind}
            onChange={setKind}
            options={['全部', '静态数据', '动态数据'].map((k) => ({ label: k, value: k }))}
          />
          <Select
            label="数据来源"
            value={source}
            onChange={setSource}
            options={sourceOptions.map((s) => ({ label: s, value: s }))}
          />
          <Select
            label="用途"
            value={usage}
            onChange={setUsage}
            options={usageOptions.map((u) => ({ label: u, value: u }))}
          />
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => alert(`正在导出《${title}》结构化数据清单 (Excel)...`)}
              className="rounded-lg border border-border bg-panel px-3 py-2 text-xs font-semibold text-foreground hover:border-primary/50 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>导出清单</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="rounded-lg bg-primary hover:bg-primary/90 px-3 py-2 text-xs font-semibold text-primary-foreground flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="size-3.5" />
              <span>+ 新增数据项</span>
            </button>
          </div>
        </Toolbar>

        <DataTable
          columns={[
            { key: 'id', label: '序号', className: 'font-mono text-muted-foreground' },
            {
              key: 'kind',
              label: '数据类型',
              render: (r) => <StatusBadge tone={r.kind === '静态数据' ? 'muted' : 'info'}>{r.kind}</StatusBadge>,
            },
            { key: 'name', label: '数据项名称', className: 'font-medium text-foreground' },
            { key: 'unit', label: '单位', className: 'font-mono text-muted-foreground' },
            { key: 'object', label: '数据对象' },
            {
              key: 'source',
              label: '数据来源',
              render: (r) => <StatusBadge tone={sourceTone(r.source)}>{r.source}</StatusBadge>,
            },
            { key: 'usage', label: '用途', className: 'text-foreground/80' },
            { key: 'freq', label: '采集频率 / 备注', className: 'max-w-xs whitespace-normal text-xs text-muted-foreground' },
          ]}
          rows={rows}
        />
      </Panel>

      {note && (
        <Panel>
          <PanelTitle title="数据说明" icon={Database} />
          <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>
        </Panel>
      )}

      {/* 🌟 新增数据项模态弹窗 (Modal) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* 弹窗顶栏 */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-panel">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <Database className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    新增数据采集项
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-sans">
                    统一录入并配置特变电工园区/工厂能碳物联与静态数据测点
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-accent/40 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 弹窗表单 */}
            <form onSubmit={handleAddItem} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-foreground flex items-center gap-1">
                  <span>数据项名称</span>
                  <span className="text-[var(--destructive)]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="例如：光伏逆变器实时功率 / 2号变压器油温监测"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-sans placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">数据类型</label>
                  <select
                    value={formData.kind}
                    onChange={(e) => setFormData({ ...formData, kind: e.target.value as any })}
                    className="w-full p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="动态数据">动态数据 (时序物联流)</option>
                    <option value="静态数据">静态数据 (台账/装机容量)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">工程单位</label>
                  <input
                    type="text"
                    placeholder="如: kWh, kW, m³, t, ℃, %"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2 bg-background border border-border rounded-lg font-mono text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">数据对象</label>
                  <select
                    value={formData.object}
                    onChange={(e) => setFormData({ ...formData, object: e.target.value })}
                    className="w-full p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="园区及工厂">园区及工厂</option>
                    <option value="变压器产业工厂">变压器产业工厂</option>
                    <option value="线缆产业工厂">线缆产业工厂</option>
                    <option value="重点用能设备">重点用能设备</option>
                    <option value="关键制造工序">关键制造工序</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">数据来源</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="系统接入">系统接入 (SCADA/IoT)</option>
                    <option value="系统界面手工录入">系统界面手工录入</option>
                    <option value="线下收集">线下收集 (台账Excel)</option>
                    <option value="ERP/MES平台获取">ERP/MES平台获取</option>
                    <option value="碳足迹系统同步">碳足迹系统同步</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">主要用途</label>
                <input
                  type="text"
                  placeholder="如: 大屏展示、集中监管、能耗分析、碳排核算"
                  value={formData.usage}
                  onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-sans placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">采集频率 / 备注</label>
                <input
                  type="text"
                  placeholder="如: 15分钟 / 实时采集 / 每月更新"
                  value={formData.freq}
                  onChange={(e) => setFormData({ ...formData, freq: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-sans placeholder:text-muted-foreground"
                />
              </div>

              {/* 底部操作区 */}
              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-accent/40 font-bold cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                >
                  <Plus className="size-4" />
                  <span>确认保存并归集</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

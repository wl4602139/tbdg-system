'use client'

import { useState } from 'react'
import {
  FileEdit,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  Flame,
  Droplets,
  DollarSign,
  TrendingUp,
  History,
  FileCheck,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge, DataTable } from '@/components/shared/primitives'
import { orgTree } from '@/lib/org'
import { cn } from '@/lib/utils'

export default function ManualEntryPage() {
  const [selectedOrg, setSelectedOrg] = useState('沈变本部')
  const [entryPeriod, setEntryPeriod] = useState('2026-08')
  const [submitted, setSubmitted] = useState(false)

  // 填报表单数据
  const [formData, setFormData] = useState({
    gasVolume: '28400',
    steamVolume: '1420',
    waterVolume: '8900',
    dieselVolume: '320',
    industrialOutputVal: '14500',
    industrialAddedVal: '4200',
    transformerYieldKva: '380000',
    fillerName: '李工 (能碳专员)',
    remark: '本月干燥罐保温系统维护良好，蒸汽用量较上月略有下降。',
  })

  // 历史填报日志
  const historyLogs = [
    { period: '2026-07', org: '沈变本部', gas: '29,100 m³', steam: '1,480 t', addedVal: '4,150 万元', status: '已审核归档', time: '2026-08-02 10:15', filler: '李工' },
    { period: '2026-06', org: '沈变本部', gas: '28,800 m³', steam: '1,450 t', addedVal: '4,080 万元', status: '已审核归档', time: '2026-07-02 09:30', filler: '李工' },
    { period: '2026-05', org: '沈变本部', gas: '27,900 m³', steam: '1,390 t', addedVal: '3,950 万元', status: '已审核归档', time: '2026-06-02 14:20', filler: '张工' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3500)
  }

  return (
    <div className="space-y-5">
      {/* 顶部标题与说明 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border">
        <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <FileEdit className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">数据录入</h1>
          </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">当前填报单位：</span>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="bg-accent/60 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:border-primary"
          >
            <option value="沈变本部">沈变公司 · 沈变本部</option>
            <option value="衡变本部">衡变公司 · 衡变本部</option>
            <option value="超高压公司">新变厂 · 超高压公司</option>
            <option value="鲁缆本部">鲁缆公司 · 鲁缆本部</option>
            <option value="特变电工新疆电缆有限公司">新缆厂 · 新疆电缆</option>
            <option value="德缆股份公司">德缆公司 · 德缆股份</option>
          </select>
          <input
            type="month"
            value={entryPeriod}
            onChange={(e) => setEntryPeriod(e.target.value)}
            className="bg-accent/60 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {submitted && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>填报成功！数据已实时同步至指标核算引擎与碳管理中心，已生成审核留痕日志。</span>
        </div>
      )}

      {/* 填报表单主体 */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-4">
          <Panel className="p-5">
            <PanelTitle icon={Flame}>一、非电能源介质月度消耗量填报</PanelTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-foreground font-medium flex items-center justify-between">
                  <span>天然气总用量 (m³)</span>
                  <span className="text-muted-foreground text-[11px]">燃气账单实物量</span>
                </label>
                <input
                  type="number"
                  value={formData.gasVolume}
                  onChange={(e) => setFormData({ ...formData, gasVolume: e.target.value })}
                  className="w-full bg-accent/40 border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-medium flex items-center justify-between">
                  <span>工业蒸汽消耗量 (t / GJ)</span>
                  <span className="text-muted-foreground text-[11px]">供热计量结算单</span>
                </label>
                <input
                  type="number"
                  value={formData.steamVolume}
                  onChange={(e) => setFormData({ ...formData, steamVolume: e.target.value })}
                  className="w-full bg-accent/40 border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-medium flex items-center justify-between">
                  <span>工业自来水总用量 (t)</span>
                  <span className="text-muted-foreground text-[11px]">水费账单/总表抄表</span>
                </label>
                <input
                  type="number"
                  value={formData.waterVolume}
                  onChange={(e) => setFormData({ ...formData, waterVolume: e.target.value })}
                  className="w-full bg-accent/40 border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-medium flex items-center justify-between">
                  <span>厂内柴油/汽油用量 (L)</span>
                  <span className="text-muted-foreground text-[11px]">叉车/发电机燃料</span>
                </label>
                <input
                  type="number"
                  value={formData.dieselVolume}
                  onChange={(e) => setFormData({ ...formData, dieselVolume: e.target.value })}
                  className="w-full bg-accent/40 border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <PanelTitle icon={DollarSign}>二、财务产值与产品产量统计填报</PanelTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-foreground font-medium flex items-center justify-between">
                  <span>企业工业总产值 (万元)</span>
                  <span className="text-muted-foreground text-[11px]">财务经营快报</span>
                </label>
                <input
                  type="number"
                  value={formData.industrialOutputVal}
                  onChange={(e) => setFormData({ ...formData, industrialOutputVal: e.target.value })}
                  className="w-full bg-accent/40 border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-medium flex items-center justify-between">
                  <span>工业增加值 (万元)</span>
                  <span className="text-muted-foreground text-[11px]">核算增加值能耗分母</span>
                </label>
                <input
                  type="number"
                  value={formData.industrialAddedVal}
                  onChange={(e) => setFormData({ ...formData, industrialAddedVal: e.target.value })}
                  className="w-full bg-accent/40 border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-foreground font-medium flex items-center justify-between">
                  <span>产品完工产量 (万kVA / 万km*mm²)</span>
                  <span className="text-muted-foreground text-[11px]">MES 订单入库合格品总容量</span>
                </label>
                <input
                  type="number"
                  value={formData.transformerYieldKva}
                  onChange={(e) => setFormData({ ...formData, transformerYieldKva: e.target.value })}
                  className="w-full bg-accent/40 border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <PanelTitle icon={FileCheck}>三、填报责任人与附件备注</PanelTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-foreground font-medium">填报责任人</label>
                <input
                  type="text"
                  value={formData.fillerName}
                  onChange={(e) => setFormData({ ...formData, fillerName: e.target.value })}
                  className="w-full bg-accent/40 border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-foreground font-medium">上传原始账单/凭证凭据 (PDF/Excel)</label>
                <input
                  type="file"
                  className="w-full text-xs text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-foreground font-medium">填报情况说明与备注</label>
                <textarea
                  rows={2}
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  className="w-full bg-accent/40 border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border">
              <button
                type="reset"
                className="px-4 py-2 rounded-lg border border-border hover:bg-accent text-muted-foreground text-xs"
              >
                重置表单
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40 transition-all"
              >
                <Save className="size-4" />
                提交并触发能碳核算重算
              </button>
            </div>
          </Panel>
        </div>

        {/* 右侧：填报核验与历史日志 */}
        <div className="lg:col-span-4 space-y-4">
          <Panel className="p-4 space-y-3">
            <PanelTitle icon={History}>填报合规校验与审核状态</PanelTitle>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-400 block">数据合理性校验通过</span>
                  <span className="text-muted-foreground text-[11px]">
                    天然气与蒸汽用量环比上月波动在 ±5% 正常区间内。
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-accent/40 border border-border/60 space-y-1 text-muted-foreground">
                <span className="font-semibold text-foreground block">【数据流向追踪】</span>
                <p>提交后将自动用于：</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>范围一碳排放直接燃烧计算</li>
                  <li>单位工业增加值能耗分母计算</li>
                  <li>综合能源消费量折标煤汇总</li>
                </ul>
              </div>
            </div>
          </Panel>

          <Panel className="p-4">
            <PanelTitle icon={History}>近期填报历史留痕</PanelTitle>
            <div className="space-y-2.5 mt-3 text-xs">
              {historyLogs.map((log) => (
                <div key={log.period} className="p-2.5 rounded-lg bg-accent/30 border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-foreground">{log.period}</span>
                    <StatusBadge tone="ok">{log.status}</StatusBadge>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    气：{log.gas} · 汽：{log.steam}
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 flex justify-between">
                    <span>责任人：{log.filler}</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </form>
    </div>
  )
}

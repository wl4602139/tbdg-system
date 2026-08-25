'use client'

import { useState } from 'react'
import {
  Activity,
  Sun,
  FileText,
  Paperclip,
  Download,
  ChevronRight,
  ChevronDown,
  Factory,
  MonitorCog,
  Leaf,
  Search,
  Zap,
  BarChart3,
  Sparkles,
  Printer,
  CheckCircle2,
  PieChart,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, DataTable, KpiCard } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { LineTrend, Donut } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { seedFactor, vary, varyNum } from '@/lib/variant'
import { orgTree, isLeaf, filterOrg, type OrgNode } from '@/lib/org'
import { greenPower } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type GreenSource = {
  key: string
  name: string
  ratio: number
  qty: number
  color: string
  desc: string
  detail: { period: string; qty: string; from: string; no: string }[]
  files: { name: string; type: string; size: string }[]
}

const greenSources: GreenSource[] = [
  {
    key: 'direct',
    name: '直供绿电（新能源资产）',
    ratio: 58,
    qty: 7.3,
    color: 'var(--chart-2)',
    desc: '分布式光伏 + 储能电站，直接接入厂区配电室',
    detail: [
      { period: '本日', qty: '7.3 万kWh', from: '沈变屋顶 10MWp 光伏', no: 'PV-2026-0819' },
      { period: '本月累计', qty: '182.6 万kWh', from: '沈变光伏 + 储能电站', no: 'PV-2026-08' },
      { period: '本年累计', qty: '1,486 万kWh', from: '园区新能源资产', no: 'PV-2026' },
    ],
    files: [
      { name: '沈变分布式光伏消纳协议.pdf', type: 'PDF', size: '2.4 MB' },
      { name: '电网物理可溯源绿电结算单-2026.08.xlsx', type: 'Excel', size: '860 KB' },
    ],
  },
  {
    key: 'trade',
    name: '交易绿电（电力市场化交易）',
    ratio: 28,
    qty: 3.5,
    color: 'var(--chart-1)',
    desc: '通过省电力交易中心向风电/光伏电站跨省购买绿电',
    detail: [
      { period: '本日', qty: '3.5 万kWh', from: '辽宁电力交易中心', no: 'TRD-2026-LN08' },
      { period: '本月累计', qty: '88.0 万kWh', from: '辽宁风电交易合同', no: 'TRD-2026-08' },
      { period: '本年累计', qty: '720 万kWh', from: '跨省区绿色电力交易', no: 'TRD-2026' },
    ],
    files: [
      { name: '2026年度绿色电力中长期购售电合同.pdf', type: 'PDF', size: '4.1 MB' },
      { name: '绿电交易凭证与电能量校核单.pdf', type: 'PDF', size: '1.2 MB' },
    ],
  },
  {
    key: 'cert',
    name: '购买绿证（中国绿证 GEC）',
    ratio: 14,
    qty: 1.8,
    color: 'var(--chart-3)',
    desc: '国家能源局核发的绿色电力证书认购',
    detail: [
      { period: '本日', qty: '1.8 万个 (等效180万kWh)', from: '国家可再生能源信息管理中心', no: 'GEC-2026-0801' },
      { period: '本月累计', qty: '44.0 万个', from: '绿色电力证书交易平台', no: 'GEC-2026-08' },
      { period: '本年累计', qty: '360 万个', from: 'GEC 平台核发', no: 'GEC-2026' },
    ],
    files: [
      { name: '绿色电力证书核发与划转凭据.pdf', type: 'PDF', size: '1.8 MB' },
      { name: '绿证消纳注销清单-2026H1.xlsx', type: 'Excel', size: '640 KB' },
    ],
  },
]

export default function GreenMonitorPage() {
  const [selectedOrg, setSelectedOrg] = useState<string>('沈变本部')
  const [activePeriod, setActivePeriod] = useState<string>('2026-08')
  const [activeTab, setActiveTab] = useState<'day' | 'month' | 'year'>('day')
  const [selectedSource, setSelectedSource] = useState<GreenSource | null>(null)
  const [showReportModal, setShowReportModal] = useState<boolean>(false)

  const factor = seedFactor(selectedOrg, activePeriod, activeTab)
  const greenTrend = vary(
    [
      { time: '06:00', 直供绿电: 0.2, 交易绿电: 0.8, 购绿证: 0.3 },
      { time: '08:00', 直供绿电: 1.8, 交易绿电: 1.2, 购绿证: 0.3 },
      { time: '10:00', 直供绿电: 3.5, 交易绿电: 1.5, 购绿证: 0.4 },
      { time: '12:00', 直供绿电: 4.2, 交易绿电: 1.6, 购绿证: 0.4 },
      { time: '14:00', 直供绿电: 3.8, 交易绿电: 1.5, 购绿证: 0.4 },
      { time: '16:00', 直供绿电: 2.1, 交易绿电: 1.2, 购绿证: 0.3 },
      { time: '18:00', 直供绿电: 0.6, 交易绿电: 1.0, 购绿证: 0.3 },
    ],
    factor
  )

  return (
    <div className="space-y-4">
      {/* 顶部工具栏与一键生成报告按钮 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <Leaf className="size-4 text-emerald-400" />
          <span className="font-semibold text-foreground text-sm">绿电监测主体：</span>
          <Badge tone="ok">{selectedOrg}</Badge>
          <span className="text-xs text-muted-foreground">（直供绿电 + 交易绿电 + 购买绿证）</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
          >
            <FileText className="size-3.5" />
            一键生成绿电消纳报告
          </button>
          <TimeRange value={activePeriod} onChange={setActivePeriod} />
        </div>
      </div>

      {/* 核心指标 KPI 概览 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          title="绿电综合占比"
          value={varyNum(38.6, factor)}
          unit="%"
          delta="+6.6% (国家零碳标杆 40%)"
          up
          tone="ok"
        />
        <KpiCard
          title="直供绿电发电量"
          value={varyNum(184.5, factor)}
          unit="万kWh"
          delta="自建光伏即时消纳"
          up
          tone="ok"
        />
        <KpiCard
          title="物理认定量占比"
          value={varyNum(24.8, factor)}
          unit="%"
          delta="+2.8% 物理溯源"
          up
          tone="info"
        />
        <KpiCard
          title="绿电累计创效/节费"
          value={varyNum(42.8, factor)}
          unit="万元"
          delta="本月峰谷套利与减排"
          up
          tone="ok"
        />
      </div>

      {/* 绿电三大来源分布卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {greenSources.map((src) => {
          const qtyVal = varyNum(src.qty, factor)
          return (
            <div
              key={src.key}
              onClick={() => setSelectedSource(src)}
              className="p-4 rounded-lg bg-card border border-border hover:border-emerald-500/60 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground text-sm group-hover:text-emerald-400 transition-colors">
                    {src.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{src.desc}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
                  {src.ratio}%
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-foreground">{qtyVal}</span>
                <span className="text-xs text-muted-foreground">万kWh</span>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-emerald-400">
                <span>查看溯源凭单与协议明细 →</span>
                <Paperclip className="size-3.5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* 绿电出力与消纳趋势曲线 */}
      <Panel className="p-4">
        <PanelTitle icon={Activity}>绿电时序出力与消纳结构趋势</PanelTitle>
        <div className="h-64 mt-3">
          <LineTrend
            data={greenTrend}
            xKey="time"
            lines={[
              { key: '直供绿电', color: '#10b981' },
              { key: '交易绿电', color: '#0284c7' },
              { key: '购绿证', color: '#f59e0b' },
            ]}
          />
        </div>
      </Panel>

      {/* 绿电消纳报告弹窗 (Report Modal) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-3xl bg-card border border-border rounded-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-emerald-400" />
                <h3 className="text-base font-bold text-foreground">
                  特变电工（{selectedOrg}）绿电消纳分析与优化报告
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* 报告正文 */}
            <div className="space-y-4 text-xs leading-relaxed text-foreground">
              <div className="p-3.5 rounded-lg bg-accent/30 border border-border space-y-1">
                <span className="font-semibold text-foreground text-sm block">一、报告概述与主体信息</span>
                <p className="text-muted-foreground">
                  报告主体：{selectedOrg} · 统计周期：2026年8月 · 编制单位：特变电工电装集团零碳园区集控中心。
                  本月该工厂通过自建屋顶光伏直供、绿电交易及 GEC 绿证认购，全面推进非化石能源替代。
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-foreground text-sm block">二、绿电消费量精准拆解与计算公式</span>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  <div className="p-2.5 rounded bg-accent/40 border border-border/60">
                    <span className="text-muted-foreground block text-[11px]">自建光伏消纳</span>
                    <span className="text-base font-bold text-emerald-400">182.6 万kWh</span>
                  </div>
                  <div className="p-2.5 rounded bg-accent/40 border border-border/60">
                    <span className="text-muted-foreground block text-[11px]">市场化交易绿电</span>
                    <span className="text-base font-bold text-sky-400">88.0 万kWh</span>
                  </div>
                  <div className="p-2.5 rounded bg-accent/40 border border-border/60">
                    <span className="text-muted-foreground block text-[11px]">GEC 绿证认购</span>
                    <span className="text-base font-bold text-amber-400">44.0 万kWh</span>
                  </div>
                </div>
                <p className="text-muted-foreground font-mono text-[11px] bg-accent/20 p-2 rounded">
                  核心指标公式：非化石电力消费物理认定量占比 = (自建光伏消纳 + 专线直供) / 总用电量 = 24.8%；绿电综合占比 = 38.6%。
                </p>
              </div>

              {/* AI 优化建议 */}
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-sm">
                  <Sparkles className="size-4" />
                  三、AI 智能优化策略与结论建议
                </div>
                <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                  <li>
                    <strong className="text-foreground">储能削峰填谷策略优化：</strong>
                    建议在午间 11:30~13:30 光伏发电峰值时段以 5MW 满功率充电，在晚高峰 18:00~20:00 放电，预计月度新增套利 8.2 万元。
                  </li>
                  <li>
                    <strong className="text-foreground">光伏组件清洗调度：</strong>
                    遥感灰尘监测提示 3 号车间屋顶光伏透光率衰减 4.5%，建议于本周末组织机器人清洗，预计提升出力 3.8%。
                  </li>
                  <li>
                    <strong className="text-foreground">零碳工厂达标结论：</strong>
                    当前非化石能源占比已达 38.6%，距离国家级零碳工厂三星级（40%）仅差 1.4%，建议下月增购 20 万 kWh 市场化绿电。
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-accent text-muted-foreground"
              >
                关闭
              </button>
              <button
                onClick={() => alert('报告导出就绪！')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow"
              >
                <Download className="size-3.5" />
                导出 PDF 报告
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 来源明细与凭单弹窗 */}
      {selectedSource && (
        <Modal
          title={`${selectedSource.name} · 溯源台账与凭证`}
          open={!!selectedSource}
          onClose={() => setSelectedSource(null)}
        >
          <div className="space-y-4 text-xs">
            <DataTable
              columns={[
                { key: 'period', header: '统计周期' },
                { key: 'qty', header: '消纳电量' },
                { key: 'from', header: '供能主体/机构' },
                { key: 'no', header: '结算单/凭证编码' },
              ]}
              data={selectedSource.detail}
            />
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="font-semibold text-foreground block">归档核查凭证：</span>
              {selectedSource.files.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between p-2 rounded bg-accent/40 border border-border/60"
                >
                  <div className="flex items-center gap-2">
                    <Paperclip className="size-3.5 text-primary" />
                    <span className="text-foreground">{f.name}</span>
                    <span className="text-muted-foreground">({f.size})</span>
                  </div>
                  <button className="text-primary hover:underline flex items-center gap-1">
                    <Download className="size-3" /> 下载
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

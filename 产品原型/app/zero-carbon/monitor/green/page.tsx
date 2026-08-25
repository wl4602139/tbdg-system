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
  ShieldCheck,
  Award,
  QrCode,
  CheckCheck,
  TrendingUp,
  X,
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
    name: '直供绿电（自建分布式光伏）',
    ratio: 58,
    qty: 7.3,
    color: '#52c41a',
    desc: '分布式光伏 + 储能电站，直接接入厂区配电室就地 100% 消纳',
    detail: [
      { period: '本日消纳', qty: '7.3 万kWh', from: '沈变屋顶 10MWp 光伏', no: 'PV-2026-0819' },
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
    name: '交易绿电（跨省电力市场化交易）',
    ratio: 28,
    qty: 3.5,
    color: '#1677ff',
    desc: '通过省电力交易中心向风电/光伏电站跨省购买绿电，带环境溢价',
    detail: [
      { period: '本日消纳', qty: '3.5 万kWh', from: '辽宁电力交易中心', no: 'TRD-2026-LN08' },
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
    name: '购买绿证（中国绿色电力证书 GEC）',
    ratio: 14,
    qty: 1.8,
    color: '#722ed1',
    desc: '国家能源局核发并注销的绿色电力证书，对应 1000 kWh 绿色电能量',
    detail: [
      { period: '本日划转', qty: '1.8 万个 (等效180万kWh)', from: '国家可再生能源信息管理中心', no: 'GEC-2026-0801' },
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
    <div className="space-y-3">
      {/* 🌟 1. 顶部工具栏与一键生成报告按钮 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Leaf className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-800">
                绿电消纳监测与消纳分析报告系统
              </h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                直供 (58%) + 交易 (28%) + 绿证 (14%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              主体：{selectedOrg} · 全流程溯源符合国家可再生能源电力消纳保障机制
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <FileText className="size-3.5" />
            <span>一键生成经营单位绿电消纳分析报告</span>
          </button>
          <TimeRange value={activePeriod} onChange={setActivePeriod} />
        </div>
      </div>

      {/* 🌟 2. 核心指标 KPI 概览 + 年度配额进度卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-white border border-[#e5e7eb] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>绿电综合占比</span>
            <span className="text-[10px] font-bold text-emerald-600 font-mono">考核标杆 40.0%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-emerald-600">{varyNum(38.6, factor)}</span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[96.5%]" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block pt-0.5">达成率 96.5% · 差距仅 1.4%</span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-[#e5e7eb] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 block">直供绿电发电量</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-800">{varyNum(184.5, factor)}</span>
            <span className="text-xs text-slate-400">万kWh</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono">屋顶光伏 100% 就地消纳</span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-[#e5e7eb] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 block">市场化交易绿电</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#1677ff]">{varyNum(88.0, factor)}</span>
            <span className="text-xs text-slate-400">万kWh</span>
          </div>
          <span className="text-[11px] text-blue-600 font-mono">跨省绿电外送物理溯源</span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-[#e5e7eb] shadow-xs space-y-1">
          <span className="text-xs text-slate-500 block">绿电累计环境创效</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-800">{varyNum(42.8, factor)}</span>
            <span className="text-xs text-slate-400">万元</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono">碳减排收益 + 避峰节费</span>
        </div>
      </div>

      {/* 🌟 3. 绿电三大来源分布卡片 (带消纳溯源与附件清单) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {greenSources.map((src) => {
          const qtyVal = varyNum(src.qty, factor)
          return (
            <div
              key={src.key}
              className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-800 font-sans flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ backgroundColor: src.color }} />
                    {src.name}
                  </span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    占比 {src.ratio}%
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{src.desc}</p>

                <div className="space-y-1.5 pt-1 text-xs font-mono">
                  {src.detail.map((d, i) => (
                    <div key={i} className="flex justify-between items-center p-1.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 font-sans text-[11px]">{d.period}</span>
                      <span className="font-bold text-slate-800">{d.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 凭证附件 */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-sans block">可信证明文件与交易凭单：</span>
                {src.files.map((f, fi) => (
                  <div
                    key={fi}
                    onClick={() => alert(`正在下载凭证文件：${f.name}`)}
                    className="flex items-center justify-between p-1 rounded hover:bg-slate-50 cursor-pointer text-[11px] text-slate-600 group"
                  >
                    <span className="truncate group-hover:text-[#1677ff]">{f.name}</span>
                    <Download className="size-3 text-slate-400 group-hover:text-[#1677ff] shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 🌟 4. 绿电消纳削峰填谷效果评估曲线 */}
      <div className="bg-white p-4.5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
          <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
            <Activity className="size-4 text-[#1677ff]" />
            全天 24 小时绿电消纳削峰填谷效果评估 (MW)
          </span>
          <div className="flex items-center gap-4 text-xs font-medium font-sans">
            <span className="text-slate-500">● 原始电网负荷</span>
            <span className="text-emerald-600">● 绿电消纳后净电网负荷</span>
            <span className="text-[#1677ff]">● 市场交易绿电注入</span>
          </div>
        </div>

        <div className="h-[280px]">
          <LineTrend
            data={greenTrend}
            xKey="time"
            height={280}
            lines={[
              { key: '直供绿电', name: '直供光伏', color: '#52c41a' },
              { key: '交易绿电', name: '市场绿电', color: '#1677ff' },
              { key: '购绿证', name: 'GEC绿证', color: '#722ed1' },
            ]}
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🌟 绿电消纳分析报告一键生成弹窗 (带公章水印与防伪溯源码) */}
      {/* ======================================================== */}
      {showReportModal && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* 弹窗头部 */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <FileText className="size-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900 font-sans">
                    特变电工经营单位绿电消纳分析与合规报告 (2026年08月)
                  </h2>
                  <span className="text-[10px] text-slate-500 font-mono">
                    认证主体：沈变本部 · 报告编号：#TBEA-GR-202608-0842
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-800"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 报告内容区 (带防伪电子公章) */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs font-sans relative">
              {/* 红章水印 */}
              <div className="absolute right-12 bottom-16 size-32 rounded-full border-4 border-red-600/30 text-red-600/30 flex flex-col items-center justify-center font-bold pointer-events-none rotate-[-18deg] select-none">
                <span className="text-[10px]">特变电工集团</span>
                <span className="text-xs tracking-widest my-0.5">绿色能源中心</span>
                <span className="text-[9px]">★ 认证专用章 ★</span>
              </div>

              {/* 报告主体表格 */}
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-900">一、本期绿电消纳核心结论</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                      🟢 达标通过 (RE100/国网绿电标准)
                    </span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed">
                    本周期内沈变本部共计消纳绿色电能 <strong>314.6 万 kWh</strong>，占当期总用电量的 <strong>38.6%</strong>。其中屋顶自发自用光伏直供消纳 182.6 万 kWh，市场化跨省交易绿电 88.0 万 kWh，核销中国绿证 GEC 44.0 万个，直接减少二氧化碳间接排放量 <strong>2,580.4 吨</strong>。
                  </p>
                </div>

                {/* 数据核算清单 */}
                <div className="border border-slate-200 rounded-lg overflow-hidden font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-sans font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">绿电消纳渠道</th>
                        <th className="p-2.5">物理溯源电站 / 交易机构</th>
                        <th className="p-2.5 text-right">消纳电量 (万kWh)</th>
                        <th className="p-2.5 text-right">占比 (%)</th>
                        <th className="p-2.5 text-center font-sans">核验状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="p-2.5 font-bold font-sans">1. 厂区自建分布式光伏</td>
                        <td className="p-2.5 text-slate-600">沈变厂区 10MWp 屋顶光伏</td>
                        <td className="p-2.5 text-right font-bold text-emerald-700">182.6</td>
                        <td className="p-2.5 text-right">58.0%</td>
                        <td className="p-2.5 text-center font-sans"><span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">电表物理直采</span></td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold font-sans">2. 跨省市场化交易绿电</td>
                        <td className="p-2.5 text-slate-600">辽宁电力交易中心 (中长期绿电)</td>
                        <td className="p-2.5 text-right font-bold text-[#1677ff]">88.0</td>
                        <td className="p-2.5 text-right">28.0%</td>
                        <td className="p-2.5 text-center font-sans"><span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">交易中心结算</span></td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold font-sans">3. 绿色电力证书 (GEC)</td>
                        <td className="p-2.5 text-slate-600">国家可再生能源信息管理中心</td>
                        <td className="p-2.5 text-right font-bold text-purple-700">44.0</td>
                        <td className="p-2.5 text-right">14.0%</td>
                        <td className="p-2.5 text-center font-sans"><span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold text-[10px]">证书核销注销</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 溯源认证块 */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px] font-mono">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 font-sans block">国家能源局可再生能源电力消纳区块链存证：</span>
                    <span className="font-bold text-slate-800">Hash: 0x7F8E39A4D20B9C1E5587AA6301FE882C</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-200 text-slate-700 font-bold font-sans">
                    可信防伪验证通过
                  </span>
                </div>
              </div>
            </div>

            {/* 弹窗底部操作 */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                报告支持导出 PDF / Excel 或直接调用打印机输出
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('已成功导出《沈变本部绿电消纳分析报告(2026-08)》PDF 文件！')}
                  className="px-3.5 py-1.5 rounded bg-[#1677ff] hover:bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="size-3.5" />
                  <span>导出完整 PDF 报告</span>
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-3.5 py-1.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs shadow-xs"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

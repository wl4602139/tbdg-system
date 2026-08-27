'use client'

import React, { useState } from 'react'
import {
  Leaf,
  Plus,
  Building2,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Search,
  ExternalLink,
  X,
  FileText,
  Clock,
} from 'lucide-react'
import { OrgTreeSidebar, type OrgNodeItem } from '@/components/shared/org-tree-sidebar'
import { cn } from '@/lib/utils'

interface CcerProjectItem {
  id: string
  code: string
  name: string
  methodology: string
  annualReduction: number // tCO2
  stage: '1. PDD编制' | '2. 第三方审定' | '3. 注册公示中' | '4. 连续监测' | '5. 已签发挂牌'
  targetPlant: string
  planIssueDate: string
  statusTone: 'ok' | 'blue' | 'warn'
}

const CCER_PROJECTS: CcerProjectItem[] = [
  {
    id: 'ccer-01',
    code: 'CCER-2026-PV-01',
    name: '特变电工沈阳产业园 10MWp 分布式光伏自愿减排项目',
    methodology: 'CMS-001 (可再生能源并网)',
    annualReduction: 6850,
    stage: '5. 已签发挂牌',
    targetPlant: '沈变本部 (内部履约抵消 5%)',
    planIssueDate: '2025-12-10 (已签发)',
    statusTone: 'ok',
  },
  {
    id: 'ccer-02',
    code: 'CCER-2026-PV-02',
    name: '特变电工新疆变压器厂 12MWp 屋顶光伏自愿减排项目',
    methodology: 'CMS-001 (可再生能源并网)',
    annualReduction: 8240,
    stage: '3. 注册公示中',
    targetPlant: '新变厂 / 天池特变',
    planIssueDate: '2026-Q4 (预计)',
    statusTone: 'blue',
  },
  {
    id: 'ccer-03',
    code: 'CCER-2026-WHR-03',
    name: '特变电工衡阳南方产业园工业余热综合利用项目',
    methodology: 'CMS-004 (工业余热余压利用)',
    annualReduction: 3120,
    stage: '2. 第三方审定',
    targetPlant: '衡变本部 / 云集开关',
    planIssueDate: '2027-Q1 (预计)',
    statusTone: 'warn',
  },
  {
    id: 'ccer-04',
    code: 'CCER-2026-PV-04',
    name: '特变电工山东鲁缆 6MWp 柔性光伏自愿减排项目',
    methodology: 'CMS-001 (可再生能源并网)',
    annualReduction: 4150,
    stage: '1. PDD编制',
    targetPlant: '鲁缆公司',
    planIssueDate: '2027-Q2 (预计)',
    statusTone: 'warn',
  },
]

export default function VoluntaryReductionPage() {
  const [selectedOrg, setSelectedOrg] = useState<OrgNodeItem>({
    id: 'group_all',
    name: '特变电工集团 (电装大盘)',
    fullName: '特变电工集团（电装板块全景）',
    level: 'group',
  })

  const [showApplyModal, setShowApplyModal] = useState(false)

  return (
    <div className="flex w-full items-start gap-4">
      {/* 🌟 左侧 270px 经典工业级导线拓扑树 */}
      <OrgTreeSidebar
        title="工厂与用能拓扑 (3级)"
        subtitle="全层级穿透"
        selectedId={selectedOrg.id}
        onSelect={(node) => setSelectedOrg(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 顶部控制与视角提示卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base shrink-0 border border-emerald-200 shadow-2xs">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">{selectedOrg.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
                  🏢 集团全局大盘视角 (电装宏观总览)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                国家温室气体自愿减排交易注册登记、5级开发步进器、CCER资产池统筹与内部履约抵消
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#1677ff] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="size-3.5" />
              <span>申报 CCER 项目</span>
            </button>
          </div>
        </div>

        {/* 4 栏 CCER 核心资产卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">集团已签发核证 CCER 总量</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-600">6.50</span>
              <span className="text-xs text-slate-500">万吨 CO₂</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>市值估算: 455 万元</span>
              <span className="text-emerald-700 font-bold">已入注册系统</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">在审 / 待核证减排量</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-blue-600">12.80</span>
              <span className="text-xs text-slate-500">万吨 CO₂</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>3个项目审定中</span>
              <span className="text-blue-700 font-mono">预计 Q4 签发</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">全国碳市场 CCER 现货均价</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-slate-900">72.50</span>
              <span className="text-xs text-slate-500">元 / 吨</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>较上月: +3.2% ↑</span>
              <span className="text-emerald-700 font-bold">北京绿交所行情</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">内部碳配额抵消节约金额</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-600">320.0</span>
              <span className="text-xs text-slate-500">万元</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>抵消履约上限: 5%</span>
              <span className="text-emerald-700 font-bold">零成本履约</span>
            </div>
          </div>
        </div>

        {/* CCER 5 级全流程申报推进看板 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">
                CCER 项目全生命周期 5 级申报推进工作台
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">标准开发周期：6 ~ 9 个月</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <span className="size-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>项目设计 (PDD)</span>
              </div>
              <p className="text-[10px] text-slate-500">编制 CCER 项目设计文件与基准线论证</p>
              <span className="mt-1 block text-[10px] font-bold text-emerald-700 font-mono">已完成 100%</span>
            </div>

            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <span className="size-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>第三方审定</span>
              </div>
              <p className="text-[10px] text-slate-500">经国家认证机构现场核验并出具审定报告</p>
              <span className="mt-1 block text-[10px] font-bold text-emerald-700 font-mono">已完成 100%</span>
            </div>

            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-800">
                <span className="size-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                <span>注册登记备案</span>
              </div>
              <p className="text-[10px] text-slate-500">国家温室气体自愿减排注册登记系统公示</p>
              <span className="mt-1 block text-[10px] font-bold text-blue-700 font-mono">进行中 (公示期)</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 opacity-60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-600">
                <span className="size-5 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px]">4</span>
                <span>减排量连续监测</span>
              </div>
              <p className="text-[10px] text-slate-400">在线计量表底接入与监测报告编制</p>
              <span className="mt-1 block text-[10px] font-mono text-slate-400">待执行</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 opacity-60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-600">
                <span className="size-5 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px]">5</span>
                <span>签发核证与挂牌</span>
              </div>
              <p className="text-[10px] text-slate-400">生态环境部最终签发并入账交易</p>
              <span className="mt-1 block text-[10px] font-mono text-slate-400">待执行</span>
            </div>
          </div>
        </div>

        {/* 集团 CCER 储备资产池台账 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900">全集团 CCER 自愿减排储备项目资产池清单</h3>
            <span className="text-[11px] text-slate-400 font-mono">统筹内部抵消与外部溢价交易</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-semibold font-sans">
                <tr>
                  <th className="px-3 py-2.5">项目编号</th>
                  <th className="px-3 py-2.5">CCER 项目名称</th>
                  <th className="px-3 py-2.5">执行方法学</th>
                  <th className="px-3 py-2.5 text-right">年预估减排量</th>
                  <th className="px-3 py-2.5 text-center">当前所处阶段</th>
                  <th className="px-3 py-2.5">内部履约抵消目标工厂</th>
                  <th className="px-3 py-2.5">计划签发时间</th>
                  <th className="px-3 py-2.5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {CCER_PROJECTS.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-[#1677ff]">{p.code}</td>
                    <td className="px-3 py-2.5 font-sans font-medium text-slate-900">{p.name}</td>
                    <td className="px-3 py-2.5 font-sans text-slate-600">{p.methodology}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-emerald-700">
                      {p.annualReduction.toLocaleString()} tCO₂
                    </td>
                    <td className="px-3 py-2.5 text-center font-sans">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                          p.statusTone === 'ok'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : p.statusTone === 'blue'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200',
                        )}
                      >
                        {p.stage}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-sans text-slate-600">{p.targetPlant}</td>
                    <td className="px-3 py-2.5 text-slate-500">{p.planIssueDate}</td>
                    <td className="px-3 py-2.5 text-right font-sans">
                      <button
                        onClick={() => alert(`正在查看【${p.name}】全套 PDD 设计文件与审定核查报告...`)}
                        className="text-[#1677ff] hover:underline"
                      >
                        审定卷宗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 申报 CCER 弹窗 Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Leaf className="size-4 text-emerald-600" />
                发起新 CCER 项目审定申报申请
              </h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">申报项目全称</label>
                <input
                  type="text"
                  placeholder="例如 特变电工德阳电缆园区 4MW 屋顶光伏自愿减排项目"
                  className="w-full h-8 px-2.5 rounded-md border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">适用 CCER 方法学</label>
                  <select className="w-full h-8 px-2.5 rounded-md border border-slate-300 bg-white">
                    <option>CMS-001 (可再生能源并网发电)</option>
                    <option>CMS-004 (工业余热余压利用)</option>
                    <option>CMS-007 (电能替代与电机节能)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">预计年均减排量 (tCO₂)</label>
                  <input type="number" placeholder="例如 2850" className="w-full h-8 px-2.5 rounded-md border border-slate-300" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">第三方审定认证机构</label>
                <select className="w-full h-8 px-2.5 rounded-md border border-slate-300 bg-white">
                  <option>通标标准技术服务有限公司 (SGS)</option>
                  <option>中国质量认证中心 (CQC)</option>
                  <option>中国船级社质量认证公司 (CCSC)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert('CCER 项目审定申报已发起，已进入【1. PDD 编制】阶段并通知集团双碳办！')
                  setShowApplyModal(false)
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
              >
                提交申报
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

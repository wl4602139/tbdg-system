'use client'

import React from 'react'
import { History, ShieldCheck, GitBranch, ArrowRight } from 'lucide-react'

const MODEL_VERSIONS = [
  {
    version: 'v2.1 (现行基准)',
    releaseDate: '2026-08-15',
    author: '集团能碳资产管理部',
    status: '生效中',
    description: '整合生态环境部 2026 最新全国电网排放因子 (0.5350 tCO2/MWh)，同步更新分布式光伏与储能度电成本折现模型。',
    params: {
      discountRate: '6.0%',
      lifespanYears: '25 年',
      opexRate: '1.5%',
      internalCarbonPrice: '¥85.0 元/吨',
      gridFactor: '0.5350 tCO2/MWh',
    },
  },
  {
    version: 'v2.0 (2026年初版)',
    releaseDate: '2026-01-10',
    author: '能源数字化项目组',
    status: '已归档',
    description: '引入动态边际减排成本 MACC 算法与用户侧储能峰谷套利财务评估模型。',
    params: {
      discountRate: '6.5%',
      lifespanYears: '25 年',
      opexRate: '1.8%',
      internalCarbonPrice: '¥80.0 元/吨',
      gridFactor: '0.5703 tCO2/MWh',
    },
  },
  {
    version: 'v1.0 (2025基线版)',
    releaseDate: '2025-06-01',
    author: '战略规划部',
    status: '已归档',
    description: '基础静态投资回收期与单一光伏节能量折算模型。',
    params: {
      discountRate: '7.0%',
      lifespanYears: '20 年',
      opexRate: '2.0%',
      internalCarbonPrice: '¥65.0 元/吨',
      gridFactor: '0.5703 tCO2/MWh',
    },
  },
]

export default function ModelHistoryPage() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2">
          <History className="size-4.5 text-[#1677ff]" />
          <h3 className="text-xs font-bold text-slate-800">特变电工能碳计算模型版本演进与发布台账</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">已受区块链存证与审计追踪保护</span>
      </div>

      <div className="divide-y divide-slate-100">
        {MODEL_VERSIONS.map((v, idx) => (
          <div key={idx} className="p-4 space-y-2 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-sm text-slate-900 font-mono">{v.version}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                    v.status === '生效中'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {v.status}
                </span>
                <span className="text-xs text-slate-400 font-sans">发布于 {v.releaseDate}</span>
              </div>
              <span className="text-xs text-slate-500">维护人: {v.author}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">{v.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px] pt-1">
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-slate-400 block font-sans">基准折现率</span>
                <span className="font-bold text-slate-800">{v.params.discountRate}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-slate-400 block font-sans">寿命周期</span>
                <span className="font-bold text-slate-800">{v.params.lifespanYears}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-slate-400 block font-sans">运维费率</span>
                <span className="font-bold text-slate-800">{v.params.opexRate}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-slate-400 block font-sans">内部碳价</span>
                <span className="font-bold text-emerald-700">{v.params.internalCarbonPrice}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-slate-400 block font-sans">电网排放因子</span>
                <span className="font-bold text-purple-700">{v.params.gridFactor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

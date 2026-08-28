'use client'

import React, { useState } from 'react'
import { Sliders, Save, CheckCircle2, RotateCcw, Info, TrendingUp, ShieldCheck } from 'lucide-react'

export default function ModelBenefitPage() {
  const [params, setParams] = useState({
    discountRate: 6.0,
    lifespanYears: 25,
    opexRate: 1.5,
    pvFirstYearDeg: 2.0,
    pvAnnualDeg: 0.55,
    internalCarbonPrice: 85.0,
    gridFactor: 0.535,
  })

  const [saveToast, setSaveToast] = useState(false)

  const handleSave = () => {
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 3000)
  }

  return (
    <div className="space-y-3.5">
      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600" />
            模型参数调优已保存并生成新版本快照 (v2.1-Patch)！
          </span>
          <span className="font-mono text-[10px] text-emerald-600">已同步至全集团效益评估计算引擎</span>
        </div>
      )}

      {/* 参数调优控制面板 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="size-4 text-[#1677ff]" />
              特变电工零碳技改项目经济效益模型核心参数调优
            </h2>
            <p className="text-[11px] text-slate-400 font-sans pt-0.5">
              修改参数后将直接重算全集团光伏、储能、热泵及节能技改项目的 IRR、NPV 与动态回收期
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setParams({
                  discountRate: 6.0,
                  lifespanYears: 25,
                  opexRate: 1.5,
                  pvFirstYearDeg: 2.0,
                  pvAnnualDeg: 0.55,
                  internalCarbonPrice: 85.0,
                  gridFactor: 0.535,
                })
              }
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="size-3.5" />
              恢复基线默认值
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-xs font-semibold text-white shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              保存并发布参数版本
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {/* 基准折现率 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 font-sans">财务基准收益率 (折现率 ic)</span>
              <span className="text-blue-700 font-bold text-sm">{params.discountRate}%</span>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              step="0.1"
              value={params.discountRate}
              onChange={(e) => setParams({ ...params, discountRate: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1677ff]"
            />
            <p className="text-[10.5px] text-slate-400 font-sans leading-tight">
              特变电工集团新能源技改类项目标准基准收益率设定为 6.0% ~ 7.0%。
            </p>
          </div>

          {/* 内部碳定价 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 font-sans">集团内部碳定价 (Shadow Price)</span>
              <span className="text-emerald-700 font-bold text-sm">¥{params.internalCarbonPrice} 元/t</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              step="1"
              value={params.internalCarbonPrice}
              onChange={(e) => setParams({ ...params, internalCarbonPrice: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-[10.5px] text-slate-400 font-sans leading-tight">
              用于将核证减排量 (CCER/CEA) 折算为项目财务附加净收益。
            </p>
          </div>

          {/* 电网基准排放因子 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 font-sans">全国电网平均排放因子</span>
              <span className="text-purple-700 font-bold text-sm">{params.gridFactor} tCO2/MWh</span>
            </div>
            <input
              type="range"
              min="0.45"
              max="0.65"
              step="0.001"
              value={params.gridFactor}
              onChange={(e) => setParams({ ...params, gridFactor: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <p className="text-[10.5px] text-slate-400 font-sans leading-tight">
              采用生态环境部 2026 最新发布的全国电网平均排放因子。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

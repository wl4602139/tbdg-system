'use client'

import React, { useState, useMemo } from 'react'
import {
  Sliders,
  Play,
  TrendingDown,
  Sun,
  Coins,
  Building2,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Info,
  RefreshCw,
  Cpu,
} from 'lucide-react'
import { OrgTreeSidebar, type OrgNodeItem } from '@/components/shared/org-tree-sidebar'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

export default function EmissionReductionModelingPage() {
  const [selectedOrg, setSelectedOrg] = useState<OrgNodeItem>({
    id: 'group_all',
    name: '特变电工集团 (电装大盘)',
    fullName: '特变电工集团（电装板块全景）',
    level: 'group',
  })

  // 仿真控制器状态
  const [capacityMWp, setCapacityMWp] = useState<number>(10.0)
  const [utilHours, setUtilHours] = useState<number>(1250)
  const [firstYearDeg, setFirstYearDeg] = useState<number>(2.0)
  const [annualDeg, setAnnualDeg] = useState<number>(0.55)
  const [gridFactor, setGridFactor] = useState<number>(0.5703)

  // 计算 25 年生命周期逐年数据
  const simulationResults = useMemo(() => {
    const list = []
    let totalKwhWan = 0
    let totalCarbonT = 0
    let totalSavingsWan = 0

    for (let year = 1; year <= 25; year++) {
      let deg = 0
      if (year === 1) {
        deg = firstYearDeg / 100
      } else {
        deg = (firstYearDeg + (year - 1) * annualDeg) / 100
      }
      const efficiency = Math.max(0.7, 1 - deg)
      // 年发电量 (万kWh) = 容量(MW) * 1000 * 小时 * efficiency / 10000
      const yearKwhWan = Number(((capacityMWp * 1000 * utilHours * efficiency) / 10000).toFixed(1))
      // 年减排量 (吨) = 年发电量(万kWh) * 10 * 排放因子(t/MWh)
      const yearCarbonT = Number((yearKwhWan * 10 * gridFactor).toFixed(1))
      // 年节电费 (万元) = 年发电量(万kWh) * 0.62元
      const yearSavingWan = Number((yearKwhWan * 0.62).toFixed(1))

      totalKwhWan += yearKwhWan
      totalCarbonT += yearCarbonT
      totalSavingsWan += yearSavingWan

      list.push({
        year: `第${year}年`,
        yearNum: year,
        年减排量: yearCarbonT,
        年发电量: yearKwhWan,
        年节电费: yearSavingWan,
      })
    }

    return {
      list,
      totalKwhWan: Math.round(totalKwhWan),
      totalCarbonWanT: (totalCarbonT / 10000).toFixed(2),
      totalSavingsYi: (totalSavingsWan / 10000).toFixed(2),
      firstYearCarbon: list[0].年减排量,
      lastYearCarbon: list[24].年减排量,
    }
  }, [capacityMWp, utilHours, firstYearDeg, annualDeg, gridFactor])

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
            <div className="size-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base shrink-0 border border-indigo-200 shadow-2xs">
              📐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">{selectedOrg.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
                  🏢 集团全局大盘视角 (电装宏观总览)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                基于国家 CCER 标准方法学（CMS-001 并网可再生能源）的减排量测算与 25 年动态仿真
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => alert('参数已同步并刷新 25 年减排仿真模型！')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#1677ff] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Play className="size-3.5" />
              <span>运行仿真模型</span>
            </button>
          </div>
        </div>

        {/* 2 栏建模控制器与仿真曲线 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 左侧：参数控制器 */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">减排项目核心参数仿真配置</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">CCER 方法学 CMS-001</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>装机容量 (MWp)</span>
                <span className="font-bold text-[#1677ff] font-mono">{capacityMWp.toFixed(1)} MWp</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="0.5"
                value={capacityMWp}
                onChange={(e) => setCapacityMWp(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>年均有效利用小时数 (h)</span>
                <span className="font-bold text-[#1677ff] font-mono">{utilHours} 小时</span>
              </div>
              <input
                type="range"
                min="800"
                max="1800"
                step="25"
                value={utilHours}
                onChange={(e) => setUtilHours(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>首年衰减率 / 逐年衰减率</span>
                <span className="font-bold text-slate-700 font-mono">
                  {firstYearDeg}% / {annualDeg}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.05"
                value={annualDeg}
                onChange={(e) => setAnnualDeg(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>电网基准排放因子 (tCO₂/MWh)</span>
                <span className="font-bold text-emerald-700 font-mono">{gridFactor}</span>
              </div>
              <input
                type="number"
                step="0.0001"
                value={gridFactor}
                onChange={(e) => setGridFactor(parseFloat(e.target.value))}
                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded font-mono"
              />
            </div>

            <div className="p-3.5 bg-blue-50/70 rounded-lg border border-blue-200 text-xs text-blue-900 leading-relaxed font-mono space-y-1">
              <span className="font-bold block mb-1">📐 模型预计 25 年全生命周期累计关键指标：</span>
              <div>
                • 25年总发电量: <strong className="text-blue-700 font-bold">{simulationResults.totalKwhWan.toLocaleString()} 万kWh</strong>
              </div>
              <div>
                • 25年累计减排: <strong className="text-emerald-700 font-bold">{simulationResults.totalCarbonWanT} 万吨 CO₂</strong>
              </div>
              <div>
                • 估算总节电费: <strong className="text-slate-900 font-bold">{simulationResults.totalSavingsYi} 亿元</strong>
              </div>
            </div>
          </div>

          {/* 右侧：25年生命周期减排与发电曲线 */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  25 年生命周期逐年减排量衰减仿真曲线 (tCO₂/年)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">首年 {simulationResults.firstYearCarbon}t → 末年 {simulationResults.lastYearCarbon}t</span>
            </div>

            <div className="h-[280px]">
              <LineTrend
                data={simulationResults.list}
                xKey="year"
                height={280}
                lines={[
                  { key: '年减排量', name: '年减排量 (tCO₂)', color: '#10b981' },
                  { key: '年发电量', name: '年发电量 (万kWh)', color: '#1677ff' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* 下方：CCER 方法学依据与计算公式说明 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Info className="size-4 text-[#1677ff]" />
            <span>国家自愿减排 CCER 方法学依据与测算逻辑</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-mono">
            依据国家生态环境部发布的《可再生能源并网发电方法学 (CMS-001)》：基准线排放量 BEy = EGy × EFgrid,y，其中 EGy 为项目实际上网或自发自用净电量，EFgrid,y 采用所在区域电网基准排放因子（0.5703 tCO₂/MWh）。项目运行期为 25 年，光伏组件衰减遵循国家标准（首年 &le; 2.0%，此后每年 &le; 0.55%）。
          </p>
        </div>
      </div>
    </div>
  )
}

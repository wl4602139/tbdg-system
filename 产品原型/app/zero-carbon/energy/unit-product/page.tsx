'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Download,
  Zap,
  Cable,
  Package,
  Layers,
  Search,
  ArrowRight,
  TrendingDown,
  Building2,
  Cpu,
  Target,
  Award,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  X,
  Maximize2,
  Info,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 订单能耗红黑榜数据
interface OrderEnergyRecord {
  id: string
  orderNo: string
  model: string
  category: 'transformer' | 'cable'
  company: string
  outputQuantity: string
  dryEnergyKWh: number
  totalEnergyKWh: number
  unitConsumption: string
  targetDiffYoy: string
  isRank: 'red' | 'black' // 红榜 (标杆) | 黑榜 (预警)
}

const ORDER_ENERGY_RECORDS: OrderEnergyRecord[] = [
  { id: 'ord-01', orderNo: 'ORD-2026-BY01', model: 'ODFS-334MVA/500kV', category: 'transformer', company: '沈变公司', outputQuantity: '334 MVA', dryEnergyKWh: 58400, totalEnergyKWh: 105900, unitConsumption: '0.317 kWh/kVA', targetDiffYoy: '-6.2% (达成能效标杆)', isRank: 'red' },
  { id: 'ord-02', orderNo: 'ORD-2026-BY04', model: 'SSP-840MVA/500kV', category: 'transformer', company: '沈变公司', outputQuantity: '840 MVA', dryEnergyKWh: 142000, totalEnergyKWh: 258700, unitConsumption: '0.308 kWh/kVA', targetDiffYoy: '-7.2% (超越-5%目标)', isRank: 'red' },
  { id: 'ord-03', orderNo: 'ORD-2026-BY03', model: 'SZ11-50MVA/110kV', category: 'transformer', company: '沈变公司', outputQuantity: '50 MVA', dryEnergyKWh: 8900, totalEnergyKWh: 16500, unitConsumption: '0.330 kWh/kVA', targetDiffYoy: '-4.3% (未达-5%考核线)', isRank: 'black' },
  { id: 'ord-04', orderNo: 'ORD-2026-XL01', model: 'YJLW03-110kV 1x1200mm²', category: 'cable', company: '鲁缆公司', outputQuantity: '120 km', dryEnergyKWh: 82400, totalEnergyKWh: 144900, unitConsumption: '1.208 kWh/km', targetDiffYoy: '-6.1% (达成能效标杆)', isRank: 'red' },
  { id: 'ord-05', orderNo: 'ORD-2026-XL03', model: 'WDZ-YJY-0.6/1kV 4x240mm²', category: 'cable', company: '鲁缆公司', outputQuantity: '180 km', dryEnergyKWh: 51200, totalEnergyKWh: 127000, unitConsumption: '0.706 kWh/km', targetDiffYoy: '-4.1% (未达-5%考核线)', isRank: 'black' },
]

export default function UnitProductPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'comp_sb',
    name: '沈变公司',
    fullName: '沈变公司 (东北输变电中心)',
    level: 'company',
    badge: '变压器',
  })

  // 2 大核心子视图切换: 'output' (单位产值 - 前置核心) vs 'product' (单位产品 - 产线型号订单)
  const [viewMode, setViewMode] = useState<'output' | 'product'>('output')
  const [category, setCategory] = useState<'transformer' | 'cable'>('transformer')
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [searchKw, setSearchKw] = useState('')
  const [selectedFormulaModal, setSelectedFormulaModal] = useState<boolean>(false)

  // 单位产值 24 个月历史走势模拟数据 (含总裁 -5% 考核线)
  const outputTrendData = [
    { month: '25-09', 实测单耗: 0.0585, 总裁5分之1考核线: 0.0570 },
    { month: '25-11', 实测单耗: 0.0580, 总裁5分之1考核线: 0.0570 },
    { month: '26-01', 实测单耗: 0.0572, 总裁5分之1考核线: 0.0570 },
    { month: '26-03', 实测单耗: 0.0568, 总裁5分之1考核线: 0.0570 },
    { month: '26-05', 实测单耗: 0.0561, 总裁5分之1考核线: 0.0570 },
    { month: '26-07', 实测单耗: 0.0556, 总裁5分之1考核线: 0.0570 },
    { month: '26-08', 实测单耗: 0.0553, 总裁5分之1考核线: 0.0570 },
  ]

  // 过滤红黑榜记录
  const filteredOrders = useMemo(() => {
    return ORDER_ENERGY_RECORDS.filter((r) => {
      if (searchKw && !r.orderNo.toLowerCase().includes(searchKw.toLowerCase()) && !r.model.toLowerCase().includes(searchKw.toLowerCase())) {
        return false
      }
      return true
    })
  }, [searchKw])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 经典工业级拓扑树 (无产品节点如自动化标灰) */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        
        {/* 1. 顶部 Header 与 2 大子视图切片 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Target className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">能效与单耗管控中心</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                  数据按日更新 (每日 00:00)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                当前主体：【<span className="font-bold text-[#1677ff] font-sans">{selectedNode.name}</span>】 · 
                <span className="text-slate-500">跨公司横向对标已剥离至【对标管理】模块</span>
              </p>
            </div>
          </div>

          {/* 2 大子视图切片 (抓大放小: 单位产值前置 vs 单位产品) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-sans">
            <button
              type="button"
              onClick={() => setViewMode('output')}
              className={cn(
                'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                viewMode === 'output'
                  ? 'bg-[#1677ff] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Layers className="size-3.5" />
              <span>1. 单位产值能耗 (全厂总体 · 总裁同比-5%目标)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('product')}
              className={cn(
                'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                viewMode === 'product'
                  ? 'bg-[#1677ff] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Package className="size-3.5" />
              <span>2. 单位产品能耗 (产线/型号/订单追溯)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 视图 1：单位产值能耗 (全厂总体指标 · 总裁同比-5%目标前置) */}
        {/* ========================================================================= */}
        {viewMode === 'output' && (
          <div className="space-y-3.5">
            {/* 总裁 -5% 考核目标控制台 Bento 卡片 */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <h2 className="text-xs font-bold text-slate-900">
                    【{selectedNode.name}】全厂单位产值能耗控制台 (总裁要求每年同比下降 5%)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFormulaModal(true)}
                  className="text-xs text-[#1677ff] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Info className="size-3.5" />
                  <span>查看计算公式与分子分母</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                  <div className="text-xs text-blue-800 font-sans flex items-center justify-between">
                    <span>当期全厂单位产值能耗</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">
                      综合折标
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#1677ff]">
                    0.0553 <span className="text-xs font-normal text-slate-500 font-sans">tce/万元</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-blue-200/60 font-sans flex justify-between">
                    <span>总能耗: 1,577.2 tce</span>
                    <span>总产值: 28,500 万元</span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                  <div className="text-xs text-emerald-800 font-sans flex items-center justify-between">
                    <span>同比变动幅度 (考核核心)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                      达标在控
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700">
                    -5.2% <span className="text-xs font-normal text-slate-500 font-sans">↓</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-emerald-200/60 font-sans flex justify-between">
                    <span>总裁目标线: -5.0%</span>
                    <span className="text-emerald-700 font-bold">已达成要求</span>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                  <div className="text-xs text-amber-800 font-sans flex items-center justify-between">
                    <span>上年同期基准单耗</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                      历史基准
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-700">
                    0.0583 <span className="text-xs font-normal text-slate-500 font-sans">tce/万元</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-amber-200/60 font-sans flex justify-between">
                    <span>单位降幅: 0.0030 tce</span>
                    <span className="text-amber-700 font-bold">年度对比</span>
                  </div>
                </div>

                <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
                  <div className="text-xs text-purple-800 font-sans flex items-center justify-between">
                    <span>节约标煤总量</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">
                      降本成果
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-purple-700">
                    85.5 <span className="text-xs font-normal text-slate-500 font-sans">tce</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-purple-200/60 font-sans flex justify-between">
                    <span>直接节约用能成本:</span>
                    <span className="text-purple-700 font-bold">¥41.3 万元</span>
                  </div>
                </div>
              </div>

              {/* 多时间维度变化曲线 (含 -5% 考核线) */}
              <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    【{selectedNode.name}】单位产值能耗历史变化趋势与总裁 -5% 考核线对照 (tce/万元)
                  </span>
                  <span className="text-xs text-slate-500 font-mono">绿线为实测单耗 · 虚线为考核红线</span>
                </div>
                <div className="h-[260px]">
                  <LineTrend
                    data={outputTrendData}
                    xKey="month"
                    height={260}
                    lines={[
                      { key: '实测单耗', name: '实测单位产值能耗 (tce/万元)', color: '#10b981' },
                      { key: '总裁5分之1考核线', name: '总裁 -5% 考核目标红线', color: '#f59e0b' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 视图 2：单位产品能耗 (按变压器 / 线缆细化至具体型号与订单追溯) */}
        {/* ========================================================================= */}
        {viewMode === 'product' && (
          <div className="space-y-3.5">
            {/* 产业选择与订单检索 */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">两大核心产品产业平铺:</span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-sans">
                  <button
                    type="button"
                    onClick={() => setCategory('transformer')}
                    className={cn(
                      'px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                      category === 'transformer'
                        ? 'bg-[#1677ff] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <Zap className="size-3.5" />
                    <span>1. 变压器产业 (沈变/衡变/新变 · kWh/kVA)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('cable')}
                    className={cn(
                      'px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                      category === 'cable'
                        ? 'bg-[#1677ff] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <Cable className="size-3.5" />
                    <span>2. 线缆产业 (鲁缆/新缆/德缆 · kWh/km)</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <Search className="size-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchKw}
                  onChange={(e) => setSearchKw(e.target.value)}
                  placeholder="输入订单号 / 型号搜索追溯..."
                  className="w-full px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1677ff]"
                />
              </div>
            </div>

            {/* 平铺产线与型号单耗展示 (空间换效率，彻底砍掉多余点击) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900">
                  【{selectedNode.name}】核心生产线与主流型号单耗平铺展示 (空间换效率)
                </h3>
                <span className="text-xs text-slate-400 font-mono">按日更新</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                {category === 'transformer' ? (
                  <>
                    <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-bold text-slate-900">1. 特高压干燥产线 (ODFS-334MVA)</span>
                        <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">500kV级</span>
                      </div>
                      <div className="text-2xl font-extrabold text-[#1677ff]">
                        0.317 <span className="text-xs font-normal text-slate-500 font-sans">kWh/kVA</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-blue-200/60 font-sans flex justify-between">
                        <span>干燥工序占比: 54.3%</span>
                        <span className="text-emerald-600 font-bold">同比 -6.2% ↓</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-bold text-slate-900">2. 220kV 主变产线 (SFP-240MVA)</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">220kV级</span>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900">
                        0.316 <span className="text-xs font-normal text-slate-500 font-sans">kWh/kVA</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-sans flex justify-between">
                        <span>干燥工序占比: 53.8%</span>
                        <span className="text-emerald-600 font-bold">同比 -6.5% ↓</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-bold text-slate-900">3. 110kV 配变产线 (SZ11-50MVA)</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">110kV级</span>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900">
                        0.330 <span className="text-xs font-normal text-slate-500 font-sans">kWh/kVA</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-sans flex justify-between">
                        <span>干燥工序占比: 53.9%</span>
                        <span className="text-amber-600 font-bold">同比 -4.3% (未达线)</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-bold text-slate-900">1. 立塔高压交联线 (YJLW03)</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">110kV高压</span>
                      </div>
                      <div className="text-2xl font-extrabold text-amber-700">
                        1.208 <span className="text-xs font-normal text-slate-500 font-sans">kWh/km</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-amber-200/60 font-sans flex justify-between">
                        <span>三层共挤占比: 48.5%</span>
                        <span className="text-emerald-600 font-bold">同比 -6.1% ↓</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-bold text-slate-900">2. 架空线拉丝产线 (JKLYJ-10kV)</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">中压架空</span>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900">
                        0.599 <span className="text-xs font-normal text-slate-500 font-sans">kWh/km</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-sans flex justify-between">
                        <span>绞合交联占比: 51.2%</span>
                        <span className="text-emerald-600 font-bold">同比 -5.8% ↓</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="font-bold text-slate-900">3. 低压环保线缆线 (WDZ-YJY)</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">低压环保</span>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900">
                        0.706 <span className="text-xs font-normal text-slate-500 font-sans">kWh/km</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-sans flex justify-between">
                        <span>成缆共挤占比: 47.8%</span>
                        <span className="text-amber-600 font-bold">同比 -4.1% (未达线)</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 订单关联追溯与红黑榜 (标杆榜 / 预警榜) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    【订单能耗红黑榜】型号关联追溯与订单效益评价表
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    🟢 红榜: 达成-5%降幅标杆
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                    🔴 黑榜: 未达-5%目标预警
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-semibold font-sans">
                    <tr>
                      <th className="px-3 py-2.5">订单编号</th>
                      <th className="px-3 py-2.5">产品型号</th>
                      <th className="px-3 py-2.5">归属单位</th>
                      <th className="px-3 py-2.5 text-right font-mono">完成产量/容量</th>
                      <th className="px-3 py-2.5 text-right font-mono">干燥/交联能耗 (kWh)</th>
                      <th className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">
                        订单实测单耗
                      </th>
                      <th className="px-3 py-2.5 text-center">同比降幅与目标评价</th>
                      <th className="px-3 py-2.5 text-right">红黑榜</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2.5 font-bold text-[#1677ff] font-sans">{ord.orderNo}</td>
                        <td className="px-3 py-2.5 font-sans font-medium text-slate-900">{ord.model}</td>
                        <td className="px-3 py-2.5 font-sans text-slate-600">{ord.company}</td>
                        <td className="px-3 py-2.5 text-right font-bold text-slate-900">{ord.outputQuantity}</td>
                        <td className="px-3 py-2.5 text-right text-slate-600">{ord.dryEnergyKWh.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right font-bold text-blue-700 bg-blue-50/40">{ord.unitConsumption}</td>
                        <td className="px-3 py-2.5 text-center font-sans font-bold text-slate-800">
                          {ord.targetDiffYoy}
                        </td>
                        <td className="px-3 py-2.5 text-right font-sans">
                          {ord.isRank === 'red' ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                              🟢 标杆红榜
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">
                              🔴 预警黑榜
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 🌟 计算公式与分子分母 Modal 弹窗 */}
      {selectedFormulaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Info className="size-5 text-[#1677ff]" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  单位产值能耗计算公式与分子分母透视
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFormulaModal(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-mono">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                <span className="text-slate-500 font-sans block text-[11px]">标准计算公式:</span>
                <div className="font-bold text-slate-900 text-sm font-sans">
                  单位产值能耗 (tce/万元) = 当期综合能耗总量 (tce) ÷ 当期工业总产值 (万元)
                </div>
              </div>

              <div className="space-y-2 font-sans text-slate-700">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span>分子 (当期综合能耗总量):</span>
                  <strong className="font-mono text-blue-700">1,577.2 tce</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span>分母 (当期工业总产值):</span>
                  <strong className="font-mono text-slate-900">28,500.0 万元</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span>实测结果:</span>
                  <strong className="font-mono text-emerald-700">0.0553 tce/万元</strong>
                </div>
                <div className="flex justify-between pb-1">
                  <span>总裁要求考核降幅:</span>
                  <strong className="font-mono text-emerald-700 font-bold">-5.2% (达成要求)</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedFormulaModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-bold cursor-pointer"
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

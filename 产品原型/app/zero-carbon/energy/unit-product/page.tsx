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
  Factory,
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

  // 产业类型选择与时间筛选
  const [category, setCategory] = useState<'transformer' | 'cable'>('transformer')
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [searchKw, setSearchKw] = useState('')
  const [selectedFormulaModal, setSelectedFormulaModal] = useState<boolean>(false)

  // 产品单耗历史趋势走势模拟数据
  const productTrendData = [
    { month: '25-09', 变压器单耗: 0.335, 线缆单耗: 1.28, 行业标杆: 0.315 },
    { month: '25-11', 变压器单耗: 0.330, 线缆单耗: 1.25, 行业标杆: 0.315 },
    { month: '26-01', 变压器单耗: 0.326, 线缆单耗: 1.23, 行业标杆: 0.315 },
    { month: '26-03', 变压器单耗: 0.322, 线缆单耗: 1.22, 行业标杆: 0.315 },
    { month: '26-05', 变压器单耗: 0.319, 线缆单耗: 1.21, 行业标杆: 0.315 },
    { month: '26-07', 变压器单耗: 0.318, 线缆单耗: 1.20, 行业标杆: 0.315 },
    { month: '26-08', 变压器单耗: 0.317, 线缆单耗: 1.20, 行业标杆: 0.315 },
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
      {/* 🌟 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        
        {/* 1. 顶部 Header 与 统一标准时间筛选 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Factory className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">单位产品能耗</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 时间维度统一 (月度/季度/年度) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                月度 (08月)
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('quarter')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'quarter' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                季度 (Q3)
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('year')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'year' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                年度 (2026)
              </button>
            </div>

            <button
              type="button"
              onClick={() => alert(`正在导出【${selectedNode.name}】单位产品能耗分析报表 (Excel)...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出产品单耗报表</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 单位产品能耗主内容：两大产业选择与订单检索 */}
        {/* ========================================================================= */}
        <div className="space-y-3.5">
          {/* 产业选择与订单检索条 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">两大核心产品产业维度:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-sans">
                <button
                  type="button"
                  onClick={() => setCategory('transformer')}
                  className={cn(
                    'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                    category === 'transformer'
                      ? 'bg-[#1677ff] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <Zap className="size-3.5" />
                  <span>1. 变压器产业</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('cable')}
                  className={cn(
                    'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                    category === 'cable'
                      ? 'bg-[#1677ff] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <Cable className="size-3.5" />
                  <span>2. 线缆产业</span>
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

          {/* 平铺产线与主流型号单耗展示 (空间换效率) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-900">
                  【{selectedNode.name}】核心生产线与主流型号单位产品单耗 (实时感知)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">数据采集频率：按日汇总</span>
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
                      <span>综合能效达标率: 92.4%</span>
                      <span className="text-emerald-600 font-bold">同比 -4.8% ↓</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="font-bold text-slate-900">1. 500kV 悬垂立塔共挤产线 (YJLW03)</span>
                      <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">超高压</span>
                    </div>
                    <div className="text-2xl font-extrabold text-purple-700">
                      1.208 <span className="text-xs font-normal text-slate-500 font-sans">kWh/km</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-purple-200/60 font-sans flex justify-between">
                      <span>交联绝缘占比: 61.2%</span>
                      <span className="text-emerald-600 font-bold">同比 -6.1% ↓</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="font-bold text-slate-900">2. 110kV 连续硫化挤塑产线</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">高压级</span>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      0.942 <span className="text-xs font-normal text-slate-500 font-sans">kWh/km</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-sans flex justify-between">
                      <span>导体绞合占比: 28.5%</span>
                      <span className="text-emerald-600 font-bold">同比 -5.4% ↓</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center text-xs font-sans">
                      <span className="font-bold text-slate-900">3. 中低压环保阻燃电缆产线 (WDZ-YJY)</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">常规级</span>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      0.706 <span className="text-xs font-normal text-slate-500 font-sans">kWh/km</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-sans flex justify-between">
                      <span>护套挤出工序占比: 42.1%</span>
                      <span className="text-emerald-600 font-bold">同比 -4.9% ↓</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 产品单耗历史趋势走势分析图 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-900">
                  ▍【1. 单位产品综合单耗历史月度趋势与行业能效标杆对标走势】
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">单位: kWh/kVA (变压器) · kWh/km (线缆)</span>
            </div>

            <div className="h-[260px]">
              <LineTrend
                data={productTrendData}
                xKey="month"
                height={260}
                lines={[
                  { key: '变压器单耗', name: '变压器实测单耗 (kWh/kVA)', color: '#1677ff' },
                  { key: '线缆单耗', name: '线缆实测单耗 (kWh/km)', color: '#a855f7' },
                  { key: '行业标杆', name: '国标一级能效标杆线', color: '#10b981' },
                ]}
              />
            </div>
          </div>

          {/* 订单能耗红黑榜穿透台账 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/60 gap-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-600" />
                <h3 className="text-xs font-bold text-slate-800">
                  ▍【2. 生产订单级单耗红黑榜能效穿透台账 (直穿 ERP / MES 工单)】
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                已接入 MES 生产批次与总装试验台直采数据
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                    <th className="py-2.5 px-3">ERP 订单号</th>
                    <th className="py-2.5 px-3">产品型号规格</th>
                    <th className="py-2.5 px-3">所属基地</th>
                    <th className="py-2.5 px-3">完工产量</th>
                    <th className="py-2.5 px-3">关键干燥/交联耗电 (kWh)</th>
                    <th className="py-2.5 px-3">订单总耗电 (kWh)</th>
                    <th className="py-2.5 px-3">实测单位单耗</th>
                    <th className="py-2.5 px-3">考核达成判定</th>
                    <th className="py-2.5 px-3">榜单归属</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">{ord.orderNo}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{ord.model}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-600">{ord.company}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{ord.outputQuantity}</td>
                      <td className="py-2.5 px-3 text-purple-700">{ord.dryEnergyKWh.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-bold text-blue-700">{ord.totalEnergyKWh.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-extrabold text-[#1677ff]">{ord.unitConsumption}</td>
                      <td className="py-2.5 px-3 font-sans text-xs">
                        <span className={cn(
                          'font-bold',
                          ord.isRank === 'red' ? 'text-emerald-600' : 'text-amber-600'
                        )}>
                          {ord.targetDiffYoy}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        {ord.isRank === 'red' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Award className="size-3 text-emerald-600" />
                            节能红榜 (标杆)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="size-3 text-amber-600" />
                            超标黑榜 (预警)
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

      </div>
    </div>
  )
}

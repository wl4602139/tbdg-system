'use client'

import { useState } from 'react'
import {
  Activity,
  Zap,
  Droplets,
  Flame,
  Wind,
  Search,
  Filter,
  CheckSquare,
  Square,
  Clock,
  TrendingDown,
  TrendingUp,
  TableProperties,
  ChevronRight,
  ChevronDown,
  Building2,
  Factory,
  Cog,
  Gauge,
  Sun,
  BatteryCharging,
  Leaf,
  Cloud,
  Layers,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge, DataTable } from '@/components/shared/primitives'
import { LineTrend, Donut } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { seedFactor, vary, varyNum } from '@/lib/variant'
import { orgTree, isLeaf, filterOrg, type OrgNode } from '@/lib/org'
import { hourlyLoadData, peakValleyData } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function OnlineMonitoringPage() {
  const [selectedOrg, setSelectedOrg] = useState('沈变本部')
  const [selectedTreePath, setSelectedTreePath] = useState('特变电工东北输变电产业园 / 沈变本部')
  const [timeDim, setTimeDim] = useState<'day' | 'month' | 'year'>('month')
  const [selectedDate, setSelectedDate] = useState('2026-08')

  // 四大能源介质 Tab
  const [activeMedium, setActiveMedium] = useState<'elec' | 'water' | 'gas' | 'air'>('elec')

  // 多曲线勾选状态
  const [showTotalLoad, setShowTotalLoad] = useState(true)
  const [showPv, setShowPv] = useState(true)
  const [showStorage, setShowStorage] = useState(true)
  const [showGrid, setShowGrid] = useState(false)

  const factor = seedFactor(selectedOrg, selectedDate)

  // 模拟组织-产线-工序-设备拓扑树
  const topologyTree = [
    {
      name: '特变电工东北输变电产业园',
      children: [
        {
          name: '沈变本部',
          children: [
            { name: '超高压线圈车间', children: [{ name: '1号真空干燥罐 (500kW)' }, { name: '2号真空干燥罐 (500kW)' }, { name: '自动化绕线机组' }] },
            { name: '铁芯制造车间', children: [{ name: '数控全自动剪切线' }, { name: '铁芯自动叠装机台' }] },
            { name: '总装试验车间', children: [{ name: '无局放变压器试验大厅' }, { name: '绝缘油真空气相干燥处理系统' }] },
          ],
        },
      ],
    },
    {
      name: '特变电工南方输变电产业园',
      children: [
        {
          name: '衡变本部',
          children: [
            { name: '超高压制造车间', children: [{ name: '气相干燥罐 600kW' }] },
          ],
        },
      ],
    },
    {
      name: '特变电工华东输变电科技产业园',
      children: [
        {
          name: '鲁缆本部',
          children: [
            { name: '立塔交联车间', children: [{ name: '超高压立塔交联生产线' }, { name: '盘绞机组' }] },
          ],
        },
      ],
    },
  ]

  return (
    <div className="space-y-3">
      {/* 顶部快捷筛选与时间选择条（参考图2顶部控制栏） */}
      <div className="bg-white p-3 rounded-lg border border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-semibold">时间选择:</span>
            <div className="inline-flex rounded border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setTimeDim('day')}
                className={cn('px-2.5 py-0.5 rounded text-xs transition-colors', timeDim === 'day' ? 'bg-[#1677ff] text-white font-bold' : 'text-slate-600 hover:text-slate-900')}
              >
                日
              </button>
              <button
                onClick={() => setTimeDim('month')}
                className={cn('px-2.5 py-0.5 rounded text-xs transition-colors', timeDim === 'month' ? 'bg-[#1677ff] text-white font-bold' : 'text-slate-600 hover:text-slate-900')}
              >
                月
              </button>
              <button
                onClick={() => setTimeDim('year')}
                className={cn('px-2.5 py-0.5 rounded text-xs transition-colors', timeDim === 'year' ? 'bg-[#1677ff] text-white font-bold' : 'text-slate-600 hover:text-slate-900')}
              >
                年
              </button>
            </div>
          </div>

          <input
            type="month"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-white font-mono"
          />

          <button className="px-3.5 py-1 bg-[#1677ff] hover:bg-blue-600 text-white rounded text-xs font-semibold shadow-xs">
            查询
          </button>
          <button className="px-3.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 rounded text-xs font-semibold">
            重置
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          当前拓扑：<span className="font-semibold text-slate-800">{selectedTreePath}</span>
        </div>
      </div>

      {/* 顶部总用能概况横幅（参考图2顶部 4 大 KPI Banner） */}
      <div className="bg-white p-4 rounded-lg border border-[#e5e7eb] shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 border-r border-slate-100 last:border-0 pr-3">
            <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Leaf className="size-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">综合能耗</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-slate-800">{varyNum(1284.5, factor)}</span>
                <span className="text-xs text-slate-500">tce</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-mono">同比 -2.7% · 环比 -0.8%</span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-r border-slate-100 last:border-0 pr-3">
            <div className="size-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Cloud className="size-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">净碳排放量</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-slate-800">{varyNum(3420.8, factor)}</span>
                <span className="text-xs text-slate-500">tCO2</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">直接: 480.2 · 间接: 2940.6</span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-r border-slate-100 last:border-0 pr-3">
            <div className="size-10 rounded-full bg-blue-50 text-[#1677ff] flex items-center justify-center shrink-0">
              <Sun className="size-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">直供绿电消纳量</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-[#1677ff]">{varyNum(184.5, factor)}</span>
                <span className="text-xs text-slate-500">万kWh</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-mono">屋顶分布式光伏直发自用</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Activity className="size-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">综合绿电消纳占比</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-emerald-600">38.6</span>
                <span className="text-xs text-slate-500">%</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-mono">达到特变电工零碳标杆要求</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主体两栏布局：左侧园区-车间-设备拓扑树 + 右侧 4 大能源介质卡片与负荷曲线 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* 左侧拓扑树（参考图2左侧组织树结构） */}
        <div className="lg:col-span-3">
          <div className="bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="size-4 text-[#1677ff]" />
                用能拓扑架构
              </span>
              <span className="text-slate-400 text-[10px]">点击切换节点</span>
            </div>

            <div className="space-y-1 text-xs max-h-[580px] overflow-y-auto">
              {topologyTree.map((park) => (
                <div key={park.name} className="space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-50">
                    <ChevronDown className="size-3.5 text-slate-400" />
                    <Building2 className="size-3.5 text-[#1677ff]" />
                    <span className="truncate">{park.name}</span>
                  </div>

                  <div className="ml-4 pl-2 border-l border-slate-200 space-y-1">
                    {park.children.map((factory) => (
                      <div key={factory.name} className="space-y-1">
                        <div
                          onClick={() => {
                            setSelectedOrg(factory.name)
                            setSelectedTreePath(`${park.name} / ${factory.name}`)
                          }}
                          className={cn(
                            'flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer transition-colors',
                            selectedOrg === factory.name
                              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200'
                              : 'text-slate-600 hover:bg-slate-100'
                          )}
                        >
                          <ChevronDown className="size-3 text-slate-400" />
                          <Factory className="size-3.5" />
                          <span>{factory.name} (全厂汇总)</span>
                        </div>

                        <div className="ml-4 pl-2 border-l border-slate-200 space-y-1">
                          {factory.children.map((ws) => (
                            <div key={ws.name} className="space-y-1">
                              <div
                                onClick={() => setSelectedTreePath(`${park.name} / ${factory.name} / ${ws.name}`)}
                                className="text-slate-700 hover:text-[#1677ff] py-0.5 px-1.5 rounded hover:bg-slate-50 cursor-pointer flex items-center gap-1 text-[11px]"
                              >
                                <ChevronRight className="size-3 text-slate-400" />
                                <span>{ws.name}</span>
                              </div>
                              {ws.children && (
                                <div className="ml-3 pl-2 border-l border-slate-200 space-y-0.5">
                                  {ws.children.map((dev) => (
                                    <div
                                      key={dev.name}
                                      onClick={() => setSelectedTreePath(`${park.name} / ${factory.name} / ${ws.name} / ${dev.name}`)}
                                      className="text-slate-500 hover:text-[#1677ff] py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer flex items-center gap-1 text-[10px]"
                                    >
                                      <Cog className="size-3 text-slate-400" />
                                      <span className="truncate">{dev.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：4 大能源介质面板（参考图2核心 4 卡片结构：电、水、天然气、压缩空气） */}
        <div className="lg:col-span-9 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {/* 介质 1: 电 (Electricity) */}
            <div className="bg-white rounded-lg border border-[#e5e7eb] shadow-xs overflow-hidden">
              <div className="bg-blue-50/80 px-3 py-2 border-b border-blue-100 flex items-center justify-between">
                <span className="font-bold text-xs text-[#1677ff] flex items-center gap-1.5">
                  <Zap className="size-4" />
                  电 (Electricity)
                </span>
                <span className="text-[10px] bg-blue-100 text-[#1677ff] px-1.5 py-0.2 rounded font-mono font-semibold">
                  重点能耗
                </span>
              </div>
              <div className="p-3 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 block">☀️ 光伏发电量</span>
                    <span className="font-mono text-sm font-bold text-slate-800">16.43 万kWh</span>
                    <span className="text-[10px] text-slate-400 block">上网量: 16.43</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 block">⚡ 总用电量</span>
                    <span className="font-mono text-sm font-bold text-[#1677ff]">15.93 万kWh</span>
                    <span className="text-[10px] text-slate-400 block">市电: 15.93</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500">当期总电费</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">15.61 万元</span>
                </div>
              </div>
            </div>

            {/* 介质 2: 水 (Water) */}
            <div className="bg-white rounded-lg border border-[#e5e7eb] shadow-xs overflow-hidden">
              <div className="bg-cyan-50/80 px-3 py-2 border-b border-cyan-100 flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-700 flex items-center gap-1.5">
                  <Droplets className="size-4" />
                  工业水 (Water)
                </span>
                <span className="text-[10px] bg-cyan-100 text-cyan-700 px-1.5 py-0.2 rounded font-mono font-semibold">
                  循环利用 94%
                </span>
              </div>
              <div className="p-3 text-xs space-y-3">
                <div className="space-y-0.5 border-b border-slate-100 pb-2">
                  <span className="text-[11px] text-slate-500 block">总用水量</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-lg font-bold text-slate-800">8,940</span>
                    <span className="text-slate-400 text-xs">m³</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-mono">同比 -1.4% · 环比 -0.5%</span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-500">当期总水费</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">3.82 万元</span>
                </div>
              </div>
            </div>

            {/* 介质 3: 天然气 (Gas) */}
            <div className="bg-white rounded-lg border border-[#e5e7eb] shadow-xs overflow-hidden">
              <div className="bg-amber-50/80 px-3 py-2 border-b border-amber-100 flex items-center justify-between">
                <span className="font-bold text-xs text-amber-700 flex items-center gap-1.5">
                  <Flame className="size-4" />
                  天然气 (Natural Gas)
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded font-mono font-semibold">
                  燃气锅炉
                </span>
              </div>
              <div className="p-3 text-xs space-y-3">
                <div className="space-y-0.5 border-b border-slate-100 pb-2">
                  <span className="text-[11px] text-slate-500 block">总用天然气量</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-lg font-bold text-slate-800">28,400</span>
                    <span className="text-slate-400 text-xs">Nm³</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">同比 -0.8% · 环比 -0.2%</span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-500">当期总气费</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">8.52 万元</span>
                </div>
              </div>
            </div>

            {/* 介质 4: 压缩空气 / 蒸汽 (Air/Steam) */}
            <div className="bg-white rounded-lg border border-[#e5e7eb] shadow-xs overflow-hidden">
              <div className="bg-purple-50/80 px-3 py-2 border-b border-purple-100 flex items-center justify-between">
                <span className="font-bold text-xs text-purple-700 flex items-center gap-1.5">
                  <Wind className="size-4" />
                  压缩空气 / 蒸汽
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-mono font-semibold">
                  干燥工序
                </span>
              </div>
              <div className="p-3 text-xs space-y-3">
                <div className="space-y-0.5 border-b border-slate-100 pb-2">
                  <span className="text-[11px] text-slate-500 block">蒸汽/空气消耗量</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-lg font-bold text-slate-800">1,420</span>
                    <span className="text-slate-400 text-xs">t (蒸汽)</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-mono">同比 -3.2% 节能运行</span>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-500">当期总费用</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">31.24 万元</span>
                </div>
              </div>
            </div>
          </div>

          {/* 24 小时实时负荷与光储消纳曲线看板 */}
          <div className="bg-white p-4 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#1677ff]" />
                <span className="font-bold text-xs text-slate-800">24小时用电负荷与新能源多曲线联动 (MW)</span>
              </div>

              {/* 多曲线自由勾选 */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={showTotalLoad}
                    onChange={(e) => setShowTotalLoad(e.target.checked)}
                    className="accent-[#1677ff]"
                  />
                  <span className="text-blue-600 font-bold">总用电负荷 (蓝色)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={showPv}
                    onChange={(e) => setShowPv(e.target.checked)}
                    className="accent-emerald-600"
                  />
                  <span className="text-emerald-600 font-bold">光伏出力 (绿色)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={showStorage}
                    onChange={(e) => setShowStorage(e.target.checked)}
                    className="accent-amber-600"
                  />
                  <span className="text-amber-600 font-bold">储能充放 (橙色)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="accent-purple-600"
                  />
                  <span className="text-purple-600 font-bold">市电购电 (紫色)</span>
                </label>
              </div>
            </div>

            <div className="h-56">
              <LineTrend
                data={hourlyLoadData}
                xKey="time"
                lines={[
                  ...(showTotalLoad ? [{ key: '总用电负荷', color: '#1677ff' }] : []),
                  ...(showPv ? [{ key: '光伏发电', color: '#52c41a' }] : []),
                  ...(showStorage ? [{ key: '储能充放', color: '#fa8c16' }] : []),
                  ...(showGrid ? [{ key: '市电购电', color: '#722ed1' }] : []),
                ]}
              />
            </div>
          </div>

          {/* 尖峰平谷电量与实时电气参数表 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-5 bg-white p-4 rounded-lg border border-[#e5e7eb] shadow-xs">
              <PanelTitle icon={Gauge}>尖峰平谷分时电量分布结构</PanelTitle>
              <div className="h-44">
                <Donut data={peakValleyData} />
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-4 rounded-lg border border-[#e5e7eb] shadow-xs">
              <PanelTitle icon={Activity}>重点回路实时电气遥测参数表</PanelTitle>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8fafc] text-slate-600 border-b border-[#e5e7eb] font-semibold">
                    <tr>
                      <th className="py-2 px-3">回路名称</th>
                      <th className="py-2 px-3">电压 (kV)</th>
                      <th className="py-2 px-3">电流 (A)</th>
                      <th className="py-2 px-3">有功功率 (kW)</th>
                      <th className="py-2 px-3">功率因数</th>
                      <th className="py-2 px-3">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-blue-50/30">
                      <td className="py-2 px-3 font-sans font-medium text-slate-800">10kV 进线一号总回路</td>
                      <td className="py-2 px-3">10.02</td>
                      <td className="py-2 px-3">480.5</td>
                      <td className="py-2 px-3 text-[#1677ff] font-bold">8,320</td>
                      <td className="py-2 px-3 text-emerald-600 font-bold">0.98</td>
                      <td className="py-2 px-3 font-sans"><StatusBadge tone="ok">正常运行</StatusBadge></td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="py-2 px-3 font-sans font-medium text-slate-800">1号真空干燥罐主动力</td>
                      <td className="py-2 px-3">0.38</td>
                      <td className="py-2 px-3">720.0</td>
                      <td className="py-2 px-3 text-[#1677ff] font-bold">475</td>
                      <td className="py-2 px-3 text-emerald-600 font-bold">0.96</td>
                      <td className="py-2 px-3 font-sans"><StatusBadge tone="ok">满负荷</StatusBadge></td>
                    </tr>
                    <tr className="hover:bg-blue-50/30">
                      <td className="py-2 px-3 font-sans font-medium text-slate-800">2号真空干燥罐主动力</td>
                      <td className="py-2 px-3">0.38</td>
                      <td className="py-2 px-3">715.2</td>
                      <td className="py-2 px-3 text-[#1677ff] font-bold">470</td>
                      <td className="py-2 px-3 text-amber-600 font-bold">0.92</td>
                      <td className="py-2 px-3 font-sans"><StatusBadge tone="warn">无功偏高</StatusBadge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useMemo } from 'react'
import {
  Coins,
  TrendingUp,
  Sun,
  BatteryCharging,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Download,
  Filter,
  Activity,
  Zap,
} from 'lucide-react'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

interface ProjectBenefitItem {
  id: string
  name: string
  base: string
  park: string
  type: '分布式光伏' | '用户侧储能' | '工业热泵'
  capacity: string
  investment: number // 万元
  actualGenKwh: string // 实际发电/节电/替代能耗
  savingsYuan: number // 当期节费 (万元)
  arbitrageYuan?: number // 峰谷套利/附加收益 (万元)
  carbonReduction: number // 核证碳减排量 (tCO2)
  tceSaving: number // 标煤节约量 (tce)
  irr: string // 实际内部收益率 IRR
  paybackYears: number // 动态投资回收期 (年)
  macc: number // 单位边际减排成本 (元/tCO2)
  npv: number // 净现值 (万元)
}

const ALL_PROJECT_BENEFITS: ProjectBenefitItem[] = [
  {
    id: 'p-01',
    name: '沈变本部 12.8MWp 屋顶分布式光伏一期',
    base: '沈变公司',
    park: '特变电工东北输变电产业园',
    type: '分布式光伏',
    capacity: '12.8 MWp',
    investment: 4850.0,
    actualGenKwh: '118.5 万kWh',
    savingsYuan: 78.6,
    arbitrageYuan: 12.4,
    carbonReduction: 634.0,
    tceSaving: 145.6,
    irr: '14.8%',
    paybackYears: 4.8,
    macc: -145.0,
    npv: 820.5,
  },
  {
    id: 'p-02',
    name: '衡变公司 6MW/12MWh 磷酸铁锂用户侧储能',
    base: '衡变公司',
    park: '特变电工南方输变电产业园',
    type: '用户侧储能',
    capacity: '6MW / 12MWh',
    investment: 1680.0,
    actualGenKwh: '充放 62.0 万kWh',
    savingsYuan: 31.2,
    arbitrageYuan: 18.6,
    carbonReduction: 186.0,
    tceSaving: 76.2,
    irr: '17.2%',
    paybackYears: 4.2,
    macc: -48.0,
    npv: 345.0,
  },
  {
    id: 'p-03',
    name: '德缆产业园 2.5MW 高温工业水源热泵系统',
    base: '德缆公司',
    park: '特变电工(德阳)电缆园区',
    type: '工业热泵',
    capacity: '2.5 MW (制热量)',
    investment: 620.0,
    actualGenKwh: '替代天然气 3.8 万m³',
    savingsYuan: 14.2,
    arbitrageYuan: 2.1,
    carbonReduction: 82.0,
    tceSaving: 46.5,
    irr: '24.1%',
    paybackYears: 3.4,
    macc: -112.0,
    npv: 168.0,
  },
  {
    id: 'p-04',
    name: '新疆变压器厂区 20MWp 分布式光伏三期',
    base: '新变厂',
    park: '特变电工新疆产业园',
    type: '分布式光伏',
    capacity: '20.0 MWp',
    investment: 7600.0,
    actualGenKwh: '210.0 万kWh',
    savingsYuan: 135.0,
    arbitrageYuan: 15.0,
    carbonReduction: 1482.0,
    tceSaving: 320.0,
    irr: '14.8%',
    paybackYears: 5.6,
    macc: -148.0,
    npv: 1350.0,
  },
  {
    id: 'p-05',
    name: '鲁缆公司 3MW/6MWh 智慧储能调峰电站',
    base: '鲁缆公司',
    park: '特变电工华东输变电科技产业园',
    type: '用户侧储能',
    capacity: '3MW / 6MWh',
    investment: 890.0,
    actualGenKwh: '充放 31.0 万kWh',
    savingsYuan: 16.5,
    arbitrageYuan: 9.8,
    carbonReduction: 98.0,
    tceSaving: 38.5,
    irr: '16.5%',
    paybackYears: 4.5,
    macc: -52.0,
    npv: 185.0,
  },
  {
    id: 'p-06',
    name: '新缆厂 4.5MWp 屋顶分布式光伏二期',
    base: '新缆厂',
    park: '特变电工新疆电缆产业园',
    type: '分布式光伏',
    capacity: '4.5 MWp',
    investment: 1710.0,
    actualGenKwh: '45.8 万kWh',
    savingsYuan: 28.5,
    arbitrageYuan: 4.2,
    carbonReduction: 245.0,
    tceSaving: 56.3,
    irr: '15.6%',
    paybackYears: 4.6,
    macc: -138.0,
    npv: 290.0,
  },
]

export default function BenefitEvaluationPage() {
  // 1. 自定义核算周期选择
  const [periodType, setPeriodType] = useState<'day' | 'month' | 'quarter' | 'year' | 'custom'>('month')
  const [customStartDate, setCustomStartDate] = useState('2026-01-01')
  const [customEndDate, setCustomEndDate] = useState('2026-08-28')

  // 2. 技术类型分类筛选
  const [selectedType, setSelectedType] = useState<string>('all')

  // 动态过滤项目列表
  const filteredProjects = useMemo(() => {
    return ALL_PROJECT_BENEFITS.filter((p) => {
      if (selectedType !== 'all' && p.type !== selectedType) return false
      return true
    })
  }, [selectedType])

  // 动态自动汇总宏观 KPI 指标 (基于选定周期与项目)
  const summaryStats = useMemo(() => {
    let multiplier = 1.0
    if (periodType === 'day') multiplier = 1 / 30
    else if (periodType === 'quarter') multiplier = 3.0
    else if (periodType === 'year') multiplier = 12.0
    else if (periodType === 'custom') multiplier = 8.0

    const totalSavingsWan = filteredProjects.reduce((acc, p) => acc + (p.savingsYuan + (p.arbitrageYuan || 0)) * multiplier, 0)
    const totalCarbonTons = filteredProjects.reduce((acc, p) => acc + p.carbonReduction * multiplier, 0)
    const totalTce = filteredProjects.reduce((acc, p) => acc + p.tceSaving * multiplier, 0)
    const avgIrr = filteredProjects.length > 0
      ? (filteredProjects.reduce((acc, p) => acc + parseFloat(p.irr), 0) / filteredProjects.length).toFixed(1)
      : '0.0'
    const avgPayback = filteredProjects.length > 0
      ? (filteredProjects.reduce((acc, p) => acc + p.paybackYears, 0) / filteredProjects.length).toFixed(1)
      : '0.0'

    return {
      totalSavingsWan: totalSavingsWan.toFixed(1),
      totalCarbonTons: totalCarbonTons.toFixed(1),
      totalTce: totalTce.toFixed(1),
      avgIrr: `${avgIrr}%`,
      avgPayback: `${avgPayback} 年`,
    }
  }, [filteredProjects, periodType])

  // 24小时时序监控出力与节费曲线数据
  const hourlyMonitoringData = [
    { time: '00:00', 光伏出力: 0, 储能放电: 1200, 储能充电: 0, 综合负荷: 8500, 实时节费: 420 },
    { time: '03:00', 光伏出力: 0, 储能放电: 0, 储能充电: 2400, 综合负荷: 6800, 实时节费: 760 },
    { time: '06:00', 光伏出力: 720, 储能放电: 0, 储能充电: 1800, 综合负荷: 9200, 实时节费: 890 },
    { time: '09:00', 光伏出力: 6800, 储能放电: 2800, 储能充电: 0, 综合负荷: 14200, 实时节费: 2650 },
    { time: '12:00', 光伏出力: 12450, 储能放电: 1500, 储能充电: 0, 综合负荷: 15800, 实时节费: 3480 },
    { time: '15:00', 光伏出力: 8900, 储能放电: 3200, 储能充电: 0, 综合负荷: 14600, 实时节费: 2980 },
    { time: '18:00', 光伏出力: 1800, 储能放电: 3600, 储能充电: 0, 综合负荷: 13900, 实时节费: 2850 },
    { time: '21:00', 光伏出力: 0, 储能放电: 1500, 储能充电: 0, 综合负荷: 10500, 实时节费: 1120 },
  ]

  return (
    <div className="space-y-3.5 font-sans">
      {/* 1. 顶部 Header (单行主标题 + 自定义周期控制器 + 数据导出) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
            <Coins className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">实时监控与项目效益评估</h1>
          </div>
        </div>

        {/* 右侧：自定义周期快捷选择与数据导出 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 周期切换按钮组 */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-mono">
            {[
              { key: 'day', label: '日核算' },
              { key: 'month', label: '月度核算' },
              { key: 'quarter', label: '季度核算' },
              { key: 'year', label: '年度结算' },
              { key: 'custom', label: '自定义周期' },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriodType(p.key as any)}
                className={cn(
                  'px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer',
                  periodType === p.key
                    ? 'bg-white text-[#1677ff] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* 自定义起止日期区间输入 (当选择自定义时展开) */}
          {periodType === 'custom' && (
            <div className="flex items-center gap-1.5 text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded-lg">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="h-6 px-1 border border-slate-200 rounded text-slate-700 bg-slate-50 focus:bg-white"
              />
              <span className="text-slate-400">至</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="h-6 px-1 border border-slate-200 rounded text-slate-700 bg-slate-50 focus:bg-white"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => alert('已导出项目经济效益与环保减排客观数据台账 (Excel/PDF)！')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="size-3.5 text-slate-500" />
            导出数据报告
          </button>
        </div>
      </div>

      {/* 2. 4 大核心宏观效益 KPI 仪表板 (自动根据周期与项目实时重算) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">经济效益：当期节费与收益</span>
            <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">
              ¥{summaryStats.totalSavingsWan} <span className="text-xs font-sans text-slate-500 font-normal">万元</span>
            </div>
            <span className="text-[10px] text-emerald-600 block mt-1 font-mono">
              含电费节约 + 峰谷套利收益
            </span>
          </div>
          <div className="size-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Coins className="size-4.5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">环保效益：核证碳减排量</span>
            <div className="text-xl font-bold font-mono text-purple-600 mt-0.5">
              {summaryStats.totalCarbonTons} <span className="text-xs font-sans text-slate-500 font-normal">tCO₂</span>
            </div>
            <span className="text-[10px] text-purple-600 block mt-1 font-mono">
              折合标煤节约 {summaryStats.totalTce} tce
            </span>
          </div>
          <div className="size-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <CheckCircle2 className="size-4.5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">加权实测内部收益率 (IRR)</span>
            <div className="text-xl font-bold font-mono text-[#1677ff] mt-0.5">
              {summaryStats.avgIrr}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1 font-mono">
              立项测算基准基线 14.0%
            </span>
          </div>
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff]">
            <TrendingUp className="size-4.5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">加权平均动态投资回收期</span>
            <div className="text-xl font-bold font-mono text-amber-600 mt-0.5">
              {summaryStats.avgPayback}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1 font-mono">
              全投资回收周期基准 5.0 年
            </span>
          </div>
          <div className="size-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Calendar className="size-4.5" />
          </div>
        </div>
      </div>

      {/* 3. 中部：24小时时序监控出力曲线 + 全集团减排成本 (MACC) 阶梯图 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* 左侧 2 栏：24小时实时出力与节费时序曲线 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-800">
                24 小时零碳能源实时出力与节费收益时序工况
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">光伏出力 / 储能充放 / 实时节费</span>
          </div>

          <div className="h-[280px]">
            <LineTrend
              data={hourlyMonitoringData}
              xKey="time"
              height={280}
              lines={[
                { key: '光伏出力', name: '光伏出力 (kW)', color: '#f59e0b' },
                { key: '储能放电', name: '储能放电 (kW)', color: '#10b981' },
                { key: '实时节费', name: '实时节费 (元/时)', color: '#1677ff' },
              ]}
            />
          </div>
        </div>

        {/* 右侧 1 栏：单位边际减排成本 MACC 阶梯分布 (纯客观数据) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-purple-500" />
                <h3 className="text-xs font-bold text-slate-800">各技术路线单位减排成本 (MACC)</h3>
              </div>
              <span className="text-[10px] font-mono text-purple-600 font-bold">元/tCO₂</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mb-3">
              注：负值代表项目自带自偿性财务回报（节费覆盖投资）
            </p>

            <div className="space-y-4 font-mono text-xs pt-2">
              <div>
                <div className="flex items-center justify-between text-slate-700 mb-1">
                  <span className="font-bold truncate max-w-[150px]">屋顶分布式光伏</span>
                  <span className="text-emerald-600 font-bold">-145 元/吨</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 mb-1">
                  <span className="font-bold truncate max-w-[150px]">工业水源热泵</span>
                  <span className="text-emerald-600 font-bold">-112 元/吨</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 mb-1">
                  <span className="font-bold truncate max-w-[150px]">用户侧储能调峰</span>
                  <span className="text-blue-600 font-bold">-48 元/吨</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-mono mt-2">
            依据标准：MACC = (总投资折现 + 运维折现 - 节电收益折现) / 累计核证碳减排量
          </div>
        </div>
      </div>

      {/* 4. 项目级经济与环保效益客观明细表格 (包含光伏、储能、热泵等全品类) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* 表格工具栏：零碳技术类型过滤 */}
        <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-[#fafbfc]">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#1677ff]" />
            <h3 className="text-xs font-bold text-slate-800">
              光伏、储能、热泵等零碳项目经济效益与环保指标明细表
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">共 {filteredProjects.length} 项</span>
          </div>

          {/* 技术类型标签过滤 */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-sans">
            {[
              { key: 'all', label: '全部项目' },
              { key: '分布式光伏', label: '光伏项目' },
              { key: '用户侧储能', label: '储能项目' },
              { key: '工业热泵', label: '热泵项目' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedType(tab.key)}
                className={cn(
                  'px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium',
                  selectedType === tab.key
                    ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3 whitespace-nowrap">项目名称</th>
                <th className="py-2.5 px-3 whitespace-nowrap">技术类型</th>
                <th className="py-2.5 px-3 whitespace-nowrap">所属单位 / 园区</th>
                <th className="py-2.5 px-3 whitespace-nowrap">装机规模</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">总投资 (万元)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">当期实际节电/产能</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">当期节费与收益 (万元)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">核证碳减排 (tCO₂)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">节约标煤 (tce)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">实测 IRR</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">回收期 (年)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">减排成本 MACC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredProjects.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">
                    <div>{item.base}</div>
                    <div className="text-[10px] text-slate-400">{item.park}</div>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    {item.capacity}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                    ¥{item.investment.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                    {item.actualGenKwh}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                    ¥{(item.savingsYuan + (item.arbitrageYuan || 0)).toFixed(1)} 万元
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-purple-600">
                    {item.carbonReduction.toLocaleString()} 吨
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700">
                    {item.tceSaving.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-[#1677ff]">
                    {item.irr}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-amber-600">
                    {item.paybackYears} 年
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                    {item.macc} 元/吨
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

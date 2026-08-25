'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import {
  Layers,
  Activity,
  Zap,
  Flame,
  Droplets,
  Building2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  PieChart,
  ArrowRight,
  Sparkles,
  Wind,
  Sun,
  Filter,
  CheckCircle2,
  Gauge,
  Factory,
  Sliders,
  RefreshCw,
  Info,
  CheckSquare,
  Square,
  BarChart3,
  Calendar,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge, DataTable, KpiCard } from '@/components/shared/primitives'
import { Donut, LineTrend, AreaTrend } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { energyStructure, energyTrend } from '@/lib/mock-data'
import { seedFactor, vary, varyNum } from '@/lib/variant'
import { cn } from '@/lib/utils'

export default function EnergyStructurePage() {
  // 1. 园区 vs 厂区层级切换
  const [viewLevel, setViewLevel] = useState<'park' | 'factory'>('park')
  const [selectedOrg, setSelectedOrg] = useState('特变电工东北输变电产业园')
  const [selectedFactory, setSelectedFactory] = useState('沈变本部')
  const [activePeriod, setActivePeriod] = useState('2026-08')

  // 2. 桑基图类型单独查看
  const [sankeyType, setSankeyType] = useState<'all' | 'elec' | 'steam' | 'gas' | 'water'>('all')

  // 3. 底部消耗趋势多类型自由勾选
  const [trendMetric, setTrendMetric] = useState<'tce' | 'physical' | 'cost' | 'carbon'>('tce')
  const [showElec, setShowElec] = useState(true)
  const [showSteam, setShowSteam] = useState(true)
  const [showGas, setShowGas] = useState(true)
  const [showWater, setShowWater] = useState(false)
  const [showGreen, setShowGreen] = useState(true)

  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  const currentSubject = viewLevel === 'park' ? selectedOrg : selectedFactory
  const factor = seedFactor(currentSubject, activePeriod)

  // 园区级 vs 厂区级 & 不同介质的专用桑基图拓扑数据生成器
  const getSankeyConfig = () => {
    // A. 全部能流 (综合折标煤 tce) - 园区级 (100% 对标参考图)
    if (sankeyType === 'all' && viewLevel === 'park') {
      return {
        title: '【零碳智慧园区】全园区全能耗流向与损耗拓扑图 (Sankey Flow)',
        sub: '国家《数字化能碳管理中心建设指南》标准对标能流拓扑视图',
        nodes: [
          { name: '市政工业热力/蒸汽', itemStyle: { color: '#64748b' } },
          { name: '市政电网接入', itemStyle: { color: '#f43f5e' } },
          { name: '分布式屋顶光伏', itemStyle: { color: '#334155' } },
          { name: '市政天然气管网', itemStyle: { color: '#84cc16' } },

          { name: '余热回收利用', itemStyle: { color: '#64748b' } },
          { name: '储能电池电站', itemStyle: { color: '#60a5fa' } },
          { name: '中央变电与配电中心', itemStyle: { color: '#10b981' } },
          { name: '燃气锅炉/冷热联供', itemStyle: { color: '#a3e635' } },

          { name: '1号高端制造车间', itemStyle: { color: '#a89078' } },
          { name: 'IDC数据中心', itemStyle: { color: '#84cc16' } },
          { name: '充电桩集群', itemStyle: { color: '#3b82f6' } },
          { name: '2号精细化工车间', itemStyle: { color: '#f97316' } },
          { name: '变压与线路热损', itemStyle: { color: '#6366f1' } },
          { name: '园区行政与生活区', itemStyle: { color: '#84cc16' } },
        ],
        links: [
          { source: '市政工业热力/蒸汽', target: '余热回收利用', value: 850 },
          { source: '市政电网接入', target: '中央变电与配电中心', value: 8700 },
          { source: '分布式屋顶光伏', target: '储能电池电站', value: 1820 },
          { source: '储能电池电站', target: '中央变电与配电中心', value: 1820 },
          { source: '市政天然气管网', target: '燃气锅炉/冷热联供', value: 1450 },

          { source: '余热回收利用', target: '1号高端制造车间', value: 850 },
          { source: '中央变电与配电中心', target: '1号高端制造车间', value: 3800 },
          { source: '中央变电与配电中心', target: 'IDC数据中心', value: 2200 },
          { source: '中央变电与配电中心', target: '充电桩集群', value: 950 },
          { source: '中央变电与配电中心', target: '2号精细化工车间', value: 2800 },
          { source: '中央变电与配电中心', target: '变压与线路热损', value: 220 },
          { source: '中央变电与配电中心', target: '园区行政与生活区', value: 550 },
          { source: '燃气锅炉/冷热联供', target: '2号精细化工车间', value: 800 },
          { source: '燃气锅炉/冷热联供', target: '园区行政与生活区', value: 650 },
        ],
      }
    }

    // B. 全部能流 (综合折标煤 tce) - 厂区工序级 (特变装备制造工厂)
    if (sankeyType === 'all' && viewLevel === 'factory') {
      return {
        title: `【${selectedFactory}】制造工序全能流平衡拓扑图 (Sankey Flow)`,
        sub: '工序级能源输入、动力枢纽分配与车间产线流向平衡',
        nodes: [
          { name: '10kV市政市电', itemStyle: { color: '#1677ff' } },
          { name: '厂房屋顶光伏', itemStyle: { color: '#52c41a' } },
          { name: '工业外购蒸汽', itemStyle: { color: '#722ed1' } },
          { name: '管道天然气', itemStyle: { color: '#fa8c16' } },

          { name: '总降压变电站', itemStyle: { color: '#1677ff' } },
          { name: '气相热动力站', itemStyle: { color: '#722ed1' } },
          { name: '动力压缩空气站', itemStyle: { color: '#fa8c16' } },

          { name: '高压线圈干燥罐', itemStyle: { color: '#1677ff' } },
          { name: '无局放试验大厅', itemStyle: { color: '#1677ff' } },
          { name: '数控铁芯叠装线', itemStyle: { color: '#52c41a' } },
          { name: '公辅冷却循环泵', itemStyle: { color: '#13c2c2' } },
          { name: '罐体恒温与采暖', itemStyle: { color: '#722ed1' } },
          { name: '变电综合线损', itemStyle: { color: '#f5222d' } },
        ],
        links: [
          { source: '10kV市政市电', target: '总降压变电站', value: 7800 },
          { source: '厂房屋顶光伏', target: '总降压变电站', value: 1600 },
          { source: '工业外购蒸汽', target: '气相热动力站', value: 1300 },
          { source: '管道天然气', target: '动力压缩空气站', value: 950 },

          { source: '总降压变电站', target: '高压线圈干燥罐', value: 3600 },
          { source: '总降压变电站', target: '无局放试验大厅', value: 2500 },
          { source: '总降压变电站', target: '数控铁芯叠装线', value: 1600 },
          { source: '总降压变电站', target: '公辅冷却循环泵', value: 1400 },
          { source: '总降压变电站', target: '变电综合线损', value: 300 },
          { source: '气相热动力站', target: '高压线圈干燥罐', value: 850 },
          { source: '气相热动力站', target: '罐体恒温与采暖', value: 450 },
          { source: '动力压缩空气站', target: '数控铁芯叠装线', value: 550 },
          { source: '动力压缩空气站', target: '公辅冷却循环泵', value: 400 },
        ],
      }
    }

    // C. ⚡ 单独查看：电力能流专向图 (MWh)
    if (sankeyType === 'elec') {
      return {
        title: '【电力能流专向图】市电与新能源发电 ➔ 变配电 ➔ 各用电负载',
        sub: '单位：MWh (兆瓦时) · 变配电综合效率：98.6%',
        nodes: [
          { name: '10kV 市电购电 (8,700 MWh)', itemStyle: { color: '#1677ff' } },
          { name: '光伏自发自用 (1,820 MWh)', itemStyle: { color: '#52c41a' } },
          { name: '储能夜间放电 (650 MWh)', itemStyle: { color: '#fa8c16' } },

          { name: '10kV 高压配电总柜', itemStyle: { color: '#1677ff' } },
          { name: '车间动力变压器组', itemStyle: { color: '#0958d9' } },

          { name: '真空干燥主动力 (4,200 MWh)', itemStyle: { color: '#1677ff' } },
          { name: '变压器超高压试验 (2,850 MWh)', itemStyle: { color: '#1677ff' } },
          { name: '自动化剪切卷线 (1,820 MWh)', itemStyle: { color: '#52c41a' } },
          { name: '空压机与水泵站 (1,650 MWh)', itemStyle: { color: '#13c2c2' } },
          { name: '厂区智能照明 (480 MWh)', itemStyle: { color: '#fadb14' } },
          { name: '变损与线路损耗 (170 MWh)', itemStyle: { color: '#f5222d' } },
        ],
        links: [
          { source: '10kV 市电购电 (8,700 MWh)', target: '10kV 高压配电总柜', value: 8700 },
          { source: '光伏自发自用 (1,820 MWh)', target: '10kV 高压配电总柜', value: 1820 },
          { source: '储能夜间放电 (650 MWh)', target: '10kV 高压配电总柜', value: 650 },

          { source: '10kV 高压配电总柜', target: '车间动力变压器组', value: 11000 },
          { source: '10kV 高压配电总柜', target: '变损与线路损耗 (170 MWh)', value: 170 },

          { source: '车间动力变压器组', target: '真空干燥主动力 (4,200 MWh)', value: 4200 },
          { source: '车间动力变压器组', target: '变压器超高压试验 (2,850 MWh)', value: 2850 },
          { source: '车间动力变压器组', target: '自动化剪切卷线 (1,820 MWh)', value: 1820 },
          { source: '车间动力变压器组', target: '空压机与水泵站 (1,650 MWh)', value: 1650 },
          { source: '车间动力变压器组', target: '厂区智能照明 (480 MWh)', value: 480 },
        ],
      }
    }

    // D. 💨 单独查看：蒸汽/热力能流专向图 (t)
    if (sankeyType === 'steam') {
      return {
        title: '【工业蒸汽与热力能流图】集中蒸汽与余热 ➔ 换热总站 ➔ 干燥保温',
        sub: '单位：t (吨) · 蒸汽综合热利用率：91.2%',
        nodes: [
          { name: '市政外购蒸汽 (1,420 t)', itemStyle: { color: '#722ed1' } },
          { name: '余热循环回收 (380 t等效)', itemStyle: { color: '#13c2c2' } },

          { name: '换热减温减压站', itemStyle: { color: '#722ed1' } },
          { name: '高温冷凝水回收', itemStyle: { color: '#52c41a' } },

          { name: '真空干燥气相加热 (880 t)', itemStyle: { color: '#722ed1' } },
          { name: '绝缘油真空气相处理 (360 t)', itemStyle: { color: '#9254de' } },
          { name: '冬季车间恒温采暖 (420 t)', itemStyle: { color: '#b37feb' } },
          { name: '管网热阻散失 (140 t)', itemStyle: { color: '#f5222d' } },
        ],
        links: [
          { source: '市政外购蒸汽 (1,420 t)', target: '换热减温减压站', value: 1420 },
          { source: '余热循环回收 (380 t等效)', target: '换热减温减压站', value: 380 },

          { source: '换热减温减压站', target: '真空干燥气相加热 (880 t)', value: 880 },
          { source: '换热减温减压站', target: '绝缘油真空气相处理 (360 t)', value: 360 },
          { source: '换热减温减压站', target: '冬季车间恒温采暖 (420 t)', value: 420 },
          { source: '换热减温减压站', target: '管网热阻散失 (140 t)', value: 140 },

          { source: '真空干燥气相加热 (880 t)', target: '高温冷凝水回收', value: 320 },
        ],
      }
    }

    // E. 🔥 单独查看：天然气能流专向图 (Nm³)
    if (sankeyType === 'gas') {
      return {
        title: '【天然气能源流向图】市政管道天然气 ➔ 调压燃气站 ➔ 锅炉烘干',
        sub: '单位：Nm³ · 燃气综合燃烧热效率：92.5%',
        nodes: [
          { name: '市政中压天然气 (28,400 Nm³)', itemStyle: { color: '#fa8c16' } },
          { name: '燃气调压计量柜', itemStyle: { color: '#fa8c16' } },

          { name: '低氮燃气锅炉动力 (16,200 Nm³)', itemStyle: { color: '#fa8c16' } },
          { name: '漆包线立式烘焙炉 (8,600 Nm³)', itemStyle: { color: '#ffa940' } },
          { name: '食堂与生活热水 (3,600 Nm³)', itemStyle: { color: '#ffd591' } },
        ],
        links: [
          { source: '市政中压天然气 (28,400 Nm³)', target: '燃气调压计量柜', value: 28400 },
          { source: '燃气调压计量柜', target: '低氮燃气锅炉动力 (16,200 Nm³)', value: 16200 },
          { source: '燃气调压计量柜', target: '漆包线立式烘焙炉 (8,600 Nm³)', value: 8600 },
          { source: '燃气调压计量柜', target: '食堂与生活热水 (3,600 Nm³)', value: 3600 },
        ],
      }
    }

    // F. 💧 单独查看：工业用水与中水回用能流图 (m³)
    return {
      title: '【工业水资源循环流向图】市政新水与中水 ➔ 水处理泵房 ➔ 冷却与循环',
      sub: '单位：m³ · 全厂水资源循环利用率：94.2%',
      nodes: [
        { name: '市政自来水接入 (8,940 m³)', itemStyle: { color: '#13c2c2' } },
        { name: '中水与冷凝回收 (4,200 m³)', itemStyle: { color: '#52c41a' } },

        { name: '综合循环水泵房', itemStyle: { color: '#13c2c2' } },
        { name: '纯水与软化处理站', itemStyle: { color: '#36cfc9' } },

        { name: '试验大厅闭式冷却塔 (6,500 m³)', itemStyle: { color: '#13c2c2' } },
        { name: '真空干燥冷凝冷却水 (3,800 m³)', itemStyle: { color: '#13c2c2' } },
        { name: '绿化保洁与公辅用水 (1,840 m³)', itemStyle: { color: '#52c41a' } },
        { name: '蒸发自然损耗 (1,000 m³)', itemStyle: { color: '#f5222d' } },
      ],
      links: [
        { source: '市政自来水接入 (8,940 m³)', target: '综合循环水泵房', value: 8940 },
        { source: '中水与冷凝回收 (4,200 m³)', target: '综合循环水泵房', value: 4200 },

        { source: '综合循环水泵房', target: '纯水与软化处理站', value: 5200 },
        { source: '综合循环水泵房', target: '试验大厅闭式冷却塔 (6,500 m³)', value: 6500 },
        { source: '综合循环水泵房', target: '绿化保洁与公辅用水 (1,840 m³)', value: 1840 },

        { source: '纯水与软化处理站', target: '真空干燥冷凝冷却水 (3,800 m³)', value: 3800 },
        { source: '纯水与软化处理站', target: '蒸发自然损耗 (1,000 m³)', value: 1000 },
      ],
    }
  }

  const sankeyConfig = getSankeyConfig()

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    const chart = chartInstance.current

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderWidth: 1,
        textStyle: {
          color: '#ffffff',
          fontSize: 12,
          fontFamily: 'monospace',
        },
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            return `<div style="font-weight: bold; font-family: sans-serif; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 4px;">${params.name}</div>
                    <div>节点通量: <span style="color: #38bdf8; font-weight: bold;">${params.value || '汇总节点'}</span></div>`
          } else {
            return `<div style="font-weight: bold; font-family: sans-serif; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 4px;">${params.data.source} ➔ ${params.data.target}</div>
                    <div>能流传输量: <span style="color: #4ade80; font-weight: bold;">${params.data.value}</span></div>`
          }
        },
      },
      series: [
        {
          type: 'sankey',
          layout: 'none',
          emphasis: {
            focus: 'adjacency',
          },
          nodeAlign: 'justify',
          orient: 'horizontal',
          draggable: true,
          nodeWidth: 18,
          nodeGap: 24,
          data: sankeyConfig.nodes,
          links: sankeyConfig.links,
          lineStyle: {
            color: 'gradient',
            curveness: 0.5,
            opacity: 0.38,
          },
          label: {
            color: '#1e293b',
            fontSize: 11,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
          },
          itemStyle: {
            borderWidth: 0,
            borderRadius: 2,
          },
        },
      ],
    }

    chart.setOption(option, true)

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [viewLevel, selectedOrg, selectedFactory, sankeyType])

  // 12 个月多类型时序消耗趋势模拟数据
  const multiEnergyTrendData = [
    { month: '1月', 电力: 182.5, 蒸汽: 48.2, 天然气: 26.5, 工业水: 88.0, 绿电: 68.5 },
    { month: '2月', 电力: 175.0, 蒸汽: 46.0, 天然气: 25.8, 工业水: 84.5, 绿电: 65.0 },
    { month: '3月', 电力: 195.4, 蒸汽: 51.2, 天然气: 28.0, 工业水: 92.0, 绿电: 76.2 },
    { month: '4月', 电力: 205.8, 蒸汽: 54.0, 天然气: 29.5, 工业水: 95.5, 绿电: 84.0 },
    { month: '5月', 电力: 228.0, 蒸汽: 58.6, 天然气: 31.2, 工业水: 102.0, 绿电: 96.5 },
    { month: '6月', 电力: 245.2, 蒸汽: 62.0, 天然气: 33.0, 工业水: 108.4, 绿电: 108.0 },
    { month: '7月', 电力: 268.5, 蒸汽: 66.8, 天然气: 35.5, 工业水: 116.0, 绿电: 122.5 },
    { month: '8月', 电力: 274.0, 蒸汽: 68.2, 天然气: 36.2, 工业水: 118.5, 绿电: 128.4 },
  ]

  return (
    <div className="space-y-3">
      {/* 顶部工具栏：园区/厂区层级切换 + 实体选择 + 时间范围 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-blue-50 text-[#1677ff] flex items-center justify-center font-bold">
            <Layers className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              用能结构分析与多维能流拓扑图 (Sankey Flow)
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-mono font-bold">
                {viewLevel === 'park' ? '零碳园区级' : '工厂工序级'}
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">
              支持园区总览与工厂工序穿透切换，支持单独查看某种能源介质能流及多类型消耗时序趋势
            </p>
          </div>
        </div>

        {/* 顶部层级切换与选择器 */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* 1. 园区 vs 厂区切换胶囊 */}
          <div className="flex items-center p-0.5 rounded bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewLevel('park')}
              className={cn(
                'flex items-center gap-1 px-3 py-1 rounded font-bold transition-all',
                viewLevel === 'park' ? 'bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Building2 className="size-3.5" />
              零碳智慧园区
            </button>
            <button
              onClick={() => setViewLevel('factory')}
              className={cn(
                'flex items-center gap-1 px-3 py-1 rounded font-bold transition-all',
                viewLevel === 'factory' ? 'bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Factory className="size-3.5" />
              经营制造工厂
            </button>
          </div>

          {/* 2. 下拉主体选择器 */}
          {viewLevel === 'park' ? (
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#1677ff]"
            >
              <option value="特变电工东北输变电产业园">特变电工东北输变电产业园 (沈阳)</option>
              <option value="特变电工南方输变电产业园">特变电工南方输变电产业园 (衡阳)</option>
              <option value="特变电工输变电产业园">特变电工输变电产业园 (昌吉)</option>
              <option value="特变电工华东输变电科技产业园">特变电工华东输变电科技产业园 (泰安)</option>
              <option value="特变电工天变产业园">特变电工天变产业园 (天津)</option>
            </select>
          ) : (
            <select
              value={selectedFactory}
              onChange={(e) => setSelectedFactory(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#1677ff]"
            >
              <option value="沈变本部">沈变公司 · 沈变本部</option>
              <option value="衡变本部">衡变公司 · 衡变本部</option>
              <option value="新变超高压公司">新变厂 · 新变超高压公司</option>
              <option value="鲁缆本部">鲁缆公司 · 鲁缆本部</option>
              <option value="新缆厂">新缆厂 · 新疆电缆厂</option>
              <option value="德缆股份公司">德缆公司 · 德缆股份</option>
            </select>
          )}

          <TimeRange value={activePeriod} onChange={setActivePeriod} />
        </div>
      </div>

      {/* 顶部 4 大核心结构 KPI 卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-white border border-[#e5e7eb] shadow-xs">
          <span className="text-xs text-slate-500 block">⚡ 电力消费占比</span>
          <div className="my-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-800">{varyNum(71.7, factor)}</span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <span className="text-[11px] text-blue-600 font-mono">+1.2% (主导能耗介质)</span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-[#e5e7eb] shadow-xs">
          <span className="text-xs text-slate-500 block">💨 蒸汽/热力占比</span>
          <div className="my-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-800">{varyNum(18.2, factor)}</span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono">-0.8% 绝缘干燥平稳</span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-[#e5e7eb] shadow-xs">
          <span className="text-xs text-slate-500 block">🔥 天然气消费占比</span>
          <div className="my-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-800">{varyNum(10.1, factor)}</span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono">-0.3% 节能受控</span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-[#e5e7eb] shadow-xs">
          <span className="text-xs text-slate-500 block">🍃 综合折标能耗总量</span>
          <div className="my-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#1677ff]">{varyNum(1284.5, factor)}</span>
            <span className="text-xs text-slate-400">tce</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono">-2.7% 同比下降</span>
        </div>
      </div>

      {/* 🌟 核心功能一：能流桑基图（支持单独查看某种类型的数据） */}
      <div className="bg-white p-4.5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-xs text-slate-800">
              {sankeyConfig.title}
            </span>
          </div>

          {/* 5 种能源介质类型单独筛选 Tab */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSankeyType('all')}
              className={cn(
                'px-2.5 py-1 rounded font-bold transition-all',
                sankeyType === 'all' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              🌐 全部能流 (综合折标)
            </button>
            <button
              onClick={() => setSankeyType('elec')}
              className={cn(
                'px-2.5 py-1 rounded font-bold transition-all',
                sankeyType === 'elec' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              ⚡ 电力能流专向图
            </button>
            <button
              onClick={() => setSankeyType('steam')}
              className={cn(
                'px-2.5 py-1 rounded font-bold transition-all',
                sankeyType === 'steam' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              💨 蒸汽/热力专向图
            </button>
            <button
              onClick={() => setSankeyType('gas')}
              className={cn(
                'px-2.5 py-1 rounded font-bold transition-all',
                sankeyType === 'gas' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              🔥 天然气专向图
            </button>
            <button
              onClick={() => setSankeyType('water')}
              className={cn(
                'px-2.5 py-1 rounded font-bold transition-all',
                sankeyType === 'water' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              💧 工业水循环专向图
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          {sankeyConfig.sub}
        </p>

        {/* ECharts 桑基图挂载画布 */}
        <div className="relative w-full h-[460px] bg-white rounded-lg border border-slate-100">
          <div ref={chartRef} className="w-full h-full" />
        </div>

        {/* 底部流向图例 */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4 font-mono">
            <span>当前主体：<strong className="text-slate-800 font-sans">{currentSubject}</strong></span>
            <span>|</span>
            <span>流向介质：<strong className="text-[#1677ff] font-sans">{sankeyType === 'all' ? '全介质综合平衡' : sankeyType === 'elec' ? '电力时序流' : sankeyType === 'steam' ? '工业蒸汽热力' : sankeyType === 'gas' ? '管道天然气' : '工业循环水'}</strong></span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            💡 鼠标悬停任意流带可高亮上下游流向全链路，支持节点自由拖拽
          </span>
        </div>
      </div>

      {/* 🌟 核心功能二：消耗趋势多类型自由勾选与综合分析看板 */}
      <div className="bg-white p-4.5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-1 rounded-full bg-[#1677ff]" />
            <span className="font-bold text-xs text-slate-800">
              时序用能消耗趋势分析（支持多能源类型自由勾选对比）
            </span>
          </div>

          {/* 统计口径切换 */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">统计口径：</span>
            <div className="flex items-center p-0.5 rounded bg-slate-100 border border-slate-200">
              <button
                onClick={() => setTrendMetric('tce')}
                className={cn('px-2.5 py-0.5 rounded font-bold transition-all', trendMetric === 'tce' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900')}
              >
                折标煤 (万tce)
              </button>
              <button
                onClick={() => setTrendMetric('physical')}
                className={cn('px-2.5 py-0.5 rounded font-bold transition-all', trendMetric === 'physical' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900')}
              >
                实物消耗量
              </button>
              <button
                onClick={() => setTrendMetric('cost')}
                className={cn('px-2.5 py-0.5 rounded font-bold transition-all', trendMetric === 'cost' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900')}
              >
                能源成本 (万元)
              </button>
              <button
                onClick={() => setTrendMetric('carbon')}
                className={cn('px-2.5 py-0.5 rounded font-bold transition-all', trendMetric === 'carbon' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900')}
              >
                碳排放量 (tCO2)
              </button>
            </div>
          </div>
        </div>

        {/* 多能源类型自由勾选 Checkbox 栏 */}
        <div className="flex flex-wrap items-center gap-5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-700 font-bold">图表显示介质：</span>

          <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showElec}
              onChange={(e) => setShowElec(e.target.checked)}
              className="accent-[#1677ff] size-3.5"
            />
            <span className="text-blue-600 font-bold">⚡ 电力消费 (万kWh / tce)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showSteam}
              onChange={(e) => setShowSteam(e.target.checked)}
              className="accent-[#722ed1] size-3.5"
            />
            <span className="text-purple-600 font-bold">💨 蒸汽与热力 (t / tce)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showGas}
              onChange={(e) => setShowGas(e.target.checked)}
              className="accent-[#fa8c16] size-3.5"
            />
            <span className="text-amber-600 font-bold">🔥 管道天然气 (万Nm³ / tce)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showWater}
              onChange={(e) => setShowWater(e.target.checked)}
              className="accent-[#13c2c2] size-3.5"
            />
            <span className="text-cyan-600 font-bold">💧 工业用水 (万m³)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showGreen}
              onChange={(e) => setShowGreen(e.target.checked)}
              className="accent-[#52c41a] size-3.5"
            />
            <span className="text-emerald-600 font-bold">☀️ 绿电消纳量 (万kWh)</span>
          </label>
        </div>

        {/* 趋势图表区 */}
        <div className="h-60 mt-2">
          <LineTrend
            data={multiEnergyTrendData}
            xKey="month"
            lines={[
              ...(showElec ? [{ key: '电力', color: '#1677ff' }] : []),
              ...(showSteam ? [{ key: '蒸汽', color: '#722ed1' }] : []),
              ...(showGas ? [{ key: '天然气', color: '#fa8c16' }] : []),
              ...(showWater ? [{ key: '工业水', color: '#13c2c2' }] : []),
              ...(showGreen ? [{ key: '绿电', color: '#52c41a' }] : []),
            ]}
          />
        </div>
      </div>
    </div>
  )
}

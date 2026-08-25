'use client'

import { useState, useMemo } from 'react'
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
  AlertTriangle,
  Radio,
  Cpu,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge, DataTable } from '@/components/shared/primitives'
import { LineTrend, Donut } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { seedFactor, vary, varyNum } from '@/lib/variant'
import { cn } from '@/lib/utils'

export default function OnlineMonitoringPage() {
  const [selectedOrg, setSelectedOrg] = useState('沈变本部')
  const [selectedTreePath, setSelectedTreePath] = useState('特变电工东北输变电产业园 / 沈变本部')
  const [timeDim, setTimeDim] = useState<'day' | 'month' | 'year'>('month')
  const [selectedDate, setSelectedDate] = useState('2026-08')

  // 四大能源介质 Tab: elec(电力), water(工业水), gas(天然气), air(压缩空气)
  const [activeMedium, setActiveMedium] = useState<'elec' | 'water' | 'gas' | 'air'>('elec')

  // 多曲线勾选状态
  const [showCurve1, setShowCurve1] = useState(true)
  const [showCurve2, setShowCurve2] = useState(true)
  const [showCurve3, setShowCurve3] = useState(true)

  // 🌟 核心修正 1：顶部企业级 KPI 统计仅依赖于机构与月份，切换下方介质时保持稳定不变！
  const kpiFactor = seedFactor(selectedOrg, selectedDate)

  // 树状图与图表数据因变量：随节点选择与当前介质动态联动
  const mediumFactor = seedFactor(selectedOrg, selectedDate, timeDim, activeMedium, selectedTreePath)

  // 🌟 核心修正 2：根据当前选中的能源介质，左侧呈现专属的专业管网/设备拓扑树
  const currentMediumTree = useMemo(() => {
    if (activeMedium === 'water') {
      return [
        {
          name: '特变电工东北输变电产业园',
          children: [
            {
              name: '沈变本部',
              children: [
                {
                  name: '综合给水与循环水泵房',
                  children: [
                    { name: '1号主循环供水泵组 (75kW)' },
                    { name: '2号变频补水泵组 (45kW)' },
                    { name: '冷却水加药阻垢系统' },
                  ],
                },
                {
                  name: '纯水与软化脱盐车间',
                  children: [
                    { name: '双级反渗透RO纯水机组 (20m³/h)' },
                    { name: 'EDI电去离子超纯水装置' },
                  ],
                },
                {
                  name: '试验大厅闭式冷却塔群',
                  children: [
                    { name: '1号试验闭式冷却塔 (300m³/h)' },
                    { name: '真空干燥冷凝冷却回水系统' },
                  ],
                },
                {
                  name: '中水回用与绿化处理站',
                  children: [
                    { name: '雨水收集过滤回用装置' },
                    { name: '厂区绿化与喷淋管网' },
                  ],
                },
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
                { name: '南方基地综合水处理站', children: [{ name: '循环水冷泵机组' }] },
              ],
            },
          ],
        },
      ]
    }

    if (activeMedium === 'gas') {
      return [
        {
          name: '特变电工东北输变电产业园',
          children: [
            {
              name: '沈变本部',
              children: [
                {
                  name: '市政中压燃气调压站',
                  children: [
                    { name: '中压/低压总调压稳压计量柜' },
                    { name: '燃气泄漏智能联动切断阀' },
                  ],
                },
                {
                  name: '动力蒸汽锅炉房',
                  children: [
                    { name: '1号10t/h超低氮燃气蒸汽锅炉' },
                    { name: '2号6t/h燃气热水锅炉 (备用)' },
                    { name: '锅炉烟气余热冷凝回收装置' },
                  ],
                },
                {
                  name: '线圈烘房与绝缘干燥支路',
                  children: [
                    { name: '立式线圈烘焙加热燃气管网' },
                    { name: '浸漆固化烘炉燃烧动力站' },
                  ],
                },
                {
                  name: '厂区生活与采暖支路',
                  children: [
                    { name: '冬季车间恒温换热机组' },
                    { name: '员工餐厅与生活热水供应' },
                  ],
                },
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
                { name: '燃气调压站与供热中心', children: [{ name: '低氮燃气锅炉机组' }] },
              ],
            },
          ],
        },
      ]
    }

    if (activeMedium === 'air') {
      return [
        {
          name: '特变电工东北输变电产业园',
          children: [
            {
              name: '沈变本部',
              children: [
                {
                  name: '中央动力空压机总站',
                  children: [
                    { name: '1号高效离心式空压机 (250kW)' },
                    { name: '2号变频无油螺杆空压机 (180kW)' },
                    { name: '3号常备工频螺杆空压机 (110kW)' },
                  ],
                },
                {
                  name: '压缩空气净化房',
                  children: [
                    { name: '吸附式微热再生干燥塔 (-40℃露点)' },
                    { name: '高效除油精密过滤器组' },
                  ],
                },
                {
                  name: '超高压线圈车间用气管网',
                  children: [
                    { name: '气相干燥罐充气吹扫电磁阀' },
                    { name: '气浮搬运平台动力管路' },
                  ],
                },
                {
                  name: '铁芯与结构件车间用气',
                  children: [
                    { name: '数控剪切机气动夹具' },
                    { name: '机器人焊接与喷涂气源' },
                  ],
                },
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
                { name: '空压动力车间', children: [{ name: '离心空压机组 300kW' }] },
              ],
            },
          ],
        },
      ]
    }

    // 默认：电力系统拓扑树 (elec)
    return [
      {
        name: '特变电工东北输变电产业园',
        children: [
          {
            name: '沈变本部',
            children: [
              {
                name: '110kV 总降压变电站',
                children: [
                  { name: '1号 110kV/10kV 主变压器' },
                  { name: '2号 110kV/10kV 主变压器' },
                  { name: 'SVG 无功动态补偿装置' },
                ],
              },
              {
                name: '超高压线圈车间配电房',
                children: [
                  { name: '1号真空干燥罐 (500kW)' },
                  { name: '2号真空干燥罐 (500kW)' },
                  { name: '自动化绕线机组动力柜' },
                ],
              },
              {
                name: '铁芯制造车间配电房',
                children: [
                  { name: '数控全自动剪切生产线' },
                  { name: '铁芯自动叠装机台动力柜' },
                ],
              },
              {
                name: '总装试验大厅配电房',
                children: [
                  { name: '无局放试验变频机组 (800kVA)' },
                  { name: '绝缘油气相真空处理系统' },
                ],
              },
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
              {
                name: '超高压制造车间',
                children: [
                  { name: '气相干燥罐 600kW' },
                  { name: '超高压绕线机组' },
                ],
              },
              {
                name: '试验大厅变频配电室',
                children: [{ name: '试验大厅变频机组' }],
              },
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
              {
                name: '立塔交联车间',
                children: [
                  { name: '超高压立塔交联生产线' },
                  { name: '盘绞机组配电柜' },
                ],
              },
            ],
          },
        ],
      },
    ]
  }, [activeMedium])

  // 🌟 核心修正 3：根据当前介质类型，动态生成对应的 24h 物理监测曲线与标签
  const chartConfig = useMemo(() => {
    if (activeMedium === 'water') {
      const rawData = [
        { time: '00:00', 循环供水总流量: 120, 纯水制备瞬时量: 15, 冷凝中水回收量: 45 },
        { time: '02:00', 循环供水总流量: 110, 纯水制备瞬时量: 12, 冷凝中水回收量: 40 },
        { time: '04:00', 循环供水总流量: 115, 纯水制备瞬时量: 14, 冷凝中水回收量: 42 },
        { time: '06:00', 循环供水总流量: 145, 纯水制备瞬时量: 18, 冷凝中水回收量: 55 },
        { time: '08:00', 循环供水总流量: 280, 纯水制备瞬时量: 35, 冷凝中水回收量: 95 },
        { time: '10:00', 循环供水总流量: 320, 纯水制备瞬时量: 42, 冷凝中水回收量: 110 },
        { time: '12:00', 循环供水总流量: 290, 纯水制备瞬时量: 38, 冷凝中水回收量: 105 },
        { time: '14:00', 循环供水总流量: 340, 纯水制备瞬时量: 45, 冷凝中水回收量: 120 },
        { time: '16:00', 循环供水总流量: 310, 纯水制备瞬时量: 40, 冷凝中水回收量: 115 },
        { time: '18:00', 循环供水总流量: 260, 纯水制备瞬时量: 30, 冷凝中水回收量: 85 },
        { time: '20:00', 循环供水总流量: 190, 纯水制备瞬时量: 22, 冷凝中水回收量: 65 },
        { time: '22:00', 循环供水总流量: 140, 纯水制备瞬时量: 16, 冷凝中水回收量: 50 },
      ]
      return {
        title: '24小时全厂工业用水与循环水流量实时监测 (m³/h)',
        unit: 'm³/h',
        data: vary(rawData, mediumFactor),
        lines: [
          { key: '循环供水总流量', name: '循环供水总流量', color: '#13c2c2', active: showCurve1 },
          { key: '纯水制备瞬时量', name: '纯水制备瞬时量', color: '#1677ff', active: showCurve2 },
          { key: '冷凝中水回收量', name: '冷凝中水回收量', color: '#52c41a', active: showCurve3 },
        ],
      }
    }

    if (activeMedium === 'gas') {
      const rawData = [
        { time: '00:00', 天然气总流量: 480, 锅炉动力用气: 320, 工艺烘干用气: 160 },
        { time: '02:00', 天然气总流量: 450, 锅炉动力用气: 300, 工艺烘干用气: 150 },
        { time: '04:00', 天然气总流量: 460, 锅炉动力用气: 310, 工艺烘干用气: 150 },
        { time: '06:00', 天然气总流量: 620, 锅炉动力用气: 420, 工艺烘干用气: 200 },
        { time: '08:00', 天然气总流量: 1180, 锅炉动力用气: 780, 工艺烘干用气: 400 },
        { time: '10:00', 天然气总流量: 1420, 锅炉动力用气: 920, 工艺烘干用气: 500 },
        { time: '12:00', 天然气总流量: 1250, 锅炉动力用气: 800, 工艺烘干用气: 450 },
        { time: '14:00', 天然气总流量: 1480, 锅炉动力用气: 950, 工艺烘干用气: 530 },
        { time: '16:00', 天然气总流量: 1350, 锅炉动力用气: 880, 工艺烘干用气: 470 },
        { time: '18:00', 天然气总流量: 1100, 锅炉动力用气: 720, 工艺烘干用气: 380 },
        { time: '20:00', 天然气总流量: 820, 锅炉动力用气: 550, 工艺烘干用气: 270 },
        { time: '22:00', 天然气总流量: 560, 锅炉动力用气: 380, 工艺烘干用气: 180 },
      ]
      return {
        title: '24小时管道天然气消耗与锅炉瞬时出力监测 (Nm³/h)',
        unit: 'Nm³/h',
        data: vary(rawData, mediumFactor),
        lines: [
          { key: '天然气总流量', name: '天然气总供气量', color: '#fa8c16', active: showCurve1 },
          { key: '锅炉动力用气', name: '锅炉动力蒸汽用气', color: '#722ed1', active: showCurve2 },
          { key: '工艺烘干用气', name: '工艺烘房燃烧用气', color: '#fa541c', active: showCurve3 },
        ],
      }
    }

    if (activeMedium === 'air') {
      const rawData = [
        { time: '00:00', 空压机总产气量: 42.0, 车间末端用气量: 38.5, 管网压力: 0.72 },
        { time: '02:00', 空压机总产气量: 38.0, 车间末端用气量: 35.0, 管网压力: 0.73 },
        { time: '04:00', 空压机总产气量: 39.5, 车间末端用气量: 36.2, 管网压力: 0.72 },
        { time: '06:00', 空压机总产气量: 58.0, 车间末端用气量: 52.0, 管网压力: 0.71 },
        { time: '08:00', 空压机总产气量: 112.0, 车间末端用气量: 104.0, 管网压力: 0.69 },
        { time: '10:00', 空压机总产气量: 135.0, 车间末端用气量: 126.5, 管网压力: 0.68 },
        { time: '12:00', 空压机总产气量: 118.0, 车间末端用气量: 110.0, 管网压力: 0.70 },
        { time: '14:00', 空压机总产气量: 142.0, 车间末端用气量: 132.0, 管网压力: 0.68 },
        { time: '16:00', 空压机总产气量: 128.0, 车间末端用气量: 119.0, 管网压力: 0.69 },
        { time: '18:00', 空压机总产气量: 98.0, 车间末端用气量: 90.0, 管网压力: 0.70 },
        { time: '20:00', 空压机总产气量: 72.0, 车间末端用气量: 66.0, 管网压力: 0.71 },
        { time: '22:00', 空压机总产气量: 48.0, 车间末端用气量: 44.0, 管网压力: 0.72 },
      ]
      return {
        title: '24小时压缩空气产气量与车间末端用气监测 (Nm³/min)',
        unit: 'Nm³/min',
        data: vary(rawData, mediumFactor),
        lines: [
          { key: '空压机总产气量', name: '空压机总产气量', color: '#722ed1', active: showCurve1 },
          { key: '车间末端用气量', name: '车间末端用气量', color: '#13c2c2', active: showCurve2 },
          { key: '管网压力', name: '管网压力 (×100)', color: '#fa8c16', active: showCurve3 },
        ],
      }
    }

    // 默认电力系统
    const rawData = [
      { time: '00:00', 总用电负荷: 18.2, 光伏发电: 0, 储能充放: -2.0 },
      { time: '02:00', 总用电负荷: 16.5, 光伏发电: 0, 储能充放: -3.5 },
      { time: '04:00', 总用电负荷: 17.0, 光伏发电: 0, 储能充放: -3.0 },
      { time: '06:00', 总用电负荷: 22.4, 光伏发电: 1.2, 储能充放: 0 },
      { time: '08:00', 总用电负荷: 38.6, 光伏发电: 8.5, 储能充放: 4.2 },
      { time: '10:00', 总用电负荷: 46.2, 光伏发电: 16.4, 储能充放: 5.0 },
      { time: '12:00', 总用电负荷: 42.0, 光伏发电: 18.8, 储能充放: 0 },
      { time: '14:00', 总用电负荷: 48.5, 光伏发电: 15.2, 储能充放: 4.8 },
      { time: '16:00', 总用电负荷: 44.8, 光伏发电: 9.0, 储能充放: 3.5 },
      { time: '18:00', 总用电负荷: 36.2, 光伏发电: 2.0, 储能充放: 5.0 },
      { time: '20:00', 总用电负荷: 28.5, 光伏发电: 0, 储能充放: 4.5 },
      { time: '22:00', 总用电负荷: 21.0, 光伏发电: 0, 储能充放: 0 },
    ]
    return {
      title: '24小时用电负荷与新能源多曲线联动 (MW)',
      unit: 'MW',
      data: vary(rawData, mediumFactor),
      lines: [
        { key: '总用电负荷', name: '总用电负荷', color: '#1677ff', active: showCurve1 },
        { key: '光伏发电', name: '光伏出力', color: '#52c41a', active: showCurve2 },
        { key: '储能充放', name: '储能充放', color: '#fa8c16', active: showCurve3 },
      ],
    }
  }, [activeMedium, mediumFactor, showCurve1, showCurve2, showCurve3])

  return (
    <div className="space-y-3">
      {/* 🌟 1. 顶部控制栏与分时电价实时动态指示条 */}
      <div className="bg-white p-3 rounded-lg border border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-semibold">统计周期:</span>
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

          {/* 实时分时电价状态胶囊 */}
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded text-amber-800 font-sans">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>实时电价：<strong>高峰时段 (0.88元/kWh)</strong> · 距低谷时段 (0.32元) 还有 <strong>3小时40分</strong></span>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
          <span className="flex items-center gap-1"><ShieldCheck className="size-3.5 text-emerald-600" /> 申报需量安全：<strong>9,250 / 10,000 kVA (92.5%)</strong></span>
          <span>|</span>
          <span>当前拓扑：<strong className="text-slate-800 font-sans">{selectedTreePath}</strong></span>
        </div>
      </div>

      {/* 🌟 2. 顶部 4 大核心能碳 KPI 横幅 (稳定不随下方介质切换闪烁) */}
      <div className="bg-white p-4 rounded-lg border border-[#e5e7eb] shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 border-r border-slate-100 last:border-0 pr-3">
            <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Leaf className="size-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">综合能耗总量</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-slate-800">{varyNum(1284.5, kpiFactor)}</span>
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
              <span className="text-xs text-slate-500 block">净碳排放总量</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-slate-800">{varyNum(3420.8, kpiFactor)}</span>
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
                <span className="text-xl font-bold font-mono text-[#1677ff]">{varyNum(182.6, kpiFactor)}</span>
                <span className="text-xs text-slate-500">万kWh</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-mono">绿电占比: 38.6% (达标)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pr-3">
            <div className="size-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Gauge className="size-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">实时总有功负荷</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-mono text-slate-800">{varyNum(24.5, kpiFactor)}</span>
                <span className="text-xs text-slate-500">MW</span>
              </div>
              <span className="text-[11px] text-amber-600 font-mono">负荷率: 78.5% (平稳)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 3. 四大能源介质分项 Tab 切换 (点击无缝切换专业树与时序曲线) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveMedium('elec')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-t-lg font-bold transition-all border-b-2',
            activeMedium === 'elec'
              ? 'border-[#1677ff] text-[#1677ff] bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          )}
        >
          <Zap className="size-4 text-[#1677ff]" />
          <span>电力系统在线监测</span>
        </button>

        <button
          onClick={() => setActiveMedium('water')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-t-lg font-bold transition-all border-b-2',
            activeMedium === 'water'
              ? 'border-cyan-500 text-cyan-600 bg-cyan-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          )}
        >
          <Droplets className="size-4 text-cyan-500" />
          <span>工业水与循环水系统</span>
        </button>

        <button
          onClick={() => setActiveMedium('gas')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-t-lg font-bold transition-all border-b-2',
            activeMedium === 'gas'
              ? 'border-amber-500 text-amber-600 bg-amber-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          )}
        >
          <Flame className="size-4 text-amber-500" />
          <span>管道天然气与锅炉动力</span>
        </button>

        <button
          onClick={() => setActiveMedium('air')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-t-lg font-bold transition-all border-b-2',
            activeMedium === 'air'
              ? 'border-purple-500 text-purple-600 bg-purple-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          )}
        >
          <Wind className="size-4 text-purple-500" />
          <span>动力压缩空气系统</span>
        </button>
      </div>

      {/* 🌟 4. 主体两栏：左侧【当前介质专属拓扑树】 + 右侧【当前介质 24h 时序曲线】 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* 左侧拓扑树 */}
        <div className="lg:col-span-3 bg-white p-3.5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="size-4 text-[#1677ff]" />
                {activeMedium === 'water'
                  ? '工业水循环管网树'
                  : activeMedium === 'gas'
                  ? '燃气与热动力管网树'
                  : activeMedium === 'air'
                  ? '动力空压气动管网树'
                  : '电力系统测点拓扑树'}
              </span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-mono font-bold">
                {activeMedium === 'water' ? '水务4级' : activeMedium === 'gas' ? '燃气4级' : activeMedium === 'air' ? '气动4级' : '电力4级'}
              </span>
            </div>

            <div className="space-y-1 text-xs max-h-[500px] overflow-y-auto">
              {currentMediumTree.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  <div
                    onClick={() => {
                      setSelectedOrg(p.name)
                      setSelectedTreePath(p.name)
                    }}
                    className={cn(
                      'font-bold flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition-colors',
                      selectedOrg === p.name ? 'bg-blue-50 text-[#1677ff] border border-blue-200' : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <Building2 className="size-3.5 text-[#1677ff]" />
                      <span>{p.name}</span>
                    </div>
                    {selectedOrg === p.name && <span className="size-1.5 rounded-full bg-[#1677ff]" />}
                  </div>

                  <div className="ml-2 pl-2 border-l border-slate-200 space-y-1">
                    {p.children.map((fac, fIdx) => (
                      <div key={fIdx} className="space-y-1">
                        <div
                          onClick={() => {
                            setSelectedOrg(fac.name)
                            setSelectedTreePath(`${p.name} / ${fac.name}`)
                          }}
                          className={cn(
                            'p-1.5 rounded flex items-center justify-between cursor-pointer transition-colors',
                            selectedOrg === fac.name ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          <div className="flex items-center gap-1">
                            <Factory className="size-3.5 text-slate-400" />
                            <span>{fac.name}</span>
                          </div>
                          {selectedOrg === fac.name && <span className="size-1.5 rounded-full bg-[#1677ff]" />}
                        </div>

                        {fac.children && (
                          <div className="ml-3 pl-2 border-l border-slate-100 space-y-0.5 text-[11px] text-slate-600">
                            {fac.children.map((ws, wIdx) => (
                              <div key={wIdx} className="space-y-0.5">
                                <div
                                  onClick={() => {
                                    setSelectedOrg(ws.name)
                                    setSelectedTreePath(`${p.name} / ${fac.name} / ${ws.name}`)
                                  }}
                                  className={cn(
                                    'py-0.5 px-1 rounded cursor-pointer flex items-center justify-between transition-colors',
                                    selectedOrg === ws.name ? 'bg-blue-50 text-[#1677ff] font-bold' : 'hover:bg-slate-50 text-slate-700'
                                  )}
                                >
                                  <span>⚙️ {ws.name}</span>
                                  {selectedOrg === ws.name && <span className="size-1.5 rounded-full bg-[#1677ff]" />}
                                </div>

                                {ws.children && (
                                  <div className="ml-3 pl-2 border-l border-slate-100 space-y-0.5 text-[10px] text-slate-500 mt-0.5">
                                    {ws.children.map((eq, eIdx) => (
                                      <div
                                        key={eIdx}
                                        onClick={() => {
                                          setSelectedOrg(eq.name)
                                          setSelectedTreePath(`${p.name} / ${fac.name} / ${ws.name} / ${eq.name}`)
                                        }}
                                        className={cn(
                                          'py-0.5 px-1 rounded cursor-pointer flex items-center justify-between transition-colors',
                                          selectedOrg === eq.name
                                            ? 'bg-blue-50 text-[#1677ff] font-bold'
                                            : eq.name.includes('2号真空干燥')
                                            ? 'text-red-600 font-semibold hover:bg-red-50'
                                            : 'hover:text-slate-900 hover:bg-slate-50'
                                        )}
                                      >
                                        <span className="truncate">• {eq.name}</span>
                                        {selectedOrg === eq.name && <span className="size-1.5 rounded-full bg-[#1677ff]" />}
                                      </div>
                                    ))}
                                  </div>
                                )}
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

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
            点击任意节点实时穿透 {activeMedium === 'water' ? '水量' : activeMedium === 'gas' ? '气量' : activeMedium === 'air' ? '风量' : '负荷'}
          </div>
        </div>

        {/* 右侧：24 小时动态多曲线大图表 */}
        <div className="lg:col-span-9 bg-white p-5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Activity className="size-4 text-[#1677ff]" />
                {chartConfig.title}
              </span>

              <div className="flex items-center gap-5 text-xs font-medium">
                {chartConfig.lines[0] && (
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showCurve1}
                      onChange={(e) => setShowCurve1(e.target.checked)}
                      className="accent-[#1677ff] size-3.5"
                    />
                    <span style={{ color: chartConfig.lines[0].color }} className="font-bold">
                      ● {chartConfig.lines[0].name}
                    </span>
                  </label>
                )}

                {chartConfig.lines[1] && (
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showCurve2}
                      onChange={(e) => setShowCurve2(e.target.checked)}
                      className="accent-[#52c41a] size-3.5"
                    />
                    <span style={{ color: chartConfig.lines[1].color }} className="font-bold">
                      ● {chartConfig.lines[1].name}
                    </span>
                  </label>
                )}

                {chartConfig.lines[2] && (
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showCurve3}
                      onChange={(e) => setShowCurve3(e.target.checked)}
                      className="accent-[#fa8c16] size-3.5"
                    />
                    <span style={{ color: chartConfig.lines[2].color }} className="font-bold">
                      ● {chartConfig.lines[2].name}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div className="h-[460px] mt-3">
              <LineTrend
                data={chartConfig.data}
                xKey="time"
                height={460}
                lines={chartConfig.lines.filter((l) => l.active).map((l) => ({
                  key: l.key,
                  name: l.name,
                  color: l.color,
                }))}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              💡 监测数据由厂区 SCADA / DCS 系统每 15 分钟采集汇聚（当前主体：
              <strong className="text-slate-800 font-sans">{selectedOrg}</strong>）
            </span>
            <span>当前采样率：100% (正常在线)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

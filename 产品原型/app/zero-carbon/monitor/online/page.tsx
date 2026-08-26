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
  Layers,
  AlertTriangle,
  Radio,
  Cpu,
  ShieldCheck,
  Calendar,
  Sparkles,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Eye,
  SlidersHorizontal,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge, DataTable, KpiCard } from '@/components/shared/primitives'
import { LineTrend, Donut, BarGroup } from '@/components/shared/charts'
import { Select } from '@/components/shared/select'
import { TreeView, type TreeViewNode } from '@/components/shared/tree-view'
import { cn } from '@/lib/utils'

// —— 1. 重点用能设备列表数据 ——
const equipmentList = [
  { id: 'eq_1', name: '1# 超高压真空干燥气相烘干罐', model: 'VD-500kW-UHV', category: 'elec', org: '沈变本部', workshop: '绝缘干燥车间', power: '500 kW', ratedVolt: '10 kV', status: 'running', freq: '1s 实时流', ua: 10.15, ub: 10.12, uc: 10.14, ia: 320, ib: 318, ic: 322, p: 465.2, q: 68.4, pf: 0.96, temp: 115.4, energyToday: '3,850 kWh' },
  { id: 'eq_2', name: '2# 超高压无局放试验变压器机组', model: 'TF-1200kVA-PD', category: 'elec', org: '沈变本部', workshop: '超高压试验大厅', power: '1200 kVA', ratedVolt: '35 kV', status: 'running', freq: '1s 实时流', ua: 35.2, ub: 35.1, uc: 35.3, ia: 180, ib: 178, ic: 182, p: 790.0, q: 112.5, pf: 0.95, temp: 48.2, energyToday: '2,100 kWh' },
  { id: 'eq_3', name: '1# 节能双螺杆动力空压机', model: 'AC-160kW-VFD', category: 'air', org: '沈变本部', workshop: '动力综合站房', power: '160 kW', ratedVolt: '380 V', status: 'running', freq: '1s 实时流', ua: 0.38, ub: 0.38, uc: 0.38, ia: 280, ib: 275, ic: 285, p: 142.5, q: 22.0, pf: 0.95, temp: 82.5, energyToday: '1,450 kWh' },
  { id: 'eq_4', name: '循环冷却水主供水泵组 (75kW)', model: 'WP-75kW-300m³', category: 'water', org: '沈变本部', workshop: '循环水泵房', power: '75 kW', ratedVolt: '380 V', status: 'running', freq: '15s 遥测流', ua: 0.38, ub: 0.38, uc: 0.38, ia: 135, ib: 132, ic: 136, p: 68.4, q: 12.0, pf: 0.92, temp: 36.2, energyToday: '580 kWh' },
  { id: 'eq_5', name: '燃气相变常压供热锅炉 (1.4MW)', model: 'GB-1400kW-Gas', category: 'gas', org: '沈变本部', workshop: '动力综合站房', power: '1.4 MW', ratedVolt: '380 V', status: 'standby', freq: '1min 遥测流', ua: 0.38, ub: 0.38, uc: 0.38, ia: 15, ib: 15, ic: 15, p: 8.5, q: 1.2, pf: 0.91, temp: 65.0, energyToday: '42 m³' },
  { id: 'eq_6', name: '全自动铁芯数控剪切机组', model: 'SC-90kW-CNC', category: 'elec', org: '沈变本部', workshop: '铁芯制造车间', power: '90 kW', ratedVolt: '380 V', status: 'running', freq: '1s 实时流', ua: 0.38, ub: 0.38, uc: 0.38, ia: 160, ib: 158, ic: 162, p: 78.2, q: 14.5, pf: 0.94, temp: 42.1, energyToday: '620 kWh' },
]

// —— 2. 关键工艺工序列表数据 ——
const processList = [
  { id: 'pr_1', name: '1. 铁芯剪切与自动叠装工序', line: '特高压变压器产线', org: '沈变本部', workshop: '铁芯车间', speed: '145.2 kgce/h', elecKwh: '1,020 kWh', gridRatio: 65, greenRatio: 35, unitQuota: '0.12 tce/t', actualUnit: '0.11 tce/t', status: 'running', freq: '1min 聚合' },
  { id: 'pr_2', name: '2. 电磁线绝缘绕制工序', line: '特高压变压器产线', org: '沈变本部', workshop: '绕线车间', speed: '210.8 kgce/h', elecKwh: '1,480 kWh', gridRatio: 60, greenRatio: 40, unitQuota: '0.18 tce/t', actualUnit: '0.17 tce/t', status: 'running', freq: '1min 聚合' },
  { id: 'pr_3', name: '3. 真空干燥与气相烘烤工序', line: '特高压变压器产线', org: '沈变本部', workshop: '干燥车间', speed: '580.6 kgce/h', elecKwh: '3,850 kWh', gridRatio: 45, greenRatio: 55, unitQuota: '0.45 tce/台', actualUnit: '0.48 tce/台', status: 'running', freq: '1min 聚合' },
  { id: 'pr_4', name: '4. 器身装配与总装注油工序', line: '特高压变压器产线', org: '沈变本部', workshop: '总装车间', speed: '88.4 kgce/h', elecKwh: '620 kWh', gridRatio: 70, greenRatio: 30, unitQuota: '0.08 tce/台', actualUnit: '0.07 tce/台', status: 'running', freq: '1min 聚合' },
  { id: 'pr_5', name: '5. 出厂高压绝缘试验工序', line: '特高压变压器产线', org: '沈变本部', workshop: '试验大厅', speed: '112.5 kgce/h', elecKwh: '790 kWh', gridRatio: 62, greenRatio: 38, unitQuota: '0.09 tce/台', actualUnit: '0.09 tce/台', status: 'running', freq: '1min 聚合' },
]

export default function OnlineMonitoringPage() {
  // 3 大核心监测模式
  const [viewMode, setViewMode] = useState<'macro' | 'equipment' | 'process'>('macro')
  
  // 选中的经营单位/工厂
  const [selectedOrg, setSelectedOrg] = useState('沈变本部')

  // 能耗介质类型查询/切换
  const [energyType, setEnergyType] = useState<'all' | 'elec' | 'water' | 'gas' | 'air'>('all')

  // 左侧树名称模糊查询
  const [searchKeyword, setSearchKeyword] = useState('')

  // 选中的重点设备与工序
  const [selectedEquipment, setSelectedEquipment] = useState(equipmentList[0])
  const [selectedProcess, setSelectedProcess] = useState(processList[2]) // 默认真空干燥

  // 宏观能源消耗量展示介质
  const [macroEnergyMedium, setMacroEnergyMedium] = useState<'elec' | 'gas' | 'water' | 'air'>('elec')

  // 自动回显采集频率
  const activeFrequency = useMemo(() => {
    if (viewMode === 'macro') return '1s 实时流 (SCADA 高频)'
    if (viewMode === 'equipment') return selectedEquipment.freq
    if (viewMode === 'process') return selectedProcess.freq
    return '1s 实时流'
  }, [viewMode, selectedEquipment, selectedProcess])

  // 过滤后的设备列表
  const filteredEquipments = useMemo(() => {
    return equipmentList.filter((eq) => {
      const matchName = eq.name.toLowerCase().includes(searchKeyword.toLowerCase()) || eq.model.toLowerCase().includes(searchKeyword.toLowerCase())
      const matchType = energyType === 'all' || eq.category === energyType
      return matchName && matchType
    })
  }, [searchKeyword, energyType])

  // 过滤后的工序列表
  const filteredProcesses = useMemo(() => {
    return processList.filter((pr) => {
      return pr.name.toLowerCase().includes(searchKeyword.toLowerCase()) || pr.workshop.toLowerCase().includes(searchKeyword.toLowerCase())
    })
  }, [searchKeyword])

  // —— 构建左侧重点设备树 ——
  const equipmentTreeData: TreeViewNode[] = useMemo(() => {
    return [
      {
        key: 'org_sb',
        label: `${selectedOrg} · 重点用能设备`,
        icon: <Building2 className="size-3.5 shrink-0 text-[#1677ff]" />,
        children: [
          {
            key: 'ws_dry',
            label: '绝缘干燥车间 (高耗能工段)',
            icon: <Factory className="size-3.5 shrink-0 text-slate-400" />,
            children: filteredEquipments
              .filter((e) => e.workshop === '绝缘干燥车间')
              .map((e) => ({
                key: e.id,
                label: e.name,
                icon: <Cog className="size-3.5 shrink-0 text-slate-400" />,
                selected: selectedEquipment.id === e.id,
                badge: <span className="size-1.5 rounded-full bg-emerald-500" />,
                onSelect: () => setSelectedEquipment(e),
              })),
          },
          {
            key: 'ws_test',
            label: '超高压试验大厅',
            icon: <Factory className="size-3.5 shrink-0 text-slate-400" />,
            children: filteredEquipments
              .filter((e) => e.workshop === '超高压试验大厅')
              .map((e) => ({
                key: e.id,
                label: e.name,
                icon: <Cog className="size-3.5 shrink-0 text-slate-400" />,
                selected: selectedEquipment.id === e.id,
                badge: <span className="size-1.5 rounded-full bg-emerald-500" />,
                onSelect: () => setSelectedEquipment(e),
              })),
          },
          {
            key: 'ws_power',
            label: '动力综合站房与循环水',
            icon: <Factory className="size-3.5 shrink-0 text-slate-400" />,
            children: filteredEquipments
              .filter((e) => e.workshop === '动力综合站房' || e.workshop === '循环水泵房')
              .map((e) => ({
                key: e.id,
                label: e.name,
                icon: <Cog className="size-3.5 shrink-0 text-slate-400" />,
                selected: selectedEquipment.id === e.id,
                badge: <span className={cn('size-1.5 rounded-full', e.status === 'running' ? 'bg-emerald-500' : 'bg-amber-500')} />,
                onSelect: () => setSelectedEquipment(e),
              })),
          },
          {
            key: 'ws_iron',
            label: '铁芯制造车间',
            icon: <Factory className="size-3.5 shrink-0 text-slate-400" />,
            children: filteredEquipments
              .filter((e) => e.workshop === '铁芯制造车间')
              .map((e) => ({
                key: e.id,
                label: e.name,
                icon: <Cog className="size-3.5 shrink-0 text-slate-400" />,
                selected: selectedEquipment.id === e.id,
                badge: <span className="size-1.5 rounded-full bg-emerald-500" />,
                onSelect: () => setSelectedEquipment(e),
              })),
          },
        ],
      },
    ]
  }, [filteredEquipments, selectedEquipment, selectedOrg])

  // —— 构建左侧关键工序树 ——
  const processTreeData: TreeViewNode[] = useMemo(() => {
    return [
      {
        key: 'pr_root',
        label: `${selectedOrg} · 生产制造工艺链`,
        icon: <Layers className="size-3.5 shrink-0 text-[#1677ff]" />,
        children: filteredProcesses.map((p) => ({
          key: p.id,
          label: p.name,
          icon: <Activity className="size-3.5 shrink-0 text-slate-400" />,
          selected: selectedProcess.id === p.id,
          badge: <span className="text-[10px] text-emerald-600 font-mono font-semibold">{p.actualUnit}</span>,
          onSelect: () => setSelectedProcess(p),
        })),
      },
    ]
  }, [filteredProcesses, selectedProcess, selectedOrg])

  return (
    <div className="space-y-4">
      {/* 🌟 1. 顶部 Header 与 3 大模式 Tab 切换 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-primary">
            <Radio className="size-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground flex items-center gap-2">
              能源与工艺全景在线监测中心
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                SCADA 时序直连
              </span>
            </h1>
            <p className="text-xs text-muted-foreground">
              实时物联遥测：覆盖经营单位宏观平衡、重点用能设备参量波形与关键工序能效
            </p>
          </div>
        </div>

        {/* 3 大模式 Tab 切换胶囊 */}
        <div className="flex items-center gap-1.5 bg-accent/40 p-1 rounded-lg border border-border/60">
          {[
            { key: 'macro', label: '1. 经营单位宏观指标监测' },
            { key: 'equipment', label: '2. 重点用能设备在线监测' },
            { key: 'process', label: '3. 关键工序在线监测' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setViewMode(t.key as any)}
              className={cn(
                'px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all',
                viewMode === t.key
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 2. 宏观实时 5 大指标遥测舱 (全模式置顶常驻 + 自动回显采集频率) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-card via-card/90 to-card border border-border shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Activity className="size-4 text-primary" />
              【{selectedOrg}】宏观动力与能源实时遥测舱
            </span>
            <Select
              value={selectedOrg}
              onChange={setSelectedOrg}
              options={['沈变本部', '衡变本部', '新变超高压', '天津变压器厂', '鲁缆本部', '德缆股份公司'].map((x) => ({ label: x, value: x }))}
            />
          </div>

          {/* 自动回显采集频率 */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-accent/40 border border-border text-muted-foreground">
              <Clock className="size-3.5 text-primary" />
              <span>测点采集频率：</span>
              <strong className="text-emerald-500 font-bold">{activeFrequency}</strong>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <span>数据更新: 刚刚</span>
            </div>
          </div>
        </div>

        {/* 5 大宏观指标卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
          {/* 指标 1: 新能源发电功率 */}
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-sans">
              <span className="flex items-center gap-1"><Sun className="size-3.5 text-emerald-500" /> 新能源发电功率</span>
            </div>
            <div className="text-xl font-bold text-emerald-400">
              5,820.0 <span className="text-xs font-sans text-muted-foreground">kW</span>
            </div>
            <span className="text-[10px] text-emerald-500 font-sans block">☀️ 光伏出力充沛</span>
          </div>

          {/* 指标 2: 储能充放功率 */}
          <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-sky-400 font-sans">
              <span className="flex items-center gap-1"><BatteryCharging className="size-3.5 text-sky-400" /> 储能充放功率</span>
            </div>
            <div className="text-xl font-bold text-sky-400">
              +45.0 <span className="text-xs font-sans text-muted-foreground">kW</span>
            </div>
            <span className="text-[10px] text-sky-400 font-sans block">⚡ 微网自适应平抑 (SOC 78%)</span>
          </div>

          {/* 指标 3: 市电接入功率 */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-blue-400 font-sans">
              <span className="flex items-center gap-1"><Zap className="size-3.5 text-blue-400" /> 市电接入功率</span>
            </div>
            <div className="text-xl font-bold text-blue-400">
              12,431.6 <span className="text-xs font-sans text-muted-foreground">kW</span>
            </div>
            <span className="text-[10px] text-blue-400 font-sans block">110kV 主变进线受控</span>
          </div>

          {/* 指标 4: 全厂负荷功率 */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-400 font-sans">
              <span className="flex items-center gap-1"><Cpu className="size-3.5 text-amber-400" /> 全厂负荷功率</span>
            </div>
            <div className="text-xl font-bold text-amber-400">
              18,206.6 <span className="text-xs font-sans text-muted-foreground">kW</span>
            </div>
            <span className="text-[10px] text-amber-400 font-sans block">变压器负荷率 72.8%</span>
          </div>

          {/* 指标 5: 能源消耗总量 (支持多介质切换) */}
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs text-purple-400 font-sans">
              <span className="flex items-center gap-1"><Gauge className="size-3.5 text-purple-400" /> 本日能源消耗量</span>
              <div className="flex items-center gap-0.5 bg-purple-950/40 rounded p-0.5 border border-purple-500/30 text-[9px]">
                <button onClick={() => setMacroEnergyMedium('elec')} className={cn('px-1 rounded', macroEnergyMedium === 'elec' ? 'bg-purple-500 text-white font-bold' : 'text-purple-300')}>电</button>
                <button onClick={() => setMacroEnergyMedium('gas')} className={cn('px-1 rounded', macroEnergyMedium === 'gas' ? 'bg-purple-500 text-white font-bold' : 'text-purple-300')}>气</button>
                <button onClick={() => setMacroEnergyMedium('water')} className={cn('px-1 rounded', macroEnergyMedium === 'water' ? 'bg-purple-500 text-white font-bold' : 'text-purple-300')}>水</button>
                <button onClick={() => setMacroEnergyMedium('air')} className={cn('px-1 rounded', macroEnergyMedium === 'air' ? 'bg-purple-500 text-white font-bold' : 'text-purple-300')}>汽</button>
              </div>
            </div>
            <div className="text-xl font-bold text-purple-400">
              {macroEnergyMedium === 'elec' && '14,250 kWh'}
              {macroEnergyMedium === 'gas' && '185.2 m³'}
              {macroEnergyMedium === 'water' && '12.4 m³'}
              {macroEnergyMedium === 'air' && '3.7 GJ'}
            </div>
            <span className="text-[10px] text-purple-400 font-sans block">
              {macroEnergyMedium === 'elec' && '折标煤: 1.75 tce'}
              {macroEnergyMedium === 'gas' && '折标煤: 0.24 tce'}
              {macroEnergyMedium === 'water' && '回用率: 88.5%'}
              {macroEnergyMedium === 'air' && '管网压力: 0.72 MPa'}
            </span>
          </div>
        </div>
      </div>

      {/* 🌟 3. 视图一：经营单位宏观指标监测 */}
      {viewMode === 'macro' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel className="lg:col-span-2 p-4">
              <PanelTitle icon={Activity}>全厂 24 小时综合负荷与微网平衡时序曲线</PanelTitle>
              <div className="mt-3">
                <LineTrend
                  data={[
                    { time: '00:00', 全厂负荷: 8400, 市电输入: 8400, 光伏出力: 0, 储能功率: 300 },
                    { time: '04:00', 全厂负荷: 7800, 市电输入: 7800, 光伏出力: 0, 储能功率: 300 },
                    { time: '08:00', 全厂负荷: 14200, 市电输入: 12500, 光伏出力: 1700, 储能功率: 0 },
                    { time: '12:00', 全厂负荷: 18200, 市电输入: 12400, 光伏出力: 5820, 储能功率: -45 },
                    { time: '16:00', 全厂负荷: 17500, 市电输入: 13800, 光伏出力: 3700, 储能功率: 0 },
                    { time: '20:00', 全厂负荷: 11200, 市电输入: 11500, 光伏出力: 0, 储能功率: -300 },
                  ]}
                  keys={['全厂负荷', '市电输入', '光伏出力']}
                  xKey="time"
                  height={300}
                />
              </div>
            </Panel>

            <Panel className="p-4 space-y-3">
              <PanelTitle icon={Donut}>车间用能负荷分布</PanelTitle>
              <Donut
                data={[
                  { name: '绝缘干燥车间', value: 45, color: 'var(--chart-1)' },
                  { name: '超高压试验大厅', value: 25, color: 'var(--chart-2)' },
                  { name: '铁芯与绕线车间', value: 18, color: 'var(--chart-3)' },
                  { name: '综合办公与辅助', value: 12, color: 'var(--chart-4)' },
                ]}
                unit="%"
                height={230}
              />
            </Panel>
          </div>
        </div>
      )}

      {/* 🌟 4. 视图二：重点用能设备在线监测 (左侧树 + 模糊查询 + 能耗类型筛选 + 右侧 8 大遥测参量卡片) */}
      {viewMode === 'equipment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 左侧设备树 (col-span-4) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-card border border-border space-y-3">
            <PanelTitle icon={Sliders}>重点设备拓扑树</PanelTitle>

            {/* 模糊搜索框 */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="模糊搜索设备名称或型号..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-accent/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* 能耗类型筛选胶囊 */}
            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              {[
                { key: 'all', label: '全部' },
                { key: 'elec', label: '⚡ 电力' },
                { key: 'water', label: '💧 工业水' },
                { key: 'gas', label: '🔥 天然气' },
                { key: 'air', label: '💨 空压' },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setEnergyType(m.key as any)}
                  className={cn(
                    'px-2 py-0.5 rounded border transition-colors',
                    energyType === m.key
                      ? 'bg-primary text-primary-foreground border-primary font-bold'
                      : 'bg-accent/30 text-muted-foreground hover:text-foreground border-border'
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* 设备标准树 */}
            <div className="pt-1 overflow-y-auto max-h-[420px]">
              <TreeView data={equipmentTreeData} defaultExpandAll />
            </div>
          </div>

          {/* 右侧重点设备实时遥测工作台 (col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* 设备详情 Header */}
            <div className="p-4 rounded-xl bg-card border border-border flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{selectedEquipment.name}</span>
                  <StatusBadge tone="ok">运行中</StatusBadge>
                  <Badge tone="default">{selectedEquipment.category === 'elec' ? '⚡ 电力' : selectedEquipment.category === 'air' ? '💨 压缩空气' : '💧 工业水'}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                  <span>型号: {selectedEquipment.model}</span>
                  <span>额定功率: {selectedEquipment.power}</span>
                  <span>所属车间: {selectedEquipment.workshop}</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs text-muted-foreground font-sans block">本日累计耗能</span>
                <span className="text-lg font-bold text-primary">{selectedEquipment.energyToday}</span>
              </div>
            </div>

            {/* 8 大实时遥测参量卡片 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-lg bg-accent/30 border border-border/80 space-y-1">
                <span className="text-[11px] text-muted-foreground font-sans block">三相电压 (Ua/Ub/Uc)</span>
                <div className="text-sm font-bold text-foreground">{selectedEquipment.ua} / {selectedEquipment.ub} / {selectedEquipment.uc} <span className="text-[10px] font-sans text-muted-foreground">kV</span></div>
              </div>

              <div className="p-3 rounded-lg bg-accent/30 border border-border/80 space-y-1">
                <span className="text-[11px] text-muted-foreground font-sans block">三相电流 (Ia/Ib/Ic)</span>
                <div className="text-sm font-bold text-foreground">{selectedEquipment.ia} / {selectedEquipment.ib} / {selectedEquipment.ic} <span className="text-[10px] font-sans text-muted-foreground">A</span></div>
              </div>

              <div className="p-3 rounded-lg bg-accent/30 border border-border/80 space-y-1">
                <span className="text-[11px] text-muted-foreground font-sans block">总有功功率 (P)</span>
                <div className="text-sm font-bold text-emerald-500">{selectedEquipment.p} <span className="text-[10px] font-sans text-muted-foreground">kW</span></div>
              </div>

              <div className="p-3 rounded-lg bg-accent/30 border border-border/80 space-y-1">
                <span className="text-[11px] text-muted-foreground font-sans block">功率因数 (PF)</span>
                <div className="text-sm font-bold text-sky-400">{selectedEquipment.pf} <span className="text-[10px] font-sans text-emerald-500">(优)</span></div>
              </div>
            </div>

            {/* 24h 遥测时序波形图 */}
            <Panel className="p-4">
              <PanelTitle icon={Activity}>【{selectedEquipment.name}】24 小时高频遥测波形图</PanelTitle>
              <div className="mt-3">
                <LineTrend
                  data={[
                    { time: '00:00', 有功功率: 420, A相电流: 310, 温度: 110 },
                    { time: '04:00', 有功功率: 410, A相电流: 305, 温度: 112 },
                    { time: '08:00', 有功功率: 465, A相电流: 320, 温度: 115 },
                    { time: '12:00', 有功功率: 468, A相电流: 322, 温度: 116 },
                    { time: '16:00', 有功功率: 462, A相电流: 318, 温度: 114 },
                    { time: '20:00', 有功功率: 440, A相电流: 312, 温度: 113 },
                  ]}
                  keys={['有功功率', 'A相电流']}
                  xKey="time"
                  height={260}
                />
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* 🌟 5. 视图三：关键工序在线监测 (左侧工艺树 + 模糊查询 + 市电/绿电分项拆解) */}
      {viewMode === 'process' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 左侧工序树 (col-span-4) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-card border border-border space-y-3">
            <PanelTitle icon={Layers}>工艺流程工序树</PanelTitle>

            {/* 模糊搜索框 */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="模糊搜索工序名称或车间..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-accent/30 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* 工序标准树 */}
            <div className="pt-1 overflow-y-auto max-h-[420px]">
              <TreeView data={processTreeData} defaultExpandAll />
            </div>
          </div>

          {/* 右侧关键工序实时能效工作台 (col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* 工序详情 Header */}
            <div className="p-4 rounded-xl bg-card border border-border flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{selectedProcess.name}</span>
                  <StatusBadge tone="ok">工序受控中</StatusBadge>
                  <Badge tone="primary">{selectedProcess.workshop}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                  <span>所属产线: {selectedProcess.line}</span>
                  <span>能效流速: {selectedProcess.speed}</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs text-muted-foreground font-sans block">工序实测单耗</span>
                <span className="text-lg font-bold text-emerald-500">{selectedProcess.actualUnit} (定额 {selectedProcess.unitQuota})</span>
              </div>
            </div>

            {/* 市电 vs 绿电分项实时拆解 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Panel className="p-4 space-y-3">
                <PanelTitle icon={Sun}>工序用电市电/绿电分项占比</PanelTitle>
                <Donut
                  data={[
                    { name: '屋顶光伏绿电直供', value: selectedProcess.greenRatio, color: '#10b981' },
                    { name: '国家电网市电输入', value: selectedProcess.gridRatio, color: '#1677ff' },
                  ]}
                  unit="%"
                  height={200}
                />
                <div className="flex justify-between text-xs font-mono pt-1">
                  <span className="text-emerald-500 font-bold">🟢 绿电消纳率: {selectedProcess.greenRatio}%</span>
                  <span className="text-blue-500 font-bold">🔵 市电依赖: {selectedProcess.gridRatio}%</span>
                </div>
              </Panel>

              <Panel className="p-4 space-y-3 flex flex-col justify-between">
                <PanelTitle icon={Activity}>工序能耗时序流速</PanelTitle>
                <div className="space-y-2 text-xs font-sans">
                  <div className="p-2.5 rounded bg-accent/30 flex justify-between"><span>工序今日总电耗：</span><span className="font-mono font-bold text-foreground">{selectedProcess.elecKwh}</span></div>
                  <div className="p-2.5 rounded bg-accent/30 flex justify-between"><span>折合标煤总量：</span><span className="font-mono font-bold text-foreground">0.47 tce</span></div>
                  <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-500 flex justify-between"><span>绿电减碳收益：</span><span className="font-mono font-bold">-285 kgCO2</span></div>
                </div>
                <button onClick={() => alert(`已导出【${selectedProcess.name}】工序能效分析报告`)} className="w-full py-2 rounded-md bg-primary text-primary-foreground font-semibold text-xs shadow">
                  生成工序能效诊断分析报告
                </button>
              </Panel>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

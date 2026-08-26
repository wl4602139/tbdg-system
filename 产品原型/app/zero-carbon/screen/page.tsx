'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Zap,
  Flame,
  Droplets,
  Wind,
  Sun,
  BatteryCharging,
  Leaf,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  Clock,
  Compass,
  Cpu,
  AlertTriangle,
  RotateCw,
  Plus,
  Minus,
  Box,
  Eye,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Factory,
  BarChart3,
  Sliders,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ZeroCarbonScreenPage() {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 3D 沙盘控制
  const [zoomLevel, setZoomLevel] = useState(1.0)
  const [baseMapOn, setBaseMapOn] = useState(true)
  const [view3D, setView3D] = useState(true)
  const [activeWeatherMode, setActiveWeatherMode] = useState<'sun' | 'peak' | 'night' | 'rain'>('peak')

  // 储能电站状态
  const [bessPower, setBessPower] = useState(45)
  const [bessSoc, setBessSoc] = useState(78)
  const [bessMode, setBessMode] = useState<'charge' | 'discharge' | 'standby'>('standby')

  // 右上角分类 Tab
  const [areaTab, setAreaTab] = useState<'device' | 'scope'>('device')

  // 能流介质 Tab
  const [sankeyMedium, setSankeyMedium] = useState<'elec' | 'water' | 'gas' | 'steam'>('elec')

  // 时钟更新
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#030b17] text-white p-2.5 sm:p-3.5 font-sans overflow-x-hidden select-none flex flex-col justify-between">
      {/* 🌟 1. 顶部赛博科技 HUD 导航栏 */}
      <header className="relative z-30 flex items-center justify-between pb-2">
        {/* 左侧：天气 + 空气质量 + 实时时钟 */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-cyan-300">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 backdrop-blur-sm">
            <span className="text-amber-400">☀️ 26℃ 晴</span>
            <span>|</span>
            <span className="text-emerald-400">AQI 18 优</span>
            <span>|</span>
            <span className="text-cyan-200">{currentTime || '2026/08/26 11:42:54'}</span>
          </div>
        </div>

        {/* 中央标题 HUD 发光牌 */}
        <div className="relative text-center px-8 py-1">
          <div className="flex items-center justify-center gap-2">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-widest bg-gradient-to-b from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]">
              零碳园区能碳双控数据大屏
            </h1>
            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>
          <div className="text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase -mt-0.5">
            ZERO CARBON PLATFORM SYSTEM // MULTI-MEDIA TELEMETRY
          </div>
          {/* 装饰发光外翼角 */}
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#06b6d4]" />
        </div>

        {/* 右侧：全屏与返回按钮 */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 transition-colors shadow-xs"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            <span>{isFullscreen ? 'EXIT FULL' : 'FULLSCREEN'}</span>
          </button>
          <Link
            href="/zero-carbon/monitor/indicator"
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 transition-colors shadow-xs font-bold"
          >
            <ArrowLeft className="size-3.5" />
            <span>BACK TO SYSTEM</span>
          </Link>
        </div>
      </header>

      {/* 🌟 2. 大屏三栏核心栅格 (左侧 3 卡片 + 中间 3D 沙盘 + 右侧 3 卡片) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 items-stretch z-10">
        
        {/* ================= 左侧栏 (col-span-3) ================= */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3">
          
          {/* 卡片 1: 多介质能耗实时监测 */}
          <div className="p-3 rounded-xl bg-[#061428]/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
              <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                多介质能耗实时监测
              </span>
              <span className="text-[10px] text-cyan-400/60 font-mono">RT-01</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* 电力 */}
              <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 space-y-1">
                <div className="flex items-center justify-between text-xs text-cyan-200">
                  <span className="flex items-center gap-1"><Zap className="size-3 text-cyan-400" /> 电力负载</span>
                </div>
                <div className="text-base font-extrabold font-mono text-cyan-300">
                  300,296.6 <span className="text-[10px] text-cyan-400 font-sans">kW</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono block">↑ 1.5% 较昨日</span>
              </div>

              {/* 天然气 */}
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-200">
                  <span className="flex items-center gap-1"><Flame className="size-3 text-amber-400" /> 天然气流量</span>
                </div>
                <div className="text-base font-extrabold font-mono text-amber-300">
                  185.2 <span className="text-[10px] text-amber-400 font-sans">m³/h</span>
                </div>
                <span className="text-[10px] text-cyan-300 font-mono block">↓ 0.8% 恒定</span>
              </div>

              {/* 工业水 */}
              <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/40 space-y-1">
                <div className="flex items-center justify-between text-xs text-blue-200">
                  <span className="flex items-center gap-1"><Droplets className="size-3 text-blue-400" /> 工业水耗</span>
                </div>
                <div className="text-base font-extrabold font-mono text-blue-300">
                  12.4 <span className="text-[10px] text-blue-400 font-sans">m³/h</span>
                </div>
                <span className="text-[10px] text-cyan-300 font-mono block">恒定受控</span>
              </div>

              {/* 蒸汽 */}
              <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/40 space-y-1">
                <div className="flex items-center justify-between text-xs text-red-200">
                  <span className="flex items-center gap-1"><Wind className="size-3 text-red-400" /> 蒸汽热力</span>
                </div>
                <div className="text-base font-extrabold font-mono text-red-300">
                  3.7 <span className="text-[10px] text-red-400 font-sans">GJ/h</span>
                </div>
                <span className="text-[10px] text-red-400 font-mono block">↑ 2.1% 超标</span>
              </div>
            </div>
          </div>

          {/* 卡片 2: 园区实时能碳效益总览 */}
          <div className="p-3 rounded-xl bg-[#061428]/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
              <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                园区实时能碳效益总览
              </span>
              <span className="text-[10px] text-cyan-400/60 font-mono">KPI-01</span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20">
                <span className="text-[10px] text-slate-400 font-sans block">⚡ 本日累计用电</span>
                <div className="text-lg font-bold text-cyan-300 mt-0.5">14,250 <span className="text-[10px] font-sans text-slate-400">kWh</span></div>
                <span className="text-[10px] text-cyan-400">↓ 5.2% 节能</span>
              </div>

              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 font-sans block">☀️ 本日累计绿电</span>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">5,820 <span className="text-[10px] font-sans text-slate-400">kWh</span></div>
                <span className="text-[10px] text-emerald-400">↑ 12.8% 充沛</span>
              </div>

              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20">
                <span className="text-[10px] text-slate-400 font-sans block">🌱 绿电消纳率</span>
                <div className="text-lg font-bold text-amber-300 mt-0.5">40.8 <span className="text-[10px] font-sans text-slate-400">%</span></div>
                <span className="text-[10px] text-emerald-400">达标 102%</span>
              </div>

              <div className="p-2 rounded bg-purple-950/40 border border-purple-500/20">
                <span className="text-[10px] text-slate-400 font-sans block">📉 累计减碳量</span>
                <div className="text-lg font-bold text-purple-300 mt-0.5">4.1 <span className="text-[10px] font-sans text-slate-400">tCO2</span></div>
                <span className="text-[10px] text-purple-400">已达 28.5%</span>
              </div>
            </div>
          </div>

          {/* 卡片 3: 1MW/2MWh 储能电站控制舱 */}
          <div className="p-3 rounded-xl bg-[#061428]/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md space-y-2.5">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
              <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                <BatteryCharging className="size-4 text-cyan-400" />
                1MW/2MWh 储能电站控制舱
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">BESS CORE // ONLINE</span>
            </div>

            {/* 电池电量条展示 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">储能电量 (SOC)</span>
                <span className="font-bold font-mono text-cyan-300">{bessSoc}% (1560/2000 kWh)</span>
              </div>
              <div className="h-4 bg-slate-900 rounded p-0.5 border border-cyan-500/40 flex gap-1">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'h-full flex-1 rounded-xs transition-all duration-500',
                      idx < 8 ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_6px_#06b6d4]' : 'bg-cyan-950/40'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* 充放电实时功率与控制按钮 */}
            <div className="space-y-2 pt-1 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans">微网实时充放功率：</span>
                <span className="font-bold text-amber-300">+{bessPower} kW (自适应平抑)</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <button
                  onClick={() => { setBessMode('charge'); setBessPower(300); }}
                  className={cn(
                    'py-1 rounded border transition-colors font-bold',
                    bessMode === 'charge' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                  )}
                >
                  谷充 (+300)
                </button>
                <button
                  onClick={() => { setBessMode('discharge'); setBessPower(-300); }}
                  className={cn(
                    'py-1 rounded border transition-colors font-bold',
                    bessMode === 'discharge' ? 'bg-red-600 border-red-400 text-white' : 'bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-900'
                  )}
                >
                  峰放 (-300)
                </button>
                <button
                  onClick={() => { setBessMode('standby'); setBessPower(0); }}
                  className={cn(
                    'py-1 rounded border transition-colors font-bold',
                    bessMode === 'standby' ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900'
                  )}
                >
                  待机 (0 kW)
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ================= 中间核心 3D 数字孪生沙盘 (col-span-6) ================= */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-3 relative">
          
          {/* 3D 沙盘控制顶栏 */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[#061428]/80 border border-cyan-500/30 backdrop-blur-md z-20">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1.5">
                <Box className="size-3.5 text-cyan-400" />
                3D 沙盘导航
              </span>
              <button
                onClick={() => setZoomLevel((v) => Math.min(v + 0.1, 1.4))}
                className="p-1 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-[11px] px-2 flex items-center gap-0.5"
              >
                <Plus className="size-3" /> 放大
              </button>
              <button
                onClick={() => setZoomLevel((v) => Math.max(v - 0.1, 0.7))}
                className="p-1 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-[11px] px-2 flex items-center gap-0.5"
              >
                <Minus className="size-3" /> 缩小
              </button>
              <button
                onClick={() => setView3D(!view3D)}
                className="p-1 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-[11px] px-2 flex items-center gap-1"
              >
                <Eye className="size-3 text-cyan-400" /> 三维视角
              </button>
              <button
                onClick={() => setBaseMapOn(!baseMapOn)}
                className="p-1 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-[11px] px-2"
              >
                底图: {baseMapOn ? '开' : '关'}
              </button>
            </div>

            <div className="text-[10px] text-cyan-400/80 font-mono flex items-center gap-1.5">
              <span>💡 滚轮缩放 · 鼠标拖拽平移 · 点击建筑下钻</span>
            </div>
          </div>

          {/* 3D 虚拟沙盘画布容器 */}
          <div className="relative flex-1 min-h-[380px] rounded-2xl bg-[#040e1e]/90 border border-cyan-500/30 overflow-hidden flex items-center justify-center shadow-[inset_0_0_40px_rgba(6,182,212,0.2)]">
            
            {/* 3D 网格地表 */}
            <div
              className="absolute inset-0 transition-transform duration-300"
              style={{
                transform: `scale(${zoomLevel}) rotateX(45deg) rotateZ(-25deg)`,
                transformStyle: 'preserve-3d',
                backgroundImage: `
                  linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            >
              {/* 地表同心辐射能量环 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full border border-cyan-500/30 animate-ping opacity-25" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[350px] rounded-full border-2 border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '40s' }} />

              {/* 1. 风力发电机组 */}
              <div className="absolute top-[20%] left-[50%] -translate-x-1/2 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-[10px] text-cyan-300 font-mono mb-1 shadow-[0_0_10px_#06b6d4]">
                  风力发电机组
                </div>
                <div className="size-16 relative flex items-center justify-center">
                  <Wind className="size-12 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="w-1.5 h-16 bg-gradient-to-b from-cyan-400 to-transparent" />
              </div>

              {/* 2. 外部国家电网接入铁塔 */}
              <div className="absolute top-[25%] left-[75%] flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-amber-950/90 border border-amber-400 text-[10px] text-amber-300 font-mono mb-1 shadow-[0_0_10px_#f59e0b]">
                  外部国家电网接入
                </div>
                <div className="w-10 h-20 border-2 border-amber-400/80 relative flex items-center justify-center bg-amber-500/10">
                  <Zap className="size-6 text-amber-400 animate-pulse" />
                </div>
              </div>

              {/* 3. 动力冷热供应中心 (中心核心) */}
              <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="px-2.5 py-0.5 rounded bg-red-950/90 border border-red-500 text-[10px] text-red-300 font-bold mb-1 shadow-[0_0_12px_#ef4444] animate-pulse">
                  ▲ 动力冷热负荷中心
                </div>
                <div className="w-24 h-20 rounded-xl border-2 border-cyan-400/80 bg-cyan-500/20 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_20px_#06b6d4]">
                  <Activity className="size-6 text-cyan-300 animate-bounce" />
                  <span className="text-[9px] text-cyan-200 font-mono mt-1">4.8MW 主变</span>
                </div>
              </div>

              {/* 4. 智能制造厂房 */}
              <div className="absolute top-[40%] left-[25%] flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-blue-950/90 border border-blue-400 text-[10px] text-blue-300 font-mono mb-1">
                  1# 智能制造厂房
                </div>
                <div className="w-28 h-18 border-2 border-blue-400/70 bg-blue-600/15 rounded flex items-center justify-center">
                  <Factory className="size-7 text-blue-300" />
                </div>
              </div>

              {/* 5. 综合高新研发大楼 */}
              <div className="absolute top-[50%] left-[80%] flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-[10px] text-cyan-300 font-mono mb-1">
                  综合高新研发大楼
                </div>
                <div className="w-20 h-32 border-2 border-cyan-400/80 bg-cyan-500/15 rounded flex flex-col items-center justify-between p-1.5 shadow-[0_0_15px_#06b6d4]">
                  <span className="text-[8px] text-cyan-300 font-mono">18F 零碳建筑</span>
                  <div className="size-8 rounded-full border border-cyan-300/40 flex items-center justify-center">
                    <Leaf className="size-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* 6. 充电站与储能站 */}
              <div className="absolute top-[68%] left-[20%] flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-400 text-[9px] text-emerald-300 font-mono mb-1">
                  1# 智能汽车充电站
                </div>
                <div className="w-16 h-10 border border-emerald-400/70 bg-emerald-600/20 rounded flex items-center justify-center">
                  <BatteryCharging className="size-5 text-emerald-300" />
                </div>
              </div>

              {/* 7. 分布式光伏阵列 */}
              <div className="absolute top-[75%] left-[45%] flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-yellow-950/90 border border-yellow-400 text-[9px] text-yellow-300 font-mono mb-1">
                  分布式光伏阵列
                </div>
                <div className="w-24 h-12 border border-yellow-400/70 bg-yellow-500/20 rounded grid grid-cols-3 gap-0.5 p-0.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-yellow-400/40 rounded-xs" />
                  ))}
                </div>
              </div>

              {/* 8. 2# 智能重卡充电站 */}
              <div className="absolute top-[72%] left-[70%] flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-[9px] text-cyan-300 font-mono mb-1">
                  2# 智能重卡充电站
                </div>
                <div className="w-18 h-10 border border-cyan-400/70 bg-cyan-600/20 rounded flex items-center justify-center">
                  <Zap className="size-4 text-cyan-300" />
                </div>
              </div>
            </div>

            {/* 底部天气 / 能量模式模拟控制器 */}
            <div className="absolute bottom-3 z-20 flex items-center gap-2 p-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 backdrop-blur-md text-xs">
              <span className="text-cyan-300 font-bold px-2 flex items-center gap-1 font-mono">
                <Sparkles className="size-3.5 text-amber-400" />
                智能联动: 日光
              </span>
              <button
                onClick={() => setActiveWeatherMode('peak')}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold transition-all',
                  activeWeatherMode === 'peak' ? 'bg-amber-500 text-slate-900 shadow-[0_0_10px_#f59e0b]' : 'text-slate-400 hover:text-white'
                )}
              >
                ☀️ 日光峰值
              </button>
              <button
                onClick={() => setActiveWeatherMode('night')}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold transition-all',
                  activeWeatherMode === 'night' ? 'bg-blue-600 text-white shadow-[0_0_10px_#2563eb]' : 'text-slate-400 hover:text-white'
                )}
              >
                🌙 夜间储能
              </button>
              <button
                onClick={() => setActiveWeatherMode('rain')}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold transition-all',
                  activeWeatherMode === 'rain' ? 'bg-indigo-600 text-white shadow-[0_0_10px_#4f46e5]' : 'text-slate-400 hover:text-white'
                )}
              >
                🌧️ 阴雨能源
              </button>
            </div>
          </div>

          {/* 底部中间：综合能流 Sankey 分配比 */}
          <div className="p-3 rounded-xl bg-[#061428]/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 text-xs">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Sliders className="size-3.5 text-cyan-400" />
                综合能流 Sankey 分配比
              </span>
              <div className="flex items-center gap-1 bg-cyan-950/60 rounded p-0.5 border border-cyan-500/30 text-[10px]">
                <button onClick={() => setSankeyMedium('elec')} className={cn('px-2 py-0.5 rounded font-bold', sankeyMedium === 'elec' ? 'bg-cyan-500 text-slate-900' : 'text-cyan-400')}>⚡ 电</button>
                <button onClick={() => setSankeyMedium('water')} className={cn('px-2 py-0.5 rounded font-bold', sankeyMedium === 'water' ? 'bg-cyan-500 text-slate-900' : 'text-cyan-400')}>💧 水</button>
                <button onClick={() => setSankeyMedium('gas')} className={cn('px-2 py-0.5 rounded font-bold', sankeyMedium === 'gas' ? 'bg-cyan-500 text-slate-900' : 'text-cyan-400')}>🔥 气</button>
                <button onClick={() => setSankeyMedium('steam')} className={cn('px-2 py-0.5 rounded font-bold', sankeyMedium === 'steam' ? 'bg-cyan-500 text-slate-900' : 'text-cyan-400')}>💨 汽</button>
              </div>
            </div>

            {/* 能流流动柱状条 */}
            <div className="grid grid-cols-12 gap-2 text-[11px] font-mono items-center pt-1">
              {/* 输入源 */}
              <div className="col-span-4 space-y-2">
                <div className="p-1.5 rounded bg-cyan-950/60 border border-cyan-400/60 flex items-center justify-between">
                  <span>市电输入</span>
                  <span className="text-cyan-300 font-bold">65.2%</span>
                </div>
                <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-400/60 flex items-center justify-between">
                  <span>光伏出力</span>
                  <span className="text-emerald-300 font-bold">34.8%</span>
                </div>
              </div>

              {/* 流动发光管道 */}
              <div className="col-span-4 flex flex-col justify-around h-full py-1">
                <div className="h-2 w-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 rounded-full shadow-[0_0_8px_#06b6d4] animate-pulse" />
                <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500 rounded-full shadow-[0_0_8px_#10b981] animate-pulse" />
              </div>

              {/* 消耗末端 */}
              <div className="col-span-4 space-y-1.5 text-[10px]">
                <div className="p-1 rounded bg-slate-900/60 border border-slate-700 flex justify-between"><span>动力冷热站</span><span className="text-cyan-300 font-bold">42%</span></div>
                <div className="p-1 rounded bg-slate-900/60 border border-slate-700 flex justify-between"><span>智能制造区</span><span className="text-blue-300 font-bold">35%</span></div>
                <div className="p-1 rounded bg-slate-900/60 border border-slate-700 flex justify-between"><span>研发办公大楼</span><span className="text-emerald-300 font-bold">18%</span></div>
                <div className="p-1 rounded bg-slate-900/60 border border-slate-700 flex justify-between"><span>充电桩与储能</span><span className="text-amber-300 font-bold">5%</span></div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= 右侧栏 (col-span-3) ================= */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3">
          
          {/* 卡片 1: 各用能占比统计 */}
          <div className="p-3 rounded-xl bg-[#061428]/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 text-xs">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <BarChart3 className="size-3.5 text-cyan-400" />
                各用能占比统计
              </span>
              <div className="flex items-center gap-1 bg-cyan-950/60 rounded p-0.5 border border-cyan-500/30 text-[10px]">
                <button onClick={() => setAreaTab('device')} className={cn('px-2 py-0.5 rounded font-bold', areaTab === 'device' ? 'bg-cyan-500 text-slate-900' : 'text-cyan-400')}>设备类型</button>
                <button onClick={() => setAreaTab('scope')} className={cn('px-2 py-0.5 rounded font-bold', areaTab === 'scope' ? 'bg-cyan-500 text-slate-900' : 'text-cyan-400')}>Scope 排放</button>
              </div>
            </div>

            {/* 横向条形图 */}
            <div className="space-y-2 text-xs font-mono pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]"><span className="text-slate-300">智能制造产线</span><span className="text-cyan-300 font-bold">120 kW</span></div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 rounded-full" style={{ width: '25%' }} /></div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]"><span className="text-slate-300">生产车间</span><span className="text-cyan-300 font-bold">450 kW</span></div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" style={{ width: '75%' }} /></div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]"><span className="text-slate-300">研发大楼</span><span className="text-cyan-300 font-bold">280 kW</span></div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: '48%' }} /></div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]"><span className="text-slate-300">储能充放</span><span className="text-cyan-300 font-bold">45 kW</span></div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: '12%' }} /></div>
              </div>
            </div>
          </div>

          {/* 卡片 2: 实时用电与光伏出力对标 */}
          <div className="p-3 rounded-xl bg-[#061428]/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 text-xs">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Activity className="size-3.5 text-cyan-400" />
                实时用电与光伏出力对标
              </span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-blue-400"><span className="size-2 rounded-full bg-blue-500" /> 用电负荷</span>
                <span className="flex items-center gap-1 text-emerald-400"><span className="size-2 rounded-full bg-emerald-500" /> 光伏出力</span>
              </div>
            </div>

            {/* SVG 双曲线图 */}
            <div className="h-36 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* 背景水平刻度线 */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#0e2a47" strokeDasharray="2 2" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#0e2a47" strokeDasharray="2 2" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="#0e2a47" strokeDasharray="2 2" />

                {/* 用电负荷面积与曲线 (蓝色) */}
                <path
                  d="M 0,70 Q 60,65 100,50 T 170,25 T 230,45 T 300,75 L 300,100 L 0,100 Z"
                  fill="url(#cyanGrad)"
                />
                <path
                  d="M 0,70 Q 60,65 100,50 T 170,25 T 230,45 T 300,75"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* 光伏出力面积与曲线 (绿色) */}
                <path
                  d="M 0,100 Q 60,100 100,80 T 170,35 T 230,60 T 300,100 Z"
                  fill="url(#greenGrad)"
                />
                <path
                  d="M 0,100 Q 60,100 100,80 T 170,35 T 230,60 T 300,100"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* 峰值亮点 */}
                <circle cx="170" cy="25" r="4" fill="#ef4444" className="animate-ping" />
                <circle cx="170" cy="25" r="3" fill="#ef4444" />
                <text x="160" y="18" fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="monospace">840</text>

                <circle cx="170" cy="35" r="3" fill="#10b981" />
                <text x="160" y="48" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">700</text>
              </svg>

              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>24:00</span>
              </div>
            </div>
          </div>

          {/* 卡片 3: 系统事件实时监控 */}
          <div className="p-3 rounded-xl bg-[#061428]/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 text-xs">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 text-cyan-400" />
                系统事件实时监控
              </span>
              <span className="text-[10px] text-cyan-400/60 font-mono">SYS-01</span>
            </div>

            <div className="space-y-2 text-[11px] font-sans">
              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2">
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400 text-[10px] shrink-0 font-bold">
                  动力正常
                </span>
                <div className="flex-1 text-slate-300 leading-tight">
                  <div className="flex justify-between text-[10px] text-cyan-400/80 font-mono">
                    <span>分布式光伏并网</span>
                    <span>14:15:00</span>
                  </div>
                  <p className="mt-0.5 text-slate-300">
                    光伏效益显著，本日累计发电量 5,820 kWh，超出预测收益值 +12.5%
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2">
                <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400 text-[10px] shrink-0 font-bold">
                  系统高效
                </span>
                <div className="flex-1 text-slate-300 leading-tight">
                  <div className="flex justify-between text-[10px] text-cyan-400/80 font-mono">
                    <span>外部国家电网节点</span>
                    <span>14:02:18</span>
                  </div>
                  <p className="mt-0.5 text-slate-300">
                    并网质量监测，三相电压平衡率 99.95%，微网电源频率 50.01 Hz 稳定度极优
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 底部装饰发光科技细线 */}
      <footer className="relative z-20 pt-2 flex items-center justify-between text-[10px] text-cyan-400/60 font-mono border-t border-cyan-500/20 mt-2">
        <div>特变电工股份有限公司（电装集团）· 零碳园区数字化管控中心</div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-400 animate-ping" /> 数据刷新频率: 1000ms</span>
          <span>系统状态: 极优 (Normal)</span>
        </div>
      </footer>
    </div>
  )
}

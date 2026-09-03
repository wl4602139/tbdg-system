'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sun,
  Leaf,
  Award,
  ShieldCheck,
  TrendingUp,
  Flame,
  Zap,
  Droplets,
  Gauge,
  Cpu,
  Footprints,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  X,
  MapPin,
  CloudSun,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 园区地图标记数据定义
interface ParkMarker {
  id: string
  name: string
  shortName: string
  province: string
  city: string
  coordinates: [number, number]
  pos: { left: string; top: string }
  greenRatio: number // 绿电占比 %
  carbonIntensity: number // 碳排放强度 tCO2/万元
  pvCapacityMw: number
  transformerMva: number
  lastYearBuyGwh: number
  thisYearGenGwh: number
  status: '运行中' | '建设中' | '规划中'
  company: string
}

const PARK_MARKERS: ParkMarker[] = [
  {
    id: 'nanjing',
    name: '特变电工南京智能电气产业园',
    shortName: '南京智能电气产业园',
    province: '江苏省',
    city: '南京市',
    coordinates: [118.8, 32.06],
    pos: { left: '76.5%', top: '58.5%' },
    greenRatio: 62.3,
    carbonIntensity: 0.28,
    pvCapacityMw: 28.6,
    transformerMva: 320,
    lastYearBuyGwh: 3.85,
    thisYearGenGwh: 2.36,
    status: '运行中',
    company: '华东输配电产业园',
  },
  {
    id: 'shenbian',
    name: '沈变集团本部园区',
    shortName: '沈变变压器产业园',
    province: '辽宁省',
    city: '沈阳市',
    coordinates: [123.43, 41.8],
    pos: { left: '80.5%', top: '26.8%' },
    greenRatio: 54.2,
    carbonIntensity: 0.42,
    pvCapacityMw: 26.8,
    transformerMva: 450,
    lastYearBuyGwh: 4.12,
    thisYearGenGwh: 2.94,
    status: '运行中',
    company: '沈变变压器产业园',
  },
  {
    id: 'baobian',
    name: '保变低碳智慧园区',
    shortName: '保定智能产业园',
    province: '河北省',
    city: '保定市',
    coordinates: [115.48, 38.85],
    pos: { left: '69.2%', top: '39.8%' },
    greenRatio: 41.5,
    carbonIntensity: 0.65,
    pvCapacityMw: 18.2,
    transformerMva: 280,
    lastYearBuyGwh: 2.98,
    thisYearGenGwh: 1.84,
    status: '运行中',
    company: '京津冀智能装备',
  },
  {
    id: 'xinjiang',
    name: '新疆电装产业园',
    shortName: '新疆电装产业园',
    province: '新疆',
    city: '昌吉市',
    coordinates: [87.42, 44.12],
    pos: { left: '25.5%', top: '38.5%' },
    greenRatio: 78.4,
    carbonIntensity: 0.22,
    pvCapacityMw: 45.0,
    transformerMva: 600,
    lastYearBuyGwh: 5.6,
    thisYearGenGwh: 4.82,
    status: '运行中',
    company: '特变电工超高压',
  },
  {
    id: 'xian',
    name: '西安西变智能装备产业园',
    shortName: '西变产业园',
    province: '陕西省',
    city: '西安市',
    coordinates: [108.94, 34.34],
    pos: { left: '54.2%', top: '51.2%' },
    greenRatio: 58.6,
    carbonIntensity: 0.35,
    pvCapacityMw: 35.6,
    transformerMva: 520,
    lastYearBuyGwh: 4.5,
    thisYearGenGwh: 3.86,
    status: '运行中',
    company: '西安智能装备产业园',
  },
  {
    id: 'deyang',
    name: '德缆低碳绿色线缆产业园',
    shortName: '德缆产业园',
    province: '四川省',
    city: '德阳市',
    coordinates: [104.4, 31.13],
    pos: { left: '46.8%', top: '64.5%' },
    greenRatio: 68.2,
    carbonIntensity: 0.31,
    pvCapacityMw: 18.7,
    transformerMva: 240,
    lastYearBuyGwh: 2.65,
    thisYearGenGwh: 2.02,
    status: '运行中',
    company: '德缆线缆产业园',
  },
  {
    id: 'huazhong',
    name: '特变电工华中输配电产业园',
    shortName: '华中产业园',
    province: '湖南省',
    city: '衡阳市',
    coordinates: [112.61, 26.9],
    pos: { left: '64.2%', top: '70.6%' },
    greenRatio: 72.8,
    carbonIntensity: 0.25,
    pvCapacityMw: 30.3,
    transformerMva: 480,
    lastYearBuyGwh: 3.9,
    thisYearGenGwh: 3.1,
    status: '运行中',
    company: '华东输配电产业园',
  },
  {
    id: 'nanfang',
    name: '特变电工南方输配电产业园',
    shortName: '南方产业园',
    province: '广东省',
    city: '广州市',
    coordinates: [113.26, 23.13],
    pos: { left: '66.8%', top: '81.2%' },
    greenRatio: 36.4,
    carbonIntensity: 0.58,
    pvCapacityMw: 15.5,
    transformerMva: 260,
    lastYearBuyGwh: 2.1,
    thisYearGenGwh: 1.58,
    status: '规划中',
    company: '南方输配电产业园',
  },
  {
    id: 'lulan',
    name: '特变电工鲁缆低碳产业园',
    shortName: '鲁缆产业园',
    province: '山东省',
    city: '新泰市',
    coordinates: [117.76, 35.91],
    pos: { left: '73.8%', top: '47.5%' },
    greenRatio: 46.8,
    carbonIntensity: 0.49,
    pvCapacityMw: 16.2,
    transformerMva: 290,
    lastYearBuyGwh: 2.4,
    thisYearGenGwh: 1.63,
    status: '建设中',
    company: '沈缆电缆产业园',
  },
]

// 绿色发展大事记列表
const MILESTONES = [
  { date: '2021.06', title: '发布“双碳”战略' },
  { date: '2022.03', title: '首个零碳工厂动工' },
  { date: '2023.11', title: '集团光伏装机突破100 MW' },
  { date: '2024.06', title: '获评国家级绿色工厂' },
  { date: '2026.01', title: '零碳园区示范项目' },
  { date: '2026.06', title: '集团碳中和白皮书发布' },
]

// 集团光伏建设进展表格
const PV_PROJECTS = [
  { name: '西安变压器智能装备产业园', unit: '西安智能装备产业园', mw: 35.6, kwh: '3,856', status: '运行中' },
  { name: '特变电工华中输配电产业园', unit: '华东输配电产业园', mw: 30.3, kwh: '3,102', status: '运行中' },
  { name: '特变电工沈变变压器产业园', unit: '沈阳变压器产业园', mw: 26.8, kwh: '2,945', status: '运行中' },
  { name: '德缆绿色低碳产业园', unit: '德缆线缆产业园', mw: 18.7, kwh: '2,021', status: '运行中' },
  { name: '特变电工保定低碳产业园', unit: '沈阳变压器产业园', mw: 18.2, kwh: '1,832', status: '建设中' },
  { name: '特变电工南方输配电产业园', unit: '南方输配电产业园', mw: 15.5, kwh: '1,587', status: '规划中' },
]

// 园区下属工厂 5 个 Tab
const FACTORY_TABS = ['南京变研', '变电电气', '湖南电气', '云集高压开关', '智慧能控']

const FACTORY_METRICS_DATA: Record<string, {
  energyTce: string
  carbonTco2: string
  carbonPerOutput: string
  nonFossilRatio: string
  greenPowerRatio: string
  energyPerAddValue: string
  energyPerOutput: string
  waterWanM3: string
  savingEquipRatio: string
  footprintRatio: string
}> = {
  '南京变研': {
    energyTce: '12,856',
    carbonTco2: '35,642',
    carbonPerOutput: '0.378',
    nonFossilRatio: '58.6',
    greenPowerRatio: '62.3',
    energyPerAddValue: '0.455',
    energyPerOutput: '0.312',
    waterWanM3: '28.6',
    savingEquipRatio: '76.5',
    footprintRatio: '68.2',
  },
  '变电电气': {
    energyTce: '15,420',
    carbonTco2: '41,200',
    carbonPerOutput: '0.340',
    nonFossilRatio: '64.2',
    greenPowerRatio: '68.5',
    energyPerAddValue: '0.412',
    energyPerOutput: '0.285',
    waterWanM3: '32.1',
    savingEquipRatio: '81.0',
    footprintRatio: '72.0',
  },
  '湖南电气': {
    energyTce: '9,840',
    carbonTco2: '22,150',
    carbonPerOutput: '0.290',
    nonFossilRatio: '71.5',
    greenPowerRatio: '76.2',
    energyPerAddValue: '0.368',
    energyPerOutput: '0.245',
    waterWanM3: '21.4',
    savingEquipRatio: '84.5',
    footprintRatio: '75.8',
  },
  '云集高压开关': {
    energyTce: '7,650',
    carbonTco2: '18,300',
    carbonPerOutput: '0.395',
    nonFossilRatio: '60.4',
    greenPowerRatio: '65.1',
    energyPerAddValue: '0.472',
    energyPerOutput: '0.335',
    waterWanM3: '17.5',
    savingEquipRatio: '74.2',
    footprintRatio: '66.4',
  },
  '智慧能控': {
    energyTce: '4,320',
    carbonTco2: '9,850',
    carbonPerOutput: '0.235',
    nonFossilRatio: '78.9',
    greenPowerRatio: '83.2',
    energyPerAddValue: '0.295',
    energyPerOutput: '0.198',
    waterWanM3: '11.2',
    savingEquipRatio: '89.6',
    footprintRatio: '85.0',
  },
}

export default function ZeroCarbonScreenPage() {
  const [currentTime, setCurrentTime] = useState<string>('2026-08-12 15:30:45 星期二')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedParkId, setSelectedParkId] = useState<string>('nanjing')
  const [activeFactoryTab, setActiveFactoryTab] = useState<string>('南京变研')
  const [popupVisible, setPopupVisible] = useState(true)
  const [selectedParkDropdown, setSelectedParkDropdown] = useState('南京智能电气产业园')

  // 实时时钟更新
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const weekDay = days[now.getDay()]
      setCurrentTime(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + weekDay)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
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

  const selectedPark = useMemo(() => {
    return PARK_MARKERS.find((p) => p.id === selectedParkId) || PARK_MARKERS[0]
  }, [selectedParkId])

  const factoryMetrics = FACTORY_METRICS_DATA[activeFactoryTab] || FACTORY_METRICS_DATA['南京变研']

  // 获取标记颜色（根据绿电占比）
  const getMarkerFill = (greenRatio: number) => {
    if (greenRatio >= 70) return '#00e5ff' // 蔚蓝/青色 >70%
    if (greenRatio >= 45) return '#f59e0b' // 橙黄 30%-70%
    return '#f97316' // 亮橙 <30%
  }

  // 获取科技青色引线路径
  const leaderLine = useMemo(() => {
    const px = parseFloat(selectedPark.pos.left) * 10
    const py = parseFloat(selectedPark.pos.top) * 6.5
    const cardAnchorX = 660
    const cardAnchorY = 360

    if (px >= cardAnchorX) {
      const midY = Math.max(py + 30, cardAnchorY + 30)
      return {
        path: 'M ' + px + ' ' + py + ' L ' + px + ' ' + midY + ' L ' + cardAnchorX + ' ' + midY + ' L ' + cardAnchorX + ' ' + cardAnchorY,
        elbowX: px,
        elbowY: midY,
        anchorX: cardAnchorX,
        anchorY: cardAnchorY,
      }
    } else {
      const midX = px + (cardAnchorX - px) * 0.65
      return {
        path: 'M ' + px + ' ' + py + ' L ' + midX + ' ' + py + ' L ' + midX + ' ' + cardAnchorY + ' L ' + cardAnchorX + ' ' + cardAnchorY,
        elbowX: midX,
        elbowY: py,
        anchorX: cardAnchorX,
        anchorY: cardAnchorY,
      }
    }
  }, [selectedPark])

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#020714] text-slate-100 font-sans overflow-hidden select-none flex flex-col justify-between">
      {/* 背景微弱科技网格与暗角 */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,140,255,0.12),transparent_75%)]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,180,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.035) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ========================================================================= */}
      {/* 🌟 1. 顶部科技 HUD 导航栏 */}
      {/* ========================================================================= */}
      <header className="relative z-40 h-15 shrink-0 flex items-center justify-between px-6 border-b border-[#0a2756]/80 bg-[#020712]/90 backdrop-blur-md">
        {/* 左侧：品牌 Logo + Slogan + 返回按钮 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black italic tracking-tighter text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">TBEA</span>
              <span className="text-sm font-bold text-slate-100 tracking-wider">特变电工</span>
            </div>
            <div className="h-3.5 w-px bg-slate-700" />
            <span className="text-xs text-slate-300 tracking-widest font-medium">装备中国 装备世界</span>
          </div>

          <Link
            href="/zero-carbon"
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#0091ff]/40 bg-[#0091ff]/10 hover:bg-[#0091ff]/20 text-xs text-[#00c2ff] transition-colors shadow-[0_0_10px_rgba(0,145,255,0.15)]"
          >
            <ArrowLeft className="size-3.5" />
            <span>返回系统</span>
          </Link>
        </div>

        {/* 中央主标题科技 HUD 金属梯形外框 */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative px-12 py-1 flex flex-col items-center">
            {/* 科技金属切角与发光线条装饰 */}
            <div className="absolute inset-0 bg-linear-to-b from-[#0091ff]/25 via-[#0055aa]/15 to-transparent border-t-2 border-[#00e5ff] [clip-path:polygon(0_0,100%_0,88%_100%,12%_100%)] pointer-events-none" />
            <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-56 h-[2px] bg-linear-to-r from-transparent via-[#00ffff] to-transparent shadow-[0_0_15px_#00ffff]" />

            <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-white via-[#c7e5ff] to-[#00d2ff] drop-shadow-[0_2px_12px_rgba(0,210,255,0.5)]">
              特变电装集团零碳园区集中监控中心
            </h1>
          </div>
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#00c2ff]/90 font-bold uppercase -mt-0.5">
            GREEN ENERGY BETTER TOMORROW
          </span>
        </div>

        {/* 右侧：实时时钟 + 气象 + 全屏操作 */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{currentTime}</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <CloudSun className="size-4 text-amber-400" />
              北京 28℃ 晴
            </span>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#0091ff]/40 bg-[#002456]/50 hover:bg-[#003882]/70 text-slate-200 text-xs transition-colors cursor-pointer"
            title="全屏切换"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5 text-[#00e5ff]" />}
            <span>{isFullscreen ? '还原' : '全屏'}</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🌟 2. 大屏主体三栏布局 (左 25% | 中 50% | 右 25%) */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 grid grid-cols-12 gap-2.5 p-2.5 overflow-hidden">
        
        {/* ======================================================================= */}
        {/* ⬅️ 左侧板块 (3列 / 12) */}
        {/* ======================================================================= */}
        <section className="col-span-3 flex flex-col gap-2.5 overflow-hidden">
          
          {/* ① 集团战略总览 */}
          <div className="relative rounded-xl border border-[#0e2a5c] bg-[#03091d]/90 p-2.5 shadow-lg shadow-black/50 flex flex-col">
            {/* HUD 四角高光装饰 */}
            <div className="absolute top-0 left-0 size-2 border-t border-l border-[#00d2ff]" />
            <div className="absolute top-0 right-0 size-2 border-t border-r border-[#00d2ff]" />
            <div className="absolute bottom-0 left-0 size-2 border-b border-l border-[#00d2ff]" />
            <div className="absolute bottom-0 right-0 size-2 border-b border-r border-[#00d2ff]" />

            <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1.5 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 bg-linear-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                <h2 className="text-xs font-bold text-slate-100 tracking-wider">集团战略总览</h2>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {/* 绿色工厂数量 */}
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c]">
                <div className="relative size-10 rounded-full border-2 border-emerald-500/60 bg-emerald-950/50 shadow-[0_0_10px_rgba(16,185,129,0.35)] flex items-center justify-center shrink-0">
                  <Leaf className="size-4.5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9.5px] text-slate-400 block truncate">绿色工厂数量</span>
                  <div className="flex items-baseline gap-0.5 mt-0.5">
                    <span className="text-lg font-black font-mono text-emerald-400">12</span>
                    <span className="text-[10px] text-slate-400">个</span>
                  </div>
                </div>
              </div>

              {/* 零碳工厂数量 */}
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c]">
                <div className="relative size-10 rounded-full border-2 border-[#00c2ff]/60 bg-[#002860]/50 shadow-[0_0_10px_rgba(0,194,255,0.35)] flex items-center justify-center shrink-0">
                  <Award className="size-4.5 text-[#00d2ff]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9.5px] text-slate-400 block truncate">零碳工厂数量</span>
                  <div className="flex items-baseline gap-0.5 mt-0.5">
                    <span className="text-lg font-black font-mono text-[#00d2ff]">3</span>
                    <span className="text-[10px] text-slate-400">个</span>
                  </div>
                </div>
              </div>

              {/* 零碳认证数量 */}
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c]">
                <div className="relative size-10 rounded-full border-2 border-teal-400/60 bg-teal-950/50 shadow-[0_0_10px_rgba(45,212,191,0.35)] flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-4.5 text-teal-300" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9.5px] text-slate-400 block truncate">零碳认证数量</span>
                  <div className="flex items-baseline gap-0.5 mt-0.5">
                    <span className="text-lg font-black font-mono text-teal-300">15</span>
                    <span className="text-[10px] text-slate-400">项</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ② 绿色发展大事记 */}
          <div className="relative rounded-xl border border-[#0e2a5c] bg-[#03091d]/90 p-2.5 shadow-lg shadow-black/50 flex flex-col">
            {/* HUD 四角高光装饰 */}
            <div className="absolute top-0 left-0 size-2 border-t border-l border-[#00d2ff]" />
            <div className="absolute top-0 right-0 size-2 border-t border-r border-[#00d2ff]" />
            <div className="absolute bottom-0 left-0 size-2 border-b border-l border-[#00d2ff]" />
            <div className="absolute bottom-0 right-0 size-2 border-b border-r border-[#00d2ff]" />

            <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1.5 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 bg-linear-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                <h2 className="text-xs font-bold text-slate-100 tracking-wider">绿色发展大事记</h2>
              </div>
            </div>

            {/* 水平流动发光时间轴 */}
            <div className="relative py-1.5 px-1">
              <div className="absolute top-[26px] left-3 right-3 h-[2px] bg-linear-to-r from-blue-500/30 via-[#00c2ff]/80 to-emerald-500/40" />
              <div className="grid grid-cols-6 gap-1 relative z-10">
                {MILESTONES.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center group">
                    <span className="text-[9.5px] font-mono text-[#00c2ff] font-bold mb-1">{item.date}</span>
                    <div className="size-3.5 rounded-full border-2 border-[#00d2ff] bg-[#020712] shadow-[0_0_8px_#00d2ff] group-hover:scale-125 transition-transform flex items-center justify-center">
                      <div className="size-1 rounded-full bg-[#00ffff]" />
                    </div>
                    <span className="text-[9px] text-slate-300 leading-tight mt-1 line-clamp-2 max-w-[54px]">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ③ 集团光伏建设进展 */}
          <div className="relative flex-1 rounded-xl border border-[#0e2a5c] bg-[#03091d]/90 p-2.5 shadow-lg shadow-black/50 flex flex-col justify-between overflow-hidden">
            {/* HUD 四角高光装饰 */}
            <div className="absolute top-0 left-0 size-2 border-t border-l border-[#00d2ff]" />
            <div className="absolute top-0 right-0 size-2 border-t border-r border-[#00d2ff]" />
            <div className="absolute bottom-0 left-0 size-2 border-b border-l border-[#00d2ff]" />
            <div className="absolute bottom-0 right-0 size-2 border-b border-r border-[#00d2ff]" />

            <div>
              <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1.5 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-linear-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                  <h2 className="text-xs font-bold text-slate-100 tracking-wider">集团光伏建设进展</h2>
                </div>
                <span className="text-[10.5px] text-[#00c2ff] hover:underline cursor-pointer flex items-center gap-0.5">
                  详情 <ChevronRight className="size-3" />
                </span>
              </div>

              {/* 光伏项目数据表格 */}
              <div className="w-full overflow-hidden text-[10.5px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#0f326e] text-slate-400 text-[9.5px] pb-1">
                      <th className="py-1 font-normal">园区名称</th>
                      <th className="py-1 font-normal">所属单位</th>
                      <th className="py-1 font-normal text-right">装机容量(MW)</th>
                      <th className="py-1 font-normal text-right">年发电量(万kWh)</th>
                      <th className="py-1 font-normal text-center">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0c2450]/80 text-slate-200">
                    {PV_PROJECTS.map((proj, idx) => (
                      <tr key={idx} className="hover:bg-[#071a40]/60 transition-colors">
                        <td className="py-1 font-medium truncate max-w-[95px]" title={proj.name}>
                          {proj.name}
                        </td>
                        <td className="py-1 text-slate-400 truncate max-w-[80px]">{proj.unit}</td>
                        <td className="py-1 text-right font-mono font-bold text-[#00c2ff]">{proj.mw}</td>
                        <td className="py-1 text-right font-mono text-emerald-400">{proj.kwh}</td>
                        <td className="py-1 text-center">
                          <span
                            className={cn(
                              'px-1.5 py-0.2 rounded text-[9px] font-bold inline-block',
                              proj.status === '运行中' && 'text-emerald-400 bg-emerald-950/60 border border-emerald-700/50',
                              proj.status === '建设中' && 'text-blue-400 bg-blue-950/60 border border-blue-700/50',
                              proj.status === '规划中' && 'text-slate-400 bg-slate-800/60 border border-slate-600/50'
                            )}
                          >
                            ● {proj.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 底部西安装备光伏实景轮播相片 */}
            <div className="relative rounded-lg overflow-hidden border border-[#0e2a5c] mt-1.5 group">
              <div className="relative h-20 w-full overflow-hidden">
                <Image
                  src="/images/screen/xian-pv-real.jpg"
                  alt="西安智能装备产业园区光伏项目"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                  <span className="text-[10px] text-white font-medium drop-shadow-md">
                    西安智能装备产业园光伏项目
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_4px_#00d2ff]" />
                    <span className="size-1.5 rounded-full bg-white/40" />
                    <span className="size-1.5 rounded-full bg-white/40" />
                    <span className="size-1.5 rounded-full bg-white/40" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ======================================================================= */}
        {/* 🗺️ 中央核心板块 (6列 / 12) */}
        {/* ======================================================================= */}
        <section className="col-span-6 flex flex-col gap-2.5 overflow-hidden relative">
          
          {/* ① 中央顶部 4 大核心 KPI 仪表卡 */}
          <div className="grid grid-cols-4 gap-2 shrink-0">
            {/* 集团整体光伏装机容量 */}
            <div className="relative rounded-xl border border-[#0e2a5c] bg-linear-to-b from-[#06183a]/90 to-[#020a1c]/90 p-2.5 shadow-lg shadow-black/40 flex items-center gap-2.5 overflow-hidden">
              <div className="absolute top-0 left-0 size-1.5 border-t border-l border-amber-400" />
              <div className="size-9 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                <Sun className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block truncate">集团整体光伏装机容量</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-amber-400">256.8</span>
                  <span className="text-xs font-bold text-amber-200/70 font-mono">MW</span>
                </div>
              </div>
            </div>

            {/* 非化石能源消费占比 */}
            <div className="relative rounded-xl border border-[#0e2a5c] bg-linear-to-b from-[#06183a]/90 to-[#020a1c]/90 p-2.5 shadow-lg shadow-black/40 flex items-center gap-2.5 overflow-hidden">
              <div className="absolute top-0 left-0 size-1.5 border-t border-l border-cyan-400" />
              <div className="size-9 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                <Leaf className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block truncate">非化石能源消费占比</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-cyan-400">48.6</span>
                  <span className="text-xs font-bold text-cyan-200/70 font-mono">%</span>
                </div>
              </div>
            </div>

            {/* 单位能耗碳排放 */}
            <div className="relative rounded-xl border border-[#0e2a5c] bg-linear-to-b from-[#06183a]/90 to-[#020a1c]/90 p-2.5 shadow-lg shadow-black/40 flex items-center gap-2.5 overflow-hidden">
              <div className="absolute top-0 left-0 size-1.5 border-t border-l border-emerald-400" />
              <div className="size-9 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                <span className="text-[11px] font-black font-mono">CO₂</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block truncate">单位能耗碳排放</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-emerald-400">0.356</span>
                  <span className="text-[10px] text-emerald-200/70 font-mono">tCO₂/tce</span>
                </div>
              </div>
            </div>

            {/* 单位工业增加值碳排放 */}
            <div className="relative rounded-xl border border-[#0e2a5c] bg-linear-to-b from-[#06183a]/90 to-[#020a1c]/90 p-2.5 shadow-lg shadow-black/40 flex items-center gap-2.5 overflow-hidden">
              <div className="absolute top-0 left-0 size-1.5 border-t border-l border-blue-400" />
              <div className="size-9 rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.25)]">
                <TrendingUp className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block truncate">单位工业增加值碳排放</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-blue-400">0.182</span>
                  <span className="text-[10px] text-blue-200/70 font-mono">tCO₂/万元</span>
                </div>
              </div>
            </div>
          </div>

          {/* ② 中国 3D 数字科技三维浮雕地图主展示区 (已移除外边框与角标，画面自然融入) */}
          <div className="relative flex-1 rounded-xl bg-transparent overflow-hidden flex flex-col">

            {/* 3D 中国数字科技立体地图容器 */}
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
              {/* 3D 高保真浮雕地图底图素材 */}
              <Image
                src="/images/screen/china-3d-map.jpg"
                alt="中国3D数字科技地图"
                fill
                priority
                className="object-cover object-center select-none pointer-events-none"
              />

              {/* 科技光栅暗角 */}
              <div className="absolute inset-0 bg-radial from-transparent via-[#020817]/10 to-[#020817]/40 pointer-events-none" />

              {/* SVG 科技青色折线引线层 */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                viewBox="0 0 1000 650"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {popupVisible && (
                  <g filter="url(#cyanGlow)">
                    {/* 发光折线引线 */}
                    <path
                      d={leaderLine.path}
                      fill="none"
                      stroke="#00ffff"
                      strokeWidth="2"
                      strokeDasharray="6 3"
                      className="animate-pulse"
                    />
                    {/* 折点科技圆点 */}
                    <circle cx={leaderLine.elbowX} cy={leaderLine.elbowY} r="3" fill="#00ffff" />
                    {/* 卡片连接端点 */}
                    <circle cx={leaderLine.anchorX} cy={leaderLine.anchorY} r="4" fill="#ffffff" stroke="#00ffff" strokeWidth="2" />
                  </g>
                )}
              </svg>

              {/* 3D 空间立体标记打点 */}
              {PARK_MARKERS.map((p) => {
                const isSelected = p.id === selectedParkId
                const fill = getMarkerFill(p.greenRatio)

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedParkId(p.id)
                      setPopupVisible(true)
                    }}
                    style={{
                      left: p.pos.left,
                      top: p.pos.top,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute z-25 cursor-pointer group flex flex-col items-center"
                  >
                    {/* 南京智能电气产业园 或 选中项：高能脉冲雷达焦点圈 */}
                    {isSelected ? (
                      <div className="relative flex items-center justify-center">
                        {/* 脉冲涟漪环 1 */}
                        <div
                          className="absolute size-14 rounded-full animate-ping opacity-60 pointer-events-none"
                          style={{ backgroundColor: fill }}
                        />
                        {/* 脉冲涟漪环 2 */}
                        <div
                          className="absolute size-20 rounded-full border border-cyan-400/40 animate-pulse pointer-events-none"
                        />
                        {/* 360° 旋转科技雷达准星外圈 */}
                        <div
                          className="absolute size-16 rounded-full border border-dashed border-[#00ffff] animate-spin pointer-events-none"
                          style={{ animationDuration: '8s' }}
                        />
                        {/* 准星四角卡扣 */}
                        <div className="absolute -top-1 -left-1 size-2 border-t-2 border-l-2 border-[#00ffff]" />
                        <div className="absolute -top-1 -right-1 size-2 border-t-2 border-r-2 border-[#00ffff]" />
                        <div className="absolute -bottom-1 -left-1 size-2 border-b-2 border-l-2 border-[#00ffff]" />
                        <div className="absolute -bottom-1 -right-1 size-2 border-b-2 border-r-2 border-[#00ffff]" />

                        {/* 核心高光立体圆点 */}
                        <div
                          className="size-4.5 rounded-full border-2 border-white flex items-center justify-center transition-transform group-hover:scale-125 shadow-lg"
                          style={{
                            backgroundColor: fill,
                            boxShadow: '0 0 16px ' + fill + ', 0 0 6px #ffffff',
                          }}
                        />
                      </div>
                    ) : (
                      /* 普通点位呼吸光晕 */
                      <div className="relative flex items-center justify-center">
                        <div
                          className="size-7 rounded-full animate-pulse opacity-35 pointer-events-none"
                          style={{ backgroundColor: fill }}
                        />
                        <div
                          className="absolute size-3.5 rounded-full border border-white/80 transition-transform group-hover:scale-125 shadow-md"
                          style={{
                            backgroundColor: fill,
                            boxShadow: '0 0 10px ' + fill,
                          }}
                        />
                      </div>
                    )}

                    {/* 园区名称文字标签 */}
                    <div
                      className={cn(
                        'mt-1 px-1.5 py-0.5 rounded text-[9px] whitespace-nowrap backdrop-blur-xs transition-all shadow-md',
                        isSelected
                          ? 'bg-[#020b1f]/95 border border-[#00ffff] text-[#00ffff] font-bold shadow-[0_0_12px_rgba(0,255,255,0.6)] scale-105'
                          : 'bg-black/75 border border-[#103673] text-slate-200 group-hover:text-white group-hover:border-[#00c2ff]'
                      )}
                    >
                      {p.shortName}
                    </div>
                  </div>
                )
              })}

              {/* 地图左下角双重图例 */}
              <div className="absolute left-3 bottom-3 rounded-lg border border-[#0e2a5c] bg-[#030c22]/90 backdrop-blur-md p-2 text-[9.5px] space-y-1.5 shadow-lg z-25">
                {/* 绿电占比图例 */}
                <div>
                  <span className="text-slate-400 font-bold block mb-1">绿电占比</span>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
                      <span className="text-slate-300">&gt; 70%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]" />
                      <span className="text-slate-300">30% - 70%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316]" />
                      <span className="text-slate-300">&lt; 30%</span>
                    </div>
                  </div>
                </div>

                {/* 碳排放强度图例 */}
                <div className="border-t border-[#0e2a5c] pt-1">
                  <span className="text-slate-400 font-bold block mb-1">碳排放强度 (tCO₂/万元)</span>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                      <span className="size-2.5 rounded-full border border-slate-300 bg-slate-500/50" />
                      <span className="text-slate-300">&gt; 1.0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full border border-slate-300 bg-slate-500/50" />
                      <span className="text-slate-300">0.5 - 1.0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="size-1.5 rounded-full border border-slate-300 bg-slate-500/50" />
                      <span className="text-slate-300">&le; 0.5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 地图右下角南海诸岛微缩示意框 */}
              <div className="absolute right-3 bottom-3 w-16 h-20 rounded border border-[#0e2a5c] bg-[#030c22]/85 flex flex-col items-center justify-center p-1 text-[8px] text-slate-400 z-20">
                <span className="font-bold text-[8.5px] text-slate-300">南海诸岛</span>
                <span className="text-[7px] text-slate-500 mt-1">示意图</span>
              </div>

              {/* ③ 交互悬浮详情卡 (特变电工南京智能电气产业园 / 当前选中园区) */}
              {popupVisible && (
                <div className="absolute top-3 right-3 w-[295px] rounded-xl border border-[#00d2ff]/80 bg-[#020b1f]/95 backdrop-blur-md shadow-[0_0_30px_rgba(0,180,255,0.3)] p-2.5 z-30 animate-in fade-in zoom-in-95 select-none">
                  {/* 切角高光装饰 */}
                  <div className="absolute -top-px -left-px size-2 border-t-2 border-l-2 border-[#00ffff]" />
                  <div className="absolute -top-px -right-px size-2 border-t-2 border-r-2 border-[#00ffff]" />
                  <div className="absolute -bottom-px -left-px size-2 border-b-2 border-l-2 border-[#00ffff]" />
                  <div className="absolute -bottom-px -right-px size-2 border-b-2 border-r-2 border-[#00ffff]" />

                  {/* 顶部标题与关闭按钮 */}
                  <div className="flex items-start justify-between border-b border-[#0e2a5c] pb-1.5 mb-2">
                    <div>
                      <h3 className="text-xs font-bold text-[#00f0ff] tracking-wide flex items-center gap-1">
                        {selectedPark.name}
                      </h3>
                      <p className="text-[9.5px] text-slate-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3 text-red-400" />
                        {selectedPark.province} · {selectedPark.city}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPopupVisible(false)}
                      className="text-slate-400 hover:text-white p-0.5 cursor-pointer transition-colors"
                      title="关闭卡片"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>

                  {/* 园区实景航拍照片 */}
                  <div className="relative h-26 w-full rounded-lg overflow-hidden border border-[#0e2a5c] mb-2">
                    <Image
                      src="/images/screen/nanjing-park-pv.jpg"
                      alt={selectedPark.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 border border-[#00c2ff]/40 text-[8.5px] font-mono text-[#00c2ff]">
                      实景航拍
                    </div>
                  </div>

                  {/* 光伏建设情况指标子项 */}
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="flex items-center gap-1 text-[9.5px] text-[#00c2ff] font-bold border-l-2 border-[#00c2ff] pl-1.5">
                      <span>光伏建设情况</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 bg-[#051538]/80 p-2 rounded-lg border border-[#0e2a5c]">
                      <div>
                        <span className="text-[8.5px] text-slate-400 block">光伏建设规模</span>
                        <span className="font-mono font-black text-amber-400 text-xs">
                          {selectedPark.pvCapacityMw} <span className="text-[8.5px] font-normal text-slate-300">MW</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[8.5px] text-slate-400 block">变压器容量</span>
                        <span className="font-mono font-black text-[#00d2ff] text-xs">
                          {selectedPark.transformerMva} <span className="text-[8.5px] font-normal text-slate-300">MVA</span>
                        </span>
                      </div>
                      <div className="border-t border-[#0e2a5c]/80 pt-1">
                        <span className="text-[8.5px] text-slate-400 block">上年购电量</span>
                        <span className="font-mono font-bold text-slate-200 text-xs">
                          {selectedPark.lastYearBuyGwh} <span className="text-[8.5px] text-slate-400">亿kWh</span>
                        </span>
                      </div>
                      <div className="border-t border-[#0e2a5c]/80 pt-1">
                        <span className="text-[8.5px] text-slate-400 block">当年发电量(截至12月)</span>
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          {selectedPark.thisYearGenGwh} <span className="text-[8.5px] text-slate-400">亿kWh</span>
                        </span>
                      </div>
                      <div className="border-t border-[#0e2a5c]/80 pt-1">
                        <span className="text-[8.5px] text-slate-400 block">绿电占比</span>
                        <span className="font-mono font-bold text-[#00e5ff] text-xs">
                          {selectedPark.greenRatio} <span className="text-[8.5px] text-slate-400">%</span>
                        </span>
                      </div>
                      <div className="border-t border-[#0e2a5c]/80 pt-1">
                        <span className="text-[8.5px] text-slate-400 block">碳排放强度</span>
                        <span className="font-mono font-bold text-teal-300 text-xs">
                          {selectedPark.carbonIntensity} <span className="text-[8.5px] text-slate-400">tCO₂/万</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </section>

        {/* ======================================================================= */}
        {/* ➡️ 右侧板块 (3列 / 12) */}
        {/* ======================================================================= */}
        <section className="col-span-3 flex flex-col gap-2.5 overflow-hidden">
          
          {/* ① 园区下属工厂指标 */}
          <div className="relative flex-1 rounded-xl border border-[#0e2a5c] bg-[#03091d]/90 p-2.5 shadow-lg shadow-black/50 flex flex-col justify-between overflow-hidden">
            {/* HUD 四角高光装饰 */}
            <div className="absolute top-0 left-0 size-2 border-t border-l border-[#00d2ff]" />
            <div className="absolute top-0 right-0 size-2 border-t border-r border-[#00d2ff]" />
            <div className="absolute bottom-0 left-0 size-2 border-b border-l border-[#00d2ff]" />
            <div className="absolute bottom-0 right-0 size-2 border-b border-r border-[#00d2ff]" />

            <div>
              {/* 头部标题与园区切换下拉 */}
              <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1.5 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-linear-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                  <h2 className="text-xs font-bold text-slate-100 tracking-wider">园区下属工厂指标</h2>
                </div>
                
                {/* 园区快速下拉 */}
                <div className="relative">
                  <select
                    value={selectedParkDropdown}
                    onChange={(e) => {
                      const val = e.target.value
                      setSelectedParkDropdown(val)
                      if (val.includes('南京')) setSelectedParkId('nanjing')
                      else if (val.includes('西安')) setSelectedParkId('xian')
                      else if (val.includes('沈变')) setSelectedParkId('shenbian')
                      setPopupVisible(true)
                    }}
                    className="appearance-none bg-[#051538] border border-[#0e2a5c] text-[10px] text-slate-200 pl-2 pr-5 py-0.5 rounded cursor-pointer focus:outline-none focus:border-[#00d2ff]"
                  >
                    <option value="南京智能电气产业园">南京智能电气产业园</option>
                    <option value="西安西变智能装备产业园">西安西变智能装备产业园</option>
                    <option value="沈变集团本部园区">沈变集团本部园区</option>
                  </select>
                  <ChevronDown className="size-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 5 个下属工厂横向切换 Tab */}
              <div className="flex items-center gap-1 bg-[#020718] p-1 rounded-lg border border-[#0e2a5c] mb-2">
                {FACTORY_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFactoryTab(tab)}
                    className={cn(
                      'flex-1 py-1 text-[10px] font-bold rounded transition-all cursor-pointer truncate',
                      activeFactoryTab === tab
                        ? 'bg-[#0070e0] text-white shadow-[0_0_10px_rgba(0,112,224,0.6)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#06183a]'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-400 mb-2 font-mono">
                <span>更新时间: 2026-08-12 15:30</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  实时测算
                </span>
              </div>

              {/* 10 项精细化能碳指标矩阵 (5行 x 2列，100% 像素级匹配截图) */}
              <div className="grid grid-cols-2 gap-1.5">
                {/* 1. 综合能耗强度 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                  <div className="size-8 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                    <Flame className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 block truncate">综合能耗强度</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black font-mono text-amber-400">{factoryMetrics.energyTce}</span>
                      <span className="text-[9px] text-slate-400 font-mono">tce</span>
                    </div>
                  </div>
                </div>

                {/* 2. 总碳排放量 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                  <div className="size-8 rounded-full border border-cyan-500/40 bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.25)]">
                    <span className="text-[9px] font-mono font-bold">CO₂</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 block truncate">总碳排放量</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black font-mono text-cyan-300">{factoryMetrics.carbonTco2}</span>
                      <span className="text-[9px] text-slate-400 font-mono">tCO₂</span>
                    </div>
                  </div>
                </div>

                {/* 3. 非化石能源消费占比 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                  <div className="size-8 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.25)]">
                    <Leaf className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 block truncate">非化石能源消费占比</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black font-mono text-emerald-400">{factoryMetrics.nonFossilRatio}</span>
                      <span className="text-[9px] text-slate-400 font-mono">%</span>
                    </div>
                  </div>
                </div>

                {/* 4. 非化石能源电力消费 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                  <div className="size-8 rounded-full border border-sky-500/40 bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.25)]">
                    <Zap className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 block truncate">非化石能源电力消费</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black font-mono text-sky-300">{factoryMetrics.greenPowerRatio}</span>
                      <span className="text-[9px] text-slate-400 font-mono">%</span>
                    </div>
                  </div>
                </div>

                {/* 5. 单位产值能耗 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                  <div className="size-8 rounded-full border border-indigo-500/40 bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.25)]">
                    <Gauge className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 block truncate">单位产值能耗</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black font-mono text-indigo-300">{factoryMetrics.energyPerOutput}</span>
                      <span className="text-[9px] text-slate-400 font-mono">tce/万</span>
                    </div>
                  </div>
                </div>

                {/* 6. 单位产值碳排放 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                  <div className="size-8 rounded-full border border-teal-500/40 bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(45,212,191,0.25)]">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 block truncate">单位产值碳排放</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black font-mono text-teal-300">{factoryMetrics.carbonPerOutput}</span>
                      <span className="text-[9px] text-slate-400 font-mono">tCO₂/万</span>
                    </div>
                  </div>
                </div>

                {/* 7. 开展产品碳足迹分析占比 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                  <div className="size-8 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.25)]">
                    <Footprints className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 block truncate">开展产品碳足迹分析占比</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black font-mono text-emerald-400">{factoryMetrics.footprintRatio}</span>
                      <span className="text-[9px] text-slate-400 font-mono">%</span>
                    </div>
                  </div>
                </div>

                {/* 8. 单位工业增加值能耗 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                  <div className="size-8 rounded-full border border-blue-500/40 bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.25)]">
                    <TrendingUp className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 block truncate">单位工业增加值能耗</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black font-mono text-blue-300">{factoryMetrics.energyPerAddValue}</span>
                      <span className="text-[9px] text-slate-400 font-mono">tce/万</span>
                    </div>
                  </div>
                </div>

                {/* 9. 水资源消耗量 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                  <div className="size-8 rounded-full border border-sky-500/40 bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.25)]">
                    <Droplets className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 block truncate">水资源消耗量</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black font-mono text-sky-400">{factoryMetrics.waterWanM3}</span>
                      <span className="text-[9px] text-slate-400 font-mono">万m³</span>
                    </div>
                  </div>
                </div>

                {/* 10. 节能装备应用占比 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                  <div className="size-8 rounded-full border border-lime-500/40 bg-lime-500/15 text-lime-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(132,204,22,0.25)]">
                    <Cpu className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 block truncate">节能装备应用占比</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black font-mono text-lime-400">{factoryMetrics.savingEquipRatio}</span>
                      <span className="text-[9px] text-slate-400 font-mono">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ② 园区零碳运营平台 */}
            <div className="relative rounded-xl border border-[#0e2a5c] bg-[#03091d]/90 p-2.5 shadow-lg shadow-black/50 flex flex-col mt-2">
              {/* HUD 四角高光装饰 */}
              <div className="absolute top-0 left-0 size-2 border-t border-l border-[#00d2ff]" />
              <div className="absolute top-0 right-0 size-2 border-t border-r border-[#00d2ff]" />
              <div className="absolute bottom-0 left-0 size-2 border-b border-l border-[#00d2ff]" />
              <div className="absolute bottom-0 right-0 size-2 border-b border-r border-[#00d2ff]" />

              <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1.5 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-linear-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                  <h2 className="text-xs font-bold text-slate-100 tracking-wider">园区零碳运营平台</h2>
                </div>
                <Link
                  href="/zero-carbon/monitor/online/microgrid"
                  className="text-[10.5px] text-[#00c2ff] hover:underline flex items-center gap-0.5"
                >
                  进入平台 <ChevronRight className="size-3" />
                </Link>
              </div>

              {/* 16:9 展示视窗与数字孪生展示 */}
              <Link
                href="/zero-carbon/monitor/online/microgrid"
                className="relative aspect-16/9 w-full rounded-lg overflow-hidden border border-[#0e2a5c] group cursor-pointer block hover:border-[#00d2ff] transition-colors"
              >
                <Image
                  src="/images/screen/platform-16-9.jpg"
                  alt="园区零碳运营平台展示区"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 backdrop-blur-xs group-hover:border-[#00c2ff] transition-colors shadow-lg">
                    <span className="text-[10px] font-mono text-[#00c2ff] font-bold">16 : 9</span>
                    <span className="text-xs text-white font-bold mt-0.5 tracking-wider">园区零碳运营平台展示区</span>
                  </div>
                </div>
              </Link>
            </div>

          </div>

        </section>

      </main>

      {/* 底部微小科技发光装饰条 */}
      <footer className="relative z-40 h-1 bg-linear-to-r from-transparent via-[#0091ff]/70 to-transparent shadow-[0_0_8px_#0091ff]" />
    </div>
  )
}

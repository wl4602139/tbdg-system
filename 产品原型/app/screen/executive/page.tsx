'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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
  Monitor,
  Tv,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScreenChinaMap3D } from '@/components/screen/screen-china-map-3d'

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
    name: '特变电工东北输变电产业园',
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
    company: '沈阳变压器产业园',
  },
  {
    id: 'baobian',
    name: '特变电工京津冀智能科技产业园',
    shortName: '保定智能装备产业园',
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
    status: '建设中',
    company: '京津冀智能装备',
  },
  {
    id: 'tianbian',
    name: '特变电工天变低碳产业园',
    shortName: '天变产业园',
    province: '天津市',
    city: '天津市',
    coordinates: [117.2, 39.13],
    pos: { left: '71.5%', top: '38.5%' },
    greenRatio: 48.2,
    carbonIntensity: 0.38,
    pvCapacityMw: 21.5,
    transformerMva: 310,
    lastYearBuyGwh: 2.65,
    thisYearGenGwh: 1.95,
    status: '已认证',
    company: '天变变压器产业园',
  },
  {
    id: 'shuguang',
    name: '特变电工曙光电缆产业园',
    shortName: '曙光电缆产业园',
    province: '河北省',
    city: '邢台市',
    coordinates: [114.5, 37.07],
    pos: { left: '68.0%', top: '42.5%' },
    greenRatio: 39.6,
    carbonIntensity: 0.52,
    pvCapacityMw: 14.8,
    transformerMva: 220,
    lastYearBuyGwh: 1.85,
    thisYearGenGwh: 1.32,
    status: '规划中',
    company: '华北线缆产业园',
  },
  {
    id: 'xinjiang',
    name: '特变电工输变电产业园(新疆本部)',
    shortName: '新疆电装超高压产业园',
    province: '新疆',
    city: '昌吉市',
    coordinates: [86.8, 43.7],
    pos: { left: '23.5%', top: '39.5%' },
    greenRatio: 78.4,
    carbonIntensity: 0.22,
    pvCapacityMw: 45.0,
    transformerMva: 600,
    lastYearBuyGwh: 5.6,
    thisYearGenGwh: 4.82,
    status: '已认证',
    company: '特变电工超高压',
  },
  {
    id: 'xj_zhineng',
    name: '特变电工智能电气科技产业园',
    shortName: '新疆智能电气产业园',
    province: '新疆',
    city: '昌吉市',
    coordinates: [87.42, 44.12],
    pos: { left: '25.5%', top: '38.0%' },
    greenRatio: 72.5,
    carbonIntensity: 0.25,
    pvCapacityMw: 32.0,
    transformerMva: 420,
    lastYearBuyGwh: 3.8,
    thisYearGenGwh: 3.25,
    status: '已认证',
    company: '新疆智能电气',
  },
  {
    id: 'xj_xianlan',
    name: '特变电工新疆线缆科技产业园',
    shortName: '新疆线缆产业园',
    province: '新疆',
    city: '米东区',
    coordinates: [87.95, 44.42],
    pos: { left: '27.5%', top: '36.8%' },
    greenRatio: 65.8,
    carbonIntensity: 0.29,
    pvCapacityMw: 24.5,
    transformerMva: 350,
    lastYearBuyGwh: 2.9,
    thisYearGenGwh: 2.41,
    status: '已认证',
    company: '新疆线缆科技',
  },
  {
    id: 'xian',
    name: '特变电工西安智能装备产业园',
    shortName: '西变智能装备产业园',
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
    id: 'xian_gil',
    name: '特变电工西安GIL高新产业园',
    shortName: '西安GIL产业园',
    province: '陕西省',
    city: '西安高新区',
    coordinates: [108.35, 33.95],
    pos: { left: '53.0%', top: '53.0%' },
    greenRatio: 61.2,
    carbonIntensity: 0.31,
    pvCapacityMw: 16.5,
    transformerMva: 240,
    lastYearBuyGwh: 2.1,
    thisYearGenGwh: 1.72,
    status: '在建',
    company: '赛杰爱迪新材料',
  },
  {
    id: 'deyang',
    name: '特变电工(德阳)电缆产业园区',
    shortName: '德缆线缆产业园',
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
    name: '特变电工南方输变电产业园(衡变)',
    shortName: '衡变华中输配电产业园',
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
    company: '华中输配电产业园',
  },
  {
    id: 'yunji_5g',
    name: '特变电工云集5G科技产业园',
    shortName: '云集5G科技园',
    province: '湖南省',
    city: '衡阳市云集区',
    coordinates: [112.95, 26.45],
    pos: { left: '65.2%', top: '72.0%' },
    greenRatio: 76.5,
    carbonIntensity: 0.21,
    pvCapacityMw: 22.4,
    transformerMva: 360,
    lastYearBuyGwh: 2.8,
    thisYearGenGwh: 2.35,
    status: '已认证',
    company: '云集电气开关',
  },
  {
    id: 'changsha_energy',
    name: '特变电工湖南能源建设产业园',
    shortName: '湖南能源建设园',
    province: '湖南省',
    city: '长沙市',
    coordinates: [112.94, 28.23],
    pos: { left: '64.8%', top: '67.5%' },
    greenRatio: 69.4,
    carbonIntensity: 0.27,
    pvCapacityMw: 19.8,
    transformerMva: 290,
    lastYearBuyGwh: 2.45,
    thisYearGenGwh: 1.98,
    status: '规划中',
    company: '特能建智慧能源',
  },
  {
    id: 'lulan',
    name: '特变电工华东输变电科技产业园',
    shortName: '鲁缆线缆产业园',
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
    company: '华东电缆科技',
  },
  {
    id: 'nanfang',
    name: '特变电工南方输配电产业园(大湾区)',
    shortName: '大湾区南方产业园',
    province: '广东省',
    city: '广州市',
    coordinates: [113.26, 23.13],
    pos: { left: '66.8%', top: '81.2%' },
    greenRatio: 42.4,
    carbonIntensity: 0.52,
    pvCapacityMw: 17.5,
    transformerMva: 280,
    lastYearBuyGwh: 2.3,
    thisYearGenGwh: 1.75,
    status: '在建',
    company: '南方输配电产业园',
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

const FACTORY_METRICS_DATA: Record<
  string,
  {
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
  }
> = {
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

  // 分辨率模式: 16:9 标准大屏 (1920×1080 / 4K) vs 46:9 展厅超宽环幕 (5520×1080 / 长卷多联屏)
  const [resolutionMode, setResolutionMode] = useState<'16:9' | '46:9'>('16:9')
  const is46x9 = resolutionMode === '46:9'

  // 从 URL 或 localStorage 初始化分辨率偏好，或自动探测超宽视口
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const ratioParam = params.get('ratio')
      if (ratioParam === '46:9' || ratioParam === '46-9' || ratioParam === '46_9') {
        setResolutionMode('46:9')
        return
      } else if (ratioParam === '16:9' || ratioParam === '16-9' || ratioParam === '16_9') {
        setResolutionMode('16:9')
        return
      }

      const saved = localStorage.getItem('tbea_screen_ratio')
      if (saved === '46:9' || saved === '16:9') {
        setResolutionMode(saved)
        return
      }

      // 若当前显示设备宽高比大于 2.8，自动激活 46:9 展厅超宽环幕模式
      if (window.innerWidth / window.innerHeight > 2.8) {
        setResolutionMode('46:9')
      }
    } catch {}
  }, [])

  const handleSetResolution = (mode: '16:9' | '46:9') => {
    setResolutionMode(mode)
    try {
      localStorage.setItem('tbea_screen_ratio', mode)
      const url = new URL(window.location.href)
      url.searchParams.set('ratio', mode)
      window.history.replaceState({}, '', url.toString())
    } catch {}
  }

  // 园区联动选中处理（保持引用稳定）
  const handleSelectPark = useCallback((id: string) => {
    setSelectedParkId(id)
    const p = PARK_MARKERS.find((item) => item.id === id)
    if (p) {
      setSelectedParkDropdown(p.shortName)
    }
    setPopupVisible(true)
  }, [])

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

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#01040d] text-slate-100 font-sans overflow-hidden select-none flex items-center justify-center">
      {/* 大屏核心物理显示容器 (自适应 16:9 标准大屏 与 46:9 展厅超宽环幕) */}
      <div
        className={cn(
          'relative flex flex-col justify-between select-none transition-all duration-300',
          is46x9
            ? 'w-full aspect-[46/9] max-h-screen bg-[#020714] shadow-[0_0_60px_rgba(0,180,255,0.2)] border-y border-[#0e2a5c]/60 overflow-hidden'
            : 'w-full h-full bg-[#020714] overflow-hidden'
        )}
      >
        {/* 背景微弱科技网格与暗角 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,140,255,0.12),transparent_75%)]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,180,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.035) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* ========================================================================= */}
        {/* 🌟 1. 顶部科技 HUD 导航栏 */}
        {/* ========================================================================= */}
        <header
          className={cn(
            'relative z-30 shrink-0 flex items-center justify-between border-b border-[#0e2a5c]/80 bg-linear-to-b from-[#06183a]/90 to-[#020b1f]/90 backdrop-blur-md',
            is46x9 ? 'h-9 px-3.5' : 'h-13 px-5'
          )}
        >
          {/* 左侧：品牌标识与口号 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-black tracking-widest text-[#00f0ff] font-mono drop-shadow-[0_0_8px_#00c2ff]">
                TBEA
              </span>
              <span className={cn('font-bold text-white tracking-wider', is46x9 ? 'text-xs' : 'text-sm')}>特变电工</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-[#0e2a5c] text-slate-400">
              <span className={cn('tracking-widest font-mono text-slate-300', is46x9 ? 'text-[9.5px]' : 'text-xs')}>
                装备中国 装备世界
              </span>
            </div>

            <Link
              href="/zero-carbon"
              className={cn(
                'flex items-center gap-1 rounded border border-[#0091ff]/40 bg-[#0091ff]/10 hover:bg-[#0091ff]/20 text-[#00c2ff] transition-colors shadow-[0_0_10px_rgba(0,145,255,0.15)]',
                is46x9 ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
              )}
            >
              <ArrowLeft className={is46x9 ? 'size-3' : 'size-3.5'} />
              <span>返回系统</span>
            </Link>

            <Link
              href="/screen/control-center"
              className={cn(
                'flex items-center gap-1 rounded border border-[#00f0ff]/40 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] transition-colors shadow-[0_0_10px_rgba(0,240,255,0.15)]',
                is46x9 ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
              )}
            >
              <Monitor className={is46x9 ? 'size-3' : 'size-3.5'} />
              <span>16:9综合集控</span>
            </Link>
          </div>

          {/* 中央主标题科技 HUD 金属梯形外框 */}
          <div className="relative flex flex-col items-center justify-center">
            <div className={cn('relative flex flex-col items-center', is46x9 ? 'px-8 py-0.5' : 'px-12 py-1')}>
              {/* 科技金属切角与发光线条装饰 */}
              <div className="absolute inset-0 bg-linear-to-b from-[#0091ff]/25 via-[#0055aa]/15 to-transparent border-t-2 border-[#00e5ff] [clip-path:polygon(0_0,100%_0,88%_100%,12%_100%)] pointer-events-none" />
              <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-56 h-[2px] bg-linear-to-r from-transparent via-[#00ffff] to-transparent shadow-[0_0_15px_#00ffff]" />

              <h1
                className={cn(
                  'font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-white via-[#c7e5ff] to-[#00d2ff] drop-shadow-[0_2px_12px_rgba(0,210,255,0.5)]',
                  is46x9 ? 'text-base' : 'text-xl'
                )}
              >
                特变电装集团零碳园区集中监控中心
              </h1>
            </div>
            <span
              className={cn(
                'font-mono tracking-[0.35em] text-[#00c2ff]/90 font-bold uppercase',
                is46x9 ? 'text-[7.5px] -mt-0.5' : 'text-[9.5px] -mt-0.5'
              )}
            >
              GREEN ENERGY BETTER TOMORROW
            </span>
          </div>

          {/* 右侧：实时时钟 + 气象 + 分辨率切换 + 全屏操作 */}
          <div className="flex items-center gap-3.5 font-mono">
            <div className={cn('flex items-center gap-2 text-slate-300', is46x9 ? 'text-[10px]' : 'text-xs')}>
              <span className="text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                {currentTime}
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <CloudSun className={cn('text-amber-400', is46x9 ? 'size-3.5' : 'size-4')} />
                北京 28℃ 晴
              </span>
            </div>

            {/* 分辨率切换器 (16:9 标准大屏 vs 46:9 展厅超宽环幕) */}
            <div className="flex items-center rounded-lg border border-[#0e2a5c] bg-[#020b1f]/90 p-0.5 shadow-md">
              <button
                type="button"
                onClick={() => handleSetResolution('16:9')}
                className={cn(
                  'flex items-center gap-1 rounded transition-all cursor-pointer font-medium',
                  is46x9 ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]',
                  resolutionMode === '16:9'
                    ? 'bg-[#0070e0] text-white font-bold shadow-[0_0_8px_rgba(0,112,224,0.6)]'
                    : 'text-slate-400 hover:text-white'
                )}
                title="16:9 标准屏幕分辨率 (1920×1080 / 4K)"
              >
                <Monitor className={is46x9 ? 'size-2.5' : 'size-3'} />
                <span>16:9</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetResolution('46:9')}
                className={cn(
                  'flex items-center gap-1 rounded transition-all cursor-pointer font-medium',
                  is46x9 ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]',
                  resolutionMode === '46:9'
                    ? 'bg-[#0070e0] text-white font-bold shadow-[0_0_8px_rgba(0,112,224,0.6)]'
                    : 'text-slate-400 hover:text-white'
                )}
                title="46:9 展厅超宽环幕大屏 (长卷拼接多联屏)"
              >
                <Tv className={is46x9 ? 'size-2.5' : 'size-3'} />
                <span>46:9</span>
              </button>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className={cn(
                'flex items-center gap-1 rounded border border-[#0091ff]/40 bg-[#002456]/50 hover:bg-[#003882]/70 text-slate-200 transition-colors cursor-pointer',
                is46x9 ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
              )}
              title="全屏切换"
            >
              {isFullscreen ? (
                <Minimize2 className={is46x9 ? 'size-3' : 'size-3.5'} />
              ) : (
                <Maximize2 className={cn('text-[#00e5ff]', is46x9 ? 'size-3' : 'size-3.5')} />
              )}
              <span>{isFullscreen ? '还原' : '全屏'}</span>
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 🌟 2. 大屏主体三栏布局 (左 25% | 中 50% | 右 25%) */}
        {/* ========================================================================= */}
        <main
          className={cn(
            'relative z-10 flex-1 min-h-0 grid grid-cols-12 overflow-hidden',
            is46x9 ? 'gap-2 p-2' : 'gap-2.5 p-2.5'
          )}
        >
          {/* ======================================================================= */}
          {/* ⬅️ 左侧板块 (3列 / 12) */}
          {/* ======================================================================= */}
          <section className={cn('col-span-3 flex flex-col overflow-hidden', is46x9 ? 'gap-1.5' : 'gap-2.5')}>
            {/* ① 集团双碳总览 */}
            <div
              className={cn(
                'relative rounded-xl border border-[#0e2a5c] bg-[#03091d]/90 shadow-lg shadow-black/50 flex flex-col shrink-0',
                is46x9 ? 'p-1.5' : 'p-2.5'
              )}
            >
              <div className="absolute top-0 left-0 size-2 border-t border-l border-[#00d2ff]" />
              <div className="absolute top-0 right-0 size-2 border-t border-r border-[#00d2ff]" />
              <div className="absolute bottom-0 left-0 size-2 border-b border-l border-[#00d2ff]" />
              <div className="absolute bottom-0 right-0 size-2 border-b border-r border-[#00d2ff]" />

              <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-3 bg-linear-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                  <h2 className={cn('font-bold text-slate-100 tracking-wider', is46x9 ? 'text-[11px]' : 'text-xs')}>
                    集团战略总览
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {/* 绿色工厂数量 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c]">
                  <div
                    className={cn(
                      'relative rounded-full border-2 border-emerald-500/60 bg-emerald-950/50 shadow-[0_0_10px_rgba(16,185,129,0.35)] flex items-center justify-center shrink-0',
                      is46x9 ? 'size-7' : 'size-10'
                    )}
                  >
                    <Leaf className={cn('text-emerald-400', is46x9 ? 'size-3.5' : 'size-4.5')} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block truncate">绿色工厂数量</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={cn('font-black font-mono text-emerald-400', is46x9 ? 'text-base' : 'text-xl')}>
                        12
                      </span>
                      <span className="text-[9px] text-slate-400">个</span>
                    </div>
                  </div>
                </div>

                {/* 零碳工厂数量 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c]">
                  <div
                    className={cn(
                      'relative rounded-full border-2 border-cyan-500/60 bg-cyan-950/50 shadow-[0_0_10px_rgba(6,182,212,0.35)] flex items-center justify-center shrink-0',
                      is46x9 ? 'size-7' : 'size-10'
                    )}
                  >
                    <Award className={cn('text-cyan-400', is46x9 ? 'size-3.5' : 'size-4.5')} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block truncate">零碳工厂数量</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={cn('font-black font-mono text-cyan-400', is46x9 ? 'text-base' : 'text-xl')}>
                        3
                      </span>
                      <span className="text-[9px] text-slate-400">个</span>
                    </div>
                  </div>
                </div>

                {/* 零碳认证数量 */}
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#051538]/70 border border-[#0e2a5c]">
                  <div
                    className={cn(
                      'relative rounded-full border-2 border-blue-500/60 bg-blue-950/50 shadow-[0_0_10px_rgba(59,130,246,0.35)] flex items-center justify-center shrink-0',
                      is46x9 ? 'size-7' : 'size-10'
                    )}
                  >
                    <ShieldCheck className={cn('text-blue-400', is46x9 ? 'size-3.5' : 'size-4.5')} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block truncate">零碳产业园区</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={cn('font-black font-mono text-blue-400', is46x9 ? 'text-base' : 'text-xl')}>
                        15
                      </span>
                      <span className="text-[9px] text-slate-400">个</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ② 绿色发展大事记 */}
            <div
              className={cn(
                'relative rounded-xl border border-[#0e2a5c] bg-[#03091d]/90 shadow-lg shadow-black/50 flex flex-col shrink-0',
                is46x9 ? 'p-1.5' : 'p-2.5'
              )}
            >
              <div className="absolute top-0 left-0 size-2 border-t border-l border-[#00d2ff]" />
              <div className="absolute top-0 right-0 size-2 border-t border-r border-[#00d2ff]" />
              <div className="absolute bottom-0 left-0 size-2 border-b border-l border-[#00d2ff]" />
              <div className="absolute bottom-0 right-0 size-2 border-b border-r border-[#00d2ff]" />

              <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-3 bg-linear-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                  <h2 className={cn('font-bold text-slate-100 tracking-wider', is46x9 ? 'text-[11px]' : 'text-xs')}>
                    绿色发展大事记
                  </h2>
                </div>
              </div>

              {/* 横向 6 节点时间轴 */}
              <div className="relative pt-1 pb-0.5">
                <div className="absolute top-3 left-3 right-3 h-[2px] bg-linear-to-r from-[#004cd8] via-[#00f0ff] to-[#004cd8]/40" />
                <div className="grid grid-cols-6 gap-1 relative z-10 text-center">
                  {MILESTONES.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center group cursor-default">
                      <div className="size-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00ffff] border border-white group-hover:scale-125 transition-transform" />
                      <span className="font-mono text-[8px] text-cyan-300 font-bold mt-1 scale-95">{item.date}</span>
                      <span className="text-[8.5px] text-slate-300 leading-tight mt-0.5 line-clamp-2 px-0.5">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ③ 集团光伏建设进展表格 + 轮播实景 */}
            <div
              className={cn(
                'relative flex-1 rounded-xl border border-[#0e2a5c] bg-[#03091d]/90 shadow-lg shadow-black/50 flex flex-col justify-between overflow-hidden',
                is46x9 ? 'p-1.5' : 'p-2.5'
              )}
            >
              <div className="absolute top-0 left-0 size-2 border-t border-l border-[#00d2ff]" />
              <div className="absolute top-0 right-0 size-2 border-t border-r border-[#00d2ff]" />
              <div className="absolute bottom-0 left-0 size-2 border-b border-l border-[#00d2ff]" />
              <div className="absolute bottom-0 right-0 size-2 border-b border-r border-[#00d2ff]" />

              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-3 bg-linear-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                    <h2 className={cn('font-bold text-slate-100 tracking-wider', is46x9 ? 'text-[11px]' : 'text-xs')}>
                      集团光伏建设进展
                    </h2>
                  </div>
                  <span className="text-[9px] text-[#00c2ff] hover:underline cursor-pointer flex items-center gap-0.5">
                    更多 <ChevronRight className="size-2.5" />
                  </span>
                </div>

                {/* 数据表格 */}
                <div className="overflow-x-auto flex-1 min-h-0">
                  <table className="w-full text-left text-[9.5px]">
                    <thead>
                      <tr className="border-b border-[#0e2a5c] text-slate-400 font-medium">
                        <th className="py-1">园区名称</th>
                        <th className="py-1">所属单位</th>
                        <th className="py-1 text-right">装机(MW)</th>
                        <th className="py-1 text-right">年发电(万kWh)</th>
                        <th className="py-1 text-center">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0e2a5c]/40 font-mono">
                      {PV_PROJECTS.map((proj, idx) => (
                        <tr
                          key={idx}
                          className={cn(
                            'hover:bg-[#071a40]/60 transition-colors',
                            is46x9 ? 'h-[26px]' : 'h-[44px]'
                          )}
                        >
                          <td className="py-0.5 font-medium truncate max-w-[95px]" title={proj.name}>
                            {proj.name}
                          </td>
                          <td className="py-0.5 text-slate-400 truncate max-w-[80px]">{proj.unit}</td>
                          <td className="py-0.5 text-right font-mono font-bold text-[#00c2ff]">{proj.mw}</td>
                          <td className="py-0.5 text-right font-mono text-emerald-400">{proj.kwh}</td>
                          <td className="py-0.5 text-center">
                            <span
                              className={cn(
                                'px-1.5 py-0.2 rounded text-[8.5px] font-bold inline-block',
                                proj.status === '运行中' &&
                                  'text-emerald-400 bg-emerald-950/60 border border-emerald-700/50',
                                proj.status === '建设中' &&
                                  'text-blue-400 bg-blue-950/60 border border-blue-700/50',
                                proj.status === '规划中' &&
                                  'text-slate-400 bg-slate-800/60 border border-slate-600/50'
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
              <div className="relative rounded-lg overflow-hidden border border-[#0e2a5c] mt-1 shrink-0 group">
                <div className={cn('relative w-full overflow-hidden', is46x9 ? 'h-13' : 'h-18')}>
                  <Image
                    src="/images/screen/xian-pv-real.jpg"
                    alt="西安智能装备产业园区光伏项目"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between">
                    <span className="text-[9px] text-white font-medium drop-shadow-md">
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
          <section className={cn('col-span-6 flex flex-col overflow-hidden relative', is46x9 ? 'gap-1.5' : 'gap-2.5')}>
            {/* ① 中央顶部 4 大核心 KPI 仪表卡 */}
            <div className={cn('grid grid-cols-4 shrink-0', is46x9 ? 'gap-1.5' : 'gap-2')}>
              {/* 集团整体光伏装机容量 */}
              <div
                className={cn(
                  'relative rounded-xl border border-[#0e2a5c] bg-linear-to-b from-[#06183a]/90 to-[#020a1c]/90 shadow-lg shadow-black/40 flex items-center overflow-hidden',
                  is46x9 ? 'p-1.5 gap-2' : 'p-2.5 gap-2.5'
                )}
              >
                <div className="absolute top-0 left-0 size-1.5 border-t border-l border-amber-400" />
                <div
                  className={cn(
                    'rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.25)]',
                    is46x9 ? 'size-7' : 'size-9'
                  )}
                >
                  <Sun className={is46x9 ? 'size-4' : 'size-5'} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] text-slate-400 block truncate">集团整体光伏装机容量</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className={cn('font-black font-mono text-amber-400', is46x9 ? 'text-base' : 'text-xl')}>
                      256.8
                    </span>
                    <span className="text-[9px] font-bold text-amber-200/70 font-mono">MW</span>
                  </div>
                </div>
              </div>

              {/* 非化石能源消费占比 */}
              <div
                className={cn(
                  'relative rounded-xl border border-[#0e2a5c] bg-linear-to-b from-[#06183a]/90 to-[#020a1c]/90 shadow-lg shadow-black/40 flex items-center overflow-hidden',
                  is46x9 ? 'p-1.5 gap-2' : 'p-2.5 gap-2.5'
                )}
              >
                <div className="absolute top-0 left-0 size-1.5 border-t border-l border-cyan-400" />
                <div
                  className={cn(
                    'rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.25)]',
                    is46x9 ? 'size-7' : 'size-9'
                  )}
                >
                  <Leaf className={is46x9 ? 'size-4' : 'size-5'} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] text-slate-400 block truncate">非化石能源消费占比</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className={cn('font-black font-mono text-cyan-400', is46x9 ? 'text-base' : 'text-xl')}>
                      48.6
                    </span>
                    <span className="text-[9px] font-bold text-cyan-200/70 font-mono">%</span>
                  </div>
                </div>
              </div>

              {/* 单位能耗碳排放 */}
              <div
                className={cn(
                  'relative rounded-xl border border-[#0e2a5c] bg-linear-to-b from-[#06183a]/90 to-[#020a1c]/90 shadow-lg shadow-black/40 flex items-center overflow-hidden',
                  is46x9 ? 'p-1.5 gap-2' : 'p-2.5 gap-2.5'
                )}
              >
                <div className="absolute top-0 left-0 size-1.5 border-t border-l border-emerald-400" />
                <div
                  className={cn(
                    'rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.25)]',
                    is46x9 ? 'size-7' : 'size-9'
                  )}
                >
                  <span className="text-[10px] font-black font-mono">CO₂</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] text-slate-400 block truncate">单位能耗碳排放</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className={cn('font-black font-mono text-emerald-400', is46x9 ? 'text-base' : 'text-xl')}>
                      0.356
                    </span>
                    <span className="text-[8.5px] text-emerald-200/70 font-mono">tCO₂/tce</span>
                  </div>
                </div>
              </div>

              {/* 单位工业增加值碳排放 */}
              <div
                className={cn(
                  'relative rounded-xl border border-[#0e2a5c] bg-linear-to-b from-[#06183a]/90 to-[#020a1c]/90 shadow-lg shadow-black/40 flex items-center overflow-hidden',
                  is46x9 ? 'p-1.5 gap-2' : 'p-2.5 gap-2.5'
                )}
              >
                <div className="absolute top-0 left-0 size-1.5 border-t border-l border-blue-400" />
                <div
                  className={cn(
                    'rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.25)]',
                    is46x9 ? 'size-7' : 'size-9'
                  )}
                >
                  <TrendingUp className={is46x9 ? 'size-4' : 'size-5'} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] text-slate-400 block truncate">单位工业增加值碳排放</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className={cn('font-black font-mono text-blue-400', is46x9 ? 'text-base' : 'text-xl')}>
                      0.182
                    </span>
                    <span className="text-[8.5px] text-blue-200/70 font-mono">tCO₂/万</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ② 中国 3D WebGL 数字孪生立体地图主展示区 (常驻纯粹渲染，极速 60 FPS) */}
            <div className="relative flex-1 rounded-xl bg-transparent overflow-hidden flex flex-col">
              {/* 3D 中国数字科技立体地图容器 */}
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                {/* 🌟 WebGL 3D 数字孪生地图核心交互渲染层 (纯 3D 沉浸式数字孪生，常驻平滑无闪烁渲染) */}
                <ScreenChinaMap3D
                  parks={PARK_MARKERS}
                  selectedParkId={selectedParkId}
                  onSelectPark={handleSelectPark}
                  className="absolute inset-0 z-10"
                />

                {/* 科技光栅暗角 */}
                <div className="absolute inset-0 bg-radial from-transparent via-[#020817]/10 to-[#020817]/40 pointer-events-none z-15" />

                {/* 地图左下角双重图例 */}
                <div
                  className={cn(
                    'absolute left-3 bottom-3 rounded-lg border border-[#0e2a5c] bg-[#030c22]/90 backdrop-blur-md shadow-lg z-25',
                    is46x9 ? 'p-1.5 text-[8.5px] space-y-1' : 'p-2 text-[9.5px] space-y-1.5'
                  )}
                >
                  {/* 绿电占比图例 */}
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">绿电占比</span>
                    <div className="flex items-center gap-2">
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
                  <div className="border-t border-[#0e2a5c] pt-0.5">
                    <span className="text-slate-400 font-bold block mb-0.5">碳排放强度 (tCO₂/万元)</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="size-2 rounded-full border border-slate-300 bg-slate-500/50" />
                        <span className="text-slate-300">&gt; 1.0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="size-1.5 rounded-full border border-slate-300 bg-slate-500/50" />
                        <span className="text-slate-300">0.5 - 1.0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="size-1 rounded-full border border-slate-300 bg-slate-500/50" />
                        <span className="text-slate-300">&le; 0.5</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 地图右下角南海诸岛微缩示意框 */}
                <div
                  className={cn(
                    'absolute right-3 bottom-3 rounded border border-[#0e2a5c] bg-[#030c22]/85 flex flex-col items-center justify-center p-1 text-slate-400 z-20',
                    is46x9 ? 'w-13 h-16 text-[7.5px]' : 'w-16 h-20 text-[8px]'
                  )}
                >
                  <span className="font-bold text-slate-300">南海诸岛</span>
                  <span className="text-[7px] text-slate-500 mt-0.5">示意图</span>
                </div>

                {/* ③ 交互悬浮详情卡 (当前选中园区) */}
                {popupVisible && (
                  <div
                    className={cn(
                      'absolute top-3 right-3 rounded-xl border border-[#00d2ff]/80 bg-[#020b1f]/95 backdrop-blur-md shadow-[0_0_30px_rgba(0,180,255,0.3)] z-30 animate-in fade-in zoom-in-95 select-none',
                      is46x9 ? 'w-[245px] p-2' : 'w-[295px] p-2.5'
                    )}
                  >
                    <div className="absolute -top-px -left-px size-2 border-t-2 border-l-2 border-[#00ffff]" />
                    <div className="absolute -top-px -right-px size-2 border-t-2 border-r-2 border-[#00ffff]" />
                    <div className="absolute -bottom-px -left-px size-2 border-b-2 border-l-2 border-[#00ffff]" />
                    <div className="absolute -bottom-px -right-px size-2 border-b-2 border-r-2 border-[#00ffff]" />

                    {/* 顶部标题与关闭按钮 */}
                    <div className="flex items-start justify-between border-b border-[#0e2a5c] pb-1 mb-1.5">
                      <div>
                        <h3
                          className={cn(
                            'font-bold text-[#00f0ff] tracking-wide flex items-center gap-1',
                            is46x9 ? 'text-[11px]' : 'text-xs'
                          )}
                        >
                          {selectedPark.name}
                        </h3>
                        <p className="text-[9px] text-slate-300 flex items-center gap-1 mt-0.5">
                          <MapPin className="size-2.5 text-red-400" />
                          {selectedPark.province} · {selectedPark.city}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPopupVisible(false)}
                        className="text-slate-400 hover:text-white p-0.5 cursor-pointer transition-colors"
                        title="关闭卡片"
                      >
                        <X className="size-3" />
                      </button>
                    </div>

                    {/* 园区实景航拍照片 */}
                    <div
                      className={cn(
                        'relative w-full rounded-lg overflow-hidden border border-[#0e2a5c] mb-1.5',
                        is46x9 ? 'h-16' : 'h-24'
                      )}
                    >
                      <Image
                        src={
                          selectedPark.id === 'xian'
                            ? '/images/screen/xian-pv-real.jpg'
                            : '/images/screen/nanjing-park-pv.jpg'
                        }
                        alt={selectedPark.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-1 left-2 text-[8.5px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {selectedPark.status} · 数字化集控中
                      </span>
                    </div>

                    {/* 关键技术参数矩阵 (4格) */}
                    <div className="grid grid-cols-2 gap-1.5 bg-[#03112c]/80 p-1.5 rounded-lg border border-[#0e2a5c]/60">
                      <div>
                        <span className="text-[8px] text-slate-400 block">光伏装机容量</span>
                        <span className="font-mono font-bold text-amber-400 text-xs">
                          {selectedPark.pvCapacityMw} <span className="text-[8px] text-slate-400 font-normal">MW</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block">年买电量</span>
                        <span className="font-mono font-bold text-cyan-300 text-xs">
                          {selectedPark.lastYearBuyGwh} <span className="text-[8px] text-slate-400 font-normal">亿kWh</span>
                        </span>
                      </div>
                      <div className="border-t border-[#0e2a5c]/80 pt-1">
                        <span className="text-[8px] text-slate-400 block">绿电占比</span>
                        <span className="font-mono font-bold text-[#00e5ff] text-xs">
                          {selectedPark.greenRatio} <span className="text-[8px] text-slate-400 font-normal">%</span>
                        </span>
                      </div>
                      <div className="border-t border-[#0e2a5c]/80 pt-1">
                        <span className="text-[8px] text-slate-400 block">碳排放强度</span>
                        <span className="font-mono font-bold text-teal-300 text-xs">
                          {selectedPark.carbonIntensity} <span className="text-[8px] text-slate-400 font-normal">tCO₂/万</span>
                        </span>
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
          <section className={cn('col-span-3 flex flex-col overflow-hidden', is46x9 ? 'gap-1.5' : 'gap-2.5')}>
            {/* ① 园区下属工厂指标 */}
            <div
              className={cn(
                'relative flex-1 rounded-xl border border-[#0e2a5c] bg-[#03091d]/90 shadow-lg shadow-black/50 flex flex-col justify-between overflow-hidden',
                is46x9 ? 'p-1.5' : 'p-2.5'
              )}
            >
              <div className="absolute top-0 left-0 size-2 border-t border-l border-[#00d2ff]" />
              <div className="absolute top-0 right-0 size-2 border-t border-r border-[#00d2ff]" />
              <div className="absolute bottom-0 left-0 size-2 border-b border-l border-[#00d2ff]" />
              <div className="absolute bottom-0 right-0 size-2 border-b border-r border-[#00d2ff]" />

              <div className="flex flex-col flex-1 min-h-0">
                {/* 头部标题与园区切换下拉 */}
                <div className="flex items-center justify-between border-b border-[#0e2a5c] pb-1 mb-1.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-3 bg-linear-to-b from-[#00ffff] to-[#0070e0] rounded-xs shadow-[0_0_8px_#00e5ff]" />
                    <h2 className={cn('font-bold text-slate-100 tracking-wider', is46x9 ? 'text-[11px]' : 'text-xs')}>
                      园区下属工厂指标
                    </h2>
                  </div>

                  {/* 园区全量快速下拉选择器 */}
                  <div className="relative">
                    <select
                      value={selectedParkId}
                      onChange={(e) => {
                        const val = e.target.value
                        setSelectedParkId(val)
                        const p = PARK_MARKERS.find((item) => item.id === val)
                        if (p) setSelectedParkDropdown(p.shortName)
                        setPopupVisible(true)
                      }}
                      className="appearance-none bg-[#051538] border border-[#0e2a5c] text-[9.5px] text-slate-200 pl-2 pr-5 py-0.5 rounded cursor-pointer focus:outline-none focus:border-[#00d2ff]"
                    >
                      {PARK_MARKERS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.shortName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="size-2.5 text-slate-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 5 个下属工厂横向切换 Tab */}
                <div className="flex items-center gap-1 bg-[#020718] p-0.5 rounded-lg border border-[#0e2a5c] mb-1.5 shrink-0">
                  {FACTORY_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveFactoryTab(tab)}
                      className={cn(
                        'flex-1 py-0.5 text-[9px] font-bold rounded transition-all cursor-pointer truncate',
                        activeFactoryTab === tab
                          ? 'bg-[#0070e0] text-white shadow-[0_0_10px_rgba(0,112,224,0.6)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#06183a]'
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[8.5px] text-slate-400 mb-1.5 font-mono shrink-0">
                  <span>更新: 2026-08-12 15:30</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
                    实时测算
                  </span>
                </div>

                {/* 10 项精细化能碳指标矩阵 (5行 x 2列，自适应高度) */}
                <div
                  className={cn(
                    'grid gap-1.5 flex-1 min-h-0 overflow-y-auto',
                    is46x9 ? 'grid-cols-3' : 'grid-cols-2'
                  )}
                >
                  {/* 1. 综合能耗强度 */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                    <div
                      className={cn(
                        'rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.25)]',
                        is46x9 ? 'size-6' : 'size-7.5'
                      )}
                    >
                      <Flame className={is46x9 ? 'size-3' : 'size-3.5'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8px] text-slate-400 block truncate">综合能耗强度</span>
                      <span className={cn('font-mono font-black text-amber-400', is46x9 ? 'text-xs' : 'text-sm')}>
                        {factoryMetrics.energyTce}{' '}
                        <span className="text-[7.5px] text-slate-400 font-normal">tce</span>
                      </span>
                    </div>
                  </div>

                  {/* 2. 总碳排放量 */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                    <div
                      className={cn(
                        'rounded-full border border-teal-500/40 bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(20,184,166,0.25)]',
                        is46x9 ? 'size-6' : 'size-7.5'
                      )}
                    >
                      <Gauge className={is46x9 ? 'size-3' : 'size-3.5'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8px] text-slate-400 block truncate">总碳排放量</span>
                      <span className={cn('font-mono font-black text-teal-400', is46x9 ? 'text-xs' : 'text-sm')}>
                        {factoryMetrics.carbonTco2}{' '}
                        <span className="text-[7.5px] text-slate-400 font-normal">tCO₂</span>
                      </span>
                    </div>
                  </div>

                  {/* 3. 单位产品能耗 */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                    <div
                      className={cn(
                        'rounded-full border border-blue-500/40 bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.25)]',
                        is46x9 ? 'size-6' : 'size-7.5'
                      )}
                    >
                      <Cpu className={is46x9 ? 'size-3' : 'size-3.5'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8px] text-slate-400 block truncate">单位产品能耗</span>
                      <span className={cn('font-mono font-black text-blue-400', is46x9 ? 'text-xs' : 'text-sm')}>
                        {factoryMetrics.energyPerOutput}{' '}
                        <span className="text-[7.5px] text-slate-400 font-normal">tce/万</span>
                      </span>
                    </div>
                  </div>

                  {/* 4. 非化石能源消费占比 */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                    <div
                      className={cn(
                        'rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.25)]',
                        is46x9 ? 'size-6' : 'size-7.5'
                      )}
                    >
                      <Leaf className={is46x9 ? 'size-3' : 'size-3.5'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8px] text-slate-400 block truncate">非化石能源消费占比</span>
                      <span className={cn('font-mono font-black text-emerald-400', is46x9 ? 'text-xs' : 'text-sm')}>
                        {factoryMetrics.nonFossilRatio} <span className="text-[7.5px] text-slate-400 font-normal">%</span>
                      </span>
                    </div>
                  </div>

                  {/* 5. 非化石能源电力消费 */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                    <div
                      className={cn(
                        'rounded-full border border-cyan-500/40 bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.25)]',
                        is46x9 ? 'size-6' : 'size-7.5'
                      )}
                    >
                      <Zap className={is46x9 ? 'size-3' : 'size-3.5'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8px] text-slate-400 block truncate">非化石能源电力消费</span>
                      <span className={cn('font-mono font-black text-cyan-400', is46x9 ? 'text-xs' : 'text-sm')}>
                        {factoryMetrics.greenPowerRatio} <span className="text-[7.5px] text-slate-400 font-normal">%</span>
                      </span>
                    </div>
                  </div>

                  {/* 6. 单位工业增加值能耗 */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                    <div
                      className={cn(
                        'rounded-full border border-purple-500/40 bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.25)]',
                        is46x9 ? 'size-6' : 'size-7.5'
                      )}
                    >
                      <TrendingUp className={is46x9 ? 'size-3' : 'size-3.5'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8px] text-slate-400 block truncate">单位工业增加值能耗</span>
                      <span className={cn('font-mono font-black text-purple-400', is46x9 ? 'text-xs' : 'text-sm')}>
                        {factoryMetrics.energyPerAddValue}{' '}
                        <span className="text-[7.5px] text-slate-400 font-normal">tce/万</span>
                      </span>
                    </div>
                  </div>

                  {/* 7. 单位产品碳排放 */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                    <div
                      className={cn(
                        'rounded-full border border-teal-500/40 bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(20,184,166,0.25)]',
                        is46x9 ? 'size-6' : 'size-7.5'
                      )}
                    >
                      <Footprints className={is46x9 ? 'size-3' : 'size-3.5'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8px] text-slate-400 block truncate">单位产品碳排放</span>
                      <span className={cn('font-mono font-black text-teal-300', is46x9 ? 'text-xs' : 'text-sm')}>
                        {factoryMetrics.carbonPerOutput}{' '}
                        <span className="text-[7.5px] text-slate-400 font-normal">tCO₂/万</span>
                      </span>
                    </div>
                  </div>

                  {/* 8. 水资源消耗量 */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                    <div
                      className={cn(
                        'rounded-full border border-sky-500/40 bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.25)]',
                        is46x9 ? 'size-6' : 'size-7.5'
                      )}
                    >
                      <Droplets className={is46x9 ? 'size-3' : 'size-3.5'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8px] text-slate-400 block truncate">水资源消耗量</span>
                      <span className={cn('font-mono font-black text-sky-400', is46x9 ? 'text-xs' : 'text-sm')}>
                        {factoryMetrics.waterWanM3}{' '}
                        <span className="text-[7.5px] text-slate-400 font-normal">万m³</span>
                      </span>
                    </div>
                  </div>

                  {/* 9. 节能设备装机占比 */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors">
                    <div
                      className={cn(
                        'rounded-full border border-indigo-500/40 bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.25)]',
                        is46x9 ? 'size-6' : 'size-7.5'
                      )}
                    >
                      <Award className={is46x9 ? 'size-3' : 'size-3.5'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[8px] text-slate-400 block truncate">节能设备装机占比</span>
                      <span className={cn('font-mono font-black text-indigo-400', is46x9 ? 'text-xs' : 'text-sm')}>
                        {factoryMetrics.savingEquipRatio} <span className="text-[7.5px] text-slate-400 font-normal">%</span>
                      </span>
                    </div>
                  </div>

                  {/* 10. 开展产品碳足迹占比 */}
                  <div
                    className={cn(
                      'flex items-center gap-1.5 p-1 rounded-lg bg-[#051538]/70 border border-[#0e2a5c] hover:border-[#00c2ff]/40 transition-colors',
                      is46x9 ? 'col-span-3 justify-between px-2.5' : ''
                    )}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className={cn(
                          'rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.25)]',
                          is46x9 ? 'size-6' : 'size-7.5'
                        )}
                      >
                        <ShieldCheck className={is46x9 ? 'size-3' : 'size-3.5'} />
                      </div>
                      <span className="text-[8px] text-slate-400 block truncate">开展产品碳足迹占比</span>
                    </div>
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span className={cn('font-mono font-black text-emerald-400', is46x9 ? 'text-xs' : 'text-sm')}>
                        {factoryMetrics.footprintRatio}
                      </span>
                      <span className="text-[7.5px] text-slate-400 font-normal">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ② 园区零碳运营平台 (视窗预览) */}
              <div
                className={cn(
                  'relative rounded-lg overflow-hidden border border-[#0e2a5c] mt-1 shrink-0 group',
                  is46x9 ? 'h-15' : 'h-24'
                )}
              >
                <Image
                  src="/images/screen/wind-farm-bg.jpg"
                  alt="园区零碳运营平台"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-[10px] font-bold text-white tracking-widest drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]">
                    园区零碳运营平台展示区
                  </span>
                  <Link
                    href="/zero-carbon/monitor/online/microgrid"
                    className="mt-1 px-2.5 py-0.5 rounded bg-[#0070e0]/80 hover:bg-[#0070e0] text-white text-[9px] font-bold flex items-center gap-1 transition-colors shadow-lg"
                  >
                    <span>进入平台</span>
                    <ChevronRight className="size-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Globe2,
  Leaf,
  ArrowRight,
  LogOut,
  Settings,
  ChevronDown,
  Palette,
  Sun,
  Moon,
  Check,
} from 'lucide-react'

const entrances = [
  {
    key: 'zero-carbon',
    name: '零碳园区集控中心',
    badge: 'EMS',
    en: 'ZERO-CARBON PARK CONTROL CENTER',
    img: '/illustrations/zero-carbon.png',
    href: '/zero-carbon/monitor/indicator',
    btnText: '进入零碳园区集控中心',
    icon: Globe2,
    points: [
      '集团-经营单位-项目公司多级指标穿透管控',
      '工厂整体-核心产品-关键工序多维指标分类管理',
      '零碳指标集中监管&绿电运行在线监测',
      '能耗能效多维分析&零碳项目综合评估',
    ],
  },
  {
    key: 'carbon-footprint',
    name: '产品碳足迹集采中心',
    badge: 'PCF & LCA',
    en: 'PRODUCT CARBON FOOTPRINT CENTER',
    img: '/illustrations/carbon-footprint.png',
    href: '/carbon-footprint/cockpit',
    btnText: '进入产品碳足迹集采中心',
    icon: Leaf,
    points: [
      '产品碳足迹在线核算及快速认证',
      '碳足迹结果与实测数据的穿透管理',
      '构建电工装备产品碳足迹实景数据库',
      '应对CBAM知识库建设',
    ],
  },
]

export function PortalView() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  // 皮肤切换下拉框状态与监听
  const [skinDropdownOpen, setSkinDropdownOpen] = useState(false)
  const skinDropdownRef = useRef<HTMLDivElement>(null)
  const [currentSkin, setCurrentSkin] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    try {
      const savedSkin = localStorage.getItem('tbea-skin') as 'light' | 'dark' | null
      if (savedSkin === 'dark') {
        setCurrentSkin('dark')
        document.documentElement.classList.add('dark')
      } else {
        setCurrentSkin('light')
        document.documentElement.classList.remove('dark')
      }
    } catch {}
  }, [])

  const handleSkinChange = (skin: 'light' | 'dark') => {
    setCurrentSkin(skin)
    try {
      localStorage.setItem('tbea-skin', skin)
    } catch {}
    if (skin === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    setSkinDropdownOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
      if (skinDropdownRef.current && !skinDropdownRef.current.contains(e.target as Node)) {
        setSkinDropdownOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false)
        setSkinDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#edf3fa] to-[#e6eff9] flex flex-col justify-between overflow-x-hidden selection:bg-blue-100 selection:text-blue-700 font-sans">
      {/* 🌟 1. 高级纯净动态光晕背景（无点阵，清爽通透） */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 顶部蓝绿双中心柔和弥散光晕 */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-gradient-to-br from-blue-500/15 via-sky-400/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-[650px] h-[650px] bg-gradient-to-bl from-emerald-500/15 via-teal-400/10 to-transparent rounded-full blur-3xl" />
        
        {/* 中部能量交汇自然渐变 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-r from-blue-400/8 via-indigo-300/8 to-emerald-400/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[350px] bg-sky-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-emerald-200/20 rounded-full blur-2xl" />

        {/* 极简优雅的半透明科技光流 */}
        <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        <div className="absolute top-2/5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent" />
      </div>

      {/* 🌟 2. 顶部企业蓝品牌导航条 (玻璃拟态 + 呼吸光) */}
      <header className="relative z-30 h-16 bg-[#003eb3]/95 backdrop-blur-md border-b border-blue-800/80 px-6 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/95 rounded-lg px-2.5 py-1 flex items-center justify-center shadow-xs">
            <img src="/logo.png" alt="TBEA 特变电工" className="h-7 w-auto object-contain" />
          </div>
          <span className="font-extrabold text-base tracking-wide text-white drop-shadow-xs">
            特变电工电气装备集团能碳数字化运营平台
          </span>
        </div>

        {/* 右上角账号信息与下拉菜单 */}
        <div className="flex items-center gap-3">
          {/* 皮肤选择切换按钮与下拉浮层 */}
          <div className="relative" ref={skinDropdownRef}>
            <button
              type="button"
              onClick={() => setSkinDropdownOpen(!skinDropdownOpen)}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-colors cursor-pointer shrink-0"
              title="切换界面皮肤 (浅色 / 深色)"
              aria-label="界面皮肤切换"
            >
              <Palette className="size-4 text-blue-200" />
            </button>

            {skinDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0c1826] p-3 shadow-xl dark:shadow-2xl dark:shadow-black/60 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans text-slate-800 dark:text-slate-100">
                <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-100">
                  <Palette className="size-3.5 text-[#2C7CFF] dark:text-cyan-400" />
                  <span>界面皮肤风格</span>
                </div>

                <div className="space-y-2">
                  {/* 浅色商务版本 */}
                  <button
                    type="button"
                    onClick={() => handleSkinChange('light')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer group ${
                      currentSkin === 'light'
                        ? 'border-[#2C7CFF] bg-blue-50/60 ring-1 ring-[#2C7CFF]/30 dark:bg-blue-950/40 dark:border-blue-500'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700/70 dark:bg-slate-800/30 dark:hover:border-cyan-500/50 dark:hover:bg-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center shadow-xs text-amber-500 shrink-0">
                        <Sun className="size-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold transition-colors ${
                            currentSkin === 'light'
                              ? 'text-[#2C7CFF] dark:text-blue-400'
                              : 'text-slate-800 dark:text-slate-100 group-hover:text-[#2C7CFF] dark:group-hover:text-cyan-300'
                          }`}>
                            浅色商务
                          </span>
                          {currentSkin === 'light' && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#2C7CFF] text-white">当前</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">清新明亮 · 商务办公风格</p>
                      </div>
                    </div>
                    {currentSkin === 'light' && <Check className="size-4 text-[#2C7CFF]" />}
                  </button>

                  {/* 深色科技版本 */}
                  <button
                    type="button"
                    onClick={() => handleSkinChange('dark')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer group ${
                      currentSkin === 'dark'
                        ? 'border-[#2C7CFF] bg-slate-900 text-white ring-1 ring-[#2C7CFF]/50 dark:border-cyan-500 dark:bg-cyan-950/40 dark:ring-cyan-500/40'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700/70 dark:bg-slate-800/30 dark:hover:border-cyan-500/50 dark:hover:bg-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-[#0F172A] border border-blue-500/30 flex items-center justify-center shadow-xs text-cyan-400 shrink-0">
                        <Moon className="size-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold transition-colors ${
                            currentSkin === 'dark'
                              ? 'text-white'
                              : 'text-slate-800 dark:text-slate-100 group-hover:text-[#2C7CFF] dark:group-hover:text-cyan-300'
                          }`}>
                            深色科技
                          </span>
                          {currentSkin === 'dark' && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-500 text-slate-950">当前</span>
                          )}
                        </div>
                        <p className={`text-[11px] mt-0.5 ${currentSkin === 'dark' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>科技蓝调 · 集控大屏工业主题</p>
                      </div>
                    </div>
                    {currentSkin === 'dark' && <Check className="size-4 text-cyan-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/system?from=/"
            className="h-8 flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 px-3 text-xs font-medium text-white transition-colors shrink-0"
          >
            <Settings className="size-3.5 text-blue-200" />
            <span>系统管理</span>
          </Link>

          <div className="relative" ref={userDropdownRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="h-8 flex items-center gap-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-xs shadow-xs transition-colors cursor-pointer text-left group shrink-0"
              aria-label="用户中心与退出登录"
            >
              <div className="size-7 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                管
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-xs font-semibold text-white block">
                  管理员 (倪总)
                </span>
                <span className="text-[10px] text-blue-200/80 block">
                  特变电工电装集团
                </span>
              </div>
              <ChevronDown className={`size-3.5 text-blue-200 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 下拉浮层卡片：明确放置在用户信息正下方 */}
            {userDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-60 rounded-xl border border-[#DBE6EE] dark:border-slate-700/80 bg-white dark:bg-[#0c1826] p-2 shadow-xl dark:shadow-2xl dark:shadow-black/60 animate-in fade-in-0 zoom-in-95 text-slate-800 dark:text-slate-100">
                {/* 用户信息卡片头部 */}
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/70 mb-2">
                  <div className="size-9 rounded-full bg-[#2C7CFF] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    管
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">倪总</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2C7CFF] dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800/50">管理员</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">特变电工电装集团</p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">tbea_admin</p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <Link
                    href="/system?from=/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  >
                    <Settings className="size-3.5 text-[#2C7CFF]" />
                    <span>系统后台管理</span>
                  </Link>
                </div>

                <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

                {/* 🌟 退出登录按钮（明确放置在用户信息下方） */}
                <Link
                  href="/login"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="size-3.5" />
                  <span>退出登录</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🌟 3. 主体内容区 */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-4 flex-1 flex flex-col justify-center">
        {/* 头部标题与科技徽章 */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 shadow-xs backdrop-blur-xs">
            <span className="size-2 rounded-full bg-[#2C7CFF] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C7CFF] font-mono">
              TBEA DUAL-CENTER ENERGY & CARBON MANAGEMENT
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-3">
            <span>能碳管控</span>
            <span className="bg-gradient-to-r from-[#2C7CFF] via-indigo-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-xs">
              “双中心”
            </span>
            <span>运营平台</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-none mx-auto leading-relaxed md:whitespace-nowrap">
            能碳一体化运营服务特变电工电气装备产业以实测数据牵引各经营单位绿色低碳转型、构建应对市场绿色招采快速响应能力。
          </p>

          {/* 核心价值微标签 */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs pt-0.5">
            <span className="px-3 py-1 rounded-md bg-white/90 border border-slate-200 text-slate-700 shadow-2xs font-sans font-medium">
              🏭 国家零碳工厂对标
            </span>
            <span className="px-3 py-1 rounded-md bg-white/90 border border-slate-200 text-slate-700 shadow-2xs font-sans font-medium">
              🌿 产品碳足迹在线核算及认证
            </span>
            <span className="px-3 py-1 rounded-md bg-white/90 border border-slate-200 text-slate-700 shadow-2xs font-sans font-medium">
              ⚡ 产品能耗能效深度分析
            </span>
          </div>
        </div>

        {/* 🌟 4. 双中心核心大卡片 (3D 悬浮质感 + 顶部图示) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 lg:mt-5">
          {entrances.map((e) => {
            const isZeroCarbon = e.key === 'zero-carbon'
            return (
              <div
                key={e.key}
                className={`group relative rounded-2xl bg-white/95 backdrop-blur-md border border-[#e5e7eb] p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isZeroCarbon ? 'hover:border-[#2C7CFF]' : 'hover:border-emerald-600'
                }`}
              >
                {/* 顶部 3D 科技插图 */}
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-slate-200/80 bg-[#071019] shadow-inner">
                  <Image
                    src={e.img}
                    alt={`${e.name}示意图`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </div>

                {/* 标题栏与图标 */}
                <div className="relative mt-3.5 flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl border shadow-xs transition-transform duration-300 group-hover:scale-105 ${
                      isZeroCarbon
                        ? 'border-blue-200/80 bg-blue-50 text-[#2C7CFF]'
                        : 'border-emerald-200/80 bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    <e.icon className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        className={`text-lg font-extrabold text-slate-800 transition-colors ${
                          isZeroCarbon ? 'group-hover:text-[#2C7CFF]' : 'group-hover:text-emerald-600'
                        }`}
                      >
                        {e.name}
                      </h2>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          isZeroCarbon
                            ? 'bg-blue-100/80 border-blue-200 text-blue-800'
                            : 'bg-emerald-100/80 border-emerald-200 text-emerald-800'
                        }`}
                      >
                        {e.badge}
                      </span>
                    </div>
                    <p className="text-[11px] tracking-wider text-slate-500 font-mono mt-0.5">
                      {e.en}
                    </p>
                  </div>
                </div>

                {/* 描述信息列表 (4 项) */}
                <ul className="relative mt-3 space-y-1.5 text-xs">
                  {e.points.map((p) => (
                    <li
                      key={p}
                      className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs text-slate-700 font-medium transition-colors ${
                        isZeroCarbon ? 'hover:bg-blue-50/60' : 'hover:bg-emerald-50/60'
                      }`}
                    >
                      <span
                        className={`size-1.5 shrink-0 rounded-full ${
                          isZeroCarbon ? 'bg-[#2C7CFF]' : 'bg-emerald-600'
                        }`}
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                {/* 操作按键 */}
                <div className="relative mt-4">
                  <Link
                    href={e.href}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition-all group/btn shadow-md ${
                      isZeroCarbon
                        ? 'bg-gradient-to-r from-[#2C7CFF] to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30'
                    }`}
                  >
                    <span>{e.btnText}</span>
                    <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* 🌟 6. 底部标准版权栏 */}
      <footer className="relative z-20 h-11 border-t border-[#e5e7eb]/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between text-xs text-slate-500">
        <div>
          <span>© 2026 特变电工电气装备集团</span>
        </div>
        <div className="flex items-center gap-4">
          <span>原型版本：<strong className="text-slate-800 font-mono font-bold">v1.01 (TBEA Corporate Edition)</strong></span>
          <span>技术栈：Next.js 16 + React 19 + TypeScript</span>
        </div>
      </footer>
    </div>
  )
}


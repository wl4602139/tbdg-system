'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Globe2,
  Leaf,
  Settings,
  FileText,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Building2,
  User,
  ArrowUpRight,
  Sparkles,
  LayoutGrid,
  Bell,
  Search,
  Maximize2,
  HelpCircle,
} from 'lucide-react'
import { platformMeta, type PlatformKey, type NavItem } from '@/lib/nav-config'
import { orgTree } from '@/lib/org'
import { cn } from '@/lib/utils'

export function PlatformShell({
  platformKey,
  platform,
  children,
}: {
  platformKey?: PlatformKey
  platform?: PlatformKey
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const resolvedPlatformKey: PlatformKey =
    platformKey || platform || (pathname.startsWith('/carbon-footprint') ? 'carbon-footprint' : 'zero-carbon')

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    集中监管: true,
    能耗能效分析: true,
    碳管理: true,
    多维碳分析: true,
    实景数据库: true,
    CBAM专区: true,
  })

  const currentPlatform = platformMeta[resolvedPlatformKey] || platformMeta['zero-carbon']
  const otherPlatformKey: PlatformKey =
    resolvedPlatformKey === 'zero-carbon' ? 'carbon-footprint' : 'zero-carbon'
  const otherPlatform = platformMeta[otherPlatformKey]

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="h-screen bg-[#f0f2f5] flex flex-row overflow-hidden">
      {/* 1. 左侧特变电工企业深蓝侧边栏 (全高贯穿 100% Height - 标准左右布局) */}
      <aside
        className={cn(
          'bg-[#0958d9] text-white transition-all duration-300 flex flex-col h-screen shrink-0 z-30 select-none shadow-lg',
          sidebarOpen ? 'w-56' : 'w-16'
        )}
      >
        {/* 侧边栏最顶部官方品牌 LOGO（图2左上角：TBEA 特变电工 装备中国 · 装备世界） */}
        <div className="h-14 px-3 border-b border-blue-400/20 bg-[#003eb3] flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden w-full">
            <div className="bg-white rounded px-1.5 py-0.5 flex items-center justify-center shrink-0 shadow-xs">
              <img src="/logo.png" alt="TBEA 特变电工" className="h-5 w-auto object-contain" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-xs tracking-wider block text-white whitespace-nowrap">
                  TBEA 特变电工
                </span>
                <span className="text-[9px] text-blue-200 block scale-90 -ml-1 whitespace-nowrap">
                  装备中国 · 装备世界
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* 侧边栏当前平台标题标识 */}
        <div className="px-3 py-2 border-b border-blue-400/20 bg-[#0747b0] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="size-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            {sidebarOpen && (
              <span className="font-bold text-[11px] text-blue-100 truncate">
                {currentPlatform.name}
              </span>
            )}
          </div>
        </div>

        {/* 菜单列表 */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          {currentPlatform.nav.map((item) => {
            const Icon = item.icon
            const hasChildren = item.children && item.children.length > 0
            const isSubOpen = openSubMenus[item.title]
            const isDirectActive = pathname === item.href
            const isChildActive =
              hasChildren && item.children!.some((c) => pathname.startsWith(c.href))
            const isActive = isDirectActive || isChildActive

            if (!hasChildren) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all group my-0.5',
                    isActive
                      ? 'bg-[#1677ff] text-white font-bold shadow-xs'
                      : 'text-blue-100 hover:text-white hover:bg-blue-600/50'
                  )}
                  title={!sidebarOpen ? item.title : undefined}
                >
                  <Icon className="size-4 shrink-0 text-white" />
                  {sidebarOpen && <span className="truncate">{item.title}</span>}
                </Link>
              )
            }

            return (
              <div key={item.title} className="space-y-0.5">
                <button
                  onClick={() => toggleSubMenu(item.title)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group my-0.5',
                    isActive
                      ? 'bg-[#1677ff] text-white font-bold'
                      : 'text-blue-100 hover:text-white hover:bg-blue-600/50'
                  )}
                  title={!sidebarOpen ? item.title : undefined}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Icon className="size-4 shrink-0 text-white" />
                    {sidebarOpen && <span className="truncate">{item.title}</span>}
                  </div>
                  {sidebarOpen && (
                    <span className="p-0.5 text-blue-200">
                      {isSubOpen ? (
                        <ChevronDown className="size-3.5" />
                      ) : (
                        <ChevronRight className="size-3.5" />
                      )}
                    </span>
                  )}
                </button>

                {/* 子菜单 */}
                {sidebarOpen && isSubOpen && (
                  <div className="ml-4 pl-2 border-l border-blue-400/30 space-y-0.5 py-0.5">
                    {item.children!.map((child) => {
                      const isCActive = pathname === child.href
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'block px-2.5 py-1.5 rounded text-xs transition-colors',
                            isCActive
                              ? 'bg-white text-[#0958d9] font-bold shadow-xs'
                              : 'text-blue-100 hover:text-white hover:bg-blue-600/40'
                          )}
                        >
                          {child.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 侧边栏底部快速切换 */}
        {sidebarOpen && (
          <div className="p-2 border-t border-blue-400/20 bg-[#003eb3]/60">
            <Link
              href={otherPlatform.nav[0].href}
              className="flex items-center justify-between p-2 rounded bg-blue-700/50 hover:bg-blue-700 text-xs transition-all text-blue-100 hover:text-white"
            >
              <div className="flex items-center gap-1.5">
                <otherPlatform.icon className="size-3.5" />
                <span className="font-medium text-[11px]">切换至 {otherPlatform.short}</span>
              </div>
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        )}
      </aside>

      {/* 2. 右侧主体容器 (flex-col: 顶部主条 + 多标签页栏 + 滚动主内容区) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* 右侧顶部白色主导航条 */}
        <header className="h-14 border-b border-[#e5e7eb] bg-white px-4 flex items-center justify-between shrink-0 shadow-xs">
          {/* 左侧：折叠按钮 + 双中心切换胶囊 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="折叠/展开侧边栏"
            >
              <Menu className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800 tracking-wide">
                能碳管控“双中心”数字化集成平台
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-mono font-bold">
                v1.01
              </span>
            </div>

            {/* 双中心切换胶囊 */}
            <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 ml-3 text-xs">
              <Link
                href="/zero-carbon/screen"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all',
                  resolvedPlatformKey === 'zero-carbon'
                    ? 'bg-white text-[#1677ff] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Globe2 className="size-3.5 text-[#1677ff]" />
                零碳园区集控中心
              </Link>
              <Link
                href="/carbon-footprint/cockpit"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all',
                  resolvedPlatformKey === 'carbon-footprint'
                    ? 'bg-white text-[#1677ff] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Leaf className="size-3.5 text-emerald-600" />
                产品碳足迹集采中心
              </Link>
            </div>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-3">
            <Link
              href="/zero-carbon/assistant"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-[#1677ff] text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              <Sparkles className="size-3.5 animate-pulse text-[#1677ff]" />
              <span>AI 智能问数</span>
            </Link>

            <Link
              href="/docs"
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1"
              title="需求与架构规范文档"
            >
              <FileText className="size-4" />
              <span className="hidden xl:inline">开发手册</span>
            </Link>

            <Link
              href="/system"
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1"
              title="系统管理"
            >
              <Settings className="size-4" />
              <span className="hidden xl:inline">管理配置</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* 用户头像信息 */}
            <div className="flex items-center gap-2 pl-1">
              <div className="size-7 rounded-full bg-[#1677ff] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                管
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-slate-800 block leading-tight">
                  管理员 (倪总)
                </span>
                <span className="text-[10px] text-slate-400 block">
                  特变电工电装集团
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 主内容区 (滚动视口) */}
        <main className="flex-1 overflow-y-auto p-3.5 md:p-4 bg-[#f0f2f5]">
          {children}
        </main>
      </div>
    </div>
  )
}

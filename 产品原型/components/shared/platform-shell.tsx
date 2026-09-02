'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Search,
  Globe2,
  Leaf,
  FileText,
  Settings,
  X,
  Send,
  Bot,
  User,
  HelpCircle,
  TrendingDown,
  AlertTriangle,
  Check,
  Lightbulb,
} from 'lucide-react'
import { platformMeta, type PlatformKey } from '@/lib/nav-config'
import { cn } from '@/lib/utils'

interface ShellProps {
  children: React.ReactNode
  platformKey?: PlatformKey
  platform?: PlatformKey
}

export function PlatformShell({ children, platformKey, platform }: ShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({})

  // 双中心下拉框状态与监听
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // AI 悬浮窗口状态
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string; tag?: string }>>([
    {
      sender: 'ai',
      text: '您好！我是特变电工（电装集团）AI 能碳智能专家。您可以随时向我询问全集团 15 个园区与 21 家工厂的用能异动、碳排放对标、CBAM 关税核算或工艺降碳诊断。',
      time: '17:00',
      tag: '系统就绪',
    },
  ])

  // 根据当前路径或传入属性自动判断所属平台
  const actualPlatformKey = platformKey || platform
  const resolvedPlatformKey: PlatformKey =
    actualPlatformKey ||
    (pathname.startsWith('/carbon-footprint') ? 'carbon-footprint' : 'zero-carbon')

  const currentPlatform = platformMeta[resolvedPlatformKey]

  // 双中心下拉选项定义
  const centers = [
    {
      key: 'zero-carbon' as const,
      name: '零碳园区集控中心',
      shortName: '集控中心',
      desc: '微电网全景看板 · 47项关键制造工序能效 · 碳核算',
      href: '/zero-carbon/screen',
      icon: Globe2,
      activeColor: 'text-[#1677ff]',
      activeBg: 'bg-blue-50/90',
      activeBorder: 'border-blue-200',
      badgeBg: 'bg-blue-100/70 text-[#1677ff]',
      iconBg: 'bg-blue-100 text-[#1677ff]',
    },
    {
      key: 'carbon-footprint' as const,
      name: '产品碳足迹集采中心',
      shortName: '集采中心',
      desc: '生命周期LCA建模 · CBAM欧盟关税核算 · 因子库认证',
      href: '/carbon-footprint/cockpit',
      icon: Leaf,
      activeColor: 'text-emerald-600',
      activeBg: 'bg-emerald-50/90',
      activeBorder: 'border-emerald-200',
      badgeBg: 'bg-emerald-100/70 text-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
  ]

  const currentCenter = centers.find((c) => c.key === resolvedPlatformKey) || centers[0]
  const CurrentCenterIcon = currentCenter.icon

  // 🌟 核心导航路由高亮匹配逻辑 (兼容多Tab子路由、动态参数与哈希路由)
  const isNavActive = (currentPath: string, targetHref: string): boolean => {
    if (!currentPath || !targetHref) return false
    const cleanTarget = targetHref.split('#')[0].split('?')[0]

    // 1. 精确匹配
    if (currentPath === cleanTarget) return true

    // 2. 特殊业务多 Tab 子路由归属规则：
    // 【用能在线监测】包含「用能监测」(/usage) 与「设备监测」(/equipment) 两个子 Tab
    if (cleanTarget === '/zero-carbon/monitor/online/usage') {
      return (
        currentPath === '/zero-carbon/monitor/online' ||
        currentPath.startsWith('/zero-carbon/monitor/online/usage') ||
        currentPath.startsWith('/zero-carbon/monitor/online/equipment')
      )
    }

    // 【工业微电网监测】独立前缀匹配
    if (cleanTarget === '/zero-carbon/monitor/online/microgrid') {
      return currentPath.startsWith('/zero-carbon/monitor/online/microgrid')
    }

    // 3. 通用子路由深度前缀匹配 (如 /project/model/monitoring 匹配 /project/model)
    if (
      cleanTarget !== '/' &&
      cleanTarget !== '/zero-carbon' &&
      cleanTarget !== '/carbon-footprint' &&
      cleanTarget !== '/zero-carbon/screen' &&
      cleanTarget !== '/carbon-footprint/cockpit'
    ) {
      if (currentPath.startsWith(cleanTarget + '/')) return true
    }

    return false
  }

  // 当路径匹配子项时自动展开所属父菜单
  useEffect(() => {
    for (const item of currentPlatform.nav) {
      if (item.children?.some((c) => isNavActive(pathname, c.href))) {
        setOpenSubMenus((prev) => ({ ...prev, [item.title]: true }))
      }
    }
  }, [pathname, currentPlatform])

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const handleSendAi = (question?: string) => {
    const q = question || aiInput.trim()
    if (!q) return

    const userMsg = { sender: 'user' as const, text: q, time: new Date().toLocaleTimeString().slice(0, 5) }
    setMessages((prev) => [...prev, userMsg])
    if (!question) setAiInput('')

    // 模拟智能 AI 诊断回复
    setTimeout(() => {
      let reply = '正在检索特变电工能碳中枢实测数据流...'
      let tag = '智能诊断'

      if (q.includes('干燥') || q.includes('蒸汽') || q.includes('沈变')) {
        reply = '【AI 诊断分析】沈变本部 8 月份真空干燥车间万元产值能耗达到 0.89 tce/万 (标杆 0.60)，超标 +48.3%。经传感器微漏监测诊断：2号真空干燥罐温控疏水阀存在微漏，伴随保温层局部热散失，导致当月额外损耗蒸汽 180 吨 (超标费用约 12.8 万元)。建议：本周末排期更换疏水阀密封组件。'
        tag = '工序异动预警'
      } else if (q.includes('单耗') || q.includes('工厂') || q.includes('最高')) {
        reply = '【工厂 PK 分析】全集团 21 家制造工厂中，新变超高压公司 8 月份综合单耗最高 (1.58 tce/万kVA)，高于行业标杆 +31.6%，总能耗 1,520 tce，为重点监管单位；衡变本部表现最优 (1.18 tce/万kVA)，为集团低碳制造标杆工厂。'
        tag = '指标横向PK'
      } else if (q.includes('CBAM') || q.includes('出口') || q.includes('关税')) {
        reply = '【CBAM 合规评估】针对出口欧盟的 ODFS-334MVA/500kV 变压器 (HS: 8504.23.11)，衡变本部生产批次实测隐含碳强度为 1.18 tCO2/台，低于欧盟基准线 1.35 tCO2/台，预估碳关税为 €0 (享低碳免征优势)，并已支持一键导出标准 XML 申报包。'
        tag = '出海贸易合规'
      } else {
        reply = `已为您查询关于“${q}”的指标数据：当前全集团 15 园区综合绿电占比为 38.6%，总折标能耗同比下降 4.1%，整体达标态势良好。`
        tag = '数据检索'
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString().slice(0, 5),
          tag,
        },
      ])
    }, 400)
  }

  return (
    <div className="tech-grid flex min-h-screen bg-background font-sans antialiased text-foreground">
      {/* 1. 侧边导航 (深色半透毛玻璃科技蓝) */}
      <aside
        className={cn(
          'sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-md transition-[width] duration-300 z-30',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* 顶部特变电工官方 LOGO 品牌栏 */}
        <div className="flex items-center justify-between border-b border-sidebar-border px-3 py-4 shrink-0">
          <Link href="/" className={cn('flex items-center gap-2.5', !sidebarOpen && 'justify-center')} title="返回总览门户">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/15 text-sm font-bold text-primary">
              TBEA
            </div>
            {sidebarOpen && (
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">特变电工电装集团</p>
                <p className="text-[11px] text-muted-foreground">{currentPlatform.name}</p>
              </div>
            )}
          </Link>
          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              aria-label="收起导航"
            >
              <Menu className="size-4" />
            </button>
          )}
        </div>

        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="mx-auto mt-3 flex size-9 items-center justify-center rounded-md border border-border bg-panel text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground cursor-pointer"
            aria-label="展开导航"
          >
            <Menu className="size-4" />
          </button>
        )}

        {/* 平台切换 (展开态) */}
        {sidebarOpen && (
          <div className="relative px-3 py-3 shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-panel px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/50 cursor-pointer"
            >
              <span className="flex items-center gap-2 text-xs font-semibold">
                <CurrentCenterIcon className="size-4 text-primary" />
                {currentCenter.name}
              </span>
              <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', dropdownOpen && 'rotate-180')} />
            </button>
            {dropdownOpen && (
              <div className="absolute left-3 right-3 z-40 mt-1 rounded-xl border border-border bg-popover p-1 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95">
                {centers.map((center) => {
                  const isSelected = resolvedPlatformKey === center.key
                  const CenterIcon = center.icon
                  return (
                    <button
                      key={center.key}
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false)
                        if (!isSelected) router.push(center.href)
                      }}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-left transition-colors cursor-pointer',
                        isSelected ? 'bg-primary/15 font-bold text-primary' : 'text-popover-foreground hover:bg-accent'
                      )}
                    >
                      <CenterIcon className="size-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{center.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{center.desc}</div>
                      </div>
                      {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
                    </button>
                  )
                })}
                <div className="border-t border-border mt-1 pt-1">
                  <Link
                    href="/"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Globe2 className="size-4 text-primary" />
                    返回总览门户
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 菜单列表 */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <ul className="flex flex-col gap-1">
            {currentPlatform.nav.map((item) => {
              const Icon = item.icon
              const hasChildren = item.children && item.children.length > 0
              const isSubOpen = openSubMenus[item.title]
              const isDirectActive = isNavActive(pathname, item.href)
              const isChildActive = hasChildren && item.children!.some((c) => isNavActive(pathname, c.href))
              const isActive = isDirectActive || isChildActive

              if (!hasChildren) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={!sidebarOpen ? item.title : undefined}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-primary/15 font-medium text-primary'
                          : 'text-sidebar-foreground hover:bg-accent/50 hover:text-foreground',
                        !sidebarOpen && 'justify-center px-2'
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      {sidebarOpen && <span className="flex-1 text-xs truncate">{item.title}</span>}
                    </Link>
                  </li>
                )
              }

              return (
                <li key={item.title}>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => toggleSubMenu(item.title)}
                      className={cn(
                        'flex flex-1 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors text-left cursor-pointer',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-sidebar-foreground hover:bg-accent/50 hover:text-foreground',
                        !sidebarOpen && 'justify-center px-2'
                      )}
                      title={!sidebarOpen ? item.title : undefined}
                    >
                      <Icon className="size-4 shrink-0" />
                      {sidebarOpen && <span className="flex-1 text-xs truncate">{item.title}</span>}
                    </button>
                    {sidebarOpen && (
                      <button
                        type="button"
                        onClick={() => toggleSubMenu(item.title)}
                        className="ml-0.5 rounded p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="展开子菜单"
                      >
                        <ChevronRight className={cn('size-4 transition-transform', isSubOpen && 'rotate-90')} />
                      </button>
                    )}
                  </div>
                  {sidebarOpen && isSubOpen && (
                    <ul className="ml-6 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                      {item.children!.map((sub) => {
                        const isSubActive = isNavActive(pathname, sub.href)
                        return (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              className={cn(
                                'block rounded-md px-2.5 py-1.5 text-[12px] transition-colors',
                                isSubActive
                                  ? 'bg-primary/15 font-medium text-primary'
                                  : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                              )}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* 侧边栏底部版权 */}
        {sidebarOpen && (
          <div className="p-3 border-t border-sidebar-border bg-sidebar shrink-0">
            <div className="text-[10px] leading-4 text-muted-foreground font-sans">
              <div className="font-semibold text-foreground mb-0.5 whitespace-nowrap">特变电工（电装集团）能源双中心</div>
              <div className="whitespace-nowrap">© 2026 特变电工股份有限公司</div>
            </div>
          </div>
        )}
      </aside>

      {/* 2. 主区域 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶栏 */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm">
            <Globe2 className="size-4 text-primary" />
            <span className="text-muted-foreground font-medium">{currentPlatform.name}</span>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {currentPlatform.nav.find((n) => isNavActive(pathname, n.href))?.title || '业务工作台'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-panel px-3 py-1.5 text-sm text-muted-foreground lg:flex">
              <Search className="size-4" />
              <input
                placeholder="搜索功能 / 单位 / 指标"
                className="w-40 bg-transparent outline-none placeholder:text-muted-foreground text-foreground text-xs"
              />
            </div>
            <Link
              href="/zero-carbon/alarm"
              className="relative rounded-md border border-border bg-panel p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="告警通知"
            >
              <AlertTriangle className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--destructive)]" />
            </Link>
            <Link
              href={`/system?from=${encodeURIComponent(pathname)}`}
              className="flex items-center gap-2 rounded-md border border-border bg-panel px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/50"
            >
              <Settings className="size-3.5 text-primary" />
              系统管理
            </Link>
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary/15 text-xs font-semibold text-primary">
                管
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-medium text-foreground">管理员 (倪总)</p>
                <p className="text-[10px] text-muted-foreground">特变电工电装集团</p>
              </div>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative">{children}</main>
      </div>

      {/* 3. 页面右下角 AI 助手悬浮窗 (深色毛玻璃科技风) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-none">
        {isAiOpen && (
          <div className="w-96 sm:w-[420px] h-[520px] bg-popover/95 rounded-2xl shadow-2xl border border-border backdrop-blur-md mb-3 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 pointer-events-auto">
            {/* 窗口头部 */}
            <div className="bg-panel border-b border-border p-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Sparkles className="size-4 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    特变电工 AI 能碳智能专家
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold px-1.5 py-0.2 rounded-full">
                      在线
                    </span>
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    基于集团 15 园区与 21 工厂实时中枢大模型
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                title="关闭窗口"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 消息滚动区 */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-background/50 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex flex-col gap-1',
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                    <span>{m.sender === 'user' ? '您' : 'AI 智能专家'}</span>
                    <span>·</span>
                    <span>{m.time}</span>
                    {m.tag && (
                      <span className="ml-1 px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      'p-3 rounded-xl max-w-[90%] leading-relaxed border',
                      m.sender === 'user'
                        ? 'bg-primary text-primary-foreground border-primary rounded-br-none shadow-sm'
                        : 'bg-card text-card-foreground border-border rounded-bl-none shadow-sm'
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* 快捷推荐提问 */}
            <div className="p-2 bg-panel border-t border-border shrink-0">
              <span className="text-[10px] font-bold text-muted-foreground block px-1 mb-1">
                💡 猜您想问：
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <button
                  onClick={() => handleSendAi('沈变本部真空干燥车间蒸汽超标原因是什么？')}
                  className="px-2 py-1 rounded bg-card hover:bg-accent hover:text-primary border border-border transition-colors text-muted-foreground text-left truncate max-w-[200px] cursor-pointer"
                >
                  ⚡ 沈变干燥车间蒸汽超标原因？
                </button>
                <button
                  onClick={() => handleSendAi('全集团哪家工厂单位单耗最高，需要重点监管？')}
                  className="px-2 py-1 rounded bg-card hover:bg-accent hover:text-primary border border-border transition-colors text-muted-foreground text-left truncate max-w-[200px] cursor-pointer"
                >
                  🏭 哪家工厂单耗最高需监管？
                </button>
              </div>
            </div>

            {/* 底部输入框 */}
            <div className="p-2.5 bg-panel border-t border-border flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAi()}
                placeholder="输入能耗、碳排、CBAM关税或工艺问题..."
                className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
              />
              <button
                onClick={() => handleSendAi()}
                className="size-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                title="发送"
              >
                <Send className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 右下角 AI 悬浮胶囊 */}
        <button
          onClick={() => setIsAiOpen(!isAiOpen)}
          className={cn(
            'pointer-events-auto cursor-pointer flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 group focus:outline-none border border-border backdrop-blur-md',
            isAiOpen
              ? 'bg-popover text-foreground shadow-black/60'
              : 'bg-primary/90 text-primary-foreground shadow-[0_0_20px_var(--primary)] hover:bg-primary'
          )}
          title="点击打开特变电工 AI助手"
        >
          <div className="size-6 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
            <Sparkles className="size-3.5 text-current animate-pulse" />
          </div>
          <span className="font-bold text-xs tracking-wide">
            {isAiOpen ? '收起 AI助手' : 'AI助手'}
          </span>
          {!isAiOpen && (
            <span className="size-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          )}
        </button>
      </div>
    </div>
  )
}

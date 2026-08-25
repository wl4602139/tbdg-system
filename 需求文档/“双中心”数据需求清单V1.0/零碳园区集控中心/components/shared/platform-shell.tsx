'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  Grid2x2,
  Settings,
  LayoutGrid,
  Bell,
  Search,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { platformMeta, type PlatformKey } from '@/lib/nav-config'

export function PlatformShell({
  platform,
  children,
}: {
  platform: PlatformKey
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const meta = platformMeta[platform]
  const other: PlatformKey = platform === 'zero-carbon' ? 'carbon-footprint' : 'zero-carbon'
  const otherMeta = platformMeta[other]

  const activeItem = meta.nav.find((n) => pathname.startsWith(n.href))
  const [expanded, setExpanded] = useState<string[]>(activeItem ? [activeItem.href] : [])
  const [switcherOpen, setSwitcherOpen] = useState(false)

  /* 导航后自动展开当前模块，确保选中项所在分组可见 */
  useEffect(() => {
    if (activeItem) {
      setExpanded((prev) => (prev.includes(activeItem.href) ? prev : [...prev, activeItem.href]))
    }
  }, [activeItem?.href])

  function toggle(href: string) {
    setExpanded((prev) => (prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]))
  }

  return (
    <div className="tech-grid flex min-h-screen bg-background">
      {/* 侧边导航 */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/15 text-sm font-bold text-primary">
            TBEA
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">特变电工电装集团</p>
            <p className="text-[11px] text-muted-foreground">{meta.name}</p>
          </div>
        </Link>

        {/* 平台切换 */}
        <div className="relative px-3 py-3">
          <button
            type="button"
            onClick={() => setSwitcherOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-panel px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/50"
          >
            <span className="flex items-center gap-2">
              <meta.icon className="size-4 text-primary" />
              {meta.short}
            </span>
            <ChevronDown className={cn('size-4 transition-transform', switcherOpen && 'rotate-180')} />
          </button>
          {switcherOpen && (
            <div className="absolute left-3 right-3 z-40 mt-1 rounded-lg border border-border bg-popover p-1 shadow-xl">
              <Link
                href={otherMeta.nav[0].href}
                onClick={() => setSwitcherOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent"
              >
                <otherMeta.icon className="size-4 text-primary" />
                切换到 {otherMeta.short}
              </Link>
              <Link
                href="/"
                onClick={() => setSwitcherOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent"
              >
                <LayoutGrid className="size-4 text-primary" />
                返回总览门户
              </Link>
            </div>
          )}
        </div>

        {/* 菜单 */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <ul className="flex flex-col gap-1">
            {meta.nav.map((item) => {
              const active = pathname.startsWith(item.href)
              const isOpen = expanded.includes(item.href)
              /* 有子菜单时一级链接直达首个子页面，避免父路径 redirect 的额外请求 */
              const itemHref = item.children?.length ? item.children[0].href : item.href
              return (
                <li key={item.href}>
                  <div className="flex items-center">
                    <Link
                      href={itemHref}
                      className={cn(
                        'flex flex-1 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                        active
                          ? 'bg-primary/15 text-primary'
                          : 'text-sidebar-foreground hover:bg-accent/50 hover:text-foreground',
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="flex-1">{item.title}</span>
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        onClick={() => toggle(item.href)}
                        className="ml-0.5 rounded p-1 text-muted-foreground hover:text-foreground"
                        aria-label="展开子菜单"
                      >
                        <ChevronRight className={cn('size-4 transition-transform', isOpen && 'rotate-90')} />
                      </button>
                    )}
                  </div>
                  {item.children && isOpen && (
                    <ul className="ml-6 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                      {item.children.map((c) => {
                        const childActive = pathname === c.href
                        return (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className={cn(
                                'block rounded-md px-2.5 py-1.5 text-[13px] transition-colors',
                                childActive
                                  ? 'bg-primary/15 font-medium text-primary'
                                  : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
                              )}
                            >
                              {c.title}
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
      </aside>

      {/* 主区域 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm">
            <Grid2x2 className="size-4 text-primary" />
            <span className="text-muted-foreground">{meta.name}</span>
            {activeItem && (
              <>
                <ChevronRight className="size-3.5 text-muted-foreground" />
                <span className="font-medium text-foreground">{activeItem.title}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-panel px-3 py-1.5 text-sm text-muted-foreground lg:flex">
              <Search className="size-4" />
              <input
                placeholder="搜索功能 / 单位 / 产品"
                className="w-40 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="button"
              className="relative rounded-md border border-border bg-panel p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="告警通知"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--destructive)]" />
            </button>
            <Link
              href="/system"
              className="flex items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/50"
            >
              <Settings className="size-4 text-primary" />
              系统管理
            </Link>
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-sm font-semibold text-primary">
                A
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-[11px] text-muted-foreground">集团管理员</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

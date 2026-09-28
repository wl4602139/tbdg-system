'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  UserCog,
  KeyRound,
  LayoutGrid,
  Boxes,
  ScrollText,
  ChevronRight,
  ChevronDown,
  Zap,
  Flame,
  Layers,
  DollarSign,
  Droplets,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { OrgSection } from '@/components/system/sections/org-section'
import { UserSection } from '@/components/system/sections/user-section'
import { RoleSection } from '@/components/system/sections/role-section'
import { MenuSection } from '@/components/system/sections/menu-section'
import { FactorSection } from '@/components/system/sections/factor-section'
import { PriceSection } from '@/components/system/sections/price-section'
import { LogSection } from '@/components/system/sections/log-section'

type Leaf = { id: string; title: string; icon: LucideIcon }
type Group = { id: string; title: string; icon: LucideIcon; children?: Leaf[] }

/* 系统管理模块功能目录树 */
const MENU: Group[] = [
  {
    id: 'access',
    title: '权限管控',
    icon: ShieldCheck,
    children: [
      { id: 'org', title: '组织管理', icon: Building2 },
      { id: 'user', title: '用户管理', icon: UserCog },
      { id: 'role', title: '角色与权限', icon: KeyRound },
      { id: 'menu', title: '菜单与功能', icon: LayoutGrid },
    ],
  },
  {
    id: 'factor',
    title: '能碳基础因子管理',
    icon: Boxes,
    children: [
      { id: 'factor-power', title: '电力碳排因子', icon: Zap },
      { id: 'factor-energy', title: '能源活动碳排因子', icon: Flame },
      { id: 'factor-coal', title: '折标煤系数库', icon: Layers },
    ],
  },
  { id: 'price', title: '费价模型', icon: DollarSign },
  { id: 'log', title: '日志管理', icon: ScrollText },
]

/* section id → 面包屑 [组, 页] */
const CRUMB: Record<string, { group: string; page: string }> = {
  org: { group: '权限管控', page: '组织管理' },
  user: { group: '权限管控', page: '用户管理' },
  role: { group: '权限管控', page: '角色与权限' },
  menu: { group: '权限管控', page: '菜单与功能' },
  'factor-power': { group: '能碳基础因子管理', page: '电力碳排因子' },
  'factor-energy': { group: '能碳基础因子管理', page: '能源活动碳排因子' },
  'factor-coal': { group: '能碳基础因子管理', page: '折标煤系数库' },
  'price-power': { group: '系统管理', page: '费价模型' },
  'price-gas': { group: '系统管理', page: '费价模型' },
  'price-steam': { group: '系统管理', page: '费价模型' },
  'price-dispatch': { group: '系统管理', page: '费价模型' },
  price: { group: '系统管理', page: '费价模型' },
  log: { group: '系统管理', page: '日志管理' },
}

/* 依据来源路径解析返回目标与名称：从哪进来就回哪去 */
function resolveBack(from: string | null): { href: string; label: string } {
  const target = from && from.startsWith('/') ? from : '/'
  if (target.startsWith('/zero-carbon')) return { href: target, label: '返回零碳园区集控中心' }
  if (target.startsWith('/carbon-footprint')) return { href: target, label: '返回产品碳足迹集采中心' }
  return { href: target, label: '返回业务总览' }
}

export function SystemView() {
  const searchParams = useSearchParams()
  const sectionParam = searchParams.get('section') || searchParams.get('tab')
  const initialActive = sectionParam ? (sectionParam.startsWith('price') || sectionParam === 'tariff' ? 'price' : sectionParam) : 'org'
  const [active, setActive] = useState(initialActive)
  const [expanded, setExpanded] = useState<string[]>(() => {
    const list = ['access']
    if (initialActive.startsWith('factor')) list.push('factor')
    return list
  })
  const back = resolveBack(searchParams.get('from'))

  function toggle(id: string) {
    setExpanded((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  }

  const crumb = CRUMB[active] || { group: '系统管理', page: '费价模型' }

  return (
    <div className="tech-grid flex min-h-screen bg-background">
      <div className="tech-radial pointer-events-none fixed inset-0" />

      {/* 左侧功能目录树 (260px 固定宽) */}
      <aside className="sticky top-0 z-20 flex h-screen w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-md">
        {/* 模块标识 */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4 shrink-0">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/15 text-primary shadow-xs">
            <ShieldCheck className="size-5" />
          </div>
          <div className="leading-tight overflow-hidden">
            <p className="text-[15px] font-bold text-foreground tracking-wide truncate">系统管理</p>
            <p className="text-[11px] text-muted-foreground truncate">两大平台共性配置</p>
          </div>
        </div>

        {/* 返回业务系统 */}
        <div className="px-3 py-3 shrink-0">
          <Link
            href={back.href}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:bg-white/10 active:bg-white/15 shadow-xs cursor-pointer select-none"
            title={back.label}
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className="truncate">{back.label}</span>
          </Link>
        </div>

        {/* 目录树 */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          <ul className="flex flex-col gap-1">
            {MENU.map((item) => {
              if (!item.children) {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActive(item.id)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-3 h-[36px] text-sm font-medium transition-all group my-0.5 cursor-pointer text-left',
                        isActive
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'text-sidebar-foreground hover:bg-accent/50 hover:text-foreground',
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{item.title}</span>
                    </button>
                  </li>
                )
              }
              const isOpen = expanded.includes(item.id)
              const groupActive = item.children.some((c) => c.id === active)
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 h-[36px] text-sm font-medium transition-all group my-0.5 cursor-pointer text-left',
                      groupActive
                        ? 'bg-primary/20 text-primary font-bold'
                        : 'text-sidebar-foreground hover:bg-accent/50 hover:text-foreground',
                    )}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <item.icon className="size-4 shrink-0" />
                      <span className="flex-1 font-medium truncate">{item.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'size-3.5 text-muted-foreground transition-transform duration-200 shrink-0',
                        !isOpen && '-rotate-90',
                      )}
                    />
                  </button>
                  {isOpen && (
                    <ul className="ml-4 pl-2.5 border-l border-sidebar-border space-y-0.5 py-1">
                      {item.children.map((c) => {
                        const childActive = active === c.id
                        return (
                          <li key={c.id}>
                            <button
                              type="button"
                              onClick={() => setActive(c.id)}
                              className={cn(
                                'flex w-full items-center gap-2 rounded-md px-2.5 h-[32px] text-xs transition-colors cursor-pointer text-left',
                                childActive
                                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                                  : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
                              )}
                            >
                              <c.icon className="size-3.5 shrink-0 opacity-80" />
                              <span className="truncate">{c.title}</span>
                            </button>
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

        {/* 底部账户 */}
        <div className="flex items-center gap-2.5 border-t border-sidebar-border px-4 py-3 shrink-0">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary shadow-xs shrink-0">
            A
          </div>
          <div className="leading-tight overflow-hidden">
            <p className="text-sm font-semibold text-foreground truncate">Admin</p>
            <p className="text-[11px] text-muted-foreground truncate">集团管理员</p>
          </div>
        </div>
      </aside>

      {/* 主区域 */}
      <div className="relative flex min-w-0 flex-1 flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-3.5 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="size-4 text-primary" />
            <span className="text-muted-foreground">系统管理</span>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            {crumb.group && crumb.group !== '系统管理' && (
              <>
                <span className="text-muted-foreground">{crumb.group}</span>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </>
            )}
            <span className="font-semibold text-foreground">{crumb.page}</span>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {active === 'org' && <OrgSection />}
          {active === 'user' && <UserSection />}
          {active === 'role' && <RoleSection />}
          {active === 'menu' && <MenuSection />}
          {active === 'factor-power' && <FactorSection sub="power" />}
          {active === 'factor-energy' && <FactorSection sub="energy" />}
          {active === 'factor-coal' && <FactorSection sub="coal" />}
          {(active === 'price' || active.startsWith('price')) && <PriceSection defaultTab="power" />}
          {active === 'log' && <LogSection />}
        </main>
      </div>
    </div>
  )
}

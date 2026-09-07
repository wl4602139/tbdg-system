'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Settings,
  Globe2,
  Leaf,
  Award,
} from 'lucide-react'
import { honors } from '@/lib/mock-data'

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
  const [honorIndex, setHonorIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setHonorIndex((i) => (i + 1) % honors.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="tech-grid relative flex min-h-screen lg:h-screen flex-col overflow-y-auto lg:overflow-hidden bg-background">
      <div className="tech-radial pointer-events-none absolute inset-0" />

      {/* 顶栏 */}
      <header className="relative flex shrink-0 items-center justify-between px-6 py-3 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-sm font-bold text-primary">
            TBEA
          </div>
          <span className="text-base font-semibold text-foreground">
            特变电工电气装备集团能碳数字化运营平台
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/system?from=/"
            className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3.5 py-2 text-sm text-foreground transition-colors hover:border-primary/50"
          >
            <Settings className="size-4 text-primary" />
            系统管理
          </Link>
          <div className="flex items-center gap-2 border-l border-border pl-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-sm font-semibold text-primary">
              A
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-[11px] text-muted-foreground">集团管理员</p>
            </div>
          </div>
        </div>
      </header>

      {/* 主体区：标题 + 入口，占满剩余高度且不滚动 */}
      <main className="relative flex flex-1 flex-col justify-center overflow-hidden px-6 pb-3 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-center my-auto">
          {/* 标题区 */}
          <div className="mx-auto max-w-4xl shrink-0 text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[11px] font-medium tracking-wider text-primary font-mono">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              TBEA DUAL-CENTER ENERGY & CARBON MANAGEMENT
            </div>

            <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground text-glow lg:text-3xl flex items-center justify-center gap-2">
              <span>能碳管控</span>
              <span className="bg-gradient-to-r from-primary via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                “双中心”
              </span>
              <span>运营平台</span>
            </h1>

            <p className="mx-auto mt-2 max-w-3xl text-pretty text-xs text-muted-foreground lg:text-sm leading-relaxed">
              能碳一体化运营服务特变电工电气装备产业以实测数据牵引各经营单位绿色低碳转型、构建应对市场绿色招采快速响应能力。
            </p>

            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2.5 text-xs">
              <span className="px-3 py-1 rounded-md border border-border bg-panel text-foreground/80 font-medium">
                🏭 国家零碳工厂对标
              </span>
              <span className="px-3 py-1 rounded-md border border-border bg-panel text-foreground/80 font-medium">
                🌿 产品碳足迹在线核算及认证
              </span>
              <span className="px-3 py-1 rounded-md border border-border bg-panel text-foreground/80 font-medium">
                ⚡ 产品能耗能效深度分析
              </span>
            </div>
          </div>

          {/* 两大入口 */}
          <div className="mx-auto mt-4 grid w-full max-w-6xl gap-5 md:grid-cols-2 lg:mt-5 lg:gap-6">
          {entrances.map((e) => {
            const isZeroCarbon = e.key === 'zero-carbon'
            return (
              <div
                key={e.key}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 backdrop-blur-sm transition-all ${
                  isZeroCarbon
                    ? 'hover:border-primary/50 hover:shadow-[0_0_40px_-12px_var(--primary)]'
                    : 'hover:border-emerald-500/50 hover:shadow-[0_0_40px_-12px_rgba(16,185,129,0.3)]'
                }`}
              >
                <div className="tech-radial pointer-events-none absolute inset-0 opacity-50" />
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-border bg-[#071019]">
                  <Image
                    src={e.img || '/placeholder.svg'}
                    alt={`${e.name}示意图`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </div>

                <div className="relative mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-xl border ${
                        isZeroCarbon
                          ? 'border-primary/40 bg-primary/15 text-primary'
                          : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                      }`}
                    >
                      <e.icon className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-foreground">{e.name}</h2>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold border ${
                            isZeroCarbon
                              ? 'bg-primary/15 text-primary border-primary/30'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {e.badge}
                        </span>
                      </div>
                      <p className="text-[11px] tracking-wider text-muted-foreground">{e.en}</p>
                    </div>
                  </div>
                </div>

                {/* 描述信息列表 (4 项) */}
                <ul className="relative mt-2.5 space-y-1.5 text-xs">
                  {e.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-foreground/90 transition-colors hover:bg-panel"
                    >
                      <span
                        className={`size-1.5 shrink-0 rounded-full ${
                          isZeroCarbon ? 'bg-primary' : 'bg-emerald-400'
                        }`}
                      />
                      <span className="font-medium">{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-3.5">
                  <Link
                    href={e.href}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition-all group/btn shadow-md ${
                      isZeroCarbon
                        ? 'bg-gradient-to-r from-primary to-blue-600 hover:opacity-95 shadow-primary/20 hover:shadow-primary/30'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-emerald-500/20 hover:shadow-emerald-500/30'
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

        {/* 荣誉轮播 */}
        <div className="mx-auto mt-4 w-full max-w-6xl">
          <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-panel px-5 py-2.5">
            <div className="flex items-center gap-2 border-r border-border pr-4 text-sm font-medium text-primary">
              <Award className="size-4" />
              荣誉成果
            </div>
            <div className="relative h-5 flex-1 overflow-hidden">
              {honors.map((h, i) => (
                <p
                  key={h}
                  className="absolute inset-0 text-sm text-muted-foreground transition-all duration-500"
                  style={{
                    opacity: i === honorIndex ? 1 : 0,
                    transform: `translateY(${(i - honorIndex) * 100}%)`,
                  }}
                >
                  {h}
                </p>
              ))}
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}

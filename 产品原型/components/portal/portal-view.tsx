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
  MoreHorizontal,
} from 'lucide-react'
import { honors } from '@/lib/mock-data'

const entrances = [
  {
    key: 'zero-carbon',
    name: '零碳园区集控中心',
    en: 'ZERO-CARBON PARK CONTROL CENTER',
    desc: '面向集团领导层与企业参阅对象，集中监管各园区与经营单位的能耗、能效与碳排放，支撑零碳园区建设与决策。',
    img: '/illustrations/zero-carbon.png',
    href: '/zero-carbon/screen',
    icon: Globe2,
    col1: ['集控中心大屏与集中监管', '零碳项目评估与告警管理'],
    col2: ['能耗能效与碳排放分析', '智能助手综合交互'],
  },
  {
    key: 'carbon-footprint',
    name: '产品碳足迹集采中心',
    en: 'PRODUCT CARBON FOOTPRINT CENTER',
    desc: '对集团产品碳足迹进行核算、填报、对标分析，覆盖实景数据库、CBAM 应对、第三方认证与因子库管理。',
    img: '/illustrations/carbon-footprint.png',
    href: '/carbon-footprint/cockpit',
    icon: Leaf,
    col1: ['集团驾驶舱与多维分析', 'CBAM 合规与成本测算'],
    col2: ['实景数据库与碳足迹报告', '第三方认证与因子库管理'],
  },
]

export function PortalView() {
  const [honorIndex, setHonorIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setHonorIndex((i) => (i + 1) % honors.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="tech-grid relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-background">
      <div className="tech-radial pointer-events-none absolute inset-0" />

      {/* 顶栏 */}
      <header className="relative z-20 flex shrink-0 items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-sm font-bold text-primary shadow-xs">
            TBEA
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold text-foreground tracking-wide">特变电工电装集团</p>
            <p className="text-xs text-muted-foreground font-mono">TBEA Electrical Equipment Group</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/system?from=/"
            className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3.5 py-2 text-sm text-foreground transition-colors hover:border-primary/50 shadow-xs"
          >
            <Settings className="size-4 text-primary" />
            系统管理
          </Link>
          <div className="flex items-center gap-2.5 border-l border-border pl-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-sm font-semibold text-primary shadow-xs">
              A
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-[11px] text-muted-foreground">集团管理员</p>
            </div>
          </div>
        </div>
      </header>

      {/* 主体区：标题 + 两大入口 */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-4 lg:px-12">
        {/* 标题区 */}
        <div className="mx-auto max-w-3xl shrink-0 text-center">
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground text-glow lg:text-3xl">
            零碳园区集控与产品碳足迹集采平台
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-pretty text-xs text-muted-foreground lg:text-sm">
            一体化能碳数字化平台，支撑集团园区集中管控与产品碳足迹集中管理，助力绿色低碳与高质量发展
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[11px] font-medium tracking-wider text-primary font-mono shadow-xs">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            ZERO-CARBON & CARBON FOOTPRINT PLATFORM
          </div>
        </div>

        {/* 两大入口卡片 */}
        <div className="mt-6 grid w-full gap-6 md:grid-cols-2">
          {entrances.map((e) => (
            <div
              key={e.key}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-[0_0_40px_-12px_var(--primary)] flex flex-col justify-between"
            >
              <div className="tech-radial pointer-events-none absolute inset-0 opacity-50" />
              
              {/* 3D 插画区域 */}
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

              {/* 标题与图标 */}
              <div className="relative mt-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary shadow-xs">
                  <e.icon className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{e.name}</h2>
                  <p className="text-[11px] tracking-wider text-muted-foreground font-mono">{e.en}</p>
                </div>
              </div>

              {/* 描述信息 */}
              <p className="relative mt-2.5 text-xs leading-relaxed text-muted-foreground">{e.desc}</p>

              {/* 4 项核心亮点 (双列排列) */}
              <div className="relative mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div className="space-y-1.5">
                  {e.col1.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-foreground/90">
                      <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="truncate">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {e.col2.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-foreground/90">
                      <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="truncate">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 底部进入操作 */}
              <div className="relative mt-4 flex items-center justify-between pt-1">
                <Link
                  href={e.href}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 shadow-sm"
                >
                  进入平台
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button
                  type="button"
                  className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/40 cursor-pointer"
                  aria-label="更多"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 荣誉轮播 */}
        <div className="mt-6 w-full">
          <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-panel px-5 py-2.5 shadow-2xs">
            <div className="flex items-center gap-2 border-r border-border pr-4 text-xs font-semibold text-primary shrink-0">
              <Award className="size-4" />
              荣誉成果
            </div>
            <div className="relative h-5 flex-1 overflow-hidden">
              {honors.map((h, i) => (
                <p
                  key={h}
                  className="absolute inset-0 text-xs text-muted-foreground transition-all duration-500 truncate"
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
      </main>

      {/* 底部版权 */}
      <footer className="relative z-10 py-3 text-center text-xs text-muted-foreground/80">
        特变电工（电装集团）能碳双中心 © 2026 特变电工股份有限公司
      </footer>
    </div>
  )
}

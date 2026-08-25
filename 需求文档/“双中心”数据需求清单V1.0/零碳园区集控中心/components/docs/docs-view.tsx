'use client'

import { useState } from 'react'
import Link from 'next/link'
import { zeroCarbonFuncs, carbonFootprintFuncs, interactionSpecs, type FuncRow } from '@/lib/requirements'
import { ArrowLeft, FileText, Layers, MousePointerClick, ListChecks, Target } from 'lucide-react'

const sections = [
  { id: 'overview', label: '一、项目概述' },
  { id: 'goals', label: '二、建设目标' },
  { id: 'architecture', label: '三、总体架构' },
  { id: 'zero-carbon', label: '四、零碳园区集控中心' },
  { id: 'carbon-footprint', label: '五、产品碳足迹集采中心' },
  { id: 'interaction', label: '六、页面与交互设计' },
  { id: 'common', label: '七、共性系统管理' },
  { id: 'nonfunctional', label: '八、非功能性需求' },
]

function FuncTable({ rows }: { rows: FuncRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-secondary text-left text-xs uppercase text-muted-foreground">
            <th className="w-12 px-3 py-2.5 font-medium">序号</th>
            <th className="w-32 px-3 py-2.5 font-medium">一级功能</th>
            <th className="w-40 px-3 py-2.5 font-medium">二级功能</th>
            <th className="px-3 py-2.5 font-medium">功能说明</th>
            <th className="w-40 px-3 py-2.5 font-medium">功能定位</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border align-top hover:bg-secondary/40">
              <td className="px-3 py-2.5 font-mono text-muted-foreground">{r.no}</td>
              <td className="px-3 py-2.5 font-medium text-foreground">{r.l1}</td>
              <td className="px-3 py-2.5 text-primary">{r.l2}</td>
              <td className="px-3 py-2.5 leading-relaxed text-muted-foreground">{r.desc}</td>
              <td className="px-3 py-2.5 text-xs leading-relaxed text-foreground/80">{r.positioning ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function H({ id, icon: Icon, children }: { id: string; icon: any; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 flex items-center gap-2 text-xl font-bold text-foreground">
      <Icon className="size-5 text-primary" />
      {children}
    </h2>
  )
}

export function DocsView() {
  const [active, setActive] = useState('overview')

  return (
    <div className="min-h-screen bg-background">
      {/* 顶栏 */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> 返回总览
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <span className="font-semibold text-foreground">项目需求文档</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">特变电工电装集团 · 零碳数字化管理平台 · V1.0</span>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        {/* 目录 */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1">
            <p className="mb-2 px-3 text-xs font-medium uppercase text-muted-foreground">目录</p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActive(s.id)}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  active === s.id
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* 正文 */}
        <main className="min-w-0 flex-1 space-y-12">
          <section className="space-y-4">
            <H id="overview" icon={FileText}>一、项目概述</H>
            <p className="leading-relaxed text-muted-foreground">
              本项目面向特变电工电装集团，建设统一的「零碳数字化管理平台」总览门户，向下汇聚两大业务平台：
              <span className="text-foreground">零碳园区集控中心</span>（面向园区能碳集中监管与减排）与
              <span className="text-foreground">产品碳足迹集采中心</span>（面向产品级碳足迹核算、CBAM 应对与认证）。
              进入总览后提供左右两个大入口，点击进入各自业务平台；共性的系统管理放置于总览页右上角，两大平台共享账号权限体系。
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { t: '零碳园区集控中心', d: '9 个一级功能：集控大屏、集中监管、能耗能效分析、碳管理、零碳项目评估、统计报表、告警管理、基础配置、智能助手。' },
                { t: '产品碳足迹集采中心', d: '8 个一级功能：对外示范窗口、多维分析、实景数据库、CBAM 管理、第三方认证管理、因子库管理、基础配置、数据接口。' },
              ].map((c) => (
                <div key={c.t} className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-1.5 font-semibold text-foreground">{c.t}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <H id="goals" icon={Target}>二、建设目标</H>
            <ul className="space-y-2">
              {[
                '打造集团对外示范窗口，可视化呈现零碳建设成效与产品碳足迹水平，面向领导层与参观对象。',
                '实现园区能碳集中监管、能耗能效分析、碳排放核算与告警，支撑双碳目标管理与辅助决策。',
                '建立产品级碳足迹实景核算、溯源、报告能力，并提前应对欧盟 CBAM 碳边境调节机制。',
                '构建特变电工各产业本地化因子库，统一因子构建、版本管理与下发，打通股份与经营单位系统接口。',
                '提供第三方认证便捷对接，统一认证资料、申请与证书生命周期管理。',
              ].map((g, i) => (
                <li key={i} className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs text-primary">{i + 1}</span>
                  {g}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <H id="architecture" icon={Layers}>三、总体架构</H>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="space-y-3">
                <div className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm font-medium text-primary">
                  总览门户（特变电工电装集团 · 零碳数字化管理平台）
                </div>
                <div className="flex justify-center text-muted-foreground">▼</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-border bg-secondary/50 px-4 py-3 text-center text-sm text-foreground">
                    零碳园区集控中心
                  </div>
                  <div className="rounded-md border border-border bg-secondary/50 px-4 py-3 text-center text-sm text-foreground">
                    产品碳足迹集采中心
                  </div>
                </div>
                <div className="rounded-md border border-dashed border-border px-4 py-3 text-center text-sm text-muted-foreground">
                  共性系统管理（账号权限 · 数据安全 · 审计日志）｜ 数据接口层（股份系统 / 各经营单位本地系统 / 因子库）
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <H id="zero-carbon" icon={ListChecks}>四、零碳园区集控中心 · 功能清单</H>
            <FuncTable rows={zeroCarbonFuncs} />
          </section>

          <section className="space-y-4">
            <H id="carbon-footprint" icon={ListChecks}>五、产品碳足迹集采中心 · 功能清单</H>
            <FuncTable rows={carbonFootprintFuncs} />
          </section>

          <section className="space-y-4">
            <H id="interaction" icon={MousePointerClick}>六、页面与交互设计</H>
            {interactionSpecs.map((spec) => (
              <div key={spec.area} className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-2 font-semibold text-foreground">{spec.area}</h3>
                <ul className="space-y-2">
                  {spec.points.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <H id="common" icon={Layers}>七、共性系统管理</H>
            <p className="leading-relaxed text-muted-foreground">
              系统管理为两大平台共性能力，入口置于总览页右上角，包含：账号与三级组织权限（集团/园区/经营单位，细化至按钮级）、
              角色管理、数据安全（国密算法加密）、操作审计日志（不可删除）、消息通知配置。两大平台复用同一账号权限体系。
            </p>
          </section>

          <section className="space-y-4">
            <H id="nonfunctional" icon={Target}>八、非功能性需求</H>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                { t: '安全性', d: '等保三级；敏感字段国密（SM2/SM4）加密；审计日志留存 ≥180 天且不可篡改；参数化查询防注入。' },
                { t: '性能', d: '大屏首屏 ≤3s；核心图表交互响应 ≤1s；支持大数据量表格分页与虚拟滚动。' },
                { t: '兼容与响应式', d: '桌面优先，兼容主流浏览器；大屏适配 1080P/2K；关键页面移动端可查看。' },
                { t: '可扩展性', d: '因子/费价/核算公式可配置、多版本；接口字段映射可配置；模型版本化管理。' },
              ].map((n) => (
                <div key={n.t} className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-1.5 font-semibold text-foreground">{n.t}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{n.d}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  zeroCarbonFuncs,
  carbonFootprintFuncs,
  interactionSpecs,
  productEnergyMappings,
  type FuncRow,
  type ProductEnergyMappingRow,
} from '@/lib/requirements'
import { ArrowLeft, FileText, Layers, MousePointerClick, ListChecks, Target, Factory, Zap, Flame, Wind } from 'lucide-react'

const sections = [
  { id: 'overview', label: '一、项目概述' },
  { id: 'goals', label: '二、建设目标' },
  { id: 'architecture', label: '三、总体架构' },
  { id: 'zero-carbon', label: '四、零碳园区集控中心' },
  { id: 'carbon-footprint', label: '五、产品碳足迹集采中心' },
  { id: 'product-energy', label: '六、企业产品与工序能源消耗规范' },
  { id: 'interaction', label: '七、页面与交互设计' },
  { id: 'common', label: '八、共性系统管理' },
  { id: 'nonfunctional', label: '九、非功能性需求' },
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

function ProductEnergyTable({ rows }: { rows: ProductEnergyMappingRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-xs font-mono">
        <thead>
          <tr className="bg-secondary text-left text-xs uppercase text-muted-foreground font-sans">
            <th className="w-10 px-2.5 py-2.5 font-medium">序号</th>
            <th className="w-20 px-2.5 py-2.5 font-medium">一级单位</th>
            <th className="w-28 px-2.5 py-2.5 font-medium">二级项目公司</th>
            <th className="w-24 px-2.5 py-2.5 font-medium">产品大类</th>
            <th className="w-44 px-2.5 py-2.5 font-medium">主要产品及规格细分</th>
            <th className="w-48 px-2.5 py-2.5 font-medium">涉及关键制造工序</th>
            <th className="w-36 px-2.5 py-2.5 font-bold text-primary font-sans">主要消耗能源</th>
            <th className="w-44 px-2.5 py-2.5 font-medium">管控与核算对应指标</th>
            <th className="px-2.5 py-2.5 font-medium font-sans">业务核算与展示规则</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.no} className="hover:bg-secondary/40 align-top">
              <td className="px-2.5 py-2 text-muted-foreground">{r.no}</td>
              <td className="px-2.5 py-2 font-bold font-sans text-foreground">{r.compL1}</td>
              <td className="px-2.5 py-2 font-sans text-foreground">{r.compL2}</td>
              <td className="px-2.5 py-2 font-sans">
                <span className={r.productCategory.includes('变压器') ? 'px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold' : r.productCategory.includes('线缆') ? 'px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold' : 'px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]'}>
                  {r.productCategory}
                </span>
              </td>
              <td className="px-2.5 py-2 font-sans font-semibold text-foreground">{r.productName}</td>
              <td className="px-2.5 py-2 font-sans text-muted-foreground leading-relaxed">{r.processes}</td>
              <td className="px-2.5 py-2 font-sans font-bold text-primary">{r.energyConsumed}</td>
              <td className="px-2.5 py-2 font-sans text-foreground/80 leading-relaxed">{r.metrics}</td>
              <td className="px-2.5 py-2 font-sans text-muted-foreground leading-relaxed">{r.remark || '—'}</td>
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
            <span className="font-semibold text-foreground">项目开发手册与技术规范</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">特变电工电装集团 · 能碳双中心数字化集成平台 · V1.0</span>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        {/* 目录 */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1">
            <p className="mb-2 px-3 text-xs font-medium uppercase text-muted-foreground">开发手册目录</p>
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

        {/* 主体内容 */}
        <main className="min-w-0 flex-1 space-y-12">
          <section className="space-y-4">
            <H id="overview" icon={Layers}>一、项目概述</H>
            <p className="leading-relaxed text-muted-foreground">
              本项目为<strong>特变电工电装集团零碳数字化管理平台</strong>（简称“双中心”），包含
              <strong>「零碳园区集控中心」</strong>与<strong>「产品碳足迹集采中心」</strong>两大业务核心，
              覆盖集团下属各大产业园区、制造公司、车间及关键工序的能耗监测、碳核算、CBAM 应对、碳足迹评价与共性系统管理。
            </p>
          </section>

          <section className="space-y-4">
            <H id="goals" icon={Target}>二、建设目标</H>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-1.5 font-semibold text-foreground">集中监管与能效领跑</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  统一接入 15 个产业园区、22 家核心工厂水、电、气、蒸汽等实测数据，实现集团-园区-车间三级穿透监控与对标分析。
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-1.5 font-semibold text-foreground">全链条碳足迹实景溯源</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  依托实景数据库实现原材料-制造-运输-处置全生命周期碳核算与 ISO 14067 认证报告自动化生成。
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-1.5 font-semibold text-foreground">国际合规与出海护航</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  内置欧盟 CBAM 管控清单、HS-CN 智能映射、缺省因子库与成本测算模型，保障海外贸易合规申报。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <H id="architecture" icon={Layers}>三、总体架构</H>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="space-y-3">
                <div className="rounded-md border border-dashed border-border px-4 py-3 text-center text-sm text-muted-foreground">
                  总览门户（统一入口 · 园区/产业/时间范围全局切换 · 智能问数助手）
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-border bg-secondary/50 px-4 py-3 text-center text-sm text-foreground font-bold">
                    零碳园区集控中心
                  </div>
                  <div className="rounded-md border border-border bg-secondary/50 px-4 py-3 text-center text-sm text-foreground font-bold">
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

          {/* 🌟 核心规范：企业、产品、产品类型与消耗能源工序对应规范表 */}
          <section className="space-y-4">
            <H id="product-energy" icon={Factory}>六、企业、产品与工序能源消耗对应规范 (权威基准)</H>
            <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 text-xs leading-relaxed text-slate-700 space-y-1.5 font-sans">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Zap className="size-4 text-[#1677ff]" />
                数据源基准：依据《生产单位与涉及关键工序对应表(1).et》
              </div>
              <div>
                • <strong>变压器产业</strong>：核心热工序为气相真空干燥与固化，重点核算 <strong>【电力】</strong> 与 <strong>【工业蒸汽】</strong>；
              </div>
              <div>
                • <strong>线缆产业</strong>：核心工序为铜铝拉丝与干法悬垂立塔交联，重点核算 <strong>【电力】</strong> 与保护介质 <strong>【高纯氮气】</strong>，<strong>全流程无蒸汽消耗</strong>；
              </div>
              <div>
                • <strong>成套与部件装备</strong>：开关柜、GIS、电抗器、电容器、GIL、套管、铁芯等重点核算 <strong>【电力】</strong>。
              </div>
            </div>
            <ProductEnergyTable rows={productEnergyMappings} />
          </section>

          <section className="space-y-4">
            <H id="interaction" icon={MousePointerClick}>七、页面与交互设计</H>
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
            <H id="common" icon={Layers}>八、共性系统管理</H>
            <p className="leading-relaxed text-muted-foreground">
              系统管理为两大平台共性能力，入口置于总览页右上角，包含：账号与三级组织权限（集团/园区/经营单位，细化至按钮级）、
              角色管理、数据安全（国密算法加密）、操作审计日志（不可删除）、消息通知配置。两大平台复用同一账号权限体系。
            </p>
          </section>

          <section className="space-y-4">
            <H id="nonfunctional" icon={Target}>九、非功能性需求</H>
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

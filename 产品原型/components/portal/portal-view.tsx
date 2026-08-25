'use client'

import Link from 'next/link'
import {
  Globe2,
  Leaf,
  ShieldCheck,
  Zap,
  Gauge,
  LineChart as LineIcon,
  Layers,
  ArrowRight,
  Sparkles,
  Building2,
  FileText,
  Settings,
  ChevronRight,
  Database,
  Activity,
  Bot,
} from 'lucide-react'

export function PortalView() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col justify-between selection:bg-blue-100 selection:text-blue-700">
      {/* 顶部企业蓝品牌条 */}
      <header className="h-16 bg-[#003eb3] border-b border-blue-900 px-6 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg px-2.5 py-1 flex items-center justify-center shadow">
            <img src="/logo.png" alt="TBEA 特变电工" className="h-7 w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white">
                特变电工股份有限公司（电装集团）
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500 text-white font-mono font-bold">
                v1.01 正式版
              </span>
            </div>
            <span className="text-xs text-blue-200 block -mt-0.5">
              能碳管控“双中心”数字化运营集成平台 · Always Reliable 全球信赖
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/zero-carbon/assistant"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-[#0958d9] font-bold hover:bg-blue-50 transition-colors shadow-xs"
          >
            <Sparkles className="size-3.5 text-[#1677ff]" />
            AI 智能问数助手
          </Link>
          <Link
            href="/docs"
            className="px-3 py-1.5 rounded bg-blue-800/80 hover:bg-blue-800 text-white transition-colors flex items-center gap-1.5 font-medium border border-blue-700"
          >
            <FileText className="size-3.5" />
            开发手册
          </Link>
          <Link
            href="/system"
            className="px-3 py-1.5 rounded bg-blue-800/80 hover:bg-blue-800 text-white transition-colors flex items-center gap-1.5 font-medium border border-blue-700"
          >
            <Settings className="size-3.5" />
            管理配置
          </Link>
        </div>
      </header>

      {/* 中部双中心门户大卡片 */}
      <main className="max-w-6xl mx-auto w-full px-6 py-10 space-y-8 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1677ff] bg-blue-50 px-3 py-1 rounded border border-blue-200 inline-block font-mono">
            TBEA DUAL-CENTER ENERGY & CARBON MANAGEMENT
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            能碳管控“双中心”运营平台
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            全面赋能特变电工 15 个零碳产业园区、21 家项目工厂能碳时序监控、65+ 管控指标穿透、绿电消纳分析、欧盟 CBAM 出口申报与全生命周期碳足迹核算。
          </p>
        </div>

        {/* 双中心大入口卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 平台一：零碳园区集控中心 */}
          <div className="p-6 rounded-xl bg-white border border-[#e5e7eb] hover:border-[#1677ff] hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff]">
                  <Globe2 className="size-6" />
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-bold">
                  集团 9 大核心功能模块
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  零碳园区集控中心
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  面向集团决策层与各园区/工厂能效工程师，聚焦宏观驾驶舱、集中监管与能碳精细化闭环。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#1677ff]" />
                  <span>能源驾驶舱与 GIS 园区分布</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#1677ff]" />
                  <span>65+ 管控指标下钻与 AI 归因</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#1677ff]" />
                  <span>水电气四介质与负荷曲线联动</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#1677ff]" />
                  <span>一键生成绿电消纳分析报告</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#1677ff]" />
                  <span>多工序用能结构桑基图 (Sankey)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#1677ff]" />
                  <span>线下手工数据合规填报系统</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/zero-carbon/screen"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <span>进入零碳园区集控中心</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* 平台二：产品碳足迹集采中心 */}
          <div className="p-6 rounded-xl bg-white border border-[#e5e7eb] hover:border-emerald-600 hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Leaf className="size-6" />
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  出海合规与绿色招采
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  产品碳足迹集采中心
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  面向集团数字化部、外贸出口团队与供应商管理，聚焦 LCA 碳足迹核算、实景溯源与 CBAM 合规。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                  <span>碳足迹全景驾驶舱与红黑榜</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                  <span>BOM 物料与工单能耗实景穿透</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                  <span>欧盟 CBAM 申报与碳关税测算</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                  <span>ISO 14067 认证材料与证书归档</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                  <span>集团标准化因子库同步与下发</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                  <span>供应链碳绩效与前驱物核查</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/carbon-footprint/cockpit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <span>进入产品碳足迹集采中心</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 底部版权 */}
      <footer className="h-12 border-t border-[#e5e7eb] bg-white px-6 flex items-center justify-between text-xs text-slate-500">
        <div>
          <span>© 2026 特变电工股份有限公司（电装集团） · 数字化与能碳管理中心</span>
        </div>
        <div className="flex items-center gap-4">
          <span>原型版本：<strong className="text-slate-800 font-mono font-bold">v1.01 (TBEA Corporate Edition)</strong></span>
          <span>技术栈：Next.js 16 + React 19 + TypeScript</span>
        </div>
      </footer>
    </div>
  )
}

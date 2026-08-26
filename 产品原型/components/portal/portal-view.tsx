'use client'

import { useState, useEffect } from 'react'
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
  Factory,
  Sun,
  Award,
  CheckCircle2,
  Cpu,
  BarChart3,
  TrendingDown,
  Compass,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function PortalView() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState<'all' | 'zero-carbon' | 'carbon-footprint'>('all')

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
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white drop-shadow-xs">
                特变电工股份有限公司（电装集团）
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-mono font-bold shadow-xs">
                v1.01 正式版
              </span>
            </div>
            <span className="text-xs text-blue-200/90 block -mt-0.5 font-medium">
              能碳管控“双中心”数字化运营集成平台 · Always Reliable 全球信赖
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/docs"
            className="px-3.5 py-1.5 rounded-lg bg-blue-800/80 hover:bg-blue-800 text-white transition-all flex items-center gap-1.5 font-medium border border-blue-700/80 shadow-xs hover:border-blue-500"
          >
            <FileText className="size-3.5 text-blue-200" />
            <span>开发手册</span>
          </Link>
          <Link
            href="/system"
            className="px-3.5 py-1.5 rounded-lg bg-blue-800/80 hover:bg-blue-800 text-white transition-all flex items-center gap-1.5 font-medium border border-blue-700/80 shadow-xs hover:border-blue-500"
          >
            <Settings className="size-3.5 text-blue-200" />
            <span>管理配置</span>
          </Link>
        </div>
      </header>

      {/* 🌟 3. 主体内容区 */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-8 space-y-6 flex-1 flex flex-col justify-center">
        {/* 头部标题与科技徽章 */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 shadow-xs backdrop-blur-xs">
            <span className="size-2 rounded-full bg-[#1677ff] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1677ff] font-mono">
              TBEA DUAL-CENTER ENERGY & CARBON MANAGEMENT
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-3">
            <span>能碳管控</span>
            <span className="bg-gradient-to-r from-[#1677ff] via-indigo-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-xs">
              “双中心”
            </span>
            <span>运营平台</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            全面赋能特变电工 <strong className="text-blue-600 font-semibold">15 个零碳产业园区</strong>、<strong className="text-blue-600 font-semibold">21 家项目工厂</strong>能碳时序监控、<strong className="text-slate-800 font-semibold">65+ 项管控指标</strong>穿透、绿电消纳分析、欧盟 CBAM 出口申报与全生命周期碳足迹核算。
          </p>

          {/* 核心价值微标签 */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1">
            <span className="px-2.5 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-600 shadow-2xs font-mono">
              🌐 GIS 园区全景
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-600 shadow-2xs font-mono">
              ⚡ 4 维横向 PK 对标
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-600 shadow-2xs font-mono">
              ☀️ 绿电消纳溯源
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-600 shadow-2xs font-mono">
              🌿 ISO 14067 / CBAM 出海合规
            </span>
          </div>
        </div>

        {/* 🌟 4. 双中心核心大卡片 (3D 悬浮质感 + 边缘流光) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* 平台一：零碳园区集控中心 */}
          <div className="group relative rounded-2xl bg-white/90 backdrop-blur-md border border-[#e5e7eb] hover:border-[#1677ff] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* 卡片右上角装饰光晕 */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-blue-400/20 via-sky-300/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-13 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/80 border border-blue-200/80 flex items-center justify-center text-[#1677ff] shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <Globe2 className="size-7 text-[#1677ff]" />
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-[#1677ff] border border-blue-200/80 font-bold shadow-2xs">
                  集团 9 大核心功能模块
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-[#1677ff] transition-colors">
                    零碳园区集控中心
                  </h2>
                  <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                    EMS
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  面向集团决策层与各园区/工厂能效工程师，聚焦宏观驾驶舱、集中监管与能碳精细化闭环。
                </p>
              </div>

              {/* 实时工况提示条 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-900 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>今日绿电占比：<strong>38.6% (达标)</strong></span>
                </span>
                <span className="text-emerald-700 font-bold">能耗同比 -4.1% ↓</span>
              </div>

              {/* 功能清单 */}
              <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 text-slate-600">
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-blue-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-[#1677ff] shrink-0" />
                  <span className="truncate">能源驾驶舱与 GIS 园区分布</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-blue-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-[#1677ff] shrink-0" />
                  <span className="truncate">65+ 管控指标下钻与 AI 归因</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-blue-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-[#1677ff] shrink-0" />
                  <span className="truncate">水电气四介质与负荷曲线联动</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-blue-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-[#1677ff] shrink-0" />
                  <span className="truncate">一键生成绿电消纳分析报告</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-blue-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-[#1677ff] shrink-0" />
                  <span className="truncate">多工序用能结构桑基图 (Sankey)</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-blue-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-[#1677ff] shrink-0" />
                  <span className="truncate">线下手工数据合规填报系统</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/zero-carbon/screen"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#1677ff] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all group/btn"
              >
                <span>进入零碳园区集控中心</span>
                <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 平台二：产品碳足迹集采中心 */}
          <div className="group relative rounded-2xl bg-white/90 backdrop-blur-md border border-[#e5e7eb] hover:border-emerald-600 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* 卡片右上角装饰光晕 */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-400/20 via-teal-300/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-13 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <Leaf className="size-7 text-emerald-600" />
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold shadow-2xs">
                  出海合规与绿色招采
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors">
                    产品碳足迹集采中心
                  </h2>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    PCF & LCA
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  面向集团数字化部、外贸出口团队与供应商管理，聚焦 LCA 碳足迹核算、实景溯源与 CBAM 合规。
                </p>
              </div>

              {/* 实时合规提示条 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ISO 14067 认证：<strong>21 项全覆盖</strong></span>
                </span>
                <span className="text-emerald-700 font-bold">CBAM 碳关税已核销</span>
              </div>

              {/* 功能清单 */}
              <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 text-slate-600">
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-emerald-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="truncate">碳足迹全景驾驶舱与红黑榜</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-emerald-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="truncate">BOM 物料与工单能耗实景穿透</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-emerald-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="truncate">欧盟 CBAM 申报与碳关税测算</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-emerald-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="truncate">ISO 14067 认证材料与证书归档</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-emerald-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="truncate">集团标准化因子库同步与下发</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-emerald-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="truncate">供应链碳绩效与前驱物核查</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/carbon-footprint/cockpit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all group/btn"
              >
                <span>进入产品碳足迹集采中心</span>
                <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* 🌟 5. 底部全集团实时运行遥测指标看板 */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl border border-[#e5e7eb] p-4 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="px-2 py-1">
              <span className="text-[11px] text-slate-500 block">园区接入总数</span>
              <div className="text-lg font-bold font-mono text-slate-800 mt-0.5">15 <span className="text-xs text-slate-400 font-sans">个</span></div>
              <span className="text-[10px] text-blue-600 font-mono">100% 覆盖</span>
            </div>
            <div className="px-2 py-1">
              <span className="text-[11px] text-slate-500 block">产业经营工厂</span>
              <div className="text-lg font-bold font-mono text-slate-800 mt-0.5">21 <span className="text-xs text-slate-400 font-sans">家</span></div>
              <span className="text-[10px] text-blue-600 font-mono">全线联网</span>
            </div>
            <div className="px-2 py-1">
              <span className="text-[11px] text-slate-500 block">本月综合能耗</span>
              <div className="text-lg font-bold font-mono text-slate-800 mt-0.5">1,284.5 <span className="text-xs text-slate-400 font-sans">tce</span></div>
              <span className="text-[10px] text-emerald-600 font-mono">同比 -2.7%</span>
            </div>
            <div className="px-2 py-1">
              <span className="text-[11px] text-slate-500 block">综合绿电消纳率</span>
              <div className="text-lg font-bold font-mono text-[#1677ff] mt-0.5">38.6 <span className="text-xs text-slate-400 font-sans">%</span></div>
              <span className="text-[10px] text-emerald-600 font-mono">直供/交易/绿证</span>
            </div>
            <div className="px-2 py-1">
              <span className="text-[11px] text-slate-500 block">SCADA 测点遥测率</span>
              <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">100 <span className="text-xs text-slate-400 font-sans">%</span></div>
              <span className="text-[10px] text-emerald-600 font-mono">正常在线</span>
            </div>
          </div>
        </div>
      </main>

      {/* 🌟 6. 底部标准版权栏 */}
      <footer className="relative z-20 h-12 border-t border-[#e5e7eb]/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between text-xs text-slate-500">
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

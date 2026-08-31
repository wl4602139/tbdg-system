'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Globe2,
  Leaf,
  ArrowRight,
} from 'lucide-react'

export function PortalView() {
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
          <span className="font-extrabold text-base tracking-wide text-white drop-shadow-xs">
            特变电工电气装备集团能碳数字化运营平台
          </span>
        </div>

        {/* 右上角账号信息 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 backdrop-blur-xs shadow-xs">
            <div className="size-7 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              管
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-white block leading-tight">
                管理员 (倪总)
              </span>
              <span className="text-[10px] text-blue-200/80 block">
                特变电工电气装备集团
              </span>
            </div>
          </div>
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

          <p className="text-xs sm:text-sm text-slate-600 max-w-none mx-auto leading-relaxed md:whitespace-nowrap">
            能碳一体化运营服务特变电工电气装备产业以实测数据牵引各经营单位绿色低碳转型、构建应对市场绿色招采快速响应能力。
          </p>

          {/* 核心价值微标签 */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs pt-1">
            <span className="px-3 py-1 rounded-md bg-white/90 border border-slate-200 text-slate-700 shadow-2xs font-sans font-medium">
              🏭 国家零碳工厂对标
            </span>
            <span className="px-3 py-1 rounded-md bg-white/90 border border-slate-200 text-slate-700 shadow-2xs font-sans font-medium">
              🌿 产品碳足迹在线核算及认证
            </span>
            <span className="px-3 py-1 rounded-md bg-white/90 border border-slate-200 text-slate-700 shadow-2xs font-sans font-medium">
              ⚡ 产品能耗能效深度分析
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

              </div>

              {/* 描述信息列表 (4 项) */}
              <div className="space-y-2 text-xs pt-1 text-slate-600 font-sans">
                <div className="flex items-center gap-2 p-1 rounded-md hover:bg-blue-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-[#1677ff] shrink-0" />
                  <span className="font-medium text-slate-700">集团-经营单位-项目公司多级指标穿透管控</span>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-md hover:bg-blue-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-[#1677ff] shrink-0" />
                  <span className="font-medium text-slate-700">工厂整体-核心产品-关键工序多维指标分类管理</span>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-md hover:bg-blue-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-[#1677ff] shrink-0" />
                  <span className="font-medium text-slate-700">零碳指标集中监管&绿电运行在线监测</span>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-md hover:bg-blue-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-[#1677ff] shrink-0" />
                  <span className="font-medium text-slate-700">能耗能效多维分析&零碳项目综合评估</span>
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

              </div>

              {/* 描述信息列表 (4 项) */}
              <div className="space-y-2 text-xs pt-1 text-slate-600 font-sans">
                <div className="flex items-center gap-2 p-1 rounded-md hover:bg-emerald-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-700">产品碳足迹在线核算及快速认证</span>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-md hover:bg-emerald-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-700">碳足迹结果与实测数据的穿透管理</span>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-md hover:bg-emerald-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-700">构建电工装备产品碳足迹实景数据库</span>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-md hover:bg-emerald-50/50 transition-colors">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-700">应对CBAM知识库建设</span>
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
      </main>

      {/* 🌟 5. 底部标准版权栏 */}
      <footer className="relative z-20 h-12 border-t border-[#e5e7eb]/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between text-xs text-slate-500">
        <div>
          <span>© 2026 特变电工电气装备集团</span>
        </div>
        <div className="flex items-center gap-4">
          <span>原型版本：<strong className="text-slate-800 font-mono font-bold">v1.01 (TBEA Corporate Edition)</strong></span>
          <span>技术栈：Next.js 16 + React 19 + TypeScript</span>
        </div>
      </footer>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
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
  Lightbulb,
} from 'lucide-react'
import { platformMeta, type PlatformKey } from '@/lib/nav-config'
import { cn } from '@/lib/utils'

interface ShellProps {
  children: React.ReactNode
  platformKey?: PlatformKey
}

export function PlatformShell({ children, platformKey }: ShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    集中监管: true,
    能耗能效分析: true,
    碳排管理: true,
    零碳项目评估: false,
    系统配置: false,
  })

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

  // 根据当前路径自动判断所属平台
  const resolvedPlatformKey: PlatformKey =
    platformKey ||
    (pathname.startsWith('/carbon-footprint') ? 'carbon-footprint' : 'zero-carbon')

  const currentPlatform = platformMeta[resolvedPlatformKey]

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
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0f2f5] font-sans antialiased text-slate-800">
      {/* 1. 左侧特变电工皇家深蓝侧边栏 (100% 全高贯穿最顶到底) */}
      <aside
        className={cn(
          'bg-[#0958d9] text-white flex flex-col h-screen shrink-0 transition-all duration-300 z-30 shadow-xl',
          sidebarOpen ? 'w-56' : 'w-16'
        )}
      >
        {/* 顶部特变电工官方 LOGO 品牌栏 */}
        <div className="h-14 px-3 border-b border-blue-400/20 bg-[#003eb3] flex items-center justify-between shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 overflow-hidden group focus:outline-none"
            title="特变电工能碳管控平台首页"
          >
            <div className="bg-white rounded px-1.5 py-0.5 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="TBEA 特变电工"
                className="h-5 w-auto object-contain"
                onError={(e) => {
                  const target = e.currentTarget
                  target.style.display = 'none'
                  if (target.parentElement) {
                    target.parentElement.innerHTML = '<span class="font-bold text-xs text-[#0958d9]">TBEA</span>'
                  }
                }}
              />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-xs tracking-wider block text-white whitespace-nowrap">
                  TBEA 特变电工
                </span>
                <span className="text-[9px] text-blue-200 block scale-90 -ml-1 whitespace-nowrap">
                  装备中国 · 装备世界
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* 侧边栏当前平台标题标识 */}
        <div className="px-3 py-2 border-b border-blue-400/20 bg-[#0747b0] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="size-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            {sidebarOpen && (
              <span className="font-bold text-[11px] text-blue-100 truncate">
                {currentPlatform.name}
              </span>
            )}
          </div>
        </div>

        {/* 菜单列表 */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          {currentPlatform.nav.map((item) => {
            const Icon = item.icon
            const hasChildren = item.children && item.children.length > 0
            const isSubOpen = openSubMenus[item.title]
            const isDirectActive = pathname === item.href
            const isChildActive =
              hasChildren && item.children!.some((c) => pathname.startsWith(c.href))
            const isActive = isDirectActive || isChildActive

            if (!hasChildren) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all group my-0.5',
                    isActive
                      ? 'bg-[#1677ff] text-white font-bold shadow-xs'
                      : 'text-blue-100 hover:text-white hover:bg-blue-600/50'
                  )}
                  title={!sidebarOpen ? item.title : undefined}
                >
                  <Icon className="size-4 shrink-0 text-white" />
                  {sidebarOpen && <span className="truncate">{item.title}</span>}
                </Link>
              )
            }

            return (
              <div key={item.title} className="space-y-0.5">
                <button
                  onClick={() => toggleSubMenu(item.title)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group my-0.5',
                    isActive
                      ? 'bg-[#1677ff] text-white font-bold'
                      : 'text-blue-100 hover:text-white hover:bg-blue-600/50'
                  )}
                  title={!sidebarOpen ? item.title : undefined}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Icon className="size-4 shrink-0 text-white" />
                    {sidebarOpen && <span className="truncate">{item.title}</span>}
                  </div>
                  {sidebarOpen && (
                    <span className="p-0.5 text-blue-200">
                      {isSubOpen ? (
                        <ChevronDown className="size-3.5" />
                      ) : (
                        <ChevronRight className="size-3.5" />
                      )}
                    </span>
                  )}
                </button>

                {/* 子菜单 */}
                {sidebarOpen && isSubOpen && (
                  <div className="ml-4 pl-2 border-l border-blue-400/30 space-y-0.5 py-0.5">
                    {item.children!.map((sub) => {
                      const isSubActive = pathname === sub.href
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            'block px-2.5 py-1.5 rounded text-xs transition-colors',
                            isSubActive
                              ? 'bg-blue-600/80 text-white font-bold'
                              : 'text-blue-100 hover:text-white hover:bg-blue-600/40'
                          )}
                        >
                          {sub.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 侧边栏底部快速切换 */}
        {sidebarOpen && (
          <div className="p-2 border-t border-blue-400/20 bg-[#003eb3]/60">
            {resolvedPlatformKey === 'zero-carbon' ? (
              <Link
                href="/carbon-footprint/cockpit"
                className="flex items-center justify-between p-2 rounded bg-blue-700/50 hover:bg-blue-700 text-xs transition-all text-blue-100 hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <Leaf className="size-3.5 text-emerald-300" />
                  <span className="font-medium text-[11px]">切换至 碳足迹集采中心</span>
                </div>
                <ChevronRight className="size-3 text-blue-300" />
              </Link>
            ) : (
              <Link
                href="/zero-carbon/screen"
                className="flex items-center justify-between p-2 rounded bg-blue-700/50 hover:bg-blue-700 text-xs transition-all text-blue-100 hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  <Globe2 className="size-3.5 text-blue-300" />
                  <span className="font-medium text-[11px]">切换至 零碳园区集控中心</span>
                </div>
                <ChevronRight className="size-3 text-blue-300" />
              </Link>
            )}
          </div>
        )}
      </aside>

      {/* 2. 右侧主体容器 (flex-col: 顶部主条 + 滚动主内容区) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* 右侧顶部白色主导航条 (已移除右上角 AI 问答入口，改至右下角悬浮) */}
        <header className="h-14 border-b border-[#e5e7eb] bg-white px-4 flex items-center justify-between shrink-0 shadow-xs">
          {/* 左侧：折叠按钮 + 双中心切换胶囊 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="折叠/展开侧边栏"
            >
              <Menu className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800 tracking-wide">
                能碳管控“双中心”数字化集成平台
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-mono font-bold">
                v1.01
              </span>
            </div>

            {/* 双中心切换胶囊 */}
            <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 ml-3 text-xs">
              <Link
                href="/zero-carbon/screen"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all',
                  resolvedPlatformKey === 'zero-carbon'
                    ? 'bg-white text-[#1677ff] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Globe2 className="size-3.5 text-[#1677ff]" />
                零碳园区集控中心
              </Link>
              <Link
                href="/carbon-footprint/cockpit"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all',
                  resolvedPlatformKey === 'carbon-footprint'
                    ? 'bg-white text-[#1677ff] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Leaf className="size-3.5 text-emerald-600" />
                产品碳足迹集采中心
              </Link>
            </div>
          </div>

          {/* 右侧工具栏：开发手册 + 管理配置 + 用户头像 */}
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1"
              title="需求与架构规范文档"
            >
              <FileText className="size-4" />
              <span className="hidden xl:inline">开发手册</span>
            </Link>

            <Link
              href="/system"
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1"
              title="系统管理"
            >
              <Settings className="size-4" />
              <span className="hidden xl:inline">管理配置</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* 用户头像信息 */}
            <div className="flex items-center gap-2 pl-1">
              <div className="size-7 rounded-full bg-[#1677ff] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                管
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-slate-800 block leading-tight">
                  管理员 (倪总)
                </span>
                <span className="text-[10px] text-slate-400 block">
                  特变电工电装集团
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 主内容区 (滚动视口) */}
        <main className="flex-1 overflow-y-auto p-3.5 md:p-4 bg-[#f0f2f5] relative">
          {children}
        </main>
      </div>

      {/* ======================================================== */}
      {/* 🌟 3. 页面右下角固定浮层图标与 AI 对话框窗口 */}
      {/* ======================================================== */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {/* 弹出对话框窗口 */}
        {isAiOpen && (
          <div className="w-96 sm:w-[420px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 mb-3 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
            {/* 窗口头部 */}
            <div className="bg-gradient-to-r from-[#0958d9] to-[#1677ff] p-3.5 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="size-4.5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-xs flex items-center gap-1.5">
                    特变电工 AI 能碳智能专家
                    <span className="text-[9px] bg-emerald-400 text-slate-900 font-bold px-1.5 py-0.2 rounded-full">
                      在线
                    </span>
                  </h3>
                  <p className="text-[10px] text-blue-100">
                    基于集团 15 园区与 21 工厂实时中枢大模型
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                title="关闭窗口"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 消息滚动区 */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/70 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex flex-col gap-1',
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <span>{m.sender === 'user' ? '您' : 'AI 智能专家'}</span>
                    <span>·</span>
                    <span>{m.time}</span>
                    {m.tag && (
                      <span className="ml-1 px-1.5 py-0.2 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-bold">
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      'p-3 rounded-xl max-w-[90%] leading-relaxed',
                      m.sender === 'user'
                        ? 'bg-[#1677ff] text-white rounded-br-none shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* 快捷推荐提问 */}
            <div className="p-2 bg-white border-t border-slate-100 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 block px-1 mb-1">
                💡 猜您想问：
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <button
                  onClick={() => handleSendAi('沈变本部真空干燥车间蒸汽超标原因是什么？')}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-[#1677ff] border border-slate-200 transition-colors text-slate-700 text-left truncate max-w-[200px]"
                >
                  ⚡ 沈变干燥车间蒸汽超标原因？
                </button>
                <button
                  onClick={() => handleSendAi('全集团哪家工厂单位单耗最高，需要重点监管？')}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-[#1677ff] border border-slate-200 transition-colors text-slate-700 text-left truncate max-w-[200px]"
                >
                  🏭 哪家工厂单耗最高需监管？
                </button>
              </div>
            </div>

            {/* 底部输入框 */}
            <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAi()}
                placeholder="输入能耗、碳排、CBAM关税或工艺问题..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1677ff]"
              />
              <button
                onClick={() => handleSendAi()}
                className="size-8 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-xs"
                title="发送"
              >
                <Send className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 🌟 右下角固定常驻 横向 AI助手 悬浮胶囊 */}
        <button
          onClick={() => setIsAiOpen(!isAiOpen)}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95 group focus:outline-none ring-2 ring-white',
            isAiOpen
              ? 'bg-slate-900 text-white shadow-slate-900/40'
              : 'bg-gradient-to-r from-[#0958d9] via-[#1677ff] to-[#0284c7] text-white shadow-blue-500/40 hover:shadow-blue-500/60'
          )}
          title="点击打开特变电工 AI助手"
        >
          <div className="size-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="size-3.5 text-white animate-pulse" />
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

'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Globe2,
  Leaf,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Zap,
  Cpu,
  BarChart3,
  Layers,
  ShieldCheck,
  Database,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 用户角色定义与权限中枢映射
interface UserRoleProfile {
  name: string
  roleTitle: string
  orgName: string
  defaultPath: string
  badge: string
}

const KNOWN_ROLES: Record<string, UserRoleProfile> = {
  tbea_admin: {
    name: '倪总',
    roleTitle: '集团总指挥',
    orgName: '特变电工电装集团',
    defaultPath: '/',
    badge: '集团管控层',
  },
  sb_entry01: {
    name: '李工',
    roleTitle: '能碳专员',
    orgName: '东北输变电产业园 · 沈变本部',
    defaultPath: '/',
    badge: '工厂填报专员',
  },
  pcf_expert: {
    name: '陈老师',
    roleTitle: '碳足迹专家',
    orgName: '电工装备碳足迹认证中心',
    defaultPath: '/',
    badge: '碳核算专家',
  },
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromUrl = searchParams.get('from') || ''

  // 表单状态：仅用户名和密码
  const [username, setUsername] = useState('tbea_admin')
  const [password, setPassword] = useState('Password@2026')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(true)

  // 交互状态
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // 提交登录处理：系统根据用户角色自动分配权限并路由到门户页面
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!agreeTerms) {
      setErrorMsg('请阅读并同意特变电工《工业信息安全保密守则》！')
      return
    }

    const trimmedUser = username.trim()
    if (!trimmedUser) {
      setErrorMsg('请输入企业工号或统一账号！')
      return
    }
    if (!password) {
      setErrorMsg('请输入登录密码！')
      return
    }

    setIsLoading(true)

    // 系统根据账号智能匹配角色与功能权限
    const roleProfile: UserRoleProfile = KNOWN_ROLES[trimmedUser] || {
      name: trimmedUser,
      roleTitle:
        trimmedUser.toLowerCase().includes('pcf') || trimmedUser.toLowerCase().includes('carbon')
          ? '碳足迹专家'
          : '工业能碳工程师',
      orgName: '特变电工电装集团',
      defaultPath: '/',
      badge: '业务操作员',
    }

    try {
      if (rememberMe) {
        localStorage.setItem('tbea-saved-username', trimmedUser)
      } else {
        localStorage.removeItem('tbea-saved-username')
      }
      localStorage.setItem(
        'tbea-current-user',
        JSON.stringify({
          username: trimmedUser,
          name: roleProfile.name,
          roleTitle: roleProfile.roleTitle,
          orgName: roleProfile.orgName,
          badge: roleProfile.badge,
        })
      )
    } catch {}

    // 模拟工业级轻量鉴权与凭证写入，跳转至门户平台
    setTimeout(() => {
      setIsLoading(false)
      setSuccessMsg(`身份核验通过，已自动分配【${roleProfile.roleTitle}】权限，正在进入能碳管控门户平台...`)

      // 点击登录后跳转到门户页面 (/)
      const dest = '/'

      setTimeout(() => {
        router.push(dest)
      }, 500)
    }, 600)
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-[#061129] via-[#091838] to-[#030815] text-white select-none overflow-x-hidden font-sans">
      {/* 顶部微透装饰科技顶线 */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-[#2C7CFF] to-cyan-400 shrink-0" />

      {/* 工业质感实景底图与科技光流暗纹 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-15 mix-blend-luminosity">
          <Image
            src="/images/screen/platform-16-9.jpg"
            alt="TBEA Industry Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* 背景微网格 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />
        {/* 右侧登录框后方柔和科技蓝光晕 */}
        <div className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        {/* 左侧顶端科技青蓝光晕 */}
        <div className="absolute left-[8%] top-[12%] w-[480px] h-[480px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 主工作区：左侧紧凑精炼的双中心全景，右侧靠右对齐的深邃科技微透登录框 */}
      <main className="relative z-10 flex-1 w-full max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 flex flex-col lg:flex-row items-center justify-between py-10 lg:py-6 gap-8 lg:gap-12 my-auto">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* 左侧区域：特变电工特高压工业视觉与双中心极简介绍 (紧凑缩小，要求简单) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="flex-1 w-full max-w-xl lg:max-w-2xl space-y-6">
          {/* 官方品牌 Logo 与系统双行名称 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="relative size-12 rounded-xl border border-white/20 bg-white/10 p-1.5 flex items-center justify-center shrink-0 shadow-md backdrop-blur-md">
                <Image
                  src="/logo-white.png"
                  alt="特变电工 Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-wide leading-tight">
                  特变电工能碳数字化双中心
                </h1>
                <p className="text-[11px] text-blue-200/80 font-mono tracking-wider font-semibold mt-0.5">
                  PARK CONTROL & CARBON FOOTPRINT CENTER
                </p>
              </div>
            </div>

            {/* 顶栏业务定位与动态运行状态 */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-200 text-xs font-mono">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>工业微电网实时集控 × 全生命周期碳足迹核算</span>
            </div>
          </div>

          {/* 双中心核心架构卡片（极简克制设计，去繁就简，通透清晰） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 中心 1：零碳园区集控中心 (EMS) */}
            <div className="rounded-xl border border-white/15 bg-[#08152E]/70 backdrop-blur-md p-4.5 space-y-2.5 hover:border-cyan-400/40 hover:bg-[#08152E]/85 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Globe2 className="size-4.5 text-cyan-400" />
                  <span>零碳园区集控中心</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300/80 px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30">
                  EMS
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                统筹 15 大绿色园区光储充微网协同调度，特高压工序能耗与万元产值单耗穿透分析。
              </p>
            </div>

            {/* 中心 2：产品碳足迹集采中心 (PCF & CBAM) */}
            <div className="rounded-xl border border-white/15 bg-[#08152E]/70 backdrop-blur-md p-4.5 space-y-2.5 hover:border-emerald-400/40 hover:bg-[#08152E]/85 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Leaf className="size-4.5 text-emerald-400" />
                  <span>产品碳足迹集采中心</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300/80 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                  PCF
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                覆盖全产业链电气装备，提供全生命周期 LCA 碳排放核算与欧盟 CBAM 边境合规申报。
              </p>
            </div>
          </div>

          {/* 工业底座关键量化指标（紧凑精炼） */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center font-mono">
            <div className="space-y-0.5 py-2 px-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[11px] text-slate-400">重点制造厂</div>
              <div className="text-xl font-bold text-white">
                21<span className="text-xs font-normal text-slate-400 ml-1">家</span>
              </div>
            </div>
            <div className="space-y-0.5 py-2 px-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[11px] text-slate-400">绿色工业园</div>
              <div className="text-xl font-bold text-cyan-300">
                15<span className="text-xs font-normal text-cyan-300/70 ml-1">个</span>
              </div>
            </div>
            <div className="space-y-0.5 py-2 px-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="text-[11px] text-slate-400">核算主产品</div>
              <div className="text-xl font-bold text-emerald-300">
                11<span className="text-xs font-normal text-emerald-300/70 ml-1">类</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 右侧区域：重新设计的高定深邃科技微透登录框 (靠右对齐，契合宽屏) */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-[430px] shrink-0 lg:ml-auto">
          <div className="relative rounded-2xl border border-white/15 bg-[#0B172E]/85 backdrop-blur-2xl p-7 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(44,124,255,0.2)] overflow-hidden space-y-5">
            {/* 顶部微光渐变流线装饰 */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#2C7CFF] to-cyan-400" />

            {/* 登录框头部 */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-[#2C7CFF]/15 border border-[#2C7CFF]/30 flex items-center justify-center text-[#41C0FF]">
                  <Lock className="size-4" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  统一身份登录
                </h2>
              </div>
              <p className="text-xs text-slate-400 pl-10.5">
                请输入您的企业工号或统一账号
              </p>
            </div>

            {/* 登录表单：仅用户名和密码 */}
            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              {/* 错误提示 */}
              {errorMsg && (
                <div className="p-2.5 rounded-lg border border-red-500/40 bg-red-950/40 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="size-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {/* 成功提示 */}
              {successMsg && (
                <div className="p-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 1. 用户名 / 企业工号 */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>企业工号 / 统一账号</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="size-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入工号或统一账号 (如 tbea_admin)"
                    className="w-full h-[44px] pl-10 pr-3 rounded-lg border border-white/15 bg-white/[0.05] text-xs font-mono font-medium text-white placeholder:text-slate-500 focus:bg-white/[0.08] focus:border-[#2C7CFF] focus:ring-2 focus:ring-[#2C7CFF]/30 focus:outline-none transition-all shadow-inner"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* 2. 登录密码 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    登录密码
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert('请联系特变电工数字化中心运维重置工号密码！\n服务热线：0994-6558888')
                    }
                    className="text-[11px] text-[#41C0FF] hover:text-cyan-300 hover:underline cursor-pointer transition-colors"
                  >
                    忘记密码?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="size-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入登录密码"
                    className="w-full h-[44px] pl-10 pr-10 rounded-lg border border-white/15 bg-white/[0.05] text-xs font-mono font-medium text-white placeholder:text-slate-500 focus:bg-white/[0.08] focus:border-[#2C7CFF] focus:ring-2 focus:ring-[#2C7CFF]/30 focus:outline-none transition-all shadow-inner"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer transition-colors"
                    title={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* 记住账号 */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-3.5 rounded border-white/20 bg-white/10 text-[#2C7CFF] focus:ring-[#2C7CFF] cursor-pointer"
                  />
                  <span>记住企业账号 (下次免重输)</span>
                </label>
              </div>

              {/* 立即登录主按钮 (高度 42px，实心科技蓝 #2C7CFF，圆角 8px，白字白图标) */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full h-[42px] rounded-lg bg-[#2C7CFF] hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                  isLoading && 'animate-pulse'
                )}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>正在进行凭证鉴权与权限解析...</span>
                  </>
                ) : (
                  <>
                    <span>立即登录</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              {/* 服务协议与保密守则勾选 */}
              <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="size-3.5 mt-0.5 rounded border-white/20 bg-white/10 text-[#2C7CFF] focus:ring-[#2C7CFF] cursor-pointer shrink-0"
                />
                <span className="leading-tight">
                  已阅读并同意特变电工
                  <span className="text-[#41C0FF] hover:underline cursor-pointer mx-1">
                    《工业信息安全保密守则》
                  </span>
                </span>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* 底部版权与国家能耗在线监测法律声明 */}
      <footer className="relative z-10 w-full py-3 text-center text-[11px] text-blue-200/60 border-t border-white/10 shrink-0 space-y-0.5">
        <p>特变电工股份有限公司 版权所有 © 2026 TBEA Co., Ltd. All Rights Reserved.</p>
        <p className="font-mono text-[10px] text-blue-200/40">
          工业和信息化部 重点用能单位能耗在线监测系统标准 · 推荐使用最新版 Chrome / Edge 浏览器访问
        </p>
      </footer>
    </div>
  )
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#07132B] flex items-center justify-center text-blue-200 text-sm">
          正在加载特变电工能碳数字化双中心登录中枢...
        </div>
      }
    >
      <LoginContent />
    </React.Suspense>
  )
}

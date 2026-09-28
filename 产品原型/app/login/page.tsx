'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  User,
  Lock,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Globe2,
  Leaf,
  CheckCircle2,
  Building2,
  Factory,
  RefreshCw,
  AlertCircle,
  Cpu,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 典型体验预置角色 (严格对齐日前需求评审会议三类人员)
interface PresetRole {
  id: string
  name: string
  roleTitle: string
  orgName: string
  username: string
  password: string
  targetCenter: 'zero-carbon' | 'carbon-footprint' | 'portal'
  badge: string
}

const PRESET_ROLES: PresetRole[] = [
  {
    id: 'group',
    name: '倪总',
    roleTitle: '集团总指挥',
    orgName: '特变电工电装集团',
    username: 'tbea_admin',
    password: 'Password@2026',
    targetCenter: 'zero-carbon',
    badge: '集团管控层',
  },
  {
    id: 'factory',
    name: '李工',
    roleTitle: '能碳专员',
    orgName: '东北输变电产业园 · 沈变本部',
    username: 'sb_entry01',
    password: 'Password@2026',
    targetCenter: 'zero-carbon',
    badge: '工厂填报专员',
  },
  {
    id: 'carbon',
    name: '陈老师',
    roleTitle: '碳足迹专家',
    orgName: '电工装备碳足迹认证中心',
    username: 'pcf_expert',
    password: 'Password@2026',
    targetCenter: 'carbon-footprint',
    badge: '碳核算专家',
  },
]

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromUrl = searchParams.get('from') || ''

  // 登录模式：'account' 账号密码 | 'phone' 手机验证码
  const [loginMode, setLoginMode] = useState<'account' | 'phone'>('account')

  // 表单状态
  const [username, setUsername] = useState('tbea_admin')
  const [password, setPassword] = useState('Password@2026')
  const [phone, setPhone] = useState('13800108888')
  const [smsCode, setSmsCode] = useState('886622')
  const [captchaInput, setCaptchaInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(true)

  // 目标业务中心
  const [targetCenter, setTargetCenter] = useState<'zero-carbon' | 'carbon-footprint' | 'portal'>('zero-carbon')

  // 验证码机制 (简单数学计算题，防恶意刷接口)
  const [captchaMath, setCaptchaMath] = useState({ num1: 18, num2: 7, answer: 25 })
  const refreshCaptcha = () => {
    const n1 = Math.floor(Math.random() * 20) + 10
    const n2 = Math.floor(Math.random() * 15) + 5
    setCaptchaMath({ num1: n1, num2: n2, answer: n1 + n2 })
    setCaptchaInput('')
  }

  // 短信倒计时
  const [countdown, setCountdown] = useState(0)
  const handleSendSms = () => {
    if (countdown > 0) return
    if (!phone || phone.length !== 11) {
      setErrorMsg('请输入正确的11位中国大陆手机号码！')
      return
    }
    setErrorMsg('')
    setCountdown(60)
  }

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // 交互状态
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // 快捷切换预置角色
  const handleSelectRole = (role: PresetRole) => {
    setUsername(role.username)
    setPassword(role.password)
    setTargetCenter(role.targetCenter)
    setErrorMsg('')
  }

  // 提交登录处理
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!agreeTerms) {
      setErrorMsg('请阅读并勾选特变电工《工业网络与信息安全保密协议》！')
      return
    }

    if (loginMode === 'account') {
      if (!username.trim()) {
        setErrorMsg('请输入企业工号或统一办公邮箱！')
        return
      }
      if (!password) {
        setErrorMsg('请输入登录密码！')
        return
      }
      // 验证码简易校验 (若输入则需正确，默认也可通过)
      if (captchaInput && parseInt(captchaInput, 10) !== captchaMath.answer) {
        setErrorMsg('安全验证码计算错误，请重新输入！')
        refreshCaptcha()
        return
      }
    } else {
      if (!phone || phone.length !== 11) {
        setErrorMsg('请输入有效的11位手机号码！')
        return
      }
      if (!smsCode || smsCode.length < 4) {
        setErrorMsg('请输入收到的短信动态验证码！')
        return
      }
    }

    setIsLoading(true)

    // 模拟工业级轻量鉴权与凭证写入
    setTimeout(() => {
      setIsLoading(false)
      setSuccessMsg('身份凭据验证成功，正在进入特变电工能碳数字化双中心...')

      let dest = fromUrl
      if (!dest) {
        if (targetCenter === 'zero-carbon') {
          dest = '/zero-carbon/monitor/indicator'
        } else if (targetCenter === 'carbon-footprint') {
          dest = '/carbon-footprint/cockpit'
        } else {
          dest = '/'
        }
      }

      setTimeout(() => {
        router.push(dest)
      }, 600)
    }, 700)
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#F3F7FB] dark:bg-[#060d1f] text-foreground select-none overflow-x-hidden font-sans">
      {/* 顶部微透工业质感装饰顶线 */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-primary to-cyan-400" />

      {/* 主体容器：自适应网格或分屏 */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl rounded-lg border border-[#DBE6EE] dark:border-border bg-[#FFFFFF] dark:bg-[#0b1324] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* 左侧区域：特变电工特高压工业视觉与双中心全景介绍 (占5列) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 bg-gradient-to-br from-[#0B1739] via-[#0E204E] to-[#08112B] text-white border-r border-[#DBE6EE]/20 dark:border-border overflow-hidden">
            {/* 背景科技纹理与微网实景图片 */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
              <Image
                src="/images/screen/platform-16-9.jpg"
                alt="TBEA Industry"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-radial-at-t from-blue-500/10 via-transparent to-transparent pointer-events-none" />

            {/* 左侧顶栏：官方品牌 Logo 与系统双行名称 */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-lg overflow-hidden border border-white/20 bg-white/10 p-1 flex items-center justify-center shrink-0">
                  <Image
                    src="/logo-white.png"
                    alt="特变电工 Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-base font-bold text-white tracking-wide leading-snug">
                    特变电工能碳数字化双中心
                  </h1>
                  <p className="text-[10px] text-blue-200/80 font-mono tracking-wider font-semibold">
                    PARK CONTROL & CARBON FOOTPRINT CENTER
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-mono">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>工业微电网与电气装备碳足迹集采中枢</span>
              </div>
            </div>

            {/* 左侧中部：双中心业务核心亮点 */}
            <div className="relative z-10 space-y-4 my-auto py-6">
              <div className="p-3.5 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Globe2 className="size-4 text-cyan-400" />
                  <span>零碳园区集控中心 (EMS)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  集团-产业园-工厂三级穿透，全景管控 15 大绿色园区光储充微电网、47 项核心工序能效与万元产值能耗。
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-white/10 bg-white/5 backdrop-blur-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Leaf className="size-4 text-emerald-400" />
                  <span>产品碳足迹集采中心 (PCF & CBAM)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  电工装备 LCA 全生命周期核算、权威因子库与欧盟碳关税（CBAM）合规填报，构筑绿色出海核心竞争力。
                </p>
              </div>
            </div>

            {/* 左侧底栏：工业底座指标与权威数据 */}
            <div className="relative z-10 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center font-mono">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400">重点制造厂</div>
                <div className="text-base font-bold text-white">21<span className="text-[10px] font-normal ml-0.5">家</span></div>
              </div>
              <div className="space-y-0.5 border-x border-white/10">
                <div className="text-[10px] text-slate-400">绿色工业园</div>
                <div className="text-base font-bold text-cyan-300">15<span className="text-[10px] font-normal ml-0.5">个</span></div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400">核算主产品</div>
                <div className="text-base font-bold text-emerald-300">11<span className="text-[10px] font-normal ml-0.5">类</span></div>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 右侧区域：高密度工业登录面板 (占7列) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            {/* 顶栏标题与角色快捷选择 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground tracking-tight">
                    用户统一身份验证
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    请输入您的特变电工统一身份账号或使用手机动态校验码
                  </p>
                </div>

                {/* 移动端/小屏 Logo 备用显示 */}
                <div className="lg:hidden flex size-9 items-center justify-center rounded-lg border border-border bg-panel p-1">
                  <Image
                    src="/logo-white.png"
                    alt="Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* 快捷角色体验栏 (契合评审会议要求的三类角色) */}
              <div className="p-2.5 rounded-lg border border-[#DBE6EE] dark:border-border bg-[#F8FAFC] dark:bg-[#070e1e] space-y-1.5">
                <div className="text-[11px] font-bold text-muted-foreground flex items-center justify-between">
                  <span>💡 评审验证 · 典型用户角色一键填充：</span>
                  <span className="text-[10px] text-primary font-normal">快速体验免手动输入</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleSelectRole(role)}
                      className={cn(
                        'flex flex-col items-start p-2 rounded-lg border text-left cursor-pointer transition-all',
                        username === role.username
                          ? 'border-[#2C7CFF] bg-[#2C7CFF]/10 text-primary ring-1 ring-[#2C7CFF]/30 font-bold'
                          : 'border-border bg-card hover:border-[#2C7CFF]/50 text-foreground'
                      )}
                      title={`快速以【${role.name} (${role.roleTitle})】身份登录`}
                    >
                      <span className="text-xs truncate w-full font-bold">{role.name} · {role.roleTitle}</span>
                      <span className="text-[10px] text-muted-foreground truncate w-full mt-0.5">{role.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 登录方式切换 TAB (严格按 tbea-industrial-design 规范：激活态实心科技蓝 #2C7CFF + 白字加粗 + 8px 圆角) */}
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('account')
                    setErrorMsg('')
                  }}
                  className={cn(
                    'h-[36px] px-4 rounded-lg text-xs transition-all cursor-pointer select-none',
                    loginMode === 'account'
                      ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-panel'
                  )}
                >
                  账号密码登录
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('phone')
                    setErrorMsg('')
                  }}
                  className={cn(
                    'h-[36px] px-4 rounded-lg text-xs transition-all cursor-pointer select-none',
                    loginMode === 'phone'
                      ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-panel'
                  )}
                >
                  手机动态码登录
                </button>
              </div>
            </div>

            {/* 登录表单主体 */}
            <form onSubmit={handleLogin} className="space-y-4 my-3">
              {/* 错误或成功提示横条 */}
              {errorMsg && (
                <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 模式一：账号密码登录 */}
              {loginMode === 'account' ? (
                <div className="space-y-3">
                  {/* 工号/账号输入框 */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>企业工号 / 邮箱</span>
                      <span className="text-[11px] text-muted-foreground font-normal">支持 OA 工号或企业邮箱</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <User className="size-4" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="请输入统一工号 (如 tbea_admin)"
                        className="w-full h-[40px] pl-9.5 pr-3 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-[#070e1e] text-xs font-mono font-medium text-foreground focus:border-[#2C7CFF] focus:ring-2 focus:ring-[#2C7CFF]/20 focus:outline-none transition-all shadow-2xs"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  {/* 密码输入框 */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>登录密码</span>
                      <button
                        type="button"
                        onClick={() => alert('请联系特变电工数字化信息化运维支持专员重置企业工号密码！\n热线：0994-6558888')}
                        className="text-[11px] text-[#2C7CFF] hover:underline cursor-pointer"
                      >
                        忘记密码?
                      </button>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Lock className="size-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入企业安全访问密码"
                        className="w-full h-[40px] pl-9.5 pr-10 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-[#070e1e] text-xs font-mono font-medium text-foreground focus:border-[#2C7CFF] focus:ring-2 focus:ring-[#2C7CFF]/20 focus:outline-none transition-all shadow-2xs"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                        title={showPassword ? '隐藏密码' : '显示密码'}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 安全数学计算验证码 */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>安全计算验证码</span>
                      <span className="text-[11px] text-muted-foreground font-normal">防暴力撞库安全保护</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <ShieldCheck className="size-4" />
                        </div>
                        <input
                          type="text"
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          placeholder={`计算答案: ${captchaMath.num1} + ${captchaMath.num2} = ?`}
                          className="w-full h-[40px] pl-9.5 pr-3 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-[#070e1e] text-xs font-mono font-medium text-foreground focus:border-[#2C7CFF] focus:ring-2 focus:ring-[#2C7CFF]/20 focus:outline-none transition-all shadow-2xs"
                        />
                      </div>
                      <div
                        onClick={refreshCaptcha}
                        className="h-[40px] px-3.5 rounded-lg border border-border bg-[#F1F5F9] dark:bg-panel flex items-center gap-1.5 text-xs font-mono font-bold text-foreground cursor-pointer hover:border-primary/50 select-none shadow-2xs"
                        title="点击更换验证码题目"
                      >
                        <span className="text-primary">{captchaMath.num1}</span>
                        <span>+</span>
                        <span className="text-emerald-500">{captchaMath.num2}</span>
                        <span>= ?</span>
                        <RefreshCw className="size-3 text-muted-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 模式二：手机动态码登录 */
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>手机号码</span>
                      <span className="text-[11px] text-muted-foreground font-normal">已在集团 HR 系统实名绑定的手机</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Phone className="size-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="请输入11位手机号码"
                        maxLength={11}
                        className="w-full h-[40px] pl-9.5 pr-3 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-[#070e1e] text-xs font-mono font-medium text-foreground focus:border-[#2C7CFF] focus:ring-2 focus:ring-[#2C7CFF]/20 focus:outline-none transition-all shadow-2xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>短信动态校验码</span>
                      <span className="text-[11px] text-muted-foreground font-normal">有效期 5 分钟</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <ShieldCheck className="size-4" />
                        </div>
                        <input
                          type="text"
                          value={smsCode}
                          onChange={(e) => setSmsCode(e.target.value)}
                          placeholder="请输入6位短信动态码"
                          maxLength={6}
                          className="w-full h-[40px] pl-9.5 pr-3 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-[#070e1e] text-xs font-mono font-medium text-foreground focus:border-[#2C7CFF] focus:ring-2 focus:ring-[#2C7CFF]/20 focus:outline-none transition-all shadow-2xs"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendSms}
                        disabled={countdown > 0}
                        className={cn(
                          'h-[40px] px-3.5 rounded-lg border text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs',
                          countdown > 0
                            ? 'border-border bg-panel text-muted-foreground cursor-not-allowed'
                            : 'border-[#2C7CFF]/40 bg-[#2C7CFF]/10 text-[#2C7CFF] hover:bg-[#2C7CFF] hover:text-white'
                        )}
                      >
                        {countdown > 0 ? `${countdown}s 后重发` : '获取动态码'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 目标业务中心单选组 (登录后直达) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>登录后直达业务中枢：</span>
                  <span className="text-[10px] text-muted-foreground font-normal">可随时在左侧导航快速切换</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetCenter('zero-carbon')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 h-[36px] rounded-lg border text-xs cursor-pointer transition-all',
                      targetCenter === 'zero-carbon'
                        ? 'border-[#2C7CFF] bg-[#2C7CFF]/10 text-[#2C7CFF] font-bold ring-1 ring-[#2C7CFF]/30'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Globe2 className="size-3.5 shrink-0" />
                    <span className="truncate">零碳园区集控</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetCenter('carbon-footprint')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 h-[36px] rounded-lg border text-xs cursor-pointer transition-all',
                      targetCenter === 'carbon-footprint'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold ring-1 ring-emerald-500/30'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Leaf className="size-3.5 shrink-0" />
                    <span className="truncate">产品碳足迹集采</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetCenter('portal')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 h-[36px] rounded-lg border text-xs cursor-pointer transition-all',
                      targetCenter === 'portal'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold ring-1 ring-purple-500/30'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Layers className="size-3.5 shrink-0" />
                    <span className="truncate">双中心统一门户</span>
                  </button>
                </div>
              </div>

              {/* 记住账号复选框 */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-3.5 rounded border-[#E2E8F0] dark:border-border text-[#2C7CFF] focus:ring-[#2C7CFF] cursor-pointer"
                  />
                  <span>记住企业账号 (30天免重复输入)</span>
                </label>
                <span className="text-[11px] text-muted-foreground">版本号: v2.2-Release</span>
              </div>

              {/* 登录主按钮 (严格按 tbea-industrial-design 规范：高度 40px，实心科技蓝 #2C7CFF，圆角 8px，白字白图标) */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full h-[40px] rounded-lg bg-[#2C7CFF] hover:bg-[#2C7CFF]/90 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                  isLoading && 'animate-pulse'
                )}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>正在进行工信工业专网凭据核验...</span>
                  </>
                ) : (
                  <>
                    <span>立即登录双中心系统</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              {/* 服务协议与免责勾选 */}
              <div className="flex items-start gap-2 pt-1 text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="size-3.5 mt-0.5 rounded border-[#E2E8F0] dark:border-border text-[#2C7CFF] focus:ring-[#2C7CFF] cursor-pointer shrink-0"
                />
                <span className="leading-tight">
                  已阅读并同意特变电工
                  <span className="text-[#2C7CFF] hover:underline cursor-pointer mx-1">《工业信息安全与涉密守则》</span>
                  与
                  <span className="text-[#2C7CFF] hover:underline cursor-pointer mx-1">《能碳数字化运营服务条款》</span>
                </span>
              </div>
            </form>

            {/* 底部帮助与系统支持信息 */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>双中心生产服务正常运行</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert('特变电工数字化中枢服务支持：\n• 集团数字化部运维：0994-6558888\n• 能碳业务咨询：024-25888888 (沈变)\n• 邮箱：support@tbea.com')}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  系统支持
                </button>
                <span>·</span>
                <Link href="/" className="hover:text-primary transition-colors">
                  返回首页
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 底部版权与国家能耗在线监测法律声明 (客观中立、严谨规范) */}
      <footer className="w-full py-3 text-center text-[11px] text-muted-foreground/80 border-t border-[#DBE6EE] dark:border-border/50 bg-[#FFFFFF] dark:bg-[#070e1e] shrink-0 space-y-0.5">
        <p>
          特变电工股份有限公司 版权所有 © 2026 TBEA Co., Ltd. All Rights Reserved.
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/60">
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
        <div className="tech-grid min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
          正在加载特变电工能碳数字化双中心登录中枢...
        </div>
      }
    >
      <LoginContent />
    </React.Suspense>
  )
}

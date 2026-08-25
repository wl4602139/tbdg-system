'use client'

import { useState } from 'react'
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingDown,
  Layers,
  HelpCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge } from '@/components/shared/primitives'
import { LineTrend, Donut } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

type ChatMessage = {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  chartData?: any[]
  chartType?: 'line' | 'donut'
  jumpLink?: { label: string; href: string }
}

export default function AIAssistantPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: '您好！我是特变电工能碳管理智能助手。支持语音唤醒、自然语言问数（如“上个月哪个工厂单耗最高”、“生成沈变绿电消纳报告”）以及系统深度页面语音直达。请问有什么可以帮您？',
      timestamp: '14:00',
    },
    {
      id: '2',
      sender: 'user',
      text: '查询沈变本部近8个月综合能耗与碳排放趋势，并诊断是否存在异常工序？',
      timestamp: '14:01',
    },
    {
      id: '3',
      sender: 'assistant',
      text: '已为您检索【沈变本部】时序数据库。本月沈变本部综合能耗 1,284.5 tce，总碳排 3,420.8 tCO2。AI 诊断发现：高压干燥工序蒸汽单耗偏高 18%，建议排查 2 号干燥罐温控阀门。',
      timestamp: '14:01',
      chartType: 'line',
      chartData: [
        { period: '1月', 综合能耗: 1320, 总碳排: 3600 },
        { period: '2月', 综合能耗: 1250, 总碳排: 3450 },
        { period: '3月', 综合能耗: 1380, 总碳排: 3720 },
        { period: '4月', 综合能耗: 1310, 总碳排: 3500 },
        { period: '5月', 综合能耗: 1340, 总碳排: 3580 },
        { period: '6月', 综合能耗: 1290, 总碳排: 3460 },
        { period: '7月', 综合能耗: 1305, 总碳排: 3490 },
        { period: '8月', 综合能耗: 1284, 总碳排: 3420 },
      ],
      jumpLink: { label: '直达：沈变本部关键工序指标下钻 →', href: '/zero-carbon/monitor/indicator' },
    },
  ])

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: text,
      timestamp: '刚刚',
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')

    // 智能应答逻辑
    setTimeout(() => {
      let reply: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: '已为您查询完成。',
        timestamp: '刚刚',
      }

      if (text.includes('绿电') || text.includes('消纳')) {
        reply.text = '特变电工电装集团 8 月绿电综合占比 38.6%，其中自建屋顶分布式光伏消纳 184.5 万kWh，已达到国家级零碳工厂考核水平。'
        reply.jumpLink = { label: '一键查看绿电消纳分析报告 →', href: '/zero-carbon/monitor/green' }
      } else if (text.includes('CBAM') || text.includes('关税') || text.includes('出口')) {
        reply.text = '当前出口欧盟的变压器与电缆产品已完成 HS-CN 映射，单台隐含碳排放 1.42 tCO2，低于欧盟官方基准 38%，XML 季度合规申报包已生成。'
        reply.jumpLink = { label: '进入欧盟 CBAM 申报专区 →', href: '/carbon-footprint/cbam' }
      } else {
        reply.text = `已为您完成智能分析：“${text}”。系统各园区测点运行正常，未发现严重告警。`
      }

      setMessages((prev) => [...prev, reply])
    }, 600)
  }

  const toggleMic = () => {
    if (!isRecording) {
      setIsRecording(true)
      setTimeout(() => {
        setIsRecording(false)
        handleSend('生成沈变本部绿电消纳优化建议')
      }, 2500)
    } else {
      setIsRecording(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 顶部说明 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-primary">
            <Bot className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground flex items-center gap-2">
              特变电工能碳大模型智能问数助手
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-mono font-semibold">
                AI Agent
              </span>
            </h1>
            <p className="text-xs text-muted-foreground">
              基于大模型与 65 项能碳指标体系，支持自然语言问数、智能归因诊断与深层页面直达
            </p>
          </div>
        </div>
      </div>

      {/* 对话视口与快捷指令 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 左侧对话流 */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-xl bg-card border border-border min-h-[460px] flex flex-col justify-between space-y-4">
            {/* 消息历史 */}
            <div className="space-y-3.5 overflow-y-auto max-h-[380px] pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn('flex gap-2.5 text-xs', m.sender === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {m.sender === 'assistant' && (
                    <div className="size-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-primary shrink-0">
                      <Sparkles className="size-3.5" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'p-3.5 rounded-xl max-w-lg space-y-2',
                      m.sender === 'user'
                        ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                        : 'bg-accent/40 border border-border/60 text-foreground rounded-tl-none'
                    )}
                  >
                    <p className="leading-relaxed">{m.text}</p>

                    {/* 内嵌图表 */}
                    {m.chartData && (
                      <div className="h-44 mt-2 p-2 rounded-lg bg-card border border-border/60">
                        <LineTrend
                          data={m.chartData}
                          xKey="period"
                          lines={[
                            { key: '综合能耗', color: '#10b981' },
                            { key: '总碳排', color: '#0284c7' },
                          ]}
                        />
                      </div>
                    )}

                    {/* 直达跳转链接 */}
                    {m.jumpLink && (
                      <a
                        href={m.jumpLink.href}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:underline pt-1"
                      >
                        <span>{m.jumpLink.label}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 底部输入框与语音按钮 */}
            <div className="pt-3 border-t border-border flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={cn(
                  'p-2.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 font-medium shrink-0',
                  isRecording
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                    : 'bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground border-border'
                )}
                title="按住语音输入"
              >
                {isRecording ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                <span>{isRecording ? '正在识别...' : '语音'}</span>
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入您想查询的能碳问题，例如：“上月哪个工厂单耗最低”..."
                className="flex-1 bg-accent/40 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />

              <button
                onClick={() => handleSend()}
                className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shrink-0"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：推荐提问与语音指令快捷库 */}
        <div className="lg:col-span-4 space-y-3">
          <Panel className="p-4 space-y-2">
            <PanelTitle icon={HelpCircle}>推荐提问与快捷指令</PanelTitle>
            <div className="space-y-1.5 text-xs">
              {[
                '沈变本部本月非化石能源占比是多少？',
                '鲁缆本部立塔交联用电是否超标？',
                '生成 8 月份绿电消纳分析报告',
                '欧盟 CBAM 变压器出口碳关税测算',
                '跳转至线下数据人工录入页面',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-2 rounded-lg bg-accent/30 hover:bg-accent border border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground text-[11px] transition-colors"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

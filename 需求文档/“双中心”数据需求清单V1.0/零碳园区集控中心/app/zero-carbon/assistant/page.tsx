'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Send, Bot, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel } from '@/components/shared/primitives'

type Msg = { role: 'user' | 'assistant'; text: string; jump?: { label: string; href: string } }

const quickAsks = [
  '上个月哪个工厂单耗最高？',
  '本月碳排放进度如何？',
  '切换到集团驾驶舱',
  '去天津工厂',
  '查看电缆产线',
]

function answer(q: string): Msg {
  if (q.includes('单耗')) {
    return {
      role: 'assistant',
      text: '上个月单位产品综合能耗最高的是「衡阳电缆厂」，为 86.4 kgce/件，高于基准值 82，环比上升 3.2%。主要原因为交联工序能耗偏高，建议核查该工序设备运行状态。',
      jump: { label: '查看能耗能效分析', href: '/zero-carbon/energy' },
    }
  }
  if (q.includes('碳排放')) {
    return {
      role: 'assistant',
      text: '本月集团碳排放总量约 1,395 tCO2，同比下降 6.5%，已完成年度减排目标进度的 62%。其中范围二（外购电力）占比 49%，为主要排放源。',
      jump: { label: '查看碳管理', href: '/zero-carbon/carbon' },
    }
  }
  if (q.includes('驾驶舱') || q.includes('大屏')) {
    return { role: 'assistant', text: '好的，正在为您跳转到集控中心大屏……', jump: { label: '前往集控中心大屏', href: '/zero-carbon/screen' } }
  }
  if (q.includes('天津')) {
    return { role: 'assistant', text: '已定位「天津变压器厂」，正在为您打开集中监管页面。', jump: { label: '前往集中监管', href: '/zero-carbon/monitor' } }
  }
  if (q.includes('电缆') || q.includes('产线')) {
    return { role: 'assistant', text: '已为您筛选电缆产线相关指标，请在集中监管页面查看。', jump: { label: '前往集中监管', href: '/zero-carbon/monitor' } }
  }
  return { role: 'assistant', text: '我是零碳智能助手「小碳同学」。您可以询问能耗、单耗、碳排放等指标，或说出「切换到集团驾驶舱」「去天津工厂」等指令进行语音页面跳转。' }
}

export default function AssistantPage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: '您好，我是零碳智能助手「小碳同学」，可通过语音或文字为您解答指标问题、生成图表并跳转页面。试试点击下方常用问题。' },
  ])

  function submit(text: string) {
    const q = text.trim()
    if (!q) return
    setMsgs((m) => [...m, { role: 'user', text: q }, answer(q)])
    setInput('')
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="智能助手"
        positioning="小碳同学"
        desc="支持自定义唤醒词语音交互、自然语言指标问答（自动查询并生成播报与图表）与语音页面跳转。"
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <Panel bodyClassName="flex h-[520px] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={m.role === 'user' ? 'max-w-[78%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground' : 'max-w-[78%] rounded-2xl rounded-bl-sm border border-border bg-[var(--surface-2)] px-4 py-2.5 text-sm text-foreground'}>
                  {m.role === 'assistant' && (
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-primary">
                      <Bot className="size-3.5" /> 小碳同学
                    </div>
                  )}
                  <p className="leading-relaxed">{m.text}</p>
                  {m.jump && (
                    <button
                      onClick={() => router.push(m.jump!.href)}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs text-primary hover:bg-primary/20"
                    >
                      <Sparkles className="size-3" /> {m.jump.label} →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            <button
              onClick={() => {
                setListening((v) => !v)
                if (!listening) setTimeout(() => { setListening(false); submit('本月碳排放进度如何？') }, 1500)
              }}
              className={
                listening
                  ? 'flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--destructive)] text-white'
                  : 'flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-[var(--surface-2)] text-primary hover:bg-primary/10'
              }
              aria-label="语音输入"
            >
              <Mic className="size-5" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) submit(input)
              }}
              placeholder={listening ? '正在聆听……' : '输入问题，或点击麦克风语音提问'}
              className="form-input flex-1"
            />
            <button onClick={() => submit(input)} className="btn-primary inline-flex items-center gap-1.5">
              <Send className="size-4" /> 发送
            </button>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="常用问题">
            <div className="flex flex-col gap-2">
              {quickAsks.map((q) => (
                <button
                  key={q}
                  onClick={() => submit(q)}
                  className="rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10"
                >
                  {q}
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="唤醒词设置">
            <label className="text-sm text-[var(--muted)]">自定义唤醒词</label>
            <input className="form-input mt-1.5" defaultValue="小碳同学" />
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              支持中英文混合识别。说出唤醒词后即可进行语音指令与自然语言问答。
            </p>
          </Panel>
        </div>
      </div>
    </div>
  )
}

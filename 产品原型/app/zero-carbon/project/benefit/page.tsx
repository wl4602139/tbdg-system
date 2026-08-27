'use client'

import React, { useState } from 'react'
import {
  Coins,
  TrendingUp,
  Download,
  Building2,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  PieChart,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'
import { OrgTreeSidebar, type OrgNodeItem } from '@/components/shared/org-tree-sidebar'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

interface PlantBenefitRank {
  name: string
  project: string
  irr: number
  paybackYears: number
  annualSavings: number // 万元
  percent: number
  tone: 'emerald' | 'blue'
}

const PLANT_RANKS: PlantBenefitRank[] = [
  { name: '1. 沈变本部', project: '屋顶光伏 5.8MWp', irr: 13.5, paybackYears: 4.8, annualSavings: 468.0, percent: 92, tone: 'emerald' },
  { name: '2. 新变厂', project: '光伏 8MW + 储能 4MW/8MWh', irr: 12.8, paybackYears: 5.1, annualSavings: 580.0, percent: 86, tone: 'emerald' },
  { name: '3. 鲁缆公司', project: '柔性光伏 4.2MWp', irr: 11.9, paybackYears: 5.5, annualSavings: 345.0, percent: 79, tone: 'blue' },
  { name: '4. 衡变本部', project: '真空干燥余热回收蒸汽', irr: 11.2, paybackYears: 5.8, annualSavings: 185.0, percent: 74, tone: 'blue' },
  { name: '5. 新缆厂', project: '挤出机永磁变频节能技改', irr: 14.2, paybackYears: 4.5, annualSavings: 120.0, percent: 96, tone: 'emerald' },
  { name: '6. 德缆公司', project: '厂房屋顶光伏 2.5MWp', irr: 10.5, paybackYears: 6.2, annualSavings: 195.0, percent: 68, tone: 'blue' },
]

export default function ProjectBenefitEvaluationPage() {
  const [selectedOrg, setSelectedOrg] = useState<OrgNodeItem>({
    id: 'group_all',
    name: '特变电工集团 (电装大盘)',
    fullName: '特变电工集团（电装板块全景）',
    level: 'group',
  })

  // 25年累计现金流回本模拟数据 (以万元为单位)
  const cashflowData = [
    { year: '第0年 (初始投入)', 累计净现金流: -18500, 基准零线: 0 },
    { year: '第1年', 累计净现金流: -15400, 基准零线: 0 },
    { year: '第2年', 累计净现金流: -12100, 基准零线: 0 },
    { year: '第3年', 累计净现金流: -8700, 基准零线: 0 },
    { year: '第4年', 累计净现金流: -5200, 基准零线: 0 },
    { year: '第5年', 累计净现金流: -1600, 基准零线: 0 },
    { year: '第5.6年 (回本点)', 累计净现金流: 0, 基准零线: 0 },
    { year: '第6年', 累计净现金流: 1800, 基准零线: 0 },
    { year: '第8年', 累计净现金流: 5400, 基准零线: 0 },
    { year: '第10年', 累计净现金流: 8900, 基准零线: 0 },
    { year: '第15年', 累计净现金流: 14200, 基准零线: 0 },
    { year: '第20年', 累计净现金流: 18100, 基准零线: 0 },
    { year: '第25年', 累计净现金流: 21400, 基准零线: 0 },
  ]

  return (
    <div className="flex w-full items-start gap-4">
      {/* 🌟 左侧 270px 经典工业级导线拓扑树 */}
      <OrgTreeSidebar
        title="工厂与用能拓扑 (3级)"
        subtitle="全层级穿透"
        selectedId={selectedOrg.id}
        onSelect={(node) => setSelectedOrg(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 顶部控制与视角提示卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base shrink-0 border border-amber-200 shadow-2xs">
              💰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">{selectedOrg.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
                  🏢 集团全局大盘视角 (电装宏观总览)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                平准化度电成本 (LCOE)、动态投资回收期 (IRR/NPV)、电费账单对冲与碳资产增值双轮评估
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => alert('正在生成《特变电工减排项目投资回报与效益评估报告》...')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出效益分析</span>
            </button>
          </div>
        </div>

        {/* 4 栏效益大盘指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">全集团平准化度电成本 (LCOE)</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-700">0.268</span>
              <span className="text-xs text-slate-500">元 / kWh</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>外购市电: 0.650 元</span>
              <span className="text-emerald-700 font-bold">度电省 0.382 元</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">年化节约电费支出</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-blue-600">2,480.5</span>
              <span className="text-xs text-slate-500">万元 / 年</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>自发自用收益: 88.5%</span>
              <span className="text-blue-700">余电上网: 11.5%</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">全集团综合内部收益率 (IRR)</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-600">11.8%</span>
              <span className="text-xs text-slate-500">全投资内部收益</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>静态回收期: 5.6 年</span>
              <span className="text-emerald-700 font-bold">远超行业基准 (8%)</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">年化碳减排环境资产收益</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-amber-600">267.4</span>
              <span className="text-xs text-slate-500">万元 / 年</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>按 CCER 70元/t 估算</span>
              <span className="text-amber-700 font-bold">可核证资产</span>
            </div>
          </div>
        </div>

        {/* 2 栏图表：25年现金流回本测算 + 8大基地投资回报率横向对比 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  25 年项目生命周期累计净现金流与投资回收平衡点 (万元)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">第 5.6 年实现静态回本</span>
            </div>

            <div className="h-[260px]">
              <LineTrend
                data={cashflowData}
                xKey="year"
                height={260}
                lines={[
                  { key: '累计净现金流', name: '累计净现金流 (万元)', color: '#2563eb' },
                  { key: '基准零线', name: '收支平衡线 (0)', color: '#94a3b8' },
                ]}
              />
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  各主要基地新能源技改项目投资回报率 (IRR) 横向排名
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">全集团平均 IRR 11.8%</span>
            </div>

            <div className="space-y-3 pt-1 font-mono text-xs">
              {PLANT_RANKS.map((plant) => (
                <div key={plant.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-sans font-medium text-slate-800">{plant.name} ({plant.project})</span>
                    <span className={cn('font-bold', plant.tone === 'emerald' ? 'text-emerald-700' : 'text-blue-700')}>
                      IRR: {plant.irr}% (回本 {plant.paybackYears}年) · 年省 ¥{plant.annualSavings}万
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', plant.tone === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500')}
                      style={{ width: `${plant.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部敏感性分析与电费对冲说明 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>财务敏感性与电费账单对冲风险评估</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-mono">
            经敏感性压力测试：在电网工商业电价下浮 10% 极端情景下，全集团项目综合 IRR 仍保持在 10.2%（高于 8% 资本成本线）；在光伏组件年衰减增加 0.2% 情景下，全投资回收期仅后移 0.4 年。项目资产兼具高抗风险能力与长期碳资产溢价收益。
          </p>
        </div>
      </div>
    </div>
  )
}

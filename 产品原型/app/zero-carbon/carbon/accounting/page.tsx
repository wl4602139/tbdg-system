'use client'

import React, { useState } from 'react'
import {
  Leaf,
  Building2,
  Factory,
  RefreshCw,
  Download,
  Calendar,
  FileSpreadsheet,
  Layers,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  Flame,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react'
import { OrgTreeSidebar, type OrgNodeItem } from '@/components/shared/org-tree-sidebar'
import { cn } from '@/lib/utils'

interface FactoryCarbonCard {
  id: string
  name: string
  sub: string
  intensity: number
  unit: string
  yoy: string
  netCarbon: number
  status: '标杆领跑' | '达标改善' | '达标受控' | '标杆示范' | '超标预警'
  tone: 'ok' | 'info' | 'warn' | 'danger'
}

const FACTORY_CARDS: FactoryCarbonCard[] = [
  { id: 'ws_xb_main', name: '新变厂 (新疆特高压)', sub: '西北制造中心', intensity: 0.245, unit: 'tCO2/万元', yoy: '-8.4% ↓', netCarbon: 2.12, status: '标杆领跑', tone: 'ok' },
  { id: 'ws_sb_main', name: '沈变本部 (超高压中心)', sub: '东北制造中心', intensity: 0.312, unit: 'tCO2/万元', yoy: '-5.9% ↓', netCarbon: 3.48, status: '达标改善', tone: 'info' },
  { id: 'ws_hb_main', name: '衡变本部 (南方中心)', sub: '南方制造中心', intensity: 0.298, unit: 'tCO2/万元', yoy: '-5.2% ↓', netCarbon: 3.15, status: '达标受控', tone: 'info' },
  { id: 'ws_xb_tianbian', name: '天变公司 (干变基地)', sub: '华北科技中心', intensity: 0.218, unit: 'tCO2/万元', yoy: '-4.8% ↓', netCarbon: 1.05, status: '达标受控', tone: 'info' },
  { id: 'ws_ll_main', name: '鲁缆公司 (超高压电缆)', sub: '华东电缆中心', intensity: 0.185, unit: 'tCO2/万元', yoy: '-7.6% ↓', netCarbon: 2.30, status: '标杆示范', tone: 'ok' },
  { id: 'ws_xl_company', name: '新缆厂 (特种线缆)', sub: '新疆电缆中心', intensity: 0.192, unit: 'tCO2/万元', yoy: '-5.1% ↓', netCarbon: 1.84, status: '达标受控', tone: 'info' },
  { id: 'ws_dl_main', name: '德缆公司 (通用电缆)', sub: '西南电缆中心', intensity: 0.268, unit: 'tCO2/万元', yoy: '+3.2% ↑', netCarbon: 3.18, status: '超标预警', tone: 'danger' },
  { id: 'ws_hb_tnj', name: '国际集成 (成套物流)', sub: '工程与集成', intensity: 0.142, unit: 'tCO2/万元', yoy: '-6.0% ↓', netCarbon: 1.20, status: '达标受控', tone: 'info' },
]

export default function CarbonAccountingPage() {
  const [selectedOrg, setSelectedOrg] = useState<OrgNodeItem>({
    id: 'group_all',
    name: '电装集团',
    fullName: '特变电工集团（电装板块全景）',
    level: 'group',
  })

  const [periodType, setPeriodType] = useState<'month' | 'quarter' | 'year'>('month')
  const [showEntryModal, setShowEntryModal] = useState(false)

  const isGroupLevel = selectedOrg.level === 'group' || selectedOrg.level === 'industry'

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
        <div className="bg-card rounded-xl border border-border p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Layers className="size-5" />
            </div>
            <h1 className="text-base font-bold text-foreground">碳排放核算</h1>
          </div>

          {/* 控制按钮组 */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <div className="inline-flex rounded-lg border border-border p-0.5 bg-panel text-xs">
              <button
                onClick={() => setPeriodType('month')}
                className={cn(
                  'px-2.5 py-1 rounded-md transition-all cursor-pointer',
                  periodType === 'month' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                月度核算
              </button>
              <button
                onClick={() => setPeriodType('quarter')}
                className={cn(
                  'px-2.5 py-1 rounded-md transition-all cursor-pointer',
                  periodType === 'quarter' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                季度结算
              </button>
              <button
                onClick={() => setPeriodType('year')}
                className={cn(
                  'px-2.5 py-1 rounded-md transition-all cursor-pointer',
                  periodType === 'year' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                年度盘查
              </button>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-panel border border-border font-mono font-semibold text-foreground">
              2026-08
            </span>
            <button
              onClick={() => alert('已触发全基地 8 月度最新活动数据同步与重算！')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>重新核算</span>
            </button>
            <button
              onClick={() => alert('正在导出 ISO 14064 组织碳核算明细数据包 (Excel)...')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>导出核算账单</span>
            </button>
          </div>
        </div>

        {/* 🏢 视图 A：集团全局大盘层 (isGroupLevel) */}
        {isGroupLevel ? (
          <div className="space-y-3.5">
            {/* 4 栏大盘核心指标卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span className="font-bold text-foreground">全集团当期净碳排放总量</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                    同比 -5.8% ↓
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-extrabold font-mono text-foreground">18.42</span>
                  <span className="text-xs text-muted-foreground">万吨 CO₂e</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between pt-2 border-t border-border/60 font-mono">
                  <span>总产值: 58.2 亿元</span>
                  <span className="text-emerald-400 font-bold">超额达成考核基准</span>
                </div>
              </div>

              <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-amber-400" /> 范围 1 直接化石排放
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">占比 11.7%</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-extrabold font-mono text-amber-400">2.15</span>
                  <span className="text-xs text-muted-foreground">万吨 CO₂</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/60">
                  <span>主要源：天然气烘干炉、厂区运输柴油</span>
                </div>
              </div>

              <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span className="font-bold text-primary flex items-center gap-1">
                    <span className="size-2 rounded-full bg-primary" /> 范围 2 外购电热排放
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">占比 88.3%</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-extrabold font-mono text-primary">17.12</span>
                  <span className="text-xs text-muted-foreground">万吨 CO₂</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/60">
                  <span>外购市电 30,019 万kWh (按区域网电因子)</span>
                </div>
              </div>

              <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-400" /> 绿电绿证减排抵扣
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">正向资产</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-extrabold font-mono text-emerald-400">-0.85</span>
                  <span className="text-xs text-muted-foreground">万吨 CO₂</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/60">
                  <span>分布式光伏消纳 1,490 万kWh</span>
                </div>
              </div>
            </div>

            {/* 8 大制造基地万元产值碳强度平铺大盘看板 */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    8 家主要制造基地万元产值碳强度与达标平铺看板 (tCO₂/万元)
                  </h3>
                </div>
                <span className="text-[11px] text-muted-foreground">点击任意基地卡片快速切换至企业级明细视角</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {FACTORY_CARDS.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setSelectedOrg({
                        id: card.id,
                        name: card.name,
                        level: 'company',
                      })
                    }}
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer transition-all hover:shadow-xs',
                      card.tone === 'ok'
                        ? 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20'
                        : card.tone === 'danger'
                        ? 'border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20'
                        : 'border-border bg-panel hover:bg-accent/40',
                    )}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-foreground">{card.name}</span>
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded font-bold text-[10px]',
                          card.tone === 'ok'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : card.tone === 'danger'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-panel text-muted-foreground border border-border',
                        )}
                      >
                        {card.status}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 my-1">
                      <span
                        className={cn(
                          'text-xl font-bold font-mono',
                          card.tone === 'ok' ? 'text-emerald-400' : card.tone === 'danger' ? 'text-rose-400' : 'text-foreground',
                        )}
                      >
                        {card.intensity}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{card.unit}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground flex justify-between pt-1 border-t border-border/60 font-mono">
                      <span>同比: {card.yoy}</span>
                      <span>净排放: {card.netCarbon} 万吨</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 集团碳排放因子版本管理表 */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    集团统一排放因子库配置基准 (2026 最新执行标准)
                  </h3>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  因子版本：TBEA-CF-2026.08 (国家生态环境部发布)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-panel text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="px-3 py-2">能源介质/活动源</th>
                      <th className="px-3 py-2">核算范围</th>
                      <th className="px-3 py-2">基准排放因子值</th>
                      <th className="px-3 py-2">计量单位</th>
                      <th className="px-3 py-2">权威标准来源</th>
                      <th className="px-3 py-2">下发状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono">
                    <tr>
                      <td className="px-3 py-2 font-sans font-medium text-foreground">区域电网外购电力</td>
                      <td className="px-3 py-2 text-primary font-bold">Scope 2</td>
                      <td className="px-3 py-2 text-primary font-bold">0.5703</td>
                      <td className="px-3 py-2 text-muted-foreground">tCO₂/MWh</td>
                      <td className="px-3 py-2 font-sans text-muted-foreground">2026年全国电网基准排放因子</td>
                      <td className="px-3 py-2">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          全集团锁定生效
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-sans font-medium text-foreground">工业天然气燃烧</td>
                      <td className="px-3 py-2 text-amber-400 font-bold">Scope 1</td>
                      <td className="px-3 py-2 text-amber-400 font-bold">2.1622</td>
                      <td className="px-3 py-2 text-muted-foreground">kgCO₂/m³</td>
                      <td className="px-3 py-2 font-sans text-muted-foreground">《工业企业温室气体排放核算指南》</td>
                      <td className="px-3 py-2">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          全集团锁定生效
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-sans font-medium text-foreground">自备分布式光伏绿电</td>
                      <td className="px-3 py-2 text-emerald-400 font-bold">抵扣抵减</td>
                      <td className="px-3 py-2 text-emerald-400 font-bold">0.0000</td>
                      <td className="px-3 py-2 text-muted-foreground">tCO₂/MWh</td>
                      <td className="px-3 py-2 font-sans text-muted-foreground">绿证与绿电直接全额抵扣机制</td>
                      <td className="px-3 py-2">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          全集团锁定生效
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* 🏭 视图 B：企业工序执行层 (!isGroupLevel) */
          <div className="space-y-3.5">
            {/* 4 栏工厂执行层 KPI 卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
                <div className="text-xs text-muted-foreground mb-1 font-bold">本厂当期外购市电量</div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-primary">2,840.5</span>
                  <span className="text-xs text-muted-foreground">万 kWh</span>
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/60 flex justify-between font-mono">
                  <span>折碳: 1.62 万吨</span>
                  <span className="text-primary">10个变电所汇总</span>
                </div>
              </div>

              <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
                <div className="text-xs text-muted-foreground mb-1 font-bold">本厂天然气消耗量</div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-amber-400">42.6</span>
                  <span className="text-xs text-muted-foreground">万 m³</span>
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/60 flex justify-between font-mono">
                  <span>折碳: 0.92 万吨</span>
                  <span className="text-amber-400">干燥车间主耗</span>
                </div>
              </div>

              <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
                <div className="text-xs text-muted-foreground mb-1 font-bold">自备屋顶光伏绿电消纳</div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-emerald-400">185.0</span>
                  <span className="text-xs text-muted-foreground">万 kWh</span>
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/60 flex justify-between font-mono">
                  <span className="text-emerald-400 font-bold">减排抵扣: -0.11 万吨</span>
                  <span>消纳率 100%</span>
                </div>
              </div>

              <div className="p-3.5 bg-card rounded-xl border border-border shadow-xs">
                <div className="text-xs text-muted-foreground mb-1 font-bold">本厂净碳排放总量</div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-foreground">3.48</span>
                  <span className="text-xs text-muted-foreground">万吨 CO₂</span>
                </div>
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/60 flex justify-between font-mono">
                  <span>碳强度: 0.312 t/万</span>
                  <span className="text-emerald-400 font-bold">达标受控</span>
                </div>
              </div>
            </div>

            {/* 透明算式卡片 */}
            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Info className="size-4 text-primary" />
                  <span>【{selectedOrg.name}】2026-08 碳排放精确核算链路透明算式 (分子分母直接可见)</span>
                </span>
                <span className="text-[10px] text-primary font-mono">计算引擎：ISO 14064-1 标准</span>
              </div>
              <div className="p-2.5 bg-card rounded-lg border border-border font-mono text-xs text-foreground leading-relaxed space-y-1">
                <p>
                  • <strong>Scope 1 直接排放</strong> = 426,000 m³ (天然气) × 2.1622 kgCO₂/m³ + 12,000 L (柴油) × 2.6300 kgCO₂/L ={' '}
                  <span className="text-amber-400 font-bold">952.68 tCO₂</span>
                </p>
                <p>
                  • <strong>Scope 2 电力排放</strong> = [ 28,405,000 kWh (外购电) - 1,850,000 kWh (直供绿电) ] × 0.5703 kgCO₂/kWh ={' '}
                  <span className="text-primary font-bold">15,144.13 tCO₂</span>
                </p>
                <p>
                  • <strong>本厂当期净排放量</strong> = 952.68 + 15,144.13 + 320.00 (供应链运输) ={' '}
                  <span className="text-foreground font-extrabold">16,416.81 tCO₂ (1.64 万吨)</span>
                </p>
              </div>
            </div>

            {/* 车间计量表底与活动水平原始数据台账 */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    该基地车间计量表底与活动水平原始数据台账
                  </h3>
                </div>
                <button
                  onClick={() => setShowEntryModal(true)}
                  className="px-2.5 py-1 text-xs rounded bg-primary/20 text-primary border border-primary/30 font-bold hover:bg-primary/30 cursor-pointer"
                >
                  + 补录活动数据
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-panel text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="px-3 py-2">车间/测点名称</th>
                      <th className="px-3 py-2">表计类型</th>
                      <th className="px-3 py-2">期初底数</th>
                      <th className="px-3 py-2">期末底数</th>
                      <th className="px-3 py-2">当期用量</th>
                      <th className="px-3 py-2">折算碳排(tCO₂)</th>
                      <th className="px-3 py-2">数据来源</th>
                      <th className="px-3 py-2">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono text-foreground">
                    <tr>
                      <td className="px-3 py-2 font-sans font-medium text-foreground">1# 110kV 总降压变电站</td>
                      <td className="px-3 py-2 font-sans text-primary">高压电表</td>
                      <td className="px-3 py-2">12,450,200</td>
                      <td className="px-3 py-2">26,855,200</td>
                      <td className="px-3 py-2 font-bold text-primary">14,405,000 kWh</td>
                      <td className="px-3 py-2 font-bold">8,215.17</td>
                      <td className="px-3 py-2 font-sans text-muted-foreground">SCADA 在线采集</td>
                      <td className="px-3 py-2">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          校验通过
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-sans font-medium text-foreground">真空干燥车间天然气总表</td>
                      <td className="px-3 py-2 font-sans text-amber-400">流量计</td>
                      <td className="px-3 py-2">1,820,400</td>
                      <td className="px-3 py-2">2,246,400</td>
                      <td className="px-3 py-2 font-bold text-amber-400">426,000 m³</td>
                      <td className="px-3 py-2 font-bold">920.90</td>
                      <td className="px-3 py-2 font-sans text-muted-foreground">燃气网关直连</td>
                      <td className="px-3 py-2">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          校验通过
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 补录活动数据弹窗 Modal */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-5 shadow-2xl border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground">补录车间用能量活动水平数据</h3>
              <button onClick={() => setShowEntryModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-foreground font-medium mb-1">所属车间 / 测点</label>
                <input
                  type="text"
                  defaultValue="真空干燥车间 2# 支路表"
                  className="w-full h-8 px-2.5 rounded-md border border-border bg-panel text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground font-medium mb-1">期初底数</label>
                  <input type="number" defaultValue={2100000} className="w-full h-8 px-2.5 rounded-md border border-border bg-panel text-foreground focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-foreground font-medium mb-1">期末底数</label>
                  <input type="number" defaultValue={2250000} className="w-full h-8 px-2.5 rounded-md border border-border bg-panel text-foreground focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                onClick={() => setShowEntryModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground bg-panel hover:bg-accent/40 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert('数据已校核并补录入库，碳核算引擎已自动刷新！')
                  setShowEntryModal(false)
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 shadow-xs cursor-pointer"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

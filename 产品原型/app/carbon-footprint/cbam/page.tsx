'use client'

import { useState } from 'react'
import {
  ShieldCheck,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Search,
  BookOpen,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge, DataTable, KpiCard } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { cbamProducts, cbamQualifications, cbamCostScenarios, cbamDefaults, cbamKnowledge, supplierCarbon } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function CbamPage() {
  const [activeTab, setActiveTab] = useState<'compliance' | 'cost' | 'knowledge' | 'supplier'>('compliance')
  const [selectedScenario, setSelectedScenario] = useState('当前实测值')
  const [carbonPrice, setCarbonPrice] = useState(82)
  const [showExportModal, setShowExportModal] = useState(false)

  return (
    <div className="space-y-4">
      {/* 顶部标题与一键导出 CBAM 申报包 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">
              欧盟碳关税 (CBAM) 合规与出口申报专区
            </h1>
            <p className="text-xs text-muted-foreground">
              支持变压器与线缆产品 HS-CN 编码映射、隐含碳排放测算与季度申报 XML 合规包生成
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-950/40 transition-colors"
          >
            <Download className="size-3.5" />
            一键下载 CBAM 季度申报 XML 包
          </button>
        </div>
      </div>

      {/* 核心 KPI 矩阵 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          title="CBAM 管控出口产品"
          value="45"
          unit="款"
          delta="覆盖变压器/电缆"
          up
          tone="ok"
        />
        <KpiCard
          title="平均隐含碳排放"
          value="1.42"
          unit="tCO2/台"
          delta="低于官方默认值 38%"
          up
          tone="ok"
        />
        <KpiCard
          title="当期欧盟碳价预估"
          value="€82.0"
          unit="/tCO2"
          delta="EEX 现货参考"
          up
          tone="info"
        />
        <KpiCard
          title="合规资质有效期"
          value="2027"
          unit="年"
          delta="EORI/工厂注册正常"
          up
          tone="ok"
        />
      </div>

      {/* 四大功能 Tab 切换 */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        {[
          { key: 'compliance', label: '产品映射与资质台账' },
          { key: 'cost', label: '出口碳关税多情景测算' },
          { key: 'supplier', label: '供应商前驱物碳绩效' },
          { key: 'knowledge', label: 'CBAM 规则与知识库' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all',
              activeTab === t.key
                ? 'bg-sky-500 text-white shadow-sm font-semibold'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: 产品映射与资质台账 */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          <Panel className="p-4">
            <PanelTitle icon={Package}>CBAM 管控产品与欧盟 CN 编码映射台账</PanelTitle>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-accent/40 text-muted-foreground border-b border-border/60 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">产品名称</th>
                    <th className="py-2.5 px-3">中国 HS 编码</th>
                    <th className="py-2.5 px-3">欧盟 CN 编码</th>
                    <th className="py-2.5 px-3">管控范围</th>
                    <th className="py-2.5 px-3">实测隐含碳排</th>
                    <th className="py-2.5 px-3">豁免资格判定</th>
                    <th className="py-2.5 px-3">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {cbamProducts.map((p) => (
                    <tr key={p.cn} className="hover:bg-accent/30">
                      <td className="py-2.5 px-3 font-sans font-medium text-foreground">{p.name}</td>
                      <td className="py-2.5 px-3">{p.hs}</td>
                      <td className="py-2.5 px-3 text-sky-400 font-bold">{p.cn}</td>
                      <td className="py-2.5 px-3 font-sans"><Badge tone="warning">{p.scope}</Badge></td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">1.42 tCO2/台</td>
                      <td className="py-2.5 px-3 font-sans text-muted-foreground">
                        {p.exempt ? '符合豁免' : '需申报碳关税'}
                      </td>
                      <td className="py-2.5 px-3 font-sans"><StatusBadge tone="ok">{p.status}</StatusBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel className="p-4">
            <PanelTitle icon={ShieldCheck}>CBAM 申报资质与授权主体档案</PanelTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {cbamQualifications.map((q) => (
                <div key={q.code} className="p-3 rounded-lg bg-accent/30 border border-border/60 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{q.type}</span>
                    <StatusBadge tone="ok">{q.status}</StatusBadge>
                  </div>
                  <span className="font-mono text-sky-400 font-bold block">{q.code}</span>
                  <span className="text-[11px] text-muted-foreground block">有效期至：{q.validTo}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* Tab 2: 出口碳关税多情景测算 */}
      {activeTab === 'cost' && (
        <div className="space-y-4">
          <Panel className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <PanelTitle icon={DollarSign}>出口欧盟订单碳关税成本模拟测算</PanelTitle>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">欧盟碳价测算基准 (€/t)：</span>
                <input
                  type="number"
                  value={carbonPrice}
                  onChange={(e) => setCarbonPrice(Number(e.target.value))}
                  className="w-20 bg-accent/50 border border-border rounded px-2 py-1 text-foreground font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {cbamCostScenarios.map((sc) => {
                const totalCost = Number(((sc.emission * carbonPrice) / 1000).toFixed(1))
                return (
                  <div
                    key={sc.name}
                    onClick={() => setSelectedScenario(sc.name)}
                    className={cn(
                      'p-4 rounded-lg bg-card border transition-all cursor-pointer space-y-2',
                      selectedScenario === sc.name
                        ? 'border-sky-500 bg-sky-950/10 shadow-md'
                        : 'border-border hover:border-sky-500/40'
                    )}
                  >
                    <span className="font-semibold text-xs text-foreground block">{sc.name}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono text-sky-400">€{totalCost}</span>
                      <span className="text-xs text-muted-foreground">k (千欧元)</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground block">
                      隐含碳排放：{sc.emission} tCO2
                    </span>
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>
      )}

      {/* Tab 3: 供应商前驱物碳绩效 */}
      {activeTab === 'supplier' && (
        <Panel className="p-4">
          <PanelTitle icon={Layers}>原材料供应商前驱物碳绩效与实测证书</PanelTitle>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-accent/40 text-muted-foreground border-b border-border/60 font-medium">
                <tr>
                  <th className="py-2.5 px-3">供应商名称</th>
                  <th className="py-2.5 px-3">供应物料</th>
                  <th className="py-2.5 px-3">碳排放因子</th>
                  <th className="py-2.5 px-3">绿电使用比例</th>
                  <th className="py-2.5 px-3">CBAM 评级</th>
                  <th className="py-2.5 px-3">核查状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {supplierCarbon.map((s) => (
                  <tr key={s.supplier} className="hover:bg-accent/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-foreground">{s.supplier}</td>
                    <td className="py-2.5 px-3 font-sans">{s.material}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{s.factor} tCO2/t</td>
                    <td className="py-2.5 px-3">{s.green}</td>
                    <td className="py-2.5 px-3 font-sans"><Badge tone="success">评级 {s.grade}</Badge></td>
                    <td className="py-2.5 px-3 font-sans"><StatusBadge tone="ok">已通过 SGS 核查</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* Tab 4: CBAM 规则与知识库 */}
      {activeTab === 'knowledge' && (
        <Panel className="p-4">
          <PanelTitle icon={BookOpen}>CBAM 最新官方政策法规与申报指南知识库</PanelTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {cbamKnowledge.map((k) => (
              <div key={k.title} className="p-3.5 rounded-lg bg-accent/30 border border-border/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{k.title}</span>
                  <Badge tone="primary">{k.type}</Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground pt-1 text-[11px]">
                  <span>更新日期：{k.updated}</span>
                  <button className="text-sky-400 hover:underline">在线查阅 →</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* 申报包导出弹窗 */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-sky-400" />
                <h3 className="font-bold text-base text-foreground">CBAM 季度申报 XML 合规包已生成</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-muted-foreground">✕</button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              系统已根据 2026 年三季度出口欧盟的 45 笔外贸工单自动完成前驱物碳排放汇总与欧委会格式打包（符合 EU 2023/956 规范）。
            </p>
            <div className="p-3 rounded-lg bg-accent/40 border border-border/60 text-xs font-mono space-y-1">
              <div className="flex justify-between"><span>申报包编号：</span><span className="text-sky-400">CBAM-2026-Q3-TBEA.xml</span></div>
              <div className="flex justify-between"><span>隐含碳排总量：</span><span className="text-foreground">1,842.0 tCO2</span></div>
              <div className="flex justify-between"><span>核算依据：</span><span className="text-foreground">ISO 14067 实测数据库</span></div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button onClick={() => setShowExportModal(false)} className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground">取消</button>
              <button onClick={() => { alert('XML 申报包下载成功！'); setShowExportModal(false); }} className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow">确认下载</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

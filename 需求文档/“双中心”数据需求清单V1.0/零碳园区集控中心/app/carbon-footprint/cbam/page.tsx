'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, StatusBadge, Toolbar, DataTable, KpiCard, Badge } from '@/components/shared/primitives'
import { Tabs } from '@/components/shared/tabs'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { BarGroup } from '@/components/shared/charts'
import {
  cbamProducts,
  cbamQualifications,
  cbamCostScenarios,
  cbamDefaults,
  supplierCarbon,
  cbamKnowledge,
  statusColor,
} from '@/lib/mock-data'
import { Bot, Search, Send, FileText } from 'lucide-react'

export default function CbamPage() {
  const [tab, setTab] = useState('compliance')
  const [prodTab, setProdTab] = useState('lib')
  const [price, setPrice] = useState('82')
  const [assistantMsg, setAssistantMsg] = useState('')
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: '您好，我是 CBAM 智能助手。可咨询编码匹配、排放核算、季度申报、资质注册等问题。' },
  ])

  const send = () => {
    if (!assistantMsg.trim()) return
    const q = assistantMsg.trim()
    setChat((c) => [
      ...c,
      { role: 'user', text: q },
      {
        role: 'bot',
        text: '根据 CN 管控清单，电力变压器（HS 8504.23）对应 CN 码 85042300，属于 CBAM 管控范围。建议按季度申报实测排放量，缺失实测数据时可套用官方默认值 2.26 tCO2e/台。',
      },
    ])
    setAssistantMsg('')
  }

  return (
    <div>
      <PageHeader title="CBAM 管理" desc="提前应对欧盟碳边境调节机制（CBAM），覆盖合规、产品客户、成本测算、知识库与供应商" />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: 'compliance', label: '合规管理' },
          { value: 'product', label: '产品与客户' },
          { value: 'cost', label: '成本测算' },
          { value: 'knowledge', label: '知识库' },
          { value: 'supplier', label: '供应商碳管理' },
        ]}
      />

      {tab === 'compliance' && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <KpiCard label="管控产品" value="18" unit="项" trend="+2" up />
            <KpiCard label="豁免资格产品" value="5" unit="项" trend="" up />
            <KpiCard label="有效资质" value="3" unit="项" trend="" up />
            <KpiCard label="临期预警" value="1" unit="项" trend="需处理" up={false} />
          </div>

          <Panel
            title="管控范围判定"
            desc="通过产品名称 / HS 码进行欧盟 CN 码匹配，自动创建产品映射台账"
            actions={
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="输入产品名称 / HS 码"
                  className="h-9 w-56 rounded-md border border-border bg-secondary pl-8 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            }
          >
            <DataTable
              columns={[
                { key: 'name', label: '产品名称' },
                { key: 'hs', label: 'HS 码', className: 'font-mono' },
                { key: 'cn', label: 'CN 码', className: 'font-mono' },
                {
                  key: 'scope',
                  label: '管控范围',
                  render: (r) => <Badge tone={r.scope === '管控' ? 'warning' : 'default'}>{r.scope}</Badge>,
                },
                {
                  key: 'exempt',
                  label: '豁免评估',
                  render: (r) => (
                    <span className={r.exempt ? 'text-[var(--success)]' : 'text-muted-foreground'}>
                      {r.exempt ? '符合豁免' : '不符合'}
                    </span>
                  ),
                },
                {
                  key: 'status',
                  label: '资质状态',
                  render: (r) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge>,
                },
              ]}
              rows={cbamProducts}
            />
          </Panel>

          <Panel title="资质管理" desc="统一维护 EORI、进口商授权、境外工厂注册等全类型 CBAM 资质，自动校验有效期">
            <DataTable
              columns={[
                { key: 'type', label: '资质类型' },
                { key: 'code', label: '编号', className: 'font-mono' },
                { key: 'validTo', label: '有效期至' },
                {
                  key: 'status',
                  label: '状态',
                  render: (r) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge>,
                },
              ]}
              rows={cbamQualifications}
            />
          </Panel>
        </div>
      )}

      {tab === 'product' && (
        <div className="mt-4 space-y-4">
          <Tabs
            value={prodTab}
            onChange={setProdTab}
            items={[
              { value: 'lib', label: '产品库管理' },
              { value: 'customer', label: '客户管理' },
              { value: 'order', label: '订单关联' },
            ]}
          />
          {prodTab === 'lib' && (
            <Panel title="标准化产品碳档案" desc="绑定 HS-CN 编码映射、生产工艺、排放因子">
              <DataTable
                columns={[
                  { key: 'name', label: '产品名称' },
                  { key: 'cn', label: 'CN 编码', className: 'font-mono' },
                  { key: 'hs', label: 'HS 编码', className: 'font-mono' },
                  {
                    key: 'scope',
                    label: '管控',
                    render: (r) => <Badge tone={r.scope === '管控' ? 'warning' : 'default'}>{r.scope}</Badge>,
                  },
                ]}
                rows={cbamProducts}
              />
            </Panel>
          )}
          {prodTab === 'customer' && (
            <Panel title="出口客户管理" desc="维护欧盟进口商 EORI、授权状态与关联产品">
              <DataTable
                columns={[
                  { key: 'name', label: '客户名称' },
                  { key: 'country', label: '国家/地区' },
                  { key: 'eori', label: 'EORI', className: 'font-mono' },
                  {
                    key: 'auth',
                    label: '授权状态',
                    render: (r) => <StatusBadge tone={r.auth === '已授权' ? 'ok' : 'warn'}>{r.auth}</StatusBadge>,
                  },
                ]}
                rows={[
                  { name: 'Siemens Energy AG', country: '德国', eori: 'DE812305789', auth: '已授权' },
                  { name: 'Nexans France', country: '法国', eori: 'FR409123556', auth: '已授权' },
                  { name: 'ABB Italy S.p.A.', country: '意大利', eori: 'IT073920145', auth: '待授权' },
                ]}
              />
            </Panel>
          )}
          {prodTab === 'order' && (
            <Panel title="出口订单关联" desc="将出口订单与产品碳档案、进口商关联，生成 CBAM 申报数据">
              <DataTable
                columns={[
                  { key: 'order', label: '订单号', className: 'font-mono' },
                  { key: 'product', label: '产品' },
                  { key: 'customer', label: '进口商' },
                  { key: 'qty', label: '数量(台)', align: 'right', className: 'font-mono' },
                  {
                    key: 'status',
                    label: '申报状态',
                    render: (r) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge>,
                  },
                ]}
                rows={[
                  { order: 'EX-2026-0356', product: 'SZ11-2500/10', customer: 'Siemens Energy AG', qty: 12, status: '已申报' },
                  { order: 'EX-2026-0361', product: 'YJV-8.7/15', customer: 'Nexans France', qty: 8, status: '待申报' },
                  { order: 'EX-2026-0369', product: 'ZW32-12', customer: 'ABB Italy S.p.A.', qty: 20, status: '草稿' },
                ]}
              />
            </Panel>
          )}
        </div>
      )}

      {tab === 'cost' && (
        <div className="mt-4 space-y-4">
          <Toolbar>
            <Select
              label="欧盟当期碳价"
              value={price}
              onChange={setPrice}
              options={[
                { value: '72', label: '72 €/t（低）' },
                { value: '82', label: '82 €/t（当前）' },
                { value: '95', label: '95 €/t（高）' },
                { value: '110', label: '110 €/t（预期）' },
              ]}
            />
            <span className="text-xs text-muted-foreground">按产品碳排放量 × 欧盟碳价自动测算出口碳关税成本</span>
          </Toolbar>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="多情景碳价模拟对比" desc="单位：€/台">
              <BarGroup
                data={cbamCostScenarios.map((s) => ({ name: s.name, value: Math.round(s.emission * Number(price) / 1000) }))}
                bars={[{ key: 'value', name: '出口碳关税成本(€)', color: 'var(--chart-1)' }]}
              />
            </Panel>
            <Panel title="默认值查询" desc="内置 CBAM 官方各行业默认排放因子库">
              <DataTable
                columns={[
                  { key: 'sector', label: '行业' },
                  { key: 'product', label: '产品' },
                  { key: 'factor', label: '默认因子', align: 'right', className: 'font-mono' },
                  { key: 'unit', label: '单位' },
                  {
                    key: 'action',
                    label: '',
                    render: () => (
                      <button type="button" className="text-xs text-primary hover:underline">
                        套用
                      </button>
                    ),
                  },
                ]}
                rows={cbamDefaults}
              />
            </Panel>
          </div>

          <Panel title="出口成本测算明细">
            <DataTable
              columns={[
                { key: 'name', label: '测算情景' },
                { key: 'emission', label: '碳排放(kgCO2e/台)', align: 'right', className: 'font-mono' },
                { key: 'price', label: '碳价(€/t)', align: 'right', className: 'font-mono' },
                {
                  key: 'price',
                  label: '碳价(€/t)',
                  align: 'right',
                  className: 'font-mono',
                  render: () => <span className="font-mono">{price}</span>,
                },
                {
                  key: 'cost',
                  label: '碳关税成本(€/台)',
                  align: 'right',
                  render: (r) => (
                    <span className="font-mono text-primary">
                      {Math.round((r.emission * Number(price)) / 1000)}
                    </span>
                  ),
                },
              ]}
              rows={cbamCostScenarios}
            />
          </Panel>
        </div>
      )}

      {tab === 'knowledge' && (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel
              title="CBAM 知识库查询"
              desc="法规原文、CN 管控清单、申报指南、BTI 分类裁定案例"
              actions={
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    placeholder="关键词检索"
                    className="h-9 w-52 rounded-md border border-border bg-secondary pl-8 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>
              }
            >
              <div className="flex flex-col gap-2">
                {cbamKnowledge.map((k) => (
                  <div
                    key={k.title}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-primary" />
                      <span className="text-sm text-foreground">{k.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone="default">{k.type}</Badge>
                      <span className="text-xs text-muted-foreground">{k.updated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <Panel title="CBAM 智能助手">
            <div className="flex h-[360px] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {chat.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border bg-secondary/60 text-foreground'
                      }`}
                    >
                      {m.role === 'bot' && <Bot className="mb-1 size-4 text-primary" />}
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={assistantMsg}
                  onChange={(e) => setAssistantMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) send()
                  }}
                  placeholder="输入合规问题…"
                  className="h-9 flex-1 rounded-md border border-border bg-secondary px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                />
                <button
                  type="button"
                  onClick={send}
                  className="inline-flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"
                  aria-label="发送"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {tab === 'supplier' && (
        <div className="mt-4 space-y-4">
          <Panel title="供应商碳绩效地图" desc="录入关键原材料（硅钢片、铜、铝）供应商的碳足迹数据与绿色资质">
            <DataTable
              columns={[
                { key: 'supplier', label: '供应商' },
                { key: 'material', label: '供应材料' },
                { key: 'factor', label: '碳因子(kgCO2e/kg)', align: 'right', className: 'font-mono' },
                { key: 'green', label: '绿电占比', align: 'right' },
                {
                  key: 'grade',
                  label: '碳绩效等级',
                  render: (r) => (
                    <Badge tone={r.grade === 'A' ? 'success' : r.grade === 'B' ? 'default' : 'warning'}>
                      {r.grade} 级
                    </Badge>
                  ),
                },
              ]}
              rows={supplierCarbon}
            />
          </Panel>
        </div>
      )}
    </div>
  )
}

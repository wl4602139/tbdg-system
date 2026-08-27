'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Panel, PanelTitle, DataTable, StatusBadge, Toolbar, KpiCard, Badge } from '@/components/shared/primitives'
import { Tabs } from '@/components/shared/tabs'
import { Select } from '@/components/shared/select'
import { Donut, BarGroup, RadarCompare } from '@/components/shared/charts'
import { productFootprint, hotspotData, compareData } from '@/lib/mock-data'
import { seedFactor, vary } from '@/lib/variant'
import { indicators } from '@/lib/indicators'
import { Layers, Sliders, TrendingUp, TrendingDown, Target, Zap, Sparkles, AlertTriangle, ArrowRight, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { label: '横向对比 (同品类跨厂)', value: 'horizontal' },
  { label: '纵向对比 (红黑榜 Top10)', value: 'vertical' },
  { label: '基准对比与热点识别', value: 'benchmark' },
  { label: '碳减排情景模拟', value: 'simulate' },
  { label: '集采管控指标', value: 'kpi' },
]

// 红黑榜数据 (含单台特征量及订单穿透)
const redBlackRankData = [
  { rank: 1, type: 'red', model: 'S13-M-800kVA 配电变压器', line: '配电产线', capacity: '800 kVA', totalCount: 1560, singlePcf: '125 kgCO2', unitPcf: '0.29 tCO2/MVA', rawPct: '57.6%', prodPct: '30.4%', transPct: '12.0%', planNo: 'PLN-2026-0810', diff: '-18.5%' },
  { rank: 2, type: 'red', model: 'SZ-110kV/63MVA 双绕组变压器', line: '电力产线', capacity: '63,000 kVA', totalCount: 420, singlePcf: '880 kgCO2', unitPcf: '0.38 tCO2/MVA', rawPct: '57.9%', prodPct: '31.8%', transPct: '10.2%', planNo: 'PLN-2026-0812', diff: '-12.0%' },
  { rank: 3, type: 'red', model: 'YJLW03-110kV 高压电缆', line: '高压电缆', capacity: '1200 mm²', totalCount: 880, singlePcf: '0.68 kg/m', unitPcf: '0.68 kg/km*mm²', rawPct: '61.8%', prodPct: '30.9%', transPct: '7.3%', planNo: 'PLN-2026-0814', diff: '-8.5%' },
  { rank: 4, type: 'black', model: 'ODFS-334MVA/500kV 自耦变压器', line: '超高压产线', capacity: '334,000 kVA', totalCount: 120, singlePcf: '1,450 kgCO2', unitPcf: '0.43 tCO2/MVA', rawPct: '58.6%', prodPct: '33.1%', transPct: '8.3%', planNo: 'PLN-2026-0815', diff: '+15.2%' },
  { rank: 5, type: 'black', model: 'SZ11-1600kVA 油浸变压器', line: '特配产线', capacity: '1,600 kVA', totalCount: 350, singlePcf: '480 kgCO2', unitPcf: '0.45 tCO2/MVA', rawPct: '59.2%', prodPct: '32.0%', transPct: '8.8%', planNo: 'PLN-2026-0818', diff: '+18.4%' },
]

export default function AnalysisPage() {
  const [tab, setTab] = useState('horizontal')
  const [reMat, setReMat] = useState(25)
  const [green, setGreen] = useState(40)
  const [industry, setIndustry] = useState('变压器产业')
  const [selectedRankType, setSelectedRankType] = useState<'all' | 'red' | 'black'>('all')

  // 减排模拟实时测算
  const basePcf = 1450 // kgCO2
  const rawCarbon = basePcf * 0.586
  const prodCarbon = basePcf * 0.331
  const transCarbon = basePcf * 0.083

  const savedRaw = rawCarbon * (reMat / 100) * 0.65 // 再生铜减排65%
  const savedProd = prodCarbon * (green / 100) * 0.90 // 绿电减排90%
  const totalSaved = Math.round(savedRaw + savedProd)
  const afterPcf = basePcf - totalSaved
  const totalPct = ((totalSaved / basePcf) * 100).toFixed(1)

  return (
    <div className="space-y-4">
      <PageHeader
        title="产品碳足迹多维分析平台"
        positioning="横向 · 纵向 · 对标 · 减排模拟"
        desc="支持同型号跨工厂横向对标、红黑榜纵向穿透至订单与生产计划、工序基准热点识别及低碳技术选型模拟。"
      />

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {/* Tab 1: 同品类横向对比 */}
      {tab === 'horizontal' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 bg-card p-3 rounded-lg border border-border text-xs">
            <Select label="产业" value={industry} onChange={setIndustry} options={['变压器产业', '线缆产业', '开关产业'].map((x) => ({ label: x, value: x }))} />
            <Select label="产线" options={['全部产线', '超高压变压器产线', '中低压配电产线'].map((x) => ({ label: x, value: x }))} />
            <Select label="产品类别" options={['全部类别', '单相自耦变压器', '双绕组变压器'].map((x) => ({ label: x, value: x }))} />
            <Select label="产品型号" options={['ODFS-334MVA/500kV 单相自耦变压器', 'SZ-110kV/63MVA 电力变压器'].map((x) => ({ label: x, value: x }))} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Panel className="lg:col-span-2 p-4">
              <PanelTitle icon={Layers}>【ODFS-334MVA/500kV】生产制造单位横向对比与构成分解</PanelTitle>
              <div className="mt-3">
                <BarGroup
                  data={[
                    { name: '沈阳变压器集团', 原材料获取: 850, 生产制造: 480, 运输与分销: 120 },
                    { name: '衡阳变压器公司', 原材料获取: 820, 生产制造: 440, 运输与分销: 110 },
                    { name: '超高压公司(新变)', 原材料获取: 890, 生产制造: 510, 运输与分销: 130 },
                  ]}
                  keys={['原材料获取', '生产制造', '运输与分销']}
                  stacked
                  height={300}
                />
              </div>
            </Panel>

            <Panel className="p-4 space-y-3">
              <PanelTitle icon={Target}>最佳实践与工序下钻建议</PanelTitle>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Sparkles className="size-4" /> 标杆单位：衡阳变压器公司
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  单台总碳排 1,370 kgCO2，较集团均值低 5.8%。主要优势在于器身干燥工序 100% 接入屋顶光伏绿电。
                </p>
                <button onClick={() => alert('已穿透至衡阳变压器 202608 生产订单明细')} className="text-primary font-semibold hover:underline mt-1 block">
                  查看标杆订单工序参数 →
                </button>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* Tab 2: 纵向对比 (红黑榜 Top10) */}
      {tab === 'vertical' && (
        <Panel className="p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <PanelTitle icon={TrendingUp}>重点产品型号碳足迹纵向评价红黑榜 (穿透至销售订单与排产计划)</PanelTitle>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setSelectedRankType('all')}
                className={cn('px-2.5 py-1 rounded', selectedRankType === 'all' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground')}
              >
                全部榜单
              </button>
              <button
                onClick={() => setSelectedRankType('red')}
                className={cn('px-2.5 py-1 rounded', selectedRankType === 'red' ? 'bg-emerald-600 text-white font-bold' : 'text-muted-foreground')}
              >
                🟢 绿色红榜 (Top 10)
              </button>
              <button
                onClick={() => setSelectedRankType('black')}
                className={cn('px-2.5 py-1 rounded', selectedRankType === 'black' ? 'bg-red-600 text-white font-bold' : 'text-muted-foreground')}
              >
                🔴 重点关注黑榜 (Top 10)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-accent/40 text-muted-foreground border-b border-border font-medium">
                <tr>
                  <th className="py-2.5 px-3">排名</th>
                  <th className="py-2.5 px-3">产品型号</th>
                  <th className="py-2.5 px-3">所属产线</th>
                  <th className="py-2.5 px-3">单台特征量(容量)</th>
                  <th className="py-2.5 px-3">累计生产台数</th>
                  <th className="py-2.5 px-3">单台碳排</th>
                  <th className="py-2.5 px-3">单位碳强度</th>
                  <th className="py-2.5 px-3">对标偏差</th>
                  <th className="py-2.5 px-3">关联排产计划</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {redBlackRankData
                  .filter((r) => selectedRankType === 'all' || r.type === selectedRankType)
                  .map((r) => (
                    <tr key={r.model} className="hover:bg-accent/30">
                      <td className="py-2.5 px-3 font-bold">{r.type === 'red' ? <span className="text-emerald-400">★ 0{r.rank}</span> : <span className="text-red-400">⚠ 0{r.rank}</span>}</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-foreground">{r.model}</td>
                      <td className="py-2.5 px-3 font-sans text-muted-foreground">{r.line}</td>
                      <td className="py-2.5 px-3 text-sky-400">{r.capacity}</td>
                      <td className="py-2.5 px-3">{r.totalCount} 台</td>
                      <td className="py-2.5 px-3 text-foreground">{r.singlePcf}</td>
                      <td className="py-2.5 px-3 font-bold">{r.unitPcf}</td>
                      <td className="py-2.5 px-3 font-sans"><StatusBadge tone={r.type === 'red' ? 'ok' : 'danger'}>{r.diff}</StatusBadge></td>
                      <td className="py-2.5 px-3 text-primary underline cursor-pointer" onClick={() => alert(`已穿透至实景数据库排产计划【${r.planNo}】碳核算台账`)}>{r.planNo}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* Tab 3: 基准对比与热点识别 */}
      {tab === 'benchmark' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel className="lg:col-span-2 p-4">
            <PanelTitle icon={BarChart3}>车间产线主材与生产环节单位碳排 (高碳排热点识别)</PanelTitle>
            <div className="mt-3">
              <BarGroup
                data={[
                  { name: '电磁线(铜材)', 单位碳排: 380, 基准线: 350 },
                  { name: '取向硅钢片', 单位碳排: 290, 基准线: 270 },
                  { name: '变压器绝缘油', 单位碳排: 180, 基准线: 160 },
                  { name: '真空干燥能耗', 单位碳排: 320, 基准线: 260 },
                  { name: '绕线与总装', 单位碳排: 110, 基准线: 110 },
                  { name: '绝缘试验', 单位碳排: 80, 基准线: 75 },
                ]}
                keys={['单位碳排', '基准线']}
                height={300}
              />
            </div>
          </Panel>

          <Panel className="p-4 space-y-3">
            <PanelTitle icon={AlertTriangle}>高碳热点诊断报告</PanelTitle>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
              <span className="font-bold text-amber-400 block">🔴 核心高碳排热点识别：</span>
              <p className="text-muted-foreground leading-relaxed">
                1. <strong>真空干燥工序</strong>：单位碳排超出车间基准 23.1%，主因是蒸汽加热系统冷凝水热损失偏大；
              </p>
              <p className="text-muted-foreground leading-relaxed">
                2. <strong>原生电磁铜线</strong>：占整机原材料碳排 48.5%，建议提高低碳再生铜采购比例。
              </p>
            </div>
          </Panel>
        </div>
      )}

      {/* Tab 4: 碳减排情景模拟 */}
      {tab === 'simulate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 左侧参数调节 */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-card border border-border space-y-4">
            <PanelTitle icon={Sliders}>低碳技术选型与减排策略模拟</PanelTitle>
            
            {/* 策略 1: 原材料替换 */}
            <div className="p-3 rounded-lg bg-accent/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">策略 1: 低碳/再生铜材料替代比例</span>
                <span className="font-mono font-bold text-sky-400">{reMat}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={reMat}
                onChange={(e) => setReMat(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <span className="text-[11px] text-muted-foreground block">采用 ISO 14021 认证低碳再生铜线，因子降幅达 65%</span>
            </div>

            {/* 策略 2: 绿电接入比例 */}
            <div className="p-3 rounded-lg bg-accent/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">策略 2: 制造工序绿电使用比例</span>
                <span className="font-mono font-bold text-emerald-400">{green}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={green}
                onChange={(e) => setGreen(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-muted-foreground block">屋顶分布式光伏直供 + 绿电绿证交易替代网电</span>
            </div>
          </div>

          {/* 右侧模拟结果 */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-card border border-border space-y-3 flex flex-col justify-between">
            <PanelTitle icon={Sparkles}>单台变压器减排潜力测算结果</PanelTitle>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-accent/40 border border-border">
                <span className="text-xs text-muted-foreground block">基准单台碳足迹</span>
                <span className="text-2xl font-bold font-mono text-foreground mt-1 block">{basePcf} <span className="text-xs font-sans text-muted-foreground">kgCO2</span></span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-xs text-emerald-400 block font-semibold">模拟后单台碳足迹</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">{afterPcf} <span className="text-xs font-sans text-emerald-500">kgCO2</span></span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs space-y-1 font-sans">
              <div className="flex justify-between"><span>单台产品净减排量：</span><span className="font-mono font-bold text-sky-400">-{totalSaved} kgCO2/台</span></div>
              <div className="flex justify-between"><span>整机碳足迹降幅：</span><span className="font-mono font-bold text-emerald-400">-{totalPct}% (显著达标)</span></div>
              <div className="flex justify-between"><span>预计欧盟 CBAM 关税节约：</span><span className="font-mono font-bold text-amber-400">€{Math.round((totalSaved / 1000) * 82)} /台</span></div>
            </div>

            <button onClick={() => alert('已将当前减排模拟方案保存为《ODFS-500kV 低碳工艺改良选型建议书》')} className="w-full py-2 rounded-md bg-primary text-primary-foreground font-semibold text-xs shadow">
              应用并生成工艺改进方案报告
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: 集采管控指标 */}
      {tab === 'kpi' && (
        <Panel className="p-4">
          <PanelTitle icon={Target}>产品碳足迹集采中心核心管控指标清单</PanelTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {indicators.filter((i) => i.center === '集采').map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-accent/30 border border-border/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sky-400 font-bold">JC-{String(item.id).padStart(2, '0')}</span>
                  <Badge tone="default">{item.category}</Badge>
                </div>
                <span className="font-semibold text-foreground block">{item.name}</span>
                <p className="text-[11px] text-muted-foreground leading-tight">{item.desc}</p>
                <div className="pt-1 flex justify-between text-[11px] font-mono">
                  <span>目标值: <strong className="text-foreground">{item.target}</strong></span>
                  <span className="text-emerald-400">达标</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  )
}

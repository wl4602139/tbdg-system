'use client'

import * as React from 'react'
import {
  Layers,
  Palette,
  Layout,
  Table as TableIcon,
  GitFork,
  Sliders,
  Code2,
  Copy,
  Check,
  Flame,
  Zap,
  Droplets,
  Wind,
  Cpu,
  BarChart3,
  Building2,
  Activity,
  Maximize2,
  MousePointerClick,
  LineChart as LineChartIcon,
} from 'lucide-react'
import {
  Panel,
  PanelTitle,
  KpiCard,
  DataTable,
  ExportButton,
  Tabs,
  StatusBadge,
  Toolbar,
  StandardOrgTree,
  SearchInput,
  StandardSelect,
  EmptyState,
  EnergyBadge,
  EnergyDot,
  TouBadge,
  BenchmarkIndicator,
  Pagination,
  Switch,
  Checkbox,
  Modal,
  Button,
  TimeRange,
  LineTrend,
  BarChartGroup,
  Donut,
  ENERGY_MEDIA_TOKENS,
  TOU_PERIOD_TOKENS,
  LAYOUT_TOKENS,
  TYPOGRAPHY_TOKENS,
} from './index'

export function DesignSystemShowcaseView() {
  const [activeTab, setActiveTab] = React.useState('all')
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null)
  const [sampleTab, setSampleTab] = React.useState('month')
  const [sampleSearch, setSampleSearch] = React.useState('')
  const [sampleSelect, setSampleSelect] = React.useState('all')
  const [selectedOrgId, setSelectedOrgId] = React.useState('sb-hq')

  // 分页状态
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(5)

  // 弹窗状态
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalSize, setModalSize] = React.useState<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'>('md')

  // 表单微控件状态
  const [switchState1, setSwitchState1] = React.useState(true)
  const [switchState2, setSwitchState2] = React.useState(false)
  const [checkState1, setCheckState1] = React.useState(true)
  const [checkState2, setCheckState2] = React.useState(false)

  function copyText(text: string) {
    navigator.clipboard.writeText(text)
    setCopiedToken(text)
    setTimeout(() => setCopiedToken(null), 1800)
  }

  // 扩充示例表格数据 (严格 44px 行高，12条真实业务工况样本)
  const sampleTableColumns = [
    { key: 'code', label: '工单/设备编号', align: 'left' as const, sortable: true },
    { key: 'name', label: '监测对象名称', align: 'left' as const },
    {
      key: 'media',
      label: '主耗介质',
      align: 'center' as const,
      render: (row: any) => <EnergyBadge media={row.media} />,
    },
    {
      key: 'value',
      label: '本期计量读数',
      align: 'right' as const,
      sortable: true,
      render: (row: any) => (
        <span className="font-mono font-bold text-foreground">
          {row.value.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{row.unit}</span>
        </span>
      ),
    },
    {
      key: 'trend',
      label: '时序同比',
      align: 'right' as const,
      render: (row: any) => (
        <BenchmarkIndicator delta={row.delta} up={row.up} />
      ),
    },
    {
      key: 'status',
      label: '工况状态',
      align: 'center' as const,
      render: (row: any) => (
        <StatusBadge tone={row.statusTone}>{row.statusText}</StatusBadge>
      ),
    },
  ]

  const allSampleRows = [
    { code: 'SB-TR-1001', name: '1# 1000kV脱气恒压真空干燥机组', media: 'steam', value: 128.5, unit: 't', delta: '-3.2%', up: false, statusTone: 'ok' as const, statusText: '运行中' },
    { code: 'SB-TR-1002', name: '特高压试验站 800kV 级试验电源', media: 'electricity', value: 38450, unit: 'kWh', delta: '+1.5%', up: true, statusTone: 'ok' as const, statusText: '运行中' },
    { code: 'LL-WL-2001', name: '2# 铝杆多模连续大拉机组', media: 'electricity', value: 19200, unit: 'kWh', delta: '-5.8%', up: false, statusTone: 'ok' as const, statusText: '运行中' },
    { code: 'HB-HV-3001', name: '超高压绝缘烘房天然气循环热风炉', media: 'gas', value: 2460, unit: 'm³', delta: '-0.8%', up: false, statusTone: 'warn' as const, statusText: '待机巡检' },
    { code: 'XB-MC-4001', name: '铁心全自动精密横剪步进产线', media: 'electricity', value: 8640, unit: 'kWh', delta: '+0.2%', up: true, statusTone: 'info' as const, statusText: '保养维护' },
    { code: 'LN-PT-5001', name: '露娜智能特种电机定子真空浸漆槽', media: 'electricity', value: 14200, unit: 'kWh', delta: '-2.1%', up: false, statusTone: 'ok' as const, statusText: '运行中' },
    { code: 'TL-EX-6001', name: '德缆 500kV 超高压三层共挤机组', media: 'electricity', value: 26800, unit: 'kWh', delta: '+3.4%', up: true, statusTone: 'ok' as const, statusText: '运行中' },
    { code: 'TC-CL-7001', name: '天池能源选煤车间重介质浅槽分选机', media: 'water', value: 5820, unit: 't', delta: '-1.5%', up: false, statusTone: 'ok' as const, statusText: '运行中' },
    { code: 'ZD-SI-8001', name: '准东高纯多晶硅 48 对棒加氢还原炉', media: 'electricity', value: 92400, unit: 'kWh', delta: '-4.6%', up: false, statusTone: 'ok' as const, statusText: '运行中' },
    { code: 'XB-TR-4002', name: '新变 750kV 试验站无晕屏蔽试验变压器', media: 'electricity', value: 11500, unit: 'kWh', delta: '+0.9%', up: true, statusTone: 'info' as const, statusText: '待机中' },
    { code: 'LL-CD-2002', name: '鲁缆铜导体连铸连轧无氧退火炉', media: 'gas', value: 3120, unit: 'm³', delta: '-2.7%', up: false, statusTone: 'ok' as const, statusText: '运行中' },
    { code: 'HB-TR-3002', name: '衡变 1000kV 环氧树脂真空浇注罐', media: 'steam', value: 94.2, unit: 't', delta: '-0.4%', up: false, statusTone: 'ok' as const, statusText: '运行中' },
  ]

  // 过滤与分页联动
  const filteredRows = React.useMemo(() => {
    return allSampleRows.filter(
      (r) => !sampleSearch || r.name.includes(sampleSearch) || r.code.includes(sampleSearch)
    )
  }, [sampleSearch])

  const paginatedRows = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, currentPage, pageSize])

  // 图表演示数据
  const trendData = [
    { time: '02:00', total: 4200, grid: 3800 },
    { time: '06:00', total: 5800, grid: 4600 },
    { time: '10:00', total: 9800, grid: 6200 },
    { time: '14:00', total: 11200, grid: 7100 },
    { time: '18:00', total: 8900, grid: 5800 },
    { time: '22:00', total: 6100, grid: 4500 },
  ]

  const donutData = [
    { name: '总用电量', value: 58, color: '#2C7CFF' },
    { name: '工艺蒸汽', value: 18, color: '#FFBA00' },
    { name: '新鲜用水', value: 14, color: '#10C4CE' },
    { name: '天然气', value: 10, color: '#FF6536' },
  ]

  const barCompareData = [
    { label: '线圈车间', current: 12400, baseline: 13500 },
    { label: '铁心车间', current: 18600, baseline: 18100 },
    { label: '装配车间', current: 24200, baseline: 26000 },
    { label: '绝缘车间', current: 9800, baseline: 10500 },
    { label: '试验站', current: 15300, baseline: 14800 },
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* 顶部主标题横幅 */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-xs relative overflow-hidden">
        <div className="tech-radial pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 rounded-full bg-[#2C7CFF] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
                TBEA DESIGN SYSTEM · V1.2.0 全业务闭环
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                集控中心标准模板
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              特变电工能碳数字化双中心 · 标准前端组件库
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              以零碳园区集控中心为权威模板构建。覆盖 8 大能源介质色、44px 表格、80×36px 导出、200×36px 输入、高密标准分页器、模态弹窗、通用按钮矩阵与工业图表套件。
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={() => setModalOpen(true)}
              className="gap-1.5"
            >
              <Maximize2 className="size-3.5" /> 弹窗示例
            </Button>
            <ExportButton
              title="导出规范"
              onClick={() => copyText(JSON.stringify(LAYOUT_TOKENS, null, 2))}
            />
          </div>
        </div>

        {/* 展区分段切换 Tab */}
        <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            items={[
              { value: 'all', label: '全景总览' },
              { value: 'tokens', label: '1. 规范字典 (Tokens)' },
              { value: 'cards', label: '2. 容器与KPI卡片' },
              { value: 'tables', label: '3. 44px表格与分页' },
              { value: 'tree', label: '4. 组织拓扑树' },
              { value: 'controls', label: '5. 常用表单与微控件' },
              { value: 'buttons', label: '6. 通用按钮套件' },
              { value: 'charts', label: '7. 工业图表与时序' },
              { value: 'code', label: '8. 统一调用范式' },
            ]}
          />
          {copiedToken && (
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium animate-fade-in">
              <Check className="size-3.5" /> 已复制到剪贴板
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 板块 1: Design Tokens 色彩与尺寸字典 */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'tokens') && (
        <Panel
          title="1. 官方色彩与规格字典 (Design Tokens)"
          icon={Palette}
          actions={
            <span className="text-xs text-muted-foreground font-mono">
              CSS: --primary: #2C7CFF
            </span>
          }
        >
          <div className="space-y-6">
            {/* 8 大能源介质官方标准色 */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <span className="h-3 w-1 rounded-full bg-[#2C7CFF]" />
                  8 大能源介质官方标准色字典 (Color Tokens)
                </h4>
                <span className="text-xs text-muted-foreground">点击色卡即可复制 Hex 色值</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {Object.values(ENERGY_MEDIA_TOKENS).map((token) => (
                  <button
                    key={token.id}
                    type="button"
                    onClick={() => copyText(token.color)}
                    className="group flex flex-col rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary hover:shadow-xs cursor-pointer"
                  >
                    <div
                      className="h-10 w-full rounded-md flex items-center justify-center text-white font-mono text-xs font-bold shadow-2xs"
                      style={{ backgroundColor: token.color }}
                    >
                      {token.unit}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{token.name}</span>
                      <Copy className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="mt-0.5 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      {token.color}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4 段分时电量色 + 基础尺寸规范 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/60">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <span className="h-3 w-1 rounded-full bg-[#FF6536]" />
                  分时电量 4 段类型色 (TOU: 尖 / 峰 / 平 / 谷)
                </h4>
                <div className="grid grid-cols-4 gap-2.5">
                  {Object.values(TOU_PERIOD_TOKENS).map((tou) => (
                    <button
                      key={tou.id}
                      type="button"
                      onClick={() => copyText(tou.color)}
                      className="rounded-lg border border-border bg-card p-2.5 text-center transition-all hover:border-primary cursor-pointer group"
                    >
                      <div
                        className="h-7 rounded flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: tou.color }}
                      >
                        {tou.short}
                      </div>
                      <p className="mt-1.5 text-xs font-medium text-foreground">{tou.name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground group-hover:text-primary">
                        {tou.color}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <span className="h-3 w-1 rounded-full bg-[#2C7CFF]" />
                  核心工业尺寸与间距标尺 (Layout Metrics)
                </h4>
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-lg border border-border bg-secondary/30 p-2.5">
                    <p className="text-xs text-muted-foreground">表格强制行高</p>
                    <p className="mt-1 font-mono text-base font-bold text-primary">44px</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-2.5">
                    <p className="text-xs text-muted-foreground">左侧导航栏宽</p>
                    <p className="mt-1 font-mono text-base font-bold text-primary">260px</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-2.5">
                    <p className="text-xs text-muted-foreground">面板圆角规范</p>
                    <p className="mt-1 font-mono text-base font-bold text-primary">8px</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-2.5">
                    <p className="text-xs text-muted-foreground">导出按钮规格</p>
                    <p className="mt-1 font-mono text-base font-bold text-primary">80×36px</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-2.5">
                    <p className="text-xs text-muted-foreground">输入/下拉框规格</p>
                    <p className="mt-1 font-mono text-base font-bold text-primary">200×36px</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-2.5">
                    <p className="text-xs text-muted-foreground">板块统一间距</p>
                    <p className="mt-1 font-mono text-base font-bold text-primary">24px</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* ========================================================================= */}
      {/* 板块 2: 容器与 KPI 指标卡展区 */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'cards') && (
        <div className="space-y-6">
          <PanelTitle
            title="2. 基础容器与指标卡体系 (Panel & KPI Cards)"
            icon={Layout}
            action={<span className="text-xs text-muted-foreground">严格遵循 14px/24px/14px 字体阶梯</span>}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="全厂总用电量 (当日采样)"
              value="128,450"
              unit="kWh"
              delta="-4.2%"
              up={false}
              icon={Zap}
            />
            <KpiCard
              title="工艺蒸汽消耗 (管道供汽)"
              value="1,840.5"
              unit="t"
              delta="+1.8%"
              up={true}
              icon={Flame}
            />
            <KpiCard
              title="新鲜工业用水 (循环计量)"
              value="3,260"
              unit="t"
              delta="-0.9%"
              up={false}
              icon={Droplets}
            />
            <KpiCard
              title="天然气窑炉消耗 (热力采样)"
              value="8,920"
              unit="m³"
              delta="-5.1%"
              up={false}
              icon={Wind}
            />
          </div>

          <Panel
            title="标准工业面板容器 (Panel Showcase)"
            icon={Activity}
            actions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
                  打开弹窗
                </Button>
                <ExportButton title="导出" onClick={() => alert('触发标准 80x36px 导出！')} />
              </div>
            }
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              `Panel` 组件作为集控中心统一的卡片容器：固定采用 8px 圆角（`rounded-lg`）、浅色端纯白填充、`#DBE6EE` 工业浅蓝灰描边、16px 加粗主标题与左侧科技蓝高亮指示条。支持右上角灵活挂载 `actions` 插槽，内边距标准为 16px。
            </p>
          </Panel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 板块 3: 44px 工业高密数据表格与标准分页器展区 */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'tables') && (
        <Panel
          title="3. 44px 工业高密数据表格与标准分页联动 (DataTable & Pagination)"
          icon={TableIcon}
          actions={
            <div className="flex items-center gap-3">
              <SearchInput
                placeholder="搜索设备/工单..."
                value={sampleSearch}
                onChange={(e) => {
                  setSampleSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
              <ExportButton title="导出台账" onClick={() => alert('点击导出！')} />
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>表格每一行严格设定行高为 44px (`h-[44px]`)，文本垂直居中，数字列启用 Mono 等宽右对齐</span>
              <span className="font-mono">共 {filteredRows.length} 条样本记录</span>
            </div>

            {/* 44px 高密数据表格 */}
            <DataTable
              columns={sampleTableColumns}
              rows={paginatedRows}
            />

            {/* 工业标准配套分页器 (与表格联动) */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredRows.length}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 20]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setCurrentPage(1)
              }}
            />

            {/* 极简客观单行空状态规范对比 */}
            <div className="pt-4 border-t border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                极简客观单行空状态规范 (EmptyState)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-card p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">工序判空模式 (无工序单位)</p>
                  <EmptyState type="process" className="py-2" />
                </div>
                <div className="rounded-lg border border-border bg-card p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">产品判空模式</p>
                  <EmptyState type="product" className="py-2" />
                </div>
                <div className="rounded-lg border border-border bg-card p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">记录判空模式</p>
                  <EmptyState type="record" className="py-2" />
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* ========================================================================= */}
      {/* 板块 4: 组织架构拓扑树展区 */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'tree') && (
        <Panel
          title="4. 标准组织架构树规范 (StandardOrgTree)"
          icon={GitFork}
          actions={
            <span className="text-xs text-muted-foreground font-mono">
              宽度: 260px | 行高: 30px | 激活底色: #EBF3FF
            </span>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 rounded-lg border border-border overflow-hidden bg-card">
              <StandardOrgTree
                selectedId={selectedOrgId}
                onSelect={(id) => setSelectedOrgId(id)}
              />
            </div>
            <div className="lg:col-span-8 flex flex-col justify-center space-y-4 rounded-lg border border-dashed border-border p-6 bg-secondary/10">
              <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                当前选中架构节点：<span className="font-mono text-primary">{selectedOrgId}</span>
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc list-inside">
                <li><strong className="text-foreground">统一固定 260px 宽度</strong>：人机工程黄金宽度，避免挤占右侧监控主屏。</li>
                <li><strong className="text-foreground">节点间距与行高统一 30px</strong>：呼吸感通透，消灭视线密闭拥挤感。</li>
                <li><strong className="text-foreground">企业括号全称清洗</strong>：如将“露娜公司 (特变电工露娜智能)”规范清洗为纯净“露娜公司”。</li>
                <li><strong className="text-foreground">9 家未联网单位精准置灰</strong>：沈变、衡变、新变、鲁缆下属未接入工厂图标置灰、设备数显示 (0) 且禁止点选。</li>
                <li><strong className="text-foreground">激活选中浅蓝圆角底色</strong>：选中项呈现 <code className="text-primary font-mono">#EBF3FF</code>，加粗深蓝自解释高亮。</li>
              </ul>
            </div>
          </div>
        </Panel>
      )}

      {/* ========================================================================= */}
      {/* 板块 5: 交互控制与表单微控件展区 */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'controls') && (
        <Panel title="5. 常用表单与微控件 (Controls & Form Widgets)" icon={Sliders}>
          <div className="space-y-6">
            {/* 胶囊 Tabs 演示 */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <span className="h-3 w-1 rounded-full bg-[#2C7CFF]" />
                胶囊 Tab 切换组件 (实心科技蓝 #2C7CFF 激活态 + 8px 圆角)
              </h4>
              <div className="flex items-center gap-4">
                <Tabs
                  value={sampleTab}
                  onChange={setSampleTab}
                  items={[
                    { value: 'day', label: '日' },
                    { value: 'month', label: '月' },
                    { value: 'quarter', label: '季度' },
                    { value: 'year', label: '年' },
                    { value: 'custom', label: '自定义' },
                  ]}
                />
                <span className="text-xs text-muted-foreground font-mono">激活值：{sampleTab}</span>
              </div>
            </div>

            {/* 输入框与下拉选择框规格 */}
            <div className="pt-4 border-t border-border/60">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <span className="h-3 w-1 rounded-full bg-[#2C7CFF]" />
                标准输入与下拉选择规格 (固定宽 200px、高 36px、8px 圆角、#E2E8F0 描边)
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <SearchInput
                  value={sampleSearch}
                  onChange={(e) => setSampleSearch(e.target.value)}
                  placeholder="200px × 36px 搜索框"
                />
                <StandardSelect
                  value={sampleSelect}
                  onChange={setSampleSelect}
                  options={[
                    { value: 'all', label: '全部监测介质' },
                    { value: 'electricity', label: '电力监测' },
                    { value: 'steam', label: '蒸汽监测' },
                    { value: 'water', label: '水资源监测' },
                    { value: 'gas', label: '天然气监测' },
                  ]}
                />
                <ExportButton title="导出" onClick={() => alert('80x36px 标准按钮')} />
              </div>
            </div>

            {/* 表单微控件 Switch 与 Checkbox */}
            <div className="pt-4 border-t border-border/60">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <span className="h-3 w-1 rounded-full bg-[#2C7CFF]" />
                工业标准微控件 (Switch 开关 & Checkbox 复选框)
              </h4>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4">
                  <Switch
                    checked={switchState1}
                    onChange={setSwitchState1}
                    label="自动同步数据"
                  />
                  <Switch
                    checked={switchState2}
                    onChange={setSwitchState2}
                    label="高温告警推送"
                  />
                </div>
                <div className="h-5 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={checkState1}
                    onChange={setCheckState1}
                    label="已校准设备"
                  />
                  <Checkbox
                    checked={checkState2}
                    onChange={setCheckState2}
                    label="仅看超标项目"
                  />
                </div>
              </div>
            </div>

            {/* 客观中立状态徽章与 TOU 标签 */}
            <div className="pt-4 border-t border-border/60">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <span className="h-3 w-1 rounded-full bg-[#2C7CFF]" />
                客观状态徽章与分时电量标签
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge tone="ok">运行中</StatusBadge>
                <StatusBadge tone="info">待机中</StatusBadge>
                <StatusBadge tone="warn">计划检修</StatusBadge>
                <StatusBadge tone="danger">超标告警</StatusBadge>
                <StatusBadge tone="muted">离线停运</StatusBadge>
                <span className="h-4 w-px bg-border mx-1" />
                <TouBadge period="sharp" />
                <TouBadge period="peak" />
                <TouBadge period="flat" />
                <TouBadge period="valley" />
                <span className="h-4 w-px bg-border mx-1" />
                <EnergyBadge media="electricity" showUnit />
                <EnergyBadge media="steam" showUnit />
                <EnergyBadge media="green" showUnit />
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* ========================================================================= */}
      {/* 板块 6: 通用操作按钮矩阵与弹窗展示 */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'buttons') && (
        <Panel title="6. 通用操作按钮套件与模态弹窗 (Button & Modal)" icon={MousePointerClick}>
          <div className="space-y-6">
            {/* 按钮变体演示 */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <span className="h-3 w-1 rounded-full bg-[#2C7CFF]" />
                通用操作按钮各变体规格 (支持 primary, outline, secondary, ghost, destructive)
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default">Primary 主要操作</Button>
                <Button variant="outline">Outline 边框次要</Button>
                <Button variant="secondary">Secondary 灰底次要</Button>
                <Button variant="ghost">Ghost 幽灵按钮</Button>
                <Button variant="destructive">Destructive 危险删除</Button>
              </div>
            </div>

            {/* 按钮尺寸阶梯 */}
            <div className="pt-4 border-t border-border/60">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <span className="h-3 w-1 rounded-full bg-[#2C7CFF]" />
                按钮三级标准尺寸阶梯 (高度：sm 28px, default 32px, lg 36px)
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">小型按钮 (28px)</Button>
                <Button size="default">标准按钮 (32px)</Button>
                <Button size="lg">大型操作 (36px)</Button>
                <ExportButton title="80x36px 专用导出" onClick={() => {}} />
              </div>
            </div>

            {/* 模态弹窗交互唤起 */}
            <div className="pt-4 border-t border-border/60">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <span className="h-3 w-1 rounded-full bg-[#2C7CFF]" />
                标准工业模态弹窗 (Modal: 6 档尺寸字典，8px 圆角与 ESC/遮罩关闭)
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">尺寸预设：</span>
                  {(['sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setModalSize(sz)
                        setModalOpen(true)
                      }}
                      className="px-2.5 py-1 text-xs font-mono rounded-md border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => {
                    setModalSize('md')
                    setModalOpen(true)
                  }}
                  className="gap-1.5 ml-auto"
                >
                  <Maximize2 className="size-3.5" /> 唤起当前 Modal 演示
                </Button>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* ========================================================================= */}
      {/* 板块 7: 工业图表与时序筛选套件 */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'charts') && (
        <Panel title="7. 工业图表套件与时序范围筛选 (Charts & TimeRange)" icon={LineChartIcon}>
          <div className="space-y-6">
            {/* 时序筛选条 */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div>
                <h4 className="text-sm font-semibold text-foreground">标准时序范围筛选器 (TimeRange)</h4>
                <p className="text-xs text-muted-foreground mt-0.5">支持快捷周期切换与起止日期精确选择</p>
              </div>
              <TimeRange />
            </div>

            {/* 3 类高频图表示例 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 1. 折线趋势图 */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-foreground">24h 负荷趋势图 (LineTrend)</h5>
                  <span className="text-xs text-muted-foreground font-mono">kWh</span>
                </div>
                <div className="h-[220px]">
                  <LineTrend
                    data={trendData}
                    lines={[
                      { key: 'total', name: '总用电', color: '#2C7CFF' },
                      { key: 'grid', name: '市电供应', color: '#41C0FF' },
                    ]}
                  />
                </div>
              </div>

              {/* 2. 环形占比图 */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-foreground">8 介质占比分析 (Donut)</h5>
                  <span className="text-xs text-muted-foreground font-mono">%</span>
                </div>
                <div className="h-[220px]">
                  <Donut
                    data={donutData}
                    centerLabel="综合能耗"
                    centerValue="100%"
                  />
                </div>
              </div>

              {/* 3. 分组柱状对比图 */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-foreground">车间能耗对标 (BarChartGroup)</h5>
                  <span className="text-xs text-muted-foreground font-mono">tce</span>
                </div>
                <div className="h-[220px]">
                  <BarChartGroup
                    data={barCompareData}
                    bars={[
                      { key: 'current', name: '本期实测', color: '#2C7CFF' },
                      { key: 'baseline', name: '定额基准', color: '#8E73ED' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* ========================================================================= */}
      {/* 板块 8: 代码调用范式 */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'code') && (
        <Panel
          title="8. 标准开发调用代码范式 (Code Snippets)"
          icon={Code2}
          actions={
            <ExportButton
              title="复制代码"
              onClick={() =>
                copyText(`import {
  Panel,
  KpiCard,
  DataTable,
  Pagination,
  Modal,
  Button,
  ExportButton,
  Tabs,
  StatusBadge,
  SearchInput,
  StandardSelect,
  Switch,
  Checkbox,
  TimeRange,
  LineTrend,
  ENERGY_MEDIA_TOKENS,
} from '@/components/design-system'`)
              }
            />
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              特变电工能碳数字化双中心已将所有标准组件统一收敛至 <code className="text-primary font-mono font-bold">@/components/design-system</code>。任何新功能模块或页面重构，直接通过标准导入即可享受完整的类型提示与 100% 工业设计规范：
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs font-mono text-slate-50 leading-relaxed border border-slate-800">
{`// 1. 一站式导入特变电工标准组件库 (全量闭环)
import {
  Panel,
  KpiCard,
  DataTable,
  Pagination,
  Modal,
  Button,
  ExportButton,
  Tabs,
  StatusBadge,
  StandardOrgTree,
  SearchInput,
  StandardSelect,
  Switch,
  Checkbox,
  TimeRange,
  LineTrend,
  ENERGY_MEDIA_TOKENS,
} from '@/components/design-system'

// 2. 页面中标准开发与 44px 高密表格 + 分页联动示例
export default function MonitorModulePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* 24px 间距，标准 Panel 容器 */}
      <Panel
        title="在线设备用能明细"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>配置规则</Button>
            <ExportButton title="导出" onClick={() => {}} />
          </div>
        }
      >
        {/* 44px 高密表格 */}
        <DataTable columns={columns} rows={pageRows} />

        {/* 标准工业分页器 */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </Panel>

      {/* 标准 8px 圆角模态弹窗 */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="参数配置"
        size="md"
      >
        <div className="space-y-4 py-2">
          {/* 表单内容 */}
        </div>
      </Modal>
    </div>
  )
}`}
            </pre>
          </div>
        </Panel>
      )}

      {/* 演示用标准模态弹窗 */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="特变电工工业标准模态弹窗 (Modal)"
        description={`当前展示尺寸规格：${modalSize}（遵循 8px 圆角与 #2C7CFF 科技蓝设计规范）`}
        size={modalSize}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setModalOpen(false)}>
              确认提交
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-border bg-secondary/20 p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              本弹窗基于 <code className="text-primary font-mono">Modal</code> 组件构建：支持 <code className="font-mono text-foreground">sm / md / lg / xl / 2xl / 3xl</code> 六档工业响应式最大宽度，自带 ESC 快捷退出、背景柔和模糊遮罩、滚动穿透锁定与 8px 圆角，可无缝承载复杂多列工业表单。
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">配置项目名称</label>
              <SearchInput placeholder="请输入名称" className="w-full" containerClassName="w-full" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">核算介质</label>
              <StandardSelect
                options={[
                  { value: 'elec', label: '电力 (kWh)' },
                  { value: 'steam', label: '蒸汽 (t)' },
                ]}
                className="w-full"
              />
            </div>
          </div>
          <div className="pt-2 flex items-center gap-6">
            <Switch checked={true} label="开启异常工况自动推送" />
            <Checkbox checked={true} label="计入车间考核台账" />
          </div>
        </div>
      </Modal>
    </div>
  )
}

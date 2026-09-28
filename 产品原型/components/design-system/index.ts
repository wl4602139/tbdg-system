/**
 * 特变电工能碳数字化双中心 · 标准组件库统一出口 (TBEA Design System)
 * 以“零碳园区集控中心”为核心模板抽象与封装，全业务生命周期闭环
 */

// 1. Design Tokens 官方色彩与规格标尺
export * from './tokens'

// 2. 标准微交互与表单业务控件 (SearchInput, StandardSelect, EmptyState, Badges, Switch, Checkbox 等)
export * from './controls'

// 3. 工业高密数据表格配套分页器 (Pagination)
export * from './pagination'

// 4. 核心基础原子容器与数据组件 (源自 primitives)
export {
  Panel,
  PanelTitle,
  KpiCard,
  DataTable,
  ExportButton,
  Tabs,
  StatusBadge,
  Badge,
  Toolbar,
} from '@/components/shared/primitives'

// 5. 标准弹窗组件 (源自 shared/modal)
export { Modal } from '@/components/shared/modal'

// 6. 通用操作按钮套件 (源自 ui/button)
export { Button, buttonVariants } from '@/components/ui/button'

// 7. 时序范围筛选器 (源自 shared/time-range)
export { TimeRange } from '@/components/shared/time-range'

// 8. 工业时序与图表套件 (源自 shared/charts)
export {
  LineTrend,
  AreaTrend,
  Donut,
  BarChartGroup,
  RadarCompare,
  BarBenchmark,
  RoseChart,
  SankeyFlow,
  ENERGY_COLORS,
  TOU_COLORS,
  chartColors,
  donutColors,
} from '@/components/shared/charts'

// 9. 标准组织架构树组件 (源自 standard-org-tree)
export {
  StandardOrgTree,
  type OrgNode,
} from '@/components/shared/standard-org-tree'

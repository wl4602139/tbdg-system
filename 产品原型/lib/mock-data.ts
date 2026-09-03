/* 全平台前端模拟数据 —— 贴近特变电工电装集团业务场景 */

export const parks = ['昌吉园区', '天津园区', '沈阳园区', '西安园区', '衡阳园区']

export const factories = [
  '天津变压器厂',
  '衡阳电缆厂',
  '沈阳开关厂',
  '昌吉线缆厂',
  '西安互感器厂',
]

/* 集控大屏指标 */
export const screenKpis = [
  { label: '园区数量', value: '15', unit: '个', delta: '+2', up: true },
  { label: '经营单位', value: '21', unit: '家', delta: '+1', up: true },
  { label: '当日绿电占比', value: '38.6', unit: '%', delta: '+3.2%', up: true },
  { label: '综合能耗', value: '12.8', unit: '万tce', delta: '-4.1%', up: false },
  { label: '碳排放强度', value: '0.62', unit: 'tCO2/万元', delta: '-6.5%', up: false },
  { label: '零碳项目', value: '34', unit: '个', delta: '+5', up: true },
]

/* 园区建设进度 */
export const parkProgress = [
  { park: '昌吉园区', stage: '已建成', progress: 100, score: 92 },
  { park: '天津园区', stage: '在建', progress: 74, score: 81 },
  { park: '沈阳园区', stage: '在建', progress: 58, score: 76 },
  { park: '西安园区', stage: '规划', progress: 22, score: 63 },
  { park: '衡阳园区', stage: '在建', progress: 66, score: 79 },
]

/* 月度能耗趋势 */
export const energyTrend = [
  { month: '1月', 电: 820, 气: 260, 水: 120, 蒸汽: 180 },
  { month: '2月', 电: 760, 气: 240, 水: 110, 蒸汽: 160 },
  { month: '3月', 电: 910, 气: 300, 水: 140, 蒸汽: 210 },
  { month: '4月', 电: 880, 气: 280, 水: 130, 蒸汽: 200 },
  { month: '5月', 电: 950, 气: 320, 水: 150, 蒸汽: 230 },
  { month: '6月', 电: 1020, 气: 340, 水: 160, 蒸汽: 250 },
  { month: '7月', 电: 1120, 气: 360, 水: 180, 蒸汽: 270 },
  { month: '8月', 电: 1080, 气: 350, 水: 170, 蒸汽: 260 },
]

/* 用能结构占比 */
export const energyStructure = [
  { name: '电', value: 52, color: 'var(--chart-1)' },
  { name: '天然气', value: 21, color: 'var(--chart-3)' },
  { name: '蒸汽', value: 16, color: 'var(--chart-4)' },
  { name: '水', value: 7, color: 'var(--chart-2)' },
  { name: '其他', value: 4, color: 'var(--chart-5)' },
]

/* 绿电消纳 */
export const greenPower = [
  { month: '1月', 直供绿电: 320, 交易绿电: 140, 购绿证: 60 },
  { month: '2月', 直供绿电: 300, 交易绿电: 150, 购绿证: 70 },
  { month: '3月', 直供绿电: 380, 交易绿电: 160, 购绿证: 80 },
  { month: '4月', 直供绿电: 410, 交易绿电: 170, 购绿证: 75 },
  { month: '5月', 直供绿电: 460, 交易绿电: 190, 购绿证: 90 },
  { month: '6月', 直供绿电: 520, 交易绿电: 210, 购绿证: 100 },
]

/* 碳排放趋势 */
export const carbonTrend = [
  { month: '1月', 范围一: 420, 范围二: 680, 范围三: 240 },
  { month: '2月', 范围一: 400, 范围二: 640, 范围三: 220 },
  { month: '3月', 范围一: 460, 范围二: 720, 范围三: 260 },
  { month: '4月', 范围一: 440, 范围二: 700, 范围三: 250 },
  { month: '5月', 范围一: 470, 范围二: 730, 范围三: 270 },
  { month: '6月', 范围一: 450, 范围二: 690, 范围三: 255 },
]

/* 指标管控表 */
export const indicatorRows = [
  { name: '综合能耗', factory: '天津变压器厂', current: 1280, base: 1350, target: 1200, status: '正常' },
  { name: '单位产品能耗', factory: '衡阳电缆厂', current: 86.4, base: 82, target: 80, status: '异常' },
  { name: '绿电占比', factory: '沈阳开关厂', current: 41.2, base: 38, target: 45, status: '优秀' },
  { name: '碳排放强度', factory: '昌吉线缆厂', current: 0.68, base: 0.62, target: 0.6, status: '异常' },
  { name: '水耗', factory: '西安互感器厂', current: 156, base: 160, target: 150, status: '正常' },
  { name: '蒸汽单耗', factory: '天津变压器厂', current: 0.42, base: 0.4, target: 0.38, status: '异常' },
]

/* 产品碳足迹总览（红黑榜） */
export const productFootprint = [
  { product: 'SG10-2500kVA 变压器', line: '变压器', pcf: 12680, base: 13200, rank: 1 },
  { product: 'YJV-8.7/15kV 电缆', line: '电缆', pcf: 8420, base: 8100, rank: 2 },
  { product: 'ZW32-12 户外真空开关', line: '开关', pcf: 3260, base: 3400, rank: 3 },
  { product: 'S13-M-800kVA 变压器', line: '变压器', pcf: 6980, base: 7200, rank: 4 },
  { product: 'YJV22-26/35kV 电缆', line: '电缆', pcf: 15240, base: 14800, rank: 5 },
  { product: 'LW3-12 六氟化硫断路器', line: '开关', pcf: 4180, base: 4000, rank: 6 },
]

/* 碳热点构成 */
export const hotspotData = [
  { name: '原材料获取', value: 62, color: 'var(--chart-1)' },
  { name: '生产制造', value: 21, color: 'var(--chart-3)' },
  { name: '原材料运输', value: 9, color: 'var(--chart-4)' },
  { name: '废弃物处理', value: 8, color: 'var(--chart-5)' },
]

/* 同品类横向对比 */
export const compareData = [
  { factory: '天津变压器厂', 原材料: 8200, 生产: 2800, 运输: 680 },
  { factory: '西安互感器厂', 原材料: 8600, 生产: 3100, 运输: 720 },
  { factory: '沈阳开关厂', 原材料: 7900, 生产: 2600, 运输: 640 },
  { factory: '昌吉线缆厂', 原材料: 8800, 生产: 3300, 运输: 760 },
]

/* 因子库 */
export const factorRows = [
  { name: '电力（华北电网）', type: '能源', value: 0.5703, unit: 'kgCO2/kWh', version: 'v2025.1', source: '国家电网' },
  { name: '硅钢片', type: '原材料-变压器', value: 2.14, unit: 'kgCO2/kg', version: 'v2025.1', source: '实测' },
  { name: '电解铜', type: '原材料-线缆', value: 3.86, unit: 'kgCO2/kg', version: 'v2024.3', source: '数据库' },
  { name: '铝锭', type: '原材料-线缆', value: 8.42, unit: 'kgCO2/kg', version: 'v2025.1', source: '数据库' },
  { name: '公路运输（重卡）', type: '运输', value: 0.093, unit: 'kgCO2/t·km', version: 'v2025.1', source: '行业默认' },
]

/* 告警列表 */
export const alarms = [
  { time: '2026-08-17 09:24', level: '严重', source: '天津变压器厂', rule: '碳排放超额', status: '未处理' },
  { time: '2026-08-17 08:51', level: '警告', source: '衡阳电缆厂', rule: '单耗超标', status: '处理中' },
  { time: '2026-08-16 22:10', level: '提示', source: '沈阳开关厂', rule: '绿电占比偏低', status: '已处理' },
  { time: '2026-08-16 18:35', level: '警告', source: '昌吉线缆厂', rule: '能耗突增', status: '未处理' },
  { time: '2026-08-16 14:02', level: '严重', source: '西安互感器厂', rule: '设备离线', status: '已处理' },
]

/* 系统管理 - 账号 */
export const accounts = [
  { id: 'U001', name: '张伟', account: 'zhangwei', role: '集团管理员', org: '电装集团', scope: '集团', phone: '138****1120', status: '启用' },
  { id: 'U002', name: '李静', account: 'lijing', role: '园区管理员', org: '天变公司', scope: '天津园区', phone: '139****4022', status: '启用' },
  { id: 'U003', name: '王强', account: 'wangqiang', role: '经营单位', org: '鲁缆本部', scope: '衡阳电缆厂', phone: '137****7781', status: '启用' },
  { id: 'U004', name: '赵敏', account: 'zhaomin', role: '节能专员', org: '沈变本部', scope: '沈阳园区', phone: '135****6690', status: '停用' },
  { id: 'U005', name: '陈涛', account: 'chentao', role: '审计员', org: '电装集团', scope: '集团（只读）', phone: '136****3345', status: '启用' },
]

/* 系统管理 - 角色与权限 */
export type SysRole = {
  id: string
  name: string
  desc: string
  users: number
  scope: string
  builtin: boolean
  perms: string[] // 已授权的一级功能
}
export const sysRoles: SysRole[] = [
  { id: 'R001', name: '集团管理员', desc: '集团级最高权限，可配置全部功能与数据', users: 2, scope: '全集团', builtin: true, perms: ['权限管控', '数据录入', '能碳基础因子管理', '日志管理'] },
  { id: 'R002', name: '园区管理员', desc: '负责所辖园区的用户、数据录���与因子应用', users: 6, scope: '所辖园区', builtin: true, perms: ['数据录入', '能碳基础因子管理'] },
  { id: 'R003', name: '经营单位', desc: '经营单位数据录入与本单位数据查看', users: 23, scope: '本经营单位', builtin: false, perms: ['数据录入'] },
  { id: 'R004', name: '节能专员', desc: '能耗与碳排数据分析、因子查看', users: 11, scope: '所辖园区', builtin: false, perms: ['能碳基础因子管理'] },
  { id: 'R005', name: '审计员', desc: '全集团只读，专职查看操作与安全日志', users: 3, scope: '全集团（只读）', builtin: true, perms: ['日志管理'] },
]

/* 系统管理 - 菜单与功能（按钮级功能点） */
export type SysMenu = { module: string; menu: string; actions: string[] }
export const sysMenus: SysMenu[] = [
  { module: '零碳园区集控中心', menu: '集中监管', actions: ['查看', '导出', '指标配置'] },
  { module: '零碳园区集控中心', menu: '能耗能效分析', actions: ['查看', '导出', '自助分析'] },
  { module: '零碳园区集控中心', menu: '碳管理', actions: ['查看', '核算', '报告下载', '核查提交'] },
  { module: '产品碳足迹集采中心', menu: '多维分析', actions: ['查看', '导出', '下钻'] },
  { module: '产品碳足迹集采中心', menu: '实景数据库', actions: ['查看', '新增', '编辑', '数据追踪'] },
  { module: '产品碳足迹集采中心', menu: 'CBAM管理', actions: ['查看', '新增', '编辑', '删除', '申报模拟'] },
  { module: '产品碳足迹集采中心', menu: '第三方认证管理', actions: ['查看', '申请', '结果录入'] },
]

/* 系统管理 - 能碳基础因子 */
export type SysFactor = {
  id: string
  name: string
  category: string
  value: number
  unit: string
  source: string
  scope: string
  version: string
  effective: string
  status: '启用' | '停用'
}
export const sysFactorCategories = ['电力', '化石燃料', '热力/蒸汽', '运输', '原材料', '制冷剂']
export const sysFactors: SysFactor[] = [
  { id: 'F001', name: '华北电网电力', category: '电力', value: 0.5703, unit: 'kgCO2e/kWh', source: '生态环境部 2024', scope: '通用', version: 'v2024.1', effective: '2026-01-01', status: '启用' },
  { id: 'F002', name: '华东电网电力', category: '电力', value: 0.5257, unit: 'kgCO2e/kWh', source: '生态环境部 2024', scope: '通用', version: 'v2024.1', effective: '2026-01-01', status: '启用' },
  { id: 'F003', name: '天然气', category: '化石燃料', value: 2.1622, unit: 'kgCO2e/m³', source: 'IPCC 2006', scope: '通用', version: 'v2023.2', effective: '2025-06-01', status: '启用' },
  { id: 'F004', name: '标准煤', category: '化石燃料', value: 2.6600, unit: 'kgCO2e/kg', source: 'IPCC 2006', scope: '通用', version: 'v2023.2', effective: '2025-06-01', status: '启用' },
  { id: 'F005', name: '外购蒸汽', category: '热力/蒸汽', value: 0.1100, unit: 'kgCO2e/MJ', source: '股份下发', scope: '变压器产业', version: 'v2026.1', effective: '2026-03-01', status: '启用' },
  { id: 'F006', name: '公路货运（柴油重卡）', category: '运输', value: 0.0930, unit: 'kgCO2e/t·km', source: 'GLEC 2023', scope: '通用', version: 'v2023.1', effective: '2025-01-01', status: '启用' },
  { id: 'F007', name: '取向硅钢', category: '原材料', value: 2.8500, unit: 'kgCO2e/kg', source: '供应商实测', scope: '变压器产业', version: 'v2026.1', effective: '2026-02-01', status: '停用' },
]

/* 系统管理 - 数据录入记录 */
export type SysEntry = {
  id: string
  batch: string
  type: string
  org: string
  period: string
  submitter: string
  submitTime: string
  status: '草稿' | '待审核' | '已入库' | '已退回'
}
export const sysEntryTypes = ['能耗数据', '碳排活动数据', '产量数据', '绿电数据', '原材料用量']
export const sysEntries: SysEntry[] = [
  { id: 'E001', batch: 'DR-260817-01', type: '能耗数据', org: '衡变本部', period: '2026-07', submitter: '王强', submitTime: '2026-08-17 09:20', status: '已入库' },
  { id: 'E002', batch: 'DR-260817-02', type: '碳排活动数据', org: '沈变本部', period: '2026-07', submitter: '赵敏', submitTime: '2026-08-17 10:05', status: '待审核' },
  { id: 'E003', batch: 'DR-260816-03', type: '产量数据', org: '天变公司', period: '2026-07', submitter: '李静', submitTime: '2026-08-16 16:40', status: '草稿' },
  { id: 'E004', batch: 'DR-260816-01', type: '绿电数据', org: '超高压公司', period: '2026-07', submitter: '李静', submitTime: '2026-08-16 11:12', status: '已退回' },
  { id: 'E005', batch: 'DR-260815-05', type: '原材料用量', org: '云集电气', period: '2026-06', submitter: '王强', submitTime: '2026-08-15 15:33', status: '已入库' },
]

/* 系统管理 - 日志 */
export type SysLog = {
  time: string
  user: string
  action: string
  target: string
  ip: string
  result: '成功' | '失败'
  category: '登录' | '数据操作' | '因子变更' | '权限变更' | '导出'
}
export const sysLogCategories = ['登录', '数据操作', '因子变更', '权限变更', '导出']
export const sysLogs: SysLog[] = [
  { time: '2026-08-17 09:41', user: '张伟', action: '修改碳排因子', target: '华北电网电力', ip: '10.20.3.11', result: '成功', category: '因子变更' },
  { time: '2026-08-17 09:20', user: '王强', action: '提交能耗数据', target: 'DR-260817-01', ip: '10.20.4.22', result: '成功', category: '数据操作' },
  { time: '2026-08-17 09:12', user: '李静', action: '新增账号', target: 'wangqiang', ip: '10.20.4.22', result: '成功', category: '权限变更' },
  { time: '2026-08-16 17:30', user: '赵敏', action: '导出碳排放报告', target: '沈阳园区', ip: '10.20.6.7', result: '成功', category: '导出' },
  { time: '2026-08-16 15:05', user: '张伟', action: '角色权限调整', target: '园区管理员', ip: '10.20.3.11', result: '成功', category: '权限变更' },
  { time: '2026-08-16 08:59', user: 'unknown', action: '登录', target: 'admin', ip: '113.88.20.4', result: '失败', category: '登录' },
]

/* 荣誉轮播 */
export const honors = [
  '国家级绿色工厂 · 天津变压器厂',
  '2025 行业碳足迹标杆企业',
  '自治区零碳园区示范项目',
  'ISO 14067 产品碳足迹认证 21 项',
  '国家能耗在线监测优秀单位',
]

/* 状态 → 语义色调（供 StatusBadge tone 使用） */
export type Tone = 'ok' | 'info' | 'warn' | 'danger' | 'muted'
export function statusColor(key: string): Tone {
  const map: Record<string, Tone> = {
    正常: 'info',
    优秀: 'ok',
    异常: 'danger',
    有效: 'ok',
    临期: 'warn',
    已过期: 'danger',
    启用: 'ok',
    停用: 'muted',
    未处理: 'danger',
    处理中: 'warn',
    已处理: 'ok',
    提示: 'info',
    info: 'info',
    警告: 'warn',
    warn: 'warn',
    严重: 'danger',
    critical: 'danger',
    可申报: 'ok',
    待申报: 'warn',
    材料待补: 'danger',
  }
  return map[key] ?? 'muted'
}

/* 告警规则配置 */
export const alertRules = [
  { name: '单位产品综合能耗超标', dimension: '单耗', condition: '阈值 > 120 持续30min', level: 'critical', levelText: '严重', channel: '站内+企微+电话', enabled: true },
  { name: '碳排放强度环比上升', dimension: '碳排放', condition: '环比 > 8%', level: 'warn', levelText: '警告', channel: '站内+企微', enabled: true },
  { name: '绿电占比偏低', dimension: '能耗', condition: '阈值 < 30%', level: 'info', levelText: '提示', channel: '站内消息', enabled: true },
  { name: '项目收益异常', dimension: '项目效益', condition: 'IRR < 8%', level: 'warn', levelText: '警告', channel: '邮件', enabled: false },
]

/* 告警记录 */
export const alertRecords = [
  { time: '2026-08-17 09:24', name: '碳排放强度超额 12%', object: '天津变压器厂', level: 'critical', levelText: '严重', status: '未处理' },
  { time: '2026-08-17 08:51', name: '单位产品能耗超标', object: '衡阳电缆厂', level: 'warn', levelText: '警告', status: '处理中' },
  { time: '2026-08-16 22:10', name: '绿电占比低于阈值', object: '沈阳开关厂', level: 'info', levelText: '提示', status: '已处理' },
  { time: '2026-08-16 18:35', name: '用电量突增 23%', object: '昌吉线缆厂', level: 'warn', levelText: '警告', status: '未处理' },
  { time: '2026-08-16 14:02', name: '关键设备离线', object: '西安互感器厂', level: 'critical', levelText: '严重', status: '已处理' },
]

/* 零碳项目档案 */
export const zeroProjects = [
  { name: '天津园区分布式光伏一期', type: '光伏', park: '天津园区', invest: 2800, reduce: 4200, payback: 6.2, status: '已投运' },
  { name: '衡阳厂区储能调峰项目', type: '储能', park: '衡阳园区', invest: 1600, reduce: 1800, payback: 7.4, status: '建设中' },
  { name: '沈阳绿电替代改造', type: '绿电替代', park: '沈阳园区', invest: 960, reduce: 2600, payback: 5.1, status: '建设中' },
  { name: '昌吉园区余热��收热泵', type: '热泵', park: '昌吉园区', invest: 640, reduce: 1200, payback: 4.8, status: '规划中' },
  { name: '西安屋顶光伏二期', type: '光伏', park: '西安园区', invest: 2100, reduce: 3400, payback: 6.6, status: '已投运' },
]

/* 项目效益趋势 */
export const projectBenefitTrend = [
  { month: '1月', save: 82, reduce: 520 },
  { month: '2月', save: 96, reduce: 610 },
  { month: '3月', save: 118, reduce: 720 },
  { month: '4月', save: 132, reduce: 810 },
  { month: '5月', save: 156, reduce: 920 },
  { month: '6月', save: 178, reduce: 1040 },
]

/* 统计报表列表 */
export const reportList = [
  { name: '2026-07 集团能源用量报表', type: '能源用量报表', period: '2026-07', size: '2.1MB', updated: '2026-08-01' },
  { name: '2026-Q2 能源成本报表', type: '能源成本报表', period: '2026-Q2', size: '1.6MB', updated: '2026-07-05' },
  { name: '2026-07 产品单耗报表', type: '能源单耗报表', period: '2026-07', size: '980KB', updated: '2026-08-02' },
  { name: '2026-H1 碳排放报表', type: '碳排放报表', period: '2026-H1', size: '3.4MB', updated: '2026-07-10' },
]

/* ====== 产品碳足迹集采中心数据 ====== */

/* 订单级碳足迹核算 */
export const orderAccounting = [
  { order: 'DD-2026-08871', product: 'SZ11-1600/10', unit: '天津变压器厂', material: 1180, produce: 520, transport: 142, total: 1842 },
  { order: 'DD-2026-08865', product: 'SZ11-2500/10', unit: '天津变压器厂', material: 1760, produce: 690, transport: 168, total: 2618 },
  { order: 'DD-2026-08840', product: 'YJV-8.7/15', unit: '衡阳电缆厂', material: 840, produce: 260, transport: 96, total: 1196 },
  { order: 'DD-2026-08812', product: 'ZW32-12', unit: '沈阳开关厂', material: 420, produce: 180, transport: 62, total: 662 },
  { order: 'DD-2026-08790', product: 'LGJ-240', unit: '昌吉线缆厂', material: 610, produce: 210, transport: 88, total: 908 },
]

/* 数据链溯源节�� */
export const traceNodes = [
  { stage: '原材料获取（BOM）', value: 1180, detail: '硅钢片 620 · 电解铜 380 · 绝缘材料 180，引用因子库 v3.2' },
  { stage: '原材料运输', value: 142, detail: '公路 320km + 铁路 180km，运输因子集 v2.1' },
  { stage: '生产制造（能耗）', value: 520, detail: '电 3200kWh + 天然气 180m³，绿电抵扣 -86' },
  { stage: '废弃物明细', value: 0, detail: '边角料回收率 96%，核算为 0 净排放' },
]

/* 碳足迹报告 */
export const cfReports = [
  { no: 'CFR-2026-0451', unit: '衡变本部', product: 'SZ11-1600/10', standard: 'ISO 14067', date: '2026-08-12', status: '已生成' },
  { no: 'CFR-2026-0448', unit: '鲁缆本部', product: 'YJV-8.7/15', standard: 'ISO 14067', date: '2026-08-10', status: '已生成' },
  { no: 'CFR-2026-0442', unit: '沈变本部', product: 'ZW32-12', standard: 'ISO 14067', date: '2026-08-06', status: '已生成' },
  { no: 'CFR-2026-0438', unit: '超高压公司', product: 'SFZ11-110', standard: 'ISO 14067', date: '2026-07-22', status: '已生成' },
  { no: 'CFR-2026-0433', unit: '衡变本部', product: 'SFZ11-110', standard: 'ISO 14067', date: '2026-07-15', status: '已生成' },
]

/* CBAM 管控行业分类（钢铁/铝/水泥/化肥/电力/氢） */
export const cbamSectors = ['钢铁', '铝', '水泥', '化肥', '电力', '氢']
/* 生产工艺可选项 */
export const cbamProcesses = ['高炉-转炉（钢铁）', '电弧炉（钢铁）', '电解（铝）', '干法回转窑（水泥）', '合成氨（化肥）', '电解水制氢（氢）', '其他']

/* CBAM 产品映射台账 */
export type CbamProduct = {
  id: string
  name: string
  hs: string
  cn: string
  sector: string
  scope: '管控' | '不管控'
  status: '有效' | '临期' | '已过期'
  exempt: boolean
}
export const cbamProducts: CbamProduct[] = [
  { id: 'P001', name: '电力变压器', hs: '8504.23', cn: '85042300', sector: '钢铁', scope: '管控', status: '有效', exempt: false },
  { id: 'P002', name: '电缆导体', hs: '8544.60', cn: '85446000', sector: '铝', scope: '管控', status: '有效', exempt: false },
  { id: 'P003', name: '钢结构件', hs: '7308.90', cn: '73089000', sector: '钢铁', scope: '管控', status: '临期', exempt: false },
  { id: 'P004', name: '塑料绝缘件', hs: '3926.90', cn: '39269097', sector: '化肥', scope: '不管控', status: '有效', exempt: true },
]

/* CBAM 资质类型 */
export const cbamQualTypes = ['EORI 编号', '进口商授权', '境外工厂注册', '授权申报人', '核查机构认可']
/* CBAM 资质档案 */
export type CbamQual = {
  id: string
  type: string
  code: string
  holder: string
  validFrom: string
  validTo: string
  status: '有效' | '临期' | '已过期'
}
export const cbamQualifications: CbamQual[] = [
  { id: 'Q001', type: 'EORI 编号', code: 'DE123456789012', holder: 'Siemens Energy AG', validFrom: '2024-05-30', validTo: '2027-05-30', status: '有效' },
  { id: 'Q002', type: '进口商授权', code: 'IMP-AUTH-2026-08', holder: 'Nexans France', validFrom: '2025-08-01', validTo: '2026-12-31', status: '临期' },
  { id: 'Q003', type: '境外工厂注册', code: 'REG-CN-TBEA-01', holder: '衡变本部', validFrom: '2025-01-15', validTo: '2028-01-15', status: '有效' },
]

/* CBAM 成本测算多情景 */
export const cbamCostScenarios = [
  { name: '当前实测值', emission: 1842, price: 82, cost: 151.0 },
  { name: '绿电接入 30%', emission: 1520, price: 82, cost: 124.6 },
  { name: '再生铜替代', emission: 1360, price: 82, cost: 111.5 },
  { name: '官方默认值', emission: 2260, price: 82, cost: 185.3 },
]

/* CBAM 官方默认因子库 */
export const cbamDefaults = [
  { sector: '钢铁', product: '热轧钢', factor: 2.1, unit: 'tCO2/t' },
  { sector: '铝', product: '原铝', factor: 8.6, unit: 'tCO2/t' },
  { sector: '水泥', product: '熟料', factor: 0.86, unit: 'tCO2/t' },
  { sector: '电力', product: '电网电力', factor: 0.58, unit: 'tCO2/MWh' },
]

/* 供应商碳绩效 */
export const supplierCarbon = [
  { supplier: '宝武硅钢', material: '硅钢片', factor: 2.05, green: '85%', grade: 'A' },
  { supplier: '江铜集团', material: '电解铜', factor: 3.42, green: '62%', grade: 'B' },
  { supplier: '中铝股份', material: '电工铝', factor: 8.10, green: '48%', grade: 'C' },
  { supplier: '金杯电工', material: '绝缘料', factor: 1.28, green: '71%', grade: 'B' },
]

/* CBAM 贸易主体角色/国家可选项 */
export const cbamTraderRoles = ['进口商', '授权代表', '间接海关代表']
export const cbamCountries = ['德国', '法国', '意大利', '荷兰', '西班牙', '波兰', '比利时']
/* CBAM 贸易主体（欧盟进口商 / 授权代表） */
export type CbamTrader = {
  id: string
  name: string
  country: string
  eori: string
  role: string
  auth: '已授权' | '待授权'
}
export const cbamTraders: CbamTrader[] = [
  { id: 'T001', name: 'Siemens Energy AG', country: '德国', eori: 'DE812305789', role: '进口商', auth: '已授权' },
  { id: 'T002', name: 'Nexans France', country: '法国', eori: 'FR409123556', role: '进口商', auth: '已授权' },
  { id: 'T003', name: 'ABB Italy S.p.A.', country: '意大利', eori: 'IT073920145', role: '授权代表', auth: '待授权' },
]

/* CBAM 临期预警明细：卡片点击后展示 */
export type CbamAlert = {
  id: string
  qualType: string
  code: string
  holder: string
  validTo: string
  daysLeft: number
  level: '高' | '中'
  risk: string
  actions: string[]
}
export const cbamAlerts: CbamAlert[] = [
  {
    id: 'Q002',
    qualType: '进口商授权',
    code: 'IMP-AUTH-2026-08',
    holder: 'Nexans France',
    validTo: '2026-12-31',
    daysLeft: 120,
    level: '高',
    risk: '进口商授权将在 120 天内到期。到期后该进口商无法在欧盟 CBAM 登记处继续提交季度申报，可能导致相关订单清关受阻。',
    actions: [
      '提前 60 天向欧盟主管机关提交授权续期申请',
      '准备最新的进口商 EORI 与授权委托文件',
      '在续期完成前，安排备用授权申报人以避免申报中断',
    ],
  },
  {
    id: 'P003',
    qualType: '产品资质（钢结构件）',
    code: '73089000',
    holder: '衡变本部',
    validTo: '2026-11-15',
    daysLeft: 74,
    level: '中',
    risk: '钢结构件的境外工厂注册即将进入临期状态，若不更新工厂排放数据核查，将影响该产品的实测值申报资格。',
    actions: ['更新工厂年度排放数据并送第三方核查', '重新提交境外工厂注册信息', '临期期间可临时切换为官方默认值申报'],
  },
]

/* CBAM 申报模拟 - 集团工厂场景 */
export const cbamDeclScenarios = [
  {
    factory: '衡变本部',
    product: 'SZ11-2500/10 电力变压器',
    cn: '85042300',
    customer: 'Siemens Energy AG',
    quarter: '2026 Q3',
    emission: 1842,
    dataMode: '实测值',
    readiness: 86,
    status: '待申报',
  },
  {
    factory: '沈变本部',
    product: 'ZW32-12 户外真空断路器',
    cn: '85362000',
    customer: 'ABB Italy S.p.A.',
    quarter: '2026 Q3',
    emission: 2260,
    dataMode: '默认值',
    readiness: 52,
    status: '材料待补',
  },
  {
    factory: '特变山东',
    product: 'YJV-8.7/15 电力电缆',
    cn: '85446000',
    customer: 'Nexans France',
    quarter: '2026 Q3',
    emission: 1520,
    dataMode: '实测值',
    readiness: 100,
    status: '可申报',
  },
]

/* CBAM 申报所需材料清单 */
export const cbamDeclMaterials = [
  { name: '产品碳排放核算报告', desc: '按 CBAM 方法学核算的嵌入式排放（直接+间接）', required: true, status: '已上传' },
  { name: '生产工艺路线说明', desc: '含各工序能源投入与计量边界', required: true, status: '已上传' },
  { name: '电力来源与绿电证书', desc: '市电/绿电构成及 GO 绿证凭证', required: true, status: '待上传' },
  { name: '原材料 BOM 及供应商因子', desc: '前体材料的隐含碳数据', required: true, status: '已上传' },
  { name: '第三方核查声明', desc: '经认可机构核查的排放数据声明', required: false, status: '待上传' },
  { name: '进口商 EORI 与授权文件', desc: '欧盟进口商授权申报人资质', required: true, status: '已上传' },
]

/* CBAM 申报流程步骤 */
export const cbamDeclSteps = [
  { step: 1, name: '确定管控范围', desc: '依据 CN 码判定产品是否纳入 CBAM 管控', done: true },
  { step: 2, name: '核算嵌入式排放', desc: '采集工序能耗与前体材料数据，核算直接与间接排放', done: true },
  { step: 3, name: '准备申报材料', desc: '上传核算报告、绿电证书、BOM、核查声明等材料', done: false },
  { step: 4, name: '进口商登记提交', desc: '经授权进口商在欧盟 CBAM 登记处按季度提交', done: false },
  { step: 5, name: '核查与费用清算', desc: '接受主管机关核查，购买并清算 CBAM 证书', done: false },
]

/* CBAM 知识库文章（支持增删改查 · 富属性 + 附件） */
export const cbamKnowledgeSources = ['欧盟委员会', '海关总署', '生态环境部', '行业协会', '内部整理']
export const cbamKnowledgeLangs = ['中文', '英文', '中英对照']
export type CbamKnowledge = {
  id: string
  title: string
  type: string
  sector: string // 关联行业
  source: string // 来源机构
  docNo: string // 文号/编号
  lang: string
  effectiveDate: string // 生效日期
  updated: string
  tags: string[]
  summary: string
  attachments: { name: string; size: string }[]
}
export const cbamKnowledge: CbamKnowledge[] = [
  {
    id: 'K001',
    title: 'CBAM 法规原文（EU 2023/956）',
    type: '法规',
    sector: '通用',
    source: '欧盟委员会',
    docNo: 'EU 2023/956',
    lang: '中英对照',
    effectiveDate: '2023-05-17',
    updated: '2026-06-01',
    tags: ['过渡期', '申报义务', '管控范围'],
    summary: '欧盟碳边境调节机制正式法规文本，界定管控范围、过渡期与申报义务。',
    attachments: [{ name: 'EU-2023-956-full.pdf', size: '2.4 MB' }],
  },
  {
    id: 'K002',
    title: 'CN 管控清单 2026 版',
    type: '清单',
    sector: '通用',
    source: '欧盟委员会',
    docNo: 'ANNEX I-2026',
    lang: '英文',
    effectiveDate: '2026-01-01',
    updated: '2026-07-15',
    tags: ['CN 编码', '钢铁', '铝', '水泥'],
    summary: '纳入 CBAM 管控的 CN 编码清单，覆盖钢铁、铝、水泥、电力、化肥、氢等。',
    attachments: [{ name: 'CN-list-2026.xlsx', size: '380 KB' }],
  },
  {
    id: 'K003',
    title: '季度申报操作指南',
    type: '指南',
    sector: '通用',
    source: '海关总署',
    docNo: 'GUIDE-2026-03',
    lang: '中文',
    effectiveDate: '2026-08-01',
    updated: '2026-08-01',
    tags: ['季度报告', '提交流程'],
    summary: '过渡期季度报告字段说明、提交流程与常见问题处理。',
    attachments: [],
  },
  {
    id: 'K004',
    title: 'BTI 分类裁定典型案例',
    type: '案例',
    sector: '钢铁',
    source: '行业协会',
    docNo: 'BTI-CASE-08',
    lang: '中文',
    effectiveDate: '2026-05-20',
    updated: '2026-05-20',
    tags: ['归类争议', 'BTI'],
    summary: '约束性关税信息（BTI）在 CN 码归类争议中的裁定参考案例。',
    attachments: [{ name: 'BTI-cases.pdf', size: '1.1 MB' }],
  },
]

/* 第三方认证 - 资料模板 */
export const certMaterials = [
  { name: '产品碳足迹核查数据表', org: 'TÜV 莱茵', version: 'v2.3', updated: '2026-07-10' },
  { name: 'ISO 14067 声明模板', org: 'SGS', version: 'v1.8', updated: '2026-06-22' },
  { name: '生命周期清单（LCI）模板', org: 'BV 必维', version: 'v3.0', updated: '2026-08-01' },
]

/* 第三方认证 - 申请记录 */
export const certApplications = [
  { no: 'CA-2026-118', product: 'SZ11-1600/10', unit: '天津变压器厂', org: 'TÜV 莱茵', status: '审核中', date: '2026-08-05' },
  { no: 'CA-2026-115', product: 'YJV-8.7/15', unit: '衡阳电缆厂', org: 'SGS', status: '已通过', date: '2026-07-28' },
  { no: 'CA-2026-109', product: 'ZW32-12', unit: '沈阳开关厂', org: 'BV 必维', status: '待补件', date: '2026-07-20' },
]

/* 第三方认证 - 结果证书 */
export const certResults = [
  { cert: 'CERT-2026-0091', product: 'YJV-8.7/15', org: 'SGS', validTo: '2029-07-28', status: '有效' },
  { cert: 'CERT-2025-0342', product: 'SZ11-2500/10', org: 'TÜV 莱茵', validTo: '2026-09-15', status: '临期' },
  { cert: 'CERT-2024-0128', product: 'LGJ-240', org: 'BV 必维', validTo: '2026-03-01', status: '已过期' },
]

/* 因子库 - 因子集 */
export const factorSets = [
  { name: '能源碳排因子集', category: '能源', count: 128, version: 'v3.2', status: '已固化', confirmed: true },
  { name: '原材料因子集-变压器产业', category: '原材料', count: 342, version: 'v2.6', status: '已固化', confirmed: true },
  { name: '原材料因子集-线缆产业', category: '原材料', count: 286, version: 'v2.4', status: '已固化', confirmed: true },
  { name: '原材料因子集-其他产业', category: '原材料', count: 198, version: 'v1.9', status: '待确认', confirmed: false },
  { name: '原材料运输因子集', category: '运输', count: 76, version: 'v2.1', status: '已固化', confirmed: true },
]

/* 因子明细 */
export const factorItems = [
  { name: '硅钢片', value: 2.05, unit: 'kgCO2e/kg', source: '实测', version: 'v3.2' },
  { name: '电解铜', value: 3.42, unit: 'kgCO2e/kg', source: '第三方', version: 'v3.2' },
  { name: '电工铝', value: 8.10, unit: 'kgCO2e/kg', source: '第三方', version: 'v2.6' },
  { name: '电网电力（华北）', value: 0.58, unit: 'kgCO2e/kWh', source: '国家标准', version: 'v3.2' },
  { name: '公路运输', value: 0.12, unit: 'kgCO2e/t·km', source: '行业标准', version: 'v2.1' },
]

/* 因子下发日志 */
export const factorDispatch = [
  { unit: '天津变压器厂', set: '原材料因子集-变压器产业', version: 'v2.6', time: '2026-08-15 02:00', result: '成功' },
  { unit: '衡阳电缆厂', set: '原材料因子集-线缆产业', version: 'v2.4', time: '2026-08-15 02:00', result: '成功' },
  { unit: '沈阳开关厂', set: '能源碳排因子集', version: 'v3.2', time: '2026-08-15 02:01', result: '成功' },
  { unit: '昌吉线缆厂', set: '原材料运输因子集', version: 'v2.1', time: '2026-08-15 02:03', result: '失败' },
]

/* ============ 因子库管理（四类因子模块） ============ */

/* 通用来源与版本历史类型 */
export type FactorVersion = { version: string; date: string; note: string; operator: string }
export const factorSourceOptions = ['国家标准', '行业标准', '第三方核证', '供应商实测', '股份下发', 'IPCC 缺省值']

/* 1) 原材料碳排因子 */
export type RawMaterialFactor = {
  id: string
  name: string
  industry: string // 适用产业
  value: number
  unit: string
  source: string
  version: string
  updated: string
  status: '启用' | '停用'
  history: FactorVersion[]
}
export const rawMaterialIndustries = ['变压器产业', '线缆产业', '开关产业', '通用']
export const rawMaterialFactors: RawMaterialFactor[] = [
  { id: 'RM001', name: '取向硅钢片', industry: '变压器产业', value: 2.05, unit: 'kgCO2e/kg', source: '供应商实测', version: 'v3.2', updated: '2026-07-20', status: '启用', history: [
    { version: 'v3.2', date: '2026-07-20', note: '按最新供应商实测数据更新', operator: '张伟' },
    { version: 'v3.1', date: '2026-03-11', note: '并入宝钢新炉次数据', operator: '张伟' },
    { version: 'v3.0', date: '2025-11-02', note: '版本固化', operator: '李静' },
  ] },
  { id: 'RM002', name: '电解铜', industry: '通用', value: 3.42, unit: 'kgCO2e/kg', source: '第三方核证', version: 'v3.2', updated: '2026-07-20', status: '启用', history: [
    { version: 'v3.2', date: '2026-07-20', note: 'SGS 核证数据更新', operator: '张伟' },
    { version: 'v3.0', date: '2025-11-02', note: '版本固化', operator: '李静' },
  ] },
  { id: 'RM003', name: '电工铝（铝锭）', industry: '线缆产业', value: 8.10, unit: 'kgCO2e/kg', source: '行业标准', version: 'v2.6', updated: '2026-05-08', status: '启用', history: [
    { version: 'v2.6', date: '2026-05-08', note: '采用有色金属行业协会均值', operator: '王强' },
  ] },
  { id: 'RM004', name: '环氧树脂', industry: '变压器产业', value: 5.68, unit: 'kgCO2e/kg', source: '供应商实测', version: 'v2.4', updated: '2026-04-15', status: '启用', history: [
    { version: 'v2.4', date: '2026-04-15', note: '新增巴斯夫牌号', operator: '王强' },
  ] },
  { id: 'RM005', name: '交联聚乙烯（XLPE）', industry: '线缆产业', value: 2.31, unit: 'kgCO2e/kg', source: '国家标准', version: 'v2.1', updated: '2026-02-19', status: '停用', history: [
    { version: 'v2.1', date: '2026-02-19', note: '待供应商实测替换', operator: '赵敏' },
  ] },
  { id: 'RM006', name: '绝缘纸板', industry: '通用', value: 1.12, unit: 'kgCO2e/kg', source: 'IPCC 缺省值', version: 'v1.9', updated: '2025-12-30', status: '启用', history: [
    { version: 'v1.9', date: '2025-12-30', note: '初始建库', operator: '李静' },
  ] },
]

/* 2) 电力碳排因子（分区域 + 分电力来源） */
export type PowerFactor = {
  id: string
  region: string // 区域电网
  powerSource: string // 电力来源
  value: number
  unit: string
  source: string
  version: string
  updated: string
  status: '启用' | '停用'
  history: FactorVersion[]
}
export const powerRegions = ['华北区域电网', '华东区域电网', '华中区域电网', '东北区域电网', '西北区域电网', '南方区域电网']
export const powerSources = ['电网平均', '燃煤自备电厂', '光伏发电', '风力发电', '水力发电', '绿电（市场化交易）']
export const powerFactors: PowerFactor[] = [
  { id: 'PW001', region: '华北区域电网', powerSource: '电网平均', value: 0.5703, unit: 'kgCO2e/kWh', source: '国家标准', version: 'v2024.1', updated: '2026-01-01', status: '启用', history: [
    { version: 'v2024.1', date: '2026-01-01', note: '生态环境部 2024 年度电网排放因子', operator: '张伟' },
    { version: 'v2023.1', date: '2025-01-01', note: '2023 年度因子', operator: '张伟' },
  ] },
  { id: 'PW002', region: '华东区域电网', powerSource: '电网平均', value: 0.5257, unit: 'kgCO2e/kWh', source: '国家标准', version: 'v2024.1', updated: '2026-01-01', status: '启用', history: [
    { version: 'v2024.1', date: '2026-01-01', note: '生态环境部 2024 年度电网排放因子', operator: '张伟' },
  ] },
  { id: 'PW003', region: '西北区域电网', powerSource: '电网平均', value: 0.6127, unit: 'kgCO2e/kWh', source: '国家标准', version: 'v2024.1', updated: '2026-01-01', status: '启用', history: [
    { version: 'v2024.1', date: '2026-01-01', note: '生态环境部 2024 年度电网排放因子', operator: '张伟' },
  ] },
  { id: 'PW004', region: '南方区域电网', powerSource: '电网平均', value: 0.5271, unit: 'kgCO2e/kWh', source: '国家标准', version: 'v2024.1', updated: '2026-01-01', status: '启用', history: [
    { version: 'v2024.1', date: '2026-01-01', note: '生态环境部 2024 年度电网排放因子', operator: '张伟' },
  ] },
  { id: 'PW005', region: '华北区域电网', powerSource: '光伏发电', value: 0.0480, unit: 'kgCO2e/kWh', source: '第三方核证', version: 'v1.3', updated: '2026-03-15', status: '启用', history: [
    { version: 'v1.3', date: '2026-03-15', note: '含全生命周期制造分摊', operator: '赵敏' },
  ] },
  { id: 'PW006', region: '华东区域电网', powerSource: '绿电（市场化交易）', value: 0.0000, unit: 'kgCO2e/kWh', source: '第三方核证', version: 'v1.2', updated: '2026-03-15', status: '启用', history: [
    { version: 'v1.2', date: '2026-03-15', note: '绿证核销后零排放核算', operator: '赵敏' },
  ] },
  { id: 'PW007', region: '西北区域电网', powerSource: '风力发电', value: 0.0250, unit: 'kgCO2e/kWh', source: '行业标准', version: 'v1.1', updated: '2026-02-10', status: '启用', history: [
    { version: 'v1.1', date: '2026-02-10', note: '初始建库', operator: '李静' },
  ] },
  { id: 'PW008', region: '华北区域电网', powerSource: '燃煤自备电厂', value: 0.8320, unit: 'kgCO2e/kWh', source: '供应商实测', version: 'v2.0', updated: '2026-04-01', status: '停用', history: [
    { version: 'v2.0', date: '2026-04-01', note: '自备电厂改造后停用', operator: '王强' },
  ] },
]

/* 3) 能源活动碳排因子 */
export type EnergyActivityFactor = {
  id: string
  name: string
  category: string // 能源类别
  value: number
  unit: string
  source: string
  version: string
  updated: string
  status: '启用' | '停用'
  history: FactorVersion[]
}
export const energyActivityCategories = ['化石燃料', '热力/蒸汽', '制冷剂', '其他']
export const energyActivityFactors: EnergyActivityFactor[] = [
  { id: 'EA001', name: '天然气', category: '化石燃料', value: 2.1622, unit: 'kgCO2e/m³', source: 'IPCC 缺省值', version: 'v2023.2', updated: '2025-06-01', status: '启用', history: [
    { version: 'v2023.2', date: '2025-06-01', note: '按低位热值修订', operator: '张伟' },
    { version: 'v2023.1', date: '2025-01-01', note: '初始建库', operator: '李静' },
  ] },
  { id: 'EA002', name: '原煤（烟煤）', category: '化石燃料', value: 1.9003, unit: 'kgCO2e/kg', source: 'IPCC 缺省值', version: 'v2023.2', updated: '2025-06-01', status: '启用', history: [
    { version: 'v2023.2', date: '2025-06-01', note: '按低位热值修订', operator: '张伟' },
  ] },
  { id: 'EA003', name: '柴油', category: '化石燃料', value: 3.0959, unit: 'kgCO2e/kg', source: '国家标准', version: 'v2024.1', updated: '2026-01-01', status: '启用', history: [
    { version: 'v2024.1', date: '2026-01-01', note: '更新至最新国标', operator: '张伟' },
  ] },
  { id: 'EA004', name: '外购蒸汽', category: '热力/蒸汽', value: 0.1100, unit: 'kgCO2e/MJ', source: '股份下发', version: 'v2026.1', updated: '2026-03-01', status: '启用', history: [
    { version: 'v2026.1', date: '2026-03-01', note: '股份公司统一下发', operator: '李静' },
  ] },
  { id: 'EA005', name: 'R134a 制冷剂', category: '制冷剂', value: 1430, unit: 'kgCO2e/kg', source: 'IPCC 缺省值', version: 'v2023.1', updated: '2025-01-01', status: '启用', history: [
    { version: 'v2023.1', date: '2025-01-01', note: 'GWP 值引用 AR5', operator: '赵敏' },
  ] },
  { id: 'EA006', name: '液化石油气（LPG）', category: '化石燃料', value: 3.1013, unit: 'kgCO2e/kg', source: '国家标准', version: 'v2023.1', updated: '2025-01-01', status: '停用', history: [
    { version: 'v2023.1', date: '2025-01-01', note: '初始建库', operator: '李静' },
  ] },
]

/* 4) 折标煤系数库 */
export type CoalCoefFactor = {
  id: string
  name: string
  value: number
  unit: string // 折标煤系数单位
  lowHeat: string // 低位热值
  source: string
  version: string
  updated: string
  status: '启用' | '停用'
  history: FactorVersion[]
}
export const coalCoefFactors: CoalCoefFactor[] = [
  { id: 'CC001', name: '电力', value: 0.1229, unit: 'kgce/kWh', lowHeat: '— (当量值)', source: '国家标准', version: 'GB/T 2589-2020', updated: '2026-01-01', status: '启用', history: [
    { version: 'GB/T 2589-2020', date: '2026-01-01', note: '采用当量热值折算', operator: '张伟' },
  ] },
  { id: 'CC002', name: '天然气', value: 1.2143, unit: 'kgce/m³', lowHeat: '35.588 MJ/m³', source: '国家标准', version: 'GB/T 2589-2020', updated: '2026-01-01', status: '启用', history: [
    { version: 'GB/T 2589-2020', date: '2026-01-01', note: '国标折标系数', operator: '张伟' },
  ] },
  { id: 'CC003', name: '原煤', value: 0.7143, unit: 'kgce/kg', lowHeat: '20.908 MJ/kg', source: '国家标准', version: 'GB/T 2589-2020', updated: '2026-01-01', status: '启用', history: [
    { version: 'GB/T 2589-2020', date: '2026-01-01', note: '国标折标系数', operator: '张伟' },
  ] },
  { id: 'CC004', name: '柴油', value: 1.4571, unit: 'kgce/kg', lowHeat: '42.652 MJ/kg', source: '国家标准', version: 'GB/T 2589-2020', updated: '2026-01-01', status: '启用', history: [
    { version: 'GB/T 2589-2020', date: '2026-01-01', note: '国标折标系数', operator: '张伟' },
  ] },
  { id: 'CC005', name: '汽油', value: 1.4714, unit: 'kgce/kg', lowHeat: '43.070 MJ/kg', source: '国家标准', version: 'GB/T 2589-2020', updated: '2026-01-01', status: '启用', history: [
    { version: 'GB/T 2589-2020', date: '2026-01-01', note: '国标折标系数', operator: '张伟' },
  ] },
  { id: 'CC006', name: '外购蒸汽', value: 0.0341, unit: 'kgce/MJ', lowHeat: '—', source: '行业标准', version: 'v2026.1', updated: '2026-03-01', status: '启用', history: [
    { version: 'v2026.1', date: '2026-03-01', note: '按热当量折算', operator: '李静' },
  ] },
]

/* 数据接口配置 */
export const interfaceConfigs = [
  { name: '股份碳足迹系统', url: 'https://cf.tbea.com/api/v2', auth: 'Token', timeout: 30, retry: 3, status: '在线' },
  { name: '天津变压器厂本地系统', url: 'https://tj.local/cf/api', auth: 'AppKey', timeout: 20, retry: 2, status: '在线' },
  { name: '衡阳电缆厂本地系统', url: 'https://hy.local/cf/api', auth: 'AppKey', timeout: 20, retry: 2, status: '在线' },
  { name: '沈阳开关厂本地系统', url: 'https://sy.local/cf/api', auth: 'Token', timeout: 30, retry: 3, status: '异常' },
]

/* 接口字段映射 */
export const fieldMappings = [
  { source: 'product_cf', target: '产品碳足迹', type: 'number' },
  { source: 'bom_code', target: 'BOM编码', type: 'string' },
  { source: 'energy_kwh', target: '能耗电量', type: 'number' },
  { source: 'order_no', target: '订单号', type: 'string' },
]


/* 24小时负荷与光储曲线 (MW) */
export const hourlyLoadData = [
  { time: '00:00', 总用电负荷: 18.2, 光伏发电: 0, 储能充放: -2.0, 市电购电: 20.2 },
  { time: '02:00', 总用电负荷: 16.5, 光伏发电: 0, 储能充放: -3.5, 市电购电: 20.0 },
  { time: '04:00', 总用电负荷: 17.0, 光伏发电: 0, 储能充放: -3.0, 市电购电: 20.0 },
  { time: '06:00', 总用电负荷: 22.4, 光伏发电: 1.2, 储能充放: 0, 市电购电: 21.2 },
  { time: '08:00', 总用电负荷: 38.6, 光伏发电: 8.5, 储能充放: 4.2, 市电购电: 25.9 },
  { time: '10:00', 总用电负荷: 46.2, 光伏发电: 16.4, 储能充放: 5.0, 市电购电: 24.8 },
  { time: '12:00', 总用电负荷: 42.0, 光伏发电: 18.8, 储能充放: 0, 市电购电: 23.2 },
  { time: '14:00', 总用电负荷: 48.5, 光伏发电: 15.2, 储能充放: 4.8, 市电购电: 28.5 },
  { time: '16:00', 总用电负荷: 44.8, 光伏发电: 9.0, 储能充放: 3.5, 市电购电: 32.3 },
  { time: '18:00', 总用电负荷: 36.2, 光伏发电: 2.0, 储能充放: 5.0, 市电购电: 29.2 },
  { time: '20:00', 总用电负荷: 28.5, 光伏发电: 0, 储能充放: 4.5, 市电购电: 24.0 },
  { time: '22:00', 总用电负荷: 21.0, 光伏发电: 0, 储能充放: 0, 市电购电: 21.0 },
]

/* 尖峰平谷电量与电费分布 */
export const peakValleyData = [
  { name: '尖峰电量', kwh: 142000, ratio: 18.5, cost: 170400, color: '#ef4444' },
  { name: '高峰电量', kwh: 268000, ratio: 35.0, cost: 268000, color: '#f59e0b' },
  { name: '平段电量', kwh: 214000, ratio: 28.0, cost: 149800, color: '#10b981' },
  { name: '低谷电量', kwh: 141000, ratio: 18.5, cost: 49350, color: '#0284c7' },
]

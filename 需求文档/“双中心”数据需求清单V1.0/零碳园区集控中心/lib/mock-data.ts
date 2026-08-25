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
  { name: '张伟', account: 'zhangwei', role: '集团管理员', scope: '集团', status: '启用' },
  { name: '李静', account: 'lijing', role: '园区管理员', scope: '天津园区', status: '启用' },
  { name: '王强', account: 'wangqiang', role: '经营单位', scope: '衡阳电缆厂', status: '启用' },
  { name: '赵敏', account: 'zhaomin', role: '节能专员', scope: '沈阳园区', status: '停用' },
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
  { name: '昌吉园区余热回收热泵', type: '热泵', park: '昌吉园区', invest: 640, reduce: 1200, payback: 4.8, status: '规划中' },
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

/* 数据链溯源节点 */
export const traceNodes = [
  { stage: '原材料获取（BOM）', value: 1180, detail: '硅钢片 620 · 电解铜 380 · 绝缘材料 180，引用因子库 v3.2' },
  { stage: '原材料运输', value: 142, detail: '公路 320km + 铁路 180km，运输因子集 v2.1' },
  { stage: '生产制造（能耗）', value: 520, detail: '电 3200kWh + 天然气 180m³，绿电抵扣 -86' },
  { stage: '废弃物明细', value: 0, detail: '边角料回收率 96%，核算为 0 净排放' },
]

/* 碳足迹报告 */
export const cfReports = [
  { no: 'CFR-2026-0451', product: 'SZ11-1600/10', standard: 'ISO 14067', date: '2026-08-12', status: '已生成' },
  { no: 'CFR-2026-0448', product: 'YJV-8.7/15', standard: 'ISO 14067', date: '2026-08-10', status: '已生成' },
  { no: 'CFR-2026-0442', product: 'ZW32-12', standard: 'ISO 14067', date: '2026-08-06', status: '已生成' },
]

/* CBAM 产品映射台账 */
export const cbamProducts = [
  { name: '电力变压器', hs: '8504.23', cn: '85042300', scope: '管控', status: '有效', exempt: false },
  { name: '电缆导体', hs: '8544.60', cn: '85446000', scope: '管控', status: '有效', exempt: false },
  { name: '钢结构件', hs: '7308.90', cn: '73089000', scope: '管控', status: '临期', exempt: false },
  { name: '塑料绝缘件', hs: '3926.90', cn: '39269097', scope: '不管控', status: '有效', exempt: true },
]

/* CBAM 资质档案 */
export const cbamQualifications = [
  { type: 'EORI 编号', code: 'DE123456789012', validTo: '2027-05-30', status: '有效' },
  { type: '进口商授权', code: 'IMP-AUTH-2026-08', validTo: '2026-12-31', status: '临期' },
  { type: '境外工厂注册', code: 'REG-CN-TBEA-01', validTo: '2028-01-15', status: '有效' },
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

/* CBAM 知识库文章 */
export const cbamKnowledge = [
  { title: 'CBAM 法规原文（EU 2023/956）', type: '法规', updated: '2026-06-01' },
  { title: 'CN 管控清单 2026 版', type: '清单', updated: '2026-07-15' },
  { title: '季度申报操作指南', type: '指南', updated: '2026-08-01' },
  { title: 'BTI 分类裁定典型案例', type: '案例', updated: '2026-05-20' },
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

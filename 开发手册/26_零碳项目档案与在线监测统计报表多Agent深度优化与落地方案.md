# 26. 零碳项目档案与集中监管统计报表多 Agent 深度优化与落地方案

> **版本**：v1.0.1  
> **更新时间**：2026-08-28  
> **责任团队**：多 Agent 联合工程组 (PM + UI/UX + Architect + Frontend + Backend + QA + Security + DevOps)  
> **关联模块**：
> - `集中监管 > 指标管控` (`/zero-carbon/monitor/indicator`)
> - `集中监管 > 在线监测` (`/zero-carbon/monitor/online/microgrid`)
> - `集中监管 > 能源碳排放监测` (`/zero-carbon/monitor/carbon-emission`)
> - `零碳项目评估 > 项目档案管理` (`/zero-carbon/project/archive`)
> - `统计报表` (`/zero-carbon/reports/*`)

---

## 一、 优化背景与核心诉求

根据项目评审与客户最新反馈，系统进行了 6 大维度的深度重构与工业级标准化升级：
1. **指标参数严格对齐**：集团层级管控卡片 10 项参数与二三级卡片参数及顺序 100% 保持完全一致；
2. **在线监测高频台账**：移除原并网点卡片，升级为 15 分钟粒度高频连续采样数据明细台账（含多通道筛选、点位搜索、充放电状态与 Excel 导出）；
3. **能源碳排放监测中部图表**：嵌入全集团近 12 个月碳排放时序折线走势图与 7 大直属制造单位综合用能及碳排对标柱状图；
4. **导航精简**：隐藏左侧导航中的「能源碳排放管理」一级模块，提升菜单结构聚焦度；
5. **项目档案管理重构**：
   - 支持各项目公司在线填报项目基本信息、节能技改、绿电替代、储能配置、投资与容量、关键节点日期、预期减排及收益，并上传相关附件；
   - 移除左侧组织结构树，页面采用 100% 全屏宽幅自适应布局；
   - 移除主表格「附件档案」列，保持表格紧凑清爽；
   - 详情查看弹窗与在线填报向导弹窗升级为 `max-w-5xl` 宽幅 Bento 架构，移除冗余副标题，规范技术类别图标；
6. **统计报表标题统一**：用能报表、成本报表、单耗报表、碳排报表 4 大页面顶部 Header 全线对齐项目统一标准设计规范。

---

## 二、 核心架构设计与领域模型

### 2.1 零碳项目统一档案库数据模型 (Project Archive Domain)

```typescript
export interface ProjectArchiveItem {
  id: string
  code: string                               // 项目统一编码 (PRJ-2026-PV-001)
  name: string                               // 项目全称
  park: string                               // 所属零碳产业园区
  company: string                            // 实施经营单位
  category: '节能技改' | '绿电替代' | '储能配置' | '智慧微网'  // 4 大零碳主类
  subType: string                            // 细分技术路线
  capacity: string                           // 装机容量 (MWp / MWh / t / 台套)
  investment: number                         // 总投资额 (万元)
  fundSource: '自筹资金' | '绿色金融信贷' | 'EMC合同能源管理' | '政府专项绿色补贴'
  leaderName: string                         // 责任人
  leaderPhone: string                        // 联系电话
  milestoneApproval: string                  // 批复立项日期
  milestoneStart: string                     // 现场开工日期
  milestoneGrid: string                      // 并网投运日期
  expectedEnergySaving: string               // 年节电/发电量描述
  annualCarbonSaving: number                 // 年减碳量 (tCO2/年)
  annualRevenue: number                      // 年收益/节费 (万元/年)
  paybackYears: number                       // 静态回收期 (年) = 投资额 / 年收益
  irr: string                                // 预期内部收益率
  status: '规划批复' | '在建施工' | '并网稳定运行' | '维护优化'
  attachments: { name: string; size: string; type: string; uploadTime: string }[]
  remark?: string                            // 技术方案与消纳策略
}
```

---

## 三、 质量保障与测试验收

- **路由构建验证**：全项目 61 个静态路由经 Next.js 生产环境构建编译通过（0 Errors, 0 Warnings）；
- **响应式布局测试**：宽屏与笔记本自适应（100% Full-width），支持局域网设备无缝访问；
- **计算逻辑验证**：投资回收期计算容错防 `NaN` / `Infinity`，多维筛选状态下 4 大 KPI 毫秒级自动聚合更新。

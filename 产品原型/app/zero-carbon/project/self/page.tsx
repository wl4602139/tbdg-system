'use client'

import React, { useState, useMemo } from 'react'
import {
  Award,
  FileText,
  Search,
  Check,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  ShieldCheck,
  Zap,
  Cpu,
  FileCheck,
  ArrowRight,
  Lightbulb,
  CheckSquare,
  BarChart3,
  Calendar,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
// 零碳供应链 6 大降碳措施规范选项
export const SUPPLY_CHAIN_MEASURES_OPTIONS = [
  { id: 'sc-1', title: '1. 健全管理制度', desc: '建立绿色低碳供应链管理制度与供应商低碳准入标准' },
  { id: 'sc-2', title: '2. 碳数据协同', desc: '搭建供应链碳排放数据采集与核算协同机制' },
  { id: 'sc-3', title: '3. 供应商赋能与培育', desc: '定期组织开展供应商碳减排赋能培训与现场低碳诊断' },
  { id: 'sc-4', title: '4. 资源循环利用 (EPR)', desc: '实施原材料包装循环共用及废旧物资/余料回收闭环利用' },
  { id: 'sc-5', title: '5. 信息化与数字化管理', desc: '部署供应链碳足迹与绿色物料全流程信息化追踪系统' },
  { id: 'sc-6', title: '6. 绿色低碳清洁物流', desc: '厂内及主要干线采用新能源/清洁运输车辆比例 ≥ 85%' },
]

// 能碳管理中心 13 项数字化功能模块规范选项
export const CONTROL_CENTER_FEATURE_OPTIONS = [
  { id: 'cc-1', title: '1. 能耗实时查询与监控', desc: '各车间、重点设备电水气热实时能耗曲线监测' },
  { id: 'cc-2', title: '2. 能耗强度与单耗核算', desc: '单位产品能耗及工业增加值能耗动态计算分析' },
  { id: 'cc-3', title: '3. 运行策略与节能推荐', desc: '峰谷电价负荷转移、空压机群控等优化策略' },
  { id: 'cc-4', title: '4. 能源流向与能流图动态展示', desc: '全厂桑基图与拓扑能流动态平衡可视化' },
  { id: 'cc-5', title: '5. 负荷平衡与需量优化', desc: '变压器负荷率优化与需量申报智能预警' },
  { id: 'cc-6', title: '6. 用能预算与超额告警', desc: '按月/年制定能耗预算指标与超限分级告警' },
  { id: 'cc-7', title: '7. 碳排放实时核算与盘查', desc: '范围一、二、三温室气体排放实时电量折标核算' },
  { id: 'cc-8', title: '8. 产品碳足迹生命周期建模', desc: '变压器/线缆主要产品 LCA 碳足迹在线核算' },
  { id: 'cc-9', title: '9. 供应链碳排放协同追踪', desc: '上游重点原材料供应商碳数据报送与碳标签' },
  { id: 'cc-10', title: '10. 碳核查报告与 MRV 归档', desc: '符合 ISO 14064 标准的温室气体清单自动生成' },
  { id: 'cc-11', title: '11. 碳资产管理与配额模拟', desc: '全国碳市场配额盈缺预测与绿证绿电交易管理' },
  { id: 'cc-12', title: '12. 双碳智能辅助决策支持', desc: '零碳工厂达标路径规划与节能降碳技改 ROI 评估' },
  { id: 'cc-13', title: '13. 设备能效在线监测预警', desc: '电机、变压器、空压机实时运行效率偏离预警' },
]

// 碳排放信息披露 5 大载体文件规范选项
export const DISCLOSURE_DOC_OPTIONS = [
  { id: 'doc-1', title: '《企业可持续发展报告》', desc: '定期公开披露碳排放总量、能耗强度与减排行动' },
  { id: 'doc-2', title: '《企业 ESG / 环境社会治理报告》', desc: '公开披露环境、社会与公司治理碳减排绩效与双碳目标' },
  { id: 'doc-3', title: '《零碳工厂建设自评估报告》', desc: '公开披露工厂源头减碳、过程脱碳及零碳工厂建设成效' },
  { id: 'doc-4', title: '《产品碳足迹 (LCA) 公开报告》', desc: '公开主要产品全生命周期碳足迹核算结果与减碳标识' },
  { id: 'doc-5', title: '《第三方碳核查声明与碳抵销报告》', desc: '公开第三方权威机构温室气体核查声明及碳抵销情况' },
]

export interface FactoryEvaluationData {
  id: string
  company: string
  factoryName: string
  carbonClearRate: number
  autoCollectRate: number
  supplyChainMeasuresCount: number
  controlCenterFeaturesCount: number
  disclosureDocsCount: number
  supplyChainMeasures: string[]
  controlCenterFeatures: string[]
  disclosureFiles: string[]
  metrics: {
    '1.1': { name: '非化石电力消费比例'; value: number; unit: '%'; type: 'auto' }
    '1.2': { name: '节能与低碳改造覆盖率'; value: number; unit: '%'; type: 'auto' }
    '1.3': { name: '屋顶及建筑光伏利用率'; value: number; unit: '%'; type: 'auto' }
    '2.1': { name: '电机系统运行能效'; value: string; unit: ''; type: 'auto' }
    '2.2': { name: '空压机站节能评级'; value: string; unit: ''; type: 'auto' }
    '2.3': { name: '碳清除率 (Re)'; value: number; unit: '%'; type: 'declared' }
    '3.1': { name: '绿色电力绿证消纳占比'; value: number; unit: '%'; type: 'auto' }
    '3.2': { name: '零碳供应链管理措施'; value: string; unit: ''; type: 'declared' }
    '4.1': { name: '数据自动采集率 (Ra)'; value: number; unit: '%'; type: 'declared' }
    '4.2': { name: '能碳管理中心功能项数'; value: string; unit: ''; type: 'declared' }
    '5.1': { name: '碳排放信息披露透明度'; value: string; unit: ''; type: 'declared' }
  }
  status: '已自评已申报' | '自评待审核' | '申报中'
  evaluator: string
  declareDate: string
  notes?: string
}

// 6 大经营单位，共 21 家工厂完整数据拓扑
export const ALL_ZERO_CARBON_FACTORIES: FactoryEvaluationData[] = [
  // 1. 沈变公司 (4 家)
  {
    id: 'f-1',
    company: '沈变公司',
    factoryName: '沈变本部（特大特高压变压器厂）',
    carbonClearRate: 8.5,
    autoCollectRate: 98.6,
    supplyChainMeasuresCount: 6,
    controlCenterFeaturesCount: 13,
    disclosureDocsCount: 5,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5', 'sc-6'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12', 'cc-13'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4', 'doc-5'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 39.5, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 92.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 28.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '优于国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 8.5, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 93.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 6/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 98.6, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 13/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 5/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '沈变能碳运营办',
    declareDate: '2026-08-28',
  },
  {
    id: 'f-2',
    company: '沈变公司',
    factoryName: '变压器配件厂',
    carbonClearRate: 7.0,
    autoCollectRate: 97.5,
    supplyChainMeasuresCount: 5,
    controlCenterFeaturesCount: 13,
    disclosureDocsCount: 4,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12', 'cc-13'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 36.2, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 88.5, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 24.5, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '优于国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 7.0, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 90.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 5/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 97.5, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 13/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 4/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '沈变生产保障部',
    declareDate: '2026-08-25',
  },
  {
    id: 'f-3',
    company: '沈变公司',
    factoryName: '特种变压器制造厂',
    carbonClearRate: 7.2,
    autoCollectRate: 97.8,
    supplyChainMeasuresCount: 5,
    controlCenterFeaturesCount: 12,
    disclosureDocsCount: 4,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 37.0, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 89.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 25.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '优于国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 7.2, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 91.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 5/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 97.8, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 12/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 4/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '沈变技术质量部',
    declareDate: '2026-08-24',
  },
  {
    id: 'f-4',
    company: '沈变公司',
    factoryName: '高压套管智能制造分厂',
    carbonClearRate: 6.5,
    autoCollectRate: 96.8,
    supplyChainMeasuresCount: 5,
    controlCenterFeaturesCount: 12,
    disclosureDocsCount: 4,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 35.5, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 86.5, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 23.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 6.5, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 89.5, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 5/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 96.8, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 12/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 4/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '沈变智能设备处',
    declareDate: '2026-08-22',
  },

  // 2. 衡变公司 (4 家)
  {
    id: 'f-5',
    company: '衡变公司',
    factoryName: '衡变本部（特大变压器制造厂）',
    carbonClearRate: 8.0,
    autoCollectRate: 98.0,
    supplyChainMeasuresCount: 6,
    controlCenterFeaturesCount: 13,
    disclosureDocsCount: 5,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5', 'sc-6'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12', 'cc-13'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4', 'doc-5'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 38.0, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 90.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 26.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '优于国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 8.0, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 92.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 6/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 98.0, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 13/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 5/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '衡变双碳管理室',
    declareDate: '2026-08-27',
  },
  {
    id: 'f-6',
    company: '衡变公司',
    factoryName: '干式变压器制造厂',
    carbonClearRate: 7.0,
    autoCollectRate: 97.2,
    supplyChainMeasuresCount: 5,
    controlCenterFeaturesCount: 12,
    disclosureDocsCount: 4,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 36.8, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 88.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 24.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '优于国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 7.0, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 90.5, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 5/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 97.2, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 12/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 4/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '衡变生产部',
    declareDate: '2026-08-25',
  },
  {
    id: 'f-7',
    company: '衡变公司',
    factoryName: '互感器智能制造分厂',
    carbonClearRate: 6.0,
    autoCollectRate: 96.5,
    supplyChainMeasuresCount: 5,
    controlCenterFeaturesCount: 12,
    disclosureDocsCount: 4,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 35.0, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 85.5, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 22.5, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 6.0, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 88.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 5/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 96.5, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 12/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 4/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '衡变安环部',
    declareDate: '2026-08-23',
  },
  {
    id: 'f-8',
    company: '衡变公司',
    factoryName: '工程技术装备制造厂',
    carbonClearRate: 5.5,
    autoCollectRate: 95.8,
    supplyChainMeasuresCount: 4,
    controlCenterFeaturesCount: 11,
    disclosureDocsCount: 3,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 34.2, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 84.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 21.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '二级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 5.5, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 87.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 4/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 95.8, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 11/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 3/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '衡变制造管理处',
    declareDate: '2026-08-20',
  },

  // 3. 新变厂 (3 家)
  {
    id: 'f-9',
    company: '新变厂',
    factoryName: '新变数字化先进制造厂',
    carbonClearRate: 7.5,
    autoCollectRate: 98.2,
    supplyChainMeasuresCount: 5,
    controlCenterFeaturesCount: 13,
    disclosureDocsCount: 4,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12', 'cc-13'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 37.5, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 89.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 25.5, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '优于国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 7.5, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 91.5, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 5/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 98.2, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 13/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 4/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '新变智能制造办',
    declareDate: '2026-08-26',
  },
  {
    id: 'f-10',
    company: '新变厂',
    factoryName: '特种变压器生产分厂',
    carbonClearRate: 6.8,
    autoCollectRate: 97.0,
    supplyChainMeasuresCount: 5,
    controlCenterFeaturesCount: 12,
    disclosureDocsCount: 4,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 36.0, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 87.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 23.5, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 6.8, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 89.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 5/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 97.0, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 12/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 4/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '新变能环处',
    declareDate: '2026-08-24',
  },
  {
    id: 'f-11',
    company: '新变厂',
    factoryName: '高压试验与特种电气基地',
    carbonClearRate: 5.8,
    autoCollectRate: 96.0,
    supplyChainMeasuresCount: 4,
    controlCenterFeaturesCount: 11,
    disclosureDocsCount: 3,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 34.5, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 85.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 22.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '二级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 5.8, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 87.5, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 4/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 96.0, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 11/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 3/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '新变测试试验中心',
    declareDate: '2026-08-21',
  },

  // 4. 鲁缆公司 (4 家)
  {
    id: 'f-12',
    company: '鲁缆公司',
    factoryName: '鲁缆高压交联电缆厂',
    carbonClearRate: 6.5,
    autoCollectRate: 97.0,
    supplyChainMeasuresCount: 5,
    controlCenterFeaturesCount: 12,
    disclosureDocsCount: 4,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 35.0, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 87.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 23.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '优于国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 6.5, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 89.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 5/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 97.0, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 12/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 4/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '鲁缆设备环保处',
    declareDate: '2026-08-24',
  },
  {
    id: 'f-13',
    company: '鲁缆公司',
    factoryName: '轨道交通专用电缆厂',
    carbonClearRate: 6.0,
    autoCollectRate: 96.5,
    supplyChainMeasuresCount: 5,
    controlCenterFeaturesCount: 12,
    disclosureDocsCount: 4,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 34.0, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 86.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 22.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 6.0, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 88.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 5/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 96.5, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 12/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 4/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '鲁缆生产部',
    declareDate: '2026-08-23',
  },
  {
    id: 'f-14',
    company: '鲁缆公司',
    factoryName: '特种导体智能制造厂',
    carbonClearRate: 5.5,
    autoCollectRate: 95.8,
    supplyChainMeasuresCount: 4,
    controlCenterFeaturesCount: 11,
    disclosureDocsCount: 3,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 33.5, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 84.5, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 21.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '二级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 5.5, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 86.5, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 4/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 95.8, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 11/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 3/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '鲁缆精益制造处',
    declareDate: '2026-08-21',
  },
  {
    id: 'f-15',
    company: '鲁缆公司',
    factoryName: '光电复合及海底电缆分厂',
    carbonClearRate: 5.2,
    autoCollectRate: 95.2,
    supplyChainMeasuresCount: 4,
    controlCenterFeaturesCount: 11,
    disclosureDocsCount: 3,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 32.8, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 83.5, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 20.5, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '二级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 5.2, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 85.5, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 4/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 95.2, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 11/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 3/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '鲁缆海缆事业部',
    declareDate: '2026-08-19',
  },

  // 5. 德缆公司 (3 家)
  {
    id: 'f-16',
    company: '德缆公司',
    factoryName: '德缆超高压电缆厂',
    carbonClearRate: 6.0,
    autoCollectRate: 96.5,
    supplyChainMeasuresCount: 5,
    controlCenterFeaturesCount: 12,
    disclosureDocsCount: 4,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 34.0, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 86.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 22.5, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '优于国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 6.0, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 88.5, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 5/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 96.5, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 12/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 4/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '德缆安环处',
    declareDate: '2026-08-23',
  },
  {
    id: 'f-17',
    company: '德缆公司',
    factoryName: '新能源汽车专用线缆厂',
    carbonClearRate: 5.4,
    autoCollectRate: 95.5,
    supplyChainMeasuresCount: 4,
    controlCenterFeaturesCount: 11,
    disclosureDocsCount: 3,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 33.0, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 84.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 21.5, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '二级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 5.4, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 86.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 4/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 95.5, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 11/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 3/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '德缆特缆分厂',
    declareDate: '2026-08-20',
  },
  {
    id: 'f-18',
    company: '德缆公司',
    factoryName: '绿色低碳工业线缆制造厂',
    carbonClearRate: 5.0,
    autoCollectRate: 95.0,
    supplyChainMeasuresCount: 4,
    controlCenterFeaturesCount: 11,
    disclosureDocsCount: 3,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 32.0, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 83.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 20.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '二级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 5.0, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 85.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 4/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 95.0, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 11/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 3/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '德缆动力保障部',
    declareDate: '2026-08-18',
  },

  // 6. 中康公司 (3 家)
  {
    id: 'f-19',
    company: '中康公司',
    factoryName: '中康新能源装备制造基地',
    carbonClearRate: 5.0,
    autoCollectRate: 95.0,
    supplyChainMeasuresCount: 4,
    controlCenterFeaturesCount: 11,
    disclosureDocsCount: 3,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 31.0, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 82.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 20.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '二级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 5.0, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 85.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 4/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 95.0, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 11/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 3/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '中康动力部',
    declareDate: '2026-08-22',
  },
  {
    id: 'f-20',
    company: '中康公司',
    factoryName: '储能系统集成智能制造厂',
    carbonClearRate: 5.6,
    autoCollectRate: 95.8,
    supplyChainMeasuresCount: 4,
    controlCenterFeaturesCount: 12,
    disclosureDocsCount: 3,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10', 'cc-11', 'cc-12'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 32.5, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 83.5, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 21.0, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '一级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 5.6, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 86.5, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 4/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 95.8, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 12/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 3/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '中康储能智造中心',
    declareDate: '2026-08-21',
  },
  {
    id: 'f-21',
    company: '中康公司',
    factoryName: '智慧箱式变电站集成中心',
    carbonClearRate: 4.8,
    autoCollectRate: 94.5,
    supplyChainMeasuresCount: 4,
    controlCenterFeaturesCount: 10,
    disclosureDocsCount: 3,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4'],
    controlCenterFeatures: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5', 'cc-6', 'cc-7', 'cc-8', 'cc-9', 'cc-10'],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3'],
    metrics: {
      '1.1': { name: '非化石电力消费比例', value: 30.5, unit: '%', type: 'auto' },
      '1.2': { name: '节能与低碳改造覆盖率', value: 81.0, unit: '%', type: 'auto' },
      '1.3': { name: '屋顶及建筑光伏利用率', value: 19.5, unit: '%', type: 'auto' },
      '2.1': { name: '电机系统运行能效', value: '达到国标二级', unit: '', type: 'auto' },
      '2.2': { name: '空压机站节能评级', value: '二级能效站房', unit: '', type: 'auto' },
      '2.3': { name: '碳清除率 (Re)', value: 4.8, unit: '%', type: 'declared' },
      '3.1': { name: '绿色电力绿证消纳占比', value: 84.0, unit: '%', type: 'auto' },
      '3.2': { name: '零碳供应链管理措施', value: '已选 4/6 项', unit: '', type: 'declared' },
      '4.1': { name: '数据自动采集率 (Ra)', value: 94.5, unit: '%', type: 'declared' },
      '4.2': { name: '能碳管理中心功能项数', value: '已选 10/13 项', unit: '', type: 'declared' },
      '5.1': { name: '碳排放信息披露透明度', value: '已选 3/5 份', unit: '', type: 'declared' },
    },
    status: '已自评已申报',
    evaluator: '中康集成装备部',
    declareDate: '2026-08-17',
  },
]

export default function ZeroCarbonSelfEvaluationPage() {
  const [factories, setFactories] = useState<FactoryEvaluationData[]>(ALL_ZERO_CARBON_FACTORIES)
  // 三层视图穿透状态：'group' (第1层 集团大盘) | 'company' (第2层 公司视图) | 'factory' (第3层 工厂视图)
  const [viewLevel, setViewLevel] = useState<'group' | 'company' | 'factory'>('group')
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('沈变公司')
  const [selectedFactoryId, setSelectedFactoryId] = useState<FactoryEvaluationData | null>(null)

  // 用户角色视图切换：'group' (集团管理层) | 'unit' (经营单位/基层填报自查)
  const [userRole, setUserRole] = useState<'group' | 'unit'>('group')
  const [selectedCompany, setSelectedCompany] = useState<string>('全部')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [timeDim, setTimeDim] = useState<'day' | 'month' | 'quarter' | 'year'>('month')
  
  // 详情模态框 (面向查验与计算推导)
  const [factoryDetailModal, setFactoryDetailModal] = useState<FactoryEvaluationData | null>(null)
  
  // 填报自查工作台模态框 (面向基层自查填报与短板诊断)
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState<boolean>(false)
  const [declareFactoryTarget, setDeclareFactoryTarget] = useState<FactoryEvaluationData | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [declareForm, setDeclareForm] = useState({
    carbonClearRate: 8.5,
    autoCollectRate: 98.6,
    supplyChainMeasures: ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5', 'sc-6'],
    controlCenterFeatures: [
      'cc-1',
      'cc-2',
      'cc-3',
      'cc-4',
      'cc-5',
      'cc-6',
      'cc-7',
      'cc-8',
      'cc-9',
      'cc-10',
      'cc-11',
      'cc-12',
      'cc-13',
    ],
    disclosureFiles: ['doc-1', 'doc-2', 'doc-3', 'doc-4', 'doc-5'],
    notes: '',
  })

  // 6 大单位及工厂数量统计
  const companiesList = useMemo(() => {
    return [
      { name: '全部', count: factories.length },
      { name: '沈变公司', count: factories.filter((f) => f.company === '沈变公司').length },
      { name: '衡变公司', count: factories.filter((f) => f.company === '衡变公司').length },
      { name: '新变厂', count: factories.filter((f) => f.company === '新变厂').length },
      { name: '鲁缆公司', count: factories.filter((f) => f.company === '鲁缆公司').length },
      { name: '德缆公司', count: factories.filter((f) => f.company === '德缆公司').length },
      { name: '中康公司', count: factories.filter((f) => f.company === '中康公司').length },
    ]
  }, [factories])

  const companyStats = useMemo(() => {
    const companies = ['沈变公司', '衡变公司', '新变厂', '鲁缆公司', '德缆公司', '中康公司'];
    return companies.map(comp => {
      const compFactories = factories.filter(f => f.company === comp);
      const count = compFactories.length;
      if (count === 0) return { name: comp, count: 0, avgGreenPower: 0, avgCarbonClear: 0, avgSupplyChain: 0, avgAutoCollect: 0, avgDisclosure: 0 };
      
      const avgGreenPower = compFactories.reduce((acc, f) => acc + f.metrics['3.1'].value, 0) / count;
      const avgCarbonClear = compFactories.reduce((acc, f) => acc + f.carbonClearRate, 0) / count;
      const avgSupplyChain = compFactories.reduce((acc, f) => acc + f.supplyChainMeasuresCount, 0) / count;
      const avgAutoCollect = compFactories.reduce((acc, f) => acc + f.autoCollectRate, 0) / count;
      const avgDisclosure = compFactories.reduce((acc, f) => acc + f.disclosureDocsCount, 0) / count;

      return {
        name: comp,
        count,
        avgGreenPower: Number(avgGreenPower.toFixed(1)),
        avgCarbonClear: Number(avgCarbonClear.toFixed(1)),
        avgSupplyChain: Number(avgSupplyChain.toFixed(1)),
        avgAutoCollect: Number(avgAutoCollect.toFixed(1)),
        avgDisclosure: Number(avgDisclosure.toFixed(1)),
      }
    });
  }, [factories]);

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // 过滤后的工厂清单
  const filteredFactories = useMemo(() => {
    return factories.filter((f) => {
      const matchComp = selectedCompany === '全部' || f.company === selectedCompany
      const matchSearch =
        !searchQuery ||
        f.factoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.company.toLowerCase().includes(searchQuery.toLowerCase())
      return matchComp && matchSearch
    })
  }, [factories, selectedCompany, searchQuery])

  // 打开填报自查工作台
  const handleOpenDeclare = (factory: FactoryEvaluationData) => {
    setDeclareFactoryTarget(factory)
    setDeclareForm({
      carbonClearRate: factory.carbonClearRate || 8.5,
      autoCollectRate: factory.autoCollectRate || 98.6,
      supplyChainMeasures: factory.supplyChainMeasures || ['sc-1', 'sc-2', 'sc-3', 'sc-4', 'sc-5', 'sc-6'],
      controlCenterFeatures:
        factory.controlCenterFeatures || [
          'cc-1',
          'cc-2',
          'cc-3',
          'cc-4',
          'cc-5',
          'cc-6',
          'cc-7',
          'cc-8',
          'cc-9',
          'cc-10',
          'cc-11',
          'cc-12',
          'cc-13',
        ],
      disclosureFiles: factory.disclosureFiles || ['doc-1', 'doc-2', 'doc-3', 'doc-4', 'doc-5'],
      notes: factory.notes || '',
    })
    setIsDeclareModalOpen(true)
  }

  // 保存填报并更新最新核算值
  const handleSaveDeclare = (e: React.FormEvent) => {
    e.preventDefault()
    if (!declareFactoryTarget) return

    const todayStr = '2026-09-02'

    const updated = factories.map((f) => {
      if (f.id === declareFactoryTarget.id) {
        return {
          ...f,
          carbonClearRate: declareForm.carbonClearRate,
          autoCollectRate: declareForm.autoCollectRate,
          supplyChainMeasuresCount: declareForm.supplyChainMeasures.length,
          controlCenterFeaturesCount: declareForm.controlCenterFeatures.length,
          disclosureDocsCount: declareForm.disclosureFiles.length,
          supplyChainMeasures: declareForm.supplyChainMeasures,
          controlCenterFeatures: declareForm.controlCenterFeatures,
          disclosureFiles: declareForm.disclosureFiles,
          declareDate: todayStr,
          status: '已自评已申报' as const,
          notes: declareForm.notes,
          metrics: {
            ...f.metrics,
            '2.3': { ...f.metrics['2.3'], value: declareForm.carbonClearRate },
            '3.2': {
              ...f.metrics['3.2'],
              value: `已选 ${declareForm.supplyChainMeasures.length}/6 项`,
            },
            '4.1': { ...f.metrics['4.1'], value: declareForm.autoCollectRate },
            '4.2': {
              ...f.metrics['4.2'],
              value: `已选 ${declareForm.controlCenterFeatures.length}/13 项`,
            },
            '5.1': {
              ...f.metrics['5.1'],
              value: `已选 ${declareForm.disclosureFiles.length}/5 份`,
            },
          },
        }
      }
      return f
    })

    setFactories(updated)
    setIsDeclareModalOpen(false)
    setToastMessage(`【${declareFactoryTarget.factoryName}】自评申报参数已更新，已取最新计算值并同步归档！`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // 填报自查诊断短板实时分析 (为基层提供自查自纠赋能)
  const gapsDiagnostic = useMemo(() => {
    if (!declareFactoryTarget) return []
    const gaps: { dim: string; text: string; action: string }[] = []

    if (declareForm.supplyChainMeasures.length < 6) {
      const missing = SUPPLY_CHAIN_MEASURES_OPTIONS.filter((o) => !declareForm.supplyChainMeasures.includes(o.id))
      gaps.push({
        dim: '3 协同降碳',
        text: `供应链管理措施缺 ${6 - declareForm.supplyChainMeasures.length} 项（如：${missing.slice(0, 2).map((m) => m.title).join('、')}）`,
        action: '完善供应商绿色低碳准入机制与数据协同',
      })
    }

    if (declareForm.controlCenterFeatures.length < 13) {
      gaps.push({
        dim: '4 智能控碳',
        text: `能碳管理中心功能上线 ${declareForm.controlCenterFeatures.length}/13 项`,
        action: '补齐产品碳足迹在线核算与需量优化调度模块',
      })
    }

    if (declareForm.autoCollectRate < 98) {
      gaps.push({
        dim: '4 智能控碳',
        text: `重点用能设备数据自动采集率 ${declareForm.autoCollectRate}%（建议提升至 ≥98%）`,
        action: '对未联网的重点电机及空压设备加装智能电表与采集网关',
      })
    }

    if (declareForm.disclosureFiles.length < 5) {
      const missing = DISCLOSURE_DOC_OPTIONS.filter((o) => !declareForm.disclosureFiles.includes(o.id))
      gaps.push({
        dim: '5 碳抵销与披露',
        text: `公开披露载体文件已具备 ${declareForm.disclosureFiles.length}/5 份（尚缺：${missing.slice(0, 1).map((d) => d.title).join('、')}）`,
        action: '完成第三方碳核查声明与产品碳足迹声明发布',
      })
    }

    return gaps
  }, [declareFactoryTarget, declareForm])

  return (
    <div className="space-y-3.5 font-sans text-slate-800 pb-10">
      {/* 消息提示气泡 */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 1. 顶部 Header (主标题 + 时间维度与导出) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
            <Award className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">零碳工厂自评估</h1>
            <p className="text-[11px] text-slate-400">
              依据国家级零碳工厂建设与评估规范，开展集团、经营单位、工厂三级自评估与 5 大维度核算
            </p>
          </div>
        </div>

        {/* 右侧：时间维度与导出 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 维度切换按钮组 */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-sans border border-slate-200">
            {[
              { key: 'day', label: '日' },
              { key: 'month', label: '月度' },
              { key: 'quarter', label: '季度' },
              { key: 'year', label: '年度' },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setTimeDim(p.key as any)}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === p.key
                    ? 'font-bold bg-white text-[#1677ff] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs font-mono">
            <Calendar className="size-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-700 text-xs">2026年01月 至 2026年08月</span>
          </div>

          <button
            type="button"
            onClick={() => alert('已导出零碳工厂评估台账与核算明细报告 (Excel / PDF)！')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="size-3.5 text-slate-500" />
            <span>导出报表</span>
          </button>
        </div>
      </div>



      {/* ========================================================================= */}
      {/* 🔴 第一层：集团 / 管理层级 (Group Level View)                            */}
      {/* ========================================================================= */}
      {viewLevel === 'group' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* 1.1 集团宏观 4 大核心评估指标卡 (标准化 KPI 卡片) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px]">工厂自评覆盖进度</span>
                <CheckSquare className="size-3.5 text-blue-500" />
              </div>
              <div className="text-base font-black font-mono text-slate-800">
                21 / 21 <span className="text-xs font-normal text-emerald-600">(100%)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">集团 6 大经营单位全覆盖</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px]">清洁与绿电消纳均值</span>
                <Zap className="size-3.5 text-emerald-500" />
              </div>
              <div className="text-base font-black font-mono text-slate-800">
                88.6% <span className="text-xs font-normal text-slate-500">(绿电/绿证)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">源头减碳与协同降碳综合</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px]">数据自动采集平均率</span>
                <Cpu className="size-3.5 text-purple-500" />
              </div>
              <div className="text-base font-black font-mono text-slate-800">
                96.5% <span className="text-xs font-normal text-blue-600">(GB 17167)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">重点用能设备自动采集</div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px]">制度与披露文件齐备度</span>
                <FileCheck className="size-3.5 text-amber-500" />
              </div>
              <div className="text-base font-black font-mono text-slate-800">
                91.4% <span className="text-xs font-normal text-emerald-600">(已归档)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">ESG与核查报告发布透明度</div>
            </div>
          </div>

          {/* 1.2 集团对比图表 (标准化图表面板) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800">各经营单位达标工厂数分布</h3>
                </div>
                <span className="text-[11px] text-slate-400">已自评达标工厂</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyStats.filter(c => c.name !== '全部')} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" name="达标工厂数" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-800">各经营单位绿电消纳均值对比 (%)</h3>
                </div>
                <span className="text-[11px] text-slate-400">绿电与绿证消纳占比</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={companyStats.filter(c => c.name !== '全部')} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} domain={[60, 100]} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="avgGreenPower" name="绿电消纳均值" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3.5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 1.3 6大分公司下钻卡片矩阵 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">6 大经营单位总体零碳评估大盘（点击下钻）</h3>
                <p className="text-xs text-slate-500 mt-0.5">点击任意公司卡片即可穿透至第二层查看该公司的总体及关联工厂明细</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                支持三层钻取
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {companiesList.filter(item => item.name !== '全部').map((item) => {
                const stats = companyStats.find(s => s.name === item.name)
                return (
                  <div
                    key={item.name}
                    onClick={() => {
                      setSelectedCompanyId(item.name)
                      setSelectedCompany(item.name)
                      setViewLevel('company')
                    }}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                  >
                    {/* 卡片头部 */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-xs">
                          <Building2 className="size-4.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </h4>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100 font-mono">
                              {item.count} 家工厂
                            </span>
                          </div>
                          <span className="text-[10.5px] text-slate-400 mt-0.5 block">
                            综合达标评估 · 5 大维度考核
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold group-hover:translate-x-0.5 transition-all">
                        <span>下钻分析</span>
                        <ChevronRight className="size-3.5" />
                      </div>
                    </div>

                    {/* 5 大维度关键指标看板 (高辨识度双排卡片设计) */}
                    {stats && (
                      <div className="space-y-1.5">
                        {/* 上排 3 项 */}
                        <div className="grid grid-cols-3 gap-1.5">
                          {/* 1. 源头减碳 */}
                          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-800">1.源头减碳</span>
                              <span className="text-[9px] text-emerald-600 font-medium">绿电消纳</span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-0.5">
                              <span className="text-base font-black font-mono text-emerald-700">{stats.avgGreenPower}</span>
                              <span className="text-[10px] font-bold text-emerald-600">%</span>
                            </div>
                          </div>

                          {/* 2. 过程脱碳 */}
                          <div className="bg-sky-50/70 border border-sky-200/80 rounded-lg p-2 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-sky-800">2.过程脱碳</span>
                              <span className="text-[9px] text-sky-600 font-medium">清除率 Re</span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-0.5">
                              <span className="text-base font-black font-mono text-sky-700">{stats.avgCarbonClear}</span>
                              <span className="text-[10px] font-bold text-sky-600">%</span>
                            </div>
                          </div>

                          {/* 3. 协同降碳 */}
                          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-lg p-2 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-indigo-800">3.协同降碳</span>
                              <span className="text-[9px] text-indigo-600 font-medium">供应链</span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-0.5">
                              <span className="text-base font-black font-mono text-indigo-700">{stats.avgSupplyChain}</span>
                              <span className="text-[10px] font-bold text-indigo-600">/ 6项</span>
                            </div>
                          </div>
                        </div>

                        {/* 下排 2 项 */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {/* 4. 智能控碳 */}
                          <div className="bg-purple-50/70 border border-purple-200/80 rounded-lg p-2 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-purple-800">4.智能控碳</span>
                              <span className="text-[9px] text-purple-600 font-medium">自动采集 Ra</span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-0.5">
                              <span className="text-base font-black font-mono text-purple-700">{stats.avgAutoCollect}</span>
                              <span className="text-[10px] font-bold text-purple-600">%</span>
                            </div>
                          </div>

                          {/* 5. 碳抵销和信息披露 */}
                          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-amber-800">5.抵销与披露</span>
                              <span className="text-[9px] text-amber-600 font-medium">文件报告</span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-0.5">
                              <span className="text-base font-black font-mono text-amber-700">{stats.avgDisclosure}</span>
                              <span className="text-[10px] font-bold text-amber-600">/ 5份</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🟡 第二层：公司 / 经营单位层级 (Company Level View) - 全景对标大盘          */}
      {/* ========================================================================= */}
      {viewLevel === 'company' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* 2.1 分公司总体 Header 与 5 大维度 Bento 看板 */}
          {(() => {
            const stats = companyStats.find(s => s.name === selectedCompanyId)
            const companyFactories = factories.filter(f => f.company === selectedCompanyId)
            return (
              <div className="space-y-3">
                {/* 顶部标题条 */}
                <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                      <Building2 className="size-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-lg font-black text-slate-900">【{selectedCompanyId}】 零碳工厂评估运营中心</h2>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                          经营单位视角
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        下辖 <strong className="text-blue-700 font-mono font-bold">{companyFactories.length}</strong> 家智能制造工厂 · 全面管控源头减碳、过程脱碳与能碳数字化运行
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setViewLevel('group')
                        setSelectedCompany('全部')
                      }}
                      className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <ArrowRight className="size-3.5 rotate-180" />
                      <span>返回集团宏观大盘</span>
                    </button>
                  </div>
                </div>

                {/* 5 大维度宏观 KPI Bento 卡片 */}
                {stats && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* 1. 源头减碳 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <Zap className="size-3.5 text-emerald-600" />
                          1. 源头减碳
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                          绿电消纳
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-emerald-700">{stats.avgGreenPower}</span>
                          <span className="text-xs font-bold text-emerald-600">%</span>
                        </div>
                        <span className="text-[10.5px] text-slate-400 block mt-0.5">清洁与绿电消纳均值</span>
                      </div>
                    </div>

                    {/* 2. 过程脱碳 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-800 flex items-center gap-1">
                          <Sparkles className="size-3.5 text-sky-600" />
                          2. 过程脱碳
                        </span>
                        <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded font-medium">
                          碳清除 Re
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-sky-700">{stats.avgCarbonClear}</span>
                          <span className="text-xs font-bold text-sky-600">%</span>
                        </div>
                        <span className="text-[10.5px] text-slate-400 block mt-0.5">设备能效优良 · 碳清除</span>
                      </div>
                    </div>

                    {/* 3. 协同降碳 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-800 flex items-center gap-1">
                          <Layers className="size-3.5 text-indigo-600" />
                          3. 协同降碳
                        </span>
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">
                          供应链
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-indigo-700">{stats.avgSupplyChain}</span>
                          <span className="text-xs font-bold text-indigo-600">/ 6 项</span>
                        </div>
                        <span className="text-[10.5px] text-slate-400 block mt-0.5">零碳供应链管理措施</span>
                      </div>
                    </div>

                    {/* 4. 智能控碳 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
                          <Cpu className="size-3.5 text-purple-600" />
                          4. 智能控碳
                        </span>
                        <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-medium">
                          自动采集
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-purple-700">{stats.avgAutoCollect}</span>
                          <span className="text-xs font-bold text-purple-600">%</span>
                        </div>
                        <span className="text-[10.5px] text-slate-400 block mt-0.5">GB 17167 重点设备采集</span>
                      </div>
                    </div>

                    {/* 5. 碳抵销和信息披露 */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                          <FileCheck className="size-3.5 text-amber-600" />
                          5. 抵销披露
                        </span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium">
                          报告归档
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-amber-700">{stats.avgDisclosure}</span>
                          <span className="text-xs font-bold text-amber-600">/ 5 份</span>
                        </div>
                        <span className="text-[10.5px] text-slate-400 block mt-0.5">公开披露与核查报告</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* 2.2 下辖工厂 5 维重点参数横向对标对比图表 */}
          {(() => {
            const companyFactories = factories.filter(f => f.company === selectedCompanyId)
            const chartData = companyFactories.map(f => ({
              name: f.factoryName.length > 8 ? f.factoryName.slice(0, 7) + '...' : f.factoryName,
              fullName: f.factoryName,
              greenPower: f.metrics['3.1'].value,
              autoCollect: f.autoCollectRate,
              carbonClear: f.carbonClearRate,
              supplyChain: f.supplyChainMeasuresCount * 16.6,
            }))

            return (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="size-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">【{selectedCompanyId}】 下辖各工厂 5 维重点评估参数横向对标 (%)</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
                      3.1 绿电消纳率
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="size-2.5 rounded-full bg-purple-500 inline-block" />
                      4.1 自动采集率
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="size-2.5 rounded-full bg-sky-500 inline-block" />
                      2.3 碳清除率
                    </span>
                  </div>
                </div>

                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                      <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="greenPower" name="绿电消纳占比 (%)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                      <Bar dataKey="autoCollect" name="自动采集率 (%)" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={28} />
                      <Bar dataKey="carbonClear" name="碳清除率 (%)" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )
          })()}

          {/* 2.3 下辖关联工厂全景矩阵卡片 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="size-4 text-blue-600" />
                【{selectedCompanyId}】 关联工厂评估明细卡片（点击卡片钻取查看工厂 5 维全景）
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                共 {factories.filter(f => f.company === selectedCompanyId).length} 家工厂
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {factories.filter(f => f.company === selectedCompanyId).map((factory) => (
                <div
                  key={factory.id}
                  onClick={() => {
                    setSelectedFactoryId(factory)
                    setViewLevel('factory')
                  }}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  {/* 工厂头部 */}
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {factory.factoryName}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 shrink-0">
                        {factory.status}
                      </span>
                    </div>
                    <span className="text-[10.5px] text-slate-400 block mt-1">
                      申报机构：{factory.evaluator} · {factory.declareDate}
                    </span>
                  </div>

                  {/* 5 维核心指标微缩展示 */}
                  <div className="space-y-1.5 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">1. 源头减碳 (绿电):</span>
                      <span className="font-bold text-emerald-600">{factory.metrics['3.1'].value}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">2. 过程脱碳 (清除):</span>
                      <span className="font-bold text-sky-600">{factory.carbonClearRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">3. 协同降碳 (供应链):</span>
                      <span className="font-bold text-indigo-600">{factory.supplyChainMeasuresCount} / 6项</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">4. 智能控碳 (采集率):</span>
                      <span className="font-bold text-purple-600">{factory.autoCollectRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">5. 披露文件 (齐备):</span>
                      <span className="font-bold text-amber-600">{factory.disclosureDocsCount} / 5份</span>
                    </div>
                  </div>

                  {/* 底部下钻引导与操作入口 */}
                  <div className="flex items-center justify-between text-[11.5px] pt-1.5 border-t border-slate-100">
                    <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      查看 5 维详情
                      <ChevronRight className="size-3.5" />
                    </span>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenDeclare(factory)}
                        className="text-emerald-600 hover:text-emerald-800 font-bold text-[11px] cursor-pointer"
                        title="企业填报"
                      >
                        企业填报
                      </button>
                      <span className="text-slate-200">|</span>
                      <button
                        type="button"
                        onClick={() => setFactoryDetailModal(factory)}
                        className="text-slate-600 hover:text-slate-800 font-bold text-[11px] cursor-pointer"
                        title="自评报告"
                      >
                        自评报告
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🟢 第三层：工厂级视图 (Factory Level View) - 全量展开 · 直观立体大盘          */}
      {/* ========================================================================= */}
      {viewLevel === 'factory' && selectedFactoryId && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* 3.1 工厂全景 Header 卡片 */}
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <Award className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-black text-slate-900">{selectedFactoryId.factoryName}</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    {selectedFactoryId.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>所属经营单位：<strong className="text-slate-800">{selectedFactoryId.company}</strong></span>
                  <span>•</span>
                  <span>评估机构：<strong className="text-slate-800">{selectedFactoryId.evaluator}</strong></span>
                  <span>•</span>
                  <span>申报日期：<strong className="font-mono text-slate-800">{selectedFactoryId.declareDate}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => handleOpenDeclare(selectedFactoryId)}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="size-3.5" />
                <span>企业填报</span>
              </button>
              <button
                type="button"
                onClick={() => setFactoryDetailModal(selectedFactoryId)}
                className="px-3.5 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="size-3.5" />
                <span>自评报告</span>
              </button>
            </div>
          </div>

          {/* 3.2 5大维度全量展开直观大盘 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 维度 1: 源头减碳 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">源头减碳（清洁能源与低碳改造）</h3>
                    <span className="text-[11px] text-slate-400">非化石能源与光伏应用考核</span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  自动核算达标
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-3 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">[1.1] 非化石电力消费</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black font-mono text-slate-900">{selectedFactoryId.metrics['1.1'].value}</span>
                      <span className="text-xs font-bold text-slate-500">%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(selectedFactoryId.metrics['1.1'].value * 2.5, 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-3 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">[1.2] 节能低碳改造率</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black font-mono text-slate-900">{selectedFactoryId.metrics['1.2'].value}</span>
                      <span className="text-xs font-bold text-slate-500">%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedFactoryId.metrics['1.2'].value}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-3 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">[1.3] 光伏利用率</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black font-mono text-slate-900">{selectedFactoryId.metrics['1.3'].value}</span>
                      <span className="text-xs font-bold text-slate-500">%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(selectedFactoryId.metrics['1.3'].value * 3, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 维度 2: 过程脱碳 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">过程脱碳（设备能效与碳清除）</h3>
                    <span className="text-[11px] text-slate-400">重点电机空压机能效与 CCUS 清除</span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold border border-sky-200">
                  能效优良
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-3 flex flex-col justify-between gap-2">
                  <span className="text-xs text-slate-600 font-medium">[2.1] 电机系统能效</span>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{selectedFactoryId.metrics['2.1'].value}</span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">⚡ 达到国家标准</span>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-3 flex flex-col justify-between gap-2">
                  <span className="text-xs text-slate-600 font-medium">[2.2] 空压机节能评级</span>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{selectedFactoryId.metrics['2.2'].value}</span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">⚡ 达到国家标准</span>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-3 flex flex-col justify-between gap-2">
                  <span className="text-xs text-slate-600 font-medium">[2.3] 碳清除率 (Re)</span>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black font-mono text-blue-700">{selectedFactoryId.carbonClearRate}</span>
                      <span className="text-xs font-bold text-slate-500">%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">工程技术碳清除</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 维度 3: 协同降碳 (全量展开展示 6 大措施) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">协同降碳（绿电消纳与零碳供应链）</h3>
                    <span className="text-[11px] text-slate-400">绿电消纳: <strong className="text-emerald-600 font-mono">{selectedFactoryId.metrics['3.1'].value}%</strong> · 措施具备: <strong className="text-indigo-600 font-mono">{selectedFactoryId.supplyChainMeasuresCount}/6 项</strong></span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                  {selectedFactoryId.supplyChainMeasuresCount === 6 ? '全部具备' : '重点覆盖'}
                </span>
              </div>

              {/* 展开的 6 大供应链措施卡片 */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {SUPPLY_CHAIN_MEASURES_OPTIONS.map((m) => {
                  const isChecked = selectedFactoryId.supplyChainMeasures.includes(m.id)
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "p-2.5 rounded-lg border flex items-start gap-2 transition-colors",
                        isChecked ? "bg-emerald-50/60 border-emerald-200 text-slate-900" : "bg-slate-50 border-slate-200 text-slate-400"
                      )}
                    >
                      <CheckCircle2 className={cn("size-4 shrink-0 mt-0.5", isChecked ? "text-emerald-600" : "text-slate-300")} />
                      <div>
                        <span className="font-bold text-xs block">{m.title}</span>
                        <span className="text-[10.5px] text-slate-500 block leading-tight mt-0.5">{m.desc}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 维度 4: 智能控碳 (全量展开展示 13 大功能) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">智能控碳（能碳管理中心与自动采集）</h3>
                    <span className="text-[11px] text-slate-400">自动采集率: <strong className="text-purple-700 font-mono">{selectedFactoryId.autoCollectRate}%</strong> · 数字化功能: <strong className="text-purple-700 font-mono">{selectedFactoryId.controlCenterFeaturesCount}/13 项</strong></span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
                  GB 17167 达标
                </span>
              </div>

              {/* 展开的 13 项数字化功能模块 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                {CONTROL_CENTER_FEATURE_OPTIONS.map((f) => {
                  const isChecked = selectedFactoryId.controlCenterFeatures.includes(f.id)
                  return (
                    <div
                      key={f.id}
                      className={cn(
                        "p-2 rounded-lg border flex items-center gap-1.5 transition-colors",
                        isChecked ? "bg-purple-50/60 border-purple-200 text-purple-950 font-medium" : "bg-slate-50 border-slate-200 text-slate-400"
                      )}
                      title={f.desc}
                    >
                      <CheckCircle2 className={cn("size-3.5 shrink-0", isChecked ? "text-purple-600" : "text-slate-300")} />
                      <span className="text-[11px] truncate">{f.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 维度 5: 碳抵销和信息披露 (全幅展开展示 5 大披露报告载体) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">碳抵销与信息披露（权威报告公开与归档）</h3>
                    <span className="text-[11px] text-slate-400">已归档公开披露报告: <strong className="text-amber-700 font-mono">{selectedFactoryId.disclosureDocsCount} / 5 份</strong></span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  {selectedFactoryId.disclosureDocsCount >= 4 ? '合规完备' : '建议补充'}
                </span>
              </div>

              {/* 展开的 5 大披露文档卡片 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
                {DISCLOSURE_DOC_OPTIONS.map((d) => {
                  const isChecked = selectedFactoryId.disclosureFiles.includes(d.id)
                  return (
                    <div
                      key={d.id}
                      className={cn(
                        "p-3 rounded-lg border flex flex-col justify-between gap-2 transition-colors",
                        isChecked ? "bg-amber-50/50 border-amber-200" : "bg-slate-50 border-slate-200 opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <FileText className={cn("size-4", isChecked ? "text-amber-600" : "text-slate-400")} />
                        <span className={cn(
                          "text-[9.5px] px-1.5 py-0.2 rounded font-bold",
                          isChecked ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        )}>
                          {isChecked ? "已公开披露" : "待归档"}
                        </span>
                      </div>
                      <div>
                        <span className={cn("font-bold text-xs block", isChecked ? "text-slate-900" : "text-slate-500")}>
                          {d.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1 leading-tight">
                          {d.desc}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 📝 填报与自查一体化工作台 (面向基层：自查打勾 + 实时短板诊断) */}
      {isDeclareModalOpen && declareFactoryTarget && (() => {
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-3 sm:p-5 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full p-5 sm:p-6 flex flex-col gap-4 font-sans max-h-[94vh] overflow-hidden">
              {/* 弹窗头部 */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <Edit3 className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        【{declareFactoryTarget.factoryName.split('(')[0].trim()}】自评估填报与短板自查工作台
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        所属：{declareFactoryTarget.company}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      填报动作与自查评估实时联动 · 边勾选自填边掌握整体情况，降低填报门槛
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDeclareModalOpen(false)}
                  className="size-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* 工作台主体：全宽填报与自查表单 */}
              <div className="overflow-y-auto max-h-[calc(94vh-140px)] pr-1 custom-scrollbar">
                <form id="declare-form" onSubmit={handleSaveDeclare} className="flex flex-col gap-4 text-xs">
                  {/* 提示条 */}
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 flex items-start gap-2.5 text-blue-900 text-xs">
                    <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">自评填报说明：</span>
                      <span>
                        当前系统采用“自动采集核算 + 定性指标手动打勾/自填”的务实方案。请核实并更新以下 5 大维度参数，保存后系统将实时刷新最新核算值。
                      </span>
                    </div>
                  </div>

                  {/* 1. 源头减碳 & 2. 过程脱碳 */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-200">
                      <Zap className="size-4 text-emerald-600" />
                      1 源头减碳 与 2 过程脱碳
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px]">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">[1.1] 非化石电力消费比例</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono font-bold text-blue-700 text-sm">
                            {declareFactoryTarget.metrics['1.1'].value}%
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                            ⚡ 系统实时自动核算
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">[1.2] 节能与低碳改造覆盖率</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono font-bold text-blue-700 text-sm">
                            {declareFactoryTarget.metrics['1.2'].value}%
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                            ⚡ 系统实时自动核算
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* [2.3] 碳清除率 (预留扩展字段) */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-blue-600 text-xs">[2.3]</span>
                          <span className="font-bold text-slate-900">碳清除率 (Re)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                            ✍️ 预留扩展字段
                          </span>
                        </div>
                        <span className="text-[10.5px] text-slate-400">CCUS / 工程技术碳清除</span>
                      </div>

                      <div className="flex items-center gap-2.5 pt-1">
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={declareForm.carbonClearRate}
                            onChange={(e) =>
                              setDeclareForm({ ...declareForm, carbonClearRate: parseFloat(e.target.value) || 0 })
                            }
                            className="h-8 w-28 pl-3 pr-7 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">
                            %
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          公式：Re = [Rc / (Cd + Rc)] × 100%（当前阶段作为前瞻性扩展预留，支持企业自填）
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. 协同降碳 -> 零碳供应链管理措施 (6项打勾自评) */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Layers className="size-4 text-emerald-600" />
                        3 协同降碳 · 零碳供应链管理措施（定性指标打勾自评）
                      </h4>
                      <span className="text-[11px] font-bold text-emerald-700">
                        已选 {declareForm.supplyChainMeasures.length} / 6 项
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SUPPLY_CHAIN_MEASURES_OPTIONS.map((m) => {
                        const isChecked = declareForm.supplyChainMeasures.includes(m.id)
                        return (
                          <label
                            key={m.id}
                            className={cn(
                              'flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none',
                              isChecked
                                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDeclareForm({
                                    ...declareForm,
                                    supplyChainMeasures: [...declareForm.supplyChainMeasures, m.id],
                                  })
                                } else {
                                  setDeclareForm({
                                    ...declareForm,
                                    supplyChainMeasures: declareForm.supplyChainMeasures.filter((id) => id !== m.id),
                                  })
                                }
                              }}
                              className="mt-0.5 size-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                            />
                            <div>
                              <span className="text-xs font-bold block">{m.title}</span>
                              <span className="text-[10.5px] text-slate-500 leading-tight block mt-0.5">
                                {m.desc}
                              </span>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* 4. 智能控碳 -> 数据采集率与能碳中心功能 (13项打勾自评) */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Cpu className="size-4 text-emerald-600" />
                        4 智能控碳 · 能碳管理中心功能与自动采集率
                      </h4>
                      <span className="text-[11px] font-bold text-emerald-700">
                        功能项：{declareForm.controlCenterFeatures.length} / 13 项
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-800 shrink-0">[4.1] 重点设备数据自动采集率：</span>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={declareForm.autoCollectRate}
                          onChange={(e) =>
                            setDeclareForm({ ...declareForm, autoCollectRate: parseFloat(e.target.value) || 0 })
                          }
                          className="h-8 w-28 pl-3 pr-7 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                          required
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">
                          %
                        </span>
                      </div>
                      <span className="text-[10.5px] text-slate-500">依据 GB 17167 重点设备在线自动采集比例</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                      {CONTROL_CENTER_FEATURE_OPTIONS.map((f) => {
                        const isChecked = declareForm.controlCenterFeatures.includes(f.id)
                        return (
                          <label
                            key={f.id}
                            className={cn(
                              'flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer select-none text-[11px]',
                              isChecked
                                ? 'bg-blue-50/50 border-blue-200 text-blue-950 font-bold'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDeclareForm({
                                    ...declareForm,
                                    controlCenterFeatures: [...declareForm.controlCenterFeatures, f.id],
                                  })
                                } else {
                                  setDeclareForm({
                                    ...declareForm,
                                    controlCenterFeatures: declareForm.controlCenterFeatures.filter(
                                      (id) => id !== f.id,
                                    ),
                                  })
                                }
                              }}
                              className="size-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                            />
                            <span className="truncate" title={f.desc}>
                              {f.title}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* 5. 碳抵销与披露 (5项文件勾选自评) */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileCheck className="size-4 text-emerald-600" />
                        5 碳抵销与披露 · 碳排放信息披露载体（5 份规范文件勾选）
                      </h4>
                      <span className="text-[11px] font-bold text-emerald-700">
                        已披露 {declareForm.disclosureFiles.length} / 5 份
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {DISCLOSURE_DOC_OPTIONS.map((doc) => {
                        const isChecked = declareForm.disclosureFiles.includes(doc.id)
                        return (
                          <label
                            key={doc.id}
                            className={cn(
                              'flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer select-none',
                              isChecked
                                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setDeclareForm({
                                      ...declareForm,
                                      disclosureFiles: [...declareForm.disclosureFiles, doc.id],
                                    })
                                  } else {
                                    setDeclareForm({
                                      ...declareForm,
                                      disclosureFiles: declareForm.disclosureFiles.filter((id) => id !== doc.id),
                                    })
                                  }
                                }}
                                className="size-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                              />
                              <div>
                                <span className="text-xs font-bold">{doc.title}</span>
                                <span className="text-[10.5px] text-slate-400 ml-2 hidden sm:inline">{doc.desc}</span>
                              </div>
                            </div>
                            <span
                              className={cn(
                                'text-[10px] font-medium px-2 py-0.5 rounded',
                                isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400',
                              )}
                            >
                              {isChecked ? '已公开披露' : '未披露'}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </form>
              </div>

              {/* 底部操作栏 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 shrink-0">
                <span className="text-[11px] text-slate-500">
                  ⚡ 保存后系统将自动重新核算所有指标并更新申报时间为当前最新值
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDeclareModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-colors cursor-pointer text-xs"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    form="declare-form"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 text-xs active:scale-[0.98]"
                  >
                    <Save className="size-4" />
                    <span>保存自评上报并更新最新值</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* 5. 🔍 工厂零碳自评估详情报告 模态框 (面向集团管理方查验与推导溯源) */}
      {factoryDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-6xl w-full p-5 sm:p-6 flex flex-col gap-3 font-sans max-h-[92vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <FileText className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      【{factoryDetailModal.factoryName.split('(')[0].trim()}】零碳工厂自评估完整报告
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      查验归档报告
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    所属单位: {factoryDetailModal.company} · 最新申报时间: {factoryDetailModal.declareDate} · 评定填报: {factoryDetailModal.evaluator}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFactoryDetailModal(null)}
                className="size-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-y-auto max-h-[calc(92vh-130px)] shadow-2xs custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur-xs shadow-2xs">
                  <tr className="text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3 w-[110px] min-w-[110px] text-center border-r border-slate-200 whitespace-nowrap">
                      维度类别
                    </th>
                    <th className="py-2.5 px-3.5 w-[180px] min-w-[170px] border-r border-slate-100 whitespace-nowrap">
                      指标代码与名称
                    </th>
                    <th className="py-2.5 px-3 w-[100px] min-w-[90px] text-center border-r border-slate-100 whitespace-nowrap">
                      取值方式
                    </th>
                    <th className="py-2.5 px-3.5 min-w-[360px] border-r border-slate-100">
                      自评取值 / 实际核验状态
                    </th>
                    <th className="py-2.5 px-3.5 min-w-[240px]">核算公式与数学模型</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-[11.5px]">
                  {/* 1 源头减碳 (3项) */}
                  <tr>
                    <td
                      rowSpan={3}
                      className="py-3 px-3 text-center font-bold text-slate-900 bg-slate-50/70 border-r border-slate-200 align-middle whitespace-nowrap"
                    >
                      1 源头减碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[1.1] 非化石电力消费比例</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-700 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-blue-700 text-xs">
                          {factoryDetailModal.metrics['1.1'].value}%
                        </span>
                        <div className="text-[10.5px] text-slate-600 bg-slate-50/90 p-1.5 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                          <div>
                            <span className="text-slate-400 font-medium">计算参数：</span>
                            <span className="font-mono">Ee(绿电消纳) = {(factoryDetailModal.metrics['1.1'].value * 128).toFixed(1)} 万kWh</span>，
                            <span className="font-mono">Et(总用电) = 1,280.0 万kWh</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">计算过程：</span>
                            <span className="font-mono">({(factoryDetailModal.metrics['1.1'].value * 128).toFixed(1)} ÷ 1,280.0) × 100% = </span>
                            <span className="font-mono font-bold text-blue-700">{factoryDetailModal.metrics['1.1'].value}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      Re = (Ee / Et) × 100% (屋顶分布式光伏+采购绿电)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[1.2] 节能与低碳改造覆盖率</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-700 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-blue-700 text-xs">
                          {factoryDetailModal.metrics['1.2'].value}%
                        </span>
                        <div className="text-[10.5px] text-slate-600 bg-slate-50/90 p-1.5 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                          <div>
                            <span className="text-slate-400 font-medium">计算参数：</span>
                            <span className="font-mono">Ar(已改造工序及设备) = {Math.round(factoryDetailModal.metrics['1.2'].value * 0.6)} 台套</span>，
                            <span className="font-mono">At(重点设备总数) = 60 台套</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">计算过程：</span>
                            <span className="font-mono">({Math.round(factoryDetailModal.metrics['1.2'].value * 0.6)} ÷ 60) × 100% = </span>
                            <span className="font-mono font-bold text-blue-700">{factoryDetailModal.metrics['1.2'].value}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      Rr = (Ar / At) × 100% (主要生产工序及重点设备节能改造)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[1.3] 屋顶及建筑光伏利用率</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-700 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-blue-700 text-xs">
                          {factoryDetailModal.metrics['1.3'].value}%
                        </span>
                        <div className="text-[10.5px] text-slate-600 bg-slate-50/90 p-1.5 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                          <div>
                            <span className="text-slate-400 font-medium">计算参数：</span>
                            <span className="font-mono">Ap(光伏铺设面积) = {(factoryDetailModal.metrics['1.3'].value * 480).toFixed(0)} m²</span>，
                            <span className="font-mono">Ab(适宜屋顶总面积) = 48,000 m²</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">计算过程：</span>
                            <span className="font-mono">({(factoryDetailModal.metrics['1.3'].value * 480).toFixed(0)} ÷ 48,000) × 100% = </span>
                            <span className="font-mono font-bold text-blue-700">{factoryDetailModal.metrics['1.3'].value}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      Rp = (Ap / Ab) × 100% (厂区适宜屋顶光伏铺设比例)
                    </td>
                  </tr>

                  {/* 2 过程脱碳 (3项) */}
                  <tr>
                    <td
                      rowSpan={3}
                      className="py-3 px-3 text-center font-bold text-slate-900 bg-slate-50/70 border-r border-slate-200 align-middle whitespace-nowrap"
                    >
                      2 过程脱碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[2.1] 电机系统运行能效</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-700 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-800 text-xs">
                          {factoryDetailModal.metrics['2.1'].value}
                        </span>
                        <div className="text-[10.5px] text-slate-600 bg-slate-50/90 p-1.5 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                          <div>
                            <span className="text-slate-400 font-medium">核验参数：</span>
                            <span className="font-mono">加权综合运行效率 η = 94.8%</span>，
                            <span className="font-mono">一级能效电机占比 = 85.6%</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">判定结论：</span>
                            <span className="font-medium text-emerald-700">达到并优于 GB 18613—2020 二级能效基准</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      依据 GB 18613—2020 电动机能效标准评定
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[2.2] 空压机站节能评级</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-700 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-800 text-xs">
                          {factoryDetailModal.metrics['2.2'].value}
                        </span>
                        <div className="text-[10.5px] text-slate-600 bg-slate-50/90 p-1.5 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                          <div>
                            <span className="text-slate-400 font-medium">核验参数：</span>
                            <span className="font-mono">站房输功效率 η = 86.4%</span>，
                            <span className="font-mono">比功率 = 5.62 kW/(m³/min)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">评定等级：</span>
                            <span className="font-medium text-emerald-700">符合 GB 19153 一级能效站房评定要求</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      依据 GB 19153—2019 容积式空气压缩机能效限定值
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[2.3] 碳清除率 (Re)</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-amber-700 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-blue-700 text-xs">
                          {factoryDetailModal.carbonClearRate}%
                        </span>
                        <div className="text-[10.5px] text-slate-600 bg-slate-50/90 p-1.5 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                          <div>
                            <span className="text-slate-400 font-medium">计算参数：</span>
                            <span className="font-mono">Rc(工程清除量) = {(factoryDetailModal.carbonClearRate * 120).toFixed(0)} tCO₂e</span>，
                            <span className="font-mono">Cd(直接排放量) = {(12000 - factoryDetailModal.carbonClearRate * 120).toFixed(0)} tCO₂e</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">计算过程：</span>
                            <span className="font-mono">[{(factoryDetailModal.carbonClearRate * 120).toFixed(0)} ÷ ({(12000 - factoryDetailModal.carbonClearRate * 120).toFixed(0)} + {(factoryDetailModal.carbonClearRate * 120).toFixed(0)})] × 100% = </span>
                            <span className="font-mono font-bold text-blue-700">{factoryDetailModal.carbonClearRate}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      Re = [Rc / (Cd + Rc)] × 100% (CCUS/工程清除)
                    </td>
                  </tr>

                  {/* 3 协同降碳 (2项) */}
                  <tr>
                    <td
                      rowSpan={2}
                      className="py-3 px-3 text-center font-bold text-slate-900 bg-slate-50/70 border-r border-slate-200 align-middle whitespace-nowrap"
                    >
                      3 协同降碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">
                      [3.1] 绿色电力绿证消纳占比
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-emerald-700 font-semibold">
                      ⚡ 系统自动
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-blue-700 text-xs">
                          {factoryDetailModal.metrics['3.1'].value}%
                        </span>
                        <div className="text-[10.5px] text-slate-600 bg-slate-50/90 p-1.5 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                          <div>
                            <span className="text-slate-400 font-medium">计算参数：</span>
                            <span className="font-mono">Eg(绿电绿证消纳量) = {(factoryDetailModal.metrics['3.1'].value * 128).toFixed(1)} 万kWh</span>，
                            <span className="font-mono">Etotal(总用电) = 1,280.0 万kWh</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">计算过程：</span>
                            <span className="font-mono">({(factoryDetailModal.metrics['3.1'].value * 128).toFixed(1)} ÷ 1,280.0) × 100% = </span>
                            <span className="font-mono font-bold text-blue-700">{factoryDetailModal.metrics['3.1'].value}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">Rg = (Eg / Etotal) × 100%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[3.2] 零碳供应链管理措施</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-amber-700 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                        {factoryDetailModal.supplyChainMeasures.map((id) => {
                          const item = SUPPLY_CHAIN_MEASURES_OPTIONS.find((o) => o.id === id)
                          return item ? (
                            <span
                              key={id}
                              className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium truncate"
                              title={item.title}
                            >
                              ✓ {item.title}
                            </span>
                          ) : null
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      依据 6 大供应链降碳制度核验符合项数 (已选 {factoryDetailModal.supplyChainMeasures.length}/6 项)
                    </td>
                  </tr>

                  {/* 4 智能控碳 (2项) */}
                  <tr>
                    <td
                      rowSpan={2}
                      className="py-3 px-3 text-center font-bold text-slate-900 bg-slate-50/70 border-r border-slate-200 align-middle whitespace-nowrap"
                    >
                      4 智能控碳
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[4.1] 数据自动采集率 (Ra)</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-amber-700 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-blue-700 text-xs">
                          {factoryDetailModal.autoCollectRate}%
                        </span>
                        <div className="text-[10.5px] text-slate-600 bg-slate-50/90 p-1.5 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                          <div>
                            <span className="text-slate-400 font-medium">计算参数：</span>
                            <span className="font-mono">Da(有效自动采集测点) = {Math.round(factoryDetailModal.autoCollectRate * 2.14)} 个</span>，
                            <span className="font-mono">Dt(应装表重点测点) = 214 个</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">计算过程：</span>
                            <span className="font-mono">({Math.round(factoryDetailModal.autoCollectRate * 2.14)} ÷ 214) × 100% = </span>
                            <span className="font-mono font-bold text-blue-700">{factoryDetailModal.autoCollectRate}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      Ra = (Da / Dt) × 100% (GB 17167—2025 重点设备采集)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[4.2] 能碳管理中心功能项数</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-amber-700 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-[10.5px]">
                        {factoryDetailModal.controlCenterFeatures.map((id) => {
                          const item = CONTROL_CENTER_FEATURE_OPTIONS.find((o) => o.id === id)
                          return item ? (
                            <span
                              key={id}
                              className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium truncate"
                              title={item.title}
                            >
                              ✓ {item.title}
                            </span>
                          ) : null
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      对照数字化能碳平台 13 项功能核查 (已选 {factoryDetailModal.controlCenterFeatures.length}/13 项)
                    </td>
                  </tr>

                  {/* 5 碳抵销与披露 (1项) */}
                  <tr>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 bg-slate-50/70 border-r border-slate-200 align-middle whitespace-nowrap">
                      5 碳抵销与披露
                    </td>
                    <td className="py-2.5 px-3.5 font-medium border-r border-slate-100">[5.1] 碳排放信息披露透明度</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-100 whitespace-nowrap text-amber-700 font-semibold">
                      ✍️ 企业申报
                    </td>
                    <td className="py-2.5 px-3.5 border-r border-slate-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10.5px]">
                        {factoryDetailModal.disclosureFiles.map((id) => {
                          const item = DISCLOSURE_DOC_OPTIONS.find((o) => o.id === id)
                          return item ? (
                            <span
                              key={id}
                              className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium truncate"
                              title={item.title}
                            >
                              ✓ {item.title}
                            </span>
                          ) : null
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px] text-slate-500">
                      公开披露载体文件勾选数 (已选 {factoryDetailModal.disclosureFiles.length}/5 份)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setFactoryDetailModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer text-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

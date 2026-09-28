'use client'

import React, { useState, useMemo } from 'react'
import {
  Cpu,
  Zap,
  Flame,
  Droplets,
  Wind,
  ChevronRight,
  ChevronDown,
  Building2,
  Calendar,
  Download,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  PieChart as PieIcon,
  BarChart3,
  Layers,
  Info,
  Activity,
  Factory,
  Search,
  X,
} from 'lucide-react'
import { LineTrend, BarChartGroup, Donut, AreaTrend } from '@/components/shared/charts'
import { OnlineHeader } from '@/components/shared/online-header'
import { ENTERPRISE_TREE_DATA, PARK_ORG_TREE_DATA } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

export type DeviceType = '电力设备' | '热力设备'

export interface KeyEquipmentInfo {
  deviceType: DeviceType
  id: string
  name: string
  code: string
  company: string      // 2级 经营单位
  enterprise: string   // 3级 企业级单位 (严格与 ENTERPRISE_TREE_DATA 对齐)
  location: string     // 车间/工段
  status: '运行中' | '待机' | '检修'
  powerKW: number
  energyKWh: number
  mediumTag: string
  todayEnergyKWh?: number // 当日用电量 (kWh)
  loadRate?: number       // 负荷率 (%)
  powerFactor?: number    // 功率因数 cosφ
  steamFlowT?: number     // 瞬时蒸汽流量 (t/h)
  steamUsageT?: number    // 蒸汽消耗量 (当月累计 t)
  todaySteamT?: number    // 当日累计蒸汽消耗量 (t)
  waterFlowM3?: number    // 瞬时水流量 (m³/h)
  waterUsageM3?: number   // 当月用水量 (m³)
  gasFlowM3?: number      // 瞬时天然气流量 (m³/h)
  gasUsageM3?: number     // 当月天然气量 (m³)
  pressureMpa?: number
  temperatureC?: number
  powerYoy?: string
  energyYoy?: string
  flowYoy?: string
  steamUsageYoy?: string
  pressureYoy?: string
  loadMom?: string
}

export const KEY_EQUIPMENT_LIST: KeyEquipmentInfo[] = [
  // -------------------------------------------------------------
  // 1. 沈变公司
  // -------------------------------------------------------------
  {
    id: 'eq-dry-01',
    deviceType: '热力设备',
    name: '1# 1000kV级气相白真空干燥罐组',
    code: 'EQ-SB-DRY-01',
    company: '沈变公司',
    enterprise: '沈变本部',
    location: '特高压一车间',
    status: '运行中',
    powerKW: 4680,
    energyKWh: 112340,
    mediumTag: '电·汽',
    steamFlowT: 1.85,
    pressureMpa: 0.005,
    temperatureC: 135.2,
    steamUsageT: 48.5,
    todaySteamT: 2.1,
    todayEnergyKWh: 3820,
    loadRate: 82.5,
    powerFactor: 0.96,
    powerYoy: '-4.2% ↓',
    energyYoy: '-3.8% ↓',
    flowYoy: '-5.1% ↓',
    pressureYoy: '+0.2% ↑',
  },
  {
    id: 'eq-dry-02',
    deviceType: '热力设备',
    name: '2# 特高压变压器煤油汽相干燥罐',
    code: 'EQ-SB-DRY-02',
    company: '沈变公司',
    enterprise: '沈变本部',
    location: '特高压二车间',
    status: '运行中',
    powerKW: 3950,
    energyKWh: 94800,
    mediumTag: '电·汽',
    steamFlowT: 1.62,
    pressureMpa: 0.006,
    temperatureC: 132.8,
    steamUsageT: 42.8,
    todaySteamT: 1.8,
    todayEnergyKWh: 3240,
    loadRate: 80.2,
    powerFactor: 0.95,
    powerYoy: '-3.5% ↓',
    energyYoy: '-4.1% ↓',
    flowYoy: '-2.8% ↓',
    pressureYoy: '+0.1% ↑',
  },
  {
    id: 'eq-sb-tst-01',
    deviceType: '电力设备',
    name: '1# 1000kV特高压工频耐压试验机组',
    code: 'EQ-SB-TST-01',
    company: '沈变公司',
    enterprise: '沈变本部',
    location: '特高压试验大厅',
    status: '运行中',
    powerKW: 2850,
    energyKWh: 68400,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 25.0,
    powerYoy: '-2.8% ↓',
    energyYoy: '-3.2% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-sb-ac-01',
    deviceType: '电力设备',
    name: '1# 洁净装配跨恒温恒湿精密空调机组',
    code: 'EQ-SB-AC-01',
    company: '沈变公司',
    enterprise: '沈变本部',
    location: '特高压一车间 (恒温洁净区)',
    status: '运行中',
    powerKW: 820,
    energyKWh: 19680,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 20.0,
    todayEnergyKWh: 650,
    loadRate: 76.5,
    powerFactor: 0.95,
    powerYoy: '-2.8% ↓',
    energyYoy: '-3.2% ↓',
    loadMom: '+0.4% ↑',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-ln-cryo-01',
    deviceType: '电力设备',
    name: '1# 液氮深冷装配与惰化循环机组',
    code: 'EQ-LN-CRYO-01',
    company: '沈变公司',
    enterprise: '露娜公司 (特变电工露娜智能)',
    location: '智能制造中心',
    status: '运行中',
    powerKW: 1420,
    energyKWh: 34080,
    mediumTag: '电·水',
    pressureMpa: 0.45,
    temperatureC: -196.0,
    todayEnergyKWh: 1156,
    loadRate: 82.5,
    powerFactor: 0.96,
    powerYoy: '-5.1% ↓',
    energyYoy: '-4.6% ↓',
    loadMom: '+1.8% ↑',
    flowYoy: '—',
    pressureYoy: '-0.1% ↓',
  },
  {
    id: 'eq-sb-ems-01',
    deviceType: '电力设备',
    name: '1# 厂区光储充微电网并网变流机组',
    code: 'EQ-SB-EMS-01',
    company: '沈变公司',
    enterprise: '智慧能源',
    location: '智慧能源调度站',
    status: '运行中',
    powerKW: 1650,
    energyKWh: 39600,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 38.0,
    powerYoy: '-3.6% ↓',
    energyYoy: '-3.4% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-hx-furn-01',
    deviceType: '热力设备',
    name: '1# 800kV特高压干式电容套管固化炉',
    code: 'EQ-HX-FURN-01',
    company: '沈变公司',
    enterprise: '和新套管',
    location: '套管生产车间',
    status: '运行中',
    powerKW: 1850,
    energyKWh: 44400,
    mediumTag: '电·汽',
    steamFlowT: 0.95,
    pressureMpa: 0.35,
    temperatureC: 160.0,
    powerYoy: '-3.8% ↓',
    energyYoy: '-4.0% ↓',
    flowYoy: '-3.1% ↓',
    pressureYoy: '+0.1% ↑',
  },
  {
    id: 'eq-kj-vac-01',
    deviceType: '电力设备',
    name: '1# 500kV互感器绝缘注油真空机组',
    code: 'EQ-KJ-VAC-01',
    company: '沈变公司',
    enterprise: '康嘉互感器',
    location: '互感器总装车间',
    status: '运行中',
    powerKW: 1120,
    energyKWh: 26880,
    mediumTag: '电·油',
    pressureMpa: 0.003,
    temperatureC: 60.0,
    powerYoy: '-4.5% ↓',
    energyYoy: '-4.1% ↓',
    flowYoy: '—',
    pressureYoy: '-0.2% ↓',
  },
  {
    id: 'eq-yn-prs-01',
    deviceType: '热力设备',
    name: '1# 变压器绝缘纸板热压整形生产线',
    code: 'EQ-YN-PRS-01',
    company: '沈变公司',
    enterprise: '印能公司',
    location: '绝缘加工车间',
    status: '运行中',
    powerKW: 980,
    energyKWh: 23520,
    mediumTag: '电·汽',
    steamFlowT: 0.65,
    pressureMpa: 0.80,
    temperatureC: 145.0,
    powerYoy: '-3.2% ↓',
    energyYoy: '-3.0% ↓',
    flowYoy: '-2.5% ↓',
    pressureYoy: '—',
  },

  // -------------------------------------------------------------
  // 2. 衡变公司
  // -------------------------------------------------------------
  {
    id: 'eq-hb-rec-01',
    deviceType: '热力设备',
    name: '6# 煤油喷淋回收及热循环系统',
    code: 'EQ-HB-REC-01',
    company: '衡变公司',
    enterprise: '衡变本部',
    location: '干燥辅助站房',
    status: '运行中',
    powerKW: 1050,
    energyKWh: 25200,
    mediumTag: '电·汽',
    steamFlowT: 1.25,
    steamUsageT: 32.5,
    todaySteamT: 1.4,
    gasFlowM3: 45.2,
    pressureMpa: 0.42,
    temperatureC: 85.0,
    powerYoy: '-6.4% ↓',
    energyYoy: '-5.9% ↓',
    flowYoy: '-4.8% ↓',
    pressureYoy: '+0.1% ↑',
  },
  {
    id: 'eq-hb-main-01',
    deviceType: '热力设备',
    name: '1# 750kV大型发电机主变压罐装线',
    code: 'EQ-HB-MAIN-01',
    company: '衡变公司',
    enterprise: '衡变本部',
    location: '总装一车间',
    status: '运行中',
    powerKW: 3600,
    energyKWh: 86400,
    mediumTag: '电·汽',
    steamFlowT: 1.55,
    pressureMpa: 0.008,
    temperatureC: 128.0,
    powerYoy: '-3.9% ↓',
    energyYoy: '-3.5% ↓',
    flowYoy: '-2.5% ↓',
    pressureYoy: '+0.1% ↑',
  },
  {
    id: 'eq-hb-ac-01',
    deviceType: '电力设备',
    name: '1# 特高压线圈车间集中中央空调机组',
    code: 'EQ-HB-AC-01',
    company: '衡变公司',
    enterprise: '衡变本部',
    location: '特高压制造中心 (线圈恒温区)',
    status: '运行中',
    powerKW: 750,
    energyKWh: 18000,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 21.5,
    todayEnergyKWh: 590,
    loadRate: 74.2,
    powerFactor: 0.94,
    powerYoy: '-3.1% ↓',
    energyYoy: '-2.6% ↓',
    loadMom: '-0.2% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-nj-test-01',
    deviceType: '电力设备',
    name: '1# 继电保护与智能控制综测平台',
    code: 'EQ-NJ-TEST-01',
    company: '衡变公司',
    enterprise: '南京公司',
    location: '电研综测车间',
    status: '运行中',
    powerKW: 680,
    energyKWh: 16320,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 24.0,
    powerYoy: '-3.0% ↓',
    energyYoy: '-2.8% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-yj-gis-01',
    deviceType: '电力设备',
    name: '1# 220kV GIS断路器自动化装配检测线',
    code: 'EQ-YJ-GIS-01',
    company: '衡变公司',
    enterprise: '云集电气',
    location: 'GIS总装车间',
    status: '运行中',
    powerKW: 1560,
    energyKWh: 37440,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 25.5,
    powerYoy: '-4.1% ↓',
    energyYoy: '-3.7% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-hn-robot-01',
    deviceType: '电力设备',
    name: '1# 220kV箱变自动焊接机器人工作站',
    code: 'EQ-HN-ROBOT-01',
    company: '衡变公司',
    enterprise: '湖南电气',
    location: '箱变智造车间',
    status: '运行中',
    powerKW: 980,
    energyKWh: 23520,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 32.0,
    powerYoy: '-4.8% ↓',
    energyYoy: '-4.2% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-yj-sw-01',
    deviceType: '电力设备',
    name: '1# 500kV隔离开关触头精密加工机组',
    code: 'EQ-YJ-SW-01',
    company: '衡变公司',
    enterprise: '云集高压开关',
    location: '精密数控车间',
    status: '运行中',
    powerKW: 850,
    energyKWh: 20400,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 28.0,
    powerYoy: '-3.3% ↓',
    energyYoy: '-3.1% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-tnj-eng-01',
    deviceType: '电力设备',
    name: '1# 输变电工程模块化预制舱组装工位',
    code: 'EQ-TNJ-ENG-01',
    company: '衡变公司',
    enterprise: '特缆建',
    location: '预制舱拼装中心',
    status: '运行中',
    powerKW: 1250,
    energyKWh: 30000,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 30.0,
    powerYoy: '-3.5% ↓',
    energyYoy: '-3.2% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-hr-cap-01',
    deviceType: '电力设备',
    name: '1# 500kV高压并联电容器真空浸渍罐',
    code: 'EQ-HR-CAP-01',
    company: '衡变公司',
    enterprise: '合容电气',
    location: '电容器真空车间',
    status: '运行中',
    powerKW: 1720,
    energyKWh: 41280,
    mediumTag: '电·油',
    pressureMpa: 0.004,
    temperatureC: 75.0,
    powerYoy: '-4.6% ↓',
    energyYoy: '-4.2% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-gil-asm-01',
    deviceType: '电力设备',
    name: '1# 1100kV特高压GIL气体绝缘输电线路装配线',
    code: 'EQ-GIL-ASM-01',
    company: '衡变公司',
    enterprise: '事杰爱迪',
    location: 'GIL百级净化大厅',
    status: '运行中',
    powerKW: 2150,
    energyKWh: 51600,
    mediumTag: '电·气',
    gasFlowM3: 28.0,
    pressureMpa: 0.50,
    temperatureC: 22.0,
    powerYoy: '-4.0% ↓',
    energyYoy: '-3.8% ↓',
    flowYoy: '-3.2% ↓',
    pressureYoy: '+0.1% ↑',
  },

  // -------------------------------------------------------------
  // 3. 新变厂
  // -------------------------------------------------------------
  {
    id: 'eq-xb-wind-01',
    deviceType: '电力设备',
    name: '1# 750kV级超高压线圈立式绕线机',
    code: 'EQ-XB-WIND-01',
    company: '新变厂',
    enterprise: '超高压公司',
    location: '超高压绕线车间',
    status: '运行中',
    powerKW: 1280,
    energyKWh: 30720,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 26.0,
    powerYoy: '-3.2% ↓',
    energyYoy: '-2.9% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-xb-ac-01',
    deviceType: '电力设备',
    name: '1# 超高压绝缘洁净跨变频精密空调机组',
    code: 'EQ-XB-AC-01',
    company: '新变厂',
    enterprise: '超高压公司',
    location: '超高压绕线洁净室',
    status: '运行中',
    powerKW: 680,
    energyKWh: 16320,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 19.8,
    todayEnergyKWh: 540,
    loadRate: 71.8,
    powerFactor: 0.95,
    powerYoy: '-2.4% ↓',
    energyYoy: '-2.9% ↓',
    loadMom: '+0.1% ↑',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-tb-tank-01',
    deviceType: '电力设备',
    name: '1# 牵引变压器波纹油箱成型机组',
    code: 'EQ-TB-TANK-01',
    company: '新变厂',
    enterprise: '天变公司',
    location: '油箱制造车间',
    status: '运行中',
    powerKW: 1650,
    energyKWh: 39600,
    mediumTag: '电·水',
    pressureMpa: 0.85,
    temperatureC: 35.0,
    powerYoy: '-4.5% ↓',
    energyYoy: '-4.0% ↓',
    flowYoy: '—',
    pressureYoy: '-0.2% ↓',
  },
  {
    id: 'eq-xb-box-01',
    deviceType: '电力设备',
    name: '1# 110kV智能箱式变电站装配检测线',
    code: 'EQ-XB-BOX-01',
    company: '新变厂',
    enterprise: '智能电气',
    location: '智能化箱变车间',
    status: '运行中',
    powerKW: 1450,
    energyKWh: 34800,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 25.0,
    powerYoy: '-3.8% ↓',
    energyYoy: '-3.5% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-xb-cast-01',
    deviceType: '电力设备',
    name: '1# 110kV环氧树脂真空浇注罐',
    code: 'EQ-XB-CAST-01',
    company: '新变厂',
    enterprise: '京津冀科技',
    location: '干变浇注车间',
    status: '运行中',
    powerKW: 1750,
    energyKWh: 42000,
    mediumTag: '电·气',
    gasFlowM3: 32.5,
    pressureMpa: 0.002,
    temperatureC: 140.0,
    powerYoy: '-4.1% ↓',
    energyYoy: '-3.9% ↓',
    flowYoy: '-3.5% ↓',
    pressureYoy: '+0.1% ↑',
  },
  {
    id: 'eq-xb-shr-01',
    deviceType: '电力设备',
    name: '5# 铁心纵剪硅钢片十头纵剪线',
    code: 'EQ-XB-SHR-01',
    company: '新变厂',
    enterprise: '珠峰硅钢',
    location: '铁心智造中心',
    status: '运行中',
    powerKW: 2120,
    energyKWh: 50880,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 28.5,
    powerYoy: '-2.1% ↓',
    energyYoy: '-3.3% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-zf-cut-01',
    deviceType: '电力设备',
    name: '1# 高导磁取向硅钢连续横剪线',
    code: 'EQ-ZF-CUT-01',
    company: '新变厂',
    enterprise: '珠峰硅钢',
    location: '硅钢加工中心',
    status: '运行中',
    powerKW: 1480,
    energyKWh: 35520,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 27.0,
    powerYoy: '-3.6% ↓',
    energyYoy: '-3.1% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },

  // -------------------------------------------------------------
  // 4. 鲁缆公司
  // -------------------------------------------------------------
  {
    id: 'eq-dry-03',
    deviceType: '热力设备',
    name: '3# 500kV 悬垂立塔交联生产线',
    code: 'EQ-LL-VUL-01',
    company: '鲁缆公司',
    enterprise: '鲁缆本部',
    location: '超高压立塔车间',
    status: '运行中',
    powerKW: 3850,
    energyKWh: 92400,
    mediumTag: '电·汽',
    steamFlowT: 2.10,
    pressureMpa: 1.85,
    temperatureC: 210.5,
    steamUsageT: 55.4,
    todaySteamT: 2.4,
    todayEnergyKWh: 3150,
    loadRate: 83.0,
    powerFactor: 0.96,
    powerYoy: '+1.8% ↑',
    energyYoy: '-2.4% ↓',
    flowYoy: '-3.6% ↓',
    pressureYoy: '-0.5% ↓',
  },
  {
    id: 'eq-ll-str-01',
    deviceType: '电力设备',
    name: '1# 35kV铝合金绞线机组',
    code: 'EQ-LL-STR-01',
    company: '鲁缆公司',
    enterprise: '鲁缆本部',
    location: '绞线一车间',
    status: '运行中',
    powerKW: 1150,
    energyKWh: 27600,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 30.0,
    powerYoy: '-3.7% ↓',
    energyYoy: '-3.4% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-ll-ac-01',
    deviceType: '电力设备',
    name: '1# 超高压立塔交联机房恒温空调机组',
    code: 'EQ-LL-AC-01',
    company: '鲁缆公司',
    enterprise: '鲁缆本部',
    location: '超高压立塔车间 (塔顶洁净机房)',
    status: '运行中',
    powerKW: 520,
    energyKWh: 12480,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 22.0,
    todayEnergyKWh: 420,
    loadRate: 69.4,
    powerFactor: 0.93,
    powerYoy: '-1.9% ↓',
    energyYoy: '-2.1% ↓',
    loadMom: '+0.3% ↑',
    flowYoy: '—',
    pressureYoy: '—',
  },
  {
    id: 'eq-dry-04',
    deviceType: '热力设备',
    name: '4# 连续硫化橡胶挤塑机组',
    code: 'EQ-LL-VUL-02',
    company: '鲁缆公司',
    enterprise: '曙光公司',
    location: '橡缆挤塑车间',
    status: '运行中',
    powerKW: 1620,
    energyKWh: 38880,
    mediumTag: '电·汽',
    steamFlowT: 1.15,
    steamUsageT: 29.8,
    todaySteamT: 1.2,
    pressureMpa: 0.65,
    temperatureC: 175.0,
    powerYoy: '-5.2% ↓',
    energyYoy: '-4.7% ↓',
    flowYoy: '—',
    pressureYoy: '+0.3% ↑',
  },
  {
    id: 'eq-sg-ext-01',
    deviceType: '电力设备',
    name: '1# 船用特种防火阻燃挤出机组',
    code: 'EQ-SG-EXT-01',
    company: '鲁缆公司',
    enterprise: '曙光公司',
    location: '特缆制造车间',
    status: '运行中',
    powerKW: 1350,
    energyKWh: 32400,
    mediumTag: '电·水',
    pressureMpa: 0.50,
    temperatureC: 185.0,
    powerYoy: '-4.9% ↓',
    energyYoy: '-4.3% ↓',
    flowYoy: '—',
    pressureYoy: '+0.1% ↑',
  },

  // -------------------------------------------------------------
  // 5. 新缆厂
  // -------------------------------------------------------------
  {
    id: 'eq-dry-07',
    deviceType: '热力设备',
    name: '7# 35kV及以下三层共挤交联生产线',
    code: 'EQ-XL-VUL-01',
    company: '新缆厂',
    enterprise: '特变电工新疆电缆有限公司',
    location: '中压交联车间',
    status: '运行中',
    powerKW: 2350,
    energyKWh: 56400,
    mediumTag: '电·汽',
    steamFlowT: 1.45,
    pressureMpa: 1.20,
    temperatureC: 198.0,
    steamUsageT: 38.0,
    todaySteamT: 1.6,
    todayEnergyKWh: 1920,
    loadRate: 79.5,
    powerFactor: 0.95,
    powerYoy: '-3.1% ↓',
    energyYoy: '-2.8% ↓',
    flowYoy: '-3.0% ↓',
    pressureYoy: '+0.1% ↑',
  },
  {
    id: 'eq-xl-draw-01',
    deviceType: '电力设备',
    name: '1# 大拉连续退火铜大拉机组',
    code: 'EQ-XL-DRAW-01',
    company: '新缆厂',
    enterprise: '特变电工新疆电缆有限公司',
    location: '拉丝车间',
    status: '运行中',
    powerKW: 1890,
    energyKWh: 45360,
    mediumTag: '电·水',
    pressureMpa: 0.40,
    temperatureC: 65.0,
    powerYoy: '-4.0% ↓',
    energyYoy: '-3.6% ↓',
    flowYoy: '—',
    pressureYoy: '-0.1% ↓',
  },
  {
    id: 'eq-xl-str-01',
    deviceType: '电力设备',
    name: '1# 铝合金架空导线高速框绞机组',
    code: 'EQ-XL-STR-01',
    company: '新缆厂',
    enterprise: '特变电工新疆线缆厂',
    location: '线缆制造车间',
    status: '运行中',
    powerKW: 1420,
    energyKWh: 34080,
    mediumTag: '电',
    pressureMpa: 0.0,
    temperatureC: 28.0,
    powerYoy: '-3.5% ↓',
    energyYoy: '-3.2% ↓',
    flowYoy: '—',
    pressureYoy: '—',
  },

  // -------------------------------------------------------------
  // 6. 德缆公司
  // -------------------------------------------------------------
  {
    id: 'eq-dry-08',
    deviceType: '电力设备',
    name: '8# 铝合金杆连铸连轧机组',
    code: 'EQ-DL-CAS-01',
    company: '德缆公司',
    enterprise: '特变电工（德阳）电缆股份有限公司',
    location: '连铸连轧车间',
    status: '运行中',
    powerKW: 3100,
    energyKWh: 74400,
    mediumTag: '电·水',
    pressureMpa: 0.55,
    temperatureC: 85.0,
    powerYoy: '-4.5% ↓',
    energyYoy: '-3.9% ↓',
    flowYoy: '—',
    pressureYoy: '-0.2% ↓',
  },
  {
    id: 'eq-dl-ext-01',
    deviceType: '电力设备',
    name: '1# 轨道交通特种扁线挤压包覆机',
    code: 'EQ-DL-EXT-01',
    company: '德缆公司',
    enterprise: '特变电工（德阳）电缆股份有限公司',
    location: '特缆车间',
    status: '运行中',
    powerKW: 1220,
    energyKWh: 29280,
    mediumTag: '电·气',
    gasFlowM3: 18.0,
    pressureMpa: 0.30,
    temperatureC: 165.0,
    powerYoy: '-3.4% ↓',
    energyYoy: '-3.0% ↓',
    flowYoy: '-2.1% ↓',
    pressureYoy: '+0.1% ↑',
  },
]

export default function EquipmentPage() {
  const [treeType, setTreeType] = useState<'enterprise' | 'park'>('enterprise')
  const [selectedEqId, setSelectedEqId] = useState<string>('eq-dry-01')
  const [keyword, setKeyword] = useState('')

  // 拓扑树折叠展开状态 (1级节点默认展开，2级与3级节点支持独立收起/展开)
  const [isRootCollapsed, setIsRootCollapsed] = useState(false)
  const [collapsedCompanies, setCollapsedCompanies] = useState<Record<string, boolean>>({
    鲁缆公司: true,
    新变厂: true,
    衡变公司: true,
    新缆厂: true,
    德缆公司: true,
  })
  const [collapsedEnterprises, setCollapsedEnterprises] = useState<Record<string, boolean>>({
    '露娜公司 (特变电工露娜智能)': true,
    '智慧能源': true,
    '和新套管公司': true,
    '康嘉互感器': true,
    '印能公司': true,
    '南京电研': true,
    '云集电气': true,
    '湖南电气': true,
    '云集高压开关': true,
    '特能建': true,
    '合容电气': true,
    '赛杰爱迪': true,
    '超高压公司': true,
    '天变公司': true,
    '智能电气公司': true,
    '京津冀公司': true,
    '珠峰硅钢': true,
    '智缆公司': true,
    '昭和公司': true,
    '曙光公司': true,
    '特变电工新疆线缆厂': true,
  })

  const toggleCompanyCollapse = (compName: string) => {
    setCollapsedCompanies((prev) => ({
      ...prev,
      [compName]: !prev[compName],
    }))
  }

  const toggleEnterpriseCollapse = (entName: string) => {
    setCollapsedEnterprises((prev) => ({
      ...prev,
      [entName]: !prev[entName],
    }))
  }

  // 🌟 2. 查询时间维度选择：'day' (日) | 'month' (月) | 'custom' (自定义)
  const [timeDim, setTimeDim] = useState<'day' | 'month' | 'custom'>('day')
  const [selectedDate, setSelectedDate] = useState('2026-08-28')
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [dateRange, setDateRange] = useState({ start: '2026-08-01', end: '2026-08-28' })
  const [activeEnergyTab, setActiveEnergyTab] = useState<'elec' | 'steam'>('elec')

  const selectedEq = useMemo(() => {
    return KEY_EQUIPMENT_LIST.find((e) => e.id === selectedEqId) || KEY_EQUIPMENT_LIST[0]
  }, [selectedEqId])

  // 🌟 1. 动态感知设备实际使用的能源类型 (电、蒸汽、天然气、水等)
  const hasElec = Boolean(
    selectedEq?.mediumTag?.includes('电') ||
    (selectedEq?.powerKW && selectedEq.powerKW > 0) ||
    (selectedEq?.energyKWh && selectedEq.energyKWh > 0) ||
    selectedEq?.deviceType === '电力设备'
  )
  const hasSteam = Boolean(
    selectedEq?.mediumTag?.includes('汽') ||
    Boolean(selectedEq?.steamFlowT) ||
    Boolean(selectedEq?.steamUsageT) ||
    selectedEq?.deviceType === '热力设备'
  )
  const isDualEnergy = hasElec && hasSteam

  // 当切换选中设备时，自适应重置当前能源 Tab
  React.useEffect(() => {
    if (hasElec) {
      setActiveEnergyTab('elec')
    } else if (hasSteam) {
      setActiveEnergyTab('steam')
    }
  }, [selectedEqId, hasElec, hasSteam])

  const currentEnergy = isDualEnergy
    ? activeEnergyTab
    : hasElec
    ? 'elec'
    : hasSteam
    ? 'steam'
    : 'elec'

  // 时间维度文本标签与点位时间
  const queryPeriodLabel = useMemo(() => {
    if (timeDim === 'day') return `${selectedDate}`
    if (timeDim === 'month') return `${selectedMonth}`
    return `${dateRange.start} ~ ${dateRange.end}`
  }, [timeDim, selectedDate, selectedMonth, dateRange])

  const realtimeTimeLabel = useMemo(() => {
    return `${selectedDate} 17:30`
  }, [selectedDate])

  // 根据时间维度动态核算累计用电量
  const accumulatedElecKWh = useMemo(() => {
    const baseMonth = selectedEq.energyKWh || 112340
    if (timeDim === 'day') {
      return selectedEq.todayEnergyKWh || Math.round((baseMonth / 28) * 0.95)
    }
    if (timeDim === 'month') {
      return baseMonth
    }
    return Math.round(baseMonth * 0.93)
  }, [timeDim, selectedEq])

  // 根据时间维度动态核算累计蒸汽消耗量
  const accumulatedSteamT = useMemo(() => {
    const baseMonth = selectedEq.steamUsageT || Math.round((selectedEq.steamFlowT || 1.85) * 24 * 28 * 0.72)
    if (timeDim === 'day') {
      return selectedEq.todaySteamT || Number(((selectedEq.steamFlowT || 1.85) * 18.2).toFixed(1))
    }
    if (timeDim === 'month') {
      return baseMonth
    }
    return Number((baseMonth * 0.92).toFixed(1))
  }, [timeDim, selectedEq])

  const hasWater = selectedEq.mediumTag.includes('水') || Boolean(selectedEq.waterFlowM3)
  const hasGas = selectedEq.mediumTag.includes('气') || Boolean(selectedEq.gasFlowM3)

  const basePower = selectedEq.powerKW || 4680
  const baseSteam = selectedEq.steamFlowT || 1.85

  // 🌟 直接基于全局标准的 ENTERPRISE_TREE_DATA 构建 4 级树，保证 3 级单位名称与企业组织拓扑 100% 绝对一致
  // 🌟 园区模式下的 4 级树状结构
  const parkRootNode = PARK_ORG_TREE_DATA[0]
  const standardParks = parkRootNode?.children || []
  const rootNode = ENTERPRISE_TREE_DATA[0]
  const standardCompanies = rootNode?.children || []

  // 🌟 3. 组织与设备结构树检索过滤：支持按集团、经营单位、企业、车间及重点设备名称/编码搜索
  const filteredTreeData = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    const rootName = rootNode?.name || '电装集团'
    const rootMatches = kw ? rootName.toLowerCase().includes(kw) : false

    return standardCompanies.map((compNode) => {
      const compName = compNode.name
      const compMatches = kw ? (rootMatches || compName.toLowerCase().includes(kw)) : true
      const enterprises = compNode.children || []

      const matchedEnterprises = enterprises.map((ent) => {
        const hasSubUnits = Boolean(ent.children && ent.children.length > 0)
        const subUnits = (ent.children || []).map((sub) => {
          const subEqs = KEY_EQUIPMENT_LIST.filter(
            (e) =>
              (treeType === 'enterprise' ? e.company === compName : true) &&
              (e.enterprise.includes(sub.name.slice(0, 3)) || sub.name.includes(e.enterprise.slice(0, 3)))
          )
          return {
            name: sub.name,
            id: sub.id,
            badge: sub.badge,
            unconnected: sub.unconnected,
            equipments: subEqs,
          }
        })

        const directEqs = KEY_EQUIPMENT_LIST.filter(
          (e) =>
            (treeType === 'enterprise' ? e.company === compName : true) &&
            (e.enterprise.includes(ent.name.slice(0, 3)) || ent.name.includes(e.enterprise.slice(0, 3)) || subUnits.some((s) => e.enterprise.includes(s.name.slice(0, 3))))
        )

        const allEqs = hasSubUnits ? subUnits.flatMap((s) => s.equipments) : directEqs
        const entMatches = kw ? (compMatches || ent.name.toLowerCase().includes(kw)) : true

        // 过滤设备：如果上级公司或单位命中，则展示所有设备；否则匹配设备名、编码、车间
        const filteredEqs = allEqs.filter((eq) => {
          if (!kw || entMatches) return true
          return (
            eq.name.toLowerCase().includes(kw) ||
            eq.code.toLowerCase().includes(kw) ||
            (eq.location && eq.location.toLowerCase().includes(kw))
          )
        })

        return {
          name: ent.name,
          id: ent.id,
          badge: ent.badge,
          unconnected: ent.unconnected,
          children: subUnits,
          equipments: filteredEqs,
          rawCount: allEqs.length,
          matches: entMatches || filteredEqs.length > 0,
        }
      })

      const visibleEnterprises = kw
        ? matchedEnterprises.filter((ent) => ent.matches)
        : matchedEnterprises

      return {
        ...compNode,
        enterprises: visibleEnterprises,
        matches: compMatches || visibleEnterprises.length > 0,
      }
    }).filter((comp) => !kw || comp.matches)
  }, [standardCompanies, rootNode, keyword, treeType])

  // =========================================================================
  // 1. 【电】+【日】：15分钟高频功率曲线 (标注最大最小值) & 峰平谷 (总饼图 + 分日堆叠图)
  // =========================================================================
  const elecDayPowerData = useMemo(() => {
    const points: Array<{ time: string; 实时功率: number }> = []
    const scale = (selectedEq.powerKW || 4680) / 4680
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        const t = h + m / 60
        let kw = 0

        if (timeStr === '11:15') {
          kw = 4850 // 🌟 全天最大值
        } else if (timeStr === '03:30') {
          kw = 2120 // 🌟 全天最小值
        } else if (t >= 0 && t < 6) {
          kw = Math.round(2120 + Math.sin(t * 0.8) * 320)
        } else if (t >= 6 && t < 8.5) {
          kw = Math.round(2400 + ((t - 6) / 2.5) * 1600)
        } else if (t >= 8.5 && t < 12) {
          kw = Math.round(4100 + Math.sin((t - 8.5) * 1.5) * 650)
        } else if (t >= 12 && t < 13.5) {
          kw = Math.round(3800 + Math.cos((t - 12) * 2) * 200)
        } else if (t >= 13.5 && t < 18) {
          kw = Math.round(4350 + Math.sin((t - 13.5) * 1.2) * 350)
        } else if (t >= 18 && t < 21) {
          kw = Math.round(3600 - ((t - 18) / 3) * 800)
        } else {
          kw = Math.round(2700 - ((t - 21) / 3) * 400)
        }
        // 保证不会超过 4850 或低于 2120
        kw = Math.min(4840, Math.max(2130, kw))
        if (timeStr === '11:15') kw = 4850
        if (timeStr === '03:30') kw = 2120

        points.push({
          time: timeStr,
          实时功率: Math.round(kw * scale),
        })
      }
    }
    return points
  }, [selectedEq.powerKW])

  // 电-日：峰平谷总饼图数据
  const elecDayDonutData = useMemo(() => {
    const totalKWh = selectedEq.energyKWh || 112340
    return [
      { name: '尖峰电量', value: Math.round(totalKWh * 0.164), color: '#FF6536', ratio: '16.4%' },
      { name: '高峰电量', value: Math.round(totalKWh * 0.411), color: '#FFBA00', ratio: '41.1%' },
      { name: '平段电量', value: Math.round(totalKWh * 0.289), color: '#2C7CFF', ratio: '28.9%' },
      { name: '低谷电量', value: Math.round(totalKWh * 0.136), color: '#10C4CE', ratio: '13.6%' },
    ]
  }, [selectedEq.energyKWh])

  // 电-日：分日时段峰平谷堆叠柱状图数据 (24小时各时段)
  const elecDayStackedBarData = useMemo(() => {
    return [
      { time: '00:00', 尖峰: 0, 峰段: 0, 平段: 0, 谷段: 2100 },
      { time: '02:00', 尖峰: 0, 峰段: 0, 平段: 0, 谷段: 2120 },
      { time: '04:00', 尖峰: 0, 峰段: 0, 平段: 0, 谷段: 2200 },
      { time: '06:00', 尖峰: 0, 峰段: 0, 平段: 0, 谷段: 2450 },
      { time: '08:00', 尖峰: 0, 峰段: 3800, 平段: 0, 谷段: 0 },
      { time: '10:00', 尖峰: 2200, 峰段: 2500, 平段: 0, 谷段: 0 },
      { time: '11:00', 尖峰: 2400, 峰段: 2450, 平段: 0, 谷段: 0 },
      { time: '12:00', 尖峰: 0, 峰段: 0, 平段: 4200, 谷段: 0 },
      { time: '14:00', 尖峰: 0, 峰段: 4150, 平段: 0, 谷段: 0 },
      { time: '16:00', 尖峰: 0, 峰段: 4300, 平段: 0, 谷段: 0 },
      { time: '18:00', 尖峰: 1800, 峰段: 2300, 平段: 0, 谷段: 0 },
      { time: '20:00', 尖峰: 0, 峰段: 0, 平段: 3600, 谷段: 0 },
      { time: '22:00', 尖峰: 0, 峰段: 0, 平段: 0, 谷段: 2500 },
    ]
  }, [])

  // =========================================================================
  // 2. 【电】+【月】：每日最大功率曲线 (标注最大最小值) & 峰平谷 (总饼图 + 分月分日堆叠图)
  // =========================================================================
  const elecMonthMaxPowerData = useMemo(() => {
    const days = []
    for (let d = 1; d <= 31; d++) {
      const dayStr = d < 10 ? `0${d}日` : `${d}日`
      let maxKw = Math.round(basePower * (0.85 + Math.sin(d * 0.5) * 0.15))
      if (d === 15) maxKw = 5120 // 当月最大
      if (d === 3) maxKw = 2860 // 当月最小
      days.push({
        day: dayStr,
        每日最大功率: maxKw,
      })
    }
    return days
  }, [basePower])

  // 电-月：峰平谷总饼图数据 (月度累计)
  const elecMonthDonutData = useMemo(() => {
    const totalMonthKWh = Math.round((selectedEq.energyKWh || 112340) * 25.1)
    return [
      { name: '尖峰电量', value: Math.round(totalMonthKWh * 0.172), color: '#FF6536', ratio: '17.2%' },
      { name: '高峰电量', value: Math.round(totalMonthKWh * 0.418), color: '#FFBA00', ratio: '41.8%' },
      { name: '平段电量', value: Math.round(totalMonthKWh * 0.282), color: '#2C7CFF', ratio: '28.2%' },
      { name: '低谷电量', value: Math.round(totalMonthKWh * 0.128), color: '#10C4CE', ratio: '12.8%' },
    ]
  }, [selectedEq.energyKWh])

  // 电-月：分月每日堆叠柱状图 (1日~31日各天)
  const elecMonthStackedBarData = useMemo(() => {
    const days = []
    for (let d = 1; d <= 31; d++) {
      const dayStr = d < 10 ? `0${d}日` : `${d}日`
      const isWeekend = d % 7 === 0 || d % 7 === 6
      const baseDayKWh = isWeekend ? 65000 : 98000
      days.push({
        day: dayStr,
        尖峰: Math.round(baseDayKWh * (isWeekend ? 0.08 : 0.18)),
        峰段: Math.round(baseDayKWh * 0.42),
        平段: Math.round(baseDayKWh * 0.28),
        谷段: Math.round(baseDayKWh * (isWeekend ? 0.22 : 0.12)),
      })
    }
    return days
  }, [])

  // =========================================================================
  // 3. 【蒸汽】+【日】：瞬时流量曲线 (标注最大最小值) & 日累计用量
  // =========================================================================
  const steamDayFlowData = useMemo(() => {
    const hours = [
      '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '11:00', '12:00',
      '14:00', '16:00', '18:00', '20:00', '22:00', '23:00'
    ]
    return hours.map((t) => {
      let flow = Number((baseSteam * (0.8 + Math.sin(parseInt(t) * 0.4) * 0.3)).toFixed(2))
      if (t === '10:00' || t === '11:00') flow = 2.35 // 最大值
      if (t === '04:00') flow = 0.62 // 最小值
      return {
        time: t,
        瞬时流量: flow,
      }
    })
  }, [baseSteam])

  // 蒸汽-日：逐时累计蒸汽用量
  const steamDayAccumulatedData = useMemo(() => {
    const hours = [
      '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00',
      '14:00', '16:00', '18:00', '20:00', '22:00'
    ]
    let acc = 0
    return hours.map((t) => {
      const delta = Number((baseSteam * (0.9 + Math.random() * 0.3)).toFixed(2))
      acc = Number((acc + delta * 2).toFixed(2))
      return {
        time: t,
        小时用量: Number((delta * 2).toFixed(2)),
        当日累计: acc,
      }
    })
  }, [baseSteam])

  // =========================================================================
  // 4. 【蒸汽】+【月】：每日最大流量曲线 (标注最大最小值) & 月累计用量
  // =========================================================================
  const steamMonthMaxFlowData = useMemo(() => {
    const days = []
    for (let d = 1; d <= 31; d++) {
      const dayStr = d < 10 ? `0${d}日` : `${d}日`
      let maxF = Number((baseSteam * (0.9 + Math.cos(d * 0.4) * 0.25)).toFixed(2))
      if (d === 18) maxF = 2.68 // 当月最大
      if (d === 4) maxF = 0.85 // 当月最小
      days.push({
        day: dayStr,
        每日最大流量: maxF,
      })
    }
    return days
  }, [baseSteam])

  // 蒸汽-月：每日累计蒸汽用量柱状图
  const steamMonthDailyAccumulatedData = useMemo(() => {
    const days = []
    for (let d = 1; d <= 31; d++) {
      const dayStr = d < 10 ? `0${d}日` : `${d}日`
      const isWeekend = d % 7 === 0 || d % 7 === 6
      const baseVal = isWeekend ? 18.5 : 36.2
      days.push({
        day: dayStr,
        蒸汽用量: Number((baseVal + Math.sin(d) * 4).toFixed(1)),
      })
    }
    return days
  }, [])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 4 级组织与重点设备拓扑树 (1级集团 ➔ 2级单位 ➔ 3级企业 ➔ 4级重点设备) */}
      <aside className="w-[270px] min-w-[270px] max-w-[270px] shrink-0 sticky top-0 bg-white rounded-lg border border-[#DBE6EE] shadow-xs flex flex-col h-[calc(100vh-84px)] overflow-hidden">
        {/* 搜索框 */}
        <div className="p-2 border-b border-slate-100 bg-white shrink-0">
          <div className="relative">
            <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="请输入搜索关键词"
              className="w-full pl-8 pr-7 h-9 text-xs bg-panel border border-[#E2E8F0] rounded-lg text-slate-700 focus:outline-none focus:border-primary placeholder:text-slate-400 transition-all"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                title="清空搜索"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 树节点内容 (自适应滚动) */}
        <div className="p-2 overflow-y-auto flex-1 text-xs font-sans space-y-1.5 custom-scrollbar">
          {filteredTreeData.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              未检索到匹配的组织或设备
            </div>
          ) : (
            <>
              {/* 1级节点：电装集团 (支持点击展开/收起) */}
              <div
                onClick={() => setIsRootCollapsed(!isRootCollapsed)}
                className="flex items-center gap-1.5 py-1 px-1.5 rounded bg-blue-50/70 text-[#2C7CFF] font-bold cursor-pointer hover:bg-blue-100/70 transition-colors select-none"
                title="点击收起/展开下级组织与重点设备"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsRootCollapsed(!isRootCollapsed)
                  }}
                  className="size-4 flex items-center justify-center text-[#2C7CFF] hover:text-blue-700 shrink-0 cursor-pointer"
                >
                  {isRootCollapsed && !keyword.trim() ? (
                    <ChevronRight className="size-3.5" />
                  ) : (
                    <ChevronDown className="size-3.5" />
                  )}
                </button>
                <Building2 className="size-3.5 shrink-0 text-[#2C7CFF]" />
                <span className="flex-1 truncate">{rootNode?.name || '电装集团'}</span>
              </div>

              {/* 1级节点展开后的 2级经营单位列表 (与 ENTERPRISE_TREE_DATA 严格对齐) */}
              {(!isRootCollapsed || Boolean(keyword.trim())) && (
                <div className="border-l border-slate-200 ml-3.5 pl-2 space-y-1">
                  {filteredTreeData.map((compNode) => {
                    const compName = compNode.name
                    const isCompanyCollapsed = keyword.trim() ? false : Boolean(collapsedCompanies[compName])

                    return (
                      <div key={compNode.id} className="space-y-0.5">
                        {/* 2级节点：各经营单位 / 所属园区 (支持点击展开/收起) */}
                        <div
                          onClick={() => toggleCompanyCollapse(compName)}
                          className="flex items-center gap-1.5 py-1 px-1.5 rounded text-slate-800 font-bold hover:bg-slate-100 cursor-pointer select-none transition-colors"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCompanyCollapse(compName)
                            }}
                            className="size-3.5 flex items-center justify-center text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer"
                          >
                            {isCompanyCollapsed ? (
                              <ChevronRight className="size-3 text-slate-400" />
                            ) : (
                              <ChevronDown className="size-3 text-slate-500" />
                            )}
                          </button>
                          <span className="flex-1 truncate" title={compName}>{compName}</span>
                        </div>

                        {/* 2级节点展开后的 3级企业级单位列表 (与 ENTERPRISE_TREE_DATA 100% 绝对一致) */}
                        {!isCompanyCollapsed && (
                          <div className="border-l border-slate-200 ml-3 pl-2 space-y-1">
                            {compNode.enterprises.map((ent) => {
                              const rawEntName = ent.name
                              const entName = rawEntName.replace(/\s*\(.*?\)/g, '')
                              const UNCONNECTED_NAMES = ['智慧能源', '印能公司', '银利电气', '曙光']
                              const isUnconnected = ent.unconnected || UNCONNECTED_NAMES.some((u) => rawEntName.includes(u))

                              if (isUnconnected) {
                                return (
                                  <div
                                    key={ent.id}
                                    className="flex items-center gap-1 py-0.5 px-1 rounded opacity-35 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none text-[11.5px]"
                                    title={`${entName} (暂不具备数据接入条件 · 不允许选择)`}
                                  >
                                    <span className="size-3 flex items-center justify-center shrink-0" />
                                    <Factory className="size-3 text-slate-400 dark:text-slate-500 shrink-0" />
                                    <span className="flex-1 truncate">{entName}</span>
                                    <span className="text-[10px] font-mono">(0)</span>
                                  </div>
                                )
                              }

                              const hasEqs = ent.equipments.length > 0
                              const isEntCollapsed = keyword.trim() ? false : Boolean(collapsedEnterprises[rawEntName])

                              return (
                                <div key={ent.id} className="space-y-0.5">
                                  {/* 3级节点：企业级单位 (支持点击展开/收起) */}
                                  <div
                                    onClick={() => toggleEnterpriseCollapse(rawEntName)}
                                    className="flex items-center gap-1 py-0.5 px-1 rounded text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer select-none transition-colors text-[11.5px]"
                                  >
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleEnterpriseCollapse(rawEntName)
                                      }}
                                      className="size-3 flex items-center justify-center text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
                                    >
                                      {isEntCollapsed ? (
                                        <ChevronRight className="size-2.5 text-slate-400" />
                                      ) : (
                                        <ChevronDown className="size-2.5 text-slate-500" />
                                      )}
                                    </button>
                                    <Factory className="size-3 text-slate-500 shrink-0" />
                                    <span className="flex-1 truncate" title={rawEntName}>{entName}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      ({ent.equipments.length})
                                    </span>
                                  </div>

                                  {/* 4级节点：重点设备列表 */}
                                  {!isEntCollapsed && (
                                    <div className="border-l border-slate-200 ml-2.5 pl-2 space-y-0.5">
                                      {hasEqs ? (
                                        ent.equipments.map((eq) => {
                                          const isSelected = selectedEqId === eq.id
                                          const eqUsesElec = Boolean(
                                            eq.mediumTag?.includes('电') ||
                                            (eq.powerKW && eq.powerKW > 0) ||
                                            eq.deviceType === '电力设备'
                                          )
                                          const eqUsesSteam = Boolean(
                                            eq.mediumTag?.includes('汽') ||
                                            Boolean(eq.steamFlowT) ||
                                            eq.deviceType === '热力设备'
                                          )
                                          const eqIsDual = eqUsesElec && eqUsesSteam

                                          return (
                                            <div
                                              key={eq.id}
                                              onClick={() => setSelectedEqId(eq.id)}
                                              className={cn(
                                                'flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition-colors text-[11px] group',
                                                isSelected
                                                  ? 'bg-[#e6f4ff] text-[#2C7CFF] font-bold shadow-2xs'
                                                  : 'hover:bg-slate-100 text-slate-600'
                                              )}
                                            >
                                              <div className="flex items-center gap-1.5 truncate">
                                                {eqIsDual ? (
                                                  <span
                                                    className="inline-flex items-center gap-0.5 shrink-0"
                                                    title="关联能源类型：电力、蒸汽"
                                                  >
                                                    <Zap className="size-3 text-[#2C7CFF]" />
                                                    <Flame className="size-3 text-[#FFBA00]" />
                                                  </span>
                                                ) : eqUsesSteam ? (
                                                  <Flame
                                                    className="size-3 text-[#FFBA00] shrink-0"
                                                    title="关联能源类型：蒸汽"
                                                  />
                                                ) : (
                                                  <Zap
                                                    className={cn('size-3 shrink-0', isSelected ? 'text-[#2C7CFF]' : 'text-blue-500')}
                                                    title="关联能源类型：电力"
                                                  />
                                                )}
                                                <span className="truncate" title={eq.name}>
                                                  {eq.name}
                                                </span>
                                              </div>
                                              <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" title="在线运行" />
                                            </div>
                                          )
                                        })
                                      ) : (
                                        <div className="py-0.5 px-2 text-[10.5px] text-slate-400 font-sans italic">
                                          暂无重点监测设备
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* 1. 顶部 Header */}
        <OnlineHeader
          timeDim={timeDim}
          onTimeDimChange={setTimeDim}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          startDate={dateRange.start}
          endDate={dateRange.end}
          onDateRangeChange={(start, end) => setDateRange({ start, end })}
          hideExport={true}
        />

        {/* 2. 选中设备主卡片 (根据设备用能类型动态呈现电 / 蒸汽 / 全部) */}
        <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h2 className="text-base font-bold text-slate-800" title={selectedEq.name}>
                监测设备
              </h2>
              <div className="flex items-center gap-1.5 flex-wrap ml-1">
                {hasElec && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-[#2C7CFF] border border-blue-200">
                    <Zap className="size-3" /> 电力
                  </span>
                )}
                {hasSteam && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-[#FFBA00] border border-amber-200">
                    <Wind className="size-3" /> 蒸汽
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 数据统计卡片 (根据设备上传的数据类型显示对应指标：区分 电 或者 蒸汽 或者 全部) */}
          <div className="space-y-4 font-mono">
            {/* 🌟 1. 电力数据指标 (当设备使用电力时显示，只保留 3 个核心指标并标注时间) */}
            {hasElec && (
              <div className="space-y-2">
                {isDualEnergy && (
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Zap className="size-3.5 text-[#2C7CFF]" />
                    <span>电力在线监测指标</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 1. 实时有功功率 */}
                  <div className="p-4 bg-blue-50/50 rounded-lg border border-[#DBE6EE] space-y-2">
                    <div className="text-sm text-slate-700 font-sans flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Zap className="size-4 text-[#2C7CFF]" />
                        实时有功功率
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1 font-normal">
                        <Clock className="size-3 text-slate-400" />
                        {realtimeTimeLabel}
                      </span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#2C7CFF]">
                      {selectedEq.powerKW?.toLocaleString()} <span className="text-sm font-normal text-slate-500 font-sans">kW</span>
                    </div>
                  </div>

                  {/* 2. 设备负荷率 */}
                  <div className="p-4 bg-amber-50/50 rounded-lg border border-[#DBE6EE] space-y-2">
                    <div className="text-sm text-slate-700 font-sans flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Layers className="size-4 text-[#FFBA00]" />
                        设备负荷率
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1 font-normal">
                        <Clock className="size-3 text-slate-400" />
                        {realtimeTimeLabel}
                      </span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#FFBA00]">
                      {selectedEq.loadRate || 82.5}%
                    </div>
                  </div>

                  {/* 3. 累计用电量 (根据时间控件查询来确定时间) */}
                  <div className="p-4 bg-emerald-50/50 rounded-lg border border-[#DBE6EE] space-y-2">
                    <div className="text-sm text-slate-700 font-sans flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Activity className="size-4 text-[#00D492]" />
                        累计用电量
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1 font-normal">
                        <Clock className="size-3 text-slate-400" />
                        {queryPeriodLabel}
                      </span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#00D492]">
                      {accumulatedElecKWh.toLocaleString()}{' '}
                      <span className="text-sm font-normal text-slate-500 font-sans">kWh</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🌟 2. 蒸汽数据指标 (当设备使用蒸汽时显示，只保留 2 个核心指标并标注时间) */}
            {hasSteam && (
              <div className={cn("space-y-2", hasElec && "pt-3 border-t border-slate-100")}>
                {isDualEnergy && (
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Wind className="size-3.5 text-[#FFBA00]" />
                    <span>蒸汽在线监测指标</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. 瞬时蒸汽流量 */}
                  <div className="p-4 bg-amber-50/50 rounded-lg border border-[#DBE6EE] space-y-2">
                    <div className="text-sm text-slate-700 font-sans flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Wind className="size-4 text-[#FFBA00]" />
                        瞬时蒸汽流量
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1 font-normal">
                        <Clock className="size-3 text-slate-400" />
                        {realtimeTimeLabel}
                      </span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#FFBA00]">
                      {selectedEq.steamFlowT || 1.85} <span className="text-sm font-normal text-slate-500 font-sans">t/h</span>
                    </div>
                  </div>

                  {/* 2. 累计蒸汽消耗量 (根据时间控件查询来确定时间) */}
                  <div className="p-4 bg-amber-50/80 rounded-lg border border-[#FFBA00]/30 space-y-2">
                    <div className="text-sm text-slate-700 font-sans flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Flame className="size-4 text-[#FF6536]" />
                        累计蒸汽消耗量
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1 font-normal">
                        <Clock className="size-3 text-slate-400" />
                        {queryPeriodLabel}
                      </span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-[#FF6536]">
                      {accumulatedSteamT.toLocaleString()}{' '}
                      <span className="text-sm font-normal text-slate-500 font-sans">t</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. 多能源类型切换 Tab (当重点用能设备有多类能源时切换) */}
        {isDualEnergy && (
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setActiveEnergyTab('elec')}
              className={cn(
                "h-8 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeEnergyTab === 'elec'
                  ? "bg-[#2C7CFF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 bg-transparent"
              )}
            >
              <Zap className="size-3.5" />
              <span>电力监测图表</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEnergyTab('steam')}
              className={cn(
                "h-8 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeEnergyTab === 'steam'
                  ? "bg-[#2C7CFF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 bg-transparent"
              )}
            >
              <Wind className="size-3.5" />
              <span>蒸汽监测图表</span>
            </button>
          </div>
        )}

        {/* 4. 核心图表区域 (根据 电/汽 和 日/月 动态切换 4 种视图) */}

        {/* ========================================================================= */}
        {/* 模式 1: 【电】+【日】                                                     */}
        {/* ========================================================================= */}
        {currentEnergy === 'elec' && timeDim === 'day' && (
          <div className="space-y-6">
            {/* 设备功率连续曲线 (图上标出最大值最小值，右上角文字描述剥离) */}
            <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    设备功率
                  </h3>
                </div>
              </div>

              <div className="h-[250px]">
                <LineTrend
                  data={elecDayPowerData}
                  xKey="time"
                  height={250}
                  yUnit="kW"
                  xInterval={7}
                  showMinMax={true}
                  lines={[
                    { key: '实时功率', name: '实时有功功率 (kW)', color: '#2C7CFF' },
                  ]}
                />
              </div>
            </div>

            {/* 峰平谷用电分析 (日维度：只平铺整个饼图与4段明细，不显示右侧堆叠条形图) */}
            <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    峰平谷用电分析
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  当日用电总量: <strong className="text-[#2C7CFF] text-sm font-bold">{(selectedEq.energyKWh || 112340).toLocaleString()}</strong> kWh
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-2">
                {/* 环形饼图居中 (md:col-span-5) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <Donut data={elecDayDonutData} height={210} unit="kWh" />
                </div>

                {/* 4段峰平谷平铺明细卡片 (md:col-span-7) */}
                <div className="md:col-span-7 grid grid-cols-2 gap-3 font-mono">
                  {elecDayDonutData.map((item) => {
                    const isTip = item.name.includes('尖峰')
                    const isPeak = item.name.includes('高峰')
                    const isFlat = item.name.includes('平段')

                    const colorCls = isTip
                      ? 'text-[#FF6536] border-[#FF6536]/20 bg-orange-50/80'
                      : isPeak
                      ? 'text-[#FFBA00] border-[#FFBA00]/20 bg-amber-50/80'
                      : isFlat
                      ? 'text-[#2C7CFF] border-[#2C7CFF]/20 bg-blue-50/80'
                      : 'text-[#10C4CE] border-[#10C4CE]/20 bg-cyan-50/80'

                    return (
                      <div key={item.name} className={cn("p-3.5 rounded-lg border flex flex-col justify-between", colorCls)}>
                        <div className="flex justify-between items-center text-xs font-medium font-sans">
                          <span>{item.name.replace('电量', '')}</span>
                          <strong className="font-mono text-sm">{item.ratio}</strong>
                        </div>
                        <div className="text-xl font-bold font-mono mt-1.5">
                          {item.value.toLocaleString()} <span className="text-xs font-normal font-sans">kWh</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 模式 2: 【电】+【月/自定义】                                            */}
        {/* ========================================================================= */}
        {currentEnergy === 'elec' && timeDim !== 'day' && (
          <div className="space-y-6">
            {/* 设备功率走势曲线 (图上标出最大值最小值，右上角文字描述剥离) */}
            <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    设备功率
                  </h3>
                </div>
              </div>

              <div className="h-[250px]">
                <LineTrend
                  data={elecMonthMaxPowerData}
                  xKey="day"
                  height={250}
                  yUnit="kW"
                  showMinMax={true}
                  lines={[
                    { key: '每日最大功率', name: '每日最大功率 (kW)', color: '#2C7CFF' },
                  ]}
                />
              </div>
            </div>

            {/* 峰平谷用电分析 (总饼图 + 分月分日堆叠图) */}
            <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    峰平谷用电分析
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* 左侧 4/12: 月度累计峰平谷构成 (Donut + 4 段卡片) */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-3 border-r border-slate-100 pr-4">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <PieIcon className="size-4 text-[#2C7CFF]" />
                      月度累计峰平谷构成
                    </span>
                    <span className="text-sm font-mono text-[#2C7CFF] font-bold">
                      {Math.round((selectedEq.energyKWh || 112340) * 25.1).toLocaleString()} kWh
                    </span>
                  </div>

                  <Donut data={elecMonthDonutData} height={165} unit="kWh" />

                  <div className="grid grid-cols-2 gap-2 text-sm font-mono pt-1">
                    {elecMonthDonutData.map((item) => {
                      const isTip = item.name.includes('尖峰')
                      const isPeak = item.name.includes('高峰')
                      const isFlat = item.name.includes('平段')

                      const colorCls = isTip
                        ? 'text-[#FF6536] border-[#FF6536]/20 bg-orange-50/80'
                        : isPeak
                        ? 'text-[#FFBA00] border-[#FFBA00]/20 bg-amber-50/80'
                        : isFlat
                        ? 'text-[#2C7CFF] border-[#2C7CFF]/20 bg-blue-50/80'
                        : 'text-[#10C4CE] border-[#10C4CE]/20 bg-cyan-50/80'

                      return (
                        <div key={item.name} className={`p-2 rounded-lg border ${colorCls}`}>
                          <div className="flex justify-between items-center text-xs font-medium font-sans">
                            <span>{item.name.replace('电量', '')}</span>
                            <strong className="font-mono">{item.ratio}</strong>
                          </div>
                          <div className="text-base font-bold font-mono mt-0.5">
                            {item.value.toLocaleString()} kWh
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 右侧 8/12: 1日~31日分日峰平谷堆叠柱状图 */}
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <BarChart3 className="size-4 text-[#2C7CFF]" />
                      分解到日峰平谷用电量连续堆叠分布 (kWh)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      尖/峰/平/谷 分时连续采集
                    </span>
                  </div>
                  <div className="h-[235px]">
                    <BarChartGroup
                      data={elecMonthStackedBarData}
                      xKey="day"
                      height={235}
                      stacked
                      bars={[
                        { key: '谷段', name: '低谷电量', color: '#10C4CE' },
                        { key: '平段', name: '平段电量', color: '#2C7CFF' },
                        { key: '峰段', name: '高峰电量', color: '#FFBA00' },
                        { key: '尖峰', name: '尖峰电量', color: '#FF6536' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 模式 3: 【蒸汽】+【日】                                                   */}
        {/* ========================================================================= */}
        {currentEnergy === 'steam' && timeDim === 'day' && (
          <div className="space-y-6">
            {/* 蒸汽流量走势曲线 (图上标出最大值最小值，右上角文字描述剥离) */}
            <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    蒸汽流量走势
                  </h3>
                </div>
              </div>

              <div className="h-[250px]">
                <LineTrend
                  data={steamDayFlowData}
                  xKey="time"
                  height={250}
                  yUnit="t/h"
                  showMinMax={true}
                  lines={[
                    { key: '瞬时流量', name: '瞬时蒸汽流量 (t/h)', color: '#FFBA00' },
                  ]}
                />
              </div>
            </div>

            {/* 蒸汽累计消耗量 (AreaTrend 面积图) */}
            <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    蒸汽累计消耗量
                  </h3>
                </div>
                <span className="text-sm text-slate-500 font-mono">
                  当日累计用汽: 44.5 t
                </span>
              </div>

              <div className="h-[220px]">
                <AreaTrend
                  data={steamDayAccumulatedData}
                  xKey="time"
                  height={220}
                  yUnit="t"
                  areas={[
                    { key: '当日累计', name: '当日累计蒸汽用量 (t)', color: '#FFBA00' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 模式 4: 【蒸汽】+【月/自定义】                                          */}
        {/* ========================================================================= */}
        {currentEnergy === 'steam' && timeDim !== 'day' && (
          <div className="space-y-6">
            {/* 蒸汽流量走势曲线 (图上标出最大值最小值，右上角文字描述剥离) */}
            <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    蒸汽流量走势
                  </h3>
                </div>
              </div>

              <div className="h-[250px]">
                <LineTrend
                  data={steamMonthMaxFlowData}
                  xKey="day"
                  height={250}
                  yUnit="t/h"
                  showMinMax={true}
                  lines={[
                    { key: '每日最大流量', name: '每日最大流量 (t/h)', color: '#FFBA00' },
                  ]}
                />
              </div>
            </div>

            {/* 蒸汽累计消耗量柱状图 */}
            <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
                  <h3 className="text-base font-bold text-slate-800">
                    蒸汽累计消耗量
                  </h3>
                </div>
                <span className="text-sm text-slate-500 font-mono">
                  月总消耗量: 1,028.5 t
                </span>
              </div>

              <div className="h-[220px]">
                <BarChartGroup
                  data={steamMonthDailyAccumulatedData}
                  xKey="day"
                  height={220}
                  bars={[
                    { key: '蒸汽用量', name: '日蒸汽用量 (t)', color: '#FFBA00' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

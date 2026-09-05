'use client'

import React, { useState, useMemo } from 'react'
import {
  Cpu,
  Zap,
  Flame,
  Droplets,
  Wind,
  Search,
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
} from 'lucide-react'
import { LineTrend, BarChartGroup, Donut, AreaTrend } from '@/components/shared/charts'
import { OnlineHeader } from '@/components/shared/online-header'
import { ENTERPRISE_TREE_DATA, PARK_ORG_TREE_DATA } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

export interface KeyEquipmentInfo {
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
}

export const KEY_EQUIPMENT_LIST: KeyEquipmentInfo[] = [
  // -------------------------------------------------------------
  // 1. 沈变公司
  // -------------------------------------------------------------
  {
    id: 'eq-dry-01',
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
    id: 'eq-ln-cryo-01',
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
    powerYoy: '-5.1% ↓',
    energyYoy: '-4.6% ↓',
    flowYoy: '—',
    pressureYoy: '-0.1% ↓',
  },
  {
    id: 'eq-sb-ems-01',
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
    name: '1# 800kV特高压干式电容套管固化炉',
    code: 'EQ-HX-FURN-01',
    company: '沈变公司',
    enterprise: '和新套管公司',
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
    name: '6# 煤油喷淋回收及热循环系统',
    code: 'EQ-HB-REC-01',
    company: '衡变公司',
    enterprise: '衡变本部',
    location: '干燥辅助站房',
    status: '运行中',
    powerKW: 1050,
    energyKWh: 25200,
    mediumTag: '电·气',
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
    id: 'eq-nj-test-01',
    name: '1# 继电保护与智能控制综测平台',
    code: 'EQ-NJ-TEST-01',
    company: '衡变公司',
    enterprise: '南京电研',
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
    name: '1# 输变电工程模块化预制舱组装工位',
    code: 'EQ-TNJ-ENG-01',
    company: '衡变公司',
    enterprise: '特能建',
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
    name: '1# 1100kV特高压GIL气体绝缘输电线路装配线',
    code: 'EQ-GIL-ASM-01',
    company: '衡变公司',
    enterprise: '赛杰爱迪',
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
    id: 'eq-tb-tank-01',
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
    name: '1# 110kV智能箱式变电站装配检测线',
    code: 'EQ-XB-BOX-01',
    company: '新变厂',
    enterprise: '智能电气公司',
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
    name: '1# 110kV环氧树脂真空浇注罐',
    code: 'EQ-XB-CAST-01',
    company: '新变厂',
    enterprise: '京津冀公司',
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
    id: 'eq-dry-04',
    name: '4# 连续硫化橡胶挤塑机组',
    code: 'EQ-LL-VUL-02',
    company: '鲁缆公司',
    enterprise: '曙光公司',
    location: '橡缆挤塑车间',
    status: '运行中',
    powerKW: 1620,
    energyKWh: 38880,
    mediumTag: '电·水',
    pressureMpa: 0.65,
    temperatureC: 175.0,
    powerYoy: '-5.2% ↓',
    energyYoy: '-4.7% ↓',
    flowYoy: '—',
    pressureYoy: '+0.3% ↑',
  },
  {
    id: 'eq-sg-ext-01',
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
  const [eqSearchKw, setEqSearchKw] = useState('')

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

  // 🌟 1. 能源类型选择：'elec' (电) | 'steam' (蒸汽)
  const [energyType, setEnergyType] = useState<'elec' | 'steam'>('elec')

  // 🌟 2. 查询时间维度选择：'day' (日) | 'month' (月)
  const [timeDim, setTimeDim] = useState<'day' | 'month'>('day')
  const [selectedDay, setSelectedDay] = useState('2026-08-27')
  const [selectedMonth, setSelectedMonth] = useState('2026-08')

  const selectedEq = useMemo(() => {
    return KEY_EQUIPMENT_LIST.find((e) => e.id === selectedEqId) || KEY_EQUIPMENT_LIST[0]
  }, [selectedEqId])

  // 🌟 设备支持的数据介质动态感知 (电力、功率、水、蒸汽、天然气)
  const hasSteam = selectedEq.mediumTag.includes('汽') || Boolean(selectedEq.steamFlowT)
  const hasWater = selectedEq.mediumTag.includes('水') || Boolean(selectedEq.waterFlowM3)
  const hasGas = selectedEq.mediumTag.includes('气') || Boolean(selectedEq.gasFlowM3)
  const isPureElec = !hasSteam && !hasWater && !hasGas && !selectedEq.mediumTag.includes('油')

  // 设备切换时自适应校正能源类型：若新设备不含蒸汽则自动切回电力
  React.useEffect(() => {
    if (energyType === 'steam' && !hasSteam) {
      setEnergyType('elec')
    }
  }, [selectedEqId, hasSteam, energyType])

  const basePower = selectedEq.powerKW || 4680
  const baseSteam = selectedEq.steamFlowT || 1.85

  // 🌟 直接基于全局标准的 ENTERPRISE_TREE_DATA 构建 4 级树，保证 3 级单位名称与企业组织拓扑 100% 绝对一致
  // 🌟 园区模式下的 4 级树状结构
  const parkRootNode = PARK_ORG_TREE_DATA[0]
  const standardParks = parkRootNode?.children || []
  const rootNode = ENTERPRISE_TREE_DATA[0]
  const standardCompanies = rootNode?.children || []

  // =========================================================================
  // 1. 【电】+【日】：15分钟高频功率曲线 (标注最大最小值) & 峰平谷 (总饼图 + 分日堆叠图)
  // =========================================================================
  const elecDayPowerData = useMemo(() => {
    const points: Array<{ time: string; 实时功率: number }> = []
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
          实时功率: kw,
        })
      }
    }
    return points
  }, [])

  // 电-日：峰平谷总饼图数据
  const elecDayDonutData = useMemo(() => {
    const totalKWh = selectedEq.energyKWh || 112340
    return [
      { name: '尖峰电量', value: Math.round(totalKWh * 0.164), color: '#f5222d', ratio: '16.4%' },
      { name: '高峰电量', value: Math.round(totalKWh * 0.411), color: '#fa8c16', ratio: '41.1%' },
      { name: '平段电量', value: Math.round(totalKWh * 0.289), color: '#1677ff', ratio: '28.9%' },
      { name: '低谷电量', value: Math.round(totalKWh * 0.136), color: '#52c41a', ratio: '13.6%' },
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
      { name: '尖峰电量', value: Math.round(totalMonthKWh * 0.172), color: '#f5222d', ratio: '17.2%' },
      { name: '高峰电量', value: Math.round(totalMonthKWh * 0.418), color: '#fa8c16', ratio: '41.8%' },
      { name: '平段电量', value: Math.round(totalMonthKWh * 0.282), color: '#1677ff', ratio: '28.2%' },
      { name: '低谷电量', value: Math.round(totalMonthKWh * 0.128), color: '#10b981', ratio: '12.8%' },
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
      <aside className="w-[270px] min-w-[270px] max-w-[270px] shrink-0 sticky top-0 bg-card rounded-xl border border-border shadow-xs flex flex-col h-[calc(100vh-84px)] overflow-hidden">
        {/* 搜索与树标题 */}
        <div className="p-3 border-b border-border/60 space-y-2 bg-card shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Cpu className="size-4 text-primary" />
              企业及重点设备拓扑 (4级)
            </span>
            <span className="text-[10px] font-medium bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded">
              设备感知
            </span>
          </div>

          <div className="relative">
            <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={eqSearchKw}
              onChange={(e) => setEqSearchKw(e.target.value)}
              placeholder="搜索企业 / 重点设备..."
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-panel border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* 树节点内容 (自适应滚动) */}
        <div className="p-2 overflow-y-auto flex-1 text-xs font-sans space-y-1.5 custom-scrollbar">
          {/* 1级节点：电装集团 (支持点击展开/收起) */}
          <div
            onClick={() => setIsRootCollapsed(!isRootCollapsed)}
            className="flex items-center gap-1.5 py-1 px-1.5 rounded bg-primary/20 text-primary font-bold cursor-pointer hover:bg-primary/30 transition-colors select-none"
            title="点击收起/展开下级组织与重点设备"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsRootCollapsed(!isRootCollapsed)
              }}
              className="size-4 flex items-center justify-center text-primary hover:text-primary/80 shrink-0 cursor-pointer"
            >
              {isRootCollapsed ? (
                <ChevronRight className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
            <Building2 className="size-3.5 shrink-0 text-primary" />
            <span className="flex-1 truncate">{rootNode?.name || '电装集团'}</span>
          </div>

          {/* 1级节点展开后的 2级经营单位列表 (与 ENTERPRISE_TREE_DATA 严格对齐) */}
          {!isRootCollapsed && (
            <div className="border-l border-border/60 ml-3.5 pl-2 space-y-1">
              {standardCompanies.map((compNode) => {
                const compName = compNode.name
                const enterprises = compNode.children || []

                // 搜索过滤匹配
                const matchedEnterprises = enterprises.map((ent) => {
                  const filteredEqs = KEY_EQUIPMENT_LIST.filter(
                    (e) =>
                      (treeType === 'enterprise' ? e.company === compName : true) &&
                      (e.enterprise.includes(ent.name.slice(0, 4)) || ent.name.includes(e.enterprise.slice(0, 4))) &&
                      (!eqSearchKw.trim() ||
                        e.name.toLowerCase().includes(eqSearchKw.trim().toLowerCase()) ||
                        e.code.toLowerCase().includes(eqSearchKw.trim().toLowerCase()) ||
                        ent.name.includes(eqSearchKw.trim()) ||
                        compName.includes(eqSearchKw.trim()))
                  )
                  return {
                    name: ent.name,
                    id: ent.id,
                    badge: ent.badge,
                    equipments: filteredEqs,
                    isMatched: !eqSearchKw.trim() || ent.name.includes(eqSearchKw.trim()) || compName.includes(eqSearchKw.trim()) || filteredEqs.length > 0
                  }
                }).filter((ent) => ent.isMatched)

                if (eqSearchKw.trim() && matchedEnterprises.length === 0) return null

                const isCompanyCollapsed = !eqSearchKw.trim() && Boolean(collapsedCompanies[compName])

                return (
                  <div key={compNode.id} className="space-y-0.5">
                    {/* 2级节点：各经营单位 / 所属园区 (支持点击展开/收起) */}
                    <div
                      onClick={() => toggleCompanyCollapse(compName)}
                      className="flex items-center gap-1.5 py-1 px-1.5 rounded text-foreground font-bold hover:bg-accent/40 cursor-pointer select-none transition-colors"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCompanyCollapse(compName)
                        }}
                        className="size-3.5 flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                      >
                        {isCompanyCollapsed ? (
                          <ChevronRight className="size-3 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-3 text-muted-foreground" />
                        )}
                      </button>
                      <span className="flex-1 truncate" title={compName}>{compName}</span>
                    </div>

                    {/* 2级节点展开后的 3级企业级单位列表 (与 ENTERPRISE_TREE_DATA 100% 绝对一致) */}
                    {!isCompanyCollapsed && (
                      <div className="border-l border-border/60 ml-3 pl-2 space-y-1">
                        {matchedEnterprises.map((ent) => {
                          const entName = ent.name
                          const hasEqs = ent.equipments.length > 0
                          const isEntCollapsed = !eqSearchKw.trim() && Boolean(collapsedEnterprises[entName])

                          return (
                            <div key={ent.id} className="space-y-0.5">
                              {/* 3级节点：企业级单位 (支持点击展开/收起) */}
                              <div
                                onClick={() => toggleEnterpriseCollapse(entName)}
                                className="flex items-center gap-1 py-0.5 px-1 rounded text-muted-foreground font-semibold hover:bg-accent/40 cursor-pointer select-none transition-colors text-[11.5px]"
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleEnterpriseCollapse(entName)
                                  }}
                                  className="size-3 flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                                >
                                  {isEntCollapsed ? (
                                    <ChevronRight className="size-2.5 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="size-2.5 text-muted-foreground" />
                                  )}
                                </button>
                                <Factory className="size-3 text-muted-foreground shrink-0" />
                                <span className="flex-1 truncate" title={entName}>{entName}</span>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  ({ent.equipments.length})
                                </span>
                              </div>

                              {/* 4级节点：重点设备列表 */}
                              {!isEntCollapsed && (
                                <div className="border-l border-border/60 ml-2.5 pl-2 space-y-0.5">
                                  {hasEqs ? (
                                    ent.equipments.map((eq) => {
                                      const isSelected = selectedEqId === eq.id
                                      return (
                                        <div
                                          key={eq.id}
                                          onClick={() => setSelectedEqId(eq.id)}
                                          className={cn(
                                            'flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition-colors text-[11px] group',
                                            isSelected
                                              ? 'bg-primary/20 text-primary font-bold shadow-2xs border border-primary/30'
                                              : 'hover:bg-accent/40 text-muted-foreground'
                                          )}
                                        >
                                          <div className="flex items-center gap-1.5 truncate">
                                            <Cpu className={cn('size-3 shrink-0', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                                            <span className="truncate" title={eq.name}>
                                              {eq.name}
                                            </span>
                                          </div>
                                          <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" title="在线运行" />
                                        </div>
                                      )
                                    })
                                  ) : (
                                    <div className="py-0.5 px-2 text-[10.5px] text-muted-foreground font-sans italic">
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
        </div>
      </aside>

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 1. 顶部 Header */}
        <OnlineHeader />

        {/* 2. 选中设备主卡片 (根据设备上传的数据类型动态呈现：区分电 / 蒸汽) */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Cpu className="size-4 text-primary" />
              </div>
              <h2 className="text-sm font-bold text-foreground">
                {selectedEq.name}
              </h2>
            </div>

            {/* 右侧：数据卡片视角切换 (支持区分电 / 蒸汽) */}
            <div>
              {hasSteam ? (
                <div className="flex items-center gap-1 bg-panel p-1 rounded-lg border border-border text-[11px]">
                  <span className="text-muted-foreground mr-1 text-[10.5px]">卡片指标切换:</span>
                  <button
                    type="button"
                    onClick={() => setEnergyType('elec')}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                      energyType === 'elec'
                        ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Zap className="size-3" /> 电力数据
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnergyType('steam')}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                      energyType === 'steam'
                        ? 'bg-purple-600 text-white font-bold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Wind className="size-3" /> 蒸汽数据
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-panel border border-border text-muted-foreground text-[11px] font-medium flex items-center gap-1.5">
                    <Zap className="size-3 text-primary" />
                    纯电设备 · 仅采集电力与负荷参数
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 数据统计卡片 (根据设备上传的数据类型显示对应指标：区分 电 或者 蒸汽) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {/* 🌟 模式 A：查看【电力数据】（大部分设备仅使用电力，聚焦电力与功率） */}
            {energyType === 'elec' ? (
              <>
                {/* 1. 实时有功功率 */}
                <div className="p-3 bg-panel rounded-xl border border-border space-y-1">
                  <div className="text-xs text-primary font-sans flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold">
                      <Zap className="size-3 text-primary" />
                      实时有功功率
                    </span>
                    <span className="text-[10px] text-primary/80 bg-primary/10 px-1 rounded font-mono">电力</span>
                  </div>
                  <div className="text-2xl font-extrabold text-primary">
                    {selectedEq.powerKW?.toLocaleString()} <span className="text-xs font-normal text-muted-foreground font-sans">kW</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                    <span className="text-muted-foreground">同比</span>
                    <span className={cn('font-bold font-mono', (selectedEq.powerYoy || '-4.2%').includes('+') ? 'text-rose-400' : 'text-emerald-400')}>
                      {selectedEq.powerYoy || '-4.2% ↓'}
                    </span>
                  </div>
                </div>

                {/* 2. 当月累计用电量 */}
                <div className="p-3 bg-panel rounded-xl border border-border space-y-1">
                  <div className="text-xs text-emerald-400 font-sans flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold">
                      <Zap className="size-3 text-emerald-400" />
                      当月累计用电量
                    </span>
                    <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1 rounded font-mono">用电</span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400">
                    {selectedEq.energyKWh?.toLocaleString()} <span className="text-xs font-normal text-muted-foreground font-sans">kWh</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                    <span className="text-muted-foreground">同比</span>
                    <span className={cn('font-bold font-mono', (selectedEq.energyYoy || '-3.8%').includes('+') ? 'text-rose-400' : 'text-emerald-400')}>
                      {selectedEq.energyYoy || '-3.8% ↓'}
                    </span>
                  </div>
                </div>

                {/* 3. 当日累计用电量 */}
                <div className="p-3 bg-panel rounded-xl border border-border space-y-1">
                  <div className="text-xs text-cyan-400 font-sans flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold">
                      <Activity className="size-3 text-cyan-400" />
                      当日累计用电量
                    </span>
                    <span className="text-[10px] text-cyan-400/80 bg-cyan-500/10 px-1 rounded font-mono">今日</span>
                  </div>
                  <div className="text-2xl font-extrabold text-cyan-400">
                    {(selectedEq.todayEnergyKWh || Math.round(selectedEq.energyKWh / 28 * 0.95)).toLocaleString()}{' '}
                    <span className="text-xs font-normal text-muted-foreground font-sans">kWh</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                    <span className="text-muted-foreground">峰段占比</span>
                    <span className="font-bold text-foreground font-mono">64.2% (避峰达标)</span>
                  </div>
                </div>

                {/* 4. 运行功率因数 / 负荷率 */}
                <div className="p-3 bg-panel rounded-xl border border-border space-y-1">
                  <div className="text-xs text-amber-400 font-sans flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold">
                      <Layers className="size-3 text-amber-400" />
                      功率因数 / 负荷率
                    </span>
                    <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1 rounded font-mono">工况</span>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400">
                    cosφ {selectedEq.powerFactor || 0.96}{' '}
                    <span className="text-xs font-normal text-muted-foreground font-sans">/ {selectedEq.loadRate || 82.5}%</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                    <span className="text-muted-foreground">电能品质</span>
                    <span className="font-bold text-emerald-400 font-mono">优良 (≥0.95考核达标)</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 🌟 模式 B：查看【蒸汽数据】（管道工作压力已按要求改为蒸汽消耗量） */}
                {/* 1. 瞬时蒸汽流量 */}
                <div className="p-3 bg-panel rounded-xl border border-border space-y-1">
                  <div className="text-xs text-purple-400 font-sans flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold">
                      <Wind className="size-3 text-purple-400" />
                      瞬时蒸汽流量
                    </span>
                    <span className="text-[10px] text-purple-400/80 bg-purple-500/10 px-1 rounded font-mono">流量</span>
                  </div>
                  <div className="text-2xl font-extrabold text-purple-400">
                    {selectedEq.steamFlowT || 1.85} <span className="text-xs font-normal text-muted-foreground font-sans">t/h</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                    <span className="text-muted-foreground">同比</span>
                    <span className={cn('font-bold font-mono', (selectedEq.flowYoy || '-5.1%').includes('+') ? 'text-rose-400' : 'text-emerald-400')}>
                      {selectedEq.flowYoy || '-5.1% ↓'}
                    </span>
                  </div>
                </div>

                {/* 2. 蒸汽消耗量 (原：管道工作压力 改为 蒸汽消耗量) */}
                <div className="p-3 bg-panel rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-1">
                  <div className="text-xs text-purple-300 font-sans flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold">
                      <Wind className="size-3 text-purple-400" />
                      蒸汽消耗量
                    </span>
                    <span className="text-[10px] text-purple-300 bg-purple-500/20 px-1 rounded font-mono">当月累计</span>
                  </div>
                  <div className="text-2xl font-extrabold text-purple-400">
                    {(selectedEq.steamUsageT || Math.round((selectedEq.steamFlowT || 1.85) * 24 * 28 * 0.72)).toLocaleString()}{' '}
                    <span className="text-xs font-normal text-muted-foreground font-sans">t (吨)</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                    <span className="text-muted-foreground">同比</span>
                    <span className="font-bold text-emerald-400 font-mono">-3.6% ↓</span>
                  </div>
                </div>

                {/* 3. 当日累计蒸汽消耗量 */}
                <div className="p-3 bg-panel rounded-xl border border-border space-y-1">
                  <div className="text-xs text-cyan-400 font-sans flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold">
                      <Activity className="size-3 text-cyan-400" />
                      当日蒸汽消耗量
                    </span>
                    <span className="text-[10px] text-cyan-400/80 bg-cyan-500/10 px-1 rounded font-mono">今日</span>
                  </div>
                  <div className="text-2xl font-extrabold text-cyan-400">
                    {(selectedEq.todaySteamT || Number(((selectedEq.steamFlowT || 1.85) * 18.2).toFixed(1))).toLocaleString()}{' '}
                    <span className="text-xs font-normal text-muted-foreground font-sans">t</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                    <span className="text-muted-foreground">环比</span>
                    <span className="font-bold text-emerald-400 font-mono">-1.2% ↓</span>
                  </div>
                </div>

                {/* 4. 供汽管道压力与温度 */}
                <div className="p-3 bg-panel rounded-xl border border-border space-y-1">
                  <div className="text-xs text-amber-400 font-sans flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold">
                      <Flame className="size-3 text-amber-400" />
                      供汽管道压力与温度
                    </span>
                    <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1 rounded font-mono">管网</span>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400">
                    {selectedEq.pressureMpa ?? '0.005'} <span className="text-xs font-normal text-muted-foreground font-sans">MPa</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-sans">
                    <span className="text-muted-foreground">蒸汽温度</span>
                    <span className="font-bold text-foreground font-mono">{selectedEq.temperatureC ?? 135.2}°C</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. 核心图表控制栏：能源类型选择 (电 / 蒸汽) + 时间维度切换 (日 / 月) */}
        <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* 左侧：能源类型切换 (支持根据设备实际数据介质自适应显示) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEnergyType('elec')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shadow-xs',
                energyType === 'elec'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-panel text-muted-foreground hover:text-foreground border border-border'
              )}
            >
              <Zap className="size-3.5" />
              <span>电力监测 (电)</span>
            </button>

            {hasSteam ? (
              <button
                type="button"
                onClick={() => setEnergyType('steam')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shadow-xs',
                  energyType === 'steam'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-panel text-muted-foreground hover:text-foreground border border-border'
                )}
              >
                <Wind className="size-3.5" />
                <span>蒸汽监测 (汽)</span>
              </button>
            ) : (
              <span className="text-[11px] text-muted-foreground pl-1">
                (该设备仅使用电力，未接入蒸汽回路)
              </span>
            )}
          </div>

          {/* 右侧：日/月 维度切换与日期选择 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-panel p-0.5 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setTimeDim('day')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'day'
                    ? 'font-bold bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                按日监测 (日)
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'month'
                    ? 'font-bold bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                按月监测 (月)
              </button>
            </div>

            {/* 日期选择器 */}
            {timeDim === 'day' ? (
              <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
                <Calendar className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground font-sans">监测日期:</span>
                <input
                  type="date"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="bg-transparent border-0 text-foreground font-mono text-xs focus:outline-none cursor-pointer"
                />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
                <Calendar className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground font-sans">监测月份:</span>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent border-0 text-foreground font-mono text-xs focus:outline-none cursor-pointer"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => alert(`正在导出【${selectedEq.name}】运行监测数据...`)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 4. 核心图表区域 (根据 电/汽 和 日/月 动态切换 4 种视图) */}

        {/* ========================================================================= */}
        {/* 模式 1: 【电】+【日】                                                     */}
        {/* ========================================================================= */}
        {energyType === 'elec' && timeDim === 'day' && (
          <div className="space-y-3.5">
            {/* 15分钟实时有功功率负荷连续曲线 */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    15分钟实时有功功率负荷走势
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-rose-500" /> 最大值: 4,850 kW (11:15)
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-500" /> 最小值: 2,120 kW (03:30)
                  </span>
                  <span className="text-muted-foreground font-sans">
                    平均: 3,728 kW
                  </span>
                  <button
                    type="button"
                    onClick={() => alert('正在导出 15分钟功率负荷曲线数据...')}
                    className="flex items-center gap-1 text-primary hover:underline font-sans cursor-pointer"
                  >
                    <Download className="size-3" />
                    导出曲线
                  </button>
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
                    { key: '实时功率', name: '实时有功功率 (kW)', color: '#1677ff' },
                  ]}
                />
              </div>
            </div>

            {/* 峰平谷电量 (总饼图 + 分日堆叠图) */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    当日用电峰平谷构成分析与时段负荷
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => alert('正在导出当日峰平谷分时台账...')}
                  className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer font-sans"
                >
                  <Download className="size-3" />
                  导出分时数据
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* 左侧 4/12: 峰平谷总饼图 */}
                <div className="lg:col-span-4 border border-border rounded-xl p-3 bg-panel space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <PieIcon className="size-3.5 text-amber-400" />
                      当日峰平谷电量总占比
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      总电量: {selectedEq.energyKWh?.toLocaleString()} kWh
                    </span>
                  </div>
                  <div className="h-[210px]">
                    <Donut
                      data={elecDayDonutData}
                      valueKey="value"
                      nameKey="name"
                      height={210}
                      unit="kWh"
                    />
                  </div>
                </div>

                {/* 右侧 8/12: 逐时段分时峰平谷堆叠柱状图 */}
                <div className="lg:col-span-8 border border-border rounded-xl p-3 bg-panel space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <BarChart3 className="size-3.5 text-primary" />
                      逐时段峰平谷电量堆叠 (kWh)
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      尖/峰/平/谷 分色堆叠
                    </span>
                  </div>
                  <div className="h-[210px]">
                    <BarChartGroup
                      data={elecDayStackedBarData}
                      xKey="time"
                      height={210}
                      stacked
                      bars={[
                        { key: '尖峰', name: '尖峰电量', color: '#f5222d' },
                        { key: '峰段', name: '高峰电量', color: '#fa8c16' },
                        { key: '平段', name: '平段电量', color: 'oklch(0.72 0.18 210)' },
                        { key: '谷段', name: '低谷电量', color: '#10b981' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 模式 2: 【电】+【月】                                                     */}
        {/* ========================================================================= */}
        {energyType === 'elec' && timeDim === 'month' && (
          <div className="space-y-3.5">
            {/* 每日最大功率连续走势曲线 */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-bold text-foreground">
                    【{selectedEq.name}】{selectedMonth} 每日最大有功功率走势曲线 (标注最大最小值 / kW)
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-rose-500" /> 月最大值: 5,120 kW (15日)
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-500" /> 月最小值: 2,860 kW (03日)
                  </span>
                  <span className="text-muted-foreground font-sans">
                    月平均最大: 4,320 kW
                  </span>
                  <button
                    type="button"
                    onClick={() => alert('正在导出月度每日最大功率数据...')}
                    className="flex items-center gap-1 text-primary hover:underline font-sans cursor-pointer"
                  >
                    <Download className="size-3" />
                    导出数据
                  </button>
                </div>
              </div>

              <div className="h-[250px]">
                <LineTrend
                  data={elecMonthMaxPowerData}
                  xKey="day"
                  height={250}
                  yUnit="kW"
                  lines={[
                    { key: '每日最大功率', name: '每日最大功率 (kW)', color: '#1677ff' },
                  ]}
                />
              </div>
            </div>

            {/* 峰平谷电量 (总饼图 + 分月分日堆叠图) */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    【{selectedEq.name}】{selectedMonth} 月度累计峰平谷构成分析与分日用电堆叠分布
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => alert('正在导出月度分日峰平谷数据...')}
                  className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer font-sans"
                >
                  <Download className="size-3" />
                  导出月度台账
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* 左侧 4/12: 月度峰平谷总饼图 */}
                <div className="lg:col-span-4 border border-border rounded-xl p-3 bg-panel space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <PieIcon className="size-3.5 text-amber-400" />
                      月度峰平谷累计总占比
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      月总电量: {Math.round((selectedEq.energyKWh || 112340) * 25.1).toLocaleString()} kWh
                    </span>
                  </div>
                  <div className="h-[210px]">
                    <Donut
                      data={elecMonthDonutData}
                      valueKey="value"
                      nameKey="name"
                      height={210}
                      unit="kWh"
                    />
                  </div>
                </div>

                {/* 右侧 8/12: 1日~31日分日峰平谷堆叠柱状图 */}
                <div className="lg:col-span-8 border border-border rounded-xl p-3 bg-panel space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <BarChart3 className="size-3.5 text-primary" />
                      1日~31日 分日峰平谷用电量堆叠 (kWh)
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      按日连续分时统计
                    </span>
                  </div>
                  <div className="h-[210px]">
                    <BarChartGroup
                      data={elecMonthStackedBarData}
                      xKey="day"
                      height={210}
                      stacked
                      bars={[
                        { key: '尖峰', name: '尖峰电量', color: '#f5222d' },
                        { key: '峰段', name: '高峰电量', color: '#fa8c16' },
                        { key: '平段', name: '平段电量', color: 'oklch(0.72 0.18 210)' },
                        { key: '谷段', name: '低谷电量', color: '#10b981' },
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
        {energyType === 'steam' && timeDim === 'day' && (
          <div className="space-y-3.5">
            {/* 瞬时蒸汽流量连续走势曲线 */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-purple-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    当日瞬时蒸汽流量走势曲线
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-rose-500" /> 最大流量: 2.35 t/h (10:00)
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-500" /> 最小流量: 0.62 t/h (04:00)
                  </span>
                  <span className="text-muted-foreground font-sans">
                    平均流量: 1.82 t/h
                  </span>
                  <button
                    type="button"
                    onClick={() => alert('正在导出当日瞬时流量曲线...')}
                    className="flex items-center gap-1 text-purple-400 hover:underline font-sans cursor-pointer"
                  >
                    <Download className="size-3" />
                    导出数据
                  </button>
                </div>
              </div>

              <div className="h-[250px]">
                <LineTrend
                  data={steamDayFlowData}
                  xKey="time"
                  height={250}
                  yUnit="t/h"
                  lines={[
                    { key: '瞬时流量', name: '瞬时蒸汽流量 (t/h)', color: '#9333ea' },
                  ]}
                />
              </div>
            </div>

            {/* 逐时蒸汽累计消耗走势 (AreaTrend 面积图) */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-indigo-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    当日逐时蒸汽累计消耗量连续走势
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
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
                    { key: '当日累计', name: '当日累计蒸汽用量 (t)', color: '#6366f1' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 模式 4: 【蒸汽】+【月】                                                   */}
        {/* ========================================================================= */}
        {energyType === 'steam' && timeDim === 'month' && (
          <div className="space-y-3.5">
            {/* 每日最大蒸汽流量连续走势曲线 */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-purple-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    【{selectedEq.name}】{selectedMonth} 每日最大蒸汽流量走势曲线 (标注最大最小值 / t/h)
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-rose-500" /> 月最大流量: 2.68 t/h (18日)
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-500" /> 月最小流量: 0.85 t/h (04日)
                  </span>
                  <span className="text-muted-foreground font-sans">
                    月平均最大: 2.15 t/h
                  </span>
                  <button
                    type="button"
                    onClick={() => alert('正在导出月度每日最大流量数据...')}
                    className="flex items-center gap-1 text-purple-400 hover:underline font-sans cursor-pointer"
                  >
                    <Download className="size-3" />
                    导出数据
                  </button>
                </div>
              </div>

              <div className="h-[250px]">
                <LineTrend
                  data={steamMonthMaxFlowData}
                  xKey="day"
                  height={250}
                  yUnit="t/h"
                  lines={[
                    { key: '每日最大流量', name: '每日最大流量 (t/h)', color: '#9333ea' },
                  ]}
                />
              </div>
            </div>

            {/* 每日累计蒸汽用量柱状图 */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-purple-400" />
                  <h3 className="text-xs font-bold text-foreground">
                    【{selectedEq.name}】{selectedMonth} 1日~31日每日蒸汽累计消耗分布 (t/日)
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  月总消耗量: 1,028.5 t
                </span>
              </div>

              <div className="h-[220px]">
                <BarChartGroup
                  data={steamMonthDailyAccumulatedData}
                  xKey="day"
                  height={220}
                  bars={[
                    { key: '蒸汽用量', name: '日蒸汽用量 (t)', color: '#a855f7' },
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


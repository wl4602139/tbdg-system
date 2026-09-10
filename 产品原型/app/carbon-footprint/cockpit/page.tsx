'use client'

import { useState, useMemo, Fragment } from 'react'
import {
  Zap,
  Cable,
  Boxes,
  BatteryCharging,
  Activity,
  Layers,
  Radio,
  Cpu,
  Layers2,
  Sparkles,
  Package,
  Factory,
  Truck,
  Recycle,
  Scale,
  Calendar,
  Tag,
  ChevronRight,
  LayoutGrid,
  List,
  BarChart2,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Panel, PanelTitle } from '@/components/shared/primitives'

/* 11 种权威工业装备产品数据模型（含丰富细分类别及型号对比数据） */
export interface SubProductItem {
  name: string
  subCategory: string
  spec: string
  carbon: string
  carbonValue: number
  deltaPct: string
  isLower: boolean
  stages: { material: number; produce: number; transport: number; waste: number }
  materials: string
}

export interface ProductTypeItem {
  id: string
  name: string
  code: string
  icon: typeof Zap
  modelCount: number
  unitCarbon: string
  unitValue: number
  unitLabel: string
  primaryMaterials: string
  stages: {
    material: number
    produce: number
    transport: number
    waste: number
  }
  subModels: SubProductItem[]
}

const PRODUCTS_11: ProductTypeItem[] = [
  {
    id: 'transformer',
    name: '变压器',
    code: 'XFMR',
    icon: Zap,
    modelCount: 28,
    unitCarbon: '142.6',
    unitValue: 142.6,
    unitLabel: 'kgCO₂e/kVA',
    primaryMaterials: '高导磁取向硅钢片、无氧铜绕组、特级变压器绝缘油',
    stages: { material: 68, produce: 19, transport: 8, waste: 5 },
    subModels: [
      {
        name: 'S22-M-400/10',
        subCategory: '配电变压器',
        spec: '10kV 节能配电级油浸变压器',
        carbon: '88.4 kgCO₂e/kVA',
        carbonValue: 88.4,
        deltaPct: '-38.0%',
        isLower: true,
        stages: { material: 66, produce: 21, transport: 8, waste: 5 },
        materials: '高牌号取向硅钢片、电解铜导体、绝缘油',
      },
      {
        name: 'SCB13-1600/35',
        subCategory: '干式变压器',
        spec: '35kV 环氧树脂浇注干式变压器',
        carbon: '112.5 kgCO₂e/kVA',
        carbonValue: 112.5,
        deltaPct: '-21.1%',
        isLower: true,
        stages: { material: 64, produce: 23, transport: 8, waste: 5 },
        materials: '环氧浇注树脂、无氧铜导线、硅钢叠铁心',
      },
      {
        name: 'SFZ11-110/50000',
        subCategory: '电力变压器',
        spec: '110kV 三相双绕组有载调压变压器',
        carbon: '135.2 kgCO₂e/kVA',
        carbonValue: 135.2,
        deltaPct: '-5.2%',
        isLower: true,
        stages: { material: 69, produce: 18, transport: 8, waste: 5 },
        materials: '优质冷轧硅钢片、电磁铜线、变压器油箱',
      },
      {
        name: 'SZ11-220/180000',
        subCategory: '主变压器',
        spec: '220kV 枢纽变电站级三相主变',
        carbon: '152.0 kgCO₂e/kVA',
        carbonValue: 152.0,
        deltaPct: '+6.6%',
        isLower: false,
        stages: { material: 70, produce: 17, transport: 8, waste: 5 },
        materials: '特高导磁取向硅钢、无氧铜排、特种绝缘件',
      },
      {
        name: 'ODFPS-1000/1000000',
        subCategory: '特高压变压器',
        spec: '1000kV 特高压交流自耦变压器',
        carbon: '178.5 kgCO₂e/kVA',
        carbonValue: 178.5,
        deltaPct: '+25.2%',
        isLower: false,
        stages: { material: 72, produce: 16, transport: 7, waste: 5 },
        materials: '高磁感 075 取向硅钢、耐电热导线、超纯绝缘油',
      },
    ],
  },
  {
    id: 'cable',
    name: '线缆',
    code: 'CBL',
    icon: Cable,
    modelCount: 36,
    unitCarbon: '3.82',
    unitValue: 3.82,
    unitLabel: 'kgCO₂e/m',
    primaryMaterials: '高纯无氧铜导体、电工圆铝线、交联聚乙烯 (XLPE)',
    stages: { material: 74, produce: 15, transport: 7, waste: 4 },
    subModels: [
      {
        name: 'WDZA-YJY-0.6/1-4×95',
        subCategory: '低压阻燃电缆',
        spec: '0.6/1kV 低烟无卤交联聚乙烯电缆',
        carbon: '2.15 kgCO₂e/m',
        carbonValue: 2.15,
        deltaPct: '-43.7%',
        isLower: true,
        stages: { material: 71, produce: 17, transport: 8, waste: 4 },
        materials: '无氧铜导体、低烟无卤阻燃聚烯烃',
      },
      {
        name: 'LGJ-400/35',
        subCategory: '架空导线',
        spec: '高压架空输电用钢芯铝绞线',
        carbon: '2.88 kgCO₂e/m',
        carbonValue: 2.88,
        deltaPct: '-24.6%',
        isLower: true,
        stages: { material: 77, produce: 13, transport: 6, waste: 4 },
        materials: '电工硬圆铝线、镀锌钢丝承力绞线',
      },
      {
        name: 'YJV22-8.7/15-3×400',
        subCategory: '中压电力电缆',
        spec: '8.7/15kV 钢带铠装中压交联电缆',
        carbon: '3.42 kgCO₂e/m',
        carbonValue: 3.42,
        deltaPct: '-10.5%',
        isLower: true,
        stages: { material: 73, produce: 16, transport: 7, waste: 4 },
        materials: '高纯铜绞线、XLPE 绝缘、双钢带铠装',
      },
      {
        name: 'YJLW03-64/110-1×630',
        subCategory: '高压输电电缆',
        spec: '110kV 单芯皱纹铝套高压交联电缆',
        carbon: '4.15 kgCO₂e/m',
        carbonValue: 4.15,
        deltaPct: '+8.6%',
        isLower: false,
        stages: { material: 75, produce: 14, transport: 7, waste: 4 },
        materials: '大截面铜导体、皱纹铝套防护层、超净绝缘料',
      },
      {
        name: 'YJLW03-127/220-1×1200',
        subCategory: '超高压电缆',
        spec: '220kV 超大容量超高压电力电缆',
        carbon: '5.62 kgCO₂e/m',
        carbonValue: 5.62,
        deltaPct: '+47.1%',
        isLower: false,
        stages: { material: 78, produce: 12, transport: 6, waste: 4 },
        materials: '分割导电铜芯、重型皱纹铝护套、特高洁净料',
      },
      {
        name: 'WDZ-KVVP-450/750-7×1.5',
        subCategory: '特种控制电缆',
        spec: '450/750V 铜芯低烟无卤屏蔽控制电缆',
        carbon: '1.98 kgCO₂e/m',
        carbonValue: 1.98,
        deltaPct: '-48.2%',
        isLower: true,
        stages: { material: 68, produce: 18, transport: 8, waste: 6 },
        materials: '电工纯铜导体、镀锡铜丝编织屏蔽层、阻燃护套',
      },
      {
        name: 'OPLC-0.6/1-3×120+16B1',
        subCategory: '光纤复合电缆',
        spec: '0.6/1kV 智能电网配电光纤复合低压电力电缆',
        carbon: '3.75 kgCO₂e/m',
        carbonValue: 3.75,
        deltaPct: '-1.8%',
        isLower: true,
        stages: { material: 72, produce: 17, transport: 7, waste: 4 },
        materials: '铜导体、无金属光纤通信单元、XLPE 绝缘层',
      },
      {
        name: 'BTTZ-750-4×25',
        subCategory: '矿物绝缘电缆',
        spec: '750V 重型刚性铜护套氧化镁矿物绝缘防火电缆',
        carbon: '4.85 kgCO₂e/m',
        carbonValue: 4.85,
        deltaPct: '+27.0%',
        isLower: false,
        stages: { material: 76, produce: 14, transport: 6, waste: 4 },
        materials: '实心纯铜导体、无机氧化镁绝缘粉、无缝铜管护套',
      },
    ],
  },
  {
    id: 'switchgear',
    name: '开关柜',
    code: 'SWG',
    icon: Boxes,
    modelCount: 18,
    unitCarbon: '86.5',
    unitValue: 86.5,
    unitLabel: 'kgCO₂e/面',
    primaryMaterials: '敷铝锌冷轧钢板、母线高导铜排、真空断路器核心件',
    stages: { material: 62, produce: 22, transport: 9, waste: 7 },
    subModels: [
      {
        name: 'XGN15-12',
        subCategory: '环网开关柜',
        spec: '12kV 环保型气体绝缘金属封闭环网柜',
        carbon: '76.8 kgCO₂e/面',
        carbonValue: 76.8,
        deltaPct: '-11.2%',
        isLower: true,
        stages: { material: 64, produce: 20, transport: 9, waste: 7 },
        materials: '敷铝锌钢板、环保洁净气体、微型真空断路器',
      },
      {
        name: 'KYN28A-12',
        subCategory: '中压中置柜',
        spec: '12kV 铠装移开式中置交流金属封闭柜',
        carbon: '82.4 kgCO₂e/面',
        carbonValue: 82.4,
        deltaPct: '-4.7%',
        isLower: true,
        stages: { material: 61, produce: 23, transport: 9, waste: 7 },
        materials: '高强度冷轧钢板、镀锡高导铜母排、复合绝缘件',
      },
      {
        name: 'MNS 2.0',
        subCategory: '低压抽出柜',
        spec: '0.4kV 低压多回路抽出式成套开关柜',
        carbon: '92.6 kgCO₂e/面',
        carbonValue: 92.6,
        deltaPct: '+7.1%',
        isLower: false,
        stages: { material: 60, produce: 24, transport: 9, waste: 7 },
        materials: '冷轧热浸镀锌钢板、多回路铜排组件、智能断路器',
      },
      {
        name: 'KYN61-40.5',
        subCategory: '高压开关柜',
        spec: '40.5kV 铠装移开式交流高压开关设备',
        carbon: '108.5 kgCO₂e/面',
        carbonValue: 108.5,
        deltaPct: '+25.4%',
        isLower: false,
        stages: { material: 63, produce: 21, transport: 9, waste: 7 },
        materials: '加厚覆铝锌钢板、大容量真空灭弧室、环氧固封极柱',
      },
    ],
  },
  {
    id: 'capacitor',
    name: '电容器',
    code: 'CAP',
    icon: BatteryCharging,
    modelCount: 12,
    unitCarbon: '24.8',
    unitValue: 24.8,
    unitLabel: 'kgCO₂e/kvar',
    primaryMaterials: '双面粗化聚丙烯薄膜、特纯铝箔电极、芳香烃浸渍介质油',
    stages: { material: 59, produce: 24, transport: 10, waste: 7 },
    subModels: [
      {
        name: 'BAM6.6-334-1W',
        subCategory: '并联电容器',
        spec: '6.6kV 单相高压全膜无污染并联电容器',
        carbon: '23.2 kgCO₂e/kvar',
        carbonValue: 23.2,
        deltaPct: '-6.5%',
        isLower: true,
        stages: { material: 58, produce: 25, transport: 10, waste: 7 },
        materials: '聚丙烯薄膜、特纯铝箔、环保浸渍油',
      },
      {
        name: 'BAM11/3-400-1W',
        subCategory: '集合式电容器',
        spec: '11kV 单相高压集合式并联电容器',
        carbon: '25.6 kgCO₂e/kvar',
        carbonValue: 25.6,
        deltaPct: '+3.2%',
        isLower: false,
        stages: { material: 60, produce: 23, transport: 10, waste: 7 },
        materials: '双面粗化膜、微孔铝电极箔、芳香烃介质',
      },
      {
        name: 'TBB10-6000/334-AK',
        subCategory: '成套补偿装置',
        spec: '10kV 框架式并联电容器成套补偿装置',
        carbon: '26.4 kgCO₂e/kvar',
        carbonValue: 26.4,
        deltaPct: '+6.5%',
        isLower: false,
        stages: { material: 59, produce: 24, transport: 10, waste: 7 },
        materials: '电容器组元件、串联电抗器、放电线圈',
      },
      {
        name: 'BAM35-500-1W',
        subCategory: '高压户外电容器',
        spec: '35kV 户外大容量高压集合式电容器',
        carbon: '28.2 kgCO₂e/kvar',
        carbonValue: 28.2,
        deltaPct: '+13.7%',
        isLower: false,
        stages: { material: 61, produce: 22, transport: 10, waste: 7 },
        materials: '优质耐候不锈钢箱体、特级绝缘介质材料',
      },
    ],
  },
  {
    id: 'reactor',
    name: '电抗器',
    code: 'RCT',
    icon: Activity,
    modelCount: 14,
    unitCarbon: '98.4',
    unitValue: 98.4,
    unitLabel: 'kgCO₂e/kVA',
    primaryMaterials: '优质取向硅钢片、特种耐温电磁线、大容量散热油箱',
    stages: { material: 66, produce: 20, transport: 8, waste: 6 },
    subModels: [
      {
        name: 'CKGKL-35-1200-6',
        subCategory: '干式限流电抗器',
        spec: '35kV 空心干式限流滤波电抗器',
        carbon: '88.6 kgCO₂e/kVA',
        carbonValue: 88.6,
        deltaPct: '-10.0%',
        isLower: true,
        stages: { material: 64, produce: 22, transport: 8, waste: 6 },
        materials: '多股绝缘铝导线、环氧玻璃纤维缠绕包封',
      },
      {
        name: 'BKS-334/10',
        subCategory: '铁心并联电抗器',
        spec: '10kV 铁心并联电抗器 (无功补偿)',
        carbon: '91.2 kgCO₂e/kVA',
        carbonValue: 91.2,
        deltaPct: '-7.3%',
        isLower: true,
        stages: { material: 65, produce: 21, transport: 8, waste: 6 },
        materials: '高导磁硅钢片、电磁铜线、散热片结构',
      },
      {
        name: 'BKD-20000/110',
        subCategory: '中压油浸电抗器',
        spec: '110kV 油浸式铁心并联电抗器',
        carbon: '96.8 kgCO₂e/kVA',
        carbonValue: 96.8,
        deltaPct: '-1.6%',
        isLower: true,
        stages: { material: 66, produce: 20, transport: 8, waste: 6 },
        materials: '分段铁心气隙饼、优质变压器绝缘油、铜绕组',
      },
      {
        name: 'BKD-60000/500',
        subCategory: '特高压电抗器',
        spec: '500kV 大容量油浸式并联电抗器',
        carbon: '102.5 kgCO₂e/kVA',
        carbonValue: 102.5,
        deltaPct: '+4.2%',
        isLower: false,
        stages: { material: 67, produce: 19, transport: 8, waste: 6 },
        materials: '特高压取向硅钢饼、耐高温绝缘纸、电磁铜排',
      },
    ],
  },
  {
    id: 'bushing',
    name: '套管',
    code: 'BSH',
    icon: Layers,
    modelCount: 15,
    unitCarbon: '45.2',
    unitValue: 45.2,
    unitLabel: 'kgCO₂e/支',
    primaryMaterials: '环氧玻纤缠绕绝缘芯体、硅橡胶复合绝缘伞裙、电工纯铝法兰',
    stages: { material: 55, produce: 27, transport: 11, waste: 7 },
    subModels: [
      {
        name: 'BRDLW-35/630',
        subCategory: '中压电容套管',
        spec: '35kV 环氧真空浸胶电容式变压器套管',
        carbon: '36.5 kgCO₂e/支',
        carbonValue: 36.5,
        deltaPct: '-19.2%',
        isLower: true,
        stages: { material: 53, produce: 29, transport: 11, waste: 7 },
        materials: '环氧浸胶纸芯体、铝合金安装法兰',
      },
      {
        name: 'BRDLW-110/1250',
        subCategory: '高压电容套管',
        spec: '110kV 油浸式胶浸纸变压器电容套管',
        carbon: '42.0 kgCO₂e/支',
        carbonValue: 42.0,
        deltaPct: '-7.1%',
        isLower: true,
        stages: { material: 54, produce: 28, transport: 11, waste: 7 },
        materials: '胶浸纸电容芯子、瓷绝缘外套管、导电铜管',
      },
      {
        name: 'BRPW-220/2000',
        subCategory: '复合绝缘套管',
        spec: '220kV 玻璃钢无油干式复合绝缘套管',
        carbon: '46.8 kgCO₂e/支',
        carbonValue: 46.8,
        deltaPct: '+3.5%',
        isLower: false,
        stages: { material: 56, produce: 26, transport: 11, waste: 7 },
        materials: '玻璃纤维浸胶芯子、高温硫化硅橡胶伞裙',
      },
      {
        name: 'GGF-550/3150',
        subCategory: '特高压GIS套管',
        spec: '550kV GIS 出线充气式复合绝缘套管',
        carbon: '51.5 kgCO₂e/支',
        carbonValue: 51.5,
        deltaPct: '+13.9%',
        isLower: false,
        stages: { material: 57, produce: 25, transport: 11, waste: 7 },
        materials: 'SF6充气绝缘管、超强耐候复合伞套、大口径铜导体',
      },
    ],
  },
  {
    id: 'ct-pt',
    name: '互感器',
    code: 'IT',
    icon: Radio,
    modelCount: 16,
    unitCarbon: '32.6',
    unitValue: 32.6,
    unitLabel: 'kgCO₂e/台',
    primaryMaterials: '环形超微晶纳米晶磁心、环氧树脂真空浇注体、一次铜排导电件',
    stages: { material: 58, produce: 25, transport: 10, waste: 7 },
    subModels: [
      {
        name: 'TG-10',
        subCategory: '户内浇注互感器',
        spec: '10kV 户内穿心式环氧浇注电流互感器',
        carbon: '18.5 kgCO₂e/台',
        carbonValue: 18.5,
        deltaPct: '-43.3%',
        isLower: true,
        stages: { material: 60, produce: 23, transport: 10, waste: 7 },
        materials: '环形纳米晶磁芯、环氧树脂浇注体、导电铜排',
      },
      {
        name: 'LB6-35',
        subCategory: '中压油浸互感器',
        spec: '35kV 户外油浸式全封闭电流互感器',
        carbon: '26.4 kgCO₂e/台',
        carbonValue: 26.4,
        deltaPct: '-19.0%',
        isLower: true,
        stages: { material: 57, produce: 26, transport: 10, waste: 7 },
        materials: '优质硅钢磁环、变压器油、高压绝缘瓷套',
      },
      {
        name: 'JDX6-110',
        subCategory: '高压电磁互感器',
        spec: '110kV 单相油浸电磁式高压电压互感器',
        carbon: '30.8 kgCO₂e/台',
        carbonValue: 30.8,
        deltaPct: '-5.5%',
        isLower: true,
        stages: { material: 57, produce: 26, transport: 10, waste: 7 },
        materials: '串级式硅钢铁心、电磁线圈、全密封膨胀器',
      },
      {
        name: 'LVQB-220W3',
        subCategory: '倒立式电流互感器',
        spec: '220kV 倒立式油浸电流互感器 (微机保护)',
        carbon: '34.2 kgCO₂e/台',
        carbonValue: 34.2,
        deltaPct: '+4.9%',
        isLower: false,
        stages: { material: 59, produce: 24, transport: 10, waste: 7 },
        materials: '顶部铸铝壳体、“U”型一次铜导杆、特级绝缘油',
      },
      {
        name: 'OIT-500',
        subCategory: '光学电子互感器',
        spec: '500kV 光纤传感全数字量电子式互感器',
        carbon: '38.6 kgCO₂e/台',
        carbonValue: 38.6,
        deltaPct: '+18.4%',
        isLower: false,
        stages: { material: 61, produce: 23, transport: 9, waste: 7 },
        materials: '传感光纤环、复合绝缘空心套管、低功耗数字采集模块',
      },
    ],
  },
  {
    id: 'gis',
    name: 'GIS',
    code: 'GIS',
    icon: Cpu,
    modelCount: 9,
    unitCarbon: '315.8',
    unitValue: 315.8,
    unitLabel: 'kgCO₂e/间隔',
    primaryMaterials: 'ZL104 铸造铝合金壳体、镀银高压触头铜件、SF6 环保洁净气体',
    stages: { material: 61, produce: 23, transport: 9, waste: 7 },
    subModels: [
      {
        name: 'ZF12-126(L)',
        subCategory: '中高压三相共箱 GIS',
        spec: '126kV 气体绝缘金属封闭全套开关设备',
        carbon: '286.0 kgCO₂e/间隔',
        carbonValue: 286.0,
        deltaPct: '-9.4%',
        isLower: true,
        stages: { material: 60, produce: 24, transport: 9, waste: 7 },
        materials: '铸造铝合金筒体、三相共箱母线、真空断路器单元',
      },
      {
        name: 'ZF27-252',
        subCategory: '超高压复合 GIS',
        spec: '252kV 复合绝缘三相共箱大容量 GIS',
        carbon: '324.5 kgCO₂e/间隔',
        carbonValue: 324.5,
        deltaPct: '+2.8%',
        isLower: false,
        stages: { material: 62, produce: 22, transport: 9, waste: 7 },
        materials: '厚壁铝合金气室、环保绝缘混合气体、镀银高导触头',
      },
      {
        name: 'ZF15-550',
        subCategory: '特高压分相式 GIS',
        spec: '550kV 特高压分相式单断口封闭电器',
        carbon: '365.2 kgCO₂e/间隔',
        carbonValue: 365.2,
        deltaPct: '+15.6%',
        isLower: false,
        stages: { material: 63, produce: 21, transport: 9, waste: 7 },
        materials: '特种挤压铝合金母线筒、高耐压盘式绝缘子、特高压极柱',
      },
    ],
  },
  {
    id: 'gil',
    name: 'GIL',
    code: 'GIL',
    icon: Scale,
    modelCount: 6,
    unitCarbon: '185.4',
    unitValue: 185.4,
    unitLabel: 'kgCO₂e/m',
    primaryMaterials: '优质 6063 挤压铝合金外管、高导纯铜管内导体、盘式环氧绝缘子',
    stages: { material: 67, produce: 19, transport: 9, waste: 5 },
    subModels: [
      {
        name: 'ZGL-252',
        subCategory: '高压刚性输电管',
        spec: '252kV 刚性气体绝缘输电线路 (地上架空)',
        carbon: '172.0 kgCO₂e/m',
        carbonValue: 172.0,
        deltaPct: '-7.2%',
        isLower: true,
        stages: { material: 66, produce: 20, transport: 9, waste: 5 },
        materials: '6063-T6 铝合金外壳、纯铜管状导体、环氧盆式绝缘子',
      },
      {
        name: 'ZGL-550',
        subCategory: '管廊大容量 GIL',
        spec: '550kV 地下综合管廊大容量刚性输电管',
        carbon: '196.5 kgCO₂e/m',
        carbonValue: 196.5,
        deltaPct: '+6.0%',
        isLower: false,
        stages: { material: 68, produce: 18, transport: 9, waste: 5 },
        materials: '厚壁铝合金外壳、大直径空心铝导体、环保气体混合介质',
      },
      {
        name: 'ZGL-1100',
        subCategory: '特高压跨江跨海 GIL',
        spec: '1100kV 特高压江底隧道刚性输电线路',
        carbon: '232.0 kgCO₂e/m',
        carbonValue: 232.0,
        deltaPct: '+25.1%',
        isLower: false,
        stages: { material: 70, produce: 17, transport: 8, waste: 5 },
        materials: '特厚防腐铝外壳、超大口径无缝铜管导体、特高绝缘件',
      },
    ],
  },
  {
    id: 'silicon-steel',
    name: '硅钢铁心',
    code: 'CRGO',
    icon: Layers2,
    modelCount: 8,
    unitCarbon: '1.85',
    unitValue: 1.85,
    unitLabel: 'tCO₂e/t',
    primaryMaterials: '高磁感取向冷轧电工钢卷 (085/080/075)、无机绝缘涂层',
    stages: { material: 78, produce: 14, transport: 5, waste: 3 },
    subModels: [
      {
        name: 'CRGO-075-3D',
        subCategory: '三相立体卷铁心',
        spec: '0.20mm 高磁感硅钢三相立体卷绕铁心',
        carbon: '1.76 tCO₂e/t',
        carbonValue: 1.76,
        deltaPct: '-4.9%',
        isLower: true,
        stages: { material: 77, produce: 15, transport: 5, waste: 3 },
        materials: '075 低损耗取向电工钢带、耐温自粘绝缘涂层',
      },
      {
        name: 'CRGO-085',
        subCategory: '叠片铁心',
        spec: '0.23mm 高牌号取向硅钢叠片铁心',
        carbon: '1.82 tCO₂e/t',
        carbonValue: 1.82,
        deltaPct: '-1.6%',
        isLower: true,
        stages: { material: 78, produce: 14, transport: 5, waste: 3 },
        materials: '高导磁 085 冷轧电工钢带、硅酸盐绝缘膜',
      },
      {
        name: 'CRGO-STEP-LAP',
        subCategory: '步进阶梯铁心',
        spec: '阶梯步进叠接低空载铁心 (大容量主变)',
        carbon: '1.92 tCO₂e/t',
        carbonValue: 1.92,
        deltaPct: '+3.8%',
        isLower: false,
        stages: { material: 79, produce: 13, transport: 5, waste: 3 },
        materials: '080 取向硅钢卷板、环保水性防锈绝缘胶',
      },
      {
        name: 'CRGO-095',
        subCategory: '常规配电铁心',
        spec: '0.27mm 常规牌号冷轧取向硅钢铁心',
        carbon: '1.95 tCO₂e/t',
        carbonValue: 1.95,
        deltaPct: '+5.4%',
        isLower: false,
        stages: { material: 80, produce: 12, transport: 5, waste: 3 },
        materials: '标准 095 电工钢片、磷酸盐无机涂层',
      },
    ],
  },
  {
    id: 'amorphous',
    name: '非晶合金铁心',
    code: 'AMOR',
    icon: Sparkles,
    modelCount: 5,
    unitCarbon: '1.42',
    unitValue: 1.42,
    unitLabel: 'tCO₂e/t',
    primaryMaterials: 'Fe-Si-B 铁基非晶合金超薄带材 (25μm)、特种浸渍固化树脂',
    stages: { material: 71, produce: 18, transport: 7, waste: 4 },
    subModels: [
      {
        name: '1K101-WOUND-3D',
        subCategory: '非晶立体卷铁心',
        spec: '三维立体卷绕式节能非晶合金铁心',
        carbon: '1.35 tCO₂e/t',
        carbonValue: 1.35,
        deltaPct: '-4.9%',
        isLower: true,
        stages: { material: 69, produce: 20, transport: 7, waste: 4 },
        materials: '25μm 铁基非晶合金超薄带、无溶剂浸渍固化胶',
      },
      {
        name: '1K101-AMOR-CORE',
        subCategory: '非晶四框五柱铁心',
        spec: '铁基非晶合金三相四框五柱式成套铁心',
        carbon: '1.38 tCO₂e/t',
        carbonValue: 1.38,
        deltaPct: '-2.8%',
        isLower: true,
        stages: { material: 70, produce: 19, transport: 7, waste: 4 },
        materials: '高磁感 Fe-Si-B 非晶超薄带、端部封胶环氧胶',
      },
      {
        name: '1K101-OPEN-CORE',
        subCategory: '开气隙非晶磁芯',
        spec: '高频开气隙非晶电抗器与滤波电感磁芯',
        carbon: '1.46 tCO₂e/t',
        carbonValue: 1.46,
        deltaPct: '+2.8%',
        isLower: false,
        stages: { material: 72, produce: 17, transport: 7, waste: 4 },
        materials: '非晶合金剪切带材、特种绝缘垫片、固定夹件',
      },
    ],
  },
]

const MONTHS = [
  '2025-09',
  '2025-10',
  '2025-11',
  '2025-12',
  '2026-01',
  '2026-02',
  '2026-03',
  '2026-04',
  '2026-05',
  '2026-06',
  '2026-07',
  '2026-08',
]

export default function CockpitPage() {
  const [from, setFrom] = useState('2026-01')
  const [to, setTo] = useState('2026-08')

  /* 显示模式切换状态：卡片 (card) 与 列表 (list) */
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')

  /* 11 种品类筛选状态：默认选中 'all'（全部品类），亦可点击任一独立品类 */
  const [activeCategory, setActiveCategory] = useState<string>('all')

  /* 列表模式展开查看明细的行 ID */
  const [expandedId, setExpandedId] = useState<string | null>(null)

  /* 细分类别对比弹窗选中的产品类型（null 表示关闭弹窗） */
  const [modalProduct, setModalProduct] = useState<ProductTypeItem | null>(null)

  /* 过滤出当前分类下的产品列表 */
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS_11
    return PRODUCTS_11.filter((p) => p.id === activeCategory)
  }, [activeCategory])

  return (
    <div className="flex flex-col gap-4">
      {/* ① 顶部标题栏 + 跨月时间维度筛选 */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-[linear-gradient(120deg,color-mix(in_oklch,var(--primary)_14%,var(--panel)),var(--panel))] px-4 py-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-primary" />
          <div>
            <h1 className="text-base font-semibold tracking-wide text-foreground">电装集团产品碳足迹总览</h1>
            
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">统计区间</span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-7 rounded-md border border-border bg-panel px-2 text-xs text-foreground outline-none focus:border-primary"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">至</span>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-7 rounded-md border border-border bg-panel px-2 text-xs text-foreground outline-none focus:border-primary"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ② 总体生命周期阶段构成对比（平台标准 4 列栅格 + 全周期分布能量流 + 4 大阶段指标卡） */}
      <Panel className="p-4" bodyClassName="flex flex-col gap-4">
        {/* 头部：标题栏与 4 阶段标准图例 */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            <h2 className="text-sm font-semibold text-foreground tracking-wide">
              全产品生命周期阶段总体构成对比
            </h2>
          </div>

          {/* 四阶段标准图例 */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-[#00b4d8]" /> 原材料获取
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-[#f59e0b]" /> 生产制造
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-[#10b981]" /> 原材料运输
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-[#8b5cf6]" /> 废弃物处理
            </span>
          </div>
        </div>

        {/* 全生命周期 4 大阶段加权构成贯穿分段流 (100% 全周期宏观分布) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>全周期加权阶段构成分布 (100%)</span>
            <span className="font-mono">加权综合单耗基准: <strong className="text-foreground">128.5 kgCO₂e</strong></span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary/80 shadow-inner">
            <div style={{ width: '66%', backgroundColor: '#00b4d8' }} title="原材料获取: 66.0%" />
            <div style={{ width: '20%', backgroundColor: '#f59e0b' }} title="生产制造: 20.0%" />
            <div style={{ width: '8%', backgroundColor: '#10b981' }} title="原材料运输: 8.0%" />
            <div style={{ width: '6%', backgroundColor: '#8b5cf6' }} title="废弃物处理: 6.0%" />
          </div>
        </div>

        {/* 4 大阶段标准工业指标卡 —— 4 列标准栅格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* 阶段 1：原材料获取 */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between transition-all hover:border-primary/60 hover:shadow-sm">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-border/60">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/20">
                    <Package className="size-4" />
                  </div>
                  <span>原材料获取</span>
                </div>
                <span className="rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[10px] font-mono text-primary font-semibold">
                  主导 66.0%
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-black tracking-tight text-foreground">66.0%</span>
                  <span className="text-xs font-normal text-muted-foreground font-sans">加权占比</span>
                </div>
                <div className="text-right font-mono text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">84.8</span> kgCO₂e
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/80">
                <div className="h-full rounded-full bg-[#00b4d8]" style={{ width: '66%' }} />
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-sans">
              <span>跨装备波动区间</span>
              <span className="font-mono font-bold text-foreground">55.0% ~ 78.0%</span>
            </div>
          </div>

          {/* 阶段 2：生产制造 */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between transition-all hover:border-primary/60 hover:shadow-sm">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
                    <Factory className="size-4" />
                  </div>
                  <span>生产制造</span>
                </div>
                <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono text-amber-500 font-semibold">
                  过程 20.0%
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-black tracking-tight text-foreground">20.0%</span>
                  <span className="text-xs font-normal text-muted-foreground font-sans">加权占比</span>
                </div>
                <div className="text-right font-mono text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">25.7</span> kgCO₂e
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/80">
                <div className="h-full rounded-full bg-[#f59e0b]" style={{ width: '20%' }} />
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-sans">
              <span>跨装备波动区间</span>
              <span className="font-mono font-bold text-foreground">14.0% ~ 27.0%</span>
            </div>
          </div>

          {/* 阶段 3：原材料运输 */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between transition-all hover:border-primary/60 hover:shadow-sm">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                    <Truck className="size-4" />
                  </div>
                  <span>原材料运输</span>
                </div>
                <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono text-emerald-500 font-semibold">
                  物流 8.0%
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-black tracking-tight text-foreground">8.0%</span>
                  <span className="text-xs font-normal text-muted-foreground font-sans">加权占比</span>
                </div>
                <div className="text-right font-mono text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">10.3</span> kgCO₂e
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/80">
                <div className="h-full rounded-full bg-[#10b981]" style={{ width: '8%' }} />
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-sans">
              <span>跨装备波动区间</span>
              <span className="font-mono font-bold text-foreground">5.0% ~ 11.0%</span>
            </div>
          </div>

          {/* 阶段 4：废弃物处理 */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between transition-all hover:border-primary/60 hover:shadow-sm">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20">
                    <Recycle className="size-4" />
                  </div>
                  <span>废弃物处理</span>
                </div>
                <span className="rounded bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 text-[10px] font-mono text-purple-500 font-semibold">
                  处置 6.0%
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-black tracking-tight text-foreground">6.0%</span>
                  <span className="text-xs font-normal text-muted-foreground font-sans">加权占比</span>
                </div>
                <div className="text-right font-mono text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">7.7</span> kgCO₂e
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/80">
                <div className="h-full rounded-full bg-[#8b5cf6]" style={{ width: '6%' }} />
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-sans">
              <span>跨装备波动区间</span>
              <span className="font-mono font-bold text-foreground">3.0% ~ 7.0%</span>
            </div>
          </div>
        </div>
      </Panel>

      {/* ③ 装备产品碳足迹细分类别构成 —— 支持【卡片模式】与【列表模式】切换 + 11 种权威产品分类 */}
      <Panel className="p-4" bodyClassName="flex flex-col gap-4">
        {/* 头部：标题、4 阶段图例与显示模式切换器 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PanelTitle
            title="装备产品碳足迹细分类别构成"
            subtitle="覆盖 11 种核心电工装备分类 · 全生命周期碳足迹核算与实测型号矩阵"
          />

          <div className="flex flex-wrap items-center gap-4">
            {/* 四阶段图例 */}
            <div className="hidden lg:flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-sm bg-[#00b4d8]" /> 原材料获取
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-sm bg-[#f59e0b]" /> 生产制造
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-sm bg-[#10b981]" /> 原材料运输
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2.5 rounded-sm bg-[#8b5cf6]" /> 废弃物处理
              </span>
            </div>

            {/* 显示模式切换器（卡片模式 / 列表模式） */}
            <div className="flex items-center rounded-lg border border-border bg-panel p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'card'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="切换为卡片视图"
              >
                <LayoutGrid className="size-3.5" />
                <span>卡片</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="切换为列表视图 (44px 工业表格)"
              >
                <List className="size-3.5" />
                <span>列表</span>
              </button>
            </div>
          </div>
        </div>

        {/* 11 种权威产品分类选择栏 */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-border/60 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`inline-flex items-center gap-1.5 h-7 rounded-md px-2.5 text-xs font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-secondary/60 border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-secondary'
              }`}
            >
              <span>全部分类</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  activeCategory === 'all'
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-panel text-muted-foreground'
                }`}
              >
                11
              </span>
            </button>

            {PRODUCTS_11.map((p) => {
              const isActive = activeCategory === p.id
              const IconComponent = p.icon
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveCategory(p.id)}
                  className={`inline-flex items-center gap-1.5 h-7 rounded-md px-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-secondary/60 border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <IconComponent className="size-3.5" />
                  <span>{p.name}</span>
                </button>
              )
            })}
          </div>

          
        </div>

        {/* 视图展现：卡片模式 (Card View) */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredProducts.map((p) => {
              const IconComponent = p.icon

              return (
                <div
                  key={p.id}
                  onClick={() => setModalProduct(p)}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs transition-all cursor-pointer hover:border-primary/70 hover:shadow-md hover:bg-card/90"
                >
                  <div>
                    {/* 1. 卡片头部：产品身份与综合碳足迹核心大指标一体化呈现 */}
                    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 transition-transform group-hover:scale-105">
                          <IconComponent className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-bold text-foreground truncate">{p.name}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">{p.modelCount} 款在录型号</div>
                        </div>
                      </div>

                      {/* 右侧核心物理量大字号直出 */}
                      <div className="text-right shrink-0">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-2xl font-black font-mono tracking-tight text-primary">{p.unitCarbon}</span>
                          <span className="text-xs font-mono font-semibold text-foreground/80">{p.unitLabel}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">综合碳足迹基准</div>
                      </div>
                    </div>

                    {/* 2. 生命周期四大阶段构成（全宽直观分段能量条 + 四列精准数值指示卡） */}
                    <div className="mt-3.5 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-foreground">生命周期阶段构成</span>
                        <span className="text-muted-foreground font-mono">原材料主导 ({p.stages.material}%)</span>
                      </div>

                      {/* 四阶段贯穿能量条 */}
                      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary/60">
                        <div style={{ width: `${p.stages.material}%`, backgroundColor: '#00b4d8' }} title={`原材料获取: ${p.stages.material}%`} />
                        <div style={{ width: `${p.stages.produce}%`, backgroundColor: '#f59e0b' }} title={`生产制造: ${p.stages.produce}%`} />
                        <div style={{ width: `${p.stages.transport}%`, backgroundColor: '#10b981' }} title={`原材料运输: ${p.stages.transport}%`} />
                        <div style={{ width: `${p.stages.waste}%`, backgroundColor: '#8b5cf6' }} title={`废弃物处理: ${p.stages.waste}%`} />
                      </div>

                      {/* 四阶段清晰数值指示卡 */}
                      <div className="grid grid-cols-4 gap-1.5 text-center">
                        <div className="rounded-md border border-[#00b4d8]/30 bg-[#00b4d8]/8 py-1.5 px-0.5">
                          <div className="text-[10px] text-muted-foreground truncate">原材料</div>
                          <div className="font-mono text-xs font-bold text-[#00b4d8]">{p.stages.material}%</div>
                        </div>
                        <div className="rounded-md border border-[#f59e0b]/30 bg-[#f59e0b]/8 py-1.5 px-0.5">
                          <div className="text-[10px] text-muted-foreground truncate">制造</div>
                          <div className="font-mono text-xs font-bold text-[#f59e0b]">{p.stages.produce}%</div>
                        </div>
                        <div className="rounded-md border border-[#10b981]/30 bg-[#10b981]/8 py-1.5 px-0.5">
                          <div className="text-[10px] text-muted-foreground truncate">运输</div>
                          <div className="font-mono text-xs font-bold text-[#10b981]">{p.stages.transport}%</div>
                        </div>
                        <div className="rounded-md border border-[#8b5cf6]/30 bg-[#8b5cf6]/8 py-1.5 px-0.5">
                          <div className="text-[10px] text-muted-foreground truncate">废弃</div>
                          <div className="font-mono text-xs font-bold text-[#8b5cf6]">{p.stages.waste}%</div>
                        </div>
                      </div>
                    </div>

                    {/* 3. 核心主要物料 */}
                    <div className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                      <span className="shrink-0 font-semibold text-foreground">核心主材：</span>
                      <span className="line-clamp-1">{p.primaryMaterials}</span>
                    </div>
                  </div>

                  {/* 4. 卡片下部：代表型号实测基准清单 + 弹窗触发对比按钮 */}
                  <div className="mt-3.5 border-t border-border/70 pt-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
                      <span className="flex items-center gap-1.5">
                        <Tag className="size-3.5 text-primary" /> 代表型号实测基准
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{p.subModels.length} 款典型品类</span>
                    </div>

                    <div className="space-y-1 pt-0.5">
                      {p.subModels.slice(0, 1).map((sub) => (
                        <div
                          key={sub.name}
                          className="flex items-center justify-between rounded-md px-2 py-1 text-xs hover:bg-secondary/50 transition-colors"
                        >
                          <span className="font-medium text-foreground truncate max-w-[150px]">{sub.name}</span>
                          <span className="font-mono font-bold text-primary shrink-0">{sub.carbon}</span>
                        </div>
                      ))}
                    </div>

                    {/* 细分类别构成对比弹窗唤起按钮 */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setModalProduct(p)
                      }}
                      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-secondary/40 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-primary/10 hover:border-primary/60 hover:text-primary"
                    >
                      <BarChart2 className="size-3.5 text-primary" />
                      <span>查看细分类别碳足迹构成对比</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 视图展现：列表模式 (List View - 严格遵循 tbea-industrial-design 44px 行高工业表格) */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border text-[11px] font-semibold select-none">
                <tr className="h-10">
                  <th className="px-3 text-center w-12">序号</th>
                  <th className="px-4 min-w-[150px]">产品分类 / 代号</th>
                  <th className="px-3 text-center min-w-[90px]">在录型号</th>
                  <th className="px-4 text-right min-w-[150px]">综合碳足迹基准</th>
                  <th className="px-4 min-w-[260px]">生命周期阶段构成 (原材料/制造/运输/废弃)</th>
                  <th className="px-4 min-w-[220px]">核心主材</th>
                  <th className="px-4 min-w-[220px]">首选代表型号基准</th>
                  <th className="px-3 text-center w-28">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.map((p, idx) => {
                  const isExpanded = expandedId === p.id
                  const IconComponent = p.icon
                  const topSub = p.subModels[0]

                  return (
                    <Fragment key={p.id}>
                      {/* 44px 工业高密度标准行高 (h-[44px]) */}
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : p.id)}
                        className={`h-[44px] cursor-pointer transition-colors hover:bg-secondary/40 ${
                          isExpanded ? 'bg-secondary/30' : ''
                        }`}
                      >
                        <td className="px-3 text-center font-mono text-muted-foreground text-[11px]">
                          {String(idx + 1).padStart(2, '0')}
                        </td>
                        <td className="px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex size-6 shrink-0 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20">
                              <IconComponent className="size-3.5" />
                            </div>
                            <span className="font-semibold text-foreground">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-3 text-center font-mono">
                          <span className="rounded bg-secondary/80 border border-border/60 px-2 py-0.5 text-xs text-foreground font-semibold">
                            {p.modelCount}
                          </span>
                        </td>
                        <td className="px-4 text-right">
                          <span className="font-mono text-sm font-black text-primary">{p.unitCarbon}</span>
                          <span className="ml-1 text-[10px] font-mono text-muted-foreground">{p.unitLabel}</span>
                        </td>
                        <td className="px-4">
                          <div className="flex items-center gap-2.5">
                            {/* 4 阶段贯穿分段微缩条 */}
                            <div className="flex h-2 w-28 overflow-hidden rounded-full bg-secondary/80 shrink-0 shadow-inner">
                              <div style={{ width: `${p.stages.material}%`, backgroundColor: '#00b4d8' }} title={`原材料: ${p.stages.material}%`} />
                              <div style={{ width: `${p.stages.produce}%`, backgroundColor: '#f59e0b' }} title={`制造: ${p.stages.produce}%`} />
                              <div style={{ width: `${p.stages.transport}%`, backgroundColor: '#10b981' }} title={`运输: ${p.stages.transport}%`} />
                              <div style={{ width: `${p.stages.waste}%`, backgroundColor: '#8b5cf6' }} title={`废弃: ${p.stages.waste}%`} />
                            </div>
                            {/* 阶段构成百分比指标 */}
                            <div className="flex items-center gap-1 font-mono text-[10px] shrink-0">
                              <span className="text-[#00b4d8] font-semibold">{p.stages.material}%</span>
                              <span className="text-muted-foreground/40">/</span>
                              <span className="text-[#f59e0b] font-semibold">{p.stages.produce}%</span>
                              <span className="text-muted-foreground/40">/</span>
                              <span className="text-[#10b981] font-semibold">{p.stages.transport}%</span>
                              <span className="text-muted-foreground/40">/</span>
                              <span className="text-[#8b5cf6] font-semibold">{p.stages.waste}%</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 text-muted-foreground text-xs truncate max-w-[220px]" title={p.primaryMaterials}>
                          {p.primaryMaterials}
                        </td>
                        <td className="px-4 text-xs font-mono">
                          {topSub ? (
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate max-w-[130px] text-foreground" title={topSub.name}>
                                {topSub.name}
                              </span>
                              <span className="font-bold text-primary shrink-0">{topSub.carbon}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setModalProduct(p)
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                              title="打开细分类别构成对比弹窗"
                            >
                              <BarChart2 className="size-3" />
                              <span>对比</span>
                            </button>
                            <span className="text-border">|</span>
                            <button
                              type="button"
                              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                            >
                              <span>{isExpanded ? '收起' : '明细'}</span>
                              <ChevronRight className={`size-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* 展开的型号实测明细抽屉/内联子表格 (每行亦严格遵循 44px 行高) */}
                      {isExpanded && (
                        <tr className="bg-panel/60">
                          <td colSpan={8} className="p-3">
                            <div className="rounded-lg border border-border/80 bg-card p-3 space-y-2.5">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground flex items-center gap-1.5">
                                  <Tag className="size-3.5 text-primary" /> {p.name} · 代表型号实测基准清单 ({p.subModels.length} 款)
                                </span>
                                <span className="font-mono text-[11px]">
                                  核算标准: ISO 14067 / PAS 2050 · 经权威第三方认证
                                </span>
                              </div>
                              <div className="overflow-x-auto rounded border border-border/60">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead className="bg-muted/30 text-[11px] text-muted-foreground border-b border-border/60">
                                    <tr className="h-8">
                                      <th className="px-3 min-w-[140px]">典型型号名称</th>
                                      <th className="px-3 min-w-[120px]">细分品类</th>
                                      <th className="px-3 min-w-[180px]">技术规格参数</th>
                                      <th className="px-3 text-right min-w-[130px]">碳足迹实测基准</th>
                                      <th className="px-3 text-center min-w-[80px]">较基准偏差</th>
                                      <th className="px-3 text-center min-w-[70px]">原材料</th>
                                      <th className="px-3 text-center min-w-[70px]">制造</th>
                                      <th className="px-3 text-center min-w-[70px]">运输</th>
                                      <th className="px-3 text-center min-w-[70px]">废弃</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border/40">
                                    {p.subModels.map((sub) => (
                                      <tr key={sub.name} className="h-[44px] hover:bg-secondary/30">
                                        <td className="px-3 font-semibold text-foreground">{sub.name}</td>
                                        <td className="px-3 text-muted-foreground">{sub.subCategory}</td>
                                        <td className="px-3 text-muted-foreground">{sub.spec}</td>
                                        <td className="px-3 text-right font-mono font-bold text-primary">{sub.carbon}</td>
                                        <td className="px-3 text-center font-mono">
                                          <span
                                            className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                                              sub.isLower
                                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}
                                          >
                                            {sub.deltaPct}
                                          </span>
                                        </td>
                                        <td className="px-3 text-center font-mono text-[#00b4d8] font-semibold">{sub.stages.material}%</td>
                                        <td className="px-3 text-center font-mono text-[#f59e0b] font-semibold">{sub.stages.produce}%</td>
                                        <td className="px-3 text-center font-mono text-[#10b981] font-semibold">{sub.stages.transport}%</td>
                                        <td className="px-3 text-center font-mono text-[#8b5cf6] font-semibold">{sub.stages.waste}%</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* ④ 细分类别碳足迹构成对比弹窗 (Modal Dialog) */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setModalProduct(null)}
        >
          <div
            className="relative flex flex-col w-full max-w-5xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  {(() => {
                    const IconComp = modalProduct.icon
                    return <IconComp className="size-5" />
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground">
                      {modalProduct.name} · 下属产品细分类别碳足迹构成对比
                    </h2>
                  </div>

                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* 4 阶段图例 */}
                <div className="hidden sm:flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2.5 rounded-sm bg-[#00b4d8]" /> 原材料获取
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2.5 rounded-sm bg-[#f59e0b]" /> 生产制造
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2.5 rounded-sm bg-[#10b981]" /> 原材料运输
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2.5 rounded-sm bg-[#8b5cf6]" /> 废弃物处理
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setModalProduct(null)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  title="关闭弹窗"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* 弹窗内容区 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 板块 1: 细分产品碳足迹横向对比与四阶段结构柱图 */}
              <div className="rounded-xl border border-border/80 bg-panel/50 p-4 space-y-4">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-border/60">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-primary" /> 细分类别产品生命周期碳足迹横向梯队对比
                  </span>
                  <span className="font-mono text-muted-foreground">
                    品类基准线: <strong className="text-foreground">{modalProduct.unitCarbon} {modalProduct.unitLabel}</strong>
                  </span>
                </div>

                <div className="max-h-[360px] md:max-h-[390px] overflow-y-auto pr-2 space-y-3.5 [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-secondary/30 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/50">
                  {modalProduct.subModels.map((sub) => (
                    <div key={sub.name} className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{sub.subCategory}</span>
                          <span className="text-muted-foreground text-[11px]">({sub.spec})</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[10px] font-mono font-semibold ${
                              sub.isLower
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}
                          >
                            {sub.isLower ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
                            较基准 {sub.deltaPct}
                          </span>
                          <span className="font-mono font-black text-sm text-foreground">
                            {sub.carbon}
                          </span>
                        </div>
                      </div>

                      {/* 四阶段微型全宽分段条 */}
                      <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary/70 shadow-inner">
                        <div
                          style={{ width: `${sub.stages.material}%`, backgroundColor: '#00b4d8' }}
                          title={`原材料获取: ${sub.stages.material}%`}
                        />
                        <div
                          style={{ width: `${sub.stages.produce}%`, backgroundColor: '#f59e0b' }}
                          title={`生产制造: ${sub.stages.produce}%`}
                        />
                        <div
                          style={{ width: `${sub.stages.transport}%`, backgroundColor: '#10b981' }}
                          title={`原材料运输: ${sub.stages.transport}%`}
                        />
                        <div
                          style={{ width: `${sub.stages.waste}%`, backgroundColor: '#8b5cf6' }}
                          title={`废弃物处理: ${sub.stages.waste}%`}
                        />
                      </div>

                      {/* 阶段四项微量指标 */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground px-1">
                        <span>原材料: <strong className="text-[#00b4d8]">{sub.stages.material}%</strong></span>
                        <span>制造: <strong className="text-[#f59e0b]">{sub.stages.produce}%</strong></span>
                        <span>运输: <strong className="text-[#10b981]">{sub.stages.transport}%</strong></span>
                        <span>废弃: <strong className="text-[#8b5cf6]">{sub.stages.waste}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-between border-t border-border/80 px-6 py-3 bg-muted/10">
              <span className="text-[11px] text-muted-foreground">
                核算依据: ISO 14067 / GHG Protocol · 经特变电工产品碳足迹集采中心实测校验
              </span>
              <button
                type="button"
                onClick={() => setModalProduct(null)}
                className="h-8 rounded-lg bg-secondary px-4 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/80"
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

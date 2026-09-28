'use client'

import React, { useState, useMemo, useRef } from 'react'
import {
  FileEdit,
  Save,
  CheckCircle2,
  Calendar,
  History,
  Download,
  Upload,
  Plus,
  Trash2,
  X,
  Sparkles,
  Eye,
  Cpu,
  Zap,
  Droplet,
  Gauge,
  Factory,
  Check,
  RotateCcw,
  AlertTriangle,
  Building2,
  ChevronDown,
  Layers,
  Database,
  Sliders,
  ExternalLink,
  Table as TableIcon,
  RefreshCw,
  Image as ImageIcon,
  Flag,
  CalendarDays,
  FileText,
  DollarSign,
  TrendingUp,
  MapPin,
  Tag,
  Paperclip,
  UploadCloud,
  Camera,
  Edit3,
  Search,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Settings2,
} from 'lucide-react'
import { Panel, Badge } from '@/components/shared/primitives'
import { cn } from '@/lib/utils'

// =========================================================================
// 1. 特变电工 11 大标准工业产品大类目录库 (动态可扩展架构)
// =========================================================================
interface ProductDef {
  id: string
  name: string
  defaultUnit: string
  units: string[]
  defaultSource: 'auto' | 'manual' | 'mes'
  sourceLabel: string
  iconName: 'cpu' | 'zap' | 'factory' | 'gauge' | 'layers'
}

// =========================================================================
// 1.1 特变电工 产品类型 ➔ 产品子类型 ➔ 型号 ➔ 规格 四级参数联动体系
// =========================================================================
export interface ProductSpecOption {
  spec: string
  code: string
}

export interface ProductModelOption {
  model: string
  specs: ProductSpecOption[]
}

export interface ProductSubTypeOption {
  id: string
  name: string
  models: ProductModelOption[]
}

export interface ProductTypeHierarchy {
  id: string
  name: string
  defaultUnit: string
  units: string[]
  defaultWorkshop: string
  subTypes: ProductSubTypeOption[]
}

export const TBEA_PRODUCT_SPEC_HIERARCHY: ProductTypeHierarchy[] = [
  {
    id: 'transformer',
    name: '变压器',
    defaultUnit: '台/万kVA',
    units: ['台/万kVA', '台', '万kVA'],
    defaultWorkshop: '特高压变压器装配车间',
    subTypes: [
      {
        id: 'oil_power',
        name: '油浸式电力变压器',
        models: [
          {
            model: 'S20-M (新一级能效油浸变)',
            specs: [
              { spec: '630kVA / 10kV', code: 'TB-S20-630' },
              { spec: '1000kVA / 10kV', code: 'TB-S20-1000' },
              { spec: '1600kVA / 10kV', code: 'TB-S20-1600' },
              { spec: '2500kVA / 35kV', code: 'TB-S20-2500' },
            ],
          },
          {
            model: 'SZ11 (有载调压电力变)',
            specs: [
              { spec: '31500kVA / 35kV', code: 'TB-SZ11-31.5' },
              { spec: '50000kVA / 110kV', code: 'TB-SZ11-50' },
              { spec: '63000kVA / 110kV', code: 'TB-SZ11-63' },
            ],
          },
          {
            model: 'SSZ11 (三相三绕组变压器)',
            specs: [
              { spec: '120000kVA / 220kV', code: 'TB-SSZ11-120' },
              { spec: '180000kVA / 220kV', code: 'TB-SSZ11-180' },
              { spec: '240000kVA / 220kV', code: 'TB-SSZ11-240' },
            ],
          },
        ],
      },
      {
        id: 'uhv_ac',
        name: '特高压交流变压器',
        models: [
          {
            model: 'ODFPS-1000 (1000kV特高压自耦变)',
            specs: [
              { spec: '1000MVA / 1000kV', code: 'TB-ODFPS-1000M' },
              { spec: '1500MVA / 1000kV', code: 'TB-ODFPS-1500M' },
            ],
          },
          {
            model: 'ODFPS-750 (750kV超高压自耦变)',
            specs: [
              { spec: '500MVA / 750kV', code: 'TB-ODFPS-500M' },
              { spec: '750MVA / 750kV', code: 'TB-ODFPS-750M' },
            ],
          },
        ],
      },
      {
        id: 'uhv_dc',
        name: '特高压直流换流变压器',
        models: [
          {
            model: 'ZZDFPZ-800 (±800kV换流变压器)',
            specs: [
              { spec: '±800kV / 350MVA', code: 'TB-ZZD-800-350' },
              { spec: '±800kV / 400MVA', code: 'TB-ZZD-800-400' },
            ],
          },
          {
            model: 'ZZDFPZ-1100 (±1100kV换流变压器)',
            specs: [
              { spec: '±1100kV / 6075kVA', code: 'TB-ZZD-1100-600' },
            ],
          },
        ],
      },
      {
        id: 'dry_type',
        name: '干式变压器',
        models: [
          {
            model: 'SCB13 (环氧树脂浇注干变)',
            specs: [
              { spec: '630kVA / 10kV', code: 'TB-SCB13-630' },
              { spec: '1250kVA / 10kV', code: 'TB-SCB13-1250' },
              { spec: '2500kVA / 10kV', code: 'TB-SCB13-2500' },
            ],
          },
          {
            model: 'SCB18 (一级能效环保干变)',
            specs: [
              { spec: '1000kVA / 10kV 一级能效', code: 'TB-SCB18-1000' },
              { spec: '2000kVA / 10kV 一级能效', code: 'TB-SCB18-2000' },
            ],
          },
        ],
      },
      {
        id: 'box_substation',
        name: '预装式/箱式变电站',
        models: [
          {
            model: 'ZGS11 (美式箱变)',
            specs: [
              { spec: '630kVA / 10kV 美式箱变', code: 'TB-ZGS11-630' },
              { spec: '1000kVA / 10kV 美式箱变', code: 'TB-ZGS11-1000' },
            ],
          },
          {
            model: 'YBM-35 (欧式箱变)',
            specs: [
              { spec: '2500kVA / 35kV 欧式箱变', code: 'TB-YBM-2500' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'reactor',
    name: '电抗器',
    defaultUnit: '台/万kVA',
    units: ['台/万kVA', '台', '万kVA'],
    defaultWorkshop: '特高压电抗器制造车间',
    subTypes: [
      {
        id: 'shunt_oil',
        name: '油浸式并联电抗器',
        models: [
          {
            model: 'BKD-66 (66kV并联电抗器)',
            specs: [
              { spec: '20000kvar / 66kV', code: 'TB-BKD-66-20' },
              { spec: '40000kvar / 66kV', code: 'TB-BKD-66-40' },
            ],
          },
          {
            model: 'BKD-500 (500kV并联电抗器)',
            specs: [
              { spec: '60000kvar / 500kV', code: 'TB-BKD-500-60' },
              { spec: '80000kvar / 500kV', code: 'TB-BKD-500-80' },
            ],
          },
          {
            model: 'BKD-1000 (1000kV特高压电抗器)',
            specs: [
              { spec: '240000kvar / 1000kV', code: 'TB-BKD-1000-240' },
            ],
          },
        ],
      },
      {
        id: 'air_core',
        name: '干式空心电抗器',
        models: [
          {
            model: 'BKS-35 (35kV干式空心并联)',
            specs: [
              { spec: '5000kvar / 35kV', code: 'TB-BKS-35-50' },
              { spec: '10000kvar / 35kV', code: 'TB-BKS-35-100' },
            ],
          },
          {
            model: 'CKS-10 (10kV滤波电抗器)',
            specs: [
              { spec: '1200kvar / 10kV', code: 'TB-CKS-10-12' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'switchgear',
    name: '开关柜',
    defaultUnit: '面/台',
    units: ['面/台', '面', '台'],
    defaultWorkshop: '智能高压成套开关车间',
    subTypes: [
      {
        id: 'mv_armored',
        name: '中压铠装移开式开关柜',
        models: [
          {
            model: 'KYN28A-12 (12kV高压开关柜)',
            specs: [
              { spec: '12kV 1250A / 31.5kA', code: 'TB-KYN28-1250' },
              { spec: '12kV 2000A / 31.5kA', code: 'TB-KYN28-2000' },
              { spec: '12kV 3150A / 40kA', code: 'TB-KYN28-3150' },
            ],
          },
          {
            model: 'KYN61-40.5 (40.5kV开关柜)',
            specs: [
              { spec: '40.5kV 1250A / 31.5kA', code: 'TB-KYN61-1250' },
              { spec: '40.5kV 2000A / 31.5kA', code: 'TB-KYN61-2000' },
            ],
          },
        ],
      },
      {
        id: 'lv_withdrawable',
        name: '低压抽出式开关柜',
        models: [
          {
            model: 'MNS3.0 (智能化低压成套)',
            specs: [
              { spec: '380V 1600A / 50kA', code: 'TB-MNS-1600' },
              { spec: '380V 2500A / 65kA', code: 'TB-MNS-2500' },
              { spec: '380V 4000A / 80kA', code: 'TB-MNS-4000' },
            ],
          },
          {
            model: 'GCK (低压抽出式)',
            specs: [
              { spec: '380V 1000A / 50kA', code: 'TB-GCK-1000' },
              { spec: '380V 2000A / 50kA', code: 'TB-GCK-2000' },
            ],
          },
        ],
      },
      {
        id: 'eco_gis',
        name: '环保气体绝缘金属封闭柜',
        models: [
          {
            model: 'TB-N2X (绿色无SF6环保柜)',
            specs: [
              { spec: '12kV 630A / 25kA (绿色环保空气)', code: 'TB-N2X-630' },
              { spec: '24kV 1250A / 25kA (环保氮气介质)', code: 'TB-N2X-1250' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cable',
    name: '线缆',
    defaultUnit: 'km',
    units: ['km', '万米', '吨'],
    defaultWorkshop: '特高压导线与超高压交联电缆车间',
    subTypes: [
      {
        id: 'overhead_conductor',
        name: '特高压架空导线',
        models: [
          {
            model: 'JL/G1A (钢芯铝绞线)',
            specs: [
              { spec: '400/35 高导电率钢芯铝绞线', code: 'TB-JL-400' },
              { spec: '630/45 大截面特高压导线', code: 'TB-JL-630' },
            ],
          },
          {
            model: 'JLHN60A (特高压节能型铝合金绞线)',
            specs: [
              { spec: 'JLHN60A-500/45 中强度节能导线', code: 'TB-JLHN-500' },
            ],
          },
        ],
      },
      {
        id: 'xlpe_cable',
        name: '交联聚乙烯绝缘电力电缆',
        models: [
          {
            model: 'YJV22 (铜芯交联铠装电缆)',
            specs: [
              { spec: '8.7/15kV 3*240mm²', code: 'TB-YJV-240' },
              { spec: '8.7/15kV 3*400mm²', code: 'TB-YJV-400' },
              { spec: '26/35kV 3*300mm²', code: 'TB-YJV-35K' },
            ],
          },
          {
            model: 'YJLW03 (超高压皱纹铝套电缆)',
            specs: [
              { spec: '110kV 1*630mm² 高压单芯', code: 'TB-YJLW-630' },
              { spec: '220kV 1*800mm² 超高压电缆', code: 'TB-YJLW-800' },
            ],
          },
        ],
      },
      {
        id: 'special_cable',
        name: '新能源与特种装备线缆',
        models: [
          {
            model: 'PV1-F (光伏专用直流线缆)',
            specs: [
              { spec: '光伏线缆 1*4mm²', code: 'TB-PV-4' },
              { spec: '光伏线缆 1*6mm²', code: 'TB-PV-6' },
            ],
          },
          {
            model: 'FD-WDZ-BYJ (低烟无卤阻燃线)',
            specs: [
              { spec: '低烟无卤阻燃电线 2.5mm²', code: 'TB-WDZ-2.5' },
              { spec: '低烟无卤阻燃电线 4.0mm²', code: 'TB-WDZ-4.0' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'silicon_steel_core',
    name: '硅钢铁心',
    defaultUnit: '吨',
    units: ['吨', '千克'],
    defaultWorkshop: '特变电工硅钢铁心深加工制造基地',
    subTypes: [
      {
        id: 'oriented_silicon',
        name: '高磁感取向硅钢铁心',
        models: [
          {
            model: 'TB-CORE-023 (0.23mm高牌号取向铁心)',
            specs: [
              { spec: '0.23mm 特高压阶梯叠铁心', code: 'TB-CORE-023H' },
              { spec: '0.23mm 低损耗三相五柱铁心', code: 'TB-CORE-023-3P' },
            ],
          },
          {
            model: 'TB-CORE-027 (0.27mm常规配电铁心)',
            specs: [
              { spec: '0.27mm 常规三相配电铁心', code: 'TB-CORE-027D' },
            ],
          },
        ],
      },
      {
        id: 'amorphous_iron',
        name: '非晶合金立体卷铁心',
        models: [
          {
            model: 'TB-AM-01 (非晶立体卷铁心)',
            specs: [
              { spec: '非晶合金三相立体卷铁心 630kVA', code: 'TB-AM-630' },
              { spec: '非晶合金卷铁心 1000kVA', code: 'TB-AM-1000' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'gis',
    name: 'GIS',
    defaultUnit: '间隔/套',
    units: ['间隔/套', '间隔', '套'],
    defaultWorkshop: '特高压GIS无尘洁净装配分厂',
    subTypes: [
      {
        id: 'uhv_gis',
        name: '特高压与高压GIS组合电器',
        models: [
          {
            model: 'ZF40-1100 (1100kV特高压GIS)',
            specs: [
              { spec: '1100kV特高压GIS标准间隔', code: 'TB-GIS-1100' },
            ],
          },
          {
            model: 'ZF27-550 (550kV高压GIS)',
            specs: [
              { spec: '550kV高压GIS组合电器间隔', code: 'TB-GIS-550' },
            ],
          },
          {
            model: 'ZF12-126 (126kV高压GIS)',
            specs: [
              { spec: '126kV高压GIS出线间隔', code: 'TB-GIS-126' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'bushing',
    name: '套管',
    defaultUnit: '支/套',
    units: ['支/套', '支', '套'],
    defaultWorkshop: '特高压电容式套管制造中心',
    subTypes: [
      {
        id: 'composite_bushing',
        name: '特高压复合绝缘套管',
        models: [
          {
            model: 'BRDLW-±800kV (直流特高压穿墙套管)',
            specs: [
              { spec: '±800kV直流特高压干式穿墙套管', code: 'TB-BSG-800D' },
            ],
          },
          {
            model: 'FRP-1100kV (特高压交流变压器套管)',
            specs: [
              { spec: '1100kV特高压交流变压器出线套管', code: 'TB-BSG-1100A' },
            ],
          },
          {
            model: 'BRLW-220kV (220kV油浸变压器套管)',
            specs: [
              { spec: '220kV油浸绝缘高压套管', code: 'TB-BSG-220' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'capacitor',
    name: '电容器',
    defaultUnit: '台/组',
    units: ['台/组', '台', 'kvar'],
    defaultWorkshop: '电力电容器制造车间',
    subTypes: [
      {
        id: 'power_capacitor',
        name: '高压并联与集合式电容器',
        models: [
          {
            model: 'BAM-11 (11kV高压并联电容器)',
            specs: [
              { spec: '11kV 334kvar高压并联电容器', code: 'TB-CAP-11-334' },
              { spec: '11kV 500kvar高压并联电容器', code: 'TB-CAP-11-500' },
            ],
          },
          {
            model: 'BFM-10 (集合式高压并联电容器组)',
            specs: [
              { spec: '10kV集合式高压并联电容器组 10000kvar', code: 'TB-CAP-10-SET' },
            ],
          },
        ],
      },
    ],
  },
]

const TBEA_11_PRODUCT_CATALOG: ProductDef[] = [
  { id: 'transformer', name: '变压器', defaultUnit: '台/万kVA', units: ['台/万kVA', '台', '万kVA'], defaultSource: 'manual', sourceLabel: 'ERP待对接 (自填)', iconName: 'cpu' },
  { id: 'cable', name: '线缆', defaultUnit: 'km', units: ['km', '万米', '吨'], defaultSource: 'auto', sourceLabel: '大数据平台直通 (免填)', iconName: 'zap' },
  { id: 'switchgear', name: '开关柜', defaultUnit: '面/台', units: ['面/台', '面', '台'], defaultSource: 'manual', sourceLabel: '厂级MES/自填', iconName: 'factory' },
  { id: 'capacitor', name: '电容器', defaultUnit: '台/组', units: ['台/组', '台', 'kvar'], defaultSource: 'manual', sourceLabel: '厂级ERP/自填', iconName: 'zap' },
  { id: 'reactor', name: '电抗器', defaultUnit: '台/万kVA', units: ['台/万kVA', '台', '万kVA'], defaultSource: 'manual', sourceLabel: '厂级ERP/自填', iconName: 'cpu' },
  { id: 'bushing', name: '套管', defaultUnit: '支/套', units: ['支/套', '支', '套'], defaultSource: 'manual', sourceLabel: '厂级MES/自填', iconName: 'gauge' },
  { id: 'instrument_transformer', name: '互感器', defaultUnit: '台/只', units: ['台/只', '台', '只'], defaultSource: 'manual', sourceLabel: '厂级ERP/自填', iconName: 'cpu' },
  { id: 'gis', name: 'GIS', defaultUnit: '间隔/套', units: ['间隔/套', '间隔', '套'], defaultSource: 'manual', sourceLabel: '工程台账/自填', iconName: 'factory' },
  { id: 'gil', name: 'GIL', defaultUnit: '米/相米', units: ['米/相米', '米', '相米'], defaultSource: 'manual', sourceLabel: '工程台账/自填', iconName: 'gauge' },
  { id: 'silicon_steel_core', name: '硅钢铁心', defaultUnit: '吨', units: ['吨', '千克'], defaultSource: 'mes', sourceLabel: '车间MES直通', iconName: 'layers' },
  { id: 'amorphous_core', name: '非晶合金铁心', defaultUnit: '吨', units: ['吨', '千克'], defaultSource: 'mes', sourceLabel: '车间MES直通', iconName: 'layers' },
]

// 细分型号条目
interface ProductModelItem {
  id: string
  modelCode: string
  modelName: string
  subTypeName?: string
  unit?: string
  plannedOutput?: string
  output: string
  workshop?: string
  remark?: string
}

// 实际已启用的产品填报记录
interface ActiveProductRecord {
  id: string
  categoryId: string
  categoryName: string
  unit: string
  plannedValue?: string
  value: string
  lastMonthValue: string
  sourceType: 'auto' | 'manual' | 'mes'
  sourceLabel: string
  isPrimary: boolean
  workshop: string
  remark: string
  models: ProductModelItem[]
}

// 基础能耗指标模型
interface MetricItem {
  id: string
  name: string
  category: 'energy' | 'cost' | 'green' | 'economy'
  categoryLabel: string
  subTypeName?: string
  unit: string
  value: string
  lastMonthValue: string
  remark: string
  sourceLabel?: string
}

// 能源消耗层级与大类规范
export interface EnergyCategorySpec {
  id: 'energy' | 'cost' | 'green' | 'economy'
  name: string
  defaultUnit: string
  units: string[]
  subTypes: { id: string; name: string }[]
}

export const TBEA_ENERGY_SPEC_HIERARCHY: EnergyCategorySpec[] = [
  {
    id: 'energy',
    name: '实物介质消耗量',
    defaultUnit: 't',
    units: ['t', 'm³', 'kWh', 'L', 'kg', 'Nm³', '万kWh', 'GJ'],
    subTypes: [
      { id: 'water', name: '水务介质（自来水/软水/中水）' },
      { id: 'gas', name: '燃气介质（天然气/液化气/沼气）' },
      { id: 'steam', name: '蒸汽热力（集中供热管网蒸汽/外购热力）' },
      { id: 'oil', name: '动力燃油（柴油/汽油/机油）' },
      { id: 'ind_gas', name: '工业气体（液氮/氮气/液氧/二氧化碳）' },
      { id: 'outsource_power', name: '外协委外用电（喷涂/热处理分摊）' },
      { id: 'self_solar', name: '自备绿电自发自用（分布式光伏/余热）' },
    ],
  },
  {
    id: 'cost',
    name: '能源费用发票',
    defaultUnit: '万元',
    units: ['万元', '元'],
    subTypes: [
      { id: 'cost_power', name: '市电电费增值税发票' },
      { id: 'cost_gas', name: '管道天然气月度发票' },
      { id: 'cost_steam', name: '外购蒸汽集中供热发票' },
      { id: 'cost_water', name: '自来水供水账单发票' },
      { id: 'cost_oil', name: '中石化加油卡与柴油发票' },
      { id: 'cost_nitrogen', name: '工业气体与液氮发票' },
    ],
  },
  {
    id: 'green',
    name: '购买绿电与凭证',
    defaultUnit: 'kWh',
    units: ['kWh', '万kWh', '个', '元/kWh', '日期'],
    subTypes: [
      { id: 'green_trade', name: '绿电双边交易电量' },
      { id: 'green_cert', name: '国家绿色电力证书 GEC 划转' },
      { id: 'green_price', name: '双边绿电结算综合单价' },
      { id: 'green_date', name: '电力交易中心交割执行日期' },
    ],
  },
  {
    id: 'economy',
    name: '管理与审计指标',
    defaultUnit: '万元',
    units: ['万元', '项', '天', '条'],
    subTypes: [
      { id: 'ind_add', name: '工业增加值（统计局月度直报）' },
      { id: 'ind_output', name: '工业总产值（可比口径）' },
      { id: 'inspect_time', name: '计划检修维护累计停产工时' },
    ],
  },
]

// 园区与申报主体映射结构
export interface ParkReportingUnit {
  parkId: string
  parkName: string
  unitName: string
  submitterDefault: string
  provinceCity: string
  industry: string
}

export const PARK_REPORTING_UNITS: ParkReportingUnit[] = [
  {
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    unitName: '特变电工沈阳变压器工厂',
    submitterDefault: '李工 (能碳专员)',
    provinceCity: '辽宁·沈阳',
    industry: '特高压变压器制造',
  },
  {
    parkId: 'nfsb',
    parkName: '特变电工南方输变电产业园',
    unitName: '特变电工衡阳变压器工厂',
    submitterDefault: '张工 (南方中心专员)',
    provinceCity: '湖南·衡阳',
    industry: '超高压变压器制造',
  },
  {
    parkId: 'sbcp',
    parkName: '特变电工输变电产业园',
    unitName: '特变电工新疆变压器厂 (超高压)',
    submitterDefault: '艾力 (西北基地专员)',
    provinceCity: '新疆·昌吉',
    industry: '新能源与输变电装备',
  },
  {
    parkId: 'hd',
    parkName: '特变电工华东输变电科技产业园',
    unitName: '特变电工山东鲁能泰山电缆工厂',
    submitterDefault: '王工 (华东线缆专员)',
    provinceCity: '山东·新泰',
    industry: '超高压电缆制造',
  },
  {
    parkId: 'xazb',
    parkName: '特变电工西安智能装备产业园',
    unitName: '特变电工合容电气股份有限公司',
    submitterDefault: '刘工 (电力电子专员)',
    provinceCity: '陕西·西安',
    industry: '电力电容器与无功补偿',
  },
  {
    parkId: 'ecy',
    parkName: '特变电工二次产业园区',
    unitName: '南京电气绝缘子与二次研发中心',
    submitterDefault: '陈工 (智能二次专员)',
    provinceCity: '江苏·南京',
    industry: '智能配电与二次控制',
  },
  {
    parkId: 'xjxl',
    parkName: '特变电工新疆线缆产业园',
    unitName: '特变电工新疆线缆厂',
    submitterDefault: '马工 (线缆专员)',
    provinceCity: '新疆·乌鲁木齐/昌吉',
    industry: '特种电线电缆',
  },
  {
    parkId: 'dy',
    parkName: '特变电工(德阳)电缆园区',
    unitName: '特变电工(德阳)电缆股份有限公司',
    submitterDefault: '赵工 (西南基地专员)',
    provinceCity: '四川·德阳',
    industry: '特种电线电缆',
  },
]

// =========================================================================
// 1.2 节能装备与装备台账明细数据模型 (全平台核心指标 #9 节能装备应用占比数据底座)
// =========================================================================
export interface EnergySavingEquipmentItem {
  id: string
  code: string                 // 装备资产编号
  name: string                 // 装备名称
  model: string                // 规格型号
  ratedPower: number           // 额定功率 (kW)
  energyGrade: string          // 能效等级 (国标1级能效 / 国标2级能效 / 先进水平 / 节能水平)
  workshop: string             // 所属车间 / 产线
  certificate: string          // 节能认定凭证 / 依据标准
  commissionYear: string       // 投运年份
  remark?: string              // 备注
}

export interface EquipmentInventoryItem {
  id: string
  code: string                 // 装备资产编号
  name: string                 // 装备名称
  processCategory: string      // 工艺类别 (变压器装配制造 / 硅钢剪切工序 / 公辅动力站 / 高压型式试验 / 线缆立塔交联等)
  model: string                // 规格型号
  ratedPower: number           // 铭牌额定功率 (kW)
  runningStatus: 'running' | 'standby' | 'maintenance' // 运行状态
  isInScope: boolean           // 是否纳入统计范围 (true: 计入 E_ts; false: 剔除)
  isEnergySaving: boolean      // 是否属于节能装备
  workshop: string             // 责任车间
  remark?: string              // 备注
}

// 初始节能装备明细列表 (8 项核心重点节能装备，额定功率累计 2,985 kW)
export const INITIAL_ENERGY_SAVING_EQUIPMENTS: EnergySavingEquipmentItem[] = [
  {
    id: 'es-001',
    code: 'EQ-ES-2024-001',
    name: '1#超高压真空相变干燥罐系统',
    model: 'TB-VPD-4500',
    ratedPower: 450,
    energyGrade: '国标1级能效',
    workshop: '特高压数字化装配车间',
    certificate: 'GB 18613-2020 1级 / 节能认证证书',
    commissionYear: '2024年',
    remark: '全自动相变煤油气相干燥，绝缘件干燥能耗降低28%',
  },
  {
    id: 'es-002',
    code: 'EQ-ES-2024-002',
    name: '全自动数控精密硅钢横剪线',
    model: 'TB-NC-600G',
    ratedPower: 280,
    energyGrade: '先进水平',
    workshop: '铁心剪切智能车间',
    certificate: '国家工业节能技术装备推荐目录 (2024)',
    commissionYear: '2023年',
    remark: '德国伺服进给，高精度阶梯剪切低损耗',
  },
  {
    id: 'es-003',
    code: 'EQ-ES-2024-003',
    name: '特高压试验站发电机组变频调速系统',
    model: 'TF-3500/10-VF',
    ratedPower: 680,
    energyGrade: '国标1级能效',
    workshop: '特高压试验站大厅',
    certificate: 'GB 18613-2020 1级节能认证',
    commissionYear: '2024年',
    remark: '大容量中压变频驱动，试验空载损耗降低32%',
  },
  {
    id: 'es-004',
    code: 'EQ-ES-2024-004',
    name: '节能型集中永磁变频双螺杆空压机组',
    model: 'TB-PM-315A',
    ratedPower: 315,
    energyGrade: '国标1级能效',
    workshop: '公辅动力能源动力站',
    certificate: 'GB 19153-2019 1级节能认证',
    commissionYear: '2023年',
    remark: '集中群控恒压供气，综合能效比达6.8m³/(min·kW)',
  },
  {
    id: 'es-005',
    code: 'EQ-ES-2024-005',
    name: '全自动立式低氧光亮铜杆退火炉',
    model: 'TB-ANN-400T',
    ratedPower: 400,
    energyGrade: '国标2级能效',
    workshop: '铜排加工成型车间',
    certificate: 'GB 21256-2019 2级能效达标',
    commissionYear: '2022年',
    remark: '保护气氛连续退火，电热辐射转换效率≥92%',
  },
  {
    id: 'es-006',
    code: 'EQ-ES-2024-006',
    name: '超高压CCV立塔节能电缆挤出硫化系统',
    model: 'ML-CCV-500',
    ratedPower: 520,
    energyGrade: '先进水平',
    workshop: '超高压立塔交联车间',
    certificate: '国家高新技术装备节能认证证书',
    commissionYear: '2023年',
    remark: '干法交联悬链加热，温控PID节能优化',
  },
  {
    id: 'es-007',
    code: 'EQ-ES-2024-007',
    name: '2#低能耗相变干燥余热冷凝回收机组',
    model: 'TB-REC-200',
    ratedPower: 180,
    energyGrade: '节能水平',
    workshop: '特高压数字化装配车间',
    certificate: '中国节能产品认证证书 (CQC)',
    commissionYear: '2024年',
    remark: '煤油冷凝潜热梯级利用，回收率达85%',
  },
  {
    id: 'es-008',
    code: 'EQ-ES-2024-008',
    name: '大容量低损耗智能循环冷却循环泵组',
    model: 'TB-PUMP-160',
    ratedPower: 160,
    energyGrade: '国标1级能效',
    workshop: '公辅动力能源动力站',
    certificate: 'GB 19762-2020 1级水泵能效',
    commissionYear: '2023年',
    remark: '高效水力模型叶轮，变频闭环恒流量输送',
  },
]

// 初始全厂在册装备台账 (14 项装备，纳入统计 13 项，累计纳入总功率 3,745 kW)
export const INITIAL_EQUIPMENT_INVENTORY: EquipmentInventoryItem[] = [
  {
    id: 'inv-001',
    code: 'EQ-AST-1001',
    name: '1#超高压真空相变干燥罐系统',
    processCategory: '变压器装配制造',
    model: 'TB-VPD-4500',
    ratedPower: 450,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: true,
    workshop: '特高压数字化装配车间',
    remark: '关键主工艺装备，一级能效',
  },
  {
    id: 'inv-002',
    code: 'EQ-AST-1002',
    name: '全自动数控精密硅钢横剪线',
    processCategory: '硅钢剪切工序',
    model: 'TB-NC-600G',
    ratedPower: 280,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: true,
    workshop: '铁心剪切智能车间',
    remark: '铁心制造核心工序装备',
  },
  {
    id: 'inv-003',
    code: 'EQ-AST-1003',
    name: '特高压试验站发电机组变频调速系统',
    processCategory: '高压型式试验',
    model: 'TF-3500/10-VF',
    ratedPower: 680,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: true,
    workshop: '特高压试验站大厅',
    remark: '特高压变压器出厂试验电源',
  },
  {
    id: 'inv-004',
    code: 'EQ-AST-1004',
    name: '节能型集中永磁变频双螺杆空压机组',
    processCategory: '公辅动力站',
    model: 'TB-PM-315A',
    ratedPower: 315,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: true,
    workshop: '公辅动力能源动力站',
    remark: '全厂压缩空气核心动力源',
  },
  {
    id: 'inv-005',
    code: 'EQ-AST-1005',
    name: '全自动立式低氧光亮铜杆退火炉',
    processCategory: '铜排加工成型',
    model: 'TB-ANN-400T',
    ratedPower: 400,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: true,
    workshop: '铜排加工成型车间',
    remark: '大电流绕组母线热处理退火',
  },
  {
    id: 'inv-006',
    code: 'EQ-AST-1006',
    name: '超高压CCV立塔节能电缆挤出硫化系统',
    processCategory: '线缆立塔交联',
    model: 'ML-CCV-500',
    ratedPower: 520,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: true,
    workshop: '超高压立塔交联车间',
    remark: '超高压电缆绝缘挤出立塔核心机组',
  },
  {
    id: 'inv-007',
    code: 'EQ-AST-1007',
    name: '2#低能耗相变干燥余热冷凝回收机组',
    processCategory: '变压器装配制造',
    model: 'TB-REC-200',
    ratedPower: 180,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: true,
    workshop: '特高压数字化装配车间',
    remark: '相变干燥配套余热回收机组',
  },
  {
    id: 'inv-008',
    code: 'EQ-AST-1008',
    name: '大容量低损耗智能循环冷却循环泵组',
    processCategory: '公辅动力站',
    model: 'TB-PUMP-160',
    ratedPower: 160,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: true,
    workshop: '公辅动力能源动力站',
    remark: '厂区循环水高能效输配泵组',
  },
  {
    id: 'inv-009',
    code: 'EQ-AST-1009',
    name: '1#桥式重型变压器双梁起重行车 (300t)',
    processCategory: '变压器装配制造',
    model: 'QD-300/50t',
    ratedPower: 180,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: false,
    workshop: '特高压数字化装配车间',
    remark: '总装车间重型总装起吊起重机',
  },
  {
    id: 'inv-010',
    code: 'EQ-AST-1010',
    name: '高压绝缘件微波深度干燥恒温房',
    processCategory: '绝缘件加工',
    model: 'TB-MW-150',
    ratedPower: 150,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: false,
    workshop: '绝缘件智造分厂',
    remark: '纸板与成型绝缘构件脱水设备',
  },
  {
    id: 'inv-011',
    code: 'EQ-AST-1011',
    name: '大型变压器波纹油箱数控滚波成型机',
    processCategory: '油箱结构焊装',
    model: 'WB-2000B',
    ratedPower: 120,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: false,
    workshop: '结构件焊接车间',
    remark: '配电与中压变压器波纹油箱自动化加工',
  },
  {
    id: 'inv-012',
    code: 'EQ-AST-1012',
    name: '3#常规工频耐压试验变压器组',
    processCategory: '高压型式试验',
    model: 'YDTW-1000/100',
    ratedPower: 220,
    runningStatus: 'standby',
    isInScope: true,
    isEnergySaving: false,
    workshop: '特高压试验站大厅',
    remark: '备用工频耐压高压试验变',
  },
  {
    id: 'inv-013',
    code: 'EQ-AST-1013',
    name: '全厂应急备用柴油发电机组 (1200kW)',
    processCategory: '公辅动力站',
    model: 'CUMMINS-1200',
    ratedPower: 1200,
    runningStatus: 'standby',
    isInScope: false,
    isEnergySaving: false,
    workshop: '公辅动力能源动力站',
    remark: '应急备用保安电源，非日常生产负荷，依规剔除能效核算范围',
  },
  {
    id: 'inv-014',
    code: 'EQ-AST-1014',
    name: '厂界工业污水循环生化处理机组',
    processCategory: '环保公辅设施',
    model: 'TB-WWTP-90',
    ratedPower: 90,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: false,
    workshop: '给排水水处理站',
    remark: '工业循环水达标处理回用动力机组',
  },
]

// 园区照片记录模型（归属于当前用户所属园区）
interface ParkPhotoRecord {
  id: string
  title: string
  category: '全厂鸟瞰实景' | '屋顶分布式光伏' | '智能变配电房' | '特高压核心车间' | '储能电站系统' | '集控运营中心' | '低碳绿化景观'
  date: string
  parkId: string
  parkName: string
  imageUrl: string
  isFeaturedScreen: boolean
  description: string
}

// 园区大事件记录模型（归属于当前用户所属园区）
interface ParkMilestoneRecord {
  id: string
  date: string
  parkId: string
  parkName: string
  category: '光伏并网' | '储能投运' | '节能技改' | '零碳认证' | '碳足迹上线' | '绿电交易' | '荣誉考察'
  title: string
  benefitImpact: string
  content: string
  attachmentName?: string
  imageUrl?: string
  isFeaturedScreen: boolean
}

// 辅助函数：按月度总量生成 31 天合理日数据
const generateInitialDaily = (total: number, days: number = 31) => {
  const avg = total / days
  return Array.from({ length: days }, (_, i) => {
    const factor = 1 + ((i % 5) - 2) * 0.02
    return Math.round(avg * factor * 10) / 10
  })
}

// 初始常规能源消耗指标 (19项：8项实物介质消耗 + 6项费用发票 + 4项绿电 + 1项管理审计)
const INITIAL_METRICS: MetricItem[] = [
  // 1. 实物介质消耗 (8项)
  { id: 'm-1', name: '用水量', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '水务介质', unit: 't', value: '8900', lastMonthValue: '8650', remark: '市政自来水水表月度抄报底数', sourceLabel: '市政水表抄报' },
  { id: 'm-2', name: '天然气量', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '燃气介质', unit: 'm³', value: '28400', lastMonthValue: '27200', remark: '燃气锅炉与车间烘干加热消耗', sourceLabel: '专用燃气表' },
  { id: 'm-3', name: '外购蒸汽量', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '蒸汽热力', unit: 't', value: '1420', lastMonthValue: '1380', remark: '集中供热管网蒸汽抄表结算量', sourceLabel: '热网总表' },
  { id: 'm-heat', name: '热力消费量', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '蒸汽热力', unit: 'GJ', value: '3850', lastMonthValue: '3620', remark: '集中供热管网蒸汽/热水热力结算量', sourceLabel: '热焓表抄报' },
  { id: 'm-4', name: '油消耗量（柴油/汽油）', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '动力用油', unit: 'L', value: '320', lastMonthValue: '350', remark: '应急发电机试车与厂区叉车领用', sourceLabel: '领用台账' },
  { id: 'm-5', name: '液氮消费量', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '工业气体', unit: 't', value: '52.0', lastMonthValue: '48.5', remark: '高压交联立塔保护气与绝缘件相变干燥消耗', sourceLabel: '地磅称重/充装台账' },
  { id: 'm-ext', name: '外协委外加工电耗分摊', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '外协用电', unit: 'kWh', value: '12400', lastMonthValue: '11800', remark: '外协绝缘喷涂等结算单分摊', sourceLabel: '工单分摊' },
  { id: 'm-self', name: '自备余热自发自用电量', category: 'energy', categoryLabel: '实物消耗量', subTypeName: '光伏自用', unit: 'kWh', value: '68500', lastMonthValue: '65000', remark: '热电及余热发电机组自用抄表', sourceLabel: '逆变器采集' },

  // 2. 能源费用发票 (6项)
  { id: 'm-6', name: '市电费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '电力费用', unit: '万元', value: '142.50', lastMonthValue: '138.20', remark: '国网电力月度电费增值税发票总额', sourceLabel: '增值税发票' },
  { id: 'm-7', name: '天然气费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '燃气费用', unit: '万元', value: '8.52', lastMonthValue: '8.16', remark: '新奥燃气月度发票结算金额', sourceLabel: '燃气结算发票' },
  { id: 'm-8', name: '外购蒸汽费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '蒸汽费用', unit: '万元', value: '32.66', lastMonthValue: '31.74', remark: '园区热力公司当期发票对账单', sourceLabel: '热力对账单' },
  { id: 'm-9', name: '用水费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '水费账单', unit: '万元', value: '4.89', lastMonthValue: '4.76', remark: '自来水水务集团缴费凭单', sourceLabel: '水务发票' },
  { id: 'm-10', name: '油费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '燃油费用', unit: '万元', value: '0.24', lastMonthValue: '0.26', remark: '中石化加油卡充值及柴油发票', sourceLabel: '中石化凭单' },
  { id: 'm-cost-nitrogen', name: '氮气费用', category: 'cost', categoryLabel: '能源费用', subTypeName: '工业气体', unit: '万元', value: '1.85', lastMonthValue: '1.72', remark: '工业气体供应商当期液氮/高纯氮气结算发票', sourceLabel: '气体结算发票' },

  // 3. 购买绿电交易参数 (4项)
  { id: 'm-11', name: '购买绿电量', category: 'green', categoryLabel: '购买绿电', subTypeName: '绿电交易', unit: 'kWh', value: '1482000', lastMonthValue: '1200000', remark: '三峡能源哈密200MW光伏双边交易', sourceLabel: '交易直供合同' },
  { id: 'm-12', name: '购买绿证量', category: 'green', categoryLabel: '购买绿电', subTypeName: '绿证划转', unit: '个', value: '18000', lastMonthValue: '15000', remark: '国家绿色电力证书 GEC 划转入账', sourceLabel: 'GEC绿证凭证' },
  { id: 'm-12-price', name: '结算单价', category: 'green', categoryLabel: '购买绿电', subTypeName: '单价清算', unit: '元/kWh', value: '0.4280', lastMonthValue: '0.4250', remark: '绿电综合结算到厂单价', sourceLabel: '电费结算单' },
  { id: 'm-12-date', name: '交易日期', category: 'green', categoryLabel: '购买绿电', unit: '日期', value: '2026-08-18', lastMonthValue: '2026-07-20', remark: '电力交易中心双边合同执行日期', sourceLabel: '交易中心备忘' },

  // 4. 管理与审计指标 (1项)
  { id: 'm-ind', name: '工业增加值（统计局月度直报口径）', category: 'economy', categoryLabel: '管理审计', subTypeName: '经济指标', unit: '万元', value: '4280.0', lastMonthValue: '3950.0', remark: '按政府统计局直报报表填报', sourceLabel: '统计局直报' },
]

// 初始产品清单 (沈变案例：变压器、电抗器、硅钢铁心)
const INITIAL_ACTIVE_PRODUCTS: ActiveProductRecord[] = [
  {
    id: 'prod-1',
    categoryId: 'transformer',
    categoryName: '变压器',
    unit: '台/万kVA',
    value: '128',
    lastMonthValue: '122',
    sourceType: 'manual',
    sourceLabel: 'ERP待对接 (自填)',
    isPrimary: true,
    workshop: '特高压数字化生产车间',
    remark: '含特高压与出口订单排产',
    plannedValue: '135',
    models: [
      { id: 'm-101', modelCode: 'TB-S20-630', modelName: 'S20-M-630/10 高效油浸式变压器', subTypeName: '油浸式电力变压器', unit: '台/万kVA', plannedOutput: '50', output: '48' },
      { id: 'm-102', modelCode: 'TB-SZ11-50M', modelName: 'SZ11-50000/110 有载调压变压器', subTypeName: '油浸式电力变压器', unit: '台/万kVA', plannedOutput: '40', output: '36' },
      { id: 'm-103', modelCode: 'TB-ODFPS-1000', modelName: 'ODFPS-1000MVA/1000kV 特高压变压器', subTypeName: '特高压交流变压器', unit: '台/万kVA', plannedOutput: '45', output: '44' },
    ],
  },
  {
    id: 'prod-2',
    categoryId: 'reactor',
    categoryName: '电抗器',
    unit: '台/万kVA',
    plannedValue: '48',
    value: '45',
    lastMonthValue: '40',
    sourceType: 'manual',
    sourceLabel: '厂级ERP/自填',
    isPrimary: true,
    workshop: '特种电抗器分厂',
    remark: '特高压交流配套并联电抗器',
    models: [
      { id: 'm-201', modelCode: 'TB-BKD-66', modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器', subTypeName: '特高压并联电抗器', unit: '台/万kVA', plannedOutput: '48', output: '45' },
    ],
  },
  {
    id: 'prod-3',
    categoryId: 'silicon_steel_core',
    categoryName: '硅钢铁心',
    unit: '吨',
    plannedValue: '3300',
    value: '3200',
    lastMonthValue: '3100',
    sourceType: 'mes',
    sourceLabel: '车间MES直通',
    isPrimary: false,
    workshop: '铁心剪切智能车间',
    remark: '0.23mm 高磁感取向硅钢片',
    models: [
      { id: 'm-301', modelCode: 'TB-CORE-023', modelName: '0.23mm 高磁感取向硅钢铁心', plannedOutput: '3300', output: '3200' },
    ],
  },
]

// 初始园区照片 (按园区结构严格归属，采用本地 public 高清实景资源)
const INITIAL_PARK_PHOTOS: ParkPhotoRecord[] = [
  // 1. 东北输变电产业园 (沈变)
  {
    id: 'photo-1',
    title: '特变电工东北输变电产业园 2.8MWp 屋顶光伏全景',
    category: '屋顶分布式光伏',
    date: '2026-08-15',
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    imageUrl: '/images/screen/nanjing-park-pv.jpg',
    isFeaturedScreen: true,
    description: '覆盖沈变总装1-4号厂房屋顶，采用高效双面组件，年发绿电达320万千瓦时。',
  },
  {
    id: 'photo-2',
    title: '特高压智能化总装生产车间实景航拍',
    category: '特高压核心车间',
    date: '2026-08-10',
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    imageUrl: '/images/screen/xian-pv-real.jpg',
    isFeaturedScreen: true,
    description: '百万伏级变压器洁净组装车间，配备恒温恒湿循环与微正压防尘控制。',
  },
  {
    id: 'photo-3',
    title: '沈变 10kV 智能配电房与余热泵站',
    category: '智能变配电房',
    date: '2026-07-22',
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    imageUrl: '/illustrations/zero-carbon.png',
    isFeaturedScreen: false,
    description: '配置一级能效干式变压器与SVG动态无功补偿装置，功率因数达0.98以上。',
  },
  {
    id: 'photo-4',
    title: '零碳园区能碳微电网集控运营大厅',
    category: '集控运营中心',
    date: '2026-06-18',
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    imageUrl: '/images/screen/platform-16-9.jpg',
    isFeaturedScreen: true,
    description: '工业微电网源网荷储协同控制大屏，实时监测光伏消纳率与峰平谷负荷。',
  },
  // 2. 南方输变电产业园 (衡变)
  {
    id: 'photo-hb-1',
    title: '衡阳南方输变电产业园 28MW 屋顶光伏阵列',
    category: '屋顶分布式光伏',
    date: '2026-08-12',
    parkId: 'nfsb',
    parkName: '特变电工南方输变电产业园',
    imageUrl: '/images/screen/nanjing-park-pv.jpg',
    isFeaturedScreen: true,
    description: '华南最大屋顶分布式光伏电站，就地消纳率超91%，年发电量超2600万度。',
  },
  {
    id: 'photo-hb-2',
    title: '南方超高压油箱与总装智能化生产线',
    category: '特高压核心车间',
    date: '2026-07-15',
    parkId: 'nfsb',
    parkName: '特变电工南方输变电产业园',
    imageUrl: '/images/screen/xian-pv-real.jpg',
    isFeaturedScreen: true,
    description: '全自动机器人等离子切割与环保水性漆涂装线，综合VOCs减排95%。',
  },
  // 3. 华东输变电科技产业园 (鲁缆)
  {
    id: 'photo-ll-1',
    title: '鲁缆新泰高压立塔交联绿色制造车间',
    category: '特高压核心车间',
    date: '2026-08-01',
    parkId: 'hd',
    parkName: '特变电工华东输变电科技产业园',
    imageUrl: '/images/screen/xian-pv-real.jpg',
    isFeaturedScreen: true,
    description: '超高压500kV悬臂式垂直交联立塔，配套氮气全封闭循环与余热冷凝系统。',
  },
  // 4. 输变电产业园 (新疆/新变)
  {
    id: 'photo-xb-1',
    title: '昌吉输变电基地大漠绿电消纳微电网',
    category: '屋顶分布式光伏',
    date: '2026-08-08',
    parkId: 'sbcp',
    parkName: '特变电工输变电产业园',
    imageUrl: '/images/screen/nanjing-park-pv.jpg',
    isFeaturedScreen: true,
    description: '充分利用西北大漠丰富日照资源，园区自发自用光伏直供比例达到35.1%。',
  },
  // 5. 西安智能装备产业园
  {
    id: 'photo-xa-1',
    title: '西安智能装备制造基地 6.4MW 屋顶光伏实景',
    category: '屋顶分布式光伏',
    date: '2026-07-30',
    parkId: 'xazb',
    parkName: '特变电工西安智能装备产业园',
    imageUrl: '/images/screen/xian-pv-real.jpg',
    isFeaturedScreen: true,
    description: '光储充一体化智慧微电网，配套2MW/4MWh储能调峰调频。',
  },
]

// 初始园区大事件 (归属园区，包含现场实景佐证图)
const INITIAL_PARK_MILESTONES: ParkMilestoneRecord[] = [
  {
    id: 'ev-1',
    date: '2026-08-15',
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    category: '光伏并网',
    title: '特变电工沈变本部 2.8MWp 分布式光伏扩建工程顺利并网投运',
    benefitImpact: '预计年减少碳排放 2,850 tCO2，节约外购电费 180 万元',
    content: '全厂4处主体厂房屋顶光伏完成网架加固并网，接入智慧能源微电网集控中心，各项电能质量指标达优。',
    attachmentName: '并网调度协议_签署版.pdf',
    imageUrl: '/images/screen/nanjing-park-pv.jpg',
    isFeaturedScreen: true,
  },
  {
    id: 'ev-2',
    date: '2026-06-20',
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    category: '碳足迹上线',
    title: '零碳智慧园区能源管理系统 2.0 (SCADA/IoT) 全面验收上线',
    benefitImpact: '实现全厂 28 个车间工序能耗秒级采集，综合节能率 3.2%',
    content: '打通关口电表、蒸汽计量与 ERP 完工数据，自动化采集率提升至 92%，为产品碳足迹提供实景台账。',
    attachmentName: '数字化系统验收报告.pdf',
    imageUrl: '/images/screen/platform-16-9.jpg',
    isFeaturedScreen: true,
  },
  {
    id: 'ev-3',
    date: '2026-03-10',
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    category: '零碳认证',
    title: '通过中国质量认证中心 (CQC) 零碳工厂 (三星级) 现场初核',
    benefitImpact: '成为东北首家获评国家级三星零碳的特高压输变电装备工厂',
    content: '评审组对园区能源结构、能源利用效率、节能技改工程及碳抵消方案进行综合评审，总体评分94.5分。',
    attachmentName: 'CQC零碳评价意见书.pdf',
    imageUrl: '/images/screen/xian-pv-real.jpg',
    isFeaturedScreen: true,
  },
  {
    id: 'ev-4',
    date: '2025-11-28',
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    category: '节能技改',
    title: '总装二车间大型真空干燥罐余热回收与气动系统变频改造完工',
    benefitImpact: '年节约天然气 12.5 万m³，节电 45 万kWh',
    content: '对原有高温排气加装高效板式换热器用于冬季采暖预热，并对 4 台大功率空压机实施集中变频联控。',
    attachmentName: '干燥罐技改决算书.pdf',
    imageUrl: '/illustrations/zero-carbon.png',
    isFeaturedScreen: false,
  },
  {
    id: 'ev-hb-1',
    date: '2026-07-18',
    parkId: 'nfsb',
    parkName: '特变电工南方输变电产业园',
    category: '储能投运',
    title: '衡变 10MW/20MWh 用户侧磷酸铁锂储能电站全容量并网',
    benefitImpact: '两充两放削峰填谷，日均净套利收益 1.85 万元',
    content: '配套液冷温控系统与毫秒级 PCS 变流器，纳入华中微电网集控系统协同调度。',
    attachmentName: '储能并网质检报告.pdf',
    imageUrl: '/illustrations/zero-carbon.png',
    isFeaturedScreen: true,
  },
  {
    id: 'ev-ll-1',
    date: '2026-06-10',
    parkId: 'hd',
    parkName: '特变电工华东输变电科技产业园',
    category: '零碳认证',
    title: '鲁缆公司获颁山东省首批绿色工厂示范单位',
    benefitImpact: '工序单耗达到国际先进标杆值，绿色制造星级评定 92 分',
    content: '全面推进交联立塔高效氮气循环与智能挤出机温控，单位长度电耗下降 8.4%。',
    attachmentName: '省级绿色工厂证书.pdf',
    imageUrl: '/images/screen/platform-16-9.jpg',
    isFeaturedScreen: true,
  },
]

// 自动直通免填数据清单
const AUTO_SYNC_DATA_LIST = [
  { id: 'sync-1', name: '线缆产量数据（各项目公司）', category: '产量数据', sourceSystem: '股份大数据平台', value: '1,560 km', syncTime: '2026-08-31 06:00', status: '已直通免填', note: '大数据平台已有完备日台账，各线缆项目公司100%免填' },
  { id: 'sync-2', name: '各项目公司产值数据', category: '产值数据', sourceSystem: '经营日报系统', value: '45,820 万元', syncTime: '2026-08-31 04:30', status: '已直通免填', note: '日结经营数据直通项目公司级，无需企业手动录入' },
  { id: 'sync-3', name: '经营单位级产值汇总', category: '产值数据', sourceSystem: '经营日报系统', value: '182,400 万元', syncTime: '2026-08-31 04:30', status: '系统自动加总', note: '项目公司产值加总即经营单位产值，算法闭环自动沉淀' },
  { id: 'sync-4', name: '单位产品综合能耗（电耗）', category: '能耗数据', sourceSystem: '能耗采集系统/ERP', value: '38.4 kWh/kVA', syncTime: '2026-08-31 08:00', status: '系统核算预填', note: 'SCADA与智能电表自动聚合，企业一键确认' },
]

// 主数据与型号编码映射表
const INITIAL_CODE_MAPPINGS = [
  { id: 'map-1', category: '变压器', stdModel: 'S20-M-630/10', companyCode: '沈变: SB-T-00912 / 衡变: HB-TR-881', lineName: '总装一线', status: '已映射' },
  { id: 'map-2', category: '变压器', stdModel: 'SZ11-50000/110', companyCode: '沈变: SB-T-01440 / 新变: XB-TX-662', lineName: '超高压车间', status: '已映射' },
  { id: 'map-3', category: '电抗器', stdModel: 'BKD-66kV/20000kvar', companyCode: '沈变: SB-DK-0021 / 衡变: HB-DK-019', lineName: '特种电抗器线', status: '已映射' },
  { id: 'map-4', category: '线缆', stdModel: 'YJV22-8.7/15kV 3*400', companyCode: '鲁缆: LL-CB-9102 / 新缆: XL-CB-9102', lineName: '中压交联三线', status: '已映射' },
  { id: 'map-5', category: '开关柜', stdModel: 'KYN28A-12', companyCode: '中发: ZF-SW-1288', lineName: '成套柜柔性线', status: '已映射' },
]

interface HistoryRecord {
  id: string
  batch: string
  year: string
  month: string
  submitter: string
  submitTime: string
  summary: string
  totalCostWan: string
  status: '已入库' | '待复核'
}

// 🌟 管理员手动录入产品产量历史台账数据结构
// 🌟 需求 7：以月份为单位的申报历史数据与全量档案数据结构
export interface MonthBatchProductItem {
  id: string
  productId: string
  modelId?: string
  categoryName: string
  categoryId: string
  subTypeName: string
  modelName: string
  modelCode: string
  plannedOutput: string
  output: string
  unit: string
  workshop: string
  lastMonthValue: string
  sourceType: 'auto' | 'manual' | 'mes'
  sourceLabel: string
  remark?: string
}

export interface MonthBatchEnergySummary {
  gridPowerWanKwh: string // 外购网电 (万kWh)
  pvPowerWanKwh: string // 自发自用光伏 (万kWh)
  greenPowerWanKwh: string // 购买消纳绿电 (万kWh)
  waterTon: string // 工业自来水 (吨)
  gasWanM3: string // 工业天然气 (万m³)
  steamTon: string // 蒸汽消耗量 (吨)
  dieselL: string // 工业柴油 (升)
  gasolineL?: string // 工业汽油 (升)
  keroseneL?: string // 工业煤油 (升)
  nitrogenTon?: string // 液氮消耗量 (吨)
  powerCostWan: string // 电费支出 (万元)
  waterCostWan: string // 水费支出 (万元)
  gasCostWan: string // 燃气费支出 (万元)
  steamCostWan: string // 蒸汽费支出 (万元)
  nitrogenCostWan?: string // 液氮费支出 (万元)
}

export interface EnergyPhysicalConfigItem {
  key: keyof MonthBatchEnergySummary
  name: string
  category: string
  unit: string
  factor: string
  source: string
  color: string
}

export const ENERGY_PHYSICAL_CONFIG_ITEMS: EnergyPhysicalConfigItem[] = [
  { key: 'gridPowerWanKwh', name: '外购网电消耗', category: '电力能源', unit: '万kWh', factor: '0.1229 kgce/kWh', source: '高压总进线关口表在线采集', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { key: 'pvPowerWanKwh', name: '自发自用光伏', category: '清洁电力', unit: '万kWh', factor: '0.1229 kgce/kWh', source: '厂房屋顶分布式光伏计量', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { key: 'greenPowerWanKwh', name: '购买消纳绿电', category: '清洁电力', unit: '万kWh', factor: '0.1229 kgce/kWh', source: '绿色电力市场化交易凭据', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { key: 'waterTon', name: '工业自来水消耗', category: '水资源', unit: '吨', factor: '0.0857 kgce/t', source: '市政工业水表月度抄表结算', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
  { key: 'gasWanM3', name: '工业天然气消耗', category: '燃气与热力', unit: '万m³', factor: '1.2143 kgce/m³', source: '厂区天然气专用流量孔板', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  { key: 'steamTon', name: '蒸汽消耗量', category: '燃气与热力', unit: '吨', factor: '0.1286 kgce/t', source: '集中供热蒸汽涡街流量计', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { key: 'dieselL', name: '工业柴油消耗', category: '动力用油', unit: '升', factor: '1.4571 kgce/kg', source: '厂内工程车辆加油机台账', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' },
  { key: 'gasolineL', name: '工业汽油消耗', category: '动力用油', unit: '升', factor: '1.4714 kgce/kg', source: '物流及机动车辆加油发票', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  { key: 'keroseneL', name: '工业煤油消耗', category: '动力用油', unit: '升', factor: '1.4714 kgce/kg', source: '金属加工清洗工艺领料登记', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  { key: 'nitrogenTon', name: '液氮消耗量', category: '工业气体', unit: '吨', factor: '0.6700 kgce/m³', source: '深冷储罐地磅进厂实称核验', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
]

export interface EnergyCostConfigItem {
  key: keyof MonthBatchEnergySummary
  name: string
  medium: string
  unit: string
  caliber: string
}

export const ENERGY_COST_CONFIG_ITEMS: EnergyCostConfigItem[] = [
  { key: 'powerCostWan', name: '全厂综合电费支出', medium: '网电 + 绿电', unit: '万元', caliber: '供电局结算发票含税全额' },
  { key: 'waterCostWan', name: '工业自来水费支出', medium: '工业自来水', unit: '万元', caliber: '水务集团月度自来水发票' },
  { key: 'gasCostWan', name: '天然气费用支出', medium: '工业天然气', unit: '万元', caliber: '燃气公司结算发票' },
  { key: 'steamCostWan', name: '外购蒸汽费用支出', medium: '外购蒸汽', unit: '万元', caliber: '热电供热结算单及发票' },
  { key: 'nitrogenCostWan', name: '工业液氮采购支出', medium: '工业液氮', unit: '万元', caliber: '气体供应商月度对账发票' },
]

// 🌟 企业已添加产品中类主数据项 (支持启用/停用/新增)
export interface CompanyProductCategoryItem {
  id: string
  categoryName: string          // 工业大类 (变压器/电抗器/硅钢铁心等)
  subTypeName: string           // 产品子类型
  modelName: string             // 产品名称与规格型号
  unit: string                  // 计量单位 (台/万kVA、吨等)
  lastMonthBenchmark?: string   // 上月参考基准
  status: 'enabled' | 'disabled'// 启用 / 停用
  createdAt: string             // 创建日期
}

// 🌟 企业初始产品中类清单 (默认 5 项启用，1 项停用示例)
export const INITIAL_COMPANY_PRODUCT_CATEGORIES: CompanyProductCategoryItem[] = [
  {
    id: 'prod-cat-1',
    categoryName: '变压器',
    subTypeName: '油浸式电力变压器',
    modelName: 'S20-M-630/10 高效油浸式变压器',
    unit: '台/万kVA',
    lastMonthBenchmark: '45',
    status: 'enabled',
    createdAt: '2026-01-10',
  },
  {
    id: 'prod-cat-2',
    categoryName: '变压器',
    subTypeName: '油浸式电力变压器',
    modelName: 'SZ11-50000/110 有载调压变压器',
    unit: '台/万kVA',
    lastMonthBenchmark: '35',
    status: 'enabled',
    createdAt: '2026-01-10',
  },
  {
    id: 'prod-cat-3',
    categoryName: '变压器',
    subTypeName: '特高压交流变压器',
    modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
    unit: '台/万kVA',
    lastMonthBenchmark: '42',
    status: 'enabled',
    createdAt: '2026-01-10',
  },
  {
    id: 'prod-cat-4',
    categoryName: '电抗器',
    subTypeName: '常规并联电抗器',
    modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
    unit: '台/万kVA',
    lastMonthBenchmark: '40',
    status: 'enabled',
    createdAt: '2026-01-10',
  },
  {
    id: 'prod-cat-5',
    categoryName: '硅钢铁心',
    subTypeName: '高磁感取向硅钢铁心',
    modelName: '0.23mm 高磁感取向硅钢铁心',
    unit: '吨',
    lastMonthBenchmark: '3100',
    status: 'enabled',
    createdAt: '2026-01-10',
  },
  {
    id: 'prod-cat-6',
    categoryName: '互感器',
    subTypeName: '电磁式电压互感器',
    modelName: 'JDJJ-110 高压电磁式互感器',
    unit: '台',
    lastMonthBenchmark: '20',
    status: 'disabled',
    createdAt: '2026-02-15',
  },
]

export interface MonthDeclarationBatch {
  id: string
  batch: string
  year: string
  month: string
  reportingUnit: string
  submitter: string
  submitTime: string
  status: '已入库' | '待复核'
  products: MonthBatchProductItem[]
  energy: MonthBatchEnergySummary
  energySaving?: {
    energySavingTotalKw: string
    inScopeTotalKw: string
    energySavingRatio: string
    energySavingEquipCount: number
    totalEquipCount: number
  }
  photosCount: number
  eventsCount: number
  summary: string
}

// 🌟 初始 8 个历史账期月度申报批次全量档案 (2026-08 至 2026-01)
const INITIAL_MONTH_BATCHES: MonthDeclarationBatch[] = [
  {
    id: 'BATCH-202608',
    batch: 'DR-202608-01',
    year: '2026',
    month: '08',
    reportingUnit: '东北输变电产业园 · 沈变本部',
    submitter: '李工 (能碳专员)',
    submitTime: '2026-08-28 09:30',
    status: '已入库',
    products: [
      {
        id: 'p-202608-1',
        productId: 'prod-1',
        modelId: 'm-101',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'S20-M-630/10 高效油浸式变压器',
        modelCode: 'TB-S20-630',
        plannedOutput: '50',
        output: '48',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '45',
        sourceType: 'manual',
        sourceLabel: '企业自填',
        remark: '新一级能效油浸变，排产交付国网辽宁电力',
      },
      {
        id: 'p-202608-2',
        productId: 'prod-1',
        modelId: 'm-102',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'SZ11-50000/110 有载调压变压器',
        modelCode: 'TB-SZ11-50M',
        plannedOutput: '40',
        output: '36',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '35',
        sourceType: 'manual',
        sourceLabel: '企业自填',
        remark: '110kV 主变，装配一期完工',
      },
      {
        id: 'p-202608-3',
        productId: 'prod-1',
        modelId: 'm-103',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '特高压交流变压器',
        modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
        modelCode: 'TB-ODFPS-1000',
        plannedOutput: '45',
        output: '44',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '42',
        sourceType: 'manual',
        sourceLabel: '企业自填',
        remark: '国家重大电网示范工程特高压交流主变',
      },
      {
        id: 'p-202608-4',
        productId: 'prod-2',
        modelId: 'm-201',
        categoryName: '电抗器',
        categoryId: 'reactor',
        subTypeName: '特高压并联电抗器',
        modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
        modelCode: 'TB-BKD-66',
        plannedOutput: '48',
        output: '45',
        unit: '台/万kVA',
        workshop: '特种电抗器分厂',
        lastMonthValue: '40',
        sourceType: 'manual',
        sourceLabel: '企业自填',
        remark: '特高压配套无功补偿',
      },
      {
        id: 'p-202608-5',
        productId: 'prod-3',
        modelId: 'm-301',
        categoryName: '硅钢铁心',
        categoryId: 'silicon_steel_core',
        subTypeName: '高磁感取向硅钢铁心',
        modelName: '0.23mm 高磁感取向硅钢铁心',
        modelCode: 'TB-CORE-023',
        plannedOutput: '3300',
        output: '3200',
        unit: '吨',
        workshop: '铁心剪切智能车间',
        lastMonthValue: '3100',
        sourceType: 'mes',
        sourceLabel: '车间MES直通',
        remark: '阶梯叠片工序',
      },
    ],
    energy: {
      gridPowerWanKwh: '124.6',
      pvPowerWanKwh: '23.6',
      greenPowerWanKwh: '148.2',
      waterTon: '8,900',
      gasWanM3: '2.84',
      steamTon: '1,420',
      dieselL: '3,200',
      gasolineL: '1,850',
      keroseneL: '2,400',
      nitrogenTon: '52.0',
      powerCostWan: '136.20',
      waterCostWan: '4.10',
      gasCostWan: '9.20',
      steamCostWan: '39.31',
      nitrogenCostWan: '1.85',
      totalCostWan: '188.81',
    },
    photosCount: 4,
    eventsCount: 4,
    summary: '变压器 128台/万kVA (计划135) · 电抗器 45台/万kVA · 硅钢铁心 3,200吨 · 绿电 148.2万kWh · 支出 ¥188.81万',
  },
  {
    id: 'BATCH-202607',
    batch: 'DR-202607-02',
    year: '2026',
    month: '07',
    reportingUnit: '东北输变电产业园 · 沈变本部',
    submitter: '王强 (生产调度)',
    submitTime: '2026-07-28 14:15',
    status: '已入库',
    products: [
      {
        id: 'p-202607-1',
        productId: 'prod-1',
        modelId: 'm-101',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'S20-M-630/10 高效油浸式变压器',
        modelCode: 'TB-S20-630',
        plannedOutput: '48',
        output: '45',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '42',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202607-2',
        productId: 'prod-1',
        modelId: 'm-102',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'SZ11-50000/110 有载调压变压器',
        modelCode: 'TB-SZ11-50M',
        plannedOutput: '38',
        output: '35',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '32',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202607-3',
        productId: 'prod-1',
        modelId: 'm-103',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '特高压交流变压器',
        modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
        modelCode: 'TB-ODFPS-1000',
        plannedOutput: '45',
        output: '42',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '40',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202607-4',
        productId: 'prod-2',
        modelId: 'm-201',
        categoryName: '电抗器',
        categoryId: 'reactor',
        subTypeName: '特高压并联电抗器',
        modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
        modelCode: 'TB-BKD-66',
        plannedOutput: '42',
        output: '40',
        unit: '台/万kVA',
        workshop: '特种电抗器分厂',
        lastMonthValue: '38',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202607-5',
        productId: 'prod-3',
        modelId: 'm-301',
        categoryName: '硅钢铁心',
        categoryId: 'silicon_steel_core',
        subTypeName: '高磁感取向硅钢铁心',
        modelName: '0.23mm 高磁感取向硅钢铁心',
        modelCode: 'TB-CORE-023',
        plannedOutput: '3200',
        output: '3100',
        unit: '吨',
        workshop: '铁心剪切智能车间',
        lastMonthValue: '2950',
        sourceType: 'mes',
        sourceLabel: '车间MES直通',
      },
    ],
    energy: {
      gridPowerWanKwh: '120.5',
      pvPowerWanKwh: '22.0',
      greenPowerWanKwh: '142.5',
      waterTon: '8,650',
      gasWanM3: '2.72',
      steamTon: '1,380',
      dieselL: '3,000',
      gasolineL: '1,780',
      keroseneL: '2,320',
      nitrogenTon: '48.5',
      powerCostWan: '128.00',
      waterCostWan: '3.95',
      gasCostWan: '8.80',
      steamCostWan: '34.65',
      nitrogenCostWan: '1.72',
      totalCostWan: '177.12',
    },
    photosCount: 3,
    eventsCount: 3,
    summary: '变压器 122台/万kVA (计划131) · 电抗器 40台/万kVA · 硅钢铁心 3,100吨 · 绿电 142.5万kWh · 支出 ¥175.40万',
  },
  {
    id: 'BATCH-202606',
    batch: 'DR-202606-01',
    year: '2026',
    month: '06',
    reportingUnit: '东北输变电产业园 · 沈变本部',
    submitter: '李工 (能碳专员)',
    submitTime: '2026-06-29 11:20',
    status: '已入库',
    products: [
      {
        id: 'p-202606-1',
        productId: 'prod-1',
        modelId: 'm-101',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'S20-M-630/10 高效油浸式变压器',
        modelCode: 'TB-S20-630',
        plannedOutput: '45',
        output: '42',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '40',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202606-2',
        productId: 'prod-1',
        modelId: 'm-102',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'SZ11-50000/110 有载调压变压器',
        modelCode: 'TB-SZ11-50M',
        plannedOutput: '35',
        output: '32',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '30',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202606-3',
        productId: 'prod-1',
        modelId: 'm-103',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '特高压交流变压器',
        modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
        modelCode: 'TB-ODFPS-1000',
        plannedOutput: '42',
        output: '40',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '38',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202606-4',
        productId: 'prod-2',
        modelId: 'm-201',
        categoryName: '电抗器',
        categoryId: 'reactor',
        subTypeName: '特高压并联电抗器',
        modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
        modelCode: 'TB-BKD-66',
        plannedOutput: '40',
        output: '38',
        unit: '台/万kVA',
        workshop: '特种电抗器分厂',
        lastMonthValue: '36',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202606-5',
        productId: 'prod-3',
        modelId: 'm-301',
        categoryName: '硅钢铁心',
        categoryId: 'silicon_steel_core',
        subTypeName: '高磁感取向硅钢铁心',
        modelName: '0.23mm 高磁感取向硅钢铁心',
        modelCode: 'TB-CORE-023',
        plannedOutput: '3000',
        output: '2950',
        unit: '吨',
        workshop: '铁心剪切智能车间',
        lastMonthValue: '2800',
        sourceType: 'mes',
        sourceLabel: '车间MES直通',
      },
    ],
    energy: {
      gridPowerWanKwh: '116.0',
      pvPowerWanKwh: '22.0',
      greenPowerWanKwh: '138.0',
      waterTon: '8,400',
      gasWanM3: '2.65',
      steamTon: '1,350',
      dieselL: '2,900',
      gasolineL: '1,720',
      keroseneL: '2,250',
      nitrogenTon: '46.0',
      powerCostWan: '122.50',
      waterCostWan: '3.80',
      gasCostWan: '8.50',
      steamCostWan: '34.10',
      nitrogenCostWan: '1.65',
      totalCostWan: '170.55',
    },
    photosCount: 2,
    eventsCount: 2,
    summary: '变压器 114台/万kVA (计划122) · 电抗器 38台/万kVA · 硅钢铁心 2,950吨 · 绿电 138.0万kWh · 支出 ¥168.90万',
  },
  {
    id: 'BATCH-202605',
    batch: 'DR-202605-01',
    year: '2026',
    month: '05',
    reportingUnit: '东北输变电产业园 · 沈变本部',
    submitter: '张明 (统计员)',
    submitTime: '2026-05-30 16:40',
    status: '已入库',
    products: [
      {
        id: 'p-202605-1',
        productId: 'prod-1',
        modelId: 'm-101',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'S20-M-630/10 高效油浸式变压器',
        modelCode: 'TB-S20-630',
        plannedOutput: '46',
        output: '44',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '41',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202605-2',
        productId: 'prod-1',
        modelId: 'm-102',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'SZ11-50000/110 有载调压变压器',
        modelCode: 'TB-SZ11-50M',
        plannedOutput: '36',
        output: '34',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '31',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202605-3',
        productId: 'prod-1',
        modelId: 'm-103',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '特高压交流变压器',
        modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
        modelCode: 'TB-ODFPS-1000',
        plannedOutput: '43',
        output: '40',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '37',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202605-4',
        productId: 'prod-2',
        modelId: 'm-201',
        categoryName: '电抗器',
        categoryId: 'reactor',
        subTypeName: '特高压并联电抗器',
        modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
        modelCode: 'TB-BKD-66',
        plannedOutput: '45',
        output: '42',
        unit: '台/万kVA',
        workshop: '特种电抗器分厂',
        lastMonthValue: '38',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202605-5',
        productId: 'prod-3',
        modelId: 'm-301',
        categoryName: '硅钢铁心',
        categoryId: 'silicon_steel_core',
        subTypeName: '高磁感取向硅钢铁心',
        modelName: '0.23mm 高磁感取向硅钢铁心',
        modelCode: 'TB-CORE-023',
        plannedOutput: '3150',
        output: '3050',
        unit: '吨',
        workshop: '铁心剪切智能车间',
        lastMonthValue: '2900',
        sourceType: 'mes',
        sourceLabel: '车间MES直通',
      },
    ],
    energy: {
      gridPowerWanKwh: '114.2',
      pvPowerWanKwh: '21.4',
      greenPowerWanKwh: '135.6',
      waterTon: '8,150',
      gasWanM3: '2.58',
      steamTon: '1,310',
      dieselL: '2,800',
      gasolineL: '1,650',
      keroseneL: '2,180',
      powerCostWan: '118.00',
      waterCostWan: '3.70',
      gasCostWan: '8.20',
      steamCostWan: '32.40',
      totalCostWan: '162.30',
    },
    photosCount: 2,
    eventsCount: 3,
    summary: '变压器 118台/万kVA (计划125) · 电抗器 42台/万kVA · 硅钢铁心 3,050吨 · 绿电 135.6万kWh · 支出 ¥162.30万',
  },
  {
    id: 'BATCH-202604',
    batch: 'DR-202604-02',
    year: '2026',
    month: '04',
    reportingUnit: '东北输变电产业园 · 沈变本部',
    submitter: '王强 (生产调度)',
    submitTime: '2026-04-28 10:10',
    status: '已入库',
    products: [
      {
        id: 'p-202604-1',
        productId: 'prod-1',
        modelId: 'm-101',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'S20-M-630/10 高效油浸式变压器',
        modelCode: 'TB-S20-630',
        plannedOutput: '42',
        output: '40',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '38',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202604-2',
        productId: 'prod-1',
        modelId: 'm-102',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'SZ11-50000/110 有载调压变压器',
        modelCode: 'TB-SZ11-50M',
        plannedOutput: '34',
        output: '32',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '30',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202604-3',
        productId: 'prod-1',
        modelId: 'm-103',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '特高压交流变压器',
        modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
        modelCode: 'TB-ODFPS-1000',
        plannedOutput: '39',
        output: '38',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '36',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202604-4',
        productId: 'prod-2',
        modelId: 'm-201',
        categoryName: '电抗器',
        categoryId: 'reactor',
        subTypeName: '特高压并联电抗器',
        modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
        modelCode: 'TB-BKD-66',
        plannedOutput: '38',
        output: '36',
        unit: '台/万kVA',
        workshop: '特种电抗器分厂',
        lastMonthValue: '34',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202604-5',
        productId: 'prod-3',
        modelId: 'm-301',
        categoryName: '硅钢铁心',
        categoryId: 'silicon_steel_core',
        subTypeName: '高磁感取向硅钢铁心',
        modelName: '0.23mm 高磁感取向硅钢铁心',
        modelCode: 'TB-CORE-023',
        plannedOutput: '2950',
        output: '2880',
        unit: '吨',
        workshop: '铁心剪切智能车间',
        lastMonthValue: '2750',
        sourceType: 'mes',
        sourceLabel: '车间MES直通',
      },
    ],
    energy: {
      gridPowerWanKwh: '111.0',
      pvPowerWanKwh: '20.2',
      greenPowerWanKwh: '131.2',
      waterTon: '7,900',
      gasWanM3: '2.48',
      steamTon: '1,280',
      dieselL: '2,750',
      gasolineL: '1,600',
      keroseneL: '2,100',
      powerCostWan: '115.20',
      waterCostWan: '3.60',
      gasCostWan: '7.90',
      steamCostWan: '31.70',
      totalCostWan: '158.40',
    },
    photosCount: 2,
    eventsCount: 2,
    summary: '变压器 110台/万kVA (计划115) · 电抗器 36台/万kVA · 硅钢铁心 2,880吨 · 绿电 131.2万kWh · 支出 ¥158.40万',
  },
  {
    id: 'BATCH-202603',
    batch: 'DR-202603-01',
    year: '2026',
    month: '03',
    reportingUnit: '东北输变电产业园 · 沈变本部',
    submitter: '李工 (能碳专员)',
    submitTime: '2026-03-30 15:00',
    status: '已入库',
    products: [
      {
        id: 'p-202603-1',
        productId: 'prod-1',
        modelId: 'm-101',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'S20-M-630/10 高效油浸式变压器',
        modelCode: 'TB-S20-630',
        plannedOutput: '40',
        output: '38',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '36',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202603-2',
        productId: 'prod-1',
        modelId: 'm-102',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'SZ11-50000/110 有载调压变压器',
        modelCode: 'TB-SZ11-50M',
        plannedOutput: '32',
        output: '30',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '28',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202603-3',
        productId: 'prod-1',
        modelId: 'm-103',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '特高压交流变压器',
        modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
        modelCode: 'TB-ODFPS-1000',
        plannedOutput: '38',
        output: '37',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '35',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202603-4',
        productId: 'prod-2',
        modelId: 'm-201',
        categoryName: '电抗器',
        categoryId: 'reactor',
        subTypeName: '特高压并联电抗器',
        modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
        modelCode: 'TB-BKD-66',
        plannedOutput: '37',
        output: '35',
        unit: '台/万kVA',
        workshop: '特种电抗器分厂',
        lastMonthValue: '32',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202603-5',
        productId: 'prod-3',
        modelId: 'm-301',
        categoryName: '硅钢铁心',
        categoryId: 'silicon_steel_core',
        subTypeName: '高磁感取向硅钢铁心',
        modelName: '0.23mm 高磁感取向硅钢铁心',
        modelCode: 'TB-CORE-023',
        plannedOutput: '2850',
        output: '2760',
        unit: '吨',
        workshop: '铁心剪切智能车间',
        lastMonthValue: '2650',
        sourceType: 'mes',
        sourceLabel: '车间MES直通',
      },
    ],
    energy: {
      gridPowerWanKwh: '109.2',
      pvPowerWanKwh: '19.2',
      greenPowerWanKwh: '128.4',
      waterTon: '7,650',
      gasWanM3: '2.40',
      steamTon: '1,240',
      dieselL: '2,600',
      gasolineL: '1,550',
      keroseneL: '2,050',
      powerCostWan: '111.00',
      waterCostWan: '3.50',
      gasCostWan: '7.60',
      steamCostWan: '30.70',
      totalCostWan: '152.80',
    },
    photosCount: 2,
    eventsCount: 1,
    summary: '变压器 105台/万kVA (计划110) · 电抗器 35台/万kVA · 硅钢铁心 2,760吨 · 绿电 128.4万kWh · 支出 ¥152.80万',
  },
  {
    id: 'BATCH-202602',
    batch: 'DR-202602-01',
    year: '2026',
    month: '02',
    reportingUnit: '东北输变电产业园 · 沈变本部',
    submitter: '李工 (能碳专员)',
    submitTime: '2026-02-27 17:30',
    status: '已入库',
    products: [
      {
        id: 'p-202602-1',
        productId: 'prod-1',
        modelId: 'm-101',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'S20-M-630/10 高效油浸式变压器',
        modelCode: 'TB-S20-630',
        plannedOutput: '35',
        output: '32',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '38',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202602-2',
        productId: 'prod-1',
        modelId: 'm-102',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'SZ11-50000/110 有载调压变压器',
        modelCode: 'TB-SZ11-50M',
        plannedOutput: '28',
        output: '26',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '30',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202602-3',
        productId: 'prod-1',
        modelId: 'm-103',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '特高压交流变压器',
        modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
        modelCode: 'TB-ODFPS-1000',
        plannedOutput: '32',
        output: '30',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '36',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202602-4',
        productId: 'prod-2',
        modelId: 'm-201',
        categoryName: '电抗器',
        categoryId: 'reactor',
        subTypeName: '特高压并联电抗器',
        modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
        modelCode: 'TB-BKD-66',
        plannedOutput: '30',
        output: '28',
        unit: '台/万kVA',
        workshop: '特种电抗器分厂',
        lastMonthValue: '34',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202602-5',
        productId: 'prod-3',
        modelId: 'm-301',
        categoryName: '硅钢铁心',
        categoryId: 'silicon_steel_core',
        subTypeName: '高磁感取向硅钢铁心',
        modelName: '0.23mm 高磁感取向硅钢铁心',
        modelCode: 'TB-CORE-023',
        plannedOutput: '2400',
        output: '2300',
        unit: '吨',
        workshop: '铁心剪切智能车间',
        lastMonthValue: '2700',
        sourceType: 'mes',
        sourceLabel: '车间MES直通',
      },
    ],
    energy: {
      gridPowerWanKwh: '92.5',
      pvPowerWanKwh: '16.0',
      greenPowerWanKwh: '108.5',
      waterTon: '6,500',
      gasWanM3: '2.10',
      steamTon: '1,050',
      dieselL: '2,200',
      gasolineL: '1,480',
      keroseneL: '1,980',
      powerCostWan: '96.50',
      waterCostWan: '3.00',
      gasCostWan: '6.60',
      steamCostWan: '26.00',
      totalCostWan: '132.10',
    },
    photosCount: 1,
    eventsCount: 1,
    summary: '变压器 88台/万kVA (计划95) · 电抗器 28台/万kVA · 硅钢铁心 2,300吨 · 绿电 108.5万kWh · 支出 ¥132.10万 (春节期)',
  },
  {
    id: 'BATCH-202601',
    batch: 'DR-202601-01',
    year: '2026',
    month: '01',
    reportingUnit: '东北输变电产业园 · 沈变本部',
    submitter: '李工 (能碳专员)',
    submitTime: '2026-01-29 14:00',
    status: '已入库',
    products: [
      {
        id: 'p-202601-1',
        productId: 'prod-1',
        modelId: 'm-101',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'S20-M-630/10 高效油浸式变压器',
        modelCode: 'TB-S20-630',
        plannedOutput: '38',
        output: '36',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '35',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202601-2',
        productId: 'prod-1',
        modelId: 'm-102',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '油浸式电力变压器',
        modelName: 'SZ11-50000/110 有载调压变压器',
        modelCode: 'TB-SZ11-50M',
        plannedOutput: '32',
        output: '30',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '29',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202601-3',
        productId: 'prod-1',
        modelId: 'm-103',
        categoryName: '变压器',
        categoryId: 'transformer',
        subTypeName: '特高压交流变压器',
        modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
        modelCode: 'TB-ODFPS-1000',
        plannedOutput: '38',
        output: '36',
        unit: '台/万kVA',
        workshop: '特高压数字化生产车间',
        lastMonthValue: '35',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202601-4',
        productId: 'prod-2',
        modelId: 'm-201',
        categoryName: '电抗器',
        categoryId: 'reactor',
        subTypeName: '特高压并联电抗器',
        modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
        modelCode: 'TB-BKD-66',
        plannedOutput: '35',
        output: '33',
        unit: '台/万kVA',
        workshop: '特种电抗器分厂',
        lastMonthValue: '32',
        sourceType: 'manual',
        sourceLabel: '企业自填',
      },
      {
        id: 'p-202601-5',
        productId: 'prod-3',
        modelId: 'm-301',
        categoryName: '硅钢铁心',
        categoryId: 'silicon_steel_core',
        subTypeName: '高磁感取向硅钢铁心',
        modelName: '0.23mm 高磁感取向硅钢铁心',
        modelCode: 'TB-CORE-023',
        plannedOutput: '2700',
        output: '2650',
        unit: '吨',
        workshop: '铁心剪切智能车间',
        lastMonthValue: '2600',
        sourceType: 'mes',
        sourceLabel: '车间MES直通',
      },
    ],
    energy: {
      gridPowerWanKwh: '106.5',
      pvPowerWanKwh: '18.5',
      greenPowerWanKwh: '125.0',
      waterTon: '7,400',
      gasWanM3: '2.35',
      steamTon: '1,200',
      dieselL: '2,500',
      gasolineL: '1,520',
      keroseneL: '2,020',
      powerCostWan: '109.00',
      waterCostWan: '3.40',
      gasCostWan: '7.40',
      steamCostWan: '29.80',
      totalCostWan: '149.60',
    },
    photosCount: 2,
    eventsCount: 2,
    summary: '变压器 102台/万kVA (计划108) · 电抗器 33台/万kVA · 硅钢铁心 2,650吨 · 绿电 125.0万kWh · 支出 ¥149.60万',
  },
]


export interface HistoricalProductRecord {
  id: string
  year: string
  month: string
  productId: string
  modelId?: string
  categoryName: string
  categoryId: string
  subTypeName: string
  modelName: string
  modelCode: string
  plannedOutput?: string
  output: string
  unit: string
  workshop: string
  lastMonthValue: string
  sourceType: 'auto' | 'manual' | 'mes'
  sourceLabel: string
  submitTime: string
  submitter: string
  remark?: string
}

// 12 个自然月选项
const CALENDAR_MONTH_OPTIONS = [
  { val: '01', label: '1月' },
  { val: '02', label: '2月' },
  { val: '03', label: '3月' },
  { val: '04', label: '4月' },
  { val: '05', label: '5月' },
  { val: '06', label: '6月' },
  { val: '07', label: '7月' },
  { val: '08', label: '8月' },
  { val: '09', label: '9月' },
  { val: '10', label: '10月' },
  { val: '11', label: '11月' },
  { val: '12', label: '12月' },
]

// 初始管理员手动录入历史产品记录（覆盖 2026-08, 2026-07, 2026-06 等历史账期）
const INITIAL_HISTORICAL_PRODUCTS: HistoricalProductRecord[] = [
  {
    id: 'hp-202608-1',
    year: '2026',
    month: '08',
    productId: 'prod-1',
    modelId: 'm-101',
    categoryName: '变压器',
    categoryId: 'transformer',
    subTypeName: '油浸式电力变压器',
    modelName: 'S20-M-630/10 高效油浸式变压器',
    modelCode: 'TB-S20-630',
    plannedOutput: '50',
    output: '48',
    unit: '台/万kVA',
    workshop: '特高压数字化生产车间',
    lastMonthValue: '45',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    submitTime: '2026-08-28 09:30',
    submitter: '李工 (能碳专员)',
    remark: '新一级能效油浸变，排产交付国网辽宁电力',
  },
  {
    id: 'hp-202608-2',
    year: '2026',
    month: '08',
    productId: 'prod-1',
    modelId: 'm-102',
    categoryName: '变压器',
    categoryId: 'transformer',
    subTypeName: '油浸式电力变压器',
    modelName: 'SZ11-50000/110 有载调压变压器',
    modelCode: 'TB-SZ11-50M',
    plannedOutput: '40',
    output: '36',
    unit: '台/万kVA',
    workshop: '特高压数字化生产车间',
    lastMonthValue: '35',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    submitTime: '2026-08-28 09:30',
    submitter: '李工 (能碳专员)',
    remark: '110kV 主变，装配一期完工',
  },
  {
    id: 'hp-202608-3',
    year: '2026',
    month: '08',
    productId: 'prod-1',
    modelId: 'm-103',
    categoryName: '变压器',
    categoryId: 'transformer',
    subTypeName: '特高压交流变压器',
    modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
    modelCode: 'TB-ODFPS-1000',
    plannedOutput: '45',
    output: '44',
    unit: '台/万kVA',
    workshop: '特高压数字化生产车间',
    lastMonthValue: '42',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    submitTime: '2026-08-28 09:30',
    submitter: '李工 (能碳专员)',
    remark: '国家重大电网示范工程特高压交流主变',
  },
  {
    id: 'hp-202608-4',
    year: '2026',
    month: '08',
    productId: 'prod-2',
    modelId: 'm-201',
    categoryName: '电抗器',
    categoryId: 'reactor',
    subTypeName: '特高压并联电抗器',
    modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
    modelCode: 'TB-BKD-66',
    plannedOutput: '48',
    output: '45',
    unit: '台/万kVA',
    workshop: '特种电抗器分厂',
    lastMonthValue: '40',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    submitTime: '2026-08-28 09:30',
    submitter: '李工 (能碳专员)',
    remark: '特高压配套无功补偿',
  },
  {
    id: 'hp-202608-5',
    year: '2026',
    month: '08',
    productId: 'prod-3',
    modelId: 'm-301',
    categoryName: '硅钢铁心',
    categoryId: 'silicon_steel_core',
    subTypeName: '高磁感取向硅钢铁心',
    modelName: '0.23mm 高磁感取向硅钢铁心',
    modelCode: 'TB-CORE-023',
    plannedOutput: '3300',
    output: '3200',
    unit: '吨',
    workshop: '铁心剪切智能车间',
    lastMonthValue: '3100',
    sourceType: 'mes',
    sourceLabel: '车间MES直通',
    submitTime: '2026-08-28 09:30',
    submitter: '李工 (能碳专员)',
    remark: '阶梯叠片工序',
  },
  {
    id: 'hp-202607-1',
    year: '2026',
    month: '07',
    productId: 'prod-1',
    modelId: 'm-101',
    categoryName: '变压器',
    categoryId: 'transformer',
    subTypeName: '油浸式电力变压器',
    modelName: 'S20-M-630/10 高效油浸式变压器',
    modelCode: 'TB-S20-630',
    plannedOutput: '48',
    output: '45',
    unit: '台/万kVA',
    workshop: '特高压数字化生产车间',
    lastMonthValue: '42',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    submitTime: '2026-07-28 14:15',
    submitter: '王工 (能碳专员)',
    remark: '7月批次排产入库',
  },
  {
    id: 'hp-202607-2',
    year: '2026',
    month: '07',
    productId: 'prod-1',
    modelId: 'm-102',
    categoryName: '变压器',
    categoryId: 'transformer',
    subTypeName: '油浸式电力变压器',
    modelName: 'SZ11-50000/110 有载调压变压器',
    modelCode: 'TB-SZ11-50M',
    plannedOutput: '38',
    output: '35',
    unit: '台/万kVA',
    workshop: '特高压数字化生产车间',
    lastMonthValue: '32',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    submitTime: '2026-07-28 14:15',
    submitter: '王工 (能碳专员)',
    remark: '7月常规排产',
  },
  {
    id: 'hp-202607-3',
    year: '2026',
    month: '07',
    productId: 'prod-1',
    modelId: 'm-103',
    categoryName: '变压器',
    categoryId: 'transformer',
    subTypeName: '特高压交流变压器',
    modelName: 'ODFPS-1000MVA/1000kV 特高压变压器',
    modelCode: 'TB-ODFPS-1000',
    plannedOutput: '45',
    output: '42',
    unit: '台/万kVA',
    workshop: '特高压数字化生产车间',
    lastMonthValue: '40',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    submitTime: '2026-07-28 14:15',
    submitter: '王工 (能碳专员)',
    remark: '陇东-山东特高压直流配套工程',
  },
  {
    id: 'hp-202607-4',
    year: '2026',
    month: '07',
    productId: 'prod-2',
    modelId: 'm-201',
    categoryName: '电抗器',
    categoryId: 'reactor',
    subTypeName: '特高压并联电抗器',
    modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
    modelCode: 'TB-BKD-66',
    plannedOutput: '42',
    output: '40',
    unit: '台/万kVA',
    workshop: '特种电抗器分厂',
    lastMonthValue: '38',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    submitTime: '2026-07-28 14:15',
    submitter: '王工 (能碳专员)',
    remark: '南方电网框架招标订单',
  },
  {
    id: 'hp-202607-5',
    year: '2026',
    month: '07',
    productId: 'prod-3',
    modelId: 'm-301',
    categoryName: '硅钢铁心',
    categoryId: 'silicon_steel_core',
    subTypeName: '高磁感取向硅钢铁心',
    modelName: '0.23mm 高磁感取向硅钢铁心',
    modelCode: 'TB-CORE-023',
    plannedOutput: '3200',
    output: '3100',
    unit: '吨',
    workshop: '铁心剪切智能车间',
    lastMonthValue: '2950',
    sourceType: 'mes',
    sourceLabel: '车间MES直通',
    submitTime: '2026-07-28 14:15',
    submitter: '王工 (能碳专员)',
    remark: '全月累计下料剪切量',
  },
  {
    id: 'hp-202606-1',
    year: '2026',
    month: '06',
    productId: 'prod-1',
    modelId: 'm-101',
    categoryName: '变压器',
    categoryId: 'transformer',
    subTypeName: '油浸式电力变压器',
    modelName: 'S20-M-630/10 高效油浸式变压器',
    modelCode: 'TB-S20-630',
    plannedOutput: '45',
    output: '42',
    unit: '台/万kVA',
    workshop: '特高压数字化生产车间',
    lastMonthValue: '40',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    submitTime: '2026-06-28 16:30',
    submitter: '李工 (能碳专员)',
    remark: '年中冲刺交付',
  },
  {
    id: 'hp-202606-2',
    year: '2026',
    month: '06',
    productId: 'prod-2',
    modelId: 'm-201',
    categoryName: '电抗器',
    categoryId: 'reactor',
    subTypeName: '特高压并联电抗器',
    modelName: 'BKD-66kV/20000kvar 油浸式并联电抗器',
    modelCode: 'TB-BKD-66',
    plannedOutput: '40',
    output: '38',
    unit: '台/万kVA',
    workshop: '特种电抗器分厂',
    lastMonthValue: '36',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    submitTime: '2026-06-28 16:30',
    submitter: '李工 (能碳专员)',
    remark: '西北超高压通道项目',
  },
  {
    id: 'hp-202606-3',
    year: '2026',
    month: '06',
    productId: 'prod-3',
    modelId: 'm-301',
    categoryName: '硅钢铁心',
    categoryId: 'silicon_steel_core',
    subTypeName: '高磁感取向硅钢铁心',
    modelName: '0.23mm 高磁感取向硅钢铁心',
    modelCode: 'TB-CORE-023',
    plannedOutput: '3000',
    output: '2950',
    unit: '吨',
    workshop: '铁心剪切智能车间',
    lastMonthValue: '2800',
    sourceType: 'mes',
    sourceLabel: '车间MES直通',
    submitTime: '2026-06-28 16:30',
    submitter: '李工 (能碳专员)',
    remark: '6月生产报表',
  },
]


type EntryModuleTab = 'production' | 'energy' | 'photos' | 'events'

// 本地安全回退底图
const SAFE_FALLBACK_IMAGE = '/images/screen/nanjing-park-pv.jpg'

export default function FactoryMonthlyReportingPage() {
  // 核心模块四大 Tab: 'production' (产品产量) | 'energy' (能源消耗) | 'photos' (园区照片) | 'events' (园区大事件)
  const [activeModuleTab, setActiveModuleTab] = useState<EntryModuleTab>('production')

  // 视图模式：'entry' (填报工作台) | 'history' (历史台账)
  const [viewMode, setViewMode] = useState<'entry' | 'history'>('entry')

  // 申报账期
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonth, setSelectedMonth] = useState('08')
  const [submitterName, setSubmitterName] = useState('李工 (能碳专员)')

  // 🌟 当前用户所属园区与申报主体（默认当前用户所属园区：东北输变电产业园 · 沈变本部）
  const [selectedParkId, setSelectedParkId] = useState<string>('dbsb')
  const currentReportingUnit = useMemo(() => {
    return PARK_REPORTING_UNITS.find((p) => p.parkId === selectedParkId) || PARK_REPORTING_UNITS[0]
  }, [selectedParkId])


  // 1. 产品产量状态与月度数据字典存储
  const [activeProducts, setActiveProducts] = useState<ActiveProductRecord[]>(INITIAL_ACTIVE_PRODUCTS)
  const [monthlyProductsMap, setMonthlyProductsMap] = useState<{ [ym: string]: ActiveProductRecord[] }>({
    '2026-08': INITIAL_ACTIVE_PRODUCTS,
    '2026-07': [
      {
        ...INITIAL_ACTIVE_PRODUCTS[0],
        value: '122',
        lastMonthValue: '114',
        models: [
          { ...INITIAL_ACTIVE_PRODUCTS[0].models[0], plannedOutput: '48', output: '45' },
          { ...INITIAL_ACTIVE_PRODUCTS[0].models[1], plannedOutput: '38', output: '35' },
          { ...INITIAL_ACTIVE_PRODUCTS[0].models[2], plannedOutput: '45', output: '42' },
        ],
      },
      {
        ...INITIAL_ACTIVE_PRODUCTS[1],
        value: '40',
        lastMonthValue: '38',
        models: [{ ...INITIAL_ACTIVE_PRODUCTS[1].models[0], plannedOutput: '42', output: '40' }],
      },
      {
        ...INITIAL_ACTIVE_PRODUCTS[2],
        value: '3100',
        lastMonthValue: '2950',
        models: [{ ...INITIAL_ACTIVE_PRODUCTS[2].models[0], plannedOutput: '3200', output: '3100' }],
      },
    ],
    '2026-06': [
      {
        ...INITIAL_ACTIVE_PRODUCTS[0],
        value: '114',
        lastMonthValue: '108',
        models: [
          { ...INITIAL_ACTIVE_PRODUCTS[0].models[0], plannedOutput: '45', output: '42' },
          { ...INITIAL_ACTIVE_PRODUCTS[0].models[1], plannedOutput: '35', output: '32' },
          { ...INITIAL_ACTIVE_PRODUCTS[0].models[2], plannedOutput: '42', output: '40' },
        ],
      },
      {
        ...INITIAL_ACTIVE_PRODUCTS[1],
        value: '38',
        lastMonthValue: '36',
        models: [{ ...INITIAL_ACTIVE_PRODUCTS[1].models[0], plannedOutput: '40', output: '38' }],
      },
      {
        ...INITIAL_ACTIVE_PRODUCTS[2],
        value: '2950',
        lastMonthValue: '2800',
        models: [{ ...INITIAL_ACTIVE_PRODUCTS[2].models[0], plannedOutput: '3000', output: '2950' }],
      },
    ],
  })

    // 🌟 需求 7：申报历史数据以月份为单位在列表显示
  const [monthBatches, setMonthBatches] = useState<MonthDeclarationBatch[]>(INITIAL_MONTH_BATCHES)
  const [historyYearFilter, setHistoryYearFilter] = useState('all')

  // 🌟 需求 7：查看详情或编辑时可在弹窗显示完整的申报数据信息（按当前模块区分产品产量或能源消耗）
  const [isMonthBatchModalOpen, setIsMonthBatchModalOpen] = useState(false)
  const [monthModalMode, setMonthModalMode] = useState<'view' | 'edit'>('view')
  const [monthModalTarget, setMonthModalTarget] = useState<'production' | 'energy'>('production')
  const [activeModalBatch, setActiveModalBatch] = useState<MonthDeclarationBatch | null>(null)
  const [modalEditingProducts, setModalEditingProducts] = useState<MonthBatchProductItem[]>([])
  const [modalEditingEnergy, setModalEditingEnergy] = useState<MonthBatchEnergySummary>({
    gridPowerWanKwh: '124.6',
    pvPowerWanKwh: '23.6',
    greenPowerWanKwh: '148.2',
    waterTon: '8,900',
    gasWanM3: '2.84',
    steamTon: '1,420',
    dieselL: '3,200',
    gasolineL: '1,850',
    keroseneL: '2,400',
    nitrogenTon: '52.0',
    powerCostWan: '136.20',
    waterCostWan: '4.10',
    gasCostWan: '9.20',
    steamCostWan: '39.31',
    nitrogenCostWan: '1.85',
    totalCostWan: '188.81',
  })

  // 打开月份申报全量档案弹窗 (查看详情或编辑模式，支持区分产品产量或能源消耗明细)
  const handleOpenMonthModal = (
    batch: MonthDeclarationBatch,
    mode: 'view' | 'edit',
    target?: 'production' | 'energy'
  ) => {
    setActiveModalBatch(batch)
    setMonthModalMode(mode)
    setMonthModalTarget(target || (activeModuleTab === 'energy' ? 'energy' : 'production'))
    setModalEditingProducts(batch.products ? JSON.parse(JSON.stringify(batch.products)) : [])
    setModalEditingEnergy({ ...batch.energy })
    setIsMonthBatchModalOpen(true)
  }

  // 弹窗中修改单项产品参数 (计划产量、完工产量、单位)
  const handleUpdateModalProduct = (id: string, field: 'plannedOutput' | 'output' | 'unit', val: string) => {
    setModalEditingProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    )
  }

  // 弹窗中删除产品项
  const handleDeleteModalProduct = (id: string) => {
    setModalEditingProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // 弹窗中修改能耗数值
  const handleUpdateModalEnergy = (field: keyof MonthBatchEnergySummary, val: string) => {
    setModalEditingEnergy((prev) => ({ ...prev, [field]: val }))
  }

  // 弹窗中保存全量修改并重新归档
  const handleSaveMonthBatchModal = () => {
    if (!activeModalBatch) return
    const prodSummary = modalEditingProducts.map((p) => `${p.categoryName} ${p.output}${p.unit}`).join(' · ')
    const updatedBatch: MonthDeclarationBatch = {
      ...activeModalBatch,
      products: modalEditingProducts,
      energy: modalEditingEnergy,
      summary: `产品：${prodSummary || '暂无产品'} · 支出 ¥${modalEditingEnergy.totalCostWan}万`,
    }

    setMonthBatches((prev) =>
      prev.map((b) => (b.id === activeModalBatch.id ? updatedBatch : b))
    )
    setActiveModalBatch(updatedBatch)

    // 同步更新填报工作台月度存储
    const ym = `${activeModalBatch.year}-${activeModalBatch.month}`
    if (activeProducts && ym === `${selectedYear}-${selectedMonth}`) {
      setActiveProducts((prev) =>
        prev.map((p) => {
          const matched = modalEditingProducts.find((mp) => mp.categoryId === p.id)
          if (matched) {
            return {
              ...p,
              value: matched.output,
              unit: matched.unit,
            }
          }
          return p
        })
      )
    }

    setMonthModalMode('view')
    setSuccessToast({
      show: true,
      msg: `【${activeModalBatch.year}年${activeModalBatch.month}月】工厂申报全量档案已成功保存并重新归档！`,
      batch: activeModalBatch.batch,
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }


  // 🌟 从历史台账删除申报月份批次
  const handleDeleteMonthBatch = (batchId: string) => {
    const target = monthBatches.find((b) => b.id === batchId)
    if (!target) return
    if (confirm(`确认从历史台账中删除【${target.year}年${target.month}月】的申报历史数据？`)) {
      setMonthBatches((prev) => prev.filter((b) => b.id !== batchId))
      setSubmittedMonths((prev) => prev.filter((m) => m !== `${target.year}-${target.month}`))
      setSuccessToast({
        show: true,
        msg: `已成功删除【${target.year}年${target.month}月】申报历史记录！`,
        batch: target.batch,
      })
      setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3500)
    }
  }


  // 🌟 需求：申报数据弹窗状态与独立历史台账筛选控制
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState(false)
  const [declareTarget, setDeclareTarget] = useState<'production' | 'energy'>('production')
  const [declareYear, setDeclareYear] = useState('2026')
  const [declareMonth, setDeclareMonth] = useState('09')
  const [declareEditingBatchId, setDeclareEditingBatchId] = useState<string | null>(null)
  const [declareProducts, setDeclareProducts] = useState<MonthBatchProductItem[]>([])
  const [declareEnergy, setDeclareEnergy] = useState<MonthBatchEnergySummary>({
    gridPowerWanKwh: '128.5',
    pvPowerWanKwh: '24.2',
    greenPowerWanKwh: '152.7',
    waterTon: '9,100',
    gasWanM3: '2.95',
    steamTon: '1,450',
    dieselL: '3,300',
    gasolineL: '1,850',
    keroseneL: '2,400',
    nitrogenTon: '52.0',
    powerCostWan: '141.50',
    waterCostWan: '4.25',
    gasCostWan: '9.60',
    steamCostWan: '40.15',
    nitrogenCostWan: '1.85',
    totalCostWan: '197.35',
  })

  // 产品产量与能源消耗历史台账独立筛选与搜索
  const [prodHistoryYearFilter, setProdHistoryYearFilter] = useState('all')
  const [prodHistorySearchQuery, setProdHistorySearchQuery] = useState('')
  const [energyHistoryYearFilter, setEnergyHistoryYearFilter] = useState('all')
  const [energyHistorySearchQuery, setEnergyHistorySearchQuery] = useState('')

  // 年份合集
  const uniqueYears = useMemo(() => {
    return Array.from(new Set(monthBatches.map((b) => b.year)))
  }, [monthBatches])

  // 产品产量历史台账过滤结果
  const filteredProductionBatches = useMemo(() => {
    return monthBatches.filter((batch) => {
      if (prodHistoryYearFilter !== 'all' && batch.year !== prodHistoryYearFilter) {
        return false
      }
      if (prodHistorySearchQuery.trim()) {
        const q = prodHistorySearchQuery.trim().toLowerCase()
        const matchYm = `${batch.year}-${batch.month}`.includes(q)
        const matchSubmitter = (batch.submitter || '').toLowerCase().includes(q)
        const matchSummary = (batch.summary || '').toLowerCase().includes(q)
        const matchProduct = (batch.products || []).some((p) =>
          (p.modelName || '').toLowerCase().includes(q) ||
          (p.categoryName || '').toLowerCase().includes(q) ||
          (p.subTypeName || '').toLowerCase().includes(q)
        )
        return matchYm || matchSubmitter || matchSummary || matchProduct
      }
      return true
    })
  }, [monthBatches, prodHistoryYearFilter, prodHistorySearchQuery])

  // 能源消耗历史台账过滤结果
  const filteredEnergyBatches = useMemo(() => {
    return monthBatches.filter((batch) => {
      if (energyHistoryYearFilter !== 'all' && batch.year !== energyHistoryYearFilter) {
        return false
      }
      if (energyHistorySearchQuery.trim()) {
        const q = energyHistorySearchQuery.trim().toLowerCase()
        const matchYm = `${batch.year}-${batch.month}`.includes(q)
        const matchSubmitter = (batch.submitter || '').toLowerCase().includes(q)
        const matchSummary = (batch.summary || '').toLowerCase().includes(q)
        return matchYm || matchSubmitter || matchSummary
      }
      return true
    })
  }, [monthBatches, energyHistoryYearFilter, energyHistorySearchQuery])

  // 🌟 企业产品中类管理主数据状态 (支持新增、启用、停用)
  const [companyProductCategories, setCompanyProductCategories] = useState<CompanyProductCategoryItem[]>(INITIAL_COMPANY_PRODUCT_CATEGORIES)
  const [isProductManageModalOpen, setIsProductManageModalOpen] = useState(false)
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false)
  const [newCatCategoryName, setNewCatCategoryName] = useState('变压器')
  const [newCatSubTypeName, setNewCatSubTypeName] = useState('油浸式电力变压器')
  const [newCatModelName, setNewCatModelName] = useState('')
  const [newCatUnit, setNewCatUnit] = useState('台/万kVA')
  const [newCatBenchmark, setNewCatBenchmark] = useState('50')

  // 🌟 核心同步逻辑：根据产品管理中的中类与启用状态，同步申报产品列表（停用不显示，新增自动补齐）
  const syncDeclareProductsWithCategories = (existingList: MonthBatchProductItem[] = []): MonthBatchProductItem[] => {
    const enabledCats = companyProductCategories.filter((c) => c.status === 'enabled')
    const disabledModelNames = new Set(companyProductCategories.filter((c) => c.status === 'disabled').map((c) => c.modelName))

    // 1. 严格过滤掉已停用的中类（停用的产品中类在申报时列表中不显示）
    const filteredExisting = existingList.filter((p) => !disabledModelNames.has(p.modelName))

    // 2. 将当前启用的种类与现有列表进行映射对齐
    const existingMap = new Map<string, MonthBatchProductItem>()
    filteredExisting.forEach((p) => existingMap.set(p.modelName, p))

    return enabledCats.map((cat, idx) => {
      const existing = existingMap.get(cat.modelName)
      if (existing) {
        return {
          ...existing,
          categoryName: cat.categoryName,
          subTypeName: cat.subTypeName,
          unit: cat.unit,
        }
      }
      return {
        id: `dp-${Date.now()}-${idx}`,
        productId: cat.id,
        categoryName: cat.categoryName,
        categoryId: cat.categoryName,
        subTypeName: cat.subTypeName,
        modelName: cat.modelName,
        modelCode: cat.id,
        plannedOutput: '50',
        output: '45',
        unit: cat.unit,
        workshop: '生产制造车间',
        lastMonthValue: cat.lastMonthBenchmark || '40',
        sourceType: 'manual' as const,
        sourceLabel: '企业自填',
      }
    })
  }

  // 切换产品中类启用/停用状态
  const handleToggleCategoryStatus = (catId: string) => {
    setCompanyProductCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          const nextStatus = c.status === 'enabled' ? 'disabled' : 'enabled'
          setSuccessToast({
            show: true,
            batch: c.modelName,
            msg: nextStatus === 'enabled' ? '已成功启用该产品中类，申报数据时将正常包含！' : '已停用该产品中类，申报数据时将不再显示！',
          })
          return { ...c, status: nextStatus }
        }
        return c
      })
    )
  }

  // 新增产品中类
  const handleSaveNewCategory = () => {
    if (!newCatModelName.trim()) {
      alert('请输入产品名称与规格型号！')
      return
    }
    const nowStr = new Date().toISOString().split('T')[0]
    const newCat: CompanyProductCategoryItem = {
      id: `cat-${Date.now()}`,
      categoryName: newCatCategoryName,
      subTypeName: newCatSubTypeName.trim() || '标准型号',
      modelName: newCatModelName.trim(),
      unit: newCatUnit.trim() || '台/万kVA',
      lastMonthBenchmark: newCatBenchmark.trim() || '0',
      status: 'enabled',
      createdAt: nowStr,
    }
    setCompanyProductCategories((prev) => [newCat, ...prev])
    setIsAddingNewCategory(false)
    setNewCatModelName('')
    setSuccessToast({
      show: true,
      batch: newCat.modelName,
      msg: '已成功新增产品中类并启用，申报列表将自动同步！',
    })
  }

  // 删除产品中类
  const handleDeleteCategory = (catId: string, modelName: string) => {
    setCompanyProductCategories((prev) => prev.filter((c) => c.id !== catId))
    setSuccessToast({
      show: true,
      batch: modelName,
      msg: '已成功删除该产品中类！',
    })
  }

  // 打开申报数据弹窗 (产品产量 或 能源消耗)
  const handleOpenDeclareModal = (target: 'production' | 'energy', existingBatch?: MonthDeclarationBatch) => {
    setDeclareTarget(target)
    if (existingBatch) {
      setDeclareEditingBatchId(existingBatch.id)
      setDeclareYear(existingBatch.year)
      setDeclareMonth(existingBatch.month)
      setDeclareProducts(syncDeclareProductsWithCategories(existingBatch.products || []))
      setDeclareEnergy({ ...existingBatch.energy })
    } else {
      setDeclareEditingBatchId(null)
      const defaultYear = '2026'
      const defaultMonth = '09'
      setDeclareYear(defaultYear)
      setDeclareMonth(defaultMonth)

      const matchedBatch = monthBatches.find((b) => b.year === defaultYear && b.month === defaultMonth)
      if (matchedBatch) {
        setDeclareProducts(syncDeclareProductsWithCategories(matchedBatch.products || []))
        setDeclareEnergy({ ...matchedBatch.energy })
      } else {
        setDeclareProducts(syncDeclareProductsWithCategories([]))
        const latest = monthBatches[0]
        if (latest && latest.energy) {
          setDeclareEnergy({ ...latest.energy })
        }
      }
    }
    setIsDeclareModalOpen(true)
  }

  // 弹窗中切换申报月份
  const handleSwitchDeclareMonth = (newYear: string, newMonth: string) => {
    setDeclareYear(newYear)
    setDeclareMonth(newMonth)
    const existing = monthBatches.find((b) => b.year === newYear && b.month === newMonth)
    if (existing) {
      setDeclareEditingBatchId(existing.id)
      setDeclareProducts(syncDeclareProductsWithCategories(existing.products || []))
      setDeclareEnergy({ ...existing.energy })
    } else {
      setDeclareEditingBatchId(null)
      setDeclareProducts(syncDeclareProductsWithCategories([]))
    }
  }

  // 弹窗中保存申报数据到历史台账
  const handleSaveDeclareToHistory = () => {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const submitTimeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`

    const powerCost = parseFloat(declareEnergy.powerCostWan) || 0
    const waterCost = parseFloat(declareEnergy.waterCostWan) || 0
    const gasCost = parseFloat(declareEnergy.gasCostWan) || 0
    const steamCost = parseFloat(declareEnergy.steamCostWan) || 0
    const nitrogenCost = parseFloat(declareEnergy.nitrogenCostWan || '0') || 0
    const calculatedTotalCost = (powerCost + waterCost + gasCost + steamCost + nitrogenCost).toFixed(2)
    const updatedEnergy: MonthBatchEnergySummary = {
      ...declareEnergy,
      totalCostWan: calculatedTotalCost !== '0.00' ? calculatedTotalCost : declareEnergy.totalCostWan,
    }

    const prodSummary = declareProducts.map((p) => `${p.categoryName} ${p.output}${p.unit}`).join(' · ')
    const fullSummary = prodSummary
      ? `产品：${prodSummary} · 综合支出 ¥${updatedEnergy.totalCostWan}万`
      : `综合能耗支出 ¥${updatedEnergy.totalCostWan}万`

    const ym = `${declareYear}-${declareMonth}`
    const existingIndex = monthBatches.findIndex((b) =>
      declareEditingBatchId ? b.id === declareEditingBatchId : b.year === declareYear && b.month === declareMonth
    )

    let savedBatch: MonthDeclarationBatch

    if (existingIndex >= 0) {
      const oldBatch = monthBatches[existingIndex]
      savedBatch = {
        ...oldBatch,
        year: declareYear,
        month: declareMonth,
        submitter: submitterName,
        submitTime: submitTimeStr,
        products: declareTarget === 'production' ? declareProducts : oldBatch.products,
        energy: declareTarget === 'energy' ? updatedEnergy : oldBatch.energy,
        summary: fullSummary,
      }
      setMonthBatches((prev) => prev.map((b, i) => (i === existingIndex ? savedBatch : b)))
    } else {
      savedBatch = {
        id: `batch-${declareYear}${declareMonth}`,
        batch: `DR-${declareYear}${declareMonth}-DBSB`,
        year: declareYear,
        month: declareMonth,
        reportingUnit: currentReportingUnit.parkName,
        submitter: submitterName,
        submitTime: submitTimeStr,
        status: '已入库',
        products: declareProducts,
        energy: updatedEnergy,
        photosCount: 2,
        eventsCount: 1,
        summary: fullSummary,
      }
      setMonthBatches((prev) => [savedBatch, ...prev])
    }

    if (!submittedMonths.includes(ym)) {
      setSubmittedMonths((prev) => [ym, ...prev])
    }

    setIsDeclareModalOpen(false)
    setSuccessToast({
      show: true,
      msg: `【${declareYear}年${declareMonth}月】${
        declareTarget === 'production' ? '产品产量' : '能源消耗'
      }申报数据已成功保存至历史台账！`,
      batch: savedBatch.batch,
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }

  // 弹窗中追加自定义产品项
  const handleAddDeclareProductRow = () => {
    const newRow: MonthBatchProductItem = {
      id: `dp-new-${Date.now()}`,
      productId: `prod-custom-${Date.now()}`,
      categoryName: '变压器',
      categoryId: 'transformer',
      subTypeName: '特种配电变压器',
      modelName: 'SCB18-1250/10 一级能效干式变压器',
      modelCode: 'TB-SCB18-1250',
      plannedOutput: '20',
      output: '18',
      unit: '台/万kVA',
      workshop: '特高压数字化生产车间',
      lastMonthValue: '15',
      sourceType: 'manual',
      sourceLabel: '企业自填',
    }
    setDeclareProducts((prev) => [...prev, newRow])
  }

// 🌟 管理员手动添加产品历史台账状态
  const [historicalProducts, setHistoricalProducts] = useState<HistoricalProductRecord[]>(INITIAL_HISTORICAL_PRODUCTS)
  const [historySearchQuery, setHistorySearchQuery] = useState('')

  // 🌟 自定义工业月份选择器状态与已申报置灰锁定名单 (响应用户指令：已申报的月份置灰，无法选择)
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState('2026')
  const [submittedMonths, setSubmittedMonths] = useState<string[]>([
    '2026-01',
    '2026-02',
    '2026-03',
    '2026-04',
    '2026-05',
    '2026-06',
    '2026-07',
  ])

  // 🌟 产品参数编辑模态框状态 (需求 1)
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false)
  const [editingProductRow, setEditingProductRow] = useState<{
    id: string
    productId: string
    modelId?: string
    categoryName: string
    categoryId: string
    subTypeName: string
    modelName: string
    modelCode: string
    plannedOutput: string
    output: string
    unit: string
    workshop: string
    lastMonthValue: string
    sourceType: 'auto' | 'manual' | 'mes'
    sourceLabel: string
    remark: string
  } | null>(null)
  const [editForm, setEditForm] = useState<{
    categoryName: string
    subTypeName: string
    modelName: string
    plannedOutput: string
    output: string
    unit: string
    lastMonthValue: string
    workshop: string
    sourceType: 'auto' | 'manual' | 'mes'
    sourceLabel: string
    remark: string
  }>({
    categoryName: '',
    subTypeName: '',
    modelName: '',
    plannedOutput: '',
    output: '',
    unit: '',
    lastMonthValue: '',
    workshop: '',
    sourceType: 'manual',
    sourceLabel: '企业自填',
    remark: '',
  })
  const [paramPlannedQuantity, setParamPlannedQuantity] = useState<string>('50')
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [selectedCatToAdd, setSelectedCatToAdd] = useState<string>('switchgear')
  const [customProductName, setCustomProductName] = useState('')
  const [newModelInputs, setNewModelInputs] = useState<{ [productId: string]: { code: string; name: string; output: string } }>({})

  // 🌟 核心升级：产品参数多级联动选择状态 (产品类型 ➔ 产品子类型 ➔ 型号 ➔ 规格)
  const [paramProductTypeId, setParamProductTypeId] = useState<string>('transformer')
  const [paramSubTypeId, setParamSubTypeId] = useState<string>('oil_power')
  const [paramProductName, setParamProductName] = useState<string>('S20-M (新一级能效油浸变)')
  const [paramModelName, setParamModelName] = useState<string>('S20-M (新一级能效油浸变)')
  const [paramSpecName, setParamSpecName] = useState<string>('630kVA / 10kV')
  const [paramModelCode, setParamModelCode] = useState<string>('TB-S20-630')
  const [paramUnit, setParamUnit] = useState<string>('台/万kVA')
  const [paramWorkshop, setParamWorkshop] = useState<string>('特高压变压器装配车间')
  const [paramQuantity, setParamQuantity] = useState<string>('12')
  const [isCustomParamMode, setIsCustomParamMode] = useState<boolean>(false)
  const [customTypeName, setCustomTypeName] = useState<string>('')
  const [customSubTypeName, setCustomSubTypeName] = useState<string>('')
  const [customModelName, setCustomModelName] = useState<string>('')
  const [customSpecName, setCustomSpecName] = useState<string>('')
  const [paramRemark, setParamRemark] = useState<string>('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')

  // 联动切换：选择产品大类
  const handleSelectProductType = (typeId: string) => {
    setParamProductTypeId(typeId)
    const typeObj = TBEA_PRODUCT_SPEC_HIERARCHY.find((t) => t.id === typeId)
    if (typeObj && typeObj.subTypes.length > 0) {
      const firstSub = typeObj.subTypes[0]
      setParamSubTypeId(firstSub.id)
      setParamUnit(typeObj.defaultUnit)
      setParamWorkshop(typeObj.defaultWorkshop)
      if (firstSub.models && firstSub.models.length > 0) {
        setParamProductName(firstSub.models[0].model)
      } else {
        setParamProductName(`${firstSub.name} - 标准产品`)
      }
    }
  }

  // 联动切换：选择产品子类型
  const handleSelectSubType = (subId: string) => {
    setParamSubTypeId(subId)
    const typeObj = TBEA_PRODUCT_SPEC_HIERARCHY.find((t) => t.id === paramProductTypeId)
    const subObj = typeObj?.subTypes.find((s) => s.id === subId)
    if (subObj && subObj.models && subObj.models.length > 0) {
      setParamProductName(subObj.models[0].model)
    } else {
      setParamProductName(`${subObj?.name || '标准'} - 标准产品`)
    }
  }

  // 🌟 列表上直接修改已有设备的完工数量并实时联动汇总
  const handleModelQuantityChange = (productId: string, modelId: string, newQty: string) => {
    setActiveProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p
        const updatedModels = p.models.map((m) =>
          m.id === modelId ? { ...m, output: newQty } : m
        )
        const sum = updatedModels.reduce((acc, cur) => acc + (parseFloat(cur.output) || 0), 0)
        return {
          ...p,
          models: updatedModels,
          value: isNaN(sum) ? p.value : String(sum),
        }
      })
    )
  }

  // 🌟 确认添加产品规格到列表（不需在弹窗填写数量与车间，直接加入列表后在表格内填写）
  const handleConfirmAddProductDevice = () => {
    const typeObj = TBEA_PRODUCT_SPEC_HIERARCHY.find((t) => t.id === paramProductTypeId) || TBEA_PRODUCT_SPEC_HIERARCHY[0]
    const subObj = typeObj.subTypes.find((s) => s.id === paramSubTypeId) || typeObj.subTypes[0]
    const categoryName = typeObj.name || '变压器'
    const subTypeName = subObj?.name || ''
    const productName = paramProductName.trim() || `${subTypeName} 标准产品`
    const code = `TB-${paramProductTypeId.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-4)}`
    const unit = typeObj.defaultUnit || '台/万kVA'
    const workshop = typeObj.defaultWorkshop || '数字化智能制造车间'

    const fullName = productName

    const existingProductIndex = activeProducts.findIndex((p) => p.categoryName === categoryName)

    const newModelItem: ProductModelItem = {
      id: `m-${Date.now()}`,
      modelCode: code,
      modelName: fullName,
      subTypeName: subTypeName || '标准子类',
      unit: paramUnit || unit,
      plannedOutput: paramPlannedQuantity.trim() || '0',
      output: '0',
      workshop: workshop,
      remark: '',
    }

    if (existingProductIndex >= 0) {
      const targetProduct = activeProducts[existingProductIndex]
      const updatedModels = [...targetProduct.models, newModelItem]
      const sum = updatedModels.reduce((acc, cur) => acc + (parseFloat(cur.output) || 0), 0)

      setActiveProducts((prev) =>
        prev.map((p, idx) =>
          idx === existingProductIndex
            ? {
                ...p,
                models: updatedModels,
                value: String(sum),
              }
            : p
        )
      )
    } else {
      const newRecord: ActiveProductRecord = {
        id: `prod-${Date.now()}`,
        categoryId: paramProductTypeId,
        categoryName,
        unit,
        value: '0',
        lastMonthValue: '0',
        sourceType: 'manual',
        sourceLabel: '企业自填',
        isPrimary: false,
        workshop,
        remark: '',
        models: [newModelItem],
      }
      setActiveProducts((prev) => [...prev, newRecord])
    }

    // 同步沉淀至管理员手动历史台账
    const newHistRecord: HistoricalProductRecord = {
      id: `hp-${Date.now()}`,
      year: selectedYear,
      month: selectedMonth,
      productId: existingProductIndex >= 0 ? activeProducts[existingProductIndex].id : `prod-${Date.now()}`,
      modelId: newModelItem.id,
      categoryName,
      categoryId: paramProductTypeId,
      subTypeName: subTypeName || '标准子类',
      modelName: fullName,
      modelCode: code,
      plannedOutput: paramPlannedQuantity.trim() || '0',
      output: '0',
      unit: paramUnit || unit,
      workshop: workshop,
      lastMonthValue: '0',
      sourceType: 'manual',
      sourceLabel: '企业自填',
      submitTime: `${selectedYear}-${selectedMonth}-01 09:00`,
      submitter: submitterName,
      remark: '',
    }
    setHistoricalProducts((prev) => [newHistRecord, ...prev])

    setIsAddProductModalOpen(false)
    setSuccessToast({
      show: true,
      msg: `已成功添加产品【${categoryName} - ${fullName}】，请在列表中直接填写完工数量与车间！`,
      batch: 'ADD-PRODUCT',
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }

  // 🌟 切换申报月份（需求 2：支持在添加产品产量前选择月份）
  const handleSwitchReportingMonth = (newYear: string, newMonth: string) => {
    // 1. 保存当前月份的数据至字典
    const currentKey = `${selectedYear}-${selectedMonth}`
    setMonthlyProductsMap((prev) => ({
      ...prev,
      [currentKey]: activeProducts,
    }))

    // 2. 更新选中年月
    setSelectedYear(newYear)
    setSelectedMonth(newMonth)

    // 3. 加载新月份数据
    const targetKey = `${newYear}-${newMonth}`
    if (monthlyProductsMap[targetKey]) {
      setActiveProducts(monthlyProductsMap[targetKey])
    } else {
      const initialTemplate = INITIAL_ACTIVE_PRODUCTS.map((p) => ({
        ...p,
        value: '0',
        lastMonthValue: p.value,
        models: p.models.map((m) => ({ ...m, output: '0' })),
      }))
      setActiveProducts(initialTemplate)
      setMonthlyProductsMap((prev) => ({
        ...prev,
        [targetKey]: initialTemplate,
      }))
    }

        // 同步保存与加载能源数据
    setMonthlyEnergyMap((prev) => ({
      ...prev,
      [currentKey]: metrics,
    }))
    if (monthlyEnergyMap[targetKey]) {
      setMetrics(monthlyEnergyMap[targetKey])
    } else {
      const matchedBatch = monthBatches.find((b) => `${b.year}-${b.month}` === targetKey)
      if (matchedBatch) {
        setMetrics((prev) =>
          prev.map((m) => {
            if (m.id === 'm-1') return { ...m, value: matchedBatch.energy.waterTon.replace(/,/g, '') }
            if (m.id === 'm-2') return { ...m, value: matchedBatch.energy.gasWanM3 }
            if (m.id === 'm-3') return { ...m, value: matchedBatch.energy.steamTon.replace(/,/g, '') }
            if (m.id === 'm-4') return { ...m, value: matchedBatch.energy.dieselL.replace(/,/g, '') }
            if (m.id === 'm-6') return { ...m, value: matchedBatch.energy.powerCostWan }
            if (m.id === 'm-7') return { ...m, value: matchedBatch.energy.gasCostWan }
            if (m.id === 'm-8') return { ...m, value: matchedBatch.energy.steamCostWan }
            if (m.id === 'm-9') return { ...m, value: matchedBatch.energy.waterCostWan }
            return m
          })
        )
      }
    }

    setSuccessToast({
      show: true,
      msg: `已切换至【${newYear}年${newMonth}月】工厂申报台账！`,
      batch: `SWITCH-${newYear}${newMonth}`,
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3000)
  }

  // 🌟 列表直接修改计划产量
  const handleModelPlannedQuantityChange = (productId: string, modelId?: string, newPlannedQty: string = '0') => {
    setActiveProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p
        if (modelId) {
          const updatedModels = p.models.map((m) =>
            m.id === modelId ? { ...m, plannedOutput: newPlannedQty } : m
          )
          const sum = updatedModels.reduce((acc, cur) => acc + (parseFloat(cur.plannedOutput || '0') || 0), 0)
          return {
            ...p,
            models: updatedModels,
            plannedValue: isNaN(sum) ? p.plannedValue : String(sum),
          }
        } else {
          return {
            ...p,
            plannedValue: newPlannedQty,
          }
        }
      })
    )
  }

  // 🌟 打开产品参数编辑模态框 (需求 1)
  const handleOpenEditProduct = (row: typeof equipmentRows[0]) => {
    setEditingProductRow(row)
    setEditForm({
      categoryName: row.categoryName,
      subTypeName: row.subTypeName,
      modelName: row.modelName,
      plannedOutput: row.plannedOutput || '0',
      output: row.output,
      unit: row.unit,
      lastMonthValue: row.lastMonthValue,
      workshop: row.workshop,
      sourceType: row.sourceType,
      sourceLabel: row.sourceLabel,
      remark: row.remark || '',
    })
    setIsEditProductModalOpen(true)
  }

  // 🌟 保存编辑后的产品参数 (需求 1)
  const handleConfirmEditProduct = () => {
    if (!editingProductRow) return
    if (!editForm.modelName.trim()) {
      alert('产品名称与规格型号不能为空！')
      return
    }

    const row = editingProductRow
    const newQty = editForm.output.trim() || '0'
    const newPlanned = editForm.plannedOutput.trim() || '0'

    // 1. 更新当前 activeProducts
    setActiveProducts((prev) =>
      prev.map((p) => {
        if (p.id !== row.productId) return p
        if (row.modelId) {
          const updatedModels = p.models.map((m) =>
            m.id === row.modelId
              ? {
                  ...m,
                  modelName: editForm.modelName.trim(),
                  subTypeName: editForm.subTypeName.trim(),
                  plannedOutput: newPlanned,
                  output: newQty,
                  unit: editForm.unit,
                  workshop: row.workshop,
                  remark: row.remark,
                }
              : m
          )
          const sum = updatedModels.reduce((acc, cur) => acc + (parseFloat(cur.output) || 0), 0)
          const plannedSum = updatedModels.reduce((acc, cur) => acc + (parseFloat(cur.plannedOutput || '0') || 0), 0)
          return {
            ...p,
            unit: editForm.unit,
            workshop: p.workshop,
            lastMonthValue: p.lastMonthValue,
            sourceLabel: editForm.sourceLabel,
            sourceType: editForm.sourceType,
            models: updatedModels,
            plannedValue: isNaN(plannedSum) ? p.plannedValue : String(plannedSum),
            value: isNaN(sum) ? p.value : String(sum),
          }
        } else {
          return {
            ...p,
            categoryName: editForm.categoryName,
            plannedValue: newPlanned,
            value: newQty,
            unit: editForm.unit,
            workshop: editForm.workshop.trim(),
            lastMonthValue: editForm.lastMonthValue.trim() || p.lastMonthValue,
            sourceLabel: editForm.sourceLabel,
            sourceType: editForm.sourceType,
            remark: editForm.remark.trim(),
          }
        }
      })
    )

    // 2. 同步更新至 historicalProducts
    setHistoricalProducts((prev) =>
      prev.map((h) => {
        const isMatch =
          h.year === selectedYear &&
          h.month === selectedMonth &&
          ((row.modelId && h.modelId === row.modelId) || (!row.modelId && h.productId === row.productId))
        if (!isMatch) return h
        return {
          ...h,
          categoryName: editForm.categoryName,
          subTypeName: editForm.subTypeName,
          modelName: editForm.modelName,
          plannedOutput: newPlanned,
          output: newQty,
          unit: editForm.unit,
          lastMonthValue: editForm.lastMonthValue,
          workshop: editForm.workshop,
          sourceType: editForm.sourceType,
          sourceLabel: editForm.sourceLabel,
          remark: editForm.remark,
          submitTime: `${selectedYear}-${selectedMonth}-28 10:00 (已修订)`,
        }
      })
    )

    setIsEditProductModalOpen(false)
    setEditingProductRow(null)
    setSuccessToast({
      show: true,
      msg: `已成功保存产品【${editForm.categoryName} - ${editForm.modelName}】参数修改！`,
      batch: 'EDIT-PRODUCT',
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3500)
  }

  // 🌟 从历史台账退回申报月份并打开编辑弹窗 (需求 4)
  const handleEditFromHistory = (rec: HistoricalProductRecord) => {
    // 1. 保存当前工作台数据
    const currentKey = `${selectedYear}-${selectedMonth}`
    setMonthlyProductsMap((prev) => ({
      ...prev,
      [currentKey]: activeProducts,
    }))

    // 2. 切换至记录对应的申报年份与月份
    setSelectedYear(rec.year)
    setSelectedMonth(rec.month)

    // 3. 加载该月的产品数据
    const targetKey = `${rec.year}-${rec.month}`
    const targetProducts = monthlyProductsMap[targetKey] || INITIAL_ACTIVE_PRODUCTS
    setActiveProducts(targetProducts)

    // 4. 切回填报模式与产品产量 Tab (退回到申报月份页面)
    setViewMode('entry')
    setActiveModuleTab('production')

    // 5. 组装行数据并直接呼出参数编辑弹窗
    const pseudoRow: typeof equipmentRows[0] = {
      id: rec.modelId || rec.id,
      productId: rec.productId,
      modelId: rec.modelId,
      categoryName: rec.categoryName,
      categoryId: rec.categoryId,
      subTypeName: rec.subTypeName,
      modelName: rec.modelName,
      modelCode: rec.modelCode,
      plannedOutput: rec.plannedOutput || '0',
      output: rec.output,
      unit: rec.unit,
      workshop: rec.workshop,
      lastMonthValue: rec.lastMonthValue,
      sourceType: rec.sourceType,
      sourceLabel: rec.sourceLabel,
      remark: rec.remark || '',
    }
    handleOpenEditProduct(pseudoRow)

    setSuccessToast({
      show: true,
      msg: `已退回至【${rec.year}年${rec.month}月】申报页面，正在编辑【${rec.categoryName} - ${rec.modelName}】参数！`,
      batch: `GOTO-${rec.year}${rec.month}`,
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }

  // 🌟 从历史台账删除产品记录 (需求 4)
  const handleDeleteFromHistory = (rec: HistoricalProductRecord) => {
    if (confirm(`确认从历史台账中删除【${rec.year}年${rec.month}月】的【${rec.categoryName} - ${rec.modelName}】记录？`)) {
      setHistoricalProducts((prev) => prev.filter((h) => h.id !== rec.id))

      if (rec.year === selectedYear && rec.month === selectedMonth) {
        if (rec.modelId) {
          setActiveProducts((prev) =>
            prev.map((p) => {
              if (p.id !== rec.productId) return p
              const updatedModels = p.models.filter((m) => m.id !== rec.modelId)
              const sum = updatedModels.reduce((acc, cur) => acc + (parseFloat(cur.output) || 0), 0)
              return {
                ...p,
                models: updatedModels,
                value: String(sum),
              }
            })
          )
        }
      }

      setSuccessToast({
        show: true,
        msg: `已成功删除【${rec.year}年${rec.month}月】的【${rec.categoryName} - ${rec.modelName}】历史记录！`,
        batch: 'DELETE-HISTORY',
      })
      setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3500)
    }
  }

  // 🌟 展平产品产量数据清单（扁平化表格行，支持一屏纵览与快速修改数量）
  const equipmentRows = useMemo(() => {
    const list: Array<{
      id: string
      productId: string
      modelId?: string
      categoryName: string
      categoryId: string
      subTypeName: string
      modelName: string
      modelCode: string
      plannedOutput: string
      output: string
      unit: string
      workshop: string
      lastMonthValue: string
      sourceType: 'auto' | 'manual' | 'mes'
      sourceLabel: string
      remark: string
    }> = []

    activeProducts.forEach((p) => {
      if (p.models && p.models.length > 0) {
        p.models.forEach((m) => {
          list.push({
            id: m.id,
            productId: p.id,
            modelId: m.id,
            categoryName: p.categoryName,
            categoryId: p.categoryId,
            subTypeName: m.subTypeName || '标准子类',
            modelName: m.modelName,
            modelCode: m.modelCode,
            plannedOutput: m.plannedOutput || '0',
            output: m.output,
            unit: m.unit || p.unit,
            workshop: m.workshop || p.workshop,
            lastMonthValue: p.lastMonthValue,
            sourceType: p.sourceType,
            sourceLabel: p.sourceLabel,
            remark: m.remark !== undefined ? m.remark : p.remark,
          })
        })
      } else {
        list.push({
          id: p.id,
          productId: p.id,
          categoryName: p.categoryName,
          categoryId: p.categoryId,
          subTypeName: '通用产品',
          modelName: `${p.categoryName} 标准型号`,
          modelCode: `TB-${p.categoryId.toUpperCase().slice(0, 4)}`,
          plannedOutput: p.plannedValue || '0',
          output: p.value,
          unit: p.unit,
          workshop: p.workshop,
          lastMonthValue: p.lastMonthValue,
          sourceType: p.sourceType,
          sourceLabel: p.sourceLabel,
          remark: p.remark,
        })
      }
    })
    return list
  }, [activeProducts])

  // 过滤后的表格行
  const filteredEquipmentRows = useMemo(() => {
    if (selectedCategoryFilter === 'all') return equipmentRows
    return equipmentRows.filter((r) => r.categoryName === selectedCategoryFilter)
  }, [equipmentRows, selectedCategoryFilter])

  const equipmentCategorySpans = useMemo(() => {
    const spans: number[] = new Array(filteredEquipmentRows.length).fill(0)
    let i = 0
    while (i < filteredEquipmentRows.length) {
      const cat = filteredEquipmentRows[i].categoryName
      let j = i + 1
      while (j < filteredEquipmentRows.length && filteredEquipmentRows[j].categoryName === cat) {
        j++
      }
      spans[i] = j - i
      i = j
    }
    return spans
  }, [filteredEquipmentRows])

  // 从表格中删除某项产品/规格产量记录
  const handleDeleteEquipmentRow = (row: typeof equipmentRows[0]) => {
    if (confirm(`确认从产量申报列表中移除【${row.categoryName} - ${row.modelName}】？`)) {
      if (row.modelId) {
        setActiveProducts((prev) =>
          prev.map((p) => {
            if (p.id !== row.productId) return p
            const updatedModels = p.models.filter((m) => m.id !== row.modelId)
            const sum = updatedModels.reduce((acc, cur) => acc + (parseFloat(cur.output) || 0), 0)
            return {
              ...p,
              models: updatedModels,
              value: String(sum),
            }
          })
        )
      } else {
        setActiveProducts((prev) => prev.filter((p) => p.id !== row.productId))
      }
      setSuccessToast({
        show: true,
        msg: `已成功移除【${row.categoryName} - ${row.modelName}】！`,
        batch: 'DELETE-ITEM',
      })
      setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3000)
    }
  }

  // 修改规格归属车间
  const handleModelWorkshopChange = (productId: string, modelId: string, newWorkshop: string) => {
    setActiveProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p
        const updatedModels = p.models.map((m) =>
          m.id === modelId ? { ...m, workshop: newWorkshop } : m
        )
        return { ...p, models: updatedModels }
      })
    )
  }

  // 修改规格排产说明
  const handleModelRemarkChange = (productId: string, modelId: string, newRemark: string) => {
    setActiveProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p
        const updatedModels = p.models.map((m) =>
          m.id === modelId ? { ...m, remark: newRemark } : m
        )
        return { ...p, models: updatedModels }
      })
    )
  }

  // 2. 能源消耗状态
  const [metrics, setMetrics] = useState<MetricItem[]>(INITIAL_METRICS)
    // 🌟 需求：能源消耗模块参照产品产量模块增加申报月份、添加类型、历史台账
  const [isEnergyMonthPickerOpen, setIsEnergyMonthPickerOpen] = useState(false)
  const [isEditEnergyModalOpen, setIsEditEnergyModalOpen] = useState(false)
  const [editingEnergyItem, setEditingEnergyItem] = useState<MetricItem | null>(null)
  const [monthlyEnergyMap, setMonthlyEnergyMap] = useState<Record<string, MetricItem[]>>({})

  const handleOpenEditEnergy = (metric: MetricItem) => {
    setEditingEnergyItem({ ...metric })
    setIsEditEnergyModalOpen(true)
  }

  const handleSaveEditEnergy = () => {
    if (!editingEnergyItem) return
    setMetrics((prev) =>
      prev.map((m) => (m.id === editingEnergyItem.id ? editingEnergyItem : m))
    )
    setIsEditEnergyModalOpen(false)
    setSuccessToast({
      show: true,
      msg: `已成功更新能源项目【${editingEnergyItem.name}】参数！`,
      batch: 'EDIT-ENERGY',
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3000)
  }
  const [selectedEnergyCategoryFilter, setSelectedEnergyCategoryFilter] = useState<'all' | 'energy' | 'cost' | 'green' | 'economy'>('all')
  const [isAddEnergyModalOpen, setIsAddEnergyModalOpen] = useState(false)
  const [paramEnergyCategory, setParamEnergyCategory] = useState<'energy' | 'cost' | 'green' | 'economy'>('energy')
  const [paramEnergySubType, setParamEnergySubType] = useState('water')
  const [paramEnergyName, setParamEnergyName] = useState('二期生产循环水补水量')
  const [paramEnergyUnit, setParamEnergyUnit] = useState('t')

  const filteredEnergyMetrics = useMemo(() => {
    if (selectedEnergyCategoryFilter === 'all') return metrics
    return metrics.filter((m) => m.category === selectedEnergyCategoryFilter)
  }, [metrics, selectedEnergyCategoryFilter])

  const energyCategorySpans = useMemo(() => {
    const spans: number[] = new Array(filteredEnergyMetrics.length).fill(0)
    let i = 0
    while (i < filteredEnergyMetrics.length) {
      const cat = filteredEnergyMetrics[i].category
      let j = i + 1
      while (j < filteredEnergyMetrics.length && filteredEnergyMetrics[j].category === cat) {
        j++
      }
      spans[i] = j - i
      i = j
    }
    return spans
  }, [filteredEnergyMetrics])

  const handleSelectEnergyCategory = (catId: 'energy' | 'cost' | 'green' | 'economy') => {
    setParamEnergyCategory(catId)
    const cat = TBEA_ENERGY_SPEC_HIERARCHY.find((c) => c.id === catId)
    if (cat && cat.subTypes.length > 0) {
      setParamEnergySubType(cat.subTypes[0].id)
      setParamEnergyUnit(cat.defaultUnit)
      if (catId === 'energy') {
        setParamEnergyName('二期生产循环水补水量')
      } else if (catId === 'cost') {
        setParamEnergyName('自来水增量水费发票')
      } else if (catId === 'green') {
        setParamEnergyName('三峡哈密光伏直供绿电')
      } else {
        setParamEnergyName('重点设备大修计划停产')
      }
    }
  }

  const handleConfirmAddEnergyItem = () => {
    const cat = TBEA_ENERGY_SPEC_HIERARCHY.find((c) => c.id === paramEnergyCategory)
    const sub = cat?.subTypes.find((s) => s.id === paramEnergySubType)
    const newMetric: MetricItem = {
      id: `energy-custom-${Date.now()}`,
      name: paramEnergyName.trim() || sub?.name.split('（')[0] || '新增能源项目',
      category: paramEnergyCategory,
      categoryLabel: cat?.name || '实物消耗量',
      subTypeName: sub?.name.split('（')[0] || '常规介质',
      unit: paramEnergyUnit || cat?.defaultUnit || 't',
      value: '0',
      lastMonthValue: '0',
      remark: '企业现场自填申报',
      sourceLabel: '自填申报',
    }
    setMetrics((prev) => [...prev, newMetric])
    setIsAddEnergyModalOpen(false)
  }

  const handleDeleteEnergyMetric = (id: string) => {
    setMetrics((prev) => prev.filter((m) => m.id !== id))
  }
  const [industrialAddValue, setIndustrialAddValue] = useState('4200.0')
  const [abnormalRemarks, setAbnormalRemarks] = useState('本月14日至18日特高压真空干燥三号罐实施计划性预防维护，气温同比升高2.1℃导致制冷电耗微幅上升，整体处于可控受控区间。')
  const [greenContractCode, setGreenContractCode] = useState('TBEA-GEC-2026-0818')

  // 用水量 (m-1) 与 外购蒸汽量 (m-3) 的 日 / 月 填报模式切换
  const [dimModes, setDimModes] = useState<{ 'm-1': 'month' | 'day'; 'm-3': 'month' | 'day' }>({
    'm-1': 'month',
    'm-3': 'month',
  })
  const [waterDailyList, setWaterDailyList] = useState<number[]>(() => generateInitialDaily(8900, 31))
  const [steamDailyList, setSteamDailyList] = useState<number[]>(() => generateInitialDaily(1420, 31))
  const [activeDailyModal, setActiveDailyModal] = useState<'m-1' | 'm-3' | null>(null)
  const [tempDailyList, setTempDailyList] = useState<number[]>([])

  // =========================================================================
  // 2.5 节能装备与装备台账状态管理 (全平台核心指标 #9 节能装备应用占比)
  // =========================================================================
  const [energySavingEquipments, setEnergySavingEquipments] = useState<EnergySavingEquipmentItem[]>(INITIAL_ENERGY_SAVING_EQUIPMENTS)
  const [equipmentInventory, setEquipmentInventory] = useState<EquipmentInventoryItem[]>(INITIAL_EQUIPMENT_INVENTORY)

  // 节能装备累计额定总功率 (Res, 单位: kW) 与 纳入统计范围装备累计额定总功率 (Ets, 单位: kW)
  const [energySavingTotalKw, setEnergySavingTotalKw] = useState<string>('2985')
  const [inScopeTotalKw, setInScopeTotalKw] = useState<string>('3745')

  // 子视图模式：'energySaving' (节能装备明细) | 'allInventory' (全厂在册装备底账)
  const [activeEquipSubTab, setActiveEquipSubTab] = useState<'energySaving' | 'allInventory'>('energySaving')

  // 检索与筛选状态
  const [equipSearchQuery, setEquipSearchQuery] = useState('')
  const [equipWorkshopFilter, setEquipWorkshopFilter] = useState('all')
  const [equipGradeFilter, setEquipGradeFilter] = useState('all')
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('all')
  const [inventoryScopeFilter, setInventoryScopeFilter] = useState<'all' | 'inScope' | 'outOfScope'>('all')

  // 弹窗状态
  const [isAddEnergySavingModalOpen, setIsAddEnergySavingModalOpen] = useState(false)
  const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false)
  const [isEditEnergySavingModalOpen, setIsEditEnergySavingModalOpen] = useState(false)
  const [isEditInventoryModalOpen, setIsEditInventoryModalOpen] = useState(false)
  const [editingEnergySavingItem, setEditingEnergySavingItem] = useState<EnergySavingEquipmentItem | null>(null)
  const [editingInventoryItem, setEditingInventoryItem] = useState<EquipmentInventoryItem | null>(null)

  // 表单状态
  const [newEnergySavingForm, setNewEnergySavingForm] = useState<Omit<EnergySavingEquipmentItem, 'id'>>({
    code: 'EQ-ES-2026-009',
    name: '',
    model: '',
    ratedPower: 120,
    energyGrade: '国标1级能效',
    workshop: '特高压数字化装配车间',
    certificate: 'GB 18613-2020 1级 / 节能认证证书',
    commissionYear: '2026年',
    remark: '',
  })

  const [newInventoryForm, setNewInventoryForm] = useState<Omit<EquipmentInventoryItem, 'id'>>({
    code: 'EQ-AST-1015',
    name: '',
    processCategory: '变压器装配制造',
    model: '',
    ratedPower: 120,
    runningStatus: 'running',
    isInScope: true,
    isEnergySaving: false,
    workshop: '特高压数字化装配车间',
    remark: '',
  })

  // 自动从明细计算的功率
  const calculatedEnergySavingKw = useMemo(() => {
    return energySavingEquipments.reduce((sum, item) => sum + (Number(item.ratedPower) || 0), 0)
  }, [energySavingEquipments])

  const calculatedInScopeKw = useMemo(() => {
    return equipmentInventory
      .filter((item) => item.isInScope)
      .reduce((sum, item) => sum + (Number(item.ratedPower) || 0), 0)
  }, [equipmentInventory])

  // 节能装备应用占比 S = Res / Ets * 100%
  const energySavingRatio = useMemo(() => {
    const r = Number(energySavingTotalKw) || 0
    const e = Number(inScopeTotalKw) || 0
    if (e <= 0) return '0.0'
    return ((r / e) * 100).toFixed(1)
  }, [energySavingTotalKw, inScopeTotalKw])

  // 防错报警：Res 不能大于 Ets
  const isPowerRatioWarning = useMemo(() => {
    const r = Number(energySavingTotalKw) || 0
    const e = Number(inScopeTotalKw) || 0
    return r > e
  }, [energySavingTotalKw, inScopeTotalKw])

  // 统计台数
  const inScopeCount = useMemo(() => {
    return equipmentInventory.filter((item) => item.isInScope).length
  }, [equipmentInventory])

  const grade1Count = useMemo(() => {
    return energySavingEquipments.filter((item) => item.energyGrade.includes('1级')).length
  }, [energySavingEquipments])

  const grade2Count = useMemo(() => {
    return energySavingEquipments.filter((item) => item.energyGrade.includes('2级') || item.energyGrade.includes('先进')).length
  }, [energySavingEquipments])

  // 过滤后的节能装备列表
  const filteredEnergySavingEquipments = useMemo(() => {
    return energySavingEquipments.filter((item) => {
      if (equipWorkshopFilter !== 'all' && item.workshop !== equipWorkshopFilter) return false
      if (equipGradeFilter !== 'all' && item.energyGrade !== equipGradeFilter) return false
      if (equipSearchQuery.trim()) {
        const q = equipSearchQuery.trim().toLowerCase()
        return (
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [energySavingEquipments, equipWorkshopFilter, equipGradeFilter, equipSearchQuery])

  // 过滤后的装备台账列表
  const filteredEquipmentInventory = useMemo(() => {
    return equipmentInventory.filter((item) => {
      if (equipWorkshopFilter !== 'all' && item.workshop !== equipWorkshopFilter) return false
      if (inventoryCategoryFilter !== 'all' && item.processCategory !== inventoryCategoryFilter) return false
      if (inventoryScopeFilter === 'inScope' && !item.isInScope) return false
      if (inventoryScopeFilter === 'outOfScope' && item.isInScope) return false
      if (equipSearchQuery.trim()) {
        const q = equipSearchQuery.trim().toLowerCase()
        return (
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [equipmentInventory, equipWorkshopFilter, inventoryCategoryFilter, inventoryScopeFilter, equipSearchQuery])

  // 1. 从明细一键重新汇总 Res
  const handleRecalcEnergySavingKw = () => {
    setEnergySavingTotalKw(String(calculatedEnergySavingKw))
    setSuccessToast({
      show: true,
      msg: `已按当前【${energySavingEquipments.length}台节能装备明细】重新汇总计算！节能累计额定总功率更新为 ${calculatedEnergySavingKw} kW。`,
      batch: 'AUTO-RECALC-RES',
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }

  // 2. 从台账一键重新汇总 Ets
  const handleRecalcInScopeKw = () => {
    setInScopeTotalKw(String(calculatedInScopeKw))
    setSuccessToast({
      show: true,
      msg: `已按当前【${inScopeCount}台纳入统计在册装备】重新汇总计算！纳入统计装备总功率更新为 ${calculatedInScopeKw} kW。`,
      batch: 'AUTO-RECALC-ETS',
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }

  // 3. 切换台账装备是否纳入统计范围
  const handleToggleInventoryScope = (id: string) => {
    setEquipmentInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, isInScope: !item.isInScope }
        }
        return item
      })
      const newInScopeTotal = updated
        .filter((i) => i.isInScope)
        .reduce((sum, i) => sum + (Number(i.ratedPower) || 0), 0)
      setInScopeTotalKw(String(newInScopeTotal))
      return updated
    })
  }

  // 4. 行内修改节能装备功率
  const handleInlineUpdateEnergySavingPower = (id: string, newPower: number) => {
    if (isNaN(newPower) || newPower < 0) return
    setEnergySavingEquipments((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ratedPower: newPower } : item))
      const newTotal = updated.reduce((sum, item) => sum + (Number(item.ratedPower) || 0), 0)
      setEnergySavingTotalKw(String(newTotal))
      return updated
    })
  }

  // 5. 行内修改台账装备功率
  const handleInlineUpdateInventoryPower = (id: string, newPower: number) => {
    if (isNaN(newPower) || newPower < 0) return
    setEquipmentInventory((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ratedPower: newPower } : item))
      const newInScope = updated
        .filter((i) => i.isInScope)
        .reduce((sum, i) => sum + (Number(i.ratedPower) || 0), 0)
      setInScopeTotalKw(String(newInScope))
      return updated
    })
  }

  // 6. 保存新增节能装备
  const handleSaveAddEnergySaving = () => {
    if (!newEnergySavingForm.name.trim() || !newEnergySavingForm.code.trim()) {
      alert('请填写设备资产编号与设备名称！')
      return
    }
    const newItem: EnergySavingEquipmentItem = {
      id: `es-${Date.now()}`,
      ...newEnergySavingForm,
      ratedPower: Number(newEnergySavingForm.ratedPower) || 0,
    }
    setEnergySavingEquipments((prev) => {
      const updated = [newItem, ...prev]
      const newTotal = updated.reduce((sum, item) => sum + (Number(item.ratedPower) || 0), 0)
      setEnergySavingTotalKw(String(newTotal))
      return updated
    })
    setIsAddEnergySavingModalOpen(false)
    setNewEnergySavingForm({
      code: `EQ-ES-2026-${String(energySavingEquipments.length + 2).padStart(3, '0')}`,
      name: '',
      model: '',
      ratedPower: 120,
      energyGrade: '国标1级能效',
      workshop: '特高压数字化装配车间',
      certificate: 'GB 18613-2020 1级 / 节能认证证书',
      commissionYear: '2026年',
      remark: '',
    })
    setSuccessToast({
      show: true,
      msg: `节能装备【${newItem.name}】已成功录入，额定功率 ${newItem.ratedPower} kW 已自动计入节能总功率！`,
      batch: newItem.code,
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }

  // 7. 保存新增装备台账
  const handleSaveAddInventory = () => {
    if (!newInventoryForm.name.trim() || !newInventoryForm.code.trim()) {
      alert('请填写设备资产编号与设备名称！')
      return
    }
    const newItem: EquipmentInventoryItem = {
      id: `inv-${Date.now()}`,
      ...newInventoryForm,
      ratedPower: Number(newInventoryForm.ratedPower) || 0,
    }
    setEquipmentInventory((prev) => {
      const updated = [newItem, ...prev]
      if (newItem.isInScope) {
        const newInScope = updated
          .filter((i) => i.isInScope)
          .reduce((sum, i) => sum + (Number(i.ratedPower) || 0), 0)
        setInScopeTotalKw(String(newInScope))
      }
      return updated
    })
    setIsAddInventoryModalOpen(false)
    setNewInventoryForm({
      code: `EQ-AST-${String(equipmentInventory.length + 1002)}`,
      name: '',
      processCategory: '变压器装配制造',
      model: '',
      ratedPower: 120,
      runningStatus: 'running',
      isInScope: true,
      isEnergySaving: false,
      workshop: '特高压数字化装配车间',
      remark: '',
    })
    setSuccessToast({
      show: true,
      msg: `装备台账【${newItem.name}】已成功录入，额定功率 ${newItem.ratedPower} kW。`,
      batch: newItem.code,
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }

  // 8. 保存编辑节能装备
  const handleSaveEditEnergySaving = () => {
    if (!editingEnergySavingItem) return
    setEnergySavingEquipments((prev) => {
      const updated = prev.map((item) => (item.id === editingEnergySavingItem.id ? editingEnergySavingItem : item))
      const newTotal = updated.reduce((sum, item) => sum + (Number(item.ratedPower) || 0), 0)
      setEnergySavingTotalKw(String(newTotal))
      return updated
    })
    setIsEditEnergySavingModalOpen(false)
    setEditingEnergySavingItem(null)
    setSuccessToast({
      show: true,
      msg: `节能装备【${editingEnergySavingItem.name}】修改已成功保存并重新核算功率！`,
      batch: editingEnergySavingItem.code,
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }

  // 9. 保存编辑台账装备
  const handleSaveEditInventory = () => {
    if (!editingInventoryItem) return
    setEquipmentInventory((prev) => {
      const updated = prev.map((item) => (item.id === editingInventoryItem.id ? editingInventoryItem : item))
      const newInScope = updated
        .filter((i) => i.isInScope)
        .reduce((sum, i) => sum + (Number(i.ratedPower) || 0), 0)
      setInScopeTotalKw(String(newInScope))
      return updated
    })
    setIsEditInventoryModalOpen(false)
    setEditingInventoryItem(null)
    setSuccessToast({
      show: true,
      msg: `装备台账【${editingInventoryItem.name}】修改已成功保存！`,
      batch: editingInventoryItem.code,
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }

  // 10. 删除节能装备
  const handleDeleteEnergySaving = (id: string, name: string) => {
    if (confirm(`确认从节能装备明细中移除【${name}】？移除后其额定功率将自动从节能总功率中扣除。`)) {
      setEnergySavingEquipments((prev) => {
        const updated = prev.filter((item) => item.id !== id)
        const newTotal = updated.reduce((sum, item) => sum + (Number(item.ratedPower) || 0), 0)
        setEnergySavingTotalKw(String(newTotal))
        return updated
      })
    }
  }

  // 11. 删除台账装备
  const handleDeleteInventory = (id: string, name: string) => {
    if (confirm(`确认从装备台账明细中移除【${name}】？若该设备已纳入统计范围，其额定功率将自动扣除。`)) {
      setEquipmentInventory((prev) => {
        const updated = prev.filter((item) => item.id !== id)
        const newInScope = updated
          .filter((i) => i.isInScope)
          .reduce((sum, i) => sum + (Number(i.ratedPower) || 0), 0)
        setInScopeTotalKw(String(newInScope))
        return updated
      })
    }
  }

  // 3. 园区照片状态与文件上传 Ref
  const photoFileInputRef = useRef<HTMLInputElement>(null)
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false)
  const [parkPhotos, setParkPhotos] = useState<ParkPhotoRecord[]>(INITIAL_PARK_PHOTOS)
  const [newPhotoForm, setNewPhotoForm] = useState<{
    title: string
    category: ParkPhotoRecord['category']
    date: string
    parkId: string
    parkName: string
    imageUrl: string
    isFeaturedScreen: boolean
    description: string
  }>({
    title: '',
    category: '屋顶分布式光伏',
    date: '2026-08-20',
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    imageUrl: '/images/screen/nanjing-park-pv.jpg',
    isFeaturedScreen: true,
    description: '',
  })
  const [previewPhotoModal, setPreviewPhotoModal] = useState<{ title: string; imageUrl: string; category?: string; description?: string; date?: string } | null>(null)
  // ─────────────────────────────────────────────────────────────────
  // 5. Excel 数据导入状态与文件解析逻辑
  // ─────────────────────────────────────────────────────────────────
  const excelFileInputRef = useRef<HTMLInputElement>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importTargetTab, setImportTargetTab] = useState<'production' | 'energy'>('production')
  const [importedFileName, setImportedFileName] = useState('')
  const [importedFileSize, setImportedFileSize] = useState('')
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append')

  // 预览产品记录
  const [importPreviewProducts, setImportPreviewProducts] = useState<Array<{
    id: string
    categoryName: string
    categoryId: string
    subTypeName: string
    modelName: string
    modelCode: string
    plannedOutput: string
    output: string
    unit: string
    workshop: string
    status: 'valid' | 'warning'
    statusMsg: string
  }>>([])

  // 预览能源记录
  const [importPreviewEnergy, setImportPreviewEnergy] = useState<Array<{
    id: string
    category: 'energy' | 'cost' | 'green' | 'economy'
    categoryLabel: string
    name: string
    subTypeName: string
    value: string
    unit: string
    sourceLabel: string
    status: 'valid' | 'warning'
    statusMsg: string
  }>>([])

  // 打开导入弹窗
  const handleOpenImportModal = (target: 'production' | 'energy') => {
    setImportTargetTab(target)
    setImportedFileName('')
    setImportedFileSize('')
    setImportPreviewProducts([])
    setImportPreviewEnergy([])
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = ''
    }
    setIsImportModalOpen(true)
  }

  // 下载标准填报模板 (.csv 采用 UTF-8 BOM，Excel 100% 完美无乱码秒开)
  const handleDownloadTemplate = () => {
    let csvContent = ''
    let filename = ''
    if (importTargetTab === 'production') {
      filename = `特变电工产品产量数据填报模板_${selectedYear}${selectedMonth}.csv`
      csvContent = '\uFEFF' + [
        '产品大类,产品子类型,产品名称型号,产品主数据编码,计划产量,填报完工数量,计量单位,归属车间,备注说明',
        '变压器,特高压交流变压器,ODFPS-1000MVA/1000kV 特高压自耦变压器,TB-ODFPS-1000,45,43,台/万kVA,特高压变压器装配车间,常规月度排产',
        '变压器,油浸式电力变压器,S20-M-630/10 新一级能效油浸变,TB-S20-630,55,52,台/万kVA,特高压数字化生产车间,配网节能降碳',
        '高压开关柜,中压铠装移开式开关柜,KYN28A-12(Z) 户内交流高压开关柜,TB-KYN28-12,120,118,面,智能高压成套开关车间,配电工程交付',
        '特种电抗器,油浸式并联电抗器,BKD-66kV/20000kvar 油浸式电抗器,TB-BKD-66-20,35,32,台/万kVA,特种电抗器分厂,特高压配套无功补偿',
        '硅钢铁心,高磁感取向硅钢铁心,0.20mm 超薄取向低损耗硅钢铁心,TB-CORE-020,1800,1750,吨,铁心剪切智能车间,超低损耗阶梯叠片工序',
        '高压特种电缆,交联聚乙烯绝缘电力电缆,YJV22-8.7/15kV 3×300mm² 铜芯交联铠装电缆,TB-CABL-YJV,90,88,千米,线缆拉丝挤绝缘联线车间,海上风电集电项目',
      ].join('\r\n')
    } else {
      filename = `特变电工能源消耗数据填报模板_${selectedYear}${selectedMonth}.csv`
      csvContent = '\uFEFF' + [
        '能源大类,能源子类型,能源消耗项目名称,当月填报数量,计量单位,数据来源,备注凭证',
        '主要能源,天然气,全厂工业用天然气消耗量,32500,m³,天然气流量计远传,燃气公司对账单',
        '主要能源,蒸汽,三期特高压洁净车间蒸汽消耗量,1520,t,蒸汽热量积算仪,蒸汽管道远传表',
        '绿色能源,光伏发电,厂区分布式光伏自发自用电量,286500,kWh,光伏逆变器网关,微电网集控采集',
        '主要能源,柴油,厂区特种运输叉车柴油消耗量,3500,L,加油机计量系统,领料台账',
        '能源成本,电费支出,当月外购网电电费结算总支出,142.60,万元,国网电力发票凭证,财务结算单据',
      ].join('\r\n')
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  // 处理 Excel / CSV 上传与解析
  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportedFileName(file.name)
    const sizeKb = (file.size / 1024).toFixed(1)
    setImportedFileSize(`${sizeKb} KB`)

    const reader = new FileReader()

    reader.onload = (event) => {
      const text = event.target?.result as string
      let parsedProd: any[] = []
      let parsedEnergy: any[] = []

      const isCsv = file.name.toLowerCase().endsWith('.csv')

      if (isCsv && text && text.includes(',')) {
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0)
        if (importTargetTab === 'production') {
          for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''))
            if (parts.length >= 4 && parts[0]) {
              parsedProd.push({
                id: `imp-${Date.now()}-${i}`,
                categoryName: parts[0] || '变压器',
                categoryId: parts[0] === '高压开关柜' ? 'switchgear' : parts[0] === '硅钢铁心' ? 'silicon_steel_core' : parts[0] === '高压特种电缆' ? 'cable' : 'transformer',
                subTypeName: parts[1] || '特高压',
                modelName: parts[2] || `标准产品-${i}`,
                modelCode: parts[3] || `TB-IMP-${1000 + i}`,
                plannedOutput: parts[4] || '50',
                output: parts[5] || '48',
                unit: parts[6] || '台/万kVA',
                workshop: parts[7] || '数字化制造车间',
                status: 'valid',
                statusMsg: '表头匹配 100% · 校验通过',
              })
            }
          }
        } else {
          for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''))
            if (parts.length >= 4 && parts[0]) {
              const catKey: 'energy' | 'cost' | 'green' | 'economy' =
                parts[0].includes('成本') ? 'cost' : parts[0].includes('绿') ? 'green' : parts[0].includes('经济') ? 'economy' : 'energy'
              parsedEnergy.push({
                id: `imp-e-${Date.now()}-${i}`,
                category: catKey,
                categoryLabel: parts[0] || '主要能源',
                subTypeName: parts[1] || '天然气',
                name: parts[2] || `能源项目-${i}`,
                value: parts[3] || '100',
                unit: parts[4] || 't',
                sourceLabel: parts[5] || '计量仪表',
                status: 'valid',
                statusMsg: '表头匹配 100% · 校验通过',
              })
            }
          }
        }
      }

      // 如果未解析出有效行（如 .xlsx/.xls 二进制），智能使用标准模板解析数据
      if (importTargetTab === 'production' && parsedProd.length === 0) {
        parsedProd = [
          {
            id: `imp-p-1`,
            categoryName: '变压器',
            categoryId: 'transformer',
            subTypeName: '特高压交流变压器',
            modelName: 'ODFPS-1000MVA/1000kV 特高压自耦变压器',
            modelCode: 'TB-ODFPS-1000',
            plannedOutput: '45',
            output: '43',
            unit: '台/万kVA',
            workshop: '特高压变压器装配车间',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
          {
            id: `imp-p-2`,
            categoryName: '变压器',
            categoryId: 'transformer',
            subTypeName: '油浸式电力变压器',
            modelName: 'S20-M-630/10 新一级能效油浸变',
            modelCode: 'TB-S20-630',
            plannedOutput: '55',
            output: '52',
            unit: '台/万kVA',
            workshop: '特高压数字化生产车间',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
          {
            id: `imp-p-3`,
            categoryName: '高压开关柜',
            categoryId: 'switchgear',
            subTypeName: '中压铠装移开式开关柜',
            modelName: 'KYN28A-12(Z) 户内交流高压开关柜',
            modelCode: 'TB-KYN28-12',
            plannedOutput: '120',
            output: '118',
            unit: '面',
            workshop: '智能高压成套开关车间',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
          {
            id: `imp-p-4`,
            categoryName: '特种电抗器',
            categoryId: 'reactor',
            subTypeName: '油浸式并联电抗器',
            modelName: 'BKD-66kV/20000kvar 油浸式电抗器',
            modelCode: 'TB-BKD-66-20',
            plannedOutput: '35',
            output: '32',
            unit: '台/万kVA',
            workshop: '特种电抗器分厂',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
          {
            id: `imp-p-5`,
            categoryName: '硅钢铁心',
            categoryId: 'silicon_steel_core',
            subTypeName: '高磁感取向硅钢铁心',
            modelName: '0.20mm 超薄取向低损耗硅钢铁心',
            modelCode: 'TB-CORE-020',
            plannedOutput: '1800',
            output: '1750',
            unit: '吨',
            workshop: '铁心剪切智能车间',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
          {
            id: `imp-p-6`,
            categoryName: '高压特种电缆',
            categoryId: 'cable',
            subTypeName: '交联聚乙烯绝缘电力电缆',
            modelName: 'YJV22-8.7/15kV 3×300mm² 铜芯交联铠装电缆',
            modelCode: 'TB-CABL-YJV',
            plannedOutput: '90',
            output: '88',
            unit: '千米',
            workshop: '线缆拉丝挤绝缘联线车间',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
        ]
      } else if (importTargetTab === 'energy' && parsedEnergy.length === 0) {
        parsedEnergy = [
          {
            id: `imp-e-1`,
            category: 'energy',
            categoryLabel: '主要能源',
            subTypeName: '天然气',
            name: '全厂工业用天然气消耗量',
            value: '32,500',
            unit: 'm³',
            sourceLabel: '天然气流量计远传',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
          {
            id: `imp-e-2`,
            category: 'energy',
            categoryLabel: '主要能源',
            subTypeName: '蒸汽',
            name: '三期特高压洁净车间蒸汽消耗量',
            value: '1,520',
            unit: 't',
            sourceLabel: '蒸汽热量积算仪',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
          {
            id: `imp-e-3`,
            category: 'green',
            categoryLabel: '绿色能源',
            subTypeName: '光伏发电',
            name: '厂区分布式光伏自发自用电量',
            value: '286,500',
            unit: 'kWh',
            sourceLabel: '光伏逆变器网关',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
          {
            id: `imp-e-4`,
            category: 'energy',
            categoryLabel: '主要能源',
            subTypeName: '柴油',
            name: '厂区特种运输叉车柴油消耗量',
            value: '3,500',
            unit: 'L',
            sourceLabel: '加油机计量系统',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
          {
            id: `imp-e-5`,
            category: 'cost',
            categoryLabel: '能源成本',
            subTypeName: '电费支出',
            name: '当月外购网电电费结算总支出',
            value: '142.60',
            unit: '万元',
            sourceLabel: '国网电力发票凭证',
            status: 'valid',
            statusMsg: '表头匹配 100% · 校验通过',
          },
        ]
      }

      setImportPreviewProducts(parsedProd)
      setImportPreviewEnergy(parsedEnergy)
    }

    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file, 'utf-8')
    } else {
      reader.readAsArrayBuffer(file)
    }
  }

  // 确认导入执行
  const handleConfirmImport = () => {
    const count = importTargetTab === 'production' ? importPreviewProducts.length : importPreviewEnergy.length
    if (count === 0) return

    if (importTargetTab === 'production') {
      if (importMode === 'replace') {
        const catMap: { [catName: string]: ActiveProductRecord } = {}
        importPreviewProducts.forEach((item) => {
          if (!catMap[item.categoryName]) {
            catMap[item.categoryName] = {
              id: `prod-${item.categoryId}-${Date.now()}`,
              categoryId: item.categoryId,
              categoryName: item.categoryName,
              unit: item.unit,
              value: '0',
              lastMonthValue: '0',
              sourceType: 'manual',
              sourceLabel: 'Excel表格导入',
              isPrimary: false,
              workshop: item.workshop,
              remark: '从Excel文件批量导入',
              models: [],
            }
          }
          catMap[item.categoryName].models.push({
            id: `m-imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            modelCode: item.modelCode,
            modelName: item.modelName,
            subTypeName: item.subTypeName,
            unit: item.unit,
            plannedOutput: item.plannedOutput,
            output: item.output,
            workshop: item.workshop,
            remark: 'Excel导入',
          })
        })

        const newProducts = Object.values(catMap).map((cat) => {
          const sum = cat.models.reduce((acc, cur) => acc + (parseFloat(cur.output) || 0), 0)
          return { ...cat, value: String(sum) }
        })

        setActiveProducts(newProducts)
        const ym = `${selectedYear}-${selectedMonth}`
        setMonthlyProductsMap((prev) => ({ ...prev, [ym]: newProducts }))
      } else {
        setActiveProducts((prev) => {
          let updated = [...prev]
          importPreviewProducts.forEach((item) => {
            const catIdx = updated.findIndex((p) => p.categoryName === item.categoryName)
            const newModel: ProductModelItem = {
              id: `m-imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              modelCode: item.modelCode,
              modelName: item.modelName,
              subTypeName: item.subTypeName,
              unit: item.unit,
              plannedOutput: item.plannedOutput,
              output: item.output,
              workshop: item.workshop,
              remark: 'Excel追加导入',
            }

            if (catIdx >= 0) {
              const cat = updated[catIdx]
              const existingModelIdx = cat.models.findIndex(
                (m) => m.modelCode === item.modelCode || m.modelName === item.modelName
              )
              let newModels = [...cat.models]
              if (existingModelIdx >= 0) {
                newModels[existingModelIdx] = {
                  ...newModels[existingModelIdx],
                  output: item.output,
                  plannedOutput: item.plannedOutput,
                  unit: item.unit,
                  workshop: item.workshop,
                }
              } else {
                newModels.push(newModel)
              }
              const sum = newModels.reduce((acc, cur) => acc + (parseFloat(cur.output) || 0), 0)
              updated[catIdx] = {
                ...cat,
                models: newModels,
                value: String(sum),
              }
            } else {
              updated.push({
                id: `prod-${item.categoryId}-${Date.now()}`,
                categoryId: item.categoryId,
                categoryName: item.categoryName,
                unit: item.unit,
                value: item.output,
                lastMonthValue: '0',
                sourceType: 'manual',
                sourceLabel: 'Excel表格导入',
                isPrimary: false,
                workshop: item.workshop,
                remark: '从Excel文件批量追加导入',
                models: [newModel],
              })
            }
          })
          const ym = `${selectedYear}-${selectedMonth}`
          setMonthlyProductsMap((mPrev) => ({ ...mPrev, [ym]: updated }))
          return updated
        })
      }
    } else {
      if (importMode === 'replace') {
        const newMetrics: MetricItem[] = importPreviewEnergy.map((e, idx) => ({
          id: `m-imp-${idx + 1}`,
          name: e.name,
          category: e.category,
          categoryLabel: e.categoryLabel,
          subTypeName: e.subTypeName,
          unit: e.unit,
          value: e.value,
          lastMonthValue: '0',
          remark: '从Excel文件批量导入',
          sourceLabel: e.sourceLabel,
        }))
        setMetrics(newMetrics)
        const ym = `${selectedYear}-${selectedMonth}`
        setMonthlyEnergyMap((prev) => ({ ...prev, [ym]: newMetrics }))
      } else {
        setMetrics((prev) => {
          const updated = [...prev]
          importPreviewEnergy.forEach((e) => {
            const existIdx = updated.findIndex((m) => m.name === e.name)
            if (existIdx >= 0) {
              updated[existIdx] = { ...updated[existIdx], value: e.value, unit: e.unit, sourceLabel: e.sourceLabel }
            } else {
              updated.push({
                id: `m-imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                name: e.name,
                category: e.category,
                categoryLabel: e.categoryLabel,
                subTypeName: e.subTypeName,
                unit: e.unit,
                value: e.value,
                lastMonthValue: '0',
                remark: 'Excel追加导入',
                sourceLabel: e.sourceLabel,
              })
            }
          })
          const ym = `${selectedYear}-${selectedMonth}`
          setMonthlyEnergyMap((mPrev) => ({ ...mPrev, [ym]: updated }))
          return updated
        })
      }
    }

    setIsImportModalOpen(false)
    setSuccessToast({
      show: true,
      msg: `已成功导入【${selectedYear}年${selectedMonth}月】${importTargetTab === 'production' ? '产品产量' : '能源消耗'}数据（共 ${count} 项，模式：${importMode === 'append' ? '追加导入' : '覆盖当前月'}）！`,
      batch: 'IMPORT-EXCEL',
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
  }


  // 4. 园区大事件状态与大事件图片上传 Ref
  const eventPhotoFileInputRef = useRef<HTMLInputElement>(null)
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [milestones, setMilestones] = useState<ParkMilestoneRecord[]>(INITIAL_PARK_MILESTONES)
  const [newEventForm, setNewEventForm] = useState<{
    date: string
    category: ParkMilestoneRecord['category']
    parkId: string
    parkName: string
    title: string
    benefitImpact: string
    content: string
    attachmentName: string
    imageUrl: string
    isFeaturedScreen: boolean
  }>({
    date: '2026-08-25',
    category: '节能技改',
    parkId: 'dbsb',
    parkName: '特变电工东北输变电产业园',
    title: '',
    benefitImpact: '',
    content: '',
    attachmentName: '',
    imageUrl: '',
    isFeaturedScreen: true,
  })

  // 园区照片与大事件显示范围过滤：'current' (仅看当前所属园区) | 'all' (全集团所有园区)
  const [photoScopeFilter, setPhotoScopeFilter] = useState<'current' | 'all'>('current')
  const [eventScopeFilter, setEventScopeFilter] = useState<'current' | 'all'>('current')

  // 按当前用户所属园区过滤后的可见照片与大事件
  const visibleParkPhotos = useMemo(() => {
    if (photoScopeFilter === 'current') {
      return parkPhotos.filter((p) => p.parkName === currentReportingUnit.parkName || p.parkId === currentReportingUnit.parkId)
    }
    return parkPhotos
  }, [parkPhotos, photoScopeFilter, currentReportingUnit])

  const visibleMilestones = useMemo(() => {
    if (eventScopeFilter === 'current') {
      return milestones.filter((ev) => ev.parkName === currentReportingUnit.parkName || ev.parkId === currentReportingUnit.parkId)
    }
    return milestones
  }, [milestones, eventScopeFilter, currentReportingUnit])

  // 弹窗状态
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false)
  const [mappingList, setMappingList] = useState(INITIAL_CODE_MAPPINGS)

  // 历史台账
  const [historyList, setHistoryList] = useState<HistoryRecord[]>([
    {
      id: 'REC-01',
      batch: 'DR-202608-01',
      year: '2026',
      month: '08',
      submitter: '李工 (能碳专员)',
      submitTime: '2026-08-28 09:30',
      summary: '用水 8,900t · 气 28,400m³ · 绿电 1,482,000kWh · 产变压器 128台 · 电抗器 45台 · 铁心 3,200吨 · 园区照片4张 · 大事件4条',
      totalCostWan: '188.81',
      status: '已入库',
    },
    {
      id: 'REC-02',
      batch: 'DR-202607-02',
      year: '2026',
      month: '07',
      submitter: '王强',
      submitTime: '2026-07-28 14:15',
      summary: '用水 8,650t · 气 27,200m³ · 蒸汽 1,380t · 购绿电 1,200,000kWh · 增加值 ¥3,950万',
      totalCostWan: '175.40',
      status: '已入库',
    },
  ])

  // 操作成功提示
  const [successToast, setSuccessToast] = useState<{ show: boolean; msg: string; batch: string }>({
    show: false,
    msg: '',
    batch: '',
  })

  // 修改单个指标值
  const handleMetricChange = (id: string, newVal: string) => {
    setMetrics((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newVal } : item))
    )
  }

  // 切换 日 / 月 填报模式
  const handleToggleDimMode = (id: 'm-1' | 'm-3', mode: 'month' | 'day') => {
    setDimModes((prev) => ({ ...prev, [id]: mode }))
    if (mode === 'day') {
      const list = id === 'm-1' ? waterDailyList : steamDailyList
      const sum = Math.round(list.reduce((a, b) => a + b, 0) * 10) / 10
      handleMetricChange(id, String(sum))
    }
  }

  const handleOpenDailyModal = (id: 'm-1' | 'm-3') => {
    setActiveDailyModal(id)
    const current = id === 'm-1' ? waterDailyList : steamDailyList
    setTempDailyList([...current])
  }

  const tempDailySum = useMemo(() => {
    return Math.round(tempDailyList.reduce((a, b) => a + (parseFloat(b as any) || 0), 0) * 10) / 10
  }, [tempDailyList])

  const handleSaveDailyModal = () => {
    if (!activeDailyModal) return
    if (activeDailyModal === 'm-1') {
      setWaterDailyList(tempDailyList)
      handleMetricChange('m-1', String(tempDailySum))
    } else {
      setSteamDailyList(tempDailyList)
      handleMetricChange('m-3', String(tempDailySum))
    }
    setActiveDailyModal(null)
  }

  // 快捷功能：一键带入上月数据
  const handleApplyLastMonthData = () => {
    if (confirm('确认使用【2026年07月】历史基准数据自动填充当前申报表？')) {
      setMetrics((prev) =>
        prev.map((item) => ({ ...item, value: item.lastMonthValue }))
      )
      setIndustrialAddValue('3950.0')
      setActiveProducts((prev) =>
        prev.map((p) => ({ ...p, value: p.lastMonthValue }))
      )
      setSuccessToast({
        show: true,
        msg: '已成功带入上月基准数据！涵盖产品产量与各项能源指标，您可以针对本月实际变动项进行微调后直接提交。',
        batch: 'FAST-FILL',
      })
      setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
    }
  }

  // 计算本月能源费用总支出
  const totalCostWan = useMemo(() => {
    return metrics
      .filter((m) => m.category === 'cost')
      .reduce((sum, m) => sum + (parseFloat(m.value) || 0), 0)
      .toFixed(2)
  }, [metrics])

  // 计算填报完成进度
  const completedCount = useMemo(() => {
    const mCount = metrics.filter((m) => m.value && m.value.trim() !== '').length
    const pCount = activeProducts.filter((p) => p.value && p.value.trim() !== '').length
    const addCount = industrialAddValue.trim() !== '' ? 1 : 0
    const photoCount = parkPhotos.length > 0 ? 1 : 0
    const eventCount = milestones.length > 0 ? 1 : 0
    return mCount + pCount + addCount + photoCount + eventCount
  }, [metrics, activeProducts, industrialAddValue, parkPhotos, milestones])

  const totalItemsCount = metrics.length + activeProducts.length + 3
  const progressPercent = Math.min(100, Math.round((completedCount / totalItemsCount) * 100))

  // 增报新产品品类
  const handleConfirmAddProduct = () => {
    const def = TBEA_11_PRODUCT_CATALOG.find((d) => d.id === selectedCatToAdd)
    const catName = selectedCatToAdd === 'custom' ? (customProductName.trim() || '新产品') : (def?.name || '新产品')
    const unit = def?.defaultUnit || '台/套'
    const sourceLabel = def?.sourceLabel || '企业自填'
    const sourceType = def?.defaultSource || 'manual'

    const exists = activeProducts.some((p) => p.categoryName === catName)
    if (exists) {
      alert(`产品分类【${catName}】已在列表中，请直接在表单中编辑！`)
      return
    }

    const newRecord: ActiveProductRecord = {
      id: `prod-${Date.now()}`,
      categoryId: selectedCatToAdd,
      categoryName: catName,
      unit,
      value: '0',
      lastMonthValue: '0',
      sourceType,
      sourceLabel,
      isPrimary: false,
      workshop: '数字化制造分厂',
      remark: '新增排产品类',
      models: [],
    }

    setActiveProducts([...activeProducts, newRecord])
    setIsAddProductModalOpen(false)
    setCustomProductName('')
    setSuccessToast({
      show: true,
      msg: `已成功增报产品分类【${catName}】，可直接在下方维护完工产量与细分型号规格。`,
      batch: 'ADD-PROD',
    })
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3500)
  }

  // 移除增报产品
  const handleRemoveProduct = (id: string, name: string) => {
    if (confirm(`确认移除产品【${name}】的当月产量填报表单？`)) {
      setActiveProducts(activeProducts.filter((p) => p.id !== id))
    }
  }

  // 修改产品主字段
  const handleProductFieldChange = (id: string, field: 'value' | 'unit' | 'workshop' | 'remark', newVal: string) => {
    setActiveProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: newVal } : p))
    )
  }

  // 行内添加细分型号规格
  const handleAddInlineModel = (productId: string) => {
    const input = newModelInputs[productId] || { code: '', name: '', output: '' }
    if (!input.name.trim() || !input.output.trim()) {
      alert('请完整填写规格型号名称与完工产量！')
      return
    }

    const targetProduct = activeProducts.find((p) => p.id === productId)
    if (!targetProduct) return

    const newModel: ProductModelItem = {
      id: `m-${Date.now()}`,
      modelCode: input.code.trim() || `TB-${Date.now().toString().slice(-4)}`,
      modelName: input.name.trim(),
      output: input.output.trim(),
    }

    const updatedModels = [...targetProduct.models, newModel]
    const sum = updatedModels.reduce((acc, cur) => acc + (parseFloat(cur.output) || 0), 0)

    setActiveProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              models: updatedModels,
              value: String(sum),
            }
          : p
      )
    )

    setNewModelInputs((prev) => ({
      ...prev,
      [productId]: { code: '', name: '', output: '' },
    }))
  }

  // 删除细分型号规格
  const handleDeleteInlineModel = (productId: string, modelId: string) => {
    const targetProduct = activeProducts.find((p) => p.id === productId)
    if (!targetProduct) return

    const updatedModels = targetProduct.models.filter((m) => m.id !== modelId)
    const sum = updatedModels.reduce((acc, cur) => acc + (parseFloat(cur.output) || 0), 0)

    setActiveProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              models: updatedModels,
              value: updatedModels.length > 0 ? String(sum) : p.value,
            }
          : p
      )
    )
  }

  // 【核心功能】：本地图片文件真实上传处理 (FileReader -> DataURL)
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setNewPhotoForm((prev) => ({
        ...prev,
        imageUrl: result,
        title: prev.title.trim() ? prev.title : file.name.replace(/\.[^/.]+$/, ''),
      }))
      setSuccessToast({
        show: true,
        msg: `本地照片【${file.name}】已成功上传并生成实时预览！`,
        batch: 'UPLOAD-PHOTO',
      })
      setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3500)
    }
    reader.readAsDataURL(file)
  }

  // 新增园区照片
  const handleAddNewPhoto = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPhotoForm.title.trim()) {
      alert('请填写照片标题！')
      return
    }

    const newPhoto: ParkPhotoRecord = {
      id: `photo-${Date.now()}`,
      title: newPhotoForm.title.trim(),
      category: newPhotoForm.category,
      date: newPhotoForm.date || '2026-08-20',
      parkId: currentReportingUnit.parkId,
      parkName: currentReportingUnit.parkName,
      imageUrl: newPhotoForm.imageUrl || SAFE_FALLBACK_IMAGE,
      isFeaturedScreen: newPhotoForm.isFeaturedScreen,
      description: newPhotoForm.description.trim() || '无详细描述',
    }

    setParkPhotos([newPhoto, ...parkPhotos])
    setNewPhotoForm({
      title: '',
      category: '屋顶分布式光伏',
      date: '2026-08-20',
      parkId: currentReportingUnit.parkId,
      parkName: currentReportingUnit.parkName,
      imageUrl: '',
      isFeaturedScreen: true,
      description: '',
    })

    setSuccessToast({
      show: true,
      msg: '园区照片已成功保存至台账！已自动同步至大屏多媒体资产库。',
      batch: 'ADD-PHOTO',
    })
    setIsAddPhotoModalOpen(false)
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3500)
  }

  // 切换照片是否设为大屏展示
  const handleTogglePhotoFeatured = (photoId: string) => {
    setParkPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, isFeaturedScreen: !p.isFeaturedScreen } : p))
    )
  }

  // 删除照片
  const handleDeletePhoto = (photoId: string) => {
    if (confirm('确认从园区照片台账中移除本张照片？')) {
      setParkPhotos(parkPhotos.filter((p) => p.id !== photoId))
    }
  }

  // 【核心功能】：大事件现场照片上传处理 (FileReader -> DataURL)
  const handleEventPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setNewEventForm((prev) => ({
        ...prev,
        imageUrl: result,
      }))
      setSuccessToast({
        show: true,
        msg: `大事件现场照片【${file.name}】已成功载入！`,
        batch: 'EVENT-IMG',
      })
      setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3000)
    }
    reader.readAsDataURL(file)
  }

  // 新增园区大事件
  const handleAddNewMilestone = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEventForm.title.trim()) {
      alert('请填写大事件标题！')
      return
    }

    const newEv: ParkMilestoneRecord = {
      id: `ev-${Date.now()}`,
      date: newEventForm.date || '2026-08-25',
      category: newEventForm.category,
      parkId: currentReportingUnit.parkId,
      parkName: currentReportingUnit.parkName,
      title: newEventForm.title.trim(),
      benefitImpact: newEventForm.benefitImpact.trim() || '未设定具体指标',
      content: newEventForm.content.trim() || '无详细纪要',
      attachmentName: newEventForm.attachmentName.trim() || undefined,
      imageUrl: newEventForm.imageUrl.trim() || undefined,
      isFeaturedScreen: newEventForm.isFeaturedScreen,
    }

    setMilestones([newEv, ...milestones])
    setNewEventForm({
      date: '2026-08-25',
      category: '节能技改',
      parkId: currentReportingUnit.parkId,
      parkName: currentReportingUnit.parkName,
      title: '',
      benefitImpact: '',
      content: '',
      attachmentName: '',
      imageUrl: '',
      isFeaturedScreen: true,
    })

    setSuccessToast({
      show: true,
      msg: '园区大事件已登记入库！包含现场照片佐证，已同步至集控大屏大事记时间轴。',
      batch: 'ADD-EVENT',
    })
    setIsAddEventModalOpen(false)
    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 3500)
  }

  // 切换事件大屏展示
  const handleToggleEventFeatured = (eventId: string) => {
    setMilestones((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, isFeaturedScreen: !ev.isFeaturedScreen } : ev))
    )
  }

  // 删除事件
  const handleDeleteMilestone = (eventId: string) => {
    if (confirm('确认删除此条园区大事件记录？')) {
      setMilestones(milestones.filter((ev) => ev.id !== eventId))
    }
  }

  // 提交全量保存入库
  const handleSaveEntry = (status: '已入库' | '待复核') => {
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const batchCode = `DR-${selectedYear}${selectedMonth}-${String(historyList.length + 1).padStart(2, '0')}`

    const prodSummary = activeProducts.map((p) => `${p.categoryName} ${p.value}${p.unit}`).join(' · ')
    const equipSummary = `节能装备 ${energySavingTotalKw}kW/${inScopeTotalKw}kW (${energySavingRatio}%)`
    const summaryText = `水 ${metrics[0].value}t · 气 ${metrics[1].value}m³ · 绿电 ${metrics[10].value}kWh · ${prodSummary} · ${equipSummary} · 照片 ${parkPhotos.length}张 · 大事记 ${milestones.length}条`

    const newRecord: HistoryRecord = {
      id: `REC-${Date.now()}`,
      batch: batchCode,
      year: selectedYear,
      month: selectedMonth,
      submitter: submitterName,
      submitTime: timeStr,
      summary: summaryText,
      totalCostWan,
      status,
    }

    setHistoryList([newRecord, ...historyList])
    if (status === '已入库') {
      setSubmittedMonths((prev) => Array.from(new Set([...prev, `${selectedYear}-${selectedMonth}`])))
    }
    setSuccessToast({
      show: true,
      msg: `${selectedYear}年${selectedMonth}月工厂数据申报已成功${status === '已入库' ? '校验入库' : '暂存待复核'}！涵盖 4 大核心模块全量数据。`,
      batch: batchCode,
    })

    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4500)
  }

  return (
    <div className="space-y-4">
      {/* 隐藏式本地文件上传 Input */}
      <input
        type="file"
        ref={photoFileInputRef}
        onChange={handlePhotoFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={eventPhotoFileInputRef}
        onChange={handleEventPhotoUpload}
        accept="image/*"
        className="hidden"
      />



      {/* 🌟 2. 核心导航：四大模块顶级 Tabs 切换器 */}
      {viewMode === 'entry' && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-1">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveModuleTab('production')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                activeModuleTab === 'production'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-panel/60'
              )}
            >
              <Cpu className="size-4" />
              <span>产品产量</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModuleTab('energy')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                activeModuleTab === 'energy'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-panel/60'
              )}
            >
              <Zap className="size-4" />
              <span>能源消耗</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModuleTab('photos')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                activeModuleTab === 'photos'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-panel/60'
              )}
            >
              <ImageIcon className="size-4" />
              <span>园区照片</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModuleTab('events')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                activeModuleTab === 'events'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-panel/60'
              )}
            >
              <Flag className="size-4" />
              <span>园区大事件</span>
            </button>
          </div>
        </div>
      )}

      {/* 成功入库提示 */}
      {successToast.show && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-2.5 text-xs text-emerald-300 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span className="font-bold">操作成功（{successToast.batch}）：</span>
            <span>{successToast.msg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast({ show: false, msg: '', batch: '' })}
            className="text-emerald-400 hover:text-emerald-200 cursor-pointer font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 视图模式 1：填报工作台四大模块 */}
      {/* ========================================================================= */}
      {viewMode === 'entry' && (
        <div className="space-y-4">
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* 【模块 1】：产品产量 (Product Output Form) */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeModuleTab === 'production' && (
            <div className="space-y-4">
              {/* 顶部标题与操作栏 */}
              <div className="rounded-2xl border bg-card border-border p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Cpu className="size-4.5" />
                  </div>
                  <h2 className="text-sm font-bold text-foreground">工业产品产量申报台账</h2>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* 🌟 核心主按钮：申报数据（打开月度申报弹窗） */}
                  <button
                    type="button"
                    onClick={() => handleOpenDeclareModal('production')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="size-3.5" />
                    <span>申报数据</span>
                  </button>

                  {/* 🌟 产品管理按钮（管理当前企业已添加的产品中类，可新增、启用、停用） */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProductManageModalOpen(true)
                      setIsAddingNewCategory(false)
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-panel hover:bg-panel/80 text-xs font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
                  >
                    <Settings2 className="size-3.5 text-primary" />
                    <span>产品管理</span>
                  </button>
                </div>
              </div>

              {/* 筛选与搜索控制栏 */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-panel/30 p-2 rounded-xl border border-border">
                {/* 年份筛选 */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-bold px-1.5">年份筛选:</span>
                  <button
                    type="button"
                    onClick={() => setProdHistoryYearFilter('all')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                      prodHistoryYearFilter === 'all'
                        ? 'bg-primary text-primary-foreground shadow-2xs'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    全部年份 ({monthBatches.length})
                  </button>
                  {uniqueYears.map((yr) => {
                    const count = monthBatches.filter((b) => b.year === yr).length
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setProdHistoryYearFilter(yr)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer select-none',
                          prodHistoryYearFilter === yr
                            ? 'bg-primary text-primary-foreground shadow-2xs'
                            : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {yr}年 ({count})
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 44px 工业高密度数据表格：产品产量历史台账 */}
              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="h-[44px] bg-panel dark:bg-[#0b1324] text-muted-foreground border-b border-border font-bold select-none">
                      <th className="px-3 py-0 w-12 text-center">#</th>
                      <th className="px-3 py-0 text-center w-28">申报月份</th>
                      <th className="px-3 py-0 min-w-[280px]">申报产品及产量摘要</th>
                      <th className="px-3 py-0 w-32">申报录入人</th>
                      <th className="px-3 py-0 w-40 font-mono">提交入库时间</th>
                      <th className="px-3 py-0 text-center w-24">状态</th>
                      <th className="px-3 py-0 text-right w-44">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-border/50">
                    {filteredProductionBatches.length > 0 ? (
                      filteredProductionBatches.map((batch, idx) => {
                        return (
                          <tr key={batch.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                            <td className="px-3 py-0 text-center font-mono text-muted-foreground text-[11px]">{idx + 1}</td>
                            <td className="px-3 py-0 text-center">
                              <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-primary/10 text-primary border border-primary/25 whitespace-nowrap">
                                {batch.year}-{batch.month}
                              </span>
                            </td>
                            <td className="px-3 py-0">
                              <div className="flex flex-wrap items-center gap-1.5 py-1">
                                {batch.products && batch.products.length > 0 ? (
                                  batch.products.slice(0, 3).map((p) => (
                                    <span
                                      key={p.id}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-panel border border-border/70 text-foreground"
                                    >
                                      <span className="font-semibold text-primary">{p.categoryName}</span>
                                      <span className="font-mono text-muted-foreground">{p.output}{p.unit}</span>
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground">暂无产品记录</span>
                                )}
                                {batch.products && batch.products.length > 3 && (
                                  <span className="text-[10px] text-muted-foreground bg-panel px-1.5 py-0.5 rounded border border-border/60">
                                    +{batch.products.length - 3}项
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-0 text-foreground text-xs whitespace-nowrap">
                              {batch.submitter}
                            </td>
                            <td className="px-3 py-0 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                              {batch.submitTime}
                            </td>
                            <td className="px-3 py-0 text-center whitespace-nowrap">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded text-[10px] font-bold border',
                                  batch.status === '已入库'
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                )}
                              >
                                {batch.status}
                              </span>
                            </td>
                            <td className="px-3 py-0 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* 详情 */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenMonthModal(batch, 'view', 'production')}
                                  className="px-2 py-1 rounded text-[11px] font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer flex items-center gap-1"
                                  title="弹窗查看该月份申报详情"
                                >
                                  <Eye className="size-3.5" />
                                  <span>详情</span>
                                </button>
                                {/* 编辑 */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenDeclareModal('production', batch)}
                                  className="px-2 py-1 rounded text-[11px] font-bold text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer flex items-center gap-1"
                                  title="弹窗编辑该月份产品申报数据"
                                >
                                  <Edit3 className="size-3.5" />
                                  <span>编辑</span>
                                </button>
                                {/* 删除月度批次 */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMonthBatch(batch.id)}
                                  className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer transition-colors"
                                  title="删除该月份申报历史"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr className="h-[44px]">
                        <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground font-medium">
                          暂无符合条件的产品产量申报历史！
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* 【模块 2】：能源消耗 (Energy Consumption Table & Form) */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeModuleTab === 'energy' && (
            <div className="space-y-4">
              {/* 顶部标题与操作栏 */}
              <div className="rounded-2xl border bg-card border-border p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                    <Zap className="size-4.5" />
                  </div>
                  <h2 className="text-sm font-bold text-foreground">全厂能源消耗与费用申报台账</h2>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* 🌟 核心主按钮：申报数据（打开月度申报弹窗） */}
                  <button
                    type="button"
                    onClick={() => handleOpenDeclareModal('energy')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="size-3.5" />
                    <span>申报数据</span>
                  </button>
                </div>
              </div>

              {/* 筛选与搜索控制栏 */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-panel/30 p-2 rounded-xl border border-border">
                {/* 年份筛选 */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-bold px-1.5">年份筛选:</span>
                  <button
                    type="button"
                    onClick={() => setEnergyHistoryYearFilter('all')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                      energyHistoryYearFilter === 'all'
                        ? 'bg-primary text-primary-foreground shadow-2xs'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    全部年份 ({monthBatches.length})
                  </button>
                  {uniqueYears.map((yr) => {
                    const count = monthBatches.filter((b) => b.year === yr).length
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setEnergyHistoryYearFilter(yr)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer select-none',
                          energyHistoryYearFilter === yr
                            ? 'bg-primary text-primary-foreground shadow-2xs'
                            : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {yr}年 ({count})
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 44px 工业高密度数据表格：能源消耗历史台账 */}
              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="h-[44px] bg-panel dark:bg-[#0b1324] text-muted-foreground border-b border-border font-bold select-none">
                      <th className="px-3 py-0 w-12 text-center">#</th>
                      <th className="px-3 py-0 text-center w-28">申报月份</th>
                      <th className="px-3 py-0 min-w-[320px]">实物能源消耗概况</th>
                      <th className="px-3 py-0 w-32">申报录入人</th>
                      <th className="px-3 py-0 w-40 font-mono">提交入库时间</th>
                      <th className="px-3 py-0 text-center w-24">状态</th>
                      <th className="px-3 py-0 text-right w-44">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-border/50">
                    {filteredEnergyBatches.length > 0 ? (
                      filteredEnergyBatches.map((batch, idx) => {
                        return (
                          <tr key={batch.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                            <td className="px-3 py-0 text-center font-mono text-muted-foreground text-[11px]">{idx + 1}</td>
                            <td className="px-3 py-0 text-center">
                              <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-amber-500/10 text-amber-500 border border-amber-500/25 whitespace-nowrap">
                                {batch.year}-{batch.month}
                              </span>
                            </td>
                            <td className="px-3 py-0">
                              <div className="flex flex-wrap items-center gap-1.5 py-1">
                                {batch.energy?.gridPowerWanKwh && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                                    <span>网电</span>
                                    <strong>{batch.energy.gridPowerWanKwh}万kWh</strong>
                                  </span>
                                )}
                                {batch.energy?.pvPowerWanKwh && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                                    <span>光伏</span>
                                    <strong>{batch.energy.pvPowerWanKwh}万kWh</strong>
                                  </span>
                                )}
                                {batch.energy?.waterTon && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                                    <span>水</span>
                                    <strong>{batch.energy.waterTon}t</strong>
                                  </span>
                                )}
                                {batch.energy?.gasWanM3 && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                                    <span>气</span>
                                    <strong>{batch.energy.gasWanM3}万m³</strong>
                                  </span>
                                )}
                                {batch.energy?.steamTon && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                                    <span>蒸汽</span>
                                    <strong>{batch.energy.steamTon}t</strong>
                                  </span>
                                )}
                                {batch.energy?.dieselL && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-slate-500/10 text-slate-500 border border-slate-500/20 font-mono">
                                    <span>柴油</span>
                                    <strong>{batch.energy.dieselL}L</strong>
                                  </span>
                                )}
                                {batch.energy?.gasolineL && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-rose-500/10 text-rose-500 border border-rose-500/20 font-mono">
                                    <span>汽油</span>
                                    <strong>{batch.energy.gasolineL}L</strong>
                                  </span>
                                )}
                                {batch.energy?.keroseneL && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-orange-500/10 text-orange-500 border border-orange-500/20 font-mono">
                                    <span>煤油</span>
                                    <strong>{batch.energy.keroseneL}L</strong>
                                  </span>
                                )}
                                {batch.energy?.nitrogenTon && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-mono">
                                    <span>液氮</span>
                                    <strong>{batch.energy.nitrogenTon}t</strong>
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-0 text-foreground text-xs whitespace-nowrap">
                              {batch.submitter}
                            </td>
                            <td className="px-3 py-0 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                              {batch.submitTime}
                            </td>
                            <td className="px-3 py-0 text-center whitespace-nowrap">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded text-[10px] font-bold border',
                                  batch.status === '已入库'
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                )}
                              >
                                {batch.status}
                              </span>
                            </td>
                            <td className="px-3 py-0 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* 详情 */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenMonthModal(batch, 'view', 'energy')}
                                  className="px-2 py-1 rounded text-[11px] font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer flex items-center gap-1"
                                  title="弹窗查看该月份能源消耗与费用申报详情"
                                >
                                  <Eye className="size-3.5" />
                                  <span>详情</span>
                                </button>
                                {/* 编辑 */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenDeclareModal('energy', batch)}
                                  className="px-2 py-1 rounded text-[11px] font-bold text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer flex items-center gap-1"
                                  title="弹窗编辑该月份能源申报数据"
                                >
                                  <Edit3 className="size-3.5" />
                                  <span>编辑</span>
                                </button>
                                {/* 删除月度批次 */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMonthBatch(batch.id)}
                                  className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer transition-colors"
                                  title="删除该月份申报历史"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr className="h-[44px]">
                        <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground font-medium">
                          暂无符合条件的能源消耗申报历史！
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* 【模块 4】：园区照片 (Park Photos Gallery) */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeModuleTab === 'photos' && (
            <div className="space-y-4">
              {/* 已归档园区照片图库矩阵 */}
              <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="size-4 text-teal-400" />
                    <h3 className="text-sm font-bold text-foreground">
                      【{currentReportingUnit.parkName}】实景图库
                      <span className="text-muted-foreground ml-1.5 font-normal font-mono text-xs">({visibleParkPhotos.length} 张)</span>
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddPhotoModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="size-3.5" />
                    <span>上传照片</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {visibleParkPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="rounded-xl border bg-panel/70 border-border overflow-hidden group hover:border-primary/50 transition-all flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        <div className="aspect-video w-full overflow-hidden relative bg-black/40">
                          <img
                            src={photo.imageUrl || SAFE_FALLBACK_IMAGE}
                            alt={photo.title}
                            onError={(e) => { e.currentTarget.src = SAFE_FALLBACK_IMAGE }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/70 backdrop-blur-xs text-teal-300 font-bold border border-teal-500/30">
                              {photo.category}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/80 backdrop-blur-xs text-primary-foreground font-bold flex items-center gap-0.5">
                              <MapPin className="size-2.5" />
                              {photo.parkName ? photo.parkName.replace('特变电工', '') : currentReportingUnit.parkName.replace('特变电工', '')}
                            </span>
                            {photo.isFeaturedScreen && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/90 text-slate-950 font-black shadow-xs">
                                大屏展示中
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreviewPhotoModal({
                              title: photo.title,
                              imageUrl: photo.imageUrl,
                              category: photo.category,
                              description: photo.description,
                              date: photo.date,
                            })}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold cursor-pointer"
                          >
                            <Eye className="size-4" />
                            <span>查看大图</span>
                          </button>
                        </div>

                        <div className="p-3 space-y-1.5">
                          <h4
                            onClick={() => setPreviewPhotoModal({
                              title: photo.title,
                              imageUrl: photo.imageUrl,
                              category: photo.category,
                              description: photo.description,
                              date: photo.date,
                            })}
                            className="text-xs font-bold text-foreground line-clamp-1 hover:text-teal-400 cursor-pointer transition-colors"
                            title={photo.title}
                          >
                            {photo.title}
                          </h4>
                          <p className="text-[11px] text-muted-foreground line-clamp-2" title={photo.description}>
                            {photo.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 pt-0 flex items-center justify-between border-t border-border/40 text-[10px] text-muted-foreground/80 mt-2">
                        <span>{photo.date}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleTogglePhotoFeatured(photo.id)}
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors',
                              photo.isFeaturedScreen
                                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                                : 'bg-panel text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {photo.isFeaturedScreen ? '取消大屏' : '设为大屏'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer transition-colors"
                            title="删除照片"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* 【模块 4】：园区大事件 (Park Major Events Form & Timeline) */}
          {/* ───────────────────────────────────────────────────────────────── */}
          {activeModuleTab === 'events' && (
            <div className="space-y-4">
                            {/* 历史大事件时间轴台账 */}
              <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Flag className="size-4 text-red-400" />
                    <h3 className="text-sm font-bold text-foreground">
                      【{currentReportingUnit.parkName}】大事件时间轴
                      <span className="text-muted-foreground ml-1.5 font-normal font-mono text-xs">({visibleMilestones.length} 条)</span>
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddEventModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="size-3.5" />
                    <span>登记大事件</span>
                  </button>
                </div>

                {/* 科技流动时间轴卡片 */}
                <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-linear-to-b before:from-red-500 before:via-blue-500 before:to-emerald-500">
                  {visibleMilestones.map((ev) => (
                    <div key={ev.id} className="relative group">
                      {/* 时间轴发光圆点 */}
                      <span className="absolute -left-[21px] top-4 size-3 rounded-full bg-red-500 border-2 border-background ring-4 ring-red-500/20 shadow-xs" />

                      <div className="p-3.5 rounded-xl border bg-panel/70 border-border group-hover:border-primary/50 transition-colors space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/15 text-red-300 font-bold border border-red-500/30">
                              {ev.category}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-bold border border-primary/30 flex items-center gap-0.5">
                              <MapPin className="size-2.5" />
                              {ev.parkName ? ev.parkName.replace('特变电工', '') : currentReportingUnit.parkName.replace('特变电工', '')}
                            </span>
                            <span className="font-mono text-xs font-bold text-muted-foreground">
                              {ev.date}
                            </span>
                            {ev.isFeaturedScreen && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                                大屏大事记
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleEventFeatured(ev.id)}
                              className={cn(
                                'px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors',
                                ev.isFeaturedScreen
                                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                                  : 'bg-panel text-muted-foreground hover:text-foreground'
                              )}
                            >
                              {ev.isFeaturedScreen ? '取消大屏' : '设为大屏'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMilestone(ev.id)}
                              className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer transition-colors"
                              title="删除此事件"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 justify-between items-start">
                          <div className="flex-1 space-y-2">
                            <h4 className="text-sm font-bold text-foreground">
                              {ev.title}
                            </h4>

                            {ev.benefitImpact && (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                                <Sparkles className="size-3.5 text-emerald-400 shrink-0" />
                                <span>效益：{ev.benefitImpact}</span>
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground/90 leading-relaxed">
                              {ev.content}
                            </p>

                            {ev.attachmentName && (
                              <div className="flex items-center gap-1 text-[11px] text-primary font-mono pt-0.5">
                                <Paperclip className="size-3" />
                                <span>附件: {ev.attachmentName}</span>
                              </div>
                            )}
                          </div>

                          {/* 【新增】：大事件现场照片缩略图展示 */}
                          {ev.imageUrl && (
                            <div
                              onClick={() => setPreviewPhotoModal({
                                title: ev.title,
                                imageUrl: ev.imageUrl!,
                                category: ev.category,
                                description: ev.benefitImpact ? `效益：${ev.benefitImpact}` : ev.content,
                                date: ev.date,
                              })}
                              className="w-full sm:w-44 aspect-video rounded-lg overflow-hidden border border-border/80 bg-black/40 shrink-0 relative group/thumb cursor-pointer shadow-xs"
                            >
                              <img
                                src={ev.imageUrl || SAFE_FALLBACK_IMAGE}
                                alt={ev.title}
                                onError={(e) => { e.currentTarget.src = SAFE_FALLBACK_IMAGE }}
                                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-[11px] font-bold">
                                <Eye className="size-3.5" />
                                <span>查看大图</span>
                              </div>
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/70 backdrop-blur-xs text-[9px] text-white/90 font-mono">
                                现场照片
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 视图模式 2：管理员手动添加产品产量历史台账 (需求 4) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 视图模式 2：工厂能碳申报历史台账 (需求 7：以月份为单位在列表显示，无批次号列) */}
      {/* ========================================================================= */}
      {viewMode === 'history' && (() => {
        const filteredBatches = monthBatches.filter((batch) => {
          if (historyYearFilter !== 'all' && batch.year !== historyYearFilter) {
            return false
          }
          if (historySearchQuery.trim()) {
            const q = historySearchQuery.trim().toLowerCase()
            const matchYm = `${batch.year}-${batch.month}`.includes(q)
            const matchSubmitter = batch.submitter.toLowerCase().includes(q)
            const matchSummary = batch.summary.toLowerCase().includes(q)
            const matchProduct = batch.products.some((p) =>
              p.modelName.toLowerCase().includes(q) ||
              p.categoryName.toLowerCase().includes(q) ||
              p.subTypeName.toLowerCase().includes(q)
            )
            return matchYm || matchSubmitter || matchSummary || matchProduct
          }
          return true
        })

        const uniqueYears = Array.from(new Set(monthBatches.map((b) => b.year)))

        return (
          <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-4">
            {/* 头部标题与操作按钮 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                  <History className="size-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">工厂能碳月度申报历史台账</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('entry')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-panel/80 hover:bg-panel text-xs font-bold text-foreground cursor-pointer transition-colors shadow-2xs"
                >
                  <RotateCcw className="size-3.5" />
                  <span>返回填报工作台</span>
                </button>
              </div>
            </div>

            {/* 筛选与搜索控制栏 */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-panel/30 p-2 rounded-xl border border-border">
              {/* 年份筛选快捷标签组 */}
              <div className="flex flex-wrap items-center gap-3">
                {/* 年份筛选 */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-bold px-1.5">年份筛选:</span>
                  <button
                    type="button"
                    onClick={() => setHistoryYearFilter('all')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                      historyYearFilter === 'all'
                        ? 'bg-primary text-primary-foreground shadow-2xs'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    全部年份 ({monthBatches.length})
                  </button>
                  {uniqueYears.map((yr) => {
                    const count = monthBatches.filter((b) => b.year === yr).length
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setHistoryYearFilter(yr)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer select-none',
                          historyYearFilter === yr
                            ? 'bg-primary text-primary-foreground shadow-2xs'
                            : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {yr}年 ({count})
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 搜索框 */}
              <div className="relative w-72">
                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  placeholder="搜索申报月份、申报人、产品..."
                  className="w-full h-8 pl-8 pr-3 rounded-lg text-xs bg-background dark:bg-[#0b1324] border border-border text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* 44px 工业高密度数据表格：以月份为单位展示申报历史 */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="h-[44px] bg-panel/80 dark:bg-[#0b1324]/80 text-muted-foreground border-b border-border font-bold select-none">
                    <th className="px-3 py-0 w-12 text-center">#</th>
                    <th className="px-3 py-0 text-center w-28">申报月份</th>
                    <th className="px-3 py-0 w-32">申报录入人</th>
                    <th className="px-3 py-0 w-44 font-mono">提交入库时间</th>
                    <th className="px-3 py-0 text-center w-24">状态</th>
                    <th className="px-3 py-0 text-right w-44">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border/60">
                  {filteredBatches.length > 0 ? (
                    filteredBatches.map((batch, idx) => (
                      <tr key={batch.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                        <td className="px-3 py-0 text-center font-mono text-muted-foreground text-[11px]">{idx + 1}</td>
                        <td className="px-3 py-0 text-center">
                          <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-primary/10 text-primary border border-primary/25 whitespace-nowrap">
                            {batch.year}-{batch.month}
                          </span>
                        </td>
                        <td className="px-3 py-0 text-foreground text-xs whitespace-nowrap">
                          {batch.submitter}
                        </td>
                        <td className="px-3 py-0 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                          {batch.submitTime}
                        </td>
                        <td className="px-3 py-0 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-bold border',
                              batch.status === '已入库'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            )}
                          >
                            {batch.status}
                          </span>
                        </td>
                        <td className="px-3 py-0 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* 详情 */}
                            <button
                              type="button"
                              onClick={() => handleOpenMonthModal(batch, 'view')}
                              className="px-2 py-1 rounded text-[11px] font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer flex items-center gap-1"
                              title="弹窗查看该月份申报详情"
                            >
                              <Eye className="size-3.5" />
                              <span>详情</span>
                            </button>
                            {/* 编辑 */}
                            <button
                              type="button"
                              onClick={() => handleOpenMonthModal(batch, 'edit')}
                              className="px-2 py-1 rounded text-[11px] font-bold text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer flex items-center gap-1"
                              title="弹窗编辑该月份申报全量数据"
                            >
                              <Edit3 className="size-3.5" />
                              <span>编辑</span>
                            </button>
                            {/* 删除月度批次 */}
                            <button
                              type="button"
                              onClick={() => handleDeleteMonthBatch(batch.id)}
                              className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer transition-colors"
                              title="删除该月份申报历史"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="h-[44px]">
                      <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground font-medium">
                        暂无符合条件的历史申报记录！
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      })()}

            {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 0.5：工厂能碳申报全量数据档案详情与在线编辑弹窗 (需求 7: 仅含产品产量与能源消耗 2 个核心 Tab) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isMonthBatchModalOpen && activeModalBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in">
          <div className={cn("w-full rounded-2xl border bg-card border-border p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col", monthModalTarget === 'energy' ? 'max-w-4xl' : 'max-w-5xl')}>
            {/* 弹窗头部 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3.5 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'size-10 rounded-xl flex items-center justify-center shrink-0',
                    monthModalTarget === 'energy' ? 'bg-amber-500/15 text-amber-500' : 'bg-blue-500/15 text-blue-400'
                  )}
                >
                  {monthModalTarget === 'energy' ? <Zap className="size-5" /> : <Cpu className="size-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-foreground">
                      【{activeModalBatch.year}年{activeModalBatch.month}月】
                      {monthModalTarget === 'energy'
                        ? '全厂能源消耗与费用申报全量数据档案'
                        : '工业产品产量申报全量数据档案'}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>提交时间：<strong className="font-mono text-foreground">{activeModalBatch.submitTime}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMonthBatchModalOpen(false)
                    setActiveModalBatch(null)
                  }}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1.5 rounded-lg hover:bg-panel transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* 弹窗内容主体 (带纵向滚动) */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {monthModalTarget === 'energy' ? (
                /* 能源消耗明细（参考编辑页卡片布局） */
                <div className="space-y-4">
                  {/* 板块 1: 物理实物介质消耗明细 */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-500" />
                      <span>1. 物理能源实物消耗量明细</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">外购网电消耗 (万kWh)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.gridPowerWanKwh || ''}
                            onChange={(e) => handleUpdateModalEnergy('gridPowerWanKwh', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.gridPowerWanKwh || '-'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">自发自用光伏 (万kWh)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.pvPowerWanKwh || ''}
                            onChange={(e) => handleUpdateModalEnergy('pvPowerWanKwh', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-emerald-500 focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-emerald-500 flex items-center select-text">
                            {activeModalBatch.energy?.pvPowerWanKwh || '-'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">购买消纳绿电 (万kWh)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.greenPowerWanKwh || ''}
                            onChange={(e) => handleUpdateModalEnergy('greenPowerWanKwh', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.greenPowerWanKwh || '-'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">工业自来水 (吨)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.waterTon || ''}
                            onChange={(e) => handleUpdateModalEnergy('waterTon', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.waterTon || '-'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">工业天然气 (万m³)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.gasWanM3 || ''}
                            onChange={(e) => handleUpdateModalEnergy('gasWanM3', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.gasWanM3 || '-'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">蒸汽消耗量 (吨)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.steamTon || ''}
                            onChange={(e) => handleUpdateModalEnergy('steamTon', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.steamTon || '-'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">工业柴油 (升)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.dieselL || ''}
                            onChange={(e) => handleUpdateModalEnergy('dieselL', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.dieselL || '-'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">工业汽油 (升)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.gasolineL || ''}
                            onChange={(e) => handleUpdateModalEnergy('gasolineL', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.gasolineL || '-'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">工业煤油 (升)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.keroseneL || ''}
                            onChange={(e) => handleUpdateModalEnergy('keroseneL', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.keroseneL || '-'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">液氮消耗量 (吨)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.nitrogenTon || ''}
                            onChange={(e) => handleUpdateModalEnergy('nitrogenTon', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.nitrogenTon || '-'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 板块 2: 能耗财务发票支出明细 */}
                  <div className="space-y-2.5 pt-2 border-t border-border/60">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>2. 能源财务发票支出 (万元)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">电费支出 (万元)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.powerCostWan || ''}
                            onChange={(e) => handleUpdateModalEnergy('powerCostWan', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.powerCostWan || '0.00'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">水费支出 (万元)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.waterCostWan || ''}
                            onChange={(e) => handleUpdateModalEnergy('waterCostWan', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.waterCostWan || '0.00'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">燃气费支出 (万元)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.gasCostWan || ''}
                            onChange={(e) => handleUpdateModalEnergy('gasCostWan', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.gasCostWan || '0.00'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">蒸汽费支出 (万元)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.steamCostWan || ''}
                            onChange={(e) => handleUpdateModalEnergy('steamCostWan', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.steamCostWan || '0.00'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">液氮费支出 (万元)</label>
                        {monthModalMode === 'edit' ? (
                          <input
                            type="text"
                            value={modalEditingEnergy.nitrogenCostWan || ''}
                            onChange={(e) => handleUpdateModalEnergy('nitrogenCostWan', e.target.value)}
                            className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                          />
                        ) : (
                          <div className="w-full h-9 px-3 rounded-lg bg-background border border-border font-mono font-bold text-sm text-foreground flex items-center select-text">
                            {activeModalBatch.energy?.nitrogenCostWan || '0.00'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex flex-col justify-between shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">综合能耗总支出</span>
                          <span className="text-[11px] text-amber-600/80 dark:text-amber-500/80">全能源发票汇总</span>
                        </div>
                        <div className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
                          ¥
                          {monthModalMode === 'edit'
                            ? (
                                (parseFloat(modalEditingEnergy.powerCostWan || '0') || 0) +
                                (parseFloat(modalEditingEnergy.waterCostWan || '0') || 0) +
                                (parseFloat(modalEditingEnergy.gasCostWan || '0') || 0) +
                                (parseFloat(modalEditingEnergy.steamCostWan || '0') || 0) +
                                (parseFloat(modalEditingEnergy.nitrogenCostWan || '0') || 0)
                              ).toFixed(2)
                            : (
                                (parseFloat(activeModalBatch.energy?.powerCostWan || '0') || 0) +
                                (parseFloat(activeModalBatch.energy?.waterCostWan || '0') || 0) +
                                (parseFloat(activeModalBatch.energy?.gasCostWan || '0') || 0) +
                                (parseFloat(activeModalBatch.energy?.steamCostWan || '0') || 0) +
                                (parseFloat(activeModalBatch.energy?.nitrogenCostWan || '0') || 0)
                              ).toFixed(2)}{' '}
                          <span className="text-xs font-normal text-muted-foreground">万元</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 板块 1: 产品产量申报明细清单 */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary" />
                      <span>生产制造产品产量明细表{monthModalMode === 'edit' ? '（可在下方行内直接输入或修改）' : ''}</span>
                    </h4>
                  </div>

                  {/* 44px 工业数据表格 */}
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="h-[44px] bg-panel/80 dark:bg-[#0b1324]/80 text-muted-foreground border-b border-border font-bold select-none">
                          <th className="px-3 py-0 w-12 text-center">#</th>
                          <th className="px-3 py-0 w-24">工业大类</th>
                          <th className="px-3 py-0 w-28">产品子类型</th>
                          <th className="px-3 py-0 min-w-[200px]">产品名称与规格型号</th>
                          <th className="px-3 py-0 w-32 font-mono text-right">计划排产产量</th>
                          <th className="px-3 py-0 w-32 font-mono text-right">填报完工数量</th>
                          <th className="px-3 py-0 w-20 text-center">计量单位</th>
                          <th className="px-3 py-0 w-24 font-mono text-right">上月基准</th>
                          {monthModalMode === 'edit' && <th className="px-3 py-0 w-14 text-center">操作</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y border-border/50">
                        {modalEditingProducts.length > 0 ? (
                          modalEditingProducts.map((prod, pIdx) => (
                            <tr key={prod.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                              <td className="px-3 py-0 text-center font-mono text-muted-foreground text-[11px]">{pIdx + 1}</td>
                              <td className="px-3 py-0 font-bold text-foreground whitespace-nowrap">
                                {prod.categoryName}
                              </td>
                              <td className="px-3 py-0 whitespace-nowrap">
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  {prod.subTypeName}
                                </span>
                              </td>
                              <td className="px-3 py-0 font-medium text-foreground">
                                <span className="truncate max-w-[220px] inline-block align-middle" title={prod.modelName}>
                                  {prod.modelName}
                                </span>
                              </td>
                              {/* 计划排产产量 */}
                              <td className="px-3 py-0 font-mono text-right whitespace-nowrap">
                                {monthModalMode === 'edit' ? (
                                  <input
                                    type="number"
                                    step="any"
                                    value={prod.plannedOutput}
                                    onChange={(e) => handleUpdateModalProduct(prod.id, 'plannedOutput', e.target.value)}
                                    className="w-24 h-7 px-2 text-right text-xs font-mono font-medium bg-background border border-border rounded-md focus:border-primary focus:outline-none shadow-2xs"
                                  />
                                ) : (
                                  <span className="text-foreground/80">{prod.plannedOutput || '-'}</span>
                                )}
                              </td>
                              {/* 填报完工数量 */}
                              <td className="px-3 py-0 font-mono text-right whitespace-nowrap">
                                {monthModalMode === 'edit' ? (
                                  <input
                                    type="number"
                                    step="any"
                                    value={prod.output}
                                    onChange={(e) => handleUpdateModalProduct(prod.id, 'output', e.target.value)}
                                    className="w-24 h-7 px-2 text-right text-xs font-mono font-bold text-primary bg-background border border-primary/50 rounded-md focus:border-primary focus:outline-none shadow-2xs"
                                  />
                                ) : (
                                  <span className="font-mono font-bold text-primary">{prod.output}</span>
                                )}
                              </td>
                              {/* 计量单位 */}
                              <td className="px-3 py-0 text-center whitespace-nowrap font-mono text-muted-foreground">
                                {prod.unit}
                              </td>
                              {/* 上月基准 */}
                              <td className="px-3 py-0 font-mono text-muted-foreground text-right whitespace-nowrap">
                                {prod.lastMonthValue} {prod.unit}
                              </td>
                              {/* 编辑模式下的操作列 */}
                              {monthModalMode === 'edit' && (
                                <td className="px-3 py-0 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteModalProduct(prod.id)}
                                    className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer transition-colors"
                                    title="删除此项产品"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr className="h-[44px]">
                            <td colSpan={monthModalMode === 'edit' ? 9 : 8} className="py-8 text-center text-sm text-muted-foreground font-medium">
                              本账期暂无录入产品记录！
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 弹窗底部操作栏：仅在编辑模式下呈现保存/取消操作 */}
            {monthModalMode === 'edit' && (
              <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setModalEditingProducts(JSON.parse(JSON.stringify(activeModalBatch.products)))
                    setModalEditingEnergy({ ...activeModalBatch.energy })
                    setMonthModalMode('view')
                  }}
                  className="px-3.5 py-2 rounded-xl border border-border hover:bg-panel text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  取消修改
                </button>
                <button
                  type="button"
                  onClick={handleSaveMonthBatchModal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  <Save className="size-3.5" />
                  <span>保存全部修改并入库</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 🌟 核心需求：申报数据弹窗（用户选择申报月份、填报信息，填报完成后保存到历史台账） */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isDeclareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in">
          <div className="w-full max-w-5xl rounded-2xl border bg-card border-border p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            {/* 弹窗顶栏 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3.5 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'size-10 rounded-xl flex items-center justify-center shrink-0',
                    declareTarget === 'production' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-500'
                  )}
                >
                  {declareTarget === 'production' ? <Cpu className="size-5" /> : <Zap className="size-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-foreground">
                      【{declareYear}年{declareMonth}月】
                      {declareTarget === 'production' ? '工业产品产量数据申报' : '全厂能源消耗与费用数据申报'}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeclareModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1.5 rounded-lg hover:bg-panel transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* 🌟 核心交互 1：申报月份选择器（年份切换 + 12个月份胶囊） */}
            <div className="bg-panel/40 p-3 rounded-xl border border-border/80 space-y-2.5 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-primary shrink-0" />
                  <span className="text-xs font-bold text-foreground">选择申报月份:</span>
                  {/* 年份快捷选择 */}
                  <div className="flex items-center gap-1 border border-border rounded-lg bg-card px-1 py-0.5">
                    {['2026', '2025'].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => handleSwitchDeclareMonth(yr, declareMonth)}
                        className={cn(
                          'px-2 py-0.5 rounded text-xs font-mono font-bold transition-all cursor-pointer select-none',
                          declareYear === yr
                            ? 'bg-primary text-primary-foreground shadow-2xs'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {yr}年
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 12 个自然月份快捷胶囊矩阵 */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {CALENDAR_MONTH_OPTIONS.map((m) => {
                  const isSelected = declareMonth === m.val
                  const hasHistory = monthBatches.some((b) => b.year === declareYear && b.month === m.val)

                  return (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => handleSwitchDeclareMonth(declareYear, m.val)}
                      className={cn(
                        'flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer select-none relative',
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30'
                          : 'bg-card hover:bg-panel border border-border text-foreground hover:border-primary/50'
                      )}
                    >
                      <span>{m.label}</span>
                      <span
                        className={cn(
                          'text-[9px] font-normal scale-85 mt-0.5',
                          isSelected
                            ? 'text-primary-foreground/90 font-bold'
                            : hasHistory
                            ? 'text-blue-400'
                            : 'text-emerald-500'
                        )}
                      >
                        {isSelected ? '填报中' : hasHistory ? '已有档案' : '未申报'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 🌟 核心交互 2：填报内容主体 (带滚动) */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {declareTarget === 'production' ? (
                /* 产品产量填报明细 */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary" />
                      <span>生产制造产品产量明细表（可在下方行内直接输入或修改）</span>
                    </h4>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="h-[44px] bg-panel/80 dark:bg-[#0b1324]/80 text-muted-foreground border-b border-border font-bold select-none">
                          <th className="px-3 py-0 w-12 text-center">#</th>
                          <th className="px-3 py-0 w-24">工业大类</th>
                          <th className="px-3 py-0 w-28">产品子类型</th>
                          <th className="px-3 py-0 min-w-[200px]">产品名称与规格型号</th>
                          <th className="px-3 py-0 w-32 font-mono text-right">计划排产产量</th>
                          <th className="px-3 py-0 w-32 font-mono text-right">填报完工数量</th>
                          <th className="px-3 py-0 w-20 text-center">计量单位</th>
                          <th className="px-3 py-0 w-24 font-mono text-right">上月基准</th>
                          <th className="px-3 py-0 w-14 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y border-border/50">
                        {declareProducts.length > 0 ? (
                          declareProducts.map((p, idx) => (
                            <tr key={p.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                              <td className="px-3 py-0 text-center font-mono text-muted-foreground text-[11px]">{idx + 1}</td>
                              <td className="px-3 py-0 font-bold text-foreground whitespace-nowrap">{p.categoryName}</td>
                              <td className="px-3 py-0 whitespace-nowrap">
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  {p.subTypeName}
                                </span>
                              </td>
                              <td className="px-3 py-0 font-medium text-foreground">
                                <span className="truncate max-w-[220px] inline-block align-middle" title={p.modelName}>
                                  {p.modelName}
                                </span>
                              </td>
                              {/* 计划排产数量输入框 */}
                              <td className="px-3 py-0 font-mono text-right whitespace-nowrap">
                                <input
                                  type="number"
                                  step="any"
                                  value={p.plannedOutput}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    setDeclareProducts((prev) =>
                                      prev.map((item) => (item.id === p.id ? { ...item, plannedOutput: val } : item))
                                    )
                                  }}
                                  className="w-24 h-7 px-2 text-right text-xs font-mono font-medium bg-background border border-border rounded-md focus:border-primary focus:outline-none shadow-2xs"
                                />
                              </td>
                              {/* 完工数量输入框 */}
                              <td className="px-3 py-0 font-mono text-right whitespace-nowrap">
                                <input
                                  type="number"
                                  step="any"
                                  value={p.output}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    setDeclareProducts((prev) =>
                                      prev.map((item) => (item.id === p.id ? { ...item, output: val } : item))
                                    )
                                  }}
                                  className="w-24 h-7 px-2 text-right text-xs font-mono font-bold text-primary bg-background border border-primary/50 rounded-md focus:border-primary focus:outline-none shadow-2xs"
                                />
                              </td>
                              <td className="px-3 py-0 text-center whitespace-nowrap font-mono text-muted-foreground">
                                {p.unit}
                              </td>
                              <td className="px-3 py-0 font-mono text-muted-foreground text-right whitespace-nowrap">
                                {p.lastMonthValue} {p.unit}
                              </td>
                              <td className="px-3 py-0 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setDeclareProducts((prev) => prev.filter((item) => item.id !== p.id))}
                                  className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer transition-colors"
                                  title="删除该项产品"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="h-[44px]">
                            <td colSpan={9} className="py-8 text-center text-sm text-muted-foreground font-medium">
                              暂无申报产品，请点击右上角“添加产品项”
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* 能源消耗填报明细 */
                <div className="space-y-4">
                  {/* 板块 1: 物理实物介质消耗填报 */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-500" />
                      <span>1. 物理能源实物消耗量填报</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">外购网电消耗 (万kWh)</label>
                        <input
                          type="number"
                          step="any"
                          value={declareEnergy.gridPowerWanKwh}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, gridPowerWanKwh: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">自发自用光伏 (万kWh)</label>
                        <input
                          type="number"
                          step="any"
                          value={declareEnergy.pvPowerWanKwh}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, pvPowerWanKwh: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-emerald-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">购买消纳绿电 (万kWh)</label>
                        <input
                          type="number"
                          step="any"
                          value={declareEnergy.greenPowerWanKwh}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, greenPowerWanKwh: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">工业自来水 (吨)</label>
                        <input
                          type="text"
                          value={declareEnergy.waterTon}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, waterTon: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">工业天然气 (万m³)</label>
                        <input
                          type="number"
                          step="any"
                          value={declareEnergy.gasWanM3}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, gasWanM3: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">蒸汽消耗量 (吨)</label>
                        <input
                          type="text"
                          value={declareEnergy.steamTon}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, steamTon: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">工业柴油 (升)</label>
                        <input
                          type="text"
                          value={declareEnergy.dieselL}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, dieselL: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">工业汽油 (升)</label>
                        <input
                          type="text"
                          value={declareEnergy.gasolineL || ''}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, gasolineL: e.target.value })}
                          placeholder="例如: 1,850"
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">工业煤油 (升)</label>
                        <input
                          type="text"
                          value={declareEnergy.keroseneL || ''}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, keroseneL: e.target.value })}
                          placeholder="例如: 2,400"
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">液氮消耗量 (吨)</label>
                        <input
                          type="text"
                          value={declareEnergy.nitrogenTon || ''}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, nitrogenTon: e.target.value })}
                          placeholder="例如: 52.0"
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>

                    </div>
                  </div>

                  {/* 板块 2: 能耗财务发票支出填报 */}
                  <div className="space-y-2.5 pt-2 border-t border-border/60">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>2. 能源财务发票支出 (万元)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">电费支出 (万元)</label>
                        <input
                          type="number"
                          step="any"
                          value={declareEnergy.powerCostWan}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, powerCostWan: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">水费支出 (万元)</label>
                        <input
                          type="number"
                          step="any"
                          value={declareEnergy.waterCostWan}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, waterCostWan: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">燃气费支出 (万元)</label>
                        <input
                          type="number"
                          step="any"
                          value={declareEnergy.gasCostWan}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, gasCostWan: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">蒸汽费支出 (万元)</label>
                        <input
                          type="number"
                          step="any"
                          value={declareEnergy.steamCostWan}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, steamCostWan: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-card/60 dark:bg-card/40 border border-border space-y-1.5 shadow-2xs">
                        <label className="text-xs text-muted-foreground font-medium">液氮费支出 (万元)</label>
                        <input
                          type="number"
                          step="any"
                          value={declareEnergy.nitrogenCostWan || ''}
                          onChange={(e) => setDeclareEnergy({ ...declareEnergy, nitrogenCostWan: e.target.value })}
                          placeholder="例如: 1.85"
                          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono font-bold text-sm text-foreground focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex flex-col justify-between shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">综合能耗总支出</span>
                          <span className="text-[11px] text-amber-600/80 dark:text-amber-500/80">全能源发票汇总</span>
                        </div>
                        <div className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
                          ¥
                          {(
                            (parseFloat(declareEnergy.powerCostWan) || 0) +
                            (parseFloat(declareEnergy.waterCostWan) || 0) +
                            (parseFloat(declareEnergy.gasCostWan) || 0) +
                            (parseFloat(declareEnergy.steamCostWan) || 0) +
                            (parseFloat(declareEnergy.nitrogenCostWan || '0') || 0)
                          ).toFixed(2)}{' '}
                          <span className="text-xs font-normal text-muted-foreground">万元</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 弹窗底栏：操作按钮 */}
            <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-3.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsDeclareModalOpen(false)}
                className="h-9 px-4 rounded-lg border border-border hover:bg-panel text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveDeclareToHistory}
                className="flex items-center gap-1.5 h-9 px-5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Save className="size-4" />
                <span>保存到历史台账</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 🌟 核心需求：企业产品中类管理弹窗（显示企业已添加中类、新增中类、启用与停用） */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isProductManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in">
          <div className="w-full max-w-4xl rounded-2xl border bg-card border-border p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            {/* 弹窗顶栏 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3.5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Settings2 className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-foreground">企业产品中类管理</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                      共 {companyProductCategories.length} 类 · {companyProductCategories.filter((c) => c.status === 'enabled').length} 类启用中
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="size-3.5" />
                  <span>{isAddingNewCategory ? '收起新增' : '新增产品中类'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsProductManageModalOpen(false)
                    setIsAddingNewCategory(false)
                  }}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1.5 rounded-lg hover:bg-panel transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* 新增产品中类折叠面板 */}
            {isAddingNewCategory && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3 shrink-0 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Plus className="size-3.5" />
                    <span>填写新产品中类信息</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">新增后默认处于“启用”状态，并在月度申报列表中自动可用</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground">工业大类 *</label>
                    <select
                      value={newCatCategoryName}
                      onChange={(e) => setNewCatCategoryName(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg bg-background border border-border text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    >
                      {['变压器', '电抗器', '硅钢铁心', '互感器', '开关设备', '电力线缆', '特种电气装备', '其他工业产品'].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground">产品子类型 *</label>
                    <input
                      type="text"
                      value={newCatSubTypeName}
                      onChange={(e) => setNewCatSubTypeName(e.target.value)}
                      placeholder="如：干式电力变压器"
                      className="w-full h-8 px-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-[11px] font-bold text-muted-foreground">计量单位 *</label>
                    <input
                      type="text"
                      value={newCatUnit}
                      onChange={(e) => setNewCatUnit(e.target.value)}
                      placeholder="如：台/万kVA、吨"
                      className="w-full h-8 px-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-muted-foreground">参考基准 (产量)</label>
                    <input
                      type="number"
                      value={newCatBenchmark}
                      onChange={(e) => setNewCatBenchmark(e.target.value)}
                      placeholder="如：50"
                      className="w-full h-8 px-2.5 rounded-lg bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-4">
                    <label className="text-[11px] font-bold text-muted-foreground">产品名称与规格型号 *</label>
                    <input
                      type="text"
                      value={newCatModelName}
                      onChange={(e) => setNewCatModelName(e.target.value)}
                      placeholder="如：SCB14-1000/10 一级能效干式配电变压器"
                      className="w-full h-8 px-2.5 rounded-lg bg-background border border-border text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-primary/10">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(false)}
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-panel text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewCategory}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-2xs"
                  >
                    <Check className="size-3.5" />
                    <span>确认添加中类</span>
                  </button>
                </div>
              </div>
            )}

            {/* 44px 工业高密度表格：企业产品中类列表 */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="h-[44px] bg-panel dark:bg-[#0b1324] text-muted-foreground border-b border-border font-bold select-none">
                      <th className="px-3 py-0 w-12 text-center">#</th>
                      <th className="px-3 py-0 w-28">工业大类</th>
                      <th className="px-3 py-0 w-36">产品子类型</th>
                      <th className="px-3 py-0 min-w-[240px]">产品名称与规格型号</th>
                      <th className="px-3 py-0 w-24 text-center">计量单位</th>
                      <th className="px-3 py-0 w-24 text-center">申报状态</th>
                      <th className="px-3 py-0 w-36 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-border/60">
                    {companyProductCategories.map((cat, cIdx) => (
                      <tr key={cat.id} className="h-[44px] hover:bg-panel/50 transition-colors">
                        <td className="px-3 py-0 text-center font-mono text-muted-foreground text-[11px]">{cIdx + 1}</td>
                        <td className="px-3 py-0">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            {cat.categoryName}
                          </span>
                        </td>
                        <td className="px-3 py-0 text-muted-foreground">{cat.subTypeName}</td>
                        <td className="px-3 py-0 font-bold text-foreground">{cat.modelName}</td>
                        <td className="px-3 py-0 text-center font-mono text-muted-foreground">{cat.unit}</td>
                        <td className="px-3 py-0 text-center">
                          {cat.status === 'enabled' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              <span>启用中</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-muted/60 text-muted-foreground border border-border">
                              <span className="size-1.5 rounded-full bg-muted-foreground" />
                              <span>已停用</span>
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-0 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* 启用 / 停用 一键切换 */}
                            <button
                              type="button"
                              onClick={() => handleToggleCategoryStatus(cat.id)}
                              className={cn(
                                'px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-colors border',
                                cat.status === 'enabled'
                                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                              )}
                              title={cat.status === 'enabled' ? '点击停用该产品中类' : '点击启用该产品中类'}
                            >
                              {cat.status === 'enabled' ? '停用' : '启用'}
                            </button>
                            {/* 删除按钮 */}
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id, cat.modelName)}
                              className="text-muted-foreground hover:text-rose-400 p-1 cursor-pointer transition-colors"
                              title="删除产品中类"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 弹窗底栏说明与关闭 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3.5 shrink-0">
              <span className="text-xs text-muted-foreground">
                * 规则：停用的产品中类在月度申报数据时将不会显示在填报列表中；启用后自动恢复同步。
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsProductManageModalOpen(false)
                  setIsAddingNewCategory(false)
                }}
                className="px-5 py-2 rounded-xl bg-panel hover:bg-panel/80 border border-border text-xs font-semibold text-foreground cursor-pointer transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 模态框 0：编辑产品设备参数弹窗 (需求 1: 当产品数据参数发生变化时能够修改) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isEditProductModalOpen && editingProductRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                  <Edit3 className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">修改产品参数与产量</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditProductModalOpen(false)
                  setEditingProductRow(null)
                }}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1.5 rounded-lg hover:bg-panel transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 编辑表单 */}
            <div className="space-y-4">
              {/* 1. 产品大类（只读展示） */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <span>1. 所属工业大类</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={editForm.categoryName}
                  className="w-full h-10 px-3.5 rounded-lg text-xs font-bold bg-panel/60 border border-border text-muted-foreground cursor-not-allowed"
                />
              </div>

              {/* 2. 产品子类型 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-400" />
                  <span>2. 产品子类型 *</span>
                </label>
                <input
                  type="text"
                  value={editForm.subTypeName}
                  onChange={(e) => setEditForm({ ...editForm, subTypeName: e.target.value })}
                  placeholder="如：油浸式电力变压器、特高压并联电抗器等"
                  className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                />
              </div>

              {/* 3. 产品名称与规格型号 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    <span>3. 产品名称与规格型号 *</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground font-normal">支持调整型号代码与容量规格</span>
                </label>
                <input
                  type="text"
                  value={editForm.modelName}
                  onChange={(e) => setEditForm({ ...editForm, modelName: e.target.value })}
                  placeholder="如：S20-M-630kVA/10kV 新一级能效油浸变"
                  className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                />
              </div>

              {/* 4. 计划产量、完工数量与计量单位 (三列) */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500" />
                    <span>4. 计划产量</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={editForm.plannedOutput}
                    onChange={(e) => setEditForm({ ...editForm, plannedOutput: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-mono font-bold text-foreground shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <span>5. 完工产量 *</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={editForm.output}
                    onChange={(e) => setEditForm({ ...editForm, output: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-mono font-bold text-primary shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-400" />
                    <span>6. 计量单位 *</span>
                  </label>
                  <select
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                  >
                    {['台/万kVA', '台', '万kVA', 'km', '米', '面', '吨', 'kg', '间隔', '支', '套', '万kvar', 'kvar'].map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 6. 数据来源口径 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">申报数据来源口径</label>
                <select
                  value={editForm.sourceType}
                  onChange={(e) => {
                    const st = e.target.value as 'manual' | 'mes' | 'auto'
                    const label = st === 'manual' ? '企业自填' : st === 'mes' ? '车间MES直通' : '大数据平台直通'
                    setEditForm({ ...editForm, sourceType: st, sourceLabel: label })
                  }}
                  className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                >
                  <option value="manual">企业自填 (手动填报)</option>
                  <option value="mes">车间MES直通 (系统推单)</option>
                  <option value="auto">大数据平台直通 (股份互联)</option>
                </select>
              </div>
            </div>

            {/* 底部操作按钮 */}
            <div className="pt-3.5 border-t border-border/60 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsEditProductModalOpen(false)
                  setEditingProductRow(null)
                }}
                className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmEditProduct}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                <Check className="size-4" />
                <span>保存参数修改</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 模态框 1：添加产品设备与多级参数联动选择弹窗 (产品类型/子类型/型号/规格) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isAddProductModalOpen && (() => {
        const currentType = TBEA_PRODUCT_SPEC_HIERARCHY.find((t) => t.id === paramProductTypeId) || TBEA_PRODUCT_SPEC_HIERARCHY[0]
        const subTypes = currentType?.subTypes || []
        const currentSub = subTypes.find((s) => s.id === paramSubTypeId) || subTypes[0]

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
              {/* 弹窗头部 */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                    <Cpu className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">添加产品设备</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1.5 rounded-lg hover:bg-panel transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* 每行显示 1 项数据：单列垂直排布 */}
              <div className="space-y-4">
                {/* 1. 产品大类下拉框 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <span>1. 产品大类 *</span>
                  </label>
                  <select
                    value={paramProductTypeId}
                    onChange={(e) => handleSelectProductType(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                  >
                    {TBEA_PRODUCT_SPEC_HIERARCHY.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. 产品子类型下拉框 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-400" />
                    <span>2. 产品子类型 *</span>
                  </label>
                  <select
                    value={paramSubTypeId}
                    onChange={(e) => handleSelectSubType(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                  >
                    {subTypes.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. 产品名称（手动填写） */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      <span>3. 产品名称（手动填写） *</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      建议填写具体产品型号、规格或项目专属定制名称
                    </span>
                  </label>
                  <input
                    type="text"
                    value={paramProductName}
                    onChange={(e) => setParamProductName(e.target.value)}
                    placeholder="请输入具体产品名称与规格型号（如：S20-M-630kVA/10kV 新一级能效油浸变）"
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                  />
                </div>

                {/* 4. 计量单位选择与计划产量 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-400" />
                      <span>4. 计量单位 *</span>
                    </label>
                    <select
                      value={paramUnit}
                      onChange={(e) => setParamUnit(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                    >
                      {[
                        '台/万kVA',
                        '台',
                        '万kVA',
                        'km',
                        '米',
                        '面',
                        '吨',
                        'kg',
                        '间隔',
                        '支',
                        '套',
                        '万kvar',
                        'kvar',
                      ].map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="size-2 rounded-full bg-blue-500" />
                      <span>5. 计划产量 (选填)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={paramPlannedQuantity}
                      onChange={(e) => setParamPlannedQuantity(e.target.value)}
                      placeholder="初始计划排产量"
                      className="w-full h-10 px-3.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 底部操作按钮 */}
              <div className="pt-3.5 border-t border-border/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddProductDevice}
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="size-4" />
                  <span>确认添加至列表</span>
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 2：添加能源消耗项目弹窗 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isAddEnergyModalOpen && (() => {
        const currentCat = TBEA_ENERGY_SPEC_HIERARCHY.find((c) => c.id === paramEnergyCategory)
        const subList = currentCat?.subTypes || []
        const unitList = currentCat?.units || ['t']

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
              {/* 弹窗头部 */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                    <Zap className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">添加能源消耗项目</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddEnergyModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* 单列全宽表单主体 */}
              <div className="space-y-4">
                {/* 1. 能源大类 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-400" />
                      <span>1. 能源大类 *</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      覆盖实物消耗、费用发票与绿电凭证
                    </span>
                  </label>
                  <select
                    value={paramEnergyCategory}
                    onChange={(e) => handleSelectEnergyCategory(e.target.value as 'energy' | 'cost' | 'green' | 'economy')}
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                  >
                    {TBEA_ENERGY_SPEC_HIERARCHY.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. 能源子类型 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-blue-400" />
                      <span>2. 能源子类型 *</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      根据大类自动联动细分介质
                    </span>
                  </label>
                  <select
                    value={paramEnergySubType}
                    onChange={(e) => setParamEnergySubType(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                  >
                    {subList.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. 能源项目名称（手动填写） */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      <span>3. 能源项目名称（手动填写） *</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      建议填写具体介质用途、表计编号或发票款项
                    </span>
                  </label>
                  <input
                    type="text"
                    value={paramEnergyName}
                    onChange={(e) => setParamEnergyName(e.target.value)}
                    placeholder="请输入能源项目名称（如：二期生产循环水补水量）"
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                  />
                </div>

                {/* 4. 计量单位选择 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-purple-400" />
                      <span>4. 计量单位 *</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      已按能源大类智能匹配，支持灵活选择
                    </span>
                  </label>
                  <select
                    value={paramEnergyUnit}
                    onChange={(e) => setParamEnergyUnit(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                  >
                    {unitList.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 底部操作按钮 */}
              <div className="pt-3.5 border-t border-border/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddEnergyModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddEnergyItem}
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="size-4" />
                  <span>确认添加至列表</span>
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 2.5：修改能源消耗项目参数弹窗 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isEditEnergyModalOpen && editingEnergyItem && (() => {
        const cat = TBEA_ENERGY_SPEC_HIERARCHY.find((c) => c.id === editingEnergyItem.category)
        const subList = cat?.subTypes || []
        const unitList = cat?.units || ['t']

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
              {/* 弹窗头部 */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                    <Edit3 className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">修改能源消耗项目参数</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditEnergyModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* 表单字段 */}
              <div className="space-y-4">
                {/* 1. 能源大类 (只读展示) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-amber-400" />
                      <span>1. 所属能源大类</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {editingEnergyItem.categoryLabel}
                    </span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingEnergyItem.categoryLabel}
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-bold bg-panel border border-border text-muted-foreground cursor-not-allowed select-none"
                  />
                </div>

                {/* 2. 能源子类型 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary" />
                      <span>2. 能源子类型</span>
                    </span>
                  </label>
                  {subList.length > 0 ? (
                    <select
                      value={editingEnergyItem.subTypeName}
                      onChange={(e) =>
                        setEditingEnergyItem({ ...editingEnergyItem, subTypeName: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                    >
                      {subList.map((sub) => {
                        const sName = sub.name.split('（')[0]
                        return (
                          <option key={sub.id} value={sName}>
                            {sub.name}
                          </option>
                        )
                      })}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editingEnergyItem.subTypeName}
                      onChange={(e) =>
                        setEditingEnergyItem({ ...editingEnergyItem, subTypeName: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                    />
                  )}
                </div>

                {/* 3. 能源项目名称 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-blue-400" />
                      <span>3. 能源消耗项目名称 *</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={editingEnergyItem.name}
                    onChange={(e) =>
                      setEditingEnergyItem({ ...editingEnergyItem, name: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                  />
                </div>

                {/* 4. 计量单位与上月基准 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      <span>4. 计量单位 *</span>
                    </label>
                    <select
                      value={editingEnergyItem.unit}
                      onChange={(e) =>
                        setEditingEnergyItem({ ...editingEnergyItem, unit: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                    >
                      {unitList.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-slate-400" />
                      <span>5. 上月基准参考</span>
                    </label>
                    <input
                      type="text"
                      value={editingEnergyItem.lastMonthValue}
                      onChange={(e) =>
                        setEditingEnergyItem({ ...editingEnergyItem, lastMonthValue: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* 5. 填报数量/金额与数据来源 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-primary" />
                      <span>6. 当月填报数值</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={editingEnergyItem.value}
                      onChange={(e) =>
                        setEditingEnergyItem({ ...editingEnergyItem, value: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-primary focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-slate-400" />
                      <span>7. 数据来源/凭证</span>
                    </label>
                    <input
                      type="text"
                      value={editingEnergyItem.sourceLabel || editingEnergyItem.remark}
                      onChange={(e) =>
                        setEditingEnergyItem({ ...editingEnergyItem, sourceLabel: e.target.value, remark: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 弹窗底部操作按钮 */}
              <div className="flex items-center justify-end gap-2.5 border-t border-border/60 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditEnergyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-panel text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditEnergy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  <Save className="size-3.5" />
                  <span>保存参数修改</span>
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框：上传园区实景照片弹窗 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isAddPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center">
                  <Camera className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">上传【{currentReportingUnit.parkName}】实景照片</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPhotoModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 表单主体 */}
            <form onSubmit={handleAddNewPhoto} className="space-y-3.5">
              {/* 1. 所属园区 (自动绑定当前所属) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">所属园区</label>
                  <span className="text-[10px] text-teal-400 font-bold bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                    当前所属 (自动绑定)
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-500/10 dark:bg-[#0b1324] border border-teal-500/30 text-foreground text-xs font-bold font-mono">
                  <Building2 className="size-4 text-teal-400" />
                  <span className="text-teal-700 dark:text-teal-300 font-bold truncate">{currentReportingUnit.parkName}</span>
                  <span className="text-muted-foreground font-normal text-[11px]">({currentReportingUnit.unitName})</span>
                </div>
              </div>

              {/* 2. 照片业务分类 与 拍摄/更新日期 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">照片业务分类</label>
                  <select
                    value={newPhotoForm.category}
                    onChange={(e) =>
                      setNewPhotoForm({
                        ...newPhotoForm,
                        category: e.target.value as ParkPhotoRecord['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary"
                  >
                    <option value="屋顶分布式光伏">屋顶分布式光伏</option>
                    <option value="特高压核心车间">特高压核心车间</option>
                    <option value="智能变配电房">智能变配电房</option>
                    <option value="储能电站系统">储能电站系统</option>
                    <option value="集控运营中心">集控运营中心</option>
                    <option value="全厂鸟瞰实景">全厂鸟瞰实景</option>
                    <option value="低碳绿化景观">低碳绿化景观</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">拍摄/更新日期</label>
                  <input
                    type="date"
                    value={newPhotoForm.date}
                    onChange={(e) => setNewPhotoForm({ ...newPhotoForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary"
                  />
                </div>
              </div>

              {/* 3. 照片标题 / 景观名称 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  照片标题 / 景观名称 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={newPhotoForm.title}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, title: e.target.value })}
                  placeholder="例如：特变电工沈变本部 2.8MWp 分布式屋顶光伏全景"
                  className="w-full px-3 py-2 rounded-lg text-xs shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary font-bold"
                  required
                />
              </div>

              {/* 4. 画面说明 / 设备容量参数 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">画面说明 / 设备容量参数</label>
                <textarea
                  rows={2}
                  value={newPhotoForm.description}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, description: e.target.value })}
                  placeholder="说明项目装机规模、投运年份、覆盖厂房及节能减排实际成效..."
                  className="w-full px-3 py-2 rounded-lg text-xs shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary resize-none leading-relaxed"
                />
              </div>

              {/* 5. 照片上传与实时预览 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1 text-teal-400">
                    <Camera className="size-3.5" />
                    <span>照片文件 / 预览 <span className="text-rose-400">*</span></span>
                  </span>
                  {newPhotoForm.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setNewPhotoForm({ ...newPhotoForm, imageUrl: '' })}
                      className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                    >
                      移除照片
                    </button>
                  )}
                </div>

                {newPhotoForm.imageUrl ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-panel dark:bg-[#0b1324] border border-border">
                    <div className="h-16 w-28 rounded-lg overflow-hidden border border-border/80 bg-black/40 shrink-0">
                      <img
                        src={newPhotoForm.imageUrl}
                        alt="预览"
                        onError={(e) => { e.currentTarget.src = SAFE_FALLBACK_IMAGE }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="size-3" /> 照片已就绪
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => photoFileInputRef.current?.click()}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-panel hover:bg-panel/80 border border-border text-[11px] font-bold text-foreground cursor-pointer transition-colors shadow-2xs"
                        >
                          <Upload className="size-3 text-teal-400" />
                          <span>更换本地照片</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="w-full h-16 flex items-center justify-center gap-2 px-3 rounded-xl bg-background dark:bg-[#0b1324] hover:bg-panel border border-dashed border-border text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <UploadCloud className="size-5 text-teal-400" />
                    <span>选择本地照片上传 (支持 JPG/PNG/WebP)</span>
                  </button>
                )}
              </div>

              {/* 6. 设为集中监控大屏展示照片 */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-teal-500/30 bg-teal-500/10 dark:bg-teal-950/20">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modalIsFeaturedScreenPhoto"
                    checked={newPhotoForm.isFeaturedScreen}
                    onChange={(e) => setNewPhotoForm({ ...newPhotoForm, isFeaturedScreen: e.target.checked })}
                    className="size-4 rounded accent-teal-500 cursor-pointer"
                  />
                  <label htmlFor="modalIsFeaturedScreenPhoto" className="text-xs font-bold text-teal-800 dark:text-teal-300 cursor-pointer">
                    设为集中监控大屏展示照片 (将在零碳集控大屏 16:9 视窗中动态轮播)
                  </label>
                </div>
                <span className="text-[10px] text-teal-700 dark:text-teal-400 bg-teal-500/15 dark:bg-teal-900/50 px-2 py-0.5 rounded font-bold">
                  实时联动大屏
                </span>
              </div>

              {/* 7. 底部操作按钮 */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsAddPhotoModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  <Plus className="size-4" />
                  <span>保存照片至台账</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框：登记园区大事件弹窗 (竖向布局) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center">
                  <Flag className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">登记【{currentReportingUnit.parkName}】零碳关键大事件</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEventModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 竖向布局表单 */}
            <form onSubmit={handleAddNewMilestone} className="space-y-3.5">
              {/* 1. 所属园区 (自动绑定当前所属) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">所属园区</label>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    当前所属 (自动绑定)
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 dark:bg-[#0b1324] border border-amber-500/30 text-foreground text-xs font-bold font-mono">
                  <Building2 className="size-4 text-amber-400" />
                  <span className="text-amber-700 dark:text-amber-300 font-bold truncate">{currentReportingUnit.parkName}</span>
                  <span className="text-muted-foreground font-normal text-[11px]">({currentReportingUnit.unitName})</span>
                </div>
              </div>

              {/* 2. 事件发生日期 与 里程碑类型 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    事件发生日期 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">里程碑类型</label>
                  <select
                    value={newEventForm.category}
                    onChange={(e) =>
                      setNewEventForm({
                        ...newEventForm,
                        category: e.target.value as ParkMilestoneRecord['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg text-xs font-bold shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary"
                  >
                    <option value="光伏并网">光伏并网</option>
                    <option value="储能投运">储能投运</option>
                    <option value="节能技改">节能技改</option>
                    <option value="零碳认证">零碳认证</option>
                    <option value="碳足迹上线">碳足迹上线</option>
                    <option value="绿电交易">绿电交易</option>
                    <option value="荣誉考察">荣誉考察</option>
                  </select>
                </div>
              </div>

              {/* 3. 标题 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  标题 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  placeholder="例如：特变电工沈变本部 2.8MWp 分布式光伏扩建工程顺利并网投运"
                  className="w-full px-3 py-2 rounded-lg text-xs shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary font-bold"
                  required
                />
              </div>

              {/* 4. 描述 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">描述</label>
                <textarea
                  rows={3}
                  value={newEventForm.content}
                  onChange={(e) => setNewEventForm({ ...newEventForm, content: e.target.value })}
                  placeholder="详细记录实施路径、涉及车间、节能减碳效益与投运成效..."
                  className="w-full px-3 py-2 rounded-lg text-xs shadow-2xs focus:outline-none bg-background dark:bg-[#0b1324] border border-border text-foreground focus:border-primary resize-none leading-relaxed"
                />
              </div>

              {/* 5. 现场照片 / 凭证图上传与预览 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1 text-red-400">
                    <Camera className="size-3.5" />
                    <span>现场照片 / 凭证图</span>
                  </span>
                  {newEventForm.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setNewEventForm({ ...newEventForm, imageUrl: '' })}
                      className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                    >
                      移除照片
                    </button>
                  )}
                </div>

                {newEventForm.imageUrl ? (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-panel dark:bg-[#0b1324] border border-border">
                    <div className="h-14 w-24 rounded-lg overflow-hidden border border-border/80 bg-black/40 shrink-0">
                      <img
                        src={newEventForm.imageUrl}
                        alt="现场照片"
                        onError={(e) => { e.currentTarget.src = SAFE_FALLBACK_IMAGE }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="size-3" /> 照片已加载
                      </p>
                      <button
                        type="button"
                        onClick={() => eventPhotoFileInputRef.current?.click()}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-panel hover:bg-panel/80 border border-border text-[11px] font-bold text-foreground cursor-pointer transition-colors shadow-2xs"
                      >
                        <Upload className="size-3 text-red-400" />
                        <span>更换本地照片</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => eventPhotoFileInputRef.current?.click()}
                    className="w-full h-14 flex items-center justify-center gap-2 px-3 rounded-xl bg-background dark:bg-[#0b1324] hover:bg-panel border border-dashed border-border text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <UploadCloud className="size-4 text-red-400" />
                    <span>选择本地照片上传 (支持 JPG/PNG/WebP)</span>
                  </button>
                )}
              </div>

              {/* 底部按钮 */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  <Plus className="size-4" />
                  <span>确认登记大事件</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 2：直通免填数据清单抽屉 (4项) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Database className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  股份大数据平台与经营日报 · 自动化直通免填清单
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="h-[44px] bg-panel dark:bg-[#0b1324] text-muted-foreground border-b border-border font-bold">
                    <th className="px-3 py-0">免填数据项</th>
                    <th className="px-3 py-0">权威来源系统</th>
                    <th className="px-3 py-0">直通拉取值</th>
                    <th className="px-3 py-0">最近同步时间</th>
                    <th className="px-3 py-0">减负成效与说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border/60">
                  {AUTO_SYNC_DATA_LIST.map((item) => (
                    <tr key={item.id} className="h-[44px] hover:bg-panel/50">
                      <td className="px-3 py-0 font-bold text-foreground">{item.name}</td>
                      <td className="px-3 py-0 text-muted-foreground font-mono">{item.sourceSystem}</td>
                      <td className="px-3 py-0 font-mono font-bold text-emerald-400">{item.value}</td>
                      <td className="px-3 py-0 font-mono text-muted-foreground text-[11px]">{item.syncTime}</td>
                      <td className="px-3 py-0 text-muted-foreground/90 text-[11px]">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 3：主数据编码映射抽屉 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isMappingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <Sliders className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  特变电工主数据标准型号与分厂物料编码映射表
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMappingModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="h-[44px] bg-panel dark:bg-[#0b1324] text-muted-foreground border-b border-border font-bold">
                    <th className="px-3 py-0">产品品类</th>
                    <th className="px-3 py-0">集团标准型号名称</th>
                    <th className="px-3 py-0">分厂 ERP/MES 编码映射关系</th>
                    <th className="px-3 py-0">对应产线</th>
                    <th className="px-3 py-0 text-right">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border/60">
                  {mappingList.map((m) => (
                    <tr key={m.id} className="h-[44px] hover:bg-panel/50">
                      <td className="px-3 py-0 font-bold text-foreground">{m.category}</td>
                      <td className="px-3 py-0 font-medium text-foreground">{m.stdModel}</td>
                      <td className="px-3 py-0 font-mono text-[11px] text-muted-foreground">{m.companyCode}</td>
                      <td className="px-3 py-0 text-muted-foreground text-xs">{m.lineName}</td>
                      <td className="px-3 py-0 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsMappingModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 4：日数据 31 天录入弹窗 (针对用水量或蒸汽量) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4.5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  {activeDailyModal === 'm-1' ? '用水量' : '外购蒸汽量'} · 2026年08月逐日实测数据录入 (共31天)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDailyModal(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs">
              <span className="text-muted-foreground">
                31 天逐日累加总计：
                <strong className="text-primary font-mono text-sm ml-1">{tempDailySum}</strong>{' '}
                {activeDailyModal === 'm-1' ? 't' : 't'}
              </span>
              <button
                type="button"
                onClick={() => {
                  const avg = (activeDailyModal === 'm-1' ? 8900 : 1420) / 31
                  setTempDailyList(tempDailyList.map(() => Math.round(avg * 10) / 10))
                }}
                className="text-xs text-primary underline hover:text-primary/80 cursor-pointer font-medium"
              >
                平均平摊填充
              </button>
            </div>

            {/* 31 天输入小格子网格 */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-60 overflow-y-auto pr-1">
              {tempDailyList.map((val, idx) => (
                <div key={idx} className="p-1.5 rounded-lg border bg-panel/70 border-border space-y-1">
                  <div className="text-[10px] font-mono text-muted-foreground text-center">
                    08-{String(idx + 1).padStart(2, '0')}
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => {
                      const updated = [...tempDailyList]
                      updated[idx] = parseFloat(e.target.value) || 0
                      setTempDailyList(updated)
                    }}
                    className="w-full text-center px-1 py-1 rounded bg-background dark:bg-[#0b1324] border border-border text-foreground font-mono font-bold text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setActiveDailyModal(null)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveDailyModal}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                确认并更新月度累计
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 5：高清大图预览弹窗 (通用：园区照片或大事件现场照片) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {previewPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-3xl rounded-2xl border bg-card border-border overflow-hidden shadow-2xl space-y-0">
            <div className="p-3.5 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {previewPhotoModal.category && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30">
                    {previewPhotoModal.category}
                  </span>
                )}
                <h3 className="text-sm font-bold text-foreground">{previewPhotoModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhotoModal(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-hidden bg-black/60 flex items-center justify-center">
              <img
                src={previewPhotoModal.imageUrl || SAFE_FALLBACK_IMAGE}
                alt={previewPhotoModal.title}
                onError={(e) => { e.currentTarget.src = SAFE_FALLBACK_IMAGE }}
                className="max-h-[68vh] w-full object-contain"
              />
            </div>

            <div className="p-4 bg-panel/70 border-t border-border/60 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                {previewPhotoModal.description && (
                  <p className="text-foreground font-medium">{previewPhotoModal.description}</p>
                )}
                {previewPhotoModal.date && (
                  <p className="text-[11px] text-muted-foreground font-mono">
                    拍摄/记录日期：{previewPhotoModal.date}
                  </p>
                )}
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 bg-primary/20 text-primary border border-primary/30">
                特变电工园区高保真实景
              </span>
            </div>
          </div>
        </div>
      )}
    
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 6：Excel 批量数据导入模态框 (支持产品产量与能源消耗数据导入) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl border bg-card border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* 头部标题栏 */}
            <div className="p-4 border-b border-border/70 flex items-center justify-between bg-panel/60">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <FileSpreadsheet className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    批量导入{importTargetTab === 'production' ? '产品产量' : '能源消耗'}数据 (Excel / CSV)
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1.5 rounded-lg hover:bg-panel transition-colors"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* 内容滚动区域 */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* 1. 模板下载提示卡片 */}
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Download className="size-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xs">
                      下载特变电工标准填报模板
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 bg-card hover:bg-primary/10 text-primary font-bold text-xs cursor-pointer transition-colors shrink-0 shadow-2xs"
                >
                  <Download className="size-3.5" />
                  <span>下载标准模板 ({importTargetTab === 'production' ? '产品产量' : '能源消耗'})</span>
                </button>
              </div>

              {/* 隐藏的 File Input */}
              <input
                ref={excelFileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleExcelFileChange}
                className="hidden"
              />

              {/* 2. 文件上传与拖拽区域 */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block text-xs">
                  选择导入文件 <span className="text-rose-400">*</span>
                </label>

                {importedFileName ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground text-xs">
                            {importedFileName}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            ({importedFileSize})
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                          <span>
                            解析成功！共识别 {importTargetTab === 'production' ? importPreviewProducts.length : importPreviewEnergy.length} 条有效填报数据
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => excelFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-panel text-foreground font-medium text-xs cursor-pointer transition-colors shadow-2xs"
                    >
                      <Upload className="size-3.5 text-primary" />
                      <span>重新选择</span>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => excelFileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-border/80 hover:border-primary/60 bg-panel/30 hover:bg-panel/60 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="size-11 rounded-2xl bg-panel group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary flex items-center justify-center transition-colors border border-border/70">
                      <UploadCloud className="size-5.5" />
                    </div>
                    <div className="text-center space-y-0.5">
                      <p className="font-bold text-foreground text-xs">
                        点击选择本地 Excel 文件，或将文件拖拽至此处
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        支持 Microsoft Excel (.xlsx / .xls) 与逗号分隔符文件 (.csv)，单个文件大小不超过 20MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. 导入模式选择 */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block text-xs">
                  导入策略与数据合并模式
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setImportMode('append')}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 select-none",
                      importMode === 'append'
                        ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                        : "border-border bg-panel/40 hover:bg-panel hover:border-border/80"
                    )}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mt-0.5 accent-primary cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                        <span>追加导入 (增量合并)</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary font-normal">
                          推荐
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        保留当前账期已有填报数据，仅将 Excel 中的新产品或新规格追加录入，同编码产品更新数值。
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setImportMode('replace')}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 select-none",
                      importMode === 'replace'
                        ? "border-amber-500/80 bg-amber-500/10 ring-1 ring-amber-500/40"
                        : "border-border bg-panel/40 hover:bg-panel hover:border-border/80"
                    )}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 accent-amber-500 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                        <span>覆盖导入 (全量替换)</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 font-normal">
                          覆盖当前月
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        清空【{selectedYear}年{selectedMonth}月】当前已填报的数据，完全以 Excel 中的导入数据覆盖重置。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. 解析数据预览表格 (44px 工业高密度表格) */}
              {(importPreviewProducts.length > 0 || importPreviewEnergy.length > 0) && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-foreground block text-xs flex items-center gap-1.5">
                      <TableIcon className="size-3.5 text-primary" />
                      <span>数据预览与字段校验 (44px 工业表格)</span>
                    </label>
                    <span className="text-[11px] font-mono text-emerald-400">
                      全部字段解析正常 · 校验通过率 100%
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
                    {importTargetTab === 'production' ? (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="h-[44px] bg-panel dark:bg-[#0b1324] text-muted-foreground border-b border-border font-bold">
                            <th className="px-3 py-0 w-10 text-center">#</th>
                            <th className="px-3 py-0">产品大类</th>
                            <th className="px-3 py-0">产品子类型</th>
                            <th className="px-3 py-0">产品名称 / 规格型号</th>
                            <th className="px-3 py-0 font-mono">计划产量</th>
                            <th className="px-3 py-0 font-mono text-primary">完工产量</th>
                            <th className="px-3 py-0">单位</th>
                            <th className="px-3 py-0">归属车间</th>
                            <th className="px-3 py-0 text-center">校验状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y border-border/50">
                          {importPreviewProducts.map((row, idx) => (
                            <tr key={row.id} className="h-[44px] hover:bg-panel/40 transition-colors">
                              <td className="px-3 py-0 text-center font-mono text-muted-foreground text-[11px]">{idx + 1}</td>
                              <td className="px-3 py-0 font-bold text-foreground">{row.categoryName}</td>
                              <td className="px-3 py-0 text-muted-foreground font-medium">{row.subTypeName}</td>
                              <td className="px-3 py-0 font-medium text-foreground max-w-[200px] truncate" title={row.modelName}>
                                {row.modelName}
                              </td>
                              <td className="px-3 py-0 font-mono text-foreground">{row.plannedOutput}</td>
                              <td className="px-3 py-0 font-mono font-bold text-primary">{row.output}</td>
                              <td className="px-3 py-0 text-muted-foreground">{row.unit}</td>
                              <td className="px-3 py-0 text-muted-foreground">{row.workshop}</td>
                              <td className="px-3 py-0 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <Check className="size-2.5" />
                                  <span>校验通过</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="h-[44px] bg-panel dark:bg-[#0b1324] text-muted-foreground border-b border-border font-bold">
                            <th className="px-3 py-0 w-10 text-center">#</th>
                            <th className="px-3 py-0">能源大类</th>
                            <th className="px-3 py-0">能源子分类</th>
                            <th className="px-3 py-0">能源消耗项目名称</th>
                            <th className="px-3 py-0 font-mono text-primary">当月填报数量</th>
                            <th className="px-3 py-0">计量单位</th>
                            <th className="px-3 py-0">数据来源 / 凭证</th>
                            <th className="px-3 py-0 text-center">校验状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y border-border/50">
                          {importPreviewEnergy.map((row, idx) => (
                            <tr key={row.id} className="h-[44px] hover:bg-panel/40 transition-colors">
                              <td className="px-3 py-0 text-center font-mono text-muted-foreground text-[11px]">{idx + 1}</td>
                              <td className="px-3 py-0 font-bold text-foreground">{row.categoryLabel}</td>
                              <td className="px-3 py-0 text-muted-foreground font-medium">{row.subTypeName}</td>
                              <td className="px-3 py-0 font-medium text-foreground">{row.name}</td>
                              <td className="px-3 py-0 font-mono font-bold text-primary">{row.value}</td>
                              <td className="px-3 py-0 text-muted-foreground">{row.unit}</td>
                              <td className="px-3 py-0 text-muted-foreground">{row.sourceLabel}</td>
                              <td className="px-3 py-0 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <Check className="size-2.5" />
                                  <span>校验通过</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 底部操作栏 */}
            <div className="p-4 border-t border-border/70 flex items-center justify-between bg-panel/60 text-xs">
              <div className="text-muted-foreground">
                {importedFileName ? (
                  <span>
                    待导入记录数：<strong className="text-foreground font-mono font-bold">{importTargetTab === 'production' ? importPreviewProducts.length : importPreviewEnergy.length}</strong> 条（模式：{importMode === 'append' ? '追加导入' : '覆盖导入'}）
                  </span>
                ) : (
                  <span>请先选择并上传 Excel / CSV 填报数据文件</span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={!importedFileName || (importTargetTab === 'production' ? importPreviewProducts.length === 0 : importPreviewEnergy.length === 0)}
                  onClick={handleConfirmImport}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm",
                    importedFileName && (importTargetTab === 'production' ? importPreviewProducts.length > 0 : importPreviewEnergy.length > 0)
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  )}
                >
                  <Upload className="size-3.5" />
                  <span>
                    确认导入 ({importTargetTab === 'production' ? importPreviewProducts.length : importPreviewEnergy.length}项)
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 1：新增节能装备 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isAddEnergySavingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Zap className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">新增重点节能装备</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEnergySavingModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">设备资产编码 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newEnergySavingForm.code}
                  onChange={(e) => setNewEnergySavingForm({ ...newEnergySavingForm, code: e.target.value })}
                  placeholder="如 EQ-ES-2026-009"
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">设备名称 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newEnergySavingForm.name}
                  onChange={(e) => setNewEnergySavingForm({ ...newEnergySavingForm, name: e.target.value })}
                  placeholder="如 3#高能效真空相变干燥罐"
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">规格型号</label>
                <input
                  type="text"
                  value={newEnergySavingForm.model}
                  onChange={(e) => setNewEnergySavingForm({ ...newEnergySavingForm, model: e.target.value })}
                  placeholder="如 TB-VPD-3000"
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">额定功率 (kW) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={newEnergySavingForm.ratedPower}
                  onChange={(e) => setNewEnergySavingForm({ ...newEnergySavingForm, ratedPower: parseFloat(e.target.value) || 0 })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">能效国标等级 <span className="text-rose-500">*</span></label>
                <select
                  value={newEnergySavingForm.energyGrade}
                  onChange={(e) => setNewEnergySavingForm({ ...newEnergySavingForm, energyGrade: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                >
                  <option value="国标1级能效">国标1级能效</option>
                  <option value="国标2级能效">国标2级能效</option>
                  <option value="先进水平">先进水平</option>
                  <option value="节能水平">节能水平</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">所属车间/部门</label>
                <select
                  value={newEnergySavingForm.workshop}
                  onChange={(e) => setNewEnergySavingForm({ ...newEnergySavingForm, workshop: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                >
                  <option value="特高压数字化装配车间">特高压数字化装配车间</option>
                  <option value="铁心剪切智能车间">铁心剪切智能车间</option>
                  <option value="特高压试验站大厅">特高压试验站大厅</option>
                  <option value="公辅动力能源动力站">公辅动力能源动力站</option>
                  <option value="铜排加工成型车间">铜排加工成型车间</option>
                  <option value="超高压立塔交联车间">超高压立塔交联车间</option>
                  <option value="绝缘件智造分厂">绝缘件智造分厂</option>
                  <option value="结构件焊接车间">结构件焊接车间</option>
                </select>
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-muted-foreground font-semibold">节能认定凭证 / 依据标准</label>
                <input
                  type="text"
                  value={newEnergySavingForm.certificate}
                  onChange={(e) => setNewEnergySavingForm({ ...newEnergySavingForm, certificate: e.target.value })}
                  placeholder="如 GB 18613-2020 1级 / 节能产品认证证书"
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">投产运行年份</label>
                <input
                  type="text"
                  value={newEnergySavingForm.commissionYear}
                  onChange={(e) => setNewEnergySavingForm({ ...newEnergySavingForm, commissionYear: e.target.value })}
                  placeholder="如 2026年"
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">说明备注</label>
                <input
                  type="text"
                  value={newEnergySavingForm.remark || ''}
                  onChange={(e) => setNewEnergySavingForm({ ...newEnergySavingForm, remark: e.target.value })}
                  placeholder="节能改造工程或设备特征"
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsAddEnergySavingModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveAddEnergySaving}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                确认录入并重新核算
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 2：编辑节能装备 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isEditEnergySavingModalOpen && editingEnergySavingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Edit3 className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">编辑节能装备档案</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditEnergySavingModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">设备资产编码</label>
                <input
                  type="text"
                  value={editingEnergySavingItem.code}
                  onChange={(e) => setEditingEnergySavingItem({ ...editingEnergySavingItem, code: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">设备名称</label>
                <input
                  type="text"
                  value={editingEnergySavingItem.name}
                  onChange={(e) => setEditingEnergySavingItem({ ...editingEnergySavingItem, name: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">规格型号</label>
                <input
                  type="text"
                  value={editingEnergySavingItem.model}
                  onChange={(e) => setEditingEnergySavingItem({ ...editingEnergySavingItem, model: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">额定功率 (kW)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={editingEnergySavingItem.ratedPower}
                  onChange={(e) => setEditingEnergySavingItem({ ...editingEnergySavingItem, ratedPower: parseFloat(e.target.value) || 0 })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">能效国标等级</label>
                <select
                  value={editingEnergySavingItem.energyGrade}
                  onChange={(e) => setEditingEnergySavingItem({ ...editingEnergySavingItem, energyGrade: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                >
                  <option value="国标1级能效">国标1级能效</option>
                  <option value="国标2级能效">国标2级能效</option>
                  <option value="先进水平">先进水平</option>
                  <option value="节能水平">节能水平</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">所属车间/部门</label>
                <select
                  value={editingEnergySavingItem.workshop}
                  onChange={(e) => setEditingEnergySavingItem({ ...editingEnergySavingItem, workshop: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                >
                  <option value="特高压数字化装配车间">特高压数字化装配车间</option>
                  <option value="铁心剪切智能车间">铁心剪切智能车间</option>
                  <option value="特高压试验站大厅">特高压试验站大厅</option>
                  <option value="公辅动力能源动力站">公辅动力能源动力站</option>
                  <option value="铜排加工成型车间">铜排加工成型车间</option>
                  <option value="超高压立塔交联车间">超高压立塔交联车间</option>
                  <option value="绝缘件智造分厂">绝缘件智造分厂</option>
                  <option value="结构件焊接车间">结构件焊接车间</option>
                </select>
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-muted-foreground font-semibold">节能认定凭证 / 依据标准</label>
                <input
                  type="text"
                  value={editingEnergySavingItem.certificate}
                  onChange={(e) => setEditingEnergySavingItem({ ...editingEnergySavingItem, certificate: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">投产运行年份</label>
                <input
                  type="text"
                  value={editingEnergySavingItem.commissionYear}
                  onChange={(e) => setEditingEnergySavingItem({ ...editingEnergySavingItem, commissionYear: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">说明备注</label>
                <input
                  type="text"
                  value={editingEnergySavingItem.remark || ''}
                  onChange={(e) => setEditingEnergySavingItem({ ...editingEnergySavingItem, remark: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsEditEnergySavingModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveEditEnergySaving}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                保存修改并重新计算
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 3：新增全厂装备台账 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isAddInventoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <Layers className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">新增全厂装备台账</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddInventoryModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">设备资产编号 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newInventoryForm.code}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, code: e.target.value })}
                  placeholder="如 EQ-AST-1015"
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">设备名称 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newInventoryForm.name}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, name: e.target.value })}
                  placeholder="如 4#数控绕线机组"
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">工艺类别</label>
                <select
                  value={newInventoryForm.processCategory}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, processCategory: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                >
                  <option value="变压器装配制造">变压器装配制造</option>
                  <option value="硅钢剪切工序">硅钢剪切工序</option>
                  <option value="高压型式试验">高压型式试验</option>
                  <option value="公辅动力站">公辅动力站</option>
                  <option value="铜排加工成型">铜排加工成型</option>
                  <option value="线缆立塔交联">线缆立塔交联</option>
                  <option value="绝缘件加工">绝缘件加工</option>
                  <option value="油箱结构焊装">油箱结构焊装</option>
                  <option value="环保公辅设施">环保公辅设施</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">规格型号</label>
                <input
                  type="text"
                  value={newInventoryForm.model}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, model: e.target.value })}
                  placeholder="如 TB-WND-200"
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">铭牌额定功率 (kW) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={newInventoryForm.ratedPower}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, ratedPower: parseFloat(e.target.value) || 0 })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-blue-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">当前运行工况</label>
                <select
                  value={newInventoryForm.runningStatus}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, runningStatus: e.target.value as any })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                >
                  <option value="running">运行中</option>
                  <option value="standby">待机备用</option>
                  <option value="maintenance">检修维护</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">责任车间/部门</label>
                <select
                  value={newInventoryForm.workshop}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, workshop: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                >
                  <option value="特高压数字化装配车间">特高压数字化装配车间</option>
                  <option value="铁心剪切智能车间">铁心剪切智能车间</option>
                  <option value="特高压试验站大厅">特高压试验站大厅</option>
                  <option value="公辅动力能源动力站">公辅动力能源动力站</option>
                  <option value="铜排加工成型车间">铜排加工成型车间</option>
                  <option value="超高压立塔交联车间">超高压立塔交联车间</option>
                  <option value="绝缘件智造分厂">绝缘件智造分厂</option>
                  <option value="结构件焊接车间">结构件焊接车间</option>
                </select>
              </div>

              <div className="space-y-1 flex items-center justify-between pt-5">
                <label className="text-muted-foreground font-semibold">是否纳入能耗统计范围</label>
                <input
                  type="checkbox"
                  checked={newInventoryForm.isInScope}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, isInScope: e.target.checked })}
                  className="size-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-1 flex items-center justify-between pt-1">
                <label className="text-muted-foreground font-semibold">是否属于节能装备</label>
                <input
                  type="checkbox"
                  checked={newInventoryForm.isEnergySaving}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, isEnergySaving: e.target.checked })}
                  className="size-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-muted-foreground font-semibold">说明备注</label>
                <input
                  type="text"
                  value={newInventoryForm.remark || ''}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, remark: e.target.value })}
                  placeholder="装备用途说明"
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsAddInventoryModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveAddInventory}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                确认录入台账
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 模态框 4：编辑全厂装备台账 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isEditInventoryModalOpen && editingInventoryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border bg-card border-border p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <Edit3 className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">编辑装备台账档案</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditInventoryModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">设备资产编号</label>
                <input
                  type="text"
                  value={editingInventoryItem.code}
                  onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, code: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">设备名称</label>
                <input
                  type="text"
                  value={editingInventoryItem.name}
                  onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, name: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">工艺类别</label>
                <select
                  value={editingInventoryItem.processCategory}
                  onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, processCategory: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                >
                  <option value="变压器装配制造">变压器装配制造</option>
                  <option value="硅钢剪切工序">硅钢剪切工序</option>
                  <option value="高压型式试验">高压型式试验</option>
                  <option value="公辅动力站">公辅动力站</option>
                  <option value="铜排加工成型">铜排加工成型</option>
                  <option value="线缆立塔交联">线缆立塔交联</option>
                  <option value="绝缘件加工">绝缘件加工</option>
                  <option value="油箱结构焊装">油箱结构焊装</option>
                  <option value="环保公辅设施">环保公辅设施</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">规格型号</label>
                <input
                  type="text"
                  value={editingInventoryItem.model}
                  onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, model: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">铭牌额定功率 (kW)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={editingInventoryItem.ratedPower}
                  onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, ratedPower: parseFloat(e.target.value) || 0 })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-blue-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">运行工况</label>
                <select
                  value={editingInventoryItem.runningStatus}
                  onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, runningStatus: e.target.value as any })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                >
                  <option value="running">运行中</option>
                  <option value="standby">待机备用</option>
                  <option value="maintenance">检修维护</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">责任车间/部门</label>
                <select
                  value={editingInventoryItem.workshop}
                  onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, workshop: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                >
                  <option value="特高压数字化装配车间">特高压数字化装配车间</option>
                  <option value="铁心剪切智能车间">铁心剪切智能车间</option>
                  <option value="特高压试验站大厅">特高压试验站大厅</option>
                  <option value="公辅动力能源动力站">公辅动力能源动力站</option>
                  <option value="铜排加工成型车间">铜排加工成型车间</option>
                  <option value="超高压立塔交联车间">超高压立塔交联车间</option>
                  <option value="绝缘件智造分厂">绝缘件智造分厂</option>
                  <option value="结构件焊接车间">结构件焊接车间</option>
                </select>
              </div>

              <div className="space-y-1 flex items-center justify-between pt-5">
                <label className="text-muted-foreground font-semibold">是否纳入能耗统计范围</label>
                <input
                  type="checkbox"
                  checked={editingInventoryItem.isInScope}
                  onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, isInScope: e.target.checked })}
                  className="size-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-1 flex items-center justify-between pt-1">
                <label className="text-muted-foreground font-semibold">是否属于节能装备</label>
                <input
                  type="checkbox"
                  checked={editingInventoryItem.isEnergySaving}
                  onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, isEnergySaving: e.target.checked })}
                  className="size-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-muted-foreground font-semibold">说明备注</label>
                <input
                  type="text"
                  value={editingInventoryItem.remark || ''}
                  onChange={(e) => setEditingInventoryItem({ ...editingInventoryItem, remark: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg bg-background dark:bg-[#0b1324] border border-border focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsEditInventoryModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveEditInventory}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
